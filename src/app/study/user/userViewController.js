(function() {
	'use strict';
	angular
		.module('dados.study.user', [
			'dados.user.service',
			'dados.collectioncentre.service',
			'dados.common.directives.selectLoader'
		])
		.controller('StudyUserController', StudyUserController);
	
	StudyUserController.$inject = [
		'$scope', '$q', '$resource', '$location', 'ngTableParams', 'sailsNgTable', 
		'CollectionCentreService', 'UserService', 'toastr', 'API'
	];
	
	function StudyUserController($scope, $q, $resource, $location, TableParams, SailsNgTable, 
																CollectionCentre, User, toastr, API) {
		var vm = this;
		var savedAccess = {};

		// bindable variables
		vm.allow = '';
		vm.centreHref = '';
		vm.query = { 'where' : {} };
		vm.toggleEdit = true;
		vm.selected = null;
		vm.filters = {};    
		vm.template = {};
		vm.resource = {};
		vm.newUser = {};
		vm.url = API.url() + $location.path();

		// bindable methods
		vm.select = select;
		vm.addUser = addUser;
		vm.saveChanges = saveChanges;

		init();

		///////////////////////////////////////////////////////////////////////////

		function init() {
			var currStudy = _.getStudyFromUrl($location.path());

			var Resource = $resource(vm.url);
			var TABLE_SETTINGS = {
				page: 1,
				count: 10,
				filter: vm.filters
			};

			$scope.tableParams = new TableParams(TABLE_SETTINGS, { 
				counts: [],
				getData: function($defer, params) {
					var api = SailsNgTable.parse(params, vm.query);

					Resource.get(api, function(data, headers) {
						vm.selected = null;
						vm.allow = headers('allow');
						vm.centreHref = "study/" + currStudy + "/collectioncentre";
						if (_.contains(vm.allow, 'read,')) {
							vm.allow = vm.allow.substring(5);
						}
						// add role and collection centre fields
						data.template.data = data.template.data.concat([
							{
								"name": "accessCollectionCentre",
								"type": "multiselect",
								"prompt": "Collection Centre",
								"value": vm.centreHref
							},            	
							{
								"name": "accessRole",
								"type": "singleselect",
								"prompt": "Role",
								"value": "role"
							}
						]);
						vm.template = data.template;
						vm.resource = angular.copy(data);
						
						_.each(data.items, function (item) {
							savedAccess[item.id] = {};
							savedAccess[item.id].centreAccess = item.centreAccess;
							savedAccess[item.id].collectionCentre = item.accessCollectionCentre;
						});

						params.total(data.total);
						$defer.resolve(data.items);

						// initialize submenu
						if (currStudy && _.has(data, 'links') && data.links.length > 0) {
							// from workflowstate and current url study
							// replace wildcards in href with study name
							_.map(data.links, function(link) {
								if (link.rel === 'overview' && link.prompt === '*') {
									 link.prompt = currStudy;
								}  
								if (_.contains(link.href, '*')) {
									link.href = link.href.replace(/\*/g, currStudy);  
								}  
								return link;
							});
							var submenu = {
								links: data.links
							};
							angular.copy(submenu, $scope.dados.submenu);
						}            
					});
				}
			});      
		}

		function select(item) {
			vm.selected = (vm.selected === item ? null : item);
		}

		function addUser() {			
			var access = {};
			// set access level for each selected collection centre
			_.each(vm.newUser.collectioncentre, function (centre) {
				access[centre] = vm.newUser.role;
			});

			var UserRes = $resource(API.url() + '/user/' + vm.newUser.user);

			UserRes.get(function (data) {
				// merge existing centreAccess with new attributes
				_.extend(access, data.items.centreAccess);

				var user = new User({
					'centreAccess': access,
					'isAdding': true,
					'collectionCentres': vm.newUser.collectioncentre
				});
				user.$update({ id: vm.newUser.user })
				.then(function() {
					toastr.success('Added user to collection centre!', 'Collection Centre');
					$scope.tableParams.reload();
				}).catch(function (err) {
					toastr.error('An error occurred, please check your input and try again later.', 'Collection Centre');
				}).finally(function () {
					vm.toggleNew = !vm.toggleNew;
					vm.newUser = {};
				});			
			});			
		}

		function saveChanges() {		
			$q.all(_.map(vm.resource.items, function (item) {
				var isAdding = false;
				var diff = _.difference(savedAccess[item.id].collectionCentre, item.accessCollectionCentre);
				if (diff.length === 0) {
					diff = _.difference(item.accessCollectionCentre, savedAccess[item.id].collectionCentre);
					isAdding = true;
				} else {
				  isAdding = false;
				}

				var access = {};
				// set access level for each selected collection centre
				_.each(item.accessCollectionCentre, function (centre) {
					access[centre] = item.accessRole;
				});
				// merge existing centreAccess with new attributes
				var accessCopy = angular.copy(item.centreAccess);
				_.extend(accessCopy, access);
				angular.copy(accessCopy, access);

				if (!isAdding) {
					_.each(diff, function (centreId) {
						delete access[centreId];
					});
				}

				// only make PUT request if necessary
				if (!_.isEqual(access, item.centreAccess)) {
					var user = new User({
						centreAccess: access,
						isAdding: isAdding,
						collectionCentres: diff
					});
					return user.$update({ id: item.id });
				}
				// console.log({
				// 	centreAccess: access,
				// 	isAdding: isAdding,
				// 	collectionCentres: diff					
				// });

				return;
			}))
			.then(function() {
				toastr.success('Updated collection centre permissions successfully!', 'Collection Centre');
			}).catch(function (err) {
				toastr.error(err, 'Collection Centre');
			});
		}    

		// watchers
		$scope.$watchCollection('studyUser.query.where', function(newQuery, oldQuery) {
			if (newQuery && !_.isEqual(newQuery, oldQuery)) {
				// Page changes will trigger a reload. To reduce the calls to
				// the server, force a reload only when the user is already on
				// page 1.
				if ($scope.tableParams.page() !== 1) {
					$scope.tableParams.page(1);
				} else {
					$scope.tableParams.reload();
				}
			}
		});    

		$scope.$on('hateoas.client.refresh', function() {
			init();
		});    
	}
})();