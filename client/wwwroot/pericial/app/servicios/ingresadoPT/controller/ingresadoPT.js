 'use strict';

define(['angular', 'constantsPericial', 'mocksPericial', 'helper', 'pericialFactory'], function(
  angular,
  constantsPericial, mocksPericial, helper) {

  ServicioIngresadoPTController.$inject = [
    '$scope', '$window', '$state', '$sce', '$timeout', 'mainServices', '$uibModal', 'mModalAlert', 'mModalConfirm', '$stateParams', 'pericialFactory', '$http',
    'mpSpin', 'oimClaims', '$interval'];

  function ServicioIngresadoPTController(
    $scope, $window, $state, $sce, $timeout, mainServices, $uibModal, mModalAlert, mModalConfirm, $stateParams, pericialFactory, $http, mpSpin, oimClaims, $interval
  ) {

      var vm = this;
      vm.siniestro = {};
      vm.filesT = [];
      vm.filesTExt = [];
      vm.filesTAccesories = [];
      vm.filesTAditionals = [];

      vm.docFilesT = [];
      vm.filesID = [];
      vm.filesBKP = [];
      vm.iconFile = "ico-mapfre_314_archivos";

      vm.$onInit = function() {
        vm.firstVersion = (parseInt($stateParams.version) === 1);
        //menu
        vm.perdidaTotalFlag = true;
        vm.ingresadoPTFlag = true;
        vm.etiquetaVal = 'Ingresado';
        vm.turnOnAmarillo = vm.enReparacionFlag;
        vm.turnOnNaranja = vm.presupuestadoFlag || vm.presupuestadoVirtFlag || vm.presupuestadoAsigFlag || vm.presupuestadoZoneFlag || vm.peritajeFlag;
        vm.turnOnVerde = vm.ingresadoFlag || vm.ingresadoPTFlag || vm.peritadoFlag || vm.porEntregarFlag || vm.perdidaTotalFlag;
        vm.turnOnGris = vm.entregadoFlag;

        vm.indexArray = -1;

        oimClaims.rolesCode.some(function(obj, i) {
          return obj.nombreAplicacion === "GPER" ? vm.indexArray = i : false;
        });

        if (vm.indexArray !== -1) {
          vm.rol = oimClaims.rolesCode[vm.indexArray].codigoRol;
        }

        switch (vm.rol) {
          case 'TALLER':
            vm.tallerBtns = true;
            break;
          case 'PERITO':
            vm.peritoBtns = true;
            break;
          case 'SUPERVISOR':
            vm.supervisorBtns = true;
            break;
          default:
            break;
        }
        //menu

          vm.dataSiniestro = {};
          vm.dataAuto = {};

          vm.exteriorVeh = [
            {id: 1, title: 'Fotografía frontal', idAttachFile: 0, src: '', fileName: ''},
            {id: 2, title: 'Fotografía posterior', idAttachFile: 0, src: '', fileName: ''},
            {id: 3, title: 'Fotografía lateral derecho', idAttachFile: 0, src: '', fileName: ''},
            {id: 4, title: 'Fotografía lateral izquierdo', idAttachFile: 0, src: '', fileName: ''},
            {id: 5, title: 'Fotografía techo', idAttachFile: 0, src: '', fileName: ''}
          ];

          vm.filesTExt = angular.copy(vm.exteriorVeh);

          vm.accesoriosVeh = [
            {id: 1, title: 'Compartimiento motor', idAttachFile: 0, src: '', fileName: ''},
            {id: 2, title: 'Accesorios', idAttachFile: 0, src: '', fileName: ''},
            {id: 3, title: 'Interior delantero', idAttachFile: 0, src: '', fileName: ''},
            {id: 4, title: 'Interior central y posterior', idAttachFile: 0, src: '', fileName: ''},
            {id: 5, title: 'Llantas', idAttachFile: 0, src: '', fileName: ''},
            {id: 6, title: 'Llantas de repuesto', idAttachFile: 0, src: '', fileName: ''}
          ];

          vm.filesTAccesories = angular.copy(vm.accesoriosVeh);

          pericialFactory.siniester.GetSinister($stateParams.id, false).then(function(response) {
            if (response.data) {
              vm.siniestro = response.data;
              $interval(function() {getComentarios()}, 60000);
              if (!isTaller()) {
                if (vm.siniestro.caseNumber && vm.siniestro.sinisterNumber) {
                  getVersiones();
                } else {
                  vm.procurationFiles = undefined;
                }
                getInspecciones();
              }
              getOrdenes();

              vm.dataSiniestro.numSiniestro = vm.siniestro.sinisterNumber;
              vm.dataSiniestro.numExpdiente = vm.siniestro.fileNumber + vm.siniestro.typeFile;
              vm.dataSiniestro.fechaIngreso = vm.siniestro.admissionDate;


              //obtener ampliaciones
              if (vm.siniestro.detail.version > 1) {

                pericialFactory.siniester.Resource_Sinister_Extension_Get_List(vm.siniestro.idSinister).then(function(response) {
                  if (response.operationCode === 200) {
                    if (response.data) {
                      vm.dataSiniestro.ampliaciones = response.data;
                    }
                  }
                })
                  .catch(function(err){
                    console.log(err);
                    mModalAlert.showError(err.data.message, 'Error');
                  });

              }
              //obtener ampliaciones


              vm.dataSiniestro.idSinisterState = vm.siniestro.detail.idSinisterState;
              vm.dataSiniestro.idRegisterType = vm.siniestro.idRegisterType;
              vm.dataSiniestro.idExecutiveState = vm.siniestro.idExecutiveState;
              vm.dataSiniestro.version = vm.siniestro.detail.version;

              vm.dataAuto.placa = vm.siniestro.plateNumber;
              vm.dataAuto.modelo = vm.siniestro.brandName + ' ' +  vm.siniestro.modelName + ' ' +  vm.siniestro.vehYear;//'TOYOTA LAND CRUISER PRADO 2015';
              vm.dataAuto.numMotor = vm.siniestro.engineNumber;
              vm.dataAuto.serie = vm.siniestro.serialNumber;

              vm.dataAuto.perito = (vm.siniestro.proficientName) ? (vm.siniestro.proficientName + ' ' +  vm.siniestro.proficientLastName1 + ' ' +  vm.siniestro.proficientLastName2) : '';//'NOMBRE DE PERITO ASIGNADO';

              if (vm.siniestro.totalLoss) {
                // vm.flagTotalLossLetterEvaluation = (vm.siniestro.totalLoss.flagTotalLossLetterEvaluation && vm.siniestro.totalLoss.flagTotalLossLetterEvaluation === 'S') ? true : false;
                vm.flagTotalLossLetterEvaluation = (!vm.siniestro.totalLoss.flagTotalLossLetterEvaluation) ? false : true;
                vm.perdidaTotalFlag = (vm.siniestro.totalLoss.flagConfirmTotalLost) ? false : true;
                vm.flagConfirmTotalLost = (vm.siniestro.totalLoss.flagConfirmTotalLost && vm.siniestro.totalLoss.flagConfirmTotalLost === 'S') ? true : false;
                vm.showTotalLost = (vm.siniestro.totalLoss.flagTotalLossLetterEvaluation && vm.siniestro.totalLoss.flagTotalLossLetterEvaluation === 'S') ? true : false;
                vm.mValorComercial = vm.siniestro.totalLoss.commercialValue;
                vm.mValorRestos = vm.siniestro.totalLoss.valueOfRemains;
              }

              //carta de perdida
              if (vm.siniestro.totalLossLetter.length > 0) {
                vm.docFilesT = vm.siniestro.totalLossLetter;


                switch (vm.siniestro.totalLossLetter[0].fileExtension) {
                  case "DOC":
                    vm.iconFile = "ico-mapfre_321_doc";
                    break;
                  case "PDF":
                    vm.iconFile = "ico-mapfre_315_pdf";
                    break;
                  case "CSV":
                    vm.iconFile = "ico-mapfre_304_csv";
                    break;
                  case "EXCEL":
                    vm.iconFile = "ico-mapfre_139_excel";
                    break;
                  default:
                    vm.iconFile = "ico-mapfre_314_archivos";
                    break;
                }

              }

              //exterior
              if (vm.siniestro.vehiclePhotoExterior.length > 0) {

                angular.forEach(vm.siniestro.vehiclePhotoExterior, function(value,key) {
                  vm.filesTExt[vm.siniestro.vehiclePhotoExterior[key].idTypeFile-5] = vm.siniestro.vehiclePhotoExterior[key];
                });

                angular.forEach(vm.filesTExt, function(value,key) {
                  if (value.idAttachFile>0) {
                    getBase64Ext(key + 1, value.idTypeFile, '', value.idAttachFile, value.fileName, 1);
                  }
                });
              }

              //accesorios
              if (vm.siniestro.vehiclePhotoAccessories.length > 0) {

                angular.forEach(vm.siniestro.vehiclePhotoAccessories, function(value,key) {
                  vm.filesTAccesories[vm.siniestro.vehiclePhotoAccessories[key].idTypeFile-11] = vm.siniestro.vehiclePhotoAccessories[key];
                });

                angular.forEach(vm.filesTAccesories, function(value,key) {
                  if (value.idAttachFile>0) {
                    getBase64Accesories(key + 1, value.idTypeFile, '', value.idAttachFile, value.fileName, 1);
                  }
                });
              }

              //adicionales
              if (vm.siniestro.vehiclePhotoAdditional.length > 0) {
                angular.forEach(vm.siniestro.vehiclePhotoAdditional, function(value,key) {
                  if (value.idAttachFile>0) {
                    getBase64Aditionals(value.idAttachFile, value.fileName, 1);
                  }
                });
              }

              //comentarios
              getComentarios();
              $interval(function() {getComentarios()}, 60000)
              //comentarios
            }
          })
            .catch(function(err){
              mModalAlert.showError(err.data.message, 'Error');
            });

          vm.tabPresupuesto = '/pericial/app/servicios/templates/presupuesto2.html';
          vm.tabComentarios = '/pericial/app/servicios/templates/comentarios.html';

          vm.ingresadoPTFlag = true;
          vm.supervisorPTFlag = false;

          vm.tab = parseInt($stateParams.tab);

          pericialFactory.budget.GetListProficientType(false).then(function(response) {
            if (response.data.length > 0) {
              vm.peritoData = response.data;
            }
          })
            .catch(function(err){
              mModalAlert.showError(err.data.message, 'Error');
            });

          vm.imagenes =  $scope.$watch(function() { return vm.photoFile}, function(newVal, oldVal) {
            if (vm.photoFile !== undefined) {
              cargarImagen(vm.photoFile);
              // Reset the form model.
              // document.getElementById("frmPresupuesto2").reset();
            }
          });

          vm.imagenesExt =  $scope.$watch(function() { return vm.photoFileExt}, function(newVal, oldVal) {
            if (vm.photoFileExt !== undefined) {
              // console.log(vm.externas);
              cargarImagenExt(vm.index, vm.parameterId, vm.photoFileExt);
              // Reset the form model.
              // document.getElementById("frmPresupuesto2").reset();
            }
          });

          vm.setImageID = function (index, tipo) {
            vm.index = angular.copy(index+1);
            (tipo === 'exterior') ? index = 4+index : index = 10+index;
            vm.parameterId = index+1;
          };

          vm.imagenesAccesories =  $scope.$watch(function() { return vm.photoFileAccesories}, function(newVal, oldVal) {
            if (vm.photoFileAccesories !== undefined) {
              cargarImagenAccesories(vm.index, vm.parameterId, vm.photoFileAccesories);
              // Reset the form model.
              // document.getElementById("frmPresupuesto2").reset();
            }
          });

          vm.imagenesAditionals =  $scope.$watch(function() { return vm.photoFileAditionals}, function(newVal, oldVal) {
            if (vm.photoFileAditionals !== undefined) {
              cargarImagenAditionals(vm.photoFileAditionals);
              // Reset the form model.
              // document.getElementById("frmPresupuesto2").reset();
            }
          });

          vm.archivos =  $scope.$watch(function() { return vm.docFile}, function(newVal, oldVal) {
            if (vm.docFile !== undefined) {
              cargarDoc(vm.docFile);
              // Reset the form model.
              // document.getElementById("frmPresupuesto2").reset();
            }
          });

         vm.archivosFilesTExt =  $scope.$watch(function() { return vm.filesTExt}, function(newVal, oldVal) {
          });

          vm.archivosFilesTAccesories =  $scope.$watch(function() { return vm.filesTAccesories}, function(newVal, oldVal) {
          });

          vm.archivosFilesTAditionals =  $scope.$watch(function() { return vm.filesTAditionals}, function(newVal, oldVal) {
          });

          vm.listener = $scope.$watch('vm.dataSiniestro', function(nv)
          {
            if (isPerito()) {
              pericialFactory.proficient.getTipoPerito().then(function(response) {
                if (response.operationCode === 200) {
                  if (response.data) {
                    vm.proficientType = response.data.type;
                    vm.proficientCode = response.data.code;

                    if (vm.siniestro.proficient && vm.siniestro.proficient.idProficient) {
                      vm.isMine = vm.siniestro.proficient.idProficient === vm.proficientCode;
                    }
                  }
                }
              }).catch(function(err){
                console.log(err);
                mModalAlert.showError(err.data.message, 'Error');
              });
            }
          });

        };

      function eventConfirmInfo(){

        angular.forEach(vm.filesTExt, function(value,key) {
          if(value.src === '') {
            vm.emptyFilesTExt = true;
          } else {
            vm.emptyFilesTExt = false;
          }
        });

        angular.forEach(vm.filesTAccesories, function(value,key) {
          if(value.src === '') {
            vm.emptyFilesTAccesories = true;
          } else {
            vm.emptyFilesTAccesories = false;
          }
        });

        if ((!vm.emptyFilesTExt && !vm.emptyFilesTAccesories)) {
          if(!vm.docFilesT.length>0) {
            mModalAlert.showError("Debe carga la Carta de declaración de pérdida ", 'Error');
          } else {
            vm.params = {
              idSinisterDetail: $stateParams.id
            };

            if (vm.params) {
              mModalConfirm.confirmInfo('¿Está seguro que desea registrar la siguiente pérdida total?', 'registrar pérdida total', 'registrar')
                .then(function() {
                  pericialFactory.siniester.Resource_Sinister_Workshop_SaveTotalLoss(vm.params).then(function(response) {
                    if (response.operationCode === 200) {
                      if (response.data) {
                        mModalAlert.showSuccess('Daños registrados exitosamente', '').then(function () {
                          $state.reload();
                        })
                      }
                    }
                  })
                    .catch(function(err){
                      console.log(err);
                      mModalAlert.showError(err.data.message, 'Error');
                    });
                  // $scope.fnShowAlert();
                });
            }
          }

        } else {
          mModalAlert.showError("Complete las fotos externas y/o accesorios del vehículo", 'Error');
        }


      }

      function eventSuccess() {
        var response = true;
        if (response) {
          mModalAlert.showSuccess('Daños registrados exitosamente', '').then(function() {
            // console.log('Éxitoooo...');
          });
        }
      }

      function sendComment(message){
        if(message){

          vm.params = {
            idSinisterDetail: $stateParams.id,
            idSinisterState: vm.siniestro.detail.idSinisterState,
            commentary: (message) ? message.toUpperCase() : ''
          };

          pericialFactory.comment.AddMovement(vm.params).then(function(response) {
            if (response) {
              vm.mComment = '';
              getComentarios();
            }
          })
            .catch(function(err){
              console.log(err);
              mModalAlert.showError(err.data.message, 'Error');
            });
        }
      }

    function getComentarios() {
      pericialFactory.comment.GetListMovement(vm.siniestro.idSinister).then(function(response) {
        if (response.operationCode === 200) {
          if (response.data.length > 0) {
            vm.comentariosList = response.data;

            angular.forEach(vm.comentariosList, function(value,key) {
              vm.comentariosList[key].showHT = pericialFactory.general.getShowHT(value);
            });
          }
        }
      })
        .catch(function(err){
          console.log(err);
          // mModalAlert.showError("Error en GetListMovement", 'Error');
        });
    }

      function deleteFile(index, array, type) {
        vm.filesBkp = [];
          angular.forEach(array, function(value,key) {
            if (key !== index) {
              if(type === 1) {
                vm.filesBkp[key] = array[key];
              } else if (type === 2) {
                vm.filesBkp[key] = array[key];
              }
            } else {
              pericialFactory.attach.deleteFile(value.idAttachFile, $stateParams.id).then(function(response) {
                if (response.operationCode === 200) {
                  array.splice(index, 1);
                  if(type === 1) {
                    vm.filesBkp[key] = vm.exteriorVeh[key];
                  } else if (type === 2) {
                    vm.filesBkp[key] = vm.accesoriosVeh[key];
                  } else if (type === 3 ) {
                    vm.filesTAditionals.splice(index, 1);
                    vm.archivosFilesTAditionals();
                  }
                } else {
                  mModalAlert.showError("Error al eliminar el archivo", 'Error');
                }
              })
                .catch(function(err){
                  mModalAlert.showError(err.data.message, 'Error');
                });
            }
          });

          if(type === 1) {
            vm.filesTExt = vm.filesBkp;
          } else if (type === 2) {
            vm.filesTAccesories = vm.filesBkp;
          }
      }

      function getBase64(idImage,fileName, preLoad) {
        pericialFactory.attach.GetImage(idImage, 0).then(function(response) {
          if (response) {
            vm.dataImagen = {
              idAttachFile: idImage,
              src: response,
              fileName: (preLoad === 1) ? [{name: fileName}] : vm.photoFile
            };
            vm.filesT.push(vm.dataImagen);
          }
        })
          .catch(function(err){
          //  mModalAlert.showError("Error en GetImage", 'Error');
          });

      }

      function getBase64Ext(index, id, title, idImage, fileName, preLoad) {
        pericialFactory.attach.GetImage(idImage, 0).then(function(response) {
          if (response) {
            vm.dataImagen = {
              id: index,
              title: title,
              idAttachFile: idImage,
              src: response,
              fileName: (preLoad === 1) ? [{name: fileName}] : vm.photoFileExt
            };

            //{id: 1, title: 'Fotografía frontal', idAttachFile: 0, src: '', fileName: ''},
            vm.filesTExt[index-1] = (vm.dataImagen);
          }
        })
          .catch(function(err){
           // mModalAlert.showError("Error en GetImage", 'Error');
          });

      }

      function getBase64Accesories(index, id, title, idImage, fileName, preLoad) {
        pericialFactory.attach.GetImage(idImage, 0).then(function(response) {
          if (response) {
            vm.dataImagen = {
              idAttachFile: idImage,
              src: response,
              fileName: (preLoad === 1) ? [{name: fileName}] : vm.photoFileAccesories
            };
            vm.filesTAccesories[index-1] = (vm.dataImagen);
          }
        })
          .catch(function(err){
           // mModalAlert.showError("Error en GetImage", 'Error');
          });

      }

      function getBase64Aditionals(idImage,fileName, preLoad) {
        pericialFactory.attach.GetImage(idImage, 0).then(function(response) {
          if (response) {
            vm.dataImagen = {
              idAttachFile: idImage,
              src: response,
              fileName: (preLoad === 1) ? [{name: fileName}] : vm.photoFileAditionals
            };
            vm.filesTAditionals.push(vm.dataImagen);
          }
        })
          .catch(function(err){
          //  mModalAlert.showError("Error en GetImage", 'Error');
          });

      }

      function showImage(idImage, value) {

        pericialFactory.attach.GetImage(idImage, value).then(function(response) {
          if (response) {
            $uibModal.open({
              backdrop: true, // background de fondo
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              //size: 'lg',
              windowClass: 'modalImg',
              templateUrl: 'tplModal.html',
              controllerAs: '$ctrl',
              controller: [
                '$uibModalInstance',
                function($uibModalInstance) {
                  var vm = this;
                  vm.closeModal = closeModal;
                  vm.photoBase64 = response;
                  function closeModal() {
                    // $uibModalInstance.dismiss('cancel');
                    $uibModalInstance.close();
                  }
                }
              ]
            });
          }
        })
          .catch(function(err){
          //  mModalAlert.showError("Error en GetImage", 'Error');
          });
      }

      function cargarImagen(foto) {

      // if (vm.filesT.length>0) {
      if(foto){

        var fd = new FormData();
        fd.append("idSinisterDetail", JSON.stringify(parseInt($stateParams.id)));

        // if ($scope.filesT === undefined) {
        //   // fd.append("fieldNameHere", null);
        // } else {
        //   for(var i=0; i<$scope.filesT.length; i++) {
        //     fd.append("fieldNameHere", $scope.filesT[i][0]);
        //   }
        // }

        fd.append("fieldNameHere", foto[0]);

        $http.post(constants.system.api.endpoints.gper + 'api/attachfile/workshop/photo', fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined},
          eventHandlers: {
            progress: function(c) {
              // console.log('Progress -> ' + c);
              // console.log(c);
            }
          },
          uploadEventHandlers: {
            progress: function(e) {
              // mpSpin.start();
              // console.log('UploadProgress -> ' + e);
              // console.log(e);
              // console.log('loaded: ' + e);
              // console.log('total: ' + e);
            }
          }
        })
          .success(function(response) {
            // mpSpin.end();
            if (response.operationCode === 500) {
              mModalAlert.showError(response.data, 'Error');
            }else{
              vm.filesID.push(response.data[0]);
              vm.idImage = response.data[0];

              getBase64(vm.idImage, '', 0);
            }
          })
          .catch(function(err){
            mModalAlert.showError(err.data.message, 'Error');
            // mpSpin.end();
          });
      }
    }

      function cargarImagenExt(index, id, foto) {

        if(foto){

          var fd = new FormData();
          fd.append("idFileType", vm.parameterId);
          fd.append("idSinisterDetail", JSON.stringify(parseInt($stateParams.id)));
          fd.append("fieldNameHere", foto[0]);

          $http.post(constants.system.api.endpoints.gper + 'api/attachfile/workshop/total/loss/vehicle/outside', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined},
            eventHandlers: {
              progress: function(c) {
                // console.log('Progress -> ' + c);
                // console.log(c);
              }
            },
            uploadEventHandlers: {
              progress: function(e) {
               // mpSpin.start();
                // console.log('UploadProgress -> ' + e);
                // console.log(e);
                // console.log('loaded: ' + e);
                // console.log('total: ' + e);
              }
            }
          })
            .success(function(response) {
             // mpSpin.end();
              if (response.operationCode === 500) {
                mModalAlert.showError(response.data, 'Error');
              }else{
                vm.filesID.push(response.data[0]);
                vm.idImage = response.data[0];

                getBase64Ext(index, id, vm.exteriorVeh[index-1].title, vm.idImage, '', 0);
              }
            })
            .catch(function(err){
              mModalAlert.showError(err.data.message, 'Error');
            //  mpSpin.end();
            });
        }
      }

      function cargarImagenAccesories(index, id, foto) {

        if(foto){

          var fd = new FormData();
          fd.append("idFileType", vm.parameterId);
          fd.append("idSinisterDetail", JSON.stringify(parseInt($stateParams.id)));
          fd.append("fieldNameHere", foto[0]);

          $http.post(constants.system.api.endpoints.gper + 'api/attachfile/workshop/total/loss/vehicle/accessory', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined},
            eventHandlers: {
              progress: function(c) {
                // console.log('Progress -> ' + c);
                // console.log(c);
              }
            },
            uploadEventHandlers: {
              progress: function(e) {
                // mpSpin.start();
                // console.log('UploadProgress -> ' + e);
                // console.log(e);
                // console.log('loaded: ' + e);
                // console.log('total: ' + e);
              }
            }
          })
            .success(function(response) {
              // mpSpin.end();
              if (response.operationCode === 500) {
                mModalAlert.showError(response.data, 'Error');
              }else{
                vm.filesID.push(response.data[0]);
                vm.idImage = response.data[0];

                getBase64Accesories(index, id, vm.accesoriosVeh[index-1].title, vm.idImage, '', 0);
              }
            })
            .catch(function(err){
              mModalAlert.showError(err.data.message, 'Error');
              // mpSpin.end();
            });
        }
      }

      function cargarImagenAditionals(foto) {

      if(foto){

        var fd = new FormData();
        fd.append("idFileType", 18);
        fd.append("idSinisterDetail", JSON.stringify(parseInt($stateParams.id)));
        fd.append("fieldNameHere", foto[0]);

        $http.post(constants.system.api.endpoints.gper + 'api/attachfile/workshop/total/loss/vehicle/aditional', fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined},
          eventHandlers: {
            progress: function(c) {
              // console.log('Progress -> ' + c);
              // console.log(c);
            }
          },
          uploadEventHandlers: {
            progress: function(e) {
              // mpSpin.start();
              // console.log('UploadProgress -> ' + e);
              // console.log(e);
              // console.log('loaded: ' + e);
              // console.log('total: ' + e);
            }
          }
        })
          .success(function(response) {
            // mpSpin.end();
            if (response.operationCode === 500) {
              mModalAlert.showError(response.data, 'Error');
            }else{
              vm.filesID.push(response.data[0]);
              vm.idImage = response.data[0];

              getBase64Aditionals(vm.idImage, '', 0);
            }
          })
          .catch(function(err){
            mModalAlert.showError(err.data.message, 'Error');
            // mpSpin.end();
          });
      }
    }

      function cargarDoc(doc) {

        if(doc){

          var fd = new FormData();
          fd.append("idSinisterDetail", JSON.stringify(parseInt($stateParams.id)));
          fd.append("fieldNameHere", doc[0]);

          $http.post(constants.system.api.endpoints.gper + 'api/attachfile/workshop/total/loss/letter/declaration', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined},
            eventHandlers: {
              progress: function(c) {
                // console.log('Progress -> ' + c);
                // console.log(c);
              }
            },
            uploadEventHandlers: {
              progress: function(e) {
                mpSpin.start();
                // console.log('UploadProgress -> ' + e);
                // console.log(e);
                // console.log('loaded: ' + e);
                // console.log('total: ' + e);
              }
            }
          })
            .success(function(response) {
              mpSpin.end();
              if (response.operationCode === 500) {
                mModalAlert.showError(response.data.message, 'Error');
              }else{
                vm.idDoc = response.data[0];

                vm.dataDoc = {
                  idAttachFile: vm.idDoc,
                  fileName: vm.docFile[0].name//(preLoad === 1) ? [{name: fileName}] : vm.photoFile
                };
                vm.docFilesT.push(vm.dataDoc);

              }
            })
            .catch(function(err){
              mModalAlert.showError(err.data.message, 'Error');
              mpSpin.end();
            });
        }
      }

      function downloadFile(idFile) {
        vm.attachFileIngresadoURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gper + 'api/attachfile/file/' + idFile);

        $timeout(function() {
          document.getElementById('frmAttachFileIngresado').submit();
        }, 500);
      }

      function isPerito() {
        return vm.rol === 'PERITO';
      }

      function isSupervisor() {
        return vm.rol === 'SUPERVISOR';
      }

      function downloadInventory(tipo) {
        if (tipo) {
          vm.urlInventory = (tipo === 1) ? 'api/letter/download/vehicle_inventory/1/PDF' : 'api/letter/download/truck_inventory/1/PDF';

          vm.attachFileIngresadoURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gper + 'vm.urlInventory');

          $timeout(function () {
            document.getElementById('frmAttachFileIngresado').submit();
          }, 500);
        }
      }

      vm.fnShowAlertConfirm = eventConfirmInfo;
      vm.fnShowAlert = eventSuccess;
      vm.sendComment = sendComment;
      vm.getBase64 = getBase64;
      vm.getBase64Ext = getBase64Ext;
      vm.getBase64Accesories = getBase64Accesories;
      vm.getBase64Aditionals = getBase64Aditionals;
      vm.cargarImagen = cargarImagen;
      vm.cargarImagenExt = cargarImagenExt;
      vm.cargarImagenAccesories = cargarImagenAccesories;
      vm.cargarImagenAditionals = cargarImagenAditionals;
      vm.deleteFile = deleteFile;
      vm.showImage = showImage;
      vm.cargarDoc = cargarDoc;
      vm.downloadFile = downloadFile;
      vm.isPerito = isPerito;
      vm.isSupervisor = isSupervisor;
      vm.fnRechazarSiniestro = RechazarSiniestro;

      function RechazarSiniestro() {
        vm.frmPresupuesto2.markAsPristine();
        if (vm.frmPresupuesto2.$valid) {

          vm.paramsRegistroPT = {
            idSinisterDetail: $stateParams.id,
            totalLoss: {
              commercialValue: (vm.mValorComercial) ? parseInt(vm.mValorComercial) : 0,
              valueOfRemains: (vm.mValorRestos) ? parseInt(vm.mValorRestos) : 0,
              flagConfirmTotalLost: "N"
            }
          };
          mModalConfirm.confirmInfo('¿Está seguro de rechazar el siguiente siniestro?', 'Rechazar siniestro', 'Rechazar').then(function (response) {
            console.log('Rechazar siniestro...');
            vm.paramsRegistroPT.idSinisterDetail = parseInt(vm.paramsRegistroPT.idSinisterDetail);
            vm.paramsRegistroPT.totalLoss.flagConfirmTotalLost = "N";
            pericialFactory.supervisor.Resource_Sinister_Supervisor_ValidateTotalLoss(vm.paramsRegistroPT).then(function(response) {
              if (response.operationCode === 200) {
                if (response.data) {
                  rechazarSiniestroExito();
                }
              }
            })
              .catch(function(err){
                console.log(err);
                mModalAlert.showError(err.data.message, 'Error');
              });
          });
        }
      }

      function rechazarSiniestroExito() {
        var response = true;
        if (response) {
          mModalAlert.showSuccess('Siniestro rechazado', '').then(function () {
            console.log('Siniestro rechazado...');
            $state.go('bandejaServicios', {reload: true, inherit: false});
          });
        }
      }

      vm.fnAprobarSiniestro = AprobarSiniestro;

      function AprobarSiniestro() {
        vm.frmPresupuesto2.markAsPristine();
        if (vm.frmPresupuesto2.$valid) {
          vm.paramsRegistroPT = {
            idSinisterDetail: $stateParams.id,
            totalLoss: {
              commercialValue: (vm.mValorComercial) ? parseInt(vm.mValorComercial) : 0,
              valueOfRemains: (vm.mValorRestos) ? parseInt(vm.mValorRestos) : 0,
              flagConfirmTotalLost: "N"
            }
          };

          mModalConfirm.confirmInfo('¿Está seguro de aprobar el siguiente siniestro?', 'Aprobar pérdida', 'Aprobar').then(function (response) {
            console.log('Aprobar siniestro...');
            vm.paramsRegistroPT.idSinisterDetail = parseInt(vm.paramsRegistroPT.idSinisterDetail);
            vm.paramsRegistroPT.totalLoss.flagConfirmTotalLost = "S";
            pericialFactory.supervisor.Resource_Sinister_Supervisor_ValidateTotalLoss(vm.paramsRegistroPT).then(function(response) {
              if (response.operationCode === 200) {
                if (response.data) {
                  aprobarSiniestroExito();
                }
              }
            })
              .catch(function(err){
                console.log(err);
                mModalAlert.showError(err.data.message, 'Error');
              });
          });
        }
      }

      function aprobarSiniestroExito() {
        var response = true;
        if (response) {
          mModalAlert.showSuccess('Siniestro aprobado', '').then(function () {
            console.log('Siniestro aprobado...');
            $state.go('bandejaServicios', {reload: true, inherit: false});
          });
        }
      }

      function getVersiones() {
        pericialFactory.webproc
          .GetVersion(vm.siniestro.caseNumber, vm.siniestro.sinisterNumber)
          .then(function gvSP(resp) {
            vm.procurationFiles = resp.data;
          })
          .catch(function gvEP(err) {
            vm.procurationFiles = undefined;
          });
      }

    function getInspecciones() {
      if (vm.siniestro.riskNumber > 0 && vm.siniestro.inspectionNumber > 0) {
        pericialFactory.inspec
          .getFileInspec(vm.siniestro.riskNumber, vm.siniestro.inspectionNumber)
          .then(function gvSP(resp) {
            vm.inspectionFiles = resp.data;
          })
          .catch(function gvEP(err) {
            vm.inspectionFiles = [];
          });
      }
    }

    function getOrdenes() {
      if(vm.siniestro.idWorkshop) {
        pericialFactory.siniester
          .Resource_Workorder_Get_List(vm.siniestro.sinisterNumber, vm.siniestro.fileNumber, vm.siniestro.idWorkshop)
          .then(function gvSP(resp) {
            vm.ordenFiles = resp.data;
          })
          .catch(function gvEP(err) {
            vm.ordenFiles = [];
          });
      }
    }

    function downloadOrden(idFile) {
      if (idFile) {
        if (constants.environment === 'QA') {
          $window.open(constantsPericial.ot.qa + idFile,'_blank');
        } else if (constants.environment === 'PROD') {
          $window.open(constantsPericial.ot.prod + idFile,'_blank');
        }
      }
    }

    vm.downloadOrden = downloadOrden;

      function downloadProcuracion(idFile) {
        pericialFactory.webproc.DownloadVersion(
          'api/Siniestro/versions/download/' + vm.siniestro.caseNumber + '/' + idFile, vm.siniestro.caseNumber
        );
      }

      function downloadInspection(idFile) {
        if (idFile) {
          $window.open(constants.system.api.endpoints.inspec + idFile,'_blank');
        }
      }

      function isTaller() {
        return (vm.rol === 'TALLER');
      }

      vm.downloadProcuracion = downloadProcuracion;
      vm.downloadInspection = downloadInspection;
      vm.isTaller = isTaller;

      vm.goToHistorial = goToHistorial;
      function goToHistorial(item, version) {
        if (item) {
          pericialFactory.general.goToItemVersion('servicioPresupuestado', item, 0, version);
        }
      }

      vm.$onDestroy = function() {
          //clean watch
          vm.imagenes();
          vm.imagenesExt();
          vm.imagenesAccesories();
          vm.imagenesAditionals();
          vm.archivos();
          vm.archivosFilesTExt();
          vm.archivosFilesTAccesories();
          vm.archivosFilesTAditionals();
          vm.listener();
        };

      } // end
      return angular.module('appPericial')
        .controller('ServicioIngresadoPTController', ServicioIngresadoPTController)
    });
