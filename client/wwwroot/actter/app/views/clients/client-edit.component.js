'use strict';
define(['angular','lodash','system', 'generalConstant','contactForm','actterFactory','proxyActter'], function(angular,_, system, generalConstant,actterFactory,proxyActter) {

  ClientEditController.$inject = ['$scope','actterFactory','$stateParams','mModalConfirm','proxyCliente','dataClient','dataForm','mModalAlert'];
  function ClientEditController($scope,actterFactory,$stateParams,mModalConfirm,proxyCliente,dataClient,dataForm,mModalAlert) {
    var vm = this;

    //ubigeo
    $scope.countries= {}
    $scope.addContactForm = {}
    $scope.showAddContactForm = false;
    $scope.paramsForm = dataForm;
    $scope.showComponents=true;
    $scope.hideFields = [];
    $scope.notRequiredFields = [];
    $scope.disabledFields = [];
    loadData(dataClient);

    vm.$onInit = function() {
      getCountries();
      
    };

    function loadData(data){
      $scope.datosClient = _.assign({}, data);
      if($scope.datosClient.fechaNacimiento){
        $scope.datosClient.fechaNacimiento = new Date( $scope.datosClient.fechaNacimiento);
      }
      if($scope.datosClient.fechaAniversario){
        $scope.datosClient.fechaAniversario = new Date( $scope.datosClient.fechaAniversario);
      }
      if($scope.datosClient.fechaDefuncion){
        $scope.datosClient.fechaDefuncion = new Date( $scope.datosClient.fechaDefuncion);
      }
      $scope.datosClient.numeroHijos = $scope.datosClient.numeroHijos.toString();
      $scope.datosClient.empleador.tiempoServicio = $scope.datosClient.empleador.tiempoServicio.toString();
      $scope.datosClient.empleador.instPEP = $scope.datosClient.empleador.instPEP=="S" ? true : false;
      $scope.datosClient.empleador.instPublica = $scope.datosClient.empleador.instPublica=="S" ? true : false;
      if($scope.datosClient.tipoPersona.codigo=='N') $scope.isRuc = true;
    }

    function setData(){
      $scope.datosClient.documento = dataClient.documento;
      $scope.datosClient.empleador.instPEP = $scope.datosClient.empleador.instPEP ? "S" : "N";
      $scope.datosClient.empleador.instPublica = $scope.datosClient.empleador.instPublica ? "S" : "N";
    }

    function getCountries (){
      actterFactory.ubigeo.getCountries().then(function(response){
        $scope.countries = actterFactory.ubigeo.mapUbigeo(response.Data)
      }).catch(function(error){
        console.error(error)
      })
    }

    function scrollSectionContact (){
      $('body,html').animate({
        scrollTop: $('#sectionContact').offset().top
      }, 0);
    }
  
    // Actualizar Cliente
    $scope.update = function(){
      if(!validateDate()){
        $('body,html').animate({
          scrollTop: $('#personalInformation').offset().top
        }, 0);
        return;
      }
      if(!$scope.frmClient.$valid){
        $scope.frmClient.markAsPristine();
        $scope.frmClient.correspondenceAddressForm.markAsPristine();
        $scope.frmClient.officeAddressForm.markAsPristine();
        $scope.frmClient.personalAddressForm.markAsPristine();
        $scope.frmClient.personalInformationForm.markAsPristine();
        if($scope.isRuc) { 
          $scope.frmClient.companyContactForm.markAsPristine();
        }
        return;
      }
      mModalConfirm.confirmInfo(
        null,
        '¿Estás seguro que quieres actualizar los datos?',
        'GUARDAR').then(function(response){
          if (response){
            setData();
            proxyCliente.modificarDatosPersonales($scope.datosClient,true).then(function(response){
              if (response.OperationCode === constants.operationCode.success) {
                loadData($scope.datosClient)
                mModalAlert
                  .showSuccess('Se actualizaron correctamente los datos', 'CLIENTE ACTUALIZADO');
              }else{
                mModalAlert
                  .showError('Ocurrió un error al actualizar los datos', 'ERROR');
              }
            }).catch(function(error){
              mModalAlert
                .showError('Ocurrió un error al actualizar los datos', 'ERROR');
            })
          }
        }).catch(function(error){});
    }

    // Validar fecha defuncion
    function validateDate(){
      if($scope.datosClient.fechaDefuncion){
        var now = new Date().getTime();
        if($scope.datosClient.fechaDefuncion.getTime()>now){
          $scope.frmClient.personalInformationForm.dateDeath.$invalid= true;
          return false;
        }
      }
      return true;
    }

    // Actualizar Contacto
    $scope.updateContact = function(event,i){
      var contact = event;
      proxyCliente.modificarContacto(contact,true).then(function(response){
        if (response.OperationCode === constants.operationCode.success) {
          mModalAlert
            .showSuccess('Se actualizaron correctamente los datos', 'CONTACTO ACTUALIZADO').then(function(res){
              if(res){
                getContacts();
                $scope.closeOthers(null)
                scrollSectionContact();
              }
            });
        }else if(response.OperationCode === constants.operationCode.code900){
          mModalAlert
            .showError(response.Data.mensaje, 'ERROR');
        }else{
          mModalAlert
            .showError('Ocurrió un error al actualizar los datos', 'ERROR');
        }
      }).catch(function(error){
        console.log(error)
      })
    }

    // Crear Contacto
    $scope.addContact = function(event){
      var contact = event;
      contact.cliente= {
        documento: $stateParams.client
      }
      contact.empresa = dataClient.empresa;
      proxyCliente.agregarContacto(contact,true).then(function(response){
        if (response.OperationCode === constants.operationCode.success) {
          mModalAlert
            .showSuccess('Se creo satisfactoriamente el contacto', 'CONTACTO REGISTRADO').then(function(res){
              if(res){
                var data = response.Data;
                data.isOpen = false;
                $scope.datosClient.contacto.push(data);
                $scope.closeOthers(null);
                scrollSectionContact();
              }
            });
        }else if(response.OperationCode === constants.operationCode.code900){
          mModalAlert
            .showError(response.Data.mensaje, 'ERROR');
        }else{
          mModalAlert
            .showError('Ocurrió un error al crear el contacto', 'ERROR');
        }
      }).catch(function(error){
        console.error(error)
      })
      
    }
    
    $scope.closeForm = function(){
      scrollSectionContact();
    }

    $scope.onShowAddContactForm = function() {
      $scope.addContactForm.isOpen = true;
    };

    $scope.onHiddenAddContactForm = function() {
      $scope.addContactForm.isOpen = false;
    };

    $scope.open = function (item) {
      item.isOpen = !item.isOpen;
      $scope.closeOthers(item);
    }

    $scope.closeOthers = function (item) {
      $scope.datosClient.contacto.filter( function(a) {return a!==item} ).forEach( function(a){
        return a.isOpen =false;
      });
      $scope.addContactForm.isOpen = false;
    }
    
    function getContacts(){
      proxyCliente.obtenerContactos({documento:dataClient.documento},true).then( function(response){
        if (response.OperationCode === constants.operationCode.success) {
          $scope.datosClient.contacto = response.Data;
        }else if(response.OperationCode === constants.operationCode.code900){
          mModalAlert
            .showError(response.Data.mensaje, 'ERROR');
        }
      },function(error) {
        console.error(error)
      })
    }
  }

  return angular
    .module(generalConstant.APP_MODULE)
    .controller('ClientEditController', ClientEditController);
});
