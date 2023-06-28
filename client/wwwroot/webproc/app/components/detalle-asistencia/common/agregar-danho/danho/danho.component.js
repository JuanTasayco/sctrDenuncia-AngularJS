'use strict';

define(['angular'], function(ng) {
  DanhoController.$inject = ['$rootScope', '$scope', '$timeout', 'wpFactory'];
  function DanhoController($rootScope, $scope, $timeout, wpFactory) {
    var vm = this;
    var onFrmDanhoCerrado;
    vm.$onDestroy = onDestroy;
    vm.$onInit = onInit;
    vm.editarDanho = editarDanho;
    vm.handleOnDelete = handleOnDelete;
    vm.handleOnEditar = handleOnEditar;

    // declaracion

    function onInit() {
      onFrmDanhoCerrado = $scope.$on('danho:frmEditCerrado', frmDanhoCerrado);
      vm.showDanho = true;
      paintData();
    }

    function onDestroy() {
      onFrmDanhoCerrado();
    }

    function paintData() {
      var lstZonasDanhos = wpFactory.myLookup.getZonaDanho();
      var lstNivelDanhos = wpFactory.myLookup.getNivelDanho();
      vm.zonaDanho = wpFactory.help.seleccionarCombo(lstZonasDanhos, 'codigoValor', vm.danho.codigoZonaDanio);
      vm.nivelDanho = wpFactory.help.seleccionarCombo(lstNivelDanhos, 'valor1', vm.danho.codigoNivelDanio);
      vm.parteDanio = vm.danho.parteDanio || wpFactory.help.getNombreParteDanho(vm.danho);
    }

    function editarDanho() {
      vm.showEditFrm = true;
      vm.showDanho = false;
    }

    function frmDanhoCerrado() {
      vm.showDanho = true;
      // HACK: para verificar luego que el daño ha sido agregado al state
      $timeout(function() {
        paintData();
      });
    }

    function handleOnEditar(event) {
      vm.onEditar({
        $event: {
          idx: event.idx,
          danho: event.danho
        }
      });
    }

    function handleOnDelete() {
      vm.onDelete();
      // HACK: para verificar luego que el danho ha sido agregado al state
      $timeout(function() {
        $rootScope.$emit('danho:frmCerrado');
      });
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('DanhoController', DanhoController)
    .component('wpDanho', {
      templateUrl: '/webproc/app/components/detalle-asistencia/common/agregar-danho/danho/danho.html',
      controller: 'DanhoController',
      bindings: {
        idx: '=?',
        danho: '=?',
        onDelete: '&?',
        onEditar: '&?'
      }
    });
});
