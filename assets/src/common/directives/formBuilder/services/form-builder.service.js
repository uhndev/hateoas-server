(function() {
  'use strict';
  angular
    .module('dados.common.directives.formBuilder.service', [])
    .service('SystemFormService', SystemFormService);

  function SystemFormService() {
    return {
      fields:[
        {
          name : 'textfield',
          value : 'Textfield',
          value_type: ''
        },
        {
          name : 'email',
          value : 'E-mail',
          value_type: ''
        },
        {
          name : 'password',
          value : 'Password',
          value_type: ''
        },
        {
          name : 'radio',
          value : 'Radio Buttons',
          value_type: '',
          hasOptions: true,
        },
        {
          name : 'dropdown',
          value : 'Dropdown List',
          value_type: '',
          hasOptions: true,
        },
        {
          name : 'date',
          value : 'Date',
          value_type: ''
        },
        {
          name : 'textarea',
          value : 'Text Area',
          value_type: ''
        },
        {
          name : 'checkbox',
          value : 'Checkbox',
          value_type: ''
        },
        {
          name : 'checkbox-group',
          value : 'Checkbox Group',
          value_type: {},
          hasOptions: true,
        },
        {
          name : 'number',
          value : 'Number',
          value_type: ''
        },
        {
          name : 'hidden',
          value : 'Hidden',
          value_type: ''
        },
        {
          name: 'multiselect',
          value: 'Multi Select',
          value_type: [],
          hasItems: true
        },
        {
          name: 'singleselect',
          value: 'Single Select',
          value_type: '',
          hasItem: true
        },
        {
          name: 'json',
          value: 'JSON',
          value_type: {}
        }
      ]
    };
  }

})();

