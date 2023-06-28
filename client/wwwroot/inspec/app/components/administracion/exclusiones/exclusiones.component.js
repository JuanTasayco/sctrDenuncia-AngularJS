'use strict';

define(['angular', 'lodash'], function(ng, _) {
  exclusionesController.$inject = [
    '$scope',
    '$rootScope',
    'inspecFactory',
    '$uibModal',
    'mModalAlert',
    'mModalConfirm',
    '$timeout',
    'ErrorHandlerService',
    '$q'
  ];

  function exclusionesController(
    $scope,
    $rootScope,
    inspecFactory,
    $uibModal,
    mModalAlert,
    mModalConfirm,
    $timeout,
    ErrorHandlerService,
    $q
  ) {
    var vm = this;
    vm.$onInit = onInit;
    vm.pageChanged = pageChanged;
    vm.migration = migration;
    vm.acordion = acordion;
    vm.clear = clear;

    vm.arrTerritorial = [];

    vm.fnAutoCompleteTerritorial = _fnAutoCompleteTerritorial;
    vm.fnAutoCompleteExecutives = _fnAutoCompleteExecutives;
    vm.fnAutoCompleteAgents = _fnAutoCompleteAgents;

    vm.fnUpdateStatusStructure = _fnUpdateStatusStructure;
    vm.fnUpdateStatusExecutive = _fnUpdateStatusExecutive;
    vm.fnUpdateStatusAgent = _fnUpdateStatusAgent;
    vm.serviceUpdateStatus = serviceUpdateStatus;

    function _fnAutoCompleteTerritorial(txt) {
      if (txt && txt.length >= 2) {
        var defer = $q.defer();
        var pms = inspecFactory.management.autoCompleteTerritorial(txt, vm.mBuscarEjecutivo, vm.mBuscarAgente);
        pms
          .then(function(response) {
            var dataTerritorial = response.data || response.Data;
            if (dataTerritorial.length > 0) {
              var i = 0;
              ng.forEach(dataTerritorial, function(item) {
                dataTerritorial[i].idName = dataTerritorial[i].id + ' - ' + dataTerritorial[i].name;
                i++;
              });
              $scope.noResults = false;
            } else $scope.noResults = true;
            defer.resolve(dataTerritorial);
          })
          .catch(function(e) {
            ErrorHandlerService.handleError(e);
          });
        return defer.promise;
      }
    }

    function _fnAutoCompleteExecutives(txt) {
      if (txt && txt.length >= 2) {
        var defer = $q.defer();
        var pms = inspecFactory.management.autoCompleteExecutives(vm.mBuscarEstructura, txt, vm.mBuscarAgente);
        pms
          .then(function(response) {
            var dataExecutives = response.data || response.Data;
            var i = 0;
            if (dataExecutives.length > 0) {
              ng.forEach(dataExecutives, function(item) {
                dataExecutives[i].idName = dataExecutives[i].id + ' - ' + dataExecutives[i].name;
                i++;
              });
              $scope.noResults = false;
            } else $scope.noResults = true;
            defer.resolve(dataExecutives);
          })
          .catch(function(e) {
            ErrorHandlerService.handleError(e);
          });
        return defer.promise;
      }
    }

    function _fnAutoCompleteAgents(txt) {
      if (txt && txt.length >= 2) {
        var defer = $q.defer();
        var pms = inspecFactory.management.autoCompleteAgents(vm.mBuscarEstructura, vm.mBuscarEjecutivo, txt);
        pms
          .then(function(response) {
            var dataAgents = response.data || response.Data;
            var i = 0;
            if (dataAgents.length > 0) {
              ng.forEach(dataAgents, function(item) {
                dataAgents[i].idName = dataAgents[i].id + ' - ' + dataAgents[i].name;
                i++;
              });
              $scope.noResults = false;
            } else $scope.noResults = true;
            defer.resolve(dataAgents);
          })
          .catch(function(e) {
            ErrorHandlerService.handleError(e);
          });
        return defer.promise;
      }
    }

    function onInit() {
      vm.oneAtATime = true;
      vm.frmConfig = {};
      vm.mMaxLength = 5;

      vm.status = {
        open: true
      };

      vm.firstLoad = true;

      vm.pagination = {
        currentPage: 1,
        maxSize: 10,
        totalRecords: 0,
        mOrderBy: {Descripcion: 'Más reciente', Codigo: '1'}
      };
    }

    vm.fnLimpiar = _fnLimpiar;
    function _fnLimpiar() {
      vm.firstLoad = true;
      vm.mBuscarEstructura = undefined;
      vm.mBuscarEjecutivo = undefined;
      vm.mBuscarAgente = undefined;
      vm.arrTerritorial = [];
      vm.pagination.totalRecords = 0;
    }

    function acordion() {
      vm.status.open = vm.status.open == false ? true : false;
    }

    vm.fnBuscar = _fnBuscar;
    function _fnBuscar() {
      vm.firstLoad = false;
      vm.pagination.currentPage = 1;
      getItemsList();
    }

    function getTerritorial(list) {
      var territorios = [],
        executives = [],
        agents = [];
      ng.forEach(list, function(item) {
        territorios.push({
          id: item.structureId,
          name: item.structure,
          status: item.statusStructure == 1,
          executives: []
        });
      });
      territorios = _.unique(territorios, 'id');

      ng.forEach(territorios, function(item) {
        executives = _.unique(_.where(list, {structureId: item.id}), 'executiveId');
        ng.forEach(executives, function(e) {
          item.executives.push({
            id: e.executiveId,
            name: e.executive,
            status: e.statusExecutive == 1,
            structureId: e.structureId,
            agents: []
          });
        });
      });

      ng.forEach(territorios, function(item) {
        ng.forEach(item.executives, function(e) {
          agents = _.where(list, {executiveId: e.id});
          ng.forEach(agents, function(a) {
            e.agents.push({
              id: a.agentId,
              name: a.agent,
              status: a.status == 1,
              executiveId: a.executiveId
            });
          });
        });
      });
      return territorios;
    }

    function getItemsList() {
      var params = {
        agentId: ng.isUndefined(vm.mBuscarAgente) ? 0 : vm.mBuscarAgente.id,
        territorialStructureId: ng.isUndefined(vm.mBuscarEstructura) ? 0 : vm.mBuscarEstructura.id,
        executiveId: ng.isUndefined(vm.mBuscarEjecutivo) ? 0 : vm.mBuscarEjecutivo.id,
        pageNum: vm.pagination.currentPage,
        pageSize: 10,
        sortingType: 3
      };
      var pms = inspecFactory.management.getAgentsPagination(params);
      pms
        .then(function(response) {
          var dataExclusiones = response.data.paginacion;
          vm.pagination.totalRecords = response.data.totalFilas;
          vm.arrTerritorial = getTerritorial(dataExclusiones);
        })
        .catch(function(e) {
          ErrorHandlerService.handleError(e);
        });
    }

    function pageChanged(page) {
      vm.pagination.currentPage = page;
      getItemsList();
    }

    function migration() {
      var vModal = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        size: 'md',
        templateUrl: '/inspec/app/components/administracion/exclusiones/modal-migrar-data.html',
        controllerAs: '$ctrl',
        controller: [
          '$scope',
          'mModalAlert',
          '$uibModalInstance',
          'ErrorHandlerService',
          function($scope, mModalAlert, $uibModalInstance, ErrorHandlerService) {
            var vm = this;
            vm.closeModal = closeModal;
            vm.loadData = loadData;
            vm.formData = {};

            function closeModal() {
              $uibModalInstance.close();
            }

            function loadData() {
              var pms = inspecFactory.management.synchronizeAgents();
              pms
                .then(function(response) {
                  if (response.operationCode == 200) {
                    closeModal();
                    mModalAlert.showSuccess(response.message, '');
                    _fnBuscar();
                  }
                })
                .catch(function(e) {
                  ErrorHandlerService.handleError(e);
                });
            }

            $scope.$watch(
              function() {
                return vm.formData.planilla;
              },
              function(newValue) {
                if (newValue) {
                  vm.formData.fileName = vm.formData.planilla[0].name;
                }
              }
            );
          }
        ]
      });
      vModal.result.then(
        function() {
          //  todo
        },
        function() {
          //  todo
        }
      );
    }

    function clear($event) {
      $event.stopPropagation();
    }

    function serviceUpdateStatus(params) {
      var pms = inspecFactory.management.updateStatusAgent(params);
      pms
        .then(function(response) {
          if (response.operationCode == 200) {
            mModalAlert.showSuccess(response.message, '');
            return true;
          } else {
            mModalAlert.showWarning(response.message, '');
            return false;
          }
        })
        .catch(function(e) {
          ErrorHandlerService.handleError(e);
        });
    }

    function changeStatusStructure(territorial, event) {
      event.preventDefault();
      territorial.status = !territorial.status;
      var params = {
        StructureId: territorial.id,
        AgentId: '',
        ExecutiveId: '',
        IsEnabled: territorial.status
      };
      ng.forEach(territorial.executives, function(item) {
        item.status = territorial.status;
        ng.forEach(item.agents, function(i) {
          i.status = item.status;
        });
      });
      serviceUpdateStatus(params);
      event.stopPropagation();
    }

    function _fnUpdateStatusStructure(territorial, event) {
      if (territorial.status) {
        mModalConfirm
          .confirmInfo('¿Está seguro de desactivar todos los agentes de esta estructura?', 'ALERTA')
          .then(function(response) {
            if (response) changeStatusStructure(territorial, event);
          });
      } else changeStatusStructure(territorial, event);
    }

    function changeStatusExecutive(executive, event) {
      executive.status = !executive.status;
      var params = {
        StructureId: executive.structureId,
        AgentId: '',
        ExecutiveId: executive.id,
        IsEnabled: executive.status
      };
      ng.forEach(executive.agents, function(item) {
        item.status = executive.status;
      });
      serviceUpdateStatus(params);
      event.stopPropagation();
    }

    function _fnUpdateStatusExecutive(executive, event) {
      event.preventDefault();
      if (executive.status) {
        mModalConfirm
          .confirmInfo('¿Está seguro de desactivar todos los agentes de esta ejecutivo?', 'ALERTA')
          .then(function(response) {
            if (response) changeStatusExecutive(executive, event);
          });
      } else changeStatusExecutive(executive, event);
    }

    function getExecutiveById(id) {
      return _.find(vm.arrTerritorial[0].executives, {id: id});
    }

    function getChecked(item) {
      vm.count = 0;
      var executive = getExecutiveById(item.executiveId);
      ng.forEach(executive.agents, function(a) {
        if (!a.status == executive.status) vm.count++;
      });
      if (vm.count == executive.totalAgents || (vm.count <= executive.totalAgents && executive.status == false))
        executive.status = item.status;
    }

    function _fnUpdateStatusAgent(item, event) {
      event.preventDefault();
      item.status = !item.status;
      var params = {
        StructureId: '',
        AgentId: item.id,
        ExecutiveId: '',
        IsEnabled: item.status
      };
      getChecked(item);
      serviceUpdateStatus(params);
      event.stopPropagation();
    }
  }

  return ng
    .module('appInspec')
    .controller('ExclusionesController', exclusionesController)
    .component('inspecExclusiones', {
      templateUrl: '/inspec/app/components/administracion/exclusiones/exclusiones.html',
      controller: 'ExclusionesController',
      controllerAs: '$ctrl'
    });
});
