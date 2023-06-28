(function($window, p)
{
    require.config({ paths: p });
    require(['system'], function(system)
    {
        system.currentApp = system.apps.renovacion;
        
        system.import(
            [system.lib.package,
             system.apps.renovacion,
             system.apps.home],
            function(mainPackage, renovacionPackage){
                require([mainPackage.lib.angular.name, 
                        renovacionPackage.lib.appRenovacion.name, 
                         mainPackage.lib.constants.name], function(angular, app)
                {
                    angular.element(window.document).ready(function() {
                        angular.bootstrap(window.document, ["appReno", function() {
                            angular.element(window.document).find('html').addClass('ng-app');
                        }]);
                    });
                });     
            });
            window.localStorage['CodigoAplicacion'] = system.currentApp.code;
    });
    
})(window, { system: '/system' });