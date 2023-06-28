(function ($root, name, deps, action){
  $root.define(name, deps, action)
})(window, "complaintDisabilityHistoryComponent", ['angular', '/sctrDenuncia/app/services/externalServices.js'], function(ng){
  ng.module('sctrDenuncia.app')
    .controller('complaintDisabilityHistoryComponentController', ['$scope', '$timeout', '$sce', '$q', '$filter', 'accessSupplier', 'externalServices',
      function($scope, $timeout, $sce, $q, $filter, accessSupplier, externalServices){
        var vm = this;
        var profile = accessSupplier.profile();

        $scope.$watch('mConsultaDesde', function() {
          $scope.dateOptions2.minDate = $scope.mConsultaDesde;
        });

        function onInit() {
          if (constants.environment === 'QA') {
            $scope.statusLetter = constants.module.cgw.statusLetter.QA;
          } else  if (constants.environment === 'DEV') {
            $scope.statusLetter = constants.module.cgw.statusLetter.DEV;
          } else {
            $scope.statusLetter = constants.module.cgw.statusLetter.PROD;
          }

          var newdate = new Date();
          newdate.setDate(newdate.getDate() - 15);
          newdate.getFullYear();

          $scope.mConsultaDesde = newdate;
          $scope.mConsultaHasta = new Date(new Date().setHours(23,59,59,999));

          $scope.format = 'dd/MM/yyyy';
          $scope.altInputFormats = ['M!/d!/yyyy'];
    
          $scope.popup1 = { opened: false };

          $scope.popup2 = { opened: false };
    
          $scope.dateOptions = {
            initDate: new Date(),
            maxDate: new Date(agregarMes(new Date(), 1))
          };
    
          $scope.dateOptions2 = {
            initDate: $scope.mConsultaDesde,
            minDate: new Date(),
            maxDate: new Date(agregarMes(new Date(), 12))
          };
  
          var grupoAplicacion = parseInt(profile.userSubType);

          externalServices.getCgwSecurityGetRole(grupoAplicacion, false).then(function(response) {
            if (response.data) {
              $scope.roleId = response.data.roleId;
              $scope.roleCode = response.data.roleCode;
            }
          });

          buscar();
        };
    
        // Funcion para abrir popup de fecha Desde
        function open1() {
          $scope.popup1.opened = true;
        };
    
        // Funcion para abrir popup de fecha Hasta
        function open2() {
          $scope.popup2.opened = true;
        };
    
        // Funcion que consume el ws de historial
        function getHistorial() {
          externalServices.getCgwAfilliateHistorial($scope.paramsHistorial, true).then(function (response) {
            if (response) {
              $scope.auditoriaExterna = response.externalAudits.items;
              $scope.siniestros = response.sinisters.items;
              $scope.cartasGarantia = response.guaranteeLetters.items;
    
              $scope.amountTotalCarta = 0;
              $scope.amountTotalSinister = 0;
    
              if ($scope.cartasGarantia.length > 0) {
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
        };
      
        // Funcion para buscar en el historial
        function buscar() {
          $scope.paramsHistorial = {
            CodeAffiliate : vm.viewdata.affiliateCode,
            StartDate: $filter("date")($scope.mConsultaDesde, "dd/MM/yyyy"),
            EndDate: $filter("date")($scope.mConsultaHasta, "dd/MM/yyyy"),
            CodDiagnostic: $scope.mDiagnostico ? $scope.mDiagnostico.code : ''
          };

          getHistorial();
        };
      
        // Ver detalle de auditoria externa
        function verAuditoriaExterna(data) {
          var flag = $scope.roleCode !== constants.module.cgw.roles.clinica.description ? 0 : 1;
          var url = window.location.origin + "/cgw/#/consultaCartasAuditor/detalle/"+data.number+"/"+data.year+"/"+data.version+"/"+data.codeCompany+"/"+data.numberExternalAudit+"/"+flag;
          window.open(url,'_blank');
        };
    
        // Ver detalle de carta de garantia
        function verCartaGarantia(carta) {
          var url = window.location.origin + "/cgw/#/consultaCartas/detalle/"+carta.number+"/"+carta.year+"/"+carta.version+"/"+carta.codeCompany+"/"+$scope.roleId+"/";
          window.open(url,'_blank');
        };

        // Obtener el color en base a validaciones
        function getColor(item) {
          if (item !== undefined) {
            if(item.stateId === $scope.statusLetter.rechazada.code || item.stateId === $scope.statusLetter.anulada.code) {
              return 'u-bg--rojo-primario';
            }

            if(item.stateId === $scope.statusLetter.auditoriaAdministrativa.code) {
              return 'u-bg--verde-2';
            }

            if(item.stateId === $scope.statusLetter.observada.code) {
              return 'u-bg--yellow-2';
            }

            if(item.stateId === $scope.statusLetter.aprobado.code ||  
              item.stateId === $scope.statusLetter.procesada.code || 
              item.stateId === $scope.statusLetter.enProcesoDeAuditoria.code) {
              return 'u-bg--blue-3';
            }

            if(item.stateId === $scope.statusLetter.solicitado.code ||
              item.stateId === $scope.statusLetter.auditoriaEjecutivo.code) {
              return 'u-bg--transparente';
            }

            if(item.stateId === $scope.statusLetter.observacionLevantada.code ||
              item.stateId === $scope.statusLetter.auditado.code || 
              item.stateId === $scope.statusLetter.enProcesoDeAuditoria.code){
              return 'u-bg--white-1';
            }
          }
        }
    
        // Descargar archivo adjunto
        function downloadAdjunto(name) {
          $scope.fileAuditoriaExtURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.cgw+ 'api/externalaudit/attachfile/download');
          $scope.downloadAtachFile = {
            FileNameLarge: name
          };
    
          $timeout(function() {
            document.getElementById('frmFileuditoriaExt2').submit();
          }, 500);
        };
    
        // Funcion que busca diagnosticos en base al texto colocado
        function getListDiagnostic(wilcar) {
          if (wilcar && wilcar.length >= 3) {
            var paramDiagnostico = {
              diagnosticName: wilcar.toUpperCase()
            };
    
            var defer = $q.defer();
           
            externalServices.getCgwListDiagnostic(paramDiagnostico, false).then(
              function (r) {
                defer.resolve(r.data.items);
              },
              function (r) {
                defer.reject(r);
              }
            );
    
            return defer.promise;
          }
        }

        // Funcion para agregar meses a una fecha
        function agregarMes(fecha, meses) {
          var currentMonth = fecha.getMonth();
          fecha.setMonth(fecha.getMonth() + meses);
    
          if (fecha.getMonth() !== ((currentMonth + meses) % 12)) {
              fecha.setDate(0);
          }
          return fecha;
        };

        vm.$onInit = onInit;
        vm.open1 = open1;
        vm.open2 = open2;
        vm.buscar = buscar;
        vm.verAuditoriaExterna = verAuditoriaExterna;
        vm.verCartaGarantia = verCartaGarantia;
        vm.getColor = getColor;
        vm.downloadAdjunto = downloadAdjunto;
        vm.getListDiagnostic = getListDiagnostic;
      }
    ])
    .component("complaintDisabilityHistory", {
      templateUrl: "/sctrDenuncia/app/complaint/disabilityEditor/history/complaint-history.html",
      controller: "complaintDisabilityHistoryComponentController",
      bindings: {
        viewdata: "=?"
      }
    })
});
