Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-test-id="${testId}"]`);
});

Cypress.Commands.add('toRoute', (route) => {
  cy.getByTestId(`navbar-${route}-link`).click();
});

Cypress.Commands.add('addTraining', (addWeek = true) => {
  if (addWeek) {
    cy.toRoute('schedule');
    cy.getByTestId('schedule-add-week-button').click();
    cy.getByTestId('week-0').click();
  }
  cy.getByTestId('week-0-add-training-button').click();
  cy.getByTestId('edit-training-activity').click();
  cy.getByTestId('edit-training-activity-badminton').click();
  cy.getByTestId('edit-training-title').type('My training');
  cy.getByTestId('edit-training-location').type('Sport hall');
  cy.getByTestId('edit-training-duration').find('input').type('.5');
  cy.getByTestId('edit-training-instructions').type('Take it easy');
  cy.getByTestId('edit-training-intensity').type('{leftarrow}{rightarrow}');
  cy.getByTestId('edit-training-save-button').click();
});

export {};
