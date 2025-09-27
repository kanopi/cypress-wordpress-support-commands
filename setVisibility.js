/**
 * Sets the visibility option for a post/page.  Defaults to "public"
 *
 * Type options: public, private, password
 *
 * If type is "password", the password defaults to "password"
 *
 * Examples:
 * cy.setVisibility() // defaults to public.
 * cy.setVisibility('public')
 * cy.setVisibility('private')
 * cy.setVisibility('password') // default password is used.
 * cy.setVisibility('password', '123') // password is set to 123.
 */
Cypress.Commands.add('setVisibility', (type = 'public', password = 'password') => {
  cy.get('.editor-post-status__toggle').click();
  cy.get('.components-popover__content').then(() => {
    if (type == 'public') {
      cy.get('input[value="public"]').check();
    } else if (type == 'private') {
      cy.get('input[value="private"]').check();
    } else if (type == 'password') {
      cy.get('.components-popover__content input[value="publish"]').check();
      // Ids/classes are dynanic so look for the label and cross-reference the for attribute.
      cy.get('.components-popover__content label').contains('Password protected')
        .should('have.attr', 'for')
        .then((forAttrValue) => {
          cy.log(forAttrValue)
          cy.get(`#${forAttrValue}`).check();
        });
      cy.get(`.editor-change-status__password-input input`)
        .clear()
        .type(password)
    }
  });
  cy.get('.block-editor-inspector-popover-header__action')

})
