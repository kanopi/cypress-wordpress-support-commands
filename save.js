/**
 * Clicks the save button
 *
 * Passing "false" will not view the post afterwards.
 *
 * Example:
 * cy.save()
 * cy.save(false)
 */
Cypress.Commands.add('save', (viewPost = true) => {
  const postSave = 'postSave-' + Math.random();
  cy.intercept('POST', '/wp-admin/admin-ajax.php').as(postSave)
  cy.get('.edit-post-header button').contains('Save').click()
  cy.wait('@' + postSave).its('response.statusCode').should('eq', 200)
  if (viewPost) {
    cy.get('.components-snackbar__content a').contains('View').click()
  }
})
