'use strict';

define(['angular', 'reConstants', 'lodash'], function(ng, reConstants, _) {
  HomeController.$inject = ['oimClaims', '$window', 'reFactory', '$log'];
  function HomeController(oimClaims, $window, reFactory, $log) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      vm.availableModules = _getCurrentUserPermissions();
      _setLookUpsInStorage();
    }

    function _getCurrentUserPermissions() {
      var reemApp = oimClaims.rolesCode
        ? _.find(oimClaims.rolesCode, function(rol) { return rol.nombreAplicacion === 'REEM'; })
        : null;
        
      var user = _.find(reConstants.userPermissions, function(permission) {
        return (permission && permission.code ) === (reemApp ? reemApp.codigoRol : null);
      });
      ;
      return user ? user.availableModuleCodes : [];
    }

    function _setLookUpsInStorage() {
      reFactory.solicitud
        .GetLookUpList()
        .then(function (res) {
          $window.sessionStorage['lookups'] = res.isValid ? ng.toJson(res.data) : [];
        })
        .catch(function (err) {
          $log.error(err);
        });

      reFactory.solicitud
        .MediaExtensions()
        .then(function (res) {
          $window.sessionStorage['mediaExtensions'] = res.isValid ? ng.toJson(res.data) : [];
        })
        .catch(function (err) {
          $log.error(err);
        });
    }
  }

  return ng
    .module('appReembolso')
    .controller('HomeController', HomeController)
    .component('reHome', {
      templateUrl: '/reembolso/app/components/home/home.html',
      controller: 'HomeController',
      bindings: {}
    })
});
