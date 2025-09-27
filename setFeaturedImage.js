/**
 * Sets the featured image.
 *
 * File should be store in 'cypress/fixtures/'
 *
 * Example:
 * cy.setFeaturedImage('image-sample_01.png')
 */
Cypress.Commands.add('setFeaturedImage', (filename) => {
  cy.get('[aria-label="Editor settings"] button[data-tab-id="edit-post/document"]').click();

  cy.get('.editor-post-featured-image')
    .contains('featured image')
    .scrollIntoView();

  cy.mediaLibraryUpload('.editor-post-featured-image', filename)
})
