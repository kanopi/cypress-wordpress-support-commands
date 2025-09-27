/**
 * Enter the password for a password protected post/page.
 *
 * Example:
 * cy.enterPostPassword('password')
 */
Cypress.Commands.add('enterPostPassword', (password) => {
	cy.get('.post-password-form input[type="password"]').clear().type(password);
	cy.get('.post-password-form input[type="submit"]').click();
})
