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
var fs = require('fs');

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/
  appUrl: 'https://localhost:1337',
  hookTimeout: 9999999,
  log: {
    level: 'verbose'
  },
  models: {
    migrate: 'alter',
    connection: 'dados_development'
  },
  ssl: {
    key: fs.readFileSync('config/ssl/dev/server.key'),
    cert: fs.readFileSync('config/ssl/dev/server.crt')
  },
  fhir: {
    //'http://try-fhirplace.hospital-systems.com'
    //'http://fhirtest.uhn.ca/baseDstu2'
    baseUrl: 'http://fhirtest.uhn.ca/baseDstu2'
  }
};
