'use strict';
define(['angular','lodash', 'system', 'generalConstant','actterFactory','constants','proxyActter'], function(angular,_, system, generalConstant,actterFactory,constants,proxyActter) {
  PolizasEditController.$inject = ['$scope','actterFactory','$state','$q','$stateParams','mModalConfirm','proxyCliente','proxyGeneral','dataPoliza','dataForm','mModalAlert'];
  function PolizasEditController($scope,actterFactory,$state,$q,$stateParams,mModalConfirm,proxyCliente,proxyGeneral,dataPoliza,dataForm,mModalAlert) {
    var vm = this;

    //ubigeo
    $scope.countries= {}
    $scope.departaments = {}
    $scope.provinces = {}
    $scope.district = {}
    $scope.paramsForm = dataForm;
    $scope.datosPoliza = null;
    $scope.showComponents = true;
    $scope.hideFields = generalConstant.HIDE_FIELDS_POLIZA;
    $scope.notRequiredFields = generalConstant.NOT_REQUIRED_POLIZA;
    $scope.disabledFields = generalConstant.DISABLED_FIELDS_POLIZA;

    vm.$onInit = function() {
      loadData(dataPoliza)
      getCountries();
    };

    function loadData(data){
      $scope.datosPoliza = _.assign({}, data);
      if($scope.datosPoliza.fechaNacimiento){
        $scope.datosPoliza.fechaNacimiento = new Date( $scope.datosPoliza.fechaNacimiento);
      }
      if($scope.datosPoliza.fechaAniversario){
        $scope.datosPoliza.fechaAniversario = new Date( $scope.datosPoliza.fechaAniversario);
      }
      if($scope.datosPoliza.fechaDefuncion){
        $scope.datosPoliza.fechaDefuncion = new Date( $scope.datosPoliza.fechaDefuncion);
      }
      if($scope.datosPoliza.tipoPersona.codigo=='N') $scope.isRuc = true;
      $scope.datosPoliza.numeroHijos =  $scope.datosPoliza.numeroHijos.toString();
      $scope.datosPoliza.empleador.tiempoServicio =  $scope.datosPoliza.empleador.tiempoServicio.toString();
    }

    $scope.update = function(){
      if(!$scope.frmClient.$valid){
        $scope.frmClient.markAsPristine();
        $scope.frmClient.correspondenceAddressForm.markAsPristine();
        $scope.frmClient.personalAddressForm.markAsPristine();
        $scope.frmClient.personalInformationForm.markAsPristine();
        if($scope.isRuc) { 
          $scope.frmClient.companyContactForm.markAsPristine();
        }
        return;
      }
      $scope.datosPoliza.documento = dataPoliza.documento;
      mModalConfirm.confirmInfo(
        null,
        '¿Estás seguro que quieres actualizar la poliza?',
        'GUARDAR').then(function(response){
          if (response){
            proxyCliente.modificarDatosPoliza($scope.datosPoliza,true).then(function(response){
              if (response.OperationCode === constants.operationCode.success) {
                mModalAlert
                  .showSuccess('Se actualizaron correctamente los datos', 'POLIZA ACTUALIZADA');
              }else if(response.OperationCode === constants.operationCode.code900){
                mModalAlert
                  .showError(response.Data.mensaje, 'ERROR');
              }else{
                mModalAlert
                  .showError('Ocurrió un error al actualizar los datos', 'ERROR');
              }
            }).catch(function(error){
              mModalAlert
                  .showError('Ocurrió un error al actualizar los datos', 'ERROR');
            })
          }
        }).catch(function(error){});;
      
    }

    function getCountries (){
      actterFactory.ubigeo.getCountries().then(function(response){
        $scope.countries = actterFactory.ubigeo.mapUbigeo(response.Data)
      }).catch(function(error){
        console.log(error)
      })
    }

    $scope.fnGoToClient = function() {
      $state.go('clients', {
        search: _.assign({}, $stateParams.search)
      });
    };
  }

  return angular
    .module(generalConstant.APP_MODULE)
    .controller('PolizasEditController', PolizasEditController);
});
