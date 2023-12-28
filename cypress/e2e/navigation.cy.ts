describe('Navigation tests', () => {
  it('navbar navigates to correct routes', () => {
    cy.visit('/')
      .getByTestId('navbar-schedule-link').click();
    cy.location('pathname').should('contain', '/schedule')
      .getByTestId('navbar-print-link').should('have.class', 'v-btn--disabled');
    cy.getByTestId('navbar-schedule-link').click();
    cy.getByTestId('schedule-settings-add-week-button').click();
    cy.getByTestId('navbar-print-link').should('not.have.class', 'v-btn--disabled').click();
    cy.contains('h1', 'For best results in printed form')
      .location('pathname')
      .should('contain', '/print')
      .getByTestId('navbar-home-link')
      .click();
    cy.contains('h1', 'Welcome to GetFit').location('pathname').should('eql', '/getfit/');
  });

  it('changes language', () => {
    cy.visit('/');
    cy.getByTestId('navbar-schedule-link')
      .should('contain.text', 'Schedule')
      .getByTestId('app-bar-locale-fi-button')
      .click();
    cy.getByTestId('navbar-schedule-link').should('contain.text', 'Ohjelma')
      .getByTestId('app-bar-locale-en-button')
      .click();
    cy.getByTestId('navbar-schedule-link').should('contain.text', 'Schedule');
  });
});
