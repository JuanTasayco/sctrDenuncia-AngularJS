(function ($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "complaintDisabilitySearchContainerComponent", ["angular"], function (ng) {
  ng.module("sctrDenuncia.app")
    .controller("complaintDisabilitySearchContainerComponentController", ["proxyDisabilityRequest", "mModalAlert", "mpSpin", "$http", "oimProxySctrDenuncia", "oimPrincipal",
      function (proxyDisabilityRequest, mModalAlert, mpSpin, $http, oimProxySctrDenuncia, oimPrincipal) {
        var vm = this;

        var currentRole = oimPrincipal.get_role().toUpperCase();

        vm.role = 0;

        if(currentRole === "EJECSCTR") vm.role = 1;

        function onInit() {
          vm.currentFilter = {};
          vm.status = 1;
          vm.resetStatus = false;
          cleanPager();
        }

        // Inicializar paginador
        function cleanPager() {
          vm.pagination = {
            maxSize: 10,
            sizePerPage: 10,
            currentPage: 1,
            totalRecords: 0,
          };
        }

        // Evento usado por componentes para realizar busqueda
        function onSearch($filter) {
          search($filter);
        }

        // Evento usado por componentes para limpiar la data
        function onClean() {
          cleanPager();
          delete vm.resultItems;
          vm.isSearched = false;
        }

        // Busqueda de data con parametros ingresados
        function search($filter) { 
          if (!$filter || $filter.success === true) {
            if($filter) vm.pagination.currentPage = 1;

              vm.currentFilter = $filter ? $filter.request || vm.currentFilter : vm.currentFilter;
  
              vm.currentFilter.pager = {
                size: vm.pagination.sizePerPage,
                pageNumber: vm.pagination.currentPage,
              };
  
              vm.resetStatus = false;

              if($filter) {
                vm.status = 1;
                vm.resetStatus = true;
              }
  
              vm.currentFilter.status = vm.status;
  
              var solBody = {
                codigoArea: vm.currentFilter.area ? vm.currentFilter.area.codigo : null,
                codigoDocumento: vm.currentFilter.documentNumber ? vm.currentFilter.documentNumber : '',
                estado: vm.currentFilter.status ? vm.currentFilter.status : '',
                fechafin: vm.currentFilter.toDate ? vm.currentFilter.toDate : '',
                fechainicio: vm.currentFilter.fromDate ? vm.currentFilter.fromDate : '',
                nombreAsegurado: vm.currentFilter.insuredName ? vm.currentFilter.insuredName : '',
                pageI: {
                  numeroPagina: vm.currentFilter.pager.pageNumber ? vm.currentFilter.pager.pageNumber : 1,
                  tamano: vm.currentFilter.pager.size ? vm.currentFilter.pager.size : 20,
                },
                solicitudId: vm.currentFilter.requestNumber ? vm.currentFilter.requestNumber : null
              }

              vm.solBody = solBody;

              var solBodyCountStates = {
                codigoArea: vm.currentFilter.area ? vm.currentFilter.area.codigo : null,
                codigoDocumento: vm.currentFilter.documentNumber ? vm.currentFilter.documentNumber : '',
                fechafin: vm.currentFilter.toDate ? vm.currentFilter.toDate : '',
                fechainicio: vm.currentFilter.fromDate ? vm.currentFilter.fromDate : '',
                nombreAsegurado: vm.currentFilter.insuredName ? vm.currentFilter.insuredName : '',
                solicitudId: vm.currentFilter.requestNumber ? vm.currentFilter.requestNumber : null
              }

              mpSpin.start();
              proxyDisabilityRequest.CantidadSolicitudes(solBodyCountStates, false).then(function (resp) {
                if(resp.codigoRpta == 200) {
                  vm.statesCount = resp.data;

                  proxyDisabilityRequest.Solicitudes(solBody, false).then(function (resp) {
                    if(resp.codigoRpta == 200) {
                      vm.resultItems = resp.data;
                      angular.forEach(vm.resultItems, function (a, b) {                
                        if(a.fechaSolicitud) {
                          var fecha = a.fechaSolicitud.substr(0,10);
                          var fechas = fecha.split('-');
                          a.fechaSolicitud = new Date(fechas[0], fechas[1] - 1, fechas[2]);
                        } else {
                          a.fechaSolicitud = null;
                        }

                        if(a.fechaSiniestro) {
                          var fecha = a.fechaSiniestro.substr(0,10);
                          var fechas = fecha.split('-');
                          a.fechaSiniestro = new Date(fechas[0], fechas[1] - 1, fechas[2]);
                        } else {
                          a.fechaSiniestro = null;
                        }
                      });
                      vm.pagination.totalRecords = resp.totalRegistro;
                      vm.noResult = (vm.pagination.totalRecords || 0) == 0 || !vm.resultItems;
                      vm.isSearched = true;
                      mpSpin.end();
                    }
                  });
                }
              });
          } else {
            mModalAlert.showError($filter.message, "Dictamen de Invalidez");
          }
        }

        // Funcion cambio de pagina
        function pageChanged($status) {
          vm.status = $status;
          search();
        }

        // Funcion para exportar data
        function exportResults() {
          var solBody = {
            codigoArea: vm.solBody.codigoArea,
            codigoDocumento: vm.solBody.codigoDocumento,
            fechafin: vm.solBody.fechafin,
            fechainicio: vm.solBody.fechainicio,
            nombreAsegurado: vm.solBody.nombreAsegurado,
            solicitudId: vm.solBody.solicitudId
          }

          var formato = "excel";
          
          mpSpin.start()
          $http.post(oimProxySctrDenuncia.endpoint + 'api/solicitudes?formato='+formato, solBody, { responseType: 'blob' })
            .success(function (data, status, headers) {
              if(data.size > 0) {
              var defaultFileName = 'ReporteSolicitudes';
              var type = headers('Content-Type');
              var blob = new Blob([data], { type: type });
              saveAs(blob, defaultFileName);
              } else {
                mModalAlert.showError("No existe información para generar archivo", "Solicitudes");  
              }
              mpSpin.end();
            }, function(data, status) {
              mModalAlert.showError("Ha sucedido un error al momento de descargar el archivo", "Solicitudes");
              mpSpin.end();
            })
            .error(function(error) {
              mModalAlert.showError("Ha sucedido un error al momento de descargar el archivo", "Solicitudes");
              mpSpin.end();
            });
        }

        vm.$onInit = onInit;
        vm.onSearch = onSearch;
        vm.onClean = onClean;
        vm.pageChanged = pageChanged;
        vm.exportResults = exportResults;
      },
    ])
    .component("complaintDisabilitySearchContainer", {
      templateUrl:"/sctrDenuncia/app/complaint/disabilitySearch/container-component.html",
      controller: "complaintDisabilitySearchContainerComponentController",
      bindings: {},
    });
});
