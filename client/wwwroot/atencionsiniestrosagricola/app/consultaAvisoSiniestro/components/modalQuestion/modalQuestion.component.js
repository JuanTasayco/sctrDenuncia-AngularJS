define([
    'angular', 'constants'
], function (ng, constants){
    return ng.module('atencionsiniestrosagricola.app')
    .component('mfpModalQuestion', {
      templateUrl: '/atencionsiniestrosagricola/app/consultaAvisoSiniestro/components/modalQuestion/modalQuestion.html',
      bindings: {
        data: '=?',
        close: '&?'
      }
    })
    .directive('preventDefault', function() {
      return function(scope, element, attrs) {
          angular.element(element).bind('click', function(event) {
              event.preventDefault();
              event.stopPropagation();
          });
      }
    });
})