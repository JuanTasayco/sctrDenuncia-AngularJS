'use strict';

(function($window, p) {
  require.config({ paths: p });
  require(['system'], function(system) {
    system.currentApp = system.apps.gcw;

    system.import([
      system.lib.package,
      system.apps.gcw,
      system.apps.home
    ],
    function(mainPackage, gcwPackage) {
      require([
        mainPackage.lib.angular.name,
        gcwPackage.lib.appGcw.name,
        mainPackage.lib.constants.name
      ],
      function(ng) {
        ng.element(window.document).ready(function() {
          ng.bootstrap(window.document, ['appGcw', function() {
            ng.element(window.document).find('html').addClass('ng-app');
          }]);
        });
      });
    });
    window.localStorage['CodigoAplicacion'] = system.currentApp.code;
  });
}(window, { system: '/system'}));
