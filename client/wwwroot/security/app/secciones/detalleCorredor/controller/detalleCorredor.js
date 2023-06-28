(function ($root, deps, action) {
  define(deps, action)
})(this, ['angular'
  , 'lodash'
  , 'constants'
  , 'helper'
  , 'messagesSeguridad'
  , 'seguridadFactory'],
  function (ng, _, constants, helper, messagesSeguridad) {

    var appSecurity = angular.module('appSecurity');

    appSecurity.controller('detalleCorredorController',
      ['$scope'
        , '$window'
        , '$state'
        , '$q'
        , '$timeout'
        , 'mainServices'
        , 'mModalAlert'
        , 'mModalConfirm'
        , 'seguridadFactory'
        , function ($scope
          , $window
          , $state
          , $q
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
            var pms2 = seguridadFactory.getAgentsBroker($scope.data.ruc);
            pms2.then(function (response) {
              $scope.productorData = [];
              var data = response.data || response.Data;
              for(var i = 0; i < data.length; i++){
                $scope.productorData.push({id: data[i].codigo, idName: data[i].codigoDescripcion});
              }
            });
            // var pms2 = seguridadFactory.getProducers();
            // pms2.then(function (response) {
            //   $scope.productorData = response.data || response.Data;
            // });

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

            $scope.isSaveDisabled = false;
            $scope.showFullAccess = true;
            $scope.isCorredor = true;
            $scope.showRoleAccess = false;

            $scope.login = seguridadFactory.getVarLS("profile");

            $scope.typeGroup = 0;
            $scope.numRole = 0;
            $scope.codeUser = 0;

            $scope.frmPersonales = {};
            $scope.frmContacto = {};
            $scope.frmCaracteristicas = {};

            $scope.data = $scope.data || {};

            $scope.id = $state.params.id;

            $scope.showSede = true;
            $scope.getListSede = getListSede;
            $scope.toggleInput = toggleInput;

            //bindLookups();

            $timeout(function () {
              getDataViewDetails();
            }, 1000)

          })();

          $scope.fnGuardarCambios = _fnGuardarCambios;
          function _fnGuardarCambios() {
            mModalConfirm.confirmInfo('', '¿Estás seguro de guardar los cambios?', 'Guardar cambios').then(function () {
              _fnGuardado();
            });
          }
          function _fnGuardado() {
            var params = {
              numUser: $scope.id
              , names: $scope.frmPersonales.mNombre
              , firstLastName: $scope.frmPersonales.mApellidoPaterno
              , secondLastName: $scope.frmPersonales.mApellidoMaterno
              , numCharge: (ng.isUndefined($scope.frmContacto.mCargo.codigo)) ? 0 : $scope.frmContacto.mCargo.codigo
              , phoneNumber: $scope.frmContacto.mTelefono
              , cellPhoneNumber: $scope.frmContacto.mCelular
              , email: $scope.frmContacto.mEmail
              , codeAgent: $scope.frmCaracteristicas.mProductor.id
              , codeStatus: $scope.frmCaracteristicas.mEstadoUsuario.codigo
              , typeUser: $scope.typeUser
              , codeUser: $scope.codeUser
              , sede : ng.isUndefined($scope.frmCaracteristicas.sede) 
                ? '' 
                : $scope.frmCaracteristicas.sede.codigo 
                ? $scope.frmCaracteristicas.sede.codigo 
                : $scope.frmCaracteristicas.sede
            }
            var pms = seguridadFactory.updateUserBroker(params)
            pms.then(function (response) {
              if (response.operationCode == 200) {
                mModalAlert.showSuccess('Los cambios se guardaron con éxito.', '').then(function () {
                });
              } else mModalAlert.showWarning(response.message, '');
            })
              .catch(function (error) {
                mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
              });
          }

          function getDataViewDetails() {
            var promise = seguridadFactory.getDismaViewDetails($scope.id);
            promise.then(function (response) {
              $scope.data = response.data || response.Data;

              //tipo de grupo para filtrar roles
              $scope.typeGroup = $scope.data.numTipoGrupo;
              $scope.numUser = $scope.data.numUsuario;
              $scope.codeUser = $scope.data.codUsuario;
              $scope.typeUser = $scope.data.numTipoUsuario;

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
              if(response.data.sede){
                $scope.frmCaracteristicas.sede = response.data.sede

                $scope.getListSede($scope.frmCaracteristicas.sede)
                .then(function(sedes){
                  if(sedes.length === 0){
                    $scope.showInput = true;
                  }
                  else{
                    $scope.showInput = false;
                    $scope.frmCaracteristicas.sede = _.find(sedes, function(sede){ return sede.codigo == $scope.frmCaracteristicas.sede})
                  }
                })
              }

              bindLookups();

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
          
          function getListSede(str) {
            var defer = $q.defer();
            if (str && str.length >= 2) {
              str = str.toUpperCase();
              var pms = seguridadFactory.autocompleteOffice(str)
              pms.then(function (response) {
                var data = response.data || response.Data;
                if (data.length > 0) $scope.noResultOffice = false;
                else $scope.noResultOffice = true;
                defer.resolve(data);
              });
            }
            return defer.promise;
          }
          function toggleInput(){
            $scope.showInput = !$scope.showInput
            if(!$scope.showInput){
              $scope.getListSede($scope.frmCaracteristicas.sede)
              .then(function(sedes){
                $scope.frmCaracteristicas.sede = _.find(sedes, function(sede){ return sede.descripcion == $scope.frmCaracteristicas.sede})
              })
            }
            else{
              $scope.frmCaracteristicas.sede = $scope.frmCaracteristicas.sede.descripcion || $scope.frmCaracteristicas.sede
            }
          }

          $scope.userTypeChange = function (numUsuario) {
            seguridadFactory.userTypeChange(numUsuario)
          }

        }])
  });
