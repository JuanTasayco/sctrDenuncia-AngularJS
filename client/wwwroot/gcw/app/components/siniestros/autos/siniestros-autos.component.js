define([
  'angular', 'constants', 'moment', 'lodash',
  '/gcw/app/factory/gcwFactory.js'
], function(ng, constants, moment, _) {

  SiniestrosAutosController.$inject = ['$scope', 'gcwFactory', '$state', 'mModalAlert', '$rootScope', '$timeout', '$sce', 'MxPaginador', 'CommonCboService'];
  function SiniestrosAutosController($scope, gcwFactory, $state, mModalAlert, $rootScope, $timeout, $sce, MxPaginador, CommonCboService) {
    var vm = this;
    var page;

    vm.$onInit = function(){

      $rootScope.currentURL = $state.current.url;
      $rootScope.$broadcast('comprobanteRemitido');
      $rootScope.$broadcast('anuladasPorDeuda');
      $rootScope.$broadcast('dashboard');
      $rootScope.$broadcast('networkInit');
      $rootScope.$broadcast('msgSinResultados');

      vm.formSiniestro = {};
      vm.formSiniestro.mOpcionTipoBusqueda = "1";
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");

      $scope.gLblContratanteAsegurado = "Por contratante/asegurado";
      $scope.gLblPoliza = "Nro. Póliza";
      $scope.gLblPlaca = "Nro. Placa";
      $scope.gLblSiniestro = "Nro. Siniestro";

      vm.format = 'dd/MM/yyyy';

      vm.currentPage = 1; // El paginador selecciona el nro 1
      vm.itemsXPagina = 10;
      vm.itemsXTanda = vm.itemsXPagina * 10;
      vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
      page = new MxPaginador();
      page.setNroItemsPorPagina(vm.itemsXPagina);

      lstEstados();
      lstTipo();

      $rootScope.preLocPoliza = undefined;

      if(!ng.isUndefined($rootScope.preLocSiniestro)){

        var formSession = {};
        formSession = gcwFactory.getVariableSession("formSession");

        vm.formSiniestro.mTipoCliente = {};
        vm.formSiniestro.mTipoCliente.value = formSession.mTipoCliente;
        vm.formSiniestro.mNroSiniestro = formSession.mNroSiniestro;

        vm.formSiniestro.mOpcionTipoBusqueda = formSession.mOpcionTipoBusqueda;
        vm.formSiniestro.mFechaDesde = new Date(formSession.mFechaDesde);
        vm.formSiniestro.mFechaHasta = new Date(formSession.mFechaHasta);

        if(vm.formSiniestro.mOpcionTipoBusqueda == "2")
          vm.formSiniestro.mNroPoliza = formSession.mNroPoliza;

        if(vm.formSiniestro.mOpcionTipoBusqueda == "3")
          vm.formSiniestro.mNroPlaca = formSession.mNroPlaca;

        if(vm.formSiniestro.mOpcionTipoBusqueda == "4")
          vm.formSiniestro.mNroSiniestro = formSession.mNroSiniestro;

        vm.formSiniestro.Estado = {};
        vm.formSiniestro.Estado.value = formSession.estado;

        //data obtenida en la busq
        var res = gcwFactory.getVariableSession("dataSession");
        vm.siniestros = res.list;
        vm.totalRows = res.totalRows;

        vm.itemsXPagina = 10;
        vm.itemsXTanda = vm.itemsXPagina * 10;
        vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
        page = new MxPaginador();
        page.setNroItemsPorPagina(vm.itemsXPagina);
        page.setNroTotalRegistros(vm.totalRows).setDataActual(vm.siniestros).setConfiguracionTanda();
            setLstCurrentPage();

        $rootScope.preLocSiniestro = undefined;

      }else{
        vm.totalRows = 0;

        vm.today = new Date();
        vm.formSiniestro.mFechaDesde = moment().subtract(6, 'months').toDate();
        vm.formSiniestro.mFechaHasta = ng.copy(vm.today);

        limpiar();
      }

    }

    vm.buscar = buscar;
    vm.getListaSiniestros = getListaSiniestros;
    vm.getParams = getParams;
    vm.limpiar = limpiar;
    vm.getFormSession = getFormSession;
    vm.pageChanged = pageChanged;
    vm.irDetalleSiniestro = irDetalleSiniestro;

    function lstTipo(){
      gcwFactory.getListTipoCliente(false).then(
        function glpPs(req){
          vm.lstTipo = req.data;
        });
    }

    function lstEstados(){
      gcwFactory.getListEstadoSiniestros(false).then(
        function glpPr(res){
          vm.lstEstado = res.data;
        });
    }

    function getFormSession(){
      vm.formSession = {}; //init vacio para cada vez q se hace una busqueda
      vm.formSession = {
        mOpcionTipoBusqueda : vm.formSiniestro.mOpcionTipoBusqueda,
        mTipoCliente : vm.formSiniestro.mTipoCliente.value,
        mNroPoliza : vm.formSiniestro.mNroPoliza,
        mNroPlaca : vm.formSiniestro.mNroPlaca,
        mNroSiniestro : vm.formSiniestro.mNroSiniestro,
        estado : vm.formSiniestro.Estado.value,
        mFechaDesde : vm.formSiniestro.mFechaDesde,
        mFechaHasta : vm.formSiniestro.mFechaHasta
      }
      return vm.formSession;
    }

    function buscar(){

      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");

      var sessionAgente = gcwFactory.getVariableSession('rolSessionA');
      var sessionGestor = gcwFactory.getVariableSession('rolSessionG');

      if(!ng.isUndefined($rootScope.preLocSiniestro)){
        vm.rol = gcwFactory.getVariableSession('rolSession');
        vm.rol.agenteID = (ng.isUndefined(sessionAgente.id)) ? $rootScope.cabecera.agente.id : sessionAgente.id;
        vm.rol.gestorID = (ng.isUndefined(sessionGestor.id)) ? $rootScope.cabecera.gestor.id : sessionGestor.id;
      }else{
        //vm.rol = obtenerAgente();
        vm.rol = gcwFactory.obtenerAgente(vm.dataTicket);
      }

      vm.currentPage = 1;
      var params = getParams();

      if(gcwFactory.diasTranscurridos(vm.formSiniestro.mFechaDesde, vm.formSiniestro.mFechaHasta) < 0){
        mModalAlert.showInfo("El rango de fechas no debe ser negativo", "Siniestros Autos", "", "", "", "g-myd-modal");
      }else if(!gcwFactory.evaluarRango(vm.formSiniestro.mFechaDesde, vm.formSiniestro.mFechaHasta)){
        mModalAlert.showInfo("El rango de fechas no debe exceder los 6 meses", "Siniestros Autos", "", "", "", "g-myd-modal");
      }else{
        switch(vm.formSiniestro.mOpcionTipoBusqueda.toString()){
          case "1": //cliente
            if(!vm.rol.agenteID || vm.rol.agenteID == 0){
              mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Siniestros Autos", "", "", "", "g-myd-modal");
            }else{
              params = _.assign({}, getParams(), {
                typeClient: (vm.formSiniestro.mTipoCliente.value == null) ? 0 : vm.formSiniestro.mTipoCliente.value,
                policyNumber: "0",
                documentType: (ng.isUndefined(vm.formSiniestro.Cliente)) ? "" : vm.formSiniestro.Cliente.documentType,
                documentNumber: (ng.isUndefined(vm.formSiniestro.Cliente)) ? "" : vm.formSiniestro.Cliente.documentNumber,
                plateNumber: "",
                sinisterNumber: 0,
              });
              page.setCurrentTanda(vm.currentPage);
              getListaSiniestros(params);
            }
          break;
          case "2": //poliza
            if(!vm.rol.agenteID || vm.rol.agenteID == 0){
              mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Siniestros Autos", "", "", "", "g-myd-modal");
            }else{
              if(vm.formSiniestro.mNroPoliza == "" || ng.isUndefined(vm.formSiniestro.mNroPoliza)){
                mModalAlert.showInfo("Ingrese un número de póliza para iniciar la consulta", "Siniestros Autos", "", "", "", "g-myd-modal");
              }else{
                params = _.assign({}, getParams(), {
                  typeClient: "",
                  policyNumber: vm.formSiniestro.mNroPoliza,
                  documentType: "",
                  documentNumber: "",
                  plateNumber: "",
                  sinisterNumber: 0,
                });
                page.setCurrentTanda(vm.currentPage);
                getListaSiniestros(params);
              }
            }
          break;
          case "3": //placa
            if(!vm.rol.agenteID || vm.rol.agenteID == 0){
              mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Siniestros Autos", "", "", "", "g-myd-modal");
            }else{
              if(vm.formSiniestro.mNroPlaca == "" || ng.isUndefined(vm.formSiniestro.mNroPlaca)){
                mModalAlert.showInfo("Ingrese una placa para iniciar la consulta", "Siniestros Autos", "", "", "", "g-myd-modal");
              }else{
                params = _.assign({}, getParams(), {
                  typeClient: "",
                  policyNumber: "0",
                  documentType: "",
                  documentNumber: "",
                  plateNumber: vm.formSiniestro.mNroPlaca,
                  sinisterNumber: 0,
                });
                page.setCurrentTanda(vm.currentPage);
                getListaSiniestros(params);
              }
            }
          break;
          case "4": //siniestro
            if(!vm.rol.agenteID || vm.rol.agenteID == 0){
              mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Siniestros Autos", "", "", "", "g-myd-modal");
            }else{
              if(vm.formSiniestro.mNroSiniestro == "" || ng.isUndefined(vm.formSiniestro.mNroSiniestro)){
                mModalAlert.showInfo("Ingrese un siniestro para iniciar la consulta", "Siniestros Autos", "", "", "", "g-myd-modal");
              }else{
                params = _.assign({}, getParams(), {
                  typeClient: "",
                  policyNumber: "0",
                  documentType: "",
                  documentNumber: "",
                  plateNumber: "",
                  sinisterNumber: vm.formSiniestro.mNroSiniestro,
                });
                page.setCurrentTanda(vm.currentPage);
                getListaSiniestros(params);
              }
            }
          break;
        }
      }
    }

    function getParams(){
      vm.currentPage = 1;

      var sessionAgente = gcwFactory.getVariableSession('rolSessionA');
      var sessionGestor = gcwFactory.getVariableSession('rolSessionG');
      if(!ng.isUndefined($rootScope.preLocSiniestro)){
        vm.rol = {};
        vm.rol.agenteID = sessionAgente.id;
        vm.rol.gestorID = sessionGestor.id;
      }else{
        vm.rol = gcwFactory.obtenerAgente(vm.dataTicket);
      }

      return {
        branchId: 0,
        dateStart: gcwFactory.formatearFecha(vm.formSiniestro.mFechaDesde),
        dateEnd: gcwFactory.formatearFecha(vm.formSiniestro.mFechaHasta),
        stateSinister: (vm.formSiniestro.Estado.value == null) ? "" : vm.formSiniestro.Estado.value,
        agentId: vm.rol.agenteID,
        ManagerId: vm.rol.gestorID,
        RowByPage: vm.itemsXTanda,
        CurrentPage: vm.currentPage
      };

    }

    function getListaSiniestros(params){
      gcwFactory.getListSiniestrosAutos(params, true).then(
        function(response) {
          if (response.data) {

            if(response.data.list.length > 0){
              vm.siniestros = response.data.list;

              //almacenar (storage) data.list obtenida por la consulta
              //para tenerla en caso se "regrese" desde detalle poliza

              vm.totalRows = response.data.totalRows;
              vm.totalPages = response.data.totalPages;
              vm.noResult = false;
              gcwFactory.addVariableSession('dataSession', response.data);

              if(vm.formSiniestro.mOpcionTipoBusqueda == "2"){

                $rootScope.codeAgent = (vm.siniestros[0].agentId == 0) ? "" : vm.siniestros[0].agentId;
                $rootScope.nameAgent = (vm.siniestros[0].agentDescription == undefined) ? "" : vm.siniestros[0].agentDescription;

                  $rootScope.codeManager = vm.siniestros[0].managerId;
                  $rootScope.descriptionManager = vm.siniestros[0].managerDescription;

                  $rootScope.polizaAnulada = vm.formDataCartera.mOpcionTipoBusqueda;
                  $rootScope.$broadcast('anuladasPorDeuda');

              }else{
                $rootScope.codeAgent = undefined;
                $rootScope.nameAgent = undefined;
                $rootScope.codeManager = undefined;
                $rootScope.descriptionManager = undefined;
              }

            }else{
              vm.siniestros = [];
              vm.totalRows = 0;
              vm.totalPages = 0;
              vm.noResult = true;
              vm.firstSearch = true;
            }
          }else{
            vm.siniestros = [];
            vm.totalRows = 0;
            vm.totalPages = 0;
            vm.noResult = true;
            vm.firstSearch = true;
            //$rootScope.polizaAnulada = "1";
            $rootScope.$broadcast('anuladasPorDeuda');
          }
          page.setNroTotalRegistros(vm.totalRows).setDataActual(vm.siniestros).setConfiguracionTanda();
          setLstCurrentPage();
       }, function(error){
            //mModalAlert.showError(error.data.data.message, "Error");
      });
    }

    function setLstCurrentPage() {
      vm.siniestros = page.getItemsDePagina();
    }

    function pageChanged(event){

      var sessionAgente = gcwFactory.getVariableSession('rolSessionA');
      var sessionGestor = gcwFactory.getVariableSession('rolSessionG');

      if(!ng.isUndefined($rootScope.preLocPoliza)){
        //vm.rol = gcwFactory.getVariableSession('rolSession');
        vm.rol = {};
        vm.rol.agenteID = sessionAgente.id;
        vm.rol.gestorID = sessionGestor.id;
      }else{
        //vm.rol = obtenerAgente();
        vm.rol = gcwFactory.obtenerAgente(vm.dataTicket);
      }

      var params;
      switch(vm.formSiniestro.mOpcionTipoBusqueda.toString()){
        case "1": //cliente
          params = {
            typeClient: (vm.formSiniestro.mTipoCliente.value == null) ? 0 : vm.formSiniestro.mTipoCliente.value,
            policyNumber: "0",
            documentType: (ng.isUndefined(vm.formSiniestro.Cliente)) ? "" : vm.formSiniestro.Cliente.documentType,
            documentNumber: (ng.isUndefined(vm.formSiniestro.Cliente)) ? "" : vm.formSiniestro.Cliente.documentNumber,
            plateNumber: "",
            sinisterNumber: 0,
            branchId: 0,
            dateStart: gcwFactory.formatearFecha(vm.formSiniestro.mFechaDesde),
            dateEnd: gcwFactory.formatearFecha(vm.formSiniestro.mFechaHasta),
            stateSinister: (vm.formSiniestro.Estado.value == null) ? "" : vm.formSiniestro.Estado.value,
            agentId: vm.rol.agenteID,
            ManagerId: vm.rol.gestorID,
            RowByPage: vm.itemsXTanda
          };
          page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda) {
          params.CurrentPage = nroTanda;
          getListaSiniestros(params);
            }, setLstCurrentPage);
        break;
        case "2": //poliza
          params = {
            typeClient: "",
            policyNumber: vm.formSiniestro.mNroPoliza,
            documentType: "",
            documentNumber: "",
            plateNumber: "",
            sinisterNumber: 0,
            branchId: 0,
            dateStart: gcwFactory.formatearFecha(vm.formSiniestro.mFechaDesde),
            dateEnd: gcwFactory.formatearFecha(vm.formSiniestro.mFechaHasta),
            stateSinister: (vm.formSiniestro.Estado.value == null) ? "" : vm.formSiniestro.Estado.value,
            agentId: vm.rol.agenteID,
            ManagerId: vm.rol.gestorID,
            RowByPage: vm.itemsXTanda
          };
          page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda) {
            params.CurrentPage = nroTanda;
            getListaSiniestros(params);
          }, setLstCurrentPage);
        break;
        case "3": //placa
          params = {
            typeClient: "",
            policyNumber: "0",
            documentType: "",
            documentNumber: "",
            plateNumber: vm.formSiniestro.mNroPlaca,
            sinisterNumber: 0,
            branchId: 0,
            dateStart: gcwFactory.formatearFecha(vm.formSiniestro.mFechaDesde),
            dateEnd: gcwFactory.formatearFecha(vm.formSiniestro.mFechaHasta),
            stateSinister: (vm.formSiniestro.Estado.value == null) ? "" : vm.formSiniestro.Estado.value,
            agentId: vm.rol.agenteID,
            ManagerId: vm.rol.gestorID,
            RowByPage: vm.itemsXTanda
          };
          page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda) {
            params.CurrentPage = nroTanda;
            getListaSiniestros(params);
          }, setLstCurrentPage);
        break;
        case "4": //siniestro
          params = {
            typeClient: "",
            policyNumber: "0",
            documentType: "",
            documentNumber: "",
            plateNumber: "",
            sinisterNumber: vm.formSiniestro.mNroSiniestro,
            branchId: 0,
            dateStart: gcwFactory.formatearFecha(vm.formSiniestro.mFechaDesde),
            dateEnd: gcwFactory.formatearFecha(vm.formSiniestro.mFechaHasta),
            stateSinister: (vm.formSiniestro.Estado.value == null) ? "" : vm.formSiniestro.Estado.value,
            agentId: vm.rol.agenteID,
            ManagerId: vm.rol.gestorID,
            RowByPage: vm.itemsXTanda
          };
          page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda) {
            params.CurrentPage = nroTanda;
            getListaSiniestros(params);
          }, setLstCurrentPage);
        break;
      }

    }

    $scope.exportar = function(){

     vm.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw+ 'api/sinister/car/download');
      switch(vm.formSiniestro.mOpcionTipoBusqueda.toString()){
        case "1":
          vm.downloadFile = _.assign({}, getParams(), {
            typeClient: (vm.formSiniestro.mTipoCliente.value == null) ? 0 : vm.formSiniestro.mTipoCliente.value,
            policyNumber: "0",
            documentType: (ng.isUndefined(vm.formSiniestro.Cliente)) ? "" : vm.formSiniestro.Cliente.documentType,
            documentNumber: (ng.isUndefined(vm.formSiniestro.Cliente)) ? "" : vm.formSiniestro.Cliente.documentNumber,
            plateNumber: "",
            sinisterNumber: 0,
            userCode: vm.dataTicket.userCode
          });
        break;
        case "2":
          vm.downloadFile = _.assign({}, getParams(), {
            typeClient: 0,
            policyNumber: vm.formSiniestro.mNroPoliza,
            documentType: "",
            documentNumber: "",
            plateNumber: "",
            sinisterNumber: 0,
            userCode: vm.dataTicket.userCode
          });
        break;
        case "3":
          vm.downloadFile = _.assign({}, getParams(), {
            typeClient: 0,
            policyNumber: "0",
            documentType: "",
            documentNumber: "",
            plateNumber: vm.formSiniestro.mNroPlaca,
            sinisterNumber: 0,
            userCode: vm.dataTicket.userCode
          });
        break;
        case "4":
          vm.downloadFile = _.assign({}, getParams(), {
            typeClient: 0,
            policyNumber: "0",
            documentType: "",
            documentNumber: "",
            plateNumber: "",
            sinisterNumber: vm.formSiniestro.mNroSiniestro,
            userCode: vm.dataTicket.userCode
          });
        break;
      }
      $timeout(function() {
        document.getElementById('frmExport').submit();
      }, 500);
    }

    function irDetalleSiniestro(siniestro){
      vm.formSiniestro.siniestroDetail = siniestro;

      if(siniestro.validateDetail == 'S'){
        gcwFactory.getValidatePolicy(siniestro.policyNumber, vm.dataTicket.roleType, '0', true).then(
            function(response) {
              mModalAlert.showInfo(response.data.description, "Siniestros: Autos", "", "", "", "g-myd-modal").then(function(response){

          }, function(error){

          });
        });
      }else{
        $state.go('consulta.siniestroAutoDetalle', {id:siniestro.policyNumber}, {reload: false, inherit: false});

        gcwFactory.addVariableSession("siniestroDetail", vm.formSiniestro.siniestroDetail);
        gcwFactory.addVariableSession('formSession', getFormSession());
        gcwFactory.addVariableSession('rolSession', vm.rol);

        //gcwFactory.addVariableSession('dataSession', vm.polizas);
        gcwFactory.addVariableSession('cabeceraSession', $rootScope.cabecera);
      }
    }

    function limpiar(){

      $rootScope.$emit('cliente:borrar');

      vm.formSiniestro.Cliente = undefined;

      vm.formSiniestro.mOpcionTipoBusqueda = "1";
      vm.formSiniestro.mTipoCliente = null;
      vm.formSiniestro.mNroPoliza = "";
      vm.formSiniestro.mNroPlaca = "";
      vm.formSiniestro.mNroSiniestro = "";
      vm.formSiniestro.Estado = null;

      vm.today = new Date();
      vm.formSiniestro.mFechaDesde = moment().subtract(6, 'months').toDate();
      vm.formSiniestro.mFechaHasta = ng.copy(vm.today);

      vm.siniestros = null;
      vm.totalRows = 0;
      vm.totalPages = 0;
      gcwFactory.cleanStorage();
    }

  } // end controller

  return ng.module('appGcw')
    .controller('SiniestrosAutosController', SiniestrosAutosController)
    .component('gcwSiniestrosAutos', {
      templateUrl: '/gcw/app/components/siniestros/autos/siniestros-autos.html',
      controller: 'SiniestrosAutosController',
      controllerAs: 'vm',
      bindings: {
      }
    });
});
