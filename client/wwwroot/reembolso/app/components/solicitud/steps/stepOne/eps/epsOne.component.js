'use strict';

define(['angular', 'lodash', 'ReembolsoActions'], function(ng, _, ReembolsoActions) {
  ReEpsController.$inject = [
    '$scope',
    'reFactory',
    'reServices',
    '$ngRedux',
    '$uibModal',
    '$state',
    'mModalAlert',
    '$log'
  ];

  function ReEpsController($scope, reFactory, reServices, $ngRedux, $uibModal, $state, mModalAlert, $log) {
    var vm = this;
    var actionsRedux;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.isVisibleSections = false;
    vm.openModalAfiliate = openModalAfiliate;
    vm.continueToStepTwo = continueToStepTwo;
    // vm.getDataByPolicyNumber = getDataByPolicyNumber;
    vm.updateClient = updateClient;
    vm.changeTreatmentDate = changeTreatmentDate;
    vm.onChangeBenefit = onChangeBenefit;

    // functions declaration

    function onInit() {
      try {
        actionsRedux = $ngRedux.connect(mapStateToThis, ReembolsoActions)(vm);

        _validateInit();
      } catch (err) {
        $state.go('solicitud.init');
      }
    }

    function onDestroy() {
      actionsRedux();
    }

    function changeTreatmentDate(treatmentDate) {
      vm.isVisibleSections = treatmentDate && vm.stepOne.afiliate;
      vm.isVisibleSections && _getBenefitList({
        idAffiliate: vm.stepOne.afiliate.idAffiliate,
        productCode: vm.solicitud.product.code,
        treatmentDate: vm.stepOne.treatment.date.model,
        idCompany: vm.solicitud.company.id
      });
    }

    function mapStateToThis(state) {
      return {
        company: ng.copy(state.solicitud.company),
        product: ng.copy(state.solicitud.product),
        solicitud: ng.copy(state.solicitud)
      };
    }

    function getDataByPolicyNumber() {
      if (vm.stepOne.policyNumber) {
        vm.isVisibleSections = true;
        _getCodeFiles();
        _getBenefitList({
          idAffiliate: vm.stepOne.afiliate.idAffiliate,
          productCode: vm.solicitud.product.code,
          treatmentDate: vm.stepOne.treatment.date.model,
          idCompany: vm.solicitud.company.id
        });
      }
    }

    function openModalAfiliate() {
      var modal = vm.modalAfiliate();

      modal('GetAfiliatesList', false, false).result.then(function (res) {
        vm.stepOne.afiliate = res.afiliate;
        vm.stepOne.afiliate = _.assign({}, res.afiliate, {
          beneficiaryCorrelativeNumber: res.afiliate.correlativeNumber || 1
        });
        // vm.stepOne.multipleClients = false;
        vm.reduxUpdateAfiliate(vm.stepOne.afiliate);
        vm.isVisibleSections = vm.stepOne.treatment.date.model && vm.stepOne.afiliate;
        vm.isVisibleSections && _getBenefitList({
          idAffiliate: vm.stepOne.afiliate.idAffiliate,
          productCode: vm.solicitud.product.code,
          treatmentDate: vm.stepOne.treatment.date.model,
          idCompany: vm.solicitud.company.id
        });
      })
    }

    function onChangeBenefit() {
      getAffiliateInfoPlan();
    }

    function updateClient() {
      if (vm.stepOne.solicitudData.clients && vm.stepOne.solicitudData.clients.idClient) {
        getAffiliateInfoPlan();
      }
    }

    function getAffiliateInfoPlan() {
      vm.affiliateInfoPlanCriteria = {
        idCompany: vm.solicitud.company.id,
        idAffiliate: vm.stepOne.afiliate.idAffiliate,
        idBenefit: vm.stepOne.solicitudData ? vm.stepOne.solicitudData.benefit.code : '',
          // vm.stepOne.solicitudData.benefit && vm.stepOne.solicitudData.benefit.code
          //   ? vm.stepOne.solicitudData.benefit.code
          //   : '',
        treatmentDate: vm.stepOne.treatment.date.model,
        productCode: vm.solicitud.product.code
      };

      if (vm.stepOne.multipleClients && vm.stepOne.solicitudData.clients) {
        vm.affiliateInfoPlanCriteria.IdClient = vm.stepOne.solicitudData.clients.idClient;
        vm.affiliateInfoPlanCriteria.ClientDescription = vm.stepOne.solicitudData.clients.description;
      }

      reFactory.solicitud
        .GetAffiliateInfoPlan(vm.affiliateInfoPlanCriteria)
        .then(function(res) {
          vm.dataAffiliateInfoPlan = res.isValid ? res.data : [];

          if (!res.isValid) {
            var message = '';
            ng.forEach(res.brokenRulesCollection, function(error) {
              message += error.description + ' ';
            });
            vm.stepOne.solicitudData = {};
            mModalAlert.showError(message, 'Error');
          } else {
            vm.stepOne.solicitudData.afiliate = {
              id: vm.stepOne.afiliate.idAffiliate,
              name: vm.stepOne.afiliate.fullName
            };

            vm.stepOne.solicitudData.client = {
              name: vm.dataAffiliateInfoPlan.client
            };

            vm.stepOne.solicitudData.plan = {
              idPlan: vm.dataAffiliateInfoPlan.idPlan,
              name: vm.dataAffiliateInfoPlan.plan ? vm.dataAffiliateInfoPlan.plan : ''
            };

            vm.stepOne.solicitudData.relationship = {
              idRelationship: vm.dataAffiliateInfoPlan.idRelationship,
              description: vm.dataAffiliateInfoPlan.relationship ? vm.dataAffiliateInfoPlan.relationship : ''
            };

            vm.stepOne.solicitudData.mAfiliadoVinculacion = vm.dataAffiliateInfoPlan.affiliateLinked;
            vm.stepOne.solicitudData.contractNumber = vm.dataAffiliateInfoPlan.idContract;
            vm.stepOne.solicitudData.idAffiliateLinked = vm.dataAffiliateInfoPlan.idAffiliateLinked;
            vm.stepOne.solicitudData.idClient = vm.dataAffiliateInfoPlan.idClient;

            if (vm.dataAffiliateInfoPlan.idAffiliateLinked === 0 && vm.dataAffiliateInfoPlan.client) {
              mModalAlert.showError('El cliente no tiene afiliado vinculado', 'Error');
            }
          }

          if (res.data && res.data.clientType !== 0) {
            vm.stepOne.multipleClients = true;
            getAffiliateClients(res.data.clientType);
          } else {
            vm.stepOne.multipleClients = vm.stepOne.multipleClients ? vm.stepOne.multipleClients : false;
          }
        })
        .catch(function(err) {
          vm.stepOne.solicitudData = {};
          $log.error('Servidor', err);
        });
    }

    function getAffiliateClients(clientType) {
      vm.clientCriteria = {
        ClientType: clientType,
        IdCompany: vm.solicitud.company.id,
        IdAffiliate: vm.stepOne.afiliate.idAffiliate,
        TreatmentDate: vm.stepOne.treatment.date.model,
        ProductCode: vm.solicitud.product.code
      };

      reFactory.solicitud
        .GetAffiliateClients(vm.clientCriteria)
        .then(function(res) {
          vm.dataAffiliateClients = res.isValid ? res.data : [];
        })
        .catch(function(err) {
          $log.error('Servidor', err);
        });
    }

    function continueToStepTwo() {
      vm.frmStepOne.markAsPristine();
      if (vm.stepOne.solicitudData.totalComprobantesImport < 1) {
        mModalAlert.showError('El monto debe ser mayor a 0', 'Error');
        return void 0;
      }
      if (vm.frmStepOne.$valid && vm.stepOne.afiliate && vm.stepOne.solicitudData.contractNumber) {
        _getCodeFiles();
        vm.frmToState = _mapFormToStateEps(vm.stepOne);
        $state.go('.', {
          step: 2
        });
      }
    }

    // private

    function _getBenefitList(req) {
      reFactory.solicitud
        .GetAllBenefitEps(req)
        .then(function(res) {
          vm.benefitList = res.isValid ? res.data : [];
          vm.stepOne.solicitudData = {};
          !res.isValid && mModalAlert.showError(res.brokenRulesCollection[0].description, '')
            .then(function(res) {
              vm.stepOne = _mapInitObjProperties();
              vm.stepOne.treatment.date.setMaxDate(new Date());
              vm.isVisibleSections = false;
            })
        })
        .catch(function(err) {
          $log.error('Fallo en el servidor', err);
        });
    }

    // validates
    function _validateInit() {
      vm.isEditableStepOne = true;
      vm.stepOne = _mapInitObjProperties();
      vm.stepOne.treatment.date = new reFactory.common.DatePicker();
      vm.stepOne.treatment.date.setMaxDate(new Date());
      vm.dateForm = 'dd/MM/yyyy';

      if (vm.solicitud.solicitudData) {
        vm.isVisibleSections = true;
        vm.stepOne = _mapEditStepOne(vm.solicitud);
        vm.stepOne.treatment.date.model = vm.solicitud.treatment.date;
        _getBenefitList({
          idAffiliate: vm.stepOne.afiliate.idAffiliate,
          productCode: vm.solicitud.product.code,
          treatmentDate: vm.stepOne.treatment.date.model,
          idCompany: vm.solicitud.company.id
        });
      }
    }

    // modals

    function _showModalAfiliate() {
      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        template: '<re-modal-afiliate close="close($event)" namelbl="namelbl" product="producto"></re-modal-afiliate>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function(scope, $uibModalInstance) {
            scope.producto = vm.product.code;
            scope.namelbl = 'Afiliado';
            scope.close = function(ev) {
              ev && ev.status === 'ok' ? $uibModalInstance.close(ev.data) : $uibModalInstance.dismiss();
            };
          }
        ]
      });
    }

    // services
    function _getCodeFiles() {
      if (!vm.solicitud.additionalData) {
        var request = {
          policyNumber: vm.stepOne.policyNumber
        };

        reFactory.solicitud
          .GetNextMedia(request)
          .then(function(res) {
            var identificatorImageCode = res.isValid ? res.data : null;
            vm.reduxAdditionalDataAdd({
              identificatorImageCode: identificatorImageCode
            });
          })
          .catch(function(err) {
            $log.error('Fallo en el servidor', err);
          });
      }
    }

    // map objects

    function _mapFormToStateEps(form) {
      vm.solicitud = {
        afiliate: form.afiliate,
        treatment: {
          date: form.treatment.date.model,
          amountProvider: vm.stepOne.solicitudData.totalComprobantesImport
        },
        solicitudData: vm.stepOne.solicitudData,
        // policyNumber: vm.stepOne.policyNumber,
        // documentControlNumber: vm.stepOne.documentControlNumber
        //   ? vm.stepOne.documentControlNumber
        //   : vm.stepOne.policyNumber
      };

      vm.reduxUpdateStepOne(vm.solicitud);
    }

    function _mapInitObjProperties() {
      return _.assign(
        {},
        {
          treatment: {
            date: new reFactory.common.DatePicker()
          }
        }
      );
    }

    function _mapEditStepOne(data) {
      return _.assign(
        {},
        {
          policyNumber: data.policyNumber,
          solicitudData: {
            client: data.solicitudData.client,
            plan: data.solicitudData.plan,
            relationship: data.solicitudData.relationship,
            contractNumber: data.solicitudData.contractNumber,
            benefit: data.solicitudData.benefit,
            mAfiliadoVinculacion: data.solicitudData.mAfiliadoVinculacion,
            amountProvider: data.solicitudData.totalComprobantesImport
          },
          afiliate: data.afiliate,
          treatment: {
            date: new reFactory.common.DatePicker()
          },
        }
      );
    }
  }

  return ng
    .module('appReembolso')
    .controller('ReEpsController', ReEpsController)
    .component('reEpsOne', {
      templateUrl: '/reembolso/app/components/solicitud/steps/stepOne/eps/epsOne.html',
      controller: 'ReEpsController',
      bindings: {
        modalAfiliate: '<'
      }
    });
});
