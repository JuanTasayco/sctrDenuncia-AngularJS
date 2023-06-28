(function($window, p)
{
    require.config({ paths: p })
    // debugger;
    require(['system'], function(system)
    {
        // debugger;
        system.currentApp = system.apps.restos;

        system.import(
            [system.lib.package,
             system.apps.restos,
             system.apps.home],
            function(mainPackage, restosPackage){
                // debugger;
                require([mainPackage.lib.angular.name, 
                         restosPackage.lib.appRestos.name, 
                         mainPackage.lib.constants.name], function(angular, app)
                {
                    angular.element(window.document).ready(function() {
                        angular.bootstrap(window.document, ["appRestos", function() {
                            angular.element(window.document).find('html').addClass('ng-app');
                        }]);
                    });
                });     
            });
            window.localStorage['CodigoAplicacion'] = system.currentApp.code;
    });
    
})(window, { system: '/system' });