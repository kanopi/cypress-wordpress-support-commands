/**
 * Open a media browser modal and selects an existing media item
 *
 * Files should be in the 'fixtures' folder.
 *
 * Examples:
 * cy.mediaLibrarySelect('#field_media_assets-media-library-wrapper', 'sample.png');
 * cy.mediaLibrarySelect('#field_media_assets-media-library-wrapper', 'sample.png', 'image');
 */
Cypress.Commands.add("mediaLibrarySelect", (selector, fileName) => {
  const ajaxMediaLibrarySelect = 'mediaLibrary-' + Math.random();
  cy.intercept('POST', '/wp-admin/admin-ajax.php').as(ajaxMediaLibrarySelect)
  cy.get(selector + ' button').contains('Media Library').click();
  cy.wait('@' + ajaxMediaLibrarySelect).its('response.statusCode').should('eq', 200)

  cy.get('.media-modal-content').then(() => {
    // WP Media Folder plugin replaces the standard media library grid with a
    // folder-based view. When active, searching returns zero actual image
    // attachments (only folders). Calling displayAllMedia() via the plugin's
    // JS API bypasses the folder view and shows a flat file listing.
    // This is a no-op on sites without the plugin since the check is guarded
    // by a typeof check on the global wpmfFoldersFiltersModule object.
    cy.window().then((win) => {
      if (typeof win.wpmfFoldersFiltersModule !== 'undefined') {
        win.wpmfFoldersFiltersModule.displayAllMedia('#wpmf_all_media');
      }
    });
    cy.wait(1000)

    const ajaxMediaLibrarySelect = 'mediaLibrary-' + Math.random();
    cy.intercept('POST', '/wp-admin/admin-ajax.php').as(ajaxMediaLibrarySelect)
    cy.get('#media-search-input').type(fileName);
    cy.wait('@' + ajaxMediaLibrarySelect).its('response.statusCode').should('eq', 200)
    cy.get('.attachments-wrapper').then(() => {
      cy.wait(1000)
      cy.get('.attachment').first().click();
    });
    cy.get('.media-toolbar-primary button').should('not.be.disabled').click()
  })
});
