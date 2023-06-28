define([
    'angular', 'lodash', 'fileSaver', 'constants', 'moment'
  ], function(ng, _, fileSaver, constants, moment) {
    modalReportInfoSendSmsEmailController.$inject = ['$scope', '$timeout', 'mpSpin', '$http', '$q', 'mModalAlert'];
    function modalReportInfoSendSmsEmailController($scope, $timeout, mpSpin, $http, $q, mModalAlert) {
        var vm = this;
        $scope.dateFormat = 'dd/MM/yyyy';
        $scope.mask = '99/99/9999';
        $scope.frm = {};
        
        $scope.nFisrtDate_options = {
          minDate: null
        };
        $scope.nLastDate_options = {
          minDate: null
        };

        vm.generate = function() {
          if($scope.frm.firstDate && $scope.frm.lastDate) {
            var obj = { firstDate: $scope.frm.firstDate, lastDate: $scope.frm.lastDate };
            var params = _.assign(obj);
            downloadSiteds(params).then(function(data) {
              $timeout(function(){
                vm.close();
              }, 500);
              mModalAlert.showSuccess('El reporte se generó sin problemas.', '¡Descarga Exitosa!');
            }, function(e) {
              mModalAlert.showError('Ocurrió un error, comuníquece con el administrador.', '¡Error!');
            });
          }
        }

        function downloadSiteds(request) {
          return downloableReport(request, 'api/insured/resend/report/download');
        }

        function downloableReport(request, url) {
          var config = {responseType:'arraybuffer'};
          var deferred = $q.defer();
          mpSpin.start();
          $http
            .post(constants.system.api.endpoints.farmapfre + url, request, config)
            .success(
              function(data, status, headers) {
                var type = headers('Content-Type');
                var disposition = headers('Content-Disposition');
                var defaultFileName = '';
                if (disposition) {
                  var match = disposition.match(/.*filename="?([^;"]+)"?.*/);
                  if (match[1]) {defaultFileName = match[1];}
                }
                defaultFileName = defaultFileName.replace(/[<>:"/\\|?*]+/g, '_');
                var blob = new Blob([data], {type: type});
                fileSaver(blob, defaultFileName);
                deferred.resolve(defaultFileName);
                mpSpin.end();
              },
              function(e) {
                var e = deferred.reject(e);
                mpSpin.end();
              }
            )
            .error(function(data, e) {
              mpSpin.end();
              deferred.reject(data);
            });
          return deferred.promise;
        }

        function valMonth(f1, f2) {
          if( (f1 && f2) && moment(f2) > moment(f1).add(6, 'M')) {
            return false;
          }
          return true;
        }

        $scope.$watch('frm.firstDate', function() {
          if ($scope.frm.firstDate && ($scope.frm.firstDate > $scope.frm.lastDate || !valMonth($scope.frm.firstDate, $scope.frm.lastDate))) {
            $scope.frm.firstDate = null;
          }
        });

        $scope.$watch('frm.lastDate', function() {
          if ($scope.frm.lastDate && ($scope.frm.firstDate > $scope.frm.lastDate || !valMonth($scope.frm.firstDate, $scope.frm.lastDate))) {
            $scope.frm.lastDate = null;
          }
        });
    }
    return ng.module('farmapfre.app')
      .controller('modalReportInfoSendSmsEmailController', modalReportInfoSendSmsEmailController)
      .component('mfpModalReportInfoSendEmail', {
        templateUrl: '/farmapfre/app/resend/affiliate/modalReportInfoSendSmsEMail/modal-report-info-send-sms-email-component.html',
        controller: 'modalReportInfoSendSmsEmailController',
        bindings: {
          close: '&'
        }
      })
      .directive('preventDefault', function() {
        return function(scope, element, attrs) {
            angular.element(element).bind('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
            });
        }
      });
  });
  