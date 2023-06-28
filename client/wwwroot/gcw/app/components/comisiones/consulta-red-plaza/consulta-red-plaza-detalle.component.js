define(['angular', 'lodash'], function(ng, _) {

  ConsultaRedPlazaDetalleController.$inject = [
    '$state'
    , '$rootScope'
    , '$window'
    , 'gcwFactory'
    , 'ErrorHandlerService'
    , '$timeout'
    , '$stateParams'
    , 'mModalAlert'];

  function ConsultaRedPlazaDetalleController(
    $state
    , $rootScope
    , $window
    , gcwFactory
    , ErrorHandlerService
    , $timeout
    , $stateParams
    , mModalAlert) {

    var vm = this;

    vm.$onInit = function() {

      $rootScope.currentURL = $state.current.url;
      $rootScope.$broadcast('comprobanteRemitido');
      $rootScope.$broadcast('dashboard');
      $rootScope.$broadcast('msgSinResultados');

      $rootScope.step1 = true;
      $rootScope.step2 = false;
      vm.roleUser = gcwFactory.getRoleUser();
      $rootScope.netWorkVisitDetails = true;

      vm.fnSetItemsPerPage = _fnSetItemsPerPage;
      vm.cabecera = $rootScope.cabecera;
      vm.searchDetailsNetwork = searchDetailsNetwork;
      vm.fnClear = _fnClear;
      $rootScope.reloadAgent = false;

      if(vm.roleUser){
        vm.profile = JSON.parse($window.localStorage.getItem('profile'));
        vm.cabecera.agente = {
          id: vm.profile.codagent
        }
        var filter = gcwFactory.getVariableSession('sessionAgente');
      }else var filter = gcwFactory.getVariableSession('rolSessionA');
      if (!ng.isUndefined(filter)) {
        vm.infoAgent = {
          idName: filter.idFullName
          , id: filter.id
          , office: filter.officeName
          , contractDate: filter.contractDate
          , name: filter.fullName
        };
      }

      vm.verDetalle = verDetalle;
      vm.volver = volver;
      vm.currentPage = 1;
      vm.itemsPerPage = 5;
      vm.class5 = 'gCGreen2 fwBold';

      $timeout(function() {
        if(!ng.isUndefined($stateParams.month) && !ng.isUndefined($stateParams.year)) {
          searchDetailsNetwork(true);
        }
      }, 1000);

      loadIntegralidad();
      loadTipoPoliza();
      loadVencPoliza();
      loadTMorosidad();

    }; //end onInit

    vm.pageChanged = function(event) {
      vm.currentPage = event;
      if(!ng.isUndefined($stateParams.month) && !ng.isUndefined($stateParams.year)) {
        searchDetailsNetwork(false);
      }
    };

    function _fnClear(){
      vm.mIntegralidad = null;
      vm.mTipoPoliza = null;
      vm.mVencimientoPoliza = null;
      vm.mTiempoMorosidad = null;
      searchDetailsNetwork(true);
    }

    vm.fnSetItemsPerPage = _fnSetItemsPerPage;
    function _fnSetItemsPerPage(num) {
      vm.itemsPerPage = num;
      vm.currentPage = 1; // reset to first page
      vm.class = 'gCGreen2 fwBold';
      switch (num) {
        case 25:
          vm.class25 = vm.class;
          vm.class5 = '';
          vm.class50 = '';
          break;
        case 50:
          vm.class50 = vm.class;
          vm.class25 = '';
          vm.class5 = '';
          break;
        default:
          vm.class5 = vm.class;
          vm.class25 = '';
          vm.class50 = '';
          break;
      }
      if(!ng.isUndefined($stateParams.month) && !ng.isUndefined($stateParams.year)) {
        searchDetailsNetwork(true);
      }
    }

    function searchDetailsNetwork(val){
      vm.currentPage = val ? 1 : vm.currentPage
      vm.params = {
        Month: parseInt($stateParams.month)
        , Year: parseInt($stateParams.year)
        , AgentId : vm.infoAgent.id
        , RowByPage: vm.itemsPerPage
        , OrderBy: 1
        , CurrentPage: vm.currentPage
        , Integrality: !vm.mIntegralidad ? "" : vm.mIntegralidad.id
        , ExpirationFilter: !vm.mVencimientoPoliza ? "" : vm.mVencimientoPoliza.id
        , DelinquencyFilter: !vm.mTiempoMorosidad ? "" : vm.mTiempoMorosidad.id
        , PolicyType: !vm.mTipoPoliza ? "" : vm.mTipoPoliza.id
      };
      var pms = gcwFactory.getListNetworkAgentClient(vm.params);
      pms.then(function(response) {
        vm.totalRows = response.data.totalRows;
        vm.totalPages = response.data.totalPages;
        vm.clientes = []
        if(response.operationCode === 200){
          var dataList = response.data.list;
          var i = ((vm.itemsPerPage*vm.currentPage)-(vm.itemsPerPage-1));
          ng.forEach(dataList, function(item){
            var client = {
              id: i++
              , tipoDoc: item.documentType
              , numDoc: item.documentNumber
              , nombre: item.fullName
              , integridad: item.integrality
              , polizas: []
              , phoneNumber: item.phoneNumber
              , address: item.address
              , email: item.email
            };
            if (item.carPolicy) {
              client.polizas.push({
                icon: "ico-mapfre_104_auto_front"
                , nombre: "Vehicular"
                , vencimiento: item.expirationDateCarPolicy ? item.expirationDateCarPolicy : ''
                , morosidad: item.delinquencyTimeCarPolicy ? item.delinquencyTimeCarPolicy : ''
              });
            }

            if (item.homePolicy) {
              client.polizas.push({
                icon: "ico-mapfre_216_hogar"
                , nombre: "Hogar"
                , vencimiento: item.expirationDateHomePolicy ? item.expirationDateHomePolicy : ''
                , morosidad: item.delinquencyTimeHomePolicy ? item.delinquencyTimeHomePolicy : ''
              });
            }

            if (item.healthPolicy) {
              client.polizas.push( {
                icon: "ico-mapfre_219_salud"
                , nombre: "Salud"
                , vencimiento: item.expirationDateHealthPolicy ? item.expirationDateHealthPolicy : ''
                , morosidad: item.delinquencyTimeHealthPolicy ? item.delinquencyTimeHealthPolicy : ''
              });
            }

            if (item.lifePolicy) {
              client.polizas.push( {
                icon: "ico-mapfre_218_vida"
                , nombre: "Vida"
                , vencimiento: item.expirationDateLifePolicy ? item.expirationDateLifePolicy : ''
                , morosidad: item.delinquencyTimeLifePolicy ? item.delinquencyTimeLifePolicy : ''
              });
            }
            vm.clientes.push(client);
          });
          gcwFactory.addVariableSession('dataSessionAgentClient', vm.clientes);
          $rootScope.step2 = true;
        } else {
          mModalAlert.showWarning(response.data.message, response.message)}
      })
      .catch(function(err) {
        ErrorHandlerService.handleError(err)
      });
    }

    function verDetalle(item) {
      $state.go('consulta.consultaRedplazaDetalleCliente', {'month':vm.params.Month, 'year':vm.params.Year, 'typeDoc':item.tipoDoc, 'numDoc':item.numDoc, 'id': vm.cabecera.agente.id});
    }

    function volver() {
      if(constants.environment === "PROD") $state.go('consulta.1481');
      else $state.go('consulta.1807')
    }

    function loadIntegralidad() {
       gcwFactory
        .filterintegrality()
        .then(function (res) {
          vm.integralidadArray = res.data;
        })
        .catch(function (err) {
          vm.integralidadArray = [];
          $log.error('Fallo en el servidor', err);
        });
    }

    function loadTipoPoliza() {
       gcwFactory
        .filterpolictytype()
        .then(function (res) {
          vm.tPolizaArray = res.data;
        })
        .catch(function (err) {
          vm.tPolizaArray = [];
          console.error('Fallo en el servidor', err);
        });
    }

    function loadVencPoliza() {
       gcwFactory
        .filterexpirationpolicy()
        .then(function (res) {
          vm.vencPolizaArray = res.data;
        })
        .catch(function (err) {
          vm.vencPolizaArray= [];
          console.error('Fallo en el servidor', err);
        });
    }

    function loadTMorosidad() {
       gcwFactory
        .filterdelinquency()
        .then(function (res) {
          vm.tMorosidadArray = res.data;
        })
        .catch(function (err) {
          vm.tMorosidadArray = [];
          console.error('Fallo en el servidor', err);
        });
    }

    vm.downloadAllRedPlaza = function() {
      vm.paramsFile = {
        Month: vm.params.Month,
        Year: vm.params.Year,
        AgentId: vm.params.AgentId,
        RowByPage: vm.params.RowByPage,
        CurrentPage: vm.params.CurrentPage,
        DelinquencyFilter: vm.mTiempoMorosidad.id && vm.mTiempoMorosidad.id  || '',
        ExpirationFilter: vm.mVencimientoPoliza.id && vm.mVencimientoPoliza.id || '',
        PolicyType: vm.mTipoPoliza.id && vm.mTipoPoliza.id || '',
        Integrality: vm.mIntegralidad.id && vm.mIntegralidad.id || ''
      };

      gcwFactory
        .getListAgentClientDetailDownload('api/networkagent/agentclient/download', vm.paramsFile,
          {
            fileName: 'detalleRedPlaza.xls'
          }
        );
    };

    vm.downloadDetail = function(cliente) {
      vm.paramsFile = {
        Month: vm.params.Month,
        Year: vm.params.Year,
        AgentId: vm.params.AgentId,
        DocumentNumber: cliente.numDoc,
        DocumentType: cliente.tipoDoc,
        RowByPage: vm.params.RowByPage,
        CurrentPage: vm.params.CurrentPage,
        OrderBy: vm.params.OrderBy
      };

      gcwFactory
        .getListAgentClientDetailDownload('api/networkagent/agentclientdetail/download', vm.paramsFile,
          {
            fileName: 'detalleRedPlaza_' + cliente.numDoc + '.xls'
          }
        );
    };

  } // end controller

  return ng.module('appGcw')
    .controller('ConsultaRedPlazaDetalleController', ConsultaRedPlazaDetalleController)
    .component('gcwConsultaRedPlazaDetalle', {
      templateUrl: '/gcw/app/components/comisiones/consulta-red-plaza/consulta-red-plaza-detalle.html',
      controller: 'ConsultaRedPlazaDetalleController',
      controllerAs: 'vm',
      bindings: {
      }
    });
});
