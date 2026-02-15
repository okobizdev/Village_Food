import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      ecmaVersion: 2022,
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off",
      "prefer-const": "warn",
      "no-var": "error",
    },
  },
  pluginJs.configs.recommended,
  {
    ignores: [
      "node_modules/**",
      "uploads/**",
      "dist/**",
      "build/**",
      "coverage/**",
    ],
  },
];
