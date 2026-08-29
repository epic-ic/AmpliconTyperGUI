import { defineConfig } from "electron-vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    main: {
        root: path.resolve(__dirname, "src/main"),
        build: {
            emptyOutDir: true,
            rollupOptions: {
                input: {
                    index: path.resolve(__dirname, "src/main/index.ts"),
                },
            },
        },
    },
    preload: {
        root: path.resolve(__dirname, "src/preload"),
        build: {
            emptyOutDir: true,
            rollupOptions: {
                input: {
                    index: path.resolve(
                        __dirname,
                        "src/preload/index.ts",
                    ),
                },
            },
        },
    },
    renderer: {
        root: path.resolve(__dirname, "src/renderer"),
        build: {
            emptyOutDir: true,
            rollupOptions: {
                input: {
                    index: path.resolve(
                        __dirname,
                        "src/renderer/index.html",
                    ),
                },
            },
        },
        plugins: [
            svelte(),
            tailwindcss()
        ],
        resolve: {
            alias: {
                $lib: path.resolve(__dirname, "src/lib"),
            },
        },
    },
});
