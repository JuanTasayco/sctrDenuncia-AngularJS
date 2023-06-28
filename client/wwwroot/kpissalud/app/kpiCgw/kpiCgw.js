define(['angular', 'constants'], function (ng, constants) {

  KpiCgwController.$inject = ['$scope', '$uibModal', 'localStorageService', 'mpSpin', 'configChart', '$q', 'proxyKpiFiltroApi', 'proxyKpiConfiguracionApi', 'proxyKpiCartaGarantiaApi'];

  function KpiCgwController($scope, $uibModal, localStorageService, mpSpin, configChart, $q, proxyKpiFiltroApi, proxyKpiConfiguracionApi, proxyKpiCartaGarantiaApi) {
    (
      function onLoad() {
        $scope.loadCharts = false;
        $scope.hasTextCharts = false;
        $scope.numHastTextCharts = 0;
        $scope.config = {
          rangeSearchDate: 12
        };
        $scope.listNameFilters = '';
        $scope.dashboard = 'CGW';
        $scope.showFilters = true;
        $scope.showFilters2 = false;
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
          //promiseList.push(returnKpiProducto());
          promiseList.push(returnKpiContrato());
          promiseList.push(returnKpiDepartamento());
          promiseList.push(returnKpiCobertura({ ac_cprdcto: 'S', ac_cod_cia: '3' }, false));
          promiseList.push(returnKpiDiagnostico());
          promiseList.push(returnKpiEjecutivo({ ac_cprdcto: 'S', ac_cod_cia: '3' }, false));
          //promiseList.push(returnKpiAuditorMedico());
          promiseList.push(returnKpiDashboard());

          return $q.all(promiseList).then(function (result) {
            var indexKpiRamo = result.map(function (o) { return o.id; }).indexOf('KpiRamo');
            // var indexKpiProducto = result.map(function (o) { return o.id; }).indexOf('KpiProducto');
            var indexKpiContrato = result.map(function (o) { return o.id; }).indexOf('KpiContrato');
            var indexKpiDepartamento = result.map(function (o) { return o.id; }).indexOf('KpiDepartamento');
            var indexKpiDiagnostico = result.map(function (o) { return o.id; }).indexOf('KpiDiagnostico');
            var indexKpiEjecutivo = result.map(function (o) { return o.id; }).indexOf('KpiEjecutivo');
            // var indexKpiAuditorMedico = result.map(function (o) { return o.id; }).indexOf('KpiAuditorMedico');
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
            // if (result[indexKpiAuditorMedico].operationCode === 200) {
            //   $scope.masters.auditores = result[indexKpiAuditorMedico];
            // } else {
            //   console.log('KpiAuditorMedico' + result[indexKpiAuditorMedico].message);
            // }

            //KpiDashboard
            if (result[indexKpiDashboard].operationCode === 200) {
              var result = result[indexKpiDashboard];
              var data = result[0];
              for (var i = 0; i < data.length; i++) {
                var config = data[i];
                if (config.cdgo == '0001') $scope.config.rangeSearchDate = config.vlr;
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
          params.ac_tipokpi = "2";
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
              console.log('Error Subcontrato');
              deferred.reject(response);
              if (showLoad) mpSpin.end();
            });
          } else {
            deferred.resolve([]);
            $scope.masters.subcontratos = [];
            console.log('KpiSubcontrato: vacío');
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
              console.log('Error Subproducto');
              deferred.reject(response);
              if (showLoad) mpSpin.end();
            });
          } else {
            deferred.resolve([]);
            $scope.masters.subproductos = [];
            console.log('KpiSubproducto: vacío');
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
              console.log('Error Provincia');
              deferred.reject(response);
              if (showLoad) mpSpin.end();
            });
          } else {
            deferred.resolve([]);
            $scope.masters.provincias = [];
            console.log('KpiProvincia: vacío');
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
              console.log('Error Distrito');
              deferred.reject(response);
              if (showLoad) mpSpin.end();
            });
          } else {
            deferred.resolve([]);
            $scope.masters.distritos = [];
            console.log('KpiDistrito: vacío');
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
              console.log('Error Cobertura');
              deferred.reject(response);
              if (showLoad) mpSpin.end();
            });
          } else {
            deferred.resolve([]);
            $scope.masters.coberturas = [];
            console.log('KpiCobertura: vacío');
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

          validateHaveTextCharts(indicadores);
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
                case 'CGW_ITR':
                  promiseList.push(returnKpiImporteTotalReservas(filters));
                  break;
                case 'CGW_CGS':
                  promiseList.push(returnKpiNumeroCartasSolicitadas(filters));
                  break;
                case 'CGW_CGR':
                  promiseList.push(returnKpiNumeroCartasRechazadas(filters));
                  break;
                case 'CGW_NTCG':
                  promiseList.push(returnKpiNumeroTotalCartas(filters));
                  break;
                case 'CGW_ITCG':
                  promiseList.push(returnKpiImporteTotalCartas(filters));
                  break;
                case 'CGW_ASR':
                  promiseList.push(returnKpiAhorroSolicitudesRechazadas(filters));
                  break;
                case 'CGW_AAM':
                  promiseList.push(returnKpiAhorroAuditoriaMedica(filters));
                  break;
                case 'CGW_DA':
                  promiseList.push(returnKpiDiagnosticoAprobado(filters));
                  break;
                case 'CGW_CA':
                  promiseList.push(returnKpiCoberturaAprobada(filters));
                  break;
                case 'CGW_MR':
                  promiseList.push(returnKpiMotivoRechazo(filters));
                  break;
              }
            }
          }

          return $q.all(promiseList).then(function (result) {
            var tmp = $scope.charts;
            $scope.charts = tmp.filter(function(e){ return e });
            $scope.loadCharts = true;
            console.log(result);
            mpSpin.end();
          });
        }

        function returnKpiImporteTotalReservas(filters) {
          var deferred = $q.defer();
          proxyKpiCartaGarantiaApi.PostImporteTotalReservas(filters).then(function (response) {
            if (response.operationCode == 200) {
              var data = response.data[0];
              var charData = configChart.KpiImporteTotalReservas(data);
              // $scope.charts.push(charData);
              $scope.charts[0] = charData;
              deferred.resolve('KpiImporteTotalReservas: Success');
            } else {
              deferred.resolve('KpiImporteTotalReservas: Error');
            }
          }, function(result){
            deferred.resolve('KpiImporteTotalReservas: Error');
          });
          return deferred.promise;
        }

        function returnKpiNumeroCartasSolicitadas(filters) {
          var deferred = $q.defer();
          proxyKpiCartaGarantiaApi.PostNumeroCartaGarantiaSolicitada(filters).then(function (response) {
            if (response.operationCode == 200) {
              var data = response.data[0];
              var charData = configChart.KpiNumeroCartasGarantiaSolicitadas(data);
              // $scope.charts.push(charData);
              $scope.charts[1] = charData;
              deferred.resolve('KpiNumeroCartasSolicitadas: Success');
            } else {
              deferred.resolve('KpiNumeroCartasSolicitadas: Error');
            }
          }, function(result){
            deferred.resolve('KpiNumeroCartasSolicitadas: Error');
          });
          return deferred.promise;
        }

        function returnKpiNumeroCartasRechazadas(filters) {
          var deferred = $q.defer();
          proxyKpiCartaGarantiaApi.PostNumeroCartaGarantiaRechazada(filters).then(function (response) {
            if (response.operationCode == 200) {
              var data = response.data[0];
              var charData = configChart.KpiNumeroCartasGarantiaRechazadas(data);
              // $scope.charts.push(charData);
              $scope.charts[2] = charData;
              deferred.resolve('KpiNumeroCartasRechazadas: Success');
            } else {
              deferred.resolve('KpiNumeroCartasRechazadas: Error');
            }
          }, function(result){
            deferred.resolve('KpiNumeroCartasRechazadas: Error');
          });
          return deferred.promise;
        }

        function returnKpiNumeroTotalCartas(filters) {
          var deferred = $q.defer();
          proxyKpiCartaGarantiaApi.PostNumeroTotalCartasGarantia(filters).then(function (response) {
            if (response.operationCode == 200) {
              var data = response.data[0];
              var charDataInit = configChart.convertNumeroTotalCartasGarantia(data);
              var charData = configChart.KpiNumeroTotalCartasGarantia(charDataInit);
              // $scope.charts.push(charData);
              $scope.charts[3] = charData;
              deferred.resolve('KpiNumeroTotalCartas: Success');
            } else {
              deferred.resolve('KpiNumeroTotalCartas: Error');
            }
          }, function(result){
            deferred.resolve('KpiNumeroTotalCartas: Error');
          });
          return deferred.promise;
        }

        function returnKpiImporteTotalCartas(filters) {
          var deferred = $q.defer();
          proxyKpiCartaGarantiaApi.PostImporteTotalCartasGarantia(filters).then(function (response) {
            if (response.operationCode == 200) {
              var data = response.data[0];
              var charData = configChart.KpiImporteTotalCartasGarantia(data);
              // $scope.charts.push(charData);
              $scope.charts[4] = charData;
              deferred.resolve('KpiImporteTotalCartas: Success');
            } else {
              deferred.resolve('KpiImporteTotalCartas: Error');
            }
          }, function(result){
            deferred.resolve('KpiImporteTotalCartas: Error');
          });
          return deferred.promise;
        }

        function returnKpiAhorroSolicitudesRechazadas(filters) {
          var deferred = $q.defer();
          proxyKpiCartaGarantiaApi.PostAhorroSolicitudRechazada(filters).then(function (response) {
            if (response.operationCode == 200) {
              var data = response.data[0];
              var charData = configChart.KpiAhorroSolicitudesRechazadas(data);
              // $scope.charts.push(charData);
              $scope.charts[5] = charData;
              deferred.resolve('KpiAhorroSolicitudesRechazadas: Success');
            } else {
              deferred.resolve('KpiAhorroSolicitudesRechazadas: Error');
            }
          }, function(result){
            deferred.resolve('KpiAhorroSolicitudesRechazadas: Error');
          });
          return deferred.promise;
        }

        function returnKpiAhorroAuditoriaMedica(filters) {
          var deferred = $q.defer();
          proxyKpiCartaGarantiaApi.PostAhorroAuditoriaMedica(filters).then(function (response) {
            if (response.operationCode == 200) {
              var data = response.data[0];
              var charData = configChart.KpiAhorroAuditoriaMedica(data);
              // $scope.charts.push(charData);
              $scope.charts[6] = charData;
              deferred.resolve('KpiAhorroAuditoriaMedica: Success');
            } else {
              deferred.resolve('KpiAhorroAuditoriaMedica: Error');
            }
          }, function(result){
            deferred.resolve('KpiAhorroAuditoriaMedica: Error');
          });
          return deferred.promise;
        }

        function returnKpiDiagnosticoAprobado(filters) {
          var deferred = $q.defer();
          proxyKpiCartaGarantiaApi.PostDiagnosticoAprobado(filters).then(function (response) {
            if (response.operationCode == 200) {
              var data = response.data[0];
              var charDataInit = configChart.convertDiagnosticoAprobado(data);
              var charData = configChart.KpiDiagnosticoAprobado(charDataInit);
              // $scope.charts.push(charData);
              $scope.charts[7] = charData;
              deferred.resolve('KpiDiagnosticoAprobado: Success');
            } else {
              deferred.resolve('KpiDiagnosticoAprobado: Error');
            }
          }, function(result){
            deferred.resolve('KpiDiagnosticoAprobado: Error');
          });
          return deferred.promise;
        }

        function returnKpiCoberturaAprobada(filters) {
          var deferred = $q.defer();
          proxyKpiCartaGarantiaApi.PostCoberturaAprobado(filters).then(function (response) {
            if (response.operationCode == 200) {
              var data = response.data[0];
              var charDataInit = configChart.convertCoberturaAprobada(data);
              var charData = configChart.KpiCoberturaAprobada(charDataInit);
              // $scope.charts.push(charData);
              $scope.charts[8] = charData;
              deferred.resolve('KpiCoberturaAprobada: Success');
            } else {
              deferred.resolve('KpiCoberturaAprobada: Error');
            }
          }, function(result){
            deferred.resolve('KpiCoberturaAprobada: Error');
          });
          return deferred.promise;
        }

        function returnKpiMotivoRechazo(filters) {
          var deferred = $q.defer();
          proxyKpiCartaGarantiaApi.PostMotivosRechazo(filters).then(function (response) {
            if (response.operationCode == 200) {
              var data = response.data[0];
              var charDataInit = configChart.convertMotivoRechazo(data);
              var charData = configChart.KpiMotivoRechazo(charDataInit);
              // $scope.charts.push(charData);
              $scope.charts[9] = charData;
              deferred.resolve('KpiMotivoRechazo: Success');
            } else {
              deferred.resolve('KpiMotivoRechazo: Error');
            }
          }, function(result){
            deferred.resolve('KpiMotivoRechazo: Error');
          });
          return deferred.promise;
        }

        function validateHaveTextCharts(indicadores) {
          $scope.hasTextCharts = false;
          $scope.numHastTextCharts = 0;
          for (var i = 0; i < indicadores.length; i++) {
            var indicador = indicadores[i];
            if (indicador.selected) {
              switch (indicador.code) {
                case 'CGW_ITR':
                case 'CGW_CGS':
                case 'CGW_CGR':
                  $scope.hasTextCharts = true;
                  $scope.numHastTextCharts++;
                  break;
              }
            }
          }
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
            hasTextCharts: $scope.hasTextCharts,
            numHastTextCharts: $scope.numHastTextCharts,
            file: 'ReporteIndicadoresCartasGarantia',
            typeProduct: 'Cartas de Garantía',
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
            typeProduct: 'Cartas de Garantía',
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
    .controller('KpiCgwController', KpiCgwController);
});