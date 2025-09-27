/**
 * Sets the post/page title
 *
 * Example:
 * cy.setTitle('Test Title')
 */
Cypress.Commands.add('setTitle', (title) => {
  cy.get('.wp-block-post-title').should('exist')
  cy.get('.wp-block-post-title').clear().type(title);
})
