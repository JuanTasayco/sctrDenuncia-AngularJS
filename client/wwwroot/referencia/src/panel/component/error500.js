'use strict';
define(['angular'], function(ng) {


  errorCtrl.$inject = ['$state', '$window'];

  function errorCtrl($state, $window) {
    var vm = this;
    vm.irInicio = function iiFn() {
      $window.location.href = '/';
    };

    vm.recargarPagina = function cpFn() {
      if ($state.params && $state.params.transitionState) {
        $state.go($state.params.transitionState);
      } else {
        $window.location.href = '/';
      }
    };
  }

  return ng.module('referenciaApp')
    .controller('ErrorController', errorCtrl);
});
