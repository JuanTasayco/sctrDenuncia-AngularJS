'use strict';

define(['angular'], function(ng) {
  inspectoresController.$inject = ['$scope', '$rootScope', 'inspecFactory', '$uibModal'];

  function inspectoresController($scope, $rootScope, inspecFactory, $uibModal) {
    var vm = this;

    vm.$onInit = onInit;
    vm.pageChanged = pageChanged;
    vm.showModal = showModal;

    function onInit() {
      vm.pagination = {
        currentPage: 1,
        maxSize: 10,
        totalRecords: 0,
        mOrderBy: {Descripcion: 'Más reciente', Codigo: '1'}
      };
    }

    function handleQueryServiceResult(response) {
      vm.inspectors = response.data;
      vm.firstQueryCompleted = true;
      vm.pagination.totalRecords = response.total;
    }

    function doFilter(filledArguments) {
      filledArguments.pageNumber = vm.pagination.currentPage;
      filledArguments.pageSize = vm.pagination.maxSize;
      inspecFactory.management.inspectorSearch(filledArguments, true).then(function(response) {
        handleQueryServiceResult(response);
      });
    }

    function showModal() {
      var vModal = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        templateUrl: '/inspec/app/administracion/controller/modal-inspector.html',
        controllerAs: '$ctrl',
        controller: [
          '$scope',
          '$location',
          '$uibModalInstance',
          function($scope, $location, $uibModalInstance) {
            var vm = this;
            vm.closeModal = closeModal;
            function closeModal() {
              $uibModalInstance.close();
            }
          }
        ]
      });
      vModal.result.then(
        function() {
          //  todo
        },
        function() {
          //  todo
        }
      );
    }

    $scope.$on('fullFilter', function(e, a) {
      vm.pagination.currentPage = 1;
      $rootScope.$broadcast('resetOrderBy');
      doFilter(a);
    });

    $scope.$on('filter', function(e, a) {
      doFilter(a);
    });

    $scope.$on('clearFilter', function(e, a) {
      vm.pagination.currentPage = 1;
      $rootScope.$broadcast('resetOrderBy');
      doFilter(a);
    });

    function pageChanged() {
      $rootScope.$broadcast('callFilterFromChildren');
    }
  }

  return ng
    .module('appInspec')
    .controller('InspectoresController', inspectoresController)
    .component('inspecInspectores', {
      templateUrl: '/inspec/app/components/administracion/inspectores/inspectores.html',
      controller: 'InspectoresController',
      controllerAs: '$ctrl'
    });
});
