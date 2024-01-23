describe('Schedule tests', () => {
  it('changes schedule settings', () => {
    cy.visit('/').getByTestId('navbar-schedule-link').click();
    cy.get('.schedule-settings__icon-container input:checked')
      .should('exist')
      .getByTestId('schedule-settings-toggle-all-activities')
      .find('input')
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
      .getByTestId('week-0-add-training-button')
      .click();
    cy.getByTestId('edit-training-activity').click();
    cy.get('.v-list-item').should('have.length', 2);
    cy.get('.v-list-item')
      .first()
      .should('contain.text', 'Badminton')
      .get('.v-list-item')
      .last()
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

  it('settings work in export view', () => {
    cy.visit('/').getByTestId('navbar-schedule-link').click();
    cy.addTraining();
    cy.getByTestId('navbar-export-link').click();
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
    cy.getByTestId('navbar-export-link').click();
    cy.getByTestId('week-0-table').find('thead th:first-child').should('have.text', 'Sun');
    cy.get('.simple-training-card__duration').should('contain.text', '90 m');
  });

  it('date settings work', () => {
    cy.visit('/').getByTestId('navbar-schedule-link').click();
    cy.getByTestId('schedule-settings-start-date-input').find('input').should('have.value', '');
    cy.getByTestId('schedule-settings-week-numbering-assigned').should('not.exist');
    cy.getByTestId('schedule-settings-week-numbering-actual').should('not.exist');
    cy.getByTestId('schedule-settings-default-start-time-input').should('not.exist');
    cy.getByTestId('schedule-settings-start-date-input').click();
    cy.get('.dp__calendar_item:not([aria-disabled])').last().click();
    cy.getByTestId('schedule-settings-start-date-input').find('input').invoke('val').as('date');
    cy.getByTestId('schedule-settings-week-numbering-assigned').should('exist');
    cy.getByTestId('schedule-settings-week-numbering-actual').should('exist');
    cy.getByTestId('schedule-settings-default-start-time-input').should('exist');
    cy.getByTestId('schedule-settings-default-start-time-input')
      .find('input')
      .should('have.value', '12:00');
    cy.get('@date').then((date) => {
      cy.getByTestId('schedule-settings-start-of-week-sunday').click();
      cy.getByTestId('schedule-settings-start-date-input')
        .find('input')
        .should('not.have.value', date);
      cy.getByTestId('schedule-settings-start-of-week-monday').click();
      cy.getByTestId('schedule-settings-start-date-input').find('input').should('have.value', date);
    });
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

  it('copies and moves trainings', () => {
    cy.visit('/').getByTestId('navbar-schedule-link').click();
    cy.addTraining();
    cy.get('.training-card__action-button').click();
    cy.get('.training-card__copy-button').click();
    cy.get('.training-card__copy-button + .v-list-group__items').click();
    cy.get('.training-card__copy-button + .v-list-group__items .v-list-item').eq(2).click();
    cy.get('.training-card__move-button').click();
    cy.get('.training-card__move-button + .v-list-group__items').click();
    cy.get('.training-card__move-button + .v-list-group__items .v-list-item').eq(3).click();
    cy.get('.training-card').should('not.exist');
    cy.getByTestId('week-0-calendar-tab-1').click();
    cy.get('.training-card').should('exist');
    cy.getByTestId('week-0-calendar-tab-2').click();
    cy.get('.training-card').should('exist');
  });

  it('resets schedule', () => {
    cy.visit('/').getByTestId('navbar-schedule-link').click();
    cy.getByTestId('schedule-settings-start-of-week-sunday')
    cy.addTraining();
    cy.getByTestId('schedule-settings-reset-button').click();
    cy.getByTestId('confirm-dialog-confirm-button').click();
    cy.location('pathname').should('eq', '/getfit/');
    cy.getByTestId('navbar-schedule-link').click();
    cy.getByTestId('schedule-settings-start-of-week-sunday').should('not.be.selected');
    cy.getByTestId('week-0').should('not.exist');
  });

  it('resets schedule from export view', () => {
    cy.visit('/').getByTestId('navbar-schedule-link').click();
    cy.getByTestId('schedule-settings-start-of-week-sunday')
    cy.addTraining();
    cy.getByTestId('navbar-export-link').click();
    cy.getByTestId('export-view-reset-button').click();
    cy.getByTestId('confirm-dialog-confirm-button').click();
    cy.location('pathname').should('eq', '/getfit/');
    cy.getByTestId('navbar-schedule-link').click();
    cy.getByTestId('schedule-settings-start-of-week-sunday').should('not.be.selected');
    cy.getByTestId('week-0').should('not.exist');
  });
});
