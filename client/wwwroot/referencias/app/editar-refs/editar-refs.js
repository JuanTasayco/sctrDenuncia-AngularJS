define(['angular', 'constants'], function (ng, constants) {

  EditarRefsController.$inject = ['$scope', '$state', '$stateParams', 'mpSpin', 'authorizedResource', 'proxyFiltro', 'proxyReferencia', '$q'];

  function EditarRefsController($scope, $state, $stateParams, mpSpin, authorizedResource, proxyFiltro, proxyReferencia, $q) {
    (
      function onLoad() {
        $scope.masters = {};
        $scope.currentStep = 3;
        $scope.data = {};
        $scope.edit1 = false;
        $scope.edit2 = false;
        $scope.edit3 = false;
        /**/
        $scope.edit4 = false;
        /**/

        $scope.oneEdit1 = function () {
          $scope.edit2 = false;
          $scope.edit3 = false;
          $scope.edit4 = false;
        }

        $scope.oneEdit2 = function () {
          $scope.edit1 = false;
          $scope.edit3 = false;
          $scope.edit4 = false;
          $scope.masters.provinciasDestino = [];
        }

        $scope.oneEdit3 = function () {
          $scope.edit1 = false;
          $scope.edit2 = false;
          $scope.edit4 = false;
        }

        /**/
        $scope.oneEdit4 = function () {
          $scope.edit1 = false;
          $scope.edit2 = false;
          $scope.edit3 = false;
        }
        /**/

        var idReferencia = $stateParams.idReferencia;

        loadInitialData(idReferencia);

        function loadInitialData(idReferencia) {
          mpSpin.start();

          proxyReferencia.DetalleReferencia({ CReferencia: idReferencia })
            .then(function (response) {
              if (response.codErr == 0) {
                $scope.data = response.referencia;
                $scope.data.pacienteSelect = $scope.data.asegurado;
                $scope.data.pacienteSelect.nomCompania = $scope.data.nomCompania;
                $scope.data.pacienteSelect.producto = $scope.data.producto;
                $scope.data.ac_CentroOrg1 = {
                  value: $scope.data.proveedorOrigen.idProveedor,
                  text: $scope.data.proveedorOrigen.nombre
                };
                $scope.data.ac_cdprtmntoOrigen = {
                  value: $scope.data.proveedorOrigen.idDepartamento,
                  text: $scope.data.proveedorOrigen.departamento
                };
                $scope.data.an_cprvncaOrigen = {
                  value: $scope.data.proveedorOrigen.idProvincia,
                  text: $scope.data.proveedorOrigen.provincia
                };
                $scope.data.ac_Condicion = {
                  value: $scope.data.cCondicionIng,
                  text: $scope.data.condicionIng
                };
                $scope.data.ac_Diagnostico = {
                  value: $scope.data.cDiagnosticoIng,
                  text: $scope.data.diagnosticoIng
                };
                $scope.data.refSelect = {
                  value: $scope.data.ctReferencia,
                  text: $scope.data.tReferencia
                };
                $scope.data.ac_Producto = {
                  value: $scope.data.cProducto,
                  text: $scope.data.producto
                };
                $scope.data.tipoReferencia = $scope.data.ctReferencia;
                $scope.data.ac_CentroDest1 = $scope.data.proveedorDestino;
                $scope.data.listChecked = $scope.data.proveedorDestino.requerimientosCumple;
              }
            });

          proxyFiltro.ListarFiltros({ cFiltro: "5", modificador: "" })
            .then(function (response) {
              if (response.codErr == 0) {
                $scope.masters.rProductos = response.listaFiltros;
              }
            });

          proxyFiltro.ListarFiltros({ cFiltro: "1", modificador: "" })
            .then(function (response) {
              if (response.codErr == 0) {
                $scope.masters.departamentos = response.listaFiltros;
              }
            });

          proxyFiltro.ListarFiltros({ cFiltro: "1", modificador: "" })
            .then(function (response) {
              if (response.codErr == 0) {
                $scope.masters.departamentosDestino = response.listaFiltros;
              }
            });

          proxyFiltro.ListarFiltros({ cFiltro: "6", modificador: "" })
            .then(function (response) {
              if (response.codErr == 0) {
                $scope.masters.rCondicion = response.listaFiltros;
              }
            });

          proxyFiltro.ListarFiltros({ cFiltro: "7", modificador: "" })
            .then(function (response) {
              if (response.codErr == 0) {
                $scope.masters.rDiagnostico = response.listaFiltros;
              }
            });

          proxyFiltro.ListarFiltros({ cFiltro: "10", modificador: "" })
            .then(function (response) {
              if (response.codErr == 0) {
                $scope.masters.rInstitucion = response.listaFiltros;
              }
            });

          proxyFiltro.ListarFiltros({ cFiltro: "9", modificador: "" })
            .then(function (response) {
              if (response.codErr == 0) {
                $scope.masters.rEntidad = response.listaFiltros;
              }
            });

          proxyFiltro.ListarFiltros({ cFiltro: "11", modificador: "" })
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
          proxyFiltro.ListarFiltros({ cFiltro: "8", modificador: "" })
            .then(function (response) {
              if (response.codErr == 0) {
                $scope.masters.rCategoria = response.listaFiltros;
              }
            });

          proxyFiltro.ListarFiltros({ cFiltro: "20", modificador: "" })
            .then(function (response) {
              if (response.codErr == 0) {
                $scope.masters.rCentroOrg = response.listaFiltros;
              }
            });

          proxyFiltro.ListarFiltros({ cFiltro: "3", modificador: "" })
            .then(function (response) {
              if (response.codErr == 0) {
                $scope.masters.tipos = response.listaFiltros;
              }
            });

          proxyFiltro.ListarFiltros({ cFiltro: "13", modificador: "" })
            .then(function (response) {
              if (response.codErr == 0) {
                $scope.masters.rServicios = response.listaFiltros;
              }
            });

          proxyFiltro.ListarFiltros({ cFiltro: "14", modificador: "" })
            .then(function (response) {
              if (response.codErr == 0) {
                $scope.masters.rImagen = response.listaFiltros;
              }
            });

          proxyFiltro.ListarFiltros({ cFiltro: "15", modificador: "" })
            .then(function (response) {
              if (response.codErr == 0) {
                $scope.masters.rEmergencia = response.listaFiltros;
              }
            });

          proxyFiltro.ListarFiltros({ cFiltro: "16", modificador: "" })
            .then(function (response) {
              if (response.codErr == 0) {
                $scope.masters.rEspecialidad = response.listaFiltros;
              }
            });

          proxyFiltro.ListarFiltros({ cFiltro: "17", modificador: "" })
            .then(function (response) {
              if (response.codErr == 0) {
                $scope.masters.rTraslado = response.listaFiltros;
              }
            });

          proxyFiltro.ListarFiltros({ cFiltro: "18", modificador: "" })
            .then(function (response) {
              if (response.codErr == 0) {
                $scope.masters.rTTraslado = response.listaFiltros;
              }
            });

          proxyFiltro.ListarFiltros({ cFiltro: "20", modificador: "" })
            .then(function (response) {
              if (response.codErr == 0) {
                $scope.masters.proveedor = response.listaFiltros;
              }
            });

          proxyFiltro.ListarFiltros({ cFiltro: "21", modificador: "" })
            .then(function (response) {
              if (response.codErr == 0) {
                $scope.masters.proveTras = response.listaFiltros;
              }
            });

          mpSpin.end();
        }

        $scope.reloadFiltersData = function (search, params, showLoad) {
          switch (search) {
            case 'prvnceOrgn':
              if (params.cFiltro, params.modificador) {
                if (showLoad) mpSpin.start();

                proxyFiltro.ListarFiltros(params)
                  .then(function (response) {
                    if (response.codErr == 0) {
                      $scope.masters.provinciasOrigen = response.listaFiltros;
                    }
                  });

                if (showLoad) mpSpin.end();
              } else {
                $scope.masters.provincias = [];
              }
              break;
            case 'prvnceDstn':
              if (params.cFiltro, params.modificador) {
                if (showLoad) mpSpin.start();

                proxyFiltro.ListarFiltros(params)
                  .then(function (response) {
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
        }

        $scope.goNextStep = function (data, loadMapa, step) {
          $scope.currentStep = step;
          $scope.loadMapa = step == 2 && loadMapa;

          // Guardar editar paso 2
          if (step == 3) {

            var refEditPaso2 = {
              "cReferencia": $stateParams.idReferencia,
              "isEdit": true,
              "CProveedorOrigen": "",
              "CTReferencia": "",
              "NomRspnsble": "",
              "NelRspnsble": "",
              "MailRspnsble": "",
              "CCondicionIngr": "",
              "CDiagnosticoIngr": "",
              "CodUsuMAPFRE": authorizedResource.profile.loginUserName
            }

            if ($scope.data) {
              if ($scope.data.nomRspnsble) refEditPaso2.NomRspnsble = $scope.data.nomRspnsble;
              if ($scope.data.telRspnsble) refEditPaso2.TelRspnsble = $scope.data.telRspnsble;
              if ($scope.data.mailRspnsble) refEditPaso2.MailRspnsble = $scope.data.mailRspnsble;
              if ($scope.data.tipoReferencia) refEditPaso2.CTReferencia = $scope.data.tipoReferencia;

              if ($scope.data.ac_Condicion && $scope.data.ac_Condicion.value) {
                refEditPaso2.CCondicionIngr = $scope.data.ac_Condicion.value;
              }
              if ($scope.data.ac_Diagnostico && $scope.data.ac_Diagnostico.value) {
                refEditPaso2.CDiagnosticoIngr = $scope.data.ac_Diagnostico.value;
              }
              if ($scope.data.ac_CentroOrg1 && $scope.data.ac_CentroOrg1.value) {
                refEditPaso2.CProveedorOrigen = $scope.data.ac_CentroOrg1.value;
              }
            }

            mpSpin.start();
            proxyReferencia.EditarReferenciaP2(refEditPaso2)
              .then(function (response) {
                mpSpin.end();
                if (response.codErr == 0) {
                  $state.go('resumen', { idReferencia: $stateParams.idReferencia, DescargaPdf: true, isEdit: false });
                }
              }, function (response) {
                mpSpin.end();
              });
          }

          // Guardar editar paso 3
          if (step == 4) {
            var refEditPaso3 = {
              "CReferencia": $stateParams.idReferencia,
              "isEdit": true,
              "CProveedorDestino": "",
              "ListaRequerimientos": [],
              "FRefeForzada": false,
              "CProvMeTraslado": "",
              "CTipMeTraslado": "",
              "CMeTraslado": "",
              "Observacion": "",
              "OtroRqmnto": "",
              "CodUsuMAPFRE": authorizedResource.profile.loginUserName
            }

            if ($scope.data) {
              refEditPaso3.FRefeForzada = $scope.data.fRefeForzada != null ? $scope.data.fRefeForzada : false;
              if ($scope.data.idProveedor) refEditPaso3.CProveedorDestino = $scope.data.idProveedor;
              if ($scope.data.observacion) refEditPaso3.Observacion = $scope.data.observacion;
              if ($scope.data.otroRqmnto) refEditPaso3.OtroRqmnto = $scope.data.OtroRqmnto;
              if ($scope.data.listChecked) refEditPaso3.ListaRequerimientos = $scope.data.listChecked;

              if ($scope.data.proveTraslado && $scope.data.proveTraslado.value) {
                refEditPaso3.CProvMeTraslado = $scope.data.proveTraslado.value;
              }
              if ($scope.data.ac_TTraslado && $scope.data.ac_TTraslado.value) {
                refEditPaso3.CTipMeTraslado = $scope.data.ac_TTraslado.value;
              }
              if ($scope.data.ac_Traslado && $scope.data.ac_Traslado.value) {
                refEditPaso3.CMeTraslado = $scope.data.ac_Traslado.value;
              }
            }

            mpSpin.start();
            proxyReferencia.EditarReferenciaP3(refEditPaso3)
              .then(function (response) {
                mpSpin.end();
                if (response.codErr == 0) {
                  $state.go('resumen', { idReferencia: $stateParams.idReferencia, DescargaPdf: true, isEdit: false });
                }
              }, function (response) {
                mpSpin.end();
              });
          }

          // Guardar editar paso 4
          if (step == 5) {

            var refEditPaso4 = {
              "CReferencia": $stateParams.idReferencia,
              "isEdit": true,
              //"CProveedorDestino": "",
              //"ListaRequerimientos": [],
              //"FRefeForzada": false,
              //"CProvMeTraslado": "",
              //"CTipMeTraslado": "",
              //"CMeTraslado": "",
              "Observacion": "",
              "OtroRqmnto": "",
              "CodUsuMAPFRE": authorizedResource.profile.loginUserName,
              "resumenHistClinica": ""
            }

            if ($scope.data) {
              //refEditPaso4.FRefeForzada = $scope.data.fRefeForzada != null ? $scope.data.fRefeForzada : false;
              //if ($scope.data.idProveedor) refEditPaso4.CProveedorDestino = $scope.data.idProveedor;
              //if ($scope.data.observacion) refEditPaso4.Observacion = $scope.data.observacion;
              //if ($scope.data.otroRqmnto) refEditPaso4.OtroRqmnto = $scope.data.OtroRqmnto;
              //if ($scope.data.listChecked) refEditPaso4.ListaRequerimientos = $scope.data.listChecked;
              /*
              if ($scope.data.proveTraslado && $scope.data.proveTraslado.value) {
                refEditPaso4.CProvMeTraslado = $scope.data.proveTraslado.value;
              }
              if ($scope.data.ac_TTraslado && $scope.data.ac_TTraslado.value) {
                refEditPaso4.CTipMeTraslado = $scope.data.ac_TTraslado.value;
              }
              if ($scope.data.ac_Traslado && $scope.data.ac_Traslado.value) {
                refEditPaso4.CMeTraslado = $scope.data.ac_Traslado.value;
              }
              */
              if ($scope.data.ResumenHistClinica) {
                refEditPaso4.resumenHistClinica = $scope.data.ResumenHistClinica;
              }
              if ($scope.data.OtroRqmnto) {
                refEditPaso4.OtroRqmnto = $scope.data.OtroRqmnto;
              }
              if ($scope.data.observacion) {
                refEditPaso4.Observacion = $scope.data.observacion;
              }

            }

            mpSpin.start();
            proxyReferencia.EditarReferenciaP4(refEditPaso4)
              .then(function (response) {

                mpSpin.end();
                if (response.codErr == 0) {
                  $state.go('resumen', { idReferencia: $stateParams.idReferencia, DescargaPdf: true, isEdit: false });
                }
              }, function (response) {
                mpSpin.end();
              });

          }


        }
      }
    )();
  }

  return ng.module('referencias.app')
    .controller('EditarRefsController', EditarRefsController);
});

