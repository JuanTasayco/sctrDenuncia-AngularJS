define([
    'angular', 'lodash'
], function(ng, _) {
    modalTransferOrderController.$inject = ['$scope', '$state', 'proxyOrder', 'mModalAlert'];
    function modalTransferOrderController($scope, $state, proxyOrder, mModalAlert) {
        var vm = this;
        vm.frm = vm.frm || {};

        vm.transferOrder = function() {
            proxyOrder.TransferOrder(vm.data.id, vm.frm, true).then(function(res) {
                mModalAlert.showSuccess('La atención ' + vm.data.id + ' se transfirió satisfactoriamente.', 'Transferir Atención')
                    .then(function() {
                    $state.go('order.searchRequest');
                    });
            }, function(err) {
                mModalAlert.showError("Ha sucedido un error al momento de procesar su solicitud.", 'Error');
            });
        }
    }
    return ng.module('farmapfre.app')
        .controller('modalTransferOrderController', modalTransferOrderController)
        .component('mpfModalTransferOrder', {
            templateUrl: '/farmapfre/app/order/clientrequest/orderRequestItem/components/modalTransferOrder/modal-transfer-order-component.html',
            controller: 'modalTransferOrderController',
            bindings: {
                close: '&',
                data:"=?",
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