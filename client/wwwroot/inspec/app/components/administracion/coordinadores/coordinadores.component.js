'use strict';

define(['angular'], function(ng) {
  coordinadoresController.$inject = ['$scope', '$rootScope', 'inspecFactory', '$uibModal', 'UserService'];

  function coordinadoresController($scope, $rootScope, inspecFactory, $uibModal, UserService) {
    var vm = this;

    vm.$onInit = onInit;
    vm.pageChanged = pageChanged;
    vm.newCoordinator = newCoordinator;

    function onInit() {
      vm.user = UserService;
      vm.pagination = {
        currentPage: 1,
        maxSize: 10,
        totalRecords: 0,
        mOrderBy: {Descripcion: 'Más reciente', Codigo: '1'}
      };
    }

    function handleQueryServiceResult(response) {
      vm.coordinators = response.data;
      vm.firstQueryCompleted = true;
      vm.pagination.totalRecords = response.total;
    }

    function doFilter(filledArguments) {
      filledArguments.pageNumber = vm.pagination.currentPage;
      filledArguments.pageSize = vm.pagination.maxSize;
      inspecFactory.management.coordinatorSearch(filledArguments, true).then(function(response) {
        handleQueryServiceResult(response);
      });
    }

    function newCoordinator() {
      showModal();
    }

    function showModal() {
      var vModal = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        templateUrl: '/inspec/app/components/administracion/coordinadores/modal-coordinador.html',
        controllerAs: '$ctrl',
        controller: [
          '$uibModalInstance',
          function($uibModalInstance) {
            var vm = this;

            vm.closeModal = closeModal;
            queryProviders();
            queryTipoDocumento();

            function closeModal() {
              $uibModalInstance.close();
            }

            function queryTipoDocumento() {
              return inspecFactory.common.getTipoDocumento().then(function(response) {
                vm.documentTypeData = response.Data;
              });
            }

            function queryProviders() {
              return inspecFactory.common
                .GetProviders()
                .then(function(response) {
                  return response.map(function(element) {
                    return {
                      name: element.providerName,
                      document: {
                        type: element.documentType,
                        code: element.documentCode
                      }
                    };
                  });
                })
                .then(function(providers) {
                  vm.providers = providers;
                });
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
    .controller('CoordinadoresController', coordinadoresController)
    .component('inspecCoordinadores', {
      templateUrl: '/inspec/app/components/administracion/coordinadores/coordinadores.html',
      controller: 'CoordinadoresController',
      controllerAs: '$ctrl'
    });
});
