define([
    'angular', 'constants'
], function (angular, constants) {
    'use strict';

    angular
        .module('appReno')
        .directive('mpfFiltroRenovacion', FiltroRenovacionDirective);

    FiltroRenovacionDirective.$inject = [];

    function FiltroRenovacionDirective() {
        var directive = {
            controller: FiltroRenovacionDirectiveController,
            controllerAs: 'vm',
            restrict: 'E',
            templateUrl: '/renovacion/app/renovacion/views/filtro/consulta-renovacion-filtro.html',
            transclude: true,
            scope: {
                ngLoadCallback: '&?ngLoad',
                ngLimpiarCallback: '&?ngLimpiar'
            }
        };

        return directive;
    }

    FiltroRenovacionDirectiveController.$inject = ['$scope', '$timeout', 'mModalAlert', 'renovacionBandejaService', 'oimPrincipal', 'accessSupplier'];
    function FiltroRenovacionDirectiveController($scope, $timeout, mModalAlert, renovacionBandejaService, oimPrincipal, accessSupplier) {
        var vm = this;
        var date = new Date();

        var filtrosDefault = {
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
        };
        vm.filtros = {}

        vm.buscarDocumentos = BuscarDocumentos;
        vm.limpiarFiltros = LimpiarFiltros;
        vm.obtenerParametros = GetParametros;
        vm.actualizarSelect = ActualizarSelect;
        vm.documentos = [];
        vm.tipo_agente = [];
        vm.segmentos = [];
        vm.estado_poliza = [];
        vm.estado_renovacion = [];
        vm.nDocumento = {};
        vm.nTipoAgente = {};
        vm.nSegmento = {},
            vm.nEstadoPoliza = {};
        vm.nEstadoRenovacion = {};
        vm.mAgente = null;
        vm.mOficina = null;
        vm.isAdmin = false;
        vm.cOficina = null;
        vm.mrol = null;
        (function load_FiltroRenovacionDirectiveController() {
            vm.isAdmin = oimPrincipal.isAdmin();
            vm.filtros = angular.extend({}, filtrosDefault);
            vm.mrol = oimPrincipal.get_role();
            if (!vm.isAdmin && (oimPrincipal.get_role() == 'AGENTE_COMERCIAL')) {
                vm.mAgente = oimPrincipal.getAgent();
                vm.cOficina = accessSupplier.profile().officeCode;
                if (vm.cOficina) {
                    renovacionBandejaService.obtenerOficina({
                        CodigoOficina: parseInt(vm.cOficina),
                        NombreOficina: ''
                    }).then(function (response) {
                        vm.mOficina = response.Data[0].NombreOficina;
                    });
                }
                
            }
            if (oimPrincipal.get_role() == 'EAC') {
                vm.cOficina = accessSupplier.profile().officeCode;
                if (vm.cOficina) {
                    renovacionBandejaService.obtenerOficina({
                        CodigoOficina: parseInt(vm.cOficina),
                        NombreOficina: ''
                    }).then(function (response) {
                        console.log(response)
                        vm.mOficina = response.Data[0].NombreOficina;
                    });
                }
            }
            GetParametros();
        })();

        function BuscarDocumentos() {
            if ($scope.ngLoadCallback) {
                if (_validateFilter()) {
                    $scope.ngLoadCallback({ '$event': _transformFiltrosLoad() });
                }
            } else {
                console.error('ERR-001: No se ha asignado la propiedad ng-buscar');
            }
        }

        $scope.findAgent = function (wildcar) {
            return renovacionBandejaService.obtenerAgente({
                "CodigoNombre": wildcar, //filtro nombre agente
                "CodigoGestor": "0", //combobox gestor seleccionado
                "CodigoOficina": vm.isAdmin ? '' : parseInt(vm.cOficina), //dato de usuario logeado
                "RolUsuario": oimPrincipal.get_role() //$scope.$parent.mainStep.claims.rolUsuario //dato de usuario logeado
            });
        }

        $scope.findOffice = function (wildcar) {
            return renovacionBandejaService.obtenerOficina({
                CodigoOficina: wildcar.toString().toUpperCase(),
                NombreOficina: ''
            });
        }

        function GetParametros() {
            renovacionBandejaService.obtenerParametros().then(function (response) {
                if (response) {
                    vm.documentos = response.parametros.filter(function (e) { return e.grupo === '001' });
                    vm.tipo_agente = response.parametros.filter(function (e) { return e.grupo === '002' });
                    vm.segmentos = response.parametros.filter(function (e) { return e.grupo === '003' });
                    vm.estado_poliza = response.parametros.filter(function (e) { return e.grupo === '004' });
                    vm.estado_renovacion = response.parametros.filter(function (e) { return e.grupo === '005' });
                    $scope.tipos_documentos = vm.documentos;
                }

            }).catch(function () {
                console.error('errores')
                mModalAlert.showWarning('Error general del sistema', 'ALERTA')
            });
        }

        function ActualizarSelect(parametro, grupo) {
            switch (parametro.grupo) {
                case '001':
                    vm.filtros.tipoDocumento = parametro.codigo;
                    break;
                case '002':
                    vm.filtros.codAgente = parametro.codigo;
                    break;
                case '003':
                    vm.filtros.codRamo = parametro.codigo;
                    break;
                case '004':
                    vm.filtros.codEstadoPoliza = parametro.codigo;
                    break;
                case '005':
                    vm.filtros.codEstadoRenovacion = parametro.codigo;
                    break;
                default:
                    switch (grupo) {
                        case '001':
                            vm.filtros.tipoDocumento = parametro.codigo;
                            break;
                        case '002':
                            vm.filtros.codAgente = parametro.codigo;
                            break;
                        case '003':
                            vm.filtros.codRamo = parametro.codigo;
                            break;
                        case '004':
                            vm.filtros.codEstadoPoliza = parametro.codigo;
                            break;
                        case '005':
                            vm.filtros.codEstadoRenovacion = parametro.codigo;
                            break;
                    }
            }
        }

        function _validateFilterFields() {
            var validate = vm.filtros.codAgente !== null
                || vm.filtros.diasVencimiento !== null
                || vm.filtros.endosatario !== null
                || vm.filtros.codEstadoRenovacion !== null
                || vm.filtros.codEstadoPoliza !== null
                || vm.filtros.fechaFin !== null
                || vm.filtros.fechaInicio !== null
                || vm.filtros.nombreCliente !== null
                || vm.filtros.numeroDocumento !== null
                || vm.filtros.codOficina !== null
                || vm.filtros.codRamo !== null
                || vm.filtros.tipoDocumento !== null
                || vm.filtros.usuario !== null
                || vm.filtros.polizaId !== null
                || vm.mAgente !== null
                || vm.mOficina !== null

            if(!validate){
                mModalAlert.showWarning('Debe ingresar como mínimo un filtro', 'ALERTA', null, 3000);
                return false;
            }
            return true;
        }
        function _validateFilterEACFields() {
            var validate = vm.filtros.codAgente !== null
                || vm.filtros.diasVencimiento !== null
                || vm.filtros.endosatario !== null
                || vm.filtros.codEstadoPoliza !== null
                || vm.filtros.codEstadoRenovacion !== null
                || vm.filtros.fechaFin !== null
                || vm.filtros.fechaInicio !== null
                || vm.filtros.nombreCliente !== null
                || vm.filtros.numeroDocumento !== null
                || vm.filtros.codOficina !== null
                || vm.filtros.codRamo !== null
                || vm.filtros.tipoDocumento !== null
                || vm.filtros.usuario !== null
                || vm.filtros.polizaId !== null
                || vm.mAgente !== null

            return validate;
            
        }
        function _validateFilterRamoFields() {
            var validate = vm.filtros.codAgente !== null
                || vm.filtros.diasVencimiento !== null
                || vm.filtros.endosatario !== null
                || vm.filtros.codEstadoRenovacion !== null
                || vm.filtros.codEstadoPoliza !== null
                || vm.filtros.fechaFin !== null
                || vm.filtros.fechaInicio !== null
                || vm.filtros.nombreCliente !== null
                || vm.filtros.numeroDocumento !== null
                || vm.filtros.codOficina !== null
                || vm.filtros.tipoDocumento !== null
                || vm.filtros.usuario !== null
                || vm.filtros.polizaId !== null
                || vm.mAgente !== null
                || vm.mOficina !== null
            return validate;
            
        }
        function _validateDocumentFields(){
            if(vm.filtros.tipoDocumento!= null && vm.filtros.numeroDocumento == null ){
                mModalAlert.showWarning('Debe ingresar el número de documento', 'ALERTA', null, 3000);
                return false;
            }
            if(vm.filtros.tipoDocumento== null && vm.filtros.numeroDocumento != null ){
                mModalAlert.showWarning('Debe seleccionar el tipo de documento', 'ALERTA', null, 3000);
                return false;
            }
            return true;
        }
        function _validateDateFields(){
            if(vm.filtros.fechaInicio!= null && vm.filtros.fechaFin == null ){
                mModalAlert.showWarning('Debe ingresar la fecha final', 'ALERTA', null, 3000);
                return false;
            }
            if(vm.filtros.fechaInicio== null && vm.filtros.fechaFin != null ){
                mModalAlert.showWarning('Debe ingresar la fecha inicial', 'ALERTA', null, 3000);
                return false;
            }
            return true;
        }
        function _validateNameClientFields(){
            if(vm.filtros.nombreCliente!= null && vm.filtros.nombreCliente!= '' && (vm.filtros.tipoDocumento == null && vm.filtros.numeroDocumento == null) ){
                mModalAlert.showWarning('Debe ingresar el tipo y número de documento', 'ALERTA', null, 3000);
                return false;
            }
            return true;
        }
        function _validateAgentFields(){
            if(vm.mAgente!= null && (vm.filtros.codRamo == null && vm.mOficina == null) ){
                mModalAlert.showWarning('Debe ingresar el ramo', 'ALERTA', null, 3000);
                return false;
            }
            return true;
        }
        function _validateOficinaFields(){
            if(vm.mOficina!= null && vm.mAgente == null ){
                mModalAlert.showWarning('Debe ingresar un agente', 'ALERTA', null, 3000);
                return false;
            }
            return true;
        }
        function _validateRamoFields(){
            if(vm.filtros.codRamo!= null && !_validateFilterRamoFields() && (vm.mAgente == null && vm.mOficina == null) ){
                mModalAlert.showWarning('Debe ingresar una oficina o agente', 'ALERTA', null, 3000);
                return false;
            }
            return true;
        }
        function _validateEstadoPolizaFields(){
            if(vm.filtros.codEstadoPoliza!= null && (vm.mAgente == null && vm.mOficina == null) ){
                mModalAlert.showWarning('Debe ingresar una oficina o agente', 'ALERTA', null, 3000);
                return false;
            }
            return true;
        }
        function _validateEstadoRenovacionFields(){
            if(vm.filtros.codEstadoRenovacion!= null && (vm.mAgente == null && vm.mOficina == null) ){
                mModalAlert.showWarning('Debe ingresar una oficina o agente', 'ALERTA', null, 3000);
                return false;
            }
            return true;
        }
        function _validateDateAdminFields(){
            if(vm.filtros.fechaInicio!= null && vm.filtros.fechaFin != null && (vm.mAgente == null && vm.mOficina == null) ){
                mModalAlert.showWarning('Debe ingresar una oficina o agente', 'ALERTA', null, 3000);
                return false;
            }
            return true;
        }
        function _validateDiasFields(){
            if(vm.filtros.diasVencimiento!= null && (vm.mAgente == null && vm.mOficina == null) ){
                mModalAlert.showWarning('Debe ingresar una oficina o agente', 'ALERTA', null, 3000);
                return false;
            }
            return true;
        }
        function _validateFilter() {
            if(!_validateDocumentFields()){
                return false
            }
            if(!_validateDateFields()){
                return false
            }
            if(oimPrincipal.get_role() == 'EAC'){
                if (_validateFilterEACFields()) {
                    return true;
                } else {
                    mModalAlert.showWarning('Debe añadir otro filtro a la consulta', 'ALERTA', null, 3000);
                    return false;
                }
            }
            if(vm.isAdmin){
                if (!_validateFilterFields()) {
                    return false;
                }
                if (!_validateNameClientFields()) {
                    return false;
                }
                if (!_validateAgentFields()) {
                    return false;
                }
                if (!_validateOficinaFields()) {
                    return false;
                }
                if (!_validateRamoFields()) {
                    return false;
                }
                if (!_validateEstadoPolizaFields()) {
                    return false;
                }
                if (!_validateEstadoRenovacionFields()) {
                    return false;
                }
                if (!_validateDateAdminFields()) {
                    return false;
                }
                if (!_validateDiasFields()) {
                    return false;
                }
            }
            return true;
        }

        function _transformFiltrosLoad() {
            var fechaInicio = null;
            var fechaFin = null;
            if (vm.filtros.fechaInicio) {
                fechaInicio = vm.filtros.fechaInicio.getFullYear() + '-' + ("0" + (vm.filtros.fechaInicio.getMonth() + 1)).slice(-2) + '-' + ("0" + (vm.filtros.fechaInicio.getDate())).slice(-2)

            }
            if (vm.filtros.fechaFin) {
                fechaFin = vm.filtros.fechaFin.getFullYear() + '-' + ("0" + (vm.filtros.fechaFin.getMonth() + 1)).slice(-2) + '-' + ("0" + (vm.filtros.fechaFin.getDate())).slice(-2)

            }
            if (vm.mAgente) {
                vm.filtros.codAgente = vm.mAgente.codigoAgente
            }
            if (vm.mOficina) {
                vm.filtros.codOficina = parseInt(vm.cOficina) || vm.mOficina.codigoOficina;
            }

            return {
                codAgente: parseInt(vm.filtros.codAgente),
                diasVencimiento: parseInt(vm.filtros.diasVencimiento),
                endosatario: vm.filtros.endosatario,
                codEstadoPoliza: vm.filtros.codEstadoPoliza,
                codEstadoRenovacion: vm.filtros.codEstadoRenovacion,
                fechaFin: fechaFin,
                fechaInicio: fechaInicio,
                nombreCliente: vm.filtros.nombreCliente,
                numeroDocumento: vm.filtros.numeroDocumento,
                codOficina: vm.filtros.codOficina,
                codRamo: parseInt(vm.filtros.codRamo),
                tipoDocumento: vm.filtros.tipoDocumento,
                usuario: vm.filtros.usuario,
                polizaId: vm.filtros.polizaId,
            };
        }

        function LimpiarFiltros() {
            vm.filtros = angular.extend({}, filtrosDefault);
            //_setDefaultAgente();
            if ($scope.ngLimpiarCallback) {
                $scope.ngLimpiarCallback();
            }
        }

    }

});
