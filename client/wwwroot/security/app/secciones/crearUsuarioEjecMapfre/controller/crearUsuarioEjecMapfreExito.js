(function($root, deps, action){
  define(deps, action)
})(this, [
  'angular'
  , 'constants'
  , 'helper'
  , 'seguridadFactory'],
  function(
    ng
    , constants
    , helper){

    var appSecurity = angular.module('appSecurity');

    appSecurity.controller('crearUsuarioEjecMapfreExitoController',
      ['$scope'
      , '$window'
      , '$state'
      , '$timeout'
      , 'mainServices'
      , 'mModalAlert'
      , 'seguridadFactory'
      ,  function($scope
          , $window
          , $state
          , $timeout
          , mainServices
          , mModalAlert
          , seguridadFactory){

          (function onLoad(){

            $scope.data = $scope.data || {};

            $timeout(function(){
              getDetailsUserSuccess();
            }, 500);

            function getDetailsUserSuccess(){
              var id = $state.params.id;
              var pms = seguridadFactory.getDismaViewDetails(id, true);
              pms.then(function(response){
                if(response.operationCode == 200) 
                  $scope.data = response.data || response.Data;
                else
                  mModalAlert.showWarning(response.message, "");
              });
            }

          })();

        }])
  });
