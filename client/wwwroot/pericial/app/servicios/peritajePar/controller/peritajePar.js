'use strict';

define(['angular', 'constantsPericial', 'mocksPericial', 'helper', 'pericialFactory'], function(
  angular,
  constantsPericial, mocksPericial, helper) {

  ServicioPeritajeParController.$inject = [
    '$scope', '$window', '$http', '$state', '$timeout', 'mainServices', '$uibModal', 'mModalAlert', 'mModalConfirm', '$stateParams', 'pericialFactory', 'oimClaims', '$interval'
  ];

  function ServicioPeritajeParController(
    $scope, $window, $http , $state, $timeout, mainServices, $uibModal, mModalAlert, mModalConfirm, $stateParams, pericialFactory, oimClaims, $interval
  ) {
      var vm = this;
      vm.siniestro = {};
      vm.filesT = [];
      vm.filesP = [];
      vm.filesBKP = [];
      vm.filesPBKP = [];
      vm.filesT = [];
      vm.filesTExt = [];
      vm.filesTAccesories = [];
      vm.filesTAditionals = [];

      vm.docFilesT = [];
      vm.filesID = [];
      vm.filesBKP = [];

      vm.$onInit = function() {
        vm.firstVersion = (parseInt($stateParams.version) === 1);
        //menu
        vm.peritajeFlag = true;
        vm.etiquetaVal = 'Presupuestado';
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

            if (vm.siniestro.budget) {
              vm.siniestro.mNivelDanho = {idDamage: vm.siniestro.budget.idTypeDamage};
              vm.siniestro.mDatosReparacion = vm.siniestro.budget.initialEstimate.flagSpare;
              vm.siniestro.mDispStock = vm.siniestro.budget.initialEstimate.flagStock;
              vm.siniestro.mDiasRepa = vm.siniestro.budget.initialEstimate.estimatedRepairDays;
              vm.siniestro.mDiasLlegadaRep = vm.siniestro.budget.initialEstimate.arrivalDayOfSpareParts;
            }
            if (vm.siniestro.proficient) {
              vm.siniestro.mTipoPerito = {idProficient: vm.siniestro.proficient.idTypeProficient};
              vm.dataSiniestro.proficientCode = vm.siniestro.proficient.idProficient;

              vm.isMine = vm.siniestro.proficient.idProficient === vm.proficientCode;
            }


            //fotos perito
            if (vm.siniestro.proficientPhotosVehicle.length > 0) {
              vm.filesBKP = vm.siniestro.proficientPhotosVehicle;

              angular.forEach(vm.filesBKP, function(value,key) {
                getBase64(value.idAttachFile, value.fileName, 1, vm.filesP);
              });
            }
            //fotos taller
            if (vm.siniestro.workshopPhotoVehicle.length > 0) {
              vm.filesBKP = vm.siniestro.workshopPhotoVehicle;

              angular.forEach(vm.filesBKP, function(value,key) {
                getBase64(value.idAttachFile, value.fileName, 1, vm.filesT);
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

      vm.sourcePhotos = 'Daños del vehículo - Taller';

      vm.tabPresupuesto = '/pericial/app/servicios/templates/presupuesto3.html';
      // vm.tabReparaciones = '/pericial/app/servicios/templates/reparaciones.html';
      vm.tabComentarios = '/pericial/app/servicios/templates/comentarios.html';

      vm.presupAmpFlag = false;
      vm.porEntregarFlag = false;
      vm.presupuestadoVirtFlag = false;
      vm.presupuestadoZoneFlag = false;
      vm.peritajeParFlag = true;

      vm.showPhotoFile = false;
      vm.showPresupuestoFile = false;

      vm.disabledDatosRepar = true;
      vm.showStock = true;
      vm.siniestro.mDatosReparacion = 'N';

      vm.fnShowStock = function(){
        if (vm.peritajeParFlag) return;
        if (vm.siniestro.mDatosReparacion !== 'value') {
          (vm.siniestro.mDatosReparacion === 'S') ? vm.showStock = true : vm.showStock = false;
        }
      };

      pericialFactory.budget.GetListProficientType(false).then(function(response) {
        if (response.data.length > 0) {
          vm.peritoData = response.data;
        }
      })
        .catch(function(err){
          mModalAlert.showError(err.data.message, 'Error');
        });

        vm.imagenesP =  $scope.$watch(function() { return vm.photoFileP}, function(newVal, oldVal) {
          if (vm.photoFileP !== undefined) {
            cargarImagen(vm.photoFileP, 'proficient/photo');
            // Reset the form model.
            // document.getElementById("frmPresupuesto3").reset();
          }
        });

        vm.imagenesT =  $scope.$watch(function() { return vm.filesT}, function(newVal, oldVal) {
          if (vm.filesT !== undefined) {
            cargarImagen(vm.filesT, 'workshop/photo');
            // Reset the form model.
            // document.getElementById("frmPresupuesto3").reset();
          }
        });

      vm.setImageID = function (index, tipo) {
        vm.index = angular.copy(index+1);
        (tipo === 'exterior') ? index = 4+index : index = 10+index;
        vm.parameterId = index+1;
      };

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

    function guardarPeritajeParExito() {
      var response = true;
      if (response) {
        mModalAlert.showSuccess('Daños registrados exitosamente', '').then(function() {
          console.log('Daños registrados exitosamente...');
        });
      }
    }

    function GuardarPeritajePar(){
      var response = true;
      if (response) {
        mModalConfirm.confirmInfo('¿Está seguro que desea registrar la siguiente pérdida total?', 'Registrar pérdida total', 'Registrar').then(function(response){
          console.log('Terminar peritaje...');
          guardarPeritajeParExito();
        });
      }
    }

    function showImage(photo) {
      $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        templateUrl: 'tplModal.html',
        controllerAs: '$ctrl',
        controller: [
          '$uibModalInstance',
          function($uibModalInstance) {
            var vm = this;
            vm.closeModal = closeModal;
            vm.photoBase64 = photo;
            function closeModal() {
              // $uibModalInstance.dismiss('cancel');
              $uibModalInstance.close();
            }
          }
        ]
      });
    }

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
              mModalAlert.showError(err.data.message, 'Error');
            });
        }
      });
      if(type === 0) {
        vm.filesT = vm.filesBkp;
      } else {
        vm.docFilesT = vm.filesBkp;
      }
    }

    function getBase64(idImage,fileName, preLoad, array) {
      pericialFactory.attach.GetImage(idImage, 0).then(function(response) {
        if (response) {
          vm.dataImagen = {
            idAttachFile: idImage,
            src: response,
            fileName: (preLoad === 1) ? [{name: fileName}] : vm.photoFileP
          };
          //vm.filesP.push(vm.dataImagen);
          array.push(vm.dataImagen);
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

    function cargarImagen(foto, url) {

      if(foto){

        var fd = new FormData();
        fd.append("idSinisterDetail", JSON.stringify(parseInt($stateParams.id)));
        fd.append("fieldNameHere", foto[0]);

        $http.post(constants.system.api.endpoints.gper + 'api/attachfile/' + url, fd, {
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
            }
          }
        })
          .success(function(response) {
            if (response.operationCode === 500) {
              mModalAlert.showError(response.data, 'Error');
            }else{
              vm.idImage = response.data[0];
              //getBase64(vm.idImage, '', 0);
            }
          })
          .catch(function(err){
            mModalAlert.showError(err.data.message, 'Error');
          });
      }
    }

    function isPerito() {
      return (vm.rol === 'PERITO');
    }

    function showAjustarPresupuesto() {
      vm.showPresupuestoVirtual = isPerito();
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
    vm.getBase64 = getBase64;
    vm.deleteFile = deleteFile;
    vm.showImage = showImage;
    vm.cargarImagen = cargarImagen;
    vm.sendComment = sendComment;
    vm.goToHistorial = goToHistorial;
    function goToHistorial(item, version) {
      if (item) {
        pericialFactory.general.goToItemVersion('servicioPresupuestado', item, 0, version);
      }
    }

    vm.$onDestroy = function() {
      //clean watch
      vm.imagenesP();
      vm.imagenesT();
      vm.imagenesExt();
      vm.listener();
    };
    vm.fnGuardarPeritajePar = GuardarPeritajePar;
    vm.showImage = showImage;

  } // end
  return angular.module('appPericial')
    .controller('ServicioPeritajeParController', ServicioPeritajeParController)
});
