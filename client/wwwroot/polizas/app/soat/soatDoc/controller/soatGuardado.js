define([
  'angular', 'constants',
  '/polizas/app/soat/soatDoc/service/soatGuardadoFactory.js',
  'modalSendEmail',
  '/scripts/mpf-main-controls/components/modalAssessment/component/modalAssessment.js'
], function(angular, constants){

  var appSoat = angular.module('appSoat');

  appSoat.controller('soatDocController', ['$scope', 'mpSpin', 'soatGuardadoFactory', 'mModalAlert', '$uibModal', '$sce', '$window', '$state', 'oimPrincipal',
    function($scope, mpSpin, soatGuardadoFactory, mModalAlert, $uibModal, $sce, $window, $state, oimPrincipal){

    var key = 'documentosCotizacion';
    $scope.currencyType = constants.currencyType.dollar;

    (function onLoad(){
    //cargamos datos del usuario logueado

      mpSpin.start();
      soatGuardadoFactory.getClaims().then(function(response){
          $scope.dataClaims = response;
          if ($scope.dataClaims.length>0){
            $scope.codigoUsuario = $scope.dataClaims[2].value.toUpperCase();
            $scope.codAgente = $scope.dataClaims[7].value;
          }
          soatGuardadoFactory.getGestorOficina($scope.codAgente).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              var dataGestor = response.Data;
              if (dataGestor.length>0){
                $scope.CodigoGestor = dataGestor.codigoGestor;
                $scope.CodigoOficina = dataGestor.codigoOficina;
              }
            }
             mpSpin.end();
          });
      });
    })();

    /*#######################################
    # Si venimos de la pagina de cotizacion
    #######################################*/

    if((soatGuardadoFactory.getVariableSession(key).length>0) ||
      (typeof(soatGuardadoFactory.getVariableSession(key)) != 'undefined')){
      $scope.nroCoti = soatGuardadoFactory.getVariableSession(key);

    if((soatGuardadoFactory.getVariableSession('ReferenciaBancariaSOAT').length>0) ||
      (typeof(soatGuardadoFactory.getVariableSession('ReferenciaBancariaSOAT')) != 'undefined')){

        $scope.NumeroReferenciaBancaria = soatGuardadoFactory.getVariableSession('ReferenciaBancariaSOAT');
        delete soatGuardadoFactory.eliminarVariableSession('ReferenciaBancariaSOAT');
      }
      buscarDocumento();
      delete soatGuardadoFactory.eliminarVariableSession(key);
    }

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

    function buscarDocumento(){
      if($scope.nroCoti!=null && $scope.nroCoti>0){

        mpSpin.start();
        soatGuardadoFactory.buscarDocumento($scope.nroCoti).then(function(response){
          if(response.OperationCode == constants.operationCode.success){
             mpSpin.end();
            if($scope.nroCoti){
              $scope.cotizacionGuardada = response.Data;

              $scope.cotizacionGuardada.PrimaNeta = $scope.cotizacionGuardada.PrimaNeta.toFixed(2);

              if($scope.cotizacionGuardada.CodigoMoneda == 2)
                $scope.currencyType = constants.currencyType.dollar;
              else
                $scope.currencyType = constants.currencyType.soles;

              $scope.NumeroPoliza = $scope.cotizacionGuardada.NumeroPoliza;
              $scope.PrimaNeta = response.Data.PrimaNeta;
            }
          }else if (response.Message.length > 0){
            mpSpin.end();
          }
        }, function(error){
          mpSpin.end();
          console.log('Error en buscarDocumento: ' + error);
        });

      }else{
        $state.go('homePolizasSOAT');
      }
    }

    /*#######################################
    # SEND EMAIL
    #######################################*/
    $scope.sendEmail = function(){
      $scope.emailData =
        {
          emisor: '',
          nombreEmisor: '',
          reporteParamSoat: {
            CodigoCompania : constants.module.polizas.autos.companyCode,
            NumeroPoliza : $scope.cotizacionGuardada.NumeroPoliza,
            CodigoProceso : 'EMIS0001',
            CodigoRamo : constants.module.polizas.soat.codeRamo,
            Usuario : $scope.codigoUsuario,
            NumApliShipTo : 0,
            numeroShipTo : 0,
            numeroAplicacion : 0
          },
          asunto: '',
          receptor: '',
          mensaje: ''
        };

      $scope.action = constants.modalSendEmail.soat.action;///api/general/mail/emisionSoat/sendMail

      //Modal
      $scope.optionSendEmail = constants.modalSendEmail.autosCotizacionGuardada;
      var vModalSendEmail = $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        // size: 'lg',
        template : '<mpf-modal-send-email action="action" data="emailData" close="close()"></mpf-modal-send-email>',
        controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
          //CloseModal
          $scope.close = function () {
            $uibModalInstance.close();
          };
        }]
      });
      vModalSendEmail.result.then(function(){
      },function(){
      });
    };

    /*#########################
    # downloadPDF
    #########################*/
    $scope.reporteCotizacion = function(){
     if(oimPrincipal.get_role().toUpperCase() !== "AGTDIG"){
      var params = {
        CodigoCompania : 1,
        NumeroPoliza : $scope.cotizacionGuardada.NumeroPoliza,
        CodigoProceso : 'EMIS0001',
        CodigoRamo : constants.module.polizas.soat.codeRamo,
        Usuario : $scope.codigoUsuario,
        NumApliShipTo : 0,
        numeroShipTo : 0,
        numeroAplicacion : 0
      };
      var vFileName = 'OIM_SOAT_' + $scope.cotizacionGuardada.NumeroPoliza + '.pdf';
      soatGuardadoFactory.generarPDF(params, vFileName);
     }
    };

    $scope.isAgenteDigital = function(){
      return (oimPrincipal.get_role().toUpperCase() == "AGTDIG");
    };


    $scope.emitirAgain = function(){
      $scope.$parent.formData = {};
      $state.go('soatEmit.steps', {step: 1}, {reload: true, inherit: false});
    }

    $scope.goToPaymentGateway = function() {
      // TODO: pendiente de actualizar con campos del servicio: : monto a pagar y moneda
      $state.go('paymentGateway', {
        paymentParam: {
          policy: {
            policyNumber: $scope.cotizacionGuardada.NumeroPoliza,
            quoteNumber: 1,
            codeRamo: constants.module.polizas.soat.codeRamo
          },
          contractor: {
            firstName: $scope.cotizacionGuardada.Contratante.Nombre,
            lastName: $scope.cotizacionGuardada.Contratante.ApellidoPaterno,
            phoneNumber: $scope.cotizacionGuardada.Contratante.Telefono,
            email: $scope.cotizacionGuardada.Contratante.CorreoElectronico
          },
          font: 'ico-mapfre-351-myd-soat'
        }
      });
    };


  }]);

  appSoat.filter('makePositive', function() {
    return function(num) { return Math.abs(num); }
  });

  appSoat.filter('isEmpty', function () {
    var bar;
    return function (obj) {
      for (bar in obj) {
        if (obj.hasOwnProperty(bar)) {
          return false;
        }
      }
      return true;
    };
  });

});
