/**
 * Creates default Roles
 *
 * @public
 */
exports.create = function () {
  return Promise.all([
  	Role.destroy({name: 'registered'}),
  	Role.destroy({name: 'public'}),
    Role.findOrCreate({ name: 'coordinator' }, { name: 'coordinator' }),
    Role.findOrCreate({ name: 'subject' }, { name: 'subject' })
  ]);
};
