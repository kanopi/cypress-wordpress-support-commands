/**
 * URL should return a 404 response
 *
 * Example:
 * cy.anonUrl404('/post/post-title')
 */
Cypress.Commands.add('anonUrl404', (url) => {
  cy.logout()
  cy.request({
    url: url,
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(404);
  });
})
