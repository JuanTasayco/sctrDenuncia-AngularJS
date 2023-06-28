define([
	'angular'
], function(ng) {

	MenuController.$inject = [
		'$rootScope'
	, '$scope'
	, '$state'
  , 'gcwFactory'
  , 'oimAbstractFactory'];

	function MenuController(
		$rootScope
		, $scope
		, $state
    , gcwFactory
    , oimAbstractFactory) {

		 (function onLoad(){
				$scope.formData = $rootScope.formData || {};
		 })();

			$scope.$watch('formData', function(nv)
			{
				$rootScope.formData =  nv;
			})

		var vm = this;

		$scope.$on('$stateChangeStart', function(e, to, toParam, from, fromParam) {
			if(to.url === "/comisiones/ganadas"){

				const subItem = Object.assign({},$scope.menuConsultaGestion.find(function(menu) {
					return 'COMISIONES' === menu.label;
				}).menu.find(function(submenu) {
					return 3 === submenu.codigoObj;
				}))

				subItem.state = null;
				$scope.go(subItem)
			}
		})
		
		vm.menuOpen = false;

		vm.listMenu = $scope.formData.listMenu;
		$rootScope.menuGCW = vm.listMenu

		 if(angular.isUndefined(vm.listMenu)){
			$state.go('homeGcw'); // Redireccionamiento
		 }else{

			//Eliminar temporalmente SINIESTROS del menu
			var pos = gcwFactory.getIndexActionsMenu();
			if(pos != -1) vm.listMenu.splice(pos, 1);
			var lengthMenu = gcwFactory.isVisibleNetwork() ? vm.listMenu.length - 1 : vm.listMenu.length;
			$scope.menuConsultaGestion = [];
			for(var i=0; i<lengthMenu; i++){

				var item = {
					label: vm.listMenu[i].title,
					isSubMenu: (vm.listMenu[i].content.length>0) ? true : false,//false,
					actived: vm.listMenu[i].open
				};
				if(vm.listMenu[i].content.length>0){
					item.menu = [];
					ng.forEach(vm.listMenu[i].content, function(value){
						if(value.label !== 'POLIZAS PDF' &&
						value.label !== 'ESTADO MD' &&
						value.label !== 'LISTA DE RENOVACIONES' &&
						value.label !== 'FINANCIADOR'){
							var subItem = {
								label: value.label
								, actived: false
								, state: value.state
								, codigoObj: value.codigoObj
							};
							item.menu.push(subItem);
						}

					})
				}

				$scope.menuConsultaGestion.push(item);
			}

			if ($scope.menuConsultaGestion.length < 7 ) {
				$scope.showMoreFlag = false;
				$scope.limiteMenus = 6;
			} else {
				$scope.showMoreFlag = true;
				$scope.limiteMenus = 5;
			}
		 } //end else

		 $scope.go = function(subItem){
			 localStorage.setItem( "codObjeto", subItem.codigoObj);
			 
			for(var i=0; i<lengthMenu; i++){
				var submenuLength = $scope.menuConsultaGestion[i].menu.length;
				for(var j=0; j<submenuLength; j++){
					if($scope.menuConsultaGestion[i].menu[j].label == subItem.label){
						$scope.menuConsultaGestion[i].actived = true;
						$scope.menuConsultaGestion[i].open = true;

						$scope.menuConsultaGestion[i].menu[j].actived = true;
						$scope.menuConsultaGestion[i].menu[j].open = true;
						$scope.label = $scope.menuConsultaGestion[i].label;
						//break;
					}else if($scope.label != $scope.menuConsultaGestion[i].label){
						$scope.menuConsultaGestion[i].actived = false;
						$scope.menuConsultaGestion[i].open = false;

						$scope.menuConsultaGestion[i].menu[j].actived = false;
						$scope.menuConsultaGestion[i].menu[j].open = false;
					}else{
						$scope.menuConsultaGestion[i].menu[j].actived = false;
						$scope.menuConsultaGestion[i].menu[j].open = false;
					}
				}
			}

			for(var k=0; k<lengthMenu; k++) {
				if($scope.label !== $scope.menuConsultaGestion[k].label){
					$scope.menuConsultaGestion[k].actived = false;
					$scope.menuConsultaGestion[k].open = false;
				}
			}
			if (subItem.state != undefined) {
				switch(subItem.codigoObj){
					case 31: //Siniestros - Auto de Reemplazo
						$state.go('consulta.33', {reload: false, inherit: false});
						break;
					case 30: // Beneficios - Listado de Beneficios
						$state.go('consulta.29', {reload: false, inherit: false});
						break;
					case 39: // Comprobante remitido
						$state.go('consulta.40', {reload: false, inherit: false});
						break;
					case 25: // Estado recibos
						$state.go('consulta.24', {reload: false, inherit: false});
						break;
					default:
						$state.go(subItem.state, {reload: false, inherit: false});
				}
			}
		 }

	} // end controller

	return ng.module('appGcw')
		.controller('MenuController', MenuController)
		.component('gcwMenu', {
			templateUrl: '/gcw/app/common/menu/menu.html',
			controller: 'MenuController',
			bindings: {
			}
		})
});
