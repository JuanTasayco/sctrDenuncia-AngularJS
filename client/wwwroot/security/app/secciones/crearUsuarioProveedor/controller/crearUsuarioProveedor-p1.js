(function($root, deps, action){
  define(deps, action)
})(this, ['angular'
, 'constants'
, 'helper'
, 'messagesSeguridad'],
  function(ng
    , constants
    , helper
    , messagesSeguridad){

    var appSecurity = ng.module('appSecurity');

    appSecurity.controller('crearUsuarioProveedor01Controller',
      ['$scope'
      , '$state'
      , '$timeout'
      , 'seguridadFactory'
      , 'mModalAlert'
      , function($scope
        , $state
        , $timeout
        , seguridadFactory
        , mModalAlert){

          (function onLoad(){
            $scope.showResultado = false;

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
              if(!$scope.create.validStep1){
                var ruc = $scope.createS1.mRucEmpresa;
                var groupType = 4;
                var pms = seguridadFactory.getUserByRuc(ruc, groupType);
                pms.then(function(response){
                  if(response.operationCode == 200){
                    $scope.create.validStep1 = true;
                    $scope.showResultado = true;
                    $scope.createS2.provider = response.data || response.Data;
                    $scope.createS2.provider.mTipoUsuario = "2";
                    if(response.data.esValido) $state.go('crearUsuarioProveedor.steps', {step: 2});
                    else mModalAlert.showWarning(response.data.message, '');
                  }else mModalAlert.showWarning(response.message, '');
                })
                .catch(function(error){
                  mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
                });
              }else $state.go('crearUsuarioProveedor.steps', {step: 2});
            }else{
              e.cancel = true;
              mModalAlert.showWarning('Por favor corregir los errores antes de continuar', '');
            }
            }else{
              e.cancel = true;
              mModalAlert.showWarning('Por favor corregir los errores antes de continuar', '');
            }
          }

          //valida formulario desde click en paso 2/3 (circulo superior)
          $scope.$on("changingStep", function (event, e) {
            if(e.step > 1 && e.step <= 3) $scope.createS1.fnNextStep(true, e);
            else $scope.createS1.fnNextStep(false, e);
          });    

        }])
  });
