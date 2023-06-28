'use strict';

define(['angular', 'constants', 'inspecFactoryHelper', 'moment', 'helper', 'lodash', 'fileSaver'], function (
  ng,
  constants,
  inspecFactoryHelper,
  moment,
  helper,
  _,
  fileSaver
) {
  inspecFactory.$inject = [
    'proxySelfInspectionChannel',
    'proxyInspection',
    'proxyDomicilio',
    'proxyUbigeo',
    'proxyGeneral',
    'proxyCotizacion',
    'proxyAutomovil',
    'proxyContratante',
    'proxyTipoDocumento',
    'proxyRequest',
    'proxyCommon',
    'proxyGestor',
    'proxyAgente',
    'proxyProducto',
    'proxySchedule',
    'proxyManagement',
    'proxyEmision',
    'proxyReport',
    'proxySelfInspection',
    'oimPrincipal',
    'httpData',
    '$q',
    '$http',
    'mpSpin',
    '$log',
    'accessSupplier',
    '$window',
    'oimAbstractFactory',
    'proxyAlerts',
    'proxyMenu'
  ];

  function inspecFactory(
    proxySelfInspectionChannel,
    proxyInspection,
    proxyDomicilio,
    proxyUbigeo,
    proxyGeneral,
    proxyCotizacion,
    proxyAutomovil,
    proxyContratante,
    proxyTipoDocumento,
    proxyRequest,
    proxyCommon,
    proxyGestor,
    proxyAgente,
    proxyProducto,
    proxySchedule,
    proxyManagement,
    proxyEmision,
    proxyReport,
    proxySelfInspection,
    oimPrincipal,
    httpData,
    $q,
    $http,
    mpSpin,
    $log,
    accessSupplier,
    $window,
    oimAbstractFactory,
    proxyAlerts,
    proxyMenu
  ) {
    var factory = {
      requests: {
        GetRequests: GetRequests,
        getRequests: GetRequests,
        GetRequestById: GetRequestById,
        VoidRequest: VoidRequest,
        voidRequest: VoidRequest,
        undoVoid: UndoVoid,
        GetForEmission: GetForEmission,
        GetAutoinspection: GetAutoinspection,
        getSchedule: GetSchedule,
        GetModelByName: GetModelByName,
        loadExcel: LoadExcel,
        getAlerts: getAlerts,
        addAlert: AddAlert,
        addAlertFleet: AddAlertFleet,
        addRequest: AddRequest,
        getFleetForAlerts: GetFleetForAlerts,
        getRules: getRules,
        getRequestById: GetRequestById,
        updateRequest: UpdateRequest,
        registerSelfInspections: RegisterSelfInspections,
        verifyRules: verifyRules,
        getDetailsVehicleByLicense: getDetailsVehicleByLicense,
        alertsNotify: alertsNotify,
        rehabilitate: rehabilitate,
        verifyVehicleRules: verifyVehicleRules,
        uploadPdfFromAnotherInsurer: uploadPdfFromAnotherInsurer,
        getInsurer: getInsurer,
        getDocumentFromAnotherInsurer: getDocumentFromAnotherInsurer
      },
      inspec: {
        addInspectionImage: addInspectionImage,
        saveInspection: saveInspection,
        getInspectionByRiskId: GetInspectionByRiskId,
        endInspection: EndInspection,
        deleteInspectionImage: DeletePhoto,
        showInspectionImage: ShowInspectionImage,
        grabarEmisionConInspeccion: grabarEmisionConInspeccion,
        addObservation: addObservation,
        getObservations: getObservations,
        resolveObservation: resolveObservation,
      },
      schedule: {
        getInspectorsAvailability: getInspectorsAvailability,
        addSchedule: AddSchedule,
        addJournal: AddJournal,
        listPermission: ListPermission,
        deleteJournal: DeleteJournal,
      },
      autoInspeccion: {
        getAutoInspeccionFilter: getAutoInspeccionFilter,
        getAutoInspeccionSolicitud: getAutoInspeccionSolicitud,
        postAutoInspeccionSolicitud: postAutoInspeccionSolicitud,
        editAutoInspeccionSolicitud: editAutoInspeccionSolicitud,
        deleteAutoInspeccionSolicitud: deleteAutoInspeccionSolicitud,
        sentSolicitud: sentSolicitud,
        downloadSolicitud: downloadSolicitud
      },
      quotations: {
        quotationListExtend: QuotationListExtend,
        getQuotations: GetQuotations,
        GetQuotations: GetQuotations,
        getQuotationsByNumber: GetQuotationsByNumber,
      },
      vehicle: {
        getListMarcaModelo: GetListMarcaModelo,
        getListSubModelo: GetListSubModelo,
        getListAnoFabricacion: GetListAnoFabricacion,
        getValorSugerido: GetValorSugerido,
        getListProductoPorVehiculo: getListProductoPorVehiculo,
        getListTipoUso: GetListTipoUso,
        getPoliza: GetPoliza,
        getListColor: GetListColor,
        getInfoByLicensePlate: GetInfoByLicensePlate,
        getInfoByLicensePlate2: getInfoByLicensePlate2,
        validatePlate: validatePlate,
        getTipoVehiculo: getTipoVehiculo,
        getSubmodelo: getSubmodelo,
        getGps: getGps,
        getListProductsByVehicle: getListProductsByVehicle
      },
      common: {
        getFrustrateType: GetFrustrateType,
        GetLocation: GetLocation,
        GetProviders: GetProviders,
        GetState: GetState,
        getStatusSchedule: GetStatusSchedule,
        GetListGestor: GetListGestor,
        getAgents: GetAgents,
        GetProducts: GetProducts,
        getInspectionType: GetInspectionType,
        getTipoDocumento: GetTipoDocumento,
        getContratanteByNroDocumento: GetContratanteByNroDocumento,
        getOcupacion: GetOcupacion,
        getListFinanciamiento: GetListFinanciamiento,
        getListEndosatario: GetListEndosatario,
        getEndosatario: GetEndosatario,
        getListEstadoCivil: GetListEstadoCivil,
        getListPais: GetListPais,
        getRequestType: GetRequestType,
        getCalculatePremium: GetCalculatePremium,
        getCalculateDiscount: GetCalculateDiscount,
        getInspectorSchedule: getInspectorSchedule,
        searchInspectors: searchInspectors,
        getPermission: getPermission,
        getPhotoType: GetPhotoType,
        getWheelDrive: GetWheelDrive,
        getVehicleOrigin: GetVehicleOrigin,
        getStereo: GetStereo,
        getAccesories: GetAccesories,
        getVehicleStatus: GetVehicleStatus,
        getSteeringWheel: GetSteeringWheel,
        getGestorOficina: GetGestorOficina,
        getAgentById: GetAgentById,
        getFieldsAvailable: getFieldsAvailable,
        getProfile: getProfile,
        getRoleCode: getRoleCode,
        getViewDctoByAgent: getViewDctoByAgent,
        getInputFileOnBase64: getInputFileOnBase64,
        getPhotoTypeByVehicleTypeAndDeviceType: getPhotoTypeByVehicleTypeAndDeviceType
      },
      ubigeo: {
        getDepartamentos: GetDepartamentos,
        getProvincias: GetProvincias,
        getDistritos: GetDistritos,
        getListTipo: GetListTipo,
        getListInterior: GetListInterior,
        getListZona: GetListZona,
        getNumeracionDomicilio: GetNumeracionDomicilio,
      },
      management: {
        providerSearch: ProviderSearch,
        providerSearchTron: ProviderSearchTron,
        addProvider: AddProvider,
        deleteProvider: DeleteProvider,
        assignRulesSearch: AssignRulesSearch,
        addAssignRule: AddAssignRule,
        updAssignRule: UpdAssignRule,
        coordinatorSearch: CoordinatorSearch,
        inspectorSearch: InspectorSearch,
        subscriptorSearch: SubscriptorSearch,
        automasSearch: AutomasSearch,
        automasBrand: AutomasBrand,
        automasFilters: AutomasFilters,
        automasSearchDetail: AutomasSearchDetail,
        automasMongoFilters: AutomasMongoFilters,
        automasMongoBrandFilter: AutomasMongoBrandFilter,
        automasMongoSearch: AutomasMongoSearch,
        automasBulkUpload: AutomasBulkUpload,
        searchParameterGroup: SearchParameterGroup,
        addParameterGroup: AddParameterGroup,
        updateParameterGroup: UpdateParameterGroup,
        searchParameterDetail: SearchParameterDetail,
        addParameterDetail: AddParameterDetail,
        updateParameterDetail: UpdateParameterDetail,
        automasMongoSearchByName: AutomasMongoSearchByName,
        autoCompleteTerritorial: autoCompleteTerritorial,
        autoCompleteExecutives: autoCompleteExecutives,
        autoCompleteAgents: autoCompleteAgents,
        getInspectorByRequestId: getInspectorByRequestId,
        getEmitInfoByRequestID: getEmitInfoByRequestID,
        getItemListTotalLost: getItemListTotalLost,
        loadDataLost: loadDataLost,
        totalLostSearch: totalLostSearch,
        synchronizeAgents: synchronizeAgents,
        getAgentsPagination: getAgentsPagination,
        updateStatusAgent: updateStatusAgent,
      },
      reports: {
        vehicleDetails: VehicleDetails,
        reportAlerts: ReportAlerts,
        trackingReport: TrackingReport,
        managementByDepartments: ManagementByDepartments,
        managementByDepartmentsDetails: ManagementByDepartmentsDetails,
        exportManagementByDepartmentsDetails: ExportManagementByDepartmentsDetails,
        exportManagementByDepartments: ExportManagementByDepartments,
        timeManagement: TimeManagement,
        exportTimeManagement: ExportTimeManagement,
        inspectionManagement: InspectionManagement,
        exportInspectionManagement: ExportInspectionManagement,
        downloadPdf: downloadPdf,
      },
      getHomeMenu: _getHomeMenu,
      getSubMenu : _getSubMenu,
      isAuthorized: function(toState, toParams, callbackDenegado) {
        return _isAuthorizedSubMenu(toState, toParams, callbackDenegado);
      },
      picture: {
        getOrientation: getOrientation,
      },
      blackList: {
        ValidBlackList: ValidBlackList,
        saveAuditBlackList: saveAuditBlackList
      },
    };

    var LOCAL_STORE = $window['localStorage'],
    KEY_SUB_MENU = 'inspecSubMenu',
    KEY_HOME_MENU = 'inspecHomeMenu';

    return ng.extend({}, factory, inspecFactoryHelper);

    function getViewDctoByAgent(id) {
      var params = {CodigoAgente: id};
      return proxyGeneral.EsDescuentoIntegralidadParaAgentes(params, false);
    }

    function getListProductsByVehicle(proSec) {
      return proxyProducto.getListProductoPorVehiculo(proSec, false);
    }

    function getEmitInfoByRequestID(id) {
      return proxyManagement.GetEmitInfoByRequestID(id, false);
    }

    function getInspectorByRequestId(request) {
      return proxyManagement.GetInspectorByRequestID(request, false);
    }

    function getProfile() {
      var profile = JSON.parse(localStorage.getItem('profile'));
      return profile;
    }

    function getRoleCode() {
      var evo = JSON.parse(localStorage.getItem('evoProfile'));
      var itemRole = _.find(evo.rolesCode, {nombreAplicacion: 'INSPEC'});
      return itemRole.codigoRol;
    }

    function upperCaseObject(obj) {
      var newObj = {};
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          var value = obj[key];
          if (ng.isString(value)) {
            newObj[key] = value.toUpperCase().trim();
          } else if (ng.isArray(value)) {
            for (var j = 0; j < value.length; j++) {
              value[j] = upperCaseObject(value[j]);
            }
            newObj[key] = value;
          } else if (ng.isDate(value)) {
            newObj[key] = value;
          } else if (ng.isObject(value)) {
            newObj[key] = upperCaseObject(value);
          } else {
            newObj[key] = value;
          }
        }
      }
      return newObj;
    }

    function getData(url) {
      var newUrl = url;
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: constants.system.api.endpoints.policy + newUrl,
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(
        function (response) {
          deferred.resolve(response.data);
        },
        function (response) {
          deferred.reject(response);
        }
      );
      return deferred.promise;
    }

    // proxyRequest requests
    function GetRequests(request, showSpin) {
      request.userRole = oimPrincipal.get_role();
      return proxyRequest.GetRequests(upperCaseObject(request), showSpin);
    }

    function GetRequestById(requestId, showSpin) {
      return proxyRequest.GetRequestById(requestId, showSpin);
    }

    function UpdateRequest(request, showSpin) {
      return proxyRequest.UpdateRequest(request, showSpin);
    }

    function RegisterSelfInspections(request, showSpin) {
      return proxySelfInspection.NotifySelefinspection(request, showSpin);
    }

    function GetListMarcaModelo(params, showSpin) {
      return proxyAutomovil.GetListMarcaModelo(params, showSpin);
    }

    function GetListSubModelo(codigoMarca, codTipoVehiculo, codigoModelo, showSpin) {
      var params = '/' + codigoMarca + '/' + codTipoVehiculo + '/' + codigoModelo;
      return getData('api/automovil/submodelo/' + constants.module.polizas.autos.companyCode + params, '');
    }

    function GetListAnoFabricacion(codigoMarca, codigoModelo, codigoSubModelo, showSpin) {
      return proxyAutomovil.GetListAnoFabricacion(codigoMarca, codigoModelo, codigoSubModelo, showSpin);
    }

    function GetValorSugerido(codMarca, codModelo, codSubModelo , TipoVehiculo , anioFabricacion , mTipoVehiculo, showSpin) {
      return proxyAutomovil.GetValorSugerido(1, codMarca, codModelo, codSubModelo , TipoVehiculo, anioFabricacion , mTipoVehiculo, showSpin);
    }

    function getListProductoPorVehiculo(params, showSpin) {
      params.CodigoUsuario = oimPrincipal.getUsername().toUpperCase();
      return proxyProducto.getListProductoPorVehiculo(params, showSpin);
    }

    function GetListTipoUso(codMod, codTip, showSpin) {
      return proxyAutomovil.GetListTipoUso(constants.module.polizas.autos.codeRamo, codMod, codTip, showSpin);
    }

    function GetPoliza(polGrupo, showSpin) {
      return proxyAutomovil.GetPoliza(polGrupo, showSpin);
    }

    function GetListColor(showSpin) {
      return proxyAutomovil.GetListColor(showSpin);
    }

    function VoidRequest(request, showSpin) {
      request.UserName = oimPrincipal.getUsername().toUpperCase();
      request.UserRole = oimPrincipal.get_role();
      return proxyRequest.VoidRequest(upperCaseObject(request), showSpin);
    }

    function UndoVoid(requestId, riskId, showSpin) {
      var data = {
        RequestId: requestId,
        RiskId: riskId,
        UserName: oimPrincipal.getUsername().toUpperCase(),
        UserRole: oimPrincipal.get_role(),
      };
      return proxyRequest.UndoVoid(data, showSpin);
    }

    function GetForEmission(inspectionId, showSpin) {
      return proxyRequest.GetForEmission(inspectionId, showSpin);
    }

    function GetAutoinspection(showSpin) {
      return proxyRequest.GetAutoinspection(showSpin);
    }

    function GetSchedule(request, showSpin) {
      return proxySchedule.GetSchedule(upperCaseObject(request), showSpin);
    }

    function GetModelByName(requestType, showSpin) {
      return proxyRequest.GetModelByName(requestType, showSpin);
    }

    function uploadPdfFromAnotherInsurer(request) {
      return proxyRequest.UploadDocumentFromAnotherInsurer(request, true)
    }

    function getInsurer() {
      return proxyCommon.GetInsurers(true)
    }

    function getDocumentFromAnotherInsurer(requestId, riskId) {
      return downloadPdfFile(requestId, riskId);
      // return proxyRequest.GetDocumentFromAnotherInsurer(requestId, riskId, true);
    }

    function LoadExcel(file) {
      var deferred = $q.defer();
      var fd = new FormData();
      mpSpin.start();
      fd.append('file', file);
      fd.append('user', oimPrincipal.getUsername().toUpperCase());
      fd.append('filename', file.name);
      fd.append('token', 'cualquiercosa');
      $http
        .post(constants.system.api.endpoints.inspec + 'api/request/excel', fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined},
          eventHandlers: {
            progress: function (c) {
              $log.log('Progress -> ' + c);
              $log.log(c);
            },
          },
          uploadEventHandlers: {
            progress: function (e) {
              $log.log('UploadProgress -> ' + e);
              $log.log(e);
              $log.log('loaded: ' + e);
              $log.log('total: ' + e);
            },
          },
        })
        .success(
          function (response) {
            mpSpin.end();
            deferred.resolve(response);
          },
          function () {
            var e = deferred.reject(e);
            mpSpin.end();
          }
        )
        .error(function (data) {
          mpSpin.end();
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function addInspectionImage(file, riskId, photo) {
      var deferred = $q.defer();
      var fd = new FormData();
      fd.append('file', file);
      fd.append('inspectionid', photo.inspectionId ? photo.inspectionId : null);
      fd.append('sequenceid', photo.sequenceid ? photo.sequenceid : null);
      fd.append('riskid', riskId);
      fd.append('phototypeid', photo.photoTypeId || photo.parameterId);
      fd.append('imagename', file.name);
      fd.append('systemCode', oimAbstractFactory.getOrigin());
      $http
        .post(constants.system.api.endpoints.inspec + 'api/inspection/Photo/Add', fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined},
          eventHandlers: {
            progress: function (c) {
              $log.log('Progress -> ' + c);
              $log.log(c);
            },
          },
          uploadEventHandlers: {
            progress: function (e) {
              $log.log('UploadProgress -> ' + e);
              $log.log(e);
              $log.log('loaded: ' + e);
              $log.log('total: ' + e);
            },
          },
        })
        .then(function (response) {
          mpSpin.end();
          deferred.resolve(response);
        });
      mpSpin.start();
      return deferred.promise;
    }

    function DeletePhoto(request, showSpin) {
      return proxyInspection.DeletePhoto(request, showSpin);
    }

    function ShowInspectionImage(inspectionId, sequenceid, photoId, showSpin) {
      return proxyInspection.GetImagePath(inspectionId, sequenceid, photoId, showSpin);
    }

    function grabarEmisionConInspeccion(request, showSpin) {
      return proxyEmision.grabarEmisionConInspeccion(request, showSpin);
    }

    function saveInspection(params, showSpin) {
      var request = ng.copy(params);
      request.inspectionStatusCode = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/) ? 2 : 1;
      request.photos = null;
      return proxyInspection.SaveInspection(upperCaseObject(request), showSpin);
    }

    function GetInspectionByRiskId(riskId, showSpin) {
      return proxyInspection.GetInspectionByRiskId(riskId, showSpin);
    }

    function EndInspection(params, showSpin) {
      var request = ng.copy(params);
      request.inspectionStatusCode = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/) ? 2 : 1;
      request.photos = null;
      return proxyInspection.EndInspection(upperCaseObject(request), showSpin);
    }

    function getAlerts(riskid, showSpin) {
      return httpData.get(
        helper.formatNamed(constants.system.api.endpoints['inspec'] + '/api/alerts/list/{riskid}', {
          riskid: {value: riskid, defaultValue: '0'},
        }),
        undefined,
        undefined,
        showSpin
      );
    }

    function AddAlert(alert, showSpin) {
      alert.UserCode = oimPrincipal.getUsername().toUpperCase();
      alert.UserRole = oimPrincipal.get_role();
      return proxyAlerts.AddAlert(alert, showSpin);
    }

    function AddAlertFleet(alerts, showSpin) {
      ng.forEach(alerts, function (alert) {
        alert.UserCode = oimPrincipal.getUsername().toUpperCase();
        alert.UserRole = oimPrincipal.get_role();
      });
      var request = {data: alerts};
      return proxyAlerts.AddAlertFleet(upperCaseObject(request), showSpin);
    }

    function AddRequest(request, showSpin) {
      request.UserOwnerCode = oimPrincipal.getUsername().toUpperCase();
      return proxyRequest.AddRequest(upperCaseObject(request), showSpin);
    }

    function GetFleetForAlerts(requestId, showSpin) {
      return proxyAlerts.GetFleetForAlerts(requestId, showSpin);
    }

    //control de cambios noviembre 2018
    function verifyRules(params) {
      return proxySelfInspection.VerifyRules(params, true);
    }

    function getDetailsVehicleByLicense(license) {
      return proxySelfInspection.GetInfoCarByLicensePlate(license, true);
    }

    function autoCompleteTerritorial(territorialStructure, executive, agent) {
      var agentId = ng.isUndefined(agent) ? '' : agent.id;
      var executiveId = ng.isUndefined(executive) ? '' : executive.id;
      return proxySelfInspection.GetTerritorialStructure(territorialStructure, executiveId, agentId, false);
    }

    function autoCompleteExecutives(territorialStructure, executive, agent) {
      var agentId = ng.isUndefined(agent) ? '' : agent.id;
      var territorialStructureId = ng.isUndefined(territorialStructure) ? '' : territorialStructure.id;
      return proxySelfInspection.GetExecutives(territorialStructureId, executive, agentId, false);
    }

    function autoCompleteAgents(territorialStructure, executive, agent) {
      var executiveId = ng.isUndefined(executive) ? '' : executive.id;
      var territorialStructureId = ng.isUndefined(territorialStructure) ? '' : territorialStructure.id;
      return proxySelfInspection.GetAgents(territorialStructureId, executiveId, agent, false);
    }

    function alertsNotify(params) {
      return proxyAlerts.NotifyUser(params, true);
    }

    function updateStatusAgent(params) {
      return proxySelfInspection.EnableAgent(params, true);
    }

    function rehabilitate(requestId, riskId) {
      return proxyRequest.RehabilitateRequest(requestId, riskId, true);
    }

    function verifyVehicleRules(request) {
      return proxySelfInspection.VerifyVehicleRules(request, true);
    }

    // proxySchedule
    function getInspectorsAvailability(request, showSpin) {
      return proxySchedule.GetInspectorsAvailability(upperCaseObject(request), showSpin);
    }

    function AddSchedule(params, showSpin) {
      params.UserOwnerCode = oimPrincipal.getUsername().toUpperCase();
      return proxySchedule.AddSchedule(upperCaseObject(params), showSpin);
    }

    function AddJournal(params, showSpin) {
      params.UserOwnerCode = oimPrincipal.getUsername().toUpperCase();
      return proxySchedule.AddJournal(upperCaseObject(params), showSpin);
    }

    function ListPermission(params, showSpin) {
      return proxySchedule.ListPermission(params, showSpin);
    }

    function DeleteJournal(params, showSpin) {
      return proxySchedule.DeleteJournal(params, showSpin);
    }
    // proxyQuotations requests
    function QuotationListExtend(params, showSpin) {
      return proxyRequest.QuotationListExtend(upperCaseObject(params), showSpin);
    }

    function GetQuotations(params, showSpin) {
      return httpData.post(
        constants.system.api.endpoints['policy'] + 'api/documento/inspection/quotation/used',
        upperCaseObject(params),
        undefined,
        showSpin
      );
    }
    function GetQuotationsByNumber(number, showSpin) {
      var params = number.split('-');
      return httpData.get(
        helper.formatNamed(
          constants.system.api.endpoints['policy'] + 'api/documento/inspection/{bussinessId}/{docNumber}/{ramoId}',
          {
            bussinessId: {value: params[0], defaultValue: '0'},
            docNumber: {value: params[1], defaultValue: '0'},
            ramoId: {value: params[2], defaultValue: '0'},
          }
        ),
        undefined,
        undefined,
        showSpin
      );
    }

    function ValidBlackList(request, showSpin) {
      return httpData.post(
        constants.system.api.endpoints['policy'] + 'api/consultaListaNegra',
        request,
        undefined,
        showSpin
      );
    }
    function saveAuditBlackList(request, showSpin) {
      return httpData.post(
        constants.system.api.endpoints['policy'] + 'api/auditoria',
        request,
        undefined,
        showSpin
      );
    }

    // proxyCommon requests
    function GetFrustrateType(showSpin) {
      return proxyCommon.GetFrustrateType(showSpin);
    }

    function GetLocation(place, showSpin) {
      return proxyCommon.GetLocation(place, showSpin);
    }

    function GetProviders(name, showSpin) {
      return httpData.get(
        helper.formatNamed(constants.system.api.endpoints['inspec'] + 'api/common/provider/{name}', {
          name: {value: null, defaultValue: ''},
        }),
        undefined,
        undefined,
        showSpin
      );
    }

    function GetState(showSpin) {
      return proxyCommon.GetState(showSpin);
    }

    function GetStatusSchedule(showSpin) {
      return proxyCommon.GetStatusSchedule(showSpin);
    }

    function GetListGestor(data, showSpin) {
      var query = {
        nombreGestor: data,
        rolUsuario: oimPrincipal.get_role(),
        codigoOficina: oimPrincipal.isAdmin() ? 0 : accessSupplier.profile().officeCode,
        codigoAgente: oimPrincipal.getAgent().codigoAgente,
      };
      return proxyGestor.GetListGestor(upperCaseObject(query), showSpin);
    }

    function GetAgents(name) {
      return proxyAgente.buscarAgente(name);
    }

    function GetProducts(userCode, showSpin) {
      return proxyProducto.GetListProductoBandeja(userCode, showSpin);
    }

    function GetInspectionType(showSpin) {
      return proxyCommon.GetInspectionType(showSpin);
    }

    function GetTipoDocumento() {
      return proxyTipoDocumento.getTipoDocumento(false);
    }

    function GetContratanteByNroDocumento(TipoDoc, NroDocumento, showSpin) {
      return proxyContratante.GetContratanteByNroDocumento(1, TipoDoc, NroDocumento, showSpin);
    }

    function GetOcupacion(showSpin) {
      return proxyGeneral.GetOcupacion(null, null, showSpin);
    }

    function getInspectorSchedule(showSpin) {
      return proxyCommon.GetInspectorSchedule(null, null, showSpin);
    }

    function searchInspectors(type, nro, showSpin) {
      return proxyCommon.GetInspectorSchedule(type, nro, showSpin);
    }

    function getPermission(showSpin) {
      return proxyCommon.GetPermission(showSpin);
    }

    function GetPhotoType(showSpin) {
      return proxyCommon.GetPhotoType(showSpin);
    }

    function GetWheelDrive(showSpin) {
      return proxyCommon.GetWheelDrive(showSpin);
    }

    function GetVehicleOrigin(showSpin) {
      return proxyCommon.GetVehicleOrigin(showSpin);
    }

    function GetStereo(showSpin) {
      return proxyCommon.GetStereoTron(showSpin);
    }

    function GetAccesories(showSpin) {
      return proxyCommon.GetAccesories(showSpin);
    }

    function GetVehicleStatus(showSpin) {
      return proxyCommon.GetVehicleStatus(showSpin);
    }

    function GetSteeringWheel(showSpin) {
      return proxyCommon.GetSteeringWheel(showSpin);
    }

    function GetGestorOficina(agent, showSpin) {
      return proxyGeneral.GetGestorOficina(constants.module.polizas.autos.companyCode, agent, showSpin);
    }

    function GetAgentById(agentId, showSpin) {
      return proxyCommon.GetAgentById(agentId, showSpin);
    }

    function getFieldsAvailable() {
      return proxyCommon.GetFieldsAvailable(true);
    }

    function getPhotoTypeByVehicleTypeAndDeviceType(vehicleType, deviceType) {
      return proxyCommon.GetPhotoTypeByVehicleTypeAndDeviceType(vehicleType, deviceType, true)
    }

    function GetInfoByLicensePlate(plate, showSpin) {
      return httpData.get(
        helper.formatNamed(constants.module.inspec[constants.environment].urlWSRSoatLicensePlate, {
          plate: {value: plate, defaultValue: ''},
        }),
        undefined,
        undefined,
        showSpin
      );
    }

    function getInfoByLicensePlate2(license, showSpin) {
      return proxySelfInspection.GetInfoByLicensePlate2(license, showSpin);
    }

    function getGps(params) {
      var codMar = params.codMar;
      var codMod = params.codMod;
      var codSub = params.codSub;
      var anoFab = params.anoFab;
      return proxyAutomovil.GetMcagps(codMar, codMod, codSub, anoFab, false);
    }

    function validatePlate(plate, showSpin) {
      var request = {
        CodigoCompania: 1,
        Poliza: {
          CodigoCompania: 1,
          CodigoRamo: 301,
          InicioVigencia: moment().format('DD/MM/YYYY'),
          FinVigencia: moment().add(2, 'years').format('DD/MM/YYYY'),
        },
        Vehiculo: {
          NumeroPlaca: plate.toUpperCase(),
        },
      };

      return proxyEmision.validatePlate(request, showSpin);
    }

    function getTipoVehiculo() {
      return proxyAutomovil.GetListTipoVehiculo(constants.module.polizas.autos.companyCode, false);
    }

    function getSubmodelo(codigoMarca, codigoModelo) {
      return proxyAutomovil.GetListSubModelo(
        constants.module.polizas.autos.companyCode,
        codigoMarca,
        codigoModelo,
        false
      );
    }

    function GetListFinanciamiento(vehicleType, showSpin) {
      var params = {
        vehicleType: vehicleType,
        codigo: 0,
      };
      return getData('api/general/financiamiento/tipo/' + params.vehicleType + '/' + params.codigo, false);
    }

    function GetListEndosatario(showSpin) {
      return proxyContratante.GetListEndosatario(showSpin);
    }

    function GetEndosatario(nroDoc) {
      return proxyContratante.GetEndosatarioTerceroByRuc(nroDoc);
    }

    function GetListEstadoCivil() {
      return proxyGeneral.GetListEstadoCivil(false);
    }

    function GetListPais(showSpin) {
      return proxyUbigeo.GetListPais(showSpin);
    }

    function GetRequestType(showSpin) {
      return proxyCommon.GetRequestType(showSpin);
    }

    function GetCalculatePremium(params, showSpin) {
      return proxyCotizacion.CalcularPrimaVehiculoIndividual(params, showSpin);
    }

    function GetCalculateDiscount(params, showSpin) {
      return proxyAutomovil.GetDescuentoComision(params, showSpin);
    }

    function getRules(params, showSpin) {
      return proxyRequest.Rules(params, showSpin);
    }

    // proxyUbigeo
    function GetDepartamentos(showSpin) {
      return proxyUbigeo.getDepartamento(showSpin);
    }

    function GetProvincias(id, showSpin) {
      return proxyUbigeo.getProvincia(id, showSpin);
    }

    function GetDistritos(id, showSpin) {
      return proxyUbigeo.getDistrito(id, showSpin);
    }

    function GetListTipo(showSpin) {
      return proxyDomicilio.GetListTipo(showSpin);
    }

    function GetNumeracionDomicilio(showSpin) {
      return proxyDomicilio.getNumeracionDomicilio(showSpin);
    }

    function GetListInterior(showSpin) {
      return proxyDomicilio.GetListInterior(showSpin);
    }

    function GetListZona(showSpin) {
      return proxyDomicilio.GetListZona(showSpin);
    }

    function ProviderSearch(request, showSpin) {
      return proxyManagement.ProviderSearch(request, showSpin);
    }

    function ProviderSearchTron(request, showSpin) {
      return proxyManagement.ProviderSearchTron(request, showSpin);
    }

    function AddProvider(request, showSpin) {
      return proxyManagement.AddProvider(upperCaseObject(request), showSpin);
    }

    function DeleteProvider(request, showSpin) {
      return proxyManagement.DeleteProvider(upperCaseObject(request), showSpin);
    }

    function AssignRulesSearch(request, showSpin) {
      return proxyManagement.AssignRulesSearch(upperCaseObject(request), showSpin);
    }

    function AddAssignRule(request, showSpin) {
      return proxyManagement.AddAssignRule(upperCaseObject(request), showSpin);
    }

    function UpdAssignRule(request, showSpin) {
      return proxyManagement.UpdAssignRule(upperCaseObject(request), showSpin);
    }

    function CoordinatorSearch(request, showSpin) {
      return proxyManagement.CoordinatorSearch(upperCaseObject(request), showSpin);
    }

    function InspectorSearch(request, showSpin) {
      return proxyManagement.InspectorSearch(upperCaseObject(request), showSpin);
    }

    function SearchParameterGroup(request, showSpin) {
      request = upperCaseObject(request);
      return proxyManagement.SearchParameterGroup(request.pageSize, request.pageNumber, request.description, showSpin);
    }

    function AddParameterGroup(request, showSpin) {
      return proxyManagement.AddParameterGroup(upperCaseObject(request), showSpin);
    }

    function UpdateParameterGroup(request, showSpin) {
      return proxyManagement.UpdateParameterGroup(upperCaseObject(request), showSpin);
    }

    function SearchParameterDetail(request, showSpin) {
      request = upperCaseObject(request);
      return proxyManagement.SearchParameterDetail(request.groupId, request.description, showSpin);
    }

    function AddParameterDetail(request, showSpin) {
      return proxyManagement.AddParameterDetail(upperCaseObject(request), showSpin);
    }

    function UpdateParameterDetail(request, showSpin) {
      return proxyManagement.UpdateParameterDetail(upperCaseObject(request), showSpin);
    }

    function AutomasMongoSearchByName(brand, model, pagesize, pageindex, showSpin) {
      return proxyManagement.AutomasMongoSearchByName(brand, model, pagesize, pageindex, showSpin);
    }

    function SubscriptorSearch(request, showSpin) {
      return proxyManagement.SubscriptorSearch(upperCaseObject(request), showSpin);
    }

    function AutomasSearch(brand, model, showSpin) {
      return proxyManagement.AutomasSearch(brand, model, showSpin);
    }

    function AutomasBrand(request, showSpin) {
      return proxyManagement.AutomasBrand(upperCaseObject(request), showSpin);
    }

    function AutomasFilters(showSpin) {
      return proxyManagement.AutomasFilters({}, showSpin);
    }

    function AutomasSearchDetail(brandid, modelid, showSpin) {
      return proxyManagement.AutomasSearchDetail(brandid, modelid, showSpin);
    }

    function AutomasMongoFilters(showSpin) {
      return proxyManagement.AutomasMongoFilters(showSpin);
    }

    function AutomasMongoBrandFilter(brandId, showSpin) {
      return proxyManagement.AutomasMongoBrandFilter(brandId, showSpin);
    }

    function AutomasMongoSearch(request, showSpin) {
      request.brandid = request.brandid || 0;
      request.modelid = request.modelid || 0;
      return proxyManagement.AutomasMongoSearch(
        request.brandid,
        request.modelid,
        request.pageSize,
        request.pageNumber,
        showSpin
      );
    }

    function AutomasBulkUpload(file) {
      var deferred = $q.defer();
      var fd = new FormData();
      mpSpin.start();
      fd.append('file', file);
      fd.append('user', oimPrincipal.getUsername().toUpperCase());
      fd.append('filename', file.name);
      $http
        .post(constants.system.api.endpoints.inspec + 'api/admin/automas/bulk', fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined},
          eventHandlers: {
            progress: function (c) {
              $log.log('Progress -> ' + c);
              $log.log(c);
            },
          },
          uploadEventHandlers: {
            progress: function (e) {
              $log.log('UploadProgress -> ' + e);
              $log.log(e);
              $log.log('loaded: ' + e);
              $log.log('total: ' + e);
            },
          },
        })
        .success(
          function (response) {
            mpSpin.end();
            deferred.resolve(response);
          },
          function () {
            var e = deferred.reject(e);
            mpSpin.end();
          }
        )
        .error(function (data) {
          mpSpin.end();
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function downloableReport(request, url) {
      var deferred = $q.defer();
      mpSpin.start();
      $http
        .post(constants.system.api.endpoints.inspec + url, request, {responseType: 'arraybuffer'})
        .success(
          function (data, status, headers) {
            var type = headers('Content-Type');
            var disposition = headers('Content-Disposition');
            var defaultFileName = '';
            if (disposition) {
              var match = disposition.match(/.*filename="?([^;"]+)"?.*/);
              if (match[1]) defaultFileName = match[1];
            }
            defaultFileName = defaultFileName.replace(/[<>:"/\\|?*]+/g, '_');
            var blob = new Blob([data], {type: type});
            $window.saveAs(blob, defaultFileName);
            deferred.resolve(defaultFileName);
            mpSpin.end();
          },
          function () {
            var e = deferred.reject(e);
            mpSpin.end();
          }
        )
        .error(function (data) {
          mpSpin.end();
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function downloadPdfFile(requestId, riskId, opts) {
      var deferred = $q.defer();
      mpSpin.start();
      $http
        .get(constants.system.api.endpoints.inspec + 'api/request/document-direct/' + requestId + '/' + riskId, {
          responseType: 'arraybuffer'
        })
        .success(
          function (data, status, headers) {
            var type = headers('Content-Type');
            var disposition = headers('Content-Disposition');

            // var defaultFileName = 'poliza.pdf';
            // if (disposition) {
            //   console.log(disposition);
            //   var match = disposition.match(/.*filename="?([^;"]+)"?.*/);
            //   if (match[1]) defaultFileName = match[1];
            // }
            // defaultFileName = defaultFileName.replace(/[<>:"/\\|?*]+/g, '_');
            // var blob = new Blob([data], {type: type});
            // $window.saveAs(blob, defaultFileName);

            // var FileName = opts.fileName;
            var FileName = 'poliza.pdf';
            var blob = new Blob([data], {
              type: type
            });
            fileSaver(blob, FileName);
            deferred.resolve(FileName);
            mpSpin.end();
          },
          function () {
            var e = deferred.reject(e);
            mpSpin.end();
          }
        )
        .error(function (data) {
          mpSpin.end();
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function VehicleDetails(request) {
      return downloableReport(request, 'api/report/vehicle');
    }

    function ReportAlerts(request) {
      return downloableReport(request, 'api/report/alerts');
    }

    function TrackingReport(request) {
      return downloableReport(request, 'api/report/tracking');
    }

    function ManagementByDepartments(request, showSpin) {
      return proxyReport.ManagementByDepartments(request, showSpin);
    }

    function ManagementByDepartmentsDetails(request, showSpin) {
      return proxyReport.ManagementByDepartmentsDetails(request, showSpin);
    }

    function ExportManagementByDepartmentsDetails(request) {
      return downloableReport(request, 'api/report/departments/download/details');
    }

    function ExportManagementByDepartments(request) {
      return downloableReport(request, 'api/report/departments/download/summary');
    }

    function TimeManagement(request, showSpin) {
      return proxyReport.TimeManagement(request, showSpin);
    }

    function ExportTimeManagement(request) {
      return downloableReport(request, 'api/report/time/download');
    }

    function InspectionManagement(request, showSpin) {
      return proxyReport.InspectionManagement(request, showSpin);
    }

    function ExportInspectionManagement(request) {
      return downloableReport(request, 'api/report/management/download');
    }

    function downloadPdf(riskid, inspectionid, showSpin) {
      return proxyReport.ResumePDF(riskid, inspectionid, showSpin);
    }

    //cc administracion
    function getItemListTotalLost(params) {
      return proxyManagement.TotalLostPagination(params, true);
    }

    function loadDataLost(file) {
      var deferred = $q.defer();
      var fd = new FormData();
      mpSpin.start();
      fd.append('file', file);
      fd.append('user', oimPrincipal.getUsername().toUpperCase());
      fd.append('filename', file.name);
      $http
        .post(constants.system.api.endpoints.inspec + 'api/admin/totalLost/bulk', fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined},
          eventHandlers: {
            progress: function (c) {
              $log.log('Progress -> ' + c);
              $log.log(c);
            },
          },
          uploadEventHandlers: {
            progress: function (e) {
              $log.log('UploadProgress -> ' + e);
              $log.log(e);
              $log.log('loaded: ' + e);
              $log.log('total: ' + e);
            },
          },
        })
        .success(
          function (response) {
            mpSpin.end();
            deferred.resolve(response);
          },
          function () {
            var e = deferred.reject(e);
            mpSpin.end();
          }
        )
        .error(function (data) {
          mpSpin.end();
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function totalLostSearch(txt) {
      return proxyManagement.TotalLostSearch(txt, false);
    }

    //exclusiones
    function synchronizeAgents() {
      return proxySelfInspection.SynchronizeAgents(true);
    }

    function getAgentsPagination(params) {
      var agentId = params.agentId;
      var territorialStructureId = params.territorialStructureId;
      var executiveId = params.executiveId;
      var pageNum = params.pageNum;
      var pageSize = params.pageSize;
      var sortingType = params.sortingType;

      return proxySelfInspection.GetPagination(
        agentId,
        territorialStructureId,
        executiveId,
        pageNum,
        pageSize,
        sortingType,
        true
      );
    }

    function getData(url) {
      var newUrl = url;
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: constants.system.api.endpoints.policy + newUrl,
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(
        function (response) {
          deferred.resolve(response.data);
        },
        function (response) {
          deferred.reject(response);
        }
      );
      return deferred.promise;
    }

    function getInputFileOnBase64(file) {
      var deferred = $q.defer();
      var reader = new FileReader();

      reader.onloadend = function() {
        var base64 = reader.result.replace("data:", "").replace(/^.+,/, "");
        deferred.resolve(base64);
      }
      reader.onerror = function() {
        deferred.reject(reader.result);
      }
      reader.readAsDataURL(file);

      return deferred.promise;
    }

    function getOrientation(file, callback) {
      var reader = new FileReader();

      reader.onload = function (event) {
        var view = new DataView(event.target.result);

        if (view.getUint16(0, false) != 0xffd8) return callback(-2);

        var length = view.byteLength;
        var offset = 2;

        while (offset < length) {
          var marker = view.getUint16(offset, false);
          offset += 2;

          if (marker == 0xffe1) {
            if (view.getUint32((offset += 2), false) != 0x45786966) {
              return callback(-1);
            }
            var little = view.getUint16((offset += 6), false) == 0x4949;
            offset += view.getUint32(offset + 4, little);
            var tags = view.getUint16(offset, little);
            offset += 2;

            for (var i = 0; i < tags; i++)
              if (view.getUint16(offset + i * 12, little) == 0x0112)
                return callback(view.getUint16(offset + i * 12 + 8, little));
          } else if ((marker & 0xff00) != 0xff00) break;
          else offset += view.getUint16(offset, false);
        }

        return callback(-1);
      };

      reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
    }
    // Solicitud TREC
    function getAutoInspeccionFilter(request) {
      // return proxySelfInspectionChannel.GetSelfInspectionRequests(request, true);
      return httpData.get(
        constants.system.api.endpoints['inspec'] + 'api/autoInspeccion/solicitud?numeroSolicitud='+request.numeroSolicitud+'&fechaDesde='+request.fechaDesde+'&fechaHasta='+request.fechaHasta+'&numeroPagina='+request.numeroPagina+'&cantidadPorPagina='+request.cantidadPorPagina+'&limite='+request.limite,
        undefined,
        undefined,
        true
      );
    }
    function getAutoInspeccionSolicitud(requestId) {
      return proxySelfInspectionChannel.GetSelfInspectionRequest(requestId, true);
    }
    function postAutoInspeccionSolicitud(request) {
      return proxySelfInspectionChannel.SaveAutoinspeccion(request, true);
    }
    function editAutoInspeccionSolicitud(request, solicitudId) {
      return proxySelfInspectionChannel.UpdateAutoinspeccion(solicitudId, request, true)
    }
    function deleteAutoInspeccionSolicitud(solicitudId) {
      return proxySelfInspectionChannel.DeleteSelfInspectionRequest(solicitudId, true)
    }
    function sentSolicitud(solicitudId) {
      return proxySelfInspectionChannel.SendCorreo(solicitudId, true)
    }
    function downloadSolicitud(solicitudId, type) {
      return proxySelfInspectionChannel.GetInforme(solicitudId, type, true)
    }
    // obs
    function addObservation(inspectionId, observation) {
      var request = {
        InspectionId: inspectionId,
        Observation: observation,
      };
      return proxyInspection.AddObservationInInspectionImage(request, true);
    }

    function getObservations(inspectionId) {
      return proxyInspection.GetObservationsInInspectionImage(inspectionId, true);
    }

    function resolveObservation(riskId, inspectionId) {
      return proxyInspection.ResolveObservation(riskId, inspectionId, true);
    }

    function _setHomeMenu(data) {
      LOCAL_STORE[KEY_HOME_MENU] = angular.toJson(data);
    }

    function _getHomeMenu(oimClaims, accessMenu) {
      var homeMenu = angular.fromJson(LOCAL_STORE[KEY_HOME_MENU]) || [],
          loginType = constants.typeLogin,
          deferred = $q.defer();

      function _createMenu(menuData, isBrokerOrProvider) {
        isBrokerOrProvider = isBrokerOrProvider || false;
        var menu = (isBrokerOrProvider)
                    ? menuData
                    : new jinqJs()
                      .from(menuData)
                        .where(function(row) {
                          return row.knownApp && row.knownApp.groupApps;
                        })
                      .join(system.apps.inspec.apps)
                        .on(function(menu, menuInspec) {
                          return menu.knownApp.code === menuInspec.code;
                        })
                      .select(function(elem) {
                        return elem.knownApp;
                      });
        _setHomeMenu(menu);

        return menu;
      }

      if (!homeMenu.length) {

        if ((oimClaims.userType === loginType.broker.type.toString() &&
              oimClaims.userSubType === loginType.broker.subType.toString())
            || (oimClaims.userType === loginType.proveedor.type.toString() &&
                oimClaims.userSubType === loginType.proveedor.subType.toString())) {

          proxyMenu.GetSubMenu(accessMenu[0].codigo, true).then(function(response) {
            if (angular.isArray(response.data) && response.data.length > 0) {
              var appSubMenu = _.find(response.data, function(item) {
                return item.nombreCabecera && item.nombreCabecera.toUpperCase() === 'APLICACIONES'
              });
              if (appSubMenu) {
                var items = appSubMenu.items.reduce(function(previuos, menu) {
                  var knownApp = _.find(system.apps.inspec.apps, function(menuInspec) {
                    var vCodeObj = menuInspec.codeObj.dev.concat(menuInspec.codeObj.prod);
                    return _.contains(vCodeObj, menu.codigoObj);
                  });
                  if (knownApp) {
                    previuos.push(
                      {
                        code: knownApp.code,
                        name: menu.nombreLargo,
                        href: knownApp.location,
                        uiSref: knownApp.state || '',
                        icon: knownApp.icon,
                        iconMYD: knownApp.iconMYD,
                        description: knownApp.menuName,
                        groupApps: true
                      }
                    );
                  }

                  return previuos;
                }, []);
                homeMenu = _createMenu(items, true);
              }
            }
            deferred.resolve(homeMenu);
          }).catch(function(error) {
            deferred.reject(error.statusText);
          });

        } else {
          homeMenu = _createMenu(accessMenu);
          deferred.resolve(homeMenu);
        }

      } else {

        deferred.resolve(homeMenu);

      }

      return deferred.promise;
    }
    

    function _getSubMenu() {
      return angular.fromJson(LOCAL_STORE['evoSubMenuINSPEC']);
    }

    function _isAuthorizedSubMenu(toState, toParams) {
      var vSubMenu = _getSubMenu();

      function _authorized(subMenu, toState) {
        if(subMenu.length === 0) {
          return false;
        }
        
        var vInspecSecurity = toState.inspecSecurity;
        if (vInspecSecurity
          && Object.keys(vInspecSecurity).length
          && (vInspecSecurity.headerName || Object.keys(vInspecSecurity.codeObj).length)) {

          var vAuthorized;

          if (vInspecSecurity.headerName) {
            vAuthorized = _.find(subMenu, function(elem, key){
              return (!(elem.items && elem.items.length))
                      ? elem.nombreCabecera === vInspecSecurity.headerName
                      : false;
            });
          } else {
            vInspecSecurity.codeObj = vInspecSecurity.codeObj || {};
            vAuthorized = _.find(subMenu, function(elem, key){
              if (elem.items && elem.items.length) {
                return !!_.find(elem.items, function(item, key){
                  var vCodeObj = vInspecSecurity.codeObj.dev.concat(vInspecSecurity.codeObj.prod);
                  return (vCodeObj)
                            ? angular.isArray(vCodeObj)
                              ? vCodeObj.indexOf(item.codigoObj) > -1
                              : item.codigoObj == vCodeObj
                            : true;
                });
              } else {
                return false;
              }
            });
          }
          return !!vAuthorized;
        } else {
          return true;
        }
      }

        return _authorized(vSubMenu, toState);
    }
    
  }

  return ng.module('appInspec.factory', ['oim.proxyService.inspec']).factory('inspecFactory', inspecFactory);
});
