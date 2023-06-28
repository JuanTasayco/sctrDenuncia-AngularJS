'use strict';

define(['angular', 'constants', 'helper', 'saludFactory'], function(
  angular, constants, helper, saludFactory) {

  habilitadorController.$inject = [
    '$scope', '$window', '$state', '$timeout', 'mainServices', '$uibModal', 'mModalAlert', 'saludFactory'
  ];

  function habilitadorController($scope, $window, $state, $timeout, mainServices, $uibModal, mModalAlert, saludFactory) {
    var vm = this;
    vm.totalItems = 0;
    vm.totalPages = 0;
    vm.noResult = true;
    vm.pageSize = 10;
    vm.listArray = [];

    vm.buscarProducto = buscarProducto;
    vm.pageChanged = pageChanged;
    vm.productChecked = productChecked;
    vm.checkAll = checkAll;
    vm.fnShowAlert1 = eventSuccess;
    vm.fnShowModal = eventEdit;
    vm.updateListArray = updateListArray;

    vm.paramsListProduct = {
      nombreProducto: (vm.mBuscarProducto) ? vm.mBuscarProducto.toUpperCase() : '',
      cantidadFilasPorPagina: 10,
      paginaActual: 1
    };

    vm.$onInit = function() {
      saludFactory.getListEstadoProductoSalud().then(function(response) {
        if (response.OperationCode === constants.operationCode.success) {
          vm.HabilitarData = response.Data;
          vm.buscarProducto();
        } else {
          mModalAlert.showError(response.Message, 'Error');
        }
      }).catch(function(err){
        mModalAlert.showError(err.data.message, 'Error');
      });

      //tipo plan
      saludFactory.getTipoPlan().then(function(response) {
        if (response.OperationCode === constants.operationCode.success) {
          vm.tipoPlanArray = response.Data;
        } else {
          mModalAlert.showError(response.Message, 'Error');
        }
      }).catch(function(err){
        mModalAlert.showError(err.data.message, 'Error');
      });
    };

    function updateListArray(index, idItem, producto) {
      if(producto.mEstado) {
        producto.idProduct = index;
        vm.productChecked(producto.mEstado);
        vm.listArray.push(producto);
      } else {
        vm.indexArray = vm.listArray.indexOf(producto.idProduct);
        vm.selectedAll = false;
        if (vm.indexArray !== -1) {
          vm.listArray.splice(vm.indexArray, 1);
        }
      }
    }

    function checkAll (value) {
      vm.productChecked(value);
      var xval = value;
      angular.forEach(vm.listaProductos, function (val, key) {
        val.mEstado = xval;
      });

      if(!xval) {
        vm.listArray = [];
      }
    }

    function eventSuccess() {

      vm.paramsUpdateEstadoProducto = vm.listaProductos;
      angular.forEach(vm.listaProductos, function (val, key) {
        if (val.mEstado) {
          val.CodigoEstado = vm.mHabilitar.Codigo;
        }
      });

      saludFactory.actualizarEstadoProductoSalud(vm.paramsUpdateEstadoProducto).then(function(response) {
        if (response.OperationCode === constants.operationCode.success) {
          mModalAlert.showSuccess('Se aplicaron los cambios correspondientes a los productos seleccionados', '').then(function () {
            $state.reload();
          });
        } else {
          mModalAlert.showError(response.Message, 'Error');
        }
      }).catch(function(err){
        mModalAlert.showError(err.data.message, 'Error');
      });
    }

    function eventEdit(producto) {
      var vModalProof = $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        result: true,
        size: 'md',
        templateUrl : 'app/salud/popup/controller/popupHabilitar.html',
        controller : ['$scope', '$uibModalInstance', '$uibModal', '$timeout',
          function($scope, $uibModalInstance, $uibModal, $timeout) {
          $scope.mProducto = producto;
          $scope.tipoPlanArray = vm.tipoPlanArray;
          $scope.mTipoPlan = (producto.CodigoTipoPlan) ? {Codigo: producto.CodigoTipoPlan} : {Codigo: null};
          /*#########################
          # closeModal
          #########################*/
          $scope.closeModal = function() {
            $uibModalInstance.close();
          };

          /*########################
          # saveModal
          ########################*/
          $scope.saveModal = function() {
            if($scope.mTipoPlan.Codigo) {
              vm.paramsProductEdit = {
                codigoCompania: $scope.mProducto.CodigoCompania,
                codigoRamo: $scope.mProducto.CodigoRamo,
                numeroContrato: $scope.mProducto.NumeroContrato,
                numeroSubContrato: $scope.mProducto.NumeroSubContrato,
                codigoTipoPlan: ($scope.mTipoPlan.Codigo) ? $scope.mTipoPlan.Codigo : '',
                nombreProducto: ($scope.mProducto.NombreProducto) ? $scope.mProducto.NombreProducto.toUpperCase() : '',
                codigoModalidad: $scope.mProducto.CodigoModalidad
              };

              saludFactory.registrarProductoSalud(vm.paramsProductEdit).then(function(response) {
                if (response.OperationCode === constants.operationCode.success) {
                  $uibModalInstance.close();
                  mModalAlert.showInfo('Producto actualizado', 'Edición de producto').then(function(response) {
                    $state.reload();
                  });
                } else {
                  mModalAlert.showError(response.Message, 'Error');
                }
              }).catch(function(err){
                mModalAlert.showError(err.data.message, 'Error');
              });
            }

          };

          vModalProof.result.then(function(response){
          });

        }]
      });
    }

    function productChecked(value) {
      return (value) ? vm.isProductChecked = true : vm.isProductChecked = false;
    }

    function pageChanged(event) {
      vm.paramsListProduct.paginaActual = event;
      vm.listArray = [];
      vm.selectedAll = false;
      vm.checkAll(false);
      vm.buscarProducto();
    }

    function buscarProducto() {
          if (vm.paramsListProduct) {
            if (vm.paramsListProduct.paginaActual === 1) {
              vm.totalItems = 0;
              vm.mPagination = 1;
            }
            vm.paramsListProduct.nombreProducto = (vm.mBuscarProducto) ? vm.mBuscarProducto.toUpperCase() : '';
          }

          saludFactory.listarProductoTronPag(vm.paramsListProduct).then(function(response) {
            if (response.OperationCode === constants.operationCode.success) {
              vm.listaProductos = response.Data.Lista;
              vm.totalItems = response.Data.CantidadTotalFilas;
              vm.totalPages = response.Data.CantidadTotalPaginas;
            } else {
              vm.totalItems = 0;
              vm.totalPages = 0;
              mModalAlert.showError(response.Message, 'Error');
            }
          }).catch(function(err){
            vm.totalItems = 0;
            vm.totalPages = 0;
            mModalAlert.showError(err.data.message, 'Error');
          });
        }
  }
  return angular.module('appSalud')
    .controller('habilitadorController', habilitadorController)
});
