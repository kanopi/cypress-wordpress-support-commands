import {randLine} from '@ngneat/falso';
/**
 * Adds an Image component and uploads a file
 *
 * Files should be in the 'fixtures' folder.
 *
 * Example:
 * cy.createComponentImage('image-sample_01.png')
 * cy.createComponentImage('image-sample_01.png', true)
 */
Cypress.Commands.add('createComponentImage', (fileName, useMediaLibrary = false) => {
  cy.saveDraft() // Make sure there is a post ID.
  cy.selectComponent('Image');
  if (useMediaLibrary) {
    cy.mediaLibrarySelect('.is-selected.wp-block-image', fileName);
  } else {
    cy.get('.is-selected.wp-block-image').then(() => {
      cy.get('input[type=file]')
        .selectFile('cypress/fixtures/' + fileName, {force: true});
      // Tried with do this with an intercept but there were inconsistent
      // failures so just using wait().
      cy.wait(5000)
      cy.get('.block-editor-block-inspector__tabs label')
        .contains('Alternative text')
        .next()
        .type(randLine({lineCount: 1}))
    })
  }
  cy.editorReset();
})
