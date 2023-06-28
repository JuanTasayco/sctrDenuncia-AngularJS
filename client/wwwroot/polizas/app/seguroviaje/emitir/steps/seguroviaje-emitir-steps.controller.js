'use strict';

define(['angular'], function(ng) {
	SeguroviajeEmitirStepsController.$inject = [
		'$scope',
		'$rootScope'
	];
	function SeguroviajeEmitirStepsController($scope, $rootScope) {
		var vm = this;

		var cleanup = $scope.$on('$stateChangeSuccess', function (s, state, param, d) {
			vm.currentStep = param.step;
		});
		$scope.$on('$destroy', function() {
		   cleanup();
		})

		vm._steping = function (step){
			var e = { cancel : false, step: step }
			$scope.$broadcast('changingStep', e);
			return !e.cancel;
		}
	};

	return ng.module('appSeguroviaje')
		.controller('SeguroviajeEmitirStepsController', SeguroviajeEmitirStepsController)
});
