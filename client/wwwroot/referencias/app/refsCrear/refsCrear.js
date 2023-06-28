define(["angular", "constants"], function (ng, constants) {
  RefsCrearController.$inject = [
    "$scope",
    "$state",
    "mpSpin",
    "authorizedResource",
    "proxyFiltro",
    "proxyProveedor",
    "proxyReferencia",
    "$q",
  ];

  function RefsCrearController(
    $scope,
    $state,
    mpSpin,
    authorizedResource,
    proxyFiltro,
    proxyProveedor,
    proxyReferencia,
    $q
  ) {
    (function onLoad() {
      $scope.masters = {};
      $scope.currentStep = 1;
      $scope.data = {};
      $scope.searchEspecialidades = searchEspecialidades;
      $scope.ListProve = [];
      $scope.ListProveAll = [];
      $scope.edit1 = true;
      $scope.edit2 = true;
      $scope.edit3 = true;
      /**/
      $scope.edit4 = true;
      /**/
      loadDataFilters();

      $scope.oneEdit1 = function () {
        $scope.edit1 = false;
        $scope.edit2 = true;
        $scope.edit3 = true;
        $scope.loadMapa = false;
      };

      $scope.oneEdit2 = function () {
        $scope.edit1 = false;
        $scope.edit2 = true;
        $scope.edit3 = true;
      };

      $scope.oneEdit3 = function () {
        $scope.edit1 = false;
        $scope.edit2 = true;
        $scope.edit3 = true;
      };
      /**/
      $scope.oneEdit4 = function () {
        //$scope.edit1 = false;
        //$scope.edit2 = true;
        //$scope.edit3 = true;
        $scope.edit4 = true;
      };
      /**/
      function loadDataFilters(data) {
        mpSpin.start();

        proxyFiltro
          .ListarFiltros({ cFiltro: "5", modificador: "" })
          .then(function (response) {
            if (response.codErr == 0) {
              response.listaFiltros;
              $scope.masters.rProductos = response.listaFiltros;
            }
          });

        proxyFiltro
          .ListarFiltros({ cFiltro: "1", modificador: "" })
          .then(function (response) {
            if (response.codErr == 0) {
              $scope.masters.departamentos = response.listaFiltros;
            }
          });

        proxyFiltro
          .ListarFiltros({ cFiltro: "1", modificador: "" })
          .then(function (response) {
            if (response.codErr == 0) {
              $scope.masters.departamentosDestino = response.listaFiltros;
            }
          });

        proxyFiltro
          .ListarFiltros({ cFiltro: "6", modificador: "" })
          .then(function (response) {
            if (response.codErr == 0) {
              $scope.masters.rCondicion = response.listaFiltros;
            }
          });
        proxyFiltro
          .ListarFiltros({ cFiltro: "10", modificador: "" })
          .then(function (response) {
            if (response.codErr == 0) {
              $scope.masters.rInstitucion = response.listaFiltros;
            }
          });
        proxyFiltro
          .ListarFiltros({ cFiltro: "9", modificador: "" })
          .then(function (response) {
            if (response.codErr == 0) {
              $scope.masters.rEntidad = response.listaFiltros;
            }
          });
        proxyFiltro
          .ListarFiltros({ cFiltro: "11", modificador: "" })
          .then(function (response) {
            if (response.codErr == 0) {
              $scope.masters.rConvenio = response.listaFiltros;
            }
          });
        /**/
        proxyFiltro
          .ListarFiltros({ cFiltro: "26", modificador: "" })
          .then(function (response) {
            if (response.codErr == 0) {
              $scope.masters.rCobertura = response.listaFiltros;
            }
          });
        /**/
        proxyFiltro
          .ListarFiltros({ cFiltro: "8", modificador: "" })
          .then(function (response) {
            if (response.codErr == 0) {
              $scope.masters.rCategoria = response.listaFiltros;
            }
          });
        proxyProveedor
          .BuscarProveedor({ cFiltro: "20", modificador: "" })
          .then(function (response) {
            if (response.codErr == 0) {
              $scope.masters.rCentroOrg = response.listaFiltros;
            }
          });
        proxyFiltro
          .ListarFiltros({ cFiltro: "3", modificador: "" })
          .then(function (response) {
            if (response.codErr == 0) {
              $scope.masters.tipos = response.listaFiltros;
            }
          });
        proxyFiltro
          .ListarFiltros({ cFiltro: "13", modificador: "" })
          .then(function (response) {
            if (response.codErr == 0) {
              $scope.masters.rServicios = response.listaFiltros;
            }
          });
        proxyFiltro
          .ListarFiltros({ cFiltro: "14", modificador: "" })
          .then(function (response) {
            if (response.codErr == 0) {
              $scope.masters.rImagen = response.listaFiltros;
            }
          });

        proxyFiltro
          .ListarFiltros({ cFiltro: "15", modificador: "" })
          .then(function (response) {
            if (response.codErr == 0) {
              $scope.masters.rEmergencia = response.listaFiltros;
            }
          });
        proxyFiltro
          .ListarFiltros({ cFiltro: "16", modificador: "" })
          .then(function (response) {
            if (response.codErr == 0) {
              $scope.masters.rEspecialidad = response.listaFiltros;
            }
          });
        proxyFiltro
          .ListarFiltros({ cFiltro: "17", modificador: "" })
          .then(function (response) {
            if (response.codErr == 0) {
              $scope.masters.rTraslado = response.listaFiltros;
            }
          });
        proxyFiltro
          .ListarFiltros({ cFiltro: "18", modificador: "" })
          .then(function (response) {
            if (response.codErr == 0) {
              $scope.masters.rTTraslado = response.listaFiltros;
            }
          });

        proxyFiltro
          .ListarFiltros({ cFiltro: "21", modificador: "" })
          .then(function (response) {
            if (response.codErr == 0) {
              $scope.masters.proveTras = response.listaFiltros;
            }
          });

        mpSpin.end();
      }

      function searchEspecialidades(search) {
        if (search && search.length >= 3) {
          var defer = $q.defer();
          proxyFiltro
            .ListarFiltros({ cFiltro: "16", modificador: search })
            .then(function (response) {
              if (response.codErr == 0) defer.resolve(response.listaFiltros);
            });
          return defer.promise;
        }
      }

      $scope.reloadFiltersData = function (search, params, showLoad) {
        switch (search) {
          case "prvnceOrgn":
            if ((params.cFiltro, params.modificador)) {
              if (showLoad) mpSpin.start();
              proxyFiltro.ListarFiltros(params).then(function (response) {
                if (response.codErr == 0) {
                  $scope.masters.provinciasOrigen = response.listaFiltros;
                }
              });
              if (showLoad) mpSpin.end();
            } else {
              $scope.masters.provinciasOrigen = [];
            }
            break;
          case "prvnceDstn":
            if ((params.cFiltro, params.modificador)) {
              if (showLoad) mpSpin.start();
              proxyFiltro.ListarFiltros(params).then(function (response) {
                if (response.codErr == 0) {
                  $scope.masters.provinciasDestino = response.listaFiltros;
                }
              });
              if (showLoad) mpSpin.end();
            } else {
              $scope.masters.provinciasDestino = [];
            }
            break;
        }
      };

      $scope.goNextStep = function (data, loadMapa, step) {
        $scope.currentStep = step;
        $scope.loadMapa = step == 2 && loadMapa;

        if (step == 3) $scope.masters.provinciasDestino = [];

        if (step == 4) {
          /*
          var refsCrear = {
            CTipOrigAseg: "",
            CAsegurado: "",
            TNdoc: "",
            Ndoc: "",
            CProveedorOrigen: "",
            CProveedorDestino: "",
            ListaRequerimientos: [],
            CodCompania: "",
            CTReferencia: "",
            CProducto: "",
            NomRspnsble: "",
            TelRspnsble: "",
            MailRspnsble: "",
            CCondicionIngr: "",
            CDiagnosticoIngr: "",
            CProvMeTraslado: "",
            CTipMeTraslado: "",
            CMeTraslado: "",
            NumAutorizacion: "",
            NumContrato: "",
            Observacion: "",
            OtroRqmnto: "",
            CodUsuMAPFRE: authorizedResource.profile.loginUserName,
          };
          if ($scope.data) {
            refsCrear.FRefeForzada = $scope.data.fRefeForzada != null ? $scope.data.fRefeForzada : false;
            if ($scope.data.nomRspnsble)
              refsCrear.NomRspnsble = $scope.data.nomRspnsble;
            if ($scope.data.telRspnsble)
              refsCrear.TelRspnsble = $scope.data.telRspnsble;
            if ($scope.data.mailRspnsble)
              refsCrear.MailRspnsble = $scope.data.mailRspnsble;
            if ($scope.data.idProveedor)
              refsCrear.CProveedorDestino = $scope.data.idProveedor;
            if ($scope.data.tipoReferencia)
              refsCrear.CTReferencia = $scope.data.tipoReferencia;
            if ($scope.data.observacion)
              refsCrear.Observacion = $scope.data.observacion;
            if ($scope.data.OtroRqmnto)
              refsCrear.OtroRqmnto = $scope.data.OtroRqmnto;
            if ($scope.data.listChecked)
              refsCrear.ListaRequerimientos = $scope.data.listChecked;

            if ($scope.data.ac_Condicion && $scope.data.ac_Condicion.value) {
              refsCrear.CCondicionIngr = $scope.data.ac_Condicion.value;
            }
            if (
              $scope.data.ac_Diagnostico &&
              $scope.data.ac_Diagnostico.value
            ) {
              refsCrear.CDiagnosticoIngr = $scope.data.ac_Diagnostico.value;
            }
            if ($scope.data.proveTraslado && $scope.data.proveTraslado.value) {
              refsCrear.CProvMeTraslado = $scope.data.proveTraslado.value;
            }
            if ($scope.data.ac_TTraslado && $scope.data.ac_TTraslado.value) {
              refsCrear.CTipMeTraslado = $scope.data.ac_TTraslado.value;
            }
            if ($scope.data.ac_Traslado && $scope.data.ac_Traslado.value) {
              refsCrear.CMeTraslado = $scope.data.ac_Traslado.value;
            }
            if ($scope.data.ac_CentroOrg1 && $scope.data.ac_CentroOrg1.value) {
              refsCrear.CProveedorOrigen = $scope.data.ac_CentroOrg1.value;
            }

            if ($scope.data.pacienteSelect) {
              if ($scope.data.pacienteSelect.tipoOrigen)
                refsCrear.CTipOrigAseg = $scope.data.pacienteSelect.tipoOrigen;
              if ($scope.data.pacienteSelect.oSiteds)
                refsCrear.NumAutorizacion =
                  $scope.data.pacienteSelect.oSiteds.numAutorizacion;
              if ($scope.data.pacienteSelect.idAfiliado)
                refsCrear.CAsegurado = $scope.data.pacienteSelect.idAfiliado;
              if ($scope.data.pacienteSelect.tipDoc)
                refsCrear.TNdoc = $scope.data.pacienteSelect.tipDoc;
              if ($scope.data.pacienteSelect.numDoc)
                refsCrear.Ndoc = $scope.data.pacienteSelect.numDoc;
              if ($scope.data.pacienteSelect.codCompania)
                refsCrear.CodCompania = $scope.data.pacienteSelect.codCompania;
              if ($scope.data.pacienteSelect.codProducto)
                refsCrear.CProducto = $scope.data.pacienteSelect.codProducto;
              if ($scope.data.pacienteSelect.numContrato)
                refsCrear.NumContrato = $scope.data.pacienteSelect.numContrato;
            }
          }
          */
          /*
          mpSpin.start();
          proxyReferencia.NuevaReferencia(refsCrear).then(
            function (response) {
              mpSpin.end();
              if (response.codErr == 0) {
                $state.go("resumen", {
                  idReferencia: response.idReferencia,
                  DescargaPdf: true,
                  isEdit: true,
                });
              }
            },
            function (response) {
              mpSpin.end();
            }
          );
           */
        }

        if (step == 5) {
          console.log("$scope.data-> ",$scope.data)

          var refsCrear = {
            CTipOrigAseg: "",
            CAsegurado: "",
            TNdoc: "",
            Ndoc: "",
            CProveedorOrigen: "",
            CProveedorDestino: "",
            ListaRequerimientos: [],
            CodCompania: "",
            CTReferencia: "",
            CProducto: "",
            NomRspnsble: "",
            TelRspnsble: "",
            MailRspnsble: "",
            CCondicionIngr: "",
            CDiagnosticoIngr: "",
            CProvMeTraslado: "",
            CTipMeTraslado: "",
            CMeTraslado: "",
            NumAutorizacion: "",
            NumContrato: "",
            Observacion: "",
            OtroRqmnto: "",
            ResumenHistClinica: "",
          };
          if ($scope.data) {
            refsCrear.FRefeForzada = $scope.data.fRefeForzada != null ? $scope.data.fRefeForzada : false;
            if ($scope.data.nomRspnsble)
              refsCrear.NomRspnsble = $scope.data.nomRspnsble;
            if ($scope.data.telRspnsble)
              refsCrear.TelRspnsble = $scope.data.telRspnsble;
            if ($scope.data.mailRspnsble)
              refsCrear.MailRspnsble = $scope.data.mailRspnsble;
            if ($scope.data.idProveedor)
              refsCrear.CProveedorDestino = $scope.data.idProveedor;
            if ($scope.data.tipoReferencia)
              refsCrear.CTReferencia = $scope.data.tipoReferencia;
            if ($scope.data.observacion)
              refsCrear.Observacion = $scope.data.observacion;
            if ($scope.data.OtroRqmnto)
              refsCrear.OtroRqmnto = $scope.data.OtroRqmnto;
            if ($scope.data.ResumenHistClinica)
              refsCrear.ResumenHistClinica = $scope.data.ResumenHistClinica;
            if ($scope.data.listChecked)
              refsCrear.ListaRequerimientos = $scope.data.listChecked;

            if ($scope.data.ac_Condicion && $scope.data.ac_Condicion.value) {
              refsCrear.CCondicionIngr = $scope.data.ac_Condicion.value;
            }
            if (
              $scope.data.ac_Diagnostico &&
              $scope.data.ac_Diagnostico.value
            ) {
              refsCrear.CDiagnosticoIngr = $scope.data.ac_Diagnostico.value;
            }
            if ($scope.data.proveTraslado && $scope.data.proveTraslado.value) {
              refsCrear.CProvMeTraslado = $scope.data.proveTraslado.value;
            }
            if ($scope.data.ac_TTraslado && $scope.data.ac_TTraslado.value) {
              refsCrear.CTipMeTraslado = $scope.data.ac_TTraslado.value;
            }
            if ($scope.data.ac_Traslado && $scope.data.ac_Traslado.value) {
              refsCrear.CMeTraslado = $scope.data.ac_Traslado.value;
            }
            if ($scope.data.ac_CentroOrg1 && $scope.data.ac_CentroOrg1.value) {
              refsCrear.CProveedorOrigen = $scope.data.ac_CentroOrg1.value;
            }

            if ($scope.data.pacienteSelect) {
              if ($scope.data.pacienteSelect.tipoOrigen)
                refsCrear.CTipOrigAseg = $scope.data.pacienteSelect.tipoOrigen;
              if ($scope.data.pacienteSelect.oSiteds)
                refsCrear.NumAutorizacion =
                  $scope.data.pacienteSelect.oSiteds.numAutorizacion;
              if ($scope.data.pacienteSelect.idAfiliado)
                refsCrear.CAsegurado = $scope.data.pacienteSelect.idAfiliado;
              if ($scope.data.pacienteSelect.tipDoc)
                refsCrear.TNdoc = $scope.data.pacienteSelect.tipDoc;
              if ($scope.data.pacienteSelect.numDoc)
                refsCrear.Ndoc = $scope.data.pacienteSelect.numDoc;
              if ($scope.data.pacienteSelect.codCompania)
                refsCrear.CodCompania = $scope.data.pacienteSelect.codCompania;
              if ($scope.data.pacienteSelect.codProducto)
                refsCrear.CProducto = $scope.data.pacienteSelect.codProducto;
              if ($scope.data.pacienteSelect.numContrato)
                refsCrear.NumContrato = $scope.data.pacienteSelect.numContrato;
            }
          }
          console.log("refsCrear-> ",refsCrear)

          mpSpin.start();
          proxyReferencia.NuevaReferencia(refsCrear).then(
            function (response) {
              mpSpin.end();
              if (response.codErr == 0) {
                $state.go("resumen", {
                  idReferencia: response.idReferencia,
                  DescargaPdf: true,
                  isEdit: true,
                });
              }
            },
            function (response) {
              mpSpin.end();
            }
          );

        }

      };
    })();
  }

  return ng
    .module("referencias.app")
    .controller("RefsCrearController", RefsCrearController);
});
