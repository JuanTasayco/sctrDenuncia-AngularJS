'use strict';

define([
	'angular',
    'lodash',
	'system',
	'coreConstants'
], function (ng, _, system, coreConstants) {

	var folder = system.apps.ap.location;

	TabCemeteryComponent.$inject = ['$state','$stateParams'];

	function TabCemeteryComponent($state, $stateParams) {

		//environments
		var vm = this;

		//methods
		vm.$onInit = onInit;
		vm.goTo = goTo;

		//events
		function onInit() {
			_initValues();
		}

		//init
		function _initValues() {
			vm.cemeteryId = $stateParams.cemeteryId;
		}

		function goTo(tab) {
			if(vm.cemeteryId){
				return $state.href(tab.href, { cemeteryId: vm.cemeteryId }, { reload: true, inherit: false });
			}else{
				return $state.href(tab.href, { }, { reload: true, inherit: false });
			}
		}

	}

	return ng
		.module(coreConstants.ngMainModule)
		.controller('TabCemeteryComponent', TabCemeteryComponent)
		.component('tabCemetery', {
			templateUrl: folder + '/app/cemetery/components/tab/tab-cemetery.component.html',
			controller: 'TabCemeteryComponent',
			bindings: {
				tabs: '=?',
			}
		});
});
