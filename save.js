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
  cy.get('.edit-post-header button').contains('Save').click()
  if (viewPost) {
    cy.window().then((win) => {
      const permalink = win.wp.data.select('core/editor').getPermalink()
      expect(permalink).to.be.a('string')
      cy.visit(permalink)
    })
  }
})
