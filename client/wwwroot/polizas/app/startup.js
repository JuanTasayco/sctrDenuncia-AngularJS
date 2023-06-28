(function($window, p)
{
    require.config({ paths: p });
    require(['system'], function(system)
    {
        system.currentApp = system.apps.polize;
        
        system.import(
            [system.lib.package,
             system.apps.polize,
             system.apps.home],
            function(mainPackage, polizePackage){
                require([mainPackage.lib.angular.name, 
                         polizePackage.lib.appPolizas.name, 
                         mainPackage.lib.constants.name], function(angular, app)
                {
                    angular.element(window.document).ready(function() {
                        angular.bootstrap(window.document, ["appAutos", function() {
                            angular.element(window.document).find('html').addClass('ng-app');
                        }]);
                    });
                });     
            });
            window.localStorage['CodigoAplicacion'] = system.currentApp.code;
    });
    
})(window, { system: '/system' });