(function ($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "progressStepFour", ["angular"], function (angular) {
  angular
    .module("referencias.app")
    .controller("progressStepFourController", [
      "$scope",
      "$timeout",
      "mpSpin",
      "proxyFiltro",
      "proxyProveedor",
      "$q",
      function ($scope, $timeout, mpSpin, proxyFiltro, proxyProveedor, $q) {
        var vm = this;
        vm.$onInit = onInit;

        function onInit() {
          /*
          vm.loadMapaSeleccionado = loadMapaSeleccionado;
          vm.selectDepartamentoOrigen = selectDepartamentoOrigen;
          vm.change = changeFn;
          vm.editarOrigen = editarOrigen;
          vm.validarDatosO = validarDatosO;
          vm.searchOrigin = searchOrigin;
          vm.searchDiagnostico = searchDiagnostico;
          vm.searchCentroOrigen = searchCentroOrigen;
          vm.clearCentr = clearCentr;
          vm.editp2 = false;
          vm.mapId = "mapaPeru";
          vm.mapSvg = "/referencias/assets/mapaPeru.svg";
          */
          vm.editPaciente = editPaciente;

          vm.validarDatosStep4 = validarDatosStep4;
          vm.generateReferral = generateReferral;
          vm.editp4 = false;

          vm.updateStep = updateStep;
        }

        function editPaciente() {

          vm.edit = true;
          //$scope.$parent.ListProve = [];
          vm.showRest = false;
          vm.editp4 = true;
          vm.step = 4;
          vm.oneEdit();

          //vm.OtroRqmnto = vm.filters.OtroRqmnto;
          vm.OtroRqmnto = vm.filters.otroRqmnto;
          vm.observacion = vm.filters.observacion;
          //vm.ResumenHistClinica = vm.filters.ResumenHistClinica;
          vm.ResumenHistClinica = vm.filters.resumenHistClinica;

          /*
          vm.filters.ac_cdprtmntoDestino = null;
          vm.filters.an_cprvncaDestino = null;
          vm.filters.ac_Categoria = null;
          vm.filters.ac_Entidad = null;
          vm.filters.ac_Institucion = null;
          vm.filters.ac_Convenio = null;
          vm.filters.ac_Cobertura = null;
          vm.filters.ac_CentroDest = null;
           */
        }

        function validarDatosStep4() {
          return vm.OtroRqmnto && vm.observacion && vm.ResumenHistClinica;
        }

        function updateStep() {
          console.log("updateStep")
          vm.edit = false;
          vm.editp2 = false;
          vm.editp3 = false;

          vm.filters.OtroRqmnto = vm.OtroRqmnto;
          vm.filters.observacion = vm.observacion;
          vm.filters.ResumenHistClinica = vm.ResumenHistClinica;

          vm.nextStep({ $data: vm.filters });
        }

        function generateReferral() {

          vm.filters.OtroRqmnto = vm.OtroRqmnto;
          vm.filters.observacion = vm.observacion;
          vm.filters.ResumenHistClinica = vm.ResumenHistClinica;

          vm.nextStep({ $data: vm.filters });
        }

        /*
        $scope.$watch("$ctrl.loadMapa", function (n, o) {
          if (n != o) {
            if (n) {
              vm.enabledMap =
                vm.filters.pacienteSelect.oSiteds == undefined ||
                vm.filters.pacienteSelect.oSiteds.numAutorizacion == null;
              loadMapaSeleccionado();
            }
          }
        });

        function loadMapaSeleccionado() {
          if (vm.filters.ac_cdprtmntoOrigen.value != null) {
            var ubigeoDepa = vm.filters.ac_cdprtmntoOrigen.value.trim();
            vm.mapId = "mapa" + vm.filters.ac_cdprtmntoOrigen.text;
            vm.mapSvg = "/referencias/assets/" + ubigeoDepa + ".svg";
            if (
              vm.filters.an_cprvncaOrigen != null &&
              vm.filters.an_cprvncaOrigen.value != null
            ) {
              $timeout(function toFn() {
                vm.enabledMap =
                  vm.filters.pacienteSelect.oSiteds == undefined ||
                  vm.filters.pacienteSelect.oSiteds.numAutorizacion == null;
                $scope.$broadcast("changeProvincia", {
                  id: vm.filters.an_cprvncaOrigen.value.trim(),
                });
              }, 1000);
            }

            selectDepartamentoOrigen();
          } else {
            vm.mapId = "mapaPeru";
            vm.mapSvg = "/referencias/assets/mapaPeru.svg";
          }
        }

        vm.openMap = function omFn(lvl, loc, isNotChangingMap) {
          var dataMapa = {};
          dataMapa.id = loc;

          if (isNotChangingMap) {
            vm.masters.provinciasOrigen.some(function itFn(item) {
              vm.enabledMap =
                vm.filters.pacienteSelect.oSiteds == undefined ||
                vm.filters.pacienteSelect.oSiteds.numAutorizacion == null;
              if (
                item.value !== null &&
                item.value.trim() === loc &&
                vm.enabledMap
              ) {
                vm.provRequiredError = false;
                vm.filters.an_cprvncaOrigen = item;
                return true;
              }
            });
          } else {
            vm.masters.departamentos.some(function itFn(item) {
              if (item.value !== null && item.value.trim() === loc) {
                vm.depaRequiredError = false;
                vm.filters.ac_cdprtmntoOrigen = item;
                return true;
              }
            });

            $timeout(function toFn() {
              vm.mapId = "mapa" + loc;
              vm.mapSvg = "/referencias/assets/" + loc + ".svg";
              vm.loadCls = "is-loaded";
            }, 500);

            vm.filters.an_cprvncaOrigen = null;
            selectDepartamentoOrigen();
          }
        };

        function changeFn(type) {
          switch (type) {
            case "dep":
              vm.depaRequiredError = false;
              if (
                vm.filters.ac_cdprtmntoOrigen == undefined ||
                vm.filters.ac_cdprtmntoOrigen.value == null
              ) {
                vm.mapId = "mapaPeru";
                vm.filters.ac_cdprtmntoOrigen = null;
                vm.filters.an_cprvncaOrigen = null;
                vm.masters.provinciasOrigen = [];
                vm.mapSvg = "/referencias/assets/mapaPeru.svg";
              } else {
                vm.loadCls = "is-loading";
                $timeout(function toFn() {
                  vm.loadCls = "";
                }, 500);
                vm.mapId = "mapa" + vm.filters.ac_cdprtmntoOrigen.value;
                vm.mapSvg =
                  "/referencias/assets/" +
                  vm.filters.ac_cdprtmntoOrigen.value.trim() +
                  ".svg";
                vm.filters.an_cprvncaOrigen = null;
                selectDepartamentoOrigen();
              }
              break;
            case "pro":
              if (
                vm.filters.an_cprvncaOrigen != null &&
                vm.filters.an_cprvncaOrigen.value != null
              ) {
                vm.provRequiredError = false;
                vm.enabledMap =
                  vm.filters.pacienteSelect.oSiteds == undefined ||
                  vm.filters.pacienteSelect.oSiteds.numAutorizacion == null;
                $scope.$broadcast("changeProvincia", {
                  id: vm.filters.an_cprvncaOrigen.value.trim(),
                });
              }
              break;
            default:
              $log.info("changeFn - No type");
          }
        }

        function searchDiagnostico(search) {
          if (search && search.length >= 3) {
            var defer = $q.defer();
            proxyFiltro
              .ListarFiltros({ cFiltro: "7", modificador: search })
              .then(function (response) {
                if (response.codErr == 0) defer.resolve(response.listaFiltros);
              });
            return defer.promise;
          }
        }

        function searchCentroOrigen(search) {
          if (search && search.length >= 2) {
            var deferred = $q.defer();
            var departament =
              vm.filters.ac_cdprtmntoOrigen != null
                ? vm.filters.ac_cdprtmntoOrigen.value
                : null;
            var province =
              vm.filters.an_cprvncaOrigen != null
                ? vm.filters.an_cprvncaOrigen.value
                : null;
            vm.filters.ac_CentroOrg1 != null;
            proxyProveedor
              .ListarProveedor({
                CDep: departament,
                CProv: province,
                modificador: search,
              })
              .then(function (response) {
                if (response.codErr == 0)
                  deferred.resolve(response.listaFiltros);
              });
            return deferred.promise;
          }
        }

        function selectDepartamentoOrigen() {
          var deferred = $q.defer();

          var cFiltro = "2";
          var modificador =
            vm.filters.ac_cdprtmntoOrigen != null
              ? vm.filters.ac_cdprtmntoOrigen.value
              : null;
          deferred.resolve(
            vm.reloadMasters({
              $search: "prvnceOrgn",
              $params: { cFiltro: cFiltro, modificador: modificador },
              $showLoad: true,
            })
          );

          return deferred.promise;
        }

        function clearCentr() {
          vm.filters.ac_CentroOrg1 = null;
        }

        function validarDatosO() {
          var departament =
            vm.filters.ac_cdprtmntoOrigen != null &&
            vm.filters.ac_cdprtmntoOrigen != "";
          var CProveedorOrigen =
            vm.filters.ac_CentroOrg1 != null && vm.filters.ac_CentroOrg1 != "";
          var province =
            vm.filters.an_cprvncaOrigen != null &&
            vm.filters.an_cprvncaOrigen != "";
          var refsType =
            vm.filters.tipoReferencia != null &&
            vm.filters.tipoReferencia != "";
          var name =
            vm.filters.nomRspnsble != null && vm.filters.nomRspnsble != "";
          var phone =
            vm.filters.telRspnsble != null && vm.filters.telRspnsble != "";
          var email =
            vm.filters.mailRspnsble != null && vm.filters.mailRspnsble != "";
          var pCondition =
            vm.filters.ac_Condicion != null &&
            vm.filters.ac_Condicion.value != null;
          var dPresuntive =
            vm.filters.ac_Diagnostico != null &&
            vm.filters.ac_Diagnostico.value != null;
          return (
            departament &&
            province &&
            CProveedorOrigen &&
            refsType &&
            pCondition &&
            dPresuntive &&
            name &&
            phone &&
            email
          );
        }

        function editarOrigen() {
          vm.edit = true;
          vm.editp2 = true;
          vm.step = 2;
          vm.oneEdit();
          vm.filters.ac_cdprtmntoDestino = null;
          vm.filters.an_cprvncaDestino = null;
          vm.filters.ac_Categoria = null;
          vm.filters.ac_Entidad = null;
          vm.filters.ac_Institucion = null;
          vm.filters.ac_Convenio = null;
          vm.filters.ac_CentroDest = null;
          vm.filters.listChecked = [];
          vm.filters.fRefeForzada = false;
          $scope.$parent.ListProve = [];
          $scope.$parent.ListProveAll = [];
          loadMapaSeleccionado();
        }

        function searchOrigin() {
          vm.edit = false;
          vm.editp2 = false;
          vm.nextStep({ $data: vm.filters });
        }
        */
        //vm.filters.ac_cdprtmntoOrigen = "";
      },
    ])
    .component("progressStepFour", {
      templateUrl:
        "/referencias/app/components/progress/progress-step-four.html",
      controller: "progressStepFourController",
      bindings: {
        step: "=?",
        provedor: "=?",
        masters: "=?",
        filters: "=?",
        loadMapa: "=?",
        edit: "=?",
        showEdit: "=?",
        nextStep: "&?",
        reloadMasters: "&?",
        oneEdit: "&?",
      },
    });
});
