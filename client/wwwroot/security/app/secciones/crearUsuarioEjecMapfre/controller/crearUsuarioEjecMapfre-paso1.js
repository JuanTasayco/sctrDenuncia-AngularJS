(function($root, deps, action){
    define(deps, action)
})(this, ['angular'
, 'constants'
, 'helper'
, 'seguridadFactory'],
  function(ng
    , constants
    , helper
    , seguridadFactory){

    var appSecurity = ng.module('appSecurity');

    appSecurity.controller('crearUsuarioEjecMapfrePaso1Controller',
    ['$scope'
    , '$window'
    , '$state'
    , '$timeout'
    , 'mainServices'
    , 'mModalAlert'
    , 'seguridadFactory'
    , function($scope
      , $window
      , $state
      , $timeout
      , mainServices
      , mModalAlert
      , seguridadFactory){

      (function onLoad(){

        $scope.createS1 = $scope.createS1 || {};
        $scope.createS1.mIDUsuario = $scope.createS1.mIDUsuario || "";

        $scope.fnShowResult = _fnShowResult;
        function _fnShowResult() {
          var res = 0;
          if (!res) {
            _fnSinResultados();
          }
        }
          
        function _fnSinResultados(){
          mModalAlert.showInfo('', 'No se encontraron resultados');
        }

      })();  

      function isValid(){
        $scope.frmCreateUser.markAsPristine()
        return $scope.frmCreateUser.$valid;
      }       
      
      // $scope.fnShowResult = _fnShowResult;
      $scope.createS1.fnNextStep = _fnNextStep;
      function _fnNextStep(isNextStep, e){
        if(isValid()){
          if(!$scope.create.validStep1){
            var _id = $scope.createS1.mIDUsuario;
            var pms = seguridadFactory.getUserMapfreByCode(_id);
            pms.then(function(response){
              if(response.operationCode == 200){
                $scope.userData = response.data || response.Data;
                $scope.createS2.user = $scope.userData;
                if(response.operationCode == 200){
                  $scope.create.validStep1 = true;
                  var _user = $scope.userData;
                  $state.go('crearUsuarioEjecMapfre.steps', {step: 2})
                }else mModalAlert.showWarning($scope.userData.message, '');
              }else mModalAlert.showWarning(response.message, '') 
            });  
          } else $state.go('crearUsuarioEjecMapfre.steps', {step: 2});
        }else{
          e.cancel = true;
          mModalAlert.showWarning('Por favor corregir los errores antes de continuar', '');
        }
      }      

      //valida formulario desde click en paso 2 (circulo superior)
      $scope.$on("changingStep", function(event, e){
        $scope.createS1.fnNextStep(true, e);
      });           
            
  }])
});  