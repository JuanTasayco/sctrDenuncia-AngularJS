'use strict';

define([
	'angular', 'constants',
	'/scripts/mpf-main-controls/components/contractorData/service/contractorDataFactory.js', 'lodash'
], function(angular, constants, factory, _){

	// var appComponents = angular.module('mapfre.components');
	var appControls = angular.module('mapfre.controls');

	appControls.controller('ctrlContractorData',
	['$scope', 'contractorDataFactory','$window', '$state', '$injector', '$attrs', 'mainServices',
	function($scope, contractorDataFactory, $window, $state, $injector, $attrs, mainServices){

		var _self = this;

		$scope.requiredEmail = true;
		$scope.requiredCelular = true;
		$scope.title = "Datos del contratante";
		if(_self.abonado) {
			$scope.mostrarAbonado = _self.abonado.show ? true : false;
    		$scope.requireAbonado = _self.abonado.isRequired;
		}

		$scope.title2 = "Contacto";

		if(angular.isUndefined(_self.formName)){
			_self.formName = 'frmContractor'
		}
		$scope.$watch(_self.formName, function(){
			$scope.currentForm = $scope[_self.formName];
		}, true)

		$scope.$watch('$ctrl.data', function(newValue, oldValue){
			if(typeof newValue != 'undefined'){
				_self.newValue = newValue;
				if (newValue.mTipoDocumento) {
          var numDocValidations = {};
          mainServices.documentNumber.fnFieldsValidated(numDocValidations, newValue.mTipoDocumento.Codigo, 1);
          $scope.docNumMaxLength = numDocValidations.DOCUMENT_NUMBER_MAX_LENGTH;
          $scope.docNumMinLength = numDocValidations.DOCUMENT_NUMBER_MIN_LENGTH;
          $scope.docNumType = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE;
          $scope.docNumTypeDisabled = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE_DISABLED;
        }

				if (typeof newValue.mNumeroDocumento !== 'undefined' && newValue.mNumeroDocumento.length > 0)
					_self.data.searchedPerson = true;
			}
    	});


		// checando modificacion del obj
		$scope.$watch('$ctrl.data', function(newValue, oldValue){
			if (_self.data && _self.data.mActividadEconomica && _self.data.mActividadEconomica.Codigo && _self.economicActivityData) {
				_self.data.mActividadEconomica = seleccionarCombo(_self.economicActivityData, 'Codigo', _self.data.mActividadEconomica.Codigo);
			}
			checkNaturalRucPerson();
		}, true);


		function initVar(){
			if (_self.data) {
				checkNaturalRucPerson();
			}
		}

		_self.isValid = _self.isValid ? _self.isValid : {};

		_self.isValid.func = function(){
			$scope.currentForm.markAsPristine();
			return $scope.currentForm.$valid
		};

		_self.gLblTipoDocumento = {
	      label:'Tipo de Documento',
	      required: true,
	      error1: '* Este campo es obligatorio',
	      defaultValue: '- SELECCIONE -'
	    };

		function loadData(){
      if(_self.data && _self.data.mNumeroDocumento) {
        if($state.current.appCode === constants.module.polizas.autos.description){

          if (_self.data.showNaturalRucPerson) {
            if(_self.data.mNomContratante) {
              _self.data.mDay = _self.data.mDay || undefined;
              _self.data.mMonth = _self.data.mMonth || undefined;
              _self.data.mYear = _self.data.mYear || undefined;
            }else{
              _self.data.mNomContratante = _self.data.nombre;
              _self.data.mApePatContratante = _self.data.apellidoPaterno;
              _self.data.mApeMatContratante = _self.data.apellidoMaterno;

              _self.data.fechas = (_self.data && _self.data.fechaNacimiento) ?_.map(_self.data.fechaNacimiento.split('/'), function (c) {
                return '' + c;
              }) : '';

              _self.data.mDay = {id: _self.data.fechas[0]};
              _self.data.mMonth = {id: _self.data.fechas[1]};
              _self.data.mYear = {id: _self.data.fechas[2]};
            }

            _self.data.mSexo = (_self.data.sexo && _self.data.sexo ==="1") ? 'H' : 'M';//H Masculino M Mujer
          } else {
            _self.data.mRazonSocial = _self.data.nombre || _self.data.mRazonSocial;
          }
        }
      }

			$window.setTimeout(function(){
				contractorDataFactory.getDocumentTypes().then(function(response){
					_self.documentTypeData = response.Data;

					if($state.params.tipo && _self.data && _self.urlParams != false){
						_self.data.mTipoDocumento = _self.data.mTipoDocumento != undefined ?_self.data.mTipoDocumento : _self.documentTypeData.find(function(tipo) { return  tipo.Codigo === $state.params.tipo});
						_self.data.mNumeroDocumento = _self.data.mNumeroDocumento != undefined ? _self.data.numeroDocumento : $state.params.numero;
						$scope.inferData();
					} else {
						if ($state.params.tipo === '') {_self.data.mTipoDocumento = {Codigo: null};}
					}
				});

				//profession
				contractorDataFactory.getProfessions().then(function(response){
					if (response.OperationCode === constants.operationCode.success) {
						_self.professionData = response.Data;
					}
				});
				//economicActivity
				contractorDataFactory.getEconomicsActivities().then(function(response){
		            _self.economicActivityData = response.Data;
		            if (_self.data && _self.data.mActividadEconomica) {
		              _self.data.mActividadEconomica = seleccionarCombo(_self.economicActivityData, 'Codigo', _self.data.mActividadEconomica.Codigo);
		            }
				});

				$scope.requiredEmail = _self.emailRequired;
				$scope.requiredCelular = angular.isUndefined(_self.celularRequired) ? true : _self.celularRequired;
				$scope.onlyContractor = _self.onlyContractor;
				$scope.title = _self.title || $scope.title;
				$scope.title2 = _self.title2 || $scope.title2;

				$scope.$apply();
			})

			_self.dayData = contractorDataFactory.getDays();
			_self.monthData =contractorDataFactory.getMonths();
			_self.yearData = contractorDataFactory.getYears();
    }

    function seleccionarCombo(arr, prop, cod) {
      	return _.find(arr, function(item) {
	        // HACK: aplicamos coercion porque el cod puede ser string o int
	        return item[prop] == cod;
	     });
    }


	initVar();
	loadData();


	function spinner(){
		var injector, mpSpin;
		try{
			injector = angular.injector(['oim.theme.service']);
			mpSpin = injector.get('mpSpin');
		} finally{ }
		return {
			start: function(){
				if (mpSpin) mpSpin.start();
			},
			end: function(){
				if (mpSpin) mpSpin.end();
			}
		}
	}
	function checkNaturalRucPerson(){
		if(_self.data){
			if (_self.data.mTipoDocumento && _self.data.mNumeroDocumento){
				_self.data.showNaturalRucPerson = mainServices.fnShowNaturalRucPerson(_self.data.mTipoDocumento.Codigo, _self.data.mNumeroDocumento);
			}else{
				_self.data.showNaturalRucPerson = true;
			}
		}
	}
	$scope.clear = function(cbo){
		if (cbo) _self.data.mNumeroDocumento = '';
		_self.data.mNomContratante = "";
		_self.data.mApePatContratante = "";
		_self.data.mApeMatContratante = "";
		_self.data.mSexo = null;
		_self.data.mProfesion = {Codigo: null};
		_self.data.mTelefonoFijo = "";
		_self.data.mTelefonoCelular = "";
		_self.data.saldoMapfreDolares = undefined;
		_self.data.mCorreoElectronico = "";
		_self.data.mDay = {id: null} ;
		_self.data.mMonth = {id: null};
		_self.data.mYear = {id: null};
		_self.data.mRazonSocial = "";
		_self.data.mActividadEconomica = {Codigo: null};
		_self.data.mScore = "";

		if (angular.isFunction(_self.notifyClean))
			_self.notifyClean();
	};

	$scope.currentDoc = {};
	$scope.clean = function(){
		_self.data.searchedPerson = false;
		_self.data.mTipoDocumento = {Codigo: null};
		$scope.currentDoc["number"] = undefined	;
		$scope.currentDoc["type"] = undefined;
		$scope.clear(true);

	};
	$scope.inferData = function(cbo){
		(cbo) ? cbo = true : false;

		var documentValue = _self.data.mNumeroDocumento;
    var documentType = _self.data.mTipoDocumento && _self.data.mTipoDocumento.Codigo? _self.data.mTipoDocumento.Codigo:  null;

    var numDocValidations = {};
    mainServices.documentNumber.fnFieldsValidated(numDocValidations, documentType, 1);

    $scope.docNumMaxLength = numDocValidations.DOCUMENT_NUMBER_MAX_LENGTH;
    $scope.docNumMinLength = numDocValidations.DOCUMENT_NUMBER_MIN_LENGTH;
    $scope.docNumType = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE;
    $scope.docNumTypeDisabled = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE_DISABLED;
		if (_self.infer === true &&
			documentValue 		 &&
			documentValue != ""  &&
			documentType  &&
			($scope.currentDoc["number"] !== documentValue ||
			$scope.currentDoc["type"] !== documentType) )
			{

				spinner().start();
				_self.data.showNaturalRucPerson = mainServices.fnShowNaturalRucPerson(documentType, documentValue);

				$scope.currentDoc = {"number": documentValue, type : documentType };

				if($state.current.appCode == constants.module.polizas.soat.description){//'SOAT'){
					if(documentValue) {
						var params = {
							CodigoCompania: 1,
							TipoDocumento: documentType,
							CodigoDocumento: documentValue
						};
						contractorDataFactory.getContractorSoat(params).then(function(r){
							var value = r.Data
							if (value){
								_self.data.value = value;
								_self.data.searchedPerson = true;
								_self.data.mRazonSocial = value.Nombre;
								_self.data.mActividadEconomica = {Codigo: value.ActividadEconomica.Codigo == '' ? null: value.ActividadEconomica.Codigo};
								_self.data.mNomContratante = value.Nombre;
								_self.data.mApePatContratante = value.ApellidoPaterno;
								_self.data.mApeMatContratante = value.ApellidoMaterno;
								_self.data.mSexo =value.Sexo ==1 ? "H" : "M";
								_self.data.mProfesion = {Codigo: value.Profesion ? value.Profesion.Codigo : _self.data.mProfesion};
								_self.data.mTelefonoFijo = value.Telefono;
								_self.data.mTelefonoCelular = value.Telefono2;
								_self.data.saldoMapfreDolares = isNaN(parseFloat(value.SaldoMapfreDolar))? 0 : parseFloat(value.SaldoMapfreDolar) ;

								_self.data.mCorreoElectronico = value.CorreoElectronico;
								_self.data.showScore = false;

								var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
								if (value.FechaNacimiento){
									var d =  new Date(value.FechaNacimiento.replace(pattern, '$3-$2-$1T00:00:00'));
									_self.data.mDay = {id: d.getDate()} ;
									_self.data.mMonth = {id: d.getMonth() + 1};
									_self.data.mYear = {id: d.getFullYear()};
								}

							}
							else{
								$scope.clear(cbo);
							}
							if(angular.isFunction(_self.notifyInfer)){
								_self.notifyInfer(value);
							}
							spinner().end();
						})
					}
				}else{
					if($state.current.appCode == constants.module.polizas.autos.description){
						contractorDataFactory.getContractorAutos2(documentType, documentValue).then(function(r){
						  if(r.OperationCode === 200) {
                var value = r.Data
                if (value){
                  _self.data.value = value;
                  _self.data.searchedPerson = true;
                  _self.data.mRazonSocial = value.Nombre;
                  _self.data.mActividadEconomica = {Codigo: value.ActividadEconomica.Codigo == '' ? null: value.ActividadEconomica.Codigo};
                  _self.data.mNomContratante = value.Nombre;
                  _self.data.mApePatContratante = value.ApellidoPaterno;
                  _self.data.mApeMatContratante = value.ApellidoMaterno;
                  _self.data.mSexo =value.Sexo ==1 ? "H" : "M";
                  _self.data.mProfesion = {Codigo: value.Profesion ? value.Profesion.Codigo : _self.data.mProfesion}
                  _self.data.mTelefonoFijo = value.Telefono;
                  _self.data.mTelefonoCelular = value.Telefono2;
                  _self.data.saldoMapfreDolares = isNaN(parseFloat(value.SaldoMapfreDolar))? 0 : parseFloat(value.SaldoMapfreDolar) ;
                  _self.data.mCorreoElectronico = value.CorreoElectronico;
                  _self.data.mScore = (value.Score == -1) ? '' : value.Score;
                  _self.data.showScore = true;

                  var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
                  if (value.FechaNacimiento){
                    var d =  new Date(value.FechaNacimiento.replace(pattern, '$3-$2-$1T00:00:00'));
                    _self.data.mDay = {id: d.getDate()} ;
                    _self.data.mMonth = {id: d.getMonth() + 1};
                    _self.data.mYear = {id: d.getFullYear()};
                  }

                }
                else{
                  $scope.clear(cbo);
                }

                if(angular.isFunction(_self.notifyInfer)){
                  _self.notifyInfer(value);
                }
              } else {
						    _self.enableBlockFileds = false;
                _self.data.searchedPerson = true;
                _self.data.mRazonSocial = (_self.data && _self.data.nombre) ? _self.data.nombre : '';
              }

              spinner().end();
						});
					}else{
						contractorDataFactory.getContractor(documentType, documentValue).then(function(r){
							var value = r.Data;
							if (value){
								_self.data.value = value;
								_self.data.searchedPerson = true;
								_self.data.mRazonSocial = value.Nombre;
								_self.data.mActividadEconomica = {Codigo: value.ActividadEconomica.Codigo == '' ? null: value.ActividadEconomica.Codigo};
								_self.data.mNomContratante = value.Nombre;
								_self.data.mApePatContratante = value.ApellidoPaterno;
								_self.data.mApeMatContratante = value.ApellidoMaterno;
								_self.data.mSexo =value.Sexo ==1 ? "H" : "M";
								_self.data.mProfesion = {Codigo: value.Profesion ? value.Profesion.Codigo : _self.data.mProfesion}
								_self.data.mTelefonoFijo = value.Telefono;
								_self.data.mTelefonoCelular = value.Telefono2;
								_self.data.saldoMapfreDolares = isNaN(parseFloat(value.SaldoMapfreDolar))? 0 : parseFloat(value.SaldoMapfreDolar) ;
								_self.data.mCorreoElectronico = value.CorreoElectronico;

								var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
								if (value.FechaNacimiento){
									var d =  new Date(value.FechaNacimiento.replace(pattern, '$3-$2-$1T00:00:00'));
									_self.data.mDay = {id: d.getDate()} ;
									_self.data.mMonth = {id: d.getMonth() + 1};
									_self.data.mYear = {id: d.getFullYear()};
								}

							}
							else{
								$scope.clear(cbo);
							}

							if(angular.isFunction(_self.notifyInfer)){
								_self.notifyInfer(value);
							}

							spinner().end();
						});
					}
				}

			if(_self.abonado) {
      			// Si el módulo es hogar
				if (_self.abonado.show) {
        			$scope.requireAbonado = _self.abonado.isRequired;
					$scope.mostrarAbonado = true;
				}
				else {
					$scope.mostrarAbonado = false;
				}
			}
		}
	}

	}]).component('mpfContractorData',{
		templateUrl: function($element, $attrs){
			return '/scripts/mpf-main-controls/components/contractorData/component/contractorData.html'
		},
		controller: 'ctrlContractorData',
		bindings: {
			data: '=',
			infer: '=',
			isValid : '=',
			notifyInfer: '=',
			notifyClean: '=?',
			enableBlockFileds: '=?',
			abonado: '=?',
			emailRequired: '=',
			celularRequired: '=?',
			title: '@',
			title2: '@',
			formName: '@',
			urlParams: '=?'
		}
	})
});
