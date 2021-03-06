/**
 * Migrate -> UAT environment settings
 *
 * This file can include shared settings for a UAT environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  appUrl: process.env.APP_URL,
  hookTimeout: 9999999,
  proxyHost: process.env.PROXY_HOST,
  keepResponseErrors: true,

  models: {
    migrate: 'alter',
    autoCreatedBy: true,
    connection: 'altum'
  },

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  port: process.env.PORT,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  log: {
    level: "verbose"
  }

};
