# Cypress Support Commands for WordPress

Common commands that can be used to create Cypress tests for WordPress

## Installation

### Install/update composer installers.

Add two entries in composer.json for an install-type and its path:

```
"installer-types": ["cypress-support"],
"installer-paths": {
 "tests/cypress/cypress/support/{$name}": [
   "type:cypress-support"
 ]
}
```

Make sure you also add that installed path to your `.gitignore` file.  I.E. `tests/cypress/cypress/support/cypress-wordpress-support-commands`

### Tell Cypress where to import the tests

In the `support` folder for where your Cypress tests are located, edit `commands.js` and add the
following:

```
// Import commands.js using ES2015 syntax:
import './cypress-wordpress-support-commands/commands'
```

### Cypress 16: register the WP-CLI task

Cypress 16 removed `cy.exec()`, so on Cypress 16 `cy.wp()` runs WP-CLI through a `wpCliExec` task instead. Register it in `cypress.config.js`:

```js
module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require('./cypress/support/cypress-wordpress-support-commands/plugin')(on, config);
    },
  },
});
```

Cypress 15 and earlier keep using `cy.exec()` and need no change.

Install the package using Composer:

```bash
composer require kanopi/cypress-wordpress-support-commands
```

## Commands

### Authentication Commands

#### login
Login to WordPress admin. Uses 'cypress' user with 'cypress' password by default.

```javascript
cy.login(); // Login as default user
cy.login('username', 'password'); // Login as specific user
```

#### logout
Logout from WordPress by clearing all cookies.

```javascript
cy.logout();
```

### Content Creation Commands

#### setTitle
Sets the post/page title in the WordPress editor.

```javascript
cy.setTitle('Test Title');
```

#### createComponentHeading
Adds a heading component and sets text content. Generates random text if no content provided.

```javascript
cy.createComponentHeading('My Heading Text');
cy.createComponentHeading(); // Uses random text
```

#### createComponentParagraph
Adds a paragraph component and sets text content. Generates random text if no content provided.

```javascript
cy.createComponentParagraph('My paragraph text');
cy.createComponentParagraph(); // Uses random text
```

#### createComponentImage
Adds an image component and uploads a file. Files should be stored in the 'fixtures' folder.

```javascript
cy.createComponentImage('image-sample_01.png');
cy.createComponentImage('image-sample_01.png', true); // Use media library
```

### Component Management Commands

#### selectComponent
Opens the component inserter, searches for a block and inserts it.

The name must match the block's title in the inserter exactly (case and spacing included); it is not a substring match. `cy.selectComponent('Image')` inserts the core Image block, never a plugin block whose title contains "Image", such as Kadence's "Image (Adv)". To insert a plugin block, pass its full title as the inserter shows it. If no block has that exact title, the command fails after the default command timeout.

```javascript
cy.selectComponent('Heading');
cy.selectComponent('Paragraph');
cy.selectComponent('Image');
```

#### editorReset
Clicks the page to deselect components and restore the "Add Component" button. Typically used after adding/editing components.

```javascript
cy.editorReset();
```

#### editorCanvas
Yields the block editor canvas: the `<body>` of the `iframe[name="editor-canvas"]` that holds the title and blocks, or `.editor-styles-wrapper` on editors without the iframe. Chain `.find()` from it to reach block content; the editor chrome (toolbar, sidebars, inserter) is in the top document and needs a plain `cy.get()`.

On Cypress 12 and later it is a query, so if the editor replaces the canvas document while it loads, Cypress re-runs it and the chained `.find()` searches the new canvas instead of failing with "subject is no longer attached to the DOM". It waits up to 30 seconds for the canvas to load; pass `timeout` to change that.

```javascript
cy.editorCanvas().find('.wp-block-post-title');
cy.editorCanvas({ timeout: 60000 }).find('p.is-selected');
```

### Publishing Commands

#### publish
Clicks the publish button and publishes the post/page. Compatible with WordPress 6.9+ which uses the REST API for publishing.

```javascript
cy.publish(); // Publishes and views post
cy.publish(false); // Publishes without viewing
```

#### save
Saves the post/page as published content.

```javascript
cy.save(); // Saves and views post
cy.save(false); // Saves without viewing
```

#### saveDraft
Saves the post/page as a draft.

```javascript
cy.saveDraft();
```

#### update
Updates an existing published post/page.

```javascript
cy.update(); // Updates and views post
cy.update(false); // Updates without viewing
```

### Media Library Commands

#### mediaLibraryAdd
Uploads a file directly to the media library. Files should be stored in 'cypress/fixtures/'.

```javascript
cy.mediaLibraryAdd('sample.png');
```

#### mediaLibrarySelect
Opens media library modal and selects an existing media item by filename. Compatible with sites using the [WP Media Folder](https://www.joomunited.com/wordpress-products/wp-media-folder) plugin, which replaces the standard media grid with a folder-based view.

```javascript
cy.mediaLibrarySelect('#field_media_assets-media-library-wrapper', 'sample.png');
```

#### mediaLibraryUpload
Uploads a file through the media library modal. Files should be stored in 'cypress/fixtures/'.

```javascript
cy.mediaLibraryUpload('#selector', 'sample.png');
```

#### setFeaturedImage
Sets the featured image for a post/page. Files should be stored in 'cypress/fixtures/'.

```javascript
cy.setFeaturedImage('image-sample_01.png');
```

### Post Settings Commands

#### setVisibility
Sets the visibility option for a post/page. Options: public, private, password.

```javascript
cy.setVisibility(); // Defaults to public
cy.setVisibility('public');
cy.setVisibility('private');
cy.setVisibility('password'); // Uses default password 'password'
cy.setVisibility('password', '123'); // Uses custom password
```

### Navigation Commands

#### visitEditPage
Visits a WordPress edit page and waits for common AJAX requests to complete.

```javascript
cy.visitEditPage('/wp-admin/post-new.php');
cy.visitEditPage('/wp-admin/post.php?post=123&action=edit');
```

### Utility Commands

#### wp
Executes WP-CLI commands through various environments (Docksal, Lando, DDEV, Pantheon, Tugboat).

The environment is chosen from Cypress environment variables (`WP_IS_DOCKSAL`, `WP_IS_LANDO`, `WP_CLI_IS_DDEV`, `WP_IS_PANTHEON`, `DRUSH_IS_TUGBOAT` with `TUGBOAT_INSTANCE_ID`), set in `cypress.env.json`, as `CYPRESS_*` variables or with `--env`. They are read with `cy.env()` on Cypress 15.10 and later, including Cypress 16, and with `Cypress.env()` on older versions. On Cypress 16 the command runs through the `wpCliExec` task (see Installation); `options` are passed through as they were to `cy.exec()` (`failOnNonZeroExit`, `timeout`, `env`, `log`), and the result is the same `{ exitCode, stdout, stderr }`.

```javascript
cy.wp('cache flush');
cy.wp('user list');
```

#### wpGetPost
Gets the newest published post of a post type through WP-CLI, as `{ ID, post_title, post_name }`. Fails if the type has no published posts.

```javascript
cy.wpGetPost('page').then((post) => {
  cy.visit(`/?page_id=${post.ID}`);
});
```

#### wpUpdateTitle
Updates a post's title through WP-CLI, which fires `save_post` as an editor save would. The title is single-quoted for the shell, so spaces and apostrophes are safe everywhere. On Pantheon, titles containing `"`, `$` or a backtick are not supported yet, because `cy.wp()` wraps the command in double quotes for SSH.

```javascript
cy.wpUpdateTitle(123, "Doctor's Note");
```

#### wpGetPermalink
Gets a post's frontend URL as a path relative to the site (scheme and host removed, query string kept), ready for `cy.visit()`.

```javascript
cy.wpGetPermalink(123).then((path) => {
  cy.visit(path);
});
```

#### anonUrl404
Tests that a URL returns a 404 response for anonymous users.

```javascript
cy.anonUrl404('/private-post-url');
```

#### enterPostPassword
Enters password for password-protected posts/pages.

```javascript
cy.enterPostPassword('mypassword');
```
