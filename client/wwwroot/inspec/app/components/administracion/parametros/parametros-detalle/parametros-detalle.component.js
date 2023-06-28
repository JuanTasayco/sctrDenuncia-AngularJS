'use strict';

define(['angular'], function(ng) {
  parametrosDetalleController.$inject = ['inspecFactory', '$uibModal', 'mModalAlert', '$stateParams', '$state'];

  function parametrosDetalleController(inspecFactory, $uibModal, mModalAlert, $stateParams, $state) {
    var vm = this;
    vm.$onInit = onInit;
    vm.pageChanged = pageChanged;
    vm.showModal = showModal;

    function onInit() {
      if (!$stateParams.parameter) {
        $state.go('administracionParametro');
      }
      vm.parameter = $stateParams.parameter;
      doFilter({});
    }

    function handleQueryServiceResult(response) {
      vm.details = response;
      vm.firstQueryCompleted = true;
    }

    function doFilter(filledArguments) {
      filledArguments.groupId = vm.parameter.groupParameterId;
      inspecFactory.management.searchParameterDetail(filledArguments, true).then(
        function(response) {
          vm.noResult = false;
          handleQueryServiceResult(response);
        },
        function() {
          vm.noResult = true;
        }
      );
    }

    function showModal(detail) {
      var isEdit = false;
      if (detail) {
        isEdit = true;
      }
      var groupId = vm.parameter.groupParameterId;
      var nextId = ng.copy(vm.details.length) + 1;
      var vModal = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        size: 'lg',
        templateUrl: '/inspec/app/components/administracion/parametros/parametros-detalle/modal-parametro-detalle.html',
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
                if (detail) {
                  vm.formData.mDescripcion = detail.description;
                  vm.formData.mCodigo = detail.groupParameterId;
                  vm.formData.mCodigoParametro = detail.parameterId;
                  vm.formData.mEstado = {
                    Codigo: detail.statusCode
                  };
                  vm.formData.mValor1 = detail.firstValue;
                  vm.formData.mValor2 = detail.secondValue;
                  vm.formData.mValor3 = detail.thirdValue;
                } else {
                  vm.formData.mCodigo = groupId;
                  vm.formData.mCodigoParametro = nextId;
                }
              });
            }

            function save() {
              vm.formData.markAsPristine();
              if (vm.formData.$valid) {
                var request = {
                  groupParameterId: vm.formData.mCodigo,
                  statusCode: vm.formData.mEstado.Codigo,
                  description: vm.formData.mDescripcion,
                  firstValue: vm.formData.mValor1,
                  secondValue: vm.formData.mValor2,
                  thirdValue: vm.formData.mValor3
                };

                if (vm.isEdit) {
                  request.parameterId = vm.formData.mCodigoParametro;
                  inspecFactory.management.updateParameterDetail(request, true).then(function() {
                    mModalAlert
                      .showSuccess('Se actualizaron correctamente los datos', 'DETALLE ACTUALIZADO')
                      .then(function() {
                        closeModal(true);
                      });
                  });
                } else {
                  inspecFactory.management.addParameterDetail(request, true).then(function() {
                    mModalAlert.showSuccess('Se agregó el detalle', 'NUEVO DETALLE').then(function() {
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
    function pageChanged() {
      doFilter({});
    }
  }

  return ng
    .module('appInspec')
    .controller('ParametrosDetalleController', parametrosDetalleController)
    .component('inspecParametrosDetalle', {
      templateUrl: '/inspec/app/components/administracion/parametros/parametros-detalle/parametros-detalle.html',
      controller: 'ParametrosDetalleController',
      controllerAs: '$ctrl'
    });
});
