'use strict';

define(['angular'], function(ng) {
  cotizacionesDetalleController.$inject = [
    '$window',
    '$state',
    '$stateParams',
    '$location',
    'inspecFactory',
    'mModalConfirm',
    'UserService',
    'gaService',
  ];

  function cotizacionesDetalleController($window, $state, $stateParams, $location, inspecFactory, mModalConfirm, UserService,gaService) {
    $window.document.title = 'OIM - Inspecciones Autos - Detalle cotización';
    var vm = this;
    vm.requestInspection = requestInspection;
    vm.registerInspection = registerInspection;
    vm.fromInspec = $stateParams.fromInspec;
    vm.copyEmail = $stateParams.copyEmail;
    vm.agent = $stateParams.agent;
    vm.confirmationEmail = $stateParams.confirmationEmail;
    vm.goToInspec = goToInspec;
    queryQuotation();

    function queryQuotation() {
      inspecFactory.quotations
        .getQuotationsByNumber($stateParams.number, true)
        .then(function(response) {
          var quotation = response.Data;
          return {
            number: quotation.NumeroDocumento,
            auto:
              quotation.Vehiculo.NombreMarca +
              ' ' +
              quotation.Vehiculo.NombreModelo +
              ', ' +
              quotation.Vehiculo.AnioFabricacion,
            valor: quotation.Vehiculo.ValorComercial,
            contratante:
              quotation.Contratante.Nombre +
              ' ' +
              quotation.Contratante.ApellidoPaterno +
              ' ' +
              quotation.Contratante.ApellidoMaterno,
            tipoUso: quotation.Vehiculo.NombreUso,
            polizaGrupo: quotation.PolizaGrupo || '-',
            producto: quotation.NombreProducto,
            primaNeta: quotation.PrimaNeta,
            circulacion:
              quotation.Vehiculo.Ubigeo.NombreDepartamento +
              ', ' +
              quotation.Vehiculo.Ubigeo.NombreProvincia +
              ', ' +
              quotation.Vehiculo.Ubigeo.NombreDistrito,
            mapfreDolar: quotation.Contratante.ImporteMapfreDolar || -1,
            descuento: quotation.Hogar.DsctoComercial,
            tuComision: quotation.TuComision,
            totalDscto: quotation.TotalDscto
          };
        })
        .then(function(quotation) {
          vm.cotizacion = quotation;
        });
    }

    function requestInspection() {
      mModalConfirm
        .confirmInfo(
          '¿Estás seguro que desea crear la siguiente solicitud de inspección?',
          'SOLICITAR INSPECCIÓN',
          'ACEPTAR'
        )
        .then(function() {
          gaService.add({ gaCategory: 'Solicitud - INSPECCION', gaAction: 'Con Cotización - Solicitar Inspección - Aceptar', gaLabel: 'Botón: Aceptar solicitud de inspección', gaValue: 'Periodo Regular' });
          var queryParam = $location.search();
          $state.go('solicitudNuevaIndividual.steps', {
            quotationNumber: $stateParams.number,
            step: 1,
            vehiclePlate: queryParam.placa,
            requestId: queryParam.requestId
          });
        });
    }

    function registerInspection() {
      mModalConfirm
        .confirmInfo(
          '¿Estás seguro que desea crear el siguiente registro de inspección?',
          'CREAR REGISTRO DE INSPECCIÓN',
          'ACEPTAR'
        )
        .then(function() {
          $state.go('inspeccionNueva.steps', {
            quotationNumber: $stateParams.number,
            step: 1,
            copyEmail: vm.copyEmail,
            confirmationEmail: vm.confirmationEmail,
            agent: vm.agent
          });
        });
    }

    function goToInspec() {
      // TODO: Cambiar esto
      return UserService.isAPermittedObject('REGINS') && UserService.isAPermittedObject('REGSOL')
        ? vm.fromInspec
        : UserService.isAPermittedObject('REGINS');
    }
  }

  return ng
    .module('appInspec')
    .controller('CotizacionesDetalleController', cotizacionesDetalleController)
    .component('inspecCotizacionesDetalle', {
      templateUrl: '/inspec/app/components/cotizaciones/cotizaciones/cotizacion-detalle/cotizacion-detalle.html',
      controller: 'CotizacionesDetalleController',
      controllerAs: '$ctrl'
    })
    .filter('percentage', [
      '$filter',
      function($filter) {
        return function(input) {
          if (!ng.isUndefined(input)) {
            return $filter('number')(input) + '%';
          }
        };
      }
    ]);
});
