'use strict';

(function($window, p) {
  require.config({ paths: p });
  require(['system'], function(system) {
    system.currentApp = system.apps.callerDashboard;
    system.import([
        system.lib.package,
        system.apps.callerDashboard,
        system.apps.home
      ],
      function(mainPackage, dashPackage) {

        require([
            mainPackage.lib.angular.name,
            dashPackage.lib.appCallerDashboard.name,
            mainPackage.lib.constants.name
          ],
          function(ng) {

            ng.element($window.document).ready(function() {
              ng.bootstrap($window.document, ['oim.caller.dashboard', function() {
                ng.element($window.document).find('html').addClass('ng-app');
              }]);
            });
          });
      });
  });
}(window, { system: '/system' }));