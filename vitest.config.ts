import {fileURLToPath} from 'node:url';
import {mergeConfig, configDefaults, defineConfig} from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      exclude: [...configDefaults.exclude, 'e2e/*'],
      setupFiles: ['./vitest.setup.ts'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      server: {
        deps: {
          inline: ['vuetify'],
        },
      },
      coverage: {
        provider: 'istanbul',
        include: ['src/**/*'],
        exclude: ['src/App.vue', 'src/main.ts'],
        reporter: ['text'],
      },
    },
  }),
);
