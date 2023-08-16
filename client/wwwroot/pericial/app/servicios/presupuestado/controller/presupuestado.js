'use strict';

define(['angular', 'constants', 'constantsPericial', 'helper', 'mocksPericial', 'pericialFactory'], function(
  angular, constants,
  constantsPericial, helper, mocksPericial) {

  ServicioPresupuestadoController.$inject = [
    '$scope', '$sce', '$window', '$state', '$timeout', 'mainServices', '$uibModal', 'mModalAlert', 'mModalConfirm', '$stateParams', 'pericialFactory', 'oimClaims', '$http', 'mpSpin', '$interval'
  ];

  function ServicioPresupuestadoController(
    $scope, $sce, $window, $state, $timeout, mainServices, $uibModal, mModalAlert, mModalConfirm, $stateParams, pericialFactory, oimClaims, $http, mpSpin, $interval
  ) {
    var vm = this;
    vm.siniestro = {};
    vm.filesP = [];
    vm.filesT = [];
    vm.docFilesT = [];
    vm.filesID = [];
    vm.filesBKP = [];
    vm.origen = ["Taller"];

    vm.$onInit = function() {
      vm.dataUser = JSON.parse(localStorage.getItem('evoProfile'));
      
      vm.firstVersion = (parseInt($stateParams.version) === 1);

      //menu
      vm.presupuestadoFlag = true;
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

      saveTracker(isPerito());

      pericialFactory.siniester.GetSinister($stateParams.id, false).then(function(response) {
        if (response.data) {
          vm.siniestro = response.data;
          vm.tag = vm.siniestro.sinisterState;
          
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
            vm.docFilesT = vm.siniestro.proficientBudgets.attachFiles;
            vm.isProficientBudgetsFile = true;
            vm.showPresupuestoPAR = true;
          } else {
            vm.isProficientBudgetsFile = false;
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

      vm.tabPresupuesto = '/pericial/app/servicios/templates/presupuesto.html';
      vm.tabComentarios = '/pericial/app/servicios/templates/comentarios.html';

      vm.presupuestadoFlag = true;
      vm.presupAmpFlag = false;
      vm.porEntregarFlag = false;

      vm.showPhotoFile = false;
      vm.showPresupuestoFile = false;
      vm.peritadoFlag = false;

      vm.disabledDatosRepar = true;
      vm.showStock = true;

      vm.isDisabledNivelDanho = true;
      vm.isDisabledTipoPerito = true;

      vm.siniestro.mDatosReparacion = 'N';

      vm.fnShowStock = function(){
        if (vm.presupuestadoFlag ) return;
        if (vm.siniestro.mDatosReparacion !== 'value') {
          (vm.siniestro.mDatosReparacion === 'S') ? vm.showStock = true : vm.showStock = false;
        }
      };

      vm.tab = parseInt($stateParams.tab);

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
        }
      })
        .catch(function(err){
          mModalAlert.showError(err.data.message, 'Error');
        });

      vm.imagenesP =  $scope.$watch(function() { return vm.photoFileP}, function(newVal, oldVal) {
        if (vm.photoFileP !== undefined) {
          angular.forEach(vm.photoFileP, function(value,key) {
            cargarImagen(value, 'proficient/photo');
          });
          vm.photoFileP = undefined;
          // Reset the form model.
          // document.getElementById("presupuestoForm").reset();
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

      vm.archivos =  $scope.$watch(function() { return vm.docFile}, function(newVal, oldVal) {
        if (vm.docFile !== undefined) {
          angular.forEach(vm.docFile, function(value,key) {
            cargarDoc(value, value.name);
          });
          // Reset the form model.
          // document.getElementById("presupuestoForm").reset();
        }
      });

    };

    function saveTracker(isPerito){
      vm.paramTracker = {
        idSinisterDetail: null,
        CodigoPerfil: vm.rol,
        DescripcionOperacion : isPerito ?  'INGRESO A PERITAR' :'INGRESO A DETALLE',
        OpcionMenu : isPerito ? 'GPER > Principal > Peritar': 'GPER > Principal > Ver Detalle'
      };

      pericialFactory.siniester.SaveTracker(vm.paramTracker).then(function(response) {
        
      })
        .catch(function(err){
          console.log(err);
            mModalAlert.showError("Error en SaveTracker", 'Error');
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

    function downloadFile(idFile) {
      vm.attachFileIngresadoURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gper + 'api/attachfile/file/' + idFile);
      $timeout(function() {
        document.getElementById('frmAttachFileIngresado').submit();
      }, 500);
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

    function goToHistorial(item, version) {
      if (item) {
        pericialFactory.general.goToItemVersion('servicioPresupuestado', item, 0, version);
      }
    }

    vm.fnAsignarmeServicio = AsignarmeServicio;

    function AsignarmeServicio() {
      mModalConfirm.confirmInfo('¿Está seguro que desea peritar el siguiente siniestro?', 'Asignarme servicio', 'Peritar').then(function (response) {
        console.log('Asignar servicio...');
        vm.params = { idSinisterDetail: parseInt( $stateParams.id),
          tracker: {
            CodigoPerfil: vm.rol
          }};
        pericialFactory.proficient.Resource_Sinister_Proficient_Assign(vm.params).then(function(response) {
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
            },
            tracker: {
              CodigoPerfil: vm.rol
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

      if (!vm.params)  {
        if (vm.filesP.length > 0) {
          
          mModalConfirm.confirmInfo('¿Está seguro que desea terminar esta asignación?', 'Terminar peritaje', 'Terminar').then(function (response) {
            vm.paramsTerminarPeritaje = { 
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
            pericialFactory.proficient.Resource_Sinister_Proficient_Save_Finish(vm.paramsTerminarPeritaje).then(function(response) {
              if (response.operationCode === 200) {
                if (response.data) {
                  var extraMsg = !response.message ? '' : '<br> <b>' + response.message + '</b>'
                  terminarPeritajeExito(extraMsg);
                }
              }
            })
              .catch(function(err){
                mModalAlert.showError(err.data.message, 'Error');
              });
          });
        } else {
          mModalAlert.showInfo('Debe subir al menos un archivo', 'Error');
        }

      } else {
        mModalConfirm.confirmInfo('¿Está seguro que desea registrar como pérdida esta asignación?', 'Terminar peritaje', 'Terminar').then(function (response) {
          vm.paramsTerminarPeritaje = {
            idSinisterDetail: parseInt($stateParams.id),
            totalLoss: vm.params.totalLoss
          };
          pericialFactory.proficient.Resource_Sinister_Proficient_Save_TotalLoss(vm.paramsTerminarPeritaje).then(function (response) {
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
            vm.closeModal = function () {
              $uibModalInstance.close();
            };
          }]
      });
      vModalProof.result.then(function () {
      }, function () {
      });
    };

    vm.fnMasInfoOk = MasInfoOk;

    function MasInfoOk() {

      vm.params = {
        idSinisterDetail: parseInt($stateParams.id),
        proficient: {
          requestInformation: []
        }
      };

      if (vm.mSolicitarMasFotos) {
        vm.params.proficient.requestInformation.push(3);
        vm.solicitud = true;
      }

      if (vm.mAmpliarCotizacion){
        vm.params.proficient.requestInformation.push(4);
        vm.solicitud = true;
      }

      if (vm.solicitud) {
        pericialFactory.proficient.Resource_Sinister_Proficient_RequestInformation(vm.params).then(function(response) {
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

    function showAjustarPresupuesto() {
      vm.showPresupuestoPAR = isPerito();
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
      }  if(type === 2) {
        vm.filesP = vm.filesBkp;
      }else {
        vm.docFilesT = vm.filesBkp;
      }
    }

    vm.$onDestroy = function() {
      //clean watch
      vm.imagenesP();
      vm.listener();
      vm.archivos();
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

    vm.downloadProcuracion = downloadProcuracion;
    vm.downloadInspection = downloadInspection;
    vm.sendComment = sendComment;
    vm.showImage = showImage;
    vm.getBase64 = getBase64;
    vm.downloadFile = downloadFile;
    vm.isTaller = isTaller;
    vm.isPerito = isPerito;
    vm.isSupervisor = isSupervisor;
    vm.goToHistorial = goToHistorial;
    vm.showAjustarPresupuesto = showAjustarPresupuesto;
    vm.deleteFile = deleteFile;

  } // end
  return angular.module('appPericial')
    .controller('ServicioPresupuestadoController', ServicioPresupuestadoController);
});

