import { categories, type Category } from "@webstudio-is/react-sdk";
import type { StyleProperty } from "@webstudio-is/css-data";
import {
  renderCategory,
  shouldRenderCategory,
  type RenderCategoryProps,
} from "./style-sections";
import type { SetProperty, CreateBatchUpdate } from "./shared/use-style-data";
import type { StyleInfo } from "./shared/style-info";
import { useStore } from "@nanostores/react";
import { selectedInstanceSelectorStore } from "~/shared/nano-states";
import { useInstanceStyleData } from "./shared/style-info";
import React from "react";

export type StyleSettingsProps = {
  currentStyle: StyleInfo;
  setProperty: SetProperty;
  deleteProperty: (property: StyleProperty) => void;
  createBatchUpdate: CreateBatchUpdate;
};

const useParentStyle = () => {
  const selectedInstanceSelector = useStore(selectedInstanceSelectorStore);
  const parentInstanceSelector =
    // root does not have parent
    selectedInstanceSelector?.length === 1
      ? undefined
      : selectedInstanceSelector?.slice(1);
  const parentInstanceStyleData = useInstanceStyleData(parentInstanceSelector);
  return parentInstanceStyleData;
};

export const StyleSettings = ({
  setProperty,
  deleteProperty,
  createBatchUpdate,
  currentStyle,
}: StyleSettingsProps) => {
  const all = [];
  let category: Category;

  const parentStyle = useParentStyle();

  for (category in categories) {
    const categoryProps: RenderCategoryProps = {
      setProperty,
      deleteProperty,
      createBatchUpdate,
      currentStyle,
      category,
      label: categories[category].label,
    };

    if (shouldRenderCategory(categoryProps, parentStyle)) {
      all.push(
        <React.Fragment key={category}>
          {renderCategory(categoryProps)}
        </React.Fragment>
      );
    }
  }

  return <>{all}</>;
};
