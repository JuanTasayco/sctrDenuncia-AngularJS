define([
  'angular', 'constants', 'lodash', '/gcw/app/factory/gcwFactory.js'
], function(ng, constants, _) {

  RenovacionesController.$inject = ['$scope', 'gcwFactory', '$state', 'mModalAlert', '$rootScope', '$timeout', '$sce', 'MxPaginador', '$uibModal'];

  function RenovacionesController($scope, gcwFactory, $state, mModalAlert, $rootScope, $timeout, $sce, MxPaginador, $uibModal) {

    var vm = this;
    var page;

    vm.$onInit = function() {

      $rootScope.currentURL = $state.current.url;
      $rootScope.$broadcast('comprobanteRemitido');
      $rootScope.$broadcast('dashboard');
      $rootScope.$broadcast('networkInit');
      $rootScope.$broadcast('msgSinResultados');

      $rootScope.polizaAnulada = "1";
      $rootScope.$broadcast('anuladasPorDeuda');

      vm.formRenovaciones = {};
      vm.currentPage = 1; // El paginador selecciona el nro 1
      vm.itemsXPagina = 10;
      vm.itemsXTanda = vm.itemsXPagina * 10;
      vm.format = 'dd/MM/yyyy'; //fechas
      vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
      page = new MxPaginador();
      page.setNroItemsPorPagina(vm.itemsXPagina);
      vm.renovaciones = null;
      vm.pageChanged = pageChanged; //paginacion
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");

      vm.totalPages = 0;
      vm.totalRows = 0;

      vm.formRenovaciones.mOpcionTipoBusqueda = 1;

      vm.formFilterRenovaciones = {};
      vm.formFilterRenovaciones.Sector = {};
      vm.formFilterRenovaciones.Sector.code = null;

      lstSectores();
      //lstRamos(vm.formFilterRenovaciones.Sector.code);
      lstEstadosCCC();
      lstEstadosR();
      lstSegmentation();

      vm.firstLoadAgent = firstLoadAgent;

      vm.obtenerAgente = obtenerAgente;

      lstAnios();
      lstMeses();

      vm.calculaMeses = calculaMeses;

      var actual = new Date();
      vm.formRenovaciones.mConsultaDesdeA = {};
      vm.formRenovaciones.mConsultaHastaA = {};
      vm.formRenovaciones.mConsultaDesdeM = {};
      vm.formRenovaciones.mConsultaHastaM = {};

      vm.formRenovaciones.mConsultaDesdeA.value = actual.getFullYear();
      vm.formRenovaciones.mConsultaHastaA.value = actual.getFullYear();

      if((actual.getMonth()+1) < 10){
        vm.formRenovaciones.mConsultaDesdeM.value = '0'+(actual.getMonth()+1);
        vm.formRenovaciones.mConsultaHastaM.value = '0'+(actual.getMonth()+1);
      }
      else{
        vm.formRenovaciones.mConsultaDesdeM.value = actual.getMonth()+1;
        vm.formRenovaciones.mConsultaHastaM.value = actual.getMonth()+1;
      }

      $timeout(firstLoadAgent(), 1000);

      //storage
      if(ng.isUndefined($rootScope.preLocRenovacion)){
        gcwFactory.cleanStorage();
        limpiar();
        vm.formSession = {};

      }else{ //si el usuario viene del detalle poliza, recargo las opciones del form
        $rootScope.cliente = gcwFactory.getVariableSession('clienteSession');
        vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
        vm.formSession = gcwFactory.getVariableSession("formSession");
        vm.formRenovaciones.mTipoFecha = vm.formSession.mTipoFecha;
        vm.formRenovaciones.mConsultaDesdeA.value = vm.formSession.mConsultaDesdeA;
        vm.formRenovaciones.mConsultaDesdeM.value = vm.formSession.mConsultaDesdeM;
        vm.formRenovaciones.mConsultaHastaA.value = vm.formSession.mConsultaHastaA;
        vm.formRenovaciones.mConsultaHastaM.value = vm.formSession.mConsultaHastaM;
        vm.formRenovaciones.mOpcionTipoBusqueda = vm.formSession.mOpcionTipoBusqueda;
        if(!ng.isUndefined(vm.formRenovaciones.Cliente)){
          vm.formRenovaciones.Cliente.documentType = vm.formSession.mCliente.documentType;
          vm.formRenovaciones.Cliente.documentNumber = vm.formSession.mCliente.documentNumber;
        }
        if(vm.formRenovaciones.mOpcionTipoBusqueda == "2" && ng.isUndefined(vm.formRenovaciones.mNumPoliza))
          vm.formRenovaciones.mNumPoliza = Number(vm.formSession.mNumPoliza);
        if(vm.formRenovaciones.mOpcionTipoBusqueda == "3" && ng.isUndefined(vm.formRenovaciones.mNumPlaca))
          vm.formRenovaciones.mNumPoliza = Number(vm.formSession.mNumPlaca);

        vm.formFilterRenovaciones.Sector = {};
        vm.formFilterRenovaciones.Ramo = {};
        vm.formFilterRenovaciones.Renovacion = {};
        vm.formFilterRenovaciones.Estado = {};
        vm.formFilterRenovaciones.SubSector = {};
        vm.formFilterRenovaciones.Segmentation = {};

        vm.formFilterRenovaciones.Sector.code = vm.formSession.sector;
        vm.formFilterRenovaciones.Ramo.identifierId = vm.formSession.ramo;
        vm.formFilterRenovaciones.Renovacion.code = vm.formSession.renovacion;
        vm.formFilterRenovaciones.Estado.code = vm.formSession.estado;

        vm.formFilterRenovaciones.SubSector.codeInt = vm.formSession.subSector;
        vm.formFilterRenovaciones.Segmentation.code = vm.formSession.segmentation;

        //data obtenida en la busq
        vm.renovaciones = gcwFactory.getVariableSession("dataSession");
        vm.totalRows = Object.keys(vm.renovaciones).length; //total de items de objeto json
        vm.itemsXPagina = 10;
        vm.itemsXTanda = vm.itemsXPagina * 10;
        vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
        page = new MxPaginador();
        page.setNroItemsPorPagina(vm.itemsXPagina);
        page.setNroTotalRegistros(vm.totalItems).setDataActual(vm.renovaciones).setConfiguracionTanda();
            setLstCurrentPage();
      }
      vm.cabecera = $rootScope.cabecera;
      $rootScope.preLocRenovacion = undefined;

    } // end onInit

    function calculaMeses(a1, a2, m1, m2){
      //retorna true si la diferencia de meses es menor o igual a 6 meses
      var anioDesde = a1;
      var mesDesde = m1;

      var anioHasta = a2;
      var mesHasta = m2;
      var fecha1, fecha2, valorFecha1, valorFecha2, v1, v2;

      if(anioDesde > anioHasta){
        return -1;
      }else if(anioDesde < anioHasta){
        if(mesDesde > mesHasta+12){
          return -2;
        }else{
          fecha1 = new Date(anioDesde, mesDesde-1, 1, 0, 0, 0, 0);
          fecha2 = new Date(anioHasta, mesHasta-1, 0, 23, 59, 0, 0);

          valorFecha1 = fecha1.valueOf();
          v1 = valorFecha1 +  ( 180 * 24 * 60 * 60 * 1000 ); //fecha inicial + 6 meses

          valorFecha2 = fecha2.valueOf();
          v2 = valorFecha2

          if(v2 <= v1)
            return 1;
          else
            return 0;
        }
      }else{
        if(mesDesde > mesHasta){
          return -2;
        }else{
          fecha1 = new Date(anioDesde, mesDesde-1, 1, 0, 0, 0, 0);
          fecha2 = new Date(anioHasta, mesHasta-1, 0, 23, 59, 0, 0);

          valorFecha1 = fecha1.valueOf();
          v1 = valorFecha1 +  ( 180 * 24 * 60 * 60 * 1000 ); //fecha inicial + 6 meses

          valorFecha2 = fecha2.valueOf();
          v2 = valorFecha2

          if(v2 <= v1)
            return 1;
          else
            return 0;
        }
      }

    }

    function lstAnios(){

      var hoy = new Date();
      var anio = hoy.getFullYear();
      var numItems = (anio+1) - 2008;

      var anios = [];

      for(var i = 0; i <= numItems; i++){
        anios.push({'description': 2008+i, 'value': 2008+i});
      }
      vm.lstAnios = anios;
    }

    function lstMeses(){

      var meses = [];

      for(var i = 1; i <= 12; i++){
        var mes = i;
        if(mes <= 9) mes = '0'+i;
        meses.push({'description': mes, 'value': mes});
      }
      vm.lstMeses = meses;
    }

    $scope.$watch('vm.formFilterRenovaciones.Sector', function(n, o){
      //lstRamos(vm.formFilterRenovaciones.Sector.code);
      if(n && !angular.equals(n, o)){
        lstSubSectores(n.code);
      }
    });

    $scope.$watch('vm.formFilterRenovaciones.SubSector', function(n, o){
      if(n && !angular.equals(n, o)) {
        lstRamos(vm.formFilterRenovaciones.Sector.code, n.codeInt);
      }
    });

    function lstSectores(){
      gcwFactory.getListSectors(false).then(
        function glpPr(req){
          vm.lstSectores = req.data;
        });
    }

    function lstSubSectores(sectorId){
      if(sectorId) {
        gcwFactory.getListSubSector(sectorId, false).then(
          function glpPu(req2){
            vm.lstSubSectores = req2.data;
          });
      } else {
        vm.lstSubSectores = [];
        vm.lstRamos = [];
        vm.formFilterRenovaciones.SubSector = {};
        vm.formFilterRenovaciones.Ramo = {};
      }
    }

    function lstRamos(sectorCode, subSectorCode){
      if(sectorCode && subSectorCode) {
        gcwFactory.GetListRamosBySector(sectorCode, subSectorCode, false).then(
          function glpPq(res){
            vm.lstRamos = res.data;
          });
      } else {
        vm.lstRamos = [];
        vm.formFilterRenovaciones.Ramo = {};
      }
    }

    function lstEstadosCCC(){
      gcwFactory.getListEstadosCCC(false).then(
        function glpPs(res2){
          vm.lstEstados = res2.data;
        });
    }

    function lstEstadosR(){
      gcwFactory.getListEstadosR(false).then(
        function glpPt(res3){
          vm.lstRenovacion = res3.data;
        });
    }

    function lstSegmentation() {
      gcwFactory.getListSegmentation(false).then(
        function glpPa(res4) {
          vm.lstSegmentation = res4.data;
        });
    }

    function showModalRenovacion(item){
      $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        templateUrl : '/gcw/app/components/renovaciones/renovaciones/modal-renovacion.html',
        controller : ['$scope', '$uibModalInstance', function($scope, $uibModalInstance){

          vm.filterModalRenovacion = {
            companyId: item.companyId,
            branchId: item.branchId,
            policyNumber: item.policyNumber,
            supplement: item.supplement,
            application: item.application,
            applicationSupplement: item.applicationSupplement,
            expirationDate: item.expirationDate,
            documentType: item.documentType,
            documentNumber: item.documentNumber
          };

          gcwFactory.getDataModalRenovacion(vm.filterModalRenovacion, true).then(function(response) {
            if(response.data){
              $scope.empresa = response.data.contrator.nameFull;
              $scope.poliza = item.policyNumber;
              $scope.modalidad = item.modalityName;
              $scope.vigencia = item.limit;
              $scope.primaNetaPolizaVigente = item.balanceCurrent;
              $scope.primaNetaPolizaPre = item.balancePreRenovation;
              $scope.desde = item.effectDate;
              $scope.hasta = item.expirationDate;

              if(response.data.dataVehicles.length > 0)
                $scope.vehiculos = response.data.dataVehicles;

              $scope.dataAmount = response.data.dataAmount;

              $scope.historico = response.data.managerCcc;
            }
          });

          $scope.closeModal = function () {
            $uibModalInstance.close();
          };
        }]
      });
    }

    function showModalFinanciamiento(item){
      $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        templateUrl : '/gcw/app/components/renovaciones/renovaciones/modal-financiamiento.html',
        // template : '<mpf-modal-send-email action="action" data="emailData" close="close()"></mpf-modal-send-email>',
        controller : ['$scope', '$uibModalInstance', '$uibModal', '$timeout',
          function($scope, $uibModalInstance, $uibModal, $timeout) {
          /*#########################
          # closeModal
          #########################*/
          $scope.closeModal = function () {
            $uibModalInstance.close();
          };
        }]
      });
    }

    vm.buscar = buscar;
    vm.limpiar = limpiar;
    vm.firstSearch = true;
    vm.irDetalleRenovacion = irDetalleRenovacion;
    vm.getFormSession = getFormSession;

    vm.evaluarAccion = evaluarAccion;
    vm.showModalRenovacion = showModalRenovacion;
    vm.showModalFinanciamiento = showModalFinanciamiento;

    //actualiza registros segun agente o gestor seleccionado
    $rootScope.$watch('cabecera' ,function(){
      vm.cabecera = $rootScope.cabecera;
    },true);

    function firstLoadAgent(){
      vm.rol = {};
      vm.rol.gestorID = 0;
      vm.rol.agenteID = 0;
    }

    function obtenerAgente(){

      switch(vm.dataTicket.roleCode){
        case "GESTOR-OIM":
          return {
            gestorID: vm.dataTicket.oimClaims.agentID,
            agenteID: (vm.cabecera.agente == null) ? 0 : vm.cabecera.agente.id
          };
          break;
        case "DIRECTOR":
          return {
            gestorID: vm.dataTicket.codeManagerOffice,
            agenteID: (vm.cabecera.agente == null) ? "0" : vm.cabecera.agente.id
          };
          break;
        case "GESTOR":
        case "ADM-COBRA":
        case "ADM-COMI":
        case "ADM-RENOV":
        case "ADM-SINIE":
        case "ADM-CART":
          // TODO: Quitar mensaje de error: TypeError: Cannot read property 'agente' of undefined
          return {
            gestorID: (ng.isUndefined(vm.cabecera.gestor)) ? 0 : vm.cabecera.gestor.id,
            agenteID: (vm.cabecera.agente == null) ? 0 : vm.cabecera.agente.id
          }
          break;
        default:
          return {
            gestorID: 0,
            agenteID: vm.dataTicket.oimClaims.agentID
          }
      }
    }

    function evaluarAccion(item){
      switch(item.viewTypeDetail){
        case "DE":
          irDetalleRenovacion(item);
          break;
        case "PD":
          showModalRenovacion(item);
          break;
        case "VA":
          showModalValidar(item);
          break;
      }
    }

    function buscar(){

      var a1 = vm.formRenovaciones.mConsultaDesdeA.value;
      var m1 = vm.formRenovaciones.mConsultaDesdeM.value;

      var a2 = vm.formRenovaciones.mConsultaHastaA.value;
      var m2 = vm.formRenovaciones.mConsultaHastaM.value;

      vm.mDesde = m1+'/'+a1;
      vm.mHasta = m2+'/'+a2;

      var sessionAgente = gcwFactory.getVariableSession('rolSessionA');
      var sessionGestor = gcwFactory.getVariableSession('rolSessionG');
      var params;

      vm.mCheckAllPE = false;

      if(!ng.isUndefined($rootScope.preLocRenovacion)){
        vm.rol = gcwFactory.getVariableSession('rolSession');
        vm.rol.agenteID = (ng.isUndefined(sessionAgente.id)) ? $rootScope.cabecera.agente.id : sessionAgente.id;
        vm.rol.gestorID = (ng.isUndefined(sessionGestor.id)) ? $rootScope.cabecera.gestor.id : sessionGestor.id;
      }else{
        vm.rol = obtenerAgente();
      }

      switch(vm.formRenovaciones.mOpcionTipoBusqueda.toString()){
        case "1":
          vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
          vm.rol = obtenerAgente();
          if(vm.cabecera && !ng.isUndefined(vm.dataTicket)){
            //if(vm.cabecera.agente == null || !vm.rol.agenteID){
            if(!vm.rol.agenteID || vm.rol.agenteID == 0){
              mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Renovaciones", "", "", "", "g-myd-modal");
            }else{
              vm.currentPage = 1;
              vm.firstSearch = false;

              //almacenar (storage) los datos ingresados a traves del form
              //para tenerlos en caso se "regrese" desde detalle poliza
              gcwFactory.addVariableSession('formSession', getFormSession());
              switch(calculaMeses(a1, a2, parseInt(m1), parseInt(m2))){
                case -2:
                  mModalAlert.showInfo('El rango de fecha no debe ser negativo', 'Renovaciones', '', '', '', 'g-myd-modal');
                break;
                case -1:
                  mModalAlert.showInfo('El rango de fecha no debe ser negativo', 'Renovaciones', '', '', '', 'g-myd-modal');
                break;
                case 0:
                  mModalAlert.showInfo('El rango de fecha no debe exceder los 6 meses', 'Renovaciones', '', '', '', 'g-myd-modal');
                break;
                case 1:
                  params = _.assign({}, getParams(), {
                    dateStart: vm.mDesde,
                    dateEnd: vm.mHasta,
                    documentType: ng.isUndefined(vm.formRenovaciones.Cliente) ? "" : vm.formRenovaciones.Cliente.documentType,
                    documentNumber: ng.isUndefined(vm.formRenovaciones.Cliente) ? "" : vm.formRenovaciones.Cliente.documentNumber,
                    policyNumber: "",
                    plateNumber: ""
                  });
                  page.setCurrentTanda(vm.currentPage);
                  searchRenovaciones(params);
                  gcwFactory.addVariableSession('cabeceraSession', $rootScope.cabecera);
                break;
              }
            }
          }
        break;
        case "2":
          vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
          vm.rol = obtenerAgente();
          if(vm.cabecera && typeof vm.dataTicket != 'undefined'){
            if(ng.isUndefined(vm.formRenovaciones.mNumPoliza) || vm.formRenovaciones.mNumPoliza == ""){
              mModalAlert.showInfo("Ingrese el número de póliza para iniciar la consulta", "Renovaciones", "", "", "", "g-myd-modal");
            }else{
              vm.currentPage = 1;
              gcwFactory.addVariableSession('formSession', getFormSession());
              params = _.assign({}, getParams(), {
                dateStart: vm.mDesde,
                dateEnd: vm.mHasta,
                documentType: "",
                documentNumber: "",
                policyNumber: vm.formRenovaciones.mNumPoliza,
                plateNumber: ""
              });
              page.setCurrentTanda(vm.currentPage);
              searchRenovaciones(params);
            }
          }
        break;
        case "3":
          vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
          vm.rol = obtenerAgente();
          if(vm.cabecera && typeof vm.dataTicket != 'undefined'){
            if(!vm.rol.agenteID){
              mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Renovaciones", "", "", "", "g-myd-modal");
            }else{
              if(ng.isUndefined(vm.formRenovaciones.mNumPlaca) || vm.formRenovaciones.mNumPlaca == ""){
                mModalAlert.showInfo("Ingrese el número de placa para iniciar la consulta", "Renovaciones", "", "", "", "g-myd-modal");
              }else{
                vm.currentPage = 1;
                vm.firstSearch = false;
                gcwFactory.addVariableSession('formSession', getFormSession());
                params = _.assign({}, getParams(), {
                  dateStart: vm.mDesde,
                  dateEnd: vm.mHasta,
                  documentType: "",
                  documentNumber: "",
                  policyNumber: "",
                  plateNumber: vm.formRenovaciones.mNumPlaca
                });
                page.setCurrentTanda(vm.currentPage);
                searchRenovaciones(params);
                gcwFactory.addVariableSession('cabeceraSession', $rootScope.cabecera);
              }
            }
          }
        break;
      } //end switch
    }

    function getParams(){
      return {
        sectorId: vm.formFilterRenovaciones.Sector.code,
        subSectorId: vm.formFilterRenovaciones.SubSector.codeInt,
        identifierId: (vm.formFilterRenovaciones.Ramo.identifierId == null) ? 0 : vm.formFilterRenovaciones.Ramo.identifierId,
        situationRenovation: (vm.formFilterRenovaciones.Renovacion.code == null) ? "T" : vm.formFilterRenovaciones.Renovacion.code,
        situationCCC: (vm.formFilterRenovaciones.Estado.code == null) ? "T" : vm.formFilterRenovaciones.Estado.code,
        roleType: vm.dataTicket.roleType,
        AgentId: vm.rol.agenteID,
        ManagerId: vm.rol.gestorID,
        RowByPage: vm.itemsXTanda,
        CurrentPage: vm.currentPage,
        segmentation: vm.formFilterRenovaciones.Segmentation.code
      };
    }

    function pageChanged(event) {
      var params;

      vm.mDesde = vm.formRenovaciones.mConsultaDesdeM.value+'/'+vm.formRenovaciones.mConsultaDesdeA.value;
      vm.mHasta = vm.formRenovaciones.mConsultaHastaM.value+'/'+vm.formRenovaciones.mConsultaHastaA.value;

      var sessionAgente = gcwFactory.getVariableSession('rolSessionA');
      var sessionGestor = gcwFactory.getVariableSession('rolSessionG');

      vm.mCheckAllPE = false;
      vm.selectAllPE(false);

      if(!ng.isUndefined($rootScope.preLocRenovacion)){
        vm.rol = gcwFactory.getVariableSession('rolSession');
        vm.rol.agenteID = (ng.isUndefined(sessionAgente.id)) ? $rootScope.cabecera.agente.id : sessionAgente.id;
        vm.rol.gestorID = (ng.isUndefined(sessionGestor.id)) ? $rootScope.cabecera.gestor.id : sessionGestor.id;
      }else{
        vm.rol = obtenerAgente();
      }

      switch(vm.formRenovaciones.mOpcionTipoBusqueda.toString()){
        case "1":
          params = _.assign({}, getParams(), {
            dateStart: vm.mDesde,
            dateEnd: vm.mHasta,
            documentType: ng.isUndefined(vm.formRenovaciones.Cliente) ? "" : vm.formRenovaciones.Cliente.documentType,
            documentNumber: ng.isUndefined(vm.formRenovaciones.Cliente) ? "" : vm.formRenovaciones.Cliente.documentNumber,
            policyNumber: "",
            plateNumber: ""
          });
          break;
        case "2":
          params = _.assign({}, getParams(), {
            dateStart: vm.mDesde,
            dateEnd: vm.mHasta,
            documentType: "",
            documentNumber: "",
            policyNumber: vm.formRenovaciones.mNumPoliza,
            plateNumber: ""
          });
        break;
        case "3":
          params = _.assign({}, getParams(), {
            dateStart: vm.mDesde,
            dateEnd: vm.mHasta,
            documentType: "",
            documentNumber: "",
            policyNumber: "",
            plateNumber: vm.formRenovaciones.mNumPlaca
          });
        break;
      }
      page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda) {
        params.CurrentPage = nroTanda;
        searchRenovaciones(params);
      }, setLstCurrentPage);
    }

    function searchRenovaciones(filter){
      gcwFactory.getListRenovaciones(filter, true).then(
        function(response){
          if(response.data){

            if(response.data.list.length > 0){
              vm.renovaciones = response.data.list;

              //almacenar (storage) data.list obtenida por la consulta
              //para tenerla en caso se "regrese" desde detalle poliza
              gcwFactory.addVariableSession('dataSession', vm.renovaciones);

              vm.totalRows = response.data.totalRows;
              vm.totalPages = response.data.totalPages;

              if(vm.formRenovaciones.mOpcionTipoBusqueda == "2"){

                var params = {
                  policyNumber: vm.formRenovaciones.mNumPoliza,
                  documentTypeCode: "",
                  documentTypeNumber: "",
                  roleType: vm.dataTicket.roleType,
                  managerId: vm.rol.gestorID
                };

                gcwFactory.getGestorAgentePorPoliza(params, false).then(
                  function(response){
                    $scope.managerID = response.data.managerId;
                    $scope.managerName = response.data.managerNameFull;
                    $scope.agentID = response.data.agentId;
                    $scope.agentName = response.data.agentNameFull;

                    var cabecera = {
                      gestor : {
                        id: $scope.managerID.toString(),
                        fullName: $scope.managerName,
                        idFullName: $scope.managerID.toString()+'-'+$scope.managerName
                      },
                      agente : {
                        id: $scope.agentID.toString(),
                        fullName: $scope.agentName,
                        idFullName: $scope.agentID.toString()+'-'+$scope.agentName
                      }
                    };
                    gcwFactory.addVariableSession('cabeceraSession', cabecera);

                    $rootScope.codeAgent = $scope.agentID.toString();
                    $rootScope.nameAgent = $scope.agentName;

                    if($rootScope.codeAgent == "" && $rootScope.nameAgent == "")
                      vm.cabecera.agente = "";

                    $rootScope.codeManager = $scope.managerID.toString();
                    $rootScope.descriptionManager = $scope.managerName;

                    $rootScope.polizaAnulada = vm.formRenovaciones.mOpcionTipoBusqueda;
                    $rootScope.$broadcast('anuladasPorDeuda');
                  },
                  function(error){
                    console.log(error)
                  });
              }else{

                $rootScope.codeAgent = undefined;
                $rootScope.nameAgent = undefined
                $rootScope.codeManager = undefined;
                $rootScope.descriptionManager = undefined;
              }
            }else{
              vm.renovaciones = [];
              vm.totalRows = 0;
              vm.totalPages = 0;
            }
          }else{
            vm.renovaciones = [];
            vm.totalRows = 0;
            vm.totalPages = 0;
          }
          page.setNroTotalRegistros(vm.totalRows).setDataActual(vm.renovaciones).setConfiguracionTanda();
          setLstCurrentPage();
        });
    }

    function setLstCurrentPage() {
      vm.renovaciones = page.getItemsDePagina();
    }

    function getFormSession(){
      vm.formSession = {}; //init vacio para cada vez q se hace una busqueda
      vm.formSession = {
        mOpcionTipoBusqueda : vm.formRenovaciones.mOpcionTipoBusqueda,
        mConsultaDesdeA : vm.formRenovaciones.mConsultaDesdeA.value,
        mConsultaDesdeM : vm.formRenovaciones.mConsultaDesdeM.value,
        mConsultaHastaA : vm.formRenovaciones.mConsultaHastaA.value,
        mConsultaHastaM : vm.formRenovaciones.mConsultaHastaM.value,
        mCliente : {
          documentType : (ng.isUndefined(vm.formRenovaciones.Cliente)) ? '' : vm.formRenovaciones.Cliente.documentType,
          documentNumber : (ng.isUndefined(vm.formRenovaciones.Cliente)) ? '' : vm.formRenovaciones.Cliente.documentNumber
        },
        mNumPoliza : Number(vm.formRenovaciones.mNumPoliza),
        mNumPlaca : vm.formRenovaciones.mNumPlaca,
        renovacion : vm.formFilterRenovaciones.Renovacion.code,
        estado : vm.formFilterRenovaciones.Estado.code,
        sector : vm.formFilterRenovaciones.Sector.code,
        subSector : vm.formFilterRenovaciones.SubSector.codeInt,
        ramo : vm.formFilterRenovaciones.Ramo.identifierId,
        segmentation: vm.formFilterRenovaciones.Segmentation.code
      }
      return vm.formSession;
    }

    function irDetalleRenovacion(item){
      vm.formRenovaciones.renovacionDetail = item;
      gcwFactory.addVariableSession("renovacionDetail", vm.formRenovaciones.renovacionDetail);
      gcwFactory.addVariableSession("rolSession", vm.rol);
       $state.go('consulta.renovacionDetalle', {id:item.policyNumber}, {reload: false, inherit: false});
    }

    function limpiar(){
      $rootScope.$emit('cliente:borrar');

      vm.formRenovaciones = {};
      vm.formRenovaciones.mNumPoliza = '';
      vm.formRenovaciones.mNumPlaca = '';

      vm.formRenovaciones.mOpcionTipoBusqueda = 1;

      var date = new Date();
      vm.formRenovaciones.mConsultaDesdeA = {};
      vm.formRenovaciones.mConsultaDesdeM = {};
      vm.formRenovaciones.mConsultaHastaA = {};
      vm.formRenovaciones.mConsultaHastaM = {};

      vm.formRenovaciones.mConsultaDesdeA.value = date.getFullYear();
      vm.formRenovaciones.mConsultaDesdeM.value = date.getMonth()+1;

      vm.formRenovaciones.mConsultaHastaA.value = date.getFullYear();
      vm.formRenovaciones.mConsultaHastaM.value = date.getMonth()+1

      vm.formFilterRenovaciones.Sector = {};
      vm.formFilterRenovaciones.Ramo = {};
      vm.formFilterRenovaciones.Renovacion = {};
      vm.formFilterRenovaciones.Estado = {};
      vm.formFilterRenovaciones.SubSector = {};
      vm.formFilterRenovaciones.Segmentation = {};

      vm.formFilterRenovaciones.Sector.code = null;
      vm.formFilterRenovaciones.Ramo.identifierId = null;
      vm.formFilterRenovaciones.Renovacion.code = null;
      vm.formFilterRenovaciones.Estado.code = null;
      vm.formFilterRenovaciones.SubSector.codeInt = null;
      vm.formFilterRenovaciones.Segmentation.code = null;

      vm.renovaciones = null;
      vm.totalRows = 0;
      vm.totalPages = 0;
    }

    $scope.exportar = function(){
      vm.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw+'/api/renovation/resume/download');
      vm.downloadFile = {
        documentType: ng.isUndefined(vm.formRenovaciones.Cliente) ? '' : vm.formRenovaciones.Cliente.documentType,
        documentNumber: ng.isUndefined(vm.formRenovaciones.Cliente) ? '' : vm.formRenovaciones.Cliente.documentNumber,
        policyNumber: (ng.isUndefined(vm.formRenovaciones.mNumPoliza)) ? '' : vm.formRenovaciones.mNumPoliza,
        dateStart: vm.mDesde,
        dateEnd: vm.mHasta,
        typeGroupBranch: (vm.formFilterRenovaciones.Sector.code == null) ? 'T' : vm.formFilterRenovaciones.Sector.code,
        situationRenovation: (vm.formFilterRenovaciones.Renovacion.code == null) ? "T" : vm.formFilterRenovaciones.Renovacion.code,
        situationCCC: (vm.formFilterRenovaciones.Estado.code == null) ? "T" : vm.formFilterRenovaciones.Estado.code,
        branchId: (vm.formFilterRenovaciones.Ramo.identifierId == null) ? 0 : vm.formFilterRenovaciones.Ramo.identifierId,
        sectorId: !vm.formFilterRenovaciones.Sector.code ? 0 : vm.formFilterRenovaciones.Sector.code,
        subSectorId: !vm.formFilterRenovaciones.SubSector.codeInt ? 0 : vm.formFilterRenovaciones.SubSector.codeInt,
        typeRole: vm.dataTicket.roleType,
        userCode: vm.dataTicket.userCode,
        agentId: vm.rol.agenteID,
        managerId: vm.rol.gestorID,
        segmentation: vm.formFilterRenovaciones.Segmentation.code
      };
      $timeout(function() {
        document.getElementById('frmExport').submit();
      }, 1000);
    }

    vm.stopPropagation = function($event) {
      $event.stopPropagation(); 
    };

    vm.selectAllPE = function(val) {
      for(var i = 0; i < vm.renovaciones.length; i++) {
        vm.renovaciones[i].selected = val;
      }
    }

    vm.selectPolizaPE = function(index, val) {
      vm.renovaciones[index].selected = val;
      vm.mCheckAllPE = (deselectedPolicies().length === 0);
    }

    function deselectedPolicies() {
      return vm.renovaciones.filter(function(o){ return !o.selected; });
    }
    
    function selectedPolicies() {
      return vm.renovaciones.filter(function(o){ return o.selected; });
    }

    $scope.enviarPolizas = function() {
      vm.selectedPolicies = selectedPolicies();
      clearMessage();
      openModalSendPolicies();
    }

    function clearMessage() {
      if(vm.selectedPolicies) {
        ng.forEach(vm.selectedPolicies, function (item, key) {
          vm.selectedPolicies[key].message = '';
        });
      }
    }

    function openModalSendPolicies() {
      if(vm.selectedPolicies.length > 0) {
        vm.dataSendPolicy = {};

        $uibModal.open({
          backdrop: true,
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          size: 'lg',
          templateUrl : '/gcw/app/components/modalCarteraPoliza/component/modalEnvioPolizaMail.html',
          controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
            
            $scope.close = function () {
              $uibModalInstance.close();
            };

            $scope.enviarPolicy = function(){
              if(!vm.dataSendPolicy.emails) {
                mModalAlert
                  .showError('No hay correo(s) electr&oacute;nico(s) para la(s) p&oacute;liza(s) seleccionada(s)', 'Error', '', '', '', 'g-myd-modal')
                  .then(function () {
                    $scope.close();
                  });
              }

              clearMessage();

              vm.paramsSetDataModalPoliza = {
                emails: vm.dataSendPolicy.emails,
                policies: vm.selectedPolicies
              };

              gcwFactory.sendPoliciesUncertified(vm.paramsSetDataModalPoliza, true)
                .then(function(response) {
                  if(response.data) {
                    var data = response.data;
                    for(var i = 0; i < vm.selectedPolicies.length; i++){
                      var res = data.filter(function(x) { 
                        return x.policy.policyNumber === vm.selectedPolicies[i].policyNumber 
                          && x.policy.supplement === vm.selectedPolicies[i].supplement
                          && x.policy.application === vm.selectedPolicies[i].application
                          && x.policy.applicationSupplement === vm.selectedPolicies[i].applicationSupplement
                      })[0];

                      vm.selectedPolicies[i].message = res.code === 1 ? "OK" : res.message;
                      vm.selectedPolicies[i].hasError = res.code != 1;
                    }
                  } else {
                    mModalAlert
                    .showError('Ha ocurrido un error, comun&iacute;quece con un administrador', 'Error', '', '', '', 'g-myd-modal')
                    .then(function () {
                      $scope.close();
                    });
                  }
                }, function(error){
                  mModalAlert
                  .showError('Ha ocurrido un error, comun&iacute;quece con un administrador', 'Error', '', '', '', 'g-myd-modal')
                  .then(function () {
                    $scope.close();
                  });
                });
            }
          }]
        });
      } else {
        mModalAlert.showInfo("Debe elegir por lo menos una p&oacute;liza.", "Advertencia", "", "", "", "g-myd-modal");
      }
    }


  } // end controller

  return ng.module('appGcw')
    .controller('RenovacionesController', RenovacionesController)
    .component('gcwRenovaciones', {
      templateUrl: '/gcw/app/components/renovaciones/renovaciones/renovaciones.html',
      controller: 'RenovacionesController',
      controllerAs: 'vm',
      bindings: {
      }
    });
});
