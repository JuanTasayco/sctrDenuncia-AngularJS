'use strict';

define(['angular', 'constants', 'constantsPericial', 'helper'], function(
  angular,
  constants, constantsPericial, helper) {

  ComentarioController.$inject = [
    '$scope', '$uibModal', 'mModalAlert', 'mModalConfirm'
  ];

  function ComentarioController(
    $scope, $uibModal,mModalAlert, mModalConfirm
  ) {

    var vm = this;
    vm.$onInit = function() {
      var today = Date.now();
      var minutes = 1000 * 60;
      var hours = minutes * 60;
      var days = hours * 24;
      vm.showHT = '';
      vm.dataComentario = JSON.parse(vm.info);
      var hmDays = Math.trunc( (today - Date.parse(vm.dataComentario.dateRegistry)) / days );
      var hmHours = Math.trunc( (today - Date.parse(vm.dataComentario.dateRegistry)) / hours );
      var hmMinutes = Math.trunc( (today - Date.parse(vm.dataComentario.dateRegistry)) / minutes );

      if ( !hmDays ) {
        vm.showHT = hmHours ? ( (hmHours < 2) ? hmHours + ' hora' : hmHours + ' horas' ) : ( vm.showHT = hmMinutes + ' minutos' );
      }
    };

  } // end

  return angular.module('appPericial')
    .controller('ComentarioController', ComentarioController)
			.component('comentario', {
				templateUrl: '/pericial/app/servicios/common/comentario/comentario.html',
				controller: 'ComentarioController',
				controllerAs: '$ctrl',
				bindings: {
					info: '@'
				}
			})
	});
