'use strict';
(function ($window, p) {
  require.config({ paths: p });
  require(['system'], function (system) {
    system.import(
      [system.lib.package,
      system.apps.byPass],
      function (mainPackage, byPassPackage) {
        require([mainPackage.lib.angular.name, 'app', mainPackage.lib.constants.name], function (angular, app) {
          angular.bootstrap(window.document, ['appByPass']);
        });
      });
  });

})(window, { system: '/system' });
