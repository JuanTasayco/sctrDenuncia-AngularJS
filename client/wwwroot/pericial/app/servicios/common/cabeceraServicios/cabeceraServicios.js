'use strict';

define(['angular', 'constants', 'constantsPericial', 'helper'], function(
  angular,
  constants, constantsPericial, helper) {

  CabeceraServiciosController.$inject = [
    '$scope', '$uibModal', 'mModalAlert', 'mModalConfirm', '$stateParams', 'pericialFactory', '$state'//, 'oimClaims'
  ];

  function CabeceraServiciosController(
    $scope, $uibModal,mModalAlert, mModalConfirm, $stateParams, pericialFactory, $state//, oimClaims
  ) {

    var vm = this;

    function goTo(url, item, tab) {
      if($stateParams.id)
        $state.go(url, {
          id: $stateParams.id,
          version: ($stateParams.version) ? $stateParams.version : 1,
          tab: tab
        }, {reload: true, inherit: false});
    }

    vm.$onInit = function () { //nivelDanhoData

      if ($stateParams.tab) {
        vm.tab = parseInt($stateParams.tab);
      } else {
        vm.tab = 0;
      }

      vm.dataSin = vm.siniestro;
      vm.dataAuto = vm.auto;
      vm.tallerBtns = false;
      vm.peritoBtns = false;
      vm.supervisorBtns = false;

      switch (vm.btnsBar) {
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
      }

      vm.ingresadoFlag = false;
      vm.ingresadoPTFlag = false;
      vm.e = false;
      vm.presupuestadoAmpFlag = false;
      vm.peritadoFlag = false;
      vm.enReparacionFlag = false;
      vm.porEntregarFlag = false;

      vm.presupuestadoVirtFlag = false;
      vm.presupuestadoAsigFlag = false;
      vm.presupuestadoZoneFlag = false;
      vm.peritajeFlag = false;

      vm.perdidaTotalFlag = false;

      switch (vm.etiqueta) {
        case 'ingresado':
          vm.ingresadoFlag = true;
          vm.etiquetaVal = 'Ingresado al Taller';
          break;
        case 'ingresadoPT':
          vm.perdidaTotalFlag = true;
          vm.ingresadoPTFlag = true;
          vm.etiquetaVal = 'Ingresado';
          break;
        case 'presupuestado':
          vm.presupuestadoFlag = true;
          vm.etiquetaVal = 'Presupuestado';
          break;
        case 'presupuestadoAmp':
          vm.presupuestadoFlag = true;
          vm.presupuestadoAmpFlag = true;
          vm.etiquetaVal = 'Presupuestado';
          break;
        case 'peritado':
          vm.peritadoFlag = true;
          vm.etiquetaVal = 'Peritado';
          break;
        case 'enReparacion':
          vm.enReparacionFlag = true;
          vm.etiquetaVal = 'En reparación';
          break;
        case 'porEntregar':
          vm.porEntregarFlag = true;
          vm.etiquetaVal = 'Por entregar';
          break;
        case 'presupuestadoVirtual':
          vm.presupuestadoVirtFlag = true;
          vm.etiquetaVal = 'Presupuestado';
          break;
        case 'presupuestadoAsign':
          vm.presupuestadoAsigFlag = true;
          vm.etiquetaVal = 'Presupuestado';
          break;
        case 'presupuestadoZona':
          vm.presupuestadoZoneFlag = true;
          vm.etiquetaVal = 'Presupuestado';
          break;
        case 'peritajePar':
          vm.peritajeFlag = true;
          vm.etiquetaVal = 'Presupuestado';
          break;
        case 'perdidaTotal':
          vm.perdidaTotalFlag = true;
          vm.etiquetaVal = 'Ingresado';
          break;
        case 'entregado':
          vm.entregadoFlag = true;
          vm.etiquetaVal = 'Entregado';
          break;
        default:
          break;
      }

      vm.turnOnAmarillo = vm.enReparacionFlag;
      vm.turnOnNaranja = vm.presupuestadoFlag || vm.presupuestadoVirtFlag || vm.presupuestadoAsigFlag || vm.presupuestadoZoneFlag || vm.peritajeFlag;
      vm.turnOnVerde = vm.ingresadoFlag || vm.ingresadoPTFlag || vm.peritadoFlag || vm.porEntregarFlag || vm.perdidaTotalFlag;
      vm.turnOnGris = vm.entregadoFlag;

      vm.fnRegistrar = Registrar;

      function Registrar() {
        if (vm.params && vm.params.proficient.idTypeProficient &&
        vm.params.budget.InitialEstimate.EstimatedRepairDays>0) {
          mModalConfirm.confirmInfo('¿Está seguro que desea generar registrar los datos del siniestro?', 'Registar Siniestro', 'Continuar').then(function () {
            pericialFactory.siniester.Resource_Sinister_Workshop_SaveBudget(vm.params).then(function(response) {
              if (response.operationCode === 200) {
                if (response.data) {
                  mModalAlert.showSuccess('Información registrada exitosamente.', '').then(function () {
                    goTo('servicioPresupuestado', 1, 0);
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
      }

      vm.fnModalIniRepa = function () {
        var vModalProof = $uibModal.open({
          backdrop: true, // background de fondo
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          size: 'md',
          templateUrl: '/pericial/app/servicios/peritado/component/modalIniReparacion.html',
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

      vm.fnIniRepa = IniciarReparacion;

      function IniciarReparacion() {
        var response = true;
        if (response) {
          mModalAlert.showSuccess('Reparación iniciada con éxito.', '').then(function () {
            vm.closeModal();
            console.log('Iniciar reparación ... ');
          });
        }
      }

      vm.fnGenerarAmpliacion = GenerarAmpliacion;

      function GenerarAmpliacion() {
        mModalConfirm.confirmInfo('¿Está seguro que desea generar una aplicación del siguiente servicio?', 'Generar ampliación', 'Continuar').then(function () {
          console.log('Generar ampliación...');
          vm.params = { idSinisterDetail: parseInt( $stateParams.id)};
          pericialFactory.proficient.Resource_Sinister_Workshop_GenerateExtension(vm.params).then(function(response) {
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

      vm.fnListoEntregar = ListoEntregar;

      function ListoEntregar() {
        var response = true;
        if (response) {
          mModalConfirm.confirmInfo('¿Está seguro que desea cambiar el estado del servicio?', 'Listo para entregar', 'Continuar').then(function () {
            console.log('Listo para entregar...');
          });
        }
      }

      vm.fnAsignarmeServicio = AsignarmeServicio;

      function AsignarmeServicio() {
        mModalConfirm.confirmInfo('¿Está seguro que desea peritar el siguiente siniestro?', 'Asignarme servicio', 'Peritar').then(function (response) {
          console.log('Asignar servicio...');
          vm.params = { idSinisterDetail: parseInt( $stateParams.id)};
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

      function ReasignarServicio() {
        mModalConfirm.confirmInfo('¿Está seguro que desea dejar de peritar este siniestro?', 'Reasignar peritaje', 'Reasignar').then(function (response) {
          vm.params = { idSinisterDetail: parseInt( $stateParams.id)};
            pericialFactory.proficient.Resource_Sinister_Proficient_Reassign(vm.params).then(function(response) {
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
          mModalConfirm.confirmInfo('¿Está seguro que desea terminar esta asignación?', 'Terminar peritaje', 'Terminar').then(function (response) {
            console.log('Terminar peritaje...');
            vm.paramsTerminarPeritaje = { idSinisterDetail: parseInt($stateParams.id)};
            pericialFactory.proficient.Resource_Sinister_Proficient_Save_Finish(vm.paramsTerminarPeritaje).then(function(response) {
              if (response.operationCode === 200) {
                if (response.data) {
                  terminarPeritajeExito();
                  // mModalAlert.showSuccess('Información registrada exitosamente.', '').then(function () {
                  //   goTo('servicioPresupuestado', 1, 0);
                  // })
                }
              }
            })
              .catch(function(err){
                console.log(err);
                mModalAlert.showError("Error en Resource_Sinister_Proficient_Save_Finish", 'Error');
              });
          });
        } else {
          mModalConfirm.confirmInfo('¿Está seguro que desea registrar como pérdida esta asignación?', 'Terminar peritaje', 'Terminar').then(function (response) {
            console.log('Terminar peritaje...');
            vm.paramsTerminarPeritaje = {
              idSinisterDetail: parseInt($stateParams.id),
              totalLoss: vm.params.totalLoss
            };
            pericialFactory.proficient.Resource_Sinister_Proficient_Save_TotalLoss(vm.paramsTerminarPeritaje).then(function (response) {
              if (response.operationCode === 200) {
                if (response.data) {
                  terminarPeritajeExito();
                  // mModalAlert.showSuccess('Información registrada exitosamente.', '').then(function () {
                  //   goTo('servicioPresupuestado', 1, 0);
                  // })
                }
              }
            })
              .catch(function (err) {
                console.log(err);
                mModalAlert.showError(err.data.message, 'Error');
              });
          });
        }
      }

      function terminarPeritajeExito() {
        var response = true;
        if (response) {
          mModalAlert.showSuccess('Peritaje guardado exitosamente', '').then(function () {
            console.log('Peritaje guardado exitosamente...');
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

      vm.fnRechazarSiniestro = RechazarSiniestro;

      function RechazarSiniestro() {
        if (vm.params) {
          mModalConfirm.confirmInfo('¿Está seguro de rechazar el siguiente siniestro?', 'Rechazar siniestro', 'Rechazar').then(function (response) {
            console.log('Rechazar siniestro...');
            vm.params.flagConfirmTotalLost = "N";
            pericialFactory.supervisor.Resource_Sinister_Supervisor_ValidateTotalLoss(vm.params).then(function(response) {
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
        } else {
          mModalAlert.showError("Ingrese valor de restos y/o valor comercial", 'Error');
        }
      }

      function rechazarSiniestroExito() {
        var response = true;
        if (response) {
          mModalAlert.showSuccess('Siniestro rechazado', '').then(function () {
            console.log('Siniestro rechazado...');
            vm.closeModal();
            $state.go('bandejaServicios', {reload: true, inherit: false});
          });
        }
      }

      vm.fnAprobarSiniestro = AprobarSiniestro;

      function AprobarSiniestro() {
        if (vm.params) {
          mModalConfirm.confirmInfo('¿Está seguro de aprobar el siguiente siniestro?', 'Aprobar pérdida', 'Aprobar').then(function (response) {
            console.log('Aprobar pérdida...');
            vm.params.flagConfirmTotalLost = "S";
            pericialFactory.supervisor.Resource_Sinister_Supervisor_ValidateTotalLoss(vm.params).then(function(response) {
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
        } else {
          mModalAlert.showError("Ingrese valor de restos y/o valor comercial", 'Error');
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

      vm.listener = $scope.$watch('vm.dataSin', function(nv)
      {
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
      });
    };
    vm.$onDestroy = function() {
      //clean watch
      vm.listener();
    };

  } // end

    return angular.module('appPericial')
      .controller('CabeceraServiciosController', CabeceraServiciosController)
        .component('cabeceraServicios', {
				templateUrl: '/pericial/app/servicios/common/cabeceraServicios/cabeceraServicios.html',
				controller: 'CabeceraServiciosController',
				controllerAs: '$ctrl',
				bindings: {
					siniestro: '=',
					auto: '=',
					btnsBar: '@',
					etiqueta: '@',
					ampliacion: '@',
          params: '='
				}
			})
	});
