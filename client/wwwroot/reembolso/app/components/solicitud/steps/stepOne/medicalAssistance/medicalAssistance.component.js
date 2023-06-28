'use strict';

define(['angular', 'lodash', 'ReembolsoActions', 'reConstants'], function (ng, _, ReembolsoActions, reConstants) {

  ReMedicalAssistanceController.$inject = [
    '$scope',
    'reFactory',
    'reServices',
    '$ngRedux',
    '$uibModal',
    '$state',
    'mModalAlert',
    '$log',
    '$q'
  ];

  function ReMedicalAssistanceController(
    $scope,
    reFactory,
    reServices,
    $ngRedux,
    $uibModal,
    $state,
    mModalAlert,
    $log,
    $q
  ) {
    var vm = this;
    var actionsRedux;
    vm.$onInit = onInit;
    vm.$onChanges = onChanges;
    vm.$onDestroy = onDestroy;
    vm.openModalAfiliate = openModalAfiliate;
    vm.onChangeDate = onChangeDate;
    vm.onChangeContractorNumber = onChangeContractorNumber;
    vm.onChangeCustomer = onChangeCustomer;
    vm.validateForm = validateForm;

    vm.medicalAssistance = {
      date: new reFactory.common.DatePicker(),
    };

    function onInit() {
      actionsRedux = $ngRedux.connect(
        mapStateToThis,
        ReembolsoActions
      )(vm);

      vm.listDataByContractNumber = [];
      vm.listConstractor = false;
      _validateInit();
    }

    function onChanges(changes) {
      console.log(changes);
    }

    function onDestroy() {
      actionsRedux();
    }

    function mapStateToThis(state) {
      return {
        solicitud: ng.copy(state.solicitud)
      };
    }

    function onChangeDate(date) {
      _onCallServiceDocument(date, vm.medicalAssistance.afiliate);
    }

    function openModalAfiliate() {
      var modal = vm.modalAfiliate();

      modal('GetAfiliatesList', false, false).result.then(function (res) {
        vm.medicalAssistance.afiliate = res.afiliate;
        vm.reduxUpdateAfiliate(vm.medicalAssistance.afiliate);
        _onCallServiceDocument(vm.medicalAssistance.date.model, vm.medicalAssistance.afiliate);
      })
    }

    function _onCallServiceDocument(date, afiliate) {
      if (date > new Date()) {
        mModalAlert.showError('La fecha seleccionada no puede ser mayor al día actual', 'Error')
          .then(function () {
            vm.medicalAssistance.date = new reFactory.common.DatePicker();
            vm.medicalAssistance.date.setMaxDate(new Date());
          })
        return void 0;
      }

      if (date && afiliate) {
        _getRequestData(afiliate.idAffiliate);
      }
    }

    function onChangeContractorNumber(contractNumber) {
      if (contractNumber) {
        var data = _.find(vm.listData, function (item) {
          return item.customerContractNumber === contractNumber.id && item.idCustomer === vm.medicalAssistance.solicitudData.client.id;
        });

        _setCustomerData(data);
        _getAllBenefits(data.idAffiliate, data.policyNumber);
      }
    }

    function onChangeCustomer(customer) {
      if (!customer) {
        vm.medicalAssistance.solicitudData = {};
        return void 0;
      }

      vm.medicalAssistance.solicitudData.contractNumber = {};
      vm.medicalAssistance.solicitudData.plan = {};
      vm.medicalAssistance.solicitudData.relationship = {};
      vm.medicalAssistance.solicitudData.afiliateTitular = {};
      vm.medicalAssistance.solicitudData.policyNumber = '';

      _validateAmountContractorNumbers(customer)
    }

    function validateForm() {
      if (vm.frmStepOne.$invalid) {
        vm.frmStepOne.markAsPristine();
        return void 0;
      }

      if (vm.medicalAssistance.solicitudData.totalComprobantesImport < 1) {
        mModalAlert.showError('El monto ingresado debe ser mayor a 0', 'Error')
        return void 0;
      }

      if (_.keys(vm.medicalAssistance.afiliate).length < 1) {
        return void 0;
      }

      vm.reduxAdditionalDataUpdate({
        treatmentDate: vm.medicalAssistance.date.model,
        policyNumber: vm.medicalAssistance.solicitudData.policyNumber,
      });

      vm.onContinue({
        solicitudData: vm.medicalAssistance.solicitudData
      });
    }

    // privates

    function _setRequestData(data) {
      return _.assign({}, data);
    }

    function _mapInit() {
      return _.assign({}, {
        solicitudData: {},
        date: new reFactory.common.DatePicker(),
      })
    }

    function _mapEdit() {
      return _.assign({}, {
        policyNumber: vm.solicitud.additionalData.policyNumber,
        date: new reFactory.common.DatePicker(new Date(vm.solicitud.additionalData.treatmentDate)),
        solicitudData: vm.solicitud.solicitudData,
        afiliate: vm.solicitud.afiliate
      })
    }

    function _validatePolicy(data) {
      !data.isValid &&
        mModalAlert.showError(data.brokenRulesCollection[0].description, 'Error')
        .then(function () {
          $state.go('solicitud.init');
        })
    }

    function _validateAmountContractorNumbers(customer) {
      var listFilter = _.filter(vm.listData, function(item) {
        return item.idCustomer === customer.id
      });

      if (listFilter.length === 1) {
        _setCustomerData(listFilter[0]);
        _getAllBenefits(listFilter[0].idAffiliate, listFilter[0].policyNumber);
      }

      vm.constractorNumberList = _.map(listFilter, function (item) {
        return {
          id: item.customerContractNumber,
          description: item.customerContractNumber
        }
      });
    }

    function _removeDuplicateFromArray(list, key) {
      var obj = {}
      return _.filter(list, function(item) {
        return !obj[item[key]] && (obj[item[key]] = true);
      })
    }

    function _validateAmountCustomers(list) {
      if (list.length <= 1) {
        vm.customersList = [];
        _setCustomerData(list[0]);
        _getAllBenefits(list[0].idAffiliate, list[0].policyNumber);
        return void 0;
      }

      vm.customersList = _.map(_removeDuplicateFromArray(list, 'idCustomer'), function(customer) {
        return _.assign({}, {
          id: customer.idCustomer,
          description: customer.descCustomer
        })
      });

      if (vm.customersList.length === 1) {
        vm.medicalAssistance.solicitudData.client = _.assign({}, vm.customersList[0]);
        _validateAmountContractorNumbers(vm.medicalAssistance.solicitudData.client);
      }
    }

    function _validateInit() {
      if (vm.solicitud.solicitudData) {
        vm.showLastBodySection = true;
        vm.showBodySection = true;
        vm.medicalAssistance = _mapEdit();
        _getAllBenefits(vm.solicitud.afiliate.idAffiliate, vm.medicalAssistance.policyNumber);
      } else {
        vm.showLastBodySection = false;
        vm.showBodySection = false;
        vm.medicalAssistance = _mapInit();
      }

      vm.medicalAssistance.date.setMaxDate(new Date());
    }

    function _getRequestData(idAffiliate) {
      var request = {
        idAffiliate: idAffiliate,
        productCode: vm.solicitud.product.code,
        startDateValAffiliation: vm.medicalAssistance.date.model
      }

      reFactory.medicalAssistance.GetCustomerData(request)
        .then(function (res) {
          vm.showBodySection = res.isValid;
          if (res.isValid) {
            vm.listData = res.data;
            vm.showLastBodySection = true;
            vm.medicalAssistance.solicitudData = {};
            vm.constractorNumberList = [];
            vm.customersList = [];
            _validateAmountCustomers(res.data);
          } else {
            mModalAlert.showError(res.brokenRulesCollection[0].description, 'Error')
              .then(function () {
                _cleanData();
              });
          }
        })
        .catch(function (err) {
          $log.error("Fallo en el servidor", err)
        })
    }

    function _getAllBenefits(idAffiliate, policyNumber) {
      var request = {
        idCompany: vm.solicitud.company.id,
        policyNumber: policyNumber,
        idAffiliate: idAffiliate,
        startDateValAffiliation: vm.medicalAssistance.date.model
      }

      reFactory.medicalAssistance.GetAllBenefits(request)
        .then(function (res) {
          vm.showLastBodySection = true;
          vm.benefitList = res.isValid ? res.data : [];
          !res.isValid && _errBenefitList(res.brokenRulesCollection[0].description);
        })
        .catch(function (err) {
          $log.error("Fallo en el servidor", err)
        })
    }

    function _setCustomerData(data) {
      vm.medicalAssistance.solicitudData = {
        client: {
          id: data.idCustomer,
          description: data.descCustomer
        },
        plan: {
          id: data.idPlan,
          name: data.descPlan
        },
        relationship: {
          id: data.idRelationship,
          description: data.descRelationship
        },
        afiliateTitular: {
          id: data.idAffiliateTitular,
          name: data.descAffiliateTitular
        },
        contractNumber: {
          id: data.customerContractNumber,
          description: data.customerContractNumber
        },
        idBroker: data.idBroker,
        policyNumber: data.policyNumber
      }
    }

    function _errBenefitList(message) {
      mModalAlert.showError(message, 'Error').then(function (r) {
        vm.medicalAssistance.solicitudData = {};
        // vm.constractorNumberList = [];
        vm.medicalAssistance = {
          date: new reFactory.common.DatePicker(),
        };
        vm.showBodySection = false;
      })
    }

    function _cleanData() {
      vm.medicalAssistance.solicitudData = {};
      vm.medicalAssistance.afiliate = {};
      vm.medicalAssistance.date = new reFactory.common.DatePicker();
      vm.reduxUpdateAfiliate(vm.medicalAssistance.afiliate);
    }
  }

  return ng
    .module('appReembolso')
    .controller('ReMedicalAssistanceController', ReMedicalAssistanceController)
    .component('reMedicalAssistance', {
      templateUrl: '/reembolso/app/components/solicitud/steps/stepOne/medicalAssistance/medicalAssistance.html',
      controller: 'ReMedicalAssistanceController',
      bindings: {
        modalAfiliate: '<',
        onContinue: '<'
      }
    });
});
