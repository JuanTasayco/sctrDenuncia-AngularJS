'use strict';

define([
  'angular', 'constants'
], function(angular, constants){

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('nsctrContentTemplateController',
    ['$scope',
    function($scope){

  }]).component('nsctrContentTemplate',{
    templateUrl: '/nsctr/app/common/components/contentTemplate/contentTemplate.component.html',
    controller: 'nsctrContentTemplateController',
    bindings: {
      data: '=?'
    }
  });
});