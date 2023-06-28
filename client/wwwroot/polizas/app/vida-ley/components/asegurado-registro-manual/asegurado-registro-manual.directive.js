define([
  'angular', 'lodash','constants', 'constantsVidaLey', 'mpfPersonDirective'
], function (angular, _, constants, constantsVidaLey) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .directive('mpfAseguradoRegistroManualVidaLey', AseguradoRegistroManualVidaLeyDirective);

  AseguradoRegistroManualVidaLeyDirective.$inject = [];

  function AseguradoRegistroManualVidaLeyDirective() {
    var directive = {
      require: '^ngModel',
      controller: AseguradoRegistroManualVidaLeyDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/vida-ley/components/asegurado-registro-manual/asegurado-registro-manual.template.html',
      scope: {
        riesgo: '=ngModel',
        actualizacion: '=update',
        disabled: '=?ngDisabled'
      }
    };
    return directive;
  }

  AseguradoRegistroManualVidaLeyDirectiveController.$inject = ['$scope', '$timeout', 'mainServices', 'mModalAlert', 'mpSpin', 'vidaLeyService', 'vidaLeyFactory', 'vidaLeyGeneralFactory'];
  function AseguradoRegistroManualVidaLeyDirectiveController($scope, $timeout, mainServices, mModalAlert, mpSpin, vidaLeyService, vidaLeyFactory, vidaLeyGeneralFactory) {
    var vm = this;

    vm.riesgo = {};
    vm.cotizacion = {};
    vm.changeTrabajadores = ChangeTrabajadores;
    vm.totalTrabajadoresCompletos = TotalTrabajadoresCompletos;
    vm.getNameControl = GetNameControl;
    vm.validControlForm = ValidControlForm;
    vm.validMenorEdad = ValidMenorEdad;
    vm.desactivarControl = DesactivarControl;
    vm.buscarAsegurado = BuscarAsegurado;
    vm.cambioTipoDocumento = CambioTipoDocumento;
    vm.calcularTotalPlanilla = CalcularTotalPlanilla;
    vm.obtenerCobertura = ObtenerCobertura;
    vm.activeBotonObtenerCobertura = ActiveBotonObtenerCobertura;
    vm.getValidations = GetValidations;
    vm.checkRequired = CheckRequired;
    vm.disabledNombreCompleto = DisabledNombreCompleto;
    vm.disabledDatos = DisabledDatos;

    vm.dataSourceNumeroTrabajadores = [];
    vm.adultDate = (void 0);
    vm.tiposDocumento = [];
    vm.tiposRiego = [];
    vm.formService = constantsVidaLey.VALIDATORS.ASEGURADO;
   
    (function load_AseguradoRegistroManualVidaLeyDirectiveController() {
      vm.dataSourceNumeroTrabajadores = vidaLeyFactory.getSourceNumeroAsegurados();
      vm.cotizacion = vidaLeyFactory.cotizacion;
      vm.adultDate = vidaLeyFactory.getFechaMaximaAdulto();
      vm.riesgo = $scope.riesgo;
      vm.actualizacion = false;
      if (vm.cotizacion && vm.cotizacion.codEstado === 'AC' && vm.cotizacion.McaMasivo != 'S') {       
        
        vm.riesgo = vidaLeyFactory.FormatRiegoManual()[0];
        vm.riesgo.tipo = 1;
        $timeout(function () {
          vm.obtenerCobertura();
        }, 500);
        $scope.disabled = false;
      }else if (vm.cotizacion && vm.cotizacion.codEstado === 'AC' && vm.cotizacion.McaMasivo == 'S'){
        vm.riesgo = vidaLeyFactory.agregarRiesgoAC();
        $scope.disabled = false;
        vm.riesgo.tipo = 1;
      }

      if(vm.actualizacion){
        vm.cargaManualTemplate = '/polizas/app/vida-ley/components/asegurado-registro-manual/asegurado-registro-manual.update.html';
      }else {
        vm.cargaManualTemplate = '/polizas/app/vida-ley/components/asegurado-registro-manual/asegurado-registro-manual.inicial.html';
      }

      _loadDocumentTypes();
      _loadTypeRiesgo();
    })();

    function ChangeTrabajadores($selected) {
      vm.riesgo.numeroTrabajadores = $selected && $selected.Valor || 0;
      vm.numeroTrabajadoresAC = $selected && $selected.Valor || 0;
      vm.riesgo.coberturas = [];
      _fillTrabajadores();
    }

    function TotalTrabajadoresCompletos() {
      return vidaLeyFactory.getTotalCompletadoAseguradosRiesgo(vm.riesgo);
    }

    function CambioTipoDocumento(asegurado, tipoDocumento) {
      vm.riesgo.coberturas = [];
      if (angular.isUndefined(tipoDocumento)) {
        _resetAsegurado(asegurado, true, true);
      } else {
        asegurado.tipoDocumento = tipoDocumento.Codigo;
        _setValidadores(asegurado, asegurado.tipoDocumento)
        _resetAsegurado(asegurado, false, true);
      }
    }

    function CalcularTotalPlanilla() {
      var asegurados = (vm.riesgo && vm.riesgo.asegurados) || [];
      vm.riesgo.montoTrabajadoresReal = asegurados.reduce(function (importe, asegurado) { return importe + parseInt(asegurado.sueldo, 10); }, 0) || 0;
    }

    function ObtenerCobertura() {
      if(vm.cotizacion.codEstado === 'AC') {
        vidaLeyFactory.cotizacion.McaMasivo = 'N';
      }
      vm.riesgo.coberturas = [];
      vm.riesgo.riesgos = [];
      if (_validationForm()) {        
        if (!!vm.riesgo.modelo.mCategoria && !!vm.riesgo.modelo.mCategoria.CodCategoria) {
          cargarData();
        } else {
          mModalAlert.showWarning("No ha seleccionado la categoría", "Observación")
        }        
      }
    }

    function cargarData(){
      vidaLeyService.cargarAseguradoXRiesgo(null,vidaLeyFactory.getParametrosAseguradosIndividual(vm.riesgo))
      .then(function (response) {
        if (response.data.TipoRespuesta !== 'ERROR') {
          if (response.data.Errores.length) {
            var vError = vidaLeyGeneralFactory.getHtmlTablaError(response.data.Errores, true, true);
            mModalAlert.showWarning(vError, "LISTA DE OBSERVACIONES RENIEC");
          }
          vidaLeyFactory.setNumMovimientoCarga(response.data.Data, vm.riesgo);
            response.data.Data.CargaAsegurado.RiesgoDTO.forEach(function (riesgoDTO) {
              vidaLeyService.getListCoberturas(riesgoDTO.NumTrabajadores).then(function (response) {
                var coberturas =vidaLeyFactory.getCoberturas(response)
                vm.riesgo.coberturas.push(coberturas);
                riesgoDTO.coberturas = coberturas;
                var cob = coberturas.filter(function (cobertura) {
                  return cobertura.flag === 2;
                });
                riesgoDTO.codPlan = cob[0].CodPlan;
              });
            })
            vm.riesgo.riesgos = response.data.Data;
        } else {
          var vError = vidaLeyGeneralFactory.getHtmlTablaError(response.data.Errores, true);
          mModalAlert.showError(vError, 'DATOS DE LA PLANILLA ERRONEOS');
        }
        if (vm.cotizacion && vm.cotizacion.codEstado === 'AC' && vm.cotizacion.McaMasivo != 'S') {    
          vidaLeyFactory.cotizacion.riesgos = [vm.riesgo]
        }
      })
      .catch(function (error) {
        var msg = (error.data && (error.data.Data && error.data.Data.Message || error.data.Message) || 'Error no controlado');
        mModalAlert.showError(msg, "¡Error!")
      });
    }

    function BuscarAsegurado(asegurado) {
      _resetAsegurado(asegurado, false, false);
      if (vidaLeyFactory.getValidParametrosBuscarPersona(asegurado.tipoDocumento, asegurado.numeroDocumento, asegurado.validadores)) {
        _loadAseguradoInfo(asegurado);
      }
    }

    function DesactivarControl(asegurado) {
      return $scope.disabled || (asegurado && asegurado.modelo.mTipoDocumento && asegurado.modelo.mTipoDocumento.Codigo == null);
    }

    function GetNameControl(name, index) {
      return 'n' + name + index;
    }

    function ValidControlForm(form, name, index) {
      var control = _getControl(form, name, index);
      return control && control.$error.required && !control.$pristine;
    }

    function ValidMenorEdad(form, name, index) {
      var control = _getControl(form, name, index);
      return control && !control.$error.required && control.$error.maxDate && !control.$pristine;
    }

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

    function ActiveBotonObtenerCobertura() {
      if (vm.cotizacion && vm.cotizacion.codEstado === 'AC' && vm.cotizacion.McaMasivo != 'S') {
        return true;
      }
      return vm.riesgo.numeroTrabajadores > 0 && vm.riesgo.numeroTrabajadores === vm.totalTrabajadoresCompletos()
    }

    function DisabledNombreCompleto(asegurado) {
      return $scope.disabled || !!(asegurado && (!!asegurado.nombres || !!asegurado.apellidoPaterno || !!asegurado.apellidoMaterno) );
    }

    function DisabledDatos(asegurado) {
      return $scope.disabled || !!(asegurado && !!asegurado.nombresCompleto);
    }

    function _getControl(form, name, index) {
      var controlName = vm.getNameControl(name, index);
      return form[controlName];
    }

    function _findControlObject(controlCode) {
      return !angular.isUndefined(vm.formService) && _.find(vm.formService.Controls, function (item) { return item.Code === controlCode });
    }

    function _resetAsegurado(asegurado, cleanTipo, cleanNumero) {
      if (cleanTipo) {
        asegurado.modelo.mTipoDocumento = (void 0)
        asegurado.tipoDocumento = '';
      }
      if (cleanNumero) asegurado.numeroDocumento = '';
      asegurado.nombres = '';
      asegurado.apellidoPaterno = '';
      asegurado.apellidoMaterno = '';
      asegurado.nombresCompleto = '';
      asegurado.fechaNacimiento = '';
      asegurado.ocupacion = '';
      asegurado.sueldo = (void 0);
      asegurado.modelo.mFechaNacimiento = (void 0)
    }

    function _setValidadores(asegurado, tipoDocumento) {
      if (!!tipoDocumento) {
        var numDocValidations = {};
        mainServices.documentNumber.fnFieldsValidated(numDocValidations, tipoDocumento, 1);
        asegurado.validadores.maxNumeroDoc = numDocValidations.DOCUMENT_NUMBER_MAX_LENGTH;
        asegurado.validadores.minNumeroDoc = numDocValidations.DOCUMENT_NUMBER_MIN_LENGTH;
        asegurado.validadores.typeNumeroDoc = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE;
        asegurado.validadores.typeNumeroDocDisabled = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE_DISABLED;
      }
    }

    function _fillTrabajadores() {
      var defultAsegurado = {
        tipoDocumento: '',
        numeroDocumento: '',
        nombres: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        nombresCompleto: '',
        fechaNacimiento: '',
        ocupacion: '',
        sueldo: (void 0),
        modelo: {},
        validadores: {
          maxNumeroDoc: 0,
          minNumeroDoc: 0,
          typeNumeroDoc: 'onlyNumber',
          typeNumeroDocDisabled: true
        }
      };
      var cantAsegurados = vm.riesgo.asegurados.length;
      if (cantAsegurados < vm.riesgo.numeroTrabajadores) {
        for (var index = (cantAsegurados + 1); index <= vm.riesgo.numeroTrabajadores; index++) {
          vm.riesgo.asegurados.push(angular.copy(angular.extend({ index: index }, defultAsegurado)))
        }
      } else {
        vm.riesgo.asegurados = vm.riesgo.asegurados.slice(0, vm.riesgo.numeroTrabajadores);
      }
      
      
    }

    function _loadDocumentTypes() {
      vidaLeyService.getDocumentTypes().then(function (response) { vm.tiposDocumento = response.Data; });
    }
    function _loadTypeRiesgo() {
      vidaLeyService.getProxyTypeRiesgo().then(function (response) {
        vm.tiposRiego = response
      });
    }

    function _loadAseguradoInfo(asegurado) {
      mpSpin.start();
      vidaLeyService.getDatosPersonaEquifax(asegurado.tipoDocumento, asegurado.numeroDocumento)
        .then(function (response) {
          if(response.OperationCode === constants.operationCode.success) {
            var splitedDate = response.Data.FechaNacimiento.split("/");
            asegurado.nombres = response.Data.Nombre;
            asegurado.apellidoPaterno = response.Data.ApellidoPaterno;
            asegurado.apellidoMaterno = response.Data.ApellidoMaterno;
            asegurado.modelo.mFechaNacimiento = new Date(splitedDate[2], splitedDate[1] - 1, splitedDate[0]);
            asegurado.fechaNacimiento = response.Data.FechaNacimiento;
            asegurado.nombresCompleto = '';
          }
          else {
            _resetAsegurado(asegurado, false, false)
          }
          mpSpin.end();
        })
        .catch(function (error) {
          mpSpin.end();
        });
    }

    function _validationForm() {
      if (vm.cotizacion && vm.cotizacion.codEstado === 'AC' && vm.cotizacion.McaMasivo != 'S') {
        return true;
      }
      $scope.frmDatos.markAsPristine();
      return $scope.frmDatos.$valid;
    }


  }

});
