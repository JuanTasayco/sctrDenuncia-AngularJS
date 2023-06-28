'use strict';

define(['angular', 'constants', 'constantsPericial', 'mocksPericial', 'helper', 'pericialFactory'], function(
  angular, constants,
  constantsPericial, mocksPericial, helper) {

  ServicioPresupuestadoZoneController.$inject = [
    '$scope', '$sce', '$http', '$window', '$state', '$timeout', 'mainServices', '$uibModal', 'mModalAlert', 'mModalConfirm', '$stateParams', 'pericialFactory', 'oimClaims', 'mpSpin', '$interval'
  ];

  function ServicioPresupuestadoZoneController(
    $scope, $sce, $http, $window, $state, $timeout, mainServices, $uibModal, mModalAlert, mModalConfirm, $stateParams, pericialFactory, oimClaims, mpSpin, $interval
  ) {
    var vm = this;
    vm.siniestro = {};
    vm.filesP = [];
    vm.filesT = [];
    vm.docFilesT = [];
    vm.filesBKP = [];
    vm.filesPBKP = [];

    vm.$onInit = function() {
      vm.dataUser = JSON.parse(localStorage.getItem('evoProfile'));
      
      vm.firstVersion = (parseInt($stateParams.version) === 1);
      //menu
      vm.presupuestadoZoneFlag = true;
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

      vm.isDocInventoryDeleted = true;

      vm.dataSiniestro = {};
      vm.dataAuto = {};

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

          //presupuesto
          vm.siniestro.mBudgetDate = vm.siniestro.workshopBudgets.budgetDate;
          vm.siniestro.mBudgetName = vm.siniestro.workshopBudgets.name;

          if (vm.siniestro.workshopBudgets.attachFiles.length > 0) {
            vm.workshopBudgetsFile = vm.siniestro.workshopBudgets.attachFiles;
          }

          //presupuesto ajustado proficientBudgets
          vm.siniestro.mBudgetProficientDate = vm.siniestro.proficientBudgets.budgetDate;
          vm.siniestro.mBudgetProficientName = vm.siniestro.proficientBudgets.name;

          if (vm.siniestro.proficientBudgets.attachFiles.length > 0) {
            vm.proficientBudgetsFile = vm.siniestro.proficientBudgets.attachFiles;
            vm.isProficientBudgetsFile = true;
          } else {
            vm.isProficientBudgetsFile = false;
          }

          //fotos perito
          // if (vm.siniestro.proficientPhotosVehicle.length > 0) {
          //   vm.filesBKP = vm.siniestro.proficientPhotosVehicle;
          //
          //   angular.forEach(vm.filesBKP, function(value,key) {
          //     getBase64(value.idAttachFile, value.fileName, 1, vm.filesP);
          //   });
          // }
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

      vm.exteriorVeh = [
        {title: 'Fotografía frontal'},
        {title: 'Fotografía posterior'},
        {title: 'Fotografía lateral derecho'},
        {title: 'Fotografía lateral izquierdo'},
        {title: 'Fotografía techo'}
      ];

      vm.accesoriosVeh = [
        {title: 'Compartimiento motor'},
        {title: 'Accesorios'},
        {title: 'Interior delantero'},
        {title: 'Interior central y posterior'},
        {title: 'Llantas'},
        {title: 'Llantas de repuesto'}
      ];

      vm.tabPresupuesto = '/pericial/app/servicios/templates/presupuesto3.html';
      // vm.tabReparaciones = '/pericial/app/servicios/templates/reparaciones.html';
      vm.tabComentarios = '/pericial/app/servicios/templates/comentarios.html';

      vm.presupAmpFlag = false;
      vm.porEntregarFlag = false;
      vm.presupuestadoVirtFlag = false;
      vm.presupuestadoZoneFlag = true;
      vm.peritajeParFlag = false;

      vm.showPhotoFile = false;
      vm.showPresupuestoFile = false;

      vm.disabledDatosRepar = true;
      vm.showStock = true;
      vm.siniestro.mDatosReparacion = 'N';
      vm.fnShowStock = function(){
        if (vm.presupuestadoZoneFlag) return;
        if (vm.siniestro.mDatosReparacion !== 'value') {
          (vm.siniestro.mDatosReparacion === 'S') ? vm.showStock = true : vm.showStock = false;
        }
      };

      pericialFactory.damage.GetListDamage(false).then(function(response) {
        if (response.data.length > 0) {
          vm.nivelDanhoData = response.data;

          pericialFactory.budget.GetListProficientType(false).then(function(response) {
            if (response.data.length > 0) {
              vm.peritoData = response.data;
            }
          })
            .catch(function(err){
              mModalAlert.showError(err.data.message, 'Error');
            });

          pericialFactory.budget.GetListType(false).then(function(response) {
            if (response.data.length > 0) {
              vm.tipoPresupuestoData = response.data;
            }
          })
            .catch(function(err){
              mModalAlert.showError(err.data.message, 'Error');
            });
        }
      })
        .catch(function(err){
          mModalAlert.showError(err.data.message, 'Error');
        });

      vm.archivos =  $scope.$watch(function() { return vm.docFile}, function(newVal, oldVal) {
        if (vm.docFile !== undefined) {
          angular.forEach(vm.docFile, function(value,key) {
            cargarDoc(value, value.name);
          });
          // Reset the form model.
          // document.getElementById("frmPresupuesto3").reset();
        }
      });

      vm.imagenesT =  $scope.$watch(function() { return vm.filesT}, function(newVal, oldVal) {
        if (vm.filesT !== undefined && vm.filesT.length>0) {
          cargarImagen(vm.filesT, 'workshop/photo');
          // Reset the form model.
          // document.getElementById("frmPresupuesto3").reset();
        }
      });

      vm.imagenesP =  $scope.$watch(function() { return vm.photoFileP}, function(newVal, oldVal) {
        if (vm.photoFileP !== undefined) {
          angular.forEach(vm.photoFileP, function(value,key) {
            cargarImagen(value, 'proficient/photo');
            // Reset the form model.
            // document.getElementById("frmPresupuesto3").reset();
          });
          vm.photoFileP = undefined;
        }
      });

      vm.listener = $scope.$watch('vm.dataSiniestro', function(nv) {

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

      vm.archivosInventario =  $scope.$watch(function() { return vm.docInventoryFile}, function(newVal, oldVal) {
        if (vm.docInventoryFile !== undefined) {
          cargarInventario(vm.docInventoryFile, 1);
          // Reset the form model.
          // document.getElementById("frmPresupuesto3").reset();
        }
      });
    };

    function cargarInventario(doc, type) {

      //type 2 = carta de conformidad

      if(doc){

        var fd = new FormData();
        fd.append("idSinisterDetail", JSON.stringify(parseInt($stateParams.id)));
        fd.append("fieldNameHere", doc[0]);

        $http.post(constants.system.api.endpoints.gper + 'api/attachfile/proficient/total/loss/inventory', fd, {
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
              mModalAlert.showError(response.data, 'Error');
            }else{
              switch (type) {
                case 1: //auto
                  vm.mDocInventory = {
                    idAttachFile: response.data[0],
                    fileName: vm.docInventoryFile[0].name//(preLoad === 1) ? [{name: fileName}] : vm.photoFile
                  };
                  vm.isDocInventoryDeleted = false;
                  break;
                case 2: //camion
                  vm.isDocInventoryDeleted = false;
                  vm.mDocInventory = {
                    idAttachFile: response.data[0],
                    fileName: vm.docInventoryFile[0].name//(preLoad === 1) ? [{name: fileName}] : vm.photoFile
                  };
                  break;
                default:
                  break;
              }
            }
          })
          .catch(function(err){
            mModalAlert.showError(err.data.message, 'Error');
            mpSpin.end();
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
      } if(type === 2) {
        vm.filesP = vm.filesBkp;
      }else {
        vm.docFilesT = vm.filesBkp;
      }
    }

    function getBase64(idImage,fileName, preLoad, array) {
      if (idImage) {
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
           // mModalAlert.showError("Error en GetImage", 'Error');
          });
      }
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
        fd.append("fieldNameHere", foto);

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

              // vm.filesP.push(vm.photoFileP);
              vm.idImage = response.data[0];

              getBase64(vm.idImage, '', 0, vm.filesP);
            }
          })
          .catch(function(err){
            mModalAlert.showError(err.data.message, 'Error');
          });
      }
    }

    function isTaller() {
      return (vm.rol === 'TALLER');
    }

    function isPerito() {
      return (vm.rol === 'PERITO');
    }

    function isSupervisor() {
      return (vm.rol === 'SUPERVISOR');
    }

    function showAjustarPresupuesto() {
      vm.showPresupuestoVirtual = isPerito();
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

    function cargarDoc(doc, nameDoc) {

      if(doc){

        var fd = new FormData();
        fd.append("idSinisterDetail", JSON.stringify(parseInt($stateParams.id)));
        fd.append("fieldNameHere", doc);
        mpSpin.start();
        $http.post(constants.system.api.endpoints.gper + 'api/attachfile/proficient/budget/adjust', fd, {
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

    function goToHistorial(item, version) {
      if (item) {
        pericialFactory.general.goToItemVersion('servicioPresupuestado', item, 0, version);
      }
    }

    function downloadInventory(tipo) {
      if (tipo) {
        vm.urlInventory = (tipo === 1) ? 'api/letter/download/vehicle_inventory/1/PDF' : 'api/letter/download/truck_inventory/1/PDF';

        vm.attachFileIngresadoURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gper + vm.urlInventory);

        $timeout(function () {
          document.getElementById('frmAttachFileIngresado').submit();
        }, 500);
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

    vm.downloadProcuracion = downloadProcuracion;
    vm.downloadInspection = downloadInspection;
    vm.downloadInventory = downloadInventory;
    vm.isTaller = isTaller;
    vm.isPerito = isPerito;
    vm.isSupervisor = isSupervisor;
    vm.goToHistorial = goToHistorial;
    vm.downloadFile = downloadFile;
    vm.getBase64 = getBase64;
    vm.deleteFile = deleteFile;
    vm.showImage = showImage;
    vm.cargarImagen = cargarImagen;
    vm.showAjustarPresupuesto = showAjustarPresupuesto;
    vm.sendComment = sendComment;
    vm.fnAsignarmeServicio = AsignarmeServicio;

    function AsignarmeServicio() {
      mModalConfirm.confirmInfo('¿Está seguro que desea peritar el siguiente siniestro?', 'Asignarme servicio', 'Peritar').then(function (response) {
        console.log('Asignar servicio...');
        vm.paramsRegistro = { idSinisterDetail: parseInt( $stateParams.id)};
        pericialFactory.proficient.Resource_Sinister_Proficient_Assign(vm.paramsRegistro).then(function(response) {
          if (response.operationCode === 200) {
            if (response.data) {
              asignadoExito();
            }
          }
        })
          .catch(function(err){
            console.log(err);
            mModalAlert.showError(err.data.message, 'Error');
          });
      });
    }

    function asignadoExito() {
      var response = true;
      if (response) {
        mModalAlert.showSuccess('Servicio asignado exitosamente', '').then(function () {
          console.log('Servicio asignado exitosamente...');
        });
      }
    }

    vm.fnReasignarServicio = ReasignarServicio;

    function ReasignarServicio(value) {
      mModalConfirm.confirmInfo('¿Está seguro que desea dejar de peritar este siniestro?', 'Reasignar peritaje', 'Reasignar').then(function (response) {
        vm.paramsRegistro = {
          idSinisterDetail: parseInt( $stateParams.id),
          proficient:
            {
              idProficient: value
            }

        };
        pericialFactory.proficient.Resource_Sinister_Proficient_Reassign(vm.paramsRegistro).then(function(response) {
          if (response.operationCode === 200) {
            if (response.data) {
              reasignarExito();
            }
          }
        })
          .catch(function(err){
            console.log(err);
            mModalAlert.showError(err.data.message, 'Error');
          });
      });
    }

    function reasignarExito() {
      var response = true;
      if (response) {
        mModalAlert.showSuccess('Peritaje se reasignará a otro usuario', '').then(function () {
          // $state.reload();
          $state.go('bandejaServicios', {reload: true, inherit: false});
        });
      }
    }

    vm.fnTerminarPeritaje = TerminarPeritaje;

    function TerminarPeritaje() {

      if (!vm.mRegistrarPerdidaTotal)  {
        if (vm.filesP.length > 0) {
          
          mModalConfirm.confirmInfo('¿Está seguro que desea terminar esta asignación?', 'Terminar peritaje', 'Terminar').then(function (response) {
            vm.paramsRegistro = {
              idSinisterDetail: parseInt($stateParams.id),
              "Notification": {       
                "servicio": 'Taller',
                "expediente_siniestro": !vm.siniestro ? '' : vm.siniestro.fileNumber,
                "numero_servicio": !vm.siniestro ? '' : vm.siniestro.sinisterNumber,
                "tipologia": '',
                "ordenServicio": vm.ordenServicio,
                "dni":  !vm.dataUser ? '' : (vm.dataUser.documentType === 'DNI' ? vm.dataUser.documentNumber : '')
              }
            };
            pericialFactory.proficient.Resource_Sinister_Proficient_Save_Finish(vm.paramsRegistro).then(function (response) {
              if (response.operationCode === 200) {
                if (response.data) {
                  var extraMsg = !response.message ? '' : '<br> <b>' + response.message + '</b>'
                  terminarPeritajeExito(extraMsg);
                }
              }
            })
              .catch(function (err) {
                mModalAlert.showError(err.data.message, 'Error');
              });
          });
        } else {
          mModalAlert.showInfo('Debe subir al menos un archivo', 'Error');
        }
      } else {

        vm.frmPresupuesto3.markAsPristine();
        if (vm.frmPresupuesto3.$valid) {
          mModalConfirm.confirmInfo('¿Está seguro que desea registrar como pérdida esta asignación?', 'Terminar peritaje', 'Terminar').then(function (response) {
            vm.paramsRegistro = {
              idSinisterDetail: parseInt($stateParams.id),
              totalLoss: {
                commercialValue: (vm.mValorComercial) ? parseInt(vm.mValorComercial) : 0,
                valueOfRemains:  (vm.mValorRestos) ? parseInt(vm.mValorRestos) : 0,
                consideration: (vm.mConsideraciones) ? vm.mConsideraciones.toUpperCase() : ''
              }
            };

            pericialFactory.proficient.Resource_Sinister_Proficient_Save_TotalLoss(vm.paramsRegistro).then(function (response) {
              if (response.operationCode === 200) {
                if (response.data) {
                  terminarPeritajeExito('');
                }
              }
            })
              .catch(function (err) {
                mModalAlert.showError(err.data.message, 'Error');
              });
          });
        }
      }
    }

    function terminarPeritajeExito(extraMsg) {
      var response = true;
      if (response) {
        mModalAlert.showSuccess('Peritaje guardado exitosamente. ' + extraMsg, '').then(function () {
          $state.go('bandejaServicios', {reload: true, inherit: false});
        });
      }
    }

    vm.fnModalMasInfo = function () {
      var vModalProof = $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        templateUrl: '/pericial/app/servicios/presupuestadoVirt/component/modalMasInfo.html',
        controller: ['$uibModalInstance',
          function ($uibModalInstance) {
            /*#########################
                                # closeModal
                                #########################*/
            vm.closeModal = function () {
              // $uibModalInstance.dismiss('cancel');
              $uibModalInstance.close();
            };
          }]
      });
      vModalProof.result.then(function () {
        //Action after CloseButton Modal
        // console.log('closeButton');
      }, function () {
        //Action after CancelButton Modal
        // console.log("CancelButton");
      });
    };

    vm.fnMasInfoOk = MasInfoOk;

    function MasInfoOk() {

      vm.paramsRegistro = {
        idSinisterDetail: parseInt($stateParams.id),
        proficient: {
          requestInformation: []
        }
      };

      if (vm.mSolicitarMasFotos) {
        vm.paramsRegistro.proficient.requestInformation.push(3);
        vm.solicitud = true;
      }

      if (vm.mAmpliarCotizacion){
        vm.paramsRegistro.proficient.requestInformation.push(4);
        vm.solicitud = true;
      }

      if (vm.solicitud) {
        pericialFactory.proficient.Resource_Sinister_Proficient_RequestInformation(vm.paramsRegistro).then(function(response) {
          if (response.operationCode === 200) {
            if (response.data) {
              mModalAlert.showSuccess('Se solicitó más información al taller', '').then(function () {
                vm.closeModal();
                $state.go('bandejaServicios', {reload: true, inherit: false});
              })
            }
          }
        })
          .catch(function(err){
            console.log(err);
            mModalAlert.showError(err.data.message, 'Error');
          });
      }

    }

    vm.fnModalAsignarPerito = function () {

      pericialFactory.general.Resource_Tron_Proficien_List().then(function(response) {
        if (response.data.length > 0) {
          $scope.peritoData = response.data;

          var vModalProof = $uibModal.open({
            backdrop: true, // background de fondo
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: 'md',
            templateUrl: '/pericial/app/servicios/common/modal/modalAsignarSiniestro.html',
            controller: ['$uibModalInstance',
              function ($uibModalInstance) {
                /*#########################
                # closeModal
                #########################*/
                vm.closeModal = function () {
                  // $uibModalInstance.dismiss('cancel');
                  $uibModalInstance.close();
                };

                vm.selectPerito = function (value) {
                  if(value && value.idThird){
                    ReasignarServicio(value.idThird);
                  }
                  // $uibModalInstance.dismiss('cancel');
                  $uibModalInstance.close();
                };
              }]
          });
          vModalProof.result.then(function () {
            //Action after CloseButton Modal
            // console.log('closeButton');
          }, function () {
            //Action after CancelButton Modal
            // console.log("CancelButton");
          });
        }
      })
        .catch(function(err){
          mModalAlert.showError(err.data.message, 'Error');
        });
    };

    vm.$onDestroy = function() {
      //clean watch
      vm.archivos();
      vm.archivosInventario();
      vm.imagenesP();
      vm.imagenesT();
      vm.listener();
    };

    vm.showImage = showImage;

  } // end
  return angular.module('appPericial')
    .controller('ServicioPresupuestadoZoneController', ServicioPresupuestadoZoneController)
});
