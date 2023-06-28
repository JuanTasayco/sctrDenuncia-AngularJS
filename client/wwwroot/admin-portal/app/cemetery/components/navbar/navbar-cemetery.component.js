'use strict';

define([
	'angular',
	'system',
	'coreConstants'
], function (ng, system, coreConstants) {

	var folder = system.apps.ap.location;

	function NavbarCemeteryComponent() {

		//environments
		var vm = this;

		//methods
		vm.$onInit = onInit;
		vm.update = update;

		//events
		function onInit() {
			_initValues();
		}

		//init
		function _initValues() {
		}

		function update() {
			vm.onUpdate();
		}

	}

	return ng
		.module(coreConstants.ngMainModule)
		.controller('NavbarCemeteryComponent', NavbarCemeteryComponent)
		.component('navbarCemetery', {
			templateUrl: folder + '/app/cemetery/components/navbar/navbar-cemetery.component.html',
			controller: 'NavbarCemeteryComponent',
			bindings: {
				active: '=?',
				showButton: '=?',
				onUpdate: '&?',
				isDisabled: '=?'
			}
		});
});
