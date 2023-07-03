import type { Styles } from "./normalize";

export const borders: Styles = [
  {
    property: "borderTopWidth",
    value: { type: "unit", value: 1, unit: "px" },
  },
  {
    property: "borderRightWidth",
    value: { type: "unit", value: 1, unit: "px" },
  },
  {
    property: "borderBottomWidth",
    value: { type: "unit", value: 1, unit: "px" },
  },
  {
    property: "borderLeftWidth",
    value: { type: "unit", value: 1, unit: "px" },
  },
];

export const outline: Styles = [
  {
    property: "outlineWidth",
    value: { type: "unit", value: 1, unit: "px" },
  },
];

export const marginReset = [
  {
    property: "marginTop",
    value: { type: "unit", value: 0, unit: "number" },
  },
  {
    property: "marginRight",
    value: { type: "unit", value: 0, unit: "number" },
  },
  {
    property: "marginBottom",
    value: { type: "unit", value: 0, unit: "px" },
  },
  {
    property: "marginLeft",
    value: { type: "unit", value: 0, unit: "number" },
  },
] satisfies Styles;

export const blockquote = [
  ...marginReset,
  {
    property: "paddingTop",
    value: { type: "unit", value: 10, unit: "px" },
  },
  {
    property: "paddingBottom",
    value: { type: "unit", value: 10, unit: "px" },
  },
  {
    property: "paddingLeft",
    value: { type: "unit", value: 20, unit: "px" },
  },
  {
    property: "paddingRight",
    value: { type: "unit", value: 20, unit: "px" },
  },
  {
    property: "borderLeftWidth",
    value: { type: "unit", value: 5, unit: "px" },
  },
  {
    property: "borderLeftStyle",
    value: { type: "keyword", value: "solid" },
  },
  {
    property: "borderLeftColor",
    value: { type: "rgb", r: 226, g: 226, b: 226, alpha: 1 },
  },
] satisfies Styles;

export const h1 = [
  ...marginReset,
  {
    property: "fontSize",
    value: { type: "unit", value: 38, unit: "px" },
  },
] satisfies Styles;

export const h2 = [
  ...marginReset,
  {
    property: "fontSize",
    value: { type: "unit", value: 32, unit: "px" },
  },
] satisfies Styles;

export const h3 = [
  ...marginReset,
  {
    property: "fontSize",
    value: { type: "unit", value: 24, unit: "px" },
  },
] satisfies Styles;

export const h4 = [
  ...marginReset,
  {
    property: "fontSize",
    value: { type: "unit", value: 18, unit: "px" },
  },
] satisfies Styles;

export const h5 = [
  ...marginReset,
  {
    property: "fontSize",
    value: { type: "unit", value: 14, unit: "px" },
  },
] satisfies Styles;

export const h6 = [
  ...marginReset,
  {
    property: "fontSize",
    value: { type: "unit", value: 12, unit: "px" },
  },
] satisfies Styles;
