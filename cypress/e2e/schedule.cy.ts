describe('Schedule tests', () => {
  beforeEach(() => cy.visit('/'));
  it('adds new trainings', () => {
    cy.toRoute('schedule');
    cy.getByTestId('schedule-add-week-button').click();
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
    cy.getByTestId('week-0').click();
    cy.getByTestId('week-0-delete-button').click();
    cy.getByTestId('confirm-dialog-confirm-button').click();
    cy.getByTestId('schedule').should('not.exist');
  });

  it('copies and moves trainings', () => {
    cy.addTraining();
    cy.get('.training-card__action-button').click();
    cy.get('.training-card-actions__copy').contains('Copy').click();
    cy.get('.training-card-actions__copy').contains('Week 1').click();
    cy.get('.training-card-actions__copy').contains('Tuesday').click();
    cy.get('.training-card-actions__move').contains('Move').click();
    cy.get('.training-card-actions__move').contains('Week 1').click();
    cy.get('.training-card-actions__move').contains('Wednesday').click();
    cy.get('.training-card').should('not.exist');
    cy.getByTestId('week-0-calendar-tab-1').click();
    cy.get('.training-card').should('exist');
    cy.getByTestId('week-0-calendar-tab-2').click();
    cy.get('.training-card').should('exist');
    cy.get('.training-card__action-button:visible').click();
    cy.get('.training-card-actions__copy').contains('Copy').click();
    cy.get('.training-card-actions__copy').contains('New Week').click();
    cy.get('.training-card-actions__copy .v-list-item:visible').contains('Monday').click();
    cy.getByTestId('week-1').should('exist');
    cy.getByTestId('schedule').contains('Week 2').click({force: true});
    cy.getByTestId('week-1-calendar-tab-0').click();
    cy.getByTestId('week-1-day-0').find('.training-card').should('exist');
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

  it('completes and rates trainings', () => {
    cy.addTraining();
    cy.get('.training-card__action-button').click();
    cy.get('.training-card__complete-button').click();
    cy.get('.training-card__rating .v-selection-control:nth-child(1)').should('not.have.class', 'training-card__filled-star');
    cy.get('.training-card__rating .v-selection-control:nth-child(2)').should('not.have.class', 'training-card__filled-star');
    cy.get('.training-card__rating .v-selection-control:nth-child(3)').should('not.have.class', 'training-card__filled-star');
    cy.get('.training-card__rating .v-selection-control:nth-child(4)').should('not.have.class', 'training-card__filled-star');
    cy.get('.training-card__rating .v-selection-control:nth-child(5)').should('not.have.class', 'training-card__filled-star');
    cy.get('.training-card__rating input').eq(0).click();
    cy.get('.training-card__rating .v-selection-control:nth-child(1)').should('have.class', 'training-card__filled-star');
    cy.get('.training-card__rating input').eq(1).click();
    cy.get('.training-card__rating .v-selection-control:nth-child(2)').should('have.class', 'training-card__filled-star');
    cy.get('.training-card__rating input').eq(2).click();
    cy.get('.training-card__rating .v-selection-control:nth-child(3)').should('have.class', 'training-card__filled-star');
    cy.get('.training-card__rating input').eq(3).click();
    cy.get('.training-card__rating .v-selection-control:nth-child(4)').should('have.class', 'training-card__filled-star');
    cy.get('.training-card__rating input').eq(4).click();
    cy.get('.training-card__rating .v-selection-control:nth-child(5)').should('have.class', 'training-card__filled-star');
    cy.get('.training-card__rating input').eq(4).click();
    cy.get('.training-card__rating .v-selection-control:nth-child(1)').should('not.have.class', 'training-card__filled-star');
    cy.get('.training-card__rating .v-selection-control:nth-child(2)').should('not.have.class', 'training-card__filled-star');
    cy.get('.training-card__rating .v-selection-control:nth-child(3)').should('not.have.class', 'training-card__filled-star');
    cy.get('.training-card__rating .v-selection-control:nth-child(4)').should('not.have.class', 'training-card__filled-star');
    cy.get('.training-card__rating .v-selection-control:nth-child(5)').should('not.have.class', 'training-card__filled-star');
  });

  it('displays instructions', () => {
    cy.addTraining();
    cy.get('.training-card__more-button').click();
    cy.get('.training-card__instructions').should('have.text', 'Take it easy');
    cy.get('.training-card__close-instructions-button').click();
    cy.get('.training-card__instructions').should('not.exist');
  });
});
