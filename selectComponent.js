Cypress.Commands.add('selectComponent', (componentName, variationName) => {
  cy.get('.editor-document-tools .editor-document-tools__inserter-toggle')
    .scrollIntoView()
    .click({'force': true})
    .then(($btn) => {
      // The inserter can keep the previous search when it reopens, which turns
      // a second lookup into e.g. "HeadingParagraph" with no results, so clear
      // the field before typing.
      cy.get('.block-editor-tabbed-sidebar .components-input-control__input')
        .scrollIntoView()
        .should('be.visible')
        .clear({force: true})
        .type(componentName, {delay: 0, force: true});
      // The results list updates after a debounce. cy.contains() retries
      // until a matching block is visible, so there is no fixed wait.
      cy.contains('.block-editor-tabbed-sidebar .block-editor-block-types-list__list-item', componentName)
        .should('be.visible')
        .click()
        .then(() => {
          // Close the sidebar when we've selected the component.
          cy.get('.editor-document-tools .editor-document-tools__inserter-toggle[aria-pressed="true"]').click()
        });
    })
})
