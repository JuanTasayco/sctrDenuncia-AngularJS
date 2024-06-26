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
    vm.serviceSearchAffiliate = _serviceSearchAffiliate;
    vm.getListData = _getListData;
    vm.dataEquifax = false;

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
      vm.dataEquifax = false;
      if (vm.frm.$invalid) {
        vm.frm.markAsPristine();
        return void 0;
      }
      var tipoFilter = vm.showAdditionalInputs ? 2 : 1;
      var valorFilter = vm.affiliateInput.identifier;
      if(vm.showAdditionalInputs){
        valorFilter = vm.affiliateInput.identifier.toUpperCase();
        if(vm.affiliateInput.lastName.length > 0){
          valorFilter = valorFilter + "-" + vm.affiliateInput.lastName.toUpperCase();
        }
        if(vm.affiliateInput.motherLastName.length > 0){
          valorFilter = valorFilter + " " + vm.affiliateInput.motherLastName.toUpperCase();
        }
      }
      if(vm.state.additionalData){
        var documentControlNumber = vm.state.additionalData.documentControlNumber ? vm.state.additionalData.documentControlNumber : 0 ;
        var sinisterAnio = vm.state.additionalData.sinisterAnio ? vm.state.additionalData.sinisterAnio : 0 ;
        reFactory.solicitud.GetAllBeneficiaryByFilters(documentControlNumber, sinisterAnio, tipoFilter,valorFilter).then(function(res) {
          if(res.isValid && res.data.length > 0){
            vm.listData = res.data
          }else{
            vm.getListData(vm.serviceSearchAffiliate, vm.affiliateInput);
          }
        })
        .catch(function(err) {
          $log.error(err);
        });
      }else{
        vm.getListData(vm.serviceSearchAffiliate, vm.affiliateInput);
      }
      
      
    }

    function selectAffiliate(afiliate) {
      if(vm.dataEquifax){
        vm.afiliate = afiliate;
        vm.close({
          $event: {
            data: {
              afiliate: afiliate,
              action: 'create'
            },
            status: 'ok'
          }
        });
      }else{
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
      vm.dataEquifax = true;
      
      return reFactory.solicitud[vm.searchServiceName](req);
    }

    function _serviceGetBeneficiaryList() {
      var documentControlNumber2 = vm.state.additionalData.documentControlNumber ? vm.state.additionalData.documentControlNumber : 0 ;
      var sinisterAnio2 = vm.state.additionalData.sinisterAnio ? vm.state.additionalData.sinisterAnio : 0 ;
      return reFactory.solicitud.GetAllBeneficiaryByFilters(documentControlNumber2, sinisterAnio2, 1, null);
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
