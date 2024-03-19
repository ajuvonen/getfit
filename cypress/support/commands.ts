/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      getByTestId(dataTestAttribute: string, args?: any): Chainable<JQuery<HTMLElement>>;
      addTraining(addWeek?: boolean): void;
      toRoute(route: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('getByTestId', (selector, ...args) => {
  return cy.get(`[data-test-id=${selector}]`, ...args);
});

Cypress.Commands.add('toRoute', (route) => cy.getByTestId(`navbar-${route}-link`).click());

Cypress.Commands.add('addTraining', (addWeek = true) => {
  if (addWeek) {
    cy.toRoute('schedule');
    cy.getByTestId('schedule-add-week-button').click();
  }
  cy.getByTestId('week-0-add-training-button').click();
  cy.getByTestId('edit-training-activity').click();
  cy.get('.v-list-item').first().click();
  cy.getByTestId('edit-training-title')
    .type('My training')
    .getByTestId('edit-training-location')
    .type('Gym')
    .getByTestId('edit-training-duration')
    .find('input')
    .type('.5')
    .getByTestId('edit-training-instructions')
    .type('Take it easy')
    .getByTestId('edit-training-intensity')
    .type('{leftarrow}{rightarrow}')
    .getByTestId('edit-training-save-button')
    .click();
});

export {};
