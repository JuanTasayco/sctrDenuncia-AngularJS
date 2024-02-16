define([
  'angular', 'constants', 'constantsRiesgosGenerales', 'datosEmision', 'cargaMasiva', 'rrggSuscriptor'
], function (angular, constants, constantsRiesgosGenerales) {
  'use strict';

  angular
    .module("appRrgg")
    .controller('emisionRrggStep3Controller', emisionRrggStep3Controller);

  emisionRrggStep3Controller.$inject = ['$scope', '$state', 'mModalAlert', 'riesgosGeneralesFactory', 'riesgosGeneralesService', 'oimClaims', 'mModalConfirm', 'oimAbstractFactory'];

  function emisionRrggStep3Controller($scope, $state, mModalAlert, riesgosGeneralesFactory, riesgosGeneralesService, oimClaims, mModalConfirm, oimAbstractFactory) {

    (function load_emisionRrggStep3Controller() {
      $scope.constantsRrgg = constantsRiesgosGenerales;
      $scope.tramite = riesgosGeneralesFactory.getTramite();
      $scope.tramite.userEmail = oimClaims.userEmail
      $scope.tramite.userProfile = oimClaims.userProfile
      $scope.tramite.loginUserName = oimClaims.loginUserName
      $scope.emision = {}
      $scope.isMydream = oimAbstractFactory.isMyDream();
    })();
    $scope.Emitir = function () {
      if (_validateForm()) {
        if ($scope.tramite.Grupo === constantsRiesgosGenerales.GRUPO.TRAB_ESPECIFICOS
          || $scope.tramite.Grupo === constantsRiesgosGenerales.GRUPO.VIGLIMP) {
          var trabajadores = riesgosGeneralesFactory.cotizacion.emision.modelo.listaPlanillas[0].listaTrabajador;
          var trabajadoresOption = riesgosGeneralesFactory.cotizacion.emision.modelo.listaPlanillas[0].optionRadio;
          if ($scope.tramite.CantTrabajadores !== trabajadores.length) {
            if (trabajadoresOption === '1') {
              mModalAlert.showWarning(constantsRiesgosGenerales.SMS_INFO.DATA_TRABAJADORES_1 + '' + $scope.tramite.CantTrabajadores + '' + constantsRiesgosGenerales.SMS_INFO.DATA_TRABAJADORES_2, "ALERTA");
              return
            }
          }
        }
        if ($scope.tramite.Grupo === constantsRiesgosGenerales.GRUPO.VIGLIMP && $scope.tramite.ResCotizacion.MasUbicaciones === "1") {
          var ubicaciones = riesgosGeneralesFactory.cotizacion.emision.modelo.listaPlanillas[1].listaUbicaciones;
          var ubicacionesOption = riesgosGeneralesFactory.cotizacion.emision.modelo.listaPlanillas[1].optionRadio;
          if (parseInt($scope.tramite.ResCotizacion.CantidadUbicaciones) !== ubicaciones.length) {
            if (ubicacionesOption === '1') {
              mModalAlert.showWarning(constantsRiesgosGenerales.SMS_INFO.DATA_UBICACIONES_1 + '' + $scope.tramite.ResCotizacion.CantidadUbicaciones + '' + constantsRiesgosGenerales.SMS_INFO.DATA_UBICACIONES_2, "ALERTA");
              return
            }
          }
        }
        mModalConfirm.confirmWarning('', '¿ESTA SEGURO DE SOLICITAR LA POLIZA?', 'ACEPTAR').then(function (response) {
          var requestEmision = riesgosGeneralesFactory.getModelEmision();
          
          if ($scope.isMydream){
            requestEmision.CodigoApp = 'MYD';
            requestEmision.CodigoUsr = requestEmision.CodigoUsrSuscripcion;
          }else{
            requestEmision.CodigoApp = 'OIM';
          }

          riesgosGeneralesService.emision(requestEmision, $scope.tramite.Grupo).then(function (response) {
            if (response.OperationCode === constants.operationCode.success) {
              mModalAlert.showSuccess("Solicitud enviada correctamente.", "NUEVA SOLICITUD ENVIADA").then(function (rs) {
                if (rs) {
                  $state.go(constantsRiesgosGenerales.ROUTES.COTIZACION_STEPS, { step: constantsRiesgosGenerales.STEPS.COTIZACION });
                }
              })
            } else {
              mModalAlert.showWarning(response.Message, "¡Alerta!").then(function (rs) {
              })
            }
          }).catch(function (error) {
            mModalAlert.showError("Ocurrio un error interno. Favor, reportarlo a mesa de ayuda.", "Mapfre: Error interno")
          });
        });
      }
    }
    $scope.saveSuscriptor = function () {
      if (_validateForm()) {
        $scope.frmEmision.$valid = false
        var file = riesgosGeneralesFactory.cotizacion.emision.modelo.documentacionAll
        var requestSuscriptor = riesgosGeneralesFactory.getModelSuscriptor();

        if ($scope.isMydream){
          requestSuscriptor.CodigoApp = 'MYD';
          requestSuscriptor.CodigoUsr = requestSuscriptor.CodigoUsrSuscripcion;
        }else{
          requestSuscriptor.CodigoApp = 'OIM';
        }

        riesgosGeneralesService.sendSuscriptor(file, requestSuscriptor).then(function (response) {
          $scope.frmEmision.$valid = true
          if (response.data.OperationCode === constants.operationCode.success) {
            mModalAlert.showSuccess(response.data.Message, "EXITOSO").then(function (rs) {
              if (rs) {
                $state.go(constantsRiesgosGenerales.ROUTES.COTIZACION_STEPS, { step: constantsRiesgosGenerales.STEPS.COTIZACION });
              }
            })
          } else {
            mModalAlert.showWarning(response.data.Message, "¡Alerta!").then(function (rs) {
            })
          }
        }).catch(function (error) {
          $scope.frmEmision.$valid = true
          mModalAlert.showError("Ocurrio un error interno. Favor, reportarlo a mesa de ayuda.", "Mapfre: Error interno")
        });
      }
    }
    function _validateForm() {
      $scope.frmEmision.markAsPristine();
      return $scope.frmEmision.$valid;
    }
    $scope.verResumen = function () {
      riesgosGeneralesFactory.cotizacion.tramite = $scope.tramite
      $state.go(constantsRiesgosGenerales.ROUTES.COTIZACION_STEPS, { step: constantsRiesgosGenerales.STEPS.RESULTADOS });
    }
  }

});
