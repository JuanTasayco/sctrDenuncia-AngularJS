(function($root, deps, action){
		define(deps, action)
})(this, [ 'angular', 'constants', 'helper' ], 
	function(angular, constants, helper){

		var appEnel = angular.module('appEnel');

		appEnel.factory('formularioFactory', 
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
					function getTipoEmpresa(showSpin){
						return proxyEnel.GetCompanyType(showSpin);
					}
					function getGiroNegocio(companyTypeId,showSpin){
						return proxyEnel.GetBusinessType(companyTypeId,showSpin);
					}
					function getSumaAsegurada(productTypeId, showSpin){
						return proxyEnel.GetAssuredSum(productTypeId, showSpin);
					}
					function getContratante(documentTypeId, documentId, showSpin){
						return proxyEnel.GetContractor(documentTypeId, documentId, showSpin)
					}

					function guardarAfiliado(request,showSpin){
						return proxyEnel.SaveMembership(request, showSpin);
					}
					function actualizarAfiliado(request,showSpin){
						return proxyEnel.UpdateMembership(request, showSpin);
					}

					function saveAfiliado(option,request,showSpin){
						if (option == 'I'){
							return proxyEnel.SaveMembership(request, showSpin);
						}else{
							return proxyEnel.UpdateMembership(request, showSpin);
						}
					}

					return {
						getLocalizacion: getLocalizacion,
						getTipoDocumento: getTipoDocumento,
						getAfiliado: getAfiliado,
						getProducto: getProducto,
						getTipoEmpresa: getTipoEmpresa,
						getGiroNegocio: getGiroNegocio,
						getSumaAsegurada: getSumaAsegurada,
						getContratante: getContratante,
						guardarAfiliado: guardarAfiliado,
						actualizarAfiliado: actualizarAfiliado,
						saveAfiliado: saveAfiliado
					}
				}
			]
		)
	});
