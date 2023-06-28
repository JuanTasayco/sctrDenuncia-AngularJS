define([
  'angular', 'constants'
], function (angular, constants) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .directive('mpfDocumentoItemVidaLey', DocumentoItemVidaLeyDirective);

  DocumentoItemVidaLeyDirective.$inject = [];

  function DocumentoItemVidaLeyDirective() {
    var directive = {
      controller: DocumentoItemVidaLeyDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/vida-ley/components/documento-item/documento-item.template.html',
      transclude: true,
      scope: {
        documento: '=ngDocumento',
        ngSeleccionadoCallback: '&?ngSeleccionado',
        ngAccionCallback: '&?ngAccion',
        rol: '=ngRol',
      }
    };

    return directive;
  }

  DocumentoItemVidaLeyDirectiveController.$inject = ['$scope', 'vidaLeyFactory', '$state'];
  function DocumentoItemVidaLeyDirectiveController($scope, vidaLeyFactory, $state) {
    var vm = this;

    vm.documento = {};
    vm.showCheck = true;

    vm.verCotizacion = VerCotizacion;
    vm.verEmision = VerEmision;
    vm.updateListArray = UpdateListArray;
    vm.validarParaAnulacion = ValidarParaAnulacion;
    vm.validarAgenteEstadoST = ValidarAgenteEstadoST;
    vm.isEmitted = IsEmitted;

    (function load_DocumentoItemVidaLeyDirectiveController() {
      vm.documento = _transformScopeDocument($scope.documento);
      vm.validarParaAnulacion();
      vm.validarAgenteEstadoST();
    })();

    function VerCotizacion() {
      if ($scope.ngAccionCallback) {
        var accion = constantsVidaLey.ESTADOS_PERMITIDOS_ACTUALIZACION.indexOf(vm.documento.CodigoEstado) !== -1 ? 'edit' : 'resumen';
        $scope.ngAccionCallback({ '$event': { evento: accion, documento: vm.documento } });
      } else {
        console.error('ERR-001: No se ha asignado la propiedad ng-accion');
      }
    }

    function VerEmision(){
      $state.go('resumenEmisionVidaLey',{documentoId: vm.documento.NumeroDocumento});
    }

    function UpdateListArray(value, idItem) {

      if ($scope.ngSeleccionadoCallback) {
        $scope.ngSeleccionadoCallback({ '$event': { evento: idItem } });
      } else {
        console.error('ERR-001: No se ha asignado la propiedad ng-seleccionado');
      }
    };

    function _transformScopeDocument(document) {
      return {
        NumeroDocumento: document && document.NumDoc,
        FechaRegistro: document && document.FecReg,
        Estado: document && document.DesEstado,
        CodigoEstado: document && document.CodEstado,
        Contratante: document && document.RazonSocial,
        Agente: document && document.NomAgente,
        Usuario: document && document.UsuReg,
        Secuencia: document && document.Secuencia,
        Seleccionado: false
      };
    }

    function ValidarParaAnulacion(){
      var noValidos = ['CR', 'AN', 'EM'];
      vm.showCheck = noValidos.indexOf(vm.documento.CodigoEstado) !== -1 ? false : true;
    }

    function ValidarAgenteEstadoST(){
       vm.hideDetailButton = vm.documento.CodigoEstado === "ST" && $scope.rol === "AGT" || 
       vm.documento.CodigoEstado === "SR" || 
       vm.documento.CodigoEstado === "SA" && $scope.rol === "SUS";
    }

    function IsEmitted(estado){
      return estado === 'EM';
    }

  }

});
