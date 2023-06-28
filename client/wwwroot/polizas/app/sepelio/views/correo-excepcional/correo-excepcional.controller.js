define([
  'angular', 'lodash', 'constants', 'constantsSepelios', 'mpfPersonComponent', 'campoSantoService'
], function (angular, _, constants, constantsSepelios) {
  'use strict';
  angular
    .module("appSepelio")
    .controller('correoExcepcionalCampoSantoController', correoExcepcionalCampoSantoController);

  correoExcepcionalCampoSantoController.$inject = ['$scope', '$state', 'mainServices', 'mModalAlert', 'mpSpin', '$uibModal', 'mModalConfirm', 'campoSantoService', 'campoSantoFactory'];

  function correoExcepcionalCampoSantoController($scope, $state, mainServices, mModalAlert, mpSpin, $uibModal, mModalConfirm, campoSantoService, campoSantoFactory) {
    (function load_correoExcepcionalCampoSantoController() {
      var vm = this;
      $scope.cntsSepelios = constantsSepelios
      $scope.format = constants.formats.dateFormat;
      $scope.isEdit = false
      $scope.fechaCreacionAdd = new Date()
      $scope.frmFilters = $scope.frmFilters
      $scope.modelo = {}
      $scope.noData = {
        noSearch: true,
        noResult: false
      }
      $scope.formCorreo = {}
      $scope.pagination = {
        totalItems: 0
      };
      $scope.fechaCreacion = "";
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

    

    $scope.listCamposanto = function () {
      campoSantoService.getProxyCamposanto($scope.filters.ramo.Codigo).then(function (response) {
        $scope.camposanto = response.Data;
      });
    }

    $scope.searchData = function (pagina) {
      var data = {
        "CodRamo": ($scope.filters.ramo ? $scope.filters.ramo.Codigo : 0) || 0,
        "FechaCreacion": campoSantoFactory.formatearFecha($scope.fechaCreacion),
        "Correo": $scope.filters.email || null,
        "NombreCampoSanto": $scope.filters.camposanto && $scope.filters.camposanto.Codigo != null ? $scope.filters.camposanto.Descripcion : null,
        "cantidadFilasPorPagina":  $scope.filters.cantidadFilasPorPagina,
        "paginaActual": pagina || $scope.filters.paginaActual
      }
      if (pagina) $scope.filters.paginaActual = pagina;
      $scope.filtersTemporal = angular.extend({}, data, {});
      listaCorreoExcepcional($scope.filtersTemporal);
    }
    
    $scope.searchData(1)

    function listaCorreoExcepcional(data) {
      campoSantoService.getListCorreosExcepcional(data).then(function (response) {
        if (response.OperationCode === constants.operationCode.success) {
          $scope.exepcionales = response.Data.Lista;
          $scope.noData.noSearch = false;
          $scope.noData.noResult = $scope.exepcionales.length === 0;
          $scope.pagination.totalItems = $scope.exepcionales.length > 0 ? response.Data.CantidadTotalFilas : 0;
        }
      })
    }
    $scope.pageChanged = function (filters) {
      $scope.filtersTemporal.paginaActual = filters.paginaActual;
      listaCorreoExcepcional($scope.filtersTemporal);
    }
    $scope.camposantoFn = function (ramo) {
      _listCamposanto(ramo)
    }
    function _listCamposanto(ramo) {
      campoSantoService.getProxyCamposanto(ramo).then(function (response) {
        $scope.formCorreo.camposantoFrmAdd = response.Data;
      });
    }
    $scope.addItemOrClean = function (value) {
      $scope.addNewItem = value;
      $scope.modelo = {}
      if (!value) {
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
          "Correo": $scope.modelo.email
        }
        if (isEdit) {
          data.Operacion = "UPDATE"
          data.CodGrupoExcepcional = $scope.modelo.CodGrupoExcepcional
          campoSantoService.updateCorreoExcepcional(data).then(function (response) {
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
          campoSantoService.insertCorreoExcepcional(data).then(function (response) {
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
      $scope.fechaCreacion = "";
      $scope.exepcionales = [];
      $scope.addItemOrClean(false);
      $scope.pagination = {}
    }
    $scope.openEdit = function (item) {
      $scope.addNewItem = true;
      $scope.isEdit = true
      _listCamposanto(item.CodRamo);
      $scope.modelo.CodGrupoExcepcional = item.CodGrupoExcepcional
      $scope.modelo.ramo = {
        Codigo: item.CodRamo
      }
      $scope.modelo.camposanto = {
        Codigo: item.CodCampoSanto
      }
      $scope.modelo.email = item.Correo;
      document.getElementById('frmAdd').scrollIntoView();
    }
    $scope.delete = function (item) {
      mModalConfirm.confirmWarning('', '¿ESTA SEGURO DE ELIMINAR EL REGISTRO?', 'ACEPTAR').then(function (response) {
        data.Operacion = "DELETE"
        data.CodGrupoExcepcional = item.CodGrupoExcepcional
        campoSantoService.updateCorreoExcepcional(data).then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            mModalAlert.showSuccess("Registro eliminado correctamente", "REGISTRO ELIMINADO")
              .then(function (r2) {
                if ($scope.exepcionales.length === 1 && $scope.filtersTemporal.paginaActual > 1){
                  $scope.filtersTemporal.paginaActual = $scope.filtersTemporal.paginaActual - 1;
                  listaCorreoExcepcional($scope.filtersTemporal);
                }else{
                  listaCorreoExcepcional($scope.filtersTemporal);
                }
                $scope.addItemOrClean(false);
              });
          }
        })
      })
    }

  }
});
