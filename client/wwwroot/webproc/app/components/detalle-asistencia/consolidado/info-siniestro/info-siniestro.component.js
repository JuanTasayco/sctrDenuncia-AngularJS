'use strict';

define(['angular'], function(ng) {
  InfoSiniestroController.$inject = [];
  function InfoSiniestroController() {}

  return ng
    .module('appWp')
    .controller('InfoSiniestroController', InfoSiniestroController)
    .component('wpInfoSiniestro', {
      templateUrl: '/webproc/app/components/detalle-asistencia/consolidado/info-siniestro/info-siniestro.html',
      controller: 'InfoSiniestroController',
      bindings: {
        info: '=?'
      }
    });
});
