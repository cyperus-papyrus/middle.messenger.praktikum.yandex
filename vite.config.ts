import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import checker from 'vite-plugin-checker';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        handlebars(),
        checker({
            typescript: true,
        })
    ],
    publicDir: 'static',
    server: {
        port: 3000
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
          @use "variables" as *;
          @use "mixins" as *;
        `,
            }
        }
    },
    build: {
        rollupOptions: {
            input: resolve(__dirname, 'index.html')
        }
    }
});
