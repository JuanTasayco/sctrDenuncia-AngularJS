(function($root, deps, action) {
  define(deps, action);
})(
  this,
  [
    'angular',
    'constants',
    'helper',
    'mpfPersonConstants',
    '/polizas/app/hogar/proxy/hogarFactory.js',
    '/polizas/app/autos/autosEmitirUsado/component/groupPolize/groupPolize.js',
    '/scripts/mpf-main-controls/components/contractorData/component/contractorData.js',
    '/scripts/mpf-main-controls/components/contractorAddress/component/contractorAddress.js',
    'mpfPersonComponent'
  ],
  function(angular, constants, helper, personConstants) {
    var appAutos = angular.module('appAutos');

    appAutos.controller('hogarEmitt2Controller', [
      '$scope',
      '$state',
      'hogarFactory',
      'mModalAlert',
      'mainServices',
      'proxyGeneral',
      function($scope, $state, hogarFactory, mModalAlert, mainServices, proxyGeneral) {
        (function onLoad() {
          $scope.mainStep = $scope.mainStep || {};
          $scope.firstStep = $scope.firstStep || {};
          $scope.secondStep = $scope.secondStep || {};
          $scope.thirdStep = $scope.thirdStep || {};
          if ($state.params.paramsHogarEmit) {
            $scope.formData = $scope.formData || {};
            $scope.formData.contractorData = $scope.formData.contractorData || {};
            $scope.formData.dataContractorAddress = $scope.formData.dataContractorAddress || {};

            $scope.constants = $scope.constants || {};
            $scope.filters = $scope.filters || {};
            $scope.functions = $scope.functions || {};

            $scope.secondStep.numDoc = $state.params.numDocument;
            $scope.secondStep.dataStepOne = $state.params.paramsHogarEmit;
            $scope.secondStep.abonado = {};
            $scope.secondStep.abonado.isRequired =
              $scope.secondStep.dataStepOne.Hogar.FlagAlarmaMonitoreo == 'S' ? true : false;
            $scope.secondStep.abonado.show = true;

            $scope.secondStep.DctoIntegralidad =
              $state.params.paramsHogarEmit.MarcaPorDctoIntegralidad == 'S' ? true : false;

            $scope.secondStep.MarcaPorDctoIntegralidad = $state.params.paramsHogarEmit.MarcaPorDctoIntegralidad;
            $scope.secondStep.PorDctoIntgPlaza = $state.params.paramsHogarEmit.PorDctoIntgPlaza;
          } else {
            $state.go('hogarEmitt1', {
              numDocument: $state.params.numDocument
            });
          }

          $scope.appCode = personConstants.aplications.HOGAR;
          $scope.formCode = personConstants.forms.EMI_HOG_CN;
          $scope.companyCode = constants.module.polizas.hogar.codeCompany;

          $scope.formData['contractorData'] = {};
          $scope.formData['contractorData'].contractorValid = false;

          $scope.$on('personForm', function(event, data) {
            if(data){
              $scope.formData['contractorData'].contractorValid = data.valid;
              setFormData('contractorData', 'dataContractorAddress', data.datosPoliza);
            }
          });

          $scope.$on('nextStepFromBlackList', function(event, data) {
            if ($scope.frmSecondStep.$valid && $scope.formData['contractorData'].contractorValid) {
              $state.go('hogarEmitt3', {
                numDocument: $scope.secondStep.numDoc,
                paramsHogarEmit: {
                  contractorData: $scope.formData.contractorData,
                  contractorAddressData: $scope.formData.dataContractorAddress,
                  dataStepOne: $scope.secondStep.dataStepOne,
                  dataStepTwo: $scope.secondStep
                }
              });
            }
          });

        })();

        function setFormData(name, address, data) {
          $scope.formData[name].mNomContratante = data.Nombre;
          $scope.formData[name].mRazonSocial = data.Nombre;
          $scope.formData[name].mApePatContratante = data.ApellidoPaterno;
          $scope.formData[name].mApeMatContratante = data.ApellidoMaterno;
          $scope.formData[name].mDay = {
            Codigo: data.day ? data.day.Codigo : '',
            id: data.day ? data.day.Descripcion : ''
          };
          $scope.formData[name].mMonth = {
            Codigo: data.month ? data.month.Codigo : '',
            id: data.month ? data.month.Descripcion : ''
          };
          $scope.formData[name].mYear = {
            Codigo: data.year ? data.year.Codigo : '',
            id: data.year ? data.year.Descripcion : ''
          };
          $scope.formData[name].Sexo = data.Sexo == '1' ? 'H' : 'M';
          $scope.formData[name].mTipoDocumento = data.documentType;
          $scope.formData[name].mNumeroDocumento = data.documentNumber;
          $scope.formData[name].mTelefonoFijo = data.Telefono;
          $scope.formData[name].mTelefonoCelular = data.Telefono2;
          $scope.formData[name].mCorreoElectronico = data.CorreoElectronico;
          $scope.formData[name].mProfesion = data.Profesion;
          $scope.formData[name].mActividadEconomica = data.ActividadEconomica;
          $scope.formData[name].SaldoMapfreDolar = data.ImporteMapfreDolar
          $scope.formData[address] = {
            ubigeoData: {}
          }

          $scope.formData[address].mTipoNumero = data.NumberType;
          $scope.formData[address].mNumeroDireccion = data.Ubigeo.TextoNumero;
          $scope.formData[address].mTipoInterior = data.Inside;
          $scope.formData[address].mNumeroInterior = data.Ubigeo.TextoInterior;
          $scope.formData[address].mTipoZona = data.Zone;
          $scope.formData[address].mNombreZona = data.Ubigeo.TextoZona;
          $scope.formData[address].mDirReferencias = data.Ubigeo.Referencia;
          $scope.formData[address].mTipoVia = data.Via;
          $scope.formData[address].mNombreVia = data.NombreVia;
          $scope.formData[address].ubigeoData.mDepartamento = data.Department;
          $scope.formData[address].ubigeoData.mProvincia = data.Province;
          $scope.formData[address].ubigeoData.mDistrito = data.District;
        }

        var paramsGetContractor = {
          codeCompany: constants.module.polizas.hogar.codeCia,
          documentType: $scope.secondStep.dataStepOne.Contratante.TipoDocumento,
          documentNumber: $scope.secondStep.dataStepOne.Contratante.CodigoDocumento
        };


        function getBirthDate(date, option) {
          var r = null;
          if (date && option) {
            var vDate = date.split('/');
            switch (option) {
              case 'd':
                r = vDate[0];
                break;
              case 'm':
                r = vDate[1];
                break;
              case 'y':
                r = vDate[2];
                break;
            }
          }
          return parseInt(r);
        }

        $scope.notifyContract = function() {
          if ($scope.formData.contractorData.value) {
            $scope.secondStep.codDepartment = $scope.formData.contractorData.value.Ubigeo.CodigoDepartamento;
            $scope.secondStep.codProvince = $scope.formData.contractorData.value.Ubigeo.CodigoProvincia;
            $scope.secondStep.codDistrict = $scope.formData.contractorData.value.Ubigeo.CodigoDistrito;

            $scope.setterUbigeo(
              $scope.secondStep.codDepartment,
              $scope.secondStep.codProvince,
              $scope.secondStep.codDistrict
            );

            $scope.formData.dataContractorAddress.mTipoVia = {
              Codigo: $scope.formData.contractorData.value.Ubigeo.CodigoVia
            };
            $scope.formData.dataContractorAddress.mTipoNumero = {
              Codigo: $scope.formData.contractorData.value.Ubigeo.CodigoNumero
            };
            $scope.formData.dataContractorAddress.mTipoInterior = {
              Codigo: $scope.formData.contractorData.value.Ubigeo.CodigoInterior
            };
            $scope.formData.dataContractorAddress.mTipoZona = {
              Codigo: $scope.formData.contractorData.value.Ubigeo.CodigoZona
            };

            $scope.formData.dataContractorAddress.mNombreVia =
              $scope.formData.contractorData.value.Ubigeo.ViaDescripcion;
            $scope.formData.dataContractorAddress.mNumeroDireccion =
              $scope.formData.contractorData.value.Ubigeo.TextoNumero;
            $scope.formData.dataContractorAddress.mNumeroInterior =
              $scope.formData.contractorData.value.Ubigeo.TextoInterior;
            $scope.formData.dataContractorAddress.mNombreZona =
              $scope.formData.contractorData.value.Ubigeo.ZonaDescripcion;
            $scope.formData.dataContractorAddress.mDirReferencias =
              $scope.formData.contractorData.value.Ubigeo.Referencia;
          }
        };

        $scope.cleanContract = function() {
          var data = $scope.formData;
          data.dataContractorAddress.mTipoInterior = { Codigo: null };
          data.dataContractorAddress.mTipoNumero = { Codigo: null };
          data.dataContractorAddress.mTipoVia = { Codigo: null };
          data.dataContractorAddress.mTipoZona = { Codigo: null };
          data.dataContractorAddress.mDirReferencias = '';
          data.dataContractorAddress.mNumeroInterior = '';
          data.dataContractorAddress.mNumeroDireccion = '';
          data.dataContractorAddress.mNombreZona = '';
          data.dataContractorAddress.mNombreVia = '';
          $scope.formData.contractorData.mAbonado = '';

          $scope.cleanUbigeo();
          return;
        };

        $scope.getContractorData = function(data) {
          //$scope.formData['contractorData'] = {};
          $scope.formData.contractorData['mTipoDocumento'] = data.documentType;
          $scope.formData.contractorData['mNroDocumento'] = data.documentNumber;
        }

        $scope.obtenerDctontegralidad = function() {
          if ($scope.secondStep.DctoIntegralidad) {
            proxyGeneral
              .ObtenerDescuentoIntegralidad(
                constants.module.polizas.hogar.codeCia,
                $scope.secondStep.dataStepOne.Agente.CodigoAgente,
                constants.module.polizas.hogar.codeRamo,
                $scope.formData.contractorData.mTipoDocumento.Codigo,
                $scope.secondStep.dataStepOne.Contratante.CodigoDocumento,
                true
              )
              .then(function(response) {
                if (response.OperationCode == constants.operationCode.success) {
                  $scope.secondStep.PorDctoIntgPlaza = response.Data;
                }
              })
              .catch(function(error) {
                console.log('Error en obtenerDctontegralidad: ' + error);
              });
          }
        };

        $scope.nextStep = function() {
          $scope.$broadcast('submitForm', true);
          $scope.frmSecondStep.markAsPristine();
          if ($scope.frmSecondStep.$valid && $scope.formData['contractorData'].contractorValid /*$scope.validarTelefonos()*/) {
            $state.go('hogarEmitt3', {
              numDocument: $scope.secondStep.numDoc,
              paramsHogarEmit: {
                contractorData: $scope.formData.contractorData,
                contractorAddressData: $scope.formData.dataContractorAddress,
                dataStepOne: $scope.secondStep.dataStepOne,
                dataStepTwo: $scope.secondStep
              }
            });
          } /*else {
            mModalAlert.showInfo('', 'Debes completar todos los campos correctamente');
          }*/
        };

        $scope.validarTelefonos = function () {
          var fijo =  $scope.formData['contractorData'].mTelefonoFijo;
          var celular =   $scope.formData['contractorData'].mTelefonoCelular;
          if(celular !== undefined && celular !== '' && celular !== null){
            return true;
          }
          if(fijo !== undefined && fijo !== '' && fijo !== null) {
            return true;
          }
          return false;
        };

      }
    ]);
  }
);
