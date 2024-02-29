(function($root, deps, action){
  define(deps, action)
})(this, ['angular'],
  function(angular){

    var appSecurity = angular.module('appSecurity');

    appSecurity.controller('menuSecurityController',
      ['$scope'
      , '$state'
      , 'seguridadFactory'
      , '$location'
      , '$window'
      , function($scope
        , $state
        , seguridadFactory
        , $location
        , $window){
          var vm = this;
          vm.$onInit = function() {

              var profile = seguridadFactory.getVarLS('profile');
              vm.evoProfile = seguridadFactory.getVarLS('evoProfile')

              function capitalizeStr(str){
                return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
              }
              vm.userDisma = (profile.typeUser == 1) ? true : false;

              vm.evoSubMenuSeg = seguridadFactory.getVarLS('evoSubMenuSEGURIDAD');
              if(!angular.isUndefined(vm.evoSubMenuSeg)){
                vm.menuSeguridad = []
                var arrEl = vm.evoSubMenuSeg[0].items
                for(var i=0; i<arrEl.length; i++){
                  var name = capitalizeStr(arrEl[i].nombreLargo);
                    var el = {
                      label: name
                      , objMXKey: arrEl[i].ordenObjMx
                      , state: (arrEl[i].nombreLargo.toLowerCase() == "general") ? 'dashboard' : arrEl[i].nombreLargo.toLowerCase()
                      , isSubMenu: false
                      , actived: false
                      , show: true
                    }
                    if(name == "General" && profile.typeUser == 3){ //ocultar menu general para usuario brokers
                      continue;
                    }
                    vm.menuSeguridad.push(el)
                }
                if($location.path() == "/dashboard"){
                  vm.evoSubMenuSeg[0].items[0].nombreCorto == "USUARIOS"? $window.location.href = '#/secciones/usuarios' : '';
                }
                
              } // end if
              vm.userDisma = (profile.typeUser == 1) ? true : false
              // if(profile.typeUser == 1){
              //   vm.userDisma = true;
              //   vm.menuSeguridad = [
              //     {label: 'General', objMXKey: '', state: 'dashboard', isSubMenu: false, actived: false, show: true},
              //     {label: 'Usuarios', objMXKey: '', state: 'usuarios', isSubMenu: false, actived: false, show: true},
              //     {label: 'Roles', objMXKey: '', state: 'roles', isSubMenu: false, actived: false, show: true},
              //     {label: 'Aplicaciones', objMXKey: '', state: 'aplicaciones', isSubMenu: false, actived: false, show: true},
              //     {label: 'Configuraciones', objMXKey: '', state: 'configuraciones', isSubMenu: false, actived: false, show: true}
              //   ];
              // }else{
              //   vm.userDisma = false;
              //   vm.menuSeguridad = [
              //     {label: 'General', objMXKey: '', state: 'dashboard', isSubMenu: false, actived: false, show: true},
              //     {label: 'Usuarios', objMXKey: '', state: 'usuarios', isSubMenu: false, actived: false, show: true}
              //   ];
              // }
              

              if (vm.menuSeguridad.length < 7) {
                vm.showMoreFlag = false;
                vm.limiteMenus = 6;
              } else {
                vm.showMoreFlag = true;
                vm.limiteMenus = 5;
              }

              searchCurrentActive();
          };

          function searchCurrentActive(){
            
           var variable = _.map(vm.menuSeguridad, function(menu) {
              menu.actived = menu.state === $state.current.activeMenu;
              return menu;
            });

          };

        }])
      .component('menuSecurity', {
        templateUrl: '/security/app/common/menu/menu.html',
        controller: 'menuSecurityController',
        controllerAs: '$ctrl',
        bindings: {
        }
      })
  });
