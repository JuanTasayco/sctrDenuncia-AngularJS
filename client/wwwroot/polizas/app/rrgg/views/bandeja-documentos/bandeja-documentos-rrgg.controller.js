define([
  'angular', 'constants', 'constantsRiesgosGenerales'
], function (angular, constants, constantsRiesgosGenerales) {
  'use strict';

  angular
    .module("appRrgg")
    .controller('bandejaRiesgosGeneralesController', bandejaRiesgosGeneralesController);

  bandejaRiesgosGeneralesController.$inject = ['$state', '$scope', 'oimClaims', 'riesgosGeneralesService', 'riesgosGeneralesFactory', '$uibModal', 'mModalAlert', 'mModalConfirm'];

  function bandejaRiesgosGeneralesController($state, $scope, oimClaims, riesgosGeneralesService, riesgosGeneralesFactory, $uibModal, mModalAlert, mModalConfirm) {
    (function load_bandejaRiesgosGeneralesController() {
      $scope.constantsRrgg = constantsRiesgosGenerales;
      $scope.filter = {};
      $scope.filter.FechaDesde = new Date();
      $scope.filter.FechaHasta = new Date();
      $scope.pagination = {
        currentPage: 1,
        maxSize: 10,
        totalItems: 0,
        noSearch: true,
        noResult: false
      };
      $scope.constantsRrgg = constantsRiesgosGenerales
      $scope.format = constants.formats.dateFormat;
      $scope.validadores = {
        maxStartDate: new Date(),
      }
      riesgosGeneralesService.getProxyProductos()
        .then(function (response) {
          $scope.productos = response.Data
        });
      listCotizacion();
    })();
    $scope.filterCotizacion = function () {
      listCotizacion()
    }
    function listCotizacion() {
      var filterRequest = {
        NU_NRO_TRAMITE: $scope.filter.nroCotizacion,
        ASEGURADO: $scope.filter.asegurado,
        PRODUCTO: $scope.filter.producto ? $scope.filter.producto.CodigoRiesgoGeneral : null,
        DESDE: riesgosGeneralesFactory.cambiarFormatoDate($scope.filter.FechaDesde),
        HASTA: riesgosGeneralesFactory.cambiarFormatoDate($scope.filter.FechaHasta),
        NU_PAGINA: $scope.pagination.currentPage,
        NU_CANTIDAD: $scope.pagination.maxSize
      }
      $scope.pagination.noSearch = false;
      riesgosGeneralesService.filterCotizacion(filterRequest)
        .then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            response.Data.forEach(function (item) {
              if (item.GRUPO === $scope.constantsRrgg.GRUPO.TRAB_ESPECIFICOS
                || item.GRUPO === $scope.constantsRrgg.GRUPO.VIGLIMP
                || item.GRUPO === $scope.constantsRrgg.GRUPO.TRANSPORTE
                || item.GRUPO === $scope.constantsRrgg.GRUPO.EVENTOS) {
                item.Ramo = item.TIPOPROYECTO
              }
              if (item.GRUPO === $scope.constantsRrgg.GRUPO.CAR
                || item.GRUPO === $scope.constantsRrgg.GRUPO.CARLITE) {
                item.TipProyecto = item.TIPOPROYECTO
              }
            });
            $scope.cotizacion = response.Data
            $scope.pagination.totalItems = response.Data.length > 0 ? $scope.cotizacion[0].TOTAL : 0;
            $scope.pagination.noResult = response.Data.length === 0;
          } else {
            mModalAlert.showWarning(response.Message, "Alerta!");
            $scope.pagination.noSearch = true;
          }
        });
    }
    $scope.clearfilter = function () {
      clearPagination();
      $scope.cotizacion = []
      $scope.filter = {
        nroCotizacion: "",
        asegurado: "",
        producto: "",
        FechaDesde: "",
        FechaHasta: ""
      }
    }
    function clearPagination() {
      $scope.pagination = {
        currentPage: 1,
        maxSize: 10,
        totalItems: 0,
        noSearch: true,
        noResult: false
      };
    }
    $scope.pageChanged = function (currentPage) {
      $scope.pagination.currentPage = currentPage;
      listCotizacion();
    }
    $scope.openResumen = function (cotizacion) {
      if (_validInfoProducto(cotizacion)) {
        riesgosGeneralesFactory.cotizacion.tramite = {
          NroTramite: cotizacion.NU_NRO_TRAMITE,
          Grupo: cotizacion.GRUPO,
          IdProducto: cotizacion.CODIGO_RIESGO_GENERAL
        }
        $state.go(constantsRiesgosGenerales.ROUTES.COTIZACION_STEPS, { step: constantsRiesgosGenerales.STEPS.RESULTADOS });
      } else {
        mModalAlert.showWarning("La cotización no tiene información requerida para ver el resumen.", "¡Alerta!").then(function (rs) {
        })
      }
    }
    $scope.dowloadPdf = function (cotizacion) {
      mModalConfirm.confirmWarning('', $scope.constantsRrgg.SMS_INFO.DATA_SENSIBLE, 'ACEPTAR').then(function (response) {
        riesgosGeneralesService.dowloadPdf(cotizacion.NU_NRO_TRAMITE, cotizacion.GRUPO, 3)
      });
    }
    function _validInfoProducto(data) {
      return data.NU_NRO_TRAMITE && data.GRUPO && data.CODIGO_RIESGO_GENERAL ? true : false
    }
  }

});

