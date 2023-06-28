(function ($root, name, deps, action) {
    $root.define(name, deps, action)
})(window, 'modalRevisar', ['angular'], function (angular) {
    angular.module('referencias.app').
        controller('modalRevisarController', ['$scope', '$rootScope', '$q', '$filter', 'proxyFiltro', 'mModalAlert', 'mpSpin', function ($scope, $rootScope, $q, $filter, proxyFiltro, mModalAlert, mpSpin) {
            var vm = this;
            vm.$onInit = onInit;

            function onInit() {
                vm.referenceRevisar = referenceRevisar;
                vm.searchMedico = searchMedico;
                vm.searchDiagnostico = searchDiagnostico;
                vm.validarMotivo = validarMotivo;
                vm.selectMedico = selectMedico;
                vm.cerrar = cerrar;
                vm.filters = {};
                vm.masters = {};
                vm.noEntidadDestRegist = false;
                vm.filters.CDiagnosticoIngreso = {
                    value: vm.data.cDiagnosticoIng,
                    text: vm.data.diagnosticoIng
                }

                loadFilters();
            }

            function loadFilters() {
                var deferred = $q.defer();

                mpSpin.start();

                proxyFiltro.ListarFiltros({ cFiltro: "6", modificador: "" })
                    .then(function (response) {
                        if (response.codErr == 0) {
                            deferred.resolve(response.listaFiltros);
                            vm.masters.Condiciones = response.listaFiltros;
                        }
                    });
                proxyFiltro.ListarFiltros({ cFiltro: "24", modificador: "" })
                    .then(function (response) {
                        if (response.codErr == 0) {
                            deferred.resolve(response.listaFiltros);
                            vm.masters.Motivos = response.listaFiltros;
                        }
                    });

                proxyFiltro.ListarFiltros({ cFiltro: "16", modificador: "" })
                    .then(function (response) {
                        if (response.codErr == 0) {
                            deferred.resolve(response.listaFiltros);
                            vm.masters.Especialidades = response.listaFiltros;
                        }

                    });

                mpSpin.end();
            }


            function validarMotivo() {
                var cMotivoNoRegistro = vm.filters.cMotivoNoRegistro == null || vm.filters.cMotivoNoRegistro.value == '';

                return cMotivoNoRegistro;
            }

            function referenceRevisar() {

                if (vm.noEntidadDestRegist && validarMotivo()) {
                    return;
                }

                var CReferencia = vm.data.idReferencia != null ? vm.data.idReferencia : null;
                var idReferenciaEncrypt = vm.data.idReferenciaEncrypt ? vm.data.idReferenciaEncrypt : null;
                var FechaIngreso = $scope.$parent.$parent.resumeList.fechaHora != null ? $filter('date')($scope.$parent.$parent.resumeList.fechaHora, 'yyyyMMdd') : '';
                var FechaSalida = vm.filters.FechaSalida != null ? $filter('date')(vm.filters.FechaSalida, 'yyyyMMdd') : '';
                var CCondicionSalida = vm.filters.CondPaciente != null ? vm.filters.CondPaciente.value : '';
                var CDiagnosticoIngreso = vm.filters.CDiagnosticoIngreso != null ? vm.filters.CDiagnosticoIngreso.value : '';
                var CDiagnosticoSalida = vm.filters.CDiagnosticoSalida != null ? vm.filters.CDiagnosticoSalida.value : '';
                var ProceRealizados = vm.filters.Procedure ? vm.filters.Procedure : '';
                var Medico = vm.filters.x_Medic ? vm.filters.x_Medic : null;
                var NoRegistro = vm.noEntidadDestRegist;
                var cMotivoNoRegistro = vm.filters.cMotivoNoRegistro != null ? vm.filters.cMotivoNoRegistro.value : '';
                var observacion = vm.filters.observacion;

                if (Medico != null && vm.filters.Especialidad != null) {
                    Medico.Especialidad = vm.filters.Especialidad.text;
                    Medico.CEspecialidad = vm.filters.Especialidad.value;
                }

                var params = {
                    CReferencia: CReferencia, idReferenciaEncrypt: idReferenciaEncrypt ,FechaIngreso: FechaIngreso, FechaSalida: FechaSalida,
                    CCondicionSalida: CCondicionSalida, CDiagnosticoIngreso: CDiagnosticoIngreso,
                    CDiagnosticoSalida: CDiagnosticoSalida, ProceRealizados: ProceRealizados,
                    Medico: Medico,NoRegistro: NoRegistro,
                    cMotivoNoRegistro: cMotivoNoRegistro, observacion: observacion
                }

                if (NoRegistro) {
                    params.FechaIngreso = '';
                    params.FechaSalida = '';
                    params.CCondicionSalida = '';
                    params.CDiagnosticoSalida = '';
                    params.ProceRealizados = '';
                    params.Medico = null;

                } else {
                    params.cMotivoNoRegistro = '';
                    params.observacion = '';
                }

                vm.save({ $params: params })

            };

            function searchMedico(search) {
                if (search && search.length >= 2) {
                    var deferred = $q.defer();
                    proxyFiltro.FiltroMedico({ modificador: search })
                        .then(function (response) {
                            if (response.codErr == 0) deferred.resolve(response.Medicos);
                        });
                    return deferred.promise;
                }
            }

            function searchDiagnostico(search) {
                if (search && search.length >= 2) {
                    var deferred = $q.defer();
                    proxyFiltro.ListarFiltros({ cFiltro: "7", modificador: search })
                        .then(function (response) {
                            if (response.codErr == 0) deferred.resolve(response.listaFiltros);
                        });
                    return deferred.promise;
                }
            }

            function selectMedico(item) {
                if (item != null) {
                    if (item.CEspecialidad != null && item.Especialidad != null) {
                        vm.filters.Especialidad = {
                            value: item.CEspecialidad,
                            text: item.Especialidad
                        }
                    }
                } else {
                    vm.filters.Especialidad = null;
                }
            }

            function cerrar() {
                vm.close();
            }

        }])
        .component('modalRevisar', {
            templateUrl: '/referencias/app/components/modals/modal-revisar.html',
            controller: 'modalRevisarController',
            bindings: {
                data: '=?',
                close: '&?',
                save: '&?'
            }
        })
});