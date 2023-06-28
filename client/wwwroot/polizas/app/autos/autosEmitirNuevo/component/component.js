'use strict';

  define([
    'angular', 'constants', '/polizas/app/autos/autosHome/service/autosFactory.js'
	], function(angular, constants, factory) {

  angular.module("appAutos").controller("emitirController",['$scope', '$stateParams', 'autosFactory', '$q', '$rootScope', '$location', '$window', '$state', function($scope, $stateParams, autosFactory, $q, $rootScope, $location, $window, $state)
  {
  	var _self = this;

  	$scope.formData = $rootScope.frm || {};

    $scope.$watch('formData', function(nv)
    {
      $rootScope.frm =  nv;
    })


    var key = 'nroDoc';

		//recuperamos Nro de documento
		$scope.numeroDocumento = autosFactory.getVariableSession(key);

		var codCompania = '1'; //codigo de compania
		var codRamo = '301';

	  var tipoProductoAFinanciar = 'plurianual/0';
	  _self.productoFinanciamiento = [
			{tipo: 'X2', valor: 'plurianualpro/20'},
			{tipo: 'RESP CIVIL', valor: 'rc/0'},
			{tipo: '', valor: 'automovil/0'}
		];

		//recuperamos datos de la cotizacion guardada
		var vParams = codCompania + '/' + 183892 + '/'+ codRamo;
		autosFactory.getData('api/documento/documentoBuscar', vParams) //OIM-142
			.then(function(data){
				$scope.documentoRecuperado = data;

				var str = $scope.documentoRecuperado.NombreProducto;
				_self.mapfreDolar = $scope.documentoRecuperado.Contratante.ImporteMapfreDolar

				//declarado en arreglo global

				if(str.search(_self.productoFinanciamiento[0].tipo)>= 0){ //plurianualpro
					tipoProductoAFinanciar = _self.productoFinanciamiento[0].valor;
					_self.addYear = 2;
				}else if(str.search(_self.productoFinanciamiento[1].tipo)>= 0){ //rc
					tipoProductoAFinanciar = _self.productoFinanciamiento[1].valor;
					_self.addYear = 1;
				}else{
					tipoProductoAFinanciar = _self.productoFinanciamiento[2].valor;
					_self.addYear = 1;
				}

				if ($scope.documentoRecuperado.Vehiculo.MCANUEVO == 'N') {
					_self.nroInspeccion = 	autosFactory.getVariableSession('nroInspeccion');

					var vParams = ':numIns=' + _self.nroInspeccion;
					autosFactory.getData('api/inspeccion/validar', vParams)
					.then(function(data){
						if (Object.keys(data).length){
							_self.enableEmision=true;
							_self.inspeccionGuardada = data;

							//color
							for(var i=0; i<_self.colores.length; i++){
								if(_self.colores[i].Codigo = _self.inspeccionGuardada.CodigoColor){
									_self.inspeccionGuardada.color=_self.colores[i].Descripcion;
									break;
								}
							}
						}
					}, function(error){
						_self.enableEmision=false;
						console.log('Error ' + error);
					});

					setTimeout(function(){
						console.log(_self.inspeccionGuardada);
					}, 2000); //bajarle en produccion
				}

			}, function(error){
				console.log('Error' + error + vParams);
			});

		//variables para ng-show
		$scope.labelGral = [
			{id: 'S', valor: 'SI'},
			{id: 'N', valor: 'NO'},
			{id: 'RUC', valor: 'RUC'},
			{id: 'nZero', valor: 1},
			{id: 'two', valor: 2},
			{id: 'U', valor: 'Usado'}
		];

  	$scope.gLblPlaca = {
			label:'Número de placa',
			required: true,
			error1: '* Este campo es obligatorio',
		};

		$scope.gLblNumeroChasis = {
			label:'Número de chasis',
			required: true,
			error1: '* Este campo es obligatorio',
		};
		$scope.gLblNumeroMotor = {
			label:'Número de motor',
			required: true,
			error1: '* Este campo es obligatorio',
		};
		$scope.gLblColor = {
			label:'Color',
			required: true,
			error1: '* Este campo es obligatorio',
			defaultValue: '- SELECCIONE -'
		};

		$scope.chkPlacaET = {
			id: 'chkPlacaET',
			label: 'Placa en trámite',
			name: 'chkPlacaET',
			val: false
		};


		_self.gLblDesde = {
			label: 'Fecha de inicio',
			required: true,
			error1: '* Este campo es obligatorio',
			datepickerPopup: 'dd-MM-yyyy'
		};
		_self.gLblHasta = {
			label: 'Fecha de término',
			required: true,
			error1: '* Este campo es obligatorio',
			datepickerPopup: 'dd-MM-yyyy'
		};

		/*########################
		# Blk Vigencia
		########################*/
		_self.dataVigencia = [
			{
				label: _self.gLblDesde,
				validate: 'validate[required]',
				disabled: false
			},
			{
				label: _self.gLblHasta,
				validate: 'validate[required]',
				disabled: true
			}
		];

		_self.showDate = function(){

			$scope.$watch('dataVigencia[0].model',function(){
				_self.selectDate = true;

				_self.date = new Date();
				if(_self.dataVigencia[0].model > _self.date.setDate(_self.date.getDate()+5)){
					console.log('fuera de rango');
					_self.dateError = true;
				}else{
					_self.dateError = false;
					_self.dataVigencia[1].model = sumarAnio(_self.dataVigencia[0].model);
					if (_self.dataVigencia[0].model != undefined){
						_self.dataVigencia[0].model.setYear(_self.dataVigencia[0].model.getFullYear() - _self.addYear);
					}

					_self.dataVigencia[1].model = formatDate(_self.dataVigencia[1].model);
				}

			 });
		};

		function sumarAnio(val){
			var fechaInicio = val;
			if (fechaInicio != undefined){
				return fechaInicio.setYear(fechaInicio.getFullYear() + $scope.addYear);
			}
		}

		function formatDate(dateIn){
			var newDate = '';
			if (dateIn != undefined){
				var date = new Date(dateIn);
				var day = ('0' + date.getDate()).slice (-2);
				var month = ('0' + (date.getMonth() + 1)).slice (-2);
				var year = date.getFullYear();
				newDate = day + '-' + month + '-' + year;
			}
			return newDate;
		}


		/*##############################
		# COLOR
		##############################*/
		autosFactory.loadSelect('api/automovil/color','')
			.then(function(data){
				$scope.colores=data;
			}, function(error){
				console.log('Error ' + error);
		});

    }])
});

