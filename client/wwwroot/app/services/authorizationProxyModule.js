(function($root, deps, action){
    define(deps, action)
})
(this, ['angular'], function(angular){
   angular.module('oim.authorization.proxy', []).
    factory('authoObjectsProxy',['$http', function($http){
        var host = constants.system.api.endpoints.security;

        return {
            get_menus: function(){
                return $http.get(host + 'api/home/menu');
                // return $http.get(host + 'api/home/submenu/EMISA');
            },
            get_widget: function(){
                $http.get(host + 'api/home/widget');
            },

            get_all_menu: function(){
                return $http.get(host + 'api/home/aplicaciones');
            }
        }
    }]);
});
