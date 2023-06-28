'use strict';

define([
  'angular', 'constants',
  '/cgw/app/factory/cgwFactory.js'
], function(ng, constants) {

  altoCostoSiniestroController.$inject = ['$scope', 'cgwFactory', '$q', 'formularioEjecutivos',
    'formularioEmpresas', 'formularioEstadosCarta', '$timeout', 'mModalAlert', '$sce', 'oimClaims', 'MxPaginador', 'localStorageService'];

  function altoCostoSiniestroController($scope, cgwFactory, $q, formularioEjecutivos,
    formularioEmpresas, formularioEstadosCarta, $timeout, mModalAlert, $sce, oimClaims, MxPaginador, localStorageService) {

    var vm = this;

    vm.pageSize = 100;
    vm.msgVacio = 'No se han encontrado registros con los filtros ingresados';
    vm.pageChanged = pageChanged;
    vm.mPagination = 1;
    vm.itemsXTanda = vm.pageSize * 4;

    var page;
    page = new MxPaginador();
    page.setNroItemsPorPagina(vm.pageSize);

    $scope.$on('$stateChangeSuccess', function(e, to, toParam, from, fromParam) {
      if (from.name !== "detalleAltoCostoSiniestro") {
        $scope.other = false;
        var object2 = JSON.parse(localStorageService.get("todayAltoCostoSiniestro"));
        if (object2) {
          var dateString2 = object2.timestamp;
          var now2 = new Date();
          compareTime(dateString2, now2);
        }

        initData();
      }
    });

    // $scope.$watch('$scope.formData.mConsultaDesde', function(nv) {
    //   vm.dateOptions2.minDate = $scope.formData.mConsultaDesde;
    // });

    vm.$onInit = function() {

      initData();

      if (!$scope.formData) {
        $scope.formData = {};
        $scope.formData.mConsultaDesde = cgwFactory.formatearFecha($scope.formData.mConsultaDesde);
        $scope.formData.mConsultaHasta = cgwFactory.formatearFecha($scope.formData.mConsultaHasta);
        $scope.formData.mClinica = null;
      }

      vm.grupoAplicacion = parseInt(oimClaims.userSubType);

      if ($scope.formData.mConsultaDesde) {
        $scope.formData.mConsultaDesde  = new Date(new Date($scope.formData.mConsultaDesde).setHours(23,59,59,999));
      }

      if ($scope.formData.mConsultaDesde) {
        $scope.formData.mConsultaHasta  = new Date(new Date($scope.formData.mConsultaHasta).setHours(23,59,59,999));
      }

      cgwFactory.getRole(vm.grupoAplicacion).then(function (response) {
        if (response.data) {
          vm.roleId = response.data.roleId;
          vm.roleCode = response.data.roleCode;
          var object = JSON.parse(localStorageService.get("todayAltoCostoSiniestro"));
          if (object) {
            var dateString = object.timestamp;
            var now = new Date();
            compareTime(dateString, now);
          }
        }
      });

      $scope.formData.pages = [];

      vm.currentPage = 0;
      vm.noResult = true;

      vm.format = 'dd/MM/yyyy';
      vm.popup1 = { opened: false };
      vm.popup2 = { opened: false };

      vm.dateOptions = {
        initDate: new Date(),
        maxDate: new Date()
      };

      vm.dateOptions2 = {
        initDate: $scope.formData.mConsultaDesde,
        maxDate: new Date()
      };

      vm.orden = [
        { code: "0", description: "AÑO - NRO. CG." },
        { code: "1", description: "MONTO TOTAL CG." },
        { code: "2", description: "CLIENTE" },
        { code: "3", description: "CLINICA" },
        { code: "4", description: "AFILIADO" }
      ];
      vm.formas = [
        { code: "1", description: "ASCEDENTE" },
        { code: "0", description: "DESCENDENTE" }
      ];
      // Maestros
      vm.empresas = formularioEmpresas;
      vm.estadoCartas = formularioEstadosCarta;
      vm.ejecutivos = formularioEjecutivos;
      //Calendario
      vm.open1 = open1;
      vm.open2 = open2;
      //Autocompletados
      vm.getListClinicas = getListClinicas;
      // Validar campos
      vm.validateDesde = validateDesde;
      vm.validateHasta = validateHasta;
      vm.invalidFilters = invalidFilters;
      //Formulario
      vm.filtrar = filtrar;
      vm.limpiar = limpiar;
      //Descargar Reporte
      vm.downloadReport = downloadReport;
    }

    vm.loadProducts = function(idCompany) {
      if (vm.formData) {
        vm.formData.mProducto = undefined;
      }
      vm.productos = [];
      if (idCompany) {
        cgwFactory.GetAllProductBy('SGA', idCompany).then(function(response) {
          if (response.data) {
            vm.productos = response.data;
          } else {
            if (!response.isValid) {
              var message = '';
              ng.forEach(response.brokenRulesCollection, function(error) {
                message += error.description + ' ';
              });
              mModalAlert.showError(message, 'Error');
            }
          }
        })
        .catch(function(err){
          mModalAlert.showError(err.data, 'Error');
        });
      }
    }

    function initData() {
      var value2 = localStorageService.get('formDataSiniestro');
      if (!value2) {
        $scope.formData = {};
        $scope.formData.mConsultaDesde = cgwFactory.agregarDias(new Date(), -15);
        $scope.formData.mConsultaHasta = new Date(new Date().setHours(23,59,59,999));
        vm.loadProducts(3);
      } else {
        $scope.formData = value2;
        vm.loadProducts($scope.formData.mEmpresa.id);
        $scope.formData.mConsultaDesde  = new Date(new Date($scope.formData.mConsultaDesde).setHours(23,59,59,999));
        $scope.formData.mConsultaHasta  = new Date(new Date($scope.formData.mConsultaHasta).setHours(23,59,59,999));
      }
    }

    function open1() {
      vm.popup1.opened = true;
    }

    function open2() {
      vm.popup2.opened = true;
    }

    function getListClinicas(wilcar) {
      if (wilcar && wilcar.length >= 3) {
        var paramClinica = {
          Filter: wilcar.toUpperCase()
        };

        var defer = $q.defer();
        cgwFactory.getListClinic(paramClinica, false).then(function (response) {
          (response.data.items.length > 0) ? $scope.showClinicaError = false : $scope.showClinicaError = true;
          defer.resolve(response.data.items);
        });

        return defer.promise;
      } else {
        $scope.showClinicaError = false
      }
    }

    function validateDesde(date){
      $scope.showDesdeError = (date == '' || date == null);
    }

    function validateHasta(date){
      $scope.showHastaError = (date == '' || date == null);
    }

    function invalidFilters(){
      return $scope.showDesdeError || $scope.showHastaError;
    }

    function filtrar() {
      if ($scope.formData.mConsultaDesde > $scope.formData.mConsultaHasta) {
          mModalAlert.showError("Verifique las fechas seleccionadas", "Error");
      } else {
        vm.paramsSearch = {
          ReportType: 1, 
          CompanyId: typeof $scope.formData.mEmpresa.id === 'undefined' ? '' : $scope.formData.mEmpresa.id,
          ProductCode: $scope.formData.mProducto.productCode === null ? '0' : $scope.formData.mProducto.productCode,
          StartDate: typeof $scope.formData.mConsultaDesde === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaDesde),
          EndDate: typeof $scope.formData.mConsultaHasta === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaHasta),
          StateId: $scope.formData.mEstadoCarta.code === null ? '0' : $scope.formData.mEstadoCarta.code,
          LetterNumber: $scope.formData.mNroCarta === '' ? null : $scope.formData.mNroCarta,
          MountSince: $scope.formData.mMontoCartaDesde === '' ? '0' : $scope.formData.mMontoCartaDesde,
          MountUntil: $scope.formData.mMontoCartaHasta === '' ? '0' : $scope.formData.mMontoCartaHasta,
          AffiliateName: $scope.formData.mNombre === '' ? null : $scope.formData.mNombre,
          AffiliateLastname: $scope.formData.mApePaterno === '' ? null : $scope.formData.mApePaterno,
          AffiliateLastname2: $scope.formData.mApeMaterno === '' ? null : $scope.formData.mApeMaterno,
          AffiliateNumber: $scope.formData.mNroAfiliado === '' ? null : $scope.formData.mNroAfiliado,
          ProviderId: !$scope.formData.mClinica || $scope.formData.mClinica === null ? '0' : $scope.formData.mClinica.providerCode,
          ExecutiveId: typeof $scope.formData.mEjecutivo === 'undefined' ? '0' : $scope.formData.mEjecutivo.code,
          Form: $scope.formData.mForma.code === null ? '0' : $scope.formData.mForma.code,
          OrderBy: $scope.formData.mOrdenar.code === null ? '0' : $scope.formData.mOrdenar.code,
          PageNumber: 1,
          PageSize: vm.pageSize
        };
        localStorageService.set('formDataSiniestro', $scope.formData);
        var object = {value: "value", timestamp: new Date()};
        localStorageService.set('todayAltoCostoSiniestro', JSON.stringify(object));
        buscarRegistros(vm.paramsSearch);
      }
    }

    function pageChanged(event) {
      vm.paramsSearch = {
        ReportType: 1, 
        CompanyId: typeof $scope.formData.mEmpresa.id === 'undefined' ? '' : $scope.formData.mEmpresa.id,
        ProductCode: $scope.formData.mProducto.productCode === null ? '0' : $scope.formData.mProducto.productCode,
        StartDate: typeof $scope.formData.mConsultaDesde === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaDesde),
        EndDate: typeof $scope.formData.mConsultaHasta === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaHasta),
        StateId: $scope.formData.mEstadoCarta.code === null ? '0' : $scope.formData.mEstadoCarta.code,
        LetterNumber: $scope.formData.mNroCarta === '' ? null : $scope.formData.mNroCarta,
        MountSince: $scope.formData.mMontoCartaDesde === '' ? '0' : $scope.formData.mMontoCartaDesde,
        MountUntil: $scope.formData.mMontoCartaHasta === '' ? '0' : $scope.formData.mMontoCartaHasta,
        AffiliateName: $scope.formData.mNombre === '' ? null : $scope.formData.mNombre,
        AffiliateLastname: $scope.formData.mApePaterno === '' ? null : $scope.formData.mApePaterno,
        AffiliateLastname2: $scope.formData.mApeMaterno === '' ? null : $scope.formData.mApeMaterno,
        AffiliateNumber: $scope.formData.mNroAfiliado === '' ? null : $scope.formData.mNroAfiliado,
        ProviderId: !$scope.formData.mClinica || $scope.formData.mClinica === null ? '0' : $scope.formData.mClinica.providerCode,
        ExecutiveId: typeof $scope.formData.mEjecutivo === 'undefined' ? '0' : $scope.formData.mEjecutivo.code,
        Form: $scope.formData.mForma.code === null ? '0' : $scope.formData.mForma.code,
        OrderBy: $scope.formData.mOrdenar.code === null ? '0' : $scope.formData.mOrdenar.code,
        PageSize: vm.pageSize
      };

      vm.paramsSearch.PageNumber = event;
      buscarRegistros(vm.paramsSearch);
    }

    function buscarRegistros(paramsSearch) {
      if (!paramsSearch.StartDate && !$scope.formData.mConsultaDesde) {
        $scope.formData.mConsultaDesde = cgwFactory.agregarDias(new Date(), -15);
        paramsSearch.StartDate = cgwFactory.agregarDias(new Date(), -15);
        paramsSearch.StartDate = cgwFactory.formatearFecha(paramsSearch.StartDate);

        $scope.formData.mConsultaHasta = new Date(new Date().setHours(23,59,59,999));
        paramsSearch.EndDate = new Date(new Date().setHours(23,59,59,999));
        paramsSearch.EndDate = cgwFactory.formatearFecha(paramsSearch.EndDate);
      } else {
        paramsSearch.StartDate = $scope.formData.mConsultaDesde;
        paramsSearch.EndDate = $scope.formData.mConsultaHasta;
      }

      $scope.formData.pages = [];
      if (vm.paramsSearch){
        if (vm.paramsSearch.PageNumber === 1) {
          vm.totalItems = 0;
          vm.mPagination = 1;
        }
      }

      vm.activeButton = true;

      cgwFactory.buscarAltoCostoSiniestro(paramsSearch).then(function(response) {
        vm.activeButton = false;
        if(response.operationCode == 200){
          if (response.data) {
            if (response.data.items.length > 0) {
              vm.resultados = response.data.items;
              vm.totalItems = response.data.items[0].totalRows;
              vm.totalPages = Math.round(vm.totalItems / vm.pageSize);
              vm.noResult = false;
            } else {
              vm.resultados = [];
              vm.noResult = true;
              vm.totalItems = 0;
              vm.totalPages = 0;
              mModalAlert.showError(vm.msgVacio, 'Error');
            }
          }
        } else {
          mModalAlert.showError('Hubo un error en la consulta', 'Error');
        }
      }, function(error) {
        vm.activeButton = false;
        mModalAlert.showError(error.data.message, 'Error');
      });
    }

    function limpiar() {
      $scope.formData.mNroAfiliado = '';
      $scope.formData.mApePaterno = '';
      $scope.formData.mApeMaterno = '';
      $scope.formData.mNombre = '';
      $scope.formData.mNroCarta = '';
      $scope.formData.mMontoCartaDesde = '';
      $scope.formData.mMontoCartaHasta = '';
      $scope.formData.mEjecutivo = { code: "0", name: "-- SELECCIONE --" };
      $scope.formData.mEstadoCarta = { code: null };
      $scope.formData.mOrdenar = { code: "0", description: "AÑO - NRO. CG." };
      $scope.formData.mForma = { code: "1", description: "ASCEDENTE" };
      $scope.formData.mEmpresa = { id: 3, code: "060027A", description: "MAPFRE PERU EPS" } ;
      $scope.formData.mConsultaDesde = cgwFactory.agregarDias(new Date(), -15);
      $scope.formData.mConsultaHasta = new Date(new Date().setHours(23,59,59,999));
      $scope.formData.mRangoHasta = 12;
      $scope.formData.mClinica = null;

      vm.loadProducts($scope.formData.mEmpresa.id);

      vm.totalItems = 0;
      vm.totalPages = 0;
      vm.noResult = true;

      localStorageService.remove('formDataSiniestro');
    }

    function downloadReport() {
      if ($scope.formData.mConsultaDesde > new Date(new Date().setHours(23,59,59,999)) ||
          $scope.formData.mConsultaHasta > new Date(new Date().setHours(23,59,59,999)) ) {
        mModalAlert.showError("Fecha no puede ser mayor a la fecha actual", "Error");
      } else {
        vm.paramsSearch = {
          ReportType: 1, 
          CompanyId: typeof $scope.formData.mEmpresa.id === 'undefined' ? '' : $scope.formData.mEmpresa.id,
          ProductCode: $scope.formData.mProducto.productCode === null ? '0' : $scope.formData.mProducto.productCode,
          StartDate: typeof $scope.formData.mConsultaDesde === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaDesde),
          EndDate: typeof $scope.formData.mConsultaHasta === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaHasta),
          StateId: $scope.formData.mEstadoCarta.code === null ? '0' : $scope.formData.mEstadoCarta.code,
          LetterNumber: $scope.formData.mNroCarta === '' ? null : $scope.formData.mNroCarta,
          MountSince: $scope.formData.mMontoCartaDesde === '' ? '0' : $scope.formData.mMontoCartaDesde,
          MountUntil: $scope.formData.mMontoCartaHasta === '' ? '0' : $scope.formData.mMontoCartaHasta,
          AffiliateName: $scope.formData.mNombre === '' ? null : $scope.formData.mNombre,
          AffiliateLastname: $scope.formData.mApePaterno === '' ? null : $scope.formData.mApePaterno,
          AffiliateLastname2: $scope.formData.mApeMaterno === '' ? null : $scope.formData.mApeMaterno,
          AffiliateNumber: $scope.formData.mNroAfiliado === '' ? null : $scope.formData.mNroAfiliado,
          ProviderId: !$scope.formData.mClinica || $scope.formData.mClinica === null ? '0' : $scope.formData.mClinica.providerCode,
          ExecutiveId: typeof $scope.formData.mEjecutivo === 'undefined' ? '0' : $scope.formData.mEjecutivo.code,
          Form: $scope.formData.mForma.code === null ? '0' : $scope.formData.mForma.code,
          OrderBy: $scope.formData.mOrdenar.code === null ? '0' : $scope.formData.mOrdenar.code,
          PageNumber: 1,
          PageSize: vm.totalItems
        };
        vm.allURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.cgw + 'api/highcosts/sinisters/report');
        vm.allData = vm.paramsSearch;
        
        cgwFactory.buscarAltoCostoSiniestro(vm.paramsSearch).then(function(response) {
          if(response.operationCode == 200){
            if (response.data) {
              if (response.data.items.length > 0) {
                vm.allData.PageSize = vm.totalItems;
                $timeout(function() {
                  document.getElementById('frmDownloadAll').submit();
                }, 500);
              } else {
                mModalAlert.showError(vm.msgVacio, 'Error');
              }
            }
          } else {
            mModalAlert.showError('Hubo un error en la consulta', 'Error');
          }
        }, function(error) {
          mModalAlert.showError(error.data.message, 'Error');
        });
        
      }
    }

    function compareTime(dateString, now) {
      if (new Date(dateString).getDate() !== now.getDate()) {
        localStorageService.remove('todayAltoCostoSiniestro');
        localStorageService.remove('formDataSiniestro');
      }
    }

  }//  end controller

  return ng.module('appCgw')
    .controller('AltoCostoSiniestroController', altoCostoSiniestroController)
    .factory('loaderAltoCostoSiniestro', ['cgwFactory', '$q', function(cgwFactory, $q) {
     var estadoCartas;
      function initEstadosCarta() {
        var deferred = $q.defer();
        cgwFactory.getListCGWState(true).then(function(response) {
          if (response.data.items.length > 0) {
            estadoCartas = response.data.items;
            deferred.resolve(estadoCartas);
          }
        }, function(error) {
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      var ejecutivos;
      function initListEjecutivos() {
        var deferred = $q.defer();
        cgwFactory.getListUserExecutive(true).then(function(response) {
          if (response.data.items.length > 0) {
            ejecutivos = response.data.items;
            deferred.resolve(ejecutivos);
          }
        }, function (error) {
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
        initListEjecutivos: function() {
          if (ejecutivos) return $q.resolve(ejecutivos);
          return initListEjecutivos();
        },
        initListEmpresas: function() {
          if (_empresas) return $q.resolve(_empresas);
          return initListEmpresas();
        }
      }
    }])
    .directive('preventDefault', function() {
      return function(scope, element, attrs) {
          ng.element(element).bind('click', function(event) {
              event.preventDefault();
              event.stopPropagation();
          });
      }
    });
});