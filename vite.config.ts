import {fileURLToPath, URL} from 'node:url';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify(),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        name: 'GetFit Training Schedule Planner',
        short_name: 'GetFit',
        description: 'GetFit is a free app for planning and tracking your training schedule.',
        dir: 'ltr',
        icons: [
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: ['any', 'maskable'],
          },
        ],
        theme_color: '#FAFAFA',
        background_color: '#FAFAFA',
        categories: ['fitness', 'sports', 'health'],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg}'],
      },
      devOptions: {
        enabled: process.env.NODE_ENV === 'development',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  preview: {
    port: 5173,
  },
  base: '/getfit',
});
