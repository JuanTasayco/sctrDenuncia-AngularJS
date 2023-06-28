'use strict';

(function($window, p) {
  require.config({ paths: p });
  require(['system', 'sys'], function(system, sys) {
    system.currentApp = !system.apps.medicalCenter ? sys.app: system.apps.medicalCenter;
    system.import([
        system.lib.package,
        sys.app,
        system.apps.home
      ],
      function(mainPackage, mcPackage) {
        require([mainPackage.lib.constants.name], function(){
          //constants.system.api.endpoints['medicalCenter'] = 'http://localhost:60067/'
          //constants.system.api.endpoints['medicalCenter'] = 'http://10.160.120.214/oim_wdrog/'
          require([
            mainPackage.lib.angular.name,
            mcPackage.lib.appMedicalCenter.name,
          ],
          function(ng) {
            ng.element($window.document).ready(function() {
              ng.bootstrap($window.document, ['medicalCenter.app', function() {
                ng.element($window.document).find('html').addClass('ng-app');
              }]);
            });
          });  
        });
        
      });
  });
}(window, { system: '/system', sys: '../sys' }));