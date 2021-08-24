// @ts-ignore
describe('Game', () => {
    it('creates a game', () => {
        cy.visit('/');
        cy.contains('Welcome to Team Bingo');
        cy.contains('Create New Game').click();
        cy.url().should('include', '/game');
    });
});