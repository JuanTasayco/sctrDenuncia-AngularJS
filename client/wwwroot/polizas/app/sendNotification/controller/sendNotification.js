'use strict';

define(['angular', 'lodash'], function(angular, _) {
  sendNotificationController.$inject = ['mModalAlert', 'proxyHome', 'oimClaims'];

  function sendNotificationController(mModalAlert, proxyHome, oimClaims) {
    var vm = this;
    vm.onInit = onInit;
    vm.send = send;
    vm.onDestroy = onDestroy;

    function onInit() {}

    function send() {
      if (!(vm.mTitulo && vm.mMensaje && vm.mPara)) {
        mModalAlert.showError('Complete los datos', 'Error');
        return;
      }

      vm.params = {
        "email": "",
        "titulo": vm.mTitulo,
        "mensaje": vm.mMensaje,
        "tipoNotificacion": "MENSAJE",
        "documento": "",
        "usuarioEmisor": oimClaims.loginUserName,
        "agenteEmisor": 0,
        "usuarioReceptor": vm.mPara.codigoUsuario,
        "agenteReceptor": vm.mPara.codigoAgente,
        "flagRevision": 0
      };

      proxyHome
      .CreateNotification(vm.params, true)
      .then(function(response) {
        if (response.operationCode !== 200) {
          return;
        }
        mModalAlert.showSuccess("La notificación ha sido enviada con éxito", "Notificacion enviada");
        clearFields();
      })
      .catch(function(err) {
        mModalAlert.showError(err.data.message, 'Error');
      });
    }

    function clearFields() {
      vm.mPara = undefined;
      vm.mTitulo = '';
      vm.mMensaje = '';
    }

    function onDestroy() {}
  } // end

  return angular.module('appAutos').controller('sendNotificationController', sendNotificationController);
});
