/* eslint-disable */
(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants'], function(angular, constants){
    var module = angular.module("oim.proxyService.referencias", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxyReferencias', {
        endpoint: constants.system.api.endpoints['referencias'],
        controllerTraza: {
            actions : {
                'methodEventTracker':{
                    name:  'EventTracker',
                    path: 'api/traza/eventTracker'
                },
            }
        },
        controllerReferencia: {
            actions : {
                'methodGetListaReferenciasEXCEL':{
                    name:  'GetListaReferenciasEXCEL',
                    path: 'api/referencia/listarExcel'
                },
                'methodGetReferenciaPDF':{
                    name:  'GetReferenciaPDF',
                    path: 'api/referencia/detallePDF'
                },
                'methodDetalleReferencia':{
                    name:  'DetalleReferencia',
                    path: 'api/referencia/detalle'
                },
                'methodEditarReferenciaP2':{
                    name:  'EditarReferenciaP2',
                    path: 'api/referencia/editar/paso2'
                },
                'methodEditarReferenciaP3':{
                    name:  'EditarReferenciaP3',
                    path: 'api/referencia/editar/paso3'
                },
                'methodEditarReferenciaP4':{
                    name:  'EditarReferenciaP4',
                    path: 'api/referencia/editar/paso4'
                },
                'methodAnularReferencia':{
                    name:  'AnularReferencia',
                    path: 'api/referencia/anular'
                },
                'methodRevisarReferencia':{
                    name:  'RevisarReferencia',
                    path: 'api/referencia/revisar'
                },
                'methodNuevaReferencia':{
                    name:  'NuevaReferencia',
                    path: 'api/referencia/nueva'
                },
                'methodRListarReferencias':{
                    name:  'RListarReferencias',
                    path: 'api/referencia/listar'
                },
            }
        },
        controllerAsegurado: {
            actions : {
                'methodListarAsegurados':{
                    name:  'ListarAsegurados',
                    path: 'api/asegurado/buscar'
                },
                'methodListarAseguradosSerial':{
                    name:  'ListarAseguradosSerial',
                    path: 'api/asegurado/buscarSerial'
                },
                'methodListarAseguradosSerial':{
                    name:  'ListarAseguradosSerial',
                    path: 'api/asegurado/buscarbyID/{mode}'
                },
            }
        },
        controllerProveedor: {
            actions : {
                'methodBuscarProveedor':{
                    name:  'BuscarProveedor',
                    path: 'api/proveedor/buscar'
                },
                'methodListarProveedor':{
                    name:  'ListarProveedor',
                    path: 'api/proveedor/filtro'
                },
                'methodVerDetalle':{
                    name:  'VerDetalle',
                    path: 'api/proveedor/detalle'
                },
            }
        },
        controllerFiltro: {
            actions : {
                'methodListarFiltros':{
                    name:  'ListarFiltros',
                    path: 'api/filtro'
                },
                'methodFiltroMedico':{
                    name:  'FiltroMedico',
                    path: 'api/filtro/medico'
                },
                'methodGetVersion':{
                    name:  'GetVersion',
                    path: 'api/filtro/getVersion'
                },
                'methodGetTime':{
                    name:  'GetTime',
                    path: 'api/filtro/getTime/{mode}'
                },
                'methodGetTime2':{
                    name:  'GetTime2',
                    path: 'api/filtro/getTime/{mode}'
                },
            }
        }
    })



     module.factory("proxyTraza", ['oimProxyReferencias', 'httpData', function(oimProxyReferencias, httpData){
        return {
                'EventTracker' : function(request, showSpin){
                    return httpData['post'](oimProxyReferencias.endpoint + 'api/traza/eventTracker',
                                         request, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyReferencia", ['oimProxyReferencias', 'httpData', function(oimProxyReferencias, httpData){
        return {
                'GetListaReferenciasEXCEL' : function(param, showSpin){
                    return httpData['post'](oimProxyReferencias.endpoint + 'api/referencia/listarExcel',
                                         param, undefined, showSpin)
                },
                'GetReferenciaPDF' : function(param, showSpin){
                    return httpData['post'](oimProxyReferencias.endpoint + 'api/referencia/detallePDF',
                                         param, undefined, showSpin)
                },
                'DetalleReferencia' : function(param, showSpin){
                    return httpData['post'](oimProxyReferencias.endpoint + 'api/referencia/detalle',
                                         param, undefined, showSpin)
                },
                'EditarReferenciaP2' : function(param, showSpin){
                    return httpData['post'](oimProxyReferencias.endpoint + 'api/referencia/editar/paso2',
                                         param, undefined, showSpin)
                },
                'EditarReferenciaP3' : function(param, showSpin){
                    return httpData['post'](oimProxyReferencias.endpoint + 'api/referencia/editar/paso3',
                                         param, undefined, showSpin)
                },
                'EditarReferenciaP4' : function(param, showSpin){
                    return httpData['post'](oimProxyReferencias.endpoint + 'api/referencia/editar/paso4',
                                         param, undefined, showSpin)
                },
                'AnularReferencia' : function(param, showSpin){
                    return httpData['post'](oimProxyReferencias.endpoint + 'api/referencia/anular',
                                         param, undefined, showSpin)
                },
                'RevisarReferencia' : function(param, showSpin){
                    return httpData['post'](oimProxyReferencias.endpoint + 'api/referencia/revisar',
                                         param, undefined, showSpin)
                },
                'NuevaReferencia' : function(param, showSpin){
                    return httpData['post'](oimProxyReferencias.endpoint + 'api/referencia/nueva',
                                         param, undefined, showSpin)
                },
                'RListarReferencias' : function(param, showSpin){
                    return httpData['post'](oimProxyReferencias.endpoint + 'api/referencia/listar',
                                         param, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyAsegurado", ['oimProxyReferencias', 'httpData', function(oimProxyReferencias, httpData){
        return {
                'ListarAsegurados' : function(param, showSpin){
                    return httpData['post'](oimProxyReferencias.endpoint + 'api/asegurado/buscar',
                                         param, undefined, showSpin)
                },
                'ListarAseguradosSerial' : function(param, showSpin){
                    return httpData['post'](oimProxyReferencias.endpoint + 'api/asegurado/buscarSerial',
                                         param, undefined, showSpin)
                },
                'ListarAseguradosSerial' : function(param, mode, showSpin){
                    return httpData['post'](oimProxyReferencias.endpoint + helper.formatNamed('api/asegurado/buscarbyID/{mode}',
                                                    { 'mode':mode   }),
                                         param, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyProveedor", ['oimProxyReferencias', 'httpData', function(oimProxyReferencias, httpData){
        return {
                'BuscarProveedor' : function(param, showSpin){
                    return httpData['post'](oimProxyReferencias.endpoint + 'api/proveedor/buscar',
                                         param, undefined, showSpin)
                },
                'ListarProveedor' : function(param, showSpin){
                    return httpData['post'](oimProxyReferencias.endpoint + 'api/proveedor/filtro',
                                         param, undefined, showSpin)
                },
                'VerDetalle' : function(param, showSpin){
                    return httpData['post'](oimProxyReferencias.endpoint + 'api/proveedor/detalle',
                                         param, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyFiltro", ['oimProxyReferencias', 'httpData', function(oimProxyReferencias, httpData){
        return {
                'ListarFiltros' : function(param, showSpin){
                    return httpData['post'](oimProxyReferencias.endpoint + 'api/filtro',
                                         param, undefined, showSpin)
                },
                'FiltroMedico' : function(param, showSpin){
                    return httpData['post'](oimProxyReferencias.endpoint + 'api/filtro/medico',
                                         param, undefined, showSpin)
                },
                'GetVersion' : function( showSpin){
                    return httpData['get'](oimProxyReferencias.endpoint + 'api/filtro/getVersion',
                                         undefined, undefined, showSpin)
                },
                'GetTime' : function(param, mode, showSpin){
                    return httpData['get'](oimProxyReferencias.endpoint + helper.formatNamed('api/filtro/getTime/{mode}',
                                                    { 'mode':  { value: mode, defaultValue:'0' }  }),
                                         param, undefined, showSpin)
                },
                'GetTime2' : function(param, mode, showSpin){
                    return httpData['post'](oimProxyReferencias.endpoint + helper.formatNamed('api/filtro/getTime/{mode}',
                                                    { 'mode':  { value: mode, defaultValue:'0' }  }),
                                         param, undefined, showSpin)
                }
        };
     }]);
});
