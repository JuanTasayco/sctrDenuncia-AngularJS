define([
  'angular',
  'constants',
  'helper',
  'modalSendEmail',
  '/polizas/app/empresa/factory/empresasFactory.js',
  '/scripts/mpf-main-controls/components/modalAssessment/component/modalAssessment.js'
], function(angular, constants, helper){

  var appAutos = angular.module('appAutos');

  appAutos.controller('empresaEmittedController', [
  	'$scope',
    '$window',
    '$state',
    '$uibModal',
    '$timeout',
    'empresasFactory',
    '$q',
    'mpSpin',
    '$http',
    '$sce',
    'mainServices',
    'mModalAlert',
  	function(
      $scope,
      $window,
      $state,
      $uibModal,
      $timeout,
      empresasFactory,
      $q,
      mpSpin,
      $http,
      $sce,
      mainServices,
      mModalAlert
      ){

      (function onLoad(){

        $scope.data = $scope.data || {};

      })();
      $scope.getData = getData;
      $scope.downloadResumen = downloadResumen;
      $scope.sendEmail = sendEmail;
      $scope.emissionNumber = $state.params.emissionNumber;

      if($state.params.encuesta){
        $scope.encuesta = $state.params.encuesta;
        if($scope.encuesta.mostrar == 1){
          mostrarEncuesta();
        }
      }

      $timeout(function(){
        getData($scope.emissionNumber);
      }, 1000);

      function mostrarEncuesta(){
        $scope.encuesta.tipo = 'P';
        $scope.encuesta.CodigoCompania = constants.module.polizas.empresas.companyCode;
        $scope.encuesta.CodigoRamo = constants.module.polizas.empresas.codeRamo;
        $scope.dataConfirmation = {
          save:false,
          valor: 0,
          encuesta: $scope.encuesta
        };
        var vModalConfirmation = $uibModal.open({
          backdrop: 'static', // background de fondo
          keyboard: false,
          scope: $scope,
          // size: 'lg',
          template : '<mpf-modal-assessment data="dataConfirmation" close="close()"></mpf-modal-assessment>',
          controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
            //CloseModal
            $scope.close = function () {
              $uibModalInstance.close();
            };
          }]
        });
        vModalConfirmation.result.then(function(){
        },function(){
        });
      }

      function getData(num){
        empresasFactory.getResumenCotizacion(num, true).then(
          function(response){
            $scope.data = response.Data;
            $scope.codCia = $scope.data.Producto.CodigoCia;
            $scope.numPolicy = $scope.data.NumeroPoliza;
        });
      }

      function sendEmail(){
         $scope.emailData = {
          reporteParam: {
            CodigoCompania: $scope.codCia,
            NumeroPoliza: $scope.numPolicy
          }
        };

        $scope.action = 'enviarPolizaEmitida';
        $uibModal.open({
          backdrop: true, // background de fondo
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          template : '<mpf-modal-send-email action="action" data="emailData" close="close()"></mpf-modal-send-email>',
          controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
            //CloseModal
            $scope.close = function () {
              $uibModalInstance.close();
            };
          }]
        });
      }

      function downloadResumen(){

        var deferred = $q.defer();
        mpSpin.start();
        $http({
          method: "GET",
          url: constants.system.api.endpoints.policy+"api/empresa/descarga/emision/"+$scope.codCia+"/"+$scope.numPolicy,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          responseType: 'arraybuffer'
        })
        .then(function(data){
          if(data.status == 200){
            var defaultFileName = 'poliza_emitida_'+$scope.numPolicy+'.pdf';
            defaultFileName = defaultFileName.replace(/[<>:"/\\|?*]+/g, '_');
            var vtype=  data.headers(["content-type"]);
            var file = new Blob([data.data], {type: vtype});
            mpSpin.end();
            $window.saveAs(file, defaultFileName);
            deferred.resolve(defaultFileName);
          }else{
            mpSpin.end();
            mModalAlert.showError("Ha ocurrido un error al generar el PDF", "Descargar Poliza");
          }
        }, function(response){
          mpSpin.end();
          mModalAlert.showError("Ha ocurrido un error al generar el PDF", "Descargar Poliza");
        })
      }


  }]);

});
