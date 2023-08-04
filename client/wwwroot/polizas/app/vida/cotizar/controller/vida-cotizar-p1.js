(function($root, deps, action) {
  define(deps, action);
})(this, ['angular', 'constants', 'helper' ,'generalConstantVida', 'lodash',
'mpfPersonComponent',
'/scripts/mpf-main-controls/components/contractorData/component/contractorData.js',
'/scripts/mpf-main-controls/components/contractorAddress/component/contractorAddress.js',
'/polizas/app/vida/proxy/vidaFactory.js'
], function(angular, constants, helper, generalConstantVida, _) {

  var appVida = angular.module('appVida');

  appVida.controller('vidaCotizarS1',
    ['$scope', 'oimClaims', 'oimPrincipal', '$state', '$timeout', '$window',
    'proxyGestor', 'proxyVida', 'proxyCotizacion', '$filter',
    'proxyAgente', 'mModalAlert', '$uibModal', '$q', 'vidaService',
    'vidaRoles', 'vidaFactory', 'quoteLists', 'mainServices', 'quotation',
    'proxyGeneral','proxyReferido', 'proxyListaNegra', '$uibModal', 'mModalConfirm',
    function($scope, oimClaims, oimPrincipal, $state, $timeout, $window,
      proxyGestor, proxyVida, proxyCotizacion, $filter,
      proxyAgente, mModalAlert, $uibModal, $q, vidaService,
      vidaRoles, vidaFactory, quoteLists, mainServices, quotation,
      proxyGeneral,proxyReferido, proxyListaNegra, $uibModal, mModalConfirm) {

      var capitalGarantizado;
      $scope.primaDeseadaCalculada = false;
      $scope.codCoberturaPPJ= generalConstantVida.codCoberturaPPJ;
      $scope.disableSgt = false;
      $scope.contractorDisabledForm = false;
      $scope.insuredDisabledForm = false;
      
      $scope.validaInsuredForm = false;
      $scope.validaContractorForm = false;
      $scope.activarInputCoberturaSecundaria = false;
      
      $scope.$on('personForm', function(event, data) {
        if (data.contratante) {
          $scope.validContratante = data.valid;
          $scope.data.dataContratante = data.contratante;
          $scope.data.dataContratante.showNaturalRucPerson = !data.legalPerson;
          setFormData(data.contratante);
        }
        if (data.asegurado) {
          $scope.validAsegurado = data.valid;
          $scope.data.asegurado = data.asegurado;
          $scope.data.asegurado.showNaturalRucPerson = !data.legalPerson;
          setFormData(data.asegurado, true);
        }
      });

      function _validateReferredNumber() {
        if($scope.formData.numReferido){
        proxyReferido.ValidateReferredNumber($scope.formData.numReferido,"ambos", $scope.mainStep.mAgente.codigoAgente,$scope.showAgent, true)              
        .then(function(response){
            if (response.data == "F1" || response.data == "F2"){
              mModalAlert.showWarning(response.mensaje, '')
              window.location.href = "/polizas/#"
            }
            else if(response.data == "F3" ){
              mModalAlert.showWarning(response.mensaje, '')
              $scope.disableSgt = true;
              $scope.formData.msjReferidoValidate = response.mensaje;
            }
            else{
              $scope.disableSgt = false;
              $scope.formData.msjReferidoValidate = null;
            }
          });
      }
      }
      
      function _birthDateSettings(){
        return {
          model: null,
          options:{
            formatYear: 'yy',
            maxDate: mainServices.date.fnSubtract(new Date(), 18, 'Y'),
            minDate: mainServices.date.fnSubtract(new Date(), 80, 'Y'),
            startingDay: 1
          },
          open: false,
          validate:{
            range:{
              maxDate: mainServices.date.fnSubtract(new Date(), 18, 'Y'),
              minDate: mainServices.date.fnSubtract(new Date(), 80, 'Y')
            }
          }
        };
      }


      function _disabledManager(){
        var vRole = oimPrincipal.get_role();
        var vResult = $scope.mainStep.isAdmin || vRole == vidaRoles.director || vRole == vidaRoles.eac;
        return !vResult;
      }
      function _showAgent(){
        var vRole = oimPrincipal.get_role();
        var vResult = $scope.mainStep.isAdmin || _.contains([vidaRoles.supervisor, vidaRoles.director, vidaRoles.gestor, vidaRoles.eac, vidaRoles.directore, vidaRoles.eacemi, vidaRoles.gestoremi], vRole);
        return vResult;
      }

      function setFormData(data, asegurado) {
        if (asegurado) {
          $scope.data.nombreAsegurado = data.Nombre;
          $scope.data.apellidoPaternoAsegurado = data.ApellidoPaterno;
          $scope.data.apellidoMaternoAsegurado = data.ApellidoMaterno;
          $scope.data.estadoCivil = {
            CodigoEstadoCivil: data.civilState.Codigo,
            NombreEstadoCivil: data.civilState.Descripcion,
            CodigoEstadoCivilTron: data.civilState.CodigoEstadoCivilTron,
          };
          $scope.data.sexo = data.Sexo == 1 ? 'H' : 'M';
          $scope.data.fechaNacimiento = {
            model: (function() {
              var date = data.month.Descripcion + '/' + data.day.Descripcion + '/' + data.year.Descripcion
              return  new Date(date).toISOString();
            })()
          }
          $scope.data.tipoDocumentoAsegurado = {
            TipoDocumento: data.documentType.Codigo,
            NombreTipoDocumento: data.documentType.Descripcion,
          };
          $scope.data.numDocAsegurado = data.documentNumber;
          $scope.data.mCorreoElectronicoAsegurado = data.CorreoElectronico || data.Correo;
          $scope.data.mTallaAsegurado = data.size;
          $scope.data.mPesoAsegurado = data.weight;
          //$scope.data.weight = data.weight;
          //$scope.data.size = data.size;
        } else {
          $scope.data.nombre = data.Nombre;
          $scope.data.apellidoPaterno = data.ApellidoPaterno;
          $scope.data.apellidoMaterno = data.ApellidoMaterno;
          $scope.data.tipoDocumento = {
            NombreTipoDocumento: data.documentType.Descripcion,
            TipoDocumento: data.documentType.Codigo
          };
          $scope.data.numDoc = data.documentNumber;
          $scope.data.telefonoFijo = data.Telefono;
          $scope.data.telefonoCelular = data.Telefono2;
          $scope.data.telefonoOficina = data.TelefonoOficina;
          $scope.data.mCorreoElectronico = data.CorreoElectronico || data.Correo;
          $scope.data.mProfesion = data.Profesion;
          $scope.data.mActividadEconomica = data.ActividadEconomica;
        }
      }

      $scope.setAsegurado = function() {
        $scope.$broadcast('submitForm', true);

        if ($scope.validContratante) {
          $scope.showAseguradoMsg = false;
          $scope.data.asegurado = $scope.data.IgualAsegurado
            ? $scope.data.dataContratante
            : {};
        } else {
          $scope.showAseguradoMsg = true;
          $scope.data.IgualAsegurado = !$scope.data.IgualAsegurado;
        }
      }
      $scope.saveAgent = function(agent){
        _validateReferredNumber();
      }

      $scope.mainStep = $scope.mainStep || {};
      $scope.firstStep = $scope.firstStep || {};
      $scope.secondStep = $scope.secondStep || {};

      $scope.data = $scope.firstStep || {};

      $scope.disabledPPJPU = false; // Variable para casos PPJ PU

      $scope.validContratante = false;
      $scope.companyCode = constants.module.polizas.vida.companyCode;
      $scope.appCode = personConstants.aplications.VIDA;
      $scope.formCodeCN = personConstants.forms.COT_VIDA_CN;
      $scope.formCodeAS = personConstants.forms.COT_VIDA_ASE;

      $scope.hiddenFields = [];
      $scope.formData = {};
      $scope.data.esProductoNuevo = $scope.firstStep.esProductoNuevo || false;
      $scope.fnFilter = $filter("date");
      $scope.data.contractorValidation = $scope.data.contractorValidation || {};
      $scope.data.insuredValidation = $scope.data.insuredValidation || {};
      if (typeof $scope.data.showNaturalRucPerson == 'undefined') $scope.data.showNaturalRucPerson = true;


      $scope.mainStep.isAdmin = oimPrincipal.isAdmin();

      $scope.disabledManager = _disabledManager();
      $scope.showAgent = _showAgent();


      $scope.userRoot = oimPrincipal.isAdmin();

      if (!$scope.mainStep.mAgente){
        var ag = oimPrincipal.getAgent();
        $scope.mainStep.mAgente = {
          codigoNombre: ag ? ag.codigoAgente + '-' + ag.codigoNombre : '',
          codigoAgente: ag ? ag.codigoAgente : ''
        };
      }

      $scope.formData.numReferido = JSON.parse(window.localStorage.getItem('profile')).numeroReferido;
      if($scope.showAgent){
        _validateReferredNumber();
      }


      if (!$scope.data.contractor) {
        $scope.data.contractor = {};
      }

      $scope.data.fechaNacimiento = $scope.data.fechaNacimiento || _birthDateSettings();
      // $scope.data.fechaNacimiento.range = $scope.data.fechaNacimiento.range || {range:{minDate:$scope.data.fechaNacimiento.options.minDate,maxDate:$scope.data.fechaNacimiento.options.maxDate}}

      if (!$scope.data.fechaVigencia) {
        $scope.data.fechaVigencia = $scope.fnFilter(new Date(), constants.formats.dateFormat);
      }

      if (!$scope.data.cotizaPor) {
        $scope.data.cotizaPor = "G";
      }

      if (!$scope.data.empMapfre) {
        $scope.data.empMapfre = "N";
      }

      if (!$scope.data.sexo) {
        $scope.data.sexo = 'H';
      }

      if ($scope.data.producto) {
        _validatePPJ();
        _validarCoberturasSecundariasPorRamo();
      }

      function _validatePPJ(){
        if(generalConstantVida.productsPPJ.find(function(element) {return element==$scope.data.producto.CodigoProducto})){
          $scope.disabledPPJPU = true;
          $scope.hiddenFields = [
            personConstants.fields.SIZE,
            personConstants.fields.WEIGHT
          ];
          $scope.data.empMapfre = "N" // setear en No empleado 
          $scope.data.fraccionamientoPago = {
            CodeResult : 4
          }; // Fraccionamiento Anual por defecto
          $scope.data.duracionPago = 1;
          $scope.data.fcobertura.ActivoDuracionPago = "N";
          $scope.data.duracionAnualidad = $scope.data.duracionSeguro;
        }
      }

      function organizarCoberturas(data) {
        data.sort(function(a, b) {
          return (a.MarcaPrincipal == 'S' ? 1 : 2) - (b.MarcaPrincipal == 'S' ? 1 : 2);
        });
        $scope.data.coberturas = [];
        data.forEach(function(item) {
          $scope.data.coberturas.push({
            CodigoCobertura: item.CodigoCobertura,
            MontoCobertura: item.MontoCobertura ? parseFloat(item.MontoCobertura).toFixed(2)  : capitalGarantizado,
            // Checked: item.MarcaPrincipal == 'S',
            Checked: item.ChkSeleccionCobertura == 'S',
            NombreCobertura: item.NombreCobertura,
            MarcaPrincipal: item.MarcaPrincipal,
            ValorMinimoAsegurado: item.ValorMinimoAsegurado,
            ValorMaximoAsegurado: item.ValorMaximoAsegurado,
            FactorAsegurado: item.FactorAsegurado
          });
        });
      }

      $scope.onProductChange = function(option) {
        // Codigo Dolar Centirenta 66102
        // Codigo Soles Centirenta 66101
        // Codigo Promocion
        $scope.data.codigoPromocion = "";
        $scope.data.visibleCodigoPromocion = false;
        $scope.data.showMessageError = 0;
        $scope.data.validoCodigoPromocion = true;
        $scope.data.codigoPromocionValidado = false;
        if ($scope.data.producto.CodigoProducto === 66102 || $scope.data.producto.CodigoProducto === 66101) {
          $scope.data.visibleCodigoPromocion = true;
        }

        _validarCoberturasSecundariasPorRamo();

        $scope.optionEdit  = option ? option : 0;
        if ($scope.data.producto && $scope.data.producto.CodigoProducto !== null) {
          if ($scope.data.producto.FlagRentaSegura === 'S') {
            $scope.data.esProductoNuevo = true;
            $scope.hiddenFields = [
              personConstants.fields.SIZE,
              personConstants.fields.WEIGHT
            ];
            $scope.data.moneda = null;
            $scope.data.moneda = {
              Codigo: '0' + $scope.data.producto.CodigoMoneda
            };
          } else {
            $scope.data.esProductoNuevo = false;
            $scope.hiddenFields = [];
          }

          proxyVida.GetListCoberturaVida(2, $scope.data.producto.CodigoProducto, true).then(function(data) {
            $scope.data.duracionAnualidad = $scope.data.duracionAnualidad || data.Data.DuracionAnualidad;
            $scope.data.duracionPago = $scope.data.duracionPago || data.Data.DuracionPago;
            if (!$scope.data.esProductoNuevo && !$scope.optionEdit) {
              $scope.data.duracionSeguro = data.Data.DuracionSeguro;
              $scope.data.duracionPago = data.Data.DuracionPago;
              $scope.data.duracionAnualidad = data.Data.DuracionAnualidad;
            }
            $scope.data.capitalEstimado1 = data.Data.CapitalEstimado1;
            $scope.data.capitalEstimado2 = data.Data.CapitalEstimado2;
            $scope.data.rentEstimada1 = data.Data.CapitalEstimado1;
            $scope.data.rentEstimada2 = data.Data.CapitalEstimado2;

            $scope.data.activoCapitalEstimado1 = data.Data.ActivoCapitalEstimado1;
            $scope.data.activoCapitalEstimado2 = data.Data.ActivoCapitalEstimado2;
            $scope.data.activoCheckCapitalEstimado2 = data.Data.ActivoCheckCapitalEstimado2;
            $scope.data.mRent2 = false;
            $scope.data.fcobertura = data.Data;

            // Validación de existencia de productos PPJ PU
            $scope.disabledPPJPU = false;
            _validatePPJ();

            data.Data.Cobertura.sort(function(it) {
              return it.MarcaPrincipal;
            });


            if (!vQuotationNumber || ($scope.data.producto.CodigoProducto != codigoProductoOriginal)){
              organizarCoberturas(data.Data.Cobertura);
            }

          }, function() {
              console.log(arguments);
          });
        }
      }

      $scope.onDuracionSeguroChange = function () {
        clearCodigoPromocion()
      }
      
      $scope.onCodigoPromocion = function () {
        if (!$scope.data.codigoPromocion || $scope.data.codigoPromocion.length === 0) {
          $scope.data.validoCodigoPromocion = false;
          $scope.data.codigoPromocionValidado = false;
          $scope.data.showMessageError = 0
          return
        }
        
        $scope.data.codigoPromocion = $scope.data.codigoPromocion.toUpperCase()
        $scope.data.validoCodigoPromocion = false;
        $scope.data.codigoPromocionValidado = false;
         if (!$scope.data.duracionSeguro.Value) {
           mModalAlert.showWarning("Por favor seleccione los años de duración del seguro.", "Codigo promoción.");
           return;
         }

         if(_validateForm()) {
          var bodyParams = {
            CodigoCia: "2", //Codigo Mapfre
            CodigoRamo: $scope.data.producto.CodigoRamo,
            CodigoModalidad: $scope.data.producto.CodigoProducto,
            CodigoAgente: "" + $scope.mainStep.mAgente.codigoAgente,
            DuracionSeguro: $scope.data.duracionSeguro.Value,
            FechaValidez: formatearFecha(),
            TipDocum: $scope.data.asegurado.TipoDocumento ||  $scope.firstStep.tipoDocumentoAsegurado.TipoDocumento,
            CodDocum: $scope.data.asegurado.CodigoDocumento || $scope.firstStep.numDocAsegurado,
            ImpPrima: $scope.data.primaComercial,
            PctDevolucion: $scope.data.devolucion.Value
          }
          var reqParams = $scope.data.codigoPromocion
          vidaFactory.verificarCodigoPromocion.verificarCodigo(bodyParams,reqParams).then(function (response) {
            if (response.Data == "OK") {
              $scope.data.validoCodigoPromocion = true;
              $scope.data.showMessageError = 0
              $scope.data.codigoPromocionValidado = true;
            } else {
              $scope.data.validoCodigoPromocion = false;
              $scope.data.showMessageError = 1
              $scope.data.codigoPromocionValidado = true;
            }
          }, function (error) {
            $scope.data.validoCodigoPromocion = false;
            $scope.data.showMessageError = 1
            $scope.data.codigoPromocionValidado = true;
          });
         }
         

         
      }

      function clearCodigoPromocion() {
        $scope.data.codigoPromocion = "";
        $scope.data.visibleCodigoPromocion = false;
        $scope.data.showMessageError = 0;
        $scope.data.validoCodigoPromocion = true;
        $scope.data.codigoPromocionValidado = false;
        if ($scope.data.producto.CodigoProducto === 66102 || $scope.data.producto.CodigoProducto === 66101) {
          $scope.data.visibleCodigoPromocion = true;
          
        }
      }

      function formatearFecha() {
        var dia = $scope.data.fechaVigencia.substring(0, 2)
        var mes = $scope.data.fechaVigencia.substring(3, 5)
        var anio = $scope.data.fechaVigencia.substring(6, 10)
        return anio + mes + dia
      }

      function _listGestores() {
        var vParam = {
          NombreGestor:   '',
          CodigoOficina:  $scope.userRoot ? '0' : oimClaims.officeCode,
          CodigoAgente:   $scope.mainStep.mAgente.codigoAgente,
          RolUsuario:     oimPrincipal.get_role()
        };
        proxyGestor.GetListGestor(vParam, true).then(function(data) {
          $scope.data.gestores = data.Data;
          if (!$scope.data.gestorSupervisor || $scope.data.gestorSupervisor.selectEmpty) {
            $scope.data.gestorSupervisor = $scope.data.gestores.filter(function(it) {
              return it.Codigo == "0";
            })[0];
          }
        }, function() {
          console.log(arguments);
        });
      }

      function _listMonedas(){
        proxyGeneral.GetListMonedaVida(true).then(function(response){
          $scope.data.monedas = response.Data || response.data;
        });
      }

      function _listDuracionSeguro(){
        proxyVida.GetListDuracionSeguro(true).then(function(response){
          $scope.data.listDuracionSeguro = response.Data || response.data;
        });
      }

      function _listPeriocidad() {
        proxyVida.GetListPeriocidad(true).then(function(data) {
          $scope.data.listPeriocidad = data.Data;
        });
      }

      function _listDevolucion() {
        proxyVida.GetListDevolucion(true).then(function(data) {
          $scope.data.listDevolucion = data.Data;
        });
      }

      function _listDiferimiento() {
        proxyVida.GetListDiferimiento(true).then(function(data) {
          $scope.data.listDiferimiento = data.Data;
        });
      }

      function _optsPagoAdelantado(){
        proxyVida.GetPagoAdelantado(true).then(function(response){
          $scope.data.pagoAdelantado = response.Data || response.data;
          $scope.data.pagoAdelantado.checked = response.Data.Valores[0].McaDefault;
        });
      }

      function _optsPeriodoGarantizado(){
        proxyVida.GetPeriodoGarantizado(true).then(function(response){
          $scope.data.periodoGarantizado = response.Data || response.data;
          $scope.data.periodoGarantizado.checked = response.Data.Valores[0].McaDefault;
        });
      }

      if (quoteLists){
        // $scope.productos = quoteLists[0].Data;
        $scope.productos = quoteLists[0].Data.filter(function(it) {return it.CodigoProducto != 60727});
        $scope.tiposDeDocumentos = quoteLists[1].Data;
        $scope.estadosCivil = quoteLists[2].Data;
        $scope.fraccPagoData = quoteLists[3].Data;
      if (!quotation){
        if (!$scope.data.producto || $scope.data.producto.selectEmpty) {
          $scope.data.producto = $scope.productos.filter(function(it) { return it.CodigoProducto == 60218; })[0];
          $scope.onProductChange();
        }
      }

        $scope.tiposDeDocumentosAsegurado = $scope.tiposDeDocumentos.filter(function(e) {
          if (e.TipoDocumento !== constants.documentTypes.ruc.Codigo) return e;
        });

        if (!$scope.data.gestores) _listGestores();

        $scope.data.moneda = {};
        $scope.data.ajusteRenta = $scope.data.ajusteRenta || 'N';
        $scope.data.periocidad = { Value: '1' };
        _listMonedas();
        _listDuracionSeguro();
        _listPeriocidad();
        _listDevolucion();
        _listDiferimiento();
        _optsPagoAdelantado();
        _optsPeriodoGarantizado();

      }


      var vQuotationNumber = null;
      var codigoProductoOriginal;

      if (quotation && !$scope.data.quotation){
    _loadQuotation(quotation);
    $scope.data.mIgualAsegurado ? _duplicateContractor() : _setInsured(quotation.Asegurado);
    $scope.data.IgualAsegurado = $scope.data.mIgualAsegurado;
      } else {
        $scope.validaContractorForm = true;
        $scope.validaInsuredForm = true;
      }


      function _isNaturalPerson(documentType, documentNumber){
        var vResult = documentType == constants.documentTypes.ruc.Codigo && documentNumber.startsWith('20');
        return !vResult;
      }


      $scope.fnOpenBirthDate = function(obj){
        obj.open = true;
      };
      $scope.fnChangeBirthDate = function() {
        var formatedDate = $filter('date')($scope.data.fechaNacimiento.model, 'ddMMyyyy')
        proxyGeneral.GetList(formatedDate, true)
        .then(function(data){
          $scope.data.edadActual = data.Data;
        });
      };



      $scope.onCoberturaChange = function(item) {
        if (item.MontoCobertura < item.ValorMinimoAsegurado) {
          item.MontoCobertura = item.ValorMinimoAsegurado;
        }
        if (item.MontoCobertura > item.ValorMaximoAsegurado) {
          item.MontoCobertura = item.ValorMaximoAsegurado;
        }

        $scope.data.coberturas.forEach(function(it) {
          if (it.MarcaPrincipal === 'N') {
            if ($scope.activarInputCoberturaSecundaria) {
              if (it.MontoCobertura === 0 || it.MontoCobertura > item.MontoCobertura) {
                it.MontoCobertura = item.MontoCobertura * (it.FactorAsegurado ? it.FactorAsegurado : 1);
              }
            } else {
              it.MontoCobertura = item.MontoCobertura * (it.FactorAsegurado ? it.FactorAsegurado : 1);
            }
          }
        });
        
      }

      $scope.onCoberturaSecundariaChange = function(item) {
        var coberturaPrincipal = _.find($scope.data.coberturas, function (cobertura) { return cobertura.MarcaPrincipal === 'S'; });
        if (item.MontoCobertura < coberturaPrincipal.ValorMinimoAsegurado) {
          item.MontoCobertura = coberturaPrincipal.ValorMinimoAsegurado;
        }
        if (item.MontoCobertura > coberturaPrincipal.MontoCobertura) {
          item.MontoCobertura = coberturaPrincipal.MontoCobertura;
        }        
      }

      $scope.onCheckCobertura = function (item) {
        if ($scope.activarInputCoberturaSecundaria) {
          if (generalConstantVida.codCoberturaExcluyente.find(function (ce) { return ce === item.CodigoCobertura; })) {
            var excluye = generalConstantVida.codCoberturaExcluyente.filter(function (ce) { return ce !== item.CodigoCobertura });
            $scope.data.coberturas.forEach(function (co) {
              if (excluye.find(function (ce) { return ce === co.CodigoCobertura; })) {
                co.Checked = false;
              }
            });
          }
        }
      }

      $scope.getContractorData = function(data) {
        if(data.hasOwnProperty('isClear')) this.validaContractorForm = data.isClear;
        
        if(data.esFraudulento) {
          $scope.contractorDisabledForm = data.esFraudulento && !data.aceptaAdvertencia;
        } else {
          $scope.contractorDisabledForm = false;
        if (angular.isDefined(data.documentType)) {
          $scope.data.tipoDocumento = {
            TipoDocumento: angular.isObject(data.documentType) ? data.documentType.Codigo : data.documentType
          };
        }
      }
      }

      $scope.processInsuredData = function(data) {
        if(data.hasOwnProperty('isClear')) this.validaInsuredForm = data.isClear;
        $scope.insuredDisabledForm = data.esFraudulento && !data.aceptaAdvertencia;
        $scope.$broadcast('submitForm', true);
      }


      function _paramsGenerarPrimaVida(){
        var vParams = {
          CodigoCompania:         2,
          CodigoProducto:         $scope.data.producto.CodigoProducto,
          FechaEmision:           $scope.data.fechaVigencia,
          DuracionSeguro:         $scope.data.duracionSeguro,
          DuracionPago:           $scope.data.duracionPago,
          FormaPago:              $scope.data.fraccionamientoPago.CodeResult,
          TipoDocumentoAsegurado: $scope.data.tipoDocumentoAsegurado.TipoDocumento,
          FechaNacimiento:        $scope.fnFilter($scope.data.fechaNacimiento.model, constants.formats.dateFormat),
          Sexo:                   $scope.data.sexo == 'H' ? '1' : '0',
          EmpleadoMapfre:         $scope.data.empMapfre,
          Monto:                  $scope.data.primaDeseada
        }
        return vParams;
      }
      $scope.calcularPrima = function() {
        if (_validateForm()){
          var vParams = _paramsGenerarPrimaVida();
          proxyCotizacion.GenerarPrimaVida(vParams, true).then(function(data) {
            if (data.Data) {
              organizarCoberturas(data.Data);
              $scope.primaDeseadaCalculada=true;
            } else {
              mModalAlert.showWarning("No se pudo calcular la prima", "Calculo de prima");
            }
          }, function() {
            console.log(arguments);
          });
        }
      };

      $scope.onGestorChange = function(item) {
        if ($scope.userRoot) {
          if (item.Codigo == '0'){
            var ag = oimPrincipal.getAgent();
            $scope.mainStep.mAgente = {
              codigoNombre: ag.codigoAgente + '-' + ag.codigoNombre,
              codigoAgente: ag.codigoAgente
            }
          }else{
            $scope.mainStep.mAgente = undefined;
          }
        }
      }

      $scope.clearPrimaDeseada = function(){
        $scope.data.primaDeseada = '';
        if($scope.disabledPPJPU){
          organizarCoberturas($scope.data.fcobertura.Cobertura);
          $scope.primaDeseadaCalculada = false;
        }
      }

      function _validateForm(){
        $scope.$broadcast('submitForm', true);
        $scope.fData.markAsPristine();
        return $scope.fData.$valid && $scope.validContratante && (!$scope.data.IgualAsegurado ? $scope.validAsegurado : true);
      }
      function _paramsEvaluacion(){
        var vBirthDate = $scope.fnFilter($scope.data.fechaNacimiento.model, constants.formats.dateFormat).replaceAll('/', '-');
        var vParamsIMC = {
          talla:  $scope.data.mTallaAsegurado,
          peso:   $scope.data.mPesoAsegurado,
          fecnac: vBirthDate,
          cod_modalidad: $scope.data.producto.CodigoProducto
        };
        var vParamsCumulo = {
          tDoc:           $scope.data.tipoDocumentoAsegurado.TipoDocumento,
          nDoc:           $scope.data.numDocAsegurado,
          suma_asegurada: ($scope.data.coberturas && $scope.data.coberturas.length > 0) ? $scope.data.coberturas[0].MontoCobertura : 0,
          modalidad:      $scope.data.producto.CodigoProducto,
          cod_moneda:     $scope.data.producto.CodigoMoneda
        };
        return {
          imc: vParamsIMC,
          cumulo: vParamsCumulo,
        };
      }

      $scope.onCalcularVida = function() {
        if (!$scope.mainStep.mAgente) {
          mModalAlert.showWarning("Por favor seleccione un agente", "Datos faltantes");
          return;
        }

        if (!$scope.data.validoCodigoPromocion && $scope.data.codigoPromocionValidado) {
          mModalAlert.showWarning("Codígo de promoción incorrecto, por favor ingrese uno nuevo.", "Codígo Promoción");
          return;
        }

        if ($scope.data.mIgualAsegurado) {
          $scope.data.tipoDocumentoAsegurado.TipoDocumento = $scope.data.tipoDocumento.TipoDocumento;
          $scope.data.numDocAsegurado = $scope.data.numDoc;
          $scope.data.nombreAsegurado = $scope.data.nombre;
          $scope.data.apellidoPaternoAsegurado = $scope.data.apellidoPaterno;
          $scope.data.apellidoMaternoAsegurado = $scope.data.apellidoMaterno;
          $scope.data.mCorreoElectronicoAsegurado = $scope.data.mCorreoElectronico;
        }

        // setTimeout(function() {
          if (_validateForm()){
            _validarDatosListaNegra();
          }
        // }, 100);
      }

      function _guardarData() {
            if ($scope.mainStep.mAgente.codigoAgente != '0'){

              if(($scope.data.producto.CodigoProducto ===  60303 || $scope.data.producto.CodigoProducto === 60306 
                || $scope.data.producto.CodigoProducto === 60213 || $scope.data.producto.CodigoProducto === 60214
                || $scope.data.producto.CodigoProducto === 60218 || $scope.data.producto.CodigoProducto === 60120  
                || $scope.data.producto.CodigoProducto === 60424 || $scope.data.producto.CodigoProducto === 60425
                || $scope.data.producto.CodigoProducto === 60428 || $scope.data.producto.CodigoProducto === 60429
                || $scope.data.producto.CodigoProducto === 60422 || $scope.data.producto.CodigoProducto === 60423 
                || $scope.data.producto.CodigoProducto === 60426 || $scope.data.producto.CodigoProducto === 60427) && $scope.data.coberturas.length>1) {
                var fechaNac = $filter('date')($scope.firstStep.fechaNacimiento.model, constants.formats.dateFormat)
                var edadActuarial = getAge(fechaNac);
                if(parseInt(edadActuarial) > 49 && $scope.data.coberturas[1].Checked && $scope.data.coberturas[2].Checked) {
                  mModalAlert.showWarning("La cobertura INVALIDEZ PERMANENTE TOTAL exige una edad máxima de 49 años. La cobertura MUERTE ACCIDENTAL exige una edad máxima de 49 años", "ALERTA");
                  return;
                }
              }

              $scope.firstStep = $scope.data;

              if ($scope.data.esProductoNuevo) {
                var flagTipoPersona = (mainServices.fnShowNaturalRucPerson($scope.firstStep.tipoDocumento.TipoDocumento, $scope.firstStep.numDoc)) ? 'S' : 'N';
                var requestCotizacion = {
                  cabecera: {
                    codigoAplicacion: 'OIM',
                    codigoUsuario: oimPrincipal.getUsername().toUpperCase()
                  },
                  poliza: {
                    fecEfecSpto: $scope.firstStep.fechaVigencia,
                    codAgt: $scope.mainStep.mAgente.codigoAgente
                  },
                  producto: {
                    codCia: constants.module.polizas.vida.companyCode.toString(),
                    codRamo: $scope.firstStep.producto.CodigoRamo.toString(),
                    codModalidad: $scope.firstStep.producto.CodigoProducto.toString()
                  },
                  contratante: {
                    mcaFisico: flagTipoPersona,
                    tipDocum: $scope.firstStep.tipoDocumento.TipoDocumento,
                    codDocum: $scope.firstStep.numDoc,
                    nombre: $scope.firstStep.nombre
                  },
                  asegurado: {
                    tipDocum: $scope.firstStep.tipoDocumentoAsegurado.TipoDocumento,
                    codDocum: $scope.firstStep.numDocAsegurado,
                    fecNacimiento: $filter('date')($scope.firstStep.fechaNacimiento.model, constants.formats.dateFormat),
                    mcaSexo: ($scope.firstStep.sexo === 'H') ? '1' : '0',
                    nombre: $scope.firstStep.mIgualAsegurado ? $scope.firstStep.nombre : $scope.firstStep.nombreAsegurado
                  },
                  riesgoVidaRenta: {
                    duracionSeg: $scope.firstStep.duracionSeguro.Value,
                    impPrimaUnica: Math.round($scope.firstStep.primaComercial * 100) / 100,
                    pctDevolucion: parseFloat($scope.firstStep.devolucion.Value),
                    periodoRenta: parseInt($scope.firstStep.periocidad.Value),
                    mcaPeriodoGarantizado: $scope.firstStep.periodoGarantizado.checked,
                    periodoDiferido: parseInt($scope.firstStep.diferimiento.Value),
                    mcaAjusteRenta: $scope.firstStep.ajusteRenta,
                    mcaPagoAdelantado: $scope.firstStep.pagoAdelantado.checked,
                    pctCesionComision: $scope.firstStep.cesionComision ? Math.round($scope.firstStep.cesionComision * 100) / 10000 : 0,
                    cotizarPor: 1, // 1 es por prima 2 es por renta objetivo
                    impRentaObjetivo: 0,
                    impCotiza: Math.round($scope.firstStep.primaComercial * 100) / 100,
                    codPromocion: $scope.firstStep.codigoPromocion
                  },
                  mcaGuardado: 'N'
                };

                if (flagTipoPersona === 'S') {
                  requestCotizacion.contratante.apePaterno = $scope.firstStep.apellidoPaterno;
                  requestCotizacion.contratante.apeMaterno = $scope.firstStep.apellidoMaterno;
                  requestCotizacion.asegurado.apePaterno = $scope.firstStep.mIgualAsegurado ? $scope.firstStep.apellidoPaterno : $scope.firstStep.apellidoPaternoAsegurado;
                  requestCotizacion.asegurado.apeMaterno = $scope.firstStep.mIgualAsegurado ? $scope.firstStep.apellidoMaterno : $scope.firstStep.apellidoMaternoAsegurado;
                }

                $scope.$parent.guardarCotizacionVida(requestCotizacion);
              }
              else {
                var vParamsEvaluacion = _paramsEvaluacion();
                var vArrayServices = [
                  vidaFactory.evaluarCotizacion.evaluacionIMC(vParamsEvaluacion['imc'], false),
                  vidaFactory.evaluarCotizacion.evaluacionCumulo(vParamsEvaluacion['cumulo'], false)
                ];
                mainServices.fnReturnSeveralPromise(vArrayServices, true).then(function(response){
                  var vResImc = response[0],
                      vResCumulo = response[1],
                      vMessage;
                  if (vResImc.COD == 200 && vResCumulo.COD == 200){
                    if ((vResImc.Resultado.Resultado == 'A' || vResImc.Resultado.Resultado == 'O')
                        && vResCumulo.Resultado.Resultado == 'A'){
                      vMessage = (vResImc.Resultado.Resultado == 'O') ? vResImc.Resultado.Mensaje : false;
                      if (vMessage){
                        mModalAlert.showWarning(vMessage, 'ALERTA').then(function(ok){
                          $scope.$parent.cotizacionVida($scope.optionEdit);
                        });
                      }else{
                        $scope.$parent.cotizacionVida($scope.optionEdit);
                      }
                    }else{
                      vMessage = (vResImc.Resultado.Resultado == 'R') ? vResImc.Resultado.Mensaje : vResCumulo.Resultado.Mensaje;
                      mModalAlert.showWarning(vMessage, 'ALERTA');
                    }
                  }else{
                    if (vResImc.COD == 400 || vResCumulo.COD == 400){
                      vMessage = (vResImc.COD == 400) ? vResImc.MSJ : vResCumulo.MSJ;
                      mModalAlert.showError(vMessage, 'ERROR');
                    }
                    if (vResImc.COD == 500 || vResCumulo.COD == 500){
                      vMessage = (vResImc.COD == 500) ? vResImc.MSJ : vResCumulo.MSJ;
                      mModalAlert.showWarning(vMessage, 'ALERTA');
                    }
                  }
                }, function(error){
                  // console.log('error');
                }, function(defaultError){
                  // console.log('errorDefault');
                });
              }
            }else{
              mModalAlert.showWarning('Por favor seleccione un agente.', 'DATOS FALTANTES')
            }
          }

      function getAge(age) {

        var arrayage = age.split("/");
        var today = new Date();
        var dateString = arrayage[2] + '-' + arrayage[1] + '-' + arrayage[0];
        var birthDate = new Date(dateString);

        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      }

      $scope.onDuracionSeguro = function() {
        var n = parseInt($scope.data.duracionSeguro);
        if (n < $scope.data.fcobertura.MinimoDuracionSeguro) {
          $scope.data.duracionSeguro = $scope.data.fcobertura.MinimoDuracionSeguro;
        }
        if (n > $scope.data.fcobertura.MaximoDuracionSeguro) {
          $scope.data.duracionSeguro = $scope.data.fcobertura.MaximoDuracionSeguro;
        }

        if ($scope.data.fcobertura.ActivoDuracionAnualidad == "N") {
          $scope.data.duracionAnualidad = $scope.data.duracionSeguro;
        }

        if ($scope.data.fcobertura.ActivoDuracionPago == "N") {
          if($scope.disabledPPJPU){
            $scope.data.duracionPago = 1; //Por defecto 1 para productos PPJ PU
            return
          }
          $scope.data.duracionPago = $scope.data.duracionSeguro;
        }
      }

      $scope.onDuracionPago = function() {
        var n = parseInt($scope.data.duracionPago);
        if (n < $scope.data.fcobertura.MinimoDuracionPago) {
          $scope.data.duracionPago = $scope.data.fcobertura.MinimoDuracionPago;
        }
        if (n > $scope.data.fcobertura.MaximoDuracionPago) {
          $scope.data.duracionPago = $scope.data.fcobertura.MaximoDuracionPago;
        }
      }

      $scope.onAnualidades = function() {
        var n = parseInt($scope.data.duracionAnualidad);
        if (n < $scope.data.fcobertura.MinimoDuracionAnualidad) {
          $scope.data.duracionAnualidad = $scope.data.fcobertura.MinimoDuracionAnualidad;
        }
        if (n > $scope.data.fcobertura.MaximoDuracionAnualidad) {
          $scope.data.duracionAnualidad = $scope.data.fcobertura.MaximoDuracionAnualidad;
        }
      }


      // $scope.findAgent = function(wildcar) {
      //   return proxyAgente.GetListAgenteVida({
      //     "CodigoNombre": wildcar, //filtro nombre agente
      //     "CodigoGestor": $scope.data.gestorSupervisor.Codigo, //combobox gestor seleccionado
      //     "CodigoOficina": $scope.$parent.userRoot ? '0' : oimClaims.officeCode, //dato de usuario logeado
      //     "McaGestSel": "S", //FIJO
      //     "RolUsuario": oimPrincipal.get_role() //$scope.$parent.mainStep.claims.rolUsuario //dato de usuario logeado
      //   });
      // }
      $scope.findAgent = function(wildcar) {
        clearCodigoPromocion();
        return proxyAgente.GetListAgenteVida({
          "CodigoNombre": wildcar, //filtro nombre agente
          "CodigoGestor": $scope.data.gestorSupervisor.Codigo, //combobox gestor seleccionado
          "CodigoOficina": $scope.userRoot ? '0' : oimClaims.officeCode, //dato de usuario logeado
          "McaGestSel": "S", //FIJO
          "RolUsuario": oimPrincipal.get_role() //$scope.$parent.mainStep.claims.rolUsuario //dato de usuario logeado
        });
      }

      // Organizar Rentabilidad
      $scope.onEstimado1 = function() {
        if ($scope.data.rentEstimada1 > $scope.data.fcobertura.MaximoCapitalEstimado1) {
          $scope.data.rentEstimada1 = $scope.data.fcobertura.MaximoCapitalEstimado1;
        }
        if ($scope.data.rentEstimada1 < $scope.data.fcobertura.MinimoCapitalEstimado1) {
          $scope.data.rentEstimada1 = $scope.data.fcobertura.MinimoCapitalEstimado1;
        }
      }

      $scope.onEstimado2 = function() {
        if ($scope.data.rentEstimada2 > $scope.data.fcobertura.MaximoCapitalEstimado2) {
          $scope.data.rentEstimada2 = $scope.data.fcobertura.MaximoCapitalEstimado2;
        }
        if ($scope.data.rentEstimada2 < $scope.data.fcobertura.MinimoCapitalEstimado2) {
          $scope.data.rentEstimada2 = $scope.data.fcobertura.MinimoCapitalEstimado2;
        }
      }

      $scope.format = constants.formats.dateFormat;
      $scope.maxDate = new Date();
      $scope.minDate = new Date();
      $scope.minDate.setFullYear($scope.minDate.getFullYear() - 100);


      /*########################
      # _getQuotation
      ########################*/
      function _checkInsured(contractor, insured){
        var vResult = false;
        if (contractor.TipoDocumento == insured.TipoDocumento && contractor.NumeroDocumento == insured.NumeroDocumento){
          vResult = true;
        }
        return vResult;
      }
      function _toDate(ins) {
        if (!ins || ins ==='') {
          return new Date();
        }
        return new Date(ins.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, '$3-$2-$1'));
      }
      function _loadQuotation(data){
        vQuotationNumber = data.NumeroCotizacion;
        capitalGarantizado = data.Corridas[0].CapitalGarantizado;
        $scope.data.quotation = data;
        $scope.optionEdit = vQuotationNumber > 0 ? 1 : 0;

        $scope.data.producto = {
          CodigoProducto: data.Producto.CodigoProducto, //60425
          CodigoRamo: data.Producto.CodigoRamo
        };

        codigoProductoOriginal = data.Producto.CodigoProducto;

        var fechaEfecto = data.FechaEfecto.split("/");
        var fecha = new Date(fechaEfecto[2], fechaEfecto[1] - 1, fechaEfecto[0]);

        $scope.data.fechaVigencia = new Date(fecha) < new Date() ? $filter('date')(new Date(), constants.formats.dateFormat) : data.FechaEfecto;
        //NO SE ACTUALIZA PORQUE NO SE LLEGA A GUARDAR
        // $timeout(function(){
        //   $scopa.data.gestorSupervisor = {
        //     Codigo: data.
        //   }
        // }, 0);
        $scope.mainStep.mAgente = {
          codigoNombre: data.Agente.CodigoAgente + '-' + data.Agente.NombreCompleto,
          codigoAgente: data.Agente.CodigoAgente
        };

        $scope.data.dataContratante = data.Contratante;
        $scope.data.asegurado = data.Asegurado;
        $scope.data.tipoDocumento = {
          TipoDocumento: data.Contratante.TipoDocumento
        };
        $scope.data.numDoc = data.Contratante.NumeroDocumento;

        mainServices.documentNumber.fnFieldsValidated($scope.data.contractorValidation, data.Contratante.TipoDocumento, 1);
        $scope.data.showNaturalRucPerson = mainServices.fnShowNaturalRucPerson(data.Contratante.TipoDocumento, data.Contratante.NumeroDocumento);

        $scope.data.nombre = data.Contratante.Nombre;
        $scope.data.apellidoPaterno = data.Contratante.ApellidoPaterno;
        $scope.data.apellidoMaterno = data.Contratante.ApellidoMaterno;
        $scope.data.telefonoFijo = data.Contratante.TelefonoCasa;
        $scope.data.telefonoOficina = data.Contratante.TelefonoOficina;
        $scope.data.telefonoCelular = data.Contratante.TelefonoMovil;
        $scope.data.mCorreoElectronico = data.Contratante.Correo;

        $scope.data.mIgualAsegurado = _checkInsured(data.Contratante, data.Asegurado);
        $scope.data.IgualAsegurado = _checkInsured(data.Contratante, data.Asegurado);
        $scope.data.tipoDocumentoAsegurado = {
          TipoDocumento: data.Asegurado.TipoDocumento
        };
        $scope.data.numDocAsegurado = data.Asegurado.NumeroDocumento;
        mainServices.documentNumber.fnFieldsValidated($scope.data.insuredValidation, data.Asegurado.TipoDocumento, 1);
        $scope.data.nombreAsegurado = data.Asegurado.Nombre;
        $scope.data.apellidoPaternoAsegurado = data.Asegurado.ApellidoPaterno;
        $scope.data.apellidoMaternoAsegurado = data.Asegurado.ApellidoMaterno;
        $scope.data.estadoCivil = {
         CodigoEstadoCivil: data.Asegurado.EstadoCivil
        };
        $scope.data.sexo = (data.Asegurado.Sexo == '1') ? 'H' : 'M';
        $scope.data.fechaNacimiento.model = mainServices.datePicker.fnFormatIn(data.Asegurado.FechaNacimiento);
        $scope.data.edadActual = $filter('calculateActuarialAge')(_toDate(data.Asegurado.FechaNacimiento));
        $scope.data.mCorreoElectronicoAsegurado = data.Asegurado.Correo;
        $scope.data.mTallaAsegurado = data.Asegurado.Talla;
        $scope.data.mPesoAsegurado = data.Asegurado.Peso;
        $scope.data.correoElectronico = data.Asegurado.Correo;
        $scope.data.talla = data.Asegurado.Talla;
        $scope.data.peso = data.Asegurado.Peso;

        //Para Datos del Seguro => carga la data y bloquea inputs
        $scope.onProductChange($scope.optionEdit);
        //Actualizo los Datos del Seguro con la data guardada
        $scope.data.duracionSeguro = data.DuracionSeguro;
        $scope.data.duracionPago = data.DuracionPago;
        $scope.data.duracionAnualidad = data.DuracionAnualidad;

        $scope.data.cotizaPor = (data.MontoPagoSeguro > 0) ? 'P' : 'G'; //=> VALIDAR CON $scope.data.primaDeseada SI TIENE DATA ES 'P' else 'G'
        $scope.data.primaDeseada = (data.MontoPagoSeguro > 0) ? data.MontoPagoSeguro : ''; //=> se guarda como "MontoPagoSeguro": $scope.firstStep.primaDeseada || "0.0",
        $scope.data.fraccionamientoPago = {
          CodeResult : data.FormaPagoSeguro //data.FormaPago
        };
        $scope.data.empMapfre = data.mcaEmpleado; //(data.mcaEmpleado == 1) ? 'S' : 'N'; //data.mcaEmpleado;

        // Actualizo los datos de cobertura
        organizarCoberturas(data.Coberturas);

        $scope.data.rentEstimada1 = data.CapitalEstimado1;
        $scope.data.rentEstimada2 = data.CapitalEstimado2;

        $scope.data.showButtonClearContractor = true;
        $scope.data.showButtonClearInsured = true;


      }
      /*########################
      # _setContractor
      ########################*/
      function _setContractor(data){
        $scope.data.nombre = data.Nombre || '';
        $scope.data.apellidoPaterno = data.ApellidoPaterno || '';
        $scope.data.apellidoMaterno = data.ApellidoMaterno || '';
        $scope.data.telefonoFijo = data.Telefono || '';
        $scope.data.telefonoOficina = data.TelefonoOficina || '';
        $scope.data.telefonoCelular = data.Telefono2 || '';
        $scope.data.mCorreoElectronico = data.CorreoElectronico || data.Correo || '';

        $scope.data.dataContratante = data;
      }
      /*########################
      # fnSearchContractor
      ########################*/
      $scope.currentContractor = {};
      $scope.fnSearchContractor = function(isSearch){
        var vParamsContractor = {
          companyCode:    constants.module.polizas.vida.companyCode,
          documentType:   ($scope.data.tipoDocumento && $scope.data.tipoDocumento.TipoDocumento) ? $scope.data.tipoDocumento.TipoDocumento : null,
          documentNumber: $scope.data.numDoc
        };

        mainServices.documentNumber.fnFieldsValidated($scope.data.contractorValidation, vParamsContractor.documentType, 1);
        $scope.data.showNaturalRucPerson = mainServices.fnShowNaturalRucPerson(vParamsContractor.documentType, vParamsContractor.documentNumber);

        // if (vParamsContractor.documentType && vParamsContractor.documentNumber){
        if (vParamsContractor.documentType && vParamsContractor.documentNumber &&
            ($scope.currentContractor['documentType'] !== vParamsContractor.documentType ||
            $scope.currentContractor['documentNumber'] !== vParamsContractor.documentNumber)){

          $scope.currentContractor = vParamsContractor;
          _clearContractor(isSearch);
          if ($scope.data.mIgualAsegurado) _clearInsured(false);

          vidaFactory.proxyContratante.GetContratanteByNroDocumento(vParamsContractor.companyCode, vParamsContractor.documentType, vParamsContractor.documentNumber, true).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              var vData = response.data || response.Data;
              $scope.data.showButtonClearContractor = true;
              _setContractor(vData);
              if ($scope.data.mIgualAsegurado) _duplicateContractor();
            }else{
              if ($scope.data.mIgualAsegurado) $scope.data.mIgualAsegurado = false;
            }
          // }function(error){
          });
        }
      };
      /*########################
      # fnClearContractor
      ########################*/
      function _clearContractor(isSearch){
        if (!isSearch){
          $scope.data.tipoDocumento = {TipoDocumento: null};
          $scope.data.numDoc = '';
        }
        $scope.data.showButtonClearContractor = false;
        _setContractor({});
      }
      $scope.fnClearContractor = function(){
        $scope.currentContractor = {};
        _clearContractor(false);

        if ($scope.data.mIgualAsegurado){
          $scope.data.mIgualAsegurado = false;
          _clearInsured(false);
        }
      };
      /*########################
      # fnDuplicateContractor
      ########################*/
      function _currentContractor(){
        var vOldContractor = $scope.data.dataContratante || {};
        var vCurrentContractor = {
          Nombre: $scope.data.nombre,
          ApellidoPaterno: $scope.data.apellidoPaterno,
          ApellidoMaterno: $scope.data.apellidoMaterno,
          Telefono: $scope.data.telefonoFijo,
          TelefonoOficina: $scope.data.telefonoOficina,
          Telefono2: $scope.data.telefonoCelular,
          CorreoElectronico: $scope.data.mCorreoElectronico
        }
        var vContractor = _.merge({}, vOldContractor, vCurrentContractor);
        return vContractor;
      }
      function _duplicateContractor(){
        var vData = _currentContractor();
        $scope.data.tipoDocumentoAsegurado = {
          TipoDocumento: $scope.data.tipoDocumento.TipoDocumento
        };
        $scope.data.numDocAsegurado = $scope.data.numDoc;
        $timeout(function(){
          _setInsured(vData);
        }, 0);
      }
      $scope.fnDuplicateContractor = function(){
        if ($scope.data.mIgualAsegurado){
          _duplicateContractor();
        }else{
          $timeout(function(){
            _clearInsured(false);
          }, 0);
        }
      };
      $scope.fnEvalAsegurado = _fnEvalAsegurado;
      function _fnEvalAsegurado(){
        var type = $scope.data.tipoDocumentoAsegurado.TipoDocumento
        if(type === $scope.data.tipoDocumento.TipoDocumento
          && $scope.data.numDoc === $scope.data.numDocAsegurado){
           $scope.data.mIgualAsegurado = true;
         }
      }
      $scope.fnEvalNumDocAsegurado = _fnEvalNumDocAsegurado;
      function _fnEvalNumDocAsegurado(){
        var num = $scope.data.numDocAsegurado
        if(num === $scope.data.numDoc
          && $scope.data.tipoDocumento.TipoDocumento === $scope.data.tipoDocumentoAsegurado.TipoDocumento){
           $scope.data.mIgualAsegurado = true;
         }
      }
      /*########################
      # _setInsured
      ########################*/
      function _setInsured(data){
        $scope.data.nombreAsegurado = data.Nombre || '';
        $scope.data.apellidoPaternoAsegurado = data.ApellidoPaterno || '';
        $scope.data.apellidoMaternoAsegurado = data.ApellidoMaterno || '';
        $scope.data.estadoCivil = {
          CodigoEstadoCivil: data.CodigoEstadoCivil || null
        };
        $scope.data.sexo = (data.Sexo) ? (data.Sexo == '1') ? 'H' : 'M' : '';
        $scope.data.fechaNacimiento.model = mainServices.datePicker.fnFormatIn(data.FechaNacimiento);
        $scope.data.edadActual = $filter("calculateActuarialAge")($scope.data.fechaNacimiento.model);
        $scope.data.mCorreoElectronicoAsegurado = data.CorreoElectronico || data.Correo || '';
        $scope.data.asegurado = angular.merge(
          {},
    data,
          { Talla: $scope.data.mTallaAsegurado },
          { Peso: $scope.data.mPesoAsegurado }
          );
      }
      /*########################
      # fnSearchInsured
      ########################*/
      $scope.currentInsured = {};
      $scope.fnSearchInsured = function(isSearch){
        var vParamsInsured = {
          companyCode:    constants.module.polizas.vida.companyCode,
          documentType:   ($scope.data.tipoDocumentoAsegurado && $scope.data.tipoDocumentoAsegurado.TipoDocumento) ? $scope.data.tipoDocumentoAsegurado.TipoDocumento : null,
          documentNumber: $scope.data.numDocAsegurado
        };

        mainServices.documentNumber.fnFieldsValidated($scope.data.insuredValidation, vParamsInsured.documentType, 1);

        // if (vParamsInsured.documentType && vParamsInsured.documentNumber){
        if (vParamsInsured.documentType && vParamsInsured.documentNumber &&
            ($scope.currentInsured['documentType'] !== vParamsInsured.documentType ||
            $scope.currentInsured['documentNumber'] !== vParamsInsured.documentNumber)){

          $scope.currentInsured = vParamsInsured;
          _clearInsured(isSearch)
          vidaFactory.proxyContratante.GetContratanteByNroDocumento(vParamsInsured.companyCode, vParamsInsured.documentType, vParamsInsured.documentNumber, true).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              var vData = response.data || response.Data;
              $scope.data.showButtonClearInsured = true;
              _setInsured(vData);
            }
          });
        }
      };
      /*########################
      # fnClearInsured
      ########################*/
      function _clearInsured(isSearch){
        if (!isSearch){
          $scope.data.tipoDocumentoAsegurado = {TipoDocumento: null};
          $scope.data.numDocAsegurado = '';
        }
        $scope.data.showButtonClearInsured = false;
        _setInsured({});
      }
      $scope.fnClearInsured = function(){
        $scope.currentInsured = {};
        _clearInsured(false);
      };

      $timeout(function(){
        window.scrollTo(0,0);
      }, 5000);

      // VALIDACION LISTA NEGRA
      function _validarDatosListaNegra() {
        var reqLN = [];

        if($scope.data.dataContratante.CorreoElectronico) reqLN.push({ "tipo": "CORREO", "valor": $scope.data.dataContratante.CorreoElectronico });
        if($scope.data.dataContratante.Telefono2) reqLN.push({ "tipo": "TLF_MOVIL", "valor": $scope.data.dataContratante.Telefono2 });
        if($scope.data.dataContratante.Telefono) reqLN.push({ "tipo": "TLF_FIJO", "valor": $scope.data.dataContratante.Telefono });
        if($scope.data.dataContratante.TelefonoOficina) reqLN.push({ "tipo": "TLF_FIJO", "valor": $scope.data.dataContratante.TelefonoOficina });
        if($scope.data.asegurado.CorreoElectronico && ($scope.data.dataContratante.CorreoElectronico !== $scope.data.asegurado.CorreoElectronico)) reqLN.push({ "tipo": "CORREO", "valor": $scope.data.asegurado.CorreoElectronico });

        var tlfIgual = $scope.data.dataContratante.Telefono === $scope.data.dataContratante.TelefonoOficina;

        proxyListaNegra.ConsultaListaNegra(reqLN, true).then(function(response) {
          var datosLN = [];
          
          if(response.OperationCode === constants.operationCode.success) {
            var msg = "";

            var shoMsgTlfFijo = true;

            if (Array.isArray(response.Data)) {
              response.Data.forEach(function(element) {
                if(element.Resultado) {
                  var elemetLN = {
                    codAplicacion: personConstants.aplications.VIDA,
                    tipoDato: element.Tipo,
                    valorDato: element.Valor
                  };
  
                  datosLN.push(elemetLN);
  
                  switch(element.Tipo) {
                    case "CORREO": 
                      var fuente = element.Valor === $scope.data.dataContratante.CorreoElectronico ? 'contratante' : 'asegurado';
                      msg += "El correo del " + fuente + " est&aacute; en la tabla de Cliente/ Unidad inelegible por estudios t&eacute;cnicos.<br/>"; 
                      break;
                    case "TLF_MOVIL": 
                      msg += "El tel&eacute;fono celular del contratante est&aacute; en la tabla de Cliente/ Unidad inelegible por estudios t&eacute;cnicos.<br/>"; 
                      break;
                    case "TLF_FIJO": 
                      if(shoMsgTlfFijo) {
                        var fuente = tlfIgual ? 'oficina o casa' : element.Valor === $scope.data.dataContratante.TelefonoOficina ? 'oficina' : 'casa';
                        msg += "El tel&eacute;fono fijo (" + fuente + ") del contratante est&aacute; en la tabla de Cliente/ Unidad inelegible por estudios t&eacute;cnicos.<br/>"; 
                        if(tlfIgual) shoMsgTlfFijo = false;
                      }
                      break;
                    default: "";
                  }
                }
              });
            }

            if(msg === "") {
              _guardarData();
            } else {
              var profile = JSON.parse(window.localStorage.getItem('profile'));

              // EJECUTIVO
              if(!profile.isAgent && profile.userSubType === "1") {
                mModalAlert.showError(msg, 'Error');
              } else {
                var tipoPerfil = (profile.isAgent && profile.userSubType === "1") ? 'A' // AGENTE
                    : (profile.userSubType === "3" ? 'B' : null); //BROKER
        
                _confirmacionFraudulento(tipoPerfil, datosLN);
              }
            }
          }
        });
      }
  
      function _confirmacionFraudulento(perfil, datos) {
        if(!perfil) return;
  
        mModalConfirm.confirmError('Cliente/Unidad inelegible por estudios t&eacute;cnicos, la emisi&oacute;n estar&aacute; supedita a revisi&oacute;n.<br/><br/>&iquest;DESEA CONTINUAR CON LA COTIZACI&Oacute;N?', '', 'SI', undefined, 'NO')
        .then(function(ok) {
            if(ok) {
              datos.forEach(function(element) {
                element.aceptaAdvertencia = true;
                proxyListaNegra.GuardarAuditoria(element).then();
              });
              _guardarData();
            } 
        }, function(res) {
          datos.forEach(function(element) {
            element.aceptaAdvertencia = false;
            proxyListaNegra.GuardarAuditoria(element).then();
          });
        });
  
        /*
        $uibModal.open({
          backdrop: 'static', // background de fondo
          backdropClick: true,
          dialogFade: false,
          keyboard: false,
          scope: $scope,
          windowTopClass:'popup',
          templateUrl : '/scripts/mpf-main-controls/components/mpf-person/components/popupListaNegra.html',
          controller : ['$scope', '$uibModalInstance', 'proxyListaNegra', function($scope, $uibModalInstance, proxyListaNegra) { 
            $scope.continuar = function(){
              datos.forEach(function(element) {
                element.aceptaAdvertencia = true;
                proxyListaNegra.GuardarAuditoria(element).then();  
              });

              $uibModalInstance.close();
              _guardarData();
            }
  
            $scope.cancelar = function(){
              datos.forEach(function(element) {
                element.aceptaAdvertencia = false;
                proxyListaNegra.GuardarAuditoria(element).then();  
              });

              $uibModalInstance.close();
            }
          }]
        });
        */
      }

      function _validarCoberturasSecundariasPorRamo() {        
        $scope.activarInputCoberturaSecundaria = _.contains(generalConstantVida.codRamosCoberturasSecundarias, $scope.data.producto.CodigoRamo);
      }

  }]);
});
