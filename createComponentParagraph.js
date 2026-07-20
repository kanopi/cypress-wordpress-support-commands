import {randLine} from '@ngneat/falso';

/**
 * Adds a paragraph component and sets some text.
 *
 * If no value is set then some random text is inserted.
 *
 * Example:
 * cy.createComponentParagraph('my specific text')
 * cy.createComponentParagraph()
 */
Cypress.Commands.add('createComponentParagraph', (content) => {
  cy.selectComponent('Paragraph');
  // The inserted block lives inside the editor canvas iframe.
  cy.editorCanvas().find('p.is-selected')
    .type(content ? content : randLine({lineCount: 1}))
  cy.editorReset();
})
