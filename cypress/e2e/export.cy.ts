import path from 'path';

describe('Export test', () => {
  beforeEach(() => cy.visit('/'));
  it('shows no content in export view', () => {
    cy.toRoute('schedule');
    cy.getByTestId('schedule-add-week-button').click();
    cy.toRoute('export');
    cy.get('.simple-training-card').should('have.length', 0);
    cy.getByTestId('week-0-table').find('tbody').should('have.text', 'No trainings');
    cy.getByTestId('week-0-supplement').should('not.exist');
  });

  it('shows content in export view', () => {
    cy.addTraining();
    cy.toRoute('export');
    cy.get('.simple-training-card').should('have.length', 1);
    cy.getByTestId('week-0-supplement').should('exist');
  });

  it('downloads calendar file', () => {
    cy.addTraining();
    cy.toRoute('export');
    cy.getByTestId('export-download-button').should('not.exist');
    cy.toRoute('settings');
    cy.getByTestId('settings-start-date-input').click();
    cy.get('.dp__calendar_item:not([aria-disabled])').first().click();
    cy.toRoute('export');
    cy.getByTestId('export-download-button').click();
    cy.readFile(path.join(Cypress.config('downloadsFolder'), 'TrainingSchedule.ics')).should(
      'exist',
    );
  });
});
