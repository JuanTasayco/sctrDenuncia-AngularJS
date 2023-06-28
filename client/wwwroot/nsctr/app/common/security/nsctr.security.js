(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'lodash', 'system'],
  function(angular, constants, _, system) {

  angular.module('nsctr.security',[])

    .factory('nsctrAuthorize',
      ['$window', 'proxyMenu', '$q',
      function($window, proxyMenu, $q) {

        var LOCAL_STORE = $window['localStorage'],
            KEY_SUB_MENU = 'nsctrSubMenu',
            KEY_HOME_MENU = 'nsctrHomeMenu';

        function _setHomeMenu(data) {
          LOCAL_STORE[KEY_HOME_MENU] = angular.toJson(data);
        }

        function _getHomeMenu(oimClaims, accessMenu) {
          var homeMenu = angular.fromJson(LOCAL_STORE[KEY_HOME_MENU]) || [],
              loginType = constants.typeLogin,
              deferred = $q.defer();

          function _createMenu(menuData, isBrokerOrProvider) {
            isBrokerOrProvider = isBrokerOrProvider || false;
            var menu = (isBrokerOrProvider)
                        ? menuData
                        : new jinqJs()
                          .from(menuData)
                            .where(function(row) {
                              return row.knownApp && row.knownApp.groupApps;
                            })
                          .join(system.apps.nsctr.apps)
                            .on(function(menu, menuNsctr) {
                              return menu.knownApp.code === menuNsctr.code;
                            })
                          .select(function(elem) {
                            return elem.knownApp;
                          });
            _setHomeMenu(menu);

            return menu;
          }

          if (!homeMenu.length) {

            if ((oimClaims.userType === loginType.broker.type.toString() &&
                  oimClaims.userSubType === loginType.broker.subType.toString())
                || (oimClaims.userType === loginType.proveedor.type.toString() &&
                    oimClaims.userSubType === loginType.proveedor.subType.toString())) {

              proxyMenu.GetSubMenu(accessMenu[0].codigo, true).then(function(response) {
                if (angular.isArray(response.data) && response.data.length > 0) {
                  var appSubMenu = _.find(response.data, function(item) {
                    return item.nombreCabecera && item.nombreCabecera.toUpperCase() === 'APLICACIONES'
                  });
                  if (appSubMenu) {
                    var items = appSubMenu.items.reduce(function(previuos, menu) {
                      var knownApp = _.find(system.apps.nsctr.apps, function(menuNsctr) {
                        var vCodeObj = menuNsctr.codeObj.dev.concat(menuNsctr.codeObj.prod);
                        return _.contains(vCodeObj, menu.codigoObj);
                      });
                      if (knownApp) {
                        previuos.push(
                          {
                            code: knownApp.code,
                            name: menu.nombreLargo,
                            href: knownApp.location,
                            uiSref: knownApp.state || '',
                            icon: knownApp.icon,
                            iconMYD: knownApp.iconMYD,
                            description: knownApp.menuName,
                            groupApps: true
                          }
                        );
                      }

                      return previuos;
                    }, []);
                    homeMenu = _createMenu(items, true);
                  }
                }
                deferred.resolve(homeMenu);
              }).catch(function(error) {
                deferred.reject(error.statusText);
              });

            } else {
              homeMenu = _createMenu(accessMenu);
              deferred.resolve(homeMenu);
            }

          } else {

            deferred.resolve(homeMenu);

          }

          return deferred.promise;
        }

        function _setSubMenu(appCode, data) {
          LOCAL_STORE[KEY_SUB_MENU + appCode] = angular.toJson(data);
        }

        function _getSubMenu(appCode) {
          return angular.fromJson(LOCAL_STORE[KEY_SUB_MENU + appCode]);
        }

        function _isAuthorizedSubMenu(toState, toParams) {
          var vModule = toState.module,
              vSubMenu = _getSubMenu(vModule.appCode);

					function _authorized(subMenu, toState) {
						var vNsctrSecurity = toState.nsctrSecurity;
						if (vNsctrSecurity
							&& Object.keys(vNsctrSecurity).length
							&& (vNsctrSecurity.headerName || Object.keys(vNsctrSecurity.codeObj).length)) {

							var vAuthorized;

							if (vNsctrSecurity.headerName) {
								vAuthorized = _.find(subMenu, function(elem, key){
									return (!(elem.items && elem.items.length))
													? elem.nombreCabecera === vNsctrSecurity.headerName
													: false;
								});
							} else {
								vNsctrSecurity.codeObj = vNsctrSecurity.codeObj || {};
								vAuthorized = _.find(subMenu, function(elem, key){
									if (elem.items && elem.items.length) {
										return !!_.find(elem.items, function(item, key){
                      var vCodeObj = vNsctrSecurity.codeObj.dev.concat(vNsctrSecurity.codeObj.prod);
                      return (vCodeObj)
                                ? angular.isArray(vCodeObj)
                                  ? vCodeObj.indexOf(item.codigoObj) > -1
                                  : item.codigoObj == vCodeObj
																: true;
										});
									} else {
										return false;
									}
								});
							}
							return !!vAuthorized;
            } else {
              return true;
            }
          }

          if (!vSubMenu){
            return proxyMenu.GetSubMenu(vModule.appCode, true).then(function(response){
              _setSubMenu(vModule.appCode, response.data);
              return _authorized(response.data, toState);
            });
          } else {
            return _authorized(vSubMenu, toState);
          }
        }

        return {
          isAuthorized: function(toState, toParams) {
            var vSubMenu = (toState.module)
                              ? _isAuthorizedSubMenu(toState, toParams)
                              : true;
            return vSubMenu;
          },
          getHomeMenu: _getHomeMenu,
          getSubMenu : _getSubMenu
        }
    }])

});
