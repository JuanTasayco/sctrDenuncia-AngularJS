define(['angular', 'constants', 'constantsFola'], function (angular, constants, constantsFola) {
  'use strict';

  angular
    .module(constants.module.polizas.fola.moduleName)
    .directive('mpfDocumentoItemFola', DocumentoItemFolaDirective);

  DocumentoItemFolaDirective.$inject = [];

  function DocumentoItemFolaDirective() {
    var directive = {
      controller: DocumentoItemFolaDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/fola/components/documento-item/documento-item-fola.template.html',
      transclude: true,
      scope: {
        documento: '=ngDocumento',
        ngAccionCallback: '&?ngAccion',
        isConsultaDocumento: '&?ngConsultaDocumento'
      }
    };

    return directive;
  }

  DocumentoItemFolaDirectiveController.$inject = ['$scope'];
  function DocumentoItemFolaDirectiveController($scope) {
    var vm = this;

    // Propiedades
    vm.documento = {};
    vm.labelPolizaNoEmitida = '';
    vm.labelPolizaGenerada = '';
    vm.cantidadPolizaNoEmitida = 0;
    vm.cantidadPolizaGenerada = 0;
    vm.isConsultaDocumento = $scope.isConsultaDocumento;
    // funciones
    vm.verCotizacion = VerCotizacion;
    vm.observaciones = Observaciones;

    (function load_DocumentoItemFolaDirectiveController() {
      vm.documento = _transformScopeDocument($scope.documento);
      vm.observaciones(vm.documento);
    })();

    function VerCotizacion() {
      if ($scope.ngAccionCallback) {
        $scope.ngAccionCallback({ '$event': {documento: vm.documento}});
      } else {
        console.error('ERR-001: No se ha asignado la propiedad ng-accion');
      }
    }
    // funciones privadas
    function _transformScopeDocument(document) {
      return {
        NumeroDocumento: document && document.numeroDocumento,
        FechaRegistro: document && document.fechaInicio,
        Contratante: document && document.contratante.nombre,
        Usuario: document && document.agente,
        Estado: document && document.estado,
        Riesgos: document && document.riesgos
      };
    }
    function Observaciones(documento) {
      vm.cantidadPolizaNoEmitida = cantidadObservaciones(documento.Riesgos, constantsFola.ESTADO.POLIZA_NO_EMITIDA);
      vm.cantidadPolizaGenerada = cantidadObservaciones(documento.Riesgos, constantsFola.ESTADO.POLIZA_GENERADA);
      vm.labelPolizaNoEmitida = vm.cantidadPolizaNoEmitida > 0 ? vm.cantidadPolizaNoEmitida +  ' pólizas no emitidas' : '';
      vm.labelPolizaGenerada = vm.cantidadPolizaGenerada > 0 ? vm.cantidadPolizaGenerada + ' pólizas generadas' : '';
    }

    function cantidadObservaciones(riesgos, estado) {
      var numeroObservaciones = 0;
      if (riesgos) {
        riesgos.forEach(function(riesgo) {
          if (riesgo.estado === estado) {
            numeroObservaciones++;
          }
        });
      }
      return numeroObservaciones;
    }
  }
});
