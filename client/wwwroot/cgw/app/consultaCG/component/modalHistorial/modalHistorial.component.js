define([
  'angular', 'constants',
  '/cgw/app/factory/cgwFactory.js'
], function(ng, constants) {

  ModalHistorialController.$inject = ['$scope', '$stateParams', '$state', '$timeout', '$log', 'cgwFactory', 'mModalAlert', 'oimClaims', '$sce', '$q'];

  function ModalHistorialController($scope, $stateParams, $state, $timeout, log, cgwFactory, mModalAlert, oimClaims, $sce, $q) {
    var vm = this;
    var url;

    vm.$onInit = function() {

      if (constants.environment === 'QA') {
        $scope.statusLetter = constants.module.cgw.statusLetter.QA;
      }else  if (constants.environment === 'DEV') {
        $scope.statusLetter = constants.module.cgw.statusLetter.DEV;
      } else {
        $scope.statusLetter = constants.module.cgw.statusLetter.PROD;
      }

      $scope.grupoAplicacion = parseInt(oimClaims.userSubType);

      cgwFactory.getRole($scope.grupoAplicacion).then(function (response) {
        if (response.data) {
          $scope.roleId = response.data.roleId;
          $scope.roleCode = response.data.roleCode;
         }
      });

      $scope.letterNumber =  $stateParams.id;
      $scope.yearLetter =  $stateParams.year;
      $scope.letterVersion =  $stateParams.version;
      $scope.letterCia =  $stateParams.cia;
      $scope.flagClinic = $stateParams.flag;
      $scope.stateEmail = $stateParams.state;

      if($stateParams.start && $stateParams.end) {
        var parts = $stateParams.start.split('/');
        $scope.mConsultaDesde = new Date(parts[2], parts[1] - 1, parts[0]);

        parts = $stateParams.end.split('/');
        $scope.mConsultaHasta = new Date(parts[2], parts[1] - 1, parts[0]);
      }else {
        $scope.mConsultaDesde = cgwFactory.agregarDias(new Date(), -15)//new Date();
        $scope.mConsultaHasta = new Date(new Date().setHours(23,59,59,999));
      }

      var paramsLetter =
      {
        CompanyId: parseInt($scope.letterCia),
        Year: parseInt($scope.yearLetter),
        Number: parseInt($scope.letterNumber),
        Version: parseInt($scope.letterVersion)
      };

      /*########################
      # Vigencia
      ########################*/

      $scope.format = 'dd/MM/yyyy';
      $scope.altInputFormats = ['M!/d!/yyyy'];

      $scope.popup1 = {
        opened: false
      };
      $scope.popup2 = {
        opened: false
      };

      $scope.dateOptions = {
        initDate: new Date(),
        maxDate: new Date(cgwFactory.agregarMes(new Date(), 1))
      };

      $scope.dateOptions2 = {
        initDate: $scope.mConsultaDesde,
        minDate: new Date(),
        maxDate: new Date(cgwFactory.agregarMes(new Date(), 12))//new Date().addMonths(1)
      };

      cgwFactory.getRole($scope.grupoAplicacion).then(function (response) {
        if (response.data) {
          $scope.roleId = response.data.roleId;
          $scope.roleCode = response.data.roleCode;

            cgwFactory.getDetailLetter(paramsLetter).then(function (response) {
              if (response.data) {
                $scope.carta = response.data;
                $scope.mDiagnostico = {
                  code: $scope.carta.diagnosticCode,
                  name: $scope.carta.diagnostic
                }

                 $scope.paramsHistorial = {
                    CodeAffiliate : $scope.carta.affiliateCode,//6000108,
                    StartDate : $scope.mConsultaDesde,
                    EndDate : $scope.mConsultaHasta,
                    CodDiagnostic: $scope.mDiagnostico ? $scope.mDiagnostico.code : ''
                  };

                  getHistorial();

              } else {
                $state.go('consultaCgw', {reload: true, inherit: false});
              }
            }, function(error) {
              if (error.data)
                mModalAlert.showError(error.data.message, "Error").then(function(response) {
                    $state.go('consultaCgw', {reload: true, inherit: false});
                  }, function(error) {
                    $state.go('consultaCgw', {reload: true, inherit: false});
                  });
            });
         }
      });
    };

    $scope.$watch('mConsultaDesde', function()
    {
      $scope.dateOptions2.minDate = $scope.mConsultaDesde;
    });

    $scope.open1 = function() {
      $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
      $scope.popup2.opened = true;
    };

    function getHistorial() {
       cgwFactory.getHistorialAfiliado($scope.paramsHistorial).then(function (response) {
        if (response) {
          $scope.auditoriaExterna = response.externalAudits.items;
          $scope.siniestros = response.sinisters.items;
          $scope.cartasGarantia = response.guaranteeLetters.items;

          $scope.amountTotalCarta = 0;
          $scope.amountTotalSinister = 0;

          if ($scope.cartasGarantia.length>0) {
            angular.forEach($scope.cartasGarantia, function(value,key) {
              if ($scope.cartasGarantia[key].statusLetter !== $scope.statusLetter.anulada.description &&
                $scope.cartasGarantia[key].statusLetter !== $scope.statusLetter.rechazada.description)
                $scope.amountTotalCarta += $scope.cartasGarantia[key].amountRequested;
            });
          }

          if ($scope.siniestros.length>0) {
            angular.forEach($scope.siniestros, function(value,key) {
              $scope.amountTotalSinister += $scope.siniestros[key].amountSinister;
            });
          }
        }
      });
    }

    $scope.buscar = function() {
      buscar();
    };

    function buscar() {
        if ($scope.carta) {
          $scope.paramsHistorial = {
            CodeAffiliate : $scope.carta.affiliateCode,//6000108,
            StartDate : cgwFactory.formatearFecha($scope.mConsultaDesde),//"16/08/2017",
            EndDate : cgwFactory.formatearFecha($scope.mConsultaHasta),//"16/08/2017",
            CodDiagnostic: $scope.mDiagnostico ? $scope.mDiagnostico.code : ''
          };

          getHistorial();

          $timeout(function() {
            log.info('buscando..');
          }, 1500);
        }
    }

    $scope.verAuditoriaExterna = function(data) {
      if ($scope.roleCode !== constants.module.cgw.roles.clinica.description) {
        url = $state.href('detalleConsultaAuditor', {id: data.number, year: data.year, version: data.version, cia: data.codeCompany, auditNumber: data.numberExternalAudit, flag: 0}, {reload: true, inherit: false});
        window.open(url,'_blank');
      }
      else{
        url = $state.href('detalleConsultaAuditor', {id: data.number, year: data.year, version: data.version, cia: data.codeCompany, auditNumber: data.numberExternalAudit, flag: 1}, {reload: true, inherit: false});
        window.open(url,'_blank');
      }
    };

    $scope.verCartaGarantia = function(carta) {
      if ($scope.roleId !== 1) {
        url = $state.href('detalleConsultaAdmin', {id: carta.number, year: carta.year, version: carta.version, cia: carta.codeCompany, flag: $scope.roleId, state: ''}, {reload: true, inherit: false});
        window.open(url,'_blank');
      }
      else{
        url = $state.href('detalleConsultaClinica', {id: carta.number, year: carta.year, version: carta.version, cia: carta.codeCompany, flag: $scope.roleId, state: ''}, {reload: true, inherit: false});
        window.open(url,'_blank');
      }
    };

    $scope.getRojo = function(item) {
      if (item !== undefined)
        return (item.stateId === $scope.statusLetter.rechazada.code || item.stateId === $scope.statusLetter.anulada.code);
    };

    $scope.getVerde = function(item) {
      if (item !== undefined)
        return (item.stateId === $scope.statusLetter.auditoriaAdministrativa.code);
    };

    $scope.getAmarillo = function(item) {
      if (item !== undefined)
        return (item.stateId === $scope.statusLetter.observada.code);
    };

    $scope.getAzul = function(item) {
      if (item !== undefined)
        return (item.stateId === $scope.statusLetter.aprobado.code ||  item.stateId === $scope.statusLetter.procesada.code || item.stateId === $scope.statusLetter.enProcesoDeAuditoria.code);
    };

    $scope.getBlanco = function(item) {
      if (item !== undefined)
        return (item.stateId === $scope.statusLetter.observacionLevantada.code ||
          item.stateId === $scope.statusLetter.auditado.code || item.stateId === $scope.statusLetter.enProcesoDeAuditoria.code);
    };

    $scope.getTransparent = function(item) {
      if (item !== undefined)
        return item.stateId === $scope.statusLetter.solicitado.code ||
                item.stateId === $scope.statusLetter.auditoriaEjecutivo.code;
    };

    $scope.downloadAdjunto = function(name) {
      $scope.fileAuditoriaExtURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.cgw+ 'api/externalaudit/attachfile/download');
      $scope.downloadAtachFile = {
        FileNameLarge: name
      };

      $timeout(function() {
        document.getElementById('frmFileuditoriaExt2').submit();
      }, 500);
    };

    // Funcion que busca diagnosticos en base al texto colocado
    $scope.getListDiagnostic = function(wilcar) {
      if (wilcar && wilcar.length >= 3) {
        var paramDiagnostico = {
          diagnosticName: wilcar.toUpperCase()
        };

        var defer = $q.defer();
        cgwFactory.getListDiagnostic(paramDiagnostico, false).then(function (response) {
          defer.resolve(response.data.items);
        });

        return defer.promise;
      }
    }

  } // end controller

  return ng.module('appCgw')
    .controller('ModalHistorialController', ModalHistorialController);
});
