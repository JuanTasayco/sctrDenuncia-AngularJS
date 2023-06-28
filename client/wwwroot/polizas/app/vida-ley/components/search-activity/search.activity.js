(function ($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, 'mngSearchActivity', ['angular', 'system'],
  function (angular, system) {

    angular.module('appAutos')
      .controller('mngSearchActivityController', ['proxyGeneral', '$timeout', 'proxyVidaLey', 'mModalAlert', '$state', 'vidaLeyService','vidaLeyFactory',
        function (proxyGeneral, $timeout, proxyVidaLey, mModalAlert, $state, vidaLeyService,vidaLeyFactory) {
          var vm = this;
          var seed;
          vm.$onInit = onInit;
          function onInit() {
            vm.tipos = [{
              codigo: constants.module.polizas.sctr.periodoCorto.TipoPeriodo,
              descripcion: constants.module.polizas.sctr.periodoCorto.Descripcion
            },
            {
              codigo: constants.module.polizas.sctr.periodoNormal.TipoPeriodo,
              descripcion: constants.module.polizas.sctr.periodoNormal.Descripcion
            }];
            vm.selectItem = selectItem;
            vm.okItem = okItem;
          }
          vm.closeModal = function () {
            vm.onClose({})
          }
          vm.changeValue = function () {
            var value = vm.mNombSubAct
            if (value && value.length >= 2) {
              if (seed) cancelSearch();
              seed = $timeout(function () {
                resolveData(value);
              }, 500);
            }
          }
          function resolveData(value) {
            vm.agente = vidaLeyFactory.cotizacion.modelo.agente;
            var localseed = seed;
            proxyVidaLey.GetListActividadesEconomicas(value.toUpperCase(), '', '', parseInt(vm.agente.codigoAgente), 1, 20, true)
              .then(function (response) {
                if (localseed == seed) {
                  vm.dataActivities = response.Data.ListActEconomica;
                }
              });
          }
          function cancelSearch() {
            if (seed) $timeout.cancel(seed);
            vm.data = [];
            loading = false;
            seed = undefined;
          }
          function okItem() {
            if (vm.selectedItem) {
              _validarTipoActividad(vm.selectedItem);
            }
          }

          function _validarTipoActividad(actividad) {

            if (actividad.TipActividad == 'D') {
              _retornarHome('La actividad indicada debe ser gestionada a través de su ejecutivo comercial');
            }

            if (actividad.TipActividad == 'A' || actividad.TipActividad == 'S') {
              vm.onActivity({ $event: { selectedItem: actividad } });
            }
          }

          function _retornarHome(mensaje) {
            mModalAlert.showWarning('', mensaje)
              .then(function () {
                $state.go('homePolizaVidaLey');
                return;
              });
          }

          function selectItem(item, accept) {
            if (vm.selectedItem) vm.selectedItem.rowSelected = false;
            vm.selectedItem = item
            vm.selectedItem.rowSelected = true;
            if (accept)
              okItem();
          }


        }])
      .component('mngSearchActivity', {
        templateUrl: '/polizas/app/vida-ley/components/search-activity/search.activity.html',
        controller: 'mngSearchActivityController',
        bindings: {
          onClose: "&?",
          onActivity: "&?",
          typePeriodo: "<?",
          hidenPeriod: "<?"
        }
      })
  });
