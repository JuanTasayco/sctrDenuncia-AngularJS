'use strict';

define(['angular', 'constants', 'constantsPericial', 'mocksPericial', 'helper', 'pericialFactory'], function(
  angular, constants,
  constantsPericial, mocksPericial, helper) {

  ServicioIngresadoController.$inject = [
    '$scope', '$window', '$state', '$sce', '$timeout', 'mainServices', '$uibModal', 'mModalAlert', 'mModalConfirm', '$stateParams', 'pericialFactory', '$http',
'mpSpin', '$q', 'oimClaims', '$interval' ];

  function ServicioIngresadoController(
    $scope, $window, $state, $sce, $timeout, mainServices, $uibModal, mModalAlert, mModalConfirm, $stateParams, pericialFactory, $http, mpSpin, $q, oimClaims, $interval
  ) {
    var vm = this;
    vm.siniestro = {};
    vm.filesT = [];
    vm.filesImage = [];
    vm.docFilesT = [];
    vm.filesID = [];
    vm.filesBKP = [];
    vm.iconFile = "ico-mapfre_314_archivos";
    // list of all promises
    vm.promises = [];
    // vm.tag = 'ingresado';

    vm.$onInit = function() {
      vm.dataUser = JSON.parse(localStorage.getItem('evoProfile'));
      vm.firstVersion = (parseInt($stateParams.version) === 1);
      //menu
      vm.ingresadoFlag = true;
      vm.etiquetaVal = 'Ingresado al Taller';
      vm.turnOnAmarillo = vm.enReparacionFlag;
      vm.turnOnNaranja = vm.presupuestadoFlag || vm.presupuestadoVirtFlag || vm.presupuestadoAsigFlag || vm.presupuestadoZoneFlag || vm.peritajeFlag;
      vm.turnOnVerde = vm.ingresadoFlag || vm.ingresadoPTFlag || vm.peritadoFlag || vm.porEntregarFlag || vm.perdidaTotalFlag;
      vm.turnOnGris = vm.entregadoFlag;
      vm.turnOnRojo = false
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
      
      saveTracker(isTaller());

      pericialFactory.siniester.GetSinister($stateParams.id, false).then(function(response) {
        if (response.data) {
          vm.siniestro = response.data;
          vm.siniestro.mDatosReparacion = 'N';
          vm.tag = vm.siniestro.sinisterState;

          if (vm.siniestro && vm.siniestro.detail && vm.siniestro.detail.idSinisterState === 9) {
            vm.etiquetaVal = 'ANULADO'
            vm.turnOnVerde = false
            vm.turnOnRojo = true
          }

          if (!isTaller()) {
            if (vm.siniestro.caseNumber && vm.siniestro.sinisterNumber) {
              getVersiones();
            } else {
              vm.procurationFiles = undefined;
            }
            getInspecciones();
          }
          getOrdenes();
          pericialFactory.damage.GetListDamage(false).then(function(response) {
            if (response.data.length > 0) {
              vm.nivelDanhoData = response.data;

              pericialFactory.budget.GetListProficientType(false).then(function(response) {
                if (response.data.length > 0 && vm.siniestro.idRegisterType !== 5) {
                  vm.peritoData = response.data;
                }
              })
                .catch(function(err){
                  mModalAlert.showError("Error en GetListProficientType", 'Error');
                });
            }
          })
            .catch(function(err){
              console.log(err);
              mModalAlert.showError("Error en GetListDamage", 'Error');
            });
          switch (vm.siniestro.idRegisterType) {// 5 regular, 6 PAR, 7 PT
            case 5:
              vm.peritoData = [{idProficient: 1, name: "VIRTUAL"}, {idProficient: 2, name: "PRESENCIAL"}];
              break;
            case 6: //PAR
              vm.isDisabledTipoPerito = true;
              vm.isDisabledNivelDanho = true;
              // vm.siniestro.mNivelDanho = {};
              vm.siniestro.mNivelDanho = {idDamage: 1, damageLevel: "LEVE"};
              // vm.siniestro.mTipoPerito = {};
              vm.siniestro.mTipoPerito = {idProficient: 3, name: "PAR"};
              break;
            case 7:
              break;
            default:
          }

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
          if (vm.siniestro.workshopPhotoVehicle.length > 0) {
            vm.filesBKP = vm.siniestro.workshopPhotoVehicle;

            angular.forEach(vm.filesBKP, function(value,key) {
             getBase64(value.idAttachFile, value.fileName, 1);
            });
          }
          
          //presupuesto
          if (vm.siniestro.workshopBudgets.attachFiles.length > 0) {
            vm.docFilesT = vm.siniestro.workshopBudgets.attachFiles;

            if (vm.siniestro.totalLossLetterlength > 0) {
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
          }

          //comentarios
          getComentarios();
          $interval(function() {getComentarios()}, 60000);
          //comentarios

          //registrar nuevamente cuando hay una observacion

          if(vm.siniestro.proficient && vm.siniestro.proficient.flagRequestInformation) {
            vm.registradaObservada = (vm.siniestro.proficient.flagRequestInformation === 'S');
            vm.isDisabledNivelDanho = vm.registradaObservada;
            // vm.siniestro.mNivelDanho
            vm.isDisabledTipoPerito = vm.registradaObservada;
            vm.siniestro.mTipoPerito = {idProficient: vm.siniestro.proficient.idTypeProficient};

            if (vm.siniestro.budget) {
              vm.siniestro.mNivelDanho = {idDamage: vm.siniestro.budget.idTypeDamage};
              vm.siniestro.mDatosReparacion = vm.siniestro.budget.initialEstimate.flagSpare;
              vm.siniestro.mDispStock = vm.siniestro.budget.initialEstimate.flagStock;
              vm.siniestro.mDiasRepa = vm.siniestro.budget.initialEstimate.estimatedRepairDays;
              vm.siniestro.mDiasLlegadaRep = vm.siniestro.budget.initialEstimate.arrivalDayOfSpareParts;
            }

          }
        }
      })
        .catch(function(err){
          mModalAlert.showError("Error en GetSinister", 'Error');
        });

      vm.imagenes =  $scope.$watch(function() { return vm.photoFile}, function(newVal, oldVal) {
        if (vm.photoFile !== undefined) {
          angular.forEach(vm.photoFile, function(value,key) {
            cargarImagen(value);
            vm.formularioChanged();
          });
          // Reset the form model.
          // document.getElementById("presupuestoForm").reset();
        }
      });

      vm.archivos =  $scope.$watch(function() { return vm.docFile}, function(newVal, oldVal) {
        if (vm.docFile !== undefined) {
          angular.forEach(vm.docFile, function(value,key) {
            cargarDoc(value, value.name);
            vm.formularioChanged();
          });
          // Reset the form model.
          // document.getElementById("presupuestoForm").reset();
        }
      });

      vm.tabPresupuesto = '/pericial/app/servicios/templates/presupuesto.html';
      // vm.tabReparaciones = '/pericial/app/servicios/templates/reparaciones.html';
      vm.tabComentarios = '/pericial/app/servicios/templates/comentarios.html';

      vm.ingresadoATallerFlag = true;
      vm.presupAmpFlag = false;
      vm.porEntregarFlag = false;

      vm.showPhotoFile = true;
      vm.showPresupuestoFile = true;

      vm.disabledDatosRepar = true;
      vm.siniestro.mDatosReparacion = 'N';

      vm.fnShowStock = function(){
        if (vm.siniestro.mDatosReparacion !== 'value') {
          (vm.siniestro.mDatosReparacion === 'S') ? vm.showStock = false : vm.showStock = true;
        }
      };

      vm.tab = parseInt($stateParams.tab);

      pericialFactory.budget.GetListType(false).then(function(response) {
        if (response.data.length > 0) {
          vm.tipoPresupuestoData = response.data;
        }
      })
        .catch(function(err){
          mModalAlert.showError("Error en GetListType", 'Error');
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

     function saveTracker(isTaller){
       vm.paramTracker = {
         idSinisterDetail: $stateParams.id,
         CodigoPerfil: vm.rol,
         DescripcionOperacion : isTaller ?  'INGRESO A CARGAR PRESUPUESTO':'INGRESO A DETALLE',
         OpcionMenu : isTaller ? 'GPER > Principal > Cargar Presupuesto': 'GPER > Principal > Ver Detalle'
       };
 
       pericialFactory.siniester.SaveTracker(vm.paramTracker).then(function(response) {
         
       })
         .catch(function(err){
           console.log(err);
             mModalAlert.showError("Error en SaveTracker", 'Error');
         });
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

    function deleteFile(index, array, type) {
      vm.filesBkp = [];

      angular.forEach(array, function(value,key) {
        if (key !== index) {
          vm.filesBkp.push(array[key]);
        } else {
          pericialFactory.attach.deleteFile(value.idAttachFile, $stateParams.id).then(function(response) {
            if (response.operationCode === 200) {
            } else {
              mModalAlert.showError("Error en deleteFile", 'Error');
            }
          })
            .catch(function(err){
              mModalAlert.showError("Error en deleteFile", 'Error');
            });
        }
      });
      if(type === 0) {
        vm.filesT = vm.filesBkp;
      } else {
        vm.docFilesT = vm.filesBkp;
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
          console.log(err);
         // mModalAlert.showError("Error en GetImage", 'Error');
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
            // size: 'lg',
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
          console.log(err);
         // mModalAlert.showError("Error en GetImage", 'Error');
        });
    }

    function sendComment(message){
      if(message){

        vm.params = {
          idSinisterDetail: $stateParams.id,
          idSinisterState: vm.siniestro.detail.idSinisterState,
          commentary: (message) ? message.toUpperCase() : '',
          tracker: {
            CodigoPerfil: vm.rol
          }
        };

        pericialFactory.comment.AddMovement(vm.params).then(function(response) {
          if (response) {
            vm.mComment = '';
            getComentarios();
          }
        })
          .catch(function(err){
            console.log(err);
            mModalAlert.showError("Error en AddMovement", 'Error');
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

    function cargarImagen(foto) {
      if(foto){

        var fd = new FormData();
        fd.append("idSinisterDetail", JSON.stringify(parseInt($stateParams.id)));
        fd.append("fieldNameHere", foto);

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
            console.log(err);
            mModalAlert.showError(err.data.message, 'Error');
            // mpSpin.end();
          });
      }
    }

    function cargarDoc(doc, nameDoc) {

      if(doc){

        var fd = new FormData();
        fd.append("idSinisterDetail", JSON.stringify(parseInt($stateParams.id)));
        fd.append("fieldNameHere", doc);
        mpSpin.start();
        $http.post(constants.system.api.endpoints.gper + 'api/attachfile/workshop/budget', fd, {
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
            mpSpin.end();
            if (response.operationCode === 500) {
              mModalAlert.showError(response.data, 'Error');
            }else{
              vm.idDoc = response.data[0];

              vm.dataDoc = {
                idAttachFile: vm.idDoc,
                fileName: nameDoc//(preLoad === 1) ? [{name: fileName}] : vm.photoFile
              };
              vm.docFilesT.push(vm.dataDoc);

            }
          })
          .catch(function(err){
            console.log(err);
            mModalAlert.showError('Error al cargar el documento', 'Error');
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

    function formularioChanged() {
      if (vm.siniestro.mTipoPerito && vm.siniestro.mTipoPerito.idProficient && vm.siniestro.mNivelDanho && vm.siniestro.mNivelDanho.idDamage) {
        vm.paramsRegistro = {
          idSinisterDetail: $stateParams.id,
          budget: {
            idTypeBudget: 1,
            idTypeDamage: vm.siniestro.mNivelDanho.idDamage,
            InitialEstimate: {
              FlagSpare: (vm.siniestro.mDatosReparacion) ? vm.siniestro.mDatosReparacion : 'N',
              FlagStock: (vm.siniestro.mDispStock) ? vm.siniestro.mDispStock : 'N',
              ArrivalDayOfSpareParts: (vm.siniestro.mDiasLlegadaRep) ? vm.siniestro.mDiasLlegadaRep : 0,
              EstimatedRepairDays: (vm.siniestro.mDiasRepa) ? vm.siniestro.mDiasRepa : 0
            }
          },
          proficient: {
            idTypeProficient: vm.siniestro.mTipoPerito.idProficient
          },
          tracker: {
            CodigoPerfil: vm.rol
          }
        };
      }
    }

    function isTaller() {
     return (vm.rol === 'TALLER');
    }

    vm.fnRegistrar = Registrar;

    function Registrar() {
      vm.presupuestoForm.markAsPristine();
      // if (vm.presupuestoForm.$valid) {
        if (vm.paramsRegistro && vm.siniestro.mTipoPerito.idProficient && vm.siniestro.mNivelDanho.idDamage &&
          vm.paramsRegistro.budget.InitialEstimate.EstimatedRepairDays>0) {
          mModalConfirm.confirmInfo('¿Está seguro que desea generar registrar los datos del siniestro?', 'Registar Siniestro', 'Continuar').then(function () {
            pericialFactory.siniester.Resource_Sinister_Workshop_SaveBudget(vm.paramsRegistro).then(function(response) {
              if (response.operationCode === 200) {
                if (response.data) {
                  mModalAlert.showSuccess('Información registrada exitosamente.', '').then(function () {
                    $state.go('bandejaServicios', {reload: true, inherit: false});
                  })
                }
              }
            })
              .catch(function(err){
                console.log(err);
                mModalAlert.showError(err.data.message, 'Error');
              });
          });
        }
     // }
    }
    
    vm.fnActualizar = actualizar;
    function actualizar() {

      vm.paramsRegistro = {
        idSinisterDetail: $stateParams.id,
        proficient: {
          flagRequestInformation: 'N'
        }
      };

      mModalConfirm.confirmInfo('¿Está seguro que desea actualizar el registro de los datos del siniestro?', 'Actualizar Siniestro', 'Continuar').then(function () {
        pericialFactory.siniester.Resource_Sinister_Workshop_SolveObservation(vm.paramsRegistro).then(function(response) {
          if (response.operationCode === 200) {
            mModalAlert.showSuccess('Información actualizada exitosamente.', '').then(function () {
              $state.go('bandejaServicios', {reload: true, inherit: false});
            })
          }
        })
          .catch(function(err){
            console.log(err);
            mModalAlert.showError(err.data.message, 'Error');
          });
        });
    }

    function goTo(url, item, tab) {
      if($stateParams.id)
        $state.go(url, {
          id: $stateParams.id,
          version: ($stateParams.version) ? $stateParams.version : 1,
          tab: tab
        }, {reload: true, inherit: false});
    }

    function isPerito() {
      return (vm.rol === 'PERITO');
    }

    vm.getBase64 = getBase64;
    vm.deleteFile = deleteFile;
    vm.showImage = showImage;
    vm.sendComment = sendComment;
    vm.cargarImagen = cargarImagen;
    vm.cargarDoc = cargarDoc;
    vm.downloadFile = downloadFile;
    vm.downloadProcuracion = downloadProcuracion;
    vm.downloadInspection = downloadInspection;
    vm.formularioChanged = formularioChanged;
    vm.isTaller = isTaller;
    vm.isPerito = isPerito;
    vm.goToHistorial = goToHistorial;

    function goToHistorial(item, version) {
      if (item) {
        pericialFactory.general.goToItemVersion('servicioPresupuestado', item, 0, version);
      }
    }

    vm.$onDestroy = function() {
      //clean watch
      vm.imagenes();
      vm.archivos();
      vm.listener();
    };

  } // end
  return angular.module('appPericial')
    .controller('ServicioIngresadoController', ServicioIngresadoController)
});
