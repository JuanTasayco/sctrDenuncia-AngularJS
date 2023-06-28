define([
    'angular', 'constants'
], function (angular, constants) {
    'use strict';

    angular
        .module('appReno')
        .controller('consultaRenovacionController', ConsultaRenovacionController);

    ConsultaRenovacionController.$inject = ['$state', 'renovacionBandejaService', 'renovacionBandejaFactory', 'mModalAlert'];

    function ConsultaRenovacionController($state, renovacionBandejaService, renovacionBandejaFactory, mModalAlert) {
        var vm = this;
        vm.paginacion = {
            numeroPagina: 1,
            cantidadPorPagina: 10,
            limite: null,
        }
        vm.paginaActual = 1;
        vm.payload = {};
        vm.polizas = {};
        vm.segmentos = [];
        vm.total = 0;
        vm.limpiarResultados = LimpiarResultados;
        vm.obtenerPolizas = ObtenerPolizas;
        vm.goToProcesar = GoToProcesar;
        vm.changePage = ChangePage;
        vm.obtenerParametros = ObtenerParametros;
        vm.validarSegmento = ValidarSegmento;
        (function load_ConsultaRenovacionController() {
            vm.payload = {
                codAgente: null,
                diasVencimiento: null,
                endosatario: null,
                codEstadoRenovacion: null,
                fechaFin: null,
                fechaInicio: null,
                nombreCliente: null,
                numeroDocumento: null,
                codOficina: null,
                codRamo: null,
                tipoDocumento: null,
                usuario: null,
                codEstadoPoliza: null,
                polizaId: null,
            }
            ObtenerParametros();
            //obtenerPolizas();
        })();
        function ObtenerPolizas(filtros) {
            vm.payload = filtros;
            renovacionBandejaService.obtenerProcesosPoliza(vm.payload, 1, vm.paginacion.cantidadPorPagina).then(function (response) {
                // console.log(response)
                vm.polizas = response.polizas
                vm.total = response.total;
            }).catch(function () {
                vm.total = 0;
                console.error('errores')
                mModalAlert.showWarning('Consultar nuevamente', 'ALERTA')
            });
        }

        function ValidarSegmento(parametro) {
            return vm.segmentos.some(function (segmento) {
                return segmento.codigo.toUpperCase() == parametro.toUpperCase();
            })
        }

        function ChangePage(indexPage) {
            vm.paginaActual = indexPage;
            vm.paginacion = {
                numeroPagina: indexPage,
                cantidadPorPagina: 10,
                limite: null,
            }
            renovacionBandejaService.obtenerProcesosPoliza(vm.payload, vm.paginacion.numeroPagina, vm.paginacion.cantidadPorPagina).then(function (response) { //url).then(function(response){
                vm.polizas = response.polizas
                vm.total = response.total;
            }).catch(function () {
                vm.total = 0;
                console.error('errores')
                mModalAlert.showWarning('Intentar nuevamente', 'ALERTA')
            });
        }

        function GoToProcesar(poliza) {
            if (poliza.numPoliza) {
                $state.go('gestionProceso', {
                    polizaID: poliza.numPoliza,
                })
            }
        }

        function LimpiarResultados() {
            vm.payload = {
                codAgente: null,
                diasVencimiento: null,
                endosatario: null,
                codEstadoRenovacion: null,
                fechaFin: null,
                fechaInicio: null,
                nombreCliente: null,
                numeroDocumento: null,
                codOficina: null,
                codRamo: null,
                tipoDocumento: null,
                usuario: null,
                codEstadoPoliza: null,
                polizaId: null,
            }
        }

        function ObtenerParametros() {
            renovacionBandejaService.obtenerParametros().then(function (response) {
                // console.log(response)
                if (response) {
                    vm.segmentos = response.parametros.filter(function (e) { return e.grupo === '008' });
                    // console.log('parametros', vm.segmentos)
                }

            }).catch(function () {
                console.error('errores')
                // mModalAlert.showWarning('Error general del sistema', 'ALERTA')
            });
        }


    }

});
