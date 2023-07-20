import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({script: {propsDestructure: true}}), vuetify()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  preview: {
    port: 5173,
  },
});
