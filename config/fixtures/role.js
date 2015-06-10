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
    Role.findOrCreate({ name: 'physician' }, { name: 'physician' }),
    Role.findOrCreate({ name: 'interviewer' }, { name: 'interviewer' }),
    Role.findOrCreate({ name: 'subject' }, { name: 'subject' })
  ]);
};
