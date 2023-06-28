'use strict'

define([
	'angular',
], function (angular) {

	var appNsctr = angular.module('appNsctr');

	appNsctr.factory('nsctrApplicationFactory',
		function () {

			var _self = this;
			_self.applications = [];
			_self.selectedApplications = [];

			var _getApplications = function () {
				return _self.applications;
			};

			var _setApplications = function (applications) {
				_self.applications = applications || [];
			};

			var _getSelectedApplications = function () {
				return _self.selectedApplications;
			};

			var _setSelectedApplications = function (selectedApplications) {
				_self.selectedApplications = selectedApplications || [];
			};

			return {
				getApplications: _getApplications,
				setApplications: _setApplications,
				getSelectedApplications: _getSelectedApplications,
				setSelectedApplications: _setSelectedApplications
			};

		});

});