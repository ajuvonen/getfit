describe('Settings tests', () => {
  beforeEach(() => cy.visit('/'));
  it('changes schedule settings', () => {
    cy.toRoute('settings');
    cy.get('.settings__icon-container input:checked')
      .should('exist')
      .getByTestId('settings-toggle-all-activities')
      .find('input')
      .click();
    cy.get('.settings__icon-container input:checked')
      .should('not.exist')
      .get('#settings-activity-badminton')
      .click();
    cy.get('#settings-activity-walking').click();
    cy.toRoute('schedule');
    cy.getByTestId('schedule-add-week-button').click();
    cy.getByTestId('week-0').click();
    cy.getByTestId('week-0-calendar-tab-0').should('contain.text', 'Monday');
    cy.toRoute('settings');
    cy.getByTestId('settings-start-of-week-sunday').click();
    cy.toRoute('schedule');
    cy.getByTestId('week-0').click();
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
    cy.toRoute('settings');
    cy.getByTestId('settings-unit-of-time-m').click();
    cy.toRoute('schedule');
    cy.getByTestId('week-0').click();
    cy.getByTestId('week-0-add-training-button').click();
    cy.getByTestId('edit-training-duration')
      .find('.v-text-field__suffix')
      .should('contain.text', 'm');
  });

  it('settings work in export view', () => {
    cy.addTraining();
    cy.toRoute('export');
    cy.getByTestId('week-0-table').find('thead th:first-child').should('have.text', 'Mon');
    cy.toRoute('settings');
    cy.getByTestId('settings-start-of-week-sunday').click();
    cy.getByTestId('settings-unit-of-time-m').click();
    cy.toRoute('export');
    cy.getByTestId('week-0-table').find('thead th:first-child').should('have.text', 'Sun');
    cy.get('.simple-training-card__duration').should('contain.text', '90 m');
  });

  it('date settings work', () => {
    cy.toRoute('settings');
    cy.getByTestId('settings-start-date-input').find('input').should('have.value', '');
    cy.getByTestId('settings-week-numbering-assigned').should('not.exist');
    cy.getByTestId('settings-week-numbering-actual').should('not.exist');
    cy.getByTestId('settings-default-start-time-input').should('not.exist');
    cy.getByTestId('settings-start-date-input').click();
    cy.get('.dp__calendar_item:not([aria-disabled])').last().click();
    cy.getByTestId('settings-start-date-input').find('input').invoke('val').as('date');
    cy.getByTestId('settings-week-numbering-assigned').should('exist');
    cy.getByTestId('settings-week-numbering-actual').should('exist');
    cy.getByTestId('settings-default-start-time-input').should('exist');
    cy.getByTestId('settings-default-start-time-input').find('input').should('have.value', '12:00');
    cy.get('@date').then((date) => {
      cy.getByTestId('settings-start-of-week-sunday').click();
      cy.getByTestId('settings-start-date-input').find('input').should('not.have.value', date);
      cy.getByTestId('settings-start-of-week-monday').click();
      cy.getByTestId('settings-start-date-input').find('input').should('have.value', date);
    });
  });
});
