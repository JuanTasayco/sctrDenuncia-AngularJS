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

    var appSecurity = ng.module('appSecurity');

    appSecurity.controller('crearUsuarioCliEmp01Controller',
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

            $scope.createS1 = $scope.createS1 || {};
            $scope.createS1.mRucEmpresa = ($scope.create.validStep1) ? $scope.createS1.mRucEmpresa : "";

          })();

          function isValid(){
            $scope.frmCreateUser.markAsPristine()
            return $scope.frmCreateUser.$valid;
          }

          $scope.createS1.fnNextStep = _fnNextStep;
          function _fnNextStep(isNextStep, e){
            $scope.create.disabled = false;
            if(isNextStep){
            if(isValid()){
                var _ruc = $scope.createS1.mRucEmpresa;
                var groupType = 2;
                var pms = seguridadFactory.getUserByRuc(_ruc, groupType);
                pms.then(function(response){
                  if(response.operationCode == 200){
                    $scope.companyData = response.data || response.Data;
                    if($scope.companyData.esValido){
                      $scope.create.validStep1 = true;
                      $scope.createS2.company = $scope.companyData.usuario;
                      $scope.createS2.company.mTipoUsuario = "2";
                      $state.go('crearUsuarioCliEmp.steps', {step: 2})
                    }else mModalAlert.showWarning($scope.companyData.message, '');
                  }else mModalAlert.showWarning(response.message, '') 
                });
            }else{
              e.cancel = true;
              mModalAlert.showWarning('Por favor corregir los errores antes de continuar', '');
            } 
            }else{
              e.cancel = true;
              mModalAlert.showWarning('Por favor corregir los errores antes de continuar', '');
            } 
          }

          function _fnSinResultados(){
            mModalAlert.showInfo('', 'No se encontraron resultados');
          }

          //valida formulario desde click en paso 2 (circulo superior)
          $scope.$on("changingStep", function (event, e) {
            if(e.step > 1 && e.step <= 3) $scope.createS1.fnNextStep(true, e);
            else $scope.createS1.fnNextStep(false, e);
          });             

        }])
  });
