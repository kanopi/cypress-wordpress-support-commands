/**
 * Sets the post/page title
 *
 * Example:
 * cy.setTitle('Test Title')
 */
Cypress.Commands.add('setTitle', (title) => {
  // The title is a contenteditable <h1> inside the editor canvas, so it must be
  // scoped to the canvas and cleared with a selection+delete rather than
  // cy.clear() (which only works on inputs/textareas).
  cy.editorCanvas().find('.wp-block-post-title').should('exist')
  cy.editorCanvas().find('.wp-block-post-title').click().type('{selectall}{backspace}' + title);
})
