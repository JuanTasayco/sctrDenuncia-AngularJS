define([
  'angular', 'lodash', 'farmConstants', 'moment'
], function(ng, _, constants, moment) {
  modalGenericController.$inject = ['$scope', 'proxyMotiveCancel', 'proxyAudit', 'proxyOrder', '$timeout', 'mpSpin', '$http', '$q', 'mModalAlert', '$state'];
  function modalGenericController($scope, proxyMotiveCancel, proxyAudit, proxyOrder, $timeout, mpSpin, $http, $q, mModalAlert, state) {
    var vm = this;
    vm.idForm = vm.type;
    $scope.itemId = vm.data.id;

    vm.getMotivesCancel = function(idMotive) {
      proxyMotiveCancel.GetAll(idMotive).then(function(response) {
        vm.listSelect = response;
      });
    };

    function initAuditOrder() {
      proxyAudit.GetAuditReasons(true).then(function(response) {
        vm.listSelect = response;
      }, function(err) {
          vm.showMsgError();
      });
    }

    function init() {
      switch(vm.type) {
        case constants.modalType.cancelOrder: { vm.getMotivesCancel(1); }; break;
        case constants.modalType.cancelDispatch: { vm.getMotivesCancel(2); }; break;
        case constants.modalType.auditOrder: { initAuditOrder(); }; break;
      }
    }

    init();

    vm.eventClick = function() {
      switch(vm.type) {
        case constants.modalType.cancelOrder: { cancelOrder(); }; break;
        case constants.modalType.cancelDispatch: { cancelOrderDispatch(); }; break;
        case constants.modalType.auditOrder: { auditOrder(); }; break;
      }

      vm.close();
    };

    function auditOrder() {
      var request = { 
        comments: vm.frm.comments,
        reason: { id: vm.frm.objectSelect.id }
      };

      proxyOrder.AuditOrder(vm.data.id, request, true)
        .then(function(response) {
          if(response) {
            mModalAlert.showSuccess('La atención ' + vm.data.id + ' se ha enviado a auditoría.', 'Auditoría Atención')
              .then(function() {
                state.go('order.searchRequest');
              });
          } else {
            mModalAlert.showWarning("Ha sucedido un error al momento de procesar su solicitud.", 'Auditoría Atención')
          }
        }, function(err) {
          defaultHandlerError();
        });
    }

    function cancelOrder() {
      vm.request = {};
      vm.request.id = vm.data.orderId;
      vm.request.codMotive = vm.frm.objectSelect.id;
      vm.request.comentary = vm.frm.comments;

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
    }

    function cancelOrderDispatch() {
      vm.request = {};
      vm.request.dispatchId = vm.data.dispatchId;
      vm.request.id = vm.data.orderId;
      vm.request.codMotive = vm.frm.objectSelect.id;
      vm.request.comentary = vm.frm.comments;

      proxyOrder.CancelDispatch(vm.request, true)
        .then(function(r) {
          mModalAlert.showSuccess("Se anuló el despacho satisfactoriamente", "Anulado").then(function() {
            state.go('order.searchdispatch');
          })
        }, defaultHandlerError)
    }

    function defaultHandlerError(r){
      mModalAlert.showError("Ha sucedido un error al momento de procesar su solicitud.", 'Auditoría Atención').then(function() { });
    }
  }
  return ng.module('farmapfre.app')
    .controller('modalGenericController', modalGenericController)
    .component('mpfModalGeneric', {
      templateUrl: '/farmapfre/app/components/modalGeneric/modal-generic-component.html',
      controller: 'modalGenericController',
      bindings: {
        close: '&',
        data:"=?",
        config:"=?",
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