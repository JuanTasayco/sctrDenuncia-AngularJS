'use strict';
/**
 * mxPaginador:
 * wrapea al paginador y el msg cuando no hay data
 *
 * @param {Object[]} datos - Array de datos (se usa para hacer un .length) de la pagina actual
 * @param {number} itemsXPage - Cantidad de items por pagina
 * @param {string} msgVacio - Mensaje a mostrar cuando no haya datos
 * @param {(index: number) => void} onPaginar - Callback cuando se cambia de pagina
 * @param {number} paginaActual - Indicador de la pagina a mostrar. Se usa en el ng-model del uib-pagination
 * @param {number} totalItems - Cantidad total
 */

define(['angular'], function(ng) {
  MxPaginadorController.$inject = ['$scope'];
  function MxPaginadorController($scope) {
    var vm = this;
    var watchArrayDatos;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.setPage = setPage;

    /**
     * Declaracion de funciones
     */

    function onInit() {
      watchArrayDatos = $scope.$watchCollection('$ctrl.datos', function(nv, ov) {
        vm.areTherePages = (vm.itemsXPage - vm.totalItems) < 0 ? true : false;
      });
    }

    function onDestroy() {
      watchArrayDatos();
    }

    function setPage(index) {
      vm.onPaginar({
        $event: {
          esPaginacion: true,
          pageToLoad: index
        }
      });
    }
  } // end controller

  return ng
    .module('mapfre.controls')
    .controller('MxPaginadorController', MxPaginadorController)
    .component('mxPaginador', {
      templateUrl: '/scripts/mpf-main-controls/components/mx-paginador/mx-paginador.html',
      controller: 'MxPaginadorController',
      bindings: {
        datos: '=?',
        itemsXPage: '<?',
        msgVacio: '<?',
        onPaginar: '&?',
        paginaActual: '=?',
        totalItems: '=?'
      }
    });
});
