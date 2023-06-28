'use strict';

(function($window, p) {
  require.config({paths: p});

  require(['system'], function(system) {
    system.currentApp = system.apps.landing;

    system.import([
      system.lib.package,
      system.apps.landing,
      system.apps.home
    ], function(mainPackage, appPackage) {
      require([
        mainPackage.lib.angular.name,
        appPackage.lib.appConstant.name,
        appPackage.lib.appLanding.name,
        mainPackage.lib.constants.name
      ], function(angular, appConstant) {
        angular.element($window.document).ready(function() {
          angular.bootstrap($window.document, [appConstant.appModule, function() {
            angular.element($window.document).find('html').addClass('ng-app');
          }]);
        });
      });
    });
  });

})(window, {system: '/system'});
