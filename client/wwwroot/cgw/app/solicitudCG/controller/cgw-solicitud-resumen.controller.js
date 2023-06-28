define([
  'angular', 'constants', '/cgw/app/factory/cgwFactory.js'
], function(ng, constants) {

  cgwSolicitudResumenController.$inject = ['$rootScope', '$scope', '$state', 'cgwFactory', 'oimClaims'];

  function cgwSolicitudResumenController($rootScope, $scope, $state, cgwFactory, oimClaims) {

    (function onLoad() {

      $scope.grupoAplicacion = parseInt(oimClaims.userSubType);

      cgwFactory.getRole($scope.grupoAplicacion).then(function (response) {
        if (response.data) {
          $scope.roleId = response.data.roleId;
          $scope.roleCode = response.data.roleCode;
        }
      });

     if ($scope.roleCode === constants.module.cgw.roles.medExterno.description) {//MED Externo)
       window.location.href = '/';
      }

      $scope.formData = $rootScope.formData || {};

      $scope.showComplaint = ($scope.formData.mEmpresa.id === 3 && $scope.formData.mProducto.productCode === 'R' && $scope.formData.afiliado.codigoProducto === 'R');

      if (!$scope.formData.numberLetter)
        window.location.href = '/';
     })();

      $scope.$watch('formData', function(nv)
      {
        $rootScope.formData =  nv;
      });

    $scope.nuevaSolicitud = function() {
      $rootScope.formData = {};
      $state.go('solicitudCgw.steps', {step: 1}, {reload: true, inherit: false});
    };

    $scope.verBandeja = function() {
      $rootScope.formData = {};
      $state.go('consultaCgw', {reload: true, inherit: false});
    }

  } //  end controller

  return ng.module('appCgw')
    .controller('CgwSolicitudResumenController', cgwSolicitudResumenController);
});
