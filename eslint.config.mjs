import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("plugin:@typescript-eslint/recommended", "prettier"), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
        prettier,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },
    },

    rules: {
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/ban-ts-comment": "warn",
        eqeqeq: "error",
        "import/no-anonymous-default-export": "off",

        "no-console": ["error", {
            allow: ["warn", "error"],
        }],

        "no-duplicate-imports": "error",
        "no-self-compare": "error",
        "no-shadow": "error",
        "no-throw-literal": "error",
        "no-unneeded-ternary": "error",
        "no-var": "error",
        "prefer-const": "error",
        "prettier/prettier": "error",
        radix: ["error", "as-needed"],

        yoda: ["error", "never", {
            exceptRange: true,
        }],
    },
}];
