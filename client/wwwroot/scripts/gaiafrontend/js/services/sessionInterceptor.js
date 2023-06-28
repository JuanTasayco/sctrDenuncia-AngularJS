/*global angular */
angular.module('sessionInterceptor', [])
    .factory('sessionInterceptor', ['SessionConfig', 'SessionCounterSrv', '$q', function (SessionConfig, SessionCounterSrv, $q) {
        function sessionInspector(config) {
            if(SessionConfig.time){
                SessionCounterSrv.reset();
            }
            return config;
        }
        return {
            request: sessionInspector
        };
    }])

