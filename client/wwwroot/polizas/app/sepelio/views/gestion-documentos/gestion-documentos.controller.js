define([
  'angular', 'lodash', 'constants', 'constantsSepelios', 'mpfPersonComponent', 'campoSantoService'
], function (angular, _, constants, constantsSepelios) {
  'use strict';
  angular
    .module("appSepelio")
    .controller('gestionDocumentosCampoSantoController', gestionDocumentosCampoSantoController);

  gestionDocumentosCampoSantoController.$inject = ['$scope', '$state', 'mainServices', 'mModalAlert', 'mpSpin', '$uibModal', 'mModalConfirm', 'campoSantoService', 'campoSantoFactory'];

  function gestionDocumentosCampoSantoController($scope, $state, mainServices, mModalAlert, mpSpin, $uibModal, mModalConfirm, campoSantoService, campoSantoFactory) {
    (function load_gestionDocumentosCampoSantoController() {
      $scope.cntsSepelios = constantsSepelios;
      $scope.isEdit = false;
      $scope.formDocu = {};
      $scope.modelo = {};
      $scope.ramo = [
        {
          Codigo: $scope.cntsSepelios.RAMOS.NI,
          Text:  $scope.cntsSepelios.RAMOS.NI_TEXT,
        },
        {
          Codigo: $scope.cntsSepelios.RAMOS.NF,
          Text:  $scope.cntsSepelios.RAMOS.NF_TEXT,
        }]
      $scope.obligatorio = [
        { Codigo: "1", Descripcion: "Si" },
        { Codigo: "0", Descripcion: "No" },
      ]
      listTipoDeDocumento();
      _listDocumentos();
    })();
    function listTipoDeDocumento() {
      campoSantoService.getListTiposDocumentos().then(function (response) {
        if (response.OperationCode === constants.operationCode.success) {
          $scope.tipoDocumento = response.Data
        }
      })
    }
    function _getTipoContrato(ramo) {
      campoSantoService.getProxyTipoContrato(ramo.Codigo).then(function (response) {
        $scope.formDocu.tipoContrato1 = response.Data;
      });
    }
    function _listDocumentos() {
      campoSantoService.getListGestionDocumentos().then(function (response) {
        if (response.OperationCode === constants.operationCode.success) {
          $scope.documentosRamo400 = response.Data.filter(function (item) {
            item.nameObligatorio = item.Obligatorio === "0" ? "Opcional" : "Obligatorio";
            return item.CodRamo === 400
          })
          $scope.documentosRamo401 = response.Data.filter(function (item) {
            item.nameObligatorio = item.Obligatorio === "0" ? "Opcional" : "Obligatorio";
            return item.CodRamo === 401
          })
        }
      })
    }
    $scope.changeRamo = function (ramo) {
      _getTipoContrato(ramo)
    }
    $scope.validControlForm = function (controlName) {
      return $scope.frmAdd && campoSantoFactory.validControlForm($scope.frmAdd, controlName);
    }
    $scope.changeTipoDocumento = function (nombre){
      if (nombre.trim() === '' ) return;
      var entityOld = $scope.tipoDocumento.find(function (params) {
        return params.Descripcion.toUpperCase() === nombre.toUpperCase();
      });
      if (!entityOld){
        var entity = $scope.tipoDocumento.find(function (params) {
          return params.Codigo === 'XX';
        });
        if (!entity){
          entity = {Descripcion:nombre.toUpperCase(),Codigo:'XX'};
          $scope.tipoDocumento.push(entity)
        }else{
          entity.Descripcion = nombre.toUpperCase();
        }
        $scope.modelo.tipoDocumento = entity;
      }else{
        $scope.tipoDocumento.splice($scope.tipoDocumento.indexOf(function (x) { return x.Codigo === 'XX' }),1);
        $scope.modelo.tipoDocumento = null;
      }

    }

    $scope.save = function (isEdit) {
      if (_validateForm()) {
        var request = {
          "CodTipoDocumento": $scope.modelo.tipoDocumento.Codigo === 'XX' ? '0' : $scope.modelo.tipoDocumento.Codigo,
          "NombreTipoDocumento": $scope.modelo.tipoDocumento.Descripcion,
          "CodTipoContrato": $scope.modelo.tipoContrato.Codigo,
          "Obligatorio": $scope.modelo.obligatorio.Codigo,
          "CodRamo": $scope.modelo.ramo.Codigo,
        }
        if (isEdit) {
          request.Operacion = "UPDATE";
          request.CodGestionDocumento = $scope.modelo.CodGestionDocumento;
          campoSantoService.updateGestionDocumento(request).then(function (response) {
            if (response.OperationCode === constants.operationCode.success) {
              mModalAlert.showSuccess("Registro actualizado correctamente", "REGISTRO ACTUALIZADO")
                .then(function (r2) {
                  _listDocumentos();
                  listTipoDeDocumento();
                });
            }
          })
        } else {
          campoSantoService.insertGestionDocumento(request).then(function (response) {
            if (response.OperationCode === constants.operationCode.success) {
              mModalAlert.showSuccess("Registro agregado correctamente", "REGISTRO AGREGADO")
                .then(function (r2) {
                  _listDocumentos();
                  listTipoDeDocumento();
                });
            }
          })
        }
      }
    }
    $scope.active = function (item) {
      var request = {
        "Operacion": "ACTIVE",
        "CodGestionDocumento": item.CodGestionDocumento,
        "Activo": item.Activo
      }
      campoSantoService.updateGestionDocumento(request).then(function (response) {
      })
    }
    $scope.delete = function (item) {
      mModalConfirm.confirmWarning('', '¿ESTA SEGURO DE ELIMINAR EL REGISTRO?', 'ACEPTAR').then(function (res) {
        var request = {
          "Operacion": "DELETE",
          "CodGestionDocumento": item.CodGestionDocumento
        }
        campoSantoService.updateGestionDocumento(request).then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            mModalAlert.showSuccess("Registro eliminado correctamente", "REGISTRO ELIMINADO")
              .then(function (r2) {
                _listDocumentos();
                listTipoDeDocumento();  
              });
          }
        })
      })
    }
    function _validateForm() {
      $scope.frmAdd.markAsPristine();
      return $scope.frmAdd.$valid;
    }
    $scope.openAdd = function (value) {
      $scope.visible = value;
      $scope.modelo = {}
      if (!value) {
        $scope.isEdit = false
      }
    }
    $scope.openEdit = function (item) {
      $scope.visible = true;
      $scope.isEdit = true
      $scope.modelo.CodGestionDocumento = item.CodGestionDocumento;
      $scope.modelo.tipoDocumento = {
        Codigo: item.CodTipoDocumento,
        Descripcion: item.NombreTipoDocumento
      };
      $scope.modelo.ramo = {
        Codigo: item.CodRamo
      }
      _getTipoContrato($scope.modelo.ramo)
      $scope.modelo.tipoContrato =
      {
        Codigo: item.CodTipoContrato
      }
      $scope.modelo.obligatorio =
      {
        Codigo: item.Obligatorio
      }
      setTimeout(function() {
              document.getElementById('frmAdd').scrollIntoView();
      }, 500);

    }
  }
});
