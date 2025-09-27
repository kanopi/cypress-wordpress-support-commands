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
  if (content) {
    cy.get('.is-selected[data-title="Heading"]')
      .type(content)
  } else {
    cy.get('.is-selected[data-title="Heading"]')
      .type(randLine({lineCount: 1}))
  }
  cy.editorReset();
})
