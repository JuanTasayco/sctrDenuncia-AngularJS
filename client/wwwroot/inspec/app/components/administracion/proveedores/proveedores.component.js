'use strict';

define(['angular', 'moment', 'lodash'], function(ng, moment, _) {
  proveedoresController.$inject = [
    '$scope',
    '$rootScope',
    'inspecFactory',
    '$uibModal',
    'mModalAlert',
    'mModalConfirm'
  ];

  function proveedoresController($scope, $rootScope, inspecFactory, $uibModal, mModalAlert, mModalConfirm) {
    var vm = this;
    vm.$onInit = onInit;
    vm.pageChanged = pageChanged;
    vm.showModal = showModal;
    vm.deleteProvider = deleteProvider;
    vm.clearData = clearData;
    vm.filter = filter;

    function onInit() {
      clearData();
      getTipoDocumento();
    }

    function clearData() {
      vm.pagination = {
        currentPage: 1,
        maxSize: 10,
        totalRecords: 0
      };

      vm.query = {
        mNroDocumento: null,
        mTipoDocumento: null,
        mRazSocial: null
      };

      doFilter({});
    }

    function filter() {
      var args = {
        documentTypeCode: vm.query.mTipoDocumento.Codigo,
        documentNumber: vm.query.mNroDocumento,
        providerName: vm.query.mRazSocial ? vm.query.mRazSocial.toUpperCase() : null
      };

      doFilter(args);
    }

    function handleQueryServiceResult(response) {
      vm.providers = _.map(response.data, function(row) {
        row.feC_CRE = moment(row.feC_CRE).toDate();
        return row;
      });

      vm.firstQueryCompleted = true;
      vm.pagination.totalRecords = response.total;
    }

    function doFilter(filledArguments) {
      filledArguments.pageNumber = vm.pagination.currentPage;
      filledArguments.pageSize = vm.pagination.maxSize;
      inspecFactory.management.providerSearch(filledArguments, true).then(
        function(response) {
          vm.noResult = false;
          handleQueryServiceResult(response);
        },
        function() {
          vm.noResult = true;
        }
      );
    }

    function showModal() {
      var documentTypeData = vm.documentTypeData;
      var vModal = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        templateUrl: '/inspec/app/components/administracion/proveedores/modal-nuevo-proveedor.html',
        controllerAs: '$ctrl',
        controller: [
          '$scope',
          '$location',
          '$uibModalInstance',
          'ErrorHandlerService',
          function($scope, $location, $uibModalInstance, ErrorHandlerService) {
            var vm = this;
            vm.closeModal = closeModal;
            vm.pageChanged = pageChanged;
            vm.filter = filter;
            vm.documentTypeData = documentTypeData;
            vm.doFilter = doFilterA;
            vm.clearData = clearData;
            vm.$onInit = onInit;
            vm.assign = assign;

            function onInit() {
              vm.pagination = {
                currentPage: 1,
                maxSize: 10,
                totalRecords: 0,
                mOrderBy: {Descripcion: 'Más reciente', Codigo: '1'}
              };
            }

            function filter() {
              var args = {
                documentTypeCode: vm.formData.mTipoDocumento.Codigo,
                documentNumber: vm.formData.mNroDocumento,
                providerName: vm.formData.mRazSocial ? vm.formData.mRazSocial.toUpperCase() : null
              };

              doFilterA(args);
            }

            function assign(provider) {
              var args = {
                documentTypeCode: provider.tiP_DOCUM,
                documentNumber: provider.coD_DOCUM,
                providerName: provider.noM_TERCERO
              };

              inspecFactory.management
                .addProvider(args, true)
                .then(
                  function() {
                    mModalAlert
                      .showSuccess('El proveedor se agregó correctamente', 'NUEVO PROVEEDOR ASIGNADO')
                      .then(function() {
                        closeModal();
                      });
                  },
                  function(e) {
                    ErrorHandlerService.handleError(e.data.data.message);
                  }
                )
                .catch(function(e) {
                  ErrorHandlerService.handleError(e.data.data.message);
                });
            }

            function clearData() {
              vm.pagination = {
                currentPage: 1,
                maxSize: 10,
                totalRecords: 0
              };

              vm.formData = {
                mNroDocumento: null,
                mTipoDocumento: null,
                mRazSocial: null
              };

              vm.providers = [];
            }

            function handleQueryServiceResult(response) {
              vm.providers = _.map(response.data, function(row) {
                row.feC_CRE = moment(row.feC_CRE).toDate();
                return row;
              });

              vm.firstQueryCompleted = true;
              vm.pagination.totalRecords = response.total;
            }

            function doFilterA(filledArguments) {
              filledArguments.pageNumber = vm.pagination.currentPage;
              filledArguments.pageSize = vm.pagination.maxSize;
              inspecFactory.management.providerSearchTron(filledArguments, true).then(
                function(response) {
                  vm.noResult = false;
                  handleQueryServiceResult(response);
                },
                function() {
                  vm.noResult = true;
                }
              );
            }

            function closeModal() {
              $uibModalInstance.close();
            }

            function pageChanged() {
              doFilterA({});
            }
          }
        ]
      });
      vModal.result.then(
        function() {
          //  todo
          doFilter({});
        },
        function() {
          //  todo
          doFilter({});
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

    function getTipoDocumento() {
      return inspecFactory.common.getTipoDocumento().then(function(response) {
        vm.documentTypeData = response.Data;
      });
    }

    function deleteProvider(documentNumber, documentTypeCode) {
      mModalConfirm
        .confirmInfo('¿Está seguro de querer eliminar al siguiente proveedor?', 'ELIMINAR PROVEEDOR', 'ELIMINAR')
        .then(function() {
          var request = {
            documentTypeCode: documentTypeCode,
            documentNumber: documentNumber
          };
          return inspecFactory.management.deleteProvider(request, true).then(function() {
            mModalAlert.showSuccess('Proveedor eliminado exitosamente', '').then(function() {
              clearData();
            });
          });
        });
    }

    function pageChanged() {
      doFilter({});
    }
  }

  return ng
    .module('appInspec')
    .controller('ProveedoresController', proveedoresController)
    .component('inspecProveedores', {
      templateUrl: '/inspec/app/components/administracion/proveedores/proveedores.html',
      controller: 'ProveedoresController',
      controllerAs: '$ctrl'
    });
});
