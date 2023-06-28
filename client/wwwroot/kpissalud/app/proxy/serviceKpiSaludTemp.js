(function($root, deps, action){
    define(deps, action)
})(this, ['angular'], function(angular){
    var module = angular.module("oim.proxyService.kpissalud", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxyKpissalud', {
        endpoint: 'http://localhost:60067/',
        controllerKpiSiniestro: {
            actions : {
                'methodKpiTiempoAtencionSiniestro':{
                    name: 'KpiTiempoAtencionSiniestro',
                    path: 'api/kpisiniestro/tiempoAtencionSiniestroPagadoPost'
                },
                'methodKpiNumeroTotalSiniestro':{
                    name: 'KpiNumeroTotalSiniestro',
                    path: 'api/kpisiniestro/numeroTotalSiniestroPagadoPost'
                },
                'methodKpiImporteTotalSiniestro':{
                    name: 'KpiImporteTotalSiniestro',
                    path: 'api/kpisiniestro/importeTotalSiniestroPagadoPost'
                },
                'methodKpiCostoPromedioAtencionPaciente':{
                    name: 'KpiCostoPromedioAtencionPaciente',
                    path: 'api/kpisiniestro/costoPromedioAtencionPacientePost'
                },
                'methodKpiImporteTasaHospitalizacion':{
                    name: 'KpiImporteTasaHospitalizacion',
                    path: 'api/kpisiniestro/importeTasaHospitalizacionPost'
                },
                'methodKpiCostoPacienteMes':{
                    name: 'KpiCostoPacienteMes',
                    path: 'api/kpisiniestro/costoPacienteSiniestroLiquidadoPost'
                },
                'methodKpiGastosProveedor':{
                    name: 'KpiGastosProveedor',
                    path: 'api/kpisiniestro/soatGastoProveedorPost'
                },
                'methodKpiGastosCobertura':{
                    name: 'KpiGastosCobertura',
                    path: 'api/kpisiniestro/soatGastoCoberturaPost'
                },
                'methodKpiGastosTipoAccidente':{
                    name: 'KpiGastosTipoAccidente',
                    path: 'api/kpisiniestro/soatGastoTipoAccidentePost'
                },
                'methodKpiGastosUbicacionGeograficaDetallada':{
                    name: 'KpiGastosUbicacionGeograficaDetallada',
                    path: 'api/kpisiniestro/soatGastosUbicacionGeograficaDetalladaPost'
                },
                'methodKpiGastosUbicacionGeograficaGeneral':{
                    name: 'KpiGastosUbicacionGeograficaGeneral',
                    path: 'api/kpisiniestro/soatGastoUbicacionGeograficaGeneralPost'
                }
            }
        },
        controllerKpiCartasGarantia: {
            actions: {
                'methodKpiImporteTotalReservas':{
                    name: 'KpiImporteTotalReservas',
                    path: 'api/kpicartagarantia/importeTotalReservasPost'
                },
                'methodKpiNumeroCartasGarantiaSolicitadas':{
                    name: 'KpiNumeroCartasGarantiaSolicitadas',
                    path: 'api/kpicartagarantia/numeroCartaGarantiaSolicitadaPost'
                },
                'methodKpiNumeroCartasGarantiaRechazadas':{
                    name: 'KpiNumeroCartasGarantiaRechazadas',
                    path: 'api/kpicartagarantia/numeroCartaGarantiaRechazadaPost'
                },
                'methodKpiNumeroTotalCartasGarantia':{
                    name: 'KpiNumeroTotalCartasGarantia',
                    path: 'api/kpicartagarantia/numeroTotalCartasGarantiaPost'
                },
                'methodKpiImporteTotalCartasGarantia':{
                    name: 'KpiImporteTotalCartasGarantia',
                    path: 'api/kpicartagarantia/importeTotalCartasGarantiaPost'
                },
                'methodKpiAhorroSolicitudesRechazadas':{
                    name: 'KpiAhorroSolicitudesRechazadas',
                    path: 'api/kpicartagarantia/ahorroSolicitudRechazadaPost'
                },
                'methodKpiAhorroAuditoriaMedica':{
                    name: 'KpiAhorroAuditoriaMedica',
                    path: 'api/kpicartagarantia/ahorroAuditoriaMedicaPost'
                },
                'methodKpiDiagnosticoAprobado':{
                    name: 'KpiDiagnosticoAprobado',
                    path: 'api/kpicartagarantia/diagnosticoAprobadoPost'
                },
                'methodKpiCoberturaAprobada':{
                    name: 'KpiCoberturaAprobada',
                    path: 'api/kpicartagarantia/coberturaAprobadoPost'
                },
                'methodKpiMotivoRechazo':{
                    name: 'KpiMotivoRechazo',
                    path: 'api/kpicartagarantia/motivosRechazoPost'
                }
            }
        },
        controllerKpiFiltro: {
            actions : {
                'methodKpiRamo':{
                    name: 'KpiRamo',
                    path: 'api/lista/ramoPost'
                },
                'methodKpiProducto':{
                    name: 'KpiProducto',
                    path: 'api/lista/productoPost'
                },
                'methodKpiSubproducto':{
                    name: 'KpiSubproducto',
                    path: 'api/lista/subproductoPost'
                },
                'methodKpiContrato':{
                    name: 'KpiContrato',
                    path: 'api/lista/contratoPost'
                },
                'methodKpiSubcontrato':{
                    name: 'KpiSubcontrato',
                    path: 'api/lista/subcontratoPost'
                },
                'methodKpiDepartamento':{
                    name: 'KpiDepartamento',
                    path: 'api/lista/departamentoPost'
                },
                'methodKpiProvincia':{
                    name: 'KpiProvincia',
                    path: 'api/lista/provinciaPost'
                },
                'methodKpiDistrito':{
                    name: 'KpiDistrito',
                    path: 'api/lista/distritoPost'
                },
                'methodKpiClinica':{
                    name: 'KpiClinica',
                    path: 'api/lista/clinicaPost'
                },
                'methodKpiSede':{
                    name: 'methodKpiSede',
                    path: 'api/lista/sedePost'
                },
                'methodKpiCobertura':{
                    name: 'KpiCobertura',
                    path: 'api/lista/coberturaPost'
                },
                'methodKpiDiagnostico':{
                    name: 'KpiDiagnostico',
                    path: 'api/lista/diagnosticoPost'
                },
                'methodKpiEjecutivo':{
                    name: 'KpiEjecutivo',
                    path: 'api/lista/ejecutivoPost'
                },
                'methodKpiAuditorMedico':{
                    name: 'KpiAuditorMedico',
                    path: 'api/lista/auditorMedicoPost'
                },
                'methodKpiGrupoEconomico':{
                    name: 'KpiGrupoEconomico',
                    path: 'api/lista/grupoEconomicoPost'
                },
                'methodKpiContratante':{
                    name: 'KpiContratante',
                    path: 'api/lista/contratantePost'
                },
                'methodKpiIntermediario':{
                    name: 'KpiIntermediario',
                    path: 'api/lista/intermediarioPost'
                }
            }
        },
        controllerKpiConfiguracion: {
            actions: {
                'methodKpiObtenerConfiguracionDashboard':{
                    name: 'KpiObtenerConfiguracionDashboard',
                    path: 'api/kpiconfiguracion/obtenerConfiguracionDashboardPost'
                },
            }
        }
    })

     module.factory("proxyKpiSalud", ['oimProxyKpissalud', 'httpData', function(oimProxyKpissalud, httpData){
        return {
                // Indicadores - Siniestro
                'KpiTiempoAtencionSiniestro' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpisiniestro/tiempoAtencionSiniestroPagadoPost',
                                         param, undefined, showSpin)
                },
                'KpiNumeroTotalSiniestro' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpisiniestro/numeroTotalSiniestroPagadoPost',
                                         param, undefined, showSpin)
                },
                'KpiImporteTotalSiniestro' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpisiniestro/importeTotalSiniestroPagadoPost',
                                         param, undefined, showSpin)
                },
                'KpiCostoPromedioAtencionPaciente' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpisiniestro/costoPromedioAtencionPacientePost',
                                         param, undefined, showSpin)
                },
                'KpiImporteTasaHospitalizacion' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpisiniestro/importeTasaHospitalizacionPost',
                                         param, undefined, showSpin)
                },
                'KpiCostoPacienteMes' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpisiniestro/costoPacienteSiniestroLiquidadoPost',
                                         param, undefined, showSpin)
                },
                'KpiGastosProveedor' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpisiniestro/soatGastoProveedorPost',
                                         param, undefined, showSpin)
                },
                'KpiGastosCobertura': function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpisiniestro/soatGastoCoberturaPost',
                                         param, undefined, showSpin)
                },
                'KpiGastosTipoAccidente': function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpisiniestro/soatGastoTipoAccidentePost',
                                         param, undefined, showSpin)
                },
                'KpiGastosUbicacionGeograficaDetallada': function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpisiniestro/soatGastosUbicacionGeograficaDetalladaPost',
                                         param, undefined, showSpin)
                },
                'KpiGastosUbicacionGeograficaGeneral': function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpisiniestro/soatGastoUbicacionGeograficaGeneralPost',
                                         param, undefined, showSpin)
                },

                // Indicadores - Cartas de Garantía
                'KpiImporteTotalReservas': function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpicartagarantia/importeTotalReservasPost',
                                         param, undefined, showSpin)
                },
                'KpiNumeroCartasGarantiaSolicitadas': function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpicartagarantia/numeroCartaGarantiaSolicitadaPost',
                                         param, undefined, showSpin)
                },
                'KpiNumeroCartasGarantiaRechazadas': function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpicartagarantia/numeroCartaGarantiaRechazadaPost',
                                         param, undefined, showSpin)
                },
                'KpiNumeroTotalCartasGarantia': function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpicartagarantia/numeroTotalCartasGarantiaPost',
                                         param, undefined, showSpin)
                },
                'KpiImporteTotalCartasGarantia': function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpicartagarantia/importeTotalCartasGarantiaPost',
                                         param, undefined, showSpin)
                },
                'KpiAhorroSolicitudesRechazadas': function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpicartagarantia/ahorroSolicitudRechazadaPost',
                                         param, undefined, showSpin)
                },
                'KpiAhorroAuditoriaMedica': function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpicartagarantia/ahorroAuditoriaMedicaPost',
                                         param, undefined, showSpin)
                },
                'KpiDiagnosticoAprobado': function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpicartagarantia/diagnosticoAprobadoPost',
                                         param, undefined, showSpin)
                },
                'KpiCoberturaAprobada': function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpicartagarantia/coberturaAprobadoPost',
                                         param, undefined, showSpin)
                },
                'KpiMotivoRechazo': function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpicartagarantia/motivosRechazoPost',
                                         param, undefined, showSpin)
                },

                // Filtros
                'KpiRamo' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/ramoPost',
                                         param, undefined, showSpin)
                },
                'KpiProducto' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/productoPost',
                                         param, undefined, showSpin)
                },
                'KpiSubproducto' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/subproductoPost',
                                         param, undefined, showSpin)
                },
                'KpiContrato' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/contratoPost',
                                         param, undefined, showSpin)
                },
                'KpiSubcontrato' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/subcontratoPost',
                                         param, undefined, showSpin)
                },
                'KpiDepartamento' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/departamentoPost',
                                         param, undefined, showSpin)
                },
                'KpiProvincia' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/provinciaPost',
                                         param, undefined, showSpin)
                },
                'KpiDistrito' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/distritoPost',
                                         param, undefined, showSpin)
                },
                'KpiClinica' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/clinicaPost',
                                         param, undefined, showSpin)
                },
                'KpiSede' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/sedePost',
                                         param, undefined, showSpin)
                },
                'KpiCobertura' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/coberturaPost',
                                         param, undefined, showSpin)
                },
                'KpiDiagnostico' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/diagnosticoPost',
                                         param, undefined, showSpin)
                },
                'KpiEjecutivo' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/ejecutivoPost',
                                         param, undefined, showSpin)
                },
                'KpiAuditorMedico' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/auditorMedicoPost',
                                         param, undefined, showSpin)
                },
                'KpiGrupoEconomico' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/grupoEconomicoPost',
                                         param, undefined, showSpin)
                },
                'KpiContratante' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/contratantePost',
                                         param, undefined, showSpin)
                },
                'KpiIntermediario' : function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/lista/intermediarioPost',
                                         param, undefined, showSpin)
                },

                // Configuraciones
                'KpiObtenerConfiguracionDashboard': function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpiconfiguracion/obtenerConfiguracionDashboardPost',
                                         param, undefined, showSpin)
                },
                'KpiActualizarConfiguracionDashboard': function(param, showSpin){
                    return httpData['post'](oimProxyKpissalud.endpoint + 'api/kpiconfiguracion/actualizarConfiguracionPost',
                                         param, undefined, showSpin)
                }
        };
     }]);
});