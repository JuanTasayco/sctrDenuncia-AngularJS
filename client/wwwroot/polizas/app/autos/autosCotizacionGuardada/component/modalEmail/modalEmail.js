'use strict';

define([
	'angular', 'constants'
], function(angular, constants){

	var appAutos = angular.module('appAutos');

	appAutos.controller('ctrlModalEmail', ['$scope', '$window', '$state', function($scope, $window, $state){

		var _self = this;

		
	}]).component('mpfModalEmail',{
		templateUrl: '/polizas/app/autos/autosCotizacionGuardada/component/modalEmail/modalEmail.html',
		controller: 'ctrlModalEmail',
		bindings: {
			data: '='
		}
	})


});
