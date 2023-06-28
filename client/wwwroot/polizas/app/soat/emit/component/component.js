'use strict';

define([
    'angular', 'constants', '/polizas/app/soat/emit/service/soatFactory.js'
], function(angular, constants, factory) {

    angular.module("appSoat").controller("soatController", ['$scope', '$stateParams', 'soatFactory', '$q', '$rootScope', '$location', '$window', '$state', function($scope, $stateParams, soatFactory, $q, $rootScope, $location, $window, $state) {
        $scope.formData = $rootScope.frm || {};
        $scope.$watch('formData', function(nv) {
            $rootScope.frm = nv;
        });

        var codRamo = '302';

        _self.buscarPlacaChasisMotor = function(placa, chasis, motor) {
            var paramsPCM = '/' + codRamo + '/' + placa + '/' + chasis + '/' + motor;
            soatFactory.getValidarPCM(paramsPCM).then(function(response) {
                if (response.OperationCode == constants.operationCode.success) {
                    $scope.existePoliza = response.Data;
                } else if (response.Message.length > 0) {
                    $scope.errorCotizacionesVigentes.value = true;
                    $scope.errorCotizacionesVigentes.description = response.Message;
                }
            }, function(error) {
            });
        }

    }])

});
