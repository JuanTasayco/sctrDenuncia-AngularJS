(function ($root, deps, action) {
    define(deps, action);
  })(this, ['angular', 'constants', 'lodash', 'system'], function (angular, constants, _, system) {
    angular
      .module('sepelio.security', [])
  
      .factory('sepelioAuthorize', [
        '$window',
        'proxyMenu',
        '$q',
        'mpSpin',
        function ($window, proxyMenu, $q, mpSpin) {
          var LOCAL_STORE = $window['localStorage'],
            KEY_SUB_MENU = 'EMISA-CAMPOSANTO',
            KEY_HOME_MENU = 'EMISA-CAMPOSANTO';
  
          var menuObject;
          
          function _setHomeMenu(data) {
            LOCAL_STORE[KEY_HOME_MENU] = angular.toJson(data);
          }
          function isAuthorized(toState) {
            mpSpin.start();
            var homeMenu = angular.fromJson(LOCAL_STORE[KEY_HOME_MENU]) || [];
  
            if (!homeMenu.length) {
              proxyMenu
                .GetSubMenu('EMISA-CAMPOSANTO', true)
                .then(function (response) {
                  _setHomeMenu(data);//response.data
                  menuObject = data;//response.data
                })
                .catch(function (error) {
                  menuObject = [];
                });
            } else {
              menuObject = homeMenu;
            }
            var itemObj = _.filter(homeMenu, function (element) {
              return element.nombreCabecera == toState;
            });
            mpSpin.end();
            if (!itemObj.length) {
              return false;
            } else {
              return true;
            }
          }
          function menuItem(toState, itemName){          
            var homeMenu = angular.fromJson(LOCAL_STORE[KEY_HOME_MENU]) || [];          
            var itemObj = _.find(homeMenu, function (element) {
               return element.nombreCabecera == toState;
            }); 
            var items = (itemObj) ? itemObj.items : [];         
            var item = _.find(items, function (i) {
              if (i.nombreCorto) {
                return i.nombreCorto == itemName;
              }          
            });
            return (item && item.codigoObj) ? true : false
          }
  
          return {
            isAuthorized: isAuthorized,
            menuItem: menuItem,
            setHomeMenu: _setHomeMenu
          };
        },
      ]);
  });
  