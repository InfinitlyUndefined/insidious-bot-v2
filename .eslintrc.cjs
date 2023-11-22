/**@type {import("eslint").ESLint.ConfigData} */
module.exports = {
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
    "plugin:import/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import"],
  ignorePatterns: [
    "node_modules",
    ".prettierrc",
    ".prettierignore",
    "readme.md",
  ],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".ts"],
        moduleDirectory: ["node_modules", "src/"],
      },
      typescript: {
        project: "./tsconfig.json",
      }
    },
  },
  root: true,
};
