define([
    'angular', 'constants', //'constantsEpsEmpresa'
  ], function (angular, constants /*,constantsEpsEmpresa*/) {
    'use strict';

    angular
    .module(constants.module.polizas.epsEmpresa.moduleName)
    .factory('epsEmpresaFactory', EpsEmpresaFactory);

    EpsEmpresaFactory.$inject = ['$http', '$q'];

    function EpsEmpresaFactory($http, $q) {
        var factory = {
            getControllerNameStep: GetControllerNameStep,
            getTemplateStep: GetTemplateStep,
            getParametro: GetParametro,
            getTarifas: GetTarifas,
            setParametros: SetParametros,
            setTarifas: SetTarifas,
            setDepartamentos: SetDepartamentos,
            setProvincias: SetProvincias,
            setDistritos: SetDistritos,
            getProvincias: GetProvincias,
            getDepartamentos: GetDepartamentos,
            getDistritos: GetDistritos,
            initCotizacion: InitCotizacion,
            clearCotizacion: ClearCotizacion,
            getValidParametrosBuscarPorRUC: GetValidParametrosBuscarPorRUC,
            validStepDatosEmpresa: ValidStepDatosEmpresa,
            validStepInformacionEmpresa: ValidStepInformacionEmpresa,
            validStepInformacionTrabajadores: ValidStepInformacionTrabajadores,
            validStepInformacionAdicional : ValidStepInformacionAdicional,
            isUndefinedOrNullOrEmpty: IsUndefinedOrNullOrEmpty,
            getCompleteStep: GetCompleteStep,
            setCompleteStep: SetCompleteStep,
            setIncompleteStep : SetIncompleteStep,
            validControlForm: ValidControlForm,
            setGrupos: SetGrupos,
            getGrupos: GetGrupos,
            setMantenimientoParametros: SetMantenimientoParametros,
            getMantenimientoParametros: GetMantenimientoParametros,
            parametros: {},
            mantenimiento_parametros: {},
            grupos: [],
            tarifas: {},
            cotizacion: {},
            validaciones: {},
            departamentos: {},
            provincias: {},
            distritos: {}
        };

        var baseView = '/polizas/app/eps-empresa/views';

        return factory;

        function GetControllerNameStep(step) {
            var controllers = [
                undefined,
                "cotizacionDatosEmpresaEpsEmpresaController",
                "cotizacionInformacionEmpresaEpsEmpresaController",
                "cotizacionInformacionTrabajadoresEpsEmpresaController",
                "cotizacionInformacionAdicionalEpsEmpresaController",
                "cotizacionFinalEpsEmpresaController",
            ];
            return controllers[step];
        }
      
        function GetTemplateStep(step) {
            var templates = [
                undefined,
                "/solicitud/solicitud-pasos/cotizacion-datos-empresa-eps-empresa.template.html",
                "/solicitud/solicitud-pasos/cotizacion-informacion-empresa-eps-empresa.template.html",
                "/solicitud/solicitud-pasos/cotizacion-informacion-trabajadores-eps-empresa.template.html",
                "/solicitud/solicitud-pasos/cotizacion-informacion-adicional-eps-empresa.template.html",
                "/solicitud/solicitud-pasos/cotizacion-final-eps-empresa.template.html",
            ];
            var deferred = $q.defer();
            
            $http.get(baseView + templates[step]).success(function (data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        }

        function SetParametros(parametros) {
            var valores = {};
            parametros.forEach(function (param) { 
                if(!valores[param.grupo])
                {
                    valores[param.grupo] = [];
                }
                valores[param.grupo].push({
                    descripcion: param.descripcion,
                    valorNumerico: param.valorNumerico,
                    valorTexto: param.valorTexto,
                    orden: param.orden
                });
            });
            factory.parametros = valores;
        }

        function SetGrupos(parametros) {
            var grupos = [];
            parametros.forEach(function (param) { 
                if(!grupos.find(function(elem) { return elem.descripcion === param.grupo}))
                {
                    grupos.push({descripcion : param.grupo, valor : param.grupo});
                }
            });
            factory.grupos = grupos;
        }

        function SetTarifas(tarifas) {
            //console.log(tarifas);
            var valores = [];
            tarifas.forEach(function (param, idx, array) { 
                if(array.length -1 === idx)
                {
                    valores.push({
                        indice: idx,
                        nombre: 'rango_' + param.desde + '_' + param.hasta,
                        descripcion: 'De ' + param.desde + ' años a más',
                        desde: param.desde,
                        hasta: param.hasta,
                        tarifa: param.tarifa,
                        id: param.idTarifa
                    });
                }
                else{
                    valores.push({
                        indice: idx,
                        nombre: 'rango_' + param.desde + '_' + param.hasta,
                        descripcion: 'De ' + param.desde + ' a ' + param.hasta + ' años',
                        desde: param.desde,
                        hasta: param.hasta,
                        tarifa: param.tarifa,
                        id: param.idTarifa
                    });
                }
            });
            factory.tarifas = valores;
        }

        function SetDepartamentos(valores) {
            return new Promise(function(resolve) {
                factory.departamentos = valores;
                resolve();
            });
        }

        function SetMantenimientoParametros(valores) {
            return new Promise(function(resolve) {
                factory.mantenimiento_parametros = valores;
                resolve();
            });
        }

        function SetProvincias(valores) {
            return new Promise(function(resolve) {
                factory.provincias = valores;
                resolve();
            });
        }

        function SetDistritos(valores) {
            return new Promise(function(resolve) {
                factory.distritos = valores;
                resolve();
            });
        }

        function GetMantenimientoParametros(){
            return factory.mantenimiento_parametros;
        }

        function GetParametro(parametro){
            return factory.parametros[parametro];
        }

        function GetGrupos(){
            return factory.grupos;
        }

        function GetTarifas(){
            return factory.tarifas;
        }

        function GetDepartamentos(){
            return factory.departamentos;
        }

        function GetProvincias(){
            return factory.provincias;
        }

        function GetDistritos(){
            return factory.distritos;
        }

        function InitCotizacion() {
            if (!!factory.cotizacion.init) return (void 0);
            factory.cotizacion = {
              init: false,
              step: { '1': false, '2': false, '3': false, '4': false, '5': false },
              datosEmpresa: {},
              informacionEmpresa: {},
              informacionTrabajadores: {},
              informacionAdicional: {
                  maternidad: 'false',
                  maternidadCantidad: '',
                  oncologico: 'false',
                  oncologicoCantidad: '',
                  continuidad: 'false',
                  continuidadCantidad: ''
              },
              final: {}
            };
        }

        function ClearCotizacion() {
            factory.cotizacion = {};
        }

        function GetValidParametrosBuscarPorRUC(numeroDocumento, validadores) {
            var documento = (numeroDocumento || '');
            return !!documento && !!validadores && (
              documento.length === validadores.maxNumeroDoc ||
              (
                (documento.length <= validadores.maxNumeroDoc && documento.length >= validadores.minNumeroDoc)
              )
            );
        }

        function ValidStepDatosEmpresa() {
            var datosEmpresa = factory && factory.cotizacion && factory.cotizacion.datosEmpresa || {};
            return !factory.isUndefinedOrNullOrEmpty(datosEmpresa.ruc) &&
              !factory.isUndefinedOrNullOrEmpty(datosEmpresa.razonSocial) &&
              !factory.isUndefinedOrNullOrEmpty(datosEmpresa.razonComercial) &&
              !factory.isUndefinedOrNullOrEmpty(datosEmpresa.telefono) &&
              !factory.isUndefinedOrNullOrEmpty(datosEmpresa.direccion) &&
              !factory.isUndefinedOrNullOrEmpty(datosEmpresa.departamento) &&
              !factory.isUndefinedOrNullOrEmpty(datosEmpresa.provincia) &&
              !factory.isUndefinedOrNullOrEmpty(datosEmpresa.distrito) &&
              !factory.isUndefinedOrNullOrEmpty(datosEmpresa.nombreContacto) &&
              !factory.isUndefinedOrNullOrEmpty(datosEmpresa.cargoContacto) &&
              !factory.isUndefinedOrNullOrEmpty(datosEmpresa.correoContacto)
        }

        function ValidStepInformacionEmpresa() {
            var informacionEmpresa = factory && factory.cotizacion && factory.cotizacion.informacionEmpresa || {};
            return !factory.isUndefinedOrNullOrEmpty(informacionEmpresa.epsCia)
        }

        function ValidStepInformacionTrabajadores() {
            var informacionTrabajadores = factory && factory.cotizacion && factory.cotizacion.informacionTrabajadores || {};
            return !factory.isUndefinedOrNullOrEmpty(informacionTrabajadores.nroOperarios) &&
              !factory.isUndefinedOrNullOrEmpty(informacionTrabajadores.nroAdministrativos) &&
              !factory.isUndefinedOrNullOrEmpty(informacionTrabajadores.nroTrabajadoresPlanilla) &&
              !factory.isUndefinedOrNullOrEmpty(informacionTrabajadores.aporteAnualEsalud)
        }

        function ValidStepInformacionAdicional() {
            var informacionAdicional = factory && factory.cotizacion && factory.cotizacion.informacionAdicional || {};
            return !factory.isUndefinedOrNullOrEmpty(informacionAdicional.maternidad) &&
              !factory.isUndefinedOrNullOrEmpty(informacionAdicional.oncologico) &&
              !factory.isUndefinedOrNullOrEmpty(informacionAdicional.continuidad)
        }

        function IsUndefinedOrNullOrEmpty(value) {
            return value === null || value === undefined || value === '';
        }

        function GetCompleteStep(step) {
            return factory.cotizacion.step[step];
        }

        function SetCompleteStep(step) {
            factory.cotizacion.step[step] = true;
        }

        function SetIncompleteStep(step) {
            factory.cotizacion.step[step] = false;
        }

        function ValidControlForm(form, controlName) {
            var control = form[controlName];
            return control && control.$error.required && !control.$pristine;
        }
    }
});