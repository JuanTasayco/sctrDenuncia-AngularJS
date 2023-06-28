define([
  'angular', 'lodash', 'constants', 'constantsRiesgosGenerales', 'mpfModalConfirmationSteps', 'trabajosEspecificos',
  'trec', 'hidrocarburo', 'rrggCar', 'rrggVigLimpieza', 'transportes', 'eventos', 'demoliciones'
], function (angular, _, constants, constantsRiesgosGenerales) {
  'use strict';

  angular
    .module("appRrgg")
    .controller('cotizacionRrggStep1Controller', cotizacionRrggStep1Controller);

  cotizacionRrggStep1Controller.$inject = ['$scope', '$state', 'mainServices', 'mModalAlert', 'mpSpin', '$uibModal', 'riesgosGeneralesService', 'riesgosGeneralesFactory',
    '$filter'];

  function cotizacionRrggStep1Controller($scope, $state, mainServices, mModalAlert, mpSpin, $uibModal, riesgosGeneralesService, riesgosGeneralesFactory,
    $filter) {

    (function load_cotizacionRrggStep1Controller() {
      $scope.constantsRrgg = constantsRiesgosGenerales
      $scope.fnFilter = $filter("date");
      $scope.cotizacion = {};
      $scope.format = constants.formats.dateFormat;
      $scope.validadores = {
        minStartDate: new Date(),
        minStartDateFormat: riesgosGeneralesFactory.formatearFecha(new Date())
      }
      riesgosGeneralesService.getProxyProductos()
        .then(function (response) {
          $scope.productos = response.Data.filter(function (element) { return element.Habilitado === 1 })
        });
      $scope.cotizacion.fechaCotizacion = $scope.fnFilter(new Date(), constants.formats.dateFormat)
      riesgosGeneralesService.getProxyPametros(0, constantsRiesgosGenerales.PARAMETROS.TIP_CAMBIO)
        .then(function (response) {
          $scope.cotizacion.tipoCambio = response.Data[0].Valor;
        });
      if (riesgosGeneralesFactory.getEditarCotizacion()) {
        $scope.cotizacion = riesgosGeneralesFactory.cotizacion
        $scope.cotizacion.fechaCotizacion = $scope.fnFilter(new Date(), constants.formats.dateFormat)
        $scope.cotizacion.producto = {
          CodigoRiesgoGeneral: riesgosGeneralesFactory.cotizacion.form.CodigoRiesgoGeneral,
          Cobertura: riesgosGeneralesFactory.cotizacion.form.Cobertura
        }
        _listCoberturas(riesgosGeneralesFactory.cotizacion.form)
      }
    })();
    $scope.GoStepResumen = function () {
      if (_validateForm()) {
        var requestProducto = {}
        switch ($scope.cotizacion.producto.Grupo) {
          case constantsRiesgosGenerales.GRUPO.TRAB_ESPECIFICOS:
            requestProducto = riesgosGeneralesFactory.getModelTrabajosEspecificos();
            break;
          case constantsRiesgosGenerales.GRUPO.TREC:
            requestProducto = riesgosGeneralesFactory.getModelTrec();
            if ($scope.cotizacion.producto.modelo.TipoTrabajo.Estado === "99") {
              mModalAlert.showWarning("Tipo de trabajo fuera de parámetros del producto, para cotizar debe solicitar el VoBo de Suscripción", "MAPFRE");
              return
            }
            break;
          case constantsRiesgosGenerales.GRUPO.HIDROCARBURO:
            requestProducto = riesgosGeneralesFactory.getModelHidrocarburo();
            if (requestProducto.IsVehiculoOrLocal === constantsRiesgosGenerales.DATOS.VEHICULOS && !riesgosGeneralesFactory.ValidateVehiculosHidro()) {
              mModalAlert.showWarning("Para poder cotizar bajo este producto se debe declarar como mínimo un (1) Vehículo tracto y un (1) Semirrolque, Cisterna o carreta."+
              "<br> Caso contrario la cotización no será válida <br><br> Si se declararon como mínimo un remolcador y un semirrolque pero aún no permite cotizar, revisar si existe un error de escritura y volver a intentarlo"+
              "<br><br> NOTA: en caso la cisterna no requiera de un remolcador para ser halada porque esta acoplado a uno, escribir 2 en # de vehículos y declarar CISTERNA con todos los datos correspondientes y debajo poner CAMION dejando vacíos los datos de este último.", "Alerta!")
              return true;
            }
            break;
          case constantsRiesgosGenerales.GRUPO.CAR:
            requestProducto = riesgosGeneralesFactory.getModelCar();
            break;
          case constantsRiesgosGenerales.GRUPO.CARLITE:
            requestProducto = riesgosGeneralesFactory.getModelCar();
            break;
          case constantsRiesgosGenerales.GRUPO.VIGLIMP:
            requestProducto = riesgosGeneralesFactory.getModelVigLimp();
            break;
          case constantsRiesgosGenerales.GRUPO.DEMOLICIONES:
            requestProducto = riesgosGeneralesFactory.getModelDemoliciones();
            break;
          case constantsRiesgosGenerales.GRUPO.TRANSPORTE:
            requestProducto = riesgosGeneralesFactory.getModelTransporte();
            break;
          case constantsRiesgosGenerales.GRUPO.EVENTOS:
            requestProducto = riesgosGeneralesFactory.getModelEventos();
            break;
        }
        riesgosGeneralesService.cargaCotizacion(requestProducto, $scope.cotizacion.producto.Grupo).then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            riesgosGeneralesFactory.cotizacion.tramite = {
              NroTramite: response.Data.MessageResult,
              Grupo: $scope.cotizacion.producto.Grupo,
              IdProducto: $scope.cotizacion.producto.CodigoRiesgoGeneral
            }
            $state.go(constantsRiesgosGenerales.ROUTES.COTIZACION_STEPS, { step: constantsRiesgosGenerales.STEPS.RESULTADOS });
          } else {
            mModalAlert.showWarning(response.Data.MessageResult, "Alerta!")
          }
        }).catch(function (error) {
          mModalAlert.showError(error.Message, "¡Error!")
        });
      }
    }
    $scope.changeProducto = function (producto) {
      $scope.cotizacion.editar = false;
      $scope.cotizacion.producto.modelo = {};
      $scope.cotizacion.tramite = {};
      _listCoberturas(producto)
    }
    function _listCoberturas(producto) {
      if (producto.Grupo === constantsRiesgosGenerales.GRUPO.HIDROCARBURO)
        riesgosGeneralesService.getProxyPametros($scope.cotizacion.producto.CodigoRiesgoGeneral, constantsRiesgosGenerales.PARAMETROS.COBERTURAS)
          .then(function (response) {
            $scope.coberturas = response.Data;
          });
    }
    function _validateForm() {
      $scope.frmProductos.markAsPristine();
      return $scope.frmProductos.$valid;
    }

    $scope.disabledButton = function(){
      switch ($scope.cotizacion.producto.Grupo) {
        case constantsRiesgosGenerales.GRUPO.HIDROCARBURO:
            try {
                if(!$scope.frmProductos.CantUit.$viewValue || ($scope.frmProductos.CantUit.$viewValue == riesgosGeneralesFactory.getModelHidrocarburo().CantidadUitCalculada)){
                  return false;
                }else{
                  return true;
                }
              }catch(e) {
                return false
              }             
          break;
        default:
          return false;
      }
    }
  }
});
