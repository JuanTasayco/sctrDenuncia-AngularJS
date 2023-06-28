define(['angular', 'constants'], function (ng, constants) {

  KpiSiniestroController.$inject = ['$scope', '$uibModal', 'localStorageService', 'mpSpin', 'configChart', '$q', 'proxyKpiFiltroApi', 'proxyKpiConfiguracionApi', 'proxyKpiSiniestroApi'];

  function KpiSiniestroController($scope, $uibModal, localStorageService, mpSpin, configChart, $q, proxyKpiFiltroApi, proxyKpiConfiguracionApi, proxyKpiSiniestroApi) {
    (
      function onLoad() {
        $scope.config = {
          rangeSearchDate: 12,
          tiempoPromedioAtencion: {
            umbral: {
              credito: 30,
              reembolso: 5,
              creditosoat: 15,
              reembolsosoat: 10
            }
          },
          costoPromedioAtencionPaciente: {
            umbralAtencion: {
              umbralMax: 1000,
              umbralMin: 2000
            },
            umbralPaciente: {
              umbralMax: 1200,
              umbralMin: 2500
            }
          },
          costoPacienteMes: {
            umbral: {
              umbral: 300
            }
          }
        };
        $scope.listNameFilters = '';
        $scope.dashboard = 'SNSTR';
        $scope.showFilters = true;
        $scope.showFilters2 = false;
        $scope.loadCharts = false;
        $scope.filtersData = {};
        $scope.masters = {};
        localStorageService.set('filtersData', $scope.filtersData);

        loadInitialData();

        $scope.$watch('product', function (n, o) {
          if (n != o) {
            var ac_cprdcto = n.cdgo;
            var ac_cod_cia = n.cod_cia;
            var params = { ac_cprdcto: ac_cprdcto, ac_cod_cia: ac_cod_cia };
            $scope.reloadFiltersData('cbrtra', params, false);
            $scope.reloadFiltersData('ejctvo', params, false);
          }
        });

        function loadInitialData() {
          mpSpin.start('Cargando información de filtros de búsqueda, por favor espere...');

          var promiseList = [];
          promiseList.push(returnKpiRamo());
          // promiseList.push(returnKpiProducto());
          promiseList.push(returnKpiContrato());
          promiseList.push(returnKpiDepartamento());
          promiseList.push(returnKpiCobertura({ ac_cprdcto: 'S', ac_cod_cia: '3' }, false));
          promiseList.push(returnKpiDiagnostico());
          promiseList.push(returnKpiEjecutivo({ ac_cprdcto: 'S', ac_cod_cia: '3' }, false));
          promiseList.push(returnKpiAuditorMedico());
          promiseList.push(returnKpiDashboard());

          return $q.all(promiseList).then(function (result) {
            var indexKpiRamo = result.map(function (o) { return o.id; }).indexOf('KpiRamo');
            //var indexKpiProducto = result.map(function (o) { return o.id; }).indexOf('KpiProducto');
            var indexKpiContrato = result.map(function (o) { return o.id; }).indexOf('KpiContrato');
            var indexKpiDepartamento = result.map(function (o) { return o.id; }).indexOf('KpiDepartamento');
            var indexKpiDiagnostico = result.map(function (o) { return o.id; }).indexOf('KpiDiagnostico');
            var indexKpiEjecutivo = result.map(function (o) { return o.id; }).indexOf('KpiEjecutivo');
            var indexKpiAuditorMedico = result.map(function (o) { return o.id; }).indexOf('KpiAuditorMedico');
            var indexKpiDashboard = result.map(function (o) { return o.id; }).indexOf('KpiDashboard');

            //kpiRamo
            if (result[indexKpiRamo].operationCode === 200) {
              var data = result[indexKpiRamo];
              for (var i = 0; i < data.length; i++) {
                var ramo = data[i];
                ramo.dscrpcn = ramo.cdgo + ' - ' + ramo.dscrpcn;
              }
              $scope.masters.ramos = data;
            } else {
              console.log('kpiRamo' + result[indexKpiRamo].message);
            }

            //KpiProducto
            // if (result[indexKpiProducto].operationCode === 200) {
            //   $scope.masters.productos = result[indexKpiProducto];
            // } else {
            //   console.log('KpiProducto' + result[indexKpiProducto].message);
            // }

            //KpiContrato 
            if (result[indexKpiContrato].operationCode === 200) {
              $scope.masters.contratos = result[indexKpiContrato];
            } else {
              console.log('KpiContrato' + result[indexKpiContrato].message);
            }

            //KpiDepartamento 
            if (result[indexKpiDepartamento].operationCode === 200) {
              $scope.masters.departamentos = result[indexKpiDepartamento];
            } else {
              console.log('KpiDepartamento' + result[indexKpiDepartamento].message);
            }

            //KpiDiagnostico
            if (result[indexKpiDiagnostico].operationCode === 200) {
              $scope.masters.diagnosticos = result[indexKpiDiagnostico];
            } else {
              console.log('KpiDiagnostico' + result[indexKpiDiagnostico].message);
            }

            //KpiEjecutivo 
            if (result[indexKpiEjecutivo].operationCode === 200) {
              $scope.masters.ejecutivos = result[indexKpiEjecutivo];
            } else {
              console.log('KpiEjecutivo' + result[indexKpiEjecutivo].message);
            }

            //KpiAuditorMedico 
            if (result[indexKpiAuditorMedico].operationCode === 200) {
              $scope.masters.auditores = result[indexKpiAuditorMedico];
            } else {
              console.log('KpiAuditorMedico' + result[indexKpiAuditorMedico].message);
            }

            //KpiDashboard
            if (result[indexKpiDashboard].operationCode === 200) {
              var result = result[indexKpiDashboard];
              var data = result[0];
              for (var i = 0; i < data.length; i++) {
                var config = data[i];
                switch (config.cdgo) {
                  case '0001':
                    $scope.config.rangeSearchDate = config.vlr;
                    break;
                  case '0002':
                    $scope.config.tiempoPromedioAtencion.umbral.credito = config.vlr;
                    break;
                  case '0003':
                    $scope.config.tiempoPromedioAtencion.umbral.reembolso = config.vlr;
                    break;
                  case '0004':
                    $scope.config.costoPromedioAtencionPaciente.umbralAtencion.umbralMax = config.vlr;
                    break;
                  case '0005':
                    $scope.config.costoPromedioAtencionPaciente.umbralAtencion.umbralMin = config.vlr;
                    break;
                  case '0006':
                    $scope.config.costoPromedioAtencionPaciente.umbralPaciente.umbralMax = config.vlr;
                    break;
                  case '0007':
                    $scope.config.costoPromedioAtencionPaciente.umbralPaciente.umbralMin = config.vlr;
                    break;
                  case '0008':
                    $scope.config.costoPacienteMes.umbral.umbral = config.vlr;
                    break;
                  case '0009':
                    $scope.config.tiempoPromedioAtencion.umbral.creditosoat = config.vlr;
                    break;
                  case '0010':
                    $scope.config.tiempoPromedioAtencion.umbral.reembolsosoat = config.vlr;
                    break;
                }
              }
            } else {
              console.log('KpiDashboard' + result[indexKpiDashboard].message);
            }

            mpSpin.end();
          });
        }

        function returnKpiRamo() {
          var deferred = $q.defer();
          proxyKpiFiltroApi.PostRamo().then(function (response) {
            if (response.operationCode == 200) {
              Object.assign(response.data, { id: 'KpiRamo', operationCode: 200 });
              deferred.resolve(response.data);
            }
          }, function (response) {
            Object.assign(response.data, { id: 'KpiRamo', operationCode: 400 });
            deferred.resolve(response.data);
          });
          return deferred.promise;
        }

        function returnKpiProductoAll() {
          var deferred = $q.defer();
          proxyKpiFiltroApi.PostProducto().then(function (response) {
            if (response.operationCode == 200) {
              Object.assign(response.data, { id: 'KpiProducto', operationCode: 200 });
              deferred.resolve(response.data);
            }
          }, function (response) {
            Object.assign(response.data, { id: 'KpiProducto', operationCode: 400 });
            deferred.resolve(response.data);
          });
          return deferred.promise;
        }

        function returnKpiContrato() {
          var deferred = $q.defer();
          proxyKpiFiltroApi.PostContrato().then(function (response) {
            if (response.operationCode == 200) {
              Object.assign(response.data, { id: 'KpiContrato', operationCode: 200 });
              deferred.resolve(response.data);
            }
          }, function (response) {
            Object.assign(response.data, { id: 'KpiContrato', operationCode: 400 });
            deferred.resolve(response.data);
          });
          return deferred.promise;
        }

        function returnKpiDepartamento() {
          var deferred = $q.defer();
          proxyKpiFiltroApi.PostDepartamento().then(function (response) {
            if (response.operationCode == 200) {
              Object.assign(response.data, { id: 'KpiDepartamento', operationCode: 200 });
              deferred.resolve(response.data);
            }
          }, function (response) {
            Object.assign(response.data, { id: 'KpiDepartamento', operationCode: 400 });
            deferred.resolve(response.data);
          });
          return deferred.promise;
        }

        function returnKpiDiagnostico() {
          var deferred = $q.defer();
          proxyKpiFiltroApi.PostDiagnostico().then(function (response) {
            if (response.operationCode == 200) {
              Object.assign(response.data, { id: 'KpiDiagnostico', operationCode: 200 });
              deferred.resolve(response.data);
            }
          }, function (response) {
            Object.assign(response.data, { id: 'KpiDiagnostico', operationCode: 400 });
            deferred.resolve(response.data);
          });
          return deferred.promise;
        }

        function returnKpiEjecutivo(params, showLoad) {
          var deferred = $q.defer();
          params.ac_tipokpi = "1";
          if (showLoad) mpSpin.start();
          proxyKpiFiltroApi.PostEjecutivo(params).then(function (response) {
            if (response.operationCode == 200) {
              Object.assign(response.data, { id: 'KpiEjecutivo', operationCode: 200 });
              deferred.resolve(response.data);
              $scope.masters.ejecutivos = response.data;
            }
            if (showLoad) mpSpin.end();
          }, function (response) {
            Object.assign(response.data, { id: 'KpiEjecutivo', operationCode: 400 });
            deferred.reject(response);
            if (showLoad) mpSpin.end();
          });
          return deferred.promise;
        }

        // function returnKpiEjecutivo(params) {
        //   var deferred = $q.defer();
        //   params.ac_tipokpi = "1";
        //   proxyKpiFiltroApi.PostEjecutivo(params).then(function (response) {
        //     if (response.operationCode == 200) {
        //       Object.assign(response.data, { id: 'KpiEjecutivo', operationCode: 200 });
        //       deferred.resolve(response.data);
        //     }
        //   }, function (response) {
        //     Object.assign(response.data, { id: 'KpiEjecutivo', operationCode: 400 });
        //     deferred.resolve(response.data);
        //   });
        //   return deferred.promise;
        // }

        function returnKpiAuditorMedico() {
          var deferred = $q.defer();
          proxyKpiFiltroApi.PostAuditorMedico().then(function (response) {
            if (response.operationCode == 200) {
              Object.assign(response.data, { id: 'KpiAuditorMedico', operationCode: 200 });
              deferred.resolve(response.data);
            }
          }, function (response) {
            Object.assign(response.data, { id: 'KpiAuditorMedico', operationCode: 400 });
            deferred.resolve(response.data);
          });
          return deferred.promise;
        }

        function returnKpiDashboard() {
          var deferred = $q.defer();
          proxyKpiConfiguracionApi.PostObtenerConfiguracionDashboard().then(function (response) {
            if (response.operationCode == 200) {
              Object.assign(response.data, { id: 'KpiDashboard', operationCode: 200 });
              deferred.resolve(response.data);
            }
          }, function (response) {
            Object.assign(response.data, { id: 'KpiDashboard', operationCode: 400 });
            deferred.resolve(response.data);
          });
          return deferred.promise;
        }

        $scope.reloadFiltersData = function (search, params, showLoad) {
          var deferred = $q.defer();
          switch (search) {
            case 'sbcntrato':
              deferred.resolve(returnKpiSubcontrato(params, showLoad));
              break;
            case 'prdcto':
              deferred.resolve(returnKpiProducto(params, showLoad));
              break;
            case 'sbprdcto':
              deferred.resolve(returnKpiSubproducto(params, showLoad));
              break;
            case 'prvnce':
              deferred.resolve(returnKpiProvincia(params, showLoad));
              break;
            case 'dstrto':
              deferred.resolve(returnKpiDistrito(params, showLoad));
              break;
            case 'cbrtra':
              deferred.resolve(returnKpiCobertura(params, showLoad));
              break;
            case 'ejctvo':
              deferred.resolve(returnKpiEjecutivo(params, showLoad));
              break;
          }
          return deferred.promise;
        }

        function returnKpiSubcontrato(params, showLoad) {
          var deferred = $q.defer();
          if (params.ac_ndcntrto) {
            if (showLoad) mpSpin.start();
            proxyKpiFiltroApi.PostSubContrato(params).then(function (response) {
              if (response.operationCode == 200) {
                deferred.resolve(response.data);
                $scope.masters.subcontratos = response.data;
              }
              if (showLoad) mpSpin.end();
            }, function (response) {
              // console.log('Error Subcontrato');
              deferred.reject(response);
              if (showLoad) mpSpin.end();
            });
          } else {
            deferred.resolve([]);
            $scope.masters.subcontratos = [];
            // console.log('KpiSubcontrato: vacío');
          }
          return deferred.promise;
        }

        function returnKpiProducto(params, showLoad) {
          var deferred = $q.defer();
          if (params.ac_ramo) {
            if (showLoad) mpSpin.start();
            proxyKpiFiltroApi.PostProducto(params).then(function (response) {
              if (response.operationCode == 200) {
                deferred.resolve(response.data);
                $scope.masters.productos = response.data;
              }
              if (showLoad) mpSpin.end();
            }, function (response) {
              // console.log('Error Producto');
              deferred.reject(response);
              if (showLoad) mpSpin.end();
            });
          } else {
            deferred.resolve([]);
            $scope.masters.productos = [];
            // console.log('KpiProducto: vacío');
          }
          return deferred.promise;
        }

        function returnKpiSubproducto(params, showLoad) {
          var deferred = $q.defer();
          if (params.ac_cprdcto) {
            if (showLoad) mpSpin.start();
            proxyKpiFiltroApi.PostSubProducto(params).then(function (response) {
              if (response.operationCode == 200) {
                deferred.resolve(response.data);
                $scope.masters.subproductos = response.data;
              }
              if (showLoad) mpSpin.end();
            }, function (response) {
              // console.log('Error Subproducto');
              deferred.reject(response);
              if (showLoad) mpSpin.end();
            });
          } else {
            deferred.resolve([]);
            $scope.masters.subproductos = [];
            // console.log('KpiSubproducto: vacío');
          }
          return deferred.promise;
        }

        function returnKpiProvincia(params, showLoad) {
          var deferred = $q.defer();
          if (params.ac_cdprtmnto) {
            if (showLoad) mpSpin.start();
            proxyKpiFiltroApi.PostProvincia(params).then(function (response) {
              if (response.operationCode == 200) {
                deferred.resolve(response.data);
                $scope.masters.provincias = response.data;
              }
              if (showLoad) mpSpin.end();
            }, function (response) {
              // console.log('Error Provincia');
              deferred.reject(response);
              if (showLoad) mpSpin.end();
            });
          } else {
            deferred.resolve([]);
            $scope.masters.provincias = [];
            // console.log('KpiProvincia: vacío');
          }
          return deferred.promise;
        }

        function returnKpiDistrito(params, showLoad) {
          var deferred = $q.defer();
          if (params.an_cprvnca) {
            if (showLoad) mpSpin.start();
            proxyKpiFiltroApi.PostDistrito(params).then(function (response) {
              if (response.operationCode == 200) {
                deferred.resolve(response.data);
                $scope.masters.distritos = response.data;
              }
              if (showLoad) mpSpin.end();
            }, function (response) {
              // console.log('Error Distrito');
              deferred.reject(response);
              if (showLoad) mpSpin.end();
            });
          } else {
            deferred.resolve([]);
            $scope.masters.distritos = [];
            // console.log('KpiDistrito: vacío');
          }
          return deferred.promise;
        }

        function returnKpiCobertura(params, showLoad) {
          var deferred = $q.defer();
          if (params.ac_cprdcto) {
            if (showLoad) mpSpin.start();
            proxyKpiFiltroApi.PostCobertura(params).then(function (response) {
              if (response.operationCode == 200) {
                deferred.resolve(response.data);
                $scope.masters.coberturas = response.data;
              }
              if (showLoad) mpSpin.end();
            }, function (response) {
              // console.log('Error Cobertura');
              deferred.reject(response);
              if (showLoad) mpSpin.end();
            });
          } else {
            deferred.resolve([]);
            $scope.masters.coberturas = [];
            // console.log('KpiCobertura: vacío');
          }
          return deferred.promise;
        }

        $scope.selectProduct = function (product) {
          if($scope.filtersData.filters && $scope.product != product) {
            $scope.filtersData.filters.ac_ccbrtra = { dscrpcn: '', cdgo: null };
            $scope.filtersData.filters.ac_cejctvo = { dscrpcn: '', cdgo: null };
            localStorageService.set('filtersData', $scope.filtersData);
          }
          $scope.product = product;
          var hasRamo = $scope.filtersData.filters && $scope.filtersData.filters.ac_crmo.cdgo != null;
          $scope.showFilters2 = $scope.showFilters ? $scope.showFilters : (product.cod_cia == '1' && product.cdgo == 'S') && !hasRamo;
        }

        $scope.refreshByIndicators = function (indicadores) {
          if (!$scope.showFilters2) {
            $scope.filtersData.filters.indicadores = indicadores;
            generateFilterParams($scope.filtersData);
          }
        }

        $scope.reloadFiltersSelected = function (removedList) {
          for(var i = 0; i < removedList.length; i++) {
            var removed = removedList[i];
            $scope.filtersData.filters[removed.key] = null;
            localStorageService.set('filtersData', $scope.filtersData);
          }
          generateFilterParams($scope.filtersData);
        }

        $scope.applyFilters = function (filters, indicators, todosIndicadores) {
          $scope.listSelectedFilters = filters;
          $scope.filtersData.filters = filters;
          $scope.filtersData.indicators = indicators;
          $scope.filtersData.todosIndicadores = todosIndicadores;
          localStorageService.set('filtersData', $scope.filtersData);
          generateFilterParams($scope.filtersData);
        }

        function generateFilterParams(filtersData) {
          var indicadores = filtersData.filters.indicadores;
          var filters = {
            ac_cprdcto: $scope.product.cdgo,
            ac_cod_cia: $scope.product.cod_cia,
            ac_cdprtmnto: '',
            an_cprvnca: '',
            an_cdstrto: '',
            ac_cclnca: '',
            ac_csde: '',
            ac_ccbrtra: '',
            ac_cdgnstco: '',
            ac_cejctvo: '',
            ac_cadtrmdco: '',
            an_cgecnmco: '',
            an_ccntrtnte: '',
            an_cintrmdro: '',
            ac_cindcdr: '',
            ac_crmo: '',
            ac_cdprdcto: '',
            ac_cdsbprdcto: '',
            ac_ndcntrto: '',
            ac_ndsbcntrto: ''
          };

          for (var key in filtersData.filters) {
            if (key != 'indicadores') {
              if (configChart.validateKeyInFilter($scope.dashboard, $scope.product, filtersData.filters, key)) {
                if (filtersData.filters[key]) {
                  if (filtersData.filters[key].cdgo) filters[key] = filtersData.filters[key].cdgo;
                  else filters[key] = '';
                } else filters[key] = '';
                if (key == 'range_date') {
                  var rangeDate = filtersData.filters[key];
                  filters.ad_fchini = configChart.formatDate(new Date(rangeDate[0]));
                  filters.ad_fchfin = configChart.formatDate(new Date(rangeDate[1]));
                }
              }
            }
          }

          sendRequestIndicator(filters, indicadores);
        }

        function sendRequestIndicator(filters, indicadores) {
          $scope.charts = [];
          $scope.showFilters = false;
          $scope.showFilters2 = false;
          $scope.loadCharts = false;
          var promiseList = [];

          mpSpin.start('Cargando información de indicadores, por favor espere...');

          for (var i = 0; i < indicadores.length; i++) {
            var indicador = indicadores[i];
            if (indicador.selected) {
              switch (indicador.code) {
                case 'SNSTR_TPASP':
                  promiseList.push(returnKpiTiempoAtencion(filters));
                  break;
                case 'SNSTR_NTSP':
                  promiseList.push(returnKpiNumeroTotal(filters));
                  break;
                case 'SNSTR_ITSP':
                  promiseList.push(returnKpiImporteTotal(filters));
                  break;
                case 'SNSTR_CPAP':
                  promiseList.push(returnKpiCostoPromedio(filters));
                  break;
                case 'SNSTR_ITH':
                  if (configChart.validarTasaHospitalizacion($scope.filtersData.filters)) {
                    promiseList.push(returnKpiImporteTasaHospitalizacion(filters));
                  }
                  break;
                case 'SNSTR_CPM':
                  if (configChart.validarCostoPacienteMes($scope.product, $scope.filtersData.filters)) {
                    promiseList.push(returnKpiCostoPacienteMes(filters));
                  }
                  break;
                case 'SNSTR_SOAT_GP':
                  if (configChart.validarGastosProveedor($scope.filtersData.filters)) {
                    promiseList.push(returnKpiGastosProveedor(filters));
                  }
                  break;
                case 'SNSTR_SOAT_GC':
                  promiseList.push(returnKpiGastosCobertura(filters));
                  break;
                case 'SNSTR_SOAT_GTA':
                  promiseList.push(returnKpiGastosTipoAccidente(filters));
                  break;
                case 'SNSTR_SOAT_GUGD':
                  if (configChart.validarGastosUbicacionGeograficaDet($scope.filtersData.filters)) {
                    promiseList.push(returnKpiGastosUbicacionGeograficaDet(filters));
                  }
                  break;
                case 'SNSTR_SOAT_GUGG':
                  if (configChart.validarGastosUbicacionGeograficaGen($scope.filtersData.filters)) {
                    promiseList.push(returnKpiGastosUbicacionGeograficaGen(filters));
                  }
                  break;
              }
            }
          }

          return $q.all(promiseList).then(function (result) {
            var tmp = $scope.charts;
            $scope.charts = tmp.filter(function(e){ return e });
            $scope.loadCharts = true;
            $scope.showErrorComun = result.length == 0;
            // console.log(result);
            mpSpin.end();
          });
        }

        function returnKpiTiempoAtencion(filters) {
          var deferred = $q.defer();
          proxyKpiSiniestroApi.PostTiempoAtencionSiniestroPagado(filters).then(function (response) {
            // console.log('KpiTiempoAtencion');
            if (response.operationCode == 200) {
              var data = response.data[0];
              var charData = configChart.KpiTiempoAtencionSiniestro($scope.filtersData.filters, $scope.product, data, $scope.config.tiempoPromedioAtencion.umbral);
              // $scope.charts.push(charData);
              $scope.charts[0] = charData;
              deferred.resolve('KpiTiempoAtencion: Success');
            } else {
              deferred.resolve('KpiTiempoAtencion: Error');
            }
          }, function(result){
            deferred.resolve('KpiTiempoAtencion: Error');
          });
          return deferred.promise;
        }

        function returnKpiNumeroTotal(filters) {
          var deferred = $q.defer();
          proxyKpiSiniestroApi.PostNumeroTotalSiniestroPagado(filters).then(function (response) {
            // console.log('KpiNumeroTotal');
            if (response.operationCode == 200) {
              var data = response.data[0];
              var charData = configChart.KpiNumeroTotalSiniestro($scope.filtersData.filters, data);
              // $scope.charts.push(charData);
              $scope.charts[1] = charData;
              deferred.resolve('KpiNumeroTotal: Success');
            } else {
              deferred.resolve('KpiNumeroTotal: Error');
            }
          }, function(result){
            deferred.resolve('KpiNumeroTotal: Error');
          });
          return deferred.promise;
        }

        function returnKpiImporteTotal(filters) {
          var deferred = $q.defer();
          proxyKpiSiniestroApi.PostImporteTotalSiniestroPagado(filters).then(function (response) {
            // console.log('KpiImporteTotal');
            if (response.operationCode == 200) {
              var data = response.data[0];
              var charData = configChart.KpiImporteTotalSiniestro($scope.filtersData.filters, data);
              // $scope.charts.push(charData);
              $scope.charts[2] = charData;
              deferred.resolve('KpiImporteTotal: Success');
            } else {
              deferred.resolve('KpiImporteTotal: Error');
            }
          }, function(result){
            deferred.resolve('KpiImporteTotal: Error');
          });
          return deferred.promise;
        }

        function returnKpiCostoPromedio(filters) {
          var deferred = $q.defer();
          proxyKpiSiniestroApi.PostCostoPromedioAtencionPaciente(filters).then(function (response) {
            // console.log('KpiCostoPromedio');
            if (response.operationCode == 200) {
              var data = response.data[0];
              var charData = configChart.KpiCostoPromedioAtencionPaciente($scope.filtersData.filters, data, $scope.config.costoPromedioAtencionPaciente);
              // $scope.charts.push(charData);
              $scope.charts[3] = charData;
              deferred.resolve('KpiCostoPromedio: Success');
            } else {
              deferred.resolve('KpiCostoPromedio: Error');
            }
          }, function(result){
            deferred.resolve('KpiCostoPromedio: Error');
          });
          return deferred.promise;
        }

        function returnKpiImporteTasaHospitalizacion(filters) {
          var deferred = $q.defer();
          proxyKpiSiniestroApi.PostImporteTasaHospitalizacion(filters).then(function (response) {
            // console.log('KpiImporteTasaHospitalizacion');
            if (response.operationCode == 200) {
              var data = response.data[0];
              var charDataInit = configChart.convertTasaImporteHospitalizacion(data);
              var charData = configChart.KpiImporteTasaHospitalizacion(charDataInit);
              // $scope.charts.push(charData);
              $scope.charts[4] = charData;
              deferred.resolve('KpiImporteTasaHospitalizacion: Success');
            } else {
              deferred.resolve('KpiImporteTasaHospitalizacion: Error');
            }
          }, function(result){
            deferred.resolve('KpiImporteTasaHospitalizacion: Error');
          });
          return deferred.promise;
        }

        function returnKpiCostoPacienteMes(filters) {
          var deferred = $q.defer();
          proxyKpiSiniestroApi.PostCostoPaciente(filters).then(function (response) {
            // console.log('KpiCostoPacienteMes');
            if (response.operationCode == 200) {
              var data = response.data[0];
              var charData = configChart.KpiCostoPacienteMes($scope.filtersData.filters, data, $scope.config.costoPacienteMes.umbral);
              // $scope.charts.push(charData);
              $scope.charts[5] = charData;
              deferred.resolve('KpiCostoPacienteMes: Success');
            } else {
              deferred.resolve('KpiCostoPacienteMes: Error');
            }
          }, function(result){
            deferred.resolve('KpiCostoPacienteMes: Error');
          });
          return deferred.promise;
        }

        function returnKpiGastosProveedor(filters) {
          var deferred = $q.defer();
          proxyKpiSiniestroApi.PostSoatGastoProveedor(filters).then(function (response) {
            // console.log('KpiGastosProveedor');
            if (response.operationCode == 200) {
              var data = response.data[0];
              var charDataInit = configChart.convertSoatGastosProveedor(data);
              var charData = configChart.KpiGastosProveedor($scope.filtersData.filters, charDataInit);
              // $scope.charts.push(charData);
              $scope.charts[6] = charData;
              deferred.resolve('KpiGastosProveedor: Success');
            } else {
              deferred.resolve('KpiGastosProveedor: Error');
            }
          }, function(result){
            deferred.resolve('KpiGastosProveedor: Error');
          });
          return deferred.promise;
        }

        function returnKpiGastosCobertura(filters) {
          var deferred = $q.defer();
          proxyKpiSiniestroApi.PostSoatgastoCobertura(filters).then(function (response) {
            // console.log('KpiGastosCobertura');
            if (response.operationCode == 200) {
              var data = response.data[0];
              var charDataInit = configChart.convertSoatGastosCobertura(data);
              var charData = configChart.KpiGastosCobertura($scope.filtersData.filters, charDataInit);
              // $scope.charts.push(charData);
              $scope.charts[7] = charData;
              deferred.resolve('KpiGastosCobertura: Success');
            } else {
              deferred.resolve('KpiGastosCobertura: Error');
            }
          }, function(result){
            deferred.resolve('KpiGastosCobertura: Error');
          });
          return deferred.promise;
        }

        function returnKpiGastosTipoAccidente(filters) {
          var deferred = $q.defer();
          proxyKpiSiniestroApi.PostSoatGastoTipoAccidente(filters).then(function (response) {
            // console.log('KpiGastosTipoAccidente');
            if (response.operationCode == 200) {
              var data = response.data[0];
              var charDataInit = configChart.convertSoatGastosTipoAccidente(data);
              var charData = configChart.KpiGastosTipoAccidente($scope.filtersData.filters, charDataInit);
              // $scope.charts.push(charData);
              $scope.charts[8] = charData;
              deferred.resolve('KpiGastosTipoAccidente: Success');
            } else {
              deferred.resolve('KpiGastosTipoAccidente: Error');
            }
          }, function(result){
            deferred.resolve('KpiGastosTipoAccidente: Error');
          });
          return deferred.promise;
        }

        function returnKpiGastosUbicacionGeograficaDet(filters) {
          var deferred = $q.defer();
          proxyKpiSiniestroApi.PostSoatGastosUbicacionGeograficaDetallada(filters).then(function (response) {
            // console.log('KpiGastosUbicacionGeograficaDetallada');
            if (response.operationCode == 200) {
              var data = response.data[0];
              var charDataInit = configChart.convertSoatGastosUbicacionGeograficaDetallada(data);
              var charData = configChart.KpiGastosUbicacionGeograficaDetallada($scope.filtersData.filters, charDataInit);
              // $scope.charts.push(charData);
              $scope.charts[9] = charData;
              deferred.resolve('KpiGastosUbicacionGeograficaDetallada: Success');
            } else {
              deferred.resolve('KpiGastosUbicacionGeograficaDetallada: Error');
            }
          }, function(result){
            deferred.resolve('KpiGastosUbicacionGeograficaDetallada: Error');
          });
          return deferred.promise;
        }

        function returnKpiGastosUbicacionGeograficaGen(filters) {
          var deferred = $q.defer();
          proxyKpiSiniestroApi.PostSoatGastoUbicacionGeograficaGeneral(filters).then(function (response) { 
            // console.log('KpiGastosUbicacionGeograficaGeneral');
            if (response.operationCode == 200) {
              var data = response.data[0];
              var charDataInit = configChart.convertSoatGastosUbicacionGeograficaGeneral(data);
              var charData = configChart.KpiGastosUbicacionGeograficaGeneral($scope.filtersData.filters, charDataInit);
              // $scope.charts.push(charData);
              $scope.charts[10] = charData;
              deferred.resolve('KpiGastosUbicacionGeograficaGeneral: Success');
            } else {
              deferred.resolve('KpiGastosUbicacionGeograficaGeneral: Error');
            }
          }, function(result){
            deferred.resolve('KpiGastosUbicacionGeograficaGeneral: Error');
          });
          return deferred.promise;
        }

        $scope.downloadResumenReport = function () {
          var chartData = [];
          for (var i = 0; i < $scope.charts.length; i++) {
            var chart = $scope.charts[i];
            var item = {
              title: chart.finalTitle,
              subtitle: chart.finalSecondTitle,
              image: chart.chartImage,
              hasError: chart.hasError
            };
            chartData.push(item);
          }
          var username = configChart.getUserName();
          var filters = $scope.listNameFilters;

          var config = {
            file: 'ReporteIndicadoresSiniestros',
            typeProduct: 'Siniestro',
            product: $scope.product.dscrpcn
          };

          mpSpin.start('Descargando reporte PDF...');
          configChart.generatePdfGeneral(chartData, filters, username, config, function (html) {
            mpSpin.end();
          });
        }

        $scope.showModalFilters = function () {
          $scope.filtersData = localStorageService.get('filtersData');
          var vModal = $uibModal.open({
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: 'lg',
            template: "<modal-form-filters dashboard='dashboard' product='product' data='filtersData' range-search-date='config.rangeSearchDate' masters='masters' filter-apply='applyFilter($filters, $indicators, $todosIndicadores)' reload-masters='reloadFiltersData($search, $params, $showLoad)' close='close()'></modal-form-filters>",
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
              $scope.close = function () {
                $uibModalInstance.close();
              };

              $scope.applyFilter = function ($filter, $indicators, $todosIndicadores) {
                var filtersData = {}
                filtersData.filters = $filter;
                filtersData.indicators = $indicators;
                filtersData.todosIndicadores = $todosIndicadores;
                $uibModalInstance.close(filtersData);
              }
            }]
          });

          vModal.result.then(function (filtersData) {
            if (filtersData) {
              localStorageService.set('filtersData', filtersData);
              $scope.filtersData = filtersData;
              $scope.masters.indicadores = filtersData.indicators;
              $scope.listSelectedFilters = filtersData.filters;
              generateFilterParams(filtersData);
            }
          });
        }

        $scope.showModalData = function (title, subtitle, table, data, chart, file) {
          var vModal = $uibModal.open({
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: 'lg',
            template: "<modal-chart-data titletext='title' data='modalData' table='table' close='close()' download='downloadReport(modalChart, modalData, title, subtitle, table, file)'></modal-chart-data>",
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
              $scope.modalData = data;
              $scope.modalChart = chart;
              $scope.title = title;
              $scope.subtitle = subtitle;
              $scope.table = table;
              $scope.file = file;

              $scope.close = function () {
                $uibModalInstance.close();
              };
            }]
          });
        }

        $scope.downloadReport = function (chart, data, title, subtitle, table, file) {
          var username = configChart.getUserName();
          var filters = $scope.listNameFilters;

          var config = {
            title: title,
            subtitle: subtitle,
            file: file,
            typeProduct: 'Siniestro',
            product: $scope.product.dscrpcn
          };

          mpSpin.start('Descargando reporte PDF...');
          configChart.generatePdfFromChart(chart, data, table, filters, username, config, function () {
            mpSpin.end();
          });
        }
      }
    )();
  }

  return ng.module('kpissalud.app')
    .controller('KpiSiniestroController', KpiSiniestroController);
});