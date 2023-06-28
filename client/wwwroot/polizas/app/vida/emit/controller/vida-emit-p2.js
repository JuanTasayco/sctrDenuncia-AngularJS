(function($root, deps, action) {
	define(deps, action);
})(this, ['angular', 'constants', 'helper','generalConstantVida','lodash',
	'/scripts/mpf-main-controls/components/modalConfirmation/component/modalConfirmation.js',
	'app/vida/emit/component/beneficiario/beneficiario.js',
	'app/vida/emit/component/referido/referido.js',
	'/polizas/app/vida/proxy/vidaFactory.js'],
	function(angular, constants, helper,generalConstantVida, _) {

	angular.module('appVida').controller('vidaEmitS2',
	['$scope', '$state', '$timeout', '$window', 'proxyGeneral', '$filter', 'mModalAlert', '$uibModal',
	'liveFinancialEntities', 'liveAccountTypes', 'liveCoins', 'liveCardsType', '$q', 'mpSpin', 'oimPrincipal',
	'proxyEmision', 'vidaFactory', 'liveQuotation', 'proxyVida',
	function($scope, $state, $timeout, $window, proxyGeneral, $filter, mModalAlert, $uibModal,
	liveFinancialEntities, liveAccountTypes, liveCoins, liveCardsType, $q, mpSpin, oimPrincipal,
	proxyEmision, vidaFactory, liveQuotation, proxyVida) {

    $scope.PPJ_PU = false;   
    $scope.size = 3;

    (function onLoad() {
      if(generalConstantVida.productsPPJ.find(function(element) {return element==liveQuotation.Producto.CodigoProducto})){
        $scope.PPJ_PU = true;
      }
			$scope.mainStep = $scope.mainStep || {};
			$scope.firstStep = $scope.firstStep || {};
			$scope.secondStep = $scope.secondStep || {};
      $scope.thirdStep = $scope.thirdStep || {};
      $scope.secondStep.esRentaSegura = $scope.firstStep.cotizacion.FlagRentaSegura === 'S';
			$scope.data = $scope.secondStep;
      $scope.data.paso2 = $scope.data.paso2 || false;
			$scope.data.dataBeneficiary = $scope.firstStep;
			$scope.data.referidos = $scope.data.referidos || [];

			$scope.data.registro = $scope.data.registro || 'C';
			$scope.data.breferidos = $scope.data.breferidos || 'N';
			$scope.pattern = /(0[1-9]|1[0-2])\/\d{4}/;

      console.log("accionistas bs, step 2:", $scope.data);

       getSize();

			//Frecuencia de Pago (anual o semestral) el Gestor de cobro no es obligatorio
			$scope.data.IS_REQUIRED_RC = (typeof $scope.data.IS_REQUIRED_RC == 'undefined')
																			? $scope.data.registro == 'C' && $scope.firstStep.IS_REQUIRED_GESTOR_COBRO
																			: $scope.data.IS_REQUIRED_RC;
			$scope.data.IS_REQUIRED_RT = (typeof $scope.data.IS_REQUIRED_RT == 'undefined')
																			? $scope.data.registro == 'T' && $scope.firstStep.IS_REQUIRED_GESTOR_COBRO
                                      : $scope.data.IS_REQUIRED_RT;
      $scope.data.IS_REQUIRED_RC_RENTA_SEGURA = $scope.data.IS_REQUIRED_RC || ($scope.firstStep.cotizacion.FlagRentaSegura === 'S');
			//
			if (typeof $scope.data.selectLoadFile == 'undefined') $scope.data.selectLoadFile = true;
			$scope.errorAttachFile = !$scope.data.selectLoadFile;


			if (liveFinancialEntities) 	$scope.entidades = liveFinancialEntities;
			if (liveAccountTypes) 			$scope.tipoCuentas = liveAccountTypes;
			if (liveCoins)							$scope.monedas = liveCoins;
      if (liveCardsType)					$scope.tipoTarjetas = liveCardsType;
      $scope.contrantanteDocNum = liveQuotation.Contratante.NumeroDocumento;
      $scope.data.rEndosatario = $scope.data.rEndosatario || '0';
      $scope.data.endosatarioEncontrado = false;

      $scope.format = constants.formats.dateFormat;

      $scope.data.mCesionDate = _getCesionDate();
      $scope.popupCesionDate = {
        opened: false
      };
      $scope.dateOptions = {
        formatYear: 'yy',
        minDate: new Date(),
        maxDate: _getCesionDate(),
        startingDay: 1
      };
      $scope.altInputFormats = ['M!/d!/yyyy'];

      if (!$scope.data.paso2) {
        loadBeneficiarios();
        setTimeout(function() {
          loadData();
        });
      }

    })();

    function _getCesionDate() {
      return $scope.mainStep.isVitalicio ? null : convertStringToDate($scope.firstStep.cotizacion.FechaEfectoVencimiento);
    }

    $scope.openCesionDate = function() {
      $scope.popupCesionDate.opened = true;
    };

    function convertStringToDate(cadena) {
      var arreglo = cadena.split('/');
      return new Date(arreglo[2], arreglo[1] - 1, arreglo[0]);
    }

    $scope.buscarEndosatario = function(ruc) {
      vidaFactory.getEndosatarioByRuc(ruc, true).then(function(response) {
        if (response.OperationCode == constants.operationCode.success) {
          $scope.data.endosatario = response.Data;
          $scope.data.endosatarioEncontrado = true;
          $scope.data.noExisteEndosatario = false;
        } else {
          $scope.data.noExisteEndosatario = true;
          $scope.data.endosatarioEncontrado = false;
        }
      });
    };

    $scope.limpiarEndosatario = function() {
      $scope.data.endosatario = {};
      $scope.data.mRucEndosatario = '';
      $scope.data.noExisteEndosatario = false;
      $scope.data.endosatarioEncontrado = false;
    }

    $scope.getAutocompleteEndorseeByName = function(value) {
      return vidaFactory.getAutocompleteEndorseeByName(value, false);
    };

    //clearCollectionManager
		function _clearCollectionManager(option, allFields){
			switch (option){
				case 'C':
					if (allFields){
						$scope.data.entidad = {
							Codigo: null
						};
					}
					$scope.data.oficina = '';
					$scope.data.tipoCuenta = {
						Codigo: null
					};
					$scope.data.moneda = {
						Codigo: null
					};
					$scope.data.ctaCalcular = '';
					$scope.data.cuenta = '';
					$scope.data.codigoGestorEn = {
						Codigo: null
					};
					break;
				case 'T':
					if (allFields){
						$scope.data.tipoTarjeta = {
							Codigo: null
						};
					}
					$scope.data.codigoTarjeta = {
						Codigo: null
					};
					$scope.data.numeroTarjeta = '';
					$scope.data.fechaTarjeta = '';
					$scope.data.codigoGestorTa = {
						Codigo: null
					};
					break;
			}
		}
		$scope.clearCollectionManager = function(option, allFields){
			_clearCollectionManager(option, allFields);
		}

		function _clearRegisterAccount(){

		}
		$scope.onEntidadChange = function(item, inicial) {
			_clearCollectionManager('C', false);

			if (!item) return;

			$scope.data.codigoGestoresEn = [];
			$scope.data.oficina = item.CodigoOficiona;
			$scope.data.minCuenta = item.LongitudMinimo || 0;
			$scope.data.maxCuenta = item.LongitudMaximo || 0;

			proxyGeneral.GetListGestor('DB', item.Codigo, true).then(function(response) {
        $scope.data.codigoGestoresEn = response.Data;
        if (inicial) {
          $scope.data.codigoGestorEn = _.find($scope.data.codigoGestoresEn, function(e) {
            return e.Codigo === $scope.firstStep.cotizacion.GestorCobro.CodigoGestor;
          });
        }
			}, function() {
				console.log(arguments);
			});
		};

		$scope.onCtaCalcular = function(item) {
			var vCodeEntity = $scope.data.entidad && $scope.data.entidad.Codigo !== null;
			var vAccountType = $scope.data.tipoCuenta && $scope.data.tipoCuenta.Codigo !== null;
			var vCodeCurrency = $scope.data.moneda && $scope.data.moneda.Codigo !== null;

			if (vCodeEntity && vAccountType && vCodeCurrency){
				$scope.data.cuentaNoFormat = item || '';
				proxyGeneral.GetEnmascarCuenta($scope.data.entidad.Codigo, $scope.data.tipoCuenta.Codigo, $scope.data.moneda.Codigo, item, true).then(function(response){
					if (response.OperationCode == constants.operationCode.success){
						$scope.data.cuentaNoFormat = response.Data.NumeroCuenta;
						$scope.data.cuenta = response.Data.NumeroCuentaEnmascarado;
					}else{
						mModalAlert.showWarning(response.Data.Message, 'ALERT');
					}
				}, function() {
					console.log(arguments);
				});
			}
		};


		$scope.onTipoTarjetaChange = function(item, inicial) {
			_clearCollectionManager('T', false);

			if (!item) return;

			mpSpin.start();

			$scope.data.codigoTarjetas = [];
			$scope.data.codigoGestoresTa = [];
			$scope.data.minTarjeta =item.LongitudMinimo || 0;
			$scope.data.maxTarjeta =item.LongitudMaximo || 0;

			var vServiceCards = proxyGeneral.GetListCodigoTarjeta("2",item.Codigo, false);
			var vServiceManagers = proxyGeneral.GetListGestor('TA',item.Codigo, false);
			$q.all([vServiceCards, vServiceManagers]).then(function(response) {
				var vCards = response[0];
				var vManagers = response[1];
				if (vCards.OperationCode == constants.operationCode.success){
          $scope.data.codigoTarjetas = vCards.Data;
          if (inicial) {
            $scope.data.codigoTarjeta = _.find($scope.data.codigoTarjetas, function(e) {
              return e.Codigo === $scope.firstStep.cotizacion.GestorCobro.CodigoTarjeta.toString();
            });
          }
				}
				if (vManagers.OperationCode == constants.operationCode.success){
          $scope.data.codigoGestoresTa = vManagers.Data;
          if (inicial) {
            $scope.data.codigoGestorTa = _.find($scope.data.codigoGestoresTa, function(e) {
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


		$scope.numeroCambiando = false;
		$scope.numeroFormateado = false;
		$scope.onNumeroChange = function() {
			if ($scope.numeroCambiando) {
				return;
			}
			$scope.numeroFormateado = false;
		};

		$scope.onNumeroBlur = function() {
			if (!$scope.numeroFormateado) {
				var vCardType = $scope.data.tipoTarjeta && $scope.data.tipoTarjeta.Codigo !== null,
						vCardNumber = $scope.data.numeroTarjeta || '';

				if (vCardType){
					$scope.data.numeroTarjetaNoFormat = vCardNumber;
					proxyGeneral.GetEnmascarTarjeta($scope.data.tipoTarjeta.Codigo, vCardNumber, true).then(function(data){
						if (data.OperationCode == constants.operationCode.success){
							$scope.numeroCambiando = true;
							$scope.data.numeroTarjetaNoFormat = data.Data.NumeroCuenta;
							$scope.data.numeroTarjeta = data.Data.NumeroCuentaEnmascarado;
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
		/*#######################
		# Archivo cargomático
		#######################*/
		$scope.fnChangeLoadFile = function(){

      $timeout(function(){
        var vFile = $scope.data.fmLoadFile || {};
        if (!angular.isUndefined(vFile[0]) && getFileSizeMB(vFile[0].size) > $scope.size) {
          mModalAlert.showError(
            "El tamaño del archivo que estás tratando de guardar supera el máximo permitido por el servidor (" + $scope.size + " Mb). El archivo no ha sido guardado, por favor validar lo siguiente: <br/><br/>" +
            "- Intenta reducir el tamaño del archivo, verificando la resolución de la imagen.<br/>" +
            "- Asegúrate que estés adjuntando solo la imagen al que corresponde el título del documento.", 'Error');
          $scope.data.nameLoadFile = '';
          $scope.data.selectLoadFile = true;
        } else {
          $scope.data.nameLoadFile = vFile[0].name;
          $scope.data.selectLoadFile = false;
        }
        // $scope.errorAttachFile = $scope.data.selectLoadFile;
      }, 0);
    };

    var getFileSizeMB = function (size) {
      return size / 1024 / 1024;
    }
    /*#######################
		# nextStep
		#######################*/
		function _validateGestorCobro(){
			var vValid, vOr, vAnd;
			if ($scope.data.registro == 'C'){
				vOr = !!(($scope.data.entidad && $scope.data.entidad.Codigo !== null)
									|| $scope.data.oficina
									|| ($scope.data.tipoCuenta && $scope.data.tipoCuenta.Codigo !== null)
									|| ($scope.data.moneda && $scope.data.moneda.Codigo !== null)
									|| $scope.data.ctaCalcular
									|| $scope.data.cuenta
									|| ($scope.data.codigoGestorEn && $scope.data.codigoGestorEn.Codigo !== null));
				vAnd = !!(($scope.data.entidad && $scope.data.entidad.Codigo !== null)
									&& $scope.data.oficina
									&& ($scope.data.tipoCuenta && $scope.data.tipoCuenta.Codigo !== null)
									&& ($scope.data.moneda && $scope.data.moneda.Codigo !== null)
									&& $scope.data.ctaCalcular
									&& $scope.data.cuenta
									&& ($scope.data.codigoGestorEn && $scope.data.codigoGestorEn.Codigo !== null));
			} else {
				vOr = !!(($scope.data.tipoTarjeta && $scope.data.tipoTarjeta.Codigo !== null)
									|| ($scope.data.codigoTarjeta && $scope.data.codigoTarjeta.Codigo !== null)
									|| $scope.data.numeroTarjeta
									|| $scope.data.fechaTarjeta
									|| ($scope.data.codigoGestorTa && $scope.data.codigoGestorTa.Codigo !== null));
				vAnd = !!(($scope.data.tipoTarjeta && $scope.data.tipoTarjeta.Codigo !== null)
									&& ($scope.data.codigoTarjeta && $scope.data.codigoTarjeta.Codigo !== null)
									&& $scope.data.numeroTarjeta
									&& $scope.data.fechaTarjeta
									&& ($scope.data.codigoGestorTa && $scope.data.codigoGestorTa.Codigo !== null));
			}
			//vOr(T) && vAnd(T) = VALID
			//vOr(F) && vAnd(F) = VALID
			vValid = (vOr && vAnd) || (!vOr && !vAnd);
			return vValid;
		}

    function _validateDistribution(){
      var vMaxDistribution = 100,
        vDistributions = 0;

      angular.forEach($scope.data.dataBeneficiary.beneficiaries, function(item, index){
          vDistributions += parseInt(item.contractor.mDistribucion);
      });

      return ($scope.data.dataBeneficiary.beneficiaries.length > 0)
        ? vMaxDistribution === vDistributions
        : true;
    }

    $scope.clearEndosatarioFields = function(){
      $scope.limpiarEndosatario();
      $scope.data.endosatario = {};
      $scope.data.sumaEndosada = 0;
      $scope.data.mCesionDate = _getCesionDate();
		}

    function loadBeneficiarios() {
      if ($scope.firstStep.cotizacion.Beneficiarios.length > 0) {
        $scope.data.dataBeneficiary.beneficiaries = [];
        angular.forEach($scope.firstStep.cotizacion.Beneficiarios, function(item) {
          var beneficiario = {
            contractor: {
              mTipoBeneficiario: {
                Codigo: item.CodigoTipo,
                Descripcion: item.DescripcionTipo
              },
              mNacionalidad: {
                Codigo: item.Ubigeo.CodigoPaisNacionalidad
              },
              mDistribucion: item.PorcentajeSesion,
              mTipoDocumento: {
                TipoDocumento: item.TipoDocumento
              },
              mNumeroDocumento: item.NumeroDocumento,
              mParentesco: {
                Codigo: item.CodigoParentesco,
                Descripcion: item.DescripcionParentesco
              },
              mEstadoCivil: {
                CodigoEstadoCivil: item.EstadoCivil
              },
              mProfesion: {
                Codigo: item.Profesion.Codigo
              },
              mOcupacion: {
                Codigo: item.Ocupacion.Codigo
              },
              mNomContratante: item.Nombre,
              mApePatContratante: item.ApellidoPaterno,
              mApeMatContratante: item.ApellidoMaterno,
              mSexo: item.Sexo,
              mFechaNacimiento: convertStringToDate(item.FechaNacimiento),
              mEdadActual: item.EdadActuarial,
              mCorreoElectronico: item.Correo,
              mTelefonoFijo: item.TelefonoCasa,
              mTelefonoOficina: item.TelefonoOficina,
              mTelefonoCelular: item.TelefonoMovil
            },
            contractorAddress: {
              mTipoVia: {
                Codigo: item.CodigoVia
              },
              mTipoNumero: {
                Codigo: item.CodigoNumero
              },
              mTipoInterior: {
                Codigo: item.CodigoInterior
              },
              mTipoZona: {
                Codigo: item.CodigoZona
              },
              ubigeoData: {
                mDepartamento: {
                  Codigo: item.CodigoDepartamento
                },
                mProvincia: {
                  Codigo: item.CodigoProvincia
                },
                mDistrito: {
                  Codigo: item.CodigoDistrito
                }
              },
              mNombreVia: item.ViaDescripcion,
              mNumeroDireccion: item.TextoNumero,
              mNumeroInterior: item.TextoInterior,
              mNombreZona: item.TextoZona,
              mDirReferencias: item.Referencia
            }
          }
          $scope.data.dataBeneficiary.beneficiaries.push(beneficiario);
        })
      }
    }

    function loadData() {
      if ($scope.firstStep.cotizacion.GestorCobro.CodigoEntidad) {
        $scope.data.registro = 'C';
        $scope.data.entidad = _.find($scope.entidades, function(e) {
          return e.Codigo === $scope.firstStep.cotizacion.GestorCobro.CodigoEntidad;
        });
        $scope.onEntidadChange($scope.data.entidad, true);
        $scope.data.tipoCuenta = _.find($scope.tipoCuentas, function(e) {
          return e.Codigo === $scope.firstStep.cotizacion.GestorCobro.CodigoTipoCuenta;
        });
        $scope.data.moneda = _.find($scope.monedas, function(e) {
          return e.Codigo === $scope.firstStep.cotizacion.GestorCobro.CodigoMoneda;
        });
        $scope.data.ctaCalcular = $scope.firstStep.cotizacion.GestorCobro.CuentaCalcular;
        $scope.onCtaCalcular($scope.data.ctaCalcular);
      }

      if ($scope.firstStep.cotizacion.GestorCobro.TipoTarjeta) {
        $scope.data.registro = 'T';
        $scope.data.tipoTarjeta = _.find($scope.tipoTarjetas, function(e) {
          return e.Codigo === $scope.firstStep.cotizacion.GestorCobro.TipoTarjeta.toString();
        });
        $scope.onTipoTarjetaChange($scope.data.tipoTarjeta, true);
        $scope.data.numeroTarjeta = $scope.firstStep.cotizacion.GestorCobro.NumeroTarjeta;
        $scope.onNumeroChange();
        $scope.onNumeroBlur();
        $scope.data.fechaTarjeta = $scope.firstStep.cotizacion.GestorCobro.FechaVencimientoTarjeta;
      }

      $scope.data.rEndosatario = $scope.firstStep.cotizacion.Endosatario.TipoFiltro;
      if ($scope.firstStep.cotizacion.Endosatario.TipoFiltro > 0) {
        $scope.data.rEndosatario = $scope.firstStep.cotizacion.Endosatario.TipoFiltro;
        $scope.buscarEndosatario($scope.firstStep.cotizacion.Endosatario.NumeroDocumento);
        $scope.data.sumaEndosada = $scope.firstStep.cotizacion.Endosatario.SumaEndosada;
      }

      if ($scope.firstStep.cotizacion.Referidos.length > 0) {
        $scope.data.referidos = [];
        $scope.data.breferidos = 'S';
        angular.forEach($scope.firstStep.cotizacion.Referidos, function(item) {
          var referido = {
            nombre: item.Nombre,
            parentesco: item.Parentesco,
            telefono1: item.TelefonoCasa,
            telefono2: item.TelefonoOficina,
            celular: item.TelefonoMovil,
            correo: item.Correo
          };
          $scope.data.referidos.push(referido);
        });
      }
    }

    $scope.nextStep = function() {
      if (!$scope.fData.$valid) {
        $scope.fData.markAsPristine();
        return false;
      }

      var isValidGestorCobro = ($scope.firstStep.IS_REQUIRED_GESTOR_COBRO) ? true : _validateGestorCobro();
      if (!isValidGestorCobro) {
        mModalAlert.showError('Pero si ha ingresado un valor, todos los campos son obligatorios', 'GESTOR DE COBRO (OPCIONAL)');
        return false;
      }

      if ($scope.errorAttachFile) {
        mModalAlert.showError('Debe seleccionar un archivo cargomático', 'ERROR');
        return false;
      }

      if (!_validateDistribution()) {
        mModalAlert.showError('La suma de la distribución de indemnización debe ser 100%', 'Distribución de indemnización');
        return false;
      }

      function _goStep3() {
        $state.go('.', {
          step : 3,
          productCode: $scope.firstStep.cotizacion.Producto.CodigoProducto
        });
      }

      $scope.data.paso2 = true;
      $scope.secondStep = $scope.data;
      if ($scope.data.rEndosatario !== '0') {
        var endosatarioRequest = {
          numeroCotizacion: $scope.firstStep.cotizacion.NumeroCotizacion,
          sumaEndosada: $scope.secondStep.sumaEndosada,
          fecVctoCesion: $filter('date')($scope.secondStep.mCesionDate, constants.formats.dateFormat)
        };
        proxyVida.ValidaEndosatario(endosatarioRequest, true)
          .then(function(response) {
            if (response.OperationCode == constants.operationCode.success && response.Data) {
              _goStep3();
            } else {
              mModalAlert.showError(response.Message, 'ERROR');
            }
        });
      } else {
        _goStep3();
      }
    };

    function getSize(){
      proxyVida.GetTamanioCargomatico(true)
      .then(function(response) {
        if (response.OperationCode == constants.operationCode.success && response.Data) {
          $scope.size = response.Data;
        } else {
          mModalAlert.showError(response.Message, 'ERROR');
          $scope.size = 3;
        }
    });
    }
	}]);
});
