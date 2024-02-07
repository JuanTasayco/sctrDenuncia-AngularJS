'use strict';

define([
  'angular',
  'constants',
  'lodash',
  'mpfPersonConstants',
  'mpfPersonFactory',
  'mpfPersonDirective',
  'mMainServices'
], function (ng, constants, _, personConstants) {

  mpfPersonController.$inject = [
    '$scope',
    '$compile',
    'mpfPersonFactory',
    'mainServices',
    '$filter',
    'mModalAlert',
    'mModalConfirm'
  ];

  function mpfPersonController($scope, $compile, mpfPersonFactory, mainServices, $filter, mModalAlert, mModalConfirm) {
    var vm = this;
    var clonedPerson = {};
    vm.$onInit = onInit;
    function onInit() {
      vm.form = {};
      if (angular.isUndefined(vm.focus) || vm.focus=== null) vm.focus = true;

      switch(vm.appCode){
        case 'VIDA_LEY':
        vm.personDataTemplate = '/scripts/mpf-main-controls/components/mpf-person/components/mpf-person-data.template-VL.html'
          vm.personContactTemplate = '/scripts/mpf-main-controls/components/mpf-person/components/mpf-person-contact.template.html';
          break; 
        case 'FUNERARIAS':
          vm.personDataTemplate = '/scripts/mpf-main-controls/components/mpf-person/components/mpf-person-data.template-Sepelio.html';
          vm.personContactTemplate = '/scripts/mpf-main-controls/components/mpf-person/components/mpf-person-contact-Sepelio.template.html';
          break; 
        default:
        vm.personDataTemplate = '/scripts/mpf-main-controls/components/mpf-person/components/mpf-person-data.template.html';
          vm.personContactTemplate = '/scripts/mpf-main-controls/components/mpf-person/components/mpf-person-contact.template.html';
          break;
      }

      vm.personAddressTemplate = '/scripts/mpf-main-controls/components/mpf-person/components/mpf-person-address.template.html';
      vm.formControlName = vm.name || 'formControl';
      vm.habilitarValidacionListanegraDatosContactoFormulario = vm.habilitarValidacionListanegraDatosContacto || false;
      vm.legalPerson = false;
      vm.cleanedUp = false;
      vm.isVisibleCleanButton = false;
      vm.fields = personConstants.fields;
      vm.modelsEquifax = personConstants.modelsEquifax;
      vm.telefValido = true;
      vm.datosContactoListaNegraValido = true;
      vm.habilitarValidacionTelefonosFormulario = vm.habilitarValidacionTelefonos || false;
      vm.Age = null;

      
      vm.getForm = getForm();
      vm.checkForm = checkForm;
      vm.searchField = searchField;
      vm.hideField = hideField;
      vm.getValidations = getValidations;
      vm.checkRequired = checkRequired;
      vm.getContractorData = getContractorData;
      vm.documentTypeChange = documentTypeChange;
      vm.isRuc = false;
      vm.checkDisabled = checkDisabled;
      vm.autoCompleteHandler = autoCompleteHandler;
      vm.getDateSource = getDateSource;
      vm.getCountriesSources = getCountriesSources;
      vm.getActivitiesSource = getActivitiesSource;
      vm.getProfessionsSource = getProfessionsSource;
      vm.getRelacionSource = getRelacionSource;
      vm.getCivilStatusSource = getCivilStatusSource;
      vm.getDeparmentsSource = getDeparmentsSource;
      vm.getProvincesSource = getProvincesSource;
      vm.getDistrictSource = getDistrictSource;
      vm.getViaTypeSource = getViaTypeSource;
      vm.getNumberTypeSource = getNumberTypeSource;
      vm.getIndoorTypeSource = getIndoorTypeSource;
      vm.getZoneTypeSource = getZoneTypeSource;
      vm.getDocumentTypesSource = getDocumentTypesSource;
      vm.getRelationshipSource = getRelationshipSource;
      vm.getRepresentativeSource = getRepresentativeSource;
      vm._filterDocumentTypeOnly = _filterDocumentTypeOnly;
      vm.getAge = getAge;
      vm.cleanForm = cleanForm;
      vm.lblEdad = vm.appCode === personConstants.aplications.VIDA ? 'Edad actuarial' : 'Edad';
      vm.pressPhone = pressPhone;
      vm.addressControls = [
        vm.fields.RESIDENCE_COUNTRY,
        vm.fields.NATIVE_COUNTRY,
        vm.fields.RESIDENCE_COUNTRY_FISCAL,
        vm.fields.DEPARTMENT,
        vm.fields.PROVINCE,
        vm.fields.PROFESSION_AUTOCOMPLETE,
        vm.fields.DISTRICT,
        vm.fields.VIA,
        vm.fields.VIA_NAME,
        vm.fields.ENUM_TYPE,
        vm.fields.ENUM_NAME,
        vm.fields.ENUM_INSIDE_TYPE,
        vm.fields.ENUM_INSIDE_NAME,
        vm.fields.ZONE_TYPE,
        vm.fields.ZONE_NAME,
        vm.fields.REFERENCE,
        vm.fields.FULL_ADDRESS
      ];
      vm.contactControls = [
        vm.fields.CONTACT_NAME,
        vm.fields.PREFIX_PHONE,
        vm.fields.HOUSE_PHONE,
        vm.fields.OFFICE_PHONE,
        vm.fields.MOBILE_PHONE,
        vm.fields.EMAIL,
        vm.fields.PERSONAL_EMAIL,
        vm.fields.OFFICE_EMAI,
        vm.fields.REPRESENTATIVE,
        vm.fields.REPRESENTATIVE_CHARGE
      ];
      vm.jobControls = [
        vm.fields.PROFESSION,
        vm.fields.OCCUPATION,
        vm.fields.PROFESSION_AUTOCOMPLETE,
        vm.fields.OCCUPATION_AUTOCOMPLETE
      ];
      vm.personalControls = [
        vm.fields.SEX,
        vm.fields.SIZE,
        vm.fields.WEIGHT
      ];
      vm.arrayFieldsEquifax = [
        vm.modelsEquifax.TipoDocumento,
        vm.modelsEquifax.CodigoDocumento,
        vm.modelsEquifax.Nombre,
        vm.modelsEquifax.ApellidoPaterno,
        vm.modelsEquifax.ApellidoMaterno,
        vm.modelsEquifax.FechaNacimiento,
        vm.modelsEquifax.Sexo,
        vm.modelsEquifax.civilState,
        vm.modelsEquifax.ageRange
      ];

      $scope.$on('submitForm', function (event, data) {
        if (data) {
          vm.checkForm();
        }
      });

      $scope.$on('eventCapture', function (event, data) {
        outData({ data: vm.form, toRequest: true });
      });

      var documentType = vm.documentType || vm.personData && vm.personData.documentType || vm.personData && vm.personData.TipoDocumento && vm.personData.TipoDocumento.Codigo;
      var documentNumber = vm.documentNumber || vm.personData && vm.personData.documentNumber || vm.personData && vm.personData.NumeroDocumento;

      if (documentType && documentNumber) {
        checkLegalPerson(documentType, documentNumber);
      }

      if(documentType!== undefined){if(documentType.Codigo==="RUC" && vm.formCode==="ACCIONISTA"){vm.isRuc=true;}}
      var personDataWatch = $scope.$watch('vm.personData', function () {
        setContractorData(vm.personData);
      });
      var validacionTelefonoWatch = $scope.$watch('vm.habilitarValidacionTelefonos', function () {setValidacionTelefonos(vm.habilitarValidacionTelefonos);});
      var validacionDatosContactoWatch = $scope.$watch('vm.habilitarValidacionListanegraDatosContacto', function () {setValidacionDatosContacto(vm.habilitarValidacionListanegraDatosContacto);});
      $scope.$on('$destroy', function(){
        personDataWatch();
        validacionTelefonoWatch();
        validacionDatosContactoWatch();
      });
      var profile = JSON.parse(window.localStorage.getItem('profile'));
      $scope.esEjecutivo = !profile.isAgent && profile.userSubType === "1";
      $scope.esAgente = profile.isAgent && profile.userSubType === "1";
      $scope.esCorredor = profile.userSubType === "3";
    }
    function _validarTelefonos(){

      if(!vm.habilitarValidacionTelefonosFormulario) return true;

      const telefonos = __getInputTelefonos();

      var success = telefonos.length > 0 ? false : true;

      for (var i = 0; i < telefonos.length; i++){
        const telefono = telefonos[i];
        if($scope.personForm[telefono.control].$viewValue !== undefined && $scope.personForm[telefono.control].$viewValue !== '') {
          success = true;
          break;
        }
      }

      return success;

    }

    function getForm() {
      mpfPersonFactory.getForm({ appCode: vm.appCode, formCode: vm.formCode })
        .then(function (response) {
          vm.formService = response.Data;
          vm.getDateSource();
          vm.getCountriesSources();
          vm.getActivitiesSource();
          vm.getProfessionsSource();
          vm.getRelacionSource();
          vm.getCivilStatusSource();
          vm.getDeparmentsSource();
          vm.getViaTypeSource();
          vm.getNumberTypeSource();
          vm.getIndoorTypeSource();
          vm.getZoneTypeSource();
          vm.getDocumentTypesSource();
          vm.getRelationshipSource();
          vm.getRepresentativeSource();
        });
    }

    function findControlObject(controlCode) {
      if (vm.formCode == "ACCIONISTA"){if(vm.isRuc){return !ng.isUndefined(vm.formService) && _.find(vm.formService.Controls, function (item) { return (item.Code === controlCode && item.Code!="SECOND_LASTNAME" && item.Code!="LASTNAME" && item.Code!="NAME_PERSON")});}else{ return !ng.isUndefined(vm.formService) && _.find(vm.formService.Controls, function (item) { return (item.Code === controlCode && item.Code!="BUSINESSNAME")});}}
      return !ng.isUndefined(vm.formService) && _.find(vm.formService.Controls, function (item) { return item.Code === controlCode });
    }

    function checkLegalPerson(documentType, documentNumber) {
      vm.legalPerson = documentType === 'RUC' && documentNumber
        ? documentNumber.substring(0, 2) === '20'
        : false;
    }

    function searchField(controls) {
      return _.find(controls, function (control) {
        return checkShowFieldByTypePerson(control);
      });
    }

    function getValidations(controlCode) {
      var findControl = findControlObject(controlCode);

      return findControl ? findControl.Validations : {};
    }

    function __getInputTelefonos(){

      const telefonosEnFormulario = [];

      if(vm.searchField([vm.fields.HOUSE_PHONE])){
        telefonosEnFormulario.push({field: vm.fields.HOUSE_PHONE, control: 'Telefono'});
      }

      if(vm.searchField([vm.fields.OFFICE_PHONE])){
        telefonosEnFormulario.push({field: vm.fields.OFFICE_PHONE, control: 'TelefonoOficina'});
      }

      if(vm.searchField([vm.fields.MOBILE_PHONE])){
        telefonosEnFormulario.push({field: vm.fields.MOBILE_PHONE, control: 'Telefono2'});
      }

      return telefonosEnFormulario;

    }

    function __getInputsDatosContacto() {
      var datosContactoEnFormulario = [];

      datosContactoEnFormulario = __getInputTelefonos();
      datosContactoEnFormulario.forEach(function(obj){ obj.blackListType = obj.control == 'Telefono2' ? 'TLF_MOVIL' : 'TLF_FIJO'; });

      if(vm.searchField([vm.fields.EMAIL])){
        datosContactoEnFormulario.push({field: vm.fields.EMAIL, control: 'CorreoElectronico', blackListType: 'CORREO'});
      }

      if(vm.searchField([vm.fields.PERSONAL_EMAIL])){
        datosContactoEnFormulario.push({field: vm.fields.PERSONAL_EMAIL, control: 'emailPersonal', blackListType: 'CORREO'});
      }

      if(vm.searchField([vm.fields.OFFICE_EMAIL])){
        datosContactoEnFormulario.push({field: vm.fields.OFFICE_EMAIL, control: 'CorreoElectronicoOffice', blackListType: 'CORREO'});
      }

      return datosContactoEnFormulario;
    }

    function checkDisabled(controlName) {

      if (vm.formCode== "ACCIONISTA"){return false;}
      var contractorKeys = _.keys(vm.contractorData)
      if (contractorKeys.length) {
        var findControl = _.find(contractorKeys, function (key) { return key === controlName });

        if(vm.enabledField && vm.appCode === 'FUNERARIAS'){
          return false;
        }

        
        if(vm.appCode === 'SOAT'){
          if(data.Ubigeo){
            if(data.Ubigeo.CodigoDepartamento || data.Ubigeo.Departamento){
              vm.blockDeparment = true;
            } else {
              vm.blockDeparment = false;
            }          
          }
          if(vm.contractorData.Ubigeo.CodigoDepartamento || vm.contractorData.Ubigeo.Departamento){
            vm.blockDeparment = true;
          } else {
            vm.blockDeparment = false;
          } 
        }
        if(vm.appCode === 'DECESO'){
          return vm.blockFields
            && vm.blockFields.indexOf(controlName) !== -1;          
        }

          return (_.find(vm.arrayFieldsEquifax, function (key) { return key === findControl })
          && vm.contractorData[controlName])
          || (vm.blockFields
            && vm.blockFields.indexOf(controlName) !== -1);
        
        }
      return false;
    }

    function checkRequired(controlCode) {
      var controlObject = findControlObject(controlCode)
      if (controlObject) {
        var findRequired = _.find(controlObject.Validations, function (item) { return item.Type === 'REQUIRED' });
        return findRequired ? true : false;
      }
      return false;
    }

    function checkShowFieldByTypePerson(controlCode) {
      var controlObject = findControlObject(controlCode);
      if (controlObject) {
        if ((controlObject.FieldVisivility === 1 && !vm.legalPerson) || (controlObject.FieldVisivility === 2 && vm.legalPerson) || (controlObject.FieldVisivility === 3))
          return controlObject;
      }
      return false;
    }

    function hideField(controlCode) {
      return _.find(vm.hiddenFields, function (field) {
        return controlCode === field;
      });
    }

    function _filterDocumentTypeOnly(data, arrKeys) {
      var filterOptions = data.filter(function (val) {
        if (arrKeys.indexOf(val.Codigo) >= 0) {
          return val;
        }
      });

      return filterOptions;
    }


    function getDocumentTypesSource() {
      mpfPersonFactory.getDocumentTypes({ appCode: vm.appCode, formCode: vm.formCode })
        .then(function (response) {
          vm.documentTypeSource = response.Data;
          var data = response.Data;

          if (vm.appCode == personConstants.aplications.VIDA_LEY) {
            data = vm._filterDocumentTypeOnly(data, ['DNI', 'RUC']);
          }

          vm.documentTypeSource = data;

          if (vm.personData) {
            var documentTypeCode = typeof vm.personData.TipoDocumento === 'object' ? vm.personData.TipoDocumento.Codigo : vm.personData.TipoDocumento;
            if(!vm.form.documentId){
              vm.form.documentType = _.find(vm.documentTypeSource, function (item) { return item.Codigo === documentTypeCode });
              vm.form.documentNumber = getDocumentNumber(vm.personData);
            } else {
              vm.form.documentType = vm.form.documentType && vm.form.documentType.Codigo;
              vm.form.documentNumber = vm.personData.NumeroDocumento;
            }
            setContractorData(vm.personData);
            clonedPerson = ng.copy(vm.form);

            vm.params = {
              applicationCode: vm.appCode,
              tipoDocumento: vm.form.documentType ? vm.form.documentType.Codigo : 0,
              codigoDocumento: vm.form.documentNumber,
              validarListaNegra: vm.validBlacklistNumdoc
            }

            if (vm.codigoCompania) {
              vm.params.codigoCompania = vm.codigoCompania;
            }

            if (vm.tipoRol) {
              vm.params.tipoRol = vm.tipoRol;
            }

            if (!vm.form.documentId) {
              getEquifaxData(vm.form.documentType, vm.form.documentNumber);
            }

          } else if (vm.documentType && vm.documentNumber) {
            vm.form.documentType = _.find(vm.documentTypeSource, function (item) { return item.Codigo === vm.documentType });
            vm.form.documentNumber = vm.documentNumber;
            vm.getContractorData(vm.documentType, vm.documentNumber)

          }
        });
    }

    function getContractorData(documentType, documentNumber) {
      if (documentType && documentNumber) {
        outData(vm.form);
		if (vm.formCode!= "ACCIONISTA"){
        checkLegalPerson(documentType, documentNumber);
        }

        vm.params = {
          applicationCode: vm.appCode,
          tipoDocumento: vm.form.documentType.Codigo,
          codigoDocumento: vm.form.documentNumber,
          validarListaNegra: vm.validBlacklistNumdoc
        }

        if (vm.codigoCompania) {
          vm.params.codigoCompania = vm.codigoCompania;
        }

        if (vm.tipoRol) {
          vm.params.tipoRol = vm.tipoRol;
        }

        getEquifaxData(documentType, documentNumber);

      } else {
        cleanForm(['documentType', 'documentNumber'])
      }
    }

    function getEquifaxData(documentType, documentNumber) {
      if((vm.personData && vm.personData.ignoreEquifax) && vm.validBlacklistNumdoc) {
        mpfPersonFactory.serviceValidBlackList([{"tipo": documentType, "valor": documentNumber}], true)
        .then(function(response) {
          if (response.Data[0].Resultado) {
            validarPersonaFraudulenta({ tipo: documentType, valor: documentNumber }, response.Data[0]);
          } 
        })
        .catch(function(err) {
          console.error('Fallo en el servidor', err);
        });
        return;
      }
      if (!(vm.personData && vm.personData.ignoreEquifax) ){
        mpfPersonFactory.getEquifaxData(vm.params)
        .then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            if (vm.validBlacklistNumdoc && response.Data.EsFraudulento && !vm.isVisibleCleanButton) {
              validarPersonaFraudulenta({ tipo: documentType, valor: documentNumber }, response.Data);
            } else {
            setContractorData(response.Data);
          }
          }
          else {
            if(vm.personData === undefined) {
              outData({ documentType: documentType, documentNumber: documentNumber, noData: true, esFraudulento: false });
              cleanForm(['documentType', 'documentNumber']);
            }
          }
          vm.isVisibleCleanButton = true;
        })
        .catch(function (err) {
          if (!vm.validBlacklistNumdoc) {
          console.error('Fallo en el servidor', err);
          } else {
            if(err.status === constants.operationCode.code900 && !vm.isVisibleCleanButton) {
              validarPersonaFraudulenta({ tipo: documentType, valor: documentNumber }, err.data.Data);
            } else {
              console.error('Fallo en el servidor', err);
            }
          }
        })
      }
      else{
        vm.isVisibleCleanButton = true;
    }
    }

    function getCountriesSources() {
      mpfPersonFactory.getCountries()
      .then(function (response) { vm.countriesSource = response.Data; });
    }

    function getActivitiesSource() {
      mpfPersonFactory.getEconomicsActivities()
        .then(function (response) { vm.activitiesSource = response.Data; });
    }

    function getProfessionsSource() {
      mpfPersonFactory.getProfessions()
        .then(function (response) { vm.professionSource = response.Data; });
    }
    function getRelacionSource() {
      mpfPersonFactory.getRelacion()
        .then(function (response) { vm.relacionSource = response.Data; });
    }

    function getCivilStatusSource() {
      mpfPersonFactory.getCivilStatus()
      .then(function (response) {
        vm.civilStatusSource = _.map(response.Data, function(item) {
          if(vm.appCode === 'DECESO'){
            return {
              Codigo: item.CodigoEstadoCivilTron,
              Descripcion: item.NombreEstadoCivil,
              CodigoEstadoCivilTron: item.CodigoEstadoCivilTron,
            }
          }else{
            return {
              Codigo: item.CodigoEstadoCivil,
              Descripcion: item.NombreEstadoCivil,
              CodigoEstadoCivilTron: item.CodigoEstadoCivilTron,
            }
          }
        })
      });
    }

    function getDeparmentsSource() {
      mpfPersonFactory.getDeparments()
        .then(function (response) { vm.departmentSource = response.Data; });
    }

    function getProvincesSource(idDepartment, idProvince) {
      if (idDepartment) {
        mpfPersonFactory.getProvinces(idDepartment)
          .then(function (response) {
            vm.provinceSource = response.Data;
            if (idProvince) {
              vm.form.ProvinceCode = _.find(vm.provinceSource, function (item) { return item.Codigo === idProvince });
            }
          });
      } else {
        vm.provinceSource = ''
      }
    }

    function getDistrictSource(idProvince, idDistrict) {
      if (idProvince) {
        mpfPersonFactory.getDistrict(idProvince)
          .then(function (response) {
            vm.districtSource = response.Data;
            if (idDistrict) {
              vm.form.DistrictCode = _.find(vm.districtSource, function (item) { return item.Codigo === idDistrict });
            }
          });
      } else {
        vm.districtSource = ''
      }
    }

    function getViaTypeSource() {
      mpfPersonFactory.getViaType()
        .then(function (response) { vm.viaSource = response.Data; });
    }

    function getNumberTypeSource() {
      mpfPersonFactory.getNumberType()
        .then(function (response) { vm.numberTypeSource = response.Data; });
    }

    function getZoneTypeSource() {
      mpfPersonFactory.getZoneType()
        .then(function (response) { vm.typeZoneSource = response.Data; });
    }

    function getIndoorTypeSource() {
      mpfPersonFactory.getIndoorType()
        .then(function (response) { vm.indoorTypeSource = response.Data; });
    }

    function getRelationshipSource() {
      if (vm.appCode === 'CLINICA_DIGITAL') {
        mpfPersonFactory.getRelationshipTypesClinicaDigital().then(function (response) { vm.relationshipSource = response.Data; });
      }else{
        mpfPersonFactory.getRelationshipTypes().then(function (response) { vm.relationshipSource = response.Data; });
      }      
    }

    function getRepresentativeSource() {
      mpfPersonFactory.getRepresentativePositions()
        .then(function (response) { vm.representativeSource = response.Data; });
    }

    function getDateSource() {
      vm.daySource = mpfPersonFactory.getDays();
      vm.monthSource = mpfPersonFactory.getMonths();
      vm.yearSource = mpfPersonFactory.getYears();
    }

    function documentTypeChange() {
      vm.form.documentNumber = '';
      var numDocValidations = {};
      if (vm.formCode == "ACCIONISTA"){if(vm.form.documentType.Codigo==="RUC"){vm.isRuc=true;}else{vm.isRuc=false;}
      vm.searchField([vm.fields.TIP_DOCUM,vm.fields.COD_DOCUM,vm.fields.RELACION,vm.fields.NAME_PERSON,
      vm.fields.LASTNAME,vm.fields.BUSINESSNAME]);
      }
      if (!ng.isUndefined(vm.form.documentType)) {
        checkLegalPerson(vm.form.documentType.Codigo, vm.form.documentNumber);
        if (vm.formCode == "ACCIONISTA"){mainServices.documentNumber.fnFieldsValidated(numDocValidations, vm.form.documentType.Codigo, 0);}else{ 
        mainServices.documentNumber.fnFieldsValidated(numDocValidations, vm.form.documentType.Codigo, 1);

        }
        vm.docNumMaxLength = numDocValidations.DOCUMENT_NUMBER_MAX_LENGTH;
        vm.docNumMinLength = numDocValidations.DOCUMENT_NUMBER_MIN_LENGTH;
        vm.docNumType = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE;
        vm.docNumTypeDisabled = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE_DISABLED;
      }
    }

    function getAge() {

      var today = new Date();
      var dateString = vm.form.year.Descripcion + '-' + vm.form.month.Descripcion + '-' + vm.form.day.Descripcion;
      var birthDate = new Date(dateString);

      if (vm.appCode === 'VIDA') {

        return $filter('calculateActuarialAge')(birthDate);
      }
      if (vm.appCode === 'DECESO') {
        var yearNow = today.getYear();
        var monthNow = today.getMonth();
        var dateNow = today.getDate();

        var yearDob = birthDate.getYear();
        var monthDob = birthDate.getMonth();
        var dateDob = birthDate.getDate();

        var yearAge = yearNow - yearDob;

        if (monthNow >= monthDob)
          var monthAge = monthNow - monthDob;
        else {
          yearAge--;
          var monthAge = 12 + monthNow - monthDob;
        }

        if (dateNow <= dateDob) {
          monthAge--;
          if (monthAge < 0) {
            monthAge = 11;
            yearAge--;
          }
        }

        return yearAge;
      }

      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      vm.Age = age;
      return age;
    }

    function getDocumentNumber(data) {
      return data.CodigoDocumento || data.NumeroDocumento;
    }

    function cleanForm(exceptions) {
      var formControls = _.keys(vm.form);
      vm.Age = null;
      _.forEach(formControls, function (controlKey) {
        if (!_.contains(exceptions, controlKey)) {
          vm.form[controlKey] = '';
        }
      })
      checkLegalPerson(vm.form.documentType.Codigo, vm.form.documentNumber);
      vm.contractorData = {};
      vm.cleanedUp = true;
      vm.isVisibleCleanButton = false;
      vm.check = false;
      vm.blockDeparment = false;
      outData({ isClear: true });
    }

    function setContractorData(data) {

      vm.contractorData = data;
      if (_.keys(data).length) {
        _.forEach(_.keys(data), function (key) {
          if (key === 'Ubigeo') {
            _.forEach(_.keys(data[key]), function (ubiKey) {
              vm.form[ubiKey] = data[key][ubiKey];
            })
          } else {
            vm.form[key] = ng.isDefined(data[key]) && data[key]
              ? ng.isString(data[key])
                ? data[key].trim()
                : ng.isObject(data[key]) && (!Object.keys(data[key]).length || (ng.isDefined(data[key].Codigo) && data[key].Codigo === ''))
                  ? { Codigo: null }
                  : data[key]
              : data[key];
          }
        });

        vm.isVisibleCleanButton = (vm.form.documentType && vm.form.documentType.Codigo) && vm.form.documentNumber.length > 0;
        if(!vm.form.documentId) {
          vm.contractorData.CodigoDocumento = getDocumentNumber(data);
        } else{
          vm.form.documentType = (data.documentType && data.documentType.Codigo) ? data.documentType : {Codigo: data.documentType};
        }

        if (_.contains(['M', 'H', 'F'], data.Sexo)) {
          vm.form.Sexo = ['F', 'M'].indexOf(vm.form.Sexo) !== -1 ? '0' : '1';
        }
               
        
        vm.form.FullName = (data.Nombre) ? (data.Nombre + ' ' + data.ApellidoPaterno + ' ' + data.ApellidoMaterno) : '';

        vm.form.SaldoMapfreDolar = data.SaldoMapfreDolar;
        vm.form.prefijo = vm.form.prefijo || 51;
        vm.form.emailPersonal = clonedPerson.emailPersonal || data.emailPersonal || data.CorreoElectronico || data.Correo;
        vm.form.residenceCountry = vm.form.residenceCountry ? (vm.form.residenceCountry.Codigo ? vm.form.residenceCountry : { Codigo: data.Ubigeo && data.Ubigeo.CodigoPaisResidencia ? data.Ubigeo.CodigoPaisResidencia : "PE" }) : { Codigo: "PE" };

        vm.form.nationality = vm.form.nationality ? (vm.form.nationality.Codigo ? vm.form.nationality : { Codigo: data.Ubigeo && data.Ubigeo.CodigoPaisNatal ? data.Ubigeo.CodigoPaisNatal : "PE" }) : { Codigo: "PE" };
        vm.form.nativeCountry = vm.form.nativeCountry ? (vm.form.nativeCountry.Codigo ? vm.form.nativeCountry : { Codigo: data.Ubigeo && data.Ubigeo.CodigoPaisNatal ? data.Ubigeo.CodigoPaisNatal : "PE" }) : { Codigo: "PE" };
        vm.form.residenceCountryFiscal = vm.form.residenceCountryFiscal ? (vm.form.residenceCountryFiscal.Codigo ? vm.form.residenceCountryFiscal : { Codigo: data.Ubigeo && data.Ubigeo.CodigoPaisResidenciaFiscal ? data.Ubigeo.CodigoPaisResidenciaFiscal : "PE" }) : { Codigo: "PE" };

        if (data.CodigoEstadoCivil && data.CodigoEstadoCivil !== '0') {
          vm.form.civilState = {
            Codigo: vm.appCode === 'DECESO' ? data.CodigoEstadoCivilTron || '' : data.CodigoEstadoCivil
          };        
        }else{
          if(vm.appCode === 'DECESO' && data.CodigoEstadoCivilTron){
            vm.form.civilState = {
              Codigo: (vm.form.civilState && vm.form.civilState.Codigo) ? vm.form.civilState.Codigo : data.CodigoEstadoCivilTron
            };
          }
        }

        if (!vm.form.RepresentanteCargo && !vm.form.documentId) {
        vm.form.RepresentanteCargo = {
          Codigo: vm.form.TipoCargoRep
        }
        }

        if (data.FechaNacimiento) {
          var splitedDate = data.FechaNacimiento.split('/');
          vm.form.day = _.find(vm.daySource, function (item) { return item.Descripcion === splitedDate[0] });
          vm.form.month = _.find(vm.monthSource, function (item) { return item.Descripcion === splitedDate[1] });
          vm.form.year = _.find(vm.yearSource, function (item) { return item.Descripcion === +splitedDate[2] });
        }

        vm.form.size = vm.form.size || data.Talla || data.size;
        vm.form.weight = vm.form.weight || data.Peso || data.weight;

        vm.form.TelefonoOficina = data.TelefonoOficina;
        vm.form.Telefono2 = data.Telefono2;
        if(vm.appCode === 'DECESO'){
          vm.form.nationality = vm.form.nationality.Codigo ? vm.form.nationality : { Codigo: "PE" };
          vm.form.residenceCountry = vm.form.residenceCountryFiscal.Codigo ? vm.form.residenceCountryFiscal : { Codigo: "PE" };
          vm.form.Profesion =  data.Profesion && data.Profesion.Codigo ? {Codigo: data.Profesion.Codigo} : null;
          vm.form.Telefono2 = data.Telefono2;
        }
        if (vm.isVidaLey() && !vm.isEmitVidaLey() && !vm.form.documentId) {
          vm.form.Email = clonedPerson.CorreoElectronico || data.CorreoElectronico || data.Correo;
          vm.form.CorreoElectronico = "";
          vm.form.Phone = data.Telefono;
          vm.form.Telefono = "";
        } else if(vm.form.documentId){
          vm.form.CorreoElectronico = data.CorreoElectronico || data.Correo;
          vm.form.Telefono = data.Telefono;
          vm.form.Email = data.Email;
        }
        else {
          vm.form.CorreoElectronico = clonedPerson.CorreoElectronico || data.CorreoElectronico || data.Correo;
          vm.form.Telefono = data.Telefono;
        }

        clonedPerson = {};

        if (data.Ubigeo && vm.searchField(vm.addressControls)) {
          var departamento = {
            Codigo: data.Ubigeo.CodigoDepartamento ? data.Ubigeo.CodigoDepartamento : data.Ubigeo.Departamento ? data.Ubigeo.Departamento.Codigo : null ? vm.personData.Ubigeo.CodigoDepartamento : null
          }
          var provincia = {
            Codigo: data.Ubigeo.CodigoProvincia ? data.Ubigeo.CodigoProvincia : data.Ubigeo.Provincia ? data.Ubigeo.Provincia.Codigo : null ? vm.personData.Ubigeo.CodigoProvincia : null
          }
          var distrito = {
            Codigo: data.Ubigeo.CodigoDistrito ? data.Ubigeo.CodigoDistrito : data.Ubigeo.Distrito ? data.Ubigeo.Distrito.Codigo : null ? vm.personData.Ubigeo.CodigoDistrito : null
          }
          vm.getProvincesSource(departamento.Codigo, provincia.Codigo);
          vm.getDistrictSource(provincia.Codigo, distrito.Codigo);

          vm.form.Department = departamento;
          vm.form.Province = provincia;
          vm.form.District = distrito;
          vm.form.NombreVia = data.Ubigeo.Direccion || data.Ubigeo.NombreVia;
          vm.form.Via = { Codigo: data.Ubigeo.CodigoVia || null, Descripcion: data.Ubigeo.NombreVia };
          vm.form.NumberType = { Codigo: data.Ubigeo.CodigoNumero || null, Descripcion: data.Ubigeo.NumeroDescripcion };
          vm.form.TextoNumero = data.Ubigeo.TextoNumero;
          vm.form.Inside = { Codigo: data.Ubigeo.CodigoInterior || null, Descripcion: data.Ubigeo.InteriorDescripcion };
          vm.form.TextoInterior = data.Ubigeo.TextoInterior;
          vm.form.Zone = { Codigo: data.Ubigeo.CodigoZona || null, Descripcion: data.Ubigeo.ZonaDescripcion };
          vm.form.TextoZona = data.Ubigeo.TextoZona;
          vm.form.Referencia = data.Ubigeo.Referencia;
          vm.form.Direccion = data.Direccion;

          if (vm.appCode === personConstants.aplications.INSPECCIONES) {
            vm.form.Nombre = data.Nombre.substring(0, 80);
          }

          if (vm.form.documentType && vm.form.documentNumber) {
            checkLegalPerson(vm.form.documentType.Codigo, vm.form.documentNumber);
          }
        }
        outData(vm.form);
      } else {
        vm.form = data;
      }

      if(vm.checkDisabled('Nombre') && vm.appCode === 'FUNERARIAS' && 
      (!vm.checkDisabled('ApellidoPaterno') || !vm.checkDisabled('ApellidoMaterno'))){
        vm.enabledField = true;
      } else {
        vm.enabledField = false;
    }
    }

    function outData(data) {
      vm.outdata({ data: data });
    }
    function setValidacionTelefonos(validacion){vm.habilitarValidacionTelefonosFormulario = validacion;}
    function setValidacionDatosContacto(validacion){vm.habilitarValidacionListanegraDatosContactoFormulario = validacion;}

    function autoCompleteHandler(value) {
      vm.form[value].Descripcion = vm.form[value].descripcion;
      vm.form[value].Codigo = vm.form[value].codigo;
    }
    function pressPhone($event){if(!vm.telefValido) vm.telefValido = true;}
    function checkForm() {
      var personForm = $scope.personForm;
      vm.telefValido = true;
      personForm.markAsPristine();
      personForm.$setSubmitted();

      if(!_validarTelefonos()){
        vm.telefValido = false;
        return;
      }

      if(!vm.habilitarValidacionListanegraDatosContactoFormulario) {
        emitForm();
      } else {
        _validarDatosContactoEnListaNegra();
      }
    }

    function emitForm() {
      var personForm = $scope.personForm;

      if (personForm.$valid) {
        var objectEmit = {
          valid: personForm.$valid,
          legalPerson: vm.legalPerson
        };
        objectEmit[vm.formControlName] = vm.form;

        objectEmit[vm.formControlName].FechaNacimiento = vm.form.day && vm.form.month && vm.form.year && vm.form.day.Codigo && vm.form.month.Codigo && vm.form.year.Codigo
            ? vm.form.day.Descripcion + '/' + vm.form.month.Descripcion + '/' + vm.form.year.Descripcion
            : '';

        objectEmit[vm.formControlName].Ubigeo = {
          CodigoDepartamento: vm.form.Department ? vm.form.Department.Codigo : '',
          CodigoDistrito: vm.form.District ? vm.form.District.Codigo : '',
          CodigoInterior: vm.form.Inside ? vm.form.Inside.Codigo : '',
          CodigoNumero: vm.form.NumberType ? vm.form.NumberType.Codigo : '',
          CodigoPaisNatal: vm.form.nativeCountry ? vm.form.nativeCountry.Codigo : '',
          CodigoPaisResidencia: vm.form.residenceCountry ? vm.form.residenceCountry.Codigo : '',
          CodigoPaisResidenciaFiscal: vm.form.residenceCountryFiscal ? vm.form.residenceCountryFiscal.Codigo : '',
          CodigoProvincia: vm.form.Province ? vm.form.Province.Codigo : '',
          CodigoVia: vm.form.Via ? vm.form.Via.Codigo : '',
          CodigoZona: vm.form.Zone ? vm.form.Zone.Codigo : '',
          TextoInterior: vm.form.TextoInterior || '',
          NombreDepartamento: vm.form.Department ? vm.form.Department.Descripcion : '',
          NombreDistrito: vm.form.District ? vm.form.District.Descripcion : '',
          NombreProvincia: vm.form.Province ? vm.form.Province.Descripcion : '',
          NombreVia: vm.form.NombreVia || '',
          TextoNumero: vm.form.TextoNumero || '',
          Referencia: vm.form.Referencia || '',
          TextoZona: vm.form.TextoZona || ''
        }

        objectEmit[vm.formControlName].esFraudulento = personForm.esFraudulento;
        if(personForm.esFraudulento) {
          objectEmit[vm.formControlName].datosFraudulentos = personForm.datosFraudulentos;
        }

        $scope.$emit('personForm', objectEmit);

        if(vm.habilitarValidacionListanegraDatosContactoFormulario) {
          $scope.$emit('nextStepFromBlackList', true);
      }
    }
    }

    vm.isVidaLey = function () {
      return vm.appCode === 'VIDA_LEY';
    }

    vm.isEmitVidaLey = function () {
      return vm.formCode === 'EMI-VIDALEY-CN';
    }

    vm.isQuoteVidaLey = function () {
      return vm.formCode === 'COT-VIDALEY-CN';
    }

    function _validarDatosContactoEnListaNegra() {
      var personForm = $scope.personForm;

      if (personForm.$valid) {
        var requestBlackList = [];
        var contactoInputs = __getInputsDatosContacto();
  
        contactoInputs.forEach(function(obj) {
          if($scope.personForm[obj.control].$modelValue) {
            requestBlackList.push({ "tipo": obj.blackListType, "valor": $scope.personForm[obj.control].$modelValue });
  }
        });
  
        mpfPersonFactory.serviceValidBlackList(requestBlackList).then(function(response) {
          if(response.OperationCode === constants.operationCode.success) {
            evaluarRespuestaListaNegraDatosContacto(response);
          } else {
            emitForm();
          }
        }, function(err) {
          emitForm();
        });
      }
    }

    function evaluarRespuestaListaNegraDatosContacto(response) {
      var datosEnListaNegra = getArrayListaNegra(response);
      var msg = formarMensajeListaNegraContacto(datosEnListaNegra);

      if(msg !== "") {
        if($scope.esEjecutivo) {
          mModalAlert.showError(msg, 'Error');
        } else {
          var requestAuditoriaLN = getRequestAuditoriaListaNegra(datosEnListaNegra);
          confirmarListaNegraDatosContacto(msg, requestAuditoriaLN);
        }
      } else {
        emitForm();
      }
    }

    function getArrayListaNegra(response) {
      var requestAuditoriaLN = [];
      var datosEnListaNegra = response.Data.filter(function(obj) { return obj.Resultado; });

      if(datosEnListaNegra) {
        datosEnListaNegra.forEach(function(obj) {
          var existe = requestAuditoriaLN.filter(function(d){ 
            return d.Tipo.toUpperCase() === obj.Tipo.toUpperCase() && d.Valor.toUpperCase() === obj.Valor.toUpperCase()
          }).length;
          if(existe === 0) {
            requestAuditoriaLN.push(obj);
          }
        });
      }

      return requestAuditoriaLN;
    }

    function formarMensajeListaNegraContacto (lista) {
      var msg = "";
      if(!(lista && lista > 0)) { return msg; }

      if($scope.esEjecutivo) {
        lista.forEach(function(lstnR) {
          var msgComun = "est&aacute; en la tabla de Cliente/Unidad inelegible por estudios t&eacute;cnicos.";
          switch(lstnR.Tipo) {
            case "CORREO": { msg += "El correo " + msgComun + "<br/>"; }; break;
            case "TLF_MOVIL": { msg += "El tel&eacute;fono m&oacute;vil " + msgComun + "<br/>"; }; break;
            case "TLF_FIJO": { msg += "El tel&eacute;fono fijo " + msgComun + "<br/>"; }; break;
            default: "";
          }
        });
      } else {
        var proceso = vm.processName || 'COTIZACI&Oacute;N';
        msg = 'Cliente/Unidad inelegible por estudios t&eacute;cnicos, la emisi&oacute;n estar&aacute; supedita a revisi&oacute;n.<br/><br/>&iquest;DESEA CONTINUAR CON LA ' + proceso + '?'; 
      }
      return msg;
    }
    
    function getRequestAuditoriaListaNegra(datosEnListaNegra) {
      var requestAuditoriaLN = [];

      datosEnListaNegra.forEach(function(obj) {
        requestAuditoriaLN.push({ codAplicacion: vm.appCode, tipoDato: obj.Tipo, valorDato: obj.Valor });
      });

      return requestAuditoriaLN;
    }

    function confirmarListaNegraDatosContacto(fullMsg, datosLN) {
      mModalConfirm.confirmError(fullMsg, '&iquest;Desea continuar?')
      .then(function(ok) {
          if(ok) {
            $scope.personForm.esFraudulento = true;
            $scope.personForm.datosFraudulentos = datosLN;

            datosLN.forEach(function(element) {
              element.aceptaAdvertencia = true;
              !vm.notSaveBlacklistAudit && mpfPersonFactory.serviceSaveAuditBlackList(element).then();
            });

            emitForm();
          } 
      });
    }

    function validarPersonaFraudulenta(datoEvaluado, data) {
      if($scope.esEjecutivo) {
        bloquearFraudulento();
      } else {
        var tipoPerfil = $scope.esAgente ? 'A' : ($scope.esCorredor ? 'B' : null);
        confirmarPersonaFraudulenta(tipoPerfil, datoEvaluado, data);
      }
    }

    function bloquearFraudulento() {
	  mModalAlert.showError('El tipo y n&uacute;mero de documento est&aacute; en la tabla de Cliente/Unidad inelegible por estudios t&eacute;cnicos.', 'Error');
      cleanForm(['documentType']);
      outData({ noData: true, isClear: true, esFraudulento: true, aceptaAdvertencia: false});
    }

    function confirmarPersonaFraudulenta(perfil, datoEvaluado, data) {
      if(!perfil) return;
      var requestBL = { codAplicacion: vm.appCode, tipoDato: datoEvaluado.tipo, valorDato: datoEvaluado.valor };
      var proceso = vm.processName || 'COTIZACI&Oacute;N';
      var titulo = 'Cliente/Unidad inelegible por estudios t&eacute;cnicos, la emisi&oacute;n estar&aacute; supedita a revisi&oacute;n.<br/><br/>&iquest;DESEA CONTINUAR CON LA ' + proceso + '?'; 
      
      mModalConfirm.confirmError(titulo, '', 'SI', undefined, 'NO')
      .then(function(ok) {
          if(ok) {
            data.aceptaAdvertencia = true;
            setContractorData(data);
            requestBL.aceptaAdvertencia = data.aceptaAdvertencia;
            !vm.notSaveBlacklistAudit && mpfPersonFactory.serviceSaveAuditBlackList(requestBL).then();
          } 
      }, function(res) {
        // cancel
        requestBL.aceptaAdvertencia = false;
        !vm.notSaveBlacklistAudit && mpfPersonFactory.serviceSaveAuditBlackList(requestBL).then();
        cleanForm(['documentType']);
        outData({ noData: true, isClear: true, esFraudulento: true, aceptaAdvertencia: requestBL.aceptaAdvertencia});
      });
    }
  }
  return ng.module('mapfre.controls')
    .controller('mpfPersonController', mpfPersonController)
    .component('mpfPersonComponent', {
      templateUrl: '/scripts/mpf-main-controls/components/mpf-person/components/mpf-person.template.html',
      controller: 'mpfPersonController as vm',
      bindings: {
        validBlacklistNumdoc: '@',
        processName: '@',
        notSaveBlacklistAudit: '=',
        habilitarValidacionListanegraDatosContacto: '=',
        documentType: '=',
        documentNumber: '=',
        codigoCompania: '=',
        tipoRol: '=',
        personData: '=',
        blockFields: '=',
        blockAll: '=',
        hiddenFields: '=',
        noButton: '=',
        name: '@',
        appCode: '@',
        formCode: '@',
        textClean: '@',
        outdata: '&',
        habilitarValidacionTelefonos: '=',
        blockDeparment: '=',
        check: '=?',
        ageRange: '=?',
        focus: '=?',
        disabledFecha :'='
      }
    })
})
