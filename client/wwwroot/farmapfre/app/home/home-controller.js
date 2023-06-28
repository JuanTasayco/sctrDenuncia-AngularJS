define(['angular', 'constants'], function(ng, constants) {
  homeController.$inject = ['$scope', 'oimClaims', 'authorizedResource', '$state'];
  function homeController($scope, oimClaims, authorizedResource, state) {
    (function onLoad() {
      $scope.subMenus = {};
      var objHome = authorizedResource.accessSubMenu.filter(function(o) { return o.nombreCabecera === "HOME"; }).pop();
      $scope.subMenus = helper.clone(objHome.items);
      angular.forEach($scope.subMenus, function(item) {
        item.nombreCorto = ('' + item.nombreCorto).toLowerCase();
      });
    })();
  }
  return ng.module('farmapfre.app')
    .controller('homeController', homeController);
});