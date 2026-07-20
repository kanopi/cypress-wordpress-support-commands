/**
 * Clicks the page to get the "Add Component" button back.
 *
 * Typically used after add/editing a component.
 */
Cypress.Commands.add('editorReset', () => {
  // The title lives inside the editor canvas iframe as of WordPress 6.3+.
  // Clicking the title deselects the current block. We intentionally do NOT
  // call .blur() here: because the block lives in an iframe, the top document's
  // focused element is the <iframe> itself, and cy.blur() on the title element
  // throws ("can only be called on the focused element").
  cy.editorCanvas().find('.wp-block-post-title').click({force: true})
})
