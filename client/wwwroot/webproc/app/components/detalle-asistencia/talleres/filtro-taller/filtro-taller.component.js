'use strict';

define(['angular', 'lodash', 'wpConstant'], function(ng, _, wpConstant) {
  function FiltroTallerController() {
    var vm = this;
    vm.$onInit = onInit;
    vm.limpiarFrm = limpiarFrm;
    vm.handleFiltrarFrm = handleFiltrarFrm;
    vm.bindFiltroFrm = handleFiltrarFrm;

    function onInit() {
      vm.frmSearch = _.merge({}, vm.frmByDefault, {
        cbo: {}
      });
      vm.lstTipoTaller = wpConstant.lstTipoTaller;
    }

    function limpiarFrm() {
      vm.frmSearch.cbo.depa = null;

      vm.onFiltrarFrm({
        $event: {
          frm: vm.frmSearch,
          nroPage: 1
        }
      });
    }

    function handleFiltrarFrm(objUbigeo) {
      // al recibir el argumento objUbigeo, es pq ya tenemos algunos de los campos llenos
      var isInvalid = objUbigeo && (objUbigeo.depa && objUbigeo.prov) ? false : vm.frmTaller.$invalid;
      if (isInvalid) {
        vm.frmTaller.markAsPristine();
        return void 0;
      }
      vm.onFiltrarFrm({
        $event: {
          frm: vm.frmSearch,
          nroPage: 1
        }
      });
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('FiltroTallerController', FiltroTallerController)
    .component('wpFiltroTaller', {
      templateUrl: '/webproc/app/components/detalle-asistencia/talleres/filtro-taller/filtro-taller.html',
      controller: 'FiltroTallerController',
      bindings: {
        onFiltrarFrm: '&?',
        frmByDefault: '=?',
        bindFiltroFrm: '=?'
      }
    });
});
