(function ($root, deps, action) {
  define(deps, action)
})(this, ['angular'
  , 'constants'
  , 'helper'
  , 'seguridadFactory'
  , 'messagesSeguridad'],
  function (ng
    , constants
    , helper
    , messagesSeguridad) {

    var appSecurity = ng.module('appSecurity');

    appSecurity.controller('asigRolController',
      ['$scope'
        , '$timeout'
        , '$state'
        , '$q'
        , 'mModalAlert'
        , 'mModalConfirm'
        , 'seguridadFactory'
        , function ($scope
          , $timeout
          , $state
          , $q
          , mModalAlert
          , mModalConfirm
          , seguridadFactory) {

          var vm = this;
          $scope.objetSeguridad = seguridadFactory.onlyView();
          vm.$onInit = function () {
            $scope.onlyView = true;
            $timeout(function () {
              $scope.onlyView = $scope.objetSeguridad.soloLectura;
            }, 10);
            $scope.frmData = {};
            vm.roles = [];
            vm.existRole = false;
            vm.showCopyAccess = false;

            if ((vm.typeGroup != 1) && (vm.typeUser == 2)) {
              seguridadFactory.isCopyAccess(vm.numUser)
                .then(function (response) {
                  vm.showCopyAccess = response.data || response.Data;
                })
                .catch(function (error) {
                  mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
                });
            }

            if (vm.isCreate) {
              if (vm.typeUser == 2) {
                getRoleAdmCreate();
              }
            }
            else {
              if (vm.typeUser == 2) {
                getRoleAdmDetail();
              }
            }

          }

          function getRoleAdmCreate() {
            seguridadFactory.getRoleAdm(vm.numUser)
              .then(function (response) {
                vm.roles = response.data || response.Data;
                if (vm.roles.length > 0 && vm.isCreate) {
                  // Se asignan roles y accesos del administrador de la empresa
                  var firstRole = vm.roles[0];
                  var params = {
                    numUser: vm.numUser
                    , numRole: firstRole.numRol
                    , codeUser: vm.codeUser
                  };
                  insertRoleToUser(params);

                }
                else {
                  vm.existRole = false;
                }
              })
              .catch(function (error) {
                mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
              });
          }

          function getRoleAdmDetail() {
            seguridadFactory.getRoleAdm(vm.numUser)
              .then(function (response) {
                vm.roles = response.data || response.Data;
                if (vm.roles.length > 0) {
                  vm.existRole = true;
                }
                else {
                  vm.existRole = false;
                }
              })
              .catch(function (error) {
                mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
              });
          }

          vm.fnEliminarRol = _fnEliminarRol;
          function _fnEliminarRol(item) {
            mModalConfirm.confirmInfo('Al momento de eliminar el rol, este quedará deshabilitado.', '¿Estás seguro que deseas eliminar el rol?', 'Eliminar').then(function () {
              _fnEliminado(item);
            });
          }

          function _fnEliminado(item) {
            var params = {
              numUser: vm.numUser
              , numRole: item.numRol
            }
            seguridadFactory.deleteRoleFromUser(params)
              .then(function (response) {
                if (response.operationCode == 200) {
                  vm.roles = [];
                  vm.existRole = false;
                  //Se habilita el botón de copia de accesos a regulares
                  vm.showCopyAccess = true;

                  mModalAlert.showSuccess('¡Se ha eliminado el rol!', '');
                }
                else {
                  mModalAlert.showWarning(response.message, '');
                }
              })
              .catch(function (error) {
                mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
              });
          }

          /*--------------------------------------
          autocomplete rol
          ----------------------------------------*/
          $scope.fnGetListRole = _fnGetListRole;
          function _fnGetListRole(str) {
            if (str && str.length >= 2) {
              var txt = str.toUpperCase();
            }
            var defer = $q.defer();
            seguridadFactory.autocompleteRole(vm.typeGroup, txt, false)
              .then(function (response) {
                var data = response.data || response.Data;
                if (data.length > 0) $scope.noResultRole = false;
                else $scope.noResultRole = true;
                defer.resolve(data);
              });
            return defer.promise;
          }

          /*--------------------------------------
          Add role to user
          ----------------------------------------*/
          $scope.fnInsertRoleToUser = _fnInsertRoleToUser;
          function _fnInsertRoleToUser() {
            var params = {
              numUser: vm.numUser
              , numRole: $scope.frmData.mRol.numero
              , codeUser: vm.codeUser
            };
            insertRoleToUser(params);
          }

          function insertRoleToUser(model) {
            seguridadFactory.insertRoleToUser(model)
              .then(function (response) {
                if (response.operationCode == 200) {
                  getRoleAdmDetail();
                  vm.existRole = true;
                  vm.isCreate = false;
                }
                else {
                  vm.existRole = false;
                  mModalAlert.showWarning(response.message, '');
                }
              })
              .catch(function (error) {
                vm.existRole = false;
                mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
              });
          }

          vm.fnBtnCopyAccess = _fnBtnCopyAccess;
          function _fnBtnCopyAccess() {
            mModalConfirm.confirmInfo('Se copiarán los accesos principales a los usuarios regulares.', '¿Estás seguro que deseas copiar los accesos?', 'Copiar').then(function () {
              _fnBtnCopyAccess();
            });
          }

          function _fnBtnCopyAccess(item) {
            var params = {
              numUser: vm.numUser,
              codeUser: vm.codeUser
            }
            seguridadFactory.copyAccessToRegular(params)
              .then(function (response) {
                if (response.operationCode == 200) {
                  //Al copiarse los accesos a los regulares, el botón vuelve a deshabilitarse
                  vm.showCopyAccess = false;
                  mModalAlert.showSuccess('¡Se han copiado los accesos a los regulares!', '');
                }
                else {
                  mModalAlert.showWarning(response.message, '');
                }
              })
              .catch(function (error) {
                mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
              });
          }

        }])
      .component('asigRol', {
        templateUrl: '/security/app/secciones/common/asigRol.html',
        controller: 'asigRolController',
        controllerAs: '$ctrl',
        bindings: {
          isCreate: '=?'
          , typeGroup: '=?'
          , typeUser: '=?'
          , numUser: "=?"
          , codeUser: "=?"
          , existRole: '=?'
        }
      })
  });

