'use strict';

define([
	'angular',
	'lodash',
	'coreConstants'
], function (ng, _, coreConstants) {

	CemeteryComponent.$inject = ['$state', '$q', '$log', '$uibModal', 'mModalAlert', '$scope', 'CemeteryFactory'];

	function CemeteryComponent($state, $q, $log, $uibModal, mModalAlert, $scope, CemeteryFactory) {

		//environments
		var vm = this;

		//methods
		vm.$onInit = onInit;
		vm.newCemetery = newCemetery;
		vm.updateCemetery = updateCemetery;
		vm.getCemeteries = getCemeteries;

		//events
		function onInit() {
			_initValues();
			_setData();
		}

		//init
		function _initValues() {
			vm.cemeteries = [];
		}

		//set
		function _setData() {
			var defered = $q.defer();
			var promise = defered.promise;
			try {
				CemeteryFactory.LoginApiGateway().then(function (res) {
					getCemeteries().then(function (res) {
						defered.resolve();
					});
				});
			} catch (e) {
				$log.log('Error', e);
				defered.reject(e);
				$state.go('errorCemetery', {}, { reload: true, inherit: false });
			}
			return promise;
		}

		//methods business
		function newCemetery() {
			_openPopupCemetery();
		}

		function getCemeteries() {
			var defered = $q.defer();
			var promise = defered.promise;
			CemeteryFactory.GetCemeteries().then(function (res) {
				vm.cemeteries = _.sortBy(res.data, function (data) { return data.idCamposanto; });
				defered.resolve();
			}).catch(function (error) {
				defered.reject(error);
				$state.go('errorCemetery', {}, { reload: true, inherit: false });
			});
			return promise;
		}

		function updateCemetery(cemetery) {
			cemetery.rutaImagenCarrusel = "";
			cemetery.rutaImagenBanner = "";
			CemeteryFactory.LoginApiGateway().then(function (res) {
				CemeteryFactory.UpdateCemetery(cemetery).then(function (res) {
					getCemeteries();
				}).catch(function (error) {
					mModalAlert.showError(error.data.mensaje, 'Error');
					getCemeteries();
				});
			});
		}

		function _openPopupCemetery() {
			$uibModal.open({
				backdrop: true,
				backdropClick: true,
				dialogFade: false,
				keyboard: true,
				scope: $scope,
				size: 'md',
				template: '<popup-cemetery  close="closeModal()" dismiss="closeModal()" success="successModal()"></popup-cemetery>',
				controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
					$scope.closeModal = function () {
						$uibModalInstance.close();
					};

					$scope.successModal = function () {
						$uibModalInstance.close();
						vm.getCemeteries();
					};
				}]
			});
		}

	}

	return ng.module(coreConstants.ngMainModule).controller('CemeteryComponent', CemeteryComponent);
});
