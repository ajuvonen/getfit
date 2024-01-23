it('shows no content in export view', () => {
  cy.visit('/').getByTestId('navbar-schedule-link').click();
  cy.getByTestId('schedule-settings-add-week-button').click();
  cy.getByTestId('navbar-export-link').click();
  cy.get('.simple-training-card').should('have.length', 0);
  cy.getByTestId('week-0-table').find('tbody').should('have.text', 'No trainings');
  cy.getByTestId('week-0-supplement').should('not.exist');
});

it('shows content in export view', () => {
  cy.visit('/').getByTestId('navbar-schedule-link').click();
  cy.addTraining();
  cy.getByTestId('navbar-export-link').click();
  cy.get('.simple-training-card').should('have.length', 1);
  cy.getByTestId('export-view-download-button').should('not.exist');
});

it('shows export and calendar download buttons', () => {
  cy.visit('/').getByTestId('navbar-schedule-link').click();
  cy.addTraining();
  cy.getByTestId('navbar-export-link').click();
  cy.getByTestId('export-view-print-button').should('exist');
  cy.getByTestId('export-view-download-button').should('not.exist');
  cy.getByTestId('navbar-schedule-link').click();
  cy.getByTestId('schedule-settings-start-date-input').click();
  cy.get('.dp__calendar_item:not([aria-disabled])').first().click();
  cy.getByTestId('navbar-export-link').click();
  cy.getByTestId('export-view-print-button').should('exist');
  cy.getByTestId('export-view-download-button').should('exist');
});
