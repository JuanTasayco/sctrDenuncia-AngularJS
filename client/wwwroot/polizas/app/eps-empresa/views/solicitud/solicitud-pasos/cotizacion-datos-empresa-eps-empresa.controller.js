define([
    'angular', 'lodash', 'constants', 'constantsEpsEmpresa', 'mpfPersonDirective', 'mpfModalConfirmationSteps'
  ], function (angular, _, constants, constantsEpsEmpresa) {
    'use strict';

    angular
    .module(constants.module.polizas.epsEmpresa.moduleName)
    .controller('cotizacionDatosEmpresaEpsEmpresaController', CotizacionDatosEmpresaEpsEmpresaController);

    CotizacionDatosEmpresaEpsEmpresaController.$inject = ['$scope', '$state', 'mainServices', 'epsEmpresaFactory', 'epsEmpresaService'];

    function CotizacionDatosEmpresaEpsEmpresaController($scope, $state, mainServices, epsEmpresaFactory, epsEmpresaService) {
        var vm = this;
        
        //Variables:
        vm.mensajeSinRazonSocial = false;
        vm.mensajeErrorRazonSocial = false;
        vm.datosEmpresa = {};
        vm.departamentos = {};
        vm.provincias = {};
        vm.distritos = {};
        vm.validadores = {
          maxNumeroDoc: 0,
          minNumeroDoc: 0,
          typeNumeroDoc: 'onlyNumber',
          typeNumeroDocDisabled: true
        }
        vm.formService = constantsEpsEmpresa.VALIDATORS.DATOS_EMPRESA;

        // Funciones:
        vm.checkRequired = CheckRequired;
        vm.getValidations = GetValidations;
        vm.buscarRazonSocial = BuscarRazonSocial;
        vm.activeBotonSiguiente = ActiveBotonSiguiente;
        vm.stepDisabled = StepDisabled;
        vm.showModalConfirmation = ShowModalConfirmation;
        vm.cambioDepartamento = CambioDepartamento;
        vm.cambioProvincia = CambioProvincia;
        vm.cambioDistrito = CambioDistrito;

        (function load_CotizacionDatosEmpresaEpsEmpresaController() {
          vm.datosEmpresa = epsEmpresaFactory.cotizacion.datosEmpresa;
          vm.departamentos = epsEmpresaFactory.getDepartamentos();
          vm.provincias = epsEmpresaFactory.getProvincias();
          vm.distritos = epsEmpresaFactory.getDistritos();
          _setValidadores("RUC");
          epsEmpresaService.getListDepartamentos().then(function (response) { 
            epsEmpresaFactory.setDepartamentos(response.Data).then(vm.departamentos = epsEmpresaFactory.getDepartamentos());
          });
          var steps = document.getElementById('stepsSolicitud');
          steps.classList.remove("disabled-steps");
        })();

        function GetValidations(controlCode) {
          var findControl = _findControlObject(controlCode);
          return findControl ? findControl.Validations : {};
        }

        function CheckRequired(controlCode) {
          var controlObject = _findControlObject(controlCode)
          if (controlObject) {
            var findRequired = _.find(controlObject.Validations, function(item) { return item.Type === 'REQUIRED' });
            return findRequired ? true : false;
          }
          return false;
        }

        function BuscarRazonSocial() {
          if (epsEmpresaFactory.getValidParametrosBuscarPorRUC(vm.datosEmpresa.ruc, vm.validadores)) {
            _loadRazonSocialInfo();
          }
          else{
            _resetRucRazonsocial(false, true);
          }
        }

        function ActiveBotonSiguiente() {
          return epsEmpresaFactory.validStepDatosEmpresa() && _validationForm();
        }

        function StepDisabled() {
          return epsEmpresaFactory.getCompleteStep(constantsEpsEmpresa.STEPS.DATOS_EMPRESA)
        }

        function ShowModalConfirmation() {
          if (vm.stepDisabled()) {
            _goStepInformacionEmpresa();
            return;
          }
          _grabarCotizacionContratante();
        }

        function CambioDepartamento(seleccion) {
          if (angular.isUndefined(seleccion) || seleccion.Codigo === null) {
            vm.datosEmpresa.mDepartamento = void(0);
            vm.datosEmpresa.departamento = '';

            vm.datosEmpresa.mProvincia = void(0);
            vm.datosEmpresa.provincia = '';
            vm.provincias = {};
            return;
          }else{
            vm.datosEmpresa.departamento = seleccion.Codigo;
            epsEmpresaService.getListProvincias(seleccion.Codigo).then(function (response) {
              epsEmpresaFactory.setProvincias(response.Data).then(vm.provincias = epsEmpresaFactory.getProvincias());
              vm.datosEmpresa.mProvincia = void(0);
              vm.datosEmpresa.provincia = '';
              vm.distritos = {};
            });
          }
        }

        function CambioProvincia(seleccion){
          if (angular.isUndefined(seleccion) || seleccion === null || seleccion.Codigo === null) {
            vm.datosEmpresa.mProvincia = void(0);
            vm.datosEmpresa.provincia = '';

            vm.datosEmpresa.mDistrito = void(0);
            vm.datosEmpresa.distrito = '';
            vm.distritos = {};
            return;
          }else{
            vm.datosEmpresa.provincia = seleccion.Codigo;
            
            epsEmpresaService.getListDistritos(seleccion.Codigo).then(function (response) {
              epsEmpresaFactory.setDistritos(response.Data).then(vm.distritos = epsEmpresaFactory.getDistritos());
              vm.datosEmpresa.mDistrito = void(0);
              vm.datosEmpresa.distrito = '';
            });
            
          }
        }

        function CambioDistrito(seleccion){
          if (angular.isUndefined(seleccion) || seleccion === null) {
            vm.datosEmpresa.mDistrito = void(0);
            vm.datosEmpresa.distrito = '';
            return;
          }else{
            vm.datosEmpresa.distrito = seleccion.Codigo;
          }
        }

        // Funciones privadas:
        function _findControlObject(controlCode) {
          return !angular.isUndefined(vm.formService) && _.find(vm.formService.Controls, function (item) { return item.Code === controlCode });
        }

        function _setValidadores(tipoDocumento) {
          if (!!tipoDocumento) {
            var numDocValidations = {};
            mainServices.documentNumber.fnFieldsValidated(numDocValidations, tipoDocumento, 1);
            vm.validadores.maxNumeroDoc = numDocValidations.DOCUMENT_NUMBER_MAX_LENGTH;
            vm.validadores.minNumeroDoc = numDocValidations.DOCUMENT_NUMBER_MIN_LENGTH;
            vm.validadores.typeNumeroDoc = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE;
            vm.validadores.typeNumeroDocDisabled = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE_DISABLED;
          }
        }

        function _loadRazonSocialInfo() {
          epsEmpresaService.getEmpresaByRuc(vm.datosEmpresa.ruc)
          .then(function (response) {
              if(response.persona.respuesta === "1" ){
                vm.datosEmpresa.razonSocial = response.persona.nombres.trim();
                vm.mensajeSinRazonSocial = false;
                vm.mensajeErrorRazonSocial = false;
              } else {
                if(response.persona.respuesta === "2" ){
                  vm.mensajeErrorRazonSocial = false;
                  vm.mensajeSinRazonSocial = true;
                }
                _resetRucRazonsocial(false, true);
              }
            })
            .catch(function (error) {
              vm.mensajeSinRazonSocial = false;
              vm.mensajeErrorRazonSocial = true;
              _resetRucRazonsocial(false, true);
            });
        }

        function _resetRucRazonsocial(cleanRUC, cleanRazonSocial) {
          if (cleanRUC)
            vm.datosEmpresa.ruc = '';
          if (cleanRazonSocial) 
            vm.datosEmpresa.razonSocial = '';
        }

        function _validationForm() {
          $scope.frmDatosEmpresa.markAsPristine();
          return $scope.frmDatosEmpresa.$valid;
        }

        function _grabarCotizacionContratante() {
          if (epsEmpresaFactory.validStepDatosEmpresa() && _validationForm()) {
              epsEmpresaFactory.setCompleteStep(constantsEpsEmpresa.STEPS.DATOS_EMPRESA);
              _goStepInformacionEmpresa();
          }
        }
    
        function _goStepInformacionEmpresa() {
          $state.go(constantsEpsEmpresa.ROUTES.REGISTRAR_SOLICITUD_STEPS, { step: constantsEpsEmpresa.STEPS.INFORMACION_EMPRESA });
        }
    }
});

