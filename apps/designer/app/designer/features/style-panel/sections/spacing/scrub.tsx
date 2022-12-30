import type { StyleValue, UnitValue } from "@webstudio-is/css-data";
import { numericScrubControl } from "@webstudio-is/design-system";
import { useState, useEffect, useRef } from "react";
import { useModifierKeys } from "../../shared/modifier-keys";
import type { StyleUpdateOptions } from "../../shared/use-style-data";
import type { SpacingStyleProperty, HoverTagret } from "./types";

type Values = Partial<Record<SpacingStyleProperty, StyleValue>>;

type ScrubStatus = {
  isActive: boolean;

  // Properties that should be affected on the next pointer move.
  // We keep track of these properties even when scrub is not active.
  properties: SpacingStyleProperty[];

  // When scrub is active, this contains ephemeral values for all properties
  // that have been affected during current scrub.
  //
  // Note that Object.keys(values) != properties above,
  // because user can press and release modifier keys multiple times during scrub.
  values: Values;
};

export const useScrub = (props: {
  value?: StyleValue;
  target: HoverTagret | undefined;
  onChange: (values: Values, options: StyleUpdateOptions) => void;
}): ScrubStatus => {
  // we want to hold on to the target while scrub is active even if hover changes
  const [activeTarget, setActiveTarget] = useState<HoverTagret>();
  const finalTarget = activeTarget ?? props.target;

  const modifiers = useModifierKeys();

  const properties =
    finalTarget === undefined
      ? []
      : getModifiersGroup(finalTarget.property, modifiers);

  const [values, setValues] = useState<Values>({});

  // we need these in useEffect, but don't want as dependencies
  const nonDependencies = useRef({ props, values, properties });
  nonDependencies.current = { props, values, properties };

  const unitRef = useRef<UnitValue["unit"]>();

  useEffect(() => {
    if (finalTarget === undefined) {
      return;
    }

    const property = finalTarget.property;

    const handleChange = (event: { value: number }, isEphemeral: boolean) => {
      // for TypeScript
      if (unitRef.current === undefined) {
        return;
      }

      const { values, properties, props } = nonDependencies.current;

      const value = {
        type: "unit",
        value: event.value,
        unit: unitRef.current,
      } as const;

      const nextValues = { ...values };
      for (const property of properties) {
        nextValues[property] = value;
      }

      props.onChange(nextValues, { isEphemeral });

      setValues(isEphemeral ? nextValues : {});
    };

    const scrub = numericScrubControl(finalTarget.element, {
      direction:
        property.endsWith("Left") || property.endsWith("Right")
          ? "horizontal"
          : "vertical",
      getValue() {
        const { value } = nonDependencies.current.props;
        if (value?.type === "unit") {
          unitRef.current = value.unit;
          return value.value;
        }
      },
      onValueInput(event) {
        handleChange(event, true);
      },
      onValueChange(event) {
        handleChange(event, false);
      },
      onStatusChange(status) {
        setActiveTarget(
          status === "scrubbing"
            ? nonDependencies.current.props.target
            : undefined
        );
      },
    });

    return scrub.disconnectedCallback;
  }, [finalTarget]);

  return {
    isActive: activeTarget !== undefined,
    properties,
    values,
  };
};

const getModifiersGroup = (
  property: SpacingStyleProperty,
  modifiers: { shiftKey: boolean; altKey: boolean }
) => {
  let groups: SpacingStyleProperty[][] = [];

  if (modifiers.shiftKey) {
    groups = [
      ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
      ["marginTop", "marginRight", "marginBottom", "marginLeft"],
    ];
  } else if (modifiers.altKey) {
    groups = [
      ["paddingTop", "paddingBottom"],
      ["paddingRight", "paddingLeft"],
      ["marginTop", "marginBottom"],
      ["marginRight", "marginLeft"],
    ];
  }

  return groups.find((group) => group.includes(property)) ?? [property];
};
