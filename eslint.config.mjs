import pluginJs from "@eslint/js";
import tsEslint from "typescript-eslint";

export default [
  {
    ignores: ["www", "webpack.config.js", ".prettierrc.js"],
  },
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
];
