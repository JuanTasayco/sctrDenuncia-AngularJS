'use strict';

define(['angular', 'constants', 'constantsPericial', 'mocksPericial', 'helper', 'pericialFactory'], function(
  angular, constants,
  constantsPericial, mocksPericial, helper) {

  ServicioPorEntregarController.$inject = [
    '$scope', '$http', '$sce' ,'$window', '$state', '$timeout', 'mainServices', '$uibModal', 'mModalAlert', 'mModalConfirm', '$stateParams', 'pericialFactory', 'mpSpin', 'oimClaims', '$interval'
  ];

  function ServicioPorEntregarController(
    $scope, $http, $sce, $window, $state, $timeout, mainServices, $uibModal, mModalAlert, mModalConfirm, $stateParams, pericialFactory, mpSpin, oimClaims, $interval
  ) {
    var vm = this;
    vm.siniestro = {};
    vm.filesT = [];
    vm.filesP = [];
    vm.docFilesT = [];
    vm.filesID = [];
    vm.filesBKP = [];
    vm.origen = ["Taller", "Perito"];
    vm.repair = {};

    vm.$onInit = function() {
      vm.firstVersion = (parseInt($stateParams.version) === 1);
      vm.isDisabledNivelDanho = true;
      vm.isDisabledTipoPerito = true;

      vm.dataSiniestro = {};
      vm.dataAuto = {};
      vm.isConformidadLetterDeleted = true;
      vm.isDesestimientoLetterDeleted = true;

      vm.today = new Date();

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

          vm.isEntregado = vm.siniestro.detail.idSinisterState === 7;

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

          vm.entregadoFlag = (vm.dataSiniestro.idSinisterState === 7);

          //menu
          if (vm.entregadoFlag ) {
            vm.entregadoFlag = true;
            vm.etiquetaVal = 'Entregado';
          } else {
            vm.porEntregarFlag = true;
            vm.etiquetaVal = 'Por entregar';
          }


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
          //presupuesto inicial y ajustado
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

          if (vm.siniestro.workshopPhotoVehicle.length > 0) {
            vm.filesBKP = vm.siniestro.workshopPhotoVehicle;

            angular.forEach(vm.filesBKP, function(value,key) {
              getBase64(value.idAttachFile, value.fileName, 1);
            });
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

          //presupuesto
          if (vm.siniestro.conformityLetter.length > 0) {
            vm.isConformidadLetterDeleted = false;
            vm.isUploadConformidadLetter = true;
            vm.mConformidadLetter = vm.siniestro.conformityLetter[0];

            if (vm.mConformidadLetter.length > 0) {
              switch (vm.mConformidadLetter.fileExtension) {
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

          //withdrawalLetter

          if (vm.siniestro.withdrawalLetter.length > 0) {
            vm.isDesestimientoLetterDeleted = false;
            vm.isUploadDesestimientoLetter = true;
            vm.mDesestimientoFile = vm.siniestro.withdrawalLetter[0];

            if (vm.mDesestimientoFile.length > 0) {
              switch (vm.mDesestimientoFile.fileExtension) {
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

          //tab reparacion
          if (vm.siniestro.repair) {
            vm.repair.mDiasLlegadaRep = vm.siniestro.repair.arrivalDayOfSpareParts;
            vm.repair.mFechaDesde = new Date(vm.siniestro.repair.dateFinishRepair);
            vm.repair.mDiasRepa = vm.siniestro.repair.estimatedRepairDays;
            vm.repair.mDatosReparacion = vm.siniestro.repair.flagSpare;
            vm.repair.mDispStock = vm.siniestro.repair.flagStock;
            vm.disabledDatosRepar = true;
          }
          //tab reparacion

          //tab entrega
          if (vm.siniestro.delivery) {
            vm.mRepPend = vm.siniestro.delivery.flagSparePending;
            vm.mDetalleRepPend = vm.siniestro.delivery.detailSparePending;
            vm.mFechaEntrega = new Date(vm.siniestro.delivery.approximateDeliveryDate);
            // vm.mDatosReparacion = vm.siniestro.repair.flagSpare;
            // vm.mDispStock = vm.siniestro.repair.flagStock;
            // vm.disabledDatosRepar = true;
          }
          //tab entrega

          //comentarios
          getComentarios();
          $interval(function() {getComentarios()}, 60000)
          //comentarios
        }
      })
        .catch(function(err){
          mModalAlert.showError(err.data.message, 'Error');
        });

      console.log($stateParams.tab);

      vm.tab = ($stateParams.tab === 0) ? 3 : $stateParams.tab;
      vm.tab = parseInt(vm.tab);

      vm.tabPresupuesto = '/pericial/app/servicios/templates/presupuesto.html';
      vm.tabReparaciones = '/pericial/app/servicios/templates/reparaciones.html';
      vm.tabEntrega = '/pericial/app/servicios/templates/entrega.html';
      vm.tabComentarios = '/pericial/app/servicios/templates/comentarios.html';

      vm.presupAmpFlag = false;
      vm.porEntregarFlag = true;
      vm.entregaPorRechazoFlag = false;

      vm.showPhotoFile = false;
      vm.showPresupuestoFile = false;

      vm.disabledDatosRepar = true;
      vm.showStock = true;
      vm.siniestro.mDatosReparacion = 'N';

      vm.fnShowStock = function(){
        if (vm.porEntregarFlag) return;
        if (vm.siniestro.mDatosReparacion !== 'value') {
          (vm.siniestro.mDatosReparacion === 'S') ? vm.showStock = true : vm.showStock = false;
        }
      };

      pericialFactory.damage.GetListDamage(false).then(function(response) {
        if (response.data.length > 0) {
          vm.nivelDanhoData = response.data;
        }

        pericialFactory.budget.GetListProficientType(false).then(function(response) {
          if (response.data.length > 0) {
            vm.peritoData = response.data;
          }
        })
          .catch(function(err){
            mModalAlert.showError(err.data.message, 'Error');
          });
      })
        .catch(function(err){
          mModalAlert.showError(err.data.message, 'Error');
        });

      vm.archivosConformity =  $scope.$watch(function() { return vm.conformidadLetter}, function(newVal, oldVal) {
        if (vm.conformidadLetter !== undefined) {
          cargarDoc(vm.conformidadLetter, 'workshop/letter/conformity', 2);
          // Reset the form model.
          // document.getElementById("presupuestoForm").reset();
        }
      });

      vm.archivosDesestimiento =  $scope.$watch(function() { return vm.desestimientoLetter}, function(newVal, oldVal) {
        if (vm.desestimientoLetter !== undefined) {
          cargarDoc(vm.desestimientoLetter, 'workshop/letter/conformity', 2);
        }
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

    function GuardarEntrega(){

      if (vm.idTypeInsured === 1) { //asegurado
        if (!vm.isUploadConformidadLetter) {
          mModalAlert.showError('Debe cargar carta de conformidad', 'Error');
          vm.entregaOk = false;
        } else {
          vm.entregaOk = true;
        }
      }

      if (vm.idTypeInsured === 2) { //tercero withdrawalLetter
        if (!vm.isUploadDesestimientoLetter) {
          mModalAlert.showError('Debe cargar carta de desestimiento', 'Error');
          vm.entregaOk = false;
        } else {
          vm.entregaOk = true;
        }
      }

      if (vm.mRepPend) {

        if (vm.mRepPend === 'S') {
          (vm.mDetalleRepPend && vm.mFechaEntrega && (vm.mConformidadLetter.fileName || vm.mDesestimientoFile)) ? vm.entregaOk = true : vm.entregaOk = false;
        } else {
          (vm.mConformidadLetter || vm.mDesestimientoFile) ? vm.entregaOk = true : vm.entregaOk = false;
          if (!vm.entregaOk) {
            mModalAlert.showError('Debe cargar carta de conformidad o de desestimiento según el caso', 'Error');
          }
        }
      }

      if(vm.entregaOk){
        vm.params = {
          idSinisterDetail: $stateParams.id,
          delivery: {
            flagSparePending: vm.mRepPend,
            detailSparePending: (vm.mDetalleRepPend) ? vm.mDetalleRepPend : '',
            approximateDeliveryDate: (vm.mFechaEntrega) ? vm.mFechaEntrega : ''
          }
        };

        mModalConfirm.confirmInfo('¿Está seguro que desea registrar los siguientes datos de entrega?', 'Datos de entrega', 'Registrar').then(function() {
          console.log('Registrar entrega...');
          pericialFactory.workshop.Resource_Sinister_Workshop_SaveDelivered(vm.params).then(function(response) {
            if (response.operationCode === 200) {
              if (response.data) {
                Registrado();
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

    function updateEntrega(){

      if (vm.mRepPend) {
        vm.params = {
          idSinisterDetail: $stateParams.id,
          delivery: {
            flagSparePending: vm.mRepPend,
            detailSparePending: (vm.mDetalleRepPend) ? vm.mDetalleRepPend : '',
            approximateDeliveryDate: (vm.mFechaEntrega) ? vm.mFechaEntrega : ''
          }
        };

        pericialFactory.workshop.Resource_Sinister_Workshop_SaveDeliveredUpdate(vm.params).then(function(response) {
          if (response.operationCode === 200) {
            if (response.data) {
              vm.attachFileIngresadoURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gper + 'api/letter/download/Pendingitem/'+ $stateParams.id + '/PDF' );
              $timeout(function() {
                document.getElementById('frmAttachFileIngresado').submit();
              }, 500);
            }
          }
        })
          .catch(function(err){
            console.log(err);
            mModalAlert.showError(err.data.message, 'Error');
          });
      }

    }

    function Registrado() {
      var response = true;
      if (response) {
        mModalAlert.showSuccess('Datos de entrega registrado exitosamente.', '').then(function() {
          console.log('Registrado exitosamente...');
          $state.go('bandejaServicios', {reload: true, inherit: false});
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
              if (value) {
                vm.comentariosList[key].showHT = pericialFactory.general.getShowHT(value);
              }
            });
          }
        }
      })
        .catch(function(err){
          console.log(err);
          // mModalAlert.showError("Error en GetListMovement", 'Error');
        });
    }

    function getBase64(idImage,fileName, preLoad, array) {
      if (array) {
        pericialFactory.attach.GetImage(idImage, 0).then(function(response) {
          if (response) {
            vm.dataImagen = {
              idAttachFile: idImage,
              src: response,
              fileName: (preLoad === 1) ? [{name: fileName}] : vm.photoFileP
            };
            array.push(vm.dataImagen);
          }
        })
          .catch(function(err){
            //  mModalAlert.showError("Error en GetImage", 'Error');
          });
      }
    }

    function cargarDoc(doc, url, type) {

      //type 2 = carta de conformidad

      if(doc){

        var fd = new FormData();
        fd.append("idSinisterDetail", JSON.stringify(parseInt($stateParams.id)));
        fd.append("fieldNameHere", doc[0]);
        mpSpin.start();
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
                case 1:
                  vm.mConformidadLetter = {
                    idAttachFile: response.data[0],
                    fileName: vm.conformidadLetter[0].name//(preLoad === 1) ? [{name: fileName}] : vm.photoFile
                  };
                  break;
                case 2:

                  if (vm.siniestro.idTypeInsured === 1) {
                    vm.isConformidadLetterDeleted = false;
                    vm.isUploadConformidadLetter = true;

                    vm.mConformidadLetter = {
                      idAttachFile: response.data[0],
                      fileName: vm.conformidadLetter[0].name//(preLoad === 1) ? [{name: fileName}] : vm.photoFile
                    };
                  } else {
                    vm.isDesestimientoLetterDeleted = false;
                    vm.isUploadDesestimientoLetter = true;

                    vm.mDesestimientoFile = {
                      idAttachFile: response.data[0],
                      fileName: vm.desestimientoLetter[0].name//(preLoad === 1) ? [{name: fileName}] : vm.photoFile
                    };
                  }
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

    function downloadFile(idFile) {

      switch (idFile) {
        case 1: //Carta de repuestos
          updateEntrega();
          break;
        case 2: //Carta de conformidad
          vm.attachFileIngresadoURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gper + 'api/letter/download/compliance/' + $stateParams.id  + '/PDF');
          $timeout(function() {
            document.getElementById('frmAttachFileIngresado').submit();
            vm.conformidadLetterDownloaded = true;
          }, 500);
          break;
        case 3: //Carta de garantía
          vm.attachFileIngresadoURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gper + 'api/letter/download/guarantee/'+ $stateParams.id + '/PDF' );

          $timeout(function() {
            document.getElementById('frmAttachFileIngresado').submit();
          }, 500);
          break;
        case 4: //Carta de desistimiento
          vm.attachFileIngresadoURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gper + 'api/letter/download/withdrawal/'+ $stateParams.id + '/PDF' );

          $timeout(function() {
            document.getElementById('frmAttachFileIngresado').submit();
            vm.desestimientoLeLetterDownloaded = true;
          }, 500);
          break;
        default:
          vm.attachFileIngresadoURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gper + 'api/attachfile/file/'+ idFile  );
          $timeout(function() {
            document.getElementById('frmAttachFileIngresado').submit();
          }, 500);
          break;
      }
    }

    function deleteFile(idAttachFile, type) {
      //type 2 == conformidad
      pericialFactory.attach.deleteFile(idAttachFile, $stateParams.id).then(function(response) {
        if (response.operationCode === 200) {
          switch (type) {
            case 1:
              break;
            case 2:
              vm.isConformidadLetterDeleted = true;
              vm.isUploadConformidadLetter = false;
              break;
            case 3:
              vm.isDesestimientoLetterDeleted = false;
              vm.isUploadDesestimientoLetter = true;
              break;
            default:
              break;
          }
        } else {
          mModalAlert.showError("Error en deleteFile", 'Error');
        }
      })
        .catch(function(err){
          mModalAlert.showError(err.data.message, 'Error');
        });
    }

    function isTaller() {
      return (vm.rol === 'TALLER');
    }

    function isPerito() {
      return (vm.rol === 'PERITO');
    }

    vm.$onDestroy = function() {
      //clean watch
      vm.archivosConformity();
      vm.archivosDesestimiento();
      vm.listener();
    };

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
    vm.sendComment = sendComment;
    vm.showImage = showImage;
    vm.getBase64 = getBase64;
    vm.fnGuardarEntrega = GuardarEntrega;
    vm.cargarDoc = cargarDoc;
    vm.downloadFile = downloadFile;
    vm.deleteFile = deleteFile;
    vm.isTaller = isTaller;
    vm.isPerito = isPerito;

    vm.goToHistorial = goToHistorial;
    function goToHistorial(item, version) {
      if (item) {
        pericialFactory.general.goToItemVersion('servicioPresupuestado', item, 0, version);
      }
    }

  } // end
  return angular.module('appPericial')
    .controller('ServicioPorEntregarController', ServicioPorEntregarController)
});

