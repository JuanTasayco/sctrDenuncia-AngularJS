(function($root, deps, action) {
	define(deps, action);
})(this, ['angular', 'constants', 'lodash', 'helper', 'mpfPersonComponent', 'mpfPersonConstants','/scripts/mpf-main-controls/components/contractorData/component/contractorData.js',
  '/scripts/mpf-main-controls/components/contractorAddress/component/contractorAddress.js'], function(angular, constants, _, helper){
	angular.module('appTransportes').controller('transporteEmitS4', ['$scope', 'proxyContratante', 'proxyTipoDocumento', 'proxyGeneral', 'proxyUbigeo', 'proxyDomicilio', '$state','mpfPersonFactory',function($scope, proxyContratante, proxyTipoDocumento, proxyGeneral, proxyUbigeo, proxyDomicilio, $state, mpfPersonFactory) {
		$scope.data = $scope.$parent.fourthStep || {};

		console.log("Llega data transporte-emitir-p4: ", $scope);

		$scope.data.contractor = $scope.data.contractor || {};
		$scope.data.contractorAddress = $scope.data.contractorAddress || {};
		$scope.data.contractorTmp = {};
		if (angular.isUndefined($scope.data.isRucContratante)) $scope.data.isRucContratante = false;

		$scope.companyCode = constants.module.polizas.transportes.companyCode;
		if (angular.isUndefined($scope.data.accionistasSocios)) $scope.data.accionistasSocios = false;
		if(angular.isUndefined($scope.data.accionistas)){
			$scope.data.accionistas=[];
		}
        var n1 = 1;
		if(!angular.isUndefined($scope.data.contractor)){
			$scope.getDataContratante = function(data) {
				if(data.hasOwnProperty('documentNumber')){
					if(data.documentNumber != undefined){
						if(n1==1){
							typeDoc=data.documentType.Codigo;
							NumDoc=data.documentNumber;
							var NumDocAbreviado=NumDoc.substr(-20,2);
							if (typeDoc=="RUC" && NumDocAbreviado=="20"){
								console.log(NumDoc.substr(-20,2));
                                $scope.data.isRucContratante=true;
								if($scope.data.accionistas.length == 0 ){
									getAccionistasSociosAsociado(typeDoc,NumDoc);
								}
							    n1=n1+1;
							}else{
								$scope.data.isRucContratante=false;
							}
							
						}
					}
				}
				if(data.isClear) {
					n1=1;
					$scope.data.accionistasSocios = false;
					$scope.data.accionistas=[];
					$scope.data.isRucContratante=false;
				  }
			}
		}
		$scope.appCode = personConstants.aplications.TRANSPORTE;
		$scope.formCodeCN = personConstants.forms.EMI_TRANSPORTE_CN;
		$scope.formCodeAccionista = personConstants.forms.EMI_ACCIONISTA;

		getEncuesta();

		function getEncuesta(){
			var codCia = constants.module.polizas.transportes.companyCode;
			var codeRamo = 252;

			proxyGeneral.GetEncuesta(codCia, codeRamo, false).then(function(response) {
				if(response.OperationCode == constants.operationCode.success){
				if (Object.keys(response.Data.Pregunta).length > 0){
					$scope.encuesta = response.Data;
					$scope.encuesta.CodigoCompania = codCia;
					$scope.encuesta.CodigoRamo = codeRamo;
				}else{
					$scope.encuesta = {};
					$scope.encuesta.mostrar = 0;
				}
				}
			}, function(error){
				console.log('Error en getEncuesta: ' + error);
			})
		}

		$scope.$on('personForm', function(event, data) {
			if (data.contractor) {
        $scope.data.contractor = _.merge($scope.data.contractor, data.contractor);
				setContractorData(data.contractor);
				$scope.contractorValid = data.valid;
        $scope.data.contractor.TipoDocumento = data.contractor.documentType.Codigo;
        $scope.data.contractor.CodigoDocumento = data.contractor.documentNumber;
        $scope.data.contractor.NumeroDocumento = data.contractor.documentNumber;
				$scope.data.contractor.showNaturalRucPerson =  !data.legalPerson;
			}
			var socioPosition;
			_.forEach(_.keys(data), function(key) {
			  socioPosition = key.split('-').length > 0 ? key.split('-')[1] : null;
			})
			if (socioPosition) {
			  var socioData = data['socio-' + socioPosition];
			  $scope.accionistaValid= data.valid;
			  setSocioData(socioData, socioPosition);
			}
		});

        $scope.cleanContract = function(){
            var data = $scope.data;
            data.contractorAddress.mTipoInterior = {Codigo: null}
            data.contractorAddress.mTipoNumero =  {Codigo: null};
            data.contractorAddress.mTipoVia = {Codigo: null}
            data.contractorAddress.mTipoZona = {Codigo: null}
            data.contractorAddress.mDirReferencias = "";
            data.contractorAddress.mNumeroInterior = "";
            data.contractorAddress.mNumeroDireccion = "";
            data.contractorAddress.mNombreZona = "";
            data.contractorAddress.mNombreVia = "";
            $scope.cleanUbigeo();
            return;
        }
        $scope.notifyContract = function(value){
            var data = $scope.data;
            if (!value)
            {
                $scope.cleanContract();
                return;
            }
            value = value.Ubigeo;
            $scope.setterUbigeo(value.CodigoDepartamento, value.CodigoProvincia, value.CodigoDistrito);
            data.contractorAddress.mTipoInterior = {Codigo: value.CodigoInterior};
            data.contractorAddress.mTipoNumero =  {Codigo:value.CodigoNumero};
            data.contractorAddress.mTipoVia = {Codigo:value.CodigoVia};
            data.contractorAddress.mTipoZona = {Codigo:value.CodigoZona};
            data.contractorAddress.mDirReferencias = value.Referencia;
            data.contractorAddress.mNumeroInterior = value.TextoInterior;
            data.contractorAddress.mNumeroDireccion = value.TextoNumero;
            data.contractorAddress.mNombreZona = value.TextoZona;
            data.contractorAddress.mNombreVia = value.Direccion;
        }

		proxyContratante.GetListEndosatario(true).then(function(data) {
			$scope.endorseeData = data.Data
		}, function() {
			console.log(arguments);
		});

		$scope.onEndorseeChange = function(endorsee){
			$scope.data.showCalculatePremium = false //Oculta Calculo prima porque se ha modifcado la suma a endosar
		}

		$scope.sumEndorseAction = function(sumEndorse){
			if ($scope.data.sumEndorseToggle){
				$scope.data.sumEndorseToggle = false;
			}else{
				$scope.sumEndorseError = false;
				if (typeof sumEndorse == 'undefined' || sumEndorse == '' || sumEndorse < 0 /*|| sumEndorse > $scope.secondStep.dataCarValue.Valor*/) {
					$scope.sumEndorseError = true;
				}else{
					$scope.data.showCalculatePremium = false //Oculta Calculo prima porque se ha modifcado la suma a endosar
					$scope.data.sumEndorseToggle = true;
				}
			}
		};

		$scope.addAccionista = function() {
			agregarAccionista();
		  };
		  $scope.$watch("data.accionistasSocios",function(newValue, oldValue){
			console.log("whatch",newValue,oldValue);
			if(newValue===oldValue){
			  return;
			}
			if(!newValue){
			  $scope.data.accionistas=[];
			}
			else{
			  if($scope.data.accionistas.length==0){
				agregarAccionista();
			  }
			}
		  });
		  $scope.removeAccionista = function(index) {
			$scope.data.accionistas.splice(index,1);
		  }
	  
		  function agregarAccionista(){
			var accionista = {
			  documentType: null,
			  documentNumber: null,
			  Relacion : null,
			  Nombre : null,
			  ApellidoMaterno :null,
			  ApellidoPaterno :null,
			  RazonSocial : null,
			  PorParticipacion : null//BUILDSOFT
			};
			$scope.data.accionistas.push(accionista);
		  };
		  function getAccionistasSociosAsociado(typeDoc,NumDoc){
			$scope.data.accionistas = [];
			mpfPersonFactory.getAccionista(typeDoc,NumDoc)
			  .then(function(response){
				angular.forEach(response.Data, function(value){
				  if (response.Data != [] && response.Data != null){
					$scope.data.accionistasSocios = true;
					var accionista = {
					  documentType: { Codigo: value.TipDocumento },
					  documentNumber: value.NroDocumento,
					  Relacion : {Codigo: value.Relacion},
					  Nombre : value.Nombres,
					  ApellidoMaterno :value.ApellidoMaterno,
					  ApellidoPaterno :value.ApellidoPaterno,
					  RazonSocial : value.RazonSocial,
					  PorParticipacion : value.PorParticipacion//BUILDSOFT
					};
					$scope.data.accionistas.push(accionista);
				  }else{
					$scope.data.accionistasSocios = false;
				  }
				});
			  })
			  .catch(function (err) {
				console.error(err);
			  })
		  }

		  function setSocioData(data, socioPosition) {
			$scope.data.accionistas[socioPosition].documentType = data.documentType;
			$scope.data.accionistas[socioPosition].documentNumber = data.documentNumber;
			$scope.data.accionistas[socioPosition].Relacion = data.Relacion;
			$scope.data.accionistas[socioPosition].Nombre = data.Nombre;
			$scope.data.accionistas[socioPosition].RazonSocial = data.Nombre;
			$scope.data.accionistas[socioPosition].ApellidoPaterno = data.ApellidoPaterno;
			$scope.data.accionistas[socioPosition].ApellidoMaterno = data.ApellidoMaterno;
			$scope.data.accionistas[socioPosition].PorParticipacion = data.PorParticipacion;//BUILDSOFT
		  }

		function setContractorData(data) {
			$scope.data.contractor.mProfesion = data.Profesion;
			$scope.data.contractor.mTelefonoFijo = data.Telefono;
			$scope.data.contractorAddress = {
				ubigeoData: {
					mDepartamento: data.Department,
					mProvincia: data.Province,
					mDistrito: data.District
				},
				mTipoVia: data.Via,
				mTipoNumero: data.NumberType,
				mNumeroDireccion : data.TextoNumero,
				mTipoInterior: data.Inside,
				mNumeroInterior: data.TextoInterior,
				mTipoZona: data.Zone,
				mNombreZona: data.TextoZona,
				mDirReferencias: data.Referencia,
				mNombreVia: data.NombreVia
			}
			$scope.data.contractor.mTipoDocumento = data.documentType;
			$scope.data.contractor.mNumeroDocumento = data.documentNumber;
			$scope.data.contractor.mNomContratante = data.Nombre;
			$scope.data.contractor.mApePatContratante = data.ApellidoPaterno;
      $scope.data.contractor.mApeMatContratante = data.ApellidoMaterno;
      $scope.data.contractor.mRazonSocial = data.Nombre;
			$scope.data.contractor.mDay = {
				Codigo: data.day.Codigo,
				id: data.day.Descripcion
			};
			$scope.data.contractor.mMonth = {
				Codigo: data.month.Codigo,
				id: data.month.Descripcion
			};
			$scope.data.contractor.mYear = {
				Codigo: data.year.Codigo,
				id: data.year.Descripcion
			};
			$scope.data.contractor.mSexo = data.Sexo == '1' ? 'H' : 'M';
			$scope.data.contractor.mCorreoElectronico = data.CorreoElectronico;
      $scope.data.contractor.mTelefonoCelular = data.Telefono2;
			$scope.data.contractor.mActividadEconomica = data.ActividadEconomica;
		}

		$scope.nextStep = function() {
			$scope.fData.markAsPristine();
			$scope.$broadcast('submitForm', true);

			if (!$scope.fData.$valid) {
				return;
			}
			if (!$scope.contractorValid){
				return;
			}
			$scope.data.encuesta = $scope.encuesta;
			$scope.$parent.fourthStep = $scope.data;
			$scope.$parent.saveState();

			$state.go('.', {
				step : 5
			});
		};
	}]);
});
