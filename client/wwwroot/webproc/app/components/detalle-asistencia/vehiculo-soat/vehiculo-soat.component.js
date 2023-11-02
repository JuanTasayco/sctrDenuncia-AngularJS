'use strict';

define(['angular', 'lodash', 'AsistenciaActions', 'wpConstant'], function (ng, _, AsistenciaActions, wpConstant) {
  VehiculoSoatController.$inject = ['wpFactory', '$log', '$scope', 'mModalAlert','$timeout','$rootScope',];
  function VehiculoSoatController(wpFactory, $log, $scope, mModalAlert,$timeout,$rootScope) {
    var vm = this
    var onFrmSave;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.getPlaca = getPlaca;
    vm.setVehiculo = setVehiculo;
    vm.frmVehiculo = {};
    vm.soatTypeSource = [];
    vm.showForm = true;

    function onDestroy() {
      onFrmSave();
    }

    function onInit() {
      onFrmSave = $rootScope.$on('frm:save', setFrm)
      vm.isRequired = vm.isUa ? true : false;
      vm.frmVehiculo = ng.copy(vm.vehiculo)  || { itemTerceroVehiculo: 1 };
    }


    function setFrm() {
      if ($scope.frmVehiculoSoat.$invalid && vm.isRequired) {
        $scope.frmVehiculoSoat.markAsPristine()
        return void 0;
      }

      vm.vehiculo = vm.frmVehiculo.placaVehiculo ?  vm.frmVehiculo : undefined
    }

    function setVehiculo(data) {
      vm.frmVehiculo.placaVehiculo = data ? data.num_placa : vm.frmVehiculo.placaVehiculo;
      vm.frmVehiculo.codigoSoatVehiculo = null;
      vm.frmVehiculo.codigoTipoVehiculo = data ? data.cod_tip_vehi : null;
      vm.frmVehiculo.codigoUsoVehiculo = data ? data.cod_uso : null;
      vm.frmVehiculo.marcaVehiculo = data ? data.des_marca : null;
      vm.frmVehiculo.modeloVehiculo = data ? data.des_modelo : null;
      vm.frmVehiculo.motorVehiculo = data ? data.num_motor : null;
      vm.frmVehiculo.anioVehiculo = data ? data.anho_fabricacion : null;
      vm.frmVehiculo.serieVehiculo = data ? data.serie : null;
      vm.frmVehiculo.num_chasis = data ? data.num_chasis : null;

      // (Hack) : para setear valores a selects del componente cbo
      $scope.frmVehiculoSoat.codigoSoatVehiculo = null;
      $scope.frmVehiculoSoat.codigoTipoVehiculo = data ? data.cod_tip_vehi : null;
      $scope.frmVehiculoSoat.codigoUsoVehiculo = data ? data.cod_uso : null;
      refreshCbo();
    }

    function getPlaca() {
      if (vm.frmVehiculo.placaVehiculo) {
        var frmGeneralAux = $scope.$parent.$parent.$parent.$ctrl.frmGeneral;
        if(frmGeneralAux.frmLugarOcurrencia.frmVehiculoSoat.nPlaca.$viewValue == vm.frmVehiculo.placaVehiculo && !vm.isUa){
          mModalAlert.showWarning('Este dato debe ser distinto al de la placa Vehículo Asegurado', 'Datos no válidos');
          return void 0;
        }else if (frmGeneralAux.frmTerceroConvenio.frmVehiculoSoat.nPlaca.$viewValue == vm.frmVehiculo.placaVehiculo && vm.isUa) {
          mModalAlert.showWarning('Este dato debe ser distinto al de la placa Vehículo Tercero', 'Datos no válidos');
          return void 0;
        }
        
        vm.isRequired = true;
        wpFactory.siniestro.GetSiniestroPlaca(vm.frmVehiculo.placaVehiculo).then(function (response) {
          response.vehiculo.respuesta == 1
            ? setVehiculo(response.vehiculo)
            : setVehiculo(null);
        }).catch(function aEPr(err) {
          $log.error('Falló al obtener equifax', err.data);
          setVehiculo(null);
        })
        
      }
      else{
        vm.isRequired = false
      }
    }

    function refreshCbo() {
      $timeout(function () {
        vm.showForm = false;
        $timeout(function () {
          vm.showForm = true;
        })
      })
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('VehiculoSoatController', VehiculoSoatController)
    .component('wpVehiculoSoat', {
      templateUrl: '/webproc/app/components/detalle-asistencia/vehiculo-soat/vehiculo-soat.html',
      controller: 'VehiculoSoatController',
      bindings: {
        isUa: '=?',
        vehiculo: '=?',
        validateForm: '=?',
        isRequired: '=?',
        modoLectura: '=?'
      }
    });
});
