describe('Schedule tests', () => {
  it('changes schedule settings', () => {
    cy.visit('/').getByTestId('navbar-schedule-link').click();
    cy.get('.schedule-settings__icon-container input:checked')
      .should('exist')
      .getByTestId('schedule-settings-toggle-all-activities').find('input')
      .click();
    cy.get('.schedule-settings__icon-container input:checked')
      .should('not.exist')
      .get('#schedule-settings-activity-badminton')
      .click();
    cy.get('#schedule-settings-activity-walking').click();
    cy.getByTestId('schedule-settings-add-week-button').click();
    cy.getByTestId('schedule-settings-heading').click();
    cy.getByTestId('week-0').click();
    cy.getByTestId('week-0-calendar-tab-0')
      .should('contain.text', 'Monday')
      .getByTestId('schedule-settings-start-of-week-sunday')
      .click();
    cy.getByTestId('week-0-calendar-tab-0')
      .should('contain.text', 'Sunday')
      .getByTestId('week-0-calendar-tab-0')
      .should('contain.text', 'Sunday')
      .getByTestId('week-0-add-training-button')
      .click();
    cy.getByTestId('edit-training-activity').click();
    cy.get('.v-list-item').should('have.length', 2);
    cy.get('.v-list-item').first()
      .should('contain.text', 'Badminton')
      .get('.v-list-item').last()
      .should('contain.text', 'Walking')
      .getByTestId('edit-training-duration')
      .find('.v-text-field__suffix')
      .should('contain.text', 'h');
    cy.getByTestId('edit-training-close-button').click();
    cy.getByTestId('schedule-settings-unit-of-time-m').click();
    cy.getByTestId('week-0-add-training-button').click();
    cy.getByTestId('edit-training-duration')
      .find('.v-text-field__suffix')
      .should('contain.text', 'm');
  });

  it('settings work in print view', () => {
    cy.visit('/').getByTestId('navbar-schedule-link').click();
    cy.addTraining();
    cy.getByTestId('navbar-print-link').click();
    cy.getByTestId('week-0-table').find('thead th:first-child').should('have.text', 'Mon');
    cy.getByTestId('navbar-schedule-link').click();
    cy.getByTestId('schedule-settings-start-of-week-sunday').click();
    cy.getByTestId('week-0').click();
    cy.getByTestId('week-0-calendar-tab-1').click();
    cy.getByTestId('week-0-add-training-button').click();
    cy.getByTestId('edit-training-activity').click();
    cy.get('.v-list-item').first().click();
    cy.getByTestId('edit-training-duration').find('input').type('.5');
    cy.getByTestId('edit-training-save-button').click();
    cy.getByTestId('schedule-settings-unit-of-time-m').click();
    cy.getByTestId('navbar-print-link').click();
    cy.getByTestId('week-0-table').find('thead th:first-child').should('have.text', 'Sun');
    cy.get('.simple-training-card__duration').should('contain.text', '90 m');
  });

  it('adds new trainings', () => {
    cy.visit('/').getByTestId('navbar-schedule-link').click();
    cy.getByTestId('schedule-settings-add-week-button').click();
    cy.getByTestId('week-0').click();
    cy.getByTestId('week-0-calendar-tab-1').click();
    cy.addTraining(false);
    cy.getByTestId('week-0-day-1').find('.training-card').should('exist');
    cy.getByTestId('week-0-copy-button').click();
    cy.getByTestId('schedule').find('.v-expansion-panel').should('have.length', 2);
    cy.getByTestId('week-0-day-1').find('.training-card__action-button').click();
    cy.get('.training-card__delete-button').click();
    cy.getByTestId('week-0-day-1').find('.training-card').should('not.exist');
    cy.getByTestId('week-1').click();
    cy.getByTestId('week-1-calendar-tab-1').click();
    cy.getByTestId('week-1-day-1').find('.training-card').should('exist');
    cy.getByTestId('week-0').click();
    cy.getByTestId('week-0-delete-button').click();
    cy.getByTestId('week-0-delete-button').click();
    cy.getByTestId('schedule').should('not.exist');
  });
});
