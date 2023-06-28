'use strict';

(function($window, p) {
  require.config({paths: p});
  require(['system'], function(system) {
    system.currentApp = system.apps.wp;

    system.import([system.lib.package, system.apps.wp, system.apps.home], function(mainPackage, wpPackage) {
      require([mainPackage.lib.angular.name, wpPackage.lib.appWp.name, mainPackage.lib.constants.name], function(ng) {
        ng.element($window.document).ready(function() {
          ng.bootstrap($window.document, [
            'appWp',
            function() {
              ng.element($window.document).find('html').addClass('ng-app');
            }
          ]);
        });
      });
    });
    window.localStorage['CodigoAplicacion'] = system.currentApp.code;
  });
})(window, {system: '/system'});
