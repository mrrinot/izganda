const path = require("path");

module.exports = {
    extends: ["@telokys/eslint-config-typescript"],
    plugins: ["babel"],
    settings: {
        "import/resolver": {
            webpack: {
                config: path.resolve(__dirname, "config/webpack.config.js"),
            },
        },
    },
    rules: {
        "no-continue": "off",
        "no-restricted-modules": [
            "error",
            {
                patterns: ["../*"],
            },
        ],
        "no-restricted-imports": [
            "error",
            {
                patterns: ["../*"],
            },
        ],
        "no-console": ["warn", { allow: ["debug", "error"] }],
        "@typescript-eslint/class-name-casing": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-unused-expressions": "error",
        "no-empty-function": "off",
        "max-classes-per-file": "off",
        "no-unused-expressions": "off",
        "no-unused-vars": "off",
        "import/no-cycle": "off",
        "no-template-curly-in-string": "off",
        "import/no-unresolved": [
            "off",
            {
                patterns: ["*.d.ts"],
            },
        ],
        "import/extensions": [
            "off",
            {
                patterns: ["*.d.ts"],
            },
        ],
    },
    overrides: [
        {
            files: [
                "./config/webpack.config.js",
                ".babel.config.js",
                ".eslintrc.js",
            ],
            env: {
                node: true,
                browser: false,
            },
        },
        {
            files: "*.ts",
            rules: {
                "no-redeclare": "off",
                "default-case": "off",
            },
        },
    ],
};
