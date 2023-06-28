'use strict';

define([
  'angular', 'constants',
  '/cgw/app/factory/cgwFactory.js'
], function(ng, constants) {

  cgwConsultaController.$inject = ['$scope', '$rootScope', 'cgwFactory', '$state', '$q', 'formularioEjecutivos', 'formularioEjecutivosAsignados',
  'formularioEmpresas', 'formularioEstadosCarta', '$timeout', 'mModalAlert', '$sce', '$window', 'oimClaims', 'MxPaginador', 'localStorageService', 'httpData', 'mainServices', 'oimPrincipal'];

  function cgwConsultaController($scope, $rootScope, cgwFactory, $state, $q, formularioEjecutivos, formularioEjecutivosAsignados, formularioEmpresas,
    formularioEstadosCarta, $timeout, mModalAlert, $sce, $window, oimClaims, MxPaginador, localStorageService, httpData, mainServices, oimPrincipal) {

  	var vm = this;

    vm.pageSize = 100;
    vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
    vm.pageChanged = pageChanged;
    vm.mPagination = 1;

    var page;
    vm.itemsXTanda = vm.pageSize * 4;

    page = new MxPaginador();
    page.setNroItemsPorPagina(vm.pageSize);

    vm.tab = 0;

    $scope.$on('$stateChangeSuccess', function(e, to, toParam, from, fromParam) {
      if ((from.name === "detalleConsultaAdmin" ||
          from.name === "detalleConsultaClinica")) {

        var object = JSON.parse(localStorageService.get("todayCGW"));
        if (object) {
          var dateString = object.timestamp;
          var now = new Date();//.getTime();

          compareTime(dateString, now); //to implement
        }

        var value = localStorageService.get('formData');
        if (!value) {
          $scope.formData = {};
        } else {
            $scope.formData = value;
            $scope.formData.mConsultaDesde  = new Date(new Date($scope.formData.mConsultaDesde).setHours(23,59,59,999));
            $scope.formData.mConsultaHasta  = new Date(new Date($scope.formData.mConsultaHasta).setHours(23,59,59,999));
        }
        $scope.other = true;
      } else {
        $scope.other = false;
        var object2 = JSON.parse(localStorageService.get("todayCGW"));
        if (object2) {
          var dateString2 = object2.timestamp;
          var now2 = new Date();//.getTime();

          compareTime(dateString2, now2); //to implement
        }

        initData();
      }
    });

    function initData() {
      var value2 = localStorageService.get('formData');
      if (!value2) {
        $scope.formData = {};
        vm.loadProducts(3);
      } else {
        $scope.formData = value2;
        vm.loadProducts($scope.formData.mEmpresa.id);
        $scope.formData.mConsultaDesde  = new Date(new Date($scope.formData.mConsultaDesde).setHours(23,59,59,999));
        $scope.formData.mConsultaHasta  = new Date(new Date($scope.formData.mConsultaHasta).setHours(23,59,59,999));
      }
    }

    vm.$onInit = function() {

      initData();

      getListExternalAudit();

      if (!$scope.formData) {// || !$scope.other) {
        $scope.formData = {};
        $scope.formData.mConsultaDesde = cgwFactory.agregarDias(new Date(), -15);//new Date();
        $scope.formData.mConsultaHasta = new Date(new Date().setHours(23,59,59,999));
        $scope.formData.mConsultaDesde = cgwFactory.formatearFecha($scope.formData.mConsultaDesde);
        $scope.formData.mConsultaHasta = cgwFactory.formatearFecha($scope.formData.mConsultaHasta);

        $scope.formData.mClinica = {};
      }

      vm.grupoAplicacion = parseInt(oimClaims.userSubType);

      var broker = oimPrincipal.getAgent();
      vm.codigoBroker = broker ? parseInt(broker.codigoAgente) : 0;

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
          (vm.roleId === 1) ? vm.esClinica = true : vm.esClinica = false;
          var object = JSON.parse(localStorageService.get("todayCGW"));
          if (object) {
            var dateString = object.timestamp;
            var now = new Date();//.getTime();
            compareTime(dateString, now); //to implement
          }

          var value = localStorageService.get('formData');
          if (vm.roleId === 2 && !value) {//MAD = medico auditor
            $scope.formData.mEstadoCarta = {code: 6, description: "EN PROCESO DE AUDITORIA"};
          }
        }
      });

      vm.currentPage = 0;
      $scope.formData.pages = [];

      if (constants.environment === 'QA') {
        $scope.statusLetter = constants.module.cgw.statusLetter.QA;
      }else  if (constants.environment === 'DEV') {
        $scope.statusLetter = constants.module.cgw.statusLetter.DEV;
      } else {
        $scope.statusLetter = constants.module.cgw.statusLetter.PROD;
      }

      /*########################
      # Vigencia
      ########################*/
      vm.format = 'dd/MM/yyyy';
      //vm.altInputFormats = ['M!/d!/yyyy'];

      vm.popup1 = {
            opened: false
      };
      vm.popup2 = {
          opened: false
      };

      vm.popup1Accidente = {
        opened: false
      };
      vm.popup2Accidente = {
          opened: false
      };


      vm.dateOptions = {
        initDate: new Date(),
        maxDate: new Date(cgwFactory.agregarMes(new Date(), 1))
      };

      vm.dateOptions2 = {
        initDate: $scope.formData.mConsultaDesde,
        minDate: new Date(),
        maxDate: new Date(cgwFactory.agregarMes(new Date(), 2))
      };

      vm.dateOptionsAccidente = {
        initDate: new Date(),
        maxDate: new Date(cgwFactory.agregarMes(new Date(), 1))
      };

      vm.dateOptions2Accidente = {
        initDate: $scope.formData.mConsultaAccidenteDesde,
        minDate: new Date(),
        maxDate: new Date(cgwFactory.agregarMes(new Date(), 2))
      };

      // Lista de ejecutivos
      vm.ejecutivos = formularioEjecutivos;
      // Lista de ejecutivos asignados
      vm.ejecutivosAsignados = formularioEjecutivosAsignados;
      // Tipo de empresa
      vm.empresas = formularioEmpresas;
      // Listado de estados de carta
      vm.estadoCartas = formularioEstadosCarta;
      //Calendario
      vm.open1 = open1;
      vm.open2 = open2;
      vm.open1Accidente = open1Accidente;
      vm.open2Accidente = open2Accidente;
      //Autocomplete Clinica
      vm.getListClinic = getListClinic;
      //Formulario
      vm.filtrar = filtrar;
      vm.limpiar = limpiar;
      //Consulta de carta
      vm.downloadLetter = downloadLetter;
      vm.enviarCarta = enviarCarta;
      vm.downloadLetterAll = downloadLetterAll;

      vm.verDetalle = verDetalle;
      vm.getListDoctor = getListDoctor;
      vm.paramsTicket = {
        GrupoAplicacion: parseInt(vm.grupoAplicacion),
        Usuario: oimClaims.loginUserName.toUpperCase(),
        CodigoAgente: (parseInt(vm.codAgt) ? parseInt(vm.codAgt) : 0),
        DescripcionAgente: ''
      };

      $scope.formData.flagClinic = 1;

      cgwFactory.getTicketUser(vm.paramsTicket, false).then(function(response) {
        if (response.data) {
          vm.userRuc = response.data.ruc;
          $scope.formData.ruc = response.data.ruc;
          vm.userLogin = response.data.userLogin;
          vm.roleCode = response.data.roleCode;
          $scope.formData.flagClinic = response.data.flagClinic;
          vm.codeClinic = response.data.clinic;
          vm.sepsCode = response.data.sepsCode;
          vm.clinicBranchCode = response.data.clinicBranchCode;
          vm.clinicCode = response.data.clinicCode;
          vm.providerCodeSctr = response.data.providerCodeSctr;
          vm.providerName = response.data.providerName;
          vm.roleId = response.data.roleId;

          if ($scope.formData.flagClinic === 1) {
            if ($window.sessionStorage.getItem('sucursal')) {
              var sucursal = $window.sessionStorage.getItem('sucursal');
              sucursal = JSON.parse(sucursal);
              $scope.formData.mClinica = {
                providerCode: sucursal.providerCode,
                code: sucursal.code,
                description: sucursal.name,
                rucNumber: sucursal.documentNumber
              };
            } else {
              $scope.formData.mClinica = {
                providerCode: vm.clinicCode,
                code: vm.providerName,
                description: vm.userLogin,
                rucNumber: vm.userRuc
              };
            }
          }

          if (!$scope.formData.mConsultaDesde)
            $scope.formData.mConsultaDesde = cgwFactory.agregarDias(new Date(), -15);
          if (!$scope.formData.mConsultaHasta)
            $scope.formData.mConsultaHasta = new Date();

           var paramsSearch = {
            CompanyId: typeof $scope.formData.mEmpresa === 'undefined' ? 3 : $scope.formData.mEmpresa.id,
            StartDate: typeof $scope.formData.mConsultaDesde === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaDesde),
            EndDate: typeof $scope.formData.mConsultaHasta === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaHasta),
            AffiliateLastName: typeof $scope.formData.mApePaterno === 'undefined' ? '' : $scope.formData.mApePaterno.toUpperCase(),
            AffiliateLastName2: typeof $scope.formData.mApeMaterno === 'undefined' ? '' : $scope.formData.mApeMaterno.toUpperCase(),
            AffiliateName: typeof $scope.formData.mNombre === 'undefined' ? '' : $scope.formData.mNombre.toUpperCase(),
            LetterNumber: typeof $scope.formData.mNroCarta === 'undefined' ? 0 : $scope.formData.mNroCarta,
            AffiliateNumber: typeof $scope.formData.mNroAfiliado === 'undefined' ? 0 : $scope.formData.mNroAfiliado,
            ProviderId: (typeof $scope.formData.mClinica === 'undefined')  ? 0 : $scope.formData.mClinica.providerCode,
            StateId: $scope.formData.mEstadoCarta.code === null ? 99 : $scope.formData.mEstadoCarta.code,
            ExecutiveId: $scope.formData.mEjecutivo.name === "-- SELECCIONE --" ? '' : $scope.formData.mEjecutivo.code,
            MedicCode: (typeof $scope.formData.mMedicoTratante === 'undefined') ? '' : ($scope.formData.mMedicoTratante.code) ? $scope.formData.mMedicoTratante.code : '',
            PageNumber: 1,
            PageSize: vm.pageSize,
            FlagDiagnostic: "T",
            ProductCode: (typeof $scope.formData.mProducto === 'undefined') ? '' : $scope.formData.mProducto.productCode,
            AssignedUser: (typeof $scope.formData.mEjecutivoAsignado === 'undefined') ? '' : $scope.formData.mEjecutivoAsignado.cod_usuario,
            BrokerCode: vm.roleCode !== constants.module.cgw.roles.broker.description ? 0 : vm.codigoBroker,
            AmputationIndicator:  (typeof $scope.formData.mAmputacion === 'undefined') ? null : $scope.formData.mAmputacion,
            StartAccidentDate: typeof $scope.formData.mConsultaAccidenteDesde === 'undefined' ? null : $scope.formData.mConsultaAccidenteDesde,
            EndAccidentDate: typeof $scope.formData.mConsultaAccidenteHasta === 'undefined' ? null: $scope.formData.mConsultaAccidenteHasta,
          };

          var object = JSON.parse(localStorageService.get("todayCGW"));
          if (object) {
            var dateString = object.timestamp;
            var now = new Date();
            compareTime(dateString, now);
          }

          var value = localStorageService.get('formData');
          if (vm.roleId === 2 && !value) {//MAD = medico auditor
            paramsSearch.StateId = 6;
          }

          vm.paramsSearchBkp = ng.copy(paramsSearch);
          vm.currentPage = 1;
          buscarCartas(paramsSearch);
        }
       }, function(error) {
        mModalAlert.showError("Error en getTicketUser", 'Error');
      });
    };

    function open1() {
      vm.popup1.opened = true;
    }

    function open2() {
      vm.popup2.opened = true;
    }

    function open1Accidente() {
      vm.popup1Accidente.opened = true;
    }

    function open2Accidente() {
      vm.popup2Accidente.opened = true;
    }

    $scope.$watch('$scope.formData.mConsultaDesde', function(nv)
    {
      vm.dateOptions2.minDate = $scope.formData.mConsultaDesde;
    });

    $scope.$watch('$scope.formData.mConsultaAccidenteDesde', function(nv)
    {
      vm.dateOptions2Accidente.minDate = $scope.formData.mConsultaAccidenteDesde;
    });

    function getListClinic(wilcar) {
      if (wilcar && wilcar.length >= 2) {
        var paramClinica = {
          Filter: wilcar.toUpperCase()
        };

        var defer = $q.defer();
        cgwFactory.getListClinic(paramClinica, false).then(function (response) {
          (response.data.items.length > 0) ? vm.sinResultados = false : vm.sinResultados = true;
          defer.resolve(response.data.items);
        });

        return defer.promise;
      }
    }

    function filtrar() {
      if ($scope.formData.mConsultaDesde > $scope.formData.mConsultaHasta) {
          mModalAlert.showError("Verifique las fechas seleccionadas", "Error");
      } else {
           vm.paramsSearch = {
              CompanyId: typeof $scope.formData.mEmpresa.id === 'undefined' ? '' : $scope.formData.mEmpresa.id,
              StartDate: typeof $scope.formData.mConsultaDesde === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaDesde),
              EndDate: typeof $scope.formData.mConsultaHasta === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaHasta),
              AffiliateLastName: typeof $scope.formData.mApePaterno === 'undefined' ? '' : $scope.formData.mApePaterno.toUpperCase(),
              AffiliateLastName2: typeof $scope.formData.mApeMaterno === 'undefined' ? '' : $scope.formData.mApeMaterno.toUpperCase(),
              AffiliateName: typeof $scope.formData.mNombre === 'undefined' ? '' : $scope.formData.mNombre.toUpperCase(),
              LetterNumber: typeof $scope.formData.mNroCarta === 'undefined' ? 0 : $scope.formData.mNroCarta,
              AffiliateNumber: typeof $scope.formData.mNroAfiliado === 'undefined' ? 0 : $scope.formData.mNroAfiliado,
              ProviderId: typeof $scope.formData.mClinica === 'undefined' || typeof $scope.formData.mClinica.providerCode === 'undefined' ? 0 : $scope.formData.mClinica.providerCode,
              StateId: $scope.formData.mEstadoCarta.code === null ? 99 : $scope.formData.mEstadoCarta.code,
              ExecutiveId: $scope.formData.mEjecutivo.name === "-- SELECCIONE --" ? '' : $scope.formData.mEjecutivo.code,
              MedicCode: (typeof $scope.formData.mMedicoTratante === 'undefined') ? '' : ($scope.formData.mMedicoTratante.code) ? $scope.formData.mMedicoTratante.code : '',
              PageNumber: 1,
              PageSize: vm.pageSize,
              FlagDiagnostic: (typeof $scope.formData.mTipoBusqueda === 'undefined') ? '' : $scope.formData.mTipoBusqueda,
              ProductCode: (typeof $scope.formData.mProducto === 'undefined') ? '' : $scope.formData.mProducto.productCode,
              Placa: !$scope.formData.mPlaca ? '' : $scope.formData.mPlaca,
              NroPoliza: !$scope.formData.mPoliza  ? '' : $scope.formData.mPoliza,
              NroSiniestro: !$scope.formData.mNroSinestro  ? '' : $scope.formData.mNroSinestro,
              AssignedUser: (typeof $scope.formData.mEjecutivoAsignado === 'undefined') ? '' : $scope.formData.mEjecutivoAsignado.cod_usuario,
              BrokerCode: vm.roleCode !== constants.module.cgw.roles.broker.description ? 0 : vm.codigoBroker,
              AmputationIndicator:  (typeof $scope.formData.mAmputacion === 'undefined') ? null : $scope.formData.mAmputacion,
              StartAccidentDate: typeof $scope.formData.mConsultaAccidenteDesde === 'undefined' ? null : $scope.formData.mConsultaAccidenteDesde,
              EndAccidentDate: typeof $scope.formData.mConsultaAccidenteHasta === 'undefined' ? null : $scope.formData.mConsultaAccidenteHasta,
            };
          localStorageService.set('formData', $scope.formData);
          var object = {value: "value", timestamp: new Date()};
          localStorageService.set('todayCGW', JSON.stringify(object));
          buscarCartas(vm.paramsSearch);
       }
  	}

    function pageChanged(event) {
      vm.paramsSearch = {
        CompanyId: typeof $scope.formData.mEmpresa.id === 'undefined' ? '' : $scope.formData.mEmpresa.id,
        StartDate: typeof $scope.formData.mConsultaDesde === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaDesde),
        EndDate: typeof $scope.formData.mConsultaHasta === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaHasta),
        AffiliateLastName: typeof $scope.formData.mApePaterno === 'undefined' ? '' : $scope.formData.mApePaterno.toUpperCase(),
        AffiliateLastName2: typeof $scope.formData.mApeMaterno === 'undefined' ? '' : $scope.formData.mApeMaterno.toUpperCase(),
        AffiliateName: typeof $scope.formData.mNombre === 'undefined' ? '' : $scope.formData.mNombre.toUpperCase(),
        LetterNumber: typeof $scope.formData.mNroCarta === 'undefined' ? 0 : $scope.formData.mNroCarta,
        AffiliateNumber: typeof $scope.formData.mNroAfiliado === 'undefined' ? 0 : $scope.formData.mNroAfiliado,
        ProviderId: typeof $scope.formData.mClinica === 'undefined' || typeof $scope.formData.mClinica.providerCode === 'undefined' ? 0 : $scope.formData.mClinica.providerCode,
        StateId: $scope.formData.mEstadoCarta.code === null ? 99 : $scope.formData.mEstadoCarta.code,
        ExecutiveId: $scope.formData.mEjecutivo.name === "-- SELECCIONE --" ? '' : $scope.formData.mEjecutivo.code,
        MedicCode: (typeof $scope.formData.mMedicoTratante === 'undefined') ? '' : ($scope.formData.mMedicoTratante.code) ? $scope.formData.mMedicoTratante.code : '',
        PageSize: vm.pageSize,
        FlagDiagnostic: (typeof $scope.formData.mTipoBusqueda === 'undefined') ? '' : $scope.formData.mTipoBusqueda,
        ProductCode: (typeof $scope.formData.mProducto === 'undefined') ? '' : $scope.formData.mProducto.productCode,
        Placa: !$scope.formData.mPlaca ? '' : $scope.formData.mPlaca,
        NroPoliza: !$scope.formData.mPoliza  ? '' : $scope.formData.mPoliza ,
        NroSiniestro: !$scope.formData.mNroSinestro  ? '' : $scope.formData.mNroSinestro,
        AssignedUser:(typeof $scope.formData.mEjecutivoAsignado === 'undefined') ? '' : $scope.formData.mEjecutivoAsignado.cod_usuario,
        BrokerCode: vm.roleCode !== constants.module.cgw.roles.broker.description ? 0 : vm.codigoBroker,
        AmputationIndicator:  (typeof $scope.formData.mAmputacion === 'undefined') ? null : $scope.formData.mAmputacion,
        StartAccidentDate: typeof $scope.formData.mConsultaAccidenteDesde === 'undefined' ? null : $scope.formData.mConsultaAccidenteDesde,
        EndAccidentDate: typeof $scope.formData.mConsultaAccidenteHasta === 'undefined' ? null : $scope.formData.mConsultaAccidenteHasta,
      };

      vm.paramsSearch.PageNumber = event;
      buscarCartas(vm.paramsSearch);
    }

    function buscarCartas(paramsSearch) {

      if (!paramsSearch.StartDate && !$scope.formData.mConsultaDesde) {
        $scope.formData.mConsultaDesde = cgwFactory.agregarDias(new Date(), -15);
        paramsSearch.StartDate = cgwFactory.agregarDias(new Date(), -15);//new Date();
        paramsSearch.StartDate = cgwFactory.formatearFecha(paramsSearch.StartDate);

        $scope.formData.mConsultaHasta = new Date(new Date().setHours(23,59,59,999));
        paramsSearch.EndDate = new Date(new Date().setHours(23,59,59,999));
        paramsSearch.EndDate = cgwFactory.formatearFecha(paramsSearch.EndDate);
      } else {
        paramsSearch.StartDate = $scope.formData.mConsultaDesde;
        paramsSearch.EndDate = $scope.formData.mConsultaHasta;
      }

       $scope.formData.pages = [];
       if (vm.paramsSearch)
        if (vm.paramsSearch.PageNumber === 1) {
          vm.totalItems = 0;
          vm.mPagination = 1;
        }

       vm.activeButton = true;
       cgwFactory.getListGuaranteeLetter(paramsSearch, true).then(function(response) {
        vm.activeButton = false;
        if (response.data) {
          if (response.data.items.length > 0) {
            vm.cartas = response.data.items;
            vm.totalItems = response.data.totalRows;
            vm.totalPages = response.data.totalPages;
            vm.noResult = false;
          } else {
            vm.cartas = {};
            vm.noResult = true;
            vm.totalItems = 0;
            vm.totalPages = 0;
          }
        } else {
          vm.cartas = {};
          vm.noResult = true;
          vm.totalItems = 0;
          vm.totalPages = 0;
        }

       }, function(error) {
        vm.activeButton = false;
        mModalAlert.showError(error.data.message, 'Error');
      });

    }

    function limpiar() {
  		$scope.formData.mNroAfiliado = undefined;
  		$scope.formData.mApePaterno = '';
  		$scope.formData.mApeMaterno = '';
  		$scope.formData.mNombre = '';
  		$scope.formData.mNroCarta = undefined;
  		$scope.formData.mMontoCartaDesde = '';
  		$scope.formData.mMontoCartaHasta = '';
      $scope.formData.mEjecutivo = {code: "0", name: "-- SELECCIONE --"};
      $scope.formData.mEjecutivoAsignado = {cod_usuario: null};
      $scope.formData.mMedicoTratante = undefined;
      $scope.formData.mConsultaAccidenteDesde = undefined;
      $scope.formData.mConsultaAccidenteHasta = undefined;
      $scope.formData.mAmputacion = undefined;

      vm.totalItems = 0;
      vm.totalPages = 0;
      vm.noResult = true;
      $scope.formData.mEstadoCarta = {code: null};
      $scope.formData.mEmpresa = {id:3,code:"060027A", description:"MAPFRE PERU EPS"} ;
      vm.loadProducts($scope.formData.mEmpresa.id);
      $scope.formData.mConsultaDesde = cgwFactory.agregarDias(new Date(), -15)//new Date();
      $scope.formData.mConsultaHasta = new Date(new Date().setHours(23,59,59,999));

      if ($scope.formData.flagClinic === 0)
        $scope.formData.mClinica = {};

      localStorageService.remove('formData');

      var paramsSearch = {
        CompanyId: typeof $scope.formData.mEmpresa === 'undefined' ? 3 : $scope.formData.mEmpresa.id,
        StartDate: typeof $scope.formData.mConsultaDesde === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaDesde),
        EndDate: typeof $scope.formData.mConsultaHasta === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaHasta),
        AffiliateLastName: typeof $scope.formData.mApePaterno === 'undefined' ? '' : $scope.formData.mApePaterno.toUpperCase(),
        AffiliateLastName2: typeof $scope.formData.mApeMaterno === 'undefined' ? '' : $scope.formData.mApeMaterno.toUpperCase(),
        AffiliateName: typeof $scope.formData.mNombre === 'undefined' ? '' : $scope.formData.mNombre.toUpperCase(),
        LetterNumber: typeof $scope.formData.mNroCarta === 'undefined' ? 0 : $scope.formData.mNroCarta,
        AffiliateNumber: typeof $scope.formData.mNroAfiliado === 'undefined' ? 0 : $scope.formData.mNroAfiliado,
        ProviderId: $scope.formData.mClinica === {}  ? 0 : $scope.formData.mClinica.providerCode,
        StateId: $scope.formData.mEstadoCarta.code === null ? 99 : $scope.formData.mEstadoCarta.code,
        ExecutiveId: $scope.formData.mEjecutivo.name === "-- SELECCIONE --" ? '' : $scope.formData.mEjecutivo.code,
        MedicCode: (typeof $scope.formData.mMedicoTratante === 'undefined') ? '' : $scope.formData.mMedicoTratante.code,
        FlagDiagnostic: (typeof $scope.formData.mTipoBusqueda === 'undefined') ? '' : $scope.formData.mTipoBusqueda,
        ProductCode: (typeof $scope.formData.mProducto === 'undefined') ? '' : $scope.formData.mProducto.productCode,
        AssignedUser: (typeof $scope.formData.mEjecutivoAsignado === 'undefined') ? '' : $scope.formData.mEjecutivoAsignado.cod_usuario,
        BrokerCode: vm.roleCode !== constants.module.cgw.roles.broker.description ? 0 : vm.codigoBroker,
        AmputationIndicator:  (typeof $scope.formData.mAmputacion === 'undefined') ? null : $scope.formData.mAmputacion,
        StartAccidentDate: typeof $scope.formData.mConsultaAccidenteDesde === 'undefined' ? null : $scope.formData.mConsultaAccidenteDesde,
        EndAccidentDate: typeof $scope.formData.mConsultaAccidenteHasta === 'undefined' ? null : $scope.formData.mConsultaAccidenteHasta,
      };

      buscarCartas(paramsSearch);
  	}

    function downloadLetter(carta) {
      if (carta !== undefined) {
        if (carta.stateId === $scope.statusLetter.aprobado.code ||
          carta.stateId === $scope.statusLetter.liquidado.code ||
          carta.stateId === $scope.statusLetter.procesada.code &&
          (carta.stateId !== $scope.statusLetter.rechazada.code && vm.roleCode !== 'CLI')) {
          vm.pdfLetterURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.cgw +
                              'api/guaranteeletter/download/' + carta.codeCompany + '/' + carta.year + '/' + carta.number + '/' + carta.version + '/PDF');

          $timeout(function() {
            document.getElementById('frmDownloadLetter').submit();
          }, 500);
        }else if (carta.stateId === $scope.statusLetter.rechazada.code && vm.roleCode !== 'CLI') {
           vm.pdfLetterURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.cgw +
                            'api/guaranteeletter/reject/download/' + carta.codeCompany + '/' + carta.year + '/' + carta.number + '/' + carta.version + '/PDF');
           $timeout(function() {
            document.getElementById('frmDownloadLetter').submit();
          }, 500);
        }
      }

      $timeout(function() {
        document.getElementById('frmDownloadLetter').submit();
      }, 500);
    }

    function downloadLetterAll(carta) {
      vm.allURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.cgw + 'api/guaranteeletter/report');
      if ($scope.formData.mConsultaDesde > new Date(new Date().setHours(23,59,59,999)) ||
          $scope.formData.mConsultaHasta > new Date(new Date().setHours(23,59,59,999)) ) {
          mModalAlert.showError("Fecha no puede ser mayor a la fecha actual", "Error");
        } else {
           vm.paramsSearch = {
              CompanyId: typeof $scope.formData.mEmpresa.id === 'undefined' ? '' : $scope.formData.mEmpresa.id,
              StartDate: typeof $scope.formData.mConsultaDesde === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaDesde),
              EndDate: typeof $scope.formData.mConsultaHasta === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaHasta),
              AffiliateLastName: typeof $scope.formData.mApePaterno === 'undefined' ? '' : $scope.formData.mApePaterno.toUpperCase(),
              AffiliateLastName2: typeof $scope.formData.mApeMaterno === 'undefined' ? '' : $scope.formData.mApeMaterno.toUpperCase(),
              AffiliateName: typeof $scope.formData.mNombre === 'undefined' ? '' : $scope.formData.mNombre.toUpperCase(),
              // LetterNumber: typeof $scope.formData.mNroCarta === 'undefined' ? 0 : $scope.formData.mNroCarta,
              LetterNumber: !$scope.formData.mNroCarta ? 0 : $scope.formData.mNroCarta,
              AffiliateNumber: typeof $scope.formData.mNroAfiliado === 'undefined' ? 0 : $scope.formData.mNroAfiliado,
              ProviderId: typeof $scope.formData.mClinica === 'undefined' || typeof $scope.formData.mClinica.providerCode === 'undefined' ? 0 : $scope.formData.mClinica.providerCode,
              StateId: $scope.formData.mEstadoCarta.code === null ? 99 : $scope.formData.mEstadoCarta.code,
              ExecutiveId: $scope.formData.mEjecutivo.name === "-- SELECCIONE --" ? '' : $scope.formData.mEjecutivo.code,
              MedicCode: (typeof $scope.formData.mMedicoTratante === 'undefined') ? '' : ($scope.formData.mMedicoTratante.code) ? $scope.formData.mMedicoTratante.code : '',
              PageNumber: 1,
              PageSize: vm.pageSize,
              FlagDiagnostic: (typeof $scope.formData.mTipoBusqueda === 'undefined') ? '' : $scope.formData.mTipoBusqueda,
              ProductCode: (typeof $scope.formData.mProducto === 'undefined') ? '' : $scope.formData.mProducto.productCode,
              AssignedUser: (typeof $scope.formData.mEjecutivoAsignado === 'undefined') ? '' : $scope.formData.mEjecutivoAsignado.cod_usuario,
              BrokerCode: vm.roleCode !== constants.module.cgw.roles.broker.description ? 0 : vm.codigoBroker,
              AmputationIndicator:  (typeof $scope.formData.mAmputacion === 'undefined') ? null : $scope.formData.mAmputacion,
              StartAccidentDate: typeof $scope.formData.mConsultaAccidenteDesde === 'undefined' ? null : $scope.formData.mConsultaAccidenteDesde,
              EndAccidentDate: typeof $scope.formData.mConsultaAccidenteHasta === 'undefined' ? null : $scope.formData.mConsultaAccidenteHasta,
            };
        }
          const opcMenu = localStorage.getItem('currentBreadcrumb');
          const dataRequest = 'json=' + JSON.stringify( vm.paramsSearch );
          const urlRequest = constants.system.api.endpoints.cgw + 'api/guaranteeletter/report?COD_OBJETO=.&OPC_MENU=' + opcMenu;
          httpData.postDownload(
            urlRequest,
            dataRequest,
            {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded'}, responseType: 'arraybuffer'
            },
            true
          )
          .then(
            function ( data ){
              mainServices.fnDownloadFileBase64(data.file, data.mimeType, data.defaultFileName, true);
            }
          );


    }

    function enviarCarta(carta) {
      var paramsEnviarCarta = {
        CodeCompany: carta.codeCompany,
        Year: carta.year,
        Number: carta.number,
        Version: carta.version
      };

      cgwFactory.enviarCarta(paramsEnviarCarta, false).then(function(response) {
        filtrar();
       }, function(error) {
        carta.flagSentToClient = "";
        mModalAlert.showError(error.data.message, 'Error');
      });
  	}

    function verDetalle(carta) {
      $rootScope.formDataBkp = ng.copy($scope.formData);
      if (vm.roleId !== 1)
        $state.go('detalleConsultaAdmin', {id: carta.number, year: carta.year, version: carta.version, cia: carta.codeCompany, flag: 0, state: ''}, {reload: true, inherit: false});
      else
        $state.go('detalleConsultaClinica', {id: carta.number, year: carta.year, version: carta.version, cia: carta.codeCompany, flag: 0, state: ''}, {reload: true, inherit: false});
    }

    function getListDoctor (wilcar) {
      if (wilcar && wilcar.length >= 3) {
        var paramDoctor = {
          fName: wilcar.toUpperCase()
        };

        var defer = $q.defer();
        cgwFactory.getListDoctor(paramDoctor, false).then(function(response) {
          defer.resolve(response.data.items);
         }, function(error) {
          mModalAlert.showError(error.data.message, 'Error');
        });

        return defer.promise;
      }
    }

    vm.getRojo = function(item) {
      if (item !== undefined)
        return (item.stateId === $scope.statusLetter.rechazada.code || item.stateId === $scope.statusLetter.anulada.code);
    };

    vm.getVerde = function(item) {
      if (item !== undefined)
        return (item.stateId === $scope.statusLetter.auditoriaAdministrativa.code);
    };

    vm.getAmarillo = function(item) {
      if (item !== undefined)
        return (item.stateId === $scope.statusLetter.observada.code);
    };

    vm.getAzul = function(item) {
      if (item !== undefined)
        return (item.stateId === $scope.statusLetter.aprobado.code ||  item.stateId === $scope.statusLetter.procesada.code || item.stateId === $scope.statusLetter.enProcesoDeAuditoria.code);
    };

    vm.getBlanco = function(item) {
      if (item !== undefined)
        return (item.stateId === $scope.statusLetter.observacionLevantada.code ||
          item.stateId === $scope.statusLetter.auditado.code || item.stateId === $scope.statusLetter.enProcesoDeAuditoria.code);
    };

    vm.getTransparent = function(item) {
      if (item !== undefined)
        return (item.stateId === $scope.statusLetter.solicitado.code ||
                item.stateId === $scope.statusLetter.auditoriaEjecutivo.code);
    };

    vm.isRechazada = function(item) {
      if (item !== undefined)
        return (item.stateId === $scope.statusLetter.rechazada.code);
    };

    vm.showDownloadLetter = function(reporte) {
      if (reporte !== undefined) {
        return (reporte.stateId === $scope.statusLetter.aprobado.code || reporte.stateId === $scope.statusLetter.liquidado.code || reporte.stateId === $scope.statusLetter.procesada.code || reporte.stateId === $scope.statusLetter.rechazada.code && "CLI" !== vm.roleCode) && (reporte.stateId === $scope.statusLetter.rechazada.code && "CCG" === vm.roleCode && "1" === reporte.flagSentToClient || (reporte.stateId !== $scope.statusLetter.rechazada.code || "CCG" !== vm.roleCode || "1" === reporte.flagSentToClient)) && constants.module.cgw.roles.broker.description !== vm.roleCode
      }
    };

    vm.descargarReporte = function() {
      vm.disabledButton = true;
    };

    function compareTime(dateString, now) {
      if (new Date(dateString).getDate() !== now.getDate()) {
        localStorageService.remove('todayCGW');
        localStorageService.remove('formData');
      }
    }
    function getListExternalAudit() {
      cgwFactory.GetListMedicalAuditor().then(function (response) {
        if (response.data.items.length > 0) {
          vm.auditores = response.data.items;
        }
      });
    }

    vm.rolConsulta = function() {
      return (vm.roleCode === constants.module.cgw.roles.consulta.description ||
        vm.roleCode === constants.module.cgw.roles.coordinador.description);
    };

    vm.rolSupervisor = function() {
      return (vm.roleCode === constants.module.cgw.roles.supervisor.description);
    };

    vm.showAuditorExt = function() {
      if ($scope.formData.mEstadoCarta)
        return ($scope.formData.mEstadoCarta.code === 1 ||
          $scope.formData.mEstadoCarta.code === 5);
    };

    vm.rolEjecutivo = function() {
      return (vm.roleCode === constants.module.cgw.roles.ejecutivo.description);
    };

    vm.rolBroker = function () {
      return (vm.roleCode === constants.module.cgw.roles.broker.description);
    }

    vm.showAuditorExt = function() {
      if ($scope.formData.mEstadoCarta)
        return ($scope.formData.mEstadoCarta.code === 1 ||
          $scope.formData.mEstadoCarta.code === 5);
    };

    vm.loadProducts = function (idCompany) {
      if (vm.formData) {
        vm.formData.mProducto = undefined;
      }
      delete $scope.formData.mPlaca
      delete $scope.formData.mPoliza
      delete $scope.formData.mNroSinestro
      vm.productosCGW = [];
      if (idCompany) {
        cgwFactory.GetAllProductBy('SGA', idCompany).then(function(response) {
          // if (response.operationCode === constants.operationCode.success) {
          if (response.data) {
            vm.productosCGW = response.data;
          }else {
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
    };

    vm.setTab = function (tab) {
      vm.tab = tab;
    }

    var codeProductoSoat = 'O';
    var codeProductoAccPer = 'A';
    var propEmpresa = 'code';
    var propProduct = 'productCode';
    var codeMapfreSeguros = '000006G';
    function showInput(_productCode){
      return $scope.formData.mEmpresa  && $scope.formData.mEmpresa[propEmpresa] == codeMapfreSeguros
          && $scope.formData.mProducto && $scope.formData.mProducto[propProduct] == _productCode
    }
    function showInputPlaca(){
      return showInput(codeProductoSoat);
    }
    function showInputPoliza(){
      return showInput(codeProductoAccPer);
    }
    function showInputSiniestro(){
      return $scope.formData.mEmpresa && $scope.formData.mProducto  && $scope.formData.mEmpresa[propEmpresa] == codeMapfreSeguros &&
             ($scope.formData.mProducto[propProduct] == codeProductoSoat ||
              $scope.formData.mProducto[propProduct] == codeProductoAccPer)
    }
    function changeProducto(){
      if (!showInputPlaca())
        delete $scope.formData.mPoliza
      else if (!showInputPoliza())
        delete $scope.formData.mNroSinestro
    }
    vm.showInputPlaca = showInputPlaca;
    vm.showInputPoliza = showInputPoliza;
    vm.showInputSiniestro = showInputSiniestro;
    vm.changeProducto = changeProducto;
  } //  end controller

  function startFromGrid() {
      return function(input, start) {
        if (!input || !input.length) { return; }
        start = +start; //parse to int
        return input.slice(start);
      }
    }

  return ng.module('appCgw')
    .controller('CgwConsultaController', cgwConsultaController)
    .filter('startFromGrid', startFromGrid)
    .factory('loaderConsultaCGW', ['cgwFactory', '$q', function(cgwFactory, $q) {
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

      var ejecutivosAsignados;
      function initListEjecutivosAsignados() {
        var deferred = $q.defer();
        cgwFactory.GetAssigendExecutives(true).then(function(response) {
          if (response.data.length > 0) {
            ejecutivosAsignados = response.data;
            angular.forEach(ejecutivosAsignados, function(item){
              var fullname = item.nom_persona1 + " " + item.nom_persona2 + " " + item.ape_paterno + " " + item.ape_materno
              item.fullname = fullname.toUpperCase();
            });
            deferred.resolve(ejecutivosAsignados);
          } else {
            deferred.resolve([]);
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
        initListEjecutivosAsignados: function() {
          if (ejecutivosAsignados) return $q.resolve(ejecutivosAsignados);
          return initListEjecutivosAsignados();
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
