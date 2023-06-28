'use strict';

define(['angular'], function(ng) {
  return ng
    .module('appInspec')
    .controller('EmptyDataController', function() {})
    .component('inspecEmptyData', {
      templateUrl: '/inspec/app/_app/common/empty-data/empty-data.html',
      controller: 'EmptyDataController',
      controllerAs: '$ctrl',
      bindings: {
        length: '=',
        firstQueryCompleted: '='
      }
    });
});
