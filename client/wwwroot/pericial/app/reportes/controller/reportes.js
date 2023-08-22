'use strict';

define(['angular', 'constants', 'constantsPericial', 'helper', 'pericialFactory'], function(
  angular,
  constants, constantsPericial, helper) {

  ReportesController.$inject = [
    '$scope', '$window', '$state', '$timeout', 'mainServices', '$uibModal', 'mModalAlert', 'mModalConfirm', 'oimClaims', 'pericialFactory', 'proxyTron', '$sce'
  ];

  function ReportesController(
    $scope, $window, $state, $timeout, mainServices, $uibModal, mModalAlert, mModalConfirm, oimClaims, pericialFactory, proxyTron, $sce
  ) {

      var vm = this;

      vm.isTaller = isTaller;
      vm.isPerito = isPerito;
      vm.isSupervisor = isSupervisor;

      // console.log(vm);
      vm.$onInit = function() {

        oimClaims.rolesCode.some(function(obj, i) {
          return obj.nombreAplicacion === "GPER" ? vm.indexArray = i : false;
        });

        if (vm.indexArray !== -1) {
          vm.rol = oimClaims.rolesCode[vm.indexArray].codigoRol;

          switch (vm.rol) {
            case 'TALLER':
              resource_Security_GetWorkshop();
              vm.tallerBtns = true;
              break;
            case 'PERITO':
              resource_Security_GetProficient();
              vm.peritoBtns = true;
              break;
            case 'SUPERVISOR':
              vm.supervisorBtns = true;
              break;
            default:
          }
        }

        vm.listArray = [];

        vm.status = {
          isopen1: false,
          isopen2: false
        };

        vm.userName = oimClaims.userName;
        vm.showButtonNewSiniester = (vm.rol === 'TALLER');

        vm.format = 'dd/MM/yyyy';
        vm.mConsultaDesde = new Date(new Date().setHours(23, 59, 59, 999));
        vm.mConsultaHasta = new Date(new Date().setHours(23, 59, 59, 999));

        pericialFactory.siniester.Resource_AttachFile_Get_List_State(false).then(function(response) {
          if (response.data.length > 0) {
            vm.estadoReparacionData = response.data;

            pericialFactory.general.Resource_State_Executive_Get_List().then(function(response) {
              if (response.data.data.length > 0) {
                vm.estadoSiniestroData = response.data;
              }
            }).catch(function(err){
                mModalAlert.showError(err.data.message, 'Error');
              });

            pericialFactory.general.Resource_Tron_Proficien_List().then(function(response) {
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

        vm.menuPericial = [
          {label: 'Supervisor', objMXKey: '', state: 'dashboardSupervisor', isSubMenu: false, actived: false, show: isSupervisor()},
          {label: 'General', objMXKey: '', state: 'dashboard', isSubMenu: false, actived: false, show: !isSupervisor()},
          {label: 'Servicios', objMXKey: '', state: 'bandejaServicios', isSubMenu: false, actived: false, show: true},
          {label: 'Reportes', objMXKey: '', state: 'reportes', isSubMenu: false, actived: false, show: true}
        ];
        if (vm.menuPericial.length < 7) {
          vm.showMoreFlag = false;
          vm.limiteMenus = 6;
        } else {
          vm.showMoreFlag = true;
          vm.limiteMenus = 5;
        }
        vm.showBtnBox = isTaller();
      };

      vm.checkAll = checkAll;
      vm.dropdownText = "MARCAR TODOS";

      function checkAll (value) {
        var xval = value;
        vm.dropdownText = xval ? "DESMARCAR TODOS" : "MARCAR TODOS";
        angular.forEach(vm.mEstado, function (val, key) {
          vm.mEstado[key] = xval;

          if (xval) {
            vm.listArray[key] = parseInt(key)+1;
          }

          // Para estado ANULADO
          if (vm.listArray[key] === 8) {
            vm.listArray[key] = 9;
          }

        });

        if(!xval) {
          vm.listArray = [];
        } else {
          // vm.listArray = ["1,2,3,4,5,6,7,8"];
        }
      }

      vm.updateListArray = function (index, value, idItem) {
      if(value) {
        //if (index !== 0) {
        vm.listArray.push(idItem);
        // }
      } else {
        // if (index !== 0) {
        vm.indexArray = vm.listArray.indexOf(idItem);

        if (vm.indexArray !== -1) {
          vm.listArray.splice(vm.indexArray, 1);
        }
        // }
      }
    };

      function isTaller() {
        return (vm.rol === 'TALLER');
      }

      function isPerito() {
        return (vm.rol === 'PERITO');
      }

      function isSupervisor() {
        return (vm.rol === 'SUPERVISOR');
      }

      function searchTaller(wilcar) {
      if (wilcar && wilcar.length>=3) {
        //cargamos los talleres
        var paramTaller = {
          thirdNameToUp : wilcar.toUpperCase()
        };
        return proxyTron.Resource_Tron_Workshop_List(paramTaller);
      }
    }
      vm.searchTaller = searchTaller;

      function getFunctionsTaller(taller) {
        vm.taller = taller;
      }
      vm.getFunctionsTaller = getFunctionsTaller;

      vm.popup1 = {
        opened: false
      };

      vm.popup2 = {
        opened: false
      };

      vm.dateOptions = {
        initDate: new Date(),
        maxDate: new Date()
      };

      vm.dateOptions2 = {
        initDate: vm.mConsultaDesde,//new Date(),//mConsultaDesde,
        minDate: new Date(),
        maxDate: new Date()
      };

      function open1() {
        vm.popup1.opened = true;
      }

      function open2() {
        vm.popup2.opened = true;
      }

      var listener = $scope.$watch(function() { return vm.mConsultaDesde}, function(newVal, oldVal)
      {
        vm.dateOptions2.minDate = vm.mConsultaDesde;
      });

      function downloadReport(value) { //pdf excel word
        if(vm.mConsultaDesde > new Date(new Date().setHours(23,59,59,999)) ||
          vm.mConsultaHasta > new Date(new Date().setHours(23,59,59,999)) ){
          mModalAlert.showError("Fecha no puede ser mayor a la fecha actual", "Error");
        }else {
          vm.paramsFile = {
            plateNumber: (vm.mPlaca) ? vm.mPlaca.toUpperCase() : '',
            caseNumber: (vm.mSiniester) ? vm.mSiniester : '',
            stateSinister:  (vm.listArray) ? ((vm.listArray.length>0) ? vm.listArray.toString() :  '') : '',
            dateStart: (vm.mConsultaDesde) ? pericialFactory.general.formatearFecha(vm.mConsultaDesde) : null,
            dateEnd: (vm.mConsultaHasta) ? pericialFactory.general.formatearFecha(vm.mConsultaHasta) : null,
            idOrderBy: (vm.mOrdenarPor) ? ((vm.mOrdenarPor.idParameterDetail) ? vm.mOrdenarPor.idParameterDetail : 8) : 8,
            stateExecutive:(vm.mEstadoSiniestro && vm.mEstadoSiniestro.id) ? vm.mEstadoSiniestro.id : '',
            idWorkshop: (vm.mTaller) ? vm.mTaller.idThird : 0,
            idProficient: (vm.mPerito && vm.mPerito.idThird) ? vm.mPerito.idThird : 0,
            fileType: (value === 1) ? 'PDF' : ((value === 2) ? 'EXCEL' : 'WORD'),
            roleCode: vm.rol
          };

          if (vm.rol === 'TALLER') {
            vm.paramsFile.idWorkshop = vm.idWorkshop;
            vm.paramsFile.idProficient = 0;
          } else if (vm.rol === 'PERITO') {
            vm.paramsFile.idWorkshop = 0;
            vm.paramsFile.idProficient = vm.idProficient;
          } else {
            vm.paramsFile.idWorkshop = 0;
            vm.paramsFile.idProficient = 0;
          }

          if (vm.mEstadoSiniestro && vm.mEstadoSiniestro.id === 0) {
            vm.paramsFile.stateExecutive = 0;
          }

          saveTracker();

          vm.attachFileReportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gper + 'api/report/download/sinister');
          $timeout(function() {
            document.getElementById('frmAttachFileReport').submit();
          }, 500);

        }
      }

      function saveTracker(){
        vm.paramTracker = {
          idSinisterDetail: null,
          CodigoPerfil: vm.rol,
          DescripcionOperacion : 'GENERAR REPORTE',
          OpcionMenu : 'GPER > Reportes > Generar',
          RequestService : vm.paramsFile
        };
  
        pericialFactory.siniester.SaveTracker(vm.paramTracker).then(function(response) {
          
        })
          .catch(function(err){
            console.log(err);
              mModalAlert.showError("Error en SaveTracker", 'Error');
          });
      }

      function resource_Security_GetProficient() {
        pericialFactory.proficient.getTipoPerito().then(function(response) {
          if (response.operationCode === 200) {
            if (response.data) {
              vm.idProficient = response.data.code;
            }
          }
        }).catch(function(err){
          console.log(err);
          mModalAlert.showError(err.data.message, 'Error');
        });
      }

      function resource_Security_GetWorkshop() {
        pericialFactory.workshop.Resource_Security_GetWorkshop().then(function(response) {
          if (response.operationCode === 200) {
            if (response.data) {
              vm.idWorkshop = response.data.code;
            }
          }
        }).catch(function(err){
          console.log(err);
          mModalAlert.showError(err.data.message, 'Error');
        });
      }

      vm.open1 = open1;
      vm.open2 = open2;
      vm.downloadReport = downloadReport;

      vm.$onDestroy = function() {
        //clean watch
        listener();
      };

    } // end

    return angular.module('appPericial')
      .controller('ReportesController', ReportesController)
  });
