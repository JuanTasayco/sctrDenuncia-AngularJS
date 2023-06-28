'use strict';

define(['angular', 'lodash',
  '/referencia/app/clientesProveedores/component/clienteProveedoresDetalleModal.js'
], function(ng, _) {

  referenciaRegistroPreviewController.$inject = ['registroService', '$scope', '$state', '$uibModal', 'panelService',
    'localStorageService', '$rootScope', '$timeout', 'staticData', 'authorizedResource'
  ];

  function referenciaRegistroPreviewController(registroService, $scope, $state, $uibModal, panelService,
    localStorageService, $rootScope, $timeout, staticData, authorizedResource) {
    var vm = this, getDataST = {}, dataToST = {};
    vm.btnSave = {};
    vm.loader = {};
    vm.loader.text = 'Estamos guardando la referencia';
    vm.$onInit = function oiFn() {
      if (!$rootScope.previousState) {
        localStorageService.clearAll();
        getDataST = {};
        $state.go('referencia.panel.registro.origen');
      } else {
        getDataST = localStorageService.get('dataReg');
        if (!_.isEmpty(getDataST)) {
          dataToST = getDataST;
        } else {
          dataToST.filtrosDestino = {};
        }
      }
      vm.currentStep = '4';
      vm.panel = vm.title = 'Registrar Referencia';
      vm.clsLoad = 'modal-data--is-loading';
      vm.origen = {};
      vm.paciente = {};
      vm.proveedores = {};
      vm.btnSave.text = 'Guardar solicitud';
      vm.btnSave.state = 'confirm';

      if (getDataST) {
        //  get data from storage
        getDataST.origen && (vm.origen = getDataST.origen);
        getDataST.paciente && (vm.paciente = getDataST.paciente);
        getDataST.filtrosDestino && (vm.filtrosDestino = getDataST.filtrosDestino);

        if (getDataST.proveedores) {
          vm.proveedores = getDataST.proveedores;
          vm.proveedoresLength = vm.proveedores.length;
        }
      }
    };

    vm.areThereServicios = function atsFn() {
      var servicios = vm.filtrosDestino.servicios && vm.filtrosDestino.servicios.length;
      var imagenes = vm.filtrosDestino.serviimagenes && vm.filtrosDestino.serviimagenes.length;
      var emergencias = vm.filtrosDestino.serviemergencias && vm.filtrosDestino.serviemergencias.length;
      var ambulancias = vm.filtrosDestino.serviambulancias && vm.filtrosDestino.serviambulancias.length;
      var especialidades = vm.filtrosDestino.especialidades && vm.filtrosDestino.especialidades.length;
      return servicios || imagenes || emergencias || ambulancias || especialidades;
    };

    vm.nextStep = function cFn() {
      var notas = {};
      notas.obs = vm.obs;
      notas.requerimientos = vm.requerimientos;
      dataToST.notas = notas;

      vm.btnSave.state === 'confirm' ? vm.confirmModal() : saveRegistro();
    };

    function saveRegistro() {
      vm.loader.loading = true;
      dataToST.profile = authorizedResource.profile.loginUserName;
      registroService.saveRegistro(dataToST).then(function srFnPr(payload) {
        $scope.$evalAsync(function eaFn() {
          if (payload.OperationCode === staticData.operationCode.success) {
            dataToST.notas.idReferencia = payload.Data.idReferencia;
            localStorageService.set('dataReg', dataToST);
            $state.go('referencia.panel.registro.comprobante');
          }
        });
      });
    }

    vm.openClientProveedoresDetailModal = function(afiliado, type) {
      var modalInstance = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: true,
        animation: vm.animationsEnabled,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal-cpd fade',
        template: '<modalcpd-referencia close="close()" afiliado="infoAfiliado">HLEO</modalcpd-referencia>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };

          scope.infoAfiliado = {};
          scope.infoAfiliado.clsIsLoading = vm.clsLoad;
          scope.infoAfiliado.info = afiliado;
          type === 'asegurado' && (scope.infoAfiliado.info.cobertura = null);

          $timeout(function() {
            scope.infoAfiliado.clsIsLoading = '';
          }, 500);
        }]
      });
      modalInstance.result.then(function() {}, function() {});
    };

    vm.verCoberturaXClinica = function(proveedor) {
      var req = {};
      req.companyID = vm.paciente.asegurado.companyID; // eslint-disable-line
      req.cod_afiliado = vm.paciente.asegurado.id; // eslint-disable-line
      req.plan_afiliado = vm.paciente.asegurado.plan; // eslint-disable-line
      req.evinculada_ruc = proveedor.evinculada_ruc; // eslint-disable-line
      req.evinculada_codigo = proveedor.evinculada_codigo; // eslint-disable-line

      var modalInstance = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: true,
        animation: vm.animationsEnabled,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal-cpd fade',
        template: '<modalcpd-referencia close="close()" afiliado="infoAfiliado">HLEO</modalcpd-referencia>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };

          scope.infoAfiliado = {};
          scope.infoAfiliado.clsIsLoading = vm.clsLoad;
          scope.infoAfiliado.info = vm.paciente;

          registroService.getCoberturaByAsegurado(req).then(function gaiFnPr(payload) {
            $scope.$evalAsync(function eaFn() {
              scope.infoAfiliado.info.cobertura = payload.lista;
              scope.infoAfiliado.clsIsLoading = '';
            });
          });
        }]
      });
      modalInstance.result.then(function() {}, function() {});
    };

    vm.confirmModal = function() {
      var modalInstance = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: true,
        animation: vm.animationsEnabled,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal-msg fade',
        template: '<modalmsg close="close()" save="save()" options="options"></modalmsg>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };

          scope.save = function() {
            $uibModalInstance.close();
            vm.btnSave.text = 'Enviar solicitud';
            vm.btnSave.state = 'save';
            saveRegistro();
          };

          scope.options = {};
          scope.options.title = '¿Estás seguro que deseas guardar la referencia?';
          scope.options.subtitle = 'Una vez guardada, no podrás modificarla';
          scope.options.type = 'confirm';
          scope.options.saveTxt = 'Guardar';
          scope.options.cancelTxt = 'Cancelar';
        }]
      });
      modalInstance.result.then(function() {}, function() {});
    };
  } // end referenciaRegistroPreviewController

  return ng.module('referenciaApp')
    .controller('referenciaRegistroPreviewController', referenciaRegistroPreviewController);
});
