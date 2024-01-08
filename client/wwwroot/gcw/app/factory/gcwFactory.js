define([
  'angular', 'constants', 'moment', 'lodash', 'fileSaver'
], function(angular, constants, moment, _, fileSaver) {

  var appCgw = angular.module('appGcw');

  appCgw.factory('gcwFactory', [
    '$rootScope'
    , 'proxyClaims'
    , '$window'
    , 'proxyLookup'
    , 'proxyPerson'
    , 'proxyPolicy'
    , 'proxySecurity'
    , 'proxyBenefit'
    , 'proxyAccident'
    , 'proxyPayment'
    , 'proxyRenewal'
    , 'proxyCancellation'
    , 'proxyLiquidationSoat'
    , 'proxyElement'
    , 'proxyParameter'
    , 'proxyState'
    , 'proxyVoucherForwarded'
    , 'proxyDetraction'
    , 'proxyStateReceipt'
    , 'proxyGenerated'
    , 'proxyBranchClient'
    , 'proxyMovement'
    , 'proxyRenovation'
    , 'proxyLiquidated'
    , 'proxyMapfreDollar'
    , 'proxySelfSettlement'
    , 'proxySinister'
    , 'mpSpin'
    , 'proxySinisterCar'
    , '$http'
    , '$q'
    , 'mModalAlert'
    , '$uibModal'
    , 'proxyInvoicesIssued'
    , 'proxyNetworkAgent'
    , 'proxyDashboardOffice'
    , 'oimProxyGcw'
    , 'httpData'
    , 'proxySector'
    , function(
      $rootScope
      , proxyClaims
      , $window
      , proxyLookup
      , proxyPerson
      , proxyPolicy
      , proxySecurity
      , proxyBenefit
      , proxyAccident
      , proxyPayment
      , proxyRenewal
      , proxyCancellation
      , proxyLiquidationSoat
      , proxyElement
      , proxyParameter
      , proxyState
      , proxyVoucherForwarded
      , proxyDetraction
      , proxyStateReceipt
      , proxyGenerated
      , proxyBranchClient
      , proxyMovement
      , proxyRenovation
      , proxyLiquidated
      , proxyMapfreDollar
      , proxySelfSettlement
      , proxySinister
      , mpSpin
      , proxySinisterCar
      , $http
      , $q
      , mModalAlert
      , $uibModal
      , proxyInvoicesIssued
      , proxyNetworkAgent
      ,proxyDashboardOffice
      , oimProxyGcw
      , httpData
      , proxySector) {

      function getIndexActionsMenu(){
        var menuStorage = JSON.parse(localStorage.getItem('evoSubMenuGCW'));
        return _.findIndex(menuStorage, {nombreCabecera: 'ACCIONES'});
      }

      function isDirector(){
        var profile = JSON.parse(localStorage.getItem('evoProfile'));
        var role = _.find(profile.rolesCode, {nombreAplicacion: 'GCW'});
        if(!angular.isUndefined(role)){
          return role.codigoRol === 'DIRECTOR';
        }
        return false;
      }

      function isVisibleNetwork(){
        var subMenuGCW = JSON.parse(localStorage.getItem('evoSubMenuGCW'));
        var itemsActions = _.find(subMenuGCW, {nombreCabecera: 'ACCIONES'});
        if(!angular.isUndefined(itemsActions)){
          var accessNetwork = _.find(itemsActions.items, {nombreCorto: 'ACCESO RED'})
          return !angular.isUndefined(accessNetwork)
        }
        return false;
      }

      function getAllNetworks(){
        return proxyLookup.GetAllNetworks(false);
      }
      function getTypeUser() {
        var profile = JSON.parse(localStorage.getItem('evoProfile'));
        return profile.userSubType;
      }

      function getRoleUser(){
        var profile = JSON.parse(localStorage.getItem('evoProfile'));
        var role = _.find(profile.rolesCode, {'nombreAplicacion': 'GCW'})
        return role.codigoRol === "AGPLAZA"
      }

      var addVariableSession = function(key, newObj) {
        var mydata = newObj;
        if (!_.isEmpty(mydata))
        {$window.sessionStorage.setItem(key, JSON.stringify(mydata));}
        else
        {$window.sessionStorage.setItem(key, '');}
      };

      var getVariableSession = function(key) {
        var mydata = $window.sessionStorage.getItem(key);
        if (!_.isEmpty(mydata)) {
          mydata = JSON.parse(mydata);
        }
        return mydata || [];
      };

      var eliminarVariableSession = function(key) {
        $window.sessionStorage.removeItem(key);
      };

      var cleanStorage = function() {
        eliminarVariableSession('formSession');
        eliminarVariableSession('dataSession');
        eliminarVariableSession('currentPage');
        eliminarVariableSession('renovacionDetail');
        eliminarVariableSession('polizaDetail');
        eliminarVariableSession('siniestroDetail');
        eliminarVariableSession('cabeceraSession');
        eliminarVariableSession('rolSession');
        eliminarVariableSession('rolSessionA');
        eliminarVariableSession('rolSessionG');
        eliminarVariableSession('clienteSession');
        eliminarVariableSession('showBtn');
        eliminarVariableSession('filterLiqSession');
        eliminarVariableSession('liqSession');
        eliminarVariableSession('amountSession');
        eliminarVariableSession('dataTandaSession');
        eliminarVariableSession('unCheckedSS');
        eliminarVariableSession('downloadFile');
        eliminarVariableSession('frmSessionNetwork');
        eliminarVariableSession('dataSessionAgentClient');
        eliminarVariableSession('sessionAgente');
      };

      var obtenerAgente = function(dataTicket) {
        var ga = {};
        switch (dataTicket.roleCode) {
          case 'GESTOR-OIM':
          case 'DIRECTOR':
            ga = {
              gestorID: dataTicket.codeManagerOffice,
              agenteID: ($rootScope.cabecera.agente == null) ? '0' : $rootScope.cabecera.agente.id
            };
            break;
          case 'GESTOR':
          case 'ADM-COBRA':
          case 'ADM-COMI':
          case 'ADM-RENOV':
          case 'ADM-SINIE':
          case 'ADM-CART':
            ga = {
              gestorID: ($rootScope.cabecera.gestor == null
            || $rootScope.cabecera.gestor.id == 0) ? '0' : $rootScope.cabecera.gestor.id,
              agenteID: ($rootScope.cabecera.agente == null) ? '0' : $rootScope.cabecera.agente.id
            };
            break;
          default:
            ga = {
              gestorID: 0,
              agenteID: ($rootScope.cabecera.agente) ? ($rootScope.cabecera.agente.id == null) ? 0 : $rootScope.cabecera.agente.id : dataTicket.oimClaims.agentID
            };
        }
        return ga;
      };

      function formatearFecha(fecha) {
        if (fecha instanceof Date) {
          var today = fecha;
          var dd = today.getDate();
          var mm = today.getMonth() + 1; // January is 0!

          if (dd === 32) {
            dd = 1;
            mm = today.getMonth() + 2;
          }

          if (dd < 10) {
            dd = '0' + dd;
          }
          if (mm < 10) {
            mm = '0' + mm;
          }

          var yyyy = today.getFullYear();
          return today = dd + '/' + mm + '/' + yyyy;
        }
      }

      function firstDate(fecha) {
        if (fecha instanceof Date) {
          var today = fecha;
          var dd = today.getDate();
          var mm = today.getMonth() + 1; // January is 0!

          if (dd === 32) {
            dd = 1;
            mm = today.getMonth() + 2;
          } else {
            dd = 1;
          }

          if (dd < 10) {
            dd = '0' + dd;
          }
          if (mm < 10) {
            mm = '0' + mm;
          }

          var yyyy = today.getFullYear();
          return today = dd + '/' + mm + '/' + yyyy;
        }
      }

      function agregarMes(fecha, meses) {
	    return new Date(fecha.setMonth(fecha.getMonth() + meses));
      }

      function lastYear(valueDate, numYear) {
        valueDate.setFullYear(valueDate.getFullYear() - numYear);
        return valueDate;
      }

      function restarMes(fecha, meses) {
        fecha.setMonth(fecha.getMonth() - meses);
        return fecha;
      }

      function restarDias(fecha, dias) {
        fecha.setDate(fecha.getDate() - dias);
        return fecha;
      }

      function agregarDias(fecha, meses) {
        var dias = 29;
        var newdate = fecha;

        if (meses == 2) {dias = 59;}

        newdate.setDate(newdate.getDate() + dias);

        var dd = newdate.getDate();
        var mm = newdate.getMonth() + 1;

        if (dd < 10) {
          dd = '0' + dd;
        }
        if (mm < 10) {
          mm = '0' + mm;
        }

        var y = newdate.getFullYear();

        var someFormattedDate = dd + '/' + mm + '/' + y;

        return someFormattedDate;
      }

      function diasTranscurridos(f1, f2) {
        f1 = moment(f1);
        f2 = moment(f2);
        return f2.diff(f1, 'days');
      }

      function mesesTranscurridos(f1, f2) {
        f1 = moment(f1);
        f2 = moment(f2);
        return f2.diff(f1, 'months');
      }

      function evaluarFechas(f1, f2) {
        if (diasTranscurridos(f1, f2) < 0) {
          mModalAlert.showInfo('El rango de fechas no debe ser negativo', 'Siniestros Autos');
          return false;
        } else {
          return true;
        }
      }

      function evaluarRango(f1, f2) {
        var a1 = f1.getFullYear();
        var m1 = f1.getMonth() + 1;
        var d1 = f1.getDate();

        var a2 = f2.getFullYear();
        var m2 = f2.getMonth() + 1;
        var d2 = f2.getDate();

        var limite = 180;
        var difA = (parseInt(a2) - parseInt(a1)) * 12;
        var difD = (parseInt(m2, 10) + difA - parseInt(m1, 10)) * 30 + parseInt(d2, 10) - parseInt(d1, 10);
        return (difD <= limite);
      }

      function openModalSendMail(list, scope) {
        scope.suplemento = list;
        // Modal
        $uibModal.open({
          backdrop: true, // background de fondo
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: scope,
          templateUrl: '/gcw/app/components/modalCarteraPoliza/component/modalEnvioMail.html',
          controller: ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
          // CloseModal
            $scope.close = function() {
              $uibModalInstance.close();
            };

            $scope.enviar = function() {
              if ($scope.frmSendMail.mPara && $scope.frmSendMail.mAsunto && !$scope.frmSendMail.nPara.$invalid) {
                var params = {
                  'Email': $scope.frmSendMail.mPara,
                  'Message': (typeof $scope.frmSendMail.mComentario === 'undefined') ? '' : $scope.frmSendMail.mComentario,
                  'Subject': $scope.frmSendMail.mAsunto,
                  'List': list
                };

                sendEmail(params, true).then(function(response) {
                  if (response.operationCode === 200) {
                    $scope.message = true;
                    $scope.respuesta = 'Email enviado';
                  }
							 }, function(error) {
                });
              }
            };
          }]
        });
      }

      function getListRamo(sector, showSpin) {
        return proxyLookup.getListRamoBySectorCode(sector, showSpin);
      }

      function getListSituacion(params, showSpin) {
        return proxyElement.getListSituacion(params, showSpin);
      }

      function getListSegmentation(showSpin) {
        return proxyPolicy.getListPolicySegmentationType(showSpin);
      }

      function getListSector(showSpin) {
        return proxyElement.getListSector(showSpin);
      }

      function getListSectors(showSpin) {
        return proxySector.GetSectors(showSpin); 
      }

      function getListSubSector(sectorId, showSpin) {
        return proxySector.GetListSubSector(sectorId, showSpin); 
      }

      function GetListRamosBySector(sectorId, subSectorId, showSpin) {
        return proxySector.GetListRamosBySector(sectorId, subSectorId, showSpin);
      }


      function getListPagingPersonFilter(params, showSpin) {
        return proxyPerson.getListPagingPersonFilter(params, showSpin);
      }

      function getListPagingPersonCode(params, showSpin) {
        return proxyPerson.getListPagingPersonEpsFilter(params, showSpin);
      }

      function getListPagingPolicyFilter(params, showSpin) {
        return proxyPolicy.getListPagingPolicyFilter(params, showSpin);
      }

      function getTicketUser(params, showSpin) {
        return proxySecurity.getTicketUser(params, showSpin);
      }

      function getValidatePolicy(policyNumber, roleType, codeManagerOffice, showSpin) {
        return proxyPolicy.getValidatePolicy(policyNumber, roleType, codeManagerOffice, showSpin);
      }

      function getListPendingPayment(params, showSpin) {
        return proxyPayment.getListPendingPayment(params, showSpin);
      }

      function getReportListPolicyFilter(showSpin) {
        return proxyPolicy.getReportListPolicyFilter(showSpin);
      }

      function getDetailAccident(params, showSpin) {
        return proxyAccident.getDetailAccident(params, showSpin);
      }

      function getDetailRenewal(params, showSpin) {
        return proxyRenewal.getDetailRenewal(params, showSpin);
      }

      function sendImpresionesPolizasEmail(params, showSpin) {
        return proxyRenewal.getRenewalEmail(params, showSpin);
      }

      function getListBeneficios(params, showSpin) {
        return proxyBenefit.getBenefitListPagingBenefitFilter(params, showSpin);
      }

      function getDataPolicyElectronic(params, showSpin) {
        return proxyRenewal.getDataPolicyElectronic(params, showSpin);
      }

      function getSetDataPolicyElectronic(params, showSpin) {
        return proxyRenewal.getregisterFlagPolicyElectronic(params, showSpin);
      }

      function getTypeUse() {
        return proxyParameter.getTypeUse(true);
      }

      function buscarAnuladas(params, showSpin) {

        const pathParams = {
          opcMenu: localStorage.getItem('currentBreadcrumb'),
          codObjeto: localStorage.getItem('codObjeto')
         };
         return httpData.post(
          oimProxyGcw.endpoint + 'api/collection/cancellation/paging?COD_OBJETO='+pathParams.codObjeto+'&OPC_MENU=' + pathParams.opcMenu,
          params,
          undefined,
          showSpin
        );
      }

      function getDocPagar(params, showSpin) {
        return proxyPayment.getListDocumentPayment(params, showSpin);
      }

      function getDataDocPagarDetalle(filter, showSpin) {
        return proxyPayment.getDocumentByNumber(filter, showSpin);
      }

      function getDataDocPagarDetalleEstado(filter, showSpin) {
        return proxyPayment.getDocumentStateByNumber(filter, showSpin);
      }

      /*--------------------------------------
    Facturas emitidas
    ----------------------------------------*/
      function getFacturasEmitidas(filter, showSpin) {
        return proxyInvoicesIssued.getCollectionInvoicesIssuedListPaging(filter, showSpin);
      }

      function descargarListaFacturas() {
        return proxyInvoicesIssued.getCollectionInvoicesIssuedReport(true);
      }

      function getHistorialPago(filter, showSpin) {
        return proxyPayment.getListPagingHistoryPayment(filter, showSpin);
      }

      function descargarDocPago(showSpin) {
        return proxyPayment.getReportDocumentPayment(showSpin);
      }

      /* Comprobantes Remitidos */
      function getListaComprobantesRemitidos(filter, showSpin) {
        return proxyVoucherForwarded.getCollectionListVoucherForwardedPaging(filter, showSpin);
      }

      /* Estado de documento */
      function getEstadoDeDocumentos(filter, showSpin) {
        return proxyState.getCollectionListStatePaging(filter, showSpin);
      }

      function getDataEdoDocDetalle(filter, showSpin) {
        return proxyPayment.getDocumentByNumber(filter, showSpin);
      }

      /* Liquidacion SOAT */
  	function getLiquidacionesSoat(filter, showSpin) {
  		return proxyLiquidationSoat.getCollectionSoatPaging(filter, showSpin);
  	}

      function preLiquidacionesSoat(filter, showSpin) {
        return proxyLiquidationSoat.getCollectionListSoatHeaderPaging(filter, showSpin);
      }

  	function anularPreliquidacion(preSettlement, showSpin) {
  		return proxyLiquidationSoat.getCollectionCancelSoatCab(preSettlement, showSpin);
  	}

      function descargarPreliquidacion(showSpin) {
        return proxyLiquidationSoat.getCollectionReportSoatHistory(showSpin);
      }

      function getListTipoPoliza() {
        return proxyElement.getListPolicyType(true);
      }

      function getListTipoMoneda() {
        return proxyParameter.getListCoin(true);
      }

      function getListTipoMonedaGlobal() {
        return proxyParameter.getListCoinGlobal(true);
      }

      function generarLiquidacion(params) {
        return proxyLiquidationSoat.getCollectionRegisterSoat(params, true);
      }

      function generarLiquidacionSelected(filter, showSpin) {
        return proxyLiquidationSoat.getCollectionRegisterSoatSelected(filter, showSpin);
      }

      function getEmailLiq(agentId) {
        return proxyLookup.getListManagerCollectionEmail(1, agentId, true);
      }

      function sendEmailLiq(params) {
        return proxyLiquidationSoat.getCollectionSendEmailConsult(params, true);
      }

      /* Comisiones - Detraccion*/
      function getConstanciaDetraccion(params) {
        return proxyDetraction.getCommissionListDetractionPaging(params, true);
      }

      function getListTipoDoc() {
        return proxyElement.getListPaidDocumentType(false);
      }

      function getDetalleConstanciaDetraccion(filter) {
        return proxyDetraction.GetDetraction(filter, true);
      }

      /* Comisiones - Autliquidación*/
      function getListaAutoliquidacion(params) {
        return proxySelfSettlement.selfSettlementGetPendingCommissions(params, true);
      }

      function getValidacion(agentCode) {
        return proxySelfSettlement.selfSettlementAgentValidation({agentCode:agentCode}, true);
      }

      function generatePaymentOrders(body) {
        return proxySelfSettlement.selfSettlementGenerationPaymentOrders(body, true);
      }      
      
      function cancellationPaymentOrders(orderId,body) {
        return proxySelfSettlement.selfSettlementCancellationPaymentOrders(orderId,body, true);
      }      

      function selfSettlementUploadFile(body) {
        return proxySelfSettlement.selfSettlementInvoiceUploader(body, true);
      } 

      /* Comisiones - Ganadas*/
      function getListaGanadas(filter) {
        return proxyLiquidated.getCommissionListLiquidatedPaging(filter, true);
      }

      function getListaEstadoGanadas() {
        return proxyParameter.GetLookupListTypeliquidated(false);
      }
      /* Comisiones - Estado Recibos*/
      function getEstadoRecibos(filter) {
        return proxyStateReceipt.getCommissionListStateReceipt(filter, true);
      }

      /* Comisiones - Por Ganar */
      function getComisionesPorGanar(filter) {
        return proxyGenerated.getCommissionListGenerated(filter, true);
      }

      /* Comisiones - Ramo y Cliente */
      function getComisionesRamoCliente(filter) {
        return proxyBranchClient.getCommissionListBranchClient(filter, true);
      }

      function getRamoPorCompania(company) {
        return proxyLookup.getListRamoMapfreByCompanyId(company, false);
      }

      /* Comisiones - movimientos*/
      function getMovimientos(filter) {
        return proxyMovement.getCommissionListMovement(filter, true);
      }

      /* Comisiones - Consultas Red Plaza*/
      function getListNetWorkAgents(params, showSpin) {
        return proxyNetworkAgent.getListNetworkTray(params, showSpin);
      }

      function getListNetworkAgentClient(params) {
        return proxyNetworkAgent.getListAgentClient(params, true);
      }

      function getListPoliciesByClient(params) {
        return proxyNetworkAgent.getListAgentClientDetail(params, true);
      }

      /* Siniestros - auto reemplazo */
      function getReplacementCar(params, showSpin) {
        return proxySinister.getReplacementCar(params, showSpin);
      }

      function getProvider(request, showSpin) {
        return proxySinister.getProvider(request, showSpin);
      }

      function addProvider(request, showSpin) {
        return proxySinister.addProvider(request, showSpin);
      }

      function updateProvider(request, showSpin) {
        return proxySinister.updateProvider(request, showSpin);
      }

      function getProviderId(ruc, showSpin) {
        return proxySinister.getProviderId(ruc, showSpin);
      }

      function getReplacementCarFactory(sinisterId, showSpin) {
        return proxySinister.getReplacementCarFactory(sinisterId, showSpin);
      }

      /* Siniestros - planilla */
      function getPayRoll(request, showSpin) {
        return proxySinister.getPayRoll(request, showSpin);
      }

      function downloableReport(request, url) {
        var deferred = $q.defer();
        mpSpin.start();
        $http
          .post(constants.system.api.endpoints.gcw + url, request, {responseType: 'arraybuffer'})
          .success(
            function(data, status, headers) {
              var type = headers('Content-Type');
              var disposition = headers('Content-Disposition');
              var defaultFileName = '';
              if (disposition) {
                var match = disposition.match(/.*filename="?([^;"]+)"?.*/);
                if (match[1]) {defaultFileName = match[1];}
              }
              defaultFileName = defaultFileName.replace(/[<>:"/\\|?*]+/g, '_');
              var blob = new Blob([data], {type: type});
              $window.saveAs(blob, defaultFileName);
              deferred.resolve(defaultFileName);
              mpSpin.end();
            },
            function() {
              var e = deferred.reject(e);
              mpSpin.end();
            }
          )
          .error(function(data) {
            mpSpin.end();
            deferred.reject(data);
          });
        return deferred.promise;
      }

      function downloadPayRoll(request) {
        return downloableReport(request, 'api/sinister/download');
      }


      /* Renovaciones */
      function getListRenovaciones(filter) {
        return proxyRenovation.getRenovationListRenovationResumePaging(filter, true);
      }

      function getListEstadosCCC() {
        return proxyElement.getLookupListStateCCC(false);
      }

      function getListEstadosR() {
        return proxyElement.getLookupListStateRenovation(false);
      }

      function getDataModalRenovacion(filter) {
        return proxyRenovation.getRenovationResumeDetail(filter, false);
      }

      function sendPoliciesUncertified(params, showSpin) {
        return proxyPolicy.SendPoliciesUncertified(params, showSpin);
      }

      /* Mapfre Dolar */
      function getListMapfreDollar(params, showSpin) {
        return proxyMapfreDollar.getMapfreDollarListMapfreDollarPaging(params, showSpin);
      }

      function getListSegmento(filter) {
        return proxyElement.getLookupListCommercialSegment(false);
      }

      /* Estado Md */
      function getListEstadoMD(params, showSpin) {
        return proxyMapfreDollar.getMapfreDollarListStateMapfreDollarPaging(params, true);
      }

      /* Siniestros Autos*/
      function getListEstadoSiniestros(showSpin) {
        return proxyParameter.getLookupStateSinister(false);
      }

      function getListSiniestrosAutos(filter, showSpin) {
        return proxySinisterCar.getSinisterListSinisterCarPaging(filter, true);
      }

      function getListTipoCliente(showSpin) {
        return proxyParameter.getLookupTypeClient(false);
      }

      function getListDetalleSiniestro(companyId, numberSinister, roleType, showSpin) {
        return proxySinisterCar.getSinisterSinisterCarDetail(companyId, numberSinister, roleType, false);
      }

      function sendSolicitarInfo(filter, showSpin) {
        return proxySinisterCar.getSinisterNotificationSinister(filter, false);
      }

      function verDocumentoDetalle(checkNumber, companyId, documentNumber, showSpin) {
        return proxySinisterCar.getSinisterListPayment(checkNumber, companyId, documentNumber, true);
      }

      function recuperaDocumento(idDocument, formato, showSpin) {
        return proxySinisterCar.getSinisterDocumentDownload(idDocument, formato, true);
      }

      /* Genericos */
      function getGestorAgentePorPoliza(params, showSpin) {
        return proxyLookup.getLookupAgentManagerByPolicy(params, false);
      }

      function validarGestorPorAgenteGet(agentId, agentIdSelected, companyId, roleCode) {
        return proxyLookup.getLookupValidadeAgent(agentId, agentIdSelected, companyId, roleCode, false);
      }

      function sendEmail(filter, showSpin) {
        return proxyPayment.getReportReceiptDocumentEmail(filter, showSpin);
      }
      // red plaza
      function filterpolictytype() {
        return proxyNetworkAgent.getListAgentClientFilterPolicyType(true);
      }

      function filterdelinquency() {
        return proxyNetworkAgent.getListAgentClientFilterDelinquency(true);
      }

      function filterexpirationpolicy() {
        return proxyNetworkAgent.getListAgentClientFilterExpirationPolicy(true);
      }
      function filterintegrality() {
        return proxyNetworkAgent.getListAgentClientFilterIntegrality(true);
      }

      function _downloadMediaPost(mediaPath, params, opts) {
        var deferred = $q.defer();
        mpSpin.start();
        $http
          .post(constants.system.api.endpoints.gcw + mediaPath, params, {
            responseType: 'arraybuffer'
          })
          .success(
            function(data, status, headers) {
              var type = headers('Content-Type');
              var FileName = opts.fileName;
              var blob = new Blob([data], {
                type: type
              });
              fileSaver(blob, FileName);
              deferred.resolve(FileName);
              mpSpin.end();
            },
            function() {
              var e = deferred.reject(e);
              mpSpin.end();
            }
          )
          .error(function(data) {
            mpSpin.end();
            deferred.reject(data);
          });
        return deferred.promise;
      }

      function downloadPayRoll(request) {
        // return proxyReport.VehicleDetails(request, showSpin);
        return downloableReport(request, 'api/sinister/download');
      }


      /* Renovaciones */
      function getListRenovaciones(filter) {
        return proxyRenovation.getRenovationListRenovationResumePaging(filter, true);
      }

      function getListEstadosCCC() {
        return proxyElement.getLookupListStateCCC(false);
      }

      function getListEstadosR() {
        return proxyElement.getLookupListStateRenovation(false);
      }

      function getDataModalRenovacion(filter) {
        return proxyRenovation.getRenovationResumeDetail(filter, false);
      }

      /* Mapfre Dolar */
      function getListMapfreDollar(params, showSpin) {
        return proxyMapfreDollar.getMapfreDollarListMapfreDollarPaging(params, showSpin);
      }

      function getListSegmento(filter) {
        return proxyElement.getLookupListCommercialSegment(false);
      }

      /* Estado Md */
      function getListEstadoMD(params, showSpin) {
        return proxyMapfreDollar.getMapfreDollarListStateMapfreDollarPaging(params, true)
      }

      /* Siniestros Autos*/
      function getListEstadoSiniestros(showSpin) {
        return proxyParameter.getLookupStateSinister(false)
      }

      function getListSiniestrosAutos(filter, showSpin) {
        return proxySinisterCar.getSinisterListSinisterCarPaging(filter, true);
      }

      function getListTipoCliente(showSpin) {
        return proxyParameter.getLookupTypeClient(false);
      }

      function getListDetalleSiniestro(companyId, numberSinister, roleType, showSpin) {
        return proxySinisterCar.getSinisterSinisterCarDetail(companyId, numberSinister, roleType, false)
      }

      function sendSolicitarInfo(filter, showSpin) {
        return proxySinisterCar.getSinisterNotificationSinister(filter, false);
      }

      function verDocumentoDetalle(checkNumber, companyId, documentNumber, showSpin) {
        return proxySinisterCar.getSinisterListPayment(checkNumber, companyId, documentNumber, true);
      }

      /* Genericos */
      function getGestorAgentePorPoliza(params, showSpin) {
        return proxyLookup.getLookupAgentManagerByPolicy(params, false);
      }

      function validarGestorPorAgenteGet(agentId, agentIdSelected, companyId, roleCode) {
        return proxyLookup.getLookupValidadeAgent(agentId, agentIdSelected, companyId, roleCode, false);
      }

      function sendEmail(filter, showSpin) {
        return proxyPayment.getReportReceiptDocumentEmail(filter, showSpin);
      }

      function getFexConsultTemplate() {
        return '/gcw/app/components/cobranzas/templates/fex-consult.html';
      }

      function getListAgentClientDetailDownload(mediaPath, params, options) {
        return _downloadMediaPost(mediaPath, params, options);
      }

      function dashboardoffice(params) {
        return proxyDashboardOffice.getIntegralitySection(params, true);
      }

      function getListOffices(params) {
        return proxyLookup.getAutoCompleteOffice(params, true);
      }

      function getPolicyIndicatorSection(params) {
        return proxyDashboardOffice.getPolicyIndicatorSection(params, true);
      }

      function getAgentDetailSection(params) {
        return proxyDashboardOffice.getAgentDetail(params, true);
      }

      function getPolicyTypeSummary(params) {
        return proxyDashboardOffice.getSummaryPolicyType(params, true);
      }

      function getIntegralitySummary(params) {
        return proxyDashboardOffice.getSummaryIntegrality(params, true);
      }

      function getExternalLink() {
        return proxyParameter.getLookupExternalLink(true);
      }

      function getLinkPago(params) {
        return proxyPayment.getLinkPago(params,true);
      }

      function getSendLinkPago(params) {
        return proxyPayment.getSendLinkPago(params,true);
      }

      function getLinkAfiliacion(params) {
        return proxyPayment.getLinkAfiliacion(params,true);
      }
      function getSendLinkAfiliacion(params) {
        return proxyPayment.getSendLinkAfiliacion(params,true);
      }

      function requestDocCartera(poliza) {
        return {
          "cliente": {
              "nomTomador": poliza.clientName,
              "codDocumento": poliza.documentCode,
              "tipDocumento": poliza.documentType,
          },
          "poliza": {
              "compania": poliza.ciaId,
              "numero": poliza.policyNumber
          }
        }
      }

      function requestDocPagar(poliza) {
        return {
          "cliente": {
              "nomTomador": poliza.client.name,
              "codDocumento": poliza.client.documentNumber,
              "tipDocumento": poliza.client.documentType
          },
          "poliza": {
              "compania": poliza.ramo.companyId,
              "numero": poliza.policyNumber
          },
          "documento": {
              "numero": poliza.documentNumber,
              "tipo": String(poliza.documentType).substring(0,2),
              "fechaVencimiento": poliza.dateEffect
          },
          "moneda": poliza.coinDescription == "DOL" ? 2 : 1,
          "importe": poliza.amount,
          "afiliar": false
        }
      }

      return {
        getIndexActionsMenu: getIndexActionsMenu,
        isDirector: isDirector,
        isVisibleNetwork: isVisibleNetwork,
        getAllNetworks: getAllNetworks,
        getTypeUser: getTypeUser,
        getRoleUser: getRoleUser,
        addVariableSession: addVariableSession,
        getVariableSession: getVariableSession,
        eliminarVariableSession: eliminarVariableSession,
        formatearFecha: formatearFecha,
        cleanStorage: cleanStorage,
        obtenerAgente: obtenerAgente,
        firstDate: firstDate,
        agregarMes: agregarMes,
        agregarDias: agregarDias,
        lastYear: lastYear,
        restarMes: restarMes,
        restarDias: restarDias,
        diasTranscurridos: diasTranscurridos,
        mesesTranscurridos: mesesTranscurridos,
        evaluarFechas: evaluarFechas,
        evaluarRango: evaluarRango,

        getListRamo: getListRamo,
        getListSituacion: getListSituacion,
        getListSegmentation: getListSegmentation,
        getListSector: getListSector,
        getListSectors: getListSectors,
        getListSubSector: getListSubSector,
        GetListRamosBySector: GetListRamosBySector,
        getListPagingPersonFilter: getListPagingPersonFilter,
        getListPagingPersonCode: getListPagingPersonCode,
        getListPagingPolicyFilter: getListPagingPolicyFilter,
        getTicketUser: getTicketUser,
        getValidatePolicy: getValidatePolicy,
        getListPendingPayment: getListPendingPayment,

        getReportListPolicyFilter: getReportListPolicyFilter,
        getDetailAccident: getDetailAccident,
        getDetailRenewal: getDetailRenewal,
        sendImpresionesPolizasEmail: sendImpresionesPolizasEmail,
        getListBeneficios: getListBeneficios,

        getDataPolicyElectronic: getDataPolicyElectronic,
        getSetDataPolicyElectronic: getSetDataPolicyElectronic,
        getTypeUse : getTypeUse,
        buscarAnuladas: buscarAnuladas,

        // Cobranzas: Comprobantes remitidos
        getListaComprobantesRemitidos: getListaComprobantesRemitidos,

        // Cobranzas: Documentos por pagar
        getDocPagar: getDocPagar,
        getDataDocPagarDetalle: getDataDocPagarDetalle,
        getDataDocPagarDetalleEstado: getDataDocPagarDetalleEstado,
        getLinkPago : getLinkPago,
        getSendLinkPago : getSendLinkPago,
        getLinkAfiliacion:getLinkAfiliacion,
        getSendLinkAfiliacion : getSendLinkAfiliacion,
        requestDocCartera : requestDocCartera,
        requestDocPagar:requestDocPagar,

        // Cobranzas: Historial de Pago
        getHistorialPago: getHistorialPago,
        descargarDocPago: descargarDocPago,

        // Facturas emitidas
        getFacturasEmitidas: getFacturasEmitidas,
        descargarListaFacturas: descargarListaFacturas,

        // Cobranzas: Estado de Documentos
        getEstadoDeDocumentos: getEstadoDeDocumentos,
        getDataEdoDocDetalle: getDataEdoDocDetalle,

        // Cobranzas: Liquidaciones SOAT
        getLiquidacionesSoat: getLiquidacionesSoat,
        preLiquidacionesSoat: preLiquidacionesSoat,
        anularPreliquidacion: anularPreliquidacion,
        descargarPreliquidacion: descargarPreliquidacion,
        generarLiquidacion: generarLiquidacion,
        generarLiquidacionSelected: generarLiquidacionSelected,

        // Comisiones - Constacia Detraccion
        getConstanciaDetraccion: getConstanciaDetraccion,
        getDetalleConstanciaDetraccion: getDetalleConstanciaDetraccion,
        getListTipoDoc: getListTipoDoc,
        getListNetWorkAgents: getListNetWorkAgents,
        getListNetworkAgentClient: getListNetworkAgentClient,
        getListPoliciesByClient: getListPoliciesByClient,

        // Comisiones - Estado Recibos
        getEstadoRecibos: getEstadoRecibos,

        // Comisiones - Autoliquidación
        getListaAutoliquidacion: getListaAutoliquidacion,
        getValidacion: getValidacion,
        generatePaymentOrders: generatePaymentOrders,
        cancellationPaymentOrders: cancellationPaymentOrders,
        selfSettlementUploadFile: selfSettlementUploadFile,

        // Comisiones - Ganadas
        getListaGanadas: getListaGanadas,
        getListaEstadoGanadas: getListaEstadoGanadas,

        // Comisiones - Por Ganar
        getComisionesPorGanar: getComisionesPorGanar,

        // Comisiones - Ramo y Cliente
        getComisionesRamoCliente: getComisionesRamoCliente,
        getRamoPorCompania: getRamoPorCompania,

        // Comisiones - Movimientos
        getMovimientos: getMovimientos,

        // Siniestros - Auto de Reemplazo
        getReplacementCar: getReplacementCar,
        getProvider: getProvider,
        addProvider: addProvider,
        updateProvider: updateProvider,
        getProviderId: getProviderId,
        getReplacementCarFactory: getReplacementCarFactory,

        // Siniestros - Planilla
        getPayRoll: getPayRoll,
        downloadPayRoll: downloadPayRoll,

        // Renovaciones
        getListRenovaciones: getListRenovaciones,
        getListEstadosCCC: getListEstadosCCC,
        getListEstadosR: getListEstadosR,
        getDataModalRenovacion: getDataModalRenovacion,
        sendPoliciesUncertified: sendPoliciesUncertified,

        // Mapfre dolar
        getListMapfreDollar: getListMapfreDollar,
        getListSegmento: getListSegmento,

        // Estado MD
        getListEstadoMD: getListEstadoMD,

        // Siniestros
        getListEstadoSiniestros: getListEstadoSiniestros,
        getListSiniestrosAutos: getListSiniestrosAutos,
        getListTipoCliente: getListTipoCliente,
        getListDetalleSiniestro: getListDetalleSiniestro,
        sendSolicitarInfo: sendSolicitarInfo,
        verDocumentoDetalle: verDocumentoDetalle,
        recuperaDocumento: recuperaDocumento,

        // Genericos
        getGestorAgentePorPoliza: getGestorAgentePorPoliza,
        validarGestorPorAgenteGet: validarGestorPorAgenteGet,

        getListTipoPoliza: getListTipoPoliza,
        getListTipoMoneda: getListTipoMoneda,
        getListTipoMonedaGlobal: getListTipoMonedaGlobal,

        getEmailLiq: getEmailLiq,
        sendEmailLiq: sendEmailLiq,

        openModalSendMail: openModalSendMail,

        getFexConsultTemplate: getFexConsultTemplate,
        // red plaza
        filterpolictytype: filterpolictytype,
        filterdelinquency: filterdelinquency,
        filterexpirationpolicy: filterexpirationpolicy,
        filterintegrality: filterintegrality,

        getListAgentClientDetailDownload: getListAgentClientDetailDownload,
        //dashboard
        dashboardoffice: dashboardoffice,
        getListOffices: getListOffices,
        getPolicyIndicatorSection: getPolicyIndicatorSection,
        getAgentDetailSection: getAgentDetailSection,
        getPolicyTypeSummary: getPolicyTypeSummary,
        getIntegralitySummary: getIntegralitySummary,

        //template
        getExternalLink: getExternalLink
      };
    }]);

});
