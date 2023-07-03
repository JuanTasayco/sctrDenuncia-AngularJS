'use strict';

define(['angular', 'constants', 'constantsPericial', 'mocksPericial', 'pericialFactory'], function(
  angular,
  constants, constantsPericial, mocksPericial) {

  BandejaServiciosController.$inject = ['mpSpin',
    '$scope', '$window','$stateParams',
    '$state', '$timeout',
    'mainServices', '$uibModal',
    'mModalAlert', 'mModalConfirm',
    'oimClaims', 'pericialFactory', 'proxyTron', 'localStorageService'
  ];

  function BandejaServiciosController(mpSpin,
    $scope, $window, $stateParams, $state,
    $timeout, mainServices,
    $uibModal, mModalAlert,
    mModalConfirm, oimClaims,
    pericialFactory, proxyTron, localStorageService
  ) {
    var vm = this;
    //methods
    //bandejaCtrl
    vm.open1 = open1;
    vm.open2 = open2;
    vm.fnShowModalIniReparacion = fnShowModalIniReparacion;
    vm.fnShowModalActEstado = fnShowModalActEstado;
    vm.setPointColorBandeja = setPointColorBandeja;
    vm.setColorLabelBandeja = setColorLabelBandeja;
    vm.getLabelBandeja = getLabelBandeja;
    vm.getSiniestros = getSiniestros;
    vm.isTaller = isTaller;
    vm.isPerito = isPerito;
    vm.isSupervisor = isSupervisor;
    vm.goTo = goTo;
    vm.checkAll = checkAll;
    vm.dropdownText = "MARCAR TODOS";
    vm.goToConfirmClient = goToConfirmClient;
    vm.goToAnular = goToAnular;
    vm.fnContinuarAnular = ContinuarAnular;

    function checkConfirmacionCliente(list) {
      // Tiene que estar con los estado AUTORIZADO Y PERITADO
      // Autorizado => idExecutiveState => 6
      // Peritado => idSinisterState => 3
      // idStateConfirmPayFranchise => 1 => Confirmado
      // idStateConfirmPayFranchise => 2 => No Confirmado
      // idStateConfirmPayFranchise => 3 => Espera
      for (var idx = 0; idx < list.length; idx++) {
        list[idx].showConfirmacionCliente = false
        list[idx].showAnular = false
        if (list[idx].idExecutiveState === 6 && list[idx].idSinisterState === 3 && list[idx].idStateConfirmPayFranchise !== 1 ) {
          list[idx].showConfirmacionCliente = true
        }
        if (isTaller() && (list[idx].idSinisterState === 1 || list[idx].idSinisterState === 2 || list[idx].idSinisterState === 3)) {
          list[idx].showAnular = true
        }
      }
    }

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
      }
    }

    vm.updateListArray = function (index, value, idItem) {
      if(value) {
          vm.listArray.push(idItem);
      } else {
        vm.indexArray = vm.listArray.indexOf(idItem);

        if (vm.indexArray !== -1) {
          vm.listArray.splice(vm.indexArray, 1);
        }
      }
    };

    vm.updateConFiltro = function () {
      vm.conFiltro = false;
    };

    vm.status = {
      isopen: false
    };

    vm.cleanFilters = function () {
      vm.paramsList = {
        plateNumber: '',
        caseNumber: '',
        stateSinister: '',
        dateStart: pericialFactory.general.formatearFecha(new Date()),
        dateEnd: pericialFactory.general.formatearFecha(new Date()),
        idOrderBy: 8,
        stateExecutive: '',
        idWorkshop: 0,
        idProficient: 0,
        pageNumber: 1,
        pageSize: vm.pageSize
      };

      vm.totalItems = 0;
      vm.totalPages = 0;
      vm.noResult = true;
      vm.executive = undefined;

      vm.mConsultaDesde = new Date();
      vm.mConsultaDesde.setDate(vm.mConsultaDesde.getDate() - 7);
      vm.mConsultaHasta = new Date();
      localStorageService.set('fechas', undefined);
      updateList();
    };

    vm.pageChanged = function (event) {
      vm.paramsList.PageNumber = event;
      updateList()
    };

    vm.cleanLocal = function () {
      localStorageService.remove('fechas');
    };

    function getProficientCode() {
      pericialFactory.proficient.getTipoPerito().then(function(response) {
        if (response.operationCode === 200) {
          if (response.data) {
            vm.proficientType = response.data.type;
            vm.proficientCode = response.data.code;
            vm.paramsList.idProficient = ((vm.proficientCode) ? vm.proficientCode : 0);
            }
        }
      }).catch(function(err){
        console.log(err);
        mModalAlert.showError(err.data.message, 'Error');
      });
    }

    function updateList() {
      if (isPerito()) {
        if(!(vm.proficientCode)){
          getProficientCode();
        }
      }

      if (vm.paramsList) {
        if (vm.paramsList.PageNumber === 1) {
          vm.totalItems = 0;
          vm.mPagination = 1;
        }
      }

      mpSpin.start();
      pericialFactory.general.monitor(function() {
        vm.siniestros = [];
        var value = localStorageService.get('fechas');
        if (!value) {
          vm.paramsList.dateStart = (vm.mConsultaDesde) ? pericialFactory.general.formatearFecha(vm.mConsultaDesde) : pericialFactory.general.formatearFecha(new Date());//"20/06/2018",//
          vm.paramsList.dateEnd = (vm.mConsultaHasta) ? pericialFactory.general.formatearFecha(vm.mConsultaHasta) : pericialFactory.general.formatearFecha(new Date());
          localStorageService.set('fechas', vm.paramsList);
        } else {
          vm.formData = value;
          vm.paramsList.dateStart = vm.formData.dateStart;
          vm.paramsList.dateEnd = vm.formData.dateEnd;
          vm.mConsultaDesde = new Date(vm.paramsList.dateStart.replace( /(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3") );//new Date(vm.paramsList.dateStart);
          vm.mConsultaHasta = new Date(vm.paramsList.dateEnd.replace( /(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3") );//new Date(vm.paramsList.dateEnd);
        }
        vm.paramsList.flagTracker = 'N';

        return pericialFactory.siniester.GetListSinister(vm.paramsList);

      }, $scope)
        .begin()
        .then(
          function(response) {
            mpSpin.end();
            if(response.operationCode === 200) {
              if (response.data) {
                if (response.data.items.length > 0) {
                  vm.siniestros = response.data.items;
                  vm.totalItems = response.data.totalRows;
                  vm.servListado = vm.totalItems;
                  vm.totalPages = response.data.totalPages;
                  checkConfirmacionCliente(vm.siniestros)
                  vm.noResult = false;
                }
              }
            } else if(response.operationCode === 204) {
              vm.siniestros = [];
              vm.noResult = true;
              vm.totalItems = 0;
              vm.servListado = 0;
              vm.totalPages = 0;
            }

          },
          function(response) {
            // console.error(response);
            if(response.status !== 200) {
              vm.siniestros = [];
              vm.noResult = true;
              vm.totalItems = 0;
              vm.servListado = 0;
              vm.totalPages = 0;
              mModalAlert.showError(response.data.data.message, 'Error');
            }
          }
        );
    }

    vm.$onInit = function() {
      vm.showIconAlert = true;
      vm.servListado = 0;
      vm.showFilters = false;
      vm.pageSize = 20;
      vm.mPagination = 1;
      vm.format = 'dd/MM/yyyy';
      vm.mConsultaDesde = new Date();
      vm.mConsultaDesde.setDate(vm.mConsultaDesde.getDate() - 7);
      vm.mConsultaHasta = new Date();
      vm.listArray = [];
      vm.initialID = ($stateParams.type.length > 0 ) ? $stateParams.type : parseInt($stateParams.type);

      vm.executive = (!$stateParams.executive) ? '' : $stateParams.executive;
      vm.dataUser = JSON.parse(localStorage.getItem('evoProfile'));
      if (vm.initialID) {
        vm.updateListArray(vm.initialID - 1, true, vm.initialID);
      }

      vm.indexArray = -1;

      oimClaims.rolesCode.some(function(obj, i) {
        return obj.nombreAplicacion === "GPER" ? vm.indexArray = i : false;
      });

      if (vm.indexArray !== -1) {
        vm.rol = oimClaims.rolesCode[vm.indexArray].codigoRol;
      }

      vm.userName = oimClaims.userName;

      vm.listener = $scope.$watch('vm.mConsultaDesde', function(nv)
      {
        vm.dateOptions2.minDate = vm.mConsultaDesde;
      });

      getSiniestros();

      pericialFactory.siniester.Resource_AttachFile_Get_List_State(false).then(function(response) {
        if (response.data.length > 0) {
          vm.estadoReparacionData = response.data;

          if ($stateParams.type) {
            vm.mEstadoReparacion = {id: $stateParams.type};
          }

          pericialFactory.general.Resource_Tron_Proficien_List().then(function(response) {
            if (response.data.length > 0) {
              vm.peritoData = response.data;
            }
          })
            .catch(function(err){
              mModalAlert.showError(err.data.message, 'Error');
            });

          pericialFactory.general.Resource_State_Executive_Get_List().then(function(response) {
            if (response.data.data.length > 0) {
              vm.estadoSiniestroData = response.data;
            }
          }).catch(function(err){
            mModalAlert.showError(err.data.message, 'Error');
          });

          pericialFactory.general.Resource_Parameter_Detail_Order_By_List(false).then(function(response) {
            if (response.data.length > 0) {
              vm.ordenarPorData = response.data;
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

      updateList();

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

      vm.mOrdenarPor =  $scope.$watch(function() { return vm.mOrdenarPor}, function(newVal, oldVal) {
        if (vm.mOrdenarPor && vm.mOrdenarPor.idParameterDetail) {
          getSiniestros();
        }
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

    vm.fnShowModal = function(){

      pericialFactory.general.Resource_Parameter_Detail_Register_Type_List().then(function(response) {
        if (response.operationCode === constants.operationCode.success) {
          $scope.tipoRegistro = response.data;
          var vModalProof = $uibModal.open({
            backdrop: true, // background de fondo
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: 'md',
            templateUrl : '/pericial/app/common/menu/modalNuevoRegistro.html',
            controller : ['$scope', '$uibModalInstance', '$uibModal', '$timeout', '$state',
              function($scope, $uibModalInstance, $uibModal, $timeout, $state) {
                var $ctrl = this;
                /*#########################
                # closeModal
                #########################*/
                $scope.closeModal = function () {
                  // $uibModalInstance.dismiss('cancel');
                  $uibModalInstance.close();
                };
                $scope.mTipoRegistro = 5;
                $scope.newRegistro = function () {
                  $scope.value = ($scope.value) ? $scope.value : 5;
                  if($scope.value) {
                    $uibModalInstance.close();
                    // $state.go('nuevoRegistro', {reload: true, inherit: false});
                    saveTracker();
                    $state.go('nuevoRegistro', {
                      idTipoRegistro: $scope.value
                    }, {reload: true, inherit: false});
                  }
                };
                $scope.setType = function (value) {
                  if(value) {
                    $scope.value = value;
                  }
                };
              }]
          });
          vModalProof.result.then(function(){
            //Action after CloseButton Modal
            // console.log('closeButton');
          },function(){
            //Action after CancelButton Modal
            // console.log("CancelButton");
          });
        }
      })
        .catch(function(err){
          mModalAlert.showError(err.data.message, 'Error');
        });
    };

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

    vm.$onDestroy = function() {
      //clean watch
      vm.listener();

      pericialFactory.general.monitor(vm.siniestros, $scope).stop();
    };

    function open1() {
      vm.popup1.opened = true;
    }

    function open2() {
      vm.popup2.opened = true;
    }

    function goToAnular(item, index, tab) {
      var vModalProof = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        templateUrl: '/pericial/app/bandejaServicios/component/modalMotivoCancelacion.html',
        controller: ['$uibModalInstance',
          function ($uibModalInstance) {
            $scope.selectesMotivoCancelacion = ''
            $scope.listaMotivoCancelacion = [
              {codigoValor: 1, nombreValor: "CAMBIO DE TALLER"},
              {codigoValor: 2, nombreValor: "ASEGURADO NO ESTA DEACUERDO CON LA APROBACIÓN"},
              {codigoValor: 3, nombreValor: "SINIESTRO ES DE OTRA COMPAÑIA"},
              {codigoValor: 4, nombreValor: "NÚMERO DE SINIESTRO NO CORRESPONDE"},
              {codigoValor: 5, nombreValor: "CLIENTE NO DESEA UTILIZAR EL SEGURO"},
              {codigoValor: 6, nombreValor: "CUBIERTO POR DEDUCIBLE"},
              {codigoValor: 7, nombreValor: "PÓLIZA CERRADA NO PERMITE ATENDER EN PREFERENTE"},
              {codigoValor: 8, nombreValor: "ERROR AL INGRESAR LOS DATOS"},
              {codigoValor: 9, nombreValor: "PÓLIZA SOLO DE PREFERENTES"},
              {codigoValor: 10, nombreValor: "RECHAZADO"},
            ]
            $scope.closeModal = function () {
              $uibModalInstance.close();
            };
            $scope.sendMessageClient = function (value) {
              $uibModalInstance.close();
              if (value.nombreValor) {
                ContinuarAnular(item, item.idSinisterDetail, value.nombreValor)
              }
            }
          }]
      });
      vModalProof.result.then(function () {
      }, function () {
      });
    }
    
    function ContinuarAnular(item, idSinisterDetail, motivoCancelacion) {
      mModalConfirm.confirmInfo('¿Esta seguro que desea anular este servicio de reparación?, Esta acción no podrá ser revertida.', 'Anular Servicio', 'Anular').then(function () {
        var params = {
          idSinisterDetail: idSinisterDetail,
          Detail: {
            ReasonOfCancel: motivoCancelacion
          },
          Notification:  {     
            "emailAddress": !vm.dataUser ? '' : vm.dataUser.userEmail,
            "numero_servicio": !item.sinisterNumber ? '' : item.sinisterNumber,
            "motivo_cancelacion": motivoCancelacion, 
            "ordenServicio": '',
            "dni":  !vm.dataUser ? '' : (vm.dataUser.documentType === 'DNI' ? vm.dataUser.documentNumber : ''),
          },
          tracker: {
            CodigoPerfil: vm.rol
          }
        };
        pericialFactory.general.postData('api/sinister/proficient/cancel', params).then(function (response) {
          if (response.operationCode === 200 || response.status === 200) {
            var extraMsg = !response.message ? '' : '<br> <b>' + response.message + '</b>'
            mModalAlert.showSuccess('Orden de servicio anulada exitosamente. ' + extraMsg, '')
            updateList()
          } else {
            mModalAlert.showError("Error en la anulación", 'Error');
            updateList()
          }
        }).catch(function (err) {
          mModalAlert.showError("Error en la anulación", 'Error');
          updateList()
        });
      });
    }

    function goToConfirmClient(item, index, tab) {
      var vModalProof = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        templateUrl: '/pericial/app/bandejaServicios/component/modalConfirmarCliente.html',
        controller: ['$uibModalInstance',

          function ($uibModalInstance) {
            $scope.mConfirmacion = 1
            $scope.mOpcionConfirmacion = [{ id: 1, name: 'ENVIAR SOLICITUD DE CONFIRMACIÓN' }, { id: 2, name: 'MARCAR COMO CONFIRMADO' }]
            $scope.mShowErrorFalse = false

            $scope.checkEmpty = function (value) {
              if (!value.id) {
                $scope.mShowErrorFalse = true
              } else {
                $scope.mShowErrorFalse = false
              }
            };

            $scope.closeModal = function () {
              $uibModalInstance.close();
            };

            $scope.sendMessageClient = function (value) {
              if (!value.id) {
                $scope.mShowErrorFalse = true
                return;
              }
              $uibModalInstance.close();
              if (value.id === 1) {
                var params = {
                  idSinisterDetail: item.idSinisterDetail,
                  ConfirmClient: {
                    IdStateConfirm: 0,
                    UserRol: !vm.rol ? '' : vm.rol
                  },
                  Notification: {
                    numero_servicio: !item.sinisterNumber ? '' : item.sinisterNumber,
                  }
                };
                pericialFactory.general.postData('api/sinister/proficient/request/confirm', params).then(function (response) {
                  if (response.operationCode === 200) {
                    mModalAlert.showInfo('Se envío el E-Mail de confirmación al asegurado correctamente.', '');
                    updateList()
                  } else {
                    mModalAlert.showError("Error en el envio de correo.", 'Error');
                    updateList()
                  }
                }).catch(function (err) {
                  mModalAlert.showError("Error en el envio de correo.", 'Error');
                  updateList()
                });
              }
              if (value.id === 2) {
                var params = {
                  idSinisterDetail: item.idSinisterDetail,
                  ConfirmClient: {
                    IdStateConfirm: 1
                  },
                  Notification: {
                    numero_servicio: !item.sinisterNumber ? '' : item.sinisterNumber,
                  }
                };
                pericialFactory.general.postData('api/sinister/proficient/request/confirm', params).then(function (response) {
                  if (response.operationCode === 200) {
                    mModalAlert.showInfo('La orden de servicio ha sido Confirmado.', '');
                    updateList()
                  } else {
                    mModalAlert.showError("Error al confirmar la orden de servicio.", 'Error');
                    updateList()
                  }
                }).catch(function (err) {
                  mModalAlert.showError("Error al confirmar la orden de servicio.", 'Error');
                  updateList()
                });
              }
            }
          }]
      });
      vModalProof.result.then(function () {
      }, function () {
      });
    }

    function fnShowModalIniReparacion(item){

      var vModalProof = $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        templateUrl : '/pericial/app/bandejaServicios/component/modalIniciarReparacion.html',
        controller : ['$uibModalInstance',
          function($uibModalInstance) {
            $scope.mRepuestoPend = (item.budget.initialEstimate.flagSpare) ? item.budget.initialEstimate.flagSpare : 'N';
            $scope.mIniRepac = (item.budget.initialEstimate.flagStock) ? item.budget.initialEstimate.flagStock : 'N';
            $scope.mFechaEntrega = (item.budget.initialEstimate.estimatedRepairDays) ? item.budget.initialEstimate.estimatedRepairDays : 0;
            $scope.mFechaRepuestos = (item.budget.initialEstimate.arrivalDayOfSpareParts) ? item.budget.initialEstimate.arrivalDayOfSpareParts : 0;
            /*#########################
            # closeModal
            #########################*/
            $scope.closeModal = function () {
              // $uibModalInstance.dismiss('cancel');
              $uibModalInstance.close();
            };
            $scope.startRepair = function (mRepuestoPend, mIniRepac, mFechaRepuestos, mFechaEntrega) {

              if (mRepuestoPend === 'N') {
                mFechaRepuestos = 0;
              }

              vm.params = {
                idSinisterDetail: item.idSinisterDetail,
                repair: {
                  flagSpare: (mRepuestoPend) ? mRepuestoPend : 'N',
                  flagStock: (mIniRepac) ? mIniRepac : 'N',
                  arrivalDayOfSpareParts: (mFechaRepuestos) ? parseInt(mFechaRepuestos) : 0,
                  estimatedRepairDays: (mFechaEntrega ) ? parseInt(mFechaEntrega) : 0
                },
                Notification: {
                  "expediente_siniestro": item.sinisterNumber,   
                  "numero_servicio": item.sinisterNumber,
                  "ordenServicio": '',
                  "dni": !vm.dataUser ? '' : (vm.dataUser.documentType === 'DNI' ? vm.dataUser.documentNumber : '')
                }
              };
              
              pericialFactory.workshop.Resource_Sinister_Workshop_Save_InRepair(vm.params).then(function(response) {
                if (response.operationCode === 200) {
                  if (response.data) {
                    $scope.message = true;
                    $state.reload();
                  }
                }
              })
                .catch(function(err){
                  console.log(err);
                  mModalAlert.showError(err.data.message, 'Error');
                });
            }
          }]
      });
      vModalProof.result.then(function(){
        //Action after CloseButton Modal
        // console.log('closeButton');
      },function(){
        //Action after CancelButton Modal
        // console.log("CancelButton");
      });
    }

    function fnShowModalEntregarVehiculo(){
      var vModalProof = $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        templateUrl : '/pericial/app/bandejaServicios/component/modalEntregarVehiculo.html',
        controller : ['$uibModalInstance',
          function($uibModalInstance) {
            $scope.message = false;
            /*#########################
            # closeModal
            #########################*/
            $scope.closeModal = function () {
              // $uibModalInstance.dismiss('cancel');
              $uibModalInstance.close();
            };
            $scope.changeState = function () {
              $scope.message = true;
            };
          }]
      });
      vModalProof.result.then(function(){
        //Action after CloseButton Modal
        // console.log('closeButton');
      },function(){
        //Action after CancelButton Modal
        // console.log("CancelButton");
      });
    }

    function fnShowModalEntregarRepuestos(item){
      var vModalProof = $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        templateUrl : '/pericial/app/bandejaServicios/component/modalEntregarRepuestos.html',
        controller : ['$uibModalInstance',
          function($uibModalInstance) {
            $scope.message = false;
            /*#########################
            # closeModal
            #########################*/
            $scope.closeModal = function () {
              // $uibModalInstance.dismiss('cancel');
              $uibModalInstance.close();
            };
            $scope.changeState = function () {
              $scope.message = true;
              vm.params = {
                idSinisterDetail: item.idSinisterDetail
              };
              pericialFactory.workshop.Resource_Sinister_Workshop_SaveDeliveredRegularizeSpare(vm.params).then(function(response) {
                if (response.operationCode === 200) {
                  if (response.data) {
                    // mModalAlert.showSuccess('Estado actualizado con éxito', '').then(function () {
                    //   $state.reload();
                    // })
                  }
                }
              })
                .catch(function(err){
                  console.log(err);
                  mModalAlert.showError(err.data.message, 'Error');
                });
            };
          }]
      });
      vModalProof.result.then(function(){
        //Action after CloseButton Modal
        // console.log('closeButton');
      },function(){
        //Action after CancelButton Modal
        // console.log("CancelButton");
      });
    }

    function fnShowModalActEstado(item){
      var vModalProof = $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        templateUrl : '/pericial/app/bandejaServicios/component/modalActualizarEstado.html',
        controller : ['$uibModalInstance',
          function($uibModalInstance) {
            /*#########################
            # closeModal
            #########################*/
            $scope.closeModal = function () {
              // $uibModalInstance.dismiss('cancel');
              $uibModalInstance.close();
            };

            $scope.verDetalle = function () {
              pericialFactory.general.goTo('servicioEnReparacion', item, 0);
            };

            $scope.updateSiniester = function (value) {
              vm.params = {
                idSinisterDetail: item.idSinisterDetail,
                tracker: {
                  CodigoPerfil: vm.rol
                }
              };

              if (value === 'ready') {

                pericialFactory.workshop.Resource_Sinister_Workshop_SaveReadyForDelivery(vm.params).then(function(response) {
                  if (response.operationCode === 200) {
                    if (response.data) {
                      mModalAlert.showSuccess('Estado actualizado con éxito', '').then(function () {
                        $state.reload();
                      })
                    }
                  }
                })
                  .catch(function(err){
                    console.log(err);
                    mModalAlert.showError(err.data.message, 'Error');
                  });

              } else if (value === 'ampliacion') {

                vm.params.Notification = {
                  "numero_servicio": item.sinisterNumber,
                  "ordenServicio": '',
                  "dni": !vm.dataUser ? '' : (vm.dataUser.documentType === 'DNI' ? vm.dataUser.documentNumber : ''),
                  "motivo": "AMPLIACIÓN DE SERVICIO"
                };
                
                vm.params.tracker = {
                  CodigoPerfil: vm.rol
                };

                pericialFactory.workshop.Resource_Sinister_Workshop_GenerateExtension(vm.params).then(function(response) {
                  if (response.operationCode === 200) {
                    if (response.data) {
                      var extraMsg = !response.message ? '' : '<br> <b>' + response.message + '</b>'
                      mModalAlert.showSuccess('Estado actualizado con éxito. ' + extraMsg, '').then(function () {
                        $state.reload();
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
          }]
      });
      vModalProof.result.then(function(){
        //Action after CloseButton Modal
        // console.log('closeButton');
      },function(){
        //Action after CancelButton Modal
        // console.log("CancelButton");
      });
    }

    function setPointColorBandeja(item, index) {
      switch (item.idExecutiveState) {
        case 6:// Autorizado
          vm.siniestros[index].pointColor = 'gperColorVerde';
          break;
        case 7:// rechazado
          vm.siniestros[index].pointColor = 'gperColorRojo';
          break;
        default:
          vm.siniestros[index].pointColor = 'gperColorAmarillo';
          break;
      }
      return true;
    }

    function setColorLabelBandeja(item, index) {
      switch (item.idSinisterState) {
        case 1: // ingresado al taller
          vm.siniestros[index].labelColor = 'gperFondoVerde';
          break;
        case 2: // presupuestado
          vm.siniestros[index].labelColor = 'gperFondoNaranja';
          break;
        case 3: // peritado
          vm.siniestros[index].labelColor = 'gperFondoVerde';
          break;
        case 4: // en reparación
          vm.siniestros[index].labelColor = 'gperFondoAmarillo';
          break;
        case 5: // en espera de respuestos
          vm.siniestros[index].labelColor = 'gperFondoGris'; //pendientes
          break;
        case 6: // listo para entrega
          vm.siniestros[index].labelColor = 'gperFondoVerde';
          break;
        // case 7: // veh. sin recoger
        //   vm.siniestros[index].labelColor = 'gperFondoRojo';
        //   break;
        case 7: // entregado
          vm.siniestros[index].labelColor = 'gperFondoGris';
          break;
        case 8: // por regularizar
          vm.siniestros[index].labelColor = 'gperFondoAmarillo';
          break;
        case 9: // ANULADO 
          vm.siniestros[index].labelColor = 'gperFondoRojo';
          break;
        default:
          vm.siniestros[index].labelColor = 'gperFondorGris';//pendientes
          break;
      }
      return true;
    }

    function getLabelBandeja(item, index) {
      setPointColorBandeja(item, index);
      setColorLabelBandeja(item, index);
      item.idRegisterType = parseInt(item.idRegisterType);

      if (isSupervisor()) {
        vm.siniestros[index].labelBandeja = 'VER DETALLE';
        if (item.totalLoss) {// && item.idRegisterType === 7) {
          vm.siniestroRegistrado = (item.totalLoss.flagTotalLossLetterEvaluation === 'S') ? true : false;
          if (item.totalLoss.flagTotalLossLetterEvaluation && item.totalLoss.flagTotalLossLetterEvaluation === 'S') {
            vm.siniestros[index].labelBandeja = 'EVALUAR PÉRDIDA';
            vm.siniestros[index].flagTotalLoss = true;
          }
        }
      } else {
        switch (item.idSinisterState) {
          case 1:
            if (item.idRegisterType === 7) {
              if (item.totalLoss) {
                // vm.siniestroRegistrado = (item.totalLoss.flagTotalLossLetterEvaluation === 'S') ? true : false;
                vm.siniestroRegistrado = (item.totalLoss.flagConfirmTotalLost) ? true : false;
                if ((item.totalLoss.flagConfirmTotalLost === 'N') && isTaller()) {
                  vm.siniestroRegistrado = false;
                }
              }
              (isTaller()) ? ((vm.siniestroRegistrado) ? vm.siniestros[index].labelBandeja = 'VER DETALLE' : vm.siniestros[index].labelBandeja = 'ADJUNTAR CARTA Y DAÑOS') : (isPerito()) ? vm.siniestros[index].labelBandeja = 'VER DETALLE' : vm.siniestros[index].labelBandeja = 'VER DETALLE';

              if (isTaller()) {
                if ((!item.totalLoss.flagConfirmTotalLost) && (!item.totalLoss.flagTotalLossLetterEvaluation)) {
                  vm.siniestros[index].labelBandeja = 'ADJUNTAR CARTA Y DAÑOS';
                } else if (item.totalLoss.flagConfirmTotalLost === 'N') {
                  vm.siniestros[index].labelBandeja = 'CARGAR PRESUPUESTO';
                }else{
                  vm.siniestros[index].labelBandeja = 'VER DETALLE';
                }
              }
            } else {
              (isTaller()) ? ((item.flagTotalLoss === 'S') ? vm.siniestros[index].labelBandeja = 'VER DETALLE' : vm.siniestros[index].labelBandeja = 'CARGAR PRESUPUESTO') : (isPerito()) ? vm.siniestros[index].labelBandeja = 'VER DETALLE' : vm.siniestros[index].labelBandeja = 'VER DETALLE';
            }
            break;
          case 2:
            (isTaller()) ? (vm.siniestros[index].proficient.flagRequestInformation === 'S' ?  vm.siniestros[index].labelBandeja = 'ACTUALIZAR SINIESTRO' : vm.siniestros[index].labelBandeja = 'VER DETALLE') : (isPerito()) ? vm.siniestros[index].labelBandeja = 'PERITAR' : vm.siniestros[index].labelBandeja = 'VER DETALLE';
            break;
          case 3:
            (isTaller()) ? ((item.proficient.flagTotalLossByBudget === 'S') ? vm.siniestros[index].labelBandeja = 'VER DETALLE' : (item.idExecutiveState === 6) ? vm.siniestros[index].labelBandeja = 'INICIAR REPARACIÓN' : vm.siniestros[index].labelBandeja = 'VER DETALLE') : (isPerito()) ? vm.siniestros[index].labelBandeja = 'VER DETALLE' : vm.siniestros[index].labelBandeja = 'VER DETALLE';
            // (isTaller()) ? ((item.proficient.flagTotalLossByBudget === 'S') ? vm.siniestros[index].labelBandeja = 'VER DETALLE' : vm.siniestros[index].labelBandeja = 'INICIAR REPARACIÓN') : (isPerito()) ? vm.siniestros[index].labelBandeja = 'VER DETALLE' : vm.siniestros[index].labelBandeja = 'VER DETALLE';
            break;
          case 4:
            (isTaller()) ? vm.siniestros[index].labelBandeja = 'ACTUALIZAR ESTADO' : (isPerito()) ? vm.siniestros[index].labelBandeja = 'VER DETALLE' : vm.siniestros[index].labelBandeja = 'VER DETALLE';
            break;
          case 5:
            (isTaller()) ? vm.siniestros[index].labelBandeja = 'VER DETALLE' : (isPerito()) ? vm.siniestros[index].labelBandeja = 'VER DETALLE' : vm.siniestros[index].labelBandeja = 'VER DETALLE';
            break;
          case 6:
            (isTaller()) ? vm.siniestros[index].labelBandeja = 'ENTREGAR VEHÍCULO' : (isPerito()) ? vm.siniestros[index].labelBandeja = 'VER DETALLE' : vm.siniestros[index].labelBandeja = 'VER DETALLE';
            break;
          // case 7:
          //   (isTaller()) ? vm.siniestros[index].labelBandeja = 'ENTREGAR VEHÍCULO' : (isPerito()) ? vm.siniestros[index].labelBandeja = 'VER DETALLE' : vm.siniestros[index].labelBandeja = 'VER DETALLE';
          //   break;
          case 7:
            (isTaller()) ? ((item.flagSparePending === 'S') ? vm.siniestros[index].labelBandeja = 'ENTREGAR REPUESTOS' : vm.siniestros[index].labelBandeja = 'VER DETALLE') : (isPerito()) ? vm.siniestros[index].labelBandeja = 'VER DETALLE' : vm.siniestros[index].labelBandeja = 'VER DETALLE';
            // (isTaller()) ? vm.siniestros[index].labelBandeja = 'VER DETALLE' : (isPerito()) ? vm.siniestros[index].labelBandeja = 'VER DETALLE' : vm.siniestros[index].labelBandeja = 'VER DETALLE';
            break;
          case 8:
            (isTaller()) ? vm.siniestros[index].labelBandeja = 'ENTREGAR VEHÍCULO' : (isPerito()) ? vm.siniestros[index].labelBandeja = 'VER DETALLE' : vm.siniestros[index].labelBandeja = 'VER DETALLE';
            break;
          default:
            vm.siniestros[index].labelBandeja = 'VER DETALLE';
            break;
        }

        // if(item.idRegisterType === 5   && (item.idExecutiveState !== 6 && item.idExecutiveState !== 7) ) {// en evaluacion)
        //   vm.siniestros[index].labelBandeja = 'VER DETALLE';
        // }
      }
      // si hay ampliación se muestra un tag adicional
      if(item.version > 1){
        vm.versionSiniester = item.version - 1;
        vm.siniestros[index].labelNumberAmpliation = 'AMPLIACIÓN ' + vm.versionSiniester;
      }

      //CUANDO ES PT Y NO ESTA EN EVALUACION EL BOTON ES VER DETALLE
      if(item.idRegisterType === 7   && (item.idExecutiveState === 6 || item.idExecutiveState === 7) ) {// en evaluacion)
        if (isTaller() && !item.totalLoss.flagConfirmTotalLost) {
          vm.siniestros[index].labelBandeja = 'ADJUNTAR CARTA Y DAÑOS';
        } else if (isPerito()){
          vm.siniestros[index].labelBandeja = 'VER DETALLE';
        }
      }
      return true;
    }

    function getSiniestros() {
      if(vm.mConsultaDesde > new Date(new Date().setHours(23,59,59,999)) ||
        vm.mConsultaHasta > new Date(new Date().setHours(23,59,59,999)) ){
        mModalAlert.showError("Fecha no puede ser mayor a la actual", 'Error');
      }else {
        // vm.executive = ($stateParams.executive && $stateParams.executive === '0') ? '' : $stateParams.executive;
        vm.paramsList = {
          plateNumber: (vm.mPlaca) ? vm.mPlaca.toUpperCase() : '',
          caseNumber: (vm.mSiniester) ? vm.mSiniester : '',
          stateSinister: (vm.listArray) ? ((vm.listArray.length>0) ? vm.listArray.toString() : ($stateParams.type) ? $stateParams.type : '') : '',
          dateStart: (vm.mConsultaDesde) ? pericialFactory.general.formatearFecha(vm.mConsultaDesde) : null,
          dateEnd: (vm.mConsultaHasta) ? pericialFactory.general.formatearFecha(vm.mConsultaHasta) : null,
          idOrderBy: (vm.mOrdenarPor) ? ((vm.mOrdenarPor.idParameterDetail) ? vm.mOrdenarPor.idParameterDetail : 8) : 8,
          stateExecutive: (vm.executive) ? vm.executive : (vm.mEstadoSiniestro && vm.mEstadoSiniestro.id) ? vm.mEstadoSiniestro.id : '',
          idWorkshop: (vm.mTaller) ? vm.mTaller.idThird : 0,
          idProficient: (vm.mPerito) ? vm.mPerito.idThird : 0,
          pageNumber: 1,
          pageSize: vm.pageSize,
          flagTracker: 'S',
          tracker: {
            CodigoPerfil: vm.rol
          }
        };
        if (vm.mEstadoSiniestro && vm.mEstadoSiniestro.id === 0) {
          vm.paramsList.stateExecutive = 0;
        }

        (vm.paramsList.stateExecutive === '1') ? vm.paramsList.stateExecutive = 0 : vm.paramsList.stateExecutive;

        if (isPerito()) {
          pericialFactory.proficient.getTipoPerito().then(function(response) {
            if (response.operationCode === 200) {
              if (response.data) {
                vm.proficientType = response.data.type;
                vm.proficientCode = response.data.code;
                vm.paramsList.idProficient = ((vm.proficientCode) ? vm.proficientCode : 0);

                // updateList();
                pericialFactory.siniester.GetListSinister(vm.paramsList).then(function(response) {
                  vm.siniestros = [];
                  if(response.operationCode === 200) {
                    if (response.data) {
                      if (response.data.items.length > 0) {
                        vm.siniestros = response.data.items;
                        vm.totalItems = response.data.totalRows;
                        vm.servListado = vm.totalItems;
                        vm.totalPages = response.data.totalPages;
                        checkConfirmacionCliente(vm.siniestros)
                        vm.noResult = false;
                      }
                    }
                  } else if(response.operationCode === 204) {
                    vm.siniestros = [];
                    vm.noResult = true;
                    vm.totalItems = 0;
                    vm.servListado = 0;
                    vm.totalPages = 0;
                  }
                })
                  .catch(function(err){
                    mModalAlert.showError(err.data.message, 'Error');
                  });

              }
            }
          }).catch(function(err){
            console.log(err);
            mModalAlert.showError(err.data.message, 'Error');
          });
        } else {
          pericialFactory.siniester.GetListSinister(vm.paramsList).then(function(response) {
            vm.siniestros = [];
            if(response.operationCode === 200) {
              if (response.data) {
                if (response.data.items.length > 0) {
                  vm.siniestros = response.data.items;
                  vm.totalItems = response.data.totalRows;
                  vm.servListado = vm.totalItems;
                  vm.totalPages = response.data.totalPages;
                  checkConfirmacionCliente(vm.siniestros)
                  vm.noResult = false;
                }
              }
            } else if(response.operationCode === 204) {
              vm.siniestros = [];
              vm.noResult = true;
              vm.totalItems = 0;
              vm.servListado = 0;
              vm.totalPages = 0;
            }
          })
            .catch(function(err){
              mModalAlert.showError(err.data.message, 'Error');
            });
        }
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

    function goTo(item, index, tab) { // si es 4 es para ir a comentarios
      item.idRegisterType = parseInt(item.idRegisterType);
      switch (item.idSinisterState) {
        case 1:
          if(item.idRegisterType === 7  ){
            // 'ADJUNTAR CARTA Y DAÑOS';
            if (tab === 4) { tab = 1; }
            if ((!item.totalLoss.flagConfirmTotalLost) && (!item.totalLoss.flagTotalLossLetterEvaluation)) {
              pericialFactory.general.goTo('servicioIngresadoPT', item, tab);
            } else if (item.totalLoss.flagConfirmTotalLost === 'N' && isTaller()) {
              pericialFactory.general.goTo('servicioIngresado', item, tab);
            }else{
              pericialFactory.general.goTo('servicioIngresadoPT', item, tab);
            }
          }else{
            // 'PRESUPUESTAR';
            if (tab === 4) { tab = 1; }
            pericialFactory.general.goTo('servicioIngresado', item, tab);
          }
          break;
        case 2:
          //'VER DETALLE';
          if (tab === 4) { tab = 1; }
          //validar por tipo de perito
          if (isPerito()) {
            pericialFactory.proficient.getTipoPerito().then(function(response) {
              if (response.operationCode === 200) {
                if (response.data) {
                  vm.proficientType = response.data.type;
                  switch (vm.proficientType) {
                    case 'ZONA':
                      pericialFactory.general.goTo('servicioPresupuestadoZone', item, tab);
                      break;
                    case 'PAR':
                      pericialFactory.general.goTo('servicioPresupuestado', item, tab);
                      break;
                    case 'VIRTUAL':
                      pericialFactory.general.goTo('servicioPresupuestadoVirt', item, tab);
                      break;
                    default:
                      pericialFactory.general.goTo('servicioPresupuestadoAmp', item, tab);
                      break;
                  }
                }
              }
            }).catch(function(err){
              console.log(err);
              mModalAlert.showError(err.data.message, 'Error');
            });
          } else {
            (item.proficient.flagRequestInformation === 'S') ? pericialFactory.general.goTo('servicioIngresado', item, tab) : pericialFactory.general.goTo('servicioPresupuestado', item, tab);
          }

          break;
        case 3:
          // 'INICIAR REPARACIÓN';
          if (tab === 4) {
            tab = 1;
            pericialFactory.general.goTo('servicioPeritado', item, tab);
          } else { //peritado
            // (isTaller()) ? ((item.proficient.flagTotalLossByBudget && item.idExecutiveState === 6) ? pericialFactory.general.goTo('servicioPeritado', item, tab) : fnShowModalIniReparacion(item)) : pericialFactory.general.goTo('servicioPeritado', item, tab);
            (isTaller()) ? ((item.idExecutiveState !== 6) ? pericialFactory.general.goTo('servicioPeritado', item, tab) : ((item.proficient.flagTotalLossByBudget === 'S') ? pericialFactory.general.goTo('servicioPeritado', item, tab) : fnShowModalIniReparacion(item))) : pericialFactory.general.goTo('servicioPeritado', item, tab);
          }
          break;
        case 4:
          // 'ACTUALIZAR ESTADO';
          if (tab === 4) {
            tab = 1;
            pericialFactory.general.goTo('servicioEnReparacion', item, tab);
          } else {
            (isTaller()) ? fnShowModalActEstado(item) : pericialFactory.general.goTo('servicioEnReparacion', item, tab);
            //enReparacion
          }
          break;
        case 5:
          // 'VER DETALLE';
          if (tab === 4) {
            tab = 1;
            pericialFactory.general.goTo('servicioPeritado', item, tab);
          } else {
            (isTaller()) ? fnShowModalIniReparacion(item) : pericialFactory.general.goTo('servicioPeritado', item, tab);
            //peritado
          }
          break;
        case 6:
          //  'ENTREGAR VEHÍCULO';
          if (tab === 4) {
            tab = 3;
            pericialFactory.general.goTo('servicioPorEntregar', item, tab);
          } else {
            (isTaller()) ? pericialFactory.general.goTo('servicioPorEntregar', item, 2) : pericialFactory.general.goTo('servicioPorEntregar', item, 0);
          }
          break;
        case 7:
          // 'VER DETALLE';
          if (tab === 4) {
            tab = 3;
            pericialFactory.general.goTo('servicioPorEntregar', item, tab);
          } else {
            ((isTaller()) && item.flagSparePending === 'S') ? fnShowModalEntregarRepuestos(item) : pericialFactory.general.goTo('servicioPorEntregar', item, tab);
          }
          break;
        case 8:
          // 'VER DETALLE';
          if(item.idRegisterType === 7   && item.idExecutiveState !== 9) {// en evaluacion)
            if (tab === 4) { tab = 2; }
            pericialFactory.general.goTo('servicioIngresadoPT', item, tab);
          }else{
            if (tab === 4) {
              pericialFactory.general.goTo('servicioPorEntregarPR', item, tab);
              //por regularizar
            } else {
              (isTaller()) ? fnShowModalEntregarVehiculo() : pericialFactory.general.goTo('servicioPorEntregarPR', item, tab);
              //por regularizar
            }
          }
          break;
        default:
          // 'VER DETALLE';
          if (tab === 4) { tab = 1; }
          pericialFactory.general.goTo('servicioIngresado', item, tab);
          break;
      }
    }

    vm.changeSiniesterNumber = function (siniestro) {
      var vModalProof = $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        templateUrl : '/pericial/app/common/modal/modalSiniesterNumber.html',
        // template : '<mpf-modal-send-email action="action" data="emailData" close="close()"></mpf-modal-send-email>',
        controller : ['$scope', '$uibModalInstance', '$uibModal', '$timeout',
          function($scope, $uibModalInstance, $uibModal, $timeout) {
            /*#########################
                          # closeModal
                          #########################*/
            $scope.closeModal = function () {
              // $uibModalInstance.dismiss('cancel');
              $uibModalInstance.close();
            };
            $scope.update = function (siniester, expediente) {

              $scope.frm.markAsPristine();
              if ($scope.frm.$valid) {
                vm.paramsUpdate = {
                  idSinister: siniestro.idSinister,
                  sinisterNumber: (siniester) ? siniester : 0,
                  fileNumber: (expediente) ? expediente : 0
                };

                pericialFactory.general.Resource_Sinister_Upd(vm.paramsUpdate).then(function(response) {
                  if (response.operationCode === 200) {
                    $uibModalInstance.close();
                    $state.reload();
                  } else {
                    mModalAlert.showError(response.message, 'Error');
                  }
                })
                  .catch(function(err){
                    mModalAlert.showError(err.data.message, 'Error');
                    $uibModalInstance.close();
                  });
              }
            }
          }]
      });
      vModalProof.result.then(function(){
        //Action after CloseButton Modal
        // console.log('closeButton');
      },function(){
        //Action after CancelButton Modal
        // console.log("CancelButton");
      });
    }

    function saveTracker(){
      vm.paramTracker = {
        idSinisterDetail: null,
        CodigoPerfil: vm.rol,
        DescripcionOperacion : 'INGRESO A NUEVO REGISTRO',
        OpcionMenu : 'GPER > Principal > Iniciar registro'
      };

      pericialFactory.siniester.SaveTracker(vm.paramTracker).then(function(response) {
        
      })
        .catch(function(err){
          console.log(err);
            mModalAlert.showError("Error en SaveTracker", 'Error');
        });
    }

  } // end

  return angular.module('appPericial')
    .controller('BandejaServiciosController', BandejaServiciosController);
});
