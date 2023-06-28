'use strict';

define(['angular', 'moment'], function(ng, moment) {
  cotizacionesController.$inject = [
    'mModalAlert',
    '$stateParams',
    '$scope',
    '$rootScope',
    'inspecFactory',
    '$uibModal'
  ];

  function cotizacionesController(mModalAlert, $stateParams, $scope, $rootScope, inspecFactory, $uibModal) {
    var vm = this;

    vm.$onInit = onInit;
    vm.pageChanged = pageChanged;

    function onInit() {
      vm.fromInspec = $stateParams.fromInspec;
      vm.fromRequest = $stateParams.fromRequest;
      vm.copyEmail = $stateParams.copyEmail;
      vm.agent = $stateParams.agent;
      vm.confirmationEmail = $stateParams.confirmationEmail;
      vm.pagination = {
        currentPage: 1,
        maxSize: 10,
        totalRecords: 0,
        mOrderBy: {Descripcion: 'Más reciente', Codigo: '1'}
      };
    }

    function handleQueryServiceResult(response) {
      vm.quotations = response.map(function(element) {
        return {
          numero: element.numerodocumento,
          fechaCotizacion: moment(element.fecharegistro, 'DD/MM/YYYY HH:mm:ss').format('DD [de] MMMM YYYY'),
          producto: element.nombreproducto,
          contratante: element.nombrecontratante,
          auto: element.marca + ' ' + element.modelo + ', ' + element.aniosubmodelo,
          url: element.codigocia + '-' + element.numerodocumento + '-' + element.codigoramo
        };
      });
      vm.firstQueryCompleted = true;
      vm.pagination.totalRecords = response[0] ? response[0].total : 0;
    }

    function doFilter(filledArguments) {
      filledArguments.PageIndex = vm.pagination.currentPage;
      filledArguments.PageSize = vm.pagination.maxSize;
      filledArguments.OrderSort = vm.pagination.mOrderBy ? +vm.pagination.mOrderBy.Codigo : null;
      inspecFactory.quotations.quotationListExtend(filledArguments, true).then(function(response) {
        handleQueryServiceResult(response);
      });
    }

    $scope.$on('fullFilter', function(e, a) {
      vm.pagination.currentPage = 1;
      $rootScope.$broadcast('resetOrderBy');
      doFilter(a);
    });

    $scope.$on('filter', function(e, a) {
      doFilter(a);
    });

    $scope.$on('clearFilter', function(e, a) {
      vm.pagination.currentPage = 1;
      $rootScope.$broadcast('resetOrderBy');
      doFilter(a);
    });

    $scope.$on('showContinueWithoutCotz', function() {
      $uibModal
        .open({
          backdrop: true,
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          size: 'lg',
          templateUrl: '/inspec/app/components/cotizaciones/cotizaciones/modal-nueva-solicitud-sin-cotizacion.html',
          controllerAs: '$ctrl',
          controller: [
            '$state',
            '$uibModalInstance',
            function($state, $uibModalInstance) {
              var vm = this;
              vm.closeModal = closeModal;
              vm.toNextStep = toNextStep;
              vm.tipoInspeccionData = [
                {
                  Descripcion: 'Regular',
                  Codigo: 'solicitudNuevaSinCotizacionRegular'
                },
                {
                  Descripcion: 'Reinspección',
                  Codigo: 'solicitudNuevaSinCotizacionReinspeccion'
                }
              ];

              function closeModal() {
                $uibModalInstance.close();
              }

              function toNextStep() {
                $state.go(vm.mTipoInspeccion.Codigo);
              }
            }
          ]
        })
        .result.then(
          function() {
            //  todo
          },
          function() {
            //  todo
          }
        );
    });

    function pageChanged() {
      $rootScope.$broadcast('callFilterFromChildren');
    }
  }

  return ng
    .module('appInspec')
    .controller('CotizacionesController', cotizacionesController)
    .component('inspecCotizaciones', {
      templateUrl: '/inspec/app/components/cotizaciones/cotizaciones/cotizaciones.html',
      controller: 'CotizacionesController',
      controllerAs: '$ctrl'
    });
});
