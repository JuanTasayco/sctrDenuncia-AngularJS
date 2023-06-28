(function ($root, deps, action, lodash) {
  define(deps, action, _)
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

    appSecurity.controller('asigAccesoController',
      ['$scope'
        , '$uibModal'
        , '$timeout'
        , '$state'
        , '$q'
        , 'mModalAlert'
        , 'mModalConfirm'
        , 'seguridadFactory'
        , function ($scope
          , $uibModal
          , $timeout
          , $state
          , $q
          , mModalAlert
          , mModalConfirm
          , seguridadFactory) {

          var vm = this;

          vm.$onInit = function () {

            vm.showFullAccess = vm.fullAccess;
            $scope.frmData = [];
            $scope.frmModal = {};
            vm.showEnd = false;

            vm.access = []
            if (!ng.isUndefined(vm.numUser)) {
              if (vm.typeUser == 2) {
                if (vm.existRole) {
                  getAccessByUserAdmin();
                }
              }
              else {
                getAccessByUserRegular();
              }
            }

          }

          function getAccessByUserAdmin() {
            $scope.frmData = [];
            vm.access = [];
            seguridadFactory.getAccessByUserAdmin(vm.numUser)
              .then(function (response) {
                vm.access = response.data || response.Data;

                var i = 0;

                ng.forEach(vm.access, function (item) {
                  item.stringListProfileAssociated = '';
                  ng.forEach(item.listAssociatedAccess, function (asoc) {
                    item.stringListProfileAssociated = item.stringListProfileAssociated + asoc.codPerfil + '-';
                  });
                  if (item.stringListProfileAssociated.length > 0) {
                    item.stringListProfileAssociated = item.stringListProfileAssociated.substr(0, item.stringListProfileAssociated.length - 1)
                  }

                  if (item.codEstado == 1) item.accessActive = true;
                  else item.accessActive = false;

                  if (item.numPerfil != null) {
                    var modelo = {
                      numero: item.numPerfil,
                      codigo: item.codPerfil,
                      descripcion: item.nombrePerfil,
                      codigoNombrePerfil: item.codigoNombrePerfil
                    };
                    $scope.frmData[i] = modelo;
                  }

                  i++;
                });

                fnShowEnd();
              })
              .catch(function (error) {
                mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
              });
          }

          function getAccessByUserRegular() {
            $scope.frmData = [];
            vm.access = [];
            seguridadFactory.getAccessByUserRegular(vm.numUser)
              .then(function (response) {
                vm.access = response.data || response.Data;
                var i = 0;
                ng.forEach(vm.access, function (item) {
                  if (item.codEstado == 1) item.accessActive = true;
                  else item.accessActive = false;

                  if (item.numPerfil != null) {
                    var modelo = {
                      numero: item.numPerfil,
                      codigo: item.codPerfil,
                      descripcion: item.nombrePerfil,
                      codigoNombrePerfil: item.codPerfil + " - " + item.nombrePerfil
                    };
                    $scope.frmData[i] = modelo;
                    item.codigoNombrePerfil = item.codPerfil + " - " + item.nombrePerfil;
                  }

                  i++;

                });

                fnShowEnd();
              })
              .catch(function (error) {
                mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
              });
          }

          $scope.fnGetProfilesByUserByApplication = _fnGetProfilesByUserByApplication;
          function _fnGetProfilesByUserByApplication(numAplicacion, str) {
            var txt = "";
            if (str && str.length >= 2) {
              txt = str.toUpperCase();

              var defer = $q.defer();
              seguridadFactory.getProfilesByUserByApplication(vm.numUser, numAplicacion, txt, false)
                .then(function (response) {
                  var data = response.data || response.Data;
                  if (data.length > 0) {
                    $scope.noResultRole = false;
                  }
                  else {
                    $scope.noResultRole = true;
                  }
                  defer.resolve(data);
                });
              return defer.promise;
            }
          }

          $scope.fnGetProfilesByUserByApplicationRegular = _fnGetProfilesByUserByApplicationRegular;
          function _fnGetProfilesByUserByApplicationRegular(numAplicacion, str) {
            var txt = "";
            if (str && str.length >= 2) {
              txt = str.toUpperCase();

              var defer = $q.defer();
              seguridadFactory.getProfilesByUserByApplicationRegular(vm.numUser, numAplicacion, txt, false)
                .then(function (response) {
                  var data = response.data || response.Data;
                  if (data.length > 0) {
                    $scope.noResultRole = false;
                  }
                  else {
                    $scope.noResultRole = true;
                  }
                  defer.resolve(data);
                });
              return defer.promise;
            }
          }

          $scope.fnChangeProfilePrincipal = _fnGetChangeProfilePrincipal;
          function _fnGetChangeProfilePrincipal(numAplicacion, numProfileCurrent, numProfileNew) {
            var params = {
              numUser: vm.numUser,
              numApplication: numAplicacion,
              numProfileOld: numProfileCurrent,
              numProfile: numProfileNew,
              codeUser: vm.codeUser
            };

            if (numProfileCurrent == null) {
              seguridadFactory.insertAccessPrincipal(params)
                .then(function (response) {
                  if (response.operationCode == 200) {
                    var data = response.data || response.Data;
                    if (vm.typeUser == 2) {
                      getAccessByUserAdmin();
                    }
                    else {
                      getAccessByUserRegular();
                    }
                  }
                  else mModalAlert.showWarning(response.message, '');
                })
                .catch(function (error) {
                  mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
                });
            }
            else {
              seguridadFactory.updateAccessPrincipal(params)
                .then(function (response) {
                  if (response.operationCode == 200) {
                    if (vm.typeUser == 2) {
                      getAccessByUserAdmin();
                    }
                    else {
                      getAccessByUserRegular();
                    }
                  }
                  else mModalAlert.showWarning(response.message, '');
                })
                .catch(function (error) {
                  mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
                });
            }
          }

          $scope.fnChangeProfileAssociated = _fnChangeProfileAssociated;
          function _fnChangeProfileAssociated(numAplicacion, perfilSeleccionado) {
            var params = {
              numUser: vm.numUser,
              numApplication: numAplicacion,
              numProfile: perfilSeleccionado.numero,
              codeUser: vm.codeUser
            };

            seguridadFactory.insertAccessAssociated(params)
              .then(function (response) {
                if (response.operationCode == 200) {
                  $scope.perfilesArray.push({ numPerfil: perfilSeleccionado.numero, codPerfil: perfilSeleccionado.codigo, nombrePerfil: perfilSeleccionado.descripcion, codigoNombrePerfil: perfilSeleccionado.codigoNombrePerfil });
                  $scope.frmModal = {};
                  if (vm.typeUser == 2) {
                    getAccessByUserAdmin();
                  }
                  else {
                    getAccessByUserRegular();
                  }
                }
                else mModalAlert.showWarning(response.message, '');
              })
              .catch(function (error) {
                mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
              });
          }

          $scope.fnChangeProfileRegular = _fnGetChangeProfileRegular;
          function _fnGetChangeProfileRegular(numAplicacion, numProfileCurrent, numProfileNew) {
            var params = {
              numUser: vm.numUser,
              numApplication: numAplicacion,
              numProfileOld: numProfileCurrent,
              numProfile: numProfileNew,
              codeUser: vm.codeUser
            };

            if (numProfileCurrent == null) {
              seguridadFactory.insertAccessRegular(params)
                .then(function (response) {
                  if (response.operationCode == 200) {
                    getAccessByUserRegular();
                  }
                  else mModalAlert.showWarning(response.message, '');
                })
                .catch(function (error) {
                  mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
                });
            }
            else {
              seguridadFactory.updateAccessRegular(params)
                .then(function (response) {
                  if (response.operationCode == 200) {
                    getAccessByUserRegular();
                  }
                  else mModalAlert.showWarning(response.message, '');
                })
                .catch(function (error) {
                  mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
                });
            }
          }

          $scope.fnDeleteProfile = function (item, index) {          
            var userSubType = JSON.parse(window.localStorage.getItem('evoProfile')).userSubType;
            var msgTitle =  'Recuerde que al eliminar el perfil seleccionado, afecta a todos'+
                            ' los usuarios regulares que tengan dicho perfil'
            var msgRegular = '¿Está seguro de que desea eliminar este acceso?';
            
            mModalConfirm.confirmWarning(msgRegular, vm.typeGroup != '1' ? msgTitle : '')
              .then(function(data){
                if(data){
                  if (item.codEstado == 2)
                    return false;
                  if (item.numPerfil == null)
                    return false;

                  var params = {
                    numUser: vm.numUser,
                    numApplication: item.numAplicacion,
                    numProfile: item.numPerfil
                  };
                  seguridadFactory.deleteAccess(params)
                    .then(function (response) {
                      if (response.operationCode == 200) {
                        $scope.frmData.splice(index, 1);
                        if (vm.typeUser == 2) {
                          getAccessByUserAdmin();
                        }
                        else {
                          getAccessByUserRegular();
                        }

                        mModalAlert.showSuccess('Se ha eliminado el perfil.', '');
                      }
                      else mModalAlert.showWarning(response.message, '');
                    })
                    .catch(function (error) {
                      mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
                    });
                }
              })
              .catch(function(err){})
          }

          $scope.fnDeleteProfileAssociated = function (numAplicacion, numPerfil) {
            if (numPerfil != null) {
              var params = {
                numUser: vm.numUser,
                numApplication: numAplicacion,
                numProfile: numPerfil
              };
              seguridadFactory.deleteAccess(params)
                .then(function (response) {
                  if (response.operationCode == 200) {
                    var listTemp = [];
                    $scope.perfilesArray.forEach(function (item) {
                      if (item.numPerfil != numPerfil) {
                        listTemp.push(item);
                      }
                    });
                    $scope.perfilesArray = listTemp;

                    $scope.frmModal = {};
                    if (vm.typeUser == 2) {
                      getAccessByUserAdmin();
                    }
                    else {
                      getAccessByUserRegular();
                    }
                  }
                  else mModalAlert.showWarning(response.message, '');
                })
                .catch(function (error) {
                  mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
                });
            }
          }

          $scope.fnDeleteProfileRegular = function (numAplicacion, numPerfil, index) {
            if (numPerfil != null) {
              var params = {
                numUser: vm.numUser,
                numApplication: numAplicacion,
                numProfile: numPerfil
              };
              seguridadFactory.deleteAccessRegular(params)
                .then(function (response) {
                  if (response.operationCode == 200) {
                    $scope.frmData.splice(index, 1);

                    getAccessByUserRegular();

                    mModalAlert.showSuccess('Se ha eliminado el perfil.', '');
                  }
                  else mModalAlert.showWarning(response.message, '');
                })
                .catch(function (error) {
                  mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
                });
            }
          }

          $scope.fnCheckBox = function (numPerfil, numAplicacion, elm) {
            if (numPerfil != null) {
              if (elm) {
                fnActivo(numAplicacion, numPerfil);
              } else {
                fnDesactivo(numAplicacion, numPerfil);
              }
            }
          }

          function fnActivo(numAplicacion, numPerfil) {
            var params = {
              numUser: vm.numUser,
              numApplication: numAplicacion,
              numProfile: numPerfil,
              codeStatus: 1,
              codeUser: vm.codeUser
            };
            seguridadFactory.updateAccessStatusProfile(params)
              .then(function (response) {
                if (response.operationCode == 200) {
                  getAccessByUserRegular();

                  mModalAlert.showSuccess('Se ha activado el acceso.', '');
                }
                else mModalAlert.showWarning(response.message, '');
              })
              .catch(function (error) {
                mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
              });
          }

          function fnDesactivo(numAplicacion, numPerfil) {
            var params = {
              numUser: vm.numUser,
              numApplication: numAplicacion,
              numProfile: numPerfil,
              codeStatus: 2,
              codeUser: vm.codeUser
            };
            seguridadFactory.updateAccessStatusProfile(params)
              .then(function (response) {
                if (response.operationCode == 200) {
                  getAccessByUserRegular();

                  mModalAlert.showWarning('Se ha desactivado el acceso.', '');
                }
                else mModalAlert.showWarning(response.message, '');
              })
              .catch(function (error) {
                mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
              });
          }

          // $scope.fnCheckBoxPrincipal = function (codEstado, numAplicacion, elm) {
          $scope.fnCheckBoxPrincipal = _fnCheckBoxPrincipal;
          function _fnCheckBoxPrincipal(codEstado, numAplicacion, elm) {
            if (codEstado != null) {
              togglePrincipal(numAplicacion, elm);
              // if (elm) {
              //   fnActivoPrincipal(numAplicacion, $event);
              // } else {
              //   fnDesactivoPrincipal(numAplicacion, $event);
              // }
            }
          }

          function togglePrincipal(numAplicacion, elm){
            var code = (elm) ? 1 : 2;
            var params = {
              numUser: vm.numUser,
              numApplication: numAplicacion,
              codeStatus: code,
              codeUser: vm.codeUser
            };
            var pms = seguridadFactory.updateAccessStatusProfilePrincipal(params);
            pms.then(function (response) {
              if (response.operationCode == 200) {
                getAccessByUserAdmin();
                if(code == 1) mModalAlert.showSuccess('Se ha activado el acceso.', '');
                else mModalAlert.showWarning('Se ha desactivado el acceso.', '');
              }
              else mModalAlert.showWarning(response.message, '');
            })
            .catch(function (error) {
              mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
            });      
          }

          function fnActivoPrincipal(numAplicacion, $event) {
            var params = {
              numUser: vm.numUser,
              numApplication: numAplicacion,
              codeStatus: 1,
              codeUser: vm.codeUser
            };
            seguridadFactory.updateAccessStatusProfilePrincipal(params)
              .then(function (response) {
                if (response.operationCode == 200) {
                  getAccessByUserAdmin();

                  mModalAlert.showSuccess('Se ha activado el acceso.', '');
                }
                else mModalAlert.showWarning(response.message, '');
              })
              .catch(function (error) {
                mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
              });
          }

          function fnDesactivoPrincipal(numAplicacion, $event) {
            var params = {
              numUser: vm.numUser,
              numApplication: numAplicacion,
              codeStatus: 2,
              codeUser: vm.codeUser
            };
            seguridadFactory.updateAccessStatusProfilePrincipal(params)
              .then(function (response) {
                if (response.operationCode == 200) {
                  getAccessByUserAdmin();

                  mModalAlert.showWarning('Se ha desactivado el acceso.', '');
                }
                else mModalAlert.showWarning(response.message, '');
              })
              .catch(function (error) {
                mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
              });
          }

          $scope.perfilesArray = [];
          $scope.numAplicacionModal = null;

          // Show Modal
          $scope.fnShowModal = function (item) {
            if (item.codEstado == 2) {
              return false;
            }
            $scope.perfilesArray = [];
            $scope.numAplicacionModal = null;
            var vModalProof = $uibModal.open({
              backdrop: true, // background de fondo
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              size: 'md',
              templateUrl: 'tplModal.html',
              // template : '<mpf-modal-send-email action="action" data="emailData" close="close()"></mpf-modal-send-email>',
              controller: ['$scope', '$uibModalInstance', '$uibModal', '$timeout',
                function ($scope, $uibModalInstance, $uibModal, $timeout) {
                  // Close Modal
                  $scope.closeModal = function () {
                    // $uibModalInstance.dismiss('cancel');
                    $uibModalInstance.close();
                  };

                  $scope.numAplicacionModal = item.numAplicacion;
                  item.listAssociatedAccess.forEach(function (perfil) {
                    $scope.perfilesArray.push({ numPerfil: perfil.numPerfil, codPerfil: perfil.codPerfil, nombrePerfil: perfil.nombrePerfil, codigoNombrePerfil: perfil.codigoNombrePerfil });
                  });

                }]
            });

            vModalProof.result.then(function () {
              // Action after CloseButton Modal
              // console.log('closeButton');
            }, function () {
              // Action after CancelButton Modal
              // console.log("CancelButton");
            });
          }

          function fnShowEnd() {
            vm.showEnd = false;

            if (vm.typeUser == 2) {
              vm.access.forEach(function (perfil) {
                if (perfil.numPerfil != null)
                  vm.showEnd = true;

                perfil.listAssociatedAccess.forEach(function (perfilAsoc) {
                  if (perfilAsoc.numPerfil != null)
                    vm.showEnd = true;
                });
              });
            }
            else {
              vm.access.forEach(function (perfil) {
                if (perfil.numPerfil != null)
                  vm.showEnd = true;
              });
            }
          }

          $scope.fnBtnFinalizar = function () {
            if (vm.showEnd) {
              if (vm.typeGroup == 1) {
                seguridadFactory.sendEmailUserEjecutivoMapfre(vm.email, vm.person)
                  .then(function (response) {
                    if (response.operationCode == 200) {
                      vm.successUser = true;
                    }
                    else {
                      vm.successUser = false;
                      mModalAlert.showWarning(response.message, '');
                    }
                  })
                  .catch(function (error) {
                    vm.successUser = false;
                    mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
                  });
              }
              else {
                seguridadFactory.sendEmailUser(vm.numUser, vm.email, vm.person)
                  .then(function (response) {
                    if (response.operationCode == 200) {
                      vm.successUser = true;
                    }
                    else {
                      vm.successUser = false;
                      mModalAlert.showWarning(response.message, '');
                    }
                  })
                  .catch(function (error) {
                    vm.successUser = false;
                    mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
                  });
              }

            }
            vm.create.numUsuario = 0;
            vm.create.validStep1 = false;
            var profile = seguridadFactory.getVarLS('profile');
            var userType = profile.typeUser;
            if(userType === "1"){
              vm.create.validStep2 = false;
            }
          }


        }])
      .component('asigAcceso', {
        templateUrl: '/security/app/secciones/common/asigAcceso.html',
        controller: 'asigAccesoController',
        controllerAs: '$ctrl',
        bindings: {
          typeUser: '=?'
          , numUser: "=?"
          , codeUser: "=?"
          , existRole: '=?'
          , isFinalizar: '=?'
          , email: '=?'
          , person: '=?'
          , successUser: '=?'
          , typeGroup: '=?'
          , create: '=?'
        }
      })
  });
