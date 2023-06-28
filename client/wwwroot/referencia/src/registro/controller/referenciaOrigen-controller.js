'use strict';

define(['angular', 'lodash'], function(ng, _) {

  referenciaOrigenController.$inject = ['$scope', '$state', '$log', 'staticData', 'panelService', 'rx',
    'localStorageService', '$timeout'
  ];

  function referenciaOrigenController($scope, $state, $log, staticData, panelService, rx, localStorageService,
    $timeout) {
    var vm = this,
      getDataST = {},
      dataToST = {},
      idxSelected;

    vm.$onInit = function oiFn() {
      if ($state.params.estado !== 'upd') {
        localStorageService.clearAll();
        getDataST = {};
      } else {
        getDataST = localStorageService.get('dataReg');
        if (!_.isEmpty(getDataST)) {
          dataToST = getDataST;
        } else {
          dataToST.origen = {};
        }
      }
      vm.origen = {};
      vm.currentStep = '1';
      vm.panel = vm.title = 'Registrar Referencia';
      vm.mapId = 'mapaPeru';
      vm.mapSvg = '/referencia/assets/mapaPeru.svg';
      vm.loadCls = '';
      vm.showUbigeo = false;
      vm.lstDptos = staticData.departamentos;
      vm.lstTiposReferencia = staticData.tipoRef;
      vm.tipoRefSelected = [];

      if (!_.isEmpty(getDataST)) {
        vm.origen = getDataST.origen;
        // load drop downs obj
        if (vm.origen.departamento) {
          var ubigeoDepa = vm.origen.departamento.id;
          vm.origen.departamento = _.find(vm.lstDptos, function filterFn(item) {
            return item.id === ubigeoDepa;
          });
          vm.mapId = 'mapa' + vm.origen.departamento.nombre;
          vm.mapSvg = '/referencia/assets/' + ubigeoDepa + '.svg';
          $timeout(function toFn() {
            $scope.$broadcast('changeProvincia', vm.origen.provincia);
          }, 1000);
        }
        if (vm.origen.provincia) {
          vm.lstProvincias = staticData.provincias[ubigeoDepa];
          var tmpProvincia = _.find(vm.lstProvincias, function filterFn(item) {
            return item.id === vm.origen.provincia;
          });
          vm.provincia = tmpProvincia;
        }

        idxSelected = _.findIndex(vm.lstTiposReferencia, vm.origen.origenReferencia);
        vm.tipoRefSelected[idxSelected] = true;
      } else {
        vm.origen.departamento = {};
        vm.origen.provincia = {};
      }
      vm.dataRequiredError = false;
    };  // end $onInit

    vm.openMap = function omFn(lvl, loc, isNotChangingMap) {
      var dataMapa = {};
      dataMapa.id = loc;

      if (isNotChangingMap) {
        vm.lstProvincias.some(function itFn(item) {
          if (item.id === loc) {
            vm.provRequiredError = false;
            vm.origen.provincia = item;
            return true;
          }
        });
      } else {
        vm.lstDptos.some(function itFn(item) {
          if (item.id === loc) {
            vm.depaRequiredError = false;
            vm.origen.departamento = item;
            return true;
          }
        });

        vm.lstProvincias = staticData.provincias[loc];
        $timeout(function toFn() {
          vm.mapId = 'mapa' + loc;
          vm.mapSvg = '/referencia/assets/' + loc + '.svg';
          vm.loadCls = 'is-loaded';
        }, 500);
      }
    };

    vm.toggle = function tgFn(idx) {
      (idxSelected !== void 0) && (vm.tipoRefSelected[idxSelected] = false);
      vm.typeRequiredError = false;
      vm.tipoRefSelected[idx] = !vm.tipoRefSelected[idx];
      idxSelected = idx;
    };

    vm.isDisabled = function idFn(myform) {
      vm.myfrm = myform.$valid && !myform.$pristine;
      return !vm.myfrm || (!vm.origen.refType
        && !vm.origen.centro
        && !vm.origen.responsable
        && !vm.origen.tel
        && !vm.origen.mail
      );
    };

    vm.change = function changeFn(type) {
      switch (type) {
        case 'dep':
          vm.origen.provincia = {};
          vm.lstProvincias = [];
          vm.depaRequiredError = false;
          if (!vm.origen.departamento) {
            vm.mapId = 'mapaPeru';
            vm.origen.departamento = {};
            vm.origen.provincia = {};
            vm.mapSvg = '/referencia/assets/mapaPeru.svg';
          } else {
            vm.loadCls = 'is-loading';
            $timeout(function toFn() {vm.loadCls = '';}, 500);
            vm.mapId = 'mapa' + vm.origen.departamento.id;
            vm.mapSvg = '/referencia/assets/' + vm.origen.departamento.id + '.svg';
            vm.lstProvincias = staticData.provincias[vm.origen.departamento.id];
          }
          break;
        case 'pro':
          vm.provRequiredError = false;
          $scope.$broadcast('changeProvincia', { id: vm.origen.provincia.id });
          break;
        default:
          $log.info('changeFn - No type');
      }
    };

    vm.buscar = function buscarFn() {
      vm.depaRequiredError = !vm.origen.departamento.id ? true : false;
      vm.provRequiredError = !vm.origen.provincia.id ? true : false;
      vm.typeRequiredError = !vm.origen.origenReferencia ? true : false;
      vm.dataRequiredError = !(vm.origen.centro && vm.origen.responsable && vm.origen.tel && vm.origen.mail);

      if ($scope.origenRefForm.$valid && !vm.depaRequiredError && !vm.provRequiredError) {
        dataToST.origen = vm.origen;
        localStorageService.set('dataReg', ng.copy(dataToST));
        $state.go('referencia.panel.registro.paciente');
      }
    };

  } //  end referenciaOrigenController

  return ng.module('referenciaApp')
    .controller('referenciaOrigenController', referenciaOrigenController);
});
