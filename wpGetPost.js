/**
 * Get a published post as a JSON object { ID, post_title, post_name }.
 *
 * @param {string} postType - The WordPress post type to query.
 */
Cypress.Commands.add('wpGetPost', (postType) => {
	cy.wp(`post list --post_type=${postType} --post_status=publish --posts_per_page=1 --format=json --fields=ID,post_title,post_name`)
	return cy.get('@wpCliOutput').then((stdout) => {
		const posts = JSON.parse(stdout.trim())
		expect(posts).to.have.length.gte(1)
		return posts[0]
	})
})
