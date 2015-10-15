(function () {
  angular.module('AHS.client.controller', [])
    .controller('clientController', ClientController);

  ClientController.$inject = ['$scope', '$resource', '$location', '$modal', 'toastr', 'API', 'sailsTrNgGrid'];

  function ClientController($scope, $resource, $location, $modal, toastr, API, sailsTrNgGrid) {
    var _this = this;
    this.$scope = $scope;
    TrNgGrid.debugMode = true;
    $scope.externalTestProp = "Externals should be visible";
    $scope.myLocale = "en";
    $scope.myGlobalFilter = "";
    $scope.myOrderBy = "";
    $scope.myOrderByReversed = false;
    $scope.myColumnFilter = {};
    $scope.mySelectedItems = [];
    $scope.myGridFilteredItems = [];
    $scope.myGridFilteredItemsPage = [];
    $scope.myItemsTotalCount = 0;
    $scope.myItems = null;
    $scope.myEnableFieldAutoDetection = true;
    $scope.availableFields = ["id", "name", "address"];
    $scope.myFields = null;
    $scope.myItemsCurrentPageIndex = 0;
    $scope.myPageItemsCount = 10;
    $scope.myEnableFiltering = true;
    $scope.myEnableSorting = true;
    $scope.myEnableSelections = true;
    $scope.myEnableMultiRowSelections = true;
    $scope.myNextItemsTotalCount = 100;
    $scope.alert = function (message) {
      $window.alert(message);
    };
    _this.query = {'where': {}};
    _this.url = API.url() + $location.path();

    var prevServerItemsRequestedCallbackPromise;
    var serverSideRequestCount = 0;

    $scope.generateItems = function (pageItems, totalItems, generateComplexItems) {
      $scope.myItems = [];
      //$scope.myItems.splice(0);
      $scope.myPageItemsCount = pageItems;
      $scope.myItemsTotalCount = totalItems ? totalItems : $scope.myPageItemsCount;
      _this.generateItems($scope.myItems, $scope.myPageItemsCount, generateComplexItems);
      //$scope.mySelectedItems=$scope.myItems.slice(0);
    };

    $scope.onServerSideItemsRequested = function (currentPage, pageItems, filterBy, filterByFields, orderBy, orderByReverse) {
      if (prevServerItemsRequestedCallbackPromise) {
        $timeout.cancel(prevServerItemsRequestedCallbackPromise);
        prevServerItemsRequestedCallbackPromise = null;
      }
      $scope.requestedItemsGridOptions = {
        pageItems: pageItems,
        currentPage: currentPage,
        filterBy: filterBy,
        filterByFields: angular.toJson(filterByFields),
        orderBy: orderBy,
        orderByReverse: orderByReverse,
        requestTrapped: true
      };

      var Resource = $resource(_this.url);
      api = sailsTrNgGrid.parse($scope.requestedItemsGridOptions, _this.query);

      console.log(api);

      Resource.query(api, function (data, header) {
        $scope.resource = angular.copy(data);
      });
    };
  }

})();
