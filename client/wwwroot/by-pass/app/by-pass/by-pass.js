(function ($root, deps, action) {
  define(deps, action)
})(this, [
  'angular', 'system', 'lodash', 'constants'
], function(angular, system, _, constants) {

  ByPassController.$inject = ['$scope', '$stateParams', 'mpSpin', 'mapfreAuthetication', 'originSystemFactory', 'proxyClaims', 'localStorageFactory'];

  function ByPassController($scope, $stateParams, mpSpin, mapfreAuthetication, originSystemFactory, proxyClaims, localStorageFactory) {
    (function onLoad() {
      mpSpin.start('Estamos verificando sus credenciales...');

      var isLoginRsa = !!($stateParams.token && $stateParams.app);
      var loginMethod = isLoginRsa ? 'loginRsa' : 'loginShortToken';

      mapfreAuthetication[loginMethod]($stateParams.token)
        .then(function (response) {
          originSystemFactory.setOriginSystemConfig('Cargando...');

          if (isLoginRsa) {
            var newOIMApp = _.find(system.apps, function(app) {
              return app.code && app.code === $stateParams.app;
            });

            if (newOIMApp) {
              window.location.href = newOIMApp.location + '/#/' + ($stateParams.url || '');
            } else {
              proxyClaims.GenerateTokenMapfre()
                .then(function(tokenMapfreRes) {
                  var profile = localStorageFactory.getItem('profile', false);
                  var urlBase = constants.environment === 'PROD'
                    ? constants.system.api.urlBase
                    : 'http://SPE001001-336/';
                  var href = (urlBase + $stateParams.app + '/DEFAULT.ASPX?query={tokenMapfre}&User=' + profile.username + '&GRP_APL=' + profile.userSubType).replace('{tokenMapfre}', tokenMapfreRes);

                  window.location.href = href;
                });
            }
          } else {
            mapfreAuthetication.redirect(response);
          }
        }).catch(function () {
          mapfreAuthetication.goLoginPage();
          mpSpin.end();
        });
    })();
  }

  angular
    .module('appByPass')
    .controller('byPassController', ByPassController);
});
