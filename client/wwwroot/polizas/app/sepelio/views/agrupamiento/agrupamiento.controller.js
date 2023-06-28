define([
  'angular', 'lodash', 'constants', 'constantsSepelios', 'mpfPersonComponent', 'campoSantoService'
], function (angular, _, constants, constantsSepelios) {
  'use strict';
  angular
    .module("appSepelio")
    .controller('agrupamientoCampoSantoController', agrupamientoCampoSantoController);

  agrupamientoCampoSantoController.$inject = ['$scope', '$state', 'mainServices', 'mModalAlert', 'mpSpin', '$uibModal', 'mModalConfirm', 'campoSantoService', 'campoSantoFactory'];

  function agrupamientoCampoSantoController($scope, $state, mainServices, mModalAlert, mpSpin, $uibModal, mModalConfirm, campoSantoService, campoSantoFactory) {
    (function agrupamientoCampoSantoController() {
      $scope.cntsSepelios = constantsSepelios
      $scope.filters = {}
      $scope.filtersTemporal = {}
      $scope.pagination = {
        currentPage: 1,
        maxSize: 6,
        totalItems: 0,
        noSearch: true,
        noResult: false
      };
      $scope.ramo = [
        {
          Codigo: $scope.cntsSepelios.RAMOS.NI,
          Text:  $scope.cntsSepelios.RAMOS.NI_TEXT,
        },
        {
          Codigo: $scope.cntsSepelios.RAMOS.NF,
          Text:  $scope.cntsSepelios.RAMOS.NF_TEXT,
        }]
      _getCategoria();
      _listaFinaciamientos();
    })();
    function _getCategoria() {
      campoSantoService.getCategoriaProducto().then(function (response) {
        $scope.categoria = response.Data;
      });
    }
    function _listaFinaciamientos() {
      campoSantoService.getListTipologiasFinancimientos().then(function (response) {
        if (response.OperationCode === constants.operationCode.success) {
          response.Data.forEach(function (element) {
            element.disabledF = true;
            element.inputView = true
            if (element.CodTipologiaFinanciamiento === "TIPO_1") {
              element.MesMinimo = "0"
              element.disabled = false;
            } else if (element.CodTipologiaFinanciamiento === "TIPO_4") {
              element.disabled = true;
              element.inputView = false
            } else {
              element.disabled = true;
            }
          });
          $scope.financiamientos = response.Data
        }
      })
    }
    $scope.listCamposanto = function () {
      if ($scope.filters.ramo){
        campoSantoService.getProxyCamposanto($scope.filters.ramo.Codigo).then(function (response) {
          $scope.camposanto = response.Data;
          $scope.filters.camposanto = null;
        });        
      }else{
        $scope.camposanto = [];
        $scope.filters.camposanto = null;
      }
    }
    $scope.search = function () {
      if (_validateForm()) {
        $scope.pagination.currentPage = 1;
        $scope.filtersTemporal = angular.extend({}, $scope.filters, {});
        $scope.listaProductoAgrupamiento();
      }
    }
    $scope.listaProductoAgrupamiento = function () {
      var camposanto = $scope.filtersTemporal.camposanto && $scope.filtersTemporal.camposanto.Codigo != null ? $scope.filtersTemporal.camposanto.Descripcion : null;
      $scope.pagination.noSearch = false
      campoSantoService.productoAgrupamiento($scope.filtersTemporal.ramo.Codigo, camposanto,
        $scope.filtersTemporal.codigoProducto, $scope.filtersTemporal.producto, $scope.filtersTemporal.categoria.Codigo, $scope.pagination.maxSize, $scope.pagination.currentPage).then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            response.Data.Lista.forEach(function (element) {
              element.categoria = {
                Codigo: element.CodCategoria,
                Descripcion: element.NombreCategoria
              }
            });
            $scope.agrupaciones = response.Data.Lista;
            $scope.categoriaSelect = $scope.categoria.filter(function (item) { return item.selectedEmpty !== true })
            $scope.pagination.totalItems = response.Data.Lista.length > 0 ? response.Data.CantidadTotalPaginas * 10 : 0;
            $scope.pagination.noResult = response.Data.Lista.length === 0;
          } else {
            $scope.pagination.noSearch = true
          }
        })
    }
    $scope.pageChanged = function (currentPage) {
      $scope.pagination.currentPage = currentPage;
      $scope.listaProductoAgrupamiento();
    }
    $scope.updateProductoCategoria = function (item) {
      var request = {
        "CodRamo": item.CodRamo,
        "CodCampoSanto": item.CodCampoSanto,
        "CodModalidad": item.CodModalidad,
        "CodProducto": item.CodProducto,
        "CodTipoContrato": item.CodTipoContrato,
        "CodCategoria": item.categoria.Codigo
      }
      campoSantoService.updateProductoCategoria(request).then(function (response) {
        if (response.OperationCode === constants.operationCode.success) {
          mModalAlert.showSuccess("Categoria actualizada correctamente", "REGISTRO ACTUALIZADO")
            .then(function (r2) {
              $scope.listaProductoAgrupamiento();
            });
        }
      })
    }
    $scope.clearFilters = function () {
      $scope.filters = {}
      $scope.agrupaciones = []
      $scope.camposanto = [];
      $scope.pagination.noSearch = true
      $scope.pagination.noResult = false
      $scope.pagination.totalItems = 0
    }
    $scope.saveFinanciamiento = function (item) {
      var request = {
        "CodTipologiaFinanciamiento": item.CodTipologiaFinanciamiento,
        "MesMinimo": item.MesMinimo,
        "MesMaximo": item.MesMaximo,
      }
      campoSantoService.updateTipologiaFinancimiento(request).then(function (response) {
        if (response.OperationCode === constants.operationCode.success) {
          mModalAlert.showSuccess("Financiamiento actualizado correctamente", "REGISTRO ACTUALIZADO")
            .then(function (r2) {
              _listaFinaciamientos();
            });
        } else {
          mModalAlert.showError("Error al actualizar el registro", "¡Error!")
        }
      })
    }
    $scope.showDetails = function (itemProducto){

      $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        result: true,
        size: 'lg',
        templateUrl: 'app/sepelio/popup/controller/popupAgrupamientoDetalle.html',
        controller: ['$scope', '$uibModalInstance', '$uibModal', '$timeout', 'mModalConfirm',
          function ($scope, $uibModalInstance, $uibModal, $timeout, mModalConfirm) {
            $scope.modelPopup = itemProducto;
            $scope.closeModal = function () {
              $uibModalInstance.close();
            };
          }]
      });

    }
    $scope.editFormula = function (item) {
      if (item.CodTipologiaFinanciamiento === "TIPO_2" || item.CodTipologiaFinanciamiento === "TIPO_3") {
        item.Financiamiento = ">" + item.MesMinimo + " y <" + item.MesMaximo + ";(" + (parseInt(item.MesMaximo) - 1) + " o menos)"
      } else if (item.CodTipologiaFinanciamiento === "TIPO_4") {
        item.Financiamiento = ">=" + item.MesMinimo
      }
      return item;
    }
    $scope.validControlForm = function (controlName) {
      return $scope.frmFilters && campoSantoFactory.validControlForm($scope.frmFilters, controlName);
    }
    function _validateForm() {
      $scope.frmFilters.markAsPristine();
      return $scope.frmFilters.$valid;
    }
  }
});
