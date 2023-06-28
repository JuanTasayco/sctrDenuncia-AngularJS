define([
    'angular', 'lodash', 'constants', 'constantsEpsEmpresa', 'mpfPersonDirective', 'mpfModalConfirmationSteps'
  ], function (angular, _, constants, constantsEpsEmpresa) {
    'use strict';

    angular
    .module(constants.module.polizas.epsEmpresa.moduleName)
    .controller('cotizacionInformacionTrabajadoresEpsEmpresaController', CotizacionInformacionTrabajadoresEpsEmpresaController);

    CotizacionInformacionTrabajadoresEpsEmpresaController.$inject = ['$scope', '$state', 'mpSpin', 'epsEmpresaFactory'];

    function CotizacionInformacionTrabajadoresEpsEmpresaController($scope, $state, mpSpin, epsEmpresaFactory) {
        var vm = this;

        //Variables
        vm.informacionTrabajadores = {};
        vm.composicion_grupo = {};
        vm.rango_etario = {};
        vm.firma_cargo = {};
        vm.sum_rangos = 0;
        vm.sum_grupos = 0;
        vm.calculo_grupos = 0;
        vm.rangoTitularMas3WithValue = false;
        vm.formService = constantsEpsEmpresa.VALIDATORS.INFORMACION_TRABAJADORES;

        // Funciones:
        vm.getValidations = GetValidations;
        vm.cambioPagoFirmaCargo = CambioPagoFirmaCargo;
        vm.calcularNroTrabajadores = CalcularNroTrabajadores;
        vm.sumaRangoEtario = SumaRangoEtario;
        vm.sumaComposicionGrupo = SumaComposicionGrupo;
        vm.activeBotonSiguiente = ActiveBotonSiguiente;
        vm.goToNextStep = GoToNextStep;
        vm.stepDisabled = StepDisabled;

        (function load_CotizacionInformacionEpsEmpresaController() {
            mpSpin.start();
            vm.informacionTrabajadores = epsEmpresaFactory.cotizacion.informacionTrabajadores;
            _LoadParameters().then(_LoadTarifas().then(function(){ 
                vm.firma_cargo = epsEmpresaFactory.getParametro("PAGO_PRIMA"); mpSpin.end(); 
            }));
            var steps = document.getElementById('stepsSolicitud');
            steps.classList.remove("disabled-steps");
            mpSpin.end();
        })();

        function CambioPagoFirmaCargo(seleccion) {
            if (angular.isUndefined(seleccion)) {
              vm.informacionTrabajadores.mpagoFirmaCargo = void(0);
              vm.informacionTrabajadores.pagoFirmaCargo = '';
              return;
            }else{
              vm.informacionTrabajadores.pagoFirmaCargo = seleccion.valorNumerico;
            }
        }

        function GetValidations(controlCode) {
            var findControl = _findControlObject(controlCode);
            return findControl ? findControl.Validations : {};
        }

        function CalcularNroTrabajadores(){
            if(_isUndefinedOrNullOrEmpty(vm.informacionTrabajadores.nroOperarios) || _isUndefinedOrNullOrEmpty(vm.informacionTrabajadores.nroAdministrativos)){
                vm.informacionTrabajadores.nroTrabajadoresPlanilla = 0;
            }
            else{
                vm.informacionTrabajadores.nroTrabajadoresPlanilla = +vm.informacionTrabajadores.nroOperarios + +vm.informacionTrabajadores.nroAdministrativos
            }
        }

        function SumaRangoEtario(){
            var rangos = vm.informacionTrabajadores.rangosEtarios;
            var result = 0;
            rangos.forEach(function(element) {
                if(element){
                    result += +element.cantidad;
                }
            });
            vm.sum_rangos = result;
            CalculoGrupos();
        }

        function SumaComposicionGrupo(){
            var result = 0;
            vm.composicion_grupo.forEach(function(element) {
                if(!_isUndefinedOrNullOrEmptyOrZero(vm.informacionTrabajadores[_getNgModelNameVariable('titularMas', +element.valorNumerico - 1)])){
                    if(element.valorNumerico) {
                        result += +vm.informacionTrabajadores[_getNgModelNameVariable('titularMas', +element.valorNumerico -1)];
                    }
                }
            });
            vm.sum_grupos = result;
            CalculoGrupos();
        }



        function CalculoGrupos(){
            var resultCalculoGrupo = 0;
            vm.composicion_grupo.forEach(function(element) {
                if(!_isUndefinedOrNullOrEmptyOrZero(vm.informacionTrabajadores[_getNgModelNameVariable('titularMas', +element.valorNumerico - 1)])){
                    if(element.valorNumerico) {
                        resultCalculoGrupo += (+vm.informacionTrabajadores[_getNgModelNameVariable('titularMas', +element.valorNumerico - 1)] * +element.valorNumerico);
                    }
                }
                if(element.valorNumerico === 4 && !_isUndefinedOrNullOrEmptyOrZero(vm.informacionTrabajadores[_getNgModelNameVariable('titularMas', +element.valorNumerico - 1)]) && +vm.informacionTrabajadores[_getNgModelNameVariable('titularMas', +element.valorNumerico - 1)] > 0){
                    vm.rangoTitularMas3WithValue = true;
                }else{
                    vm.rangoTitularMas3WithValue = false;
                }
            });
            vm.calculo_grupos = resultCalculoGrupo;
        }

        function ActiveBotonSiguiente(){
            return epsEmpresaFactory.validStepInformacionTrabajadores() && _validationForm();
        }
        
        function GoToNextStep() {
            if (vm.stepDisabled()) {
                _goStepInformacionAdicional();
                return;
            }
      
            if (epsEmpresaFactory.validStepInformacionTrabajadores() && _validationForm()) {
                _grabarCotizacionContratante();
            } 
            else {
                mModalAlert.showWarning('Obeservación', 'Debe llenar todos los datos obligatorios.');
            }
        }

        function StepDisabled() {
            return epsEmpresaFactory.getCompleteStep(constantsEpsEmpresa.STEPS.INFORMACION_TRABAJADORES);
        }

        // Funciones privadas:
        function _isUndefinedOrNullOrEmptyOrZero(value) {
            return value === null || value === undefined || value === '' || value === 0 || value === '0';
        }

        function _isUndefinedOrNullOrEmpty(value) {
            return value === null || value === undefined || value === '';
        }

        function _getNgModelNameVariable(constant, variable){
            return constant + variable
        }

        function _findControlObject(controlCode) {
            return !angular.isUndefined(vm.formService) && _.find(vm.formService.Controls, function (item) { return item.Code === controlCode });
        }

        function _validationForm() {
            $scope.frmInformacionTrabajadores.markAsPristine();
            return vm.informacionTrabajadores &&
                    vm.informacionTrabajadores.nroTrabajadoresPlanilla &&
                    vm.informacionTrabajadores.nroTrabajadoresPlanilla > 0 &&
                    vm.sum_rangos > 0 &&
                    vm.sum_grupos > 0 &&
                    vm.calculo_grupos > 0 &&
                    vm.sum_grupos == ((vm.informacionTrabajadores.nroTrabajadoresPlanilla === '' || vm.informacionTrabajadores.nroTrabajadoresPlanilla === undefined) ? 0 : vm.informacionTrabajadores.nroTrabajadoresPlanilla) &&
                    !((vm.sum_rangos < vm.calculo_grupos) || (!vm.rangoTitularMas3WithValue && vm.sum_rangos > vm.calculo_grupos)) &&
                    !_isUndefinedOrNullOrEmptyOrZero(vm.informacionTrabajadores.pagoFirmaCargo) &&
                    $scope.frmInformacionTrabajadores.$valid;
        }

        function _goStepInformacionAdicional() {
            $state.go(constantsEpsEmpresa.ROUTES.REGISTRAR_SOLICITUD_STEPS, { step: constantsEpsEmpresa.STEPS.INFORMACION_ADICIONAL });
        }

        function _grabarCotizacionContratante() {
            if (epsEmpresaFactory.validStepInformacionTrabajadores() && _validationForm()) {
                epsEmpresaFactory.setCompleteStep(constantsEpsEmpresa.STEPS.INFORMACION_TRABAJADORES);
                _goStepInformacionAdicional();
            }
        }

        function _LoadParameters(){
            return new Promise (function(resolve){
                vm.composicion_grupo = epsEmpresaFactory.getParametro("COMPOSICION_GRUPO");
                vm.composicion_grupo.forEach(function(element) {
                    if(element.valorNumerico) {
                        if(!epsEmpresaFactory.cotizacion.step[3]){
                            if(!vm.informacionTrabajadores[_getNgModelNameVariable('titularMas', +element.valorNumerico-1)]){
                                vm.informacionTrabajadores[_getNgModelNameVariable('titularMas', +element.valorNumerico-1)] = 0;
                            }
                            else{
                                vm.sumaComposicionGrupo();    
                            }
                        }
                        else{
                            vm.sumaComposicionGrupo();
                        }
                    }
                });
                vm.composicion_grupo = vm.composicion_grupo.sort(function(a,b){ return a['orden'] - b['orden']} );
                
                resolve();
            });
        }

        function _LoadTarifas(){
            return new Promise (function(resolve){
                vm.rango_etario = epsEmpresaFactory.getTarifas();
                var rangos = [];
                vm.rango_etario.forEach(function(element) {
                    if(element.nombre) 
                        rangos.push({
                            nombre : element.nombre,
                            desde: element.desde,
                            hasta: element.hasta,
                            cantidad: 0,
                            tarifa: element.tarifa
                        })
                });

                if(!epsEmpresaFactory.cotizacion.step[3]){
                    if(!vm.informacionTrabajadores.rangosEtarios){
                        vm.informacionTrabajadores.rangosEtarios = rangos;
                    }
                    else{
                        vm.sumaRangoEtario();    
                    }
                }
                else{
                    vm.sumaRangoEtario();
                }
                
                //$scope.$apply();
                resolve();
            });
        }
    }
});