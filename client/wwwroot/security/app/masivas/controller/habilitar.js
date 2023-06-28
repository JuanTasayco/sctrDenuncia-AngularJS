(function ($root, deps, action) {
  define(deps, action);
})(
  this,
  ['angular', 'constants', 'messagesSeguridad', 'helperFactory'],
  function (angular, constants, messagesSeguridad, helperFactory) {
    var appSecurity = angular.module('appSecurity');

    appSecurity.controller('habilitarController', [
      '$scope',
      '$state',
      '$timeout',
      '$sce',
      'mModalAlert',
      'mModalConfirm',
      'seguridadFactory',
      function ($scope, $state, $timeout, $sce, mModalAlert, mModalConfirm, seguridadFactory) {
        InitComponentsDefault();
        GetListTypesUsers();

        $scope.$on('$destroy', function () {
          listen();
        });

        var modalAlert = helperFactory.modal(mModalAlert);
        var modalConfirm = helperFactory.modal(mModalConfirm);
        var warningModal = modalAlert('showWarning');
        var successModal = modalAlert('showSuccess');
        var confirmModal = modalConfirm('confirmInfo');
        $scope.downloadFormatTypeUser = DownloadFormatTypeUser;
        $scope.uploadUsers = UploadUsers;
        $scope.backUploadFileView = BackUploadFileView;
        var fileExcel = document.querySelector('[file-model="fileExcel"]');

        var listen = $scope.$watch('fileExcel', function (newValue) {
          if (Object.keys(newValue).length !== 0) {
            UploadFileMassive($scope.fileExcel);
          }
        });

        function UploadFileMassive(file) {
            if (helperFactory.isValidExcel(file[0].type)) {
              if (helperFactory.isValidSize(file[0].size)) {
                var pms = seguridadFactory.habilitacionUsuarios(file[0]);
                pms
                  .then(function (response) {
                    if (response.operationCode === 200) {
                      $scope.massiveResult = response.data;
                      $scope.showUploadMassive = false;

                      $scope.showErrorMessage = $scope.massiveResult.cantidadErrores > 0;
                      return;
                    }
                    if (response.operationCode !== 200) {
                      warningModal(response.message, '');
                      helperFactory.cleanExcelFile($scope.fileDefault, fileExcel);
                      return;
                    }
                  })
                  .catch(function (error) {
                    ShowErrorMessage();
                    helperFactory.cleanExcelFile($scope.fileDefault, fileExcel);
                  });

                return;
              }
              if (!helperFactory.isValidSize(file[0].size)) {
                warningModal('El archivo no debe superar los 1024 KB (1 MB)', '');
                helperFactory.cleanExcelFile($scope.fileDefault, fileExcel);
                return;
              }
              return;
            }

            if (!helperFactory.isValidExcel(file[0].type)) {
              warningModal('Formato de archivo incorrecto', '');
              helperFactory.cleanExcelFile($scope.fileDefault, fileExcel);
              return;
            }
            return;
        }

        function BackUploadFileView() {
          $scope.showErrorMessage = false;
          $scope.showUploadMassive = true;
          helperFactory.cleanExcelFile($scope.fileDefault, fileExcel);
        }

        function DownloadFormatTypeUser() {
          $scope.exportURL = $sce.trustAsResourceUrl(
            constants.system.api.endpoints.seguridad + 'api/CargaMasiva/DescargarFormato?TipoArchivo=8'
          );
          $timeout(function () {
            document.getElementById('frmExport').submit();
          }, 1000);
        }

        function UploadUsers(listUsers) {
          if ($scope.massiveResult.cantidadCorrectos === 0) {
            warningModal('No hay registros que procesar', '');
            return;
          }
          if ($scope.massiveResult.cantidadCorrectos !== 0) {
            mModalConfirm.confirmInfo('Se cargarán '+ $scope.massiveResult.cantidadCorrectos + ' usuarios nuevos al sistema', 'Habilitar usuarios', 'Habilitar usuarios').then(function () {
              UploadUsersConfirm(listUsers);
            });
            return;
          }
        }

        function UploadUsersConfirm(listUsers) {
          var promise = seguridadFactory.procesarHabilitarUsuariosEjecutivoMapfre(listUsers, true);

          promise
            .then(function (response) {
              if (response.operationCode === 200) {
                $scope.massiveResult = response.data;
                if ($scope.massiveResult.cantidadErrores > 0) {
                  $scope.showErrorMessage = true;
                  $scope.showUploadMassive = false;
                  return;
                }

                if ($scope.massiveResult.cantidadErrores <= 0) {
                  successModal('', 'Usuarios habilitados exitosamente');
                  $state.go('usuarios');
                  return;
                }
                return;
              }

              if (response.operationCode !== 200) {
                warningModal(response.message, '');
                return;
              }
            })
            .catch(function (error) {
              ShowErrorMessage();
            });
        }

        function GetListTypesUsers() {
          seguridadFactory
            .getGroupTypesRole()
            .then(function (response) {
              if (response.operationCode === 200) {
                $scope.listTypeUsersFormat = _.union([{codigo: 0, descripcion: 'Descargar Formato'}], response.data);
                $scope.listTypeUsersUpload = _.union(
                  [{codigo: 0, descripcion: 'Seleccionar Tipo de Usuario'}],
                  response.data
                );
                return;
              }

              if (response.operationCode !== 200) {
                warningModal(response.message, '');
                return;
              }
            })
            .catch(function (error) {
              ShowErrorMessage();
            });
        }

        function InitComponentsDefault() {
          $scope.listTypeUsersFormat = [];
          $scope.typeUserFormat = {codigo: 0, descripcion: 'Descargar Formato'};
          $scope.fileExcel = {};
          $scope.showErrorMessage = false;
          $scope.showUploadMassive = true;
          $scope.fileDefault = document.querySelector('[file-model="fileExcel"]').files;
        }

        function ShowErrorMessage() {
          warningModal(messagesSeguridad.UNEXPECTED_ERROR, '');
        }
      },
    ]);
  }
);
