(function($window, p)
{
    require.config({ paths: p })
    // debugger;
    require(['system'], function(system)
    {
        // debugger;
        system.currentApp = system.apps.enel;

        system.import(
            [system.lib.package,
             system.apps.enel,
             system.apps.home],
            function(mainPackage, enelPackage){
                // debugger;
                require([mainPackage.lib.angular.name, 
                         enelPackage.lib.appEnel.name, 
                         mainPackage.lib.constants.name], function(angular, app)
                {
                    angular.element(window.document).ready(function() {
                        angular.bootstrap(window.document, ["appEnel", function() {
                            angular.element(window.document).find('html').addClass('ng-app');
                        }]);
                    });
                });     
            });
    });
    
})(window, { system: '/system' });