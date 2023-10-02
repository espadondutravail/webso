import { z } from "zod";
import store from "immerhin";
import untruncateJson from "untruncate-json";
import { copywriter, requestStream } from "@webstudio-is/ai";
import { restAiCopy } from "~/shared/router-utils";
import {
  Button,
  Flex,
  InputField,
  Label,
  Text,
} from "@webstudio-is/design-system";
import {
  instancesStore,
  projectStore,
  selectedInstanceStore,
} from "~/shared/nano-states";
import { useStore } from "@nanostores/react";
import { useRef, useState } from "react";
import { computed } from "nanostores";
import { VoiceRecorder } from "./voice-recorder";

const patchTextInstance = (textInstance: copywriter.TextInstance) => {
  store.createTransaction([instancesStore], (instances) => {
    const currentInstance = instances.get(textInstance.instanceId);

    if (
      currentInstance === undefined ||
      currentInstance.children.length === 0
    ) {
      return;
    }

    // Instances can have a number of text child nodes without interleaving components.
    // When this is the case we treat the child nodes as a single text node,
    // otherwise the AI would generate children.length chunks of separate text.
    // We can identify this case of "joint" text instances when the index is -1.
    const replaceAll = textInstance.index === -1;
    if (replaceAll) {
      if (currentInstance.children.every((child) => child.type === "text")) {
        currentInstance.children = [{ type: "text", value: textInstance.text }];
      }
      return;
    }

    if (currentInstance.children[textInstance.index].type === "text") {
      currentInstance.children[textInstance.index].value = textInstance.text;
    }
  });
};

const onChunk = (completion: string) => {
  try {
    const jsonResponse = z
      .array(copywriter.TextInstanceSchema)
      .parse(JSON.parse(untruncateJson(completion)));

    const currenTextInstance = jsonResponse.pop();

    if (currenTextInstance === undefined) {
      return;
    }

    patchTextInstance(currenTextInstance);
  } catch (error) {
    /**/
  }
};

export const Copywriter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const promptRef = useRef<HTMLInputElement>(null);
  const project = useStore(projectStore);

  const send = (formData: FormData) => {
    const prompt = formData.get("prompt");
    const projectId = formData.get("projectId");
    const textInstances = formData.get("textInstances");

    if (
      typeof prompt !== "string" ||
      typeof projectId !== "string" ||
      typeof textInstances !== "string"
    ) {
      return;
    }
    // @todo abort also on unmount
    abort.current = new AbortController();
    setIsLoading(true);
    requestStream(
      [
        restAiCopy(),
        {
          method: "POST",
          body: JSON.stringify({
            prompt,
            projectId,
            textInstances: JSON.parse(textInstances),
          }),
          signal: abort.current.signal,
        },
      ],
      {
        onChunk,
      }
    ).then((result) => {
      abort.current = null;
      if (typeof result !== "string") {
        alert("Error " + result.type);
      }
      setIsLoading(false);
    });
  };

  const textInstances = computed(
    [instancesStore, selectedInstanceStore],
    (instances, selectedInstance) => {
      if (selectedInstance) {
        return copywriter
          .collectTextInstances({
            instances: instancesStore.get(),
            rootInstanceId: selectedInstance.id,
          })
          .map((instance) => {
            if (instance.text === "Text you can edit") {
              instance.text = "";
            }

            return instance;
          });
      }
      return [];
    }
  );

  const textInstancesCount = textInstances.get().length;

  return (
    <Flex gap="2" direction="column">
      <Text>
        Generate copy for all the text nodes contained in the selected instance.
        Found{" "}
        <Text css={{ fontWeight: "bold", display: "inline" }}>
          {textInstancesCount}
        </Text>{" "}
        text instances.
      </Text>
      <Flex align="center" gap="1">
        <VoiceRecorder
          projectId={project?.id}
          onText={(text) => {
            if (promptRef.current && formRef.current) {
              promptRef.current.value = text;
              const formData = new FormData(formRef.current ?? undefined);
              send(formData);
            }
          }}
        />
      </Flex>
      {textInstancesCount > 0 ? (
        <>
          <form
            ref={formRef}
            onSubmit={(event) => {
              event.preventDefault();

              if (isLoading) {
                return;
              }
              const formData = new FormData(event.currentTarget);
              send(formData);
            }}
          >
            <Label>
              Instructions
              <InputField
                type="text"
                placeholder=""
                name="prompt"
                inputRef={promptRef}
                maxLength={1200}
              />
            </Label>

            <input type="hidden" name="projectId" value={project?.id} />
            <input
              type="hidden"
              name="textInstances"
              value={JSON.stringify(textInstances.get())}
            />

            <Button type="submit" disabled={isLoading}>
              Generate Copy
            </Button>
            {isLoading ? (
              <Button
                onClick={() => {
                  abort.current?.abort();
                }}
              >
                Stop
              </Button>
            ) : null}
          </form>
        </>
      ) : null}
    </Flex>
  );
};
