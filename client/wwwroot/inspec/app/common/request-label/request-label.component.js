'use strict';

define(['angular'], function(ng) {
  return ng
    .module('appInspec')
    .controller('RequestLabelController', function() {})
    .component('inspecRequestLabel', {
      templateUrl: '/inspec/app/common/request-label/request-label.html',
      controller: 'RequestLabelController',
      controllerAs: '$ctrl',
      bindings: {
        requestId: '=',
        requestText: '=',
        marginTop: '=?'
      }
    });
});
