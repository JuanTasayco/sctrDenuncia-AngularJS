(function($root, deps, action) {
    define(deps, action);
})(this, ['angular', 'constants', 'helper',
  '/polizas/app/vida/proxy/vidaFactory.js'],
  function(angular, constants, helper) {

    var app = angular.module("appVida");
    app.directive('isolateForm', [function() {
      return {
        restrict: 'A',
        require: '?form',
        link: function(scope, elm, attrs, ctrl) {
          if (!ctrl) {
              return;
          }
          // Do a copy of the controller
          var ctrlCopy = {};
          angular.copy(ctrl, ctrlCopy);

          // Get the parent of the form
          var parent = elm.parent().controller('form');
          // Remove parent link to the controller
          parent.$removeControl(ctrl);

          // Replace form controller with a "isolated form"
          var isolatedFormCtrl = {
            $setValidity: function(validationToken, isValid, control) {
              ctrlCopy.$setValidity(validationToken, isValid, control);
              parent.$setValidity(validationToken, true, ctrl);
            },
            $setDirty: function() {
              elm.removeClass('ng-pristine').addClass('ng-dirty');
              ctrl.$dirty = true;
              ctrl.$pristine = false;
            },
          };
          angular.extend(ctrl, isolatedFormCtrl);
        }
      };
    }]);

    app.component('beneficiarios', {
      bindings: {
          data: "=",
          numDocPrincipal: "="
      },
      templateUrl: 'app/vida/emit/component/beneficiario/beneficiario.html',
      controller: ['$scope', 'proxyUbigeo', 'proxyVida', 'proxyGeneral', 'proxyTipoDocumento', 'vidaService', 'proxyContratante', '$filter', '$timeout', 'mModalAlert', 'proxyPersonForm',
      function($scope, proxyUbigeo, proxyVida, proxyGeneral, proxyTipoDocumento, vidaService, proxyContratante, $filter, $timeout, mModalAlert, proxyPersonForm) {

        var _self = this;

        (function onLoad(){

          _self.data = _self.data ? _self.data : {};
          // console.log(JSON.stringify(_self.data));
          _self.data.beneficiaries = _self.data.beneficiaries ? _self.data.beneficiaries : [];

          //asegurado
          _self.numDocAsegurado = _self.data.cotizacion.Asegurado.NumeroDocumento;

          $scope.cBeneficiaryLife = '6';
          $scope.disabledForm ={
            dateNac: false,
            sexo: false,
            mNomContratante: false,
            mApePatContratante: false,
            mApeMatContratante: false,
            mEstadoCivil: false,
            mCorreoElectronico: false,
            mProfesion: false,
            mOcupacion: false,
            mActividadEconomica: false,
            mTelefonoFijo: false,
            mTelefonoOficina: false,
            mTelefonoCelular: false,
            mTipoVia: false,
            mNombreVia: false,
            mTipoNumero: false,
            mNumeroDireccion: false,
            mTipoInterior: false,
            mNumeroInterior: false,
            mTipoZona: false,
            mNombreZona: false,
            mDirReferencias: false,
            mDepartament: false,
            mProvincia: false,
            mDistrito: false,
          }

          _init();

        })();

        //_init
        function _init(){
          _updateCurrentStep();
          _newBeneficiary();
          _calendarBirthDateSettings();


          // proxyTipoDocumento.getTipoDocumento(true).then(function(response){
          proxyTipoDocumento.getTipoDocumentoVida(true).then(function(response){
            _self.tipoDocumentos = response.Data;
          }, function() {
              console.log(arguments);
          });

          proxyGeneral.GetActividadEconomica(true).then(function(response){
            _self.actividadesEconomicas = response.Data;
          }, function() {
              console.log(arguments);
          });

          proxyUbigeo.GetListPais(true).then(function(data) {
              _self.paises = data.Data;
          }, function() {
              console.log(arguments);
          });

          proxyVida.GetListTipoBeneficiario(2, 601, true).then(function(data) {
              _self.tipoBeneficiarios = data.Data;
          }, function() {
              console.log(arguments);
          });

          proxyGeneral.GetListEstadoCivil(true).then(function(data) {
              _self.estadosCivil = data.Data;
          }, function() {
              console.log(arguments);
          });

          proxyGeneral.GetOcupacion(null, null, true).then(function(data) {
              _self.ocupaciones = data.Data;
          }, function() {
              console.log(arguments);
          });

          proxyGeneral.GetListParentesco(2, true).then(function(data) {
              _self.parentescos = data.Data;
          });
        }

        function _isEqualToDocuNumAsegurado() {
          return _self.numDocAsegurado == _self.current.contractor.mNumeroDocumento;
        }

        //_calendarBirthDateSettings
        function _calendarBirthDateSettings(){
          _self.inlineOptions = {
            minDate: new Date(),
            showWeeks: true
          };
          _self.optionsFechaNacimiento = {
            formatYear: 'yy',
            maxDate: new Date(),
            minDate: new Date(),
            startingDay: 1
          };

          _self.toggleMin = function() {
            _self.inlineOptions.minDate = _self.inlineOptions.minDate ? null : new Date();
            _self.optionsFechaNacimiento.minDate = _self.inlineOptions.minDate;
          };
          _self.toggleMin();

          _self.openFechaNacimiento = function() {
            _self.popupFechaNacimiento.opened = true;
          };

          _self.formatDate = constants.formats.dateFormat;
          _self.altInputFormats = ['M!/d!/yyyy'];
          _self.mask = constants.formats.dateFormatMask;
          _self.pattern = constants.formats.dateFormatRegex;

          _self.popupFechaNacimiento = {
            opened: false
          };
        }
        //_changeFechaNacimiento
        function _changeFechaNacimiento(birthDate){
          var vBirthDate = $filter('date')(birthDate, _self.formatDate);
          _self.current.contractor.mEdadActual = $filter('calculateAge')(vidaService.toDate(vBirthDate));
        }
        $scope.changeFechaNacimiento = function(birthDate){
          _changeFechaNacimiento(birthDate);
        }
        //_updateCurrentStep
        function _updateCurrentStep(){
          _self.currentStep = _self.data.beneficiaries.length == 0 ? 1 : 3;
        }
        //onBeneficiario
        _self.onBeneficiario = function(item) {
          if(!_self.editing){
            _clearBeneficiary(false);
            _clearSearchContractor();
            var vDisabledFields = false;
            //BENEFICIARIO VIDA
            // if (item.Codigo == '6'){
            if (item.Codigo == $scope.cBeneficiaryLife){
              _loadContractor(_self.data);
              vDisabledFields = true;
            }
            _disabledFields(vDisabledFields);
          }          
        }
        //
        _self.closeBeneficiary = function() {
          _clearSearchContractor();
          _updateCurrentStep();
        }
        //_newBeneficiary
        function _clearBeneficiary(isNew){
          var vContractorForm = {
            beneficiaryType:  (_self.current && _self.current.contractor.mTipoBeneficiario && _self.current.contractor.mTipoBeneficiario.Codigo !== null) ? _self.current.contractor.mTipoBeneficiario.Codigo : null,
            nationality:      (_self.current && _self.current.contractor.mNacionalidad && _self.current.contractor.mNacionalidad.Codigo !== null) ? _self.current.contractor.mNacionalidad.Codigo : null,
            distribution:     (_self.current && _self.current.contractor.mDistribucion) ? _self.current.contractor.mDistribucion : 100
          };

          _self.current = {
            contractor: {},
            contractorAddress: {},
          };

          if (isNew){
            $scope.showNaturalRucPerson = true;
            _self.current.contractor.mDistribucion = 100;
          }else{
            _self.current.contractor = {
              mTipoBeneficiario:  {Codigo: vContractorForm.beneficiaryType},
              mNacionalidad:      {Codigo: vContractorForm.nationality},
              mDistribucion:      vContractorForm.distribution
            }
          }
        }
        function _newBeneficiary(){
          _clearBeneficiary(true);
          _clearSearchContractor();
          _self.editing = false;
          _self.itemEditing = null;
          _disabledFields(false);
        }
        _self.newBeneficiary = function() {
          _newBeneficiary();
          _self.currentStep = 2;
        }
        //
        function _disabledFields(b){
          $scope.disabledFields = b;
          $scope.disabledForm.dateNac = b;
          $scope.disabledForm.sexo = b;
          $scope.disabledForm.mNomContratante = b;
          $scope.disabledForm.mApePatContratante = b;
          $scope.disabledForm.mApeMatContratante = b;
          $scope.disabledForm.mEstadoCivil = b;
          $scope.disabledForm.mCorreoElectronico = b;
          $scope.disabledForm.mProfesion = b;
          $scope.disabledForm.mOcupacion = b;
          $scope.disabledForm.mActividadEconomica = b;
          $scope.disabledForm.mTelefonoFijo = b;
          $scope.disabledForm.mTelefonoOficina = b;
          $scope.disabledForm.mTelefonoCelular = b;
          $scope.disabledForm.mTipoVia = b;
          $scope.disabledForm.mNombreVia = b;
          $scope.disabledForm.mTipoNumero = b;
          $scope.disabledForm.mNumeroDireccion = b;
          $scope.disabledForm.mTipoInterior = b;
          $scope.disabledForm.mNumeroInterior = b;
          $scope.disabledForm.mTipoZona = b;
          $scope.disabledForm.mNombreZona = b;
          $scope.disabledForm.mDirReferencias = b;
          $scope.disabledForm.mDepartament = b;
          $scope.disabledForm.mProvincia = b;
          $scope.disabledForm.mDistrito = b;
        }
        function _disabledFieldsEquifax(vFormContractor, vFormContractorAddress, vDataContractorAddress){
          $scope.disabledFields = true;
          $scope.disabledForm.dateNac = vFormContractor.mEdadActual > 17 && (vFormContractor.mEdadActual && vFormContractor.mEdadActual != '');
          $scope.disabledForm.sexo = vFormContractor.sexo > 17 && (vFormContractor.sexo && vFormContractor.sexo != '');
          $scope.disabledForm.mNomContratante = vFormContractor.mNomContratante && vFormContractor.mNomContratante != '';
          $scope.disabledForm.mApePatContratante = vFormContractor.mApePatContratante && vFormContractor.mApePatContratante != '';
          $scope.disabledForm.mApeMatContratante = vFormContractor.mApeMatContratante && vFormContractor.mApeMatContratante != '';
          $scope.disabledForm.mEstadoCivil = vFormContractor.mEstadoCivil.CodigoEstadoCivil;
          $scope.disabledForm.mCorreoElectronico = vFormContractor.mCorreoElectronico && vFormContractor.mCorreoElectronico != '';
          $scope.disabledForm.mProfesion = vFormContractor.mProfesion.Codigo;
          $scope.disabledForm.mOcupacion = vFormContractor.mOcupacion.Codigo;
          $scope.disabledForm.mActividadEconomica = vFormContractor.mActividadEconomica && vFormContractor.mActividadEconomica.Codigo;
          $scope.disabledForm.mTelefonoFijo = vFormContractor.mTelefonoFijo && vFormContractor.mTelefonoFijo != '';
          $scope.disabledForm.mTelefonoOficina = vFormContractor.mTelefonoOficina && vFormContractor.mTelefonoOficina != '';
          $scope.disabledForm.mTelefonoCelular = vFormContractor.mTelefonoCelular && vFormContractor.mTelefonoCelular != '';

          $scope.disabledForm.mTipoVia = vFormContractorAddress.mTipoVia.Codigo;
          $scope.disabledForm.mNombreVia = vFormContractorAddress.mNombreVia && vFormContractorAddress.mNombreVia != '';
          $scope.disabledForm.mTipoNumero = vFormContractorAddress.mTipoNumero.Codigo;
          $scope.disabledForm.mNumeroDireccion = vFormContractorAddress.mNumeroDireccion && vFormContractorAddress.mNumeroDireccion != '';
          $scope.disabledForm.mTipoInterior = vFormContractorAddress.mTipoInterior.Codigo;
          $scope.disabledForm.mNumeroInterior = vFormContractorAddress.mNumeroInterior && vFormContractorAddress.mNumeroInterior != '';
          $scope.disabledForm.mTipoZona = vFormContractorAddress.mTipoZona.Codigo;
          $scope.disabledForm.mNombreZona = vFormContractorAddress.mNombreZona && vFormContractorAddress.mNombreZona != '';
          $scope.disabledForm.mDirReferencias = vFormContractorAddress.mDirReferencias && vFormContractorAddress.mDirReferencias != '';
          $scope.disabledForm.mDepartament = vDataContractorAddress.CodigoDepartamento && vDataContractorAddress.CodigoDepartamento != '';
          $scope.disabledForm.mProvincia = vDataContractorAddress.CodigoProvincia && vDataContractorAddress.CodigoProvincia != '';
          $scope.disabledForm.mDistrito = vDataContractorAddress.CodigoDistrito && vDataContractorAddress.CodigoDistrito != '';
        }
        function _disabledFieldsBirthay(b){
          $scope.disabledFields = b;
        }
        //
        function _showNaturalRucPerson(documentType, documentNumber){
          var vResult = (documentType == constants.documentTypes.ruc.Codigo && vidaService.fnStartsWith(documentNumber, '20'));
          return !vResult;
        }
        //_loadContractor
        function _loadContractor(data){
          // console.log(JSON.stringify(data));

          var vData = data;
          var vDataContractor = data.cotizacion.Contratante;
          var vDataContractorAddress = data.contractorAddress;
          var vDataUbigeo = data.contractorAddress.ubigeoData;

          var vFormContractor = _self.current.contractor;
          var vFormContractorAddress = _self.current.contractorAddress;


          // vFormContractor.mNacionalidad = {
          //   Codigo : (vData.nacionalidad && vData.nacionalidad.Codigo !== null) ? vData.nacionalidad.Codigo : null
          // };
          vFormContractor.mTipoDocumento = {
            TipoDocumento: (vDataContractor.TipoDocumento !== '') ? vDataContractor.TipoDocumento : null
          };
          vFormContractor.mNumeroDocumento = vDataContractor.NumeroDocumento;

          $scope.showNaturalRucPerson = _showNaturalRucPerson(vDataContractor.TipoDocumento, vDataContractor.NumeroDocumento);

          vFormContractor.mParentesco = {
            Codigo: null
          };

          vFormContractor.mNomContratante     = vDataContractor.Nombre;

          if ($scope.showNaturalRucPerson){
            vFormContractor.mNacionalidad = {
              Codigo : (vData.nacionalidad && vData.nacionalidad.Codigo !== null) ? vData.nacionalidad.Codigo : null
            };
            vFormContractor.mApePatContratante  = vDataContractor.ApellidoPaterno;
            vFormContractor.mApeMatContratante  = vDataContractor.ApellidoMaterno;
            vFormContractor.mEstadoCivil = {
              CodigoEstadoCivil : (vData.estadoCivil && vData.estadoCivil.CodigoEstadoCivil !== null) ? vData.estadoCivil.CodigoEstadoCivil : null
            }
            vFormContractor.mSexo               = vDataContractor.Sexo;
            vFormContractor.mFechaNacimiento    = vDataContractor.newFechaNacimiento;
            vFormContractor.mEdadActual         = vData.edadActual;
            vFormContractor.mProfesion          = {
              Codigo: (vData.profesion && vData.profesion.Codigo !== null) ? vData.profesion.Codigo : null
            };
            vFormContractor.mOcupacion          = {
              Codigo: (vData.ocupacion && vData.ocupacion.Codigo !== null) ? vData.ocupacion.Codigo : null
            };
          }
          if (vFormContractor.mTipoDocumento.TipoDocumento == constants.documentTypes.ruc.Codigo) {
            vFormContractor.mActividadEconomica = {
              Codigo : (vData.actividadEconomica && vData.actividadEconomica.Codigo !== null) ?  vData.actividadEconomica.Codigo : null
            };
          }
          // }else{
          //   vFormContractor.mActividadEconomica = {
          //     Codigo : (vData.actividadEconomica && vData.actividadEconomica.Codigo !== null) ?  vData.actividadEconomica.Codigo : null
          //   };
          // }

          vFormContractor.mCorreoElectronico  = vDataContractor.Correo;

          vFormContractor.mTelefonoFijo       = vDataContractor.TelefonoCasa;
          vFormContractor.mTelefonoOficina    = vDataContractor.TelefonoOficina;
          vFormContractor.mTelefonoCelular    = vDataContractor.TelefonoMovil;


          //Address
          vFormContractorAddress.mTipoVia = {
            Codigo: (vDataContractorAddress.mTipoVia && vDataContractorAddress.mTipoVia.Codigo !== null) ? vDataContractorAddress.mTipoVia.Codigo : null
          };
          vFormContractorAddress.mNombreVia = vDataContractorAddress.mNombreVia;
          vFormContractorAddress.mTipoNumero = {
            Codigo: (vDataContractorAddress.mTipoNumero && vDataContractorAddress.mTipoNumero.Codigo !== null) ? vDataContractorAddress.mTipoNumero.Codigo : null
          };
          vFormContractorAddress.mNumeroDireccion = vDataContractorAddress.mNumeroDireccion;
          vFormContractorAddress.mTipoInterior = {
            Codigo: (vDataContractorAddress.mTipoInterior && vDataContractorAddress.mTipoInterior.Codigo !== null) ? vDataContractorAddress.mTipoInterior.Codigo : null
          };
          vFormContractorAddress.mNumeroInterior = vDataContractorAddress.mNumeroInterior;
          vFormContractorAddress.mTipoZona = {
            Codigo: (vDataContractorAddress.mTipoZona && vDataContractorAddress.mTipoZona.Codigo !== null) ? vDataContractorAddress.mTipoZona.Codigo : null
          };
          vFormContractorAddress.mNombreZona = vDataContractorAddress.mNombreZona;
          vFormContractorAddress.mDirReferencias = vDataContractorAddress.mDirReferencias;

          $timeout(function(){
            if (vDataUbigeo.mDepartamento && vDataUbigeo.mDepartamento.Codigo !== null){
              _self.setterUbigeo(vDataUbigeo.mDepartamento.Codigo, vDataUbigeo.mProvincia.Codigo, vDataUbigeo.mDistrito.Codigo);
            }
          }, 1000);

          vFormContractor.mPaisNatal = {
            Codigo : (vData.paisNatal && vData.paisNatal.Codigo !== null) ? vData.paisNatal.Codigo : null
          };
          vFormContractor.mPaisResidencia = {
            Codigo : (vData.paisResidencia && vData.paisResidencia.Codigo !== null) ? vData.paisResidencia.Codigo : null
          };
        }
        //searchContractor
        function _clearContractor(cbo){
          var vCurrentContractorForm  = _self.current.contractor;

          var vContractorForm = {
            documentType:     (vCurrentContractorForm.mTipoDocumento && vCurrentContractorForm.mTipoDocumento.TipoDocumento !== null) ? vCurrentContractorForm.mTipoDocumento.TipoDocumento : null,
            documentNumber:   vCurrentContractorForm.mNumeroDocumento || ''
          }

          _clearBeneficiary(false);

          vCurrentContractorForm = _self.current.contractor;
          vCurrentContractorForm.mTipoDocumento = {
            TipoDocumento : vContractorForm.documentType
          }

          if (!cbo) vCurrentContractorForm.mNumeroDocumento = vContractorForm.documentNumber;
        }
        function _clearSearchContractor(){
          $scope.currentDoc = {};
        }
        // $scope.currentDoc = {};
        _self.searchContractor = function(cbo){
          // (cbo) ? cbo = true : false;

          // _clearBeneficiary(false);
          _clearContractor(cbo);
          if (cbo) _clearSearchContractor();

          if (_isEqualToDocuNumAsegurado()) {
            mModalAlert.showError("El número de documento del beneficiario no puede ser igual al del asegurado", "Error");
            _self.current.contractor.mNumeroDocumento = undefined
            return;
          }else{

          var vFormContractor        = _self.current.contractor;
          var vFormContractorAddress = _self.current.contractorAddress;

          var paramsContractor = {
            companyCode   : constants.module.polizas.vida.companyCode,
            documentType  : vFormContractor.mTipoDocumento.TipoDocumento,
            documentNumber: vFormContractor.mNumeroDocumento
          };

          $scope.docNumMaxLength = vidaService.docNumMaxLength(paramsContractor.documentType);

          if (paramsContractor.documentType &&
              paramsContractor.documentNumber &&
              paramsContractor.documentNumber !== '' &&
              ($scope.currentDoc['documentType'] !== paramsContractor.documentType || $scope.currentDoc['documentNumber'] !== paramsContractor.documentNumber)){

                $scope.currentDoc = paramsContractor;

                proxyPersonForm.getPersonEquifax({ 
                  "applicationCode": "VIDA",
                  "tipoDocumento": paramsContractor.documentType,
                  "codigoDocumento": paramsContractor.documentNumber,
                  "codigoCompania": constants.module.polizas.vida.companyCode
                }, true).then(function(response){
                  var vValue = response.Data;
                  if (vValue){

                    var vDataContractorAddress = response.Data.Ubigeo;
                    // _self.searchedPerson = true;

                    // vFormContractor.mNacionalidad = {
                    //   Codigo : null
                    // };
                    // vFormContractor.mTipoDocumento = {
                    //   Codigo: (vValue.TipoDocumento !== '') ? vValue.TipoDocumento : null
                    // };
                    // vFormContractor.mNumeroDocumento = vValue.CodigoDocumento;
                    vFormContractor.mParentesco = {
                      Codigo: null
                    };

                    vFormContractor.mNomContratante     = vValue.Nombre;

                    $scope.showNaturalRucPerson = _showNaturalRucPerson(paramsContractor.documentType, paramsContractor.documentNumber);

                    if ($scope.showNaturalRucPerson){
                      // vFormContractor.mNacionalidad = {
                      //   Codigo : null
                      // };
                      vFormContractor.mApePatContratante  = vValue.ApellidoPaterno;
                      vFormContractor.mApeMatContratante  = vValue.ApellidoMaterno;
                      vFormContractor.mEstadoCivil = {
                        CodigoEstadoCivil : !vValue.CodigoEstadoCivil ? null : vValue.CodigoEstadoCivil
                      };
                      vFormContractor.mSexo               = vValue.Sexo;
                      vFormContractor.mFechaNacimiento    = vidaService.outputFormatDatePicker(vValue.FechaNacimiento);
                      vFormContractor.mEdadActual         = $filter('calculateActuarialAge')(vFormContractor.mFechaNacimiento); //$filter('calculateAge')(vidaService.toDate(vValue.FechaNacimiento));

                      vFormContractor.mProfesion          = {
                        Codigo: (vValue.Profesion) ? vValue.Profesion.Codigo : null
                      };
                      vFormContractor.mOcupacion          = {
                        Codigo: null
                      };
                    }
                    if (vValue.TipoDocumento == constants.documentTypes.ruc.Codigo) {
                      vFormContractor.mActividadEconomica = {
                        Codigo : (vValue.ActividadEconomica && vValue.ActividadEconomica.Codigo !== '') ?  vValue.ActividadEconomica.Codigo : null
                      };
                    }
                    // } else {
                    //   vFormContractor.mActividadEconomica = {
                    //     Codigo : (vValue.ActividadEconomica && vValue.ActividadEconomica.Codigo !== '') ?  vValue.ActividadEconomica.Codigo : null
                    //   };
                    // }

                    vFormContractor.mCorreoElectronico  = vValue.CorreoElectronico;

                    vFormContractor.mTelefonoFijo       = vValue.Telefono;
                    vFormContractor.mTelefonoOficina    = vValue.TelefonoOficina;
                    vFormContractor.mTelefonoCelular    = vValue.Telefono2;


                    //Address
                    vFormContractorAddress.mTipoVia = {
                      Codigo: (vDataContractorAddress.CodigoVia !== '') ? vDataContractorAddress.CodigoVia : null
                    };
                    vFormContractorAddress.mNombreVia = vDataContractorAddress.NombreVia;
                    vFormContractorAddress.mTipoNumero = {
                      Codigo: (vDataContractorAddress.CodigoNumero !== '') ? vDataContractorAddress.CodigoNumero : null
                    };
                    vFormContractorAddress.mNumeroDireccion = vDataContractorAddress.TextoNumero;
                    vFormContractorAddress.mTipoInterior = {
                      Codigo: (vDataContractorAddress.CodigoInterior !== '') ? vDataContractorAddress.CodigoInterior : null
                    };
                    vFormContractorAddress.mNumeroInterior = vDataContractorAddress.TextoInterior;
                    vFormContractorAddress.mTipoZona = {
                      Codigo: (vDataContractorAddress.CodigoZona !== '') ? vDataContractorAddress.CodigoZona : null
                    };
                    vFormContractorAddress.mNombreZona = vDataContractorAddress.TextoZona;
                    vFormContractorAddress.mDirReferencias = vDataContractorAddress.Referencia;

                    // if (vDataUbigeo.mDepartamento && vDataUbigeo.mDepartamento.Codigo !== null){
                    _self.setterUbigeo(vDataContractorAddress.CodigoDepartamento, vDataContractorAddress.CodigoProvincia, vDataContractorAddress.CodigoDistrito);
                    // }
                    _disabledFieldsEquifax(vFormContractor, vFormContractorAddress, vDataContractorAddress);                    

                  }else if(vFormContractor.mNumeroDocumento === _self.numDocPrincipal){
                    var quotation = _self.data.cotizacion;
                    var address = _self.data.contractorAddress;
                    var ubigeo = address.ubigeoData;

                    vFormContractor.mNomContratante = quotation.Contratante.Nombre;
                    vFormContractor.mCorreoElectronico = quotation.Contratante.Correo;
                    vFormContractor.mTelefonoFijo = quotation.Contratante.TelefonoCasa;
                    vFormContractor.mTelefonoOficina = quotation.Contratante.TelefonoOficina;
                    vFormContractor.mTelefonoCelular = quotation.Contratante.TelefonoMovil;

                    $scope.showNaturalRucPerson = _showNaturalRucPerson(paramsContractor.documentType, paramsContractor.documentNumber);

                    if ($scope.showNaturalRucPerson){
                      vFormContractor.mApePatContratante = quotation.Contratante.ApellidoPaterno;
                      vFormContractor.mApeMatContratante = quotation.Contratante.ApellidoMaterno;
                      vFormContractor.mEstadoCivil = {
                        CodigoEstadoCivil : !_self.data.estadoCivil.CodigoEstadoCivil ? null : _self.data.estadoCivil.CodigoEstadoCivil
                      };
                      vFormContractor.mSexo = quotation.Contratante.Sexo
                      vFormContractor.mFechaNacimiento = quotation.Contratante.newFechaNacimiento;
                      vFormContractor.mEdadActual = $filter('calculateActuarialAge')(quotation.Contratante.newFechaNacimiento);

                      vFormContractor.mProfesion = {
                        Codigo: !_self.data.profesion.Codigo ? null : _self.data.profesion.Codigo
                      };
                      vFormContractor.mOcupacion = {
                        Codigo: !_self.data.ocupacion.Codigo ? null : _self.data.ocupacion.Codigo
                      };
                    }
                    if (quotation.Contratante.TipoDocumento == constants.documentTypes.ruc.Codigo) {
                      vFormContractor.mActividadEconomica = {
                        Codigo : (quotation.Contratante.ActividadEconomica && quotation.Contratante.ActividadEconomica.Indice !== '') ?  quotation.Contratante.ActividadEconomica.Indice : null
                      };
                    }

                    //Address
                    vFormContractorAddress.mTipoVia = {
                      Codigo: !address.mTipoVia.Codigo ? null : address.mTipoVia.Codigo
                    };
                    vFormContractorAddress.mNombreVia = address.mNombreVia;
                    vFormContractorAddress.mTipoNumero = {
                      Codigo: !address.mTipoNumero.Codigo ? address.mTipoNumero.Codigo : null
                    };
                    vFormContractorAddress.mNumeroDireccion = !address.mNumeroDireccion ? '' : address.mNumeroDireccion;
                    vFormContractorAddress.mTipoInterior = {
                      Codigo: !address.mTipoInterior.Codigo ? null : address.mTipoInterior.Codigo
                    };
                    vFormContractorAddress.mNumeroInterior = !address.mNumeroInterior ? '' : address.mNumeroInterior;
                    vFormContractorAddress.mTipoZona = {
                      Codigo: !address.mTipoZona.Codigo ? null : address.mTipoZona.Codigo
                    };
                    vFormContractorAddress.mNombreZona = !address.mNombreZona ? '' : address.mNombreZona;
                    vFormContractorAddress.mDirReferencias = !address.mDirReferencias ? '' : address.mDirReferencias;

                    _self.setterUbigeo(ubigeo.mDepartamento.Codigo, ubigeo.mProvincia.Codigo, ubigeo.mDistrito.Codigo);
                    var vDataContractorAddress2 = {
                      CodigoDepartamento: ubigeo.mDepartamento.Codigo,
                      CodigoDistrito: ubigeo.mDistrito.Codigo,
                      CodigoProvincia: ubigeo.mProvincia.Codigo,
                    }
                    _disabledFieldsEquifax(vFormContractor, vFormContractorAddress, vDataContractorAddress2); 
                  }else{
                    _clearSearchContractor();
                  }
                }, function(error){
                  // console.log('error');
                }, function(defaultError){
                  // console.log('errorDefault');
                });
              }
          }
        }




        //saveBeneficiary
        function _validateForm(){
          _self.formulario.markAsPristine();
          return _self.formulario.$valid;
        }
        function _validateDistribution(beneficiaryType){
          var vMaxDistribution = 100,
              vDistributions = 0;

          angular.forEach(_self.data.beneficiaries, function(item, index){
            if (item.contractor.mTipoBeneficiario.Codigo == beneficiaryType){
              vDistributions += parseInt(item.contractor.mDistribucion);
            }
          });

          var vResult = vMaxDistribution >= vDistributions;
          return vResult;
        }

        function _validateDuplicateBeneficiary() {
          return _.find(_self.data.beneficiaries, function (beneficiary) {
            return beneficiary.contractor.mNumeroDocumento == _self.current.contractor.mNumeroDocumento;
          });
        }

        function _isEqualToDocuNumInsured() {
          return _self.numDocPrincipal == _self.current.contractor.mNumeroDocumento;
        }

        _self.saveBeneficiary = function() {
          var vIndex = '',
              vCurrentItem = null;
          if (_validateForm()){            
            if (!_self.editing) {
              if (!angular.isUndefined(_validateDuplicateBeneficiary())) {
                mModalAlert.showError("No pueden existir dos beneficiarios con el mismo Número de documento", "Error");
                return;
              }
              _self.data.beneficiaries.push(_self.current);
              vIndex = _self.data.beneficiaries.length - 1;
            } else {
              var vCurrentItem = angular.copy(_.omit(_self.itemEditing, ['$$hashKey'])); //helper.clone(_self.itemEditing);
              angular.copy(_self.current, _self.itemEditing);
            }

            var vBeneficiaryType = _self.current.contractor.mTipoBeneficiario.Codigo;
            if (_validateDistribution(vBeneficiaryType)) {
              _updateCurrentStep();
            }else{
              (_self.editing) ? angular.copy(vCurrentItem, _self.itemEditing) : _self.data.beneficiaries.splice(vIndex, 1);
              mModalAlert.showWarning("La suma de la distribución de indemnización no puede ser mayor al 100%", "Distribución de indemnización");
            }
          }
        }

        _self.editBeneficiary = function(item) {
          _self.editing = true;
          _self.itemEditing = item;
          _self.current = angular.copy(_.omit(item, ['$$hashKey']));
          _self.currentStep = 2;
        }

        _self.deleteBeneficiary = function(index) {
          _self.data.beneficiaries.splice(index, 1);
          _updateCurrentStep();
        }






      }]
    });
});
