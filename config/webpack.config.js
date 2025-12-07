const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const nodeEnv = process.env.NODE_ENV;
const rootPath = path.resolve(__dirname, "..");

const paths = {
    publicPath: path.resolve(rootPath, "public"),
    appEntryPoint: path.resolve(rootPath, "src/index.tsx"),
    appBuild: path.resolve(rootPath, "build"),
    appHtml: path.resolve(rootPath, "public/index.html"),
    appSrc: path.resolve(rootPath, "src"),
    appComponents: path.resolve(rootPath, "src/components"),
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
            $components: paths.appComponents,
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
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
            },
        ],
    },

    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
            process: "process/browser",
        }),
        new HtmlWebpackPlugin({
            template: paths.appHtml,
            inject: true,
        }),
        new webpack.DefinePlugin({}),
        new MiniCssExtractPlugin({
            filename: "[name].[contentHash].css",
            chunkFilename: "[id].css",
        }),
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
