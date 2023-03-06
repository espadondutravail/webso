import {
  TupleValue,
  type StyleValue,
  TupleValueItem,
} from "@webstudio-is/css-data";
import { Flex, Label, PositionGrid, theme } from "@webstudio-is/design-system";
import type { ControlProps } from "../../style-sections";
import { styleConfigByName } from "../../shared/configs";
import { getStyleSource } from "../../shared/style-info";
import { CssValueInputContainer } from "../../shared/css-value-input";
import type { SetValue } from "../../shared/use-style-data";

const toPosition = (value: TupleValue) => {
  return {
    x: value.value[0].value,
    y: value.value[1].value,
  };
};

// @todo SetValue has legacy string value support, that needs to be removed
const toTuple = (
  valueX?: StyleValue | string,
  valueY?: StyleValue | string
) => {
  const parsedValue = TupleValue.safeParse(valueX);
  if (parsedValue.success) {
    return parsedValue.data;
  }

  const parsedValueX = TupleValueItem.parse(valueX);
  const parsedValueY = TupleValueItem.parse(valueY);

  return {
    type: "tuple" as const,
    value: [parsedValueX, parsedValueY ?? parsedValueX],
  };
};

export const Position = ({
  currentStyle,
  property,
  setProperty,
  deleteProperty,
}: ControlProps) => {
  const { label, items } = styleConfigByName[property];
  const styleInfo = currentStyle[property];
  const value = toTuple(styleInfo?.value);
  const styleSource = getStyleSource(styleInfo);
  const keywords = items.map((item) => ({
    type: "keyword" as const,
    value: item.name,
  }));

  const setValue = setProperty(property);

  const setValueX: SetValue = (valueX, options) => {
    const nextValue = toTuple(valueX, value.value[1]);
    setValue(nextValue, options);
  };

  const setValueY: SetValue = (valueY, options) => {
    const nextValue = toTuple(value.value[0], valueY);
    setValue(nextValue, options);
  };

  return (
    <Flex
      direction="column"
      gap="1"
      css={{ px: theme.spacing[9], py: theme.spacing[5] }}
    >
      <Label>Position</Label>
      <Flex gap="6">
        <PositionGrid
          selectedPosition={toPosition(value)}
          onSelect={({ x, y }) => {
            setValue({
              type: "tuple",
              value: [
                { type: "unit", value: x, unit: "%" },
                { type: "unit", value: y, unit: "%" },
              ],
            });
          }}
        />
        <Flex direction="column" justify="between">
          <Flex align="center" gap="2">
            <Label>Left</Label>
            <CssValueInputContainer
              label={label}
              property={property}
              styleSource={styleSource}
              keywords={keywords}
              value={value.value[0]}
              setValue={setValueX}
              deleteProperty={deleteProperty}
            />
          </Flex>
          <Flex align="center" gap="2">
            <Label>Top</Label>
            <CssValueInputContainer
              label={label}
              property={property}
              styleSource={styleSource}
              keywords={keywords}
              value={value.value[1]}
              setValue={setValueY}
              deleteProperty={deleteProperty}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
