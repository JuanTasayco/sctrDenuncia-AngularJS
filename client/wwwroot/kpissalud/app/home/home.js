define(['angular', 'constants'], function(ng, constants) {

  HomeController.$inject = ['$scope', 'oimClaims', '$state','proxySecurity','mpSpin','mModalAlert'];

  function HomeController($scope, oimClaims, state,proxySecurity,mpSpin,mModalAlert) {
    (
      function onLoad() {
        $scope.showCartasGarantia = false;
        $scope.showSiniestros = false;
        $scope.showConfiguracion = false;

        mpSpin.start('Cargando los accesos');
        proxySecurity.GetOpcion().then(function (response) {
            var listaOpcion = response;
            listaOpcion.forEach(function(element) {              
              switch(element.nomCorto){
                case "SINIESTROS": $scope.showSiniestros = true;break;
                case "CARTAS DE GARANTIA":  $scope.showCartasGarantia = true;break;
                case "CONFIGURACION": $scope.showConfiguracion = true;break;
              }
            });
          mpSpin.end();
        }, function(result){
          mpSpin.end();

          if(!$scope.showCartasGarantia && !$scope.showConfiguracion && !$scope.showSiniestros  ){
            mModalAlert.showError("Error al acceder a KPI MULTIPRODUCTO", "Error").then(function (response) {
              window.location.href = '/';
            }, function (error) {
              window.location.href = '/';
            });
          }
        });
      }
    )();
  }

  return ng.module('kpissalud.app')
    .controller('HomeController', HomeController);
});