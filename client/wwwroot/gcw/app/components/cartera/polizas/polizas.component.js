define([
  'angular', 'constants', 'lodash',
  '/gcw/app/factory/gcwFactory.js'
], function (ng, constants, _) {

  PolizasController.$inject = ['$scope', '$uibModal', 'gcwFactory', 'gaService', '$state', 'mModalAlert','mModalConfirm', '$rootScope', '$timeout', '$sce', 'MxPaginador', 'accessSupplier', 'CommonCboService'];
  function PolizasController($scope, $uibModal, gcwFactory, gaService, $state, mModalAlert, mModalConfirm ,$rootScope, $timeout, $sce, MxPaginador, CommonCboService) {
    var vm = this;
    var page;

    vm.$onInit = function () {

      $rootScope.currentURL = $state.current.url;
      $rootScope.$broadcast('dashboard');
      $rootScope.$broadcast('networkInit');
      $rootScope.$broadcast('msgSinResultados');
      $rootScope.$broadcast('comprobanteRemitido');

      $rootScope.polizaAnulada = "1";
      $rootScope.$broadcast('anuladasPorDeuda');

      vm.formDataCartera = {};

      vm.formDataCartera.mOpcionTipoBusqueda = "1";
      vm.formDataCartera.Sector = {};

      vm.formDataCartera.CarteraPoliza = 'Cartera - Póliza';
      vm.gLblContratanteAsegurado = "Por contratante/asegurado";
      vm.gLblPoliza = "Nro. Póliza";
      vm.gLblPlaca = "Nro. Placa";
      vm.urlExport = 'api/policy/download';

      lstAnios();
      lstMeses();

      var actual = new Date();

      vm.formDataCartera.mConsultaDesdeAVi = {};
      vm.formDataCartera.mConsultaHastaAVi = {};
      vm.formDataCartera.mConsultaDesdeMVi = {};
      vm.formDataCartera.mConsultaHastaMVi = {};

      vm.formDataCartera.mConsultaDesdeAVi.value = actual.getFullYear();
      vm.formDataCartera.mConsultaHastaAVi.value = actual.getFullYear();

      if ((actual.getMonth() + 1) < 10) {
        vm.formDataCartera.mConsultaDesdeMVi.value = '0' + (actual.getMonth() + 1);
        vm.formDataCartera.mConsultaHastaMVi.value = '0' + (actual.getMonth() + 1);
      }
      else {
        vm.formDataCartera.mConsultaDesdeMVi.value = actual.getMonth() + 1;
        vm.formDataCartera.mConsultaHastaMVi.value = actual.getMonth() + 1;
      }

      vm.formDataCartera.mConsultaDesdeAVe = {};
      vm.formDataCartera.mConsultaHastaAVe = {};
      vm.formDataCartera.mConsultaDesdeMVe = {};
      vm.formDataCartera.mConsultaHastaMVe = {};

      vm.formDataCartera.mConsultaDesdeAVe.value = actual.getFullYear();
      vm.formDataCartera.mConsultaHastaAVe.value = actual.getFullYear();

      if ((actual.getMonth() + 1) < 10) {
        vm.formDataCartera.mConsultaDesdeMVe.value = '0' + (actual.getMonth() + 1);
        vm.formDataCartera.mConsultaHastaMVe.value = '0' + (actual.getMonth() + 1);
      }
      else {
        vm.formDataCartera.mConsultaDesdeMVe.value = actual.getMonth() + 1;
        vm.formDataCartera.mConsultaHastaMVe.value = actual.getMonth() + 1;
      }

      //Sectores y ramos
      lstSectores();
      lstRamos();

      vm.cabecera = $rootScope.cabecera;

      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");

      $rootScope.preLocSiniestro = undefined;

      page = new MxPaginador();
      vm.itemsXPagina = 10;
      vm.itemsXTanda = vm.itemsXPagina * 10;
      vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
      page.setNroItemsPorPagina(vm.itemsXPagina);

      if (!ng.isUndefined($rootScope.preLocPoliza)) {

        vm.formSession = gcwFactory.getVariableSession("formSession");

        vm.formDataCartera.mConsultaDesdeAVi.value = vm.formSession.mConsultaDesdeAVi;
        vm.formDataCartera.mConsultaDesdeMVi.value = vm.formSession.mConsultaDesdeMVi;
        vm.formDataCartera.mConsultaHastaAVi.value = vm.formSession.mConsultaHastaAVi;
        vm.formDataCartera.mConsultaHastaMVi.value = vm.formSession.mConsultaHastaMVi;

        vm.formDataCartera.mConsultaDesdeAVe.value = vm.formSession.mConsultaDesdeAVe;
        vm.formDataCartera.mConsultaDesdeMVe.value = vm.formSession.mConsultaDesdeMVe;
        vm.formDataCartera.mConsultaHastaAVe.value = vm.formSession.mConsultaHastaAVe;
        vm.formDataCartera.mConsultaHastaMVe.value = vm.formSession.mConsultaHastaMVe;

        vm.formDataCartera.mOpcionTipoBusqueda = vm.formSession.mOpcionTipoBusqueda;

        if (vm.formDataCartera.mOpcionTipoBusqueda == "2")
          vm.formDataCartera.mNumPoliza = vm.formSession.mNumPoliza;

        if (vm.formDataCartera.mOpcionTipoBusqueda == "3")
          vm.formDataCartera.mNumPlaca = vm.formSession.mNumPlaca;

        vm.formDataCartera.Estado = {};
        vm.formDataCartera.Sector = {};
        vm.formDataCartera.Ramo = {};

        vm.formDataCartera.Estado.value = vm.formSession.estado;
        vm.formDataCartera.Sector.code = vm.formSession.sector;
        vm.formDataCartera.Ramo.identifierId = vm.formSession.ramo;

        //data obtenida en la busq
        var res = gcwFactory.getVariableSession("dataSession");
        vm.polizas = res.list;
        vm.totalItems = res.totalRows;

        page.setNroTotalRegistros(res.totalRows).setDataActual(res.list).setConfiguracionTanda();
        setLstCurrentPage();

        $rootScope.preLocPoliza = undefined;

      } else {
        vm.totalItems = 0;
        limpiar();
      }

      vm.currentPage = 1; // El paginador selecciona el nro 1
      vm.calculaMeses = calculaMeses;
    }; //end onInit

    function calculaMeses(a1, a2, m1, m2) {
      //retorna true si la diferencia de meses es menor o igual a 6 meses
      var anioDesde = a1;
      var mesDesde = m1;

      var anioHasta = a2;
      var mesHasta = m2;
      var valorFecha1, valorFecha2, v1, v2, fecha1, fecha2;

      if (anioDesde > anioHasta) {
        return -1;
      } else if (anioDesde < anioHasta) {
        if (mesDesde > mesHasta + 12) {
          return -2;
        } else {
          fecha1 = new Date(anioDesde, mesDesde - 1, 1, 0, 0, 0, 0);
          fecha2 = new Date(anioHasta, mesHasta - 1, 0, 23, 59, 0, 0);

          valorFecha1 = fecha1.valueOf();
          v1 = valorFecha1 + (180 * 24 * 60 * 60 * 1000); //fecha inicial + 6 meses

          valorFecha2 = fecha2.valueOf();
          v2 = valorFecha2

          if (v2 <= v1)
            return 1;
          else
            return 0;
        }
      } else {
        if (mesDesde > mesHasta) {
          return -2;
        } else {
          fecha1 = new Date(anioDesde, mesDesde - 1, 1, 0, 0, 0, 0);
          fecha2 = new Date(anioHasta, mesHasta - 1, 0, 23, 59, 0, 0);

          valorFecha1 = fecha1.valueOf();
          v1 = valorFecha1 + (180 * 24 * 60 * 60 * 1000); //fecha inicial + 6 meses

          valorFecha2 = fecha2.valueOf();
          v2 = valorFecha2

          if (v2 <= v1)
            return 1;
          else
            return 0;
        }
      }

    }

    vm.buscarPolizas = buscarPolizas;
    vm.searchPolizas = searchPolizas;
    vm.getParamsPoliza = getParamsPoliza;
    vm.limpiar = limpiar;
    vm.pageChanged = pageChanged;
    vm.irDetallePoliza = irDetallePoliza;
    vm.sendEmail = sendEmail;
    vm.copy = copy;

    $scope.$watch('vm.formDataCartera.Sector', function () {
      lstRamos();
    });

    function sendEmail(event,poliza) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      if(poliza.email){
        mModalConfirm.confirmWarning('¿Está seguro de enviar correo de enlace de Pago a ' + poliza.email +'?','','')
        .then(function () {
          gcwFactory.getSendLinkAfiliacion(gcwFactory.requestDocCartera(poliza)).then(function (response) {
            mModalAlert.showSuccess("Correo enviado correctamente", "")
          }).catch(function () {
            mModalAlert.showError("No es posible enviar un correo. Porfavor, genere un enlace de afiliacion", "")
          })
        });
      }
      else{
        mModalAlert.showError("No es posible enviar un correo. Porfavor, genere un enlace de afiliacion", "")
      }
    }

    function copy(event, poliza) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      gcwFactory.getLinkAfiliacion(gcwFactory.requestDocCartera(poliza)).then(function (response) {
        navigator.clipboard.writeText(response.data.url)
          .then(() => {
            mModalAlert.showSuccess("El enlace fue copiado en el portapapeles", "")
          })
      }).catch(function () {
        mModalAlert.showError("Error al generar enlace", "")
      })
    }

    function lstAnios() {

      var hoy = new Date();
      var anio = hoy.getFullYear();
      var numItems = (anio + 1) - 2008;

      var anios = [];

      for (var i = 0; i <= numItems; i++) {
        anios.push({ 'description': 2008 + i, 'value': 2008 + i });
      }
      vm.lstAnios = anios;
    }

    function lstMeses() {

      var meses = [];

      for (var i = 1; i <= 12; i++) {
        var mes = i;
        if (mes <= 9) mes = '0' + i;
        meses.push({ 'description': mes, 'value': mes });
      }
      vm.lstMeses = meses;
    }

    function lstSectores() {
      gcwFactory.getListSector(false).then(
        function glpPr(req) {
          vm.lstSectores = req.data;
        });
    }

    function lstRamos() {
      var code = (vm.formDataCartera.Sector == null) ? "T" : vm.formDataCartera.Sector.code;
      gcwFactory.getListRamo(code, false).then(
        function glpPq(res) {
          vm.lstRamos = res.data;
        });
    }

    function getFormSession() {
      vm.formSession = {}; //init vacio para cada vez q se hace una busqueda
      vm.formSession = {
        mConsultaDesdeAVi: vm.formDataCartera.mConsultaDesdeAVi.value,
        mConsultaDesdeMVi: vm.formDataCartera.mConsultaDesdeMVi.value,
        mConsultaHastaAVi: vm.formDataCartera.mConsultaHastaAVi.value,
        mConsultaHastaMVi: vm.formDataCartera.mConsultaHastaMVi.value,

        mConsultaDesdeAVe: vm.formDataCartera.mConsultaDesdeAVe.value,
        mConsultaDesdeMVe: vm.formDataCartera.mConsultaDesdeMVe.value,
        mConsultaHastaAVe: vm.formDataCartera.mConsultaHastaAVe.value,
        mConsultaHastaMVe: vm.formDataCartera.mConsultaHastaMVe.value,
        mOpcionTipoBusqueda: vm.formDataCartera.mOpcionTipoBusqueda,

        mNumPoliza: vm.formDataCartera.mNumPoliza,
        mNumPlaca: vm.formDataCartera.mNumPlaca,
        estado: vm.formDataCartera.Estado.value,
        sector: vm.formDataCartera.Sector.code,
        ramo: vm.formDataCartera.Ramo.identifierId
      }
      return vm.formSession;
    }

    $scope.exportar = function () {
      var a1, a2, m1, m2, mDesde, mHasta;
      var sessionAgente = gcwFactory.getVariableSession('rolSessionA');
      var sessionGestor = gcwFactory.getVariableSession('rolSessionG');

      if (!ng.isUndefined($rootScope.preLocPoliza)) {
        vm.rol = gcwFactory.getVariableSession('rolSession');
        vm.rol.agenteID = (ng.isUndefined(sessionAgente.id)) ? $rootScope.cabecera.agente.id : sessionAgente.id;
        vm.rol.gestorID = (ng.isUndefined(sessionGestor.id)) ? $rootScope.cabecera.gestor.id : sessionGestor.id;
        vm.paramsPoliza = gcwFactory.getVariableSession("paramsSession");
      } else {
        vm.rol = gcwFactory.obtenerAgente(vm.dataTicket);
      }

      vm.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw + 'api/policy/download');
      switch (vm.formDataCartera.mOpcionTipoBusqueda.toString()) {

        case "1":
          vm.downloadFile = {
            StateCode: vm.formDataCartera.Estado.value,
            DocumentTypeCode: vm.formDataCartera.Cliente1.documentType,
            DocumentTypeNumber: vm.formDataCartera.Cliente1.documentNumber,
            PolicyNumber: '',
            DateStartExpiration: '',
            DateEndExpiration: '',
            DateStartEffective: '',
            DateEndEffective: '',
            RamoId: (vm.formDataCartera.Ramo.identifierId == null) ? '0' : vm.formDataCartera.Ramo.identifierId,
            groupSector: vm.formDataCartera.Sector ? vm.formDataCartera.Sector.code : "T",
            PlateCode: '',
            RoleType: (vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
            CodeManagerOffice: vm.dataTicket.codeManagerOffice,
            agentId: vm.rol.agenteID,
            ManagerId: vm.rol.gestorID,
            UserCode: vm.dataTicket.userCode
          }
          break;
        case "2":
          vm.downloadFile = {
            StateCode: vm.formDataCartera.Estado.value,
            DocumentTypeCode: '',
            DocumentTypeNumber: '',
            PolicyNumber: vm.formDataCartera.mNumPoliza,
            DateStartExpiration: '',
            DateEndExpiration: '',
            DateStartEffective: '',
            DateEndEffective: '',
            RamoId: (vm.formDataCartera.Ramo.identifierId == null) ? '0' : vm.formDataCartera.Ramo.identifierId,
            groupSector: vm.formDataCartera.Sector ? vm.formDataCartera.Sector.code : "T",
            PlateCode: '',
            RoleType: (vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
            CodeManagerOffice: vm.dataTicket.codeManagerOffice,
            agentId: vm.rol.agenteID,
            ManagerId: vm.rol.gestorID,
            UserCode: vm.dataTicket.userCode
          }
          break;
        case "3":
          vm.downloadFile = {
            StateCode: vm.formDataCartera.Estado.value,
            DocumentTypeCode: '',
            DocumentTypeNumber: '',
            PolicyNumber: '',
            DateStartExpiration: '',
            DateEndExpiration: '',
            DateStartEffective: '',
            DateEndEffective: '',
            RamoId: (vm.formDataCartera.Ramo.identifierId == null) ? '0' : vm.formDataCartera.Ramo.identifierId,
            groupSector: vm.formDataCartera.Sector ? vm.formDataCartera.Sector.code : "T",
            PlateCode: vm.formDataCartera.mNumPlaca,
            RoleType: (vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
            CodeManagerOffice: vm.dataTicket.codeManagerOffice,
            agentId: vm.rol.agenteID,
            ManagerId: vm.rol.gestorID,
            UserCode: vm.dataTicket.userCode
          }
          break;
        case "4":
          a1 = vm.formDataCartera.mConsultaDesdeAVi.value;
          m1 = vm.formDataCartera.mConsultaDesdeMVi.value;
          mDesde = m1 + '/' + a1;

          a2 = vm.formDataCartera.mConsultaHastaAVi.value;
          m2 = vm.formDataCartera.mConsultaHastaMVi.value;
          mHasta = m2 + '/' + a2;

          vm.downloadFile = {
            StateCode: vm.formDataCartera.Estado.value,
            DocumentTypeCode: (ng.isUndefined(vm.formDataCartera.Cliente2)) ? '' : vm.formDataCartera.Cliente2.documentType,
            DocumentTypeNumber: (ng.isUndefined(vm.formDataCartera.Cliente2)) ? '' : vm.formDataCartera.Cliente2.documentNumber,
            PolicyNumber: '',
            DateStartExpiration: '',
            DateEndExpiration: '',
            DateStartEffective: mDesde,
            DateEndEffective: mHasta,
            RamoId: (vm.formDataCartera.Ramo.identifierId == null) ? '0' : vm.formDataCartera.Ramo.identifierId,
            groupSector: vm.formDataCartera.Sector ? vm.formDataCartera.Sector.code : "T",
            PlateCode: '',
            RoleType: (vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
            CodeManagerOffice: vm.dataTicket.codeManagerOffice,
            agentId: vm.rol.agenteID,
            ManagerId: vm.rol.gestorID,
            UserCode: vm.dataTicket.userCode
          }
          break;
        case "5":
          a1 = vm.formDataCartera.mConsultaDesdeAVe.value;
          m1 = vm.formDataCartera.mConsultaDesdeMVe.value;
          mDesde = m1 + '/' + a1;

          a2 = vm.formDataCartera.mConsultaHastaAVe.value;
          m2 = vm.formDataCartera.mConsultaHastaMVe.value;
          mHasta = m2 + '/' + a2;

          vm.downloadFile = {
            StateCode: vm.formDataCartera.Estado.value,
            DocumentTypeCode: '',
            DocumentTypeNumber: '',
            PolicyNumber: '',
            DateStartExpiration: mDesde,
            DateEndExpiration: mHasta,
            DateStartEffective: '',
            DateEndEffective: '',
            RamoId: (vm.formDataCartera.Ramo.identifierId == null) ? '0' : vm.formDataCartera.Ramo.identifierId,
            groupSector: vm.formDataCartera.Sector ? vm.formDataCartera.Sector.code : "T",
            PlateCode: '',
            RoleType: (vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
            CodeManagerOffice: vm.dataTicket.codeManagerOffice,
            agentId: vm.rol.agenteID,
            ManagerId: vm.rol.gestorID,
            UserCode: vm.dataTicket.userCode
          }
          break;
      }
      $timeout(function () {
        document.getElementById('frmExport').submit();
      }, 500);
    };

    function buscarPolizas() {
      gaService.add({ gaCategory: 'CG - Cartera', gaAction: 'MPF - Polizas - Boton Buscar', gaLabel: 'Botón: Buscar', gaValue: 'Periodo Regular' });
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
      var a1, a2, m1, m2, mDesde, mHasta;
      var sessionAgente = gcwFactory.getVariableSession('rolSessionA');
      var sessionGestor = gcwFactory.getVariableSession('rolSessionG');

      if (!ng.isUndefined($rootScope.preLocPoliza)) {
        vm.rol = gcwFactory.getVariableSession('rolSession');
        vm.rol.agenteID = (ng.isUndefined(sessionAgente.id)) ? $rootScope.cabecera.agente.id : sessionAgente.id;
        vm.rol.gestorID = (ng.isUndefined(sessionGestor.id)) ? $rootScope.cabecera.gestor.id : sessionGestor.id;
      } else {
        //vm.rol = obtenerAgente();
        vm.rol = gcwFactory.obtenerAgente(vm.dataTicket);
      }

      vm.currentPage = 1;
      vm.paramsPoliza = getParamsPoliza();

      switch (vm.formDataCartera.mOpcionTipoBusqueda.toString()) {
        case "1":
          if (!vm.rol.agenteID || vm.rol.agenteID == 0) {
            mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Cartera: Pólizas", "", "", "", "g-myd-modal");
          } else {
            if (ng.isUndefined(vm.formDataCartera.Cliente1)) {
              mModalAlert.showInfo("Seleccione un cliente para iniciar la consulta", "Cartera: Pólizas", "", "", "", "g-myd-modal");
            } else {
              vm.paramsPoliza = _.assign({}, getParamsPoliza(), {
                DocumentTypeCode: vm.formDataCartera.Cliente1.documentType,
                DocumentTypeNumber: vm.formDataCartera.Cliente1.documentNumber,
                PolicyNumber: '',
                PlateCode: '',
                DateStartExpiration: '',
                DateEndExpiration: '',
                DateStartEffective: '',
                DateEndEffective: ''
              });
              page.setCurrentTanda(vm.currentPage);
              searchPolizas(vm.paramsPoliza);
            }
          }
          break;
        case "2":
          if (vm.formDataCartera.mNumPoliza == "" || ng.isUndefined(vm.formDataCartera.mNumPoliza)) {
            mModalAlert.showInfo("Ingrese un número de póliza para iniciar la consulta", "Cartera: Pólizas", "", "", "", "g-myd-modal");
          } else {
            vm.paramsPoliza = _.assign({}, getParamsPoliza(), {
              DocumentTypeCode: '',
              DocumentTypeNumber: '',
              PolicyNumber: vm.formDataCartera.mNumPoliza,
              PlateCode: '',
              DateStartExpiration: '',
              DateEndExpiration: '',
              DateStartEffective: '',
              DateEndEffective: ''
            });
            page.setCurrentTanda(vm.currentPage);
            searchPolizas(vm.paramsPoliza);
          }
          break;
        case "3":
          if (!vm.rol.agenteID || vm.rol.agenteID == 0) {
            mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Cartera: Pólizas", "", "", "", "g-myd-modal");
          } else {
            if (vm.formDataCartera.mNumPlaca == "") {
              mModalAlert.showInfo("Ingrese una placa para iniciar la consulta", "Cartera: Pólizas", "", "", "", "g-myd-modal");
            } else {
              vm.paramsPoliza = _.assign({}, getParamsPoliza(), {
                DocumentTypeCode: '',
                DocumentTypeNumber: '',
                PolicyNumber: '',
                PlateCode: vm.formDataCartera.mNumPlaca,
                DateStartExpiration: '',
                DateEndExpiration: '',
                DateStartEffective: '',
                DateEndEffective: ''
              });
              page.setCurrentTanda(vm.currentPage);
              searchPolizas(vm.paramsPoliza);
            }
          }
          break;
        case "4":
          if (!vm.rol.agenteID || vm.rol.agenteID == 0) {
            mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Cartera: Pólizas", "", "", "", "g-myd-modal");
          } else {
            a1 = vm.formDataCartera.mConsultaDesdeAVi.value;
            m1 = vm.formDataCartera.mConsultaDesdeMVi.value;
            mDesde = m1 + '/' + a1;

            a2 = vm.formDataCartera.mConsultaHastaAVi.value;
            m2 = vm.formDataCartera.mConsultaHastaMVi.value;
            mHasta = m2 + '/' + a2;

            switch (calculaMeses(a1, a2, parseInt(m1), parseInt(m2))) {
              case -2:
              case -1:
                mModalAlert.showInfo('El rango de fecha no debe ser negativo', 'Cartera. Polizas', "", "", "", "g-myd-modal");
                break;
              case 0:
              case 1:
                vm.paramsPoliza = _.assign({}, getParamsPoliza(), {
                  DocumentTypeCode: (ng.isUndefined(vm.formDataCartera.Cliente2)) ? '' : vm.formDataCartera.Cliente2.documentType,
                  DocumentTypeNumber: (ng.isUndefined(vm.formDataCartera.Cliente2)) ? '' : vm.formDataCartera.Cliente2.documentNumber,
                  PolicyNumber: '',
                  PlateCode: '',
                  DateStartExpiration: '',
                  DateEndExpiration: '',
                  DateStartEffective: mDesde,
                  DateEndEffective: mHasta
                });
                page.setCurrentTanda(vm.currentPage);
                searchPolizas(vm.paramsPoliza);
                break;
            }
          }
          break;
        case "5":
          if (!vm.rol.agenteID || vm.rol.agenteID == 0) {
            mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Cartera: Pólizas", "", "", "", "g-myd-modal");
          } else {
            a1 = vm.formDataCartera.mConsultaDesdeAVe.value;
            m1 = vm.formDataCartera.mConsultaDesdeMVe.value;
            mDesde = m1 + '/' + a1;

            a2 = vm.formDataCartera.mConsultaHastaAVe.value;
            m2 = vm.formDataCartera.mConsultaHastaMVe.value;
            mHasta = m2 + '/' + a2;

            switch (calculaMeses(a1, a2, parseInt(m1), parseInt(m2))) {
              case -2:
                mModalAlert.showInfo('El rango de fecha no debe ser negativo', 'Cartera. Polizas', "", "", "", "g-myd-modal");
                break;
              case -1:
                mModalAlert.showInfo('El rango de fecha no debe ser negativo', 'Cartera. Polizas', "", "", "", "g-myd-modal");
                break;
              case 0:
                mModalAlert.showInfo('El rango de fecha no debe exceder los 6 meses', 'Cartera. Polizas', "", "", "", "g-myd-modal");
                break;
              case 1:
                vm.paramsPoliza = _.assign({}, getParamsPoliza(), {
                  DocumentTypeCode: '',
                  DocumentTypeNumber: '',
                  PolicyNumber: '',
                  PlateCode: '',
                  DateStartExpiration: mDesde,
                  DateEndExpiration: mHasta,
                  DateStartEffective: '',
                  DateEndEffective: ''
                });
                page.setCurrentTanda(vm.currentPage);
                searchPolizas(vm.paramsPoliza);
                break;
            }
          }
          break;
      }
    }

    function getParamsPoliza() {
      vm.currentPage = 1;
      return {
        StateCode: vm.formDataCartera.Estado.value,
        RamoId: (vm.formDataCartera.Ramo.identifierId == null) ? '0' : vm.formDataCartera.Ramo.identifierId,
        groupSector: vm.formDataCartera.Sector ? vm.formDataCartera.Sector.code : "T",
        RoleType: (vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
        CodeManagerOffice: vm.dataTicket.codeManagerOffice,
        agentId: vm.rol.agenteID,
        ManagerId: vm.rol.gestorID,
        RowByPage: vm.itemsXTanda,
        CurrentPage: vm.currentPage,
        UserCode: vm.dataTicket.userCode
      };
    }

    function searchPolizas(params) {
      gcwFactory.getListPagingPolicyFilter(params, true).then(
        function (response) {
          if (response.data) {

            if (response.data.list.length > 0) {
              vm.polizas = response.data.list;

              //almacenar (storage) data.list obtenida por la consulta
              //para tenerla en caso se "regrese" desde detalle poliza

              vm.totalItems = response.data.totalRows;
              gcwFactory.addVariableSession('dataSession', response.data);

              vm.totalPages = response.data.totalPages;
              vm.noResult = false;

              if (vm.formDataCartera.mOpcionTipoBusqueda == "2") {

                $rootScope.codeAgent = (vm.polizas[0].agentId == 0) ? "" : vm.polizas[0].agentId;
                $rootScope.nameAgent = (vm.polizas[0].agentDescription == undefined) ? "" : vm.polizas[0].agentDescription;

                $rootScope.codeManager = vm.polizas[0].managerId;
                $rootScope.descriptionManager = vm.polizas[0].managerDescription;

                $rootScope.polizaAnulada = vm.formDataCartera.mOpcionTipoBusqueda;
                $rootScope.$broadcast('anuladasPorDeuda');

              } else {
                $rootScope.codeAgent = undefined;
                $rootScope.nameAgent = undefined;
                $rootScope.codeManager = undefined;
                $rootScope.descriptionManager = undefined;
              }

            } else {
              vm.polizas = [];
              vm.totalItems = 0;
              vm.totalPages = 0;
              vm.noResult = true;
              vm.firstSearch = true;
            }
          } else {
            vm.polizas = [];
            vm.totalItems = 0;
            vm.totalPages = 0;
            vm.noResult = true;
            vm.firstSearch = true;
            //$rootScope.polizaAnulada = "1";
            $rootScope.$broadcast('anuladasPorDeuda');
          }
          page.setNroTotalRegistros(vm.totalItems).setDataActual(vm.polizas).setConfiguracionTanda();
          setLstCurrentPage();
        }, function (error) {
          //mModalAlert.showError(error.data.data.message, "Error");
        });
    }

    function setLstCurrentPage() {
      vm.polizas = page.getItemsDePagina();
    }

    function limpiar() {
      vm.formDataCartera.mOpcionTipoBusqueda = "1";

      $rootScope.$emit('cliente:borrar');

      vm.formDataCartera.Cliente1 = undefined;
      vm.formDataCartera.Cliente2 = undefined;

      $rootScope.polizaAnulada = "1";
      $rootScope.reloadAgent = false;
      $rootScope.$broadcast('anuladasPorDeuda');

      vm.formDataCartera.mNumPoliza = '';
      vm.formDataCartera.mNumPlaca = '';
      vm.polizas = null;
      vm.totalItems = 0;
      vm.totalPages = 0;
      vm.noResult = true;
      vm.firstSearch = true;
      vm.formDataCartera.Estado = {};
      vm.formDataCartera.Sector = {};
      vm.formDataCartera.Ramo = {};
      vm.formDataCartera.Estado.value = 'T';
      vm.formDataCartera.Sector.code = null;
      vm.formDataCartera.Ramo.identifierId = null;
      // vm.formDataCartera.mTipoFecha = "1";

      var date = new Date();
      vm.formDataCartera.mConsultaDesdeAVi.value = date.getFullYear();
      vm.formDataCartera.mConsultaDesdeMVi.value = date.getMonth() + 1;

      vm.formDataCartera.mConsultaHastaAVi.value = date.getFullYear();
      vm.formDataCartera.mConsultaHastaMVi.value = date.getMonth() + 1

      vm.formDataCartera.mConsultaDesdeAVe.value = date.getFullYear();
      vm.formDataCartera.mConsultaDesdeMVe.value = date.getMonth() + 1;

      vm.formDataCartera.mConsultaHastaAVe.value = date.getFullYear();
      vm.formDataCartera.mConsultaHastaMVe.value = date.getMonth() + 1

      $rootScope.codeAgent = undefined;
      $rootScope.nameAgent = undefined;
      $rootScope.codeManager = undefined;
      $rootScope.descriptionManager = undefined;

      gcwFactory.cleanStorage();
      gcwFactory.eliminarVariableSession('totalItemsSession');
    }

    function pageChanged(event) {
      var params, mDesde, mHasta;

      var sessionAgente = gcwFactory.getVariableSession('rolSessionA');
      var sessionGestor = gcwFactory.getVariableSession('rolSessionG');

      if (!ng.isUndefined($rootScope.preLocPoliza)) {
        vm.rol = gcwFactory.getVariableSession('rolSession');
        vm.rol.agenteID = (ng.isUndefined(sessionAgente.id)) ? $rootScope.cabecera.agente.id : sessionAgente.id;
        vm.rol.gestorID = (ng.isUndefined(sessionGestor.id)) ? $rootScope.cabecera.gestor.id : sessionGestor.id;
      } else {
        vm.rol = gcwFactory.obtenerAgente(vm.dataTicket);
      }

      // obj para nroTanda
      var currentPage = new Object();

      switch (vm.formDataCartera.mOpcionTipoBusqueda.toString()) {
        case "1":
          params = {
            StateCode: vm.formDataCartera.Estado.value,
            DocumentTypeCode: vm.formDataCartera.Cliente1.documentType,
            DocumentTypeNumber: vm.formDataCartera.Cliente1.documentNumber,
            PolicyNumber: '',
            DateStartExpiration: '',
            DateEndExpiration: '',
            DateStartEffective: '',
            DateEndEffective: '',
            RamoId: (vm.formDataCartera.Ramo.identifierId == null) ? '0' : vm.formDataCartera.Ramo.identifierId,
            groupSector: vm.formDataCartera.Sector ? vm.formDataCartera.Sector.code : "T",
            PlateCode: '',
            RoleType: (vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
            CodeManagerOffice: vm.dataTicket.codeManagerOffice,
            agentId: vm.rol.agenteID,
            ManagerId: vm.rol.gestorID,
            RowByPage: vm.itemsXTanda,
            UserCode: vm.dataTicket.userCode
          }
          page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function (nroTanda) {
            params.CurrentPage = nroTanda;
            searchPolizas(params);
          }, setLstCurrentPage);
          break;
        case "2":
          params = {
            StateCode: vm.formDataCartera.Estado.value,
            DocumentTypeCode: '',
            DocumentTypeNumber: '',
            PolicyNumber: vm.formDataCartera.mNumPoliza,
            DateStartExpiration: '',
            DateEndExpiration: '',
            DateStartEffective: '',
            DateEndEffective: '',
            RamoId: (vm.formDataCartera.Ramo.identifierId == null) ? '0' : vm.formDataCartera.Ramo.identifierId,
            groupSector: vm.formDataCartera.Sector ? vm.formDataCartera.Sector.code : "T",
            PlateCode: '',
            RoleType: (vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
            CodeManagerOffice: vm.dataTicket.codeManagerOffice,
            agentId: vm.rol.agenteID,
            ManagerId: vm.rol.gestorID,
            RowByPage: vm.itemsXTanda,
            UserCode: vm.dataTicket.userCode
          }
          page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function (nroTanda) {
            params.CurrentPage = nroTanda;
            searchPolizas(params);
          }, setLstCurrentPage);

          break;
        case "3":
          params = {
            StateCode: vm.formDataCartera.Estado.value,
            DocumentTypeCode: '',
            DocumentTypeNumber: '',
            PolicyNumber: '',
            DateStartExpiration: '',
            DateEndExpiration: '',
            DateStartEffective: '',
            DateEndEffective: '',
            RamoId: (vm.formDataCartera.Ramo.identifierId == null) ? '0' : vm.formDataCartera.Ramo.identifierId,
            groupSector: vm.formDataCartera.Sector ? vm.formDataCartera.Sector.code : "T",
            PlateCode: vm.formDataCartera.mNumPlaca,
            RoleType: (vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
            CodeManagerOffice: vm.dataTicket.codeManagerOffice,
            agentId: vm.rol.agenteID,
            ManagerId: vm.rol.gestorID,
            RowByPage: vm.itemsXTanda,
            UserCode: vm.dataTicket.userCode
          }
          page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function (nroTanda) {
            params.CurrentPage = nroTanda;
            searchPolizas(params);
          }, setLstCurrentPage);

          break;
        case "4":
          mDesde = vm.formDataCartera.mConsultaDesdeMVi.value + '/' + vm.formDataCartera.mConsultaDesdeAVi.value;
          mHasta = vm.formDataCartera.mConsultaHastaMVi.value + '/' + vm.formDataCartera.mConsultaHastaAVi.value;

          params = {
            StateCode: vm.formDataCartera.Estado.value,
            DocumentTypeCode: (ng.isUndefined(vm.formDataCartera.Cliente2)) ? '' : vm.formDataCartera.Cliente2.documentType,
            DocumentTypeNumber: (ng.isUndefined(vm.formDataCartera.Cliente2)) ? '' : vm.formDataCartera.Cliente2.documentNumber,
            PolicyNumber: '',
            DateStartExpiration: '',
            DateEndExpiration: '',
            DateStartEffective: mDesde,
            DateEndEffective: mHasta,
            RamoId: (vm.formDataCartera.Ramo.identifierId == null) ? '0' : vm.formDataCartera.Ramo.identifierId,
            groupSector: vm.formDataCartera.Sector ? vm.formDataCartera.Sector.code : "T",
            PlateCode: '',
            RoleType: (vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
            CodeManagerOffice: vm.dataTicket.codeManagerOffice,
            agentId: vm.rol.agenteID,
            ManagerId: vm.rol.gestorID,
            RowByPage: vm.itemsXTanda,
            UserCode: vm.dataTicket.userCode
          }
          page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function (nroTanda) {
            params.CurrentPage = nroTanda;
            searchPolizas(params);
          }, setLstCurrentPage);

          break;
        case "5":
          mDesde = vm.formDataCartera.mConsultaDesdeMVe.value + '/' + vm.formDataCartera.mConsultaDesdeAVe.value;
          mHasta = vm.formDataCartera.mConsultaHastaMVe.value + '/' + vm.formDataCartera.mConsultaHastaAVe.value;

          params = {
            StateCode: vm.formDataCartera.Estado.value,
            DocumentTypeCode: '',
            DocumentTypeNumber: '',
            PolicyNumber: '',
            DateStartExpiration: mDesde,
            DateEndExpiration: mHasta,
            DateStartEffective: '',
            DateEndEffective: '',
            RamoId: (vm.formDataCartera.Ramo.identifierId == null) ? '0' : vm.formDataCartera.Ramo.identifierId,
            groupSector: vm.formDataCartera.Sector ? vm.formDataCartera.Sector.code : "T",
            PlateCode: '',
            RoleType: (vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
            CodeManagerOffice: vm.dataTicket.codeManagerOffice,
            agentId: vm.rol.agenteID,
            ManagerId: vm.rol.gestorID,
            RowByPage: vm.itemsXTanda,
            UserCode: vm.dataTicket.userCode
          }
          page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function (nroTanda) {
            params.CurrentPage = nroTanda;
            searchPolizas(params);
            currentPage.value = nroTanda;
            gcwFactory.addVariableSession('currentPage', currentPage);
          }, setLstCurrentPage);

          break;
      }
    }

    function irDetallePoliza(poliza) {
      vm.formDataCartera.polizaDetail = poliza;
      gaService.add({ gaCategory: 'CG - Cartera', gaAction: 'MPF - Polizas - Click fila de resultados', gaLabel: 'Click: fila', gaValue: 'Periodo Regular' });
      if (poliza.validateDetail === 'S') {
        gcwFactory.getValidatePolicy(poliza.policyNumber, vm.dataTicket.roleType, '0', true).then(
          function (response) {
            mModalAlert.showInfo(response.data.description, "Cartera: Pólizas").then(function (response) {
            }, function (error) {
            });
          });
      } else {
        $state.go('consulta.polizaDetalle', { id: poliza.policyNumber }, { reload: false, inherit: false });

        gcwFactory.addVariableSession("polizaDetail", vm.formDataCartera.polizaDetail);
        gcwFactory.addVariableSession('formSession', getFormSession());
        gcwFactory.addVariableSession('rolSession', vm.rol);
        gcwFactory.addVariableSession('cabeceraSession', $rootScope.cabecera);
      }
    }

  } // end controller

  return ng.module('appGcw')
    .controller('PolizasController', PolizasController)
    .component('gcwPolizas', {
      templateUrl: '/gcw/app/components/cartera/polizas/polizas.html',
      controller: 'PolizasController',
      controllerAs: 'vm',
      bindings: {
      }
    });
});