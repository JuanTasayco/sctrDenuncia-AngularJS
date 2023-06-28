/* eslint-disable */
(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants'], function(angular, constants){
    var module = angular.module("oim.proxyService.webProc", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxyWebProc', {
        endpoint: constants.system.api.endpoints['webproc'],
        controllerAssistance: {
            actions : {
                'methodGet':{
                    name:  'Get',
                    path: 'api/Assistance/{idassistance}'
                },
                'methodSearch':{
                    name:  'Search',
                    path: 'api/Assistance/$search'
                },
                'methodnoproc':{
                    name:  'noproc',
                    path: 'api/Assistance/$noproc'
                },
                'methodexport':{
                    name:  'export',
                    path: 'api/Assistance/$export'
                },
                'methodSaveAssistanceDelay':{
                    name:  'SaveAssistanceDelay',
                    path: 'api/Assistance/SaveAssistance'
                },
                'methodListAssistanceDelay':{
                    name:  'ListAssistanceDelay',
                    path: 'api/Assistance/listaAssistance?userOwner={userOwner}&assistanceId={assistanceId}'
                },
                'methodUpdateAssistanceDelay':{
                    name:  'UpdateAssistanceDelay',
                    path: 'api/Assistance/updateAssistanceDelay'
                },
                'methodDeleteAssistanceDely':{
                    name:  'DeleteAssistanceDely',
                    path: 'api/Assistance/deleteAssistanceDely'
                },
                'methodListAllAssistanceDelay':{
                    name:  'ListAllAssistanceDelay',
                    path: 'api/Assistance/listAllAssistanceDelay'
                },
                'methodGetDocumentValidation':{
                    name:  'GetDocumentValidation',
                    path: 'api/Assistance/GetDocumentValidation/{assistanceid}/{sinisterid}'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Assistance?key={key}'
                },
            }
        },
        controllerSecurity: {
            actions : {
                'methodGetUserRole':{
                    name:  'GetUserRole',
                    path: 'api/security/role'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Security?key={key}'
                },
            }
        },
        controllerTaller: {
            actions : {
                'methodGetTalleres':{
                    name:  'GetTalleres',
                    path: 'api/Taller/{caso}/{departamentoId}/{provinciaId}/{distritoId}?tipo={tipo}&nombre={nombre}'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Taller?key={key}'
                },
            }
        },
        controllerSiniestro: {
            actions : {
                'methodUploadCarDocument':{
                    name:  'UploadCarDocument',
                    path: 'api/Siniestro/upload/cardocument'
                },
                'methodUploadCarSinister':{
                    name:  'UploadCarSinister',
                    path: 'api/Siniestro/upload/carsiniester'
                },
                'methodUploadSinisterDetail':{
                    name:  'UploadSinisterDetail',
                    path: 'api/Siniestro/upload/sinisterdetail'
                },
                'methodUploadThirdParties':{
                    name:  'UploadThirdParties',
                    path: 'api/Siniestro/upload/thirdparties'
                },
                'methodDeleteImages':{
                    name:  'DeleteImages',
                    path: 'api/Siniestro/delete/images'
                },
                'methodDeleteThirdPartyBy':{
                    name:  'DeleteThirdPartyBy',
                    path: 'api/Siniestro/delete/thirdpartyby'
                },
                'methodViewImage':{
                    name:  'ViewImage',
                    path: 'api/Siniestro/viewimage/{caseNumber}/{id}/{isResize}'
                },
                'methodViewImageThirdParties':{
                    name:  'ViewImageThirdParties',
                    path: 'api/Siniestro/viewimageThirdParties/{caseNumber}/{terceroid}/{id}/{isResize}'
                },
                'methodViewImageByPath':{
                    name:  'ViewImageByPath',
                    path: 'api/Siniestro/viewimagebyfilename/{filename}/{isResize}'
                },
                'methodGet':{
                    name:  'Get',
                    path: 'api/Siniestro/{caso}'
                },
                'methodGetListAttachFile':{
                    name:  'GetListAttachFile',
                    path: 'api/Siniestro/attachfile/{caso}/{typeImage}'
                },
                'methodGetSiniestroMongo':{
                    name:  'GetSiniestroMongo',
                    path: 'api/Siniestro/search/{caso}'
                },
                'methodSave':{
                    name:  'Save',
                    path: 'api/Siniestro/save'
                },
                'methodDeleteMongo':{
                    name:  'DeleteMongo',
                    path: 'api/Siniestro/delete/{id}'
                },
                'methodGetCarBrands':{
                    name:  'GetCarBrands',
                    path: 'api/Siniestro/vehicleParts/{zoneId}'
                },
                'methodGeneratorCaseFile':{
                    name:  'GeneratorCaseFile',
                    path: 'api/Siniestro/generateCasefile?rejected={rejected}'
                },
                'methodGetVersion':{
                    name:  'GetVersion',
                    path: 'api/Siniestro/versions/{caseNumber}?sinisterNumber={sinisterNumber}'
                },
                'methodDownloadVersion':{
                    name:  'DownloadVersion',
                    path: 'api/Siniestro/versions/download/{caseNumber}/{iddocument}'
                },
                'methodDownloadVersionSinSiniestro':{
                    name:  'DownloadVersionSinSiniestro',
                    path: 'api/Siniestro/versions/downloadSinSiniestro?fileName={fileName}&idDocumento={idDocumento}'
                },
                'methodGetListAffected':{
                    name:  'GetListAffected',
                    path: 'api/Siniestro/affected/{idassistance}'
                },
                'methodGetListServiec':{
                    name:  'GetListServiec',
                    path: 'api/Siniestro/service/{idassistance}'
                },
                'methodSendAlertBlowForBlow':{
                    name:  'SendAlertBlowForBlow',
                    path: 'api/Siniestro/sendalertblowforblow'
                },
                'methodUpdateAlertBlowForBlow':{
                    name:  'UpdateAlertBlowForBlow',
                    path: 'api/Siniestro/updateAlertBlowforBlow?sinisterBlowForBlow={sinisterBlowForBlow}'
                },
                'methodGenerateSinisterTRON':{
                    name:  'GenerateSinisterTRON',
                    path: 'api/Siniestro/GenerateSinisterTRON'
                },
                'methodGetExistingSinister':{
                    name:  'GetExistingSinister',
                    path: 'api/Siniestro/GetExistingSinister'
                },
                'methodGetTokenSalesforceAsync':{
                    name:  'GetTokenSalesforceAsync',
                    path: 'api/Siniestro/salesforce/token'
                },
                'methodGetCaseSalesforce':{
                    name:  'GetCaseSalesforce',
                    path: 'api/Siniestro/salesforce/getcase/{idassistance}'
                },
                'methodAutorizarSave':{
                    name:  'AutorizarSave',
                    path: 'api/Siniestro/autorizar'
                },
                'methodPonerInvestigarSave':{
                    name:  'PonerInvestigarSave',
                    path: 'api/Siniestro/investigar'
                },
                'methodDesistirSave':{
                    name:  'DesistirSave',
                    path: 'api/Siniestro/desistir'
                },
                'methodVerificarClienteObservado':{
                    name:  'VerificarClienteObservado',
                    path: 'api/Siniestro/clienteObservado/{tipoDoc}/{numDoc}'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Siniestro?key={key}'
                },
            }
        },
        controllerSeveralTable: {
            actions : {
                'methodGetHeader':{
                    name:  'GetHeader',
                    path: 'api/severalTable/{codigoGrupo}?fromCache={fromCache}'
                },
                'methodGetDetails':{
                    name:  'GetDetails',
                    path: 'api/severalTable/{codigoGrupo}/{codigoParametro}?fromCache={fromCache}'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/SeveralTable?key={key}'
                },
            }
        },
        controllerUbigeo: {
            actions : {
                'methodGetDepartaments':{
                    name:  'GetDepartaments',
                    path: 'api/ubigeo?withDetails={withDetails}&fromCache={fromCache}'
                },
                'methodGetProvinces':{
                    name:  'GetProvinces',
                    path: 'api/ubigeo/{departamentId}?withDetails={withDetails}&fromCache={fromCache}'
                },
                'methodGetDistricts':{
                    name:  'GetDistricts',
                    path: 'api/ubigeo/{departamentId}/{provinceId}?fromCache={fromCache}'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Ubigeo?key={key}'
                },
            }
        },
        controllerSubject: {
            actions : {
                'methodPutUpdateStates1':{
                    name:  'PutUpdateStates1',
                    path: 'api/Subject/$batch/state'
                },
                'methodGetRequestTemplate':{
                    name:  'GetRequestTemplate',
                    path: 'api/Subject/$batch/state/requestTemplate'
                },
                'methodGet':{
                    name:  'Get',
                    path: 'api/Subject?codeCategory={codeCategory}&fromCache={fromCache}'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Subject?key={key}'
                },
            }
        },
        controllerCarRepairShop: {
            actions : {
                'methodGetByUbigeoBrandTron':{
                    name:  'GetByUbigeoBrandTron',
                    path: 'api/carRepairShop/tron/{departamentId}/{provinceId}/{brandId}?fromCache={fromCache}'
                },
                'methodGet':{
                    name:  'Get',
                    path: 'api/carRepairShop?fromCache={fromCache}'
                },
                'methodGetBranchsByRepairShopAndUbigeo':{
                    name:  'GetBranchsByRepairShopAndUbigeo',
                    path: 'api/carRepairShop/location/{repairShopId}/{departamentId}/{provinceId}/{codigoActTercero}?fromCache={fromCache}'
                },
                'methodGetBranchsByRepairShop':{
                    name:  'GetBranchsByRepairShop',
                    path: 'api/carRepairShop/branch/{repairShopId}?fromCache={fromCache}'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/CarRepairShop?key={key}'
                },
            }
        },
        controllerAssistanceReport: {
            actions : {
                'methodGetAssistanceReport':{
                    name:  'GetAssistanceReport',
                    path: 'api/report/assistance'
                },
                'methodDownloadAsssistanceReport':{
                    name:  'DownloadAsssistanceReport',
                    path: 'api/report/assistance/download'
                },
                'methodSendMonthlyReport':{
                    name:  'SendMonthlyReport',
                    path: 'api/report/assistance/month'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/AssistanceReport?key={key}'
                },
            }
        },
        controllerCategory: {
            actions : {
                'methodGetCategoryAll':{
                    name:  'GetCategoryAll',
                    path: 'api/Category?fromCache={fromCache}'
                },
                'methodGet':{
                    name:  'Get',
                    path: 'api/Category/{id}?fromCache={fromCache}'
                },
                'methodGetBatch':{
                    name:  'GetBatch',
                    path: 'api/Category/$?ids[0]={ids[0]}&ids[1]={ids[1]}&fromCache={fromCache}'
                },
                'methodPutUpdateStates':{
                    name:  'PutUpdateStates',
                    path: 'api/Category/$batch/state'
                },
                'methodGetRequestTemplate':{
                    name:  'GetRequestTemplate',
                    path: 'api/Category/$batch/state/requestTemplate'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Category?key={key}'
                },
            }
        },
        controllerEquifax: {
            actions : {
                'methodGetPersonEquifax':{
                    name:  'GetPersonEquifax',
                    path: 'api/equifax/persona/{codCia}/{tipDoc}/{numDoc}/{tipoConsulta}'
                },
                'methodGetPlacaEquifax':{
                    name:  'GetPlacaEquifax',
                    path: 'api/equifax/placa/{numPlaca}'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Equifax?key={key}'
                },
            }
        },
        controllerTheme: {
            actions : {
                'methodPutUpdateStates':{
                    name:  'PutUpdateStates',
                    path: 'api/Theme/$batch/state'
                },
                'methodGetRequestTemplate':{
                    name:  'GetRequestTemplate',
                    path: 'api/Theme/$batch/state/requestTemplate'
                },
                'methodGet':{
                    name:  'Get',
                    path: 'api/Theme?codeCategory={codeCategory}&codeSubject={codeSubject}&fromCache={fromCache}'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Theme?key={key}'
                },
            }
        },
        controllerPoliceStation: {
            actions : {
                'methodGetPoliceStationByDistrict':{
                    name:  'GetPoliceStationByDistrict',
                    path: 'api/carRepairShop/{districtId}?fromTron={fromTron}&departamentId={departamentId}&provinceId={provinceId}&fromCache={fromCache}'
                },
                'methodGetPoliceStationByUbigeo':{
                    name:  'GetPoliceStationByUbigeo',
                    path: 'api/carRepairShop/{departamentId}/{provinceId}/{districtId}?fromTron={fromTron}&fromCache={fromCache}'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/PoliceStation?key={key}'
                },
            }
        },
        controllerLookup: {
            actions : {
                'methodGetUsers':{
                    name:  'GetUsers',
                    path: 'api/Lookup/users'
                },
                'methodGet':{
                    name:  'Get',
                    path: 'api/Lookup/{code}'
                },
                'methodGetLookupSeveral':{
                    name:  'GetLookupSeveral',
                    path: 'api/Lookup?codes[0]={codes[0]}&codes[1]={codes[1]}&fromCache={fromCache}'
                },
                'methodGetCarBrands':{
                    name:  'GetCarBrands',
                    path: 'api/Lookup/carBrands?fromCache={fromCache}'
                },
                'methodGetCarModelsByBrand':{
                    name:  'GetCarModelsByBrand',
                    path: 'api/Lookup/carModels/{codeBrand}?fromCache={fromCache}'
                },
                'methodGetCarYearsByModelAndBrand':{
                    name:  'GetCarYearsByModelAndBrand',
                    path: 'api/Lookup/carYears/{codeModel}/{codeBrand}?fromCache={fromCache}'
                },
                'methodGetCarTypesUse':{
                    name:  'GetCarTypesUse',
                    path: 'api/Lookup/carTypesUse?fromCache={fromCache}'
                },
                'methodGetCarTypes':{
                    name:  'GetCarTypes',
                    path: 'api/Lookup/carTypes?fromCache={fromCache}'
                },
                'methodGetPhotoTypes':{
                    name:  'GetPhotoTypes',
                    path: 'api/Lookup/photoTypes?ownerId={ownerId}&fromCache={fromCache}'
                },
                'methodGetListParameterDetail':{
                    name:  'GetListParameterDetail',
                    path: 'api/Lookup/parameterDetail?groupCode={groupCode}&parameterCode={parameterCode}'
                },
                'methodGetParamsDetailsByDescritions':{
                    name:  'GetParamsDetailsByDescritions',
                    path: 'api/Lookup/parameterDetail/description?d[0]={d[0]}&d[1]={d[1]}'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Lookup?key={key}'
                },
            }
        },
        controllerOimApi: {
            actions : {
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/OimApi?key={key}'
                },
            }
        }
    })



     module.factory("proxyAssistance", ['oimProxyWebProc', 'httpData', function(oimProxyWebProc, httpData){
        return {
                'Get' : function(idassistance, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Assistance/{idassistance}',
                                                    { 'idassistance':idassistance   }),
                                         undefined, undefined, showSpin)
                },
                'Search' : function(query, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Assistance/$search',
                                                    { 'query':  { value: query, defaultValue:'', isQuery: true }  }),
                                         undefined, undefined, showSpin)
                },
                'noproc' : function(query, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Assistance/$noproc',
                                                    { 'query':  { value: query, defaultValue:'', isQuery: true }  }),
                                         undefined, undefined, showSpin)
                },
                'export' : function(query, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Assistance/$export',
                                                    { 'query':  { value: query, defaultValue:'', isQuery: true }  }),
                                         undefined, undefined, showSpin)
                },
                'SaveAssistanceDelay' : function(assistance, showSpin){
                    return httpData['post'](oimProxyWebProc.endpoint + 'api/Assistance/SaveAssistance',
                                         assistance, undefined, showSpin)
                },
                'ListAssistanceDelay' : function(userOwner, assistanceId, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Assistance/listaAssistance?userOwner={userOwner}&assistanceId={assistanceId}',
                                                    { 'userOwner':userOwner  ,'assistanceId':assistanceId   }),
                                         undefined, undefined, showSpin)
                },
                'UpdateAssistanceDelay' : function(assistance, showSpin){
                    return httpData['post'](oimProxyWebProc.endpoint + 'api/Assistance/updateAssistanceDelay',
                                         assistance, undefined, showSpin)
                },
                'DeleteAssistanceDely' : function(assistance, showSpin){
                    return httpData['post'](oimProxyWebProc.endpoint + 'api/Assistance/deleteAssistanceDely',
                                         assistance, undefined, showSpin)
                },
                'ListAllAssistanceDelay' : function( showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + 'api/Assistance/listAllAssistanceDelay',
                                         undefined, undefined, showSpin)
                },
                'GetDocumentValidation' : function(assistanceid, sinisterid, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Assistance/GetDocumentValidation/{assistanceid}/{sinisterid}',
                                                    { 'assistanceid':assistanceid  ,'sinisterid':sinisterid   }),
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Assistance?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySecurity", ['oimProxyWebProc', 'httpData', function(oimProxyWebProc, httpData){
        return {
                'GetUserRole' : function( showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + 'api/security/role',
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Security?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyTaller", ['oimProxyWebProc', 'httpData', function(oimProxyWebProc, httpData){
        return {
                'GetTalleres' : function(caso, departamentoId, provinciaId, distritoId, tipo, nombre, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Taller/{caso}/{departamentoId}/{provinciaId}/{distritoId}?tipo={tipo}&nombre={nombre}',
                                                    { 'caso':caso  ,'departamentoId':departamentoId  ,'provinciaId':provinciaId  ,'distritoId':distritoId  ,'tipo':  { value: tipo, defaultValue:'2' } ,'nombre':  { value: nombre, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Taller?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySiniestro", ['oimProxyWebProc', 'httpData', function(oimProxyWebProc, httpData){
        return {
                'UploadCarDocument' : function( showSpin){
                    return httpData['post'](oimProxyWebProc.endpoint + 'api/Siniestro/upload/cardocument',
                                         undefined, undefined, showSpin)
                },
                'UploadCarSinister' : function( showSpin){
                    return httpData['post'](oimProxyWebProc.endpoint + 'api/Siniestro/upload/carsiniester',
                                         undefined, undefined, showSpin)
                },
                'UploadSinisterDetail' : function( showSpin){
                    return httpData['post'](oimProxyWebProc.endpoint + 'api/Siniestro/upload/sinisterdetail',
                                         undefined, undefined, showSpin)
                },
                'UploadThirdParties' : function( showSpin){
                    return httpData['post'](oimProxyWebProc.endpoint + 'api/Siniestro/upload/thirdparties',
                                         undefined, undefined, showSpin)
                },
                'DeleteImages' : function(imagenDto, showSpin){
                    return httpData['post'](oimProxyWebProc.endpoint + 'api/Siniestro/delete/images',
                                         imagenDto, undefined, showSpin)
                },
                'DeleteThirdPartyBy' : function(thirdPartyDto, showSpin){
                    return httpData['post'](oimProxyWebProc.endpoint + 'api/Siniestro/delete/thirdpartyby',
                                         thirdPartyDto, undefined, showSpin)
                },
                'ViewImage' : function(caseNumber, id, isResize, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Siniestro/viewimage/{caseNumber}/{id}/{isResize}',
                                                    { 'caseNumber':caseNumber  ,'id':id  ,'isResize':isResize   }),
                                         undefined, undefined, showSpin)
                },
                'ViewImageThirdParties' : function(caseNumber, terceroid, id, isResize, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Siniestro/viewimageThirdParties/{caseNumber}/{terceroid}/{id}/{isResize}',
                                                    { 'caseNumber':caseNumber  ,'terceroid':terceroid  ,'id':id  ,'isResize':isResize   }),
                                         undefined, undefined, showSpin)
                },
                'ViewImageByPath' : function(filename, isResize, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Siniestro/viewimagebyfilename/{filename}/{isResize}',
                                                    { 'filename':filename  ,'isResize':isResize   }),
                                         undefined, undefined, showSpin)
                },
                'Get' : function(caso, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Siniestro/{caso}',
                                                    { 'caso':caso   }),
                                         undefined, undefined, showSpin)
                },
                'GetListAttachFile' : function(caso, typeImage, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Siniestro/attachfile/{caso}/{typeImage}',
                                                    { 'caso':caso  ,'typeImage':typeImage   }),
                                         undefined, undefined, showSpin)
                },
                'GetSiniestroMongo' : function(caso, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Siniestro/search/{caso}',
                                                    { 'caso':caso   }),
                                         undefined, undefined, showSpin)
                },
                'Save' : function(siniestro, showSpin){
                    return httpData['post'](oimProxyWebProc.endpoint + 'api/Siniestro/save',
                                         siniestro, undefined, showSpin)
                },
                'DeleteMongo' : function(id, showSpin){
                    return httpData['delete'](oimProxyWebProc.endpoint + helper.formatNamed('api/Siniestro/delete/{id}',
                                                    { 'id':id   }),
                                         undefined, undefined, showSpin)
                },
                'GetCarBrands' : function(zoneId, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Siniestro/vehicleParts/{zoneId}',
                                                    { 'zoneId':zoneId   }),
                                         undefined, undefined, showSpin)
                },
                'GeneratorCaseFile' : function(rejected, siniestro, showSpin){
                    return httpData['post'](oimProxyWebProc.endpoint + helper.formatNamed('api/Siniestro/generateCasefile?rejected={rejected}',
                                                    { 'rejected':rejected   }),
                                         siniestro, undefined, showSpin)
                },
                'GetVersion' : function(caseNumber, sinisterNumber, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Siniestro/versions/{caseNumber}?sinisterNumber={sinisterNumber}',
                                                    { 'caseNumber':caseNumber  ,'sinisterNumber':  { value: sinisterNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'DownloadVersion' : function(caseNumber, iddocument, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Siniestro/versions/download/{caseNumber}/{iddocument}',
                                                    { 'caseNumber':caseNumber  ,'iddocument':iddocument   }),
                                         undefined, undefined, showSpin)
                },
                'DownloadVersionSinSiniestro' : function(fileName, idDocumento, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Siniestro/versions/downloadSinSiniestro?fileName={fileName}&idDocumento={idDocumento}',
                                                    { 'fileName':fileName  ,'idDocumento':idDocumento   }),
                                         undefined, undefined, showSpin)
                },
                'GetListAffected' : function(idassistance, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Siniestro/affected/{idassistance}',
                                                    { 'idassistance':idassistance   }),
                                         undefined, undefined, showSpin)
                },
                'GetListServiec' : function(idassistance, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Siniestro/service/{idassistance}',
                                                    { 'idassistance':idassistance   }),
                                         undefined, undefined, showSpin)
                },
                'SendAlertBlowForBlow' : function(sinisterBlowForBlowDto, showSpin){
                    return httpData['post'](oimProxyWebProc.endpoint + 'api/Siniestro/sendalertblowforblow',
                                         sinisterBlowForBlowDto, undefined, showSpin)
                },
                'UpdateAlertBlowForBlow' : function(sinisterBlowForBlow, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Siniestro/updateAlertBlowforBlow?sinisterBlowForBlow={sinisterBlowForBlow}',
                                                    { 'sinisterBlowForBlow':sinisterBlowForBlow   }),
                                         undefined, undefined, showSpin)
                },
                'GenerateSinisterTRON' : function(model, showSpin){
                    return httpData['post'](oimProxyWebProc.endpoint + 'api/Siniestro/GenerateSinisterTRON',
                                         model, undefined, showSpin)
                },
                'GetExistingSinister' : function(model, showSpin){
                    return httpData['post'](oimProxyWebProc.endpoint + 'api/Siniestro/GetExistingSinister',
                                         model, undefined, showSpin)
                },
                'GetTokenSalesforceAsync' : function(salesforce, showSpin){
                    return httpData['post'](oimProxyWebProc.endpoint + 'api/Siniestro/salesforce/token',
                                         salesforce, undefined, showSpin)
                },
                'GetCaseSalesforce' : function(idassistance, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Siniestro/salesforce/getcase/{idassistance}',
                                                    { 'idassistance':idassistance   }),
                                         undefined, undefined, showSpin)
                },
                'AutorizarSave' : function(siniestro, showSpin){
                    return httpData['post'](oimProxyWebProc.endpoint + 'api/Siniestro/autorizar',
                                         siniestro, undefined, showSpin)
                },
                'PonerInvestigarSave' : function(siniestro, showSpin){
                    return httpData['post'](oimProxyWebProc.endpoint + 'api/Siniestro/investigar',
                                         siniestro, undefined, showSpin)
                },
                'DesistirSave' : function(siniestro, showSpin){
                    return httpData['post'](oimProxyWebProc.endpoint + 'api/Siniestro/desistir',
                                         siniestro, undefined, showSpin)
                },
                'VerificarClienteObservado' : function(tipoDoc, numDoc, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Siniestro/clienteObservado/{tipoDoc}/{numDoc}',
                                                    { 'tipoDoc':tipoDoc  ,'numDoc':numDoc   }),
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Siniestro?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySeveralTable", ['oimProxyWebProc', 'httpData', function(oimProxyWebProc, httpData){
        return {
                'GetHeader' : function(codigoGrupo, fromCache, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/severalTable/{codigoGrupo}?fromCache={fromCache}',
                                                    { 'codigoGrupo':codigoGrupo  ,'fromCache':  { value: fromCache, defaultValue:'false' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetDetails' : function(codigoGrupo, codigoParametro, fromCache, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/severalTable/{codigoGrupo}/{codigoParametro}?fromCache={fromCache}',
                                                    { 'codigoGrupo':codigoGrupo  ,'codigoParametro':codigoParametro  ,'fromCache':  { value: fromCache, defaultValue:'false' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/SeveralTable?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyUbigeo", ['oimProxyWebProc', 'httpData', function(oimProxyWebProc, httpData){
        return {
                'GetDepartaments' : function(withDetails, fromCache, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/ubigeo?withDetails={withDetails}&fromCache={fromCache}',
                                                    { 'withDetails':  { value: withDetails, defaultValue:'false' } ,'fromCache':  { value: fromCache, defaultValue:'false' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetProvinces' : function(departamentId, withDetails, fromCache, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/ubigeo/{departamentId}?withDetails={withDetails}&fromCache={fromCache}',
                                                    { 'departamentId':departamentId  ,'withDetails':  { value: withDetails, defaultValue:'false' } ,'fromCache':  { value: fromCache, defaultValue:'false' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetDistricts' : function(departamentId, provinceId, fromCache, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/ubigeo/{departamentId}/{provinceId}?fromCache={fromCache}',
                                                    { 'departamentId':departamentId  ,'provinceId':provinceId  ,'fromCache':  { value: fromCache, defaultValue:'false' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Ubigeo?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySubject", ['oimProxyWebProc', 'httpData', function(oimProxyWebProc, httpData){
        return {
                'PutUpdateStates1' : function(request, showSpin){
                    return httpData['put'](oimProxyWebProc.endpoint + 'api/Subject/$batch/state',
                                         request, undefined, showSpin)
                },
                'GetRequestTemplate' : function( showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + 'api/Subject/$batch/state/requestTemplate',
                                         undefined, undefined, showSpin)
                },
                'Get' : function(codeCategory, fromCache, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Subject?codeCategory={codeCategory}&fromCache={fromCache}',
                                                    { 'codeCategory':codeCategory  ,'fromCache':  { value: fromCache, defaultValue:'false' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Subject?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCarRepairShop", ['oimProxyWebProc', 'httpData', function(oimProxyWebProc, httpData){
        return {
                'GetByUbigeoBrandTron' : function(departamentId, provinceId, brandId, fromCache, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/carRepairShop/tron/{departamentId}/{provinceId}/{brandId}?fromCache={fromCache}',
                                                    { 'departamentId':departamentId  ,'provinceId':provinceId  ,'brandId':brandId  ,'fromCache':  { value: fromCache, defaultValue:'false' }  }),
                                         undefined, undefined, showSpin)
                },
                'Get' : function(fromCache, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/carRepairShop?fromCache={fromCache}',
                                                    { 'fromCache':  { value: fromCache, defaultValue:'false' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetBranchsByRepairShopAndUbigeo' : function(repairShopId, departamentId, provinceId, codigoActTercero, fromCache, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/carRepairShop/location/{repairShopId}/{departamentId}/{provinceId}/{codigoActTercero}?fromCache={fromCache}',
                                                    { 'repairShopId':repairShopId  ,'departamentId':  { value: departamentId, defaultValue:'' } ,'provinceId':  { value: provinceId, defaultValue:'0' } ,'codigoActTercero':  { value: codigoActTercero, defaultValue:'' } ,'fromCache':  { value: fromCache, defaultValue:'false' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetBranchsByRepairShop' : function(repairShopId, fromCache, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/carRepairShop/branch/{repairShopId}?fromCache={fromCache}',
                                                    { 'repairShopId':repairShopId  ,'fromCache':  { value: fromCache, defaultValue:'false' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/CarRepairShop?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyAssistanceReport", ['oimProxyWebProc', 'httpData', function(oimProxyWebProc, httpData){
        return {
                'GetAssistanceReport' : function(timeRequest, showSpin){
                    return httpData['post'](oimProxyWebProc.endpoint + 'api/report/assistance',
                                         timeRequest, undefined, showSpin)
                },
                'DownloadAsssistanceReport' : function(timeRequest, showSpin){
                    return httpData['post'](oimProxyWebProc.endpoint + 'api/report/assistance/download',
                                         timeRequest, undefined, showSpin)
                },
                'SendMonthlyReport' : function( showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + 'api/report/assistance/month',
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/AssistanceReport?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCategory", ['oimProxyWebProc', 'httpData', function(oimProxyWebProc, httpData){
        return {
                'GetCategoryAll' : function(fromCache, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Category?fromCache={fromCache}',
                                                    { 'fromCache':  { value: fromCache, defaultValue:'false' }  }),
                                         undefined, undefined, showSpin)
                },
                'Get' : function(id, fromCache, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Category/{id}?fromCache={fromCache}',
                                                    { 'id':id  ,'fromCache':  { value: fromCache, defaultValue:'false' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetBatch' : function(ids, fromCache, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Category/$?ids[0]={ids[0]}&ids[1]={ids[1]}&fromCache={fromCache}',
                                                    { 'ids':  { value: ids, defaultValue:'', allowMultiple:true  } ,'fromCache':  { value: fromCache, defaultValue:'false' }  }),
                                         undefined, undefined, showSpin)
                },
                'PutUpdateStates' : function(request, showSpin){
                    return httpData['put'](oimProxyWebProc.endpoint + 'api/Category/$batch/state',
                                         request, undefined, showSpin)
                },
                'GetRequestTemplate' : function( showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + 'api/Category/$batch/state/requestTemplate',
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Category?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyEquifax", ['oimProxyWebProc', 'httpData', function(oimProxyWebProc, httpData){
        return {
                'GetPersonEquifax' : function(codCia, tipDoc, numDoc, tipoConsulta, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/equifax/persona/{codCia}/{tipDoc}/{numDoc}/{tipoConsulta}',
                                                    { 'codCia':codCia  ,'tipDoc':tipDoc  ,'numDoc':numDoc  ,'tipoConsulta':tipoConsulta   }),
                                         undefined, undefined, showSpin)
                },
                'GetPlacaEquifax' : function(numPlaca, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/equifax/placa/{numPlaca}',
                                                    { 'numPlaca':numPlaca   }),
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Equifax?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyTheme", ['oimProxyWebProc', 'httpData', function(oimProxyWebProc, httpData){
        return {
                'PutUpdateStates' : function(request, showSpin){
                    return httpData['put'](oimProxyWebProc.endpoint + 'api/Theme/$batch/state',
                                         request, undefined, showSpin)
                },
                'GetRequestTemplate' : function( showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + 'api/Theme/$batch/state/requestTemplate',
                                         undefined, undefined, showSpin)
                },
                'Get' : function(codeCategory, codeSubject, fromCache, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Theme?codeCategory={codeCategory}&codeSubject={codeSubject}&fromCache={fromCache}',
                                                    { 'codeCategory':codeCategory  ,'codeSubject':codeSubject  ,'fromCache':fromCache   }),
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Theme?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPoliceStation", ['oimProxyWebProc', 'httpData', function(oimProxyWebProc, httpData){
        return {
                'GetPoliceStationByDistrict' : function(districtId, fromTron, departamentId, provinceId, fromCache, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/carRepairShop/{districtId}?fromTron={fromTron}&departamentId={departamentId}&provinceId={provinceId}&fromCache={fromCache}',
                                                    { 'districtId':districtId  ,'fromTron':  { value: fromTron, defaultValue:'false' } ,'departamentId':  { value: departamentId, defaultValue:'' } ,'provinceId':  { value: provinceId, defaultValue:'0' } ,'fromCache':  { value: fromCache, defaultValue:'false' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetPoliceStationByUbigeo' : function(districtId, fromTron, departamentId, provinceId, fromCache, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/carRepairShop/{departamentId}/{provinceId}/{districtId}?fromTron={fromTron}&fromCache={fromCache}',
                                                    { 'districtId':districtId  ,'fromTron':  { value: fromTron, defaultValue:'false' } ,'departamentId':  { value: departamentId, defaultValue:'' } ,'provinceId':  { value: provinceId, defaultValue:'0' } ,'fromCache':  { value: fromCache, defaultValue:'false' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/PoliceStation?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyLookup", ['oimProxyWebProc', 'httpData', function(oimProxyWebProc, httpData){
        return {
                'GetUsers' : function( showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + 'api/Lookup/users',
                                         undefined, undefined, showSpin)
                },
                'Get' : function(code, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Lookup/{code}',
                                                    { 'code':code   }),
                                         undefined, undefined, showSpin)
                },
                'GetLookupSeveral' : function(codes, fromCache, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Lookup?codes[0]={codes[0]}&codes[1]={codes[1]}&fromCache={fromCache}',
                                                    { 'codes':  { value: codes, defaultValue:'', allowMultiple:true  } ,'fromCache':  { value: fromCache, defaultValue:'false' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetCarBrands' : function(fromCache, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Lookup/carBrands?fromCache={fromCache}',
                                                    { 'fromCache':  { value: fromCache, defaultValue:'false' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetCarModelsByBrand' : function(codeBrand, fromCache, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Lookup/carModels/{codeBrand}?fromCache={fromCache}',
                                                    { 'codeBrand':codeBrand  ,'fromCache':  { value: fromCache, defaultValue:'false' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetCarYearsByModelAndBrand' : function(codeModel, codeBrand, fromCache, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Lookup/carYears/{codeModel}/{codeBrand}?fromCache={fromCache}',
                                                    { 'codeModel':codeModel  ,'codeBrand':codeBrand  ,'fromCache':  { value: fromCache, defaultValue:'false' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetCarTypesUse' : function(fromCache, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Lookup/carTypesUse?fromCache={fromCache}',
                                                    { 'fromCache':  { value: fromCache, defaultValue:'false' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetCarTypes' : function(fromCache, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Lookup/carTypes?fromCache={fromCache}',
                                                    { 'fromCache':  { value: fromCache, defaultValue:'false' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetPhotoTypes' : function(ownerId, fromCache, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Lookup/photoTypes?ownerId={ownerId}&fromCache={fromCache}',
                                                    { 'ownerId':  { value: ownerId, defaultValue:'' } ,'fromCache':  { value: fromCache, defaultValue:'false' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetListParameterDetail' : function(groupCode, parameterCode, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Lookup/parameterDetail?groupCode={groupCode}&parameterCode={parameterCode}',
                                                    { 'groupCode':  { value: groupCode, defaultValue:'' } ,'parameterCode':  { value: parameterCode, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetParamsDetailsByDescritions' : function(d, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Lookup/parameterDetail/description?d[0]={d[0]}&d[1]={d[1]}',
                                                    { 'd':d   }),
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/Lookup?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyOimApi", ['oimProxyWebProc', 'httpData', function(oimProxyWebProc, httpData){
        return {
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyWebProc.endpoint + helper.formatNamed('api/OimApi?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);
});
