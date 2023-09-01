'use strict';

define(['angular', 'constants', 'saludFactory'], function(
  angular, constants, saludFactory) {

  homeSaludController.$inject = [
    '$scope', '$state', '$rootScope', 'isAdmin', '$uibModal', 'saludFactory'
  ];

  function homeSaludController($scope, $state, $rootScope, isAdmin, $uibModal, saludFactory) {
    var vm = this;

    vm.$onInit = function () {
	  console.log('Version 01/09/23 09:00');
      $scope.formData = $scope.formData || {};
      $scope.isAdmin = isAdmin;
    };

    $scope.irACotizar = function(){
      $rootScope.formData = {};
      $state.go('cotizadorSalud', {reload: true, inherit: false});
    }

    $scope.irAMigraciones = function () {
      $rootScope.formData = {};
      $state.go('saludMigraciones.steps', {step: 1}, {reload: true, inherit: false});
    }

    $scope.mostrarPopupReporteDiagnostico = function () {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        templateUrl : '/polizas/app/salud/popup/controller/popupReporteDiagnostico.html',
        controller : ['$scope', '$uibModalInstance', 'mModalAlert', '$filter', 'mainServices',
          function($scope, $uibModalInstance, mModalAlert, $filter, mainServices) {
            var vm = this;

            vm.$onInit = function () {
              settingsVigencia();
            }

            function settingsVigencia(){
              $scope.today = function() {
                if (typeof $scope.mDesdeFilter == 'undefined') $scope.mDesdeFilter = new Date();
                if (typeof $scope.mHastaFilter == 'undefined') $scope.mHastaFilter = new Date();
              };

              //$scope.today();
  
              $scope.inlineOptions = {
                minDate: new Date(),
                showWeeks: true
              };
  
              $scope.dateOptionsDesdeFilter = {
                formatYear: 'yy',
                maxDate: new Date(),
                minDate: new Date(),
                startingDay: 1
              };
  
              $scope.dateOptionsHastaFilter = {
                formatYear: 'yy',
                maxDate: new Date(),
                minDate: $scope.mDesdeFilter,
                startingDay: 1
              };
  
              $scope.toggleMin = function() {
                $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
                $scope.dateOptionsDesdeFilter.minDate = $scope.inlineOptions.minDate;
                $scope.dateOptionsHastaFilter.minDate = $scope.inlineOptions.minDate;
              };

              $scope.toggleMin();
  
              $scope.openDesdeFilter = function() {
                $scope.popupDesdeFilter.opened = true;
              };

              $scope.openHastaFilter = function() {
                $scope.popupHastaFilter.opened = true;
              };
  
              $scope.format = constants.formats.dateFormat;

              $scope.altInputFormats = ['M!/d!/yyyy'];
  
              $scope.popupDesdeFilter = {
                opened: false
              };

              $scope.popupHastaFilter = {
                opened: false
              };
  
              $scope.changeDate = function(){
                if ($scope.mHastaFilter < $scope.mDesdeFilter){
                  $scope.mHastaFilter = $scope.mDesdeFilter;
                }
              }

              $scope.changeDate();
            }

            $scope.disabledButton = function() {
              return (typeof $scope.mDesdeFilter == 'undefined') || (typeof $scope.mHastaFilter == 'undefined');
            };

            $scope.generarReporte = function () {
              var fechaInicio, fechaFin, tipoFormato;

              if(saludFactory.DiferenciaMeses($scope.mDesdeFilter, $scope.mHastaFilter) > 6) {
                mModalAlert.showError('El periodo máximo de consulta es de 6 meses', 'Error');
                return;
              }

              fechaInicio = $filter("date")($scope.mDesdeFilter, "ddMMyyyy");
              fechaFin = $filter("date")($scope.mHastaFilter, "ddMMyyyy");
              tipoFormato = "xlsx";

              saludFactory.descargarReporteDiagnostico(tipoFormato, fechaInicio, fechaFin, true)
              .then(function (res) {
                console.log(res);
                if (res.operationCode != 200 ) {
                  mModalAlert.showError('Hubo un error el proceso de descarga', 'Error');
                } else {
                  if (res.archivoBase64 === null) {
                    mModalAlert.showError(res.mensaje, 'Error');
                  } else {
                    var fileBase64 = res.archivoBase64;
                    var fileName = 'REPORTE_DIAGNOSTICOS_DECLARADOS.xls';
                    mainServices.fnDownloadFileBase64(fileBase64, 'excel', fileName, false);
                    $uibModalInstance.close();
                  }
                }
              });
            };
          }]
      });
    }

  }
return angular.module('appSalud')
  .controller('homeSaludController', homeSaludController)
});
