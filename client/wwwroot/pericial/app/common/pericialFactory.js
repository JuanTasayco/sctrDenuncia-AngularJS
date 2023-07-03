'use strict';

define(['angular', 'lodash', 'constants', 'constantsPericial', 'fileSaver'], function(
  ng,
  _,
  constants,
  constantsPericial,
  fileSaver
) {
  pericialFactory.$inject = [
    '$state',
    'proxyDashboard',
    'proxySecurity',
    'proxyBudget',
    'proxySinister',
    'proxyDamage',
    'proxyParameter',
    'proxyAutomovil',
    'proxyAttachFile',
    'proxyTron',
    'proxyMovement',
    'proxyReport',
    '$timeout',
    '$q',
    '$http',
    '$log',
    'mpSpin',
    '$window'
  ];

  function pericialFactory(
    $state,
    proxyDashboard,
    proxySecurity,
    proxyBudget,
    proxySinister,
    proxyDamage,
    proxyParameter,
    proxyAutomovil,
    proxyAttachFile,
    proxyTron,
    proxyMovement,
    proxyReport,
    $timeout,
    $q,
    $http,
    $log,
    mpSpin,
    $window
  ) {
    var factory = {
      dashboard: {
        Resource_Dashboard_WorkshopIndicator: Resource_Dashboard_WorkshopIndicator,
        Resource_Dashboard_ProficientIndicator: Resource_Dashboard_ProficientIndicator,
        Resource_Dashboard_Supervisor: Resource_Dashboard_Supervisor,
        Resource_Dashboard_Proficient: Resource_Dashboard_Proficient,
        Resource_Dashboard_Workshop: Resource_Dashboard_Workshop
      },
      general: {
        monitor: monitor,
        stateGo: stateGo,
        goTo: goToItem,
        goToItemVersion: goToItemVersion,
        GetListParameterDetail: GetListParameterDetail,
        getTipoVehiculo: getTipoVehiculo,
        GetListSubModelo: GetListSubModelo,
        GetListAnoFabricacion: GetListAnoFabricacion,
        Resource_Parameter_Detail_Register_Type_List: Resource_Parameter_Detail_Register_Type_List,
        Resource_Tron_Proficien_List: Resource_Tron_Proficien_List,
        Resource_Parameter_Detail_Order_By_List: Resource_Parameter_Detail_Order_By_List,
        formatearFecha: formatearFecha,
        getShowHT: getShowHT,
        getData: getData,
        postData: postData,
        Resource_State_Executive_Get_List: Resource_State_Executive_Get_List,
        Resource_Sinister_Upd: Resource_Sinister_Upd
      },
      budget: {
        GetListStates: GetListStates,
        GetListProficientType: GetListProficientType,
        GetListType: GetListType
      },
      siniester: {
        Resource_AttachFile_Get_List_State: Resource_AttachFile_Get_List_State,
        Resource_Sinister_Add: Resource_Sinister_Add,
        GetSinister: GetSinister,
        GetListSinister: GetListSinister,
        Resource_Sinister_Workshop_SaveBudget: Resource_Sinister_Workshop_SaveBudget,
        Resource_Sinister_Workshop_SaveTotalLoss: Resource_Sinister_Workshop_SaveTotalLoss,
        Resource_Sinister_Extension_Get_List: Resource_Sinister_Extension_Get_List,
        SearchSinister: SearchSinister,
        Resource_Workorder_Get_List: Resource_Workorder_Get_List,
        Resource_Sinister_Workshop_SolveObservation: Resource_Sinister_Workshop_SolveObservation,
        SaveTracker: SaveTracker
      },
      damage: {
        GetListDamage: GetListDamage
      },
      attach: {
        GetImage: GetImage,
        deleteFile: deleteFile
      },
      comment: {
        GetListMovement: GetListMovement,
        AddMovement: AddMovement
      },
      workshop: {
        Resource_Security_GetWorkshop: Resource_Security_GetWorkshop,
        Resource_Sinister_Workshop_Save_InRepair: Resource_Sinister_Workshop_Save_InRepair,
        Resource_Sinister_Workshop_SaveReadyForDelivery: Resource_Sinister_Workshop_SaveReadyForDelivery,
        Resource_Sinister_Workshop_SaveDeliveredUpdate: Resource_Sinister_Workshop_SaveDeliveredUpdate,
        Resource_Sinister_Workshop_SaveDelivered: Resource_Sinister_Workshop_SaveDelivered,
        Resource_Sinister_Workshop_GenerateExtension: Resource_Sinister_Workshop_GenerateExtension,
        Resource_Sinister_Workshop_SaveDeliveredRegularizeSpare: Resource_Sinister_Workshop_SaveDeliveredRegularizeSpare
      },
      proficient: {
        getTipoPerito: getTipoPerito,
        Resource_Sinister_Proficient_Assign: Resource_Sinister_Proficient_Assign,
        Resource_Sinister_Proficient_Reassign: Resource_Sinister_Proficient_Reassign,
        Resource_Sinister_Proficient_RequestInformation: Resource_Sinister_Proficient_RequestInformation,
        Resource_Sinister_Proficient_Save_Finish: Resource_Sinister_Proficient_Save_Finish,
        Resource_Sinister_Proficient_Save_TotalLoss: Resource_Sinister_Proficient_Save_TotalLoss
      },
      supervisor: {
        Resource_Sinister_Supervisor_ValidateTotalLoss: Resource_Sinister_Supervisor_ValidateTotalLoss
      },
      webproc: {
        GetVersion: GetVersion,
        DownloadVersion: DownloadVersion
      },
      inspec: {
        getFileInspec: getFileInspec
      },
      security: {
        Resource_Security_GetRole: Resource_Security_GetRole,
        Resource_Security_GetTicketUser: Resource_Security_GetTicketUser
      },
      report: {
        Resource_Download_Sinister_Report: Resource_Download_Sinister_Report
      }
    };

    return ng.extend({}, factory);

    function monitor(getData, $scop) {
      var $sc = $scop;
      var fnGetData = getData;
      var abort = false;
      var defer = {
        promise: {
          then: function(s, e, t) {
            this.success = s;
            this.error = e;
            this.try = t;
          }
        },
        resolve: function(response) {
          this.promise.success(response);
        },
        reject: function(response) {
          this.promise.error(response);
        }
      };

      function action() {
        if (!abort) {
          var _p = getData();
          _p.then(function(resp) {
              if (!abort) {
                defer.resolve(resp);
                _again();
              }
            },
            function(resp) {
              if (!abort) {
                defer.reject(resp);
                _again();
              }
            });
        }
      }

      function _begin() {
        action();
        abort = false;
        return defer.promise;
      }

      function _again() {
        if (!abort)
          $timeout(function() {
            action();
          }, 60000);//1 min y reload
      }

      function _stop() {
        abort = true;
      }

      $sc.$on('$destroy', function() {
        _stop();
      });
      this.stop = _stop;
      this.begin = _begin;
      return this;
    }

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
        return today = dd+'/'+mm+'/'+yyyy;
      }
    }

    function stateGo(url) {
      $state.go(url, {reload: true, inherit: false});
    }

    function goToItem(url, item, tab) {
      if(item.idSinisterDetail) {
        $state.go(url, {
          id: item.idSinisterDetail,
          version: (item.version) ? item.version : 1,
          tab: tab
        }, {reload: true, inherit: false});

        // var linkTo = $state.href(url, {
        //   id: item.idSinisterDetail,
        //   version: (item.version) ? item.version : 1,
        //   tab: tab
        // }, {reload: true, inherit: false});
        // $window.open(linkTo,'_blank');
      }
    }

    function goToItemVersion(url, item, tab, version) {
      if(item.idSinisterDetail) {
        $state.go(url, {
          id: item.idSinisterDetail,
          version: (version) ? version : 1,
          tab: tab
        }, {reload: true, inherit: false});

        // var linkTo = $state.href(url, {
        //   id: item.idSinisterDetail,
        //   version: (item.version) ? item.version : 1,
        //   tab: tab
        // }, {reload: true, inherit: false});
        // $window.open(linkTo,'_blank');
      }
    }

    function Resource_Dashboard_WorkshopIndicator(params){
      return proxyDashboard.Resource_Dashboard_WorkshopIndicator(params, false);
    }

    function Resource_Dashboard_ProficientIndicator(params){
      return proxyDashboard.Resource_Dashboard_ProficientIndicator(params, false);
    }

    function Resource_Dashboard_Supervisor(params) {
      return proxyDashboard.Resource_Dashboard_Supervisor(params, false);
    }

    function Resource_Dashboard_Proficient(params) {
      return proxyDashboard.Resource_Dashboard_Proficient(params, false);
    }

    function Resource_Dashboard_Workshop(params) {
      return proxyDashboard.Resource_Dashboard_Workshop(params, false);
    }

    function Resource_AttachFile_Get_List_State(params){
      return proxySinister.Resource_State_Get_List(false);
    }

    function GetListStates(params){
      return proxyBudget.Resource_State_Get_List(false);
    }

    function GetListDamage(params) {
      return proxyDamage.Resource_Damage_List(false);
    }

    function GetListProficientType(params) {
      return proxyBudget.Resource_Proficient_Type_List(false);
    }

    function GetListType(params) {
      return proxyBudget.Resource_Budget_Type_List(false);
    }

    function Resource_Sinister_Add(params) {
      return proxySinister.Resource_Sinister_Add(params, true)
    }

    function GetSinister(params) {
      return proxySinister.Resource_Sinister_Get(params, true);
    }

    function GetListParameterDetail() {
      return proxyParameter.Resource_Parameter_Detail_Unsured_List(false);
    }

    function getTipoVehiculo() {
      return proxyAutomovil.GetListTipoVehiculo(constants.module.polizas.autos.companyCode, false);
    }

    function GetListSubModelo(tipoVehiculo, codigoMarca, codigoModelo) {
      return proxyAutomovil.GetListSubModelo(constants.module.polizas.autos.companyCode, tipoVehiculo, codigoMarca, codigoModelo, false)
    }

    function GetListAnoFabricacion(codMar, codMod, codSub) {
      return proxyAutomovil.GetListAnoFabricacion(codMar, codMod, codSub, false)
    }

    function Resource_Parameter_Detail_Register_Type_List() {
      return proxyParameter.Resource_Parameter_Detail_Register_Type_List(false);
    }

    function GetImage(idAttachFile, idPhototype) {
      return proxyAttachFile.Resource_Image_Get(idAttachFile, idPhototype, true);
    }

    function deleteFile(idAttachFile, idSniesterDetail) {
      return proxyAttachFile.Resource_Image_Delete(idAttachFile, idSniesterDetail, false);
    }

    function Resource_Tron_Proficien_List() {
      return proxyTron.Resource_Tron_Proficien_List(false);
    }

    function Resource_Parameter_Detail_Order_By_List() {
      return proxyParameter.Resource_Parameter_Detail_Order_By_List(false);
    }

    function GetListSinister(params) {
      return proxySinister.Resource_Sinister_Get_List(params, true);
    }

    function GetListMovement(idSinister) {
      return proxyMovement.Resource_Commentary_List(idSinister, false);
    }

    function AddMovement(params) {
      return proxyMovement.Resource_Movement_Add(params, true);
    }

    function Resource_Sinister_Workshop_SaveBudget(params) {
      return proxySinister.Resource_Sinister_Workshop_SaveBudget(params, true);
    }

    function Resource_Sinister_Workshop_SaveTotalLoss(params) {
      return proxySinister.Resource_Sinister_Workshop_SaveTotalLoss(params, true);
    }

    function Resource_Sinister_Proficient_Reassign(params) {
      return proxySinister.Resource_Sinister_Proficient_Reassign(params, true);
    }

    function Resource_Security_GetWorkshop() {
      var deffered = $q.defer();
      $http.get(constants.system.api.endpoints.gper + 'api/security/workshop').then(function(response) { //promise
        deffered.resolve(response.data);
      }, function(response, status){
        //do something
        return deffered.reject(response,status);
      });
      return deffered.promise;
    }

    function getTipoPerito() {
     // return proxySecurity.Resource_Security_GetProficient(false);

      var deffered = $q.defer();
      $http.get(constants.system.api.endpoints.gper + 'api/security/proficient').then(function(response) { //promise
        deffered.resolve(response.data);
      }, function(response, status){
        //do something
        return deffered.reject(response,status);
      });
      return deffered.promise;
    }

    function Resource_Sinister_Proficient_RequestInformation(params) {
      return proxySinister.Resource_Sinister_Proficient_RequestInformation(params, false);
    }

    function Resource_Sinister_Proficient_Assign(params) {
      return proxySinister.Resource_Sinister_Proficient_Assign(params, false);
    }

    function Resource_Sinister_Proficient_Save_Finish(params) {
      return proxySinister.Resource_Sinister_Proficient_Save_Finish(params, false);
    }

    function Resource_Sinister_Proficient_Save_TotalLoss(params) {
      return proxySinister.Resource_Sinister_Proficient_Save_TotalLoss(params, false);
    }

    function Resource_Sinister_Workshop_Save_InRepair(params) {
      return proxySinister.Resource_Sinister_Workshop_Save_InRepair(params, false);
    }

    function Resource_Sinister_Workshop_SaveReadyForDelivery(params) {
      return proxySinister.Resource_Sinister_Workshop_SaveReadyForDelivery(params, false);
    }

    function Resource_Sinister_Workshop_SaveDeliveredUpdate(params) {
      return proxySinister.Resource_Sinister_Workshop_SaveDeliveredUpdate(params, false);
    }

    function Resource_Sinister_Workshop_SaveDelivered(params) {
      return proxySinister.Resource_Sinister_Workshop_SaveDelivered(params, false);
    }

    function Resource_Sinister_Workshop_GenerateExtension(params) {
      return proxySinister.Resource_Sinister_Workshop_GenerateExtension(params, false);
    }

    function Resource_Sinister_Workshop_SaveDeliveredRegularizeSpare(params) {
      return proxySinister.Resource_Sinister_Workshop_SaveDeliveredRegularizeSpare(params, false);
    }

    function Resource_Sinister_Supervisor_ValidateTotalLoss(params) {
      return proxySinister.Resource_Sinister_Supervisor_ValidateTotalLoss(params, false);
    }

    function Resource_Sinister_Extension_Get_List(params) {
      return proxySinister.Resource_Sinister_Extension_Get_List(params, false);
    }

    function SearchSinister(idTypeInsured, numberCase, plateNumber){
      proxySinister.Resource_Sinister_Search(idTypeInsured, numberCase, plateNumber, true);
    }

    function SaveTracker(params) {
      return proxySinister.Resource_Sinister_Save_Tracker(params, true)
    }

    function Resource_Workorder_Get_List(sinisterNumber, recordNumber, idWorkshop) {
      //proxySinister.Resource_Workorder_Get_List(sinisterNumber, recordNumber, idWorkshop, false);

      var deffered = $q.defer();
      $http.get(constants.system.api.endpoints.gper + 'api/sinister/workdorder/'+sinisterNumber+'/'+ recordNumber+'/'+idWorkshop).then(function(response) { //promise
        deffered.resolve(response.data);
      }, function(response, status){
        //do something
        return deffered.reject(response,status);
      });
      return deffered.promise;
    }

    function Resource_Sinister_Workshop_SolveObservation(params) {
      return proxySinister.Resource_Sinister_Workshop_SolveObservation(params, false);
    }

    function Resource_Security_GetTicketUser() {
      return postData('api/security/ticket', '')
    }

    function Resource_Security_GetRole() {
      return postData('api/security/role', '');
    }

    function DownloadVersion(query, caseNumber) {
      return _downloableReport(query, {
        nomenclatura: caseNumber + '_',
        ext: 'pdf'
      });
    }

    function _downloableReport(wpPath, opts) {
      var deferred = $q.defer();
      mpSpin.start();
      $http
        .get(constants.system.api.endpoints.webproc + wpPath, {
          responseType: 'arraybuffer'
        })
        .success(
          function(data, status, headers) {
            var type = headers('Content-Type');
            var disposition = headers('Content-Disposition');
            var FileName = '';
            if (disposition) {
              var match = disposition.match(/.*filename="?([^;"]+)"?.*/);
              if (match[1]) FileName = match[1];
            }
            FileName =
              FileName.replace(/[<>:"/\\|?*]+/g, '_') ||
              opts.nomenclatura + new Date().toLocaleTimeString() + '.' + opts.ext;
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

    function GetVersion(caseNumber, sinisterNumber) {
      var deffered = $q.defer();
      $http.get(constants.system.api.endpoints.webproc + 'api/Siniestro/versions/'+caseNumber+'?sinisterNumber=' + sinisterNumber).then(function(response) { //promise
        deffered.resolve(response);
      }, function(response, status){
        //do something
        return deffered.reject(response,status);
      });
      return deffered.promise;
    }

    function getFileInspec(riskNumber, inspectionNumber) {
      var deffered = $q.defer();
      $http.get(constants.system.api.endpoints.inspec + 'api/report/resume/'+riskNumber+'/' + inspectionNumber).then(function(response) { //promise
        deffered.resolve(response);
      }, function(response, status){
        //do something
        return deffered.reject(response,status);
      });
      return deffered.promise;
    }

    function getData(url, params){
      var newUrl = url + params;
      var deferred = $q.defer();
      $http({
        method : 'GET',
        url : constants.system.api.endpoints.gper + newUrl,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then( function(response) {
          deferred.resolve(response.data);
        }, function (response) {
          deferred.reject(response);
        }
      );
      return deferred.promise;
    }

    function postData(url, params) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: constants.system.api.endpoints.gper + url,
        data: params,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(response) {
        deferred.resolve(response.data);
      });
      return deferred.promise;
    }

    function getShowHT(info) {
      if (info) {
        var today = Date.now();
        var minutes = 1000 * 60;
        var hours = minutes * 60;
        var days = hours * 24;
        var showHT = '';
        var dataComentario = info;//JSON.parse(info);
        var hmDays = Math.trunc( (today - Date.parse(dataComentario.dateRegistry)) / days );
        var hmHours = Math.trunc( (today - Date.parse(dataComentario.dateRegistry)) / hours );
        var hmMinutes = Math.trunc( (today - Date.parse(dataComentario.dateRegistry)) / minutes );

        if ( !hmDays ) {
          showHT = hmHours ? ( (hmHours < 2) ? hmHours + ' hora' : hmHours + ' horas' ) : ( showHT = hmMinutes + ' minutos' );
        } else {
          showHT = hmDays + ' días';
        }
        return showHT;
      }
    }

    function Resource_Download_Sinister_Report(params) {
      return proxyReport.Resource_Download_Sinister_Report(params, true);
    }

    function Resource_Sinister_Upd(params) {
      return proxySinister.Resource_Sinister_Upd(params, true)
    }

    function Resource_State_Executive_Get_List() {
      var deffered = $q.defer();
      $http.get(constants.system.api.endpoints.gper + 'api/sinister/states/executive').then(function(response) { //promise
        deffered.resolve(response);
      }, function(response, status){
        //do something
        return deffered.reject(response,status);
      });
      return deffered.promise;
    }

  } // end factory

  return ng.module('appPericial', ['oim.proxyService.gper'])
    .factory('pericialFactory', pericialFactory)
    .service('fileUpload', ['$http', '$q', 'mpSpin', function ($http, $q, mpSpin) {
      this.solicitarCartaURL = function(file, paramsCarta){
        var deferred = $q.defer();
        var fd = new FormData();
        var carta = {
          GuaranteeLetter: paramsCarta.GuaranteeLetter,
          Budgets: paramsCarta.Budgets,
          AttachFiles: []
        };

        fd.append("request", JSON.stringify(carta));

        if(file===null) {
          // fd.append("fieldNameHere", null);
        }else{
          for(var i=0; i<file.length; i++){
            fd.append("fieldNameHere", file[i]);
          }
        }

        $http.post(constants.system.api.endpoints.cgw+ 'api/guaranteeletter/save', fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined},
          eventHandlers: {
            progress: function(c) {
              console.log('Progress -> ' + c);
              console.log(c);
            }
          },
          uploadEventHandlers: {
            progress: function(e) {
              mpSpin.start();
              console.log('UploadProgress -> ' + e);
              console.log(e);
              console.log('loaded: ' + e);
              console.log('total: ' + e);
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
});
