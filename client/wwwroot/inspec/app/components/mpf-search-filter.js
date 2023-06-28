'use strict';

define(['angular', 'moment'], function(ng, moment) {
  mpfSearchFilterController.$inject = [
  '$scope'
  , '$state'
  , 'inspecFactory'
  , 'UserService'
  , 'ErrorHandlerService'];

  function mpfSearchFilterController(
    $scope
    , $state
    , inspecFactory
    , UserService
    , ErrorHandlerService) {
    $scope.currentOptions = getCurrentOptions();
    $scope.getCurrentState = getCurrentState;
    $scope.onChangeProvider = onChangeProvider;
    $scope.fullFilter = fullFilter;
    $scope.doFilter = doFilter;
    $scope.clearFilter = clearFilter;
    $scope.queryAgents = queryAgents;
    $scope.queryInspectors = queryInspectors;
    $scope.user = UserService;
    $scope.filters = {};
    $scope.lastFiltersValues = {};

    setDefaultValues();

    $scope.doFilter();

    $scope.$on('callFilterFromChildren', function() {
      ng.copy($scope.lastFiltersValues, $scope.filters);
      $scope.doFilter();
    });

    function setDefaultValues() {
      if (!$scope.user.isAPermittedObject('MODAGE')) {
        $scope.filters.agentName = $scope.user.agentInfo.codigoAgente + ' >>> ' + $scope.user.agentInfo.codigoNombre;
        $scope.filters.agentId = $scope.user.agentInfo.codigoAgente;
      }
      $scope.filters.fechaDesde = moment(new Date())
        .subtract(1, 'weeks')
        .toDate();
      $scope.filters.fechaHasta = moment(new Date()).toDate();
      $scope.filters.quotationMinDate = moment(new Date())
        .subtract(6, 'days')
        .toDate();
      $scope.filters.hoy = moment(new Date()).toDate();
      if (getCurrentState() === 'solicitudes') {
        $scope.filters.providerDocumentType = '-';
        $scope.filters.number = null;
        $scope.filters.status = null;
        $scope.filters.placa = null;
        $scope.filters.provider = null;
        $scope.filters.gestor = null;
        $scope.filters.agente = null;
        $scope.filters.contacto = null;
        queryStatuses();
        queryProviders();
      }

      if (getCurrentState() === 'cotizaciones' || getCurrentState() === 'nuevaSolicitud') {
        $scope.filters.fechaDesde = moment(new Date())
          .subtract(6, 'days')
          .toDate();
        $scope.filters.numberQuotation = null;
        $scope.filters.product = null;
        $scope.filters.contractor = null;
        queryProducts();
      }

      if (getCurrentState() === 'programaciones') {
        queryProviders().then(function() {
          queryInspectors().then(function() {
            queryStatusesSchedule();
          });
        });
        $scope.filters.providerDocumentType = '-';
        $scope.filters.status = null;
        $scope.filters.number = null;
        $scope.filters.provider = null;
        $scope.filters.placa = null;
        $scope.filters.gestor = null;
        $scope.filters.agente = null;
        $scope.filters.inspector = null;
        $scope.filters.contacto = null;
      }

      if (getCurrentState() === 'administracionCoordinador') {
        queryProviders();
        queryTipoDocumento();
        $scope.filters.mProveedor = null;
        $scope.filters.mNombre = null;
        $scope.filters.mTipo = null;
        $scope.filters.mNroDocumento = null;
        $scope.filters.mApellido = null;
      }
    }

    function getCurrentOptions() {
      switch (getCurrentState()) {
        case 'solicitudes':
          return {template: 'requests.html', getArguments: getArgsRequests};
        case 'cotizaciones':
          return {template: 'quotations.html', getArguments: getArgsQuotations};
        case 'programaciones':
          return {template: 'scheludes.html', getArguments: getArgsRequests};
        case 'administracionCoordinador':
          return {template: 'coordinators.html', getArguments: getArgsCoordinators};
        case 'administracionInspectores':
          return {template: 'inspectors.html', getArguments: getArgsInspectors};
        default:
          return {template: '', getArguments: null};
      }
    }

    function getCurrentState() {
      return $state.current.name;
    }

    function onChangeProvider(provider) {
      $scope.filters.providerDocumentType = !provider.selectedEmpty
        ? provider.document.type + '' + provider.document.code
        : '-';
      if (getCurrentState() === 'programaciones') {
        if (provider.document) {
          queryInspectors(provider.document.type, provider.document.code);
        } else {
          queryInspectors();
        }
      }
    }

    function queryTipoDocumento() {
      return inspecFactory.common.getTipoDocumento().then(function(response) {
        $scope.documentTypeData = response.Data;
      })
      .catch(function(e) {
        ErrorHandlerService.handleError(e);
      });
    }

    function queryProviders() {
      return inspecFactory.common
        .GetProviders()
        .then(function(response) {
          return response.map(function(element) {
            return {
              name: element.providerName,
              document: {
                type: element.documentType,
                code: element.documentCode
              }
            };
          });
        })
        .then(function(providers) {
          $scope.providers = providers;
        })
        
    }

    function queryStatuses() {
      return inspecFactory.common
        .GetState()
        .then(function(items) {
          return items.map(function(element) {
            return {
              name: element.description,
              id: element.parameterId
            };
          });
        })
        .then(function(items) {
          if($scope.user.role === "PROV"){
            items = _.filter(items, function(i){
              return i.id == 3 || i.id == 9
            });
          }
          $scope.statuses = items;
        })
        
    }

    function queryStatusesSchedule() {
      return inspecFactory.common
        .getStatusSchedule()
        .then(function(items) {
          return items.map(function(element) {
            return {
              name: element.description,
              id: element.parameterId
            };
          });
        })
        .then(function(items) {
          $scope.statuses = items;
        })
        
    }

    function queryAgents(inputValue) {
      return inspecFactory.common.getAgents(inputValue).then(function(response) {
        return response.Data.map(function(element) {
          return {
            nombre: element.CodigoNombre,
            id: element.CodigoAgente
          };
        });
      })
      
    }

    function queryInspectors(type, nro) {
      var typeProvider = type || null;
      var nroProvider = nro || null;
      var showSpin = !!typeProvider && !!nroProvider;
      $scope.filters.inspector = null;
      return inspecFactory.common
        .searchInspectors(typeProvider, nroProvider, showSpin)
        .then(
          function(response) {
            return response.map(function(element) {
              return {
                nombre:
                  element.name +
                  ' ' +
                  (element.lastName ? element.lastName : '') +
                  ' ' +
                  (element.motherLastName ? element.motherLastName : ''),
                id: element.inspectorId
              };
            });
          },
          function() {
            return [];
          }
        )
        .then(function(inspectors) {
          $scope.inspectors = inspectors;
        })
        
    }

    function queryProducts() {
      inspecFactory.common
        .GetProducts()
        .then(function(response) {
          return response.Data.map(function(element) {
            return {
              id: element.CodigoProducto,
              name: element.NombreProducto
            };
          });
        })
        .then(function(items) {
          $scope.products = items;
        })
        
    }

    function fullFilter() {
      $scope.$emit('fullFilter', $scope.currentOptions.getArguments());
      ng.copy($scope.filters, $scope.lastFiltersValues);
    }

    function doFilter() {
      $scope.$emit('filter', $scope.currentOptions.getArguments());
      ng.copy($scope.filters, $scope.lastFiltersValues);
    }

    function clearFilter() {
      setDefaultValues();
      $scope.$emit('clearFilter', $scope.currentOptions.getArguments());
      ng.copy($scope.filters, $scope.lastFiltersValues);
    }

    function getArgsRequests() {
      var provider = $scope.filters.provider;
      if (provider) {
        provider = provider.selectedEmpty ? null : provider;
      }
      var objReq = {
        requestCode: $scope.filters.number,
        statusCode: $scope.filters.status ? $scope.filters.status.id : null,
        licencePlate: $scope.filters.placa ? $scope.filters.placa.toUpperCase() : null,
        startDate: moment($scope.filters.fechaDesde).format('DD/MM/YY'),
        endDate: moment($scope.filters.fechaHasta).format('DD/MM/YY'),
        providerType: provider ? provider.document.type : null,
        providerCode: provider ? provider.document.code : null,
        managerCode: $scope.filters.gestor ? $scope.filters.gestor.id : null,
        agentCode: $scope.filters.agentId
          ? $scope.filters.agentId
          : $scope.filters.agente ? $scope.filters.agente.id : null,
        inspectorId: $scope.filters.inspector ? $scope.filters.inspector.id : null,
        contactName: $scope.filters.contacto ? $scope.filters.contacto.toUpperCase() : null
      };
      if (getCurrentState() === 'programaciones') {
        objReq.agentCode = objReq.agentCode === '0' ? null : objReq.agentCode;
      }

      var evo = JSON.parse(localStorage.getItem('evoProfile'));
      var roles = evo.rolesCode;
      ng.forEach(roles, function(item){
        if(getCurrentState() === 'solicitudes' && item.nombreAplicacion === "INSPEC" && item.codigoRol === "PROV"){
          objReq.agentCode = null;  
        }
      })
      return objReq;
    }

    function getArgsQuotations() {
      var params = {
        NumeroDocumento: $scope.filters.numberQuotation || null,
        CodigoProducto: $scope.filters.product ? $scope.filters.product.id : null,
        NombreContratante: $scope.filters.contractor ? $scope.filters.contractor : null,
        StartDate: moment($scope.filters.fechaDesde).format('DD/MM/YY'),
        EndDate: moment($scope.filters.fechaHasta).format('DD/MM/YY'),
        UserOwnerCode: UserService.username,
        UserRoleCode: UserService.role,
        AgentId: $scope.filters.agentId
          ? $scope.filters.agentId
          : $scope.filters.agente ? $scope.filters.agente.id : null,
        TradeCode: 301
      };
      return params;
    }

    function getArgsCoordinators() {
      var provider = $scope.filters.mProveedor;
      if (provider) {
        provider = provider.selectedEmpty ? null : provider;
      }
      return {
        ProviderDocumentTypeCode: provider ? provider.document.type : null,
        ProviderDocument: provider ? provider.document.code : null,
        UserDocumentTypeCode: $scope.filters.mTipo ? $scope.filters.mTipo.Codigo : null,
        UserDocument: $scope.filters.mNroDocumento || null,
        UserName: $scope.filters.mNombre || null,
        UserLastName: $scope.filters.mApellido || null
      };
    }

    function getArgsInspectors() {
      return {
        ProviderDocumentTypeCode: null,
        ProviderDocument: null
      };
    }
  }

  ng
    .module('appInspec')
    .controller('mpfSearchFilterController', mpfSearchFilterController)
    .component('mpfSearchFilter', {
      templateUrl: '/inspec/app/components/mpf-search-filter.html',
      controller: 'mpfSearchFilterController'
    });
});
