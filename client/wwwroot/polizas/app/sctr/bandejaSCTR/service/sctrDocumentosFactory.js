'use strict'

define(['angular', 'constants'], function(angular, constants) {

    var appAutos = angular.module('appAutos');

    appAutos.factory('empresaCotizarFactory', ['proxyAgente', 'proxyGeneral', 'proxyTipoDocumento', 'proxyContratante', 'proxyClaims', 'proxySctr', 'proxyCotizacion', '$http', '$q', '$window', function(proxyAgente, proxyGeneral, proxyTipoDocumento, proxyContratante, proxyClaims, proxySctr, proxyCotizacion, $http, $q, $window) {

        var base = constants.system.api.endpoints.policy;

        function concatenateUrl(params) {
            var url = '';
            angular.forEach(params, function(value, key) {
                url += '/' + value;
            });
            url ? url : url = '/';
            // console.log(url);
            return url;
        }

        function getData(url, params) {
            var newUrl = url + concatenateUrl(params)
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: base + newUrl,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response) {
                deferred.resolve(response.data);
            });
            return deferred.promise;
        }

        function postData(url, params) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: base + url,
                data: params,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response) {
                deferred.resolve(response.data);
            });
            return deferred.promise;
        }

        var addVariableSession = function(key, newObj) {
            var mydata = newObj;
            $window.sessionStorage.setItem(key, JSON.stringify(mydata));
        };

        var getVariableSession = function(key) {
            var mydata = $window.sessionStorage.getItem(key);
            if (mydata) {
                mydata = JSON.parse(mydata);
            }
            return mydata || [];
        };

        var eliminarVariableSession = function(key) {
            $window.sessionStorage.removeItem(key);
        };

        function formatearFecha(fecha) {
            if (fecha instanceof Date) {
                var today = fecha;
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!

                if (dd === 32) {
                    dd = 1;
                    mm = today.getMonth() + 2;
                }

                if (dd < 10) {
                    dd = '0' + dd
                }
                if (mm < 10) {
                    mm = '0' + mm
                }


                var yyyy = today.getFullYear();
                return today = dd + '/' + mm + '/' + yyyy;
            }
        }

        function agregarMes(fecha, meses) {
            var currentMonth = fecha.getMonth();
            fecha.setMonth(fecha.getMonth() + meses)

            if (fecha.getMonth() != ((currentMonth + meses) % 12)) {
                fecha.setDate(0);
            }
            return fecha;
        }

        function getGestor(params, showSpin) {
            //return getData('api/general/gestoroficina/' + constants.module.polizas.autos.companyCode, params.codAgente);
            return proxyGeneral.GetGestorOficina(params.codCia, params.codAgente, showSpin);
        }

        function getAgente(params, showSpin) {
            //return getData('api/agente/buscar?codigoNombre=' + params, '');
            return proxyAgente.buscarAgente(params, showSpin);
        }

        function getClaims(params) {
            return proxyClaims.GetClaims();
        }

        function getTipoDocumento() {
            return proxyTipoDocumento.getTipoDocumento();
        }

        function getFrecuencia(tipo, showSpin) {
            return proxySctr.GetFrecuenciaByCodGru(tipo, showSpin);
            // return postData('api/general/actividadeconomica/sunat', params);
        }

        function download(params, defaultFileName) {
            var self = this;
            var deferred = $q.defer();
            $http.get(base + 'api/file/emisa/' + params, { responseType: "arraybuffer" }).success(
                function(data, status, headers) {
                    var type = headers('Content-Type');
                    var disposition = headers('Content-Disposition');
                    if (disposition) {
                        var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
                        if (match[1])
                            defaultFileName = match[1];
                    }
                    defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
                    var blob = new Blob([data], { type: type });
                    saveAs(blob, defaultFileName);
                    deferred.resolve(defaultFileName);
                },
                function(data, status) {
                    var e = /* error */
                        deferred.reject(e);
                });
            return deferred.promise;
        }

        function getEstados(showSpin) {
            return proxySctr.GetListState(showSpin);
        }

        function getReportes(params, showSpin) {
            // return proxySctr.GetListDocumentReportPage(params, showSpin);
            return proxySctr.GetListDocumentReportPage(params, showSpin);
        }

        return {
            addVariableSession: addVariableSession,
            getVariableSession: getVariableSession,
            eliminarVariableSession: eliminarVariableSession,
            formatearFecha: formatearFecha,
            agregarMes: agregarMes,
            getGestor: getGestor,
            getAgente: getAgente,
            getClaims: getClaims,
            getTipoDocumento: getTipoDocumento,
            getFrecuencia: getFrecuencia,
            download: download,

            getEstados: getEstados,
            getReportes: getReportes
        };
    }]);
});