(function($root, deps, action) {
  define(deps, action);
})(this, ['angular', 'constants', 'lyra'], function(angular, constants) {
  angular
    .module('appAutos')
    .controller('polizasHomeController', [
      '$scope',
      'authorizedResource',
      'oimClaims',
      'proxyMenu',
      'proxyReferido',
      'mModalAlert',
      '$state',
      function($scope, authorizedResource, oimClaims, proxyMenu, proxyReferido, mModalAlert, $state) {

            var onlyMenusMap = [
                { code: 'AUTOMOVILES', cssIcon: 'ico-mapfre_104_auto_front', iconMYD: 'ico-mapfre-377-autos',uiSref: 'homePolizasAutos', description: 'Autos' },
                { code: 'HOGAR', cssIcon: 'ico-mapfre_112_hogar', iconMYD: 'ico-mapfre-378-hogar', uiSref: 'hogarHome', /*href: '/EMISA/default.aspx?query=' + oimClaims.tokenMapfre*/ description: 'Hogar' },
                { code: 'SOAT', cssIcon: 'ico-mapfre_42_soat', iconMYD: 'ico-mapfre-381-soat', uiSref: 'homePolizasSOAT', description: 'SOAT' },
                 { code: 'SALUD', cssIcon: 'ico-mapfre_114_heart', iconMYD: 'ico-mapfre-374-salud', uiSref: 'homePolizasSalud', description: 'Salud' },
                { code: 'EPSEMPRESA', cssIcon: 'ico-mapfre_393_eps_empresa', iconMYD: 'ico-mapfre_393_eps_empresa', uiSref: 'homePolizaEpsEmpresa', description: 'EPS Empresa' },             
                { code: 'TRANSPORTES', cssIcon: 'ico-mapfre_131_transport', iconMYD: 'ico-mapfre-376-transporte', uiSref: 'homePolizasTransportes', description: 'Transportes' },
                { code: 'CWVI', cssIcon: 'ico-mapfre_116_signal', iconMYD: 'ico-mapfre-380-vida', uiSref: 'homePolizasVidas', description: 'Vida' },
                { code: 'FORMACIÓN LABORAL', cssIcon: 'ico-mapfre-399-fola', iconMYD: 'ico-mapfre-399-fola', uiSref: 'homePolizasFola', description: 'FOLA'},
                { code: 'EMISAVIDALEY', cssIcon: 'ico-mapfre-389-vida-ley', iconMYD: 'ico-mapfre-389-vida-ley', uiSref: 'homePolizaVidaLey', description: 'Vida Ley' },
                { code: 'ACCIDENTES', cssIcon: 'ico-mapfre_129_accidents', iconMYD: 'ico-mapfre-383-accidente', uiSref: 'homePolizasAccidentes', description: 'Accidentes' },
                { code: 'EMPRESAS', cssIcon: 'ico-mapfre_120_building', iconMYD: 'ico-mapfre-382-empresa', uiSref: 'homeCompany', description: 'Empresas' },
                { code: 'SCTR', cssIcon: 'ico-mapfre_130_SCTR', iconMYD: 'ico-mapfre-375-sctr', uiSref: 'sctrHome', description: 'SCTR' },
                { code: 'RRGG', cssIcon: 'ico-mapfre-390-rrgg', iconMYD: 'ico-mapfre-390-rrgg', uiSref: 'homePolizasRrgg', description: 'Riesgos Generales' },
                { code: 'SEGURVIAJES', cssIcon: 'ico-mapfre_339_security-badge', iconMYD: 'ico-mapfre-379-viaje', uiSref: 'homePolizasSeguroviaje', description: 'Segurviaje' },
                { code: 'DECESO', cssIcon: 'ico-insurance-life_deceases', iconMYD: 'ico-insurance-life_deceases', uiSref: 'homePolizasDeceso', description: 'DECESOS' },
                { code: 'clinica Digital', cssIcon: 'ico-mapfre-356-myd-default', iconMYD: 'ico-mapfre-356-myd-default', uiSref: 'homePolizasClinicaDigital', description: 'Clinica Digital' },
                { code: 'EMISA-CAMPOSANTO', cssIcon: 'ico-mapfre-390-sepelios', iconMYD: 'ico-mapfre-390-sepelios', uiSref: 'homePolizasCampoSanto', description: 'Camposanto' }
            ];

            //       if (oimClaims.flagUserByPass != 'N') {



            var _onlyMenus = [
                /*{ code: 'AUTOMOVILES', cssIcon: 'ico-mapfre_104_auto_front', uiSref: 'homePolizasAutos', description: 'Autos' },
                            { code: 'HOGAR', cssIcon: 'ico-mapfre_112_hogar', uiSref: 'hogarHome', description: 'Hogar' },
                            { code: 'SOAT', cssIcon: 'ico-mapfre_42_soat', uiSref: 'homePolizasSOAT', description: 'SOAT' },
                            { code: 'SALUD', cssIcon: 'ico-mapfre_114_heart', uiSref: 'hogarHome', description: 'Salud' },
                            { code: 'TRANSPORTES', cssIcon: 'ico-mapfre_131_transport', uiSref: 'homePolizasTransportes', description: 'Transportes' },
                            */
                            { code: 'EMISA-CAMPOSANTO', cssIcon: 'ico-mapfre-390-sepelios', iconMYD: 'ico-mapfre-390-sepelios', uiSref: 'homePolizasCampoSanto', description: 'Camposanto' },           
                { code: 'CWVI', cssIcon: 'ico-mapfre_116_signal', uiSref: 'homePolizasVidas', description: 'Vida' },
                { code: 'EMISAVIDALEY', cssIcon: 'ico-mapfre-389-vida-ley', iconMYD: 'ico-mapfre-389-vida-ley', uiSref: 'homePolizaVidaLey', description: 'Vida Ley' },
                { code: 'DECESO', cssIcon: 'ico-mapfre-392-deceso', iconMYD: 'ico-mapfre-392-deceso', uiSref: 'homePolizasDeceso', description: 'DECESOS' }
                /*{ code: 'ACCIDENTES', cssIcon: 'ico-mapfre_129_accidents', uiSref: 'homePolizasAccidentes', description: 'Accidentes' },
                { code: 'EMPRESAS', cssIcon: 'ico-mapfre_120_building', uiSref: 'homeCompany', description: 'Empresas' },
                { code: 'SCTR', cssIcon: 'ico-mapfre_130_SCTR', uiSref: 'sctrHome', description: 'SCTR' }
                */
        ];

        var onlyMenus = oimClaims.flagUserByPass != 'N' ? onlyMenusMap : _onlyMenus;
        $scope.isMYD = window.localStorage['appOrigin'] === constants.originApps.myDream;
        $scope.isOIM = !$scope.isMYD;

        $scope.isVisibleBtnDigitalBusiness = oimClaims.userProfile === constants.userProfile.adminWeb;
        $scope.isVisibleBtnPaymentType = oimClaims.userProfile === constants.userProfile.adminWeb;
        $scope.isBtnDocumentsTypeVisible = oimClaims.flagUserByPass != 'N';
        $scope.isBtnPaymentTypeVisible = oimClaims.flagUserByPass != 'N';
        var accessSubMenu = authorizedResource.accessSubMenu;
        $scope.checkPolicy = checkPolicy;
        $scope.saveReferido = saveReferido;
        $scope.checkInput = checkInput;
        $scope.showInputReferidos = false;
        $scope.mNroReferido = JSON.parse(window.localStorage.getItem('profile')).numeroReferido;
        $scope.inputDisabled = $scope.checkInput($scope.mNroReferido);

            var accessVida = null;
            var accessVidaLey = null;
            var accessCampoSanto = null;

            var VidaCode = 'CWVI';
            var EMISAVIDALEY = 'EMISAVIDALEY';
            var EMISACAMPOSANTO = 'EMISA-CAMPOSANTO';
            
            if (((oimClaims.userSubType == constants.typeLogin.broker.subType &&
                        oimClaims.userType == constants.typeLogin.broker.type) ||
                    (oimClaims.userSubType == constants.typeLogin.proveedor.subType &&
                        oimClaims.userType == constants.typeLogin.proveedor.type))) {

                var clone = helper.clone(authorizedResource.accessMenu)
                var items = [] //PARA EL MENU
                angular.forEach(clone, function(item) {
                    if (item.knownApp) items.push(item.knownApp)
                })
                
                if (clone && clone.length === 1) {
                    proxyMenu.GetSubMenu(clone[0].codigo, true).then(function(response) {
                        if (angular.isArray(response.data) && response.data.length > 0) {
                            var appSubMenu = _.find(response.data,
                                function(item) {
                                    return item.nombreCabecera && item.nombreCabecera.toUpperCase() === "APLICACIONES"
                                });
                            if (appSubMenu) {
                                $scope.items = $scope.items || [];
                                var emisa = _.find(appSubMenu.items, function(x) {
                                    return x.nombreCorto == "EMISION DE POLIZAS";
                                });
                                if (emisa !== null && $scope.items.length > 0 && oimClaims.flagUserByPass == 'N') {
                                    $scope.items[0].href = emisa.ruta
                                }
                                var vida = _.find(appSubMenu.items, function(x) {
                                    return /CWVI/.test(x.ruta);
                                });
                                var vidaley = _.find(appSubMenu.items, function(x) {
                                  return /EMISAVIDALEY/.test(x.ruta);
                              });
                                if (vida) {
                                    if (!_.find($scope.items, function(x) { return x.code == VidaCode})) {
                                        var items = $scope.items || [];
                                        var itemLife = _.find(onlyMenus, function(x) { return x.code == VidaCode})
                                        items.push(itemLife);
                                        $scope.items = items;
                                    }
                                }
                                if (vidaley) {
                                  if (!_.find($scope.items, function(x) { return x.code == EMISAVIDALEY})) {
                                      var items2 = $scope.items || [];
                                      var itemLife2 = _.find(onlyMenus, function(x) { return x.code == EMISAVIDALEY })
                                      items2.push(itemLife);
                                      if ($scope.items.length){
                                        $scope.items.push(itemLife2);
                                      }else{
                                        $scope.items = items2;
                                      }
                                      
                                  }


                              }
                            }
                        }
                    });
                }

            } else {
                accessVida = _.find(authorizedResource.accessApp, function(value) {
                    return value.code == VidaCode
                })
                accessVidaLey = _.find(authorizedResource.accessApp, function(value) {
                  return value.code == EMISAVIDALEY
                })
                accessCampoSanto = _.find(authorizedResource.accessApp, function(value) {
                  return value.code == EMISACAMPOSANTO
                })
            }
        var accessDecesos =  _.find(authorizedResource.accessApp, function(value) {
          return value.code == 'DECESO'
        })

            if (angular.isArray(accessSubMenu)) {
                var items = new jinqJs().
                from(accessSubMenu).
                join(onlyMenus).on(function(x, m) {
                    return x.nombreCabecera == m.code;
                }).
                select();
                if(accessCampoSanto){
                  var Camposanto = _.find(onlyMenus, function(x) { return x.code == accessCampoSanto.code })
                  if (oimClaims.flagUserByPass == 'N')
                      life.href = Camposanto.href;
                  items.push(Camposanto);
                }
                if (oimClaims.flagUserByPass == 'N')
                    items.push({ code: 'EMISA', cssIcon: 'ico-mapfre_152_polizas', href: '/EMISA/default.aspx?query=' + oimClaims.tokenMapfre, description: 'Cotización y Emisión de Pólizas' });
                if (accessVida) {
                    var life = _.find(onlyMenus, function(x) { return x.code == accessVida.code })
                    if (oimClaims.flagUserByPass == 'N')
                        life.href = accessVida.href;
                    items.push(life);
                }
                if (accessVidaLey) {
                  var life = _.find(onlyMenus, function(x) { return x.code == accessVidaLey.code })
                  if (oimClaims.flagUserByPass == 'N')
                      life.href = accessVidaLey.href;
                  items.push(life);
              }
                if (accessDecesos) {
                  var decesos = _.find(onlyMenus, function(x) { return x.code == accessDecesos.code })
                  if (oimClaims.flagUserByPass == 'N')
                    decesos.href = accessDecesos.href;
                  items.push(decesos);
                }
                $scope.secondDesign = items.length < 3;
                $scope.items = items
            }
            if ($scope.isVisibleBtnDigitalBusiness) {
              $scope.items.push({ code: 'GENERAL', cssIcon: 'ico-mapfre-356-myd-default', iconMYD: 'ico-mapfre-356-myd-default', uiSref: 'homeGeneral', description: 'General' });
            }
            (function checkAgenteReferido(){
                var codAgente = parseInt(JSON.parse(window.localStorage.getItem("profile")).codagent);
                var codCompany = constants.module.polizas.accidentes.companyCode;

                proxyReferido.esAgenteReferido(codAgente, codCompany, true)
                    .then(function(response){
                        if(response.codigoOperacion == 200){
                          if(response.data == "SI"){
                            $scope.showInputReferidos = true;
                          }
                          else{
                            $scope.showInputReferidos = false;
                          }
                        }
                    })
                    .catch(function(err){
                        console.log('Error: ', err)
                    })
            })();

            function checkPolicy(item) {
							switch(item.code){
                                case 'EPSEMPRESA':
									var codigoRamo = constants.module.polizas.referidos.epsEmpresa;
									var companyCode = constants.module.polizas.epsEmpresa.companyCode;
								break;
								case 'ACCIDENTES':
									var codigoRamo = constants.module.polizas.referidos.accidentes;
									var companyCode = constants.module.polizas.accidentes.companyCode;
								break;
								case 'AUTOMOVILES':
									var codigoRamo = constants.module.polizas.referidos.autos;
									var companyCode = constants.module.polizas.autos.companyCode;
								break;
								case 'EMPRESAS':
									var codigoRamo = constants.module.polizas.referidos.empresas;
									var companyCode = constants.module.polizas.empresas.companyCode;
								break;
								case 'HOGAR':
									var codigoRamo = constants.module.polizas.referidos.hogar;
									var companyCode = constants.module.polizas.hogar.codeCia;
								break;
								case 'SALUD':
									var codigoRamo = constants.module.polizas.referidos.salud;
									var companyCode = constants.module.polizas.salud.companyCode;
								break;
								case 'SCTR':
									var codigoRamo = constants.module.polizas.referidos.sctr;
									var companyCode = constants.module.polizas.sctr.companyCode;
								break;
								case 'SOAT':
									var codigoRamo = constants.module.polizas.referidos.soat;
									var companyCode = constants.module.polizas.soat.companyCode;
								break;
								case 'TRANSPORTES':
									var codigoRamo = constants.module.polizas.referidos.transportes;
									var companyCode = constants.module.polizas.transportes.companyCode;
								break;
								case 'CWVI':
									var codigoRamo = constants.module.polizas.referidos.vida;
									var companyCode = constants.module.polizas.vida.companyCode;
                break;
                case 'EMISAVIDALEY':
									var codigoRamo = constants.module.polizas.referidos.vidaLey;
                  var companyCode = constants.module.polizas.vidaLey.companyCode;
                break;
                                case 'SEGURVIAJES':
                                    var codigoRamo = constants.module.polizas.referidos.segurviaje;
                                    var companyCode = constants.module.polizas.segurviaje.companyCode;
                                break;
                                case 'FORMACIÓN LABORAL':
									var codigoRamo = constants.module.polizas.referidos.fola;
									var companyCode = constants.module.polizas.fola.companyCode;
								break;
                            }
                            if($scope.showInputReferidos){
							var codigoAplicacion = constants.module.polizas.description;
							var params = {
								codigoAplicacion: codigoAplicacion,
								codigoRamo: codigoRamo,
								codigoCompania : companyCode
							}
                            proxyReferido.EsReferidoObligatorio(params, true)
                                .then(function(response){
                                    if(response.codigoOperacion == constants.operationCode.success){
                                        if(response.data === 'S' && !$scope.mNroReferido){
                                            mModalAlert.showWarning('El número de referido es obligatorio para este producto', '');
                                        }
                                        else{
                                            $state.go(item.uiSref);
                                        }
                                    }
                                });
                            }else{
                                $state.go(item.uiSref);
                            }
            }
            function checkInput(mNroReferido){
                if(mNroReferido){
                    return true
                }
                else{
                    return false
                }
            }
            function saveReferido(value){
                var profileObject = JSON.parse(window.localStorage.getItem("profile"));
                if(value != ''){
                    profileObject.numeroReferido = value;
                }
                else if(!angular.isUndefined(profileObject.numeroReferido)){
                    delete profileObject.numeroReferido;
            }

            window.localStorage.setItem("profile", JSON.stringify(profileObject));
    }

      function showBtnPaymentTypeVisible() {
        return _.find(accessSubMenu, function(value) {
          return value.nombreCabecera === 'CONFIGURACION DE PAGO';
        });
      }

      $scope.isDesktop = function() {
        return !helper.isMobile();
      };
    }
    ])
    .directive('heightRow', function($timeout, $window) {
      return {
        link: link,
        restrict: 'A'
      };

      function link(scope, element, attrs) {
        var w = angular.element($window);
        function setHeightRow() {
          scope.widthWindow = $window.innerWidth;
          scope.rowHeight = 0;
          var liArray = element.find('a');
          angular.forEach(liArray, function(value, key) {
            value.removeAttribute('style');
          });
          angular.forEach(liArray, function(value, key) {
            if (value.offsetHeight > scope.rowHeight) scope.rowHeight = value.offsetHeight;
          });
          element.find('a').css('height', scope.rowHeight + 'px');
          angular.forEach(liArray, function(value, key) {
            value.className += ' added';
          });
        }
        $timeout(init, 300);

        function init() {
                    // console.log('Activando directiva... ')
          setHeightRow();
        }
        w.bind('resize', function() {
                    // console.log('Activando directiva en resize... ')
          setHeightRow();
        });
      }
    })
    .directive('focusReferidoInput', function() {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          $(element).click(function(ev) {
            $('#referidoInput')
              .find('input')
              .focus();
          });
        }
      };
    });
});
