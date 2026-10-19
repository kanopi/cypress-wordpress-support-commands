// Node side of cy.wp() for Cypress 16, which removed cy.exec(). Register it
// from setupNodeEvents in cypress.config.js:
//
//   setupNodeEvents(on, config) {
//     require('./cypress/support/cypress-wordpress-support-commands/plugin')(on, config);
//   },

const { exec } = require('child_process');

// cy.exec() stripped the final newline from its output; keep that so tests
// comparing stdout behave the same on every Cypress version.
const stripFinalNewline = (output) => output.replace(/\r?\n$/, '');

module.exports = (on) => {
  on('task', {
    wpCliExec({ command, env = {} }) {
      return new Promise((resolve) => {
        exec(
          command,
          { env: { ...process.env, ...env }, maxBuffer: 50 * 1024 * 1024 },
          (error, stdout, stderr) => {
            resolve({
              exitCode: error ? (typeof error.code === 'number' ? error.code : 1) : 0,
              stdout: stripFinalNewline(String(stdout)),
              stderr: stripFinalNewline(String(stderr)),
            });
          },
        );
      });
    },
  });
};
