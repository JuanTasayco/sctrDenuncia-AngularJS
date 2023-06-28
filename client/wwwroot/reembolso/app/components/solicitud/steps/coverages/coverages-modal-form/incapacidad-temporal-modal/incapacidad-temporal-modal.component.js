'use strict';

define(['angular', 'lodash'], function (ng, _) {
  ReTemporaryDisabilityModalController.$inject = ['reFactory', 'reServices', '$log'];

  function ReTemporaryDisabilityModalController(reFactory, reServices, $log) {
    var vm = this;
    vm.$onInit = onInit;
    vm.$onChanges = onChanges;
    vm.cerrar = cerrar;
    vm.aceptar = aceptar;
    vm.changeBenefitStartDate = changeBenefitStartDate;
    vm.addCompensation = addCompensation;
    vm.calculationCompensation = calculationCompensation;
    vm.deleteCompensation = deleteCompensation;
    vm.editCompensation = editCompensation;
    vm.cleanCompensation = cleanCompensation;

    function onInit() {
      vm.isDisabledEndDate = !vm.isCurrentEdit;
      vm.isEditFlow = vm.isCurrentEdit || false;

      if (vm.isEditFlow) {
        vm.frmCoverage = _.assign({}, vm.frmCoverage, {
          benefitDateStart: new reFactory.common.DatePicker(new Date(vm.frmCoverage.benefitDateStart)),
          benefitDateEnd: new reFactory.common.DatePicker(new Date(vm.frmCoverage.benefitDateEnd))
        })
      } else {
        _mapInitForm(vm.frmData || {});
      }
    }

    function onChanges(changes) {
      if (changes.frmData) {
        vm.frmCoverage = _.assign({}, vm.frmCoverage, vm.frmData);

        if (_.keys(vm.frmData).length > 0) {
          vm.frmCoverage = _.assign({}, vm.frmCoverage, {
            benefitDateEnd: vm.frmData.benefitDateEnd ?
              new reFactory.common.DatePicker(new Date(vm.frmData.benefitDateEnd)) : new reFactory.common.DatePicker(vm.frmCoverage.benefitDateEnd.model),
          })
        }
      }
    }

    function changeBenefitStartDate(date) {
      vm.isDisabledEndDate = false;
      vm.frmCoverage.benefitDateEnd.setMinDate(date);

      if (vm.frmCoverage.benefitDateEnd.model && (date < vm.frmCoverage.benefitDateEnd.model)) {
        callCalculationService();
      }
    }

    function cleanCompensation() {
      _mapInitForm();
    }

    function addCompensation() {
      if (vm.frmModal.$invalid) {
        vm.frmModal.markAsPristine();
        return void 0;
      }

      var serviceData = {
        request: _.assign({}, vm.frmCoverage, {
          benefitDateStart: vm.frmCoverage.benefitDateStart.model,
          benefitDateEnd: vm.frmCoverage.benefitDateEnd.model
        }),
        serviceName: vm.isEditFlow ? 'UpdateTemporaryDisability' : 'SaveTemporaryDisability'
      }
      _mapInitForm();
      vm.frmModal.$setPristine();
      vm.callSave(serviceData);
    }

    function calculationCompensation(endDate) {
      if (endDate) {
        if (vm.frmCoverage.benefitDateStart.model > endDate) {
          vm.wrongDate = true;
          return void 0;
        }

        callCalculationService();
      }
    }

    function deleteCompensation(serviceData) {
      var data = {
        request: {
          compensationCorrelativeNumber: serviceData.compensationCorrelativeNumber,
          compensationStatus: serviceData.compensationStatus,
          index: serviceData.index
        },
        serviceName: serviceData.serviceName
      }
      vm.callDelete(data);
    }

    function editCompensation(item) {
      vm.isEditFlow = true;
      vm.isDisabledEndDate = false;
      vm.frmCoverage = _.assign({}, item, {
        benefitDateStart: new reFactory.common.DatePicker(new Date(item.benefitDateStart)),
        benefitDateEnd: new reFactory.common.DatePicker(new Date(item.benefitDateEnd))
      });
      vm.frmCoverage.benefitDateEnd.setMinDate(new reFactory.common.AddDaysToDate(new Date(new Date().setHours(0, 0, 0, 0)), 1)); //(vm.frmCoverage.benefitDateStart.model);
    }

    function cerrar() {
      vm.closeModal();
    }

    function aceptar() {
      vm.closeModal({
        status: 'ok'
      })
    }

    function callCalculationService() {
      vm.wrongDate = false;
      var serviceData = {
        request: vm.isConnectedDb && (vm.documentLiquidationData && vm.documentLiquidationData.documentControlNumber) ? _mapRequestCalculationConnected() : _mapRequestCalculationDisconnected(),
        serviceName: vm.isConnectedDb && (vm.documentLiquidationData && vm.documentLiquidationData.documentControlNumber) ? 'CalculationTemporaryDisability' : 'CalculationForTemporaryDisabilityOff'
      };
      vm.callCalculation(serviceData);
    }

    // privates

    function _mapInitForm(frmData) {
      vm.isDisabledEndDate = true;
      vm.isEditFlow = false;
      vm.frmCoverage = _.assign({}, frmData, {
        benefitDateStart: _.keys(frmData).length > 0 ?
          new reFactory.common.DatePicker(new Date(frmData.benefitDateStart)) : new reFactory.common.DatePicker(),
        benefitDateEnd: _.keys(frmData).length > 0 ?
          new reFactory.common.DatePicker(new Date(frmData.benefitDateEnd)) : new reFactory.common.DatePicker()
      });
      vm.frmCoverage.benefitDateEnd.setMinDate(new reFactory.common.AddDaysToDate(new Date(new Date().setHours(0, 0, 0, 0)), 1)); //(vm.frmCoverage.benefitDateStart.model);
    }

    function _mapRequestCalculationConnected() {
      return _.assign({}, {
        benefitDateStart: vm.frmCoverage.benefitDateStart.model,
        benefitDateEnd: vm.frmCoverage.benefitDateEnd.model,
        compensationCorrelativeNumber: vm.frmCoverage.compensationCorrelativeNumber || 0,
        totalBenefitDays: reServices.sumProperty(vm.compensationList, 'benefitNumberDays')
      })
    }

    function _mapRequestCalculationDisconnected() {
      if (vm.compensationList.length < 1) {
        return {
          periodOfBenefitDays: [{
            benefitDateStart: vm.frmCoverage.benefitDateStart.model,
            benefitDateEnd: vm.frmCoverage.benefitDateEnd.model,
            index: 1,
            selected: true
          }]
        }
      } else {
        var arrItems = _.map(vm.compensationList, function (item) {
          return {
            benefitDateStart: vm.frmCoverage.index === item.index ?
              vm.frmCoverage.benefitDateStart.model : item.benefitDateStart,
            benefitDateEnd: vm.frmCoverage.index === item.index ?
              vm.frmCoverage.benefitDateEnd.model : item.benefitDateEnd,
            index: item.index,
            selected: vm.frmCoverage.index === item.index
          }
        });

        return {
          periodOfBenefitDays: vm.isEditFlow ? arrItems : arrItems.concat({
            benefitDateStart: vm.frmCoverage.benefitDateStart.model,
            benefitDateEnd: vm.frmCoverage.benefitDateEnd.model,
            index: vm.compensationList[vm.compensationList.length - 1].index + 1,
            selected: true
          })
        };
      }
    }

  }

  return ng
    .module('appReembolso')
    .controller('ReTemporaryDisabilityModalController', ReTemporaryDisabilityModalController)
    .component('reTemporaryDisabilityModal', {
      templateUrl: '/reembolso/app/components/solicitud/steps/coverages/coverages-modal-form/incapacidad-temporal-modal/incapacidad-temporal-modal.html',
      controller: 'ReTemporaryDisabilityModalController as $ctrl',
      bindings: {
        callCalculation: '<',
        callDelete: '<',
        callList: '<',
        callSave: '<',
        closeModal: '<',
        compensationList: '<',
        frmData: '<',
        isConnectedDb: '<',
        isCurrentEdit: '<?',
        documentLiquidationData: '<'
      }
    })
})
