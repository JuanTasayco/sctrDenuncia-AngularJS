/* eslint-disable */
(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants'], function(angular, constants){
    var module = angular.module("oim.proxyService.inspec", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxyInspec', {
        endpoint: constants.system.api.endpoints['inspec'],
        controllerSelfInspectionChannel: {
            actions : {
                'methodGetSelfInspectionRequest':{
                    name:  'GetSelfInspectionRequest',
                    path: 'api/autoInspeccion/solicitud/{autoInspeccionId}'
                },
                'methodDeleteSelfInspectionRequest':{
                    name:  'DeleteSelfInspectionRequest',
                    path: 'api/autoInspeccion/solicitud/{autoInspeccionId}'
                },
                'methodGetSelfInspectionRequests':{
                    name:  'GetSelfInspectionRequests',
                    path: 'api/autoInspeccion/solicitud?numeroSolicitud={numeroSolicitud}&fechaDesde={fechaDesde}&fechaHasta={fechaHasta}&numeroPagina={numeroPagina}&cantidadPorPagina={cantidadPorPagina}&limite={limite}&usuarioComercial={usuarioComercial}'
                },
                'methodSaveAutoinspeccion':{
                    name:  'SaveAutoinspeccion',
                    path: 'api/autoInspeccion/solicitud'
                },
                'methodUpdateAutoinspeccion':{
                    name:  'UpdateAutoinspeccion',
                    path: 'api/autoInspeccion/solicitud/{autoInspeccionId}'
                },
                'methodGetVehiculo':{
                    name:  'GetVehiculo',
                    path: 'api/autoInspeccion/solicitud/{autoInspeccionId}/vehiculos/{vehiculoId}'
                },
                'methodDeleteVehiculo':{
                    name:  'DeleteVehiculo',
                    path: 'api/autoInspeccion/solicitud/{autoInspeccionId}/vehiculos/{vehiculoId}'
                },
                'methodGetVehiculos':{
                    name:  'GetVehiculos',
                    path: 'api/autoInspeccion/solicitud/{autoInspeccionId}/vehiculos'
                },
                'methodSaveVehiculos':{
                    name:  'SaveVehiculos',
                    path: 'api/autoInspeccion/solicitud/{autoInspeccionId}/vehiculos'
                },
                'methodGetInforme':{
                    name:  'GetInforme',
                    path: 'api/autoInspeccion/solicitud/{autoInspeccionId}/obtieneInforme?tipo={tipo}'
                },
                'methodSendCorreo':{
                    name:  'SendCorreo',
                    path: 'api/autoInspeccion/solicitud/{autoInspeccionId}/envioEnlacePWACorreo'
                },
            }
        },
        controllerRequest: {
            actions : {
                'methodGetRequestsPrueba':{
                    name:  'GetRequestsPrueba',
                    path: 'api/request/search_prueba'
                },
                'methodGetRequests':{
                    name:  'GetRequests',
                    path: 'api/request/search'
                },
                'methodVoidRequest':{
                    name:  'VoidRequest',
                    path: 'api/request/void'
                },
                'methodUndoVoid':{
                    name:  'UndoVoid',
                    path: 'api/request/undo'
                },
                'methodGetRequestById':{
                    name:  'GetRequestById',
                    path: 'api/request/search/{requestId}/{riskId}'
                },
                'methodLoadExcel':{
                    name:  'LoadExcel',
                    path: 'api/request/excel'
                },
                'methodGetModelByName':{
                    name:  'GetModelByName',
                    path: 'api/request/model/{requesttype}'
                },
                'methodAddRequest':{
                    name:  'AddRequest',
                    path: 'api/request/add'
                },
                'methodRules':{
                    name:  'Rules',
                    path: 'api/request/rules'
                },
                'methodUpdateRequest':{
                    name:  'UpdateRequest',
                    path: 'api/request/update/contact'
                },
                'methodQuotationList':{
                    name:  'QuotationList',
                    path: 'api/request/quotation'
                },
                'methodQueryData':{
                    name:  'QueryData',
                    path: 'api/request/Result'
                },
                'methodQuotationListExtend':{
                    name:  'QuotationListExtend',
                    path: 'api/request/quotation/extend'
                },
                'methodChangeStatusAutoInspection':{
                    name:  'ChangeStatusAutoInspection',
                    path: 'api/request/update/valid/autoinspection'
                },
                'methodUpdateAgent':{
                    name:  'UpdateAgent',
                    path: 'api/request/update/agent'
                },
                'methodRehabilitateRequest':{
                    name:  'RehabilitateRequest',
                    path: 'api/request/rehabilitate/{requestId}/{riskId}'
                },
                'methodChangeStatusExpiredAutoInspection':{
                    name:  'ChangeStatusExpiredAutoInspection',
                    path: 'api/request/update/expired/autoinspection'
                },
                'methodUploadDocumentFromAnotherInsurer':{
                    name:  'UploadDocumentFromAnotherInsurer',
                    path: 'api/request/document/insurer'
                },
                'methodGetDocumentFromAnotherInsurer':{
                    name:  'GetDocumentFromAnotherInsurer',
                    path: 'api/request/document/{requestId}/{riskId}'
                },
                'methodGetDocumentFromAnotherInsurerSimple':{
                    name:  'GetDocumentFromAnotherInsurerSimple',
                    path: 'api/request/document-simple/{requestId}/{riskId}'
                },
                'methodGetDocumentFromAnotherInsurerDirectRead':{
                    name:  'GetDocumentFromAnotherInsurerDirectRead',
                    path: 'api/request/document-direct/{requestId}/{riskId}'
                },
                'methodGetDocumentFromSharedFolderAttachment':{
                    name:  'GetDocumentFromSharedFolderAttachment',
                    path: 'api/request/shared-access'
                },
                'methodDeleteDocumentFromAnotherInsurer':{
                    name:  'DeleteDocumentFromAnotherInsurer',
                    path: 'api/request/delete-document/{documentId}/{userName}/{documentType}'
                },
            }
        },
        controllerInspection: {
            actions : {
                'methodAddInspectionImage':{
                    name:  'AddInspectionImage',
                    path: 'api/inspection/Photo/Add'
                },
                'methodAddInspectionAppImage':{
                    name:  'AddInspectionAppImage',
                    path: 'api/inspection/PhotoApp/Add'
                },
                'methodAddInspectionAppImageV2':{
                    name:  'AddInspectionAppImageV2',
                    path: 'api/inspection/PhotoApp/AddV2'
                },
                'methodSaveInspection':{
                    name:  'SaveInspection',
                    path: 'api/inspection/Save'
                },
                'methodEndInspection':{
                    name:  'EndInspection',
                    path: 'api/inspection/End'
                },
                'methodGetInspectionByRiskId':{
                    name:  'GetInspectionByRiskId',
                    path: 'api/inspection/{riskid}'
                },
                'methodGetImagePath':{
                    name:  'GetImagePath',
                    path: 'api/inspection/image/{inspectionid}/{sequenceid}/{phototypeid}'
                },
                'methodDeletePhoto':{
                    name:  'DeletePhoto',
                    path: 'api/inspection/Photo/Delete'
                },
                'methodSingleInspection':{
                    name:  'SingleInspection',
                    path: 'api/inspection/Start'
                },
                'methodShowImage':{
                    name:  'ShowImage',
                    path: 'api/inspection/Photo/Show'
                },
                'methodGetPhotosByInspectionId':{
                    name:  'GetPhotosByInspectionId',
                    path: 'api/inspection/Photos/{inspectionId}'
                },
                'methodAddObservationInInspectionImage':{
                    name:  'AddObservationInInspectionImage',
                    path: 'api/inspection/Photo/addobservation'
                },
                'methodGetObservationsInInspectionImage':{
                    name:  'GetObservationsInInspectionImage',
                    path: 'api/inspection/Photo/observations/{inspectionId}'
                },
                'methodResolveObservation':{
                    name:  'ResolveObservation',
                    path: 'api/inspection/Photo/resolveobservation/{riskId}/{inspectionId}'
                },
            }
        },
        controllerReport: {
            actions : {
                'methodInspectionManagement':{
                    name:  'InspectionManagement',
                    path: 'api/report/management'
                },
                'methodDownloadManagement':{
                    name:  'DownloadManagement',
                    path: 'api/report/management/download'
                },
                'methodTimeManagement':{
                    name:  'TimeManagement',
                    path: 'api/report/time'
                },
                'methodDownloadTimeManagement':{
                    name:  'DownloadTimeManagement',
                    path: 'api/report/time/download'
                },
                'methodManagementByDepartments':{
                    name:  'ManagementByDepartments',
                    path: 'api/report/departments/summary'
                },
                'methodDownloadManagementByDepartments':{
                    name:  'DownloadManagementByDepartments',
                    path: 'api/report/departments/download/summary'
                },
                'methodManagementByDepartmentsDetails':{
                    name:  'ManagementByDepartmentsDetails',
                    path: 'api/report/departments/details'
                },
                'methodDownloadManagementByDepartmentsdetails':{
                    name:  'DownloadManagementByDepartmentsdetails',
                    path: 'api/report/departments/download/details'
                },
                'methodReportAlerts':{
                    name:  'ReportAlerts',
                    path: 'api/report/alerts'
                },
                'methodVehicleDetails':{
                    name:  'VehicleDetails',
                    path: 'api/report/vehicle'
                },
                'methodTrackingReport':{
                    name:  'TrackingReport',
                    path: 'api/report/tracking'
                },
                'methodDownloadResumen':{
                    name:  'DownloadResumen',
                    path: 'api/report/summary'
                },
                'methodResumePDF':{
                    name:  'ResumePDF',
                    path: 'api/report/resume/{riskid}/{inspectionid}'
                },
                'methodReporteInspeccionAuto':{
                    name:  'ReporteInspeccionAuto',
                    path: 'api/report/resume/file/{numeroRiesgo}/{numeroInspeccion}'
                },
                'methodPdfBytesFromHtml':{
                    name:  'PdfBytesFromHtml',
                    path: 'api/Report?savepath={savepath}&html={html}'
                },
                'methodMergePdfFiles':{
                    name:  'MergePdfFiles',
                    path: 'api/Report?outputPdf={outputPdf}'
                },
            }
        },
        controllerManagement: {
            actions : {
                'methodTotalLostBulkUpload':{
                    name:  'TotalLostBulkUpload',
                    path: 'api/admin/totalLost/bulk'
                },
                'methodTotalLostPagination':{
                    name:  'TotalLostPagination',
                    path: 'api/admin/totalLostPagination'
                },
                'methodTotalLostSearch':{
                    name:  'TotalLostSearch',
                    path: 'api/admin/totalLostparams/{search}'
                },
                'methodAutomasBulkUpload':{
                    name:  'AutomasBulkUpload',
                    path: 'api/admin/automas/bulk'
                },
                'methodAutomasList':{
                    name:  'AutomasList',
                    path: 'api/admin/automas/list'
                },
                'methodAutomasFilters':{
                    name:  'AutomasFilters',
                    path: 'api/admin/automas/filters'
                },
                'methodAutomasSearch':{
                    name:  'AutomasSearch',
                    path: 'api/admin/automas/search/{brand}/{model}'
                },
                'methodAutomasMongoSearchByName':{
                    name:  'AutomasMongoSearchByName',
                    path: 'api/admin/automas/mongobyname/{brand}/{model}/{pagesize}/{pageindex}'
                },
                'methodAutomasMongoSearch':{
                    name:  'AutomasMongoSearch',
                    path: 'api/admin/automas/mongo/{brandid}/{modelid}/{pagesize}/{pageindex}'
                },
                'methodAutomasMongoFilters':{
                    name:  'AutomasMongoFilters',
                    path: 'api/admin/automas/mongo/filters'
                },
                'methodAutomasMongoBrandFilter':{
                    name:  'AutomasMongoBrandFilter',
                    path: 'api/admin/automas/mongo/brand/{brandid}'
                },
                'methodAutomasSearchDetail':{
                    name:  'AutomasSearchDetail',
                    path: 'api/admin/automas/search/detail/{brandid}/{modelid}'
                },
                'methodAddParameterGroup':{
                    name:  'AddParameterGroup',
                    path: 'api/admin/parameter/group/add'
                },
                'methodUpdateParameterGroup':{
                    name:  'UpdateParameterGroup',
                    path: 'api/admin/parameter/group/update'
                },
                'methodAddParameterDetail':{
                    name:  'AddParameterDetail',
                    path: 'api/admin/parameter/detail/add'
                },
                'methodUpdateParameterDetail':{
                    name:  'UpdateParameterDetail',
                    path: 'api/admin/parameter/detail/update'
                },
                'methodSearchParameterGroup':{
                    name:  'SearchParameterGroup',
                    path: 'api/admin/parameter/group/search/{pagesize}/{pagenumber}/{description}'
                },
                'methodSearchParameterDetail':{
                    name:  'SearchParameterDetail',
                    path: 'api/admin/parameter/detail/search/{groupid}/{description}'
                },
                'methodAssignRulesSearch':{
                    name:  'AssignRulesSearch',
                    path: 'api/admin/rules/search'
                },
                'methodAddAssignRule':{
                    name:  'AddAssignRule',
                    path: 'api/admin/rules/add'
                },
                'methodUpdAssignRule':{
                    name:  'UpdAssignRule',
                    path: 'api/admin/rules/update'
                },
                'methodAddCoordinator':{
                    name:  'AddCoordinator',
                    path: 'api/admin/coordinator/add'
                },
                'methodUpdateCoordinator':{
                    name:  'UpdateCoordinator',
                    path: 'api/admin/coordinator/Update'
                },
                'methodCoordinatorSearch':{
                    name:  'CoordinatorSearch',
                    path: 'api/admin/coordinator/search'
                },
                'methodAddInspector':{
                    name:  'AddInspector',
                    path: 'api/admin/inspector/add'
                },
                'methodUpdateInspector':{
                    name:  'UpdateInspector',
                    path: 'api/admin/inspector/update'
                },
                'methodInspectorSearch':{
                    name:  'InspectorSearch',
                    path: 'api/admin/inspector/search'
                },
                'methodGetInspectorByRequestID':{
                    name:  'GetInspectorByRequestID',
                    path: 'api/admin/inspector/get/{requestId}'
                },
                'methodAddSubscriptor':{
                    name:  'AddSubscriptor',
                    path: 'api/admin/subscriptor/add'
                },
                'methodUpdateSubscriptor':{
                    name:  'UpdateSubscriptor',
                    path: 'api/admin/subscriptor/update'
                },
                'methodSubscriptorSearch':{
                    name:  'SubscriptorSearch',
                    path: 'api/admin/subscriptor/search'
                },
                'methodProviderSearch':{
                    name:  'ProviderSearch',
                    path: 'api/admin/providers'
                },
                'methodProviderSearchTron':{
                    name:  'ProviderSearchTron',
                    path: 'api/admin/providers/tron'
                },
                'methodAddProvider':{
                    name:  'AddProvider',
                    path: 'api/admin/providers/add'
                },
                'methodDeleteProvider':{
                    name:  'DeleteProvider',
                    path: 'api/admin/providers/del'
                },
                'methodGetEmitInfoByRequestID':{
                    name:  'GetEmitInfoByRequestID',
                    path: 'api/admin/quotation/get/{requestId}'
                },
            }
        },
        controllerSchedule: {
            actions : {
                'methodGetSchedule':{
                    name:  'GetSchedule',
                    path: 'api/schedule/search'
                },
                'methodGetInspectorsAvailability':{
                    name:  'GetInspectorsAvailability',
                    path: 'api/schedule/calendar'
                },
                'methodAddSchedule':{
                    name:  'AddSchedule',
                    path: 'api/schedule/add'
                },
                'methodAddJournal':{
                    name:  'AddJournal',
                    path: 'api/schedule/add/permission'
                },
                'methodUpdateJournal':{
                    name:  'UpdateJournal',
                    path: 'api/schedule/update/permission'
                },
                'methodDeleteJournal':{
                    name:  'DeleteJournal',
                    path: 'api/schedule/delete/permission'
                },
                'methodListPermission':{
                    name:  'ListPermission',
                    path: 'api/schedule/list/permission'
                },
            }
        },
        controllerSelfInspection: {
            actions : {
                'methodVerifyRules':{
                    name:  'VerifyRules',
                    path: 'api/selfinspection/rule/verify'
                },
                'methodVerifyVehicleRules':{
                    name:  'VerifyVehicleRules',
                    path: 'api/selfinspection/rule/verifyVehicle'
                },
                'methodGetInfoCarByLicensePlate':{
                    name:  'GetInfoCarByLicensePlate',
                    path: 'api/selfinspection/vehicle?licensePlate={licensePlate}'
                },
                'methodGetPersonInfoByDocument':{
                    name:  'GetPersonInfoByDocument',
                    path: 'api/selfinspection/person?documentType={documentType}&documentNumber={documentNumber}'
                },
                'methodGetInfoByLicensePlate2':{
                    name:  'GetInfoByLicensePlate2',
                    path: 'api/selfinspection/vehicleinfo?licensePlate={licensePlate}'
                },
                'methodGetAgents':{
                    name:  'GetAgents',
                    path: 'api/selfinspection/agent?territorialStructureId={territorialStructureId}&executiveId={executiveId}&agent={agent}'
                },
                'methodGetTerritorialStructure':{
                    name:  'GetTerritorialStructure',
                    path: 'api/selfinspection/territorialStructure?territorialStructure={territorialStructure}&executiveId={executiveId}&agentId={agentId}'
                },
                'methodGetExecutives':{
                    name:  'GetExecutives',
                    path: 'api/selfinspection/executive?territorialStructureId={territorialStructureId}&executive={executive}&agentId={agentId}'
                },
                'methodGetPagination':{
                    name:  'GetPagination',
                    path: 'api/selfinspection/agent/getPagination?agentId={agentId}&territorialStructureId={territorialStructureId}&executiveId={executiveId}&pageNum={pageNum}&pageSize={pageSize}&sortingType={sortingType}'
                },
                'methodSynchronizeAgents':{
                    name:  'SynchronizeAgents',
                    path: 'api/selfinspection/agent/synchronize'
                },
                'methodEnableAgent':{
                    name:  'EnableAgent',
                    path: 'api/selfinspection/agent/enable'
                },
                'methodNotifySelefinspection':{
                    name:  'NotifySelefinspection',
                    path: 'api/selfinspection/notifyselfinspection'
                },
            }
        },
        controllerCommon: {
            actions : {
                'methodGetTerritorialStructure':{
                    name:  'GetTerritorialStructure',
                    path: 'api/common/territorialstructure?name={name}&executiveId={executiveId}&agentId={agentId}'
                },
                'methodGetExecutive':{
                    name:  'GetExecutive',
                    path: 'api/common/executive?name={name}&territorialStructureId={territorialStructureId}&agentId={agentId}'
                },
                'methodGetAgent':{
                    name:  'GetAgent',
                    path: 'api/common/agent?name={name}&territorialStructureId={territorialStructureId}&executiveId={executiveId}'
                },
                'methodGetLocation':{
                    name:  'GetLocation',
                    path: 'api/common/location/{place}'
                },
                'methodGetProviders':{
                    name:  'GetProviders',
                    path: 'api/common/provider?name={name}'
                },
                'methodGetProviders':{
                    name:  'GetProviders',
                    path: 'api/common/provider/{name}'
                },
                'methodGetStatusSchedule':{
                    name:  'GetStatusSchedule',
                    path: 'api/common/Status/Schedule'
                },
                'methodGetState':{
                    name:  'GetState',
                    path: 'api/common/Status'
                },
                'methodGetInspectionType':{
                    name:  'GetInspectionType',
                    path: 'api/common/InspectionType'
                },
                'methodGetRequestType':{
                    name:  'GetRequestType',
                    path: 'api/common/RequestType'
                },
                'methodGetUsersStatus':{
                    name:  'GetUsersStatus',
                    path: 'api/common/UserType/Status'
                },
                'methodGetFrustrateType':{
                    name:  'GetFrustrateType',
                    path: 'api/common/FrustrateType'
                },
                'methodGetPermission':{
                    name:  'GetPermission',
                    path: 'api/common/Journal/Permission'
                },
                'methodGetInspectorSchedule':{
                    name:  'GetInspectorSchedule',
                    path: 'api/common/Inspector/Schedule?providerDocumentType={providerDocumentType}&providerDocument={providerDocument}'
                },
                'methodGetPhotoType':{
                    name:  'GetPhotoType',
                    path: 'api/common/Photo'
                },
                'methodGetWheelDrive':{
                    name:  'GetWheelDrive',
                    path: 'api/common/WheelDrive'
                },
                'methodGetVehicleOrigin':{
                    name:  'GetVehicleOrigin',
                    path: 'api/common/Vehicle/Origin'
                },
                'methodGetStereoTron':{
                    name:  'GetStereoTron',
                    path: 'api/common/Vehicle/Stereo/Tron/{vehicletype}'
                },
                'methodGetStereo':{
                    name:  'GetStereo',
                    path: 'api/common/Vehicle/Stereo'
                },
                'methodGetAccesories':{
                    name:  'GetAccesories',
                    path: 'api/common/Vehicle/Accesories'
                },
                'methodGetVehicleStatus':{
                    name:  'GetVehicleStatus',
                    path: 'api/common/Vehicle/Condition'
                },
                'methodGetSteeringWheel':{
                    name:  'GetSteeringWheel',
                    path: 'api/common/Vehicle/Steeringwheel'
                },
                'methodGetAgentById':{
                    name:  'GetAgentById',
                    path: 'api/common/Agent/{agentid}'
                },
                'methodGetFieldsAvailable':{
                    name:  'GetFieldsAvailable',
                    path: 'api/common/fieldsAvailable'
                },
                'methodGetPhotoTypeByVehicleTypeAndDeviceType':{
                    name:  'GetPhotoTypeByVehicleTypeAndDeviceType',
                    path: 'api/common/Vehicle/PhotoTypes/{vehicleType}/{deviceType}'
                },
                'methodGetPhotoTypeSimpleByVehicleTypeAndDeviceType':{
                    name:  'GetPhotoTypeSimpleByVehicleTypeAndDeviceType',
                    path: 'api/common/Vehicle/PhotoTypes-simple/{vehicleType}/{deviceType}'
                },
                'methodGetInsurers':{
                    name:  'GetInsurers',
                    path: 'api/common/insurers'
                },
            }
        },
        controllerAlerts: {
            actions : {
                'methodAddAlert':{
                    name:  'AddAlert',
                    path: 'api/alerts/add'
                },
                'methodAddAlertFleet':{
                    name:  'AddAlertFleet',
                    path: 'api/alerts/add/fleet'
                },
                'methodResponseAlert':{
                    name:  'ResponseAlert',
                    path: 'api/alerts/response'
                },
                'methodNotifyUser':{
                    name:  'NotifyUser',
                    path: 'api/alerts/notify'
                },
                'methodGetAlerts':{
                    name:  'GetAlerts',
                    path: 'api/alerts/list/{riskid}?alertid={alertid}&roleuser={roleuser}&alerttype={alerttype}'
                },
                'methodGetFleetForAlerts':{
                    name:  'GetFleetForAlerts',
                    path: 'api/alerts/list/fleet/{requestId}'
                },
                'methodNotifyEvaluatorSelfInspectionInEvaluation':{
                    name:  'NotifyEvaluatorSelfInspectionInEvaluation',
                    path: 'api/alerts/notifyevaluator'
                },
            }
        }
    })



     module.factory("proxySelfInspectionChannel", ['oimProxyInspec', 'httpData', function(oimProxyInspec, httpData){
        return {
                'GetSelfInspectionRequest' : function(autoInspeccionId, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/autoInspeccion/solicitud/{autoInspeccionId}',
                                                    { 'autoInspeccionId':  { value: autoInspeccionId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'DeleteSelfInspectionRequest' : function(autoInspeccionId, showSpin){
                    return httpData['delete'](oimProxyInspec.endpoint + helper.formatNamed('api/autoInspeccion/solicitud/{autoInspeccionId}',
                                                    { 'autoInspeccionId':  { value: autoInspeccionId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetSelfInspectionRequests' : function(request, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + 'api/autoInspeccion/solicitud?numeroSolicitud={numeroSolicitud}&fechaDesde={fechaDesde}&fechaHasta={fechaHasta}&numeroPagina={numeroPagina}&cantidadPorPagina={cantidadPorPagina}&limite={limite}&usuarioComercial={usuarioComercial}',
                                         request, undefined, showSpin)
                },
                'SaveAutoinspeccion' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/autoInspeccion/solicitud',
                                         request, undefined, showSpin)
                },
                'UpdateAutoinspeccion' : function(autoInspeccionId, request, showSpin){
                    return httpData['put'](oimProxyInspec.endpoint + helper.formatNamed('api/autoInspeccion/solicitud/{autoInspeccionId}',
                                                    { 'autoInspeccionId':  { value: autoInspeccionId, defaultValue:'' }  }),
                                         request, undefined, showSpin)
                },
                'GetVehiculo' : function(autoInspeccionId, vehiculoId, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/autoInspeccion/solicitud/{autoInspeccionId}/vehiculos/{vehiculoId}',
                                                    { 'autoInspeccionId':  { value: autoInspeccionId, defaultValue:'' } ,'vehiculoId':  { value: vehiculoId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'DeleteVehiculo' : function(autoInspeccionId, vehiculoId, showSpin){
                    return httpData['delete'](oimProxyInspec.endpoint + helper.formatNamed('api/autoInspeccion/solicitud/{autoInspeccionId}/vehiculos/{vehiculoId}',
                                                    { 'autoInspeccionId':  { value: autoInspeccionId, defaultValue:'' } ,'vehiculoId':  { value: vehiculoId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetVehiculos' : function(autoInspeccionId, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/autoInspeccion/solicitud/{autoInspeccionId}/vehiculos',
                                                    { 'autoInspeccionId':  { value: autoInspeccionId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'SaveVehiculos' : function(autoInspeccionId, request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + helper.formatNamed('api/autoInspeccion/solicitud/{autoInspeccionId}/vehiculos',
                                                    { 'autoInspeccionId':  { value: autoInspeccionId, defaultValue:'' }  }),
                                         request, undefined, showSpin)
                },
                'GetInforme' : function(autoInspeccionId, tipo, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/autoInspeccion/solicitud/{autoInspeccionId}/obtieneInforme?tipo={tipo}',
                                                    { 'autoInspeccionId':  { value: autoInspeccionId, defaultValue:'' } ,'tipo':  { value: tipo, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'SendCorreo' : function(autoInspeccionId, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + helper.formatNamed('api/autoInspeccion/solicitud/{autoInspeccionId}/envioEnlacePWACorreo',
                                                    { 'autoInspeccionId':  { value: autoInspeccionId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyRequest", ['oimProxyInspec', 'httpData', function(oimProxyInspec, httpData){
        return {
                'GetRequestsPrueba' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/request/search_prueba',
                                         request, undefined, showSpin)
                },
                'GetRequests' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/request/search',
                                         request, undefined, showSpin)
                },
                'VoidRequest' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/request/void',
                                         request, undefined, showSpin)
                },
                'UndoVoid' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/request/undo',
                                         request, undefined, showSpin)
                },
                'GetRequestById' : function(requestId, riskId, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/request/search/{requestId}/{riskId}',
                                                    { 'requestId':  { value: requestId, defaultValue:'' } ,'riskId':  { value: riskId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'LoadExcel' : function( showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/request/excel',
                                         undefined, undefined, showSpin)
                },
                'GetModelByName' : function(requesttype, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/request/model/{requesttype}',
                                                    { 'requesttype':  { value: requesttype, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'AddRequest' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/request/add',
                                         request, undefined, showSpin)
                },
                'Rules' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/request/rules',
                                         request, undefined, showSpin)
                },
                'UpdateRequest' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/request/update/contact',
                                         request, undefined, showSpin)
                },
                'QuotationList' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/request/quotation',
                                         request, undefined, showSpin)
                },
                'QueryData' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/request/Result',
                                         request, undefined, showSpin)
                },
                'QuotationListExtend' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/request/quotation/extend',
                                         request, undefined, showSpin)
                },
                'ChangeStatusAutoInspection' : function( showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + 'api/request/update/valid/autoinspection',
                                         undefined, undefined, showSpin)
                },
                'UpdateAgent' : function(entity, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/request/update/agent',
                                         entity, undefined, showSpin)
                },
                'RehabilitateRequest' : function(requestId, riskId, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/request/rehabilitate/{requestId}/{riskId}',
                                                    { 'requestId':  { value: requestId, defaultValue:'' } ,'riskId':  { value: riskId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ChangeStatusExpiredAutoInspection' : function( showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + 'api/request/update/expired/autoinspection',
                                         undefined, undefined, showSpin)
                },
                'UploadDocumentFromAnotherInsurer' : function(model, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/request/document/insurer',
                                         model, undefined, showSpin)
                },
                'GetDocumentFromAnotherInsurer' : function(requestId, riskId, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/request/document/{requestId}/{riskId}',
                                                    { 'requestId':  { value: requestId, defaultValue:'' } ,'riskId':  { value: riskId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetDocumentFromAnotherInsurerSimple' : function(requestId, riskId, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/request/document-simple/{requestId}/{riskId}',
                                                    { 'requestId':  { value: requestId, defaultValue:'' } ,'riskId':  { value: riskId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetDocumentFromAnotherInsurerDirectRead' : function(requestId, riskId, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/request/document-direct/{requestId}/{riskId}',
                                                    { 'requestId':  { value: requestId, defaultValue:'' } ,'riskId':  { value: riskId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetDocumentFromSharedFolderAttachment' : function( showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + 'api/request/shared-access',
                                         undefined, undefined, showSpin)
                },
                'DeleteDocumentFromAnotherInsurer' : function(documentId, userName, documentType, showSpin){
                    return httpData['delete'](oimProxyInspec.endpoint + helper.formatNamed('api/request/delete-document/{documentId}/{userName}/{documentType}',
                                                    { 'documentId':  { value: documentId, defaultValue:'' } ,'userName':  { value: userName, defaultValue:'' } ,'documentType':  { value: documentType, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyInspection", ['oimProxyInspec', 'httpData', function(oimProxyInspec, httpData){
        return {
                'AddInspectionImage' : function( showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/inspection/Photo/Add',
                                         undefined, undefined, showSpin)
                },
                'AddInspectionAppImage' : function( showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/inspection/PhotoApp/Add',
                                         undefined, undefined, showSpin)
                },
                'AddInspectionAppImageV2' : function( showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/inspection/PhotoApp/AddV2',
                                         undefined, undefined, showSpin)
                },
                'SaveInspection' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/inspection/Save',
                                         request, undefined, showSpin)
                },
                'EndInspection' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/inspection/End',
                                         request, undefined, showSpin)
                },
                'GetInspectionByRiskId' : function(riskid, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/inspection/{riskid}',
                                                    { 'riskid':  { value: riskid, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetImagePath' : function(inspectionid, sequenceid, phototypeid, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/inspection/image/{inspectionid}/{sequenceid}/{phototypeid}',
                                                    { 'inspectionid':  { value: inspectionid, defaultValue:'' } ,'sequenceid':  { value: sequenceid, defaultValue:'' } ,'phototypeid':  { value: phototypeid, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'DeletePhoto' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/inspection/Photo/Delete',
                                         request, undefined, showSpin)
                },
                'SingleInspection' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/inspection/Start',
                                         request, undefined, showSpin)
                },
                'ShowImage' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/inspection/Photo/Show',
                                         request, undefined, showSpin)
                },
                'GetPhotosByInspectionId' : function(inspectionId, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/inspection/Photos/{inspectionId}',
                                                    { 'inspectionId':  { value: inspectionId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'AddObservationInInspectionImage' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/inspection/Photo/addobservation',
                                         request, undefined, showSpin)
                },
                'GetObservationsInInspectionImage' : function(inspectionId, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/inspection/Photo/observations/{inspectionId}',
                                                    { 'inspectionId':  { value: inspectionId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ResolveObservation' : function(riskId, inspectionId, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + helper.formatNamed('api/inspection/Photo/resolveobservation/{riskId}/{inspectionId}',
                                                    { 'riskId':  { value: riskId, defaultValue:'' } ,'inspectionId':  { value: inspectionId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyReport", ['oimProxyInspec', 'httpData', function(oimProxyInspec, httpData){
        return {
                'InspectionManagement' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/report/management',
                                         request, undefined, showSpin)
                },
                'DownloadManagement' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/report/management/download',
                                         request, undefined, showSpin)
                },
                'TimeManagement' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/report/time',
                                         request, undefined, showSpin)
                },
                'DownloadTimeManagement' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/report/time/download',
                                         request, undefined, showSpin)
                },
                'ManagementByDepartments' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/report/departments/summary',
                                         request, undefined, showSpin)
                },
                'DownloadManagementByDepartments' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/report/departments/download/summary',
                                         request, undefined, showSpin)
                },
                'ManagementByDepartmentsDetails' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/report/departments/details',
                                         request, undefined, showSpin)
                },
                'DownloadManagementByDepartmentsdetails' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/report/departments/download/details',
                                         request, undefined, showSpin)
                },
                'ReportAlerts' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/report/alerts',
                                         request, undefined, showSpin)
                },
                'VehicleDetails' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/report/vehicle',
                                         request, undefined, showSpin)
                },
                'TrackingReport' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/report/tracking',
                                         request, undefined, showSpin)
                },
                'DownloadResumen' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/report/summary',
                                         request, undefined, showSpin)
                },
                'ResumePDF' : function(riskid, inspectionid, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/report/resume/{riskid}/{inspectionid}',
                                                    { 'riskid':  { value: riskid, defaultValue:'' } ,'inspectionid':  { value: inspectionid, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ReporteInspeccionAuto' : function(numeroRiesgo, numeroInspeccion, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/report/resume/file/{numeroRiesgo}/{numeroInspeccion}',
                                                    { 'numeroRiesgo':  { value: numeroRiesgo, defaultValue:'' } ,'numeroInspeccion':  { value: numeroInspeccion, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'PdfBytesFromHtml' : function(savepath, html, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + helper.formatNamed('api/Report?savepath={savepath}&html={html}',
                                                    { 'savepath':  { value: savepath, defaultValue:'' } ,'html':  { value: html, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'MergePdfFiles' : function(outputPdf, sourcePdfs, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + helper.formatNamed('api/Report?outputPdf={outputPdf}',
                                                    { 'outputPdf':  { value: outputPdf, defaultValue:'' }  }),
                                         sourcePdfs, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyManagement", ['oimProxyInspec', 'httpData', function(oimProxyInspec, httpData){
        return {
                'TotalLostBulkUpload' : function( showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/totalLost/bulk',
                                         undefined, undefined, showSpin)
                },
                'TotalLostPagination' : function(paginate, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/totalLostPagination',
                                         paginate, undefined, showSpin)
                },
                'TotalLostSearch' : function(search, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/admin/totalLostparams/{search}',
                                                    { 'search':  { value: search, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'AutomasBulkUpload' : function( showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/automas/bulk',
                                         undefined, undefined, showSpin)
                },
                'AutomasList' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/automas/list',
                                         request, undefined, showSpin)
                },
                'AutomasFilters' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/automas/filters',
                                         request, undefined, showSpin)
                },
                'AutomasSearch' : function(brand, model, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/admin/automas/search/{brand}/{model}',
                                                    { 'brand':  { value: brand, defaultValue:'' } ,'model':  { value: model, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'AutomasMongoSearchByName' : function(brand, model, pagesize, pageindex, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/admin/automas/mongobyname/{brand}/{model}/{pagesize}/{pageindex}',
                                                    { 'brand':  { value: brand, defaultValue:'' } ,'model':  { value: model, defaultValue:'' } ,'pagesize':  { value: pagesize, defaultValue:'10' } ,'pageindex':  { value: pageindex, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'AutomasMongoSearch' : function(brandid, modelid, pagesize, pageindex, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/admin/automas/mongo/{brandid}/{modelid}/{pagesize}/{pageindex}',
                                                    { 'brandid':  { value: brandid, defaultValue:'0' } ,'modelid':  { value: modelid, defaultValue:'0' } ,'pagesize':  { value: pagesize, defaultValue:'10' } ,'pageindex':  { value: pageindex, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'AutomasMongoFilters' : function( showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + 'api/admin/automas/mongo/filters',
                                         undefined, undefined, showSpin)
                },
                'AutomasMongoBrandFilter' : function(brandid, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/admin/automas/mongo/brand/{brandid}',
                                                    { 'brandid':  { value: brandid, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'AutomasSearchDetail' : function(brandid, modelid, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/admin/automas/search/detail/{brandid}/{modelid}',
                                                    { 'brandid':  { value: brandid, defaultValue:'' } ,'modelid':  { value: modelid, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'AddParameterGroup' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/parameter/group/add',
                                         request, undefined, showSpin)
                },
                'UpdateParameterGroup' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/parameter/group/update',
                                         request, undefined, showSpin)
                },
                'AddParameterDetail' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/parameter/detail/add',
                                         request, undefined, showSpin)
                },
                'UpdateParameterDetail' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/parameter/detail/update',
                                         request, undefined, showSpin)
                },
                'SearchParameterGroup' : function(pagesize, pagenumber, description, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/admin/parameter/group/search/{pagesize}/{pagenumber}/{description}',
                                                    { 'pagesize':  { value: pagesize, defaultValue:'10' } ,'pagenumber':  { value: pagenumber, defaultValue:'1' } ,'description':  { value: description, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'SearchParameterDetail' : function(groupid, description, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/admin/parameter/detail/search/{groupid}/{description}',
                                                    { 'groupid':  { value: groupid, defaultValue:'' } ,'description':  { value: description, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'AssignRulesSearch' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/rules/search',
                                         request, undefined, showSpin)
                },
                'AddAssignRule' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/rules/add',
                                         request, undefined, showSpin)
                },
                'UpdAssignRule' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/rules/update',
                                         request, undefined, showSpin)
                },
                'AddCoordinator' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/coordinator/add',
                                         request, undefined, showSpin)
                },
                'UpdateCoordinator' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/coordinator/Update',
                                         request, undefined, showSpin)
                },
                'CoordinatorSearch' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/coordinator/search',
                                         request, undefined, showSpin)
                },
                'AddInspector' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/inspector/add',
                                         request, undefined, showSpin)
                },
                'UpdateInspector' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/inspector/update',
                                         request, undefined, showSpin)
                },
                'InspectorSearch' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/inspector/search',
                                         request, undefined, showSpin)
                },
                'GetInspectorByRequestID' : function(requestId, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/admin/inspector/get/{requestId}',
                                                    { 'requestId':  { value: requestId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'AddSubscriptor' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/subscriptor/add',
                                         request, undefined, showSpin)
                },
                'UpdateSubscriptor' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/subscriptor/update',
                                         request, undefined, showSpin)
                },
                'SubscriptorSearch' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/subscriptor/search',
                                         request, undefined, showSpin)
                },
                'ProviderSearch' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/providers',
                                         request, undefined, showSpin)
                },
                'ProviderSearchTron' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/providers/tron',
                                         request, undefined, showSpin)
                },
                'AddProvider' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/providers/add',
                                         request, undefined, showSpin)
                },
                'DeleteProvider' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/admin/providers/del',
                                         request, undefined, showSpin)
                },
                'GetEmitInfoByRequestID' : function(requestId, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/admin/quotation/get/{requestId}',
                                                    { 'requestId':  { value: requestId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySchedule", ['oimProxyInspec', 'httpData', function(oimProxyInspec, httpData){
        return {
                'GetSchedule' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/schedule/search',
                                         request, undefined, showSpin)
                },
                'GetInspectorsAvailability' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/schedule/calendar',
                                         request, undefined, showSpin)
                },
                'AddSchedule' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/schedule/add',
                                         request, undefined, showSpin)
                },
                'AddJournal' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/schedule/add/permission',
                                         request, undefined, showSpin)
                },
                'UpdateJournal' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/schedule/update/permission',
                                         request, undefined, showSpin)
                },
                'DeleteJournal' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/schedule/delete/permission',
                                         request, undefined, showSpin)
                },
                'ListPermission' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/schedule/list/permission',
                                         request, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySelfInspection", ['oimProxyInspec', 'httpData', function(oimProxyInspec, httpData){
        return {
                'VerifyRules' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/selfinspection/rule/verify',
                                         request, undefined, showSpin)
                },
                'VerifyVehicleRules' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/selfinspection/rule/verifyVehicle',
                                         request, undefined, showSpin)
                },
                'GetInfoCarByLicensePlate' : function(licensePlate, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/selfinspection/vehicle?licensePlate={licensePlate}',
                                                    { 'licensePlate':  { value: licensePlate, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetPersonInfoByDocument' : function(documentType, documentNumber, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/selfinspection/person?documentType={documentType}&documentNumber={documentNumber}',
                                                    { 'documentType':  { value: documentType, defaultValue:'' } ,'documentNumber':  { value: documentNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetInfoByLicensePlate2' : function(licensePlate, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/selfinspection/vehicleinfo?licensePlate={licensePlate}',
                                                    { 'licensePlate':  { value: licensePlate, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetAgents' : function(territorialStructureId, executiveId, agent, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/selfinspection/agent?territorialStructureId={territorialStructureId}&executiveId={executiveId}&agent={agent}',
                                                    { 'territorialStructureId':  { value: territorialStructureId, defaultValue:'' } ,'executiveId':  { value: executiveId, defaultValue:'' } ,'agent':  { value: agent, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetTerritorialStructure' : function(territorialStructure, executiveId, agentId, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/selfinspection/territorialStructure?territorialStructure={territorialStructure}&executiveId={executiveId}&agentId={agentId}',
                                                    { 'territorialStructure':  { value: territorialStructure, defaultValue:'' } ,'executiveId':  { value: executiveId, defaultValue:'' } ,'agentId':  { value: agentId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetExecutives' : function(territorialStructureId, executive, agentId, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/selfinspection/executive?territorialStructureId={territorialStructureId}&executive={executive}&agentId={agentId}',
                                                    { 'territorialStructureId':  { value: territorialStructureId, defaultValue:'' } ,'executive':  { value: executive, defaultValue:'' } ,'agentId':  { value: agentId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetPagination' : function(agentId, territorialStructureId, executiveId, pageNum, pageSize, sortingType, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/selfinspection/agent/getPagination?agentId={agentId}&territorialStructureId={territorialStructureId}&executiveId={executiveId}&pageNum={pageNum}&pageSize={pageSize}&sortingType={sortingType}',
                                                    { 'agentId':  { value: agentId, defaultValue:'' } ,'territorialStructureId':  { value: territorialStructureId, defaultValue:'' } ,'executiveId':  { value: executiveId, defaultValue:'' } ,'pageNum':  { value: pageNum, defaultValue:'1' } ,'pageSize':  { value: pageSize, defaultValue:'10' } ,'sortingType':  { value: sortingType, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'SynchronizeAgents' : function( showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/selfinspection/agent/synchronize',
                                         undefined, undefined, showSpin)
                },
                'EnableAgent' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/selfinspection/agent/enable',
                                         request, undefined, showSpin)
                },
                'NotifySelefinspection' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/selfinspection/notifyselfinspection',
                                         request, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCommon", ['oimProxyInspec', 'httpData', function(oimProxyInspec, httpData){
        return {
                'GetTerritorialStructure' : function(name, executiveId, agentId, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/common/territorialstructure?name={name}&executiveId={executiveId}&agentId={agentId}',
                                                    { 'name':  { value: name, defaultValue:'' } ,'executiveId':  { value: executiveId, defaultValue:'' } ,'agentId':  { value: agentId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetExecutive' : function(name, territorialStructureId, agentId, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/common/executive?name={name}&territorialStructureId={territorialStructureId}&agentId={agentId}',
                                                    { 'name':  { value: name, defaultValue:'' } ,'territorialStructureId':  { value: territorialStructureId, defaultValue:'' } ,'agentId':  { value: agentId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetAgent' : function(name, territorialStructureId, executiveId, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/common/agent?name={name}&territorialStructureId={territorialStructureId}&executiveId={executiveId}',
                                                    { 'name':  { value: name, defaultValue:'' } ,'territorialStructureId':  { value: territorialStructureId, defaultValue:'' } ,'executiveId':  { value: executiveId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetLocation' : function(place, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/common/location/{place}',
                                                    { 'place':  { value: place, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetProviders' : function(name, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/common/provider?name={name}',
                                                    { 'name':  { value: name, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetProviders' : function(name, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/common/provider/{name}',
                                                    { 'name':  { value: name, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetStatusSchedule' : function( showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + 'api/common/Status/Schedule',
                                         undefined, undefined, showSpin)
                },
                'GetState' : function( showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + 'api/common/Status',
                                         undefined, undefined, showSpin)
                },
                'GetInspectionType' : function( showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + 'api/common/InspectionType',
                                         undefined, undefined, showSpin)
                },
                'GetRequestType' : function( showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + 'api/common/RequestType',
                                         undefined, undefined, showSpin)
                },
                'GetUsersStatus' : function( showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + 'api/common/UserType/Status',
                                         undefined, undefined, showSpin)
                },
                'GetFrustrateType' : function( showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + 'api/common/FrustrateType',
                                         undefined, undefined, showSpin)
                },
                'GetPermission' : function( showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + 'api/common/Journal/Permission',
                                         undefined, undefined, showSpin)
                },
                'GetInspectorSchedule' : function(providerDocumentType, providerDocument, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/common/Inspector/Schedule?providerDocumentType={providerDocumentType}&providerDocument={providerDocument}',
                                                    { 'providerDocumentType':  { value: providerDocumentType, defaultValue:'' } ,'providerDocument':  { value: providerDocument, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetPhotoType' : function( showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + 'api/common/Photo',
                                         undefined, undefined, showSpin)
                },
                'GetWheelDrive' : function( showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + 'api/common/WheelDrive',
                                         undefined, undefined, showSpin)
                },
                'GetVehicleOrigin' : function( showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + 'api/common/Vehicle/Origin',
                                         undefined, undefined, showSpin)
                },
                'GetStereoTron' : function(vehicletype, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/common/Vehicle/Stereo/Tron/{vehicletype}',
                                                    { 'vehicletype':  { value: vehicletype, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetStereo' : function( showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + 'api/common/Vehicle/Stereo',
                                         undefined, undefined, showSpin)
                },
                'GetAccesories' : function( showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + 'api/common/Vehicle/Accesories',
                                         undefined, undefined, showSpin)
                },
                'GetVehicleStatus' : function( showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + 'api/common/Vehicle/Condition',
                                         undefined, undefined, showSpin)
                },
                'GetSteeringWheel' : function( showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + 'api/common/Vehicle/Steeringwheel',
                                         undefined, undefined, showSpin)
                },
                'GetAgentById' : function(agentid, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/common/Agent/{agentid}',
                                                    { 'agentid':  { value: agentid, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetFieldsAvailable' : function( showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + 'api/common/fieldsAvailable',
                                         undefined, undefined, showSpin)
                },
                'GetPhotoTypeByVehicleTypeAndDeviceType' : function(vehicleType, deviceType, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/common/Vehicle/PhotoTypes/{vehicleType}/{deviceType}',
                                                    { 'vehicleType':  { value: vehicleType, defaultValue:'' } ,'deviceType':  { value: deviceType, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetPhotoTypeSimpleByVehicleTypeAndDeviceType' : function(vehicleType, deviceType, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/common/Vehicle/PhotoTypes-simple/{vehicleType}/{deviceType}',
                                                    { 'vehicleType':  { value: vehicleType, defaultValue:'' } ,'deviceType':  { value: deviceType, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetInsurers' : function( showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + 'api/common/insurers',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyAlerts", ['oimProxyInspec', 'httpData', function(oimProxyInspec, httpData){
        return {
                'AddAlert' : function(alert, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/alerts/add',
                                         alert, undefined, showSpin)
                },
                'AddAlertFleet' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/alerts/add/fleet',
                                         request, undefined, showSpin)
                },
                'ResponseAlert' : function(alert, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/alerts/response',
                                         alert, undefined, showSpin)
                },
                'NotifyUser' : function(alert, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/alerts/notify',
                                         alert, undefined, showSpin)
                },
                'GetAlerts' : function(riskid, alertid, roleuser, alerttype, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/alerts/list/{riskid}?alertid={alertid}&roleuser={roleuser}&alerttype={alerttype}',
                                                    { 'riskid':  { value: riskid, defaultValue:'0' } ,'alertid':  { value: alertid, defaultValue:'0' } ,'roleuser':  { value: roleuser, defaultValue:'' } ,'alerttype':  { value: alerttype, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetFleetForAlerts' : function(requestId, showSpin){
                    return httpData['get'](oimProxyInspec.endpoint + helper.formatNamed('api/alerts/list/fleet/{requestId}',
                                                    { 'requestId':  { value: requestId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'NotifyEvaluatorSelfInspectionInEvaluation' : function(request, showSpin){
                    return httpData['post'](oimProxyInspec.endpoint + 'api/alerts/notifyevaluator',
                                         request, undefined, showSpin)
                }
        };
     }]);
});
