'use strict';

define(['angular'], function(ng) {
  automasController.$inject = ['inspecFactory', '$uibModal'];

  function automasController(inspecFactory, $uibModal) {
    var vm = this;
    vm.$onInit = onInit;
    vm.clearData = clearData;
    vm.getModel = getModel;
    vm.showModal = showModal;
    vm.pageChanged = pageChanged;
    vm.filter = filter;
    vm.loadData = loadData;

    function onInit() {
      queryFilters().then(function() {
        clearData();
      });
    }

    function clearData() {
      vm.pagination = {
        currentPage: 1,
        maxSize: 10,
        totalRecords: 0
      };
      vm.query = {};
      vm.models = [];

      doFilter({});
    }

    function filter() {
      vm.pagination = {
        currentPage: 1,
        maxSize: 10,
        totalRecords: 0
      };

      doFilter({
        brandid: vm.query.mMarca.brandId,
        modelid: vm.query.mModelo ? vm.query.mModelo.modelId : null
      });
    }

    function loadData() {
      var vModal = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        size: 'lg',
        templateUrl: '/inspec/app/components/administracion/automas/modal-carga-masiva.html',
        controllerAs: '$ctrl',
        controller: [
          '$scope',
          'mModalAlert',
          '$uibModalInstance',
          'ErrorHandlerService',
          function($scope, mModalAlert, $uibModalInstance, ErrorHandlerService) {
            var vm = this;
            vm.closeModal = closeModal;
            vm.loadData = loadData;
            vm.formData = {};

            function closeModal() {
              $uibModalInstance.close();
            }

            function loadData() {
              inspecFactory.management
                .automasBulkUpload(vm.formData.planilla[0])
                .then(
                  function() {
                    mModalAlert.showSuccess('Carga exitosa', 'CARGA EXCEL').then(function() {
                      closeModal();
                      queryFilters().then(function() {
                        clearData();
                      });
                    });
                  },
                  function(e) {
                    ErrorHandlerService.handleError(e);
                  }
                )
                .catch(function(e) {
                  ErrorHandlerService.handleError(e);
                });
            }

            $scope.$watch(
              function() {
                return vm.formData.planilla;
              },
              function(newValue) {
                if (newValue) {
                  vm.formData.fileName = vm.formData.planilla[0].name;
                }
              }
            );
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

    function showModal(automas) {
      var vModal = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        size: 'md',
        templateUrl: '/inspec/app/components/administracion/automas/modal-automas-ver-mas.html',
        controllerAs: '$ctrl',
        controller: [
          '$scope',
          '$location',
          '$uibModalInstance',
          function($scope, $location, $uibModalInstance) {
            var vm = this;
            vm.closeModal = closeModal;
            vm.automas = automas;
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

    function handleQueryServiceResult(response) {
      vm.automas = response.data.data;
      vm.firstQueryCompleted = true;
      vm.pagination.totalRecords = response.total;
    }

    function doFilter(filledArguments) {
      filledArguments.pageNumber = vm.pagination.currentPage;
      filledArguments.pageSize = vm.pagination.maxSize;
      inspecFactory.management.automasMongoSearch(filledArguments, true).then(function(response) {
        handleQueryServiceResult(response);
      });
    }

    function getModel() {
      if (vm.query.mMarca.brandId) {
        return inspecFactory.management.automasMongoBrandFilter(vm.query.mMarca.brandId, true).then(function(response) {
          vm.models = response.models;
          vm.query.mModelo = null;
          vm.filter();
        });
      } else {
        vm.models = [];
        vm.query.mModelo = null;
      }
    }

    function queryFilters() {
      return inspecFactory.management.automasMongoFilters(true).then(function(response) {
        vm.brands = response.brands;
        vm.query = {
          mModelo: null
        };
      });
    }

    function pageChanged() {
      doFilter({
        brandid: vm.query.mMarca.brandId,
        modelid: vm.query.mModelo ? vm.query.mModelo.modelId : null
      });
    }
  }

  return ng
    .module('appInspec')
    .controller('AutomasController', automasController)
    .component('inspecAutomas', {
      templateUrl: '/inspec/app/components/administracion/automas/automas.html',
      controller: 'AutomasController',
      controllerAs: '$ctrl'
    });
});
