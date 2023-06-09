describe('Schedule tests', () => {
  it('changes schedule settings', () => {
    cy.visit('/').getByTestId('navbar-schedule-link').click();
    cy.get('.schedule-settings__icon-container input:checked')
      .should('exist')
      .getByTestId('schedule-settings-toggle-all-activities')
      .click();
    cy.get('.schedule-settings__icon-container input:checked')
      .should('not.exist')
      .get('#schedule-settings-activity-badminton')
      .click();
    cy.get('#schedule-settings-activity-walking').click();
    cy.getByTestId('schedule-settings-add-week-button').click();
    cy.getByTestId('week-1').click();
    cy.getByTestId('week-1-calendar-tab-0')
      .should('contain.text', 'Monday')
      .getByTestId('schedule-settings-start-of-week-sunday')
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
      .find('.v-text-field__suffix')
      .should('contain.text', 'h');
    cy.getByTestId('edit-training-close-button').click();
    cy.getByTestId('schedule-settings-unit-of-time-m').click();
    cy.getByTestId('week-1-add-training-button').click();
    cy.getByTestId('edit-training-duration')
      .find('.v-text-field__suffix')
      .should('contain.text', 'm');
  });

  it('settings work in print view', () => {
    cy.visit('/').getByTestId('navbar-schedule-link').click();
    cy.getByTestId('schedule-settings-add-week-button').click();
    cy.getByTestId('navbar-print-link').click();
    cy.getByTestId('week-1-table').find('thead th:first-child').should('have.text', 'Mon');
    cy.getByTestId('navbar-schedule-link').click();
    cy.getByTestId('schedule-settings-start-of-week-sunday').click();
    cy.getByTestId('week-1').click();
    cy.getByTestId('week-1-calendar-tab-1').click();
    cy.getByTestId('week-1-add-training-button').click();
    cy.getByTestId('edit-training-activity').click();
    cy.get('.v-list-item:first-child').click();
    cy.getByTestId('edit-training-duration').find('input').type('1.5');
    cy.getByTestId('edit-training-save-button').click();
    cy.getByTestId('schedule-settings-unit-of-time-m').click();
    cy.getByTestId('navbar-print-link').click();
    cy.getByTestId('week-1-table').find('thead th:first-child').should('have.text', 'Sun');
    cy.get('.simple-training-card__duration').should('contain.text', '90 m');
  });

  it('adds new trainings', () => {
    cy.visit('/').getByTestId('navbar-schedule-link').click();
    cy.getByTestId('schedule-settings-add-week-button').click();
    cy.getByTestId('week-1').click();
    cy.getByTestId('week-1-calendar-tab-1').click();
    cy.getByTestId('week-1-add-training-button').click();
    cy.getByTestId('edit-training-activity').click();
    cy.get('.v-list-item:first-child').click();
    cy.getByTestId('edit-training-title').type('My training');
    cy.getByTestId('edit-training-location').type('Gym');
    cy.getByTestId('edit-training-duration').find('input').type('1.5');
    cy.getByTestId('edit-training-description').type('Take it easy');
    cy.getByTestId('edit-training-intensity').type('{leftarrow}{rightarrow}');
    cy.getByTestId('edit-training-save-button').click();
    cy.getByTestId('week-1-day-1').find('.training-card').should('exist');
    cy.getByTestId('week-1-copy-button').click();
    cy.getByTestId('week-1-day-1').find('.training-card__delete-button').click();
    cy.getByTestId('week-1-day-1').find('.training-card').should('not.exist');
    cy.getByTestId('week-2').click();
    cy.getByTestId('week-2-calendar-tab-1').click();
    cy.getByTestId('week-2-day-1').find('.training-card').should('exist');
    cy.getByTestId('week-1-delete-button').click();
    cy.getByTestId('week-1-delete-button').click();
    cy.getByTestId('schedule').find('.v-expansion-panel').should('have.length', 0);
  });
});
