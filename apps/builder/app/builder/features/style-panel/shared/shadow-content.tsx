import {
  toValue,
  type InvalidValue,
  type LayersValue,
  type RgbValue,
  type StyleValue,
  type TupleValue,
  type UnitValue,
} from "@webstudio-is/css-engine";
import {
  extractShadowProperties,
  propertySyntaxes,
  type ExtractedShadowProperties,
} from "@webstudio-is/css-data";
import {
  Flex,
  Grid,
  Label,
  Separator,
  TextArea,
  textVariants,
  theme,
  ToggleGroup,
  ToggleGroupButton,
  Tooltip,
} from "@webstudio-is/design-system";
import { ShadowInsetIcon, ShadowNormalIcon } from "@webstudio-is/icons";
import { useMemo, useState } from "react";
import type { IntermediateStyleValue } from "../shared/css-value-input";
import { CssValueInputContainer } from "../shared/css-value-input";
import { toPascalCase } from "../shared/keyword-utils";
import { ColorControl } from "../controls";
import type {
  DeleteProperty,
  SetProperty,
  StyleUpdateOptions,
} from "../shared/use-style-data";
import { parseCssFragment } from "./parse-css-fragment";
import { PropertyInlineLabel } from "../property-label";

/*
  When it comes to checking and validating individual CSS properties for the box-shadow,
  splitting them fails the validation. As it needs a minimum of 2 values to validate.
  Instead, a workaround is to use a fallback CSS property
  that can handle the same values as the input being validated.

  Here's the box-shadow property with its components:

  box-shadow: color, inset, offsetX, offsetY, blur, spread;
  You can check more details from the spec
  https://www.w3.org/TR/css-backgrounds-3/#box-shadow

  offsetX: length, takes positive and negative values.
  offsetY: length, takes positive and negative values.
  blur: length, takes only positive values.
  spread: length, takes both positive and negative values.

  outline-offset: length, takes positive and negative values.
  https://www.w3.org/TR/css-ui-4/#outline-offset

  border-top-width: length, takes only positive values.
  https://www.w3.org/TR/css-backgrounds-3/#propdef-border-top-width
*/

type ShadowContentProps = {
  index: number;
  property: "boxShadow" | "textShadow" | "dropShadow";
  layer: TupleValue;
  propertyValue: string;
  tooltip: JSX.Element;
  onEditLayer: (
    index: number,
    layers: LayersValue,
    options: StyleUpdateOptions
  ) => void;
  deleteProperty: DeleteProperty;
  hideCodeEditor?: boolean;
};

const convertValuesToTupple = (
  values: Partial<Record<keyof ExtractedShadowProperties, StyleValue>>
): TupleValue => {
  return {
    type: "tuple",
    value: (Object.values(values) as Array<StyleValue>).filter(
      (item: StyleValue): item is UnitValue | RgbValue =>
        item !== null && item !== undefined
    ),
  };
};

const boxShadowInsetValues = [
  { value: "normal", Icon: ShadowNormalIcon },
  { value: "inset", Icon: ShadowInsetIcon },
] as const;

const shadowPropertySyntaxes = {
  boxShadow: {
    x: {
      syntax: "box-shadow-offset-x",
      description: propertySyntaxes.boxShadowOffsetX,
    },
    y: {
      syntax: "box-shadow-offset-y",
      description: propertySyntaxes.boxShadowOffsetY,
    },
    blur: {
      syntax: "box-shadow-blur",
      description: propertySyntaxes.boxShadowBlurRadius,
    },
    spread: {
      syntax: "box-shadow-spread",
      description: propertySyntaxes.boxShadowSpreadRadius,
    },
    color: {
      syntax: "box-shadow-color",
      description: propertySyntaxes.boxShadowColor,
    },
    position: {
      syntax: "box-shadow-position",
      description: propertySyntaxes.boxShadowPosition,
    },
  },
  textShadow: {
    x: {
      syntax: "text-shadow-offset-x",
      description: propertySyntaxes.textShadowOffsetX,
    },
    y: {
      syntax: "text-shadow-offset-y",
      description: propertySyntaxes.textShadowOffsetY,
    },
    blur: {
      syntax: "text-shadow-blur",
      description: propertySyntaxes.textShadowBlurRadius,
    },
    color: {
      syntax: "text-shadow-color",
      description: propertySyntaxes.textShadowColor,
    },
  },
  dropShadow: {
    x: {
      syntax: "drop-shadow-offset-x",
      description: propertySyntaxes.dropShadowOffsetX,
    },
    y: {
      syntax: "drop-shadow-offset-y",
      description: propertySyntaxes.dropShadowOffsetY,
    },
    blur: {
      syntax: "drop-shadow-blur",
      description: propertySyntaxes.dropShadowBlurRadius,
    },
    color: {
      syntax: "drop-shadow-color",
      description: propertySyntaxes.dropShadowColor,
    },
  },
} as const;

export const ShadowContent = ({
  layer,
  index,
  property,
  propertyValue,
  tooltip,
  hideCodeEditor = false,
  onEditLayer,
  deleteProperty,
}: ShadowContentProps) => {
  const [intermediateValue, setIntermediateValue] = useState<
    IntermediateStyleValue | InvalidValue | undefined
  >();
  const layerValues = useMemo<ExtractedShadowProperties>(() => {
    setIntermediateValue({ type: "intermediate", value: propertyValue });
    return extractShadowProperties(layer);
  }, [layer, propertyValue]);

  const { offsetX, offsetY, blur, spread, color, inset } = layerValues;
  const colorControlProp = color ?? {
    type: "rgb",
    r: 0,
    g: 0,
    b: 0,
    alpha: 1,
  };

  const handleChange = (value: string) => {
    setIntermediateValue({
      type: "intermediate",
      value,
    });
  };

  const handleComplete = () => {
    if (intermediateValue === undefined) {
      return;
    }
    // dropShadow is a function under the filter property.
    // To parse the value correctly, we need to change the property to textShadow.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/drop-shadow#formal_syntax
    // https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow#formal_syntax
    // Both share a similar syntax but the property name is different.
    const parsed = parseCssFragment(
      intermediateValue.value,
      property === "dropShadow" ? "textShadow" : property
    );
    const parsedValue = parsed.get(
      property === "dropShadow" ? "textShadow" : property
    );
    if (parsedValue?.type === "layers") {
      onEditLayer(index, parsedValue, { isEphemeral: false });
      return;
    }
    setIntermediateValue({
      type: "invalid",
      value: intermediateValue.value,
    });
  };

  const handlePropertyChange = (
    params: Partial<Record<keyof ExtractedShadowProperties, StyleValue>>,
    options: StyleUpdateOptions = { isEphemeral: false }
  ) => {
    const newLayer = convertValuesToTupple({ ...layerValues, ...params });
    setIntermediateValue({
      type: "intermediate",
      value: toValue(newLayer),
    });
    onEditLayer(index, { type: "layers", value: [newLayer] }, options);
  };

  const colorControlCallback: SetProperty = () => {
    return (value, options) => {
      handlePropertyChange({ color: value }, options);
    };
  };

  return (
    <Flex direction="column">
      <Grid
        gap="2"
        css={{
          px: theme.spacing[9],
          marginTop: theme.spacing[5],
          gridTemplateColumns:
            property === "boxShadow" ? "1fr 1fr" : "1fr 1fr 1fr",
        }}
      >
        <Flex direction="column">
          <PropertyInlineLabel
            label="X"
            properties={shadowPropertySyntaxes[property].x.syntax}
            description={shadowPropertySyntaxes[property].x.description}
          />
          <CssValueInputContainer
            key="boxShadowOffsetX"
            // outline-offset is a fake property for validating box-shadow's offsetX.
            property="outlineOffset"
            styleSource="local"
            keywords={[]}
            value={offsetX ?? { type: "unit", value: 0, unit: "px" }}
            setValue={(value, options) =>
              handlePropertyChange({ offsetX: value }, options)
            }
            deleteProperty={() =>
              handlePropertyChange({
                offsetX: offsetX ?? undefined,
              })
            }
          />
        </Flex>

        <Flex direction="column">
          <PropertyInlineLabel
            label="Y"
            properties={shadowPropertySyntaxes[property].y.syntax}
            description={shadowPropertySyntaxes[property].y.description}
          />
          <CssValueInputContainer
            key="boxShadowOffsetY"
            // outline-offset is a fake property for validating box-shadow's offsetY.
            property="outlineOffset"
            styleSource="local"
            keywords={[]}
            value={offsetY ?? { type: "unit", value: 0, unit: "px" }}
            setValue={(value, options) =>
              handlePropertyChange({ offsetY: value }, options)
            }
            deleteProperty={() =>
              handlePropertyChange({
                offsetY: offsetY ?? undefined,
              })
            }
          />
        </Flex>

        <Flex direction="column">
          <PropertyInlineLabel
            label="Blur"
            properties={shadowPropertySyntaxes[property].blur.syntax}
            description={shadowPropertySyntaxes[property].blur.description}
          />
          <CssValueInputContainer
            key="boxShadowBlur"
            // border-top-width is a fake property for validating box-shadow's blur.
            property="borderTopWidth"
            styleSource="local"
            keywords={[]}
            value={blur ?? { type: "unit", value: 0, unit: "px" }}
            setValue={(value, options) =>
              handlePropertyChange({ blur: value }, options)
            }
            deleteProperty={() =>
              handlePropertyChange({
                blur: blur ?? undefined,
              })
            }
          />
        </Flex>

        {property === "boxShadow" ? (
          <Flex direction="column">
            <PropertyInlineLabel
              label="Spread"
              properties={shadowPropertySyntaxes.boxShadow.spread.syntax}
              description={shadowPropertySyntaxes.boxShadow.spread.description}
            />
            <CssValueInputContainer
              key="boxShadowSpread"
              // outline-offset is a fake property for validating box-shadow's spread.
              property="outlineOffset"
              styleSource="local"
              keywords={[]}
              value={spread ?? { type: "unit", value: 0, unit: "px" }}
              setValue={(value, options) =>
                handlePropertyChange({ spread: value }, options)
              }
              deleteProperty={() =>
                handlePropertyChange({
                  spread: spread ?? undefined,
                })
              }
            />
          </Flex>
        ) : null}
      </Grid>

      <Grid
        gap="2"
        css={{
          px: theme.spacing[9],
          marginTop: theme.spacing[5],
          paddingBottom: theme.spacing[5],
          ...(property === "boxShadow" && { gridTemplateColumns: "3fr 1fr" }),
        }}
      >
        <Flex direction="column">
          <PropertyInlineLabel
            label="Color"
            properties={shadowPropertySyntaxes[property].color.syntax}
            description={shadowPropertySyntaxes[property].color.description}
          />
          <ColorControl
            property="color"
            currentStyle={{
              color: {
                value: colorControlProp,
                currentColor: colorControlProp,
              },
            }}
            setProperty={colorControlCallback}
            deleteProperty={() =>
              handlePropertyChange({ color: colorControlProp })
            }
          />
        </Flex>

        {property === "boxShadow" ? (
          <Flex direction="column">
            <PropertyInlineLabel
              label="Inset"
              properties={shadowPropertySyntaxes.boxShadow.position.syntax}
              description={
                shadowPropertySyntaxes.boxShadow.position.description
              }
            />
            <ToggleGroup
              type="single"
              value={inset?.value ?? "normal"}
              defaultValue="inset"
              onValueChange={(value) => {
                if (value === "inset") {
                  handlePropertyChange({
                    inset: { type: "keyword", value: "inset" },
                  });
                } else {
                  handlePropertyChange({ inset: undefined });
                }
              }}
            >
              {boxShadowInsetValues.map(({ value, Icon }) => (
                <Tooltip key={value} content={toPascalCase(value)}>
                  <ToggleGroupButton value={value}>
                    <Icon />
                  </ToggleGroupButton>
                </Tooltip>
              ))}
            </ToggleGroup>
          </Flex>
        ) : null}
      </Grid>

      {hideCodeEditor === false ? (
        <>
          <Separator css={{ gridColumn: "span 2" }} />
          <Flex
            direction="column"
            css={{
              px: theme.spacing[9],
              paddingTop: theme.spacing[5],
              paddingBottom: theme.spacing[9],
              gap: theme.spacing[3],
              minWidth: theme.spacing[30],
            }}
          >
            <Label>
              <Flex align={"center"} gap={1}>
                Code
                {tooltip}
              </Flex>
            </Label>
            <TextArea
              rows={3}
              name="description"
              value={intermediateValue?.value ?? propertyValue ?? ""}
              css={{ minHeight: theme.spacing[14], ...textVariants.mono }}
              color={
                intermediateValue?.type === "invalid" ? "error" : undefined
              }
              onChange={handleChange}
              onBlur={handleComplete}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleComplete();
                  event.preventDefault();
                }

                if (event.key === "Escape" && property !== "dropShadow") {
                  deleteProperty(property, { isEphemeral: true });
                  setIntermediateValue(undefined);
                  event.preventDefault();
                }
              }}
            />
          </Flex>
        </>
      ) : undefined}
    </Flex>
  );
};
