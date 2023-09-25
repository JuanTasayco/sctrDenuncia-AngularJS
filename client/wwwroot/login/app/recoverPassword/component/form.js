'use strict';

define([
  'angular', 'constants', 'helper',
  '/login/app/common/factory/newLoginFactory.js'
], function(angular, constants, helper, factory) {

    var appLogin = angular.module('appLogin');

    appLogin.controller('ctrlFrmRecoverPassword',
      ['$scope'
      , 'newLoginFactory'
      , 'vcRecaptchaService'
      , 'mModalAlert'
      , 'ErrorHandlerService'
      , function($scope
        , newLoginFactory
        , vcRecaptchaService
        , mModalAlert
        , ErrorHandlerService) {

        var _self = this;
        _self.isEmailSent = false;
        /*########################
        # Recaptcha
        ########################*/
        _self.response = null;
        _self.widgetId = null;
        _self.model = {
            //Clave del sitio
            // key: '6LcTeQcUAAAAAHIaBg1y-qC3RvQ4IWetZXq5FGSR' //local
            key: '6LcPg84UAAAAAKdbVssS5964Iy2DWsDr2UteDSZk' //remooto
        };
        _self.msgAlert = {}
        _self.setResponse = function(response) {
            // console.info('Response available');
            _self.response = response;
            // console.log('_self.response ' + _self.response);
        };
        _self.setWidgetId = function(widgetId) {
            // console.info('Created widget ID: %s', widgetId);
            _self.widgetId = widgetId;
        };
        _self.cbExpiration = function() {
            // console.info('Captcha expired. Resetting response object');
            vcRecaptchaService.reload(_self.widgetId);
            _self.response = null;
        };
        /*########################
        # _recoverPassword
        ########################*/
        $scope.validationForm = function() {
          return $scope.frmRecoverPassword.$valid && !$scope.frmRecoverPassword.$pristine;
        };
        function _paramsRecoverPassword(){
          var vParams = {
              userName  : _self.mIngresaUsuario.toUpperCase(),
            };
          return vParams;
        }
        _self._recoverPassword = function() {
          if ($scope.validationForm()) {
            var vParams = _paramsRecoverPassword();
            newLoginFactory.proxyPerson.GetUsersByPersonParam(vParams.userName)
            .then(function(response){
              _self.code = response.operationCode;
            })
            .catch(function(e) {
              ErrorHandlerService.handleError(e);
            });
            newLoginFactory.proxyUsuario.SendEmailRecoverPassword(vParams.userName, true)
            .then(function(response) {
              switch (response.operationCode){
                case constants.operationCode.success:
                  _self.msgAlert.phone = (_self.code == 200 && response.data.origenMail === 'OIM')
                  ? '(01) 213 7373 Anexo 1111'
                  : (_self.code == 200)
                    ? '(01) 213 7373 Anexo 1111'
                    : '(01) 213 7373 Anexo 1111';
                  _self.msgAlert.text = '<br ><br ><strong>Sólo para usuarios Bróker, Corredor o Empresa deberán comunicarse con su gestor comercial siempre y cuando no reconoces o ya no tienes acceso a este correo.</strong>';

                  var txt_email = (response.data.origenMail === 'OIM') ? 'OIM ' : 'cliente ';
                  mModalAlert.showSuccess('Se ha enviado un mensaje a su correo de '+txt_email+response.data.txt_Email+' para reestablecer tu contraseña. Revisa tu bandeja de entrada.' + _self.msgAlert.text, "");
                  _self.isEmailSent = true;
                  _self.mIngresaUsuario = "";
                  
                  _self.cbExpiration();

                  break;
                case constants.operationCode.code900:
                  _self.cbExpiration();
                  mModalAlert.showWarning(response.message, "ALERTA");
                  break;
                default:
                  _self.cbExpiration();
                  mModalAlert.showWarning("No se ha podido procesar la información.", "ALERTA");
              }
            })
            .catch(function(e) {
              ErrorHandlerService.handleError(e);
            });
          }
        }

    }]).component('mpfFormRecoverPassword', {
        templateUrl: '/login/app/recoverPassword/component/form.html',
        controller: 'ctrlFrmRecoverPassword',
        bindings: {
            data: '='
        }
    })

});