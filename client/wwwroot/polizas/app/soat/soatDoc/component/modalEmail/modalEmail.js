'use strict';

define([
	'angular', 'constants'
], function(angular, constants){

	var appSoat = angular.module('appSoat');

	appSoat.controller('ctrlModalEmail', ['$scope', '$window', '$state', function($scope, $window, $state){

		var _self = this;

		
	}]).component('mpfModalEmail',{
		templateUrl: '/polizas/app/soat/soatDoc/component/modalEmail/modalEmail.html',
		controller: 'ctrlModalEmail',
		bindings: {
			data: '='
		}
	})


});
