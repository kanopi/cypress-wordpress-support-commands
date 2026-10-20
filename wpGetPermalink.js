/**
 * Get a post's frontend URL as a path relative to the site, for cy.visit().
 *
 * Example:
 * cy.wpGetPermalink(123).then((path) => cy.visit(path))
 *
 * @param {number|string} postId - The post ID.
 */
Cypress.Commands.add('wpGetPermalink', (postId) => {
  expect(String(postId), 'post ID').to.match(/^\d+$/);
  cy.wp(`post get ${postId} --field=url`);
  return cy.get('@wpCliOutput').then((stdout) => {
    // Drop the scheme and host; the path and any query string remain.
    return stdout.trim().replace(/^https?:\/\/[^/]+/, '');
  });
});
