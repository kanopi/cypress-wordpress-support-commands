/**
 * Clicks the page to get the "Add Component" button back.
 *
 * Typically used after add/editing a component.
 */
Cypress.Commands.add('editorReset', () => {
  cy.get('.wp-block-post-title').click({force: true}).blur()
})
