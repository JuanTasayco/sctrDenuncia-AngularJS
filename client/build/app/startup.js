(function($window, p)
{
    require.config({ paths: p, urlArgs: @@version })
    require(['system'], function(system)
    {
        
        system.import(
            [system.lib.package,
             system.apps.home],
            function(mainPackage, homePackage){
                require([mainPackage.lib.angular.name,'app', mainPackage.lib.constants.name], function(angular, app)
                {
                    
                    angular.bootstrap(window.document, ['appHome']);
                });     
            });
    });
    
})(window, { system: '/system' });