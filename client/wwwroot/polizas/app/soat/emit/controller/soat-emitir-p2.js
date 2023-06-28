(function($root, deps, action) {
	define(deps, action)
})(this,
  ['angular', 'constants', 'lodash', '/polizas/app/soat/emit/service/soatFactory.js',
  '/scripts/mpf-main-controls/components/contractorAddress/component/contractorAddress.js',
	'/polizas/app/autos/autosEmitirUsado/component/groupPolize/groupPolize.js'],
	function(angular, constants, _) {
	angular.module("appSoat").controller('soatEmitS2',
		['$scope', 'soatFactory', '$state', 'mpSpin', '$rootScope', 'mModalAlert', '$timeout', '$log', 'proxySoat', 'oimPrincipal', '$filter',
    function($scope, soatFactory, $state, mpSpin, $rootScope, mModalAlert, $timeout, $log, proxySoat, oimPrincipal, $filter) {
      var UBIGEO_LIMA = {
        depa: 15,
        prov: 128
      };

    $scope.regexPolManual = '(30299)\\d{8}';
   	(function onLoad() {
      $scope.formData = $scope.formData || {};
      $scope.formData.descuentoComercial = 0;
      $scope.cbo = {};
      $scope.configFrm = {
        maxLengthNumero: 5
      };

      $scope.dateOptionsSOAT = {
        initDate: new Date(),
        minDate: new Date()

      };
      $scope.dateOptionsSOATDesde = {
        initDate: new Date(),
        minDate: new Date()

      };
      $scope.dateOptionsSOATHasta = {
        initDate: new Date(),
        minDate: $scope.formData.delivery && new Date($scope.formData.delivery.fechaEnvio),
        showWeeks: false,
        startingDay: 1
      };
      $scope.addressValid = {};
      if ($scope.formData.mProductoSoat && $scope.formData.mProductoSoat.CodigoProducto === 23) {
        $scope.isDeliveryVisible = true;
      }
      if (helper.hasPath($scope.formData, 'delivery.address.ubigeoData.mDepartamento')) {
        $timeout(function() {
          if (angular.isFunction($scope.setterUbigeo)) {
            if ($scope.formData.delivery.address.ubigeoData.mDepartamento.Codigo) {
              $scope.setterUbigeo(
                $scope.formData.delivery.address.ubigeoData.mDepartamento.Codigo,
                $scope.formData.delivery.address.ubigeoData.mProvincia.Codigo,
                $scope.formData.delivery.address.ubigeoData.mDistrito.Codigo
              );
            }
          }
        });
      }

      if ($scope.formData.ModeloMarca!=null) {
        getProducts();
        if ($scope.formData.mProductoSoat != null) {
        	if (isProductPolizaManual($scope.formData.mProductoSoat.CodigoProducto)) {
	        	$scope.showPolizaManual = true;
	        }
        }
         disableNextStep();
      }else{
         $state.go('.',{
          step: 1
        });
      }

      soatFactory.GetProductPolizaManual().then(function (response) {
        if (response.Data.length > 0) {
          $scope.formData.codigosProductoPolizaManual = response.Data;
        } else {
          $scope.formData.codigosProductoPolizaManual = [];
        }
      })
      .catch(function(error) {
        mModalAlert.showError("Error en isProductPolizaManual", 'Error');
      });

      soatFactory.GetListDelivery(soatFactory.CODE_RUBRO.TIPO_SERVICIO, false)
        .then(function(resp) {
          $scope.cbo.tipoServicio = resp.Data;
        })
        .catch(function(err) {
          $log.error(err);
        });
      soatFactory.GetListDelivery(soatFactory.CODE_RUBRO.TURNO, false)
        .then(function(resp) {
          $scope.cbo.turno = resp.Data;
        })
        .catch(function(err) {
          $log.error(err);
        });
      soatFactory.GetListDelivery(soatFactory.CODE_RUBRO.RANGO_DELIVERY, false)
        .then(function(resp) {
          $scope.cbo.rangoDelivery = resp.Data;
        })
        .catch(function(err) {
          $log.error(err);
        });
      soatFactory.GetListDelivery(soatFactory.CODE_RUBRO.FORMA_PAGO, false)
        .then(function(resp) {
          $scope.cbo.formaPago = resp.Data;
        })
        .catch(function(err) {
          $log.error(err);
        });
      soatFactory.GetListDelivery(soatFactory.CODE_RUBRO.TIPO__LAMADA, false)
        .then(function(resp) {
          $scope.cbo.tipoLlamada = resp.Data;
        })
        .catch(function(err) {
          $log.error(err);
        });
      soatFactory.GetListDelivery(soatFactory.CODE_RUBRO.TIPO_POLIZA, false)
        .then(function(resp) {
          $scope.cbo.tipoPoliza = resp.Data;
        })
        .catch(function(err) {
          $log.error(err);
        });
      $scope.cbo.anhos = soatFactory.ANHOS;
      $scope.cbo.mes = soatFactory.MES;
	  })();

    function getListModalidadSoatDigital() {
      proxySoat.GetListModalidadSoatDigital(false).then(function(response) {
        if (response.OperationCode === constants.operationCode.success) {
          if (response.Data.length > 0) {
            $scope.formData.modalidadesSOAT = response.Data;
          }
        }
      }, function(error) {
        mModalAlert.showError(error.data.message, "Error");
      });
    }

    $scope.checkValue = function(item) {
      if (item && $scope.formData.modalidadesSOAT) {
        var a = $scope.formData.modalidadesSOAT.lastIndexOf(item.toString());
        if (a === -1) {
          $scope.formData.isBlockedAll = false;
          return false;
        } else {
          if ($scope.formData.isBlocked) {
            mModalAlert.showError('El sistema bloquea el acceso y muestra un mensaje de error indicando el mensaje: Tiene emisiones pendientes de pago mayores a 72 hrs', 'Agente Bloqueado');
            $scope.formData.isBlockedAll = true;
            return true;
          }
          else{
            $scope.formData.isBlockedAll = false;
            return false;
          }
        }
      }
    };

    $scope.onChangeFormaPago = function(codFormaPago) {
      var codScotiabank = '0005';
      if (codFormaPago !== codScotiabank) {
        $scope.formData.codScotiabank = '';
      }
    };

		$scope.gLblProductoSoat = {
			label:'Selecciona producto',
			required: true,
			error1: '* Este campo es obligatorio',
			defaultValue: '- Seleccionar producto -'
		};

    $scope.gLblPolizaGrupo = {
      label:'Selecciona una póliza grupo',
      required: false,
      error1: '* Este campo es obligatorio',
      defaultValue: '- Seleccionar póliza grupo -'
    };

		$scope.gLblUsoRiesgo = {
      label:'Tipo de uso',
      required: true,
      error1: '* Este campo es obligatorio',
      defaultValue: '- SELECCIONE -'
    };

    $scope.gLblDesc = {
    	label:'Descuento comercial %',
    	required: false,
      error1: 'El porcentaje debe estar entre 0-100%'
    };

		$scope.gLblPolizaManual = {
			label:'Código de póliza manual',
			required: false,
      error1: 'El número de póliza manual debe empezar con 30299 y debe tener 13 dígitos'
		};

    $scope.glbLblNroSol = {
      label:'Nro de certificado laser',
      required: false
    };

		$scope.format = 'dd/MM/yyyy';
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $timeout(function(){
      $scope.dt = new Date();
      if ( $scope.formData.tomorrow) {
        $scope.hoy = $scope.formData.tomorrowDate;
      }else{
        $scope.hoy = $filter("date")($scope.dt, 'dd/MM/yyyy') ;
        if (!$scope.formData.mConsultaHasta) $scope.formData.mConsultaHasta  = $filter("date")(calcEndDate($scope.dt) , 'dd/MM/yyyy') ;
      }
    });

    $scope.formData.today = $scope.hoy;

    function getCantidadDias(){
      if ($scope.formData.polizaEspecial)
        return  $scope.formData.mPolizaGrupo ? $scope.formData.mPolizaGrupo.CantidadDias: 365;
      return $scope.formData.groupPolizeData ? $scope.formData.groupPolizeData.cantidadDias: 365;

    }
    $scope.$watch('formData.groupPolizeData', function(n, o){
      if (n !== o){
        formatearFecha($scope.formData.mConsultaDesde, getCantidadDias())
      }
    });

    function calcEndDate(fecha, cantidadDias){
      if (fecha!=null) {
        var fechaC = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
        if (!cantidadDias || cantidadDias===365)
          fechaC = new Date(fechaC.getFullYear() + 1, fechaC.getMonth(), fechaC.getDate());
        else
          fechaC.setDate(fechaC.getDate() + cantidadDias);

        return fechaC;
      }
    }
    function formatearFecha(fecha, cantidadDias) {
      if (fecha!=null) {
        var fechaC = calcEndDate(fecha, cantidadDias);
        $scope.formData.mConsultaHasta =  fechaC; //dd+'/'+mm+'/'+yyyy2;
        $scope.formData.mConsultaDesdeF = fecha ;// dd+'/'+mm+'/'+yyyy;
        $scope.formData.desde = fechaC;
        return fechaC;
      }
    }

    $scope.popup1 = {
        opened: false
    };
    $scope.popup2 = {
        opened: false
    };
    $scope.popup3 = {
        opened: false
    };
    $scope.popup4 = {
        opened: false
    };

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.open3 = function() {
        $scope.popup3.opened = true;
    };

    $scope.open4 = function() {
      $scope.dateOptionsSOATHasta = {
        initDate: new Date(),
        minDate: $scope.formData.delivery && new Date($scope.formData.delivery.fechaLlamada),
        showWeeks: false,
        startingDay: 1
      };
      $scope.popup4.opened = true;
      $scope.isFechaEnvioClicked = true;
    };

    function getProducts() {
    	var paramsProducts = {
    		CodigoAplicacion: constants.module.polizas.description,
    		CodigoUsuario: $scope.mAgente.codigoUsuario,
    		Filtro: constants.module.polizas.soat.description
    	};

			soatFactory.getProducts(paramsProducts).then(function(response) {
				if (response.OperationCode === constants.operationCode.success) {
					$scope.productos = response.Data;
          $scope.sinProductos=false;
				}else{
          $scope.sinProductos=true;
        }

        getListModalidadSoatDigital();

        console.log(oimPrincipal.get_role());

        if (oimPrincipal.get_role() === "ADMIN" ||
          oimPrincipal.get_role() === "GST" ||
          oimPrincipal.get_role() === "EAC" ) {

        proxySoat.ValidarAgentePorCodigo($scope.mAgente.codigoAgente, false).then(function(response) {
            $scope.formData.isBlocked = (response.Data && response.Data.Bloqueado === "1");
          }, function(response) {
            $scope.formData.isBlocked = false;
          });
        }else{
          proxySoat.ValidarAgente(false).then(function(response) {
            $scope.formData.isBlocked = (response.Data && response.Data.Bloqueado === "1");
          }, function(response) {
            $scope.formData.isBlocked = false;
          });
        }

			});
		}

    $scope.loadTypeUse = function() {
      if ($scope.formData && $scope.formData.mProductoSoat) {
  			$scope.usoRiesgos = {};
  			var paramsTypeUse = {
  				codModalidad: $scope.formData.mProductoSoat && $scope.formData.mProductoSoat.CodigoModalidad,//30201,//$scope.mProducto.CodigoModalidad,
  				codTipoVehiculo: $scope.formData.mTipoVehiculo.Codigo//tipoVehiculo.Codigo//$scope.formData.firstStep.dataInspection.Veh_tipo
  			};
  			soatFactory.getTypesUse(paramsTypeUse).then(function(response) {
  				if (response.OperationCode === constants.operationCode.success) {
  					$scope.usoRiesgos = response.Data;
  				}
  			});
        soatFactory.GetProductDescription($scope.formData.mProductoSoat.CodigoProducto).then(function(response) {
          if (response.OperationCode === constants.operationCode.success) {
            $scope.productDescription = response.Data;
          }
        });
      }
		};

		if (typeof $scope.formData.mTipoVehiculo !== 'undefined' &&  typeof $scope.formData.mProductoSoat !== 'undefined') {$scope.loadTypeUse($scope.formData.mTipoVehiculo);}

		$scope.$watch('formData.mConsultaDesde',function() {
			if ($scope.formData.mConsultaDesde==null) {$scope.mConsultaDesde=$scope.hoy;}else{
				var desde = 0;
				if ($scope.formData.tomorrow) {
						desde = $scope.formData.tomorrowDate;
  			}else{
  				desde = formatearFecha($scope.formData.mConsultaDesde, getCantidadDias());
  			}
				$scope.selectDate = true;
				$scope.date = new Date();
				if (desde < $scope.date.setDate($scope.date.getDate())) {
					$scope.dateError = true;
				}else{
					$scope.dateError = false;
				}
			}
		});

    $scope.selectedPolizaEspecial = function(codigo) {
      $scope.formData.codPolizaGrupo = codigo;
      formatearFecha($scope.formData.mConsultaDesde, getCantidadDias());
    };

    if(!$scope.formData.groupPolizeData || helper.isEmptyObject($scope.formData.groupPolizeData)) {
      $scope.formData.groupPolizeData = {};
    }

		$scope.nextStep = function() {
			$scope.$watch('groupPolizeData', function(newData) {
				$scope.formData.dataGroupPolize = newData;
      });

			if ($scope.formData.groupPolizeData!=null) {
        if ($scope.formData.groupPolizeData.showGroupPolize) {
          $scope.formData.mPolizaGrupo = $scope.formData.groupPolizeData;
          $scope.formData.codPolizaGrupo = $scope.formData.groupPolizeData.groupPolize;
        }
      }
			$scope.validationForm();

			if ($scope.formData.validatedPaso2 && !$scope.formData.isBlockedAll) {
				$state.go('.',{
          step: 3
        });
			}
    };

		$scope.selectedProduct = function(codigo) {
      var isCodPermitidoParaDelivery = _.some($scope.formData.codsParaSoatDelivery, function(item) {
        return item.CodItem == codigo;
      });
			if (isProductPolizaManual(codigo)) {
        $scope.showPolizaManual = true;
        $scope.isDeliveryVisible = false;
        $scope.formData.isDeliverySelected = false;
      } else if (codigo === 23 && isCodPermitidoParaDelivery) {
        $scope.blockDepaAndProv = true;
        $scope.isDeliveryVisible = true;
        $scope.formData.isDeliverySelected = true;
        var existsPathDepa = helper.hasPath($scope.formData, 'delivery.address.ubigeoData.mDepartamento');
        var existsPathProv = helper.hasPath($scope.formData, 'delivery.address.ubigeoData.mProvincia');
        var existsPathDist = helper.hasPath($scope.formData, 'delivery.address.ubigeoData.mDistrito');
        if (existsPathDepa && !existsPathProv && !existsPathDist) {
          $timeout(function() {
            $scope.setterUbigeo(UBIGEO_LIMA.depa, UBIGEO_LIMA.prov, 0);
          }, 0);
        }

      } else {
        $scope.isDeliveryVisible = false;
        $scope.showPolizaManual = false;
      }
      $scope.formData.showMpfDolar = false;
      $scope.formData.mapfreDollarTotal = false;
		};

		$scope.getCertificado = function(codigo) {
			//llamar a servicio para obtener valor del certificado
			//si arroja positivo se inhabilita el uso de M$
			soatFactory.getPolizaManual(codigo).then(function(response) {
				if (response.OperationCode === constants.operationCode.success) {
          $scope.formData.hayPolizaManual = true;
					$scope.formData.polizaManual = codigo;
					$scope.formData.certificado = response.Data;
					$scope.formData.disabledMDolar = true;
					$scope.formData.MarcaPolizaManual = 'S';
				}
			});
		};

    function initPolizaManual() {
      if (typeof $scope.formData.polizaManual !== 'undefined') {
        $scope.formData.hayPolizaManual = false;
        $scope.formData.disabledMDolar = false;
        $scope.formData.MarcaPolizaManual = 'N';
        $scope.formData.mPolizaM = '';
      }
    }

    function clearPolizaManual() {
      if (typeof $scope.formData.polizaManual !== 'undefined') {
        $scope.formData.polizaManual = '';
        $scope.formData.certificado = undefined;
      }
    }

    $scope.closePolizaManual= function() {
      clearPolizaManual();
      initPolizaManual();
    };

		$scope.validationForm = function() {

      $scope.frmPoliData.markAsPristine();
      var isDeliveryValid = validarDelivery();
      if ( $scope.frmPoliData.nProductoSoat.$invalid ||
          $scope.frmPoliData.nUsoRiesgo.$invalid ||
          $scope.frmPoliData.nConsultaDesde.$invalid ||
          !isDeliveryValid
        ) {
        $scope.formData.validatedPaso2 =  false;
       // mModalAlert.showWarning("Para continuar debe completar los campos identificados con (*)", "¡Complete los campos obligatorios!");
      } else {
      	if (isProductPolizaManual($scope.formData.mProductoSoat.CodigoProducto) && $scope.formData.mPolizaM!=null) {
        	if (!(($scope.formData.mPolizaM.indexOf("30299") === 0) && ($scope.formData.mPolizaM.length===13))) {
        		$scope.formData.validatedPaso2 =  false;
        		mModalAlert.showWarning("La póliza manual debe empezar con 30299 y debe tener 13 dígitos", "¡Verifique póliza manual!");
            $scope.formData.mPolizaM = null;
        	}else{
        		$scope.formData.validatedPaso2 =  true;
        	}
        }else{
          if ($scope.isDeliveryVisible) {
            $scope.formData.validatedPaso2 = isDeliveryValid;
            return;
          }
        	$scope.formData.validatedPaso2 =  true;
        }
      }
    };

    function validarDelivery() {
      var isDeliveryValid;
      if ($scope.isDeliveryVisible) {
        if (!$scope.addressValid.func() || !$scope.frmPoliData.$valid) {
          isDeliveryValid =  false;
        }else{
          isDeliveryValid =  true;
        }
      } else {
        isDeliveryValid = true;
      }

      return isDeliveryValid;
    }

    function disableNextStep() {
      $scope.formData.thirdStepNextStep = false;
      $scope.formData.fourthStepNextStep = false;
    }

    function isProductPolizaManual(codigoProducto) {
      if (codigoProducto && $scope.formData.codigosProductoPolizaManual){
        return ($scope.formData.codigosProductoPolizaManual.indexOf(codigoProducto) !== -1);
      } else {
        return false;
      }
    }

    $scope.showOptionPolizaManual = function (codigoProducto) {
      isProductPolizaManual(codigoProducto)
    };

    $scope.$on('changingStep', function(ib,e) {
      if (typeof $scope.formData.thirdStepNextStep == 'undefined') $scope.formData.thirdStepNextStep = false;

      if (e.step < 3) {
        e.cancel = false;
      }else
       if (typeof $scope.formData.mUsoRiesgo != 'undefined') {
        if ($scope.formData.mUsoRiesgo.Codigo!=null && e.step == 3 && !$scope.formData.isBlockedAll) {
          e.cancel = false;
        }else if ($scope.formData.validatedPaso3 && e.step == 4 && !$scope.formData.isBlockedAll) {
          e.cancel = false;
        }else{
          e.cancel = true;
        }
      }else{
        e.cancel = true;
        disableNextStep();
      }
    });

	}]);
});
