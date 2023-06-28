'use strict';

define(['angular', 'lodash'], function(angular, _) {
  paymentTypeController.$inject = ['mModalAlert', 'proxyPolicies'];

  function paymentTypeController(mModalAlert, proxyPolicies) {
    var vm = this;
    vm.saveTypePayment = saveTypePayment;
    vm.tooltipDirecto =
      'Luego de realizar la emisión, el usuario puede ingresar los datos de la tarjeta para realizar el pago';
    vm.tooltipDiferido =
      'Luego de realizar la emisión, el usuario puede enviar un correo al cliente con el link de la pasarela de pago';
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.productos = [];

    function onInit() {
      proxyPolicies
        .GetConfigurationPayment(0, true)
        .then(function(response) {
          if (response.data) {
            vm.productos = response.data;
            vm.productos = _.map(vm.productos, function (p) {
              return _.assign({}, p, { diferido: p.flagDiferido === 1, directo: p.flagDirecto === 1 })
            })
          }
        })
        .catch(function(err) {
          mModalAlert.showError(err.data.message, 'Error');
        });
    }

    function saveTypePayment() {
      if (
        vm.productos.every(function(value) {
          value.diferido ? (value.flagDiferido = 1) : (value.flagDiferido = 0);
          value.directo ? (value.flagDirecto = 1) : (value.flagDirecto = 0);
          return value.directo || value.diferido;
        })
      ) {
        save();
      } else {
        mModalAlert.showError('Debes seleccionar una modalidad de pago para cada producto', 'Configuración de modalidades de pago');
      }
    }

    function save() {
      proxyPolicies
        .UpdateConfigurationPayment(vm.productos, true)
        .then(function(response) {
          if (response.data) {
            mModalAlert.showSuccess(
              'Configuración de modalidades de pago  ha sido actualizada',
              'Configuración de modalidades de pago'
            );
          }
        })
        .catch(function(err) {
          mModalAlert.showError(err.data.message, 'Error');
        });
    }

    function onDestroy() {}
  } // end

  return angular.module('appAutos').controller('paymentTypeController', paymentTypeController);
});
