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

### Tell Cypress where to import the tests

In the `support` folder for where your Cypress tests are located, edit `commands.js` and add the
following:

```
// Import commands.js using ES2015 syntax:
import './cypress-wordpress-support-commands/commands'
```

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
Opens the component inserter and selects a component by name.

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

### Publishing Commands

#### publish
Clicks the publish button and publishes the post/page.

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
Opens media library modal and selects an existing media item by filename.

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

```javascript
cy.wp('cache flush');
cy.wp('user list');
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
