(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
  '/polizas/app/hogar/proxy/hogarFactory.js',
  'modalSendEmail', '/polizas/app/documentos/proxy/documentosFactory.js'],
  function(angular, constants, helper){

    var appAutos = angular.module('appAutos');

    appAutos.controller('hogarEmittedController',
      ['$scope', '$window', '$state', 'hogarFactory', '$uibModal', 'homeEmission', 'mModalAlert', 'oimAbstractFactory', 'documentosFactory',
      function($scope, $window, $state, hogarFactory, $uibModal, homeEmission, mModalAlert, oimAbstractFactory, documentosFactory){

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
          numeroDocumento: 0,
          numeroPoliza: 0
        };

        $scope.paramsPdf = {
          url: 'api/documento/descargardocumento',
          data: ''
        };

        (function onLoad(){
          $scope.mainStep = $scope.mainStep || {};

          $scope.constants = $scope.constants || {};
          $scope.filters = $scope.filters || {};
          $scope.functions = $scope.functions || {};

          $scope.constants.currencyType = constants.currencyType.dollar.description;

          //REDIRECCIONAR A ALGUN LADO
          (homeEmission) ? $scope.mainStep.emissionData = homeEmission : $state.go('hogarHome');

        })();

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
            agrupador: 0,  // TODO: cotizacion
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
        # SendEmail
        #########################*/
        $scope.sendEmail = function(){
          var vDocumentNumber = $scope.mainStep.emissionData.NumeroDocumento;
          hogarFactory.detailEmitted(vDocumentNumber, true).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              if (response.Data.Descripcion !== ''){
                mModalAlert.showError(response.Data.Descripcion, 'Error');
              }else{
                //Modal
                var policyNumber = $scope.mainStep.emissionData.NumeroPoliza;
                $scope.emailData = {
                  reporteParam: {
                    numeroPoliza: policyNumber
                  }
                };
                $scope.action = constants.modalSendEmail.hogarEmit.action; //constants.modalSendEmail.emitir.action; //PorConfirmar, se el mismo servicio de envirCotizar
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
            }
          }, function(error){
          }, function(defaultError){
          });
        }

        /*#########################
        # downloadPDF
        #########################*/
        $scope.downloadPDF = function(){
          var vDocumentNumber = $scope.mainStep.emissionData.NumeroDocumento;
          hogarFactory.detailEmitted(vDocumentNumber, true).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              if (response.Data.Descripcion !== ''){
                mModalAlert.showError(response.Data.Descripcion, 'Error');
              }else{
                var policyNumber = $scope.mainStep.emissionData.NumeroPoliza;
                var vFileName = 'OIM - ' + policyNumber + '.pdf';
                documentosFactory.generarArchivo(policyNumber, vFileName);
              }
            }
          });
        }


    }]).factory('loaderHogarEmittedController', ['hogarFactory', '$q', function(hogarFactory, $q){
      var claims, emission;

      //Claims
      function getClaims(){
       var deferred = $q.defer();
        hogarFactory.getClaims().then(function(response){
          claims = response;
          deferred.resolve(claims);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      //Emission
      function getEmission(emissionNumber, showSpin){
       var deferred = $q.defer();
        hogarFactory.getEmission(emissionNumber, showSpin).then(function(response){
          emission = response.Data;
          deferred.resolve(emission);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      return {
        getClaims: function(){
          if(claims) return $q.resolve(claims);
          return getClaims();
        },
        getEmission: function(emissionNumber, showSpin){
          if(emission) return $q.resolve(emission);
          return getEmission(emissionNumber, showSpin);
        }
      }

    }])

  });
