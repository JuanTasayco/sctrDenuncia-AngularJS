/* eslint-disable */
(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants'], function(angular, constants){
    var module = angular.module("oim.proxyService.renovacion", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxyRenovacion', {
        endpoint: constants.system.api.endpoints['renovacion'],
        controllerRenovacionAuto: {
            actions : {
                'methodPreRenovarPoliza':{
                    name:  'PreRenovarPoliza',
                    path: 'oimRenovacionPoliza/auto/poliza/{polizaId}/prerenovacion'
                },
                'methodRenovarPoliza':{
                    name:  'RenovarPoliza',
                    path: 'oimRenovacionPoliza/auto/poliza/{polizaId}/renovacion'
                },
            }
        },
        controllerRenovacionPoliza: {
            actions : {
                'methodAnularPoliza':{
                    name:  'AnularPoliza',
                    path: 'oimRenovacionPoliza/poliza/{polizaId}/renovacion/anulacion'
                },
                'methodConsultarPoliza':{
                    name:  'ConsultarPoliza',
                    path: 'oimRenovacionPoliza/poliza/{polizaId}'
                },
                'methodBuscarPolizas':{
                    name:  'BuscarPolizas',
                    path: 'oimRenovacionPoliza/poliza/busqueda?numeroPagina={numeroPagina}&cantidadPorPagina={cantidadPorPagina}&limite={limite}'
                },
                'methodNotificarRenovacionPoliza':{
                    name:  'NotificarRenovacionPoliza',
                    path: 'oimRenovacionPoliza/poliza/{polizaId}/notificacion'
                },
                'methodNotificarPreRenovacionPoliza':{
                    name:  'NotificarPreRenovacionPoliza',
                    path: 'oimRenovacionPoliza/poliza/{polizaId}/prerenovacion/notificacion'
                },
                'methodObtenerParametros':{
                    name:  'ObtenerParametros',
                    path: 'oimRenovacionPoliza/poliza/parametros'
                },
                'methodObtenerParametrosFiltrados':{
                    name:  'ObtenerParametrosFiltrados',
                    path: 'oimRenovacionPoliza/poliza/filtroparametros'
                },
                'methodCategorizarCliente':{
                    name:  'CategorizarCliente',
                    path: 'oimRenovacionPoliza/poliza/cliente/categorizacion'
                },
                'methodGenerarDocumentoPoliza':{
                    name:  'GenerarDocumentoPoliza',
                    path: 'oimRenovacionPoliza/poliza/{polizaId}/generaDocumento/poliza'
                },
                'methodGenerarDocumentoPreRenovacion':{
                    name:  'GenerarDocumentoPreRenovacion',
                    path: 'oimRenovacionPoliza/poliza/{polizaId}/generaDocumento/prerenovacion'
                },
            }
        }
    })



     module.factory("proxyRenovacionAuto", ['oimProxyRenovacion', 'httpData', function(oimProxyRenovacion, httpData){
        return {
                'PreRenovarPoliza' : function(solicitud, polizaId, showSpin){
                    return httpData['post'](oimProxyRenovacion.endpoint + helper.formatNamed('oimRenovacionPoliza/auto/poliza/{polizaId}/prerenovacion',
                                                    { 'polizaId':  { value: polizaId, defaultValue:'' }  }),
                                         solicitud, undefined, showSpin)
                },
                'RenovarPoliza' : function(solicitud, polizaId, showSpin){
                    return httpData['post'](oimProxyRenovacion.endpoint + helper.formatNamed('oimRenovacionPoliza/auto/poliza/{polizaId}/renovacion',
                                                    { 'polizaId':  { value: polizaId, defaultValue:'' }  }),
                                         solicitud, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyRenovacionPoliza", ['oimProxyRenovacion', 'httpData', function(oimProxyRenovacion, httpData){
        return {
                'AnularPoliza' : function(solicitud, polizaId, showSpin){
                    return httpData['post'](oimProxyRenovacion.endpoint + helper.formatNamed('oimRenovacionPoliza/poliza/{polizaId}/renovacion/anulacion',
                                                    { 'polizaId':  { value: polizaId, defaultValue:'' }  }),
                                         solicitud, undefined, showSpin)
                },
                'ConsultarPoliza' : function(polizaId, showSpin){
                    return httpData['get'](oimProxyRenovacion.endpoint + helper.formatNamed('oimRenovacionPoliza/poliza/{polizaId}',
                                                    { 'polizaId':  { value: polizaId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'BuscarPolizas' : function(filtrosBusqueda, numeroPagina, cantidadPorPagina, limite, showSpin){
                    return httpData['post'](oimProxyRenovacion.endpoint + helper.formatNamed('oimRenovacionPoliza/poliza/busqueda?numeroPagina={numeroPagina}&cantidadPorPagina={cantidadPorPagina}&limite={limite}',
                                                    { 'numeroPagina':  { value: numeroPagina, defaultValue:'' } ,'cantidadPorPagina':  { value: cantidadPorPagina, defaultValue:'' } ,'limite':  { value: limite, defaultValue:'0' }  }),
                                         filtrosBusqueda, undefined, showSpin)
                },
                'NotificarRenovacionPoliza' : function(solicitud, polizaId, showSpin){
                    return httpData['post'](oimProxyRenovacion.endpoint + helper.formatNamed('oimRenovacionPoliza/poliza/{polizaId}/notificacion',
                                                    { 'polizaId':  { value: polizaId, defaultValue:'' }  }),
                                         solicitud, undefined, showSpin)
                },
                'NotificarPreRenovacionPoliza' : function(solicitud, polizaId, showSpin){
                    return httpData['post'](oimProxyRenovacion.endpoint + helper.formatNamed('oimRenovacionPoliza/poliza/{polizaId}/prerenovacion/notificacion',
                                                    { 'polizaId':  { value: polizaId, defaultValue:'' }  }),
                                         solicitud, undefined, showSpin)
                },
                'ObtenerParametros' : function( showSpin){
                    return httpData['get'](oimProxyRenovacion.endpoint + 'oimRenovacionPoliza/poliza/parametros',
                                         undefined, undefined, showSpin)
                },
                'ObtenerParametrosFiltrados' : function(filtro, showSpin){
                    return httpData['post'](oimProxyRenovacion.endpoint + 'oimRenovacionPoliza/poliza/filtroparametros',
                                         filtro, undefined, showSpin)
                },
                'CategorizarCliente' : function(solicitud, showSpin){
                    return httpData['post'](oimProxyRenovacion.endpoint + 'oimRenovacionPoliza/poliza/cliente/categorizacion',
                                         solicitud, undefined, showSpin)
                },
                'GenerarDocumentoPoliza' : function(documento, polizaId, showSpin){
                    return httpData['post'](oimProxyRenovacion.endpoint + helper.formatNamed('oimRenovacionPoliza/poliza/{polizaId}/generaDocumento/poliza',
                                                    { 'polizaId':  { value: polizaId, defaultValue:'' }  }),
                                         documento, undefined, showSpin)
                },
                'GenerarDocumentoPreRenovacion' : function(solicitud, polizaId, showSpin){
                    return httpData['post'](oimProxyRenovacion.endpoint + helper.formatNamed('oimRenovacionPoliza/poliza/{polizaId}/generaDocumento/prerenovacion',
                                                    { 'polizaId':  { value: polizaId, defaultValue:'' }  }),
                                         solicitud, undefined, showSpin)
                }
        };
     }]);
});
