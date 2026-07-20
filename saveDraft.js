/**
 * Clicks the save draft button in the header.
 *
 * Example:
 * cy.saveDraft()
 */
Cypress.Commands.add('saveDraft', (viewPost = true) => {
  const saveDraft = 'saveDraft-' + Math.random();
  cy.intercept('POST', '/wp-json/wp/v2/*/*?_locale=user').as(saveDraft)
  // The "Save draft" button only renders while the post is dirty, and as of
  // WordPress 7.0 the standalone `.editor-post-save-draft` class is not always
  // present. Match by aria-label (stable in 7.0) with the legacy class as a
  // fallback, and accept 200 or 201 from the REST save.
  cy.get('button[aria-label="Save draft"], .edit-post-header .editor-post-save-draft', {
    timeout: 20000,
  })
    .filter(':visible')
    .first()
    .click()
  cy.wait('@' + saveDraft).its('response.statusCode').should('be.oneOf', [200, 201])
})
