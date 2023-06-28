'use strict';

define(['angular', 'lodash',
  '/referencia/app/clientesProveedores/component/clienteProveedoresDetalleModal.js'],
function(ng, _) {

  referenciaRegistroReceiptController.$inject = ['$rootScope', '$scope', '$state', 'localStorageService',
    'NgMap', 'registroService', '$timeout', '$uibModal', '$window', '$log', '$filter', 'authorizedResource', '$sce'
  ];

  function referenciaRegistroReceiptController($rootScope, $scope, $state, localStorageService, NgMap,
    registroService, $timeout, $uibModal, $window, $log, $filter, authorizedResource, $sce
    ) {
    var vm = this, dataToST = {}, getDataST = {};
    vm.loader = {};
    vm.loader.text = 'Estamos cargando tu consulta';
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
      vm.origen = {};
      vm.paciente = {};
      vm.proveedores = {};
      vm.dataToPdf = {};
      vm.mapShow = [];
      vm.currentUser = authorizedResource.profile.userName;
      // para probar en local: /api/referencia/..
      vm.pdfURL =  $sce.trustAsResourceUrl('https://oim.mapfre.com.pe/oim_referencia/api/referencia/resumen/pdf');

      if (getDataST) {
        //  get data from session storage
        getDataST.origen && (vm.origen = getDataST.origen);
        getDataST.paciente && (vm.paciente = getDataST.paciente);
        getDataST.filtrosDestino && (vm.filtrosDestino = getDataST.filtrosDestino);

        if (getDataST.proveedores) {
          vm.proveedores = getDataST.proveedores;
          vm.proveedoresLength = vm.proveedores.length;
        }

        getDataST.notas && (vm.notas = getDataST.notas);
        dataToST.notas.usuarioCreacion = vm.currentUser;
      }

      registroService.getDateRegistro().then(function gdrPr(data) {
        vm.notas.dateRegistro = $filter('date')(data, 'dd-MM-yyyy HH:mm');
        vm.dataToPdf = registroService.getObjReq(dataToST);
        vm.dataToPdf.fechaCreacion = data.toISOString();
      });

      vm.isThereFiltros = _.isEmpty(vm.filtrosDestino);
    }; //  end onInit

    vm.areThereServicios = function atsFn() {
      var servicios = vm.filtrosDestino.servicios && vm.filtrosDestino.servicios.length;
      var imagenes = vm.filtrosDestino.serviimagenes && vm.filtrosDestino.serviimagenes.length;
      var emergencias = vm.filtrosDestino.serviemergencias && vm.filtrosDestino.serviemergencias.length;
      var ambulancias = vm.filtrosDestino.serviambulancias && vm.filtrosDestino.serviambulancias.length;
      var especialidades = vm.filtrosDestino.especialidades && vm.filtrosDestino.especialidades.length;
      return servicios || imagenes || emergencias || ambulancias || especialidades;
    };

    vm.toggleMap = function tgFn(idx, item) {
      vm.mapShow[idx] = !vm.mapShow[idx];

      if (vm.mapShow[idx]) {
        $timeout(function() {
          NgMap.initMap(item.id);
        }, 500);
      }
    };

    vm.verDetalleProveedor = function vdpFn(item) {
      var data = {};
      data.id = item.id;
      data.estado = 'comprobante';
      vm.loader.loading = true;
      $state.go('referencia.panel.proveedores.busqueda.detalle.info', data);
    };

    vm.openClientProveedoresDetailModal = function(proveedor) {
      var coberturas = proveedor.coberturas;

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

          $timeout(function ctFn() {
            scope.infoAfiliado.info.cobertura = coberturas;
            scope.infoAfiliado.clsIsLoading = '';
          }, 650);

        }]
      });
      modalInstance.result.then(function() {}, function() {});
    };  // end openClientProveedoresDetailModal

  } //  end controller

  return ng.module('referenciaApp')
    .controller('referenciaRegistroReceiptController', referenciaRegistroReceiptController);
});
