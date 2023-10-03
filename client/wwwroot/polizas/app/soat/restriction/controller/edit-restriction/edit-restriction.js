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
            state: { Codigo: restriccionTmp.state, Descripcion: restriccionTmp.state === 'N' ? 'ACTIVO' : (restriccionTmp.state === 'S' ? 'INACTIVO' : '') },
            totalEmissions: restriccionTmp.totalEmissions,
            user: { userId: restriccionTmp.userId, userName: restriccionTmp.userName },
            vehicleType: { Codigo: restriccionTmp.vehicleTypeId, Descripcion: restriccionTmp.vehicleTypeName }
          };
        })();

        function EditarRestriccion(parametros) {
          _setRequestEditarRestriccion(parametros);
          _editarRestriccion();
        }
    
        function _editarRestriccion() {
          soatFactory.editarRestriccion(vm.parametros, true).then(function(response) {
            if(response.status === 200) {
          mModalAlert.showSuccess('Se ha editado la restricción', 'Exitoso').then(function(x){
            $state.go("soatRestricciones");
          });
            } else {
              mModalAlert.showError('Hubo un error al editar la restricción', 'Restricciones');
            }
          });
        }
    
        function _setRequestEditarRestriccion(parametros) {
          vm.parametros = {
            restrictionId: vm.restriccion.restrictionId,
            agentId: (parametros && parametros.agentId) || 0,
            userId: (parametros && parametros.userId) || 0,
            vehicleTypeId: (parametros && parametros.vehicleTypeId) || 0,
            historicalAmount: (parametros && parametros.historicalAmount) || 0,
            totalEmissions: (parametros && parametros.totalEmissions) || 0,
            dailyEmissions: (parametros && parametros.dailyEmissions) || 0,
            creditDays: (parametros && parametros.creditDays) || 0,
            state: (parametros && parametros.state) || 0,
            modificationUser: JSON.parse(localStorage.getItem('profile')).username
          };
        }
    }]);
  }
);
