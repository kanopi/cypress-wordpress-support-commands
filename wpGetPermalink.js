/**
 * Get a post's frontend URL path (relative, for use with cy.visit()).
 *
 * @param {number|string} postId - The post ID.
 */
Cypress.Commands.add('wpGetPermalink', (postId) => {
	cy.wp(`post get ${postId} --field=url`)
	return cy.get('@wpCliOutput').then((stdout) => {
		const url = stdout.trim()
		// Convert absolute URL to relative path for cy.visit()
		return url.replace(/^https?:\/\/[^/]+/, '')
	})
})
