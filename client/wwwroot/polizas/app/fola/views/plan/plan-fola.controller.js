define(['angular', 'constants', 'constantsFola'], function (angular, constants, constantsFola) {
  'use strict';
  angular.module(constants.module.polizas.fola.moduleName).controller('planFolaController', PlanFolaController);

  PlanFolaController.$inject = [
    '$scope',
    '$state',
    '$uibModal',
    'mModalAlert',
    '$http',
    'mpSpin',
    'folaService',
    'folaFactory',
    'FileSaver'
  ];

  function PlanFolaController(
    $scope,
    $state,
    $uibModal,
    mModalAlert,
    $http,
    mpSpin,
    folaService,
    folaFactory,
    FileSaver
  ) {
    var vm = this;

    // Propiedades
    vm.totalItems = 0;
    vm.totalPages = 0;
    vm.noResult = true;
    vm.pageSize = 10;
    vm.listArray = [];
    vm.planes = [];
    vm.condicionado = {
      id: 0,
      nombre: ''
    };
    vm.paramsListPlanes = {
      cantidadFilas: 10,
      paginaActual: 1
    };
    vm.paramsPlanEstado = {
      id: 0,
      estado: 1
    };
    vm.paramsPlanEditar = {
      id: 0,
      estado: 1
    };
    vm.vFileName = '';
    vm.condicionadoGeneral = {};
    vm.loadFileCondicionadoGeneral = true;
    vm.isDownloadFileCondicionadoGeneral = false;
    vm.loadFileCondicionadoParticular = true;

    // Funciones
    vm.pageChanged = pageChanged;
    vm.fnShowModal = eventEdit;
    vm.uploadCondicionadoGeneral = UploadCondicionadoGeneral;
    vm.deleteCondicionadoGeneral = DeleteCondicionadoGeneral;
    vm.downloadCondicionadoGeneral = DownloadCondicionadoGeneral;
    $scope.cargarCondicionadoGeneral = cargarCondicionadoGeneral;
    vm.changeStatusPlan = ChangeStatusPlan;
    vm.validateIsDisabled = validateIsDisabled;
    vm.convertSubvencion = ConvertSubvencion;
    (function load_CotizadorFolaController() {
      _loadContratos();
      _loadPlanes();
    })();

    function _loadContratos() {
      if (vm.paramsListPlanes) {
        if (vm.paramsListPlanes.paginaActual === 1) {
          vm.totalItems = 0;
          vm.mPagination = 1;
        }
      }
      mpSpin.start();
      folaService
        .getPlanes(
          constants.module.polizas.fola.companyCode,
          constants.module.polizas.fola.codeRamo,
          vm.paramsListPlanes
        )
        .then(function (response) {
          if (response.codigo === 0) {            
            vm.listaContratos = response.data.contratos;
            vm.totalItems = response.data.cantidadTotalFinal;
            vm.totalPages = response.data.cantidadTotalPaginas;
            vm.condicionadoGeneral = response.data.condicionado;
            if (vm.condicionadoGeneral) {
              vm.isDownloadFileCondicionadoGeneral = true;
              vm.vFileName = vm.condicionadoGeneral.nombre;
            }
          } else {
            $state.go('errorInternoFola',{}, { reload: true, inherit: false });
            vm.totalItems = 0;
            vm.totalPages = 0;
            mModalAlert.showInfo(response.Message, 'Error');
          }
          mpSpin.end();
        })
        .catch(function (err) {
          vm.totalItems = 0;
          vm.totalPages = 0;
          mModalAlert.showWarning(folaFactory.showError(err, 'No se encontró información.'), 'ALERTA', null, 3000);
          mpSpin.end();
        });
    }
    function pageChanged(event) {
      vm.paramsListPlanes.paginaActual = event;
      _loadContratos();
    }
    function updateContratos(){
      _loadContratos();
      _loadPlanes();
    }
    function _loadPlanes() {
      folaService
        .getPlanesActivos(constants.module.polizas.fola.companyCode, constants.module.polizas.fola.codeRamo)
        .then(function (response) {
          vm.planes = response.data;
        })
        .catch(function (error) {
          $state.go('errorInternoFola',{}, { reload: true, inherit: false });
          console.log('Error en getPlanes: ' + error);
        });
    }
    function eventEdit(contrato) {
      var vModalProof = $uibModal.open({
        backdrop: 'static', // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        result: true,
        size: 'md',
        templateUrl: 'app/fola/components/popup/popupEditarPlan.html',
        controller: [
          '$scope',
          '$uibModalInstance',
          '$uibModal',
          '$timeout',
          function ($scope, $uibModalInstance, $uibModal, $timeout) {
            $scope.fmSubirCondicionadoParticular;
            $scope.formPlan = {};
            $scope.vFileNameParticular = '';
            $scope.isDownloadFileCondicionadoParticular = false;
            $scope.disabledButton = true;
            $scope.mContrato = contrato;
            $scope.mNumeroContrato = contrato.numeroContrato ? {Codigo: contrato.numeroContrato} : {Codigo: null};
            // console.log('lo que tiene el plan', contrato.plan);
            if (contrato.plan) {
              if (contrato.plan.condicionado) {
                $scope.vFileNameParticular = contrato.plan.condicionado;
                $scope.isDownloadFileCondicionadoParticular = true;
              }
            } else {
              $scope.mContrato.plan = {
                id: 0,
                nombre: undefined,
                subvencion: undefined,
                condicionado: undefined,
                estado: 1
              };
            }
            /*#########################
            # closeModal
            #########################*/
            $scope.closeModal = function () {
              $uibModalInstance.close();
              // $state.reload();
              updateContratos();
            };
            /*########################
            # saveModal
            ########################*/
            $scope.saveModal = function () {
              $scope.formPlan.markAsPristine();
              var isAdd = $scope.mContrato.plan.id ? false : true;
              var resultValidatePlan = _validatePlanEdit($scope.mContrato.plan, isAdd);
              if (resultValidatePlan.isPlanValidate) {
                if (isAdd) {
                  vm.paramsPlanEditar = {
                    contrato: $scope.mContrato.numeroContrato,
                    subcontrato: $scope.mContrato.numeroSubcontrato,
                    nombreComercial: $scope.mContrato.plan.nombre
                      ? $scope.mContrato.plan.nombre.trim().toUpperCase()
                      : '',
                    subvencion: parseFloat($scope.mContrato.plan.subvencion),
                    estado: 1
                  };
                  folaService
                    .addPlan(vm.paramsPlanEditar)
                    .then(function (response) {
                      if (response.codigo === 0) {
                        $scope.mContrato.plan.id = response.data;
                        if (
                          uploadCondicionadoParticular($scope.fmSubirCondicionadoParticular, $scope.mContrato.plan.id)
                        ) {
                          mModalAlert.showSuccess('Plan agregado exitosamente', 'GUARDADO').then(function (response) {
                            // $state.reload();
                            updateContratos();
                          });
                          $uibModalInstance.close();
                        }
                      } else {
                        mModalAlert.showError(response.mensaje, 'Error', null, 3000);
                      }
                    })
                    .catch(function (err) {
                      mModalAlert.showError(folaFactory.showError(err, 'No se guardó el plan.'), 'Error', null, 3000);
                    });
                } else {
                  vm.paramsPlanEditar = {
                    id: $scope.mContrato.plan.id,
                    contrato: $scope.mContrato.numeroContrato,
                    subcontrato: $scope.mContrato.numeroSubcontrato,
                    nombreComercial: $scope.mContrato.plan.nombre
                      ? $scope.mContrato.plan.nombre.trim().toUpperCase()
                      : '',
                    subvencion: parseFloat($scope.mContrato.plan.subvencion)
                  };
                  folaService
                    .updatePlan(vm.paramsPlanEditar)
                    .then(function (response) {
                      if (response.codigo === 0) {
                        _loadPlanes();
                        if (
                          uploadCondicionadoParticular($scope.fmSubirCondicionadoParticular, $scope.mContrato.plan.id)
                        ) {
                          mModalAlert.showSuccess('Plan editado exitosamente', 'GUARDADO').then(function (response) {
                            // $state.reload();
                            updateContratos();
                          });
                          $uibModalInstance.close();
                        }
                      } else {
                        mModalAlert.showWarning(response.mensaje, 'Error-', null, 3000);
                      }
                    })
                    .catch(function (error) {
                      mModalAlert.showWarning(
                        folaFactory.showError(error, 'No se actualizó el plan.'),
                        'Error',
                        null,
                        3000
                      );
                    });
                }
              } else {
                mModalAlert.showWarning(resultValidatePlan.message, 'ALERTA', null, 3000);
                _loadPlanes();
              }
            };
            /*#########################
            # Delete File
            #########################*/
            $scope.deleteFile = function () {
              if ($scope.mContrato.plan.condicionado) {
                folaService
                  .deleteCondicionado($scope.mContrato.plan.idCondicionado, constantsFola.TIPO_CONDICIONADO.PARTICULAR)
                  .then(function (response) {
                    if (response.codigo === 0) {
                      $scope.vFileNameParticular = undefined;
                      $scope.fmSubirCondicionadoParticular = undefined;
                      mModalAlert.showSuccess('Condicionado particular eliminado exitosamente', 'GUARDADO', null, 3000);
                    } else {
                      mModalAlert.showError(
                        response.mensaje,
                        'Error al eliminar el conicionado particular',
                        null,
                        3000
                      );
                    }
                  })
                  .catch(function (error) {
                    mModalAlert.showError(
                      folaFactory.showError(error, 'No se eliminó el condicionado particular.'),
                      'Error',
                      null,
                      3000
                    );
                  });
              } else {
                $scope.vFileNameParticular = undefined;
                $scope.fmSubirCondicionadoParticular = undefined;
              }
              $scope.disabledButton = false;
            };
            /*#########################
            # Download File
            #########################*/
            $scope.downloadFile = function () {
              if ($scope.isDownloadFileCondicionadoParticular) {
                folaService
                  .getCondicionadoParticular(constantsFola.TIPO_CONDICIONADO.PARTICULAR, $scope.mContrato.plan.id)
                  .then(function (response) {
                    if (response.codigo === 0) {
                      // console.log('lo que tiene el response', response);
                      if (response.data[0].documentoBase64) {
                        var arrayFileName = response.data[0].nombreDocumento.split('.');
                        folaFactory.downloadFileBase64(response.data[0].documentoBase64, 'pdf', arrayFileName[0]);
                      }
                    } else {
                      mModalAlert.showError(response.mensaje, 'Error');
                    }
                  })
                  .catch(function (err) {
                    mModalAlert.showWarning(folaFactory.showError(err, 'No se pudo descargar.'), 'ALERTA', null, 3000);
                  });
              } else {
                FileSaver.saveAs($scope.fmSubirCondicionadoParticular[0], $scope.vFileNameParticular);
              }
            };
            $scope.cargarCondicionadoParticular = function (file) {
              if (file[0]) {
                $scope.vFileNameParticular = file[0].name;
              }
              $scope.isDownloadFileCondicionadoParticular = false;
              $scope.disabledButton = false;
            };
            vModalProof.result.then(function (response) {});
          },
        ],
      });
    }
    function ConvertSubvencion(subvencion) {
      return subvencion ? subvencion : '';
    }
    function validateIsDisabled(contrato){
      var lista = vm.listaContratos;
      var flag = false;
      var filter = lista.filter(function(item) { return item.plan.id != contrato.plan.id});
      if(filter.some(function(tempcontrato) { return (tempcontrato.plan.nombre == contrato.plan.nombre && tempcontrato.plan.estado != contrato.plan.estado) || tempcontrato.plan.subvencion == contrato.plan.subvencion})){
        flag = true;
      }
      return flag;
    }
    // cambiar el estado del plan
    function ChangeStatusPlan (contrato) {
      mpSpin.start();
      // var contrato = menu.$parent.contrato;
      var estado = contrato.plan.estado;
      // console.log('contrato', contrato);
      // console.log('estado', estado);
      if (contrato.plan) {
        var resultValidate = _validatePlanChangeStatus(contrato);
        if (resultValidate.isPlanValidate) {
          vm.paramsPlanEstado.id = contrato.plan.id;
          vm.paramsPlanEstado.estado = estado ? 1 : 0;
          // console.log('lo que tiene params', vm.paramsPlanEstado);
          folaService
            .updatePlan(vm.paramsPlanEstado)
            .then(function (response) {
              // console.log('entro al response', response);
              if (response.codigo == 0) {
                // _loadContratos();    
                _loadPlanes();
                mpSpin.end();
              }
            })
            .catch(function (error) {
              mModalAlert.showWarning(folaFactory.showError(error, 'No se actualizar el plan.'), 'Error', null, 3000);
              _loadContratos();
              _loadPlanes();
              mpSpin.end();
            });
        } else {
          mModalAlert.showWarning(resultValidate.message, 'ALERTA', null, 3000);
          mpSpin.end();
          // _loadContratos();
          _loadPlanes();
        }
      } else {
        // _loadContratos();
        _loadPlanes();
        mModalAlert.showWarning(
          'No se puede cambiar el estado, el plan no cuenta con nombre y subvencion',
          'ALERTA',
          null,
          3000
        );
        mpSpin.end();
        return false;
      }
    };
    // cargar condicionado general
    function UploadCondicionadoGeneral() {
      // console.log('condicionado', vm.fmSubirCondicionadoGeneral);
      if (vm.fmSubirCondicionadoGeneral) {
        vm.loadFileCondicionadoGeneral = true;
        var fd = new FormData();
        fd.append('condicionado', vm.fmSubirCondicionadoGeneral[0]);
        fd.append('tipoCondicionado', JSON.stringify(parseInt(constantsFola.TIPO_CONDICIONADO.GENERAL)));
        $http
          .post(constants.system.api.endpoints.policy + 'api/fola/documento/condicionado', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined},
            eventHandlers: {
              progress: function (c) {},
            },
            uploadEventHandlers: {
              progress: function (e) {
                mpSpin.start();
              }
            }
          })
          .success(function (response) {
            mpSpin.end();
            if (response.codigo === 0) {
              mModalAlert.showSuccess('Condicionado cargado correctamente', '').then(function () {
                updateContratos();
                // $state.reload();
              });
            } else {
              mModalAlert.showError(response.mensaje, 'Error');
            }
          })
          .catch(function (err) {
            mModalAlert.showError(
              folaFactory.showError(err, 'No se pudo cargar el condicionado general.'),
              'Error',
              null,
              3000
            );
            mpSpin.end();
          });
      } else {
        vm.loadFileCondicionadoGeneral = false;
      }
    }
    function DownloadCondicionadoGeneral() {
      if (vm.isDownloadFileCondicionadoGeneral) {
        folaService
          .getCondicionadoGeneral(constantsFola.TIPO_CONDICIONADO.GENERAL)
          .then(function (response) {
            if (response.codigo === 0) {
              var arrayFileName = response.data[0].nombreDocumento.split('.');
              folaFactory.downloadFileBase64(response.data[0].documentoBase64, 'pdf', arrayFileName[0]);
            } else {
              mModalAlert.showError(response.mensaje, 'Error');
            }
          })
          .catch(function (err) {
            mModalAlert.showError(folaFactory.showError(err, 'No se pudo descargar.'), 'Error', null, 3000);
          });
      } else {
        FileSaver.saveAs(vm.fmSubirCondicionadoGeneral[0], vm.vFileName);
      }
    }
    function DeleteCondicionadoGeneral(index, array, type) {
      if (vm.condicionadoGeneral) {
        folaService
          .deleteCondicionado(vm.condicionadoGeneral.id, constantsFola.TIPO_CONDICIONADO.GENERAL)
          .then(function (response) {
            if (response.codigo === 0) {
              vm.vFileName = undefined;
              vm.fmSubirCondicionadoGeneral = undefined;
              vm.loadFileCondicionadoGeneral = true;
              mModalAlert
                .showSuccess('Condicionado general eliminado exitosamente', 'GUARDADO')
                .then(function (response) {
                  // $state.reload();
                  updateContratos();
              });
            } else {
              mModalAlert.showError(response.mensaje, 'Error al eliminar el conicionado general', null, 3000);
            }
          })
          .catch(function (error) {
            mModalAlert.showError(
              folaFactory.showError(error, 'No se eliminó el condicionado general.'),
              'Error',
              null,
              3000
            );
          });
      } else {
        vm.vFileName = undefined;
        vm.fmSubirCondicionadoGeneral = undefined;
        vm.loadFileCondicionadoGeneral = true;
      }
    }
    function cargarCondicionadoGeneral(file) {
      vm.vFileName = file[0].name;
      vm.isDownloadFileCondicionadoGeneral = false;
      vm.loadFileCondicionadoGeneral = false;
    }
    // cargar condicionado particular
    function uploadCondicionadoParticular(condicionado, idPlan) {
      if (condicionado) {
        vm.loadFileCondicionadoGeneral = true;
        var fd = new FormData();
        fd.append('condicionado', condicionado[0]);
        fd.append('tipoCondicionado', JSON.stringify(parseInt(constantsFola.TIPO_CONDICIONADO.PARTICULAR)));
        fd.append('idPlan', JSON.stringify(parseInt(idPlan)));
        $http
          .post(constants.system.api.endpoints.policy + 'api/fola/documento/condicionado', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined},
            eventHandlers: {
              progress: function (c) {},
            },
            uploadEventHandlers: {
              progress: function (e) {
                // mpSpin.start();
              },
            },
          })
          .success(function (response) {
            // mpSpin.end();
            if (response.codigo !== 0) {
              mModalAlert.showError(response.mensaje, 'Error, no se pudo cargar el condicionado');
            }
          })
          .catch(function (err) {
            mModalAlert.showError(err.mensaje, 'No se pudo cargar el condicionado');
            // mpSpin.end();
          });
      }
      return true;
    }
    function _validatePlanChangeStatus(contrato) {
      var resultValidate = {
        isPlanValidate: true,
        message: 'ok',
      };
      if (!contrato.plan.nombre.trim() || contrato.plan.subvencion === null) {
        resultValidate = {
          isPlanValidate: false,
          message: 'No se puede cambiar el estado, el plan no cuenta con nombre y/o subvencion'
        };
        return resultValidate;
      }
      if (parseFloat(contrato.plan.subvencion) <= 0) {
        resultValidate = {
          isPlanValidate: false,
          message: 'No se puede cambiar el estado, la subvención no puede ser menor o igual a cero'
        };
        return resultValidate;
      }
      // if (contrato.plan.estado) {
      //   if (folaFactory.searchElementForKey(vm.planes, 'nombre', contrato.plan.nombre.trim())) {
      //     resultValidate = {
      //       isPlanValidate: false,
      //       message: 'No se puede cambiar el estado, existe plan activo con ese nombre',
      //     };
      //     return resultValidate;
      //   }
      //   if (folaFactory.searchElementForKey(vm.planes, 'subvencion', contrato.plan.subvencion)) {
      //     resultValidate = {
      //       isPlanValidate: false,
      //       message: 'No se puede cambiar el estado, existe plan activo con esa subvencion',
      //     };
      //     return resultValidate;
      //   }
      // }
      return resultValidate;
    }
    function _validatePlanEdit(plan, isAdd) {
      var resultValidate = {
        isPlanValidate: true,
        message: 'ok'
      };
      if (!plan.nombre.trim() || !plan.subvencion) {
        resultValidate = {
          isPlanValidate: false,
          message: 'Los campos del plan son obligatorios'
        };
        return resultValidate;
      }
      if (parseFloat(plan.subvencion) <= 0) {
        resultValidate = {
          isPlanValidate: false,
          message: 'La subvención no puede ser menor o igual a cero'
        };
        return resultValidate;
      }
      if (plan.estado) {
        var arrayNameDuplicate = folaFactory.searchElementDuplicateForKey(vm.planes, 'nombre', plan.nombre.trim());
        var arraySubvencionDuplicate = folaFactory.searchElementDuplicateForKey(
          vm.planes,
          'subvencion',
          parseFloat(plan.subvencion)
        );
        if (isAdd) {
          if (parseInt(arrayNameDuplicate.length) > 0) {
            resultValidate = {
              isPlanValidate: false,
              message: 'No se puede guardar el plan, ya existe un plan con el nombre comercial'
            };
            return resultValidate;
          }
          if (parseInt(arraySubvencionDuplicate.length) > 0) {
            resultValidate = {
              isPlanValidate: false,
              message: 'No se puede guardar el plan, ya existe un plan con la subvencion'
            };
            return resultValidate;
          }
        } else {
          var arrayIdPlanDuplicate = folaFactory.searchElementDuplicateForKey(vm.planes, 'id', parseFloat(plan.id));
          if (parseInt(arrayNameDuplicate.length) > 0 && !_isPlanCurrentEdit(arrayNameDuplicate, 'id', plan.id)) {
            resultValidate = {
              isPlanValidate: false,
              message: 'No se puede editar el plan, ya existe un plan con el nombre comercial'
            };
            return resultValidate;
          }
          if (
            parseInt(arraySubvencionDuplicate.length) > 0 &&
            !_isPlanCurrentEdit(arraySubvencionDuplicate, 'id', plan.id)
          ) {
            resultValidate = {
              isPlanValidate: false,
              message: 'No se puede editar el plan, ya existe un plan con la subvencion'
            };
            return resultValidate;
          }
        }
      }
      return resultValidate;
    }

    function _isPlanCurrentEdit(arrays, key1, value1) {
      var isPlanCurrent = false;
      arrays.forEach(function(array) {
        if (array[key1] === value1) {
          isPlanCurrent = true;
        }
      });
      return isPlanCurrent;
    }
  }
});
