import {defineConfig} from 'cypress';

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.ts',
    baseUrl: 'http://localhost:5173/getfit',
    video: false,
    trashAssetsBeforeRuns: true,
    pageLoadTimeout: 5000,
  },
});
