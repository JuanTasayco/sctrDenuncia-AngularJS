define([
  'angular', 'helper', 'lodash',
], function(angular, helper, _) {
  //'use strict';

  angular.module('oim.wrap.gaia.httpSrv', [])
    .factory('oimHttpSrv', ['$http', function(HttpSrv) {

      return {
        get_g: HttpSrv.get,
        'delete_g': HttpSrv['delete'],
        head_g: HttpSrv.head,
        jsonp_g: HttpSrv.jsonp,
        post_g: HttpSrv.post,
        put_g: HttpSrv.put,
        post: HttpSrv.post
      };
    }]).factory('httpData', ['$http', '$q', function($http, $q) {
      var acc2 = 0;
      var spin;
      function spinner() {
        var injector, mpSpin;
        try {
          injector = angular.injector(['oim.theme.service']);
          mpSpin = injector.get('mpSpin');

        } catch (e) {
          console.warn('No found mpSpin')
        } finally {}
        return {
          start: function(value) {
            if (mpSpin) mpSpin.start(value);
          },
          end: function() {
            if (mpSpin) mpSpin.end();
          }
        }
      }

      function wrapPromise(promise, withSpin, isDownload) {

        if (!!withSpin === true) {
            spin = spinner();
            spin.start(withSpin);
          ++acc2;
        }
        var defer = $q.defer();

        function end() {
          if (!!withSpin === true) {
            --acc2;
            if (acc2 === 0) {
              spin.end();
            }
          }
        }
        promise.then(function success(response) {
            if (
                response !== undefined &&
                response !== null &&
                response.data !== undefined &&
                response.data !== null
            ) {
              if (isDownload) {
                var defaultFileName = '';
                var type = response.headers('Content-Type');
                var disposition = response.headers('Content-Disposition');
                if (disposition) {
                  var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
                  if (match[1]) defaultFileName = match[1];
                }
                defer.resolve({ defaultFileName: defaultFileName, mimeType: type, file: response.data });
              } else {
                defer.resolve(response.data);
              }
            }
            else {
              defer.resolve(response)
            }
            end();
          },
          function error(response) {
            defer.reject(response);
            end();
          },
          function _finally(response) {
            defer.reject(response);
            end();
          });
        return defer.promise;
      }
      return {
        get: function(url, data, config, showSpin) { return wrapPromise($http.get(url, data, config), showSpin) },
        post: function(url, data, config, showSpin) { return wrapPromise($http.post(url, data, config), showSpin) },
        head: function(url, data, config, showSpin) { return wrapPromise($http.head(url, data, config), showSpin) },
        put: function(url, data, config, showSpin) { return wrapPromise($http.put(url, data, config), showSpin) },
        'delete': function(url, data, config, showSpin) { return wrapPromise($http['delete'](url, data, config), showSpin) },
        jsonp: function(url, data, config, showSpin) { return wrapPromise($http.jsonp(url, data, config), showSpin) },
        patch: function(url, data, config, showSpin) { return wrapPromise($http.patch(url, data, config), showSpin) },
        getSpin: function(url, data, config) { return wrapPromise($http.get(url, data, config), true) },
        postSpin: function(url, data, config) { return wrapPromise($http.post(url, data, config), true) },
        headSpin: function(url, data, config) { return wrapPromise($http.head(url, data, config), true) },
        putSpin: function(url, data, config) { return wrapPromise($http.put(url, data, config), true) },
        'deleteSpin': function(url, data, config) { return wrapPromise($http['delete'](url, data, config), true) },
        jsonpSpin: function(url, data, config) { return wrapPromise($http.jsonp(url, data, config), true) },
        patchSpin: function(url, data, config) { return wrapPromise($http.patch(url, data, config), true) },
        postDownload: function(url, data, config, showSpin) { return wrapPromise($http.post(url, data, config), showSpin, true) },
        getDownload: function(url, config, showSpin) { return wrapPromise($http.get(url, config), showSpin, true) }
      }
    }]).config(['$provide', '$injector', function($provide, $injector) {
      function frmDelegate($delegate) {
        var form = $delegate[0];

        (function(nativeController) {
          FormController.$inject = ['$element', '$attrs', '$scope', '$animate', '$interpolate', '$timeout', '$rootScope'];

          function FormController(element, attrs, $scope, $animate, $interpolate, $timeout, $rootScope) {
            nativeController.apply(this, arguments);
            var addcontrol = this.$addControl
            var controls = [];
            this.$addControl = function(control) {
              addcontrol.apply(this, arguments);
              controls.push(control);
            }

            this.markAsPristine = function() {
              $timeout(function() {
                  $(element).find('.ng-invalid input, .ng-invalid select, .ng-invalid textarea, input.ng-invalid').first().focus();
                  var vActiveElement = $(element).find('.ng-invalid input, .ng-invalid select, .ng-invalid textarea, input.ng-invalid').first();
                  $rootScope.$broadcast('newPositionScroll', vActiveElement);
              }, 400);

              angular.forEach(controls, function(item) {
                item.$pristine = false;
              });
            }
          }
          form.controller = FormController;
        })
        (form.controller)

        return $delegate
      }

      function ngModelDelegate($delegate) {
        var ngModel = $delegate[0];
        (function(nativeCompile) {
          function ngModelCompile(element) {
            var prepost = nativeCompile.apply(this, arguments);
            var nativePre = prepost.pre;
            prepost.pre = function(scope, element, attr, ctrls) {
              nativePre.apply(this, arguments);
              var ctrl = ctrls[0];
              ctrl.focus = function() {
                $timeout(function() {
                  $(element).find('input, select').focus();
                }, 0);
              }
            }
            return prepost;
          }
          ngModel.compile = ngModelCompile;
        })(ngModel.compile)
        return $delegate;
      }
      $provide.decorator('formDirective', frmDelegate)
      $provide.decorator('ngFormDirective', frmDelegate)

      $provide.decorator('ngModelDirective', ngModelDelegate)
    }])
    .config(['$provide', '$injector', function($provide, $injector) {
      function decq($delegate, $rootScope) {
        var all = $delegate.all;

        $delegate.all = function(values, spin) {
          function spinner() {
            var fact = null,
              progress = null;

            if (spin === true || (angular.isObject(spin) && (spin.type == 'spin' || !spin.type))) {
              try {
                fact = angular.injector(['oim.theme.service']).get('mpSpin');
              } catch (e) {
                console.warn('No found mpSpin')
              }


            }
            if (angular.isObject(spin) && spin.type == 'progress') {
              try {
                progress = angular.injector(['oim.theme.service']).get('oimProgress');
              } catch (e) {
                console.warn('No found oimProgress')
              }
            }
            return {
              start: function() {
                var a = fact ? fact["start"]() : progress ? progress["start"]() : null;
              },
              end: function() {
                var a = fact ? fact["end"]() : progress ? progress["end"]() : null;
              },
              set: function(v) {
                if (progress) {

                  progress.set(v);
                }
              }
            }
          }
          if (!!spin === true) {
            var totalArraived = 0;
            var s = spinner();
            $rootScope.cancelSpin = true;
            s.start();
            var update = function() {
              totalArraived++;
              s.set(totalArraived / values.length * 100);

            }
            var close = function() {
              s.set(100);
              window.setTimeout(function() {
                s.end();
                delete $rootScope.cancelSpin;
              }, 200)

            }
            var end = function() {
              close();
            }
            angular.forEach(values, function(p) {
              if (p)
                p.then(function() { update(); }, function() { update(); });
            });
          }
          var promise = all.call($delegate, values);
          promise.then(end, end);

          return promise;

        }
        return $delegate;
      }

      $provide.decorator('$q', decq)
    }]).config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('trustedInterceptor');
    }]).factory('trustedInterceptor', ['$sce', '$q', '$window', '$injector', function($sce, $q, $window, $injector) {

      var clientIp = $window.localStorage['clientIp'];
      if (!clientIp) {
        setTimeout(function() { getClientIp() });
      }

      function getClientIp() {
        var $http = $injector.get('$http');
        $http({ method: 'GET', url: 'https://jsonip.com', skipAuthorization: true })
          .then(function(response) {
            $window.localStorage['clientIp'] = response.data.ip;
          });
      }

      return {
        request: function(config) {
          if (config.headers &&
            config.headers['Content-Type'] &&
            config.headers['Content-Type'].indexOf('application/json') != -1) {

            if (angular.isObject(config.data))
              config.data = helper.clone(config.data, undefined, function(value) {
                if (angular.isString(value)) {
                  value = (value || "").replace(new RegExp("<", 'g'), "&lt;").replace(new RegExp(">", 'g'), "&gt;")
                }
                return value;
              })
          }

          var appCodeSubMenu = $window.localStorage['appCodeSubMenu'];
          var codApli = $window.localStorage['CodigoAplicacion'];
          var clientIp = $window.localStorage['clientIp'];
          if (appCodeSubMenu == 'TRANSPORTE'){
            codApli = appCodeSubMenu;
          }
          config.headers = _.assign(config.headers, {cod_apli: codApli, ip_origen: clientIp});

          return config;
        },
        requestError: function(rejection) {
          return $q.reject(rejection);
        },
        response: function(response) {
          return response;
        },
        responseError: function(rejection) {
          return $q.reject(rejection);

        }
      }
    }]);

  angular.module('oim.wrap.gaia.cookieSrv', []).factory('mCookieSrv', [function() {
    return {
      getCookie: function() {},
      setCookie: function() {},
      removeCookie: function() {}
    };
  }]);
});
