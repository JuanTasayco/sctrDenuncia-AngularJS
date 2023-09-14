'use strict';
define(['angular', 'lodash'], function(ng, _) {
  var module = ng.module('referenciaApp');
  module.controller('mapaProveedoresController', mapaProveedoresController);
  mapaProveedoresController.$inject = ['$rootScope', '$scope', '$state', '$log', 'observeOnScope',
    'dataProveedores', '$timeout', 'panelService', 'staticData', '$window', 'coreDataService',
    '$location', 'oimPrincipal'
  ];

  function mapaProveedoresController($rootScope, $scope, $state, log, observeOnScope, dataProveedores, $timeout,
    panelService, staticData, $window, coreDataService, $location, oimPrincipal) {
    var vm = this;
    var lstProvs = staticData.provincias;
    vm.loader = {};
    vm.ipLocal = $window.localStorage['clientIp'] ? $window.localStorage['clientIp'] : "0.0.0.0";

    vm.$onInit = function oiFn() {
      vm.showCP = true;
      vm.panel = 'Clientes y Proveedores';
      vm.proveedores = dataProveedores.proveedores;
      vm.mapId = 'mapaPeru';
      vm.mapSvg = '/referencia/assets/mapaPeru.svg';
      vm.activeLvl0 = 'active';
      vm.lvl0 = 'Proveedores';
      vm.lvl1 = '';
      vm.lvl2 = '';
      vm.showLvl1 = false;
      vm.showLvl2 = false;
      vm.isDptoOpen = false;
      vm.lstDptos = staticData.departamentos;
      vm.loadCls = '';
      vm.namePlace = 'Perú';

      //  set dropdown items
      vm.lstAtributos = staticData.atributos;
      vm.lstCategorias = coreDataService.getCategorias();
      vm.lstEntidades = coreDataService.getEntidades();
      vm.lstConvenios = staticData.convenios;
      vm.atributo = vm.lstAtributos[0];
      vm.categoria = '';
      vm.convenio = '';
      vm.entidad = '';

      vm.showFrmAttr = true;
      vm.showFrmName = false;

      // if exists parameters
      if ($state.params.lvl) {
        var lvl = +$state.params.lvl || 1;
        var lugar = $state.params.pl;
        var cambio = ($state.params.cambio === 'true') ? true : false;

        var depa = getDepa(lugar);
        var prov = getProv(lugar);
        vm.lvl1 = depa.nombre;
        vm.lvl2 = prov.nombre;

        vm.mapSvg = '/referencia/assets/' + depa.id + '.svg';
        // used in class SVG container
        vm.mapId = 'mapa' + depa.id;
        vm.loader.text = 'Estamos cargando los datos para los proveedores de ' + vm.lvl1 + ', ' + vm.lvl2;
        vm.openMap(lvl, lugar, cambio);
      }
    };  // end onInit

    function getDepa(ubigeo) {
      var ubiDepa = (ubigeo === '07') ? '15' : ubigeo.substring(0, 2);
      var depa = _.find(vm.lstDptos, function filterFn(item) {
        return item.id === ubiDepa;
      });
      return depa;
    }

    function getProv(ubigeo) {
      var prov = {};
      prov.nombre = '';
      var depa = getDepa(ubigeo);
      if (ubigeo.length === 4) {
        var arrSelectedProv = lstProvs[depa.id];
        prov = _.find(arrSelectedProv, function filterProvFn(item) {
          return item.id === ubigeo;
        });
      }
      return prov;
    }

    vm.openMap = function omFn(lvl, loc, isChangingMap) {
      vm.loadCls = 'is-loading';
      vm.loader.loading = true;
      var prefix = (function(state) {
        if (state === 'referencia.panel.clientes') {
          return 'Clientes';
        } else if (state === 'referencia.panel.proveedores') {
          return 'Proveedores';
        }
      }($state.current.name));
      if (lvl === 0) {
        vm.lvl1 = '';
        vm.showLvl1 = false;
        vm.lvl2 = '';
      }
      var depa = getDepa(loc);
      var prov = getProv(loc);
      vm.lvl1 = depa.nombre;
      vm.lvl2 = prov.nombre;
      vm.pl = loc;
      vm.loader.text = 'Estamos cargando la lista de proveedores de ' + vm.lvl1 + ', ' + vm.lvl2;

      vm.showLvl2 = false; // this variable will be set in getClientes()

      vm.namePlace = vm.lvl2 || vm.lvl1;

      var dataMapa = {};
      dataMapa.lvl = lvl;
      dataMapa.pl = loc;
      dataMapa.cambio = isChangingMap;

      $state.current.reloadOnSearch = false;
      $location.search('lvl', dataMapa.lvl);
      $location.search('pl', dataMapa.pl);
      $location.search('cambio', dataMapa.cambio);
      $scope.$emit('changeMap' + prefix, dataMapa);
      $timeout(function() {
        $state.current.reloadOnSearch = void 0;
      }, 0);
      return;
    };

    vm.tipoEntidad = function tipoEntFn(unidad) {
      return unidad.particulares ? 'particulares' : 'empresas';
    };

    vm.seeAll = function saFn() {
      var data = {};
      vm.lvl1 && (data.lvl1 = vm.lvl1) === true;
      vm.lvl2 && (data.lvl2 = vm.lvl2) === true;
      vm.pl && (data.pl = vm.pl);
      vm.loader.loading = true;
      vm.loader.text = 'Estamos cargando la lista de proveedores';
      $state.go('referencia.panel.proveedores.busqueda', data);
    };

    vm.changeFrm = function() {
      var selectedItem = vm.atributo.id;
      if (selectedItem === 'attr') {
        vm.showFrmAttr = true;
        vm.showFrmName = false;
      } else {
        vm.showFrmAttr = false;
        vm.showFrmName = true;
      }
    };

    vm.isDisabled = function idFn(myform) {
      return myform.$pristine || !vm.nombre;
    };

    vm.buscar = function bsFn() {
      var data = {};

      if (vm.showFrmAttr) {
        vm.entidad && (data.entidad = vm.entidad.id);
        vm.convenio && (data.convenio = vm.convenio.id);
        vm.categoria && (data.categoria = vm.categoria.id);
      } else {
        // no enviamos los campos convenio, etc.
        data = {};
        data.nom = vm.nombre;
      }

      vm.atributo && (data.atributo = vm.atributo.id);
      vm.lvl1 && (data.lvl1 = vm.lvl1);
      vm.lvl2 && (data.lvl2 = vm.lvl2);
      data.pl = vm.pl ? vm.pl : null;
      vm.loader.loading = true;
      vm.loader.text = 'Estamos cargando la lista de proveedores';
      $state.go('referencia.panel.proveedores.busqueda', data);

      let optionMenu = vm.showFrmAttr ? "Proveedores/Perú - Buscar proveedor - atributos" : "Proveedores/Perú - Buscar proveedor - nombre";
      let descriptionOperation = vm.showFrmAttr ? "Click al botón Buscar Proveedores - atributos" : "Click al botón Buscar Proveedores - nombre";

      const obj = {
        "codigoAplicacion": "REF",
        "ipOrigen": vm.ipLocal,
        "tipoRegistro": "O",
        "codigoObjeto": "PROVEEDORES",
        "opcionMenu": optionMenu,
        "descripcionOperacion": descriptionOperation, 
        "filtros": angular.toJson(data),
        "codigoUsuario": oimPrincipal.getUsername(),
        "numeroSesion": "",
        "codigoAgente": 0
      };

      panelService.saveTracker(obj);
    };

    var unBindChangeMapListener = $scope.$on('changeMapProveedores', function(event, data) {

      panelService.getProveedores(data.pl).then(function gcsFnPr(payload) {
        $scope.$evalAsync(function eaFn() {
          vm.loadCls = 'is-loaded';
          vm.loader.loading = false;
          vm.proveedores = payload.proveedores;
          if (data.lvl === 1) {
            vm.showLvl1 = true;
          } else if (data.lvl === 2) {
            vm.showLvl2 = true;
            // setear cuando se ingresa directamente desde la url
            data.cambio = true;
            vm.showLvl1 = true;
          }
          if (!data.cambio) {
            // used in class SVG container
            vm.mapId = 'mapa' + data.pl;
            vm.mapSvg = '/referencia/assets/' + data.pl + '.svg';
          }
          $timeout(function toFn() {
            $scope.$broadcast('getPlace', data);
          }, 500);
        });
      }, function gceFnPr(error) {
        log.error(error);
      });
    });

    $scope.$on('$destroy', function dFn() {
      unBindChangeMapListener();
    });
  }
});
