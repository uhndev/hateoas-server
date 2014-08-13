/**
 * needsConfig
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any for initial admin setup, depending on DB status
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
  // if user collection empty in DB, proceed to admin registration
  User.count().exec(function countF(err, count) {
    if (err) return next(err);
    if (count == 0) return next();
    else return res.redirect('/');
  });
};
