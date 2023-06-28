define([
  'angular', 'constants',
  '/cgw/app/factory/cgwFactory.js',
  'mfpModalAgregarCliente', 'mfpModalAgregarAfiliado'
], function(ng) {

  reporteController.$inject = ['$scope', '$uibModal', 'cgwFactory', '$rootScope', '$q', 'formularioEjecutivos', 'formularioEmpresas', 'formularioEstadosCarta', 'formularioEstadosScan','$sce', '$timeout', 'mModalAlert', 'oimClaims', '$window', 'httpData', 'mainServices'];

  function reporteController($scope, $uibModal, cgwFactory, $rootScope, $q, formularioEjecutivos, formularioEmpresas, formularioEstadosCarta, formularioEstadosScan, $sce, $timeout, mModalAlert, oimClaims, $window, httpData, mainServices) {

    (function onLoad() {

      var vm = this;
      $scope.grupoAplicacion = parseInt(oimClaims.userSubType);

      $scope.formData = {};
      $scope.descargarLabel = "Descargar";
      $scope.formData.mConsultaDesde = new Date();
      $scope.formData.mConsultaHasta = new Date();

      vm.paramsTicket = {
        GrupoAplicacion: $scope.grupoAplicacion,
        Usuario: oimClaims.loginUserName.toUpperCase(),//vm.user,
        CodigoAgente: (parseInt(oimClaims.agentID) ? parseInt(oimClaims.agentID) : 0),
        DescripcionAgente: ''
      };

      cgwFactory.getTicketUser(vm.paramsTicket, false).then(function(response) {
        if (response.data) {
          vm.userRuc = response.data.ruc;
          $scope.ruc = response.data.ruc;
          vm.userLogin = response.data.userLogin;
          vm.roleCode = response.data.roleCode;
          $scope.flagClinic = response.data.flagClinic;
          vm.codeClinic = response.data.clinic;
          vm.sepsCode = response.data.sepsCode;
          vm.clinicBranchCode = response.data.clinicBranchCode;
          vm.clinicCode = response.data.clinicCode;
          vm.providerCodeSctr = response.data.providerCodeSctr;
          vm.providerName = response.data.providerName;
          vm.roleId = response.data.roleId;

          if ($scope.flagClinic === 1) {
            if ($window.sessionStorage.getItem('sucursal')) {
              var sucursal = $window.sessionStorage.getItem('sucursal');
              sucursal = JSON.parse(sucursal);
              $scope.formData.mClinica = {
                providerCode: sucursal.providerCode,
                code: sucursal.code,
                description: sucursal.name,
                rucNumber: sucursal.documentNumber
              };
            } else {
              $scope.formData.mClinica = {
                providerCode: vm.clinicCode,
                code: vm.providerName,
                description: vm.userLogin,
                rucNumber: vm.userRuc
              };
            }
          }
        }
       }, function(error) {
        mModalAlert.showError("Error en getTicketUser", 'Error');
      });

      cgwFactory.getRole($scope.grupoAplicacion).then(function (response) {
        if (response.data) {
          $scope.roleId = response.data.roleId;
          $scope.roleCode = response.data.roleCode;
        }
      });

      if ($scope.roleCode === constants.module.cgw.roles.medExterno.description) {//MED Externo)
        window.location.href = '/';
      }

      // tpls de los tabs
      $scope.tabAfiliado = '/cgw/app/reportes/component/tabAfiliado.html';
      $scope.tabSituacionCarta = '/cgw/app/reportes/component/tabSituacionCarta.html';
      $scope.tabClinica = '/cgw/app/reportes/component/tabClinica.html';
      $scope.tabSolicitudScan = '/cgw/app/reportes/component/tabSolicitudScan.html';
      $scope.formCarta = {};
      $scope.formClinica = {};
      $scope.formAfiliado = {};
      $scope.formSolicitudScan = {};

       // Lista de ejecutivos
      $scope.ejecutivos = formularioEjecutivos;
      // Tipo de empresa
      $scope.empresas = formularioEmpresas;
      // Listado de estados de carta
      $scope.estadoCartas = formularioEstadosCarta;
      // Listado de estados de carta
      $scope.estadoScan = formularioEstadosScan;

      /*########################
      # Vigencia
      ########################*/

      $scope.format = 'dd/MM/yyyy';
      $scope.altInputFormats = ['M!/d!/yyyy'];

      $scope.popup1 = {
            opened: false
      };
      $scope.popup2 = {
          opened: false
      };

      $scope.dateOptions = {
        initDate: new Date(),
        maxDate: new Date()
      };

      $scope.today = cgwFactory.formatearFecha(new Date());

      $scope.dateOptions2 = {
        initDate: $scope.formData.mConsultaDesde,
        minDate: new Date(),
        maxDate: new Date()
      };

      $scope.afiliado = {
        emptyAfiliado: false
      };

      $scope.cliente = {
        emptyClient: false
      };

      loadProducts(3);

     })();

     $scope.tabSelected = function(value) {
      $scope.tab = value;
      if (value === 1)
        $scope.titleTab = "Por Situación de Carta";
      else if (value === 2)
        $scope.titleTab = "Por Afiliado y Fecha de Emisión";
      else if (value === 5)
        $scope.titleTab = "Solicitud de SCAN por Carta de Garantía";
      else
        $scope.titleTab = "Por Fecha de Emisión";
     };

    $scope.buscarXSituacion = function baFn(tipo) {
      if ($scope.formData.mConsultaDesde > new Date(new Date().setHours(23,59,59,999)) ||
        $scope.formData.mConsultaHasta > new Date(new Date().setHours(23,59,59,999))) {
        mModalAlert.showError("Fecha no puede ser mayor a la fecha actual", "Error");
      } else {
        if (typeof $scope.afiliado !== 'undefined' && typeof $scope.cliente !== 'undefined') {
          if (typeof $scope.afiliado.dataAfiliado !== 'undefined' && typeof $scope.cliente.dataCliente !== 'undefined') {
            $scope.cliente.emptyClient = false;
            var paramsFile = {
              CodeCompany: parseInt($scope.formData.mEmpresa.id),
              StartDate: (typeof $scope.formData.mConsultaDesde === 'undefined') ? cgwFactory.formatearFecha(new Date()) : cgwFactory.formatearFecha($scope.formData.mConsultaDesde),//"02/10/2017",
              EndDate: (typeof $scope.formData.mConsultaHasta === 'undefined') ? cgwFactory.formatearFecha(new Date()) : cgwFactory.formatearFecha($scope.formData.mConsultaHasta),
              AffiliateCode: (typeof $scope.afiliado.dataAfiliado === 'undefined') ? "0" : $scope.afiliado.dataAfiliado.codeAffiliate,
              ClientCode: (typeof $scope.cliente.dataCliente.code === 'undefined') ? 0 : $scope.cliente.dataCliente.code
            };

            if ($scope.tab === 1) {
              const opcMenu = localStorage.getItem('currentBreadcrumb');
              const dataRequest = 'json=' + JSON.stringify( paramsFile );
              const urlRequest = constants.system.api.endpoints.cgw + 'api/guaranteeletter/report/situation/download/' + tipo + '?COD_OBJETO=.&OPC_MENU=' + opcMenu;
              httpData.postDownload(
                urlRequest,
                dataRequest,
                {
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded'}, responseType: 'arraybuffer'
                },
                true
              )
              .then(
                function ( data ){
                  mainServices.fnDownloadFileBase64(data.file, data.mimeType, data.defaultFileName, true);
                }
              );
            }else if ($scope.tab === 2) {//"Por Afiliado y Fecha de Emisión"
              const opcMenu = localStorage.getItem('currentBreadcrumb');
              const dataRequest = 'json=' + JSON.stringify( paramsFile );
              const urlRequest = constants.system.api.endpoints.cgw + 'api/guaranteeletter/report/affiliate/issuedate/download/' + tipo + '?COD_OBJETO=.&OPC_MENU=' + opcMenu;
              httpData.postDownload(
                urlRequest,
                dataRequest,
                {
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded'}, responseType: 'arraybuffer'
                },
                true
              )
              .then(
                function ( data ){
                  mainServices.fnDownloadFileBase64(data.file, data.mimeType, data.defaultFileName, true);
                }
              );
            }else if ($scope.tab === 4) {
              const opcMenu = localStorage.getItem('currentBreadcrumb');
              const dataRequest = 'json=' + JSON.stringify( paramsFile );
              const urlRequest = constants.system.api.endpoints.cgw + 'api/guaranteeletter/report/issuedate/download/' + tipo + '?COD_OBJETO=.&OPC_MENU=' + opcMenu;
              httpData.postDownload(
                urlRequest,
                dataRequest,
                {
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded'}, responseType: 'arraybuffer'
                },
                true
              )
              .then(
                function ( data ){
                  mainServices.fnDownloadFileBase64(data.file, data.mimeType, data.defaultFileName, true);
                }
              );
            }
          } else {
            $scope.cliente.emptyClient = true;
          }
        }
      }
    };

    $scope.open1 = function() {
      $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
      $scope.popup2.opened = true;
    };

    $scope.$watch('formData.mConsultaDesde', function()
    {
      $scope.dateOptions2.minDate = $scope.formData.mConsultaDesde;
    });

    $scope.buscarAfiliado = function(tipo) {
      if ($scope.formData.mConsultaDesde > new Date(new Date().setHours(23,59,59,999)) ||
        $scope.formData.mConsultaHasta > new Date(new Date().setHours(23,59,59,999))) {
        mModalAlert.showError("Fecha no puede ser mayor a la fecha actual", "Error");
      } else {
        if (typeof $scope.afiliado !== 'undefined') {
          if (typeof $scope.afiliado.dataAfiliado !== 'undefined') {
            $scope.afiliado.emptyAfiliado = false;
            var paramsFile = {
              CodeCompany: parseInt($scope.formData.mEmpresa.id),
              ProductCode: ($scope.formData.mConsultaDesde.mProducto && $scope.formData.mConsultaDesde.mProducto.productCode) ? $scope.formData.mConsultaDesde.mProducto.productCode : 0,
              StartDate: (typeof $scope.formData.mConsultaDesde === 'undefined') ? cgwFactory.formatearFecha(new Date()) : cgwFactory.formatearFecha($scope.formData.mConsultaDesde),//"02/10/2017",
              EndDate: (typeof $scope.formData.mConsultaHasta === 'undefined') ? cgwFactory.formatearFecha(new Date()) : cgwFactory.formatearFecha($scope.formData.mConsultaHasta),
              AffiliateCode: (typeof $scope.afiliado.dataAfiliado === 'undefined') ? "0" : $scope.afiliado.dataAfiliado.codeAffiliate
            };

            const opcMenu = localStorage.getItem('currentBreadcrumb');
            const dataRequest = 'json=' + JSON.stringify( paramsFile );
            const urlRequest = constants.system.api.endpoints.cgw + 'api/guaranteeletter/report/affiliate/download/' + tipo + '?COD_OBJETO=.&OPC_MENU=' + opcMenu;
            httpData.postDownload(
              urlRequest,
              dataRequest,
              {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded'}, responseType: 'arraybuffer'
              },
              true
            )
            .then(
              function ( data ){
                mainServices.fnDownloadFileBase64(data.file, data.mimeType, data.defaultFileName, true);
              }
            );
          } else {
            $scope.afiliado.emptyAfiliado = true;
          }
        } else {
          $scope.afiliado.emptyAfiliado = true;
        }
      }
    };

    $scope.buscarClinicaCarta = function(tipo) {
      if ($scope.formData.mConsultaDesde > new Date(new Date().setHours(23,59,59,999)) ||
        $scope.formData.mConsultaHasta > new Date(new Date().setHours(23,59,59,999))) {
        mModalAlert.showError("Fecha no puede ser mayor a la fecha actual", "Error");
      } else {
        var paramsFile = {
          CodeCompany: parseInt($scope.formData.mEmpresa.id),
          StartDate: (typeof $scope.formData.mConsultaDesde === 'undefined') ? cgwFactory.formatearFecha(new Date()) : cgwFactory.formatearFecha($scope.formData.mConsultaDesde),//"02/10/2017",
          EndDate: (typeof $scope.formData.mConsultaHasta === 'undefined') ? cgwFactory.formatearFecha(new Date()) : cgwFactory.formatearFecha($scope.formData.mConsultaHasta),
          ProviderCode: (typeof $scope.formData.mClinica === 'undefined') ? 0 : parseInt($scope.formData.mClinica.providerCode),
          ExecutiveCode: $scope.formData.mEjecutivo.name == null ? '' : $scope.formData.mEjecutivo.name,
          StateId: $scope.formData.mEstadoCarta.code === null ? 99 : $scope.formData.mEstadoCarta.code,
          CompanyName: $scope.formData.mEmpresa.description
        };

        const opcMenu = localStorage.getItem('currentBreadcrumb');
        const dataRequest = 'json=' + JSON.stringify( paramsFile );
        const urlRequest = constants.system.api.endpoints.cgw + 'api/guaranteeletter/report/clinic/download/' + tipo + '?COD_OBJETO=.&OPC_MENU=' + opcMenu;
        httpData.postDownload(
          urlRequest,
          dataRequest,
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded'}, responseType: 'arraybuffer'
          },
          true
        )
        .then(
          function ( data ){
            mainServices.fnDownloadFileBase64(data.file, data.mimeType, data.defaultFileName, true);
          }
        );
      }
    };

    $scope.buscarSolicitudScan = function(tipo) {
      if ($scope.formData.mConsultaDesde > new Date(new Date().setHours(23,59,59,999)) ||
        $scope.formData.mConsultaHasta > new Date(new Date().setHours(23,59,59,999))) {
        mModalAlert.showError("Fecha no puede ser mayor a la fecha actual", "Error");
      } else {
        if (typeof $scope.cliente !== 'undefined') {
            $scope.cliente.emptyClient = false;
            var paramsFile = {
              companyId: parseInt($scope.formData.mEmpresa.id),
              productCode: ($scope.formData.mProducto && $scope.formData.mProducto.productCode) ? $scope.formData.mProducto.productCode : '',
              startDate: (typeof $scope.formData.mConsultaDesde === 'undefined') ? cgwFactory.formatearFecha(new Date()) : cgwFactory.formatearFecha($scope.formData.mConsultaDesde),
              endDate: (typeof $scope.formData.mConsultaHasta === 'undefined') ? cgwFactory.formatearFecha(new Date()) : cgwFactory.formatearFecha($scope.formData.mConsultaHasta),
              providerCode: (typeof $scope.formData.mClinica === 'undefined') ? '' : parseInt($scope.formData.mClinica.providerCode),
            providerBranch: (typeof $scope.cliente.dataCliente === 'undefined') ? '' : $scope.cliente.dataCliente.code,
              sscan: $scope.formData.mEstadoSolicitud.code === null ? '' : $scope.formData.mEstadoSolicitud.code
            };

            $scope.attachFileReportSolicitudScanURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.cgw + 'api/guaranteeletter/report/scan/' + tipo);
            $scope.downloadAtachFile = paramsFile;

            $timeout(function() {
              document.getElementById('frmAttachReportSolicitudScan').submit();
            }, 500);
        }
      }
    }

    $scope.limpiarAfiliado = function() {
        $scope.noResult = true;
        $scope.firtSearch = false;
        $scope.onlyOne = true;

        $scope.cliente = {
          CodeCompany: parseInt($scope.letterCia)
        };

        $scope.afiliado = {
          CodeCompany: parseInt($scope.formData.mEmpresa.id)
        };

        $scope.formData.mEstadoCarta = {description:"--Seleccione--", code:null,selectedEmpty:true};
        $scope.formData.mEjecutivo = {code:"0", name:"-- SELECCIONE --"};
        $scope.formData.mClinica = undefined;
        $scope.formData.mConsultaDesde = new Date(new Date().setHours(23,59,59,999));
        $scope.formData.mConsultaHasta = new Date(new Date().setHours(23,59,59,999));
     };

    $scope.limpiarSolicitudScan = function() {
      $scope.noResult = true;
      $scope.firtSearch = false;
      $scope.onlyOne = true;

      $scope.cliente = { CodeCompany: parseInt($scope.letterCia) };
      $scope.formData.mEstadoSolicitud = {description:"--Seleccione--", code:null,selectedEmpty:true};
      $scope.formData.mClinica = undefined;
      $scope.formData.mConsultaDesde = new Date(new Date().setHours(23,59,59,999));
      $scope.formData.mConsultaHasta = new Date(new Date().setHours(23,59,59,999));
  };

    $scope.buscarCodCliente = function bccFn() {

      $scope.cliente = {
        CodeCompany: parseInt($scope.letterCia)
      };

      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        windowTopClass: 'modal--lg',
        template: '<mfp-modal-agregar-cliente data="cliente" close="close()"></mfp-modal-agregar-cliente>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function clFn() {
            $uibModalInstance.close();
          };

        }] // end Controller uibModal
      });
    };

    $scope.buscarCodAfiliado = function bcaFn() {

      $scope.afiliado = {
        CodeCompany: parseInt($scope.formData.mEmpresa.id)
      };

      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        windowTopClass: 'modal--lg',
        template: '<mfp-modal-agregar-afiliado data="afiliado" close="close()"></mfp-modal-agregar-afiliado>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function clFn() {
            $uibModalInstance.close();
          };

        }] // end Controller uibModal
      });
    };

    $scope.getListClinic = function(wilcar) {

      if (wilcar && wilcar.length >= 2) {
        var paramClinica = {
          Filter: wilcar.toUpperCase() //VESA
        };

        var defer = $q.defer();

        cgwFactory.getListClinic(paramClinica, false).then(function (response) {

          if (response.data.items.length > 0) {
            $scope.sinResultados = false;
          } else {
            $scope.sinResultados = true;
          }

          defer.resolve(response.data.items);
        });

        return defer.promise;
      }
    };

    function loadProducts(idCompany) {
      $scope.formData.mProducto = undefined;
      $scope.formData.productosCGW = [];
      if (idCompany) {
        cgwFactory.GetAllProductBy('SGA', idCompany).then(function(response) {
          if (response.data) {
            $scope.formData.productosCGW = [];
            $scope.formData.productosCGW = response.data;
          } else {
            if (!response.isValid) {
              var message = '';
              ng.forEach(response.brokenRulesCollection, function(error) {
                message += error.description + ' ';

              });
              mModalAlert.showError(message, 'Error');
            }
          }

        })
          .catch(function(err){
            mModalAlert.showError(err.data, 'Error');
          });
      }
    }

    $scope.loadProducts = function (idCompany) {
      loadProducts(idCompany);
    };

  } //  end controller

  return ng.module('appCgw')
    .controller('ReporteController', reporteController)
    .factory('loaderReporteCGW', ['cgwFactory', '$q', function(cgwFactory, $q) {
      var estadoCartas;
      function initEstadosCarta() {
        var deferred = $q.defer();
        cgwFactory.getListCGWState(true).then(function(response) {
          if (response.data.items.length > 0) {
            estadoCartas = response.data.items;
            deferred.resolve(estadoCartas);
          }
        }, function(error) {
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      var ejecutivos;
      function initListEjecutivos() {
        var deferred = $q.defer();
        cgwFactory.getListUserExecutive(true).then(function(response) {
          if (response.data.items.length > 0) {
            ejecutivos = response.data.items;
            deferred.resolve(ejecutivos);
          }
        }, function (error) {
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      var _empresas;
      function initListEmpresas() {
        var deferred = $q.defer();
        cgwFactory.getListCompany(true).then(function(response) {
          if (response.data.items.length > 0) {
            _empresas = response.data.items;
            deferred.resolve(_empresas);
          }
        }, function(error) {
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      var estadoScan;
      function initEstadosScan() {
        var deferred = $q.defer();
        cgwFactory.GetListCGWScanState(true).then(function(response) {
          if (response.data.length > 0) {
            estadoScan = response.data;
            deferred.resolve(estadoScan);
          }
        }, function(error) {
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      return {
        initEstadosCarta: function() {
          if (estadoCartas) return $q.resolve(estadoCartas);
          return initEstadosCarta();
        },
        initListEjecutivos: function() {
          if (ejecutivos) return $q.resolve(ejecutivos);
          return initListEjecutivos();
        },
        initListEmpresas: function() {
          if (_empresas) return $q.resolve(_empresas);
          return initListEmpresas();
        },
        initEstadosScan: function() {
          if (estadoScan) return $q.resolve(estadoCartas);
          return initEstadosScan();
        },
      }
    }])
});
