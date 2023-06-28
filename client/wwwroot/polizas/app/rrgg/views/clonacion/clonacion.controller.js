define([
  'angular', 'constants', 'constantsRiesgosGenerales', 'rrggModalClonar'
], function (angular, constants, constantsRiesgosGenerales) {
  'use strict';

  angular
    .module("appRrgg")
    .controller('rrggclonacionController', clonacionController);

  clonacionController.$inject = ['$state', '$scope', 'oimClaims', 'riesgosGeneralesService', 'riesgosGeneralesFactory', '$uibModal', 'mModalAlert', 'mModalConfirm'];

  function clonacionController($state, $scope, oimClaims, riesgosGeneralesService, riesgosGeneralesFactory, $uibModal, mModalAlert, mModalConfirm) {
    (function load_clonacionController() {
      riesgosGeneralesFactory.setClaims(oimClaims);
      $scope.clonar = {}
      $scope.disabledBtn = true;
      riesgosGeneralesService.getProxyProductos()
        .then(function (response) {
          $scope.productos = response.Data.filter(function (element) { return !element.CodigoProductoOrigen})
        });
      listarClonados();
    })();
    $scope.openEdit = function (item) {
      var vModalSendEmail = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        size: "xs",
        template: '<rrgg-modal-clonar  data="data" close="close()"></rrgg-modal-clonar>',
        controller: ['$scope', '$uibModalInstance', '$uibModal', function ($scope, $uibModalInstance, $uibModal) {
          $scope.data = item
          $scope.close = function () {
            $uibModalInstance.close();
            listarClonados();
          };
        }]
      });
      vModalSendEmail.result.then(function () {
      }, function () {
      });
    }
    $scope.changeProducto = function () {
      $scope.disabledBtn = $scope.clonar.producto.CodigoRiesgoGeneral ? false : true;
    }
    
    $scope.addClonar = function () {
      riesgosGeneralesFactory.cotizacion.clonar = $scope.clonar
      riesgosGeneralesFactory.cotizacion.clonar.CodigoRiesgoGeneral = $scope.clonar.producto.CodigoRiesgoGeneral
      riesgosGeneralesFactory.cotizacion.clonar.TipoRegistro = 1
      riesgosGeneralesService.gestionClonacion(riesgosGeneralesFactory.getModelClonacion()).then(function (response) {
        if (response.OperationCode === constants.operationCode.success) {
          mModalAlert.showSuccess("Producto clonado correctamente.", "GESTION PRODUCTO").then(function (rs) {
            if (rs) {
              $scope.clonar.producto.CodigoRiesgoGeneral = null
              $scope.clonar.NombreProducto = ""
              listarClonados();
            }
          })
        }else{
          mModalAlert.showWarning(response.Message, "Alerta!");
        }
      })
    }
    $scope.deleteClonacion = function (item) {
      var request = {
        TipoRegistro: 3,
        CodigoRiesgoGeneral: item.CodigoRiesgoGeneral,
        NombreProducto: item.Descripcion
      }
      riesgosGeneralesFactory.cotizacion.clonar = request
      mModalConfirm.confirmWarning('', '¿ESTA SEGURO DE ELIMINAR EL PRODUCTO?', 'ACEPTAR').then(function (response) {
        riesgosGeneralesService.gestionClonacion(riesgosGeneralesFactory.getModelClonacion()).then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            mModalAlert.showSuccess("Producto eliminado correctamente.", "GESTION PRODUCTO").then(function (rs) {
              if (rs) {
                listarClonados();
              }
            })
          } else {
            mModalAlert.showWarning(response.Message, "!Error!").then(function (rs) {
            })
          }
        }).catch(function (error) {
          mModalAlert.showError(error.Message, "¡Error!")
        });
      });
    }
    function listarClonados() {
      riesgosGeneralesService.productosClonados().then(function (response) {
        if (response.OperationCode === constants.operationCode.success) {
          $scope.clonaciones = response.Data;
          $scope.noResult = $scope.clonaciones.length === 0;
        }else{
          $scope.noResult = true;
        }
      })
    }
  }

});

