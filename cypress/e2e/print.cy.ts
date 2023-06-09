it('shows content in print view', () => {
  cy.visit('/').getByTestId('navbar-schedule-link').click();
  cy.getByTestId('schedule-settings-add-week-button').click();
  cy.getByTestId('schedule-settings-add-week-button').click();
  cy.getByTestId('week-1').click();
  cy.getByTestId('week-1-calendar-tab-1').click();
  cy.getByTestId('week-1-add-training-button')
    .click();
  cy.getByTestId('edit-training-activity').click();
  cy.get('.v-list-item:first-child').click();
  cy.getByTestId('edit-training-title').type('My training');
  cy.getByTestId('edit-training-location').type('Gym');
  cy.getByTestId('edit-training-duration').find('input').type('1.5');
  cy.getByTestId('edit-training-description').type('Take it easy');
  cy.getByTestId('edit-training-save-button').click();
  cy.getByTestId('navbar-print-link').click();
  cy.get('.simple-training-card').should('have.length', 1);
});