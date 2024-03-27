define([
  'angular', 'constants', 'constantsRiesgosGenerales', 'locales', 'vehiculos', 'rrggModalProductParameter'
], function (ng, constants, constantsRiesgosGenerales) {
  hidrocarburoController.$inject = ['$scope','mModalAlert', 'riesgosGeneralesService', 'riesgosGeneralesFactory', 'riesgosGeneralesCommonFactory', '$uibModal', 'oimAbstractFactory'];
  function hidrocarburoController($scope,mModalAlert, riesgosGeneralesService, riesgosGeneralesFactory, riesgosGeneralesCommonFactory, $uibModal, oimAbstractFactory) {
    var vm = this;
    vm.producto = {};
    // Funciones
    vm.validControlForm = ValidControlForm;
    vm.addDatos = AddDatos;
    vm.listCoberturas = listCoberturas
    vm.calcularPrimas = calcularPrimas
    vm.currencyType = currencyType
    vm.validateEquipoOrLocal = validateEquipoOrLocal
    vm.OpenParametros = OpenParametros
    vm.validateDescuentos = validateDescuentos
    vm.isMydream = oimAbstractFactory.isMyDream();
    vm.tipAseguramiento = tipAseguramiento
    vm.cleanUit = cleanUit
    vm.validateDescuentosUnidades = validateDescuentosUnidades
    vm.validateUit = validateUit
    vm.limpiarsumaasegurada = limpiarSumaAsegurada
    vm.viewPanelAMT = viewPanelAMT

    vm.$onInit = function () {
      vm.constantsRrgg = constantsRiesgosGenerales;
      riesgosGeneralesFactory.setCotizacionProducto(vm.cotizacion);
      vm.producto = riesgosGeneralesFactory.cotizacion.producto;
      vm.locales = [{ Ubicacion: "",  Ubigeo: {
        mDepartamento: null,
        mProvincia: null,
        mDistrito: null
      }, }, { Ubicacion: "",  Ubigeo: {
        mDepartamento: null,
        mProvincia: null,
        mDistrito: null
      }, }]
      vm.producto.modelo = {
        listaUbicaciones: [],
        listaVehiculos: [],
        AseguraAdicional: 0,
        CantidadUit: ''
      }
      
      riesgosGeneralesService.getCurrencyType(false)
        .then(function (response) {
          vm.monedas = response.Data;
        })
      riesgosGeneralesService.getProxyPametros(vm.cotizacion.producto.CodigoRiesgoGeneral, vm.constantsRrgg.PARAMETROS.GIRO_NEGOCIO.COD).then(function (response) {
        vm.giroNegocio = response.Data;
        if (response.Data && response.Data.length) {
          setTipoAseguramiento(response.Data[0].Detalle);
        }
      })
      riesgosGeneralesService.getProxyPametros(vm.cotizacion.producto.CodigoRiesgoGeneral, vm.constantsRrgg.PARAMETROS.CLAS_EQUIPOS)
        .then(function (response) {
          vm.clases = response.Data;
        });
      riesgosGeneralesService.getProxyPametros(0, vm.constantsRrgg.PARAMETROS.PARAM_GEN_SIMPLE)
        .then(function (response) {
          vm.producto.modelo.ValorUit = response.Data[0].Valor;
        });

      riesgosGeneralesService.getProxyPametros(vm.cotizacion.producto.CodigoRiesgoGeneral, constantsRiesgosGenerales.PARAMETROS.MAXIMO_LOCAL_VEHICULO)
        .then(function (response) {
          vm.maximoLocal = response.Data.find(function (element) { return element.Codigo === "S1183" }).Valor;
          vm.maximoVehiculo = response.Data.find(function (element) { return element.Codigo === "S1184" }).Valor;
        });

      if (riesgosGeneralesFactory.getEditarCotizacion()) {
        vm.producto.modelo = vm.cotizacion.form;
        vm.producto.modelo.listaUbicaciones = vm.cotizacion.form.listaUbicaciones || []

        vm.producto.modelo.listaUbicaciones.forEach(function(item){
          item.Ubigeo = {
            mDepartamento : {Codigo:item.Departamento.Codigo},
            mProvincia : {Codigo:item.Provincia.Codigo},
            mDistrito : {Codigo:item.Distrito.Codigo},
          };
        });

        vm.producto.modelo.listaVehiculos = vm.cotizacion.form.listaVehiculos || []
        if (vm.producto.modelo.IsVehiculoOrLocal === vm.constantsRrgg.DATOS.VEHICULOS) {
          vm.producto.modelo.CantidadElementos = vm.producto.modelo.listaVehiculos.length;
        }
        vm.producto.modelo.DescuentoDirector = vm.cotizacion.form.DescuentoDirector ? vm.cotizacion.form.DescuentoDirector.toString() : '';
        validateEquipoOrLocal(vm.cotizacion.form.Giro)
        vm.producto.Cobertura = vm.cotizacion.form.Cobertura
        if (vm.producto.modelo.Cobertura.Codigo === vm.constantsRrgg.COBERTURAS.RC_AMT) {
          vm.listCoberturas(vm.producto.modelo.Moneda)
          vm.producto.modelo.SumaAseguradaAMT = {
            Dato: vm.cotizacion.form.SumaAseguradaAMT
          }
          vm.producto.modelo.NroVehiculosAmt = vm.cotizacion.form.NroUnidadesAMT;
          vm.producto.modelo.PrimaNetaAmt = vm.cotizacion.form.PrimaNetaAMT;
          vm.producto.modelo.PrimaTotalAmt = vm.cotizacion.form.PrimaTotalAMT;
        }
        calcularPrimas();
      }
    };

    // INFO: Hardcode to setTipoAseguramiento
    function setTipoAseguramiento(data) {
      vm.tipoAseguramiento = data.filter(function (element) { return element.Tipo.Codigo === vm.constantsRrgg.PARAMETROS.GIRO_NEGOCIO.VALUE_REGISTER && element.Estado.trim() === "1" })
      if (vm.tipoAseguramiento.length) {
        vm.producto.modelo.TipoAseguramiento = vm.tipoAseguramiento[0];
        tipAseguramiento(vm.producto.modelo.TipoAseguramiento);
      }
    }

    function currencyType(moneda) {
      return riesgosGeneralesFactory.currencyType(moneda)
    }
    function ValidControlForm(controlName) {
      return vm.form && riesgosGeneralesFactory.validControlForm(vm.form, controlName);
    }

    function limpiarSumaAsegurada() {
      vm.producto.modelo.CantidadUit = null;
      vm.producto.modelo.tasa = null;
      vm.producto.modelo.SumaAseguradaSoles = null;
      vm.producto.modelo.SumaAseguradaDolares = null;
      vm.producto.modelo.PrimaNeta = null;
      vm.producto.modelo.PrimaTotal = null;
    }

    function listCoberturas(value) {
      var moneda = parseInt(value.Codigo)
      riesgosGeneralesService.tablaParametrobyProducto(vm.cotizacion.producto.CodigoRiesgoGeneral, vm.constantsRrgg.PARAMETROS.COBER_SUMAS_A, 0).then(function (response) {
        if (response.OperationCode === constants.operationCode.success) {
          var coberturas = response.Data.filter(function (item) { return item.Grupo === "Cobertura" && item.Moneda === 2 });
          //DOLARES
          if (moneda === 2) {
            vm.sumaAseguradaAMT = coberturas;
          } else {
            //SOLES
            coberturas.forEach(function (element) {
              element.Dato = parseFloat(element.Dato) * parseFloat(vm.cotizacion.tipoCambio);
            });
            vm.sumaAseguradaAMT = coberturas
          }
        }
      })
    }
    function tipAseguramiento(value) {
      if (value.Codigo === vm.constantsRrgg.TIP_ASEGURAMIENTO.GLOBAL) {
        if (vm.producto.modelo.IsVehiculoOrLocal === vm.constantsRrgg.DATOS.LOCALES) {
          vm.producto.modelo.listaUbicaciones.forEach(function (element) { element.Uit = "" });
        }
        if (vm.producto.modelo.IsVehiculoOrLocal === vm.constantsRrgg.DATOS.VEHICULOS) {
          vm.producto.modelo.listaVehiculos.forEach(function (element) { element.Uit = "" });
          
        }
      }
    }
    function validateEquipoOrLocal(giro) {
      var grupo = giro.Valor || giro.ValorGiro;
      if (grupo === vm.constantsRrgg.PARAMETROS.GIRO_NEGOCIO.GRUPO.A ||
        grupo === vm.constantsRrgg.PARAMETROS.GIRO_NEGOCIO.GRUPO.B ||
        grupo === vm.constantsRrgg.PARAMETROS.GIRO_NEGOCIO.GRUPO.C ||
        grupo === vm.constantsRrgg.PARAMETROS.GIRO_NEGOCIO.GRUPO.E) {
        vm.producto.modelo.IsVehiculoOrLocal = vm.constantsRrgg.DATOS.LOCALES
        if (vm.producto.modelo.CantidadElementos)
          vm.producto.modelo.listaVehiculos = [];
          vm.addDatos(vm.producto.modelo.CantidadElementos, vm.constantsRrgg.DATOS.LOCALES)
      } else {
        vm.producto.modelo.IsVehiculoOrLocal = vm.constantsRrgg.DATOS.VEHICULOS
        if (vm.producto.modelo.CantidadElementos)
          vm.producto.modelo.listaUbicaciones = [];
          vm.addDatos(vm.producto.modelo.CantidadElementos, vm.constantsRrgg.DATOS.VEHICULOS)
      }
    }
    function AddDatos(nroItem, tipo) {
      var cantDatos;
      if (tipo === vm.constantsRrgg.DATOS.LOCALES) {
        cantDatos = vm.producto.modelo.listaUbicaciones ? vm.producto.modelo.listaUbicaciones.length : 0;
      }
      if (tipo === vm.constantsRrgg.DATOS.VEHICULOS) {
        cantDatos = vm.producto.modelo.listaVehiculos ? vm.producto.modelo.listaVehiculos.length : 0;
      }
      var defultAsegurado = {
        item: ''
      };
      if (cantDatos < nroItem) {

        if (tipo === vm.constantsRrgg.DATOS.VEHICULOS) {
          if (vm.maximoVehiculo < nroItem){
            mModalAlert.showWarning("Máximo de vehiculos permitidos es: " + vm.maximoVehiculo , "¡Alerta!")
            vm.producto.modelo.CantidadElementos = '';
            AddDatos(0, tipo);
            return;
          }
        }else if (tipo === vm.constantsRrgg.DATOS.LOCALES) {
            if (vm.maximoVehiculo < nroItem){
              mModalAlert.showWarning("Máximo de locales permitidos es: " + vm.maximoLocal , "¡Alerta!")
              vm.producto.modelo.CantidadElementos = '';
              AddDatos(0, tipo);
              return;
            }
        }

        for (var index = (cantDatos + 1); index <= nroItem; index++) {
          if (tipo === vm.constantsRrgg.DATOS.LOCALES) {
            vm.producto.modelo.listaUbicaciones.push(angular.copy(angular.extend({ Orden: index }, defultAsegurado)))
          }
          if (tipo === vm.constantsRrgg.DATOS.VEHICULOS) {
            vm.producto.modelo.listaVehiculos.push(angular.copy(angular.extend({ Orden: index }, defultAsegurado)))
          }
        }


      } else {
        if (tipo === vm.constantsRrgg.DATOS.LOCALES)
          vm.producto.modelo.listaUbicaciones = vm.producto.modelo.listaUbicaciones.slice(0, nroItem);
        if (tipo === vm.constantsRrgg.DATOS.VEHICULOS)
          vm.producto.modelo.listaVehiculos = vm.producto.modelo.listaVehiculos.slice(0, nroItem);
      }
    }
    function cleanUit() {
      if (vm.producto.modelo.CantidadUit) {
        vm.producto.modelo.CantidadUit = ""
      }
    }
    function calcularPrimas() {
      if (_validateForm()) {
        riesgosGeneralesService.primas(riesgosGeneralesFactory.getModelPrimas()).then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            vm.producto.modelo.SumaAseguradaSoles = response.Data.SumaAseguradaSoles
            vm.producto.modelo.SumaAseguradaDolares = response.Data.SumaAseguradaDolares
            vm.producto.modelo.PrimaNeta = response.Data.PrimaNeta
            vm.producto.modelo.PrimaTotal = response.Data.PrimaTotal
            vm.producto.modelo.PrimaNetaAmt = response.Data.amtTransporte.PrimaNeta
            vm.producto.modelo.PrimaTotalAmt = response.Data.amtTransporte.PrimaTotal
            vm.producto.modelo.NroVehiculosAmt = response.Data.amtTransporte.NroVehiculos
            vm.producto.modelo.NumeroUnidades = response.Data.NumeroUnidades
            vm.producto.modelo.CodTipoAseguramiento = response.Data.CodTipoAseguramiento
            vm.producto.modelo.CantidadUitCalculada = response.Data.CantidadUit
            vm.producto.modelo.tasa = response.Data.Tasa;
            if (!riesgosGeneralesFactory.getEditarCotizacion()) {
              validateDescuentosUnidades();
            }
            if (!vm.producto.modelo.PrimaNeta || !vm.producto.modelo.PrimaTotal) {
              mModalAlert.showWarning("Se excedió el monto de la suma asegurada", "¡Alerta!").then(function (rs) {
              })
            }
          } else {
            vm.producto.modelo.PrimaNeta = "",
              vm.producto.modelo.PrimaTotal = "",
              mModalAlert.showWarning(response.Message, "¡Alerta!").then(function (rs) {
              })
          }
        })
      }
    }
    function OpenParametros() {
      var vModalSendEmail = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        windowClass: "g-modal-size",
        template: '<rrgg-modal-product-parameter cotizacion="cotizacion"  title="title" close="close()"></rrgg-modal-product-parameter>',
        controller: ['$scope', '$uibModalInstance', '$uibModal', function ($scope, $uibModalInstance, $uibModal) {
          $scope.title = constantsRiesgosGenerales.PROD_TITLE.HIDROCARBURO;
          $scope.cotizacion = vm.cotizacion;
          $scope.close = function () {
            $uibModalInstance.close();
          };
        }]
      });
      vModalSendEmail.result.then(function () {
      }, function () {
      });
    }
    function validateDescuentos() {
      if (vm.producto.modelo.IsVehiculoOrLocal === vm.constantsRrgg.DATOS.LOCALES) {
        vm.cleanUit();
        var paramData = {
          CodigoRiesgoGeneral: vm.cotizacion.producto.CodigoRiesgoGeneral,
          Giro: vm.producto.modelo.Giro,
          CantidadElementos: vm.producto.modelo.CantidadElementos,
          DescuentoDirector: vm.producto.modelo.DescuentoDirector,
          type: "C"
        }
        riesgosGeneralesCommonFactory.validateDescuentosHDR(paramData)
      }
    }
    function validateDescuentosUnidades() {
      if (vm.producto.modelo.NumeroUnidades) {
        if (vm.producto.modelo.IsVehiculoOrLocal === vm.constantsRrgg.DATOS.VEHICULOS) {
          var paramData = {
            CodigoRiesgoGeneral: vm.cotizacion.producto.CodigoRiesgoGeneral,
            Giro: vm.producto.modelo.Giro,
            CantidadElementos: vm.producto.modelo.NumeroUnidades,
            DescuentoDirector: vm.producto.modelo.DescuentoDirector,
            type: "C"
          }
          riesgosGeneralesCommonFactory.validateDescuentosHDR(paramData)
        }
      }
    }
    function _validateForm() {
      vm.form.markAsPristine();
      return vm.form.$valid;
    }
    function validateUit () {
      var paramData = {
        CodigoRiesgoGeneral: vm.cotizacion.producto.CodigoRiesgoGeneral,
        CantidadUit: vm.producto.modelo.CantidadUit,
        ValorUit: vm.producto.modelo.ValorUit,
        moneda: vm.producto.modelo.Moneda,
        type: "C"
      }
      riesgosGeneralesCommonFactory.validateMontoMaximoHidro(paramData)
    }

    function viewPanelAMT() {
      var cobertura = vm.producto && vm.producto.Cobertura && vm.producto.Cobertura.Codigo;
      var modelo = vm.producto && vm.producto.modelo && vm.producto.modelo.IsVehiculoOrLocal;
      return cobertura === vm.constantsRrgg.COBERTURAS.RC_AMT && modelo === vm.constantsRrgg.DATOS.VEHICULOS;
    }
  } // end controller
  return ng.module('appRrgg')
    .controller('hidrocarburoController', hidrocarburoController)
    .component('hidrocarburo', {
      templateUrl: '/polizas/app/rrgg/components/hidrocarburo/hidrocarburo.component.html',
      controller: 'hidrocarburoController',
      bindings: {
        cotizacion: '=',
        form: '=?form'
      }
    })
});
