'use strict';

define([
  'angular'// , 'CommonCboService'
], function(ng) {

  /**
   *  cbo-ramos en: comisiones/ramo-cliente, polizas/polizas, renovaciones/renovaciones
   */
  CboRamosController.$inject = ['CommonCboService', '$rootScope'];

  function CboRamosController(CommonCboService, $rootScope) {
    var vm = this;
    vm.$onInit = onInit;
    vm.getListRamo = getListRamo;

    function onInit() {
      $rootScope.sector = vm.sector;
      vm.getListRamo();
    }

    $rootScope.$watch('sector' ,function() {
      vm.sector = $rootScope.sector;
      vm.getListRamo();
    },true);


    function getListRamo() {
      CommonCboService.getListRamo(vm.sector, false).then(function glrPr(req) {
        vm.lstRamos = req.data;
      });
    }

    vm.selectTypeRamo = function(value) {
      vm.data = value;
    };

  }

  var gcwCboRamos = {
    templateUrl: '/gcw/app/common/common-cbos/cbo-ramos.html',
    controller: 'CboRamosController as $ramoCtrl',
    bindings: {
      ramo: '='
    }
  };

  /**
   *  cbo-sectores en: polizas/polizas, renovaciones/renovaciones
   */
  CboSectoresController.$inject = ['CommonCboService', '$rootScope'];

  function CboSectoresController(CommonCboService, $rootScope) {
    var vm = this;
    vm.$onInit = onInit;
    vm.selectTypeSector = selectTypeSector;

    function onInit() {
      CommonCboService.getListSector(false).then(function glsPr(req) {
        vm.lstSectores = req.data;
      });
    }

    function selectTypeSector(value) {
      vm.data = value;
      if (angular.isUndefined(typeof value))
      {$rootScope.sector = null;}
      else
      {$rootScope.sector = value.code;}
    }
  }

  var gcwCboSectores = {
    templateUrl: '/gcw/app/common/common-cbos/cbo-sectores.html',
    controller: 'CboSectoresController as $sectorCtrl',
    bindings: {
      sector: '='
    }
  };

  /**
   * cbo-tipo-cliente en: auto-reemplazo/auto-reemplazo
   */
  CboTipoClienteController.$inject = ['CommonCboService'];

  function CboTipoClienteController(CommonCboService) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      CommonCboService.getTipoCliente(false).then(function glpPr(req) {
        vm.lstTipoCliente = req.data;
      });
    }

    vm.selectTypeClient = function(value) {
      vm.data = value;
    };
  }

  var gcwCboTipoCliente = {
    templateUrl: '/gcw/app/common/common-cbos/cbo-tipo-cliente.html',
    controller: 'CboTipoClienteController as $ctrl',
    bindings: {
      data: '='
    }
  };

  /**
   *  cbo-estados en: comisiones/ganadas, polizas, siniestros-autos
   */
  CboEstadosController.$inject = ['CommonCboService'];

  function CboEstadosController(CommonCboService) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      // TODO: colocar el llamado al servicio
      CommonCboService.getListStatusPolicy(false).then(function glpPr(req) {
        vm.lstEstados = req.data;
      });
    }

    vm.selectTypeState = function(value) {
      vm.data = value;
    };
  }

  var gcwCboEstados = {
    templateUrl: '/gcw/app/common/common-cbos/cbo-estados.html',
    controller: 'CboEstadosController as $estadoCtrl',
    bindings: {
      estado: '='
    }
  };

  /**
   *  cbo-tipo-monedas en: comisiones/movimientos, comisiones/por-ganar, cobranzas/liquidacion-soat-historial
   */
  CboTipoMonedasController.$inject = ['CommonCboService'];

  function CboTipoMonedasController(CommonCboService) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      // TODO: colocar el llamado al servicio
    }
  }

  var gcwCboTipoMonedas = {
    templateUrl: '/gcw/app/common/common-cbos/cbo-tipo-monedas.html',
    controller: 'CboTipoMonedasController as $moneda'
  };

  /**
   *  cbo-tipo-doc-entidad en: componente cliente
   *  ruc, dni, etc..
   */
  CboTipoDocEntidadController.$inject = ['CommonCboService', '$scope'];

  function CboTipoDocEntidadController(CommonCboService, $scope) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      CommonCboService.getDocumentType(false).then(function glpPr(req) {
        vm.lstTipoDocEntidad = req.data;
      });
    }

    vm.selectTypeDoc = function(value) {
      vm.data = value;
    };
  }

  var gcwCboTipoDocEntidad = {
    templateUrl: '/gcw/app/common/common-cbos/cbo-tipo-doc-entidad.html',
    controller: 'CboTipoDocEntidadController as $docEntidad',
    bindings: {
      data: '='
    }
  };

  /**
   * cbo-doc-pago en: comisiones/constancia-detraccion
   */
  CboDocPagoController.$inject = ['CommonCboService'];

  function CboDocPagoController(CommonCboService) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      // TODO: colocar el llamado al servicio
    }
  }

  var gcwCboDocPago = {
    templateUrl: '/gcw/app/common/common-cbos/cbo-doc-pago.html',
    controller: 'CboDocPagoController as $docPago'
  };

  /**
   * cbo-desde en: cobranzas/anuladas
   */
  CboDesdeController.$inject = ['CommonCboService'];

  function CboDesdeController(CommonCboService) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      // TODO: colocar el llamado al servicio
      CommonCboService.getRangoDesde().then(function glpPr(req) {
        vm.lstDesde = req.data;
      });
    }

    vm.selectTypeState = function(value) {
      vm.desde = value;
    };
  }

  var gcwCboDesde = {
    templateUrl: '/gcw/app/common/common-cbos/cbo-desde.html',
    controller: 'CboDesdeController as $desde',
    bindings: {
      desde: '='
    }
  };

  /**
   * cbo-situacion en: cobranzas/documentos-pagar
   */
  CboSituacionController.$inject = ['CommonCboService', '$rootScope'];

  function CboSituacionController(CommonCboService, $rootScope) {
    var vm = this;
    vm.$onInit = onInit;

    vm.getListSituation = getListSituation;

    function onInit() {
      $rootScope.sector = vm.sector;
      vm.getListSituation();
    }

    $rootScope.$watch('sector' ,function() {
      vm.sector = $rootScope.sector;
      vm.getListSituation();
    },true);

    function getListSituation() {
      CommonCboService.getListSituation(false).then(function glrPr(req) {
        vm.lstSituaciones = req.data;
      });
    }

    vm.selectTypeSituacion = function(value) {
      vm.data = value;
    };
  }

  var gcwCboSituacion = {
    templateUrl: '/gcw/app/common/common-cbos/cbo-situacion.html',
    controller: 'CboSituacionController as $situacionCtrl',
    bindings: {
      situacion: '='
    }
  };

  /**
   * cbo-tipo-doc en: cobranzas/estado-documento
   */
  CboTipoDocController.$inject = ['CommonCboService', '$rootScope'];

  function CboTipoDocController(CommonCboService, $rootScope) {
    var vm = this;
    vm.$onInit = onInit;

    vm.getTipoDocumentos = getTipoDocumentos;

    function onInit() {
      $rootScope.sector = vm.sector;
      vm.getTipoDocumentos();
    }

    function getTipoDocumentos() {
      CommonCboService.getDocumentTypePolicy().then(function glrPr(req) {
        vm.lstTipoDocumentos = req.data;
      });
    }

    vm.selectDocumentTypePolicy = function(value) {
      vm.data = value;
    };
  }

  var gcwCboTipoDoc = {
    templateUrl: '/gcw/app/common/common-cbos/cbo-tipo-doc.html',
    controller: 'CboTipoDocController as $tipoDocCtrl',
    bindings: {
      documento: '='
    }
  };

  /**
   * cbo-tipo-polizas en: cobranzas/liquidacion-soat
   */
  CboTipoPolizasController.$inject = ['CommonCboService'];

  function CboTipoPolizasController(CommonCboService) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      // TODO: colocar el llamado al servicio
      CommonCboService.getListTipoPoliza().then(function glpPr(req) {
        vm.lstTipoPoliza = req.data;
      });
    }

    vm.selectTypeState = function(value) {
      vm.data = value;
    };
  }

  var gcwCboTipoPolizas = {
    templateUrl: '/gcw/app/common/common-cbos/cbo-tipo-polizas.html',
    controller: 'CboTipoPolizasController as $tipoPoliza',
    bindings: {
      tPoliza: '='
    }
  };

  /**
   * cbo-segmentos-comerciales en: mapfre-dolar/mapfre-dolar
   */
  CboSegmentosComercialesController.$inject = ['CommonCboService'];

  function CboSegmentosComercialesController(CommonCboService) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      // TODO: colocar el llamado al servicio
    }
  }

  var gcwCboSegmentosComerciales = {
    templateUrl: '/gcw/app/common/common-cbos/cbo-segmentos-comerciales.html',
    controller: 'CboSegmentosComercialesController as $comercial'
  };

  /**
   * cbo-estados-ccc en: renovaciones/renovaciones
   */
  CboEstadosCCCController.$inject = ['CommonCboService'];

  function CboEstadosCCCController(CommonCboService) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      // TODO: colocar el llamado al servicio
    }
  }

  var gcwCboEstadosCCC = {
    templateUrl: '/gcw/app/common/common-cbos/cbo-estados-ccc.html',
    controller: 'CboEstadosCCCController as $estadoccc',
    bindings: {
      edoCCC: '='
    }
  };

  /**
   * cbo-estados-renovacion en: renovaciones/renovaciones
   */
  CboEstadosRenovacionController.$inject = ['CommonCboService'];

  function CboEstadosRenovacionController(CommonCboService) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      // TODO: colocar el llamado al servicio
    }
  }

  var gcwCboEstadosRenovacion = {
    templateUrl: '/gcw/app/common/common-cbos/cbo-estados-renovacion.html',
    controller: 'CboEstadosRenovacionController as $estadoRenova',
    bindings: {
      edoRenovacion: '='
    }
  };

  /**
   * cbo-estados-reeplazo en: auto-reemplazo/auto-reemplazo
   */
  CboEstadosReemplazoController.$inject = ['CommonCboService'];

  function CboEstadosReemplazoController(CommonCboService) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      CommonCboService.getReplacementCarStatus(false).then(function glpPr(req) {
        vm.lstEstados = req.data;
      });
    }

    vm.selectTypeState = function(value) {
      vm.data = value;
    };
  }

  var gcwCboEstadosReemplazo = {
    templateUrl: '/gcw/app/common/common-cbos/cbo-estados-reemplazo.html',
    controller: 'CboEstadosReemplazoController as $ctrl',
    bindings: {
      data: '='
    }
  };

  /**
   * cbo-estados-reemplazo en: auto-reemplazo/proveedor
   */
  CboEstadosGeneralController.$inject = ['CommonCboService'];

  function CboEstadosGeneralController(CommonCboService) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      CommonCboService.getLookupGeneralStatus(false).then(function glpPr(req) {
        vm.lstEstados = req.data;
      });
    }

    vm.selectTypeState = function(value) {
      vm.data = value;
    };
  }

  var gcwCboEstadosGeneral = {
    templateUrl: '/gcw/app/common/common-cbos/cbo-estados-general.html',
    controller: 'CboEstadosGeneralController as $ctrl',
    bindings: {
      data: '=',
      notAll: '='
    }
  };

  /**
   * cbo-proveedor en: auto-reemplazo/proveedor
   */
  CboProveedoresController.$inject = ['CommonCboService'];

  function CboProveedoresController(CommonCboService) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      CommonCboService.getProvidersRequests(false).then(function glpPr(req) {
        vm.lstProveedores = req.data;
      });
    }

    vm.selectTypeState = function(value) {
      vm.data = value;
    };
  }

  var gcwCboProveedores = {
    templateUrl: '/gcw/app/common/common-cbos/cbo-proveedores.html',
    controller: 'CboProveedoresController as $ctrl',
    bindings: {
      data: '='
    }
  };

  return ng.module('appGcw')
    .controller('CboRamosController', CboRamosController)
    .component('gcwCboRamos', gcwCboRamos)
    .controller('CboSectoresController', CboSectoresController)
    .component('gcwCboSectores', gcwCboSectores)
    .controller('CboTipoClienteController', CboTipoClienteController)
    .component('gcwCboTipoCliente', gcwCboTipoCliente)
    .controller('CboEstadosController', CboEstadosController)
    .component('gcwCboEstados', gcwCboEstados)
    .controller('CboTipoMonedasController', CboTipoMonedasController)
    .component('gcwCboTipoMonedas', gcwCboTipoMonedas)
    .controller('CboTipoDocEntidadController', CboTipoDocEntidadController)
    .component('gcwCboTipoDocEntidad', gcwCboTipoDocEntidad)
    .controller('CboDocPagoController', CboDocPagoController)
    .component('gcwCboDocPago', gcwCboDocPago)
    .controller('CboDesdeController', CboDesdeController)
    .component('gcwCboDesde', gcwCboDesde)
    .controller('CboSituacionController', CboSituacionController)
    .component('gcwCboSituacion', gcwCboSituacion)
    .controller('CboTipoDocController', CboTipoDocController)
    .component('gcwCboTipoDoc', gcwCboTipoDoc)
    .controller('CboTipoPolizasController', CboTipoPolizasController)
    .component('gcwCboTipoPolizas', gcwCboTipoPolizas)
    .controller('CboSegmentosComercialesController', CboSegmentosComercialesController)
    .component('gcwCboSegmentosComerciales', gcwCboSegmentosComerciales)
    .controller('CboEstadosCCCController', CboEstadosCCCController)
    .component('gcwCboEstadosCCC', gcwCboEstadosCCC)
    .controller('CboEstadosRenovacionController', CboEstadosRenovacionController)
    .component('gcwCboEstadosRenovacion', gcwCboEstadosRenovacion)
    .controller('CboEstadosReemplazoController', CboEstadosReemplazoController)
    .component('gcwCboEstadosReemplazo', gcwCboEstadosReemplazo)
    .controller('CboEstadosGeneralController', CboEstadosGeneralController)
    .component('gcwCboEstadosGeneral', gcwCboEstadosGeneral)
    .controller('CboProveedoresController', CboProveedoresController)
    .component('gcwCboProveedores', gcwCboProveedores);
});
