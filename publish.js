/**
 * Publishes the current post/page.
 *
 * Example:
 * cy.publish()
 * cy.publish(false) // publish without navigating to the published post
 *
 * The WordPress 7.0 pre-publish UI is unreliable under Cypress — in Chrome the
 * publish toggle frequently fails to open the pre-publish panel, and a
 * programmatic savePost() either persists the post as a draft or hangs (e.g.
 * from a never-saved auto-draft after setting visibility). Instead, publish
 * deterministically with a single REST update to the post's own endpoint via
 * wp.apiFetch (which carries the auth nonce), sending the full edited payload so
 * title/content/visibility persist in one shot regardless of prior save state.
 */
Cypress.Commands.add('publish', (viewPost = true) => {
  let permalink;

  cy.window().then((win) => {
    const editor = win.wp.data.select('core/editor');
    const blockEditor = win.wp.data.select('core/block-editor');
    const post = editor.getCurrentPost();
    const self = post && post._links && post._links.self && post._links.self[0];
    const url = self && self.href;
    expect(url, 'post REST self href').to.be.a('string');

    const data = {
      status: 'publish',
      title: editor.getEditedPostAttribute('title') || '',
      content: win.wp.blocks.serialize(blockEditor.getBlocks()),
      excerpt: editor.getEditedPostAttribute('excerpt') || '',
      password: editor.getEditedPostAttribute('password') || '',
      featured_media: editor.getEditedPostAttribute('featured_media') || 0,
    };

    return Cypress.Promise.resolve(
      win.wp.apiFetch({ url, method: 'POST', data })
    ).then((updated) => {
      expect(updated.status, 'published status').to.be.oneOf(['publish', 'private', 'future']);
      permalink = updated.link;
    });
  });

  if (viewPost) {
    cy.then(() => {
      expect(permalink, 'permalink').to.be.a('string').and.not.include('auto-draft');
      cy.visit(permalink);
    });
  }
});
