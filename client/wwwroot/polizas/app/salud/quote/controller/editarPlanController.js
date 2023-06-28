'use strict';

define(['angular', 'lodash', 'constants', 'helper', 'saludFactory'], function(
  angular, _, constants, helper, saludFactory) {

  editarPlanController.$inject = [
    '$scope', '$window', '$state', '$timeout', 'mainServices', '$uibModal', 'mModalAlert', '$sce', 'saludFactory', '$stateParams', '$http', 'mpSpin'
  ];

    function editarPlanController($scope, $window, $state, $timeout, mainServices, $uibModal, mModalAlert, $sce, saludFactory, $stateParams, $http, mpSpin) {
      var vm = this;
      vm.tipoAfiliado = [];
      vm.fraccionamientoList = [];
      vm.format = 'dd/MM/yyyy';
      vm.loadFile = true;

      vm.get_TipoPersona = get_TipoPersona;
      vm.getTipoPlan = getTipoPlan;
      vm.getTipoFraccionamiento = getTipoFraccionamiento;
      vm.obtenerProductoGlobal = obtenerProductoGlobal;
      vm.toggleAccordion = toggleAccordion;
      vm.downloadPlan = downloadPlan;
      vm.addTipoAfiliado = addTipoAfiliado;
      vm.deleteTipoAfiliado = deleteTipoAfiliado;
      vm.addFraccionamiento = addFraccionamiento;
      vm.deleteFraccionamiento = deleteFraccionamiento;
      vm.uploadFile = uploadFile;
      vm.deleteFile = deleteFile;

      vm.$onInit = function () {
        if ($stateParams.ramo && $stateParams.modalidad && $stateParams.contrato && $stateParams.subContrato) {
          // Code here...
          vm.oneAtATime = true;
          vm.status = {
            acordion : {
              open1: false,
              open2: false,
              open3: false,
            },
            isCustomHeaderOpen: false,
            isFirstOpen: true,
            isFirstDisabled: false
          };

          //tipo Persona
          vm.get_TipoPersona();
          //tipo plan
          vm.getTipoPlan();
          // fraccionamiento
          vm.getTipoFraccionamiento();
          //get detail plan
          vm.obtenerProductoGlobal();
        }
      };

      function get_TipoPersona() {
        saludFactory.get_TipoPersona().then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            vm.tipoPersonaArray = response.Data;
          } else {
            mModalAlert.showError(response.Message, 'Error');
          }
        }).catch(function (err) {
          mModalAlert.showError(err.data.message, 'Error');
        });
      }

      function getTipoPlan() {
        saludFactory.getTipoPlan().then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            vm.tipoPlanArray = response.Data;
          } else {
            mModalAlert.showError(response.Message, 'Error');
          }
        }).catch(function (err) {
          mModalAlert.showError(err.data.message, 'Error');
        });
      }

      function getTipoFraccionamiento() {
        saludFactory.getTipoFraccionamiento().then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            vm.tipoFraccionamientoArray = response.Data;
          } else {
            mModalAlert.showError(response.Message, 'Error');
          }
        }).catch(function (err) {
          mModalAlert.showError(err.data.message, 'Error');
        });

      }

      function obtenerProductoGlobal() {
        saludFactory.obtenerProductoGlobal($stateParams.compania, $stateParams.ramo, $stateParams.contrato, $stateParams.subContrato).then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            vm.planDetail = response.Data;

            vm.planDetail.FechaValidezBkp = angular.copy(vm.planDetail.Archivo.FechaValidez);
            var dateParts = vm.planDetail.Archivo.FechaValidez.split("/");
            var dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]); // month is 0-based

            vm.planDetail.FechaValidez = dateObject;
            //obtenemos fraccionamiento
            vm.fraccionamientoList = response.Data.Financiamientos;

            //obtenemos listado de edades
            var afiliado = {};

            angular.forEach(response.Data.ValidaEdades, function (val, key) {

              var afiliado = {
                plan: {Codigo: val.CodigoTipoPlan},
                tipo: {Codigo: val.CodigoParentesco},
                edad: val.EdadMaxima
              };
              vm.tipoAfiliado.push(afiliado);
            });
          }
        }).catch(function (err) {
          mModalAlert.showError(err.data.message, 'Error');
        });
      }

      function toggleAccordion(property){
        _.forEach(vm.status.acordion, function(element, key){
          if(vm.status.acordion[key] == false){
            vm.status.acordion[key] = key == property ? true : false;
          }
          else{
            vm.status.acordion[key] = false;
          }
        })
      }

      function downloadPlan() {
        vm.paramsFile = $stateParams.ramo + '/' + $stateParams.modalidad + '/' + $stateParams.contrato + '/' + $stateParams.subContrato;
        vm.attachFilePlanURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/salud/descargar/archivoplan/' + vm.paramsFile);
        $timeout(function () {
          document.getElementById('frmAttachFilePlan').submit();
        }, 500);
      }

      function addTipoAfiliado(tipoPlan, tipoPersona, edad) {

        if (tipoPlan.Codigo && tipoPersona.Codigo && edad) {

          vm.paramsEdad = {
            codigoCompania: $stateParams.compania,
            codigoRamo: $stateParams.ramo,
            numeroContrato: $stateParams.contrato,
            numeroSubContrato: $stateParams.subContrato,
            codigoParentesco: tipoPersona.Codigo,
            edadMaxima: edad,
            codigoTipoPlan: tipoPlan.Codigo
          };

          var afiliado = {
            plan: tipoPlan,
            tipo: tipoPersona,
            edad: edad
          };

          saludFactory.insertarValidaEdadSalud(vm.paramsEdad).then(function (response) {
            if (response.OperationCode === constants.operationCode.success) {
              vm.tipoAfiliado.push(afiliado);
              vm.mTipoPlan = {Codigo: null, Descripcion: 'Seleccione'};
              vm.mTipoPersona = {Codigo: null, Descripcion: 'Seleccione'};
              vm.mEdad = '';
            } else {
              mModalAlert.showError(response.Message, 'Error');
            }
          }).catch(function (err) {
            mModalAlert.showError(err.data.message, 'Error');
          });
        }

      }

      function deleteTipoAfiliado(id) {

        vm.paramsEdad = {
          codigoCompania: $stateParams.compania,
          codigoRamo: $stateParams.ramo,
          numeroContrato: $stateParams.contrato,
          numeroSubContrato: $stateParams.subContrato,
          codigoParentesco: "TI",
          codigoTipoPlan: "N"
        };

        saludFactory.eliminarValidaEdadSalud(vm.paramsEdad).then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            vm.tipoAfiliado.splice(id, 1);
          } else {
            mModalAlert.showError(response.Message, 'Error');
          }
        }).catch(function (err) {
          mModalAlert.showError(err.data.message, 'Error');
        });
      }

      function addFraccionamiento(value) {

        if (value.Codigo) {

          vm.paramsFraccionamiento = {
            codigoCompania: $stateParams.compania,
            codigoRamo: $stateParams.ramo,
            numeroContrato: $stateParams.contrato,
            numeroSubContrato: $stateParams.subContrato,
            codigo: value.Codigo
          };
          saludFactory.insertarFraccionamientoSalud(vm.paramsFraccionamiento).then(function (response) {
            if (response.OperationCode === constants.operationCode.success) {
              vm.fraccionamientoList.push(value);
              vm.mFraccionamiento = {Codigo: null, Descripcion: 'Seleccione'};
            } else {
              mModalAlert.showError(response.Message, 'Error');
            }
          }).catch(function (err) {
            mModalAlert.showError(err.data.message, 'Error');
          });
        }
      }

      function deleteFraccionamiento(id, fraccionamiento) {
        if (fraccionamiento) {
          vm.paramsFraccionamiento = {
            codigoCompania: $stateParams.compania,
            codigoRamo: $stateParams.ramo,
            numeroContrato: $stateParams.contrato,
            numeroSubContrato: $stateParams.subContrato,
            codigo: fraccionamiento.Codigo
          };
          saludFactory.eliminarFraccionamientoSalud(vm.paramsFraccionamiento).then(function (response) {
            if (response.OperationCode === constants.operationCode.success) {
              vm.fraccionamientoList.splice(id, 1);
            } else {
              mModalAlert.showError(response.Message, 'Error');
            }
          }).catch(function (err) {
            mModalAlert.showError(err.data.message, 'Error');
          });
        }
      }

      function uploadFile() {
        if (vm.fmSubirDocumento && vm.planDetail.FechaValidez) {
          vm.loadFile = true;
          var fd = new FormData();
          fd.append("CodigoRamo", JSON.stringify(parseInt($stateParams.ramo)));
          fd.append("NumeroContrato", JSON.stringify(parseInt($stateParams.contrato)));
          fd.append("NumeroSubContrato", JSON.stringify(parseInt($stateParams.subContrato)));
          fd.append("FechaValidez", saludFactory.formatearFecha(vm.planDetail.FechaValidez));
          fd.append("CodigoModalidad", JSON.stringify(parseInt(vm.planDetail.CodigoModalidad)));
          fd.append("file", vm.fmSubirDocumento[0]);
          $http.post(constants.system.api.endpoints.policy + 'api/salud/archivoPlan', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined},
            eventHandlers: {
              progress: function (c) {
              }
            },
            uploadEventHandlers: {
              progress: function (e) {
                mpSpin.start();
              }
            }
          })
            .success(function (response) {
              mpSpin.end();
              if (response.operationCode === 500) {
                mModalAlert.showError(response.data, 'Error');
              }else if(response.operationCode == 900 || response.OperationCode == 900){
                mModalAlert.showError(response.Message, 'Error');
              }else {
                mModalAlert.showSuccess('Archivo cargado con éxito', '').then(function () {
                  $state.reload();
                });
              }
            })
            .catch(function (err) {
              mModalAlert.showError(err.data.Message, 'Error');
              mpSpin.end();
            });
        } else {
          vm.loadFile = false;
        }
      }

      function deleteFile(index, array, type) {
        vm.fmSubirDocumento = undefined;
        vm.loadFile = false;

      }
    }
    return angular.module('appSalud')
      .controller('editarPlanController', editarPlanController)
  });
