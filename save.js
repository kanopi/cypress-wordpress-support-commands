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
    // Use .should() so Cypress retries until the permalink updates from /auto-draft/
    cy.window().should((win) => {
      const permalink = win.wp.data.select('core/editor').getPermalink()
      expect(permalink).to.be.a('string')
      expect(permalink).to.not.include('/auto-draft')
    }).then((win) => {
      const permalink = win.wp.data.select('core/editor').getPermalink()
      cy.visit(permalink)
    })
  }
})
