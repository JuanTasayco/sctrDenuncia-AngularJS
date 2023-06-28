define([
  'angular', 'constants',
  '/cgw/app/factory/cgwFactory.js'
], function(ng, constants) {

  cgwConsultaAuditorController.$inject = ['$scope', 'cgwFactory', '$state', '$q', 'formularioEmpresas', 'formularioEstadosCarta', '$timeout', 'mModalAlert', '$window', 'oimClaims'];

  function cgwConsultaAuditorController($scope, cgwFactory, $state, $q, formularioEmpresas, formularioEstadosCarta, $timeout, mModalAlert, $window, oimClaims) {

  	var vm = this;

    vm.$onInit = function() {

      vm.grupoAplicacion = parseInt(oimClaims.userSubType);

      cgwFactory.getRole(vm.grupoAplicacion).then(function (response) {
        if (response.data) {
          $scope.roleId = response.data.roleId;
          $scope.roleCode = response.data.roleCode;
       }
      });

      if ($scope.roleCode === constants.module.cgw.roles.clinica.description)
         window.location.href = '/';

      vm.formData = {};

      vm.formData.mClinica = {};

      /*########################
      # Vigencia
      ########################*/

      vm.format = 'dd/MM/yyyy';
      vm.altInputFormats = ['M!/d!/yyyy'];

      vm.popup1 = {
            opened: false
      };
      vm.popup2 = {
          opened: false
      };

      vm.formData.mConsultaDesde = cgwFactory.agregarDias(new Date(), -15);
      vm.formData.mConsultaHasta = new Date(new Date().setHours(23,59,59,999));

      vm.dateOptions = {
        initDate: new Date(),
        maxDate: new Date()
      };

      vm.dateOptions2 = {
        initDate: vm.formData.mConsultaDesde,
        minDate: new Date(),
        maxDate: new Date()
      };

      // Tipo de empresa
      vm.empresas = formularioEmpresas;
      // Listado de estados de carta
      vm.estadoCartas = formularioEstadosCarta;
      //Calendario
      vm.open1 = open1;
      vm.open2 = open2;
      //Autocomplete Clinica
      vm.getListClinic = getListClinic;
      //Formulario
      vm.filtrar = filtrar;
      vm.limpiar = limpiar;
      vm.verDetalle = verDetalle;

      vm.paramsTicket = {
          GrupoAplicacion: parseInt(vm.grupoAplicacion),
          Usuario: oimClaims.loginUserName.toUpperCase(),
          CodigoAgente: parseInt(oimClaims.agentID),
          DescripcionAgente: ''
        };

      vm.formData.flagClinic = 1;

      cgwFactory.getTicketUser(vm.paramsTicket, false).then(function(response) {
        if (response.data) {
          vm.userRuc = response.data.ruc;
          vm.formData.ruc = response.data.ruc;
          vm.userLogin = response.data.userLogin;
          vm.roleCode = response.data.roleCode;
          vm.formData.flagClinic = response.data.flagClinic;
          vm.codeClinic = response.data.clinic;
          vm.sepsCode = response.data.sepsCode;
          vm.clinicBranchCode = response.data.clinicBranchCode;
          vm.clinicCode = response.data.clinicCode;
          vm.providerCodeSctr = response.data.providerCodeSctr;
          vm.providerName = response.data.providerName;

          if (vm.formData.flagClinic === 1) {
            vm.formData.mClinica = {
              providerCode: vm.clinicCode,
              code: vm.providerName,
              description: vm.userLogin,
              rucNumber: vm.userRuc
            };
          }
        }
      }, function(error) {
        mModalAlert.showError("Error en getTicketUser", 'Error');
      });

      $timeout(function() {

        var paramsSearch = {
          CompanyId: typeof vm.formData.mEmpresa === 'undefined' ? 3 : vm.formData.mEmpresa.id,
          StartDate: typeof vm.formData.mConsultaDesde === 'undefined' ? '' : cgwFactory.formatearFecha(vm.formData.mConsultaDesde),
          EndDate: typeof vm.formData.mConsultaHasta === 'undefined' ? '' : cgwFactory.formatearFecha(vm.formData.mConsultaHasta),
          AffiliateLastName: typeof vm.formData.mApePaterno === 'undefined' ? '' : vm.formData.mApePaterno.toUpperCase(),
          AffiliateLastName2: typeof vm.formData.mApeMaterno === 'undefined' ? '' : vm.formData.mApeMaterno.toUpperCase(),
          AffiliateName: typeof vm.formData.mNombre === 'undefined' ? '' : vm.formData.mNombre.toUpperCase(),
          LetterNumber: typeof vm.formData.mNroCarta === 'undefined' ? 0 : vm.formData.mNroCarta,
          AffiliateNumber: typeof vm.formData.mNroAfiliado === 'undefined' ? 0 : vm.formData.mNroAfiliado,
          ProviderId: typeof vm.formData.mClinica === 'undefined' || typeof vm.formData.mClinica.providerCode === 'undefined' ? 0 : vm.formData.mClinica.providerCode,
          ExternalAuditStateId: typeof vm.formData.mEstadoAuditoria === 'undefined' ? 0 : vm.formData.mEstadoAuditoria.id,
          DocumentNumber: ''
        };
        vm.paramsSearchBkp = ng.copy(paramsSearch);

        buscarCartas(paramsSearch);
      }, 1000);
    };

    function open1() {
      vm.popup1.opened = true;
    }

    function open2() {
      vm.popup2.opened = true;
    }

    $scope.$watch('vm.formData.mConsultaDesde', function(nv)
    {
      vm.dateOptions2.minDate = vm.formData.mConsultaDesde;
    });

    function getListClinic(wilcar) {

      if (wilcar && wilcar.length >= 2) {
        var paramClinica = {
          Filter: wilcar.toUpperCase()
        };

        var defer = $q.defer();

        cgwFactory.getListClinic(paramClinica, false).then(function (response) {

          if (response.data.items.length > 0) {
            vm.sinResultados = false;
          } else {
            vm.sinResultados = true;
          }

          defer.resolve(response.data.items);
        });

        return defer.promise;
      }
    }

    function filtrar() {
      if (vm.formData.mConsultaDesde > new Date(new Date().setHours(23,59,59,999)) ||
        vm.formData.mConsultaHasta > new Date(new Date().setHours(23,59,59,999))) {
        mModalAlert.showError("Fecha no puede ser mayor a la fecha actual", "Error");
      } else  {
        var paramsSearch = {
          CompanyId: typeof vm.formData.mEmpresa === 'undefined' ? '' : vm.formData.mEmpresa.id,
          StartDate: typeof vm.formData.mConsultaDesde === 'undefined' ? '' : cgwFactory.formatearFecha(vm.formData.mConsultaDesde),
          EndDate: typeof vm.formData.mConsultaHasta === 'undefined' ? '' : cgwFactory.formatearFecha(vm.formData.mConsultaHasta),
          AffiliateLastName: typeof vm.formData.mApePaterno === 'undefined' ? '' : vm.formData.mApePaterno.toUpperCase(),
          AffiliateLastName2: typeof vm.formData.mApeMaterno === 'undefined' ? '' : vm.formData.mApeMaterno.toUpperCase(),
          AffiliateName: typeof vm.formData.mNombre === 'undefined' ? '' : vm.formData.mNombre.toUpperCase(),
          LetterNumber: typeof vm.formData.mNroCarta === 'undefined' ? 0 : vm.formData.mNroCarta,
          AffiliateNumber: typeof vm.formData.mNroAfiliado === 'undefined' ? 0 : vm.formData.mNroAfiliado,
          ProviderId: typeof vm.formData.mClinica === 'undefined' || typeof vm.formData.mClinica.providerCode === 'undefined' ? 0 : vm.formData.mClinica.providerCode,
          ExternalAuditStateId: typeof vm.formData.mEstadoAuditoria === 'undefined' ? 0 : vm.formData.mEstadoAuditoria.id,
          DocumentNumber: ''
        };

        buscarCartas(paramsSearch);
      }
  	}

    function buscarCartas(paramsSearch) {
      $scope.disabledButton = true;
       cgwFactory.getListCartasAuditoria(paramsSearch, true).then(function(response) {
        if (response.data.items.length > 0) {
          vm.cartas = response.data.items;
          vm.noResult = false;
        } else  {
          vm.cartas = {};
          vm.noResult = true;
        }
        $scope.disabledButton = false;
      }, function(error) {
        mModalAlert.showError("Error en buscarCartas", 'Error');
        $scope.disabledButton = false;
      });

    }

    function limpiar() {
  		vm.formData.mConsultaDesde  = cgwFactory.agregarDias(new Date(), -15)
  		vm.formData.mConsultaHasta = new Date(new Date().setHours(23,59,59,999));
  		vm.formData.mNroCarta = '';
  		vm.formData.mNroAfiliado = '';
  		vm.formData.mApePaterno = '';
      vm.formData.mApeMaterno = '';
      vm.formData.mNombre = '';
      vm.formData.mClinica = '';
      vm.formData.mEstadoAuditoria.id = null;

      buscarCartas(vm.paramsSearchBkp);
  	}

    function verDetalle(carta) {
      if (vm.formData.flagClinic === 0)
        $state.go('detalleConsultaAuditor', {id: carta.number, year: carta.year, version: carta.version, cia: carta.codeCompany, auditNumber: carta.externalAuditNumber, flag: 0}, {reload: true, inherit: false});
      else
        $state.go('detalleConsultaAuditor', {id: carta.number, year: carta.year, version: carta.version, cia: carta.codeCompany, auditNumber: carta.externalAuditNumber, flag: 1}, {reload: true, inherit: false});
    }

  } //  end controller

  return ng.module('appCgw')
    .controller('CgwConsultaAuditorController', cgwConsultaAuditorController)
    .factory('loaderConsultaAuditoriaCGW', ['cgwFactory', '$q', function(cgwFactory, $q) {
      var estadoCartas;
      function initEstadosCarta() {
        var deferred = $q.defer();
        cgwFactory.getListEstadoAuditoriaExt(true).then(function(response) {
          if (response.data.items.length > 0) {
            estadoCartas = response.data.items;
            deferred.resolve(estadoCartas);
          }
        }, function(error) {
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      var _empresas;
      function initListEmpresas() {
        var deferred = $q.defer();
        cgwFactory.getListCompany(true).then(function(response) {
          if (response.data.items.length > 0) {
            _empresas = response.data.items;
            deferred.resolve(_empresas);
          }
        }, function(error) {
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      return {
        initEstadosCarta: function() {
          if (estadoCartas) return $q.resolve(estadoCartas);
          return initEstadosCarta();
        },
        initListEmpresas: function() {
          if (_empresas) return $q.resolve(_empresas);
          return initListEmpresas();
        }
      }
    }])
    .directive('preventDefault', function() {
      return function(scope, element, attrs) {
          angular.element(element).bind('click', function(event) {
              event.preventDefault();
              event.stopPropagation();
          });
      }
    });
});
