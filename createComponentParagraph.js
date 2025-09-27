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
  if (content) {
    cy.get('p.is-selected')
      .type(content)
  } else {
    cy.get('p.is-selected')
      .type(randLine({lineCount: 1}))
  }
  cy.editorReset();
})
