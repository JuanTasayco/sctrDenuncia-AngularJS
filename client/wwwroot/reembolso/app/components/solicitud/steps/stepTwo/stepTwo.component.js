'use strict';

define(['angular', 'lodash', 'ReembolsoActions', 'reConstants'], function(ng, _, ReembolsoActions, reConstants) {
  ReStepTwoController.$inject = [
    '$scope',
    'reFactory',
    'reServices',
    '$ngRedux',
    '$uibModal',
    '$state',
    '$window',
    'mModalAlert',
    '$log',
    '$filter'
  ];

  function ReStepTwoController(
    $scope,
    reFactory,
    reServices,
    $ngRedux,
    $uibModal,
    $state,
    $window,
    mModalAlert,
    $log,
    $filter
  ) {
    var vm = this;
    var actionsRedux;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.continuerToStepThree = continuerToStepThree;
    vm.validateComprobantesImporte = validateComprobantesImporte;

    function onInit() {
      actionsRedux = $ngRedux.connect(mapStateToThis, ReembolsoActions)(vm);

      vm.currentFlow = {
        soat: false,
        medicalAssistance: false,
        salud: false,
        sctr: false,
        personalAccidents: false
      };

      _validateInit();
      _setLookupSelect();
    }

    function onDestroy() {
      actionsRedux();
    }

    function mapStateToThis(state) {
      return {
        solicitud: ng.copy(state.solicitud)
      };
    }

    function continuerToStepThree() {}

    function validateComprobantesImporte(comprobantesList) {
      var sumTotalList = Math.round(reServices.sumProperty(comprobantesList, 'invoiceTotalValue') * 100) / 100;

      vm.currentFlow.salud || vm.currentFlow.sctr && vm.solicitud
        ? sumTotalList === Math.round(vm.solicitud.treatment.amountProvider * 100) / 100
          ? $state.go('.', {
              step: 3
            })
          : mModalAlert.showError(
              'El monto total de comprobantes debe ser igual al valor ingresado ' +
                $filter('currency')(vm.solicitud.solicitudData.totalComprobantesImport, 'S/ '),
              'Error'
            )
        : Math.round(vm.solicitud.solicitudData.totalComprobantesImport * 100) / 100 === sumTotalList
          ? $state.go('.', {
              step: 3
            })
          : mModalAlert.showError(
              'El monto total de comprobantes debe ser igual al valor ingresado ' +
                $filter('currency')(vm.solicitud.solicitudData.totalComprobantesImport, 'S/ '),
              'Error'
            );
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
      currentFlow.medicalAssistance =
        vm.solicitud.company.id === products.medicalAssistance.companyCode &&
        vm.solicitud.product.code === products.medicalAssistance.productCode;

      currentFlow.soat =
        vm.solicitud.company.id === products.soat.companyCode &&
        vm.solicitud.product.code === products.soat.productCode;

      currentFlow.salud =
        vm.solicitud.company.id === products.salud.companyCode &&
        vm.solicitud.product.code === products.salud.productCode;

      currentFlow.sctr =
        vm.solicitud.company.id === products.sctr.companyCode &&
        vm.solicitud.product.code === products.sctr.productCode;

      currentFlow.personalAccidents =
        vm.solicitud.company.id === products.personalAccidents.companyCode &&
        vm.solicitud.product.code === products.personalAccidents.productCode;

      if (currentFlow.salud && currentFlow.sctr && vm.solicitud) {
        vm.solicitud.additionalData = {
          policyNumber: vm.solicitud.policyNumber,
          documentControlNumber: null,
          identificatorImageCode: vm.solicitud.documentControlNumber
        };
      }
    }

    function _setLookupSelect() {
      var tableNameDocumentType = 'DocumentReceived';
      var lookUpsData = ng.fromJson($window.sessionStorage['lookups']);

      vm.documentTypeList = _.filter(lookUpsData, function(item) {
        return item.tableNameField === tableNameDocumentType;
      });
    }
  }

  return ng
    .module('appReembolso')
    .controller('ReStepTwoController', ReStepTwoController)
    .component('reStepTwoComponent', {
      templateUrl: '/reembolso/app/components/solicitud/steps/stepTwo/stepTwo.html',
      controller: 'ReStepTwoController as $ctrl',
      bindings: {}
    });
});
