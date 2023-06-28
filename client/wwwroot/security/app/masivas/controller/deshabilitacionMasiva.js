(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'helper', 'messagesSeguridad'],
  function(angular, constants, helper, messagesSeguridad){

    var appSecurity = angular.module('appSecurity');

    appSecurity.controller('deshabilitacionMasivaController',
      ['$scope', '$window', '$state', '$sce', '$timeout', 'mainServices', 'mModalAlert', 'mModalConfirm', 'seguridadFactory',
        function($scope, $window, $state, $sce, $timeout, mainServices, mModalAlert, mModalConfirm, seguridadFactory){

          $scope.downloadErrors = DownloadErrors;
          $scope.downloadFormatDisable = DownloadFormatDisable;
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
            seguridadFactory.descargarErrores(listErrors, messagesSeguridad.FILE_MASSIVE_TYPES.DESHABILITACION, false);
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
            if(validarExcel(file[0].type)){
              if(validarSize(file[0].size)){            
                var pms = seguridadFactory.deshabilitacionMasivaUsuario(file[0]);
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
                    else{
                      mModalAlert.showWarning(response.message, ''); 
                      CleanExcelFile()
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

          function UploadUsers(listUsers){
            if($scope.massiveResult.cantidadCorrectos === 0) mModalAlert.showWarning('No hay registros que procesar', '');
            else{
              mModalConfirm.confirmInfo('Se deshabilitaran '+ $scope.massiveResult.cantidadCorrectos  + ' usuarios en el sistema', 'Deshabilitar usuarios', 'Deshabilitar usuarios').then(function () {
                UploadUsersConfirm(listUsers);
              });
            }
          }
          function UploadUsersConfirm(listUsers){
            seguridadFactory.procesarDeshabilitacionUsuarios(listUsers, true)
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
                }
                else{
                  mModalAlert.showSuccess('', 'Usuarios deshabilitados exitosamente');
                  $state.go('usuarios');
                }
              }
              else{
                mModalAlert.showWarning(response.message, '');
              } 
            })
            .catch(function(error){
              ShowErrorMessage();
            })
          }

          function DownloadFormatDisable(){
            $scope.deshabilitacion = messagesSeguridad.FILE_MASSIVE_TYPES.DESHABILITACION;
            $scope.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.seguridad + 'api/CargaMasiva/DescargarFormato');
            $timeout(function() {
              document.getElementById('frmExport').submit();
            }, 1000);
          }

          function ShowErrorMessage(){
            mModalAlert.showWarning(messagesSeguridad.UNEXPECTED_ERROR, '');
          }

          function InitComponentsDefault(){
            $scope.showErrorMessage = false;
            $scope.showUploadMassive = true;
            $scope.fileExcel = {};
            $scope.massiveResult = {};
            $scope.fileDefault = document.querySelector('[file-model="fileExcel"]').files;
          }
          
          (function onLoad(){
            InitComponentsDefault();
          })();

        }])
  });
