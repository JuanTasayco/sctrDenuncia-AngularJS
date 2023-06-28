define([
  'angular', 'constants'
], function(angular, constants) {

  var appCgw = angular.module('appCgw');

  appCgw.factory('cgwFactory', ['proxyCgwSecurity', 'proxyClient', 'proxyGeneral', 'proxyLookup', 'proxyClinic', 'proxyAffiliate', 'proxyDiagnostic', 'proxyDoctor', 
    'proxyMedicalCare', 'proxyCopay', 'proxyGuaranteeLetter', '$window', 'proxyExternalAudit', '$http', '$q', 'proxyMenu', 'proxyTipoDocumento', 'proxyInternalRemark', 
    'proxyExternalAuditor', 'proxyEps', 'proxyMedicalAuditor', 'proxyCompany', 'proxyCause', 'proxyLocation', 'proxyMobility', 'proxyDocument', 'proxyPolicy', 'proxySex', 'proxyPolicySoat',
    'proxyPowerEpsProduct', 'proxyPowerEpsAffiliate', 'proxyProduct', 'proxyCoverageMinsa', 'proxySinisterExistence', 'proxyHighCosts', 'proxyExecutive', 'proxyCoordinator', 'proxySumAssured', 'proxyCoverage', 'proxyConditioned', 'proxyMedicine', 'proxyCompanies', 'mpSpin',
    function(proxyCgwSecurity, proxyClient, proxyGeneral, proxyLookup, proxyClinic, proxyAffiliate, proxyDiagnostic, proxyDoctor, 
      proxyMedicalCare, proxyCopay, proxyGuaranteeLetter, $window, proxyExternalAudit, $http, $q, proxyMenu, proxyTipoDocumento, proxyInternalRemark, 
      proxyExternalAuditor, proxyEps, proxyMedicalAuditor, proxyCompany, proxyCause, proxyLocation, proxyMobility, proxyDocument, proxyPolicy, proxySex, proxyPolicySoat,
      proxyPowerEpsProduct, proxyPowerEpsAffiliate, proxyProduct, proxyCoverageMinsa, proxySinisterExistence, proxyHighCosts, proxyExecutive, proxyCoordinator, proxySumAssured, proxyCoverage, proxyConditioned, proxyMedicine, proxyCompanies, mpSpin) {

      function getData(url) {
        var newUrl = url;
        var deferred = $q.defer();
        $http({
          method: 'GET',
          url:  newUrl,
          headers: {
           // 'Content-Type': 'application/json'
          }
        }).then(function(response) {
          deferred.resolve(response.data);
        });
        return deferred.promise;
      }

    var addVariableSession = function(key, newObj) {
      var mydata = newObj;
      $window.sessionStorage.setItem(key, JSON.stringify(mydata));
    };

    var getVariableSession = function(key) {
     var mydata = $window.sessionStorage.getItem(key);
      if (mydata) {
          mydata = JSON.parse(mydata);
      }
      return mydata || [];
    };

    var eliminarVariableSession = function(key) {
      $window.sessionStorage.removeItem(key);
    };

    function formatearFecha(fecha) {
      if (fecha instanceof Date) {
        var today = fecha;
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        if (dd === 32) {
          dd = 1;
          mm = today.getMonth()+2;
        }

        if (dd<10) {
            dd='0'+dd
        }
        if (mm<10) {
            mm='0'+mm
        }

        var yyyy = today.getFullYear();
        return dd + '/' + mm + '/' + yyyy;
      }
    }

    function firstDate(fecha) {
      if (fecha instanceof Date) {
        var today = fecha;
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        if (dd === 32) {
          dd = 1;
          mm = today.getMonth()+2;
        } else {
           dd = 1;
        }

        if (dd<10) {
            dd='0'+dd
        }
        if (mm<10) {
            mm='0'+mm
        }

        var yyyy = today.getFullYear();
        return dd + '/' + mm + '/' + yyyy;
      }
    }

    function agregarMes(fecha, meses) {
			var currentMonth = fecha.getMonth();
	    fecha.setMonth(fecha.getMonth() + meses);

	    if (fecha.getMonth() !== ((currentMonth + meses) % 12)) {
	        fecha.setDate(0);
	    }
	    return fecha;
    }

    function restarMes(fecha, meses) {
      var currentMonth = fecha.getMonth();
      fecha.setMonth(fecha.getMonth() - meses);

      if (fecha.getMonth() !== ((currentMonth - meses) % 12)) {
          fecha.setDate(0);
      }
      return fecha;
    }

    function agregarDias(fecha, dias) {
      var newdate = fecha;
      newdate.setDate(newdate.getDate() + dias);
      newdate.getFullYear();
      return newdate;
    }

    function getListBranchClinicByRuc(params, showSpin) {
      return proxyClinic.Resource_Clinic_Get_ListBranchClinicByRuc(params, showSpin);
    }

    function getListClinic(params, showSpin) {
      //return getData('api/general/gestoroficina/' + constants.module.polizas.autos.companyCode, params.codAgente);
      return proxyClinic.Resource_Clinic_Get_ListClinicByFilter(params, showSpin);
    }

    function getListCompany(showSpin) {
      return proxyGeneral.Resource_General_Get_ListCompany(showSpin);
    }

    function searchAffiliate(params, showSpin) {
      return proxyAffiliate.Resource_Affiliate_SearchByFullName(params, showSpin)
    }

    function getAffiliate_Load(params, showSpin) {
      return proxyAffiliate.Resource_Affiliate_Load(params, showSpin)
    }

    function getListDiagnostic(params, showSpin) {
      return proxyDiagnostic.Resource_Diagnostic_Get_Diagnostic(params, showSpin);
    }

    function getListDoctor(params, showSpin) {
      return proxyDoctor.Resource_Doctor_Get_Doctor(params, showSpin);
    }

    function getListMedicalCare(params, showSpin) {
      return proxyMedicalCare.Resource_MedicalCare_Get_Query(params, showSpin);
    }

    function getListUserForced(params, showSpin) {
      return proxyGeneral.Resource_General_Get_ListUserForced(params, showSpin);
    }

    function getTicketUser(params, showSpin) {
      return proxyCgwSecurity.Resource_Cgw_Security_GetTicketUser(params, showSpin);
    }

    function getListBudgets(params, showSpin) {
      return proxyAffiliate.Resource_Affiliate_GetListBudgets(params, showSpin);
    }

    function getListCopayForced(params, showSpin) {
      return proxyCopay.Resource_ListCopayForced_Get_Query(params, showSpin);
    }

    function getValueIGV(params, showSpin) {
      return proxyGeneral.Resource_General_Get_ValueIGV(params, showSpin);
    }

    function getListRechazos(params) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Get_ReasonReject(params, true);
    }

    function getListCGWState(showSpin) {
      return proxyLookup.Resource_CGW_Get_ListState(showSpin);
    }

    function getListUserExecutive(showSpin) {
      return proxyGeneral.Resource_General_Get_ListUserExecutive(showSpin);
    }

    function getListGuaranteeLetter(params) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Search(params, true);
    }

    function getEstadosCobranza() {
      return proxyGeneral.Resource_General_Get_ListCobranzaType(false);
    }

    function getDetailLetter(params) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Load(params, false);
    }

    function updatePendingPayment(company, number, year, value) {
      return proxyGuaranteeLetter.UpdatePendingPayment(company, number, year, value);
    }

    function getHistorialAfiliado(params) {
      return proxyAffiliate.Resource_Affiliate_Record(params, true);
    }

    function getPic(codeCompany, codeAffiliate) {
      return proxyAffiliate.Resource_Affiliate_DownloadPhoto(codeCompany, codeAffiliate, false);
    }

    function getProcedimientosSolicitadosDetail(params) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Budget_Get_ListDetail(params, true);
    }

    function getProcedimientosSolicitados(params) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Budget_Get_List(params, true);
    }

    function getAllProcedimientosSolicitados(params) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Budget_Get_AllList(params, true);
    }

    function getListArchivosAdjuntos(params) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_AttachFile_Get_ListFile(params, true);
    }

    function getListObservInternas(codeCompany, year, number, version) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_InternalRemark_Get_List(codeCompany, year, number, version, true);
    }

    function saveFrmObsInterna(params) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_InternalRemark_InternalRemarkSave(params, true);
    }

    function getListCartasAuditoria(params) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_ExternalAuditSearch(params, true);
    }

    function getListEstadoAuditoriaExt(showSpin) {
      return proxyExternalAudit.Resource_ExternalAudit_GetAllState(showSpin);
    }

    function getDetailExternalAudit(params) {
      return proxyExternalAudit.GetExternalAudit(params, true);
    }

    function getListExternalAudit() {
      return proxyExternalAudit.Resource_ExternalAudit_GetListAuditor(true);
    }

    function crearAuditoria(params) {
      return proxyExternalAudit.Resource_ExternalAudit_Insert(params, true);
    }

    function updateAuditoria(params) {
      return proxyExternalAudit.Resource_ExternalAudit_Update(params, true);
    }

    function getListFileInformeAuditoria(params) {
      return proxyExternalAudit.Resource_AttachFile_GetListFile(params, true);
    }

//modal
    function finishInformeAuditoria(params) {
      return proxyExternalAudit.SaveExternalAudit(params, true);
    }

    function saveInformeAuditoria(params) {
      return proxyGuaranteeLetter.Resource_ExternalAudit_Save(params, true);
    }

    function downloadPlanillaAE(fileType, params, defaultFileName) {
      //return proxyExternalAudit.DownloadTemplate(fileType, params, true);
      var deferred = $q.defer();
      // var vparams = {
      //   NumeroSolicitud: params
      // };
      $http.post('http://api.oim.com/oim_cgw/api/externalaudit/template/PDF', params, { responseType: "arraybuffer" }).success(
        function (data, status, headers) {
          var type = headers('Content-Type');
          var disposition = headers('Content-Disposition');
          if (disposition) {
            var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
            if (match[1])
              defaultFileName = match[1];
          }
          defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
          var blob = new Blob([data], { type: type });
          saveAs(blob, defaultFileName);
          deferred.resolve(defaultFileName);
        }, function(data, status) {
          deferred.reject(e);
        });
      return deferred.promise;
    }

    function buscarXSituacion(params) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Report_Situation(params, true);
    }

    function buscarMovimientos(params) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Report_Movements(params, true);
    }

    function buscarFacturas(params) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Invoices_Get_List(params, true);
    }

    function getProductos() {
      return proxyGeneral.Resource_General_Get_ListProduct(false);
    }

    function updateBeneficio(params) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Update_Benefit(params, true);
    }

    function updateDiagnostico(params) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Update_Diagnostic(params, true);
    }

    function deleteFileAuditoria(params) {
      return proxyExternalAudit.Resource_AttachFile_Delete(params, true);
    }

    function approveLetter(params) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Approve(params, true);
    }

    function approveExecutiveLetter(params) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_ApproveExecutive(params, true);
    }

    function rejectLetter(params) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Reject(params, true);
    }

    function observeLetter(params) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Observe(params, true);
    }

    function annulLetter(params) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Cancel(params, true);
    }

    function getCurrency() {
      return proxyGeneral.Resource_General_Get_ListCurrency(true);
    }

    function getSubMenu(app) {
      return proxyMenu.GetSubMenu(app, true);
    }

    function getAffiliateReporte(params) {
      return proxyAffiliate.Resource_Affiliate_SearchQuickByFullName(params, true);
    }

    function getClienteReporte(params) {
      return proxyClient.Resource_Client_Search(params, true);
    }

    function enviarCarta(params) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_RejectionLetter_UpdateSend(params, true);
    }

    function getPreexistenciasAfiliado(params) {
      return proxyAffiliate.Resource_Affiliate_GetListPreexistence(params, false);
    }

    function getAutocompleteDiagnostic(params) {
      return proxyDiagnostic.Resource_Diagnostic_GetList_Diagnostic(params, true);
    }

    function getRole(params) {
      return proxyCgwSecurity.Resource_Cgw_Security_GetRole(params, false);
    }

    function getTipoDoc() {
      return proxyTipoDocumento.getTipoDocumento(true);
    }

    function Resource_Diagnostic_Priority_Save(params) {
      return proxyDiagnostic.Resource_Diagnostic_Priority_Save(params);
    }

    function Resource_Diagnostic_Priority_Delete(code) {
      return proxyDiagnostic.Resource_Diagnostic_Priority_Delete(code);
    }

    function Resource_Diagnostic_Priority_GetList() {
      return proxyDiagnostic.Resource_Diagnostic_Priority_GetList();
    }

    function Resource_Client_Priority_Save(params) {
      return proxyClient.Resource_Client_Priority_Save(params);
    }

    function Resource_Client_Priority_Delete(code) {
      return proxyClient.Resource_Client_Priority_Delete(code);
    }

    function Resource_Client_Priority_GetList() {
      return proxyClient.Resource_Client_Priority_GetList();
    }

    function Resource_InternalRemark_GetList_Common() {
      return proxyInternalRemark.Resource_InternalRemark_GetList_Common(true);
    }

    function ExternalAuditorSave(params, showSpin) {
      return proxyExternalAuditor.ExternalAuditorSave(params, showSpin);
    }

    function Resource_ExternalAuditor_Delete(code, showSpin) {
      return proxyExternalAuditor.Resource_ExternalAuditor_Delete(code, showSpin);
    }

    function ExternalAuditorGetList() {
      return proxyExternalAuditor.ExternalAuditorGetList(true);
    }

    function Resource_Eps_Get_ListTypeDocument() {
      return proxyEps.Resource_Eps_Get_ListTypeDocument(true);
    }

    function GetListMedicalAuditor() {
      return proxyMedicalAuditor.GetList(true);
    }

    function cambiarEjecutivo(params) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Update_Executive(params, true);
    }
    //cgw1.2
    function GetAllCompanyBy(userCode, systemCode) {
      return proxyCompany.Resource_PowerEps_Company_GetAll(userCode, systemCode, true);
    }

    function GetAllProductBy(userCode, systemCode) {
      return proxyPowerEpsProduct.Resource_PowerEps_Product_GetAll(userCode, systemCode, true);
    }

    function GetAllCauseBy() {
      return proxyCause.Resource_PowerEps_Cause_GetAll(true);
    }

    function GetAllDepartment() {
      return proxyLocation.Resource_PowerEps_Location_GetAllDepartment(true);
    }

    function GetAllProvinceBy(departmentCode) {
      return proxyLocation.Resource_PowerEps_Location_GetAllProvinceBy(departmentCode, true);
    }

    function GetAllDistrictBy(departmentCode, idProvince) {
      return proxyLocation.Resource_PowerEps_Location_GetAllDistrictBy(departmentCode, idProvince, true);
    }

    function GetAllMobility() {
      return proxyMobility.Resource_PowerEps_Mobility_GetAll(true);
    }

    function GetSearchBy(affiliateInfo) {
      return proxyPowerEpsAffiliate.Resource_PowerEps_Affiliate_GetSearch(affiliateInfo, true);
    }

    function GetAllType() {
      return proxyDocument.Resource_PowerEps_Document_Type_GetAll(true);
    }

    function GetAffiliateBy(params) {
      return proxyPowerEpsAffiliate.Resource_PowerEps_Affiliate_Get(params, true);
    }

    function GetPolicySoatBy(plateNumber) {
      return proxyPolicy.Resource_PowerEps_Policy_Soat_Get(plateNumber, true);
    }

    function GetPolicySoatByLicenseAccidentDate(license, accidentDate){
      return proxyPolicySoat.GetPolicySoatBy(license, accidentDate, true);
    }

    function GetPolicyAAPPBy(plateNumber) {
      return proxyPolicy.Resource_PowerEps_Policy_AAPP_Get(plateNumber, true);
    }

    function GetPolicyCarBy(plateNumber) {
      return proxyPolicy.Resource_PowerEps_Policy_Car_Get(plateNumber, true);
    }

    function SaveAffiliate(params) {
      return proxyPowerEpsAffiliate.Resource_PowerEps_Affiliate_Save(params, true);
    }

    function GetAllSex() {
      return proxySex.Resource_PowerEps_Sex_GetAll(true);
    }

    function Resource_Product_Coverage_GetListByProduct(productCode) {
      return proxyProduct.Resource_Product_Coverage_GetListByProduct(productCode, true);
    }
    
    function Resource_GetListAffiliateByPolicy(params, showSpin){
        return proxyAffiliate.Resource_Affiliate_GetListAffiliateByPolicy(params.numPlaca, params.polizaSelect, params.fechaSiniestro, params.datoFiltro, params.numPagina, showSpin);
    }

    function Resource_UpdateAffiliatePolicy(params, showSpin){
        return proxyAffiliate.Resource_Affiliate_UpdateAffiliatePolicy(params, showSpin);
    }

    function Resource_Product_Coverage_GetListByProductAndPolicy(companyCode, policyNumber) {
      return proxyProduct.Resource_Product_Coverage_GetListByProductAndPolicy(companyCode, policyNumber, true);
    }

    function ConsultarClienteImportante(params){
      return proxyAffiliate.Resource_Affiliate_ConsultImportantCustomer(params, false);
    }

    function ConsultarAseguradoObservado(params){
      return proxyAffiliate.Resource_Affiliate_ConsultObservedInsured(params, false);
    }
      function getListMotivosAnulado() {
        return proxyGuaranteeLetter.Resource_GuaranteeLetter_Get_ReasonAnulled(true);
      }

      function Resource_CoverageMinsa_GetList() {
        return proxyCoverageMinsa.CoverageMinsaGetAll(true);
      }

      function Resource_CoverageMinsa_Save(params, showSpin) {
        return proxyCoverageMinsa.SaveCoverageMinsa(params, showSpin);
      }

      function Resource_Sinister_Search(params, showSpin) {
        return proxySinisterExistence.GetSinisterOpening(params.ProductCode, params.AccidentDate, params.ContractNumber, params.AffiliateCode, params.LicenseNumber, showSpin);
      }

      function Resource_Sinister_OpenModal(params, showSpin) {
        return proxySinisterExistence.ListSinisterOpening(params.ProductCode, params.AccidentDate, params.ContractNumber, params.AffiliateCode, params.LicenseNumber, showSpin);
      }

      function Resource_CoverageMinsa_GetLog(params, showSpin) {
        return proxyCoverageMinsa.GetLogCoverageMinsa(params, showSpin);
      }

      function Resource_AmountForMedic(params, showSpin){ 
        return proxyGuaranteeLetter.GetMaxAmountForMedic(params.CodeCompany, params.CodeProduct, showSpin);
      }

    function buscarAltoCostoPaciente(params){
      return proxyHighCosts.Resource_GuaranteeLetter_Get_High_Costs_Pacients(params, true);
    }

    function exportarAltoCostoPaciente(params){
      return proxyHighCosts.Resource_GuaranteeLetter_Get_High_Costs_Pacients_Report(params, true);
    }

    function detalleAltoCostoPaciente(params){
      return proxyHighCosts.Resource_GuaranteeLetter_Get_High_Costs_Pacients_Detail(params, true);
    }

    function buscarAltoCostoSiniestro(params){
      return proxyHighCosts.Resource_GuaranteeLetter_Get_High_Costs_Sinisters(params, true);
    }

    function exportarAltoCostoSiniestro(params){
      return proxyHighCosts.Resource_GuaranteeLetter_Get_High_Costs_Sinisters_Report(params, true);
    }

    function GetAllEconomicsGroups(params, showSpin){
      return proxyHighCosts.Resource_GuaranteeLetter_Get_All_EconomicsGroups(params, showSpin)
    }
    
    function GetClientsByEconomicGroup(params, showSpin){
      return proxyHighCosts.Resource_GuaranteeLetter_Get_Clients_By_EconomicGroup(params, showSpin)
    }
    
    function GetContractByClient(params){
      return proxyHighCosts.Resource_GuaranteeLetter_Get_Contract_By_Client(params, true)
    }
    
    function GetModalityByBranch(params){
      return proxyHighCosts.Resource_GuaranteeLetter_Get_Modality_By_Branch(params, true)
    }
    
    function GetProductByModality(params){
      return proxyHighCosts.Resource_GuaranteeLetter_Get_Product_By_Modality(params, true)
    }
    
    function GetSubProductByProduct(params){
      return proxyHighCosts.Resource_GuaranteeLetter_Get_SubProduct_By_Product(params, true)
    }
    
    function GetPolicyByBranch(params){
      return proxyHighCosts.Resource_GuaranteeLetter_Get_Policy_By_Branch(params, true)
    }
    
    function GetContractByPolicy(params){
      return proxyHighCosts.Resource_GuaranteeLetter_Get_Contract_By_Policy(params, true)
    }
    
    function GetSubContractByContract(params){
      return proxyHighCosts.Resource_GuaranteeLetter_Get_SubContract_By_Contract(params, true)
    }
    
    function GetContractor(params, showSpin){
      return proxyHighCosts.Resource_GuaranteeLetter_Get_Contractor(params, showSpin)
    }

    // Buscar clientes
    function getClienteSearch(params, showSpin) {
      return proxyClient.Resource_Client_Search(params, showSpin);
    }

    // Buscar coberturas
    function getCoberturaSearch(params, showSpin) {
      return proxyCoverage.GetListByFilter(params.Filter, '3', showSpin);
    }

    /* Asignacion Clinica y Diagnostico */
    // Listado de ejecutivos Mapfre
    function GetListExecutives(params, showSpin) {
      return proxyExecutive.GetListExecutiveByFilter(params.Filter, params.PageSize, params.PageNumber, showSpin);
    }

    // Listado de coordinadores clinica
    function GetListCoordinator(params, showSpin) {
      return proxyCoordinator.GetListCoordinatorByFilter(params.Filter, params.PageSize, params.PageNumber, showSpin);
    }

    // Listado de clinicas de ejecutivo
    function GetListClinicExecutive(params, showSpin) {
      return proxyExecutive.Resource_Executive_Clinic(params.IdUser, params.Filter, params.PageSize, params.PageNumber, showSpin);
    }

    // Listado de clinicas no asignadas para ejecutivo
    function GetListClinicNotAsignedExecutive(filter) {
      return proxyExecutive.Resource_Executive_ClinicNoAssigned(filter, false);
    }

    // Asignar clinica a ejecutivo
    function RegisterClinicExecutive(id, params, showSpin) {
      return proxyExecutive.Resource_Executive_RegisterClinic(id, params, showSpin);
    }

    // Eliminar clinica de ejecutivo
    function RemoveClinicExecutive(id, params, showSpin) {
      return proxyExecutive.Resource_Executive_DeleteClinic(id, params.cprvdr, params.nsucursal, showSpin);
    }

    // Listado de diagnosticos de ejecutivo
    function ListDiagnosticExecutive(params, showSpin) {
      return proxyExecutive.Resource_Executive_Diagnostic(params.IdUser, params.Filter, params.PageSize, params.PageNumber, showSpin);
    }

    // Asignar diagnostico a ejecutivo
    function RegisterDiagnosticExecutive(id, params, showSpin) {
      return proxyExecutive.Resource_Executive_RegisterDiagnostic(id, params, showSpin);
    }

    // Eliminar diagnostico de ejecutivo
    function RemoveDiagnosticExecutive(id, code, showSpin) {
      return proxyExecutive.Resource_Executive_DeleteDiagnostic(id, code, showSpin);
    }

    // Listado de clinicas de coordinador
    function GetListClinicCoordinator(params, showSpin) {
      return proxyCoordinator.Resource_Coordinator_Clinic(params.IdUser, params.Filter, true, params.PageSize, params.PageNumber, showSpin);
    }

    // Listado de clinicas no asignadas para coordinador
    function GetListClinicNotAsignedCoordinator(id, filter) {
      return proxyCoordinator.Resource_Coordinator_Clinic(id, filter, false, showSpin = false);
    }

    // Asignar clinica a coordinador
    function RegisterClinicCoordinator(id, params, showSpin) {
      return proxyCoordinator.Resource_Coordinator_RegisterClinic(id, params, showSpin);
    }

    // Eliminar clinica de coordinador
    function RemoveClinicCoordinator(id, params, showSpin) {
      return proxyCoordinator.Resource_Coordinator_DeleteClinic(id, params.cprvdr, params.nsucursal, showSpin);
    }

    /* Suma Asegurada */
    // Listado de registros de suma asegurada
    function GetListSumaAsegurada(params, showSpin) {
      return proxySumAssured.GetSumAssuredTray(params.Beneficio, params.Diagnostico, params.PageSize, params.PageNumber, showSpin);
    }
    
    // Detalle de suma asegurada
    function GetDetailSumaAsegurada(id, showSpin) {
      return proxySumAssured.Resource_SumAssured_GetByID(id, showSpin);
    }

    // Registrar nueva suma asegurada
    function SaveSumaAsegurada(params, showSpin) {
      return proxySumAssured.SaveSumAssured(params, showSpin);
    }

    // Editar suma asegurada
    function EditSumaAsegurada(id, params, showSpin) {
      return proxySumAssured.Resource_SumAssured_Update(id, params, showSpin);
    }

    // Eliminar suma asegurada
    function DeleteSumaAsegurada(id, showSpin) {
      return proxySumAssured.Resource_SumAssured_Delete(id, showSpin);
    }

    /* Condicionado */
    // Listar Ramos
    function GetListRamos(codCia, showSpin) {
      return proxyCompanies.Resource_General_Get_ListRamos(codCia, showSpin);
    }

    // Listar Contratos
    function GetListContratos(codCia, codRamo, showSpin) {
      return proxyCompanies.Resource_General_Get_ListContrato(codCia, codRamo, showSpin);
    }

    // Listar Modalidades
    function GetListModalidades(codCia, codRamo, showSpin) {
      return proxyCompanies.Resource_General_Get_ListModalidad(codCia, codRamo, showSpin);
    }

    // Listar Productos Salud
    function GetListProductosSalud(codCia, codRamo, codModalidad, showSpin) {
      return proxyCompanies.Resource_General_Get_ListProdSalud(codCia, codRamo, codModalidad, showSpin);
    }

     // Listar Sub Productos Salud
     function GetListSubProductosSalud(codCia, codRamo, codModalidad, codProducto, showSpin) {
      return proxyCompanies.Resource_General_Get_ListSubProdSalud(codCia, codRamo, codModalidad, codProducto, showSpin);
    }

    // Listado de registros de condicionados
    function GetListCondicionado(params, showSpin) {
      return proxyConditioned.GetConditionedTray(params.Filter, params.PageSize, params.PageNumber, showSpin);
    }

    // Detalle de condicionado
    function GetDetailCondicionado(id, showSpin) {
      return proxyConditioned.Resource_Conditioned_GetByID(id, showSpin);
    }

    // Registrar nuevo condicionado
    function SaveCondicionado(params, showSpin) {
      return proxyConditioned.SaveConditioned(params, showSpin);
    }
    
    // Editar condicionaco
    function EditCondicionado(id, params, showSpin) {
      return proxyConditioned.Resource_Conditioned_Update(id, params, showSpin);
    }

    // Eliminar condicionado
    function DeleteCondicionado(id, showSpin) {
      return proxyConditioned.Resource_Conditioned_Delete(id, showSpin);
    }

    /* Contacto farmaco */
    // Listado de registros de contacto
    function GetListContacto(params, showSpin) {
      return proxyMedicine.Resource_HighCostMedicine_GetContactTray(params.Filter, params.PageSize, params.PageNumber, showSpin);
    }

    // Registrar nuevo contacto
    function SaveContacto(params, showSpin) {
      return proxyMedicine.Resource_HighCostMedicine_SaveContact(params, showSpin);
    }

    // Editar contacto
    function EditContacto(id, params, showSpin) {
      return proxyMedicine.Resource_HighCostMedicine_UpdateContact(id, params, showSpin);
    }

    // Eliminar contacto
    function DeleteContacto(id, showSpin) {
      return proxyMedicine.Resource_HighCostMedicine_DeleteContact(id, showSpin);
    }

    /* Solicitar SCAN */
    // Listar coordinadores
    function GetCoordinatorByGuaranteeLetter(year, number, params, showSpin) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Get_CoordinatorsWithClinics(year, number, params.Filter, params.PageSize, params.PageNumber, showSpin);
    }

    // Listar clinicas por coordinador
    function GetClinicsByCoordinatorToScanRequest(year, number, userId, params, showSpin) {
      return proxyClinic.Resource_Clinic_Get_PerCDCAndGL(year, number, userId, params.PageSize, params.PageNumber, showSpin)
    }

    // Guardar Solicitar Scan
    function SaveScanRequest(year, number, params, showSpin) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Save_Scan(year, number, params, showSpin);
    }

    /* Datos SCAN - Editar */
    // Listar clinicas por coordinador
    function GetClinicsByCoordinatorToScanEdit(year, number, userId, params, showSpin) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Get_ClinicsScanbyCDandGL(year, number, userId, params.PageSize, params.PageNumber, showSpin);
    }

    // Guardar Datos Scan
    function SaveScanData(year, number, params, showSpin) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Save_ConcurrentScan(year, number, params, showSpin);
    }

    /* Datos SCAN - Lectura */
    // Obtener Datos Scan
    function GetScanData(year, number, params, showSpin) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Get_GetTrayScanData(year, number, params.Filter, params.PageSize, params.PageNumber, showSpin);
    }

    /* Altos Costos */
    // Listar medicinas por buscador
    function GetMedicines(params, showSpin) {
      return proxyMedicine.Resource_HighCostMedicine_GetMedicineTray(params.Filter, params.PageSize, params.PageNumber, showSpin);
    }

    // Listar medicamentos de altos costos
    function GetHighCostMedicine(year, number, version, showSpin) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Get_HighCostMedicine(year, number, version, showSpin);
    }

    // Registrar medicamentos de altos costos
    function SaveHighCostMedicine(year, number, version, params, showSpin) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Save_HighCostMedicine(year, number, version, params, showSpin);
    }

    // Eliminar medicamento de altos costos
    function RemoveHighCostMedicine(year, number, version, code, showSpin) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Delete_HighCostMedicine(year, number, version, code, showSpin);
    }

    /* Rechazar Carta Garantia */
    // Obtener informacion de condicionado
    function GetInfoCondicionado(year, number, showSpin) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Get_Conditioned(year, number, showSpin);
    }

    // Obtener vista previa en base al motivo de rechazo
    function GetPreviewByRejectReason(company, reason, showSpin) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Get_RejectDetail(company, reason, showSpin);
    }

    /* Visualizar tarifas */
    // Obtener servicios de tarifa de una carta
    function GetServicesByGl(year, number, params, showSpin) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Get_TariffServices(year, number, params.PageSize, params.PageNumber, showSpin);
    }

    // Obtener paquetes de tarifa de una carta
    function GetPackagesByGl(year, number, params, showSpin) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Get_TariffPackages(year, number, params.PageSize, params.PageNumber, showSpin);
    }

    // Obtener lista de ejecutivos asignados
    function GetAssigendExecutives(showSpin) {
      return proxyExecutive.Resource_Executive_GetAllAssigned(showSpin);
    }

    /* Reporte SCAN */
    // Obtener lista de estados scan
    function GetListCGWScanState(showSpin) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Get_StatusFilter(showSpin);
    }

    // Generar reporte scan segun tipo de archivo
    function GetReportScan(fileType, showSpin) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Report_Scan(fileType, showSpin);
    }

    function getPreexistenciasTemporales(params) {
      return proxyClient.ExclusionesTemporales(params, false);
    }

    function GetListComplaintReasonReject(showSpin) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Complaint_ReasonReject(showSpin);
    }

    function GetListComplaintReasonFinalized(showSpin) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Complaint_ReasonFinalized(showSpin);
    }

    function ComplaintRequired(companyId, providerId, productId) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Complaint_Required(companyId, providerId, productId, false);
    }

    // Enviar correo de invalidez
    function SendInvalidezMail(params, year, number, version, showSpin) {
      return proxyGuaranteeLetter.Resource_GuaranteeLetter_Send_Mail_Invalidez(params, year, number, version, showSpin);
    }

    // Enviar correo (general)
    function SendMail(params, showSpin) {
      return proxyGeneral.Resource_General_Wcf_EnviarEmail(params, showSpin);
    }

    // Generar reticencia
    function GenerateReticencia(params) {
      var deferred = $q.defer();

      $http.post(constants.system.api.endpoints.wsrRegistrarReticenciaAuto, params)
      .then(function(data) {
        deferred.resolve(data);
      })
      .catch(function (error) {
        deferred.reject(data);
      });

      return deferred.promise;
    }

    // Listar clinicas
    function getListAllClinics(year, number, showSpin) {
      return proxyClinic.Resource_Clinic_Get_ListClinic(year, number, showSpin);
    }

    // Listar documentos de rechazo
    function getListDocumentsReject(year, number, version, showSpin) {
      return proxyGuaranteeLetter.GetListAttachedDocument(year, number, version, showSpin);
    }

    // Agregar documento de rechazo
    function addDocumentReject(showSpin) {
      return proxyGuaranteeLetter.AttachedDocumentSave(showSpin);
    }

    // Eliminar archivo de rechazo
    function deleteDocumentReject(number, documentId, params, showSpin) {
      return proxyGuaranteeLetter.Resource_AttachedDocumentRejection_Update(number, documentId, params, showSpin);
    }

    return {
      getData: getData,
      addVariableSession: addVariableSession,
      getVariableSession: getVariableSession,
      eliminarVariableSession: eliminarVariableSession,
      formatearFecha: formatearFecha,
      firstDate: firstDate,
      agregarMes: agregarMes,
      agregarDias: agregarDias,
      getListBranchClinicByRuc: getListBranchClinicByRuc,
      getListClinic: getListClinic,
      getListCompany: getListCompany,
      searchAffiliate: searchAffiliate,
      getAffiliate_Load: getAffiliate_Load,
      getListDiagnostic: getListDiagnostic,
      getListDoctor: getListDoctor,
      getListMedicalCare: getListMedicalCare,
      getListUserForced: getListUserForced,
      getTicketUser: getTicketUser,
      getListBudgets: getListBudgets,
      getListCopayForced: getListCopayForced,
      getValueIGV: getValueIGV,

      getListRechazos: getListRechazos,
      restarMes: restarMes,
      getListCGWState: getListCGWState,
      getListUserExecutive: getListUserExecutive,
      getListGuaranteeLetter: getListGuaranteeLetter,
      getEstadosCobranza: getEstadosCobranza,
      getDetailLetter: getDetailLetter,


      getHistorialAfiliado: getHistorialAfiliado,
      getPic: getPic,
      getProcedimientosSolicitadosDetail: getProcedimientosSolicitadosDetail,
      getAllProcedimientosSolicitados: getAllProcedimientosSolicitados,
      getProcedimientosSolicitados: getProcedimientosSolicitados,
      getListArchivosAdjuntos: getListArchivosAdjuntos,

      getListObservInternas: getListObservInternas,
      saveFrmObsInterna: saveFrmObsInterna,
      updatePendingPayment: updatePendingPayment,
      getListCartasAuditoria: getListCartasAuditoria,
      getListEstadoAuditoriaExt: getListEstadoAuditoriaExt,

      getDetailExternalAudit: getDetailExternalAudit,
      getListExternalAudit: getListExternalAudit,
      crearAuditoria: crearAuditoria,
      updateAuditoria: updateAuditoria,

      getListFileInformeAuditoria: getListFileInformeAuditoria,
      finishInformeAuditoria: finishInformeAuditoria,
      saveInformeAuditoria: saveInformeAuditoria,
     // downloadAdjuntoAE: downloadAdjuntoAE,
      downloadPlanillaAE: downloadPlanillaAE,
      buscarXSituacion: buscarXSituacion,
      buscarMovimientos: buscarMovimientos,
      buscarFacturas: buscarFacturas,
      getProductos: getProductos,
      updateDiagnostico: updateDiagnostico,
      updateBeneficio: updateBeneficio,
      deleteFileAuditoria: deleteFileAuditoria,
      approveLetter: approveLetter,
      approveExecutiveLetter: approveExecutiveLetter,
      rejectLetter: rejectLetter,
      observeLetter: observeLetter,
      annulLetter: annulLetter,
      getCurrency: getCurrency,
      getSubMenu: getSubMenu,
      getAffiliateReporte: getAffiliateReporte,
      getClienteReporte: getClienteReporte,
      enviarCarta: enviarCarta,
      getPreexistenciasAfiliado: getPreexistenciasAfiliado,
      getAutocompleteDiagnostic: getAutocompleteDiagnostic,
      getRole: getRole,
      getTipoDoc: getTipoDoc,
      Resource_Diagnostic_Priority_Save: Resource_Diagnostic_Priority_Save,
      Resource_Diagnostic_Priority_Delete: Resource_Diagnostic_Priority_Delete,
      Resource_Diagnostic_Priority_GetList: Resource_Diagnostic_Priority_GetList,
      Resource_Client_Priority_Save: Resource_Client_Priority_Save,
      Resource_Client_Priority_Delete: Resource_Client_Priority_Delete,
      Resource_Client_Priority_GetList: Resource_Client_Priority_GetList,
      Resource_InternalRemark_GetList_Common: Resource_InternalRemark_GetList_Common,
      ExternalAuditorSave: ExternalAuditorSave,
      Resource_ExternalAuditor_Delete: Resource_ExternalAuditor_Delete,
      ExternalAuditorGetList: ExternalAuditorGetList,
      Resource_Eps_Get_ListTypeDocument: Resource_Eps_Get_ListTypeDocument,
      GetListMedicalAuditor: GetListMedicalAuditor,
      cambiarEjecutivo: cambiarEjecutivo,

      //cgw2.0
      GetAllCompanyBy: GetAllCompanyBy,
      GetAllProductBy: GetAllProductBy,
      GetAllCauseBy: GetAllCauseBy,

      GetAllDepartment: GetAllDepartment,
      GetAllProvinceBy: GetAllProvinceBy,
      GetAllDistrictBy: GetAllDistrictBy,

      GetAllMobility: GetAllMobility,
      GetSearchBy: GetSearchBy,
      GetAllType: GetAllType,
      GetAffiliateBy: GetAffiliateBy,
      GetPolicySoatBy: GetPolicySoatBy,
      GetPolicyAAPPBy: GetPolicyAAPPBy,
      GetPolicyCarBy: GetPolicyCarBy,
      SaveAffiliate: SaveAffiliate,
      GetAllSex: GetAllSex,
      Resource_Product_Coverage_GetListByProduct: Resource_Product_Coverage_GetListByProduct,
      Resource_Product_Coverage_GetListByProductAndPolicy: Resource_Product_Coverage_GetListByProductAndPolicy,
      getListMotivosAnulado: getListMotivosAnulado,
      Resource_CoverageMinsa_GetList: Resource_CoverageMinsa_GetList,
      GetPolicySoatByLicenseAccidentDate: GetPolicySoatByLicenseAccidentDate, 
      Resource_GetListAffiliateByPolicy: Resource_GetListAffiliateByPolicy, 
      Resource_UpdateAffiliatePolicy: Resource_UpdateAffiliatePolicy,
      Resource_CoverageMinsa_Save: Resource_CoverageMinsa_Save,
      Resource_Sinister_Search: Resource_Sinister_Search,
      ConsultarClienteImportante: ConsultarClienteImportante,
      ConsultarAseguradoObservado: ConsultarAseguradoObservado,
      Resource_Sinister_OpenModal: Resource_Sinister_OpenModal,
      Resource_CoverageMinsa_GetLog: Resource_CoverageMinsa_GetLog,
      Resource_AmountForMedic: Resource_AmountForMedic, 

      buscarAltoCostoPaciente: buscarAltoCostoPaciente,
      exportarAltoCostoPaciente: exportarAltoCostoPaciente,
      detalleAltoCostoPaciente: detalleAltoCostoPaciente,
      buscarAltoCostoSiniestro: buscarAltoCostoSiniestro,
      exportarAltoCostoSiniestro: exportarAltoCostoSiniestro,

      GetAllEconomicsGroups : GetAllEconomicsGroups,
      GetClientsByEconomicGroup : GetClientsByEconomicGroup,
      GetContractByClient : GetContractByClient,
      GetModalityByBranch : GetModalityByBranch,
      GetProductByModality : GetProductByModality,
      GetSubProductByProduct : GetSubProductByProduct,
      GetPolicyByBranch : GetPolicyByBranch,
      GetContractByPolicy : GetContractByPolicy,
      GetSubContractByContract : GetSubContractByContract,
      GetContractor : GetContractor,

      // Buscar clientes
      getClienteSearch: getClienteSearch,
      // Buscar coberturas
      getCoberturaSearch: getCoberturaSearch,

       /* Asignacion Clinica y Diagnostico */
      // Listado de ejecutivos Mapfre
      GetListExecutives: GetListExecutives,
      // Listado de coordinadores clinica
      GetListCoordinator: GetListCoordinator,
      // Listado de clinicas de ejecutivo
      GetListClinicExecutive: GetListClinicExecutive,
      // Listado de clinicas no asignadas para ejecutivo
      GetListClinicNotAsignedExecutive: GetListClinicNotAsignedExecutive,
      // Asignar clinica a ejecutivo
      RegisterClinicExecutive: RegisterClinicExecutive,
      // Eliminar clinica de ejecutivo
      RemoveClinicExecutive: RemoveClinicExecutive,
      // Listado de diagnosticos de ejecutivo
      ListDiagnosticExecutive: ListDiagnosticExecutive,
      // Asignar diagnostico a ejecutivo
      RegisterDiagnosticExecutive: RegisterDiagnosticExecutive,
      // Eliminar diagnostico de ejecutivo
      RemoveDiagnosticExecutive: RemoveDiagnosticExecutive,
      // Listado de clinicas de coordinador
      GetListClinicCoordinator: GetListClinicCoordinator,
      // Listado de clinicas no asignadas para coordinador
      GetListClinicNotAsignedCoordinator: GetListClinicNotAsignedCoordinator,
      // Asignar clinica a coordinador
      RegisterClinicCoordinator: RegisterClinicCoordinator,
      // Eliminar clinica de coordinador
      RemoveClinicCoordinator: RemoveClinicCoordinator,

      /* Suma Asegurada */
      // Listado de registros de suma asegurada
      GetListSumaAsegurada: GetListSumaAsegurada,
      // Detalle de suma asegurada
      GetDetailSumaAsegurada: GetDetailSumaAsegurada,
      // Registrar nueva suma asegurada
      SaveSumaAsegurada: SaveSumaAsegurada,
      // Editar suma asegurada
      EditSumaAsegurada: EditSumaAsegurada,
      // Eliminar suma asegurada
      DeleteSumaAsegurada: DeleteSumaAsegurada,

      /* Condicionado */
      // Listar Ramos
      GetListRamos: GetListRamos,
      // Listar Contratos
      GetListContratos: GetListContratos,
      // Listar Modalidades
      GetListModalidades: GetListModalidades,
      // Listar Productos Salud
      GetListProductosSalud: GetListProductosSalud,
      // Listar Sub Productos Salud
      GetListSubProductosSalud: GetListSubProductosSalud,

      // Listado de registros de condicionados
      GetListCondicionado: GetListCondicionado,
      // Detalle de condicionado
      GetDetailCondicionado: GetDetailCondicionado,
      // Registrar nuevo condicionado
      SaveCondicionado: SaveCondicionado,
      // Editar condicionaco
      EditCondicionado: EditCondicionado,
      // Eliminar condicionado
      DeleteCondicionado: DeleteCondicionado,

      /* Contacto farmaco */
      // Listado de registros de contacto
      GetListContacto: GetListContacto,
      // Registrar nuevo contacto
      SaveContacto: SaveContacto,
      // Editar contacto
      EditContacto: EditContacto,
      // Eliminar contacto
      DeleteContacto: DeleteContacto,

      /* Solciitar SCAN */
      // Listar coordinadores
      GetCoordinatorByGuaranteeLetter: GetCoordinatorByGuaranteeLetter,

      // Listar clinicas por coordinador
      GetClinicsByCoordinatorToScanRequest: GetClinicsByCoordinatorToScanRequest,

      // Guardar Solicitar Scan
      SaveScanRequest: SaveScanRequest,

      /* Datos SCAN - Editar */
      // Listar clinicas por coordinador
      GetClinicsByCoordinatorToScanEdit: GetClinicsByCoordinatorToScanEdit,

      // Guardar Datos Scan
      SaveScanData: SaveScanData,

      /* Datos SCAN - Lectura */
      // Obtener Datos Scan
      GetScanData: GetScanData,

      /* Altos Costos */
      // Listar medicinas por buscador
      GetMedicines: GetMedicines,
      // Listar medicamentos de altos costos
      GetHighCostMedicine: GetHighCostMedicine,
      // Registrar medicamentos de altos costos
      SaveHighCostMedicine: SaveHighCostMedicine,
      // Eliminar medicamento de altos costos
      RemoveHighCostMedicine: RemoveHighCostMedicine,
      
      /* Rechazar Carta Garantia */
      // Obtener informacion de condicionado
      GetInfoCondicionado: GetInfoCondicionado,
      // Obtener vista previa en base al motivo de rechazo
      GetPreviewByRejectReason: GetPreviewByRejectReason,

      /* Visualizar tarifas */
      // Obtener servicios de tarifa de una carta
      GetServicesByGl: GetServicesByGl,

      // Obtener paquetes de tarifa de una carta
      GetPackagesByGl: GetPackagesByGl,

      // Obtener lista de ejecutivos asignados
      GetAssigendExecutives: GetAssigendExecutives,

      /* Reporte SCAN */
      // Obtener lista de estados scan
      GetListCGWScanState: GetListCGWScanState,

      // Generar reporte scan segun tipo de archivo
      GetReportScan: GetReportScan,

      getPreexistenciasTemporales: getPreexistenciasTemporales,

      GetListComplaintReasonReject: GetListComplaintReasonReject,
      GetListComplaintReasonFinalized: GetListComplaintReasonFinalized,
      ComplaintRequired: ComplaintRequired,

      SendInvalidezMail: SendInvalidezMail,
      GenerateReticencia: GenerateReticencia,

      getListAllClinics: getListAllClinics,

      getListDocumentsReject: getListDocumentsReject,
      addDocumentReject: addDocumentReject,
      deleteDocumentReject: deleteDocumentReject,
      SendMail: SendMail
     };
  }]);

  appCgw.service('fileUpload', ['$http', '$q', 'mpSpin', function ($http, $q, mpSpin) {
    this.solicitarCartaURL = function(file, paramsCarta) {
      var deferred = $q.defer();
      var fd = new FormData();
      var carta = {
        GuaranteeLetter: paramsCarta.GuaranteeLetter,
        Budgets: paramsCarta.Budgets,
        AttachFiles: []
      };

      fd.append("request", JSON.stringify(carta));

      if (file===null) {
       // fd.append("fieldNameHere", null);
      } else {
        for(var i=0; i<file.length; i++) {
          fd.append("fieldNameHere", file[i]);
        }
      }

      $http.post(constants.system.api.endpoints.cgw+ 'api/guaranteeletter/save', fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined},
          eventHandlers: {
                progress: function(c) {
                }
            },
            uploadEventHandlers: {
                progress: function(e) {
                    mpSpin.start();
                }
            }
      })
      .then( function(response) {
        mpSpin.end();
        deferred.resolve(response);
      });
      mpSpin.end();
      return deferred.promise;
    }
  }]);

  appCgw.service('stepsService', function() {
    var step = [];
    var step1 = [];
    var step2 = [];
    var step3 = [];
    var step4 = [];

    function addStep(newObj) {
      step = newObj ;
    }

    function getStep(){
      return step;
    }

    function addStep1(newObj) {
      step1 = newObj ;
    }

    function getStep1(){
      return step1;
    }

    function addStep2(newObj) {
      step2 = newObj ;
    }

    function getStep2(){
      return step2;
    }

    function addStep3(newObj) {
      step3 = newObj ;
    }

    function getStep3(){
      return step3;
    }

    function addStep4(newObj) {
      step4 = newObj ;
    }

    function getStep4(){
      return step4;
    }


    return {
      addStep: addStep,
      getStep: getStep,
      addStep1: addStep1,
      getStep1: getStep1,
      addStep2: addStep2,
      getStep2: getStep2,
      addStep3: addStep3,
      getStep3: getStep3,
      addStep4: addStep4,
      getStep4: getStep4
    };

  });

});
