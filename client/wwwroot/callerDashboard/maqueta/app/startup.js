(function($window, p)
{
    require.config({ paths: p })
    // debugger;
    require(['system'], function(system)
    {
        // debugger;
        system.currentApp = system.apps.callerDashboard;

        system.import(
            [system.lib.package,
             system.apps.callerDashboard,
             system.apps.home],
            function(mainPackage, callerDashboardPackage){
                // debugger;
                require([mainPackage.lib.angular.name, 
                         callerDashboardPackage.lib.appCallerDashboard.name, 
                         mainPackage.lib.constants.name], function(angular, app)
                {
                    angular.element(window.document).ready(function() {
                        angular.bootstrap(window.document, ["appCallerDashboard", function() {
                            angular.element(window.document).find('html').addClass('ng-app');
                        }]);
                    });
                });     
            });
    });
    
})(window, { system: '/system' });