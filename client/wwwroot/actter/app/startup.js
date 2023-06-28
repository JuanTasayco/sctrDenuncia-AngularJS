'use strict';

(function($window, p) {
  require.config({ paths: p });

  require(['system'], function(system) {
    system.import([system.lib.package, system.apps.actter, system.apps.home], function(mainPackage, appPackage) {
      require([
        mainPackage.lib.angular.name,
        appPackage.lib.generalConstant.name,
        appPackage.lib.app.name,
        mainPackage.lib.constants.name
      ], function(angular, generalConstant) {
        angular.element($window.document).ready(function() {
          angular.bootstrap($window.document, [
            generalConstant.APP_MODULE,
            function() {
              angular
                .element($window.document)
                .find('html')
                .addClass('ng-app');
            }
          ]);
        });
      });
    });
  });
})(window, { system: '/system' });
