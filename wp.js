// Examples:
// cy.wp('cr');
// cy.wp('status');

const ENV_KEYS = [
  'WP_IS_DOCKSAL',
  'WP_IS_LANDO',
  'WP_CLI_IS_DDEV',
  'WP_IS_PANTHEON',
  'DRUSH_IS_TUGBOAT',
  'TUGBOAT_INSTANCE_ID',
];

// Cypress 16 removed Cypress.env(). cy.env() replaces it from Cypress 15.10 and
// reads the same sources (cypress.env.json, CYPRESS_* variables, --env), so use
// it when present and fall back to Cypress.env() on older versions. Not logged,
// because DRUSH_IS_TUGBOAT is an API token.
const readEnv = (keys) => {
  if (typeof cy.env === 'function') {
    return cy.env(keys, { log: false });
  }
  const values = {};
  keys.forEach((key) => {
    values[key] = Cypress.env(key);
  });
  return cy.wrap(values, { log: false });
};

Cypress.Commands.add('wp', (command, options = {}) => {
  readEnv(ENV_KEYS).then((env) => {
    let exec_command = '';

    if (env.WP_IS_DOCKSAL) {
      exec_command = 'fin wp ' + command;
    }

    if (env.WP_IS_LANDO) {
      exec_command = 'lando wp ' + command;
    }

    if (env.WP_CLI_IS_DDEV) {
      exec_command = 'ddev wp ' + command;
    }

    // In the format of PANTHEON_SITE_ID.ENVIRONMENT_ID
    if (env.WP_IS_PANTHEON) {
      // Passing URI as well because drush will return HTTP links by default and not HTTPS which can cause tests to fail.
      exec_command = 'ssh -T ' + env.WP_IS_PANTHEON + '@appserver.' + env.WP_IS_PANTHEON + '.drush.in -p 2222 -o "StrictHostKeyChecking=no" -o "AddressFamily inet" "wp --url=' + Cypress.config('baseUrl') + ' ' + command + '"';
    }

    // Tugboat integration - requires DRUSH_IS_TUGBOAT(tugboat token), TUGBOAT_INSTANCE_ID
    if (env.DRUSH_IS_TUGBOAT) {
      exec_command = `tugboat -t ${env.DRUSH_IS_TUGBOAT} shell ${env.TUGBOAT_INSTANCE_ID} command="drush ${command}"`;
    }

    cy.exec(exec_command, options).then((result) => {
      cy.log(result.stdout);
      cy.wrap(result.stdout).as('wpCliOutput');
    })
  })
})
