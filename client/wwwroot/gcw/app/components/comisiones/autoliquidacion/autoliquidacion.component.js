define([
  'angular', 'constants', 'lodash', 'gcwServicePoliza'
], function (ng, constants, _) {

  AutoliquidacionController.$inject = ['$scope', 'gcwFactory', 'mainServices', '$uibModal', 'mModalAlert', 'mModalConfirm', '$rootScope', '$sce', '$timeout', 'MxPaginador', '$state', 'gcwServicePoliza'];

  function AutoliquidacionController($scope, gcwFactory, mainServices, $uibModal, mModalAlert, mModalConfirm, $rootScope, $sce, $timeout, MxPaginador, $state, gcwServicePoliza) {
    // TODO: evaluar si hay que crear las direcitvas heightRow widthWindow de ganadas.js

    var vm = this;
    var page;

    vm.totalRows = 0;
    vm.totalPages = 0;
    vm.selfSettlementSelected;
    vm.selfSettlementPorTanda = [];
    vm.selfSettlement = [];
    vm.validationAgent;
    vm.sumSelfSettlement = 0;

    //tables
    vm.mCheckAllPE = false;
    vm.pageChanged = pageChanged;

    // Modals
    vm.settleCommissions = settleCommissions;
    vm.settleCommissionsSuccess = settleCommissionsSuccess;
    vm.settleCommissionsWarning = settleCommissionsWarning;
    vm.getSum = getSum;
    vm.formAutoliquidacion = {};
    vm.lstTipoMoneda = lstTipoMoneda;

    currencySelectedSimb = ''

    currencyType = {
      SOLES: {
        code: 1,
        description: "S/."
      },
      DOLARES: {
        code: 2,
        description: "$"
      },
      EUROS: {
        code: 3,
        description: "€"
      }
    },


      vm.$onInit = function () {
        lstTipoMoneda();
        lstCompanias();
        //tables
        vm.itemsXPagina = 10;
        vm.itemsXTanda = vm.itemsXPagina * 10;
        vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
        page = new MxPaginador();
        page.setNroItemsPorPagina(vm.itemsXPagina);

        $timeout(firstLoadAgent(), 1000);

      }// end onInit

    function lstTipoMoneda() {
      gcwFactory.getListTipoMonedaGlobal().then(function glpPr(req) {
        vm.lstTipoMoneda = req.data;
      });
    }

    function lstCompanias(){
      gcwServicePoliza.getListCompanias().then(
        function glpPr(req){
          vm.lstCompanias = req.Data;
        });
    }

    vm.search = search;
    vm.getAgent = getAgent;
    vm.clear = clear;

    function firstLoadAgent() {
      vm.rol = {};
      vm.rol.gestorID = 0;
      vm.rol.agenteID = 0;
      vm.header = $rootScope.cabecera;
    }

    function search() {
      if (!$scope.frmAutoliquidar.$valid) {
        $scope.frmAutoliquidar.markAsPristine();
        return;
      }
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
      vm.rol = getAgent();
      vm.typeUser = gcwFactory.getTypeUser();

      vm.params = {
        PageSize: vm.itemsXTanda,
        CurrencyCode: vm.formAutoliquidar.mTipoMoneda.value,
        companyCode: vm.formAutoliquidar.mCompania.Value,
        PageNumber: 1
      };

      vm.currencySelectedSimb = currencyTypeSymbol(vm.params.CurrencyCode)

      if (vm.typeUser == 3) {
        vm.params.ManagerId = vm.header.gestor.id
        if (vm.header.agente == null) {
          vm.params.agentCode = vm.rol.agenteID
          getDataSelfSettlement(vm.params);
        } else {
          if (vm.header.agente.id) {
            vm.params.agentCode = vm.header.agente.id
            getDataSelfSettlement(vm.params);
          }
          else
            mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Comisiones: Autoliquidación");
        }
      } else {
        if (vm.header && !ng.isUndefined(vm.dataTicket)) {
          if (!vm.rol.agenteID || vm.rol.agenteID == 0) {
            mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Comisiones: Autoliquidación");
          } else {
            vm.params.agentCode = vm.rol.agenteID
            vm.params.ManagerId = vm.rol.gestorID
            getDataSelfSettlement(vm.params);
          }
        }
      }
    }

    function getDataSelfSettlement(data) {
      var params = Object.assign({}, data, { PageSize: 1 })
      vm.selfSettlementPorTanda = [];
      vm.totalRows = 0;
      vm.totalPages = 0;
      mainServices.fnReturnSeveralPromise([
        gcwFactory.getListaAutoliquidacion(params, true),
        gcwFactory.getValidacion(params.agentCode, true)
      ], true).then(
        function (response) {
          if (response[0].data && response[0].data.totalRows > 0) {
            setListaAutoliquidacion(response[0]);
          } else {
            page.setNroTotalRegistros(vm.totalRows).setDataActual(vm.selfSettlementPorTanda).setConfiguracionTanda();
            setLstCurrentPage();
          }
          setValidation(response[1]);
        }
      )
    }

    function setValidation(validation) {
      vm.validationAgent = validation.data // authorized
    }

    function setListaAutoliquidacion(selfSettlement) {
      var arraySubscribe = []
      _.range(0, Math.ceil(selfSettlement.data.totalRows / vm.itemsXTanda)).forEach(function (element) {
        var params = Object.assign({}, vm.params, { PageNumber: element + 1 })
        arraySubscribe.push(gcwFactory.getListaAutoliquidacion(params, true))
      });
      vm.currentPage = 1
      page.setCurrentTanda(1);
      mainServices.fnReturnSeveralPromise(arraySubscribe, true).then(
        function (response) {
          response.forEach(function (element) {
            _.map(element.data.data, function (item) {
              var data = _.assign({}, item)
              if (item.comissionVal < 0) {
                data.selected = true;
                data.minor = true;
              }
              vm.selfSettlementPorTanda.push(data)
            })
          });
          vm.totalRows = selfSettlement.data.totalRows;
          vm.totalPages = Math.ceil(selfSettlement.data.totalRows / vm.itemsXTanda);
          page.setNroTotalRegistros(vm.totalRows).setDataActual(vm.selfSettlementPorTanda).setConfiguracionTanda();
          setLstCurrentPage();
          getSum()
        }
      )
    }

    function clear() {
      return;
    }

    function getAgent() {
      switch (vm.dataTicket.roleCode) {
        case "GESTOR-OIM":
          return {
            gestorID: vm.dataTicket.oimClaims.agentID,
            agenteID: (vm.header.agente == null) ? 0 : vm.header.agente.id,
            agenteFullName: (vm.header.agente == null) ? '' : vm.header.agente.fullName
          };
          break;
        case "DIRECTOR":
        case "GESTOR":
        case "ADM-COBRA":
        case "ADM-COMI":
        case "ADM-RENOV":
        case "ADM-SINIE":
        case "ADM-CART":

          return {
            gestorID: (ng.isUndefined(vm.header.gestor)) ? 0 : vm.header.gestor.id,
            agenteID: (vm.header.agente == null) ? 0 : vm.header.agente.id,
            agenteFullName: (vm.header.agente == null) ? 0 : vm.header.agente.fullName
          }
          break;
        default:
          return {
            gestorID: 0,
            agenteID: vm.dataTicket.oimClaims.agentID,
            agenteFullName: vm.dataTicket.oimClaims.agentName
          }
      }
    }


    function settleCommissions() {
      mModalConfirm.confirmInfo('¿Está seguro que desea liquidar estas comisiones?', 'AUTOLIQUIDACIÓN', 'LIQUIDAR').then(function () {
        var params = {
          agentCode: vm.params.agentCode,
          filter: vm.selfSettlementPorTanda.filter(function (o) { return o.selected; })
        }
        gcwFactory.generatePaymentOrders(params, true).then(
          function (response) {
            if(response.operationCode == '200'){
              if(response.data.code == -1){
                vm.settleCommissionsWarning(true, response.data.message)
              }else{
                var validation = response.data.data.every(function(element){
                  return element.created
                });
                if(validation){
                  vm.settleCommissionsSuccess()
                }else{
                  var message = response.data.message +": ";
                  var groupedData = {};
                  for (var i = 0; i < response.data.data.length; i++) {
                    const item = response.data.data[i];
                    const groupKey = item.created+'|'+item.companyCode+'|'+item.currency;
                    if (!groupedData[groupKey]) {
                      groupedData[groupKey] = {
                        created: item.created,
                        companyCode: item.companyCode,
                        currency: item.currency,
                        detailGeneration: item.detailGeneration,
                        items: []
                      };
                    }
                    groupedData[groupKey].items.push(item);
                  }
                  var countFalse = 0;
                  for (var key in groupedData) {
                    if (groupedData.hasOwnProperty(key)) {
                      const item = groupedData[key];
                      if (!item.created){
                        message = message + item.detailGeneration
                        countFalse++;
                      }
                    }
                  }
                  vm.settleCommissionsWarning(countFalse === Object.keys(groupedData).length, message)
                }
              }
              
            }else if(response.operationCode == '900'){
              mModalAlert.showError(response.data.message, 'Error:900');
            }else{
              mModalAlert.showError(response.data.message, 'Error');
            }
          }
        ).catch(function (e) {
          mModalAlert.showError(e.data.message, 'Error');
        });
      });
    }

    function settleCommissionsWarning(noRedirect,message) {
      mModalAlert.showWarning(message, 'Advertencia').then(function (response) {
        if (response) {
          if(!noRedirect){
            $state.go('consulta.3');
          }
        }
      });

    } 

    function settleCommissionsSuccess() {
      mModalAlert.showSuccess('Las comisiones se han liquidado correctamente', '', '').then(function (response) {
        if (response) {
          $state.go('consulta.3');
        }
      });
    }


    //paginador
    function pageChanged(event) {
      page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(null, setLstCurrentPage);
    }

    function setLstCurrentPage() {
      vm.selfSettlement = page.getItemsDePagina();
    }

    // tabla
    vm.selectAllPE = function (val) {
      vm.selfSettlementPorTanda.forEach(function (element) {
        element.selected = element.minor ? true : val;
      });
      setLstCurrentPage();
      getSum()
    }

    vm.selectPendientePE = function (index, val) {
      vm.mCheckAllPE = (deselectedPolicies().length === 0);
      setLstCurrentPage();
      getSum()
    }

    function deselectedPolicies() {
      return vm.selfSettlementPorTanda.filter(function (o) { return !o.selected; });
    }

    function getSum() {
      var suma = 0;
      vm.selfSettlementPorTanda.forEach(function (element) {
        suma = suma + (element.selected ? element.comissionVal : 0)
      });
      vm.sumSelfSettlement = suma;
      return suma > 0 ? suma : false;
    }

    function currencyTypeSymbol(moneda) {
      var type = "";
      if (moneda == currencyType.SOLES.code) type = currencyType.SOLES.description
      if (moneda == currencyType.DOLARES.code) type = currencyType.DOLARES.description
      if (moneda == currencyType.EUROS.code) type = currencyType.EUROS.description
      return type
    }

  } // end controller
  return ng.module('appGcw')
    .controller('AutoliquidacionController', AutoliquidacionController)
    .component('gcwAutoliquidacion', {
      templateUrl: '/gcw/app/components/comisiones/autoliquidacion/autoliquidacion.html',
      controller: 'AutoliquidacionController',
      controllerAs: 'vm',
      bindings: {
      }
    });
});