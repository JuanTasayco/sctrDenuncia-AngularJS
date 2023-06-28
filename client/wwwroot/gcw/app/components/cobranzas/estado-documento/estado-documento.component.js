define([
  'angular', 'constants',
  '/gcw/app/factory/gcwFactory.js', 'fexConsult'
], function (ng, constants) {

  EstadoDocumentoController.$inject = ['$scope', 'gcwFactory', '$uibModal', 'mModalAlert', 'mModalConfirm', '$rootScope', '$sce', '$timeout', '$state'];

  function EstadoDocumentoController($scope, gcwFactory, $uibModal, mModalAlert, mModalConfirm, $rootScope, $sce, $timeout, $state) {

    var vm = this;

    vm.$onInit = function () {

      $rootScope.currentURL = $state.current.url;
      $rootScope.$broadcast('comprobanteRemitido');
      $rootScope.$broadcast('dashboard');
      $rootScope.$broadcast('networkInit');
      $rootScope.$broadcast('msgSinResultados');

      vm.formEdoDoc = {};
      vm.noResultB = true;
      vm.firstSearchB = false;
      vm.onlyNumber = false;
      vm.docNumMaxLength = 20;
      vm.docNumMinLength = 1;
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
      vm.formEdoDoc.DocPagar = "Cobranzas - Estado de Documentos";
      vm.pageChanged = pageChanged;

      vm.firstLoadAgent = firstLoadAgent;
      vm.cabecera = $rootScope.cabecera;
      vm.obtenerAgente = obtenerAgente;

      $timeout(firstLoadAgent(), 1000);
    }

    vm.buscar = buscar;
    vm.limpiar = limpiar;
    vm.showDocumentoPago = showDocumentoPago;

    $rootScope.$watch('cabecera', function () {
      vm.cabecera = $rootScope.cabecera;
      vm.firstLoad = true;
    }, true);

    function firstLoadAgent() {
      vm.rol = {};
      vm.rol.gestorID = 0;
      vm.rol.agenteID = 0;
      vm.cabecera = $rootScope.cabecera;
    }

    function obtenerAgente() {
      switch (vm.dataTicket.roleCode) {
        case "GESTOR-OIM":
          return {
            gestorID: vm.dataTicket.oimClaims.agentID,
            agenteID: (vm.cabecera.agente == null) ? 0 : vm.cabecera.agente.id
          };
          break;
        case "DIRECTOR":
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
    // @todo
    function showDocumentoPago(item) {
      var hasClassSendEmail = angular.element(event.target).hasClass('sendEmail');

      if (hasClassSendEmail) {
        gcwFactory.openModalSendMail(item, $scope);
        return;
      }

      if (item.voucherPayment === "") { //muestra modal
        $uibModal.open({
          backdrop: true,
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          size: 'lg',
          windowTopClass: 'modal--lg fade',
          templateUrl: '/gcw/app/components/cobranzas/estado-documento/modal-estado-documento-detalle.html',
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
            gcwFactory.getDataEdoDocDetalle(vm.filter, true).then(function (response) {
              if (response.data) {
                $scope.poliza = response.data.policyNumber;
                $scope.contratante = response.data.client.name;
                $scope.producto = response.data.ramo.description;
                $scope.compania = response.data.ramo.companyName;
                $scope.documento = response.data.documentNumber;
                $scope.vencimiento = response.data.dateEffect;
                $scope.importe = response.data.amount;
                $scope.medio = response.data.collectionMethod.description;
                $scope.cliente = response.data.client.name;
                $scope.tipoDocumento = response.data.client.documentType;
                $scope.numDocumento = response.data.client.documentNumber;
                $scope.documento2 = $scope.tipoDocumento + ' ' + $scope.numDocumento;
                $scope.moneda = response.data.coinDescription;

                $scope.itemsSaldo = response.data.anticipates.length;
                if (response.data.anticipates.length > 0) {
                  $scope.saldos = response.data.anticipates;
                }
              }
            });

            $scope.closeModal = function () {
              $uibModalInstance.close();
            };

            $scope.verDocumento = function () {
              vm.downloadFile = {
                typeResponse: 'REC',
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
                typeResponse: 'APO',
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
      } else { //descarga comprobante. existe voucher de pago
        vm.downloadFile3 = {
          documentType: item.documentType,
          documentNumber: item.documentNumber,
          ramo: {
            companyId: item.ramo.companyId
          }
        };
        vm.verComprobanteURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw + 'api/history/voucher/download');

        $timeout(function () {
          document.getElementById('frmVerComprobante').submit();
        }, 500);

      }
    }

    function getEstadoDeDocumentos(filter) {
      gcwFactory.getEstadoDeDocumentos(filter, true).then(
        function (response) {
          if (response.data) {
            vm.totalPages = response.data.totalPages;
            vm.totalRows = response.data.totalRows;
            if (response.data.list.length > 0) {
              vm.estados = response.data.list;
            } else {
              vm.estados = [];
              vm.totalPages = 0;
              vm.totalRows = 0;
              vm.firstLoad = false;
            }
          } else {
            vm.estados = [];
            vm.totalRows = 0;
            vm.totalPages = 0;
            vm.firstLoad = false;
          }
        });
    }

    function buscar() {
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
      vm.rol = obtenerAgente();

      if (vm.cabecera && typeof vm.dataTicket !== 'undefined') {
        if (!vm.rol.agenteID) {
          mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Cobranzas: Estado de documentos");
        } else {
          if (typeof vm.formEdoDoc.mNumeroDocumento === 'undefined' || vm.formEdoDoc.mNumeroDocumento === '') {
            mModalAlert.showInfo("Debe ingresar un número de documento", "Nro. de documento");
          } else {
            vm.filter = {
              documentType: vm.formEdoDoc.mTipoDoc.code,
              documentNumber: vm.formEdoDoc.mNumeroDocumento,
              roleType: (typeof vm.dataTicket === 'undefined') ? '' : vm.dataTicket.roleType,
              agentId: vm.rol.agenteID,
              managerId: vm.rol.gestorID,
              RowByPage: "10",
              CurrentPage: "1"
            };
            getEstadoDeDocumentos(vm.filter);
          }
        }
      }
    }

    function limpiar() {
      vm.formEdoDoc = {}; //por poliza
      vm.firstLoad = true;
      vm.totalPages = -1;
      vm.totalRows = -1;
      vm.estados = [];
      vm.formEdoDoc.mNumeroDocumento = "";
    }

    //Paginacion
    function pageChanged(index) {
      vm.selectAll(false);
      vm.mCheckAll = false;
      vm.filter = {
        documentType: vm.formEdoDoc.mTipoDoc.code,
        documentNumber: vm.formEdoDoc.mNumeroDocumento,
        roleType: (typeof vm.dataTicket === 'undefined') ? '' : vm.dataTicket.roleType,
        agentId: vm.rol.agenteID,
        managerId: vm.rol.gestorID,
        RowByPage: "10",
        CurrentPage: index
      };
      getEstadoDeDocumentos(vm.filter);
    }

    function funDocNumMaxLength(documentType) {
      switch (documentType) {
        case constants.documentTypes.dni.Codigo:
          vm.docNumMaxLength = 8;
          vm.docNumMinLength = 8;
          vm.onlyNumber = true;
          break;
        case constants.documentTypes.ruc.Codigo:
          vm.docNumMaxLength = 11;
          vm.docNumMinLength = 11;
          vm.onlyNumber = true;
          break;
        default:
          vm.docNumMaxLength = 13;
          vm.docNumMinLength = 6;
          vm.onlyNumber = false;
      }
    }

    $scope.exportar = function () {
      vm.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw + 'api/collection/state/download');
      vm.downloadFile = {
        documentType: vm.formEdoDoc.mTipoDoc.code,
        documentNumber: vm.formEdoDoc.mNumeroDocumento,
        roleType: (typeof vm.dataTicket === 'undefined') ? '' : vm.dataTicket.roleType,
        agentId: vm.rol.agenteID,
        managerId: vm.rol.gestorID,
        userCode: vm.dataTicket.userCode
      };
      $timeout(function () {
        document.getElementById('frmExport').submit();
      }, 500);
    }

    vm.selectDoc = selectDoc;
    function selectDoc(index, val) {
      vm.showEmailBtn = val;
      vm.estados[index].selected = val;

      for (var i = 0; i < vm.estados.length; i++) {
        if (vm.estados[i].selected) {
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

      for (var i = 0; i < vm.estados.length; i++) {
        vm.estados[i].selected = val;
      }
    }

    function showModalEnvioMail() {
      for (var i = 0; i < vm.estados.length; i++) {
        if (vm.estados[i].selected) {
          vm.paramsDocsPorPagar.push(vm.estados[i]);
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

        ng.forEach(vm.estados, function (item, key) {
          if (vm.estados[key].selected) {
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
    .controller('EstadoDocumentoController', EstadoDocumentoController)
    .component('gcwEstadoDocumento', {
      templateUrl: '/gcw/app/components/cobranzas/estado-documento/estado-documento.html',
      controller: 'EstadoDocumentoController',
      controllerAs: 'vm',
      bindings: {}
    });
});
