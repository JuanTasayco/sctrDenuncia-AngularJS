'use strict';

define(['angular', 'constants', 'helper', 'saludFactory'], function(
  angular, constants, helper, saludFactory) {

    productoClinicaDigitalController.$inject = [
    '$scope', '$window', '$state', '$timeout', 'mainServices', '$uibModal', 'mModalAlert', 'saludFactory'
  ];

  function productoClinicaDigitalController($scope, $window, $state, $timeout, mainServices, $uibModal, mModalAlert, saludFactory) {
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
      saludFactory.ListarPlanEstadoClinicaFigital().then(function(response) {
        if (response.OperationCode === constants.operationCode.success) {
          vm.HabilitarData = response.Data;
          vm.buscarProducto();
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
          val.CodigoEstadoPlan = vm.mHabilitar.Codigo;
        }
      });

      saludFactory.ActualizaPlanEstadoClinicaFigital(vm.paramsUpdateEstadoProducto).then(function(response) {
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
      $state.go('editarPlanClinicaDigital', {compania: producto.CodigoCompania, modalidad: producto.CodigoModalidad, codigoProducto: producto.CodigoProducto, codigoSubProducto: producto.CodigoSubProducto, codigoPlan: producto.CodigoPlan});
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
            vm.paramsListProduct.nombrePlan = (vm.mBuscarProducto) ? vm.mBuscarProducto.toUpperCase() : '';
          }

          saludFactory.ListarPlanTronPagClinicaFigital(vm.paramsListProduct).then(function(response) {
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
  return angular.module('appClinicaDigital')
    .controller('productoClinicaDigitalController', productoClinicaDigitalController)
});
