define([
  'angular', '/cgw/app/factory/cgwFactory.js'
], function(ng) {

  ModalBuscarDiagnosticoController.$inject = ['$scope', '$timeout', '$log', 'cgwFactory', '$q', '$state', 'mModalAlert'];

  function ModalBuscarDiagnosticoController($scope, $timeout, log, cgwFactory, $q, $state, mModalAlert) {
    var vm = this;

    vm.$onInit = function() {
      vm.message = false;
    };

    vm.guardar = function() {
      if (vm.carta.ShowObservaciones) {
        if (vm.carta.CodDiagnostico &&
          vm.carta.DoctorRemark) {
          vm.update();
        }
      } else {
        if (vm.carta.CodDiagnostico) {
          var paramsDiagnosticoUpdate = {
            CodeCompany: vm.carta.CodeCompany,
            Year: vm.carta.Year,
            Number: vm.carta.Number,
            DiagnosticCode: vm.carta.CodDiagnostico.code,
            UserUpdate: vm.carta.UserUpdate,
            IsPreExistence: vm.carta.isPreExistence,
            AmputationIndicator: vm.carta.AmputationIndicator
          };

          cgwFactory.updateDiagnostico(paramsDiagnosticoUpdate).then(function (response) {
            if (response.data) {
              vm.message = true;
            }
          }, function(error) {
            mModalAlert.showError("", 'Error');
          });
        }
      }
    };

    vm.getListDiagnostic = function(wilcar) {
      if (wilcar && wilcar.length >= 3) {
        var paramDiagnostic = {
          diagnosticName: wilcar.toUpperCase()
        };

        var defer = $q.defer();
        cgwFactory.getListDiagnostic(paramDiagnostic, false).then(function(response) {
          defer.resolve(response.data.items);
         }, function(error) {
          mModalAlert.showError(error.data.message, 'Error');
        });

        return defer.promise;
      }
    };

    vm.reload = function() {
      $state.reload();
    }

  } // end controller

  return ng.module('appCgw')
    .controller('ModalBuscarDiagnosticoController', ModalBuscarDiagnosticoController)
    .component('mfpModalBuscarDiagnostico', {
      templateUrl: '/cgw/app/consultaCG/component/modalBuscarDiagnostico/modalBuscarDiagnostico.html',
      controller: 'ModalBuscarDiagnosticoController',
      bindings: {
        close: '&?',
        carta: '=?',
        update: '&?'
      }
    })
    .directive('preventDefault', function() {
      return function(scope, element, attrs) {
          angular.element(element).bind('click', function(event) {
              event.preventDefault();
              event.stopPropagation();
          });
      }
    });
});
