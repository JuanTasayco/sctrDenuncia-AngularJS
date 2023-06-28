'use strict';

define(['angular', 'constants', 'constantsPericial', 'mocksPericial', 'pericialFactory'], function(
  angular,
  constants, constantsPericial, mocksPericial) {

  DashboardController.$inject = [
    '$scope', '$window', '$state', '$timeout', 'mainServices', '$uibModal', 'mModalAlert', 'mModalConfirm', 'oimClaims', 'pericialFactory', 'mpSpin', 'localStorageService'
  ];

  function DashboardController(
    $scope, $window, $state, $timeout, mainServices, $uibModal, mModalAlert, mModalConfirm, oimClaims, pericialFactory, mpSpin, localStorageService
  ) {

      var vm = this;

      function updateGraphs() {

        vm.dateParamsGraphs = {
          idWorkshop: 0,
          idProficient: 0,
          StartDate: (vm.mConsultaDesde) ? pericialFactory.general.formatearFecha(vm.mConsultaDesde) : pericialFactory.general.formatearFecha(new Date()),//"20/06/2018",//
          EndDate: (vm.mConsultaHasta) ? pericialFactory.general.formatearFecha(vm.mConsultaHasta) : pericialFactory.general.formatearFecha(new Date())
        };

        if (isPerito()) {
          vm.dateParamsGraphs.idProficient = ((vm.proficientCode) ? vm.proficientCode : 0);
        }

        if (isTaller()) {
          pericialFactory.general.monitor(function() {
            return pericialFactory.dashboard.Resource_Dashboard_Workshop(vm.dateParamsGraphs);
          }, $scope)
            .begin()
            .then(
              function(response) {

                $timeout(function(){
                  vm.grafico1T = response.data[0];
                  vm.grafico1T.chartLineLabels = [];
                  vm.grafico1T.chartLineData = [];

                  angular.forEach(vm.grafico1T.detail, function (value, key) {
                    vm.grafico1T.chartLineLabels.push(value.date);
                    vm.grafico1T.chartLineData.push(value.row);
                  });

                  vm.autosReparados = document.getElementById("autosReparados");

                  vm.autosReparadosChart = new Chart(vm.autosReparados, {
                    type: 'line',
                    data: {
                      labels: vm.grafico1T.chartLineLabels,
                      datasets: [{
                        data: vm.grafico1T.chartLineData,
                        backgroundColor: 'rgba(255,255,255,0.5)',
                        borderColor: 'rgba(255,255,255,1)',
                        borderWidth: 1
                      }]
                    },
                    options: {
                      responsive: true,
                      layout: {
                        padding: {
                          left: 0,
                          right: 5,
                          top: 10,
                          bottom: 0
                        }
                      },
                      legend: {
                        display: false
                      },
                      scales: {
                        xAxes: [{
                          display: false
                        }],
                        yAxes: [{
                          display: true,
                          ticks: {
                            beginAtZero: true,
                            fontColor: '#fff',
                            fontFamily:"'Roboto', sans-serif",
                            fontStyle: 'normal',
                            callback: function(value) {if (value % 1 === 0) {return value;}}
                          }
                        }]
                      }
                    }
                  });

                  vm.grafico2T = response.data[1];
                  vm.grafico2T.chartLineLabels = [];
                  vm.grafico2T.chartLineData = [];

                  angular.forEach(vm.grafico2T.detail, function (value, key) {
                    vm.grafico2T.chartLineLabels.push(value.date);
                    vm.grafico2T.chartLineData.push(value.row);
                  });

                  vm.plazoAutos = document.getElementById("plazoAutos");

                  vm.plazoAutosChart = new Chart(vm.plazoAutos, {
                    type: 'line',
                    data: {
                      labels: vm.grafico2T.chartLineLabels,
                      datasets: [{
                        data: vm.grafico2T.chartLineData,
                        backgroundColor: 'rgba(255,255,255,0.5)',
                        borderColor: 'rgba(255,255,255,1)',
                        borderWidth: 1
                      }]
                    },
                    options: vm.autosReparadosChart.options
                  });

                  vm.grafico3T = response.data[2];
                  vm.grafico3T.chartLineLabels = [];
                  vm.grafico3T.chartLineData = [];

                  angular.forEach(vm.grafico3T.detail, function (value, key) {
                    vm.grafico3T.chartLineLabels.push(value.date);
                    vm.grafico3T.chartLineData.push(value.row);
                  });

                  vm.tardanzasRepuestos = document.getElementById("tardanzasRepuestos");

                  vm.tardanzasRepuestosChart = new Chart(vm.tardanzasRepuestos, {
                    type: 'line',
                    data: {
                      labels: vm.grafico3T.chartLineLabels,
                      datasets: [{
                        data: vm.grafico3T.chartLineData,
                        backgroundColor: 'rgba(255,255,255,0.5)',
                        borderColor: 'rgba(255,255,255,1)',
                        borderWidth: 1
                      }]
                    },
                    options: vm.autosReparadosChart.options
                  });
                }, 200);

              },
              function(response) {
                console.error(response);
              }
            );
        } else if (isPerito()){
          pericialFactory.general.monitor(function() {
            return pericialFactory.dashboard.Resource_Dashboard_Proficient(vm.dateParamsGraphs);
          }, $scope)
            .begin()
            .then(
              function(response) {
                $timeout(function() {
                  vm.grafico1 = response.data[0];
                  vm.grafico1.chartLineLabels = [];
                  vm.grafico1.chartLineData = [];

                  angular.forEach(vm.grafico1.detail, function (value, key) {
                    vm.grafico1.chartLineLabels.push(value.date);
                    vm.grafico1.chartLineData.push(value.row);
                  });

                  vm.autosPeritados = document.getElementById("autosPeritados");

                  vm.autosPeritadosChart = new Chart(vm.autosPeritados, {
                    type: 'line',
                    data: {
                      labels: vm.grafico1.chartLineLabels,
                      datasets: [{
                        data: vm.grafico1.chartLineData,
                        backgroundColor: 'rgba(255,255,255,0.5)',
                        borderColor: 'rgba(255,255,255,1)',
                        borderWidth: 1
                      }]
                    },
                    options: {
                      responsive: true,
                      layout: {
                        padding: {
                          left: 0,
                          right: 0,
                          top: 10,
                          bottom: 0
                        }
                      },
                      legend: {
                        display: false
                      },
                      maintainAspectRatio: false,
                      scales: {
                        xAxes: [{
                          display: false
                        }],
                        yAxes: [{
                          display: true,
                          ticks: {
                            beginAtZero: true,
                            fontColor: '#fff',
                            fontFamily:"'Roboto', sans-serif",
                            fontStyle: 'normal',
                            callback: function(value) {if (value % 1 === 0) {return value;}}
                          }
                        }]
                      }
                    }
                  });

                  vm.grafico2 = response.data[1];
                  vm.grafico2.chartLineLabels = [];
                  vm.grafico2.chartLineData = [];

                  angular.forEach(vm.grafico2.detail, function (value, key) {
                    vm.grafico2.chartLineLabels.push(value.date);
                    vm.grafico2.chartLineData.push(value.row);
                  });

                  vm.autosAmpliaciones = document.getElementById("autosAmpliaciones");

                  vm.autosAmpliacionesChart = new Chart(vm.autosAmpliaciones, {
                    type: 'line',
                    data: {
                      labels: vm.grafico2.chartLineLabels,
                      datasets: [{
                        data: vm.grafico2.chartLineData,
                        backgroundColor: 'rgba(255,255,255,0.5)',
                        borderColor: 'rgba(255,255,255,1)',
                        borderWidth: 1
                      }]
                    },
                    options: vm.autosPeritadosChart.options
                  });

                  vm.grafico3 = response.data[2];
                  vm.grafico3.chartLineLabels = [];
                  vm.grafico3.chartLineData = [];


                  angular.forEach(vm.grafico3.detail, function (value, key) {
                    vm.grafico3.chartLineLabels.push(value.date);
                    vm.grafico3.chartLineData.push(value.row);
                  });

                  vm.autosPT = document.getElementById("autosPT");

                  vm.autosPTChart = new Chart(vm.autosPT, {
                    type: 'line',
                    data: {
                      labels: vm.grafico3.chartLineLabels,
                      datasets: [{
                        data: vm.grafico3.chartLineData,
                        backgroundColor: 'rgba(255,255,255,0.5)',
                        borderColor: 'rgba(255,255,255,1)',
                        borderWidth: 1
                      }]
                    },
                    options: vm.autosPeritadosChart.options
                  });

                }, 200);
              },
              function(response) {
                console.error(response);
              }
            );
        }
      }

      function updateIndicators() {

        vm.dateParams = {
          StartDate: (vm.mConsultaDesde) ? pericialFactory.general.formatearFecha(vm.mConsultaDesde) : pericialFactory.general.formatearFecha(new Date()),
          EndDate: (vm.mConsultaHasta) ? pericialFactory.general.formatearFecha(vm.mConsultaHasta) : pericialFactory.general.formatearFecha(new Date())
        };

        if (isTaller()) {
          pericialFactory.general.monitor(function() {
            return pericialFactory.dashboard.Resource_Dashboard_WorkshopIndicator(vm.dateParams);
          }, $scope)
            .begin()
            .then(
              function(response) {
                vm.dataWorkshopIndicator = response.data;

              },
              function(response) {
                console.error(response);
              }
            );
        } else if (isPerito()){
          pericialFactory.general.monitor(function() {
            return pericialFactory.dashboard.Resource_Dashboard_ProficientIndicator(vm.dateParams);
          }, $scope)
            .begin()
            .then(
              function(response) {
                vm.dataProficientIndicator = response.data;

              },
              function(response) {
                console.error(response);
              }
            );
        }
      }

      function updateList() {
        vm.siniestrosPpal = [];
        mpSpin.start();
        pericialFactory.general.monitor(function() {
          var value = localStorageService.get('fechas');
          vm.paramsList.dateStart = (vm.mConsultaDesde) ? pericialFactory.general.formatearFecha(vm.mConsultaDesde) : pericialFactory.general.formatearFecha(new Date());//"20/06/2018",//
          vm.paramsList.dateEnd = (vm.mConsultaHasta) ? pericialFactory.general.formatearFecha(vm.mConsultaHasta) : pericialFactory.general.formatearFecha(new Date());
          localStorageService.set('fechas', vm.paramsList);
          return pericialFactory.siniester.GetListSinister(vm.paramsList);
        }, $scope)
          .begin()
          .then(
            function(response) {
              mpSpin.end();
              if(response.operationCode === 200) {
                if (response.data) {
                  if (response.data.items.length > 0) {
                    vm.siniestrosPpal = response.data.items;
                    vm.totalItems = response.data.totalRows;
                    vm.servListado = vm.totalItems;
                    vm.totalPages = response.data.totalPages;
                    checkConfirmacionCliente(vm.siniestrosPpal)
                    vm.noResult = false;
                  } else {
                    vm.siniestrosPpal = {};
                    vm.noResult = true;
                    vm.totalItems = 0;
                    vm.servListado = 0;
                    vm.totalPages = 0;
                  }
                } else {
                  vm.siniestrosPpal = {};
                  vm.noResult = true;
                  vm.totalItems = 0;
                  vm.totalPages = 0;
                }
              } else {
                vm.siniestrosPpal = {};
                vm.noResult = true;
                vm.totalItems = 0;
                vm.servListado = 0;
                vm.totalPages = 0;
              }
            },
            function(response) {
              // console.error(response);
              if(response.status !== 200) {
                vm.siniestrosPpal = {};
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
        vm.dataUser = JSON.parse(localStorage.getItem('evoProfile'));
        vm.showIconAlert = true;
        vm.servListado = 0;
        vm.mPagination = 1;
        vm.pageSize = 5;
        vm.mPagination = 1;

        vm.format = 'dd/MM/yyyy';
        vm.mConsultaDesde = new Date();
        vm.mConsultaDesde.setDate(vm.mConsultaDesde.getDate() - 7);
        vm.mConsultaHasta = new Date();

        vm.indexArray = -1;

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
         // minDate: new Date(),
          maxDate: new Date()
        };

        oimClaims.rolesCode.some(function(obj, i) {
          return obj.nombreAplicacion === "GPER" ? vm.indexArray = i : false;
        });

        if (vm.indexArray !== -1) {
          vm.rol = oimClaims.rolesCode[vm.indexArray].codigoRol;
        }


        if (vm.rol === 'SUPERVISOR') {
          $state.go('dashboardSupervisor', {type: 0}, {reload: true, inherit: false});
        }

        vm.userName = oimClaims.userName;
        vm.showBtnBox = isTaller();
        vm.myDate = new Date();
        vm.monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
          "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        vm.paramsList = {
          plateNumber: '',
          caseNumber: '',
          stateSinister: '',
          dateStart: null,
          dateEnd: null,
          idOrderBy: 8,
          stateExecutive: '',
          idProficient: 0,
          pageNumber: 1,
          pageSize: vm.pageSize
        };


        if (isPerito()) {
          pericialFactory.proficient.getTipoPerito().then(function(response) {
            if (response.operationCode === 200) {
              if (response.data) {
                vm.proficientType = response.data.type;
                vm.proficientCode = response.data.code;
                vm.paramsList.idProficient = ((vm.proficientCode) ? vm.proficientCode : 0);
                setDate(vm.myDate);
                updateList();
                updateGraphs();
                updateIndicators();
              }
            }
          }).catch(function(err){
            console.log(err);
            if (err.data)
              mModalAlert.showError(err.data.message, 'Error');
          });
        } else {
          setDate(vm.myDate);
          updateList();
          updateGraphs();
          updateIndicators();
        }

        // Line Chart
        vm.chartLineOptions = {
          fill: false,
          scales: {
            xAxes: [{
              ticks: {
                beginAtZero: false,
                fontColor: '#FFF',
              },
              display: false
            }],
            yAxes: [{
              ticks: {
                beginAtZero: false,
                fontColor: '#FFF'
              },
              display: true
            }],
          }
        };
        // $scope.chartLineColors = ['rgba(255,255,255,0.4)'];
        vm.chartLineColors = [
          {
            backgroundColor: 'rgba(255,255,255,1)',
            borderColor: 'rgba(255,255,255,1)',
            pointBackgroundColor: 'rgba(255,255,255,0.4)',
            pointBorderColor: 'rgba(255,255,255,1)',
            pointHoverBackgroundColor: 'rgba(255,255,255,1)',
            pointHoverBorderColor: 'rgba(255,255,255,1)'
          }
        ];
        vm.datasetOverrideLine =
          [
            {
              // label: 'Override Series B',
              borderWidth: 3,
              backgroundColor: 'rgba(255,99,132,1)',
              hoverBorderColor: 'rgba(255,99,132,1)',
              type: 'bar'
            }
          ];

        // Bar Chart
        vm.chartBarsColors = '#494750,#999999,#cc3321';
        vm.chartBarsOptions = {
          legend: {
            display: false,
            position: 'bottom'
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: false
            }],
          }
        };

        // Pie Chart
        vm.chartPieOptions = {
        };
        vm.chartPieColors = '#494750,#999999,#cc3321';

        vm.menuPericial = [
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
                  $scope.mTipoRegistro = 5;
                  /*#########################
                  # closeModal
                  #########################*/
                  $scope.closeModal = function () {
                    // $uibModalInstance.dismiss('cancel');
                    $uibModalInstance.close();
                  };
                  $scope.newRegistro = function () {
                    $scope.value = ($scope.value) ? $scope.value : 5;
                    if($scope.value) {
                    // if($scope.value || $scope.mTipoRegistro) {
                      $uibModalInstance.close();
                      // $state.go('nuevoRegistro', {reload: true, inherit: false});
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

      vm.panelActv = 0;

      function goToReport() {
        pericialFactory.general.stateGo('reportes');
      }

      function goToServices() {
        $state.go('bandejaServicios', {type: 0}, {reload: true, inherit: false});
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
                  flagSpare: (mIniRepac) ? mIniRepac : 'N',
                  flagStock: (mRepuestoPend) ? mRepuestoPend : 'N',
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
                idSinisterDetail: item.idSinisterDetail
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
                }

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
            vm.siniestrosPpal[index].pointColor = 'gperColorVerde';
            break;
          case 7:// rechazado
            vm.siniestrosPpal[index].pointColor = 'gperColorRojo';
            break;
          default:// en evaluacion
            vm.siniestrosPpal[index].pointColor = 'gperColorAmarillo';
            break;
        }
        return true;
      }

      function setColorLabelBandeja(item, index) {
        switch (item.idSinisterState) {
          case 1: // ingresado al taller
            vm.siniestrosPpal[index].labelColor = 'gperFondoVerde';
            break;
          case 2: // presupuestado
            vm.siniestrosPpal[index].labelColor = 'gperFondoNaranja';
            break;
          case 3: // peritado
            vm.siniestrosPpal[index].labelColor = 'gperFondoVerde';
            break;
          case 4: // en reparación
            vm.siniestrosPpal[index].labelColor = 'gperFondoAmarillo';
            break;
          case 5: // en espera de respuestos
            vm.siniestrosPpal[index].labelColor = 'gperFondoGris'; //pendientes
            break;
          case 6: // listo para entrega
            vm.siniestrosPpal[index].labelColor = 'gperFondoVerde';
            break;
          // case 7: // veh. sin recoger
          //   vm.siniestrosPpal[index].labelColor = 'gperFondoRojo';
          //   break;
          case 7: // entregado
            vm.siniestrosPpal[index].labelColor = 'gperFondoGris';
            break;
          case 8: // por regularizar
            vm.siniestrosPpal[index].labelColor = 'gperFondoAmarillo';
            break;
          case 9: // ANULADO
            vm.siniestrosPpal[index].labelColor = 'gperFondoRojo';
            break;
          default:
            vm.siniestrosPpal[index].labelColor = 'gperFondorGris';//pendientes
            break;
        }
        return true;
      }

      function setButtonNewSiniester() {
        vm.showButtonNewSiniester = isTaller();
      }

      function getLabelBandeja(item, index) {
        setPointColorBandeja(item, index);
        setColorLabelBandeja(item, index);
        setButtonNewSiniester();

        item.idRegisterType = parseInt(item.idRegisterType);

        if (isSupervisor()) {
          vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE';
          if (item.totalLoss) {
            vm.siniestroRegistrado = (item.totalLoss.flagTotalLossLetterEvaluation === 'S') ? true : false;
            if (!item.totalLoss.flagTotalLossLetterEvaluation) {
              vm.siniestrosPpal[index].labelBandeja = 'EVALUAR PÉRDIDA';
            }
          }
        } else {
          switch (item.idSinisterState) {
          case 1:
            if (item.idRegisterType === 7) {
              if (item.totalLoss) {
                vm.siniestroRegistrado = (item.totalLoss.flagConfirmTotalLost) ? true : false;

                if ((item.totalLoss.flagConfirmTotalLost === 'N') && isTaller()) {
                  vm.siniestroRegistrado = false;
                }
              }
              (isTaller()) ? ((vm.siniestroRegistrado) ? vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE' : vm.siniestrosPpal[index].labelBandeja = 'ADJUNTAR CARTA Y DAÑOS') : (isPerito()) ? vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE' : vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE';

              if ((!item.totalLoss.flagConfirmTotalLost) && (!item.totalLoss.flagTotalLossLetterEvaluation)) {
                vm.siniestrosPpal[index].labelBandeja = 'ADJUNTAR CARTA Y DAÑOS';
              } else if (item.totalLoss.flagConfirmTotalLost === 'N') {
                vm.siniestrosPpal[index].labelBandeja = 'CARGAR PRESUPUESTO';
              } else {
                vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE';
              }

            } else {
              (isTaller()) ? ((item.flagTotalLoss === 'S') ? vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE' : vm.siniestrosPpal[index].labelBandeja = 'CARGAR PRESUPUESTO') : (isPerito()) ? vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE' : vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE';
            }
            break;
          case 2:
            (isTaller()) ? (vm.siniestrosPpal[index].proficient.flagRequestInformation === 'S' ?  vm.siniestrosPpal[index].labelBandeja = 'ACTUALIZAR SINIESTRO' : vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE') : (isPerito()) ? vm.siniestrosPpal[index].labelBandeja = 'PERITAR' : vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE';
            break;
          case 3:
            (isTaller()) ? ((item.proficient.flagTotalLossByBudget === 'S') ? vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE' : (item.idExecutiveState === 6) ? vm.siniestrosPpal[index].labelBandeja = 'INICIAR REPARACIÓN' : vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE') : (isPerito()) ? vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE' : vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE';
            break;
          case 4:
            (isTaller()) ? vm.siniestrosPpal[index].labelBandeja = 'ACTUALIZAR ESTADO' : (isPerito()) ? vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE' : vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE';
            break;
          case 5:
            (isTaller()) ? vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE' : (isPerito()) ? vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE' : vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE';
            break;
          case 6:
            (isTaller()) ? vm.siniestrosPpal[index].labelBandeja = 'ENTREGAR VEHÍCULO' : (isPerito()) ? vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE' : vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE';
            break;
          // case 7:
          //   (isTaller()) ? vm.siniestrosPpal[index].labelBandeja = 'ENTREGAR VEHÍCULO' : (isPerito()) ? vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE' : vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE';
          //   break;
          case 7:
            (isTaller()) ? ((item.flagSparePending === 'S') ? vm.siniestrosPpal[index].labelBandeja = 'ENTREGAR REPUESTOS' : vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE') : (isPerito()) ? vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE' : vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE';
            break;
          case 8:
            (isTaller()) ? vm.siniestrosPpal[index].labelBandeja = vm.siniestrosPpal[index].labelBandeja = 'ENTREGAR VEHÍCULO' : (isPerito()) ? vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE' : vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE';
            break;
          default:
            vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE';
            break;
        }
        }

        // if(item.idRegisterType === 5   && (item.idExecutiveState !== 6 && item.idExecutiveState !== 7) ) {// en evaluacion)
        //   vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE';
        // }

        // si hay ampliación se muestra un tag adicional
        if(item.version > 1){
          vm.versionSiniester = item.version - 1;
          vm.siniestrosPpal[index].labelNumberAmpliation = 'AMPLIACIÓN ' + vm.versionSiniester;
        }

        //CUANDO ES PT Y NO ESTA EN EVALUACION EL BOTON ES VER DETALLE
        if(item.idRegisterType === 7   && (item.idExecutiveState === 6 || item.idExecutiveState === 7) ) {// en evaluacion)
          if (isTaller() && !item.totalLoss.flagConfirmTotalLost) {
            vm.siniestrosPpal[index].labelBandeja = 'ADJUNTAR CARTA Y DAÑOS';
          } else if (isPerito()){
            vm.siniestrosPpal[index].labelBandeja = 'VER DETALLE';
          }
        }

        return true;
      }

      function isTaller() {
        return (vm.rol === 'TALLER');
      }

      function isPerito() {
        return (vm.rol === 'PERITO');
      }

      function verTipoSiniestro(id, idExecutiveState) {
        $state.go('bandejaServicios', {type: id, executive: idExecutiveState}, {reload: true, inherit: false});
      }

      function setDate(fecha) {
        vm.fechaDashboard = vm.monthNames[fecha.getMonth()] + ' ' + fecha.getFullYear();
        vm.myDate = fecha;
      }

      function prevDate() {
        vm.previousMonth = new Date(vm.myDate);
        vm.previousMonth.setMonth(vm.myDate.getMonth()-1);
        setDate(vm.previousMonth);
      }

      function nextDate() {
        vm.nextMonth = new Date(vm.myDate);
        vm.nextMonth.setMonth(vm.myDate.getMonth()+1);
        setDate(vm.nextMonth);
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
            }
          };
          pericialFactory.general.postData('api/sinister/proficient/cancel', params).then(function (response) {
            if (response.operationCode === 200 || response.status === 200) {
              var extraMsg = !response.message ? '' : '<br> <b>' + response.message + '</b>'
              mModalAlert.showSuccess('Orden de servicio anulada exitosamente. ' + extraMsg, '')
              $state.go('bandejaServicios', { reload: true, inherit: false });
            } else {
              mModalAlert.showError("Error en la anulación", 'Error');
              $state.go('bandejaServicios', { reload: true, inherit: false });
            }
          }).catch(function (err) {
            mModalAlert.showError("Error en la anulación", 'Error');
            $state.go('bandejaServicios', { reload: true, inherit: false });
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
                  $scope.mShowErrorFalse = true;
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
                      $state.go('bandejaServicios', { reload: true, inherit: false });
                    } else {
                      mModalAlert.showError("Error en el envio de correo.", 'Error');
                      $state.go('bandejaServicios', { reload: true, inherit: false });
                    }
                  }).catch(function (err) {
                    mModalAlert.showError("Error en el envio de correo.", 'Error');
                    $state.go('bandejaServicios', { reload: true, inherit: false });
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
                      $state.go('bandejaServicios', { reload: true, inherit: false });
                    } else {
                      mModalAlert.showError("Error al confirmar la orden de servicio.", 'Error');
                      $state.go('bandejaServicios', { reload: true, inherit: false });
                    }
                  }).catch(function (err) {
                    mModalAlert.showError("Error al confirmar la orden de servicio.", 'Error');
                    $state.go('bandejaServicios', { reload: true, inherit: false });
                  });
                }
  
  
              }
            }]
        });
        vModalProof.result.then(function () {
        }, function () {
        });
        
  
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
              } else if (item.totalLoss.flagConfirmTotalLost === 'N') {
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
                        pericialFactory.general.goTo('servicioPresupuestadoAsign', item, tab);
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
              // (isTaller()) ? ((item.proficient.flagTotalLossByBudget && item.idExecutiveState !== 6) ? pericialFactory.general.goTo('servicioPeritado', item, tab) : fnShowModalIniReparacion(item)) : pericialFactory.general.goTo('servicioPeritado', item, tab);
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

      function open1() {
        vm.popup1.opened = true;
      }

      function open2() {
        vm.popup2.opened = true;
      }

      function isSupervisor() {
        return (vm.rol === 'SUPERVISOR');
      }

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

      vm.isSupervisor = isSupervisor;
      vm.updateIndicators = updateIndicators;
      vm.updateGraphs = updateGraphs;
      vm.updateList = updateList;
      vm.open1 = open1;
      vm.open2 = open2;
      vm.goToReport = goToReport;
      vm.goToServices = goToServices;
      vm.getLabelBandeja = getLabelBandeja;
      vm.isTaller = isTaller;
      vm.isPerito = isPerito;
      vm.verTipoSiniestro = verTipoSiniestro;
      vm.prevDate = prevDate;
      vm.nextDate = nextDate;
      vm.setButtonNewSiniester = setButtonNewSiniester;
      vm.goTo = goTo;
      vm.goToConfirmClient = goToConfirmClient;
      vm.goToAnular = goToAnular;
      vm.fnContinuarAnular = ContinuarAnular;
      vm.$onDestroy = function() {
        pericialFactory.general.monitor(vm.siniestros, $scope).stop();
      };
  } // end

  return angular.module('appPericial')
    .controller('DashboardController', DashboardController)
    .directive('panelSlider', function() {
        return {
          link: link,
          restrict: 'A',
          scope: {
            activePanel: '='
          }
        };

        function link(scope, element, attrs, ctrl) {
          // console.log('panel slider... ');
          var arrows = element[0].getElementsByClassName('slide-arrow');
          var panels = element[0].getElementsByClassName('slide-content');
          var panelsNum = panels.length;
          var active = parseInt(scope.activePanel);

         if (isNaN(active)){ active = 0; }

            panels[active].classList.add('show');
            panels[active].classList.add('active');

            angular.element(panels).bind('click', function () {
              angular.forEach(panels, function (v, k) {
                panels[k].classList.remove('show');
                panels[k].classList.remove('active');
              });
              this.classList.add('active');
              this.classList.add('show');
              active = Array.from(panels).indexOf(this);
              scope.activePanel = active;
            });

            angular.element(arrows[0]).bind('click', function () {
              angular.forEach(panels, function (v, k) {
                panels[k].classList.remove('show');
                panels[k].classList.remove('active');
              });
              if (active) {
                panels[active - 1].classList.add('show');
                panels[active - 1].classList.add('active');
                active = active - 1;
              } else {
                panels[0].classList.add('show');
                panels[0].classList.add('active');
                active = 0;
              }
            });

            angular.element(arrows[1]).bind('click', function () {
              angular.forEach(panels, function (v, k) {
                panels[k].classList.remove('show');
                panels[k].classList.remove('active');
              });
              if (active < panelsNum - 1) {
                panels[active + 1].classList.add('show');
                panels[active + 1].classList.add('active');
                active = active + 1;
              } else {
                panels[panelsNum - 1].classList.add('show')
                panels[panelsNum - 1].classList.add('active')
                active = panelsNum - 1;
              }
            });
         // }

        }
      })
});
