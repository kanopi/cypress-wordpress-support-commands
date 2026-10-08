/**
 * Catches common ajax events when loading a post/page edit page
 *
 * Example:
 * cy.visitEditPage('/wp-admin/post-new.php')
 */
Cypress.Commands.add('visitEditPage', (url) => {
  // Intercept common ajax requests when loading an edit page.
  // Deliberately not /wp/v2/taxonomies: WordPress 7.1 added it to the block
  // editor's REST preload list in wp-admin/edit-form-blocks.php, so apiFetch
  // serves it from inline data and no request reaches the network for an
  // intercept to see.
  const ajaxBlocks = 'ajaxBlocks-' + Math.random();
  cy.intercept('GET', '/wp-json/wp/v2/blocks?*').as(ajaxBlocks)

  const ajaxPosts = 'ajaxPosts-' + Math.random();
  cy.intercept('GET', '/wp-json/wp/v2/posts/*').as(ajaxPosts)

  const ajaxWpPatternCategory = 'ajaxWpPatternCategory-' + Math.random();
  cy.intercept('GET', '/wp-json/wp/v2/wp_pattern_category?context=view&per_page=100&_fields=id%2Cname%2Cdescription%2Cslug&_locale=user').as(ajaxWpPatternCategory)

  // Load the page
  cy.visit(url);
  cy.get('.edit-post-layout', { timeout: 30000 }).should('exist')

  // Wait for our ajax requests.
  cy.wait('@' + ajaxBlocks).its('response.statusCode').should('eq', 200)
  cy.wait('@' + ajaxWpPatternCategory).its('response.statusCode').should('eq', 200)
})
