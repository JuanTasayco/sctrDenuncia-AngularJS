(function($root, deps, action) {
  define(deps, action);
})(this, ['angular', 'helper', 'system', 'constants', 'lodash'], function(angular, helper, system, constants, _) {
  angular
    .module('oim.security.authorization', ['oim.proxyService.Login', 'oim.security.authentication'])
    .service('accessSupplier', [
      '$state',
      'proxyMenu',
      'proxyClaims',
      '$window',
      'objectSystemConfiguration',
      '$q',
      '$parse',
      function($state, proxyMenu, proxyClaims, $window, objectSystemConfiguration, $q, $parse) {
        var store = $window[objectSystemConfiguration.storageType];
        var KEYApplications = 'evoApp';
        var KEYMenu = 'evoMenu';
        var KEYSubMenu = 'evoSubMenu';
        var KEYProfile = 'evoProfile';

        function clean() {
          var vProfile = store[constants.STORAGE_KEYS.profile];
          store.clear();
          store[constants.STORAGE_KEYS.profile] = vProfile;
        }

        function getAppName() {
          if (system.currentApp) return system.currentApp.code;
          var path = window.location.pathname;
          var app = new jinqJs()
            .from(helper.objectToArray(system.apps))
            .where(function(x) {
              return (
                !!x.code === true &&
                !!x.location === true &&
                ((x.location || '').toLowerCase().indexOf(path.toLowerCase()) !== -1 ||
                  path.toLowerCase().indexOf((x.location || '').toLowerCase()) !== -1)
              );
            })
            .select('code');
          if (app && app.length > 0) return app[0].code;
          else if (path == '/') return 'EMISA';
        }

        function getDataService(key, methodName, args, resolverData, proxy) {
          if (!store[key]) {
            var deferred = $q.defer();
            proxy = proxy || proxyMenu;
            proxy[methodName].apply(proxy, args || []).then(
              function(response) {
                var clon = helper.clone(response, true);
                var _data = resolverData ? resolverData(clon.data || clon) : clon.data || clon;
                store[key] = angular.toJson(_data);
                deferred.resolve(_data);
              },
              function(response) {
                deferred.reject(response);
              }
            );
            return deferred.promise;
          }

          return $q.resolve(angular.fromJson(store[key]));
        }

        function applications() {
          return angular.fromJson(store[KEYApplications]);
        }

        function menus() {
          return angular.fromJson(store[KEYMenu]);
        }

        function profile() {
          return angular.fromJson(store[KEYProfile]);
        }

        function subMenus(codeApp) {
          var appCode = codeApp || getAppName();
          return angular.fromJson(store[KEYSubMenu + appCode]);
        }

        function getApplications() {
          return getDataService(KEYApplications, 'GetMoreAplication', undefined, function(data) {
            if (angular.isArray(data))
              return new jinqJs().from(data).select(function(x) {
                return {
                  code: x.codigo,
                  name: x.nombreLargo,
                  href: x.rutaCompletaMx
                };
              });
            return [];
          });
        }

        function GetSubMenu() {
          var prov = undefined;
          if ($state.current.currentAppID) prov = $state.current.currentAppID;
          if ($state.toOimState) prov = $state.toOimState.currentAppID;
          var code = prov || getAppName();
          return getDataService(KEYSubMenu + code, 'GetSubMenu', [code]);
        }

        function GetProfile() {
          if (!store[KEYProfile]) {
            var deferred = $q.defer();
            proxy = proxyClaims;
            proxy['GetClaimsDictionary'].apply(proxy, []).then(
              function(response) {
                var clon = helper.clone(response, true);
                var _data = clon.data || clon;
                proxy.GetRolesByUser().then(
                  function(response) {
                    _data.rolesCode = angular.isArray(response.data) ? response.data : [];
                    store[KEYProfile] = angular.toJson(_data);
                    deferred.resolve(_data);
                  },
                  function(response) {
                    deferred.reject(response);
                  }
                );
              },
              function(response) {
                deferred.reject(response);
              }
            );
            return deferred.promise;
          }

          return $q.resolve(angular.fromJson(store[KEYProfile]));

          /*return getDataService(KEYProfile, 'GetClaimsDictionary', undefined, function(data){
                return data;
            }, proxyClaims);*/
        }

        function GetMenu() {
          function _createKnownApp(data, app, groupApps) {
            return {
              code: data.codigo,
              name: data.nombreLargo,
              href: app.location,
              uiSref: app.state || '',
              icon: app.icon,
              iconMYD: app.iconMYD,
              description: app.menuName,
              groupApps: groupApps || false
            };
          }
          function _createItemGroupMenu(app) {
            return {
              codigo: app.code,
              nombreLargo: app.menuName,
              nombreCorto: app.menuName,
              ruta: app.location,
              knownApp: {
                code: app.code,
                name: app.menuName,
                href: app.location,
                icon: app.icon,
                description: app.menuName
              }
            };
          }
          return getDataService(KEYMenu, 'GetMenu', undefined, function(data) {
            var vDataGroup = [];
            angular.forEach(data, function(m) {
              var vApp = _.find(system.apps, function(app) {
                var vSubApp = _.find(app.apps, function(subApp) {
                  return m.codigo == subApp.code;
                });
                if (vSubApp) {
                  m.knownApp = _createKnownApp(m, vSubApp, app.groupApps);
                  return !!vSubApp;
                } else {
                  return m.codigo == app.code;
                }
              });

              if (vApp) {
                if (!vApp.apps || !vApp.apps.length) {
                  m.knownApp = _createKnownApp(m, vApp);
                } else {
                  if (!_.some(vDataGroup, { codigo: vApp.code })) {
                    var vNewItem = _createItemGroupMenu(vApp);
                    vDataGroup.push(vNewItem);
                  }
                }
              }
            });
            if (vDataGroup.length) data = data.concat(vDataGroup);

            return data;
          });
        }

        function getAllObject() {
          var deferred = $q.defer();
          //clean();
          var dataInfo = [
            {
              propName: 'accessMenu',
              method: function() {
                return GetMenu();
              }
            },
            {
              propName: 'accessSubMenu',
              method: function() {
                return GetSubMenu();
              }
            },
            {
              propName: 'accessApp',
              method: function() {
                return getApplications();
              }
            },
            {
              propName: 'profile',
              method: function() {
                return GetProfile();
              }
            }
          ];
          try {
            var promises = (function(v) {
              angular.forEach(dataInfo, function(promise) {
                v.push(promise.method());
              });
              return v;
            })([]);
            $q.all(promises).then(
              function success(response) {
                data = {};
                angular.forEach(response, function(item, index) {
                  var _data = helper.clone(item, true);
                  _data = _data.data || _data;
                  $parse(dataInfo[index].propName).assign(data, _data);
                });

                deferred.resolve(data);
              },
              function error(response) {
                console.error(response);
                deferred.reject(response);
              },
              function _finally(response) {}
            );
            return deferred.promise;
          } catch (e) {
            console.error(e);
            throw e;
          }
        }
        var $this = this;

        function applyResolve($value) {
          $value.resolve = $value.resolve || {};
          if (objectSystemConfiguration.allowInjectProfile) {
            $value.resolve['oimClaims'] = function() {
              return $this.GetProfile();
            };
          }

          $value.resolve['oimSubMenu'] = function() {
            if (objectSystemConfiguration.allowAccessPrivileges) {
              return $this.GetSubMenu();
            }
            return {};
          };
        }
        this.applyResolve = applyResolve;

        this.getApplications = getApplications;

        this.GetSubMenu = GetSubMenu;

        this.GetMenu = GetMenu;

        this.applications = applications;

        this.menus = menus;

        this.subMenus = subMenus;

        this.GetProfile = GetProfile;

        this.profile = profile;

        this.getAllObject = getAllObject;

        this.clean = clean;

        this.$get = [
          function() {
            return this;
          }
        ];
      }
    ])
    .constant('objectSystemConfiguration', {
      storageType: 'localStorage',
      allowAuthorization: true,
      allowInjectProfile: false,
      allowAccessPrivileges: false,
      stateAccessDenied: 'accessdenied'
    })
    .config([
      '$provide',
      '$injector',
      'accessSupplierProvider',
      'objectSystemConfiguration',
      'mapfreAutheticationProvider',
      function($provide, $injector, accessSupplierProvider, objectSystemConfiguration, mapfreAutheticationProvider) {
        function promiseHttp(promise) {
          promise.then(
            function() {},
            function(response) {
              if (response.status == 401) {
                accessSupplierProvider.$get().clean();
                mapfreAutheticationProvider.$get().goLoginPage(true);
              }
            }
          );
          return promise;
        }
        function decoratorAuthHttp($delegate) {
          if (objectSystemConfiguration.allowAuthorization === true) {
            angular.forEach($delegate, function(verbMethod, index) {
              if (
                angular.isFunction(verbMethod) &&
                ['get', 'post', 'delete', 'put', 'patch', 'head', 'jsonp'].indexOf(index) !== -1
              ) {
                (function(nativeVerb) {
                  $delegate[index] = function() {
                    return promiseHttp(nativeVerb.apply($delegate, arguments));
                  };
                })(verbMethod);
              }
            });
            function $decoremx(requestConfig) {
              return promiseHttp($delegate(requestConfig));
            }
            for (var key in $delegate) $decoremx[key] = $delegate[key];
            return $decoremx;
          }
          return $delegate;
        }
        $provide.decorator('$http', decoratorAuthHttp);
      }
    ])
    .factory('oimPrincipal', [
      'accessSupplier',
      '$state',
      function(accessSupplier, $state) {
        var data = accessSupplier.profile();

        function init() {
          data = accessSupplier.profile();
        }

        function getRole(currentAppCode) {
          var role = currentAppCode ? _getInfoRole(currentAppCode) : getinfoRole();
          return role ? role.codigoRol : data.roleCode;
        }
        function getinfoRole() {
          var appID = $state.current.currentAppID || (system.currentApp ? system.currentApp.code : '');
          var roles = data.rolesCode; //  angular.fromJson(data.rolesCode);
          for (var role in roles) {
            if (
              roles[role].nombreAplicacion &&
              system.currentApp &&
              appID &&
              roles[role].nombreAplicacion.toLowerCase() === appID.toString().toLowerCase()
            )
              return roles[role];
          }
          return undefined;
        }
        function _getInfoRole(currentAppCode) {
          var vRoles = data.rolesCode,
            vRole = _.find(vRoles, function(fv, fk) {
              return fv.nombreAplicacion.toLowerCase() === currentAppCode.toLowerCase();
            });
          return vRole ? vRole : undefined;
        }

        function isUserType(subType) {
          var profile = data || accessSupplier.profile();
          return parseInt(profile.userSubType) === parseInt(subType);
        }

        function isCompanyClient() {
          return isUserType(constants.typeLogin.empresa.subType);
        }

        return {
          init: init,
          get_infoRole: function(currentAppCode) {
            var vInfoRole = currentAppCode ? _getInfoRole(currentAppCode) : getinfoRole();
            return vInfoRole || { codigoRol: data.roleCode, nombreRol: data.roleName };
          },
          get_role: function(currentAppCode) {
            return getRole(currentAppCode);
          },
          isAdmin: function(currentAppCode) {
            var role = getRole(currentAppCode);
            return role == 'ADMIN' || role == 'ADMINFUN' || role == 'ADM';
          },
          getAgent: function() {
            if (data && data.agentID) return { codigoNombre: data.agentName, codigoAgente: data.agentID };
            return null;
          },
          getUsername: function() {
            if (data && data.loginUserName) return data.loginUserName;
            return null;
          },
          getUserSubType: function() {
            if (data && data.userSubType) return data.userSubType;
            return null;
          },
          isUserType: isUserType,
          isCompanyClient: isCompanyClient
        };
      }
    ])
    .factory('oimAuthorize', [
      'accessSupplier',
      '$state',
      function(accessSupplier, $state) {
        function isAuthorized(toState, toParams, options) {
          var ops = angular.extend(
            {
              prop: 'code',
              propItem: 'codigoObj'
            },
            options
          );

          var data = accessSupplier.subMenus(toState.currentAppID);
          //if (!data)
          $state.toOimState = toState;
          var code = toState[ops.prop];
          var authororized;
          if (data === undefined) return true;
          if (code) {
            for (var index in data) {
              var submenu = data[index];
              if (ops.prop === 'code')
                authororized = _.filter(submenu.items, function(item) {
                  if (angular.isString(code) || angular.isNumber(code)) return item[ops.propItem] == code;
                  else if (angular.isArray(code)) {
                    return !!_.find(code, function(id) {
                      if (!angular.isObject(id)) return id == item[ops.propItem];
                      else {
                        return item[ops.propItem] == (constants.environment === 'PROD' ? id.valueProd : id.value);
                      }
                    });
                  } else if (angular.isObject(code)) {
                    var access = _.find(code.access, function(a) {
                      return a.when == toParams[code.param];
                    });
                    if (access) {
                      var then = access.thenProd && constants.environment === 'PROD' ? access.thenProd : access.then;
                      return !!_.find(then, function(t) {
                        return t == item[ops.propItem];
                      });
                    }

                    return false;
                  }

                  return false;
                });
              else {
                authororized = submenu[ops.propItem] == code;
              }

              if (authororized === true || (authororized && authororized.length > 0)) {
                break;
              }
            }
            return authororized;
          }
          return true;
        }

        function isAuthorizedSubMenu(toState, toParams) {
          return isAuthorized(toState, toParams, {
            prop: 'code',
            propItem: 'codigoObj'
          });
        }

        function isAuthorizedMenu(toState, toParams) {
          return isAuthorized(toState, toParams, {
            prop: 'appCode',
            propItem: 'nombreCabecera'
          });
        }
        return {
          isAuthorized: function(toState, toParams) {
            var submenu = isAuthorizedSubMenu(toState, toParams);
            var menu = isAuthorizedMenu(toState, toParams);
            toState.menu = menu;
            toState.submenu = submenu;
            return menu && ((submenu && !angular.isArray(submenu)) || (angular.isArray(submenu) && submenu.length > 0));
          }
        };
      }
    ])
    .run([
      '$rootScope',
      '$state',
      'oimAuthorize',
      'objectSystemConfiguration',
      function($rootScope, $state, oimAuthorize, objectSystemConfiguration) {
        function handlerAccess(event, toState, toParams, fromState, fromParams) {
          if (objectSystemConfiguration.allowAccessPrivileges) {
            if (!oimAuthorize.isAuthorized(toState, toParams)) {
              event.preventDefault();
              $state.go(objectSystemConfiguration.stateAccessDenied);
            }
          }
        }

        $rootScope.$on('$stateChangeStart', handlerAccess);
        $rootScope.$on('$stateChangeSuccess', handlerAccess);
      }
    ])
    .factory('oimIntranet', [
      '$window',
      '$http',
      '$q',
      'proxyPerson',
      function($window, $http, $q, proxyPerson) {
        var STORE = $window.localStorage,
          KEY_PROFILE = constants.STORAGE_KEYS.profile,
          KEY_INTRANET_PERMISSIONS = 'lsIntranetPermissions';

        function _getIntranetPermissions() {
          var vProfile = angular.fromJson(STORE[KEY_PROFILE]),
            vParams = {
              UserCode: vProfile.username,
              Ip: '0.0.0.0'
            };
          var vDeferred = $q.defer();
          ValidateCollaborator(vParams, vDeferred);
          return vDeferred.promise;
        }

        function ValidateCollaborator(params, vDeferred) {
          proxyPerson
            .ValidateCollaborator(params, false)
            .then(function(response) {
              STORE[KEY_INTRANET_PERMISSIONS] = angular.toJson(response.data);
              vDeferred.resolve(response.data);
            })
            .catch(function(error) {
              vDeferred.reject(error.statusText);
            });
        }

        return {
          permissions: function() {
            if (STORE[KEY_INTRANET_PERMISSIONS]) return $q.resolve(angular.fromJson(STORE[KEY_INTRANET_PERMISSIONS]));
            return _getIntranetPermissions();
          }
        };
      }
    ]);

  ('use strict');
  var _keyProfile = constants.STORAGE_KEYS.profile;
  var _keyToken = 'jwtMapfreToken';
  var _keyFirstToken = 'jwtFirstToken';
  var _keyUserTypes = 'lsUserTypes';
  var _keyOriginApp = 'appOrigin';

  angular
    .module('oim.security.authentication',
      ['satellizer', 'oim.google.analytics', 'origin.system', 'oim.theme.service', 'oim.proxyService.mydream', 'ngCookies', 'storage.manager'])
    .config([
      '$authProvider',
      function($authProvider) {
        // Parametros de configuración

        $authProvider.loginUrl = constants.system.api.endpoints.security + 'api/claims/GenerateClaimsByGroupType'; //Se agrego para el finalSignUp
        $authProvider.signupUrl = constants.system.api.endpoints.security + constants.system.login.path_authenticate + "?COD_OBJETO=login";
        $authProvider.tokenName = _keyToken;
        $authProvider.tokenPrefix = _keyToken;
        //   $authProvider.tokenHeader = constants.system.authorization.nameAuthHeader;
        //   $authProvider.httpInterceptor  = false;

      }]).service('mapfreAuthetication', [
        '$window',
        '$location',
        '$auth',
        '$q',
        '$httpParamSerializerJQLike',
        '$http',
        '$rootScope',
        'mModalConfirm',
        'gaService',
        'originSystemFactory',
        'proxyUsuario',
        'proxyRedirect',
        'mpSpin',
        'proxyHome',
        'proxyEncrypt',
        'httpData',
        'proxyLoginRsa',
        '$cookies',
        'localStorageFactory',
        function (
          $window,
          $location,
          $auth,
          $q,
          $httpParamSerializerJQLike,
          $http,
          $rootScope,
          mModalConfirm,
          gaService,
          originSystemFactory,
          proxyUsuario,
          proxyRedirect,
          mpSpin,
          proxyHome,
          proxyEncrypt,
          httpData,
          proxyLoginRsa,
          $cookies,
          localStorageFactory
          ) {

          var $this = this;
          var base2 = constants.system.api.endpoints.security;

          function _getProfile() {
            var defer = $q.defer(),
              url = 'api/claims/values',
              p = $http({
                method: 'POST',
                url: base2 + url,
                headers: { 'Content-Type': 'application/json' }
              });
            p.then(function (response) {
              var vType = response.data[0].value,
                vSubType = response.data[1].value,
                vUserType = _.find(constants.typeLogin, function(value, index) {
                  return value.type == vType && value.subType == vSubType;
                }),
                vProfile = {
                  username: response.data[2].value.toUpperCase(),
                  name: response.data[3].value.toUpperCase(),
                  documentType: response.data[18].value.toUpperCase(),
                  typeUser: response.data[0].value, //credentials.userType,
                  userSubType: response.data[1].value,
                  code: vUserType.code, //credentials.code,
                  codagent: response.data[7].value.toUpperCase(),
                  agent: response.data[6].value.toUpperCase(),
                  userprofile: response.data[5].value.toUpperCase()
                };

              function _spreadProfile(profile, data) {
                var userTypeItem = _.find(data, function(value) {
                  return value.groupType === parseInt(profile.userSubType);
                }) || {};
                profile.isAgent = userTypeItem.isAgent;
                return profile;
              }

              getUserTypes()
                .then(function(resUserTypes) {
                  vProfile = _spreadProfile(vProfile, resUserTypes);
                  _set_profile(vProfile);
                  defer.resolve(response);
                });
            },
            function error(response) {
              defer.reject(response);
            }
          );

          return defer.promise;
        }

        function _set_token(token) {
          $window.localStorage[_keyToken] = _keyToken;
        }

        function _set_profile(p) {
          $window.localStorage[_keyProfile] = angular.toJson(p);
        }

        function _get_profile() {
          try {
            var p = $window.localStorage[_keyProfile];
            return angular.fromJson(p);
          } catch (e) {
            _clean_profile();
          }
        }
        this.get_profile = _get_profile;

        function _clean() {
          _clean_profile();
        }

        function _clean_profile() {
          delete $window.localStorage[_keyProfile];
        }
        /*########################
        # setLocalStorage
        ########################*/
        function _setLocalStorage(key, data, withToJson) {
          var vData = withToJson ? angular.toJson(data) : data;
          $window.localStorage[key] = vData;
        }
        function _getLocalStorage(key, withFromJson) {
          var vData = withFromJson ? angular.fromJson($window.localStorage[key]) : $window.localStorage[key];
          return vData;
        }
        function _cleanLocalStorage(arrayKey) {
          angular.forEach(arrayKey, function(value, key) {
            delete $window.localStorage[value];
          });
        }

        function setUserTypes(v) {
          localStorageFactory.setItem(_keyUserTypes, v);
        }

        function _userTypes() {
          return $http({
            method: 'POST',
            url: base2 + 'api/person/GetUsers',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + _getLocalStorage(_keyFirstToken)
            }
          });
        }

        function getUserTypes() {
          var userTypes = localStorageFactory.getItem(_keyUserTypes);
          var defer = $q.defer();

          if (userTypes && userTypes.length) {
            defer.resolve(userTypes);
          } else {
            _userTypes().then(function(response) {
                userTypes = response.data.data || [];
                setUserTypes(userTypes);
                defer.resolve(userTypes);
              }, function(err) {
                defer.reject(err);
              });
          }

          return defer.promise;
        }

        function setXmfa(v) {
          localStorageFactory.setItem('X-MFA', v);
        };

        function getXmfa() {
          return !!parseInt(localStorageFactory.getItem('X-MFA'));
        };

        function removeXmfa() {
          localStorageFactory.removeItem('X-MFA');
        }

        function _getHeadersSignIn() {
          var headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
          };

          var deviceCode = $cookies.get('deviceCode');
          if (!deviceCode) {
            deviceCode = crypto.randomUUID();
            var today = new Date();
            var exp = new Date(today);
            exp.setDate(exp.getDate() + 90);
            $cookies.put('deviceCode', deviceCode.replaceAll('-', ''), { expires: exp });
          }

          var headerMfa = {
            'X-App-Code': constants.ORIGIN_SYSTEMS.oim.mfaCode,
            'X-Device-Code': deviceCode
          };

          return Object.assign(headers, headerMfa);
        }

        function setCredentials(credentials) {
          localStorageFactory.setItem('credentials', credentials);
        }

        function getCredentials() {
          return localStorageFactory.getItem('credentials');
        }

        function removeCredentials() {
          localStorageFactory.removeItem('credentials');
        }

        function _storagesToFma(xmfa, credentials) {
          if (!!parseInt(xmfa)) {
            setXmfa(xmfa);
            setCredentials(credentials);
          } else {
            removeXmfa();
            removeCredentials();
          }
        }

        function getUserTypeSelectedByMfa(userTypes) {
          return  _.find(userTypes, function(userType) { return !!userType.selectedByMfa });
        }

        function signIn(credentials, profile) {
          var data = {
            grant_type: constants.system.authenticate.grant_type,
            userName: credentials.username,
            password: credentials.password,
            client_Id: constants.system.login.client_id,
            scope: 'encrypt',
            systemId: "OIM" // SD05445901_MPAMA-348
          };

          var profileCurrent = _get_profile() || {};

          var defer = $q.defer();
          $auth.signup(undefined, {
            method: 'POST',
            headers: _getHeadersSignIn(),
            data: $httpParamSerializerJQLike(data),
            withCredentials: false
          })
            .success(function(response, status, headers, config) {
              _storagesToFma(headers('X-MFA'), credentials);
              _setLocalStorage(_keyFirstToken, response.access_token);
              delete data.password;
              getUserTypes()
                .then(function(resUserTypes) {
                  var userTypeSelectedByMfa = getUserTypeSelectedByMfa(resUserTypes);
                  response.userTypes = userTypeSelectedByMfa ? [userTypeSelectedByMfa] : resUserTypes;
                  if (response.userTypes.length === 1) {
                    var userConstantByGroupType = _.find(constants.typeLogin, function(ut) { return ut.subType == response.userTypes[0].groupType; });
                    _set_profile(_.assign(profileCurrent, userConstantByGroupType, response.userTypes[0]));
                  }
                  defer.resolve(response);
                }, function(errUserTyes) {
                  defer.reject(errUserTyes);
                });
            })
            .error(function(response) {
              defer.reject(response);
            });

          if (profile) _set_profile(_.assign(profileCurrent, profile));

          return defer.promise;
        }

        this.setUserTypes = setUserTypes;
        this.getUserTypes = getUserTypes;
        this.setXmfa = setXmfa;
        this.getXmfa = getXmfa;
        this.signIn = signIn;
        this.setCredentials = setCredentials;
        this.getCredentials = getCredentials;
        this.removeCredentials = removeCredentials;

          function _parseLoginPromise($promise) {
            var defer = $q.defer();

            $promise.then(function(response) {
              if (response.access_token) {
                response.data = response;
              }

              if (response.data) {
                $auth.setToken(response.data.access_token || response.data.token);
                originSystemFactory.setOriginSystem(response.data);
                response.data.origin && _setLocalStorage(_keyOriginApp, response.data.origin);
              }

              _getProfile().then(function(profileRes) {
                _cleanLocalStorage([_keyFirstToken, _keyUserTypes]);
                response.claims = profileRes.data;
                defer.resolve(response);
              }).catch(function(profileErr) {
                defer.reject(profileErr);
              });
            }).catch(function(err) {
              defer.reject(err);
            });

            return defer.promise;
          }

          this.finalSignIn = function(subType) {
            var $promise = $auth.login(undefined, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + _getLocalStorage(_keyFirstToken)
                  },
                  data: $httpParamSerializerJQLike({ GroupTypeId: subType, IsEncrypt: true  }),
                  withCredentials: false
                });

            return _parseLoginPromise($promise);
          };

          this.loginShortToken = function(shortToken) {
            var $promise = proxyRedirect.TransformTokenDummy({
              tokenDummy: shortToken,
              connectionIdentifier: ''
            });

            return _parseLoginPromise($promise);
          };

          this.loginRsa = function(rsaToken) {
            var $promise = proxyLoginRsa.Login({ token: rsaToken });

            return _parseLoginPromise($promise);
        };

        function _getParamUrl(){
          var vUrl = null;
          if (location.search) {
            var params = location.search
                          .split("&")[0]
                          .replace("?", "")
                          .split("=");
            if (params[0] == 'url') vUrl = params[1];
          }
          return vUrl;
        }

        this.redirect = function(resFinalSignIn) {
          gaService.add({
            gaCategory: '{{g.site}} - Login',
            gaAction: 'MPF - Iniciar Sesión',
            gaLabel: 'Ingresó',
            gaDimensions: 'typeUser:{{g.userType}}'
          });
          setTimeout(function() {
            var LOGIN_TYPE = constants.typeLogin;
            var url = _getParamUrl();
            var subType = _.find(resFinalSignIn.claims, function(c) { return c.type == "UserSubType"; });
            var urlRedirect = _.find(resFinalSignIn.claims, function(c) { return c.type == "UrlRedirect"; });
            var isRedirect = false;

            // INFO: Ingresa a OIM desde otros sistemas
            if (resFinalSignIn.data && resFinalSignIn.data.urlRedirection) {
              url = resFinalSignIn.data.urlRedirection;
            // INFO: Redirecciona a Autoservicio: clientePersona y ClienteEmpresa
            } else if (urlRedirect && urlRedirect.value && (parseInt(subType.value) !== LOGIN_TYPE.broker.subType && parseInt(subType.value) !== LOGIN_TYPE.proveedor.subType)) {
              isRedirect = true;
              url = urlRedirect.value + $auth.getToken();

            // INFO: Redirecciona a MyDream: EjecutivoAgente y Broker
            } else if ((resFinalSignIn.userOptions.isAgent || parseInt(subType.value) === LOGIN_TYPE.broker.subType) && !(resFinalSignIn.userOptions.isActiveMarch && !resFinalSignIn.userOptions.isUserMarch)) {

              isRedirect = true;
              url = constants.originApps.urlHomeMYD + 'login?tokenOIM=' + $auth.getToken();

              proxyHome.GetAccessProfile("MYDREAM", false).then(console.log)
              .catch(function(error) {
                if (error.data.data.message === "El usuario no tiene un perfil configurado para el aplicativo de MYDREAM") {
                  isRedirect = false;
                  url = '/';
                  _redirect(url, isRedirect);
                }
              })
              .finally(function(error) {
                if (!resFinalSignIn.userOptions.isAgent) {
                  mModalConfirm.confirmDanger(constants.originApps.txtUssagePoliciesMYD, '¿Aceptas las políticas de uso de OIM?')
                    .then(function() {
                      _redirect(url, isRedirect);
                    })
                    .catch(function() {
                      _redirect('/login', isRedirect);
                    });

                  return void 0;
                } else if ((resFinalSignIn.userOptions.isAgent && parseInt(subType.value) === LOGIN_TYPE.proveedor.subType) ){
                  isRedirect = false;
                  url = '/';
                }
                _redirect(url, isRedirect);
              })

              return void 0;
            }

            function _redirect(url, isRedirect) {
              isRedirect = isRedirect || false;

              if (isRedirect) {
                $this.signOut(true).then(function() {
                  window.location.href = url;
                });
              } else {
                if (url && url !== '' && url !== '/') {
                  var isSITECLI = url.search('SITECLI');
                  if (isSITECLI === -1) {
                    url = decodeURIComponent(url);
                  }
                  window.location.href = url;
                } else {
                  window.location.href = '/';
                }
              }
            }

            _redirect(url, isRedirect);
          }, 500);
        };

        this.cleanProfile = function() {
          _clean_profile();
          _cleanLocalStorage([_keyFirstToken, _keyUserTypes]);
        };

        this.signOut = function(noCerrarSession) {
          const opcMenu = localStorage.getItem('currentBreadcrumb');
          var $logout = (noCerrarSession)
            ? $auth.logout()
            :
              httpData.post(
                constants.system.api.endpoints.security + 'api/seguridad/acceso/logout?COD_OBJETO=logout&OPC_MENU='+ opcMenu,
                undefined, undefined, true)
                .then(function() {
                  return $auth.logout();
                });
          mpSpin.start();

          var deferred = $q.defer();

          $logout
            .then(function() {
              $rootScope.$broadcast('deleteKeyCGW');
              $window.sessionStorage.clear();
              deferred.resolve(true);
              mpSpin.end();
            })
            .catch(function() {
              deferred.reject(false);
              mpSpin.end();
            });

          return deferred.promise;
        };


        this.isAuthenticated = function() {
          return $auth.isAuthenticated();
        };

        this.goLoginPage = function(incluedeurl) {
          _cleanLocalStorage([_keyFirstToken, _keyUserTypes]);
          $window.sessionStorage.removeItem(constants.sessionKeys.modalHome);
          if (incluedeurl) {
            var url = encodeURIComponent(window.location.pathname + window.location.hash)
            window.location.href = '/login?url=' + url;
          } else {
            var originSystem = originSystemFactory.getOriginSystem();
            window.location.href = !originSystem || originSystem.code === constants.ORIGIN_SYSTEMS.oim.code
              ? '/login'
              : originSystem.logout + constants.ORIGIN_SYSTEMS.oim.code;
          }
        };

        this.isRecurrent = function() {
          var p = this.get_profile();

          return p !== '' && p != null && p != undefined && p.username && (p.documentType || p.typeUser == 1);
        };

        this.isMyDreamAppOrigin = function() {
          return $location.search()['origin'] === constants.originApps.myDream;
        };

        this.myDreamAppData = function() {
          return $location.search();
        };

        this.goHome = function() {
          var originSystem = originSystemFactory.getOriginSystem();
          if (originSystem && originSystem.code === constants.ORIGIN_SYSTEMS.oim.code) {
            window.location.href = originSystem.home;
          } else {
            (originSystem) ? $this.goOtherSystemPage(originSystem.home) : window.location.href = "/login";
          }
        }

        this.goOtherSystemPage = function(url) {
          $this.signOut(true).then(function() {
            $window.localStorage.clear();
            window.location.href = url;
          });
        }

        var $this = this;
        this.$get = [
          function() {
            return $this;
          }
        ];
      }
    ]);
});
