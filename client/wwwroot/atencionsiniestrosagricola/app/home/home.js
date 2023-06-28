define(['angular', 'constants'], function (ng, constants) {

  HomeController.$inject = ['$scope', 'oimClaims', 'proxyAgricolaSecurity', 'mModalAlert', 'mpSpin','agricolaUtilities', '$window'];

  function HomeController($scope, oimClaims, proxyAgricolaSecurity, mModalAlert, mpSpin,agricolaUtilities, $window) {
    (
      function onLoad() {
        mpSpin.start('Cargando los accesos');
        proxyAgricolaSecurity.GetRole().then(function (response) {       
          if (response) {               
            if(!response.lstOpcion) {
              mpSpin.end();
              mModalAlert.showError("Error al acceder a ATENCION SINIESTROS AGRICOLA", "Error").then(function () {
                window.location.href = '/';
              }, function () {
                window.location.href = '/';
              });
              return;
            }            
          response.lstOpcion.forEach(function(element) {
            if(element.nomCorto == "AVISO"){ $scope.showRegistro = true;  }
             if(element.nomCorto == "BANDEJA"){ $scope.showBandeja = true;  }
             if(element.nomCorto == "MANTENIMIENTO"){ $scope.showCampanias = true;  }
             if(element.nomCorto == "REPORTE"){ $scope.showReportes = true;  }
             if(element.nomCorto == "FORMATOS"){ $scope.showSiscas = true;  }
                });
            mpSpin.end();
          } else {
            mpSpin.end();
            mModalAlert.showError("Error al acceder a ATENCION SINIESTROS AGRICOLA", "Error").then(function () {
              window.location.href = '/';
            }, function () {
              window.location.href = '/';
            });
          }
        }, function () {
          mpSpin.end();
          mModalAlert.showError("Error al acceder a ATENCION SINIESTROS AGRICOLA", "Error").then(function () {
            window.location.href = '/';
          }, function (error) {
            window.location.href = '/';
          });
        });
      }
    )();
  }

  return ng.module('atencionsiniestrosagricola.app')
    .controller('HomeController', HomeController);
});