/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    getByTestId(testId: string): Chainable<Subject>;
    addTraining(addWeek?: boolean): void;
    toRoute(route: string): void;
  }
}
