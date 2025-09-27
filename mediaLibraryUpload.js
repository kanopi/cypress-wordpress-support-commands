/**
 * Adds a file to the media library through the media modal
 *
 * File should be store in 'cypress/fixtures/'
 *
 * Examples:
 * cy.mediaLibraryUpload('sample.png');
 */
Cypress.Commands.add("mediaLibraryUpload", (selector, fileName) => {
  // const ajaxMediaLibraryLoad = 'mediaLibraryLoad-' + Math.random();
  // cy.intercept('POST', '/wp-admin/admin-ajax.php')
  // 	.as(ajaxMediaLibraryLoad)
  cy.get(selector + ' button').click()
  cy.wait(2000) // Simple wait.  We don't always get an ajax request.
  cy.get('.media-modal-content').then(() => {
    const ajaxMediaLibraryUpload = 'mediaLibraryUpload-' + Math.random();
    cy.intercept('POST', '/wp-admin/async-upload.php')
      .as(ajaxMediaLibraryUpload)
    cy.get('#menu-item-upload').click();
    cy.get('input[type="file"]').selectFile('cypress/fixtures/' + fileName, {force: true});
    cy.wait('@' + ajaxMediaLibraryUpload)
      .its('response.statusCode')
      .should('eq', 200)
    cy.wait(1000)
    cy.get('.media-toolbar-primary button').click()
  })
});
