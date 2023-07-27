'use strict';
define(['angular'], function(ng) {
  var module = ng.module('referenciaApp');
  module.controller('ModalCPController', ['$state', 'oimPrincipal', 'panelService', '$window',function ctrFn($state, oimPrincipal, panelService, $window) {
    var vm = this;

    vm.ipLocal = $window.localStorage['clientIp'] ? $window.localStorage['clientIp'] : "0.0.0.0";

    vm.openClientes = function opFn() {
      $state.go('referencia.panel.clientes');
      vm.loader.text = 'Estamos cargando la información de clientes';
      vm.loader.loading = true;
      vm.close();

      const obj = {
        "codigoAplicacion": "REF",
        "ipOrigen": vm.ipLocal, 
        "tipoRegistro": "O",
        "codigoObjeto": "PROVEEDORES",
        "opcionMenu": "Pantalla de Inicio - Buscar cliente",
        "descripcionOperacion": "Click al botón Buscar Clientes",
        "filtros": "",
        "codigoUsuario": oimPrincipal.getUsername(),
        "numeroSesion": "",
        "codigoAgente": 0
      };

      panelService.saveTracker(obj);
    };
    vm.openProveedores = function ocFn() {
      $state.go('referencia.panel.proveedores');
      vm.loader.text = 'Estamos cargando la información de proveedores';
      vm.loader.loading = true;
      vm.close();

      const obj = {
        "codigoAplicacion": "REF",
        "ipOrigen": vm.ipLocal, 
        "tipoRegistro": "O",
        "codigoObjeto": "PROVEEDORES",
        "opcionMenu": "Pantalla de Inicio - Buscar proveedores",
        "descripcionOperacion": "Click al botón Buscar Proveedores",
        "filtros": "",
        "codigoUsuario": oimPrincipal.getUsername(),
        "numeroSesion": "",
        "codigoAgente": 0
      };

      panelService.saveTracker(obj);
    };
  }]).component('modalcpReferencia', {
    templateUrl: '/referencia/app/clientesProveedores/component/clienteProveedoresModal.html',
    controller: 'ModalCPController',
    bindings: {
      close: '&',
      loader: '='
    }
  });
});
