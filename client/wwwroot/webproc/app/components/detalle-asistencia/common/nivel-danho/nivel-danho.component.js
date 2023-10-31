'use strict';

define(['angular'], function(ng) {
  NivelDanhoController.$inject = ['$rootScope', 'wpFactory','$scope'];
  function NivelDanhoController($rootScope, wpFactory, $scope) {
    var vm = this;
    var onFrmSave;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.selectDanio = selectDanio;
    vm.nexQuestion = nexQuestion;
    vm.frm = {};

    // declaracion

    function onDestroy() {
      onFrmSave();
    }

    function onInit() {
      onFrmSave = $rootScope.$on('frm:save', setFrm)

      vm.frm = vm.detalle || {
          codigoNivelDanio: null,
          descripcionDanios: null,
          nivelDanio: null,
          pregunta1: null,
          pregunta2: null,
      };
      vm.isRequired = vm.isUa ? true : false;
    }

    function setFrm() {

      if($scope.frmNivelDanho.$invalid){
        $scope.frmNivelDanho.markAsPristine();
        return void 0;
      }        
      vm.detalle = vm.frm.pregunta1 ? vm.frm : undefined;  
    }


    function selectDanio(code) {
        var nivelDanho = wpFactory.myLookup.getNivelDanho();
        var seleccionado = _.find(nivelDanho, function (item) {
          return item.codigoParametro === code;
        });
        vm.frm.codigoNivelDanio = seleccionado.codigoParametro;
        vm.frm.nivelDanio = seleccionado.descripcionParametro;;
    }

    function nexQuestion() {
        if(vm.frm.pregunta2){
            selectDanio(vm.frm.pregunta2 == 'S' ? 2:1) 
        }
        this.isRequired = true;
    }


} // end controller

  return ng
    .module('appWp')
    .controller('NivelDanhoController', NivelDanhoController)
    .component('wpNivelDanho', {
      templateUrl: '/webproc/app/components/detalle-asistencia/common/nivel-danho/nivel-danho.html',
      controller: 'NivelDanhoController',
      bindings: {
        isUa: '=?',
        detalle: '=?',
        validateForm: '=?',
        modoLectura: '=?'
      }
    });
});
