(function($root, deps, action){
	define(deps, action)
})(this, ['angular', 'constants'], function(angular, constants){
	angular.module("appAutos")
	.factory('emitFactory',
	['$http'
	, 'proxyProducto'
	, 'proxyGeneral'
	, 'httpData'
	, function($http
		, proxyProducto
		, proxyGeneral
		, httpData){
		var base = constants.system.api.endpoints.policy + "api/agente/"
		return {
			getAgent: function(codigoNombre){
					return $http.get(base + 'buscar?codigoNombre=' + codigoNombre);
			},
			getQuotationCar: function(documentNumber){
					return $http.get(constants.system.api.endpoints.policy + 'api/documento/documentoBuscar/1/'+ documentNumber + '/301');
			},
			getDocument: function(documentNumber){
					return $http.get(constants.system.api.endpoints.policy + 'api/documento/documentoBuscar/1/'+ documentNumber + '/301');
			},
			getColors: function(){
					return $http.get(constants.system.api.endpoints.policy + 'api/automovil/color');
			},
			getValidationCar: function(p){
					return $http.post(constants.system.api.endpoints.policy + 'api/automovil/validar/psc', p);
			},
			getEndosatarios: function(p){
					return $http.get(constants.system.api.endpoints.policy + 'api/contratante/endosatario/' + (p || ""))
			},
			getFinanciamientos: function(rc, p){
					return $http.get(constants.system.api.endpoints.policy + 'api/general/financiamiento/tipo/' + rc + '/' + p)
			},
			getFinanciamientosROL: function(rc, p, rol){
					return $http.get(constants.system.api.endpoints.policy + 'api/general/financiamiento/tipoPorRol/' + rc + '/' + p + '/' + rol)
			},
			sendEmision : function(rp){
				const pathParams = {
					opcMenu: localStorage.getItem('currentBreadcrumb')
					};
					const urlRequest = constants.system.api.endpoints.policy + 'api/emision/grabar/vehiculo'+'?COD_OBJETO=4&OPC_MENU='+pathParams.opcMenu;
					return httpData.post(
						urlRequest,
						rp,
						undefined,
						true
					);

			},
			sendEmisionInspeccion : function(rp){
				const pathParams = {
					opcMenu: localStorage.getItem('currentBreadcrumb')
					};
				const urlRequest = constants.system.api.endpoints.policy + 'api/emision/grabar/vehiculoinspeccion'+'?COD_OBJETO=4&OPC_MENU='+pathParams.opcMenu;
					return httpData.post(
						urlRequest,
						rp,
						undefined,
						true
					);
			},
			cargaAltaDocumental: function(rp){
				return $http.post(constants.system.api.endpoints.policy + 'api/emision/vehiculo/cargaAltaDocumental', rp);
			},
			getContratante: function (documentType, documentValue){
					return $http.get(constants.system.api.endpoints.policy + 'api/contratante/datos/1/'+ documentType +'/12345678' + documentValue);
			},
			getClaims : function(){
				return $http.post(constants.system.api.endpoints.security + 'api/claims/values');
			},
			getListTypeProducto : function(){
				return proxyProducto.getListTypeProducto();
			},
			getFinancialEntities : function(showSpin){
				return proxyGeneral.GetListEntidadFinanciera(showSpin);
			},
			getAccountTypes : function(showSpin){
				return proxyGeneral.GetListTipoCuenta(showSpin);
			},
			getCoins : function(showSpin){
				return proxyGeneral.GetListMonedaVida(showSpin);
			},
			getCardsType : function(showSpin){
				return proxyGeneral.GetListTipoTarjeta(showSpin);
			}
		}
	}])
});