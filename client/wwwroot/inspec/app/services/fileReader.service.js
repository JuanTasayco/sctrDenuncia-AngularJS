'use strict';

define(['angular'], function(ng) {
  FileReaderService.$inject = ['$q'];

  function FileReaderService($q) {
    var factory = {
      readAsDataURL: readAsDataURL
    };

    function onLoad(reader, deferred, scope) {
      return function() {
        scope.$apply(function() {
          deferred.resolve(reader.result);
        });
      };
    }

    function onError(reader, deferred, scope) {
      return function() {
        scope.$apply(function() {
          deferred.reject(reader.result);
        });
      };
    }

    // function onProgress(reader, scope) {
    //   return function(event) {
    //     scope.$broadcast('fileProgress', {
    //       total: event.total,
    //       loaded: event.loaded
    //     });
    //   };
    // }

    function getReader(deferred, scope) {
      var reader = new FileReader();
      reader.onload = onLoad(reader, deferred, scope);
      reader.onerror = onError(reader, deferred, scope);
      // reader.onprogress = onProgress(reader, scope);
      return reader;
    }

    function readAsDataURL(file, scope) {
      var deferred = $q.defer();

      var reader = getReader(deferred, scope);
      reader.readAsDataURL(file);

      return deferred.promise;
    }

    return factory;
  }

  ng.module('appInspec').factory('FileReaderService', FileReaderService);
});
