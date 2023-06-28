'use strict'

define(['angular', 'constants', 'oim_commons'], function(angular, constants){
	var appTransporte = angular.module('appTransportes');

	appTransporte.factory('transporteEmitFactory', ['$http', '$q', 'oimAbstractFactory', '$window', 'httpData', 'oimProxyPoliza', function($http, $q, factory, $window, httpData, oimProxyPoliza){
		var thisFactory = Object.create(factory);
		
		// https://mxperu.atlassian.net/browse/OIM-294
		thisFactory.getPolizasGrupo = function(params) {
			return thisFactory.getData('api/poliza/transporte/grupopoliza', params);	
		};

		// https://mxperu.atlassian.net/browse/OIM-163
		thisFactory.getMateriaAsegurada = function(params) {
			return thisFactory.getData('api/general/materiaAsegurada');
		};

		// https://mxperu.atlassian.net/browse/OIM-234
		thisFactory.getPaises = function(params) {
			return thisFactory.getData('api/general/ubigeo/pais');
		};

		// https://mxperu.atlassian.net/browse/OIM-102
		thisFactory.getDepartamentos = function(params) {
			return thisFactory.getData('api/general/ubigeo/departamento');
		};

		// https://mxperu.atlassian.net/browse/OIM-103
		thisFactory.getProvincias = function(params) {
			return thisFactory.getData('api/general/ubigeo/provincia', params);
		};

		// https://mxperu.atlassian.net/browse/OIM-104
		thisFactory.getDistritos = function(params) {
			return thisFactory.getData('api/general/ubigeo/distrito', params);
		};

		// https://mxperu.atlassian.net/browse/OIM-451
		thisFactory.getAlmacenes = function(params) {
			return thisFactory.getData('api/transporte/listarAlmacen', params);
		}

		// https://mxperu.atlassian.net/browse/OIM-452
		thisFactory.getListaValuacionMercaderia = function(params) {
			return thisFactory.getData('api/transporte/listaValuacionMercaderia', params);
		}

		// https://mxperu.atlassian.net/browse/OIM-207
		thisFactory.calcularPrimaAplicacion = function(params) {
			return thisFactory.postData('api/cotizacion/cotizar/transporte', params);
		}

		// https://mxperu.atlassian.net/browse/OIM-189
		thisFactory.getTiposDocumentos = function(params) {
			return thisFactory.getData("api/general/tipodoc/nacional", params);
		}

		// https://mxperu.atlassian.net/browse/OIM-113
		thisFactory.getProfesiones = function(params) {
			return thisFactory.getData("api/general/ocupacion", params);
		}

		// https://mxperu.atlassian.net/browse/OIM-115
		thisFactory.getNombresVias = function(params) {
			return thisFactory.getData("api/general/domicilio/tipo", params);
		}

		// https://mxperu.atlassian.net/browse/OIM-216
		thisFactory.getEnumeraciones = function(params) {
			return thisFactory.getData("api/general/domicilio/numeracion", params);
		}

		// https://mxperu.atlassian.net/browse/OIM-217
		thisFactory.getEnumeracionesInternas = function(params) {
			return thisFactory.getData("api/general/domicilio/interior", params);
		}

		// https://mxperu.atlassian.net/browse/OIM-218
		thisFactory.getNombresZonas = function(params) {
			return thisFactory.getData("api/general/domicilio/zona", params);
		}

		// https://mxperu.atlassian.net/browse/OIM-122
		thisFactory.getEndosatarios = function(params) {
			return thisFactory.getData("api/contratante/endosatario", params);
		}

		// https://mxperu.atlassian.net/browse/OIM-230
		thisFactory.emitirPoliza = function(params) {
			const opcMenu = localStorage.getItem('currentBreadcrumb');
			return httpData.post(
				oimProxyPoliza.endpoint + 'api/emision/grabar/transporte?COD_OBJETO=.&OPC_MENU=' + opcMenu,
                params, 
				undefined, 
				true
			);
		}

		// https://mxperu.atlassian.net/browse/OIM-456
		thisFactory.buscarAplicacionEmisiones = function(params) {
			return thisFactory.postData('api/transporte/aplicacion/buscaremisiones', params);	
		}

		// https://mxperu.atlassian.net/browse/OIM-162
		thisFactory.getRiesgos = function(params) {
			return thisFactory.getData('api/transporte/aplicacion/listarriesgos', params);
		}

		// https://mxperu.atlassian.net/browse/OIM-462
		thisFactory.getMarcoRiesgo = function(params) {
			return thisFactory.postData('api/transporte/aplicacion/marcoriesgo', params);
		}

		// https://mxperu.atlassian.net/browse/OIM-459
		thisFactory.calcularPrimaApl = function(params) {
			return thisFactory.postData('api/transporte/aplicacion/calcularprima', params);
		}

		// https://mxperu.atlassian.net/browse/OIM-206
		thisFactory.aplicarPoliza = function(params) {
			const opcMenu = localStorage.getItem('currentBreadcrumb');
			return httpData.post(
				oimProxyPoliza.endpoint + 'api/transporte/aplicacion/grabar?COD_OBJETO=.&OPC_MENU=' + opcMenu,
                params, 
				undefined, 
				true
			);
		}

		thisFactory.getPDF = function (params){      
      		if (params !== '') { URL += '/';}
      		$window.open(thisFactory.getBase() + 'api/documento/descargarPDF/' + constants.module.polizas.autos.companyCode + '/' +  params + '/0/0/0/N');
    	}
	    return thisFactory;
	}]);
});