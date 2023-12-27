# getfit
GetFit is a simple frontend-only exercise planner created with Vue3, TypeScript, and Vite. Used libraries include Pinia, Vuetify, Cypress and Vitest. For CI, the project uses Github Actions.

The schedules are created by first deciding which activities are available and adjusting other settings. Then, add weeks and activities for each weekday. The app features simple drag & drop and copy functionalities.

To test this app in production, visit <https://ajuvonen.github.io/getfit>

## Requirements

Node 20+

## Running the project

1. Run `npm install`
2. Run `npm run build`
3. Run `npm preview`
4. Navigate to address shown on the terminal

## Running e2e tests

1. Run `npm install`
2. Run `npm run dev`
3. In a separate terminal, run `npm run test:e2e`

## Running unit tests

1. Run `npm install`
2. Run `npm test:unit`
