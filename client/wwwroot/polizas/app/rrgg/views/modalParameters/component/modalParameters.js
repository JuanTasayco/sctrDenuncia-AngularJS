'use strict';

define([
	'angular', 'constants'
], function(angular, constants){

	var appControls = angular.module('mapfre.controls');

	appControls.controller('ctrlModalParameters', ['$scope', '$window', '$state', '$timeout', function($scope, $window, $state, $timeout){

		var _self = this;
		_self.data.save = false;
		_self.data.reject = 1;

		// console.log(_self.data);
		_self.save = function(){
			_self.data.save = true;
			_self.data.reject = 2;
			_self.close();
		}
		
	}]).component('mpfModalParameters',{
		templateUrl: '/scripts/mpf-main-controls/components/modalParameters/component/modalParameters.html',
		controller: 'ctrlModalParameters',
		bindings: {		
			data: '=',
			close: '&'
		}
	})


});
