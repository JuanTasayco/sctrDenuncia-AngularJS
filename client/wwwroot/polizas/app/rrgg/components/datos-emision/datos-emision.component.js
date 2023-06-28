define([
  'angular', 'constantsRiesgosGenerales'
], function (ng, constantsRiesgosGenerales) {
  datosEmisionController.$inject = ['mModalAlert', 'riesgosGeneralesService', 'riesgosGeneralesFactory', 'mainServices', 'mModalConfirm', 'riesgosGeneralesCommonFactory'];
  function datosEmisionController(mModalAlert, riesgosGeneralesService, riesgosGeneralesFactory, mainServices, mModalConfirm, riesgosGeneralesCommonFactory) {
    var vm = this;
    vm.validControlForm = ValidControlForm;
    vm.addEndosatario = AddEndosatario;
    vm.AddItemUbicacion = AddItemUbicacion;
    vm.GetHrefDescargarFormato = GetHrefDescargarFormato;
    vm.cambioTipoDocumento = CambioTipoDocumento;
    vm.changeSucriptor = changeSucriptor;
    vm.noEndosatario = noEndosatario;
    vm.validbyProducto = validbyProducto;
    vm.validateDateHasta = validateDateHasta;
    vm.validInputPlatDesh = validInputPlatDesh;
    vm.validInputPlatComer = validInputPlatComer;
    vm.$onInit = function () {
      vm.constantsRrgg = constantsRiesgosGenerales;
      riesgosGeneralesFactory.setCotizacionProducto(vm.cotizacion);
      vm.format = constants.formats.dateFormat;
      vm.emision = riesgosGeneralesFactory.cotizacion.emision;
      vm.endosatario = riesgosGeneralesFactory.getSourceNumeroEndosatario();
      vm.disabledhasta = vm.tramite.Grupo === vm.constantsRrgg.GRUPO.TREC ? true : false;

      vm.cargaPlanilla = [
        {
          name: "Planilla trabajadores",
          optionRadio: vm.tramite.ResCotizacion.Ingresatrabajadores,
          typefile: 1,
          labelAdd: "Agregar Trabajador",
          nameDownload: constantsRiesgosGenerales.ARCHIVOS.PLANTILLA_EXCEL_TRABAJADORES,
          listaTrabajador: []
        },
        {
          name: "Planilla Ubicaciones",
          optionRadio: vm.tramite.ResCotizacion.MasUbicaciones,
          typefile: 2,
          labelAdd: "Agregar Ubicación",
          nameDownload: constantsRiesgosGenerales.ARCHIVOS.PLANILLA_EXCEL_UBI_VIGLIMP,
          listaUbicaciones: [{ Direccion: vm.tramite.ResCotizacion.Ubicacion, Orden: 1 }]
        }
      ]
      //asignamos el tipo de planilla que queremos usan en el producto
      if (vm.tramite.Grupo === vm.constantsRrgg.GRUPO.TRAB_ESPECIFICOS) {
        vm.cargaPlanilla = vm.cargaPlanilla.filter(function (item) { return item.typefile === 1 })
      }
      vm.emision.modelo = {
        AdicionarEndosatario: 0,
        Pais: "PE",
        endosatarios: vm.tramite.Grupo === vm.constantsRrgg.GRUPO.CAR
          || vm.tramite.Grupo === vm.constantsRrgg.GRUPO.CARLITE
          || vm.tramite.Grupo === vm.constantsRrgg.GRUPO.TRANSPORTE ? [{ item: "" }] : [],
        planillaTrabajadores: 0,
        planillaUbicaciones: 0,
        listaUbicaciones: [{ item: 1 }],
        tramite: vm.tramite,
        file: { fileName: "" },
        listaPlanillas: vm.cargaPlanilla,
        Moneda: vm.tramite.Moneda,
        fechaDesdeTemporal : setFechaDesde(vm.tramite.ResCotizacion),
        FechaDesde: setFechaDesde(vm.tramite.ResCotizacion),
        FechaHasta: setFechaHasta(vm.tramite.ResCotizacion, "")
      }
      vm.validadores = {
        minStartDate: new Date(),
        minStartDateFormat: riesgosGeneralesFactory.formatearFecha(new Date())
      }
      riesgosGeneralesService.getProxyPametros(0, vm.constantsRrgg.PARAMETROS.FORMA_PAGO)
        .then(function (response) {
          vm.formaPago = response.Data;
          if (vm.tramite.Grupo === vm.constantsRrgg.GRUPO.VIGLIMP) {
            vm.emision.modelo.FormaPago = { Codigo: 'S0186' }
          }
        });
      riesgosGeneralesService.getProxyPametros(0, vm.constantsRrgg.PARAMETROS.TIPO_DOC)
        .then(function (response) {
          vm.tipoDocumento = response.Data;
        });
      riesgosGeneralesService.getProxyPametros(4, vm.constantsRrgg.PARAMETROS.TIPO_PROY)
        .then(function (response) {
          vm.tipoProyecto = response.Data;
        });
      riesgosGeneralesService.getProxyPametros(0, vm.constantsRrgg.PARAMETROS.TIP_DOC_TREC)
        .then(function (response) {
          vm.tipoDocumentoTrec = response.Data;
        });
      riesgosGeneralesService.getProxyPametros(vm.tramite.IdProducto, vm.constantsRrgg.PARAMETROS.CLAS_EQUIPOS)
        .then(function (response) {
          vm.tipoEquipos = response.Data;
        });
      riesgosGeneralesService.getProxyPametros(vm.tramite.IdProducto, vm.constantsRrgg.PARAMETROS.LIST_EMBALAJE)
        .then(function (response) {
          vm.embalaje = response.Data;
        });
      riesgosGeneralesService.getProxyPametros(vm.tramite.IdProducto, vm.constantsRrgg.PARAMETROS.TIP_TRANS)
        .then(function (response) {
          vm.tipoTransporte = response.Data;
        });
      riesgosGeneralesService.getProxyPametros(vm.tramite.IdProducto, vm.constantsRrgg.PARAMETROS.MAT_ASE)
        .then(function (response) {
          vm.materiaAsegurada = response.Data;
        });
      riesgosGeneralesService.getProxyPametros(vm.tramite.IdProducto, vm.constantsRrgg.PARAMETROS.VAL_MER)
        .then(function (response) {
          vm.valuacionMer = response.Data.filter(function (data) { return data.Valor === vm.tramite.ResCotizacion.Ramo.ValorRamo });
        });
      riesgosGeneralesService.getProxyPametros(vm.tramite.IdProducto, vm.constantsRrgg.PARAMETROS.TIP_SUC)
        .then(function (response) {
          vm.TipSucripcion = response.Data;
        });
      riesgosGeneralesService.getCurrencyType(false)
        .then(function (response) {
          vm.monedas = response.Data;
        })
      riesgosGeneralesService.getProxyPametros(0, vm.constantsRrgg.PARAMETROS.DEPARTAMENTO)
        .then(function (response) {
          vm.departamentos = response.Data;
        });
    };
    function ValidControlForm(controlName) {
      return vm.form && riesgosGeneralesFactory.validControlForm(vm.form, controlName);
    }
    function AddEndosatario($selected) {
      var cantEndosatarios = vm.emision.modelo.endosatarios.length;
      var defultAsegurado = {
        item: ''
      };
      if (cantEndosatarios < $selected.Valor) {
        for (var index = (cantEndosatarios + 1); index <= $selected.Valor; index++) {
          vm.emision.modelo.endosatarios.push(angular.copy(angular.extend({ index: index }, defultAsegurado)))
        }
      } else {
        vm.emision.modelo.endosatarios = vm.emision.modelo.endosatarios.slice(0, $selected.Valor);
      }
    }
    function AddItemUbicacion() {
      var defultAsegurado = { item: '' };
      vm.emision.modelo.listaUbicaciones.push(angular.copy(angular.extend(defultAsegurado)))
    }
    function GetHrefDescargarFormato() {
      return constantsRiesgosGenerales.ARCHIVOS.PLANTILLA_EXCEL_TRABAJADORES;
    }
    function CambioTipoDocumento(endosa) {
      if (angular.isUndefined(endosa.TipDocumento)) {
        return;
      } else {
        _setValidadores(endosa)
        endosa.NroDocumento = '';
        endosa.ValorEndoso = '';
        vm.emision.NroDocumento = ''
      }
    }
    function _setValidadores(endosa) {
      if (!!endosa.TipDocumento.Valor) {
        var numDocValidations = {};
        mainServices.documentNumber.fnFieldsValidated(numDocValidations, endosa.TipDocumento.Valor, 1);
        endosa.maxNumeroDoc = numDocValidations.DOCUMENT_NUMBER_MAX_LENGTH;
        endosa.minNumeroDoc = numDocValidations.DOCUMENT_NUMBER_MIN_LENGTH;
        vm.maxNumeroDoc = numDocValidations.DOCUMENT_NUMBER_MAX_LENGTH;
        vm.minNumeroDoc = numDocValidations.DOCUMENT_NUMBER_MIN_LENGTH;
      }
    }
    function noEndosatario() {
      vm.emision.modelo.endosatarios = [];
      vm.emision.modelo.NumEndosatario = {
        Valor: null
      }
    }
    function validbyProducto(item1, item2, item3, item4) {
      var array = [item1, item2, item3, item4]
      return array.find(function (element) { if (vm.tramite.Grupo === element) return element })
    }
    function setFechaDesde(data) {
      var fechaDesde = "";
      if (vm.tramite.Grupo === vm.constantsRrgg.GRUPO.TREC || vm.tramite.Grupo === vm.constantsRrgg.GRUPO.HIDROCARBURO) {
        fechaDesde = new Date();
      }
      if (vm.tramite.Grupo === vm.constantsRrgg.GRUPO.TRAB_ESPECIFICOS) {
        fechaDesde = new Date(data.FechaDesde)
      }
      if (vm.tramite.Grupo === vm.constantsRrgg.GRUPO.CARLITE || vm.tramite.Grupo === vm.constantsRrgg.GRUPO.CAR
        || vm.tramite.Grupo === vm.constantsRrgg.GRUPO.VIGLIMP
        || vm.tramite.Grupo === vm.constantsRrgg.GRUPO.TRANSPORTE) {
        fechaDesde = new Date(data.DuracionDesde)
      }
      if (vm.tramite.Grupo === vm.constantsRrgg.GRUPO.EVENTOS) {
        fechaDesde = new Date(data.FechaEventoDesde);
      }
      if (vm.tramite.Grupo === vm.constantsRrgg.GRUPO.DEMOLICIONES) {
        fechaDesde = new Date(data.FechaDesde);
      }
      return fechaDesde;
    }
    function setFechaHasta(data, newFechaDesde) {
      var fechaHasta = "";
      var _newFechaDesde = newFechaDesde || new Date();
      var mFechaCotizacion = new Date(_newFechaDesde);
      if (vm.tramite.Grupo === vm.constantsRrgg.GRUPO.TREC) {
        fechaHasta = new Date(mFechaCotizacion.setDate(mFechaCotizacion.getDate() + parseInt(vm.tramite.Vigencia)));
        vm.disabledfDesde = false;
      }
      if (vm.tramite.Grupo === vm.constantsRrgg.GRUPO.TRAB_ESPECIFICOS) {
        // calculamos la diferencia de las fechas escogida en la coti, para poder sumar a la fecha escogida
        if (newFechaDesde) {
          var days = riesgosGeneralesCommonFactory.dayDiff(data.FechaDesde, data.FechaHasta);
          fechaHasta = new Date(mFechaCotizacion.setDate(mFechaCotizacion.getDate() + days));
        } else {
          fechaHasta = new Date(data.FechaHasta)
        }
        vm.disabledfDesde = true;
      }
      if (vm.tramite.Grupo === vm.constantsRrgg.GRUPO.HIDROCARBURO) {
        fechaHasta = new Date(mFechaCotizacion.setMonth(mFechaCotizacion.getMonth() + 12));
        vm.disabledfDesde = true;
      }
      if (vm.tramite.Grupo === vm.constantsRrgg.GRUPO.CARLITE || vm.tramite.Grupo === vm.constantsRrgg.GRUPO.CAR
        || vm.tramite.Grupo === vm.constantsRrgg.GRUPO.VIGLIMP
        || vm.tramite.Grupo === vm.constantsRrgg.GRUPO.TRANSPORTE) {
        fechaHasta = new Date(data.DuracionHasta);
        vm.disabledfDesde = true;
      }
      if (vm.tramite.Grupo === vm.constantsRrgg.GRUPO.EVENTOS) {
        fechaHasta = new Date(data.FechaEventoHasta);
        vm.disabledfDesde = true;
      }
      if (vm.tramite.Grupo === vm.constantsRrgg.GRUPO.DEMOLICIONES) {
        fechaHasta = new Date(data.FechaHasta);
        vm.disabledfDesde = true;
      }
      return fechaHasta;
    }
    function changeSucriptor() {
      //  TipoEmision  = 2; es el componente de suscriptor
      if (vm.tramite.Grupo === vm.constantsRrgg.GRUPO.TREC) {
        if (riesgosGeneralesCommonFactory.dayDiff(vm.validadores.minStartDate, vm.emision.modelo.FechaDesde) >= 30 && vm.emision.modelo.FechaDesde < setFechaDesde(vm.tramite.ResCotizacion, "")) {
          mModalConfirm.confirmInfo("SOLICITAR VoBo DE SUSCRIPCIÓN Y ADJUNTAR CARTA DE NO SINIESTRO.", "¿Desea continuar?")
            .then(function (response) {
              vm.tramite.TipoEmision = 2
            })
            .catch(function () {
              vm.emision.modelo.FechaDesde = vm.emision.modelo.fechaDesdeTemporal;
              nuevaFechaDesde = vm.emision.modelo.FechaDesde;
              vm.emision.modelo.FechaHasta = setFechaHasta(vm.tramite.ResCotizacion, nuevaFechaDesde)
            })
        }
        else {
          vm.emision.modelo.fechaDesdeTemporal = vm.emision.modelo.FechaDesde;
          nuevaFechaDesde = vm.emision.modelo.FechaDesde;
          vm.emision.modelo.FechaHasta = setFechaHasta(vm.tramite.ResCotizacion, nuevaFechaDesde)
        }
      }
      else if (vm.emision.modelo.FechaDesde < setFechaDesde(vm.tramite.ResCotizacion, "")) {
        vm.tramite.TipoEmision = 2;
      }
      else {
        vm.emision.modelo.fechaDesdeTemporal = vm.emision.modelo.FechaDesde;
        nuevaFechaDesde = vm.emision.modelo.FechaDesde;
        vm.emision.modelo.FechaHasta = setFechaHasta(vm.tramite.ResCotizacion, nuevaFechaDesde)
      }
    }
    function validateDateHasta() {
      if (vm.tramite.Grupo === vm.constantsRrgg.GRUPO.TREC) {
        mModalAlert.showWarning("- La fecha final de vigencia no debe coincidir con la fecha de inicio de vigencia. <br>" +
          "- La Vigencia no debe ser mayor a la ingresada en el Cotizador al inicio.", "MAPFRE: Fecha no válida").then(function (rs) {
            var newFechaDesde = vm.emision.modelo.FechaDesde;
            vm.emision.modelo.FechaHasta = setFechaHasta(vm.tramite.ResCotizacion, newFechaDesde);
          })
      }
    }
    function validInputPlatDesh() {
      var valid = false;
      if ((vm.tramite.Grupo === vm.constantsRrgg.GRUPO.TRAB_ESPECIFICOS || vm.tramite.Grupo === vm.constantsRrgg.GRUPO.VIGLIMP)
        && (vm.tramite.ResCotizacion.Ramo.Codigo === vm.constantsRrgg.RAMO.DESHONESTIDAD
          || vm.tramite.ResCotizacion.Ramo.Codigo === vm.constantsRrgg.RAMO.RESPON_CIVILL_DESHONESTIDAD)) {
        valid = true;
      }
      return valid;
    }
    function validInputPlatComer() {
      var valid = true;
      if (vm.tramite.ResCotizacion.Ramo.Codigo === vm.constantsRrgg.RAMO.DESHONESTIDAD) {
        valid = false;
      }
      return valid;
    }
  } // end controller
  return ng.module('appRrgg')
    .controller('datosEmisionController', datosEmisionController)
    .component('datosEmision', {
      templateUrl: '/polizas/app/rrgg/components/datos-emision/datos-emision.component.html',
      controller: 'datosEmisionController',
      bindings: {
        cotizacion: '=',
        tramite: '=',
        form: "=?form"
      }
    })
});
