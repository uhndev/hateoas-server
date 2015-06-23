/**
 * Create default Role permissions
 */
exports.create = function (roles, models, admin) {

  var coordinatorRoles = _.pluck(_.filter(roles, function (role) {
    return _.contains([
      'readStudy',
      'readSubject',
      'readUser',
      'readUserOwner',
      'updateUserOwner',
      'createUser',
      'readForm',
      'createAnswerSet'
    ], role.name);
  }), 'id');

  var physicianRoles = _.pluck(_.filter(roles, function (role) {
    return _.contains([
      'readStudy',
      'readSubject',
      'readUser',
      'readUserOwner',
      'updateUserOwner',
      'readForm',
      'createAnswerSet'
    ], role.name);
  }), 'id');

  var interviewerRoles = _.pluck(_.filter(roles, function (role) {
    return _.contains([
      'readStudy',
      'readSubject',
      'readUserOwner',
      'updateUserOwner',
      'readForm',
      'createAnswerSet'
    ], role.name);
  }), 'id');      

  var subjectRoles = _.pluck(_.filter(roles, function (role) {
    return _.contains([
      'readStudy',
      'readUserOwner',
      'readForm',
      'createAnswerSet'
    ], role.name);
  }), 'id');      

  var groups = [
    {
      name: 'admin',
      roles: _.pluck(roles, 'id'),
      tabview: [
        { prompt: 'Studies', href: '/study', icon: 'fa-group' },
        { prompt: 'Form Builder', href: '/formbuilder', icon: 'fa-pencil-square-o' },
        { prompt: 'Workflow Editor', href: '/workflow', icon: 'fa-code' },
        { prompt: 'User Manager', href: '/user', icon: 'fa-user' },
        { prompt: 'Access Management', href: '/access', icon: 'fa-cog'}
      ],
      subview: [ 'overview', 'subject', 'user', 'form', 'survey', 'collectioncentre' ]
    },
    {
      name: 'coordinator',
      roles: coordinatorRoles,
      tabview: [
        { prompt: 'Studies', href: '/study', icon: 'fa-group' },
        { prompt: 'User Manager', href: '/user', icon: 'fa-user' }      
      ],
      subview: [ 'overview', 'subject', 'user' ]
    },
    {
      name: 'physician',
      roles: physicianRoles,
      tabview: [
        { prompt: 'Studies', href: '/study', icon: 'fa-group' },
        { prompt: 'My Profile', href: '/user', icon: 'fa-user' }      
      ],
      subview: [ 'overview', 'subject', 'user' ]
    },
    {
      name: 'interviewer',
      roles: interviewerRoles,
      tabview: [
        { prompt: 'Studies', href: '/study', icon: 'fa-group' },
        { prompt: 'My Profile', href: '/user', icon: 'fa-user' }      
      ],
      subview: [ 'overview', 'subject' ]
    },
    {
      name: 'subject',
      roles: subjectRoles,
      tabview: [
        { prompt: 'My Studies', href: '/study', icon: 'fa-group' },
        { prompt: 'My Profile', href: '/user', icon: 'fa-user' }      
      ],
      subview: [ 'overview' ]
    },                
  ];

  return Promise.all(
    _.map(groups, function (group) {
      return Group.findOrCreate({ name: group.name }, group);
    })
  ); 
};
