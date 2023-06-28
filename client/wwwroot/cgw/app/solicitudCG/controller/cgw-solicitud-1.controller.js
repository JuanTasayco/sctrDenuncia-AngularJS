define([
  'angular', 'constants',
  '/cgw/app/factory/cgwFactory.js'
], function(ng, constants) {

  cgwSolicitud1Controller.$inject = ['$scope', 'cgwFactory', '$rootScope', '$state', 'mModalAlert', '$window', 'oimClaims'];

  function cgwSolicitud1Controller($scope, cgwFactory, $rootScope, $state, mModalAlert, $window, oimClaims) {

  (function onLoad() {

      $scope.grupoAplicacion = parseInt(oimClaims.userSubType);

      cgwFactory.getRole($scope.grupoAplicacion).then(function (response) {
        if (response.data) {
          $scope.roleId = response.data.roleId;
          $scope.roleCode = response.data.roleCode;

          if ($scope.roleCode === constants.module.cgw.roles.medExterno.description) {//MED Externo)
           window.location.href = '/';
          }

          if ($scope.roleCode === constants.module.cgw.roles.clinica.description) {
            cgwFactory.getSubMenu('OIMPROV').then(function (response) {
              var appSubMenu = _.find(response.data,
                function(item) {
                    return item.nombreCabecera && item.nombreCabecera.toUpperCase() === "APLICACIONES"
                });

              if (appSubMenu !== undefined)
                ng.forEach(appSubMenu.items, function(submenu) {
                  if (submenu.nombreCorto.toUpperCase() === "CARTA CARANTIA") setRuta(submenu);

              });
            }, function(error) {
              mModalAlert.showError("Error en getTicketUser", 'Error');
            });
          }
        }
      });

      $scope.formData = $rootScope.formData || {};

      if ($rootScope.formData)
        $scope.formData = $rootScope.formData;
      else
        $scope.formData = {};

      $scope.noResult = true;
      $scope.firtSearch = false;
      $scope.onlyOne = true;
      $scope.currentPage = 0;
      $scope.pageSize = 10;
      $scope.pages = [];

      disableNextStep();

      $scope.paramsTicket = {
        GrupoAplicacion: parseInt($scope.grupoAplicacion),
        Usuario: oimClaims.loginUserName.toUpperCase(),//vm.user,
        CodigoAgente: (parseInt($scope.codAgt) ? parseInt($scope.codAgt) : 0),
        DescriptionAgente: ''
      };

      $scope.formData.paramsTicket = $scope.paramsTicket;

      cgwFactory.getTicketUser($scope.paramsTicket, false).then(function(response) {
        if (response.data) {
          $scope.formData.getTicketUser = response.data;
          $scope.userRuc = response.data.userCode;
          $scope.formData.ruc = response.data.userCode;
          $scope.userLogin = response.data.userLogin;
          $scope.formData.roleCode = response.data.roleCode;
          $scope.formData.flagClinic = response.data.flagClinic;
          $scope.codeClinic = response.data.clinic;
          $scope.sepsCode = response.data.sepsCode;
          $scope.clinicBranchCode = response.data.clinicBranchCode;
          $scope.clinicCode = response.data.clinicCode;
          $scope.providerCodeSctr = response.data.providerCodeSctr;
          $scope.providerName = response.data.providerName;
          $scope.formData.userCreate = response.data.userCode;
          $scope.formData.roleId = response.data.roleId;
          $scope.formData.roleCode = response.data.roleCode;
          $scope.dataClinica = response.data;

          if ($scope.formData.roleCode === constants.module.cgw.roleCodeClinica) {
            $scope.mClinica = {
              providerCode: $scope.clinicCode,
              code: $scope.providerName,
              description: $scope.userLogin,
              rucNumber: $scope.userRuc
            };
            $scope.flagClinic = 1;
            $scope.isClinic = true;
          } else {
            $scope.flagClinic = 0;
          }

          if (!$scope.clinicCode) {
            $scope.formData.sucursalKey = cgwFactory.getVariableSession('sucursal');
            $scope.userRuc = $scope.formData.sucursalKey.documentNumber;
            $scope.formData.ruc = $scope.formData.sucursalKey.documentNumber;
            $scope.sepsCode = $scope.formData.sucursalKey.providerCode;
            $scope.clinicCode = $scope.formData.sucursalKey.code;
            $scope.providerName = $scope.formData.sucursalKey.name;
            $scope.providerNameClean = (response.data.providerNameClean) ? response.data.providerNameClean : $scope.formData.sucursalKey.providerNameClean;//response.data.providerNameClean;
            $scope.providerCodeClinic = $scope.formData.sucursalKey.providerCode;

            if ($scope.formData.roleCode === constants.module.cgw.roleCodeClinica) {
              $scope.mClinica = {
                providerCode: $scope.providerCodeClinic,
                code: $scope.providerName,
                description: $scope.userLogin,
                rucNumber: $scope.userRuc
              };
            }
          }
        }
       }, function(error) {
         mModalAlert.showError("Al obtener credenciales de acceso a Cartas de Garantía", "Error").then(function(response) {
            window.location.href = '/';
          }, function(error) {
            window.location.href = '/';
          });
      });

      cgwFactory.getListCompany(false).then(function(response) {
        if (response.data.items.length > 0) {
          $scope.empresas = response.data.items;
          $scope.formData.mEmpresa = {id: $scope.formData.mEmpresaInit.idCompany, code: "", description: $scope.formData.mEmpresaInit.companyName};
          ($scope.formData.mEmpresa.id === 1) ?  $scope.formData.mEmpresa.code = "000006G" : $scope.formData.mEmpresa.code = "060027A";
        }
       }, function(error) {
        mModalAlert.showError("Error en getListCompany", 'Error');
      });

      //  Recuperar del claims si es administrador
      var key = 'cgwHome';
      if ((cgwFactory.getVariableSession(key).length > 0) || (typeof(cgwFactory.getVariableSession(key)) !== 'undefined')) {
        $scope.formData.CgwHome = cgwFactory.getVariableSession(key);
      }
    })();

    function disableNextStep() {
      $scope.formData.secondStepNextStep = false;
      $scope.formData.thirdStepNextStep = false;
      $scope.formData.fourthStepNextStep = false;
      $scope.formData.fifthStepNextStep = false;
    }

    $scope.$on('changingStep', function(ib,e) {
      if (typeof $scope.formData.secondStepNextStep === 'undefined') $scope.formData.secondStepNextStep = false;
      if (e.step < 2) {
        e.cancel = false;
      }else {
        e.cancel = true;
        disableNextStep();
      }
    });

    $scope.$watch('formData', function(nv)
      {
        $rootScope.formData =  nv;
      });

    $scope.empresasCboLbl = {
      label: 'Empresas',
      required: false
    };
    $scope.nombresInputLbl = {
      label: 'Nombres',
      required: false
    };
    $scope.apeMaternoInputLbl = {
      label: 'Apellido Materno',
      required: false
    };
    $scope.apePaternoInputLbl = {
      label: 'Apellido Paterno',
      required: true
    };

    $scope.limpiarP1 = function() {
      $scope.formData.afiliados = {};
      setearCarta();
      $scope.formData.mNombreAfiliado = '';
      $scope.formData.mApePaternoAfiliado = '';
      $scope.formData.mApeMaternoAfiliado = '';
      $scope.noResult = true;
      $scope.firtSearch = false;
      $scope.onlyOne = true;
    };

    $scope.$watch('formData.mNombreAfiliado', function(nv)
      {
       if (((typeof $scope.formData.mApePaternoAfiliado === 'undefined' || $scope.formData.mApePaternoAfiliado === '')&&
            (typeof $scope.formData.mApeMaternoAfiliado === 'undefined' || $scope.formData.mApeMaternoAfiliado === '')) ||
            (typeof ($scope.formData.mNombreAfiliado === 'undefined' || $scope.formData.mNombreAfiliado === '' ) &&
                        (typeof $scope.formData.mApePaternoAfiliado === 'undefined' || $scope.formData.mApePaternoAfiliado === ''))
        ) {
            $scope.onlyOne = true;

          } else {
            $scope.onlyOne = false;
          }
      });

      $scope.$watch('formData.mApePaternoAfiliado', function(nv)
      {
       if (((typeof $scope.formData.mApePaternoAfiliado === 'undefined' || $scope.formData.mApePaternoAfiliado === '')&&
            (typeof $scope.formData.mApeMaternoAfiliado === 'undefined' || $scope.formData.mApeMaternoAfiliado === '')) ||
            ((typeof $scope.formData.mNombreAfiliado === 'undefined' || $scope.formData.mNombreAfiliado === '' )&&
                          (typeof $scope.formData.mApeMaternoAfiliado === 'undefined' || $scope.formData.mApeMaternoAfiliado === '')) ||
            (typeof ($scope.formData.mNombreAfiliado === 'undefined' || $scope.formData.mNombreAfiliado === '' ) &&
                        (typeof $scope.formData.mApePaternoAfiliado === 'undefined' || $scope.formData.mApePaternoAfiliado === ''))
        ) {
            $scope.onlyOne = true;

          } else {
            $scope.onlyOne = false;
          }
      });

       $scope.$watch('formData.mApeMaternoAfiliado', function(nv)
      {
        if (((typeof $scope.formData.mApePaternoAfiliado === 'undefined' || $scope.formData.mApePaternoAfiliado === '')&&
            (typeof $scope.formData.mNombreAfiliado === 'undefined' || $scope.formData.mNombreAfiliado === '')) ||
            $scope.formData.mApeMaternoAfiliado === ''
          ) {
            $scope.onlyOne = true;

          } else {
            $scope.onlyOne = false;
          }
      });

    $scope.searchAffiliate = function(nombre, apellidoPaterno, apellidoMaterno) {

      setearCarta();

      $scope.frmSolicitudCgw1.markAsPristine();
      $scope.formData.searchCobertura = false;

      if (typeof $scope.formData.mEmpresa !== 'undefined' && typeof $scope.mClinica !== 'undefined') {
         if (typeof nombre !== 'undefined' && nombre !== '') {
          if ((typeof apellidoPaterno === 'undefined' || apellidoPaterno === '')) {
            $scope.formData.afiliados = [];
            $scope.onlyOne = true;
          } else {
            buscarAfiliado(nombre, apellidoPaterno, apellidoMaterno);
            $scope.onlyOne = false;
          }
        }else if (typeof apellidoPaterno !== 'undefined' && apellidoPaterno !== '') {
            if ((typeof nombre === 'undefined' || nombre === '' )&&
              (typeof apellidoMaterno === 'undefined' || apellidoMaterno === '')) {
              $scope.formData.afiliados = [];
              $scope.onlyOne = true;
            } else {
              buscarAfiliado(nombre, apellidoPaterno, apellidoMaterno);
              $scope.onlyOne = false;
            }


        }else if (typeof apellidoMaterno !== 'undefined' && apellidoMaterno !== '') {
          if ((typeof apellidoPaterno === 'undefined' || apellidoPaterno === '')) {
            $scope.formData.afiliados = [];
            $scope.onlyOne = true;
          } else {
            buscarAfiliado(nombre, apellidoPaterno, apellidoMaterno);
            $scope.onlyOne = false;
          }
        }
      } else {
        $scope.formData.afiliados = [];
      }

    };

    function buscarAfiliado(nombre, apellidoPaterno, apellidoMaterno) {

      $scope.clinicData = cgwFactory.getVariableSession('clinicData')

      if (typeof nombre === 'undefined') {
        nombre = '';
      }
      if (typeof apellidoPaterno === 'undefined') {
        apellidoPaterno = '';
      }
      if (typeof apellidoMaterno === 'undefined') {
        apellidoMaterno = '';
      }

      //EPS  y Mapfre Insurance
      $scope.paramAffiliate = {
        Nombres: nombre.toUpperCase(),
        ApellidoPaterno: apellidoPaterno.toUpperCase(),
        ApellidoMaterno: apellidoMaterno.toUpperCase(),
        CodigoEmpresa: $scope.formData.mEmpresa.code,
        EntidadVinculanteCodigo: ($scope.clinicData && $scope.roleCode !== constants.module.cgw.roles.clinica.description) ? $scope.clinicData.codeClean : $scope.providerNameClean,//$scope.mClinica.providerCode,
        EntidadVinculanteRuc: ($scope.clinicData && $scope.roleCode !== constants.module.cgw.roles.clinica.description) ? $scope.clinicData.rucNumber : ($scope.dataClinica.ruc !== '') ? $scope.dataClinica.ruc : $scope.dataClinica.originCompany
      };

      if($scope.roleCode === constants.module.cgw.roles.clinica.description) {
        if ($scope.formData.sucursalKey && $scope.formData.sucursalKey.providerNameClean) {
          $scope.paramAffiliate.EntidadVinculanteCodigo = $scope.formData.sucursalKey.providerNameClean;
        } else {
          $scope.paramAffiliate.EntidadVinculanteCodigo = $scope.dataClinica.providerNameClean;
        }

      } else {
        $scope.paramAffiliate.EntidadVinculanteCodigo = $scope.clinicData.codeClean;
      }

      $scope.formData.paramAffiliate = $scope.paramAffiliate;
      cgwFactory.searchAffiliate($scope.paramAffiliate, true).then(function(response) {

        if (response.data.items.length>0) {
          $scope.totalItems =response.data.items.length;
          $scope.formData.afiliados = response.data.items;
          configPages();
          $scope.noResult = false;
          $scope.firtSearch = false;
        } else {
          $scope.noResult = true;
          $scope.formData.afiliados = {};
          $scope.firtSearch = true;
        }
      }, function(error) {
        mModalAlert.showError("Error al buscar el afiliado. Favor intente nuevamente", 'Error');
      });
    }

    function configPages() {
      $scope.pages.length = 0;
      var ini = $scope.currentPage - 4;
      var fin = $scope.currentPage + 5;
      if (ini < 1) {
        ini = 1;
        if (Math.ceil($scope.formData.afiliados.length / $scope.pageSize) > 10)
          fin = 10;
        else
          fin = Math.ceil($scope.formData.afiliados.length / $scope.pageSize);
      } else {
        if (ini >= Math.ceil($scope.formData.afiliados.length / $scope.pageSize) - 10) {
          ini = Math.ceil($scope.formData.afiliados.length / $scope.pageSize) - 10;
          fin = Math.ceil($scope.formData.afiliados.length / $scope.pageSize);
        }
      }
      if (ini < 1) ini = 1;
      for (var i = ini; i <= fin; i++) {
        $scope.pages.push({
          no: i
        });
      }

      if ($scope.currentPage >= $scope.pages.length)
        $scope.currentPage = $scope.pages.length - 1;
    }

    $scope.setPage = function(index) {
      $scope.currentPage = index - 1;
    };

    $scope.continueStep = function(afiliado) {
      $scope.formData.secondStepNextStep = true;
      if ($scope.formData.afiliado) {
        if ($scope.formData.afiliado.codigoAfilado !== afiliado.codigoAfilado) {
          //Hay cambios
          setearCarta();
          $scope.formData.afiliado = afiliado;
        }
      } else {
        $scope.formData.afiliado = afiliado;
      }

       cgwFactory.getPic($scope.formData.mEmpresa.id, $scope.formData.afiliado.codigoAfilado).then(function (response) {
         $scope.formData.picAfiliado = response;
         $state.go('.', {step: 2, id: afiliado.codigoCorrelativo});
        }, function(error) {
          if (error.data)
            mModalAlert.showError(error.data.message, "Error");
        });
    };

    function setearCarta() {
      $scope.formData.mCelular = '';
      $scope.formData.mEmail = '';
      $scope.formData.cobertura = undefined;
      $scope.coberturaSelected = [];
      $scope.formData.diagnostico = {};
      $scope.formData.beneficio = {};
      $scope.formData.mUsuarioForzado = {};
      $scope.formData.mCopagoF = '';
      $scope.formData.mCopagoV = '';
      $scope.formData.copayForced = {};
      $scope.formData.procedimientos = {};
      $scope.formData.subtotal = 0;
      $scope.formData.montoIGV = 0;
      $scope.formData.total = 0;
      $scope.formData.paso2Guardado = false;
    }

    function setRuta(aplicacion) {
      if ($window.sessionStorage.getItem('RutaCGW') == null) {
        $window.sessionStorage.setItem('RutaCGW', JSON.stringify(aplicacion.ruta));
      }else if ($window.sessionStorage.getItem('RutaCGW').length>0) {
        $window.sessionStorage.removeItem('RutaCGW');
        $window.sessionStorage.setItem('RutaCGW', JSON.stringify(aplicacion.ruta));
      }
      if (cgwFactory.getVariableSession('RutaCGW').length>0) {
        var str = cgwFactory.getVariableSession('RutaCGW');
        var res = str.split("&");

        $scope.user = res[1].split("=")[1];
        $scope.grupoAplicacion = res[2].split("=")[1];
        $scope.codAgt = res[3].split("=")[1];
        $scope.userRuc = $scope.user;
      } else {
        $scope.user = '';
        $scope.grupoAplicacion = 0;
        $scope.codAgt = 0;

      }
    }

    $scope.getTemplateUrl = function (id) {
      return 'cgw-solicitud-ubigeo.html';
    }

  } //  end controller

  function startFromGrid() {
    return function(input, start) {
      if (!input || !input.length) { return; }
      start = +start; //parse to int
      return input.slice(start);
    }
  }

  return ng.module('appCgw')
    .controller('CgwSolicitud1Controller', cgwSolicitud1Controller)
    .filter('startFromGrid', startFromGrid)
});
