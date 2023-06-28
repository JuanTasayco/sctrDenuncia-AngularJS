// TODO: remover cuando la redireccion entre oim - my-dream se termine
function myd() {
  var element = document.getElementsByTagName('body')[0];
  element.classList.toggle("app-my-dream");

  // TODO: actualizar url con OIM de prod

  if (element.className === 'app-my-dream') {
    document.querySelector("link[rel*='icon']").href = "favicon-myd.ico" ;
    window.document.title = 'MyDream';
  } else {
    document.querySelector("link[rel*='icon']").href = "256x256.png";
    window.document.title = 'OIM';
  }
}

(function($root, deps, factory) {
    define(deps, factory)
})(this, ['angular'], function(angular) {
    var oim_layout = angular.module('oim.layout', ['oim.security.authentication', 'oim.authorization.proxy', 'oim.security.authorization', 'oim.home.templates', 'origin.system'])

    oim_layout.run(['$state', 'mapfreAuthetication', 'authoObjectsProxy', '$rootScope', function($state, mapfreAuthetication, authoObjectsProxy, $rootScope) {
    }])
})
