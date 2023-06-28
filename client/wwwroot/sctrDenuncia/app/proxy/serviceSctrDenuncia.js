(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants'], function(angular, constants){
    var module = angular.module("oim.proxyService.sctrDenuncia", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxySctrDenuncia', {
        endpoint: constants.system.api.endpoints['sctrDenuncia'],
        controllerInsurancePolicy: {
            actions : {
                'methodGetByDocument':{
                    name:  'GetByDocument',
                    path: 'api/insurancepolicy?document={document}&rucCliente={rucCliente}&fecAccidente={fecAccidente}'
                },
            }
        },
        controllerClient: {
            actions : {
                'methodSeekClient':{
                    name:  'SeekClient',
                    path: 'api/client/seek/client/{wildcar}'
                },
                'methodSeekCompany':{
                    name:  'SeekCompany',
                    path: 'api/client/seek/company/{wildcar}'
                },
                'methodSeekCompanyWithSpecialChar':{
                    name:  'SeekCompanyWithSpecialChar',
                    path: 'api/client/seek/company/search/wildcard'
                },
                'methodGetClientByDocument':{
                    name:  'GetClientByDocument',
                    path: 'api/client?documentNumber={documentNumber}&policyNumber={policyNumber}'
                },
                'methodGetAseguradoByDocument':{
                    name:  'GetAseguradoByDocument',
                    path: 'api/client/asegurado?documentNumber={documentNumber}'
                },
                'methodGetAseguradoByDocument':{
                    name:  'GetAseguradoByDocument',
                    path: 'api/client/Equifax/{TipoDocumento}/{NumDocumento}'
                },
                'methodGetImportant':{
                    name:  'GetImportant',
                    path: 'api/client/Important/{NumDocumento}'
                },
                'methodGetObservado':{
                    name:  'GetObservado',
                    path: 'api/client/asegurado/Observado/{NumDocumento}'
                },
            }
        },
        controllerDocument: {
            actions : {
                'methodAppend':{
                    name:  'Append',
                    path: 'api/document/append/{periodo}/{nroDenuncia}'
                },
                'methodEliminar':{
                    name:  'Eliminar',
                    path: 'api/document/delete/{iddocument}'
                },
                'methodList':{
                    name:  'List',
                    path: 'api/document/all/{periodo}/{nrodenuncia}/{nropoliza}'
                },
                'methodDownload':{
                    name:  'Download',
                    path: 'api/document/download/{periodo}/{nrodenuncia}/{nropoliza}/{iddocument}'
                },
            }
        },
        controllerDisabilityRequest: {
            actions : {
                'methodSolicitudes':{
                    name:  'Solicitudes',
                    path: 'api/listaSolicitudes'
                },
                'methodCantidadSolicitudes':{
                    name:  'CantidadSolicitudes',
                    path: 'api/cantidadSolicitudes'
                },
                'methodreporteSolicitudesInvalidez':{
                    name:  'reporteSolicitudesInvalidez',
                    path: 'api/solicitudes?formato={formato}'
                },
                'methodnewSolicitudInvalidez':{
                    name:  'newSolicitudInvalidez',
                    path: 'api/solicitud'
                },
                'methodsetSolicitudInvalidez':{
                    name:  'setSolicitudInvalidez',
                    path: 'api/solicitud/{solicitudId}'
                },
                'methodgetSolicitudInvalidez':{
                    name:  'getSolicitudInvalidez',
                    path: 'api/solicitud/{solicitudId}'
                },
                'methodnewCitaSolicitudInvalidez':{
                    name:  'newCitaSolicitudInvalidez',
                    path: 'api/solicitud/{solicitudId}/cita'
                },
                'methodsetCitaSolicitudInvalidez':{
                    name:  'setCitaSolicitudInvalidez',
                    path: 'api/solicitud/{solicitudId}/cita/{citaId}'
                },
                'methodlistCitaSolicitudInvalidez':{
                    name:  'listCitaSolicitudInvalidez',
                    path: 'api/solicitud/{solicitudId}/citas?tamano={tamano}&pagina={pagina}'
                },
                'methodgetCitaSolicitudInvalidez':{
                    name:  'getCitaSolicitudInvalidez',
                    path: 'api/solicitud/{solicitudId}/cita/{citaId}'
                },
                'methodnewAuditoria':{
                    name:  'newAuditoria',
                    path: 'api/solicitud/{solicitudId}/auditoria'
                },
                'methodsetAuditoria':{
                    name:  'setAuditoria',
                    path: 'api/solicitud/{solicitudId}/auditoria/{auditoriaId}'
                },
                'methodlistAuditorias':{
                    name:  'listAuditorias',
                    path: 'api/solicitud/{solicitudId}/auditorias?tamano={tamano}&pagina={pagina}'
                },
                'methodgetAuditoria':{
                    name:  'getAuditoria',
                    path: 'api/solicitud/{solicitudId}/auditoria/{auditoriaId}'
                },
                'methodlistExamenesAuditoria':{
                    name:  'listExamenesAuditoria',
                    path: 'api/solicitud/{solicitudId}/auditoria/{auditoriaId}/examenes?tamano={tamano}&pagina={pagina}'
                },
                'methodnewExamenAuditoria':{
                    name:  'newExamenAuditoria',
                    path: 'api/solicitud/{solicitudId}/auditoria/{auditoriaId}/examen'
                },
                'methodsetExamenAuditoria':{
                    name:  'setExamenAuditoria',
                    path: 'api/solicitud/{solicitudId}/auditoria/{auditoriaId}/examen/{numeroItemId}'
                },
                'methodeliminarExamen':{
                    name:  'eliminarExamen',
                    path: 'api/solicitud/{solicitudId}/auditoria/{auditoriaId}/examen/{numeroItemId}'
                },
                'methodlistDictamenes':{
                    name:  'listDictamenes',
                    path: 'api/solicitud/{solicitudId}/dictamenes'
                },
                'methodgetCarta':{
                    name:  'getCarta',
                    path: 'api/solicitud/{solicitudId}/cita/{citaId}/carta'
                },
                'methodnewDocumento':{
                    name:  'newDocumento',
                    path: 'api/solicitud/{solicitudId}/documentos'
                },
                'methodlistDocumentos':{
                    name:  'listDocumentos',
                    path: 'api/solicitud/{solicitudId}/documentos?tamano={tamano}&pagina={pagina}'
                },
                'methodsetDocumento':{
                    name:  'setDocumento',
                    path: 'api/solicitud/{solicitudId}/documentos/{numeroItemId}'
                },
                'methoddescargarDocumentos':{
                    name:  'descargarDocumentos',
                    path: 'api/solicitud/{solicitudId}/documentos/{numeroItemId}'
                },
                'methodeliminarDocumento':{
                    name:  'eliminarDocumento',
                    path: 'api/solicitud/{solicitudId}/documentos/{numeroItemId}'
                },
                'methodnewComentario':{
                    name:  'newComentario',
                    path: 'api/solicitud/{solicitudId}/comentarios'
                },
                'methodSetComentario':{
                    name:  'SetComentario',
                    path: 'api/solicitud/{solicitudId}/comentarios/{numeroItemId}'
                },
                'methodlistComentarios':{
                    name:  'listComentarios',
                    path: 'api/solicitud/{solicitudId}/comentarios?tamano={tamano}&pagina={pagina}'
                },
                'methodObservarAsegurado':{
                    name:  'ObservarAsegurado',
                    path: 'api/asegurado/observado'
                },
                'methodSetObservarAsegurado':{
                    name:  'SetObservarAsegurado',
                    path: 'api/asegurado/observado'
                },
                'methodconsultarPersona':{
                    name:  'consultarPersona',
                    path: 'api/wsrConsultaEquifax/consultarPersona?tipoDoc={tipoDoc}&numDoc={numDoc}&tipoConsulta={tipoConsulta}'
                },
                'methodparametros':{
                    name:  'parametros',
                    path: 'api/parametros?opt={opt}&parametro1={parametro1}&parametro2={parametro2}&parametro3={parametro3}&tamano={tamano}&pagina={pagina}'
                },
            }
        },
        controllerLookupSctr: {
            actions : {
                'methodGetLookups':{
                    name:  'GetLookups',
                    path: 'api/lookup/several'
                },
                'methodValidateToken':{
                    name:  'ValidateToken',
                    path: 'api/lookup/validateToken'
                },
            }
        },
        controllerBinnacle: {
            actions : {
                'methodGet':{
                    name:  'Get',
                    path: 'api/binnacle/all/{periodo}/{nroDenuncia}'
                },
                'methodSave':{
                    name:  'Save',
                    path: 'api/binnacle/save'
                },
            }
        },
        controllerClinicCoverage: {
            actions : {
                'methodGetClinic':{
                    name:  'GetClinic',
                    path: 'api/clinic?codigoDepartamento={codigoDepartamento}&codigoProvincia={codigoProvincia}&codigoDistrito={codigoDistrito}&nroPlan={nroPlan}'
                },
                'methodGetCoverageByClinic':{
                    name:  'GetCoverageByClinic',
                    path: 'api/coverage?codigoProveedor={codigoProveedor}&numeroSucursalProveedor={numeroSucursalProveedor}&nroPlan={nroPlan}'
                },
                'methodGetCoverageClinic':{
                    name:  'GetCoverageClinic',
                    path: 'api/clinic/coverage?nroPlan={nroPlan}&nroDocumento={nroDocumento}'
                },
                'methodSeekCompanyWithSpecialChar':{
                    name:  'SeekCompanyWithSpecialChar',
                    path: 'api/seek/company/coverageSearch/wildcard'
                },
                'methodSeekClinic':{
                    name:  'SeekClinic',
                    path: 'api/seek/clinic/search/wildcard'
                },
                'methodgetDetail':{
                    name:  'getDetail',
                    path: 'api/clinic/coverage/detail?nroPlan={nroPlan}&codigorenipress={codigorenipress}&numeroPoliza={numeroPoliza}&ruc={ruc}'
                },
                'methodGetPlan':{
                    name:  'GetPlan',
                    path: 'api/clinic/coverage/plan?nroPlan={nroPlan}'
                },
                'methodgetDetail1':{
                    name:  'getDetail1',
                    path: 'api/clinic/coverage/detail1?nroPlan={nroPlan}&codigorenipress={codigorenipress}&numeroPoliza={numeroPoliza}&ruc={ruc}'
                },
                'methodgetDetail2':{
                    name:  'getDetail2',
                    path: 'api/clinic/coverage/detail2?nroPlan={nroPlan}&codigorenipress={codigorenipress}&numeroPoliza={numeroPoliza}&ruc={ruc}'
                },
            }
        },
        controllerComplaint: {
            actions : {
                'methodGetCompaintClient':{
                    name:  'GetCompaintClient',
                    path: 'api/complaint/search/client'
                },
                'methodSearch':{
                    name:  'Search',
                    path: 'api/complaint/search'
                },
                'methodGet':{
                    name:  'Get',
                    path: 'api/complaint/{nroDenuncia}/{periodo}/{codigoAsegurado}'
                },
                'methodGetTrack':{
                    name:  'GetTrack',
                    path: 'api/complaint/Track/{nroDenuncia}/{periodo}'
                },
                'methoddonwload':{
                    name:  'donwload',
                    path: 'api/complaint/download/{nroDenuncia}/{periodo}/{codigoAsegurado}'
                },
                'methodAproveComplaint':{
                    name:  'AproveComplaint',
                    path: 'api/complaint/stateaprove'
                },
                'methodRejectComplaint':{
                    name:  'RejectComplaint',
                    path: 'api/complaint/reject'
                },
                'methodEndComplaint':{
                    name:  'EndComplaint',
                    path: 'api/complaint/End'
                },
                'methodRehabilitateComplaint':{
                    name:  'RehabilitateComplaint',
                    path: 'api/complaint/Rehabilitate'
                },
                'methodSeekBenefit':{
                    name:  'SeekBenefit',
                    path: 'api/complaint/seek/benefit'
                },
                'methodAproveAttention':{
                    name:  'AproveAttention',
                    path: 'api/complaint/attention/aprove'
                },
                'methodRejectAttention':{
                    name:  'RejectAttention',
                    path: 'api/complaint/attention/reject'
                },
                'methodRegister':{
                    name:  'Register',
                    path: 'api/complaint/register'
                },
                'methodRegisterProvisional':{
                    name:  'RegisterProvisional',
                    path: 'api/complaint/registerprovisional'
                },
            }
        },
        controllerLocation: {
            actions : {
                'methodGetLocation':{
                    name:  'GetLocation',
                    path: 'api/Location?codeDepartament={codeDepartament}&codeprovince={codeprovince}'
                },
            }
        }
    })



     module.factory("proxyInsurancePolicy", ['oimProxySctrDenuncia', 'httpData', function(oimProxySctrDenuncia, httpData){
        return {
                'GetByDocument' : function(document, rucCliente, fecAccidente, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/insurancepolicy?document={document}&rucCliente={rucCliente}&fecAccidente={fecAccidente}',
                                                    { 'document':document  ,'rucCliente':rucCliente  ,'fecAccidente':fecAccidente   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyClient", ['oimProxySctrDenuncia', 'httpData', function(oimProxySctrDenuncia, httpData){
        return {
                'SeekClient' : function(wildcar, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/client/seek/client/{wildcar}',
                                                    { 'wildcar':wildcar   }),
                                         undefined, undefined, showSpin)
                },
                'SeekCompany' : function(wildcar, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/client/seek/company/{wildcar}',
                                                    { 'wildcar':wildcar   }),
                                         undefined, undefined, showSpin)
                },
                'SeekCompanyWithSpecialChar' : function(wildcard, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + 'api/client/seek/company/search/wildcard',
                                         wildcard, undefined, showSpin)
                },
                'GetClientByDocument' : function(documentNumber, policyNumber, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/client?documentNumber={documentNumber}&policyNumber={policyNumber}',
                                                    { 'documentNumber':  { value: documentNumber, defaultValue:'' } ,'policyNumber':  { value: policyNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetAseguradoByDocument' : function(documentNumber, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/client/asegurado?documentNumber={documentNumber}',
                                                    { 'documentNumber':documentNumber   }),
                                         undefined, undefined, showSpin)
                },
                'GetAseguradoByDocument' : function(TipoDocumento, NumDocumento, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/client/Equifax/{TipoDocumento}/{NumDocumento}',
                                                    { 'TipoDocumento':TipoDocumento  ,'NumDocumento':NumDocumento   }),
                                         undefined, undefined, showSpin)
                },
                'GetImportant' : function(NumDocumento, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/client/Important/{NumDocumento}',
                                                    { 'NumDocumento':NumDocumento   }),
                                         undefined, undefined, showSpin)
                },
                'GetObservado' : function(NumDocumento, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/client/asegurado/Observado/{NumDocumento}',
                                                    { 'NumDocumento':NumDocumento   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyDocument", ['oimProxySctrDenuncia', 'httpData', function(oimProxySctrDenuncia, httpData){
        return {
                'Append' : function(periodo, nroDenuncia, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/document/append/{periodo}/{nroDenuncia}',
                                                    { 'periodo':periodo  ,'nroDenuncia':nroDenuncia   }),
                                         undefined, undefined, showSpin)
                },
                'Eliminar' : function(iddocument, showSpin){
                    return httpData['delete'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/document/delete/{iddocument}',
                                                    { 'iddocument':iddocument   }),
                                         undefined, undefined, showSpin)
                },
                'List' : function(periodo, nrodenuncia, nropoliza, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/document/all/{periodo}/{nrodenuncia}/{nropoliza}',
                                                    { 'periodo':periodo  ,'nrodenuncia':nrodenuncia  ,'nropoliza':nropoliza   }),
                                         undefined, undefined, showSpin)
                },
                'Download' : function(periodo, nrodenuncia, nropoliza, iddocument, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/document/download/{periodo}/{nrodenuncia}/{nropoliza}/{iddocument}',
                                                    { 'periodo':periodo  ,'nrodenuncia':nrodenuncia  ,'nropoliza':nropoliza  ,'iddocument':iddocument   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyDisabilityRequest", ['oimProxySctrDenuncia', 'httpData', function(oimProxySctrDenuncia, httpData){
        return {
                'Solicitudes' : function(body, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + 'api/listaSolicitudes',
                                         body, undefined, showSpin)
                },
                'CantidadSolicitudes' : function(body, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + 'api/cantidadSolicitudes',
                                         body, undefined, showSpin)
                },
                'reporteSolicitudesInvalidez' : function(body, formato, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitudes?formato={formato}',
                                                    { 'formato':formato   }),
                                         body, undefined, showSpin)
                },
                'newSolicitudInvalidez' : function(body, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + 'api/solicitud',
                                         body, undefined, showSpin)
                },
                'setSolicitudInvalidez' : function(body, solicitudId, showSpin){
                    return httpData['put'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitud/{solicitudId}',
                                                    { 'solicitudId':solicitudId   }),
                                         body, undefined, showSpin)
                },
                'getSolicitudInvalidez' : function(solicitudId, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitud/{solicitudId}',
                                                    { 'solicitudId':solicitudId   }),
                                         undefined, undefined, showSpin)
                },
                'newCitaSolicitudInvalidez' : function(body, solicitudId, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitud/{solicitudId}/cita',
                                                    { 'solicitudId':solicitudId   }),
                                         body, undefined, showSpin)
                },
                'setCitaSolicitudInvalidez' : function(body, solicitudId, citaId, showSpin){
                    return httpData['put'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitud/{solicitudId}/cita/{citaId}',
                                                    { 'solicitudId':solicitudId  ,'citaId':citaId   }),
                                         body, undefined, showSpin)
                },
                'listCitaSolicitudInvalidez' : function(solicitudId, tamano, pagina, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitud/{solicitudId}/citas?tamano={tamano}&pagina={pagina}',
                                                    { 'solicitudId':solicitudId  ,'tamano':  { value: tamano, defaultValue:'20' } ,'pagina':  { value: pagina, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'getCitaSolicitudInvalidez' : function(solicitudId, citaId, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitud/{solicitudId}/cita/{citaId}',
                                                    { 'solicitudId':solicitudId  ,'citaId':citaId   }),
                                         undefined, undefined, showSpin)
                },
                'newAuditoria' : function(body, solicitudId, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitud/{solicitudId}/auditoria',
                                                    { 'solicitudId':solicitudId   }),
                                         body, undefined, showSpin)
                },
                'setAuditoria' : function(body, solicitudId, auditoriaId, showSpin){
                    return httpData['put'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitud/{solicitudId}/auditoria/{auditoriaId}',
                                                    { 'solicitudId':solicitudId  ,'auditoriaId':auditoriaId   }),
                                         body, undefined, showSpin)
                },
                'listAuditorias' : function(solicitudId, tamano, pagina, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitud/{solicitudId}/auditorias?tamano={tamano}&pagina={pagina}',
                                                    { 'solicitudId':solicitudId  ,'tamano':  { value: tamano, defaultValue:'20' } ,'pagina':  { value: pagina, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'getAuditoria' : function(solicitudId, auditoriaId, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitud/{solicitudId}/auditoria/{auditoriaId}',
                                                    { 'solicitudId':solicitudId  ,'auditoriaId':auditoriaId   }),
                                         undefined, undefined, showSpin)
                },
                'listExamenesAuditoria' : function(solicitudId, auditoriaId, tamano, pagina, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitud/{solicitudId}/auditoria/{auditoriaId}/examenes?tamano={tamano}&pagina={pagina}',
                                                    { 'solicitudId':solicitudId  ,'auditoriaId':auditoriaId  ,'tamano':  { value: tamano, defaultValue:'20' } ,'pagina':  { value: pagina, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'newExamenAuditoria' : function(body, solicitudId, auditoriaId, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitud/{solicitudId}/auditoria/{auditoriaId}/examen',
                                                    { 'solicitudId':solicitudId  ,'auditoriaId':auditoriaId   }),
                                         body, undefined, showSpin)
                },
                'setExamenAuditoria' : function(body, solicitudId, auditoriaId, numeroItemId, showSpin){
                    return httpData['put'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitud/{solicitudId}/auditoria/{auditoriaId}/examen/{numeroItemId}',
                                                    { 'solicitudId':solicitudId  ,'auditoriaId':auditoriaId  ,'numeroItemId':numeroItemId   }),
                                         body, undefined, showSpin)
                },
                'eliminarExamen' : function(solicitudId, auditoriaId, numeroItemId, showSpin){
                    return httpData['delete'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitud/{solicitudId}/auditoria/{auditoriaId}/examen/{numeroItemId}',
                                                    { 'solicitudId':solicitudId  ,'auditoriaId':auditoriaId  ,'numeroItemId':numeroItemId   }),
                                         undefined, undefined, showSpin)
                },
                'listDictamenes' : function(solicitudId, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitud/{solicitudId}/dictamenes',
                                                    { 'solicitudId':solicitudId   }),
                                         undefined, undefined, showSpin)
                },
                'getCarta' : function(solicitudId, citaId, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitud/{solicitudId}/cita/{citaId}/carta',
                                                    { 'solicitudId':solicitudId  ,'citaId':citaId   }),
                                         undefined, undefined, showSpin)
                },
                'newDocumento' : function(body, solicitudId, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitud/{solicitudId}/documentos',
                                                    { 'solicitudId':solicitudId   }),
                                         body, undefined, showSpin)
                },
                'listDocumentos' : function(solicitudId, tamano, pagina, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitud/{solicitudId}/documentos?tamano={tamano}&pagina={pagina}',
                                                    { 'solicitudId':solicitudId  ,'tamano':  { value: tamano, defaultValue:'20' } ,'pagina':  { value: pagina, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'setDocumento' : function(body, solicitudId, numeroItemId, showSpin){
                    return httpData['put'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitud/{solicitudId}/documentos/{numeroItemId}',
                                                    { 'solicitudId':solicitudId  ,'numeroItemId':numeroItemId   }),
                                         body, undefined, showSpin)
                },
                'descargarDocumentos' : function(solicitudId, numeroItemId, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitud/{solicitudId}/documentos/{numeroItemId}',
                                                    { 'solicitudId':solicitudId  ,'numeroItemId':numeroItemId   }),
                                         undefined, undefined, showSpin)
                },
                'eliminarDocumento' : function(solicitudId, numeroItemId, showSpin){
                    return httpData['delete'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitud/{solicitudId}/documentos/{numeroItemId}',
                                                    { 'solicitudId':solicitudId  ,'numeroItemId':numeroItemId   }),
                                         undefined, undefined, showSpin)
                },
                'newComentario' : function(body, solicitudId, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitud/{solicitudId}/comentarios',
                                                    { 'solicitudId':solicitudId   }),
                                         body, undefined, showSpin)
                },
                'SetComentario' : function(body, solicitudId, numeroItemId, showSpin){
                    return httpData['put'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitud/{solicitudId}/comentarios/{numeroItemId}',
                                                    { 'solicitudId':solicitudId  ,'numeroItemId':numeroItemId   }),
                                         body, undefined, showSpin)
                },
                'listComentarios' : function(solicitudId, tamano, pagina, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/solicitud/{solicitudId}/comentarios?tamano={tamano}&pagina={pagina}',
                                                    { 'solicitudId':solicitudId  ,'tamano':  { value: tamano, defaultValue:'20' } ,'pagina':  { value: pagina, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'ObservarAsegurado' : function(body, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + 'api/asegurado/observado',
                                         body, undefined, showSpin)
                },
                'SetObservarAsegurado' : function(body, showSpin){
                    return httpData['put'](oimProxySctrDenuncia.endpoint + 'api/asegurado/observado',
                                         body, undefined, showSpin)
                },
                'consultarPersona' : function(tipoDoc, numDoc, tipoConsulta, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/wsrConsultaEquifax/consultarPersona?tipoDoc={tipoDoc}&numDoc={numDoc}&tipoConsulta={tipoConsulta}',
                                                    { 'tipoDoc':tipoDoc  ,'numDoc':numDoc  ,'tipoConsulta':  { value: tipoConsulta, defaultValue:'4' }  }),
                                         undefined, undefined, showSpin)
                },
                'parametros' : function(opt, parametro1, parametro2, parametro3, tamano, pagina, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/parametros?opt={opt}&parametro1={parametro1}&parametro2={parametro2}&parametro3={parametro3}&tamano={tamano}&pagina={pagina}',
                                                    { 'opt':opt  ,'parametro1':  { value: parametro1, defaultValue:'' } ,'parametro2':  { value: parametro2, defaultValue:'' } ,'parametro3':  { value: parametro3, defaultValue:'' } ,'tamano':  { value: tamano, defaultValue:'20' } ,'pagina':  { value: pagina, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyLookupSctr", ['oimProxySctrDenuncia', 'httpData', function(oimProxySctrDenuncia, httpData){
        return {
                'GetLookups' : function(keys, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + 'api/lookup/several',
                                         keys, undefined, showSpin)
                },
                'ValidateToken' : function( showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + 'api/lookup/validateToken',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyBinnacle", ['oimProxySctrDenuncia', 'httpData', function(oimProxySctrDenuncia, httpData){
        return {
                'Get' : function(periodo, nroDenuncia, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/binnacle/all/{periodo}/{nroDenuncia}',
                                                    { 'periodo':periodo  ,'nroDenuncia':nroDenuncia   }),
                                         undefined, undefined, showSpin)
                },
                'Save' : function(value, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + 'api/binnacle/save',
                                         value, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyClinicCoverage", ['oimProxySctrDenuncia', 'httpData', function(oimProxySctrDenuncia, httpData){
        return {
                'GetClinic' : function(codigoDepartamento, codigoProvincia, codigoDistrito, nroPlan, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/clinic?codigoDepartamento={codigoDepartamento}&codigoProvincia={codigoProvincia}&codigoDistrito={codigoDistrito}&nroPlan={nroPlan}',
                                                    { 'codigoDepartamento':codigoDepartamento  ,'codigoProvincia':codigoProvincia  ,'codigoDistrito':codigoDistrito  ,'nroPlan':nroPlan   }),
                                         undefined, undefined, showSpin)
                },
                'GetCoverageByClinic' : function(codigoProveedor, numeroSucursalProveedor, nroPlan, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/coverage?codigoProveedor={codigoProveedor}&numeroSucursalProveedor={numeroSucursalProveedor}&nroPlan={nroPlan}',
                                                    { 'codigoProveedor':codigoProveedor  ,'numeroSucursalProveedor':numeroSucursalProveedor  ,'nroPlan':nroPlan   }),
                                         undefined, undefined, showSpin)
                },
                'GetCoverageClinic' : function(nroPlan, nroDocumento, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/clinic/coverage?nroPlan={nroPlan}&nroDocumento={nroDocumento}',
                                                    { 'nroPlan':nroPlan  ,'nroDocumento':nroDocumento   }),
                                         undefined, undefined, showSpin)
                },
                'SeekCompanyWithSpecialChar' : function(wildcard, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + 'api/seek/company/coverageSearch/wildcard',
                                         wildcard, undefined, showSpin)
                },
                'SeekClinic' : function(wildcard, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + 'api/seek/clinic/search/wildcard',
                                         wildcard, undefined, showSpin)
                },
                'getDetail' : function(nroPlan, codigorenipress, numeroPoliza, ruc, request, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/clinic/coverage/detail?nroPlan={nroPlan}&codigorenipress={codigorenipress}&numeroPoliza={numeroPoliza}&ruc={ruc}',
                                                    { 'nroPlan':nroPlan  ,'codigorenipress':codigorenipress  ,'numeroPoliza':numeroPoliza  ,'ruc':ruc   }),
                                         request, undefined, showSpin)
                },
                'GetPlan' : function(nroPlan, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/clinic/coverage/plan?nroPlan={nroPlan}',
                                                    { 'nroPlan':nroPlan   }),
                                         undefined, undefined, showSpin)
                },
                'getDetail1' : function(nroPlan, codigorenipress, numeroPoliza, ruc, request, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/clinic/coverage/detail1?nroPlan={nroPlan}&codigorenipress={codigorenipress}&numeroPoliza={numeroPoliza}&ruc={ruc}',
                                                    { 'nroPlan':nroPlan  ,'codigorenipress':codigorenipress  ,'numeroPoliza':numeroPoliza  ,'ruc':ruc   }),
                                         request, undefined, showSpin)
                },
                'getDetail2' : function(nroPlan, codigorenipress, numeroPoliza, ruc, request, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/clinic/coverage/detail2?nroPlan={nroPlan}&codigorenipress={codigorenipress}&numeroPoliza={numeroPoliza}&ruc={ruc}',
                                                    { 'nroPlan':nroPlan  ,'codigorenipress':codigorenipress  ,'numeroPoliza':numeroPoliza  ,'ruc':ruc   }),
                                         request, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyComplaint", ['oimProxySctrDenuncia', 'httpData', function(oimProxySctrDenuncia, httpData){
        return {
                'GetCompaintClient' : function(filter, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + 'api/complaint/search/client',
                                         filter, undefined, showSpin)
                },
                'Search' : function(filter, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + 'api/complaint/search',
                                         filter, undefined, showSpin)
                },
                'Get' : function(nroDenuncia, periodo, codigoAsegurado, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/complaint/{nroDenuncia}/{periodo}/{codigoAsegurado}',
                                                    { 'nroDenuncia':nroDenuncia  ,'periodo':periodo  ,'codigoAsegurado':codigoAsegurado   }),
                                         undefined, undefined, showSpin)
                },
                'GetTrack' : function(nroDenuncia, periodo, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/complaint/Track/{nroDenuncia}/{periodo}',
                                                    { 'nroDenuncia':nroDenuncia  ,'periodo':periodo   }),
                                         undefined, undefined, showSpin)
                },
                'donwload' : function(nroDenuncia, periodo, codigoAsegurado, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/complaint/download/{nroDenuncia}/{periodo}/{codigoAsegurado}',
                                                    { 'nroDenuncia':nroDenuncia  ,'periodo':periodo  ,'codigoAsegurado':codigoAsegurado   }),
                                         undefined, undefined, showSpin)
                },
                'AproveComplaint' : function(data, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + 'api/complaint/stateaprove',
                                         data, undefined, showSpin)
                },
                'RejectComplaint' : function(state, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + 'api/complaint/reject',
                                         state, undefined, showSpin)
                },
                'EndComplaint' : function(state, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + 'api/complaint/End',
                                         state, undefined, showSpin)
                },
                'RehabilitateComplaint' : function(state, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + 'api/complaint/Rehabilitate',
                                         state, undefined, showSpin)
                },
                'SeekBenefit' : function(benefit, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + 'api/complaint/seek/benefit',
                                         benefit, undefined, showSpin)
                },
                'AproveAttention' : function(state, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + 'api/complaint/attention/aprove',
                                         state, undefined, showSpin)
                },
                'RejectAttention' : function(state, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + 'api/complaint/attention/reject',
                                         state, undefined, showSpin)
                },
                'Register' : function(value, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + 'api/complaint/register',
                                         value, undefined, showSpin)
                },
                'RegisterProvisional' : function(value, showSpin){
                    return httpData['post'](oimProxySctrDenuncia.endpoint + 'api/complaint/registerprovisional',
                                         value, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyLocation", ['oimProxySctrDenuncia', 'httpData', function(oimProxySctrDenuncia, httpData){
        return {
                'GetLocation' : function(codeDepartament, codeprovince, showSpin){
                    return httpData['get'](oimProxySctrDenuncia.endpoint + helper.formatNamed('api/Location?codeDepartament={codeDepartament}&codeprovince={codeprovince}',
                                                    { 'codeDepartament':  { value: codeDepartament, defaultValue:'' } ,'codeprovince':  { value: codeprovince, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);
});
