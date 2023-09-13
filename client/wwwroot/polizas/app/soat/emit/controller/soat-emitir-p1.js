(function($root, deps, action){
	define(deps, action)
})(this,
	['angular', 'constants', '/polizas/app/soat/emit/service/soatFactory.js'],
	function(angular, constants){
		angular.module("appSoat").controller('soatEmitS1', ['$scope', 'soatFactory', '$state', 'mpSpin', '$stateParams', '$rootScope', 'mModalAlert', '$timeout', 'proxySoat','proxyAutomovil', 'proxyListaNegra', '$uibModal', 'mModalConfirm',
			function($scope, soatFactory, $state, mpSpin, $stateParams, $rootScope, mModalAlert, $timeout, proxySoat, proxyAutomovil, proxyListaNegra, $uibModal, mModalConfirm){

      (function onLoad(){
				$scope.formData = $scope.formData || {};
				$scope.formData.dataContractor2 = {};
				$scope.formData.dataContractor2.Ubigeo = {};

				$scope.formData.scale = {
					decimalSeparator: '.',
          millarSeparator: ',',
          millonSeparator: "'",
          precision: 40,
          scale: 20,
          sinCeros: true
        };

				$scope.anioMin =  new Date().getFullYear()-50;
				$scope.anioMax = new Date().getFullYear();

				disableNextStep();

				proxyAutomovil
				.GetPolizaBroker("EMISA_PG_SOAT_"+$scope.mAgente.codigoAgente)
				.then(function(response){
					if (response.Data.length>0){
						$scope.formData.polizaEspecial = true;
						angular.forEach(response.Data, function(item){ item.Descripcion = item.NombrePolizaGrupo; item.Codigo = item.PolizaGrupo; });
						$scope.formData.cmbPolizaEspecial = response.Data;
					}else{
						$scope.formData.polizaEspecial = false;
					}
				});

      })();

			$scope.regexPlaca = '([a-zA-Z0-9]){3,20}';
			$scope.regexChasis = '([a-hj-np-zA-HJ-NP-Z0-9]){8,20}';
			$scope.regexMotor = '([a-hj-np-zA-HJ-NP-Z0-9]){8,20}';
			$scope.regexYear = '(19|20)\\d{2}';
			$scope.readonly = true;
			$scope.formData.polizaManual = '';
			$scope.formData.certificado = '';
			$scope.formData.MarcaPolizaManual = 'N';
			$scope.formData.MCAMapfreDolar = 'N';
			$scope.formData.McaAsegNuevo = 'S';
			$scope.formData.MCAREQUIEREGPS = 'N';
			$scope.formData.MCANUEVO = 'N';
			$scope.formData.ZonaTarifa = 'N';
			$scope.formData.disabledMDolar = false;
			$scope.montoMapfreDollar = 0.0;
			$scope.formData.descuentoComercial = 0.0;

			$scope.formData.resultPlaca = 0;
			$scope.formData.tomorrow = false;
			$scope.formData.mMapfreDolar = 0;
	    var _self = this;

 			$scope.gLblPlaca = {
	      label:'Número de placa',
	      required: true,
	      error1: 'Ingrese una placa válida: Ej. ABC123'
	    };
	     $scope.gLblChasis = {
	      label:'Número de chasis',
	      required: true,
	      error1: 'Ingrese un número de chasis válido. No incluye letras O e I, ni minúscula, ni mayúscula. Longitud de 8-20 caracteres'
	    };
	     $scope.gLblMotor = {
	      label:'Número de motor',
	      required: true,
	      error1: 'Ingrese un número de motor válido. Longitud de 8-20 caracteres'
	    };

	    $scope.gLblTipoVehiculo = {
	      label:'Tipo de vehículo',
	      required: true,
	      error1: '* Este campo es obligatorio',
	      defaultValue: '- SELECCIONE -'
	    };
	    $scope.gLblMarcaModelo = {
	      label: 'Marca y Modelo',
	      required: true,
	      error1: 'Error lorem ipsum error lorem ipsum'
	    };
	    $scope.gLblMarca = {
	      label: 'Marca',
	      required: true,
	      error1: 'Error lorem ipsum error lorem ipsum'
	    };
	    $scope.gLblModelo = {
	      label: 'Modelo',
	      required: true,
	      error1: 'Error lorem ipsum error lorem ipsum'
	    };
	    $scope.gLblSubModelo = {
	      label:'Submodelo',
	      required: true,
	      error1: '* Este campo es obligatorio',
	      defaultValue: '- SELECCIONE -'
	    };
		  $scope.gLblYearFabric = {
	      label:'Año de Fabricación',
	      required: true,
	      error1: 'Ingrese un año válido no mayor al actual: Ej. 2017',
	      defaultValue: '- SELECCIONE -'
	    };
		  $scope.gLblAsientos = {
				label: 'Número de asientos',
				required: false,
				error1: '* Este campo es obligatorio'
			};
			$scope.gLblModeloPrint = {
				label: 'Ingresar modelo para impresión',
				required: false,
				error1: '* Este campo es obligatorio'
			};

			$scope.sinDataPlaca = 'No se encontraron los datos del vehículo en el sistema, prueba con otros valores o ingresa los datos de manera manual';
			$scope.conDataPlaca = 'Se recuperaron los datos del vehículo del sistema, edita los datos o busca otro vehículo';
			$scope.searchAgain = 'Realizar nueva búsqueda';
			$scope.cadena = '';
			$scope.tipoCad = 0;
			$scope.buscarRiesgo = function($event, cadena, tipo){
				$scope.cadena = cadena;
				$scope.tipoCad = tipo;
				var keyCode = $event.which || $event.keyCode;
				if (keyCode === 13 || keyCode === 9) {
					$scope.buscarPlacaChasisMotor($scope.cadena, $scope.tipoCad);				
				}
		  };

		  $scope.buscarXRiesgo = function(placa, chasis, motor){
		  	if(typeof placa == 'undefined' ){
		  		placa = '';
		  	}

		  	if(typeof chasis == 'undefined' ){
		  		chasis = '';
		  	}

		  	if(typeof motor == 'undefined' ){
		  		motor = '';
		  	}

		  	$scope.formData.showPaso1 = true;

	    	$scope.errorCotizacionesVigentes = {};

	    	var params = {
	    		NumeroPoliza : '',
	    		NumeroPlaca : placa,
	    		NumeroChasis : chasis,
	    		NumeroMotor : motor
	    	};

			_validarDatosListaNegra(params);
		  }

	    $scope.buscarPlacaChasisMotor = function(cadena, tipo){

	    	var placa = '';
	    	var chasis = '';
	    	var motor = '';

	    	$scope.formData.showPaso1 = true;

	    	if(cadena==null){
	    		cadena='';
	    	}else{
	    		if(tipo===1){placa=cadena;}
	    		if(tipo===2){placa=''; chasis=cadena;}
	    		if(tipo===3){placa=''; chasis=''; motor=cadena;}
	    	}

	    	$scope.errorCotizacionesVigentes = {};

	    	var params = {
	    		NumeroPoliza : '',
	    		NumeroPlaca : placa,
	    		NumeroChasis : chasis,
	    		NumeroMotor : motor
	    	};

				$timeout(function(){busquedaVehiculo(params);});
	    };

	    function busquedaVehiculo(params){

        if($scope.formData.mPlaca!=='E/T'){
          if((params.placa !== '') || (params.chasis !== '') || (params.motor !== '')){
            $scope.formData.mostrarRiesgo = true;
              mpSpin.start();

              $scope.formData.validatedPaso3 = false;

              soatFactory.buscarPlacaChasisMotor(params).then(function(response){
								$scope.formData.showClean = true;
                if(response.OperationCode == constants.operationCode.success && response.Data.length>0){
                  $scope.dataPoliza = response.Data[0];

                	if(typeof $scope.formData.dataPolizaBkp == 'undefined'){ //es la primera busqueda
										$scope.formData.dataPolizaBkp = angular.copy(response.Data[0]);

	                  $scope.formData.dataPoliza = {
								      Vehiculo: {
								        CodigoTipo: {
								        	CodigoTipo: $scope.formData.dataPolizaBkp.Vehiculo.CodigoTipo,
								        	modified: false
								        },
								        NombreTipo: {
								        	NombreTipo: $scope.formData.dataPolizaBkp.Vehiculo.NombreTipo,
								        	modified: false
								        },

								        NumeroPlaca:{
								        	NumeroPlaca: $scope.formData.dataPolizaBkp.Vehiculo.NumeroPlaca,
								        	modified: false
								        },
								        NumeroChasis:{
								        	NumeroChasis: $scope.formData.dataPolizaBkp.Vehiculo.NumeroChasis,
								        	modified: false
								        },
								        NumeroMotor:{
								        	NumeroMotor: $scope.formData.dataPolizaBkp.Vehiculo.NumeroMotor,
								        	modified: false
								        },
								        CodigoColor:{
								        	CodigoColor: $scope.formData.dataPolizaBkp.Vehiculo.CodigoColor,
								        	modified: false
								        },
								        TipoVolante:{
								        	TipoVolante: $scope.formData.dataPolizaBkp.Vehiculo.TipoVolante,
								        	modified: false
								        },
								        CodigoUso:{
								        	CodigoUso: $scope.formData.dataPolizaBkp.Vehiculo.CodigoUso,
								        	modified: false
								        },
								        CodigoMarca:{
								        	CodigoMarca: $scope.formData.dataPolizaBkp.Vehiculo.CodigoMarca,
								        	modified: false
								        },
								        CodigoModelo:{
								        	CodigoModelo: $scope.formData.dataPolizaBkp.Vehiculo.CodigoModelo,
								        	modified: false
								        },
								        CodigoSubModelo:{
								        	CodigoSubModelo: $scope.formData.dataPolizaBkp.Vehiculo.CodigoSubModelo,
								        	modified: false
								        },
								        NombreUso:{
								        	NombreUso: $scope.formData.dataPolizaBkp.Vehiculo.NombreUso,
								        	modified: false
								        },
								        NombreMarca:{
								        	NombreMarca: $scope.formData.dataPolizaBkp.Vehiculo.NombreMarca,
								        	modified: false
								        },
								        NombreModelo:{
								        	NombreModelo: $scope.formData.dataPolizaBkp.Vehiculo.NombreModelo,
								        	modified: false
								        },
								        NombreModeloImpresion:{
								        	NombreModeloImpresion: $scope.formData.dataPolizaBkp.Vehiculo.NombreModeloImpresion,
								        	modified: false
								        },
								        NombreSubModelo:{
								        	NombreSubModelo: $scope.formData.dataPolizaBkp.Vehiculo.NombreSubModelo,
								        	modified: false
								        },
								        AnioFabricacion:{
								        	AnioFabricacion: $scope.formData.dataPolizaBkp.Vehiculo.AnioFabricacion,
								        	modified: false
								        },
								        NumeroOcupantes:{
								        	NumeroOcupantes: 0,
								        	modified: false
								        },
								        NombreRiesgo:{
								        	NombreRiesgo: $scope.formData.dataPolizaBkp.Vehiculo.NombreRiesgo,
								        	modified: false
								        },
								      },
								      Contratante: {
								      	SaldoMapfreDolar:{
								        	SaldoMapfreDolar: $scope.formData.dataPolizaBkp.Contratante.SaldoMapfreDolar,
								        	modified: false
								        },
								        FechaNacimiento:{
								        	FechaNacimiento: $scope.formData.dataPolizaBkp.Contratante.FechaNacimiento,
								        	modified: false
								        },
								        ImporteAplicarMapfreDolar:{
								        	ImporteAplicarMapfreDolar: $scope.formData.dataPolizaBkp.Contratante.ImporteAplicarMapfreDolar,
								        	modified: false
								        },
								        NombreCompleto:{
								        	NombreCompleto: $scope.formData.dataPolizaBkp.Contratante.NombreCompleto,
								        	modified: false
								        },
								        TipoDocumento: {
								        	TipoDocumento: $scope.formData.dataPolizaBkp.Contratante.TipoDocumento,
								        	modified: false
								        },
								        CodigoDocumento: {
								        	CodigoDocumento: $scope.formData.dataPolizaBkp.Contratante.CodigoDocumento,
								        	modified: false
								        },
								        ImporteMapfreDolar: {
								        	ImporteMapfreDolar: $scope.formData.dataPolizaBkp.Contratante.ImporteMapfreDolar,
								        	modified: false
								        },
								        Edad: {
								        	Edad: $scope.formData.dataPolizaBkp.Contratante.Edad,
								        	modified: false
								        },
								        CodigoEstadoCivil: {
								        	CodigoEstadoCivil: $scope.formData.dataPolizaBkp.Contratante.CodigoEstadoCivil,
								        	modified: false
								        },
								        Ubigeo: {
								          CodigoDepartamento: {
									        	CodigoDepartamento: $scope.formData.dataPolizaBkp.Contratante.Ubigeo.CodigoDepartamento,
									        	modified: false
									        }
								        },
								        ActividadEconomica: {
								          Indice: {
									        	Indice: $scope.formData.dataPolizaBkp.Contratante.ActividadEconomica.Indice,
									        	modified: false
									        }
								        },
								        Profesion: {
								          Indice: {
									        	Indice: $scope.formData.dataPolizaBkp.Contratante.Profesion.Indice,
									        	modified: false
									        }
								        }
								      },
								    };

								  }else{// segunda busqueda
								  	$scope.formData.dataPoliza2 = {
								      Vehiculo: {
								        CodigoTipo: {
								        	CodigoTipo: $scope.dataPoliza.Vehiculo.CodigoTipo,
								        	modified: false
								        },
								        NombreTipo: {
								        	NombreTipo: $scope.dataPoliza.Vehiculo.NombreTipo,
								        	modified: false
								        },

								        NumeroPlaca:{
								        	NumeroPlaca: $scope.dataPoliza.Vehiculo.NumeroPlaca,
								        	modified: false
								        },
								        NumeroChasis:{
								        	NumeroChasis: $scope.dataPoliza.Vehiculo.NumeroChasis,
								        	modified: false
								        },
								        NumeroMotor:{
								        	NumeroMotor: $scope.dataPoliza.Vehiculo.NumeroMotor,
								        	modified: false
								        },
								        CodigoColor:{
								        	CodigoColor: $scope.dataPoliza.Vehiculo.CodigoColor,
								        	modified: false
								        },
								        TipoVolante:{
								        	TipoVolante: $scope.dataPoliza.Vehiculo.TipoVolante,
								        	modified: false
								        },
								        CodigoUso:{
								        	CodigoUso: $scope.dataPoliza.Vehiculo.CodigoUso,
								        	modified: false
								        },
								        CodigoMarca:{
								        	CodigoMarca: $scope.dataPoliza.Vehiculo.CodigoMarca,
								        	modified: false
								        },
								        CodigoModelo:{
								        	CodigoModelo: $scope.dataPoliza.Vehiculo.CodigoModelo,
								        	modified: false
								        },
								        CodigoSubModelo:{
								        	CodigoSubModelo: $scope.dataPoliza.Vehiculo.CodigoSubModelo,
								        	modified: false
								        },
								        NombreUso:{
								        	NombreUso: $scope.dataPoliza.Vehiculo.NombreUso,
								        	modified: false
								        },
								        NombreMarca:{
								        	NombreMarca: $scope.dataPoliza.Vehiculo.NombreMarca,
								        	modified: false
								        },
								        NombreModelo:{
								        	NombreModelo: $scope.dataPoliza.Vehiculo.NombreModelo,
								        	modified: false
								        },
								        NombreModeloImpresion:{
								        	NombreModeloImpresion: $scope.dataPoliza.Vehiculo.NombreModeloImpresion,
								        	modified: false
								        },
								        NombreSubModelo:{
								        	NombreSubModelo: $scope.dataPoliza.Vehiculo.NombreSubModelo,
								        	modified: false
								        },
								        AnioFabricacion:{
								        	AnioFabricacion: $scope.dataPoliza.Vehiculo.AnioFabricacion,
								        	modified: false
								        },
								        NumeroOcupantes: {
								        	NumeroOcupantes: 0,
								        	modified: false
								        },
								        NombreRiesgo:{
								        	NombreRiesgo: $scope.dataPoliza.Vehiculo.NombreRiesgo,
								        	modified: false
								        },
								      },
								      Contratante: {
								      	SaldoMapfreDolar:{
								        	SaldoMapfreDolar: $scope.dataPoliza.Contratante.SaldoMapfreDolar,
								        	modified: false
								        },
								        FechaNacimiento:{
								        	FechaNacimiento: $scope.dataPoliza.Contratante.FechaNacimiento,
								        	modified: false
								        },
								        ImporteAplicarMapfreDolar:{
								        	ImporteAplicarMapfreDolar: $scope.dataPoliza.Contratante.ImporteAplicarMapfreDolar,
								        	modified: false
								        },
								        NombreCompleto:{
								        	NombreCompleto: $scope.dataPoliza.Contratante.NombreCompleto,
								        	modified: false
								        },
								        TipoDocumento: {
								        	TipoDocumento: $scope.dataPoliza.Contratante.TipoDocumento,
								        	modified: false
								        },
								        CodigoDocumento: {
								        	CodigoDocumento: $scope.dataPoliza.Contratante.CodigoDocumento,
								        	modified: false
								        },
								        ImporteMapfreDolar: {
								        	ImporteMapfreDolar: $scope.dataPoliza.Contratante.ImporteMapfreDolar,
								        	modified: false
								        },
								        Edad: {
								        	Edad: $scope.dataPoliza.Contratante.Edad,
								        	modified: false
								        },
								        CodigoEstadoCivil: {
								        	CodigoEstadoCivil: $scope.dataPoliza.Contratante.CodigoEstadoCivil,
								        	modified: false
								        },
								        Ubigeo: {
								          CodigoDepartamento: {
									        	CodigoDepartamento: $scope.dataPoliza.Contratante.Ubigeo.CodigoDepartamento,
									        	modified: false
									        }
								        },
								        ActividadEconomica: {
								          Indice: {
									        	Indice: $scope.dataPoliza.Contratante.ActividadEconomica.Indice,
									        	modified: false
									        }
								        },
								        Profesion: {
								          Indice: {
									        	Indice: $scope.dataPoliza.Contratante.Profesion.Indice,
									        	modified: false
									        }
								        }
								      },
								    };

 										angular.forEach($scope.formData.dataPoliza, function(value1,key1){
 											if(key1 == "Vehiculo"){ //vehiculo
	 											angular.forEach(value1, function(value2,key2){
													if(value2.modified){
														$scope.formData.dataPoliza2[key1][key2] = value2;
														$scope.dataPoliza[key1][key2] = value2[key2];
													}
			                  });
 											}
	                  });

								  }

                  if(response.Data.length>0){
                    $scope.formData.resultPlaca = 1;

                    $timeout(function(){buscarPoliza(new Date());});

                    llenarDataSOAT();
                  }else{
                    $scope.formData.resultPlaca = 2;

                    $scope.formData.mNumeroChasis = '';
                    $scope.formData.mNumeroMotor = '';


                    if(!$scope.formData.paso1Completed){
                      delete $scope.formData.mTipoVehiculo;
                      $scope.loadTipoVehiculo();
                      //delete $scope.formData.ModeloMarca;
                      $scope.ModeloMarca = {};
                      $scope.formData.ModeloMarca = {};
                      delete $scope.formData.mSubModelo;
                      delete $scope.formData.mYearFabric;
                      $scope.formData.dataContractor2 = {};
                      $scope.formData.dataContractor = {};
                      $scope.formData.dataContractorAddress = {};
                      delete $scope.formData.mNumAsientos;
                    }

                  }
                }else if (response.Message.length > 0){
                  $scope.formData.resultPlaca = 2;

                  if(typeof $scope.formData.dataPoliza == 'undefined'){

										$scope.formData.dataPoliza = {
									      Vehiculo: {
									        CodigoTipo: {
									        	CodigoTipo: undefined,
									        	modified: false
									        },
									        NombreTipo: {
									        	NombreTipo: undefined,
									        	modified: false
									        },

									        NumeroPlaca:{
									        	NumeroPlaca: undefined,
									        	modified: false
									        },
									        NumeroChasis:{
									        	NumeroChasis: undefined,
									        	modified: false
									        },
									        NumeroMotor:{
									        	NumeroMotor: undefined,
									        	modified: false
									        },
									        CodigoColor:{
									        	CodigoColor: undefined,
									        	modified: false
									        },
									        TipoVolante:{
									        	TipoVolante: undefined,
									        	modified: false
									        },
									        CodigoUso:{
									        	CodigoUso: undefined,
									        	modified: false
									        },
									        CodigoMarca:{
									        	CodigoMarca: undefined,
									        	modified: false
									        },
									        CodigoModelo:{
									        	CodigoModelo: undefined,
									        	modified: false
									        },
									        CodigoSubModelo:{
									        	CodigoSubModelo: undefined,
									        	modified: false
									        },
									        NombreUso:{
									        	NombreUso: undefined,
									        	modified: false
									        },
									        NombreMarca:{
									        	NombreMarca: undefined,
									        	modified: false
									        },
									        NombreModelo:{
									        	NombreModelo: undefined,
									        	modified: false
									        },
									        NombreModeloImpresion:{
									        	NombreModeloImpresion: undefined,
									        	modified: false
									        },
									        NombreSubModelo:{
									        	NombreSubModelo: undefined,
									        	modified: false
									        },
									        AnioFabricacion:{
									        	AnioFabricacion: undefined,
									        	modified: false
									        },
									        NumeroOcupantes:{
									        	NumeroOcupantes: undefined,
									        	modified: false
									        },
									        NombreRiesgo:{
									        	NombreRiesgo: undefined,
									        	modified: false
									        },
									      },
									      Contratante: {
									      	SaldoMapfreDolar:{
									        	SaldoMapfreDolar: undefined,
									        	modified: false
									        },
									        FechaNacimiento:{
									        	FechaNacimiento: undefined,
									        	modified: false
									        },
									        ImporteAplicarMapfreDolar:{
									        	ImporteAplicarMapfreDolar: undefined,
									        	modified: false
									        },
									        NombreCompleto:{
									        	NombreCompleto: undefined,
									        	modified: false
									        },
									        TipoDocumento: {
									        	TipoDocumento: undefined,
									        	modified: false
									        },
									        CodigoDocumento: {
									        	CodigoDocumento: undefined,
									        	modified: false
									        },
									        ImporteMapfreDolar: {
									        	ImporteMapfreDolar: undefined,
									        	modified: false
									        },
									        Edad: {
									        	Edad: undefined,
									        	modified: false
									        },
									        CodigoEstadoCivil: {
									        	CodigoEstadoCivil: undefined,
									        	modified: false
									        },
									        Ubigeo: {
									          CodigoDepartamento: {
										        	CodigoDepartamento: undefined,
										        	modified: false
										        }
									        },
									        ActividadEconomica: {
									          Indice: {
										        	Indice: undefined,
										        	modified: false
										        }
									        },
									        Profesion: {
									          Indice: {
										        	Indice: undefined,
										        	modified: false
										        }
									        }
									      },
									  };

									}

                  $scope.errorCotizacionesVigentes.value = true;
                  $scope.errorCotizacionesVigentes.description = response.Message;

             	 }else{
             	 	 if(typeof $scope.formData.dataPoliza == 'undefined'){

										$scope.formData.dataPoliza = {
									      Vehiculo: {
									        CodigoTipo: {
									        	CodigoTipo: undefined,
									        	modified: false
									        },
									        NombreTipo: {
									        	NombreTipo: undefined,
									        	modified: false
									        },

									        NumeroPlaca:{
									        	NumeroPlaca: undefined,
									        	modified: false
									        },
									        NumeroChasis:{
									        	NumeroChasis: undefined,
									        	modified: false
									        },
									        NumeroMotor:{
									        	NumeroMotor: undefined,
									        	modified: false
									        },
									        CodigoColor:{
									        	CodigoColor: undefined,
									        	modified: false
									        },
									        TipoVolante:{
									        	TipoVolante: undefined,
									        	modified: false
									        },
									        CodigoUso:{
									        	CodigoUso: undefined,
									        	modified: false
									        },
									        CodigoMarca:{
									        	CodigoMarca: undefined,
									        	modified: false
									        },
									        CodigoModelo:{
									        	CodigoModelo: undefined,
									        	modified: false
									        },
									        CodigoSubModelo:{
									        	CodigoSubModelo: undefined,
									        	modified: false
									        },
									        NombreUso:{
									        	NombreUso: undefined,
									        	modified: false
									        },
									        NombreMarca:{
									        	NombreMarca: undefined,
									        	modified: false
									        },
									        NombreModelo:{
									        	NombreModelo: undefined,
									        	modified: false
									        },
									        NombreModeloImpresion:{
									        	NombreModeloImpresion: undefined,
									        	modified: false
									        },
									        NombreSubModelo:{
									        	NombreSubModelo: undefined,
									        	modified: false
									        },
									        AnioFabricacion:{
									        	AnioFabricacion: undefined,
									        	modified: false
									        },
									        NumeroOcupantes:{
									        	NumeroOcupantes: undefined,
									        	modified: false
									        },
									        NombreRiesgo:{
									        	NombreRiesgo: undefined,
									        	modified: false
									        },
									      },
									      Contratante: {
									      	SaldoMapfreDolar:{
									        	SaldoMapfreDolar: undefined,
									        	modified: false
									        },
									        FechaNacimiento:{
									        	FechaNacimiento: undefined,
									        	modified: false
									        },
									        ImporteAplicarMapfreDolar:{
									        	ImporteAplicarMapfreDolar: undefined,
									        	modified: false
									        },
									        NombreCompleto:{
									        	NombreCompleto: undefined,
									        	modified: false
									        },
									        TipoDocumento: {
									        	TipoDocumento: undefined,
									        	modified: false
									        },
									        CodigoDocumento: {
									        	CodigoDocumento: undefined,
									        	modified: false
									        },
									        ImporteMapfreDolar: {
									        	ImporteMapfreDolar: undefined,
									        	modified: false
									        },
									        Edad: {
									        	Edad: undefined,
									        	modified: false
									        },
									        CodigoEstadoCivil: {
									        	CodigoEstadoCivil: undefined,
									        	modified: false
									        },
									        Ubigeo: {
									          CodigoDepartamento: {
										        	CodigoDepartamento: undefined,
										        	modified: false
										        }
									        },
									        ActividadEconomica: {
									          Indice: {
										        	Indice: undefined,
										        	modified: false
										        }
									        },
									        Profesion: {
									          Indice: {
										        	Indice: undefined,
										        	modified: false
										        }
									        }
									      },
									  };

									}
             	 }
                mpSpin.end();
              }, function(error){
                mpSpin.end();
              })
              .catch(function(err) {
                mpSpin.end();
              });
        }
        }else{
          if((chasis !== '') || (motor !== '')){
            $scope.formData.mostrarRiesgo = true;
          }
        }
	    }

	    $scope.limpiarDataSOAT = function(){
	    	$scope.formData.dataPolizaBkp = undefined;
	    	$scope.formData.showClean = false;
	    	delete $scope.formData.mTipoVehiculo;
	    	$scope.loadTipoVehiculo();
	    	$scope.formData.mPlaca = '';
	    	$scope.formData.mNumeroChasis = '';
				$scope.formData.mNumeroMotor = '';
	     	delete $scope.formData.ModeloMarca;
	      delete $scope.formData.mSubModelo;
	      delete $scope.formData.mYearFabric;
	    	$scope.formData.dataContractor2 = {};
      	$scope.formData.dataContractor = {};
      	$scope.formData.dataContractorAddress = {};
      	$scope.formData.mostrarRiesgo = false;
      	$scope.formData.resultPlaca = 0;
	    }

	    $scope.loadTipoVehiculo = function(){
				soatFactory.getTipoVehiculo().then(function(response){
					if (response.OperationCode == constants.operationCode.success){
						$scope.tipoVehiculo = response.Data;
					}
				});
			}

			$scope.loadMarca = function(){
				delete $scope.formData.ModeloMarca;
	      delete $scope.formData.mSubModelo;
	      delete $scope.formData.mYearFabric;
	      $scope.formData.mNumAsientos = 0

	      $scope.formData.dataPoliza.Vehiculo.CodigoTipo.CodigoTipo = $scope.formData.mTipoVehiculo.Codigo;
	      $scope.formData.dataPoliza.Vehiculo.CodigoTipo.modified = true;
	      $scope.formData.dataPoliza.Vehiculo.NombreUso.NombreUso = $scope.formData.mTipoVehiculo.Descripcion;
	      $scope.formData.dataPoliza.Vehiculo.NombreUso.modified = true;
			};

      soatFactory.GetListDelivery(soatFactory.CODE_DELIVERY, false)
        .then(function(resp) {
          $scope.formData.codsParaSoatDelivery = resp.Data;
        });

			/*auto complete */
    	$scope.loading = false;

			$scope.searchMarcaModelo = function(wilcar){

 				if (wilcar && wilcar.length>=3 && typeof $scope.formData.mTipoVehiculo != 'undefined'){
	       if($scope.formData.mTipoVehiculo.Codigo != null){
	          //cargamos las marcas y modelos
	          var paramMarcaModelo = {
	            Texto : wilcar.toUpperCase(),
	            CodigoTipo: $scope.formData.mTipoVehiculo.Codigo
	          };

				    return soatFactory.getMarcaModelo(paramMarcaModelo);
				  }
	      }

    	};

    	$scope.getFunctionsModeloMarca = function(val){//setear campos
	      if(val.codigoMarca == null){
	        delete $scope.formData.ModeloMarca;
	        delete $scope.formData.mSubModelo;
	        delete $scope.formData.mYearFabric;
	      }else{
	      	$scope.formData.marcaModeloRequired = false;
	        delete $scope.formData.mSubModelo;
	        $scope.formData.ModeloMarca = val;

	        $scope.formData.dataPoliza.Vehiculo.CodigoMarca.CodigoMarca = $scope.formData.ModeloMarca.codigoMarca;
					$scope.formData.dataPoliza.Vehiculo.CodigoMarca.modified = true;
					$scope.formData.dataPoliza.Vehiculo.NombreMarca.NombreMarca = $scope.formData.ModeloMarca.nombreMarca;
					$scope.formData.dataPoliza.Vehiculo.NombreMarca.modified = true;

					$scope.formData.dataPoliza.Vehiculo.CodigoModelo.CodigoModelo = $scope.formData.ModeloMarca.codigoModelo;
					$scope.formData.dataPoliza.Vehiculo.CodigoModelo.modified = true;
					$scope.formData.dataPoliza.Vehiculo.NombreModelo.NombreModelo = $scope.formData.ModeloMarca.nombreModelo;
					$scope.formData.dataPoliza.Vehiculo.NombreModelo.modified = true;

	        $scope.loadSubModelo($scope.formData.mTipoVehiculo.Codigo, $scope.formData.ModeloMarca.codigoMarca, $scope.formData.ModeloMarca.codigoModelo);
	      }
	    };

			$scope.loadSubModelo = function(tipoVehiculo, marca, modelo){
				if(tipoVehiculo){
					var paramSubModelo = {
						codTipoVehiculo: tipoVehiculo,//$scope.formData.firstStep.dataInspection.Veh_tipo
						codMarca: marca,
						codModelo: modelo
					};

		      soatFactory.getSubmodelo(paramSubModelo).then(function(response){
	          if(response.OperationCode == constants.operationCode.success){
	          	if(response.Data){
		            $scope.submodelos = response.Data;
		            $scope.sinSubmodelo=false;
		            if($scope.submodelos.length==0){
		            	$scope.sinSubmodelo=true;
		            }else{
		            	$scope.formData.mSubModelo = $scope.submodelos[0];
		            	cargarAsientos();
		            }
	          	}
	          }else if (response.Message.length > 0){
							$scope.sinSubmodelo=true;
	          }
	        }, function(error){
	        });
		    }
			}

			 function cargarAsientos(){
				if(typeof $scope.formData.mSubModelo != 'undefined' ){
					if(typeof $scope.formData.mSubModelo.NumeroAsiento != 'undefined'){
						$scope.formData.mNumAsientos = $scope.formData.mSubModelo.NumeroAsiento;

						$scope.formData.dataPoliza.Vehiculo.CodigoSubModelo.CodigoSubModelo = $scope.formData.mSubModelo.Codigo;
						$scope.formData.dataPoliza.Vehiculo.CodigoSubModelo.modified = true;
						$scope.formData.dataPoliza.Vehiculo.NombreSubModelo.NombreSubModelo = $scope.formData.mSubModelo.Descripcion;
						$scope.formData.dataPoliza.Vehiculo.NombreSubModelo.modified = true;
					}
				}
			}

			$scope.nextStep = function(mYearFabric, mNumAsientos, optRadio, mModeloPrint){
				$scope.formData.mYearFabric = mYearFabric;
				$scope.formData.mNumAsientos = mNumAsientos;
				$scope.formData.timon = optRadio;
				$scope.formData.mModeloPrint = mModeloPrint;
				if ($scope.formData.mostrarRiesgo){

					$scope.validationForm();

					if(parseInt($scope.formData.mNumAsientos) > parseInt($scope.formData.mSubModelo.NumeroAsiento)){
						//mModalAlert.showError("El número de asientos no puede mayor a: " + $scope.formData.mSubModelo.NumeroAsiento, "Datos incorrectos");
					}else{
						if($scope.formData.validatedPaso1   && ($scope.formData.mSubModelo && $scope.formData.mSubModelo.Codigo) &&
							($scope.formData.mYearFabric>=$scope.anioMin && $scope.formData.mYearFabric<=$scope.anioMax)){
							$scope.formData.mPlaca = $scope.formData.mPlaca.toUpperCase();
							$scope.formData.mNumeroChasis = $scope.formData.mNumeroChasis.toUpperCase();
							$scope.formData.mNumeroMotor = $scope.formData.mNumeroMotor.toUpperCase();
							$scope.formData.paso1Completed = true;
							$scope.formData.updateSoat = true;
							if($scope.mAgente.codigoAgente != '0'){
								$state.go('.', {
									step: 2
								});
							}else{
								mModalAlert.showError("No tiene un agente seleccionado", "Error");
							}
						}
					}

				}
				
			};

			if($stateParams.step!=null){
				$scope.step = $stateParams.step;
				if($scope.step==1){loadPaso1();}
			}
			function loadPaso1(){//setear campos
				$scope.loadTipoVehiculo();
	      if ($scope.formData.mTipoVehiculo && $scope.formData.ModeloMarca){
					if($scope.formData.ModeloMarca != null){
						$scope.loadSubModelo($scope.formData.mTipoVehiculo.Codigo, $scope.formData.ModeloMarca.codigoMarca, $scope.formData.ModeloMarca.codigoModelo);
					}
	      }
	    }

	    function llenarDataSOAT(){
	    	$scope.formData.mUsoRiesgo = {};
	    	$scope.ModeloMarca = {};
	    	$scope.formData.mSubModelo = {};
	    	$scope.formData.mNumeroChasis = ($scope.dataPoliza.Vehiculo.NumeroChasis && $scope.dataPoliza.Vehiculo.NumeroChasis != '') ? $scope.dataPoliza.Vehiculo.NumeroChasis : undefined;
	    	$scope.formData.mNumeroMotor = ($scope.dataPoliza.Vehiculo.NumeroMotor && $scope.dataPoliza.Vehiculo.NumeroMotor != '') ? $scope.dataPoliza.Vehiculo.NumeroMotor : undefined;
	    	//dataRiesgo
	    	$scope.formData.mTipoVehiculo.Codigo = ($scope.dataPoliza.Vehiculo.CodigoTipo && $scope.dataPoliza.Vehiculo.CodigoTipo!='') ? $scope.dataPoliza.Vehiculo.CodigoTipo : undefined;
	    	//marca
				//modelo
				if($scope.dataPoliza.Vehiculo.NombreModelo && $scope.dataPoliza.Vehiculo.NombreModelo!=''){
					$scope.ModeloMarca.marcaModelo = $scope.dataPoliza.Vehiculo.NombreMarca + " " + $scope.dataPoliza.Vehiculo.NombreModelo;
					$scope.ModeloMarca.codigoMarca = $scope.dataPoliza.Vehiculo.CodigoMarca;
	        $scope.ModeloMarca.nombreMarca = $scope.dataPoliza.Vehiculo.NombreMarca;
	        $scope.ModeloMarca.codigoModelo = $scope.dataPoliza.Vehiculo.CodigoModelo;
	        $scope.ModeloMarca.nombreModelo = $scope.dataPoliza.Vehiculo.NombreModelo;
					$scope.formData.ModeloMarca = $scope.ModeloMarca;
					$scope.formData.marcaModeloRequired = false;

					$scope.formData.mSubModelo = {
						Codigo: $scope.dataPoliza.Vehiculo.CodigoSubModelo,
						Descripcion: $scope.dataPoliza.Vehiculo.NombreSubModelo,
						NumeroAsiento: $scope.formData.mNumAsientos
					};

					cargarAsientos();
				}

				$scope.formData.mYearFabric = ($scope.dataPoliza.Vehiculo.AnioFabricacion && $scope.dataPoliza.Vehiculo.AnioFabricacion!="") ? $scope.dataPoliza.Vehiculo.AnioFabricacion : '';
		    $scope.formData.mModeloPrint = ($scope.dataPoliza.Vehiculo.NombreModeloImpresion && $scope.dataPoliza.Vehiculo.NombreModeloImpresion!="") ? $scope.dataPoliza.Vehiculo.NombreModeloImpresion : '';

				if($scope.dataPoliza.Vehiculo.CodigoTipo && $scope.dataPoliza.Vehiculo.CodigoTipo!=''){
					var paramsSubmodelo = {
						codTipoVehiculo: $scope.dataPoliza.Vehiculo.CodigoTipo,
						codMarca: $scope.dataPoliza.Vehiculo.CodigoMarca,
						codModelo: $scope.dataPoliza.Vehiculo.CodigoModelo
					};
					soatFactory.getSubmodelo(paramsSubmodelo).then(function(response){
						if (response.OperationCode == constants.operationCode.success){
							$scope.submodelos = response.Data;
							var lengthSubmodelos = $scope.submodelos.length;
							for(var i=0; i<lengthSubmodelos; i++){
								if($scope.submodelos[i].Codigo === $scope.dataPoliza.Vehiculo.CodigoSubModelo){
									$scope.numeroAsientos = $scope.submodelos[i].NumeroAsiento;
									$scope.formData.mNumAsientos = $scope.numeroAsientos;
									break;
								}
							}
						}
					});
        }

	    	//dataVehiculo
        $scope.formData.mPlaca = $scope.dataPoliza.Vehiculo && $scope.dataPoliza.Vehiculo.NumeroPlaca;
	    	$scope.formData.mNumeroChasis = $scope.dataPoliza.Vehiculo && $scope.dataPoliza.Vehiculo.NumeroChasis;
	    	$scope.formData.mNumeroMotor = $scope.dataPoliza.Vehiculo && $scope.dataPoliza.Vehiculo.NumeroMotor;

	    	//datos contratante
	    	$scope.formData.mTipoDocumento = $scope.dataPoliza.Contratante && $scope.dataPoliza.Contratante.TipoDocumento;
	    	$scope.formData.mNumeroDocumento = $scope.dataPoliza.Contratante && $scope.dataPoliza.Contratante.CodigoDocumento;

	    	if($scope.dataPoliza.Contratante.TipoDocumento && $scope.dataPoliza.Contratante.TipoDocumento!='' &&
	    		$scope.dataPoliza.Contratante.CodigoDocumento && $scope.dataPoliza.Contratante.CodigoDocumento!=''){
						// Contratante
						var paramsSearchContractor = {
							tipoDocumento: $scope.dataPoliza.Contratante.TipoDocumento,
							nroDocumento: $scope.dataPoliza.Contratante.CodigoDocumento
						}
						soatFactory.getDatosContratante(paramsSearchContractor).then(function(response){
							if (response.OperationCode == constants.operationCode.success){
								$scope.formData.dataContractor2 = response.Data;
								$scope.formData.blockDepartament=true;
								$scope.formData.blockFields= true;
							}else if(response.Message.length > 0){
								$scope.formData.blockDepartament=false;
								$scope.formData.blockFields = false;
							}
						}, function(error){
							$scope.formData.blockDepartament=false;
							$scope.formData.blockFields = false;
						});
					}


				loadPaso1();
	    }

		 	/*###################################
	    # Verificamos si el auto es o no nuevo
	    ###################################*/
	    function setearEstadoVehiculo(){
	      var fecha = new Date();
	      var ano = fecha.getFullYear();
	      if($scope.formData.mYearFabric != null){
	      	//AnioFabricacion
		      if((ano - $scope.formData.mYearFabric) < 2){
		         $scope.formData.MCANUEVO = 'S';
		      }else{
		        $scope.formData.MCANUEVO = 'N';
		      }
	      }
	    }

	    /*##############################
	    # Observaciones
	    ##############################*/
	    function showObservacion(){
	      var vParams = $scope.formData.ModeloMarca.codigoMarca + '/' + $scope.formData.ModeloMarca.codigoModelo + '/' + $scope.formData.mSubModelo.Codigo + '/' + $scope.formData.mYearFabric;

	      soatFactory.getObservacion(vParams).then(function(response){
					if (response.OperationCode == constants.operationCode.success){
						if (response.Data=='S'){
		            $scope.formData.MCAREQUIEREGPS = 'S';
		         }else{
		          	$scope.formData.MCAREQUIEREGPS = 'N';
		         }
					}
				});
	    }

      function buscarPoliza(fecha){
	      if(fecha!=null){
	        var fechaC = fecha;
	        var dd, mm = 0;

	        if((fechaC.getDate()+1)===32){
	        	dd = 1;
	        	mm = fechaC.getMonth()+2;
	        }else{
	        	dd = fechaC.getDate()+1;
		        mm = fechaC.getMonth()+1;
	        }

	        var yyyy = fechaC.getFullYear();
	        var yyyy2 = yyyy + 1;
	        if(dd<10){
	            dd='0'+dd
	        }
	        if(mm<10){
	            mm='0'+mm
	        }
	        $scope.FinVigencia = dd+'/'+mm+'/'+yyyy2;
	        $scope.InicioVigencia = dd+'/'+mm+'/'+yyyy;

					if($scope.formData.mPlaca==null){$scope.formData.mPlaca='';}
					if($scope.formData.mNumeroChasis==null){$scope.formData.mNumeroChasis='';}
					if($scope.formData.mNumeroMotor==null){$scope.formData.mNumeroMotor='';}

	      	$scope.formData.mConsultaDesde = new Date();
	      }
	    }

			$scope.searchAgain = function(){
				$scope.formData.resultPlaca = 0;
				$scope.formData.mPlacaOld = undefined;
				$scope.formData.mNumeroChasisOld = undefined;
				$scope.formData.mNumeroMotorOld = undefined;
			};

	    $scope.validationForm = function(){

	    	$scope.frmCarData.markAsPristine();

	    	if($scope.formData.mNumAsientos === null || $scope.formData.mNumAsientos == 0 || $scope.formData.mNumAsientos == ''){
	    		$scope.formData.validatedPaso1 =  false;
	    	}else{
	    		if($scope.mAgente.codigoAgente === ''){
		    		$scope.formData.validatedPaso1 =  false;
		    	}else{
		    		if($scope.formData.mModeloPrint == null){$scope.formData.mModeloPrint='';}
			    	//validar datos del vehiculo/riesgo
			    	if($scope.formData.mYearFabric>new Date().getFullYear()){
			    		mModalAlert.showWarning("El año del vehículo no puede ser mayor a " + new Date().getFullYear(), "¡Año mayor al actual!");
			    		$scope.formData.validatedPaso1 =  false;
			    	}else{
				    	if($scope.formData.mPlaca == null  ||
								!($scope.frmCarData.nNumeroChasis.$valid) || !($scope.frmCarData.nNumeroMotor.$valid) ||
				        $scope.formData.mTipoVehiculo.Codigo == null ||
				        $scope.formData.ModeloMarca == null ||
				        $scope.formData.mSubModelo == null || $scope.formData.mSubModelo.Codigo==null ||
				        $scope.formData.mYearFabric == null  ||
				        $scope.formData.mNumAsientos == null	||
				        ($scope.formData.mYearFabric>new Date().getFullYear())
				      ){
				        $scope.formData.validatedPaso1 =  false;
				      }else{
				      	if($scope.formData.mPlaca!=='E/T'){
				      		if(!($scope.formData.mPlaca.length>=3 && $scope.formData.mPlaca.length<=20) ||

				      			!($scope.frmCarData.nNumeroChasis.$valid) || !($scope.frmCarData.nNumeroMotor.$valid) ||
										!(($scope.formData.mYearFabric.indexOf("19") == 0 || $scope.formData.mYearFabric.indexOf("20") == 0) && ($scope.formData.mYearFabric.length==4))
					      		){
					      		$scope.formData.validatedPaso1 =  false;
					      	}else{
					      		setearEstadoVehiculo();
										showObservacion();
					      		$scope.formData.validatedPaso1 =  true;
					      	}
				      	}else{
				      		if(
				      			!($scope.frmCarData.nNumeroChasis.$valid) || !($scope.frmCarData.nNumeroMotor.$valid) ||
				      													!(($scope.formData.mYearFabric.indexOf("19") == 0 || $scope.formData.mYearFabric.indexOf("20") == 0) && ($scope.formData.mYearFabric.length==4))
					      		){
					      		$scope.formData.validatedPaso1 =  false;
					      	}else{
					      		setearEstadoVehiculo();
										showObservacion();
					      		$scope.formData.validatedPaso1 =  true;
					      	}
				      	}
				      }

			    	}
		    	}
	    	}

	    	if($scope.formData.ModeloMarca){
		    	if(($scope.formData.ModeloMarca.nombreMarca != "" && $scope.formData.ModeloMarca.nombreModelo != "") && $scope.formData.validatedPaso1){
		    		$scope.formData.validatedPaso1 = true;
		    		$scope.formData.marcaModeloRequired = false;
		    	}else{
		    		$scope.formData.validatedPaso1 = false;
		    		if($scope.formData.ModeloMarca.nombreMarca != "" && $scope.formData.ModeloMarca.nombreModelo != "")
		    			$scope.formData.marcaModeloRequired = false;
		    		else
		    			$scope.formData.marcaModeloRequired = true;
		    	}
		    }else{
		    	$scope.formData.validatedPaso1 = false;
		    }

	    }

	    function disableNextStep(){
	      $scope.formData.secondStepNextStep = false;
	      $scope.formData.thirdStepNextStep = false;
	      $scope.formData.fourthStepNextStep = false;
	    }

	    $scope.cleanModelo = function(){
				$scope.formData.mModeloPrint = '';
	    }

	    $scope.$on('changingStep', function(ib,e){
	    	$scope.validationForm();

	      if (typeof $scope.formData.secondStepNextStep == 'undefined') $scope.formData.secondStepNextStep = false;
	      if (e.step < 2) {
	        e.cancel = false;
	      }
	      else {
	        if($scope.formData.validatedPaso1 && e.step == 2  && ($scope.formData.mSubModelo && $scope.formData.mSubModelo.Codigo)){
						e.cancel = false;
	      	}else if($scope.formData.validatedPaso2 && e.step == 3){
						e.cancel = false;
	      	}else if($scope.formData.validatedPaso3 && e.step == 4){
						e.cancel = false;
	      	}else{
	      		e.cancel = true;
      			disableNextStep();
	      	}
	      }
	    });

	    $scope.changeChasis = function(){
        var existsPathVehiculo = helper.hasPath($scope.formData, 'dataPoliza.Vehiculo');
        if (existsPathVehiculo) {
          $scope.formData.dataPoliza.Vehiculo.NumeroChasis.NumeroChasis = $scope.formData.mNumeroChasis;
          $scope.formData.dataPoliza.Vehiculo.NumeroChasis.modified = true;
        }
	    }

	    $scope.changeMotor = function(){
        var existsPathVehiculo = helper.hasPath($scope.formData, 'dataPoliza.Vehiculo');
        if (existsPathVehiculo) {
          $scope.formData.dataPoliza.Vehiculo.NumeroMotor.NumeroMotor = $scope.formData.mNumeroMotor;
          $scope.formData.dataPoliza.Vehiculo.NumeroMotor.modified = true;
        }
	    }

	     $scope.changeYear = function(value){
			if (!$scope.formData.dataPoliza ) return;
			$scope.formData.dataPoliza.Vehiculo.AnioFabricacion.AnioFabricacion = value;
				$scope.formData.dataPoliza.Vehiculo.AnioFabricacion.modified = true;
	    };

	    $scope.changeAsientos = function(){
				$scope.formData.dataPoliza.Vehiculo.NumeroOcupantes.NumeroOcupantes = $scope.formData.mNumAsientos;
				$scope.formData.dataPoliza.Vehiculo.NumeroOcupantes.modified = true;
	    };

	    $scope.validarAsientos = function(){
	    	if(typeof $scope.formData.mNumAsientos != 'undefined'){
	    		if(typeof $scope.formData.mSubModelo != 'undefined'){
            return (parseInt($scope.formData.mNumAsientos) > parseInt($scope.formData.mSubModelo.NumeroAsiento));
			    }
	    	}
	    }

		function _validarDatosListaNegra(params) {
			var reqLN = [];

			if($scope.formData.mPlaca) reqLN.push({ "tipo": "NUM_MATRICULA", "valor": $scope.formData.mPlaca });
			if($scope.formData.mNumeroMotor) reqLN.push({ "tipo": "NUM_MOTOR", "valor": $scope.formData.mNumeroMotor });
			if($scope.formData.mNumeroChasis) reqLN.push({ "tipo": "NUM_SERIE", "valor": $scope.formData.mNumeroChasis });
	  
			proxyListaNegra.ConsultaListaNegra(reqLN, true).then(function(response) {
			  var datosLN = [];
			  
			  if(response.OperationCode === constants.operationCode.success) {
				var msg = "";
	  
				response.Data.forEach(function(element) {
				  if(element.Resultado) {
					var elemetLN = {
					  codAplicacion: personConstants.aplications.SOAT,
					  tipoDato: element.Tipo,
					  valorDato: element.Valor
					};
	  
					datosLN.push(elemetLN);
	  
					switch(element.Tipo) {
					  case "NUM_MATRICULA": 
						msg += "El n&uacute;mero de placa est&aacute; en la tabla de Cliente/ Unidad inelegible por estudios t&eacute;cnicos.<br/>"; 
						break;
					  case "NUM_SERIE": 
						msg += "El n&uacute;mero de chasis est&aacute; en la tabla de Cliente/ Unidad inelegible por estudios t&eacute;cnicos.<br/>"; 
						break;
					  case "NUM_MOTOR": 
						 msg += "El n&uacute;mero de motor est&aacute; en la tabla de Cliente/ Unidad inelegible por estudios t&eacute;cnicos.<br/>"; 
						break;
					  default: "";
					}
				  }
				});
	  
				if(msg === "") {
					$timeout(function(){busquedaVehiculo(params);});
				} else {
				  var profile = JSON.parse(window.localStorage.getItem('profile'));
	  
				  // EJECUTIVO
				  if(!profile.isAgent && profile.userSubType === "1") {
					mModalAlert.showError(msg, 'Error');
				  } else {
					var tipoPerfil = (profile.isAgent && profile.userSubType === "1") ? 'A' // AGENTE
						: (profile.userSubType === "3" ? 'B' : null); //BROKER
			
					_confirmacionFraudulento(tipoPerfil, datosLN, params);
				  }
				}
			  }
			});
		  }
	  
		  function _confirmacionFraudulento(perfil, datos, params) {
			if(!perfil) return;
	  
			mModalConfirm.confirmError('Cliente/Unidad inelegible por estudios t&eacute;cnicos, la emisi&oacute;n estar&aacute; supedita a revisi&oacute;n.<br/><br/>&iquest;DESEA CONTINUAR CON LA COTIZACI&Oacute;N?', '', 'SI', undefined, 'NO')
			.then(function(ok) {
				if(ok) {
					datos.forEach(function(element) {
						element.aceptaAdvertencia = true;
						proxyListaNegra.GuardarAuditoria(element).then();
					});
					$timeout(function(){busquedaVehiculo(params);});
				} 
			}, function(res) {
				datos.forEach(function(element) {
					element.aceptaAdvertencia = false;
					proxyListaNegra.GuardarAuditoria(element).then();
				});
			});
	  
			/*
			$uibModal.open({
			  backdrop: 'static', // background de fondo
			  backdropClick: true,
			  dialogFade: false,
			  keyboard: false,
			  scope: $scope,
			  windowTopClass:'popup',
			  templateUrl : '/scripts/mpf-main-controls/components/mpf-person/components/popupListaNegra.html',
			  controller : ['$scope', '$uibModalInstance', '$timeout','proxyListaNegra', function($scope, $uibModalInstance, $timeout, proxyListaNegra) { 
				$scope.continuar = function(){
				  datos.forEach(function(element) {
					element.aceptaAdvertencia = true;
					proxyListaNegra.GuardarAuditoria(element).then();  
				  });
	  
				  $uibModalInstance.close();
				  $timeout(function(){busquedaVehiculo(params);});
				}
	  
				$scope.cancelar = function(){
				  datos.forEach(function(element) {
					element.aceptaAdvertencia = false;
					proxyListaNegra.GuardarAuditoria(element).then();  
				  });
	  
				  $uibModalInstance.close();
				}
			  }]
			});
			*/
		  }

    }]);
});
