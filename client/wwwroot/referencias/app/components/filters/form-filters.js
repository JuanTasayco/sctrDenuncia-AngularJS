(function ($root, name, deps, action) {
  $root.define(name, deps, action)
})(window, 'formFilters', ['angular'], function (angular) {
  angular.module('referencias.app').
  controller('formFiltersController', ['$scope', '$window', '$state', 'mpSpin', 'oimProxyReferencias', 'proxyFiltro', 'proxyReferencia', 'mModalAlert', '$q', '$http', '$filter',
    function ($scope, $window, $state, mpSpin, oimProxyReferencias, proxyFiltro, proxyReferencia, mModalAlert, $q, $http, $filter) {

      var vm = this;
      vm.$onInit = onInit;

      function onInit() {
        $scope.showDropdowOrigen = false;
        $scope.showDropdowDestino = false;
        vm.isValidateForm = isValidateForm;
        vm.selectDepartamentoOrigen = selectDepartamentoOrigen;
        vm.selectDepartamentoDestino = selectDepartamentoDestino;
        vm.selectTipoReferencia = selectTipoReferencia;
        vm.selecUsuario = selecUsuario;
        vm.selectProveedor = selectProveedor;
        vm.searchProveedorO = searchProveedorO
        vm.searchUserRef = searchUserRef;
        vm.referList = referList;
        vm.apply = apply;
        vm.clean = clean;
        vm.goResumen = goResumen;
        vm.downloadExcel = downloadExcel;
        vm.downloadPdf = downloadPdf;
        vm.colorState = -1;
        vm.getIdReferencia = getIdReferencia;
        vm.selectEstado = selectEstado;
        vm.filters = { ac_proveedor: '', CEstado: '' };
        vm.listaRefs = [];
        vm.Estados = [];
        vm.proveOrgn = {};
        vm.proveDstn = {};
        vm.mPagination = 1;
        vm.itemPerPage = 5;
        setInitialData();
        referList(true);
        vm.navstatus = [1, 2, 3, 4];
      }

      function goResumen(idReferencia) {
        $state.go('resumen', { idReferencia: idReferencia });
      }

      function clean() {
        var estado = vm.filters.CEstado;
        vm.filters = { CEstado: estado }
        referList(true);
      }

      function apply() {
        referList(true);
      }

      $scope.getStyle = function (Convenio) {
        if (Convenio === "SIN CONVENIO")
          return { 'color': 'red' };
        if (Convenio === "CON CONVENIO")
          return { 'color': '#00B09F' };

      }

      $scope.getStyle2 = function (Estado) {
        if (Estado === "ANULADO")
          return { 'background-color': '#999999' };
        if (Estado === "REVISADA")
          return { 'background-color': '#00B09F' };
        if (Estado === "POR REVISAR")
          return { 'background-color': '#2C7F8F' };
      }

      // funcion para cargar filtros
      function setInitialData() {
        vm.filters = {
          ad_tpfcha: null,
          range_date: [null, null]
        };
        vm.maxDate = new Date();
        vm.textShowFilter = 'Ver más filtros';
      }

      function selectDepartamentoOrigen() {
        var deferred = $q.defer();

        vm.filters.ProveedorOrigenProv = null;
        var cFiltro = "2";
        var modificador = vm.filters.ProveedorOrigenDept != null ? vm.filters.ProveedorOrigenDept.value : null;
        deferred.resolve(vm.reloadMasters({ $search: 'prvnceOrgn', $params: { cFiltro: cFiltro, modificador: modificador }, $showLoad: true }));

        return deferred.promise;
      };

      function selectDepartamentoDestino() {
        var deferred = $q.defer();

        vm.filters.ProveedorDestinoProv = null;
        var cFiltro = "2";
        var modificador = vm.filters.ProveedorDestinoDept != null ? vm.filters.ProveedorDestinoDept.value : null;
        deferred.resolve(vm.reloadMasters({ $search: 'prvnceDstn', $params: { cFiltro: cFiltro, modificador: modificador }, $showLoad: true }));

        return deferred.promise;
      }

      function selectTipoReferencia() {
        var deferred = $q.defer();

        vm.filters.an_tipoRefrencia = null;
        var cFiltro = "3";
        var modificador = vm.filters.an_tipoReferencia != null ? vm.filters.an_tipoReferencia.value : null;
        deferred.resolve(vm.reloadMasters({ $search: 'tipoRefeferencias', $params: { cFiltro: cFiltro, modificador: modificador }, $showLoad: true }));

        return deferred.promise;
      }

      function selecUsuario() {
        var deferred = $q.defer();

        vm.filters.ac_Usuario = null;
        var cFiltro = "19";
        var modificador = vm.filters.ac_Usuario != null ? vm.filters.ac_Usuario.value : null;
        deferred.resolve(vm.reloadMasters({ $search: 'usuario', $params: { cFiltro: cFiltro, modificador: modificador }, $showLoad: true }));

        return deferred.promise;
      }

      function selectProveedor() {
        var deferred = $q.defer();

        vm.filters.ac_proveedor = null;
        var cFiltro = "20";
        var modificador = vm.filters.ac_proveedor != null ? vm.filters.ac_proveedor.value : null;
        deferred.resolve(vm.reloadMasters({ $search: 'proveedor', $params: { cFiltro: cFiltro, modificador: modificador }, $showLoad: true }));

        return deferred.promise;
      }

      function searchProveedorO(search) {
        if (search && search.length >= 3) {
          var deferred = $q.defer();

          proxyFiltro.ListarFiltros({ cFiltro: "20", modificador: search })
            .then(function (response) {
              if (response.codErr == 0)
                deferred.resolve(response.listaFiltros);
            });

          return deferred.promise;
        }
      }

      function searchUserRef(search) {
        if (search && search.length >= 5) {
          var deferred = $q.defer();

          proxyFiltro.ListarFiltros({ cFiltro: "19", modificador: search })
            .then(function (response) {
              if (response.codErr == 0) {
                deferred.resolve(response.listaFiltros);
              };

              if (response.codErr == 3) {
                mModalAlert.showError('El usuario solicitado no existe.', '')
              };
            });

          return deferred.promise;
        }

      }
      // fin filtros

      //funcion para lista de resultacos
      function referList(showLoading) {
        var NomPaciente = vm.filters.NomPaciente != null ? vm.filters.NomPaciente : null;
        var FechaReferencia = vm.filters.FechaReferencia != null ? $filter('date')(vm.filters.FechaReferencia, 'yyyyMMdd') : null;
        var CTReferencia = vm.filters.CTReferencia != null ? vm.filters.CTReferencia.value : null;
        var CodUsuMAPFRE = vm.filters.CodUsuMAPFRE != null ? vm.filters.CodUsuMAPFRE.value : null;
        var FRefeForzada = vm.filters.FRefeForzada != null ? vm.filters.FRefeForzada : false;
        var ProveedorOrigen = {};
        ProveedorOrigen.Nombre = vm.filters.ProveedorOrigenNom != null ? vm.filters.ProveedorOrigenNom.text : null;
        ProveedorOrigen.Departamento = vm.filters.ProveedorOrigenDept != null ? vm.filters.ProveedorOrigenDept.value : null;
        ProveedorOrigen.Provincia = vm.filters.ProveedorOrigenProv != null ? vm.filters.ProveedorOrigenProv.value : null;
        var ProveedorDestino = {};
        ProveedorDestino.Nombre = vm.filters.ProveedorDestinonNom != null ? vm.filters.ProveedorDestinonNom.text : null;
        ProveedorDestino.Departamento = vm.filters.ProveedorDestinoDept != null ? vm.filters.ProveedorDestinoDept.value : null;
        ProveedorDestino.Provincia = vm.filters.ProveedorDestinoProv != null ? vm.filters.ProveedorDestinoProv.value : null;
        var CEstado = vm.filters.CEstado != null ? vm.filters.CEstado : '';
        var Pagina = vm.mPagination;

        if (showLoading) mpSpin.start();
        proxyReferencia.RListarReferencias({
          NomPaciente: NomPaciente, FechaReferencia: FechaReferencia, CTReferencia: CTReferencia, CodUsuMAPFRE: CodUsuMAPFRE, FRefeForzada: FRefeForzada,
          ProveedorOrigen: ProveedorOrigen, ProveedorDestino: ProveedorDestino, CEstado: CEstado, Pagina: Pagina
        })
          .then(function (response) {
            if (response.codErr == 0) {

              vm.listaRefs = response.listaReferencias;
              vm.Estados = response.cantEstado;
              vm.totalItems = response.cantPagi * vm.itemPerPage;
            }
            if (showLoading) mpSpin.end();
          });

      }
      //fin de la lista

      //validacion del formulario
      function isValidateForm() {
        var validTypeDate = vm.filters.ad_tpfcha != null && vm.filters.ad_tpfcha.cdgo != null;
        var validRangeDate = vm.filters.range_date[0] !== null && vm.filters.range_date[1] !== null;
        return validTypeDate && validRangeDate
      }
      //fin de la validacion

      function downloadExcel() {
        var NomPaciente = vm.filters.NomPaciente != null ? vm.filters.NomPaciente : null;
        var FechaReferencia = vm.filters.FechaReferencia != null ? $filter('date')(vm.filters.FechaReferencia, 'yyyyMMdd') : null;
        var CTReferencia = vm.filters.CTReferencia != null ? vm.filters.CTReferencia.value : null;
        var CodUsuMAPFRE = vm.filters.CodUsuMAPFRE != null ? vm.filters.CodUsuMAPFRE.value : null;
        var FRefeForzada = vm.filters.FRefeForzada != null ? vm.filters.FRefeForzada : false;
        var ProveedorOrigen = {};
        ProveedorOrigen.Nombre = vm.filters.ProveedorOrigenNom != null ? vm.filters.ProveedorOrigenNom.text : null;
        ProveedorOrigen.Departamento = vm.filters.ProveedorOrigenDept != null ? vm.filters.ProveedorOrigenDept.value : null;
        ProveedorOrigen.Provincia = vm.filters.ProveedorOrigenProv != null ? vm.filters.ProveedorOrigenProv.value : null;
        var ProveedorDestino = {};
        ProveedorDestino.Nombre = vm.filters.ProveedorDestinonNom != null ? vm.filters.ProveedorDestinonNom.text : null;
        ProveedorDestino.Departamento = vm.filters.ProveedorDestinoDept != null ? vm.filters.ProveedorDestinoDept.value : null;
        ProveedorDestino.Provincia = vm.filters.ProveedorDestinoProv != null ? vm.filters.ProveedorDestinoProv.value : null;
        var CEstado = vm.filters.CEstado != null ? vm.filters.CEstado : '';
        var Pagina = vm.mPagination;

        var params = {
          NomPaciente: NomPaciente, FechaReferencia: FechaReferencia, CTReferencia: CTReferencia,
          CodUsuMAPFRE: CodUsuMAPFRE, FRefeForzada: FRefeForzada, ProveedorOrigen: ProveedorOrigen,
          ProveedorDestino: ProveedorDestino, CEstado: CEstado, Pagina: Pagina
        }

        var url = oimProxyReferencias.endpoint + 'api/referencia/listarExcel';

        mpSpin.start();

        /*gtx*/

        var urlTracker = oimProxyReferencias.endpoint + 'api/traza/eventTracker';

        var obj = {
          "codigoAplicacion": "NREF",
          "ipOrigen": $window.localStorage.getItem('clientIp'),
          "tipoRegistro": "O",
          "codigoObjeto": "REFERENCIAS",
          "opcionMenu": "Bandeja referencias - descargar lista",
          "descripcionOperacion": "Click al Botón Descargar Lista",
          "filtros": "",
          "codigoUsuario": "",
          "numeroSesion": "",
          "codigoAgente": 0
        };

        $http.post(
          urlTracker,
          obj)
          .success(
            function (data) {
            });

        /*--gtx*/

        $http.post(
          url,
          params,
          { responseType: "arraybuffer" })
          .success(
            function (data, status, headers) {
              var type = headers('Content-Type');
              var disposition = headers('Content-Disposition');
              var defaultFileName = 'Referencias.xlsx';

              if (disposition) {
                var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
                if (match[1]) defaultFileName = match[1];
              }

              defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');

              var blob = new Blob([data], { type: type });
              var link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = defaultFileName;
              link.click();

              mpSpin.end();
            }, function (data, status) {
              mpSpin.end();
            });
      }

      function downloadPdf(idReferencia) {
        var url = oimProxyReferencias.endpoint + 'api/referencia/detallePDF';
        var params = { CReferencia: idReferencia };

        mpSpin.start();

        $http.post(
          url,
          params,
          { responseType: "arraybuffer" })
          .success(
            function (data, status, headers) {
              var type = headers('Content-Type');
              var disposition = headers('Content-Disposition');
              var defaultFileName = 'Referencia' + idReferencia + '.pdf';
              if (disposition) {
                var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
                if (match[1]) defaultFileName = match[1];
              }

              defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');

              var blob = new Blob([data], { type: type });
              var link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = defaultFileName;
              link.click();

              mpSpin.end();
            }, function (data, status) {
              mpSpin.end();
            });
      }



      function selectEstado(estado) {
        vm.colorState = estado
        if (estado == -1) estado = '';
        vm.filters.CEstado = estado.toString();
        referList(true);

      }

      function getIdReferencia(num) {
        if (num) {
          var s = "000000" + num;
          return s.substr(num.toString().length);
        }
        return '';
      }

    }]).
  component('formFilters', {
    templateUrl: '/referencias/app/components/filters/form-filters.html',
    controller: 'formFiltersController',
    bindings: {
      state: "=?",
      objectData: "=?",
      masters: '=?',
      filterApply: '&?',
      reloadMasters: '&?',
    }
  })
});
