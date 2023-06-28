'use strict'
define([
  'angular', 'constants'
], function(angular, constants) {

  var appCgw = angular.module('appCgw');

  appCgw.factory('solicitudCgwFactory', ['proxyCgwSecurity', 'proxyGeneral', 'proxyClinic', 'proxyAffiliate', 'proxyDiagnostic', 'proxyDoctor', 'proxyMedicalCare', 'proxyCopay', 'proxyUITInfo', '$window',
    function(proxyCgwSecurity, proxyGeneral, proxyClinic, proxyAffiliate, proxyDiagnostic, proxyDoctor, proxyMedicalCare, proxyCopay, proxyUITInfo, $window) {

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
	    fecha.setMonth(fecha.getMonth() + meses)

	    if (fecha.getMonth() !== ((currentMonth + meses) % 12)) {
	        fecha.setDate(0);
	    }
	    return fecha;
    }

    function agregarDias(fecha, meses) {
      var dias = 29;
      var newdate = fecha;

      if (meses === 2) {dias=59;}

      newdate.setDate(newdate.getDate() + dias);
      var dd = newdate.getDate();
      var mm = newdate.getMonth() + 1;

      if (dd<10) {
        dd='0'+dd;
      }
      if (mm<10) {
        mm='0'+mm;
      }

      var y = newdate.getFullYear();

      var someFormattedDate = dd + '/' + mm + '/' + y;

      return someFormattedDate;
    }

    function getListBranchClinicByRuc(params, showSpin) {
      return proxyClinic.Resource_Clinic_Get_ListBranchClinicByRuc(params, showSpin);
    }

    function getListClinic(params, showSpin) {
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

    function getValueUITMinsa(params, showSpin){
      return proxyUITInfo.GetUitValue(params, showSpin);
    }
    
    function GetListComplaints (request) {
      return proxyAffiliate.Resource_Affiliate_GetListComplaints(request, true);
    }

    // Obtener flag que indique si cuenta con activacion oncologica
    function GetOncologyActivation(id, showSpin) {
      return proxyAffiliate.Resource_Affiliate_Get_OncologyActivation(id, showSpin);
    }

    function ConsultarClienteImportante(params){
      return proxyAffiliate.Resource_Affiliate_ConsultImportantCustomer(params, false);
    }

    return {
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
      getValueUITMinsa: getValueUITMinsa,
      GetListComplaints: GetListComplaints,
      // Obtener flag que indique si cuenta con activacion oncologica
      GetOncologyActivation: GetOncologyActivation,
      ConsultarClienteImportante: ConsultarClienteImportante
    };
  }]);

  appCgw.service('fileUploadNew', ['$http', '$q', 'mpSpin', function ($http, $q, mpSpin) {
    this.solicitarCartaURL = function(file, paramsCarta, fileTypes) {
      var deferred = $q.defer();
      var fd = new FormData();
      var carta = {
        GuaranteeLetter: paramsCarta.GuaranteeLetter,
        Budgets: paramsCarta.Budgets,
        AttachFiles: []
      };

      fd.append("request", JSON.stringify(carta));

      if (file !== null) {
        for(var i=0; i<file.length; i++) {
          fd.append(fileTypes[i], file[i]);
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

});
