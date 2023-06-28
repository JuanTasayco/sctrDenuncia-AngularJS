(function($window, p)
{
    require.config({ paths: p, urlArgs: @@version })
    require(['system'], function(system)
    {
        
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
    });
    
})(window, { system: '/system' });