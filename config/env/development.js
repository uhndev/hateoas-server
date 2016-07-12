/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  appUrl: process.env.APP_URL,
  hookTimeout: 9999999,
  proxyHost: process.env.PROXY_HOST,
  
  models: {
    migrate: 'alter',
    connection: 'altum'
  },
  
  // ssl: {
  //   key: fs.readFileSync(process.env.SSL_KEY),
  //   cert: fs.readFileSync(process.env.SSL_CERT),
  //   passphrase: process.env.SSL_PASSPHRASE
  // },

  log: {
    level: 'verbose'
  }
};
