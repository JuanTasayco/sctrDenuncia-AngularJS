'use strict';

define(['angular', 'AsistenciaActions', 'wpConstant', 'lodash'], function(ng, AsistenciaActions, wpConstant, _) {
  CabeceraAsistenciaController.$inject = [
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
  function CabeceraAsistenciaController(
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
    var tabsAsistencia = $document[0].getElementsByClassName('tabs-box-list__tab');
    var numTabsAsistencia = 0;
    var leftTabWidth = 0;
    var listTabs = $document[0].getElementsByClassName('main-tabs');
    var clicks = 0;
    var maxClicks = 0;
    // HACK: usado para que el uib-tab no ponga active por defecto al primer tab
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
    // vm.goLeft = goLeft;
    // vm.goRight = goRight;
    vm.handleGuardar = handleGuardar;
    vm.handleConsolidar = handleConsolidar;
    vm.handleTerminar = handleTerminar;
    // vm.showMenuMasOpc = showMenuMasOpc;
    vm.boolChangeClassTabs = false;
    vm.canViewConsolidado = canViewConsolidado;
    vm.regresarBandeja = regresarBandeja;

    $scope.$on('$destroy', function destroy() {
    });

    // declaracion

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

    function canViewConsolidado() {
      return wpFactory.isAdminOrSupervisor();
    }

    function regresarBandeja() {
      $state.go('bandeja', { setFrm: true })
    }

  } // end controller
  return ng
    .module('appWp')
    .controller('CabeceraAsistenciaController', CabeceraAsistenciaController)
    .component('wpCabeceraAsistencia', {
      templateUrl: '/webproc/app/components/detalle-asistencia/cabecera-asistencia/cabecera-asistencia.html',
      controller: 'CabeceraAsistenciaController',
      bindings: {
        infoAsistencia: '<?',
        onGuardar: '&?',
        onTerminar: '&?',
        onConsolidar: '&?',
        saveStatus: '=?',
        modoLectura: '=?'
      }
    });
});
