'use strict';

define(['angular', 'lodash', 'ReembolsoActions'], function (ng, _, ReembolsoActions) {
  ReCoveragesModalFormController.$inject = ['reFactory', '$log', '$ngRedux', 'mModalAlert'];

  function ReCoveragesModalFormController(reFactory, $log, $ngRedux, mModalAlert) {
    var vm = this;
    var actionsRedux;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.saveService = saveService;
    vm.saveComprobantesExtraBeneficiaryService = saveComprobantesExtraBeneficiaryService;
    vm.calculationService = calculationService;
    vm.listService = listService;
    vm.deleteService = deleteService;

    function onInit() {
      actionsRedux = $ngRedux.connect(
        mapStateToThis,
        ReembolsoActions
      )(vm);
      vm.formData = vm.data || {};

      vm.extraBeneficiaryData = vm.solicitud.additionalData.isCallToDb ?
        vm.solicitud.extraBeneficiaryData : vm.solicitud.afiliate;
    }

    function onDestroy() {
      actionsRedux();
    }

    function mapStateToThis(state) {
      return {
        solicitud: state.solicitud,
        compensationList: state.solicitud.coverageCompensations ? ng.copy(state.solicitud.coverageCompensations) : []
      };
    }

    function saveService(serviceData) {
      var request = vm.solicitud.additionalData.isCallToDb &&
      (vm.solicitud.documentLiquidation &&
      vm.solicitud.documentLiquidation.documentControlNumber) ?
        _.assign({}, serviceData.request, _mapObjRequest()) :
        _.assign({}, serviceData.request);

      vm.solicitud.additionalData.isCallToDb &&
      (vm.solicitud.documentLiquidation &&
      vm.solicitud.documentLiquidation.documentControlNumber) ?
        _saveConnected(serviceData.serviceName, request) :
        _saveDisconnected(request);
    }

    function saveComprobantesExtraBeneficiaryService(serviceData) {
      vm.reduxUpdateExtraBeneficiaryData(serviceData.request);
    }

    function calculationService(serviceData) {
      var request = vm.solicitud.additionalData.isCallToDb &&
      (vm.solicitud.documentLiquidation &&
      vm.solicitud.documentLiquidation.documentControlNumber) ?
        _.assign({}, serviceData.request, _mapObjRequest()) :
        _.assign({}, serviceData.request, {
          beneficiaryCompensationCode: vm.solicitud.coverage.code
        });

      request.idCompany = vm.solicitud.company.id;
      request.sinisterDate = vm.solicitud.additionalData.sinisterDate;

      var service = reFactory.solicitud[serviceData.serviceName];
      service(request)
        .then(function (res) {
          res.isValid ?
            vm.formData = res.data :
            mModalAlert.showError(res.brokenRulesCollection[0].description, '').then(function () {
              vm.formData = {};
            });
        })
        .catch(function (err) {
          $log.error('Servidor', err);
        })
    }

    function listService(serviceName) {
      vm.serviceNameList = serviceName;
      vm.solicitud.additionalData.isCallToDb && _getListConnected(vm.serviceNameList);
    }

    function deleteService(serviceData) {
      var request = vm.solicitud.additionalData.isCallToDb &&
      (vm.solicitud.documentLiquidation &&
      vm.solicitud.documentLiquidation.documentControlNumber) ?
        _.assign({}, serviceData.request, _mapObjRequest()) :
        _.assign({}, serviceData.request);

      vm.solicitud.additionalData.isCallToDb &&
      (vm.solicitud.documentLiquidation &&
      vm.solicitud.documentLiquidation.documentControlNumber) ?
        _deleteConnected(serviceData.serviceName, request) :
        _deleteDisconnected(request);
    }

    // privates

    function _getListConnected(serviceName) {
      var request = _.assign({}, _mapObjRequest());
      var service = reFactory.solicitud[serviceName];
      service(request)
        .then(function (res) {
          vm.compensationList = res.isValid ? res.data : [];
        })
        .catch(function (err) {
          $log.error('Servidor', err);
        })
    }

    function _saveConnected(serviceName, request) {
      var service = reFactory.solicitud[serviceName];
      service(request)
        .then(function (res) {
          _getListConnected(vm.serviceNameList);
        })
        .catch(function (err) {
          $log.error('Servidor', err);
        })
    }

    function _saveDisconnected(request) {
      var requestSave = _.assign(request, {
        selected: false
      });
      var itemExist = _.find(vm.compensationList, function (item) {
        return item.index === requestSave.index;
      });

      _.keys(itemExist).length > 0 ?
        vm.reduxCoverageCompensationEdit(requestSave) :
        vm.reduxCoverageCompensationAdd(requestSave);
    }

    function _deleteConnected(serviceName, request) {
      var service = reFactory.solicitud[serviceName];
      service(request)
        .then(function (res) {
          _getListConnected(vm.serviceNameList);
        })
        .catch(function (err) {
          $log.error('Servidor', err);
        })
    }

    function _deleteDisconnected(request) {
      vm.reduxCoverageCompensationDelete(request.index);
    }

    function _mapObjRequest() {
      return _.assign({}, {
        sinisterAnio: vm.solicitud.additionalData.sinisterAnio,
        documentControlNumber: vm.solicitud.additionalData.documentControlNumber,
        beneficiaryCorrelativeNumber: vm.solicitud.afiliate.beneficiaryCorrelativeNumber,
        beneficiaryCompensationCode: vm.solicitud.coverage.code
      });
    }
  }

  return ng
    .module('appReembolso')
    .controller('ReCoveragesModalFormController', ReCoveragesModalFormController)
    .component('reCoveragesModalForm', {
      templateUrl: '/reembolso/app/components/solicitud/steps/coverages/coverages-modal-form/coverages-modal-form.html',
      controller: 'ReCoveragesModalFormController as $ctrl',
      bindings: {
        close: '<',
        compensationList: '=?',
        data: '<?',
        isCurrentEdit: '<?'
      }
    })
})
