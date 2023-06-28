'use strict';

define([
	'angular', 'constants', 'scripts/mpf-main-controls/components/blocks/mpf-blk-poliza-grupo/service/polizaGrupoFactory.js'
], function(angular, constants, factory){

	var appComponents = angular.module('mapfre.components');
	
	appComponents.controller('ctrlPolizaGrupo', ['$scope', 'polizaGrupoFactory','$window', '$state', function($scope, polizaGrupoFactory, $window, $state){
		
		var _self = this;

		_self.showPolizaGrupoNombre = function(codPolizaGrupo){
      getPolizaGrupoNombre(codPolizaGrupo);
    };

    function getPolizaGrupoNombre(codPolizaGrupo){//setear campos arraySaveCotizacion
      //$scope.formData.codPolizaGrupo = '';
      // if (codPolizaGrupo.length){
      if (codPolizaGrupo != undefined){
        //$scope.formData.codPolizaGrupo = codPolizaGrupo;
        //var vParams = $scope.formData.codPolizaGrupo;
        polizaGrupoFactory.getPolizaGrupo(codPolizaGrupo)
          .then(function(data){
            if (Object.keys(data).length){                              
              _self.bDatosPolizaGrupo = 1;
              //console.log('data.PolizaGrupoNombre ' + data.PolizaGrupoNombre);
              //_self.mPolizaGrupo.result = data.PolizaGrupoNombre;
              $scope.formData.mPolizaGrupoResult = data.PolizaGrupoNombre;
              $scope.formData.codPolizaGrupo=codPolizaGrupo;
            }else{
                _self.bDatosPolizaGrupo = 2;
            }
          }, function(error){
            _self.bDatosPolizaGrupo = 2;
            console.log('Error ' + error);
        });
      }
    }		

	}])

	  .component('mpfBlkPolizaGrupoAutomovil',{
    templateUrl: '/scripts/mpf-main-controls/components/blocks/mpf-blk-poliza-grupo/component/mpf-blk-poliza-grupo.html',
    controller: 'ctrlPolizaGrupo',
    bindings:{
      info: '=',
      function: '&'
    }   
  })


});
