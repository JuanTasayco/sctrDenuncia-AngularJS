define([
  'angular', 'constants', 'lodash',
  '/gcw/app/factory/gcwFactory.js', 'fexConsult'
], function (ng, constants, _) {

  DocumentosPagarController.$inject = [
    '$scope',
    'gcwFactory',
    'gaService',
    '$uibModal',
    'mModalAlert',
    'mModalConfirm',
    '$rootScope',
    '$sce',
    '$timeout',
    'MxPaginador',
    '$state',
    '$q',
    'mpSpin',
    '$http',
    'httpData',
    '$window',
    'mainServices'
  ];

  function DocumentosPagarController(
    $scope,
    gcwFactory,
    gaService,
    $uibModal,
    mModalAlert,
    mModalConfirm,
    $rootScope,
    $sce,
    $timeout,
    MxPaginador,
    $state,
    $q,
    mpSpin,
    $http,
    httpData,
    $window,
    mainServices
  ) {
    var vm = this;
    var page;

    vm.$onInit = function () {
      $rootScope.currentURL = $state.current.url;
      $rootScope.$broadcast('comprobanteRemitido');
      $rootScope.$broadcast('dashboard');
      $rootScope.$broadcast('networkInit');
      $rootScope.$broadcast('msgSinResultados');

      vm.showClientRow = false;
      vm.showColDiasVenc = false;
      vm.showColPoliza = true;
      vm.showColDetalles = true;
      vm.colDktp1 = true;
      vm.colDktp2 = false;

      vm.itemsXPagina = 10;
      vm.itemsXTanda = vm.itemsXPagina * 10;
      vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
      page = new MxPaginador();
      page.setNroItemsPorPagina(vm.itemsXPagina);

      vm.formDocPagar = {};
      vm.formDocPagar.optRadioTap1 = "1";
      vm.formDocPagar.DocPagar = "Cobranzas - Documentos Por Pagar";

      vm.pageChanged = pageChanged;
      vm.firstLoad = false; //primera carga en false
      vm.noResult = true;

      vm.cabecera = $rootScope.cabecera;
      gcwFactory.cleanStorage();
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
    }

    vm.buscar = buscar;
    vm.limpiar = limpiar;
    vm.sendEmail = sendEmail;
    vm.copy = copy;

    vm.showModalDocPagarDetalle = showModalDocPagarDetalle;

    $scope.$watch('vm.formDocPagar.optRadioTap1', function () {
      if (vm.totalRows >= 1) {
        switch (vm.formDocPagar.optRadioTap1.toString()) {
          case "1":
            vm.verSegmento = false;
            vm.verBtnEstado = false;
            break;
          case "2":
            vm.verSegmento = false;
            vm.verBtnEstado = false;
            break;
          case "3":
            vm.verSegmento = true;
            vm.verBtnEstado = true;
            break;
        }
      }
    });

    vm.showCols = showCols;

    function getListaDocPagar(params) {
      var docs;
      gcwFactory.getDocPagar(params, true).then(
        function (response) {
          if (response.data) {
            if (response.data.list.length > 0) {
              docs = response.data.list;
              vm.clientName = response.data.clientName;
              vm.commercialSegment = response.data.commercialSegment;
              vm.totalPages = response.data.totalPages;
              vm.totalRows = response.data.totalRows;

              if (vm.formDocPagar.optRadioTap1.toString() == "2") { //por poliza

                var filter = {
                  policyNumber: vm.formDocPagar.mNumPoliza,
                  documentTypeCode: '',
                  documentTypeNumber: '',
                  roleType: vm.dataTicket.roleType,
                  managerId: 0
                }
                gcwFactory.getGestorAgentePorPoliza(filter, false).then(function (response) {
                  var ga = {};
                  ga = response.data;

                  $rootScope.codeAgent = (ng.isUndefined(ga.agentId) || ga.agentId == 0) ? "" : ga.agentId.toString();
                  $rootScope.nameAgent = (ng.isUndefined(ga.agentNameFull)) ? "" : ga.agentNameFull;

                  $rootScope.codeManager = (ng.isUndefined(ga.managerId) || ga.managerId == 0) ? "" : ga.managerId.toString();
                  $rootScope.descriptionManager = ng.isUndefined(ga.managerNameFull) ? "INDEFINIDO" : ga.managerNameFull;

                  if ($rootScope.codeAgent == "" && $rootScope.nameAgent == "")
                    vm.cabecera.agente = "";

                  $rootScope.polizaAnulada = vm.formDocPagar.optRadioTap1;
                  $rootScope.$broadcast('anuladasPorDeuda');
                });

              } else {
                $rootScope.codeAgent = undefined;
                $rootScope.nameAgent = undefined
                $rootScope.codeManager = undefined;
                $rootScope.descriptionManager = undefined

                $rootScope.polizaAnulada = vm.formDocPagar.optRadioTap1;
              }

            } else {
              docs = [];
              vm.totalRows = 0;
              vm.totalPages = 0;
            }

          } else {
            docs = [];
            vm.totalRows = 0;
            vm.totalPages = 0;
          }
          page.setNroTotalRegistros(vm.totalRows).setDataActual(docs).setConfiguracionTanda();
          setLstCurrentPage();
        });
    }

    function sendEmail(event,poliza) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      if(poliza.client.email){
        mModalConfirm.confirmWarning('¿Está seguro de enviar correo de enlace de Pago a ' + poliza.client.email +'?','','')
        .then(function () {
          gcwFactory.getSendLinkPago(gcwFactory.requestDocPagar(poliza)).then(function (response) {
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
    function copy(event,poliza) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      

    gcwFactory.getLinkPago(gcwFactory.requestDocPagar(poliza)).then(function (response) {
      navigator.clipboard.writeText(response.data.url)
      .then(() => {
        mModalAlert.showSuccess("El enlace fue copiado en el portapapeles", "")
        })
    }).catch(function () {
      mModalAlert.showError("Error al generar enlace", "")
    })   
   }

    function setLstCurrentPage() {
      vm.docs = page.getItemsDePagina();
    }

    function getParams() {
      switch (vm.formDocPagar.optRadioTap1.toString()) {
        case "1": //por tiempo
          vm.verSegmento = false;
          vm.verBtnEstado = false;
          return {
            situationCode: vm.formDocPagar.Situacion.code,
            policyNumber: "",
            ramo: {
              ramoId: (ng.isUndefined(vm.formDocPagar.Ramo.ramoId) || vm.formDocPagar.Ramo.ramoId === null) ? 0 : vm.formDocPagar.Ramo.ramoId,
            },
            client: {
              documentType: '',
              documentNumber: ''
            },
            RoleType: (typeof vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
            agentId: vm.rol.agenteID,
            managerId: vm.rol.gestorID,
            RowByPage: vm.itemsXTanda,
            CurrentPage: vm.currentPage
          };
          break;
        case "2": //por poliza
          vm.verSegmento = false;
          vm.verBtnEstado = false;
          return {
            situationCode: 'PL',
            policyNumber: vm.formDocPagar.mNumPoliza,
            ramo: {
              ramoId: 0,
            },
            client: {
              documentType: '',
              documentNumber: ''
            },
            RoleType: (typeof vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
            agentId: vm.rol.agenteID,
            managerId: vm.rol.gestorID,
            RowByPage: vm.itemsXTanda,
            CurrentPage: vm.currentPage
          };
          break;
        case "3": //por cliente
          vm.verSegmento = true;
          vm.verBtnEstado = true;
          return {
            situationCode: 'CL',
            policyNumber: '',
            ramo: {
              ramoId: 0,
            },
            client: {
              documentType: (typeof vm.formDocPagar.Cliente == 'undefined') ? '' : vm.formDocPagar.Cliente.documentType,
              documentNumber: (typeof vm.formDocPagar.Cliente == 'undefined') ? '' : vm.formDocPagar.Cliente.documentNumber
            },
            RoleType: (typeof vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
            agentId: vm.rol.agenteID,
            managerId: vm.rol.gestorID,
            RowByPage: vm.itemsXTanda,
            CurrentPage: vm.currentPage
          };
          break;
      }
    }

    function pageChanged(event) {
      vm.selectAll(false);
      vm.mCheckAll = false;
      switch (vm.formDocPagar.optRadioTap1.toString()) {
        case "1":
          vm.params = {
            situationCode: vm.formDocPagar.Situacion.code,
            policyNumber: "",
            ramo: {
              ramoId: (ng.isUndefined(vm.formDocPagar.Ramo.ramoId) || vm.formDocPagar.Ramo.ramoId === null) ? 0 : vm.formDocPagar.Ramo.ramoId,
            },
            client: {
              documentType: '',
              documentNumber: ''
            },
            RoleType: (typeof vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
            agentId: vm.rol.agenteID,
            managerId: vm.rol.gestorID,
            RowByPage: vm.itemsXTanda
          };
          break;
        case "2":
          vm.params = {
            situationCode: 'PL',
            policyNumber: vm.formDocPagar.mNumPoliza,
            ramo: {
              ramoId: 0,
            },
            client: {
              documentType: '',
              documentNumber: ''
            },
            RoleType: (typeof vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
            agentId: vm.rol.agenteID,
            managerId: vm.rol.gestorID,
            RowByPage: vm.itemsXTanda
          };
          break;
        case "3":
          vm.params = {
            situationCode: 'CL',
            policyNumber: '',
            ramo: {
              ramoId: 0,
            },
            client: {
              documentType: (typeof vm.formDocPagar.Cliente == 'undefined') ? '' : vm.formDocPagar.Cliente.documentType,
              documentNumber: (typeof vm.formDocPagar.Cliente == 'undefined') ? '' : vm.formDocPagar.Cliente.documentNumber
            },
            RoleType: (typeof vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
            agentId: vm.rol.agenteID,
            managerId: vm.rol.gestorID,
            RowByPage: vm.itemsXTanda
          };
          break;
      };
      page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(
        function (nroTanda) {
          vm.params.CurrentPage = nroTanda;
          getListaDocPagar(vm.params);
        }, setLstCurrentPage);
    }

    function buscar() {
      vm.rol = gcwFactory.obtenerAgente(vm.dataTicket);

      switch (vm.formDocPagar.optRadioTap1.toString()) {
        case "1":
          if (vm.cabecera && typeof vm.dataTicket != 'undefined') {
            if (!vm.rol.agenteID || vm.rol.agenteID == 0) {
              mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Cobranzas: Documentos por pagar");
            } else {
              vm.currentPage = 1;
              vm.params = getParams();
              page.setCurrentTanda(vm.currentPage);
              getListaDocPagar(vm.params);
            }
          }
          break;
        case "2":
          if (vm.formDocPagar.mNumPoliza == "" || ng.isUndefined(vm.formDocPagar.mNumPoliza)) {
            mModalAlert.showInfo("Ingrese una póliza antes de iniciar la consulta", "Cobranzas: Documentos por pagar");
          } else {
            vm.currentPage = 1;
            vm.params = getParams();
            page.setCurrentTanda(vm.currentPage);
            getListaDocPagar(vm.params);
          }

          break;
        case "3":
          if (vm.cabecera && typeof vm.dataTicket != 'undefined') {
            if (!vm.rol.agenteID || vm.rol.agenteID == 0) {
              mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Cobranzas: Documentos por pagar");
            } else {
              if (ng.isUndefined(vm.formDocPagar.Cliente)) {
                mModalAlert.showInfo("Seleccione un cliente para iniciar la consulta", "Cobranzas: Documentos por pagar");
              } else {
                vm.currentPage = 1;
                vm.params = getParams();
                page.setCurrentTanda(vm.currentPage);
                getListaDocPagar(vm.params);
              }
            }
          }
          break;
      }
    }

    //@todo implementar
    function limpiar() {
      $rootScope.$emit('cliente:borrar');
      vm.formDocPagar.optRadioTap1 = "1";
      vm.formDocPagar.mNumPoliza = '';
      vm.formDocPagar.Situacion = {};
      vm.formDocPagar.Situacion.code = "PE30";
      vm.docs = null;
      vm.noResult = true;
      vm.firstLoad = true;
      vm.totalPages = 0;
      vm.totalRows = 0;

      vm.formDocPagar.Ramo = null;
      vm.formDocPagar.Cliente = undefined;
    }

    function showModalDocPagarDetalle(item, event) {
      gaService.add({ gaCategory: 'CG - Cobranzas', gaAction: 'MPF - Documentos por pagar - Click Resultado', gaLabel: 'Ver: Detalle', gaValue: 'Periodo Regular' });
      var hasClassSendEmail = angular.element(event.target).hasClass('sendEmail');

      if (hasClassSendEmail) {
        modalEnvioMail();
        return;
      }

      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal--lg fade',
        templateUrl: '/gcw/app/components/cobranzas/documentos-pagar/modal-documento-pagar-detalle.html',
        controller: ['$scope', '$uibModalInstance', function (scope, $uibModalInstance) {

          if (vm.formDocPagar.optRadioTap1 == "1") {
            vm.situationType = vm.formDocPagar.Situacion.code;
          } else if (vm.formDocPagar.optRadioTap1 == "2") {
            vm.situationType = 'PL';
          } else if (vm.formDocPagar.optRadioTap1 == "3") {
            vm.situationType = 'CL';
          }

          vm.filterDocPagarDetalle = {
            documentNumber: item.documentNumber,
            situationType: vm.situationType,
            agentId: vm.rol.agenteID,
            managerId: vm.rol.gestorID,
            client: {
              documentType: item.client.documentType,
              documentNumber: item.client.documentNumber
            }
          };
          gcwFactory.getDataDocPagarDetalle(vm.filterDocPagarDetalle, true).then(function (response) {
            if (response.data) {
              $scope.poliza = response.data.policyNumber;
              $scope.contratante = response.data.client.name;
              $scope.producto = response.data.ramo.description;
              $scope.compania = response.data.ramo.companyName;
              $scope.documento = response.data.documentNumber;
              $scope.tipoDocumento = response.data.documentTypeDescription;
              $scope.vencimiento = response.data.dateEffect;
              $scope.importe = response.data.amount;
              $scope.moneda = response.data.coinDescription;
              $scope.medio = response.data.collectionMethod.description;
              $scope.cliente = response.data.client.name;
              $scope.tipoDocumentoCliente = response.data.client.documentType;
              $scope.numDocumento = response.data.client.documentNumber;
              $scope.documento2 = $scope.tipoDocumentoCliente + ' ' + $scope.numDocumento;

              $scope.itemsSaldo = response.data.anticipates.length;
              if (response.data.anticipates.length > 0) {
                $scope.saldos = response.data.anticipates;
              }
            }
          });

          $scope.closeModal = function () {
            $uibModalInstance.close();
          };

          $scope.verDocumento = function () { //OIM-2160
            vm.downloadFile = {
              typeResponse: "REC",
              documentNumber: item.documentNumber,
              situationType: vm.situationType,
              agentId: vm.rol.agenteID,
              managerId: vm.rol.gestorID,
              client: {
                documentType: $scope.tipoDocumentoCliente,
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
              situationType: vm.situationType,
              agentId: vm.rol.agenteID,
              managerId: vm.rol.gestorID,
              client: {
                documentType: $scope.tipoDocumentoCliente,
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

    //Mostrar y ocultar columnas
    function showCols(radioValue, selectValue) {
      if (radioValue != 1) {
        vm.showClientRow = true;
      }

      if (radioValue == 1) {
        if (selectValue == 'VE' || selectValue == 'PA') {
          vm.showColDiasVenc = true;
          vm.showColPoliza = true;
          vm.showColDetalles = true;
          vm.colDktp1 = false;
          vm.colDktp2 = true;
        } else {
          vm.showColDiasVenc = false;
          vm.showColPoliza = true;
          vm.showColDetalles = true;
          vm.colDktp1 = true;
          vm.colDktp2 = false;
        }
      }

      if (radioValue == 2) {
        vm.showColDiasVenc = true;
        vm.showColPoliza = false;
        vm.showColDetalles = true;
        vm.colDktp1 = false;
        vm.colDktp2 = false;
      }

      if (radioValue == 3) {
        vm.showColDiasVenc = true;
        vm.showColPoliza = true;
        vm.showColDetalles = false;
        vm.colDktp1 = false;
        vm.colDktp2 = false;
      }

    }

    $scope.exportar = function () {

      _downloadReportFile();
    }

    function _downloadReportFile(){
      var ramo;
      if (vm.formDocPagar.optRadioTap1.toString() == "1") {
        vm.situationType = vm.formDocPagar.Situacion.code;
        ramo = (ng.isUndefined(vm.formDocPagar.Ramo.ramoId) || vm.formDocPagar.Ramo.ramoId === null) ? 0 : vm.formDocPagar.Ramo.ramoId;
      } else if (vm.formDocPagar.optRadioTap1.toString() == "2") {
        vm.situationType = 'PL';
        ramo = 0;
      } else if (vm.formDocPagar.optRadioTap1.toString() == "3") {
        vm.situationType = 'CL';
        ramo = 0;
      }
      const pathParams = {
        codObjeto: localStorage.getItem('codObjeto'),
        opcMenu: localStorage.getItem('currentBreadcrumb')
       };
      const downloadFileBody = {
        'situationCode': vm.situationType,
        'policyNumber': (typeof vm.formDocPagar.mNumPoliza == 'undefined') ? '' : vm.formDocPagar.mNumPoliza,
        'ramo': {
          ramoId: ramo
        },
        'client': {
          documentType: (typeof vm.formDocPagar.Cliente == 'undefined') ? '' : vm.formDocPagar.Cliente.documentType,
          documentNumber: (typeof vm.formDocPagar.Cliente == 'undefined') ? '' : vm.formDocPagar.Cliente.documentNumber
        },
        'RoleType': (typeof vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
        'agentId': vm.rol.agenteID,
        'managerId': vm.rol.gestorID,
        'UserCode': vm.dataTicket.userCode
      }
      const dataJsonRequest = 'json=' + JSON.stringify(downloadFileBody);
      const urlRequest = constants.system.api.endpoints.gcw + 'api/payment/document/download' +'?COD_OBJETO='+pathParams.codObjeto+'&OPC_MENU='+pathParams.opcMenu;

     httpData.postDownload(
      urlRequest,
      dataJsonRequest,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' },responseType: 'arraybuffer'},
      true
    ).then(function(data){
      mainServices.fnDownloadFileBase64(data.file, data.mimeType, data.defaultFileName, true);
    });

    }

    $scope.estadoDocumento = function () {
      if (ng.isUndefined(vm.formDocPagar.Cliente)) {
        mModalAlert.showInfo("Seleccione un cliente para descargar el estado de cuenta", "Cobranzas: Documentos por pagar");
      } else {
        var deferred = $q.defer();
        var documentType = ng.isUndefined(vm.formDocPagar.Cliente.documentType) ? '' : vm.formDocPagar.Cliente.documentType;
        var documentNumber = ng.isUndefined(vm.formDocPagar.Cliente.documentNumber) ? '' : vm.formDocPagar.Cliente.documentNumber;

        var downloadFile2 = {
          documentType: documentType,
          documentNumber: documentNumber,
          agentId: vm.rol.agenteID,
          UserCode: vm.dataTicket.userCode
        };

        var datajson = "json=" + JSON.stringify(downloadFile2);
        mpSpin.start();
        $http({
            method: "POST",
            url: constants.system.api.endpoints.gcw + "api/collection/document/statementAccount/download",
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: datajson,
            responseType: 'arraybuffer'
          })
          .then(function (data) {
            // success
            if (data.status == 200) {
              var today = new Date();
              var y = today.getFullYear();
              var m = today.getMonth();
              var d = today.getDate();
              var dateDownload = y.toString() + m.toString() + d.toString();

              var h = today.getHours();
              var m = today.getMinutes();
              var hourDownload = h.toString() + m.toString();

              var defaultFileName = documentType + '_' + documentNumber + '_' + dateDownload + '_' + hourDownload + '.pdf';
              defaultFileName = defaultFileName.replace(/[<>:"/\\|?*]+/g, '_');
              var vtype = data.headers(["content-type"]);
              var file = new Blob([data.data], {
                type: vtype
              });
              mpSpin.end();
              $window.saveAs(file, defaultFileName);
              deferred.resolve(defaultFileName);
            } else {
              mpSpin.end();
              mModalAlert.showError("No se encontraron documentos en la consulta", "Documentos Por Pagar");
            }
          }, function (response) { // optional // failed
            mpSpin.end();
            mModalAlert.showError("No se encontraron documentos en la consulta", "Documentos Por Pagar");
          });
      }
    }

    vm.selectDoc = selectDoc;
    function selectDoc(index, val) {
      vm.showEmailBtn = val;
      vm.docs[index].selected = val;

      for (var i = 0; i < vm.docs.length; i++) {
        if (vm.docs[i].selected) {
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

      for (var i = 0; i < vm.docs.length; i++) {
        vm.docs[i].selected = val;
      }
    }

    function showModalEnvioMail() {
      for (var i = 0; i < vm.docs.length; i++) {
        if (vm.docs[i].selected) {
          vm.paramsDocsPorPagar.push(vm.docs[i]);
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

        ng.forEach(vm.docs, function (item, key) {
          if (vm.docs[key].selected) {
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
    .controller('DocumentosPagarController', DocumentosPagarController)
    .component('gcwDocumentosPagar', {
      templateUrl: '/gcw/app/components/cobranzas/documentos-pagar/documentos-pagar.html',
      controller: 'DocumentosPagarController',
      controllerAs: 'vm',
      bindings: {}
    });
});