'use strict';

define([
	'angular',
	'lodash',
	'coreConstants',
	'cemeteryConstants',
	'cemeteryUtils'
], function (ng, _, coreConstants, cemeteryConstants, cemeteryUtils) {

	ParameterSubspaceComponent.$inject = ['$state', '$stateParams', '$q', '$uibModal', '$window', '$log', 'mModalAlert', '$scope', 'CemeteryFactory'];

	function ParameterSubspaceComponent($state, $stateParams, $q, $uibModal, $window, $log, mModalAlert, $scope, CemeteryFactory) {

		//environments
		var vm = this;
		vm.form = {};
		vm.section = {};
		vm.tabs = [{ name: "General", active: false, href: "parameterGeneral" }, { name: "Configuración de espacios", active: true, href: "parameterSpace" }]

		//methods
		vm.$onInit = onInit;
		vm.newParameter = newParameter;
		vm.getParametersAfterSave = getParametersAfterSave;
		vm.getNewParameter = getNewParameter;
		vm.getFormat = getFormat;
		vm.handleUploadImage = handleUploadImage;
		vm.uploadGallery = uploadGallery;
		vm.updateAndSaveParameters = updateAndSaveParameters;

		//events
		function onInit() {
			_setScrollTop();
			_initValues();
			_setData();
		}

		//init
		function _initValues() {
			vm.formatCodes = [cemeteryConstants.FORMAT.SPACE, cemeteryConstants.FORMAT.LEVELS, cemeteryConstants.FORMAT.CAPABILITIES, cemeteryConstants.FORMAT.PLATFORM, cemeteryConstants.FORMAT.GALLERY];
			vm.formats = [];
			vm.format = {};
			vm.parameters = [];
			vm.section = {};
			vm.subspaces = [];
			vm.platforms = [];
			vm.capabilities = [];
			vm.levels = [];
			vm.galleries = [];
		}

		//scroll
		function _setScrollTop() {
			$window.scroll(0, 0);
		}

		//upload
		function handleUploadImage(event, parameter) {
			CemeteryFactory.UploadImage(event.photoToUpload).then(function (res) {
				var photo = { rutaTemporal: res.rutaTemporal, nombre: event.photoData.name, srcImg: event.photoData.photoBase64 };
				parameter.srcImg = photo.srcImg;
				parameter.valor6 = photo.rutaTemporal;
			});
		}

		function uploadGallery(event) {
			return CemeteryFactory.UploadImage(event.photoToUpload);
		}

		//set
		function _setData() {
			var defered = $q.defer();
			var promise = defered.promise;
			try {
				_getListSync().then(function (res) {
					_setDataForm().then(function (res) {
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

		//methods promises
		function _getParameters() {
			var defered = $q.defer();
			var promise = defered.promise;
			CemeteryFactory.GetParameters(
				cemeteryConstants.PARAMETER.SUBDOMAIN.GENERAL + ',' +
				cemeteryConstants.PARAMETER.SUBDOMAIN.SECTION + ',' +
				cemeteryConstants.PARAMETER.SUBDOMAIN.SEPULTURE + ',' +
				cemeteryConstants.PARAMETER.SUBDOMAIN.CREMATION).then(function (res) {
					vm.parameters = _.sortBy(res.data, function (data) { return data.idParametro; });
					defered.resolve();
				}).catch(function (error) {
					defered.reject(error);
					$state.go('errorCemetery', {}, { reload: true, inherit: false });
				});
			return promise;
		}

		function _getListSync() {
			var defered = $q.defer();
			var promise = defered.promise;
			try {
				CemeteryFactory.LoginApiGateway().then(function (res) {
					_getParameters().then(function (res) {
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

		function _saveParameters() {
			var defered = $q.defer();
			var promise = defered.promise;
			var parameters = _getNewParameters();
			CemeteryFactory.SaveParameters({ parametros: parameters }).then(function (res) {
				defered.resolve();
			}).catch(function (error) {
				defered.reject(error);
				mModalAlert.showError(error.data.mensaje, 'Error');
			});
			return promise;
		}

		function _updateParameters() {
			var defered = $q.defer();
			var promise = defered.promise;
			var modifiedParameters = _getModifiedParameters();
			CemeteryFactory.UpdateParameters({ parametros: modifiedParameters }).then(function (res) {
				defered.resolve();
			}).catch(function (error) {
				defered.reject(error);
				mModalAlert.showError(error.data.mensaje, 'Error');
			});
			return promise;
		}

		//set
		function _setDataForm() {
			var defered = $q.defer();
			var promise = defered.promise;
			vm.section = _.find(_.filter(_.filter(vm.parameters, { subDominio: cemeteryConstants.PARAMETER.SUBDOMAIN.SECTION }), { nombre: cemeteryConstants.PARAMETER.NAME.SPACE }), { idParametro: parseInt($stateParams.spaceId) });
			vm.subspaces = _.filter(_.filter(vm.parameters, { subDominio: vm.section.valor1 }), { nombre: cemeteryConstants.PARAMETER.NAME.SUBSPACE });
			vm.platforms = _.filter(_.filter(vm.parameters, { nombre: cemeteryConstants.PARAMETER.NAME.PLATFORM }), { subDominio: vm.section.valor1 });
			vm.capabilities = _.filter(_.filter(vm.parameters, { nombre: cemeteryConstants.PARAMETER.NAME.CAPACITY }), { subDominio: vm.section.valor1 });
			vm.levels = _.filter(_.filter(vm.parameters, { nombre: cemeteryConstants.PARAMETER.NAME.LEVEL }), { subDominio: vm.section.valor1 });
			vm.galleries = _.filter(_.filter(vm.parameters, { nombre: cemeteryConstants.PARAMETER.NAME.GALLERY }), { subDominio: vm.section.valor1 });
			vm.formats = _.filter(vm.parameters, function (parameter) { if (_.contains(vm.formatCodes, parameter.nombre)) return parameter; });
			vm.format.subspace = _.find(vm.formats, { nombre: cemeteryConstants.FORMAT.SPACE });
			vm.format.platform = _.find(vm.formats, { nombre: cemeteryConstants.FORMAT.PLATFORM });
			vm.format.capacity = _.find(vm.formats, { nombre: cemeteryConstants.FORMAT.CAPABILITIES });
			vm.format.level = _.find(vm.formats, { nombre: cemeteryConstants.FORMAT.LEVELS });
			vm.format.gallery = _.find(vm.formats, { nombre: cemeteryConstants.FORMAT.GALLERY });
			vm.galleries = _buildGalleries();
			_.forEach(vm.subspaces, function (subspace) {
				subspace.srcImg = cemeteryUtils.concatenateWithTime(subspace.valor2);
			});
			_.forEach(vm.platforms, function (plataform) {
				plataform.srcImg = cemeteryUtils.concatenateWithTime(plataform.valor2);
			});
			_.forEach(vm.capabilities, function (capacity) {
				capacity.srcImg = cemeteryUtils.concatenateWithTime(capacity.valor2);
			});
			_.forEach(vm.levels, function (level) {
				level.srcImg = cemeteryUtils.concatenateWithTime(level.valor2);
			});
			defered.resolve();
			return promise;
		}

		//methods business
		function newParameter(label, parameterName) {
			_openPopupParameter(label, parameterName);
		}

		function getParametersAfterSave() {
			_setData();
		}

		function _getModifiedParameters() {
			var modifiedParameters = [];
			_.forEach(vm.subspaces, function (subspace) {
				subspace.valor5 = subspace.valor6 ? '1' : '0';
				modifiedParameters.push(subspace);
			});

			_.forEach(vm.platforms, function (plataform) {
				plataform.valor5 = plataform.valor6 ? '1' : '0';
				modifiedParameters.push(plataform);
			});

			_.forEach(vm.capabilities, function (capacity) {
				capacity.valor5 = capacity.valor6 ? '1' : '0';
				modifiedParameters.push(capacity);
			});

			_.forEach(vm.levels, function (level) {
				level.valor5 = level.valor6 ? '1' : '0';
				modifiedParameters.push(level);
			});

			var galleries = _getModifiedGalleries();

			_.forEach(galleries, function (gallery) {
				modifiedParameters.push(gallery);
			});

			_.forEach(modifiedParameters, function (parameter) {
				delete parameter.srcImg;
			});

			return modifiedParameters;
		}

		function _getNewParameters() {
			var parameters = _getNewGalleries();
			return parameters;
		}

		function getNewParameter(parameterName) {
			var parameter = {};
			if (parameterName === cemeteryConstants.PARAMETER.NAME.SUBSPACE) {
				parameter.descripcion = 'Sub-espacio de camposanto';
				parameter.nombre = cemeteryConstants.PARAMETER.NAME.SUBSPACE;
			} else if (parameterName === cemeteryConstants.PARAMETER.NAME.PLATFORM) {
				parameter.descripcion = 'Plataforma de camposanto';
				parameter.nombre = cemeteryConstants.PARAMETER.NAME.PLATFORM;
			} else if (parameterName === cemeteryConstants.PARAMETER.NAME.CAPACITY) {
				parameter.descripcion = 'Capacidad de un subespacio';
				parameter.nombre = cemeteryConstants.PARAMETER.NAME.CAPACITY;
			} else if (parameterName === cemeteryConstants.PARAMETER.NAME.LEVEL) {
				parameter.descripcion = 'Nivel de un subespacio';
				parameter.nombre = cemeteryConstants.PARAMETER.NAME.LEVEL;
			}
			parameter.subDominio = vm.section.valor1;
			parameter.valor1 = "";
			parameter.valor2 = "";
			parameter.valor3 = "";
			parameter.valor4 = "";
			parameter.valor5 = "1";
			parameter.valor6 = "";

			return parameter;

		}

		function getFormat(parameterName) {
			var format = {};
			if (parameterName === cemeteryConstants.PARAMETER.NAME.SUBSPACE) {
				format = vm.format.subspace;
			} else if (parameterName === cemeteryConstants.PARAMETER.NAME.PLATFORM) {
				format = vm.format.platform;
			} else if (parameterName === cemeteryConstants.PARAMETER.NAME.CAPACITY) {
				format = vm.format.capacity;
			} else if (parameterName === cemeteryConstants.PARAMETER.NAME.LEVEL) {
				format = vm.format.level;
			}

			return format;
		}

		function _buildGalleries() {
			_.forEach(vm.galleries, function (gallery) {
				gallery.srcImg = cemeteryUtils.concatenateWithTime(gallery.valor2);
				gallery.valor6 = "";
			});
			var positionsGallery = _.map(vm.galleries, function (item) {
				return item.valor4;
			})
			var count = vm.galleries.length;
			if (count < cemeteryConstants.MAX_LENGTH_PARAMETER_GALLERY) {
				for (var index = 1; index <= cemeteryConstants.MAX_LENGTH_PARAMETER_GALLERY; index++) {
					if (!_.contains(positionsGallery, 'CREM_IMG_' + index)) {
						vm.galleries.push({
							idParametro: 0,
							subDominio: cemeteryConstants.PARAMETER.SUBDOMAIN.CREMATION,
							descripcion: 'Galeria de imagenes para cremacion',
							nombre: cemeteryConstants.PARAMETER.NAME.GALLERY,
							valor1: 'IMAGEN_' + index,
							valor2: '',
							valor4: 'CREM_IMG_' + index,
							valor5: '0',
							valor6: '',
							srcImg: ''
						});
					}
				}
			}
			return vm.galleries;
		}

		function _getModifiedGalleries() {
			var modifiedGalleries = _.filter(vm.galleries, function (gallery) {
				if (gallery.idParametro > 0 && gallery.valor6 != '') {
					gallery.valor2 = '';
					gallery.valor5 = '1';
					return gallery;
				}
			});

			_.forEach(modifiedGalleries, function (gallery) {
				delete gallery.srcImg;
				delete gallery.rutaImagen;
			});

			return modifiedGalleries
		}

		function _getNewGalleries() {
			var newGalleries = _.filter(vm.galleries, function (gallery) {
				if (gallery.idParametro === 0 && gallery.valor6 != '') {
					gallery.valor5 = '1';
					return gallery;
				}
			});

			_.forEach(newGalleries, function (gallery) {
				delete gallery.srcImg;
				delete gallery.rutaImagen;
			});

			return newGalleries;
		}

		function updateAndSaveParameters() {
			CemeteryFactory.LoginApiGateway().then(function (res) {
				_updateParameters().then(function (res) {
					if (_getNewParameters().length > 0) {
						_saveParameters().then(function (res) {
							_setData();
							mModalAlert.showSuccess("", "Cambios realizados");
						});
					} else {
						_setData();
						mModalAlert.showSuccess("", "Cambios realizados");
					}
				});
			});
		}

		function _openPopupParameter(label, parameterName) {
			$scope.label = label;
			$scope.format = vm.getFormat(parameterName);
			$scope.parameter = vm.getNewParameter(parameterName);
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
						vm.getParametersAfterSave();
					};

					$scope.handleUploadImage = function (event) {
						return CemeteryFactory.UploadImage(event.photoToUpload);
					}
				}]
			});
		}

	}

	return ng.module(coreConstants.ngMainModule).controller('ParameterSubspaceComponent', ParameterSubspaceComponent);
});
