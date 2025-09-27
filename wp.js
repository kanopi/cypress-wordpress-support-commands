// Examples:
// cy.wp('cr');
// cy.wp('status');

Cypress.Commands.add('wp', (command, options = {}) => {

  let exec_command = '';

  if (Cypress.env('WP_IS_DOCKSAL')) {
    exec_command = 'fin wp ' + command;
  }

  if (Cypress.env('WP_IS_LANDO')) {
    exec_command = 'lando wp ' + command;
  }

  if (Cypress.env('DRUSH_IS_DDEV')) {
    exec_command = 'ddev drush ' + command;
  }

  // In the format of PANTHEON_SITE_ID.ENVIRONMENT_ID
  if (Cypress.env('WP_IS_PANTHEON')) {
    // Passing URI as well because drush will return HTTP links by default and not HTTPS which can cause tests to fail.
    exec_command = 'ssh -T ' + Cypress.env('WP_IS_PANTHEON') + '@appserver.' + Cypress.env('WP_IS_PANTHEON') + '.drush.in -p 2222 -o "StrictHostKeyChecking=no" -o "AddressFamily inet" "wp --url=' + Cypress.config('baseUrl') + ' ' + command + '"';
  }

  // Tugboat integration - requires DRUSH_IS_TUGBOAT(tugboat token), TUGBOAT_INSTANCE_ID
  if (Cypress.env('DRUSH_IS_TUGBOAT')) {
    const instanceId = Cypress.env('TUGBOAT_INSTANCE_ID');
    const tugboatToken = Cypress.env('DRUSH_IS_TUGBOAT');
    exec_command = `tugboat -t ${tugboatToken} shell ${instanceId} command="drush ${command}"`;
  }

  cy.exec(exec_command, options).then((result) => {
    cy.log(result.stdout);
    cy.wrap(result.stdout).as('wpCliOutput');
  })
})
