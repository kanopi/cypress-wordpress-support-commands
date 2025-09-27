/**
 * Clicks the save draft button in the header.
 *
 * Example:
 * cy.saveDraft()
 */
Cypress.Commands.add('saveDraft', (viewPost = true) => {
  const saveDraft = 'saveDraft-' + Math.random();
  cy.intercept('POST', '/wp-json/wp/v2/*/*?_locale=user').as(saveDraft)
  cy.get('.edit-post-header .editor-post-save-draft').click()
  cy.wait('@' + saveDraft).its('response.statusCode').should('eq', 200)
})
