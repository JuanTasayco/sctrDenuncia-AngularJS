(function($root, deps, action) {
    define(deps, action)
})(this, ['angular', 'constants', 'lodash',
        '/polizas/app/autos/autosCotizar2/service/autosCotizarFactory.js',
        '/scripts/mpf-main-controls/components/modalConfirmation/component/modalConfirmation.js',
        '/scripts/mpf-main-controls/components/modalSteps/component/modalSteps.js',
        '/polizas/app/autos/autosHome/service/autosFactory.js',
    ],
    function(angular, constants, _) {
        angular.module("appAutos").controller('autosCotizarS3', ['$scope', '$state','$filter', 'autosFactory', 'autosCotizarFactory', 'mpSpin', '$uibModal', 'mModalAlert', '$rootScope', 'oimPrincipal', 'mModalConfirm', 'mainServices', 'oimAbstractFactory','proxyGeneral',
            function($scope, $state, $filter, autosFactory, autosCotizarFactory, mpSpin, $uibModal, mModalAlert, $rootScope, oimPrincipal, mModalConfirm, mainServices, oimAbstractFactory, proxyGeneral) {

            var vm = this;
            vm.$onInit = onInit;

            function onInit() {
                $scope.formData = $rootScope.formData || {};
                $scope.formData.codigoUsuario = $scope.mAgente.codigoUsuario;
                $scope.formData.codigoUsuarioRED = $scope.mAgente.codigoUsuario;
                $scope.formData.inicio = autosCotizarFactory.formatearFecha($scope.formData.inicioVigencia);
                $scope.formData.fin  = autosCotizarFactory.formatearFecha($scope.formData.finVigencia);

                if ($scope.formData.mProducto != null) {
                    loadProductoPrincipal($scope.formData.mProducto.CodigoProducto,
                                            $scope.formData.mProducto.NombreProducto,
                                            $scope.formData.mProducto.CodigoModalidad);
                    loadProductosRel($scope.formData.mProducto.CodigoProducto);
                } else {
                    $state.go('.', {
                        step: 2
                    });
                }
            };

        $scope.$watch("formData", function(nv) {
          $rootScope.formData = nv;
        });

        $scope.gLblDctComision = {
          label: "Aplicar descuento por comisión",
          required: false,
          error1: "* Este campo es obligatorio",
          defaultValue: "- % -"
        };

        $scope.gLblDctComercial = {
          label: "Aplicar descuento comercial",
          required: false,
          error1: "* Este campo es obligatorio",
          defaultValue: "- % -",
          flgValue: "S"
        };

        $scope.optionsDsctoComercial = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function(dscto) { return { DsctoEspValor: dscto + '%', DsctoComercial: -1 * dscto };  });


        $scope.gLblTipoDocumento = {
          label: "Tipo de Documento",
          required: true,
          error1: "* Este campo es obligatorio",
          defaultValue: "- SELECCIONE -"
        };
        $scope.gLblNombre = {
          label: "Nombre",
          required: true,
          error1: "Error lorem ipsum error lorem ipsum"
        };
        $scope.gLblApePaterno = {
          label: "Apellido Paterno",
          required: true,
          error1: "Error lorem ipsum error lorem ipsum"
        };
        $scope.gLblRazSocial = {
          label: "Razón Social",
          required: true,
          error1: "Error lorem ipsum error lorem ipsum"
        };
        $scope.gLblNumeroDocumento = {
          label: "Número de documento",
          required: true,
          error1: "Error lorem ipsum error lorem ipsum"
        };

        $scope.gLblOpcionContratante = {
          label: "Datos del contratante",
          required: true,
          error1: "* Este campo es obligatorio",
          defaultValue: "- SELECCIONE -"
        };

        $scope.bDatosContratante = 0;
        $scope.bDatosPolizaGrupo = 0;

        // Radio
        $scope.gLblSi = {
          label: "Si",
          required: true,
          error1: "* Este campo es obligatorio"
        };
        $scope.gLblNo = {
          label: "No",
          required: true,
          error1: "* Este campo es obligatorio"
        };

        $scope.si = {
          name: "optMostrarMDolar",
          value: "1"
        };
        $scope.no = {
          name: "optMostrarMDolar",
          value: "2"
        };

        var codProductos = [];

        getEncuesta();

        function getEncuesta(){
          var codCia = constants.module.polizas.autos.companyCode;
          var codeRamo = constants.module.polizas.autos.codeRamo;
  
          proxyGeneral.GetEncuesta(codCia, codeRamo, false).then(function(response) {
            if(response.OperationCode == constants.operationCode.success){
              if (Object.keys(response.Data.Pregunta).length > 0){
                $scope.encuesta = response.Data;
              }else{
                $scope.encuesta = {};
                $scope.encuesta.mostrar = 0;
              }
            }
          }, function(error){
            console.log('Error en getEncuesta: ' + error);
          })
        }

        // Producto Principal
        function loadProductoPrincipal(codigo, nombre, modalidad) {
          $scope.prdPrincipal = {};
          $scope.prdPrincipal.id = "prdPrincipal" + codigo;
          $scope.prdPrincipal.label = nombre;
          $scope.prdPrincipal.ppal = 1;
          $scope.prdPrincipal.name = "prdPrincipal" + codigo;
          $scope.prdPrincipal.val = false;
          $scope.prdPrincipal.codigoProducto = codigo;
          $scope.prdPrincipal.codigoModalidad = modalidad;
          $scope.prdPrincipal.primaneta = -1;
          $scope.prdPrincipal.Model = "mValorDcts";
          $scope.prdPrincipal.ModelC = "mValorDctsC";
          $scope.prdPrincipal.DsctoPorComision = 0;
          $scope.prdPrincipal.DsctoComercial = 0;
          $scope.prdPrincipal.TotalDscto = 0;
          $scope.prdPrincipal.TuComision = 0;
          $scope.prdPrincipal.FlgAplicaDsctoComision = "N";
          $scope.prdPrincipal.flgDsctoComercial = "N";
          $scope.prdPrincipal.Descuentos = [];
		  $scope.prdPrincipal.OptionsDsctoComercial = [];
          $scope.prdPrincipal.cotizado = true;
          $scope.prdPrincipal.MensajeError = "";

          reset = true;
          codProductos.push($scope.prdPrincipal.codigoProducto);
        }

        // Producto Relacionado
        function loadProductosRel(codProducto) {
          var vParams = codProducto;

          autosCotizarFactory
            .getProductsRel(vParams)
            .then(function(response) {
              if (response.OperationCode == constants.operationCode.success) {
                $scope.productosrel = response.Data;
                //eliminamos primer elemento
                $scope.productosrel.shift();
                $scope.prgRelacionados = [];

                angular.forEach($scope.productosrel, function(value, key) {
                  if (value.CodigoProducto != $scope.prdPrincipal.codigoProducto) {
                    $scope.prgRelacionados[key] = {};
                    $scope.prgRelacionados[key].id = "prdRelacionado" + value.CodigoProducto;
                    $scope.prgRelacionados[key].label = value.NombreProducto;
                    $scope.prgRelacionados[key].name = "prdRelacionado" + value.CodigoProducto;
                    if (value.CodigoProducto == $scope.formData.mProducto.CodigoProducto) {
                      $scope.prgRelacionados[key].ppal = 1;
                    } else {
                      $scope.prgRelacionados[key].ppal = 0;
                    }

                    $scope.prgRelacionados[key].class = "";
                    $scope.prgRelacionados[key].val = false;
                    $scope.prgRelacionados[key].codigoProducto = value.CodigoProducto;
                    $scope.prgRelacionados[key].nombreProducto = value.NombreProducto;
                    $scope.prgRelacionados[key].codigoModalidad = value.CodigoModalidad;
                    $scope.prgRelacionados[key].codigoFamProducto = value.CodigoFamProducto;
                    $scope.prgRelacionados[key].primaneta = -1;
                    $scope.prgRelacionados[key].primaneta2 = -1;
                    $scope.prgRelacionados[key].Model = "mValorDcts" + value.CodigoProducto;
                    $scope.prgRelacionados[key].ModelC = "mValorDctsC" + value.CodigoProducto;
                    $scope.prgRelacionados[key].DsctoPorComision = 0;
                    $scope.prgRelacionados[key].DsctoComercial = 0;
                    $scope.prgRelacionados[key].TotalDscto = 0;
                    $scope.prgRelacionados[key].TuComision = 0;
                    $scope.prgRelacionados[key].FlgAplicaDsctoComision = "N";
                    $scope.prgRelacionados[key].flgDsctoComercial = "N";
                    $scope.prgRelacionados[key].Descuentos = []; //[{ 'DsctoEspValor': 0, 'DsctoEspecial': 0, 'AgenteComision': 0 } ];
					$scope.prgRelacionados[key].OptionsDsctoComercial = []; //[{ DsctoEspValor: 0 %, DsctoComercial: 0 } ];
                    $scope.prgRelacionados[key].cotizado = true;
                    $scope.prgRelacionados[key].MensajeError = "";

                    codProductos.push(value.CodigoProducto);
                  } else if (value.CodigoProducto === $scope.prdPrincipal.codigoProducto && key === 0) {
                    $scope.prdPrincipal.label = value.NombreProducto;
                  }
                });
                $scope.showList = true;
                loadAllDescuentos();
              } else if (response.Message.length > 0) {
                $scope.showList = false;
              }
            })
            .catch(function(error) {
              console.log("Error en loadProductosRel: " + error);
            });
        }

        function loadAllDescuentos() {
          //setear campos
          var vParams = {
            CodigoCia: constants.module.polizas.autos.companyCode, //$scope.formData.codigoCompania,
            CodigoAgente: $scope.mAgente.codigoAgente, //12 // 3159,//
            CodigosProductos: codProductos,
            Vehiculo: {
              CodigoUso: $scope.formData.mUsoRiesgo.Codigo,
              CodigoTipoVehiculo: $scope.formData.mSubModelo.Tipo,
			  
			  CodigoMarca: $scope.formData.ModeloMarca.codigoMarca,
			  CodigoModelo: $scope.formData.ModeloMarca.codigoModelo,
			  CodigoTipo: $scope.formData.mTipoVehiculo.CodigoTipo,
			  AnioFabricacion: $scope.formData.mYearFabric.Codigo
            },
            CodigoMoneda: constants.module.polizas.autos.codeCurrency
          };

          autosCotizarFactory
            .getDescComision(vParams)
            .then(function(response) {
              if (response.OperationCode == constants.operationCode.success) {
                $scope.AllDescuentos = response.Data.Dsctos;
                angular.forEach($scope.AllDescuentos, function(value, key) {
                  if ($scope.AllDescuentos[key].CodigoProducto == $scope.prdPrincipal.codigoProducto) {
                    $scope.prdPrincipal.Descuentos = $scope.AllDescuentos[key].Items;
					$scope.prdPrincipal.OptionsDsctoComercial = $scope.AllDescuentos[key].ItemsComercial;
                    $scope.prdPrincipal.flgDsctoComercial = $scope.AllDescuentos[key].FlgDsctoComercial;
                  } else {
                    angular.forEach($scope.prgRelacionados, function(value2, key2) {
                      if ($scope.AllDescuentos[key].CodigoProducto == $scope.prgRelacionados[key2].codigoProducto) {
                        $scope.prgRelacionados[key2].Descuentos = $scope.AllDescuentos[key].Items;
						$scope.prgRelacionados[key2].OptionsDsctoComercial = $scope.AllDescuentos[key].ItemsComercial;
                        $scope.prgRelacionados[key2].flgDsctoComercial = $scope.AllDescuentos[key].FlgDsctoComercial;
                      }
                    });
                  }
                });
              }
            })
            .catch(function(error) {
              console.log("Error en getDescComision: " + error);
            });
          calcularPrimaAuto();
        }

        $scope.selectProduct = function(tipoProducto) {
          actualizarDocumentosAsociados(tipoProducto);
          if (tipoProducto.ppal != 1) {
            if ($scope.formData.DocumentosAsociados == null) {
            } else {
              if ($scope.formData.DocumentosAsociados.length > 0) {
                for (var i = 0; i < $scope.formData.DocumentosAsociados.length; i++) {
                  if ($scope.formData.DocumentosAsociados[i] != null) {
                    if ($scope.formData.DocumentosAsociados[i].CodigoProducto == tipoProducto.codigoProducto) {
                      if ($scope.formData.DocumentosAsociados[i].Selected && tipoProducto.val == false) {
                        $scope.formData.DocumentosAsociados[i].Selected = false;
                      } else if (tipoProducto.val) {
                        $scope.formData.DocumentosAsociados[i].Selected = true;
                      }
                    }
                  }
                }
              }
            }
          }
        };

        $scope.onSelectChange = function(tipoProducto, valorDcts) {
          guardarDescuentos(tipoProducto, valorDcts);
          calcularPrimaProducto(tipoProducto);
        };

        $scope.onSelectChange_DescuentoComercial = function (tipoProducto, valorDcts) {
          tipoProducto.DsctoComercial = (valorDcts && valorDcts.DsctoComercial) ? parseInt(valorDcts.DsctoComercial) : 0;
          calcularPrimaProducto(tipoProducto);
        }

        $scope.checkRucPerson = function(tipo, numero) {
          return mainServices.fnShowNaturalRucPerson(tipo, numero);
        };

        function guardarDescuentos(tipoProducto, valorDcts) {
          tipoProducto.DsctoPorComision = 0;
          tipoProducto.TotalDscto = 0;
          tipoProducto.FlgAplicaDsctoComision = "N";
          tipoProducto.TuComision = { DsctoEspValor: 0, DsctoEspecial: 0, AgenteComision: 0 };
          if (valorDcts === null) {
            valorDcts = {
              AgenteComision: 0,
              DsctoEspecial: 0,
              DsctoEspValor: 0
            };

            tipoProducto.FlgAplicaDsctoComision = "S";
            tipoProducto.DsctoPorComision = valorDcts.DsctoEspecial;
            tipoProducto.TotalDscto = valorDcts.DsctoEspValor; //tipoProducto.DsctoPorComision + tipoProducto.DsctoComercial;
            tipoProducto.TuComision = valorDcts.AgenteComision;
          }

          if (valorDcts.DsctoEspValor > 0) {
            tipoProducto.FlgAplicaDsctoComision = "S";
            tipoProducto.DsctoPorComision = valorDcts.DsctoEspecial;
            tipoProducto.TotalDscto = valorDcts.DsctoEspValor; //tipoProducto.DsctoPorComision + tipoProducto.DsctoComercial;

            tipoProducto.TuComision = valorDcts.AgenteComision;
          } else {
            tipoProducto.FlgAplicaDsctoComision = "N";
            tipoProducto.DsctoPorComision = valorDcts.DsctoEspecial;
            tipoProducto.TotalDscto = valorDcts.DsctoEspValor; //tipoProducto.DsctoPorComision + tipoProducto.DsctoComercial;

            tipoProducto.TuComision = valorDcts.AgenteComision;
          }

          if (typeof tipoProducto.TuComision == "undefined") {
            tipoProducto.Model.AgenteComision = 0;
          }
        }

        function actualizarDocumentosAsociados(tipoProducto) {
          for (var i = 0; i < $scope.formData.DocumentosAsociados.length; i++) {
            if ($scope.formData.DocumentosAsociados[i] != null) {
              if ($scope.formData.DocumentosAsociados[i].CodigoProducto == tipoProducto.codigoProducto) {
                $scope.formData.DocumentosAsociados[i].DsctoComercial = tipoProducto.DsctoComercial;
                $scope.formData.DocumentosAsociados[i].DsctoPorComision = tipoProducto.DsctoPorComision;
                $scope.formData.DocumentosAsociados[i].FlgAplicaDsctoComision = tipoProducto.FlgAplicaDsctoComision;
                $scope.formData.DocumentosAsociados[i].TotalDscto = tipoProducto.TotalDscto;
                $scope.formData.DocumentosAsociados[i].TuComision = tipoProducto.TuComision;
                $scope.formData.DocumentosAsociados[i].PrimaNeta = tipoProducto.primaneta;
                $scope.formData.DocumentosAsociados[i].PrimaNeta2 = tipoProducto.primaneta2;
              }
            }
          }
        }

        function calcularPrimaProducto(tipoProducto) {
          if (typeof $scope.formData.mPolizaGrupo == "undefined") {
            $scope.formData.codPolizaGrupo = "";
          } else {
            $scope.formData.codPolizaGrupo = $scope.formData.mPolizaGrupo.groupPolize;
          }
          if (!(typeof tipoProducto.label == "undefined")) {
            if (tipoProducto.label.indexOf("RC") < 0) {
              if (tipoProducto.DsctoPorComision <= 0) {
                var mcaMapfreDolarCalculoPrima = "N"; // Sólo para el cálculo de la prima.
                var vParamsVehiculoProd = {
                  CodigoModalidad: tipoProducto.codigoModalidad,
                  CodigoCompania: constants.module.polizas.autos.companyCode,
                  CodigoRamo: constants.module.polizas.autos.codeRamo,
                  CodigoProducto: tipoProducto.codigoProducto
                };

                var vParamsContratante = {
                  MCAMapfreDolar: mcaMapfreDolarCalculoPrima,
                  ImporteMapfreDolar: $scope.checkRucPerson(
                    $scope.formData.mTipoDocumento.Codigo,
                    $scope.formData.mNumeroDocumento
                  )
                    ? $scope.formData.optMostrarMDolar == 1
                      ? $scope.formData.ImporteMapfreDolar
                      : ""
                    : "",
                  EstadoCivil: $scope.formData.isEmblem && $scope.formData.mEstadoCivil ? { Codigo: $scope.formData.mEstadoCivil.Codigo } : undefined,
                  FechaExpedicion: $scope.formData.isEmblem ? validateExpirationDate($scope.formData) : undefined,
                  TipoDocumento: $scope.formData.mTipoDocumento.Codigo,
                  CodigoDocumento: $scope.formData.mNumeroDocumento
                };
                var vParamsUbigeo = {
                  CodigoDepartamento: $scope.formData.Ubigeo.mDepartamento.Codigo,
                  CodigoProvincia: $scope.formData.Ubigeo.mProvincia.Codigo,
                  CodigoDistrito: $scope.formData.Ubigeo.mDistrito.Codigo
                };

                var vParamsVehiculo = {
                  CodigoMarca: $scope.formData.ModeloMarca.codigoMarca,
                  CodigoModelo: $scope.formData.ModeloMarca.codigoModelo,
                  CodigoSubModelo: $scope.formData.mSubModelo.Codigo,
                  CodigoCategoria: $scope.formData.mSubModelo.CodigoCategoria,
                  CodigoTipo: $scope.formData.mTipoVehiculo.CodigoTipo,
                  CodigoUso: $scope.formData.mUsoRiesgo.Codigo,
                  DsctoComercial: tipoProducto.DsctoComercial,
                  AnioFabricacion: $scope.formData.mYearFabric.Codigo,
                  SumaAsegurada: $scope.formData.valorVehiculo,
                  TipoVolante: constants.module.polizas.autos.tipoVolante,
                  MCAGPS: constants.module.polizas.autos.MCAGPS,
                  MCANUEVO: $scope.formData.mcaNuevo,
                  PolizaGrupo: $scope.formData.codPolizaGrupo,
                  CodigoProducto: $scope.prdPrincipal.codigoProducto,
                  ProductoVehiculo: vParamsVehiculoProd,
                  TipoTransmision: $scope.formData.isEmblem && $scope.formData.VehicleTransmission ? { Codigo: $scope.formData.VehicleTransmission.Codigo } : undefined,
                  ScoreMorosidad: $scope.formData.isEmblem ? $scope.formData.score : undefined
                };

                var fechaHoraCotizacion;
                for (var i = 0; i < $scope.formData.DocumentosAsociados.length; i++) {
                  if ($scope.formData.DocumentosAsociados[i] != null) {
                    if ($scope.formData.DocumentosAsociados[i].CodigoProducto == tipoProducto.codigoProducto) {
                      fechaHoraCotizacion = $scope.formData.DocumentosAsociados[i].FechaHora;
                    }
                  }
                }

                var vParams = {
                  PorDctoIntgPlaza: $scope.formData.PorDctoIntgPlaza || 0,
                  MarcaPorDctoIntegralidad: $scope.formData.DctoIntegralidad ? 'S' : 'N',
                  numeroCotizacion: $scope.formData.numeroCotizacion,
                  fechaHora: fechaHoraCotizacion,
                  CodigoCorredor: $scope.mAgente.codigoAgente,
                  TotalDsctoComision: tipoProducto.TotalDscto,
                  DsctoComision: tipoProducto.DsctoPorComision,
                  Vehiculo: vParamsVehiculo,
                  Contratante: vParamsContratante,
                  Ubigeo: vParamsUbigeo,
                  FechaInicioVig:
                    oimPrincipal.get_role() == 'BANSEG' || $scope.formData.mVigenciaMeses 
                      ? autosCotizarFactory.formatearFecha($scope.formData.inicioVigencia)
                      : '',
                  FechaFinVig:
                    oimPrincipal.get_role() == 'BANSEG' || $scope.formData.mVigenciaMeses 
                      ? autosCotizarFactory.formatearFecha($scope.formData.finVigencia)
                      : '',
                  NumeroSolicitud:
                    typeof $scope.formData.mNroSolic == 'undefined' ? '' : $scope.formData.mNroSolic,
                  PrimaPactada:
                    typeof $scope.formData.mPrimaPactada == 'undefined'
                      ? ''
                      : $scope.formData.mPrimaPactada
                };

                $scope.formData.vParams2 = vParams;
                mpSpin.start();
                autosCotizarFactory
                  .calcularPrimaProducto(vParams)
                  .then(function(response) {
                    if (response.OperationCode == constants.operationCode.success) {
                      tipoProducto.primaneta = response.Data.Vehiculo.PrimaVehicular; //actualizamos el model
                      tipoProducto.primanetaReal = response.Data.Vehiculo.PrimaVehicularReal; //actualizamos el model

                      for (var i = 0; i < $scope.formData.DocumentosAsociados.length; i++) {
                        if ($scope.formData.DocumentosAsociados[i] != null) {
                          if ($scope.formData.DocumentosAsociados[i].CodigoProducto == tipoProducto.codigoProducto) {
                            $scope.formData.DocumentosAsociados[i].CodigoPrima = response.Data.NumeroCotizacion;
                            $scope.formData.DocumentosAsociados[i].DsctoComercial = tipoProducto.DsctoComercial;
                            $scope.formData.DocumentosAsociados[i].DsctoPorComision = tipoProducto.DsctoPorComision;
                            $scope.formData.DocumentosAsociados[i].FlgAplicaDsctoComision =
                              tipoProducto.FlgAplicaDsctoComision;
                            $scope.formData.DocumentosAsociados[i].TotalDscto = tipoProducto.TotalDscto;
                            $scope.formData.DocumentosAsociados[i].TuComision = tipoProducto.TuComision;
                            $scope.formData.DocumentosAsociados[i].PrimaNeta = tipoProducto.primaneta2;
                            $scope.formData.DocumentosAsociados[i].PrimaNeta2 = response.Data.Vehiculo.PrimaVehicular;
                          }
                        }
                      }

                      //actualizamos el arreglo de productos relacionados y prod ppal
                      if (tipoProducto.ppal == 1) {
                        //si es el producto ppal
                        $scope.prdPrincipal.DsctoComercial = tipoProducto.DsctoComercial;
                        $scope.prdPrincipal.DsctoPorComision = tipoProducto.DsctoPorComision;
                        $scope.prdPrincipal.FlgAplicaDsctoComision = tipoProducto.FlgAplicaDsctoComision;
                        $scope.prdPrincipal.TotalDscto = tipoProducto.TotalDscto;
                        $scope.prdPrincipal.TuComision = tipoProducto.TuComision;
                        $scope.prdPrincipal.primaneta = tipoProducto.primanetaReal;
                        $scope.prdPrincipal.primaneta2 = response.Data.Vehiculo.PrimaVehicular; //tipoProducto.primaneta;
                      } else {
                        //si es un producto relacionado
                        for (var i = 0; i < $scope.prgRelacionados.length; i++) {
                          if ($scope.prgRelacionados[i].codigoProducto == tipoProducto.codigoProducto) {
                            $scope.prgRelacionados[i].DsctoComercial = tipoProducto.DsctoComercial;
                            $scope.prgRelacionados[i].DsctoPorComision = tipoProducto.DsctoPorComision;
                            $scope.prgRelacionados[i].FlgAplicaDsctoComision = tipoProducto.FlgAplicaDsctoComision;
                            $scope.prgRelacionados[i].TotalDscto = tipoProducto.TotalDscto;
                            $scope.prgRelacionados[i].TuComision = tipoProducto.TuComision;
                            $scope.prgRelacionados[i].primaneta = tipoProducto.primanetaReal;
                            $scope.prgRelacionados[i].primaneta2 = response.Data.Vehiculo.PrimaVehicular; //tipoProducto.primaneta;
                          }
                        }
                      }
                      actualizarDocumentosAsociados(tipoProducto);
                    } else if (response.Message) {
                      $scope.noHayPrima = true;
                      mModalAlert.showError("", response.Message);
                      if (response.OperationCode == 900) $scope.noHayPrima = false;
                    }
                    mpSpin.end();
                  })
                  .catch(function(error) {
                    mpSpin.end();
                    mModalAlert.showError("", "Ocurrió un error, por favor, vuelva a intentarlo.");
                    console.log("Error en calcularPrimaProducto: " + error);
                  });
              }
            }
          }
        }

        function calcularPrimaAuto() {
          if (angular.isUndefined($scope.formData.mPolizaGrupo)) {
            $scope.formData.codPolizaGrupo = "";
          } else {
            $scope.formData.codPolizaGrupo = $scope.formData.mPolizaGrupo.groupPolize;
          }

          if ($scope.prdPrincipal != null) {
            $scope.formData.DocumentosAsociados = [];
            $scope.formData.primas = [];

            var mcaMapfreDolarCalculoPrima = "N"; // Sólo para el cálculo de la prima.
            var codigoModalidad = [];

            $scope.DataPrima = [];
            $scope.DocumentosAsociados = [];

            var modalidadProducto = {
              codigoModalidad: $scope.prdPrincipal.codigoModalidad,
              codigoProducto: $scope.prdPrincipal.codigoProducto
            };

            codigoModalidad.push(modalidadProducto);
            angular.forEach($scope.prgRelacionados, function(value, key) {
              if ($scope.prdPrincipal.codigoProducto != $scope.prgRelacionados[key].codigoProducto) {
                modalidadProducto = {
                  codigoModalidad: $scope.prgRelacionados[key].codigoModalidad,
                  codigoProducto: $scope.prgRelacionados[key].codigoProducto
                };
                codigoModalidad.push(modalidadProducto);
              }
            });

            $scope.formData.nroPrimas = codigoModalidad.length;

            var productosParam = []; //Array para enviar al calculo de prima
            mpSpin.start();
            angular.forEach(codigoModalidad, function(value, key) {
              var vParamsVehiculoProd = {
                CodigoModalidad: value.codigoModalidad,
                CodigoCompania: constants.module.polizas.autos.companyCode,
                CodigoRamo: constants.module.polizas.autos.codeRamo,
                CodigoProducto: value.codigoProducto
              };
              var vParamsVehiculo = {
                CodigoMarca: $scope.formData.ModeloMarca.codigoMarca,
                CodigoModelo: $scope.formData.ModeloMarca.codigoModelo,
                CodigoSubModelo: $scope.formData.mSubModelo.Codigo,
                CodigoCategoria: $scope.formData.mSubModelo.CodigoCategoria,
                CodigoTipo: $scope.formData.mTipoVehiculo.CodigoTipo,
                CodigoUso: $scope.formData.mUsoRiesgo.Codigo,
                DsctoComercial: 0,
                AnioFabricacion: $scope.formData.mYearFabric.Codigo,
                SumaAsegurada: $scope.formData.valorVehiculo,
                TipoVolante: constants.module.polizas.autos.tipoVolante,
                MCAGPS: constants.module.polizas.autos.MCAGPS,
                MCANUEVO: $scope.formData.mcaNuevo,
                PolizaGrupo: $scope.formData.codPolizaGrupo, //falta
                CodigoProducto: $scope.prdPrincipal.codigoProducto,
                ProductoVehiculo: vParamsVehiculoProd,
                TipoTransmision: $scope.formData.isEmblem && $scope.formData.VehicleTransmission ? { Codigo: $scope.formData.VehicleTransmission.Codigo } : undefined,
                ScoreMorosidad: $scope.formData.isEmblem ? $scope.formData.score : undefined
              };
              if (key == 0) {
                vParamsVehiculo.DsctoComercial = $scope.prdPrincipal.DsctoComercial;
              } else {
                vParamsVehiculo.DsctoComercial = $scope.prgRelacionados[key - 1].DsctoComercial;
              }
              var vParamsContratante = {
                MCAMapfreDolar: mcaMapfreDolarCalculoPrima,
                ImporteMapfreDolar: $scope.checkRucPerson(
                  $scope.formData.mTipoDocumento.Codigo,
                  $scope.formData.mNumeroDocumento
                )
                  ? $scope.formData.optMostrarMDolar == 1
                    ? $scope.formData.ImporteMapfreDolar
                    : ""
                  : "",

                TipoDocumento: $scope.formData.mTipoDocumento.Codigo,
                CodigoDocumento: $scope.formData.mNumeroDocumento,
                Nombre: $scope.checkRucPerson($scope.formData.mTipoDocumento.Codigo, $scope.formData.mNumeroDocumento)
                  ? $scope.formData.mNomContratante
                  : $scope.formData.mRazSocContratante,
                ApellidoPaterno: $scope.checkRucPerson(
                  $scope.formData.mTipoDocumento.Codigo,
                  $scope.formData.mNumeroDocumento
                )
                  ? $scope.formData.mApePatContratante
                  : "",
                ApellidoMaterno: $scope.checkRucPerson(
                  $scope.formData.mTipoDocumento.Codigo,
                  $scope.formData.mNumeroDocumento
                )
                  ? $scope.formData.mApeMatContratante
                  : "",
                Sexo: $scope.checkRucPerson($scope.formData.mTipoDocumento.Codigo, $scope.formData.mNumeroDocumento)
                  ? $scope.formData.Sexo != undefined
                    ? $scope.formData.Sexo.Codigo
                    : ""
                  : "",
                FechaNacimiento: $scope.checkRucPerson(
                  $scope.formData.mTipoDocumento.Codigo,
                  $scope.formData.mNumeroDocumento
                )
                  ? $filter("date")($scope.formData.fechaNacimiento, "dd/MM/yyyy")
                  : "",
                EstadoCivil: $scope.formData.isEmblem && $scope.formData.mEstadoCivil ? { Codigo: $scope.formData.mEstadoCivil.Codigo } : undefined,
                FechaExpedicion: $scope.formData.isEmblem ? validateExpirationDate($scope.formData) : undefined
              };
              var vParamsUbigeo = {
                // cambiar cuando se integre el ubigeo
                CodigoDepartamento: $scope.formData.Ubigeo.mDepartamento.Codigo,
                CodigoProvincia: $scope.formData.Ubigeo.mProvincia.Codigo,
                CodigoDistrito: $scope.formData.Ubigeo.mDistrito.Codigo
              };
              var vParams = {
                PorDctoIntgPlaza: $scope.formData.PorDctoIntgPlaza || 0,
                MarcaPorDctoIntegralidad: $scope.formData.DctoIntegralidad ? 'S' : 'N',
                FechaHora: autosFactory.getCotizacionFechaHora(),
                numeroCotizacion: '',
                CodigoCorredor: $scope.mAgente.codigoAgente,
                TotalDsctoComision: 0,
                DsctoComision: 0,
                Vehiculo: vParamsVehiculo,
                Contratante: vParamsContratante,
                Ubigeo: vParamsUbigeo,
                FechaInicioVig:
                  oimPrincipal.get_role() == 'BANSEG' || $scope.formData.mVigenciaMeses 
                    ? autosCotizarFactory.formatearFecha($scope.formData.inicioVigencia)
                    : '',
                FechaFinVig:
                  oimPrincipal.get_role() == 'BANSEG' || $scope.formData.mVigenciaMeses 
                    ? autosCotizarFactory.formatearFecha($scope.formData.finVigencia)
                    : '',
                NumeroSolicitud:
                  typeof $scope.formData.mNroSolic == 'undefined' ? '' : $scope.formData.mNroSolic,
                PrimaPactada:
                  typeof $scope.formData.mPrimaPactada == 'undefined' ? '' : $scope.formData.mPrimaPactada
              };

              if (key == 0) {
                vParams.TotalDsctoComision = $scope.prdPrincipal.TotalDscto;
                vParams.DsctoComision = $scope.prdPrincipal.TuComision;
              } else {
                vParams.TotalDsctoComision = $scope.prgRelacionados[key - 1].TotalDscto;
                vParams.DsctoComision = $scope.prgRelacionados[key - 1].TuComision;
              }

              productosParam.push(vParams);
            });

            $scope.formData.noLoad = false;

            autosCotizarFactory
              .calcularPrima(productosParam)
              .then(function(response) {
                if (response.OperationCode == constants.operationCode.success || response.OperationCode == 900) {
                  $scope.noHayPrima = false;
                  for (var key = 0; key < response.Data.length; key++) {
                    var resultadoPrima = response.Data[key];

                    if (
                      $scope.prdPrincipal.codigoProducto === resultadoPrima.Vehiculo.ProductoVehiculo.CodigoProducto
                    ) {
                      //verificamos si es el prod ppal

                      autosFactory.setCotizacionFechaHora(resultadoPrima.FechaHora);

                      $scope.formData.ZonaTarifa = resultadoPrima.Vehiculo.ZonaTarifa;
                      $scope.formData.DocumentosAsociados[key] = {};

                      $scope.formData.DocumentosAsociados[key].CodigoPrima = resultadoPrima.NumeroCotizacion;
                      $scope.formData.DocumentosAsociados[key].FechaHora = resultadoPrima.FechaHora;
                      $scope.formData.DocumentosAsociados[key].CodigoEstado = "1";
                      $scope.formData.DocumentosAsociados[key].CodigoUsuarioRED = $scope.formData.codigoUsuarioRED;
                      $scope.formData.DocumentosAsociados[key].CodigoUsuario = $scope.formData.codigoUsuario;
                      $scope.formData.DocumentosAsociados[key].CodigoProceso = "1";
                      $scope.formData.DocumentosAsociados[key].CodigoProducto = $scope.prdPrincipal.codigoProducto;
                      $scope.formData.DocumentosAsociados[key].CodigoAgente = $scope.formData.codAgente;
                      $scope.formData.DocumentosAsociados[key].MarcaAsistencia = $scope.formData.marcaAsistencia;
                      $scope.formData.DocumentosAsociados[key].FlgAplicaDsctoComision =
                        $scope.prdPrincipal.FlgAplicaDsctoComision;
                      $scope.formData.DocumentosAsociados[key].DsctoComercial = $scope.prdPrincipal.DsctoComercial;
                      $scope.formData.DocumentosAsociados[key].DsctoPorComision = $scope.prdPrincipal.DsctoPorComision;
                      $scope.formData.DocumentosAsociados[key].TotalDscto = $scope.prdPrincipal.TotalDscto;
                      $scope.formData.DocumentosAsociados[key].TuComision = $scope.prdPrincipal.TuComision;

                      $scope.formData.DocumentosAsociados[key].Ubigeo = {
                        CodigoDepartamento: $scope.formData.Ubigeo.mDepartamento.Codigo,
                        CodigoProvincia: $scope.formData.Ubigeo.mProvincia.Codigo,
                        CodigoDistrito: $scope.formData.Ubigeo.mDistrito.Codigo
                      };

                      if (resultadoPrima.MensajeError != "") {
                        //no hay prima
                        $scope.prdPrincipal.MensajeError = resultadoPrima.MensajeError;
                        $scope.prdPrincipal.primaneta = 0;
                        $scope.prdPrincipal.primaneta2 = 0;
                        $scope.formData.DocumentosAsociados[key].Selected = false;
                      } else {
                        //hay prima
                        $scope.prdPrincipal.primaneta = resultadoPrima.Vehiculo.PrimaVehicularReal;
                        $scope.prdPrincipal.primaneta2 = resultadoPrima.Vehiculo.PrimaVehicular;
                        $scope.formData.DocumentosAsociados[key].PrimaNeta = resultadoPrima.Vehiculo.PrimaVehicularReal; //$scope.prdPrincipal.primaneta;
                        $scope.formData.DocumentosAsociados[key].MontoPrima = resultadoPrima.Vehiculo.PrimaVehicularReal;
                        $scope.formData.DocumentosAsociados[key].Selected = true;
                      }

                      for (var i = 0; i < $scope.prgRelacionados.length; i++) {
                        //buscamos el ppal en el otro arreglo
                        if ($scope.prgRelacionados[i].codigoProducto === $scope.prdPrincipal.codigoProducto) {
                          if (resultadoPrima.MensajeError != "") {
                            //no hay prima
                            $scope.prgRelacionados[i].MensajeError = resultadoPrima.MensajeError;
                            $scope.prgRelacionados[i].primaneta = 0;
                            $scope.prgRelacionados[i].primaneta2 = 0;
                            $scope.formData.DocumentosAsociados[i].Selected = false;
                          } else {
                            //hay prima
                            $scope.prgRelacionados[i].primaneta = resultadoPrima.Vehiculo.PrimaVehicularReal;
                            $scope.prgRelacionados[i].primaneta2 = resultadoPrima.Vehiculo.PrimaVehicular;
                            $scope.formData.DocumentosAsociados[i].PrimaNeta =
                              resultadoPrima.Vehiculo.PrimaVehicularReal; //$scope.prdPrincipal.primaneta;
                            $scope.formData.DocumentosAsociados[i].PrimaNeta2 = resultadoPrima.Vehiculo.PrimaVehicular;
                            $scope.formData.DocumentosAsociados[i].Selected = true;
                          }

                          break;
                        }
                      }
                    } else {
                      //buscamos en los prod relacionados

                      for (var i = 0; i < $scope.prgRelacionados.length; i++) {
                        if (
                          $scope.prgRelacionados[i].codigoProducto ===
                          resultadoPrima.Vehiculo.ProductoVehiculo.CodigoProducto
                        ) {
                          $scope.formData.ZonaTarifa = resultadoPrima.Vehiculo.ZonaTarifa;
                          $scope.formData.DocumentosAsociados[key] = {};

                          $scope.formData.DocumentosAsociados[key].CodigoPrima = resultadoPrima.NumeroCotizacion;
                          $scope.formData.DocumentosAsociados[key].CodigoEstado = "1";
                          $scope.formData.DocumentosAsociados[key].CodigoUsuarioRED = $scope.formData.codigoUsuarioRED;
                          $scope.formData.DocumentosAsociados[key].CodigoUsuario = $scope.formData.codigoUsuario;
                          $scope.formData.DocumentosAsociados[key].CodigoProceso = "1";
                          $scope.formData.DocumentosAsociados[key].CodigoProducto =
                            $scope.prgRelacionados[i].codigoProducto;
                          $scope.formData.DocumentosAsociados[key].CodigoAgente = $scope.formData.codAgente;
                          $scope.formData.DocumentosAsociados[key].MarcaAsistencia = $scope.formData.marcaAsistencia;
                          $scope.formData.DocumentosAsociados[key].FlgAplicaDsctoComision =
                            $scope.prgRelacionados[i].FlgAplicaDsctoComision; //$scope.prdPrincipal.FlgAplicaDsctoComision;
                          $scope.formData.DocumentosAsociados[key].DsctoComercial =
                            $scope.prgRelacionados[i].DsctoComercial; //$scope.prdPrincipal.DsctoComercial;
                          $scope.formData.DocumentosAsociados[key].DsctoPorComision =
                            $scope.prgRelacionados[i].DsctoPorComision; //$scope.prdPrincipal.DsctoPorComision;
                          $scope.formData.DocumentosAsociados[key].TotalDscto = $scope.prgRelacionados[i].TotalDscto; //$scope.prdPrincipal.TotalDscto;
                          $scope.formData.DocumentosAsociados[key].TuComision = $scope.prgRelacionados[i].TuComision; //$scope.prdPrincipal.TuComision;

                          $scope.formData.DocumentosAsociados[key].Ubigeo = {
                            CodigoDepartamento: $scope.formData.Ubigeo.mDepartamento.Codigo,
                            CodigoProvincia: $scope.formData.Ubigeo.mProvincia.Codigo,
                            CodigoDistrito: $scope.formData.Ubigeo.mDistrito.Codigo
                          };

                          if (resultadoPrima.MensajeError != "") {
                            //no hay prima
                            $scope.prgRelacionados[i].MensajeError = resultadoPrima.MensajeError;
                            $scope.prgRelacionados[i].primaneta = 0;
                            $scope.formData.DocumentosAsociados[key].Selected = false;
                          } else {
                            //hay prima
                            $scope.prgRelacionados[i].primaneta = resultadoPrima.Vehiculo.PrimaVehicularReal;
                            $scope.prgRelacionados[i].primaneta2 = resultadoPrima.Vehiculo.PrimaVehicular;
                            $scope.formData.DocumentosAsociados[key].PrimaNeta =
                              resultadoPrima.Vehiculo.PrimaVehicularReal; //$scope.prdPrincipal.primaneta;
                            $scope.formData.DocumentosAsociados[key].MontoPrima = resultadoPrima.Vehiculo.PrimaVehicularReal;
                          }

                          break;
                        }
                      }
                    }
                  }

                  for (var i = 0; i < $scope.prgRelacionados.length; i++) {
                    if ($scope.prgRelacionados[i].primaneta === -1) {
                      $scope.prgRelacionados[i].primaneta = 0;
                    }
                  }

                  if ($scope.prdPrincipal.primaneta === -1) {
                    $scope.prdPrincipal.primaneta = 0;
                  }

                  actualizarProductos();
                } else if (response.Message.length > 0) {
                  mModalAlert.showWarning("Error al cotizar", "Error al cotizar el vehiculo");
                  $scope.noHayPrima = true;
                }
                mpSpin.end();
              })
              .catch(function(error) {
                mpSpin.end();
                console.log("Error en calcularPrima: " + error);
              });
          }
        }

        function actualizarProductos() {
          for (var key = 0; key < $scope.formData.DocumentosAsociados.length; key++) {
            if ($scope.prdPrincipal !== null || $scope.prdPrincipal.codigoProducto !== null) {
              if ($scope.formData.DocumentosAsociados[key] != null) {
                if ($scope.prdPrincipal.codigoProducto === $scope.formData.DocumentosAsociados[key].CodigoProducto) {
                  $scope.prdPrincipal.primaneta = $scope.formData.DocumentosAsociados[key].PrimaNeta;
                  break;
                }
              }
            }
          }

          for (var key = 0; key < $scope.prgRelacionados.length; key++) {
            for (var j = 0; j < $scope.formData.DocumentosAsociados.length; j++) {
              if ($scope.formData.DocumentosAsociados[j] != null) {
                if (
                  $scope.prgRelacionados[key].codigoProducto === $scope.formData.DocumentosAsociados[j].CodigoProducto
                ) {
                  $scope.prgRelacionados[key].primaneta = $scope.formData.DocumentosAsociados[j].PrimaNeta;
                }
              }
            }
          }
        }

        // ModalConfirmation
        $scope.showModalConfirmation = function() {
          if ($scope.noHayPrima || !$scope.formData.DocumentosAsociados.length) {
            $scope.dataConfirmation = {
              save: false,
              title: "Error",
              subTitle: "No se puede puede cotizar el o los productos seleccionados",
              lblClose: "Cancelar",
              lblSave: "Intentar de nuevo"
            };
            var vModalSteps = $uibModal.open({
              backdrop: true, // background de fondo
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              template:
                '<mpf-modal-confirmation-steps data="dataConfirmation" close="close()"></mpf-modal-confirmation-steps>',
              controller: [
                "$scope",
                "$uibModalInstance",
                "$uibModal",
                function($scope, $uibModalInstance, $uibModal) {
                  //CloseModal
                  $scope.close = function() {
                    $uibModalInstance.close();
                  };
                }
              ]
            });
            vModalSteps.result
              .then(function() {
                $scope.$watch("dataConfirmation", function(value) {
                  if (value.save) {
                    $state.go("autosQuote.steps", { step: 1 }, { reload: true, inherit: false });
                  }
                });
              })
              .catch(function(error) {});
          } else {
            if (guardarPaso3()) {
              mModalConfirm
                .confirmInfo(
                  "Recuerda que una vez guardada ya no podrá hacer cambios",
                  "¿Estás seguro que quieres guardar la cotización?",
                  ""
                )
                .then(function(response) {
                  if (response) {
                    $rootScope.formData = {};
                    $scope.guardarCotizacion();
                  }
                });
            }
          }
        };

        $scope.guardarCotizacion = function() {

          if ($scope.mAgente.codigoAgente != "0") {
            //validar datos de usuario
            var datosContratanteValidated = true;

            if (typeof $scope.formData.mPolizaGrupo == "undefined") {
              $scope.formData.codPolizaGrupo = "";
            } else {
              $scope.formData.codPolizaGrupo = $scope.formData.mPolizaGrupo.groupPolize;
            }

            if (
              $scope.formData.mNomContratante == null &&
              $scope.formData.mApePatContratante == null &&
              $scope.formData.mRazSocContratante
            ) {
              datosContratanteValidated = false;
            }

            if (datosContratanteValidated && !($scope.formData.DocumentosAsociados == null)) {
              setearEstadoVehiculo();
              if (parseFloat($scope.formData.ImporteMapfreDolar) > 0) {
                $scope.formData.MCAMapfreDolar = "S";
              }
              var dataCotizacion = [];
              var dataNroCotizacion = [];

              $scope.formData.DocumentosAsociados2 = [];
              $scope.formData.Documentos = [];

              for (var i = 0; i < $scope.formData.DocumentosAsociados.length; i++) {
                if (!(typeof $scope.formData.DocumentosAsociados[i] == "undefined")) {
                  if ($scope.formData.DocumentosAsociados[i].Selected) {
                    $scope.formData.DocumentosAsociados2[i] = $scope.formData.DocumentosAsociados[i];
                  }
                  //eliminamos el campo Selected
                  delete $scope.formData.DocumentosAsociados[i].Selected;
                }
              }

              for (var i = 0; i < $scope.formData.DocumentosAsociados2.length; i++) {
                if (
                  $scope.formData.DocumentosAsociados2[i] !== null &&
                  !(typeof $scope.formData.DocumentosAsociados2[i] == "undefined")
                ) {
                  $scope.formData.Documentos[i] = $scope.formData.DocumentosAsociados2[i];
                }
              }

              if ($scope.formData.DocumentosAsociados.length) {
                //verificamos si el documento esta seleccionado para ser guardado
                if ($scope.formData.DocumentosAsociados.length) {

                  // Sistema Origen: OIM o MYD
                  var origen = oimAbstractFactory.getOrigin();
                  var documentos = _.map($scope.formData.Documentos, function (doc) {
                    if (doc) {
                      doc.CodigoSistema = origen;
                      return doc;
                    }
                  });

                  dataCotizacion = {
                    PorDctoIntgPlaza: $scope.formData.PorDctoIntgPlaza || 0,
                    MarcaPorDctoIntegralidad: $scope.formData.DctoIntegralidad ? "S" : "N",
                    CodigoCompania: constants.module.polizas.autos.companyCode,
                    CodigoProductoPrin: $scope.prdPrincipal.codigoProducto,
                    CodigoTipoEntidad: "1", //R: Valor fijo por ahora es 1
                    CodigoCorredor: $scope.mAgente.codigoAgente,
                    DocumentosAsociados: documentos,
                    FechaInicioVig:
                      oimPrincipal.get_role() == "BANSEG" || $scope.formData.mVigenciaMeses 
                        ? autosCotizarFactory.formatearFecha($scope.formData.inicioVigencia)
                        : "",
                    FechaFinVig:
                      oimPrincipal.get_role() == "BANSEG" || $scope.formData.mVigenciaMeses 
                        ? autosCotizarFactory.formatearFecha($scope.formData.finVigencia)
                        : "",
                    NumeroSolicitud: typeof $scope.formData.mNroSolic == "undefined" ? "" : $scope.formData.mNroSolic,
                    PrimaPactada:
                      typeof $scope.formData.mPrimaPactada == "undefined" ? "" : $scope.formData.mPrimaPactada,
                    Vehiculo: {
                      ZonaTarifa: $scope.formData.ZonaTarifa, //R: Este servicio lo devuleve -> https://mxperu.atlassian.net/browse/OIM-107
                      CodigoTipo: $scope.formData.mSubModelo.Tipo, //R: https://mxperu.atlassian.net/browse/OIM-100
                      CodigoMarca: $scope.formData.ModeloMarca.codigoMarca, //R: CodigoMarca
                      CodigoModelo: $scope.formData.ModeloMarca.codigoModelo, //R: CodigoModelo
                      CodigoSubModelo: $scope.formData.mSubModelo.Codigo, //R: CodigoSubModelo
                      Version: $scope.formData.mVersion ? $scope.formData.mVersion.toUpperCase() : "",
                      AnioFabricacion: $scope.formData.mYearFabric.Codigo, //R: AnioFabricacion
                      MCAPICKUP: $scope.formData.mSubModelo.FlgPickup, //R: https://mxperu.atlassian.net/browse/OIM-100
                      TipoVolante: constants.module.polizas.autos.tipoVolante, //R: Siempre I, porque es un control oculto
                      NombreMarca: $scope.formData.ModeloMarca.nombreMarca, //R: NombreMarca
                      NombreModelo: $scope.formData.ModeloMarca.nombreModelo, //R: NombreModelo
                      MCAGPS: constants.module.polizas.autos.MCAGPS, //MCAGPS : "N", //Este campo siempre va tener valor N, porque es un CONTROL OCULTO
                      NombreTipo: $scope.formData.mSubModelo.NombreTipo, //R: https://mxperu.atlassian.net/browse/OIM-100
                      CodigoCategoria: $scope.formData.mSubModelo.CodigoCategoria, //R: https://mxperu.atlassian.net/browse/OIM-100
                      MCAREQUIEREGPS: $scope.formData.MCAREQUIEREGPS, //¿Observaciones? Si, -> https://mxperu.atlassian.net/browse/OIM-128
                      PolizaGrupo: $scope.formData.codPolizaGrupo, //R: Poliza Grupo
                      MCANUEVO: $scope.formData.mcaNuevo, //¿Estado nuevo o usado? SI
                      CodigoUso: $scope.formData.mUsoRiesgo.Codigo, //¿Uso del riesgo? SI
                      SumaAsegurada: $scope.formData.valorVehiculo, //R: Valor sugerido
                      TipoTransmision: $scope.formData.isEmblem && $scope.formData.VehicleTransmission ? { Codigo: $scope.formData.VehicleTransmission.Codigo } : undefined,
                      ScoreMorosidad: $scope.formData.isEmblem ? $scope.formData.score : undefined
                    },
                    Contratante: {
                      TipoDocumento: $scope.formData.mTipoDocumento.Codigo,
                      CodigoDocumento: $scope.formData.mNumeroDocumento,
                      Nombre: $scope.checkRucPerson(
                        $scope.formData.mTipoDocumento.Codigo,
                        $scope.formData.mNumeroDocumento
                      )
                        ? $scope.formData.mNomContratante
                        : $scope.formData.mRazSocContratante,
                      ApellidoPaterno: $scope.checkRucPerson(
                        $scope.formData.mTipoDocumento.Codigo,
                        $scope.formData.mNumeroDocumento
                      )
                        ? $scope.formData.mApePatContratante
                        : "",
                      ApellidoMaterno: $scope.checkRucPerson(
                        $scope.formData.mTipoDocumento.Codigo,
                        $scope.formData.mNumeroDocumento
                      )
                        ? $scope.formData.mApeMatContratante
                        : "",
                      Score: $scope.formData.Scores,
                      Sexo: $scope.checkRucPerson(
                        $scope.formData.mTipoDocumento.Codigo,
                        $scope.formData.mNumeroDocumento
                      )
                        ? $scope.formData.Sexo != undefined
                          ? $scope.formData.Sexo.Codigo
                          : ""
                        : 0,
                      FechaNacimiento: $scope.checkRucPerson(
                        $scope.formData.mTipoDocumento.Codigo,
                        $scope.formData.mNumeroDocumento
                      )
                        ? $filter("date")($scope.formData.fechaNacimiento, "dd/MM/yyyy")
                        : "",
                      MCAMapfreDolar: $scope.formData.MCAMapfreDolar,
                      ImporteMapfreDolar: $scope.checkRucPerson(
                        $scope.formData.mTipoDocumento.Codigo,
                        $scope.formData.mNumeroDocumento
                      )
                        ? $scope.formData.optMostrarMDolar == 1
                          ? $scope.formData.ImporteMapfreDolar
                          : ""
                        : "",
                      EstadoCivil: $scope.formData.isEmblem && $scope.formData.mEstadoCivil ? { Codigo: $scope.formData.mEstadoCivil.Codigo } : undefined,
                      FechaExpedicion: $scope.formData.isEmblem ? validateExpirationDate($scope.formData) : undefined
                    }
                  };
                  mpSpin.start();
                  autosCotizarFactory
                    .grabarVehiculo(dataCotizacion)
                    .then(function(response) {
                      mpSpin.end();
                      if (response.OperationCode == constants.operationCode.success) {
                        if (!angular.isUndefined($scope.formData.DocumentosAsociados2)) {
                          // Productos para Modalidad para firma
                          var productos = [];
                          if ($scope.productosrel) {
                            productos = $scope.productosrel;
                          }
                          productos.push($scope.prdPrincipal);

                          autosCotizarFactory.addVariableSession('productosCotizacion', productos);

                          for (var j = 0; j < response.Data.DocumentosAsociados.length; j++) {
                            dataNroCotizacion.push(response.Data.DocumentosAsociados[j].NumeroDocumento);
                          }

                          if (!angular.isUndefined(dataNroCotizacion) || dataNroCotizacion != null) {
                            autosCotizarFactory.addVariableSession("documentosCotizacion", dataNroCotizacion);
                            $scope.bGuardarCotizacion = true;
                            $scope.formData = {};
                            /*$state.go("cotizacionGuardadaAutos", {
                              requestId: $rootScope.dataFromInspec ? $rootScope.dataFromInspec.requestId : null,
                              vehiclePlate: $rootScope.dataFromInspec ? $rootScope.dataFromInspec.vehicleLicensePlate : null
                            }); // Redireccionamiento
							*/
							if($scope.encuesta.mostrar == 1){
                              $scope.encuesta.numOperacion = dataNroCotizacion.join('-');
                            $state.go("cotizacionGuardadaAutos", {
								  encuesta: $scope.encuesta,
                              requestId: $rootScope.dataFromInspec ? $rootScope.dataFromInspec.requestId : null,
                              vehiclePlate: $rootScope.dataFromInspec ? $rootScope.dataFromInspec.vehicleLicensePlate : null
                            }); // Redireccionamiento
                            }else{
                              $state.go("cotizacionGuardadaAutos", {
								  requestId: $rootScope.dataFromInspec ? $rootScope.dataFromInspec.requestId : null,
								  vehiclePlate: $rootScope.dataFromInspec ? $rootScope.dataFromInspec.vehicleLicensePlate : null
								}); // Redireccionamiento
                          }
                        }
                        }
                      } else if (response.OperationCode == 500) {
                        mModalAlert.showError("No se ha podido cotizar, intente más tarde", "¡Error al cotizar!");
                      } else if (response.OperationCode == 900) {
                        mModalAlert.showError(response.Message, "¡Error al cotizar!");
                      }
                    })
                    .catch(function(error) {
                      mpSpin.end();
                      mModalAlert.showError("Error en grabarVehiculo: " + error, "Error");
                    });
                }
              }
            }
          } else {
            mModalAlert.showError("No tiene un agente seleccionado", "Error");
          }
        };

        // Verificamos si el auto es o no nuevo
        function setearEstadoVehiculo() {
          var fecha = new Date();
          var ano = fecha.getFullYear();

          //AnioFabricacion
          if (ano - $scope.formData.mYearFabric.Codigo < 2) {
            $scope.edoVehiculoNew = true;
          } else {
            $scope.edoVehiculoNew = false;
            $scope.selectUsado = true;
          }
        }

        function sinProductos() {
          var seleccionado = false;
          for (var i = 0; i < $scope.formData.DocumentosAsociados.length; i++) {
            if ($scope.formData.DocumentosAsociados[i] != null) {
              if ($scope.formData.DocumentosAsociados[i].Selected) {
                seleccionado = true;
              }
            }
          }

          return seleccionado;
        }

        function validateExpirationDate(formData) {
          if (formData.day && formData.day.Codigo && formData.month && formData.month.Codigo && formData.year && formData.year.Codigo) {
            return (formData.day.Descripcion + "/" + formData.month.Descripcion + "/" + formData.year.Descripcion);
          }
        }

        function guardarPaso3() {
          $scope.frmClientData.markAsPristine();

          if (!sinProductos()) {
            mModalAlert.showWarning("Para continuar seleccione/cambie el producto", "¡Seleccione un producto!");
            datosContratanteValidated = false;
            $scope.formData.validatedPaso3 = false;
            return false;
          } else {
            return true;
          }
        }

        $scope.isRC = function(label) {
          var tipoRC = false;

          if (!(typeof label == "undefined")) {
            tipoRC = label.indexOf("RC") >= 0;
          }

          return tipoRC;
        };

        $scope.isBancaSeg = function() {
          return oimPrincipal.get_role() === "BANSEG";
        };

        $scope.showVigencia = function() {
          if ($scope.formData.mProducto) {
            if ($scope.formData.mProducto.TipoProducto === "PLURIANUAL") {
              return false;
            } else {
              return oimPrincipal.get_role() === "BANSEG";
            }
          }
        };
      }
    ]);
  }
);
