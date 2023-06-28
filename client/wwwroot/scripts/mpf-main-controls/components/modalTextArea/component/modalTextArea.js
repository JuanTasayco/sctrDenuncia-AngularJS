'use strict';

define([
	'angular', 'constants'
], function(angular, constants){

	var appControls = angular.module('mapfre.controls');

	appControls.controller('ctrlModalTextArea', ['$scope', '$window', '$state', 'mpSpin', function($scope, $window, $state, mpSpin){
		var _self = this;

	}]).component('mpfModalTextArea',{
		templateUrl: '/scripts/mpf-main-controls/components/modalTextArea/component/modalTextArea.html',
		controller: 'ctrlModalTextArea',
		bindings: {
			data: '=',
			close: '&'
		}
	})


});
