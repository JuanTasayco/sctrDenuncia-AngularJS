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
            if(response.status === 200) {
          mModalAlert.showSuccess('Se ha registrado la restricción', 'Exitoso').then(function(x){
            $state.go("soatRestricciones");
          });
            } else {
              mModalAlert.showError('Hubo un error al registrar la restricción', 'Restricciones');
            }
          });
        }
    
        function _setRequestNuevaRestriccion(parametros) {
          vm.parametros = {
            agentId: (parametros && parametros.agentId) || '',
            userId: (parametros && parametros.userId) || '',
            vehicleTypeId: (parametros && parametros.vehicleTypeId) || '',
            historicalAmount: (parametros && parametros.historicalAmount) || '',
            totalEmissions: (parametros && parametros.totalEmissions) || '',
            dailyEmissions: (parametros && parametros.dailyEmissions) || '',
            creditDays: (parametros && parametros.creditDays) || '',
            creationUser: JSON.parse(localStorage.getItem('profile')).username,
            modificationUser: JSON.parse(localStorage.getItem('profile')).username
          };
        }
    }]);
  }
);
