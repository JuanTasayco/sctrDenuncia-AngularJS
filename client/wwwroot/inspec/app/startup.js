'use strict';
(function($window, p) {
  require.config({paths: p});

  require(['system'], function(system) {
    system.currentApp = system.apps.inspec;

    system.import([system.lib.package, system.apps.inspec, system.apps.home], function(mainPackage, inspecPackage) {
      require([
        mainPackage.lib.angular.name,
        inspecPackage.lib.appInspec.name,
        mainPackage.lib.constants.name
      ], function(ng) {
        ng.element($window.document).ready(function() {
          ng.bootstrap($window.document, [
            'appInspec',
            function() {
              ng
                .element($window.document)
                .find('html')
                .addClass('ng-app');
            }
          ]);
        });
      });
    });
  });
})(window, {system: '/system'});
