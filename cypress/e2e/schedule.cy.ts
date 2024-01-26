describe('Schedule tests', () => {
  beforeEach(() => cy.visit('/'));
  it('adds new trainings', () => {
    cy.toRoute('schedule');
    cy.getByTestId('schedule-add-week-button').click();
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
    cy.toRoute('settings');
    cy.getByTestId('settings-start-of-week-sunday');
    cy.addTraining();
    cy.getByTestId('schedule-reset-button').click();
    cy.getByTestId('confirm-dialog-confirm-button').click();
    cy.location('pathname').should('eq', '/getfit/');
    cy.toRoute('settings');
    cy.getByTestId('settings-start-of-week-sunday').should('not.be.selected');
    cy.toRoute('schedule');
    cy.getByTestId('week-0').should('not.exist');
  });

  it('resets schedule from export view', () => {
    cy.toRoute('settings');
    cy.getByTestId('settings-start-of-week-sunday').click();
    cy.addTraining();
    cy.toRoute('export');
    cy.getByTestId('export-reset-button').click();
    cy.getByTestId('confirm-dialog-confirm-button').click();
    cy.location('pathname').should('eq', '/getfit/');
    cy.toRoute('settings');
    cy.getByTestId('settings-start-of-week-sunday').should('not.be.selected');
    cy.toRoute('schedule');
    cy.getByTestId('week-0').should('not.exist');
  });
});
