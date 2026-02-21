/**
 * Clicks the publish button
 *
 * Example:
 * cy.publish()
 */
Cypress.Commands.add('publish', (viewPost = true) => {
  cy.get('.edit-post-header button').contains('Publish').click()
  cy.get('.editor-post-publish-panel button').contains('Publish').click()
  if (viewPost) {
    cy.get('.post-publish-panel__postpublish-buttons a', { timeout: 30000 }).contains('View')
      .invoke('attr', 'href')
      .then((href) => {
        cy.visit(href)
      })
  }
})
