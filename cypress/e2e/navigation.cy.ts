describe('Navigation tests', () => {
  it('navbar navigates to correct routes', () => {
    cy.visit('/').getByTestId('navbar-schedule-link').click();
    cy.location('pathname').should('contain', '/schedule').getByTestId('navbar-print-link').click();
    cy.contains('h1', 'Print')
      .location('pathname')
      .should('contain', '/print')
      .getByTestId('navbar-home-link')
      .click();
    cy.contains('h1', 'Home').location('pathname').should('eql', '/');
  });
});
