define([
    'angular', 'constants', '/atencionsiniestrosagricola/app/utilities/agricolaUtilities.js'
], function (ng, constants) {
    bandejaReportesController.$inject = ['$scope', '$rootScope', '$state', '$http', '$q', 'oimClaims', 'agricolaUtilities', 'proxyAgricolaSecurity', 'proxyAviso', 'proxyCampania', 'proxyLookup', 'oimProxyAtencionsiniestrosagricola', 'authorizedResource', 'mpSpin', 'mModalAlert'];
    function bandejaReportesController($scope, $rootScope, $state, $http, $q, oimClaims, agricolaUtilities, proxyAgricolaSecurity, proxyAviso, proxyCampania, proxyLookup, oimURL, authorizedResource, mpSpin, mModalAlert) {
        var vm = this;
        var thisDay = new Date();
        var codigoOpcion = [];
        var userCampania =  "";
        var idRol = 0;

        vm.pagination = {
            maxSize: 5,
            sizePerPage: 1,
            currentPage: 1,
            totalRecords: 0
        }
        var resultadoGeneral = {};
        vm.paramsSearch = {
            CodAviso: "",
            CodCampania: "",
            FecIni: "",
            FecFin: "",
            CodCultivo: "",
            CodRegion: "",
            CodProvincia: "",
            CodDistrito: "",
            CodSectorEst: "",
            CodEstado: "1",
            Pagina: 1
        };

        vm.paramsSelectUbigeo = {
            CodRegion: "",
            CodProvincia: "",
            CodDistrito: "",
            CodSectorEst: ""
        }

        vm.$onInit = function () {
            $scope.chkPendientes = false;
            mpSpin.start('Cargando, por favor espere...');
            var groupApplication = parseInt(oimClaims.userSubType);
            var listPromises = [];
            $scope.isUbigeoChevron = true;
            vm.pageChanged = pageChanged;
            $scope.dateMax = thisDay;
            $scope.format = 'dd/MM/yyyy';
            groupApplication = 1; //default
                proxyAgricolaSecurity.GetRole().then(function (response) {
                        vm.rolId = response.codRol; 
                        listPromises.push(loadCampanias());
                        listPromises.push(loadRegion());                     
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
                                        loadCultivo();
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
                            vm.paramsSearch.CodCampania = response.data.codigo;
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

        $scope.changeCampania = function () {
            $scope.dsCultivo = [];
            $scope.dsRegion = [];
            $scope.dsProvincia = [];
            $scope.dsDistrito = [];
            $scope.dsSector = [];
            loadCultivo();
            loadRegion();
        }

        function loadCultivo() {
            if ($scope.mCampania !== undefined && $scope.mCampania.codigo !== null) {
                var paramCultivo = { "cmstro": "100", "prmtro1": $scope.mCampania.codigo };

                proxyLookup.GetFiltros(paramCultivo, true).then(function (response) {
                    if (response.operationCode === 200) {
                        $scope.dsCultivo = response.data;
                    }
                });
            }
        }

        function loadRegion() {
            var deferred = $q.defer();
            var paramRegion = { "cmstro": "105" };

            proxyLookup.GetFiltros(paramRegion, true).then(function (response) {
                if (response.operationCode === 200) {
                    $scope.dsRegion = response.data;
                    deferred.resolve({ id: 'Regiones', result: 'Success' });
                } else {
                    deferred.resolve({ id: 'Regiones', result: 'Error' });
                }
            }, function (response) {
                deferred.resolve({ id: 'Regiones', result: 'Error' });
            });

            return deferred.promise;
        }

        $scope.downloadActa = function (item) {
            mpSpin.start(); 
            var params = {
                CodAviso:item.codAviso,
                CodCampania: item.codCampania ,
                tipoArchivo: "ACTA DE AJUSTE",
            }

            var url = oimURL.endpoint + 'api/avisos/Archivo/Descargar';

            $http.post(
                url,
                params,
                { responseType: "arraybuffer" })
                .success(
                    function (data, status, headers) {
                        if(data.byteLength==0){
                            mModalAlert.showWarning("El archivo está vacío", "");
                            mpSpin.end();
                            return;
                        }
                        var type = headers('Content-Type');
                        var disposition = headers('Content-Disposition');
                        var defaultFileName = "";

                        if (disposition) {
                            var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
                            if (match[1]) defaultFileName = match[1];
                        }

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

        $scope.descargaExcel = function (codigoAviso) {
            mpSpin.start();var params = {
                CodAviso: ($scope.mCodigoAviso !== undefined ? $scope.mCodigoAviso : ""),
                CodCampania: $scope.mCampania === undefined || $scope.mCampania.codigo === null ? '' : $scope.mCampania.codigo,
                FecIni: $scope.mFechaIni === undefined ? '' : agricolaUtilities.formatearFecha($scope.mFechaIni),
                FecFin: $scope.mFechaFin === undefined ? '' : agricolaUtilities.formatearFecha($scope.mFechaFin),
                CodCultivo: $scope.mCultivo === undefined || $scope.mCultivo.codigo === null ? '' : $scope.mCultivo.codigo,
                CodRegion: $scope.mRegion === undefined || $scope.mRegion.codigo === null ? '' : $scope.mRegion.codigo,
                CodProvincia: $scope.mProvincia === undefined || $scope.mProvincia.codigo === null ? '' : $scope.mProvincia.codigo,
                CodDistrito: $scope.mDistrito === undefined || $scope.mDistrito.codigo === null ? '' : $scope.mDistrito.codigo,
                CodSectorEst: $scope.mSector === undefined || $scope.mSector.codigo === null ? '' : $scope.mSector.codigo,
                CodEstado:"",
                UserCampania:  idRol != 5 ? '' : userCampania
            }
            var url = oimURL.endpoint + 'api/avisos/ListaExcel';

            $http.post(
                url,
                params,
                { responseType: "arraybuffer" })
                .success(
                    function (data, status, headers) {
                        var type = headers('Content-Type');
                        var disposition = headers('Content-Disposition');
                        var defaultFileName = 'AvisosSiniestro.xlsx';

                        if (disposition) {
                            var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
                            if (match[1]) defaultFileName = match[1];
                        }

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
                    mpSpin.end();
                    mModalAlert.showWarning("Ocurrió un error al descargar el archivo, inténtelo nuevamente", "");
                });
        }
        $scope.changeRegion = function () {
            $scope.dsProvincia = [];
            $scope.dsDistrito = [];
            $scope.dsSector = [];
            loadProvincia();
        }

        function loadProvincia() {
            if ($scope.mRegion !== undefined) {
                var paramProvincia = {
                    "cmstro": "101",
                    "prmtro1": $scope.mRegion.codigo
                };

                proxyLookup.GetFiltros(paramProvincia, true).then(function (response) {
                    if (response.operationCode === 200) {
                        $scope.dsProvincia = response.data;
                        $scope.mProvincia = { codigo: null };
                        $scope.dsDistrito = [];
                        $scope.dsSector = [];
                    }
                });
            }
        }

        $scope.loadDistrito = function () {
            if ($scope.mRegion !== undefined && $scope.mProvincia != undefined) {
                var paramDistrito = {
                    "cmstro": "102",
                    "prmtro1": $scope.mRegion.codigo,
                    "prmtro2": $scope.mProvincia.codigo
                };

                proxyLookup.GetFiltros(paramDistrito, true).then(function (response) {
                    if (response.operationCode === 200) {
                        $scope.dsDistrito = response.data;
                        $scope.mDistrito = { codigo: null };
                        $scope.dsSector = [];
                    }
                });
            }
        }

        $scope.loadSector = function () {
            if ($scope.mRegion !== undefined && $scope.mProvincia !== undefined && $scope.mDistrito !== undefined && $scope.mCampania !== undefined) {
                var paramSector = {
                    "cmstro": "103",
                    "prmtro1": $scope.mRegion.codigo,
                    "prmtro2": $scope.mProvincia.codigo,
                    "prmtro3": $scope.mDistrito.codigo,
                    "prmtro4": $scope.mCampania.codigo
                };

                proxyLookup.GetFiltros(paramSector, true).then(function (response) {
                    if (response.operationCode === 200) {
                        $scope.dsSector = response.data;
                        $scope.mSector = { codigo: null };
                    }
                });
            }
        }

        $scope.searchResults = function () {
            if ((($scope.mFechaIni !== undefined && $scope.mFechaFin !== undefined) && ($scope.mFechaIni <= $scope.mFechaFin)) ||
                ($scope.mFechaIni === undefined && $scope.mFechaFin === undefined)) {
                vm.paramsSearch = {
                    CodAviso: $scope.mCodigoAviso === undefined ? '' : $scope.mCodigoAviso,
                    CodCampania: $scope.mCampania === undefined || $scope.mCampania.codigo === null ? '' : $scope.mCampania.codigo,
                    FecIni: $scope.mFechaIni === undefined ? '' : agricolaUtilities.formatearFecha($scope.mFechaIni),
                    FecFin: $scope.mFechaFin === undefined ? '' : agricolaUtilities.formatearFecha($scope.mFechaFin),
                    CodCultivo: $scope.mCultivo === undefined || $scope.mCultivo.codigo === null ? '' : $scope.mCultivo.codigo,
                    CodRegion: $scope.mRegion === undefined || $scope.mRegion.codigo === null ? '' : $scope.mRegion.codigo,
                    CodProvincia: $scope.mProvincia === undefined || $scope.mProvincia.codigo === null ? '' : $scope.mProvincia.codigo,
                    CodDistrito: $scope.mDistrito === undefined || $scope.mDistrito.codigo === null ? '' : $scope.mDistrito.codigo,
                    CodSectorEst: $scope.mSector === undefined || $scope.mSector.codigo === null ? '' : $scope.mSector.codigo,
                    CodEstado: "1",
                    Pagina: 1,
                    UserCampania:  idRol != 5 ? '' : userCampania
                };
                showResultado();
            } else {
                mModalAlert.showWarning("Verifique las fechas seleccionadas", "");
            }
        }

        $scope.togglePendientes = function (){
            switch($scope.chkPendientes){
                case true:
                    $scope.chkPendientes = false;
                    break;
                case false:
                    $scope.chkPendientes = true;
                    break;
            }
            $scope.verPendientes();
        }

        $scope.verPendientes = function () {
            switch ($scope.chkPendientes) {
                case true:
                    showResultado();
                    break;
                case false:
                    showResultado();
                    break;
            }
        }

        $scope.descargaPadron = function (item) {
            mpSpin.start('Cargando, por favor espere...');
            var url = oimURL.endpoint + 'api/avisos/beneficiarios/campania/'+ item.codCampania+'/aviso/'+ item.codAviso;
            $http.get(
                url,
                { responseType: "arraybuffer" })
                .success(
                    function (data, status, headers) {
                        var type = headers('Content-Type');
                        var defaultFileName = "Padron_" + item.codCampania + "_" + item.codAviso + ".xlsx";

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

        $scope.clearFilters = function () {
            $scope.mCodigoAviso = undefined;
            $scope.dsCampania = [];
            $scope.mFechaIni = undefined;
            $scope.mFechaFin = undefined;
            $scope.dsCultivo = [];
            $scope.dsRegion = [];
            $scope.dsProvincia = [];
            $scope.dsDistrito = [];
            $scope.dsSector = [];
            $scope.showUbigeo(true);
            vm.paramsSearch = {
                CodAviso: "",
                CodCampania: "",
                FecIni: "",
                FecFin: "",
                CodCultivo: "",
                CodRegion: "",
                CodProvincia: "",
                CodDistrito: "",
                CodSectorEst: "",
                CodEstado: "1",
                Pagina: 1
            };
            vm.$onInit();
        }

        function showResultado() {
            var penPadron = 0;
            if($scope.chkPendientes){
                var penPadron = 1;
            }
            var params = vm.paramsSearch;
            mpSpin.start();
            params.UserCampania = idRol != 5 ? '' : userCampania;
            proxyAviso.ListaBandejaReportes(
                params.CodAviso,params.CodCampania,params.FecIni,params.FecFin,params.CodCultivo,
                params.CodRegion,params.CodProvincia,params.CodDistrito,params.CodSectorEst,params.CodEstado,
                params.Pagina,penPadron,params.UserCampania).then(function (response) {
                if (response.operationCode == 200) {
                    var listPromises = [];
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
            var indexSearch = (vm.paramsSearch.CodEstado === "" ? 0 : response.data.cantEstado.map(function (o) { return o.codigo; }).indexOf(vm.paramsSearch.CodEstado));
            $scope.menuConsulta = response.data.cantEstado;
            
            //ng.forEach($scope.menuConsulta, function (value, key) {
            //    $scope.menuConsulta[key].cantidad = (parseInt($scope.menuConsulta[key].cantidad) > 999 ? "999+" : $scope.menuConsulta[key].cantidad);
            //});
            $scope.resultadoConsulta = response.data.listAvisos;
            resultadoGeneral = $scope.resultadoConsulta;
            $scope.refMenuActive(indexSearch < 0 ? vm.paramsSearch.CodEstado : response.data.cantEstado[indexSearch].codigo);
            vm.pagination.totalRecords = response.data.cantPagi;
        }

        function pageChanged(nropage) {
            vm.paramsSearch.Pagina = nropage;
            showResultado();
        }

        $scope.showUbigeo = function (chevronBool) {
            $scope.isUbigeoChevron = chevronBool;
        }


        $scope.refMenuActive = function (firstCodeMenu) {
            ng.forEach($scope.menuConsulta, function (value, key) {
                if ($scope.menuConsulta[key].codigo === firstCodeMenu) {
                    Object.assign($scope.menuConsulta[key], { actived: true });
                }
                else {
                    Object.assign($scope.menuConsulta[key], { actived: false });
                }
            });
        }
        $scope.adjuntarPadron = function (item) {
            $state.go('adjuntarPadron', { aviso: item }, { reload: true, inherit: false });
        }
        $scope.searchState = function (codeState) {
            $scope.chkPendientes = false;
            vm.paramsSearch.CodEstado = codeState;
            vm.paramsSearch.Pagina = 1;
            vm.pagination.currentPage = 1;
            showResultado();
        }
    }
    return ng.module('atencionsiniestrosagricola.app')
        .controller('bandejaReportesController', bandejaReportesController)
        .directive('preventDefault', function () {
            return function (scope, element, attrs) {
                ng.element(element).bind('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
            }
        });
});