/**
 * Update a post title via WP-CLI.
 *
 * @param {number|string} postId - The post ID to update.
 * @param {string} title - The new title.
 */
Cypress.Commands.add('wpUpdateTitle', (postId, title) => {
	cy.wp(`post update ${postId} --post_title="${title}"`)
})
