(function($root, deps, action){
		define(deps, action)
})(this, [ 'angular', 'constants', 'helper' ], 
	function(angular, constants, helper){

		var appEnel = angular.module('appEnel');

		appEnel.factory('bandejaFactory', 
			['proxyClaims', '$http', '$q', '$window', 'proxyEnel',
				function(proxyClaims, $http, $q, $window, proxyEnel){

					function getLocalizacion(departamentId,provinceId,showSpin){
						return proxyEnel.GetLocation(departamentId,provinceId,showSpin)
					}
					function getTipoDocumento(showSpin){
						return proxyEnel.GetDocumentType(showSpin);
					}
					function getAfiliado(affiliateId,showSpin){
						return proxyEnel.GetAfilliateById(affiliateId,showSpin);
					}
					function getProducto(showSpin){
						return proxyEnel.GetProductType(showSpin);
					}

					function getListaAfiliados(request,showSpin){
						return proxyEnel.GetAfilliateList(request,showSpin);
					}
					function guardarAfiliado(request,showSpin){
						return proxyEnel.SaveMembership(request, showSpin);
					}
					function actualizarAfiliado(request,showSpin){
						return proxyEnel.UpdateMembership(request, showSpin);
					}

					return {
						getLocalizacion: getLocalizacion,
						getTipoDocumento: getTipoDocumento,
						getAfiliado: getAfiliado,
						getProducto: getProducto,
						getListaAfiliados: getListaAfiliados
					}
				}
			]
		)
	});
