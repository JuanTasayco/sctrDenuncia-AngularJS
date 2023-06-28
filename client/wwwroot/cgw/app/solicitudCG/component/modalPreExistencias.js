define([
  'angular'
], function(ng) {

  ModalPreExistenciasController.$inject = ['$scope'];

  function ModalPreExistenciasController($scope) {
    var vm = this;
  }

  return ng.module('appCgw')
    .controller('ModalPreExistenciasController', ModalPreExistenciasController)
    .component('mpfModalPreExistencias', {
      templateUrl: '/cgw/app/solicitudCG/component/modalPreExistencias.html',
      controller: 'ModalPreExistenciasController',
      bindings: {
        data: '=',
        close: '&'
      }
    })
    .directive('preventDefault', function() {
      return function(scope, element, attrs) {
          ng.element(element).bind('click', function(event) {
              event.preventDefault();
              event.stopPropagation();
          });
      }
    });
});
