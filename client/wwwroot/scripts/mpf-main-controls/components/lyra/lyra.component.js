'use strict';

define(['angular', 'constants', 'crypto-js', '/scripts/mpf-main-controls/components/lyra/factory/pasarelaDePagoFactory.js'], function(
  ng, constants, CryptoJS
) {
  lyraController.$inject = [
    '$scope',
    '$timeout',
    'mpSpin',
    'mModalAlert',
    '$state',
    'pasarelaFactory',
    'proxyPayment',
    'proxyPolicies'
  ];

  function lyraController($scope, $timeout, mpSpin, mModalAlert, $state, pasarelaFactory, proxyPayment, proxyPolicies) {
    var vm = this;

    vm.$onDestroy = onDestroy;
    vm.$onInit = onInit;
    
    // TODO: pendiente de cambio
    vm.publicKey = constants.environment === 'PROD' ? constants.lyra.token.PROD : constants.lyra.token.PRU;

    function onInit() {
      initLyra();
    }

    function initLyra() {
        setTimeout(function() {
          getPaymentSummary();
          KREvents();
        }, 1000)
    }

    function KREvents() {
      KR.onFormReady(function (event) {
        mpSpin.end();
        // quito autofocus asignada para que tome clase kr-focus
        var element = document.getElementById('acme-email');
        if (element) {
          element.blur();
        }
        setTimeout(function () {
          setLabelForm();
        }, 100);
      });

      KR.onSubmit(function(event) {

        vm.hash = event.hash;
        vm.key  = constants.environment === 'PROD' ? constants.lyra.key.PROD : constants.lyra.key.PRU;
        vm.answer = event.clientAnswer;
        vm.signatureBytes = CryptoJS.HmacSHA256(JSON.stringify(vm.answer), vm.key);
  
        if (event.clientAnswer.orderStatus === 'PAID' && vm.hash === vm.signatureBytes.toString(CryptoJS.enc.Hex)) {
          $state.go('paymentMessages', {
            params: {
              summary: vm.dataSummary
            }
          });
        }
      });

      KR.onError(function(event) {
        mModalAlert.showError(event.errorMessage, 'Error en el pago ' + event.errorCode);
      });
    }

    function getPaymentSummary() {      
      proxyPolicies
        .GetPaymentSummary(vm.poliza, vm.cuota, true)
        .then(function(response) {
          if (response.data) {
            if (!response.data.recibo.flagPago) {
            setSummary(response.data);
            }
          }
        })
        .catch(function(err) {
          mModalAlert.showError(err.data.message, 'Error');
        });
    }

    function setSummary(data) {
      vm.dataSummary = data;
      vm.email = data.contratante.email;
      vm.paramToToken = {
        amount: parseFloat((parseFloat(vm.dataSummary.recibo.montoPago) * 100).toFixed(2)),  //A lo que se tenga en decimales multiplicar por 100
        currency: vm.dataSummary.recibo.codigoMoneda,
        orderId: '',
        customer: {
          billingDetails: {
            firstName: vm.dataSummary.contratante.nombres,
            lastName: vm.dataSummary.contratante.apellidoPaterno
          },
          email: vm.dataSummary.contratante.email
        },
        metadata: {
          numeroRamo: vm.ramo,
          numeroRecibo: vm.dataSummary.recibo.numeroRecibo,
          numberQuotes: vm.dataSummary.poliza.numeroCuotas=== 1 ? 1 : vm.dataSummary.poliza.numeroCuotas,
          productName: vm.dataSummary.poliza.nombreProducto,
          policyNumber: vm.poliza,
          expireDate: vm.dataSummary.recibo.fechaVencimiento,
          paymentQuote: vm.dataSummary.poliza.numeroCuotas=== 1 ? 1 : vm.dataSummary.poliza.cuotaPago,
          symbolCurrency: vm.dataSummary.recibo.simboloMoneda,
          companyNumber: vm.dataSummary.poliza.numeroCompania,
          modalityNumber: vm.dataSummary.poliza.numeroModalidad || 0
        }
      };
      mpSpin.start();
      $timeout(function() {
        pasarelaFactory.postData(vm.paramToToken).then(function(responseLyra) {
          if (responseLyra.data && responseLyra.data.status === 'SUCCESS') {
            vm.response = responseLyra;
                KR.setFormConfig({
                  /* set the minimal configuration */
                  formToken: responseLyra.data.answer.formToken,
                  'kr-language': 'es-ES' /* to update initialization parameter */
                });
          } else {
            mpSpin.end();
            console.log(responseLyra.message);
          }
        });
      }, 1000);
    }

    function setLabelForm() {
      window.document.querySelectorAll('.kr-label').forEach(function (data) {
        if (!data.firstElementChild) {
          return void 0;
        }
        data.firstElementChild.innerHTML = getTextTranslate(data.firstElementChild.innerHTML);
      });
    }

    function getTextTranslate(data) {
      var textField = {
        'Card Number': 'Número de tarjeta',
        'Expiration': 'Fecha de vencimiento',
        'Security code': 'Código de seguridad',
        'Card holder name': 'Nombre del titular'
      };

      return textField[data] || data;
    }

    function onDestroy() {}
  } // end

  return ng
    .module('mapfre.controls')
    .controller('lyraController', lyraController)
    .component('lyra', {
      templateUrl: '/scripts/mpf-main-controls/components/lyra/lyra.html',
      controller: 'lyraController',
      controllerAs: 'vm',
      bindings: {
        poliza: '=',
        cuota: '=',
        ramo: '='
      }
    });
});
