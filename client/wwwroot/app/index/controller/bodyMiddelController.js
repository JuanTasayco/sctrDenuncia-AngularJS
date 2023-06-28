(function($root, deps, factory) {
    define(deps, factory)
})(this, ['angular', 'constants', 'system', 'oimUsers', 'lodash', 'mpfModalImage'], function(angular, constants, system, oimUsers, _, mpfModalImage) {
    var appHome = angular.module('oim.layout');
    appHome.controller('bodyMiddelController', ['$scope',
        '$window', '$http', '$q', 'authorizedResource', 'proxyMenu', 'oimClaims', 'intranetPermissions', 'proxyClaims', '$uibModal',
        function($scope, $window, $http, $q, authorizedResource, proxyMenu, oimClaims, intranetPermissions, proxyClaims, $uibModal) {

            function init() {
							$scope.intranetPermissions = intranetPermissions;

                $window.sessionStorage.removeItem('RutaCGW');
                var user = _.find(oimUsers, function(user) { return user.username === oimClaims.loginUserName.toUpperCase() });
                var cloneAccessApp = helper.clone(authorizedResource.accessApp);
                var clone = helper.clone(authorizedResource.accessMenu);
                var items = []; //PARA EL MENU

                if (user) {
                  _.forEach(user.apps, function(userApp) {
                    var accessApp = _.find(cloneAccessApp, function(app) {
                      return app.code === userApp.code;
                    });

                    if (accessApp) {
                      _.remove(cloneAccessApp, function(app) {
                        return app.code === accessApp.code;
                      })

                      var item = {
                        code: userApp.code,
                        name: userApp.menuName,
                        href: userApp.location,
                        icon: userApp.icon,
                        description: userApp.menuName,
                        knownApp: {
                          name: userApp.menuName,
                          href: userApp.location,
                          icon: userApp.icon,
                          description: userApp.menuName
                        }
                      }
                      clone.push(item);
                    }
                  })
                }

                angular.forEach(clone, function(item) {
                    if (item.knownApp && !item.knownApp.groupApps) items.push(item.knownApp)
                })
                if (clone) {
                    $scope.secondDesign = items.length < 3;
                    if (clone.length === 1 && ((oimClaims.userSubType == constants.typeLogin.broker.subType &&
                                oimClaims.userType == constants.typeLogin.broker.type) ||
                            (oimClaims.userSubType == constants.typeLogin.proveedor.subType &&
                                oimClaims.userType == constants.typeLogin.proveedor.type))) {

                        proxyMenu.GetSubMenu(clone[0].codigo, true).then(function(response) {
                            if (angular.isArray(response.data) && response.data.length > 0) {
                                var appSubMenu = _.find(response.data,
                                    function(item) {
                                        return item.nombreCabecera && item.nombreCabecera.toUpperCase() === "APLICACIONES"
                                    });
                                if (appSubMenu) {
                                    $scope.moreFunctionalities = $scope.moreFunctionalities || []
                                    angular.forEach(appSubMenu.items, function(submenu) {
                                        var app = _.find(system.apps, function(a) { return a.shortName == submenu.nombreCorto });

                                        // if (submenu.nombreCorto == "COTIZADOR VIDA INDIVIDUAL" ||
                                        //     submenu.nombreCorto == "COTIZADOR DE ACCIDENTES PERSONALES")
                                        //     return;

                                        if (app) {
                                            items.push({
                                                code: app.code,
                                                name: app.menuName,
                                                href: app.location,
                                                icon: app.icon,
                                                description: app.menuName
                                            })
                                            if(submenu.nombreCorto.toUpperCase() === "CARTA CARANTIA") setRuta(submenu);
                                        } else {
                                          var vVida  = new RegExp(constants.module.polizas.vida.code, 'g');
                                          if (!vVida.test(submenu.ruta)){
                                            $scope.moreFunctionalities.push({
                                              code: submenu.codigoObj,
                                              href: submenu.ruta,
                                              name: submenu.nombreCorto,
                                            });
                                          }
                                        }

                                    });
                                    $scope.menu = items;
                                }


                              var appSubMenuAdmin =_.find(response.data,
                                function(item){
                                  return item.nombreCabecera && item.nombreCabecera.toUpperCase() === "ADMINISTRACION"
                                }
                              )

                              if (appSubMenuAdmin) {
                                angular.forEach(appSubMenuAdmin.items, function(submenu) {
                                  if(submenu.nombreLargo.toUpperCase() == 'ADMINISTRAR USUARIOS'){
                                    $scope.moreFunctionalities.push({
                                      code: submenu.codigoObj,
                                      href: submenu.ruta,
                                      name: submenu.nombreCorto
                                    })
                                  }
                                });
                              }

                            }else{
                                $scope.menu = items;
                            }

                        });

                    } else {
                        $scope.menu = items;
                    }

                }

                var itemsFunctionalities = [];
                angular.forEach(cloneAccessApp, function(item) {
                  if (item.code !== 'CWVI' && item.code !== 'EMISAVIDALEY' && item.code !== 'EMISA-CAMPOSANTO') {
                    itemsFunctionalities.push(item);
                  }
                });
                $scope.moreFunctionalities = itemsFunctionalities;

            }

            init();

            $scope.goApplication = function(application, e) {
              if (e) {
                e.preventDefault();
                e.stopPropagation();

                proxyClaims.GenerateTokenMapfre(true)
                  .then(function(response) {
                    var vHref = e.target.href.replace('{tokenMapfre}', response);
                    window.open(vHref, '_blank');
                  });
              } else {
              window.localStorage['CodigoAplicacion'] = application.code;
                window.location.href = application.href;
              }
            };

            function setRuta(aplicacion) {
                // /console.log(angular.toJson(aplicacion.ruta));
                 console.log($window.sessionStorage.getItem('RutaCGW'));
                if($window.sessionStorage.getItem('RutaCGW') == null){
                    $window.sessionStorage.setItem('RutaCGW', JSON.stringify(aplicacion.ruta));
                }else if($window.sessionStorage.getItem('RutaCGW').length>0){
                    $window.sessionStorage.removeItem('RutaCGW');
                    $window.sessionStorage.setItem('RutaCGW', JSON.stringify(aplicacion.ruta));
                }
            };
        }
    ]);
})
