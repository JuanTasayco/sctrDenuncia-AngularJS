'use strict';

define(['angular'], function(ng) {
  TitleController.$inject = ['$scope', '$state', 'inspecFactory'];

  function TitleController($scope, $state, inspecFactory) {
    var vm = this;
    vm.canDo = inspecFactory.canDo;
    vm.$onInit = onInit;
    vm.currentOffsetClass = currentOffsetClass;
    vm.showNewRequest = showNewRequest;
    vm.showNewInspection = showNewInspection;
    vm.showVoid = showVoid;
    vm.showContinueWithoutCotz = showContinueWithoutCotz;

    function onInit() {
      vm.selectedRequests = 0;
      vm.hasActions = $state.current.name === 'solicitudes';
    }

    function currentOffsetClass() {
      var counter = 3;
      if (vm.canDo('REGSOL')) {
        counter--;
      }
      if (vm.canDo('REGINS')) {
        counter--;
      }
      if (vm.canDo('ANUSOL')) {
        counter--;
      }
      return counter !== 3 && counter !== 0 ? 'col-sm-' + counter * 4 : '';
    }

    function showNewRequest() {
      $scope.$emit('showNewRequest');
    }

    function showNewInspection() {
      $scope.$emit('showNewInspection');
    }

    function showVoid() {
      $scope.$emit('showVoid');
    }

    function showContinueWithoutCotz() {
      $scope.$emit('showContinueWithoutCotz');
    }

    $scope.$on('changedSelectedRequests', function(event, data) {
      vm.selectedRequests = data;
    });
  } // end controller

  return ng
    .module('appInspec')
    .controller('TitleController', TitleController)
    .component('titleSection', {
      templateUrl: '/inspec/app/common/title/title.html',
      controller: 'TitleController',
      controllerAs: '$ctrl',
      bindings: {
        title: '@',
        fromRequest: '='
      }
    });
});
