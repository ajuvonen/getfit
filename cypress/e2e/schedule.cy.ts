describe('Schedule tests', () => {
  it('schedule settings work', () => {
    cy.visit('/').getByTestId('navbar-schedule-link').click();
    cy.get('.settings__icon-container input:checked')
      .should('exist')
      .getByTestId('settings-toggle-all-activities')
      .click();
    cy.get('.settings__icon-container input:checked')
      .should('not.exist')
      .getByTestId('settings-activity-badminton')
      .click();
    cy.getByTestId('settings-activity-walking').click();
    cy.getByTestId('settings-add-week').click();
    cy.getByTestId('week-1').click();
    cy.getByTestId('week-1-calendar-tab-0')
      .should('contain.text', 'Monday')
      .getByTestId('settings-start-of-week-sunday')
      .click();
    cy.getByTestId('week-1-calendar-tab-0')
      .should('contain.text', 'Sunday')
      .getByTestId('week-1-calendar-tab-0')
      .should('contain.text', 'Sunday')
      .getByTestId('week-1-add-training-button')
      .click();
    cy.getByTestId('edit-training-activity').click();
    cy.get('.v-list-item').should('have.length', 2);
    cy.get('.v-list-item:first-child')
      .should('contain.text', 'Badminton')
      .get('.v-list-item:last-child')
      .should('contain.text', 'Walking')
      .getByTestId('edit-training-duration')
      .children()
      .find('.v-text-field__suffix')
      .should('contain.text', 'h');
    cy.getByTestId('edit-training-close-button').click();
    cy.getByTestId('settings-unit-of-time-m').click();
    cy.getByTestId('week-1-add-training-button').click();
    cy.getByTestId('edit-training-duration')
      .children()
      .find('.v-text-field__suffix')
      .should('contain.text', 'm');
  });
});
