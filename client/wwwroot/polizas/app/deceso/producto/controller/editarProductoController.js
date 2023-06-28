'use strict';

define(['angular', 'lodash', 'constants', 'helper', 'decesoFactory'], function(
  angular, _, constants, helper, decesoFactory) {

  editarProductoController.$inject = [
    '$scope', '$window', '$state', '$timeout', 'mainServices', '$uibModal', 'mModalAlert', '$sce', 'decesoFactory', '$stateParams', '$http', 'mpSpin'
  ];

    function editarProductoController($scope, $window, $state, $timeout, mainServices, $uibModal, mModalAlert, $sce, decesoFactory, $stateParams, $http, mpSpin) {
      var vm = this;
      vm.listArray = [];
      vm.ListaPolizaGrupo = [];
      vm.ListaModalidad = [];
      vm.toggleAccordion = toggleAccordion;
      vm.checkAllPolizaGrupo = checkAllPolizaGrupo;
      vm.updateListArray = updateListArray;
      vm.PolizaGrupoChecked = PolizaGrupoChecked;
      vm.checkAllModalidad = checkAllModalidad;
      vm.ModalidadChecked = ModalidadChecked;
      vm.pageChanged = pageChanged;      
      vm.fnShowAlert1 = eventSuccess;

      vm.paramsListProduct = {
        nombreProducto: (vm.mBuscarProducto) ? vm.mBuscarProducto.toUpperCase() : '',
        cantidadFilasPorPagina: 10,
        paginaActual: 1
      };

      vm.$onInit = function () {
        vm.oneAtATime = true;
          vm.status = {
            acordion : {
              open1: false,
              open2: false
            },
            isCustomHeaderOpen: false,
            isFirstOpen: true,
            isFirstDisabled: false
          };

        mainServices.fnReturnSeveralPromise([
          decesoFactory.ListaPolizaGrupoTron($stateParams.codigoRamo, false),
          decesoFactory.ListaModalidadTron($stateParams.codigoRamo, false),
        ], true).then(function (response) {
          console.log(response)
          vm.ListaPolizaGrupo = angular.copy(formatListProduct(response[0].Data));
          vm.ListaModalidad = angular.copy(formatListProduct(response[1].Data));
        }, function (error) {
          vm.ListaPolizaGrupo = [];
          vm.ListaModalidad = [];
            console.log(error)
        });        
      };

      function toggleAccordion(property){
        _.forEach(vm.status.acordion, function(element, key){
          if(vm.status.acordion[key] == false){
            vm.status.acordion[key] = key == property ? true : false;
          }
          else{
            vm.status.acordion[key] = false;
          }
        })
      }      

      function pageChanged(event) {
        vm.paramsListProduct.paginaActual = event;
        vm.listArray = [];
        vm.selectedAll = false;
        vm.checkAll(false);
        vm.buscarProducto();
      }

      function checkAllPolizaGrupo (value) {
        vm.PolizaGrupoChecked(value);
        var xval = value;
        angular.forEach(vm.ListaPolizaGrupo, function (val, key) {
          val.mEstado = xval;
        });
  
        if(!xval) {
          vm.listArray = [];
        }
      }

      function PolizaGrupoChecked(value) {
        return (value) ? vm.isPolizaGrupoCheckedChecked = true : vm.isPolizaGrupoCheckedChecked = false;
      }
      function updateListArray(producto) {
        if(producto.mEstado) {
          producto.CodigoEstado = 'A';
        } else {
          producto.CodigoEstado = 'I';
        }
      }

      function checkAllModalidad (value) {
        vm.ModalidadChecked(value);
        var xval = value;
        angular.forEach(vm.ListaModalidad, function (val, key) {
          val.mEstado = xval;
        });
  
        if(!xval) {
          vm.listArray = [];
        }
      }

      function ModalidadChecked(value) {
        return (value) ? vm.isModalidadCheckedChecked = true : vm.isModalidadCheckedChecked = false;
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

      function eventSuccess() {
        decesoFactory.ActualizaPolizaGrupoModalidad({
          PolizasGrupo: vm.ListaPolizaGrupo,
          Modalidades:vm.ListaModalidad
        }, true).then(function(response) {
            mModalAlert.showSuccess('Se aplicaron los cambios correspondientes', '').then(function () {
              $state.reload();
            });
        }).catch(function(err){
          mModalAlert.showError(err.data.message, 'Error');
        });
      }

    }
    return angular.module('appDeceso')
      .controller('editarProductoController', editarProductoController)
  });
