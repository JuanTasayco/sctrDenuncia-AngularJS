(function ($window, p) {
  require.config({ paths: p })

  require(['system'], function (system) {

    system.currentApp = system.apps.nsctr;

    system.import(
      [system.lib.package,
      system.apps.nsctr,
      system.apps.home],
      function (mainPackage, nsctrPackage) {
        require([mainPackage.lib.angular.name,
        nsctrPackage.lib.appNsctr.name,
        mainPackage.lib.constants.name], function (angular, app) {
          angular.element(window.document).ready(function () {
            angular.bootstrap(window.document, ["appNsctr", function () {
              angular.element(window.document).find('html').addClass('ng-app');
            }]);
          });
        });
      });
      window.localStorage['CodigoAplicacion'] = system.currentApp.code;
  });

})(window, { system: '/system' });