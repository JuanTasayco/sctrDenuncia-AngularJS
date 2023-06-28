(function ($root, name, deps, action) {
    $root.define(name, deps, action)
})(window, 'modalRequerimientos', ['angular', 'typeahead', 'bloodhound'], function (angular, typeahead, Bloodhound) {
    angular.module('referencias.app').
        controller('modalRequerimientosController', ['$scope', '$state', '$filter', '$q', function ($scope, $state, $filter, $q) {
            var vm = this;
            vm.$onInit = onInit;

            $scope.$ctrl.getData = function () {
                var list = [];

                angular.forEach($scope.$parent.$parent.$parent.$parent.masters.rServicios, function (v) {
                    if (v.checkTest) {
                        list.push({
                            grupoRequerimiento: '13',
                            idRequerimiento: v.value,
                            nombreRequerimiento: v.text
                        });
                    }
                })

                angular.forEach($scope.$parent.$parent.$parent.$parent.masters.rImagen, function (v) {
                    if (v.checkTest) {
                        list.push({
                            grupoRequerimiento: '14',
                            idRequerimiento: v.value,
                            nombreRequerimiento: v.text

                        });
                    }
                })

                angular.forEach($scope.$parent.$parent.$parent.$parent.masters.rEmergencia, function (v) {
                    if (v.checkTest) {
                        list.push({
                            grupoRequerimiento: '15',
                            idRequerimiento: v.value,
                            nombreRequerimiento: v.text
                        });
                    }
                })

                angular.forEach($scope.Especialidad, function (v) {
                    list.push({
                        grupoRequerimiento: '16',
                        idRequerimiento: v.value,
                        nombreRequerimiento: v.text
                    });
                })

                return list;
            }

            function checkServicios() {
                var deferred = $q.defer();

                vm.filters.ac_Servicios = null;
                var cFiltro = "13";
                var modificador = vm.filters.ac_Servicios != null ? vm.filters.ac_Servicios.value : null;
                deferred.resolve(vm.reloadMasters({ $search: 'servicios', $params: { cFiltro: cFiltro, modificador: modificador }, $showLoad: true }));
                return deferred.promise;
            }

            function checkImagenologia() {
                var deferred = $q.defer();

                vm.filters.ac_Imagenologia = null;
                var cFiltro = "14";
                var modificador = vm.filters.ac_Imagenologia != null ? vm.filters.ac_imagenologia.value : null;
                deferred.resolve(vm.reloadMasters({ $search: 'imagenologia', $params: { cFiltro: cFiltro, modificador: modificador }, $showLoad: true }));

                return deferred.promise;
            }

            function checkEmergencias() {
                var deferred = $defer();

                vm.filters.ac_Emergencia = null;
                var cFiltro = "15";
                var modificador = vm.filters.ac_Emergencia != null ? vm.filters.ac_Emergencia.value : null;
                deferred.resolve(vm.reloadMasters({ $search: 'emergencia', $params: { cFiltro: cFiltro, modificador: modificador }, $showLoad: true }));

                return deferred.promise;
            }

            $scope.changeDetect = function (especial) {
                $scope.Especialidad.push(Object.assign({}, especial));
            }

            function unEspeciality(index) {
                $scope.Especialidad.splice(index, 1);
            }

            function disabledSelect() {
                return $scope.Especialidad.length < 1
            }

            function onInit() {
                vm.checkServicios = checkServicios;
                vm.checkImagenologia = checkImagenologia;
                vm.checkEmergencias = checkEmergencias;
                vm.cerrar = cerrar;
                vm.filters = {};

                $scope.Especialidad = [];
                $scope.unEspeciality = unEspeciality;
                $scope.disabledSelect = disabledSelect;

                $scope.$parent.$parent.$parent.$parent.masters.rServicios.forEach(function (element) {
                    var old = $scope.$parent.$parent.$parent.$parent.data.listChecked.find(function (item) {
                        return item.idRequerimiento == element.value;
                    });
                    if(!old) element.checkTest = false;
                    else element.checkTest = true;
                });

                $scope.$parent.$parent.$parent.$parent.masters.rImagen.forEach(function (element) {
                    var old = $scope.$parent.$parent.$parent.$parent.data.listChecked.find(function (item) {
                        return item.idRequerimiento == element.value;
                    });
                    if(!old) element.checkTest = false;
                    else element.checkTest = true;
                });

                $scope.$parent.$parent.$parent.$parent.masters.rEmergencia.forEach(function (element) {
                    var old = $scope.$parent.$parent.$parent.$parent.data.listChecked.find(function (item) {
                        return item.idRequerimiento == element.value;
                    });
                    if(!old) element.checkTest = false;
                    else element.checkTest = true;
                });

                var elements = $scope.$parent.$parent.$parent.$parent.data.listChecked;

                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].grupoRequerimiento == [16])
                        $scope.Especialidad.push({
                            grupoRequerimiento: '16',
                            text: elements[i].nombreRequerimiento,
                            value: elements[i].idRequerimiento
                        })
                }
            }

            function cerrar() {
                vm.close();
            }
        }])
        .component('modalRequerimientos', {
            templateUrl: '/referencias/app/components/modals/modal-requerimientos.html',

            bindings: {
                title: '=?',
                data: '=?',
                table: '=?',
                reloadMasters: '&?',
                close: "&?"
            }
        })
});