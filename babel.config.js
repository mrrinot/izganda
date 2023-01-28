const env = process.env.BABEL_ENV || process.env.NODE_ENV || "development";
const disableCommonJS = process.env.DISABLE_MODULE_TRANSFORM === "true";

const allPlugins = [
    "@babel/plugin-transform-modules-commonjs",
    ["@babel/plugin-transform-for-of", { assumeArray: true }],
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    "@babel/plugin-proposal-numeric-separator",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator",
    "babel-plugin-macros",
];

module.exports = {
    ignore: ["**/node_modules"],
    presets: [
        [
            "@babel/preset-env",
            {
                targets: {
                    browsers: [
                        "last 10 versions",
                        "not ie <= 11",
                        "not dead",
                        "not < 0.5%",
                    ],
                },
                modules: disableCommonJS ? false : "commonjs",
                exclude: [
                    "transform-for-of",
                    "proposal-private-methods",
                    "proposal-private-property-in-object",
                ],
                useBuiltIns: "usage",
                corejs: 3,
            },
        ],
    ],
    plugins: [
        [
            "transform-imports",
            {
                "lodash-es": {
                    transform: "lodash-es/${member}",
                    preventFullImport: true,
                },
                lodash: {
                    transform: "lodash-es/${member}",
                    preventFullImport: true,
                },
            },
        ],
    ],
    overrides: [
        {
            test: /\.ts$/,
            plugins: [["@babel/plugin-transform-typescript"], ...allPlugins],
        },
    ],
};

if (env === "debug") {
    module.exports.retainLines = true;
    module.exports.sourceMaps = "inline";
}
