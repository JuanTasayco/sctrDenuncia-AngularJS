(function ($root, deps, action) {
  define(deps, action)
})(this, [
  'angular'
  , 'constants'
  , 'helper'
  , 'messagesSeguridad'
  , 'seguridadFactory']
  , function (ng
    , constants
    , helper
    , messagesSeguridad) {

    var appSecurity = angular.module('appSecurity');

    appSecurity.controller('detalleProveedorController',
      ['$scope'
        , '$window'
        , '$state'
        , '$timeout'
        , 'mainServices'
        , 'mModalAlert'
        , 'mModalConfirm'
        , 'seguridadFactory'
        , function ($scope
          , $window
          , $state
          , $timeout
          , mainServices
          , mModalAlert
          , mModalConfirm
          , seguridadFactory) {
            
          $scope.usuariosData = [messagesSeguridad.USER_TYPES_DESCRIPTION.REGULAR, messagesSeguridad.USER_TYPES_DESCRIPTION.ADMINISTRADOR] ;
          $scope.doubleSpace = '^(?!.*  ).+';

          function bindLookups() {

            //estados de usuario
            var pms1 = seguridadFactory.getUserStatus();
            pms1.then(function (response) {
              $scope.estadoUsuarioData = response.data || response.Data;
            });

            //productor
            var pms2 = seguridadFactory.autocompleteProducer();
            pms2.then(function (response) {
              $scope.productorData = response.data || response.Data;
            });

            //tipos de usuario
            var pms3 = seguridadFactory.getUserTypes();
            pms3.then(function (response) {
              $scope.usuarioData = response.data || response.Data;
            });

            //tipos de doc
            var pms4 = seguridadFactory.getDocumentTypes();
            pms4.then(function (response) {
              $scope.tipoDocData = response.data || response.Data;
            });

            //cargos
            var pms5 = seguridadFactory.getCharges();
            pms5.then(function (response) {
              $scope.cargoData = response.data || response.Data;
            });

          }

          (function onLoad() {
            $scope.tabDatosGenerales = '/security/app/secciones/templates/tabDatosGenerales.html';
            $scope.tabRoles = '/security/app/secciones/templates/tabRoles.html';

            $scope.login = seguridadFactory.getVarLS("profile");

            $scope.isSaveDisabled = false;
            $scope.isCorredor = false;

            $scope.frmPersonales = {};
            $scope.frmContacto = {};
            $scope.frmCaracteristicas = {};

            $scope.data = $scope.data || {};

            $scope.id = $state.params.id;

            //Variables para roles y accesos
            $scope.showRoleAccess = false;
            $scope.isCreate = false;
            $scope.existRole = false;
            $scope.typeGroup = 0;
            $scope.typeUser = 0;
            $scope.numUser = 0;
            $scope.codeUser = "";
            $scope.isUserAdmin = false;

            bindLookups();

            $timeout(function () {
              getDataViewDetails();
            }, 1000);
          })();

          $scope.fnGuardarCambios = _fnGuardarCambios;
          function _fnGuardarCambios() {
            mModalConfirm.confirmInfo('', '¿Estás seguro de guardar los cambios?', 'Guardar cambios').then(function () {
              _fnGuardado();
            });
          }

          function _fnGuardado() {
            var params = {
              numUser: $scope.numUser
              , names: $scope.frmPersonales.mNombre
              , firstLastName: $scope.frmPersonales.mApellidoPaterno
              , secondLastName: $scope.frmPersonales.mApellidoMaterno
              , numCharge: $scope.frmContacto.mCargo.codigo
              , phoneNumber: $scope.frmContacto.mTelefono
              , cellPhoneNumber: $scope.frmContacto.mCelular
              , email: $scope.frmContacto.mEmail
              , codeStatus: $scope.frmCaracteristicas.mEstadoUsuario.codigo
              , typeUser: $scope.typeUser
              , codeUser: $scope.codeUser
            };

            var promise = seguridadFactory.updateUserProvider(params);
            promise.then(function (response) {
              if (response.operationCode == 200) {
                $timeout(function () {
                  getDataViewDetails();

                  mModalAlert.showSuccess('Los cambios se guardaron con éxito.', '').then(function () {
                  });
                }, 1000);
              }
              else mModalAlert.showWarning(response.message, '');
            });
          }

          function getDataViewDetails() {
            var promise = seguridadFactory.getDismaViewDetails($scope.id);
            promise.then(function (response) {
              $scope.data = response.data || response.Data;

              $scope.frmPersonales = {
                mTipoDoc: {
                  codigo: $scope.data.numTipoDocumento
                },
                mNumDoc: ($scope.data.numeroDocumento == null) ? "" : $scope.data.numeroDocumento,
                mNombreTipoUsuario: ($scope.data.nombreTipoUsuario == null) ? "" : $scope.data.nombreTipoUsuario,
                mNombre: ($scope.data.nombres == null) ? "" : $scope.data.nombres,
                mApellidoPaterno: ($scope.data.apellidoPaterno == null) ? "" : $scope.data.apellidoPaterno,
                mApellidoMaterno: ($scope.data.apellidoMaterno == null) ? "" : $scope.data.apellidoMaterno,
              };

              //Contacto
              $scope.frmContacto = {
                mCargo: {
                  codigo: $scope.data.numCargo
                },
                mTelefono: ($scope.data.telefono == null) ? "" : $scope.data.telefono,
                mCelular: ($scope.data.celular == null) ? "" : $scope.data.celular,
                mEmail: ($scope.data.correo == null) ? "" : $scope.data.correo
              }

              //Caracteristicas
              $scope.frmCaracteristicas = {
                mEstadoUsuario: {
                  codigo: $scope.data.numEstadoUsuario
                },
                mProductor: {
                  id: $scope.data.codAgente
                },
                mUsuario: {
                  codigo: $scope.data.numTipoUsuario
                }
              }

              //Variables de roles y accesos
              $scope.typeGroup = parseInt($scope.data.numTipoGrupo);
              $scope.numUser = parseInt($scope.data.numUsuario);
              $scope.codeUser = $scope.login.username;
              $scope.typeUser = parseInt($scope.data.numTipoUsuario);
              if ($scope.typeUser == 2)
                $scope.isUserAdmin = true;
              else
                $scope.isUserAdmin = false;

              $scope.isCreate = false;
              $scope.showRoleAccess = true;
              $scope.existRole = false;
              $scope.isFinalizar = false;
              $scope.usuariosData = $scope.usuariosData.filter(codUsuario);

            });
          }
          
          function codUsuario(usuario) {
            return usuario.codigo !== $scope.data.numTipoUsuario;
          }

          $scope.userTypeChange = function (numUsuario) {
            seguridadFactory.userTypeChange(numUsuario)
          }

        }])
  });
