'use strict';

define(['angular'], function(ng) {
  asignacionController.$inject = ['$scope', '$rootScope', 'inspecFactory', '$uibModal', 'mModalConfirm', 'mModalAlert'];

  function asignacionController($scope, $rootScope, inspecFactory, $uibModal, mModalConfirm, mModalAlert) {
    var vm = this;
    vm.$onInit = onInit;
    vm.getAgents = getAgents;
    vm.deleteRule = deleteRule;
    vm.pageChanged = pageChanged;
    vm.showModal = showModal;
    vm.clearData = clearData;
    vm.filter = filter;

    function onInit() {
      clearData();
      getProviders();
    }

    function clearData() {
      vm.pagination = {
        currentPage: 1,
        maxSize: 10,
        totalRecords: 0
      };

      vm.query = {
        mProvider: null,
        mAgent: null,
        mUbigeo: null
      };

      doFilter({});
    }

    function filter() {
      var args = {
        providerDocumentTypeCode: vm.query.mProvider ? vm.query.mProvider.documentType : null,
        providerDocument: vm.query.mProvider ? vm.query.mProvider.documentCode : null,
        provider: vm.query.mProvider ? vm.query.mProvider.providerName : null,
        agentId: vm.query.mAgent ? vm.query.mAgent.CodigoAgente : null,
        departmentId: vm.query.mUbigeo && vm.query.mUbigeo.mDepartamento ? vm.query.mUbigeo.mDepartamento.Codigo : null,
        provinceId: vm.query.mUbigeo && vm.query.mUbigeo.mProvincia ? vm.query.mUbigeo.mProvincia.Codigo : null,
        districtId: vm.query.mUbigeo && vm.query.mUbigeo.mDistrito ? vm.query.mUbigeo.mDistrito.Codigo : null
      };

      doFilter(args);
    }

    function handleQueryServiceResult(response) {
      vm.rules = response.data;

      vm.firstQueryCompleted = true;
      vm.pagination.totalRecords = response.total;
    }

    function doFilter(filledArguments) {
      filledArguments.pageNumber = vm.pagination.currentPage;
      filledArguments.pageSize = vm.pagination.maxSize;
      inspecFactory.management.assignRulesSearch(filledArguments, true).then(
        function(response) {
          vm.noResult = false;
          handleQueryServiceResult(response);
        },
        function() {
          vm.noResult = true;
        }
      );
    }

    function getProviders() {
      return inspecFactory.common.GetProviders().then(function(response) {
        vm.providers = response;
      });
    }

    function getAgents(input) {
      return inspecFactory.common.getAgents(input).then(function(response) {
        return response.Data;
      });
    }

    function deleteRule(rule) {
      mModalConfirm
        .confirmInfo(
          '¿Está seguro de querer eliminar la siguiente regla de asignación?',
          'ELIMINAR REGLA DE ASIGNACIÓN',
          'ELIMINAR'
        )
        .then(function() {
          rule.statusCode = 'S';
          return inspecFactory.management.updAssignRule(rule, true).then(function() {
            mModalAlert.showSuccess('Regla de asignación eliminada exitosamente', '').then(function() {
              clearData();
            });
          });
        });
    }

    function showModal(rule) {
      var providers = vm.providers;
      var isEdit = false;
      if (rule) {
        isEdit = true;
      }
      var vModal = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        templateUrl: '/inspec/app/components/administracion/asignacion/modal-nueva-asignacion.html',
        controllerAs: '$ctrl',
        controller: [
          '$uibModalInstance',
          '$timeout',
          function($uibModalInstance, $timeout) {
            var vm = this;
            vm.$onInit = onInit;
            vm.getAgents = getAgents;
            vm.providers = providers;
            vm.closeModal = closeModal;
            vm.save = save;
            vm.isEdit = isEdit;

            vm.statuses = [
              {
                Codigo: 'N',
                Descripcion: 'HABILITADO'
              },
              {
                Codigo: 'S',
                Descripcion: 'INHABILITADO'
              }
            ];

            function onInit() {
              vm.formData = {};
              if (rule) {
                $timeout(function() {
                  vm.formData.mProvider = {};
                  vm.formData.mProvider.documentType = rule.providerDocumentTypeCode;
                  vm.formData.mProvider.documentCode = rule.providerDocument;
                  vm.formData.mProvider.providerName = rule.provider;
                  vm.formData.mAgent = {};
                  vm.formData.mAgent.CodigoAgente = rule.agentId === 999999 ? null : rule.agentId;
                  vm.formData.mAgent.CodigoNombre = rule.agent;
                  vm.formData.mUbigeo = {};
                  vm.formData.mUbigeo.mDepartamento = {};
                  vm.formData.mUbigeo.mDepartamento.Codigo = rule.departmentId === 99 ? null : rule.departmentId;
                  vm.formData.mUbigeo.mProvincia = {};
                  vm.formData.mUbigeo.mProvincia.Codigo = rule.provinceId === 99 ? null : rule.provinceId;
                  vm.formData.mUbigeo.mDistrito = {};
                  vm.formData.mUbigeo.mDistrito.Codigo = rule.districtId === 999999 ? null : rule.districtId;
                  vm.formData.mEstado = {};
                  vm.formData.mEstado.Codigo = rule.statusCode;
                });
              }
            }

            function save() {
              vm.formData.markAsPristine();
              if (vm.formData.$valid) {
                var request = {
                  providerDocumentTypeCode: vm.formData.mProvider.documentType,
                  providerDocument: vm.formData.mProvider.documentCode,
                  provider: vm.formData.mProvider.providerName,
                  agentId: vm.formData.mAgent ? vm.formData.mAgent.CodigoAgente || 999999 : 999999,
                  agent: vm.formData.mAgent ? vm.formData.mAgent.CodigoNombre : '-TODOS-',
                  departmentId:
                    vm.formData.mUbigeo && vm.formData.mUbigeo.mDepartamento
                      ? vm.formData.mUbigeo.mDepartamento.Codigo || 99
                      : 99,
                  department:
                    vm.formData.mUbigeo && vm.formData.mUbigeo.mDepartamento
                      ? vm.formData.mUbigeo.mDepartamento.Descripcion
                      : 'TODOS',
                  provinceId:
                    vm.formData.mUbigeo && vm.formData.mUbigeo.mProvincia
                      ? vm.formData.mUbigeo.mProvincia.Codigo || 99
                      : 99,
                  province:
                    vm.formData.mUbigeo && vm.formData.mUbigeo.mProvincia
                      ? vm.formData.mUbigeo.mProvincia.Descripcion
                      : 'TODOS',
                  districtId:
                    vm.formData.mUbigeo && vm.formData.mUbigeo.mDistrito
                      ? vm.formData.mUbigeo.mDistrito.Codigo || 999999
                      : 999999,
                  district:
                    vm.formData.mUbigeo && vm.formData.mUbigeo.mDistrito
                      ? vm.formData.mUbigeo.mDistrito.Descripcion
                      : 'TODOS',
                  statusCode: vm.formData.mEstado.Codigo,
                  status: vm.formData.mEstado.Descripcion
                };

                if (vm.isEdit) {
                  request.assignRuleId = rule.assignRuleId;
                  inspecFactory.management.updAssignRule(request, true).then(function() {
                    mModalAlert
                      .showSuccess('Se actualizaron correctamente los datos', 'REGLA ACTUALIZADA')
                      .then(function() {
                        closeModal(true);
                      });
                  });
                } else {
                  inspecFactory.management.addAssignRule(request, true).then(function() {
                    mModalAlert
                      .showSuccess('Se agregó la regla de asignación', 'NUEVA REGLA ASIGNADA')
                      .then(function() {
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
      vModal.result.then(function(response) {
        //  todo
        if (response) {
          doFilter({});
        }
      });
    }

    function pageChanged() {
      filter();
    }
  }

  return ng
    .module('appInspec')
    .controller('AsignacionController', asignacionController)
    .component('inspecAsignacion', {
      templateUrl: '/inspec/app/components/administracion/asignacion/asignacion.html',
      controller: 'AsignacionController',
      controllerAs: '$ctrl'
    });
});
