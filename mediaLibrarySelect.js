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
    const ajaxMediaLibrarySelect = 'mediaLibrary-' + Math.random();
    cy.intercept('POST', '/wp-admin/admin-ajax.php').as(ajaxMediaLibrarySelect)
    cy.get('#media-search-input').type(fileName);
    cy.wait('@' + ajaxMediaLibrarySelect).its('response.statusCode').should('eq', 200)
    cy.get('.attachments-wrapper').then(() => {
      cy.wait(1000)
      cy.get('.attachment').first().click();
    });
    cy.get('.media-toolbar-primary button').click()
  })
});
