/**
 * Controller for handling assessments
 */

(function () {
    'use strict';

    angular
        .module('dados.arm.assessment.controller', [
            'dados.common.directives.selectLoader',
            'uiGmapgoogle-maps'
        ])
        .controller('AssessmentController', AssessmentController)
        .config(function (uiGmapGoogleMapApiProvider) {
            uiGmapGoogleMapApiProvider.configure({
                //    key: 'your api key',
                v: '3.20', //defaults to latest 3.X anyhow
                libraries: 'weather,geometry,visualization'
            });
        });

    AssessmentController.$inject = ['AssessmentService', 'ReferralService', 'ReferralDetailService', 'SiteService', 'uiGmapGoogleMapApi'];

    function AssessmentController(Assessment, Referral, ReferralDetail, Site, uiGmapGoogleMapApi) {
        var vm = this;

        vm.referrals = [];
        vm.referralList = [];
        vm.collapsedSearch = false;
        vm.collapsedClientDetail = true;
        vm.selectedReferral = {};
        vm.siteMatrix = {};
        vm.map = {control: {}, center: {latitude: 43.7000, longitude: -79.4000}, zoom: 7};
        vm.sites = [];
        vm.siteLocations = [];
        vm.mapReady = false;
        vm.geocoder = null;
        vm.geoDirections = null;
        vm.googleMaps=uiGmapGoogleMapApi;


        // google distance placeholders for distance call

        vm.origins = [];
        vm.destinations = [];
        vm.distanceMatrix=[];

        name = 'Assessment';

        init();

        function init() {
            Site.query({}).$promise
                .then(function (resp) {

                    vm.sites = resp;

                    return uiGmapGoogleMapApi;
                }
            )
                .then(function (maps) {

                    //init googleMaps object
                    vm.googleMaps=maps;

                    //initialize sites/destinations

                    vm.sites.forEach(function (site) {
//                        vm.destinations.push(maps.LatLng(site.latitude, site.longitude));
                        vm.destinations.push( (site.address.address1 || '') + ' ' +  (site.address.address2 || '') + ' ' +   (site.address.city || '') + ' ' +   (site.address.province || '') + ' ' +   (site.address.postalCode || '') + ' ' +   (site.address.country || '') );
                    });


                    //initialize geocoder

                    vm.geocoder = new vm.googleMaps.Geocoder();


                    //initialize distance

                    vm.geoDistance = new vm.googleMaps.DistanceMatrixService();



                    //initialize directions service

                    vm.directionsService = new vm.googleMaps.DirectionsService();

                    //init directions renderer

                    vm.directionsDisplay = new vm.googleMaps.DirectionsRenderer();
                });
        }

        this.findReferral = function findReferral(searchString) {
            ReferralDetail.query(
                {
                    where: {
                        or: [
                            {status: {contains: searchString}},
                            {id: parseInt(searchString)},
                            {client_firstName: {contains: searchString}},
                            {client_lastName: {contains: searchString}},
                            {claim_claimNum: {contains: searchString}},
                            {claim_policyNum: {contains: searchString}}
                        ]
                    }
                }).$promise
                .then(function (resp) {
                    vm.referralList = resp;
                    vm.referrals = resp;
                    vm.collapsedSearch = false;
                },
                function error(err) {
                    alert('error');
                });
        };

        this.selectReferral = function selectReferral(referral) {
            vm.selectedReferral = referral;

            // set origin for distance matrix

            vm.origins=[ (referral.client_address1 || '') + ' ' +  (referral.client_address2 || '') +' ' +   (referral.client_city || '') +' ' +   (referral.client_province || '') +' ' +   (referral.client_postalCode || '') +' ' +   (referral.client_country || '') ];


            // hide the search, unhide client detail on front end, unhide map

            vm.collapsedSearch = true;
            vm.collapsedClientDetail = false;
            vm.mapReady = true;


            vm.calculateDistances();
          //vm.geocodeSites();
        };

        this.calculateDistances= function calculateDistances() {

            //distanceArgs for distanceMatrix call

            var distanceArgs= {
                origins: vm.origins,
                destinations:vm.destinations,
                travelMode: vm.googleMaps.TravelMode.DRIVING
            };

            vm.geoDistance.getDistanceMatrix(distanceArgs,function(matrix) {

                vm.distanceMatrix=matrix;
            });
        };

        this.calculateDirections = function calculateDirections(origin, destination) {
            var request = {
                origin: origin,
                destination: destination,
                travelMode: vm.googleMaps.DirectionsTravelMode.DRIVING
            };

            vm.directionsService(request, function (response) {
                if(status === vm.googleMaps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    directionsDisplay.setMap(vm.map.control.getGMap());
                    directionsDisplay.setPanel(vm.map.control.getGMap());
                }
            });
        };

        this.geocodeSites = function geocodeSites() {

            vm.sites.forEach(function (site) {
                console.log(site);
                var addy = (site.address.address1 || '' ) + ' ' + (site.address.address2 || '') + ' ' + (site.address.city || '') + ' ' + (site.address.province || '') + ', ' + (site.address.postalCode || '');
                vm.geocoder.geocode({address: addy}, function (location) {
                    console.log(location);
                    if (location[0]) {
                        console.log(location);

                        var newSite = new Site(site);
                        newSite.address.latitude = location[0].geometry.location.lat();
                        newSite.address.longitude = location[0].geometry.location.lng();
                        newSite.$update({id: site.id})
                            .then(function () {
                                toastr.success('Site geolocation updated', 'Geolocation');
                            })
                            .finally(function () {
                                newSite = {};
                                location = {};
                            });
                        newSite.$update(newSite);
                    }
                });
            });
            // addy=[{address: '399 Bathurst, Toronto, ON'},{address: '5 abbot lane truro NS'}];
        };

        this.selectSite = function selectedSite(site) {
            //alert('you just clicked the ' + site.name + ' site');
            //vm.geocodeSites();
            alert('Come to ' + site.name + ' at ' + site.address.longitude + ' ' + site.address.latitude);
            alert(vm.selectedReferral.client_longitude);
        };
    }

})();
