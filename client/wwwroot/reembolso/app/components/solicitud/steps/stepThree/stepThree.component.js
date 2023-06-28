'use strict';

define(['angular', 'lodash', 'ReembolsoActions', 'reConstants'], function (ng, _, ReembolsoActions, reConstants) {
  ReStepThreeController.$inject = ['$scope', 'reFactory', 'reServices', '$ngRedux', '$uibModal', '$state', 'mModalAlert', '$log'];

  function ReStepThreeController($scope, reFactory, reServices, $ngRedux, $uibModal, $state, mModalAlert, $log) {
    var vm = this;
    var actionsRedux;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.editComprobanteStepThree = editComprobanteStepThree;
    vm.goToStepOne = goToStepOne;
    vm.onActionSolicitude = onActionSolicitude;

    function onInit() {
      actionsRedux = $ngRedux.connect(
        mapStateToThis,
        ReembolsoActions
      )(vm);

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
        compensationList: state.solicitud.coverageCompensations ?
          ng.copy(state.solicitud.coverageCompensations) : [],
        comprobantesList: state.solicitud.comprobantesList ?
          ng.copy(state.solicitud.comprobantesList) : [],
        solicitud: ng.copy(state.solicitud)
      };
    }

    function editComprobanteStepThree() {
      $state.go('.', {
        step: 2
      })
    }

    function goToStepOne() {
      $state.go('.', {
        step: 1
      })
    }

    function onActionSolicitude(reqService) {
      var service;

      if (vm.currentFlow.personalAccidents) {
        service = reFactory.personalAccidents.SaveRefundPersonalAccidents;
      } else if (vm.currentFlow.medicalAssistance) {
        service = reFactory.medicalAssistance.SaveRefundMedicalAssistance;
      } else if (vm.currentFlow.salud || vm.currentFlow.sctr) {
        service = reFactory.solicitud.SaveSolicitudeDisconnectedSalud;
      }

      if (service) {
        service(reqService)
          .then(function (res) {
            _showResponseModal(res);
          })
          .catch(function (err) {
            $log.error('Fallo en el servidor', err);
          })
      }
    }

    // privates

    function _validateInit() {
      if (vm.solicitud.solicitudData) {
        _validateCurrentProduct(reConstants.products, vm.currentFlow);
      } else {
        $state.go('solicitud.init');
      }
    }

    function _validateCurrentProduct(products, currentFlow) {
      currentFlow.medicalAssistance = vm.solicitud.company.id === products.medicalAssistance.companyCode &&
        vm.solicitud.product.code === products.medicalAssistance.productCode;

      currentFlow.soat = vm.solicitud.company.id === products.soat.companyCode &&
        vm.solicitud.product.code === products.soat.productCode;

      currentFlow.salud = vm.solicitud.company.id === products.salud.companyCode &&
        vm.solicitud.product.code === products.salud.productCode;

      currentFlow.sctr = vm.solicitud.company.id === products.sctr.companyCode &&
        vm.solicitud.product.code === products.sctr.productCode;

      if ((currentFlow.salud || currentFlow.sctr) && !vm.solicitud.treatment) {
        $state.go('.', {
          step: 2
        })
      }

      currentFlow.personalAccidents = vm.solicitud.company.id === products.personalAccidents.companyCode &&
        vm.solicitud.product.code === products.personalAccidents.productCode
    }

    function _showResponseModal(response) {
      response.isValid ?
        $uibModal.open({
          backdrop: false,
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          size: 'lg',
          templateUrl: '/reembolso/app/components/solicitud/steps/stepThree/response-modal.html',
          controller: [
            '$scope',
            '$uibModalInstance',
            function (scope, $uibModalInstance) {
              scope.title = response.brokenRulesCollection[0].description;
              scope.listData = response.data;
              scope.soatDisclaimer = '"Toda solicitud queda sujeta a revisión y aprobación por el área de Siniestros de SOAT"'
              scope.showDisclaimer = vm.currentFlow.soat;
              scope.close = function (ev) {
                ev && ev.status === 'ok' ? $uibModalInstance.close(ev.data) : $uibModalInstance.dismiss();
              };
              scope.goToInit = function() {
                $state.go('solicitud.init');
              }
            }
          ]
        }) :
        mModalAlert.showError(response.brokenRulesCollection[0].description, 'Error')
          .then(function(res) {
            res && $state.go('solicitud.init');
          })
    }

  }

  return ng
    .module('appReembolso')
    .controller('ReStepThreeController', ReStepThreeController)
    .component('reStepThreeComponent', {
      templateUrl: '/reembolso/app/components/solicitud/steps/stepThree/stepThree.html',
      controller: 'ReStepThreeController',
      binding: {}
    });
});
