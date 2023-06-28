(function ($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "progressStepThree", ["angular"], function (angular) {
  angular
    .module("referencias.app")
    .controller("progressStepThreeController", [
      "$scope",
      "$uibModal",
      "$q",
      "mpSpin",
      "proxyProveedor",
      "mModalAlert",
      function ($scope, $uibModal, $q, mpSpin, proxyProveedor, mModalAlert) {
        var vm = this;
        vm.$onInit = onInit;

        // funcion inicial
        function onInit() {
          vm.selectDepartamentoDestino = selectDepartamentoDestino;
          vm.showModalRequirements = showModalRequirements;

          vm.setProximidad = setProximidad;
          vm.setCosto = setCosto;
          vm.setRequerimientos = setRequerimientos;

          vm.buscadorProveedor = buscadorProveedor;
          vm.selectProveedor = selectProveedor;
          vm.showModalGrabar = showModalGrabar;
          vm.editarDestino = editarDestino;
          vm.showModalDetalled = showModalDetalled;
          vm.validarDatosPD = validarDatosPD;
          vm.searchCentroDestino = searchCentroDestino;
          vm.forzarDestino = forzarDestino;
          vm.unRequirement = unRequirement;
          vm.changePrvnc = changePrvnc;
          vm.pagination = pagination;
          vm.ocultarProveedor = ocultarProveedor;
          /**/
          vm.goStep4 = goStep4;
          vm.editp3 = false;
          /**/
          vm.showRest = false;
          vm.filters.fRefeForzada = false;
          vm.filters.ordenaRequerimiento = false;
          vm.filters.listChecked = [];
          vm.itemPerPage = 5;
          vm.mPagination = 1;
          /**/
          vm.filters.ordenaCosto = true;
          vm.filters.ordenaRequerimiento = false;
        }

        // funcion para buscar el departamento  y provincia destino
        function selectDepartamentoDestino() {
          var deferred = $q.defer();

          vm.filters.an_cprvncaDestino = null;
          vm.filters.ac_CentroDest = null;
          var cFiltro = "2";
          var modificador =
            vm.filters.ac_cdprtmntoDestino != null
              ? vm.filters.ac_cdprtmntoDestino.value
              : null;

          deferred.resolve(
            vm.reloadMasters({
              $search: "prvnceDstn",
              $params: { cFiltro: cFiltro, modificador: modificador },
              $showLoad: true,
            })
          );
          return deferred.promise;
        }

        function changePrvnc() {
          vm.filters.ac_CentroDest = null;
        }

        // modal para requerimientos
        function showModalRequirements() {
          $uibModal.open({
            backdrop: true,
            backdropClick: false,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: "lg",
            template:
              "<modal-requerimientos data='requerimientos' close='close()'> </modal-requerimientos>",
            controller: [
              "$scope",
              "$uibModalInstance",
              function ($scope, $uibModalInstance) {
                $scope.requerimientos = vm.filters.listChecked;
                $scope.close = function (data) {
                  vm.filters.listChecked = data.getData();
                  $uibModalInstance.close();
                };

                $scope.close2 = function () {
                  $uibModalInstance.close();
                };
              },
            ],
          });
        }

        // estilo para variable convenio
        $scope.getStyle = function (convenio) {
          if (convenio == "SIN CONVENIO") return { color: "red" };
          if (convenio == "CON CONVENIO") return { color: "#00B09F" };
        };

        function showModalDetalled(item) {
          $uibModal.open({
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: "lg",
            template:
              "<modal-detalled params='modalDetalleD' paciente='paciente' close='close()'></modal-detalled>",
            controller: [
              "$scope",
              "$uibModalInstance",
              function ($scope, $uibModalInstance) {
                $scope.paciente = vm.filters.pacienteSelect;
                $scope.modalDetalleD = {
                  CAsegurado: vm.filters.pacienteSelect.idAfiliado,
                  CProveedor: item.idProveedor,
                  CTipOrigAseg: vm.filters.pacienteSelect.tipoOrigen,
                  NumContrato: vm.filters.pacienteSelect.numContrato,
                };
                $scope.close = function () {
                  $uibModalInstance.close();
                };
              },
            ],
          });
        }

        function searchCentroDestino(search) {
          if (search && search.length >= 3) {
            var deferred = $q.defer();
            var CDepartamento =
              vm.filters.ac_cdprtmntoDestino != null
                ? vm.filters.ac_cdprtmntoDestino.value
                : null;
            var CProvincia =
              vm.filters.an_cprvncaDestino != null
                ? vm.filters.an_cprvncaDestino.value
                : null;
            vm.filters.ac_CentroDest != null;
            proxyProveedor
              .ListarProveedor({
                CDep: CDepartamento,
                CProv: CProvincia,
                modificador: search,
              })
              .then(function (response) {
                if (response.codErr == 0)
                  deferred.resolve(response.listaFiltros);
              });
            return deferred.promise;
          }
        }

        function unRequirement(index, item) {
          if (item.grupoRequerimiento == 13) {
            $scope.$parent.masters.rServicios.forEach(function element() {
              if (element.value == item.idRequerimiento) {
                element.checkTest = false;
              }
            });
          }

          if (item.grupoRequerimiento == 14) {
            $scope.$parent.masters.rImagen.forEach(function element() {
              if (element.value == item.idRequerimiento) {
                element.checkTest = false;
              }
            });
          }
          if (item.grupoRequerimiento == 15) {
            $scope.$parent.masters.rEmergencia.forEach(function element() {
              if (element.value == item.idRequerimiento) {
                element.checkTest = false;
              }
            });
          }

          vm.filters.listChecked.splice(index, 1);
        }

        function forzarDestino() {
          if (vm.filters.fRefeForzada) {
            vm.filters.ac_cdprtmntoDestino = null;
            vm.filters.an_cprvncaDestino = null;
            vm.filters.ac_Categoria = null;
            vm.filters.ac_Entidad = null;
            vm.filters.ac_Institucion = null;
            vm.filters.ac_Convenio = null;
            vm.filters.ac_Cobertura.value = null;
            vm.filters.listChecked = [];
            vm.showemptymsg = true;
          } else {
            vm.filters.ac_CentroDest = null;
            vm.filters.ac_cdprtmntoDestino = null;
            vm.filters.an_cprvncaDestino = null;
            vm.filters.listChecked = [];
            vm.showemptymsg = true;
          }
        }

        $scope.getStyle2 = function (cumpleRequerimiento) {
          return cumpleRequerimiento
            ? {
              color: "#000000",
              "font-weight": "Bold",
            }
            : {
              color: "#888383",
            };
        };

        function setProximidad() {
          vm.filters.ordenaCosto = false;
          vm.filters.ordenaRequerimiento = false;
          vm.buscadorProveedor();
        }

        function setCosto() {
          vm.filters.ordenaCosto = true;
          vm.filters.ordenaRequerimiento = false;
          vm.buscadorProveedor();
        }

        function setRequerimientos() {
          vm.filters.ordenaCosto = false;
          vm.filters.ordenaRequerimiento = true;
          vm.buscadorProveedor();
        }

        function buscadorProveedor() {
          var tieneEspecialidad = false;
          angular.forEach(vm.filters.listChecked, function (v) {
            if (v.grupoRequerimiento == 16) {
              tieneEspecialidad = true;
            }
          });
          if (!tieneEspecialidad && !vm.filters.fRefeForzada) {
            mModalAlert.showError(
              "Para realizar la búsqueda de proveedor debe elegir al menos una especialidad.",
              ""
            );
          } else if (vm.filters.listChecked.length == 0 && !vm.filters.fRefeForzada) {
            mModalAlert.showError(
              "Para realizar la búsqueda de proveedor debe elegir al menos un servicio.",
              ""
            );
          } else if (!vm.filters.ac_Cobertura.value && !vm.filters.fRefeForzada) {
            mModalAlert.showError(
              "Para realizar la búsqueda de proveedor debe elegir una cobertura.",
              ""
            );
          } else {
            var CProveedorDestino =
              vm.filters.ac_CentroDest != null
                ? vm.filters.ac_CentroDest.value
                : null;
            var CProveedorOrigen =
              vm.filters.ac_CentroOrg1 != null
                ? vm.filters.ac_CentroOrg1.value
                : null;
            var CDepartamento =
              vm.filters.ac_cdprtmntoDestino != null
                ? vm.filters.ac_cdprtmntoDestino.value
                : null;
            var CProvincia =
              vm.filters.an_cprvncaDestino != null
                ? vm.filters.an_cprvncaDestino.value
                : null;
            var CCategoria =
              vm.filters.ac_Categoria != null
                ? vm.filters.ac_Categoria.value
                : null;
            var CEntidad =
              vm.filters.ac_Entidad != null
                ? vm.filters.ac_Entidad.value
                : null;
            var CInstitucion =
              vm.filters.ac_Institucion != null
                ? vm.filters.ac_Institucion.value
                : null;
            var CConvenio =
              vm.filters.ac_Convenio != null
                ? vm.filters.ac_Convenio.value
                : null;
            var CCobertura =
              vm.filters.ac_Cobertura != null
                ? vm.filters.ac_Cobertura.value
                : null;

            var OrdenarRequerimiento =
              vm.filters.ordenaRequerimiento
            var OrdenarCosto =
              vm.filters.ordenaCosto

            var idAfiliado =
              vm.filters.pacienteSelect != null
                ? vm.filters.pacienteSelect.idAfiliado
                : false;
            var numContrato =
              vm.filters.pacienteSelect != null
                ? vm.filters.pacienteSelect.numContrato
                : false;
            var tipoOrigen =
              vm.filters.pacienteSelect != null
                ? vm.filters.pacienteSelect.tipoOrigen
                : false;


            var data = {
              CProveedorOrigen: CProveedorOrigen,
              ListaRequerimientos: vm.filters.listChecked,
              CDepartamento: CDepartamento,
              CProvincia: CProvincia,
              CCategoria: CCategoria,
              CEntidad: CEntidad,
              CInstitucion: CInstitucion,
              CConvenio: CConvenio,
              CCobertura: CCobertura,
              OrdenarRequerimiento: OrdenarRequerimiento,
              CProveedorDestino: CProveedorDestino,
              OrdenarCosto: OrdenarCosto,
              idAfiliado: idAfiliado,
              numContrato: numContrato,
              tipoOrigen: tipoOrigen
            };

            mpSpin.start();
            proxyProveedor
              .BuscarProveedor({
                CProveedorOrigen: CProveedorOrigen,
                ListaRequerimientos: vm.filters.listChecked,
                CDepartamento: CDepartamento,
                CProvincia: CProvincia,
                CCategoria: CCategoria,
                CEntidad: CEntidad,
                CInstitucion: CInstitucion,
                CConvenio: CConvenio,
                CCobertura: CCobertura,
                OrdenarRequerimiento: OrdenarRequerimiento,
                CProveedorDestino: CProveedorDestino,
                OrdenarCosto: OrdenarCosto,
                idAfiliado: idAfiliado,
                numContrato: numContrato,
                tipoOrigen: tipoOrigen
              })
              .then(function (response) {
                mpSpin.end();

                if (response.codErr == 0) {
                  $scope.$parent.ListProveAll = response.listaProveedores.map(
                    function (element) {
                      element.cumple = element.requerimientosCumple.filter(
                        function (req) {
                          return req.cumpleRequerimiento;
                        }
                      ).length;
                      return element;
                    }
                  );

                  pagination();
                  vm.showRest = true;
                  vm.showemptymsg = false;
                } else {
                  vm.showemptymsg = true;
                }
              });
          }
        }

        function pagination() {
          var star = (vm.mPagination - 1) * 5;
          var listAll = angular.copy($scope.$parent.ListProveAll);
          vm.totalItems = $scope.$parent.ListProveAll.length;
          $scope.$parent.ListProve = listAll.slice(star, star + 5);
        }

        function ocultarProveedor() {
          var hideProveedor = vm.filters.ac_TTraslado != null && vm.filters.ac_TTraslado.value != null && vm.filters.ac_TTraslado.value == "4";
          if(hideProveedor) vm.filters.proveTraslado = "";
          return hideProveedor;
        }

        function selectProveedor(item) {
          vm.filters.ac_Traslado = null;
          vm.filters.ac_TTraslado = null;
          vm.filters.proveTraslado = "";
          for (var i = 0; i < $scope.$parent.ListProve.length; i++) {
            var prove = $scope.$parent.ListProve[i];
            prove.showProveedor = prove.idProveedor == item.idProveedor;
          }
          vm.filters.idProveedor = item.idProveedor;
        }

        function editarDestino() {
          vm.edit = true;
          $scope.$parent.ListProve = [];
          vm.showRest = false;
          vm.editp3 = true;
          vm.step = 3;
          vm.oneEdit();
          vm.filters.ac_cdprtmntoDestino = null;
          vm.filters.an_cprvncaDestino = null;
          vm.filters.ac_Categoria = null;
          vm.filters.ac_Entidad = null;
          vm.filters.ac_Institucion = null;
          vm.filters.ac_Convenio = null;
          vm.filters.ac_Cobertura = null;
          vm.filters.ac_CentroDest = null;
        }

        function validarDatosPD() {
          var ac_Traslado =
            vm.filters.ac_Traslado != null &&
            vm.filters.ac_Traslado.value != null;
          var ac_TTraslado =
            vm.filters.ac_TTraslado != null &&
            vm.filters.ac_TTraslado.value != null;
          var proveTraslado =
            vm.filters.proveTraslado != null && vm.filters.proveTraslado != "";
          return ac_Traslado && ac_TTraslado && proveTraslado;
        }

        function showModalGrabar(item) {
          vm.filters.ac_CentroDest1 = {
            Nombre: item.nombre,
            Categoria: item.categoria,
            Direccion: item.direccion,
            Institucion: item.institucion,
            Convenio: item.convenio,
          };
          var vModal = $uibModal.open({
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: "md",
            template:
              "<modal-grabar-refs save='generarRef($observaciones, $requerimientos)' close='close()'></modal-grabar-refs>",
            controller: [
              "$scope",
              "$uibModalInstance",
              function ($scope, $uibModalInstance) {
                $scope.generarRef = function (observaciones, requerimientos) {
                  var data = {
                    requerimientos: requerimientos,
                    observaciones: observaciones,
                  };
                  $uibModalInstance.close(data);
                };

                $scope.close = function () {
                  $uibModalInstance.close();
                };
              },
            ],
          });

          vModal.result.then(function (data) {
            if (data) {
              if (
                data.requerimientos !== undefined &&
                data.requerimientos != null
              ) {
                vm.filters.OtroRqmnto = data.requerimientos;
              }
              if (
                data.observaciones !== undefined &&
                data.observaciones != null
              ) {
                vm.filters.observacion = data.observaciones;
              }

              vm.edit = false;
              vm.showRest = false;

              vm.nextStep({ $data: vm.filters });
            }
          });
        }

        function goStep4(item) {
          vm.filters.ac_CentroDest1 = {
            Nombre: item.nombre,
            Categoria: item.categoria,
            Direccion: item.direccion,
            Institucion: item.institucion,
            Convenio: item.convenio,
          };
          vm.edit = false;
          vm.editp2 = false;
          vm.editp3 = false;

          vm.nextStep({ $data: vm.filters });
        }

      },
    ])
    .component("progressStepThree", {
      templateUrl:
        "/referencias/app/components/progress/progress-step-three.html",
      controller: "progressStepThreeController",
      bindings: {
        step: "=?",
        provedor: "=?",
        masters: "=?",
        filters: "=?",
        edit: "=?",
        showEdit: "=?",
        nextStep: "&?",
        reloadMasters: "&?",
        oneEdit: "&?",
      },
    });
});
