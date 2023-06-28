'use strict';

define([
	'angular', 'constants'
], function(angular, constants){

	var appControls = angular.module('mapfre.controls');

	appControls.controller('ctrlModalConfirmation', ['$scope', '$window', '$state', '$timeout', function($scope, $window, $state, $timeout){

		var _self = this;
		_self.data.save = false;

		// console.log(_self.data);
		if (!_self.data.titulo) {
			_self.data.titulo = "guardar la cotización";
		}

		if (!_self.data.saveButton) {
			_self.data.saveButton = "Guardar";
		}

		if (!_self.data.cancelButton) {
			_self.data.cancelButton = "Seguir editando cotización";
		}


		_self.save = function(){
			_self.data.save = true;
			_self.close();
		}
		
	}]).component('mpfModalConfirmation',{
		templateUrl: '/scripts/mpf-main-controls/components/modalConfirmation/component/modalConfirmation.html',
		controller: 'ctrlModalConfirmation',
		bindings: {		
			data: '=',
			close: '&'
		}
	})


});
