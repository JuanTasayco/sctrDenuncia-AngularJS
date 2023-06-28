define([
  'angular'
], function (angular) {
  angular.module("appTransportes")
    .controller("ctrlHomeTransportes", ['$scope', 'oimAuthorize', '$state', 'oimPrincipal', function ($scope, oimAuthorize, $state, oimPrincipal) {
      $scope.IS_COMPANY_CLIENT = oimPrincipal.isCompanyClient();

      $scope.canApli = !!oimAuthorize.isAuthorized($state.get("transporteaplicacion"));
      $scope.canEmit = !!oimAuthorize.isAuthorized($state.get("transporteemit"));
    }]);
});
