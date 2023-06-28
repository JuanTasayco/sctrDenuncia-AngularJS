'use strict'
define([
  'angular', 'constants', 'lodash'
], function(angular, constants, _){

  var appCgw = angular.module('appGcw');

  appCgw.factory('gcwServicePoliza', ['proxyGeneral', '$window', '$http', '$q',
    function(proxyGeneral, $window, $http, $q){

    	function getListCompanias(){
    		return proxyGeneral.GetListCompania(false);
    	}

    	return {
    		getListCompanias: getListCompanias
    	};

  }]);
});
