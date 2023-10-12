'use strict';

define(['angular', 'AsistenciaActions', 'wpConstant', 'lodash'], function(ng, AsistenciaActions, wpConstant, _) {
  FooterAsistenciaController.$inject = [
    '$window',
    '$document',
    '$rootScope',
    '$scope',
    '$uibModal',
    '$timeout',
    '$interval',
    'wpFactory',
    '$element',
    '$ngRedux',
    '$state'
  ];
  function FooterAsistenciaController(
    $window,
    $document,
    $rootScope,
    $scope,
    $uibModal,
    $timeout,
    $interval,
    wpFactory,
    $element,
    $ngRedux,
    $state
  ) {
    var vm = this;
    var actionsRedux;
    var title, sectionTabs, arrowLeft, arrowRight, tabBox, fixedSm, currentTab, scrolled, widthWindow, tabWidth;
    var numTabsAsistencia = 0;
    var leftTabWidth = 0;
    var clicks = 0;
    var maxClicks = 0;
    vm.currentTab = '';
    
    vm.tabs = [
      {title: 'DATOS GENERALES', state: 'detalleAsistencia.generales'},
      {title: 'CONDUCTOR Y OCUPANTES', state: 'detalleAsistencia.conductor'},
      {title: 'VEHÍCULO', state: 'detalleAsistencia.vehiculo'},
      {title: 'TALLERES', state: 'detalleAsistencia.talleres'},
      {title: 'TERCEROS', state: 'detalleAsistencia.terceros'},
      {title: 'DETALLES SINIESTRO', state: 'detalleAsistencia.siniestro'},
      {title: 'CONSOLIDADO', state: 'detalleAsistencia.consolidado'}
    ];
    vm.$onInit = onInit;
    vm.handleGuardar = handleGuardar;
    vm.handleConsolidar = handleConsolidar;
    vm.handleTerminar = handleTerminar;
    vm.handleVerDeducible = handleVerDeducible;
    vm.boolChangeClassTabs = false;
    vm.canViewConsolidado = canViewConsolidado;
    vm.regresarBandeja = regresarBandeja;

    $scope.$on('$destroy', function destroy() {
    });

    function onInit() {

    }

    function handleGuardar() {
      vm.onGuardar();
    }

    function handleConsolidar() {
      vm.onConsolidar();
    }

    function handleTerminar() {
      vm.onTerminar();
    }

    function handleVerDeducible() {
      vm.onVerDeducible();
    }

    function canViewConsolidado() {
      return wpFactory.isAdminOrSupervisor();
    }

    function regresarBandeja() {
      $state.go('bandeja', { setFrm: true })
    }

  }
  return ng
    .module('appWp')
    .controller('FooterAsistenciaController', FooterAsistenciaController)
    .component('wpFooterAsistencia', {
      templateUrl: '/webproc/app/components/detalle-asistencia/footer-asistencia/footer-asistencia.html',
      controller: 'FooterAsistenciaController',
      bindings: {
        infoAsistencia: '<?',
        onGuardar: '&?',
        onTerminar: '&?',
        onConsolidar: '&?',
        onVerDeducible: '&?',
        saveStatus: '=?',
        modoLectura: '=?'
      }
    });
});
