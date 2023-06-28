define([
  'angular', 'constants'
], function(angular, constants) {

  var appSctr = angular.module('sctrDenuncia.app');

  appSctr.factory('externalServices', ['$http', '$q', 'mpSpin',
    function($http, $q, mpSpin) {

      function getCgwSecurityGetRole(grupoAplicacion, showSpin) {
        var deferred = $q.defer();

        $http.get(constants.system.api.endpoints['cgw'] + 'api/security/role/' +  grupoAplicacion, {
          eventHandlers: {
            progress: function(c) {
            }
          },
          uploadEventHandlers: {
            progress: function(e) {
              if(showSpin) mpSpin.start();
            }
          }
        })
        .success(function(response) {
          if(showSpin) mpSpin.end();
          deferred.resolve(response);
        })
        .error(function (response) {
          if(showSpin) mpSpin.end();
          deferred.reject(response);
        });
  
        return deferred.promise;
      }

      function getCgwListDiagnostic(params, showSpin) {
        var deferred = $q.defer();

        $http.post(constants.system.api.endpoints['cgw'] + 'api/diagnostic/diagnostics', params, { 
          headers: { 'Content-Type': 'application/json' }, 
          eventHandlers: {
            progress: function(c) {
            }
          },
          uploadEventHandlers: {
            progress: function(e) {
              if(showSpin) mpSpin.start();
            }
          }
        })
        .success(function(response) {
          if(showSpin) mpSpin.end();
          deferred.resolve(response);
        })
        .error(function (response) {
          if(showSpin) mpSpin.end();
          deferred.reject(response);
        });
  
        return deferred.promise;
      }

      function getCgwListDoctor(params, showSpin) {
        var deferred = $q.defer();

        $http.post(constants.system.api.endpoints['cgw'] + 'api/doctor/doctors', params, { 
          headers: { 'Content-Type': 'application/json' }, 
          eventHandlers: {
            progress: function(c) {
            }
          },
          uploadEventHandlers: {
            progress: function(e) {
              if(showSpin) mpSpin.start();
            }
          }
        })
        .success(function(response) {
          if(showSpin) mpSpin.end();
          deferred.resolve(response);
        })
        .error(function (response) {
          if(showSpin) mpSpin.end();
          deferred.reject(response);
        });
  
        return deferred.promise;
      }

      function getCgwAfilliateHistorial(params, showSpin) {
        var deferred = $q.defer();

        $http.post(constants.system.api.endpoints['cgw'] + 'api/affiliate/record', params, { 
          headers: { 'Content-Type': 'application/json' }, 
          eventHandlers: {
            progress: function(c) {
            }
          },
          uploadEventHandlers: {
            progress: function(e) {
              if(showSpin) mpSpin.start();
            }
          }
        })
        .success(function(response) {
          if(showSpin) mpSpin.end();
          deferred.resolve(response);
        })
        .error(function (response) {
          if(showSpin) mpSpin.end();
          deferred.reject(response);
        });
  
        return deferred.promise;
      }

      return {
        getCgwSecurityGetRole: getCgwSecurityGetRole,
        getCgwListDiagnostic: getCgwListDiagnostic,
        getCgwListDoctor: getCgwListDoctor,
        getCgwAfilliateHistorial: getCgwAfilliateHistorial
      };
    }
  ]);
});