(function($root, name, deps, action) {
    $root.define(name, deps, action)
})(window, "bodistrictItemMaintenanceComponent", ['angular'], function(ng) {
    ng.module('farmapfre.app').
    controller('bodistrictItemMaintenanceComponentController',
    ['$scope','proxyBODispatch', 'proxyBODistrict', 'proxyDistrict', 'mModalAlert', 'mModalConfirm', '$state', '$timeout',
    function($scope, proxyBODispatch, proxyBODistrict, proxyDistrict, mModalAlert, mModalConfirm, state, $timeout) {
        var vm = this;
        vm.frm = {};

        function init() {
            if(vm.type === 2) {
                vm.action = "GUARDAR";
                vm.title = "Editar Back-Office Distrito";
                vm.frm.name = vm.bodistrict;
            } else {
                vm.action = "REGISTRAR";
                vm.title = "Nuevo Back-Office Distrito";
            }
        }

        init();

//

      vm.arg = {};


      vm.search = function(filter) {
        vm.arg.filter = null;
        vm.arg.pageNumber = 1;
        vm.arg.pageLength= 10000000;

        proxyBODispatch.Search(vm.arg, true).then(function(response) {
          vm.bodispatchs = response.records;
            vm.frm.bodispatch = vm.bodistrict;
        });
      }

      vm.search();
      
//

        
        vm.GetDistricts = function() {
            proxyDistrict.GetAll().then(function(response) {
                vm.districts = response;
                if(vm.type === 2) {
                    vm.frm.district = vm.bodistrict.district;
                }
            });
        }

        vm.GetDistricts();

        vm.cancel = function() {
            vm.frm = {};
            vm.type = 1;
            state.go("boDistrict");
        }
        
        vm.save = function() {
            if(vm.type === 2) {
                Update();
            } else {
                Add();
            }
        };

        function Add() {

            var request = { dispatchCode: vm.frm.bodispatchs.id, districtCode: vm.frm.districts.id};

            proxyBODistrict.Add(request, true)
            .then(function(res) {
                if(res.isOk) {
                    mModalAlert.showSuccess('Se guardó satisfactoriamente.', 'Crear Bo Distrito').then(function() { vm.cancel(); });
                } else {
                    mModalAlert.showWarning(res.message, 'Crear Bo Distrito')
                }
            }, 
            function(err) {
                showMsgError();
            });
            
        }

        function Update() {
                
            var request = { dispatchCode: vm.frm.bodispatch.id, districtCode: vm.frm.district.id};

            proxyBODistrict.Update(request, true)
            .then(function(res) {
                if(res.isOk) {
                    mModalAlert.showSuccess('Se Actualizó satisfactoriamente.', 'Actualizar Bo Distrito').then(function() { 
                        vm.onRefresh();
                    });
                } else {
                    mModalAlert.showWarning(res.message, 'Actualizar Bo Distrito')
                }
            }, 
            function(err) {
                showMsgError();
            });
            
        }

        vm.delete = function(bodistrict) {
            mModalConfirm.confirmQuestion('¿Está seguro de eliminar el BO distrito '+vm.frm.district.description+'?', 'Eliminar Bo Distrito', 'Si')
            .then(function(ok) {
                if(ok) {

                    proxyBODistrict.Delete(vm.frm.district.id, true)
                    .then(function(res) {
                        if(res.isOk) {
                            mModalAlert.showSuccess('El BO distrito ' + vm.frm.district.description + ' se eliminó satisfactoriamente.', 'Eliminar Bo Distrito').then(function() { 
                                vm.onRefresh();
                             });
                        } else {
                            mModalAlert.showWarning(res.message, 'Eliminar Bo Distrito')
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
    component("bodistrictItemMaintenance", {
        templateUrl: "/farmapfre/app/maintenance/boDistrict/components/bodistrict-item-maintenance-component.html",
        controller: "bodistrictItemMaintenanceComponentController",
        bindings: {
            onRefresh: '&',
            type:"=?",
            bodistrict:"=?"
        }
    })
});