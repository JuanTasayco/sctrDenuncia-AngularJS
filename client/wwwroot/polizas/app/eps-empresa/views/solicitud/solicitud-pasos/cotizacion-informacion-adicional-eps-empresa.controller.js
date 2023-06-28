define([
    'angular', 'lodash', 'constants', 'constantsEpsEmpresa', 'mpfPersonDirective', 'mpfModalConfirmationSteps'
  ], function (angular, _, constants, constantsEpsEmpresa) {
    'use strict';

    angular
    .module(constants.module.polizas.epsEmpresa.moduleName)
    .controller('cotizacionInformacionAdicionalEpsEmpresaController',CotizacionInformacionAdicionalEpsEmpresaController);

    CotizacionInformacionAdicionalEpsEmpresaController.$inject = ['$scope', '$state', 'mpSpin', 'epsEmpresaFactory', 'epsEmpresaService', '$uibModal'];

    function CotizacionInformacionAdicionalEpsEmpresaController($scope, $state, mpSpin, epsEmpresaFactory, epsEmpresaService, $uibModal) {
        var vm = this;

        //Variables
        vm.informacionAdicional = {};
        vm.informacionSolicitud = {};
        vm.formService = constantsEpsEmpresa.VALIDATORS.INFORMACION_ADICIONAL;
        // Funciones
        vm.getValidations = GetValidations;
        vm.onClickNo = OnClickNo;
        vm.activeBotonSiguiente = ActiveBotonSiguiente;
        vm.goToNextStep = GoToNextStep;
        vm.stepDisabled = StepDisabled;
        vm.crearObjetoDTO = CrearObjetoDTO;

        (function load_CotizacionInformacionEpsEmpresaController() {
            vm.informacionAdicional = epsEmpresaFactory.cotizacion.informacionAdicional;
            var steps = document.getElementById('stepsSolicitud');
            steps.classList.remove("disabled-steps");
        })();
        
        // Funciones:
        function GetValidations(controlCode) {
            var findControl = _findControlObject(controlCode);
            return findControl ? findControl.Validations : {};
        }

        function OnClickNo(partControlName) {
            if(vm.informacionAdicional && vm.informacionAdicional[partControlName + 'Cantidad']){
                vm.informacionAdicional[partControlName + 'Cantidad'] = '';
            }
        }

        function ActiveBotonSiguiente() {
            return _validationSendDto() && _validationForm();
        }

        function GoToNextStep() {
            mpSpin.start();
            vm.informacionSolicitud = epsEmpresaFactory.cotizacion;
            var solicitudDTO = CrearObjetoDTO(vm.informacionSolicitud);
            epsEmpresaService.addSolicitud(solicitudDTO).then(function(response){
                if(response)
                {
                    var number = ('0000000000' + response.id).toString();
                    epsEmpresaFactory.cotizacion.final = {
                        nroSolicitud : number.slice(number.length - 10, number.length),
                        fechaSolicitud : response.fechaSolicitud,
                        estado: 
                        (
                            (epsEmpresaFactory.parametros.ESTADO_COTIZACION !== undefined) ? 
                                ( epsEmpresaFactory.parametros.ESTADO_COTIZACION.find(function(item){ return item.valorNumerico == response.activo}) !== undefined ? 
                                    (
                                        (epsEmpresaFactory.parametros.ESTADO_COTIZACION.find(function(item){ return item.valorNumerico == response.activo}).descripcion) !== undefined ?
                                        epsEmpresaFactory.parametros.ESTADO_COTIZACION.find(function(item){ return item.valorNumerico == response.activo}).descripcion
                                        : ''
                                    ) 
                                    : '' 
                                ) 
                                : ''
                        ),
                        cotizacionComposicion :  response.cotizacionComposicion
                    }
                }
                _grabarCotizacionContratante();
                mpSpin.end();
            },function (error) {
                
                if(error.status === 500) { _mostrarErrorInterno(); mpSpin.end(); }
                if(error.status === 400) {
                    if(error.data.status){
                        epsEmpresaFactory.validaciones = error.data.errors;
                        if(error.data.status === 1){
                            var number = ('0000000000' + error.data.data.idSolicitud).toString();
                            epsEmpresaFactory.cotizacion.final = {
                                nroSolicitud : number.slice(number.length - 10, number.length),
                                fechaSolicitud : error.data.data.fechaSolicitud,
                                estado: 
                                (
                                    (epsEmpresaFactory.parametros.ESTADO_COTIZACION !== undefined) ? 
                                        ( epsEmpresaFactory.parametros.ESTADO_COTIZACION.find(function(item){ return item.valorNumerico == error.data.data.estadoCotizacion}) !== undefined ? 
                                            (
                                                (epsEmpresaFactory.parametros.ESTADO_COTIZACION.find(function(item){ return item.valorNumerico == error.data.data.estadoCotizacion}).descripcion) !== undefined ?
                                                epsEmpresaFactory.parametros.ESTADO_COTIZACION.find(function(item){ return item.valorNumerico == error.data.data.estadoCotizacion}).descripcion
                                                : ''
                                            ) 
                                            : '' 
                                        ) 
                                        : ''
                                ),
                                empresa: error.data.data.razonSocial
                            }
                            _grabarCotizacionContratante();
                            mpSpin.end();
                        }else{
                            if(error.data.status === 3 && error.data.errors.count > 0){
                                mpSpin.end();
                                $scope.dataConfirmation = {
                                    save: false,
                                    title: error.data.errors[0] + '.',
                                    subTitle: '¿Desea intentar grabar la solicitud nuevamente?',
                                    lblClose: 'Intentar de nuevo',
                                    lblSave: 'No, Limpiar el formulario e ingresar nuevamente la información.' 
                                  };
                                  var vModalSteps = $uibModal.open({
                                    backdrop: true, // background de fondo
                                    backdropClick: true,
                                    dialogFade: false,
                                    keyboard: true,
                                    scope: $scope,
                                    template: '<mpf-modal-confirmation-steps data="dataConfirmation" close="close()"></mpf-modal-confirmation-steps>',
                                    controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                                      $scope.close = function () {
                                        $uibModalInstance.close();
                                      };
                                    }]
                        
                                  });
                                  vModalSteps.result.then(function () {
                                    var dataConfirmationWatch = $scope.$watch('dataConfirmation', function (value) {
                                      if (value.save) _regresarPasoUno();
                                    });
                                    $scope.$on('$destroy', function () { dataConfirmationWatch(); });
                                  }, function () { });
                            }
                            else{
                                _mostrarErrorValidaciones();
                                mpSpin.end();
                            }
                        }
                    }
                    else{
                        _mostrarErrorInterno();
                        mpSpin.end();
                    }
                }
                
            });
        }

        function StepDisabled() {
            return epsEmpresaFactory.getCompleteStep(constantsEpsEmpresa.STEPS.INFORMACION_ADICIONAL);
        }

        function CrearObjetoDTO(objectSolicitud){
            var departamento = ('00' + objectSolicitud.datosEmpresa.departamento).toString();
            var provincia = ('000' + objectSolicitud.datosEmpresa.provincia).toString();
            var distrito = ('00' + objectSolicitud.datosEmpresa.distrito).toString();
            var solicitud = 
            {
                data: {
                    aporteAnualEssalud : +objectSolicitud.informacionTrabajadores.aporteAnualEsalud,
                    cantidadAdministrativos : +objectSolicitud.informacionTrabajadores.nroAdministrativos,
                    cantidadAsegurados: +objectSolicitud.informacionEmpresa.nroAsegurados,
                    cantidadCasosOncologicos: +objectSolicitud.informacionAdicional.oncologicoCantidad,
                    cantidadMaternidadCurso: +objectSolicitud.informacionAdicional.maternidadCantidad,
                    cantidadOperarios: +objectSolicitud.informacionTrabajadores.nroOperarios,
                    cantidadPreExistencia: +objectSolicitud.informacionAdicional.continuidadCantidad,
                    cantidadTitular: +objectSolicitud.informacionTrabajadores.titularMas0,
                    cantidadTitularDep1: +objectSolicitud.informacionTrabajadores.titularMas1,
                    cantidadTitularDep2: +objectSolicitud.informacionTrabajadores.titularMas2,
                    cantidadTitularDep3: +objectSolicitud.informacionTrabajadores.titularMas3,
                    cantidadTrabajadoresPlanilla: +objectSolicitud.informacionTrabajadores.nroTrabajadoresPlanilla,
                    cargoContacto: objectSolicitud.datosEmpresa.cargoContacto.toString().toUpperCase(),
                    correoContacto: objectSolicitud.datosEmpresa.correoContacto.toString().toUpperCase(),
                    direccion: objectSolicitud.datosEmpresa.direccion.toString().toUpperCase(),
                    telefono: objectSolicitud.datosEmpresa.telefono,
                    epsCia: objectSolicitud.informacionEmpresa.epsCia,
                    fechaSolicitud: Date.now(),
                    nombreContacto: objectSolicitud.datosEmpresa.nombreContacto.toString().toUpperCase().trim(),
                    nombreEpsCia: objectSolicitud.informacionEmpresa.nombre.toString().toUpperCase(),
                    pagoPrima: +objectSolicitud.informacionTrabajadores.pagoFirmaCargo,//
                    rangoEtario: objectSolicitud.informacionTrabajadores.rangosEtarios,//
                    razonComercial: objectSolicitud.datosEmpresa.razonComercial.toString().toUpperCase(),
                    razonSocial: objectSolicitud.datosEmpresa.razonSocial.toString().toUpperCase(),
                    ruc: objectSolicitud.datosEmpresa.ruc,
                    ubigeo: departamento.slice(departamento.length - 2, departamento.length) +  provincia.slice(provincia.length - 3, provincia.length) +  distrito.slice(distrito.length - 2, distrito.length)//'111'//
                },
                metadata: {
                    emailUsuario: 'lmvega@stefanini.com',
                    fecha: Date.now().toString(),
                    origen: 'OIM',
                    usuario: 'LMVEGA'
                }
            };
            return solicitud;
        }

        // Funciones privadas:
        function _validationSendDto(){
            return epsEmpresaFactory.validStepDatosEmpresa() &&
            epsEmpresaFactory.validStepInformacionEmpresa() &&
            epsEmpresaFactory.validStepInformacionTrabajadores() &&
            epsEmpresaFactory.validStepInformacionAdicional()
        }

        function _findControlObject(controlCode) {
            return !angular.isUndefined(vm.formService) && _.find(vm.formService.Controls, function (item) { return item.Code === controlCode });
        }

        function _validationForm() {
            $scope.frmInformacionAdicional.markAsPristine();
            return vm.informacionAdicional &&
                    vm.informacionAdicional.maternidad &&
                    (vm.informacionAdicional.maternidad === 'false' || (vm.informacionAdicional.maternidad === 'true' && vm.informacionAdicional.maternidadCantidad != '' && +vm.informacionAdicional.maternidadCantidad > 0)) &&
                    vm.informacionAdicional.oncologico &&
                    (vm.informacionAdicional.oncologico === 'false' || (vm.informacionAdicional.oncologico === 'true' && vm.informacionAdicional.oncologicoCantidad != '' && +vm.informacionAdicional.oncologicoCantidad > 0)) &&
                    vm.informacionAdicional.continuidad &&
                    (vm.informacionAdicional.continuidad === 'false' || (vm.informacionAdicional.continuidad === 'true' && vm.informacionAdicional.continuidadCantidad != '' && +vm.informacionAdicional.continuidadCantidad > 0))
        }

        function _goStepFinal() {
            $state.go(constantsEpsEmpresa.ROUTES.REGISTRAR_SOLICITUD_STEPS, { step: constantsEpsEmpresa.STEPS.INFORMACION_FINAL });
        }

        function _grabarCotizacionContratante() {
            if (epsEmpresaFactory.validStepInformacionAdicional() && _validationForm()) {
                epsEmpresaFactory.setCompleteStep(constantsEpsEmpresa.STEPS.INFORMACION_ADICIONAL);
                _goStepFinal();
            }
        }

        function _mostrarErrorInterno() {
            return $state.go(constantsEpsEmpresa.ROUTES.ERROR_INTERNO, {}, { reload: true, inherit: false });
        }

        function _mostrarErrorValidaciones() {
            return $state.go(constantsEpsEmpresa.ROUTES.VALIDACION, {}, { reload: true, inherit: false });
        }

        function _regresarPasoUno() {
            return $state.go(constantsEpsEmpresa.ROUTES.REGISTRAR_SOLICITUD_STEPS, { step: 1 }, { reload: true, inherit: false });
        }
    }
});