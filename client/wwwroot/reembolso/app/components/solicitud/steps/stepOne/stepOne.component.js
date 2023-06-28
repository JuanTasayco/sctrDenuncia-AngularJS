'use strict';

define(['angular', 'lodash', 'ReembolsoActions', 'reConstants'], function (ng, _, ReembolsoActions, reConstants) {
  ReStepOneController.$inject = [
    '$scope',
    '$uibModal',
    'mModalAlert',
    '$ngRedux',
    '$log',
    'reFactory',
    '$q',
    '$window',
    '$state',
    '$filter',
    'reServices'
  ];

  function ReStepOneController($scope, $uibModal, mModalAlert, $ngRedux, $log, reFactory, $q, $window, $state, $filter, reServices) {
    var vm = this;
    var actionsRedux;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.modalAffiliate = modalAffiliate;
    vm.modalCreateAfiliate = modalCreateAfiliate;
    vm.continueToStepTwo = continueToStepTwo;

    // functions declaration

    function onInit() {
      try {
        actionsRedux = $ngRedux.connect(
          mapStateToThis,
          ReembolsoActions
        )(vm);
      } catch (err) {
        $state.go('solicitud.init');
      }

      vm.currentFlow = {
        soat: false,
        medicalAssistance: false,
        salud: false,
        sctr: false,
        personalAccidents: false
      };

      _validateInit();
    }

    function onDestroy() {
      actionsRedux();
    }

    function mapStateToThis(state) {
      return {
        company: ng.copy(state.solicitud.company),
        product: ng.copy(state.solicitud.product),
        solicitud: ng.copy(state.solicitud)
      };
    }

    function modalAffiliate() {
      return _showModalAffiliate;
    }

    function modalCreateAfiliate() {
      return _showModalCreateAfiliate;
    }

    function continueToStepTwo(frmData) {
      vm.reduxUpdateStepOne(frmData);
      _getCodeFiles();
      $state.go('.', {
        step: 2
      })
    }

    // private

    function _validateInit() {
      if (vm.company && vm.product) {
        _validateCurrentProduct(reConstants.products, vm.currentFlow);
      } else {
        $state.go('solicitud.init');
      }
    }

    function _validateCurrentProduct(products, currentFlow) {
      currentFlow.medicalAssistance = vm.company.id === products.medicalAssistance.companyCode &&
        vm.product.code === products.medicalAssistance.productCode;

      currentFlow.soat = vm.company.id === products.soat.companyCode &&
        vm.product.code === products.soat.productCode;

      currentFlow.salud = vm.company.id === products.salud.companyCode &&
        vm.product.code === products.salud.productCode;

      currentFlow.sctr = vm.company.id === products.sctr.companyCode &&
        vm.product.code === products.sctr.productCode;

      currentFlow.personalAccidents = vm.company.id === products.personalAccidents.companyCode &&
        vm.product.code === products.personalAccidents.productCode
    }

    function _getCodeFiles() {
      if (!vm.solicitud.additionalData.identificatorImageCode) {
        var documentControlNumber;

        if (vm.currentFlow.soat) {
          var documentControlNumber = (
            vm.solicitud.coverage.code !== reConstants.coverages.gastosSepelio &&
            vm.solicitud.coverage.code !== reConstants.coverages.gastosCuracion
          ) ?
            vm.solicitud.additionalData.documentControlNumber :
            (vm.solicitud.documentLiquidation && vm.solicitud.documentLiquidation.documentControlNumber);
        }

        if (vm.solicitud.documentLiquidation && vm.solicitud.documentLiquidation.documentControlNumber) {
          return void 0;
        }

        var request = {
          anio: vm.solicitud.additionalData.sinisterAnio,
          benefitCode: vm.solicitud.coverage ? vm.solicitud.coverage.code : vm.solicitud.solicitudData.benefit.benefitCode,
          documentControlNumber: documentControlNumber,
          idAffiliate: vm.solicitud.afiliate.idAffiliate,
          sinisterNumber: vm.solicitud.additionalData.sinisterNumber,
          policyNumber: vm.solicitud.additionalData.policyNumber
        };

        reFactory.solicitud
          .GetNextMedia(request)
          .then(function (res) {
            var identificatorImageCode = res.isValid ? res.data : null;
            vm.reduxAdditionalDataAdd({
              identificatorImageCode: identificatorImageCode
            });
          })
          .catch(function (err) {
            $log.error('Fallo en el servidor', err);
          })
      }
    }

    function _showModalAffiliate(searchService, showDisclaimer, showCreateAffiliate) {
      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        template: '\
          <re-modal-affiliate \
            close="close($event)" \
            namelbl="namelbl" \
            is-soat-product="isSoat" \
            state="stateData" \
            search-service-name="searchService" \
            show-disclaimer="showDisclaimer" \
            show-create-affiliate="showCreateAffiliate" \
          > \
          </re-modal-affiliate>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function (scope, $uibModalInstance) {
            scope.isSoat = vm.currentFlow.soat;
            scope.namelbl = vm.currentFlow.soat ? 'Beneficiario' : 'Afiliado';
            scope.searchService = searchService;
            scope.showDisclaimer = showDisclaimer;
            scope.stateData = vm.solicitud;
            scope.showCreateAffiliate = showCreateAffiliate;
            scope.close = function (ev) {
              ev && ev.status === 'ok' ? $uibModalInstance.close(ev.data) : $uibModalInstance.dismiss();
            };
          }
        ]
      });
    }

    function _showModalCreateAfiliate(resModalAfiliateData, isSoat) {
      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        template: '<re-modal-create-afiliate close="close($event)" namelbl="namelbl" modal-afiliate-data="resModalAfiliateData" is-soat="isSoat"></re-modal-create-afiliate>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function (scope, $uibModalInstance) {
            scope.namelbl = vm.currentFlow.soat ? 'Beneficiario' : 'Afiliado';
            scope.resModalAfiliateData = resModalAfiliateData;
            scope.isSoat = isSoat;
            scope.close = function (ev) {
              ev && ev.status === 'ok' ? $uibModalInstance.close(ev.data) : $uibModalInstance.dismiss();
            };
          }
        ]
      });
    }

  }

  return ng
    .module('appReembolso')
    .controller('ReStepOneController', ReStepOneController)
    .component('reStepOneComponent', {
      templateUrl: '/reembolso/app/components/solicitud/steps/stepOne/stepOne.html',
      controller: 'ReStepOneController',
      bindings: {}
    });
});
