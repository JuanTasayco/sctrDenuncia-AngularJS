'use strict';
define(['angular'], function(ng) {

  return ng.module('referenciaApp')
    .component('mfloader', {
      templateUrl: '/referencia/app/panel/component/loader.html',
      bindings: {
        loader: '='
      }
    });
});
