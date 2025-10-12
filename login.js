// Examples:
// cy.login();  // Logins as the default testing user. user: cypress, password: cypress
// cy.login('username', 'password'); // login as a specific user.

Cypress.Commands.add('login', (usernameParam = '', password = '') => {
  cy.logout()
  const typeSettings = {
    delay: 0
  };
  cy.visit('/wp-login.php')
  cy.get('#user_login').should('be.empty');
  let username = '';
  let default_user = false;
  if (usernameParam === '' && password === '') {
    username = 'cypress';
    default_user = true;
  } else {
    username = usernameParam;
  }

  if (default_user) {
    cy.get('#user_login').click().type(username, typeSettings);
    cy.get('#user_pass').click().type('cypress', typeSettings);
    cy.get('#user_login').should('have.value', username)
    cy.get('#user_pass').should('have.value', 'cypress')
  } else {
    cy.get('#user_login').click().type(username, typeSettings);
    cy.get('#user_pass').click().type(password, typeSettings);
    cy.get('#user_login').should('have.value', username)
    cy.get('#user_pass').should('have.value', password)
  }

  // Login
  cy.wait(50) // wait for the UI to catch up
  cy.get('#wp-submit').click();
  cy.wait(50) // wait for the UI to catch up
})
