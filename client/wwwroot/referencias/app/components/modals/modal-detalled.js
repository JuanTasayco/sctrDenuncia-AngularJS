(function ($root, name, deps, action) {
    $root.define(name, deps, action)
})(window, 'modalDetalled', ['angular'], function (angular) {
    angular.module('referencias.app').
        controller('modalDetalledController', ['$scope', 'mpSpin', 'proxyProveedor', '$q', function ($scope, mpSpin, proxyProveedor, $q) {

            var vm = this;
            vm.$onInit = onInit;

            function onInit() {
                vm.showPaciente = true;
                vm.data = {
                    paciente: {},
                    proveedor: {},
                    cobertura: []
                };
                vm.cerrar = cerrar;
                vm.tieneCobertura = tieneCobertura;
                loadDataProveedor();
            }

            $scope.getStyle = function (convenio) {
                if (convenio === "SIN CONVENIO")
                    return { 'color': 'red', 'font-weight': 'bold' };
                if (convenio === "CON CONVENIO")
                    return { 'color': '#00B09F', 'font-weight': 'bold' };
            }

            function cerrar() {
                vm.close();
            }

            function loadDataProveedor() {
                var deferred = $q.defer();

                mpSpin.start();
                proxyProveedor.VerDetalle(vm.params)
                    .then(function (response) {
                        mpSpin.end();
                        if (response.codErr == 0) {
                            deferred.resolve(response);
                            vm.data.proveedor = response.proveedor;
                            vm.data.cobertura = response.cobertura;
                            vm.data.paciente = vm.paciente;
                        }
                    });
            }

            function tieneCobertura() {
                return vm.data.cobertura != null && vm.data.cobertura.length > 0 && vm.data.cobertura[0].value != "";
            }

        }])
        .component('modalDetalled', {
            templateUrl: '/referencias/app/components/modals/modal-detalled.html',
            controller: 'modalDetalledController',
            bindings: {
                params: '=?',
                paciente: '=?',
                close: "&?"
            }
        })
});