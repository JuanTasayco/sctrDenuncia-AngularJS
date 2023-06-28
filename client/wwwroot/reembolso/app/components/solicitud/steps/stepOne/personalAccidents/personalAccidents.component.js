'use strict';

define(['angular', 'lodash', 'ReembolsoActions', 'reConstants'], function (ng, _, ReembolsoActions, reConstants) {

  RePersonalAccidentsController.$inject = [
    '$scope',
    'reFactory',
    'reServices',
    '$ngRedux',
    '$uibModal',
    '$state',
    'mModalAlert',
    '$log'
  ];

  function RePersonalAccidentsController(
    $scope,
    reFactory,
    reServices,
    $ngRedux,
    $uibModal,
    $state,
    mModalAlert,
    $log
  ) {
    var vm = this;
    var actionsRedux;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.openModalAffiliate = openModalAffiliate;
    vm.onChangeDate = onChangeDate;
    vm.onChangeContractorNumber = onChangeContractorNumber;
    vm.validateForm = validateForm;
    vm.onChangeBenefit = onChangeBenefit;
    vm.onChangePolicy = onChangePolicy;

    function onInit() {
      actionsRedux = $ngRedux.connect(
        mapStateToThis,
        ReembolsoActions
      )(vm);

      vm.listDataAffiliate = [];
      vm.constractorNumberList = [];
      vm.isChangePolicy = false;

      _validateInit();
    }

    function onDestroy() {
      actionsRedux();
    }

    function mapStateToThis(state) {
      return {
        solicitud: ng.copy(state.solicitud)
      };
    }

    function onChangePolicy(policy) {
      if (policy && policy.length === 13) {
        _validatePolicyAndDate(vm.personalAccidents.policyNumber, vm.personalAccidents.date.model);
      }
    }

    function onChangeDate(date) {
      if (date > new Date()) {
        mModalAlert.showError('La fecha seleccionada no puede ser mayor al día actual', 'Error')
          .then(function () {
            vm.personalAccidents.date = new reFactory.common.DatePicker();
            vm.personalAccidents.date.setMaxDate(new Date());
          })

        return void 0;
      }

      date && _validatePolicyAndDate(vm.personalAccidents.policyNumber, date);
    }

    function openModalAffiliate() {
      var modal = vm.modalAffiliate();
      var modalCreateAfiliate = vm.modalCreateAfiliate();

      modal('GetAffiliate', false).result.then(function (r) {
        if (r.action === "create") {
          modalCreateAfiliate(r).result.then(function(res) {
            vm.personalAccidents.afiliate = res;
            _serviceGenerateOpening(res);
          });
        } else {
          vm.personalAccidents.afiliate = r.afiliate;
          _serviceGenerateOpening(r.afiliate);
        }
      })
    }

    function onChangeContractorNumber(contractNumber) {
      if (contractNumber) {
        var data = _.find(vm.listDataAffiliate, function (item) {
          return item.customerContractNumber === contractNumber.code
        });

        _setCustomerData(data);
      }
    }

    function validateForm() {
      if (vm.personalAccidents.policyNumber.length !== 13) {
        return void 0;
      }

      if (vm.frmStepOne.$invalid) {
        vm.frmStepOne.markAsPristine();
        return void 0;
      }

      if (vm.personalAccidents.solicitudData.totalComprobantesImport < 1) {
        mModalAlert.showError('El monto ingresado debe ser mayor a 0', 'Error')
        return void 0;
      }

      if (_.keys(vm.personalAccidents.afiliate).length < 1) {
        return void 0;
      }

      vm.reduxAdditionalDataUpdate({
        sinisterDate: vm.personalAccidents.date.model,
        policyNumber: vm.personalAccidents.policyNumber,
        idAffiliateTemporary: vm.idAffiliateTemporary
      });

      vm.onContinue({
        solicitudData: vm.personalAccidents.solicitudData
      });
    }

    function onChangeBenefit(benefit) {
      if (!benefit) {
        vm.personalAccidents.solicitudData.sumaAsegurada = '';
        return void 0;
      }

      vm.personalAccidents.solicitudData.sumaAsegurada = benefit.covegareMax;
    }

    function _serviceGenerateOpening(affiliate) {
      reFactory.personalAccidents.GenerateOpening({
        policyNumber: vm.personalAccidents.policyNumber,
        accidentDate: vm.personalAccidents.date.model,
        idCompany: vm.solicitud.company.id,
        lastName: affiliate.lastName,
        motherLastName: affiliate.motherLastName,
        names: affiliate.names || affiliate.firstName + ' ' + affiliate.secondName,
        fullName: affiliate.fullName,
        birthdate: affiliate.birthdate,
        sex: affiliate.sex,
        idDocumentType: affiliate.idDocumentType || affiliate.documentType,
        documentNumber: affiliate.documentNumber
      })
        .then(function(res) {
          res.isValid && _serviceGetCustomerData(res.data);
          res.isValid && (vm.idAffiliateTemporary = res.data.idAffiliateTemporary)
        })
        .catch(function(err) {
          $log.error('Fallo en el servidor', err);
        })
    }

    function _serviceGetCustomerData(dataOpening) {
      var request = {
        idAffiliate: dataOpening.idAffiliate,
        idCompany: vm.solicitud.company.id,
        policyNumber: vm.personalAccidents.policyNumber,
        productCode: vm.solicitud.product.code,
        sinisterDate: vm.personalAccidents.date.model,
        sinisterNumberRef: dataOpening.sinisterNumberRef
      }

      reFactory.personalAccidents.GetCustomerData(request)
        .then(function (res) {
          if (res.isValid) {
            vm.listDataAffiliate = res.data;
            vm.constractorNumberList = _mapContractNumberList(res.data);
            _serviceGetBenefitsByAffiliate(res.data[0]);
            _setCustomerData(res.data[0]);
            vm.reduxUpdateAfiliate(_.assign({}, vm.personalAccidents.afiliate, {
              idAffiliate: res.data[0].idAffiliate
            }));
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

    function _serviceGetBenefitsByAffiliate(data) {
      reFactory.personalAccidents.GetBenefitsByAffiliate({
        idPlan: data.idPlan,
        planVersionNumber: data.planVersionNumber,
        policyNumber: data.policyNumber,
        accidentDate: vm.personalAccidents.date.model
      })
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
      vm.personalAccidents.solicitudData = {
        client: {
          id: data.idCustomer,
          name: data.descCustomer
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
          id: data.idAffiliateVinculation,
          name: data.descAffiliateVinculation
        },
        contractNumber: vm.constractorNumberList.length > 1 ? {
          code: data.customerContractNumber
        } : data.customerContractNumber,
        idBroker: data.idBroker,
        planVersionNumber: data.planVersionNumber,
        sinisterNumberRef: data.sinisterNumberRef,
        beneficiaryCorrelativeNumber: data.beneficiaryCorrelativeNumber,
        idCommercialOffice: data.idCommercialOffice,
      }
    }

    function _errBenefitList(message) {
      mModalAlert.showError(message, 'Error').then(function (r) {
        vm.personalAccidents.solicitudData = {};
        vm.personalAccidents.afiliate = {};
        vm.constractorNumberList = [];
      })
    }

    function _cleanData() {
      vm.personalAccidents.solicitudData = {};
      vm.personalAccidents.afiliate = {};
      vm.reduxUpdateAfiliate(vm.personalAccidents.afiliate);
    }

    function _validatePolicyAndDate(policyNumber, accidentDate) {
      if (policyNumber && accidentDate) {
        reFactory.personalAccidents.ValidatePolicy({policyNumber: policyNumber, accidentDate: accidentDate})
          .then(function (res) {
            _cleanData();
            vm.showBodySection = res.isValid;
            !res.isValid && mModalAlert.showError(res.brokenRulesCollection[0].description, 'Error')
              .then(function () {
                $state.go('solicitud.init');
              })
          })
          .catch(function (err) {
            $log.error('Fallo en el servidor', err);
          })
      }
    }

    function _mapContractNumberList(list) {
      return _.map(list, function(item) {
        return {
          code: item.customerContractNumber,
          description: item.customerContractNumber
        }
      })
    }

    function _validateInit() {
      if (vm.solicitud.solicitudData) {
        vm.showLastBodySection = true;
        vm.showBodySection = true;
        vm.personalAccidents = _mapEdit();
        _serviceGetBenefitsByAffiliate({
          idPlan: vm.personalAccidents.solicitudData.plan.id,
          planVersionNumber: vm.personalAccidents.solicitudData.planVersionNumber,
          policyNumber: vm.personalAccidents.policyNumber
        });
      } else {
        vm.showLastBodySection = false;
        vm.showBodySection = false;
        vm.personalAccidents = _mapInit();
      }

      vm.personalAccidents.date.setMaxDate(new Date());
    }

    function _mapEdit() {
      return _.assign({}, {
        policyNumber: vm.solicitud.additionalData.policyNumber,
        date: new reFactory.common.DatePicker(new Date(vm.solicitud.additionalData.sinisterDate)),
        solicitudData: vm.solicitud.solicitudData,
        afiliate: vm.solicitud.afiliate
      })
    }

    function _mapInit() {
      return _.assign({}, {
        solicitudData: {},
        date: new reFactory.common.DatePicker(),
      })
    }
  }

  return ng
    .module('appReembolso')
    .controller('RePersonalAccidentsController', RePersonalAccidentsController)
    .component('rePersonalAccidents', {
      templateUrl: '/reembolso/app/components/solicitud/steps/stepOne/personalAccidents/personalAccidents.html',
      controller: 'RePersonalAccidentsController',
      bindings: {
        modalAffiliate: '<',
        modalCreateAfiliate: '<',
        onContinue: '<'
      }
    });
});
