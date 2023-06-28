(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, 'callMonitor', ['angular', 'system'],
  function(angular, system) {
    angular.module('oim.caller.common', [])
      .constant('orderByTypes', {
        prioridad: {
          name: 'Prioridad',
          code: 'priority'
        },
        longerDuration: {
          name: 'Mayor Duración',
          code: 'LongerDuration'
        }

      })
      .constant('typeServices', {
        ambulance: {
          icon: 'ico-mapfre_175_ambulancia',
          code: '001',
          waitMax: 60
        },
        procurator: {
          icon: 'ico-mapfre_197_assitentemapfre',
          code: '004',
          waitMax: 60
        },
        mechanicalAssistance: {
          icon: 'ico-mapfre_189_auxiliomecanico',
          code: '003',
          waitMax: 60
        },
        crane: {
          icon: 'ico-mapfre_177_grua',
          code: '002',
          waitMax: 60,
        },
        hunter: {
          icon: 'ico-mapfre_332_hunter',
          code: '00001',
          waitMax: 60,
        },
        dateUpdate: {
          icon: 'ico-mapfre_43_editar',
          code: '000',
          waitMax: 60
        },
        legalAssistance: {
          icon: 'ico-mapfre_338_asistencia-legal',
          code: '013',
          waitMax: 60
        }
      }).factory('decoratorData', ['typeServices', function(typeServices) {
        function incidents(incidents) {
          angular.forEach(incidents, function(item) {
            var iconObj = _.find(typeServices, function(value, key) { return value.code == item.supplierCode });
            item.icon = iconObj ? iconObj.icon : null;
            item.waitMax = iconObj ? iconObj.waitMax : null;
            item.currentDurationSeconds = 0;
            item.lastDurationSeconds = 0;
            item.previewDurationSeconds = 0;
            if (item.currentDateTime && item.creationDate)
              item.currentDurationSeconds = Math.floor(Math.abs((new Date(item.currentDateTime) - new Date(item.creationDate)) / 1000));

            if (item.lastChangeState && item.creationDate)
              item.lastDurationSeconds = Math.floor(Math.abs((new Date(item.lastChangeState) - new Date(item.creationDate)) / 1000));

            if (item.previewChangedState && item.lastChangeState)
              item.previewDurationSeconds = Math.floor(Math.abs((new Date(item.lastChangeState) - new Date(item.previewChangedState)) / 1000));

            if (item.requestorName) {
              var parts = item.requestorName.split('-');
              if (parts.length > 1) {
                item.requestorName = parts.join(" ");
                item.requestorShortName = parts[0];
                item.requestorMotherLastName = parts[1];
              } else {
                item.requestorShortName = item.requestorName;
              }
            }
          })
        }
        return {
          incidents: incidents
        }
      }]).directive("dashTimer", ['$interval', '$filter', function($interval, $filter) {
        return {
          restrict: 'A',
          scope: {
            dashTimer: "="
          },
          link: function(scope, element, attr) {
            function tick() {

              var seconds = parseInt(scope.dashTimer);
              seconds = isNaN(seconds) ? 0 : seconds;
              scope.dashTimer = seconds + 1;
            }

            function render() {
              tick();
              element.html($filter('dashSecondsTimeSpan')(scope.dashTimer));
            }
            var seed = $interval(render, 1000);
            scope.$on('$destroy', function() {
              $interval.cancel(scope.dashTimer);
            });
            render();
          }
        }
      }]).filter('dashFixedLen', function() {
        return function(input, len) {
          input = input.toString();
          if (input.length >= len) return input;
          else return (1e4 + input + "").slice(-len);

        }
      }).filter('dashSecondsTimeSpan', ['$filter', function($filter) {
        return function(seconds, format) {

          var hours = Math.floor(seconds / 60 / 60)
          var days = Math.floor(hours / 24);
          if (hours > 0) {
            if (days > 0)
              return days + " dias " + $filter('date')(new Date(1970, 0, 1).setSeconds(seconds), 'HH:mm:ss');
            return $filter('date')(new Date(1970, 0, 1).setSeconds(seconds), 'HH:mm:ss');
          } else
            return $filter('date')(new Date(1970, 0, 1).setSeconds(seconds), 'mm:ss')
        }
      }]);

    angular.module('oim.caller.monitor', [])
      .factory("serviceMonitor", ['$timeout', '$q', function($timeout, $q) {
        function monitor(getData, $scop) {
          var $sc = $scop;
          var fnGetData = getData;
          var abort = false;
          var defer = {
            promise: {
              then: function(s, e, t) {
                this.success = s;
                this.error = e;
                this.try = t;
              }
            },
            resolve: function(response) {
              this.promise.success(response);
            },
            reject: function(response) {
              this.promise.error(response);
            }
          };

          function action() {
            var _p = getData();


            _p.then(function(resp) {
                if (!abort) {
                  defer.resolve(resp);
                  _again();
                }
              },
              function(resp) {
                if (!abort) {
                  defer.reject(resp);
                  _again();
                }
              });
          }

          function _begin() {
            action();
            abort = false;
            return defer.promise;
          }

          function _again() {
            if (!abort)
              $timeout(function() {
                action();
              }, 15000);
          }

          function _stop() {
            abort = true;
          }

          $sc.$on('$destroy', function() {
            _stop();
          });
          this.stop = _stop;
          this.begin = _begin;
          return this;
        }
        return monitor;
      }]);

  });