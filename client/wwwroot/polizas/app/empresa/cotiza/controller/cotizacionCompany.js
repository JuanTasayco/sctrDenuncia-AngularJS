(function($root, deps, action) {
    define(deps, action)
})(this, ['angular', 'constants', 'helper'], function(angular, constants, helper) {

    var appAutos = angular.module("appAutos");

    function mainWizarpBase($scope, fieldStoreName) {

      function eventHandler() {
          $scope.$on('$stateChangeSuccess', function(s, state, param, d) {
              $scope.currentStep = param.step;
          });

          $scope._steping = function(step) {
              var e = { cancel: false, step: step }

              $scope.$broadcast('changingStep', e);

              return !e.cancel;
          }
      }

      (function init() {
          fieldStoreName = fieldStoreName || 'data';
          if (!$scope[fieldStoreName])
              $scope[fieldStoreName] = { firstLoad: true };
          else
              $scope[fieldStoreName].firstLoad = false;
          $scope.currentStep = 1;

          eventHandler();
      })()

    }

    //appCompany.controller("cotizacionCompanyController", ['$scope', 'oimPrincipal', function cotizacionCompanyController($scope, oimPrincipal) {
    appAutos.controller("cotizacionCompanyController", [
      '$scope',
      'oimPrincipal',
      function cotizacionCompanyController(
        $scope,
        oimPrincipal
      ) {
        mainWizarpBase.call(this, $scope);
        var ag = oimPrincipal.getAgent()
        $scope.isAdmin = oimPrincipal.isAdmin();
        $scope.data.agent = {
            codigoNombre: $scope.isAdmin ? ag.codigoAgente + '-' + ag.codigoNombre : ag.codigoNombre,
            codigoAgente: ag.codigoAgente
        }

    }]).
    factory('companyData', [
      'proxyEmpresa',
      'proxyGeneral',
      'proxyTipoDocumento',
      'proxyClaims',
      '$q',
      '$parse',
      'accessSupplier',
      function(
        proxyEmpresa,
        proxyGeneral,
        proxyTipoDocumento,
        proxyClaims,
        $q,
        $parse,
        accessSupplier
      ){

        var data;

        function getData() {
          var deferred = $q.defer();
          var dataInfo = [
          {
            propName: 'profile',
            method: function() { return accessSupplier.GetProfile(); }
          },
          {
            propName: 'tiposEmpresa',
            method: function() { return proxyEmpresa.GetListTipoEmpresa(1); }
            //method: function() { return proxyEmpresa.GetTipoEmpresaV2(1); }
          },
          {
            propName: 'tiposMoneda',
            method: function() { return proxyGeneral.GetListTipoMoneda(); }
          },
          {
            propName: 'cantidadRiesgo',
            method: function() { return proxyEmpresa.GetListCantidadRiesgo(); }
          },
          {
            propName: 'estructuraRiesgo',
            method: function() { return proxyEmpresa.GetListEstructuraRiesgo(); }
          },
          {
            propName: 'tiposLocal',
            method: function() { return proxyEmpresa.GetListTipoLocal(1); }
          },
          {
            propName: 'categoriasConstruccion',
            method: function() { return proxyEmpresa.GetCategoriaConstruccion(); }
          },
          {
            propName: 'alarmasMonitoreo',
            method: function() { return proxyEmpresa.GetAlarmaMonitoreo(); }
          },
          {
            propName: 'tiposDocumento',
            method: function() { return proxyTipoDocumento.getTipoDocumento(); }
          },
          {
            propName: 'giroAltoRiesgoRobo',
            method: function() { return proxyGeneral.GetTable("", 'EMISA_GN_ALT_RI_RO', ""); }
          },
          {
            propName: 'giroAltoRiesgo',
            method: function() { return proxyGeneral.GetTable("", 'EMISA_GN_ALT_RI_IN', ""); }
          },
          {
            propName: 'limits.convention1.maxTotal',
            method: function() { return proxyGeneral.GetTable("", 'EMISA_MAX_TOT_DEC_CI', ""); }
          },
          {
            propName: 'limits.convention2.maxContenidoMaq',
            method: function() { return proxyGeneral.GetTable("", 'EMISA_MAX_VAL_CONT_CII', ""); }
          },
          {
            propName: 'limits.convention2.maxCajaChica',
            method: function() { return proxyGeneral.GetTable("", 'EMISA_MAX_LIM_CAJ_CHI_CII', ""); }
          },
          {
            propName: 'limits.convention2.msgCajaChica',
            method: function() { return proxyGeneral.GetTable("", 'EMISA_MSG_LIM_CAJ_CHI_CII', ""); }
          },
          {
            propName: 'limits.convention2.maxCajaFuerte',
            method: function() { return proxyGeneral.GetTable("", 'EMISA_MAX_LIM_CAJ_FUE_CII', ""); }
          },
          {
            propName: 'limits.convention2.msgCajaFuerte',
            method: function() { return proxyGeneral.GetTable("", 'EMISA_MSG_LIM_CAJ_FUE_CII', ""); }
          },
          {
            propName: 'limits.convention2.maxTransitoBancos',
            method: function() { return proxyGeneral.GetTable("", 'EMISA_MAX_LIM_TRAN_BCO_CII', ""); }
          },
          {
            propName: 'limits.convention2.msgTransitoBancos',
            method: function() { return proxyGeneral.GetTable("", 'EMISA_MSG_LIM_TRAN_BCO_CII', ""); }
          },
          {
            propName: 'limits.convention2.maxPoderCobradores',
            method: function() { return proxyGeneral.GetTable("", 'EMISA_MAX_LIM_POD_COB_CII', ""); }
          },
          {
            propName: 'limits.convention2.msgPoderCobradores',
            method: function() { return proxyGeneral.GetTable("", 'EMISA_MSG_LIM_POD_COB_CII', ""); }
          },
          {
            propName: 'limits.convention2.maxTotal',
            method: function() { return proxyGeneral.GetTable("", 'EMISA_MAX_TOT_DEC_CII', ""); }
          },
          {
            propName: 'limits.convention3.maxTotal',
            method: function() { return proxyGeneral.GetTable("", 'EMISA_MAX_SUM_ASEG_RESP_CIV_CIII', ""); }
          },
          {
            propName: 'limits.convention4.maxTotal',
            method: function() { return proxyGeneral.GetTable("", 'EMISA_MAX_SUM_ASEG_ROT_MAQ_CIV', ""); }
          },
          {
            propName: 'limits.convention5.maxUnicoEE',
            method: function() { return proxyGeneral.GetTable("", 'EMISA_MAX_SUM_ASEG_EQ_ELEC_CV', ""); }
          },
          {
            propName: 'limits.convention5.maxCovAdicional',
            method: function() { return proxyGeneral.GetTable("", 'EMISA_MAX_SUM_ASEG_EQ_MOV_CV', ""); }
          },
          {
            propName: 'limits.convention5.msgCovAdicional',
            method: function() { return proxyGeneral.GetTable("", 'EMISA_MSG_SUM_ASEG_EQ_MOV_CV', ""); }
          },
          {
            propName: 'limits.convention6.maxTotal',
            method: function() { return proxyGeneral.GetTable("", 'EMISA_MAX_SUM_ASEG_AAPP_CVI', ""); }
          },
          {
            propName: 'limits.convention7.maxTotal',
            method: function() { return proxyGeneral.GetTable("", 'EMISA_MAX_SUM_ASEG_DES_EMP_CVII', ""); }
          },
          {
            propName: 'limits.convention8.maxTotal',
            method: function() { return proxyGeneral.GetTable("", 'EMISA_MAX_SUM_ASEG_TREC_CVIII', ""); }
          },
          {
            propName: 'limits.convention9.maxTotal',
            method: function() { return proxyGeneral.GetTable("", 'EMISA_MAX_SUM_ASEG_CAR_CIX', ""); }
          },
          {
            propName: 'limits.convention10.maxTotal',
            method: function() { return proxyGeneral.GetTable("", 'EMISA_MAX_SUM_ASEG_EAR_CX', ""); }
          },
          {
            propName: 'limits.maxTotal',
            method: function() { return proxyGeneral.GetTable("", 'EMISA_MAX_SUM_ASEG_RIESGO', ""); }
          }
          ]
            try {
              var promises = (function(v) {
                angular.forEach(dataInfo, function(promise) {
                    v.push(promise.method());
                });
                return v;
              })([])
              $q.all(promises, { type: 'progress' })
                .then(function success(response) {
                  data = {}
                  angular.forEach(response, function(item, index) {

                    var _data = helper.clone(item, true)
                    _data = _data.data || _data
                    $parse(dataInfo[index].propName).assign(data, _data)

                  });

                  deferred.resolve(data);
                }, function error(response) {
                    //deferred.reject(response);
                }, function _finally(response) {

                });
              return deferred.promise;
            } catch (e) {
              console.log(e);
              throw e;
            }
        }
        return {
          get_Data: function() {
            //return {};
            if (data)
                return $q.resolve(data);
            return getData();
          }
        }

    }])

    .constant("Autocompletes", {
      agent: {
        label: 'Para cotizar una póliza debes elegir un agente',
        placeholder: 'Busque o seleccione un agente ...',
        matchField: 'codigoNombre'
      }
    });
});
