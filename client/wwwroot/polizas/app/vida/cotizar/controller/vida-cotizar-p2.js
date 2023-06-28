(function($root, deps, action) {
	define(deps, action);
})(this, ['angular', 'constants', 'helper', 'generalConstantVida',
'/polizas/app/vida/proxy/vidaFactory.js',
'/scripts/mpf-main-controls/components/modalConfirmation/component/modalConfirmation.js'],
function(angular, constants, helper, generalConstantVida) {

	var appVida = angular.module('appVida');

	appVida.controller('vidaCotizarS2',
		['$scope', '$state', '$timeout', '$window', '$uibModal', 'vidaFactory', '$filter', 'mModalAlert', 'mModalConfirm',
		'mainServices', 'oimAbstractFactory', 'oimPrincipal',
		function($scope, $state, $timeout, $window, $uibModal, vidaFactory, $filter, mModalAlert, mModalConfirm,
		mainServices, oimAbstractFactory, oimPrincipal){

			$scope.mainStep = $scope.mainStep || {};
	    $scope.firstStep = $scope.firstStep || {};
      $scope.secondStep = $scope.secondStep || {};
      $scope.PPJ_PU = false;

      // Validacion de producto PPJ PU
      if(generalConstantVida.productsPPJ.find(function(element) {return element==$scope.firstStep.producto.CodigoProducto})){
        $scope.PPJ_PU = true;
        // setear valor por defecto
        $scope.firstStep.mPesoAsegurado = 77 
				$scope.firstStep.mTallaAsegurado = 1.80
      }
      var dateString = $scope.firstStep.asegurado.year.Codigo + '-' + $scope.firstStep.asegurado.month.Codigo + '-' + $scope.firstStep.asegurado.day.Codigo;
      $scope.insuredAge = $filter('calculateActuarialAge')(new Date(dateString));

			function _paramsCotizarVida(){
				var vParams = {
					cabecera: {
						codigoAplicacion: 'OIM',
						codigoUsuario: oimPrincipal.getUsername().toUpperCase()
					},
					poliza: {
					  fecEfecSpto: 	$scope.secondStep.FechaEfecto,
					  codAgt: 			$scope.mainStep.mAgente.codigoAgente,
					  moneda: {
					  	codMon: $scope.firstStep.producto.CodigoMoneda
					  },
					  codigoPagoVida: $scope.firstStep.fraccionamientoPago.CodeResult
					},
					producto: {
					  codCia: 			constants.module.polizas.vida.companyCode,
					  codRamo: 			$scope.firstStep.producto.CodigoRamo,
					  codModalidad: $scope.firstStep.producto.CodigoProducto
					},
          contratante: {
					  mcaFisico:      (mainServices.fnShowNaturalRucPerson($scope.firstStep.tipoDocumento.TipoDocumento, $scope.firstStep.numDoc))
					  									? 'S'
					  									: 'N',
            tipDocum:       $scope.firstStep.tipoDocumento.TipoDocumento,
            codDocum:       $scope.firstStep.numDoc,
            nombre:         $scope.firstStep.nombre,
            apePaterno:     $scope.firstStep.apellidoPaterno,
            apeMaterno:     $scope.firstStep.apellidoMaterno,
            email: 					$scope.firstStep.mCorreoElectronico,
            telefonoCelular: $scope.firstStep.telefonoCelular,
            telefonoFijo: $scope.firstStep.telefonoFijo,
            telefonoOficina: $scope.firstStep.telefonoOficina
          },
					asegurado: {
					  tipDocum: 			$scope.firstStep.tipoDocumentoAsegurado.TipoDocumento,
					  codDocum: 			$scope.firstStep.numDocAsegurado,
            nombre:         $scope.firstStep.mIgualAsegurado ? $scope.firstStep.nombre : $scope.firstStep.nombreAsegurado,
            apePaterno:     $scope.firstStep.mIgualAsegurado ? $scope.firstStep.apellidoPaterno : $scope.firstStep.apellidoPaternoAsegurado,
            apeMaterno:     $scope.firstStep.mIgualAsegurado ? $scope.firstStep.apellidoMaterno : $scope.firstStep.apellidoMaternoAsegurado,
					  email: 					$scope.firstStep.mIgualAsegurado ? $scope.firstStep.mCorreoElectronico : $scope.firstStep.mCorreoElectronicoAsegurado,
					  peso: 					$scope.firstStep.mPesoAsegurado,
					  talla: 					$scope.firstStep.mTallaAsegurado,
					  fecNacimiento: 	$filter('date')($scope.firstStep.fechaNacimiento.model, constants.formats.dateFormat),
					  mcaSexo: 				($scope.firstStep.sexo === 'H') ? '1' : '0',
					  estadoCivil: 		($scope.firstStep.estadoCivil && $scope.firstStep.estadoCivil.CodigoEstadoCivil !== null) ? $scope.firstStep.estadoCivil.CodigoEstadoCivilTron : ''
					},
					riesgoVida: {
					  duracionSeg: 		$scope.secondStep.DuracionSeguro,
					  duracionPago: 	$scope.secondStep.DuracionPago,
					  anualidades: 		$scope.secondStep.DuracionAnualidad,
					  mcaEmplMapfre: 	$scope.secondStep.mcaEmpleado,
					  rentabiEstima1: $scope.firstStep.rentEstimada1 || 0,
					  rentabiEstima2: $scope.firstStep.rentEstimada2 || 0,
					  cobertura:[]
					},
          optionEdit: $scope.optionEdit || 0
				};
				$scope.secondStep.Coberturas.forEach(function(item) {
					var vCoverage = {
						codCobertura: 					item.CodigoCobertura,
						mcaCoberturaPrincipal: 	item.ChkSeleccionCobertura,
						capitalCobertura: 			item.MontoCobertura,
						sobreprimaMortalidad: 	item.SumaSobreMortalidad,
						sobreprimaEnfermedad: 	item.SumaEnfermedad,
						sobreprimaProfesion: 		item.SumaProfesion,
					};
					vParams.riesgoVida.cobertura.push(vCoverage);
      	});
				return vParams;
      }

      function _paramsCotizarVidaRenta() {
        var flagTipoPersona = (mainServices.fnShowNaturalRucPerson($scope.firstStep.tipoDocumento.TipoDocumento, $scope.firstStep.numDoc)) ? 'S' : 'N';

        var requestCotizacion = {
          cabecera: {
            codigoAplicacion: 'OIM',
            codigoUsuario: oimPrincipal.getUsername().toUpperCase()
          },
          poliza: {
            fecEfecSpto: $scope.secondStep.FechaEfecto,
            codAgt: $scope.mainStep.mAgente.codigoAgente
          },
          producto: {
            codCia: constants.module.polizas.vida.companyCode.toString(),
            codRamo: $scope.firstStep.producto.CodigoRamo.toString(),
            codModalidad: $scope.firstStep.producto.CodigoProducto.toString()
          },
          contratante: {
            mcaFisico: flagTipoPersona,
            tipDocum: $scope.firstStep.tipoDocumento.TipoDocumento,
            codDocum: $scope.firstStep.numDoc,
            nombre: $scope.firstStep.nombre
          },
          asegurado: {
            tipDocum: $scope.firstStep.tipoDocumentoAsegurado.TipoDocumento,
            codDocum: $scope.firstStep.numDocAsegurado,
            fecNacimiento: $filter('date')($scope.firstStep.fechaNacimiento.model, constants.formats.dateFormat),
            mcaSexo: ($scope.firstStep.sexo === 'H') ? '1' : '0',
            nombre: $scope.firstStep.mIgualAsegurado ? $scope.firstStep.nombre : $scope.firstStep.nombreAsegurado
          },
          riesgoVidaRenta: {
            duracionSeg: $scope.firstStep.duracionSeguro.Value,
            impPrimaUnica: Math.round($scope.firstStep.primaComercial * 100) / 100,
            pctDevolucion: parseFloat($scope.firstStep.devolucion.Value),
            periodoRenta: parseInt($scope.firstStep.periocidad.Value),
            mcaPeriodoGarantizado: $scope.firstStep.periodoGarantizado.checked,
            periodoDiferido: parseInt($scope.firstStep.diferimiento.Value),
            mcaAjusteRenta: $scope.firstStep.ajusteRenta,
            mcaPagoAdelantado: $scope.firstStep.pagoAdelantado.checked,
            pctCesionComision: $scope.firstStep.cesionComision ? Math.round($scope.firstStep.cesionComision * 100) / 10000 : 0,
            cotizarPor: 1, // 1 es por prima 2 es por renta objetivo
            impRentaObjetivo: 0,
            impCotiza: Math.round($scope.firstStep.primaComercial * 100) / 100,
            codPromocion: !$scope.firstStep.codigoPromocion ? "" : $scope.firstStep.codigoPromocion
          },
          mcaGuardado: 'S'
        };

        if (flagTipoPersona === 'S') {
          requestCotizacion.contratante.apePaterno = $scope.firstStep.apellidoPaterno;
          requestCotizacion.contratante.apeMaterno = $scope.firstStep.apellidoMaterno;
          requestCotizacion.asegurado.apePaterno = $scope.firstStep.mIgualAsegurado ? $scope.firstStep.apellidoPaterno : $scope.firstStep.apellidoPaternoAsegurado;
          requestCotizacion.asegurado.apeMaterno = $scope.firstStep.mIgualAsegurado ? $scope.firstStep.apellidoMaterno : $scope.firstStep.apellidoMaternoAsegurado;
        }

        return requestCotizacion;
      }

			$scope.fnSaveQuote = function(){
				mModalConfirm.confirmInfo(
					'Recuerda que una vez guardada ya no podrá hacer cambios',
					'¿Estás seguro que quieres guardar la cotización?',
					'GUARDAR').then(function(response){
						if (response){
              var vParams = $scope.firstStep.esProductoNuevo ? _paramsCotizarVidaRenta() : _paramsCotizarVida();
              $scope.$parent.guardarCotizacionVida(vParams, true);
            }
        });
			};

	}]);
});
