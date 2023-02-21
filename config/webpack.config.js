const path = require("path");
const webpack = require("webpack");
const ConfigWebpackPlugin = require("config-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const nodeEnv = process.env.NODE_ENV;
const rootPath = path.resolve(__dirname, "..");

const paths = {
    publicPath: path.resolve(rootPath, "public"),
    appEntryPoint: path.resolve(rootPath, "src/index.tsx"),
    appBuild: path.resolve(rootPath, "build"),
    appHtml: path.resolve(rootPath, "public/index.html"),
    appSrc: path.resolve(rootPath, "src"),
    appTypes: path.resolve(rootPath, "types"),
};

module.exports = {
    entry: {
        main: paths.appEntryPoint,
    },

    mode: nodeEnv,

    output: {
        path: paths.appBuild,
        filename: "[name].[hash].bundle.js",
        publicPath: "/",
    },

    devServer: {
        static: {
            directory: paths.appPublic,
            publicPath: "/",
        },
        client: {
            overlay: false,
            logging: "info",
        },
        historyApiFallback: true,
        compress: false,
        port: 3500,
        hot: true,
        open: true,
    },

    resolve: {
        extensions: [".js", ".ts", ".json", ".jsx", ".tsx"],
        alias: {
            $src: paths.appSrc,
            $types: paths.appTypes,
            $config: __dirname,
        },
    },

    module: {
        rules: [
            {
                test: /\.(jsx?|tsx?)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: paths.appHtml,
            inject: true,
        }),
        new ConfigWebpackPlugin("config"),
        new webpack.DefinePlugin({}),
        nodeEnv === "production" &&
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: paths.appPublic,
                        to: paths.appBuild,
                        globOptions: {
                            ignore: ["**/*.html"],
                        },
                    },
                    { from: paths.appPublicCommon, to: paths.appBuild },
                ],
            }),
    ].filter(Boolean),
};
