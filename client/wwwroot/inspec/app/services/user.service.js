'use strict';

define(['angular', 'lodash'], function(ng, _) {
  UserService.$inject = ['$state'];

  function UserService($state) {
    var user = {};
    user.setAuthorizedResource = setAuthorizedResource;
    user.processMenu = processMenu;
    user.isAPermittedObject = isAPermittedObject;
    user.setInspecRole = setInspecRole;

    function setInspecRole() {
      if (user.role === 'ADMIN') {
        user.isAdmin = true;
      }
      if (user.role === 'COORDINADOR') {
        user.isCoordinador = true;
      }
      if (user.role === 'INSPECTOR') {
        user.isInspector = true;
      }
      if (user.role === 'GESTOR-OIM') {
        user.isGestor = true;
      }
      if (user.role === 'EAC INSP') {
        user.isEacInspector = true;
      }
      if (user.role === 'EAC') {
        user.isEac = true;
      }
      if (user.role === 'DIRECTOR') {
        user.isDirector = true;
      }
      if (user.role === 'BROKER') {
        user.isBroker = true;
      }
    }
    setInspecRole();

    if (ng.equals(user, {})) {
      $state.go('accessdenied');
    }

    function setAuthorizedResource(response) {
      user.permittedObjects = mapResult(response);
    }

    function mapResult(response) {
      var mapped = [];
      var notViews = ['INSPECCIONES', 'ACCIONES'];
      response.accessSubMenu.forEach(function(element) {
        if (!_.include(notViews, element.nombreCabecera)) {
          mapped.push(element.nombreCabecera);
        }
        element.items.forEach(function(i) {
          mapped.push(i.nombreCorto);
        });
      });

      return mapped;
    }

    function processMenu(menus) {
      var aux = [];
      menus.forEach(function(aMenu) {
        if (aMenu.hasOwnProperty('objMXKey')) {
          aMenu.show = isAPermittedObject(aMenu.objMXKey);
        }
        if (aMenu.hasOwnProperty('menu')) {
          aMenu.menu.forEach(function(m) {
            if (m.hasOwnProperty('objMXKey')) {
              m.show = isAPermittedObject(m.objMXKey);
            }
          });
        }
        aux.push(aMenu);
      });
      return aux;
    }

    function isAPermittedObject(obj) {
      var array = obj.split('|');

      return _.some(user.permittedObjects, function(el) {
        return _.include(array, el);
      });

    }

    return user;
  }
  ng.module('AuthInspec', []).factory('UserService', UserService);
});
