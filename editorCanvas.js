/**
 * Helpers for interacting with the block editor canvas.
 *
 * Since WordPress 6.3 the block editor renders the post content (the title and
 * all blocks) inside an <iframe name="editor-canvas">. As of WordPress 7.0 this
 * iframe is used unconditionally, so selectors that target block content can no
 * longer be found from the top document with a plain `cy.get()`. The editor
 * "chrome" (header, sidebars, inspector, popovers, inserter) still lives in the
 * top document and does NOT need these helpers.
 *
 * `cy.editorCanvas()` yields the canvas body so block-content selectors can be
 * scoped correctly. `cy.getInEditor(selector)` resolves a selector whether it
 * lives in the canvas or the top document, which is useful for commands whose
 * target can be in either place (e.g. a media button rendered inside an image
 * block vs. inside a meta box).
 *
 * Both fall back to the non-iframed editor (`.editor-styles-wrapper` / the top
 * document) so the commands keep working on WordPress versions that do not
 * iframe the canvas.
 */

/**
 * Yields the block editor canvas body (or the non-iframed content wrapper).
 *
 * Example:
 * cy.editorCanvas().find('.wp-block-post-title')
 */
Cypress.Commands.add('editorCanvas', () => {
  return cy.get('body', { log: false }).then(($body) => {
    if ($body.find('iframe[name="editor-canvas"]').length) {
      return cy.get('iframe[name="editor-canvas"]', { timeout: 30000 })
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
    }
    // Pre-6.3 / non-iframed editor: content lives in .editor-styles-wrapper.
    return cy.get('.editor-styles-wrapper');
  });
});

/**
 * Yields elements matching `selector` from the editor canvas iframe when they
 * exist there, otherwise from the top document. Handy for selectors that may be
 * inside block content or in the surrounding editor chrome depending on caller.
 *
 * Example:
 * cy.getInEditor('.is-selected.wp-block-image').find('button')
 */
Cypress.Commands.add('getInEditor', (selector) => {
  return cy.document({ log: false }).then((topDoc) => {
    const iframe = topDoc.querySelector('iframe[name="editor-canvas"]');
    const canvasDoc = iframe && (iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document));
    if (canvasDoc && canvasDoc.querySelector(selector)) {
      return cy.wrap(canvasDoc.body, { log: false }).find(selector);
    }
    return cy.get(selector);
  });
});
