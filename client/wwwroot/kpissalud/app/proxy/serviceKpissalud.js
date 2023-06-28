/* eslint-disable */
(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants'], function(angular, constants){
    var module = angular.module("oim.proxyService.kpissalud", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxyKpissalud', {
        endpoint: constants.system.api.endpoints['kpissalud'],
        controllerPanel: {
            actions : {
                'methodGetReportWeb':{
                    name:  'GetReportWeb',
                    path: 'api/panel/reportweb/{codeReport}?sede={sede}&store={store}&toDate={toDate}&fromDate={fromDate}&movementType={movementType}&movementCode={movementCode}'
                },
                'methodGetReport':{
                    name:  'GetReport',
                    path: 'api/panel/report/{codeReport}?sede={sede}&typePeriod={typePeriod}&specialty={specialty}&toDate={toDate}&fromDate={fromDate}&detailType={detailType}&codeFinancial={codeFinancial}&contractNumber={contractNumber}&providers={providers}'
                },
                'methodexport':{
                    name:  'export',
                    path: 'api/panel/$downloadweb/{codeReport}'
                },
                'methodexport':{
                    name:  'export',
                    path: 'api/panel/$download/{codeReport}?sede={sede}&typePeriod={typePeriod}&specialty={specialty}&toDate={toDate}&fromDate={fromDate}&detailType={detailType}&codeFinancial={codeFinancial}&contractNumber={contractNumber}&providers={providers}'
                },
            }
        },
        controllerKpiCartaGarantiaApi: {
            actions : {
                'methodPostNumeroCartaGarantiaRechazada':{
                    name:  'PostNumeroCartaGarantiaRechazada',
                    path: 'api/kpicartagarantia/numeroCartaGarantiaRechazadaPost'
                },
                'methodPostNumeroCartaGarantiaSolicitada':{
                    name:  'PostNumeroCartaGarantiaSolicitada',
                    path: 'api/kpicartagarantia/numeroCartaGarantiaSolicitadaPost'
                },
                'methodPostImporteTotalReservas':{
                    name:  'PostImporteTotalReservas',
                    path: 'api/kpicartagarantia/importeTotalReservasPost'
                },
                'methodPostNumeroTotalCartasGarantia':{
                    name:  'PostNumeroTotalCartasGarantia',
                    path: 'api/kpicartagarantia/numeroTotalCartasGarantiaPost'
                },
                'methodPostImporteTotalCartasGarantia':{
                    name:  'PostImporteTotalCartasGarantia',
                    path: 'api/kpicartagarantia/importeTotalCartasGarantiaPost'
                },
                'methodPostMotivosRechazo':{
                    name:  'PostMotivosRechazo',
                    path: 'api/kpicartagarantia/motivosRechazoPost'
                },
                'methodPostDiagnosticoAprobado':{
                    name:  'PostDiagnosticoAprobado',
                    path: 'api/kpicartagarantia/diagnosticoAprobadoPost'
                },
                'methodPostAhorroAuditoriaMedica':{
                    name:  'PostAhorroAuditoriaMedica',
                    path: 'api/kpicartagarantia/ahorroAuditoriaMedicaPost'
                },
                'methodPostAhorroSolicitudRechazada':{
                    name:  'PostAhorroSolicitudRechazada',
                    path: 'api/kpicartagarantia/ahorroSolicitudRechazadaPost'
                },
                'methodPostCoberturaAprobado':{
                    name:  'PostCoberturaAprobado',
                    path: 'api/kpicartagarantia/coberturaAprobadoPost'
                },
            }
        },
        controllerTestApi: {
            actions : {
                'methodGetPruebas':{
                    name:  'GetPruebas',
                    path: 'api/pruebas/testGet?param1={param1}&param2={param2}'
                },
                'methodPostPruebas':{
                    name:  'PostPruebas',
                    path: 'api/pruebas/testPost'
                },
            }
        },
        controllerKpiFiltroApi: {
            actions : {
                'methodPostClinica':{
                    name:  'PostClinica',
                    path: 'api/lista/clinicaPost'
                },
                'methodPostSede':{
                    name:  'PostSede',
                    path: 'api/lista/sedePost'
                },
                'methodPostDepartamento':{
                    name:  'PostDepartamento',
                    path: 'api/lista/departamentoPost'
                },
                'methodPostProvincia':{
                    name:  'PostProvincia',
                    path: 'api/lista/provinciaPost'
                },
                'methodPostDistrito':{
                    name:  'PostDistrito',
                    path: 'api/lista/distritoPost'
                },
                'methodPostGrupoEconomico':{
                    name:  'PostGrupoEconomico',
                    path: 'api/lista/grupoEconomicoPost'
                },
                'methodPostContratante':{
                    name:  'PostContratante',
                    path: 'api/lista/contratantePost'
                },
                'methodPostDiagnostico':{
                    name:  'PostDiagnostico',
                    path: 'api/lista/diagnosticoPost'
                },
                'methodPostEjecutivo':{
                    name:  'PostEjecutivo',
                    path: 'api/lista/ejecutivoPost'
                },
                'methodPostAuditorMedico':{
                    name:  'PostAuditorMedico',
                    path: 'api/lista/auditorMedicoPost'
                },
                'methodPostIntermediario':{
                    name:  'PostIntermediario',
                    path: 'api/lista/intermediarioPost'
                },
                'methodPostRamo':{
                    name:  'PostRamo',
                    path: 'api/lista/ramoPost'
                },
                'methodPostProducto':{
                    name:  'PostProducto',
                    path: 'api/lista/productoPost'
                },
                'methodPostSubProducto':{
                    name:  'PostSubProducto',
                    path: 'api/lista/subProductoPost'
                },
                'methodPostContrato':{
                    name:  'PostContrato',
                    path: 'api/lista/contratoPost'
                },
                'methodPostSubContrato':{
                    name:  'PostSubContrato',
                    path: 'api/lista/subContratoPost'
                },
                'methodPostCobertura':{
                    name:  'PostCobertura',
                    path: 'api/lista/coberturaPost'
                },
            }
        },
        controllerSecurity: {
            actions : {
                'methodGetOpcion':{
                    name:  'GetOpcion',
                    path: 'api/lookup/opcion'
                },
            }
        },
        controllerKpiSiniestroApi: {
            actions : {
                'methodPostTiempoAtencionSiniestroPagado':{
                    name:  'PostTiempoAtencionSiniestroPagado',
                    path: 'api/kpisiniestro/tiempoAtencionSiniestroPagadoPost'
                },
                'methodPostNumeroTotalSiniestroPagado':{
                    name:  'PostNumeroTotalSiniestroPagado',
                    path: 'api/kpisiniestro/numeroTotalSiniestroPagadoPost'
                },
                'methodPostImporteTotalSiniestroPagado':{
                    name:  'PostImporteTotalSiniestroPagado',
                    path: 'api/kpisiniestro/importeTotalSiniestroPagadoPost'
                },
                'methodPostCostoPaciente':{
                    name:  'PostCostoPaciente',
                    path: 'api/kpisiniestro/costoPacienteSiniestroLiquidadoPost'
                },
                'methodPostCostoPromedioAtencionPaciente':{
                    name:  'PostCostoPromedioAtencionPaciente',
                    path: 'api/kpisiniestro/costoPromedioAtencionPacientePost'
                },
                'methodPostImporteTasaHospitalizacion':{
                    name:  'PostImporteTasaHospitalizacion',
                    path: 'api/kpisiniestro/importeTasaHospitalizacionPost'
                },
                'methodPostSoatgastoCobertura':{
                    name:  'PostSoatgastoCobertura',
                    path: 'api/kpisiniestro/soatGastoCoberturaPost'
                },
                'methodPostSoatGastoProveedor':{
                    name:  'PostSoatGastoProveedor',
                    path: 'api/kpisiniestro/soatGastoProveedorPost'
                },
                'methodPostSoatGastosUbicacionGeograficaDetallada':{
                    name:  'PostSoatGastosUbicacionGeograficaDetallada',
                    path: 'api/kpisiniestro/soatGastosUbicacionGeograficaDetalladaPost'
                },
                'methodPostSoatGastoUbicacionGeograficaGeneral':{
                    name:  'PostSoatGastoUbicacionGeograficaGeneral',
                    path: 'api/kpisiniestro/soatGastoUbicacionGeograficaGeneralPost'
                },
                'methodPostSoatGastoTipoAccidente':{
                    name:  'PostSoatGastoTipoAccidente',
                    path: 'api/kpisiniestro/soatGastoTipoAccidentePost'
                },
            }
        },
        controllerKpiConfiguracionApi: {
            actions : {
                'methodPostObtenerConfiguracionDashboard':{
                    name:  'PostObtenerConfiguracionDashboard',
                    path: 'api/kpiconfiguracion/obtenerConfiguracionDashboardPost'
                },
                'methodPostActualizarConfiguracion':{
                    name:  'PostActualizarConfiguracion',
                    path: 'api/kpiconfiguracion/actualizarConfiguracionPost'
                },
            }
        },
        controllerLookup: {
            actions : {
                'methodGetLookups':{
                    name:  'GetLookups',
                    path: 'api/lookup/lookups'
                },
                'methodGetSedes':{
                    name:  'GetSedes',
                    path: 'api/lookup/sedes'
                },
                'methodGetPeriodTypes':{
                    name:  'GetPeriodTypes',
                    path: 'api/lookup/periodtypes'
                },
                'methodGetStores':{
                    name:  'GetStores',
                    path: 'api/lookup/stores/{sede}'
                },
                'methodGetMovements':{
                    name:  'GetMovements',
                    path: 'api/lookup/movements/{tipo}'
                },
                'methodGetEspecialty':{
                    name:  'GetEspecialty',
                    path: 'api/lookup/especialities/{sede}'
                },
                'methodGetDetailTypes':{
                    name:  'GetDetailTypes',
                    path: 'api/lookup/detailtypes'
                },
                'methodGetFinancials':{
                    name:  'GetFinancials',
                    path: 'api/lookup/financials'
                },
                'methodGetEndContract':{
                    name:  'GetEndContract',
                    path: 'api/lookup/endcontracs/{financial}'
                },
            }
        }
    })



     module.factory("proxyPanel", ['oimProxyKpissalud', 'httpData', function(oimProxyKpissalud, httpData){
        return {
                'GetReportWeb' : function(codeReport, sede, store, toDate, fromDate, movementType, movementCode, showSpin){
                    return httpData['get'](oimProxyKpissalud.endpoint + helper.formatNamed('api/panel/reportweb/{codeReport}?sede={sede}&store={store}&toDate={toDate}&fromDate={fromDate}&movementType={movementType}&movementCode={movementCode}',
                                                    { 'codeReport':codeReport  ,'sede':sede  ,'store':store  ,'toDate':toDate  ,'fromDate':fromDate  ,'movementType':movementType  ,'movementCode':movementCode   }),
                                         undefined, undefined, showSpin)
                },
                'GetReport' : function(codeReport, sede, typePeriod, specialty, toDate, fromDate, detailType, codeFinancial, contractNumber, providers, showSpin){
                    return httpData['get'](oimProxyKpissalud.endpoint + helper.formatNamed('api/panel/report/{codeReport}?sede={sede}&typePeriod={typePeriod}&specialty={specialty}&toDate={toDate}&fromDate={fromDate}&detailType={detailType}&codeFinancial={codeFinancial}&contractNumber={contractNumber}&providers={providers}',
                                                    { 'codeReport':codeReport  ,'sede':sede  ,'typePeriod':typePeriod  ,'specialty':specialty  ,'toDate':toDate  ,'fromDate':fromDate  ,'detailType':detailType  ,'codeFinancial':codeFinancial  ,'contractNumber':contractNumber  ,'providers':providers   }),
                                         undefined, undefined, showSpin)
                },
                'export' : function(codeReport, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + helper.formatNamed('api/panel/$downloadweb/{codeReport}',
                                                    { 'codeReport':codeReport   }),
                                         undefined, undefined, showSpin)
                },
                'export' : function(codeReport, sede, typePeriod, specialty, toDate, fromDate, detailType, codeFinancial, contractNumber, providers, showSpin){
                    return httpData['get'](oimProxyKpissalud.endpoint + helper.formatNamed('api/panel/$download/{codeReport}?sede={sede}&typePeriod={typePeriod}&specialty={specialty}&toDate={toDate}&fromDate={fromDate}&detailType={detailType}&codeFinancial={codeFinancial}&contractNumber={contractNumber}&providers={providers}',
                                                    { 'codeReport':codeReport  ,'sede':sede  ,'typePeriod':typePeriod  ,'specialty':specialty  ,'toDate':toDate  ,'fromDate':fromDate  ,'detailType':detailType  ,'codeFinancial':codeFinancial  ,'contractNumber':contractNumber  ,'providers':providers   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyKpiCartaGarantiaApi", ['oimProxyKpissalud', 'httpData', function(oimProxyKpissalud, httpData){
        return {
                'PostNumeroCartaGarantiaRechazada' : function(filter, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpicartagarantia/numeroCartaGarantiaRechazadaPost',
                                         filter, undefined, showSpin)
                },
                'PostNumeroCartaGarantiaSolicitada' : function(filter, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpicartagarantia/numeroCartaGarantiaSolicitadaPost',
                                         filter, undefined, showSpin)
                },
                'PostImporteTotalReservas' : function(filter, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpicartagarantia/importeTotalReservasPost',
                                         filter, undefined, showSpin)
                },
                'PostNumeroTotalCartasGarantia' : function(filter, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpicartagarantia/numeroTotalCartasGarantiaPost',
                                         filter, undefined, showSpin)
                },
                'PostImporteTotalCartasGarantia' : function(filter, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpicartagarantia/importeTotalCartasGarantiaPost',
                                         filter, undefined, showSpin)
                },
                'PostMotivosRechazo' : function(filter, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpicartagarantia/motivosRechazoPost',
                                         filter, undefined, showSpin)
                },
                'PostDiagnosticoAprobado' : function(filter, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpicartagarantia/diagnosticoAprobadoPost',
                                         filter, undefined, showSpin)
                },
                'PostAhorroAuditoriaMedica' : function(filter, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpicartagarantia/ahorroAuditoriaMedicaPost',
                                         filter, undefined, showSpin)
                },
                'PostAhorroSolicitudRechazada' : function(filter, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpicartagarantia/ahorroSolicitudRechazadaPost',
                                         filter, undefined, showSpin)
                },
                'PostCoberturaAprobado' : function(filter, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpicartagarantia/coberturaAprobadoPost',
                                         filter, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyTestApi", ['oimProxyKpissalud', 'httpData', function(oimProxyKpissalud, httpData){
        return {
                'GetPruebas' : function(param1, param2, showSpin){
                    return httpData['get'](oimProxyKpissalud.endpoint + helper.formatNamed('api/pruebas/testGet?param1={param1}&param2={param2}',
                                                    { 'param1':param1  ,'param2':param2   }),
                                         undefined, undefined, showSpin)
                },
                'PostPruebas' : function( showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/pruebas/testPost',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyKpiFiltroApi", ['oimProxyKpissalud', 'httpData', function(oimProxyKpissalud, httpData){
        return {
                'PostClinica' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/clinicaPost',
                                         param, undefined, showSpin)
                },
                'PostSede' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/sedePost',
                                         param, undefined, showSpin)
                },
                'PostDepartamento' : function( showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/departamentoPost',
                                         undefined, undefined, showSpin)
                },
                'PostProvincia' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/provinciaPost',
                                         param, undefined, showSpin)
                },
                'PostDistrito' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/distritoPost',
                                         param, undefined, showSpin)
                },
                'PostGrupoEconomico' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/grupoEconomicoPost',
                                         param, undefined, showSpin)
                },
                'PostContratante' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/contratantePost',
                                         param, undefined, showSpin)
                },
                'PostDiagnostico' : function( showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/diagnosticoPost',
                                         undefined, undefined, showSpin)
                },
                'PostEjecutivo' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/ejecutivoPost',
                                         param, undefined, showSpin)
                },
                'PostAuditorMedico' : function( showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/auditorMedicoPost',
                                         undefined, undefined, showSpin)
                },
                'PostIntermediario' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/intermediarioPost',
                                         param, undefined, showSpin)
                },
                'PostRamo' : function( showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/ramoPost',
                                         undefined, undefined, showSpin)
                },
                'PostProducto' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/productoPost',
                                         param, undefined, showSpin)
                },
                'PostSubProducto' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/subProductoPost',
                                         param, undefined, showSpin)
                },
                'PostContrato' : function( showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/contratoPost',
                                         undefined, undefined, showSpin)
                },
                'PostSubContrato' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/subContratoPost',
                                         param, undefined, showSpin)
                },
                'PostCobertura' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/coberturaPost',
                                         param, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySecurity", ['oimProxyKpissalud', 'httpData', function(oimProxyKpissalud, httpData){
        return {
                'GetOpcion' : function( showSpin){
                    return httpData['get'](oimProxyKpissalud.endpoint + 'api/lookup/opcion',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyKpiSiniestroApi", ['oimProxyKpissalud', 'httpData', function(oimProxyKpissalud, httpData){
        return {
                'PostTiempoAtencionSiniestroPagado' : function(filter, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpisiniestro/tiempoAtencionSiniestroPagadoPost',
                                         filter, undefined, showSpin)
                },
                'PostNumeroTotalSiniestroPagado' : function(filter, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpisiniestro/numeroTotalSiniestroPagadoPost',
                                         filter, undefined, showSpin)
                },
                'PostImporteTotalSiniestroPagado' : function(filter, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpisiniestro/importeTotalSiniestroPagadoPost',
                                         filter, undefined, showSpin)
                },
                'PostCostoPaciente' : function(filter, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpisiniestro/costoPacienteSiniestroLiquidadoPost',
                                         filter, undefined, showSpin)
                },
                'PostCostoPromedioAtencionPaciente' : function(filter, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpisiniestro/costoPromedioAtencionPacientePost',
                                         filter, undefined, showSpin)
                },
                'PostImporteTasaHospitalizacion' : function(filter, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpisiniestro/importeTasaHospitalizacionPost',
                                         filter, undefined, showSpin)
                },
                'PostSoatgastoCobertura' : function(filter, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpisiniestro/soatGastoCoberturaPost',
                                         filter, undefined, showSpin)
                },
                'PostSoatGastoProveedor' : function(filter, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpisiniestro/soatGastoProveedorPost',
                                         filter, undefined, showSpin)
                },
                'PostSoatGastosUbicacionGeograficaDetallada' : function(filter, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpisiniestro/soatGastosUbicacionGeograficaDetalladaPost',
                                         filter, undefined, showSpin)
                },
                'PostSoatGastoUbicacionGeograficaGeneral' : function(filter, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpisiniestro/soatGastoUbicacionGeograficaGeneralPost',
                                         filter, undefined, showSpin)
                },
                'PostSoatGastoTipoAccidente' : function(filter, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpisiniestro/soatGastoTipoAccidentePost',
                                         filter, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyKpiConfiguracionApi", ['oimProxyKpissalud', 'httpData', function(oimProxyKpissalud, httpData){
        return {
                'PostObtenerConfiguracionDashboard' : function( showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpiconfiguracion/obtenerConfiguracionDashboardPost',
                                         undefined, undefined, showSpin)
                },
                'PostActualizarConfiguracion' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpiconfiguracion/actualizarConfiguracionPost',
                                         param, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyLookup", ['oimProxyKpissalud', 'httpData', function(oimProxyKpissalud, httpData){
        return {
                'GetLookups' : function( showSpin){
                    return httpData['get'](oimProxyKpissalud.endpoint + 'api/lookup/lookups',
                                         undefined, undefined, showSpin)
                },
                'GetSedes' : function( showSpin){
                    return httpData['get'](oimProxyKpissalud.endpoint + 'api/lookup/sedes',
                                         undefined, undefined, showSpin)
                },
                'GetPeriodTypes' : function( showSpin){
                    return httpData['get'](oimProxyKpissalud.endpoint + 'api/lookup/periodtypes',
                                         undefined, undefined, showSpin)
                },
                'GetStores' : function(sede, showSpin){
                    return httpData['get'](oimProxyKpissalud.endpoint + helper.formatNamed('api/lookup/stores/{sede}',
                                                    { 'sede':sede   }),
                                         undefined, undefined, showSpin)
                },
                'GetMovements' : function(tipo, showSpin){
                    return httpData['get'](oimProxyKpissalud.endpoint + helper.formatNamed('api/lookup/movements/{tipo}',
                                                    { 'tipo':tipo   }),
                                         undefined, undefined, showSpin)
                },
                'GetEspecialty' : function(sede, showSpin){
                    return httpData['get'](oimProxyKpissalud.endpoint + helper.formatNamed('api/lookup/especialities/{sede}',
                                                    { 'sede':sede   }),
                                         undefined, undefined, showSpin)
                },
                'GetDetailTypes' : function( showSpin){
                    return httpData['get'](oimProxyKpissalud.endpoint + 'api/lookup/detailtypes',
                                         undefined, undefined, showSpin)
                },
                'GetFinancials' : function( showSpin){
                    return httpData['get'](oimProxyKpissalud.endpoint + 'api/lookup/financials',
                                         undefined, undefined, showSpin)
                },
                'GetEndContract' : function(financial, showSpin){
                    return httpData['get'](oimProxyKpissalud.endpoint + helper.formatNamed('api/lookup/endcontracs/{financial}',
                                                    { 'financial':financial   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);
});
