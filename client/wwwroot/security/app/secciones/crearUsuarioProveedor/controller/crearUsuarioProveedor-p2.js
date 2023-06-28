(function ($root, deps, action) {
  define(deps, action)
})(this, ['angular'
  , 'constants'
  , 'helper'
  , 'datosPersonales'],
  function (ng
    , constants
    , helper) {

    var appSecurity = angular.module('appSecurity');

    appSecurity.controller('crearUsuarioProveedor02Controller',
      ['$scope'
        , '$state'
        , '$timeout'
        , 'seguridadFactory'
        , 'mModalAlert',
        function ($scope
          , $state
          , $timeout
          , seguridadFactory
          , mModalAlert) {

          function bindLookups() {
            //cargos
            var pms2 = seguridadFactory.getCharges();
            pms2.then(function (response) {
              $scope.cargoData = response.data || response.Data;
            });
          }

          (function onLoad() {

            if (!$scope.create.validStep1)
              $state.go('crearUsuarioProveedor.steps', { step: 1 });

            bindLookups();

            $scope.mShowExitoCreacionUsuario = false;
            $scope.numUsuario = 0;

            $scope.login = seguridadFactory.getVarLS("profile");

            $scope.create = $scope.create || {};
            $scope.createS1 = $scope.createS1 || {};
            $scope.createS2 = $scope.createS2 || {};

            $scope.createS2.provider = $scope.createS2.provider || {};
            $scope.createS2.provider.datosPersonales = $scope.createS2.provider.datosPersonales || {};

            $scope.createS2.isEdit = $scope.createS2.isEdit || false;
            $scope.createS2.provider.datosPersonales.isEdit = $scope.createS2.isEdit;
          })();

          function isValid() {
            $scope.frmCreateUser.markAsPristine();
            $scope.frmCreateUser.frmDatosPersonales.markAsPristine();
            return $scope.frmCreateUser.$valid;
          }

          $scope.createS2.fnNextStep = _fnNextStep;
          function _fnNextStep(isNextStep, e) {
            if(isNextStep){
            if (isValid()) {
              var isCreate = true;
              if (!$scope.create.validStep2) {
                var params = {
                  tipDocumentoDescripcion: $scope.createS2.provider.datosPersonales.mTipoDoc.descripcion,
                  cargoDescripcion: $scope.createS2.provider.mCargo.descripcion,
                  ruc: $scope.createS1.mRucEmpresa,
                  numTipUsuario: $scope.createS2.provider.mTipoUsuario,
                  numTipDocumento: $scope.createS2.provider.datosPersonales.mTipoDoc.codigo,
                  documento: $scope.createS2.provider.datosPersonales.mNumDoc,
                  nombres: $scope.createS2.provider.datosPersonales.mNombres,
                  apellidoPaterno: $scope.createS2.provider.datosPersonales.mApellidoPaterno,
                  apellidoMaterno: $scope.createS2.provider.datosPersonales.mApellidoMaterno,
                  numCargo: $scope.createS2.provider.mCargo.codigo,
                  telefono: $scope.createS2.provider.mTelefono,
                  celular: $scope.createS2.provider.mCelular,
                  correo: $scope.createS2.provider.mEmail,
                  codUser: $scope.login.username
                }
                var pms = seguridadFactory.insertUserProvider(params);
              } else { //actualiza datos usuario
                isCreate = false;
                var params = {
                  numUser: $scope.createS3.user.numUsuario,
                  names: $scope.createS2.provider.datosPersonales.mNombres,
                  firstLastName: $scope.createS2.provider.datosPersonales.mApellidoPaterno,
                  secondLastName: $scope.createS2.provider.datosPersonales.mApellidoMaterno,
                  numCharge: $scope.createS2.provider.mCargo.codigo,
                  phoneNumber: $scope.createS2.provider.mTelefono,
                  cellPhoneNumber: $scope.createS2.provider.mCelular,
                  email: $scope.createS2.provider.mEmail,
                  codeStatus: 1,
                  codeUser: $scope.login.username,
                  numTipDocumento: $scope.createS2.provider.datosPersonales.mTipoDoc.codigo,
                  documento: $scope.createS2.provider.datosPersonales.mNumDoc,
                  typeUser: $scope.createS2.provider.mTipoUsuario
                }
                var pms = seguridadFactory.updateUserProviderCreate(params);
              }
              pms.then(function (response) {
                if (response.operationCode == 200) {
                  var data = response.data || response.Data
                  if(ng.isObject(data)){
                    $scope.viewSuccess = true;
                    if (!$scope.create.validStep2) {
                      $scope.createS3.user = data;
                      $scope.create.validStep2 = true;
                    }
                  $scope.create.numUsuario = $scope.createS3.user.numUsuario;
                  }
                  $scope.createS3.isCreate = isCreate;
                  var pms1 = seguridadFactory.getDismaViewDetails($scope.create.numUsuario);
                  pms1.then(function (res) {
                    if (res.operationCode == 200) {
                      $scope.createS3.user.details = res.data || res.Data;
                      $state.go('crearUsuarioProveedor.steps', { step: 3 })
                    } else mModalAlert.showWarning(res.message, '');
                  })
                } else mModalAlert.showWarning(response.message, '');
              });
            } else {
              e.cancel = true;
              mModalAlert.showWarning('Por favor corregir los errores antes de continuar', '');
            }
            }else $state.go('crearUsuarioProveedor.steps', { step: e.step })
          }

          //valida formulario desde click en paso 2 (circulo superior)
          $scope.$on("changingStep", function (event, e) {
            if(e.step > 2) $scope.createS2.fnNextStep(true, e);
            else $scope.createS2.fnNextStep(false, e);
          });

        }])
  });
