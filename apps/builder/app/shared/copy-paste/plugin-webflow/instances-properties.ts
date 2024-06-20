import { nanoid } from "nanoid";
import type { Instance, Prop, WebstudioFragment } from "@webstudio-is/sdk";
import type { WfElementNode, WfNode } from "./schema";
import { getComponentTemplateData } from "~/shared/instance-utils";

const toFragment = (
  wfNode: WfElementNode,
  instanceId: Instance["id"],
  wfNodes: Map<WfNode["_id"], WfNode>
): WebstudioFragment | undefined => {
  const fragment: WebstudioFragment = {
    children: [],
    instances: [],
    props: [],
    dataSources: [],
    styleSourceSelections: [],
    styleSources: [],
    styles: [],
    assets: [],
    breakpoints: [],
    resources: [],
  };
  const component = wfNode.type;

  const addProp = (
    name: Prop["name"],
    value: Prop["value"],
    type: Prop["type"] = "string"
  ) => {
    const prop = { id: nanoid(), instanceId };

    if (type === "string" && typeof value === "string") {
      fragment.props.push({
        ...prop,
        type,
        name,
        value,
      });
      return;
    }
    if (type === "number" && typeof value === "number") {
      fragment.props.push({
        ...prop,
        type,
        name,
        value,
      });
      return;
    }

    if (type === "boolean" && typeof value === "boolean") {
      fragment.props.push({
        ...prop,
        type,
        name,
        value,
      });
      return;
    }
  };

  const addInstance = (
    component: Instance["component"],
    children: Instance["children"] = []
  ) => {
    fragment.instances.push({
      id: instanceId,
      type: "instance",
      component,
      children,
    });
  };

  if (wfNode.data?.attr?.id) {
    addProp("id", wfNode.data.attr.id);
  }

  switch (component) {
    case "Heading": {
      addProp("tag", wfNode.tag);
      addInstance(component);
      return fragment;
    }
    case "List":
    case "ListItem":
    case "Paragraph":
    case "Superscript":
    case "Subscript":
    case "Blockquote": {
      addInstance(component);
      return fragment;
    }
    case "Block": {
      const component = wfNode.data?.text ? "Text" : "Box";
      addInstance(component);
      return fragment;
    }
    case "Link": {
      const data = wfNode.data;

      addProp("href", data.link.url);
      addProp("target", data.link.target);
      addInstance(component);
      return fragment;
    }
    case "Section": {
      const component = "Box";
      addProp("tag", wfNode.tag);
      addInstance(component);
      return fragment;
    }
    case "RichText": {
      const component = "Box";
      addInstance(component);
      return fragment;
    }
    case "Strong": {
      const component = "Bold";
      addInstance(component);
      return fragment;
    }
    case "Emphasized": {
      const component = "Italic";
      addInstance(component);
      return fragment;
    }
    case "BlockContainer": {
      const component = "Box";
      addInstance(component);
      return fragment;
    }
    case "Layout": {
      const component = "Box";
      addInstance(component);
      return fragment;
    }
    case "Cell": {
      const component = "Box";
      addInstance(component);
      return fragment;
    }
    case "VFlex": {
      const component = "Box";
      addInstance(component);
      return fragment;
    }
    case "HFlex": {
      const component = "Box";
      addInstance(component);
      return fragment;
    }
    case "Grid": {
      const component = "Box";
      addInstance(component);
      return fragment;
    }
    case "Row": {
      const component = "Box";
      addInstance(component);
      return fragment;
    }
    case "Column": {
      const component = "Box";
      addInstance(component);
      return fragment;
    }
    case "CodeBlock": {
      const component = "CodeText";
      const data = wfNode.data;
      addProp("lang", data.language);
      addProp("code", data.code);
      addInstance(component);
      return fragment;
    }
    case "HtmlEmbed": {
      addProp("code", wfNode.v);
      addProp("clientOnly", true, "boolean");
      addInstance(component);
      return fragment;
    }
    case "Image": {
      const data = wfNode.data;

      if (
        data.attr.alt &&
        // This is how they tell it when alt comes from image meta during publishing
        data.attr.alt !== "__wf_reserved_inherit" &&
        // This is how they tell it to use alt="", which is our default anyways
        data.attr.alt !== "__wf_reserved_decorative"
      ) {
        addProp("alt", data.attr.alt);
      }

      if (data.attr.loading === "eager" || data.attr.loading === "lazy") {
        addProp("loading", data.attr.loading);
      }

      if (data.attr.width && data.attr.width !== "auto") {
        addProp("width", data.attr.width);
      }

      if (data.attr.height && data.attr.height !== "auto") {
        addProp("height", data.attr.height);
      }
      if (data.attr.src) {
        addProp("src", data.attr.src);
      }
      addInstance(component);
      return fragment;
    }
    case "FormWrapper": {
      const component = "Form";
      addInstance(component);
      return fragment;
    }
    case "FormForm": {
      const component = "FormContent";
      addInstance(component);
      return fragment;
    }
    case "FormSuccessMessage": {
      const component = "SuccessMessage";
      addInstance(component);
      return fragment;
    }
    case "FormErrorMessage": {
      const component = "ErrorMessage";
      addInstance(component);
      return fragment;
    }
    case "FormButton": {
      const component = "Button";
      const data = wfNode.data;
      addInstance(component, [
        {
          type: "text" as const,
          value: data.attr.value,
        },
      ]);
      return fragment;
    }
    case "FormTextInput": {
      const data = wfNode.data;
      const component = "Input";
      addProp("name", data.attr.name);
      addProp("maxLength", data.attr.maxlength, "number");
      addProp("placeholder", data.attr.placeholder);
      addProp("disabled", data.attr.disabled, "boolean");
      addProp("type", data.attr.type);
      addProp("required", data.attr.required, "boolean");
      addProp("autoFocus", data.attr.autofocus, "boolean");
      addInstance(component);
      return fragment;
    }
    case "FormBlockLabel": {
      const data = wfNode.data;
      const component = "Label";
      addProp("htmlFor", data.attr.for);
      addInstance(component);
      return fragment;
    }
  }

  (component) satisfies never;
};

const addCustomAttributes = (
  wfNode: WfElementNode,
  instanceId: Instance["id"],
  props: Array<Prop>
) => {
  if (wfNode.data?.xattr) {
    for (const attribute of wfNode.data.xattr) {
      props.push({
        type: "string",
        id: nanoid(),
        instanceId,
        name: attribute.name,
        value: attribute.value,
      });
    }
  }
};

export const addInstanceAndProperties = (
  wfNode: WfNode,
  added: Map<WfNode["_id"], Instance["id"]>,
  wfNodes: Map<WfNode["_id"], WfNode>,
  fragment: WebstudioFragment
) => {
  if (added.has(wfNode._id) || "text" in wfNode || "type" in wfNode === false) {
    return;
  }
  const children: Instance["children"] = [];
  const instanceId = nanoid();
  for (const wfChildId of wfNode.children) {
    const wfChildNode = wfNodes.get(wfChildId);
    if (wfChildNode === undefined) {
      continue;
    }
    if ("text" in wfChildNode) {
      children.push({
        type: "text",
        value: wfChildNode.v,
      });
      added.set(wfChildId, instanceId);
      continue;
    }

    const childInstanceId = addInstanceAndProperties(
      wfChildNode,
      added,
      wfNodes,
      fragment
    );
    if (childInstanceId !== undefined) {
      children.push({
        type: "id",
        value: childInstanceId,
      });
    }
  }

  const nextFragment = toFragment(wfNode, instanceId, wfNodes);

  if (nextFragment === undefined) {
    return;
  }

  fragment.instances.push(...nextFragment.instances);
  fragment.props.push(...nextFragment.props);
  const instance = fragment.instances.find(
    (instance) => instance.id === instanceId
  );

  if (instance === undefined) {
    return;
  }
  instance.children.push(...children);
  added.set(wfNode._id, instanceId);
  addCustomAttributes(wfNode, instanceId, fragment.props);

  return instanceId;
};
