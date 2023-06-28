(function($root, name, deps, action) {
    $root.define(name, deps, action)
})(window, "bodispatchItemMaintenanceComponent", ['angular', 'farmConstants'], function(ng, farmConstants) {
    ng.module('farmapfre.app').
    controller('bodispatchItemMaintenanceComponentController',
    ['$scope', 'proxyBODispatch', 'proxyProvider', 'proxyWarehouse', 'mModalAlert', 'mModalConfirm', '$state', '$timeout',
    function($scope, proxyBODispatch, proxyProvider, proxyWarehouse, mModalAlert, mModalConfirm, state, $timeout) {
        var vm = this;
        vm.frm = {};

        function init() {
            if(vm.type === 2) {
                vm.action = "GUARDAR";
                vm.title = "Editar Back-Office Despacho";
                vm.frm.name = vm.bodispatch.description;
            } else {
                vm.action = "REGISTRAR";
                vm.title = "Nuevo Back-Office Despacho";
            }
        }

        init();
        
        vm.GetBranchOffices = function() {
            proxyProvider.GetBranchOffices(farmConstants.provider.mapfreId).then(function(response) {
                vm.branchOffices = response;
                if(vm.type === 2) {
                    vm.frm.branchOffice = vm.bodispatch.branchOffice;
                    vm.changeBranchOffice(vm.bodispatch.branchOffice.id, true);
                }
            });
        }

        vm.GetBranchOffices();

        vm.changeBranchOffice = function(branchOfficeId, first) {
            proxyWarehouse.Get(branchOfficeId).then(function(response) {
                vm.frm.warehouse = undefined;
                vm.warehouses = response;

                var sel = vm.warehouses.filter(function(x) { return x.id=="00001"}).pop();

                if(vm.type === 2) {
                    if(first)
                        vm.frm.warehouse = vm.bodispatch.warehouse;
                    else
                        vm.frm.warehouse = sel;
                } else {
                    vm.frm.warehouse = sel;
                }
            });
        }

        vm.cancel = function() {
            vm.frm = {};
            vm.type = 1;
            state.go("searchBoDispatch");
        }
        
        vm.save = function() {
            if(vm.type === 2) {
                Update();
            } else {
                Add();
            }
        };

        function Add() {
            var request = { name: vm.frm.name, branchOfficeCode: vm.frm.branchOffice.id, warehouseCode: vm.frm.warehouse.id };

            proxyBODispatch.Add(request, true)
            .then(function(res) {
                if(res.isOk) {
                    mModalAlert.showSuccess('Se guardó satisfactoriamente.', 'Crear Bo Despacho').then(function() { vm.cancel(); });
                } else {
                    mModalAlert.showWarning(res.message, 'Crear Bo Despacho')
                }
            }, 
            function(err) {
                showMsgError();
            });
        }

        function Update() {
            var request = { id: vm.bodispatch.id, name: vm.frm.name, branchOfficeCode: vm.frm.branchOffice.id, warehouseCode: vm.frm.warehouse.id };

            proxyBODispatch.Update(request, true)
            .then(function(res) {
                if(res.isOk) {
                    mModalAlert.showSuccess('Se Actualizó satisfactoriamente.', 'Actualizar Bo Despacho').then(function() { 
                        vm.onRefresh();
                    });
                } else {
                    mModalAlert.showWarning(res.message, 'Actualizar Bo Despacho')
                }
            }, 
            function(err) {
                showMsgError();
            });
        }

        vm.delete = function(bodispatch) {
            mModalConfirm.confirmQuestion('¿Está seguro de eliminar el bo despacho?', 'Eliminar Bo Despacho', 'Si')
            .then(function(ok) {
                if(ok) {
                    proxyBODispatch.Delete(bodispatch.id, true)
                    .then(function(res) {
                        if(res.isOk) {
                            mModalAlert.showSuccess('El ' + bodispatch.description + ' se eliminó satisfactoriamente.', 'Eliminar Bo Despacho').then(function() { 
                                vm.onRefresh();
                             });
                        } else {
                            mModalAlert.showWarning(res.message, 'Eliminar Bo Despacho')
                        }
                    }, function(err) {
                        showMsgError();
                    });
                }
            });
        }

        showMsgError = function() {
            mModalAlert.showError('Ocurrió un error, comuníquece con el administrador.', 'Error');
        };
    }]).
    component("bodispatchItemMaintenance", {
        templateUrl: "/farmapfre/app/maintenance/boDispatch/components/bodispatch-item-maintenance-component.html",
        controller: "bodispatchItemMaintenanceComponentController",
        bindings: {
            onRefresh: '&',
            type:"=?",
            bodispatch:"=?"
        }
    })
});