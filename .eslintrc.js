/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: [
      "next",
      "next/core-web-vitals",
      "plugin:@typescript-eslint/recommended"
    ],
    plugins: ["@typescript-eslint"],
    rules: {
      // Turn off rules that block deployment
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn"
    }
  };
  