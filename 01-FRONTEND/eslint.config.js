import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["dist/", "prototypes/"] },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: { globals: { ...globals.browser } },
  },
];
