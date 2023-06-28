'use strict';

define(['angular', 'constants', 'helper', 'decesoFactory'], function(
  angular, constants, helper, decesoFactory) {

    productoDecesoController.$inject = [
    '$scope', '$window', '$state', '$timeout', 'mainServices', '$uibModal', 'mModalAlert', 'decesoFactory'
  ];

  function productoDecesoController($scope, $window, $state, $timeout, mainServices, $uibModal, mModalAlert, decesoFactory) {
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
    vm.listarProductos = listarProductos;
    vm.formatListProduct = formatListProduct;

    vm.paramsListProduct = {
      codigoRamo: null,
      codigoEstado: 'A',
      cantidadFilasPorPagina: 10,
      paginaActual: 1
    };

    vm.$onInit = function() {
      vm.listarProductos(vm.paramsListProduct);
    };

    function updateListArray(producto) {
      if(producto.mEstado) {
        producto.CodigoEstado = 'A';
      } else {
        producto.CodigoEstado = 'I';
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
      decesoFactory.ActualizaRamo(vm.listaProductos, true).then(function(response) {
        if (response.OperationCode === constants.operationCode.success) {
            mModalAlert.showSuccess('Se aplicaron los cambios correspondientes a los productos modificados', '').then(function () {
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
      console.log(producto.CodigoRamo)
      $state.go('editarProductoDeceso', {codigoRamo: producto.CodigoRamo});
    }

    function productChecked(value) {
      return (value) ? vm.isProductChecked = true : vm.isProductChecked = false;
    }

    function pageChanged(event) {
      vm.paramsListProduct.paginaActual = event;
      vm.listArray = [];
      vm.selectedAll = false;
      //vm.checkAll(false);
      vm.buscarProducto();
    }

    function buscarProducto() {    
      vm.listarProductos({
        codigoRamo: (vm.paramsListProduct.codigoRamo) ? vm.paramsListProduct.codigoRamo : null,
        codigoEstado: (vm.paramsListProduct.codigoRamo) ? null : 'A',
        cantidadFilasPorPagina: vm.paramsListProduct.cantidadFilasPorPagina,
        paginaActual: vm.paramsListProduct.paginaActual
      });
    }
    function listarProductos(request){
      decesoFactory.ListarRamoTronPag(request, true).then(function(response) {        
        if (response.OperationCode === constants.operationCode.success) {
          vm.listaProductos = vm.formatListProduct(response.Data.Lista);
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

  function formatListProduct(listaProductos){
    listaProductos.forEach(function (product) {
      if(product.CodigoEstado == 'A'){
        product.mEstado = true
      }else{
        product.mEstado = false
      }
    });
    return listaProductos;
     
  }
  return angular.module('appDeceso')
    .controller('productoDecesoController', productoDecesoController)
});
