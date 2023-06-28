(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'mcReportController', ['angular','lodash', 'system'],
    function(angular, _, system) {
      angular.module('medicalCenter.app')
      .controller('mcReportController', ['$scope', '$state', 'medicalCenterReport', function($scope, $state, medicalCenterReport){
        
        $scope.reportSettings = getSetting();
        function getSetting(){
          for (var key in medicalCenterReport) {
            if (medicalCenterReport.hasOwnProperty(key)) {
              var element = medicalCenterReport[key];
              if(key.toUpperCase() == $state.current.name.toUpperCase())
                return element;
            }
          }
          return medicalCenterReport.medicalConsultationsBySpecialty;
        }
      }]);
    });