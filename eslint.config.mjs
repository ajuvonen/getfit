import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import pluginVitest from '@vitest/eslint-plugin';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import {includeIgnoreFile} from '@eslint/compat';
import pluginCypress from 'eslint-plugin-cypress/flat'
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility';
import {fileURLToPath} from 'node:url';

export default [
  includeIgnoreFile(fileURLToPath(new URL('./.gitignore', import.meta.url))),
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  ...pluginVueA11y.configs['flat/recommended'],
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },
  {
    ...pluginCypress.configs.recommended,
    files: [
      'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}',
      'cypress/support/**/*.{js,ts,jsx,tsx}'
    ],
  },
  skipFormatting,
];
