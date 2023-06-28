(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants'], function(angular, constants){
    var module = angular.module("oim.proxyService.callerDashboard", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxyCallerDash', {
        endpoint: constants.system.api.endpoints['callerDash'],
        controllerDashboard: {
            actions : {
                'methodGet':{
                    name:  'Get',
                    path: 'api/Dashboard/all?countToCall={countToCall}&countToAssign={countToAssign}'
                },
                'methodGetAlerts':{
                    name:  'GetAlerts',
                    path: 'api/Dashboard/alerts'
                },
                'methodGetStadistics':{
                    name:  'GetStadistics',
                    path: 'api/Dashboard/stadistics'
                },
                'methodSummaryToCall':{
                    name:  'SummaryToCall',
                    path: 'api/Dashboard/summaryToCall/{countRecord}'
                },
                'methodSummaryToAssign':{
                    name:  'SummaryToAssign',
                    path: 'api/Dashboard/summaryToAssign/{countRecord}'
                },
                'methodListToAssign':{
                    name:  'ListToAssign',
                    path: 'api/Dashboard/listToAssign'
                },
                'methodListToCall':{
                    name:  'ListToCall',
                    path: 'api/Dashboard/listToCall'
                },
                'methodListAssigned':{
                    name:  'ListAssigned',
                    path: 'api/Dashboard/listAssigned'
                },
                'methodCountToCall':{
                    name:  'CountToCall',
                    path: 'api/Dashboard/countToCall'
                },
                'methodCountToAssign':{
                    name:  'CountToAssign',
                    path: 'api/Dashboard/countToAssign'
                },
                'methodCountAssignedToday':{
                    name:  'CountAssignedToday',
                    path: 'api/Dashboard/countAssignedToday'
                },
                'methodGetRequestServiceType':{
                    name:  'GetRequestServiceType',
                    path: 'api/Dashboard/requestServiceType'
                },
                'methodChangeToAttention':{
                    name:  'ChangeToAttention',
                    path: 'api/Dashboard/attention/{idRequest}'
                },
                'methodChangeToAssigned':{
                    name:  'ChangeToAssigned',
                    path: 'api/Dashboard/assigned/{idRequest}'
                },
            }
        }
    })



     module.factory("proxyDashboard", ['oimProxyCallerDash', 'httpData', function(oimProxyCallerDash, httpData){
        return {
                'Get' : function(countToCall, countToAssign, showSpin){
                    return httpData['get'](oimProxyCallerDash.endpoint + helper.formatNamed('api/Dashboard/all?countToCall={countToCall}&countToAssign={countToAssign}',
                                                    { 'countToCall':  { value: countToCall, defaultValue:'' } ,'countToAssign':  { value: countToAssign, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetAlerts' : function( showSpin){
                    return httpData['get'](oimProxyCallerDash.endpoint + 'api/Dashboard/alerts',
                                         undefined, undefined, showSpin)
                },
                'GetStadistics' : function( showSpin){
                    return httpData['get'](oimProxyCallerDash.endpoint + 'api/Dashboard/stadistics',
                                         undefined, undefined, showSpin)
                },
                'SummaryToCall' : function(countRecord, showSpin){
                    return httpData['get'](oimProxyCallerDash.endpoint + helper.formatNamed('api/Dashboard/summaryToCall/{countRecord}',
                                                    { 'countRecord':  { value: countRecord, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'SummaryToAssign' : function(countRecord, showSpin){
                    return httpData['get'](oimProxyCallerDash.endpoint + helper.formatNamed('api/Dashboard/summaryToAssign/{countRecord}',
                                                    { 'countRecord':  { value: countRecord, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ListToAssign' : function(query, showSpin){
                    return httpData['get'](oimProxyCallerDash.endpoint + helper.formatNamed('api/Dashboard/listToAssign',
                                                    { 'query':  { value: query, defaultValue:'', isQuery: true }  }),
                                         undefined, undefined, showSpin)
                },
                'ListToCall' : function(query, showSpin){
                    return httpData['get'](oimProxyCallerDash.endpoint + helper.formatNamed('api/Dashboard/listToCall',
                                                    { 'query':  { value: query, defaultValue:'', isQuery: true }  }),
                                         undefined, undefined, showSpin)
                },
                'ListAssigned' : function(query, showSpin){
                    return httpData['get'](oimProxyCallerDash.endpoint + helper.formatNamed('api/Dashboard/listAssigned',
                                                    { 'query':  { value: query, defaultValue:'', isQuery: true }  }),
                                         undefined, undefined, showSpin)
                },
                'CountToCall' : function( showSpin){
                    return httpData['get'](oimProxyCallerDash.endpoint + 'api/Dashboard/countToCall',
                                         undefined, undefined, showSpin)
                },
                'CountToAssign' : function( showSpin){
                    return httpData['get'](oimProxyCallerDash.endpoint + 'api/Dashboard/countToAssign',
                                         undefined, undefined, showSpin)
                },
                'CountAssignedToday' : function( showSpin){
                    return httpData['get'](oimProxyCallerDash.endpoint + 'api/Dashboard/countAssignedToday',
                                         undefined, undefined, showSpin)
                },
                'GetRequestServiceType' : function( showSpin){
                    return httpData['get'](oimProxyCallerDash.endpoint + 'api/Dashboard/requestServiceType',
                                         undefined, undefined, showSpin)
                },
                'ChangeToAttention' : function(idRequest, showSpin){
                    return httpData['put'](oimProxyCallerDash.endpoint + helper.formatNamed('api/Dashboard/attention/{idRequest}',
                                                    { 'idRequest':  { value: idRequest, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ChangeToAssigned' : function(idRequest, showSpin){
                    return httpData['put'](oimProxyCallerDash.endpoint + helper.formatNamed('api/Dashboard/assigned/{idRequest}',
                                                    { 'idRequest':  { value: idRequest, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);
});
