(function($root, deps, action){
    define(deps, action)
})(this, [
  'angular',
  'constants',
  'helper',
  '/polizas/app/hogar/proxy/hogarFactory.js',
  '/scripts/mpf-main-controls/components/contractorData/component/contractorData.js',
  '/scripts/mpf-main-controls/components/contractorAddress/component/contractorAddress.js'],
  function(angular, constants, helper){

    var appAutos = angular.module('appAutos');

    appAutos.controller('hogarEmitS2Controller',
      ['$scope', '$window', '$state', 'hogarFactory', '$timeout', 'mModalAlert',
      function($scope, $window, $state, hogarFactory, $timeout, mModalAlert){

        (function onLoad(){
          $scope.mainStep = $scope.mainStep || {};
          $scope.firstStep = $scope.firstStep || {};
          $scope.secondStep = $scope.secondStep || {};
          $scope.thirdStep = $scope.thirdStep || {};

          $scope.constants = $scope.constants || {};
          $scope.filters = $scope.filters || {};
          $scope.functions = $scope.functions || {};

          $scope.contractorDataValid = {};
          $scope.contractorAddressValid = {};

          loadContractorData($scope.mainStep.quotationData.Contratante)
          loadContractorAddress($scope.mainStep.quotationData.Contratante, false)

        })();

        function getBirthDate(date, option){
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

        function loadContractorData(data){
          if (typeof $scope.secondStep.contractorData == 'undefined'){
            $scope.secondStep.contractorData = {};
            $scope.secondStep.contractorData.mTipoDocumento = {Codigo: (data.TipoDocumento == '') ? null : data.TipoDocumento};
            $scope.secondStep.contractorData.mNumeroDocumento      = data.CodigoDocumento;

            if (data.TipoDocumento != constants.documentTypes.ruc.Codigo) {
              // naturalPerson
              $scope.secondStep.contractorData.mNomContratante     = data.Nombre;
              $scope.secondStep.contractorData.mApePatContratante  = data.ApellidoPaterno;
              $scope.secondStep.contractorData.mApeMatContratante  = data.ApellidoMaterno;
              $scope.secondStep.contractorData.mDay                = {id : getBirthDate(data.FechaNacimiento, 'd')};
              $scope.secondStep.contractorData.mMonth              = {id : getBirthDate(data.FechaNacimiento, 'm')};
              $scope.secondStep.contractorData.mYear               = {id : getBirthDate(data.FechaNacimiento, 'y')};
              $scope.secondStep.contractorData.mSexo               = data.Sexo == 1 ? 'H' : 'M';
              $scope.secondStep.contractorData.mProfesion          = {Codigo: (data.Profesion.Codigo == '') ? null : data.Profesion.Codigo};
            }else{
              // legalEntity
              $scope.secondStep.contractorData.mRazonSocial        = data.Nombre;
              $scope.secondStep.contractorData.mActividadEconomica = {Codigo : (data.ActividadEconomica.Codigo == '') ? null : data.ActividadEconomica.Codigo};
            }

            $scope.secondStep.contractorData.mTelefonoFijo         = data.Telefono;
            $scope.secondStep.contractorData.mTelefonoCelular      = data.Telefono2;
            $scope.secondStep.contractorData.mCorreoElectronico    = data.CorreoElectronico;
            $scope.secondStep.contractorDataClone = helper.clone($scope.secondStep.contractorData, true);
          }
        }

        function loadContractorAddress(data, notifyContractor){
          if ((typeof $scope.secondStep.contractorAddressData == 'undefined') || (notifyContractor)){
            $scope.secondStep.contractorAddressData = {}
            $scope.secondStep.contractorAddressData.mTipoVia = {Codigo: (data.Ubigeo.CodigoVia == '') ? null : data.Ubigeo.CodigoVia};
            $scope.secondStep.contractorAddressData.mNombreVia = data.Ubigeo.NombreVia;
            $scope.secondStep.contractorAddressData.mTipoNumero = {Codigo: (data.Ubigeo.CodigoNumero == '') ? null : data.Ubigeo.CodigoNumero};
            $scope.secondStep.contractorAddressData.mNumeroDireccion = data.Ubigeo.TextoNumero;
            $scope.secondStep.contractorAddressData.mTipoInterior = {Codigo: (data.Ubigeo.CodigoInterior == '') ? null : data.Ubigeo.CodigoInterior};
            $scope.secondStep.contractorAddressData.mNumeroInterior = data.Ubigeo.TextoInterior;
            $scope.secondStep.contractorAddressData.mTipoZona = {Codigo: (data.Ubigeo.CodigoZona == '') ? null : data.Ubigeo.CodigoZona};
            $scope.secondStep.contractorAddressData.mNombreZona = data.Ubigeo.TextoZona;
            $scope.secondStep.contractorAddressData.mDirReferencias = data.Ubigeo.Referencia;

            $scope.secondStep.contractorAddressDataClone = helper.clone($scope.secondStep.contractorAddressData, true);
            var isload = false;
            $scope.$watch('setterUbigeo', function() {
              if ($scope.setterUbigeo && !isload) {
                  $scope.setterUbigeo(data.Ubigeo.CodigoDepartamento, data.Ubigeo.CodigoProvincia, data.Ubigeo.CodigoDistrito);
                  isload = true;
              }
            });

            return true;
          } else {
            return false;
          }
        }

        $scope.notifyContract = function(value){
          var b = value ? true : false;
          if (!loadContractorAddress(value, b)){
            $scope.secondStep.contractorAddressData.mTipoVia = {Codigo: null}
            $scope.secondStep.contractorAddressData.mNombreVia = "";
            $scope.secondStep.contractorAddressData.mTipoNumero =  {Codigo: null};
            $scope.secondStep.contractorAddressData.mNumeroDireccion = "";
            $scope.secondStep.contractorAddressData.mTipoInterior = {Codigo: null};
            $scope.secondStep.contractorAddressData.mNumeroInterior = "";
            $scope.secondStep.contractorAddressData.mTipoZona = {Codigo: null}
            $scope.secondStep.contractorAddressData.mNombreZona = "";
            $scope.secondStep.contractorAddressData.mDirReferencias = "";
            $scope.cleanUbigeo();
          }
        }

        /*#########################
        # changeData
        #########################*/
        function changeData(){
          var vIsEqual = false;
          var contractorData = _.isEqual($scope.secondStep.contractorDataClone, $scope.secondStep.contractorData);
          var contractorAddressData = _.isEqual($scope.secondStep.contractorAddressDataClone, $scope.secondStep.contractorAddressData);
          vIsEqual = contractorData && contractorAddressData;
          return !vIsEqual;
        }


        /*#########################
        # Steps
        #########################*/
        $scope.$on('changingStep', function(ib,e){
          if (e.step !== '2') {
            if (e.step > 2){
              if (!$scope.validationForm()){
                e.cancel = true;
              } else {
                if (e.step > $scope.mainStep.stepActive) {
                  e.cancel = true;
                }
              }
            } else {
              if(!$scope.validationForm() || changeData()){
                $scope.mainStep.stepActive = 2;
              }
            }
          }
        });


        /*#########################
        # ValidationForm
        #########################*/
        $scope.validationForm = function(){
          return $scope.contractorDataValid.func() && $scope.contractorAddressValid.func();
        };

        /*#########################
        # nextStep
        #########################*/
        $scope.nextStep = function(){
          if ($scope.validationForm()){
            $scope.mainStep.stepActive = 3;
            $scope.secondStep.contractorDataClone = helper.clone($scope.secondStep.contractorData, true);
            $scope.secondStep.contractorAddressDataClone = helper.clone($scope.secondStep.contractorAddressData, true);
            $state.go('.', {
              step: 3
            });
          }
        }
    }]);

  });
