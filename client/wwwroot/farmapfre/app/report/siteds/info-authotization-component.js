define([
    'angular', 'lodash', 'fileSaver', 'constants', 'farmConstants', 'moment'
  ], function(ng, _, fileSaver, constants, farmConstants, moment) {
    infoAuthorizationController.$inject = ['proxyProduct', '$scope', 'mpSpin', '$http', '$q', 'mModalAlert'];
    function infoAuthorizationController(proxyProduct, $scope, mpSpin, $http, $q, mModalAlert) {
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

        proxyProduct.GetProducts().then(function(response){
          vm.products = response;
        });

        getReportTypes();
        getChannels();

        vm.generate = function() {
          if($scope.frm.firstDate && $scope.frm.lastDate) {
            var obj = { 
              reportTypeId: $scope.frm.reportType.id,
              companyId: $scope.frm.product.id,
              channelId: $scope.frm.channel.id,
              firstDate: $scope.frm.firstDate, 
              lastDate: $scope.frm.lastDate 
            };

            var params = _.assign(obj);
            downloadSiteds(params).then(function(data) {
              mModalAlert.showSuccess('El reporte se generó sin problemas.', '¡Descarga Exitosa!');
            }, function(e) {
              mModalAlert.showError('Ocurrió un error, comuníquece con el administrador.', '¡Error!');
            });
          }
        }

        function downloadSiteds(request) {
          return downloableReport(request, 'api/siteds/report/authorization/download');
        }

        function downloableReport(request, url) {
          var config = { responseType: 'arraybuffer' };
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
          $scope.frm.lastDate = $scope.frm.lastDate == null ? undefined : $scope.frm.lastDate;
          if ($scope.frm.firstDate && ($scope.frm.firstDate > $scope.frm.lastDate || !valMonth($scope.frm.firstDate, $scope.frm.lastDate))) {
            $scope.frm.firstDate = null;
          }
        });
        
        $scope.$watch('frm.lastDate', function() {
          $scope.frm.lastDate = $scope.frm.lastDate == null ? undefined: $scope.frm.lastDate;
          if ($scope.frm.lastDate && ($scope.frm.firstDate > $scope.frm.lastDate || !valMonth($scope.frm.firstDate, $scope.frm.lastDate))) {
            $scope.frm.lastDate = null;
          }
        });

        function getReportTypes() {
          vm.reportTypes = farmConstants.reporteTypes;
        }

        function getChannels() {
          vm.channels = farmConstants.channels;
        }
    }
    return ng.module('farmapfre.app')
      .controller('infoAuthorizationController', infoAuthorizationController)
      .component('infoAuthorization', {
        templateUrl: '/farmapfre/app/report/siteds/info-authotization-component.html',
        controller: 'infoAuthorizationController',
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