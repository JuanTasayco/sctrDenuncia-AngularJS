(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', '/polizas/app/soat/emit/service/soatFactory.js'],
  function(angular, constants){
    var appSoat = angular.module('appSoat');

    appSoat.controller('soatNewRestrictionController', ['$state', 'mModalAlert', 'soatFactory',
      function($state, mModalAlert, soatFactory){
        var vm = this;

        vm.restriccion = {};

        vm.nuevaRestriccion = NuevaRestriccion;

        (function onLoad(){
        })();

        function NuevaRestriccion(parametros) {
          _setRequestNuevaRestriccion(parametros);
          _nuevaRestriccion();
        }
    
        function _nuevaRestriccion() {
          soatFactory.registrarRestriccion(vm.parametros, true).then(function(response) {
            if(response.status !== 200) {
              mModalAlert.showError(response.message, 'Restricciones');
              return;
            }

          mModalAlert.showSuccess('Se ha registrado la restricción', 'Exitoso').then(function(x){
            $state.go("soatRestricciones");
          });
          });
        }
    
        function _setRequestNuevaRestriccion(parametros) {
          vm.parametros = {
            agentId: soatFactory.getValueString(parametros, 'agentId'),
            userId: soatFactory.getValueString(parametros, 'userId'),
            vehicleTypeId: soatFactory.getValueString(parametros, 'vehicleTypeId'),
            historicalAmount: soatFactory.getValueString(parametros, 'historicalAmount'),
            totalEmissions: soatFactory.getValueString(parametros, 'totalEmissions'),
            dailyEmissions: soatFactory.getValueString(parametros, 'dailyEmissions'),
            creditDays: soatFactory.getValueString(parametros, 'creditDays'),
            creationUser: JSON.parse(localStorage.getItem('profile')).username,
            modificationUser: JSON.parse(localStorage.getItem('profile')).username
          };
        }
    }]);
  }
);
