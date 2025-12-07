module.exports = {
    plugins: {
        "@tailwindcss/postcss": {
            optimize: (process.env.NODE_ENV = "production"),
        },
        autoprefixer: {},
    },
};
