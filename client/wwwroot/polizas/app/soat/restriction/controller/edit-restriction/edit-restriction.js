(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', '/polizas/app/soat/emit/service/soatFactory.js', '/polizas/app/soat/restriction/service/restrictionService.js'],
  function(angular, constants){
    var appSoat = angular.module('appSoat');

    appSoat.controller('soatEditRestrictionController', ['$state', 'mModalAlert', 'soatFactory', 'restrictionService',
      function($state, mModalAlert, soatFactory, restrictionService){
        var vm = this;

        vm.restriccion = {};

        vm.editarRestriccion = EditarRestriccion;

        (function onLoad(){
          var restriccionTmp = restrictionService.getRestriction();
          vm.restriccion = {
            agent: { CodigoAgente: restriccionTmp.agentId, CodigoNombre: restriccionTmp.agentId + ' >>> ' + restriccionTmp.agentName },
            creditDays: restriccionTmp.creditDays,
            dailyEmissions: restriccionTmp.dailyEmissions,
            historicalAmount: restriccionTmp.historicalAmount,
            restrictionId: restriccionTmp.restrictionId,
            state: { Codigo: restriccionTmp.state, Descripcion: getStateDescription(restriccionTmp.state) },
            totalEmissions: restriccionTmp.totalEmissions,
            user: { userId: restriccionTmp.userId, userName: restriccionTmp.userName },
            vehicleType: { Codigo: restriccionTmp.vehicleTypeId, Descripcion: restriccionTmp.vehicleTypeName }
          };
        })();

        function getStateDescription(state) {
          if(state === 'N') return 'ACTIVO';
          return state === 'S' ? 'INACTIVO' : '';
        }

        function EditarRestriccion(parametros) {
          _setRequestEditarRestriccion(parametros);
          _editarRestriccion();
        }
    
        function _editarRestriccion() {
          soatFactory.editarRestriccion(vm.parametros, true).then(function(response) {
            if(response.status !== 200) {
              mModalAlert.showError(response.message, 'Restricciones');
              return;
            }

          mModalAlert.showSuccess('Se ha editado la restricción', 'Exitoso').then(function(x){
            $state.go("soatRestricciones");
          });
          });
        }
    
        function _setRequestEditarRestriccion(parametros) {
          vm.parametros = {
            restrictionId: vm.restriccion.restrictionId,
            agentId: soatFactory.getValueString(parametros, 'agentId'),
            userId: soatFactory.getValueString(parametros, 'userId'),
            vehicleTypeId: soatFactory.getValueString(parametros, 'vehicleTypeId'),
            historicalAmount: soatFactory.getValueString(parametros, 'historicalAmount'),
            totalEmissions: soatFactory.getValueString(parametros, 'totalEmissions'),
            dailyEmissions: soatFactory.getValueString(parametros, 'dailyEmissions'),
            creditDays: soatFactory.getValueString(parametros, 'creditDays'),
            state: soatFactory.getValueString(parametros, 'state'),
            modificationUser: JSON.parse(localStorage.getItem('profile')).username
          };
        }
    }]);
  }
);
