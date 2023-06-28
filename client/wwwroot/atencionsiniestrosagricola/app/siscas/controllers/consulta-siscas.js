define([
    'angular', 'constants', '/atencionsiniestrosagricola/app/utilities/agricolaUtilities.js'
], function (ng, constants) {
    consultaSiscasController.$inject = ['$scope', '$rootScope', '$state', '$http', '$q', 'oimClaims', 'agricolaUtilities', 'proxyAgricolaSecurity', 'proxyAviso', 'proxyCampania', 'proxyLookup', 'oimProxyAtencionsiniestrosagricola', 'authorizedResource', 'mpSpin', 'mModalAlert'];
    function consultaSiscasController($scope, $rootScope, $state, $http, $q, oimClaims, agricolaUtilities, proxyAgricolaSecurity, proxyAviso, proxyCampania, proxyLookup, oimURL, authorizedResource, mpSpin, mModalAlert) {
  
        var vm = this;
        var thisDay = new Date();
        var userCampania =  "";

        vm.pagination = {
            maxSize: 5,
            sizePerPage: 1,
            currentPage: 1,
            totalRecords: 0
        }
        vm.paramsSearch = {
            CodAviso: "",
            campania: "",
            FecIni: "",
            FecFin: "",
            Estado: "01",
            Orden: "DESC",
            Pagina: 1,
            TipoConsulta: "LISTA"
        };
      
        vm.$onInit = function () {
            $scope.rbEstado = "01";
            mpSpin.start('Cargando, por favor espere...');
            var groupApplication = parseInt(oimClaims.userSubType);
            var listPromises = [];
            vm.pageChanged = pageChanged;
            $scope.dateMax = thisDay;
            $scope.format = 'dd/MM/yyyy';
            groupApplication = 1; //default
                proxyAgricolaSecurity.GetRole().then(function (response) {
                        vm.rolId = response.codRol;    
                        listPromises.push(loadCampanias());
                        if ( vm.rolId !="ADMINISTRADOR") {
                          userCampania = vm.$resolve.oimClaims.loginUserName;
                        }
                        $q.all(listPromises).then(function (result) {
                            var indexCampanias = result.map(function (o) { return o.id; }).indexOf('Campanias');
                            if (result[indexCampanias].result === 'Success') {
                                var listPromises2 = [];
                                listPromises2.push(loadCampaniaActiva());
                                $q.all(listPromises2).then(function (result) {
                                    var indexCampActiva = result.map(function (o) { return o.id; }).indexOf('CampaniaActiva');
                                    if (result[indexCampActiva].result === 'Success') {
                                        showResultado();
                                    } else {
                                        mModalAlert.showWarning("Error al cargar la campaña activa para el usuario", "");
                                    }
                                });
                                mpSpin.end();
                            } else {
                                mpSpin.end();
                                mModalAlert.showWarning("Error al cargar las campaña", "");
                            }
                        });
                                   
                    
                }, function (response) {
                    mpSpin.end();
                    mModalAlert.showError("No puede acceder al Bandeja de Avisos Siniestro", "Error").then(function (response) {
                        $state.go('home', undefined, { reload: true, inherit: false });
                    }, function (error) {
                        window.location.href = '/';
                    });
                });
        };

        function loadCampanias() {
            var deferred = $q.defer();
            var paramCampania = { "cmstro": "106" };

            proxyLookup.GetFiltros(paramCampania, true).then(function (response) {
                if (response.operationCode === 200) {
                    $scope.dsCampania = response.data;
                    if (response.data !== undefined) {
                        deferred.resolve({ id: 'Campanias', result: 'Success' });
                    } else {
                        deferred.resolve({ id: 'Campanias', result: 'Error' });
                    }
                } else {
                    deferred.resolve({ id: 'Campanias', result: 'Error' });
                }
            }, function (response) {
                deferred.resolve({ id: 'Campanias', result: 'Error' });
            });

            return deferred.promise;
        }

        function loadCampaniaActiva() {
            var deferred = $q.defer();
            var paramGetActiva = { "codCamp": "", "usro": userCampania};           

            proxyCampania.GetCampaniaActiva(paramGetActiva).then(function (response) {
                if (response.operationCode === 200) {
                    if (typeof (response.data) === "undefined") {
                        mModalAlert.showWarning("La campaña activa no está configurada correctamente", "");
                    } else {
                        if (response.data.codigo !== undefined) {
                            deferred.resolve({ id: 'CampaniaActiva', result: 'Success' });
                            vm.paramsSearch.campania = response.data.codigo;
                            $scope.mCampania = { codigo: response.data.codigo };
                        } else {
                            deferred.resolve({ id: 'CampaniaActiva', result: 'Error' });
                        }
                    }
                } else {
                    deferred.resolve({ id: 'CampaniaActiva', result: 'Error' });
                }
            }, function (response) {
                deferred.resolve({ id: 'CampaniaActiva', result: 'Error' });
            });

            return deferred.promise;
        }
   

        $scope.searchResults = function () {            
            vm.pagination.currentPage = 1;
            if ((($scope.mFechaIni !== undefined && $scope.mFechaFin !== undefined) && ($scope.mFechaIni <= $scope.mFechaFin)) ||
                ($scope.mFechaIni === undefined && $scope.mFechaFin === undefined)) {
                vm.paramsSearch = {
                    CodAviso: $scope.mCodigoAviso === undefined ? '' : $scope.mCodigoAviso,
                    campania: $scope.mCampania === undefined || $scope.mCampania.codigo === null ? '' : $scope.mCampania.codigo,
                    FecIni: $scope.mFechaIni === undefined ? '' : agricolaUtilities.formatearFecha($scope.mFechaIni),
                    FecFin: $scope.mFechaFin === undefined ? '' : agricolaUtilities.formatearFecha($scope.mFechaFin),
                    Estado: $scope.rbEstado === undefined ? '01' : $scope.rbEstado,
                    Orden: "DESC",
                    Pagina: 1,
                    TipoConsulta: "LISTA"
                };
                showResultado();
            } else {
                mModalAlert.showWarning("Verifique las fechas seleccionadas", "");
            }
        }


        $scope.clearFilters = function () {
            $scope.mCodigoAviso = undefined;
            $scope.dsCampania = [];
            $scope.mFechaIni = undefined;
            $scope.mFechaFin = undefined;
            vm.paramsSearch = {
                CodAviso: "",
                campania: "",
                FecIni: "",
                FecFin: "",
                Estado: "01",
                Orden: "DESC",
                Pagina: 1,
                TipoConsulta: "LISTA"
            };
            vm.$onInit();
        }
        $scope.descargarExcel = function(){
            mpSpin.start('Cargando, por favor espere...');
            var url = oimURL.endpoint + 'api/avisos/origen?campania='+vm.paramsSearch.campania+'&codigoAviso='+vm.paramsSearch.CodAviso+
            '&fechaDesde='+vm.paramsSearch.FecIni+'&fechaHasta='+vm.paramsSearch.FecFin+'&estado='+vm.paramsSearch.Estado
            +'&numeroPagina=0'+'&order='+vm.paramsSearch.Orden+'&order='+vm.paramsSearch.Orden+'&tipoConsulta=EXCEL';
            $http.get(
                url,
                { responseType: "arraybuffer" })
                .success(
                    function (data, status, headers) {
                        var type = headers('Content-Type');
                        var defaultFileName = "SISCAS_" + vm.paramsSearch.campania + "_" + vm.paramsSearch.CodAviso + ".xlsx";

                        defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');

                        var blob = new Blob([data], { type: type });
                        var link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = defaultFileName;
                        link.click();

                        mpSpin.end();
                    }, function (data, status) {
                        mpSpin.end();
                    })
                .error(function (data, status, headers) {
                    mModalAlert.showWarning("Ocurrió un error al descargar el archivo, inténtelo nuevamente", "");
                });
        }

        function showResultado() {   
            mpSpin.start();
            var params = vm.paramsSearch;
            proxyAviso.GetSiscas(params.campania,params.CodAviso,params.FecIni,params.FecFin,params.Estado,params.Pagina,params.Orden,params.TipoConsulta).then(function (response) {
                if (response.operationCode == 200) {
                    var listPromises = [];
                    var cantEstado = response.data.cantEstado.split(',');
                    $scope.cantExitoso = cantEstado[0];
                    $scope.cantErrado = cantEstado[1];
                    listPromises.push(cargarDataResultado(response));
                    $q.all(listPromises).then(function (result) {
                        mpSpin.end();
                    });
                } else {
                    mpSpin.end();
                    mModalAlert.showError("Ocurrió un error al cargar la información", "Error");
                }
            }, function (response) {
                mpSpin.end();
                mModalAlert.showError("Ocurrió un error al cargar la información", "Error");
            });
        }

        function cargarDataResultado(response) {
        // $scope.menuConsulta = response.data.cantEstado;            
            $scope.resultadoConsulta = response.data.listSiscas;            
            vm.pagination.totalRecords = response.data.cantPagi;
        }

        function pageChanged(nropage) {
            vm.paramsSearch.Pagina = nropage;
            showResultado();
        }

        $scope.searchState = function (codeState) {
            vm.paramsSearch.CodEstado = codeState;
            vm.paramsSearch.Pagina = 1;
            vm.pagination.currentPage = 1;
            showResultado();
        }
    }
    return ng.module('atencionsiniestrosagricola.app')
        .controller('consultaSiscasController', consultaSiscasController)
        .directive('preventDefault', function () {
            return function (scope, element, attrs) {
                ng.element(element).bind('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
            }
        });
});