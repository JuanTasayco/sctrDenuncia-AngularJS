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
    '$ngRedux'
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
    $ngRedux
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
    vm.$postLink = postLink;
    vm.goLeft = goLeft;
    vm.goRight = goRight;
    vm.handleAnular = handleAnular;
    vm.handleDesestimar = handleDesestimar;
    vm.handleGuardar = handleGuardar;
    vm.handleAutoSave = handleAutoSave;
    vm.handleInvestigar = handleInvestigar;
    vm.handleTerminar = handleTerminar;
    vm.showMenuMasOpc = showMenuMasOpc;
    vm.boolChangeClassTabs = false;
    vm.canViewConsolidado = canViewConsolidado;

    $scope.$on('$destroy', function destroy() {
      ng.element($window).off('scroll', fixTitleTabs);
      ng.element($window).off('resize', fixTitleTabs);
      actionsRedux();
    });

    // declaracion

    function onInit() {
      localStorage.removeItem('msg');
      localStorage.removeItem('success');
      vm.clsLabel = wpFactory.help.getClsTag();
      actionsRedux = $ngRedux.connect(mapStateToThis, AsistenciaActions)(vm);
      _startPoll();
    }

    function mapStateToThis(st) {
      return {
        detalleSiniestro: ng.copy(st.detalle)
      };
    }

    function postLink() {
      title = $document[0].getElementsByClassName('g-title');
      sectionTabs = $document[0].getElementsByClassName('g-section');
      arrowLeft = $document[0].getElementById('link__left');
      arrowRight = $document[0].getElementById('link__right');
      tabBox = $document[0].getElementsByClassName('tabs-box-mainview');
      fixedSm = $document[0].getElementsByClassName('fixed-sm');
      currentTab = $document[0].getElementsByClassName('currentTab');
      // HACK: porque a veces no carga la cabecera
      $timeout(function timeout() {
        ng.element($window).on('scroll', fixTitleTabs);
        ng.element($window).on('resize', fixTitleTabs);
      });
    }

    function fixTitleTabs() {
      scrolled = $window.scrollY;
      widthWindow = $window.innerWidth || $document[0].documentElement.clientWidth || $document[0].body.clientWidth;
      removeAttributesOfCabecera();

      if (scrolled > 110) {
        arrowLeft.style.left = '0';
        arrowLeft.style.position = 'fixed';
        arrowRight.style.position = 'fixed';
        arrowRight.style.right = '0';
        currentTab[0].style.paddingTop = '154px';
        listTabs[0].style.position = 'fixed';
        tabBox[0].style.borderTop = '0';
        title[1].style.position = 'fixed';
        title[1].style.top = '0px';
        vm.boolChangeClassTabs = true;
        if (widthWindow > 1025) {
          listTabs[0].style.top = '101px';
        } else if (widthWindow > 991) {
          listTabs[0].style.top = '101px';
        } else if (widthWindow > 767) {
          listTabs[0].style.top = '100px';
          arrowLeft.style.top = '100px';
          arrowRight.style.top = '100px';
        } else if (widthWindow > 437) {
          listTabs[0].style.top = '85px';
          arrowLeft.style.top = '85px';
          arrowRight.style.top = '85px';
          fixedSm[0].style.top = '116px';
        } else if (widthWindow > 374) {
          listTabs[0].style.top = '89px';
          arrowLeft.style.top = '89px';
          arrowRight.style.top = '89px';
          fixedSm[0].style.top = '129px';
        } else {
          listTabs[0].style.top = '108px';
          arrowLeft.style.top = '108px';
          arrowRight.style.top = '108px';
          fixedSm[0].style.top = '140px';
        }
      } else {
        removeAttributesOfCabecera();
      }
    }

    function removeAttributesOfCabecera() {
      arrowLeft.removeAttribute('style');
      arrowRight.removeAttribute('style');
      currentTab[0].removeAttribute('style');
      fixedSm[0].removeAttribute('style');
      fixedSm[0].style.display = 'block';
      listTabs[0].removeAttribute('style');
      sectionTabs[0].removeAttribute('style');
      tabBox[0].removeAttribute('style');
      title[1].removeAttribute('style');
      vm.boolChangeClassTabs = false;
    }

    function goRight() {
      numTabsAsistencia = tabsAsistencia.length;
      tabWidth = tabsAsistencia[0].offsetWidth;
      widthWindow = $window.innerWidth || $document[0].documentElement.clientWidth || $document[0].body.clientWidth;
      maxClicks = numTabsAsistencia - parseInt(widthWindow / tabWidth, 10);
      if (clicks < maxClicks) {
        clicks++;
        leftTabWidth = tabWidth * clicks - (32 + 4 * clicks);
        listTabs[0].style.left = '-' + leftTabWidth.toString() + 'px';
      }
    }

    function goLeft() {
      if (clicks <= maxClicks) {
        if (clicks) {
          clicks = clicks - 1;
          leftTabWidth = tabWidth * clicks - (32 + 4 * clicks);
          listTabs[0].style.left = '-' + leftTabWidth.toString() + 'px';
        } else {
          leftTabWidth = 32;
          listTabs[0].style.left = leftTabWidth.toString() + 'px';
        }
      }
    }

    function showMenuMasOpc() {
      vm.isVisibleMenuMasOpc = !vm.isVisibleMenuMasOpc;
      $document.on('click', _documentClickBind);
    }

    function _documentClickBind(ev) {
      if (!vm.isVisibleMenuMasOpc) {
        return void 0;
      }

      var dpContainsTarget =
        !ng.isUndefined($element[0].contains) && $element[0].querySelector('.js-menu-mas-ops').contains(ev.target);
      if (vm.isVisibleMenuMasOpc && !dpContainsTarget) {
        $document.off('click', _documentClickBind);
        $scope.$apply(function sco() {
          vm.isVisibleMenuMasOpc = false;
        });
      }
    }

    function handleAnular() {
      vm.onAnular();
    }

    function handleDesestimar() {
      vm.onDesestimar();
    }

    function handleGuardar() {
      vm.validateToSave = true;
      vm.onGuardar();
    }

    function handleAutoSave() {
      vm.onAutoSave();
    }

    function handleInvestigar() {
      vm.onInvestigar();
    }

    function handleTerminar() {
      vm.onTerminar();
    }

    function canViewConsolidado() {
      return wpFactory.isAdminOrSupervisor();
    }

    // privates

    function _startPoll() {
      var hasValueReturned = false;
      var hasPromiseReruned = false;
      var pollpromise;

      function isCompleteDriverForm(conductor) {
        return conductor.nombreConductor && conductor.dniConductor && conductor.paternoConductor;
      }

      function isCompletePlateOfVehicleForm(vehicle) {
        return vehicle.placaVehiculo;
      }

      function isCompleteAssitance(assistance) {
        return assistance.nroAsistencia;
      }

      function getReqGenerateSinisterTRONFromForm() {
        return {
          assistanceNumber: vm.infoAsistencia.nroAsistencia,
          carPlate: vm.detalleSiniestro.placaVehiculo,
          lastName: vm.detalleSiniestro.conductor.paternoConductor,
          district: vm.detalleSiniestro.codigoDistrito,
          documentNumber: vm.detalleSiniestro.conductor.dniConductor,
          name: vm.detalleSiniestro.conductor.nombreConductor,
          province: vm.detalleSiniestro.codigoProvincia,
          sinisterAddress: vm.detalleSiniestro.conductor.direccionConductor
        };
      }

      function poll(interval, callback) {
        return $interval(function() {
          if (!hasValueReturned) {
            callback(hasValueReturned);
          }
          if (hasValueReturned) {
            stopPoll();
          }
        }, interval);
      }

      function stopPoll() {
        $interval.cancel(pollpromise);
        hasValueReturned = true;
      }

      pollpromise = poll(wpConstant.timeToPollGenerateSinister, function onGenerateSinister() {
        if (vm.infoAsistencia.codigoSiniestro === 0 && hasPromiseReruned === false) {
          hasPromiseReruned = true;
          hasValueReturned = false;
          isCompleteAssitance(vm.infoAsistencia) &&
            isCompleteDriverForm(vm.detalleSiniestro.conductor) &&
            isCompletePlateOfVehicleForm(vm.detalleSiniestro) &&
            wpFactory.siniestro.GenerateSinisterTRONv2(getReqGenerateSinisterTRONFromForm()).then(
              function (res) {
                hasPromiseReruned = false;
                if (res.success == 'OK') {
                  hasValueReturned = true;
                  localStorage.removeItem('msg');
                  localStorage.removeItem('success');
                } else {
                  hasValueReturned = false;
                  localStorage.setItem('msg', res.message);
                  localStorage.setItem('success', res.success);
                }
              },
              function () {
                hasValueReturned = false;
                hasPromiseReruned = false;
              }
            );
        }
      });
    }
  } // end controller
  return ng
    .module('appWp')
    .controller('CabeceraAsistenciaController', CabeceraAsistenciaController)
    .component('wpCabeceraAsistencia', {
      templateUrl: '/webproc/app/components/detalle-asistencia/cabecera-asistencia/cabecera-asistencia.html',
      controller: 'CabeceraAsistenciaController',
      bindings: {
        autoSaveStatus: '=?',
        frmStatus: '=?',
        infoAsistencia: '<?',
        isFrmRequire: '<?',
        onAnular: '&?',
        onDesestimar: '&?',
        onGuardar: '&?',
        onAutoSave: '&?',
        onInvestigar: '&?',
        onTerminar: '&?',
        saveStatus: '=?'
      }
    });
});
