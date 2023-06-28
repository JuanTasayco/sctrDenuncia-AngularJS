'use strict';

define([
  'angular',
  'lodash',
  'seguroviajeFactory',
  'seguroviajeService',
  '/scripts/mpf-main-controls/components/contractorAddress/service/contractorAddressFactory.js',
  '/scripts/mpf-main-controls/components/ubigeo/service/ubigeoFactory.js',
  'mpfPersonComponent',
  'mpfPersonConstants'
  ], function(ng, _) {

  SeguroviajeEmitirStepTwoController.$inject = [
    '$scope',
    '$state',
    'mpSpin',
    'seguroviajeFactory',
    'seguroviajeService',
    'contractorAddressFactory',
    'ubigeoFactory'
  ];

  function SeguroviajeEmitirStepTwoController($scope, $state, mpSpin, seguroviajeFactory, seguroviajeService, contractorAddressFactory, ubigeoFactory) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit(){
      vm.currentStep = $state.params.step; 
      if(_.isEmpty(seguroviajeFactory.getFormData())){
        $state.go('.', { step : 1 })
      }
      else{
        vm.formData = setFormatData(seguroviajeFactory.getFormData());
        vm.getProvincias = getProvincias;
        vm.getDistritos = getDistritos;
        vm.saveForm = saveForm;
        vm.companyCode = constants.module.polizas.autos.companyCode;
        vm.appCode = personConstants.aplications.SEGURVIAJES;
        vm.formCodeCN = personConstants.forms.EMI_SEG_CN;
        vm.formCodeVJ = personConstants.forms.EMI_SEG_VJ;
        
        $scope.$on('personForm', function(event, data) {
          if (data.contractor) {
            setPersonData(data.contractor);
            if (vm.formData.travelers[0].asContractor) {
              setPersonData(data.contractor, 0);
            }
          }
          var viajeroPosition;
          _.forEach(_.keys(data), function(key) {
            viajeroPosition = key.split('-').length > 0 ? key.split('-')[1] : null;
          })
          if (viajeroPosition) {
            var viajeroData = data['viajero-' + viajeroPosition];
            setPersonData(viajeroData, viajeroPosition);
          }
        });

        loadData();
        getEconomicsActivities();
        
        if (ng.isUndefined(vm.formData.personSaved)) {
          getAllPersonData();
        }
      }
    }
    function getAllPersonData() {
      vm.formData.contractor = _.merge(vm.formData.contractor, getPersonData());

      _.forEach(vm.formData.travelers, function(traveler, index) {
        traveler = _.merge(traveler, getPersonData(index))
      })
    }
    function getPersonData(viajeroPosition) {
      var personData = {}
      var formData = ng.isUndefined(viajeroPosition)
      ? vm.formData.contractor
      : vm.formData.travelers[viajeroPosition]

      personData.documentType = {
        Codigo: formData.documentType.code,
        Descripcion: formData.documentType.description,
      }
      personData.NumeroDocumento = formData.documentNumber;
      personData.Nombre = formData.name;
      personData.ApellidoPaterno = formData.firstLastName;
      personData.ApellidoMaterno = formData.secondLastName;
      personData.FechaNacimiento = formData.birthDate;
      personData.CorreoElectronico = formData.email;
      personData.Telefono2 = formData.mobile;
      personData.TipoDocumento = {
        Codigo: formData.documentType.code,
        Descripcion: formData.documentType.description,
      };

      return personData;
    }
    function setPersonData(data, aseguradoPosition) {
      var formData = ng.isUndefined(aseguradoPosition)
        ? vm.formData.contractor
        : vm.formData.travelers[aseguradoPosition];

      formData.documentType = {
        code: data.documentType.Codigo,
        description: data.documentType.Descripcion
      };
      formData.documentNumber = data.documentNumber;
      formData.name = data.Nombre;
      formData.firstLastName = formData.personType == 'S'
        ? data.ApellidoPaterno
        : '';
      formData.secondLastName = formData.personType == 'S'
        ? data.ApellidoMaterno
        : '';
      formData.email = data.CorreoElectronico;
      formData.mobile = data.Telefono2;
      formData.mcaSexo = data.Sexo;
      formData.birthDate = data.FechaNacimiento;
      formData.tipActEconomica = data.ActividadEconomica;
      formData.departamento = data.Department;
      formData.provincia = data.Province;
      formData.distrito = data.District;
      formData.via = data.Via;
      formData.nombreVia = data.NombreVia;
      formData.tipoNumero = data.NumberType;
      formData.enumeracion = data.TextoNumero;
      formData.tipoInterior = data.Inside;
      formData.tipoZona = data.Zone;
      formData.nombreZona = data.TextoZona;
      formData.referencia = data.Referencia;

      formData = _.merge(formData, data);
    }
    function setFormatData(object){
      var newArrary = ng.copy(object)
      newArrary.contractor.pais = 'PERU'
      newArrary.contractor.tipo = 'PERSONA ' + (newArrary.contractor.personType == 'S' ? 'NATURAL' : 'JURIDICA' )
      _.forEach(newArrary.travelers, function(traveler){
        traveler.pais = 'PERU'
      })
      if(newArrary.contractor.documentNumber == newArrary.travelers[0].documentNumber){
        newArrary.contractor.birthDate = newArrary.travelers[0].birthDate
        newArrary.travelers[0] = newArrary.contractor
        newArrary.travelers[0].asContractor = true
      }
      return newArrary;
    }
    function getProvincias(object) {
      if (!object.departamento || object.departamento.Codigo == null) {
        object.dataProvincias = [];
        object.dataDistritos = [];
      } 
      else {
        mpSpin.start();
        ubigeoFactory.getProvincias(object.departamento.Codigo)
        .then(function(response) {
          mpSpin.end();
          object.dataProvincias = response.Data
        });
      }
    };
    function getDistritos(object) {
      mpSpin.start();
      ubigeoFactory.getDistritos(object.provincia.Codigo)
      .then(function(response) {
        mpSpin.end();
        object.dataDistritos = response.Data
      });
    };

    function loadData(){
      ubigeoFactory.getDepartamentos()
      .then(function(response) {
        if (response.OperationCode == constants.operationCode.success){
          vm.dataDepartamentos = response.Data;
        }
      });
      contractorAddressFactory.getTypeVias()
      .then(function(response){
				if (response.OperationCode == constants.operationCode.success){
					vm.typeViaData = response.Data;
				}
			});
      contractorAddressFactory.getTypeNumbers()
      .then(function(response){
				if (response.OperationCode == constants.operationCode.success){
					vm.typeNumberData = response.Data;
				}
			});
      contractorAddressFactory.getTypeInteriors()
      .then(function(response){
				if (response.OperationCode == constants.operationCode.success){
					vm.typeInteriorData = response.Data;
				}
			});
      contractorAddressFactory.getTypeZones()
      .then(function(response){
				if (response.OperationCode == constants.operationCode.success){
					vm.typeZoneData = response.Data;
				}
			});
    }
    function getEconomicsActivities(){
      mpSpin.start();
      seguroviajeService.getEconomicsActivities()
      .then(function(response){
        mpSpin.end();
        vm.activitiesData = response.data
      })
    }
    function saveForm(){
      $scope.$broadcast('submitForm', true);
      vm.formData.personSaved = true;
      if($scope.stepTwoForm.$valid){
        seguroviajeFactory.setNewFormData(vm.formData);
        $state.go('.', {step: 3});
      }
    }
  }

  return ng.module('appSeguroviaje')
    .controller('SeguroviajeEmitirStepTwoController', SeguroviajeEmitirStepTwoController)
    .component('seguroviajeEmitirStepTwoComponent', {
      templateUrl: '/polizas/app/seguroviaje/emitir/steps/stepTwo/seguroviaje-emitir-p2.html',
      controller: 'SeguroviajeEmitirStepTwoController as vm',
      binding: {}
    })
})
