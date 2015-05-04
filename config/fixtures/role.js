/**
 * Creates default Roles
 *
 * @public
 */
exports.create = function () {
  return Promise.all([
    Role.findOrCreate({ name: 'coordinator' }, { name: 'coordinator' }),
    Role.findOrCreate({ name: 'subject' }, { name: 'subject' })
  ]);
};
