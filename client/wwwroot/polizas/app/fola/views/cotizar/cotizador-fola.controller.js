define(['angular', 'constants', 'constantsFola'], function (angular, constants, constantsFola) {
'use strict';

  angular
    .module(constants.module.polizas.fola.moduleName)
    .controller('cotizadorFolaController', CotizadorFolaController);

  CotizadorFolaController.$inject = [
    '$state',
    'oimClaims',
    'mainServices',
    'mModalAlert',
    'mpSpin',
    'folaService',
    'oimPrincipal',
    'proxyAgente'
  ];

  function CotizadorFolaController(
    $state,
    oimClaims,
    mainServices,
    mModalAlert,
    mpSpin,
    folaService,
    oimPrincipal,
    proxyAgente
  ) {
    var vm = this;

    // Variables locales
    vm.enableControlName = true;
    vm.emptyRuc = false;
    vm.formFola = {};
    vm.tiposFraccionamiento = [];
    vm.dataFraccionamiento = [];
    vm.ocupaciones = [];
    vm.planes = [];
    vm.riesgo = {};
    vm.riesgos = [];
    vm.isAdmin = oimPrincipal.isAdmin(); 
    vm.isProfileBroker = oimClaims.userType == constants.typeLogin.broker.type;
    vm.format = constants.formats.dateFormat;
    vm.contratante = {
      tipoDocumento: constants.documentTypes.ruc.Codigo
    };
    var numDocValidations = {};
    var fechaActual = new Date();
    mainServices.documentNumber.fnFieldsValidated(numDocValidations, vm.contratante.tipoDocumento, 1);
    vm.validadores = {
      minStartDate: fechaActual,
      minEndDate: mainServices.fnSubtractDays(mainServices.date.fnAdd(fechaActual, 1, 'M'), 1),
      maxEndDate: mainServices.fnSubtractDays(mainServices.date.fnAdd(fechaActual, 1, 'Y'), 1),
      maxNumeroDoc: numDocValidations.DOCUMENT_NUMBER_MAX_LENGTH,
      minNumeroDoc: numDocValidations.DOCUMENT_NUMBER_MIN_LENGTH,
      typeNumeroDoc: numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE,
      typeNumeroDocDisabled: numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE_DISABLED
    };
    vm.formService = constantsFola.VALIDATORS.CONTRATANTE;

    // Funciones:
    vm.saveAgent = SaveAgent;
    vm.checkRequired = CheckRequired;
    vm.desactivarControl = DesactivarControl;
    vm.validarFormCotizacion = ValidarFormCotizacion;
    vm.agregarRiesgo = AgregarRiesgo;
    vm.eliminarRiesgo = EliminarRiesgo;
    vm.buscarContratante = BuscarContratante;
    vm.getValidations = GetValidations;
    vm.onFechaInicioChanged = FechaInicioChanged;
    vm.onFechaFinChanged = FechaFinChanged;
    vm.formatearFecha = FormatearFecha;
    vm.findAgent = FindAgent;
    (function load_CotizadorFolaController() {
      _loadAgente();
      _loadListFraccionamiento();
      _loadListOcupaciones();
      _loadFechas();
      vm.riesgos.push({});
    })();

    function FindAgent(data) {
      return proxyAgente.GetListAgenteSalud({
        "CodigoNombre": data, 
        "CodigoGestor": oimClaims.gestorId,
        "CodigoOficina": vm.isAdmin ? '0' : oimClaims.officeCode, 
        "RolUsuario": oimPrincipal.get_role()
      });
    }
    function FechaInicioChanged() {
      if(vm.fechaInicio){
        vm.validadores.minEndDate =  mainServices.fnSubtractDays(mainServices.date.fnAdd(vm.fechaInicio, 1, 'M'), 1);
        vm.validadores.maxEndDate =  mainServices.fnSubtractDays(mainServices.date.fnAdd(vm.fechaInicio, 1, 'Y'), 1);
        vm.fechaFin = vm.validadores.maxEndDate;
        setDataFracionamiento();
      }

    }
    function FechaFinChanged() {
      if(vm.fechaFin){
        if(vm.fechaFin >= vm.validadores.minEndDate && vm.fechaFin <= vm.validadores.maxEndDate){
          setDataFracionamiento();
        }else{
          vm.fechaFin = null;
        }
      }
    }
    function setDataFracionamiento(){
      var months = mainServices.date.fnDiff(vm.fechaInicio, mainServices.date.fnAdd(vm.fechaFin,1,'D'), 'M');
      var data = [];
      if(months >= 1 ){
        data.push(getDataFracPago(constantsFola.parametros.codFracMensual));
      }
      if(months % 3 === 0 && months != 3){
        data.push(getDataFracPago(constantsFola.parametros.codFracTrimestral));
      }
      if(months % 6 === 0 && months != 6){
        data.push(getDataFracPago(constantsFola.parametros.codFracSemestral));
      }
      data.push(getDataFracPago(constantsFola.parametros.codFracContado));
      vm.tiposFraccionamiento = data;
    }
    function getDataFracPago(codFrac){
      var frac = null;
      vm.dataFraccionamiento.forEach(function(item){
        if(item.primerValor == codFrac){
          frac = item;
        }
      })
      return frac;
    }
    function FormatearFecha(fecha) {
      if (fecha instanceof Date) {
        var today = fecha;
        var dd = today.getDate();
        var mm = today.getMonth() + 1;

        var yyyy = today.getFullYear();
        return (today = ('0' + dd).substr(-2) + '/' + ('0' + mm).substr(-2) + '/' + yyyy);
      }
      return fecha;
    }
    function DesactivarControl() {
      return vm.enableControl;
    }
    function AgregarRiesgo() {
      vm.riesgos.push({});
    }
    function EliminarRiesgo(index) {
      if (vm.riesgos.length == 1) {
        vm.riesgos = [{}];
      } else {
        vm.riesgos.splice(index, 1);
      }
    }
    function ValidarFormCotizacion() {
      vm.formFola.markAsPristine();
      var wasNull = false;
      var errors = [];
      // console.log(vm.riesgos);
      for (var i in vm.riesgos) {
        if(vm.riesgos[i].cantidad == 0){
          errors.push('Grupo '+ (parseInt(i)+1) + ': la cantidad debe ser mayor de 0');
        }
        if(vm.riesgos[i].subvencion == 0){
          errors.push('Grupo '+ (parseInt(i)+1) + ': la subvención debe ser mayor de 0');
        }
        if (vm.riesgos[i].cantidad == null || vm.riesgos[i].cantidad == 0 || vm.riesgos[i].ocupacion == null || vm.riesgos[i].subvencion == null || vm.riesgos[i].subvencion == 0)
          wasNull = true;
      }
      if (
        vm.agente.codigoAgente != null &&
        vm.fechaInicio != null &&
        vm.fechaFin != null &&
        vm.contratante.numeroDocumento != null &&
        vm.contratante.nombreCompleto != null &&
        vm.fraccionamientoPago.primerValor != null
      ) {
        if (!wasNull) {
          _saveCotizacion();
        } else {
          if(errors.length>0){
            mModalAlert.showWarning(errors.join(','), 'ALERTA');
          }else{
            mModalAlert.showWarning('Los campos del asegurado son obligatorios', 'ALERTA');
          }
        }
      }
    }
    function SaveAgent(agente) {
      vm.agente.codigoNombre = agente.codigoNombre;
      vm.agente.codigoAgente = agente.codigoAgente;
    }

    function CheckRequired(controlCode) {
      var controlObject = _findControlObject(controlCode);
      if (controlObject) {
        var findRequired = _.find(controlObject.Validations, function (item) {
          return item.Type === 'REQUIRED';
        });
        return findRequired ? true : false;
      }
      return false;
    }
    function GetValidations(controlCode) {
      var findControl = _findControlObject(controlCode);
      return findControl ? findControl.Validations : {};
    }
    function BuscarContratante() {
      vm.emptyRuc =
        vm.contratante.numeroDocumento && vm.contratante.numeroDocumento.substring(0, 2) != constantsFola.EMPTY_RUC_20;
      if (vm.emptyRuc) {
        vm.contratante.nombreCompleto = null;
        vm.enableControlName = false;
        return false;
      }
      if (
        getValidParametrosBuscarPersona(
          vm.contratante.numeroDocumento,
          vm.validadores
        )
      ) {
        _loadContratanteInfo();
      }
    }
    function getValidParametrosBuscarPersona(numeroDocumento, validadores) {
      var documento = numeroDocumento || '';
      return (
        !!documento &&
        !!validadores &&
        (documento.length === validadores.maxNumeroDoc ||
          (documento.length <= validadores.maxNumeroDoc && documento.length >= validadores.minNumeroDoc))
      );
    }
    function irAEmisionPoliza(numeroDocumento){
      $state.go('emisorFola.steps', {
        docuemntoId: numeroDocumento
      },{reload: true, inherit: false});
      // $state.go(constantsFola.ROUTES.RESUMEN_FOLA_EMISION, {
      //   documentoId: numeroDocumento,
      //   cotizar: true
      // });
    }

    // utils
    function _loadAgente(){
      vm.agente = {
        codigoNombre: oimPrincipal.getAgent().codigoAgente+' - '+oimPrincipal.getAgent().codigoNombre,
        codigoAgente: oimPrincipal.getAgent().codigoAgente
      };
    }
    function _saveCotizacion() {

      var cotizacionRequest = {
        poliza: {
          fechaInicio: vm.fechaInicio,
          fechaFin: vm.fechaFin,
          codigoAgente: vm.agente.codigoAgente,
          nombreAgente: vm.agente.codigoNombre,
          codigoFraccionamiento: vm.fraccionamientoPago.primerValor,
          nombreFraccionamiento: vm.fraccionamientoPago.segundoValor
        },
        contratante: {
          tipoDocumento: vm.contratante.tipoDocumento,
          numeroDocumento: vm.contratante.numeroDocumento,
          nombre: vm.contratante.nombreCompleto
        },
        riesgos: vm.riesgos.map(function (riesgo, i) {
          return {
            grupo: i + 1,
            cantidad: riesgo.cantidad,
            codigoOcupacion: riesgo.ocupacion.codigo,
            ocupacion: riesgo.ocupacion.nombre,
            subvencion: riesgo.subvencion
          };
        }),
      };
      folaService
        .guardarCotizacion(cotizacionRequest)
        .then(function (response) {
          mModalAlert.showSuccess('Información guardada correctamente.', 'MENSAJE', null, 3000);
          $state.go(
            'emisionFola.steps', 
            { documentoId: response.data.numeroDocumento, step: 1 },
            {reload: true, inherit: false}
          );
          // irAEmisionPoliza(response.data.numeroDocumento);
          
        })
        .catch(function (error) {
          if (error.data) {
            if (error.data.errores) {
              if (error.data.errores.length > 0) {
                mModalAlert.showError(error.data.errores[0], '¡ERROR!');
                return;
              }
            }
          }
          mModalAlert.showError('No se pudo guardar la información.', '¡ERROR!');
        });
    }

    function _loadFechas(){
      vm.fechaInicio = vm.validadores.minStartDate;
      vm.fechaFin = vm.validadores.maxEndDate;
    }
    function _findControlObject(controlCode) {
      return (
        !angular.isUndefined(vm.formService) &&
        _.find(vm.formService.Controls, function (item) {
          return item.Code === controlCode;
        })
      );
    }
    function _loadListOcupaciones() {
      folaService
        .getListOcupaciones()
        .then(function (response) {
          vm.ocupaciones = response.data;
        })
        .catch(function (error) {
          $state.go('errorInternoFola',{}, { reload: true, inherit: false });
          console.log('Error en getOcupaciones: ' + error);
        });
    }

    function _loadListFraccionamiento() {
      folaService
        .getParametrosFraccionamiento(constantsFola.code, constantsFola.parametros.codFraccionamiento)
        .then(function (response) {
          vm.tiposFraccionamiento = response.data;
          vm.dataFraccionamiento = response.data;
        })
        .catch(function (error) {
          $state.go('errorInternoFola',{}, { reload: true, inherit: false });
          console.log('Error en getFraccionamientos: ' + error);
        });
    }
    function _loadContratanteInfo() {
      mpSpin.start();
      folaService
        .getDatosPersona(vm.contratante.tipoDocumento, vm.contratante.numeroDocumento)
        .then(function (response) {
          if (response.OperationCode === 200) {
            vm.enableControlName = true;
            vm.contratante.nombreCompleto = (
              response.Data.Nombre +
              ' ' +
              response.Data.ApellidoPaterno +
              ' ' +
              response.Data.ApellidoMaterno
            ).trim();
          } else {
            vm.contratante.nombreCompleto = null;
            vm.enableControlName = false;
          }
          mpSpin.end();
        })
        .catch(function (error) {
          mpSpin.end();
          console.log('Error en getPerson: ' + error);
        });
    }
  }
});