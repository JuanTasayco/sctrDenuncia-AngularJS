'use strict';

define([
  'angular', 'constants',
  '/scripts/mpf-main-controls/components/contractorVehicleDetails/service/contractorVehicleDetailsFactory.js'
], function(angular, constants, factory){

  // var appComponents = angular.module('mapfre.components');
  var appControls = angular.module('mapfre.controls');

  appControls.controller('ctrlContractorVehicleDetails', ['$scope', 'contractorVehicleDetailsFactory', function($scope, contractorVehicleDetailsFactory) {

    var _self = this;

    _self.isValid = _self.isValid ? _self.isValid : {};

    _self.isValid.func = function(){
			$scope.frmVehicleDetails.markAsPristine();
			return $scope.frmVehicleDetails.$valid;
		}

    // contractorVehicleDetailsFactory.proxyAutomovilEmblem.GetListTipoUsoVehiculo(true).then(
    //   function(response){
    //     //debugger;
    //     _self.typeVehicle = response.Data;
    //   }, function(err) {
    //     // console.log(err);
    //   }, function(defaultErr) {
    //     // console.log(defaultErr);
    //   }
    // );

    contractorVehicleDetailsFactory.proxyAutomovilEmblem.GetListTipoFrecuenciaUsoVehiculo(true).then(
      function(response){
        //debugger;
        _self.useVehicle = response.Data;
      }, function(err) {
        // console.log(err);
      }, function(defaultErr) {
        // console.log(defaultErr);
      }
    );

    contractorVehicleDetailsFactory.proxyAutomovilEmblem.GetListAccidentesUltimosDosAnios(true).then(
      function(response){
        //debugger;
        _self.accidentesVehicle = response.Data;
      }, function(err) {
        // console.log(err);
      }, function(defaultErr) {
        // console.log(defaultErr);
      }
    );

    contractorVehicleDetailsFactory.proxyAutomovilEmblem.GetListAntiguedadLicenciaConducir(true).then(
      function(response){
        //debugger;
        _self.antiguedadLicencia = response.Data;
      }, function(err) {
        // console.log(err);
      }, function(defaultErr) {
        // console.log(defaultErr);
      }
    );



  }]).component('mpfContractorVehicleDetails',{
    templateUrl: '/scripts/mpf-main-controls/components/contractorVehicleDetails/component/contractorVehicleDetails.html',
    controller: 'ctrlContractorVehicleDetails',
    bindings: {
      data: '=',
      isValid: '='
    }
  })


});
