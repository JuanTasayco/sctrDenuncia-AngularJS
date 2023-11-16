'use strict';

define(['angular', 'constants', 'helper', 'lodash', 'mpfPersonConstants', 'saludFactory', 'mpfPersonComponent'], function(
  angular, constants, helper, _, personConstants) {
  cotizadorSaludController.$inject = [
    '$scope',
    '$state',
    '$timeout',
    'mModalAlert',
    '$sce',
    'saludFactory',
    'saludLists',
    'oimAbstractFactory',
    'oimClaims',
    'proxyGeneral',
    'mainServices',
    'oimPrincipal',
    'proxyAgente'
  ];

  function cotizadorSaludController(
    $scope,
    $state,
    $timeout,
    mModalAlert,
    $sce,
    saludFactory,
    saludLists,
    oimAbstractFactory,
    oimClaims,
    proxyGeneral,
    mainServices,
    oimPrincipal,
    proxyAgente
  ) {
    var vm = this;

      evalAgentViewDcto();
      function _setList(list, paramFilter){
        var vObj = list.filter(function(item) {
          return item.Codigo === paramFilter;
        })[0];
        return vObj;
      }

      $scope.data = $scope.firstStep || {};
      $scope.showPlan = false;
      $scope.showInsuredForm = false;
      $scope.showPrimaList = false;
      $scope.data.tipoDocumentoAsegurado = {};
      $scope.format = constants.formats.dateFormat;
      $scope.insuredsList = [];
      $scope.insured = {};
      $scope.data.fechaActual = new Date();
      $scope.data.fechaVencimiento = new Date(new Date().setYear($scope.data.fechaActual.getFullYear() + 1));
      $scope.decimal = constants.formats.twoDecimals;
      $scope.formVida = {}
      $scope.esAdmin = oimPrincipal.isAdmin();
      $scope.mAgente = {
        codigoNombre: oimPrincipal.getAgent().codigoAgente+' - '+oimPrincipal.getAgent().codigoNombre,
        codigoAgente: oimPrincipal.getAgent().codigoAgente
      };
      
      $scope.userRoot = oimPrincipal.isAdmin();
      $scope.gLblTitle = 'Cotización póliza salud';
      $scope.disabledForm = false;

      var insuredData = {};
      var insuredDocumentNumberValidate;
      var codigoProductoSalud;
      var codigoSubProductoSalud;
      var countChildrens = 0;

      if (saludLists){
        $scope.productos = saludLists[0].Data;
        $scope.tiposDeDocumentos = saludLists[1].Data;
        $scope.planes = saludLists[2].Data;
        $scope.sexo = saludLists[3].Data;
        $scope.tiposPersona = saludLists[4].Data;
        $scope.tiposMoneda = saludLists[5].Data;

        if (!$scope.data.moneda) {
          $scope.data.moneda = _setList($scope.tiposMoneda, '1');
        }
      }

      if (typeof $scope.data.fechaNacimiento === 'string') {
        $scope.data.fechaNacimiento = new Date($scope.data.fechaNacimiento);
      }

      $scope.appCode = personConstants.aplications.SALUD;
      $scope.formCode = personConstants.forms.COT_SAL_ASE;

      $scope.$on('personForm', function(event, data) {
        if (data.compAsegurado) {
          $scope.aseguradoValid = data.valid;
          setFormData(data.compAsegurado);
        }
      });

      function getEncuesta(){
        var codCia = constants.module.polizas.salud.companyCode;
        var codeRamo = $scope.data.producto.CodigoRamo;

        proxyGeneral.GetEncuesta(codCia, codeRamo, false).then(function(response) {
          if(response.OperationCode == constants.operationCode.success){
            if (Object.keys(response.Data.Pregunta).length > 0){
              $scope.encuesta = response.Data;
              $scope.encuesta.CodigoCompania = codCia;
              $scope.encuesta.CodigoRamo = codeRamo;
            }else{
              $scope.encuesta = {};
              $scope.encuesta.mostrar = 0;
            }
          }
        }, function(error){
          console.log('Error en getEncuesta: ' + error);
        })
      }

      function setFormData(data){
        $scope.dataAsegurado = {};
        $scope.data.tipoDocumento = data.documentType;
        $scope.data.numeroDocumento = data.documentNumber;
        $scope.data.nombreAsegurado = data.Nombre;
        $scope.data.apellidoPaternoAsegurado = data.ApellidoPaterno;
        $scope.data.apellidoMaternoAsegurado = data.ApellidoMaterno;
        $scope.data.sexo = {
          Descripcion: data.Sexo === '1' ? 'Masculino' : 'Femenino',
          Codigo: data.Sexo
        };
        $scope.data.tipo = null;
        $scope.data.fechaNacimiento = new Date(data.year.Codigo, data.month.Codigo - 1, data.day.Codigo);
        $scope.data.tipoPersona = data.tipoPersona;
      }

      // EVENTS
      $scope.onProductChange = function() {
        if ($scope.data.producto) {
          $scope.showPlan = $scope.data.producto.CodigoProducto === 48;
          $scope.data.plan = $scope.showPlan ? { Codigo: 'A', Descripcion: 'PLAN A' } : { Codigo: null, Descripcion: '' };
          $scope.showPrimaList = true;

          saludFactory.getPrimaList($scope.data.producto.CodigoCompania, $scope.data.producto.CodigoRamo, $scope.data.producto.CodigoModalidad, $scope.data.producto.NumeroContrato, $scope.data.producto.NumeroSubContrato, true).then(function(data) {
            $scope.productoData = data.Data;
            $scope.primaListFirstTable = $scope.productoData.Primas;
            $scope.primaListSecondTable = $scope.primaListFirstTable.splice(7);
            codigoProductoSalud = $scope.primaListFirstTable[0].CodigoProductoSalud;
            codigoSubProductoSalud = $scope.primaListFirstTable[0].CodigoSubProductoSalud;
            saludFactory.spliceListPrimas($scope.primaListFirstTable, $scope.primaListSecondTable);
          });

          saludFactory.getFraccionamientoSalud($scope.data.producto.CodigoCompania, $scope.data.producto.CodigoRamo, $scope.data.producto.NumeroContrato, $scope.data.producto.NumeroSubContrato).then(function(response) {
            if (response.OperationCode === constants.operationCode.success) {
              $scope.tiposFinanciamiento = response.Data;
            } else {
              mModalAlert.showError(response.Message, 'Error');
            }
          }).catch(function(err){
            mModalAlert.showError(err.data.message, 'Error');
          });

          getEncuesta();
        } else {
          $scope.showPlan = false;
          $scope.showPrimaList = false;
        }
      };

      $scope.onPlanChange = function() {
        if ($scope.data.plan) {
          saludFactory
            .getPrimaList($scope.data.producto.CodigoProducto, $scope.data.plan.Codigo, true)
            .then(function(data) {
              $scope.productoData = data.Data;
              $scope.primaListFirstTable = $scope.productoData.Primas;
              $scope.primaListSecondTable = $scope.primaListFirstTable.splice(7);
              codigoProductoSalud = $scope.primaListFirstTable[0].CodigoProductoSalud;
              codigoSubProductoSalud = $scope.primaListFirstTable[0].CodigoSubProductoSalud;
            });
        }
      };

      $scope.onShowInsuredForm = function() {
        $scope.showInsuredForm = true;
        $scope.data.tipoDocumento = null;
        $scope.data.numeroDocumento = '';
        _clearInsured();
      };

      $scope.onHiddenInsuredForm = function() {
        $scope.disabledForm = false;
        $scope.showInsuredForm = false;
      };

      function _validateInsuredForm(){
        return $scope.aseguradoValid;
      }
      function _addInsured(insured){
        $scope.insuredsList.push(insured);
        $scope.showInsuredForm = false;
        $scope.showInsuredResumen = true;
      }
      function _paramsPostInsuredValidate(){
        var vParams = {
          codigoCompania: $scope.data.producto.CodigoCompania,
          codigoRamo: $scope.data.producto.CodigoRamo,
          numeroContrato: $scope.data.producto.NumeroContrato,
          numeroSubContrato: $scope.data.producto.NumeroSubContrato,
          Asegurado: {
            TipoDocumento:    {Codigo: $scope.data.tipoDocumento.Codigo, Descripcion: $scope.data.tipoDocumento.Descripcion},
            NumeroDocumento:  $scope.data.numeroDocumento,
            FechaNacimiento:  formatDate(JSON.parse(JSON.stringify($scope.data.fechaNacimiento))),
            Sexo:             $scope.data.sexo,
            ApellidoPaterno:  $scope.data.apellidoPaternoAsegurado,
            ApellidoMaterno:  $scope.data.apellidoMaternoAsegurado,
            Nombre:           $scope.data.nombreAsegurado,
            TipoAsegurado:    {Codigo: $scope.data.tipoPersona.Codigo, Descripcion: $scope.data.tipoPersona.Descripcion}
          }
        };
        return vParams;
      }
      $scope.onAddInsuredData = function() {
        $scope.$broadcast('submitForm', true);
        if (_validateInsuredForm() && $scope.data.producto){
          var vParams = _paramsPostInsuredValidate();

          var vInsured = vParams.Asegurado;
          var vInsuredType = vInsured.TipoAsegurado.Codigo;
          insuredDocumentNumberValidate = vInsured.NumeroDocumento;

          saludFactory.postInsuredValidate(vParams, true).then(function(res) {
            if (res.OperationCode === 200) {
              if (_.find($scope.insuredsList, _existDocumentNum)) {
                documentNumberAlert();
              } else {
                // Validación para un sólo titular, un sólo conyuge, titular y conyuge de distintos sexos y 4 hijos máximo
                switch (vInsuredType) {
                  case 'TI':
                    if (_.find($scope.insuredsList, _existTitular)) {
                      oneTitularAlert();
                    } else if (_.find($scope.insuredsList, _existConyuge)) {
                      var conyuge = _.find($scope.insuredsList, _existConyuge);
                      if (vInsured.Sexo.Codigo === conyuge.Sexo.Codigo) {
                        sexoTitularAlert();
                      } else {
                        _addInsured(vInsured);
                      }
                    } else {
                      _addInsured(vInsured);
                    }
                    break;
                  case 'CO':
                    if (_.find($scope.insuredsList, _existConyuge)) {
                      oneConyugeAlert();
                    } else if (_.find($scope.insuredsList, _existTitular)) {
                      var titular = _.find($scope.insuredsList, _existTitular);
                      if (vInsured.Sexo.Codigo === titular.Sexo.Codigo) {
                        sexoConyugeAlert();
                      } else {
                        _addInsured(vInsured);
                      }
                    } else {
                      _addInsured(vInsured);
                    }
                    break;
                  case 'HI':
                    if (countChildrens < 4) {
                      _addInsured(vInsured);
                      countChildrens++;
                    } else {
                      fourthChildrensAlert();
                    }
                    break;
                }
              }
            } else if (res.OperationCode === 900) {
              mModalAlert.showInfo('', res.Message);
            }
          });
        }
      };

      function evalAgentViewDcto(){
        var params = {CodigoAgente: oimClaims.agentID}
        proxyGeneral.EsDescuentoIntegralidadParaAgentes(params, false)
        .then(function(response){
          $scope.formVida.viewDcto = response.Data
        });
      }

      $scope.onDocumentChange = function() {
        $scope.data.numeroDocumento = '';
        var numDocValidations = {};
        mainServices.documentNumber.fnFieldsValidated(numDocValidations, $scope.data.tipoDocumento.Codigo, 1);

        $scope.docNumMaxLength = numDocValidations.DOCUMENT_NUMBER_MAX_LENGTH;
        $scope.docNumMinLength = numDocValidations.DOCUMENT_NUMBER_MIN_LENGTH;
        $scope.docNumType = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE;
        $scope.docNumTypeDisabled = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE;
        _clearInsured();
      };

      $scope.onCleanInsuredData = function() {
        $scope.data.numeroDocumento = '';
        $scope.data.tipoDocumento = null;
        _clearInsured();
      };

      $scope.onDeleteRowInsuredResumen = function(index) {
        $scope.insuredsList.splice(index, 1);
      };

      if ($scope.insuredsList.length === 0) {
        $scope.formVida.PorDctoIntgPlaza = 0;
        $scope.formVida.DctoIntegralidad = false;
      }
      // FUNCTIONS
      function buscarPersona(tipo, numeroDocumento, fnCallback) {
        if (tipo == null || numeroDocumento.length === 0) {
          return;
        }
        saludFactory.getDataInsured(tipo, numeroDocumento, true).then(
          function(data) {
            if (data.OperationCode === 200) {
              if (typeof fnCallback === 'function') {
                fnCallback(data);
              }
            }
          }
        );
        }

      function _clearInsured() {
        $scope.data.apellidoPaternoAsegurado = '';
        $scope.data.apellidoMaternoAsegurado = '';
        $scope.data.nombreAsegurado = '';
        $scope.data.sexo = null;
        $scope.data.fechaNacimiento = null;
        $scope.data.tipoPersona = null;
      }
      $scope.searchInsured = function() {
        _clearInsured();
        buscarPersona($scope.data.tipoDocumento.Codigo, $scope.data.numeroDocumento, function(data) {
          $scope.data.nombreAsegurado = data.Data.Nombre;
          $scope.data.apellidoPaternoAsegurado = data.Data.ApellidoPaterno;
          $scope.data.apellidoMaternoAsegurado = data.Data.ApellidoMaterno;
          $scope.dataAsegurado = data.Data;
          $scope.data.sexo =
            data.Data.Sexo === '1'
              ? { Codigo: '1', Descripcion: 'Masculino' }
              : { Codigo: '0', Descripcion: 'Femenino' };
          $scope.data.tipo = null;

          if ($scope.dataAsegurado.FechaNacimiento !== '') {
            var split = $scope.dataAsegurado.FechaNacimiento.split('/');
            if (split.length === 3) {
              $scope.data.fechaNacimiento = new Date(split[2], split[1] - 1, split[0]);
            }
            $scope.enableFecha = true;
          } else {
            $scope.enableFecha = false;
          }

          $scope.data.buscado = true;
        });
      };

      $scope.validationFormQuote = function() {
        $scope.formVida.markAsPristine();

        if ($scope.data.producto.CodigoProducto != null) {
          if (
            $scope.data.producto.CodigoProducto === 48 &&
            $scope.data.plan.Codigo != null &&
            $scope.data.financiamiento.Codigo != null &&
            $scope.data.moneda.Codigo != null &&
            $scope.data.fechaActual != null &&
            $scope.data.fechaVencimiento != null
          ) {
            _validateQuoteWithInsureds();
          } else if (
            $scope.data.financiamiento.Codigo != null &&
            $scope.data.moneda.Codigo != null &&
            $scope.data.fechaActual != null &&
            $scope.data.fechaVencimiento != null
          ) {
            _validateQuoteWithInsureds();
          }
        }
      };

      function _existTitular(insured) {
        return insured.TipoAsegurado.Codigo === 'TI';
      }

      function _existConyuge(insured) {
        return insured.TipoAsegurado.Codigo === 'CO';
      }

      function _existDocumentNum(insured) {
        return insured.NumeroDocumento === insuredDocumentNumberValidate;
      }
      function _validateQuoteWithInsureds() {
        if ($scope.insuredsList.length > 0) {
          var quotationPost = {
            CodigoSistema: oimAbstractFactory.getOrigin(),
            PorDctoIntgPlaza: $scope.formVida.PorDctoIntgPlaza || 0,
            MarcaPorDctoIntegralidad: $scope.formVida.DctoIntegralidad ? 'S' : 'N',
            producto: {
              codigoCompania: $scope.data.producto.CodigoCompania,
              codigoRamo: $scope.data.producto.CodigoRamo,
              numeroContrato: $scope.data.producto.NumeroContrato,
              numeroSubContrato: $scope.data.producto.NumeroSubContrato,
              CodigoModalidad: $scope.data.producto.CodigoModalidad
            },
            asegurados: $scope.insuredsList,
            codigoFinanciamiento: $scope.data.financiamiento.Codigo,
            codigoMoneda: $scope.data.moneda.Codigo,
            fechaInicio: formatDate(JSON.parse(JSON.stringify($scope.data.fechaActual))),
            fechaFin: formatDate(JSON.parse(JSON.stringify($scope.data.fechaVencimiento))),
            CodigoAgente: $scope.mAgente.codigoAgente
          };
          saludFactory.postQuotationSalud(quotationPost, true).then(function(res) {
            if (res.OperationCode === 200) {
              var quotationResponse = res.Data;
              if($scope.encuesta.mostrar == 1){
                $scope.encuesta.numOperacion = quotationResponse.NumeroDocumento;
                $state.go('cotizacionGuardadaSalud', { numDoc: quotationResponse.NumeroDocumento, encuesta: $scope.encuesta}, { reload: true, inherit: false });
              }else{
                $state.go('cotizacionGuardadaSalud', { numDoc: quotationResponse.NumeroDocumento }, { reload: true, inherit: false });
              }
            } else {
              mModalAlert.showInfo('', res.Message);
            }
          });
        } else {
          addInsuredAlert();
        }
      }

    $scope.obtenerDctontegralidad = function() {
      if ($scope.formVida.DctoIntegralidad){
        if($scope.insuredsList.length > 0){
          getTitular();
          proxyGeneral
            .ObtenerDescuentoIntegralidad(
              constants.module.polizas.salud.companyCode,
              oimClaims.agentID,
              $scope.data.producto.CodigoRamo,
              $scope.titular.TipoDocumento.Codigo,
              $scope.titular.NumeroDocumento
            )
            .then(function(response) {
              if (response.OperationCode == constants.operationCode.success) {
                $scope.formVida.PorDctoIntgPlaza = response.Data;
              }
            })
            .catch(function(error) {
              console.log('Error en obtenerDctontegralidad: ' + error);
            });
        }
      } else {
        $scope.formVida.PorDctoIntgPlaza = 0;
        $scope.formVida.DctoIntegralidad = false;
      }
    };
    function getTitular() {
      $scope.titular = _.find($scope.insuredsList, function(o) {
        if (o.TipoAsegurado.Codigo === 'TI') {
          return o;
        }
      });
    }

      function formatDate(date) {
        var format = date.slice(0, 10);
        return format.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, '$3/$2/$1');
      }

      // MODALS
      function addInsuredAlert() {
        mModalAlert.showWarning('Debe ingresar un asegurado', 'ALERTA');
      }

      function fourthChildrensAlert() {
        mModalAlert.showWarning('Solo puedes agregar hasta 4 hijos', 'ALERTA');
      }

      function oneTitularAlert() {
        mModalAlert.showWarning('Solo puedes agregar 1 titular', 'ALERTA');
      }

      function oneConyugeAlert() {
        mModalAlert.showWarning('Solo puedes agregar 1 cónyuge', 'ALERTA');
      }

      function sexoTitularAlert() {
        mModalAlert.showWarning('El titular no puede tener el mismo sexo que el cónyuge', 'ALERTA');
      }

      function sexoConyugeAlert() {
        mModalAlert.showWarning('El cónyuge no puede tener el mismo sexo que el titular', 'ALERTA');
      }

      function documentNumberAlert() {
        mModalAlert.showWarning('Ya existe un asegurado con ese número de documento', 'ALERTA');
      }

      $scope.fnSeeDetail = function(){
        $scope.paramsFile = $scope.data.producto.CodigoRamo + '/' + $scope.data.producto.CodigoModalidad + '/' + $scope.data.producto.NumeroContrato + '/' + $scope.data.producto.NumeroSubContrato;
        $scope.attachFileQuoteURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/salud/descargar/archivoplan/' + $scope.paramsFile);
        $timeout(function() {
          document.getElementById('frmAttachFileQuote').submit();
        }, 500);
      };
      $scope.findAgent = function(wildcar) {
        return proxyAgente.GetListAgenteSalud({
          "CodigoNombre": wildcar, 
          "CodigoGestor": oimClaims.gestorId,
          "CodigoOficina": $scope.userRoot ? '0' : oimClaims.officeCode, 
          "RolUsuario": oimPrincipal.get_role()
        });
      }

      $scope.processData = function(data) {
        $scope.disabledForm = data.esFraudulento && !data.aceptaAdvertencia;
      };

  }

  return angular.module('appSalud')
    .controller('cotizadorSaludController', cotizadorSaludController)
    .factory('loaderCotizadorSaludController', ['saludFactory', '$q', 'mainServices',
      function(saludFactory, $q, mainServices){
        var lists;

        function _getLists(showSpin){
          var deferred = $q.defer();
          mainServices.fnReturnSeveralPromise([
            saludFactory.getProducts(),
            saludFactory.getDocumentType(false),
            saludFactory.getPlan(false),
            saludFactory.getSexo(false),
            saludFactory.getPersonType(false),
            saludFactory.getCurrencyType(false)
          ], showSpin).then(function(response){
            lists = response;
            deferred.resolve(lists);
          }, function (error){
            deferred.reject(error.statusText);
          });
          return deferred.promise;
        }

        return {
          getLists: function(showSpin){
            if (lists) return $q.resolve(lists);
            return _getLists(showSpin);
          }
        };
      }]);
});
