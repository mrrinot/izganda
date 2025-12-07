const { defineConfig, globalIgnores } = require("eslint/config");
const js = require("@eslint/js");
const globals = require("globals");
const typescriptPlugin = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");
const prettierPlugin = require("eslint-plugin-prettier/recommended");
const importPlugin = require("eslint-plugin-import");
const jestPlugin = require("eslint-plugin-jest");
const reactPlugin = require("eslint-plugin-react");
const hooksPlugin = require("eslint-plugin-react-hooks");
const valtioPlugin = require("eslint-plugin-valtio");
const jsxA11yPlugin = require("eslint-plugin-jsx-a11y");

/*
To debug, use either:

npx eslint --debug . > eslint-debug.log 2>&1
 
OR

npx eslint --inspect-config

*/

/** @type {import('eslint').Linter.Config[]} */
module.exports = defineConfig([
    globalIgnores(["**/*.cjs", "**/coverage/", "**/build/**"]),
    js.configs.recommended,
    {
        name: "global",
        linterOptions: {
            reportUnusedDisableDirectives: "off",
        },
        languageOptions: {
            globals: {
                require: true,
                global: true,
                process: true,
                Buffer: true,
                setTimeout: true,
                setInterval: true,
                setImmediate: true,
            },
        },
        rules: {
            "object-shorthand": ["error", "always"],
            "no-console": ["error", { allow: ["debug", "warn", "error"] }],
            "prefer-destructuring": [
                "error",
                {
                    VariableDeclarator: {
                        object: true,
                    },
                },
            ],
        },
    },
    {
        name: "Jest test files",
        files: ["**/*.test.[jt]s?(x)", "**/tests/**", "**/__tests__/**", "**/testHelpers/**"],
        plugins: {
            jest: jestPlugin,
        },
        languageOptions: {
            globals: jestPlugin.environments.globals.globals,
        },
        rules: {
            ...jestPlugin.configs.recommended.rules,
        },
        settings: {
            jest: {
                version: 29,
            },
        },
    },
    {
        name: "Typescript files",
        files: ["**/*.ts?(x)"],
        languageOptions: {
            parser: typescriptParser,
        },
        plugins: {
            "@typescript-eslint": typescriptPlugin,
        },
        rules: {
            ...typescriptPlugin.configs.recommended.rules,

            "no-redeclare": "off",
            "@typescript-eslint/no-redeclare": "error",

            "no-use-before-define": "off",
            "@typescript-eslint/no-use-before-define": "error",

            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    caughtErrors: "none",
                },
            ],

            "no-shadow": "off",
            "@typescript-eslint/no-shadow": "error",

            "@typescript-eslint/ban-ts-comment": [
                "error",
                {
                    "ts-expect-error": "allow-with-description",
                    "ts-ignore": "allow-with-description",
                    "ts-nocheck": "allow-with-description",
                    "ts-check": false,
                },
            ],

            "@typescript-eslint/no-require-imports": "off",

            "no-unused-expressions": "off",
            "@typescript-eslint/no-unused-expressions": "error",
        },
    },
    {
        name: "React Files",
        files: ["**/*.[jt]sx", "**/hooks/**"],
        plugins: {
            react: reactPlugin,
            "react-hooks": hooksPlugin,
            valtio: valtioPlugin,
            "jsx-a11y": jsxA11yPlugin,
        },
        languageOptions: {
            globals: {
                NodeJS: true,
                JSX: true,
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        extends: ["react-hooks/recommended"],
        rules: {
            ...reactPlugin.configs.recommended.rules,
            ...valtioPlugin.configs.recommended.rules,
            ...jsxA11yPlugin.configs.recommended.rules,

            "react/no-array-index-key": "error",
            "valtio/state-snapshot-rule": "off",
            "jsx-a11y/no-autofocus": "off",
            "jsx-a11y/click-events-have-key-events": "off",
        },
        settings: {
            react: {
                version: "16.14",
            },
        },
    },
    {
        name: "config files",
        files: ["**/*.js"],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    prettierPlugin,
]);
