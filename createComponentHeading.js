import {randLine} from '@ngneat/falso';
/**
 * Adds a heading component and sets some text.
 *
 * If no value is set then some random text is inserted.
 *
 * Example:
 * cy.createComponentHeading('my specific text')
 * cy.createComponentHeading()
 */
Cypress.Commands.add('createComponentHeading', (content) => {
  cy.selectComponent('Heading');
  // The inserted block lives inside the editor canvas iframe. Match by
  // data-type because the data-title now includes the heading level
  // (e.g. "Heading 2") as of WordPress 7.0.
  cy.editorCanvas().find('.is-selected[data-type="core/heading"]')
    .type(content ? content : randLine({lineCount: 1}))
  cy.editorReset();
})
