'use strict';
define(['angular', 'lodash'], function(ng, _) {
  var module = ng.module('referenciaApp');
  module.controller('mapaClienteController', mapaClienteController);
  mapaClienteController.$inject = ['$rootScope', '$scope', '$state', '$log', 'observeOnScope',
    'dataClientes', '$timeout', 'panelService', 'staticData', '$location', 'localStorageService', 'oimPrincipal', '$window'
  ];

  function mapaClienteController($rootScope, $scope, $state, log, observeOnScope,
    dataClientes, $timeout, panelService, staticData, $location, localStorageService, oimPrincipal, $window) {
    var vm = this;
    var lstProvs = staticData.provincias;
    vm.loader = {};
    vm.ipLocal = $window.localStorage['clientIp'] ? $window.localStorage['clientIp'] : "0.0.0.0";

    vm.$onInit = function oiFn() {
      vm.showCP = true;
      vm.panel = 'Clientes y Proveedores';
      vm.mapId = 'mapaPeru';
      vm.lvl0 = 'Clientes';
      vm.afiliados = dataClientes.afiliados;
      vm.grupos = dataClientes.grupos;
      vm.namePlace = 'Perú';
      vm.activeLvl0 = 'active';
      vm.showLvl1 = false;
      vm.showLvl2 = false;
      vm.isDptoOpen = false;
      vm.lstDptos = staticData.departamentos;
      vm.listShow = [];

      vm.nombre = '';
      vm.dni = '';

      vm.mapSvg = '/referencia/assets/mapaPeru.svg';
      vm.lvl1 = '';
      vm.lvl2 = '';
      vm.loadCls = '';
      localStorageService.remove('bc.entidadFrom');
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
        vm.loader.text = 'Estamos cargando la lista de clientes de ' + vm.lvl1 + ', ' + vm.lvl2;
        vm.openMap(lvl, lugar, cambio);
      }

      var unRegDni = $scope.$watch('$ctrl.dni', function(newVal, oldVal) {
        if (newVal && oldVal !== newVal) {
          vm.apellidos = vm.nombre = '';
        }
      });

      var unRegNom = $scope.$watch(function() {
        return vm.nombre + vm.apellidos;
      }, function(newVal, oldVal) {
        if (newVal && oldVal !== newVal) {
          vm.dni = '';
        }
      });

      $scope.$on('$destroy', function() {
        unRegDni();
        unRegNom();
      });
    }; // end onInit

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

    vm.toggle = function tgFn(idx, idy) {
      vm.listShow[idx][idy] = !vm.listShow[idx][idy];
    };

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
      vm.loader.text = 'Estamos cargando la lista de clientes de ' + vm.lvl1 + ', ' + vm.lvl2;
      // this variable will be set in getClientes()
      vm.showLvl2 = false;

      vm.namePlace = vm.lvl2 || vm.lvl1;

      var dataMapa = {};
      dataMapa.lvl = lvl;
      dataMapa.pl = loc;
      dataMapa.cambio = isChangingMap;

      // set url with parameters
      // $state.go($state.current.name, dataMapa, {notify: false, reload: false});
      $state.current.reloadOnSearch = false;
      $location.search('lvl', dataMapa.lvl);
      $location.search('pl', dataMapa.pl);
      $location.search('cambio', dataMapa.cambio);
      $scope.$emit('changeMap' + prefix, dataMapa);
      $timeout(function() {
        $state.current.reloadOnSearch = void 0;
      }, 0);
      if (lvl === 1 || lvl === 2) {
        let opcionMenu = lvl === 1 ? "Clientes/Perú - Ver departamento" : "Clientes/Perú - Ver distrito";
        let descripcionOperacion = lvl === 1 ? "Click a un departamento del Perú" : "Click a un distrito del Perú";
        let filters = lvl === 1 ?  {departamento: vm.lvl1} : {departamento: vm.lvl1, provincia: vm.lvl2};

        const obj = {
          "codigoAplicacion": "REF",
          "ipOrigen": vm.ipLocal,
          "tipoRegistro": "O",
          "codigoObjeto": "PROVEEDORES",
          "opcionMenu": opcionMenu,
          "descripcionOperacion": descripcionOperacion,
          "filtros":  angular.toJson(filters),
          "codigoUsuario": oimPrincipal.getUsername(),
          "numeroSesion": "",
          "codigoAgente": 0
        };

        panelService.saveTracker(obj);
      }
      return;
    };

    vm.isDisabled = function idFn() {
      var myform = $scope.BusquedaClienteForm;
      return !(ng.equals({}, myform.$error) && (vm.dni || (vm.nombre && vm.apellidos)));
    };

    vm.validacionNombre = function() {
      return $scope.BusquedaClienteForm.$dirty && ((vm.apellidos && !vm.nombre) || (vm.nombre && !vm.apellidos));
    };

    vm.buscar = function buscarFn() {
      if (vm.isDisabled()) {
        return;
      }
      var data = {};
      data.tipo = 'filtro';
      data.entidad = 'filtro'; // este parametro se usa para ocultar los inputs del form
      vm.dni && (data.filtro1 = vm.dni);
      vm.nombre && (data.filtro2 = vm.nombre);
      vm.apellidos && (data.filtro3 = vm.apellidos);
      vm.lvl1 && (data.lvl1 = vm.lvl1);
      vm.lvl2 && (data.lvl2 = vm.lvl2);

      vm.loader.loading = true;
      vm.loader.text = 'Estamos cargando la lista de asegurados según tu búsqueda';
      $state.go('referencia.panel.clientes.busqueda', data);

      const filter = {nombres: vm.nombre || '', apellidos: vm.apellidos || '', dni: vm.dni || ''};

      const obj = {
        "codigoAplicacion": "REF",
        "ipOrigen": vm.ipLocal, 
        "tipoRegistro": "O",
        "codigoObjeto": "PROVEEDORES",
        "opcionMenu": "Clientes/Perú - Buscar cliente",
        "descripcionOperacion": "Click al botón Buscar Clientes",
        "filtros": angular.toJson(filter),
        "codigoUsuario": oimPrincipal.getUsername(),
        "numeroSesion": "",
        "codigoAgente": 0
      };

      panelService.saveTracker(obj);
    };

    vm.filtrarPorEntidad = function fpeFn(grupo, unidad) {
      var data = {};
      grupo && (data.filtro1 = grupo.id);
      unidad && (data.filtro2 = unidad.id);
      vm.lvl1 && (data.lvl1 = vm.lvl1);
      vm.lvl2 && (data.lvl2 = vm.lvl2);

      vm.loader.loading = true;
      vm.loader.text = 'Estamos cargando la lista de clientes';
      if (unidad.id && /n/i.test(unidad.id)) {
        data.tipo = 'empresa';
        data.entidad = 'empresa'; // este parametro se usa para ocultar los inputs del form
        $state.go('referencia.panel.clientes.busqueda', data);
      } else {
        data.entidad = 'clientes';
        $state.go('referencia.panel.clientes.busquedaEmpresa', data);
      }

      const obj = {
        "codigoAplicacion": "REF",
        "ipOrigen": vm.ipLocal,
        "tipoRegistro": "O",
        "codigoObjeto": "PROVEEDORES",
        "opcionMenu": "Clientes/Perú - ver empresas",
        "descripcionOperacion": "Click al ícono ver Empresas",
        "filtros": "",
        "codigoUsuario": oimPrincipal.getUsername(),
        "numeroSesion": "",
        "codigoAgente": 0
      };

      panelService.saveTracker(obj);
    };

    vm.tipoEntidad = function tipoEntFn(unidad) {
      var str;
      if (unidad.id && /n/i.test(unidad.id)) {
        str = 'ver los ' + unidad.empresas + ' particulares';
      } else {
        str = 'ver las ' + unidad.empresas + ' empresas';
      }
      return str;
    };

    var unBindChangeMapListener = $scope.$on('changeMapClientes', function(event, data) {

      panelService.getClientes(data.pl).then(function gcsFnPr(payload) {
        $scope.$evalAsync(function eaFn() {
          vm.loadCls = 'is-loaded';
          vm.loader.loading = false;
          vm.afiliados = payload.afiliados;
          vm.grupos = payload.grupos;
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
