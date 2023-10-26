'use strict';

define(['angular', 'lodash', 'AsistenciaActions', 'helper', 'wpConstant','constants'], function (
  ng,
  _,
  AsistenciaActions,
  helper,
  wpConstant,
  constants
) {
  DetalleAsistenciaPageController.$inject = [
    '$interval',
    '$log',
    '$scope',
    '$state',
    '$timeout',
    '$uibModal',
    'dataAsistencia',
    'lookups',
    'carTypes',
    'carBrands',
    'carTypesUse',
    'nivelDanho',
    'tipoDanho',
    'talleres',
    'typeDocuments',
    'wpFactory',
    '$ngRedux',
    'mModalAlert'
  ];
  function DetalleAsistenciaPageController(
    $interval,
    $log,
    $scope,
    $state,
    $timeout,
    $uibModal,
    dataAsistencia,
    lookups,
    carTypes,
    carBrands,
    carTypesUse,
    nivelDanho,
    tipoDanho,
    talleres,
    typeDocuments,
    wpFactory,
    $ngRedux,
    mModalAlert
  ) {
    var vm = this;
    var frmInvestigacion = {};

    vm.$onInit = onInit;
    vm.desestimar = desestimar;
    vm.guardar = guardar;
    vm.autorizar = autorizar;
    vm.investigar = investigar;
    vm.terminar = terminar;
    vm.consolidar = consolidar;
    vm.verDeducible = verDeducible;

    vm.fotosTercero = [];
    vm.conductorTerceroAux = {};
    vm.validateForm = {
      ocurrencia: false,
      tercero: false,
      validate: false
    };
    vm.url = {
      'QA' : "https://talleres.pre.mapfre.com.pe/#/talleres?plate=",
      "PROD" : "https://talleres.mapfre.com.pe/#/talleres?plate=" 
    }
    

    function onInit() {
      vm.modolectura = true;
      vm.disabledAutorizar = true;
      var paramsURL = ng.copy($state.params);

      wpFactory.setNroAsistencia($state.params.nroAsistencia);

      dataAsistencia = paramsURL.setFrm ? wpFactory.cache.getConsolidado() : dataAsistencia

      vm.ultimaDataDeAsistencia = _getDataAsistencia();
      vm.disabledAutorizar = vm.ultimaDataDeAsistencia.estadoSiniestro == 'GENERADO' ? false : true;

      wpFactory.setSiniestroNro(vm.ultimaDataDeAsistencia.codigoSiniestro);

      if (!vm.ultimaDataDeAsistencia.codigoSiniestro) {
        vm.modolectura = true;
        mModalAlert.showWarning(
          '<b>' + ' La asistencia no cuenta con "código de siniestro", por lo que esta vista será de solo consulta' + '</b>',
          'Mensaje'
        );
      }
      else{
        vm.modolectura = false;
      }

      wpFactory.ubigeo.GetProvinces(vm.ultimaDataDeAsistencia.codigoDepartamento || dataAsistencia.codigoDepartamento, false)
        .then(function (response) {
          wpFactory.setProvincia(response);
        })

      wpFactory.ubigeo.GetDistricts(vm.ultimaDataDeAsistencia.codigoDepartamento || dataAsistencia.codigoDepartamento , vm.ultimaDataDeAsistencia.codigoProvincia || dataAsistencia.codigoProvincia )
        .then(function (response) {
          wpFactory.setDistrito(response);
        })

      vm.infoAsistencia = _.assign({}, ng.copy($state.params), {
        codigoSiniestro: vm.ultimaDataDeAsistencia.codigoSiniestro,
        numeroPoliza: vm.ultimaDataDeAsistencia.numeroPoliza,
        estadoSiniestro: vm.ultimaDataDeAsistencia.estadoSiniestro,
        estadoUT: vm.ultimaDataDeAsistencia.conductorTercero.length && vm.ultimaDataDeAsistencia.conductorTercero[0].ocupanteTercero ? !!vm.ultimaDataDeAsistencia.conductorTercero[0].ocupanteTercero.codigoTipoDocumentoIdentidad : false,
        estadoConductorUT: vm.ultimaDataDeAsistencia.conductorTercero.length && vm.ultimaDataDeAsistencia.conductorTercero[0].vehiculoTercero ? !!vm.ultimaDataDeAsistencia.conductorTercero[0].vehiculoTercero.codigoTipoVehiculo : false
      });
      _setLookups();
    }

    function _isDifferentToPendiente() {
      return !/pendiente/i.test(vm.ultimaDataDeAsistencia.estadoSiniestro);
    }

    function _isPendienteOrGenerado() {
      return (
        /pendiente/i.test(vm.ultimaDataDeAsistencia.estadoSiniestro) ||
        /generado/i.test(vm.ultimaDataDeAsistencia.estadoSiniestro)
      );
    }

    function _getDataAsistencia() {
      dataAsistencia.codigoDepartamentoComisaria = dataAsistencia.codigoDepartamentoComisaria || dataAsistencia.codigoDepartamento
      dataAsistencia.codigoProvinciaComisaria = dataAsistencia.codigoProvinciaComisaria || dataAsistencia.codigoProvincia

      if (vm.infoAsistencia != null)
        dataAsistencia.codigoSiniestro = vm.infoAsistencia.codigoSiniestro;
      dataAsistencia.dataVehiculo = {
        placaVehiculo: dataAsistencia.placaVehiculo,
        codigoSoatVehiculo: dataAsistencia.codigoSoatVehiculo,
        descripcionSoatVehiculo: dataAsistencia.descripcionSoatVehiculo,
        codigoTipoVehiculo: dataAsistencia.codigoTipoVehiculoAsegurado,
        descripcionTipoVehiculo: dataAsistencia.descripcionTipoVehiculo,
        codigoUsoVehiculo: dataAsistencia.codigoUsoVehiculo,
        modeloVehiculo: dataAsistencia.modeloVehiculo,
        motorVehiculo: dataAsistencia.motorVehiculo,
        anioVehiculo: dataAsistencia.anioVehiculoAsegurado,
        serieVehiculo: dataAsistencia.serieVehiculo
      }
      if (dataAsistencia.conductorTercero.length && dataAsistencia.conductorTercero[0].vehiculoTercero) {
        vm.fotosTercero = dataAsistencia.conductorTercero[0].vehiculoTercero.fotosVehiculo
      }

      return _.merge({}, wpFactory.help.getObjWithHoursFormat5Characters(dataAsistencia), {
        codigoInterno: wpFactory.getNroAsistencia(),
        estadoSiniestro: dataAsistencia.estadoSiniestro || 'ABIERTO',
        usuarioRegistro: wpFactory.getCurrentUser().loginUserName
      });
    }

    function _setLookups() {
      wpFactory.myLookup.setLookups(lookups);
      wpFactory.myLookup.setCarTypes(carTypes);
      wpFactory.myLookup.setCarTypesUse(carTypesUse);
      wpFactory.myLookup.setCarBrands(carBrands);
      wpFactory.myLookup.setNivelDanho(nivelDanho);
      wpFactory.myLookup.setTipoDanho(tipoDanho);
      wpFactory.myLookup.setTalleres(talleres);
      wpFactory.myLookup.setTypeDocuments(typeDocuments);
    }

    function _goBandejaWithNroAsistencia() {
      $state.go('bandeja', { assistanceNumber: wpFactory.getNroAsistencia() });
    }

    function desestimar() {
      $scope.$emit('frm:save');
      $timeout(function () {
        if (vm.frmGeneral.frmLugarOcurrencia.$invalid || vm.frmGeneral.frmTerceroConvenio.$invalid) {
          var frminvalid = vm.frmGeneral.frmLugarOcurrencia.$invalid ? 'Lugar de ocurrencia' : 'Terceros Convenio';
          return void mModalAlert
            .showWarning('Los campos de' + frminvalid + 'son obligatorios', 'Falta completar')
            .then(function msAnularPr() {
              vm.validateForm.validate = false;
            });
        }

        if (_isDifferentToPendiente()) {
          return void mModalAlert.showWarning(
            'El estado de la asistencia debe estar en PENDIENTE.',
            'Aún no se puede desestimar'
          );
        }

        var textos = {
          btnCancel: 'Cancelar',
          btnOk: 'Desistir',
          titulo: '¿Está seguro que el cliente desea desistir de la Asistencia?'
        };
        vm.ultimaDataDeAsistencia.desestimiento = "S"
        var request = setRequest('GENERADO');

        _showModalConfirm(textos)
          .result.then(function cdScFn() {

            wpFactory.siniestro
              .GeneratorCaseFile(true, request)
              .then(function aSPr() {
                mModalAlert.showSuccess('Realizado con éxito', 'Desistimiento').then(function msAnularPr() {
                  _goBandejaWithNroAsistencia();
                });
              })
              .catch(function aEPr(err) {
                mModalAlert.showError('Ocurrió un error al poner en desistimiento', 'Error');
                $log.error('Falló el desestimar asistencia', err.data);
              });
          })
          .catch(function () {
          });
      })

    }

    function setRequest(estado) {
      vm.ultimaDataDeAsistencia.codigoDepartamento = vm.ultimaDataDeAsistencia.codigoDepartamento + '';
      vm.ultimaDataDeAsistencia.codigoProvincia = vm.ultimaDataDeAsistencia.codigoProvincia + '';
      vm.ultimaDataDeAsistencia.codigoDistrito = vm.ultimaDataDeAsistencia.codigoDistrito + '';
      vm.ultimaDataDeAsistencia.codigoDepartamento = null;
      vm.ultimaDataDeAsistencia.codigoDepartamentoComisaria = null;
      vm.ultimaDataDeAsistencia.codigoDistrito = null;
      vm.ultimaDataDeAsistencia.codigoDistritoComisaria = null;
      

      vm.ultimaDataDeAsistencia.siniestroConvenio = {
        "aplicaConvenio": vm.ultimaDataDeAsistencia.siniestroConvenio.aplicaConvenio,
        "codigoConvenioGolpe": parseInt(vm.ultimaDataDeAsistencia.siniestroConvenio.codigoConvenioGolpe),
        "codigoEmpresaAseguradora": vm.ultimaDataDeAsistencia.siniestroConvenio.codigoEmpresaAseguradora,
        "codigoMoneda": vm.ultimaDataDeAsistencia.siniestroConvenio.codigoMoneda.toString(),
        "flagTerceroSeguro": vm.ultimaDataDeAsistencia.siniestroConvenio.flagTerceroSeguro,
        "importe": parseFloat(vm.ultimaDataDeAsistencia.siniestroConvenio.importe)
      }

      return _.assign({}, vm.ultimaDataDeAsistencia, vm.ultimaDataDeAsistencia.dataVehiculo, {
        codigoTipoVehiculoAsegurado: vm.ultimaDataDeAsistencia.dataVehiculo.codigoTipoVehiculo,
        anioVehiculoAsegurado: vm.ultimaDataDeAsistencia.dataVehiculo.anioVehiculo,
        estadoSiniestro: estado
      })
    }

    function autorizar() {
      $scope.$emit('frm:save');
      $timeout(function () {
        if (vm.frmGeneral.frmLugarOcurrencia.$invalid || vm.frmGeneral.frmTerceroConvenio.$invalid) {
          var frminvalid = vm.frmGeneral.frmLugarOcurrencia.$invalid ? 'Lugar de ocurrencia' : 'Terceros Convenio';
          return void mModalAlert
            .showWarning('Los campos de' + frminvalid + 'son obligatorios', 'Falta completar')
            .then(function msAnularPr() {
              vm.validateForm.validate = false;
            });
        }
        else if(vm.ultimaDataDeAsistencia.apreciacionEtilica){
          mModalAlert.showWarning('No se puede autoizar debido a que la Apreciación Etilica es positiva', 'Alerta');
        }
        else{
          var request = {
            codigoInterno: wpFactory.getNroAsistencia(),
          };
    
          var textos = {
            btnCancel: 'Cancelar',
            btnOk: 'Autorizar',
            titulo: '¿Está seguro que el cliente desea autorizar de la Asistencia?'
          };
    
          _showModalConfirm(textos)
            .result.then(function cgScFn() {
              wpFactory.siniestro
                .Autorizar(request)
                .then(function (response) {
                  if(response.operationCode === 200){
                    mModalAlert.showSuccess('Realizado con éxito', 'Autorizar').then(function msAnularPr() {
                      consolidar();
                    });
                  }else if(response.operationCode === 500){
                    mModalAlert.showError(response.message, 'Error');
                  }
                })
                .catch(function aEPr(err) {
                  mModalAlert.showError('Ocurrió un error al autorizar', 'Error');
                  $log.error('Falló al autorizar asistencia', err.data);
                });
            })
            .catch(function () {
            })
        }
        
      });

      
    }

    function guardar() {
      $scope.$emit('frm:save');
      $timeout(function () {
        var invalidplaca = vm.frmGeneral.frmTerceroConvenio.frmVehiculoSoat.nPlaca.$viewValue;
        vm.frmGeneral.frmLugarOcurrencia.$invalid && vm.frmGeneral.frmLugarOcurrencia.markAsPristine();
        vm.frmGeneral.frmTerceroConvenio.$invalid && vm.frmGeneral.frmTerceroConvenio.markAsPristine();
        var dataGuardar = setRequest('PENDIENTE');
        if (vm.frmGeneral.frmLugarOcurrencia.$invalid || (vm.frmGeneral.frmTerceroConvenio.$invalid && invalidplaca)) {
          var frminvalid = vm.frmGeneral.frmLugarOcurrencia.$invalid ? 'Lugar de ocurrencia' : 'Terceros Convenio';
          return void mModalAlert
            .showWarning('Los campos de ' + frminvalid + ' son obligatorios', 'Falta completar')
            .then(function msAnularPr() {
              vm.validateForm.validate = false;
            });
        }

        var textos = {
          btnCancel: 'Cancelar',
          btnOk: 'Guardar',
          subtitulo: 'Los cambios se guardarán en el sistema',
          titulo: '¿Está seguro de guardar los cambios?'
        };

        _showModalConfirm(textos)
          .result.then(function cgScFn() {
            wpFactory.siniestro
              .Save(dataGuardar, true)
              .then(function aSPr(res) {
                vm.infoAsistencia.estadoSiniestro = 'PENDIENTE';
              })
              .catch(function aEPr(err) {
                $log.error('Falló el guardar asistencia', err.data);
                var msgError = ''
                if (err.data && err.data.data && err.data.data.message) {
                  msgError = err.data.data.message
                }
                mModalAlert.showError('Ocurrió un error al guardar <br><b>' + err.data.message + '</b>' + '<br><b>' + msgError + '</b>', 'Error');
              });
          })
          .catch(function () {

          })
      })
    }

    function investigar() {
      var textos = {
        btnCancel: 'Cancelar',
        btnOk: 'Poner a investigación',
        titulo: '¿Está seguro de poner en investigación la Asistencia?'
      };
      _showModalInvestigar(textos, vm.ultimaDataDeAsistencia).result.then(function ctScFn(resp) {
        vm.ultimaDataDeAsistencia.motivoInvestigacion = resp.motivoInvestigacion.codigoParametro;
        vm.ultimaDataDeAsistencia.comentarioInvestigacion = resp.comentarioInvestigacion;
      });
    }

    function terminar() {
      $scope.$emit('frm:save');
      $timeout(function () {
        var invalidplaca = vm.frmGeneral.frmTerceroConvenio.frmVehiculoSoat.nPlaca.$viewValue;
        if (vm.frmGeneral.frmLugarOcurrencia.$invalid || vm.frmGeneral.frmTerceroConvenio.$invalid && invalidplaca) {
          var frminvalid = vm.frmGeneral.frmLugarOcurrencia.$invalid ? 'Lugar de ocurrencia' : 'Terceros Convenio';
          return void mModalAlert
            .showWarning('Los campos de' + frminvalid + 'son obligatorios', 'Falta completar')
            .then(function msAnularPr() {
              vm.validateForm.validate = false;
            });
        }
        if (!_isPendienteOrGenerado()) {
          return void mModalAlert.showWarning(
            'El estado de la asistencia debe estar en PENDIENTE o GENERADO.',
            'Aún no se puede Terminar'
          );
        }

        var textos = {
          btnCancel: 'Cancelar',
          btnOk: 'Terminar',
          subtitulo: 'Los cambios se guardarán en el sistema y se generarán los expedientes respectivos.' +
            (_getDataAsistencia().codigoSiniestro ? '' : '<br><b>Se está intentando terminar una asistencia sin siniestro generado, por favor comunicarse con un ejecutivo de siniestros.</b>'),
          titulo: '¿Estás seguro de terminar la Asistencia?'
        };

        var dataGuardar = setRequest('GENERADO')

        _showModalConfirm(textos)
          .result.then(function ctScFn() {
            wpFactory.siniestro
              .GeneratorCaseFile(false, dataGuardar)
              .then(function aSPr(data) {
                var aux_data = data.success
                var aux_message = !data ? '' : data.message
                if (aux_data) {
                  mModalAlert.showError(
                    aux_message,
                    'Aún no se puede Terminar'
                  );
                } else {
                  mModalAlert.showSuccess('Realizado con éxito', 'Asistencia Generada').then(function msTerminarPr() {
                    _goBandejaWithNroAsistencia();
                  });
                }
              })
              .catch(function aEPr(err) {
                _onAutoSave();
                mModalAlert.showError('Ocurrió un error al terminar <br><b>' + err.data.message + '</b>', 'Error');
                $log.error('Falló el terminar asistencia', err.data);
              });
          })
          .catch(function () {
          });
      })

    }

    function _showModalConfirm(textos) {
      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        template: '<wp-modal-confirm close="close(status)" textos="textos"></wp-modal-confirm>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function (scope, $uibModalInstance) {
            scope.close = function (type) {
              type && type === 'ok' ? $uibModalInstance.close() : $uibModalInstance.dismiss();
            };
            scope.textos = textos;
          }
        ]
      });
    }

    function _showModalInvestigar(textos, datos) {
      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        template: '<wp-modal-investigar close="close($event)" textos="textos" datos="datos"></wp-modal-investigar>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function (scope, $uibModalInstance) {
            scope.close = function (ev) {
              ev && ev.status === 'ok' ? $uibModalInstance.close(ev.data) : $uibModalInstance.dismiss();
            };
            scope.textos = textos;
            scope.datos = datos || frmInvestigacion;
          }
        ]
      });
    }

    function consolidar() {
      $scope.$emit('frm:save');
      $timeout(function () {
        var dataGuardar = setRequest(vm.ultimaDataDeAsistencia.estadoSiniestro);
        wpFactory.cache.setConsolidado(dataGuardar);
        $state.go('consolidadoAsistencia');
      });


    }

    function verDeducible() {
      if(vm.frmGeneral.frmLugarOcurrencia.frmVehiculoSoat.nPlaca.$viewValue){
        var url = vm.url[constants.environment] + btoa(vm.frmGeneral.frmLugarOcurrencia.frmVehiculoSoat.nPlaca.$viewValue);
        window.open(url, '_blank');
      }
      else{
        mModalAlert.showWarning('Ingresar un valor en el campo placa', 'Alerta');
      }

    }

  } // end controller

  return ng
    .module('appWp')
    .controller('DetalleAsistenciaPageController', DetalleAsistenciaPageController)
});
