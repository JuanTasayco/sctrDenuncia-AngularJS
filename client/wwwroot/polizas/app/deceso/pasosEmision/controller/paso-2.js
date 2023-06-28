'use strict';

define(['angular', 'constants', 'helper', 'lodash','decesoFactory'], function (angular, constants, helper, _) {

  decesoEmision2Controller.$inject = ['$scope', 'oimPrincipal', '$timeout','$stateParams', '$state', '$window', 'mModalAlert', 'decesoFactory', 'proxyGeneral', '$q', 'mpSpin', 'mainServices', 'decesoAuthorize' ];
  function decesoEmision2Controller($scope, oimPrincipal, $timeout, $stateParams, $state, $window, mModalAlert, decesoFactory, proxyGeneral, $q, mpSpin, mainServices, decesoAuthorize) {
    var vm = this;

    $scope.firstStep  = {};
    $scope.firstStep.documento  = {};
	$scope.firstStep.cargomatico  = {};

    $scope.documentosInfo = []
	$scope.codeModule = $state.current.nombreCorto || $state.toOimState.nombreCorto || null;

	$scope.validate = function(itemName){
        return decesoAuthorize.menuItem($scope.codeModule, itemName);
    }
	vm.$onInit = function () {
      $scope.pattern = /(0[1-9]|1[0-2])\/\d{4}/;
	  loadData($stateParams.quotationNumber);
      
    };

	function loadData(numDoc) {
		mainServices.fnReturnSeveralPromise([
			decesoFactory.getPasos2(numDoc, false),
			decesoFactory.GetListEntidadFinanciera(false),
			decesoFactory.GetListTipoCuenta(false),
			decesoFactory.GetListMonedaDeceso(false),
			decesoFactory.GetListTipoTarjeta(false),
		], true).then(function (response) {
			$scope.firstStep = response[0];
			if (!$scope.firstStep.Contratante.FechaNacimientojs){
				$scope.firstStep.Contratante.FechaNacimientojs = formatDate(JSON.parse(JSON.stringify($scope.firstStep.Contratante.FechaNacimiento)));
				$scope.firstStep.Contratante.FechaNacimientojs = formatDate(JSON.parse(JSON.stringify($scope.firstStep.Contratante.FechaNacimientojs)));
			}
			if (!$scope.firstStep.Titular.FechaNacimientojs){
				$scope.firstStep.Titular.FechaNacimientojs = formatDate(JSON.parse(JSON.stringify($scope.firstStep.Titular.FechaNacimiento)));
				$scope.firstStep.Titular.FechaNacimientojs = formatDate(JSON.parse(JSON.stringify($scope.firstStep.Titular.FechaNacimientojs)));
			}
			$scope.firstStep.registro  = 'C';
			$scope.firstStep.data  = {};
			$scope.firstStep.data.codigoGestoresEn = [];
			$scope.entidades = response[1].Data;
			$scope.tipoCuentas = response[2].Data;
			$scope.monedas = response[3].Data;
			$scope.tipoTarjetas = response[4].Data;
			decesoFactory.ListarArchivoDeceso($scope.firstStep.Ramo.CodigoCompania, 
				$scope.firstStep.Ramo.CodigoRamo, $scope.firstStep.NumeroDocumento, true).then(function (res) {
				$scope.documentosInfo = res.Data;
				$scope.documentosInfo.forEach(function(doc, index, ob) {
					if(doc.codigoGestor == '018'){
						$scope.firstStep.cargomatico = doc;
						ob.splice(index, 1);
					}
				});

			}, function (error) {
				$scope.documentosInfo = [];
			})
		}, function (error) {
			$scope.entidades = [];
			$scope.tipoCuentas = [];
			$scope.monedas = [];
			$scope.tipoTarjetas = [];
		});   
  
		
	  }
	
	$scope.fnLoadFile4 = function () {
		$timeout(function(){
			var paramsDocument = {
				File: $scope.firstStep.fmLoadFile[0],
				NumeroDocumento: $scope.firstStep.NumeroDocumento,
				CodigoGestor: $scope.firstStep.documento.codigoGestor
			}
			decesoFactory.cargaAltaDocumental( paramsDocument, true).then(function (res) {
				$scope.documentosInfo.forEach(function (docu, key) {
					if(docu.codigoGestor == $scope.firstStep.documento.codigoGestor){
						document.getElementById("iLoadFileDE").value=null; 
						docu.archivo.push(res.Data[0])
					}
				  });
				$scope.firstStep.fmLoadFile = null
			}, function (error) {
				_abrirModalError('Hubo un problema al subir el archivo.');
				$scope.firstStep.fmLoadFile = null
			
			})			
			
		  }, 100);

	}
	$scope.fnLoadFile2 = function () {
		$timeout(function(){
			$scope.firstStep.cargomatico
			var paramsDocument = {
				File: $scope.firstStep.fmLoadFileC[0],
				NumeroDocumento: $scope.firstStep.NumeroDocumento,
				CodigoGestor: $scope.firstStep.cargomatico.codigoGestor
			}
			if($scope.firstStep.fmLoadFileC[0] && $scope.firstStep.fmLoadFileC[0].type === 'application/pdf'){
				decesoFactory.cargaAltaDocumental( paramsDocument, true).then(function (res) {
					document.getElementById("iLoadFile2").value=null; 
					$scope.firstStep.cargomatico.archivo.push(res.Data[0]);
					$scope.firstStep.fmLoadFileC = null
				}, function (error) {
					_abrirModalError('Hubo un problema al subir el archivo.');
					$scope.firstStep.fmLoadFileC = null
				
				})	
			}		
			
		  }, 100);

	}
    $scope.onEntidadChange = function(item, inicial) {
			_clearCollectionManager('C', false);

			if (!item) return;

			$scope.firstStep.data.codigoGestoresEn = [];
			$scope.firstStep.data.oficina = item.CodigoOficiona;
			$scope.firstStep.data.minCuenta = item.LongitudMinimo || 0;
			$scope.firstStep.data.maxCuenta = item.LongitudMaximo || 0;
			decesoFactory.GetListGestor('DB', item.Codigo, true).then(function(response) {
        $scope.firstStep.data.codigoGestoresEn = response.Data;
        if (inicial) {
          $scope.firstStep.data.codigoGestorEn = _.find($scope.firstStep.data.codigoGestoresEn, function(e) {
            return e.Codigo === $scope.firstStep.cotizacion.GestorCobro.CodigoGestor;
          });
        }
			}, function(err) {
				console.log(err);
			});
		};

    $scope.onTipoTarjetaChange = function(item, inicial) {
			_clearCollectionManager('T', false);

			if (!item) return;

			mpSpin.start();

			$scope.firstStep.data.codigoTarjetas = [];
			$scope.firstStep.data.codigoGestoresTa = [];
			$scope.firstStep.data.minTarjeta =item.LongitudMinimo || 0;
			$scope.firstStep.data.maxTarjeta =item.LongitudMaximo || 0;

			var vServiceCards = proxyGeneral.GetListCodigoTarjeta("2",item.Codigo, false);
			var vServiceManagers = proxyGeneral.GetListGestor('TA',item.Codigo, false);
			$q.all([vServiceCards, vServiceManagers]).then(function(response) {
				var vCards = response[0];
				var vManagers = response[1];
				if (vCards.OperationCode == constants.operationCode.success){
          $scope.firstStep.data.codigoTarjetas = vCards.Data;
          if (inicial) {
            $scope.firstStep.data.codigoTarjeta = _.find($scope.firstStep.data.codigoTarjetas, function(e) {
              return e.Codigo === $scope.firstStep.cotizacion.GestorCobro.CodigoTarjeta.toString();
            });
          }
				}
				if (vManagers.OperationCode == constants.operationCode.success){
          $scope.firstStep.data.codigoGestoresTa = vManagers.Data;
          if (inicial) {
            $scope.firstStep.data.codigoGestorTa = _.find($scope.firstStep.data.codigoGestoresTa, function(e) {
              return e.Codigo === $scope.firstStep.cotizacion.GestorCobro.CodigoGestor;
            });
          }
				}
				mpSpin.end();
			}, function(error){
				mpSpin.end();
			}, function(defaultError){
				mpSpin.end();
			});
		};

    $scope.onNumeroChange = function() {
			if ($scope.numeroCambiando) {
				return;
			}
			$scope.numeroFormateado = false;
		};

    $scope.onNumeroBlur = function() {
			if (!$scope.numeroFormateado) {
				var vCardType = $scope.firstStep.data.tipoTarjeta && $scope.firstStep.data.tipoTarjeta.Codigo !== null,
						vCardNumber = $scope.firstStep.data.numeroTarjeta || '';

				if (vCardType){
					$scope.firstStep.data.numeroTarjetaNoFormat = vCardNumber;
					proxyGeneral.GetEnmascarTarjeta($scope.firstStep.data.tipoTarjeta.Codigo, vCardNumber, true).then(function(data){
						if (data.OperationCode == constants.operationCode.success){
							$scope.numeroCambiando = true;
							$scope.firstStep.data.numeroTarjetaNoFormat = data.Data.NumeroCuenta;
							$scope.firstStep.data.numeroTarjeta = data.Data.NumeroCuentaEnmascarado;
							$scope.numeroCambiando = false;
							$scope.numeroFormateado = true;
						}else{
							mModalAlert.showWarning(data.Data.Message, 'ALERTA');
						}
					}, function() {
						console.log(arguments);
					});
				}
			}
		};

    function _clearCollectionManager(option, allFields){
			switch (option){
				case 'C':
					if (allFields){
						$scope.firstStep.data.entidad = {
							Codigo: null
						};
					}
					$scope.firstStep.data.oficina = '';
					$scope.firstStep.data.tipoCuenta = {
						Codigo: null
					};
					$scope.firstStep.data.moneda = {
						Codigo: null
					};
					$scope.firstStep.data.ctaCalcular = '';
					$scope.firstStep.data.cuenta = '';
					$scope.firstStep.data.codigoGestorEn = {
						Codigo: null
					};
					break;
				case 'T':
					if (allFields){
						$scope.firstStep.data.tipoTarjeta = {
							Codigo: null
						};
					}
					$scope.firstStep.data.codigoTarjeta = {
						Codigo: null
					};
					$scope.firstStep.data.numeroTarjeta = '';
					$scope.firstStep.data.fechaTarjeta = '';
					$scope.firstStep.data.codigoGestorTa = {
						Codigo: null
					};
					break;
			}
		}
		$scope.clearCollectionManager = function(option, allFields){
			_clearCollectionManager(option, allFields);
		}


    $scope.onCtaCalcular = function(item) {
			var vCodeEntity = $scope.firstStep.data.entidad && $scope.firstStep.data.entidad.Codigo !== null;
			var vAccountType = $scope.firstStep.data.tipoCuenta && $scope.firstStep.data.tipoCuenta.Codigo !== null;
			var vCodeCurrency = $scope.firstStep.data.moneda && $scope.firstStep.data.moneda.Codigo !== null;

			if (vCodeEntity && vAccountType && vCodeCurrency){
				$scope.firstStep.data.cuentaNoFormat = item || '';
				decesoFactory.GetEnmascarCuenta($scope.firstStep.data.entidad.Codigo, $scope.firstStep.data.tipoCuenta.Codigo, $scope.firstStep.data.moneda.Codigo, item, true).then(function(response){
					if (response.OperationCode == constants.operationCode.success){
						$scope.firstStep.data.cuentaNoFormat = response.Data.NumeroCuenta;
						$scope.firstStep.data.cuenta = response.Data.NumeroCuentaEnmascarado;
					}else{
						mModalAlert.showWarning(response.Data.Message,'Error en la validación de la cuenta bancaria');
					}
				}, function() {
					console.log(arguments);
				});
			}
		};
	
	
	$scope.limpiarArchivo = function (index, doc) {
		if(doc.CodigoArchivoAdjunto){
			document.getElementById("iLoadFileDE").value=null; 
			decesoFactory.EliminarArchivoDeceso(doc.CodigoArchivoAdjunto, true).then(function(res){
				$scope.documentosInfo.forEach(function (docu, key) {
					if(docu.codigoGestor == doc.CodigoGestor){
						docu.archivo.splice(index)
					}
				});
			})
		}
	}
	$scope.limpiarArchivoC = function (index, doc) {
		if(doc.CodigoArchivoAdjunto){			
			decesoFactory.EliminarArchivoDeceso(doc.CodigoArchivoAdjunto, true).then(function(res){
				$scope.firstStep.cargomatico.archivo.splice(index);
			})
		}
	}
	function _abrirModalError(msjError) {
		mModalAlert.showError(msjError, 'Error');
	  }
  
	function _abrirModalExito(msj) {
		mModalAlert.showSuccess(msj, 'Exitoso');
	}
	function formatDate(date) {
		var format = date.slice(0, 10);
		return format.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, '$3/$2/$1');
	}
	
	function formatAsegurados(titular, aseguradoList){
		var asegurados = [];
		var titular = {
			"NumeroDocumento": titular.NumeroDocumento,
			"TipoDocumento": {
				"Codigo": titular.TipoDocumento.Codigo,
				"Descripcion": titular.TipoDocumento.Descripcion ? titular.TipoDocumento.Descripcion : ''
			},
			"FechaNacimiento": titular.FechaNacimientojs,
			"ApellidoPaterno": titular.ApellidoPaterno,
			"ApellidoMaterno": titular.ApellidoMaterno,
			"Nombre": titular.Nombre,
			"telefonoCasa": titular.TelefonoCasa,
			"telefonoMovil": titular.TelefonoMovil,
			"correo": titular.Correo,
			"Cobertura": titular.Cobertura,
			"codProfesion": titular.CodProfesion,
			"nacionalidad": titular.Nacionalidad,
			"EstadoCivil": {
				"Codigo": titular.EstadoCivil.CodigoEstadoCivil,
				"Descripcion": ''
			},
			"TipoAsegurado": titular.TipoAsegurado,
			"Sexo": titular.Sexo,
			"direccion": {
				"codPais": titular.Direccion.CodPais,
				"codDepartamento": titular.Direccion.CodDepartamento,
				"codProvincia": titular.Direccion.CodProvincia,
				"codDistrito": titular.Direccion.CodDistrito,
				"tipDomicilio": titular.Direccion.TipDomicilio,
				"nomDomicilio": titular.Direccion.NomDomicilio,
				"tipNumero": titular.Direccion.TipNumero,
				"descNumero": titular.Direccion.DescNumero,
				"tipInterior": titular.Direccion.TipInterior,
				"nroInterior": titular.Direccion.NroInterior,
				"tipZona": titular.Direccion.TipZona,
				"nomZona": titular.Direccion.NomZona,
				"refDireccion": titular.Direccion.RefDireccion
			}
		};
		asegurados.push(titular);
		angular.forEach(aseguradoList, function(value) {
			value.FechaNacimiento = formatDate(JSON.parse(JSON.stringify(value.FechaNacimiento)));
			value.FechaNacimiento = formatDate(JSON.parse(JSON.stringify(value.FechaNacimiento)));
			asegurados.push({
				"NumeroDocumento": value.NumeroDocumento,
				"TipoDocumento": value.TipoDocumento,
				"FechaNacimiento": value.FechaNacimiento,
				"ApellidoPaterno": value.ApellidoPaterno,
				"ApellidoMaterno": value.ApellidoMaterno,
				"Nombre": value.Nombre,
				"Cobertura": value.Cobertura,
				"Sexo": value.Sexo,
				"TipoAsegurado": value.TipoAsegurado
			})
		});		
		return asegurados;
	}
	$scope.suscripcion = function () {
		$scope.fData.markAsPristine();
		var validateDoc = _.find($scope.documentosInfo, function(x) { return x.obligatorio == "S"  && x.archivo.length == 0 });
		var cargomatico = $scope.firstStep.cargomatico.archivo.length;
		var valdCArgomatico = ($scope.firstStep.FormaPago.Codigo == '1') ?  (cargomatico > 0 ? true : false ) : true 
		if (!validateDoc && valdCArgomatico ){
			if(!$scope.fData.$invalid){
			$scope.firstStep.mAgente = {
				CodigoAgente: $scope.firstStep.Agente.CodigoAgente ? $scope.firstStep.Agente.CodigoAgente :  '' ,
				CodigoNombre: ''
			};
			var aseguradosFormat = formatAsegurados($scope.firstStep.Titular, $scope.firstStep.Asegurados);
			if($scope.firstStep.NumeroDocumento){
				$scope.firstStep["Contratante"]["mcaFisico"] = "S";
				$scope.firstStep["FlagAgenteDirecto"] = "N";				
				decesoFactory.RegistrarEmision(decesoFactory.emisionFormat($scope.firstStep, aseguradosFormat), true).then(function(res){
					if(res.OperationCode == 200){
						_abrirModalExito("Se emitió correctamente número de poliza: " + res.Data.NumeroPoliza)
						$state.go('decesoDocuments.docs', {doc: 'emitidasPro'}, { reload: true, inherit: false });
					}else{
						_abrirModalError(res.Message);					
					}
	
					
				})
			}
		}
		}else {
			_abrirModalError("Agregar el documento " + (( !valdCArgomatico) ? "cargomatico" : validateDoc.descripcion));	
			
		}        
	}

  }

  return angular.module('appDeceso')
    .controller('decesoEmision2Controller', decesoEmision2Controller)
    .factory('loaderP2DecesoController', ['saludFactory', 'decesoFactory', '$q', 'mainServices',
    function (saludFactory, decesoFactory, $q, mainServices) {
      var lists;

      function _getLists(showSpin, numDoc){
        var deferred = $q.defer();

        mainServices.fnReturnSeveralPromise([
          decesoFactory.getPasos2(numDoc, false),
          decesoFactory.GetListEntidadFinanciera(false),
          decesoFactory.GetListTipoCuenta(false),
          decesoFactory.GetListMonedaDeceso(false),
          decesoFactory.GetListTipoTarjeta(false),
        ], showSpin).then(function (response) {
          lists = response;
          deferred.resolve(lists);
        }, function (error) {
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

	  return {
		getLists: function (showSpin, step, numDoc) {
			if (step == 2) {
				if (lists) return $q.resolve(lists);
					return _getLists(showSpin, numDoc);
			}
		}
	  };

    }]);
});