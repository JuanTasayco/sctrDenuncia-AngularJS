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

      vm.totalItems = 0;
      vm.totalPages = 0;
      vm.noResult = true;
      vm.pageSize = 10;
      vm.listArray = [];

      vm.get_TipoPersona = get_TipoPersona;
      vm.getTipoEstado = getTipoEstado;
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
      vm.checkAll = checkAll;
      vm.updateListArray = updateListArray;
      vm.pageChanged = pageChanged;
      vm.productChecked = productChecked;
      vm.fnShowAlert1 = eventSuccess;

      vm.paramsListProduct = {
        nombreProducto: (vm.mBuscarProducto) ? vm.mBuscarProducto.toUpperCase() : '',
        cantidadFilasPorPagina: 10,
        paginaActual: 1
      };

      vm.$onInit = function () {
        if ($stateParams.compania && $stateParams.modalidad && $stateParams.codigoProducto && $stateParams.codigoSubProducto && $stateParams.codigoPlan) {
          // Code here...
          vm.oneAtATime = true;
          vm.status = {
            acordion : {
              open1: true,
              open2: false
            },
            isCustomHeaderOpen: false,
            isFirstOpen: true,
            isFirstDisabled: false
          };

          //tipo Persona
          vm.get_TipoPersona();
          //tipo plan
          vm.getTipoEstado();
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

      function getTipoEstado() {
        saludFactory.ListarPlanEstadoClinicaFigital().then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            vm.HabilitarData = response.Data;
          } else {
            mModalAlert.showError(response.Message, 'Error');
          }
        }).catch(function (err) {
          mModalAlert.showError(err.data.message, 'Error');
        });
      }

      function getTipoFraccionamiento() {
        saludFactory.ListaFinanciamientoTronClinicaFigital($stateParams.compania, $stateParams.modalidad, $stateParams.codigoProducto, $stateParams.codigoSubProducto, $stateParams.codigoPlan).then(function (response) {
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
        saludFactory.ObtennerPlanClinicaFigital($stateParams.compania, $stateParams.modalidad, $stateParams.codigoProducto, $stateParams.codigoSubProducto, $stateParams.codigoPlan).then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            vm.planDetail = response.Data;
            vm.planDetail.NombrePlanComercial = vm.planDetail.NombrePlanComercial ? vm.planDetail.NombrePlanComercial : "";
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
        vm.paramsFile = 'CodigoRamo=' + vm.planDetail.CodigoRamo + '&CodigoModalidad=' + vm.planDetail.CodigoModalidad + '&numeroContrato=' + vm.planDetail.NumeroContrato + '&numeroSubContrato=' + vm.planDetail.NumeroSubContrato +'&CodigoProducto='+ vm.planDetail.CodigoProducto +'&CodigoSubProducto='+ vm.planDetail.CodigoSubProducto +'&CodigoPlan=' + vm.planDetail.CodigoPlan;
        mpSpin.start();
        $http.get(constants.system.api.endpoints.policy + 'api/clinicaDigital/mantenimiento/plan/condicionado?' + vm.paramsFile, undefined, { responseType: "arraybuffer" }).success(
          function(res, status, headers) {
              mainServices.fnDownloadFileBase64(res.Data.Archivo, 'pdf', res.Data.Nombre, false);
              mpSpin.end();
          },
          function(data, status) {
            mpSpin.end();
            mModalAlert.showError("Error al descargar el documento", 'ERROR');
          });
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
        if (vm.planDetail.NombrePlanComercial && !vm.fmSubirDocumento) {
          vm.loadFile = true;
          changeNombreComercial();
          
        } else if (vm.fmSubirDocumento) {
          vm.loadFile = true;
          ChangeFile();
          
        }else{
          vm.loadFile = false;
        }
      }

      function changeNombreComercial(){
        saludFactory.ActualizaPlanEstadoClinicaFigital([vm.planDetail]).then(function(response) {
          if (response.OperationCode === constants.operationCode.success) {           
              mModalAlert.showSuccess('Nombre comercial guardado con éxito', '').then(function () {
                $state.reload();
              });            
          } else {
            mModalAlert.showError(response.Message, 'Error');
          }
        }).catch(function(err){
          mModalAlert.showError(err.data.message, 'Error');
        });
      }
      function ChangeFile(){
          var fd = new FormData();
          fd.append("CodigoRamo", JSON.stringify(parseInt(vm.planDetail.CodigoRamo)));
          fd.append("NumeroContrato", JSON.stringify(parseInt(vm.planDetail.NumeroContrato)));
          fd.append("NumeroSubContrato", JSON.stringify(parseInt(vm.planDetail.NumeroSubContrato)));
          fd.append("NombrePlan", vm.planDetail.NombrePlanComercial ? vm.planDetail.NombrePlanComercial : vm.planDetail.NombrePlan);
          fd.append("CodigoPlan", JSON.stringify(parseInt(vm.planDetail.CodigoPlan)));
          fd.append("CodigoProducto", JSON.stringify(parseInt(vm.planDetail.CodigoProducto)));
          fd.append("CodigoSubProducto", JSON.stringify(parseInt(vm.planDetail.CodigoSubProducto)));
          fd.append("CodigoModalidad", JSON.stringify(parseInt(vm.planDetail.CodigoModalidad)));
          fd.append("file", vm.fmSubirDocumento[0]);
          $http.post(constants.system.api.endpoints.policy + 'api/clinicaDigital/mantenimiento/plan/condicionado', fd, {
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
              } else {
                mModalAlert.showSuccess('Archivo cargado con éxito', '').then(function () {
                  $state.reload();
                });
              }
            })
            .catch(function (err) {
              mModalAlert.showError(err.data.Message, 'Error');
              mpSpin.end();
            });        
      }

      function deleteFile(index, array, type) {
        vm.fmSubirDocumento = undefined;
        vm.loadFile = false;

      }
      function pageChanged(event) {
        vm.paramsListProduct.paginaActual = event;
        vm.listArray = [];
        vm.selectedAll = false;
        vm.checkAll(false);
        vm.buscarProducto();
      }

      function updateListArray(index, idItem, producto) {
        if(producto.mEstado) {
          producto.idProduct = index;
          vm.productChecked(producto.mEstado);
          vm.listArray.push(producto);
        } else {
          vm.indexArray = vm.listArray.indexOf(producto.idProduct);
          vm.selectedAll = false;
          if (vm.indexArray !== -1) {
            vm.listArray.splice(vm.indexArray, 1);
          }
        }
      }

      function checkAll (value) {
        vm.productChecked(value);
        var xval = value;
        angular.forEach(vm.tipoFraccionamientoArray, function (val, key) {
          val.mEstado = xval;
        });
  
        if(!xval) {
          vm.listArray = [];
        }
      }

      function productChecked(value) {
        return (value) ? vm.isProductChecked = true : vm.isProductChecked = false;
      }

      function eventSuccess() {

        vm.paramsUpdateEstadoProducto = vm.tipoFraccionamientoArray;
        angular.forEach(vm.paramsUpdateEstadoProducto, function (val, key) {
          if (val.mEstado) {
            val["CodigoEstadoFinanciamiento"] = vm.mHabilitar.Codigo;
          }
          val["NombreFinanciamientoComercial"] = val.NombreFinanciamientoComercial;
          val["CodigoFinanciamiento"] = val.CodigoFinanciamiento;
          val["CodigoCompania"] = vm.planDetail.CodigoCompania;
          val["CodigoRamo"] = vm.planDetail.CodigoRamo;
          val["CodigoModalidad"] = vm.planDetail.CodigoModalidad;
          val["NumeroContrato"] = vm.planDetail.NumeroContrato;
          val["NumeroSubContrato"] = vm.planDetail.NumeroSubContrato;
          val["CodigoProducto"] = vm.planDetail.CodigoProducto;
          val["CodigoSubProducto"] = vm.planDetail.CodigoSubProducto;
          val["CodigoPlan"] = vm.planDetail.CodigoPlan;
        
        });
  
        saludFactory.ActualizaFinanciamientoClinicaFigital(vm.paramsUpdateEstadoProducto).then(function(response) {
          if (response.OperationCode === constants.operationCode.success) {
            mModalAlert.showSuccess('Se aplicaron los cambios correspondientes a los financiamientos seleccionados', '').then(function () {
              $state.reload();
            });
          } else {
            mModalAlert.showError(response.Message, 'Error');
          }
        }).catch(function(err){
          mModalAlert.showError(err.data.message, 'Error');
        });
      }

    }
    return angular.module('appSalud')
      .controller('editarPlanController', editarPlanController)
  });
