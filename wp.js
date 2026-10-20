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

// Cypress 16 also removed cy.exec(), so run the command through the wpCliExec
// task from plugin.js there, honouring the same options and yielding the same
// { exitCode, stdout, stderr } result. Older versions keep using cy.exec().
// The task's own log entry is turned off and replaced with display_command,
// which has secrets such as the Tugboat token masked; errors use it too.
const runCommand = (exec_command, display_command, options) => {
  if (parseInt(Cypress.version, 10) < 16) {
    return cy.exec(exec_command, options);
  }

  const { failOnNonZeroExit = true, env, log = true, ...taskOptions } = options;
  if (log) {
    cy.log('wp: ' + display_command);
  }
  return cy.task('wpCliExec', { command: exec_command, env }, { ...taskOptions, log: false }).then((result) => {
    if (failOnNonZeroExit && result.exitCode !== 0) {
      throw new Error(`cy.wp() failed with exit code ${result.exitCode}: ${display_command}\n\nstdout:\n${result.stdout}\n\nstderr:\n${result.stderr}`);
    }
    return result;
  });
};

Cypress.Commands.add('wp', (command, options = {}) => {
  readEnv(ENV_KEYS).then((env) => {
    let exec_command = '';
    let display_command = '';

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
      // The remote command sits inside double quotes on this machine, so escape
      // the characters double quotes still interpret. Otherwise a $VAR,
      // backtick or $(...) in the command ran here, on the machine running
      // Cypress, and a " ended the quoting early. Escaped, the server's shell
      // reads the command exactly as written, as `ddev wp` would.
      const remote_command = ('wp --url=' + Cypress.config('baseUrl') + ' ' + command).replace(/[\\"$`]/g, '\\$&');
      exec_command = 'ssh -T ' + env.WP_IS_PANTHEON + '@appserver.' + env.WP_IS_PANTHEON + '.drush.in -p 2222 -o "StrictHostKeyChecking=no" -o "AddressFamily inet" "' + remote_command + '"';
    }

    // Tugboat integration - requires DRUSH_IS_TUGBOAT(tugboat token), TUGBOAT_INSTANCE_ID
    if (env.DRUSH_IS_TUGBOAT) {
      exec_command = `tugboat -t ${env.DRUSH_IS_TUGBOAT} shell ${env.TUGBOAT_INSTANCE_ID} command="drush ${command}"`;
      display_command = `tugboat -t *** shell ${env.TUGBOAT_INSTANCE_ID} command="drush ${command}"`;
    }

    runCommand(exec_command, display_command || exec_command, options).then((result) => {
      cy.log(result.stdout);
      cy.wrap(result.stdout).as('wpCliOutput');
    })
  })
})
