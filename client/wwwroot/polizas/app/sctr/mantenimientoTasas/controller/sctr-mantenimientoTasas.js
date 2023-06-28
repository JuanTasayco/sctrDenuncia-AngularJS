(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', '/polizas/app/sctr/mantenimientoTasas/service/sctrUploadTasas.js'
],
  function(angular, constants, helper){

    var appAutos = angular.module('appAutos');

    appAutos.controller('sctrMantenimientoTasasController',
      ['$scope', '$window', '$uibModal', 'proxySctr', 'sctrUploadTasas', 'mModalAlert', 'mModalConfirm',
      function($scope, $window, $uibModal, proxySctr, sctrUploadTasas, mModalAlert, mModalConfirm) {

        (function onload() {
          $scope.taxTypes = [];
          proxySctr.GetListTasa().then(function (res) {
            $scope.taxTypes = res.Data;
          });
        })();

        $scope.donwloadFileTasa = function(id) {
          var url = constants.system.api.endpoints.policy + 'api/sctr/poliza/tasa/download/' + id;
          $window.open(url, '_blank');
        };

        $scope.showModalReplaceTaxes = function(taxType){
          //Modal
          var vModal = $uibModal.open({
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            templateUrl : '/polizas/app/sctr/mantenimientoTasas/controller/modal-replace-taxes.html',
            controller : ['$scope', '$uibModalInstance', '$uibModal',
              function($scope, $uibModalInstance) {

              $scope.taxType = taxType;
              $scope.file = null;
              $scope.fileInput = null;
              $scope.modalState = {
                file: 'none'
              };

              $scope.selectFile = function(event){
                $scope.$evalAsync(function() {
                  $scope.file = event.target.files[0];
                  $scope.modalState.file = 'selected';
                })
              };

              $scope.dropFile = function() {
                $scope.$evalAsync(function() {
                  $scope.file = 'none';
                  $scope.modalState.fileUploaded = false;
                })
              };

              $scope.uploadFile = function() {
                $scope.$evalAsync(function() {
                  $scope.modalState.file = 'uploading';
                });

                sctrUploadTasas.uploadFile({
                  idTasa: $scope.taxType.Id,
                  template: $scope.file
                }, false).then(function(res) {
                  $scope.$evalAsync(function() {
                    $scope.modalState.file = res.OperationCode === 200 ? 'uploaded' : 'withErrors';
                  });
                });
              };

              //CloseModal
              $scope.closeModal = function () {
                $uibModalInstance.close();
              };
              //
            }]
          });
          vModal.result.then(function(){
            //Action after CloseButton Modal
            console.log('closeButton');
          },function(){
            //Action after CancelButton Modal
            console.log("CancelButton");
          });
          //
        }

        $scope.showModalErroresEcontrados = function(){
          //Modal
          var vModal = $uibModal.open({
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            size: 'lg',
            scope: $scope,
            templateUrl : '/polizas/app/sctr/mantenimientoTasas/controller/modal-errores-encontrados.html',
            controller : ['$scope', '$uibModalInstance', '$uibModal',
              function($scope, $uibModalInstance) {

              //CloseModal
              $scope.closeModal = function () {
                $uibModalInstance.close();
              };
              //
            }]
          });
          vModal.result.then(function(){
            //Action after CloseButton Modal
            console.log('closeButton');
          },function(){
            //Action after CancelButton Modal
            console.log("CancelButton");
          });
          //
        }

        $scope.showModalAddActividad = function(){
          //Modal
          var vModal = $uibModal.open({
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            size: 'md',
            scope: $scope,
            templateUrl : '/polizas/app/sctr/mantenimientoTasas/controller/modal-add-actividad.html',
            controller : ['$scope', '$uibModalInstance', '$uibModal',
              function($scope, $uibModalInstance) {

              //CloseModal
              $scope.closeModal = function () {
                $uibModalInstance.close();
              };
              //
            }]
          });
          vModal.result.then(function(){
            //Action after CloseButton Modal
            console.log('closeButton');
          },function(){
            //Action after CancelButton Modal
            console.log("CancelButton");
          });
          //
        }

        $scope.showModalActividad = function(){
          //Modal
          var vModal = $uibModal.open({
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            size: 'md',
            scope: $scope,
            templateUrl : '/polizas/app/sctr/mantenimientoTasas/controller/modal-actividad.html',
            controller : ['$scope', '$uibModalInstance', '$uibModal',
              function($scope, $uibModalInstance) {

              //CloseModal
              $scope.closeModal = function () {
                $uibModalInstance.close();
              };
              //
            }]
          });
          vModal.result.then(function(){
            //Action after CloseButton Modal
            console.log('closeButton');
          },function(){
            //Action after CancelButton Modal
            console.log("CancelButton");
          });
          //
        }

        $scope.alertConfirmacion = function(click){
          mModalAlert.showSuccess('El archivo se ha cargado con éxito',''); 
        };

        $scope.alertGuardar = function(click){
          mModalAlert.showSuccess('¡Los cambios han sido guardados con éxito!',''); 
        };
      }
    ]);

    appAutos.directive('fileInputOnChange', function() {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var onChangeHandler = scope.$eval(attrs.fileInputOnChange);
          element.bind('change', onChangeHandler);
        }
      };
    });

  });
