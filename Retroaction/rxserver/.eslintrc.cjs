require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,

  env: {
    browser: true,
    es2021: true,
    node: true,
  },

  extends: [
    "eslint:recommended",
    // "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  // NOTE to be turned on when typescripting
  // parser: "@typescript-eslint/parser",
 

  parserOptions: {
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },

  plugins: [
    // NOTE to be turned on when typescripting
    // "@typescript-eslint",
    "prettier"],
  rules: {
    // override/add rules settings here, such as:
    indent: ["warn", 2],
    // This is added by me ========
    "no-undef": "off",
    "no-empty": "off",
    "no-empty-function": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "semi": ["error", "always", { "omitLastInOneLineBlock": true }],
  },
  ignorePatterns: ["**/cypress/*",  "**/.github/*", "**/node_modules"],
};
