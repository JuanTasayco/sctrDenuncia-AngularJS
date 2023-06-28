'use strict';

define([
  'angular', 'constants',
  '/cgw/app/factory/cgwFactory.js'
], function(ng, constants) {

  altoCostoPacienteController.$inject = ['$scope', '$rootScope', 'cgwFactory', '$state', '$q','formularioEmpresas', 
    '$timeout', 'mModalAlert', '$sce', 'oimClaims', 'MxPaginador', 'localStorageService'];

  function altoCostoPacienteController($scope, $rootScope, cgwFactory, $state, $q, formularioEmpresas, 
    $timeout, mModalAlert, $sce, oimClaims, MxPaginador, localStorageService) {

    var vm = this;

    vm.pageSize = 10;
    vm.msgVacio = 'No se han encontrado registros con los filtros ingresados';
    vm.pageChanged = pageChanged;
    vm.mPagination = 1;
    vm.itemsXTanda = vm.pageSize * 4;

    var page;
    page = new MxPaginador();
    page.setNroItemsPorPagina(vm.pageSize);

    $scope.$on('$stateChangeSuccess', function(e, to, toParam, from, fromParam) {
      if (from.name === "detalleAltoCostoPaciente") {

        var object = JSON.parse(localStorageService.get("todayAltoCostoPaciente"));
        if (object) {
          var dateString = object.timestamp;
          var now = new Date();
          compareTime(dateString, now);
        }

        var value = localStorageService.get('formDataPaciente');
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
        var object2 = JSON.parse(localStorageService.get("todayAltoCostoPaciente"));
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
        $scope.showFilterEps = true;
        $scope.showRangeDates = true;
        $scope.formData.mConsultaDesde = cgwFactory.formatearFecha($scope.formData.mConsultaDesde);
        $scope.formData.mConsultaHasta = cgwFactory.formatearFecha($scope.formData.mConsultaHasta);

        // EPS
        $scope.formData.mGrupoEconomico = null;
        $scope.formData.mCliente = null;
        $scope.formData.mContrato = null;
        // Seguros
        $scope.formData.mRamo = null;
        $scope.formData.mModalidad = null;
        $scope.formData.mProducto = null;
        $scope.formData.mSubproducto = null;
        $scope.formData.mPolizaGrupo = null;
        $scope.formData.mContrato2 = null;
        $scope.formData.mSubcontrato = null;
        $scope.formData.mContratante = null;
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
          var object = JSON.parse(localStorageService.get("todayAltoCostoPaciente"));
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

      vm.tipoFechas = [
        { code: "2", description: "POR FECHA DE OCURRENCIA" },
        { code: "1", description: "POR FECHA DE LIQUIDACIÓN" }
      ];

      // Maestros
      vm.ramos = [
        { code: "114", description: "114 - SEGURO DE SALUD" },
        { code: "115", description: "115 - CENTROS MEDICOS" },
        { code: "116", description: "116 - SEGURO DE SALUD" }
      ];
      vm.empresas = formularioEmpresas;
      vm.contratos = [ { code: null, description: "--SELECCIONE--" } ];
      vm.modalidades = [ { code: null, description: "--SELECCIONE--" } ];
      vm.productos = [ { code: null, name: "--SELECCIONE--" } ];
      vm.subproductos = [ { code: null, description: "--SELECCIONE--" } ];
      vm.polizas = [ { code: null, description: "--SELECCIONE--" } ];
      vm.contratos2 = [ { code: null, description: "--SELECCIONE--" } ];
      vm.subcontratos = [ { code: null, description: "--SELECCIONE--" } ];
      //Calendario
      vm.open1 = open1;
      vm.open2 = open2;
      //Seleccionar combos
      vm.loadFilters = loadFilters;
      vm.loadTypeDate = loadTypeDate;
      vm.getContracts = getContracts;
      vm.loadDataFromBranch = loadDataFromBranch;
      vm.getProducts = getProducts;
      vm.getSubProducts = getSubProducts;
      vm.getContracts2 = getContracts2;
      vm.getSubContracts = getSubContracts;
      //Autocompletados
      vm.getListGroups = getListGroups;
      vm.getListClients = getListClients;
      vm.getListContratantes = getListContratantes;
      // Validar campos
      vm.validateDesde = validateDesde;
      vm.validateHasta = validateHasta;
      vm.validateHastaRango = validateHastaRango;
      vm.invalidFilters = invalidFilters;
      //Formulario
      vm.filtrar = filtrar;
      vm.limpiar = limpiar;
      //Descargar Reporte
      vm.downloadReport = downloadReport;
      // Ver Detalle
      vm.verDetalle = verDetalle;
    }

    function initData() {
      var value2 = localStorageService.get('formDataPaciente');
      if (!value2) {
        $scope.formData = {};
        $scope.showFilterEps = true;
        $scope.showRangeDates = true;
        $scope.formData.mConsultaDesde = cgwFactory.restarMes(new Date(), 12);
        $scope.formData.mConsultaHasta = new Date(new Date().setHours(23,59,59,999));
        $scope.formData.mRangoHasta = 12;
      } else {
        $scope.formData = value2;
        $scope.formData.mConsultaDesde  = new Date(new Date($scope.formData.mConsultaDesde).setHours(23,59,59,999));
        $scope.formData.mConsultaHasta  = new Date(new Date($scope.formData.mConsultaHasta).setHours(23,59,59,999));
        loadFilters($scope.formData.mEmpresa);
        loadTypeDate($scope.formData.mTipoFecha);
        getContracts();
        loadDataFromBranch();
        getProducts();
        getSubProducts();
        getContracts2();
        getSubContracts();
      }
    }

    function open1() {
      vm.popup1.opened = true;
    }

    function open2() {
      vm.popup2.opened = true;
    }

    function loadFilters (empresa) {
      $scope.showFilterEps = (empresa.id == 3);
    }

    function loadTypeDate(tipoFecha) {
      $scope.showRangeDates = (tipoFecha.code == "2");
    }

    function getListGroups(wilcar) {
      if (wilcar && wilcar.length >= 3) {
        var paramGrupoEconomico = {
          Text: wilcar.toUpperCase()
        };

        var defer = $q.defer();
        cgwFactory.GetAllEconomicsGroups(paramGrupoEconomico, false).then(function (response) {
          (response.data.items.length > 0) ? $scope.showGrupoError = false : $scope.showGrupoError = true;
          defer.resolve(response.data.items);
        });

        return defer.promise;
      } else {
        $scope.showGrupoError = false
      }
    }

    function getListClients(wilcar) {
      if (wilcar && wilcar.length >= 3) {
        var paramCliente = {
          Text: wilcar.toUpperCase(),
          Id: $scope.formData.mGrupoEconomico ? $scope.formData.mGrupoEconomico.code : 0
        };

        var defer = $q.defer();
        cgwFactory.GetClientsByEconomicGroup(paramCliente, false).then(function (response) {
          (response.data.items.length > 0) ? $scope.showClienteError = false : $scope.showClienteError = true;
          defer.resolve(response.data.items);
        });

        return defer.promise;
      } else {
        $scope.showClienteError = false;
      }
    }

    function getListContratantes(wilcar) {
      if (wilcar && wilcar.length >= 3) {
        var paramContratante = {
          Text: wilcar.toUpperCase(),
          Id: $scope.formData.mEmpresa.id
        };

        var defer = $q.defer();
        cgwFactory.GetContractor(paramContratante, false).then(function (response) {
          (response.data.items.length > 0) ? $scope.showContratanteError = false : $scope.showContratanteError = true;
          defer.resolve(response.data.items);
        });

        return defer.promise;
      } else {
        $scope.showContratanteError = false;
      }
    }

    function getContracts(){
      if($scope.formData.mCliente != null){
        var paramContrato = {
          Id: $scope.formData.mCliente.code
        }
        cgwFactory.GetContractByClient(paramContrato).then(function (response) {
          vm.contratos = response.data.items;
          vm.contratos.unshift( { code: null, description: "--SELECCIONE--" } );
        });
      }
    }

    function loadDataFromBranch(){
      if($scope.formData.mRamo != null){
        if($scope.formData.mRamo.code == 116) {
          getPolicies();
        } else {
          getModalities();
        }
      }      
    }

    function getModalities(){
      if($scope.formData.mRamo != null){
        $scope.formData.mProducto = null;
        $scope.formData.mSubproducto = null;
        $scope.formData.mPolizaGrupo = null;
        $scope.formData.mContrato2 = null;
        $scope.formData.mSubcontrato = null;   

        vm.productos = [ { code: null, name: "--SELECCIONE--" } ];
        vm.subproductos = [ { code: null, description: "--SELECCIONE--" } ];
        vm.polizas = [ { code: null, description: "--SELECCIONE--" } ];
        vm.contratos2 = [ { code: null, description: "--SELECCIONE--" } ];
        vm.subcontratos = [ { code: null, description: "--SELECCIONE--" } ];

        var paramModalidad = {
          Id: $scope.formData.mRamo.code
        }
        cgwFactory.GetModalityByBranch(paramModalidad).then(function (response) {
          vm.modalidades = response.data.items;
          vm.modalidades.unshift( { code: null, description: "--SELECCIONE--" } );
        });
      }
    }

    function getProducts(){
      if($scope.formData.mModalidad != null){
        $scope.formData.mProducto = null;
        $scope.formData.mSubproducto = null;
        vm.subproductos = [ { code: null, description: "--SELECCIONE--" } ];

        var paramProducto = {
          Id: $scope.formData.mModalidad.code
        }
        cgwFactory.GetProductByModality(paramProducto).then(function (response) {
          vm.productos = response.data.items;
          vm.productos.unshift( { code: null, name: "--SELECCIONE--" } );
        });
      }
    }

    function getSubProducts(){
      if($scope.formData.mProducto != null){
        $scope.formData.mSubproducto = null;

        var paramSubproducto = {
          Id: $scope.formData.mProducto.code
        }
        cgwFactory.GetSubProductByProduct(paramSubproducto).then(function (response) {
          vm.subproductos = response.data.items;
          vm.subproductos.unshift( { code: null, description: "--SELECCIONE--" } );
        });
      }
    }

    function getPolicies(){
      if($scope.formData.mRamo != null){
        $scope.formData.mModalidad = null;
        $scope.formData.mProducto = null;
        $scope.formData.mSubproducto = null;
        $scope.formData.mContrato2 = null;
        $scope.formData.mSubcontrato = null;

        vm.modalidades = [ { code: null, description: "--SELECCIONE--" } ];
        vm.productos = [ { code: null, name: "--SELECCIONE--" } ];
        vm.subproductos = [ { code: null, description: "--SELECCIONE--" } ];
        vm.contratos2 = [ { code: null, description: "--SELECCIONE--" } ];
        vm.subcontratos = [ { code: null, description: "--SELECCIONE--" } ];
        
        var paramPolizas = {
          Id: $scope.formData.mRamo.code
        }
        cgwFactory.GetPolicyByBranch(paramPolizas).then(function (response) {
          vm.polizas = response.data.items;
          vm.polizas.unshift( { code: null, description: "--SELECCIONE--" } );
        });
      }
    }

    function getContracts2(){
      if($scope.formData.mPolizaGrupo != null){
        $scope.formData.mContrato2 = null;
        $scope.formData.mSubcontrato = null;
        vm.subcontratos = [ { code: null, description: "--SELECCIONE--" } ];

        var paramContratos = {
          Id: $scope.formData.mPolizaGrupo.code
        }
        cgwFactory.GetContractByPolicy(paramContratos).then(function (response) {
          vm.contratos2 = response.data.items;
          vm.contratos2.unshift( { code: null, description: "--SELECCIONE--" } );
        });
      }
    }

    function getSubContracts(){
      if($scope.formData.mContrato2 != null){
        $scope.formData.mSubcontrato = null;

        var paramSubcontrato = {
          Id: $scope.formData.mContrato2.code
        }
        cgwFactory.GetSubContractByContract(paramSubcontrato).then(function (response) {
          vm.subcontratos = response.data.items;
          vm.subcontratos.unshift( { code: null, description: "--SELECCIONE--" } );
        });
      }
    }

    function validateDesde(date){
      $scope.showDesdeError = (date == '' || date == null);
    }

    function validateHasta(date){
      $scope.showHastaError = (date == '' || date == null);
    }

    function validateHastaRango(rango){
      $scope.showHastaRangoError = (rango == '' || rango == null);
    }

    function invalidFilters(){
      if($scope.formData.mTipoFecha){
        var tipoFechaCode = $scope.formData.mTipoFecha.code;
        if(tipoFechaCode == "2") return $scope.showDesdeError || $scope.showHastaError;
        if(tipoFechaCode == "1") return $scope.showHastaRangoError;
      }
      return false;
    }

    function filtrar() {
      if ($scope.formData.mConsultaDesde > $scope.formData.mConsultaHasta) {
          mModalAlert.showError("Verifique las fechas seleccionadas", "Error");
      } else {
        vm.paramsSearch = {
          StartDate: typeof $scope.formData.mConsultaDesde === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaDesde),
          EndDate: typeof $scope.formData.mConsultaHasta === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaHasta),
          TypeDate: typeof $scope.formData.mConsultaHasta === 'undefined' ? '' : $scope.formData.mTipoFecha.code,
          CompanyId: typeof $scope.formData.mEmpresa.id === 'undefined' ? '' : $scope.formData.mEmpresa.id,
          EconomicGroupId: $scope.formData.mGrupoEconomico === null || $scope.formData.mGrupoEconomico === undefined ? '0' : $scope.formData.mGrupoEconomico.code,
          BranchId: $scope.formData.mRamo.code === null ? '0' : $scope.formData.mRamo.code,
          ModalityId: $scope.formData.mModalidad.code === null ? '0' : $scope.formData.mModalidad.code,
          ProductCode: $scope.formData.mProducto.code === null ? '0' : $scope.formData.mProducto.code,
          SubproductCode: $scope.formData.mSubproducto.code === null ? '0' : $scope.formData.mSubproducto.code,
          GroupPolicy: $scope.formData.mPolizaGrupo.code === null ? '0' : $scope.formData.mPolizaGrupo.code,
          SubcontractNumber: $scope.formData.mSubcontrato.code === null ? '0' : $scope.formData.mSubcontrato.code,
          DocumentType: '0',
          DocumentCode: '0',
          PageNumber: 1,
          PageSize: vm.pageSize,
          Sequence: 1
        };
        
        vm.paramsSearch.ClientId = $scope.formData.mCliente === null || $scope.formData.mCliente === undefined ? '0' : $scope.formData.mCliente.code;
        vm.paramsSearch.ContractNumber = $scope.formData.mContrato.code === null ? '0' : $scope.formData.mContrato.code;
        if(!$scope.showFilterEps){
          vm.paramsSearch.DocumentType = $scope.formData.mContratante === null || $scope.formData.mContratante === undefined ? '0' : $scope.formData.mContratante.code.split('|')[0];
          vm.paramsSearch.DocumentCode = $scope.formData.mContratante === null || $scope.formData.mContratante === undefined ? '0' : $scope.formData.mContratante.code.split('|')[1];
          //vm.paramsSearch.ClientId = $scope.formData.mContratante === null || $scope.formData.mContratante === undefined ? '0' : $scope.formData.mContratante.code;
          vm.paramsSearch.ContractNumber = $scope.formData.mContrato2.code === null ? '0' : $scope.formData.mContrato2.code;
        }

        localStorageService.set('formDataPaciente', $scope.formData);
        var object = {value: "value", timestamp: new Date()};
        localStorageService.set('todayAltoCostoPaciente', JSON.stringify(object));
        buscarRegistros(vm.paramsSearch);
      }
    }

    function pageChanged(event) {
      vm.paramsSearch = {
        StartDate: typeof $scope.formData.mConsultaDesde === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaDesde),
        EndDate: typeof $scope.formData.mConsultaHasta === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaHasta),
        TypeDate: typeof $scope.formData.mConsultaHasta === 'undefined' ? '' : $scope.formData.mTipoFecha.code,
        CompanyId: typeof $scope.formData.mEmpresa.id === 'undefined' ? '' : $scope.formData.mEmpresa.id,
        EconomicGroupId: $scope.formData.mGrupoEconomico === null || $scope.formData.mGrupoEconomico === undefined ? '0' : $scope.formData.mGrupoEconomico.code,
        BranchId: $scope.formData.mRamo.code === null ? '0' : $scope.formData.mRamo.code,
        ModalityId: $scope.formData.mModalidad.code === null ? '0' : $scope.formData.mModalidad.code,
        ProductCode: $scope.formData.mProducto.code === null ? '0' : $scope.formData.mProducto.code,
        SubproductCode: $scope.formData.mSubproducto.code === null ? '0' : $scope.formData.mSubproducto.code,
        GroupPolicy: $scope.formData.mPolizaGrupo.code === null ? '0' : $scope.formData.mPolizaGrupo.code,
        SubcontractNumber: $scope.formData.mSubcontrato.code === null ? '0' : $scope.formData.mSubcontrato.code,
        DocumentType: '0',
        DocumentCode: '0',
        PageSize: vm.pageSize,
        Sequence: 2
      };
      vm.paramsSearch.ClientId = $scope.formData.mCliente === null || $scope.formData.mCliente === undefined ? '0' : $scope.formData.mCliente.code;
      vm.paramsSearch.ContractNumber = $scope.formData.mContrato.code === null ? '0' : $scope.formData.mContrato.code;
      if(!$scope.showFilterEps){
        vm.paramsSearch.DocumentType = $scope.formData.mContratante === null || $scope.formData.mContratante === undefined ? '0' : $scope.formData.mContratante.code.split('|')[0];
        vm.paramsSearch.DocumentCode = $scope.formData.mContratante === null || $scope.formData.mContratante === undefined ? '0' : $scope.formData.mContratante.code.split('|')[1];
        //vm.paramsSearch.ClientId = $scope.formData.mContratante === null || $scope.formData.mContratante === undefined ? '0' : $scope.formData.mContratante.code;
        vm.paramsSearch.ContractNumber = $scope.formData.mContrato2.code === null ? '0' : $scope.formData.mContrato2.code;
      }

      vm.paramsSearch.PageNumber = event;
      buscarRegistros(vm.paramsSearch);
    }

    function buscarRegistros(paramsSearch) {
      if (!paramsSearch.StartDate && !$scope.formData.mConsultaDesde) {
        $scope.formData.mConsultaDesde = cgwFactory.restarMes(new Date(), 12);
        paramsSearch.StartDate = cgwFactory.restarMes(new Date(), 12);
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

      cgwFactory.buscarAltoCostoPaciente(paramsSearch).then(function(response) {
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
      $scope.showFilterEps = true;
      $scope.showRangeDates = true;
      vm.contratos = [ { code: null, description: "--SELECCIONE--" } ];
      vm.modalidades = [ { code: null, description: "--SELECCIONE--" } ];
      vm.productos = [ { code: null, name: "--SELECCIONE--" } ];
      vm.subproductos = [ { code: null, description: "--SELECCIONE--" } ];
      vm.polizas = [ { code: null, description: "--SELECCIONE--" } ];
      vm.contratos2 = [ { code: null, description: "--SELECCIONE--" } ];
      vm.subcontratos = [ { code: null, description: "--SELECCIONE--" } ];
      $scope.formData.mEmpresa = { id:3, code: "060027A", description: "MAPFRE PERU EPS" } ;
      $scope.formData.mTipoFecha = { code: "2", description: "POR FECHA DE OCURRENCIA" };
      $scope.formData.mConsultaDesde = cgwFactory.restarMes(new Date(), 12);
      $scope.formData.mConsultaHasta = new Date(new Date().setHours(23,59,59,999));
      $scope.formData.mRangoHasta = 12;
      // EPS
      $scope.formData.mGrupoEconomico = null;
      $scope.formData.mCliente = null;
      $scope.formData.mContrato = null;
      // Seguros
      $scope.formData.mRamo = null;
      $scope.formData.mModalidad = null;
      $scope.formData.mProducto = null;
      $scope.formData.mSubproducto = null;
      $scope.formData.mPolizaGrupo = null;
      $scope.formData.mContrato2 = null;
      $scope.formData.mSubcontrato = null;
      $scope.formData.mContratante = null;

      vm.totalItems = 0;
      vm.totalPages = 0;
      vm.noResult = true;

      localStorageService.remove('formDataPaciente');
    }

    function downloadReport() {
      if ($scope.formData.mConsultaDesde > new Date(new Date().setHours(23,59,59,999)) ||
          $scope.formData.mConsultaHasta > new Date(new Date().setHours(23,59,59,999)) ) {
        mModalAlert.showError("Fecha no puede ser mayor a la fecha actual", "Error");
      } else {
        vm.paramsSearch = {
          StartDate: typeof $scope.formData.mConsultaDesde === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaDesde),
          EndDate: typeof $scope.formData.mConsultaHasta === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaHasta),
          TypeDate: typeof $scope.formData.mConsultaHasta === 'undefined' ? '' : $scope.formData.mTipoFecha.code,
          CompanyId: typeof $scope.formData.mEmpresa.id === 'undefined' ? '' : $scope.formData.mEmpresa.id,
          EconomicGroupId: $scope.formData.mGrupoEconomico === null || $scope.formData.mGrupoEconomico === undefined ? '0' : $scope.formData.mGrupoEconomico.code,
          BranchId: $scope.formData.mRamo.code === null ? '0' : $scope.formData.mRamo.code,
          ModalityId: $scope.formData.mModalidad.code === null ? '0' : $scope.formData.mModalidad.code,
          ProductCode: $scope.formData.mProducto.code === null ? '0' : $scope.formData.mProducto.code,
          SubproductCode: $scope.formData.mSubproducto.code === null ? '0' : $scope.formData.mSubproducto.code,
          GroupPolicy: $scope.formData.mPolizaGrupo.code === null ? '0' : $scope.formData.mPolizaGrupo.code,
          SubcontractNumber: $scope.formData.mSubcontrato.code === null ? '0' : $scope.formData.mSubcontrato.code,
          DocumentType: '0',
          DocumentCode: '0',
          PageNumber: 1,
          PageSize: 100 //vm.totalItems
        };
        vm.paramsSearch.ClientId = $scope.formData.mCliente === null || $scope.formData.mCliente === undefined ? '0' : $scope.formData.mCliente.code;
        vm.paramsSearch.ContractNumber = $scope.formData.mContrato.code === null ? '0' : $scope.formData.mContrato.code;
        if(!$scope.showFilterEps){
          vm.paramsSearch.DocumentType = $scope.formData.mContratante === null || $scope.formData.mContratante === undefined ? '0' : $scope.formData.mContratante.code.split('|')[0];
          vm.paramsSearch.DocumentCode = $scope.formData.mContratante === null || $scope.formData.mContratante === undefined ? '0' : $scope.formData.mContratante.code.split('|')[1];
          //vm.paramsSearch.ClientId = $scope.formData.mContratante === null || $scope.formData.mContratante === undefined ? '0' : $scope.formData.mContratante.code;
          vm.paramsSearch.ContractNumber = $scope.formData.mContrato2.code === null ? '0' : $scope.formData.mContrato2.code;
        }

        vm.allURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.cgw + 'api/highcosts/pacients/report');
        vm.allData = vm.paramsSearch

        // $timeout(function() {
        //   document.getElementById('frmDownloadAll').submit();
        // }, 500);

        cgwFactory.buscarAltoCostoPaciente(vm.paramsSearch).then(function(response) {
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

    function verDetalle(reporte) {
      $rootScope.formDataBkp = ng.copy($scope.formData);
      $state.go('detalleAltoCostoPaciente', {cia: reporte.codCia, afiliado: reporte.codPaciente, contrato: reporte.numContrato, plan: reporte.codPlan}, {reload: true, inherit: false});
    }

    function compareTime(dateString, now) {
      if (new Date(dateString).getDate() !== now.getDate()) {
        localStorageService.remove('todayAltoCostoPaciente');
        localStorageService.remove('formDataPaciente');
      }
    }

    vm.rolConsulta = function() {
      return (vm.roleCode === constants.module.cgw.roles.consulta.description);
    }

    vm.rolSupervisor = function() {
      return (vm.roleCode === constants.module.cgw.roles.supervisor.description);
    }

    vm.rolEjecutivo = function() {
      return (vm.roleCode === constants.module.cgw.roles.ejecutivo.description);
    }

  }//  end controller

  return ng.module('appCgw')
    .controller('AltoCostoPacienteController', altoCostoPacienteController)
    .factory('loaderAltoCostoPaciente', ['cgwFactory', '$q', function(cgwFactory, $q) {
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
