define(['angular', 'system', 'generalConstant','actterFactory'], function(angular, system, generalConstant) {
  contactFormController.$inject = ['$scope','actterFactory','proxyCliente','mainServices'];
  function contactFormController($scope,actterFactory,proxyCliente,mainServices) {
    var vm = this;

    vm.saveContact = saveContact
    vm.closeContact = closeContact
    vm.documentTypeChange = documentTypeChange;
    vm.getDepartament = getDepartament;
    vm.getProvinces = getProvinces;
    vm.getDistrict = getDistrict;

    vm.countryParam = {
      codPais :0
    };


    function closeContact (){
      vm.form.isOpen=!vm.form.isOpen
      vm.close()
    }

    function saveContact (){
      if(!vm.contactForm.$valid){
        vm.contactForm.markAsPristine()
        return;
      }
      vm.contact.estadoContacto = vm.contact.estado.codigo;
      vm.contact.empleador.instPEP = vm.contact.empleador.instPEP ? "S" : "N";
      vm.contact.documento.numero = vm.documentNumber.toUpperCase();
      vm.save({
        $event: {
          form: vm.contact
        }
      })
    }

    function loadData(data){
      vm.contact = data;
      vm.contact.estado = {
        codigo: vm.contact.estadoContacto
      };
      vm.contact.empleador.instPEP = vm.contact.empleador.instPEP=="S" ? true : false;
      if(vm.contact.fechaNacimiento){
        vm.contact.fechaNacimiento = new Date( vm.contact.fechaNacimiento);
      }
      vm.contact.numeroHijos = vm.contact.numeroHijos.toString();
      vm.contact.empleador.tiempoServicio = vm.contact.empleador.tiempoServicio.toString();
      vm.countryParam.codPais= vm.contact.direccion.pais ? vm.contact.direccion.pais.codigo : null;
      vm.documentNumber = data.documento.numero;
      documentTypeChange(true);
    }

    vm.$onInit = function() {
      if(vm.update){
        var params = {
          documento:vm.form.cliente.documento,
          codContacto: vm.form.codContacto
        }
        proxyCliente.obtenerContactos(params,true).then(function(response){
          if (response.OperationCode === constants.operationCode.success) {
            loadData(response.Data[0]);
            if(vm.contact.direccion.pais) getDepartament(vm.contact.direccion.pais.codigo,false);
            if(vm.contact.direccion.departamento) getProvinces(vm.contact.direccion.departamento.codigo,false);
            if(vm.contact.direccion.provincia) getDistrict(vm.contact.direccion.provincia.codigo,false);
          }
        }).catch(function(error){
          console.error(error)
        })
      }
    };

    function getDepartament(idCountry,change) {
      if(!idCountry) return;
      vm.countryParam.codPais= idCountry
      if(change){
        vm.contact.direccion.departamento = null;
        vm.contact.direccion.provincia = null;
        vm.contact.direccion.distrito = null;
      }
      actterFactory.ubigeo.getDepartament(vm.countryParam).then(function(response){
        vm.departaments = actterFactory.ubigeo.mapUbigeo(response.Data) 
      }).catch(function(error){
        console.error(error)
      })
    }

    function getProvinces(idDepartment,change) {
      if(!idDepartment) return;
      if(change){
        vm.contact.direccion.provincia = null;
        vm.contact.direccion.distrito = null;
      }
      actterFactory.ubigeo.getProvinces(idDepartment,vm.countryParam).then(function(response){
        vm.provinces = actterFactory.ubigeo.mapUbigeo(response.Data) 
      }).catch(function(error){
        console.error(error)
      })
    }

    function getDistrict(idProvince,change) {
      if(!idProvince) return;
      if(change) vm.contact.direccion.distrito = null;
      actterFactory.ubigeo.getDistrict(idProvince,vm.countryParam).then(function(response){
          vm.district = actterFactory.ubigeo.mapUbigeo(response.Data) 
      }).catch(function(error){
          console.error(error)
      })
    }

    function documentTypeChange(init) {
      if(!init){
        vm.documentNumber = '';
      }
      var numDocValidations = {};
      if(!angular.isUndefined(vm.contact.documento)){
        mainServices.documentNumber.fnFieldsValidated(numDocValidations, vm.contact.documento.codigo, 1);
        vm.docNumMaxLength = numDocValidations.DOCUMENT_NUMBER_MAX_LENGTH;
        vm.docNumMinLength = numDocValidations.DOCUMENT_NUMBER_MIN_LENGTH;
        vm.docNumType = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE;
        vm.docNumTypeDisabled = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE_DISABLED;
      }
    }

  }

  return angular
    .module(generalConstant.APP_MODULE)
    .controller('contactFormController', contactFormController)
    .component('contactForm', {
      templateUrl: system.apps.actter.location + '/app/common/components/contact-form/contact-form.html',
      controller: 'contactFormController as vm',
      bindings: {
        form: '=',
        save : '&',
        close : '&',
        update : '=',
        paramsForm: '='
      }
    });
});
