(function ($root, name, deps, action) {
    $root.define(name, deps, action)
})(window, 'modalDetallep', ['angular'], function (angular) {
    angular.module('referencias.app').
        controller('modalDetallepController', ['proxyAsegurado', '$q', function (proxyAsegurado, $q) {

            var vm = this;
            vm.$onInit = onInit;


            function resListPaciente() {
                var deferred = $q.defer();

                var CTiProd = vm.filters.ac_Producto.value != null ? vm.filters.ac_Producto.value : null;
                var NumDoc = vm.filters.NumDoc != null ? vm.filters.NumDoc : null;
                var Nombre = vm.filters.Nombre != null ? vm.filters.Nombre : null;
                var Apellido = vm.filters.Apellido != null ? vm.filters.Apellido : null;

                mpSpin.start();
                proxyAsegurado.ListarAsegurados({
                    CTiProd: CTiProd, NumDoc: NumDoc, Nombre: Nombre, Apellido: Apellido
                })
                    .then(function (response) {
                        mpSpin.end();
                        if (response.CodErr == 0) {

                            deferred.resolve(response.ListaAsegurados);

                            vm.pacientList = response.ListaAsegurados;
                            vm.showResults = true;
                        }
                    });

                return deferred.promise;
            };

            function onInit() {
                vm.resListPaciente = resListPaciente
                vm.pacientSelect = [];
                vm.cerrar = cerrar;
                vm.obtenerProductoContrato = obtenerProductoContrato;
                vm.obtenerSubProductoSubContrato = obtenerSubProductoSubContrato;
                vm.ramo = vm.data.numContrato.length > 3 ? vm.data.numContrato.substring(0, 3) : "";
            }

            function cerrar() {
                vm.close();
            }

            function obtenerProductoContrato() {
                if(vm.ramo == '116') {
                  return vm.data.datosExtra.hasOwnProperty("contrato") ? vm.data.datosExtra["contrato"] : "";
                } else if (vm.ramo == '114' || vm.ramo == '115') {
                  return vm.data.datosExtra.hasOwnProperty("producto Salud") ? vm.data.datosExtra["producto Salud"] : "";
                } else {
                  return "";
                }
              }
      
              function obtenerSubProductoSubContrato() {
                if(vm.ramo == '116') {
                  return vm.data.datosExtra.hasOwnProperty("sub-Contrato") ? vm.data.datosExtra["sub-Contrato"] : "";
                } else if (vm.ramo == '114' || vm.ramo == '115') {
                  return vm.data.datosExtra.hasOwnProperty("sub-Producto Salud") ? vm.data.datosExtra["sub-Producto Salud"] : "";
                } else {
                  return "";
                }
              }

        }])
        .component('modalDetallep', {
            templateUrl: '/referencias/app/components/modals/modal-detallep.html',
            controller: 'modalDetallepController',
            bindings: {
                title: '=?',
                data: '=?',
                table: '=?',
                reloadMasters: '&?',
                close: "&?"
            }
        })
});