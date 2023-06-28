(function($window, p) {
  require.config({ paths: p });
  require(['system'], function(system) {
    system.currentApp = system.apps.grqc;
    
    system.import([
      system.lib.package,
      system.apps.grqc,
      system.apps.home
    ],
    function(mainPackage, grqcPackage) {
      console.log(grqcPackage.lib.appGrqc.name);
      require([
          mainPackage.lib.angular.name,
          grqcPackage.lib.appGrqc.name,
          mainPackage.lib.constants.name
        ],
        function(angular, app) {
          angular.element(window.document).ready(function() {
            angular.bootstrap(window.document, ['appGrqc', function() {
              angular.element(window.document).find('html').addClass('ng-app');
            }]);
          });
        }
      );
    });
    window.localStorage['CodigoAplicacion'] = system.currentApp.code;
  });
})(window, { system: '/system'});
