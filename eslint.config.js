import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["artifacts/**"] },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
  },
  {
    files: ["test/**/*.js", "wdio.conf.js"],
    languageOptions: {
      globals: {
        browser: "readonly",
        driver: "readonly",
        $: "readonly",
        $$: "readonly",
        expect: "readonly",
      },
    },
  },
  {
    files: ["test/specs/**/*.js"],
    languageOptions: { globals: globals.mocha },
  },
];
