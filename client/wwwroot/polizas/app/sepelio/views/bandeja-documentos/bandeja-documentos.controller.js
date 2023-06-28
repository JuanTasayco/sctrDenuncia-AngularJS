define([
  'angular', 'lodash', 'constants', 'constantsSepelios', 'mpfPersonComponent', 'campoSantoService'
], function (angular, _, constants, constantsSepelios) {
  'use strict';
  angular
    .module("appSepelio")
    .controller('bandejaDocumentosCampoSantoController', bandejaDocumentosCampoSantoController);

  bandejaDocumentosCampoSantoController.$inject = ['$scope', '$state', 'mainServices', 'mModalAlert', 'mpSpin', '$uibModal', 'mModalConfirm', 'campoSantoService', 'campoSantoFactory', 'proxyAgente','proxyCampoSanto'];

  function bandejaDocumentosCampoSantoController($scope, $state, mainServices, mModalAlert, mpSpin, $uibModal, mModalConfirm, campoSantoService, campoSantoFactory, proxyAgente, proxyCampoSanto) {
    (function load_bandejaDocumentosCampoSantoController() {
      $scope.campoSantoService = campoSantoService
      $scope.cntsSepelios = constantsSepelios
      $scope.proxyAgente = proxyAgente;
      $scope.proxyCampoSanto = proxyCampoSanto
      $scope.addNewItem = false
      $scope.isEdit = false
      $scope.format = constants.formats.dateFormat;
      $scope.fechaCreacion = new Date(),
      $scope.modelo = {}
      $scope.datos = {}
      $scope.noData = {
          noSearch: true,
          noResult: false
      }
      $scope.pagination = {
          totalItems: 0
        };
      $scope.filters = {
        cantidadFilasPorPagina : 10,
        paginaActual: 1
      }
      $scope.ramo = [
        {
          Codigo: $scope.cntsSepelios.RAMOS.NI,
          Text:  $scope.cntsSepelios.RAMOS.NI_TEXT,
        },
        {
          Codigo: $scope.cntsSepelios.RAMOS.NF,
          Text:  $scope.cntsSepelios.RAMOS.NF_TEXT,
        }]
    })();
    $scope.getCampoSanto = function (ramo) {
      campoSantoService.getProxyCamposanto(ramo).then(function (response) {
        $scope.datos.camposanto = response.Data;
      });
    }
    $scope.getCampoSantoForm = function (ramo) {
      campoSantoService.getProxyCamposanto(ramo).then(function (response) {
        $scope.datos.camposantoForm = response.Data
      });
    }
    $scope.searchData = function (pagina) {
      var data = {
        "idCampoSanto": $scope.filters && $scope.filters.camposanto && $scope.filters.camposanto.Codigo || null,
        "CodRamo": ($scope.filters.ramo ? $scope.filters.ramo.Codigo : null) || null,
        "CodEmisor": $scope.filters.emisor && $scope.filters.emisor.codPersona || null,
        "CodAgente": $scope.filters.agente && $scope.filters.agente.codigoAgente || null,
        "cantidadFilasPorPagina":  $scope.filters.cantidadFilasPorPagina,
        "paginaActual": pagina || $scope.filters.paginaActual
      }
      if (pagina) $scope.filters.paginaActual = pagina;
      $scope.filtersTemporal = angular.extend({}, data, {});
      listEmisiores($scope.filtersTemporal);
    }

    $scope.searchData(1);

    function listEmisiores(data) {
      campoSantoService.getBandejaEmisores(data).then(function (response) {
        $scope.infoEmisores = response.Data.Lista;
        $scope.noData.noSearch = false;
        $scope.noData.noResult = $scope.infoEmisores.length === 0;
        $scope.pagination.totalItems = $scope.infoEmisores.length > 0 ? response.Data.CantidadTotalFilas : 0;
      })
    }
    $scope.pageChanged = function (currentPage) {
      $scope.filtersTemporal.paginaActual = currentPage;
      listEmisiores($scope.filtersTemporal);
    }
    $scope.addItemOrClean = function (value) {
      $scope.addNewItem = value;
      $scope.modelo = {}
      $scope.camposantoForm = []
      if(!value){
        $scope.isEdit = false
      }else{
        $scope.noData = {}
      }
    }
    $scope.save = function (isEdit) {
      if (_validateForm()) {
        var data = {
          "CodCampoSanto": $scope.modelo.camposanto.Codigo,
          "CodRamo": $scope.modelo.ramo.Codigo,
          "CodEmisor": $scope.modelo.emisor && $scope.modelo.emisor.codPersona || null,
          "CodAgente": $scope.modelo.agente.codigoAgente
        }
        if (isEdit) {
          data.Operacion = "UPDATE"
          data.CodBandejaDocumento = $scope.modelo.CodBandejaDocumento
          campoSantoService.updateEmisorAgenteSede(data).then(function (response) {
            if (response.OperationCode === constants.operationCode.success) {
              mModalAlert.showSuccess("Registro actualizado correctamente, puedes usar los filtros para buscarlo.", "REGISTRO ACTUALIZADO")
                .then(function (r2) {
                  $scope.addItemOrClean(false);
                  $scope.searchData();
                });
            }else{
              mModalAlert.showWarning(response.Data.Message || response.Data, "Alerta")
            }
          })
        } else {
          campoSantoService.insertEmisorAgenteSede(data).then(function (response) {
            if (response.OperationCode === constants.operationCode.success) {
              mModalAlert.showSuccess("Registro creado correctamente, puedes usar los filtros para buscarlo.", "NUEVO REGISTRO CREADO")
                .then(function (r2) {
                  $scope.addItemOrClean(false);
                  $scope.searchData();
                });
            }else{
              mModalAlert.showWarning(response.Data.Message || response.Data, "Alerta")
            }
          })
        }
      }
    }
    $scope.validControlForm = function (controlName) {
      return $scope.frmAdd && campoSantoFactory.validControlForm($scope.frmAdd, controlName);
    }
    function _validateForm() {
      $scope.frmAdd.markAsPristine();
      return $scope.frmAdd.$valid;
    }
    $scope.clearFilters = function () {
      $scope.filters = {};
      $scope.noData.noSearch = true;
      $scope.noData.noResult = false;
      $scope.infoEmisores = [];
      $scope.addItemOrClean(false);
      $scope.pagination = {}
    }
    $scope.openEdit = function (item) {
      $scope.addNewItem = true;
      $scope.isEdit = true
      $scope.modelo.CodBandejaDocumento = item.CodBandejaDocumento
      $scope.modelo.ramo = {
        Codigo: item.CodRamo
      }
      $scope.getCampoSantoForm(item.CodRamo);
      $scope.modelo.camposanto = {
        Codigo: item.CodCampoSanto
      }
      $scope.modelo.emisor =
      {
        codPersona: item.CodEmisor,
        codigoNombre: item.CodEmisor + "-" + item.NombreEmisor
      }
      $scope.modelo.agente =
      {
        codigoAgente: item.CodAgente,
        codigoNombre: item.CodAgente + "-" + item.NombreAgente
      }
      document.getElementById('frmAdd').scrollIntoView();
    }
    $scope.delete = function (item) {
      mModalConfirm.confirmWarning('', '¿ESTA SEGURO DE ELIMINAR EL REGISTRO?', 'ACEPTAR').then(function (response) {
        data.Operacion = "DELETE"
        data.CodBandejaDocumento = item.CodBandejaDocumento
        campoSantoService.updateEmisorAgenteSede(data).then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            mModalAlert.showSuccess("Registro eliminado correctamente", "REGISTRO ELIMINADO")
              .then(function (r2) {
                if ($scope.infoEmisores.length === 1 && $scope.filtersTemporal.paginaActual > 1){
                  $scope.filtersTemporal.paginaActual = $scope.filtersTemporal.paginaActual - 1;
                  listEmisiores($scope.filtersTemporal);
                }else{
                  listEmisiores($scope.filtersTemporal);
                }
                $scope.addItemOrClean(false);
              });
          }else{
            mModalAlert.showWarning(response.Data.Message || response.Data, "Alerta")
          }
        })
      })
    }
  }
});
