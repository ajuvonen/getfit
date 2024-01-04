it('shows no content in print view', () => {
  cy.visit('/').getByTestId('navbar-schedule-link').click();
  cy.getByTestId('schedule-settings-add-week-button').click();
  cy.getByTestId('navbar-print-link').click();
  cy.get('.simple-training-card').should('have.length', 0);
  cy.getByTestId('week-0-table').find('tbody').should('have.text', 'No trainings');
  cy.getByTestId('week-0-supplement').should('not.exist');
});

it('shows content in print view', () => {
  cy.visit('/').getByTestId('navbar-schedule-link').click();
  cy.getByTestId('schedule-settings-add-week-button').click();
  cy.getByTestId('week-0').click();
  cy.getByTestId('week-0-add-training-button')
    .click();
  cy.getByTestId('edit-training-activity').click();
  cy.get('.v-list-item').first().click();
  cy.getByTestId('edit-training-title').type('My training');
  cy.getByTestId('edit-training-location').type('Gym');
  cy.getByTestId('edit-training-duration').find('input').type('.5');
  cy.getByTestId('edit-training-description').type('Take it easy');
  cy.getByTestId('edit-training-save-button').click();
  cy.getByTestId('navbar-print-link').click();
  cy.get('.simple-training-card').should('have.length', 1);
});