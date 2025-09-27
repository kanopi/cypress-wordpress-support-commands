/**
 * Clicks the publish button
 *
 * Example:
 * cy.publish()
 */
Cypress.Commands.add('publish', (viewPost = true) => {
  cy.get('.edit-post-header button').contains('Publish').click()
  const postPublish = 'postPublish-' + Math.random();
  cy.intercept('POST', '/wp-admin/admin-ajax.php').as(postPublish)
  cy.get('.editor-post-publish-panel button').contains('Publish').click()
  cy.wait('@' + postPublish).its('response.statusCode').should('eq', 200)
  if (viewPost) {
    cy.get('.post-publish-panel__postpublish-buttons a').contains('View').click()
  }
})
