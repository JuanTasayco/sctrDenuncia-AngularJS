(function($root, deps, factory){
  define(deps, factory)
})(this, ['angular', 'constants'],
function(angular, constants) {

  HeaderController.$inject = ['$scope', 'originSystemFactory', 'mapfreAuthetication'];

  function HeaderController($scope, originSystemFactory, mapfreAuthetication) {
    $scope.isSelfService = originSystemFactory.isOriginSystem(constants.ORIGIN_SYSTEMS.selfService.code);

    $scope.showBreadCrumbs = function() {
      return !$scope.isSelfService;
    };

    $scope.goHome = function() {
      mapfreAuthetication.goHome();
    };
  }

  angular
    .module('oim.layout')
    .controller('headerController', HeaderController);
})
