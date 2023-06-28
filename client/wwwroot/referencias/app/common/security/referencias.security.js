(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'lodash', 'system'],
  function(angular, constants, _, system) {

  angular.module('referencias.security',['oim.proxyService.Login'])

    .factory('referenciasAuthorize',
      ['$window', '$q','proxyMenu','$q',
      function($window, $q,proxyMenu,$q) {

        var APP_CODE = system.currentApp.code;
        var _self = this;
        _self.accessDenied  = false;

        var _setAccessDenied = function (boolean) {
          _self.accessDenied = boolean;
        };
  
        var _getAccessDenied = function () {
          return _self.accessDenied;
        };

        function _isAuthorized() {
          var defer = $q.defer();
          proxyMenu.GetMenu(false).then( function(response){
            if(response.data.length){
              var access = _.find(response.data, function (items) {
                return items.codigo == APP_CODE;
              })
              defer.resolve(!angular.isUndefined(access))
              _setAccessDenied(angular.isUndefined(access))
            }
          },function(error) {
            _setAccessDenied(true)
            defer.reject(error.statusText);
          })
          return defer.promise;
        }

        return {
          isAuthorized: _isAuthorized,
          accessDenied:  _getAccessDenied,
        }
    }])

});
