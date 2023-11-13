'use strict';
/* eslint-disable new-cap */

define(['angular', 'lodash', 'wpConstant'], function(ng, _, wpConstant) {
  var wpCboCommonSetting = {
    templateUrl: '/webproc/app/components/detalle-asistencia/common/common-cbos/cbo-common.html',
    bindings: {
      cboLista: '=?',
      label: '=?',
      name: '@?',
      ngChange: '&?',
      ngDisabled: '=?',
      ngModel: '=?',
      optionDefault: '=?',
      setModelByThisKey: '=?',
      setCodeTipoSiniestro : '=?',
      setModelByThisText: '=?',
      txtField: '@?',
      valueField: '@?'
    }
  };

  // CBO: departamento
  CboDepartamentoController.$inject = ['wpFactory', '$log', '$scope'];
  function CboDepartamentoController(wpFactory, $log, $scope) {
    var vm = this;
    var watchModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'descripcion';
      vm.valueField = vm.valueField || 'id';
      vm.cboLista = wpFactory.myLookup.getDepartamentos();
      _.keys(vm.cboLista).length ? setModel() : getDepasFromServer();
      watcherModel();
    }

    function onDestroy() {
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = nv.id;
          vm.setModelByThisText = nv.descripcion;
        }
      });
    }

    function setModel() {
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
    }

    function getDepasFromServer() {
      wpFactory.ubigeo
        .GetDepartaments(false)
        .then(function gcbRPrFn(resp) {
          vm.cboLista = resp;
          wpFactory.myLookup.setDepartamentos(vm.cboLista);
          setModel();
        })
        .catch(function gctEPrFn(err) {
          vm.cboLista = [];
          $log.error('Falló al obtener departamentos', err);
        });
    }
  }

  var wpCboDepartamento = ng.extend({}, wpCboCommonSetting, {
    controller: 'CboDepartamentoController'
  });

  // CBO: provincia
  CboProvinciaController.$inject = ['wpFactory', '$log', '$scope'];
  function CboProvinciaController(wpFactory, $log, $scope) {
    var vm = this;
    var watchUbigeoDepa, watchModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'descripcion';
      vm.valueField = vm.valueField || 'id';
      watcherDepa();
      watcherModel();
    }

    function onDestroy() {
      watchUbigeoDepa();
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.id', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = nv;
          vm.setModelByThisText = vm.ngModel.descripcion;
        }
      });
    }

    function watcherDepa() {
      watchUbigeoDepa = $scope.$watch('$ctrl.depa.id', function(nv) {
        getLista(nv);
      });
    }

    function setModel() {
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey || vm.prov );
    }

    function getLista(depaId) {
      vm.ngModel = {};
      vm.cboLista = [];
      if (!depaId) return void 0;
      wpFactory.ubigeo
        .GetProvinces(depaId, false)
        .then(function gcbRPrFn(resp) {
          vm.cboLista = resp;
          setModel();
        })
        .catch(function gctEPrFn(err) {
          vm.cboLista = [];
          $log.error('Falló el obtener provincias', err);
        });
    }
  }
  // HACK: uso de merge para poder combinar el obj binding
  var wpCboProvincia = _.merge({}, wpCboCommonSetting, {
    controller: 'CboProvinciaController',
    bindings: {
      depa: '=?',
      prov: '=?'
    }
  });

  // CBO: distrito y distrito de la comisaria
  CboDistritoController.$inject = ['wpFactory', '$scope', '$log'];
  function CboDistritoController(wpFactory, $scope, $log) {
    var vm = this;
    var watchCodDepa, watchCodProv, watchModel;
    var objUbigeo = {};
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'descripcion';
      vm.valueField = vm.valueField || 'id';
      watcherDepa();
      watcherProv();
      watcherModel();
    }

    function onDestroy() {
      watchCodDepa();
      watchCodProv();
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.id', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = nv;
          vm.setModelByThisText = vm.ngModel.descripcion;
        }
      });
    }

    function watcherDepa() {
      watchCodDepa = $scope.$watch('$ctrl.depa.id', function(nv) {
        objUbigeo = ng.extend({}, objUbigeo, {depa: nv});
      });
    }

    function watcherProv() {
      watchCodProv = $scope.$watch('$ctrl.prov.id', function(nv) {
        getLista({prov: nv});
      });
    }

    function setModel() {
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey || vm.dist);
    }

    function getLista(objLugar) {
      vm.ngModel = {};
      vm.cboLista = [];
      objUbigeo = ng.extend({}, objUbigeo, objLugar);
      var depa = objUbigeo.depa;
      var prov = objUbigeo.prov;
      if (!depa) return void 0;
      if (!prov) return void 0;
      wpFactory.ubigeo
        .GetDistricts(depa, prov)
        .then(function gcbRPrFn(resp) {
          vm.cboLista = resp;
          setModel();
        })
        .catch(function gctEPrFn(err) {
          vm.cboLista = [];
          $log.error('Falló el obtener distritos', err);
        });
    }
  }
  // HACK: uso de merge para poder combinar el obj binding
  var wpCboDistrito = _.merge({}, wpCboCommonSetting, {
    controller: 'CboDistritoController',
    bindings: {
      depa: '<?',
      prov: '<?',
      dist: '<?'
    }
  });

  // CBO: tipo lesion
  CboTipoLesionController.$inject = ['wpFactory', '$scope'];
  function CboTipoLesionController(wpFactory, $scope) {
    var vm = this;
    var watchModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'nombreValor';
      vm.valueField = vm.valueField || 'codigoValor';
      vm.cboLista = [].concat({codigoValor: '0', nombreValor: 'Sin Lesión'}, wpFactory.myLookup.getTipoLesion());
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
      watcherModel();
    }

    function onDestroy() {
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.codigoValor', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = nv;
        }
      });
    }
  }

  var wpCboTipoLesion = ng.extend({}, wpCboCommonSetting, {
    controller: 'CboTipoLesionController'
  });

  // CBO: nivel daño
  CboNivelDanhoController.$inject = ['wpFactory', '$scope'];
  function CboNivelDanhoController(wpFactory, $scope) {
    var vm = this;
    var watchModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'descripcionParametro';
      vm.valueField = vm.valueField || 'valor1';
      vm.cboLista = wpFactory.myLookup.getNivelDanho();
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
      watcherModel();
    }

    function onDestroy() {
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.valor1', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = nv;
        }
      });
    }
  }

  var wpCboNivelDanho = ng.extend({}, wpCboCommonSetting, {
    controller: 'CboNivelDanhoController'
  });

  // CBO: tipo vehiculo
  CboTipoVehiculoController.$inject = ['wpFactory', '$scope'];
  function CboTipoVehiculoController(wpFactory, $scope) {
    var vm = this;
    var watchModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'nombreValor';
      vm.valueField = vm.valueField || 'codigoValor';
      vm.cboLista = wpFactory.myLookup.getCarTypes();
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
      watcherModel();
    }

    function onDestroy() {
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.codigoValor', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = nv;
          vm.setModelByThisText = vm.ngModel ? vm.ngModel.nombreValor : null;
        }
      });
    }
  }

  var wpCboTipoVehiculo = ng.extend({}, wpCboCommonSetting, {
    controller: 'CboTipoVehiculoController'
  });

  // CBO: soat & asegurado en
  CboSoatController.$inject = ['wpFactory', '$scope'];
  function CboSoatController(wpFactory, $scope) {
    var vm = this;
    var watchModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'nombreValor';
      vm.valueField = vm.valueField || 'codigoValor';
      vm.cboLista = wpFactory.myLookup.getTipoSoat();
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
      watcherModel();
    }

    function onDestroy() {
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.codigoValor', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = nv;
          vm.setModelByThisText = vm.ngModel ? vm.ngModel.nombreValor : null;
        }
      });
    }
  }

  var wpCboSoat = ng.extend({}, wpCboCommonSetting, {
    controller: 'CboSoatController'
  });

  // CBO: tipo licencia
  CboTipoLicenciaController.$inject = ['wpFactory', '$scope'];
  function CboTipoLicenciaController(wpFactory, $scope) {
    var vm = this;
    var watchModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'nombreValor';
      vm.valueField = vm.valueField || 'codigoValor';
      vm.cboLista = wpFactory.myLookup.getTipoLicencia();
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
      watcherModel();
    }

    function onDestroy() {
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.codigoValor', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = nv;
        }
      });
    }
  }

  var wpCboTipoLicencia = ng.extend({}, wpCboCommonSetting, {
    controller: 'CboTipoLicenciaController'
  });

  // CBO: año
  CboAnhoController.$inject = ['wpFactory', '$scope', '$log'];
  function CboAnhoController(wpFactory, $scope, $log) {
    var vm = this;
    var watchCodigoMarca, watchCodigoModelo, watchModel;
    var objMarcaModelo = {};
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'nombreValor';
      vm.valueField = vm.valueField || 'codigoValor';
      watcherMarca();
      watcherModelo();
      watcherModel();
    }

    function onDestroy() {
      watchCodigoMarca();
      watchCodigoModelo();
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.codigoValor', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = +(nv || 0);
        }
      });
    }

    function watcherMarca() {
      watchCodigoMarca = $scope.$watch('$ctrl.marca.codigoValor', function(nv) {
        objMarcaModelo = ng.extend({}, objMarcaModelo, {marca: nv});
      });
    }

    function watcherModelo() {
      watchCodigoModelo = $scope.$watch('$ctrl.modelo.codigoValor', function(nv) {
        getYear({modelo: nv});
      });
    }

    function getYear(obj) {
      vm.cboLista = [];
      vm.ngModel = {};
      objMarcaModelo = ng.extend({}, objMarcaModelo, obj);
      var codMarca = objMarcaModelo.marca;
      var codModelo = objMarcaModelo.modelo;
      if (!codMarca) return void 0;
      if (!codModelo) return void 0;
      wpFactory.lookup
        .GetCarYearsByModelAndBrand(codModelo, codMarca)
        .then(function gcbRPrFn(resp) {
          vm.cboLista = resp;
          vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
        })
        .catch(function gctEPrFn(err) {
          vm.cboLista = [];
          $log.error('Falló el obtener anhos', err);
        });
    }
  }
  // HACK: uso de merge para poder combinar el obj binding
  var wpCboAnho = _.merge({}, wpCboCommonSetting, {
    controller: 'CboAnhoController',
    bindings: {
      marca: '=?',
      modelo: '=?'
    }
  });

  /**
   * Tab 1: datos generales
   */

  // CBO: tipo via
  CboTipoViaController.$inject = ['wpFactory', '$scope'];
  function CboTipoViaController(wpFactory, $scope) {
    var vm = this;
    var watchModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'nombreValor';
      vm.valueField = vm.valueField || 'codigoValor';
      vm.cboLista = wpFactory.myLookup.getTipoVia();
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
      watcherModel();
    }

    function onDestroy() {
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.codigoValor', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = nv;
        }
      });
    }
  }

  var wpCboTipoVia = ng.extend({}, wpCboCommonSetting, {
    controller: 'CboTipoViaController'
  });

  // CBO: tipo siniestro
  CboTipoSiniestroController.$inject = ['wpFactory', '$scope'];
  function CboTipoSiniestroController(wpFactory, $scope) {
    var vm = this;
    var watchModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'nombreValor';
      vm.valueField = vm.valueField || 'codigoValor';
      vm.cboLista = wpFactory.myLookup.getTipoSiniestro();
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
      watcherModel();
    }

    function onDestroy() {
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.codigoValor', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = (nv || 0) + '';
          vm.setModelByThisText = vm.ngModel ? vm.ngModel.nombreValor : null;
        }
      });
    }
  }

  var wpCboTipoSiniestro = ng.extend({}, wpCboCommonSetting, {
    controller: 'CboTipoSiniestroController'
  });

  // CBO lugar de atencion
  CboLugarAtencionController.$inject = ['wpFactory', '$scope'];
  function CboLugarAtencionController(wpFactory, $scope) {
    var vm = this;
    var watchModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'nombreValor';
      vm.valueField = vm.valueField || 'codigoValor';
      vm.cboLista = wpFactory.myLookup.getLugarAtencionAsistencia();
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
      watcherModel();
    }

    function onDestroy() {
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.codigoValor', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = (nv || '') + '';
        }
      });
    }
  }

  var wpCboLugarAtencion = ng.extend({}, wpCboCommonSetting, {
    controller: 'CboLugarAtencionController'
  });

  // CBO comisaria
  CboComisariaController.$inject = ['wpFactory', '$log', '$scope'];
  function CboComisariaController(wpFactory, $log, $scope) {
    var vm = this;
    var watchCodDepa, watchCodProv, watchCodDist, watchModel;
    var objUbigeo = {};
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'nombre';
      vm.valueField = vm.valueField || 'codigoComisaria';
      watcherDepa();
      watcherProv();
      watcherDist();
      watcherModel();
    }

    function onDestroy() {
      watchCodDepa();
      watchCodProv();
      watchCodDist();
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.codigoComisaria', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = nv;
        }
      });
    }

    function watcherDepa() {
      watchCodDepa = $scope.$watch('$ctrl.depa', function(nv) {
        objUbigeo = ng.extend({}, objUbigeo, {depa: nv});
      });
    }

    function watcherProv() {
      watchCodProv = $scope.$watch('$ctrl.prov', function(nv) {
        getLista({prov: nv});
      });
    }

    function watcherDist() {
      watchCodDist = $scope.$watch('$ctrl.dist', function(nv) {
        getLista({dist: nv});
      });
    }

    function setModel() {
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
    }

    function getLista(objLugar) {
      vm.ngModel = {};
      vm.cboLista = [];
      objUbigeo = ng.extend({}, objUbigeo, objLugar);
      var depa = objUbigeo.depa;
      var prov = objUbigeo.prov;
      var dist = objUbigeo.dist;
      if (!depa) return void 0;
      if (!prov) return void 0;
      if (!dist) return void 0;

      wpFactory.police
        .GetPoliceStationByUbigeo(dist, true, depa, prov)
        .then(function gcbRPrFn(resp) {
          vm.array({
            array : resp
          })
          vm.cboLista = resp;
          setModel();
        })
        .catch(function gctEPrFn(err) {
          vm.cboLista = [];
          $log.error('Falló el obtener comisarías', err);
        });
    }
  }

  var wpCboComisaria = _.merge({}, wpCboCommonSetting, {
    controller: 'CboComisariaController',
    bindings: {
      depa: '<?',
      dist: '<?',
      prov: '<?',
      array: '&?'
    }
  });

  /**
   * Tab 2: conductor ocupantes
   */

  // CBO: relacion conductor asegurado
  CboRelacionCoAseController.$inject = ['wpFactory', '$scope'];
  function CboRelacionCoAseController(wpFactory, $scope) {
    var vm = this;
    var watchModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'nombreValor';
      vm.valueField = vm.valueField || 'codigoValor';
      vm.cboLista = wpFactory.myLookup.getTipoRelacion();
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
      vm.setModelByThisKey = (vm.setModelByThisKey || 0) + '';
      watcherModel();
    }

    function onDestroy() {
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.codigoValor', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = (nv || 0) + '';
        }
      });
    }
  }

  var wpCboRelacionCoAse = ng.extend({}, wpCboCommonSetting, {
    controller: 'CboRelacionCoAseController'
  });

  // CBO: nivel academico
  CboNivelAcademicoController.$inject = ['wpFactory', '$scope'];
  function CboNivelAcademicoController(wpFactory, $scope) {
    var vm = this;
    var watchModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'nombreValor';
      vm.valueField = vm.valueField || 'codigoValor';
      vm.cboLista = wpFactory.myLookup.getNivelEducativo();
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
      watcherModel();
    }

    function onDestroy() {
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.codigoValor', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = nv;
        }
      });
    }
  }

  var wpCboNivelAcademico = ng.extend({}, wpCboCommonSetting, {
    controller: 'CboNivelAcademicoController'
  });

  /**
   * Tab 3: vehiculo
   */

  // CBO: taller
  CboTallerController.$inject = ['wpFactory', '$scope'];
  function CboTallerController(wpFactory, $scope) {
    var vm = this;
    var watchCodDepa, watchCodProv, watchCodDist, watchModel, watchFrom;
    var objUbigeo = {};
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'nombre';
      vm.valueField = vm.valueField || 'codigoTaller';
      if (vm.showAll) {
        vm.cboLista = wpFactory.myLookup.getAllTalleres();
        setModel();
      } else {
        getLista({
          depa: vm.depa,
          prov: vm.prov,
          dist: vm.dist
        });
      }
      watcherDepa();
      watcherProv();
      watcherDist();
      watcherModel();
      watcherFrom();
    }

    function onDestroy() {
      watchCodDepa();
      watchCodProv();
      watchCodDist();
      watchModel();
      watchFrom();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.codigoTaller', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = nv;
        }
      });
    }

    function watcherDepa() {
      watchCodDepa = $scope.$watch('$ctrl.depa', function(nv, ov) {
        if (nv !== ov) {
          getLista({depa: nv});
        }
      });
    }

    function watcherProv() {
      watchCodProv = $scope.$watch('$ctrl.prov', function(nv, ov) {
        if (nv !== ov) {
          getLista({prov: nv});
        }
      });
    }

    function watcherDist() {
      watchCodDist = $scope.$watch('$ctrl.dist', function(nv, ov) {
        if (nv !== ov) {
          getLista({dist: nv});
        }
      });
    }

    function watcherFrom() {
      watchFrom = $scope.$watch('$ctrl.from', function(nv, ov) {
        if (nv !== ov) {
          getLista();
        }
      });
    }

    function setModel() {
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
    }

    function getLista(objLugar) {
      var arrTalleres;
      vm.ngModel = {};
      vm.cboLista = [];
      objUbigeo = ng.extend({}, objUbigeo, objLugar);
      if (!objUbigeo.depa) return void 0;
      if (!objUbigeo.prov) return void 0;
      if (!objUbigeo.dist) return void 0;

      arrTalleres = vm.from === 'A' ? wpFactory.myLookup.getTalleresAfiliados() : wpFactory.myLookup.getAllTalleres();
      vm.cboLista = wpFactory.myLookup.getTalleresByUbigeo(arrTalleres, objUbigeo.depa, objUbigeo.prov, objUbigeo.dist);
      setModel();
    }
  }
  // HACK: uso de merge para poder combinar el obj binding
  var wpCboTaller = _.merge({}, wpCboCommonSetting, {
    controller: 'CboTallerController',
    bindings: {
      depa: '<?',
      dist: '<?',
      from: '<?',
      prov: '<?',
      showAll: '<?'
    }
  });

  // CBO: direccion taller
  CboDireccionTallerController.$inject = ['wpFactory', '$scope', '$log'];
  function CboDireccionTallerController(wpFactory, $scope, $log) {
    var vm = this;
    var watchCodigoTaller, watchModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'descripcion';
      vm.valueField = vm.valueField || 'codigoLocal';
      watcherTaller();
      watcherModel();
    }

    function onDestroy() {
      watchCodigoTaller();
      watchModel();
    }

    function watcherTaller() {
      watchCodigoTaller = $scope.$watch('$ctrl.taller.codigoTaller', function(nv) {
        getLista(nv);
      });
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.codigoLocal', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = nv;
        }
      });
    }

    function setModel() {
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
    }

    function getLista(codeTaller) {
      vm.ngModel = {};
      vm.cboLista = [];
      if (!codeTaller) return void 0;

      wpFactory.car
        .GetBranchsByRepairShop(codeTaller)
        .then(function gcbRPrFn(resp) {
          vm.cboLista = resp;
          setModel();
        })
        .catch(function gctEPrFn(err) {
          vm.cboLista = [];
          $log.error('Falló el obtener dirección taller', err);
        });
    }
  }
  // HACK: uso de merge para poder combinar el obj binding
  var wpCboDireccionTaller = _.merge({}, wpCboCommonSetting, {
    controller: 'CboDireccionTallerController',
    bindings: {
      taller: '<?'
    }
  });

  // CBO: zona del daño
  CboZonaDanhoController.$inject = ['wpFactory', '$scope'];
  function CboZonaDanhoController(wpFactory, $scope) {
    var vm = this;
    var watchModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'nombreValor';
      vm.valueField = vm.valueField || 'codigoValor';
      vm.cboLista = wpFactory.myLookup.getZonaDanho();
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
      watcherModel();
    }

    function onDestroy() {
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.codigoValor', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = nv;
        }
      });
    }
  }

  var wpCboZonaDanho = ng.extend({}, wpCboCommonSetting, {
    controller: 'CboZonaDanhoController'
  });

  // CBO: Convenio
  CboConvenioController.$inject = ['wpFactory', '$scope'];
  function CboConvenioController(wpFactory, $scope) {
    var vm = this;
    var watchModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'nombreValorDetalle';
      vm.valueField = vm.valueField || 'codigoValor';
      vm.cboLista = wpFactory.myLookup.getConvenio();
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
      watcherModel();
    }

    function onDestroy() {
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.codigoValor', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = nv;
        }
      });
    }
  }

  var wpCboConvenio = ng.extend({}, wpCboCommonSetting, {
    controller: 'CboConvenioController'
  });

  // CBO: Compañia de seguros
  CboCompaniaSeguroController.$inject = ['wpFactory', '$scope'];
  function CboCompaniaSeguroController(wpFactory, $scope) {
    var vm = this;
    var watchModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'nombreValorDetalle';
      vm.valueField = vm.valueField || 'codigoValor';
      vm.cboLista = wpFactory.myLookup.getCompaniaSeguro();
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
      watcherModel();
    }

    function onDestroy() {
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.codigoValor', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = nv;
        }
      });
    }
  }

  var wpCboCompaniaSeguro = ng.extend({}, wpCboCommonSetting, {
    controller: 'CboCompaniaSeguroController'
  });

  // CBO: parte del daño
  CboParteDanhoController.$inject = ['wpFactory', '$log', '$scope'];
  function CboParteDanhoController(wpFactory, $log, $scope) {
    var vm = this;
    var watchCodigoZona, watchModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'descripcionParteAfectada';
      vm.valueField = vm.valueField || 'codigoParteAfectada';
      watcherZona();
      watcherModel();
    }

    function onDestroy() {
      watchCodigoZona();
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.codigoParteAfectada', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = nv;
        }
      });
    }

    function watcherZona() {
      watchCodigoZona = $scope.$watch('$ctrl.zona.codigoValor', function(nv) {
        getLista(nv);
      });
    }

    function setModel() {
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
    }

    // TODO: cuando backend modifique el proxy y el nombre del metodo, actualizarlo
    function getLista(codigoZona) {
      if (!codigoZona) return void 0;
      wpFactory.siniestro
        .GetCarBrands(codigoZona, true, true)
        .then(function gcbRPrFn(resp) {
          vm.cboLista = resp;
          setModel();
        })
        .catch(function gctEPrFn(err) {
          vm.cboLista = [];
          $log.error('Falló el obtener parte danhos', err);
        });
    }
  }

  var wpCboParteDanho = _.merge({}, wpCboCommonSetting, {
    controller: 'CboParteDanhoController',
    bindings: {
      zona: '=?'
    }
  });

  // CBO: tipo de daño
  CboTipoDanhoController.$inject = ['wpFactory', '$scope'];
  function CboTipoDanhoController(wpFactory, $scope) {
    var vm = this;
    var watchModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'descripcionParametro';
      vm.valueField = vm.valueField || 'valor1';
      vm.cboLista = wpFactory.myLookup.getTipoDanho();
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
      watcherModel();
    }

    function onDestroy() {
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.valor1', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = nv;
        }
      });
    }
  }

  var wpCboTipoDanho = ng.extend({}, wpCboCommonSetting, {
    controller: 'CboTipoDanhoController'
  });

  /**
   * Tab 4: terceros
   */

  // CBO: marca
  CboMarcaVehiculoController.$inject = ['wpFactory', '$scope'];
  function CboMarcaVehiculoController(wpFactory, $scope) {
    var vm = this;
    var watchModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'nombreValor';
      vm.valueField = vm.valueField || 'codigoValor';
      vm.cboLista = wpFactory.myLookup.getCarBrands();
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
      watcherModel();
    }

    function onDestroy() {
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.codigoValor', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = nv;
        }
      });
    }
  }

  var wpCboMarcaVehiculo = ng.extend({}, wpCboCommonSetting, {
    controller: 'CboMarcaVehiculoController'
  });

  // CBO: modelo
  CboModeloVehiculoController.$inject = ['wpFactory', '$log', '$scope'];
  function CboModeloVehiculoController(wpFactory, $log, $scope) {
    var vm = this;
    var watchCodigoMarca, watchModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'nombreValor';
      vm.valueField = vm.valueField || 'codigoValor';
      watcherMarca();
      watcherModel();
    }

    function onDestroy() {
      watchCodigoMarca();
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.codigoValor', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = +(nv || 0);
        }
      });
    }

    function watcherMarca() {
      watchCodigoMarca = $scope.$watch('$ctrl.marca.codigoValor', function(nv) {
        getLista(nv);
      });
    }

    function setModel() {
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
    }

    function getLista(codigoMarca) {
      vm.cboLista = [];
      vm.ngModel = {};
      if (!codigoMarca) return void 0;
      wpFactory.lookup
        .GetCarModelsByBrand(codigoMarca)
        .then(function gcbRPrFn(resp) {
          vm.cboLista = resp;
          setModel();
        })
        .catch(function gctEPrFn(err) {
          vm.cboLista = [];
          $log.error('Falló el obtener modelos', err);
        });
    }
  }
  // HACK: uso de merge para poder combinar el obj binding
  var wpCboModeloVehiculo = _.merge({}, wpCboCommonSetting, {
    controller: 'CboModeloVehiculoController',
    bindings: {
      marca: '=?'
    }
  });

  // CBO: uso del vehiculo
  CboUsoVehiculoController.$inject = ['wpFactory', '$scope'];
  function CboUsoVehiculoController(wpFactory, $scope) {
    var vm = this;
    var watchModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'nombreValor';
      vm.valueField = vm.valueField || 'codigoValor';
      vm.cboLista = wpFactory.myLookup.getCarTypesUse();
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
      watcherModel();
    }

    function onDestroy() {
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.codigoValor', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = nv;
        }
      });
    }
  }

  var wpCboUsoVehiculo = ng.extend({}, wpCboCommonSetting, {
    controller: 'CboUsoVehiculoController'
  });

  // CBO: tipo de documentos
  CboTipoDocumentosController.$inject = ['wpFactory', '$scope'];
  function CboTipoDocumentosController(wpFactory, $scope) {
    var vm = this;
    var watchModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'descripcionParametro';
      vm.valueField = vm.valueField || 'codigoParametro';
      vm.cboLista = wpFactory.myLookup.getTypeDocuments();
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
      watcherModel();
    }

    function onDestroy() {
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.codigoParametro', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = nv;
        }
      });
    }
  }

  var wpCboTipoDocumentos = ng.extend({}, wpCboCommonSetting, {
    controller: 'CboTipoDocumentosController'
  });

  // CBO: tipo de bien
  CboTipoBienController.$inject = ['wpFactory', '$scope'];
  function CboTipoBienController(wpFactory, $scope) {
    var vm = this;
    var watchModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'nombreValor';
      vm.valueField = vm.valueField || 'codigoValor';
      vm.cboLista = wpFactory.myLookup.getTipoBien();
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
      watcherModel();
    }

    function onDestroy() {
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.codigoValor', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = nv;
        }
      });
    }
  }

  var wpCboTipoBien = ng.extend({}, wpCboCommonSetting, {
    controller: 'CboTipoBienController'
  });

  /**
   * Tab 5: detalles siniestro
   */

  // CBO: responsabilidad
  CboResponsabilidadController.$inject = ['wpFactory', '$scope'];
  function CboResponsabilidadController(wpFactory, $scope) {
    var vm = this;
    var watchModel;
    var watchModel2;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'nombreValor';
      vm.valueField = vm.valueField || 'codigoValor';
      // TODO: back deberia tmb mandar ese obj
      setCombo(true);
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
      watcherModel();
    }

    function onDestroy() {
      watchModel();
    }

    function setCombo(showTercero) {
      vm.cboLista = wpFactory.myLookup.getCodResponsabilidad();
      if(!showTercero){
        vm.cboLista = _.filter(vm.cboLista,function (x) {
          return x.codigoValor != 2;
        })
      }
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.codigoValor', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = nv;
        }
      });
      watchModel2 = $scope.$watch('$ctrl.setCodeTipoSiniestro', function(nv, ov) {
        if (nv !== ov) {
          if(vm.setCodeTipoSiniestro  == 120){
            setCombo(false);
            vm.ngModel = {
              'codigoValor' : null
            }
          }
          else{
            setCombo(true);
          }
        }
      });

    }
  }

  var wpCboResponsabilidad = ng.extend({}, wpCboCommonSetting, {
    controller: 'CboResponsabilidadController'
  });

  /**
   * Tab 5: detalles siniestro
   */

  // CBO: responsabilidad
  CboMotivoInvesController.$inject = ['wpFactory', '$scope', '$log'];
  function CboMotivoInvesController(wpFactory, $scope, $log) {
    var vm = this;
    var watchModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      vm.txtField = vm.txtField || 'descripcionParametro';
      vm.valueField = vm.valueField || 'codigoParametro';
      vm.cboLista = wpFactory.myLookup.getMotivoInves();
      _.keys(vm.cboLista).length ? setModel() : getMotivosInvesFromServer();
      watcherModel();
    }

    function onDestroy() {
      watchModel();
    }

    function watcherModel() {
      watchModel = $scope.$watch('$ctrl.ngModel.codigoParametro', function(nv, ov) {
        if (nv !== ov) {
          vm.setModelByThisKey = nv;
        }
      });
    }

    function setModel() {
      vm.ngModel = wpFactory.help.seleccionarCombo(vm.cboLista, vm.valueField, vm.setModelByThisKey);
    }

    function getMotivosInvesFromServer() {
      wpFactory.siniestro
        .GetListParameterDetail(1)
        .then(function gcbRPrFn(resp) {
          vm.cboLista = resp;
          wpFactory.myLookup.setMotivoInves(resp);
          setModel();
        })
        .catch(function gctEPrFn(err) {
          vm.cboLista = [];
          $log.error('Falló al obtener motivos de investigación', err);
        });
    }
  }

  var wpCboMotivoInves = ng.extend({}, wpCboCommonSetting, {
    controller: 'CboMotivoInvesController'
  });
  
  return ng
    .module('appWp')
    .controller('CboDepartamentoController', CboDepartamentoController)
    .component('wpCboDepartamento', wpCboDepartamento)
    .controller('CboProvinciaController', CboProvinciaController)
    .component('wpCboProvincia', wpCboProvincia)
    .controller('CboDistritoController', CboDistritoController)
    .component('wpCboDistrito', wpCboDistrito)
    .controller('CboTipoLesionController', CboTipoLesionController)
    .component('wpCboTipoLesion', wpCboTipoLesion)
    .controller('CboNivelDanhoController', CboNivelDanhoController)
    .component('wpCboNivelDanho', wpCboNivelDanho)
    .controller('CboTipoVehiculoController', CboTipoVehiculoController)
    .component('wpCboTipoVehiculo', wpCboTipoVehiculo)
    .controller('CboSoatController', CboSoatController)
    .component('wpCboSoat', wpCboSoat)
    .controller('CboTipoLicenciaController', CboTipoLicenciaController)
    .component('wpCboTipoLicencia', wpCboTipoLicencia)
    .controller('CboAnhoController', CboAnhoController)
    .component('wpCboAnho', wpCboAnho)
    .controller('CboTipoViaController', CboTipoViaController)
    .component('wpCboTipoVia', wpCboTipoVia)
    .controller('CboTipoSiniestroController', CboTipoSiniestroController)
    .component('wpCboTipoSiniestro', wpCboTipoSiniestro)
    .controller('CboLugarAtencionController', CboLugarAtencionController)
    .component('wpCboLugarAtencion', wpCboLugarAtencion)
    .controller('CboComisariaController', CboComisariaController)
    .component('wpCboComisaria', wpCboComisaria)
    .controller('CboRelacionCoAseController', CboRelacionCoAseController)
    .component('wpCboRelacionCoAse', wpCboRelacionCoAse)
    .controller('CboNivelAcademicoController', CboNivelAcademicoController)
    .component('wpCboNivelAcademico', wpCboNivelAcademico)
    .controller('CboTallerController', CboTallerController)
    .component('wpCboTaller', wpCboTaller)
    .controller('CboDireccionTallerController', CboDireccionTallerController)
    .component('wpCboDireccionTaller', wpCboDireccionTaller)
    .controller('CboZonaDanhoController', CboZonaDanhoController)
    .component('wpCboZonaDanho', wpCboZonaDanho)
    .controller('CboConvenioController', CboConvenioController)
    .component('wpCboConvenio', wpCboConvenio)
    .controller('CboCompaniaSeguroController', CboCompaniaSeguroController)
    .component('wpCboCompaniaSeguro', wpCboCompaniaSeguro)
    .controller('CboParteDanhoController', CboParteDanhoController)
    .component('wpCboParteDanho', wpCboParteDanho)
    .controller('CboTipoDanhoController', CboTipoDanhoController)
    .component('wpCboTipoDanho', wpCboTipoDanho)
    .controller('CboMarcaVehiculoController', CboMarcaVehiculoController)
    .component('wpCboMarcaVehiculo', wpCboMarcaVehiculo)
    .controller('CboModeloVehiculoController', CboModeloVehiculoController)
    .component('wpCboModeloVehiculo', wpCboModeloVehiculo)
    .controller('CboUsoVehiculoController', CboUsoVehiculoController)
    .component('wpCboUsoVehiculo', wpCboUsoVehiculo)
    .controller('CboTipoDocumentosController', CboTipoDocumentosController)
    .component('wpCboTipoDocumentos', wpCboTipoDocumentos)
    .controller('CboTipoBienController', CboTipoBienController)
    .component('wpCboTipoBien', wpCboTipoBien)
    .controller('CboResponsabilidadController', CboResponsabilidadController)
    .component('wpCboResponsabilidad', wpCboResponsabilidad)
    .controller('CboMotivoInvesController', CboMotivoInvesController)
    .component('wpCboMotivoInves', wpCboMotivoInves)
});
