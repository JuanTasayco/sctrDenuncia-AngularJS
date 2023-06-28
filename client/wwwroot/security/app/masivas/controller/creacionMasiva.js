(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'helper', 'messagesSeguridad'],
  function(angular, constants, helper, messagesSeguridad){

    var appSecurity = angular.module('appSecurity');

    appSecurity.controller('creacionMasivaController',
      ['$scope', '$window', '$state', '$timeout', '$sce', 'mainServices', 'mModalAlert', 'mModalConfirm', 'seguridadFactory',
        function($scope, $window, $state, $timeout, $sce, mainServices, mModalAlert, mModalConfirm, seguridadFactory){

          /* FUNCIONES GENERICAS */
          $scope.downloadFormatTypeUser = DownloadFormatTypeUser;
          $scope.downloadErrors = DownloadErrors;
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
              
              if($scope.typeUserUpload.codigo === messagesSeguridad.FILE_MASSIVE_TYPES.CREACION_EJECUTIVO) $scope.isEjecutivoMapfre = true;
              else $scope.isEjecutivoMapfre = false;
              if(validarExcel(file[0].type)){
                if(validarSize(file[0].size)){   
                  var pms = seguridadFactory.creacionMasivaUsuario(file[0], $scope.typeUserUpload.codigo)
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
                        CleanExcelFile();
                      } 
                  })
                  .catch(function(error){
                    ShowErrorMessage();
                  });
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

          function DownloadErrors(listErrors){
            seguridadFactory.descargarErrores(listErrors, $scope.typeUserUpload.codigo, false);
          }

          function UploadUsers(listUsers){
            if($scope.massiveResult.cantidadCorrectos === 0) mModalAlert.showWarning('No hay registros que procesar', '');
            else{
              mModalConfirm.confirmInfo('Se cargarán '+ $scope.massiveResult.cantidadCorrectos + ' usuarios nuevos al sistema', 'Crear usuarios', 'Crear usuarios').then(function () {
                UploadUsersConfirm(listUsers);
              });
            }
          }

          function UploadUsersConfirm(listUsers){
            if($scope.typeUserUpload.codigo !== 0){
              switch($scope.typeUserUpload.codigo){
                case 1:
                  var promise = seguridadFactory.procesarUsuariosEjecutivoMapfre(listUsers, true);
                  break;
                case 2:
                  var promise = seguridadFactory.procesarUsuariosClienteEmpresa(listUsers, true);
                  break;
                case 3:
                  var promise = seguridadFactory.procesarUsuariosBroker(listUsers, true);
                  break;
                case 4:
                  var promise = seguridadFactory.procesarUsuariosProveedor(listUsers, true);
                  break;
              }
              
              promise.then(function(response){
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
                    mModalAlert.showSuccess('', 'Usuarios creados exitosamente');
                    $state.go('usuarios');
                  }
                }
                else mModalAlert.showWarning(response.message, '');
              })
              .catch(function(error){
                ShowErrorMessage();
              })
            }
          }

          function DownloadFormatTypeUser(){
            if($scope.typeUserFormat.codigo !== 0){
              $scope.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.seguridad + 'api/CargaMasiva/DescargarFormato');
              $timeout(function() {
                document.getElementById('frmExport').submit();
              }, 1000);
            }
          }

          function GetListTypesUsers(){
            seguridadFactory.getGroupTypesRole()
            .then(function(response){
              if (response.operationCode === 200){ 
                $scope.listTypeUsersFormat = _.union([{codigo: 0, descripcion: 'Descargar Formato'}], response.data);
                $scope.listTypeUsersUpload = _.union([{codigo: 0, descripcion: 'Seleccionar Tipo de Usuario'}], response.data);
              }
              else mModalAlert.showWarning(response.message, '');
            })
            .catch(function(error){
              ShowErrorMessage();
            });
          }

          function InitComponentsDefault(){
              $scope.listTypeUsersFormat = [];
              $scope.listTypeUsersUpload = [];
              $scope.typeUserFormat = {codigo: 0, descripcion: 'Descargar Formato'};
              $scope.typeUserUpload = {codigo: 0, descripcion: 'Seleccionar Tipo de Usuario'};
              $scope.fileExcel = {};
              $scope.massiveResult = {};
              $scope.showErrorMessage = false;
              $scope.showUploadMassive = true;
              $scope.fileDefault = document.querySelector('[file-model="fileExcel"]').files;
              $scope.isEjecutivoMapfre = false;
          }

          function ShowErrorMessage(){
            mModalAlert.showWarning(messagesSeguridad.UNEXPECTED_ERROR, '');
          }

          (function onLoad(){
            InitComponentsDefault();
            GetListTypesUsers();
          })();

        }])
  });
