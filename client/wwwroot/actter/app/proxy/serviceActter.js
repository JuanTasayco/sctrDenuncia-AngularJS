/* eslint-disable */
(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants'], function(angular, constants){
    var module = angular.module("oim.proxyService.actter", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxyActter', {
        endpoint: constants.system.api.endpoints['actter'],
        controllerGeneral: {
            actions : {
                'methodobtenerTipo':{
                    name:  'obtenerTipo',
                    path: 'api/general/parametros/{idFormulario}'
                },
            }
        },
        controllerCliente: {
            actions : {
                'methodagregarContacto':{
                    name:  'agregarContacto',
                    path: 'api/cliente/contacto'
                },
                'methodmodificarContacto':{
                    name:  'modificarContacto',
                    path: 'api/cliente/contacto'
                },
                'methodmodificarDatosPersonales':{
                    name:  'modificarDatosPersonales',
                    path: 'api/cliente'
                },
                'methodmodificarDatosPoliza':{
                    name:  'modificarDatosPoliza',
                    path: 'api/cliente/poliza'
                },
                'methodobtenerClientes':{
                    name:  'obtenerClientes',
                    path: 'api/clientes'
                },
                'methodobtenerContactos':{
                    name:  'obtenerContactos',
                    path: 'api/cliente/contactos'
                },
                'methodobtenerDatosPersonales':{
                    name:  'obtenerDatosPersonales',
                    path: 'api/cliente/busquedaPorDni'
                },
                'methodobtenerPolizas':{
                    name:  'obtenerPolizas',
                    path: 'api/cliente/polizas'
                },
                'methodenviarEmail':{
                    name:  'enviarEmail',
                    path: 'api/cliente/solicitud'
                },
            }
        }
    })



     module.factory("proxyGeneral", ['oimProxyActter', 'httpData', function(oimProxyActter, httpData){
        return {
                'obtenerTipo' : function(idFormulario, showSpin){
                    return httpData['get'](oimProxyActter.endpoint + helper.formatNamed('api/general/parametros/{idFormulario}',
                                                    { 'idFormulario':idFormulario   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCliente", ['oimProxyActter', 'httpData', function(oimProxyActter, httpData){
        return {
                'agregarContacto' : function(datos, showSpin){
                    return httpData['post'](oimProxyActter.endpoint + 'api/cliente/contacto',
                                         datos, undefined, showSpin)
                },
                'modificarContacto' : function(datos, showSpin){
                    return httpData['put'](oimProxyActter.endpoint + 'api/cliente/contacto',
                                         datos, undefined, showSpin)
                },
                'modificarDatosPersonales' : function(datos, showSpin){
                    return httpData['put'](oimProxyActter.endpoint + 'api/cliente',
                                         datos, undefined, showSpin)
                },
                'modificarDatosPoliza' : function(datos, showSpin){
                    return httpData['put'](oimProxyActter.endpoint + 'api/cliente/poliza',
                                         datos, undefined, showSpin)
                },
                'obtenerClientes' : function(datos, showSpin){
                    return httpData['post'](oimProxyActter.endpoint + 'api/clientes',
                                         datos, undefined, showSpin)
                },
                'obtenerContactos' : function(datos, showSpin){
                    return httpData['post'](oimProxyActter.endpoint + 'api/cliente/contactos',
                                         datos, undefined, showSpin)
                },
                'obtenerDatosPersonales' : function(datos, showSpin){
                    return httpData['post'](oimProxyActter.endpoint + 'api/cliente/busquedaPorDni',
                                         datos, undefined, showSpin)
                },
                'obtenerPolizas' : function(datos, showSpin){
                    return httpData['post'](oimProxyActter.endpoint + 'api/cliente/polizas',
                                         datos, undefined, showSpin)
                },
                'enviarEmail' : function(datos, showSpin){
                    return httpData['post'](oimProxyActter.endpoint + 'api/cliente/solicitud',
                                         datos, undefined, showSpin)
                }
        };
     }]);
});
