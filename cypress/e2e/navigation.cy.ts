describe('Navigation tests', () => {
  beforeEach(() => cy.visit('/'));
  it('navbar navigates to correct routes', () => {
    cy.toRoute('settings');
    cy.location('pathname').should('contain', '/settings');
    cy.toRoute('schedule');
    cy.location('pathname').should('contain', '/schedule');
    cy.getByTestId('navbar-export-link').should('have.class', 'v-btn--disabled');
    cy.getByTestId('schedule-add-week-button').click();
    cy.addTraining(false);
    cy.getByTestId('navbar-export-link').should('not.have.class', 'v-btn--disabled').click();
    cy.location('pathname').should('contain', '/export');
    cy.getByTestId('app-bar-home-link').click();
    cy.location('pathname').should('eql', '/getfit/');
    cy.getByTestId('app-bar-stats-link').click();
    cy.location('pathname').should('contain', '/stats');
  });

  it('changes language', () => {
    cy.getByTestId('navbar-schedule-link').should('contain.text', 'Schedule');
    cy.getByTestId('app-bar-locale-fi-button').click();
    cy.getByTestId('navbar-schedule-link').should('contain.text', 'Ohjelma');
    cy.getByTestId('app-bar-locale-en-button').click();
    cy.getByTestId('navbar-schedule-link').should('contain.text', 'Schedule');
  });
});
