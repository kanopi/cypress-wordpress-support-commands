/**
 * Adds a file to the media library
 *
 * File should be store in 'cypress/fixtures/'
 *
 * Examples:
 * cy.mediaLibraryAdd('sample.png');
 */
Cypress.Commands.add("mediaLibraryAdd", (fileName) => {
  cy.visit('/wp-admin/media-new.php?browser-uploader')
  cy.get('#async-upload')
    .selectFile('cypress/fixtures/' + fileName, {force: true});
  cy.get('#html-upload').click({force: true})
  cy.get('h1').should('contain.text', 'Media Library')
});
