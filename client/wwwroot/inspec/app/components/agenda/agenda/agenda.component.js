'use strict';

define(['angular'], function(ng) {
  agendaController.$inject = [
    '$log',
    '$stateParams',
    '$scope',
    '$rootScope',
    'inspecFactory',
    '$window',
    '$uibModal',
    'UserService'
  ];

  function agendaController($log, $stateParams, $scope, $rootScope, inspecFactory, $window, $uibModal, UserService) {
    $window.document.title = 'OIM - Inspecciones Autos - Solicitud Nueva';
    var vm = this;
    vm.$onInit = onInit;
    vm.showNoDisponibilidad = showNoDisponibilidad;

    function onInit() {
      vm.user = UserService;
    }

    function showNoDisponibilidad() {
      $scope.$broadcast('permissionAgent');
    }
  }

  return ng
    .module('appInspec')
    .controller('AgendaController', agendaController)
    .component('inspecAgenda', {
      templateUrl: '/inspec/app/components/agenda/agenda/agenda.html',
      controller: 'AgendaController',
      controllerAs: '$ctrl'
    });
});
