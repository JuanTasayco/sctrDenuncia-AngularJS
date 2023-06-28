'use strict';

define(['angular', 'typeahead', 'bloodhound', 'lodash'], function(ng, typeahead, Bloodhound, _) {

  referenciaDestinoController.$inject = ['$scope', '$state', 'localStorageService', 'panelService',
    'coreDataService', '$log', '$rootScope', '$uibModal'
  ];

  function referenciaDestinoController($scope, $state, localStorageService, panelService, coreDataService,
    $log, $rootScope, $uibModal) {
    var vm = this, dataToST = {};
    vm.loader = {};
    vm.loader.text = 'Estamos cargando tu consulta';
    vm.$onInit = function oiFn() {
      if (!$rootScope.previousState) {
        localStorageService.clearAll();
        vm.getDataST = {};
        $state.go('referencia.panel.registro.origen');
      } else {
        vm.getDataST = localStorageService.get('dataReg');
        if (!_.isEmpty(vm.getDataST)) {
          dataToST = vm.getDataST;
        } else {
          dataToST.filtrosDestino = {};
        }
      }
      vm.currentStep = '2';
      vm.panel = vm.title = 'Registrar Referencia';
      vm.espSelected = {};
      vm.lstEspSelected = [];
      vm.filter = {};

      vm.filter.plOrigen = dataToST.origen.provincia.id;

      vm.lstSelServicios = [];
      vm.lstSelServiImagenes = [];
      vm.lstSelServiEmergencias = [];
      vm.lstSelServiAmbulancias = [];

      vm.lstServicios = coreDataService.getServicios();
      vm.lstSeviImagenes = coreDataService.getImagenologias();
      vm.lstServiEmergencias = coreDataService.getEmergencias();
      vm.lstServiAmbulancias = coreDataService.getAmbulancias();
      var lstEspecialidades = coreDataService.getEspecialidades();

      vm.especialidadesBH = new Bloodhound({
        datumTokenizer: function(d) {
          return Bloodhound.tokenizers.whitespace(d.nombre);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: lstEspecialidades
      });

      vm.especialidadesBH.initialize();
      vm.especialidadesDataset = {
        displayKey: 'nombre',
        source: vm.especialidadesBH.ttAdapter(),
        templates: {
          empty: [
            '<div class="tt-suggestion tt-empty-message">',
            'No hay resultados ...',
            '</div>'
          ].join('\n')
        }
      };
      if (!_.isEmpty(dataToST.filtrosDestino)) {
        vm.filter = ng.copy(dataToST.filtrosDestino);
        //  checked inputs from data storage
        vm.lstSelServicios = vm.filter.servicios;
        vm.lstSelServiImagenes = vm.filter.serviimagenes;
        vm.lstSelServiEmergencias = vm.filter.serviemergencias;
        vm.lstSelServiAmbulancias = vm.filter.serviambulancias;
      }
    };  //  end onInit

    /**
     *  Called when there is any change in the form.
     * @param {string} type - The type of component.
     */
    vm.change = function changeFn(type) {
      localStorageService.remove('filterData');
      switch (type) {
        case 'ser':
          vm.filter.servicios = vm.lstSelServicios;
          break;
        case 'serviImg':
          vm.filter.serviimagenes = vm.lstSelServiImagenes;
          break;
        case 'serviemergencia':
          vm.filter.serviemergencias = vm.lstSelServiEmergencias;
          break;
        case 'serviambulancia':
          vm.filter.serviambulancias = vm.lstSelServiAmbulancias;
          break;
        case 'esp':
          vm.filter.especialidades = vm.lstEspSelected;
          break;
        default:
          $log.info('changeFn - No type');
      }
    };

    function hayServicioSeleccionados() {
      var lengthServi = vm.lstSelServicios && vm.lstSelServicios.length;
      var lengthServiImg = vm.lstSelServiImagenes && vm.lstSelServiImagenes.length;
      var lengthServiEmergencia = vm.lstSelServiEmergencias && vm.lstSelServiEmergencias.length;
      var lengthServiAmbulancia = vm.lstSelServiAmbulancias && vm.lstSelServiAmbulancias.length;
      var lengtEsp = vm.lstEspSelected && vm.lstEspSelected.length;

      return (lengthServi
        || lengthServiImg
        || lengthServiEmergencia
        || lengthServiAmbulancia
        || lengtEsp) ? true : false;
    }

    vm.infoModal = function() {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: true,
        animation: vm.animationsEnabled,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal-msg fade',
        template: '<modalmsg close="close()" options="options"></modalmsg>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };

          scope.options = {};
          scope.options.title = 'Debes seleccionar por lo menos un servicio o especialidad para realizar la búsqueda';
          scope.options.subtitle = '';
          scope.options.type = 'info';
          scope.options.okTxt = 'Aceptar';
        }]
      });
    };

    vm.nextStep = function cFn() {
      if (!hayServicioSeleccionados()) {
        vm.infoModal();
        return;
      }
      dataToST.filtrosDestino = ng.copy(vm.filter);

      localStorageService.set('dataReg', ng.copy(dataToST));
      vm.loader.loading = true;
      $state.go('referencia.panel.registro.response');
    };

    var tasUnFn = $scope.$on('typeahead:select', function tasFn() {
      // https://jsperf.com/lodash-find-vs-findindex/3
      $scope.$evalAsync(function eaFn() {
        var it = _.find(vm.lstEspSelected, function _findFn(item) {
          return item.nombre === vm.espSelected.nombre;
        });
        if (!it) {
          vm.lstEspSelected.push(vm.espSelected);
          vm.change('esp');
        }
        vm.espSelected = {};
      });
    });

    vm.deleteEsp = function delEspFn(idx) {
      $scope.$evalAsync(function eaFn() {
        vm.lstEspSelected.splice(idx,1);
        vm.change('esp');
      });
    };

    $scope.$on('$destroy', function onDestroyFn() {
      tasUnFn();
    });

  } // end function referenciaDestinoController

  return ng.module('referenciaApp')
    .controller('referenciaDestinoController', referenciaDestinoController);
});
