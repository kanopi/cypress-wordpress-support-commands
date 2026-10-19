/**
 * Update a post title via WP-CLI.
 *
 * Example:
 * cy.wpUpdateTitle(123, "Doctor's Note")
 *
 * @param {number|string} postId - The post ID to update.
 * @param {string} title - The new title.
 */

// Single-quote a value for the shell, so spaces, apostrophes, double quotes,
// $ and backticks reach WP-CLI as written instead of being interpreted. A
// single quote inside the value ends the quoting, adds an escaped quote and
// resumes. On Pantheon, cy.wp() wraps the whole command in double quotes for
// SSH, so a title containing ", $ or a backtick still breaks there.
const shellQuote = (value) => `'${String(value).replace(/'/g, `'\\''`)}'`;

Cypress.Commands.add('wpUpdateTitle', (postId, title) => {
  expect(String(postId), 'post ID').to.match(/^\d+$/);
  cy.wp(`post update ${postId} --post_title=${shellQuote(title)}`);
});
