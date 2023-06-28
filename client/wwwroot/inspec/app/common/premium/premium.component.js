'use strict';

define(['angular', 'constants', 'moment'], function(ng, constants, moment) {
  premiumController.$inject = ['inspecFactory'];

  function premiumController(inspecFactory) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      vm.mMapfreDolar = 0;
    }

    function _calculatePremium() {
      if (!vm.formData.mTipoUso) {
        return false;
      }

      var params = {
        AutoConInspeccion: 'S', // S => EmisionAutoUsado
        numeroCotizacion: '', // Campo no requerido
        CodigoCorredor: vm.agentRequest.id, // 9808, //CodigoAgente
        TotalDsctoComision: 0, // Campo no requerido
        DsctoComision: 0, // Campo no requerido
        Vehiculo: {
          CodigoMarca: vm.formData.ModeloMarca.codigoMarca,
          CodigoModelo: vm.formData.ModeloMarca.codigoModelo,
          CodigoSubModelo: vm.formData.mSubModelo.Codigo,
          CodigoUso: vm.formData.mTipoUso.Codigo,
          CodigoProducto: +vm.formData.mProducto.Codigo, // NUEVO CAMPO
          DsctoComercial: 0, // Campo no requerido
          AnioFabricacion: +vm.formData.mYearFabric.Descripcion,
          SumaAsegurada: vm.formData.vehicleValue,
          TipoVolante: constants.module.polizas.autos.tipoVolante,
          MCAGPS: constants.module.polizas.autos.MCAGPS,
          MCANUEVO: 'N', // N => USADO
          PolizaGrupo: '',
          ProductoVehiculo: {
            CodigoModalidad: vm.formData.mProducto.CodigoModalidad,
            CodigoCompania: constants.module.polizas.autos.companyCode,
            CodigoRamo: constants.module.polizas.autos.codeRamo
          }
        },
        Contratante: {
          MCAMapfreDolar: vm.formData.saldoMapfreDolares > 0 ? 'S' : 'N', // ($scope.firstStep.dataContractor.SaldoMapfreDolar > 0) ? 'S' : 'N',
          ImporteMapfreDolar: vm.formData.contractorData.saldoMapfreDolares // $scope.firstStep.dataContractor.SaldoMapfreDolar
        },
        Ubigeo: {
          CodigoProvincia: vm.formData.contractorData.mProvincia.Codigo, // '128',//$scope.firstStep.dataInspection.Cod_prov,
          CodigoDistrito: vm.formData.contractorData.mDistrito.Codigo // '22',//$scope.firstStep.dataInspection.Cod_dep
        }
      };

      vm.dataCalculatePremium = {
        commercialPremium: 0.0,
        netPremium: 0.0,
        discountCommission: 0.0,
        emissionValue: 0.0,
        igv: 0.0,
        mapfreDollar: 0.0,
        total: 0.0
      };

      inspecFactory.common.getCalculatePremium(params, true).then(function(response) {
        if (response.OperationCode === constants.operationCode.success) {
          vm.dataCalculatePremium.netPremium = response.Data.Vehiculo.PrimaVehicular;
          vm.dataCalculatePremium.netPremiumReal = response.Data.Vehiculo.PrimaVehicularReal; // nuevo valor que se debe enviar en el grabar
          vm.dataCalculatePremium.emissionValuePercent = response.Data.PorDerechoEmision / 100;
          calculateDiscount();
          updatePremium();
        } else {
          mModalAlert.showWarning(response.Message, 'Error BD');
          vm.formData.$valid = false;
        }
      });
    }
  }

  return ng
    .module('appInspec')
    .controller('PremiumController', premiumController)
    .component('inspecPremium', {
      templateUrl: '/inspec/app/common/premium/premium.html',
      controller: 'PremiumController',
      controllerAs: '$ctrl',
      bindings: {
        agentDiscount: '=',
        mapfreDollars: '=',
        formData: '='
      }
    });
});
