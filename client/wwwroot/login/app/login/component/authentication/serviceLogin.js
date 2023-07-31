define([
    'angular',
    "helper",
    "constants",
    'system'
], function(angular,
    helper,
    constants,
    system) {

    var appLogin = angular.module('appLogin');

    appLogin.service("serviceLogin",
    ['loginFactory', '$http', '$location', 'mapfreAuthetication', 'mpSpin', '$state', 'serviceAlert', 'mModalAlert',
    '$window',
    'mModalConfirm',
    'accessSupplier',
    function(
      loginFactory,
      $httpProvider,
      $location,
      mapfreAuthetication,
      mpSpin,
      $state,
      serviceAlert,
      mModalAlert,
      $window,
      mModalConfirm,
      accessSupplier
    ) {
      var __extends = helper.__extend();

      var AuthBase = (function() {
        var $this;

        function AuthBase(_$scope, _$controller) {
          serviceAlert.set$scope(_$scope);

          this.$scope = _$scope;

          this.$controller = _$controller;

          $this = this;
        }
        AuthBase.prototype.get_scope = function() {
          return this.$scope;
        };
        AuthBase.prototype.get_controller = function() {
          return this.$controller;
        };
        AuthBase.prototype.init = function() {
          this.$scope.typeName = this.get_info().name;
          this.show();
        };
        AuthBase.prototype.set_info = function(value) {
          $this._info = value;
        };
        AuthBase.prototype.get_info = function() {
          return undefined;
        };
        AuthBase.prototype.setValueRecurrent = function() {
          var profile = mapfreAuthetication.get_profile();

          $this.$scope.shortName = !profile.name ? profile.username : profile.name;

          $this.$controller.credentials.username = profile.username;
        };
        AuthBase.prototype.show = function() {
          $this.$controller.isRecurrente = mapfreAuthetication.isRecurrent() && !$this.$controller.tryCancelRecurrent;
          $this.$controller.showMessage = false;
          if ($this.$controller.isRecurrente) $this.setValueRecurrent();


          $this.$controller.type = $this.get_info().code;

          $this.$controller.showContactPhone = false;

          $this.$controller.usernameRequired == true;
        };
        function _getParamUrl() {
          var vUrl = null;
          if (location.search !== '') {
            var params = location.search
              .split('&')[0]
              .replace('?', '')
              .split('=');
            if (params[0] == 'url') vUrl = params[1];
          }
          return vUrl;
        }
        AuthBase.prototype.signIn = function() {
          function isLocalStorageNameSupported() {
            var testKey = 'test',
              storage = window.localStorage;
            try {
              storage.setItem(testKey, '1');
              storage.removeItem(testKey);
              return true;
            } catch (error) {
              return false;
            }
          }
          mpSpin.start('Estamos verificando sus credenciales...');

          var credentials = this.get_credentials(),
            promise = mapfreAuthetication.signIn(credentials, { username: credentials.username });

          promise.then(
            function(response) {
              mpSpin.end();

              var vUrl = _getParamUrl();
              var loginHref= vUrl ? '/login?url=' + vUrl : '/login';
              var xMfa = !!parseInt(response.headers('X-MFA'));

              if (xMfa) {
                window.location.href = loginHref + $state.href('authVerify');
              } else {
                if (response.userTypes.length > 1) {
                  window.location.href = loginHref + $state.href('authoButtons');
                } else {
                  $this.finalSignIn(response.userTypes[0]);
                }
              }
            },
            function(response) {
              mpSpin.end();
              if (response && response.status == 401) {
                if (!isLocalStorageNameSupported()) {
                  mModalAlert.showError(
                    'Este browser se encuentra en modo privado, no soportado por el sistema OIM',
                    'Modo Incognito'
                  );
                  return;
                }
              }
              $this.$controller.showMessage = true;
              $this.$controller.messageError = response.error;
            }
          );
        };

        AuthBase.prototype.finalSignIn = function(user){
          mpSpin.start();
          mapfreAuthetication.finalSignIn(user.groupType).then(function(response){
            response.userOptions = {
              isActiveMarch: user.isActiveMarch,
              isUserMarch: user.isUserMarch,
              isAgent: user.isAgent
            }
            mapfreAuthetication.redirect(response);
            mpSpin.end();
          }).catch(function() {
            mpSpin.end();
          });
        };

        AuthBase.prototype.get_credentials = function() {
          var _credentials = $this.$controller.credentials;
          return {
            username: _credentials.username,
            password: _credentials.password
          };
        };

        AuthBase.prototype.getTokenTransform = function(params) {
          $this.finalSignIn({groupType: params.user_type}, params);
        };

        AuthBase.prototype.validateUserSignInForMyDream = function(user) {
          function _redirectAgent() {
            window.location.href = constants.originApps.urlHomeMYD + 'login?tokenOIM=' + $window.localStorage['jwtFirstToken'];
          }

          function _redirectBroker() {
            mModalConfirm.confirmDanger(constants.originApps.txtUssagePoliciesMYD, '¿Aceptas las políticas de uso de OIM?')
              .then(function(res) {
                window.location.href = constants.originApps.urlHomeMYD + 'login?tokenOIM=' + $window.localStorage['jwtFirstToken'];
              })
              .catch(function(err) {
                mapfreAuthetication.signOut().then(function() {
                  accessSupplier.clean();
                  mapfreAuthetication.cleanProfile();
                  $state.go('login');
                });
                var unSingup = false;

                if (UrlRedirect && UrlRedirect.value && (subType !== 3 && subType !== 4) && !claimsSelfService.value) {
                    url = UrlRedirect.value;
                    unSingup = true
                } else if (UrlRedirect && claimsSelfService && claimsSelfService.value === 'True') {
                  url = UrlRedirect.value + response.data.access_token;
                  unSingup = true
                }

                if (url && url != "" && url != "/") {
                    var isSITECLI = url.search('SITECLI');
                    if(isSITECLI == -1)
                        url = decodeURIComponent(url);
                  if (unSingup) {
                    // mapfreAuthetication.signOut().then(function() {
                    window.location.href = url;
                    // });
                  } else {
                    var REGEX_SYSTEM_APP = /\/([^\/]*)\/#/i;
                    var urlMatch = url.match(REGEX_SYSTEM_APP);
                    var systemApp = urlMatch ? system.apps[urlMatch[1]] : null;
                    if (systemApp) window.localStorage['CodigoAplicacion'] = systemApp.code;
                    window.location.href = url;
                  }
                } else {
                  window.location.href = "/";
                }
              }, function(response) {
                mpSpin.end();
              });
          }

          var usersType = {
            agent: {
              action: _redirectAgent,
              hasEnableTrialPeriod: user.isActiveMarch && user.isUserMarch,
              isValidUser: user.isAgent,
            },
            broker: {
              action: _redirectBroker,
              hasEnableTrialPeriod: user.isActiveMarch && user.isUserMarch,
              isValidUser: user.groupType === constants.typeLogin.broker.subType,
            }
          }

          var currentUser = _.findKey(usersType, 'isValidUser');

          return usersType[currentUser] || {};
        }

        return AuthBase;
      })();

      var AuthProvider = (function(_super) {
        __extends(AuthProvider, _super);

        function AuthProvider(_$scope, _$controller) {
          _super.call(this, _$scope, _$controller);
          this.$scope.provider = helper.objectToArray(constants.documentTypes);

          this.$scope.evvv = function() {
            /*if ($this.$scope.test.Codigo)
						alert($this.$scope.test.Codigo);*/
          };
        }

        AuthProvider.prototype.get_info = function() {
          if (!this._info)
            return {
              code: constants.typeLogin.proveedor.code,
              subType: constants.typeLogin.proveedor.subType,
              type: constants.typeLogin.proveedor.type,
              name: constants.typeLogin.proveedor.name,
              description: constants.typeLogin.proveedor.description
            };
          else return this._info;
        };
        AuthProvider.prototype.get_credentials = function() {
          var _credentials = this.$controller.credentials;
          var credentials = _super.prototype.get_credentials.call();
          credentials.username = _credentials.documentNumber;
          return credentials;
        };
        AuthProvider.prototype.setValueRecurrent = function() {
          _super.prototype.setValueRecurrent();

          var profile = mapfreAuthetication.get_profile();

          this.$controller.credentials.documentType = { Codigo: profile.documentType };

          this.$controller.credentials.documentNumber = profile.username;
        };
        AuthProvider.prototype.show = function() {
          var $_scope = this.get_scope();

          $_scope.isByUsername = false;

          _super.prototype.show.call();

          this.$controller.showContactPhone = true;

          this.$controller.usernameRequired == true;
        };
        return AuthProvider;
      })(AuthBase);

      var AuthCustomer = (function(_super) {
        __extends(AuthCustomer, _super);

        function AuthCustomer(_$scope, _$controller) {
          _super.call(this, _$scope, _$controller);
        }
        AuthCustomer.prototype.get_info = function() {
          return {
            code: constants.typeLogin.cliente.code,
            name: constants.typeLogin.cliente.name,
            description: constants.typeLogin.cliente.description,
            subType: constants.typeLogin.cliente.subType,
            type: constants.typeLogin.cliente.type
          };
        };
        return AuthCustomer;
      })(AuthProvider);

      var AuthExecutive = (function(_super) {
        __extends(AuthExecutive, _super);

        function AuthExecutive(_$scope, _$controller) {
          _super.call(this, _$scope, _$controller);
        }
        AuthExecutive.prototype.show = function() {
          var $_scope = this.$scope;

          $_scope.isByUsername = true;

          _super.prototype.show.call();
        };
        AuthExecutive.prototype.get_info = function() {
          return {
            code: constants.typeLogin.ejecutivo.code,
            name: constants.typeLogin.ejecutivo.name,
            description: constants.typeLogin.ejecutivo.description,
            subType: constants.typeLogin.ejecutivo.subType,
            type: constants.typeLogin.ejecutivo.type
          };
        };
        return AuthExecutive;
      })(AuthBase);

      var AuthInit = (function(_super) {
        __extends(AuthInit, _super);

        function AuthInit(_$scope, _$controller) {
          _super.call(this, _$scope, _$controller);
        }
        AuthInit.prototype.show = function() {
          var $_scope = this.$scope;

          $_scope.isByUsername = true;

          _super.prototype.show.call();
        };
        AuthInit.prototype.get_info = function() {
          return {
            code: 0,
            name: '',
            description: '',
            subType: null,
            type: null
          };
        };
        return AuthInit;
      })(AuthBase);

      var listAuth = [
        {
          id: 0,
          _class: function($scope, $controller) {
            return new AuthInit($scope, $controller);
          }
        },
        {
          id: constants.typeLogin.cliente.code,
          _class: function($scope, $controller) {
            return new AuthCustomer($scope, $controller);
          }
        },
        {
          id: constants.typeLogin.ejecutivo.code,
          _class: function($scope, $controller) {
            return new AuthExecutive($scope, $controller);
          }
        },
        {
          id: constants.typeLogin.proveedor.code,
          _class: function($scope, $controller) {
            return new AuthProvider($scope, $controller);
          }
        },
        {
          id: constants.typeLogin.broker.code,
          _class: function($scope, $controller) {
            var atho = new AuthProvider($scope, $controller);
            atho.set_info({
              code: constants.typeLogin.broker.code,
              name: constants.typeLogin.broker.name,
              description: constants.typeLogin.broker.description,
              subType: constants.typeLogin.broker.subType,
              type: constants.typeLogin.broker.type
            });
            return atho;
          }
        },
        {
          id: constants.typeLogin.empresa.code,
          _class: function($scope, $controller) {
            var atho = new AuthProvider($scope, $controller);
            atho.set_info({
              code: constants.typeLogin.empresa.code,
              name: constants.typeLogin.empresa.name,
              description: constants.typeLogin.empresa.description,
              subType: constants.typeLogin.empresa.subType,
              type: constants.typeLogin.empresa.type
            });
            return atho;
          }
        }
      ];

      this.resolve = function(type, $scope, $controller) {
        if (!type && mapfreAuthetication.isRecurrent() && !$controller.tryCancelRecurrent) {
          type = parseInt(mapfreAuthetication.get_profile().code);
        }
        for (var index = 0; index < listAuth.length; index++) {
          var element = listAuth[index];
          if (element.id === type) return element._class($scope, $controller);
        }
      };
    }
  ]);
});
