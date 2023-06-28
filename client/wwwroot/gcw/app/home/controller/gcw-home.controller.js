define([
  'angular', 'constants',
  '/gcw/app/factory/gcwFactory.js',
  '/scripts/mpf-main-controls/components/modalSucursal/component/modalSucursal.js'
], function(ng, constants) {

  GcwHomeController.$inject = ['$scope', '$uibModal', '$window', '$rootScope', 'authorizedResource', '$state', 'gcwFactory', 'oimClaims', '$timeout', 'mModalAlert'];

  function GcwHomeController($scope, $uibModal, $window, $rootScope, authorizedResource, $state, gcwFactory, oimClaims, $timeout, mModalAlert) {

    (function onLoad(){

      $timeout(function() {
        $scope.formData = $rootScope.formData || {};
        var accessSubMenu = authorizedResource.accessSubMenu;
        var listMenu = [];
        var opened = false;
        $scope.findFirstPage = false;

        var lengthAccessMenu = accessSubMenu.length;

        for(var i=0; i<lengthAccessMenu; i++){
          if(accessSubMenu[i].nombreCabecera == 'CARTERA'){
            opened = true;
            localStorage.setItem( "codObjeto", accessSubMenu[i].items[0].codigoObj);
          }
          else{
            opened = false;
          }

          var item = { //items de menu
            title: accessSubMenu[i].nombreCabecera,
            open: opened,
            content: []
          }

          var lengthAccessSubMenu = accessSubMenu[i].items.length;

          var content = '';
          for (var j = 0; j < lengthAccessSubMenu; j++) {

            content =
              {
                label: accessSubMenu[i].items[j].nombreCorto, 
                state: 'consulta.'+accessSubMenu[i].items[j].codigoObj, 
                codigoObj: accessSubMenu[i].items[j].codigoObj
              };
            item.content.push(content);

            if(accessSubMenu[i].nombreCabecera == 'CARTERA' && opened){
              $scope.firtPage = i;
              $scope.findFirstPage = true;
            }else if(!$scope.findFirstPage){
              $scope.firtPage = i;
            }
          }
          listMenu.push(item);
        }

        $scope.formData.listMenu = listMenu;

        if($scope.formData.listMenu.length>0){
          try{
            $state.go(listMenu[$scope.firtPage].content[0].state, {reload: true, inherit: false});
          }catch(err){
            if(listMenu[$scope.firtPage].content.length >= 1){
              var itemMenu = listMenu[$scope.firtPage].content[1];
              var pageToLoad = itemMenu ? itemMenu.state : listMenu[1].content[0].state;
              
              $state.go(pageToLoad, {reload: true, inherit: false});
              
            } else{
              mModalAlert.showError("No tiene acceso al módulo de Consultas de Gestión", "Error", "", "", "", "g-myd-modal").then(function(response){
                window.location.href = '/';
              }, function(error){
                window.location.href = '/';
              });
            }
          }
        }else{
          mModalAlert.showError("No tiene acceso al módulo de Consultas de Gestión", "Error", "", "", "", "g-myd-modal").then(function(response){
            window.location.href = '/';
          }, function(error){
            window.location.href = '/';
          });
        }
      }, 500);
    })();

     $scope.$watch('formData', function(nv)
      {
        $rootScope.formData =  nv;
      })

  } //  end controller

  return ng.module('appGcw')
    .controller('GcwHomeController', GcwHomeController);
});
