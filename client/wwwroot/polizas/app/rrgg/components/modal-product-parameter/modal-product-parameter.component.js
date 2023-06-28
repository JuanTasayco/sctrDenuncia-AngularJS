'use strict';
define([
  'angular', 'constants', 'constantsRiesgosGenerales', 'lodash'
], function (ng, constants, constantsRiesgosGenerales, _) {
  modalProductParameterController.$inject = ['$scope', 'riesgosGeneralesService', 'riesgosGeneralesCommonFactory', 'riesgosGeneralesFactory', '$uibModal'];
  function modalProductParameterController($scope, riesgosGeneralesService, riesgosGeneralesCommonFactory, riesgosGeneralesFactory, $uibModal) {
    var vm = this;
    //Functions
    vm.getDataParametro = getDataParametro
    vm.data = {}
    vm.$onInit = function () {
      vm.constantsRrgg = constantsRiesgosGenerales
      vm.PRODUCTS = [
        {
          CODIGO: 1,
          GRUPO: "TRE",
          MENU: [
            {
              CodigoProducto: "1",
              Activo: true
              //Descripcion": "Tipos de Trabajo Asegurar",
            
            },
            {
              CodigoProducto: "2",
              Activo: false
              //Descripcion": "Ramo",
            
            },
            {
              CodigoProducto: "5",
              Activo: false
              //Descripcion: "Descripción de Equipos",
            
            },
            {
              CodigoProducto: "11",
              Activo: false
              //Descripcion: "Clases Equipos",
            
            },
            {
              CodigoProducto: "15",
              Activo: true
              //Descripcion: "Coberturas Adicionales",
            
            },
            {
              CodigoProducto: "17",
              Activo: true
              //Descripcion: "Prima Neta Minima",
            
            },
            {
              CodigoProducto: "18",
              Activo: true
              //Descripcion: "Nota",
            
            },
            {
              CodigoProducto: "21",
              Activo: true
              //Descripcion: "Descuento Comerciales Simple",
            
            },
            {
              CodigoProducto: "25",
              Activo: true
              //Descripcion: "Deducible Simple"
              
            },
            {
              CodigoProducto: "31",
              Activo: false
              //Descripcion: "Cotizar un solo Equipo",
              
            },
            {
              CodigoProducto: "34",
              Activo: false
              //Descripcion: "Vigencia",
              
            },
            {
              CodigoProducto: "37",
              Activo: false
              //Descripcion: "Montos Maximos",
              
            },
            {
              CodigoProducto: "38",
              Activo: true
              //Descripcion: "Exclusiones del Producto",
              
            },
            {
              CodigoProducto: "39",
              Activo: true
              //Descripcion: "Execpciones",
              
            },
            {
              CodigoProducto: "61",
              Activo: false
              //Descripcion: "Otros Parametros",
              
            },
            {
              CodigoProducto: "62",
              Activo: false
              //Descripcion: "Fecha Vencimiento Cotizador - Excel Emision",
              
            },
            {
              CodigoProducto: "63",
              Activo: false
              //Descripcion: "Días RetroActivos Permitidos",
              
            },
            {
              CodigoProducto: "65",
              Activo: false
              //Descripcion: "Vigencia Cotizador",
              
            },
            {
              CodigoProducto: "66",
              Activo: false
              //Descripcion: "Texto Moneda (Excel)",
              
            }
          ]
        },
        {
          CODIGO: 2,
          GRUPO: "TEE",
          MENU: [
            {
              CodigoProducto: "1",
              Activo: true
              //"Descripcion": "Tipos de Trabajo Asegurar"
            },
            {
              CodigoProducto: "2",
              Activo: false
              //"Descripcion": "Ramo"
            },
            {
              CodigoProducto: "9",
              Activo: true
              //"Descripcion": "Tasa Netas Anuales"
            },
            {
              CodigoProducto: "12",
              Activo: true
              //"Descripcion": "Valor Maximo del Contrato"
            },
            {
              CodigoProducto: "14",
              Activo: true
              //"Descripcion": "Suma Asegurada Maxima"
            },
            {
              CodigoProducto: "15",
              Activo: true
              //"Descripcion": "Coberturas Adicionales"
            },
            {
              CodigoProducto: "16",
              Activo: true
              //"Descripcion": "Descuentos Comerciales"
            },
            {
              CodigoProducto: "17",
              Activo: true
              //"Descripcion": "Prima Neta Minima"
            },
            {
              CodigoProducto: "18",
              Activo: true
              //"Descripcion": "Nota"
            },
            {
              CodigoProducto: "19",
              Activo: true
              //"Descripcion": "Tabla de Periodo Corto"
            },
            {
              CodigoProducto: "20",
              Activo: true
              //"Descripcion": "Tabla de Volumen"
            },
            {
              CodigoProducto: "25",
              Activo: false
              //"Descripcion": "Deducible Simple"
            },
            {
              CodigoProducto: "26",
              Activo: true
              //"Descripcion": "Riesgos Excluidos"
            },
            {
              CodigoProducto: "28",
              Activo: true
              //"Descripcion": "Duraciones"
            },
            {
              CodigoProducto: "32",
              Activo: false
              //"Descripcion": "Prima por Inclusion"
            },
            {
              CodigoProducto: "61",
              Activo: false
              //"Descripcion": "Otros Parametros"
            },
            {
              CodigoProducto: "62",
              Activo: false
              //"Descripcion": "Fecha Vencimiento Cotizador - Excel Emision"
            },
            {
              CodigoProducto: "63",
              Activo: false
              //"Descripcion": "Días RetroActivos Permitidos"
            },
            {
              CodigoProducto: "65",
              Activo: false
              //"Descripcion": "Vigencia Cotizador"
            },
            {
              CodigoProducto: "66",
              Activo: false
              //"Descripcion": "Texto Moneda (Excel)"
            }
          ]
        },
        {
          CODIGO: 3,
          GRUPO: "HDR",
          MENU: [
            {
              CodigoProducto: "4",
              Activo: true
              //"Descripcion": "Giros de Negocio",
              
            },
            {
              CodigoProducto: "9",
              Activo: true
              //"Descripcion": "Tasa Netas Anuales",
              
            },
            {
              CodigoProducto: "10",
              Activo: false
              //"Descripcion": "Coberturas",
              
            },
            {
              CodigoProducto: "11",
              Activo: false
              //"Descripcion": "Clases Equipos",
              
            },
            {
              CodigoProducto: "14",
              Activo: false
              //"Descripcion": "Suma Asegurada Maxima",
              
            },
            {
              CodigoProducto: "17",
              Activo: true
              //"Descripcion": "Prima Neta Minima",
              
            },
            {
              CodigoProducto: "25",
              Activo: false
              //"Descripcion": "Deducible Simple",
              
            },
            {
              CodigoProducto: "40",
              Activo: true
              //"Descripcion": "Seguro de Transportes para Empresas Transportistas",
              
            },
            {
              CodigoProducto: "41",
              Activo: false
              //"Descripcion": "Tracto/No Tracto",
              
            },
            {
              CodigoProducto: "42",
              Activo: true
              //"Descripcion": "Descuentos Por Giro de Negocio",
              
            },
            {
              CodigoProducto: "43",
              Activo: false
              //"Descripcion": "Otros Descuentos",
              
            },
            {
              CodigoProducto: "44",
              Activo: false
              //"Descripcion": "Tipos Parametros",
              
            },
            {
              CodigoProducto: "59",
              Activo: true
              //"Descripcion": "RC Vehicular para Empresa Transportista de HIDRO",
              
            },
            {
              CodigoProducto: "61",
              Activo: false
              //"Descripcion": "Otros Parametros",
              
            },
            {
              CodigoProducto: "62",
              Activo: false
              //"Descripcion": "Fecha Vencimiento Cotizador - Excel Emision",
              
            },
            {
              CodigoProducto: "63",
              Activo: false
              //"Descripcion": "Días RetroActivos Permitidos",
              
            },
            {
              CodigoProducto: "65",
              Activo: false
              //"Descripcion": "Vigencia Cotizador",
              
            },
            {
              CodigoProducto: "66",
              Activo: false
              //"Descripcion": "Texto Moneda (Excel)",
              
            }
          ]

        },
        {
          CODIGO: 4,
          GRUPO: "CAR",
          MENU: [
            {
              CodigoProducto: "2",
              Activo: false
              //"Descripcion": "Ramo",
            },
            {
              CodigoProducto: "6",
              Activo: true
              //"Descripcion": "Tipos de Proyecto",
            },
            {
              CodigoProducto: "9",
              Activo: true
              //"Descripcion": "Tasa Netas Anuales",
            },
            {
              CodigoProducto: "67",
              Activo: true
              //"Descripcion": "Nota Tasas",
            },
            {
              CodigoProducto: "17",
              Activo: true
              //"Descripcion": "Prima Neta Minima",
            },
            {
              CodigoProducto: "25",
              Activo: false
              //"Descripcion": "Deducible Simple",
            },
            {
              CodigoProducto: "26",
              Activo: true
              //"Descripcion": "Riesgos Excluidos",
            },
            {
              CodigoProducto: "28",
              Activo: true
              //"Descripcion": "Duraciones",
            },
            {
              CodigoProducto: "52",
              Activo: false
              //"Descripcion": "Tipos de Proyecto - Emisión",
            },
            {
              CodigoProducto: "61",
              Activo: false
              //"Descripcion": "Otros Parametros",
            },
            {
              CodigoProducto: "62",
              Activo: false
              //"Descripcion": "Fecha Vencimiento Cotizador - Excel Emision",
            },
            {
              CodigoProducto: "63",
              Activo: false
              //"Descripcion": "Días Retroactivos Permitidos",
            },
            {
              CodigoProducto: "65",
              Activo: false
              //"Descripcion": "Vigencia Cotizador",
            },
            {
              CodigoProducto: "66",
              Activo: false
              //"Descripcion": "Texto Moneda (Excel)",
             },
             {
               CodigoProducto: "67",
               Activo: false
               //"Descripcion": "Texto Moneda (Excel)",
              }
          ]
        },
        {
          CODIGO: 5,
          GRUPO: "CAL",
          MENU: [
            {
              CodigoProducto: "2",
              Activo: false
              //"Descripcion": "Ramo"
            },
            {
              CodigoProducto: "6",
              Activo: true
              //"Descripcion": "Tipos de Proyecto"
            },
            {
              CodigoProducto: "9",
              Activo: true
              //"Descripcion": "Tasa Netas Anuales"
            },
            {
              CodigoProducto: "67",
              Activo: true
              //"Descripcion": "Nota Tasas",
            },
            {
              CodigoProducto: "17",
              Activo: true
              //"Descripcion": "Prima Neta Minima"
            },
            {
              CodigoProducto: "25",
              Activo: false
              //"Descripcion": "Deducible Simple"
            },
            {
              CodigoProducto: "26",
              Activo: true
              //"Descripcion": "Riesgos Excluidos"
            },
            {
              CodigoProducto: "28",
              Activo: true
              //"Descripcion": "Duraciones"
            },
            {
              CodigoProducto: "52",
              Activo: false
              //"Descripcion": "Tipos de Proyecto - Emisión"
            },
            {
              CodigoProducto: "61",
              Activo: false
              //"Descripcion": "Otros Parametros"
            },
            {
              CodigoProducto: "62",
              Activo: false
              //"Descripcion": "Fecha Vencimiento Cotizador - Excel Emision"
            },
            {
              CodigoProducto: "63",
              Activo: false
              //"Descripcion": "Días Retroactivos Permitidos"
            },
            {
              CodigoProducto: "65",
              Activo: false
              //"Descripcion": "Vigencia Cotizador"
            },
            {
              CodigoProducto: "66",
              Activo: false
              //"Descripcion": "Texto Moneda (Excel)"
            }
          ]
        },
        {
          CODIGO: 6,
          GRUPO: "VYL",
          MENU: [
            {
              CodigoProducto: "2",
              Activo: false
              //"Descripcion": "Ramo"
            },
            {
              CodigoProducto: "7",
              Activo: false
              //"Descripcion": "Actividades a Realizar"
            },
            {
              CodigoProducto: "9",
              Activo: true
              //"Descripcion": "Tasa Netas Anuales"
            },
            {
              CodigoProducto: "67",
              Activo: true
              //"Descripcion": "Nota Tasas",
            },
            {
              CodigoProducto: "14",
              Activo: false
              //"Descripcion": "Suma Asegurada Maxima"
            },
            {
              CodigoProducto: "16",
              Activo: true
              //"Descripcion": "Descuentos Comerciales"
            },
            {
              CodigoProducto: "17",
              Activo: true
              //"Descripcion": "Prima Neta Minima"
            },
            {
              CodigoProducto: "25",
              Activo: false
              //"Descripcion": "Deducible Simple"
            },
            {
              CodigoProducto: "28",
              Activo: false
              //"Descripcion": "Duraciones"
            },
            {
              CodigoProducto: "46",
              Activo: true
              //"Descripcion": "Objeto"
            },
            {
              CodigoProducto: "60",
              Activo: true
              //"Descripcion": "Descuento por Volumen"
            },
            {
              CodigoProducto: "61",
              Activo: false
              //"Descripcion": "Otros Parametros"
            },
            {
              CodigoProducto: "62",
              Activo: false
              //"Descripcion": "Fecha Vencimiento Cotizador - Excel Emision"
            },
            {
              CodigoProducto: "63",
              Activo: false
              //"Descripcion": "Días Retroactivos Permitidos"
            },
            {
              CodigoProducto: "65",
              Activo: false
              //"Descripcion": "Vigencia Cotizador"
            },
            {
              CodigoProducto: "66",
              Activo: false
              //"Descripcion": "Texto Moneda (Excel)"
            }
          ]
        },
        {
          CODIGO: 7,
          GRUPO: "TRA",
          MENU: [
            {
              CodigoProducto: "2",
              Activo: false
              //"Descripcion": "Ramo"
            },
            {
              CodigoProducto: "8",
              Activo: false
              //"Descripcion": "Lista de Embalaje"
            },
            {
              CodigoProducto: "22",
              Activo: false
              //"Descripcion": "Embalajes"
            },
            {
              CodigoProducto: "26",
              Activo: true
              //"Descripcion": "Riesgos Excluidos"
            },
            {
              CodigoProducto: "27",
              Activo: true
              //"Descripcion": "Consideraciones"
            },
            {
              CodigoProducto: "47",
              Activo: false
              //"Descripcion": "Radio de Accion"
            },
            {
              CodigoProducto: "48",
              Activo: false
              //"Descripcion": "Tipo Transporte"
            },
            {
              CodigoProducto: "49",
              Activo: false
              //"Descripcion": "Materia Asegurada"
            },
            {
              CodigoProducto: "50",
              Activo: false
              //"Descripcion": "Valuación de Mercancía"
            },
            {
              CodigoProducto: "51",
              Activo: false
              //"Descripcion": "Tipo de Suscripción"
            },
            {
              CodigoProducto: "61",
              Activo: false
              //"Descripcion": "Otros Parametros"
            },
            {
              CodigoProducto: "62",
              Activo: false
              //"Descripcion": "Fecha Vencimiento Cotizador - Excel Emision"
            },
            {
              CodigoProducto: "63",
              Activo: false
              //"Descripcion": "Días Retroactivos Permitidos"
            },
            {
              CodigoProducto: "64",
              Activo: false
              //"Descripcion": "Párrafos para PDF"
            },
            {
              CodigoProducto: "65",
              Activo: false
              //"Descripcion": "Vigencia Cotizador"
            },
            {
              CodigoProducto: "66",
              Activo: false
              //"Descripcion": "Texto Moneda (Excel)"
            }
          ]
        },
        {
          CODIGO: 8,
          GRUPO: "EVE",
          MENU: [
            {
              CodigoProducto: "2",
              Activo: false
              //"Descripcion": "Ramo"
            },
            {
              CodigoProducto: "14",
              Activo: true
              //"Descripcion": "Suma Asegurada Maxima"
            },
            {
              CodigoProducto: "17",
              Activo: true
              //"Descripcion": "Prima Neta Minima"
            },
            {
              CodigoProducto: "24",
              Activo: true
              //"Descripcion": "Tasa Netas Anuales Simple"
            },
            {
              CodigoProducto: "25",
              Activo: true
              //"Descripcion": "Deducible Simple"
            },
            {
              CodigoProducto: "26",
              Activo: true
              //"Descripcion": "Riesgos Excluidos"
            },
            {
              CodigoProducto: "61",
              Activo: false
              //"Descripcion": "Otros Parametros"
            },
            {
              CodigoProducto: "62",
              Activo: false
              //"Descripcion": "Fecha Vencimiento Cotizador - Excel Emision"
            },
            {
              CodigoProducto: "63",
              Activo: false
              //"Descripcion": "Días Retroactivos Permitidos"
            },
            {
              CodigoProducto: "65",
              Activo: false
              //"Descripcion": "Vigencia Cotizador"
            },
            {
              CodigoProducto: "66",
              Activo: false
              //"Descripcion": "Texto Moneda (Excel)"
            }
          ]
        },
        {
          CODIGO: 9,
          GRUPO: "DEM",
          MENU: [
            {
              CodigoProducto: "2",
              Activo: false
              //"Descripcion": "Ramo"
            },
            {
              CodigoProducto: "9",
              Activo: true
              //"Descripcion": "Tasa Netas Anuales"
            },
            {
              CodigoProducto: "17",
              Activo: true
              //"Descripcion": "Prima Neta Minima"
            },
            {
              CodigoProducto: "61",
              Activo: false
              //"Descripcion": "Otros Parametros"
            },
            {
              CodigoProducto: "62",
              Activo: false
              //"Descripcion": "Fecha Vencimiento Cotizador - Excel Emision"
            },
            {
              CodigoProducto: "63",
              Activo: false
              //"Descripcion": "Días Retroactivos Permitidos"
            },
            {
              CodigoProducto: "65",
              Activo: false
              //"Descripcion": "Vigencia Cotizador"
            },
            {
              CodigoProducto: "66",
              Activo: false
              //"Descripcion": "Texto Moneda (Excel)"
            }
          ]
        }
      ];
      vm.tramite = {
        Grupo: vm.cotizacion.producto.Grupo,
        idProducto: vm.cotizacion.producto.CodigoRiesgoGeneral
      }
      riesgosGeneralesService.parametroCabecera(vm.tramite.idProducto).then(function (response) {
        if (response.OperationCode === constants.operationCode.success) {
          var product = vm.PRODUCTS.filter(function(x) { return x.GRUPO === vm.tramite.Grupo})[0]
          var data = response.Data.filter(function(x) { 
                 return product.MENU.filter(function(y) { 
                   return y.CodigoProducto === x.CodigoProducto && y.Activo}
                   )[0]})
          vm.data.tab = data
          getDataParametro(vm.data.tab[0])
        }
      })
    }
    function setAccessParamConverSoles(codParam, dataParam) {
      var codParams = parseInt(codParam);
      var response = false;
      var array = dataParam.Descripcion.split(" ");
      var isDolar = array.find(function (element) { return element === "Dolares" });
      if (isDolar) {
        response = true
      } else {
        response = false;
      }
      return response;
    }
    function getDataParametro(cabecera) {
      if (cabecera.TipoParametro === vm.constantsRrgg.PARAMETROS.TIPO_LISTA) {
        riesgosGeneralesService.listParametrobyProducto(vm.tramite.idProducto, cabecera.CodigoProducto).then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            response.Data.forEach(function (item) {
              if (setAccessParamConverSoles(cabecera.CodigoProducto, item)) {
                item.Descripcion = item.Descripcion + ": " + riesgosGeneralesFactory.convertMiles(item.Valor) + " y para Soles: " +
                  riesgosGeneralesFactory.convertMiles(riesgosGeneralesCommonFactory.convertDolaresAsoles(item.Valor).montoMaximo)
              } else {
                if(item.Codigo!=="S0170" && !item.Descripcion.includes(item.Valor+':')){
                  var valor = item.Valor ? ": " + item.Valor : "";
                  item.Descripcion = item.Descripcion + valor;
                }
              }
            });
            vm.data.dataParametro = response.Data
          }
        })
      }
      if (cabecera.TipoParametro === vm.constantsRrgg.PARAMETROS.TIPO_TABLA) {
        var moneda = _validateMoneda(cabecera)
        riesgosGeneralesService.tablaParametrobyProducto(vm.tramite.idProducto, cabecera.CodigoProducto, moneda).then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            var group = Object.values(_.groupBy(response.Data, _nameAgrupador(cabecera)));
            group.forEach(function (item, index) {
              group[index] = _.groupBy(item, "Orden");
            })
            vm.data.dataTableParametro = group
            _tipoTabla(cabecera)
            if (vm.arrayHeaders.type === 3)
              _orderTableHorizontal()
          }
        })
      }
    }
    function _tipoTabla(cabecera) {
      switch (cabecera.CodigoProducto) {
        case vm.constantsRrgg.CAB_VALID.TASA_NETA_ANUAL:
          if (vm.tramite.Grupo === vm.constantsRrgg.GRUPO.TRAB_ESPECIFICOS) {
            vm.arrayHeaders = {
              type: 1,
              currency: true,
              percent: "",
              headerHorizontal: [
                {
                  header: "Suma asegurada",
                  id: 0,
                  cssClassColor: "bg-gray-dark",
                },
                {
                  header: "Valor del  contrato o Suma <br>Asegurada (el mayor)",
                  id: 1,
                  cssClassColor: "bg-gray-light",
                  cssClassMargin: "text-rotate--lg"
                }
              ]
            }
          }
          if (vm.tramite.Grupo === vm.constantsRrgg.GRUPO.HIDROCARBURO) {
            vm.arrayHeaders = {
              type: 2,
              headerVertical: [
                {
                  id: 0,
                  headerGeneral: "Tabla en S/. Nuevos Soles",
                  currency: true,
                  percent: "",
                  headers: _getHeaders()
                },
                {
                  id: 1,
                  headerGeneral: "Tabla en US$ Dólares Americanos",
                  currency: true,
                  percent: "",
                  headers: _getHeaders()
                }
              ]
            }
          }
          if (vm.tramite.Grupo === vm.constantsRrgg.GRUPO.CAR
            || vm.tramite.Grupo === vm.constantsRrgg.GRUPO.CARLITE
            || vm.tramite.Grupo === vm.constantsRrgg.GRUPO.VIGLIMP
            || vm.tramite.Grupo === vm.constantsRrgg.GRUPO.DEMOLICIONES) {
            vm.arrayHeaders = [{
              type: 4,
              headerGeneral: "Valor del contrato",
              currency: false,
              percent: "%",
              headers: _getCabeceras(vm.data.dataTableParametro[0][1]),
              data: _getData(vm.data.dataTableParametro[0]),
            }];
            if (vm.tramite.Grupo === vm.constantsRrgg.GRUPO.DEMOLICIONES) {
              vm.arrayHeaders[0]["tipeMoney"] = "Dólares"
              vm.arrayHeaders.push(
                {
                  type: 4,
                  headerGeneral: "Valor del contrato",
                  tipeMoney: "Soles",
                  currency: false,
                  percent: "%",
                  headers: _getCabeceras(vm.data.dataTableParametro[0][1]),
                  data: _getDataSoles(vm.data.dataTableParametro[0]),
                }
              );
            }

          }
          break;
        case vm.constantsRrgg.CAB_VALID.COBER_SUMAS_A:
          vm.arrayHeaders = {
            type: 3,
            children: [
              {
                id: 0,
                Moneda: 1,
                headerGeneral: "Tabla en S/. Nuevos Soles",
                currency: true,
                percent: "",
                headerHorizontal: [
                  {
                    header: "COBERTURA",
                    Grupo: "Cobertura",
                    id: 0,
                    cssClassColor: "bg-gray-dark",
                    data: []
                  },
                  {
                    header: "SUM. TRANS.<br> AMT",
                    Grupo: "Suma Transporte AMT",
                    id: 0,
                    cssClassColor: "bg-gray-light",
                    data: []
                  },
                ]
              },
              {
                id: 1,
                Moneda: 2,
                headerGeneral: "Tabla en US$ Dólares Americanos",
                currency: true,
                percent: "",
                headerHorizontal: [
                  {
                    header: "COBERTURA",
                    Grupo: "Cobertura",
                    id: 1,
                    cssClassColor: "bg-gray-dark",
                    data: []
                  },
                  {
                    header: "SUM. TRANS.<br> AMT",
                    Grupo: "Suma Transporte AMT",
                    id: 1,
                    cssClassColor: "bg-gray-light",
                    data: []
                  }
                ]
              }
            ]
          }
          break;
        case vm.constantsRrgg.CAB_VALID.DESC_COMERCIAL:
          vm.arrayHeaders = [{
            type: 4,
            headerGeneral: "Para Sumas Aseguradas",
            currency: true,
            percent: "",
            headers: _getCabeceras(vm.data.dataTableParametro[0][1]),
            data: _getData(vm.data.dataTableParametro[0]),
          }]
          break;
        case vm.constantsRrgg.CAB_VALID.PER_CORTO:
          vm.arrayHeaders = [{
            type: 4,
            headerGeneral: "Vigencia (días)",
            currency: false,
            percent: "%",
            headers: _getCabeceras(vm.data.dataTableParametro[0][1]),
            data: _getData(vm.data.dataTableParametro[0])
          }]
          break;
        case vm.constantsRrgg.CAB_VALID.TBL_VOLUMEN:
          vm.arrayHeaders = [{
            type: 4,
            headerGeneral: "N° de Personas",
            currency: false,
            percent: "%",
            headers: _getCabeceras(vm.data.dataTableParametro[0][1]),
            data: _getData(vm.data.dataTableParametro[0])
          }]
          break;
        case vm.constantsRrgg.CAB_VALID.PRIM_INCLUSION:
          vm.arrayHeaders = [{
            type: 4,
            headerGeneral: "Prima por inclusión",
            currency: true,
            percent: "",
            headers: _getCabeceras(vm.data.dataTableParametro[0][1]),
            data: _getData(vm.data.dataTableParametro[0])
          }]
          break;
        case vm.constantsRrgg.CAB_VALID.DES_X_PERS:
          if (vm.tramite.Grupo === vm.constantsRrgg.GRUPO.VIGLIMP) {
            vm.arrayHeaders = [{
              type: 4,
              headerGeneral: "Descuentos por Número de Personas",
              currency: false,
              percent: "%",
              headers: _getCabeceras(vm.data.dataTableParametro[0][1]),
              data: _getData(vm.data.dataTableParametro[0]),
            }]
          }
          break;
        case vm.constantsRrgg.CAB_VALID.RC_VEHI_EMP:
          vm.arrayHeaders = {
            type: 3,
            children: [
              {
                id: 1,
                Moneda: 2,
                headerGeneral: "RC VEHICULAR PARA EMPRESA TRANSPORTISTA DE HIDROCARBUROS <br> Tabla en US$ Dólares Americanos <br> Coberturas  y Sumas Aseguradas",
                currency: true,
                percent: "",
                headerHorizontal: [
                  {
                    header: "RC VEHICULAR",
                    Grupo: "RC VEHICULAR",
                    id: 1,
                    cssClassColor: "bg-gray-dark",
                    data: []
                  },
                  {
                    header: "ACCIDENTES<br> PERSONALES",
                    Grupo: "ACCIDENTES PERSONALES",
                    id: 1,
                    cssClassColor: "bg-gray-light",
                    data: []
                  },
                  {
                    header: "PRIMA NETA",
                    Grupo: "PRIMA NETA",
                    id: 1,
                    cssClassColor: "bg-gray-dark",
                    data: []
                  },
                  {
                    header: "PRIMA TOTAL",
                    Grupo: "PRIMA TOTAL",
                    id: 1,
                    cssClassColor: "bg-gray-light",
                    data: []
                  }
                ]
              }
            ]
          }
          break;
        default:
          break;
      }
    }
    function _getCabeceras(data) {
      return data.map(function (item) {
        return {
          "header": item.Titulo
        }
      })
    }
    function _getData(data) {
      return Object.values(data).map(function (element) {
        return element.map(function (item) {
          return item.Dato
        })
      })
    }
    function _getDataSoles(data) {
      return Object.values(data).map(function (element) {
        return element.map(function (item) {
          if (item.Titulo.toUpperCase() === "DESDE" || item.Titulo.toUpperCase() === "HASTA") {
            return riesgosGeneralesFactory.convertMiles(riesgosGeneralesCommonFactory.convertDolaresAsoles(item.Dato,item.Titulo.toUpperCase()).montoMaximo);
          }
          else{
            return item.Dato;
          }
        })
      })
    }

    function _nameAgrupador(cabecera) {
      var nameAgrupador = "Grupo"
      if (cabecera.CodigoProducto === vm.constantsRrgg.CAB_VALID.TASA_NETA_ANUAL &&
        vm.tramite.Grupo === vm.constantsRrgg.GRUPO.HIDROCARBURO
        || cabecera.CodigoProducto === vm.constantsRrgg.CAB_VALID.COBER_SUMAS_A) {
        nameAgrupador = "Moneda"
      }
      return nameAgrupador
    }
    function _validateMoneda(cabecera) {
      var param = 2
      if (cabecera.CodigoProducto === vm.constantsRrgg.CAB_VALID.PER_CORTO
        || cabecera.CodigoProducto === vm.constantsRrgg.CAB_VALID.TBL_VOLUMEN
        || cabecera.CodigoProducto === vm.constantsRrgg.CAB_VALID.PRIM_INCLUSION
        || cabecera.CodigoProducto === vm.constantsRrgg.CAB_VALID.TASA_NETA_ANUAL
        && vm.tramite.Grupo === vm.constantsRrgg.GRUPO.HIDROCARBURO
        || cabecera.CodigoProducto === vm.constantsRrgg.CAB_VALID.COBER_SUMAS_A
        || cabecera.CodigoProducto === vm.constantsRrgg.CAB_VALID.DES_X_PERS) param = 0
      return param
    }
    function _orderTableHorizontal() {
      vm.arrayHeaders.children.forEach(function (element1) {
        element1.headerHorizontal.forEach(function (element2) {
          vm.data.dataTableParametro.forEach(function (data) {
            Object.values(data).forEach(function (item) {
              item.forEach(function (element) {
                if (element.Grupo === element2.Grupo && element.Moneda === element1.Moneda) {
                  element2.data.push(element)
                }
              });
            });
          });
        });
      });
      vm.arrayHeaders.children.forEach(function (element1) {
        element1.headerHorizontal.forEach(function (element2) {
          element2.data = Object.values(_.groupBy(element2.data, 'Orden'));
        });
      });
    }
    function _getHeaders() {
      return [
        { header: "Suma Asegurada Desde" },
        { header: "Suma Asegurada Hasta" },
        { header: "A" },
        { header: "B" },
        { header: "C" },
        { header: "D" },
        { header: "E" },
        { header: "F" }
      ]
    }
  } // end controller
  return ng.module('appRrgg')
    .controller('modalProductParameterController', modalProductParameterController)
    .component('rrggModalProductParameter', {
      templateUrl: '/polizas/app/rrgg/components/modal-product-parameter/modal-product-parameter.html',
      controller: 'modalProductParameterController',
      bindings: {
        title: '=',
        close: '&',
        cotizacion: "="
      }
    })
});