(function($root, name, deps, action) {
    $root.define(name, deps, action)
})(window, "userConfigItemMaintenanceComponent", ['angular'], function(ng) {
    ng.module('farmapfre.app').
    controller('userConfigItemMaintenanceComponentController',
    ['$scope', 'proxyUser', 'proxyBODispatch', 'mModalAlert', 'mModalConfirm', '$state', '$timeout',
    function($scope, proxyUser, proxyBODispatch, mModalAlert, mModalConfirm, state, $timeout) {
        var vm = this;
        vm.frm = {};
      
        vm.cancel = function() {
            vm.frm = {};
            vm.type = 1;
        }

        init = function() {
            if(vm.user.boDispatch && vm.user.status) {
                vm.crudType = 2;
                vm.frm.boDispatch = helper.clone(vm.user.boDispatch) ;
                vm.frm.status = helper.clone(vm.user.status);
            } else {
                vm.crudType = 1;
                vm.frm.status = { description: "DESHABILITADO" };
            }
        }

        init();
        
        vm.save = function() {
            if(vm.crudType === 1) {
                add();
            } else {
                update();
            }
        };

        add = function() {
            var request = { 
                code: vm.user.code, 
                boDispatch: { id: vm.frm.boDispatch.id }, 
                status: { enabled: vm.frm.status.enabled } 
            };

            proxyUser.SaveUserConfig(vm.user.code, request, true)
            .then(function(res) {
                mModalAlert.showSuccess('Se guardó satisfactoriamente.', 'Asignar Relación').then(function() { 
                    vm.type = 1;
                    vm.user.boDispatch = vm.frm.boDispatch;
                    vm.user.status = vm.frm.status;
                });
            }, 
            function(err) {
                showMsgError();
            });
        }

        update = function() {
            var request = { 
                boDispatch: { id: vm.frm.boDispatch.id }, 
                status: { enabled: vm.frm.status.enabled } 
            };

            proxyUser.UpdateUserConfig(vm.user.code, request, true)
            .then(function(res) {
                mModalAlert.showSuccess('Se actualizó satisfactoriamente.', 'Asignar Relación').then(function() { 
                    vm.type = 1;
                    vm.user.boDispatch = vm.frm.boDispatch;
                    vm.user.status = vm.frm.status;
                });
            }, 
            function(err) {
                showMsgError();
            });
        }


        vm.changeChecked = function() {
            vm.frm.status.description = vm.frm.status.enabled ? 'HABILITADO' : 'DESHABILITADO';
        }

        showMsgError = function() {
            mModalAlert.showError('Ocurrió un error, comuníquece con el administrador.', 'Error');
        };
    }]).
    component("userConfigItemMaintenance", {
        templateUrl: "/farmapfre/app/maintenance/userConfig/components/userconfig-item-maintenance-component.html",
        controller: "userConfigItemMaintenanceComponentController",
        bindings: {
            onRefresh: '&',
            type:"=?",
            user:"=",
            bodispatchs:"<"
        }
    })
});