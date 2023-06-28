(function ($root, name, deps, action) {
    $root.define(name, deps, action)
})(window, 'modalAnular', ['angular'], function (angular) {
    angular.module('referencias.app').
        controller('modalAnularController', ['$scope', 'proxyFiltro', 'mpSpin', '$q', function ($scope, proxyFiltro, mpSpin, $q) {
            var vm = this;
            vm.$onInit = onInit;

            function onInit() {
                vm.cerrar = cerrar;
                vm.refAnulacion = refAnulacion;
                vm.validarAnular = validarAnular;
                vm.filters = {};
                vm.masters = {};

                loadFilters();
            }

            function validarAnular() {

                var cMotivoAnulacion = vm.filters.cMotivoAnulacion != null ? vm.filters.cMotivoAnulacion.value : '';
                return cMotivoAnulacion;
            }



            function loadFilters() {
                var deferred = $q.defer();

                mpSpin.start();

                proxyFiltro.ListarFiltros({ cFiltro: "23", modificador: "" })
                    .then(function (response) {
                        if (response.codErr == 0) {
                            deferred.resolve(response.listaFiltros);
                            vm.masters.anulacion = response.listaFiltros;
                        }
                    });

                mpSpin.end();

                return deferred.promise;
            }

            function refAnulacion() {
                var CReferencia = vm.data.idReferencia != null ? vm.data.idReferencia : null;
                var CodUsuMAPFRE = vm.data.CurrentUserName;
                var cMotivoAnulacion = vm.filters.cMotivoAnulacion != null ? vm.filters.cMotivoAnulacion.value : '';
                var observacion = vm.observacion;

                var params = {
                    CReferencia: CReferencia, observacion: observacion, CodUsuMAPFRE: CodUsuMAPFRE,
                    cMotivoAnulacion: cMotivoAnulacion
                }

                vm.anular({ $params: params })
            }

            function cerrar() {
                vm.close();
            }

        }])
        .component('modalAnular', {
            templateUrl: '/referencias/app/components/modals/modal-anular.html',
            controller: 'modalAnularController',
            bindings: {
                data: '=?',
                close: '&?',
                anular: '&?'
            }
        })
});