Cypress.Commands.add('selectComponent', (componentName, variationName) => {
  cy.get('.editor-document-tools .editor-document-tools__inserter-toggle')
    .scrollIntoView()
    .click({'force': true})
    .then(($btn) => {
      cy.get('[aria-label="Block Library"] .components-input-control__input')
        .scrollIntoView()
        .wait(500)
        .type(componentName, {delay: 0, force: true}).wait(500);
      cy.get('[aria-label="Block Library"] .block-editor-block-types-list__list-item')
        .contains(componentName)
        .wait(500)
        .click()
        .then(() => {
          // Close the sidebar when we've selected the component.
          cy.get('.editor-document-tools .editor-document-tools__inserter-toggle[aria-pressed="true"]').click()
        });
    })
})
