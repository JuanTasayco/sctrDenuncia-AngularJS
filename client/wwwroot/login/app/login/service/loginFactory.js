define(['angular', 'constants'], function(angular, cons)
{
    var appLogin = angular.module("appLogin");
    
    appLogin.factory('loginFactory',['oimHttpSrv',function(oimHttpSrv)
    {
        var base = cons.system.api.url;
        return {
            authetication: function(credentials)
            {
               
                var data = "grant_type=password&username=" + credentials.username + "&password=" + credentials.password;
                    data += "&type=" + (credentials.type ? credentials.type: "2");
                    data += "&document=" + (credentials.document ? credentials.document: "");
        
               return oimHttpSrv.post(base + 'api/login', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            }

        }
    }]);
});