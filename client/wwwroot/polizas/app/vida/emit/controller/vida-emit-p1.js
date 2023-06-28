(function($root, deps, action) {
  define(deps, action);
})(this, ['angular', 'constants', 'helper', 'mpfPersonConstants',
  'mpfPersonComponent',
  '/scripts/mpf-main-controls/components/contractorData/component/contractorData.js',
  '/scripts/mpf-main-controls/components/contractorAddress/component/contractorAddress.js',
  '/polizas/app/vida/proxy/vidaFactory.js'],
  function(angular, constants, helper) {
  angular.module('appVida').controller('vidaEmitS1',
  ['$scope', '$state', '$stateParams', '$timeout', '$window', '$filter', 'mModalAlert', '$uibModal', 'mpSpin', 'liveQuotation', 'liveCivilStatus', 'liveEconomicActivities', 'liveOccupations', 'liveCountries', 'vidaService', 'mpfPersonFactory', 'mModalConfirm', 
  function($scope, $state, $stateParams, $timeout, $window, $filter, mModalAlert, $uibModal, mpSpin, liveQuotation, liveCivilStatus, liveEconomicActivities, liveOccupations, liveCountries, vidaService, mpfPersonFactory, mModalConfirm){

    (function onLoad() {

      $scope.mainStep = $scope.mainStep || {};
      $scope.firstStep = $scope.firstStep || {};
      $scope.secondStep = $scope.secondStep || {};
      $scope.thirdStep = $scope.thirdStep || {};

      $scope.data = $scope.firstStep;

      $scope.companyCode = constants.module.polizas.vida.companyCode;
      $scope.appCode = personConstants.aplications.VIDA;
      $scope.formCodeCN = personConstants.forms.EMI_VIDA_CN;
      $scope.formCodeAS = personConstants.forms.EMI_VIDA_ASE;
      $scope.formCodeAccionista = personConstants.forms.EMI_ACCIONISTA;
      if (angular.isUndefined($scope.data.isRucContratante)) $scope.data.isRucContratante = false;

      if (liveCivilStatus)        $scope.estadosCivil = liveCivilStatus;
      if (liveEconomicActivities) $scope.actividadesEconomicas = liveEconomicActivities;
      if (liveOccupations)        $scope.ocupaciones = liveOccupations;
      if (liveCountries)          $scope.paises = liveCountries;
      if (angular.isUndefined($scope.data.accionistasSocios)) $scope.data.accionistasSocios = false;
      if (angular.isUndefined($scope.data.showAccionista)) $scope.data.showAccionista = false;
      if(angular.isUndefined($scope.data.accionistas)){
        $scope.data.accionistas=[];
      }
      var n1 = 1;
      if(angular.isUndefined($scope.validContratante)){
        $scope.getDataContratante = function(data) {
          if(data.hasOwnProperty('documentNumber')){
            if(data.documentNumber != undefined){
              if(n1==1){
                typeDoc=data.documentType.Codigo;
                NumDoc=data.documentNumber;
                var NumDocAbreviado=NumDoc.substr(-20,2);
                if (typeDoc=="RUC" && NumDocAbreviado=="20" && $scope.data.showAccionista){
                   $scope.data.isRucContratante=true;
                   if($scope.data.accionistas.length == 0 ){
                    getAccionistasSociosAsociado(typeDoc,NumDoc);
                  }
                  n1=n1+1;
                }else{
                  $scope.data.isRucContratante=false;
                }
                
              }
            }
          }
          if(data.isClear) {
            n1=1;
            $scope.data.accionistasSocios = false;
            $scope.data.accionistas=[];
            $scope.data.isRucContratante=false;
            }
        }
      }
      if (liveQuotation && typeof liveQuotation.NumeroCotizacion !== 'undefined' && liveQuotation.NumeroCotizacion !== ''){
      	if (!$scope.mainStep.firstStepClone) {
          $scope.data.cotizacion = liveQuotation;
          $scope.data.showAccionista=$scope.data.cotizacion.showAccionista;
          _loadQuotation();
          $scope.mainStep.isVitalicio = $scope.data.cotizacion.FlagVitalicio === 'S';
          $scope.data.centroTrabajoAsegurado = liveQuotation.Asegurado.CentroTrabajo;
          $scope.data.cotizacion.Contratante.Ubigeo.NombreVia = liveQuotation.Contratante.Ubigeo.ViaDescripcion;
          $scope.data.cotizacion.Asegurado.Ubigeo.NombreVia = liveQuotation.Asegurado.Ubigeo.ViaDescripcion;
          if (liveQuotation.Asegurado.EstadoCivil) {
            $scope.data.cotizacion.Asegurado.civilState = {
              Codigo: liveQuotation.Asegurado.EstadoCivil
            };
          }
          var typeDoc=$scope.data.cotizacion.Contratante.TipoDocumento;
          var NumDoc=$scope.data.cotizacion.Contratante.NumeroDocumento;
          var NumDocAbreviado=NumDoc.substr(-20,2);
          if (typeDoc=="RUC" && NumDocAbreviado=="20" && $scope.data.showAccionista){
            console.log(NumDoc.substr(-20,2));
            $scope.data.isRucContratante=true;
            getAccionistasSociosAsociado(typeDoc,NumDoc);
          }else{
            $scope.data.isRucContratante=false;
          }
      	}
      } else {
        var vQuotationNumber = $stateParams.quotationNumber;
        $state.go('vidaDocuments.docs', {
          doc: 'pendingQuotes'
        });
        mModalAlert.showWarning( "No se encontro información para la cotización " + vQuotationNumber, "Busqueda cotización guardada");
      }

      $scope.$on('personForm', function(event, data) {

        if (data.contratante) {
          $scope.validContratante = data.valid;
          $scope.data.cotizacion.Contratante = data.contratante;
          $scope.data.ocupacion = data.contratante.Ocupacion;
          $scope.data.profesion = data.contratante.Profesion;
          _setContractorData('Contratante', data.contratante);
          _setContractorAddress($scope.data.cotizacion.Contratante)
        }
        if (data.asegurado) {
          $scope.validAsegurado = data.valid;
          $scope.data.cotizacion.Asegurado = data.asegurado;
          $scope.data.ocupacionAsegurado = data.asegurado.Ocupacion;
          $scope.data.profesionAsegurado = data.asegurado.Profesion;
          _setContractorData('Asegurado', data.asegurado);
          _setContractorAddress($scope.data.cotizacion.Contratante)
        }

        var socioPosition;
        _.forEach(_.keys(data), function(key) {
          socioPosition = key.split('-').length > 0 ? key.split('-')[1] : null;
        })
        if (socioPosition) {
          var socioData = data['socio-' + socioPosition];
          $scope.accionistaValid= data.valid;
          setSocioData(socioData, socioPosition);
          console.log('SOCIO',$scope.data.accionistas);
        }

      });

    })();
    

    $scope.addAccionista = function() {
      agregarAccionista();
    };
    $scope.$watch("data.accionistasSocios",function(newValue, oldValue){
      console.log("whatch",newValue,oldValue);
      if(newValue===oldValue){
        return;
      }
      if(!newValue){
        $scope.data.accionistas=[];
      }
      else{
        if($scope.data.accionistas.length==0){
          agregarAccionista();
        }
      }
    });
    $scope.removeAccionista = function(index) {
      $scope.data.accionistas.splice(index,1);
    }

    function agregarAccionista(){
      var accionista = {
        documentType: null,
        documentNumber: null,
        Relacion : null,
        Nombre : null,
        ApellidoMaterno :null,
        ApellidoPaterno :null,
        RazonSocial : null,
        PorParticipacion : null//BUILDSOFT
      };
      $scope.data.accionistas.push(accionista);
    };
    
    function getAccionistasSociosAsociado(typeDoc,NumDoc){
			$scope.data.accionistas = [];
			mpfPersonFactory.getAccionista(typeDoc,NumDoc)
			  .then(function(response){
          console.log("asociado vida",response);
				angular.forEach(response.Data, function(value){
				  if (response.Data != [] || response.Data != null){
					$scope.data.accionistasSocios = true;
					var accionista = {
					  documentType: { Codigo: value.TipDocumento },
					  documentNumber: value.NroDocumento,
					  Relacion : {Codigo: value.Relacion},
					  Nombre : value.Nombres,
					  ApellidoMaterno :value.ApellidoMaterno,
					  ApellidoPaterno :value.ApellidoPaterno,
					  RazonSocial : value.RazonSocial,
            		  PorParticipacion : value.PorParticipacion//BUILDSOFT
					};
					$scope.data.accionistas.push(accionista);
				  }else{
					$scope.data.accionistasSocios = false;
				  }
				});
				console.log("todos los datis para mnostrar", $scope.data.accionistas);
			  })
			  .catch(function (err) {
				console.error(err);
			  })
		  }

    function setSocioData(data, socioPosition) {
      $scope.data.accionistas[socioPosition].documentType = data.documentType;
      $scope.data.accionistas[socioPosition].documentNumber = data.documentNumber;
      $scope.data.accionistas[socioPosition].Relacion = data.Relacion;
      $scope.data.accionistas[socioPosition].Nombre = data.Nombre;
      $scope.data.accionistas[socioPosition].RazonSocial = data.Nombre;
      $scope.data.accionistas[socioPosition].ApellidoPaterno = data.ApellidoPaterno;
      $scope.data.accionistas[socioPosition].ApellidoMaterno = data.ApellidoMaterno;
      $scope.data.accionistas[socioPosition].PorParticipacion = data.PorParticipacion;//BUILDSOFT
    }


    function setearEstadoCivil() {
      if (!$scope.estadosCivil || !$scope.data.cotizacion.Contratante) return;

      $scope.data.estadoCivil = {
        CodigoEstadoCivil : ($scope.data.cotizacion.Contratante.EstadoCivil !== '') ? $scope.data.cotizacion.Contratante.EstadoCivil : null
      };
    }
    function setearEstadoCivilAsegurado() {
      if (!$scope.estadosCivil || !$scope.data.cotizacion.Asegurado) return;

      $scope.data.estadoCivilAsegurado = {
        CodigoEstadoCivil : ($scope.data.cotizacion.Asegurado.EstadoCivil !== '') ? $scope.data.cotizacion.Asegurado.EstadoCivil : null
      };
    }
    //_nationalityDisabled && set
    function _nationalityDisabled(){
      var vResult = typeof $scope.data.cotizacion !== 'undefined' && typeof $scope.data.cotizacion.Contratante !== 'undefined' && ($scope.data.cotizacion.Contratante.TipoDocumento == constants.documentTypes.dni.Codigo || $scope.data.cotizacion.Contratante.TipoDocumento == constants.documentTypes.ruc.Codigo);
      if (vResult){
        $scope.data.nacionalidad = {
          Codigo : 'PE'
        };
      }
      return vResult;
    }
    //_calendarBirthdateSettings
    function _calendarBirthdateSettings(){
      $scope.data.inlineOptions = {
        minDate: new Date(),
        showWeeks: true
      };
      $scope.data.optionsNewFechaNacimiento = {
        formatYear: 'yy',
        minDate: new Date(),
        startingDay: 1
      };

      $scope.data.toggleMin = function() {
        $scope.data.inlineOptions.minDate = $scope.data.inlineOptions.minDate ? null : new Date();
        $scope.data.optionsNewFechaNacimiento.minDate = $scope.data.inlineOptions.minDate;
      };
      $scope.data.toggleMin();

      $scope.data.openNewFechaNacimiento = function() {
        $scope.data.popupNewFechaNacimiento.opened = true;
      };

      $scope.data.formatDate = constants.formats.dateFormat;
      $scope.data.altInputFormats = ['M!/d!/yyyy'];
      $scope.data.mask = constants.formats.dateFormatMask;
      $scope.data.pattern = constants.formats.dateFormatRegex;

      $scope.data.popupNewFechaNacimiento = {
        opened: false
      };

    }
    //_changeNewFechaNacimiento
    function _changeNewFechaNacimiento(){
      var vBirthDate = $filter('date')($scope.data.cotizacion.Contratante.newFechaNacimiento, $scope.data.formatDate);
      $scope.data.edadActual = $filter('calculateAge')(vidaService.toDate(vBirthDate));
    }
    $scope.changeNewFechaNacimiento = function(){
      _changeNewFechaNacimiento();
    }
    //_checkInsuredData
    function _checkInsuredData(documentTypeC, documentTypeI, documentNumberC, documentNumberI){
      var vResult = (documentTypeC == documentTypeI && documentNumberC == documentNumberI);
      return vResult;
    }
    //
    function _showNaturalRucPerson(documentType, documentNumber){
      var vResult = (documentType == constants.documentTypes.ruc.Codigo && vidaService.fnStartsWith(documentNumber, '20'));
      return !vResult;
    }
    function _cloneData(){
      $scope.mainStep.firstStepClone = helper.clone($scope.data, false);
    }
    function _setProfession(dataContractor){
      if (dataContractor.Profesion && Object.keys(dataContractor.Profesion).length > 0){
        $scope.data.profesion = {
          Codigo : (dataContractor.Profesion.Codigo !== '') ? dataContractor.Profesion.Codigo : null
        }
      }
    }
    function _setOcupation(dataContractor){
      if (dataContractor.Ocupacion && Object.keys(dataContractor.Ocupacion).length > 0){
        $scope.data.ocupacion = {
          Codigo : (dataContractor.Ocupacion.Codigo !== '') ? dataContractor.Ocupacion.Codigo : null
        }
      }
    }
    function _setEconomicActivity(dataContractor){
      if (dataContractor.ActividadEconomica && Object.keys(dataContractor.ActividadEconomica).length > 0){
        $scope.data.actividadEconomica = {
          Codigo : (dataContractor.ActividadEconomica.Codigo !== '') ? dataContractor.ActividadEconomica.Codigo : null
        }
      }
    }
    function _setContractorData(name, data) {
      $scope.data.cotizacion[name].TelefonoCasa = data.Telefono;
      $scope.data.cotizacion[name].TelefonoMovil = data.Telefono2;
      $scope.data.cotizacion[name].TelefonoMovil = data.Telefono2;
      $scope.data.cotizacion[name].mNombreVia = data.NombreVia;
      $scope.data.cotizacion[name].newFechaNacimiento = data.FechaNacimiento;
      $scope.data.cotizacion[name].EstadoCivil = data.civilState.Codigo;
    }
    function _setContractorAddress(dataContractor){
      if (dataContractor.Ubigeo && Object.keys(dataContractor.Ubigeo).length > 0){
        var vFormData = $scope.data;
        var vFormContractorAddress = $scope.data.contractorAddress || {};
        var vDataContractorAddress = dataContractor.Ubigeo

        vFormContractorAddress.ubigeoData = {
          mDepartamento: data.Department,
          mProvincia: data.Province,
          mDistrito: data.District
        }

        vFormContractorAddress.mTipoVia = {
          Codigo: (vDataContractorAddress.CodigoVia && vDataContractorAddress.CodigoVia !== '') ? vDataContractorAddress.CodigoVia : null
        };
        vFormContractorAddress.mNombreVia = vDataContractorAddress.Direccion || vDataContractorAddress.TextoVia;
        vFormContractorAddress.mTipoNumero = {
          Codigo: (vDataContractorAddress.CodigoNumero && vDataContractorAddress.CodigoNumero !== '') ? vDataContractorAddress.CodigoNumero : null
        };
        vFormContractorAddress.mNumeroDireccion = vDataContractorAddress.TextoNumero;
        vFormContractorAddress.mTipoInterior = {
          Codigo: (vDataContractorAddress.CodigoInterior && vDataContractorAddress.CodigoInterior !== '') ? vDataContractorAddress.CodigoInterior : null
        };
        vFormContractorAddress.mNumeroInterior = vDataContractorAddress.TextoInterior;
        vFormContractorAddress.mTipoZona = {
          Codigo: (vDataContractorAddress.CodigoZona && vDataContractorAddress.CodigoZona !== '') ? vDataContractorAddress.CodigoZona : null
        };
        vFormContractorAddress.mNombreZona = vDataContractorAddress.TextoZona;
        vFormContractorAddress.mDirReferencias = vDataContractorAddress.Referencia;

        $scope.data.contractorAddress = vFormContractorAddress;
      }

    }
    function _loadQuotation(){
      $scope.data.IS_REQUIRED_GESTOR_COBRO = $scope.data.cotizacion.FrecuenciaPago.RequeridoGestorCobro == 'S';
      $scope.data.nationalityDisabled = _nationalityDisabled();
      $scope.data.showNaturalRucPerson = _showNaturalRucPerson($scope.data.cotizacion.Contratante.TipoDocumento, $scope.data.cotizacion.Contratante.NumeroDocumento);

      if ($scope.data.showNaturalRucPerson) {
        setearEstadoCivil();
        _calendarBirthdateSettings();
        $scope.data.cotizacion.Contratante.newFechaNacimiento = vidaService.outputFormatDatePicker($scope.data.cotizacion.Contratante.FechaNacimiento);
        _changeNewFechaNacimiento();
        _setProfession($scope.data.cotizacion.Contratante);
        _setOcupation($scope.data.cotizacion.Contratante);
      }

      $scope.data.paisResidencia = {Codigo : 'PE'};
      $scope.data.paisNatal = {Codigo : 'PE'};
      $scope.data.paisResidenciaFiscal = {Codigo : 'PE'};
      $scope.data.prefijo = '51';
      $scope.data.paisResidenciaAsegurado = {Codigo : 'PE'};
      $scope.data.paisNatalAsegurado = {Codigo : 'PE'};
      if ($scope.data.cotizacion.Contratante.EstadoCivil) {
        $scope.data.cotizacion.Contratante.civilState = {
          Codigo: $scope.data.cotizacion.Contratante.EstadoCivil
        }
      }

      $scope.data.cotizacion.Contratante.residenceCountry = {
        Codigo: $scope.data.paisResidenciaAsegurado.Codigo
      }
      $scope.data.cotizacion.Contratante.Telefono = $scope.data.cotizacion.Contratante.TelefonoCasa;
      $scope.data.cotizacion.Contratante.Telefono2 = $scope.data.cotizacion.Contratante.TelefonoMovil;
      $scope.data.cotizacion.Contratante.CorreoElectronico = $scope.data.cotizacion.Contratante.Correo;

      if ($scope.data.cotizacion.Contratante.TipoDocumento == constants.documentTypes.ruc.Codigo){
        _setEconomicActivity($scope.data.cotizacion.Contratante);
      }

      $scope.data.mIgualAsegurado = _checkInsuredData($scope.data.cotizacion.Contratante.TipoDocumento, $scope.data.cotizacion.Asegurado.TipoDocumento, $scope.data.cotizacion.Contratante.NumeroDocumento, $scope.data.cotizacion.Asegurado.NumeroDocumento);
      $scope.data.showNaturalRucPersonInsured = _showNaturalRucPerson($scope.data.cotizacion.Asegurado.TipoDocumento, $scope.data.cotizacion.Asegurado.NumeroDocumento);
      if ($scope.data.showNaturalRucPerson) {
        setearEstadoCivilAsegurado();
        $scope.data.edadActualAsegurado = $filter('calculateAge')(vidaService.toDate($scope.data.cotizacion.Asegurado.FechaNacimiento));
      }

      $timeout(function(){
        _setContractorAddress($scope.data.cotizacion.Contratante);
      }, 1000);

      _cloneData();
    }
    /*########################
    # fnChangeOcupation
    ########################*/
    function _validateOcupation(){
      var vOcupation = ($scope.data.mIgualAsegurado)
                          ? 'ocupacion'
                          : 'ocupacionAsegurado',
          vValid = !($scope.data[vOcupation] && $scope.data[vOcupation].Resultado == 'R');

      return {
        valid: vValid,
        ocupation: vOcupation,
        type: ($scope.data.mIgualAsegurado)
                        ? 'contratante'
                        : 'asegurado'
      };
    }
    $scope.fnChangeOcupation = function(){
      var vValidateOcupation = _validateOcupation();
      if (!vValidateOcupation.valid){
        mModalAlert.showWarning('Seleccione una ocupación del '+ vValidateOcupation.type +' permitida', 'ALERTA').then(function(ok){
          $scope.data[vValidateOcupation.ocupation] = {Codigo: null};
        });
      }
    };
    /*########################
    # nextStep
    ########################*/
    function _validateForm(){
      $scope.fData.markAsPristine();
      $scope.$broadcast('submitForm', true);
      var vMessage = {
            type: null,
            title: null,
            description: null
          },
          vValidateForm = $scope.validContratante && (!$scope.data.mIgualAsegurado ? $scope.validAsegurado : true),
          vValidateOcupation = _validateOcupation();
          vValid = $scope.fData.$valid && vValidateForm && vValidateOcupation.valid;

      if (!vValid){
        if(!vValidateOcupation.valid){
          vMessage.type = 'A';
          vMessage. title = 'ALERTA';
          vMessage.description = 'Seleccione una ocupación del '+ vValidateOcupation.type +' permitida';
        }
      }

      return {
        valid: vValid,
        message: vMessage
      };
    }
    $scope.nextStep = function() {
      var vValidateForm = _validateForm();
      if (vValidateForm.valid){
        _validarDatosListaNegra();
      }else{
        var vModalAlert = {
          A: mModalAlert.showWarning,
          E: mModalAlert.showError
        };
        if (vValidateForm.message.type) vModalAlert[vValidateForm.message.type](vValidateForm.message.description, vValidateForm.message.title);
      }
    };

    function _goNextStep() {
      $scope.firstStep = $scope.data;
      $state.go('.', {
        step : 2
      });
    }

    /*########################
    # ValidarListaNegra
    ########################*/
    function _validarDatosListaNegra() {
      var reqLN = [];

      if($scope.data.cotizacion.Contratante.CorreoElectronico) reqLN.push({ "tipo": "CORREO", "valor": $scope.data.cotizacion.Contratante.CorreoElectronico });
      if($scope.data.cotizacion.Contratante.Telefono2) reqLN.push({ "tipo": "TLF_MOVIL", "valor": $scope.data.cotizacion.Contratante.Telefono2 });
      if($scope.data.cotizacion.Contratante.Telefono) reqLN.push({ "tipo": "TLF_FIJO", "valor": $scope.data.cotizacion.Contratante.Telefono });
      if($scope.data.cotizacion.Contratante.TelefonoOficina) reqLN.push({ "tipo": "TLF_FIJO", "valor": $scope.data.cotizacion.Contratante.TelefonoOficina });
      //if($scope.data.cotizacion.Asegurado.CorreoElectronico && ($scope.data.cotizacion.Contratante.CorreoElectronico !== $scope.data.cotizacion.Asegurado.CorreoElectronico)) reqLN.push({ "tipo": "CORREO", "valor": $scope.data.cotizacion.Asegurado.CorreoElectronico });
      if($scope.data.cotizacion.Asegurado.Telefono2 && ($scope.data.cotizacion.Contratante.Telefono2 !== $scope.data.cotizacion.Asegurado.Telefono2)) reqLN.push({ "tipo": "TLF_MOVIL", "valor": $scope.data.cotizacion.Asegurado.Telefono2 });
      if($scope.data.cotizacion.Asegurado.Telefono && ($scope.data.cotizacion.Contratante.Telefono !== $scope.data.cotizacion.Asegurado.Telefono)) reqLN.push({ "tipo": "TLF_FIJO", "valor": $scope.data.cotizacion.Asegurado.Telefono });
      if($scope.data.cotizacion.Asegurado.TelefonoOficina && ($scope.data.cotizacion.Contratante.TelefonoOficina !== $scope.data.cotizacion.Asegurado.TelefonoOficina)) reqLN.push({ "tipo": "TLF_FIJO", "valor": $scope.data.cotizacion.Asegurado.TelefonoOficina });

      var tlfIgual = $scope.data.cotizacion.Contratante.Telefono === $scope.data.cotizacion.Contratante.TelefonoOficina;

      mpfPersonFactory.serviceValidBlackList(reqLN).then(function(response) {
        var datosLN = [];
        
        if(response.OperationCode === constants.operationCode.success) {
          var msg = "";

          var shoMsgTlfFijo = true;

          response.Data.forEach(function(element) {
            if(element.Resultado) {
              var elemetLN = {
                codAplicacion: personConstants.aplications.VIDA,
                numCotizacion: liveQuotation.NumeroCotizacion,
                tipoDato: element.Tipo,
                valorDato: element.Valor
              };

              datosLN.push(elemetLN);

              switch(element.Tipo) {
                case "CORREO": 
                  var fuente = element.Valor === $scope.data.cotizacion.Contratante.CorreoElectronico ? 'contratante' : 'asegurado';
                  msg += "El correo del " + fuente + " est&aacute; en la tabla de Cliente/ Unidad inelegible por estudios t&eacute;cnicos.<br/>"; 
                  break;
                case "TLF_MOVIL": 
                  var fuente = element.Valor === $scope.data.cotizacion.Contratante.Telefono2 ? 'contratante' : 'asegurado';
                  msg += "El tel&eacute;fono celular del " + fuente + " est&aacute; en la tabla de Cliente/ Unidad inelegible por estudios t&eacute;cnicos.<br/>"; 
                  break;
                case "TLF_FIJO": 
                  if(shoMsgTlfFijo) {
                  var fuente = element.Valor === $scope.data.cotizacion.Contratante.Telefono ? 'contratante' : 'asegurado';
                    var fuente2 = tlfIgual ? 'oficina o casa' : element.Valor === $scope.data.cotizacion.Contratante.TelefonoOficina ? 'oficina' : 'casa';
                    msg += "El tel&eacute;fono fijo (" + fuente2 + ") del " + fuente + " est&aacute; en la tabla de Cliente/ Unidad inelegible por estudios t&eacute;cnicos.<br/>"; 
                    if(tlfIgual) shoMsgTlfFijo = false;
                  }
                  break;
                default: "";
              }
            }
          });

          if(msg === "") {
            _goNextStep();
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
              mpfPersonFactory.serviceSaveAuditBlackList(element).then();  
            });
            _goNextStep();
          } 
      }, function(res) {
        datos.forEach(function(element) {
          element.aceptaAdvertencia = false;
          mpfPersonFactory.serviceSaveAuditBlackList(element).then();  
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
        controller : ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) { 
          $scope.continuar = function(){
            datos.forEach(function(element) {
              element.aceptaAdvertencia = true;
              mpfPersonFactory.serviceSaveAuditBlackList(element).then();  
            });

            $uibModalInstance.close();
            _goNextStep();
          }

          $scope.cancelar = function(){
            datos.forEach(function(element) {
              element.aceptaAdvertencia = false;
              mpfPersonFactory.serviceSaveAuditBlackList(element).then();  
            });

            $uibModalInstance.close();
          }
        }]
      });
      */
    }

  }]);

});
