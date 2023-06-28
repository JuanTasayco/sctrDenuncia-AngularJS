(function($window, p) {
  require.config({ paths: p });
  require(['system'], function(system) {
    system.currentApp = system.apps.lettersGuarantee;

    system.import([
      system.lib.package,
      system.apps.lettersGuarantee,
      system.apps.home
    ],
    function(mainPackage, lettersGuaranteePackage) {
      require([
          mainPackage.lib.angular.name,
          lettersGuaranteePackage.lib.appCgw.name,
          mainPackage.lib.constants.name
        ],
        function(angular, app) {
          angular.element(window.document).ready(function() {
            angular.bootstrap(window.document, ['appCgw', function() {
              angular.element(window.document).find('html').addClass('ng-app');
            }]);
          });
        }
      );
    });
    window.localStorage['CodigoAplicacion'] = system.currentApp.code;
  });
})(window, { system: '/system'});
