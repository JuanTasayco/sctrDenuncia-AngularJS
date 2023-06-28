(function($root, deps, action) {
  define(deps, action);
})(this, ['angular', 'constants', 'lyra'], function(angular, constants) {
  angular
    .module('appRenovacion')
    .controller('renovacionHomeController', [
      '$scope',
      'authorizedResource',
      'oimClaims',
      'mModalAlert',
      '$state',
      function($scope, authorizedResource, oimClaims, mModalAlert, $state) {
      }

    ])
});
