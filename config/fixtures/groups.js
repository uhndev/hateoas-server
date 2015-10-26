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
      level: 1,
      menu: {
        tabview: [
          { prompt: 'Studies', href: '/study', icon: 'fa-group' },
          { prompt: 'User Manager', href: '/user', icon: 'fa-user' },        
          { prompt: 'Tools', icon: 'fa-cog', dropdown: [
            { prompt: 'Form Builder', href: '/formbuilder', icon: 'fa-pencil-square-o' },
            { prompt: 'Workflow Editor', href: '/workflow', icon: 'fa-code' },
            { prompt: 'Groups', href: '/group', icon: 'fa-users'},
            { prompt: 'Access Management', href: '/access', icon: 'fa-lock'}
          ]}
        ],
        subview: [ 'overview', 'subject', 'user', 'form', 'survey', 'collectioncentre' ]
      }
    },
    {
      name: 'coordinator',
      roles: coordinatorRoles,
      level: 2,
      menu: {
        tabview: [
          { prompt: 'Studies', href: '/study', icon: 'fa-group' },
          { prompt: 'User Manager', href: '/user', icon: 'fa-user' }      
        ],
        subview: [ 'overview', 'subject', 'user' ]
      }
    },
    {
      name: 'interviewer',
      roles: interviewerRoles,
      level: 2,
      menu: {
        tabview: [
          { prompt: 'Studies', href: '/study', icon: 'fa-group' },
          { prompt: 'My Profile', href: '/user', icon: 'fa-user' }      
        ],
        subview: [ 'overview', 'subject' ]
      }
    },
    {
      name: 'subject',
      roles: subjectRoles,
      level: 3,   
      menu: {
        tabview: [
          { prompt: 'My Studies', href: '/study', icon: 'fa-group' },
          { prompt: 'My Profile', href: '/user', icon: 'fa-user' }      
        ],
        subview: [ 'overview' ]  
      }      
    },                
  ];

  return Promise.all(
    _.map(groups, function (group) {
      return Group.findOrCreate({ name: group.name }, group);
    })
  ); 
};
