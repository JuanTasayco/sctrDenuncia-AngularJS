'use strict';

define([
	'angular',
	'lodash',
	'coreConstants',
	'endpointsConstants',
	'cemeteryUtils'
], function (ng, _, coreConstants, endpointsConstants, cemeteryUtils ) {

	CemeteryFactory.$inject = ['httpData', '$state', '$q', '$log', 'mpSpin'];

	function CemeteryFactory(httpData, $state, $q, $log, mpSpin) {
		var domain = endpointsConstants.default;
		var API_URL = endpointsConstants.camposanto.url;

		return {
			GetCemeteries: GetCemeteries,
			GetCemetery: GetCemetery,
			SaveCemetery: SaveCemetery,
			UpdateCemetery: UpdateCemetery,
			GetGalleries: GetGalleries,
			SaveGalleries: SaveGalleries,
			UpdateGalleries: UpdateGalleries,
			UploadImage: UploadImage,
			GetSpaces: GetSpaces,
			SaveSpaces: SaveSpaces,
			UpdateSpaces: UpdateSpaces,
			GetParameters: GetParameters,
			SaveParameters: SaveParameters,
			UpdateParameters: UpdateParameters,
			LoginApiGateway: LoginApiGateway
		};

		//Cemetery
		function GetCemeteries() {
			return httpData
				.get(
					API_URL + 'camposantos',
					_.assign({ params: _.assign({ isCache: false })}, cemeteryUtils.getHeadersBearer() ),
					undefined,
					true
				)
				.then(function (res) {
					return _.assign(res, { success: res.codigo === coreConstants.api.successfulCode });
				});
		}

		function GetCemetery(cemeteryId) {
			return httpData
				.get(
					API_URL + 'camposanto/' + cemeteryId,
					_.assign({ params: _.assign({ isCache: false })}, cemeteryUtils.getHeadersBearer()),
					undefined,
					true
				)
				.then(function (res) {
					return _.assign(res, { success: res.codigo === coreConstants.api.successfulCode });
				});
		}

		function SaveCemetery(cemetery) {
			return httpData
				.post(
					API_URL + 'camposanto',
					cemetery,
					cemeteryUtils.getHeadersBearer(),
					true
				)
				.then(function (res) {
					return _.assign(res, { success: res.codigo === coreConstants.api.successfulCode });
				});
		}

		function UpdateCemetery(cemetery) {
			return httpData
				.put(
					API_URL + 'camposanto',
					cemetery,
					cemeteryUtils.getHeadersBearer(),
					true
				)
				.then(function (res) {
					return _.assign(res, { success: res.codigo === coreConstants.api.successfulCode });
				});
		}

		//Gallery
		function GetGalleries(cemeteryId, galleryType) {
			return httpData
				.get(
					API_URL + 'camposanto/' + cemeteryId + '/imagenes',
					_.assign({ params: _.assign( { isCache: false, tipoGaleria: galleryType })}, cemeteryUtils.getHeadersBearer()),
					undefined,
					true
				)
				.then(function (res) {
					return _.assign(res, { success: res.codigo === coreConstants.api.successfulCode });
				});
		}


		function SaveGalleries(cemeteryId, galleries, galleryType) {
			return httpData
				.post(
					API_URL + 'camposanto/' + cemeteryId + '/imagenes',
					galleries,
					{
						params: _.assign(
							{
								tipoGaleria: galleryType
							}
						)
					},
					true
				)
				.then(function (res) {
					return _.assign(res, { success: res.codigo === coreConstants.api.successfulCode });
				});
		}

		function UpdateGalleries(cemeteryId, galleries, galleryType) {
			return httpData
				.put(
					API_URL + 'camposanto/' + cemeteryId + '/imagenes',
					galleries,
					{
						params: _.assign(
							{
								tipoGaleria: galleryType
							}
						)
					},
					true
				)
				.then(function (res) {
					return _.assign(res, { success: res.codigo === coreConstants.api.successfulCode });
				});
		}

		function UploadImage(file) {
			var deferred = $q.defer();
			var apiPath = domain + 'api/v1/cms/marketing/areaPrivada/banners/subidaImagen';
			var params = { imagen: file };
			var form = new FormData();
			var keyParams = _.keys(params);
			_.forEach(keyParams, function (item) {
				form.append(item, params[item]);
			});
			mpSpin.start();
			httpData
				.post(apiPath, form, {
					transformRequest: ng.identity,
					headers: { 'Content-Type': undefined },
					uploadEventHandlers: {
						progress: function (ev) {
						}
					}
				})
				.then(function (res) {
					mpSpin.end();
					deferred.resolve(res);
				})
				.catch(function (err) {
					mpSpin.end();
				});

			return deferred.promise;
		}

		//Spaces
		function GetSpaces(cemeteryId) {
			return httpData
				.get(
					API_URL + 'camposanto/' + cemeteryId + '/espacios',
					_.assign({ params: _.assign({ isCache: false}) }, cemeteryUtils.getHeadersBearer()),
					undefined,
					true
				)
				.then(function (res) {
					return _.assign(res, { success: res.codigo === coreConstants.api.successfulCode });
				});
		}

		function SaveSpaces(cemeteryId, spaces) {
			return httpData
				.post(
					API_URL + 'camposanto/' + cemeteryId + '/espacios',
					spaces,
					cemeteryUtils.getHeadersBearer(),
					true
				)
				.then(function (res) {
					return _.assign(res, { success: res.codigo === coreConstants.api.successfulCode });
				});
		}

		function UpdateSpaces(cemeteryId, spaces) {
			return httpData
				.put(
					API_URL + 'camposanto/' + cemeteryId + '/espacios',
					spaces,
					cemeteryUtils.getHeadersBearer(),
					true
				)
				.then(function (res) {
					return _.assign(res, { success: res.codigo === coreConstants.api.successfulCode });
				});
		}

		function GetParameters(subdomains) {
			return httpData
				.get(
					API_URL + 'camposanto/' +  'parametros',
					_.assign({ params: _.assign( { isCache: false, subDomain: subdomains})}, cemeteryUtils.getHeadersBearer()),
					undefined,
					true
				)
				.then(function (res) {
					return _.assign(res, { success: res.codigo === coreConstants.api.successfulCode });
				});
		}

		function SaveParameters(parameters) {
			return httpData
				.post(
					API_URL + 'camposanto/' +  'parametros',
					parameters,
					cemeteryUtils.getHeadersBearer(),
					true
				)
				.then(function (res) {
					return _.assign(res, { success: res.codigo === coreConstants.api.successfulCode });
				});
		}

		function UpdateParameters(parameters) {
			return httpData
				.put(
					API_URL + 'camposanto/' +  'parametros',
					parameters,
					cemeteryUtils.getHeadersBearer(),
					true
				)
				.then(function (res) {
					return _.assign(res, { success: res.codigo === coreConstants.api.successfulCode });
				});
		}

		function LoginApiGateway() {
			var defered = $q.defer();
			var promise = defered.promise;
			httpData
				.post(
					API_URL + 'login',
					{},
					cemeteryUtils.getHeadersBasic(),
					true
				).then(function (res) {
					localStorage.setItem('cemeteryToken', ng.toJson(res));
					defered.resolve();
				}).catch(function (error) {
					$log.log('CemeteryFactory', error);
					defered.reject(error);
					$state.go('errorCemetery', {}, { reload: true, inherit: false });
				});
			return promise;
		}
	}
	return ng.module(coreConstants.ngCemeteryModule, []).factory('CemeteryFactory', CemeteryFactory);
});


