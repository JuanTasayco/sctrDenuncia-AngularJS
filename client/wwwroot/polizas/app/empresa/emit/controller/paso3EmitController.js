define([
  'angular',
  'constants',
  'lodash',
  'mpfPersonConstants',
  'mpfPersonComponent',
  '/scripts/mpf-main-controls/components/contractorAddress/component/contractorAddress.js',
  '/polizas/app/empresa/factory/empresasFactory.js'
], function(angular, constants, _, personConstants){

  var appAutos = angular.module('appAutos');

  appAutos.controller('empresaEmitS3Controller', [
  	'$scope',
    '$window',
    '$state',
    'mainServices',
    'empresasFactory',
    '$timeout',
    'empresaListThirdStep',
    'mModalAlert',
    'proxyContratante',
  	function(
      $scope,
      $window,
      $state,
      mainServices,
      empresasFactory,
      $timeout,
      empresaListThirdStep,
      mModalAlert,
      proxyContratante){
      /*########################
      # _calendarSettings
      ########################*/

      function _calendarSettings(emissionStep){
        $scope.emit.FORMAT_DATE = "dd/MM/yyyy"
        $scope.inlineOptions = {
          minDate: new Date(),
          showWeeks: true
        };

        //seteo año max para contratante con mayoria de edad.
        var currentDate = new Date();
        var year = currentDate.getFullYear();
        var maxYear = year - 18;

        $scope.emitS3.dateOptions = {
          formatYear: 'yy',
          initDate: new Date(maxYear, currentDate.getMonth(), currentDate.getDate()),
          maxDate: new Date(maxYear, currentDate.getMonth(), currentDate.getDate()),
          minDate: new Date(1900, 1 - 1, 1),
          startingDay: 1
        };

        $scope.fnOpenCalendar = function() {
          $scope.emitS3.popupCalendar.opened = true;
        };

        $scope.emitS3.popupCalendar = {
          opened: false
        };

        $scope.emitS3.mFechaNacimiento = emissionStep.Contratante.mFechaNacimiento || new Date(maxYear, currentDate.getMonth(), currentDate.getDate())
      }
      /*########################
      # _loadContractorData
      ########################*/
      function _loadContractorData(emissionStep){
        var vContractor = emissionStep.Contratante;
        var vParamsContractor = {
          documentType:   (vContractor.TipoDocumento && vContractor.TipoDocumento.Codigo) ? vContractor.TipoDocumento.Codigo : null,
          documentNumber: vContractor.NumeroDocumento
        };
        $scope.showButtonClearContractor = !!vParamsContractor.documentType && !!vParamsContractor.documentNumber;
        mainServices.documentNumber.fnFieldsValidated($scope.emitS3, vParamsContractor.documentType, 1);
        $scope.showNaturalRucPerson = mainServices.fnShowNaturalRucPerson(vParamsContractor.documentType, vParamsContractor.documentNumber);
        $scope.emitS3.Sexo = (vContractor.Sexo === "MASCULINO") ? 'M' : 'F'
        $scope.emit.step.Contratante.mFechaNacimiento = (vContractor.FechaNacimiento) ? mainServices.datePicker.fnFormatIn(vContractor.FechaNacimiento) : null;
        $scope.contratanteDataLoaded = true;
        $scope.contratanteLoadedData = angular.copy($scope.emit.step.Contratante);
      }
      /*########################
      # _loadContractorAddress
      ########################*/
      function _loadContractorAddress(emissionStep){
        if (emissionStep.Contratante.Ubigeo){
          var vContractorAddress = emissionStep.Contratante.Ubigeo,
              vDataContractorAddress = $scope.emitS3.dataContractorAddress;

          vDataContractorAddress.mTipoVia = {
            Codigo: (vContractorAddress.CodigoVia !== '') ? vContractorAddress.CodigoVia : null
          };
          vDataContractorAddress.mNombreVia = vContractorAddress.Direccion;
          vDataContractorAddress.mTipoNumero = {
            Codigo: (vContractorAddress.CodigoNumero !== '') ? vContractorAddress.CodigoNumero : null
          };
          vDataContractorAddress.mNumeroDireccion = vContractorAddress.TextoNumero;
          vDataContractorAddress.mTipoInterior = {
            Codigo: (vContractorAddress.CodigoInterior !== '') ? vContractorAddress.CodigoInterior : null
          };
          vDataContractorAddress.mNumeroInterior = vContractorAddress.TextoInterior;
          vDataContractorAddress.mTipoZona = {
            Codigo: (vContractorAddress.CodigoZona !== '') ? vContractorAddress.CodigoZona : null
          };
          vDataContractorAddress.mNombreZona = vContractorAddress.TextoZona;
          vDataContractorAddress.mDirReferencias = vContractorAddress.Referencia;

        }
      }

      //datos de contacto del contratante
      function _loadContractorContact(emissionStep){
        $scope.emitS3.Telefono = emissionStep.Contratante.Telefono || "";
        $scope.emitS3.TelefonoMovil = emissionStep.Contratante.TelefonoMovil || "";
        $scope.emitS3.CorreoElectronico = emissionStep.Contratante.CorreoElectronico || "";
      }

      /*########################
      # onLoad
      ########################*/
      (function onLoad(){
        $scope.emit = $scope.emit || {};
        $scope.emitS1 = $scope.emitS1 || {};
        $scope.emitS2 = $scope.emitS2 || {};
        $scope.emitS3 = $scope.emitS3 || {};
        $scope.emitS4 = $scope.emitS4 || {};

        $scope.companyCode = constants.module.polizas.empresas.companyCode;
        $scope.appCode = personConstants.aplications.EMPRESA;
        $scope.formCodeCN = personConstants.forms.EMI_EMP_CN;

        $scope.emitS3.dataContractorAddress = $scope.emitS3.dataContractorAddress || {};
        if (empresaListThirdStep){
          $scope.emitS3.documentTypeData = empresaListThirdStep[0].Data;
          $scope.emitS3.professionData = empresaListThirdStep[1].Data;
          $scope.emitS3.occupationData = empresaListThirdStep[1].Data;
          $scope.emitS3.economicActivityData = empresaListThirdStep[2].Data;
          $scope.emitS3.postData = empresaListThirdStep[3].Data;
        }

        $scope.contratanteLoadedData = {};

        $scope.emit.step.Contratante.Telefono2 = $scope.emit.step.Contratante.TelefonoMovil;
        $scope.emit.step.Contratante.Representante = $scope.emit.step.Contratante.Representante;
        $scope.emit.step.Contratante.TipoCargoRep = $scope.emit.step.Contratante.Cargo ? $scope.emit.step.Contratante.Cargo.Codigo : "";
        $scope.emit.step.Contratante.Sexo = $scope.emit.step.Contratante.Sexo === "FEMENINO" ? "0" : "1";

        _calendarSettings($scope.emit.step);
        _loadContractorData($scope.emit.step);
        _loadContractorAddress($scope.emit.step);
        _loadContractorContact($scope.emit.step);

        $scope.isCompany = true;

        $scope.$on('personForm', function(event, data) {
          if (data.contratante) {
            $scope.contractorValid = data.valid;
            delete data.contratante.CodigoDocumento;
            $scope.emit.person = data.contratante;
            $scope.isCompany = data.legalPerson;
            _setContractor(data.contratante);
          }
        });

      })();
      /*########################
      # _setContractorAddress
      ########################*/
      function _setContractorAddress(data){
        var vContractorAddress = data.Ubigeo,
            vDataContractorAddress = $scope.emitS3.dataContractorAddress;
        if (data.Ubigeo){
          vDataContractorAddress.mTipoVia = {
          Codigo: (vContractorAddress.CodigoVia !== '') ? vContractorAddress.CodigoVia : null
          };
          vDataContractorAddress.mNombreVia = vContractorAddress.Direccion || vContractorAddress.NombreVia;
          vDataContractorAddress.mTipoNumero = {
            Codigo: (vContractorAddress.CodigoNumero !== '') ? vContractorAddress.CodigoNumero : null
          };
          vDataContractorAddress.mNumeroDireccion = vContractorAddress.TextoNumero || vContractorAddress.NumeroDescripcion;
          vDataContractorAddress.mTipoInterior = {
            Codigo: (vContractorAddress.CodigoInterior !== '') ? vContractorAddress.CodigoInterior : null
          };
          vDataContractorAddress.mNumeroInterior = vContractorAddress.TextoInterior || vContractorAddress.InteriorDescripcion;
          vDataContractorAddress.mTipoZona = {
            Codigo: (vContractorAddress.CodigoZona !== '') ? vContractorAddress.CodigoZona : null
          };
          vDataContractorAddress.mNombreZona = vContractorAddress.TextoZona || vContractorAddress.ZonaDescripcion || '';
          vDataContractorAddress.mDirReferencias = vContractorAddress.Referencia || '';

          vDataContractorAddress.ubigeoData = {
            mDepartamento: data.Department,
            mProvincia: data.Province,
            mDistrito: data.District
          }
        }else{
          $scope.emitS3.dataContractorAddress = {};
          $scope.emit.step.Contratante.Ubigeo = {
            Departamento: data.Department,
            Provincia: data.Province,
            Distrito: data.District,
            CodigoVia: data.Via ? data.Via.Codigo : "",
            CodigoNumero: data.NumberType ? data.NumberType.Codigo : "",
            CodigoInterior: data.Inside ? data.Inside.Codigo : "",
            CodigoZona: data.Zone ? data.Zone.Codigo : "",
            NombreVia: data.NombreVia,
            TextoNumero: data.TextoNumero,
            TextoInterior: data.TextoInterior,
            TextoZona: data.TextoZona,
            Referencia: data.Referencia
          };
        }
      }

      $scope.documentsChange = function (data) {
        if(data.TipoDocumento && data.CodigoDocumento){
          _setContractor(data);
          $scope.emitS3.endFirstSearch = true;
        }
      }
      /*########################
      # _setContractor
      ########################*/
      function _setContractor(data){
        var vEmissionStep = $scope.emit.step;

        vEmissionStep.Contratante.TipoDocumento = (data.documentType && data.documentType.Codigo !== '') ? data.documentType : null;
        vEmissionStep.Contratante.NumeroDocumento = data.documentNumber || '';
        vEmissionStep.Contratante.Nombre = data.Nombre || '';
        vEmissionStep.Contratante.ApellidoPaterno = data.ApellidoPaterno || '';
        vEmissionStep.Contratante.ApellidoMaterno = data.ApellidoMaterno || '';
        vEmissionStep.Contratante.FechaNacimiento = data.FechaNacimiento || '';
        vEmissionStep.Contratante.mFechaNacimiento = (data.FechaNacimiento) ? mainServices.datePicker.fnFormatIn(data.FechaNacimiento) : null;

        vEmissionStep.Contratante.Sexo = data.Sexo;

        vEmissionStep.Contratante.Profesion = (data.Profesion && data.Profesion.Codigo !== '') ? data.Profesion : {Codigo: null};
        vEmissionStep.Contratante.Ocupacion = (data.Ocupacion && data.Ocupacion.Codigo !== '') ? data.Ocupacion : {Codigo: null};

        vEmissionStep.Contratante.ActividadEconomica = (data.ActividadEconomica && data.ActividadEconomica.Codigo !== '') ? data.ActividadEconomica : {Codigo: null};

        _setContractorAddress(data);
        vEmissionStep.Contratante.Telefono = data.Telefono || '';
        vEmissionStep.Contratante.TelefonoMovil = data.Telefono2 || '';
        vEmissionStep.Contratante.Telefono2 = data.Telefono2 || '';
        vEmissionStep.Contratante.CorreoElectronico = data.CorreoElectronico || '';

        vEmissionStep.Contratante.Representante = $scope.emitS3.endFirstSearch ? data.Representante : vEmissionStep.Contratante.Representante;
        vEmissionStep.Contratante.Cargo = (data.RepresentanteCargo && data.RepresentanteCargo.Codigo !== '') ? data.RepresentanteCargo : null;

        if(!$scope.isCompany){
          delete vEmissionStep.Contratante.Representante;
          delete vEmissionStep.Contratante.Cargo;
        }
        delete vEmissionStep.Contratante.CodigoDocumento;

        $scope.contratanteLoadedData = data;
      }
      /*########################
      # fnClearContractor
      ########################*/
      $scope.fnClearContractor = function(isSearch){
        var vEmissionStep = $scope.emit.step;

        if (!isSearch){
          vEmissionStep.Contratante.TipoDocumento = {Codigo: null};
          vEmissionStep.Contratante.NumeroDocumento = '';
        }
        $scope.showButtonClearContractor = false;
        _setContractor({});
      };
      /*########################
      # fnSearchContractor
      ########################*/
      $scope.fnSearchContractor = function(isSearch){
        var vEmissionStep = $scope.emit.step;
        var vParamsContractor = {
          companyCode:    constants.module.polizas.empresas.companyCode,
          documentType:   (vEmissionStep.Contratante.TipoDocumento && vEmissionStep.Contratante.TipoDocumento.Codigo) ? vEmissionStep.Contratante.TipoDocumento.Codigo : null,
          documentNumber: vEmissionStep.Contratante.NumeroDocumento
        };

        mainServices.documentNumber.fnFieldsValidated($scope.emitS3, vParamsContractor.documentType, 1);
        $scope.showNaturalRucPerson = mainServices.fnShowNaturalRucPerson(vParamsContractor.documentType, vParamsContractor.documentNumber);

        if (vParamsContractor.documentType && vParamsContractor.documentNumber){
          $scope.fnClearContractor(isSearch);
          empresasFactory.proxyContratante.GetContratanteByNroDocumento(vParamsContractor.companyCode, vParamsContractor.documentType, vParamsContractor.documentNumber, true).then(function(response){
            var vData = response.data || response.Data;
            if (response.OperationCode == constants.operationCode.success){
              $scope.showButtonClearContractor = true;
              _setContractor(vData);
              $scope.contratanteLoadedData = vData;
            }
          });
        }
      };
      /*########################
      # fnNextStep
      ########################*/
      function _mergeEmissionStep(){
        var vEmissionStep = $scope.emit.step,
            vDataContractorAddress = $scope.emitS3.dataContractorAddress;

        vEmissionStep.Contratante.MCAFisico = ($scope.showNaturalRucPerson) ? 'S' : 'N';
        vEmissionStep.Contratante.FechaNacimiento = $scope.emit.fnFilterDate(vEmissionStep.Contratante.mFechaNacimiento, $scope.emit.FORMAT_DATE);
        vEmissionStep.Contratante.Telefono = $scope.emit.step.Contratante.Telefono;
        vEmissionStep.Contratante.TelefonoMovil = $scope.emit.step.Contratante.TelefonoMovil;
        vEmissionStep.Contratante.Sexo = (vEmissionStep.Contratante.Sexo == "1") ? "MASCULINO" : "FEMENINO";
        vEmissionStep.Contratante.CorreoElectronico = $scope.emit.step.Contratante.CorreoElectronico;

        vEmissionStep.Contratante.Ubigeo = {
          Departamento: {
            Codigo:       vDataContractorAddress.ubigeoData.mDepartamento.Codigo,
            Descripcion:  vDataContractorAddress.ubigeoData.mDepartamento.Descripcion
          },
          Provincia: {
            Codigo:       vDataContractorAddress.ubigeoData.mProvincia.Codigo,
            Descripcion:  vDataContractorAddress.ubigeoData.mProvincia.Descripcion
          },
          Distrito: {
            Codigo:       vDataContractorAddress.ubigeoData.mDistrito.Codigo,
            Descripcion:  vDataContractorAddress.ubigeoData.mDistrito.Descripcion
          },
          CodigoVia:      (vDataContractorAddress.mTipoVia && vDataContractorAddress.mTipoVia.Codigo !== null) ? vDataContractorAddress.mTipoVia.Codigo : '',
          NombreVia:      vDataContractorAddress.mNombreVia || '',
          CodigoNumero:   (vDataContractorAddress.mTipoNumero && vDataContractorAddress.mTipoNumero.Codigo !== null) ? vDataContractorAddress.mTipoNumero.Codigo : '',
          TextoNumero:    vDataContractorAddress.mNumeroDireccion || '',
          CodigoInterior: (vDataContractorAddress.mTipoInterior && vDataContractorAddress.mTipoInterior.Codigo !== null) ? vDataContractorAddress.mTipoInterior.Codigo : '',
          TextoInterior:  vDataContractorAddress.mNumeroInterior || '',
          CodigoZona:     (vDataContractorAddress.mTipoZona && vDataContractorAddress.mTipoZona.Codigo !== null) ? vDataContractorAddress.mTipoZona.Codigo : '',
          TextoZona:      vDataContractorAddress.mNombreZona || '',
          Referencia:     vDataContractorAddress.mDirReferencias || ''
        };
        vEmissionStep.Paso = 3;
        return vEmissionStep;
      }

      function _isValid(){
        $scope.$broadcast('submitForm', true);
        return $scope.contractorValid;
      }

      $scope.emitS3.fnNextStep = function(isNextStep, e){
        if(isNextStep){
          if(_isValid()){
            e.cancel = false;
            $scope.emit.step = _mergeEmissionStep();
            empresasFactory.proxyEmpresa.SaveEmissionStep($scope.emit.step, true)
            .then(function(response){
              if(response.OperationCode == constants.operationCode.success){
                $scope.emitS3.endStep3 = true;
                $state.go('empresaEmit.steps', {step: 4});
              }
            });
          }else{
            mModalAlert.showWarning('Por favor corregir los errores antes de continuar', '');
            e.cancel = true;
          }
        }else{
          $state.go('empresaEmit.steps', {step: e.step});
        }
      };

      $scope.$on("changingStep", function(event, e){
        if(parseInt(e.step) <= 3) $scope.emitS3.fnNextStep(false, e);
        else $scope.emitS3.fnNextStep(true, e);
      });

  }]);

});
