'use strict';

define([
	'angular',
	'lodash',
	'coreConstants',
	'cemeteryConstants',
	'cemeteryUtils'
], function (ng, _, coreConstants, cemeteryConstants, cemeteryUtils) {

	CemeteryInfoComponent.$inject = ['$state', '$stateParams', '$scope', '$q', '$sce', '$window','$log', 'mModalAlert', 'CemeteryFactory'];

	function CemeteryInfoComponent($state, $stateParams, $scope, $q, $sce, $window, $log, mModalAlert, CemeteryFactory) {

		//environments
		var vm = this;
		vm.form = {};
		vm.format = {};
		vm.urlMapa = "";
		vm.isValidUrlMapa;
		vm.showUrlMapError;
		vm.component = cemeteryConstants.COMPONENT.CEMETERY;
		vm.tabs = [{ name: "Información", active: true, href: "cemeteryInfo" }, { name: "Espacios", active: false, href: "cemeterySpace" }]

		//methods
		vm.$onInit = onInit;
		vm.changeUrlMap = changeUrlMap;
		vm.uploadBannerOne = uploadBannerOne;
		vm.uploadCarousel = uploadCarousel;
		vm.uploadGallery = uploadGallery;
		vm.updateCemeteryAndGallery = updateCemeteryAndGallery;

		//events
		function onInit() {
			_setScrollTop();
			_initValues();
			_setData();
		}

		//init
		function _initValues() {
			vm.cemeteryId = $stateParams.cemeteryId;
			vm.formatCodes = [cemeteryConstants.FORMAT.BANNERS, cemeteryConstants.FORMAT.CAROUSEL_IMAGE, cemeteryConstants.FORMAT.GALLERY, cemeteryConstants.FORMAT.ADDITIONAL_SERVICE];
			vm.formats = [];
			vm.cemetery = {};
			vm.parameters = [];
			vm.carousels = [];
			vm.galleries = [];
		}

		//scroll
		function _setScrollTop() {
			$window.scroll(0, 0);
		}

		//upload
		function uploadBannerOne(event) {
			return CemeteryFactory.UploadImage(event.photoToUpload);
		}

		function uploadCarousel(event) {
			return CemeteryFactory.UploadImage(event.photoToUpload);
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
			CemeteryFactory.GetParameters(cemeteryConstants.PARAMETER.SUBDOMAIN.GENERAL).then(function (res) {
				vm.parameters = _.sortBy(res.data, function (data) { return data.idParametro; });
				defered.resolve();
			}).catch(function (error) {
				defered.reject(error);
				$state.go('errorCemetery', {}, { reload: true, inherit: false });
			});
			return promise;
		}

		function _getGalleries() {
			var defered = $q.defer();
			var promise = defered.promise;
			CemeteryFactory.GetGalleries(vm.cemeteryId, cemeteryConstants.GALLERY_TYPE.CEMETERY).then(function (res) {
				vm.galleries = res.data;
				defered.resolve();
			}).catch(function (error) {
				defered.reject(error);
				$state.go('errorCemetery', {}, { reload: true, inherit: false });
			});
			return promise;
		}

		function _updateGallerries() {
			var defered = $q.defer();
			var promise = defered.promise;
			var modifiedGalleries = _getModifiedGalleries();
			CemeteryFactory.UpdateGalleries(vm.cemeteryId, { imagenes: modifiedGalleries }, cemeteryConstants.GALLERY_TYPE.CEMETERY).then(function (res) {
				defered.resolve();
			}).catch(function (error) {
				defered.reject(error);
				mModalAlert.showError(error.data.mensaje, 'Error');
			});
			return promise;
		}

		function _saveGallerries() {
			var defered = $q.defer();
			var promise = defered.promise;
			var newGalleries = _getNewGalleries();
			CemeteryFactory.SaveGalleries(vm.cemeteryId, { imagenes: newGalleries }, cemeteryConstants.GALLERY_TYPE.CEMETERY).then(function (res) {
				defered.resolve();
			}).catch(function (error) {
				defered.reject(error);
				mModalAlert.showError(error.data.mensaje, 'Error');
			});
			return promise;
		}

		function _getCemetery() {
			var defered = $q.defer();
			var promise = defered.promise;
			CemeteryFactory.GetCemetery(vm.cemeteryId).then(function (res) {
				vm.cemetery = res.data;
				defered.resolve();
			}).catch(function (error) {
				defered.reject(error);
				$state.go('errorCemetery', {}, { reload: true, inherit: false });
			});
			return promise;
		}

		function _updateCemetery() {
			var defered = $q.defer();
			var promise = defered.promise;
			var cemetery = _getModifiedCemetery();
			CemeteryFactory.UpdateCemetery(cemetery).then(function (res) {
				defered.resolve();
			}).catch(function (error) {
				defered.reject(error);
				mModalAlert.showError(error.data.mensaje, 'Error');
			});
			return promise;
		}

		function _getListSync() {
			var defered = $q.defer();
			var promise = defered.promise;
			try {
				CemeteryFactory.LoginApiGateway().then(function (res) {
					_getParameters().then(function (res) {
						_getGalleries().then(function (res) {
							_getCemetery().then(function (res) {
								defered.resolve();
							});
						});
					});
				});
			} catch (e) {
				$log.log('Error', e);
				defered.reject(e);
				$state.go('errorCemetery', {}, { reload: true, inherit: false });
			}
			return promise;
		}

		//validate
		function _validationForm() {
			if (!vm.form.descripcionCamposanto) {
				mModalAlert.showWarning("Ingrese Descripción Camposantos", 'Advertencia');
				return false;
			}

			if (!vm.form.seccionServicio) {
				mModalAlert.showWarning("Ingrese Sección servicios", 'Advertencia');
				return false;
			}

			if (!vm.form.descripcion) {
				mModalAlert.showWarning("Ingrese descripción", 'Advertencia');
				return false;
			}

			if (!vm.form.informacionAdicional) {
				mModalAlert.showWarning("Ingrese Información adicional", 'Advertencia');
				return false;
			}

			if (!vm.form.urlMapa) {
				mModalAlert.showWarning("Ingrese Mapa", 'Advertencia');
				return false;
			}

			return true;
		}

		//set form
		function _setDataForm() {
			var defered = $q.defer();
			var promise = defered.promise;
			// match cemetery 
			vm.form.idCamposanto = vm.cemetery.idCamposanto;
			vm.form.nombre = vm.cemetery.nombre;
			vm.form.rutaImagenBanner = "";
			vm.form.rutaImagenCarrusel = "";
			vm.form.srcImgBannerOne = cemeteryUtils.concatenateWithTime(vm.cemetery.rutaImagenBanner);
			vm.form.srcImgCarousel = cemeteryUtils.concatenateWithTime(vm.cemetery.rutaImagenCarrusel);
			vm.form.urlTourInteractivo = vm.cemetery.urlTourInteractivo;
			vm.form.descripcionCamposanto = vm.cemetery.descripcionCamposanto;
			vm.form.seccionServicio = vm.cemetery.seccionServicio;
			vm.form.descripcion = vm.cemetery.descripcion;
			vm.form.informacionAdicional = cemeteryUtils.transformHtml(vm.cemetery.informacionAdicional);
			vm.form.codEspaciosActivos = vm.cemetery.codEspaciosActivos;
			vm.form.estadoVisualizacion = vm.cemetery.estadoVisualizacion;
			vm.form.urlMapa = vm.cemetery.urlMapa;
			vm.urlMapa = $sce.trustAsResourceUrl(vm.cemetery.urlMapa);
			vm.form.galleries = _buildGalleries();
			vm.carousels = _.filter(vm.parameters, { nombre: cemeteryConstants.PARAMETER.NAME.CAROUSEL_SERVICE });
			vm.form.carousels = _buildCarousels();
			vm.form.services = _.filter(vm.parameters, { nombre: cemeteryConstants.PARAMETER.NAME.ADDITIONAL_SERVICE });
			vm.formats = _.filter(vm.parameters, function (parameter) { if (_.contains(vm.formatCodes, parameter.nombre)) return parameter; });
			vm.format.banner = _.find(vm.formats, { nombre: cemeteryConstants.FORMAT.BANNERS });
			vm.format.carouselImage = _.find(vm.formats, { nombre: cemeteryConstants.FORMAT.CAROUSEL_IMAGE });
			vm.format.gallery = _.find(vm.formats, { nombre: cemeteryConstants.FORMAT.GALLERY });
			vm.format.aditionalService = _.find(vm.formats, { nombre: cemeteryConstants.FORMAT.ADDITIONAL_SERVICE });
			//match additional services
			var activeServices = vm.cemetery.codServiciosAdicionales.split('|');
			_.forEach(vm.form.services, function (service) {
				service.activo = _.contains(activeServices, service.valor4) ? '1' : '0';
			});
			//match services carousel
			var activeCarousels = vm.cemetery.codServicios.split('|');
			_.forEach(vm.form.carousels, function (carousel) {
				carousel.activo = _.contains(activeCarousels, carousel.valor4) ? '1' : '0';
			});
			changeUrlMap();

			defered.resolve();
			return promise;
		}

		//methods business
		function _buildGalleries() {
			_.forEach(vm.galleries, function (gallery) {
				gallery.srcImg = cemeteryUtils.concatenateWithTime(gallery.rutaImagen);
				gallery.rutaImagen = "";
			});
			var positionsGallery = _.map(vm.galleries, function (item) {
				return item.posicionGaleria;
			})
			var count = vm.galleries.length;
			if (count < cemeteryConstants.MAX_LENGTH_CEMETERY_GALLERY) {
				for (var index = 1; index <= cemeteryConstants.MAX_LENGTH_CEMETERY_GALLERY; index++) {
					if (!_.contains(positionsGallery, 'galeria_' + index)) {
						vm.galleries.push({ posicionGaleria: 'galeria_' + index, rutaImagen: '', srcImg: '', activo: '0' });
					}
				}
			}

			return vm.galleries;
		}

		function _buildCarousels() {
			_.forEach(vm.carousels, function (carousel) {
				carousel.srcImg = carousel.valor2;
				carousel.rutaImagen = "";
			});

			return vm.carousels;
		}

		function changeUrlMap() {
			vm.urlMapa = $sce.trustAsResourceUrl(vm.form.urlMapa);
			vm.isValidUrlMapa = cemeteryUtils.isValidHttpUrl(vm.form.urlMapa);
			vm.showUrlMapError = vm.isValidUrlMapa ? false : true;
			$scope.frmRegister.$invalid = vm.showUrlMapError;
		}

		function _getModifiedCemetery() {
			var cemetery = {}
			cemetery.idCamposanto = vm.form.idCamposanto;
			cemetery.nombre = vm.form.nombre;
			cemetery.estadoVisualizacion = vm.form.estadoVisualizacion;

			cemetery.codServicios = _.map(_.filter(vm.form.carousels, { activo: '1' }), function (item) {
				return item.valor4;
			}).join("|");

			cemetery.codServiciosAdicionales = _.map(_.filter(vm.form.services, { activo: '1' }), function (item) {
				return item.valor4;
			}).join("|");

			cemetery.rutaImagenBanner = vm.form.rutaImagenBanner;
			cemetery.rutaImagenCarrusel = vm.form.rutaImagenCarrusel;
			cemetery.urlTourInteractivo = vm.form.urlTourInteractivo;
			cemetery.descripcionCamposanto = vm.form.descripcionCamposanto;
			cemetery.seccionServicio = vm.form.seccionServicio;
			cemetery.descripcion = vm.form.descripcion;
			cemetery.informacionAdicional = vm.form.informacionAdicional;
			cemetery.urlMapa = vm.form.urlMapa;
			cemetery.codEspaciosActivos = vm.form.codEspaciosActivos;

			return cemetery;
		}

		function _getModifiedGalleries() {
			var modifiedGalleries = angular.copy(_.filter(vm.form.galleries, function (gallery) {
				if (gallery.activo === '1' && gallery.rutaImagen != '') {
					return gallery;
				}
			}));

			_.forEach(modifiedGalleries, function (gallery) {
				delete gallery.srcImg;
				delete gallery.valor6;
				delete gallery.idTipoGaleria;
			});

			return modifiedGalleries
		}

		function _getNewGalleries() {
			var newGalleries = angular.copy(_.filter(vm.form.galleries, function (gallery) {
				if (gallery.activo === '0' && gallery.rutaImagen != '') {
					return gallery;
				}
			}));

			_.forEach(newGalleries, function (gallery) {
				gallery.activo = '1';
			});

			_.forEach(newGalleries, function (gallery) {
				delete gallery.srcImg;
				delete gallery.valor6;
				delete gallery.idTipoGaleria;
			});

			return newGalleries;
		}

		function updateCemeteryAndGallery() {
			if (_validationForm()) {
				CemeteryFactory.LoginApiGateway().then(function (res) {
					_updateCemetery().then(function (res) {
						if (_getModifiedGalleries().length > 0 && _getNewGalleries().length > 0) {
							_updateGallerries().then(function (res) {
								_saveGallerries().then(function (res) {
									_setData()
									mModalAlert.showSuccess("", "Cambios realizados");
								});
							});
						} else {
							if (_getModifiedGalleries().length > 0) {
								_updateGallerries().then(function (res) {
									_setData()
									mModalAlert.showSuccess("", "Cambios realizados");
								});
							} else {
								if (_getNewGalleries().length > 0) {
									_saveGallerries().then(function (res) {
										_setData()
										mModalAlert.showSuccess("", "Cambios realizados");
									});
								} else {
									_setData()
									mModalAlert.showSuccess("", "Cambios realizados");
								}
							}
						}
					});
				});
			}
		}

	}

	return ng.module(coreConstants.ngMainModule).controller('CemeteryInfoComponent', CemeteryInfoComponent);
});
