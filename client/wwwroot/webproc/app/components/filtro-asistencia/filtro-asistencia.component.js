'use strict';

define(['angular', 'lodash'], function(ng, _) {
  FiltroAsistenciaController.$inject = ['wpFactory', '$scope', 'mModalAlert', 'builderObject', '$log'];
  function FiltroAsistenciaController(wpFactory, $scope, mModalAlert, builderObject, $log) {
    var vm = this;
    var builderRequestCategory, builderRequestSubject, builderRequestTheme;

    vm.asuntoSeleccionado;
    vm.cargarAsuntos = cargarAsuntos;
    vm.cargarTemas = cargarTemas;
    vm.guardarAsuntos = guardarAsuntos;
    vm.guardarCategorias = guardarCategorias;
    vm.guardarTemas = guardarTemas;
    vm.$onInit = onInit;

    // declaracion

    function onInit() {
      getCategorias();
      getCategoryTemplate();
      getSubjectTemplate();
      getThemeTemplate();
    }

    function cargarAsuntos(event) {
      vm.categoriaSeleccionada = event;
      if (event.dato.codigo) {
        getAsuntos(event.dato.codigo);
      } else {
        vm.lstAsuntos = [];
      }
    }

    function cargarTemas(event) {
      vm.asuntoSeleccionado = event;
      if (vm.categoriaSeleccionada.dato.codigo && event.dato && event.dato.codigo) {
        getTemas(vm.categoriaSeleccionada.dato.codigo, event.dato.codigo);
      } else {
        vm.lstTemas = [];
      }
    }

    function getAsuntos(idCategoria) {
      wpFactory.subject
        .Get(idCategoria) // eslint-disable-line new-cap
        .then(function gaRPrFn(resp) {
          vm.lstAsuntos = resp || [];
          vm.lstAsuntosCbo = ng.copy(vm.lstAsuntos);
          vm.lstSelAsuntos = getSeleccionados(vm.lstAsuntos) || [];
        })
        .catch(function gaEPrFn(err) {
          vm.lstAsuntos = [];
          vm.lstSelAsuntos = [];
          $log.error('Falló el obtener asuntos', err);
        });
    }

    function getCategorias() {
      wpFactory.category
        .GetCategoryAll() // eslint-disable-line new-cap
        .then(function gcRPrFn(resp) {
          vm.lstCategorias = resp || [];
          vm.lstCategoriasCbo = ng.copy(vm.lstCategorias);
          vm.lstSelCategorias = getSeleccionados(vm.lstCategorias) || [];
        })
        .catch(function gcEPrFn(err) {
          vm.lstCategorias = [];
          $log.error('Falló el obtener categorías', err);
        });
    }

    function getCategoryTemplate() {
      wpFactory.category
        .GetRequestTemplate() // eslint-disable-line new-cap
        .then(function grtcRPrFn(resp) {
          builderRequestCategory = new builderObject(resp); // eslint-disable-line new-cap
        })
        .catch(function grctEPrFn(err) {
          $log.error('Falló el obtener tpl categoría', err);
        });
    }

    function getSubjectTemplate() {
      wpFactory.subject
        .GetRequestTemplate() // eslint-disable-line new-cap
        .then(function grtsRPrFn(resp) {
          builderRequestSubject = new builderObject(resp); // eslint-disable-line new-cap
        })
        .catch(function grtsEPrFn(err) {
          $log.error('Falló el obtener tpl asuntos', err);
        });
    }

    function getThemeTemplate() {
      wpFactory.theme
        .GetRequestTemplate() // eslint-disable-line new-cap
        .then(function grttRPrFn(resp) {
          builderRequestTheme = new builderObject(resp); // eslint-disable-line new-cap
        })
        .catch(function grttEPrFn(err) {
          $log.error('Falló al obtener tpl temas', err);
        });
    }

    function getSeleccionados(lst) {
      return _.filter(lst, function fFn(item) {
        return item.estado.toUpperCase() === 'V';
      });
    }

    function getTemas(idCategoria, idAsunto) {
      wpFactory.theme
        .Get(idCategoria, idAsunto, true, true) // eslint-disable-line new-cap
        .then(function gtRPrFn(resp) {
          vm.lstTemas = resp || [];
          vm.lstSelTemas = getSeleccionados(vm.lstTemas) || [];
        })
        .catch(function gtEPrFn(err) {
          vm.lstTemas = [];
          vm.lstSelTemas = [];
          $log.error('Falló al obtener temas', err);
        });
    }

    function guardarAsuntos() {
      var arrCodigos = _.map(vm.lstSelAsuntos, 'codigo');

      var paramsAsuntos = {
        categoryId: vm.categoriaSeleccionada.dato.codigo,
        subjectUpdates: arrCodigos
      };

      builderRequestSubject.clearArray('items');
      builderRequestSubject.appendInArray(paramsAsuntos, 'items');

      wpFactory.subject
        .PutUpdateStates1(builderRequestSubject.getObject()) // eslint-disable-line new-cap
        .then(function pussRPrFn() {
          mModalAlert.showSuccess('Los asuntos seleccionados fueron guardados con éxito', 'Asuntos guardados');
        })
        .catch(function pussEPrFn(err) {
          mModalAlert.showError('Ocurrió un error al guardar los asuntos', 'Error');
          $log.error('Falló al guardar asuntos', err);
        });
    }

    function guardarCategorias() {
      builderRequestCategory.clearArray('categoriesUpdates');

      _.forEach(vm.lstSelCategorias, function lscFE(categoria) {
        builderRequestCategory.appendInArray(categoria.codigo, 'categoriesUpdates');
      });

      wpFactory.category
        .PutUpdateStates(builderRequestCategory.getObject()) // eslint-disable-line new-cap
        .then(function puscRPrFn() {
          mModalAlert.showSuccess('Las categorías seleccionadas fueron guardadas con éxito', 'Categorías guardadas');
        })
        .catch(function puscEPrFn(err) {
          mModalAlert.showError('Ocurrió un error al guardar las categorías', 'Error');
          $log.error('Falló al guardar categorías', err);
        });
    }

    function guardarTemas() {
      var arrCodigos = _.map(vm.lstSelTemas, 'codigo');

      var paramsTemas = {
        categoryId: vm.categoriaSeleccionada.dato.codigo,
        subjectId: vm.asuntoSeleccionado.dato.codigo,
        themesUpdates: arrCodigos
      };

      builderRequestTheme.clearArray('items');
      builderRequestTheme.appendInArray(paramsTemas, 'items');

      wpFactory.theme
        .PutUpdateStates(builderRequestTheme.getObject()) // eslint-disable-line new-cap
        .then(function pustRPrFn() {
          mModalAlert.showSuccess('Los temas seleccionados fueron guardados con éxito', 'Temas guardados');
        })
        .catch(function pustEPrFn(err) {
          mModalAlert.showError('Ocurrió un error al guardar los temas', 'Error');
          $log.error('Falló al guardar temas', err);
        });
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('FiltroAsistenciaController', FiltroAsistenciaController)
    .component('wpFiltroAsistencia', {
      templateUrl: '/webproc/app/components/filtro-asistencia/filtro-asistencia.html',
      controller: 'FiltroAsistenciaController',
      bindings: {}
    });
});
