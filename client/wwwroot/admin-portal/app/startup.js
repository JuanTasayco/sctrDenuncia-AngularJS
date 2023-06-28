'use strict';

(function($window, p) {
  require.config({paths: p});
  require(['system'], function(system) {
    system.currentApp = system.apps.ap;

    system.import([system.lib.package, system.apps.ap, system.apps.home], function(mainPackage, proyPackage) {
      require([
        mainPackage.lib.angular.name,
        proyPackage.lib.coreConstants.name,
        proyPackage.lib.app.name,
        mainPackage.lib.constants.name
      ], function(ng, coreConstants) {
        ng.element($window.document).ready(function() {
          ng.bootstrap($window.document, [
            coreConstants.ngMainModule,
            function() {
              ng.element($window.document)
                .find('html')
                .addClass('ng-app');
            }
          ]);
        });
      });
    });
  });
})(window, {system: '/system'});
