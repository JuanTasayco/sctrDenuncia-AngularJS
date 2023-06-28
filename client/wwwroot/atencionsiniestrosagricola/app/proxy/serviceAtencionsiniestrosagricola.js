/* eslint-disable */
(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants'], function(angular, constants){
    var module = angular.module("oim.proxyService.atencionsiniestrosagricola", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxyAtencionsiniestrosagricola', {
        endpoint: constants.system.api.endpoints['atencionsiniestrosagricola'],
        controllerAviso: {
            actions : {
                'methodReaperturarAviso':{
                    name:  'ReaperturarAviso',
                    path: 'api/avisos/{codCampania}/{codAviso}'
                },
                'methodGetReapertura':{
                    name:  'GetReapertura',
                    path: 'api/avisos/{codCampania}/{codAviso}'
                },
                'methodGetListaAvisosExcel':{
                    name:  'GetListaAvisosExcel',
                    path: 'api/avisos/ListaExcel'
                },
                'methodDescargaArchivo':{
                    name:  'DescargaArchivo',
                    path: 'api/avisos/Archivo/Descargar'
                },
                'methodAjustarAviso':{
                    name:  'AjustarAviso',
                    path: 'api/avisos/{codCampania}/{codAviso}'
                },
                'methodNewAviso':{
                    name:  'NewAviso',
                    path: 'api/avisos/nuevo'
                },
                'methodListaAvisos':{
                    name:  'ListaAvisos',
                    path: 'api/avisos/listar'
                },
                'methodDetalleAviso':{
                    name:  'DetalleAviso',
                    path: 'api/avisos/detalle'
                },
                'methodDetalleAjuste':{
                    name:  'DetalleAjuste',
                    path: 'api/avisos/ajuste/detalle'
                },
                'methodGetSuperficieAsegurada':{
                    name:  'GetSuperficieAsegurada',
                    path: 'api/avisos/SupAseg'
                },
                'methodListaBandejaReportes':{
                    name:  'ListaBandejaReportes',
                    path: 'api/avisos/tipo?codAviso={codAviso}&codCampania={codCampania}&fecIni={fecIni}&fecFin={fecFin}&codCultivo={codCultivo}&codRegion={codRegion}&codProvincia={codProvincia}&codDistrito={codDistrito}&codSectorEst={codSectorEst}&codEstado={codEstado}&pagina={pagina}&penPadron={penPadron}&usuarioSistema={usuarioSistema}'
                },
                'methodObtenerPadronBeneficiarios':{
                    name:  'ObtenerPadronBeneficiarios',
                    path: 'api/avisos/beneficiarios/campania/{codCampania}/aviso/{codAviso}'
                },
                'methodGetSiscas':{
                    name:  'GetSiscas',
                    path: 'api/avisos/origen?campania={campania}&codigoAviso={codigoAviso}&fechaDesde={fechaDesde}&fechaHasta={fechaHasta}&estado={estado}&numeroPagina={numeroPagina}&order={order}&tipoConsulta={tipoConsulta}'
                },
                'methodgenerarArchivo':{
                    name:  'generarArchivo',
                    path: 'api/default/Aviso'
                },
            }
        },
        controllerCampania: {
            actions : {
                'methodGetCampaniaActiva':{
                    name:  'GetCampaniaActiva',
                    path: 'api/Campanias/getActiva'
                },
                'methodInsertCampania':{
                    name:  'InsertCampania',
                    path: 'api/Campanias'
                },
                'methodGetCampania':{
                    name:  'GetCampania',
                    path: 'api/Campanias/{idCampania}'
                },
                'methodGetCampanias':{
                    name:  'GetCampanias',
                    path: 'api/Campanias'
                },
                'methodEditCampania':{
                    name:  'EditCampania',
                    path: 'api/Campanias/{idCampania}'
                },
                'methodGetUsuariosCampania':{
                    name:  'GetUsuariosCampania',
                    path: 'api/Campanias/{idCampania}/usuarios'
                },
                'methodInsertUsuarioCampania':{
                    name:  'InsertUsuarioCampania',
                    path: 'api/Campanias/{idCampania}/usuarios'
                },
                'methodeditUsuarioCampania':{
                    name:  'editUsuarioCampania',
                    path: 'api/Campanias/{idCampania}/usuarios'
                },
                'methoddeleteUsuarioCampania':{
                    name:  'deleteUsuarioCampania',
                    path: 'api/Campanias/{idCampania}/usuarios/{idUsuario}'
                },
                'methodGetGrupoCultivo':{
                    name:  'GetGrupoCultivo',
                    path: 'api/Campanias/{idCampania}/gruposCultivo'
                },
                'methodInsertGrupCultivo':{
                    name:  'InsertGrupCultivo',
                    path: 'api/Campanias/{idCampania}/gruposCultivo'
                },
                'methodEditarGrupoCultivo':{
                    name:  'EditarGrupoCultivo',
                    path: 'api/Campanias/{idCampania}/gruposCultivo'
                },
                'methodGetCultivo':{
                    name:  'GetCultivo',
                    path: 'api/Campanias/{idCampania}/gruposCultivo/{idGrupoCultivo}/cultivos'
                },
                'methodInsertCultivo':{
                    name:  'InsertCultivo',
                    path: 'api/Campanias/{idCampania}/gruposCultivo/{idGrupoCultivo}/cultivos'
                },
                'methodEditarCultivo':{
                    name:  'EditarCultivo',
                    path: 'api/Campanias/{idCampania}/gruposCultivo/{idGrupoCultivo}/cultivos'
                },
                'methodGetSectorEstad':{
                    name:  'GetSectorEstad',
                    path: 'api/Campanias/{idCampania}/sectoresEstadisticos'
                },
                'methodProcesarSectorEstad':{
                    name:  'ProcesarSectorEstad',
                    path: 'api/Campanias/{idCampania}/sectoresEstadisticos'
                },
                'methodGetCultivoSector':{
                    name:  'GetCultivoSector',
                    path: 'api/Campanias/{idCampania}/cultivoSectoresEstadisticos'
                },
                'methodProcesarCultivoSector':{
                    name:  'ProcesarCultivoSector',
                    path: 'api/Campanias/{idCampania}/cultivoSectoresEstadisticos'
                },
                'methodGetgrupoParametro':{
                    name:  'GetgrupoParametro',
                    path: 'api/Campanias/{idCampania}/gruposParametro'
                },
                'methodInsertGrupParametro':{
                    name:  'InsertGrupParametro',
                    path: 'api/Campanias/{idCampania}/gruposParametro'
                },
                'methodHabilitarGrupoParam':{
                    name:  'HabilitarGrupoParam',
                    path: 'api/Campanias/{idCampania}/gruposParametro'
                },
                'methodGetParametro':{
                    name:  'GetParametro',
                    path: 'api/Campanias/{idCampania}/gruposParametro/{idGrupoParametro}/parametros'
                },
                'methodInsertParametro':{
                    name:  'InsertParametro',
                    path: 'api/Campanias/{idCampania}/gruposParametro/{idGrupoParametro}/parametros'
                },
                'methodEditarParametro':{
                    name:  'EditarParametro',
                    path: 'api/Campanias/{idCampania}/gruposParametro/{idGrupoParametro}/parametros'
                },
                'methodValidarPadron':{
                    name:  'ValidarPadron',
                    path: 'api/Campanias/{idCampania}/beneficiarios'
                },
                'methodgenerarArchivo':{
                    name:  'generarArchivo',
                    path: 'api/default/Campania'
                },
            }
        },
        controllerContacto: {
            actions : {
                'methodGetContacto':{
                    name:  'GetContacto',
                    path: 'api/contacto/contacto?nombre={nombre}'
                },
            }
        },
        controllerAgricolaSecurity: {
            actions : {
                'methodGetRole':{
                    name:  'GetRole',
                    path: 'api/security/role'
                },
            }
        },
        controllerLookup: {
            actions : {
                'methodGetVersion':{
                    name:  'GetVersion',
                    path: 'api/version'
                },
                'methodGetEquifax':{
                    name:  'GetEquifax',
                    path: 'api/Equifax'
                },
                'methodGetFiltros':{
                    name:  'GetFiltros',
                    path: 'api/listar_maestro'
                },
                'methodGetOpcion':{
                    name:  'GetOpcion',
                    path: 'api/opcion?usuario={usuario}'
                },
                'methodobtenerLog':{
                    name:  'obtenerLog',
                    path: 'api/log'
                },
            }
        }
    })



     module.factory("proxyAviso", ['oimProxyAtencionsiniestrosagricola', 'httpData', function(oimProxyAtencionsiniestrosagricola, httpData){
        return {
                'ReaperturarAviso' : function(codCampania, codAviso, param, showSpin){
                    return httpData['patch'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/avisos/{codCampania}/{codAviso}',
                                                    { 'codCampania':codCampania  ,'codAviso':codAviso   }),
                                         param, undefined, showSpin)
                },
                'GetReapertura' : function(codCampania, codAviso, showSpin){
                    return httpData['get'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/avisos/{codCampania}/{codAviso}',
                                                    { 'codCampania':codCampania  ,'codAviso':codAviso   }),
                                         undefined, undefined, showSpin)
                },
                'GetListaAvisosExcel' : function(param, showSpin){
                    return httpData['post'](oimProxyAtencionsiniestrosagricola.endpoint + 'api/avisos/ListaExcel',
                                         param, undefined, showSpin)
                },
                'DescargaArchivo' : function(param, showSpin){
                    return httpData['post'](oimProxyAtencionsiniestrosagricola.endpoint + 'api/avisos/Archivo/Descargar',
                                         param, undefined, showSpin)
                },
                'AjustarAviso' : function(codCampania, codAviso, param, showSpin){
                    return httpData['post'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/avisos/{codCampania}/{codAviso}',
                                                    { 'codCampania':codCampania  ,'codAviso':codAviso   }),
                                         param, undefined, showSpin)
                },
                'NewAviso' : function(param, showSpin){
                    return httpData['post'](oimProxyAtencionsiniestrosagricola.endpoint + 'api/avisos/nuevo',
                                         param, undefined, showSpin)
                },
                'ListaAvisos' : function(param, showSpin){
                    return httpData['post'](oimProxyAtencionsiniestrosagricola.endpoint + 'api/avisos/listar',
                                         param, undefined, showSpin)
                },
                'DetalleAviso' : function(param, showSpin){
                    return httpData['post'](oimProxyAtencionsiniestrosagricola.endpoint + 'api/avisos/detalle',
                                         param, undefined, showSpin)
                },
                'DetalleAjuste' : function(param, showSpin){
                    return httpData['post'](oimProxyAtencionsiniestrosagricola.endpoint + 'api/avisos/ajuste/detalle',
                                         param, undefined, showSpin)
                },
                'GetSuperficieAsegurada' : function(param, showSpin){
                    return httpData['post'](oimProxyAtencionsiniestrosagricola.endpoint + 'api/avisos/SupAseg',
                                         param, undefined, showSpin)
                },
                'ListaBandejaReportes' : function(codAviso, codCampania, fecIni, fecFin, codCultivo, codRegion, codProvincia, codDistrito, codSectorEst, codEstado, pagina, penPadron, usuarioSistema, showSpin){
                    return httpData['get'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/avisos/tipo?codAviso={codAviso}&codCampania={codCampania}&fecIni={fecIni}&fecFin={fecFin}&codCultivo={codCultivo}&codRegion={codRegion}&codProvincia={codProvincia}&codDistrito={codDistrito}&codSectorEst={codSectorEst}&codEstado={codEstado}&pagina={pagina}&penPadron={penPadron}&usuarioSistema={usuarioSistema}',
                                                    { 'codAviso':codAviso  ,'codCampania':codCampania  ,'fecIni':fecIni  ,'fecFin':fecFin  ,'codCultivo':codCultivo  ,'codRegion':codRegion  ,'codProvincia':codProvincia  ,'codDistrito':codDistrito  ,'codSectorEst':codSectorEst  ,'codEstado':codEstado  ,'pagina':pagina  ,'penPadron':penPadron  ,'usuarioSistema':usuarioSistema   }),
                                         undefined, undefined, showSpin)
                },
                'ObtenerPadronBeneficiarios' : function(codAviso, codCampania, showSpin){
                    return httpData['get'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/avisos/beneficiarios/campania/{codCampania}/aviso/{codAviso}',
                                                    { 'codAviso':codAviso  ,'codCampania':codCampania   }),
                                         undefined, undefined, showSpin)
                },
                'GetSiscas' : function(campania, codigoAviso, fechaDesde, fechaHasta, estado, numeroPagina, order, tipoConsulta, showSpin){
                    return httpData['get'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/avisos/origen?campania={campania}&codigoAviso={codigoAviso}&fechaDesde={fechaDesde}&fechaHasta={fechaHasta}&estado={estado}&numeroPagina={numeroPagina}&order={order}&tipoConsulta={tipoConsulta}',
                                                    { 'campania':campania  ,'codigoAviso':codigoAviso  ,'fechaDesde':fechaDesde  ,'fechaHasta':fechaHasta  ,'estado':estado  ,'numeroPagina':numeroPagina  ,'order':order  ,'tipoConsulta':tipoConsulta   }),
                                         undefined, undefined, showSpin)
                },
                'generarArchivo' : function(archivo, showSpin){
                    return httpData['post'](oimProxyAtencionsiniestrosagricola.endpoint + 'api/default/Aviso',
                                         archivo, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCampania", ['oimProxyAtencionsiniestrosagricola', 'httpData', function(oimProxyAtencionsiniestrosagricola, httpData){
        return {
                'GetCampaniaActiva' : function(param, showSpin){
                    return httpData['post'](oimProxyAtencionsiniestrosagricola.endpoint + 'api/Campanias/getActiva',
                                         param, undefined, showSpin)
                },
                'InsertCampania' : function(param, showSpin){
                    return httpData['post'](oimProxyAtencionsiniestrosagricola.endpoint + 'api/Campanias',
                                         param, undefined, showSpin)
                },
                'GetCampania' : function(idCampania, showSpin){
                    return httpData['get'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/Campanias/{idCampania}',
                                                    { 'idCampania':idCampania   }),
                                         undefined, undefined, showSpin)
                },
                'GetCampanias' : function( showSpin){
                    return httpData['get'](oimProxyAtencionsiniestrosagricola.endpoint + 'api/Campanias',
                                         undefined, undefined, showSpin)
                },
                'EditCampania' : function(idCampania, param, showSpin){
                    return httpData['patch'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/Campanias/{idCampania}',
                                                    { 'idCampania':idCampania   }),
                                         param, undefined, showSpin)
                },
                'GetUsuariosCampania' : function(idCampania, showSpin){
                    return httpData['get'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/Campanias/{idCampania}/usuarios',
                                                    { 'idCampania':idCampania   }),
                                         undefined, undefined, showSpin)
                },
                'InsertUsuarioCampania' : function(idCampania, param, showSpin){
                    return httpData['post'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/Campanias/{idCampania}/usuarios',
                                                    { 'idCampania':idCampania   }),
                                         param, undefined, showSpin)
                },
                'editUsuarioCampania' : function(idCampania, param, showSpin){
                    return httpData['patch'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/Campanias/{idCampania}/usuarios',
                                                    { 'idCampania':idCampania   }),
                                         param, undefined, showSpin)
                },
                'deleteUsuarioCampania' : function(idCampania, idUsuario, showSpin){
                    return httpData['delete'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/Campanias/{idCampania}/usuarios/{idUsuario}',
                                                    { 'idCampania':idCampania  ,'idUsuario':idUsuario   }),
                                         undefined, undefined, showSpin)
                },
                'GetGrupoCultivo' : function(idCampania, showSpin){
                    return httpData['get'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/Campanias/{idCampania}/gruposCultivo',
                                                    { 'idCampania':idCampania   }),
                                         undefined, undefined, showSpin)
                },
                'InsertGrupCultivo' : function(idCampania, param, showSpin){
                    return httpData['post'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/Campanias/{idCampania}/gruposCultivo',
                                                    { 'idCampania':idCampania   }),
                                         param, undefined, showSpin)
                },
                'EditarGrupoCultivo' : function(idCampania, param, showSpin){
                    return httpData['patch'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/Campanias/{idCampania}/gruposCultivo',
                                                    { 'idCampania':idCampania   }),
                                         param, undefined, showSpin)
                },
                'GetCultivo' : function(idCampania, idGrupoCultivo, showSpin){
                    return httpData['get'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/Campanias/{idCampania}/gruposCultivo/{idGrupoCultivo}/cultivos',
                                                    { 'idCampania':idCampania  ,'idGrupoCultivo':idGrupoCultivo   }),
                                         undefined, undefined, showSpin)
                },
                'InsertCultivo' : function(idCampania, idGrupoCultivo, param, showSpin){
                    return httpData['post'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/Campanias/{idCampania}/gruposCultivo/{idGrupoCultivo}/cultivos',
                                                    { 'idCampania':idCampania  ,'idGrupoCultivo':idGrupoCultivo   }),
                                         param, undefined, showSpin)
                },
                'EditarCultivo' : function(idCampania, idGrupoCultivo, param, showSpin){
                    return httpData['patch'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/Campanias/{idCampania}/gruposCultivo/{idGrupoCultivo}/cultivos',
                                                    { 'idCampania':idCampania  ,'idGrupoCultivo':idGrupoCultivo   }),
                                         param, undefined, showSpin)
                },
                'GetSectorEstad' : function(idCampania, showSpin){
                    return httpData['get'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/Campanias/{idCampania}/sectoresEstadisticos',
                                                    { 'idCampania':idCampania   }),
                                         undefined, undefined, showSpin)
                },
                'ProcesarSectorEstad' : function(idCampania, param, showSpin){
                    return httpData['post'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/Campanias/{idCampania}/sectoresEstadisticos',
                                                    { 'idCampania':idCampania   }),
                                         param, undefined, showSpin)
                },
                'GetCultivoSector' : function(idCampania, showSpin){
                    return httpData['get'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/Campanias/{idCampania}/cultivoSectoresEstadisticos',
                                                    { 'idCampania':idCampania   }),
                                         undefined, undefined, showSpin)
                },
                'ProcesarCultivoSector' : function(idCampania, param, showSpin){
                    return httpData['post'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/Campanias/{idCampania}/cultivoSectoresEstadisticos',
                                                    { 'idCampania':idCampania   }),
                                         param, undefined, showSpin)
                },
                'GetgrupoParametro' : function(idCampania, showSpin){
                    return httpData['get'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/Campanias/{idCampania}/gruposParametro',
                                                    { 'idCampania':idCampania   }),
                                         undefined, undefined, showSpin)
                },
                'InsertGrupParametro' : function(idCampania, param, showSpin){
                    return httpData['post'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/Campanias/{idCampania}/gruposParametro',
                                                    { 'idCampania':idCampania   }),
                                         param, undefined, showSpin)
                },
                'HabilitarGrupoParam' : function(idCampania, param, showSpin){
                    return httpData['patch'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/Campanias/{idCampania}/gruposParametro',
                                                    { 'idCampania':idCampania   }),
                                         param, undefined, showSpin)
                },
                'GetParametro' : function(idCampania, idGrupoParametro, showSpin){
                    return httpData['get'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/Campanias/{idCampania}/gruposParametro/{idGrupoParametro}/parametros',
                                                    { 'idCampania':idCampania  ,'idGrupoParametro':idGrupoParametro   }),
                                         undefined, undefined, showSpin)
                },
                'InsertParametro' : function(idCampania, idGrupoParametro, param, showSpin){
                    return httpData['post'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/Campanias/{idCampania}/gruposParametro/{idGrupoParametro}/parametros',
                                                    { 'idCampania':idCampania  ,'idGrupoParametro':idGrupoParametro   }),
                                         param, undefined, showSpin)
                },
                'EditarParametro' : function(idCampania, idGrupoParametro, param, showSpin){
                    return httpData['patch'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/Campanias/{idCampania}/gruposParametro/{idGrupoParametro}/parametros',
                                                    { 'idCampania':idCampania  ,'idGrupoParametro':idGrupoParametro   }),
                                         param, undefined, showSpin)
                },
                'ValidarPadron' : function(idCampania, param, showSpin){
                    return httpData['post'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/Campanias/{idCampania}/beneficiarios',
                                                    { 'idCampania':idCampania   }),
                                         param, undefined, showSpin)
                },
                'generarArchivo' : function(archivo, showSpin){
                    return httpData['post'](oimProxyAtencionsiniestrosagricola.endpoint + 'api/default/Campania',
                                         archivo, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyContacto", ['oimProxyAtencionsiniestrosagricola', 'httpData', function(oimProxyAtencionsiniestrosagricola, httpData){
        return {
                'GetContacto' : function(nombre, showSpin){
                    return httpData['get'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/contacto/contacto?nombre={nombre}',
                                                    { 'nombre':nombre   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyAgricolaSecurity", ['oimProxyAtencionsiniestrosagricola', 'httpData', function(oimProxyAtencionsiniestrosagricola, httpData){
        return {
                'GetRole' : function( showSpin){
                    return httpData['get'](oimProxyAtencionsiniestrosagricola.endpoint + 'api/security/role',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyLookup", ['oimProxyAtencionsiniestrosagricola', 'httpData', function(oimProxyAtencionsiniestrosagricola, httpData){
        return {
                'GetVersion' : function( showSpin){
                    return httpData['get'](oimProxyAtencionsiniestrosagricola.endpoint + 'api/version',
                                         undefined, undefined, showSpin)
                },
                'GetEquifax' : function(param, showSpin){
                    return httpData['post'](oimProxyAtencionsiniestrosagricola.endpoint + 'api/Equifax',
                                         param, undefined, showSpin)
                },
                'GetFiltros' : function(param, showSpin){
                    return httpData['post'](oimProxyAtencionsiniestrosagricola.endpoint + 'api/listar_maestro',
                                         param, undefined, showSpin)
                },
                'GetOpcion' : function(usuario, showSpin){
                    return httpData['get'](oimProxyAtencionsiniestrosagricola.endpoint + helper.formatNamed('api/opcion?usuario={usuario}',
                                                    { 'usuario':usuario   }),
                                         undefined, undefined, showSpin)
                },
                'obtenerLog' : function( showSpin){
                    return httpData['get'](oimProxyAtencionsiniestrosagricola.endpoint + 'api/log',
                                         undefined, undefined, showSpin)
                }
        };
     }]);
});
