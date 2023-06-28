'use strict';

define([
	'angular',
	'system',
	'coreConstants',
	'cemeteryConstants'
], function (ng, system, coreConstants, cemeteryConstants) {

	var folder = system.apps.ap.location;

	AdditionalServiceCemeteryComponent.$inject = ['$state', '$uibModal', '$scope', 'CemeteryFactory'];

	function AdditionalServiceCemeteryComponent($state, $uibModal, $scope, CemeteryFactory) {

		//environments
		var vm = this;

		// methods
		vm.$onInit = onInit;
		vm.newParameter = newParameter;
		vm.getParameters = getParameters;
		vm.getNewParameter = getNewParameter;
		vm.handleUpload

		//events
		function onInit() {
			_initValues();
		}

		//init
		function _initValues() {
			vm.parameters = [];
		}

		//methods promises
		function getParameters() {
			CemeteryFactory.LoginApiGateway().then(function (res) {
				CemeteryFactory.GetParameters(cemeteryConstants.PARAMETER.SUBDOMAIN.GENERAL).then(function (res) {
					vm.parameters = _.sortBy(res.data, function (data) { return data.idParametro; });
					vm.services = _.filter(vm.parameters, { nombre: cemeteryConstants.PARAMETER.NAME.ADDITIONAL_SERVICE });
				}).catch(function (error) {
					$state.go('errorCemetery', {}, { reload: true, inherit: false });
				});
			});
		}

		//methods business
		function newParameter() {
			_openPopupParameter();
		}

		function getNewParameter() {
			var parameter = {}
			parameter.descripcion = "Servicio que se ofrece en los camposantos";
			parameter.nombre = cemeteryConstants.PARAMETER.NAME.ADDITIONAL_SERVICE;
			parameter.subDominio = cemeteryConstants.PARAMETER.SUBDOMAIN.GENERAL;
			parameter.valor1 = "";
			parameter.valor2 = "";
			parameter.valor3 = "";
			parameter.valor4 = "";
			parameter.valor5 = "1";
			parameter.valor6 = "";

			return parameter;
		}

		function _openPopupParameter() {
			$scope.format = vm.format;
			$scope.label = 'Nombre';
			$scope.parameter = vm.getNewParameter();
			$uibModal.open({
				backdrop: true,
				backdropClick: true,
				dialogFade: false,
				keyboard: true,
				scope: $scope,
				size: 'md',
				template: '<popup-parameter format="format" label="label" parameter="parameter" close="closeModal()" dismiss="closeModal()" success="successModal()" upload="handleUploadImage($event)"></popup-parameter>',
				controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
					$scope.closeModal = function () {
						$uibModalInstance.close();
					};

					$scope.successModal = function () {
						$uibModalInstance.close();
						vm.getParameters();
					};

					$scope.handleUploadImage = function (event) {
						return CemeteryFactory.UploadImage(event.photoToUpload);
					}
				}]
			});
		}

	}

	return ng
		.module(coreConstants.ngMainModule)
		.controller('AdditionalServiceCemeteryComponent', AdditionalServiceCemeteryComponent)
		.component('additionalServiceCemetery', {
			templateUrl: folder + '/app/cemetery/components/additional-service/additional-service-cemetery.component.html',
			controller: 'AdditionalServiceCemeteryComponent',
			bindings: {
				format: '=?',
				services: '=?',
				showSwitch: '=?',
				showButton: '=?',
			}
		});
});
