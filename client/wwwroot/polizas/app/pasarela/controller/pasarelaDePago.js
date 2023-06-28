'use strict';

define(['angular', 'lyra'], function(angular) {
  paymentGatewayController.$inject = [
    '$scope',
    '$stateParams',
    'proxyPolicies',
    'mModalAlert',
    '$state',
    'proxyPayment'
  ];

  function paymentGatewayController($scope, $stateParams, proxyPolicies, mModalAlert, $state, proxyPayment) {
    var vm = this;

    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.showSummary = true;
    $scope.tooltipContent;

    function onInit() {
      $scope.productos = [];
      $scope.paymentParam = $stateParams.paymentParam;
      if ($scope.paymentParam) {
        $scope.paymentParam.font = $scope.paymentParam.font || 'ico-mapfre-356-myd-default';
        getConfigurationPayment();
      }
    }

    function getConfigurationPayment() {
      proxyPolicies
        .GetConfigurationPayment(0, true)
        .then(function(response) {
          if (response.data) {
            getPaymentSummary(response.data);
          }
        })
        .catch(function(err) {
          mModalAlert.showError(err.data.message, 'Error');
        });
    }

    function isPaymentDirect() {
      return $scope.productos.some(function(product) {
        return product.numeroRamo.some(function(numeroRamo) {
          return numeroRamo === parseInt($scope.paymentParam.policy.codeRamo) && product.flagDirecto === 1;
        });
      });
    }

    function isPaymentDeferred() {
      return $scope.productos.some(function(product) {
        return product.numeroRamo.some(function(numeroRamo) {
          return numeroRamo === parseInt($scope.paymentParam.policy.codeRamo) && product.flagDiferido === 1;
        });
      });
    }

    $scope.setTooltipContent = function(paymentDirect) {
      $scope.tooltipContent = paymentDirect ?
        'Luego de realizar la emisión, el usuario puede ingresar los datos de la tarjeta para realizar el pago' :
        'Luego de realizar la emisión, el usuario puede enviar un correo al cliente con el link de la pasarela de pago';
    }

    $scope.sendMailPaymentDeferred = function() {
      proxyPayment
        .SendMailPaymentDeferred($scope.dataSummary, true)
        .then(function(response) {
          if (response.operationCode === 200) {
            mModalAlert.showSuccess(
              'Se ha enviado el link de pago del recibo al correo ingresado, este link expira en 24hrs.',
              'Correo enviado'
            );
          } else {
            mModalAlert.showError(response.message, 'Error');
          }
        })
        .catch(function(err) {
          mModalAlert.showError(err.data.message, 'Error');
        });
    };

    function getPaymentSummary(data) {
      $scope.productos = data;
      $scope.showPaymentDirect = isPaymentDirect();
      $scope.showPaymentDeferred = isPaymentDeferred();
      $scope.setTooltipContent($scope.showPaymentDirect);
      proxyPolicies
        .GetPaymentSummary($scope.paymentParam.policy.policyNumber, $scope.paymentParam.policy.quoteNumber, true)
        .then(function(response) {
          if (!response.data) {
            return;
          }
          $scope.dataSummary = response.data;
          // $scope.dataSummary.vvencimiento = '13/09/2019';
          $scope.emailDif = $scope.dataSummary.contratante.email || '';
          $scope.dataSummary.poliza.cuotaPago = $scope.paymentParam.policy.quoteNumber;
          if ($scope.dataSummary.recibo.flagPago) {
            $state.go('pagado', {
              params: {
                summary: $scope.dataSummary
              }
            });

          }
        })
        .catch(function(err) {
          mModalAlert.showError(err.data.message, 'Error');
        });
    }

    function onDestroy() {}
  } // end

  return angular.module('appAutos').controller('paymentGatewayController', paymentGatewayController);
});
