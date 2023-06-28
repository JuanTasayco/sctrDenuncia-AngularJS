'use strict';

define(['angular', 'lodash'], function(ng, _) {
  ListaFilterController.$inject = ['$scope'];
  function ListaFilterController($scope) {
    var vm = this;
    vm.toggleSeleccion;
    vm.emitirSeleccionCbo = emitirSeleccionCbo;
    vm.listaCombo;
    vm.seleccionarTodos = seleccionarTodos;
    vm.onChangelistaSeleccionada = onChangelistaSeleccionada;

    var watchListaOrigen = $scope.$watch('$ctrl.listaChecks', function(nv, ov) {
      if (nv && nv !== ov) {
        var arrSeleccionadosLength = getSeleccionados(nv).length;
        var arrOrigenLength = nv.length;
        vm.toggleSeleccion = arrSeleccionadosLength === arrOrigenLength ? true : false;
      }
    });

    $scope.$on('$destroy', function destroy() {
      watchListaOrigen();
    });

    /**
     * definicion de funciones
     */

    function emitirSeleccionCbo() {
      vm.toggleSeleccion = false;
      if (ng.isFunction(vm.onSeleccionarCbo)) {
        vm.onSeleccionarCbo({
          $event: {
            dato: vm.cbo
          }
        });
      }
    }

    function getSeleccionados(lst) {
      return _.filter(lst, function fFn(item) {
        return item.estado.toUpperCase() === 'V';
      });
    }

    function seleccionarTodos() {
      vm.toggleSeleccion = !vm.toggleSeleccion;
      vm.listaSeleccionada = vm.toggleSeleccion ? ng.copy(vm.listaChecks) : [];
    }

    function onChangelistaSeleccionada() {
      var arrSeleccionadosLength = vm.listaSeleccionada.length;
      var arrOrigenLength = vm.listaChecks.length;
      vm.toggleSeleccion = arrSeleccionadosLength > 0 && arrSeleccionadosLength === arrOrigenLength ? true : false;
    }
  } // end controller

  return ng.module('appWp').controller('ListaFilterController', ListaFilterController).component('wpListaFilter', {
    templateUrl: '/webproc/app/components/filtro-asistencia/lista-filter/lista-filter.html',
    controller: 'ListaFilterController',
    bindings: {
      listaCombo: '=?',
      listaChecks: '=?',
      listaSeleccionada: '=?',
      onSeleccionarCbo: '&?',
      onGuardar: '&?',
      wptitle: '@'
    }
  });
});
