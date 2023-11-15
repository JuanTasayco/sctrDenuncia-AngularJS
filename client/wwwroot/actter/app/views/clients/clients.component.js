'use strict';
define(['angular', 'system', 'generalConstant', 'mpfCardFilter','actterFactory','constants','proxyActter'], function(angular, system, generalConstant,mpfCardFilter,actterFactory,constants,proxyActter) {
  ClientsController.$inject = ['$scope', '$log', '$state','$stateParams','$q','actterFactory','MxPaginador','proxyCliente','proxyGeneral','mainServices','mModalAlert'];
  function ClientsController($scope, log, $state, $stateParams, $q, actterFactory,MxPaginador,proxyCliente,proxyGeneral,mainServices,mModalAlert) {
    var vm = this;
    var page , pagePolizas;
    $scope.currentPage = 1;
    $scope.currentPagePolizas = 1;
    $scope.itemsXPagina = 10;
    $scope.itemsXPaginaPolizas = 10;
    $scope.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
    $scope.paramsForm;
    $scope.clients = [];
    $scope.polizas = [];
    $scope.totalItems = null;
    $scope.totalItemsPolizas = null;
    $scope.firstSearch = false;
    page = new MxPaginador();
    page.setNroItemsPorPagina($scope.itemsXPagina);
    pagePolizas = new MxPaginador();
    pagePolizas.setNroItemsPorPagina($scope.itemsXPaginaPolizas);

    $scope.paramsSearch = {};
    
    $scope.documentTypeChange = documentTypeChange;
    $scope.getPolizas = getPolizas;

    $scope.isRedirectPortal = actterFactory.isRedirectPortal();
    $scope.isOptModify = actterFactory.isOptModify();


    (function onLoad() {
      getParamsForm(generalConstant.PARAM_FORM);
    })();

    $scope.onFilter = function() {
      $scope.searchForm.markAsPristine()
      if($scope.searchForm.$valid){
        getClients(false);
      }
    };

    $scope.onClear = function() {
      $scope.searchForm.tipoDocumento = null;
      $scope.searchForm.numDocumento = null;
      $scope.searchForm.nomCliente = null;
    };

    $scope.pageChanged = function(event){
      page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda) {
        $scope.paramsSearch.parametro.numeroPag = nroTanda;
        getClients(true);
      }, setLstCurrentPage);
    };

    $scope.pageChangedPoliza = function(event){
      pagePolizas.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda) {
        $scope.currentPagePolizas = nroTanda;
        setLstCurrentPagePoliza();
      }, setLstCurrentPagePoliza);
    };

    function getClients(paginate){
      $scope.paramsSearch = paginate ? $scope.paramsSearch : getParams();
      proxyCliente.obtenerClientes($scope.paramsSearch,true).then( function(response){
        SetPaginateDefaultValues()
        if (response.OperationCode === constants.operationCode.success) {
          $scope.clients =  response.Data.listaResultados
          $scope.totalItems = response.Data.totalRegistros;
        }
        $scope.firstSearch = true;
        page.setNroTotalRegistros($scope.totalItems).setDataActual($scope.clients).setConfiguracionTanda();
        $scope.isOpen=false;
      }).catch( function(err){
        console.error(err)
      })
    }

    function getPolizas(client){

      if (!$scope.isOptModify) return;

      SetPaginatePolizasDefaultValues();
      if(client.polizasSearch) {
        $scope.totalItemsPolizas = client.polizasSearch.length
        pagePolizas.setNroTotalRegistros($scope.totalItemsPolizas).setDataActual(client.polizasSearch).setConfiguracionTanda();
        setLstCurrentPagePoliza();
        return;
      } 
      proxyCliente.obtenerPolizas(client.documento,true).then( function(response){
        if (response.OperationCode === constants.operationCode.success) {
          client.polizasSearch = response.Data
          $scope.totalItemsPolizas = response.Data.length
        }else{
          client.polizasSearch = [];
        }
        pagePolizas.setNroTotalRegistros($scope.totalItemsPolizas).setDataActual(client.polizasSearch).setConfiguracionTanda();
        setLstCurrentPagePoliza();
      }).catch( function(err){
        console.error(err)
      })
    }

    function getParamsForm(idFormulario){
      proxyGeneral.obtenerTipo(idFormulario,true).then( function(response){
        if (response.OperationCode === constants.operationCode.success) {
          $scope.paramsForm = response.Data;
          if($stateParams.search){
            $scope.searchForm.tipoDocumento = $stateParams.search.tipoDocumento;
            $scope.searchForm.numDocumento = $stateParams.search.numDocumento;
            $scope.searchForm.nomCliente = $stateParams.search.nomCliente;
            getClients(false);
          }
        }
      }).catch( function(err){
        console.error(err)
      })
    }

    function setLstCurrentPage() {
      $scope.clients = page.getItemsDePagina();
    }

    function setLstCurrentPagePoliza() {
      $scope.polizas = pagePolizas.getItemsDePagina();
    }

    function SetPaginateDefaultValues(){
      $scope.clients = [];
      $scope.totalItems = 0;
    }

    function SetPaginatePolizasDefaultValues(){
      $scope.polizas =[];
      $scope.totalItemsPolizas = 0;
    }

    $scope.fnRedirectToPortal = function(client) {
      var body = {
        documentType: client.documento.codigo,
        documentNumber: client.documento.numero,
      };
      actterFactory.getTokenRedirect(body).then(
        function (response){
          if (response.operationCode){
            var token = response.data.access_token;
            window.open(actterFactory.baseUrlPortal + '#/validate-token?token=' + token, '_blank');
          }
        }
      ).catch(function (error) {
        mModalAlert.showWarning(error.data.data.message, 'Advertencia');
      });
    };

    $scope.fnGoToClientEdit = function(client,empresa) {
      $state.go('editclient', {
        client: client,
        empresa:empresa
      });
    };

    $scope.fnGoToPoliza = function(client,poliza) {
      $state.go('editpoliza', {
        client: client,
        policyNumber: poliza.numPoliza,
        empresa: poliza.empresa,
        numSuplemento: poliza.numSuplemento,
        search: {
          tipoDocumento : $scope.searchForm.tipoDocumento,
          numDocumento : $scope.searchForm.numDocumento,
          nomCliente : $scope.searchForm.nomCliente
        }
      });
    };

    function getParams(){
      return {
        parametro: {
          numeroPag: 1,
          tamanioPag: $scope.itemsXPagina 
        },
        documento: {
          codigo: $scope.searchForm.tipoDocumento.codigo,
          numero: $scope.searchForm.numDocumento
        },
        nombre: $scope.searchForm.nomCliente ? $scope.searchForm.nomCliente.toUpperCase() : null
      }
    }

    function documentTypeChange() {
      $scope.searchForm.numDocumento  = '';
      var numDocValidations = {};
      if(!angular.isUndefined($scope.searchForm.tipoDocumento)){
        mainServices.documentNumber.fnFieldsValidated(numDocValidations, $scope.searchForm.tipoDocumento.codigo, 1);
        $scope.docNumMaxLength = numDocValidations.DOCUMENT_NUMBER_MAX_LENGTH;
        $scope.docNumMinLength = numDocValidations.DOCUMENT_NUMBER_MIN_LENGTH;
        $scope.docNumType = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE;
        $scope.docNumTypeDisabled = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE_DISABLED;
      }
    }

  }

  return angular
    .module(generalConstant.APP_MODULE)
    .controller('ClientsController', ClientsController)
    .factory('loaderClienteController',['proxyCliente','proxyGeneral','$state','$q','mModalAlert', function(proxyCliente,proxyGeneral,$state,$q,mModalAlert){
      var datosPoliza,datosForm;
      function getData(stateParams){
        var deferred = $q.defer();
        var params = getParams(stateParams)
        proxyCliente.obtenerDatosPersonales(params,true).then( function(response){
          if (response.OperationCode === constants.operationCode.success) {
            datosPoliza = response.Data;
            deferred.resolve(datosPoliza);
          }else{
            mModalAlert
            .showError('Ocurrió un error al obtener los datos', 'ERROR');
          }
        },function(error) {
          deferred.reject(error.statusText);
        })
        return deferred.promise;
      }

      function getDataForm(){
        var deferred = $q.defer();
        proxyGeneral.obtenerTipo(generalConstant.PARAM_FORM,true).then( function(response){
          if (response.OperationCode === constants.operationCode.success) {
            datosForm = response.Data;
            deferred.resolve(datosForm);
          }else{
            mModalAlert
            .showError('Ocurrió un error al obtener los datos', 'ERROR');
          }
        }).catch( function(error){
          deferred.reject(error.statusText);
        })
        return deferred.promise;
      }

      function getParams(stateParams){
        return {
          documento: stateParams.client,
          numPoliza:  stateParams.policyNumber,
          empresa:  stateParams.empresa,
          numSuplemento: stateParams.numSuplemento
        }
      }

      return {
        getData : function(stateParams) {
          if(!stateParams.client)  return $q.reject()
          return getData(stateParams);
        },
        getDataForm : function(){
          if(datosForm) return $q.resolve(datosForm);
          return getDataForm();
        }
      }
    }])
});
