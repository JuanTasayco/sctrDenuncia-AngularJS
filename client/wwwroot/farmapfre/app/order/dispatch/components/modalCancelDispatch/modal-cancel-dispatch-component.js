define([
  'angular', 'lodash', 'constants', 'moment'
], function(ng, _, constants, moment) {
  modalCancelDispatchController.$inject = ['$scope', 'proxyMotiveCancel', 'orderItemService', '$timeout', 'mpSpin', '$http', '$q', 'mModalAlert', '$state'];
  function modalCancelDispatchController($scope, proxyMotiveCancel, orderItemService,  $timeout, mpSpin, $http, $q, mModalAlert, state) {
    var vm = this;

    vm.GetMotivesCancel = function() {
      proxyMotiveCancel.GetAll().then(function(response) {
        vm.motivesCancel = response;
      });
    };

    vm.GetMotivesCancel();

    vm.cancelOrder = function() {
      console.log("Orden cancelada")
    }



  }
  return ng.module('farmapfre.app')
    .controller('modalCancelDispatchController', modalCancelDispatchController)
    .component('mfpModalCancelDispatch', {
      templateUrl: '/farmapfre/app/order/dispatch/components/modalCancelDispatch/modal-cancel-dispatch-component.html',
      controller: 'modalCancelDispatchController',
      bindings: {
        close: '&'
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
