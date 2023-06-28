'use strict';

(function($window, p) {
  require.config({ paths: p });
  require(['system', 'sys'], function(system, sys) {
    system.currentApp = !system.apps.atencionsiniestrosagricola ? sys.app: system.apps.atencionsiniestrosagricola;
    system.import([
        system.lib.package,
        sys.app,
        system.apps.home
      ],
      function(mainPackage, mcPackage) {
        require([mainPackage.lib.constants.name], function(){
          require([
            mainPackage.lib.angular.name,
            mcPackage.lib.appAtencionsiniestrosagricola.name,
          ],
          function(ng) {
            ng.element($window.document).ready(function() {
              ng.bootstrap($window.document, ['atencionsiniestrosagricola.app', function() {
                ng.element($window.document).find('html').addClass('ng-app');
              }]);
            });
          });  
        });
        
      });
  });
}(window, { system: '/system', sys: '../sys' }));