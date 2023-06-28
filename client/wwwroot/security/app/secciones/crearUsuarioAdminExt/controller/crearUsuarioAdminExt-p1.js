(function($root, deps, action){
  define(deps, action)
})(this, ['angular'
, 'constants'
, 'helper'
, 'lodash'],
  function(ng
    , constants
    , helper
    , _){

    var appSecurity = ng.module('appSecurity');

    appSecurity.controller('crearUsuarioAdminExt01Controller',
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

          function bindLookups(){
            //cargos
            var pms2 = seguridadFactory.getCharges();
            pms2.then(function(response){
              $scope.cargoData = response.data || response.Data;
            });

            //productores
            var pms3 = seguridadFactory.getAgentsBroker($scope.createS1.adminExt.companyRuc);
            pms3.then(function (response) {
              $scope.productorData = [];
              var data = response.data || response.Data;
              for(var i = 0; i < data.length; i++){
                $scope.productorData.push({id: data[i].codigo, idName: data[i].codigoDescripcion});
              }
            });
            // var pms3 = seguridadFactory.getProducers();
            // pms3.then(function(response){
            //   $scope.productorData = response.data || response.Data;
            // });

            //tipo doc
            var pms4 = seguridadFactory.getDocumentTypes();
            pms4.then(function(response){
              $scope.tipoDocData = response.data || response.Data;
              $scope.tipoDocData = _.filter($scope.tipoDocData, function(item){
                return item.codigo == 6
                || item.codigo == 4
                || item.codigo == 2
                || item.codigo == 6
                || item.codigo == 7
                || item.codigo == 1
              })
            });
          }

          function initData() {
            $scope.create = $scope.create || {};
            $scope.createS1 = $scope.createS1 || {};
            $scope.createS2 = $scope.createS2 || {};

            $scope.createS1.user = $scope.createS1.user || {};
            $scope.createS1.user.datosPersonales = $scope.createS1.user.datosPersonales || {};

            $scope.createS1.isEdit = $scope.createS1.isEdit || false;
            $scope.createS1.user.datosPersonales.isEdit = $scope.createS1.isEdit;

            $scope.createS1.user = ($scope.create.validStep1) ? $scope.createS1.user : {};

            $scope.createS1.user.mCargo = {
              codigo: (ng.isUndefined($scope.createS1.user.mCargo)) ? null : $scope.createS1.user.mCargo.codigo
            }
            $scope.createS1.user.mTelefono = (!ng.isUndefined($scope.createS1.user.mTelefono)) ? $scope.createS1.user.mTelefono : ""
            $scope.createS1.user.mCelular = (!ng.isUndefined($scope.createS1.user.mCelular)) ? $scope.createS1.user.mCelular : ""
            $scope.createS1.user.mEmail = (!ng.isUndefined($scope.createS1.user.mEmail)) ? $scope.createS1.user.mEmail : ""
          }


          (function onLoad(){
            $scope.mTipoUsuario = 'userAdmin';

            // if(!$scope.create.validStep1)
            //   $state.go('crearUsuarioAdminExt.steps', {step: 1});

            //bindLookups();
            initData();
            $scope.profile = seguridadFactory.getVarLS("profile");
            var evoProfile = seguridadFactory.getVarLS("evoProfile");
            var userType = $scope.profile.typeUser;
            $scope.createS1.adminExt = {
              numPerson: evoProfile.companyId
              , companyName: evoProfile.companyName
              , name: $scope.profile.name
              , typePerson: userType // typePerson??
              , codeStatus: 1
              , userRegister: $scope.profile.username
              , numDoc: evoProfile.documentNumber
              , companyRuc: evoProfile.rucNumber
            }
           $scope.createS1.user = $scope.createS1.user || {};
           $scope.profile.userSubType = evoProfile.userSubType

           bindLookups();
          })();

          function isValid(){
            $scope.frmCreateUser.markAsPristine();
            $scope.frmCreateUser.frmDatosPersonales.markAsPristine();
            return $scope.frmCreateUser.$valid;
          }

          $scope.fnClearNumDoc = _fnClearNumDoc;
          function _fnClearNumDoc(){
            $scope.createS1.user.datosPersonales.mNumDoc = "";
          }

          function crudCompanyClient(){
            if(!$scope.create.validStep1){
              $scope.tmpIsCreate = true;
              var params = {
                ruc: evoProfile.rucNumber
                , numTipUsuario: $scope.profile.typeUser
                , numTipDocumento: (ng.isUndefined($scope.createS1.user.datosPersonales.mTipoDoc) || $scope.createS1.user.datosPersonales.mTipoDoc.codigo == null) ? null : $scope.createS1.user.datosPersonales.mTipoDoc.codigo
                , documento: ($scope.createS1.user.datosPersonales.mNumDoc == "") ? "" : $scope.createS1.user.datosPersonales.mNumDoc
                , nombres: ($scope.createS1.user.datosPersonales.mNombres == "") ? "" : $scope.createS1.user.datosPersonales.mNombres
                , apellidoPaterno: (ng.isUndefined($scope.createS1.user.datosPersonales.mApellidoPaterno)) ? "" : $scope.createS1.user.datosPersonales.mApellidoPaterno
                , apellidoMaterno: (ng.isUndefined($scope.createS1.user.datosPersonales.mApellidoMaterno)) ? "" : $scope.createS1.user.datosPersonales.mApellidoMaterno
                , numCargo: (ng.isUndefined($scope.createS1.user.datosPersonales.mTipoDoc) || $scope.createS1.user.mCargo.codigo == null) ? null : $scope.createS1.user.mCargo.codigo
                , telefono: (ng.isUndefined($scope.createS1.user.mTelefono)) ? "" : $scope.createS1.user.mTelefono
                , celular: (ng.isUndefined($scope.createS1.user.mCelular)) ? "" : $scope.createS1.user.mCelular
                , correo: (ng.isUndefined($scope.createS1.user.mEmail)) ? "" : $scope.createS1.user.mEmail
                , codUser: $scope.profile.username
              }
              var pms = seguridadFactory.insertUserCompanyClient(params);
            }else{
              $scope.tmpIsCreate = false;
              var params = {
                numUser: $scope.createS2.user.numUsuario
                , names: $scope.createS1.user.datosPersonales.mNombres
                , firstLastName: $scope.createS1.user.datosPersonales.mApellidoPaterno
                , secondLastName: $scope.createS1.user.datosPersonales.mApellidoMaterno
                , numCharge: $scope.createS1.user.mCargo.codigo
                , phoneNumber: $scope.createS1.user.mTelefono
                , cellPhoneNumber: $scope.createS1.user.mCelular
                , email: $scope.createS1.user.mEmail
                , codeStatus: 1
                , codeUser: $scope.profile.username
                , numTipDocumento: $scope.createS1.user.datosPersonales.mTipoDoc.codigo
                , documento: $scope.createS1.user.datosPersonales.mNumDoc
                , typeUser: $scope.createS1.user.mTipoUsuario
              }
              var pms = seguridadFactory.updateUserCompanyCreate(params);
            }
            return pms;
          }

          function crudUserBroker(){
            $scope.tmpIsCreate = true;
            if(!$scope.create.validStep1){
              var params = {
                tipDocumentoDescripcion: $scope.createS1.user.datosPersonales.mTipoDoc.descripcion
                , cargoDescripcion: $scope.createS1.user.mCargo.descripcion
                , numProductor: ($scope.createS1.user.mProductor.id == null) ? 0 : $scope.createS1.user.mProductor.id
                , numCompany: $scope.createS1.adminExt.numPerson
                , ruc: $scope.createS1.adminExt.companyRuc
                // , numTipUsuario: $scope.createS1.user.mTipoUsuario
                , numTipUsuario: 1
                , numTipDocumento: (ng.isUndefined($scope.createS1.user.datosPersonales.mTipoDoc)) ? 0 : $scope.createS1.user.datosPersonales.mTipoDoc.codigo
                , documento: (ng.isUndefined($scope.createS1.user.datosPersonales.mNumDoc)) ? "" : $scope.createS1.user.datosPersonales.mNumDoc
                , nombres: (ng.isUndefined($scope.createS1.user.datosPersonales.mNombres)) ? "" : $scope.createS1.user.datosPersonales.mNombres
                , apellidoPaterno: (ng.isUndefined($scope.createS1.user.datosPersonales.mApellidoPaterno)) ? "" : $scope.createS1.user.datosPersonales.mApellidoPaterno
                , apellidoMaterno: (ng.isUndefined($scope.createS1.user.datosPersonales.mApellidoMaterno)) ? "" : $scope.createS1.user.datosPersonales.mApellidoMaterno
                , numCargo: ($scope.createS1.user.mCargo.codigo == null) ? 0 : $scope.createS1.user.mCargo.codigo
                , telefono: (ng.isUndefined($scope.createS1.user.mTelefono)) ? "" : $scope.createS1.user.mTelefono
                , celular: (ng.isUndefined($scope.createS1.user.mCelular)) ? "" : $scope.createS1.user.mCelular
                , correo: (ng.isUndefined($scope.createS1.user.mEmail)) ? "" : $scope.createS1.user.mEmail
                , codUser: $scope.profile.username
              }
              var pms = seguridadFactory.insertUserBroker(params);
            }else{
              $scope.tmpIsCreate = false;
              var params = {
                numUser: $scope.createS2.user.numUsuario
                , names: $scope.createS1.user.datosPersonales.mNombres
                , firstLastName: $scope.createS1.user.datosPersonales.mApellidoPaterno
                , secondLastName: $scope.createS1.user.datosPersonales.mApellidoMaterno
                , numCharge: $scope.createS1.user.mCargo.codigo
                , phoneNumber: $scope.createS1.user.mTelefono
                , cellPhoneNumber: $scope.createS1.user.mCelular
                , email: $scope.createS1.user.mEmail
                , codeAgent: ($scope.createS1.user.mProductor.id == null) ? 0 : $scope.createS1.user.mProductor.id
                , codeStatus: 1
                , typeUser: 1 //regular
                , codeUser: $scope.profile.username
                , numTipDocumento: $scope.createS1.user.datosPersonales.mTipoDoc.codigo
                , documento: $scope.createS1.user.datosPersonales.mNumDoc
              }
              var pms = seguridadFactory.updateUserBrokerCreate(params);
            }
            return pms;
          }

          function crudUserProvider(){
            $scope.tmpIsCreate = true;
            if(!$scope.create.validStep1){
              var params = {
                tipDocumentoDescripcion: $scope.createS1.user.datosPersonales.mTipoDoc.descripcion
                , cargoDescripcion: $scope.createS1.user.mCargo.descripcion
                , ruc: $scope.createS1.adminExt.companyRuc
                , numTipUsuario: 1 //regular
                , numTipDocumento: $scope.createS1.user.datosPersonales.mTipoDoc.codigo
                , documento: $scope.createS1.user.datosPersonales.mNumDoc
                , nombres: $scope.createS1.user.datosPersonales.mNombres
                , apellidoPaterno: $scope.createS1.user.datosPersonales.mApellidoPaterno
                , apellidoMaterno: $scope.createS1.user.datosPersonales.mApellidoMaterno
                , numCargo: $scope.createS1.user.mCargo.codigo
                , telefono: $scope.createS1.user.mTelefono
                , celular: $scope.createS1.user.mCelular
                , correo: $scope.createS1.user.mEmail
                , codUser: $scope.profile.username
              }
              var pms = seguridadFactory.insertUserProvider(params);
            }else{
              $scope.tmpIsCreate = false;
              var params = {
                numUser: $scope.createS2.user.numUsuario
                , names: $scope.createS1.user.datosPersonales.mNombres
                , firstLastName: $scope.createS1.user.datosPersonales.mApellidoPaterno
                , secondLastName: $scope.createS1.user.datosPersonales.mApellidoMaterno
                , numCharge: $scope.createS1.user.mCargo.codigo
                , phoneNumber: $scope.createS1.user.mTelefono
                , cellPhoneNumber: $scope.createS1.user.mCelular
                , email: $scope.createS1.user.mEmail
                , codeStatus: 1
                , codeUser: $scope.profile.username
                , numTipDocumento: $scope.createS1.user.datosPersonales.mTipoDoc.codigo
                , documento: $scope.createS1.user.datosPersonales.mNumDoc
                , typeUser: 1
              }
              var pms = seguridadFactory.updateUserProviderCreate(params);
            }
            return pms;
          }

          $scope.createS1.fnNextStep = _fnNextStep;
          function _fnNextStep(isNextStep, e){
            $scope.create.disabled = false;
            if(isNextStep){
            if(isValid()){
              var isCreate = true;
              switch($scope.profile.userSubType){
                case "2":
                  var pms = crudCompanyClient()
                break;
                case "3":
                  var pms = crudUserBroker()
                break;
                case "4":
                  var pms = crudUserProvider()
                break;
              }
              pms.then(function(response){
                if(response.operationCode == 200){
                  $scope.viewSuccess = true;
                  var data = response.data || response.Data;
                  if(ng.isObject(data)){
                    $scope.createS2.user = data;
                    $scope.create.validStep1 = true;
                    $scope.create.numUsuario = ($scope.create.numUsuario == 0) ? $scope.createS2.user.numUsuario : $scope.create.numUsuario;
                  }
                  var pms1 = seguridadFactory.getDismaViewDetails($scope.create.numUsuario);
                    $scope.createS2.isCreate = $scope.tmpIsCreate;
                    pms1.then(function(res){
                      if(res.operationCode == 200){
                        $scope.createS2.user.details = res.data || res.Data;
                        $state.go('crearUsuarioAdminExt.steps', {step: 2})
                      }else mModalAlert.showWarning(res.message, '');
                    })
                }else mModalAlert.showWarning(response.message, '');
              });
            }else{
              e.cancel = true;
              mModalAlert.showWarning('Por favor corregir los errores antes de continuar', '');
            }
            }else $state.go('crearUsuarioAdminExt.steps', {step: e.step})
          }

          //valida formulario desde click en paso 2 (circulo superior)
          $scope.$on("changingStep", function (event, e) {
            if(e.step > 1) $scope.createS1.fnNextStep(true, e);
            else $scope.createS1.fnNextStep(false, e);
          });

        }])
  });
