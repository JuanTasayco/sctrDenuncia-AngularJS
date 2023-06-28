define([
  'angular', 'lodash', 'fexConsult'
], function (ng, _) {

  CronogramaPagosController.$inject = ['$scope', 'gcwFactory', '$uibModal', 'mModalAlert', 'mModalConfirm', '$rootScope', '$sce', '$timeout', 'MxPaginador', '$state', 'gaService'];

  function CronogramaPagosController($scope, gcwFactory, $uibModal, mModalAlert, mModalConfirm, $rootScope, $sce, $timeout, MxPaginador, $state, gaService) {
    var vm = this;
    var page;

    vm.$onInit = function () {

      bindLookups();
      $rootScope.currentURL = $state.current.url;
      $rootScope.$broadcast('comprobanteRemitido');
      $rootScope.$broadcast('dashboard');
      $rootScope.$broadcast('networkInit');
      $rootScope.$broadcast('msgSinResultados');

      vm.itemsXPagina = 10;
      vm.itemsXTanda = vm.itemsXPagina * 4;
      vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
      page = new MxPaginador();
      page.setNroItemsPorPagina(vm.itemsXPagina);

      vm.formDataCronPagos = {};

      //por defecto tiene q ser 2 pq la condicion para q traiga el agente por poliza
      //necesita que el optRadio sea 2 (por poliza)
      vm.formDataCronPagos.optRadioTap1 = "2";

      vm.formDataCronPagos.mTipoFecha = "1";
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
      vm.formDataCronPagos.Historial = "Cobranzas - Historial de Pagos";
      vm.pageChanged = pageChanged; //paginacion

      vm.historial = null;
      vm.firstLoad = true;

      vm.cabecera = $rootScope.cabecera;

      vm.validarAccion = validarAccion;
      vm.getGestorAgentePorPoliza = getGestorAgentePorPoliza;

      vm.rol = gcwFactory.obtenerAgente(vm.dataTicket);

    } //end onInit

    function bindLookups() {

      //ramos
      var pms = gcwFactory.getListRamo('', false);
      pms.then(function (response) {
        if (response.operationCode == 200)
          vm.listRamos = response.data || response.Data;
        else mModalAlert.showWarning(response.message, '')
      });
    }

    vm.open1 = open1;
    vm.verFiltro = false;
    vm.popup1 = {
      opened: false
    };
    vm.dateOptions = {
      maxDate: new Date()
    };
    vm.buscar = buscar;
    vm.limpiar = limpiar;
    vm.showDocPago = showDocPago; //modal detalle poliza
    vm.format = 'dd/MM/yyyy';
    vm.altInputFormats = ['M!/d!/yyyy'];
    vm.resetFiltro = resetFiltro;
    vm.cleanFields = cleanFields;

    vm.descargarDocPago = descargarDocPago;

    $scope.$watch('vm.formDataCronPagos.optRadioTap1', function () {
      if (vm.formDataCronPagos.optRadioTap1 == "2") {
        $rootScope.$emit('cliente:borrar');
      } else {
        vm.formDataCronPagos.mNumPoliza = "";
      }
    }, true);

    function validarAccion(item, event) {
      var hasClassSendEmail = angular.element(event.target).hasClass('sendEmail');

      if (hasClassSendEmail) {
        gcwFactory.openModalSendMail(item, $scope);
        return;
      }

      if (item.voucherPayment == '')
        showDocPago(item);
      else
        descargarDocPago(item);
    }

    function getListaHistorialPago(params) {
      gcwFactory.getHistorialPago(params, true).then(function (response) {
        var historial = [];
        vm.totalRows = 0;
        vm.totalPages = 0;
        if (response.data) {

          vm.clientName = response.data.clientName;
          vm.commercialSegment = response.data.commercialSegment;

          if (vm.formDataCronPagos.optRadioTap1.toString() == "2") { //por poliza

            var filter = {
              policyNumber: vm.formDataCronPagos.mNumPoliza,
              documentTypeCode: '',
              documentTypeNumber: '',
              roleType: vm.dataTicket.roleType,
              managerId: 0
            }
            gcwFactory.getGestorAgentePorPoliza(filter, false).then(function (response) {
              var ga = {};
              ga = response.data;

              $rootScope.codeAgent = (ng.isUndefined(ga.agentId) || ga.agentId == 0) ? "" : ga.agentId.toString();
              $rootScope.nameAgent = ng.isUndefined(ga.agentNameFull) ? "" : ga.agentNameFull;
              $rootScope.codeManager = (ng.isUndefined(ga.managerId) || ga.managerId == 0) ? "" : ga.managerId.toString();
              $rootScope.descriptionManager = ng.isUndefined(ga.managerNameFull) ? "INDEFINIDO" : ga.managerNameFull;

              $rootScope.polizaAnulada = vm.formDataCronPagos.optRadioTap1;
              $rootScope.$broadcast('anuladasPorDeuda');
            });

          } else {
            $rootScope.codeAgent = undefined;
            $rootScope.nameAgent = undefined;
            $rootScope.codeManager = undefined;
            $rootScope.descriptionManager = undefined;
            $rootScope.polizaAnulada = vm.formDataCronPagos.optRadioTap1;
          }

          if (response.data.list.length > 0) {
            historial = response.data.list;
            vm.totalPages = response.data.totalPages;
            vm.totalRows = response.data.totalRows;
          }
        }
        page.setNroTotalRegistros(vm.totalRows).setDataActual(historial).setConfiguracionTanda();
        setLstCurrentPage();
      });
    }

    function buscar(){
      var params;
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");

      switch (vm.formDataCronPagos.optRadioTap1.toString()) {
        case "2": // Por poliza
          if (ng.isUndefined(vm.formDataCronPagos.mNumPoliza) || vm.formDataCronPagos.mNumPoliza == '') {
            mModalAlert.showWarning("Debe ingresar un número de póliza", "");
          } else {

            // por polizas
            vm.currentPage = 1; // El paginador selecciona el nro 1
            vm.verFiltro = true;

            params = _.assign({}, getParams(), {
              policyNumber: vm.formDataCronPagos.mNumPoliza,
              client: {
                documentType: '',
                documentNumber: ''
              },
              ramo: {
                ramoId: (vm.ramo.ramoId == null || vm.formDataCronPagos.mTipoFecha == "1") ? 0 : vm.ramo.ramoId
              }
            });
            page.setCurrentTanda(vm.currentPage);
            getListaHistorialPago(params);
          }
          break;
        case "1": // Por cliente
          vm.rol = gcwFactory.obtenerAgente(vm.dataTicket);
          if (vm.cabecera && !ng.isUndefined(vm.dataTicket)) {
            if (ng.isUndefined(vm.formDataCronPagos.Cliente)) {
              mModalAlert.showWarning("Debe completar la información del cliente a consultar (TIPO/Nro. Documento)", "");
            } else {
              vm.currentPage = 1; // El paginador selecciona el nro 1
              vm.verFiltro = true;
              params = _.assign({}, getParams(), {
                policyNumber: '',
                client: {
                  documentType: (ng.isUndefined(vm.formDataCronPagos.Cliente)) ? '' : vm.formDataCronPagos.Cliente.documentType,
                  documentNumber: (ng.isUndefined(vm.formDataCronPagos.Cliente)) ? '' : vm.formDataCronPagos.Cliente.documentNumber
                },
                ramo: {
                  ramoId: (vm.ramo.ramoId == null || vm.formDataCronPagos.mTipoFecha == "1") ? 0 : vm.ramo.ramoId
                }
              });
              page.setCurrentTanda(vm.currentPage);
              getListaHistorialPago(params);
            }
          }
          break;
      }
    }

    function getGestorAgentePorPoliza(poliza) {
      var params = {
        policyNumber: poliza,
        documentTypeCode: '',
        documentTypeNumber: '',
        roleType: vm.dataTicket.roleType,
        managerId: vm.rol.gestorID
      };
      gcwFactory.getGestorAgentePorPoliza(params).then(function (response) {
        if (response.data) {
          return response.data;
        }
      });
    }

    function getParams() {
      var dateStart = (vm.formDataCronPagos.mTipoFecha == "1") ? "" : gcwFactory.formatearFecha(vm.fechaSiniestro);
      var dateEnd = (vm.formDataCronPagos.mTipoFecha == "1") ? "" : gcwFactory.formatearFecha(vm.fechaSiniestroFin);
      var params = {};
      params = {
        dateStart: ng.isUndefined(dateStart) ? "" : dateStart,
        dateEnd: ng.isUndefined(dateEnd) ? "" : dateEnd,
        RoleType: ng.isUndefined(vm.dataTicket) ? '' : vm.dataTicket.roleType,
        agentId: vm.rol.agenteID,
        managerId: vm.rol.gestorID,
        RowByPage: vm.itemsXTanda,
        CurrentPage: vm.currentPage
      }
      return params;
    }

    function setLstCurrentPage() {
      vm.historial = page.getItemsDePagina();
    }

    //Paginacion
    function pageChanged(event) {
      vm.selectAll(false);
      vm.mCheckAll = false;
      var dateStart = "";
      var dateEnd = "";
      if(vm.formDataCronPagos.mTipoFecha.toString() == "2"){
        dateStart = gcwFactory.formatearFecha(vm.fechaSiniestro);
        dateEnd = gcwFactory.formatearFecha(vm.fechaSiniestroFin);
      }

      var params = _.assign({}, getParams(), {
        dateStart: dateStart,
        dateEnd: dateEnd,
        ramo: {
          ramoId: (vm.ramo.ramoId == null || vm.formDataCronPagos.mTipoFecha == "1") ? 0 : vm.ramo.ramoId
        }
      });
      if (vm.formDataCronPagos.optRadioTap1.toString() == "2") {
        params = _.assign({}, getParams(), {
          policyNumber: vm.formDataCronPagos.mNumPoliza,
          client: {
            documentType: '',
            documentNumber: ''
          }
        });
      } else {
        params = _.assign({}, getParams(), {
          policyNumber: '',
          client: {
            documentType: (ng.isUndefined(vm.formDataCronPagos.Cliente)) ? '' : vm.formDataCronPagos.Cliente.documentType,
            documentNumber: (ng.isUndefined(vm.formDataCronPagos.Cliente)) ? '' : vm.formDataCronPagos.Cliente.documentNumber
          }
        });
      }

      page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function (nroTanda) {
        params.CurrentPage = nroTanda;
        getListaHistorialPago(params);
      }, setLstCurrentPage);
    }

    function changeOption(opt) {
      if (!verificaPoliza) {
        mModalAlert.showWarning("Debe ingresar un número de póliza", "");
      } else {
        vm.historial = null;
      }
    }

    function limpiar() {
      $rootScope.$emit('cliente:borrar');
      vm.formDataCronPagos.optRadioTap1 = "2"; //por poliza
      vm.formDataCronPagos.mTipoFecha = "1"; //filtro: vigencia actual por defecto
      vm.totalPages = 0;
      vm.totalRows = 0;
      vm.historial = null;
      vm.fechaSiniestro = "";
      vm.fechaSiniestroFin = "";
      vm.ramo.ramoId = null;
      vm.verFiltro = false;
      vm.formDataCronPagos.Cliente = undefined;
      vm.formDataCronPagos.mNumPoliza = "";
      vm.firstLoad = true;
    }

    function open1() {
      vm.popup1.opened = true;
    };

    function resetFiltro() {
      cleanFields();
    }

    function cleanFields() {
      vm.formDataCronPagos.mNumPoliza = "";
    }

    function showDocPago(item) {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal--lg fade',
        templateUrl: '/gcw/app/components/cobranzas/cronograma-pagos/modal-doc-pago.html',
        controller: ['$scope', '$uibModalInstance', function (scope, $uibModalInstance) {
          vm.filter = {
            documentNumber: item.documentNumber,
            situationType: '',
            agentId: vm.rol.agenteID,
            managerId: vm.rol.gestorID,
            client: {
              documentType: item.client.documentType,
              documentNumber: item.client.documentNumber
            }
          };

          gcwFactory.getDataDocPagarDetalleEstado(vm.filter, true).then(function (response) {
            if (response.data) {
              $scope.poliza = response.data.policyNumber;
              $scope.contratante = response.data.client.name;
              $scope.producto = response.data.ramo.description;
              $scope.compania = response.data.ramo.companyName;
              $scope.documento = response.data.documentNumber;
              $scope.vencimiento = response.data.dateEffect;
              $scope.importe = response.data.amount;
              $scope.moneda = response.data.coinDescription;
              $scope.medio = response.data.collectionMethod.description;
              $scope.cliente = response.data.client.name;
              $scope.tipoDocumento = response.data.documentType;
              $scope.tipoDocumentoDesc = response.data.documentTypeDescription;
              $scope.tipoDocumentoCliente = response.data.client.documentType;
              $scope.numDocumento = response.data.documentNumber;
              $scope.documento2 = response.tipoDocumentoCliente + ' ' + response.data.documentNumber;

              $scope.itemsSaldo = response.data.anticipates.length;
              if (response.data.anticipates.length > 0) {
                $scope.saldos = response.data.anticipates;
              }
            }
          });

          $scope.closeModal = function () {
            $uibModalInstance.close();
          };

          $scope.seleccionarCliente = function (value) {
            $scope.formModalCliente.Cliente = value;
            $uibModalInstance.close();
          };

          $scope.verDocumento = function () {
            vm.downloadFile = {
              typeResponse: "REC",
              documentNumber: item.documentNumber,
              situationType: '',
              agentId: vm.rol.agenteID,
              managerId: vm.rol.gestorID,
              client: {
                documentType: $scope.tipoDocumento,
                documentNumber: $scope.numDocumento
              }
            };
            vm.verDocumentoURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw + 'api/payment/document/receipt/download');

            $timeout(function () {
              document.getElementById('frmVerDocumento').submit();
            }, 500);

          };

          $scope.saldoFavor = function () { //OIM-2160
            vm.downloadFile2 = {
              typeResponse: "APO",
              documentNumber: item.documentNumber,
              situationType: '',
              agentId: vm.rol.agenteID,
              managerId: vm.rol.gestorID,
              client: {
                documentType: $scope.tipoDocumento,
                documentNumber: $scope.numDocumento
              }
            };
            vm.saldoFavorURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw + 'api/payment/document/receipt/download');

            $timeout(function () {
              document.getElementById('frmSaldoFavor').submit();
            }, 500);

          };

        }]
      });
    }

    function descargarDocPago(item) {
      vm.downloadFile2 = {
        ramo: {
          companyId: item.ramo.companyId
        },
        documentType: item.documentType,
        documentNumber: item.documentNumber
      };
      vm.descargarDocURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw + 'api/history/voucher/download');
      $timeout(function () {
        document.getElementById('frmDescargarDoc').submit();
      }, 500);
    }


    $scope.exportar = function () {
      gaService.add({ gaCategory: 'CG - Cobranzas', gaAction: 'MPF - Cronograma de pagos - Exportar', gaLabel: 'Botón: exportar', gaValue: 'Cronograma de pago' });
      vm.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw + 'api/payment/history/download');
      vm.downloadFile = {
        dateStart: (vm.formDataCronPagos.mTipoFecha == '1') ? '' : gcwFactory.formatearFecha(vm.fechaSiniestro),
        dateEnd: (vm.formDataCronPagos.mTipoFecha == '1') ? '' : gcwFactory.formatearFecha(vm.fechaSiniestroFin),
        RoleType: (ng.isUndefined(vm.dataTicket)) ? '' : vm.dataTicket.roleType,
        agentId: !vm.rol.agenteID ? 0 : vm.rol.agenteID,
        managerId: vm.rol.gestorID,
        UserCode: vm.dataTicket.userCode
      }
      if (vm.formDataCronPagos.optRadioTap1.toString() == "2") {
        vm.downloadFile.policyNumber = vm.formDataCronPagos.mNumPoliza;
        vm.downloadFile.client = {};
        vm.downloadFile.client = {
          documentType: '',
          documentNumber: ''
        }
      } else {
        vm.downloadFile.policyNumber = '';
        vm.downloadFile.client = {};
        vm.downloadFile.client = {
          documentType: (ng.isUndefined(vm.formDataCronPagos.Cliente)) ? '' : vm.formDataCronPagos.Cliente.documentType,
          documentNumber: (ng.isUndefined(vm.formDataCronPagos.Cliente)) ? '' : vm.formDataCronPagos.Cliente.documentNumber
        }
      }
      if (vm.formDataCronPagos.mTipoFecha == '2') {
        vm.downloadFile.ramo = {}
        vm.downloadFile.ramo.ramoId = (vm.ramo.ramoId == null || vm.formDataCronPagos.mTipoFecha == "1") ? 0 : vm.ramo.ramoId
      }
      $timeout(function () {
        document.getElementById('frmExport').submit();
      }, 500);
    }


    vm.selectDoc = selectDoc;
    function selectDoc(index, val) {
      vm.showEmailBtn = val;
      vm.historial[index].selected = val;

      for (var i = 0; i < vm.historial.length; i++) {
        if (vm.historial[i].selected) {
          vm.docsChecked = true;
          vm.mCheckAll = false;
          vm.mCheckAllValue = false;
          break;
        } else {
          vm.docsChecked = false;
        }
      }

      if (!vm.docsChecked) {
        vm.showEmailBtn = false;
        vm.showSelectAll = false;
        vm.mCheckAll = false;
        vm.mCheckAllValue = false;
      }
    }

    vm.showCheckAndButton = showCheckAndButton;
    function showCheckAndButton() {
      return true;
    }

    vm.selectAll = selectAll;
    function selectAll(val) {
      vm.showEmailBtn = val;
      vm.showSelectAll = val;
      vm.mCheckAllValue = val;

      for (var i = 0; i < vm.historial.length; i++) {
        vm.historial[i].selected = val;
      }
    }

    function showModalEnvioMail() {
      for (var i = 0; i < vm.historial.length; i++) {
        if (vm.historial[i].selected) {
          vm.paramsDocsPorPagar.push(vm.historial[i]);
        }
      }
    }

    vm.modalEnvioMail = modalEnvioMail;
    function modalEnvioMail() {
      vm.paramsDocsPorPagar = [];
      vm.listItemsDocsPorPagar = [];
      showModalEnvioMail();
      //Modal
      if (vm.paramsDocsPorPagar.length > 0) {

        ng.forEach(vm.historial, function (item, key) {
          if (vm.historial[key].selected) {
            vm.docSeleted = {
              voucherPayment: item.voucherPayment,
              ramo: {
                companyId: item.ramo.companyId
              },
              typeResponse: item.documentType,
              documentNumber: item.documentNumber,
              situationType: item.situationType,
              agentId: item.client.agent.agentId,
              managerId: item.client.agent.managerId,
              client: {
                documentType: item.client.documentType,
                documentNumber: item.client.documentNumber
              }
            };
            vm.listItemsDocsPorPagar.push(vm.docSeleted);
          }
        });

        gcwFactory.openModalSendMail(vm.listItemsDocsPorPagar, $scope);
      } else {
        mModalAlert.showInfo("Debe elegir por lo menos un documento.", "Advertencia");
      }
    }

  } // end controller

  return ng.module('appGcw')
    .controller('CronogramaPagosController', CronogramaPagosController)
    .component('gcwCronogramaPagos', {
      templateUrl: '/gcw/app/components/cobranzas/cronograma-pagos/cronograma-pagos.html',
      controller: 'CronogramaPagosController',
      controllerAs: 'vm',
      bindings: {}
    });
});
