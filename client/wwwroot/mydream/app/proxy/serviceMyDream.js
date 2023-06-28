/* eslint-disable */
(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants'], function(angular, constants){
    var module = angular.module("oim.proxyService.mydream", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxyMyDream', {
        endpoint: constants.system.api.endpoints['mydream'],
        controllerHelper: {
            actions : {
                'methodGetMongoLog':{
                    name:  'GetMongoLog',
                    path: 'api/helper/logmongo/{startDate}/{lastDate}'
                },
                'methodDeleteMongoLog':{
                    name:  'DeleteMongoLog',
                    path: 'api/helper/logmongo/{startDate}/{lastDate}'
                },
                'methodGetFileLog':{
                    name:  'GetFileLog',
                    path: 'api/helper/logfile/{startDate}/{lastDate}'
                },
                'methodGetProjectVersion':{
                    name:  'GetProjectVersion',
                    path: 'api/helper/version'
                },
            }
        },
        controllerPolicies: {
            actions : {
                'methodGetConfigurationPayment':{
                    name:  'GetConfigurationPayment',
                    path: 'api/policies/configurationpayment?numeroRamo={numeroRamo}'
                },
                'methodUpdateConfigurationPayment':{
                    name:  'UpdateConfigurationPayment',
                    path: 'api/policies/configurationpayment'
                },
                'methodIntegrateSignature':{
                    name:  'IntegrateSignature',
                    path: 'api/policies/integratesignature'
                },
                'methodGetDocumentSignature':{
                    name:  'GetDocumentSignature',
                    path: 'api/policies/documentsignature/{numeroDocumento}'
                },
                'methodOpenDocumentSignature':{
                    name:  'OpenDocumentSignature',
                    path: 'api/policies/opendocumentsignature/{numeroDocumento}'
                },
                'methodGetPaymentSummary':{
                    name:  'GetPaymentSummary',
                    path: 'api/policies/paymentsummary/{numeroPoliza}/{numeroCuota}'
                },
                'methodGetPaymentSummaryToken':{
                    name:  'GetPaymentSummaryToken',
                    path: 'api/policies/paymentsummary'
                },
                'methodGetValidatePolicy':{
                    name:  'GetValidatePolicy',
                    path: 'api/policies/policyvalidate/{numeroPoliza}'
                },
            }
        },
        controllerPayment: {
            actions : {
                'methodProcessIpnPayment':{
                    name:  'ProcessIpnPayment',
                    path: 'api/payment/processpaymentipn'
                },
                'methodValidatePayment':{
                    name:  'ValidatePayment',
                    path: 'api/payment/validatepayment/{numeroPoliza}/{numeroRecibo}'
                },
                'methodSendMailPaymentDeferred':{
                    name:  'SendMailPaymentDeferred',
                    path: 'api/payment/sendpaymentmail'
                },
                'methodObtenerDocumentosPendientes':{
                    name:  'ObtenerDocumentosPendientes',
                    path: 'api/payment/pendingDocuments/count'
                },
                'methodObtenerDocumentosPorPagar':{
                    name:  'ObtenerDocumentosPorPagar',
                    path: 'api/payment/pendingDocuments/searchByFilterList'
                },
                'methodObtenerDocumentosPorNumero':{
                    name:  'ObtenerDocumentosPorNumero',
                    path: 'api/payment/pendingDocuments/searchByDocumentNumbers'
                },
                'methodObtenerPositiveBalance':{
                    name:  'ObtenerPositiveBalance',
                    path: 'api/payment/positiveBalances?nroDocContratante={nroDocContratante}&tipoDocContratante={tipoDocContratante}&codMoneda={codMoneda}'
                },
                'methodObtenerDestinationBank':{
                    name:  'ObtenerDestinationBank',
                    path: 'api/payment/destinationBankAccounts?codMoneda={codMoneda}'
                },
                'methodGenerateTransferRequest':{
                    name:  'GenerateTransferRequest',
                    path: 'api/payment/transferRequest'
                },
                'methodSaveNps':{
                    name:  'SaveNps',
                    path: 'api/payment/transferRequest/nps'
                },
                'methodGetTransferRequestRequested':{
                    name:  'GetTransferRequestRequested',
                    path: 'api/payment/transferRequest/searchFilterList'
                },
                'methodObtenerSolicitudTransferencia':{
                    name:  'ObtenerSolicitudTransferencia',
                    path: 'api/payment/transferRequest/{transferRequestId}'
                },
                'methodObtenerVoucherTransferencia':{
                    name:  'ObtenerVoucherTransferencia',
                    path: 'api/payment/transferRequest/{transferRequestId}/vouchersFiles'
                },
            }
        },
        controllerHome: {
            actions : {
                'methodGetMainApplications':{
                    name:  'GetMainApplications',
                    path: 'api/home/applications/main'
                },
                'methodGetLegacyApplications':{
                    name:  'GetLegacyApplications',
                    path: 'api/home/applications/legacy'
                },
                'methodGetAccessProfile':{
                    name:  'GetAccessProfile',
                    path: 'api/home/access/{applicationCode}'
                },
                'methodGetCarruseles':{
                    name:  'GetCarruseles',
                    path: 'api/home/carruseles/{applicationCode}'
                },
                'methodNotificationFilterUser':{
                    name:  'NotificationFilterUser',
                    path: 'api/home/filter/user?userCode={userCode}'
                },
                'methodSignatureFilterProduct':{
                    name:  'SignatureFilterProduct',
                    path: 'api/home/filter/product?product={product}'
                },
                'methodGetManager':{
                    name:  'GetManager',
                    path: 'api/home/filter/manager/{perfil}/{officeCode}?search={search}'
                },
                'methodGetAgent':{
                    name:  'GetAgent',
                    path: 'api/home/filter/agent/{perfil}/{officeCode}/{managerCode}?search={search}'
                },
                'methodPaymentTray':{
                    name:  'PaymentTray',
                    path: 'api/home/payment/traypagination'
                },
                'methodSignatureTray':{
                    name:  'SignatureTray',
                    path: 'api/home/signature/traypagination'
                },
                'methodCalendarTray':{
                    name:  'CalendarTray',
                    path: 'api/home/calendar/traypagination'
                },
                'methodCreateNotification':{
                    name:  'CreateNotification',
                    path: 'api/home/notification/insert'
                },
                'methodGetNotifications':{
                    name:  'GetNotifications',
                    path: 'api/home/notification/list?type={type}&count={count}'
                },
                'methodCheckReadNotifications':{
                    name:  'CheckReadNotifications',
                    path: 'api/home/notification/read'
                },
                'methodGetInformationCalendar':{
                    name:  'GetInformationCalendar',
                    path: 'api/home/information/calendar/{perfil}'
                },
                'methodGetInformationPendingReceipt':{
                    name:  'GetInformationPendingReceipt',
                    path: 'api/home/information/invoice/{perfil}'
                },
                'methodGetInformationPendingSignature':{
                    name:  'GetInformationPendingSignature',
                    path: 'api/home/information/signature/{perfil}'
                },
                'methodGetInformationPoliciesSold':{
                    name:  'GetInformationPoliciesSold',
                    path: 'api/home/information/policiessold/{perfil}'
                },
                'methodGetInformationPoliciesSoldAmount':{
                    name:  'GetInformationPoliciesSoldAmount',
                    path: 'api/home/information/policiessoldamount/{perfil}'
                },
                'methodGetInformationRatio':{
                    name:  'GetInformationRatio',
                    path: 'api/home/information/ratiointegralidad/{perfil}'
                },
                'methodTackerLogin':{
                    name:  'TackerLogin',
                    path: 'api/home/tracker/login'
                },
                'methodTackerPagoDirecto':{
                    name:  'TackerPagoDirecto',
                    path: 'api/home/tracker/recibospendientes/pagar'
                },
                'methodTackerVerDocumento':{
                    name:  'TackerVerDocumento',
                    path: 'api/home/tracker/docporfirmar/verdoc/{numDocumento}'
                },
                'methodTackerAplicaciones':{
                    name:  'TackerAplicaciones',
                    path: 'api/home/tracker/aplicaciones'
                },
                'methodTackerPendingPayment':{
                    name:  'TackerPendingPayment',
                    path: 'api/home/tracker/recibospendientes/pending-payment'
                },
            }
        }
    })



     module.factory("proxyHelper", ['oimProxyMyDream', 'httpData', function(oimProxyMyDream, httpData){
        return {
                'GetMongoLog' : function(startDate, lastDate, showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + helper.formatNamed('api/helper/logmongo/{startDate}/{lastDate}',
                                                    { 'startDate':  { value: startDate, defaultValue:'' } ,'lastDate':  { value: lastDate, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'DeleteMongoLog' : function(startDate, lastDate, showSpin){
                    return httpData['delete'](oimProxyMyDream.endpoint + helper.formatNamed('api/helper/logmongo/{startDate}/{lastDate}',
                                                    { 'startDate':  { value: startDate, defaultValue:'' } ,'lastDate':  { value: lastDate, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetFileLog' : function(startDate, lastDate, showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + helper.formatNamed('api/helper/logfile/{startDate}/{lastDate}',
                                                    { 'startDate':  { value: startDate, defaultValue:'' } ,'lastDate':  { value: lastDate, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetProjectVersion' : function( showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + 'api/helper/version',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPolicies", ['oimProxyMyDream', 'httpData', function(oimProxyMyDream, httpData){
        return {
                'GetConfigurationPayment' : function(numeroRamo, showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + helper.formatNamed('api/policies/configurationpayment?numeroRamo={numeroRamo}',
                                                    { 'numeroRamo':  { value: numeroRamo, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'UpdateConfigurationPayment' : function(request, showSpin){
                    return httpData['post'](oimProxyMyDream.endpoint + 'api/policies/configurationpayment',
                                         request, undefined, showSpin)
                },
                'IntegrateSignature' : function(request, showSpin){
                    return httpData['post'](oimProxyMyDream.endpoint + 'api/policies/integratesignature',
                                         request, undefined, showSpin)
                },
                'GetDocumentSignature' : function(numeroDocumento, showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + helper.formatNamed('api/policies/documentsignature/{numeroDocumento}',
                                                    { 'numeroDocumento':  { value: numeroDocumento, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'OpenDocumentSignature' : function(numeroDocumento, showSpin){
                    return httpData['post'](oimProxyMyDream.endpoint + helper.formatNamed('api/policies/opendocumentsignature/{numeroDocumento}',
                                                    { 'numeroDocumento':  { value: numeroDocumento, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetPaymentSummary' : function(numeroPoliza, numeroCuota, showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + helper.formatNamed('api/policies/paymentsummary/{numeroPoliza}/{numeroCuota}',
                                                    { 'numeroPoliza':  { value: numeroPoliza, defaultValue:'' } ,'numeroCuota':  { value: numeroCuota, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetPaymentSummaryToken' : function( showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + 'api/policies/paymentsummary',
                                         undefined, undefined, showSpin)
                },
                'GetValidatePolicy' : function(numeroPoliza, showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + helper.formatNamed('api/policies/policyvalidate/{numeroPoliza}',
                                                    { 'numeroPoliza':  { value: numeroPoliza, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPayment", ['oimProxyMyDream', 'httpData', function(oimProxyMyDream, httpData){
        return {
                'ProcessIpnPayment' : function( showSpin){
                    return httpData['post'](oimProxyMyDream.endpoint + 'api/payment/processpaymentipn',
                                         undefined, undefined, showSpin)
                },
                'ValidatePayment' : function(numeroPoliza, numeroRecibo, showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + helper.formatNamed('api/payment/validatepayment/{numeroPoliza}/{numeroRecibo}',
                                                    { 'numeroPoliza':  { value: numeroPoliza, defaultValue:'' } ,'numeroRecibo':  { value: numeroRecibo, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'SendMailPaymentDeferred' : function(request, showSpin){
                    return httpData['post'](oimProxyMyDream.endpoint + 'api/payment/sendpaymentmail',
                                         request, undefined, showSpin)
                },
                'ObtenerDocumentosPendientes' : function( showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + 'api/payment/pendingDocuments/count',
                                         undefined, undefined, showSpin)
                },
                'ObtenerDocumentosPorPagar' : function(request, showSpin){
                    return httpData['post'](oimProxyMyDream.endpoint + 'api/payment/pendingDocuments/searchByFilterList',
                                         request, undefined, showSpin)
                },
                'ObtenerDocumentosPorNumero' : function(request, showSpin){
                    return httpData['post'](oimProxyMyDream.endpoint + 'api/payment/pendingDocuments/searchByDocumentNumbers',
                                         request, undefined, showSpin)
                },
                'ObtenerPositiveBalance' : function(nroDocContratante, tipoDocContratante, codMoneda, showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + helper.formatNamed('api/payment/positiveBalances?nroDocContratante={nroDocContratante}&tipoDocContratante={tipoDocContratante}&codMoneda={codMoneda}',
                                                    { 'nroDocContratante':  { value: nroDocContratante, defaultValue:'' } ,'tipoDocContratante':  { value: tipoDocContratante, defaultValue:'' } ,'codMoneda':  { value: codMoneda, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ObtenerDestinationBank' : function(codMoneda, showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + helper.formatNamed('api/payment/destinationBankAccounts?codMoneda={codMoneda}',
                                                    { 'codMoneda':  { value: codMoneda, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GenerateTransferRequest' : function(request, showSpin){
                    return httpData['post'](oimProxyMyDream.endpoint + 'api/payment/transferRequest',
                                         request, undefined, showSpin)
                },
                'SaveNps' : function(request, showSpin){
                    return httpData['post'](oimProxyMyDream.endpoint + 'api/payment/transferRequest/nps',
                                         request, undefined, showSpin)
                },
                'GetTransferRequestRequested' : function(request, showSpin){
                    return httpData['post'](oimProxyMyDream.endpoint + 'api/payment/transferRequest/searchFilterList',
                                         request, undefined, showSpin)
                },
                'ObtenerSolicitudTransferencia' : function(transferRequestId, showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + helper.formatNamed('api/payment/transferRequest/{transferRequestId}',
                                                    { 'transferRequestId':  { value: transferRequestId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ObtenerVoucherTransferencia' : function(transferRequestId, showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + helper.formatNamed('api/payment/transferRequest/{transferRequestId}/vouchersFiles',
                                                    { 'transferRequestId':  { value: transferRequestId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyHome", ['oimProxyMyDream', 'httpData', function(oimProxyMyDream, httpData){
        return {
                'GetMainApplications' : function( showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + 'api/home/applications/main',
                                         undefined, undefined, showSpin)
                },
                'GetLegacyApplications' : function( showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + 'api/home/applications/legacy',
                                         undefined, undefined, showSpin)
                },
                'GetAccessProfile' : function(applicationCode, showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + helper.formatNamed('api/home/access/{applicationCode}',
                                                    { 'applicationCode':  { value: applicationCode, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetCarruseles' : function(applicationCode, showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + helper.formatNamed('api/home/carruseles/{applicationCode}',
                                                    { 'applicationCode':  { value: applicationCode, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'NotificationFilterUser' : function(userCode, showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + helper.formatNamed('api/home/filter/user?userCode={userCode}',
                                                    { 'userCode':  { value: userCode, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'SignatureFilterProduct' : function(product, showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + helper.formatNamed('api/home/filter/product?product={product}',
                                                    { 'product':  { value: product, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetManager' : function(perfil, officeCode, search, showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + helper.formatNamed('api/home/filter/manager/{perfil}/{officeCode}?search={search}',
                                                    { 'perfil':  { value: perfil, defaultValue:'' } ,'officeCode':  { value: officeCode, defaultValue:'' } ,'search':  { value: search, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetAgent' : function(perfil, officeCode, managerCode, search, showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + helper.formatNamed('api/home/filter/agent/{perfil}/{officeCode}/{managerCode}?search={search}',
                                                    { 'perfil':  { value: perfil, defaultValue:'' } ,'officeCode':  { value: officeCode, defaultValue:'' } ,'managerCode':  { value: managerCode, defaultValue:'' } ,'search':  { value: search, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'PaymentTray' : function(request, showSpin){
                    return httpData['post'](oimProxyMyDream.endpoint + 'api/home/payment/traypagination',
                                         request, undefined, showSpin)
                },
                'SignatureTray' : function(request, showSpin){
                    return httpData['post'](oimProxyMyDream.endpoint + 'api/home/signature/traypagination',
                                         request, undefined, showSpin)
                },
                'CalendarTray' : function(request, showSpin){
                    return httpData['post'](oimProxyMyDream.endpoint + 'api/home/calendar/traypagination',
                                         request, undefined, showSpin)
                },
                'CreateNotification' : function(request, showSpin){
                    return httpData['post'](oimProxyMyDream.endpoint + 'api/home/notification/insert',
                                         request, undefined, showSpin)
                },
                'GetNotifications' : function(type, count, showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + helper.formatNamed('api/home/notification/list?type={type}&count={count}',
                                                    { 'type':  { value: type, defaultValue:'' } ,'count':  { value: count, defaultValue:'10' }  }),
                                         undefined, undefined, showSpin)
                },
                'CheckReadNotifications' : function(request, showSpin){
                    return httpData['post'](oimProxyMyDream.endpoint + 'api/home/notification/read',
                                         request, undefined, showSpin)
                },
                'GetInformationCalendar' : function(perfil, showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + helper.formatNamed('api/home/information/calendar/{perfil}',
                                                    { 'perfil':  { value: perfil, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetInformationPendingReceipt' : function(perfil, showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + helper.formatNamed('api/home/information/invoice/{perfil}',
                                                    { 'perfil':  { value: perfil, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetInformationPendingSignature' : function(perfil, showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + helper.formatNamed('api/home/information/signature/{perfil}',
                                                    { 'perfil':  { value: perfil, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetInformationPoliciesSold' : function(perfil, showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + helper.formatNamed('api/home/information/policiessold/{perfil}',
                                                    { 'perfil':  { value: perfil, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetInformationPoliciesSoldAmount' : function(perfil, showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + helper.formatNamed('api/home/information/policiessoldamount/{perfil}',
                                                    { 'perfil':  { value: perfil, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetInformationRatio' : function(perfil, showSpin){
                    return httpData['get'](oimProxyMyDream.endpoint + helper.formatNamed('api/home/information/ratiointegralidad/{perfil}',
                                                    { 'perfil':  { value: perfil, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'TackerLogin' : function( showSpin){
                    return httpData['post'](oimProxyMyDream.endpoint + 'api/home/tracker/login',
                                         undefined, undefined, showSpin)
                },
                'TackerPagoDirecto' : function( showSpin){
                    return httpData['post'](oimProxyMyDream.endpoint + 'api/home/tracker/recibospendientes/pagar',
                                         undefined, undefined, showSpin)
                },
                'TackerVerDocumento' : function(numDocumento, showSpin){
                    return httpData['post'](oimProxyMyDream.endpoint + helper.formatNamed('api/home/tracker/docporfirmar/verdoc/{numDocumento}',
                                                    { 'numDocumento':  { value: numDocumento, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'TackerAplicaciones' : function(request, showSpin){
                    return httpData['post'](oimProxyMyDream.endpoint + 'api/home/tracker/aplicaciones',
                                         request, undefined, showSpin)
                },
                'TackerPendingPayment' : function( showSpin){
                    return httpData['post'](oimProxyMyDream.endpoint + 'api/home/tracker/recibospendientes/pending-payment',
                                         undefined, undefined, showSpin)
                }
        };
     }]);
});
