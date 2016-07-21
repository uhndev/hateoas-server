/**
 * Email Variable Configuration
 * (sails.config.email)
 *
 * Configures variables for the sails-hook-email module.
 */
module.exports.email = {
  transporter: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    tls: {rejectUnauthorized: false}
  },
  testMode: false
};
