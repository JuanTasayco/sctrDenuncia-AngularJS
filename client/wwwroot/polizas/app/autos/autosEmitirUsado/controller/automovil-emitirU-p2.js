(function($root, deps, action){
	define(deps, action)
})(this,
	['angular', 'constants', '/polizas/app/autos/autosEmitirUsado/service/usedCarEmitFactory.js',
	'/polizas/app/autos/autosEmitirUsado/component/groupPolize/groupPolize.js'],
	function(angular, constants){
	angular.module("appAutos").controller('usedCarEmitS2',
		['$scope', 'usedCarEmitFactory', '$state', 'mpSpin', 'carColors', 'carProducts', 'mModalAlert', 'carNewProducts', 'oimPrincipal', 'mainServices',
		function($scope, usedCarEmitFactory, $state, mpSpin, carColors, carProducts, mModalAlert, carNewProducts, oimPrincipal, mainServices){
			var vm = this;

			(function onLoad(){
			mpSpin.end()
	      $scope.mainStep = $scope.mainStep || {};
	      $scope.firstStep = $scope.firstStep || {};
	      $scope.secondStep = $scope.secondStep || {};
	      $scope.thirdStep = $scope.thirdStep || {};
	      $scope.fourthStep = $scope.fourthStep || {};
	      $scope.fiveStep = $scope.fiveStep || {};
			$scope.summaryStep = $scope.summaryStep || {};


        if(typeof $scope.firstStep.dataInspection !== 'undefined'){

					//Color
					var	color = _.find(carColors, function(item){
						return item.Codigo == $scope.firstStep.dataInspection.CodigoColor;
					});
					$scope.secondStep.dataColor = color;

					//carValue - suggestedValue/valorEmision
					if (typeof $scope.secondStep.dataCarValue == 'undefined') $scope.secondStep.dataCarValue = {};
					$scope.secondStep.dataCarValue = $scope.firstStep.valorEmision;

					//Products
					if (carProducts) $scope.secondStep.productData = carProducts;
					//newProducts
					if (carNewProducts) $scope.secondStep.newProductData = carNewProducts;
					if (typeof $scope.secondStep.vigenciaError == 'undefined') initVigenciaError();
					settingsVigencia();

				}else{
					$state.go('.',{ step: 1 });
				}


			})();

			function disableNextStep(noCLear){
				if(!noCLear)
					$scope.$parent.thirdStep = {};
					$scope.$parent.fourthStep = {};

				$scope.secondStep.nextStep = false;
				$scope.thirdStep.nextStep = false;
			}

	    function initVigenciaError(){
				$scope.secondStep.vigenciaError = {
					error1: false,
					error2: false
				}
			}

			function settingsVigencia(){
				if (typeof $scope.secondStep.showVigencia == 'undefined') $scope.secondStep.showVigencia = true;

				$scope.today = function() {
					if (typeof $scope.secondStep.mInicioVigencia == 'undefined') $scope.secondStep.mInicioVigencia = new Date();
				};
				$scope.today();

				$scope.inlineOptions = {
					minDate: new Date(),
					showWeeks: true
				};

				$scope.dateOptions = {
					dateDisabled: function(data){
						var date = data.date;
						var _today = new Date(); _today = new Date(_today.getFullYear(), _today.getMonth(), _today.getDate());
						return  date < _today;
          },
					formatYear: 'yy',
					minDate: new Date(),
					startingDay: 1
				};

				$scope.dateOptions2 = {
            dateDisabled: function(data){
                var date = data.date;
                var _today = new Date(); _today = new Date(_today.getFullYear(), _today.getMonth(), _today.getDate());
                return  date < _today;
            },
            formatYear: 'yy',
            minDate: new Date(),
            startingDay: 1
        };

         $scope.$watch('secondStep.mInicioVigencia', function(nv)
        {
          $scope.dateOptions2.minDate = $scope.secondStep.mInicioVigencia;
					$scope.dateOptions2.initDate = $scope.secondStep.mInicioVigencia;
					
					if ($scope.secondStep.mProducto && $scope.secondStep.mProducto.McaVigencia === 'S' && $scope.secondStep.mInicioVigencia) {
						$scope.secondStep.mFinVigencia = mainServices.date.fnAdd($scope.secondStep.mInicioVigencia, $scope.secondStep.mVigenciaMeses , 'M');
          }
        });

				$scope.toggleMin = function() {
					$scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
					$scope.dateOptions.minDate = $scope.inlineOptions.minDate;
				};

				$scope.toggleMin();

				$scope.open1 = function() {
					$scope.popup1.opened = true;
				};

				$scope.open2 = function() {
					$scope.popup2.opened = true;
				};

				$scope.setDate = function(year, month, day) {
					$scope.dt = new Date(year, month, day);
				};

				$scope.format = constants.formats.dateFormat;
				$scope.altInputFormats = ['M!/d!/yyyy'];

				$scope.popup1 = {
					opened: false
				};

				$scope.popup2 = {
					opened: false
				};
			}

			function addDays(date, days){
				date.setDate(date.getDate() + days);
				return date;
			}

			$scope.changeDate = function(){
				if ($scope.secondStep.mProducto && $scope.secondStep.mProducto.McaVigencia !== 'S') {
					initVigenciaError();
					var vMaxDate = addDays(new Date(), 4); //Elige una fecha no mayor a 5 días calendario a partir de hoy
					vMaxDate = new Date(vMaxDate.getFullYear(), vMaxDate.getMonth(), vMaxDate.getDate());

					var vToday = new Date();
					vToday = new Date(vToday.getFullYear(), vToday.getMonth(), vToday.getDate());

					var ini = new Date($scope.secondStep.mInicioVigencia.getFullYear(), $scope.secondStep.mInicioVigencia.getMonth(), $scope.secondStep.mInicioVigencia.getDate());

					if (angular.isDate(ini)){
						$scope.secondStep.showVigencia = vToday <= ini && ini <= vMaxDate;
						if ( $scope.secondStep.showVigencia ) {
							if ((typeof $scope.secondStep.mProducto != 'undefined') && ($scope.secondStep.mProducto.FlagAnual != null) && (typeof $scope.secondStep.mProducto.FlagAnual != 'undefined')) {
								var anual = $scope.secondStep.mProducto.FlagAnual == 1? 1: 2;
								$scope.secondStep.mFinVigencia = new Date(ini.getFullYear() + anual, ini.getMonth(), ini.getDate());
							}else{
								$scope.secondStep.showVigencia = false;
								$scope.secondStep.vigenciaError.error2 = true;
							}
						}else{
							$scope.secondStep.vigenciaError.error1 = true;
						}
					}
				}
				
			}
			$scope.changeDate();
			//

			$scope.loadTypeUse = function(product){

				if (product.TipoProducto !== '' || product.TipoProducto !== 'NOPRODUCTO'){
					disableNextStep();

					var paramsTypeUse = {
						codModalidad: $scope.secondStep.mProducto.CodigoModalidad,
						codTipoVehiculo: $scope.firstStep.dataInspection.Veh_tipo
					};
					usedCarEmitFactory.getTypesUse(paramsTypeUse).then(function(response){
						if (response.OperationCode == constants.operationCode.success){
							$scope.secondStep.mTipoUso = undefined;
							$scope.secondStep.typeUseData = response.Data;
						}
					});

					if(product.TipoProducto !='PLURIANUAL' && oimPrincipal.get_role() =='BANSEG'){
       			$scope.secondStep.showVigenciaROL = true;
					}else{
						$scope.changeDate();
       			$scope.secondStep.showVigenciaROL = false;
					}

				} else {
					$scope.secondStep.typeUseData = [];
				}
				$scope.tieneVigencia(product);
        $scope.secondStep.isEmblem = product.TipoModalidad === 'EMBLEM';
			}

			$scope.changeTypeUse = function(){
				disableNextStep();
			}

			$scope.suggestedValueError = false;
			$scope.suggestedValueValidate = function(value){
				$scope.suggestedValueError = false;
				if (typeof value == 'undefined' || value < $scope.secondStep.dataCarValue.Minimo || value > $scope.secondStep.dataCarValue.Maximo){
					$scope.suggestedValueError = true;
				}else{
					$scope.toggleValue = true;
				}
			}
			$scope.suggestedValueValidate($scope.secondStep.dataCarValue.Valor);

			$scope.validationForm = function () {
      	$scope.frmSecondStep.markAsPristine();
      	return $scope.frmSecondStep.$valid;
    	};

    	$scope.$on('changingStep', function(ib,e){
				if (typeof $scope.secondStep.nextStep == 'undefined') $scope.secondStep.nextStep = false;
				if (e.step < 2) {
					e.cancel = false;
				} else if(e.step > 2 && $scope.secondStep.nextStep) {
					if ($scope.validationForm() && $scope.secondStep.showVigencia && !$scope.suggestedValueError){
						e.cancel = false;
					}else{
						e.cancel = true;
						disableNextStep();
					}
				}	else {
					e.cancel = true;
					disableNextStep();
				}
			});

			$scope.nextStep = function(){
				disableNextStep(true);
				if(!($scope.secondStep.mFinVigencia < $scope.secondStep.mInicioVigencia)){
					if(oimPrincipal.get_role() =='BANSEG'){
							if ($scope.validationForm() && !$scope.suggestedValueError){
								if (validateNewProduct()){
									$scope.secondStep.nextStep = true;
									$state.go('.',{
										step: 3
									});
								}else{
									mModalAlert.showWarning('La antiguedad del vehículo es mayor a la permitida para dicho plan', 'Observación');
								}
							}
					}else{
						if ($scope.validationForm() && $scope.secondStep.showVigencia && !$scope.suggestedValueError){
							if (validateNewProduct()){
								$scope.secondStep.nextStep = true;
								$state.go('.',{
									step: 3
								});
							}else{
								mModalAlert.showWarning('La antiguedad del vehículo es mayor a la permitida para dicho plan', 'Observación');
							}
						}
					}
				}
			};

			function validateNewProduct(){
				var r = false
				if ($scope.secondStep.newProductData){
					var	vNewProduct = _.find($scope.secondStep.newProductData.Data, function(item){
						return item.CodigoProducto == $scope.secondStep.mProducto.CodigoProducto;
					});
					if (typeof vNewProduct !== 'undefined') r = true;
				}
				return !r;
			}
			
      $scope.tieneVigencia =  function(producto) {
        if (producto.McaVigencia === 'S') {
          $scope.secondStep.mVigenciaMeses = producto.VigenciaMeses;
				}
        $scope.secondStep.mInicioVigencia = new Date();
      }
      
      vm.listener = $scope.$watch('secondStep.mInicioVigencia',function() {
        if ($scope.secondStep.mInicioVigencia && $scope.secondStep.mProducto && $scope.secondStep.mProducto.McaVigencia === 'S') {
					$scope.secondStep.mFinVigencia = mainServices.date.fnAdd($scope.secondStep.mInicioVigencia, $scope.secondStep.mVigenciaMeses , 'M');
        }
      });
	}]);
});
