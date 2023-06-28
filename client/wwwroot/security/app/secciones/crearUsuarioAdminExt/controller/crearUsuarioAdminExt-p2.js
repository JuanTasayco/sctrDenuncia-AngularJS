(function($root, deps, action){
  define(deps, action)
})(this, ['angular'
, 'constants'
, 'helper'],
  function(ng
    , constants
    , helper){

    var appSecurity = ng.module('appSecurity');

    appSecurity.controller('crearUsuarioAdminExt02Controller',
      ['$scope'
      , '$state'
      , '$timeout'
      , 'seguridadFactory'
      , function(
        $scope
        , $statusText
        , $timeout
        , seguridadFactory){

        (function onLoad(){
          $scope.etiqueta = 'Habilitado';

          if(!$scope.create.validStep1)
            $state.go('crearUsuarioAdminExt.steps', {step: 1});
          else{
            // $scope.create = $scope.create || {};
            $scope.createS1 = $scope.createS1 || {};
            $scope.createS2 = ($scope.create.validStep1) ? $scope.createS2 : {};
            $scope.createS1.isEdit = true;

            $scope.created = {};
            $scope.created.step1 = $scope.createS1;
            $scope.created.step2 = $scope.createS2;
            
            $scope.create.disabled = true;
            $scope.login = seguridadFactory.getVarLS("profile");

            //Variables de roles y accesos
            $scope.showRoleAccess = true;
            $scope.isCreate = $scope.createS2.isCreate;
            $scope.typeGroup = $scope.createS2.user.details.numTipoGrupo;
            $scope.typeUser = $scope.createS2.user.details.numTipoUsuario; //Ejecutivo Mapfre : Administrador
            $scope.numUser = $scope.createS2.user.numUsuario;
            $scope.codeUser = $scope.login.username;
            $scope.existRole = false;
            $scope.isFinalizar = true;
            if ($scope.typeUser == 2)
              $scope.isUserAdmin = true;
            else
              $scope.isUserAdmin = false;
            $scope.email = $scope.createS2.user.details.correo;
            $scope.person = $scope.createS2.user.details.nombres + " " + $scope.createS2.user.details.apellidoPaterno + " " + $scope.createS2.user.details.apellidoMaterno;
            $scope.successUser = {
              successUser: false
            };               

          }         
          
          })();

        }])
  });
