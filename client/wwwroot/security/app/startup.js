(function($window, p)
{
    require.config({ paths: p })
    // debugger;
    require(['system'], function(system)
    {
        // debugger;
        system.currentApp = system.apps.security;

        system.import(
            [system.lib.package,
             system.apps.security,
             system.apps.home],
            function(mainPackage, securityPackage){
                // debugger;
                require([mainPackage.lib.angular.name,
                  securityPackage.lib.appSecurity.name,
                  mainPackage.lib.constants.name], function(angular, app)
                  {
                      angular.element(window.document).ready(function() {
                          angular.bootstrap(window.document, ["appSecurity", function() {
                              angular.element(window.document).find('html').addClass('ng-app');
                          }]);
                      });
                  });
            });
            window.localStorage['CodigoAplicacion'] = system.currentApp.code;
    });

})(window, { system: '/system' });
