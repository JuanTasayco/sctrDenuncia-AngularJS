/* eslint-disable */
(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants'], function(angular, constants){
    var module = angular.module("oim.proxyService.poliza", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxyPoliza', {
        endpoint: constants.system.api.endpoints['policy'],
        controllerAutomovil: {
            actions : {
                'methodModificarPlacaEndosatario':{
                    name:  'ModificarPlacaEndosatario',
                    path: 'api/automovil/modificar/placaendosatario'
                },
                'methodGetListMarcaModelo':{
                    name:  'GetListMarcaModelo',
                    path: 'api/automovil/marcamodelo'
                },
                'methodGetListMarca':{
                    name:  'GetListMarca',
                    path: 'api/automovil/marca'
                },
                'methodGetListMarcaAutocomplete':{
                    name:  'GetListMarcaAutocomplete',
                    path: 'api/automovil/marcacompletar?cadena={cadena}'
                },
                'methodGetListModelo':{
                    name:  'GetListModelo',
                    path: 'api/automovil/modelo/{codMar}'
                },
                'methodGetListSubModeloOld':{
                    name:  'GetListSubModeloOld',
                    path: 'api/automovil/submodelo/old/{codCia}/{codMar}/{codMod}'
                },
                'methodGetListSubModelo':{
                    name:  'GetListSubModelo',
                    path: 'api/automovil/submodelo/{codigoCompania}/{tipoVehiculo}/{codigoMarca}/{codigoModelo}'
                },
                'methodGetListAnoFabricacion':{
                    name:  'GetListAnoFabricacion',
                    path: 'api/automovil/anofabricacion/{codMar}/{codMod}/{codSub}'
                },
                'methodGetListTipoUso':{
                    name:  'GetListTipoUso',
                    path: 'api/automovil/tipouso/{codRam}/{codMod}/{codTip}'
                },
                'methodValidarExcepcion':{
                    name:  'ValidarExcepcion',
                    path: 'api/automovil/validar/excepcion'
                },
                'methodGetListOcupacion':{
                    name:  'GetListOcupacion',
                    path: 'api/automovil/ocupacion/{codPrf}/{desPrf}'
                },
                'methodGetListColor':{
                    name:  'GetListColor',
                    path: 'api/automovil/color'
                },
                'methodGetPolizaBroker':{
                    name:  'GetPolizaBroker',
                    path: 'api/automovil/poliza/grupos/{groupprod}'
                },
                'methodGetPolizaV2':{
                    name:  'GetPolizaV2',
                    path: 'api/automovil/polizav2/{polGru}'
                },
                'methodGetPoliza':{
                    name:  'GetPoliza',
                    path: 'api/automovil/poliza/{polGru}'
                },
                'methodValidarPoliza':{
                    name:  'ValidarPoliza',
                    path: 'api/automovil/poliza/validar/{nroPol}'
                },
                'methodGetTipoVehiculo':{
                    name:  'GetTipoVehiculo',
                    path: 'api/automovil/tipovehiculo/{codCia}/{codMar}/{codMod}/{codSub}/{codRamo}'
                },
                'methodGetListTipoVehiculo':{
                    name:  'GetListTipoVehiculo',
                    path: 'api/automovil/tipovehiculo/{codigoCompania}/{codRamo}'
                },
                'methodGetMcagps':{
                    name:  'GetMcagps',
                    path: 'api/automovil/gps/{codMar}/{codMod}/{codSub}/{anoFab}'
                },
                'methodGetValorSugerido':{
                    name:  'GetValorSugerido',
                    path: 'api/automovil/valorsugerido/{codEmpresa}/{codMarca}/{codModelo}/{codSubModelo}/{codTipVeh}/{anioFabricacion}'
                },
                'methodGetValorEmisionAutoUsado':{
                    name:  'GetValorEmisionAutoUsado',
                    path: 'api/automovil/ValorEmisionAutoUsado/{codMarca}/{codModelo}/{codSubModelo}/{anioFabricacion}/{valorVehiculo}'
                },
                'methodGetDescuentoComercial':{
                    name:  'GetDescuentoComercial',
                    path: 'api/automovil/descuento'
                },
                'methodGetDescuentoComision':{
                    name:  'GetDescuentoComision',
                    path: 'api/automovil/descuento/comision'
                },
                'methodGetListProgram':{
                    name:  'GetListProgram',
                    path: 'api/automovil/programa'
                },
                'methodGetCodigoCategoriaVehicular':{
                    name:  'GetCodigoCategoriaVehicular',
                    path: 'api/automovil/categoriaVehicular/{codCia}/{codMar}/{codMod}/{codSubMod}'
                },
                'methodGerMarcaPickupByTipoVeh':{
                    name:  'GerMarcaPickupByTipoVeh',
                    path: 'api/automovil/marcapickup/{codigoTipoVeh}'
                },
                'methodGerMarcaPickupByAFab':{
                    name:  'GerMarcaPickupByAFab',
                    path: 'api/automovil/autonuevo/{anioFabricacion}'
                },
                'methodGetDatosCatGpsTip':{
                    name:  'GetDatosCatGpsTip',
                    path: 'api/automovil/datosautomovilcatgpstip/{codCia}/{codMar}/{codMod}/{codSubMod}'
                },
                'methodGetNombrePolizaGrupo':{
                    name:  'GetNombrePolizaGrupo',
                    path: 'api/automovil/buscar/polizagrupo/{codCia}/{polGru}'
                },
                'methodGetValidarPsd':{
                    name:  'GetValidarPsd',
                    path: 'api/automovil/validar/psc'
                },
            }
        },
        controllerAutomovilEmblem: {
            actions : {
                'methodGetListTipoFrecuenciaUsoVehiculo':{
                    name:  'GetListTipoFrecuenciaUsoVehiculo',
                    path: 'api/automovil/list/tipofrecuenciauso'
                },
                'methodGetListAntiguedadLicenciaConducir':{
                    name:  'GetListAntiguedadLicenciaConducir',
                    path: 'api/automovil/list/antiguedadlicencia'
                },
                'methodGetListUsualGaraje':{
                    name:  'GetListUsualGaraje',
                    path: 'api/automovil/list/usualgaraje'
                },
                'methodGetListConductorPropio':{
                    name:  'GetListConductorPropio',
                    path: 'api/automovil/list/conductorpropio'
                },
                'methodGetListAccidentesUltimosDosAnios':{
                    name:  'GetListAccidentesUltimosDosAnios',
                    path: 'api/automovil/list/accidentesultimosanios'
                },
                'methodGetListTipoUsoVehiculo':{
                    name:  'GetListTipoUsoVehiculo',
                    path: 'api/automovil/list/tipousovehiculo'
                },
            }
        },
        controllerAgente: {
            actions : {
                'methodbuscarAgente':{
                    name:  'buscarAgente',
                    path: 'api/agente/buscar?codigoNombre={codigoNombre}'
                },
                'methodbuscarAgenteSctr':{
                    name:  'buscarAgenteSctr',
                    path: 'api/agente/sctr/buscar/{codigoNombre}/{codigoRol}/{codigoGestor}'
                },
                'methodGetListAgenteVida':{
                    name:  'GetListAgenteVida',
                    path: 'api/agente/vida'
                },
                'methodGetListAgenteSalud':{
                    name:  'GetListAgenteSalud',
                    path: 'api/agente/salud'
                },
                'methodGetDatoDocumentoAgente':{
                    name:  'GetDatoDocumentoAgente',
                    path: 'api/agente/dato/documento/{codigoAgente}'
                },
                'methodGetRegionOficina':{
                    name:  'GetRegionOficina',
                    path: 'api/agente/region/oficina/{codigoCompania}/{codigoAgente}'
                },
            }
        },
        controllerInspeccion: {
            actions : {
                'methodValidInspeccion':{
                    name:  'ValidInspeccion',
                    path: 'api/inspeccion/validar/{nro}'
                },
                'methodGetPorcentajeDerechoEmision':{
                    name:  'GetPorcentajeDerechoEmision',
                    path: 'api/inspeccion/porcderechoemision'
                },
            }
        },
        controllerPersonForm: {
            actions : {
                'methodgetPersonForm':{
                    name:  'getPersonForm',
                    path: 'api/form/person/fields?formCode={formCode}&appCode={appCode}'
                },
                'methodputPersonForm':{
                    name:  'putPersonForm',
                    path: 'api/form/person/fields?formCode={formCode}&appCode={appCode}'
                },
                'methodgetPersonEquifax':{
                    name:  'getPersonEquifax',
                    path: 'api/form/person/equifax'
                },
                'methodgetValidService':{
                    name:  'getValidService',
                    path: 'api/form/person/serviceValid'
                },
                'methodGetTipoDocumento':{
                    name:  'GetTipoDocumento',
                    path: 'api/form/person/TipoDoc?formCode={formCode}&appCode={appCode}'
                },
            }
        },
        controllerCotizacion: {
            actions : {
                'methodGenerarCotizacionCampoSanto':{
                    name:  'GenerarCotizacionCampoSanto',
                    path: 'api/cotizacion/cotizar/camposanto'
                },
                'methodgetDsctoEspecial':{
                    name:  'getDsctoEspecial',
                    path: 'api/cotizacion/dsctoespecial'
                },
                'methodgrabarCotizacion':{
                    name:  'grabarCotizacion',
                    path: 'api/cotizacion/grabar/vehiculo'
                },
                'methodcotizarVehiculo':{
                    name:  'cotizarVehiculo',
                    path: 'api/cotizacion/cotizar/vehiculo'
                },
                'methodCalcularPrimaVehiculo':{
                    name:  'CalcularPrimaVehiculo',
                    path: 'api/cotizacion/calcularprima/vehiculo'
                },
                'methodCalcularPrimaVehiculoIndividual':{
                    name:  'CalcularPrimaVehiculoIndividual',
                    path: 'api/cotizacion/calcularprimaindividual/vehiculo'
                },
                'methodCalcularPrimaVehiculo2':{
                    name:  'CalcularPrimaVehiculo2',
                    path: 'api/cotizacion/calcularprima2/vehiculo'
                },
                'methodgrabarCotizacionSoat':{
                    name:  'grabarCotizacionSoat',
                    path: 'api/cotizacion/grabar/soatvehiculo'
                },
                'methodcotizarSoatVehiculo':{
                    name:  'cotizarSoatVehiculo',
                    path: 'api/cotizacion/cotizar/soatvehiculo'
                },
                'methodcotizarHogar':{
                    name:  'cotizarHogar',
                    path: 'api/cotizacion/cotizar/hogar'
                },
                'methodgrabarCotizacionHogar':{
                    name:  'grabarCotizacionHogar',
                    path: 'api/cotizacion/grabar/hogar'
                },
                'methodgrabarCotizacionHogarBulk':{
                    name:  'grabarCotizacionHogarBulk',
                    path: 'api/cotizacion/grabar/hogar/bulk'
                },
                'methodbuscarCotizacionPrima':{
                    name:  'buscarCotizacionPrima',
                    path: 'api/cotizacion/prima/hogar/{codigo}'
                },
                'methodbuscarCotizacionPorCodigo':{
                    name:  'buscarCotizacionPorCodigo',
                    path: 'api/cotizacion/buscar/hogar/{codigo}'
                },
                'methodlistarFinanciamientoCotizaHogar':{
                    name:  'listarFinanciamientoCotizaHogar',
                    path: 'api/cotizacion/financiamiento/hogar'
                },
                'methodlistarComparativoCotizaHogar':{
                    name:  'listarComparativoCotizaHogar',
                    path: 'api/cotizacion/comparativo/hogar'
                },
                'methodcotizarTransporte':{
                    name:  'cotizarTransporte',
                    path: 'api/cotizacion/cotizar/transporte'
                },
                'methodGetCotizacionAccidente':{
                    name:  'GetCotizacionAccidente',
                    path: 'api/cotizacion/cotizar/accidente'
                },
                'methodGetRiesgoAccidenteGrabado':{
                    name:  'GetRiesgoAccidenteGrabado',
                    path: 'api/cotizacion/cotizar/obtenerriesgo/{codigo}'
                },
                'methodCotizacionAccidenteRegistrar':{
                    name:  'CotizacionAccidenteRegistrar',
                    path: 'api/cotizacion/grabar/accidente'
                },
                'methodCotizacionAccidenteObtener':{
                    name:  'CotizacionAccidenteObtener',
                    path: 'api/cotizacion/accidente/obtener/{CodigoProducto}/{NumeroDocumento}'
                },
                'methodcotizarEmpresa':{
                    name:  'cotizarEmpresa',
                    path: 'api/cotizacion/cotizar/empresa'
                },
                'methodgrabarCotizacionEmpresa':{
                    name:  'grabarCotizacionEmpresa',
                    path: 'api/cotizacion/grabar/empresa'
                },
                'methodGenerarPrimaVida':{
                    name:  'GenerarPrimaVida',
                    path: 'api/cotizacion/calcularprima/vida'
                },
                'methodcalcularCotizacionVida':{
                    name:  'calcularCotizacionVida',
                    path: 'api/cotizacion/calcular/vida'
                },
                'methodgrabarCotizacionVida':{
                    name:  'grabarCotizacionVida',
                    path: 'api/cotizacion/vida'
                },
                'methodbuscarCotizacionVidaPorCodigo':{
                    name:  'buscarCotizacionVidaPorCodigo',
                    path: 'api/cotizacion/vida/{codigo}'
                },
                'methodListarCotizacionPendientePag':{
                    name:  'ListarCotizacionPendientePag',
                    path: 'api/cotizacion/vida/pendientepaginado'
                },
                'methodListarCotizacionEnviadaPag':{
                    name:  'ListarCotizacionEnviadaPag',
                    path: 'api/cotizacion/vida/enviadapaginado'
                },
                'methodListarCotizacionDecesoPag':{
                    name:  'ListarCotizacionDecesoPag',
                    path: 'api/cotizacion/consulta/decesopaginado'
                },
                'methodListarCotizacionReferidoPag':{
                    name:  'ListarCotizacionReferidoPag',
                    path: 'api/cotizacion/vida/referidopaginado'
                },
                'methodCotizacionVida':{
                    name:  'CotizacionVida',
                    path: 'api/cotizacion/orquestador/vida'
                },
                'methodGenerarCotizacionSalud':{
                    name:  'GenerarCotizacionSalud',
                    path: 'api/cotizacion/generar/salud'
                },
                'methodGuardarCotizacionSalud':{
                    name:  'GuardarCotizacionSalud',
                    path: 'api/cotizacion/salud'
                },
                'methodObtenerCotizacion':{
                    name:  'ObtenerCotizacion',
                    path: 'api/cotizacion/salud/{numeroDocumento}'
                },
                'methodObtenerCotizacionRenovacion':{
                    name:  'ObtenerCotizacionRenovacion',
                    path: 'api/cotizacion/salud/renovacion/{codigoCia}/{codigoRamo}/{numeroPoliza}'
                },
                'methodCotizacionSolicitudMigracion':{
                    name:  'CotizacionSolicitudMigracion',
                    path: 'api/cotizacion/generar/migracion'
                },
            }
        },
        controllerContratante: {
            actions : {
                'methodGetContratanteByNroDocumento':{
                    name:  'GetContratanteByNroDocumento',
                    path: 'api/contratante/datos/{CodEmpresa}/{TipoDoc}/{NroDocumento}'
                },
                'methodGetContratanteByNroDocumentoCias':{
                    name:  'GetContratanteByNroDocumentoCias',
                    path: 'api/contratante/multiempresa/{TipoDoc}/{NroDocumento}'
                },
                'methodGetContratanteSoatByNroDocumento':{
                    name:  'GetContratanteSoatByNroDocumento',
                    path: 'api/contratante/datos/soat/{CodEmpresa}/{TipoDoc}/{NroDocumento}'
                },
                'methodGetPostContratanteSoatByNroDocumento':{
                    name:  'GetPostContratanteSoatByNroDocumento',
                    path: 'api/contratante/datos/soat'
                },
                'methodGetTerceroByNroDocumento':{
                    name:  'GetTerceroByNroDocumento',
                    path: 'api/contratante/tercero/{CodEmpresa}/{TipoDoc}/{NroDocumento}'
                },
                'methodGetListEndosatario':{
                    name:  'GetListEndosatario',
                    path: 'api/contratante/endosatario'
                },
                'methodGetListEndosatarioAutocomplete':{
                    name:  'GetListEndosatarioAutocomplete',
                    path: 'api/contratante/endosatario/autocomplete/{dato}'
                },
                'methodGetEndosatario':{
                    name:  'GetEndosatario',
                    path: 'api/contratante/endosatario/{numDoc}'
                },
                'methodGetEndosatarioTercero':{
                    name:  'GetEndosatarioTercero',
                    path: 'api/contratante/endosatario/tercero?dato={dato}&codCia={codCia}'
                },
                'methodGetEndosatarioTerceroByRuc':{
                    name:  'GetEndosatarioTerceroByRuc',
                    path: 'api/contratante/endosatario/tercero/{dato}?codCia={codCia}'
                },
                'methodGetEndosatarioTerceroByRucAndCia':{
                    name:  'GetEndosatarioTerceroByRucAndCia',
                    path: 'api/contratante/endosatario/tercero/{dato}/{codCia}'
                },
                'methodGetEndosatarioTerceroAutocomplete':{
                    name:  'GetEndosatarioTerceroAutocomplete',
                    path: 'api/contratante/endosatario/tercero/autocomplete'
                },
                'methodGetListAbonado':{
                    name:  'GetListAbonado',
                    path: 'api/contratante/abonado/pendiente/{tipoDocumento}/{numeroDocumento}'
                },
                'methodGetAbonado':{
                    name:  'GetAbonado',
                    path: 'api/contratante/abonado/pendiente?tipoDocumento={tipoDocumento}&numeroDocumento={numeroDocumento}'
                },
                'methodGetContratanteEquifaxByNroDocumento':{
                    name:  'GetContratanteEquifaxByNroDocumento',
                    path: 'api/contratante/datos/equifax/{TipoDoc}/{NroDocumento}'
                },
            }
        },
        controllerHogar: {
            actions : {
                'methodGetTipoInmueble':{
                    name:  'GetTipoInmueble',
                    path: 'api/hogar/tipoinmueble?codCia={codCia}&codRamo={codRamo}&codModalidad={codModalidad}'
                },
                'methodGetMaterialConstruccion':{
                    name:  'GetMaterialConstruccion',
                    path: 'api/hogar/materialconstruccion?codCia={codCia}&codRamo={codRamo}&codModalidad={codModalidad}'
                },
                'methodGetCategoriaInspeccion':{
                    name:  'GetCategoriaInspeccion',
                    path: 'api/hogar/categoriaInspeccion?codCia={codCia}&codRamo={codRamo}&codModalidad={codModalidad}'
                },
                'methodGetCategoriaConstruccion':{
                    name:  'GetCategoriaConstruccion',
                    path: 'api/hogar/categoriaConstruccion?codCia={codCia}&codRamo={codRamo}&codModalidad={codModalidad}'
                },
                'methodGetInspectoresHogar':{
                    name:  'GetInspectoresHogar',
                    path: 'api/hogar/inspectores'
                },
                'methodGetAnioInmueble':{
                    name:  'GetAnioInmueble',
                    path: 'api/hogar/anioInmueble'
                },
                'methodGetAlarmaMonitoreo':{
                    name:  'GetAlarmaMonitoreo',
                    path: 'api/hogar/alarmaMonitoreo?codCia={codCia}&codRamo={codRamo}&codModalidad={codModalidad}'
                },
                'methodGetAlarmaMonitoreo':{
                    name:  'GetAlarmaMonitoreo',
                    path: 'api/hogar/AlertManagement'
                },
                'methodGetListFinanciamiento':{
                    name:  'GetListFinanciamiento',
                    path: 'api/hogar/financiamiento/{codigoModalidad}'
                },
                'methodGetModalidadHogarModalidad2':{
                    name:  'GetModalidadHogarModalidad2',
                    path: 'api/hogar/modalidad/{codCia}/{codRamo}?codModalidad={codModalidad}'
                },
                'methodGetModalidadHogarModalidad':{
                    name:  'GetModalidadHogarModalidad',
                    path: 'api/hogar/modalidad/{codCia}/{codRamo}/{codModalidad}'
                },
                'methodGetComunicationType':{
                    name:  'GetComunicationType',
                    path: 'api/hogar/ComunicationType?codCia={codCia}&codRamo={codRamo}&codModalidad={codModalidad}&alertCode={alertCode}'
                },
                'methodGetPackageType':{
                    name:  'GetPackageType',
                    path: 'api/hogar/PackageType?comunicationTypeId={comunicationTypeId}'
                },
                'methodQuotation':{
                    name:  'Quotation',
                    path: 'api/hogar/Quotation'
                },
                'methodQuotationCompare':{
                    name:  'QuotationCompare',
                    path: 'api/hogar/Quotation/Compare'
                },
                'methodInsuranceCost':{
                    name:  'InsuranceCost',
                    path: 'api/hogar/Insurance/Cost'
                },
            }
        },
        controllerReporte: {
            actions : {
                'methodReporteCotizacionAutos':{
                    name:  'ReporteCotizacionAutos',
                    path: 'api/reporte/autos/cotizacion/{codCia}/{codDocumento}/{codRamo}'
                },
                'methodReporteCotizacionHogarJson':{
                    name:  'ReporteCotizacionHogarJson',
                    path: 'api/reporte/hogar/cotizacion'
                },
                'methodReporteCotizacionHogar':{
                    name:  'ReporteCotizacionHogar',
                    path: 'api/reporte/hogar/cotizacion/{codCia}/{codDocumento}/{codRamo}'
                },
                'methodReporteCotizacionAccidente':{
                    name:  'ReporteCotizacionAccidente',
                    path: 'api/reporte/accidente/cotizacion'
                },
                'methodReporteCotizacionSoat':{
                    name:  'ReporteCotizacionSoat',
                    path: 'api/reporte/soat/cotizacion'
                },
                'methodReporteCotizacion':{
                    name:  'ReporteCotizacion',
                    path: 'api/reporte/vida/cotizacion/{numeroCotizacion}'
                },
                'methodGetReporteTransporte':{
                    name:  'GetReporteTransporte',
                    path: 'api/reporte/transporte/emision'
                },
                'methodReporteResumenEquipo':{
                    name:  'ReporteResumenEquipo',
                    path: 'api/reporte/vida/resumenequipo'
                },
                'methodReporteResumenAgente':{
                    name:  'ReporteResumenAgente',
                    path: 'api/reporte/vida/resumenagente'
                },
                'methodReporteCotizacionSalud':{
                    name:  'ReporteCotizacionSalud',
                    path: 'api/reporte/salud/cotizacion/{numeroDocumento}'
                },
                'methodDescargarPoliza':{
                    name:  'DescargarPoliza',
                    path: 'api/reporte/descargar/poliza/{codigoCompania}/{numeroPoliza}'
                },
            }
        },
        controllerProducto: {
            actions : {
                'methodgetListProductoNuevo':{
                    name:  'getListProductoNuevo',
                    path: 'api/producto/nuevo'
                },
                'methodgetListTypeProducto':{
                    name:  'getListTypeProducto',
                    path: 'api/producto/tipo'
                },
                'methodgetListAsignado':{
                    name:  'getListAsignado',
                    path: 'api/producto/relacionado/{cod}'
                },
                'methodgetListProductByMarca':{
                    name:  'getListProductByMarca',
                    path: 'api/producto/marca/{codMar}'
                },
                'methodgetListProductByUsuario':{
                    name:  'getListProductByUsuario',
                    path: 'api/producto/usuario'
                },
                'methodgetListProductoPorVehiculo':{
                    name:  'getListProductoPorVehiculo',
                    path: 'api/producto/porproducto'
                },
                'methodGetListProductoVida':{
                    name:  'GetListProductoVida',
                    path: 'api/producto/vida?codigo={codigo}&descripcion={descripcion}'
                },
                'methodGetListProductoVidaByCodigo':{
                    name:  'GetListProductoVidaByCodigo',
                    path: 'api/producto/vida/{codigo}?descripcion={descripcion}'
                },
                'methodGetListProductoVidaByCodigoDesc':{
                    name:  'GetListProductoVidaByCodigoDesc',
                    path: 'api/producto/vida/{codigo}/{descripcion}'
                },
                'methodGetListProductoBandeja':{
                    name:  'GetListProductoBandeja',
                    path: 'api/producto/bandeja?codigoCia={codigoCia}&codigoRamo={codigoRamo}'
                },
                'methodGetListProductoBandejaxCiaRamo':{
                    name:  'GetListProductoBandejaxCiaRamo',
                    path: 'api/producto/bandeja/{codigoCia}/{codigoRamo}'
                },
                'methodGetProductDescription':{
                    name:  'GetProductDescription',
                    path: 'api/producto/description/{codigoProducto}'
                },
                'methodListarProductoTronPag':{
                    name:  'ListarProductoTronPag',
                    path: 'api/producto/salud/tronPaginado'
                },
                'methodRegistrarProductoSalud':{
                    name:  'RegistrarProductoSalud',
                    path: 'api/producto/salud'
                },
                'methodActualizarEstadoProductoSalud':{
                    name:  'ActualizarEstadoProductoSalud',
                    path: 'api/producto/salud/actualizarEstado'
                },
                'methodListarProductoSalud':{
                    name:  'ListarProductoSalud',
                    path: 'api/producto/salud/cotizacion'
                },
                'methodListarProductoGlobal':{
                    name:  'ListarProductoGlobal',
                    path: 'api/producto/salud'
                },
                'methodObtenerProductoGlobal':{
                    name:  'ObtenerProductoGlobal',
                    path: 'api/producto/salud/{codigoCia}/{codigoRamo}/{numeroContrato}/{numeroSubContrato}'
                },
            }
        },
        controllerEmision: {
            actions : {
                'methodgrabarEmisionVehiculo':{
                    name:  'grabarEmisionVehiculo',
                    path: 'api/emision/grabar/vehiculo'
                },
                'methodgrabarEmisionConInspeccion':{
                    name:  'grabarEmisionConInspeccion',
                    path: 'api/emision/grabar/vehiculoinspeccion'
                },
                'methodvalidatePlate':{
                    name:  'validatePlate',
                    path: 'api/emision/validar/placa'
                },
                'methodCargaAltaDocumental':{
                    name:  'CargaAltaDocumental',
                    path: 'api/emision/vehiculo/cargaAltaDocumental'
                },
                'methodGrabarEmisionTransporte':{
                    name:  'GrabarEmisionTransporte',
                    path: 'api/emision/grabar/transporte'
                },
                'methodgrabarEmisionHogar':{
                    name:  'grabarEmisionHogar',
                    path: 'api/emision/grabar/hogar'
                },
                'methodgrabarEmisionSoat':{
                    name:  'grabarEmisionSoat',
                    path: 'api/emision/grabar/soat'
                },
                'methodgetListRiesgo':{
                    name:  'getListRiesgo',
                    path: 'api/emision/riesgo'
                },
                'methodgetListRiesgoCasco':{
                    name:  'getListRiesgoCasco',
                    path: 'api/emision/riesgocasco'
                },
                'methodgrabarEmisionAccidente':{
                    name:  'grabarEmisionAccidente',
                    path: 'api/emision/grabar/accidente'
                },
                'methodgrabarEmisionVida':{
                    name:  'grabarEmisionVida',
                    path: 'api/emision/Vida'
                },
                'methodgrabarEmisionOrquestadorVida':{
                    name:  'grabarEmisionOrquestadorVida',
                    path: 'api/emision/vida/orquestador'
                },
                'methodgrabarAnulacionPoliza':{
                    name:  'grabarAnulacionPoliza',
                    path: 'api/emision/salud/anulacion'
                },
                'methodgrabarAnulacionSuplemente':{
                    name:  'grabarAnulacionSuplemente',
                    path: 'api/emision/salud/suplemento/anulacion'
                },
                'methodgrabarRenovacionPoliza':{
                    name:  'grabarRenovacionPoliza',
                    path: 'api/emision/salud/renovacion'
                },
                'methodgenerarEmisionPoliza':{
                    name:  'generarEmisionPoliza',
                    path: 'api/emision/salud/emision/poliza'
                },
            }
        },
        controllerEpsEmpresa: {
            actions : {
                'methodCrearCotizacion':{
                    name:  'CrearCotizacion',
                    path: 'epsempresa/empresa/proforma/{id}/cotizacion'
                },
                'methodObtenerCotizacion':{
                    name:  'ObtenerCotizacion',
                    path: 'epsempresa/empresa/proforma/{id}/cotizacion'
                },
                'methodCrearProforma':{
                    name:  'CrearProforma',
                    path: 'epsempresa/empresa/proforma'
                },
                'methodObtenerProformas':{
                    name:  'ObtenerProformas',
                    path: 'epsempresa/empresa/proformas?numeroPagina={numeroPagina}&cantidadPorPagina={cantidadPorPagina}&fechaDesde={fechaDesde}&fechaHasta={fechaHasta}&ruc={ruc}&empresa={empresa}&estado={estado}&limite={limite}'
                },
                'methodObtenerInforme':{
                    name:  'ObtenerInforme',
                    path: 'epsempresa/empresa/proforma/{id}/informe'
                },
                'methodCrearParametro':{
                    name:  'CrearParametro',
                    path: 'epsempresa/empresa/parametro'
                },
                'methodActualizarParametro':{
                    name:  'ActualizarParametro',
                    path: 'epsempresa/empresa/parametro/{id}'
                },
                'methodEliminarParametro':{
                    name:  'EliminarParametro',
                    path: 'epsempresa/empresa/parametro/{id}'
                },
                'methodObtenerParametros':{
                    name:  'ObtenerParametros',
                    path: 'epsempresa/empresa/parametros?numeroPagina={numeroPagina}&cantidadPorPagina={cantidadPorPagina}&limite={limite}&grupo={grupo}'
                },
                'methodObtenerParametro':{
                    name:  'ObtenerParametro',
                    path: 'epsempresa/empresa/parametro/{id}'
                },
                'methodCrearTarifa':{
                    name:  'CrearTarifa',
                    path: 'epsempresa/empresa/tarifa'
                },
                'methodActualizarTarifa':{
                    name:  'ActualizarTarifa',
                    path: 'epsempresa/empresa/tarifa/{id}'
                },
                'methodEliminarTarifa':{
                    name:  'EliminarTarifa',
                    path: 'epsempresa/empresa/tarifa/{id}'
                },
                'methodObtenerTarifa':{
                    name:  'ObtenerTarifa',
                    path: 'epsempresa/empresa/tarifa/{id}'
                },
                'methodObtenerTarifas':{
                    name:  'ObtenerTarifas',
                    path: 'epsempresa/empresa/tarifas?numeroPagina={numeroPagina}&cantidadPorPagina={cantidadPorPagina}&limite={limite}'
                },
                'methodObtenerEntidadJuridcaNatural':{
                    name:  'ObtenerEntidadJuridcaNatural',
                    path: 'epsempresa/empresa/equifax/persona?numDoc={numDoc}'
                },
            }
        },
        controllerGestor: {
            actions : {
                'methodGetListGestor':{
                    name:  'GetListGestor',
                    path: 'api/gestor/vida'
                },
            }
        },
        controllerEmisionRg: {
            actions : {
                'methodEmisionRobotResponsabilidadcivil':{
                    name:  'EmisionRobotResponsabilidadcivil',
                    path: 'api/rrgg/emision/robot/responsabilidadcivil'
                },
                'methodEmisionRobotEquipoContratista':{
                    name:  'EmisionRobotEquipoContratista',
                    path: 'api/rrgg/emision/robot/equipocontratista'
                },
                'methodEmisionRobotTransporteTerrestre':{
                    name:  'EmisionRobotTransporteTerrestre',
                    path: 'api/rrgg/emision/robot/transporteterrestre'
                },
                'methodEmisionSuscriptor':{
                    name:  'EmisionSuscriptor',
                    path: 'api/rrgg/emision/suscriptor'
                },
                'methodCargarAseguradosMasivo':{
                    name:  'CargarAseguradosMasivo',
                    path: 'api/rrgg/emision/leer-archivo/masiva'
                },
                'methodExportarSolicitudesRrGg':{
                    name:  'ExportarSolicitudesRrGg',
                    path: 'api/rrgg/emision/exportar/pdf/{numeroTramite}/{grupoProducto}'
                },
                'methodEmisionRobotConstruccion':{
                    name:  'EmisionRobotConstruccion',
                    path: 'api/rrgg/emision/robot/construccion'
                },
                'methodEmisionRobotDeshonestidad':{
                    name:  'EmisionRobotDeshonestidad',
                    path: 'api/rrgg/emision/robot/deshonestidad'
                },
                'methodEmisionRobotTransporteMaritimoAereo':{
                    name:  'EmisionRobotTransporteMaritimoAereo',
                    path: 'api/rrgg/emision/robot/transportemaritimoaereo'
                },
            }
        },
        controllerDomicilio: {
            actions : {
                'methodgetNumeracionDomicilio':{
                    name:  'getNumeracionDomicilio',
                    path: 'api/general/domicilio/numeracion'
                },
                'methodGetListTipo':{
                    name:  'GetListTipo',
                    path: 'api/general/domicilio/tipo'
                },
                'methodGetListInterior':{
                    name:  'GetListInterior',
                    path: 'api/general/domicilio/interior'
                },
                'methodGetListZona':{
                    name:  'GetListZona',
                    path: 'api/general/domicilio/zona'
                },
            }
        },
        controllerReferido: {
            actions : {
                'methodexisteReferidoPoliza':{
                    name:  'existeReferidoPoliza',
                    path: 'api/referido/existeReferidoPoliza/{numeroReferido}'
                },
                'methodesAgenteReferido':{
                    name:  'esAgenteReferido',
                    path: 'api/referido/esAgenteReferido/{codigoAgente}/{codigoCompania}'
                },
                'methodRegistrarPolizaReferido':{
                    name:  'RegistrarPolizaReferido',
                    path: 'api/referido/registraPolizaReferido'
                },
                'methodEsReferidoObligatorio':{
                    name:  'EsReferidoObligatorio',
                    path: 'api/referido/EsReferidoObligatorio'
                },
                'methodValidateReferredNumber':{
                    name:  'ValidateReferredNumber',
                    path: 'api/referido/{numeroReferido}/validacion/{accion}/{codigoAgente}/{esSupervisor}'
                },
            }
        },
        controllerDeceso: {
            actions : {
                'methodListarRamo':{
                    name:  'ListarRamo',
                    path: 'api/deceso/ramo'
                },
                'methodListaPolizaGrupo':{
                    name:  'ListaPolizaGrupo',
                    path: 'api/deceso/polizaGrupo?codigoRamo={codigoRamo}'
                },
                'methodListaModalidad':{
                    name:  'ListaModalidad',
                    path: 'api/deceso/modalidad?codigoRamo={codigoRamo}'
                },
                'methodListaFinanciamiento':{
                    name:  'ListaFinanciamiento',
                    path: 'api/deceso/financiamiento?codigoRamo={codigoRamo}&numeroPolizaGrupo={numeroPolizaGrupo}&codigoModalidad={codigoModalidad}'
                },
                'methodValidaEdad':{
                    name:  'ValidaEdad',
                    path: 'api/deceso/asegurado/valida/edad'
                },
                'methodFechaVigencia':{
                    name:  'FechaVigencia',
                    path: 'api/deceso/poliza/vigencia/{CodigoRamo}/{NumeroPolizaGrupo}/{CodigoModalidad}'
                },
                'methodGetListAgente':{
                    name:  'GetListAgente',
                    path: 'api/deceso/agente'
                },
                'methodGetListGestorCotizacion':{
                    name:  'GetListGestorCotizacion',
                    path: 'api/deceso/gestor/cotizacion'
                },
                'methodGetListAgenteCotizacion':{
                    name:  'GetListAgenteCotizacion',
                    path: 'api/deceso/agente/cotizacion'
                },
                'methodListaTipoAsegurado':{
                    name:  'ListaTipoAsegurado',
                    path: 'api/deceso/asegurado/tipo'
                },
                'methodListaMedioPago':{
                    name:  'ListaMedioPago',
                    path: 'api/deceso/asegurado/pago'
                },
                'methodRegistrarCotizacion':{
                    name:  'RegistrarCotizacion',
                    path: 'api/deceso/cotizacion'
                },
                'methodObtenerCotizacion':{
                    name:  'ObtenerCotizacion',
                    path: 'api/deceso/cotizacion?numeroDocumento={numeroDocumento}'
                },
                'methodDescargarCotizacion':{
                    name:  'DescargarCotizacion',
                    path: 'api/deceso/cotizacion/archivo/{numeroDocumento}'
                },
                'methodRegistrarArchivoDecesoAsync':{
                    name:  'RegistrarArchivoDecesoAsync',
                    path: 'api/deceso/archivos'
                },
                'methodEliminarArchivoDeceso':{
                    name:  'EliminarArchivoDeceso',
                    path: 'api/deceso/emision/archivos/{CodigoArchivoAdjunto}'
                },
                'methodDescargarArchivoDeceso':{
                    name:  'DescargarArchivoDeceso',
                    path: 'api/deceso/archivo/descarga/{codigoArchivoAdjunto}'
                },
                'methodListarArchivoDeceso':{
                    name:  'ListarArchivoDeceso',
                    path: 'api/deceso/archivos/{codigoCompania}/{codigoRamo}/{nroDocumento}'
                },
                'methodListarRamoTronPag':{
                    name:  'ListarRamoTronPag',
                    path: 'api/deceso/mantenimiento/ramo'
                },
                'methodActualizaRamo':{
                    name:  'ActualizaRamo',
                    path: 'api/deceso/mantenimiento/ramo/estado'
                },
                'methodListaPolizaGrupoTron':{
                    name:  'ListaPolizaGrupoTron',
                    path: 'api/deceso/mantenimiento/polizaGrupo?codigoRamo={codigoRamo}'
                },
                'methodListaModalidadTron':{
                    name:  'ListaModalidadTron',
                    path: 'api/deceso/mantenimiento/modalidad?codigoRamo={codigoRamo}'
                },
                'methodActualizaPolizaGrupoModalidad':{
                    name:  'ActualizaPolizaGrupoModalidad',
                    path: 'api/deceso/mantenimiento/polizaGrupo/modalidad'
                },
                'methodObtenerArchivos':{
                    name:  'ObtenerArchivos',
                    path: 'api/deceso/archivos-interes/obtener'
                },
                'methodActualizar':{
                    name:  'Actualizar',
                    path: 'api/deceso/archivos-interes/actualizar'
                },
                'methodCargarArchivo':{
                    name:  'CargarArchivo',
                    path: 'api/deceso/archivos-interes/cargar'
                },
                'methodGetDescargarArchivo':{
                    name:  'GetDescargarArchivo',
                    path: 'api/deceso/archivos-interes/descargar/{codigo}'
                },
                'methodGetDescargarArchivo64':{
                    name:  'GetDescargarArchivo64',
                    path: 'api/deceso/archivos-interes/descargar/{codigo}/64'
                },
                'methodRegistrarEmision':{
                    name:  'RegistrarEmision',
                    path: 'api/deceso/emision'
                },
            }
        },
        controllerRequerimiento: {
            actions : {
                'methodGetParametrosMotivos':{
                    name:  'GetParametrosMotivos',
                    path: 'api/cobranza/deceso/requerimientos/parametros'
                },
                'methodgetPolizas':{
                    name:  'getPolizas',
                    path: 'api/cobranza/deceso/{deceso_Id}/ejecutivoCobranza/{ejecutivoCobranza_Id}'
                },
                'methodGetRequerimientosUsuarios':{
                    name:  'GetRequerimientosUsuarios',
                    path: 'api/cobranza/decesos/requerimientos/ejecutivoCobranza/{ejecutivoCobranza_Id}'
                },
                'methodRegistrarRequerimiento':{
                    name:  'RegistrarRequerimiento',
                    path: 'api/cobranza/deceso/{deceso_id}/ejecutivoCobranza/{ejecutivoCobranza_Id}/requerimiento'
                },
                'methodRegistrarRequerimientoEvento':{
                    name:  'RegistrarRequerimientoEvento',
                    path: 'api/cobranza/requerimiento/{requerimiento_Id}/evento'
                },
                'methodRecuperarDocumento':{
                    name:  'RecuperarDocumento',
                    path: 'api/cobranza/requerimiento/{requerimiento_Id}/documento/{documento_Id}'
                },
            }
        },
        controllerMailTemplate: {
            actions : {
                'methodSendMailTemplate':{
                    name:  'SendMailTemplate',
                    path: 'api/mail/poliza/template'
                },
                'methodInsertTemplateMail':{
                    name:  'InsertTemplateMail',
                    path: 'api/mail/template/insert'
                },
                'methodUpdateTemplateMail':{
                    name:  'UpdateTemplateMail',
                    path: 'api/mail/template/update'
                },
                'methodDeleteTemplateMail':{
                    name:  'DeleteTemplateMail',
                    path: 'api/mail/template/delete'
                },
                'methodGetTemplateMail':{
                    name:  'GetTemplateMail',
                    path: 'api/mail/template/detail?codigoCompania={codigoCompania}&codigoRamo={codigoRamo}'
                },
                'methodGetListTemplateMail':{
                    name:  'GetListTemplateMail',
                    path: 'api/mail/template/list?nombreTexto={nombreTexto}'
                },
            }
        },
        controllerMail: {
            actions : {
                'methodSendMailCotizacion':{
                    name:  'SendMailCotizacion',
                    path: 'api/general/mail/cotizacion/sendMail'
                },
                'methodSendMailEmisionAutoNuevo':{
                    name:  'SendMailEmisionAutoNuevo',
                    path: 'api/general/mail/emision/autos'
                },
                'methodSendMailEmisionSoat':{
                    name:  'SendMailEmisionSoat',
                    path: 'api/general/mail/emisionSoat/sendMail'
                },
                'methodSendMailEmisionBancarioSoat':{
                    name:  'SendMailEmisionBancarioSoat',
                    path: 'api/general/mail/emisionSoat/sendeMailEmisionBancario'
                },
                'methodSendMailCotizacionHogar':{
                    name:  'SendMailCotizacionHogar',
                    path: 'api/general/mail/cotizacionHogar/sendMail'
                },
                'methodSendMailCotizacionAccidente':{
                    name:  'SendMailCotizacionAccidente',
                    path: 'api/general/mail/cotizacionAccidente/sendMail'
                },
                'methodSendMailCotizacionTransporte':{
                    name:  'SendMailCotizacionTransporte',
                    path: 'api/general/mail/cotizacionTransporte/sendMail'
                },
                'methodSendMailEmisionUsadoNotificar':{
                    name:  'SendMailEmisionUsadoNotificar',
                    path: 'api/general/mail/emision/usado/notificar/inspeccion/{tipo}'
                },
                'methodSendMailActualizarModelo':{
                    name:  'SendMailActualizarModelo',
                    path: 'api/general/mail/actualizarmodelo/sendMail'
                },
                'methodSendMailCotizacion1':{
                    name:  'SendMailCotizacion1',
                    path: 'api/general/mail/mail/eciok'
                },
                'methodSendMailDocumento':{
                    name:  'SendMailDocumento',
                    path: 'api/general/mail/documento/sendMail'
                },
                'methodSendMailCotizacionVida':{
                    name:  'SendMailCotizacionVida',
                    path: 'api/general/mail/cotizacionVida/sendMail'
                },
                'methodSendMailCotizacionDeceso':{
                    name:  'SendMailCotizacionDeceso',
                    path: 'api/general/mail/cotizacion/deceso'
                },
                'methodSendMailCotizacionSalud':{
                    name:  'SendMailCotizacionSalud',
                    path: 'api/general/mail/cotizacion/salud'
                },
                'methodSendMailSolicitudSalud':{
                    name:  'SendMailSolicitudSalud',
                    path: 'api/general/mail/solicitud/salud'
                },
            }
        },
        controllerMydream: {
            actions : {
                'methodReporteCotizacionAutos':{
                    name:  'ReporteCotizacionAutos',
                    path: 'api/mydream/autos/cotizacion/file/{numeroCompania}/{numeroDocumento}/{numeroRamo}'
                },
                'methodReporteCotizacionHogar':{
                    name:  'ReporteCotizacionHogar',
                    path: 'api/mydream/hogar/cotizacion/file/{numeroCompania}/{numeroDocumento}/{numeroRamo}'
                },
                'methodReporteCotizacionSalud':{
                    name:  'ReporteCotizacionSalud',
                    path: 'api/mydream/salud/cotizacion/file/{numeroDocumento}'
                },
                'methodReporteCotizacionEmpresa':{
                    name:  'ReporteCotizacionEmpresa',
                    path: 'api/mydream/empresa/cotizacion/file/{numeroDocumento}'
                },
                'methodReporteCotizacion':{
                    name:  'ReporteCotizacion',
                    path: 'api/mydream/vida/cotizacion/file/{numeroCotizacion}'
                },
                'methodReporteEmisionSCTR':{
                    name:  'ReporteEmisionSCTR',
                    path: 'api/mydream/sctr/emision/file/{numeroCompania}/{numeroPoliza}'
                },
                'methodReporteEmisionAutos':{
                    name:  'ReporteEmisionAutos',
                    path: 'api/mydream/autos/emision/file/{numeroPoliza}'
                },
            }
        },
        controllerFinanciamiento: {
            actions : {
                'methodGetListFinanciamiento':{
                    name:  'GetListFinanciamiento',
                    path: 'api/general/financiamiento/tipo/{tip}/{codPro}'
                },
                'methodGetListFinanciamiento':{
                    name:  'GetListFinanciamiento',
                    path: 'api/general/financiamiento/tipoPorRol/{tip}/{codPro}/{codigoRol}'
                },
                'methodGetListDiaGracia':{
                    name:  'GetListDiaGracia',
                    path: 'api/general/financiamiento/diagracia'
                },
                'methodGetListNumeroCuota':{
                    name:  'GetListNumeroCuota',
                    path: 'api/general/financiamiento/numerocuota'
                },
                'methodGetListaFinanciamiento':{
                    name:  'GetListaFinanciamiento',
                    path: 'api/general/financiamiento/tipo/{mcaAnual}/{codigoRamo}/{codigoProducto}'
                },
                'methodGetInfoUser':{
                    name:  'GetInfoUser',
                    path: 'api/general/financiamiento/info'
                },
            }
        },
        controllerTransporte: {
            actions : {
                'methodGetListByCodRamo':{
                    name:  'GetListByCodRamo',
                    path: 'api/transporte/listaValuacionMercaderia/{CodigoRamo}'
                },
                'methodGetCalculoPrima':{
                    name:  'GetCalculoPrima',
                    path: 'api/transporte/CalcularPrimaAplicacion'
                },
                'methodGetRiesgoAduana':{
                    name:  'GetRiesgoAduana',
                    path: 'api/transporte/ObtenerRiesgoAduana'
                },
                'methodGetCalcularPrima':{
                    name:  'GetCalcularPrima',
                    path: 'api/transporte/calcularprima'
                },
                'methodGetListAlmacen':{
                    name:  'GetListAlmacen',
                    path: 'api/transporte/listarAlmacen'
                },
                'methodGetPolizaBuscarAplicTrans':{
                    name:  'GetPolizaBuscarAplicTrans',
                    path: 'api/transporte/aplicacion/buscaremisiones'
                },
                'methodGetPolizaBuscarAplicTransPaginado':{
                    name:  'GetPolizaBuscarAplicTransPaginado',
                    path: 'api/transporte/aplicacion/buscaremisionespag'
                },
                'methodListarRiesgosAplicacion':{
                    name:  'ListarRiesgosAplicacion',
                    path: 'api/transporte/aplicacion/listarriesgos/{CodCia}/{numPoliza}/{numShipTo}'
                },
                'methodListarMateriaAseguradaPorCodigo':{
                    name:  'ListarMateriaAseguradaPorCodigo',
                    path: 'api/transporte/aplicacion/listarMateriaAseg/{codigoMateriaAsegurada}'
                },
                'methodCalcularPrimaApl':{
                    name:  'CalcularPrimaApl',
                    path: 'api/transporte/aplicacion/calcularprima'
                },
                'methodInsertAplicacionTransporte':{
                    name:  'InsertAplicacionTransporte',
                    path: 'api/transporte/aplicacion/grabar'
                },
                'methodobtenerLongitudGuiaFactProforma':{
                    name:  'obtenerLongitudGuiaFactProforma',
                    path: 'api/transporte/aplicacion/obtenerLongitudGuia'
                },
                'methodGetMarcoRiesgo':{
                    name:  'GetMarcoRiesgo',
                    path: 'api/transporte/aplicacion/marcoriesgo'
                },
            }
        },
        controllerAccidente: {
            actions : {
                'methodDeleteRiesgoCotizacion':{
                    name:  'DeleteRiesgoCotizacion',
                    path: 'api/accidente/riesgo/eliminar'
                },
                'methodGetListAutoOcupacion':{
                    name:  'GetListAutoOcupacion',
                    path: 'api/accidente/ocupacion/autocomplete/{ocupacion}'
                },
                'methodGetListFranquicia':{
                    name:  'GetListFranquicia',
                    path: 'api/accidente/franquicia/listar/{cobertura}'
                },
                'methodGetCoberturaListarByCodigoNombreCobertura':{
                    name:  'GetCoberturaListarByCodigoNombreCobertura',
                    path: 'api/accidente/Cobertura/Listar/{CodigoCobertura}/{NombreCobertura}'
                },
                'methodGetCoberturaListarByCodigoCobertura':{
                    name:  'GetCoberturaListarByCodigoCobertura',
                    path: 'api/accidente/Cobertura/Listar/{CodigoCobertura}?NombreCobertura={NombreCobertura}'
                },
                'methodGetClausulaListarByCodigoNombreClausula':{
                    name:  'GetClausulaListarByCodigoNombreClausula',
                    path: 'api/accidente/Clausula/Listar/{CodigoClausula}/{NombreClausula}'
                },
                'methodGetClausulaListarByCodigoClausula':{
                    name:  'GetClausulaListarByCodigoClausula',
                    path: 'api/accidente/Clausula/Listar/{CodigoClausula}?NombreClausula={NombreClausula}'
                },
                'methodGetExposicionListarByCodigoYNombreExposicion':{
                    name:  'GetExposicionListarByCodigoYNombreExposicion',
                    path: 'api/accidente/Exposicion/Listar/{CodigoExposicion}/{NombreExposicion}'
                },
                'methodGetExposicionListarByCodigo':{
                    name:  'GetExposicionListarByCodigo',
                    path: 'api/accidente/Exposicion/Listar/{CodigoExposicion}?NombreExposicion={NombreExposicion}'
                },
                'methodGetBandejaAccidente':{
                    name:  'GetBandejaAccidente',
                    path: 'api/accidente/bandeja/listar'
                },
                'methodLoadAsegurado':{
                    name:  'LoadAsegurado',
                    path: 'api/accidente/asegurado/cargar'
                },
                'methodGetListAsegurado':{
                    name:  'GetListAsegurado',
                    path: 'api/accidente/asegurado/listar/{numeroEmision}/{numeroRiesgo}'
                },
                'methodGetListCotizacionVigente':{
                    name:  'GetListCotizacionVigente',
                    path: 'api/accidente/bandejapaginado'
                },
            }
        },
        controllerGeneral: {
            actions : {
                'methodGetOcupacion':{
                    name:  'GetOcupacion',
                    path: 'api/general/ocupacion?codPrf={codPrf}&desPrf={desPrf}'
                },
                'methodGetActividadEconomica':{
                    name:  'GetActividadEconomica',
                    path: 'api/general/actividadeconomica'
                },
                'methodGetActividadEconomicaSunat':{
                    name:  'GetActividadEconomicaSunat',
                    path: 'api/general/actividadeconomica/sunat'
                },
                'methodGetActividadEconomicaPoliza':{
                    name:  'GetActividadEconomicaPoliza',
                    path: 'api/general/actividadeconomica/poliza'
                },
                'methodGetTipoCambio':{
                    name:  'GetTipoCambio',
                    path: 'api/general/tipocambio'
                },
                'methodGetListPlan':{
                    name:  'GetListPlan',
                    path: 'api/general/plan/{codCom}/{codRam}/{codMod}/{codCam}'
                },
                'methodGetGestorOficina':{
                    name:  'GetGestorOficina',
                    path: 'api/general/gestoroficina/{codCia}/{codAgente}'
                },
                'methodGetListCargo':{
                    name:  'GetListCargo',
                    path: 'api/general/cargo'
                },
                'methodGetListTipoMoneda':{
                    name:  'GetListTipoMoneda',
                    path: 'api/general/tipomoneda'
                },
                'methodGetListMateriaAsegurada':{
                    name:  'GetListMateriaAsegurada',
                    path: 'api/general/materiaAsegurada'
                },
                'methodGetTable':{
                    name:  'GetTable',
                    path: 'api/general/table?code={code}&field={field}&description={description}'
                },
                'methodGetListVariableOIMPag':{
                    name:  'GetListVariableOIMPag',
                    path: 'api/general/variablesoimpaginado'
                },
                'methodGeConsultarVariableOIM':{
                    name:  'GeConsultarVariableOIM',
                    path: 'api/general/variablesoim/{campo}/{codigo}'
                },
                'methodDelVariableOIM':{
                    name:  'DelVariableOIM',
                    path: 'api/general/variablesoim/{campo}/{codigo}'
                },
                'methodInsVariableOIM':{
                    name:  'InsVariableOIM',
                    path: 'api/general/variablesoim'
                },
                'methodUpdVariableOIM':{
                    name:  'UpdVariableOIM',
                    path: 'api/general/variablesoim'
                },
                'methodGetListEstadoCivil':{
                    name:  'GetListEstadoCivil',
                    path: 'api/general/estadocivil'
                },
                'methodGetListFrecuenciaPago':{
                    name:  'GetListFrecuenciaPago',
                    path: 'api/general/frecuenciapago?codigo={codigo}&descripcion={descripcion}'
                },
                'methodGetListFrecuenciaPagoByCodigo':{
                    name:  'GetListFrecuenciaPagoByCodigo',
                    path: 'api/general/frecuenciapago/{codigo}?descripcion={descripcion}'
                },
                'methodGetListFrecuenciaPagoByCodigoDesc':{
                    name:  'GetListFrecuenciaPagoByCodigoDesc',
                    path: 'api/general/frecuenciapago/{codigo}/{descripcion}'
                },
                'methodGetCalcularEdad':{
                    name:  'GetCalcularEdad',
                    path: 'api/general/edad/{fechaNacimiento}'
                },
                'methodGetValidaLugarAltoRiesgo':{
                    name:  'GetValidaLugarAltoRiesgo',
                    path: 'api/general/validaAltoRiesgo'
                },
                'methodGetListEntidadFinanciera':{
                    name:  'GetListEntidadFinanciera',
                    path: 'api/general/entidadfinanciera'
                },
                'methodGetListTipoCuenta':{
                    name:  'GetListTipoCuenta',
                    path: 'api/general/tipocuenta'
                },
                'methodGetListMoneda':{
                    name:  'GetListMoneda',
                    path: 'api/general/moneda'
                },
                'methodGetListMonedaVida':{
                    name:  'GetListMonedaVida',
                    path: 'api/general/moneda/vida'
                },
                'methodGetListMonedaDeceso':{
                    name:  'GetListMonedaDeceso',
                    path: 'api/general/moneda/deceso'
                },
                'methodGetListTipoTarjeta':{
                    name:  'GetListTipoTarjeta',
                    path: 'api/general/tipotarjeta'
                },
                'methodGetListParentesco':{
                    name:  'GetListParentesco',
                    path: 'api/general/parentesco/{codCia}'
                },
                'methodGetListCodigoTarjeta':{
                    name:  'GetListCodigoTarjeta',
                    path: 'api/general/codigotarjeta/{codCia}/{CodigoTipoTarjeta}'
                },
                'methodGetListGestor':{
                    name:  'GetListGestor',
                    path: 'api/general/gestorentidad/{TipoGestor}/{CodigoEntidad}'
                },
                'methodGetSueldoMinimo':{
                    name:  'GetSueldoMinimo',
                    path: 'api/general/sueldominimo'
                },
                'methodGetEnmascarCuenta':{
                    name:  'GetEnmascarCuenta',
                    path: 'api/general/enmascarCuenta/{codigoEntidad}/{tipoCuenta}/{codigoMoneda}/{cuentaCalcular}'
                },
                'methodGetEnmascarTarjeta':{
                    name:  'GetEnmascarTarjeta',
                    path: 'api/general/enmascarTarjeta/{tipoTarjeta}/{numeroTarjeta}'
                },
                'methodGetListSystemParameter':{
                    name:  'GetListSystemParameter',
                    path: 'api/general/sp'
                },
                'methodGetTemplateFile':{
                    name:  'GetTemplateFile',
                    path: 'api/general/templatefile'
                },
                'methodInsTemplateFile':{
                    name:  'InsTemplateFile',
                    path: 'api/general/instemplatefile/{grupo}/{valor}/{desc}'
                },
                'methodGetListCompaniaOim':{
                    name:  'GetListCompaniaOim',
                    path: 'api/general/Compania/oim'
                },
                'methodGetListCompania':{
                    name:  'GetListCompania',
                    path: 'api/general/Compania'
                },
                'methodGetSexo':{
                    name:  'GetSexo',
                    path: 'api/general/sexo'
                },
                'methodRegistrarAuditoria':{
                    name:  'RegistrarAuditoria',
                    path: 'api/general/auditoria'
                },
                'methodGetClausula':{
                    name:  'GetClausula',
                    path: 'api/general/clausula/{idClausula}?codRamo={codRamo}&ciiu={ciiu}'
                },
                'methodSaveClausula':{
                    name:  'SaveClausula',
                    path: 'api/general/clausula'
                },
                'methodDeleteClausula':{
                    name:  'DeleteClausula',
                    path: 'api/general/clausula/{idClausula}'
                },
                'methodGetListClausula':{
                    name:  'GetListClausula',
                    path: 'api/general/clausulas?filtro={filtro}&codRamo={codRamo}'
                },
                'methodSaveSuscriptor':{
                    name:  'SaveSuscriptor',
                    path: 'api/general/suscriptor'
                },
                'methodUpdateSuscriptor':{
                    name:  'UpdateSuscriptor',
                    path: 'api/general/suscriptor/{codigoSuscriptor}'
                },
                'methodGetSuscriptor':{
                    name:  'GetSuscriptor',
                    path: 'api/general/suscriptor/{codigoSuscriptor}'
                },
                'methodGetListSuscriptor':{
                    name:  'GetListSuscriptor',
                    path: 'api/general/suscriptores?nombreCompleto={nombreCompleto}&codigoUsuario={codigoUsuario}&estado={estado}&cantidadFilasPorPagina={cantidadFilasPorPagina}&paginaActual={paginaActual}'
                },
                'methodGetListSuscriptorOficina':{
                    name:  'GetListSuscriptorOficina',
                    path: 'api/general/oficinas/suscriptores?codigoOficina={codigoOficina}&nombreOficina={nombreOficina}&cantidadFilasPorPagina={cantidadFilasPorPagina}&paginaActual={paginaActual}'
                },
                'methodSaveSuscriptorOficina':{
                    name:  'SaveSuscriptorOficina',
                    path: 'api/general/suscriptor/{codigoSuscriptor}/oficinas'
                },
                'methodGetListTipoComunicacion':{
                    name:  'GetListTipoComunicacion',
                    path: 'api/general/parametro/tipocomunicacion/{codigoCompania}/{codigoRamo}'
                },
                'methodGetListTipoConstruccion':{
                    name:  'GetListTipoConstruccion',
                    path: 'api/general/parametro/tipoConstruccion/{codigoCompania}/{codigoRamo}'
                },
                'methodGetList':{
                    name:  'GetList',
                    path: 'api/general/edadActuarial/{fechaNacimiento}'
                },
                'methodGetListMotivoSolicitud':{
                    name:  'GetListMotivoSolicitud',
                    path: 'api/general/motivosolicitud'
                },
                'methodGetListSeguroSalud':{
                    name:  'GetListSeguroSalud',
                    path: 'api/general/seguroSalud'
                },
                'methodValidarAccesoUsuario':{
                    name:  'ValidarAccesoUsuario',
                    path: 'api/general/accesoUsuario/{codigoAplicacion}'
                },
                'methodObtenerDescuentoIntegralidad':{
                    name:  'ObtenerDescuentoIntegralidad',
                    path: 'api/general/descuentoIntegralidad/{codigoCompania}/{codigoAgente}/{codigoRamo}/{tipoDocumento}/{numeroDocumento}'
                },
                'methodGetListTipoTransmision':{
                    name:  'GetListTipoTransmision',
                    path: 'api/general/tipoTransmision?codigoCompania={codigoCompania}'
                },
                'methodEsDescuentoIntegralidadParaAgentes':{
                    name:  'EsDescuentoIntegralidadParaAgentes',
                    path: 'api/general/EsDescuentoIntegralidadParaAgentes'
                },
                'methodObtenerAccionistas':{
                    name:  'ObtenerAccionistas',
                    path: 'api/general/accionista/{typeDoc}/{NumDoc}'
                },
                'methodGetListTipoRelacion':{
                    name:  'GetListTipoRelacion',
                    path: 'api/general/tipoRelacion'
                },
                'methodGetEncuesta':{
                    name:  'GetEncuesta',
                    path: 'api/general/encuesta/{codigoCia}/{codigoRamo}'
                },
                'methodGuardarEncuesta':{
                    name:  'GuardarEncuesta',
                    path: 'api/general/encuesta'
                },
                'methodGetCurrentServicesVersion':{
                    name:  'GetCurrentServicesVersion',
                    path: 'api/general/services/version'
                },
            }
        },
        controllerTipoDocumento: {
            actions : {
                'methodgetTipoDocumento':{
                    name:  'getTipoDocumento',
                    path: 'api/general/tipodoc/nacional'
                },
                'methodgetSctrListTipoDocumento':{
                    name:  'getSctrListTipoDocumento',
                    path: 'api/general/tipodoc/sctr'
                },
                'methodgetTipoDocumentoVida':{
                    name:  'getTipoDocumentoVida',
                    path: 'api/general/tipodoc/vida'
                },
            }
        },
        controllerCampoSanto: {
            actions : {
                'methodGetListProductos':{
                    name:  'GetListProductos',
                    path: 'api/camposanto/productos?codRamo={codRamo}&nombreCampoSanto={nombreCampoSanto}&codProducto={codProducto}&nombreProducto={nombreProducto}&codCategoria={codCategoria}&cantidadFilasPorPagina={cantidadFilasPorPagina}&paginaActual={paginaActual}'
                },
                'methodUpdateProducto':{
                    name:  'UpdateProducto',
                    path: 'api/camposanto/producto'
                },
                'methodGetListTipologiasFinancimientos':{
                    name:  'GetListTipologiasFinancimientos',
                    path: 'api/camposanto/financiamientos'
                },
                'methodUpdateTipologiaFinancimiento':{
                    name:  'UpdateTipologiaFinancimiento',
                    path: 'api/camposanto/financiamiento'
                },
                'methodGetListPerfilEmisor':{
                    name:  'GetListPerfilEmisor',
                    path: 'api/camposanto/perfil/emisores?codigoNombre={codigoNombre}&cantidadFilasPorPagina={cantidadFilasPorPagina}&paginaActual={paginaActual}'
                },
                'methodGetListEmisorAgenteSede':{
                    name:  'GetListEmisorAgenteSede',
                    path: 'api/camposanto/emisores?idEmisor={idEmisor}&idAgente={idAgente}&idCampoSanto={idCampoSanto}&codRamo={codRamo}&cantidadFilasPorPagina={cantidadFilasPorPagina}&paginaActual={paginaActual}'
                },
                'methodInsertEmisorAgenteSede':{
                    name:  'InsertEmisorAgenteSede',
                    path: 'api/camposanto/emisor'
                },
                'methodUpdateEmisorAgenteSede':{
                    name:  'UpdateEmisorAgenteSede',
                    path: 'api/camposanto/emisor'
                },
                'methodGetListGestionDocumentos':{
                    name:  'GetListGestionDocumentos',
                    path: 'api/camposanto/documentos'
                },
                'methodInsertGestionDocumento':{
                    name:  'InsertGestionDocumento',
                    path: 'api/camposanto/documento'
                },
                'methodUpdateGestionDocumento':{
                    name:  'UpdateGestionDocumento',
                    path: 'api/camposanto/documento'
                },
                'methodGetListTiposDocumentos':{
                    name:  'GetListTiposDocumentos',
                    path: 'api/camposanto/tiposDocumentos'
                },
                'methodGetListCorreosExcepcional':{
                    name:  'GetListCorreosExcepcional',
                    path: 'api/camposanto/correos?fechaCreacion={fechaCreacion}&codRamo={codRamo}&correo={correo}&nombreCampoSanto={nombreCampoSanto}&cantidadFilasPorPagina={cantidadFilasPorPagina}&paginaActual={paginaActual}'
                },
                'methodInsertCorreoExcepcional':{
                    name:  'InsertCorreoExcepcional',
                    path: 'api/camposanto/correo'
                },
                'methodUpdateCorreoExcepcional':{
                    name:  'UpdateCorreoExcepcional',
                    path: 'api/camposanto/correo'
                },
                'methodGetCotizacion':{
                    name:  'GetCotizacion',
                    path: 'api/camposanto/cotizacion/{idCotizacion}'
                },
                'methodDescargarArchivo':{
                    name:  'DescargarArchivo',
                    path: 'api/camposanto/cotizacion/{idCotizacion}/archivo?tipoOperacion={tipoOperacion}'
                },
                'methodGetListVendedores':{
                    name:  'GetListVendedores',
                    path: 'api/camposanto/vendedores?filtro={filtro}&codCia={codCia}&cantidadFilasPorPagina={cantidadFilasPorPagina}&paginaActual={paginaActual}'
                },
                'methodGetListAgencias':{
                    name:  'GetListAgencias',
                    path: 'api/camposanto/agencias?filtro={filtro}&codCia={codCia}&cantidadFilasPorPagina={cantidadFilasPorPagina}&paginaActual={paginaActual}'
                },
                'methodGetListTipoEmision':{
                    name:  'GetListTipoEmision',
                    path: 'api/camposanto/tipoEmision'
                },
                'methodgetRamo':{
                    name:  'getRamo',
                    path: 'api/camposanto/Ramo'
                },
                'methodgetEdad':{
                    name:  'getEdad',
                    path: 'api/camposanto/Edad'
                },
                'methodgetGrado':{
                    name:  'getGrado',
                    path: 'api/camposanto/Grado'
                },
                'methodgetCampoSanto':{
                    name:  'getCampoSanto',
                    path: 'api/camposanto/CampoSanto/{idRamo}'
                },
                'methodgetTipoContrato':{
                    name:  'getTipoContrato',
                    path: 'api/camposanto/TipoContrato/{idRamo}'
                },
                'methodGetModalidad':{
                    name:  'GetModalidad',
                    path: 'api/camposanto/Modalidad?idRamo={idRamo}&idTipoContrato={idTipoContrato}&idCampoSanto={idCampoSanto}'
                },
                'methodGetProductos':{
                    name:  'GetProductos',
                    path: 'api/camposanto/Producto/Ramo/{idRamo}/Modalidad/{idModalidad}/CampoSanto/{idCampoSanto}/Prima/{idPrima}/TipoContrato/{idTipoContrato}?numContratoRelacionado={numContratoRelacionado}'
                },
                'methodGetPrecioProductos':{
                    name:  'GetPrecioProductos',
                    path: 'api/camposanto/Producto/Ramo/{idRamo}/Modalidad/{idModalidad}/CampoSanto/{idCampoSanto}/Prima/{idPrima}/TipoContrato/{idTipoContrato}/Producto/{idProducto}?numContratoRelacionado={numContratoRelacionado}'
                },
                'methodGetFraccionamientoProducto':{
                    name:  'GetFraccionamientoProducto',
                    path: 'api/camposanto/Fraccionamiento/Modalidad/{idModalidad}/CampoSanto/{idCampoSanto}/TipoContrato/{idTipoContrato}/Producto/{idProducto}'
                },
                'methodGetCuotas':{
                    name:  'GetCuotas',
                    path: 'api/camposanto/Cuota'
                },
                'methodGetPersonEquifax':{
                    name:  'GetPersonEquifax',
                    path: 'api/camposanto/InformacionEquifax/{dni}'
                },
                'methodEvaluacion':{
                    name:  'Evaluacion',
                    path: 'api/camposanto/Evaluacion'
                },
                'methodgetTipologiaProductos':{
                    name:  'getTipologiaProductos',
                    path: 'api/camposanto/TipologiaProductos'
                },
                'methodgetTipologiaFinanciamientos':{
                    name:  'getTipologiaFinanciamientos',
                    path: 'api/camposanto/TipologiaFinanciamientos'
                },
                'methodgetCategoriasProducto':{
                    name:  'getCategoriasProducto',
                    path: 'api/camposanto/Categorias'
                },
                'methodBuscarSedes':{
                    name:  'BuscarSedes',
                    path: 'api/camposanto/Sedes/coincidencia/{texto}'
                },
                'methodgetSedes':{
                    name:  'getSedes',
                    path: 'api/camposanto/Sedes'
                },
                'methodbuscarcorreoExcepcional':{
                    name:  'buscarcorreoExcepcional',
                    path: 'api/camposanto/BuscarCorreoExcepcional'
                },
                'methodGuardarCotizacion':{
                    name:  'GuardarCotizacion',
                    path: 'api/camposanto/Guardar/Cotizacion'
                },
                'methodmodificarCotizacion':{
                    name:  'modificarCotizacion',
                    path: 'api/camposanto/modificar/cotizacion'
                },
                'methodenviarCorreoExcepcional':{
                    name:  'enviarCorreoExcepcional',
                    path: 'api/camposanto/EnviarCorreoExcepcional'
                },
                'methoddescargarCotizacionPDF':{
                    name:  'descargarCotizacionPDF',
                    path: 'api/camposanto/DescargarCotizacionPDF/{idCotizacion}'
                },
                'methodgetMotivo':{
                    name:  'getMotivo',
                    path: 'api/camposanto/Motivos/{idTipo}'
                },
                'methodCerrarCotizacion':{
                    name:  'CerrarCotizacion',
                    path: 'api/camposanto/CerrarCotizacion'
                },
                'methodGuardarBeneficiario':{
                    name:  'GuardarBeneficiario',
                    path: 'api/camposanto/cotizacion/{idCotizacion}/beneficiario'
                },
                'methodGuardarTomador':{
                    name:  'GuardarTomador',
                    path: 'api/camposanto/GuardarTomador'
                },
                'methodGuardarAval':{
                    name:  'GuardarAval',
                    path: 'api/camposanto/GuardarAval'
                },
                'methodGuardarAdicional':{
                    name:  'GuardarAdicional',
                    path: 'api/camposanto/GuardarAdicional'
                },
                'methodUptBeneficiario':{
                    name:  'UptBeneficiario',
                    path: 'api/camposanto/cotizacion/{idCotizacion}/beneficiario'
                },
                'methodUptTomador':{
                    name:  'UptTomador',
                    path: 'api/camposanto/Tomador'
                },
                'methodUptAval':{
                    name:  'UptAval',
                    path: 'api/camposanto/Aval'
                },
                'methodUptAdicional':{
                    name:  'UptAdicional',
                    path: 'api/camposanto/Adicional'
                },
                'methodDelBeneficiario':{
                    name:  'DelBeneficiario',
                    path: 'api/camposanto/Beneficiario/{idAsociado}'
                },
                'methodDelTomador':{
                    name:  'DelTomador',
                    path: 'api/camposanto/Tomador/{idAsociado}'
                },
                'methodDelAval':{
                    name:  'DelAval',
                    path: 'api/camposanto/Aval/{idAsociado}'
                },
                'methodDelAdicional':{
                    name:  'DelAdicional',
                    path: 'api/camposanto/Adicional/{idAsociado}'
                },
                'methodGetCotizaciones':{
                    name:  'GetCotizaciones',
                    path: 'api/camposanto/Cotizaciones'
                },
                'methodgetEstado':{
                    name:  'getEstado',
                    path: 'api/camposanto/Estado/{idPerfil}'
                },
                'methodgetFraccionamiento':{
                    name:  'getFraccionamiento',
                    path: 'api/camposanto/fraccionamiento/ramo/{idRamo}'
                },
                'methodgetDocumento':{
                    name:  'getDocumento',
                    path: 'api/camposanto/documentos/ramo/{idRamo}/tipocontrato/{idtipocontrato}/cotizacion/{idCotizacion}'
                },
                'methodaltaDocumento':{
                    name:  'altaDocumento',
                    path: 'api/camposanto/AltaDocumento'
                },
                'methodEliminarDocumento':{
                    name:  'EliminarDocumento',
                    path: 'api/camposanto/EliminarDocumento/idCotizacionDocumento/{idCotizacionDocumento}/idRamo/{idRamo}/idCotizacion/{idCotizacion}/idTipoContrato/{idTipoContrato}'
                },
                'methodgetArchivoDocumento':{
                    name:  'getArchivoDocumento',
                    path: 'api/camposanto/getDocumento/codigoGestorDocumental/{idGestor}'
                },
                'methodSimular':{
                    name:  'Simular',
                    path: 'api/camposanto/Simular'
                },
                'methodGetDatoAdicional':{
                    name:  'GetDatoAdicional',
                    path: 'api/camposanto/DatosAdicionales/cotizacion/{idCotizacion}'
                },
                'methodGetTomador':{
                    name:  'GetTomador',
                    path: 'api/camposanto/Tomador/cotizacion/{idCotizacion}'
                },
                'methodGetAval':{
                    name:  'GetAval',
                    path: 'api/camposanto/Aval/cotizacion/{idCotizacion}'
                },
                'methodGetListBeneficiarios':{
                    name:  'GetListBeneficiarios',
                    path: 'api/camposanto/Beneficiario/cotizacion/{idCotizacion}'
                },
                'methodListaParentesco':{
                    name:  'ListaParentesco',
                    path: 'api/camposanto/beneficiario/parentesco'
                },
                'methodGetFechaVencimiento':{
                    name:  'GetFechaVencimiento',
                    path: 'api/camposanto/cotizacion/fechaVencimiento?idFraccionamiento={idFraccionamiento}&idTipoContrato={idTipoContrato}&fechaEfecto={fechaEfecto}&codRamo={codRamo}'
                },
                'methodGuardarEmision':{
                    name:  'GuardarEmision',
                    path: 'api/camposanto/emision'
                },
                'methodGenerarNumeroPoliza':{
                    name:  'GenerarNumeroPoliza',
                    path: 'api/camposanto/numeroPoliza?idRamo={idRamo}&idTipoContrato={idTipoContrato}&idCampoSanto={idCampoSanto}&numeroContrato={numeroContrato}'
                },
                'methodValidacionEdad':{
                    name:  'ValidacionEdad',
                    path: 'api/camposanto/edad/validacion?edad={edad}&idFraccionamiento={idFraccionamiento}&idTipoContrato={idTipoContrato}&idRamo={idRamo}'
                },
                'methodGuardarFechaEfectoCotizacion':{
                    name:  'GuardarFechaEfectoCotizacion',
                    path: 'api/camposanto/cotizacion/fechaEfecto'
                },
            }
        },
        controllerFola: {
            actions : {
                'methodlistarContratos':{
                    name:  'listarContratos',
                    path: 'api/fola/contratos/{codigoCompania}/{codigoRamo}?paginaActual={paginaActual}&cantidadFilas={cantidadFilas}&planesActivos={planesActivos}'
                },
                'methodcotizarPoliza':{
                    name:  'cotizarPoliza',
                    path: 'api/fola/poliza/cotizacion'
                },
                'methodemitirPoliza':{
                    name:  'emitirPoliza',
                    path: 'api/fola/poliza/emision'
                },
                'methodobtenerPoliza':{
                    name:  'obtenerPoliza',
                    path: 'api/fola/poliza/{numeroPoliza}/{codigoCompania}/{codigoRamo}'
                },
                'methodlistarDocumentos':{
                    name:  'listarDocumentos',
                    path: 'api/fola/documentos'
                },
                'methodcargarPlantillaAsegurados':{
                    name:  'cargarPlantillaAsegurados',
                    path: 'api/fola/documento/plantillaAsegurados'
                },
                'methodconsultarPlantillaAsegurados':{
                    name:  'consultarPlantillaAsegurados',
                    path: 'api/fola/documento/{numeroDocumento}/plantillaAsegurados'
                },
                'methodlistarOcupaciones':{
                    name:  'listarOcupaciones',
                    path: 'api/fola/ocupaciones'
                },
                'methodregistrarPlan':{
                    name:  'registrarPlan',
                    path: 'api/fola/plan'
                },
                'methodactualizarPlan':{
                    name:  'actualizarPlan',
                    path: 'api/fola/plan'
                },
                'methodcargarCondicionado':{
                    name:  'cargarCondicionado',
                    path: 'api/fola/documento/condicionado'
                },
                'methodeliminarCondicionado':{
                    name:  'eliminarCondicionado',
                    path: 'api/fola/documentos/condicionado/{idCondicionado}/{tipo}'
                },
                'methodconsultarCondicionados':{
                    name:  'consultarCondicionados',
                    path: 'api/fola/documentos?tipoCondicionado={tipoCondicionado}&idPlan={idPlan}'
                },
                'methodconsultarDocumento':{
                    name:  'consultarDocumento',
                    path: 'api/fola/documento/{numeroDocumento}'
                },
                'methodlistarFraccionamientos':{
                    name:  'listarFraccionamientos',
                    path: 'api/fola/parametros?codigoApp={codigoApp}&dominio={dominio}'
                },
            }
        },
        controllerVidaLey: {
            actions : {
                'methodGetListCoberturas':{
                    name:  'GetListCoberturas',
                    path: 'api/vidaley/coberturas/{canttrab}'
                },
                'methodGetListCategorias':{
                    name:  'GetListCategorias',
                    path: 'api/vidaley/categorias'
                },
                'methodGetListParametros':{
                    name:  'GetListParametros',
                    path: 'api/vidaley/parametros'
                },
                'methodCotizarPrimaMinima':{
                    name:  'CotizarPrimaMinima',
                    path: 'api/vidaley/cotizar/prima/minima'
                },
                'methodCotizarPrimas':{
                    name:  'CotizarPrimas',
                    path: 'api/vidaley/cotizar/primas'
                },
                'methodActualizarPrimas':{
                    name:  'ActualizarPrimas',
                    path: 'api/vidaley/cotizacion/{cotizacionId}/primas'
                },
                'methodCargarAseguradosMasivo':{
                    name:  'CargarAseguradosMasivo',
                    path: 'api/vidaley/cotizar/asegurado/masiva'
                },
                'methodResumenCentralizado':{
                    name:  'ResumenCentralizado',
                    path: 'api/vidaley/cotizar/asegurado/rcen/{nromovimiento}'
                },
                'methodCargarAseguradosIndividual':{
                    name:  'CargarAseguradosIndividual',
                    path: 'api/vidaley/cotizar/asegurado/individual'
                },
                'methodValidacionContratante':{
                    name:  'ValidacionContratante',
                    path: 'api/vidaley/cotizacion/contratante/{contratanteId}/validacion'
                },
                'methodGetListActividadesEconomicas':{
                    name:  'GetListActividadesEconomicas',
                    path: 'api/vidaley/actividadesEconomicas?filtro={filtro}&codPeriodo={codPeriodo}&tipoActividad={tipoActividad}&codAgente={codAgente}&numeroPagina={numeroPagina}&tamanioPagina={tamanioPagina}'
                },
                'methodGrabarCotizacionPaso1':{
                    name:  'GrabarCotizacionPaso1',
                    path: 'api/vidaley/cotizar/paso1/contratante'
                },
                'methodActualizarCotizacionPaso1':{
                    name:  'ActualizarCotizacionPaso1',
                    path: 'api/vidaley/cotizacion/paso1/contratante'
                },
                'methodGrabarCotizacionPaso2':{
                    name:  'GrabarCotizacionPaso2',
                    path: 'api/vidaley/cotizar/paso2'
                },
                'methodGrabarCotizacionPaso3':{
                    name:  'GrabarCotizacionPaso3',
                    path: 'api/vidaley/cotizacion/paso3'
                },
                'methodGrabarCotizacionAgentePaso4Agente':{
                    name:  'GrabarCotizacionAgentePaso4Agente',
                    path: 'api/vidaley/cotizacion/paso4/agente'
                },
                'methodGrabarCotizacionSuscriptorPaso4Suscriptor':{
                    name:  'GrabarCotizacionSuscriptorPaso4Suscriptor',
                    path: 'api/vidaley/cotizacion/paso4/suscriptor'
                },
                'methodAnularCotizacionMasiva':{
                    name:  'AnularCotizacionMasiva',
                    path: 'api/vidaley/cotizaciones/anulacion'
                },
                'methodGetListDocuments':{
                    name:  'GetListDocuments',
                    path: 'api/vidaley/busqueda'
                },
                'methodGetCotizacionById':{
                    name:  'GetCotizacionById',
                    path: 'api/vidaley/cotizacion/{id}'
                },
                'methodGetResponseCotizacion':{
                    name:  'GetResponseCotizacion',
                    path: 'api/vidaley/cotizacion/reporte/{id}'
                },
                'methodSendMailCotizacion':{
                    name:  'SendMailCotizacion',
                    path: 'api/vidaley/cotizacion/reporte/correo/{id}'
                },
                'methodCargarAseguradosMasivoValid':{
                    name:  'CargarAseguradosMasivoValid',
                    path: 'api/vidaley/cotizar/asegurado/masiva/valid'
                },
                'methodCargarAseguradosIndividualValid':{
                    name:  'CargarAseguradosIndividualValid',
                    path: 'api/vidaley/cotizar/asegurado/individual/valid'
                },
                'methoddescargaArchivo':{
                    name:  'descargaArchivo',
                    path: 'api/vidaley/descarga/{numdocumento}/{numriesgo}'
                },
                'methoddescargaArchivoTicket':{
                    name:  'descargaArchivoTicket',
                    path: 'api/vidaley/descargaticket/{numticket}/{numriesgo}'
                },
                'methodGetAseguradoEquifax':{
                    name:  'GetAseguradoEquifax',
                    path: 'api/vidaley/equifax'
                },
                'methodGetInfoAplication':{
                    name:  'GetInfoAplication',
                    path: 'api/vidaley/infoaplication'
                },
                'methodCargarAseguradoXRiesgo':{
                    name:  'CargarAseguradoXRiesgo',
                    path: 'api/vidaley/cotizar/cargaaseguradoxriesgo'
                },
                'methodGetInfoEmisionDocumentoById':{
                    name:  'GetInfoEmisionDocumentoById',
                    path: 'api/vidaley/emision/{id}'
                },
                'methodGetZipEmisionDescargar':{
                    name:  'GetZipEmisionDescargar',
                    path: 'api/vidaley/emision/{id}/correo'
                },
                'methodGetZipEmisionDescargar':{
                    name:  'GetZipEmisionDescargar',
                    path: 'api/vidaley/emision/{id}/archivo?tipoOperacion={tipoOperacion}'
                },
                'methodGrabarEmisionPaso1':{
                    name:  'GrabarEmisionPaso1',
                    path: 'api/vidaley/emision/paso1'
                },
                'methodGrabarEmisionPaso2':{
                    name:  'GrabarEmisionPaso2',
                    path: 'api/vidaley/emision/paso2'
                },
                'methodGetListOficinas':{
                    name:  'GetListOficinas',
                    path: 'api/vidaley/oficinas?codigoOficina={codigoOficina}&nombreOficina={nombreOficina}&cantidadFilasPorPagina={cantidadFilasPorPagina}&paginaActual={paginaActual}'
                },
                'methodGetListReporte':{
                    name:  'GetListReporte',
                    path: 'api/vidaley/cotizaciones'
                },
                'methodGetListReporteExcel':{
                    name:  'GetListReporteExcel',
                    path: 'api/vidaley/cotizaciones/archivo'
                },
                'methodGrabarCotizacionExterno':{
                    name:  'GrabarCotizacionExterno',
                    path: 'api/vidaley/cotizacion/canal'
                },
            }
        },
        controllerCotizacionRg: {
            actions : {
                'methodCotizacionEquipoContratista':{
                    name:  'CotizacionEquipoContratista',
                    path: 'api/rrgg/cotizacion/equipocontratista'
                },
                'methodResumenEquipoContratista':{
                    name:  'ResumenEquipoContratista',
                    path: 'api/rrgg/cotizacion/equipocontratista/{nroTramite}/{codigoGrupoProducto}'
                },
                'methodCotizacionResponsabilidadCivil':{
                    name:  'CotizacionResponsabilidadCivil',
                    path: 'api/rrgg/cotizacion/responsabilidadcivil'
                },
                'methodResumenResponsabilidadCivil':{
                    name:  'ResumenResponsabilidadCivil',
                    path: 'api/rrgg/cotizacion/responsabilidadcivil/{nroTramite}/{codigoGrupoProducto}'
                },
                'methodCotizacionTransporteTerrestre':{
                    name:  'CotizacionTransporteTerrestre',
                    path: 'api/rrgg/cotizacion/transporteterrestre'
                },
                'methodResumenTransporteTerrestre':{
                    name:  'ResumenTransporteTerrestre',
                    path: 'api/rrgg/cotizacion/transporteterrestre/{nroTramite}/{codigoGrupoProducto}'
                },
                'methodCalculosHidrocarburos':{
                    name:  'CalculosHidrocarburos',
                    path: 'api/rrgg/cotizacion/CalculosHidrocarburos'
                },
                'methodCotizacionConstruccion':{
                    name:  'CotizacionConstruccion',
                    path: 'api/rrgg/cotizacion/construccion'
                },
                'methodResumenCotizacionConstruccion':{
                    name:  'ResumenCotizacionConstruccion',
                    path: 'api/rrgg/cotizacion/construccion/{nroTramite}/{codigoGrupoProducto}'
                },
                'methodCotizacionDeshonestidad':{
                    name:  'CotizacionDeshonestidad',
                    path: 'api/rrgg/cotizacion/deshonestidad'
                },
                'methodResumenCotizacionDeshonestidad':{
                    name:  'ResumenCotizacionDeshonestidad',
                    path: 'api/rrgg/cotizacion/deshonestidad/{nroTramite}/{codigoGrupoProducto}'
                },
                'methodCotizacionTransporteMaritimoAereo':{
                    name:  'CotizacionTransporteMaritimoAereo',
                    path: 'api/rrgg/cotizacion/transportemaritimoaereo'
                },
                'methodResumenCotizacionTransporteMaritimoAereo':{
                    name:  'ResumenCotizacionTransporteMaritimoAereo',
                    path: 'api/rrgg/cotizacion/transportemaritimoaereo/{nroTramite}/{codigoGrupoProducto}'
                },
                'methodValidarFechaInicial':{
                    name:  'ValidarFechaInicial',
                    path: 'api/rrgg/cotizacion/responsabilidadcivil/validarfechainicial?fecha={fecha}&codProducto={codProducto}'
                },
                'methodClonacionProducto':{
                    name:  'ClonacionProducto',
                    path: 'api/rrgg/cotizacion/clonacion'
                },
                'methodgetListProductosClonados':{
                    name:  'getListProductosClonados',
                    path: 'api/rrgg/cotizacion/clonacion/listar'
                },
                'methodgetListBandeja':{
                    name:  'getListBandeja',
                    path: 'api/rrgg/cotizacion/bandeja/listar'
                },
            }
        },
        controllerSalud: {
            actions : {
                'methodDescargarPlanProducto':{
                    name:  'DescargarPlanProducto',
                    path: 'api/salud/descargar/archivoplan/{codigoRamo}/{codigoModalidad}/{numeroContrato}/{numeroSubContrato}'
                },
                'methodDescargarHistorialPlanProducto':{
                    name:  'DescargarHistorialPlanProducto',
                    path: 'api/salud/descargar/archivoplan/historial/{codigoRamo}/{codigoModalidad}/{numeroContrato}/{numeroSubContrato}/{fechaValidez}'
                },
                'methodObtenerArchivoPlan':{
                    name:  'ObtenerArchivoPlan',
                    path: 'api/salud/archivoPlan/{codigoRamo}/{codigoModalidad}/{numeroContrato}/{numeroSubContrato}'
                },
                'methodListarArchivoPlan':{
                    name:  'ListarArchivoPlan',
                    path: 'api/salud/archivoPlan/historico/{codigoRamo}/{codigoModalidad}/{numeroContrato}/{numeroSubContrato}'
                },
                'methodRegistrarArhivoPlan':{
                    name:  'RegistrarArhivoPlan',
                    path: 'api/salud/archivoPlan'
                },
                'methodGetFinanciamientoTronSalud':{
                    name:  'GetFinanciamientoTronSalud',
                    path: 'api/salud/fraccionamientos/tron'
                },
                'methodInsertarFraccionamientoSalud':{
                    name:  'InsertarFraccionamientoSalud',
                    path: 'api/salud/fraccionamientos'
                },
                'methodEliminarFraccionamientoSalud':{
                    name:  'EliminarFraccionamientoSalud',
                    path: 'api/salud/fraccionamientos/eliminar'
                },
                'methodGetFraccionamientoSalud':{
                    name:  'GetFraccionamientoSalud',
                    path: 'api/salud/fraccionamientos/{codigoCia}/{codigoRamo}/{numeroContrato}/{numeroSubContrato}'
                },
                'methodInsertarValidaEdadSalud':{
                    name:  'InsertarValidaEdadSalud',
                    path: 'api/salud/validaEdades'
                },
                'methodEliminarValidaEdadSalud':{
                    name:  'EliminarValidaEdadSalud',
                    path: 'api/salud/validaEdades/eliminar'
                },
                'methodGetListaValidaEdadSalud':{
                    name:  'GetListaValidaEdadSalud',
                    path: 'api/salud/validaEdades/paginado/{codigoCia}/{codigoRamo}/{numeroContrato}/{numeroSubContrato}'
                },
                'methodObtenerPregntasSalud':{
                    name:  'ObtenerPregntasSalud',
                    path: 'api/salud/cuestionario/preguntas?cod_cuestionario={cod_cuestionario}'
                },
                'methodObtenerRespuestasSalud':{
                    name:  'ObtenerRespuestasSalud',
                    path: 'api/salud/cuestionario/respuestas?nro_cuestionario={nro_cuestionario}'
                },
                'methodObtenerListadoDocumentos':{
                    name:  'ObtenerListadoDocumentos',
                    path: 'api/salud/documentos/listar'
                },
                'methodObtenerListadoDocumentos2':{
                    name:  'ObtenerListadoDocumentos2',
                    path: 'api/salud/documentos/listar2'
                },
                'methodListarPlanMigracionPorContrato':{
                    name:  'ListarPlanMigracionPorContrato',
                    path: 'api/salud/planmigracion/{codigoCia}/{numeroContrato}/{numeroSubContrato}/{prioridadActual}/{continuidadActual}'
                },
                'methodGetTipoContrato':{
                    name:  'GetTipoContrato',
                    path: 'api/salud/tipoContrato'
                },
                'methodGetTipoSubContrato':{
                    name:  'GetTipoSubContrato',
                    path: 'api/salud/tipoSubContrato/{numeroContrato}'
                },
                'methodListaPlanesMigrar':{
                    name:  'ListaPlanesMigrar',
                    path: 'api/salud/planesMigrar/listado/{numRegistros}/{numPaginacion}/{numContrato}/{numSubContrato}/{continuidad}'
                },
                'methodActualizacionPlanesMigrar':{
                    name:  'ActualizacionPlanesMigrar',
                    path: 'api/salud/planesMigrar/actualizacion'
                },
                'methodCreacionPlanesMigrar':{
                    name:  'CreacionPlanesMigrar',
                    path: 'api/salud/planesMigrar/creacion'
                },
                'methodEliminarPlanesMigrar':{
                    name:  'EliminarPlanesMigrar',
                    path: 'api/salud/planesMigrar/{codigoPlanMigracion}/{mcaInh}'
                },
                'methodListaReglasAjuste':{
                    name:  'ListaReglasAjuste',
                    path: 'api/salud/reglasAjuste/listado/{numRegistros}/{numPaginacion}/{numContrato}/{numSubContrato}'
                },
                'methodActualizacionReglasAjuste':{
                    name:  'ActualizacionReglasAjuste',
                    path: 'api/salud/reglasAjuste/actualizacion'
                },
                'methodCreacionReglasAjuste':{
                    name:  'CreacionReglasAjuste',
                    path: 'api/salud/reglasAjuste/creacion'
                },
                'methodEliminarReglasAjuste':{
                    name:  'EliminarReglasAjuste',
                    path: 'api/salud/reglasAjuste/{idRenovSaludCriter}/{mcaInh}'
                },
                'methodGetPlan':{
                    name:  'GetPlan',
                    path: 'api/salud/plan'
                },
                'methodGet_TipoPolizaMigracion_ComboBox':{
                    name:  'Get_TipoPolizaMigracion_ComboBox',
                    path: 'api/salud/tipoPolizaMigracion'
                },
                'methodDescargarDocumentoCotizacionPDF':{
                    name:  'DescargarDocumentoCotizacionPDF',
                    path: 'api/salud/migracion/cotizacion/{numCotizacion}'
                },
                'methodGet_TipoPersona_ComboBox':{
                    name:  'Get_TipoPersona_ComboBox',
                    path: 'api/salud/tipoPersona'
                },
                'methodGet_PlanSaludPrima_Listar':{
                    name:  'Get_PlanSaludPrima_Listar',
                    path: 'api/salud/primas/{codigoCia}/{codigoRamo}/{codigoModalidad}/{numeroContrato}/{numeroSubContrato}'
                },
                'methodValidarAsegurado':{
                    name:  'ValidarAsegurado',
                    path: 'api/salud/asegurados/validar'
                },
                'methodGetListTipoPlanSalud':{
                    name:  'GetListTipoPlanSalud',
                    path: 'api/salud/tipoPlan'
                },
                'methodGetListEstadoProductoSalud':{
                    name:  'GetListEstadoProductoSalud',
                    path: 'api/salud/estadoProducto'
                },
                'methodRegistrarSuscripcion':{
                    name:  'RegistrarSuscripcion',
                    path: 'api/salud/suscripcion'
                },
                'methodObtenerSuscripcion':{
                    name:  'ObtenerSuscripcion',
                    path: 'api/salud/suscripcion/{numeroDocumento}'
                },
                'methodGenerarDpsSalud':{
                    name:  'GenerarDpsSalud',
                    path: 'api/salud/dps/{numeroDocumento}'
                },
                'methodAdjuntarDocumento':{
                    name:  'AdjuntarDocumento',
                    path: 'api/salud/documento/adjunto'
                },
                'methodGetCompaniaSeguroSalud':{
                    name:  'GetCompaniaSeguroSalud',
                    path: 'api/salud/compania'
                },
                'methodGetTipoCompaniaSeguroSalud':{
                    name:  'GetTipoCompaniaSeguroSalud',
                    path: 'api/salud/compania/tipo?codigoCompania={codigoCompania}'
                },
                'methodListarDocumentos':{
                    name:  'ListarDocumentos',
                    path: 'api/salud/listar/documentos'
                },
                'methodUpdateDocumentState':{
                    name:  'UpdateDocumentState',
                    path: 'api/salud/documento/estado'
                },
                'methodDeleteAttachFileDocument':{
                    name:  'DeleteAttachFileDocument',
                    path: 'api/salud/documento/adjunto?numeroDocumento={numeroDocumento}&nombreTemp={nombreTemp}'
                },
                'methodDescargarDocumento':{
                    name:  'DescargarDocumento',
                    path: 'api/salud/documento/adjunto?numeroDocumento={numeroDocumento}&nombreTemp={nombreTemp}'
                },
                'methodPolizaDpsCuestionarioPreguntasEstado':{
                    name:  'PolizaDpsCuestionarioPreguntasEstado',
                    path: 'api/salud/poliza/dps/cuestionario/preguntas/estado'
                },
                'methodListarDpsCuestionarioPreguntas':{
                    name:  'ListarDpsCuestionarioPreguntas',
                    path: 'api/salud/poliza/dps/cuestionario/preguntas?codigoEstado={codigoEstado}'
                },
                'methodCreacionPregunta':{
                    name:  'CreacionPregunta',
                    path: 'api/salud/poliza/dps/cuestionario/pregunta?operacion={operacion}'
                },
                'methodListarImc':{
                    name:  'ListarImc',
                    path: 'api/salud/imc'
                },
                'methodGrabarImc':{
                    name:  'GrabarImc',
                    path: 'api/salud/imc'
                },
                'methodActualizaImc':{
                    name:  'ActualizaImc',
                    path: 'api/salud/imc'
                },
                'methodEliminaImc':{
                    name:  'EliminaImc',
                    path: 'api/salud/imc?codigoImc={codigoImc}'
                },
                'methodGetMotivosRechazo':{
                    name:  'GetMotivosRechazo',
                    path: 'api/salud/motivosRechazo'
                },
                'methodGetEstadosCotizacion':{
                    name:  'GetEstadosCotizacion',
                    path: 'api/salud/estadosCotizacion'
                },
                'methodGetClases':{
                    name:  'GetClases',
                    path: 'api/salud/clases?descripcion={descripcion}'
                },
                'methodRegistrartasaAjuste':{
                    name:  'RegistrartasaAjuste',
                    path: 'api/salud/tasaAjuste'
                },
                'methodBuscartasaAjustes':{
                    name:  'BuscartasaAjustes',
                    path: 'api/salud/tasasAjuste'
                },
                'methodObtenertasaAjuste':{
                    name:  'ObtenertasaAjuste',
                    path: 'api/salud/tasaAjuste/{tasaAjusteId}'
                },
                'methodModificartasaAjuste':{
                    name:  'ModificartasaAjuste',
                    path: 'api/salud/tasaAjuste/{tasaAjusteId}?tipo={tipo}'
                },
                'methodObtenerdiagnosticosDeclarados':{
                    name:  'ObtenerdiagnosticosDeclarados',
                    path: 'api/salud/diagnosticosDeclarados?formato={formato}&fechaInicio={fechaInicio}&fechaFinal={fechaFinal}'
                },
            }
        },
        controllerOrchestrator: {
            actions : {
                'methodEmitSoat':{
                    name:  'EmitSoat',
                    path: 'api/orchestrator/emit/soat'
                },
                'methodQuoteSoat':{
                    name:  'QuoteSoat',
                    path: 'api/orchestrator/quote/soat'
                },
            }
        },
        controllerListaNegra: {
            actions : {
                'methodConsultaListaNegra':{
                    name:  'ConsultaListaNegra',
                    path: 'api/consultaListaNegra'
                },
                'methodGuardarAuditoria':{
                    name:  'GuardarAuditoria',
                    path: 'api/auditoria'
                },
            }
        },
        controllerDocumento: {
            actions : {
                'methodGetDocumentoListar':{
                    name:  'GetDocumentoListar',
                    path: 'api/documento/documentoListar'
                },
                'methodGetListCotizacionVigente':{
                    name:  'GetListCotizacionVigente',
                    path: 'api/documento/cotizacion/vigente'
                },
                'methodGetDocumentoByNumber':{
                    name:  'GetDocumentoByNumber',
                    path: 'api/documento/documentoBuscar/{CodEmpresa}/{CodDocumento}/{CodigoRamo}'
                },
                'methodObtenerCotizacionEmisionVehiculo':{
                    name:  'ObtenerCotizacionEmisionVehiculo',
                    path: 'api/documento/documentoVehiculoBuscar/{CodEmpresa}/{CodDocumento}/{CodigoRamo}'
                },
                'methodGetDocumentoListarExcel':{
                    name:  'GetDocumentoListarExcel',
                    path: 'api/documento/descargarExcel'
                },
                'methodGetDocumentoImpPDF':{
                    name:  'GetDocumentoImpPDF',
                    path: 'api/documento/descargarPDF/{codCia}/{numPol}/{numShipTo}/{numApl}/{numAplShiTo}/{mcaPolEle}'
                },
                'methodGetDocumentoImpPDFByNumPoliza':{
                    name:  'GetDocumentoImpPDFByNumPoliza',
                    path: 'api/documento/descargardocumento/{numPoliza}'
                },
                'methodGetDocumentoSoatEmisionPDF':{
                    name:  'GetDocumentoSoatEmisionPDF',
                    path: 'api/documento/descargarSoatEmisionPDF/{numeroPoliza}'
                },
                'methodPolizaVida_CalcularPrima':{
                    name:  'PolizaVida_CalcularPrima',
                    path: 'api/documento/PolizaVida/CalcularPrima'
                },
                'methodPolizaVida_RegistrarCotizacion':{
                    name:  'PolizaVida_RegistrarCotizacion',
                    path: 'api/documento/PolizaVida/RegistrarCotizacion'
                },
                'methodPolizaVida_RegistrarPreEmision':{
                    name:  'PolizaVida_RegistrarPreEmision',
                    path: 'api/documento/PolizaVida/RegistrarPreEmision'
                },
                'methodGetDetalleEmisión':{
                    name:  'GetDetalleEmisión',
                    path: 'api/documento/emision/detalle/{numeroDocumento}'
                },
                'methodListarDocumentoPag':{
                    name:  'ListarDocumentoPag',
                    path: 'api/documento/listardocumentopag'
                },
                'methodListarDocumentoSaludPag':{
                    name:  'ListarDocumentoSaludPag',
                    path: 'api/documento/listardocumentopag/salud'
                },
                'methodListarDocumentoPorCodigoProcesoPag':{
                    name:  'ListarDocumentoPorCodigoProcesoPag',
                    path: 'api/documento/listardocumentopag/codigoproceso'
                },
                'methodGetDocumentoSaludListarExcel':{
                    name:  'GetDocumentoSaludListarExcel',
                    path: 'api/documento/descargarExcel/salud'
                },
                'methodListarCotizacionAutoUsado':{
                    name:  'ListarCotizacionAutoUsado',
                    path: 'api/documento/inspection/quotation/used'
                },
                'methodGetQuotationForInspection':{
                    name:  'GetQuotationForInspection',
                    path: 'api/documento/inspection/{CodEmpresa}/{CodDocumento}/{CodigoRamo}'
                },
            }
        },
        controllerSctr: {
            actions : {
                'methodDownloadFilePcConstancia':{
                    name:  'DownloadFilePcConstancia',
                    path: 'api/sctr/download/pc/constancia/{numeroConstancia}'
                },
                'methodDownloadFilePnConstancia':{
                    name:  'DownloadFilePnConstancia',
                    path: 'api/sctr/download/pn/constancia/{numeroConstancia}'
                },
                'methodSendBandejaMailas':{
                    name:  'SendBandejaMailas',
                    path: 'api/sctr/bandeja/mailas'
                },
                'methodSendBandejaMail':{
                    name:  'SendBandejaMail',
                    path: 'api/sctr/bandeja/mail'
                },
                'methodGetListBandejaPage':{
                    name:  'GetListBandejaPage',
                    path: 'api/sctr/bandeja/paginado'
                },
                'methodGetListProcedencia':{
                    name:  'GetListProcedencia',
                    path: 'api/sctr/listar/procedencia'
                },
                'methodGetUserRole':{
                    name:  'GetUserRole',
                    path: 'api/sctr/role'
                },
                'methodCreateSubactividad':{
                    name:  'CreateSubactividad',
                    path: 'api/sctr/ciiu/subactividad'
                },
                'methodUpdateSubactividad':{
                    name:  'UpdateSubactividad',
                    path: 'api/sctr/ciiu/subactividad/update'
                },
                'methodDeleteSubactividad':{
                    name:  'DeleteSubactividad',
                    path: 'api/sctr/ciiu/subactividad/delete/{id}'
                },
                'methodGetListSubactividad':{
                    name:  'GetListSubactividad',
                    path: 'api/sctr/ciiu/subactividad/search'
                },
                'methodGetListSubactividadByCiiu':{
                    name:  'GetListSubactividadByCiiu',
                    path: 'api/sctr/ciiu/subactividad/{ciiu}'
                },
                'methodCreateClausulaAutomatica':{
                    name:  'CreateClausulaAutomatica',
                    path: 'api/sctr/ciiu/clausula/automatica'
                },
                'methodUpdateClausulaAutomatica':{
                    name:  'UpdateClausulaAutomatica',
                    path: 'api/sctr/ciiu/clausula/automatica/update'
                },
                'methodDeleteClausulaAutomatica':{
                    name:  'DeleteClausulaAutomatica',
                    path: 'api/sctr/ciiu/clausula/automatica/delete/{id}'
                },
                'methodGetListClausulaAutomatica':{
                    name:  'GetListClausulaAutomatica',
                    path: 'api/sctr/ciiu/clausula/automatica/search'
                },
                'methodGetListClausulaAutomaticaByCiiu':{
                    name:  'GetListClausulaAutomaticaByCiiu',
                    path: 'api/sctr/ciiu/clausula/automatica/{ciiu}'
                },
                'methodDownloadFactura':{
                    name:  'DownloadFactura',
                    path: 'api/sctr/factura/{codigoCompania}/{numeroRecibo}/{tipo}'
                },
                'methodGetListTasa':{
                    name:  'GetListTasa',
                    path: 'api/sctr/poliza/tasa'
                },
                'methodCargarTasa':{
                    name:  'CargarTasa',
                    path: 'api/sctr/poliza/tasa/cargar'
                },
                'methodProcesarTasa':{
                    name:  'ProcesarTasa',
                    path: 'api/sctr/poliza/tasa/procesar'
                },
                'methodDownloadFileTasa':{
                    name:  'DownloadFileTasa',
                    path: 'api/sctr/poliza/tasa/download/{idTemplate}'
                },
                'methodCalcularPrima':{
                    name:  'CalcularPrima',
                    path: 'api/sctr/prima/calcular'
                },
                'methodValidarAgente':{
                    name:  'ValidarAgente',
                    path: 'api/sctr/agente/pago/pendiente'
                },
                'methodValidarAgentePorCodigo':{
                    name:  'ValidarAgentePorCodigo',
                    path: 'api/sctr/agente/pago/pendiente/{codigoAgente}'
                },
                'methodDesbloquearAgente':{
                    name:  'DesbloquearAgente',
                    path: 'api/sctr/agente/desbloquear'
                },
                'methodReportePolizaVencida':{
                    name:  'ReportePolizaVencida',
                    path: 'api/sctr/poliza/reporte/vencida'
                },
                'methodReportePolizaVencidaPaginado':{
                    name:  'ReportePolizaVencidaPaginado',
                    path: 'api/sctr/poliza/reporte/vencida/pag'
                },
                'methodReportePolizaPorVencer':{
                    name:  'ReportePolizaPorVencer',
                    path: 'api/sctr/poliza/reporte/porvencer'
                },
                'methodGetListRegion':{
                    name:  'GetListRegion',
                    path: 'api/sctr/region'
                },
                'methodGenerarRestriccion':{
                    name:  'GenerarRestriccion',
                    path: 'api/sctr/restriccion/{tipOperacion}'
                },
                'methodGetListProduct':{
                    name:  'GetListProduct',
                    path: 'api/sctr/id'
                },
                'methodGetFrecuencia':{
                    name:  'GetFrecuencia',
                    path: 'api/sctr/frecuencia'
                },
                'methodGetFrecuenciaByCodGru':{
                    name:  'GetFrecuenciaByCodGru',
                    path: 'api/sctr/frecuencia/{codGru}/{tipo}'
                },
                'methodGetListState':{
                    name:  'GetListState',
                    path: 'api/sctr/estado/{tipo}'
                },
                'methodSendMailEstado':{
                    name:  'SendMailEstado',
                    path: 'api/sctr/mail/estado'
                },
                'methodGetListSuscriptor':{
                    name:  'GetListSuscriptor',
                    path: 'api/sctr/suscriptor/listar'
                },
                'methodGetListOficina':{
                    name:  'GetListOficina',
                    path: 'api/sctr/suscriptor/oficina/listar'
                },
                'methodGetListOficinaPaginado':{
                    name:  'GetListOficinaPaginado',
                    path: 'api/sctr/suscriptor/oficina/listar/pag'
                },
                'methodGetUsuarioOim':{
                    name:  'GetUsuarioOim',
                    path: 'api/sctr/suscriptor/usuario/oim/buscar'
                },
                'methodGetSuscriptor':{
                    name:  'GetSuscriptor',
                    path: 'api/sctr/suscriptor/{id}'
                },
                'methodGetSuscriptorByIdAgent':{
                    name:  'GetSuscriptorByIdAgent',
                    path: 'api/sctr/suscriptor/agente/{id}'
                },
                'methodSaveSuscriptor':{
                    name:  'SaveSuscriptor',
                    path: 'api/sctr/suscriptor'
                },
                'methodSaveSuscriptorOficina':{
                    name:  'SaveSuscriptorOficina',
                    path: 'api/sctr/suscriptor/oficina'
                },
                'methodGrabarTrabajador':{
                    name:  'GrabarTrabajador',
                    path: 'api/sctr/trabajador/grabar'
                },
                'methodGetListTrabajador':{
                    name:  'GetListTrabajador',
                    path: 'api/sctr/trabajador/oficina/listar?nroSol={nroSol}'
                },
                'methodGetListTrabajadorConstancia':{
                    name:  'GetListTrabajadorConstancia',
                    path: 'api/sctr/trabajador/constancia/listar?nroCon={nroCon}'
                },
                'methodGetListTrabajadorConstanciaPc':{
                    name:  'GetListTrabajadorConstanciaPc',
                    path: 'api/sctr/trabajador/constanciapc/listar?nroCon={nroCon}'
                },
                'methodGrabarMensaje':{
                    name:  'GrabarMensaje',
                    path: 'api/sctr/mensaje/grabar'
                },
                'methodGetListMensaje':{
                    name:  'GetListMensaje',
                    path: 'api/sctr/mensaje/{numeroSolicitud}'
                },
                'methodDownloadFileFromMessage':{
                    name:  'DownloadFileFromMessage',
                    path: 'api/sctr/mensaje/archivo'
                },
                'methodGrabarParametro':{
                    name:  'GrabarParametro',
                    path: 'api/sctr/parametro/grabar'
                },
                'methodGetListParametro':{
                    name:  'GetListParametro',
                    path: 'api/sctr/parametro/listar'
                },
                'methodGetListParametroPaginado':{
                    name:  'GetListParametroPaginado',
                    path: 'api/sctr/parametro/listarpaginado'
                },
                'methodGrabarParametroDetalle':{
                    name:  'GrabarParametroDetalle',
                    path: 'api/sctr/parametrodetalle/grabar'
                },
                'methodGetListParametroDetalle':{
                    name:  'GetListParametroDetalle',
                    path: 'api/sctr/parametrodetalle/listar'
                },
                'methodGetListParametroDetalleByCodGru':{
                    name:  'GetListParametroDetalleByCodGru',
                    path: 'api/sctr/factor/calcular/{codGru}'
                },
                'methodGetListParametroDetalleGeneral':{
                    name:  'GetListParametroDetalleGeneral',
                    path: 'api/sctr/parametrodetalle/listargeneral?codGru={codGru}'
                },
                'methodGetTasaPc':{
                    name:  'GetTasaPc',
                    path: 'api/sctr/parametrodetalle/tipodocumento/{nroDoc}/{grpApl}'
                },
                'methodGetTasaPcByCodeGruVal':{
                    name:  'GetTasaPcByCodeGruVal',
                    path: 'api/sctr/tasa/pc/{codGru}/{val}'
                },
                'methodGetFactor':{
                    name:  'GetFactor',
                    path: 'api/sctr/factor/{codGru}'
                },
                'methodGrabarRiesgo':{
                    name:  'GrabarRiesgo',
                    path: 'api/sctr/riesgo/grabar'
                },
                'methodGetListRiesgo':{
                    name:  'GetListRiesgo',
                    path: 'api/sctr/riesgo/listar'
                },
                'methodGetPrimaMinima':{
                    name:  'GetPrimaMinima',
                    path: 'api/sctr/riesgo/primaminima/{codigoCompania}/{codigoRamo}/{codigoMoneda}'
                },
                'methodValidarClienteDeficitario':{
                    name:  'ValidarClienteDeficitario',
                    path: 'api/sctr/empresa/validardeficitario/{tipDoc}/{numDoc}'
                },
                'methodObtenerCodigoPostal':{
                    name:  'ObtenerCodigoPostal',
                    path: 'api/sctr/ubigeo/obtenercodigopostal/{codPai}/{codDep}/{codPro}/{codDis}'
                },
                'methodGetListEmpresaSctrEmi':{
                    name:  'GetListEmpresaSctrEmi',
                    path: 'api/sctr/poliza'
                },
                'methodGetSctrEmpresa':{
                    name:  'GetSctrEmpresa',
                    path: 'api/sctr/empresa/buscar'
                },
                'methodExistirEmpresaTron':{
                    name:  'ExistirEmpresaTron',
                    path: 'api/sctr/empresa/validartron/{tipDoc}/{numDoc}/{codCia}'
                },
                'methodValidarAgenciamiento':{
                    name:  'ValidarAgenciamiento',
                    path: 'api/sctr/empresa/validaragenciamiento'
                },
                'methodGrabarEmpresa':{
                    name:  'GrabarEmpresa',
                    path: 'api/sctr/empresa'
                },
                'methodGetTicketSol':{
                    name:  'GetTicketSol',
                    path: 'api/sctr/solicitud/obtener/ticket?numSol={numSol}'
                },
                'methodGrabarSolicitud':{
                    name:  'GrabarSolicitud',
                    path: 'api/sctr/solicitud'
                },
                'methodGetListSolicitudEmi':{
                    name:  'GetListSolicitudEmi',
                    path: 'api/sctr/solicitud/listar'
                },
                'methodGetListDocumentReport':{
                    name:  'GetListDocumentReport',
                    path: 'api/sctr/solicitud/reporte'
                },
                'methodGetListDocumentReportPage':{
                    name:  'GetListDocumentReportPage',
                    path: 'api/sctr/solicitud/paginado'
                },
                'methodHelloWorld':{
                    name:  'HelloWorld',
                    path: 'api/sctr/testutf8'
                },
                'methodHelloWorld2':{
                    name:  'HelloWorld2',
                    path: 'api/sctr/testsinutf8'
                },
                'methodExportListSolicitudesSCTR':{
                    name:  'ExportListSolicitudesSCTR',
                    path: 'api/sctr/solicitud/exportar/{tipoDoc}'
                },
                'methodValidarReciboPoliza':{
                    name:  'ValidarReciboPoliza',
                    path: 'api/sctr/poliza/validarrecibo/{recPol}'
                },
                'methodValidarExistePoliza':{
                    name:  'ValidarExistePoliza',
                    path: 'api/sctr/poliza/validarexiste/{ruc}/{nroPol}'
                },
                'methodValidarContratoReaseguro':{
                    name:  'ValidarContratoReaseguro',
                    path: 'api/sctr/poliza/validarreaseguro/{codCia}/{codRam}/{fec}'
                },
                'methodGenerarTicketEmision':{
                    name:  'GenerarTicketEmision',
                    path: 'api/sctr/poliza/generar/ticket'
                },
                'methodPcGrabarPolizaP1':{
                    name:  'PcGrabarPolizaP1',
                    path: 'api/sctr/poliza/pc/p1'
                },
                'methodPnGrabarPolizaP1':{
                    name:  'PnGrabarPolizaP1',
                    path: 'api/sctr/poliza/pn/p1'
                },
                'methodPcGrabarPolizaP2':{
                    name:  'PcGrabarPolizaP2',
                    path: 'api/sctr/poliza/pc/p2'
                },
                'methodPcGrabarPolizaValidarP2':{
                    name:  'PcGrabarPolizaValidarP2',
                    path: 'api/sctr/poliza/pc/p2/procesar'
                },
                'methodPnGrabarPolizaP2':{
                    name:  'PnGrabarPolizaP2',
                    path: 'api/sctr/poliza/pn/p2'
                },
                'methodPnGrabarPolizaValidarP2':{
                    name:  'PnGrabarPolizaValidarP2',
                    path: 'api/sctr/poliza/pn/p2/validar'
                },
                'methodPcGrabarPolizaP3':{
                    name:  'PcGrabarPolizaP3',
                    path: 'api/sctr/poliza/pc/p3'
                },
                'methodPnGrabarPolizaP3':{
                    name:  'PnGrabarPolizaP3',
                    path: 'api/sctr/poliza/pn/p3'
                },
                'methodPnGrabarPolizaP3CotizacionSolicitar':{
                    name:  'PnGrabarPolizaP3CotizacionSolicitar',
                    path: 'api/sctr/poliza/pn/p3/cotizacion/solicitar'
                },
                'methodPnGrabarPolizaP3CotizacionGestionar':{
                    name:  'PnGrabarPolizaP3CotizacionGestionar',
                    path: 'api/sctr/poliza/pn/p3/cotizacion/gestionar'
                },
                'methodPnGrabarPolizaP3TasaGestionar':{
                    name:  'PnGrabarPolizaP3TasaGestionar',
                    path: 'api/sctr/poliza/pn/p3/tasa/gestionar'
                },
                'methodPcCargarPlanillaP4':{
                    name:  'PcCargarPlanillaP4',
                    path: 'api/sctr/poliza/p4/pc/cargar'
                },
                'methodPcP4AnularPoliza':{
                    name:  'PcP4AnularPoliza',
                    path: 'api/sctr/poliza/p4/pc/anular'
                },
                'methodPnCargarPlanillaP4':{
                    name:  'PnCargarPlanillaP4',
                    path: 'api/sctr/poliza/p4/pn/cargar'
                },
                'methodPnP4AnularPoliza':{
                    name:  'PnP4AnularPoliza',
                    path: 'api/sctr/poliza/p4/pn/anular'
                },
                'methodDownloadUploadFileError':{
                    name:  'DownloadUploadFileError',
                    path: 'api/sctr/poliza/p4/upload/error'
                },
                'methodPcEmitirPolizaP4':{
                    name:  'PcEmitirPolizaP4',
                    path: 'api/sctr/poliza/p4/pc/emitir'
                },
                'methodPnEmitirPolizaP4':{
                    name:  'PnEmitirPolizaP4',
                    path: 'api/sctr/poliza/p4/pn/emitir'
                },
                'methodActualizarConstancia':{
                    name:  'ActualizarConstancia',
                    path: 'api/sctr/poliza/actualizar/constancia/{nroSol}/{nroCon}'
                },
                'methodDownloadPcRecibo':{
                    name:  'DownloadPcRecibo',
                    path: 'api/sctr/descarga/pc/recibo/{numeroRecibo}'
                },
                'methodDownloadPnRecibo':{
                    name:  'DownloadPnRecibo',
                    path: 'api/sctr/descarga/pn/recibo/{numeroRecibo}'
                },
                'methodDownloadPcPoliza':{
                    name:  'DownloadPcPoliza',
                    path: 'api/sctr/descarga/pc/poliza/{codigoCompania}/{numeroPoliza}'
                },
                'methodDownloadPnPoliza':{
                    name:  'DownloadPnPoliza',
                    path: 'api/sctr/descarga/pn/poliza/{codigoCompania}/{numeroPoliza}'
                },
                'methodDownloadPcConstancia':{
                    name:  'DownloadPcConstancia',
                    path: 'api/sctr/descarga/pc/constancia/{numeroConstancia}'
                },
                'methodDownloadPnConstancia':{
                    name:  'DownloadPnConstancia',
                    path: 'api/sctr/descarga/pn/constancia/{numeroConstancia}'
                },
                'methodDownloadFilePcRecibo':{
                    name:  'DownloadFilePcRecibo',
                    path: 'api/sctr/download/pc/recibo/{numeroRecibo}'
                },
                'methodDownloadFilePnRecibo':{
                    name:  'DownloadFilePnRecibo',
                    path: 'api/sctr/download/pn/recibo/{numeroRecibo}'
                },
                'methodDownloadFilePcPoliza':{
                    name:  'DownloadFilePcPoliza',
                    path: 'api/sctr/download/pc/poliza/{codigoCompania}/{numeroPoliza}'
                },
                'methodDownloadFilePnPoliza':{
                    name:  'DownloadFilePnPoliza',
                    path: 'api/sctr/download/pn/poliza/{codigoCompania}/{numeroPoliza}'
                },
            }
        },
        controllerPoliza: {
            actions : {
                'methodGetPolizaListAplicTrans':{
                    name:  'GetPolizaListAplicTrans',
                    path: 'api/poliza/listarPolTrans'
                },
                'methodGetPolizaBuscarAplicTrans':{
                    name:  'GetPolizaBuscarAplicTrans',
                    path: 'api/poliza/transporte/buscarpoliza'
                },
                'methodGetListPolizaGrupo':{
                    name:  'GetListPolizaGrupo',
                    path: 'api/poliza/transporte/grupopoliza/{codRamo}/{codAgente}/{codRubro}'
                },
                'methodGetConfigurarSoat':{
                    name:  'GetConfigurarSoat',
                    path: 'api/poliza/soat/polizamanual/{codPro}'
                },
                'methodGetPolizaPorToken':{
                    name:  'GetPolizaPorToken',
                    path: 'api/poliza/token/{token}'
                },
                'methodAnularPoliza':{
                    name:  'AnularPoliza',
                    path: 'api/poliza/anular'
                },
            }
        },
        controllerVida: {
            actions : {
                'methodGetListCoberturaVida':{
                    name:  'GetListCoberturaVida',
                    path: 'api/Vida/Cobertura/{codigoCompania}/{codigoProducto}'
                },
                'methodGetListTipoBeneficiario':{
                    name:  'GetListTipoBeneficiario',
                    path: 'api/Vida/tipobeneficiario/{codCia}/{codRamo}'
                },
                'methodGetListArchivoPag':{
                    name:  'GetListArchivoPag',
                    path: 'api/Vida/archivospaginado'
                },
                'methodGeConsultarArchivo':{
                    name:  'GeConsultarArchivo',
                    path: 'api/Vida/archivos/{codigo}'
                },
                'methodInsArchivo':{
                    name:  'InsArchivo',
                    path: 'api/Vida/archivos'
                },
                'methodUpdArchivo':{
                    name:  'UpdArchivo',
                    path: 'api/Vida/archivos'
                },
                'methodGeDescargarArchivo':{
                    name:  'GeDescargarArchivo',
                    path: 'api/Vida/archivos/descargar/{codigo}'
                },
                'methodListarResumenEquipo':{
                    name:  'ListarResumenEquipo',
                    path: 'api/Vida/resumenequipo'
                },
                'methodListarResumenAgentePag':{
                    name:  'ListarResumenAgentePag',
                    path: 'api/Vida/resumenagentepaginado'
                },
                'methodCargaAltaDocumental':{
                    name:  'CargaAltaDocumental',
                    path: 'api/Vida/cargaAltaDocumental'
                },
                'methodEsUsuarioEspecial':{
                    name:  'EsUsuarioEspecial',
                    path: 'api/Vida/usuarioComoAdmin'
                },
                'methodGetListPeriocidad':{
                    name:  'GetListPeriocidad',
                    path: 'api/Vida/periocidad'
                },
                'methodGetListDevolucion':{
                    name:  'GetListDevolucion',
                    path: 'api/Vida/devolucion'
                },
                'methodGetListDiferimiento':{
                    name:  'GetListDiferimiento',
                    path: 'api/Vida/diferimiento'
                },
                'methodGetListDuracionSeguro':{
                    name:  'GetListDuracionSeguro',
                    path: 'api/Vida/Duracion/Seguro'
                },
                'methodGetPagoAdelantado':{
                    name:  'GetPagoAdelantado',
                    path: 'api/Vida/RadioButton/PagoAdelantado'
                },
                'methodGetPeriodoGarantizado':{
                    name:  'GetPeriodoGarantizado',
                    path: 'api/Vida/RadioButton/PeriodoGarantizado'
                },
                'methodUpdateRadioButton':{
                    name:  'UpdateRadioButton',
                    path: 'api/Vida/RadioButton/Update'
                },
                'methodValidaEndosatario':{
                    name:  'ValidaEndosatario',
                    path: 'api/Vida/Valida/Endosatario'
                },
                'methodValidaCotizacion':{
                    name:  'ValidaCotizacion',
                    path: 'api/Vida/valida'
                },
                'methodValidarCodigoPromocion':{
                    name:  'ValidarCodigoPromocion',
                    path: 'api/Vida/vidaRenta/promocion/{codigoPromocion}/validacion'
                },
                'methodGetResumenComparativo':{
                    name:  'GetResumenComparativo',
                    path: 'api/Vida/vidaRenta/cotizaciones'
                },
                'methodGetDetalleResumenComparativoPDF':{
                    name:  'GetDetalleResumenComparativoPDF',
                    path: 'api/Vida/vidaRenta/cotizaciones/documento'
                },
                'methodGetTamanioCargomatico':{
                    name:  'GetTamanioCargomatico',
                    path: 'api/Vida/archivos/TamanioCargomatico'
                },
                'methodObtenerCotizacion':{
                    name:  'ObtenerCotizacion',
                    path: 'api/Vida/Cotizacion?numeroCotizacion={numeroCotizacion}'
                },
                'methodObtenerPdfCotizacion':{
                    name:  'ObtenerPdfCotizacion',
                    path: 'api/Vida/Cotizacion/Pdf?numeroCotizacion={numeroCotizacion}'
                },
                'methodEnviarPdfCotizacion':{
                    name:  'EnviarPdfCotizacion',
                    path: 'api/Vida/Cotizacion/Email?numeroCotizacion={numeroCotizacion}'
                },
            }
        },
        controllerTest: {
            actions : {
                'methodgetLinkTRON':{
                    name:  'getLinkTRON',
                    path: 'api/prueba/linkTRON'
                },
                'methodgetLinkWEB':{
                    name:  'getLinkWEB',
                    path: 'api/prueba/linkWEB'
                },
                'methodGetLogFile':{
                    name:  'GetLogFile',
                    path: 'api/prueba/info'
                },
            }
        },
        controllerFile: {
            actions : {
                'methodGetTemplate':{
                    name:  'GetTemplate',
                    path: 'api/file/emisa/{idTemplate}'
                },
                'methodGetAccidenteTemplate':{
                    name:  'GetAccidenteTemplate',
                    path: 'api/file/accidente/template'
                },
                'methodGetReglaAjusteTemplate':{
                    name:  'GetReglaAjusteTemplate',
                    path: 'api/file/salud/reglaAjuste/template'
                },
            }
        },
        controllerClinicaDigital: {
            actions : {
                'methodListarPlan':{
                    name:  'ListarPlan',
                    path: 'api/clinicaDigital/plan'
                },
                'methodListarFinanciamiento':{
                    name:  'ListarFinanciamiento',
                    path: 'api/clinicaDigital/financiamiento?codigoCompania={codigoCompania}&codigoRamo={codigoRamo}&numeroContrato={numeroContrato}&numeroSubContrato={numeroSubContrato}&codigoModalidad={codigoModalidad}&codigoProducto={codigoProducto}&codigoSubProducto={codigoSubProducto}&codigoPlan={codigoPlan}'
                },
                'methodListarTipoAsegurado':{
                    name:  'ListarTipoAsegurado',
                    path: 'api/clinicaDigital/tipoAsegurado'
                },
                'methodRegistrarCotizacion':{
                    name:  'RegistrarCotizacion',
                    path: 'api/clinicaDigital/cotizacion'
                },
                'methodObtenerCotizacion':{
                    name:  'ObtenerCotizacion',
                    path: 'api/clinicaDigital/cotizacion/{numeroDocumento}'
                },
                'methodGetCotizacion':{
                    name:  'GetCotizacion',
                    path: 'api/clinicaDigital/descargar/{numeroDocumento}'
                },
                'methodSendMailCotizacion':{
                    name:  'SendMailCotizacion',
                    path: 'api/clinicaDigital/sendMail'
                },
                'methodEmision':{
                    name:  'Emision',
                    path: 'api/clinicaDigital/emision'
                },
                'methodObtenerListadoDocumentos':{
                    name:  'ObtenerListadoDocumentos',
                    path: 'api/clinicaDigital/emision/documentos/listar'
                },
                'methodGetListarBandejaDocumentos':{
                    name:  'GetListarBandejaDocumentos',
                    path: 'api/clinicaDigital/documentos'
                },
                'methodListarPlanTronPag':{
                    name:  'ListarPlanTronPag',
                    path: 'api/clinicaDigital/mantenimiento/plan'
                },
                'methodObtennerPlan':{
                    name:  'ObtennerPlan',
                    path: 'api/clinicaDigital/mantenimiento/plan?codigoCompania={codigoCompania}&codigoModalidad={codigoModalidad}&codigoProducto={codigoProducto}&codigoSubProducto={codigoSubProducto}&codigoPlan={codigoPlan}'
                },
                'methodListarPlanEstado':{
                    name:  'ListarPlanEstado',
                    path: 'api/clinicaDigital/mantenimiento/plan/estado'
                },
                'methodActualizaPlanEstado':{
                    name:  'ActualizaPlanEstado',
                    path: 'api/clinicaDigital/mantenimiento/plan/estado'
                },
                'methodListaFinanciamientoPlan':{
                    name:  'ListaFinanciamientoPlan',
                    path: 'api/clinicaDigital/mantenimiento/plan/financiamiento?codigoCompania={codigoCompania}&codigoModalidad={codigoModalidad}&codigoProducto={codigoProducto}&codigoSubProducto={codigoSubProducto}&codigoPlan={codigoPlan}'
                },
                'methodActualizaFinanciamiento':{
                    name:  'ActualizaFinanciamiento',
                    path: 'api/clinicaDigital/mantenimiento/plan/financiamiento'
                },
                'methodRegistrarArchivoCondicionado':{
                    name:  'RegistrarArchivoCondicionado',
                    path: 'api/clinicaDigital/mantenimiento/plan/condicionado'
                },
                'methodDescargarPlanProducto':{
                    name:  'DescargarPlanProducto',
                    path: 'api/clinicaDigital/mantenimiento/plan/condicionado?codigoRamo={codigoRamo}&codigoModalidad={codigoModalidad}&numeroContrato={numeroContrato}&numeroSubContrato={numeroSubContrato}&codigoProducto={codigoProducto}&codigoSubProducto={codigoSubProducto}&codigoPlan={codigoPlan}'
                },
                'methodDescargarEmision':{
                    name:  'DescargarEmision',
                    path: 'api/clinicaDigital/emision/descargar/{numeroEmision}'
                },
            }
        },
        controllerParametro: {
            actions : {
                'methodgetListProductos':{
                    name:  'getListProductos',
                    path: 'api/rrgg/parametro/productos'
                },
                'methodgetListaParametrosProdPorGrupo':{
                    name:  'getListaParametrosProdPorGrupo',
                    path: 'api/rrgg/parametro/parametrosproducto/{codProd}/{codParam}'
                },
                'methodgetListaParametrosTablaProdPorGrupo':{
                    name:  'getListaParametrosTablaProdPorGrupo',
                    path: 'api/rrgg/parametro/parametrostablaproducto/{codProd}/{codParam}/{codMoneda}'
                },
                'methodgetListaParametrosCabePorGrupo':{
                    name:  'getListaParametrosCabePorGrupo',
                    path: 'api/rrgg/parametro/cabeceraparametrosproducto/{codProd}'
                },
                'methodgetListaParametrosGiroNegocio':{
                    name:  'getListaParametrosGiroNegocio',
                    path: 'api/rrgg/parametro/parametroGiroNegocio'
                },
                'methodgetListaTipoDocumentoEmision':{
                    name:  'getListaTipoDocumentoEmision',
                    path: 'api/rrgg/parametro/tipodocumentoemision'
                },
                'methodgetListaTipoDocumentalEmision':{
                    name:  'getListaTipoDocumentalEmision',
                    path: 'api/rrgg/parametro/tipodocumentalemision'
                },
                'methodgetListaTipoFraccionamiento':{
                    name:  'getListaTipoFraccionamiento',
                    path: 'api/rrgg/parametro/tipofraccionamiento'
                },
                'methodgetDevolverAgente':{
                    name:  'getDevolverAgente',
                    path: 'api/rrgg/parametro/devolveragente/{codAgente}'
                },
            }
        },
        controllerTronSistema: {
            actions : {
                'methodGetListParametro':{
                    name:  'GetListParametro',
                    path: 'api/tron/sistema/{codSistema}/ramo/{codRamo}/parametro?p={p}'
                },
            }
        },
        controllerEmpresa: {
            actions : {
                'methodGetEmissionStep':{
                    name:  'GetEmissionStep',
                    path: 'api/empresa/emision/get/{nrodocumento}'
                },
                'methodSaveEmissionStep':{
                    name:  'SaveEmissionStep',
                    path: 'api/empresa/emision/save'
                },
                'methodLoadExcel':{
                    name:  'LoadExcel',
                    path: 'api/empresa/excel'
                },
                'methodGetListGiroNegocio':{
                    name:  'GetListGiroNegocio',
                    path: 'api/empresa/gironegocio/{codTipEmp}'
                },
                'methodGetListTipoEmpresa':{
                    name:  'GetListTipoEmpresa',
                    path: 'api/empresa/tipoempresa/{codCia}'
                },
                'methodGetListTipoLocal':{
                    name:  'GetListTipoLocal',
                    path: 'api/empresa/tipolocal/{codCia}'
                },
                'methodGetCategoriaConstruccion':{
                    name:  'GetCategoriaConstruccion',
                    path: 'api/empresa/categoriaConstruccion?codCia={codCia}&codRamo={codRamo}&codModalidad={codModalidad}'
                },
                'methodGetAlarmaMonitoreo':{
                    name:  'GetAlarmaMonitoreo',
                    path: 'api/empresa/alarmaMonitoreo?codCia={codCia}&codRamo={codRamo}&codModalidad={codModalidad}'
                },
                'methodGetListCantidadRiesgo':{
                    name:  'GetListCantidadRiesgo',
                    path: 'api/empresa/cantidadRiesgo'
                },
                'methodGetListEstructuraRiesgo':{
                    name:  'GetListEstructuraRiesgo',
                    path: 'api/empresa/estructurariesgo'
                },
                'methodGetListDepartamentosV2':{
                    name:  'GetListDepartamentosV2',
                    path: 'api/empresa/getDepartamentosV2'
                },
                'methodGetListProvinciasV2':{
                    name:  'GetListProvinciasV2',
                    path: 'api/empresa/getProvinciasV2/{codigoDepartamento}'
                },
                'methodGetListDistritosV2':{
                    name:  'GetListDistritosV2',
                    path: 'api/empresa/GetDistritosV2/{codigoProvincia}'
                },
                'methodGetGrupoPolizaV2':{
                    name:  'GetGrupoPolizaV2',
                    path: 'api/empresa/getGrupoPolizaV2/{codigoPoliza}'
                },
                'methodGetAgenteByCodigoV2':{
                    name:  'GetAgenteByCodigoV2',
                    path: 'api/empresa/GetAgenteByCodigoV2/{codigoCia}/{codigoAgente}'
                },
                'methodGetAgenteByNombreV2':{
                    name:  'GetAgenteByNombreV2',
                    path: 'api/empresa/GetAgenteByNombreV2/{codigoCia}/{nombreAgente}'
                },
                'methodGetAgenteV2':{
                    name:  'GetAgenteV2',
                    path: 'api/empresa/GetAgenteV2/{codigoCia}/{agente}'
                },
                'methodGetTipoEmpresaV2':{
                    name:  'GetTipoEmpresaV2',
                    path: 'api/empresa/GetTipoEmpresaV2/{codCia}'
                },
                'methodGetGiroNegocioV2':{
                    name:  'GetGiroNegocioV2',
                    path: 'api/empresa/GetGiroNegocioV2/{numSecu}'
                },
                'methodGetCategoriaConstruccionV2':{
                    name:  'GetCategoriaConstruccionV2',
                    path: 'api/empresa/GetCategoriaConstruccionV2/{codCia}'
                },
                'methodGetTipoDocumentosV2':{
                    name:  'GetTipoDocumentosV2',
                    path: 'api/empresa/getTipoDocumentosV2'
                },
                'methodGetClienteV2':{
                    name:  'GetClienteV2',
                    path: 'api/empresa/getClienteV2/{codCia}/{tipoDocumento}/{numeroDocumento}'
                },
                'methodGetListTipoLocalV2':{
                    name:  'GetListTipoLocalV2',
                    path: 'api/empresa/getListTipoLocalV2/{codCia}'
                },
                'methodGetListMonedaV2':{
                    name:  'GetListMonedaV2',
                    path: 'api/empresa/getListMonedaV2'
                },
                'methodGetListMatConstV2':{
                    name:  'GetListMatConstV2',
                    path: 'api/empresa/getListMatConstV2'
                },
                'methodGetListUsoPredioV2':{
                    name:  'GetListUsoPredioV2',
                    path: 'api/empresa/getListUsoPredioV2'
                },
                'methodGetProductosV2':{
                    name:  'GetProductosV2',
                    path: 'api/empresa/getProductosV2/{codCia}'
                },
                'methodGetProfesionesV2':{
                    name:  'GetProfesionesV2',
                    path: 'api/empresa/getProfesionesV2/{strDato}'
                },
                'methodGetConsolidadoCotizacionV2':{
                    name:  'GetConsolidadoCotizacionV2',
                    path: 'api/empresa/getConsolidadoCotizacionV2/{codCia}/{numDoc}'
                },
                'methodGetDocumento':{
                    name:  'GetDocumento',
                    path: 'api/empresa/getDocumentoV2/{numDoc}'
                },
                'methodGetDocumentoEmpresaPDFPost':{
                    name:  'GetDocumentoEmpresaPDFPost',
                    path: 'api/empresa/getDocumentoEmpresaPDFV2/{numDoc}'
                },
                'methodSendMailCotizacion':{
                    name:  'SendMailCotizacion',
                    path: 'api/empresa/cotizacion/sendMail'
                },
                'methodGetViaEmisionV2':{
                    name:  'GetViaEmisionV2',
                    path: 'api/empresa/getViaEmisionV2'
                },
                'methodGetNumeroEmisionV2':{
                    name:  'GetNumeroEmisionV2',
                    path: 'api/empresa/getNumeroEmisionV2'
                },
                'methodGetInteriorEmisionV2':{
                    name:  'GetInteriorEmisionV2',
                    path: 'api/empresa/getInteriorEmisionV2'
                },
                'methodGetZonaEmisionV2':{
                    name:  'GetZonaEmisionV2',
                    path: 'api/empresa/getZonaEmisionV2'
                },
                'methodGetObtenerInspectorV2':{
                    name:  'GetObtenerInspectorV2',
                    path: 'api/empresa/GetObtenerInspectorV2/{filtro}'
                },
                'methodGetProfesionesAll':{
                    name:  'GetProfesionesAll',
                    path: 'api/empresa/GetProfesionesAll'
                },
                'methodGetFiltrarCotizacionesV2':{
                    name:  'GetFiltrarCotizacionesV2',
                    path: 'api/empresa/bandejaPaginadoV2'
                },
                'methodGetObtenerNumeroAseguradosCVIV2':{
                    name:  'GetObtenerNumeroAseguradosCVIV2',
                    path: 'api/empresa/GetObtenerNumeroAseguradosCVIV2/{numDoc}'
                },
                'methodGetOrdenRegMaxCVIV2':{
                    name:  'GetOrdenRegMaxCVIV2',
                    path: 'api/empresa/GetOrdenRegMaxV2/{numDoc}'
                },
                'methodGetListCategoriaInspeccion':{
                    name:  'GetListCategoriaInspeccion',
                    path: 'api/empresa/categoriaInspeccion/{codCia}'
                },
                'methodGenerarCotizacion':{
                    name:  'GenerarCotizacion',
                    path: 'api/empresa/generar/cotizacion'
                },
                'methodgrabarCotizacionV2':{
                    name:  'grabarCotizacionV2',
                    path: 'api/empresa/grabarCotizacionV2'
                },
                'methodGetEmisionPdf':{
                    name:  'GetEmisionPdf',
                    path: 'api/empresa/descarga/emision/{codigoCompania}/{numeroPoliza}'
                },
                'methodSendMailEmision':{
                    name:  'SendMailEmision',
                    path: 'api/empresa/emision/sendMail'
                },
                'methodgrabarEmision':{
                    name:  'grabarEmision',
                    path: 'api/empresa/emision'
                },
            }
        },
        controllerUbigeo: {
            actions : {
                'methodgetUbigeo':{
                    name:  'getUbigeo',
                    path: 'api/general/ubigeo/buscar'
                },
                'methodgetDepartamento':{
                    name:  'getDepartamento',
                    path: 'api/general/ubigeo/departamento?codPais={codPais}'
                },
                'methodgetProvincia':{
                    name:  'getProvincia',
                    path: 'api/general/ubigeo/provincia/{id}?codPais={codPais}'
                },
                'methodgetDistrito':{
                    name:  'getDistrito',
                    path: 'api/general/ubigeo/distrito/{id}?codPais={codPais}'
                },
                'methodGetListPais':{
                    name:  'GetListPais',
                    path: 'api/general/ubigeo/pais'
                },
                'methodGetCodigoPostal':{
                    name:  'GetCodigoPostal',
                    path: 'api/general/ubigeo/codigopostal'
                },
            }
        },
        controllerSoat: {
            actions : {
                'methodGetListDelivery':{
                    name:  'GetListDelivery',
                    path: 'api/soat/listasdelivery/{codRubro}'
                },
                'methodGetListMarcaModelo':{
                    name:  'GetListMarcaModelo',
                    path: 'api/soat/marcamodelo'
                },
                'methodGetListTipoVehiculo':{
                    name:  'GetListTipoVehiculo',
                    path: 'api/soat/tipovehiculo/{codCom}/{codRam}'
                },
                'methodgetListMarca':{
                    name:  'getListMarca',
                    path: 'api/soat/marca/{codCom}/{codTip}'
                },
                'methodgetListModelo':{
                    name:  'getListModelo',
                    path: 'api/soat/modelo/{codCom}/{codTip}/{codMar}'
                },
                'methodgetListSubModeloOld':{
                    name:  'getListSubModeloOld',
                    path: 'api/soat/submodelo/old/{codCom}/{codTip}/{codMar}/{codMod}'
                },
                'methodgetListTipoUso':{
                    name:  'getListTipoUso',
                    path: 'api/soat/tipouso/{codCom}/{codRam}/{codMod}/{codTip}'
                },
                'methodValidPolizaManual':{
                    name:  'ValidPolizaManual',
                    path: 'api/soat/polizamanual/{polMan}'
                },
                'methodGetListPolizaManual':{
                    name:  'GetListPolizaManual',
                    path: 'api/soat/polizamanual/producto'
                },
                'methodGetValidarPsd':{
                    name:  'GetValidarPsd',
                    path: 'api/soat/validar/psc'
                },
                'methodEnviarMailSoatDigital':{
                    name:  'EnviarMailSoatDigital',
                    path: 'api/soat/mail/digital'
                },
                'methodValidarAgente':{
                    name:  'ValidarAgente',
                    path: 'api/soat/validar/agente'
                },
                'methodValidarAgentePorCodigo':{
                    name:  'ValidarAgentePorCodigo',
                    path: 'api/soat/validar/agente/{codigoAgente}'
                },
                'methodValidarOficinaParaAnularPoliza':{
                    name:  'ValidarOficinaParaAnularPoliza',
                    path: 'api/soat/validar/oficina/poliza/anular'
                },
                'methodAnularPoliza':{
                    name:  'AnularPoliza',
                    path: 'api/soat/poliza/anulada'
                },
                'methodGetListEstadoPoliza':{
                    name:  'GetListEstadoPoliza',
                    path: 'api/soat/poliza/estado'
                },
                'methodGetListEstadoPagoPoliza':{
                    name:  'GetListEstadoPagoPoliza',
                    path: 'api/soat/poliza/estado/pago'
                },
                'methodGetListDocumentoSoat':{
                    name:  'GetListDocumentoSoat',
                    path: 'api/soat/bandeja'
                },
                'methodGetListModalidadSoatDigital':{
                    name:  'GetListModalidadSoatDigital',
                    path: 'api/soat/modalidad/digital'
                },
            }
        }
    })



     module.factory("proxyAutomovil", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'ModificarPlacaEndosatario' : function(entity, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/automovil/modificar/placaendosatario',
                                         entity, undefined, showSpin)
                },
                'GetListMarcaModelo' : function(aut, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/automovil/marcamodelo',
                                         aut, undefined, showSpin)
                },
                'GetListMarca' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/automovil/marca',
                                         undefined, undefined, showSpin)
                },
                'GetListMarcaAutocomplete' : function(cadena, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/automovil/marcacompletar?cadena={cadena}',
                                                    { 'cadena':  { value: cadena, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetListModelo' : function(codMar, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/automovil/modelo/{codMar}',
                                                    { 'codMar':codMar   }),
                                         undefined, undefined, showSpin)
                },
                'GetListSubModeloOld' : function(codCia, codMar, codMod, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/automovil/submodelo/old/{codCia}/{codMar}/{codMod}',
                                                    { 'codCia':codCia  ,'codMar':codMar  ,'codMod':codMod   }),
                                         undefined, undefined, showSpin)
                },
                'GetListSubModelo' : function(codigoCompania, tipoVehiculo, codigoMarca, codigoModelo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/automovil/submodelo/{codigoCompania}/{tipoVehiculo}/{codigoMarca}/{codigoModelo}',
                                                    { 'codigoCompania':codigoCompania  ,'tipoVehiculo':tipoVehiculo  ,'codigoMarca':codigoMarca  ,'codigoModelo':codigoModelo   }),
                                         undefined, undefined, showSpin)
                },
                'GetListAnoFabricacion' : function(codMar, codMod, codSub, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/automovil/anofabricacion/{codMar}/{codMod}/{codSub}',
                                                    { 'codMar':codMar  ,'codMod':codMod  ,'codSub':codSub   }),
                                         undefined, undefined, showSpin)
                },
                'GetListTipoUso' : function(codRam, codMod, codTip, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/automovil/tipouso/{codRam}/{codMod}/{codTip}',
                                                    { 'codRam':codRam  ,'codMod':codMod  ,'codTip':codTip   }),
                                         undefined, undefined, showSpin)
                },
                'ValidarExcepcion' : function(excepcion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/automovil/validar/excepcion',
                                         excepcion, undefined, showSpin)
                },
                'GetListOcupacion' : function(codPrf, desPrf, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/automovil/ocupacion/{codPrf}/{desPrf}',
                                                    { 'codPrf':codPrf  ,'desPrf':desPrf   }),
                                         undefined, undefined, showSpin)
                },
                'GetListColor' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/automovil/color',
                                         undefined, undefined, showSpin)
                },
                'GetPolizaBroker' : function(groupprod, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/automovil/poliza/grupos/{groupprod}',
                                                    { 'groupprod':groupprod   }),
                                         undefined, undefined, showSpin)
                },
                'GetPolizaV2' : function(polGru, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/automovil/polizav2/{polGru}',
                                                    { 'polGru':polGru   }),
                                         undefined, undefined, showSpin)
                },
                'GetPoliza' : function(polGru, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/automovil/poliza/{polGru}',
                                                    { 'polGru':polGru   }),
                                         undefined, undefined, showSpin)
                },
                'ValidarPoliza' : function(nroPol, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/automovil/poliza/validar/{nroPol}',
                                                    { 'nroPol':nroPol   }),
                                         undefined, undefined, showSpin)
                },
                'GetTipoVehiculo' : function(codCia, codMar, codMod, codSub, codRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/automovil/tipovehiculo/{codCia}/{codMar}/{codMod}/{codSub}/{codRamo}',
                                                    { 'codCia':codCia  ,'codMar':codMar  ,'codMod':codMod  ,'codSub':codSub  ,'codRamo':  { value: codRamo, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetListTipoVehiculo' : function(codigoCompania, codRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/automovil/tipovehiculo/{codigoCompania}/{codRamo}',
                                                    { 'codigoCompania':codigoCompania  ,'codRamo':  { value: codRamo, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetMcagps' : function(codMar, codMod, codSub, anoFab, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/automovil/gps/{codMar}/{codMod}/{codSub}/{anoFab}',
                                                    { 'codMar':codMar  ,'codMod':codMod  ,'codSub':codSub  ,'anoFab':anoFab   }),
                                         undefined, undefined, showSpin)
                },
                'GetValorSugerido' : function(codEmpresa, codMarca, codModelo, codSubModelo, codTipVeh, anioFabricacion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/automovil/valorsugerido/{codEmpresa}/{codMarca}/{codModelo}/{codSubModelo}/{codTipVeh}/{anioFabricacion}',
                                                    { 'codEmpresa':codEmpresa  ,'codMarca':codMarca  ,'codModelo':codModelo  ,'codSubModelo':codSubModelo  ,'codTipVeh':codTipVeh  ,'anioFabricacion':anioFabricacion   }),
                                         undefined, undefined, showSpin)
                },
                'GetValorEmisionAutoUsado' : function(codMarca, codModelo, codSubModelo, anioFabricacion, valorVehiculo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/automovil/ValorEmisionAutoUsado/{codMarca}/{codModelo}/{codSubModelo}/{anioFabricacion}/{valorVehiculo}',
                                                    { 'codMarca':codMarca  ,'codModelo':codModelo  ,'codSubModelo':codSubModelo  ,'anioFabricacion':anioFabricacion  ,'valorVehiculo':valorVehiculo   }),
                                         undefined, undefined, showSpin)
                },
                'GetDescuentoComercial' : function(doc, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/automovil/descuento',
                                         doc, undefined, showSpin)
                },
                'GetDescuentoComision' : function(doc, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/automovil/descuento/comision',
                                         doc, undefined, showSpin)
                },
                'GetListProgram' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/automovil/programa',
                                         undefined, undefined, showSpin)
                },
                'GetCodigoCategoriaVehicular' : function(codCia, codMar, codMod, codSubMod, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/automovil/categoriaVehicular/{codCia}/{codMar}/{codMod}/{codSubMod}',
                                                    { 'codCia':codCia  ,'codMar':codMar  ,'codMod':codMod  ,'codSubMod':codSubMod   }),
                                         undefined, undefined, showSpin)
                },
                'GerMarcaPickupByTipoVeh' : function(codigoTipoVeh, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/automovil/marcapickup/{codigoTipoVeh}',
                                                    { 'codigoTipoVeh':codigoTipoVeh   }),
                                         undefined, undefined, showSpin)
                },
                'GerMarcaPickupByAFab' : function(anioFabricacion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/automovil/autonuevo/{anioFabricacion}',
                                                    { 'anioFabricacion':anioFabricacion   }),
                                         undefined, undefined, showSpin)
                },
                'GetDatosCatGpsTip' : function(codCia, codMar, codMod, codSubMod, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/automovil/datosautomovilcatgpstip/{codCia}/{codMar}/{codMod}/{codSubMod}',
                                                    { 'codCia':codCia  ,'codMar':codMar  ,'codMod':codMod  ,'codSubMod':codSubMod   }),
                                         undefined, undefined, showSpin)
                },
                'GetNombrePolizaGrupo' : function(codCia, polGru, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/automovil/buscar/polizagrupo/{codCia}/{polGru}',
                                                    { 'codCia':codCia  ,'polGru':polGru   }),
                                         undefined, undefined, showSpin)
                },
                'GetValidarPsd' : function(veh, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/automovil/validar/psc',
                                         veh, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyAutomovilEmblem", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'GetListTipoFrecuenciaUsoVehiculo' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/automovil/list/tipofrecuenciauso',
                                         undefined, undefined, showSpin)
                },
                'GetListAntiguedadLicenciaConducir' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/automovil/list/antiguedadlicencia',
                                         undefined, undefined, showSpin)
                },
                'GetListUsualGaraje' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/automovil/list/usualgaraje',
                                         undefined, undefined, showSpin)
                },
                'GetListConductorPropio' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/automovil/list/conductorpropio',
                                         undefined, undefined, showSpin)
                },
                'GetListAccidentesUltimosDosAnios' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/automovil/list/accidentesultimosanios',
                                         undefined, undefined, showSpin)
                },
                'GetListTipoUsoVehiculo' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/automovil/list/tipousovehiculo',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyAgente", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'buscarAgente' : function(codigoNombre, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/agente/buscar?codigoNombre={codigoNombre}',
                                                    { 'codigoNombre':codigoNombre   }),
                                         undefined, undefined, showSpin)
                },
                'buscarAgenteSctr' : function(codigoNombre, codigoRol, codigoGestor, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/agente/sctr/buscar/{codigoNombre}/{codigoRol}/{codigoGestor}',
                                                    { 'codigoNombre':  { value: codigoNombre, defaultValue:'' } ,'codigoRol':  { value: codigoRol, defaultValue:'' } ,'codigoGestor':  { value: codigoGestor, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetListAgenteVida' : function(objAgenteBE, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/agente/vida',
                                         objAgenteBE, undefined, showSpin)
                },
                'GetListAgenteSalud' : function(objAgenteBE, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/agente/salud',
                                         objAgenteBE, undefined, showSpin)
                },
                'GetDatoDocumentoAgente' : function(codigoAgente, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/agente/dato/documento/{codigoAgente}',
                                                    { 'codigoAgente':codigoAgente   }),
                                         undefined, undefined, showSpin)
                },
                'GetRegionOficina' : function(codigoCompania, codigoAgente, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/agente/region/oficina/{codigoCompania}/{codigoAgente}',
                                                    { 'codigoCompania':codigoCompania  ,'codigoAgente':codigoAgente   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyInspeccion", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'ValidInspeccion' : function(nro, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/inspeccion/validar/{nro}',
                                                    { 'nro':nro   }),
                                         undefined, undefined, showSpin)
                },
                'GetPorcentajeDerechoEmision' : function(ins, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/inspeccion/porcderechoemision',
                                         ins, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPersonForm", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'getPersonForm' : function(formCode, appCode, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/form/person/fields?formCode={formCode}&appCode={appCode}',
                                                    { 'formCode':formCode  ,'appCode':appCode   }),
                                         undefined, undefined, showSpin)
                },
                'putPersonForm' : function(formCode, appCode, field, showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + helper.formatNamed('api/form/person/fields?formCode={formCode}&appCode={appCode}',
                                                    { 'formCode':formCode  ,'appCode':appCode   }),
                                         field, undefined, showSpin)
                },
                'getPersonEquifax' : function(contractorCriteria, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/form/person/equifax',
                                         contractorCriteria, undefined, showSpin)
                },
                'getValidService' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/form/person/serviceValid',
                                         request, undefined, showSpin)
                },
                'GetTipoDocumento' : function(formCode, appCode, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/form/person/TipoDoc?formCode={formCode}&appCode={appCode}',
                                                    { 'formCode':formCode  ,'appCode':appCode   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCotizacion", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'GenerarCotizacionCampoSanto' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/cotizar/camposanto',
                                         cotizacion, undefined, showSpin)
                },
                'getDsctoEspecial' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/dsctoespecial',
                                         cotizacion, undefined, showSpin)
                },
                'grabarCotizacion' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/grabar/vehiculo',
                                         cotizacion, undefined, showSpin)
                },
                'cotizarVehiculo' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/cotizar/vehiculo',
                                         cotizacion, undefined, showSpin)
                },
                'CalcularPrimaVehiculo' : function(cotizaciones, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/calcularprima/vehiculo',
                                         cotizaciones, undefined, showSpin)
                },
                'CalcularPrimaVehiculoIndividual' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/calcularprimaindividual/vehiculo',
                                         cotizacion, undefined, showSpin)
                },
                'CalcularPrimaVehiculo2' : function(cotizaciones, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/calcularprima2/vehiculo',
                                         cotizaciones, undefined, showSpin)
                },
                'grabarCotizacionSoat' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/grabar/soatvehiculo',
                                         cotizacion, undefined, showSpin)
                },
                'cotizarSoatVehiculo' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/cotizar/soatvehiculo',
                                         cotizacion, undefined, showSpin)
                },
                'cotizarHogar' : function(cotizacionHogar, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/cotizar/hogar',
                                         cotizacionHogar, undefined, showSpin)
                },
                'grabarCotizacionHogar' : function(cotizacionHogar, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/grabar/hogar',
                                         cotizacionHogar, undefined, showSpin)
                },
                'grabarCotizacionHogarBulk' : function(cotizacionHogar, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/grabar/hogar/bulk',
                                         cotizacionHogar, undefined, showSpin)
                },
                'buscarCotizacionPrima' : function(codigo, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/cotizacion/prima/hogar/{codigo}',
                                                    { 'codigo':codigo   }),
                                         undefined, undefined, showSpin)
                },
                'buscarCotizacionPorCodigo' : function(codigo, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/cotizacion/buscar/hogar/{codigo}',
                                                    { 'codigo':codigo   }),
                                         undefined, undefined, showSpin)
                },
                'listarFinanciamientoCotizaHogar' : function(cotizacionHogar, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/financiamiento/hogar',
                                         cotizacionHogar, undefined, showSpin)
                },
                'listarComparativoCotizaHogar' : function(comparativo, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/comparativo/hogar',
                                         comparativo, undefined, showSpin)
                },
                'cotizarTransporte' : function(cotizacionTransporte, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/cotizar/transporte',
                                         cotizacionTransporte, undefined, showSpin)
                },
                'GetCotizacionAccidente' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/cotizar/accidente',
                                         cotizacion, undefined, showSpin)
                },
                'GetRiesgoAccidenteGrabado' : function(codigo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/cotizacion/cotizar/obtenerriesgo/{codigo}',
                                                    { 'codigo':codigo   }),
                                         undefined, undefined, showSpin)
                },
                'CotizacionAccidenteRegistrar' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/grabar/accidente',
                                         cotizacion, undefined, showSpin)
                },
                'CotizacionAccidenteObtener' : function(CodigoProducto, NumeroDocumento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/cotizacion/accidente/obtener/{CodigoProducto}/{NumeroDocumento}',
                                                    { 'CodigoProducto':CodigoProducto  ,'NumeroDocumento':NumeroDocumento   }),
                                         undefined, undefined, showSpin)
                },
                'cotizarEmpresa' : function(cotizacionEmp, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/cotizar/empresa',
                                         cotizacionEmp, undefined, showSpin)
                },
                'grabarCotizacionEmpresa' : function(cotizacionEmpresa, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/grabar/empresa',
                                         cotizacionEmpresa, undefined, showSpin)
                },
                'GenerarPrimaVida' : function(seguro, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/calcularprima/vida',
                                         seguro, undefined, showSpin)
                },
                'calcularCotizacionVida' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/calcular/vida',
                                         cotizacion, undefined, showSpin)
                },
                'grabarCotizacionVida' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/vida',
                                         cotizacion, undefined, showSpin)
                },
                'buscarCotizacionVidaPorCodigo' : function(codigo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/cotizacion/vida/{codigo}',
                                                    { 'codigo':codigo   }),
                                         undefined, undefined, showSpin)
                },
                'ListarCotizacionPendientePag' : function(model, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/vida/pendientepaginado',
                                         model, undefined, showSpin)
                },
                'ListarCotizacionEnviadaPag' : function(model, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/vida/enviadapaginado',
                                         model, undefined, showSpin)
                },
                'ListarCotizacionDecesoPag' : function(model, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/consulta/decesopaginado',
                                         model, undefined, showSpin)
                },
                'ListarCotizacionReferidoPag' : function(model, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/vida/referidopaginado',
                                         model, undefined, showSpin)
                },
                'CotizacionVida' : function(rqCotizarVida, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/orquestador/vida',
                                         rqCotizarVida, undefined, showSpin)
                },
                'GenerarCotizacionSalud' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/generar/salud',
                                         cotizacion, undefined, showSpin)
                },
                'GuardarCotizacionSalud' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/salud',
                                         cotizacion, undefined, showSpin)
                },
                'ObtenerCotizacion' : function(numeroDocumento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/cotizacion/salud/{numeroDocumento}',
                                                    { 'numeroDocumento':numeroDocumento   }),
                                         undefined, undefined, showSpin)
                },
                'ObtenerCotizacionRenovacion' : function(codigoCia, codigoRamo, numeroPoliza, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/cotizacion/salud/renovacion/{codigoCia}/{codigoRamo}/{numeroPoliza}',
                                                    { 'codigoCia':codigoCia  ,'codigoRamo':codigoRamo  ,'numeroPoliza':numeroPoliza   }),
                                         undefined, undefined, showSpin)
                },
                'CotizacionSolicitudMigracion' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/cotizacion/generar/migracion',
                                         cotizacion, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyContratante", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'GetContratanteByNroDocumento' : function(CodEmpresa, TipoDoc, NroDocumento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/contratante/datos/{CodEmpresa}/{TipoDoc}/{NroDocumento}',
                                                    { 'CodEmpresa':CodEmpresa  ,'TipoDoc':TipoDoc  ,'NroDocumento':NroDocumento   }),
                                         undefined, undefined, showSpin)
                },
                'GetContratanteByNroDocumentoCias' : function(TipoDoc, NroDocumento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/contratante/multiempresa/{TipoDoc}/{NroDocumento}',
                                                    { 'TipoDoc':TipoDoc  ,'NroDocumento':NroDocumento   }),
                                         undefined, undefined, showSpin)
                },
                'GetContratanteSoatByNroDocumento' : function(CodEmpresa, TipoDoc, NroDocumento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/contratante/datos/soat/{CodEmpresa}/{TipoDoc}/{NroDocumento}',
                                                    { 'CodEmpresa':CodEmpresa  ,'TipoDoc':TipoDoc  ,'NroDocumento':NroDocumento   }),
                                         undefined, undefined, showSpin)
                },
                'GetPostContratanteSoatByNroDocumento' : function(contratanteDto, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/contratante/datos/soat',
                                         contratanteDto, undefined, showSpin)
                },
                'GetTerceroByNroDocumento' : function(CodEmpresa, TipoDoc, NroDocumento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/contratante/tercero/{CodEmpresa}/{TipoDoc}/{NroDocumento}',
                                                    { 'CodEmpresa':CodEmpresa  ,'TipoDoc':TipoDoc  ,'NroDocumento':NroDocumento   }),
                                         undefined, undefined, showSpin)
                },
                'GetListEndosatario' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/contratante/endosatario',
                                         undefined, undefined, showSpin)
                },
                'GetListEndosatarioAutocomplete' : function(dato, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/contratante/endosatario/autocomplete/{dato}',
                                                    { 'dato':dato   }),
                                         undefined, undefined, showSpin)
                },
                'GetEndosatario' : function(numDoc, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/contratante/endosatario/{numDoc}',
                                                    { 'numDoc':numDoc   }),
                                         undefined, undefined, showSpin)
                },
                'GetEndosatarioTercero' : function(dato, codCia, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/contratante/endosatario/tercero?dato={dato}&codCia={codCia}',
                                                    { 'dato':  { value: dato, defaultValue:'' } ,'codCia':  { value: codCia, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetEndosatarioTerceroByRuc' : function(dato, codCia, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/contratante/endosatario/tercero/{dato}?codCia={codCia}',
                                                    { 'dato':  { value: dato, defaultValue:'' } ,'codCia':  { value: codCia, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetEndosatarioTerceroByRucAndCia' : function(dato, codCia, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/contratante/endosatario/tercero/{dato}/{codCia}',
                                                    { 'dato':  { value: dato, defaultValue:'' } ,'codCia':  { value: codCia, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetEndosatarioTerceroAutocomplete' : function(rqEndosatario, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/contratante/endosatario/tercero/autocomplete',
                                         rqEndosatario, undefined, showSpin)
                },
                'GetListAbonado' : function(tipoDocumento, numeroDocumento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/contratante/abonado/pendiente/{tipoDocumento}/{numeroDocumento}',
                                                    { 'tipoDocumento':  { value: tipoDocumento, defaultValue:'' } ,'numeroDocumento':  { value: numeroDocumento, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetAbonado' : function(tipoDocumento, numeroDocumento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/contratante/abonado/pendiente?tipoDocumento={tipoDocumento}&numeroDocumento={numeroDocumento}',
                                                    { 'tipoDocumento':  { value: tipoDocumento, defaultValue:'' } ,'numeroDocumento':  { value: numeroDocumento, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetContratanteEquifaxByNroDocumento' : function(TipoDoc, NroDocumento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/contratante/datos/equifax/{TipoDoc}/{NroDocumento}',
                                                    { 'TipoDoc':TipoDoc  ,'NroDocumento':NroDocumento   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyHogar", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'GetTipoInmueble' : function(codCia, codRamo, codModalidad, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/hogar/tipoinmueble?codCia={codCia}&codRamo={codRamo}&codModalidad={codModalidad}',
                                                    { 'codCia':codCia  ,'codRamo':codRamo  ,'codModalidad':  { value: codModalidad, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetMaterialConstruccion' : function(codCia, codRamo, codModalidad, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/hogar/materialconstruccion?codCia={codCia}&codRamo={codRamo}&codModalidad={codModalidad}',
                                                    { 'codCia':codCia  ,'codRamo':codRamo  ,'codModalidad':  { value: codModalidad, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetCategoriaInspeccion' : function(codCia, codRamo, codModalidad, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/hogar/categoriaInspeccion?codCia={codCia}&codRamo={codRamo}&codModalidad={codModalidad}',
                                                    { 'codCia':codCia  ,'codRamo':codRamo  ,'codModalidad':  { value: codModalidad, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetCategoriaConstruccion' : function(codCia, codRamo, codModalidad, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/hogar/categoriaConstruccion?codCia={codCia}&codRamo={codRamo}&codModalidad={codModalidad}',
                                                    { 'codCia':codCia  ,'codRamo':codRamo  ,'codModalidad':  { value: codModalidad, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetInspectoresHogar' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/hogar/inspectores',
                                         undefined, undefined, showSpin)
                },
                'GetAnioInmueble' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/hogar/anioInmueble',
                                         undefined, undefined, showSpin)
                },
                'GetAlarmaMonitoreo' : function(codCia, codRamo, codModalidad, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/hogar/alarmaMonitoreo?codCia={codCia}&codRamo={codRamo}&codModalidad={codModalidad}',
                                                    { 'codCia':codCia  ,'codRamo':codRamo  ,'codModalidad':  { value: codModalidad, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetAlarmaMonitoreo' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/hogar/AlertManagement',
                                         undefined, undefined, showSpin)
                },
                'GetListFinanciamiento' : function(codigoModalidad, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/hogar/financiamiento/{codigoModalidad}',
                                                    { 'codigoModalidad':codigoModalidad   }),
                                         undefined, undefined, showSpin)
                },
                'GetModalidadHogarModalidad2' : function(codCia, codRamo, codModalidad, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/hogar/modalidad/{codCia}/{codRamo}?codModalidad={codModalidad}',
                                                    { 'codCia':codCia  ,'codRamo':codRamo  ,'codModalidad':  { value: codModalidad, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetModalidadHogarModalidad' : function(codCia, codRamo, codModalidad, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/hogar/modalidad/{codCia}/{codRamo}/{codModalidad}',
                                                    { 'codCia':codCia  ,'codRamo':codRamo  ,'codModalidad':  { value: codModalidad, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetComunicationType' : function(codCia, codRamo, codModalidad, alertCode, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/hogar/ComunicationType?codCia={codCia}&codRamo={codRamo}&codModalidad={codModalidad}&alertCode={alertCode}',
                                                    { 'codCia':codCia  ,'codRamo':codRamo  ,'codModalidad':  { value: codModalidad, defaultValue:'0' } ,'alertCode':  { value: alertCode, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetPackageType' : function(comunicationTypeId, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/hogar/PackageType?comunicationTypeId={comunicationTypeId}',
                                                    { 'comunicationTypeId':comunicationTypeId   }),
                                         undefined, undefined, showSpin)
                },
                'Quotation' : function(request2, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/hogar/Quotation',
                                         request2, undefined, showSpin)
                },
                'QuotationCompare' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/hogar/Quotation/Compare',
                                         request, undefined, showSpin)
                },
                'InsuranceCost' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/hogar/Insurance/Cost',
                                         request, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyReporte", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'ReporteCotizacionAutos' : function(codCia, codDocumento, codRamo, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/reporte/autos/cotizacion/{codCia}/{codDocumento}/{codRamo}',
                                                    { 'codCia':codCia  ,'codDocumento':codDocumento  ,'codRamo':codRamo   }),
                                         undefined, undefined, showSpin)
                },
                'ReporteCotizacionHogarJson' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/reporte/hogar/cotizacion',
                                         undefined, undefined, showSpin)
                },
                'ReporteCotizacionHogar' : function(codCia, codDocumento, codRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/reporte/hogar/cotizacion/{codCia}/{codDocumento}/{codRamo}',
                                                    { 'codCia':codCia  ,'codDocumento':codDocumento  ,'codRamo':codRamo   }),
                                         undefined, undefined, showSpin)
                },
                'ReporteCotizacionAccidente' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/reporte/accidente/cotizacion',
                                         undefined, undefined, showSpin)
                },
                'ReporteCotizacionSoat' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/reporte/soat/cotizacion',
                                         undefined, undefined, showSpin)
                },
                'ReporteCotizacion' : function(numeroCotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/reporte/vida/cotizacion/{numeroCotizacion}',
                                                    { 'numeroCotizacion':numeroCotizacion   }),
                                         undefined, undefined, showSpin)
                },
                'GetReporteTransporte' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/reporte/transporte/emision',
                                         undefined, undefined, showSpin)
                },
                'ReporteResumenEquipo' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/reporte/vida/resumenequipo',
                                         undefined, undefined, showSpin)
                },
                'ReporteResumenAgente' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/reporte/vida/resumenagente',
                                         undefined, undefined, showSpin)
                },
                'ReporteCotizacionSalud' : function(numeroDocumento, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/reporte/salud/cotizacion/{numeroDocumento}',
                                                    { 'numeroDocumento':numeroDocumento   }),
                                         undefined, undefined, showSpin)
                },
                'DescargarPoliza' : function(codigoCompania, numeroPoliza, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/reporte/descargar/poliza/{codigoCompania}/{numeroPoliza}',
                                                    { 'codigoCompania':codigoCompania  ,'numeroPoliza':numeroPoliza   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyProducto", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'getListProductoNuevo' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/producto/nuevo',
                                         undefined, undefined, showSpin)
                },
                'getListTypeProducto' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/producto/tipo',
                                         undefined, undefined, showSpin)
                },
                'getListAsignado' : function(cod, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/producto/relacionado/{cod}',
                                                    { 'cod':cod   }),
                                         undefined, undefined, showSpin)
                },
                'getListProductByMarca' : function(codMar, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/producto/marca/{codMar}',
                                                    { 'codMar':codMar   }),
                                         undefined, undefined, showSpin)
                },
                'getListProductByUsuario' : function(proSec, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/producto/usuario',
                                         proSec, undefined, showSpin)
                },
                'getListProductoPorVehiculo' : function(proSec, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/producto/porproducto',
                                         proSec, undefined, showSpin)
                },
                'GetListProductoVida' : function(codigo, descripcion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/producto/vida?codigo={codigo}&descripcion={descripcion}',
                                                    { 'codigo':  { value: codigo, defaultValue:'0' } ,'descripcion':  { value: descripcion, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetListProductoVidaByCodigo' : function(codigo, descripcion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/producto/vida/{codigo}?descripcion={descripcion}',
                                                    { 'codigo':  { value: codigo, defaultValue:'0' } ,'descripcion':  { value: descripcion, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetListProductoVidaByCodigoDesc' : function(codigo, descripcion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/producto/vida/{codigo}/{descripcion}',
                                                    { 'codigo':  { value: codigo, defaultValue:'0' } ,'descripcion':  { value: descripcion, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetListProductoBandeja' : function(codigoCia, codigoRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/producto/bandeja?codigoCia={codigoCia}&codigoRamo={codigoRamo}',
                                                    { 'codigoCia':  { value: codigoCia, defaultValue:'0' } ,'codigoRamo':  { value: codigoRamo, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetListProductoBandejaxCiaRamo' : function(codigoCia, codigoRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/producto/bandeja/{codigoCia}/{codigoRamo}',
                                                    { 'codigoCia':  { value: codigoCia, defaultValue:'0' } ,'codigoRamo':  { value: codigoRamo, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetProductDescription' : function(codigoProducto, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/producto/description/{codigoProducto}',
                                                    { 'codigoProducto':codigoProducto   }),
                                         undefined, undefined, showSpin)
                },
                'ListarProductoTronPag' : function(model, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/producto/salud/tronPaginado',
                                         model, undefined, showSpin)
                },
                'RegistrarProductoSalud' : function(producto, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/producto/salud',
                                         producto, undefined, showSpin)
                },
                'ActualizarEstadoProductoSalud' : function(producto, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/producto/salud/actualizarEstado',
                                         producto, undefined, showSpin)
                },
                'ListarProductoSalud' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/producto/salud/cotizacion',
                                         undefined, undefined, showSpin)
                },
                'ListarProductoGlobal' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/producto/salud',
                                         undefined, undefined, showSpin)
                },
                'ObtenerProductoGlobal' : function(codigoCia, codigoRamo, numeroContrato, numeroSubContrato, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/producto/salud/{codigoCia}/{codigoRamo}/{numeroContrato}/{numeroSubContrato}',
                                                    { 'codigoCia':codigoCia  ,'codigoRamo':codigoRamo  ,'numeroContrato':numeroContrato  ,'numeroSubContrato':numeroSubContrato   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyEmision", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'grabarEmisionVehiculo' : function(emision, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/emision/grabar/vehiculo',
                                         emision, undefined, showSpin)
                },
                'grabarEmisionConInspeccion' : function(emision, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/emision/grabar/vehiculoinspeccion',
                                         emision, undefined, showSpin)
                },
                'validatePlate' : function(emision, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/emision/validar/placa',
                                         emision, undefined, showSpin)
                },
                'CargaAltaDocumental' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/emision/vehiculo/cargaAltaDocumental',
                                         undefined, undefined, showSpin)
                },
                'GrabarEmisionTransporte' : function(emision, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/emision/grabar/transporte',
                                         emision, undefined, showSpin)
                },
                'grabarEmisionHogar' : function(emision, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/emision/grabar/hogar',
                                         emision, undefined, showSpin)
                },
                'grabarEmisionSoat' : function(emision, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/emision/grabar/soat',
                                         emision, undefined, showSpin)
                },
                'getListRiesgo' : function(veh, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/emision/riesgo',
                                         veh, undefined, showSpin)
                },
                'getListRiesgoCasco' : function(veh, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/emision/riesgocasco',
                                         veh, undefined, showSpin)
                },
                'grabarEmisionAccidente' : function(emision, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/emision/grabar/accidente',
                                         emision, undefined, showSpin)
                },
                'grabarEmisionVida' : function(emision, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/emision/Vida',
                                         emision, undefined, showSpin)
                },
                'grabarEmisionOrquestadorVida' : function(emision, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/emision/vida/orquestador',
                                         emision, undefined, showSpin)
                },
                'grabarAnulacionPoliza' : function(anulacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/emision/salud/anulacion',
                                         anulacion, undefined, showSpin)
                },
                'grabarAnulacionSuplemente' : function(suplemento, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/emision/salud/suplemento/anulacion',
                                         suplemento, undefined, showSpin)
                },
                'grabarRenovacionPoliza' : function(renovacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/emision/salud/renovacion',
                                         renovacion, undefined, showSpin)
                },
                'generarEmisionPoliza' : function(solicitud, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/emision/salud/emision/poliza',
                                         solicitud, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyEpsEmpresa", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'CrearCotizacion' : function(id, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('epsempresa/empresa/proforma/{id}/cotizacion',
                                                    { 'id':id   }),
                                         undefined, undefined, showSpin)
                },
                'ObtenerCotizacion' : function(id, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('epsempresa/empresa/proforma/{id}/cotizacion',
                                                    { 'id':id   }),
                                         undefined, undefined, showSpin)
                },
                'CrearProforma' : function(proformaBE, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'epsempresa/empresa/proforma',
                                         proformaBE, undefined, showSpin)
                },
                'ObtenerProformas' : function(numeroPagina, cantidadPorPagina, fechaDesde, fechaHasta, ruc, empresa, estado, limite, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('epsempresa/empresa/proformas?numeroPagina={numeroPagina}&cantidadPorPagina={cantidadPorPagina}&fechaDesde={fechaDesde}&fechaHasta={fechaHasta}&ruc={ruc}&empresa={empresa}&estado={estado}&limite={limite}',
                                                    { 'numeroPagina':numeroPagina  ,'cantidadPorPagina':cantidadPorPagina  ,'fechaDesde':  { value: fechaDesde, defaultValue:'' } ,'fechaHasta':  { value: fechaHasta, defaultValue:'' } ,'ruc':  { value: ruc, defaultValue:'' } ,'empresa':  { value: empresa, defaultValue:'' } ,'estado':  { value: estado, defaultValue:'' } ,'limite':  { value: limite, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'ObtenerInforme' : function(id, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('epsempresa/empresa/proforma/{id}/informe',
                                                    { 'id':id   }),
                                         undefined, undefined, showSpin)
                },
                'CrearParametro' : function(parametroBE, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'epsempresa/empresa/parametro',
                                         parametroBE, undefined, showSpin)
                },
                'ActualizarParametro' : function(parametroBE, id, showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + helper.formatNamed('epsempresa/empresa/parametro/{id}',
                                                    { 'id':id   }),
                                         parametroBE, undefined, showSpin)
                },
                'EliminarParametro' : function(id, showSpin){
                    return httpData['delete'](oimProxyPoliza.endpoint + helper.formatNamed('epsempresa/empresa/parametro/{id}',
                                                    { 'id':id   }),
                                         undefined, undefined, showSpin)
                },
                'ObtenerParametros' : function(numeroPagina, cantidadPorPagina, limite, grupo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('epsempresa/empresa/parametros?numeroPagina={numeroPagina}&cantidadPorPagina={cantidadPorPagina}&limite={limite}&grupo={grupo}',
                                                    { 'numeroPagina':numeroPagina  ,'cantidadPorPagina':cantidadPorPagina  ,'limite':  { value: limite, defaultValue:'0' } ,'grupo':  { value: grupo, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ObtenerParametro' : function(id, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('epsempresa/empresa/parametro/{id}',
                                                    { 'id':id   }),
                                         undefined, undefined, showSpin)
                },
                'CrearTarifa' : function(tarifaBE, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'epsempresa/empresa/tarifa',
                                         tarifaBE, undefined, showSpin)
                },
                'ActualizarTarifa' : function(tarifaBE, id, showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + helper.formatNamed('epsempresa/empresa/tarifa/{id}',
                                                    { 'id':id   }),
                                         tarifaBE, undefined, showSpin)
                },
                'EliminarTarifa' : function(id, showSpin){
                    return httpData['delete'](oimProxyPoliza.endpoint + helper.formatNamed('epsempresa/empresa/tarifa/{id}',
                                                    { 'id':id   }),
                                         undefined, undefined, showSpin)
                },
                'ObtenerTarifa' : function(id, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('epsempresa/empresa/tarifa/{id}',
                                                    { 'id':id   }),
                                         undefined, undefined, showSpin)
                },
                'ObtenerTarifas' : function(numeroPagina, cantidadPorPagina, limite, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('epsempresa/empresa/tarifas?numeroPagina={numeroPagina}&cantidadPorPagina={cantidadPorPagina}&limite={limite}',
                                                    { 'numeroPagina':numeroPagina  ,'cantidadPorPagina':cantidadPorPagina  ,'limite':  { value: limite, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'ObtenerEntidadJuridcaNatural' : function(numDoc, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('epsempresa/empresa/equifax/persona?numDoc={numDoc}',
                                                    { 'numDoc':numDoc   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyGestor", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'GetListGestor' : function(objGestorBE, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/gestor/vida',
                                         objGestorBE, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyEmisionRg", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'EmisionRobotResponsabilidadcivil' : function(emision, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/rrgg/emision/robot/responsabilidadcivil',
                                         emision, undefined, showSpin)
                },
                'EmisionRobotEquipoContratista' : function(emision, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/rrgg/emision/robot/equipocontratista',
                                         emision, undefined, showSpin)
                },
                'EmisionRobotTransporteTerrestre' : function(emision, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/rrgg/emision/robot/transporteterrestre',
                                         emision, undefined, showSpin)
                },
                'EmisionSuscriptor' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/rrgg/emision/suscriptor',
                                         undefined, undefined, showSpin)
                },
                'CargarAseguradosMasivo' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/rrgg/emision/leer-archivo/masiva',
                                         undefined, undefined, showSpin)
                },
                'ExportarSolicitudesRrGg' : function(numeroTramite, grupoProducto, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/rrgg/emision/exportar/pdf/{numeroTramite}/{grupoProducto}',
                                                    { 'numeroTramite':numeroTramite  ,'grupoProducto':grupoProducto   }),
                                         undefined, undefined, showSpin)
                },
                'EmisionRobotConstruccion' : function(emision, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/rrgg/emision/robot/construccion',
                                         emision, undefined, showSpin)
                },
                'EmisionRobotDeshonestidad' : function(emision, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/rrgg/emision/robot/deshonestidad',
                                         emision, undefined, showSpin)
                },
                'EmisionRobotTransporteMaritimoAereo' : function(emision, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/rrgg/emision/robot/transportemaritimoaereo',
                                         emision, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyDomicilio", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'getNumeracionDomicilio' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/domicilio/numeracion',
                                         undefined, undefined, showSpin)
                },
                'GetListTipo' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/domicilio/tipo',
                                         undefined, undefined, showSpin)
                },
                'GetListInterior' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/domicilio/interior',
                                         undefined, undefined, showSpin)
                },
                'GetListZona' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/domicilio/zona',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyReferido", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'existeReferidoPoliza' : function(numeroReferido, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/referido/existeReferidoPoliza/{numeroReferido}',
                                                    { 'numeroReferido':numeroReferido   }),
                                         undefined, undefined, showSpin)
                },
                'esAgenteReferido' : function(codigoAgente, codigoCompania, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/referido/esAgenteReferido/{codigoAgente}/{codigoCompania}',
                                                    { 'codigoAgente':codigoAgente  ,'codigoCompania':codigoCompania   }),
                                         undefined, undefined, showSpin)
                },
                'RegistrarPolizaReferido' : function(referido, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/referido/registraPolizaReferido',
                                         referido, undefined, showSpin)
                },
                'EsReferidoObligatorio' : function(esReferidoObligatorioBE, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/referido/EsReferidoObligatorio',
                                         esReferidoObligatorioBE, undefined, showSpin)
                },
                'ValidateReferredNumber' : function(numeroReferido, accion, codigoAgente, esSupervisor, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/referido/{numeroReferido}/validacion/{accion}/{codigoAgente}/{esSupervisor}',
                                                    { 'numeroReferido':numeroReferido  ,'accion':  { value: accion, defaultValue:'' } ,'codigoAgente':  { value: codigoAgente, defaultValue:'0' } ,'esSupervisor':  { value: esSupervisor, defaultValue:'true' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyDeceso", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'ListarRamo' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/deceso/ramo',
                                         undefined, undefined, showSpin)
                },
                'ListaPolizaGrupo' : function(codigoRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/deceso/polizaGrupo?codigoRamo={codigoRamo}',
                                                    { 'codigoRamo':codigoRamo   }),
                                         undefined, undefined, showSpin)
                },
                'ListaModalidad' : function(codigoRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/deceso/modalidad?codigoRamo={codigoRamo}',
                                                    { 'codigoRamo':codigoRamo   }),
                                         undefined, undefined, showSpin)
                },
                'ListaFinanciamiento' : function(codigoRamo, numeroPolizaGrupo, codigoModalidad, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/deceso/financiamiento?codigoRamo={codigoRamo}&numeroPolizaGrupo={numeroPolizaGrupo}&codigoModalidad={codigoModalidad}',
                                                    { 'codigoRamo':codigoRamo  ,'numeroPolizaGrupo':numeroPolizaGrupo  ,'codigoModalidad':codigoModalidad   }),
                                         undefined, undefined, showSpin)
                },
                'ValidaEdad' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/deceso/asegurado/valida/edad',
                                         cotizacion, undefined, showSpin)
                },
                'FechaVigencia' : function(CodigoRamo, NumeroPolizaGrupo, CodigoModalidad, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/deceso/poliza/vigencia/{CodigoRamo}/{NumeroPolizaGrupo}/{CodigoModalidad}',
                                                    { 'CodigoRamo':CodigoRamo  ,'NumeroPolizaGrupo':NumeroPolizaGrupo  ,'CodigoModalidad':CodigoModalidad   }),
                                         undefined, undefined, showSpin)
                },
                'GetListAgente' : function(objAgenteBE, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/deceso/agente',
                                         objAgenteBE, undefined, showSpin)
                },
                'GetListGestorCotizacion' : function(objGestorBE, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/deceso/gestor/cotizacion',
                                         objGestorBE, undefined, showSpin)
                },
                'GetListAgenteCotizacion' : function(objAgenteBE, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/deceso/agente/cotizacion',
                                         objAgenteBE, undefined, showSpin)
                },
                'ListaTipoAsegurado' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/deceso/asegurado/tipo',
                                         undefined, undefined, showSpin)
                },
                'ListaMedioPago' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/deceso/asegurado/pago',
                                         undefined, undefined, showSpin)
                },
                'RegistrarCotizacion' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/deceso/cotizacion',
                                         cotizacion, undefined, showSpin)
                },
                'ObtenerCotizacion' : function(numeroDocumento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/deceso/cotizacion?numeroDocumento={numeroDocumento}',
                                                    { 'numeroDocumento':numeroDocumento   }),
                                         undefined, undefined, showSpin)
                },
                'DescargarCotizacion' : function(numeroDocumento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/deceso/cotizacion/archivo/{numeroDocumento}',
                                                    { 'numeroDocumento':numeroDocumento   }),
                                         undefined, undefined, showSpin)
                },
                'RegistrarArchivoDecesoAsync' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/deceso/archivos',
                                         undefined, undefined, showSpin)
                },
                'EliminarArchivoDeceso' : function(CodigoArchivoAdjunto, showSpin){
                    return httpData['delete'](oimProxyPoliza.endpoint + helper.formatNamed('api/deceso/emision/archivos/{CodigoArchivoAdjunto}',
                                                    { 'CodigoArchivoAdjunto':CodigoArchivoAdjunto   }),
                                         undefined, undefined, showSpin)
                },
                'DescargarArchivoDeceso' : function(codigoArchivoAdjunto, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/deceso/archivo/descarga/{codigoArchivoAdjunto}',
                                                    { 'codigoArchivoAdjunto':codigoArchivoAdjunto   }),
                                         undefined, undefined, showSpin)
                },
                'ListarArchivoDeceso' : function(codigoCompania, codigoRamo, nroDocumento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/deceso/archivos/{codigoCompania}/{codigoRamo}/{nroDocumento}',
                                                    { 'codigoCompania':codigoCompania  ,'codigoRamo':codigoRamo  ,'nroDocumento':nroDocumento   }),
                                         undefined, undefined, showSpin)
                },
                'ListarRamoTronPag' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/deceso/mantenimiento/ramo',
                                         request, undefined, showSpin)
                },
                'ActualizaRamo' : function(ramos, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/deceso/mantenimiento/ramo/estado',
                                         ramos, undefined, showSpin)
                },
                'ListaPolizaGrupoTron' : function(codigoRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/deceso/mantenimiento/polizaGrupo?codigoRamo={codigoRamo}',
                                                    { 'codigoRamo':codigoRamo   }),
                                         undefined, undefined, showSpin)
                },
                'ListaModalidadTron' : function(codigoRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/deceso/mantenimiento/modalidad?codigoRamo={codigoRamo}',
                                                    { 'codigoRamo':codigoRamo   }),
                                         undefined, undefined, showSpin)
                },
                'ActualizaPolizaGrupoModalidad' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/deceso/mantenimiento/polizaGrupo/modalidad',
                                         request, undefined, showSpin)
                },
                'ObtenerArchivos' : function(model, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/deceso/archivos-interes/obtener',
                                         model, undefined, showSpin)
                },
                'Actualizar' : function( showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + 'api/deceso/archivos-interes/actualizar',
                                         undefined, undefined, showSpin)
                },
                'CargarArchivo' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/deceso/archivos-interes/cargar',
                                         undefined, undefined, showSpin)
                },
                'GetDescargarArchivo' : function(codigo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/deceso/archivos-interes/descargar/{codigo}',
                                                    { 'codigo':codigo   }),
                                         undefined, undefined, showSpin)
                },
                'GetDescargarArchivo64' : function(codigo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/deceso/archivos-interes/descargar/{codigo}/64',
                                                    { 'codigo':codigo   }),
                                         undefined, undefined, showSpin)
                },
                'RegistrarEmision' : function(solicitud, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/deceso/emision',
                                         solicitud, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyRequerimiento", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'GetParametrosMotivos' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/cobranza/deceso/requerimientos/parametros',
                                         undefined, undefined, showSpin)
                },
                'getPolizas' : function(deceso_Id, ejecutivoCobranza_Id, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/cobranza/deceso/{deceso_Id}/ejecutivoCobranza/{ejecutivoCobranza_Id}',
                                                    { 'deceso_Id':deceso_Id  ,'ejecutivoCobranza_Id':ejecutivoCobranza_Id   }),
                                         undefined, undefined, showSpin)
                },
                'GetRequerimientosUsuarios' : function(ejecutivoCobranza_Id, request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/cobranza/decesos/requerimientos/ejecutivoCobranza/{ejecutivoCobranza_Id}',
                                                    { 'ejecutivoCobranza_Id':ejecutivoCobranza_Id   }),
                                         request, undefined, showSpin)
                },
                'RegistrarRequerimiento' : function(request, deceso_id, ejecutivoCobranza_Id, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/cobranza/deceso/{deceso_id}/ejecutivoCobranza/{ejecutivoCobranza_Id}/requerimiento',
                                                    { 'deceso_id':deceso_id  ,'ejecutivoCobranza_Id':ejecutivoCobranza_Id   }),
                                         request, undefined, showSpin)
                },
                'RegistrarRequerimientoEvento' : function(request, requerimiento_Id, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/cobranza/requerimiento/{requerimiento_Id}/evento',
                                                    { 'requerimiento_Id':requerimiento_Id   }),
                                         request, undefined, showSpin)
                },
                'RecuperarDocumento' : function(requerimiento_Id, documento_Id, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/cobranza/requerimiento/{requerimiento_Id}/documento/{documento_Id}',
                                                    { 'requerimiento_Id':requerimiento_Id  ,'documento_Id':documento_Id   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyMailTemplate", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'SendMailTemplate' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/mail/poliza/template',
                                         request, undefined, showSpin)
                },
                'InsertTemplateMail' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/mail/template/insert',
                                         request, undefined, showSpin)
                },
                'UpdateTemplateMail' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/mail/template/update',
                                         request, undefined, showSpin)
                },
                'DeleteTemplateMail' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/mail/template/delete',
                                         request, undefined, showSpin)
                },
                'GetTemplateMail' : function(codigoCompania, codigoRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/mail/template/detail?codigoCompania={codigoCompania}&codigoRamo={codigoRamo}',
                                                    { 'codigoCompania':codigoCompania  ,'codigoRamo':codigoRamo   }),
                                         undefined, undefined, showSpin)
                },
                'GetListTemplateMail' : function(nombreTexto, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/mail/template/list?nombreTexto={nombreTexto}',
                                                    { 'nombreTexto':nombreTexto   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyMail", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'SendMailCotizacion' : function(email, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/mail/cotizacion/sendMail',
                                         email, undefined, showSpin)
                },
                'SendMailEmisionAutoNuevo' : function(email, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/mail/emision/autos',
                                         email, undefined, showSpin)
                },
                'SendMailEmisionSoat' : function(email, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/mail/emisionSoat/sendMail',
                                         email, undefined, showSpin)
                },
                'SendMailEmisionBancarioSoat' : function(email, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/mail/emisionSoat/sendeMailEmisionBancario',
                                         email, undefined, showSpin)
                },
                'SendMailCotizacionHogar' : function(email, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/mail/cotizacionHogar/sendMail',
                                         email, undefined, showSpin)
                },
                'SendMailCotizacionAccidente' : function(email, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/mail/cotizacionAccidente/sendMail',
                                         email, undefined, showSpin)
                },
                'SendMailCotizacionTransporte' : function(email, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/mail/cotizacionTransporte/sendMail',
                                         email, undefined, showSpin)
                },
                'SendMailEmisionUsadoNotificar' : function(tipo, email, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/mail/emision/usado/notificar/inspeccion/{tipo}',
                                                    { 'tipo':tipo   }),
                                         email, undefined, showSpin)
                },
                'SendMailActualizarModelo' : function(email, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/mail/actualizarmodelo/sendMail',
                                         email, undefined, showSpin)
                },
                'SendMailCotizacion1' : function(email, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/mail/mail/eciok',
                                         email, undefined, showSpin)
                },
                'SendMailDocumento' : function(email, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/mail/documento/sendMail',
                                         email, undefined, showSpin)
                },
                'SendMailCotizacionVida' : function(email, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/mail/cotizacionVida/sendMail',
                                         email, undefined, showSpin)
                },
                'SendMailCotizacionDeceso' : function(email, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/mail/cotizacion/deceso',
                                         email, undefined, showSpin)
                },
                'SendMailCotizacionSalud' : function(email, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/mail/cotizacion/salud',
                                         email, undefined, showSpin)
                },
                'SendMailSolicitudSalud' : function(email, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/mail/solicitud/salud',
                                         email, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyMydream", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'ReporteCotizacionAutos' : function(numeroCompania, numeroDocumento, numeroRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/mydream/autos/cotizacion/file/{numeroCompania}/{numeroDocumento}/{numeroRamo}',
                                                    { 'numeroCompania':numeroCompania  ,'numeroDocumento':numeroDocumento  ,'numeroRamo':numeroRamo   }),
                                         undefined, undefined, showSpin)
                },
                'ReporteCotizacionHogar' : function(numeroCompania, numeroDocumento, numeroRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/mydream/hogar/cotizacion/file/{numeroCompania}/{numeroDocumento}/{numeroRamo}',
                                                    { 'numeroCompania':numeroCompania  ,'numeroDocumento':numeroDocumento  ,'numeroRamo':numeroRamo   }),
                                         undefined, undefined, showSpin)
                },
                'ReporteCotizacionSalud' : function(numeroDocumento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/mydream/salud/cotizacion/file/{numeroDocumento}',
                                                    { 'numeroDocumento':numeroDocumento   }),
                                         undefined, undefined, showSpin)
                },
                'ReporteCotizacionEmpresa' : function(numeroDocumento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/mydream/empresa/cotizacion/file/{numeroDocumento}',
                                                    { 'numeroDocumento':numeroDocumento   }),
                                         undefined, undefined, showSpin)
                },
                'ReporteCotizacion' : function(numeroCotizacion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/mydream/vida/cotizacion/file/{numeroCotizacion}',
                                                    { 'numeroCotizacion':numeroCotizacion   }),
                                         undefined, undefined, showSpin)
                },
                'ReporteEmisionSCTR' : function(numeroCompania, numeroPoliza, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/mydream/sctr/emision/file/{numeroCompania}/{numeroPoliza}',
                                                    { 'numeroCompania':numeroCompania  ,'numeroPoliza':numeroPoliza   }),
                                         undefined, undefined, showSpin)
                },
                'ReporteEmisionAutos' : function(numeroPoliza, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/mydream/autos/emision/file/{numeroPoliza}',
                                                    { 'numeroPoliza':numeroPoliza   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyFinanciamiento", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'GetListFinanciamiento' : function(tip, codPro, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/financiamiento/tipo/{tip}/{codPro}',
                                                    { 'tip':tip  ,'codPro':codPro   }),
                                         undefined, undefined, showSpin)
                },
                'GetListFinanciamiento' : function(tip, codPro, codigoRol, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/financiamiento/tipoPorRol/{tip}/{codPro}/{codigoRol}',
                                                    { 'tip':tip  ,'codPro':codPro  ,'codigoRol':codigoRol   }),
                                         undefined, undefined, showSpin)
                },
                'GetListDiaGracia' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/financiamiento/diagracia',
                                         undefined, undefined, showSpin)
                },
                'GetListNumeroCuota' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/financiamiento/numerocuota',
                                         undefined, undefined, showSpin)
                },
                'GetListaFinanciamiento' : function(mcaAnual, codigoRamo, codigoProducto, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/financiamiento/tipo/{mcaAnual}/{codigoRamo}/{codigoProducto}',
                                                    { 'mcaAnual':mcaAnual  ,'codigoRamo':  { value: codigoRamo, defaultValue:'0' } ,'codigoProducto':  { value: codigoProducto, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetInfoUser' : function(param, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/financiamiento/info',
                                         param, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyTransporte", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'GetListByCodRamo' : function(CodigoRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/transporte/listaValuacionMercaderia/{CodigoRamo}',
                                                    { 'CodigoRamo':CodigoRamo   }),
                                         undefined, undefined, showSpin)
                },
                'GetCalculoPrima' : function(appTransporte, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/transporte/CalcularPrimaAplicacion',
                                         appTransporte, undefined, showSpin)
                },
                'GetRiesgoAduana' : function(transporte, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/transporte/ObtenerRiesgoAduana',
                                         transporte, undefined, showSpin)
                },
                'GetCalcularPrima' : function(transporte, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/transporte/calcularprima',
                                         transporte, undefined, showSpin)
                },
                'GetListAlmacen' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/transporte/listarAlmacen',
                                         undefined, undefined, showSpin)
                },
                'GetPolizaBuscarAplicTrans' : function(solicitud, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/transporte/aplicacion/buscaremisiones',
                                         solicitud, undefined, showSpin)
                },
                'GetPolizaBuscarAplicTransPaginado' : function(solicitud, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/transporte/aplicacion/buscaremisionespag',
                                         solicitud, undefined, showSpin)
                },
                'ListarRiesgosAplicacion' : function(CodCia, numPoliza, numShipTo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/transporte/aplicacion/listarriesgos/{CodCia}/{numPoliza}/{numShipTo}',
                                                    { 'CodCia':CodCia  ,'numPoliza':numPoliza  ,'numShipTo':numShipTo   }),
                                         undefined, undefined, showSpin)
                },
                'ListarMateriaAseguradaPorCodigo' : function(codigoMateriaAsegurada, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/transporte/aplicacion/listarMateriaAseg/{codigoMateriaAsegurada}',
                                                    { 'codigoMateriaAsegurada':codigoMateriaAsegurada   }),
                                         undefined, undefined, showSpin)
                },
                'CalcularPrimaApl' : function(transporte, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/transporte/aplicacion/calcularprima',
                                         transporte, undefined, showSpin)
                },
                'InsertAplicacionTransporte' : function(appTransporte, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/transporte/aplicacion/grabar',
                                         appTransporte, undefined, showSpin)
                },
                'obtenerLongitudGuiaFactProforma' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/transporte/aplicacion/obtenerLongitudGuia',
                                         undefined, undefined, showSpin)
                },
                'GetMarcoRiesgo' : function(riesgoMarco, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/transporte/aplicacion/marcoriesgo',
                                         riesgoMarco, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyAccidente", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'DeleteRiesgoCotizacion' : function(elimina, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/accidente/riesgo/eliminar',
                                         elimina, undefined, showSpin)
                },
                'GetListAutoOcupacion' : function(ocupacion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/accidente/ocupacion/autocomplete/{ocupacion}',
                                                    { 'ocupacion':ocupacion   }),
                                         undefined, undefined, showSpin)
                },
                'GetListFranquicia' : function(cobertura, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/accidente/franquicia/listar/{cobertura}',
                                                    { 'cobertura':cobertura   }),
                                         undefined, undefined, showSpin)
                },
                'GetCoberturaListarByCodigoNombreCobertura' : function(CodigoCobertura, NombreCobertura, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/accidente/Cobertura/Listar/{CodigoCobertura}/{NombreCobertura}',
                                                    { 'CodigoCobertura':CodigoCobertura  ,'NombreCobertura':  { value: NombreCobertura, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetCoberturaListarByCodigoCobertura' : function(CodigoCobertura, NombreCobertura, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/accidente/Cobertura/Listar/{CodigoCobertura}?NombreCobertura={NombreCobertura}',
                                                    { 'CodigoCobertura':CodigoCobertura  ,'NombreCobertura':  { value: NombreCobertura, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetClausulaListarByCodigoNombreClausula' : function(CodigoClausula, NombreClausula, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/accidente/Clausula/Listar/{CodigoClausula}/{NombreClausula}',
                                                    { 'CodigoClausula':CodigoClausula  ,'NombreClausula':  { value: NombreClausula, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetClausulaListarByCodigoClausula' : function(CodigoClausula, NombreClausula, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/accidente/Clausula/Listar/{CodigoClausula}?NombreClausula={NombreClausula}',
                                                    { 'CodigoClausula':CodigoClausula  ,'NombreClausula':  { value: NombreClausula, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetExposicionListarByCodigoYNombreExposicion' : function(CodigoExposicion, NombreExposicion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/accidente/Exposicion/Listar/{CodigoExposicion}/{NombreExposicion}',
                                                    { 'CodigoExposicion':CodigoExposicion  ,'NombreExposicion':  { value: NombreExposicion, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetExposicionListarByCodigo' : function(CodigoExposicion, NombreExposicion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/accidente/Exposicion/Listar/{CodigoExposicion}?NombreExposicion={NombreExposicion}',
                                                    { 'CodigoExposicion':CodigoExposicion  ,'NombreExposicion':  { value: NombreExposicion, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetBandejaAccidente' : function(filter, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/accidente/bandeja/listar',
                                         filter, undefined, showSpin)
                },
                'LoadAsegurado' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/accidente/asegurado/cargar',
                                         undefined, undefined, showSpin)
                },
                'GetListAsegurado' : function(numeroEmision, numeroRiesgo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/accidente/asegurado/listar/{numeroEmision}/{numeroRiesgo}',
                                                    { 'numeroEmision':numeroEmision  ,'numeroRiesgo':numeroRiesgo   }),
                                         undefined, undefined, showSpin)
                },
                'GetListCotizacionVigente' : function(model, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/accidente/bandejapaginado',
                                         model, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyGeneral", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'GetOcupacion' : function(codPrf, desPrf, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/ocupacion?codPrf={codPrf}&desPrf={desPrf}',
                                                    { 'codPrf':  { value: codPrf, defaultValue:'0' } ,'desPrf':  { value: desPrf, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetActividadEconomica' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/actividadeconomica',
                                         undefined, undefined, showSpin)
                },
                'GetActividadEconomicaSunat' : function(actEco, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/actividadeconomica/sunat',
                                         actEco, undefined, showSpin)
                },
                'GetActividadEconomicaPoliza' : function(sctrEmp, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/actividadeconomica/poliza',
                                         sctrEmp, undefined, showSpin)
                },
                'GetTipoCambio' : function(tipoCambio, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/tipocambio',
                                         tipoCambio, undefined, showSpin)
                },
                'GetListPlan' : function(codCom, codRam, codMod, codCam, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/plan/{codCom}/{codRam}/{codMod}/{codCam}',
                                                    { 'codCom':codCom  ,'codRam':codRam  ,'codMod':codMod  ,'codCam':codCam   }),
                                         undefined, undefined, showSpin)
                },
                'GetGestorOficina' : function(codCia, codAgente, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/gestoroficina/{codCia}/{codAgente}',
                                                    { 'codCia':codCia  ,'codAgente':codAgente   }),
                                         undefined, undefined, showSpin)
                },
                'GetListCargo' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/cargo',
                                         undefined, undefined, showSpin)
                },
                'GetListTipoMoneda' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/tipomoneda',
                                         undefined, undefined, showSpin)
                },
                'GetListMateriaAsegurada' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/materiaAsegurada',
                                         undefined, undefined, showSpin)
                },
                'GetTable' : function(code, field, description, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/table?code={code}&field={field}&description={description}',
                                                    { 'code':  { value: code, defaultValue:'' } ,'field':  { value: field, defaultValue:'' } ,'description':  { value: description, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetListVariableOIMPag' : function(model, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/variablesoimpaginado',
                                         model, undefined, showSpin)
                },
                'GeConsultarVariableOIM' : function(campo, codigo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/variablesoim/{campo}/{codigo}',
                                                    { 'campo':campo  ,'codigo':codigo   }),
                                         undefined, undefined, showSpin)
                },
                'DelVariableOIM' : function(campo, codigo, showSpin){
                    return httpData['delete'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/variablesoim/{campo}/{codigo}',
                                                    { 'campo':campo  ,'codigo':codigo   }),
                                         undefined, undefined, showSpin)
                },
                'InsVariableOIM' : function(model, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/variablesoim',
                                         model, undefined, showSpin)
                },
                'UpdVariableOIM' : function(model, showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + 'api/general/variablesoim',
                                         model, undefined, showSpin)
                },
                'GetListEstadoCivil' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/estadocivil',
                                         undefined, undefined, showSpin)
                },
                'GetListFrecuenciaPago' : function(codigo, descripcion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/frecuenciapago?codigo={codigo}&descripcion={descripcion}',
                                                    { 'codigo':  { value: codigo, defaultValue:'0' } ,'descripcion':  { value: descripcion, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetListFrecuenciaPagoByCodigo' : function(codigo, descripcion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/frecuenciapago/{codigo}?descripcion={descripcion}',
                                                    { 'codigo':  { value: codigo, defaultValue:'0' } ,'descripcion':  { value: descripcion, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetListFrecuenciaPagoByCodigoDesc' : function(codigo, descripcion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/frecuenciapago/{codigo}/{descripcion}',
                                                    { 'codigo':  { value: codigo, defaultValue:'0' } ,'descripcion':  { value: descripcion, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetCalcularEdad' : function(fechaNacimiento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/edad/{fechaNacimiento}',
                                                    { 'fechaNacimiento':fechaNacimiento   }),
                                         undefined, undefined, showSpin)
                },
                'GetValidaLugarAltoRiesgo' : function(entidad, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/validaAltoRiesgo',
                                         entidad, undefined, showSpin)
                },
                'GetListEntidadFinanciera' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/entidadfinanciera',
                                         undefined, undefined, showSpin)
                },
                'GetListTipoCuenta' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/tipocuenta',
                                         undefined, undefined, showSpin)
                },
                'GetListMoneda' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/moneda',
                                         undefined, undefined, showSpin)
                },
                'GetListMonedaVida' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/moneda/vida',
                                         undefined, undefined, showSpin)
                },
                'GetListMonedaDeceso' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/moneda/deceso',
                                         undefined, undefined, showSpin)
                },
                'GetListTipoTarjeta' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/tipotarjeta',
                                         undefined, undefined, showSpin)
                },
                'GetListParentesco' : function(codCia, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/parentesco/{codCia}',
                                                    { 'codCia':codCia   }),
                                         undefined, undefined, showSpin)
                },
                'GetListCodigoTarjeta' : function(codCia, CodigoTipoTarjeta, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/codigotarjeta/{codCia}/{CodigoTipoTarjeta}',
                                                    { 'codCia':codCia  ,'CodigoTipoTarjeta':CodigoTipoTarjeta   }),
                                         undefined, undefined, showSpin)
                },
                'GetListGestor' : function(TipoGestor, CodigoEntidad, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/gestorentidad/{TipoGestor}/{CodigoEntidad}',
                                                    { 'TipoGestor':TipoGestor  ,'CodigoEntidad':CodigoEntidad   }),
                                         undefined, undefined, showSpin)
                },
                'GetSueldoMinimo' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/sueldominimo',
                                         undefined, undefined, showSpin)
                },
                'GetEnmascarCuenta' : function(codigoEntidad, tipoCuenta, codigoMoneda, cuentaCalcular, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/enmascarCuenta/{codigoEntidad}/{tipoCuenta}/{codigoMoneda}/{cuentaCalcular}',
                                                    { 'codigoEntidad':codigoEntidad  ,'tipoCuenta':tipoCuenta  ,'codigoMoneda':codigoMoneda  ,'cuentaCalcular':cuentaCalcular   }),
                                         undefined, undefined, showSpin)
                },
                'GetEnmascarTarjeta' : function(tipoTarjeta, numeroTarjeta, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/enmascarTarjeta/{tipoTarjeta}/{numeroTarjeta}',
                                                    { 'tipoTarjeta':tipoTarjeta  ,'numeroTarjeta':numeroTarjeta   }),
                                         undefined, undefined, showSpin)
                },
                'GetListSystemParameter' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/sp',
                                         undefined, undefined, showSpin)
                },
                'GetTemplateFile' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/templatefile',
                                         request, undefined, showSpin)
                },
                'InsTemplateFile' : function(grupo, valor, desc, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/instemplatefile/{grupo}/{valor}/{desc}',
                                                    { 'grupo':grupo  ,'valor':valor  ,'desc':desc   }),
                                         undefined, undefined, showSpin)
                },
                'GetListCompaniaOim' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/Compania/oim',
                                         undefined, undefined, showSpin)
                },
                'GetListCompania' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/Compania',
                                         undefined, undefined, showSpin)
                },
                'GetSexo' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/sexo',
                                         undefined, undefined, showSpin)
                },
                'RegistrarAuditoria' : function(auditoria, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/auditoria',
                                         auditoria, undefined, showSpin)
                },
                'GetClausula' : function(idClausula, codRamo, ciiu, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/clausula/{idClausula}?codRamo={codRamo}&ciiu={ciiu}',
                                                    { 'idClausula':idClausula  ,'codRamo':codRamo  ,'ciiu':  { value: ciiu, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'SaveClausula' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/clausula',
                                         request, undefined, showSpin)
                },
                'DeleteClausula' : function(idClausula, showSpin){
                    return httpData['delete'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/clausula/{idClausula}',
                                                    { 'idClausula':idClausula   }),
                                         undefined, undefined, showSpin)
                },
                'GetListClausula' : function(filtro, codRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/clausulas?filtro={filtro}&codRamo={codRamo}',
                                                    { 'filtro':filtro  ,'codRamo':codRamo   }),
                                         undefined, undefined, showSpin)
                },
                'SaveSuscriptor' : function(genericSuscriptorDTO, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/suscriptor',
                                         genericSuscriptorDTO, undefined, showSpin)
                },
                'UpdateSuscriptor' : function(codigoSuscriptor, genericSuscriptorDTO, showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/suscriptor/{codigoSuscriptor}',
                                                    { 'codigoSuscriptor':codigoSuscriptor   }),
                                         genericSuscriptorDTO, undefined, showSpin)
                },
                'GetSuscriptor' : function(codigoSuscriptor, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/suscriptor/{codigoSuscriptor}',
                                                    { 'codigoSuscriptor':codigoSuscriptor   }),
                                         undefined, undefined, showSpin)
                },
                'GetListSuscriptor' : function(nombreCompleto, codigoUsuario, estado, cantidadFilasPorPagina, paginaActual, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/suscriptores?nombreCompleto={nombreCompleto}&codigoUsuario={codigoUsuario}&estado={estado}&cantidadFilasPorPagina={cantidadFilasPorPagina}&paginaActual={paginaActual}',
                                                    { 'nombreCompleto':nombreCompleto  ,'codigoUsuario':codigoUsuario  ,'estado':  { value: estado, defaultValue:'0' } ,'cantidadFilasPorPagina':  { value: cantidadFilasPorPagina, defaultValue:'10' } ,'paginaActual':  { value: paginaActual, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetListSuscriptorOficina' : function(codigoOficina, nombreOficina, cantidadFilasPorPagina, paginaActual, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/oficinas/suscriptores?codigoOficina={codigoOficina}&nombreOficina={nombreOficina}&cantidadFilasPorPagina={cantidadFilasPorPagina}&paginaActual={paginaActual}',
                                                    { 'codigoOficina':codigoOficina  ,'nombreOficina':nombreOficina  ,'cantidadFilasPorPagina':  { value: cantidadFilasPorPagina, defaultValue:'10' } ,'paginaActual':  { value: paginaActual, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'SaveSuscriptorOficina' : function(codigoSuscriptor, genericSuscriptorOficinaBE, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/suscriptor/{codigoSuscriptor}/oficinas',
                                                    { 'codigoSuscriptor':codigoSuscriptor   }),
                                         genericSuscriptorOficinaBE, undefined, showSpin)
                },
                'GetListTipoComunicacion' : function(codigoCompania, codigoRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/parametro/tipocomunicacion/{codigoCompania}/{codigoRamo}',
                                                    { 'codigoCompania':codigoCompania  ,'codigoRamo':codigoRamo   }),
                                         undefined, undefined, showSpin)
                },
                'GetListTipoConstruccion' : function(codigoCompania, codigoRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/parametro/tipoConstruccion/{codigoCompania}/{codigoRamo}',
                                                    { 'codigoCompania':codigoCompania  ,'codigoRamo':  { value: codigoRamo, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetList' : function(fechaNacimiento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/edadActuarial/{fechaNacimiento}',
                                                    { 'fechaNacimiento':fechaNacimiento   }),
                                         undefined, undefined, showSpin)
                },
                'GetListMotivoSolicitud' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/motivosolicitud',
                                         undefined, undefined, showSpin)
                },
                'GetListSeguroSalud' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/seguroSalud',
                                         undefined, undefined, showSpin)
                },
                'ValidarAccesoUsuario' : function(codigoAplicacion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/accesoUsuario/{codigoAplicacion}',
                                                    { 'codigoAplicacion':codigoAplicacion   }),
                                         undefined, undefined, showSpin)
                },
                'ObtenerDescuentoIntegralidad' : function(codigoCompania, codigoAgente, codigoRamo, tipoDocumento, numeroDocumento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/descuentoIntegralidad/{codigoCompania}/{codigoAgente}/{codigoRamo}/{tipoDocumento}/{numeroDocumento}',
                                                    { 'codigoCompania':codigoCompania  ,'codigoAgente':codigoAgente  ,'codigoRamo':codigoRamo  ,'tipoDocumento':  { value: tipoDocumento, defaultValue:'' } ,'numeroDocumento':  { value: numeroDocumento, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetListTipoTransmision' : function(codigoCompania, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/tipoTransmision?codigoCompania={codigoCompania}',
                                                    { 'codigoCompania':  { value: codigoCompania, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'EsDescuentoIntegralidadParaAgentes' : function(agenteCriteria, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/EsDescuentoIntegralidadParaAgentes',
                                         agenteCriteria, undefined, showSpin)
                },
                'ObtenerAccionistas' : function(typeDoc, NumDoc, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/accionista/{typeDoc}/{NumDoc}',
                                                    { 'typeDoc':typeDoc  ,'NumDoc':NumDoc   }),
                                         undefined, undefined, showSpin)
                },
                'GetListTipoRelacion' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/tipoRelacion',
                                         undefined, undefined, showSpin)
                },
                'GetEncuesta' : function(codigoCia, codigoRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/encuesta/{codigoCia}/{codigoRamo}',
                                                    { 'codigoCia':codigoCia  ,'codigoRamo':codigoRamo   }),
                                         undefined, undefined, showSpin)
                },
                'GuardarEncuesta' : function(encuesta, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/encuesta',
                                         encuesta, undefined, showSpin)
                },
                'GetCurrentServicesVersion' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/services/version',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyTipoDocumento", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'getTipoDocumento' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/tipodoc/nacional',
                                         undefined, undefined, showSpin)
                },
                'getSctrListTipoDocumento' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/tipodoc/sctr',
                                         undefined, undefined, showSpin)
                },
                'getTipoDocumentoVida' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/tipodoc/vida',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCampoSanto", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'GetListProductos' : function(codRamo, nombreCampoSanto, codProducto, nombreProducto, codCategoria, cantidadFilasPorPagina, paginaActual, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/productos?codRamo={codRamo}&nombreCampoSanto={nombreCampoSanto}&codProducto={codProducto}&nombreProducto={nombreProducto}&codCategoria={codCategoria}&cantidadFilasPorPagina={cantidadFilasPorPagina}&paginaActual={paginaActual}',
                                                    { 'codRamo':  { value: codRamo, defaultValue:'' } ,'nombreCampoSanto':  { value: nombreCampoSanto, defaultValue:'' } ,'codProducto':  { value: codProducto, defaultValue:'' } ,'nombreProducto':  { value: nombreProducto, defaultValue:'' } ,'codCategoria':  { value: codCategoria, defaultValue:'' } ,'cantidadFilasPorPagina':  { value: cantidadFilasPorPagina, defaultValue:'10' } ,'paginaActual':  { value: paginaActual, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'UpdateProducto' : function(cSTipoProductoPutDTO, showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + 'api/camposanto/producto',
                                         cSTipoProductoPutDTO, undefined, showSpin)
                },
                'GetListTipologiasFinancimientos' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/camposanto/financiamientos',
                                         undefined, undefined, showSpin)
                },
                'UpdateTipologiaFinancimiento' : function(cSTipologiaFinanciamientoPutDTO, showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + 'api/camposanto/financiamiento',
                                         cSTipologiaFinanciamientoPutDTO, undefined, showSpin)
                },
                'GetListPerfilEmisor' : function(codigoNombre, cantidadFilasPorPagina, paginaActual, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/perfil/emisores?codigoNombre={codigoNombre}&cantidadFilasPorPagina={cantidadFilasPorPagina}&paginaActual={paginaActual}',
                                                    { 'codigoNombre':  { value: codigoNombre, defaultValue:'' } ,'cantidadFilasPorPagina':  { value: cantidadFilasPorPagina, defaultValue:'20' } ,'paginaActual':  { value: paginaActual, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetListEmisorAgenteSede' : function(idEmisor, idAgente, idCampoSanto, codRamo, cantidadFilasPorPagina, paginaActual, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/emisores?idEmisor={idEmisor}&idAgente={idAgente}&idCampoSanto={idCampoSanto}&codRamo={codRamo}&cantidadFilasPorPagina={cantidadFilasPorPagina}&paginaActual={paginaActual}',
                                                    { 'idEmisor':  { value: idEmisor, defaultValue:'' } ,'idAgente':  { value: idAgente, defaultValue:'' } ,'idCampoSanto':  { value: idCampoSanto, defaultValue:'' } ,'codRamo':  { value: codRamo, defaultValue:'' } ,'cantidadFilasPorPagina':  { value: cantidadFilasPorPagina, defaultValue:'10' } ,'paginaActual':  { value: paginaActual, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'InsertEmisorAgenteSede' : function(cSBandejaDocumentoPostDTO, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/camposanto/emisor',
                                         cSBandejaDocumentoPostDTO, undefined, showSpin)
                },
                'UpdateEmisorAgenteSede' : function(cSBandejaDocumentoPutDTO, showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + 'api/camposanto/emisor',
                                         cSBandejaDocumentoPutDTO, undefined, showSpin)
                },
                'GetListGestionDocumentos' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/camposanto/documentos',
                                         undefined, undefined, showSpin)
                },
                'InsertGestionDocumento' : function(cSGestionDocumentoPostDTO, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/camposanto/documento',
                                         cSGestionDocumentoPostDTO, undefined, showSpin)
                },
                'UpdateGestionDocumento' : function(cSGestionDocumentoPutDTO, showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + 'api/camposanto/documento',
                                         cSGestionDocumentoPutDTO, undefined, showSpin)
                },
                'GetListTiposDocumentos' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/camposanto/tiposDocumentos',
                                         undefined, undefined, showSpin)
                },
                'GetListCorreosExcepcional' : function(fechaCreacion, codRamo, correo, nombreCampoSanto, cantidadFilasPorPagina, paginaActual, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/correos?fechaCreacion={fechaCreacion}&codRamo={codRamo}&correo={correo}&nombreCampoSanto={nombreCampoSanto}&cantidadFilasPorPagina={cantidadFilasPorPagina}&paginaActual={paginaActual}',
                                                    { 'fechaCreacion':  { value: fechaCreacion, defaultValue:'' } ,'codRamo':  { value: codRamo, defaultValue:'0' } ,'correo':  { value: correo, defaultValue:'' } ,'nombreCampoSanto':  { value: nombreCampoSanto, defaultValue:'' } ,'cantidadFilasPorPagina':  { value: cantidadFilasPorPagina, defaultValue:'10' } ,'paginaActual':  { value: paginaActual, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'InsertCorreoExcepcional' : function(cSGrupoExcepcionalPostDTO, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/camposanto/correo',
                                         cSGrupoExcepcionalPostDTO, undefined, showSpin)
                },
                'UpdateCorreoExcepcional' : function(cSGrupoExcepcionalPutDTO, showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + 'api/camposanto/correo',
                                         cSGrupoExcepcionalPutDTO, undefined, showSpin)
                },
                'GetCotizacion' : function(idCotizacion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/cotizacion/{idCotizacion}',
                                                    { 'idCotizacion':idCotizacion   }),
                                         undefined, undefined, showSpin)
                },
                'DescargarArchivo' : function(idCotizacion, tipoOperacion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/cotizacion/{idCotizacion}/archivo?tipoOperacion={tipoOperacion}',
                                                    { 'idCotizacion':idCotizacion  ,'tipoOperacion':tipoOperacion   }),
                                         undefined, undefined, showSpin)
                },
                'GetListVendedores' : function(filtro, codCia, cantidadFilasPorPagina, paginaActual, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/vendedores?filtro={filtro}&codCia={codCia}&cantidadFilasPorPagina={cantidadFilasPorPagina}&paginaActual={paginaActual}',
                                                    { 'filtro':  { value: filtro, defaultValue:'' } ,'codCia':  { value: codCia, defaultValue:'2' } ,'cantidadFilasPorPagina':  { value: cantidadFilasPorPagina, defaultValue:'10' } ,'paginaActual':  { value: paginaActual, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetListAgencias' : function(filtro, codCia, cantidadFilasPorPagina, paginaActual, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/agencias?filtro={filtro}&codCia={codCia}&cantidadFilasPorPagina={cantidadFilasPorPagina}&paginaActual={paginaActual}',
                                                    { 'filtro':  { value: filtro, defaultValue:'' } ,'codCia':  { value: codCia, defaultValue:'2' } ,'cantidadFilasPorPagina':  { value: cantidadFilasPorPagina, defaultValue:'10' } ,'paginaActual':  { value: paginaActual, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetListTipoEmision' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/camposanto/tipoEmision',
                                         undefined, undefined, showSpin)
                },
                'getRamo' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/camposanto/Ramo',
                                         undefined, undefined, showSpin)
                },
                'getEdad' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/camposanto/Edad',
                                         undefined, undefined, showSpin)
                },
                'getGrado' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/camposanto/Grado',
                                         undefined, undefined, showSpin)
                },
                'getCampoSanto' : function(idRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/CampoSanto/{idRamo}',
                                                    { 'idRamo':idRamo   }),
                                         undefined, undefined, showSpin)
                },
                'getTipoContrato' : function(idRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/TipoContrato/{idRamo}',
                                                    { 'idRamo':idRamo   }),
                                         undefined, undefined, showSpin)
                },
                'GetModalidad' : function(idRamo, idTipoContrato, idCampoSanto, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/Modalidad?idRamo={idRamo}&idTipoContrato={idTipoContrato}&idCampoSanto={idCampoSanto}',
                                                    { 'idRamo':  { value: idRamo, defaultValue:'0' } ,'idTipoContrato':  { value: idTipoContrato, defaultValue:'0' } ,'idCampoSanto':  { value: idCampoSanto, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetProductos' : function(idRamo, idModalidad, idCampoSanto, idPrima, idTipoContrato, numContratoRelacionado, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/Producto/Ramo/{idRamo}/Modalidad/{idModalidad}/CampoSanto/{idCampoSanto}/Prima/{idPrima}/TipoContrato/{idTipoContrato}?numContratoRelacionado={numContratoRelacionado}',
                                                    { 'idRamo':  { value: idRamo, defaultValue:'0' } ,'idModalidad':  { value: idModalidad, defaultValue:'0' } ,'idCampoSanto':  { value: idCampoSanto, defaultValue:'0' } ,'idPrima':  { value: idPrima, defaultValue:'0' } ,'idTipoContrato':  { value: idTipoContrato, defaultValue:'0' } ,'numContratoRelacionado':  { value: numContratoRelacionado, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetPrecioProductos' : function(idRamo, idModalidad, idCampoSanto, idPrima, idTipoContrato, idProducto, numContratoRelacionado, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/Producto/Ramo/{idRamo}/Modalidad/{idModalidad}/CampoSanto/{idCampoSanto}/Prima/{idPrima}/TipoContrato/{idTipoContrato}/Producto/{idProducto}?numContratoRelacionado={numContratoRelacionado}',
                                                    { 'idRamo':  { value: idRamo, defaultValue:'0' } ,'idModalidad':  { value: idModalidad, defaultValue:'0' } ,'idCampoSanto':  { value: idCampoSanto, defaultValue:'0' } ,'idPrima':  { value: idPrima, defaultValue:'0' } ,'idTipoContrato':  { value: idTipoContrato, defaultValue:'0' } ,'idProducto':  { value: idProducto, defaultValue:'' } ,'numContratoRelacionado':  { value: numContratoRelacionado, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetFraccionamientoProducto' : function(idModalidad, idCampoSanto, idProducto, idTipoContrato, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/Fraccionamiento/Modalidad/{idModalidad}/CampoSanto/{idCampoSanto}/TipoContrato/{idTipoContrato}/Producto/{idProducto}',
                                                    { 'idModalidad':  { value: idModalidad, defaultValue:'0' } ,'idCampoSanto':  { value: idCampoSanto, defaultValue:'0' } ,'idProducto':  { value: idProducto, defaultValue:'' } ,'idTipoContrato':  { value: idTipoContrato, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetCuotas' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/camposanto/Cuota',
                                         undefined, undefined, showSpin)
                },
                'GetPersonEquifax' : function(dni, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/InformacionEquifax/{dni}',
                                                    { 'dni':dni   }),
                                         undefined, undefined, showSpin)
                },
                'Evaluacion' : function(evaluacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/camposanto/Evaluacion',
                                         evaluacion, undefined, showSpin)
                },
                'getTipologiaProductos' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/camposanto/TipologiaProductos',
                                         undefined, undefined, showSpin)
                },
                'getTipologiaFinanciamientos' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/camposanto/TipologiaFinanciamientos',
                                         undefined, undefined, showSpin)
                },
                'getCategoriasProducto' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/camposanto/Categorias',
                                         undefined, undefined, showSpin)
                },
                'BuscarSedes' : function(texto, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/Sedes/coincidencia/{texto}',
                                                    { 'texto':texto   }),
                                         undefined, undefined, showSpin)
                },
                'getSedes' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/camposanto/Sedes',
                                         undefined, undefined, showSpin)
                },
                'buscarcorreoExcepcional' : function(parametros, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/camposanto/BuscarCorreoExcepcional',
                                         parametros, undefined, showSpin)
                },
                'GuardarCotizacion' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/camposanto/Guardar/Cotizacion',
                                         cotizacion, undefined, showSpin)
                },
                'modificarCotizacion' : function(cotizacion, showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + 'api/camposanto/modificar/cotizacion',
                                         cotizacion, undefined, showSpin)
                },
                'enviarCorreoExcepcional' : function(cuerpo, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/camposanto/EnviarCorreoExcepcional',
                                         cuerpo, undefined, showSpin)
                },
                'descargarCotizacionPDF' : function(idCotizacion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/DescargarCotizacionPDF/{idCotizacion}',
                                                    { 'idCotizacion':idCotizacion   }),
                                         undefined, undefined, showSpin)
                },
                'getMotivo' : function(idTipo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/Motivos/{idTipo}',
                                                    { 'idTipo':idTipo   }),
                                         undefined, undefined, showSpin)
                },
                'CerrarCotizacion' : function(cierre, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/camposanto/CerrarCotizacion',
                                         cierre, undefined, showSpin)
                },
                'GuardarBeneficiario' : function(Asociados, idCotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/cotizacion/{idCotizacion}/beneficiario',
                                                    { 'idCotizacion':idCotizacion   }),
                                         Asociados, undefined, showSpin)
                },
                'GuardarTomador' : function(asociado, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/camposanto/GuardarTomador',
                                         asociado, undefined, showSpin)
                },
                'GuardarAval' : function(asociado, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/camposanto/GuardarAval',
                                         asociado, undefined, showSpin)
                },
                'GuardarAdicional' : function(asociado, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/camposanto/GuardarAdicional',
                                         asociado, undefined, showSpin)
                },
                'UptBeneficiario' : function(idCotizacion, asociadoS, showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/cotizacion/{idCotizacion}/beneficiario',
                                                    { 'idCotizacion':idCotizacion   }),
                                         asociadoS, undefined, showSpin)
                },
                'UptTomador' : function(asociado, showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + 'api/camposanto/Tomador',
                                         asociado, undefined, showSpin)
                },
                'UptAval' : function(asociado, showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + 'api/camposanto/Aval',
                                         asociado, undefined, showSpin)
                },
                'UptAdicional' : function(asociado, showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + 'api/camposanto/Adicional',
                                         asociado, undefined, showSpin)
                },
                'DelBeneficiario' : function(idAsociado, showSpin){
                    return httpData['delete'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/Beneficiario/{idAsociado}',
                                                    { 'idAsociado':  { value: idAsociado, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'DelTomador' : function(idAsociado, showSpin){
                    return httpData['delete'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/Tomador/{idAsociado}',
                                                    { 'idAsociado':  { value: idAsociado, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'DelAval' : function(idAsociado, showSpin){
                    return httpData['delete'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/Aval/{idAsociado}',
                                                    { 'idAsociado':idAsociado   }),
                                         undefined, undefined, showSpin)
                },
                'DelAdicional' : function(idAsociado, showSpin){
                    return httpData['delete'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/Adicional/{idAsociado}',
                                                    { 'idAsociado':idAsociado   }),
                                         undefined, undefined, showSpin)
                },
                'GetCotizaciones' : function(parametros, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/camposanto/Cotizaciones',
                                         parametros, undefined, showSpin)
                },
                'getEstado' : function(idPerfil, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/Estado/{idPerfil}',
                                                    { 'idPerfil':idPerfil   }),
                                         undefined, undefined, showSpin)
                },
                'getFraccionamiento' : function(idRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/fraccionamiento/ramo/{idRamo}',
                                                    { 'idRamo':idRamo   }),
                                         undefined, undefined, showSpin)
                },
                'getDocumento' : function(idRamo, idtipocontrato, idCotizacion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/documentos/ramo/{idRamo}/tipocontrato/{idtipocontrato}/cotizacion/{idCotizacion}',
                                                    { 'idRamo':idRamo  ,'idtipocontrato':idtipocontrato  ,'idCotizacion':idCotizacion   }),
                                         undefined, undefined, showSpin)
                },
                'altaDocumento' : function(parametros, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/camposanto/AltaDocumento',
                                         parametros, undefined, showSpin)
                },
                'EliminarDocumento' : function(idCotizacionDocumento, idRamo, idCotizacion, idTipoContrato, showSpin){
                    return httpData['delete'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/EliminarDocumento/idCotizacionDocumento/{idCotizacionDocumento}/idRamo/{idRamo}/idCotizacion/{idCotizacion}/idTipoContrato/{idTipoContrato}',
                                                    { 'idCotizacionDocumento':idCotizacionDocumento  ,'idRamo':idRamo  ,'idCotizacion':idCotizacion  ,'idTipoContrato':idTipoContrato   }),
                                         undefined, undefined, showSpin)
                },
                'getArchivoDocumento' : function(idGestor, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/getDocumento/codigoGestorDocumental/{idGestor}',
                                                    { 'idGestor':idGestor   }),
                                         undefined, undefined, showSpin)
                },
                'Simular' : function(parametros, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/camposanto/Simular',
                                         parametros, undefined, showSpin)
                },
                'GetDatoAdicional' : function(idCotizacion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/DatosAdicionales/cotizacion/{idCotizacion}',
                                                    { 'idCotizacion':idCotizacion   }),
                                         undefined, undefined, showSpin)
                },
                'GetTomador' : function(idCotizacion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/Tomador/cotizacion/{idCotizacion}',
                                                    { 'idCotizacion':idCotizacion   }),
                                         undefined, undefined, showSpin)
                },
                'GetAval' : function(idCotizacion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/Aval/cotizacion/{idCotizacion}',
                                                    { 'idCotizacion':idCotizacion   }),
                                         undefined, undefined, showSpin)
                },
                'GetListBeneficiarios' : function(idCotizacion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/Beneficiario/cotizacion/{idCotizacion}',
                                                    { 'idCotizacion':idCotizacion   }),
                                         undefined, undefined, showSpin)
                },
                'ListaParentesco' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/camposanto/beneficiario/parentesco',
                                         undefined, undefined, showSpin)
                },
                'GetFechaVencimiento' : function(idFraccionamiento, idTipoContrato, fechaEfecto, codRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/cotizacion/fechaVencimiento?idFraccionamiento={idFraccionamiento}&idTipoContrato={idTipoContrato}&fechaEfecto={fechaEfecto}&codRamo={codRamo}',
                                                    { 'idFraccionamiento':idFraccionamiento  ,'idTipoContrato':idTipoContrato  ,'fechaEfecto':fechaEfecto  ,'codRamo':codRamo   }),
                                         undefined, undefined, showSpin)
                },
                'GuardarEmision' : function(emision, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/camposanto/emision',
                                         emision, undefined, showSpin)
                },
                'GenerarNumeroPoliza' : function(idRamo, idTipoContrato, idCampoSanto, numeroContrato, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/numeroPoliza?idRamo={idRamo}&idTipoContrato={idTipoContrato}&idCampoSanto={idCampoSanto}&numeroContrato={numeroContrato}',
                                                    { 'idRamo':idRamo  ,'idTipoContrato':idTipoContrato  ,'idCampoSanto':idCampoSanto  ,'numeroContrato':numeroContrato   }),
                                         undefined, undefined, showSpin)
                },
                'ValidacionEdad' : function(edad, idFraccionamiento, idTipoContrato, idRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/camposanto/edad/validacion?edad={edad}&idFraccionamiento={idFraccionamiento}&idTipoContrato={idTipoContrato}&idRamo={idRamo}',
                                                    { 'edad':edad  ,'idFraccionamiento':idFraccionamiento  ,'idTipoContrato':idTipoContrato  ,'idRamo':idRamo   }),
                                         undefined, undefined, showSpin)
                },
                'GuardarFechaEfectoCotizacion' : function(cotizacionCampoSantoBE, showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + 'api/camposanto/cotizacion/fechaEfecto',
                                         cotizacionCampoSantoBE, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyFola", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'listarContratos' : function(codigoCompania, codigoRamo, request, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/fola/contratos/{codigoCompania}/{codigoRamo}?paginaActual={paginaActual}&cantidadFilas={cantidadFilas}&planesActivos={planesActivos}',
                                                    { 'codigoCompania':codigoCompania  ,'codigoRamo':codigoRamo   }),
                                         request, undefined, showSpin)
                },
                'cotizarPoliza' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/fola/poliza/cotizacion',
                                         request, undefined, showSpin)
                },
                'emitirPoliza' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/fola/poliza/emision',
                                         request, undefined, showSpin)
                },
                'obtenerPoliza' : function(numeroPoliza, codigoCompania, codigoRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/fola/poliza/{numeroPoliza}/{codigoCompania}/{codigoRamo}',
                                                    { 'numeroPoliza':numeroPoliza  ,'codigoCompania':codigoCompania  ,'codigoRamo':codigoRamo   }),
                                         undefined, undefined, showSpin)
                },
                'listarDocumentos' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/fola/documentos',
                                         request, undefined, showSpin)
                },
                'cargarPlantillaAsegurados' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/fola/documento/plantillaAsegurados',
                                         undefined, undefined, showSpin)
                },
                'consultarPlantillaAsegurados' : function(numeroDocumento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/fola/documento/{numeroDocumento}/plantillaAsegurados',
                                                    { 'numeroDocumento':numeroDocumento   }),
                                         undefined, undefined, showSpin)
                },
                'listarOcupaciones' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/fola/ocupaciones',
                                         undefined, undefined, showSpin)
                },
                'registrarPlan' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/fola/plan',
                                         request, undefined, showSpin)
                },
                'actualizarPlan' : function(request, showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + 'api/fola/plan',
                                         request, undefined, showSpin)
                },
                'cargarCondicionado' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/fola/documento/condicionado',
                                         undefined, undefined, showSpin)
                },
                'eliminarCondicionado' : function(idCondicionado, tipo, showSpin){
                    return httpData['delete'](oimProxyPoliza.endpoint + helper.formatNamed('api/fola/documentos/condicionado/{idCondicionado}/{tipo}',
                                                    { 'idCondicionado':idCondicionado  ,'tipo':tipo   }),
                                         undefined, undefined, showSpin)
                },
                'consultarCondicionados' : function(request, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/fola/documentos?tipoCondicionado={tipoCondicionado}&idPlan={idPlan}',
                                         request, undefined, showSpin)
                },
                'consultarDocumento' : function(numeroDocumento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/fola/documento/{numeroDocumento}',
                                                    { 'numeroDocumento':numeroDocumento   }),
                                         undefined, undefined, showSpin)
                },
                'listarFraccionamientos' : function(request, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/fola/parametros?codigoApp={codigoApp}&dominio={dominio}',
                                         request, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyVidaLey", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'GetListCoberturas' : function(canttrab, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/vidaley/coberturas/{canttrab}',
                                                    { 'canttrab':canttrab   }),
                                         undefined, undefined, showSpin)
                },
                'GetListCategorias' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/vidaley/categorias',
                                         undefined, undefined, showSpin)
                },
                'GetListParametros' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/vidaley/parametros',
                                         undefined, undefined, showSpin)
                },
                'CotizarPrimaMinima' : function(cotizacionPrimaMinimaBE, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/vidaley/cotizar/prima/minima',
                                         cotizacionPrimaMinimaBE, undefined, showSpin)
                },
                'CotizarPrimas' : function(solicitud, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/vidaley/cotizar/primas',
                                         solicitud, undefined, showSpin)
                },
                'ActualizarPrimas' : function(cotizacionId, solicitud, showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + helper.formatNamed('api/vidaley/cotizacion/{cotizacionId}/primas',
                                                    { 'cotizacionId':cotizacionId   }),
                                         solicitud, undefined, showSpin)
                },
                'CargarAseguradosMasivo' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/vidaley/cotizar/asegurado/masiva',
                                         undefined, undefined, showSpin)
                },
                'ResumenCentralizado' : function(nromovimiento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/vidaley/cotizar/asegurado/rcen/{nromovimiento}',
                                                    { 'nromovimiento':nromovimiento   }),
                                         undefined, undefined, showSpin)
                },
                'CargarAseguradosIndividual' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/vidaley/cotizar/asegurado/individual',
                                         request, undefined, showSpin)
                },
                'ValidacionContratante' : function(contratanteId, request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/vidaley/cotizacion/contratante/{contratanteId}/validacion',
                                                    { 'contratanteId':contratanteId   }),
                                         request, undefined, showSpin)
                },
                'GetListActividadesEconomicas' : function(filtro, codPeriodo, tipoActividad, codAgente, numeroPagina, tamanioPagina, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/vidaley/actividadesEconomicas?filtro={filtro}&codPeriodo={codPeriodo}&tipoActividad={tipoActividad}&codAgente={codAgente}&numeroPagina={numeroPagina}&tamanioPagina={tamanioPagina}',
                                                    { 'filtro':  { value: filtro, defaultValue:'' } ,'codPeriodo':  { value: codPeriodo, defaultValue:'' } ,'tipoActividad':  { value: tipoActividad, defaultValue:'' } ,'codAgente':  { value: codAgente, defaultValue:'' } ,'numeroPagina':  { value: numeroPagina, defaultValue:'1' } ,'tamanioPagina':  { value: tamanioPagina, defaultValue:'10' }  }),
                                         undefined, undefined, showSpin)
                },
                'GrabarCotizacionPaso1' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/vidaley/cotizar/paso1/contratante',
                                         request, undefined, showSpin)
                },
                'ActualizarCotizacionPaso1' : function(request, showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + 'api/vidaley/cotizacion/paso1/contratante',
                                         request, undefined, showSpin)
                },
                'GrabarCotizacionPaso2' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/vidaley/cotizar/paso2',
                                         request, undefined, showSpin)
                },
                'GrabarCotizacionPaso3' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/vidaley/cotizacion/paso3',
                                         request, undefined, showSpin)
                },
                'GrabarCotizacionAgentePaso4Agente' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/vidaley/cotizacion/paso4/agente',
                                         request, undefined, showSpin)
                },
                'GrabarCotizacionSuscriptorPaso4Suscriptor' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/vidaley/cotizacion/paso4/suscriptor',
                                         request, undefined, showSpin)
                },
                'AnularCotizacionMasiva' : function(sol, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/vidaley/cotizaciones/anulacion',
                                         sol, undefined, showSpin)
                },
                'GetListDocuments' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/vidaley/busqueda',
                                         request, undefined, showSpin)
                },
                'GetCotizacionById' : function(id, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/vidaley/cotizacion/{id}',
                                                    { 'id':id   }),
                                         undefined, undefined, showSpin)
                },
                'GetResponseCotizacion' : function(id, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/vidaley/cotizacion/reporte/{id}',
                                                    { 'id':id   }),
                                         undefined, undefined, showSpin)
                },
                'SendMailCotizacion' : function(id, email, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/vidaley/cotizacion/reporte/correo/{id}',
                                                    { 'id':id   }),
                                         email, undefined, showSpin)
                },
                'CargarAseguradosMasivoValid' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/vidaley/cotizar/asegurado/masiva/valid',
                                         undefined, undefined, showSpin)
                },
                'CargarAseguradosIndividualValid' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/vidaley/cotizar/asegurado/individual/valid',
                                         request, undefined, showSpin)
                },
                'descargaArchivo' : function(numdocumento, numriesgo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/vidaley/descarga/{numdocumento}/{numriesgo}',
                                                    { 'numdocumento':numdocumento  ,'numriesgo':numriesgo   }),
                                         undefined, undefined, showSpin)
                },
                'descargaArchivoTicket' : function(numticket, numriesgo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/vidaley/descargaticket/{numticket}/{numriesgo}',
                                                    { 'numticket':numticket  ,'numriesgo':numriesgo   }),
                                         undefined, undefined, showSpin)
                },
                'GetAseguradoEquifax' : function(contractorCriteria, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/vidaley/equifax',
                                         contractorCriteria, undefined, showSpin)
                },
                'GetInfoAplication' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/vidaley/infoaplication',
                                         request, undefined, showSpin)
                },
                'CargarAseguradoXRiesgo' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/vidaley/cotizar/cargaaseguradoxriesgo',
                                         undefined, undefined, showSpin)
                },
                'GetInfoEmisionDocumentoById' : function(id, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/vidaley/emision/{id}',
                                                    { 'id':id   }),
                                         undefined, undefined, showSpin)
                },
                'GetZipEmisionDescargar' : function(id, request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/vidaley/emision/{id}/correo',
                                                    { 'id':id   }),
                                         request, undefined, showSpin)
                },
                'GetZipEmisionDescargar' : function(id, tipoOperacion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/vidaley/emision/{id}/archivo?tipoOperacion={tipoOperacion}',
                                                    { 'id':id  ,'tipoOperacion':  { value: tipoOperacion, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GrabarEmisionPaso1' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/vidaley/emision/paso1',
                                         request, undefined, showSpin)
                },
                'GrabarEmisionPaso2' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/vidaley/emision/paso2',
                                         request, undefined, showSpin)
                },
                'GetListOficinas' : function(codigoOficina, nombreOficina, cantidadFilasPorPagina, paginaActual, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/vidaley/oficinas?codigoOficina={codigoOficina}&nombreOficina={nombreOficina}&cantidadFilasPorPagina={cantidadFilasPorPagina}&paginaActual={paginaActual}',
                                                    { 'codigoOficina':codigoOficina  ,'nombreOficina':nombreOficina  ,'cantidadFilasPorPagina':  { value: cantidadFilasPorPagina, defaultValue:'10' } ,'paginaActual':  { value: paginaActual, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetListReporte' : function(reporteGeneralVidaLeyDTO, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/vidaley/cotizaciones',
                                         reporteGeneralVidaLeyDTO, undefined, showSpin)
                },
                'GetListReporteExcel' : function(reporteGeneralVidaLeyDTO, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/vidaley/cotizaciones/archivo',
                                         reporteGeneralVidaLeyDTO, undefined, showSpin)
                },
                'GrabarCotizacionExterno' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/vidaley/cotizacion/canal',
                                         request, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCotizacionRg", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'CotizacionEquipoContratista' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/rrgg/cotizacion/equipocontratista',
                                         cotizacion, undefined, showSpin)
                },
                'ResumenEquipoContratista' : function(nroTramite, codigoGrupoProducto, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/rrgg/cotizacion/equipocontratista/{nroTramite}/{codigoGrupoProducto}',
                                                    { 'nroTramite':nroTramite  ,'codigoGrupoProducto':codigoGrupoProducto   }),
                                         undefined, undefined, showSpin)
                },
                'CotizacionResponsabilidadCivil' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/rrgg/cotizacion/responsabilidadcivil',
                                         cotizacion, undefined, showSpin)
                },
                'ResumenResponsabilidadCivil' : function(nroTramite, codigoGrupoProducto, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/rrgg/cotizacion/responsabilidadcivil/{nroTramite}/{codigoGrupoProducto}',
                                                    { 'nroTramite':nroTramite  ,'codigoGrupoProducto':codigoGrupoProducto   }),
                                         undefined, undefined, showSpin)
                },
                'CotizacionTransporteTerrestre' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/rrgg/cotizacion/transporteterrestre',
                                         cotizacion, undefined, showSpin)
                },
                'ResumenTransporteTerrestre' : function(nroTramite, codigoGrupoProducto, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/rrgg/cotizacion/transporteterrestre/{nroTramite}/{codigoGrupoProducto}',
                                                    { 'nroTramite':nroTramite  ,'codigoGrupoProducto':codigoGrupoProducto   }),
                                         undefined, undefined, showSpin)
                },
                'CalculosHidrocarburos' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/rrgg/cotizacion/CalculosHidrocarburos',
                                         cotizacion, undefined, showSpin)
                },
                'CotizacionConstruccion' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/rrgg/cotizacion/construccion',
                                         cotizacion, undefined, showSpin)
                },
                'ResumenCotizacionConstruccion' : function(nroTramite, codigoGrupoProducto, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/rrgg/cotizacion/construccion/{nroTramite}/{codigoGrupoProducto}',
                                                    { 'nroTramite':nroTramite  ,'codigoGrupoProducto':codigoGrupoProducto   }),
                                         undefined, undefined, showSpin)
                },
                'CotizacionDeshonestidad' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/rrgg/cotizacion/deshonestidad',
                                         cotizacion, undefined, showSpin)
                },
                'ResumenCotizacionDeshonestidad' : function(nroTramite, codigoGrupoProducto, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/rrgg/cotizacion/deshonestidad/{nroTramite}/{codigoGrupoProducto}',
                                                    { 'nroTramite':nroTramite  ,'codigoGrupoProducto':codigoGrupoProducto   }),
                                         undefined, undefined, showSpin)
                },
                'CotizacionTransporteMaritimoAereo' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/rrgg/cotizacion/transportemaritimoaereo',
                                         cotizacion, undefined, showSpin)
                },
                'ResumenCotizacionTransporteMaritimoAereo' : function(nroTramite, codigoGrupoProducto, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/rrgg/cotizacion/transportemaritimoaereo/{nroTramite}/{codigoGrupoProducto}',
                                                    { 'nroTramite':nroTramite  ,'codigoGrupoProducto':codigoGrupoProducto   }),
                                         undefined, undefined, showSpin)
                },
                'ValidarFechaInicial' : function(fecha, codProducto, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/rrgg/cotizacion/responsabilidadcivil/validarfechainicial?fecha={fecha}&codProducto={codProducto}',
                                                    { 'fecha':fecha  ,'codProducto':codProducto   }),
                                         undefined, undefined, showSpin)
                },
                'ClonacionProducto' : function(clonacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/rrgg/cotizacion/clonacion',
                                         clonacion, undefined, showSpin)
                },
                'getListProductosClonados' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/rrgg/cotizacion/clonacion/listar',
                                         undefined, undefined, showSpin)
                },
                'getListBandeja' : function(Params, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/rrgg/cotizacion/bandeja/listar',
                                         Params, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySalud", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'DescargarPlanProducto' : function(codigoRamo, codigoModalidad, numeroContrato, numeroSubContrato, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/descargar/archivoplan/{codigoRamo}/{codigoModalidad}/{numeroContrato}/{numeroSubContrato}',
                                                    { 'codigoRamo':codigoRamo  ,'codigoModalidad':codigoModalidad  ,'numeroContrato':numeroContrato  ,'numeroSubContrato':numeroSubContrato   }),
                                         undefined, undefined, showSpin)
                },
                'DescargarHistorialPlanProducto' : function(codigoRamo, codigoModalidad, numeroContrato, numeroSubContrato, fechaValidez, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/descargar/archivoplan/historial/{codigoRamo}/{codigoModalidad}/{numeroContrato}/{numeroSubContrato}/{fechaValidez}',
                                                    { 'codigoRamo':codigoRamo  ,'codigoModalidad':codigoModalidad  ,'numeroContrato':numeroContrato  ,'numeroSubContrato':numeroSubContrato  ,'fechaValidez':fechaValidez   }),
                                         undefined, undefined, showSpin)
                },
                'ObtenerArchivoPlan' : function(codigoRamo, codigoModalidad, numeroContrato, numeroSubContrato, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/archivoPlan/{codigoRamo}/{codigoModalidad}/{numeroContrato}/{numeroSubContrato}',
                                                    { 'codigoRamo':codigoRamo  ,'codigoModalidad':codigoModalidad  ,'numeroContrato':numeroContrato  ,'numeroSubContrato':numeroSubContrato   }),
                                         undefined, undefined, showSpin)
                },
                'ListarArchivoPlan' : function(codigoRamo, codigoModalidad, numeroContrato, numeroSubContrato, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/archivoPlan/historico/{codigoRamo}/{codigoModalidad}/{numeroContrato}/{numeroSubContrato}',
                                                    { 'codigoRamo':codigoRamo  ,'codigoModalidad':codigoModalidad  ,'numeroContrato':numeroContrato  ,'numeroSubContrato':numeroSubContrato   }),
                                         undefined, undefined, showSpin)
                },
                'RegistrarArhivoPlan' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/salud/archivoPlan',
                                         undefined, undefined, showSpin)
                },
                'GetFinanciamientoTronSalud' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/salud/fraccionamientos/tron',
                                         undefined, undefined, showSpin)
                },
                'InsertarFraccionamientoSalud' : function(financiamientoSalud, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/salud/fraccionamientos',
                                         financiamientoSalud, undefined, showSpin)
                },
                'EliminarFraccionamientoSalud' : function(financiamientoSalud, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/salud/fraccionamientos/eliminar',
                                         financiamientoSalud, undefined, showSpin)
                },
                'GetFraccionamientoSalud' : function(codigoCia, codigoRamo, numeroContrato, numeroSubContrato, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/fraccionamientos/{codigoCia}/{codigoRamo}/{numeroContrato}/{numeroSubContrato}',
                                                    { 'codigoCia':codigoCia  ,'codigoRamo':codigoRamo  ,'numeroContrato':numeroContrato  ,'numeroSubContrato':numeroSubContrato   }),
                                         undefined, undefined, showSpin)
                },
                'InsertarValidaEdadSalud' : function(validaEdad, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/salud/validaEdades',
                                         validaEdad, undefined, showSpin)
                },
                'EliminarValidaEdadSalud' : function(validaEdad, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/salud/validaEdades/eliminar',
                                         validaEdad, undefined, showSpin)
                },
                'GetListaValidaEdadSalud' : function(codigoCia, codigoRamo, numeroContrato, numeroSubContrato, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/validaEdades/paginado/{codigoCia}/{codigoRamo}/{numeroContrato}/{numeroSubContrato}',
                                                    { 'codigoCia':codigoCia  ,'codigoRamo':codigoRamo  ,'numeroContrato':numeroContrato  ,'numeroSubContrato':numeroSubContrato   }),
                                         undefined, undefined, showSpin)
                },
                'ObtenerPregntasSalud' : function(cod_cuestionario, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/cuestionario/preguntas?cod_cuestionario={cod_cuestionario}',
                                                    { 'cod_cuestionario':cod_cuestionario   }),
                                         undefined, undefined, showSpin)
                },
                'ObtenerRespuestasSalud' : function(nro_cuestionario, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/cuestionario/respuestas?nro_cuestionario={nro_cuestionario}',
                                                    { 'nro_cuestionario':nro_cuestionario   }),
                                         undefined, undefined, showSpin)
                },
                'ObtenerListadoDocumentos' : function(value, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/salud/documentos/listar',
                                         value, undefined, showSpin)
                },
                'ObtenerListadoDocumentos2' : function(rqDocumentoSalud, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/salud/documentos/listar2',
                                         rqDocumentoSalud, undefined, showSpin)
                },
                'ListarPlanMigracionPorContrato' : function(codigoCia, numeroContrato, numeroSubContrato, prioridadActual, continuidadActual, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/planmigracion/{codigoCia}/{numeroContrato}/{numeroSubContrato}/{prioridadActual}/{continuidadActual}',
                                                    { 'codigoCia':codigoCia  ,'numeroContrato':numeroContrato  ,'numeroSubContrato':numeroSubContrato  ,'prioridadActual':prioridadActual  ,'continuidadActual':continuidadActual   }),
                                         undefined, undefined, showSpin)
                },
                'GetTipoContrato' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/salud/tipoContrato',
                                         undefined, undefined, showSpin)
                },
                'GetTipoSubContrato' : function(numeroContrato, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/tipoSubContrato/{numeroContrato}',
                                                    { 'numeroContrato':numeroContrato   }),
                                         undefined, undefined, showSpin)
                },
                'ListaPlanesMigrar' : function(numRegistros, numPaginacion, numContrato, numSubContrato, continuidad, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/planesMigrar/listado/{numRegistros}/{numPaginacion}/{numContrato}/{numSubContrato}/{continuidad}',
                                                    { 'numRegistros':numRegistros  ,'numPaginacion':numPaginacion  ,'numContrato':numContrato  ,'numSubContrato':numSubContrato  ,'continuidad':continuidad   }),
                                         undefined, undefined, showSpin)
                },
                'ActualizacionPlanesMigrar' : function(listPlanMigracion, showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + 'api/salud/planesMigrar/actualizacion',
                                         listPlanMigracion, undefined, showSpin)
                },
                'CreacionPlanesMigrar' : function(listPlanMigracion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/salud/planesMigrar/creacion',
                                         listPlanMigracion, undefined, showSpin)
                },
                'EliminarPlanesMigrar' : function(codigoPlanMigracion, mcaInh, showSpin){
                    return httpData['delete'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/planesMigrar/{codigoPlanMigracion}/{mcaInh}',
                                                    { 'codigoPlanMigracion':codigoPlanMigracion  ,'mcaInh':mcaInh   }),
                                         undefined, undefined, showSpin)
                },
                'ListaReglasAjuste' : function(numRegistros, numPaginacion, numContrato, numSubContrato, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/reglasAjuste/listado/{numRegistros}/{numPaginacion}/{numContrato}/{numSubContrato}',
                                                    { 'numRegistros':numRegistros  ,'numPaginacion':numPaginacion  ,'numContrato':numContrato  ,'numSubContrato':numSubContrato   }),
                                         undefined, undefined, showSpin)
                },
                'ActualizacionReglasAjuste' : function(reglasAjuste, showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + 'api/salud/reglasAjuste/actualizacion',
                                         reglasAjuste, undefined, showSpin)
                },
                'CreacionReglasAjuste' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/salud/reglasAjuste/creacion',
                                         undefined, undefined, showSpin)
                },
                'EliminarReglasAjuste' : function(idRenovSaludCriter, mcaInh, showSpin){
                    return httpData['delete'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/reglasAjuste/{idRenovSaludCriter}/{mcaInh}',
                                                    { 'idRenovSaludCriter':idRenovSaludCriter  ,'mcaInh':mcaInh   }),
                                         undefined, undefined, showSpin)
                },
                'GetPlan' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/salud/plan',
                                         undefined, undefined, showSpin)
                },
                'Get_TipoPolizaMigracion_ComboBox' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/salud/tipoPolizaMigracion',
                                         undefined, undefined, showSpin)
                },
                'DescargarDocumentoCotizacionPDF' : function(numCotizacion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/migracion/cotizacion/{numCotizacion}',
                                                    { 'numCotizacion':numCotizacion   }),
                                         undefined, undefined, showSpin)
                },
                'Get_TipoPersona_ComboBox' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/salud/tipoPersona',
                                         undefined, undefined, showSpin)
                },
                'Get_PlanSaludPrima_Listar' : function(codigoCia, codigoRamo, codigoModalidad, numeroContrato, numeroSubContrato, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/primas/{codigoCia}/{codigoRamo}/{codigoModalidad}/{numeroContrato}/{numeroSubContrato}',
                                                    { 'codigoCia':codigoCia  ,'codigoRamo':codigoRamo  ,'codigoModalidad':codigoModalidad  ,'numeroContrato':numeroContrato  ,'numeroSubContrato':numeroSubContrato   }),
                                         undefined, undefined, showSpin)
                },
                'ValidarAsegurado' : function(asegurado, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/salud/asegurados/validar',
                                         asegurado, undefined, showSpin)
                },
                'GetListTipoPlanSalud' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/salud/tipoPlan',
                                         undefined, undefined, showSpin)
                },
                'GetListEstadoProductoSalud' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/salud/estadoProducto',
                                         undefined, undefined, showSpin)
                },
                'RegistrarSuscripcion' : function(suscripcion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/salud/suscripcion',
                                         suscripcion, undefined, showSpin)
                },
                'ObtenerSuscripcion' : function(numeroDocumento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/suscripcion/{numeroDocumento}',
                                                    { 'numeroDocumento':numeroDocumento   }),
                                         undefined, undefined, showSpin)
                },
                'GenerarDpsSalud' : function(numeroDocumento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/dps/{numeroDocumento}',
                                                    { 'numeroDocumento':numeroDocumento   }),
                                         undefined, undefined, showSpin)
                },
                'AdjuntarDocumento' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/salud/documento/adjunto',
                                         undefined, undefined, showSpin)
                },
                'GetCompaniaSeguroSalud' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/salud/compania',
                                         undefined, undefined, showSpin)
                },
                'GetTipoCompaniaSeguroSalud' : function(codigoCompania, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/compania/tipo?codigoCompania={codigoCompania}',
                                                    { 'codigoCompania':codigoCompania   }),
                                         undefined, undefined, showSpin)
                },
                'ListarDocumentos' : function(rqDocumentoSalud, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/salud/listar/documentos',
                                         rqDocumentoSalud, undefined, showSpin)
                },
                'UpdateDocumentState' : function(suscripcion, showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + 'api/salud/documento/estado',
                                         suscripcion, undefined, showSpin)
                },
                'DeleteAttachFileDocument' : function(numeroDocumento, nombreTemp, showSpin){
                    return httpData['delete'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/documento/adjunto?numeroDocumento={numeroDocumento}&nombreTemp={nombreTemp}',
                                                    { 'numeroDocumento':numeroDocumento  ,'nombreTemp':nombreTemp   }),
                                         undefined, undefined, showSpin)
                },
                'DescargarDocumento' : function(numeroDocumento, nombreTemp, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/documento/adjunto?numeroDocumento={numeroDocumento}&nombreTemp={nombreTemp}',
                                                    { 'numeroDocumento':numeroDocumento  ,'nombreTemp':nombreTemp   }),
                                         undefined, undefined, showSpin)
                },
                'PolizaDpsCuestionarioPreguntasEstado' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/salud/poliza/dps/cuestionario/preguntas/estado',
                                         undefined, undefined, showSpin)
                },
                'ListarDpsCuestionarioPreguntas' : function(codigoEstado, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/poliza/dps/cuestionario/preguntas?codigoEstado={codigoEstado}',
                                                    { 'codigoEstado':codigoEstado   }),
                                         undefined, undefined, showSpin)
                },
                'CreacionPregunta' : function(operacion, ListaCuestionario, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/poliza/dps/cuestionario/pregunta?operacion={operacion}',
                                                    { 'operacion':operacion   }),
                                         ListaCuestionario, undefined, showSpin)
                },
                'ListarImc' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/salud/imc',
                                         undefined, undefined, showSpin)
                },
                'GrabarImc' : function(imc, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/salud/imc',
                                         imc, undefined, showSpin)
                },
                'ActualizaImc' : function(imc, showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + 'api/salud/imc',
                                         imc, undefined, showSpin)
                },
                'EliminaImc' : function(codigoImc, showSpin){
                    return httpData['delete'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/imc?codigoImc={codigoImc}',
                                                    { 'codigoImc':codigoImc   }),
                                         undefined, undefined, showSpin)
                },
                'GetMotivosRechazo' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/salud/motivosRechazo',
                                         undefined, undefined, showSpin)
                },
                'GetEstadosCotizacion' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/salud/estadosCotizacion',
                                         undefined, undefined, showSpin)
                },
                'GetClases' : function(descripcion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/clases?descripcion={descripcion}',
                                                    { 'descripcion':descripcion   }),
                                         undefined, undefined, showSpin)
                },
                'RegistrartasaAjuste' : function(tasas, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/salud/tasaAjuste',
                                         tasas, undefined, showSpin)
                },
                'BuscartasaAjustes' : function(tasas, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/salud/tasasAjuste',
                                         tasas, undefined, showSpin)
                },
                'ObtenertasaAjuste' : function(tasaAjusteId, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/tasaAjuste/{tasaAjusteId}',
                                                    { 'tasaAjusteId':tasaAjusteId   }),
                                         undefined, undefined, showSpin)
                },
                'ModificartasaAjuste' : function(tasaAjusteId, tipo, tasas, showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/tasaAjuste/{tasaAjusteId}?tipo={tipo}',
                                                    { 'tasaAjusteId':tasaAjusteId  ,'tipo':tipo   }),
                                         tasas, undefined, showSpin)
                },
                'ObtenerdiagnosticosDeclarados' : function(formato, fechaInicio, fechaFinal, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/salud/diagnosticosDeclarados?formato={formato}&fechaInicio={fechaInicio}&fechaFinal={fechaFinal}',
                                                    { 'formato':formato  ,'fechaInicio':fechaInicio  ,'fechaFinal':fechaFinal   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyOrchestrator", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'EmitSoat' : function(emision, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/orchestrator/emit/soat',
                                         emision, undefined, showSpin)
                },
                'QuoteSoat' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/orchestrator/quote/soat',
                                         cotizacion, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyListaNegra", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'ConsultaListaNegra' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/consultaListaNegra',
                                         request, undefined, showSpin)
                },
                'GuardarAuditoria' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/auditoria',
                                         request, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyDocumento", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'GetDocumentoListar' : function(model, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/documento/documentoListar',
                                         model, undefined, showSpin)
                },
                'GetListCotizacionVigente' : function(model, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/documento/cotizacion/vigente',
                                         model, undefined, showSpin)
                },
                'GetDocumentoByNumber' : function(CodEmpresa, CodDocumento, CodigoRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/documento/documentoBuscar/{CodEmpresa}/{CodDocumento}/{CodigoRamo}',
                                                    { 'CodEmpresa':CodEmpresa  ,'CodDocumento':CodDocumento  ,'CodigoRamo':CodigoRamo   }),
                                         undefined, undefined, showSpin)
                },
                'ObtenerCotizacionEmisionVehiculo' : function(CodEmpresa, CodDocumento, CodigoRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/documento/documentoVehiculoBuscar/{CodEmpresa}/{CodDocumento}/{CodigoRamo}',
                                                    { 'CodEmpresa':CodEmpresa  ,'CodDocumento':CodDocumento  ,'CodigoRamo':CodigoRamo   }),
                                         undefined, undefined, showSpin)
                },
                'GetDocumentoListarExcel' : function(request, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/documento/descargarExcel',
                                         request, undefined, showSpin)
                },
                'GetDocumentoImpPDF' : function(codCia, numPol, numShipTo, numApl, numAplShiTo, mcaPolEle, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/documento/descargarPDF/{codCia}/{numPol}/{numShipTo}/{numApl}/{numAplShiTo}/{mcaPolEle}',
                                                    { 'codCia':codCia  ,'numPol':numPol  ,'numShipTo':numShipTo  ,'numApl':numApl  ,'numAplShiTo':numAplShiTo  ,'mcaPolEle':mcaPolEle   }),
                                         undefined, undefined, showSpin)
                },
                'GetDocumentoImpPDFByNumPoliza' : function(numPoliza, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/documento/descargardocumento/{numPoliza}',
                                                    { 'numPoliza':numPoliza   }),
                                         undefined, undefined, showSpin)
                },
                'GetDocumentoSoatEmisionPDF' : function(numeroPoliza, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/documento/descargarSoatEmisionPDF/{numeroPoliza}',
                                                    { 'numeroPoliza':numeroPoliza   }),
                                         undefined, undefined, showSpin)
                },
                'PolizaVida_CalcularPrima' : function(documento, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/documento/PolizaVida/CalcularPrima',
                                         documento, undefined, showSpin)
                },
                'PolizaVida_RegistrarCotizacion' : function(documento, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/documento/PolizaVida/RegistrarCotizacion',
                                         documento, undefined, showSpin)
                },
                'PolizaVida_RegistrarPreEmision' : function(documento, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/documento/PolizaVida/RegistrarPreEmision',
                                         documento, undefined, showSpin)
                },
                'GetDetalleEmisión' : function(numeroDocumento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/documento/emision/detalle/{numeroDocumento}',
                                                    { 'numeroDocumento':numeroDocumento   }),
                                         undefined, undefined, showSpin)
                },
                'ListarDocumentoPag' : function(model, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/documento/listardocumentopag',
                                         model, undefined, showSpin)
                },
                'ListarDocumentoSaludPag' : function(model, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/documento/listardocumentopag/salud',
                                         model, undefined, showSpin)
                },
                'ListarDocumentoPorCodigoProcesoPag' : function(model, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/documento/listardocumentopag/codigoproceso',
                                         model, undefined, showSpin)
                },
                'GetDocumentoSaludListarExcel' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/documento/descargarExcel/salud',
                                         undefined, undefined, showSpin)
                },
                'ListarCotizacionAutoUsado' : function(model, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/documento/inspection/quotation/used',
                                         model, undefined, showSpin)
                },
                'GetQuotationForInspection' : function(CodEmpresa, CodDocumento, CodigoRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/documento/inspection/{CodEmpresa}/{CodDocumento}/{CodigoRamo}',
                                                    { 'CodEmpresa':CodEmpresa  ,'CodDocumento':CodDocumento  ,'CodigoRamo':CodigoRamo   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySctr", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'DownloadFilePcConstancia' : function(numeroConstancia, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/download/pc/constancia/{numeroConstancia}',
                                                    { 'numeroConstancia':numeroConstancia   }),
                                         undefined, undefined, showSpin)
                },
                'DownloadFilePnConstancia' : function(numeroConstancia, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/download/pn/constancia/{numeroConstancia}',
                                                    { 'numeroConstancia':numeroConstancia   }),
                                         undefined, undefined, showSpin)
                },
                'SendBandejaMailas' : function(email, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/bandeja/mailas',
                                         email, undefined, showSpin)
                },
                'SendBandejaMail' : function(email, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/bandeja/mail',
                                         email, undefined, showSpin)
                },
                'GetListBandejaPage' : function(solicitud, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/bandeja/paginado',
                                         solicitud, undefined, showSpin)
                },
                'GetListProcedencia' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/sctr/listar/procedencia',
                                         undefined, undefined, showSpin)
                },
                'GetUserRole' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/sctr/role',
                                         undefined, undefined, showSpin)
                },
                'CreateSubactividad' : function(sctrSubactividadDto, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/ciiu/subactividad',
                                         sctrSubactividadDto, undefined, showSpin)
                },
                'UpdateSubactividad' : function(sctrSubactividadDto, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/ciiu/subactividad/update',
                                         sctrSubactividadDto, undefined, showSpin)
                },
                'DeleteSubactividad' : function(id, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/ciiu/subactividad/delete/{id}',
                                                    { 'id':id   }),
                                         undefined, undefined, showSpin)
                },
                'GetListSubactividad' : function(sctrSubactividadDto, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/ciiu/subactividad/search',
                                         sctrSubactividadDto, undefined, showSpin)
                },
                'GetListSubactividadByCiiu' : function(ciiu, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/ciiu/subactividad/{ciiu}',
                                                    { 'ciiu':ciiu   }),
                                         undefined, undefined, showSpin)
                },
                'CreateClausulaAutomatica' : function(sctrClausulaAutomaticaDto, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/ciiu/clausula/automatica',
                                         sctrClausulaAutomaticaDto, undefined, showSpin)
                },
                'UpdateClausulaAutomatica' : function(sctrClausulaAutomaticaDto, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/ciiu/clausula/automatica/update',
                                         sctrClausulaAutomaticaDto, undefined, showSpin)
                },
                'DeleteClausulaAutomatica' : function(id, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/ciiu/clausula/automatica/delete/{id}',
                                                    { 'id':id   }),
                                         undefined, undefined, showSpin)
                },
                'GetListClausulaAutomatica' : function(sctrClausulaAutomaticaDto, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/ciiu/clausula/automatica/search',
                                         sctrClausulaAutomaticaDto, undefined, showSpin)
                },
                'GetListClausulaAutomaticaByCiiu' : function(ciiu, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/ciiu/clausula/automatica/{ciiu}',
                                                    { 'ciiu':ciiu   }),
                                         undefined, undefined, showSpin)
                },
                'DownloadFactura' : function(codigoCompania, numeroRecibo, tipo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/factura/{codigoCompania}/{numeroRecibo}/{tipo}',
                                                    { 'codigoCompania':codigoCompania  ,'numeroRecibo':numeroRecibo  ,'tipo':tipo   }),
                                         undefined, undefined, showSpin)
                },
                'GetListTasa' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/sctr/poliza/tasa',
                                         undefined, undefined, showSpin)
                },
                'CargarTasa' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/poliza/tasa/cargar',
                                         undefined, undefined, showSpin)
                },
                'ProcesarTasa' : function(sctrTasaCargaDetalleDto, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/poliza/tasa/procesar',
                                         sctrTasaCargaDetalleDto, undefined, showSpin)
                },
                'DownloadFileTasa' : function(idTemplate, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/poliza/tasa/download/{idTemplate}',
                                                    { 'idTemplate':idTemplate   }),
                                         undefined, undefined, showSpin)
                },
                'CalcularPrima' : function(sctrCalcularTasaDto, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/prima/calcular',
                                         sctrCalcularTasaDto, undefined, showSpin)
                },
                'ValidarAgente' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/agente/pago/pendiente',
                                         undefined, undefined, showSpin)
                },
                'ValidarAgentePorCodigo' : function(codigoAgente, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/agente/pago/pendiente/{codigoAgente}',
                                                    { 'codigoAgente':codigoAgente   }),
                                         undefined, undefined, showSpin)
                },
                'DesbloquearAgente' : function(sctrDesbloqueoDto, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/agente/desbloquear',
                                         sctrDesbloqueoDto, undefined, showSpin)
                },
                'ReportePolizaVencida' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/sctr/poliza/reporte/vencida',
                                         undefined, undefined, showSpin)
                },
                'ReportePolizaVencidaPaginado' : function(sctrReportePolizaBuscarDto, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/poliza/reporte/vencida/pag',
                                         sctrReportePolizaBuscarDto, undefined, showSpin)
                },
                'ReportePolizaPorVencer' : function(sctrReportePolizaBuscarDto, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/poliza/reporte/porvencer',
                                         sctrReportePolizaBuscarDto, undefined, showSpin)
                },
                'GetListRegion' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/sctr/region',
                                         undefined, undefined, showSpin)
                },
                'GenerarRestriccion' : function(tipOperacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/restriccion/{tipOperacion}',
                                                    { 'tipOperacion':tipOperacion   }),
                                         undefined, undefined, showSpin)
                },
                'GetListProduct' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/sctr/id',
                                         undefined, undefined, showSpin)
                },
                'GetFrecuencia' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/sctr/frecuencia',
                                         undefined, undefined, showSpin)
                },
                'GetFrecuenciaByCodGru' : function(codGru, tipo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/frecuencia/{codGru}/{tipo}',
                                                    { 'codGru':codGru  ,'tipo':tipo   }),
                                         undefined, undefined, showSpin)
                },
                'GetListState' : function(tipo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/estado/{tipo}',
                                                    { 'tipo':tipo   }),
                                         undefined, undefined, showSpin)
                },
                'SendMailEstado' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/sctr/mail/estado',
                                         undefined, undefined, showSpin)
                },
                'GetListSuscriptor' : function(sctrSuscriptorDTO, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/suscriptor/listar',
                                         sctrSuscriptorDTO, undefined, showSpin)
                },
                'GetListOficina' : function(sctrSuscriptorDTO, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/suscriptor/oficina/listar',
                                         sctrSuscriptorDTO, undefined, showSpin)
                },
                'GetListOficinaPaginado' : function(sctrSuscriptorDTO, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/suscriptor/oficina/listar/pag',
                                         sctrSuscriptorDTO, undefined, showSpin)
                },
                'GetUsuarioOim' : function(sctrSuscriptorDTO, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/suscriptor/usuario/oim/buscar',
                                         sctrSuscriptorDTO, undefined, showSpin)
                },
                'GetSuscriptor' : function(id, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/suscriptor/{id}',
                                                    { 'id':id   }),
                                         undefined, undefined, showSpin)
                },
                'GetSuscriptorByIdAgent' : function(id, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/suscriptor/agente/{id}',
                                                    { 'id':id   }),
                                         undefined, undefined, showSpin)
                },
                'SaveSuscriptor' : function(sctrSuscriptorDTO, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/suscriptor',
                                         sctrSuscriptorDTO, undefined, showSpin)
                },
                'SaveSuscriptorOficina' : function(listaSctrSuscriptorDto, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/suscriptor/oficina',
                                         listaSctrSuscriptorDto, undefined, showSpin)
                },
                'GrabarTrabajador' : function(sctrTrabajadorDTO, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/trabajador/grabar',
                                         sctrTrabajadorDTO, undefined, showSpin)
                },
                'GetListTrabajador' : function(nroSol, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/trabajador/oficina/listar?nroSol={nroSol}',
                                                    { 'nroSol':nroSol   }),
                                         undefined, undefined, showSpin)
                },
                'GetListTrabajadorConstancia' : function(nroCon, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/trabajador/constancia/listar?nroCon={nroCon}',
                                                    { 'nroCon':nroCon   }),
                                         undefined, undefined, showSpin)
                },
                'GetListTrabajadorConstanciaPc' : function(nroCon, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/trabajador/constanciapc/listar?nroCon={nroCon}',
                                                    { 'nroCon':nroCon   }),
                                         undefined, undefined, showSpin)
                },
                'GrabarMensaje' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/mensaje/grabar',
                                         undefined, undefined, showSpin)
                },
                'GetListMensaje' : function(numeroSolicitud, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/mensaje/{numeroSolicitud}',
                                                    { 'numeroSolicitud':numeroSolicitud   }),
                                         undefined, undefined, showSpin)
                },
                'DownloadFileFromMessage' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/mensaje/archivo',
                                         undefined, undefined, showSpin)
                },
                'GrabarParametro' : function(sctrParametroDTO, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/parametro/grabar',
                                         sctrParametroDTO, undefined, showSpin)
                },
                'GetListParametro' : function(sctrParametroDTO, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/parametro/listar',
                                         sctrParametroDTO, undefined, showSpin)
                },
                'GetListParametroPaginado' : function(sctrParametroDTO, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/parametro/listarpaginado',
                                         sctrParametroDTO, undefined, showSpin)
                },
                'GrabarParametroDetalle' : function(sctrParametroDetalleDTO, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/parametrodetalle/grabar',
                                         sctrParametroDetalleDTO, undefined, showSpin)
                },
                'GetListParametroDetalle' : function(sctrParametroDetalleDTO, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/parametrodetalle/listar',
                                         sctrParametroDetalleDTO, undefined, showSpin)
                },
                'GetListParametroDetalleByCodGru' : function(codGru, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/factor/calcular/{codGru}',
                                                    { 'codGru':codGru   }),
                                         undefined, undefined, showSpin)
                },
                'GetListParametroDetalleGeneral' : function(codGru, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/parametrodetalle/listargeneral?codGru={codGru}',
                                                    { 'codGru':codGru   }),
                                         undefined, undefined, showSpin)
                },
                'GetTasaPc' : function(nroDoc, grpApl, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/parametrodetalle/tipodocumento/{nroDoc}/{grpApl}',
                                                    { 'nroDoc':nroDoc  ,'grpApl':grpApl   }),
                                         undefined, undefined, showSpin)
                },
                'GetTasaPcByCodeGruVal' : function(codGru, val, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/tasa/pc/{codGru}/{val}',
                                                    { 'codGru':codGru  ,'val':val   }),
                                         undefined, undefined, showSpin)
                },
                'GetFactor' : function(codGru, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/factor/{codGru}',
                                                    { 'codGru':codGru   }),
                                         undefined, undefined, showSpin)
                },
                'GrabarRiesgo' : function(sctrRiesgoDTO, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/riesgo/grabar',
                                         sctrRiesgoDTO, undefined, showSpin)
                },
                'GetListRiesgo' : function(sctrRiesgoDTO, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/riesgo/listar',
                                         sctrRiesgoDTO, undefined, showSpin)
                },
                'GetPrimaMinima' : function(codigoCompania, codigoRamo, codigoMoneda, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/riesgo/primaminima/{codigoCompania}/{codigoRamo}/{codigoMoneda}',
                                                    { 'codigoCompania':codigoCompania  ,'codigoRamo':codigoRamo  ,'codigoMoneda':codigoMoneda   }),
                                         undefined, undefined, showSpin)
                },
                'ValidarClienteDeficitario' : function(tipDoc, numDoc, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/empresa/validardeficitario/{tipDoc}/{numDoc}',
                                                    { 'tipDoc':tipDoc  ,'numDoc':numDoc   }),
                                         undefined, undefined, showSpin)
                },
                'ObtenerCodigoPostal' : function(codPai, codDep, codPro, codDis, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/ubigeo/obtenercodigopostal/{codPai}/{codDep}/{codPro}/{codDis}',
                                                    { 'codPai':codPai  ,'codDep':codDep  ,'codPro':codPro  ,'codDis':codDis   }),
                                         undefined, undefined, showSpin)
                },
                'GetListEmpresaSctrEmi' : function(sctrSolicitud, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/poliza',
                                         sctrSolicitud, undefined, showSpin)
                },
                'GetSctrEmpresa' : function(empresa, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/empresa/buscar',
                                         empresa, undefined, showSpin)
                },
                'ExistirEmpresaTron' : function(tipDoc, numDoc, codCia, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/empresa/validartron/{tipDoc}/{numDoc}/{codCia}',
                                                    { 'tipDoc':tipDoc  ,'numDoc':numDoc  ,'codCia':codCia   }),
                                         undefined, undefined, showSpin)
                },
                'ValidarAgenciamiento' : function(empresa, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/empresa/validaragenciamiento',
                                         empresa, undefined, showSpin)
                },
                'GrabarEmpresa' : function(empresa, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/empresa',
                                         empresa, undefined, showSpin)
                },
                'GetTicketSol' : function(numSol, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/solicitud/obtener/ticket?numSol={numSol}',
                                                    { 'numSol':numSol   }),
                                         undefined, undefined, showSpin)
                },
                'GrabarSolicitud' : function(solicitud, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/solicitud',
                                         solicitud, undefined, showSpin)
                },
                'GetListSolicitudEmi' : function(solicitud, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/solicitud/listar',
                                         solicitud, undefined, showSpin)
                },
                'GetListDocumentReport' : function(solicitud, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/solicitud/reporte',
                                         solicitud, undefined, showSpin)
                },
                'GetListDocumentReportPage' : function(solicitud, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/solicitud/paginado',
                                         solicitud, undefined, showSpin)
                },
                'HelloWorld' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/sctr/testutf8',
                                         undefined, undefined, showSpin)
                },
                'HelloWorld2' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/sctr/testsinutf8',
                                         undefined, undefined, showSpin)
                },
                'ExportListSolicitudesSCTR' : function(tipoDoc, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/solicitud/exportar/{tipoDoc}',
                                                    { 'tipoDoc':tipoDoc   }),
                                         undefined, undefined, showSpin)
                },
                'ValidarReciboPoliza' : function(recPol, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/poliza/validarrecibo/{recPol}',
                                                    { 'recPol':recPol   }),
                                         undefined, undefined, showSpin)
                },
                'ValidarExistePoliza' : function(ruc, nroPol, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/poliza/validarexiste/{ruc}/{nroPol}',
                                                    { 'ruc':ruc  ,'nroPol':nroPol   }),
                                         undefined, undefined, showSpin)
                },
                'ValidarContratoReaseguro' : function(codCia, codRam, fec, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/poliza/validarreaseguro/{codCia}/{codRam}/{fec}',
                                                    { 'codCia':codCia  ,'codRam':codRam  ,'fec':fec   }),
                                         undefined, undefined, showSpin)
                },
                'GenerarTicketEmision' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/sctr/poliza/generar/ticket',
                                         undefined, undefined, showSpin)
                },
                'PcGrabarPolizaP1' : function(poliza, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/poliza/pc/p1',
                                         poliza, undefined, showSpin)
                },
                'PnGrabarPolizaP1' : function(poliza, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/poliza/pn/p1',
                                         poliza, undefined, showSpin)
                },
                'PcGrabarPolizaP2' : function(poliza, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/poliza/pc/p2',
                                         poliza, undefined, showSpin)
                },
                'PcGrabarPolizaValidarP2' : function(poliza, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/poliza/pc/p2/procesar',
                                         poliza, undefined, showSpin)
                },
                'PnGrabarPolizaP2' : function(poliza, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/poliza/pn/p2',
                                         poliza, undefined, showSpin)
                },
                'PnGrabarPolizaValidarP2' : function(poliza, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/poliza/pn/p2/validar',
                                         poliza, undefined, showSpin)
                },
                'PcGrabarPolizaP3' : function(poliza, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/poliza/pc/p3',
                                         poliza, undefined, showSpin)
                },
                'PnGrabarPolizaP3' : function(poliza, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/poliza/pn/p3',
                                         poliza, undefined, showSpin)
                },
                'PnGrabarPolizaP3CotizacionSolicitar' : function(poliza, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/poliza/pn/p3/cotizacion/solicitar',
                                         poliza, undefined, showSpin)
                },
                'PnGrabarPolizaP3CotizacionGestionar' : function(poliza, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/poliza/pn/p3/cotizacion/gestionar',
                                         poliza, undefined, showSpin)
                },
                'PnGrabarPolizaP3TasaGestionar' : function(poliza, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/poliza/pn/p3/tasa/gestionar',
                                         poliza, undefined, showSpin)
                },
                'PcCargarPlanillaP4' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/poliza/p4/pc/cargar',
                                         undefined, undefined, showSpin)
                },
                'PcP4AnularPoliza' : function(solicitud, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/poliza/p4/pc/anular',
                                         solicitud, undefined, showSpin)
                },
                'PnCargarPlanillaP4' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/poliza/p4/pn/cargar',
                                         undefined, undefined, showSpin)
                },
                'PnP4AnularPoliza' : function(solicitud, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/poliza/p4/pn/anular',
                                         solicitud, undefined, showSpin)
                },
                'DownloadUploadFileError' : function(sctrSolicitud, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/poliza/p4/upload/error',
                                         sctrSolicitud, undefined, showSpin)
                },
                'PcEmitirPolizaP4' : function(empresa, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/poliza/p4/pc/emitir',
                                         empresa, undefined, showSpin)
                },
                'PnEmitirPolizaP4' : function(empresa, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/sctr/poliza/p4/pn/emitir',
                                         empresa, undefined, showSpin)
                },
                'ActualizarConstancia' : function(nroSol, nroCon, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/poliza/actualizar/constancia/{nroSol}/{nroCon}',
                                                    { 'nroSol':nroSol  ,'nroCon':nroCon   }),
                                         undefined, undefined, showSpin)
                },
                'DownloadPcRecibo' : function(numeroRecibo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/descarga/pc/recibo/{numeroRecibo}',
                                                    { 'numeroRecibo':numeroRecibo   }),
                                         undefined, undefined, showSpin)
                },
                'DownloadPnRecibo' : function(numeroRecibo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/descarga/pn/recibo/{numeroRecibo}',
                                                    { 'numeroRecibo':numeroRecibo   }),
                                         undefined, undefined, showSpin)
                },
                'DownloadPcPoliza' : function(codigoCompania, numeroPoliza, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/descarga/pc/poliza/{codigoCompania}/{numeroPoliza}',
                                                    { 'codigoCompania':codigoCompania  ,'numeroPoliza':numeroPoliza   }),
                                         undefined, undefined, showSpin)
                },
                'DownloadPnPoliza' : function(codigoCompania, numeroPoliza, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/descarga/pn/poliza/{codigoCompania}/{numeroPoliza}',
                                                    { 'codigoCompania':codigoCompania  ,'numeroPoliza':numeroPoliza   }),
                                         undefined, undefined, showSpin)
                },
                'DownloadPcConstancia' : function(numeroConstancia, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/descarga/pc/constancia/{numeroConstancia}',
                                                    { 'numeroConstancia':numeroConstancia   }),
                                         undefined, undefined, showSpin)
                },
                'DownloadPnConstancia' : function(numeroConstancia, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/descarga/pn/constancia/{numeroConstancia}',
                                                    { 'numeroConstancia':numeroConstancia   }),
                                         undefined, undefined, showSpin)
                },
                'DownloadFilePcRecibo' : function(numeroRecibo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/download/pc/recibo/{numeroRecibo}',
                                                    { 'numeroRecibo':numeroRecibo   }),
                                         undefined, undefined, showSpin)
                },
                'DownloadFilePnRecibo' : function(numeroRecibo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/download/pn/recibo/{numeroRecibo}',
                                                    { 'numeroRecibo':numeroRecibo   }),
                                         undefined, undefined, showSpin)
                },
                'DownloadFilePcPoliza' : function(codigoCompania, numeroPoliza, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/download/pc/poliza/{codigoCompania}/{numeroPoliza}',
                                                    { 'codigoCompania':codigoCompania  ,'numeroPoliza':numeroPoliza   }),
                                         undefined, undefined, showSpin)
                },
                'DownloadFilePnPoliza' : function(codigoCompania, numeroPoliza, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/sctr/download/pn/poliza/{codigoCompania}/{numeroPoliza}',
                                                    { 'codigoCompania':codigoCompania  ,'numeroPoliza':numeroPoliza   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPoliza", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'GetPolizaListAplicTrans' : function(polizaConsulta, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/poliza/listarPolTrans',
                                         polizaConsulta, undefined, showSpin)
                },
                'GetPolizaBuscarAplicTrans' : function(polizaConsulta, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/poliza/transporte/buscarpoliza',
                                         polizaConsulta, undefined, showSpin)
                },
                'GetListPolizaGrupo' : function(codRamo, codAgente, codRubro, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/poliza/transporte/grupopoliza/{codRamo}/{codAgente}/{codRubro}',
                                                    { 'codRamo':codRamo  ,'codAgente':codAgente  ,'codRubro':codRubro   }),
                                         undefined, undefined, showSpin)
                },
                'GetConfigurarSoat' : function(codPro, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/poliza/soat/polizamanual/{codPro}',
                                                    { 'codPro':codPro   }),
                                         undefined, undefined, showSpin)
                },
                'GetPolizaPorToken' : function(token, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/poliza/token/{token}',
                                                    { 'token':token   }),
                                         undefined, undefined, showSpin)
                },
                'AnularPoliza' : function(poliza, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/poliza/anular',
                                         poliza, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyVida", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'GetListCoberturaVida' : function(codigoCompania, codigoProducto, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/Vida/Cobertura/{codigoCompania}/{codigoProducto}',
                                                    { 'codigoCompania':codigoCompania  ,'codigoProducto':codigoProducto   }),
                                         undefined, undefined, showSpin)
                },
                'GetListTipoBeneficiario' : function(codCia, codRamo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/Vida/tipobeneficiario/{codCia}/{codRamo}',
                                                    { 'codCia':codCia  ,'codRamo':codRamo   }),
                                         undefined, undefined, showSpin)
                },
                'GetListArchivoPag' : function(model, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/Vida/archivospaginado',
                                         model, undefined, showSpin)
                },
                'GeConsultarArchivo' : function(codigo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/Vida/archivos/{codigo}',
                                                    { 'codigo':codigo   }),
                                         undefined, undefined, showSpin)
                },
                'InsArchivo' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/Vida/archivos',
                                         undefined, undefined, showSpin)
                },
                'UpdArchivo' : function( showSpin){
                    return httpData['put'](oimProxyPoliza.endpoint + 'api/Vida/archivos',
                                         undefined, undefined, showSpin)
                },
                'GeDescargarArchivo' : function(codigo, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/Vida/archivos/descargar/{codigo}',
                                                    { 'codigo':codigo   }),
                                         undefined, undefined, showSpin)
                },
                'ListarResumenEquipo' : function(entidad, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/Vida/resumenequipo',
                                         entidad, undefined, showSpin)
                },
                'ListarResumenAgentePag' : function(model, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/Vida/resumenagentepaginado',
                                         model, undefined, showSpin)
                },
                'CargaAltaDocumental' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/Vida/cargaAltaDocumental',
                                         undefined, undefined, showSpin)
                },
                'EsUsuarioEspecial' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/Vida/usuarioComoAdmin',
                                         undefined, undefined, showSpin)
                },
                'GetListPeriocidad' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/Vida/periocidad',
                                         undefined, undefined, showSpin)
                },
                'GetListDevolucion' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/Vida/devolucion',
                                         undefined, undefined, showSpin)
                },
                'GetListDiferimiento' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/Vida/diferimiento',
                                         undefined, undefined, showSpin)
                },
                'GetListDuracionSeguro' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/Vida/Duracion/Seguro',
                                         undefined, undefined, showSpin)
                },
                'GetPagoAdelantado' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/Vida/RadioButton/PagoAdelantado',
                                         undefined, undefined, showSpin)
                },
                'GetPeriodoGarantizado' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/Vida/RadioButton/PeriodoGarantizado',
                                         undefined, undefined, showSpin)
                },
                'UpdateRadioButton' : function(criteriaRadioButton, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/Vida/RadioButton/Update',
                                         criteriaRadioButton, undefined, showSpin)
                },
                'ValidaEndosatario' : function(endosatario, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/Vida/Valida/Endosatario',
                                         endosatario, undefined, showSpin)
                },
                'ValidaCotizacion' : function(cot, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/Vida/valida',
                                         cot, undefined, showSpin)
                },
                'ValidarCodigoPromocion' : function(datos, codigoPromocion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/Vida/vidaRenta/promocion/{codigoPromocion}/validacion',
                                                    { 'codigoPromocion':codigoPromocion   }),
                                         datos, undefined, showSpin)
                },
                'GetResumenComparativo' : function(datos, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/Vida/vidaRenta/cotizaciones',
                                         datos, undefined, showSpin)
                },
                'GetDetalleResumenComparativoPDF' : function(datos, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/Vida/vidaRenta/cotizaciones/documento',
                                         datos, undefined, showSpin)
                },
                'GetTamanioCargomatico' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/Vida/archivos/TamanioCargomatico',
                                         undefined, undefined, showSpin)
                },
                'ObtenerCotizacion' : function(numeroCotizacion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/Vida/Cotizacion?numeroCotizacion={numeroCotizacion}',
                                                    { 'numeroCotizacion':numeroCotizacion   }),
                                         undefined, undefined, showSpin)
                },
                'ObtenerPdfCotizacion' : function(numeroCotizacion, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/Vida/Cotizacion/Pdf?numeroCotizacion={numeroCotizacion}',
                                                    { 'numeroCotizacion':numeroCotizacion   }),
                                         undefined, undefined, showSpin)
                },
                'EnviarPdfCotizacion' : function(numeroCotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/Vida/Cotizacion/Email?numeroCotizacion={numeroCotizacion}',
                                                    { 'numeroCotizacion':numeroCotizacion   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyTest", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'getLinkTRON' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/prueba/linkTRON',
                                         undefined, undefined, showSpin)
                },
                'getLinkWEB' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/prueba/linkWEB',
                                         undefined, undefined, showSpin)
                },
                'GetLogFile' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/prueba/info',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyFile", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'GetTemplate' : function(idTemplate, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/file/emisa/{idTemplate}',
                                                    { 'idTemplate':idTemplate   }),
                                         undefined, undefined, showSpin)
                },
                'GetAccidenteTemplate' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/file/accidente/template',
                                         undefined, undefined, showSpin)
                },
                'GetReglaAjusteTemplate' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/file/salud/reglaAjuste/template',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyClinicaDigital", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'ListarPlan' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/clinicaDigital/plan',
                                         undefined, undefined, showSpin)
                },
                'ListarFinanciamiento' : function(codigoCompania, codigoRamo, numeroContrato, numeroSubContrato, codigoModalidad, codigoProducto, codigoSubProducto, codigoPlan, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/clinicaDigital/financiamiento?codigoCompania={codigoCompania}&codigoRamo={codigoRamo}&numeroContrato={numeroContrato}&numeroSubContrato={numeroSubContrato}&codigoModalidad={codigoModalidad}&codigoProducto={codigoProducto}&codigoSubProducto={codigoSubProducto}&codigoPlan={codigoPlan}',
                                                    { 'codigoCompania':codigoCompania  ,'codigoRamo':codigoRamo  ,'numeroContrato':numeroContrato  ,'numeroSubContrato':numeroSubContrato  ,'codigoModalidad':codigoModalidad  ,'codigoProducto':codigoProducto  ,'codigoSubProducto':codigoSubProducto  ,'codigoPlan':codigoPlan   }),
                                         undefined, undefined, showSpin)
                },
                'ListarTipoAsegurado' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/clinicaDigital/tipoAsegurado',
                                         undefined, undefined, showSpin)
                },
                'RegistrarCotizacion' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/clinicaDigital/cotizacion',
                                         cotizacion, undefined, showSpin)
                },
                'ObtenerCotizacion' : function(numeroDocumento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/clinicaDigital/cotizacion/{numeroDocumento}',
                                                    { 'numeroDocumento':numeroDocumento   }),
                                         undefined, undefined, showSpin)
                },
                'GetCotizacion' : function(numeroDocumento, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/clinicaDigital/descargar/{numeroDocumento}',
                                                    { 'numeroDocumento':numeroDocumento   }),
                                         undefined, undefined, showSpin)
                },
                'SendMailCotizacion' : function(email, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/clinicaDigital/sendMail',
                                         email, undefined, showSpin)
                },
                'Emision' : function(dto, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/clinicaDigital/emision',
                                         dto, undefined, showSpin)
                },
                'ObtenerListadoDocumentos' : function(value, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/clinicaDigital/emision/documentos/listar',
                                         value, undefined, showSpin)
                },
                'GetListarBandejaDocumentos' : function(model, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/clinicaDigital/documentos',
                                         model, undefined, showSpin)
                },
                'ListarPlanTronPag' : function(model, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/clinicaDigital/mantenimiento/plan',
                                         model, undefined, showSpin)
                },
                'ObtennerPlan' : function(codigoCompania, codigoModalidad, codigoProducto, codigoSubProducto, codigoPlan, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/clinicaDigital/mantenimiento/plan?codigoCompania={codigoCompania}&codigoModalidad={codigoModalidad}&codigoProducto={codigoProducto}&codigoSubProducto={codigoSubProducto}&codigoPlan={codigoPlan}',
                                                    { 'codigoCompania':codigoCompania  ,'codigoModalidad':codigoModalidad  ,'codigoProducto':codigoProducto  ,'codigoSubProducto':codigoSubProducto  ,'codigoPlan':codigoPlan   }),
                                         undefined, undefined, showSpin)
                },
                'ListarPlanEstado' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/clinicaDigital/mantenimiento/plan/estado',
                                         undefined, undefined, showSpin)
                },
                'ActualizaPlanEstado' : function(planes, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/clinicaDigital/mantenimiento/plan/estado',
                                         planes, undefined, showSpin)
                },
                'ListaFinanciamientoPlan' : function(codigoCompania, codigoModalidad, codigoProducto, codigoSubProducto, codigoPlan, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/clinicaDigital/mantenimiento/plan/financiamiento?codigoCompania={codigoCompania}&codigoModalidad={codigoModalidad}&codigoProducto={codigoProducto}&codigoSubProducto={codigoSubProducto}&codigoPlan={codigoPlan}',
                                                    { 'codigoCompania':codigoCompania  ,'codigoModalidad':codigoModalidad  ,'codigoProducto':codigoProducto  ,'codigoSubProducto':codigoSubProducto  ,'codigoPlan':codigoPlan   }),
                                         undefined, undefined, showSpin)
                },
                'ActualizaFinanciamiento' : function(financiamientos, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/clinicaDigital/mantenimiento/plan/financiamiento',
                                         financiamientos, undefined, showSpin)
                },
                'RegistrarArchivoCondicionado' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/clinicaDigital/mantenimiento/plan/condicionado',
                                         undefined, undefined, showSpin)
                },
                'DescargarPlanProducto' : function(codigoRamo, codigoModalidad, numeroContrato, numeroSubContrato, codigoProducto, codigoSubProducto, codigoPlan, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/clinicaDigital/mantenimiento/plan/condicionado?codigoRamo={codigoRamo}&codigoModalidad={codigoModalidad}&numeroContrato={numeroContrato}&numeroSubContrato={numeroSubContrato}&codigoProducto={codigoProducto}&codigoSubProducto={codigoSubProducto}&codigoPlan={codigoPlan}',
                                                    { 'codigoRamo':codigoRamo  ,'codigoModalidad':codigoModalidad  ,'numeroContrato':numeroContrato  ,'numeroSubContrato':numeroSubContrato  ,'codigoProducto':codigoProducto  ,'codigoSubProducto':codigoSubProducto  ,'codigoPlan':codigoPlan   }),
                                         undefined, undefined, showSpin)
                },
                'DescargarEmision' : function(numeroEmision, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/clinicaDigital/emision/descargar/{numeroEmision}',
                                                    { 'numeroEmision':numeroEmision   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyParametro", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'getListProductos' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/rrgg/parametro/productos',
                                         undefined, undefined, showSpin)
                },
                'getListaParametrosProdPorGrupo' : function(codProd, codParam, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/rrgg/parametro/parametrosproducto/{codProd}/{codParam}',
                                                    { 'codProd':codProd  ,'codParam':codParam   }),
                                         undefined, undefined, showSpin)
                },
                'getListaParametrosTablaProdPorGrupo' : function(codProd, codParam, codMoneda, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/rrgg/parametro/parametrostablaproducto/{codProd}/{codParam}/{codMoneda}',
                                                    { 'codProd':codProd  ,'codParam':codParam  ,'codMoneda':codMoneda   }),
                                         undefined, undefined, showSpin)
                },
                'getListaParametrosCabePorGrupo' : function(codProd, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/rrgg/parametro/cabeceraparametrosproducto/{codProd}',
                                                    { 'codProd':codProd   }),
                                         undefined, undefined, showSpin)
                },
                'getListaParametrosGiroNegocio' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/rrgg/parametro/parametroGiroNegocio',
                                         undefined, undefined, showSpin)
                },
                'getListaTipoDocumentoEmision' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/rrgg/parametro/tipodocumentoemision',
                                         undefined, undefined, showSpin)
                },
                'getListaTipoDocumentalEmision' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/rrgg/parametro/tipodocumentalemision',
                                         undefined, undefined, showSpin)
                },
                'getListaTipoFraccionamiento' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/rrgg/parametro/tipofraccionamiento',
                                         undefined, undefined, showSpin)
                },
                'getDevolverAgente' : function(codAgente, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/rrgg/parametro/devolveragente/{codAgente}',
                                                    { 'codAgente':codAgente   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyTronSistema", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'GetListParametro' : function(codSistema, codRamo, p, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/tron/sistema/{codSistema}/ramo/{codRamo}/parametro?p={p}',
                                                    { 'codSistema':codSistema  ,'codRamo':codRamo  ,'p':p   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyEmpresa", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'GetEmissionStep' : function(nrodocumento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/emision/get/{nrodocumento}',
                                                    { 'nrodocumento':nrodocumento   }),
                                         undefined, undefined, showSpin)
                },
                'SaveEmissionStep' : function(doc, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/empresa/emision/save',
                                         doc, undefined, showSpin)
                },
                'LoadExcel' : function( showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/empresa/excel',
                                         undefined, undefined, showSpin)
                },
                'GetListGiroNegocio' : function(codTipEmp, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/gironegocio/{codTipEmp}',
                                                    { 'codTipEmp':codTipEmp   }),
                                         undefined, undefined, showSpin)
                },
                'GetListTipoEmpresa' : function(codCia, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/tipoempresa/{codCia}',
                                                    { 'codCia':codCia   }),
                                         undefined, undefined, showSpin)
                },
                'GetListTipoLocal' : function(codCia, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/tipolocal/{codCia}',
                                                    { 'codCia':codCia   }),
                                         undefined, undefined, showSpin)
                },
                'GetCategoriaConstruccion' : function(codCia, codRamo, codModalidad, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/categoriaConstruccion?codCia={codCia}&codRamo={codRamo}&codModalidad={codModalidad}',
                                                    { 'codCia':  { value: codCia, defaultValue:'1' } ,'codRamo':  { value: codRamo, defaultValue:'120' } ,'codModalidad':  { value: codModalidad, defaultValue:'99999' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetAlarmaMonitoreo' : function(codCia, codRamo, codModalidad, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/alarmaMonitoreo?codCia={codCia}&codRamo={codRamo}&codModalidad={codModalidad}',
                                                    { 'codCia':  { value: codCia, defaultValue:'1' } ,'codRamo':  { value: codRamo, defaultValue:'120' } ,'codModalidad':  { value: codModalidad, defaultValue:'99999' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetListCantidadRiesgo' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/empresa/cantidadRiesgo',
                                         undefined, undefined, showSpin)
                },
                'GetListEstructuraRiesgo' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/empresa/estructurariesgo',
                                         undefined, undefined, showSpin)
                },
                'GetListDepartamentosV2' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/empresa/getDepartamentosV2',
                                         undefined, undefined, showSpin)
                },
                'GetListProvinciasV2' : function(codigoDepartamento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/getProvinciasV2/{codigoDepartamento}',
                                                    { 'codigoDepartamento':codigoDepartamento   }),
                                         undefined, undefined, showSpin)
                },
                'GetListDistritosV2' : function(codigoProvincia, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/GetDistritosV2/{codigoProvincia}',
                                                    { 'codigoProvincia':codigoProvincia   }),
                                         undefined, undefined, showSpin)
                },
                'GetGrupoPolizaV2' : function(codigoPoliza, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/getGrupoPolizaV2/{codigoPoliza}',
                                                    { 'codigoPoliza':codigoPoliza   }),
                                         undefined, undefined, showSpin)
                },
                'GetAgenteByCodigoV2' : function(codigoCia, codigoAgente, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/GetAgenteByCodigoV2/{codigoCia}/{codigoAgente}',
                                                    { 'codigoCia':codigoCia  ,'codigoAgente':codigoAgente   }),
                                         undefined, undefined, showSpin)
                },
                'GetAgenteByNombreV2' : function(codigoCia, nombreAgente, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/GetAgenteByNombreV2/{codigoCia}/{nombreAgente}',
                                                    { 'codigoCia':codigoCia  ,'nombreAgente':nombreAgente   }),
                                         undefined, undefined, showSpin)
                },
                'GetAgenteV2' : function(codigoCia, agente, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/GetAgenteV2/{codigoCia}/{agente}',
                                                    { 'codigoCia':codigoCia  ,'agente':agente   }),
                                         undefined, undefined, showSpin)
                },
                'GetTipoEmpresaV2' : function(codCia, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/GetTipoEmpresaV2/{codCia}',
                                                    { 'codCia':codCia   }),
                                         undefined, undefined, showSpin)
                },
                'GetGiroNegocioV2' : function(numSecu, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/GetGiroNegocioV2/{numSecu}',
                                                    { 'numSecu':numSecu   }),
                                         undefined, undefined, showSpin)
                },
                'GetCategoriaConstruccionV2' : function(codCia, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/GetCategoriaConstruccionV2/{codCia}',
                                                    { 'codCia':codCia   }),
                                         undefined, undefined, showSpin)
                },
                'GetTipoDocumentosV2' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/empresa/getTipoDocumentosV2',
                                         undefined, undefined, showSpin)
                },
                'GetClienteV2' : function(codCia, tipoDocumento, numeroDocumento, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/getClienteV2/{codCia}/{tipoDocumento}/{numeroDocumento}',
                                                    { 'codCia':codCia  ,'tipoDocumento':tipoDocumento  ,'numeroDocumento':numeroDocumento   }),
                                         undefined, undefined, showSpin)
                },
                'GetListTipoLocalV2' : function(codCia, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/getListTipoLocalV2/{codCia}',
                                                    { 'codCia':codCia   }),
                                         undefined, undefined, showSpin)
                },
                'GetListMonedaV2' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/empresa/getListMonedaV2',
                                         undefined, undefined, showSpin)
                },
                'GetListMatConstV2' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/empresa/getListMatConstV2',
                                         undefined, undefined, showSpin)
                },
                'GetListUsoPredioV2' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/empresa/getListUsoPredioV2',
                                         undefined, undefined, showSpin)
                },
                'GetProductosV2' : function(codCia, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/getProductosV2/{codCia}',
                                                    { 'codCia':codCia   }),
                                         undefined, undefined, showSpin)
                },
                'GetProfesionesV2' : function(strDato, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/getProfesionesV2/{strDato}',
                                                    { 'strDato':strDato   }),
                                         undefined, undefined, showSpin)
                },
                'GetConsolidadoCotizacionV2' : function(codCia, numDoc, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/getConsolidadoCotizacionV2/{codCia}/{numDoc}',
                                                    { 'codCia':codCia  ,'numDoc':numDoc   }),
                                         undefined, undefined, showSpin)
                },
                'GetDocumento' : function(numDoc, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/getDocumentoV2/{numDoc}',
                                                    { 'numDoc':numDoc   }),
                                         undefined, undefined, showSpin)
                },
                'GetDocumentoEmpresaPDFPost' : function(numDoc, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/getDocumentoEmpresaPDFV2/{numDoc}',
                                                    { 'numDoc':numDoc   }),
                                         undefined, undefined, showSpin)
                },
                'SendMailCotizacion' : function(email, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/empresa/cotizacion/sendMail',
                                         email, undefined, showSpin)
                },
                'GetViaEmisionV2' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/empresa/getViaEmisionV2',
                                         undefined, undefined, showSpin)
                },
                'GetNumeroEmisionV2' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/empresa/getNumeroEmisionV2',
                                         undefined, undefined, showSpin)
                },
                'GetInteriorEmisionV2' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/empresa/getInteriorEmisionV2',
                                         undefined, undefined, showSpin)
                },
                'GetZonaEmisionV2' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/empresa/getZonaEmisionV2',
                                         undefined, undefined, showSpin)
                },
                'GetObtenerInspectorV2' : function(filtro, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/GetObtenerInspectorV2/{filtro}',
                                                    { 'filtro':  { value: filtro, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetProfesionesAll' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/empresa/GetProfesionesAll',
                                         undefined, undefined, showSpin)
                },
                'GetFiltrarCotizacionesV2' : function(bandejaEmpresa, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/empresa/bandejaPaginadoV2',
                                         bandejaEmpresa, undefined, showSpin)
                },
                'GetObtenerNumeroAseguradosCVIV2' : function(numDoc, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/GetObtenerNumeroAseguradosCVIV2/{numDoc}',
                                                    { 'numDoc':numDoc   }),
                                         undefined, undefined, showSpin)
                },
                'GetOrdenRegMaxCVIV2' : function(numDoc, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/GetOrdenRegMaxV2/{numDoc}',
                                                    { 'numDoc':numDoc   }),
                                         undefined, undefined, showSpin)
                },
                'GetListCategoriaInspeccion' : function(codCia, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/categoriaInspeccion/{codCia}',
                                                    { 'codCia':codCia   }),
                                         undefined, undefined, showSpin)
                },
                'GenerarCotizacion' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/empresa/generar/cotizacion',
                                         cotizacion, undefined, showSpin)
                },
                'grabarCotizacionV2' : function(cotizacion, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/empresa/grabarCotizacionV2',
                                         cotizacion, undefined, showSpin)
                },
                'GetEmisionPdf' : function(codigoCompania, numeroPoliza, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/empresa/descarga/emision/{codigoCompania}/{numeroPoliza}',
                                                    { 'codigoCompania':codigoCompania  ,'numeroPoliza':numeroPoliza   }),
                                         undefined, undefined, showSpin)
                },
                'SendMailEmision' : function(email, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/empresa/emision/sendMail',
                                         email, undefined, showSpin)
                },
                'grabarEmision' : function(doc, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/empresa/emision',
                                         doc, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyUbigeo", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'getUbigeo' : function(ubi, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/general/ubigeo/buscar',
                                         ubi, undefined, showSpin)
                },
                'getDepartamento' : function(codPais, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/ubigeo/departamento?codPais={codPais}',
                                                    { 'codPais':  { value: codPais, defaultValue:'PE' }  }),
                                         undefined, undefined, showSpin)
                },
                'getProvincia' : function(id, codPais, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/ubigeo/provincia/{id}?codPais={codPais}',
                                                    { 'id':id  ,'codPais':  { value: codPais, defaultValue:'PE' }  }),
                                         undefined, undefined, showSpin)
                },
                'getDistrito' : function(id, codPais, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/general/ubigeo/distrito/{id}?codPais={codPais}',
                                                    { 'id':id  ,'codPais':  { value: codPais, defaultValue:'PE' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetListPais' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/ubigeo/pais',
                                         undefined, undefined, showSpin)
                },
                'GetCodigoPostal' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/general/ubigeo/codigopostal',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySoat", ['oimProxyPoliza', 'httpData', function(oimProxyPoliza, httpData){
        return {
                'GetListDelivery' : function(codRubro, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/soat/listasdelivery/{codRubro}',
                                                    { 'codRubro':codRubro   }),
                                         undefined, undefined, showSpin)
                },
                'GetListMarcaModelo' : function(aut, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/soat/marcamodelo',
                                         aut, undefined, showSpin)
                },
                'GetListTipoVehiculo' : function(codCom, codRam, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/soat/tipovehiculo/{codCom}/{codRam}',
                                                    { 'codCom':codCom  ,'codRam':  { value: codRam, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'getListMarca' : function(codCom, codTip, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/soat/marca/{codCom}/{codTip}',
                                                    { 'codCom':codCom  ,'codTip':codTip   }),
                                         undefined, undefined, showSpin)
                },
                'getListModelo' : function(codCom, codTip, codMar, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/soat/modelo/{codCom}/{codTip}/{codMar}',
                                                    { 'codCom':codCom  ,'codTip':codTip  ,'codMar':codMar   }),
                                         undefined, undefined, showSpin)
                },
                'getListSubModeloOld' : function(codCom, codTip, codMar, codMod, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/soat/submodelo/old/{codCom}/{codTip}/{codMar}/{codMod}',
                                                    { 'codCom':codCom  ,'codTip':codTip  ,'codMar':codMar  ,'codMod':codMod   }),
                                         undefined, undefined, showSpin)
                },
                'getListTipoUso' : function(codCom, codRam, codMod, codTip, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/soat/tipouso/{codCom}/{codRam}/{codMod}/{codTip}',
                                                    { 'codCom':codCom  ,'codRam':codRam  ,'codMod':codMod  ,'codTip':codTip   }),
                                         undefined, undefined, showSpin)
                },
                'ValidPolizaManual' : function(polMan, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/soat/polizamanual/{polMan}',
                                                    { 'polMan':polMan   }),
                                         undefined, undefined, showSpin)
                },
                'GetListPolizaManual' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/soat/polizamanual/producto',
                                         undefined, undefined, showSpin)
                },
                'GetValidarPsd' : function(veh, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/soat/validar/psc',
                                         veh, undefined, showSpin)
                },
                'EnviarMailSoatDigital' : function(soatDigitalDto, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/soat/mail/digital',
                                         soatDigitalDto, undefined, showSpin)
                },
                'ValidarAgente' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/soat/validar/agente',
                                         undefined, undefined, showSpin)
                },
                'ValidarAgentePorCodigo' : function(codigoAgente, showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + helper.formatNamed('api/soat/validar/agente/{codigoAgente}',
                                                    { 'codigoAgente':codigoAgente   }),
                                         undefined, undefined, showSpin)
                },
                'ValidarOficinaParaAnularPoliza' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/soat/validar/oficina/poliza/anular',
                                         undefined, undefined, showSpin)
                },
                'AnularPoliza' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/soat/poliza/anulada',
                                         undefined, undefined, showSpin)
                },
                'GetListEstadoPoliza' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/soat/poliza/estado',
                                         undefined, undefined, showSpin)
                },
                'GetListEstadoPagoPoliza' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/soat/poliza/estado/pago',
                                         undefined, undefined, showSpin)
                },
                'GetListDocumentoSoat' : function(documento, showSpin){
                    return httpData['post'](oimProxyPoliza.endpoint + 'api/soat/bandeja',
                                         documento, undefined, showSpin)
                },
                'GetListModalidadSoatDigital' : function( showSpin){
                    return httpData['get'](oimProxyPoliza.endpoint + 'api/soat/modalidad/digital',
                                         undefined, undefined, showSpin)
                }
        };
     }]);
});
