define(['angular', 'constants'], function (ng, constants) {

  KpiConfiguracionController.$inject = ['$scope', 'mpSpin', 'proxyKpiConfiguracionApi'];

  function KpiConfiguracionController($scope, mpSpin, proxyKpiConfiguracionApi) {
    (
      function onLoad() {
        $scope.config = {
          rangeSearchDate: null,
          tiempoPromedioAtencion: {
            umbral: {
              credito: null,
              reembolso: null,
              creditosoat: null,
              reembolsosoat: null
            }
          },
          costoPromedioAtencionPaciente: {
            umbralAtencion: {
              umbralMax: null,
              umbralMin: null
            },
            umbralPaciente: {
              umbralMax: null,
              umbralMin: null
            }
          },
          costoPacienteMes: {
            umbral: {
              umbral: null
            }
          }
        };

        $scope.configCopy = {
          rangeSearchDate: null,
          tiempoPromedioAtencion: {
            umbral: {
              credito: null,
              reembolso: null,
              creditosoat: null,
              reembolsosoat: null
            }
          },
          costoPromedioAtencionPaciente: {
            umbralAtencion: {
              umbralMax: null,
              umbralMin: null
            },
            umbralPaciente: {
              umbralMax: null,
              umbralMin: null
            }
          },
          costoPacienteMes: {
            umbral: {
              umbral: null
            }
          }
        };

        loadInitialData();

        function loadInitialData() {
          mpSpin.start('Cargando información, por favor espere...');

          proxyKpiConfiguracionApi.PostObtenerConfiguracionDashboard().then(function (response) {
            if (response.operationCode == 200) {
              var data = response.data[0];

              for (var i = 0; i < data.length; i++) {
                var config = data[i];
                switch (config.cdgo) {
                  case '0001':
                    $scope.config.rangeSearchDate = config.vlr;
                    $scope.configCopy.rangeSearchDate = config.vlr;
                    break;
                  case '0002':
                    $scope.config.tiempoPromedioAtencion.umbral.credito = config.vlr;
                    $scope.configCopy.tiempoPromedioAtencion.umbral.credito = config.vlr;
                    break;
                  case '0003':
                    $scope.config.tiempoPromedioAtencion.umbral.reembolso = config.vlr;
                    $scope.configCopy.tiempoPromedioAtencion.umbral.reembolso = config.vlr;
                    break;
                  case '0004':
                    $scope.config.costoPromedioAtencionPaciente.umbralAtencion.umbralMax = config.vlr;
                    $scope.configCopy.costoPromedioAtencionPaciente.umbralAtencion.umbralMax = config.vlr;
                    break;
                  case '0005':
                    $scope.config.costoPromedioAtencionPaciente.umbralAtencion.umbralMin = config.vlr;
                    $scope.configCopy.costoPromedioAtencionPaciente.umbralAtencion.umbralMin = config.vlr;
                    break;
                  case '0006':
                    $scope.config.costoPromedioAtencionPaciente.umbralPaciente.umbralMax = config.vlr;
                    $scope.configCopy.costoPromedioAtencionPaciente.umbralPaciente.umbralMax = config.vlr;
                    break;
                  case '0007':
                    $scope.config.costoPromedioAtencionPaciente.umbralPaciente.umbralMin = config.vlr;
                    $scope.configCopy.costoPromedioAtencionPaciente.umbralPaciente.umbralMin = config.vlr;
                    break;
                  case '0008':
                    $scope.config.costoPacienteMes.umbral.umbral = config.vlr;
                    $scope.configCopy.costoPacienteMes.umbral.umbral = config.vlr;
                    break;
                  case '0009':
                    $scope.config.tiempoPromedioAtencion.umbral.creditosoat = config.vlr;
                    $scope.configCopy.tiempoPromedioAtencion.umbral.creditosoat = config.vlr;
                    break;
                  case '0010':
                    $scope.config.tiempoPromedioAtencion.umbral.reembolsosoat = config.vlr;
                    $scope.configCopy.tiempoPromedioAtencion.umbral.reembolsosoat = config.vlr;
                    break;
                }
              }
            }

            mpSpin.end();
          });
        }

        $scope.refrescar = function () {
          loadInitialData();
        }

        $scope.showConfigButton = function (option) {
          var act = true;
          if (option == 2) {
            var validFo1 = $scope.config.rangeSearchDate == '' || $scope.config.rangeSearchDate == null;
            var validFo2 = $scope.config.tiempoPromedioAtencion.umbral.credito == '' || $scope.config.tiempoPromedioAtencion.umbral.credito == null;
            var validFo3 = $scope.config.tiempoPromedioAtencion.umbral.reembolso == '' || $scope.config.tiempoPromedioAtencion.umbral.reembolso == null;
            var validFo4 = $scope.config.costoPromedioAtencionPaciente.umbralAtencion.umbralMax == '' || $scope.config.costoPromedioAtencionPaciente.umbralAtencion.umbralMax == null;
            var validFo5 = $scope.config.costoPromedioAtencionPaciente.umbralAtencion.umbralMin == '' || $scope.config.costoPromedioAtencionPaciente.umbralAtencion.umbralMin == null;
            var validFo6 = $scope.config.costoPromedioAtencionPaciente.umbralPaciente.umbralMax == '' || $scope.config.costoPromedioAtencionPaciente.umbralPaciente.umbralMax == null;
            var validFo7 = $scope.config.costoPromedioAtencionPaciente.umbralPaciente.umbralMin == '' || $scope.config.costoPromedioAtencionPaciente.umbralPaciente.umbralMin == null;
            var validFo8 = $scope.config.costoPacienteMes.umbral.umbral == '' || $scope.config.costoPacienteMes.umbral.umbral == null;
            var validFo9 = $scope.config.tiempoPromedioAtencion.umbral.creditosoat == '' || $scope.config.tiempoPromedioAtencion.umbral.creditosoat == null;
            var validFo10 = $scope.config.tiempoPromedioAtencion.umbral.reembolsosoat == '' || $scope.config.tiempoPromedioAtencion.umbral.reembolsosoat == null;


            if (validFo1 || validFo2 || validFo3 || validFo4 || validFo5 || validFo6 || validFo7 || validFo8 || validFo9 || validFo10) return true
          }

          if (option == 1 || option == 2) {
            var validF1 = $scope.configCopy.rangeSearchDate == $scope.config.rangeSearchDate;
            var validF2 = $scope.configCopy.tiempoPromedioAtencion.umbral.credito == $scope.config.tiempoPromedioAtencion.umbral.credito && $scope.configCopy.tiempoPromedioAtencion.umbral.reembolso == $scope.config.tiempoPromedioAtencion.umbral.reembolso
            var validF3 = $scope.configCopy.costoPromedioAtencionPaciente.umbralAtencion.umbralMax == $scope.config.costoPromedioAtencionPaciente.umbralAtencion.umbralMax && $scope.configCopy.costoPromedioAtencionPaciente.umbralAtencion.umbralMin == $scope.config.costoPromedioAtencionPaciente.umbralAtencion.umbralMin;
            var validF4 = $scope.configCopy.costoPromedioAtencionPaciente.umbralPaciente.umbralMax == $scope.config.costoPromedioAtencionPaciente.umbralPaciente.umbralMax && $scope.configCopy.costoPromedioAtencionPaciente.umbralPaciente.umbralMin == $scope.config.costoPromedioAtencionPaciente.umbralPaciente.umbralMin;
            var validF5 = $scope.configCopy.costoPacienteMes.umbral.umbral == $scope.config.costoPacienteMes.umbral.umbral;
            var validF6 = $scope.configCopy.tiempoPromedioAtencion.umbral.creditosoat == $scope.config.tiempoPromedioAtencion.umbral.creditosoat && $scope.configCopy.tiempoPromedioAtencion.umbral.reembolsosoat == $scope.config.tiempoPromedioAtencion.umbral.reembolsosoat
            if (!validF1 || !validF2 || !validF3 || !validF4 || !validF5 || !validF6) {
              return false
            }
          }

          return act;
        }

        $scope.applyUpdateConfig = function (option) {
          data = [];
          switch (option) {
            case 1:
              item = {
                ac_cdgo: '0001',
                ac_vlr: $scope.config.rangeSearchDate
              };
              data.push(item);
              break;
            case 2:
              item = {
                ac_cdgo: '0002',
                ac_vlr: $scope.config.tiempoPromedioAtencion.umbral.credito
              };
              data.push(item);
              item = {
                ac_cdgo: '0003',
                ac_vlr: $scope.config.tiempoPromedioAtencion.umbral.reembolso
              };
              data.push(item);
              break;
            case 3:
              item = {
                ac_cdgo: '0004',
                ac_vlr: $scope.config.costoPromedioAtencionPaciente.umbralAtencion.umbralMax
              };
              data.push(item);
              item = {
                ac_cdgo: '0005',
                ac_vlr: $scope.config.costoPromedioAtencionPaciente.umbralAtencion.umbralMin
              };
              data.push(item);
              break;
            case 4:
              item = {
                ac_cdgo: '0006',
                ac_vlr: $scope.config.costoPromedioAtencionPaciente.umbralPaciente.umbralMax
              };
              data.push(item);
              item = {
                ac_cdgo: '0007',
                ac_vlr: $scope.config.costoPromedioAtencionPaciente.umbralPaciente.umbralMin
              };
              data.push(item);
              break;
            case 5:
              item = {
                ac_cdgo: '0008',
                ac_vlr: $scope.config.costoPacienteMes.umbral.umbral
              };
              data.push(item);
              break;
            case 6:
              item = {
                ac_cdgo: '0009',
                ac_vlr: $scope.config.tiempoPromedioAtencion.umbral.creditosoat
              };
              data.push(item);
              item = {
                ac_cdgo: '0010',
                ac_vlr: $scope.config.tiempoPromedioAtencion.umbral.reembolsosoat
              };
              data.push(item);
              break;
            case 99:
              item = {
                ac_cdgo: '0001',
                ac_vlr: $scope.config.rangeSearchDate
              };
              data.push(item);
              item = {
                ac_cdgo: '0002',
                ac_vlr: $scope.config.tiempoPromedioAtencion.umbral.credito
              };
              data.push(item);
              item = {
                ac_cdgo: '0003',
                ac_vlr: $scope.config.tiempoPromedioAtencion.umbral.reembolso
              };
              data.push(item);
              item = {
                ac_cdgo: '0004',
                ac_vlr: $scope.config.costoPromedioAtencionPaciente.umbralAtencion.umbralMax
              };
              data.push(item);
              item = {
                ac_cdgo: '0005',
                ac_vlr: $scope.config.costoPromedioAtencionPaciente.umbralAtencion.umbralMin
              };
              data.push(item);
              item = {
                ac_cdgo: '0006',
                ac_vlr: $scope.config.costoPromedioAtencionPaciente.umbralPaciente.umbralMax
              };
              data.push(item);
              item = {
                ac_cdgo: '0007',
                ac_vlr: $scope.config.costoPromedioAtencionPaciente.umbralPaciente.umbralMin
              };
              data.push(item);
              item = {
                ac_cdgo: '0008',
                ac_vlr: $scope.config.costoPacienteMes.umbral.umbral
              };
              data.push(item);
              item = {
                ac_cdgo: '0009',
                ac_vlr: $scope.config.tiempoPromedioAtencion.umbral.creditosoat
              };
              data.push(item);
              item = {
                ac_cdgo: '0010',
                ac_vlr: $scope.config.tiempoPromedioAtencion.umbral.reembolsosoat
              };
              data.push(item);
              break;
          }

          sendUpdate(option, data);
        }

        function sendUpdate(option, data) {
          mpSpin.start('Actualizando información...');

          proxyKpiConfiguracionApi.PostActualizarConfiguracion(data).then(function (response) {
            if (response.operationCode == 200) {
              if (option == 1 || option == 99) {
                $scope.configCopy.rangeSearchDate = $scope.config.rangeSearchDate;
              }

              if (option == 2 || option == 99) {
                $scope.configCopy.tiempoPromedioAtencion.umbral.credito = $scope.config.tiempoPromedioAtencion.umbral.credito;
                $scope.configCopy.tiempoPromedioAtencion.umbral.reembolso = $scope.config.tiempoPromedioAtencion.umbral.reembolso;
              }

              if (option == 3 || option == 99) {
                $scope.configCopy.costoPromedioAtencionPaciente.umbralAtencion.umbralMax = $scope.config.costoPromedioAtencionPaciente.umbralAtencion.umbralMax;
                $scope.configCopy.costoPromedioAtencionPaciente.umbralAtencion.umbralMin = $scope.config.costoPromedioAtencionPaciente.umbralAtencion.umbralMin;
              }

              if (option == 4 || option == 99) {
                $scope.configCopy.costoPromedioAtencionPaciente.umbralPaciente.umbralMax = $scope.config.costoPromedioAtencionPaciente.umbralPaciente.umbralMax;
                $scope.configCopy.costoPromedioAtencionPaciente.umbralPaciente.umbralMin = $scope.config.costoPromedioAtencionPaciente.umbralPaciente.umbralMin;
              }
              if (option == 5 || option == 99) {
                $scope.configCopy.costoPacienteMes.umbral.umbral = $scope.config.costoPacienteMes.umbral.umbral;
              }

              if (option == 6 || option == 99) {
                $scope.configCopy.tiempoPromedioAtencion.umbral.creditosoat = $scope.config.tiempoPromedioAtencion.umbral.creditosoat;
                $scope.configCopy.tiempoPromedioAtencion.umbral.reembolsosoat = $scope.config.tiempoPromedioAtencion.umbral.reembolsosoat;
              }
            }
            mpSpin.end();
          });
        }
      }
    )();
  }

  return ng.module('kpissalud.app')
    .controller('KpiConfiguracionController', KpiConfiguracionController);
});