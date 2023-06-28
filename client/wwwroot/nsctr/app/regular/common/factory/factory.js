'use strict'

define([
	'angular', 'constants',
	'nsctrServiceJs'
], function(angular, constants){

		var appNsctr = angular.module('appNsctr');

		/*########################
    # factory
    ########################*/
		appNsctr.factory('regularFactory',
			['$http', '$q', 'mainServices', 'httpData', 'mpSpin',
			function($http, $q, mainServices, httpData, mpSpin){
	    
			return{};

		}]);


});

