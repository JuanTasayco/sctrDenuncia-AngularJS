define([
  'angular', 'constants', 'nsctr_constants',
  'nsctrFactoryJs', 'nsctrServiceJs'
], function (ng) {
  WorkersListController.$inject = ['$scope'];
  function WorkersListController($scope) {
    var vm = this;
    vm.$onInit = function () {
    };
  } // end controller
  return ng.module('appNsctr')
    .controller('nsctrWorkersListController', WorkersListController)
    .component('nsctrWorkersList', {
      templateUrl: '/nsctr/app/common/components/workersList/workersList.component.html',
      controller: 'nsctrWorkersListController',
      bindings: {
        trabajadores: '=',
        risk: '=',
      }
    })
});
