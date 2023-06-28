'use strict';

define(['angular', 'lodash', 'ReembolsoActions', 'reConstants'], function (ng, _, ReembolsoActions, reConstants) {
  ModalAffiliateController.$inject = ['reFactory', '$ngRedux', '$log'];

  function ModalAffiliateController(reFactory, $ngRedux, $log) {
    var vm = this;
    vm.$onInit = onInit;
    vm.isEquifaxModal = false;
    vm.showAdditionalInputs = false;
    vm.cerrar = cerrar;
    vm.searchAffiliate = searchAffiliate;
    vm.selectAffiliate = selectAffiliate;
    vm.sendAffiliate = sendAffiliate;
    vm.createAffiliate = createAffiliate;
    vm.changeToEquifaxModal = changeToEquifaxModal;
    vm.onKeyUp = onKeyUp;

    function onInit() {
      vm.affiliateInput = {};
      (vm.isSoatProduct && vm.state.additionalData.isCallToDb) && _getListData(_serviceGetBeneficiaryList);
    }

    function onKeyUp($event) {
      vm.showAdditionalInputs = $event && isNaN($event);
    }

    function cerrar() {
      vm.close(void 0);
    }

    function searchAffiliate() {
      if (vm.frm.$invalid) {
        vm.frm.markAsPristine();
        return void 0;
      }

      _getListData(_serviceSearchAffiliate, vm.affiliateInput);
    }

    function selectAffiliate(afiliate) {
      if (afiliate.idAffiliate === 0) {
        var request = {
          idCompany: vm.solicitud.company.id,
          lastName: afiliate.lastName,
          motherLastName: afiliate.motherLastName,
          firstName: afiliate.firstName,
          secondName: '',
          birthdate: afiliate.birthdate,
          sex: afiliate.sex,
          documentType: afiliate.documentType,
          documentNumber: afiliate.documentNumber,
          sinisterDate: vm.state.additionalData.sinisterDate,
          correlativeNumber: afiliate.correlativeNumber,
          idCustomer: vm.state.solicitudData.client.id,
          customerContractNumber: vm.state.solicitudData.contractNumber,
          injuredType: afiliate.injuredType,
          documentControlNumber: afiliate.documentControlNumber,
          anio: afiliate.anio
        };
        reFactory.solicitud
          .GenerateAfiliateId(request)
          .then(function () {
            _serviceGetBeneficiaryList();
          })
          .catch(function (err) {
            $log.error('Fallo en el servidor', err);
          });
      }

      vm.afiliate = afiliate;
    }

    function sendAffiliate() {
      vm.close({
        $event: {
          data: {
            afiliate: vm.afiliate,
            action: (vm.isSoatProduct && vm.isEquifaxModal) ? 'create' : ''
          },
          status: 'ok'
        }
      });
    }

    function createAffiliate() {
      vm.close({
        $event: {
          data: {
            afiliate: '',
            beneficiaryList: vm.beneficiaryList,
            action: 'create'
          },
          status: 'ok'
        }
      });
    }

    function changeToEquifaxModal() {
      vm.isEquifaxModal = true;
      vm.showDisclaimer = !vm.showDisclaimer;
    }

    function _getListData(promiseService, requestData) {
      promiseService(requestData)
        .then(function(res) {
          vm.listData = res.isValid ? res.data : [];
        })
        .catch(function(err) {
          $log.error(err);
        });
    }

    function _serviceSearchAffiliate(input) {
      var req = vm.showAdditionalInputs ? {
        lastName: input.lastName.toUpperCase(),
        motherLastName: input.motherLastName.toUpperCase(),
        names: input.identifier.toUpperCase(),
      } : {
        documentNumber: input.identifier
      };

      vm.searchServiceName === 'GetAfiliatesList' && (req.idCompany = vm.state.company.id);

      return reFactory.solicitud[vm.searchServiceName](req);
    }

    function _serviceGetBeneficiaryList() {
      return reFactory.solicitud.GetBeneficiaryListMapfre(
        vm.state.additionalData.documentControlNumber,
        vm.state.additionalData.sinisterAnio
      );
    }

    // function showMessageEPS() {
    //   return vm.isVoidResponse && vm.isValidResponseSearchAffiliate &&  (vm.isSaludCurrentFlow || vm.isSCTRCurrentFlow) && vm.affiliateList.length === 0;
    // }
  }

  return ng
    .module('appReembolso')
    .controller('ModalAffiliateController', ModalAffiliateController)
    .component('reModalAffiliate', {
      templateUrl: '/reembolso/app/components/solicitud/shared/modal-affiliate/modal-affiliate.html',
      controller: 'ModalAffiliateController',
      bindings: {
        close: '&?',
        namelbl: '<',
        state: '<',
        isSoatProduct: '<',
        searchServiceName: '<',
        showDisclaimer: '<',
        showCreateAffiliate: '<'
      }
    });
});
