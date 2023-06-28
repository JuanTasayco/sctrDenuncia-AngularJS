(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'helper', 'messagesSeguridad'],
  function(angular, constants, helper, messagesSeguridad){

    var appSecurity = angular.module('appSecurity');

    appSecurity.controller('modificacionMasivaController',
      ['$scope', '$window', '$state', '$sce', '$timeout', 'mainServices', 'mModalAlert', 'mModalConfirm','seguridadFactory',
        function($scope, $window, $state, $sce, $timeout, mainServices, mModalAlert, mModalConfirm, seguridadFactory){

          $scope.downloadErrors = DownloadErrors;
          $scope.downloadFormatModify = DownloadFormatModify;
          $scope.uploadUsers = UploadUsers;
          $scope.backUploadFileView = BackUploadFileView;

          $scope.$watch('fileExcel', function(newValue) {
            if(Object.keys(newValue).length !== 0){ 
              UploadFileMassive($scope.fileExcel);
            }
          })

          function BackUploadFileView(){
            $scope.showErrorMessage = false;
            $scope.showUploadMassive = true;
            CleanExcelFile();
          }

          function CleanExcelFile(){
            var input = document.querySelector('[file-model="fileExcel"]');

            /* Para que no haya problemas con las fase apply y digest de angular */
            $timeout(function(){
              if(input.files.length){
                input.files = $scope.fileDefault;
              }
            });
          }

          function DownloadErrors(listErrors){
            SetTypeFile($scope.typeUserUpload.codigo);
            seguridadFactory.descargarErrores(listErrors, $scope.modificacion, false);
          }

          function validarExcel(type){
            if (type.indexOf('ms-excel') != -1 || type.indexOf('openxmlformats-officedocument.spreadsheetml.sheet') != -1) return true;
            else return false;
          }

          function validarSize(size){
            if (size <= 1024000) return true;
            else return false;
          }

          function UploadFileMassive(file){
            if($scope.typeUserUpload.codigo === 0) mModalAlert.showWarning('Seleccione un tipo de usuario', '');
            else{
              if(validarExcel(file[0].type)){
                if(validarSize(file[0].size)){
                  var pms = seguridadFactory.modificacionMasivaUsuarios(file[0], $scope.typeUserUpload.codigo);
                  pms.then(function(response){
                    if(response.operationCode === 200){
                      $scope.massiveResult = response.data;
                      $scope.showUploadMassive = false;
      
                      if($scope.massiveResult.cantidadErrores > 0){
                        $scope.showErrorMessage = true;
                      }else{
                        $scope.showErrorMessage = false;
                      }
                    }
                    else {
                      mModalAlert.showWarning(response.message, ''); 
                      CleanExcelFile();
                    }
                  })
                  .catch(function(error){
                    ShowErrorMessage();
                  })
                }else{
                  mModalAlert.showWarning("El archivo no debe superar los 1024 KB (1 MB)", '');
                  CleanExcelFile();
                } 
              }else{
                mModalAlert.showWarning("Formato de archivo incorrecto", '');
                CleanExcelFile();
              } 
            }
          }

          function UploadUsers(listUsers){
            if($scope.massiveResult.cantidadCorrectos === 0) mModalAlert.showWarning('No hay registros que procesar', '');
            else{
              mModalConfirm.confirmInfo('Se modificaran '+ $scope.massiveResult.cantidadCorrectos + ' usuarios en el sistema', 'Modificar usuarios', 'Modificar usuarios').then(function () {
                UploadUsersConfirm(listUsers);
              });
            }
          }

          function UploadUsersConfirm(listUsers){
              seguridadFactory.procesarModificacionUsuarios(listUsers, true)
              .then(function(response){
                if(response.operationCode === 200){
                  $scope.massiveResult = response.data;
                  if($scope.massiveResult.cantidadErrores > 0){
                    $scope.showErrorMessage = true;
                    $scope.showUploadMassive = false;
                    /*$scope.massiveResult.cantidadErrores += response.data.cantidadErrores;
                    $scope.massiveResult.cantidadCorrectos = response.data.cantidadCorrectos;
                    $scope.massiveResult.errores = _.union($scope.massiveResult.errores, response.data.errores);
                    $scope.massiveResult.correctos = response.data.correctos;*/ 
                  }else{
                    mModalAlert.showSuccess('', 'Usuarios modificados exitosamente');
                    $state.go('usuarios');
                  }
                }
                else mModalAlert.showWarning(response.message, '');
              })
              .catch(function(error){
                ShowErrorMessage();
              })
          }

          function DownloadFormatModify(){
            if($scope.typeUserFormat.codigo !== 0){
              SetTypeFile($scope.typeUserFormat.codigo);
              $scope.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.seguridad + 'api/CargaMasiva/DescargarFormato');
              $timeout(function() {
                document.getElementById('frmExport').submit();
              }, 1000);
            }
          }

          function SetTypeFile(typeUser){
            switch(typeUser){
              case messagesSeguridad.USER_TYPES_DESCRIPTION.REGULAR.codigo: //1
                $scope.modificacion = messagesSeguridad.FILE_MASSIVE_TYPES.MODIFICACION_REGULAR;
                break;
              case messagesSeguridad.USER_TYPES_DESCRIPTION.ADMINISTRADOR.codigo: //2
                $scope.modificacion = messagesSeguridad.FILE_MASSIVE_TYPES.MODIFICACION_ADMIN;
                break;
            }
          }

          function ShowErrorMessage(){
            mModalAlert.showWarning(messagesSeguridad.UNEXPECTED_ERROR, '');
          }

          function GetListTypesUser(){
            $scope.listTypeUsersFormat = _.union([{codigo: 0, descripcion: 'Descargar Formato'}, messagesSeguridad.USER_TYPES_DESCRIPTION.ADMINISTRADOR, messagesSeguridad.USER_TYPES_DESCRIPTION.REGULAR]);
            $scope.listTypeUsersUpload = _.union([{codigo: 0, descripcion: 'Seleccionar Tipo de Usuario'}], messagesSeguridad.USER_TYPES_DESCRIPTION.ADMINISTRADOR, messagesSeguridad.USER_TYPES_DESCRIPTION.REGULAR);
          }

          function InitComponentsDefault(){
            $scope.listTypeUsersFormat = [];
            $scope.listTypeUsersUpload = [];
            $scope.typeUserFormat = {codigo: 0, descripcion: 'Descargar Formato'};
            $scope.typeUserUpload = {codigo: 0, descripcion: 'Seleccionar Tipo de Usuario'};
            $scope.showErrorMessage = false;
            $scope.showUploadMassive = true;
            $scope.fileExcel = {};
            $scope.massiveResult = {};
            $scope.fileDefault = document.querySelector('[file-model="fileExcel"]').files;
          }
          
          (function onLoad(){
            InitComponentsDefault();
            GetListTypesUser();
          })();

        }])
  });
