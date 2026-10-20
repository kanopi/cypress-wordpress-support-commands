/**
 * Get the newest published post of a type as { ID, post_title, post_name }.
 *
 * Example:
 * cy.wpGetPost('page').then((post) => cy.visit(`/?page_id=${post.ID}`))
 *
 * @param {string} postType - The WordPress post type to query.
 */
Cypress.Commands.add('wpGetPost', (postType) => {
  // The post type goes into a shell command unquoted, so only allow a slug.
  expect(postType, 'post type').to.match(/^[a-z0-9_-]+$/i);
  cy.wp(`post list --post_type=${postType} --post_status=publish --orderby=date --order=DESC --posts_per_page=1 --format=json --fields=ID,post_title,post_name`);
  return cy.get('@wpCliOutput').then((stdout) => {
    const posts = JSON.parse(stdout.trim());
    expect(posts, `published ${postType} posts`).to.have.length.gte(1);
    return posts[0];
  });
});
