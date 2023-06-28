'use strict';
(function($window, p)
{
    require.config({ paths: p, urlArgs: @@version })
    require(['system'], function(system)
    {
        system.import(
            [system.lib.package,
             system.apps.login],
            function(mainPackage, loginPackage){
                require([mainPackage.lib.angular.name,'app', mainPackage.lib.constants.name], function(angular, app)
                {
                    angular.bootstrap(window.document, ['appLogin']);
                });     
            });
    });
    
})(window, { system: '/system' });
