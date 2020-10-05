module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  plugins: [
    "simple-import-sort"
  ],
  rules: {
    "simple-import-sort/sort": "error",
    "@typescript-eslint/interface-name-prefix": [0],
    "@typescript-eslint/explicit-function-return-type": [0],
    "@typescript-eslint/no-use-before-define": [0],
    "@typescript-eslint/ban-ts-ignore": [0],
    "@typescript-eslint/no-explicit-any": [0], // not great but there are places where it's useful
    "@typescript-eslint/no-non-null-assertion": [0],
    "@typescript-eslint/no-unused-vars": ["error", { "varsIgnorePattern": "_" }],
    "react/jsx-sort-props": ["error", {
      "callbacksLast": true,
      "shorthandFirst": true,
      "reservedFirst": true,
    }],
    "react/no-unescaped-entities": [0]
  }
};
