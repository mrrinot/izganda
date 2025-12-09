import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    test: {
        globals: true, // Use describe, it, expect without imports
    },
    resolve: {
        alias: {
            $src: path.resolve(__dirname, "./src"),
            $components: path.resolve(__dirname, "./src/components"),
            $types: path.resolve(__dirname, "./types"),
        },
    },
});
