import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars';

export default defineConfig({
  plugins: [handlebars()],
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
  }
})
