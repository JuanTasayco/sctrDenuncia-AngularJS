'use strict';

define(['angular', 'constants'], function (ng, constants) {
  actionButtonController.$inject = [
    '$log',
    '$state',
    '$rootScope',
    'mModalAlert',
    'mModalConfirm',
    'inspecFactory',
    'ActionsHandlerService',
    '$window'
  ];

  function actionButtonController(
    $log,
    $state,
    $rootScope,
    mModalAlert,
    mModalConfirm,
    inspecFactory,
    ActionsHandlerService,
    $window
  ) {
    var vm = this;
    var tabId;
    vm.getTextButton = getTextButton;
    vm.onClickActionButton = onClickActionButton;
    vm.isVisible = ActionsHandlerService[vm.idStatus].isVisible || false;
    vm.isOnlyShow = ActionsHandlerService[vm.idStatus].onlyShow || false;
    vm.appCode = window.localStorage['appOrigin'] ? window.localStorage['appOrigin'] : 'OIM'

    function onClickActionButton() {
      if (!vm.isOnlyShow) {
        // if (false) {
        switch (vm.idStatus) {
          case '0':
            rehabilitate();
            break;
          case '1':
            programRequest();
            break;
          case '2':
            registerRequest();
            break;
          case '3':
            emitInspection();
            break;
          case '4':
            showInspection();
            break;
          case '5':
            // showRequest();
            showInspection();
            break;
          case '6':
            if (ActionsHandlerService[vm.idStatus].canRevert) {
              revertRequest();
            }
            break;
          case '7':
            $log.log('verdetalle2');
            break;
          case '8':
            // AUTOINSPECCION
            showRequest();
            break;
          case '9':
            showInspection();
            break;
          default:
            $log.info('No handled action');
        }
      } else {
        showRequest();
      }
    }

    function getTextButton() {
      var textButton = '';
      // Verifica que una solicitud anulada tenga estado previo de tipo En proceso de inspeccion o Evaluacion
      var setInspectionText =
        (vm.idLastStatus === 4 || vm.idLastStatus === 5) &&
        vm.idStatus === 6 &&
        !ActionsHandlerService[vm.idStatus].canRevert;
      if (setInspectionText) {
        textButton = 'Ver Inspección';
      } else {
        textButton = ActionsHandlerService[vm.idStatus].action || null;
      }
      return textButton;
    }

    function programRequest() {
      tabId = 'program' + '-' + vm.idRequest + '-' + vm.idRisk;
      if (vm.sourceId) {
        $state.go('solicitudesDetalle', {
          requestId: vm.idRequest,
          riskId: vm.idRisk,
          tab: 'program'
        });
      } else {
        showMoldalOldInspec();
      }
    }

    function showMoldalOldInspec() {
      mModalAlert.showInfo("Registro deshabilitado debido a que fue creado en la antigua OIM", '');
    }

    function showRequest() {
      tabId = 'show-req' + '-' + vm.idRequest + '-' + vm.idRisk;
        if (vm.idInspection) {
          $state.go('inspeccionRegistro', {
            requestId: vm.idRequest,
            riskId: vm.idRisk,
            inspectionId: vm.idInspection
          });
        } else {
          $state.go('solicitudesDetalle', {
            requestId: vm.idRequest,
            riskId: vm.idRisk
          });
        }
    }

    function showInspection() {
      tabId = 'show-inspec' + '-' + vm.idRequest + '-' + vm.idRisk + '-' + vm.idInspection;
      if (vm.sourceId) {
        $state.go('inspeccionRegistro', {
          requestId: vm.idRequest,
          riskId: vm.idRisk,
          inspectionId: vm.idInspection
        });
      } else {
        showMoldalOldInspec()
      }
    }

    function registerRequest() {
      tabId = 'reg-req' + '-' + vm.idRequest + '-' + vm.idRisk + '-' + vm.idInspection;
      if (vm.sourceId) {
        $state.go('inspeccionRegistro', {
          requestId: vm.idRequest,
          riskId: vm.idRisk,
          inspectionId: vm.idInspection
        });
      } else {
        showMoldalOldInspec()
      }
    }

    function emitInspection() {
      $state.go('inspeccionTerminada', {
        requestId: vm.idRequest,
        riskId: vm.idRisk,
        inspectionId: vm.idInspection
      });
    }

    function revertRequest() {
      inspecFactory.requests.undoVoid(vm.idRequest, vm.idRisk, true).then(function () {
        mModalAlert
          .showSuccess('Anulación revertida con éxito', '')
          .catch(function () {})
          .then(function () {
            $rootScope.$broadcast('callFilterFromChildren');
          });
      });
    }

    function rehabilitate() {
      inspecFactory.requests.rehabilitate(vm.idRequest, vm.idRisk)
        .then(function(res) {
          if (res.quotationId) {
            $window.location.href = '/polizas/#/autos/home?quoteId=' + res.quotationId + '&requestId=' + res.requestId + '&placa=' + res.items[0].vehicleLicensePlate;
          } else {
            $state.go('solicitudNuevaSinCotizacionRegular', {
              data: res.items[0],
              contractor: res.contractor
            })
          }
        })
        .catch(function(err) {
          console.error(err);
        })
    }
  }
  return ng
    .module('appInspec')
    .controller('ActionButtonController', actionButtonController)
    .component('inspecActionButton', {
      templateUrl: '/inspec/app/common/action-button/action-button.html',
      controller: 'ActionButtonController',
      controllerAs: '$ctrl',
      bindings: {
        idStatus: '=',
        idLastStatus: '=',
        idRisk: '=',
        idRequest: '=',
        idInspection: '=',
        canNotEmit: '=',
        sourceId: '='
      }
    });
});
