define([
  'angular'
], function (angular) {
  'use strict';

  angular
    .module('appAutos')
    .component('mpfNoSearchDigitalBusiness', {
      template:
        '<div class="row" ng-if="!$ctrl.hide">'
        + '<div class="col-md-12 text-center g-box-noresult">'
        + '<div class="row">'
        + '<div class="col-md-12 g-box-noresult-ico gCBlue2">'
        + '<span class="ico-mapfre_303_informacion"></span>'
        + '</div>'
        + '<div class="col-md-12 g-box-noresult-text">'
        + 'Realiza una búsqueda para obtener resultados.'
        + '</div>'
        + '</div>'
        + '</div>'
        + '</div>',
      bindings: {
        hide: '=?'
      }
    });

    angular
    .module('appAutos')
    .component('mpfNoResultDigitalBusiness', {
      template:
        '<div class="row" ng-if="!$ctrl.hide">'
        + '<div class="col-md-12 text-center g-box-noresult">'
        + '<div class="row">'
        + '<div class="col-md-12 g-box-noresult-ico gCRed1">'
        + '<span class="ico-mapfre_302_error"></span>'
        + '</div>'
        + '<div class="col-md-12 g-box-noresult-text">'
        + 'No hay resultados para los filtros escogidos.<br>Intenta denuevo.'
        + '</div>'
        + '</div>'
        + '</div>'
        + '</div>',
      bindings: {
        hide: '=?'
      }
    });

});
