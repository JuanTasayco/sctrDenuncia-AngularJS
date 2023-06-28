'use strict';

(function($window, p) {
  require.config({ paths: p });
  require(['system'], function(system) {
    system.currentApp = system.apps.reembolso;

    system.import([system.lib.package, system.apps.reembolso, system.apps.home], function(mainPackage, reembolsoPackage) {
      require([mainPackage.lib.angular.name, reembolsoPackage.lib.appReembolso.name, mainPackage.lib.constants.name], function(ng) {
        ng.element($window.document).ready(function() {
          ng.bootstrap($window.document, [
            'appReembolso',
            function() {
              ng.element($window.document).find('html').addClass('ng-app');
            }
          ]);
        });
      });
    });
    window.localStorage['CodigoAplicacion'] = system.currentApp.code;
  })
})(window, {system: '/system'});
