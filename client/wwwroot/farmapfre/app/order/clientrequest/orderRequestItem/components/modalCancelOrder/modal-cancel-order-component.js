define([
  'angular', 'lodash', 'constants', 'moment'
], function(ng, _, constants, moment) {
  modalCancelOrderController.$inject = ['$scope', 'proxyMotiveCancel', 'proxyOrder', '$timeout', 'mpSpin', '$http', '$q', 'mModalAlert', '$state'];
  function modalCancelOrderController($scope, proxyMotiveCancel, proxyOrder, $timeout, mpSpin, $http, $q, mModalAlert, state) {
    var vm = this;
    vm.idForm = vm.type;

    vm.GetMotivesCancel = function() {
      proxyMotiveCancel.GetAll(vm.idForm).then(function(response) {
        vm.motivesCancel = response;
      });
      $scope.itemId = vm.data.orderId;
    };

    vm.GetMotivesCancel();

    vm.cancelOrder = function() {
      if(vm.idForm === 1) {
        vm.request = {};
        vm.request.id = vm.data.orderId;
        vm.request.codMotive = vm.frm.motivesCancel.id;
        vm.request.comentary = vm.frm.comentaryCancel;

        proxyOrder.CancelOrder(vm.request, true)
          .then(function(res) {
            if(res.isOk) {
              mModalAlert.showSuccess('La atención ' + vm.request.id + ' se anuló satisfactoriamente.', 'Anular Atención')
                .then(function() {
                  state.go('order.searchRequest');
                });
            } else {
              mModalAlert.showWarning(res.message, 'Anular Atención')
            }
          }, function(err) {
            vm.showMsgError();
          });
      } else {
        vm.request = {};
        vm.request.dispatchId = vm.data.dispatchId;
        vm.request.id = vm.data.orderId;
        vm.request.codMotive = vm.frm.motivesCancel.id;
        vm.request.comentary = vm.frm.comentaryCancel;

        proxyOrder.CancelDispatch(vm.request, true)
          .then(function(r) {
            mModalAlert.showSuccess("Se anuló el despacho satisfactoriamente", "Anulado").then(function() {
              state.go('order.searchdispatch');
            })
          }, defaultHandlerError)
      }

      vm.close();
    };

    function defaultHandlerError(r){
      mModalAlert.showError("Ha sucedido un error al momento de procesar su solicitud.", "Anulado").then(function() {

      });
    }
  }
  return ng.module('farmapfre.app')
    .controller('modalCancelOrderController', modalCancelOrderController)
    .component('mfpModalCancelOrder', {
      templateUrl: '/farmapfre/app/order/clientrequest/orderRequestItem/components/modalCancelOrder/modal-cancel-order-component.html',
      controller: 'modalCancelOrderController',
      bindings: {
        close: '&',
        data:"=?",
        type:"=?"
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