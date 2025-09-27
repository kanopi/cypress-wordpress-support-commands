/**
 * Clicks the update button
 *
 * Passing "false" will just publish and not view the post afterwards
 *
 * Example:
 * cy.update()
 * cy.update(false)
 */
Cypress.Commands.add('update', (viewPost = true) => {
  const postUpdate = 'postUpdate-' + Math.random();
  cy.intercept('POST', '/wp-admin/admin-ajax.php').as(postUpdate)
  cy.get('.edit-post-header button').contains('Update').click()
  cy.wait('@' + postUpdate).its('response.statusCode').should('eq', 200)
  if (viewPost) {
    cy.get('.components-snackbar__content a').contains('View').click()
  }
})
