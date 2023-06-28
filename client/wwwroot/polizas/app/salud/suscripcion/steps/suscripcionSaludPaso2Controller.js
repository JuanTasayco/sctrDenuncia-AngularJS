'use strict';

define(['angular', 'lodash', 'constantsSalud', 'saludFactory', 'question'], function(
  angular, _, constantsSalud) {

  suscripcionSaludPaso2Controller.$inject = [
    '$scope', '$uibModal', 'mModalAlert', '$stateParams', 'saludSuscripcionFactory', 'saludFactory', 'oimPrincipal', '$state', '$filter'
  ];

  function suscripcionSaludPaso2Controller($scope, $uibModal, mModalAlert, $stateParams, saludSuscripcionFactory, saludFactory, oimPrincipal, $state, $filter) {
    var vm = this;
    $scope.motivoSolicitud = [];
    $scope.blockAll = false;
    vm.$onInit = function() {
      $scope.answer = constantsSalud.suscripcion.questionAnswers;
      $scope.questionType = constantsSalud.suscripcion.questionTypes;
      $scope.oneAtATime = true;
      $scope.status = {
        open1: false,
        open2: false,
        open3: false,
        open4: false,
      };

      $scope.titular = {};
      $scope.formDataModal = {};
      $scope.preguntasModal = [];
      $scope.preguntas = {};
      $scope.preguntasNo = [];
      $scope.preguntasFormaSimple = {};
      $scope.preguntaSeleccionadaModal = {};
      $scope.respuestas = [];
      $scope.userProfile = {}
      $scope.numeros = ['Cero', 'Un', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve', 'Diez'];
      

      _getUserProfile();
      _getSuscripcionInfo($stateParams.quotationNumber, true);
      $scope.ubigeos = $scope.ubigeos || {};
    };

    $scope.cleanModal = function () {
      $scope.preguntaSeleccionadaModal = {};
    }
    $scope.paso3 = function () {
      $state.go('suscripcionSalud.steps', {quotationNumber: $scope.firstStep.NumeroDocumento, step: 3});
    }
    $scope.guardar = function () {
      if (!_validarCuestionarioPrincipalAnadir()) {
        _openModalError('Debe reponder todas las preguntas principales.');
        return;
      } else if (!_validarCuestionarioPrincipalGuardar()) {
        _openModalError('Debe responder al menos un detalle para un asegurado de una de las preguntas que tienen respuesta afirmativa');
        return ;
      }

      _formatPreguntas(_guardarPaso2);
    }

    $scope.openModalAnadir = function(codPregunta, nroDocDependiente) {
      $scope.fechas = {};
      if (!_validarCuestionarioPrincipalAnadir()) {
        _openModalError('Debe reponder todas las preguntas principales.');
        return;
      } else if (!_validarExistePreguntaSi()) {
        _openModalError('Debe tener al menos una respuesta afirmativa para añadir un detalle a la respuesta');
        return;
      }

      $scope.preguntasModal = _getPreguntasModal(codPregunta);
      _getDependientesModal(nroDocDependiente);

      var vModalProof = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        templateUrl : '/polizas/app/salud/popup/controller/popupAnadirSuscripcion.html',
        controller : ['$scope', '$uibModalInstance',
          function($scope, $uibModalInstance) {
            /*## closeModal ##*/
            var self = this;

            self.$onInit = function () {
              _setValoresPorDefecto();
            }

            $scope.closeModal = function () {
              $uibModalInstance.close();
            };

            $scope.onChangePregunta = function () {
              $scope.preguntaSeleccionadaModal.cuestionarios = _getCuestionarioData($scope.preguntaSeleccionadaModal.ORDERN);
            }

            $scope.guardarCuestionarioModal = function () {
              if (!_validarCuestionarioModal()) {
                $scope.formDataModal.markAsPristine();
              } else {
                var preguntaSeleccionada = $scope.preguntaSeleccionadaModal;
                var nroDocdependientes = Object.keys(preguntaSeleccionada.cuestionarios);
                var cuestionarios = {}
                var cuestionariosValidos = 0;
                nroDocdependientes.forEach(function (nroDocdependiente) {
                  if (angular.isObject($scope.preguntaSeleccionadaModal.cuestionarios) && preguntaSeleccionada.cuestionarios[nroDocdependiente].cuestionarioValido) {
                    var respuestas = angular.copy(preguntaSeleccionada.cuestionarios[nroDocdependiente].respuestas);
                    cuestionarios[nroDocdependiente] = {
                      respuestas: respuestas,
                      valid: true
                    }
                    cuestionariosValidos ++;
                  }
                  $scope.preguntasFormaSimple[preguntaSeleccionada.ORDERN].cuestionarios = cuestionarios;
                  $scope.closeModal();
                });
                $scope.preguntasFormaSimple[preguntaSeleccionada.ORDERN].cantCuestionariosValidos = cuestionariosValidos;
              }
            };

            $scope.limpiarPreguntasSubhijas = function (valor, hijos, dependienteOrden) {
              if (valor === $scope.answer.yes)
                return;
              hijos.forEach(function (hijo) {
                $scope.preguntaSeleccionadaModal.cuestionarios[dependienteOrden].respuestas[hijo.COD_PRGNTA] = '';
              })
            }

            var _validarCuestionarioModal = function () {
              var codigoPreguntaSelec = $scope.preguntaSeleccionadaModal.ORDERN;
              if (angular.isObject($scope.preguntaSeleccionadaModal.cuestionarios)) {
                var nroDocDependientes = Object.keys($scope.preguntaSeleccionadaModal.cuestionarios);
                var cuestionariosValidosArr = [];
                var preguntas = $scope.preguntasFormaSimple[codigoPreguntaSelec].hijosOrdenSimple;
                var validCuestionarioGeneral = true;
                var cuestionariosValidos = 0;
                nroDocDependientes.forEach(function (nroDocDependiente) {
                  var cantPreguntaVacias = 0;
                  preguntas.forEach(function (pregunta) {
                    if ($scope.preguntaSeleccionadaModal.cuestionarios[nroDocDependiente].respuestas[pregunta.COD_PRGNTA] === '' ||
                      angular.isUndefined($scope.preguntaSeleccionadaModal.cuestionarios[nroDocDependiente].respuestas[pregunta.COD_PRGNTA])) {
                      cantPreguntaVacias++;
                    }
                    if (!angular.isUndefined($scope.preguntaSeleccionadaModal.subPreguntasHijas) && !angular.isUndefined($scope.preguntaSeleccionadaModal.subPreguntasHijas[pregunta.COD_PRGNTA])) {
                      var parentCode  = $scope.preguntaSeleccionadaModal.subPreguntasHijas[pregunta.COD_PRGNTA].parent;
                      if ($scope.preguntaSeleccionadaModal.cuestionarios[nroDocDependiente].respuestas[parentCode] == 'N') {
                        cantPreguntaVacias--;
                      }
                    }
                  });
                  if (cantPreguntaVacias <= 0) {
                    $scope.preguntaSeleccionadaModal.cuestionarios[nroDocDependiente].cuestionarioValido = true;
                    cuestionariosValidos++;
                  } else if (preguntas.length == cantPreguntaVacias) {
                    cuestionariosValidosArr.push({dependiente: nroDocDependiente, estado: true, valido: false})
                  } else {
                    validCuestionarioGeneral = false;
                    $scope.dependienteSeleccionado = _.find($scope.dependientesModal, function (dependiente) {
                      return dependiente.NumeroDocumento == nroDocDependiente;
                    })
                    cuestionariosValidosArr.push({dependiente: nroDocDependiente, estado: false, valido: false})
                  }
                });

                if(cuestionariosValidos === 0 || !validCuestionarioGeneral) {
                  validCuestionarioGeneral = false
                }
              } else {
                validCuestionarioGeneral = false
              }

              $scope.preguntasFormaSimple[codigoPreguntaSelec].valid = validCuestionarioGeneral;
              return validCuestionarioGeneral;
            }

            function _setValoresPorDefecto() {
              $scope.preguntaSeleccionadaModal = $scope.preguntasModal[0];
              $scope.dependienteSeleccionado = $scope.dependientesModal[0];
              $scope.preguntaSeleccionadaModal.cuestionarios = _getCuestionarioData($scope.preguntaSeleccionadaModal.ORDERN);
              $scope.preguntaSeleccionadaModal.hijosOrdenSimple.forEach(function (hijo) {
                if (hijo.TIPO == 4) {
                  var datePickerIndex = 'dt' + hijo.COD_PRGNTA;
                  $scope.fechas[datePickerIndex] = false;
                }
              });
            }

            function _getCuestionarioData(codPreguntaPadre) {
              if (angular.isObject($scope.preguntasFormaSimple[codPreguntaPadre])) {
                return angular.copy($scope.preguntasFormaSimple[codPreguntaPadre].cuestionarios);
              } else {
                return {}
              }
            }
          }
        ]
      });
      vModalProof.result.then(function(){
        $scope.cleanModal();
        //Action after CloseButton Modal
      },function(){
        $scope.cleanModal();
        //Action after CancelButton Modal
      });
    }

    $scope.$on('changingStep', function(ib, e){
      if (e.step > 1){
        if (!_validarCuestionarioPrincipalAnadir()) {
          _openModalError('Debe reponder todas las preguntas principales.');
          e.cancel = true;
        } else if (!_validarCuestionarioPrincipalGuardar()) {
          _openModalError('Debe responder al menos un detalle para un asegurado de una de las preguntas que tienen respuesta afirmativa.');
          e.cancel = true;
        }
      }
    });
    
    var _validarPermiso = function (firstStep) {
      $scope.blockAll = firstStep.EstadoSolicitud != ''  && $scope.motivoSolicitud.indexOf("DPS") < 0
      if (firstStep.EstadoSolicitud != ''  && $scope.motivoSolicitud.indexOf("DPS") < 0) {
        if ($scope.motivoSolicitud.length > 0){
          $state.go('suscripcionSalud.steps', {quotationNumber: firstStep.NumeroDocumento, step: 3});
        }else{
          $state.go('resumenSuscripcionSalud', { quotationNumber: firstStep.NumeroDocumento }, {reload: true, inherit: false});
        }
      } else if (
        firstStep.MotivoSolicitud.TipoMotivo.Codigo != constantsSalud.requestReasoNewPolicyCode &&
        !firstStep.MotivoSolicitud.NumeroPolizaMigracion
      ) {
        $state.go('.', {
          step: 1
        });
      }
    }
    
    function _validarPaso(data) {
      if ($scope.motivoSolicitud.indexOf("DPS") < 0) {
        if ($scope.motivoSolicitud.length > 0){
          $state.go('suscripcionSalud.steps', {quotationNumber: data.NumeroDocumento, step: 3});
        }else if (data.Paso > 2 ) {
          $state.go('suscripcionSalud.steps', {quotationNumber: data.NumeroDocumento, step: data.Paso});
        }      
      }
    }
    
    $scope.$on('$locationChangeSuccess',function(evt, newUrl, oldUrl) {
      if (oldUrl.split('/').pop() !== 2) {
        $state.go('suscripcionSalud.steps', {quotationNumber: $stateParams.quotationNumber, step: 2});
      }
     });

    var _getUserProfile = function () {
      $scope.userName = oimPrincipal.getUsername();
    }

    var _getPaso2 = function (nroCuestionario, dependientesNumDoc) {

      saludSuscripcionFactory.getPaso2(nroCuestionario, dependientesNumDoc)
        .then(function (preguntas) {
          $scope.preguntasFormaSimple = angular.copy(preguntas);
        });
    }

    var _validarCuestionarioPrincipalAnadir = function () {
      $scope.formData.markAsPristine();
      var formValid = $scope.formData.$valid;
      return formValid;
    }

    var _validarExistePreguntaSi = function () {
      var preguntaEncontrada = _.find($scope.preguntasFormaSimple, function (pregunta) {
        return pregunta.response == $scope.answer.yes;
      });

      return !angular.isUndefined(preguntaEncontrada);
    }

    var _validarCuestionarioPrincipalGuardar = function () {
      var preguntaNoValidaEncontrada = _.find($scope.preguntasFormaSimple, function (pregunta) {
        if (pregunta.response == $scope.answer.yes) {
          return !pregunta.valid
        }
      });

      return angular.isUndefined(preguntaNoValidaEncontrada);
    }

    var _openModalError = function (msj) {
      var response = false;
      if (!response) {
        mModalAlert.showError(msj, 'Error');
      }
    }

    var _formatPreguntas = function (cbGuardarPaso2) {
      var data = {
        NumeroCotizacion: $scope.firstStep.NumeroCotizacion,
        NumeroDocumento: $scope.firstStep.NumeroDocumento,
        Paso: "2",
        Cuestionario: {
          tip_benef: $scope.titular.TipoAsegurado.Codigo,
          tip_docum: $scope.titular.TipoDocumento.Codigo,
          cod_docum: $scope.titular.NumeroDocumento,
          usuario_creacion: $scope.userName,
          cod_cuestionario: 3,
          respuestas: [],
          detalle: []
        }
      };

      if (!angular.isUndefined($scope.firstStep.NumeroCuestionario)) {
        data.Cuestionario.nro_cuestionario = $scope.firstStep.NumeroCuestionario;
      }

      angular.forEach($scope.preguntasFormaSimple, function (pregunta, codPregunta) {
        var preguntaRpta = {
          cod_prgnta: pregunta.COD_PRGNTA,
          desc_respuesta: pregunta.response == $scope.answer.yes ? 'SI' : 'NO',
          codigo_rpta: pregunta.response == $scope.answer.yes ? $scope.answer.yes : $scope.answer.no,
        }
        data.Cuestionario.respuestas.push(preguntaRpta);

        var detallePregunta = {
          cod_prgnta: pregunta.COD_PRGNTA,
          personas: []
        };

        $scope.dependientes.forEach(function (dependiente) {
          var personaRespuesta = {
            tip_docum: dependiente.TipoDocumento.Codigo,
            cod_docum: dependiente.NumeroDocumento,
            tip_benef: dependiente.TipoAsegurado.Codigo,
            respuestas: []
          }

          pregunta.hijosOrdenSimple.forEach(function (hijo) {
            if (!_.isEmpty($scope.preguntasFormaSimple[codPregunta].cuestionarios) && $scope.preguntasFormaSimple[codPregunta].response == $scope.answer.yes) {
              if (angular.isObject($scope.preguntasFormaSimple[codPregunta].cuestionarios[dependiente.NumeroDocumento])) {

                var descRpta = $scope.preguntasFormaSimple[codPregunta].cuestionarios[dependiente.NumeroDocumento].respuestas[hijo.COD_PRGNTA];
                if (angular.isDate(descRpta)) {
                  descRpta = $filter('date')(descRpta, 'dd/MM/yyyy');
                }

                if(hijo.TIPO == $scope.questionType.select && hijo.OPCIONES.length > 0) {
                  descRpta = descRpta.CODIGO;
                }

                personaRespuesta.respuestas.push({
                  cod_prgnta: hijo.COD_PRGNTA,
                  desc_respuesta: descRpta
                });
              } else {
                personaRespuesta.respuestas.push({
                  cod_prgnta: hijo.COD_PRGNTA,
                  desc_respuesta: "",
                });
              }
            } else {
              personaRespuesta.respuestas.push({
                cod_prgnta: hijo.COD_PRGNTA,
                desc_respuesta: "",
              });
            }
          });
          detallePregunta.personas.push(personaRespuesta);
        });
        data.Cuestionario.detalle.push(detallePregunta);
      });
      cbGuardarPaso2(data);
    }

    var _guardarPaso2 = function (data) {
      saludFactory.registrarSuscripcion(data, true).then(
        function (response) {
          if (response.OperationCode === 200) {
            _actualizarCodCuestionario(response.Data[0].ValueResult);
            saludSuscripcionFactory.setPaso2($scope.preguntasFormaSimple);
            $state.go('.', {
              step: 3
            });
          } else {
            var errMsj = '';
            errMsj = response.Data ? response.Data.Message : response.Message;
            mModalAlert.showError(errMsj, 'Error');
          }
        }, function (errResponse) {
          var errMsj = '';
          errMsj = errResponse.data ? errResponse.data.Data.Message : errResponse.Message;
          mModalAlert.showError(errMsj, 'Error');
        });
    }

    var _actualizarCodCuestionario = function (nroCuestionario) {
      $scope.firstStep.NumeroCuestionario = nroCuestionario;
      saludSuscripcionFactory.setPaso1($scope.firstStep);
    }

    var _getSuscripcionInfo = function (quotationNumber, showSpin) {
      $scope.motivoSolicitud = saludSuscripcionFactory.getmotivoSolicitud();
      saludSuscripcionFactory.getPaso1(quotationNumber, showSpin).then(function (data) {
        _validarPermiso(data);
        _validarPaso(data);
        $scope.firstStep = angular.copy(data);
        $scope.dependientesObj = {}
        $scope.dependientes = $scope.firstStep.Asegurados;
        var dependientes = _getAsegurados();
        _getPaso2($scope.firstStep.NumeroCuestionario, dependientes.numDocs);
      }, function (err) {
        console.log(err);
      })
    }

    var _getAsegurados = function () {
      var dependientes = {
        numDocs: []
      }

      $scope.dependientes.forEach(function (dependiente) {
        $scope.dependientesObj[dependiente.NumeroDocumento] = dependiente;
        dependiente.nombreCompleto = dependiente.ApellidoPaterno + ' ' + dependiente.ApellidoMaterno + ' ' + dependiente.Nombre;
        if (dependiente.TipoAsegurado.Codigo == 'TI') {
          $scope.titular = dependiente;
        }
        dependientes.numDocs.push(dependiente.NumeroDocumento);
      });

      return dependientes;
    }

    var _getDependientesModal = function (nroDocDependiente) {
      $scope.dependientesModal = [];
      if (angular.isString(nroDocDependiente)) {
        $scope.dependientes.forEach(function (dependiente) {
          if (dependiente.NumeroDocumento == nroDocDependiente) $scope.dependientesModal.push(dependiente);
        })
      } else {
        $scope.dependientesModal = $scope.dependientes;
      }

    }

    var _getPreguntasModal = function (codPregunta) {
      var preguntasModal = [];
      var preguntasCod = Object.keys($scope.preguntasFormaSimple);
      if (!angular.isUndefined(codPregunta)) {
        preguntasCod.forEach(function (codigo) {
          if (codigo == codPregunta) {
            preguntasModal.push(angular.copy($scope.preguntasFormaSimple[codigo]));
          }
        });
      } else {
        preguntasCod.forEach(function (codigo) {
          if ($scope.preguntasFormaSimple[codigo].response === $scope.answer.yes && !angular.isString(codPregunta)) {
            preguntasModal.push(angular.copy($scope.preguntasFormaSimple[codigo]));
          }
        });
      }

      return preguntasModal;
    }
  }

  return angular.module('appSalud')
    .controller('suscripcionSaludPaso2Controller', suscripcionSaludPaso2Controller);
});
