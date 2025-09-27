/**
 * Catches common ajax events when loading a post/page edit page
 *
 * Example:
 * cy.visitEditPage('/wp-admin/post-new.php')
 */
Cypress.Commands.add('visitEditPage', (url) => {
  // Intercept common ajax requests when loading an edit page.
  const ajaxBlocks = 'ajaxBlocks-' + Math.random();
  cy.intercept('GET', '/wp-json/wp/v2/blocks?*').as(ajaxBlocks)

  const ajaxUsers = 'ajaxUsers-' + Math.random();
  cy.intercept('GET', '/wp-json/wp/v2/users?*').as(ajaxUsers)

  const ajaxTaxonomies = 'ajaxTaxonomies-' + Math.random();
  cy.intercept('GET', '/wp-json/wp/v2/taxonomies?*').as(ajaxTaxonomies)

  const ajaxPosts = 'ajaxPosts-' + Math.random();
  cy.intercept('GET', '/wp-json/wp/v2/posts/*').as(ajaxPosts)

  const ajaxWpPatternCategory = 'ajaxWpPatternCategory-' + Math.random();
  cy.intercept('GET', '/wp-json/wp/v2/wp_pattern_category?context=view&per_page=100&_fields=id%2Cname%2Cdescription%2Cslug&_locale=user').as(ajaxWpPatternCategory)

  // Load the page
  cy.visit(url);
  cy.get('.edit-post-layout').should('exist')

  // Wait for our ajax requests.
  cy.wait('@' + ajaxBlocks).its('response.statusCode').should('eq', 200)
  cy.wait('@' + ajaxUsers).its('response.statusCode').should('eq', 200)
  cy.wait('@' + ajaxTaxonomies).its('response.statusCode').should('eq', 200)
  cy.wait('@' + ajaxWpPatternCategory).its('response.statusCode').should('eq', 200)
})
