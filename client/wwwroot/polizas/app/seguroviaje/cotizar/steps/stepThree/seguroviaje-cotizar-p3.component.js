'use strict';

define([
  'angular',
  'lodash',
  'seguroviajeFactory',
  'seguroviajeService',
  'ErrorHandlerService',
  'mpfPersonComponent',
  'mpfPersonConstants'
], function(ng, _) {

  SeguroviajeCotizarStepThreeController.$inject = [
    '$scope',
    '$state',
    '$timeout',
    'seguroviajeFactory',
    'seguroviajeService',
    'mModalAlert',
    'mpSpin',
    'ErrorHandlerService'
  ];

  function SeguroviajeCotizarStepThreeController(
    $scope
    , $state
    , $timeout
    , seguroviajeFactory
    , seguroviajeService
    , mModalAlert
    , mpSpin
    , ErrorHandlerService
  ) {
    var vm = this;
    vm.$onInit = onInit;
    function onInit(){
      vm.currentStep = $state.params.step;
      vm.formData = seguroviajeFactory.getFormData();
      vm.companyCode = constants.module.polizas.autos.companyCode;
      vm.appCode = personConstants.aplications.SEGURVIAJES;
      vm.formCodeCN = personConstants.forms.COT_SEG_CN;
      vm.formCodeVJ = personConstants.forms.COT_SEG_VJ;
      vm.habilitarValidacionTelef = false;
      $scope.$on('personForm', function(event, data) {
        if (data.contratante) {
          setPersonData(data.contratante);
          vm.formData[2].contratante.tipoContratante = {
            id : data.legalPerson ? 1 : 0,
            name : 'PERSONA ' + data.legalPerson ? 'JURIDICA' : 'NATURAL',
          };
          if (vm.formData[2].viajeros[0].asContratante) {
            setPersonData(data.contratante, 0);
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

      if(ng.isUndefined(vm.formData[1]) || !vm.formData[1].stepTwoFinish){
        $state.go('.',{
          step: 2
        });
      }
      else{
        vm.userAdminRegular = JSON.parse(window.localStorage.getItem("evoProfile")).userAdminRegular
        vm.formData[2] = checkFormData();
        vm.adultDate = new Date(new Date().setFullYear(new Date().getFullYear() - 18 ));
        vm.tipoContratante = seguroviajeFactory.getDocuments();
        vm.resetBonus = checkDiffBonusBody();
        vm.setAsContractor = setAsContractor;
        vm.fnShowNaturalPerson = _fnShowNaturalPerson;
        vm.cleanObjectByProperties = cleanObjectByProperties;
        vm.getContractor = getContractor;
        vm.setPrima = setPrima;
        vm.showNaturalPerson = true;
        vm.getContractorData = getContractorData;
        vm.getTravelerData = getTravelerData;

        // Este watch es solo para escuchar los cambios que se realicen en el paso 3
        $scope.$watch('vm.formData[2]', function(){
          if(!ng.isUndefined(vm.formData[2]) && vm.formData[2].viajeros[0].CodigoDocumento){
            $timeout(function(){
              checkPercentage()
            })
            vm.resetBonus = checkDiffBonusBody();
          }
        }, true)
      }
    }

    vm.isDuplicated = isDuplicated;
    function isDuplicated(item){
      if(item.CodigoDocumento.length == item.tipoDocumento.maxLength){
        var travelers = _.without(vm.formData[2].viajeros, item)
        if(_.find(travelers, {'CodigoDocumento': item.CodigoDocumento})){
          item.duplicated = true
          $scope.stepThreeForm.$error.duplicated = true;
        }else{
          item.duplicated = false
        }
      }else{
        item.duplicated = false
      }
    }

    function setPersonData(data, viajeroPosition) {
      if (ng.isUndefined(viajeroPosition)) {
        vm.formData[2].contratante = data;
        vm.formData[2].contratante.tipoDocumento = {
          codigo: data.documentType.Codigo,
          descripcion: data.documentType.Descripcion
        };
        vm.formData[2].contratante.CodigoDocumento = data.documentNumber;
      } else {
        vm.formData[2].viajeros[viajeroPosition] = _.merge(vm.formData[2].viajeros[viajeroPosition], data);
        vm.formData[2].viajeros[viajeroPosition].tipoDocumento = {
          codigo: data.documentType.Codigo,
          descripcion: data.documentType.Descripcion
        };
        vm.formData[2].viajeros[viajeroPosition].CodigoDocumento = data.documentNumber;
        vm.formData[2].viajeros[viajeroPosition].TipoDocumento = data.documentType ? data.documentType.Codigo : '';
      }
    }

    // Metodo que llama servirvicio para validar si el documento corresponde a una persona juridica/natural
    function _fnShowNaturalPerson(){
      var typecon = vm.formData[2].contratante.tipoContratante.id;
      var typedoc = vm.formData[2].contratante.tipoDocumento.codigo;
      var doc = ng.isUndefined(vm.formData[2].contratante.CodigoDocumento) ? "" : vm.formData[2].contratante.CodigoDocumento
      return typecon == 0 && (typedoc === "DNI" || typedoc === "CIP" || typedoc === "CEX") || (typecon == 1 && typedoc === "RUC" && doc.substr(0,1) == "1")
    }

    vm.fnIsRuc10 = _fnIsRuc10;
    function _fnIsRuc10(){
      var typecon = vm.formData[2].contratante.tipoContratante.id;
      var typedoc = vm.formData[2].contratante.tipoDocumento.codigo;
      var doc = ng.isUndefined(vm.formData[2].contratante.CodigoDocumento) ? "" : vm.formData[2].contratante.CodigoDocumento
      return typecon == 1 && typedoc === "RUC" && doc.substr(0,1) == "1"
    }
    // Este metodo retorna un booleano dependiendo si hubo un cambio en los datos que se usaron para generar la prima
    // y se determina si hace falta generar un nuevo calculo de prima
    function checkDiffBonusBody(){
      if(!_.isEmpty(seguroviajeFactory.getBonusCopy())){
        return !seguroviajeFactory.isEqualBonus(seguroviajeFactory.getBonusCopy(), seguroviajeFactory.setBonusBody(vm.formData))
      }
    }
    // Metodo que verifica si existe un formulario de este paso guardado, si no genera un objeto vacio
    function checkFormData(){
      if(ng.isUndefined(vm.formData[2])){
        return seguroviajeFactory.newStepThreeObject(vm.formData[0].numViajeros)
      }
      else{
        if(vm.formData[0].numViajeros != vm.formData[2].viajeros.length){
          vm.formData[2].viajeros = seguroviajeFactory.newViajerosArray(vm.formData[0].numViajeros)
        }
        return vm.formData[2]
      }
    }
    // Metodo para colocar un viajero con la misma informaciÃ³n del contratante
    function setAsContractor(value){
      value && $scope.$broadcast('submitForm', true);
      if (value) {
        vm.formData[2].viajeros[0] = vm.formData[2].contratante
      }
      if (!value && (!vm.formData[2].viajeros[0].CodigoDocumento || !vm.formData[2].viajeros[0].TipoDocumento)) {
        vm.formData[2].viajeros[0] = seguroviajeFactory.newStepThreeObject().contratante
      }
      vm.formData[2].viajeros[0].asContratante = value;
    }
    // Metodo para limpiar un objeto segun un arreglo de propiedades definido
    function cleanObjectByProperties(object, properties){
      return seguroviajeFactory.cleanObjectByProperties(object, properties);
    }

    vm.fnCleanTraveler = _fnCleanTraveler;
    function _fnCleanTraveler(item, value){
      $scope.stepThreeForm['numdocumento'+value].$pristine = true
      item.CodigoDocumento = ""
      item.Nombre = ""
      item.ApellidoPaterno = ""
      item.ApellidoMaterno = ""
      item.CorreoElectronico = ""
      item.Telefono2 = ""
      item.FechaNacimiento = ""
    }

    function getContractorData(data) {
      if (data.documentType) {
        vm.isRuc10 = data.documentNumber.length > 10 && data.documentNumber.substring(0, 2) == 10;
        vm.showNaturalPerson = 
          ng.isString(data.documentType)
            ? data.documentType !== 'RUC'
            : data.documentType.Codigo !== 'RUC'
            || vm.isRuc10;
      }
    }

    function getTravelerData(data, idx) {
      if (data.isClear && !vm.formData[2].viajeros[idx].Nombre) {
        vm.formData[2].viajeros[idx].Nombre = "";
        vm.formData[2].viajeros[idx].ApellidoPaterno = "";
        vm.formData[2].viajeros[idx].ApellidoMaterno = "";
        vm.formData[2].viajeros[idx].CorreoElectronico = "";
        vm.formData[2].viajeros[idx].Telefono2 = "";
        vm.formData[2].viajeros[idx].asContratante = false;
      }
    }

    // Metodo que convoca al servicio que retorna la informacion de un contratante existente, para autocompletar
    // campos correspondientes
    function getContractor(object){
      mpSpin.start();
      object.Nombre = ""
      object.ApellidoPaterno = ""
      object.ApellidoMaterno = ""
      object.CorreoElectronico = ""
      object.Telefono2 = ""
      object.FechaNacimiento = ""
      object.filledByService = false;
      if(object.CodigoDocumento &&
        object.CodigoDocumento.length == object.tipoDocumento.maxLength &&
        !object.duplicated){
        vm.showNaturalPerson = _fnShowNaturalPerson();
        vm.isRuc10 = _fnIsRuc10();
        var paramsContractor = {
          type: object.tipoDocumento.codigo
          , number: object.CodigoDocumento
        };
        seguroviajeService.getContractor(paramsContractor)
          .then(function(response){
            if(response.OperationCode == 200){
              object = seguroviajeFactory.setValuesByObject(object, response.Data);
              object.CodigoDocumento = object.CodigoDocumento;
              object.filledByService = true;
            }else if(response.Message != "") mModalAlert.showWarning(response.Message, '')
          })
          .catch(function(err){
            ErrorHandlerService.handleError(err);
          })
      }
      mpSpin.end();
    }
    // Este metodo busca marcar un limite de 0 a 100 para el descuento, a su vez limita la cantidad de decimales a 2
    function checkPercentage() {
      if (vm.formData[2].descuento < 0 || vm.formData[2].descuento == '') vm.formData[2].descuento = 0;
      if (vm.formData[2].descuento > 100) vm.formData[2].descuento = 100;

      var decimales = vm.formData[2].descuento.toString().split(".")[1];
      if(!ng.isUndefined(decimales) && decimales.length > 2){
        vm.formData[2].descuento = parseFloat(vm.formData[2].descuento).toFixed(2)
      }
    }
    // Metodo que valida el formulario, para luego llamar al servicio que genera la prima
    function setPrima() {
      vm.habilitarValidacionTelef = false;
      setTimeout(function () {
        $scope.$broadcast('submitForm', true);
      }, 1000);
      if (_hasDuplicateElementByProperty(vm.formData[2].viajeros, 'CodigoDocumento')) {
        mModalAlert.showWarning('No puede haber viajeros con el mismo nÃºmero de documento', '')
        return;
      }
      // Se convoca a un metodo que verifica si existe un numero de documento repetido{
      if($scope.stepThreeForm.$valid){
        seguroviajeService.calculateBonus(seguroviajeFactory.setBonusBody(vm.formData), true)
          .then(function(response){
            // if(response.data.cotizacion){
            if(response.operationCode == 200 && response.data.codError == 0){
              seguroviajeFactory.saveBonusCopy(seguroviajeFactory.setBonusBody(vm.formData))
              vm.resetBonus = checkDiffBonusBody();
              vm.formData[2].prima = response.data.cotizacion.conceptosDesglose.impPrimaTotal;
              vm.formData[2].numCotizacion = response.data.cotizacion.numCotizacion;
              vm.formData[2].stepThreeFinish = true;
              seguroviajeFactory.setNewFormData(vm.formData)
            }else mModalAlert.showError('Error en el proceso de cotizaciÃ³n, comunicarse con un ejecutivo Mapfre', "Â¡Error!")
          })
      }else mModalAlert.showWarning('Existen errores en el formulario. Por favor corregir antes de calcular prima', "")
    }

    function fnValidateForm(){
      vm.habilitarValidacionTelef = true;
      setTimeout(function () {
        $scope.$broadcast('submitForm', true);
        $scope.stepThreeForm.markAsPristine();
      }, 1000);
      return $scope.stepThreeForm.$valid && _validarTelefonos();
    }

    function _validarTelefonos(){
      var contratante = vm.formData[2].contratante;
      var viajeros = vm.formData[2].viajeros;
      var telefonoValido = false;
      if(contratante.Telefono2 !== "" && contratante.Telefono2 !== undefined){
        telefonoValido = true;
        for (var i = 0; i < viajeros.length; i++){
          var item = viajeros[i];
          if(item.Telefono2 === "" || item.Telefono2 === undefined){
            telefonoValido = false;
            break;
          }
        }
      }
      return telefonoValido;
    }

    vm.nextStep = nextStep;
    function nextStep(){
      if (_hasDuplicateElementByProperty(vm.formData[2].viajeros, 'CodigoDocumento')) {
        mModalAlert.showWarning('No puede haber viajeros con el mismo nÃºmero de documento', '')
        return;
      }

      var validateForm = fnValidateForm();
      if(!validateForm){
        mModalAlert.showWarning('Antes de continuar debe completar los campos obligatorios', '')
      }
      else{
        $state.go('seguroviajeCotizar.initSteps.steps', {step: 4})
      }

    }

    function _hasDuplicateElementByProperty(arrayElements, propertyName) {
      var listPropertyElements = _.map(arrayElements, function(element) {
        return element[propertyName];
      });

      var listDuplicateElement = _.filter(listPropertyElements, function(element, index) {
        return listPropertyElements.indexOf(element) !== index;
      });

      return listDuplicateElement.length > 0;
    }


  }

  return ng.module('appSeguroviaje')
    .controller('SeguroviajeCotizarStepThreeController', SeguroviajeCotizarStepThreeController)
    .component('seguroviajeCotizarStepThreeComponent', {
      templateUrl: '/polizas/app/seguroviaje/cotizar/steps/stepThree/seguroviaje-cotizar-p3.html',
      controller: 'SeguroviajeCotizarStepThreeController as vm',
      binding: {}
    })
})
