define([
  'angular', 'constants',
  '/cgw/app/factory/cgwFactory.js',
  '/scripts/mpf-main-controls/components/modalSucursal/component/modalSucursal.js'
], function(ng, constants) {

  cgwHomeController.$inject = ['$scope', 'cgwFactory', '$uibModal', '$window', '$rootScope', 'oimClaims', 'mModalAlert', 'localStorageService', '$state'];

  function cgwHomeController($scope, cgwFactory, $uibModal, $window, $rootScope, oimClaims, mModalAlert, localStorageService, $state) {

    (function onLoad() {
      console.log('V2023-07-03 09:00');

      $scope.grupoAplicacion = parseInt(oimClaims.userSubType);

      cgwFactory.getRole($scope.grupoAplicacion).then(function (response) {
        if (response.data) {
          $scope.roleId = response.data.roleId;
          $scope.roleCode = response.data.roleCode;

          if ($scope.roleCode === constants.module.cgw.roles.clinica.description) {
            cgwFactory.getSubMenu('OIMPROV').then(function (response) {
              var appSubMenu = _.find(response.data,
                function(item) {
                    return item.nombreCabecera && item.nombreCabecera.toUpperCase() === "APLICACIONES"
                });

              if (appSubMenu !== undefined)
                angular.forEach(appSubMenu.items, function(submenu) {
                  if (submenu.nombreCorto.toUpperCase() === "CARTA CARANTIA") setRuta(submenu);
                });
            }, function(error) {
              mModalAlert.showError("Error en getTicketUser", 'Error');
            });
          }
        }
      });

      $scope.paramsTicket = {
          GrupoAplicacion: parseInt($scope.grupoAplicacion),
          Usuario: oimClaims.loginUserName.toUpperCase(),//vm.user,
          CodigoAgente: (parseInt($scope.codAgt) ? parseInt(vm.codAgt) : 0),
          DescriptionAgente: ''
      };
      cgwFactory.addVariableSession('grupoAplicacion', $scope.paramsTicket.GrupoAplicacion);

      cgwFactory.addVariableSession('oimClaims', oimClaims);

      cgwFactory.getTicketUser($scope.paramsTicket, true).then(function(response) {
        cgwFactory.eliminarVariableSession('sucursal');
        if (response.data) {
          $scope.userRuc = response.data.originCompany;//response.data.userCode;
          $scope.userLogin = response.data.userLogin;
          $scope.roleCode = response.data.roleCode;
          $scope.flagClinic = response.data.flagClinic;
          $scope.codeClinic = response.data.clinic;
          $scope.sepsCode = response.data.sepsCode;
          $scope.clinicBranchCode = response.data.clinicBranchCode;
          $scope.clinicCode = response.data.clinicCode;
          $scope.providerCodeSctr = response.data.providerCodeSctr;
          $scope.providerName = response.data.providerName;

          if (response.data.roleCode === constants.module.cgw.roles.medExterno.description) {//MED Externo)
            $scope.showSolicitudCGW = false;
            $scope.showReportesCGW = false;
            $scope.showAuditoriaE = true;

            $scope.showMantenimientosCGW = true;
          }else if (response.data.roleCode === constants.module.cgw.roles.consulta.description) {
            $scope.showSolicitudCGW = false;
            $scope.showReportesCGW = true;
            $scope.showAuditoriaE = true;

            $scope.showMantenimientosCGW = true;
          }else if (response.data.roleCode === constants.module.cgw.roles.coordinador.description) { // Coordinador Clinica
            $scope.showSolicitudCGW = false;
            $scope.showReportesCGW = true;
            $scope.showAuditoriaE = true;

            $scope.showMantenimientosCGW = true;
          }else if (response.data.roleCode === constants.module.cgw.roles.supervisor.description) {
            $scope.showCondicionadosCGW = true;
            $scope.showContactoFarmacosCGW = true;
            $scope.showSumaAseguradaCGW = true;
            $scope.showAsignarClinicaCGW = true;
            $scope.showMantenimientosCGW = true;
            $scope.showSolicitudCGW = true;
            $scope.showReportesCGW = true;
            $scope.showAuditoriaE = true;
            $scope.showAltoCostoPaciente = true;
            $scope.showAltoCostoSiniestro = true;
          }else if (response.data.roleCode === constants.module.cgw.roles.clinica.description) { //Clinica
            $scope.showAuditoriaE = false;
            $scope.showSolicitudCGW = true;
            $scope.showReportesCGW = true;

            $scope.showMantenimientosCGW = true;
          }else if (response.data.roleCode === constants.module.cgw.roles.ejecutivo.description) { //Ejecutivo
            $scope.showCondicionadosCGW = true;
            $scope.showContactoFarmacosCGW = true;
            $scope.showSumaAseguradaCGW = true;
            $scope.showAsignarClinicaCGW = true;
            $scope.showMantenimientosCGW = true;
            $scope.showSolicitudCGW = true;
            $scope.showReportesCGW = true;
            $scope.showAuditoriaE = true;
          }else if (response.data.roleCode === constants.module.cgw.roles.admin.description) { //Administrador
            $scope.showCondicionadosCGW = true;
            $scope.showContactoFarmacosCGW = true;
            $scope.showSumaAseguradaCGW = true;
            $scope.showAsignarClinicaCGW = true;
            $scope.showMantenimientosCGW = true;
            $scope.showSolicitudCGW = true;
            $scope.showReportesCGW = true;
            $scope.showAuditoriaE = true;
          } else if (response.data.roleCode === constants.module.cgw.roles.broker.description) { //Broker
            $scope.showSolicitudCGW = false;
            $scope.showReportesCGW = false;
            $scope.showAuditoriaE = false;
            $scope.showMantenimientosCGW = false;
          } else {
            $scope.showSolicitudCGW = true;
            $scope.showReportesCGW = true;
            $scope.showAuditoriaE = true;

          $scope.showMantenimientosCGW = true;
          }

          if ($scope.flagClinic === 0) {
            $scope.mClinica = {
              providerCode:  $scope.clinicCode,
              code: $scope.providerName,
              description: $scope.userLogin,
              rucNumber: $scope.userRuc
            };

            $window.sessionStorage.setItem('cgwHome', $scope.clinicCode);
          } else {
            getSucursalesAndModal($scope.userRuc, true);
          }

          $window.sessionStorage.setItem('cgwDataTicket', JSON.stringify(response.data));
        }
       }, function(error) {
         mModalAlert.showError("Al obtener credenciales de acceso a Cartas de Garantía", "Error").then(function(response) {
            window.location.href = '/';
          }, function(error) {
            window.location.href = '/';
          });
      });

    })();

    if ($scope.flagClinic === 0) {
      $window.sessionStorage.setItem('cgwHome', $scope.clinicCode);
    }

    function openSucursalModal() {
      $uibModal.open({
        backdrop: false,
        backdropClick: true,
        dialogFade: false,
        animation: $scope.animationsEnabled,
        keyboard: false,
        scope: $scope,
        windowTopClass: 'modal--bg-overlay fade',
        template: '<mpf-modal-sucursal close="close()" dismiss= "dismiss()" data="data"></mpf-modal-sucursal>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
            window.location.href = '/';
          };

          scope.dismiss = function() {
            $uibModalInstance.close();
          };

          scope.data = {
            title: 'Selecciona los valores para cada agente/cliente solicitado',
            lblCbo: 'Selecciona la sucursal:',
            sourceSelect: $scope.sucursales
          }
        }]
      });
    }

    function getSucursalesAndModal(ruc, condicional) {
      if (!ruc) {
        mModalAlert.showError("El usuario no tiene un número de RUC válido", 'Error').then(function(response) {
          window.location.href = '/';
        }, function(error) {
          window.location.href = '/';
        });
      } else {
        cgwFactory.getListBranchClinicByRuc(ruc, condicional).then(function(response) {
          if (response.data.items.length > 0) {

            $scope.sucursales = response.data.items;

            if ($scope.sucursales.length > 1) {
              openSucursalModal();
            } else {
              $window.sessionStorage.setItem('cgwHome', $scope.sucursales[0].code);
            }
          } else {
            mModalAlert.showError("Error al consultar las sucursales. Favor notificar a mesa de ayuda", "Error").then(function(response) {
              window.location.href = '/';
            }, function(error) {
              window.location.href = '/';
            });
          }
         }, function(error) {
          mModalAlert.showError(error.data.message, 'Error').then(function(response) {
              window.location.href = '/';
            }, function(error) {
              window.location.href = '/';
            });
        });
      }
    }

    function setRuta(aplicacion) {
      if ($window.sessionStorage.getItem('RutaCGW') == null) {
        $window.sessionStorage.setItem('RutaCGW', JSON.stringify(aplicacion.ruta));
      }else if ($window.sessionStorage.getItem('RutaCGW').length>0) {
        $window.sessionStorage.removeItem('RutaCGW');
        $window.sessionStorage.setItem('RutaCGW', JSON.stringify(aplicacion.ruta));
      }

      if (cgwFactory.getVariableSession('RutaCGW').length>0) {
        var str = cgwFactory.getVariableSession('RutaCGW');
        var res = str.split("&");

        $scope.user = res[1].split("=")[1];
        $scope.grupoAplicacion = res[2].split("=")[1];
        $scope.codAgt = res[3].split("=")[1];

        $scope.userRuc = $scope.user;

      } else {
        $scope.user = '';
        $scope.grupoAplicacion = 0;
        $scope.codAgt = 0;

      }
    }

    $rootScope.$on('deleteKeyCGW', function(event) {
      localStorageService.remove('formData');
      $window.localStorage.removeItem('ls.formData');
    });

    $scope.goToSolicitud = function () {
      $rootScope = $rootScope.$new(true);
      $scope = $scope.$new(true);
      $state.go('solicitudCgw.steps', {step: 1, id: 0});
    }

  } //  end controller

  return ng.module('appCgw')
    .controller('CgwHomeController', cgwHomeController);
});
