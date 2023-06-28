define(['angular', 'constants'], function(ng, constants) {

  indexController.$inject = ['$scope', 'oimClaims', 'authorizedResource', 'oimPrincipal', 'mapfreAuthetication', 'accessSupplier', '$window', '$state'];

  function indexController($scope, oimClaims, authorizedResource, oimPrincipal, mapfreAuthetication, accessSupplier, $window, state) {
    (function onLoad() {
      $scope.item = {};
      $scope.item.order = (state.current.name === 'order.item' || state.current.name === 'order.searchRequest');
      $scope.item.dispatch = (state.current.name === 'order.dispatchItem' || state.current.name === 'order.searchdispatch');

      // var ddd = authorizedResource;
      // var dddd = oimPrincipal;
      // var kmom = mapfreAuthetication;
      // var sdd = accessSupplier;
      // var ddddddd = $window;
      // var ddddd = window.localStorage.getItem('profile');

      // var oFarMapfre = oimClaims.rolesCode.filter(function(o){ return o.nombreAplicacion=="FARMAPFRE"; }).pop();

      var roleId = oimPrincipal.get_role();

      if(roleId) {
        switch(roleId) {
          case "USR_ADMIN":
          case "USR_BACKOFFICE":
          case "USR_BACKOFFICECM": {
            $scope.showPedidos = true, $scope.showDespachos = true;
          }; break;
          case "USR_DESPACHADOR": {
            $scope.showPedidos = false, $scope.showDespachos = true;
            state.go('order.searchdispatch');
          }; break;
          default: {
            $scope.showPedidos = false, $scope.showDespachos = false;
          }; break;
        }
      } else {
        $scope.showPedidos = false, $scope.showDespachos = false; 
      }
    })();
  }
  return ng.module('farmapfre.app')
    .controller('indexController', indexController);
});