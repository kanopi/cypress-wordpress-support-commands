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
      // Match the block title exactly. A substring match clicks the first hit,
      // so "Image" could insert a plugin block such as Kadence's
      // "Image (Adv)". cy.contains() retries until the exact match is
      // visible, so there is no fixed wait for the search debounce.
      const escaped = componentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      cy.contains('.block-editor-tabbed-sidebar .block-editor-block-types-list__item-title', new RegExp(`^\\s*${escaped}\\s*$`))
        .closest('.block-editor-block-types-list__item')
        .should('be.visible')
        // Pattern results keep loading after the blocks appear and re-render
        // the list, which detaches the block during the actionability checks.
        // The visibility assertion above stands in for them.
        .click({force: true})
        .then(() => {
          // Close the sidebar when we've selected the component.
          cy.get('.editor-document-tools .editor-document-tools__inserter-toggle[aria-pressed="true"]').click()
        });
    })
})
