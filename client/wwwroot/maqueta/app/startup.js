(function($window, p)
{
    require.config({ paths: p })
    // debugger;
    require(['system'], function(system)
    {
        // debugger;
        system.currentApp = system.apps.maqueta;

        system.import(
            [system.lib.package,
             system.apps.maqueta,
             system.apps.home],
            function(mainPackage, maquetaPackage){
                // debugger;
                require([mainPackage.lib.angular.name, 
                         maquetaPackage.lib.appMaqueta.name, 
                         mainPackage.lib.constants.name], function(angular, app)
                {
                    angular.element(window.document).ready(function() {
                        angular.bootstrap(window.document, ["appMaqueta", function() {
                            angular.element(window.document).find('html').addClass('ng-app');
                        }]);
                    });
                });     
            });
    });
    
})(window, { system: '/system' });