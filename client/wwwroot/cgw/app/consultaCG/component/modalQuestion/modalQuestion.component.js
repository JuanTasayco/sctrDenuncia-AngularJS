define([
  'angular', 'constants', '/cgw/app/factory/cgwFactory.js'
], function(ng, constants) {

  ModalQuestionController.$inject = ['$scope', 'cgwFactory', '$q', 'mModalAlert'];

  function ModalQuestionController($scope, cgwFactory, $q, mModalAlert) {
    var vm = this;
    vm.data.txtBtnThx = vm.data.txtBtnThx || 'Cerrar';

    vm.seguros = constants.module.cgw.seguros;

    vm.getListDiagnostic = function(wilcar) {
      if (wilcar && wilcar.length >= 3) {
        var paramDiagnostic = {
          diagnosticName: wilcar.toUpperCase()
        };

        var defer = $q.defer();
        cgwFactory.getListDiagnostic(paramDiagnostic, false).then(function(response) {
          defer.resolve(response.data.items);
        }, function(error){
          mModalAlert.showError(error.data.message, 'Error');
        });

        return defer.promise;
      }
    };

  } // end controller

  return ng.module('appCgw')
    .controller('ModalQuestionController', ModalQuestionController)
    .component('mfpModalQuestion', {
      templateUrl: '/cgw/app/consultaCG/component/modalQuestion/modalQuestion.html',
      controller: 'ModalQuestionController',
      bindings: {
        data: '=?',
        close: '&?'
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
