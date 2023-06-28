'use strict';

define(['angular'], function(ng) {
  parametrosController.$inject = ['inspecFactory', '$uibModal', 'mModalAlert'];

  function parametrosController(inspecFactory, $uibModal, mModalAlert) {
    var vm = this;
    vm.$onInit = onInit;
    vm.filter = filter;
    vm.clearData = clearData;
    vm.pageChanged = pageChanged;
    vm.showModal = showModal;

    function onInit() {
      clearData();
    }

    function clearData() {
      vm.pagination = {
        currentPage: 1,
        maxSize: 10,
        totalRecords: 0
      };

      vm.query = {
        mDescripcion: null
      };

      doFilter({});
    }

    function handleQueryServiceResult(response) {
      vm.parameters = response.data;

      vm.firstQueryCompleted = true;
      vm.pagination.totalRecords = response.total;
    }

    function showModal(parameter) {
      var isEdit = false;
      if (parameter) {
        isEdit = true;
      }
      var nextId = ng.copy(vm.pagination.totalRecords) + 1;
      var vModal = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        size: 'lg',
        templateUrl: '/inspec/app/components/administracion/parametros/modal-parametro.html',
        controllerAs: '$ctrl',
        controller: [
          '$timeout',
          '$uibModalInstance',
          function($timeout, $uibModalInstance) {
            var vm = this;
            vm.closeModal = closeModal;
            vm.isEdit = isEdit;
            vm.$onInit = onInit;
            vm.save = save;

            vm.statuses = [
              {
                Codigo: 'V',
                Descripcion: 'ACTIVO'
              },
              {
                Codigo: 'I',
                Descripcion: 'INACTIVO'
              }
            ];

            function onInit() {
              vm.formData = {};

              $timeout(function() {
                if (parameter) {
                  vm.formData.mCodigo = parameter.groupParameterId;
                  vm.formData.mDescripcion = parameter.description;
                  vm.formData.mEstado = {
                    Codigo: parameter.statusCode
                  };
                } else {
                  vm.formData.mCodigo = nextId;
                }
              });
            }

            function save() {
              vm.formData.markAsPristine();
              if (vm.formData.$valid) {
                var request = {
                  statusCode: vm.formData.mEstado.Codigo,
                  description: vm.formData.mDescripcion
                };

                if (vm.isEdit) {
                  request.groupParameterId = vm.formData.mCodigo;
                  inspecFactory.management.updateParameterGroup(request, true).then(function() {
                    mModalAlert
                      .showSuccess('Se actualizaron correctamente los datos', 'PARAMETRO ACTUALIZADO')
                      .then(function() {
                        closeModal(true);
                      });
                  });
                } else {
                  inspecFactory.management.addParameterGroup(request, true).then(function() {
                    mModalAlert.showSuccess('Se agregó el parametro', 'NUEVO PARAMETRO').then(function() {
                      closeModal(true);
                    });
                  });
                }
              }
            }

            function closeModal(bool) {
              $uibModalInstance.close(bool);
            }
          }
        ]
      });
      vModal.result.then(
        function(response) {
          if (response) {
            doFilter({});
          }
        },
        function(response) {
          if (response) {
            doFilter({});
          }
        }
      );
    }

    function filter() {
      var args = {
        description: vm.query.mDescripcion ? vm.query.mDescripcion.toUpperCase() : null
      };

      doFilter(args);
    }

    function doFilter(filledArguments) {
      filledArguments.pageNumber = vm.pagination.currentPage;
      filledArguments.pageSize = vm.pagination.maxSize;
      inspecFactory.management.searchParameterGroup(filledArguments, true).then(
        function(response) {
          vm.noResult = false;
          handleQueryServiceResult(response);
        },
        function() {
          vm.noResult = true;
        }
      );
    }

    function pageChanged() {
      filter();
    }
  }

  return ng
    .module('appInspec')
    .controller('ParametrosController', parametrosController)
    .component('inspecParametros', {
      templateUrl: '/inspec/app/components/administracion/parametros/parametros.html',
      controller: 'ParametrosController',
      controllerAs: '$ctrl'
    });
});
