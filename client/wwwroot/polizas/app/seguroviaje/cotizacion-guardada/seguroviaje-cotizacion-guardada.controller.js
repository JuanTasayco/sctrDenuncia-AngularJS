'use strict';

define([
  'angular',
  'modalSendEmail',
  'seguroviajeService',
  'seguroviajeFactory',
  '/scripts/mpf-main-controls/components/modalAssessment/component/modalAssessment.js'
  ], function(ng) {

  SeguroviajeCotizacionGuardadaController.$inject = [
    '$scope',
    '$uibModal',
    '$state',
    '$location',
    '$q',
    '$window',
    'mpSpin',
    'mModalAlert',
    'seguroviajeService',
    'seguroviajeFactory'
  ];

  function SeguroviajeCotizacionGuardadaController(
    $scope
    , $uibModal
    , $state
    , $location
    , $q
    , $window
    , mpSpin
    , mModalAlert
    , seguroviajeService
    , seguroviajeFactory) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit(){
      if($state.params.numeroDoc){
        vm.numeroDoc = $state.params.numeroDoc
        vm.showSendEmail = showSendEmail;
        vm.getPDF = getPDF;
        setSummary(vm.numeroDoc);

        if($state.params.encuesta){
          $scope.encuesta = $state.params.encuesta;
          if($scope.encuesta.mostrar == 1){
            mostrarEncuesta();
          }
        }
      }
      else{
        $state.go('homePolizasSeguroviaje')
      }
    }

    function mostrarEncuesta(){
      console.log("$scope.encuesta", $scope.encuesta);
      $scope.encuesta.tipo = 'C';
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
    // Este metodo sirve para llenar el objeto de cotización
    function setSummary(numeroDoc){
      if($location.$$path.split('/')[2] == 'cotizacion-emitida'){
        seguroviajeService.getEmissionSummary(numeroDoc, true)
        .then(function(response){
          vm.emission = response.data;
        })
        .catch(function(){
          mModalAlert.showWarning('Ha ocurrido un error al cargar la información','')
          .then(function(data){
            if(data){
              $state.go('seguroviajeCotizaciones');
            }
          })
        })
      }
      else{
        seguroviajeService.getQuotationSummary(numeroDoc, true)
        .then(function(response){
          vm.quotation = response.data
        })
      }
    }
    function showSendEmail(isEmission) {
      $scope.emailData = isEmission ? { policyNumber: vm.emission.policyNumber } : { documentNumber: vm.numeroDoc };
      $scope.action = isEmission ? 'seguroViajeEmit' : 'seguroViajeQuote';
			$uibModal.open({
				backdrop: true, // background de fondo
				backdropClick: true,
				dialogFade: false,
				keyboard: true,
				scope: $scope,
				// size: 'lg',
				template : '<mpf-modal-send-email action="action"  data="emailData" close="close()"></mpf-modal-send-email>',
				controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
					//CloseModal
					$scope.close = function () {
						$uibModalInstance.close();
					};
				}]
			});
    }
    // Metodo para conseguir el PDF
    function getPDF(isEmission){
      mpSpin.start();
      var documentNumber = isEmission ? vm.emission.policyNumber : vm.numeroDoc;
      seguroviajeService.getPDF(documentNumber, isEmission)
      .then(function(data) {
        var deferred = $q.defer();
        var defaultFileName = isEmission ? 'ReportEmisionViaje.pdf' : 'ReporteCotizacionViaje.pdf';
        var vtype =  data.headers(["content-type"]);
        var file = new Blob([data.data], {type: vtype});
        mpSpin.end();
        $window.saveAs(file, defaultFileName);
        deferred.resolve(defaultFileName);
      })
      .catch(function(err){
        mpSpin.end();
      })
    }
  }

  return ng.module('appSeguroviaje').controller('SeguroviajeCotizacionGuardadaController', SeguroviajeCotizacionGuardadaController);
});
