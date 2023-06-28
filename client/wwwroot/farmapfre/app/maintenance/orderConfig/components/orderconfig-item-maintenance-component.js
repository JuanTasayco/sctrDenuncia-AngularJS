(function($root, name, deps, action) {
    $root.define(name, deps, action)
})(window, "orderConfigItemMaintenanceComponent", ['angular', 'farmConstants'], function(ng, farmConstants) {
    ng.module('farmapfre.app').
    controller('orderConfigItemMaintenanceComponentController',
    ['$scope', 'proxyOrder', 'proxyWarehouse', 'mModalAlert', 'mModalConfirm', '$state', '$timeout',
    function($scope, proxyOrder, proxyWarehouse, mModalAlert, mModalConfirm, state, $timeout) {
        var vm = this;
        vm.frm = {};

        vm.cancel = function() {
            vm.frm = {};
            vm.type = 0;
        }

        vm.changeBranchOffice = function(branchOfficeId, first) {
            proxyWarehouse.Get(branchOfficeId).then(function(response) {
                vm.frm.warehouse = undefined;
                vm.warehouses = response;
    
                var sel = vm.warehouses.filter(function(x) { return x.id == "00001" }).pop();
    
                if(vm.type === 2) {
                    if(first)
                        vm.frm.warehouse = helper.clone(vm.order.warehouse);
                    else
                        vm.frm.warehouse = sel;
                } else {
                    vm.frm.warehouse = sel;
                }
            });
        }

        init = function() {
            if(vm.type === 2) {
                vm.frm.branchOffice = helper.clone(vm.order.branchOffice);
                vm.frm.attentionType = helper.clone(vm.order.attentionType);
                vm.frm.requiresAutSited = helper.clone(vm.order.requiresAutSited);
                vm.frm.orderCreationIndicator = helper.clone(vm.order.orderCreationIndicator);

                vm.changeBranchOffice(vm.frm.branchOffice.id, true);
            } else {
                vm.frm.requiresAutSited = false;
                vm.frm.orderCreationIndicator = false;
            }
        }

        init();
        
        vm.save = function() {
            if(vm.type === 1) {
                add();
            } else {
                update();
            }
        };

        add = function() {
            var request = { 
                branchOffice: { id: vm.frm.branchOffice.id }, 
                attentionType: { id: vm.frm.attentionType.id },
                warehouse: { id: vm.frm.warehouse.id },
                requiresAutSited: vm.frm.requiresAutSited,
                orderCreationIndicator: vm.frm.orderCreationIndicator
            };

            proxyOrder.SaveOrderConfig(request, true)
            .then(function(res) {
                mModalAlert.showSuccess('Se guardó satisfactoriamente.', 'Asignar Relación').then(function() { 
                    vm.type = 0;
                    vm.onRefresh();
                });
            }, 
            function(err) {
                showMsgError();
            });
        }

        update = function() {
            var request = { 
                branchOffice: { id: vm.frm.branchOffice.id }, 
                attentionType: { id: vm.frm.attentionType.id },
                warehouse: { id: vm.frm.warehouse.id },
                requiresAutSited: vm.frm.requiresAutSited,
                orderCreationIndicator: vm.frm.orderCreationIndicator
            };

            proxyOrder.UpdateOrderConfig(request, true)
            .then(function(res) {
                mModalAlert.showSuccess('Se actualizó satisfactoriamente.', 'Asignar Relación').then(function() { 
                    vm.type = 0;
                    vm.onRefresh();
                });
            }, 
            function(err) {
                showMsgError();
            });
        }

        showMsgError = function() {
            mModalAlert.showError('Ocurrió un error, comuníquece con el administrador.', 'Error');
        };
    }]).
    component("orderConfigItemMaintenance", {
        templateUrl: "/farmapfre/app/maintenance/orderConfig/components/orderconfig-item-maintenance-component.html",
        controller: "orderConfigItemMaintenanceComponentController",
        bindings: {
            onRefresh: '&',
            type:"=?",
            order:"=",
            branchs:"<",
            attentiontypes:"<"
        }
    })
});