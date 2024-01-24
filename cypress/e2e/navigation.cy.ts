describe('Navigation tests', () => {
  it('navbar navigates to correct routes', () => {
    cy.visit('/').getByTestId('navbar-settings-link').click();
    cy.location('pathname')
      .should('contain', '/settings')
      .getByTestId('navbar-schedule-link')
      .click();
    cy.location('pathname')
      .should('contain', '/schedule')
      .getByTestId('navbar-export-link')
      .should('have.class', 'v-btn--disabled')
      .getByTestId('schedule-add-week-button')
      .click();
    cy.getByTestId('navbar-export-link').should('not.have.class', 'v-btn--disabled').click();
    cy.location('pathname').should('contain', '/export').getByTestId('app-bar-home-link').click();
    cy.location('pathname').should('eql', '/getfit/');
  });

  it('changes language', () => {
    cy.visit('/')
      .getByTestId('navbar-schedule-link')
      .should('contain.text', 'Schedule')
      .getByTestId('app-bar-locale-fi-button')
      .click();
    cy.getByTestId('navbar-schedule-link')
      .should('contain.text', 'Ohjelma')
      .getByTestId('app-bar-locale-en-button')
      .click();
    cy.getByTestId('navbar-schedule-link').should('contain.text', 'Schedule');
  });
});
