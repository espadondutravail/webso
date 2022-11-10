const path = require("path");

const template = ({
  sourceFile,
  componentName,
  jsx,
}) => `// Generated from ${sourceFile}

import { forwardRef } from "react";
import { IconProps } from "../types";

export const ${componentName}Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, forwardedRef) => {
    return (
      ${jsx}
    );
  }
);

${componentName}Icon.displayName = "${componentName}Icon";
`;

const transformFilename = (filename) => {
  return path.basename(filename, path.extname(filename)) + ".tsx";
};

exports.config = {
  inputDir: "./icons",
  outputDir: "./src/generated",
  template,
  transformFilename,
  svgProps: {
    width: "16",
    height: "16",
    fill: "{color}",
    "{...props}": null,
    ref: "{forwardedRef}",
  },
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          // preserve viewBox
          removeViewBox: false,
        },
      },
    },
    // convert width/height to viewBox if missing
    { name: "removeDimensions" },
  ],
};
