(function($root, deps, action){
		define(deps, action)
})(this, ['angular', 'constants', 'helper',
	'/polizas/app/hogar/proxy/hogarFactory.js',
	'/polizas/app/autos/autosEmitirUsado/component/groupPolize/groupPolize.js',
  'modalSendEmail',
  '/polizas/app/documentos/proxy/documentosFactory.js',
  '/scripts/mpf-main-controls/components/modalAssessment/component/modalAssessment.js'],
	function(angular, constants, helper){

		var appAutos = angular.module('appAutos');

		appAutos.controller('hogarEmittResumenController',
			['$scope', '$window', '$state', 'hogarFactory', '$uibModal', 'oimAbstractFactory', 'documentosFactory',
			function($scope, $window, $state, hogarFactory, $uibModal, oimAbstractFactory, documentosFactory){

        $scope.isMyDream = oimAbstractFactory.isMyDream();
        var codCompania = constants.module.polizas.hogar.codeCia;
        var codRamo = constants.module.polizas.hogar.codeRamo;

        // Request para firma
        $scope.paramsSignature = {
          tipoFirma: 2,
          tipoPoliza: "HOGAR",
          numeroRamo: codRamo,
          numeroCompania: codCompania,
          numeroModalidad: 0,
          numeroCotizacion: 0,
          numerDocumento: 0,
          firma: ''
        };
        $scope.paramsPdf = {
          url: 'api/documento/descargardocumento',
          data: ''
        };

				(function onLoad(){

				})();

				hogarFactory.getQuotation($state.params.numDocument, true).then(function(response) {
          if (response.OperationCode == constants.operationCode.success) {
						$scope.dataResumen = response.Data;
          }
        });

        if($state.params.encuesta){
          $scope.encuesta = $state.params.encuesta;
          if($scope.encuesta.mostrar == 1){
            mostrarEncuesta();
          }
        }

        function mostrarEncuesta(){
          console.log("$scope.encuesta", $scope.encuesta);
          $scope.encuesta.tipo = 'P';
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

        // Firma
        $scope.isMobile = helper.isMobile();
        $scope.onSignature = function (data) { }

        $scope.getParamsSignature = function (nroDoc) {
          return {
            tipoFirma: 2,
            tipoPoliza: "HOGAR",
            numeroRamo: codRamo,
            numeroCompania: codCompania,
            numeroModalidad: 0, // TODO: asignar
            numeroCotizacion: 0,
            numeroPoliza: nroDoc,
            numeroDocumento: 0,
            agrupador: 0, // TODO: asignar cotizacion
            firma: ''
          }
        }

        $scope.getParamsPdf = function (nroDoc) {
          return {
            url: 'api/documento/descargardocumento',
            data: nroDoc
          }
        }

				/*#########################
        # downloadPDF
        #########################*/
				$scope.downloadPDF = function() {
          var vFileName = 'OIM - ' + $scope.dataResumen.NumeroPoliza + '.pdf';
          documentosFactory.generarArchivo($scope.dataResumen.NumeroPoliza, vFileName);
				}

				/*#########################
        # sendEmail
        #########################*/
				$scope.sendEmail = function(){
          $scope.emailData = {
            reporteParam: {
              numeroPoliza: $scope.dataResumen.NumeroPoliza
            }
          }

          //Modal
					$scope.action = constants.modalSendEmail.hogarEmit.action;
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

        $scope.goToPaymentGateway = function() {
          // TODO: pendiente de actualizar con campos del servicio: : monto a pagar y moneda
          $state.go('paymentGateway', {
            paymentParam: {
              policy: {
                policyNumber: $scope.dataResumen.NumeroPoliza,
                quoteNumber: 1,
                codeRamo: constants.module.polizas.hogar.codeRamo
              },
              contractor: {
                firstName: $scope.dataResumen.Contratante.Nombre,
                lastName: $scope.dataResumen.Contratante.ApellidoPaterno,
                phoneNumber: $scope.dataResumen.Contratante.Telefono,
                email: $scope.dataResumen.Contratante.CorreoElectronico
              },
              font: 'ico-mapfre-358-myd-house'
            }
          });
        };

		}]);
	});
