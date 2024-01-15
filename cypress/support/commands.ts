/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      getByTestId(dataTestAttribute: string, args?: any): Chainable<JQuery<HTMLElement>>;
      addTraining(addWeek?: boolean): void;
    }
  }
}

Cypress.Commands.add('getByTestId', (selector, ...args) => {
  return cy.get(`[data-test-id=${selector}]`, ...args);
});

Cypress.Commands.add('addTraining', (addWeek = true) => {
  if (addWeek) {
    cy.getByTestId('schedule-settings-add-week-button').click();
    cy.getByTestId('week-0').click();
  }
  cy.getByTestId('week-0-add-training-button').click();
  cy.getByTestId('edit-training-activity').click();
  cy.get('.v-list-item').first().click();
  cy.getByTestId('edit-training-title').type('My training');
  cy.getByTestId('edit-training-location').type('Gym');
  cy.getByTestId('edit-training-duration').find('input').type('.5');
  cy.getByTestId('edit-training-description').type('Take it easy');
  cy.getByTestId('edit-training-intensity').type('{leftarrow}{rightarrow}');
  cy.getByTestId('edit-training-save-button').click();
});

export {};
