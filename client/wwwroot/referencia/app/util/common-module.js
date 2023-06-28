'use strict';

define(['angular'], function(ng) {

  httpInterceptorFn.$inject = ['$q', '$rootScope', '$injector', '$log'];

  function httpInterceptorFn($q, $rootScope, $injector, $log) {
    return {
      responseError: function(rejection) {
        var statusCode = rejection.status || {},
          url = rejection.config.url || '';
        $log.error('Referencia Status Code: ' + statusCode + ' , URL: ' + url);
        return $q.reject(rejection);
      },
      response: function rFn(response) {
        if (response.data && response.data.OperationCode === 500) { // eslint-disable-line
          $rootScope.$emit('onBackendError');
        }
        return response;
      }
    };
  }

  configFn.$inject = ['$httpProvider', '$windowProvider'];

  function configFn($httpProvider, $windowProvider) {
    // https://github.com/arasatasaygin/is.js/blob/master/is.js#L530
    var userAgent = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '';

    // https://github.com/angular/angular.js/blob/v1.3.13/src/Angular.js#L185
    var msie = $windowProvider.$get().document.documentMode;

    if (/edge/i.test(userAgent) || msie) {
      // http://stackoverflow.com/questions/16971831/better-way-to-prevent-ie-cache-in-angularjs#answer-23682047
      if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
      }

      // disable IE ajax request caching
      $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Thu, 01 Jan 1970 00:00:00 GMT';
      // extra
      $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
      $httpProvider.defaults.headers.get.Pragma = 'no-cache';
    }

    $httpProvider.interceptors.push('httpReferenciaInterceptor');
  }

  var constants = {
    GOOGLE_MAP_URL: 'https://maps.google.com/maps/api/js?key=',
    API_KEY_GMAP: 'AIzaSyCNDgBq7yr5Z1O6HXnz-mfcoBd4KERmbM0'
  };

  return ng.module('CommonReferenciaModule', [])
    .config(configFn)
    .constant('ReferenciaConstants', constants)
    .factory('httpReferenciaInterceptor', httpInterceptorFn);
});
