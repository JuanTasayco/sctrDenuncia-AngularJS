(function($window, p)
{
    require.config({ paths: p })
    require(['system'], function(system)
    {
        system.currentApp = system.apps.pericial;

        system.import(
            [system.lib.package,
             system.apps.pericial,
             system.apps.home],
            function(mainPackage, pericialPackage){
                require([mainPackage.lib.angular.name,
                         pericialPackage.lib.appPericial.name,
                         mainPackage.lib.constants.name], function(angular, app)
                {
                    angular.element(window.document).ready(function() {
                        angular.bootstrap(window.document, ["appPericial", function() {
                            angular.element(window.document).find('html').addClass('ng-app');
                        }]);
                    });
                });
            });
    });

})(window, { system: '/system' });
