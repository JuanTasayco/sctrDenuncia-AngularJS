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

    appSecurity.controller('crearUsuarioCliEmp02Controller',
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

          function bindLookups(){
            //cargos
            var pms2 = seguridadFactory.getCharges();
            pms2.then(function(response){
              $scope.cargoData = response.data || response.Data;
            });
    
          }          

          function initData(){
            $scope.create = $scope.create || {};
            $scope.createS1 = $scope.createS1 || {};

            $scope.createS2.company = $scope.createS2.company || {};
            $scope.createS2.company.datosPersonales = $scope.createS2.company.datosPersonales || {};

            $scope.createS2.isEdit = $scope.createS2.isEdit || false;
            $scope.createS2.company.datosPersonales.isEdit = $scope.createS2.isEdit;


            if($scope.create.validStep2){
            $scope.createS2.company.datosPersonales.mTipoDoc = {
              codigo: (ng.isUndefined($scope.createS2.company.datosPersonales.mTipoDoc)) ? null : $scope.createS2.company.datosPersonales.mTipoDoc.codigo
            }
            $scope.createS2.company.datosPersonales.mNumDoc = (!ng.isUndefined($scope.createS2.company.datosPersonales.mNumDoc)) ? $scope.createS2.company.datosPersonales.mNumDoc : ""
            $scope.createS2.company.datosPersonales.mNombres = (!ng.isUndefined($scope.createS2.company.datosPersonales.mNombres)) ? $scope.createS2.company.datosPersonales.mNombres : ""
            $scope.createS2.company.datosPersonales.mApellidoPaterno = (!ng.isUndefined($scope.createS2.company.datosPersonales.mApellidoPaterno)) ? $scope.createS2.company.datosPersonales.mApellidoPaterno : ""
            $scope.createS2.company.datosPersonales.mApellidoMaterno = (!ng.isUndefined($scope.createS2.company.datosPersonales.mApellidoMaterno)) ? $scope.createS2.company.datosPersonales.mApellidoMaterno : ""
            $scope.createS2.company.mCargo = {
              codigo: (ng.isUndefined($scope.createS2.company.mCargo)) ? null : $scope.createS2.company.mCargo.codigo 
            }
            $scope.createS2.company.mTelefono = (!ng.isUndefined($scope.createS2.company.mTelefono)) ? $scope.createS2.company.mTelefono : ""
            $scope.createS2.company.mCelular = (!ng.isUndefined($scope.createS2.company.mCelular)) ? $scope.createS2.company.mCelular : ""
            $scope.createS2.company.mEmail = (!ng.isUndefined($scope.createS2.company.mEmail)) ? $scope.createS2.company.mEmail : ""
            }else{
              $scope.createS2.company.datosPersonales.mTipoDoc = {
                codigo: null
              }
              $scope.createS2.company.datosPersonales.mNumDoc = ""
              $scope.createS2.company.datosPersonales.mNombres = ""
              $scope.createS2.company.datosPersonales.mApellidoPaterno = ""
              $scope.createS2.company.datosPersonales.mApellidoMaterno = ""
              $scope.createS2.company.mCargo = {
                codigo: null 
              }
              $scope.createS2.company.mTelefono = ""
              $scope.createS2.company.mCelular = ""
              $scope.createS2.company.mEmail = ""            
            }
          }

          (function onLoad(){

            if(!$scope.create.validStep1)
              $state.go('crearUsuarioCliEmp.steps', {step: 1});            

            bindLookups();
            initData();

            $scope.login = seguridadFactory.getVarLS("profile");
            $scope.viewSuccess = false;
          })();

          function isValid(){
            $scope.frmCreateUserS2.markAsPristine();
            $scope.frmCreateUserS2.frmDatosPersonales.markAsPristine()
            return $scope.frmCreateUserS2.$valid;
          }

          $scope.createS2.fnNextStep = _fnNextStep;
          function _fnNextStep(isNextStep, e){
            if(isNextStep){
            if(isValid()){
              var isCreate = true;
              if(!$scope.create.validStep2){
                var params = {
                  ruc: $scope.createS1.mRucEmpresa
                  , numTipUsuario: $scope.createS2.company.mTipoUsuario 
                  , numTipDocumento: (ng.isUndefined($scope.createS2.company.datosPersonales.mTipoDoc) || $scope.createS2.company.datosPersonales.mTipoDoc.codigo == null) ? null : $scope.createS2.company.datosPersonales.mTipoDoc.codigo
                  , documento: ($scope.createS2.company.datosPersonales.mNumDoc == "") ? "" : $scope.createS2.company.datosPersonales.mNumDoc
                  , nombres: ($scope.createS2.company.datosPersonales.mNombres == "") ? "" : $scope.createS2.company.datosPersonales.mNombres
                  , apellidoPaterno: (ng.isUndefined($scope.createS2.company.datosPersonales.mApellidoPaterno)) ? "" : $scope.createS2.company.datosPersonales.mApellidoPaterno
                  , apellidoMaterno: (ng.isUndefined($scope.createS2.company.datosPersonales.mApellidoMaterno)) ? "" : $scope.createS2.company.datosPersonales.mApellidoMaterno
                  , numCargo: (ng.isUndefined($scope.createS2.company.datosPersonales.mTipoDoc) || $scope.createS2.company.mCargo.codigo == null) ? null : $scope.createS2.company.mCargo.codigo
                  , telefono: (ng.isUndefined($scope.createS2.company.mTelefono)) ? "" : $scope.createS2.company.mTelefono 
                  , celular: (ng.isUndefined($scope.createS2.company.mCelular)) ? "" : $scope.createS2.company.mCelular
                  , correo: (ng.isUndefined($scope.createS2.company.mEmail)) ? "" : $scope.createS2.company.mEmail 
                  , codUser: $scope.login.username
                };
                var pms = seguridadFactory.insertUserCompanyClient(params);
              }else{
                var isCreate = false;
                var params = {
                  numUser: $scope.createS3.user.numUsuario
                  , names: $scope.createS2.company.datosPersonales.mNombres
                  , firstLastName: $scope.createS2.company.datosPersonales.mApellidoPaterno
                  , secondLastName: $scope.createS2.company.datosPersonales.mApellidoMaterno
                  , numCharge: $scope.createS2.company.mCargo.codigo
                  , phoneNumber: $scope.createS2.company.mTelefono
                  , cellPhoneNumber: $scope.createS2.company.mCelular
                  , email: $scope.createS2.company.mEmail
                  , codeStatus: 1
                  , codeUser: $scope.login.username
                  , numTipDocumento: $scope.createS2.company.datosPersonales.mTipoDoc.codigo
                  , documento: $scope.createS2.company.datosPersonales.mNumDoc
                  , typeUser: $scope.createS2.company.mTipoUsuario
                }
                var pms = seguridadFactory.updateUserCompanyCreate(params);
              }
              pms.then(function(response){
                if(response.operationCode == 200){
                  var data = response.data || response.Data;
                  if(ng.isObject(data)){
                    $scope.viewSuccess = true;
                    if(!$scope.create.validStep2){
                      $scope.createS3.user = data;
                      $scope.create.validStep2 = true;
                    }
                    $scope.create.numUsuario = $scope.createS3.user.numUsuario;
                  }
                  $scope.createS3.isCreate = isCreate;
                  var pms1 = seguridadFactory.getDismaViewDetails($scope.create.numUsuario);
                  pms1.then(function(res){
                    if(res.operationCode == 200){
                      $scope.createS3.user.details = res.data || res.Data;
                      $state.go('crearUsuarioCliEmp.steps', {step: 3})
                    }else mModalAlert.showWarning(res.message, '');
                  })
                }else mModalAlert.showWarning(response.message, '');
              });
            }else{
              e.cancel = true;
              mModalAlert.showWarning('Por favor corregir los errores antes de continuar', '');
            }
            }else $state.go('crearUsuarioCliEmp.steps', {step: e.step})
          }

          //valida formulario desde click en paso 2 (circulo superior)
          $scope.$on("changingStep", function (event, e) {
            if(e.step > 2) $scope.createS2.fnNextStep(true, e);
            else $scope.createS2.fnNextStep(false, e);
          });   

        }])
  });
