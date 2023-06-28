(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'helper', 'pericialFactory'],
  function(angular, constants, helper, pericialFactory){

    var appPericial = angular.module('appPericial');

    appPericial.controller('DashboardSupervisorController',
      ['$scope', '$window', '$state', '$timeout', 'mainServices', '$uibModal', 'mModalAlert', 'mModalConfirm', 'oimClaims', 'pericialFactory', 'proxyTron', 'localStorageService',
        function($scope, $window, $state, $timeout, mainServices, $uibModal, mModalAlert, mModalConfirm, oimClaims, pericialFactory, proxyTron, localStorageService){

          var vm = this;

          vm.$onInit = function() {

            vm.format = 'dd/MM/yyyy';
            vm.mConsultaDesde = new Date();
            vm.mConsultaDesde.setDate(vm.mConsultaDesde.getDate() - 7);
            vm.mConsultaHasta = new Date();

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
            //  minDate: new Date(),
              maxDate: new Date()
            };

            vm.menuPericial = [
              {label: 'Supervisor', objMXKey: '', state: 'dashboardSupervisor', isSubMenu: false, actived: false, show: true},
              {label: 'Servicios', objMXKey: '', state: 'bandejaServicios', isSubMenu: false, actived: false, show: true},
              {label: 'Reportes', objMXKey: '', state: 'reportes', isSubMenu: false, actived: false, show: true}
            ];

            pericialFactory.general.Resource_Tron_Proficien_List().then(function(response) {
              if (response.data.length > 0) {
                vm.peritoData = response.data;
              }
            })
              .catch(function(err){
                mModalAlert.showError(err.data.message, 'Error');
              });

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

            if (vm.menuPericial.length < 7) {
              vm.showMoreFlag = false;
              vm.limiteMenus = 6;
            } else {
              vm.showMoreFlag = true;
              vm.limiteMenus = 5;
            }
            vm.showBtnBox = false;

            vm.indexArray = -1;
            $scope.userName = oimClaims.userName;


            oimClaims.rolesCode.some(function(obj, i) {
              return obj.nombreAplicacion === "GPER" ? vm.indexArray = i : false;
            });

            if (vm.indexArray !== -1) {
              vm.rol = oimClaims.rolesCode[vm.indexArray].codigoRol;
            }

            if (vm.rol !== 'SUPERVISOR') {
              $state.go('dashboard', {type: 0}, {reload: true, inherit: false});
            }

            updateDashboardSup();

            //$scope.userName = oimClaims.userName;
          };

          function isSupervisor() {
            return (vm.rol === 'SUPERVISOR');
          }

          function open1() {
            vm.popup1.opened = true;
          }

          function open2() {
            vm.popup2.opened = true;
          }

          function updateDashboardSup() {

            // Chart 1
            vm.chart1 = {
              chartType : 'bar-horz',
              chartData : [],
              chartLabels : ['A tiempo', 'Retraso', 'Alerta'],
              chartColors : ['#02cc34','#ffcc00','#fb5c52'],
              chartOptions : {
                legend: { display: false, position: 'bottom' },
                scales: {
                  xAxes: [{
                    display: true,
                    ticks: { fontColor: '#4f4f4f', fontFamily: "'Roboto', sans-serif", fontSize: 10 }
                  }],
                  yAxes: [{
                    display: true,
                    ticks: { fontColor: '#4f4f4f', fontFamily: "'Roboto', sans-serif", fontSize: 10 }
                  }]
                }
              }
            };

            // Chart 2
            vm.chart2 = {
              chartType : 'doughnut',
              chartData : [],
              chartLabels : ['A tiempo', 'Retraso', 'Fuera de tiempo'],
              chartColors : ['#02cc34','#ffcc00','#fb5c52'],
              chartOptions : {
                cutoutPercentage: 20,
                legend: { display: false, position: 'bottom' },
                scales: {
                  yAxes: [{
                    ticks: {
                      max: 5,
                      min: 0,
                      stepSize: 0.5
                    }
                  }]
                }
              }
            };

            // Chart 3
            vm.chart3 = {
              chartType : 'bar',
              chartData : [],
              chartLabels : ['A tiempo', 'Retraso', 'Alerta'],
              chartColors : ['#02cc34','#ffcc00','#fb5c52'],
              chartOptions : {
                legend: { display: false, position: 'bottom' },
                scales: {
                  xAxes: [{
                    display: true,
                    ticks: { fontColor: '#4f4f4f', fontFamily: "'Roboto', sans-serif", fontSize: 10 }
                  }],
                  yAxes: [{
                    display: true,
                    ticks: { fontColor: '#4f4f4f', fontFamily: "'Roboto', sans-serif", fontSize: 10 }
                  }]
                }
              }
            };

            // Chart 4
            vm.chart4 = {
              chartType : 'polar',
              chartData : [],
              chartLabels : ['A tiempo', 'Retraso', 'Alerta'],
              chartColors : ['#02cc34','#ffcc00','#fb5c52'],
              chartOptions : {
                startAngle: -0.05 * Math.PI,
                scale: {
                  ticks: {
                    suggestedMin: 50,
                    suggestedMax: 100,
                    fontSize: 8
                  }
                },
                responsive: true,
                legend: { display: true, position: 'left' },
                elements: {
                  arc: {
                    borderColor: "#000000"
                  }
                },
                animation : {
                  animateRotate : false,
                  animateScale : false
                }
              }
            };

            // Chart 5
            vm.chart5 = {
              chartType : 'bar',
              chartData : [],
              chartLabels : ['1-7', '8-15', '16-más'],
              chartColors : ['#06ca8e','#05bde4','#f66b81'],
              chartOptions : {
                legend: { display: false, position: 'bottom' },
                scales: {
                  xAxes: [{
                    display: true,
                    ticks: { fontColor: '#4f4f4f', fontFamily: "'Roboto', sans-serif", fontSize: 10 }
                  }],
                  yAxes: [{
                    display: true,
                    ticks: { fontColor: '#4f4f4f', fontFamily: "'Roboto', sans-serif", fontSize: 10 }
                  }]
                }
              }
            };

            // Chart 6
            vm.chart6 = {
              chartType : 'bar',
              chartData : [],
              chartLabels : ['-2', '-1', '0', '+6'],
              chartColors : ['#06ca8e','#06ca8e','#05bde4','#f66b81','#f66b81'],
              chartOptions : {
                legend: { display: false, position: 'bottom' },
                scales: {
                  xAxes: [{
                    display: true,
                    ticks: { fontColor: '#4f4f4f', fontFamily: "'Roboto', sans-serif", fontSize: 10 }
                  }],
                  yAxes: [{
                    display: true,
                    ticks: { fontColor: '#4f4f4f', fontFamily: "'Roboto', sans-serif", fontSize: 10 }
                  }]
                }
              }
            };

            // Chart 7
            vm.chart7 = {
              chartType : 'bar-horz',
              chartData : [],
              chartLabels : ['1-7', '8-15', '16 a más'],
              chartColors : ['#02cc34','#ffcc00','#fb5c52'],
              chartOptions : {
                legend: { display: false, position: 'bottom' },
                scales: {
                  xAxes: [{
                    display: true,
                    ticks: { fontColor: '#4f4f4f', fontFamily: "'Roboto', sans-serif", fontSize: 10 }
                  }],
                  yAxes: [{
                    display: true,
                    ticks: { fontColor: '#4f4f4f', fontFamily: "'Roboto', sans-serif", fontSize: 10 }
                  }]
                }
              }
            };

            // Chart 8
            vm.chart8 = {
              chartType : 'doughnut',
              chartData : [],
              chartLabels : ['Recogidos', 'Por recoger'],
              chartColors : ['#05bde4','#f4f4f4'],
              chartOptions : {
                legend: { display: true, position: 'bottom' },
              }
            };

            //Resource_Dashboard_Supervisor
            vm.paramsG1 = {
              idWorkshop: (vm.mTaller && vm.mTaller.idThird) ? vm.mTaller.idThird : 0,
              idProficient: (vm.mPerito && vm.mPerito.idThird) ? vm.mPerito.idThird : 0,
              startDate: (vm.mConsultaDesde) ? pericialFactory.general.formatearFecha(vm.mConsultaDesde) : pericialFactory.general.formatearFecha(new Date()),
              endDate: (vm.mConsultaHasta) ? pericialFactory.general.formatearFecha(vm.mConsultaHasta) : pericialFactory.general.formatearFecha(new Date())
            };

            pericialFactory.general.monitor(function() {
              return pericialFactory.dashboard.Resource_Dashboard_Supervisor(vm.paramsG1);
            }, $scope)
              .begin()
              .then(
                function(response) {
                  if (response.data.length > 0) {
                    $timeout(function() {
                      vm.grafico1 = response.data[0];
                      vm.chart1.chartData = [];
                      vm.chart1.chartData.push(vm.grafico1.inTimeRow);
                      vm.chart1.chartData.push(vm.grafico1.delayedRow);
                      vm.chart1.chartData.push(vm.grafico1.veryDelayedRow);


                      vm.sinPresupuestarData = {
                        labels: vm.chart1.chartLabels,
                        datasets: [{
                          label: 'Dataset 1',
                          //   {
                          //   display: false
                          // },
                          backgroundColor: ['#02cc34','#ffcc00','#fb5c52'],
                          data: [vm.grafico1.inTimeRow, vm.grafico1.delayedRow,vm.grafico1.veryDelayedRow]
                        }]

                      };

                      vm.sinPresupuestar = document.getElementById("sinPresupuestar");

                      vm.sinPresupuestarChart = new Chart(vm.sinPresupuestar, {
                        type: 'horizontalBar',
                        data: vm.sinPresupuestarData,
                        options: {
                          // Elements options apply to all of the options unless overridden in a dataset
                          // In this case, we are setting the border of each horizontal bar to be 2px wide
                          elements: {
                            rectangle: {
                              borderWidth: 1
                            }
                          },
                          responsive: true,
                          legend: {
                            display: false
                          },
                          scales: {
                            xAxes: [{
                              ticks: {
                                beginAtZero: true,
                                callback: function(value) {if (value % 1 === 0) {return value;}}
                              }
                            }]
                          },
                          title: {
                            display: false
                          }
                        }
                      });

                      vm.grafico2 = response.data[1];
                      vm.chart2.chartData = [];
                      vm.chart2.chartData.push(vm.grafico2.inTimeRow);
                      vm.chart2.chartData.push(vm.grafico2.delayedRow);
                      vm.chart2.chartData.push(vm.grafico2.veryDelayedRow);

                      vm.sinPeritarData = {
                        datasets: [{
                          data: [vm.grafico2.inTimeRow, vm.grafico2.delayedRow, vm.grafico2.veryDelayedRow],
                          backgroundColor: ['#02cc34','#ffcc00','#fb5c52'],
                          borderWidth: [0,0,0],
                          label: 'Dataset 1'
                        }],
                        labels: {
                          display: false
                        }
                      };

                      vm.sinPeritar = document.getElementById("sinPeritar");

                      vm.sinPeritarChart = new Chart(vm.sinPeritar, {
                        type: 'doughnut',
                        data: vm.sinPeritarData,
                        options: {
                          responsive: true,
                          legend: {
                            position: 'top'
                          },
                          title: {
                            display: false
                          },
                          animation: {
                            animateScale: true,
                            animateRotate: true
                          }
                        }
                      });

                      vm.grafico3 = response.data[2];
                      vm.chart3.chartData = [];
                      vm.chart3.chartData.push(vm.grafico3.inTimeRow);
                      vm.chart3.chartData.push(vm.grafico3.delayedRow);
                      vm.chart3.chartData.push(vm.grafico3.veryDelayedRow);

                      vm.sinAutorizarData = {
                        labels: ['A tiempo', 'Retraso', 'Alerta'],
                        datasets: [{
                          backgroundColor: ['#02cc34','#ffcc00','#fb5c52'],
                          data: [vm.grafico3.inTimeRow, vm.grafico3.delayedRow,vm.grafico3.veryDelayedRow]
                        }]
                      };

                      vm.sinAutorizar = document.getElementById("sinAutorizar");

                      vm.sinAutorizarChart = new Chart(vm.sinAutorizar, {
                        type: 'bar',
                        data: vm.sinAutorizarData,
                        options: {
                          responsive: true,
                          legend: {
                            display: false
                          },
                          scales: {
                            yAxes: [{
                              ticks: {
                                beginAtZero: true,
                                callback: function(value) {if (value % 1 === 0) {return value;}}
                              }
                            }]
                          },
                          title: {
                            display: false
                          }
                        }
                      });

                      vm.grafico4 = response.data[3];
                      vm.chart4.chartData = [];
                      vm.chart4.chartData.push(vm.grafico4.inTimeRow);
                      vm.chart4.chartData.push(vm.grafico4.delayedRow);
                      vm.chart4.chartData.push(vm.grafico4.veryDelayedRow);

                      vm.peritadosOkData = {
                        data : {
                          datasets: [{
                            data: [
                              vm.grafico4.inTimeRow,
                              vm.grafico4.delayedRow,
                              vm.grafico4.veryDelayedRow
                            ],
                            // data: [
                            //   10,
                            //   20,
                            //   30
                            // ],
                            backgroundColor: ['rgba(2,204,52,0.5)','rgba(251,92,82,0.5)','rgba(255,204,0,0.5)'],
                            borderWidth: [0,0,0],
                            label: 'My dataset' // for legend
                          }],
                          labels: [
                            'Red',
                            'Orange',
                            'Yellow'
                          ]
                        },
                        options: {
                          responsive: true,
                          layout: {
                            padding: {
                              left: 0,
                              right: 0,
                              top: 5,
                              bottom: 5
                            }
                          },
                          legend: {
                            display: false
                          },
                          title: {
                            display: false
                          },
                          scale: {
                            ticks: {
                              beginAtZero: true,
                              min: 0,
                              stepSize: 1
                            },
                            reverse: false
                          },
                          animation: {
                            animateRotate: false,
                            animateScale: true
                          }
                        }
                      };

                      vm.peritadosOk = document.getElementById("peritadosOk");

                      // vm.peritadosOkChart =
                      window.myPolarArea = Chart.PolarArea(vm.peritadosOk, vm.peritadosOkData);

                      vm.grafico5 = response.data[4];
                      vm.chart5.chartData = [];
                      vm.chart5.chartData.push(vm.grafico5.inTimeRow);
                      vm.chart5.chartData.push(vm.grafico5.delayedRow);
                      vm.chart5.chartData.push(vm.grafico5.veryDelayedRow);



                      vm.enReparacionData = {
                        labels: ['A tiempo', 'Retraso', 'Alerta'],
                        datasets: [{
                          backgroundColor: ['#06ca8e','#05bde4','#fb5c52'],
                          data: [vm.grafico5.inTimeRow, vm.grafico5.delayedRow,vm.grafico5.veryDelayedRow]
                         }]
                      };

                      vm.enReparacion = document.getElementById("enReparacion");

                      vm.sinAutorizarChart = new Chart(vm.enReparacion, {
                        type: 'bar',
                        data: vm.enReparacionData,
                        options: {
                          responsive: true,
                          legend: {
                            display: false
                          },
                          scales: {
                            yAxes: [{
                              ticks: {
                                beginAtZero: true,
                                callback: function(value) {if (value % 1 === 0) {return value;}}
                              }
                            }]
                          },
                          title: {
                            display: false
                          }
                        }
                      });



                      vm.grafico6 = response.data[5];
                      vm.chart6.chartData = [];
                      vm.chart6.chartData.push(vm.grafico6.inTimeRow);
                      vm.chart6.chartData.push(vm.grafico6.delayedRow);
                      vm.chart6.chartData.push(vm.grafico6.veryDelayedRow);

                      vm.fueraTiempoData = {
                        labels: ['A tiempo', 'Retraso', 'Alerta'],
                        datasets: [{
                          label: 'Dataset 1',
                          backgroundColor: ['#06ca8e','#05bde4','#f66b81'],
                          data: [vm.grafico6.inTimeRow, vm.grafico6.delayedRow,vm.grafico6.veryDelayedRow]
                        }]
                      };

                      vm.fueraTiempo = document.getElementById("fueraTiempo");

                      vm.fueraTiempoChart = new Chart(vm.fueraTiempo, {
                        type: 'horizontalBar',
                        data: vm.fueraTiempoData,
                        options: {
                          elements: {
                            rectangle: {
                              borderWidth: 1
                            }
                          },
                          responsive: true,
                          legend: {
                            display: false
                          },
                          scales: {
                            xAxes: [{
                              ticks: {
                                beginAtZero: true,
                                callback: function(value) {if (value % 1 === 0) {return value;}}
                              }
                            }]
                          },
                          title: {
                            display: false
                          }
                        }
                      });



                      vm.grafico7 = response.data[6];
                      vm.chart7.chartData = [];
                      vm.chart7.chartData.push(vm.grafico7.inTimeRow);
                      vm.chart7.chartData.push(vm.grafico7.delayedRow);
                      vm.chart7.chartData.push(vm.grafico7.veryDelayedRow);


                      vm.pendientesDeRepararData = {
                        labels: ['1-7', '9-15', '16 a más'],
                        datasets: [{
                          backgroundColor: ['#02cc34','#ffcc00','#fb5c52'],
                          data: [vm.grafico7.inTimeRow, vm.grafico7.delayedRow,vm.grafico7.veryDelayedRow]
                        }]
                      };

                      vm.pendientesDeReparar = document.getElementById("pendientesDeReparar");

                      vm.pendientesDeRepararChart = new Chart(vm.pendientesDeReparar, {
                        type: 'bar',
                        data: vm.pendientesDeRepararData,
                        options: {
                          responsive: true,
                          legend: {
                            display: false
                          },
                          scales: {
                            yAxes: [{
                              ticks: {
                                beginAtZero: true,
                                callback: function(value) {if (value % 1 === 0) {return value;}}
                              }
                            }]
                          },
                          title: {
                            display: false
                          }
                        }
                      });

                      vm.grafico8 = response.data[7];
                      // vm.chart8.chartData = [5124, 2131];
                      vm.chart8.chartData = [];
                      vm.chart8.chartData.push(vm.grafico8.inTimeRow);
                      vm.chart8.chartData.push(vm.grafico8.delayedRow);
                      // vm.chart8.chartData.push(vm.grafico8.veryDelayedRow);

                      vm.entregadosData = {
                        datasets: [{
                          data: [vm.grafico8.inTimeRow, vm.grafico8.delayedRow],
                          backgroundColor: ['#05bde4','#f4f4f4'],
                          borderWidth: [0,0],
                          label: 'Dataset 1'
                        }],
                        labels: {
                          display: false
                        }
                      };

                      vm.entregados = document.getElementById("entregados");

                      vm.entregadosChart = new Chart(vm.entregados, {
                        type: 'doughnut',
                        data: vm.entregadosData,
                        options: {
                          responsive: true,
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: false
                          },
                          animation: {
                            animateScale: true,
                            animateRotate: true
                          }
                        }
                      });
                    }, 200);
                  }

                },
                function(response) {
                  console.error(response);
                }
              );
          }

          //Resource_Dashboard_Supervisor
          function verTipoSiniestro(id, idExecutiveState) {
            vm.paramsList = {};
            vm.paramsList.dateStart = (vm.mConsultaDesde) ? pericialFactory.general.formatearFecha(vm.mConsultaDesde) : pericialFactory.general.formatearFecha(new Date());//"20/06/2018",//
            vm.paramsList.dateEnd = (vm.mConsultaHasta) ? pericialFactory.general.formatearFecha(vm.mConsultaHasta) : pericialFactory.general.formatearFecha(new Date());
            localStorageService.set('fechas', vm.paramsList);

            var value = localStorageService.get('fechas');
            vm.paramsList = {};
            if (!value) {
              vm.paramsList.dateStart = (vm.mConsultaDesde) ? pericialFactory.general.formatearFecha(vm.mConsultaDesde) : pericialFactory.general.formatearFecha(new Date());//"20/06/2018",//
              vm.paramsList.dateEnd = (vm.mConsultaHasta) ? pericialFactory.general.formatearFecha(vm.mConsultaHasta) : pericialFactory.general.formatearFecha(new Date());
              localStorageService.set('fechas', vm.paramsList);
            } else {
              vm.formData = value;
              vm.paramsList.dateStart = (vm.formData.dateStart) ? pericialFactory.general.formatearFecha(vm.formData.dateStart) : pericialFactory.general.formatearFecha(new Date());//"20/06/2018",//
              vm.paramsList.dateEnd = (vm.formData.dateEnd) ? pericialFactory.general.formatearFecha(vm.formData.dateEnd) : pericialFactory.general.formatearFecha(new Date());
            }
            $state.go('bandejaServicios', {type: id, executive: idExecutiveState}, {reload: true, inherit: false});
          }

          vm.verTipoSiniestro = verTipoSiniestro;
          vm.updateDashboardSup = updateDashboardSup;
          vm.open1 = open1;
          vm.open2 = open2;

          vm.$onDestroy = function() {
            pericialFactory.general.monitor(vm.siniestros, $scope).stop();
          };

        }])
  });
