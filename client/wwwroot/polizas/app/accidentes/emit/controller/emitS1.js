(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper', 'mpfPersonConstants',
  '/scripts/mpf-main-controls/components/contractorData/component/contractorData.js',
  '/scripts/mpf-main-controls/components/contractorAddress/component/contractorAddress.js',
  '/polizas/app/accidentes/quote/service/accidentesFactory.js',
  '/polizas/app/accidentes/doc/service/accidentesGuardadoFactory.js',
  'mpfPersonComponent'],
  function(angular, constants, helper, personConstants){

    var appAutos = angular.module('appAutos');

    appAutos.controller('accidentesEmitS1Controller',
      ['$scope', '$window', '$state', '$timeout', '$rootScope', 'mModalAlert', '$stateParams', 'accidentesFactory', 'accidentesGuardadoFactory', 'mpSpin', 'mainServices',
      function($scope, $window, $state, $timeout, $rootScope, mModalAlert, $stateParams, accidentesFactory, accidentesGuardadoFactory, mpSpin, mainServices){

      (function onLoad(){
        $scope.formData = $rootScope.formData || {};
        $scope.formData.dataContractor2 || ($scope.formData.dataContractor2 = {});
        $scope.contractorValid = false;

        $scope.addressValid = {}

        $scope.formData.dataContractor = $scope.formData.dataContractor || {};

        $scope.formData.contractorAddress = $scope.formData.contractorAddress || {};

        disableNextStep();

        $scope.cleanContract = function(){
            var data = $scope.formData
            data.contractorAddress.mTipoInterior = {Codigo: null}
            data.contractorAddress.mTipoNumero =  {Codigo: null};
            data.contractorAddress.mTipoVia = {Codigo: null}
            data.contractorAddress.mTipoZona = {Codigo: null}
            data.contractorAddress.mDirReferencias = "";
            data.contractorAddress.mNumeroInterior = "";
            data.contractorAddress.mNumeroDireccion = "";
            data.contractorAddress.mNombreZona = "";
            data.contractorAddress.mNombreVia = "";

            $scope.formData.dataContractor2 = {};
            $scope.cleanUbigeo();
            return;
        }

        $scope.notifyContract = function(value){

            var data = $scope.formData
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

        if(!$scope.formData.validatedPaso1){
          $scope.formData.PrimaNetaIndividual = 0;
          $scope.formData.PrimaNeta = 0;
          $scope.formData.PrimaTotal = 0;

          $scope.formData.riesgos = [];
        }

        if(!$scope.formData.cargados){
          $scope.formData.fileRiesgo = [];
        }

        $scope.formData.quotationNumber =  $stateParams.quotationNumber;

        buscarDocumento();

        if(typeof $scope.formData.mOpcionMapfreDolares == 'undefined'){
          $scope.formData.mOpcionMapfreDolares = 'No';
          $scope.formData.mMapfreDolares = 0;
        }

        if($scope.formData.mMapfreDolares == 0){
          $scope.formData.mOpcionMapfreDolares = 'No';
          $scope.formData.mMapfreDolares = 0;
        }

        $scope.formData.isPersonData = $scope.formData.dataContractor.mTipoDocumento && $scope.formData.dataContractor.mNumeroDocumento;

        if ($scope.formData.isPersonData) {
          loadPersonData();
        }

        $scope.companyCode = constants.module.polizas.accidentes.companyCode;
        $scope.appCode = personConstants.aplications.ACCIDENTES;
        $scope.formCode = personConstants.forms.EMI_ACC_CN;

        $scope.$on('personForm', function(event, data) {
          $scope.contractorValid = data.valid;
          setFormData(data.datosContratante, data.legalPerson);
        });

      })();

      function setFormData(data, isCompany) {
        $scope.formData.dataContractor2 = {};
        $scope.formData.dataContractor = {};

        $scope.formData.dataContractor2 = setSearch(data);

        if (typeof $scope.formData.dataContractor != 'undefined'){
          $scope.formData.dataContractor.showNaturalRucPerson = mainServices.fnShowNaturalRucPerson($scope.formData.quote.Contratante.TipoDocumento, $scope.formData.quote.Contratante.CodigoDocumento);

          $scope.formData.dataContractor.mTipoDocumento = data.documentType;
          $scope.formData.dataContractor.mNumeroDocumento = data.documentNumber;

          if (!isCompany) {
            $scope.formData.dataContractor.mNomContratante = $scope.formData.dataContractor2.Nombre,
            $scope.formData.dataContractor.mApePatContratante = $scope.formData.dataContractor2.ApellidoPaterno,
            $scope.formData.dataContractor.mApeMatContratante = $scope.formData.dataContractor2.ApellidoMaterno,
            $scope.formData.dataContractor.mDay = {id : getBirthDate($scope.formData.dataContractor2.FechaNacimiento, 'd'), description: $scope.formData.dataContractor2.FechaNacimiento.split('/')[0] };
            $scope.formData.dataContractor.mMonth = {id : getBirthDate($scope.formData.dataContractor2.FechaNacimiento, 'm'), description: $scope.formData.dataContractor2.FechaNacimiento.split('/')[1] };
            $scope.formData.dataContractor.mYear = {id : getBirthDate($scope.formData.dataContractor2.FechaNacimiento, 'y'), description: getBirthDate($scope.formData.dataContractor2.FechaNacimiento, 'y') };
            $scope.formData.dataContractor.mSexo = $scope.formData.dataContractor2.Sexo == 1 ? 'H' : 'M';

            if (typeof $scope.formData.dataContractor2.Profesion !== 'undefined'){
              $scope.formData.dataContractor.mProfesion = $scope.formData.dataContractor2.Profesion;
            }

            if($scope.formData.showNaturalRucPerson && $scope.formData.dataContractor.mTipoDocumento.Codigo == constants.documentTypes.ruc.Codigo){
              $scope.formData.dataContractor.mRazonSocial = $scope.formData.dataContractor2.Nombre;
            }
          }
          else{
            $scope.formData.dataContractor.mRazonSocial = $scope.formData.dataContractor2.Nombre,
            $scope.formData.dataContractor.mActividadEconomica = {Codigo : ($scope.formData.dataContractor2.ActividadEconomica.Codigo == '') ? null : $scope.formData.dataContractor2.ActividadEconomica.Codigo};
          }

          $scope.formData.dataContractor.mTelefonoFijo = $scope.formData.dataContractor2.Telefono;
          $scope.formData.dataContractor.mTelefonoCelular = $scope.formData.dataContractor2.Telefono2;
          $scope.formData.dataContractor.mCorreoElectronico = $scope.formData.dataContractor2.CorreoElectronico;

          $scope.formData.dataContractorClone = helper.clone($scope.formData.dataContractor, true);
        }

        if (typeof $scope.formData.dataContractorAddress == 'undefined'){
          $scope.formData.contractorAddress = {
            ubigeoData: {
              mDepartamento: data.Department,
              mProvincia: data.Province,
              mDistrito: data.District
            },
            mTipoVia: {
              Codigo: ($scope.formData.dataContractor2.Ubigeo.CodigoVia == '') ? null : $scope.formData.dataContractor2.Ubigeo.CodigoVia,
              Descripcion: $scope.formData.dataContractor2.Ubigeo.ViaDescripcion
            },
            mNombreVia: $scope.formData.dataContractor2.Ubigeo.NombreVia,
            mTipoNumero: {
              Codigo: ($scope.formData.dataContractor2.Ubigeo.CodigoNumero == '') ? null : $scope.formData.dataContractor2.Ubigeo.CodigoNumero,
              Descripcion: $scope.formData.dataContractor2.Ubigeo.NumeroDescripcion
            },
            mNumeroDireccion: $scope.formData.dataContractor2.Ubigeo.TextoNumero,
            mTipoInterior: {
              Codigo: ($scope.formData.dataContractor2.Ubigeo.CodigoInterior == '') ? null : $scope.formData.dataContractor2.Ubigeo.CodigoInterior,
              Descripcion: $scope.formData.dataContractor2.Ubigeo.InteriorDescripcion
            },
            mNumeroInterior:  $scope.formData.dataContractor2.Ubigeo.TextoInterior,
            mTipoZona: {
              Codigo: ($scope.formData.dataContractor2.Ubigeo.CodigoZona == '') ? null : $scope.formData.dataContractor2.Ubigeo.CodigoZona,
              Descripcion: $scope.formData.dataContractor2.Ubigeo.ZonaDescripcion
            },
            mNombreZona:      $scope.formData.dataContractor2.Ubigeo.TextoZona,
            mDirReferencias:  $scope.formData.dataContractor2.Ubigeo.Referencia
          };
          $scope.formData.dataContractorAddressClone = helper.clone($scope.formData.dataContractorAddress, true);
        }
      }

      function loadPersonData(){
        var data = $scope.formData.dataContractor;
        var address = $scope.formData.contractorAddress;

        $scope.formData.personData = {
          TipoDocumento: data.mTipoDocumento,
          CodigoDocumento: data.mNumeroDocumento,
          ActividadEconomica: data.mActividadEconomica,
          ApellidoPaterno: data.mApePatContratante,
          ApellidoMaterno: data.mApeMatContratante,
          Nombre: data.mNomContratante || data.mRazonSocial,
          CorreoElectronico: data.mCorreoElectronico,
          Telefono: data.mTelefonoFijo,
          Telefono2: data.mTelefonoCelular,
          Sexo: data.mSexo === "H" ? "1" : "0",
          Profesion: data.mProfesion,
          Ubigeo: {
            CodigoDepartamento: address.ubigeoData.mDepartamento.Codigo,
            CodigoProvincia: address.ubigeoData.mProvincia.Codigo,
            CodigoDistrito: address.ubigeoData.mDistrito.Codigo,
            CodigoVia: address.mTipoVia ? address.mTipoVia.Codigo : "",
            ViaDescripcion: address.mTipoVia ? address.mTipoVia.Descripcion : "",
            NombreVia: address.mNombreVia,
            CodigoNumero: address.mTipoNumero ? address.mTipoNumero.Codigo : "",
            NumeroDescripcion: address.mTipoNumero ? address.mTipoNumero.Descripcion : "",
            TextoNumero: address.mNumeroDireccion,
            CodigoInterior: address.mTipoInterior ? address.mTipoInterior.Codigo : "",
            InteriorDescripcion: address.mTipoInterior ? address.mTipoInterior.Codigo : "",
            TextoInterior: address.mNumeroInterior,
            CodigoZona: address.mTipoZona ? address.mTipoZona.Codigo : "",
            ZonaDescripcion: address.mTipoZona ? address.mTipoZona.Descripcion : "",
            TextoZona: address.mNombreZona,
            Referencia: address.mDirReferencias
          }
        };

        if($scope.formData.dataContractor.mDay && $scope.formData.dataContractor.mMonth && $scope.formData.dataContractor.mYear){
          $scope.formData.personData.FechaNacimiento = $scope.formData.dataContractor.mDay.description + "/" + $scope.formData.dataContractor.mMonth.description + "/" + $scope.formData.dataContractor.mYear.description;
        }
      }

      function disableNextStep(){
        $scope.formData.secondStepNextStep = false;
      }

      $scope.$on('changingStep', function(ib,e){
        if (typeof $scope.formData.secondStepNextStep == 'undefined') $scope.formData.secondStepNextStep = false;
        if (e.step < 2) {
          e.cancel = false;
        }
        else {
          e.cancel = true;
          disableNextStep();
        }
      });

      $scope.$watch('formData', function(nv)
      {
        $rootScope.formData =  nv;
      })

      function listarRiesgos(riesgo, usuario){
        var num = 0;
        $scope.formData.riesgos = [];
        $scope.formData.riesgos2 = [];

        if(!(typeof riesgo == 'undefined') && !(typeof usuario == 'undefined')) {
          accidentesFactory.ListarRiesgoAccidente(riesgo, true).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              $scope.formData.riesgosLength = response.Data;
            }
          });
          console.log($scope.formData.PrimaNetaIndividual);
        }
      }

      function buscarDocumento(){
        if($scope.formData.quotationNumber!=null && $scope.formData.quotationNumber>0 && !$scope.formData.validatedPaso1){

          mpSpin.start();

          accidentesGuardadoFactory.buscarDocumento($scope.formData.quotationNumber).then(function(response){
            if(response.OperationCode == constants.operationCode.success){
                $scope.formData.quote = response.Data;

                $scope.formData.quotationRisk = response.Data.NumeroSecuencia;
                $scope.formData.codigoUsuario = response.Data.CodigoUsuario;
                $scope.formData.inicioVigencia = response.Data.PolizaB.InicioVigencia;
                $scope.formData.finVigencia = response.Data.PolizaB.FinVigencia;
                $scope.formData.codigoMoneda = response.Data.CodigoMoneda;
                $scope.formData.codigoAgente = response.Data.CodigoAgente;

                $scope.formData.dataContractor.showNaturalRucPerson = mainServices.fnShowNaturalRucPerson($scope.formData.quote.Contratante.TipoDocumento, $scope.formData.quote.Contratante.CodigoDocumento);

                listarRiesgos($scope.formData.quotationRisk, $scope.formData.codigoUsuario);

                mpSpin.end();
            }else if (response.Message.length > 0){
              mpSpin.end();
            }
          }, function(error){
            mpSpin.end();
            console.log('Error en buscarDocumento: ' + error);
          });

        }
      }

      function setSearch(data){
        var contratante = {
          TipoDocumento: data.documentType ? data.documentType.Codigo : "",
          CodigoDocumento: data.documentNumber,
          ActividadEconomica: data.ActividadEconomica,
          ApellidoPaterno: data.ApellidoPaterno,
          ApellidoMaterno: data.ApellidoMaterno,
          Nombre: data.Nombre,
          CodigoEstadoCivil: data.CodigoEstadoCivil,
          CorreoElectronico: data.CorreoElectronico,
          Direccion: data.Direccion,
          Edad: data.Edad,
          ImporteAplicarMapfreDolar: data.ImporteAplicarMapfreDolar,
          ImporteMapfreDolar: data.ImporteMapfreDolar,
          MCAExistencia: data.MCAExistencia,
          MCAFisico: data.MCAFisico,
          Ocupacion: data.Ocupacion,
          Profesion: data.Profesion,
          SaldoMapfreDolar: data.SaldoMapfreDolar,
          Score: data.Score,
          SegmentoComercial: data.SegmentoComercial,
          Sexo: data.Sexo,
          Telefono: data.Telefono,
          Telefono2: data.Telefono2,
          TelefonoOficina: data.TelefonoOficina,
          Ubigeo: {
            CodigoDepartamento: data.CodigoDepartamento,
            CodigoDistrito: data.CodigoDistrito,
            CodigoPaisNatal: data.CodigoPaisNatal,
            CodigoPaisRepresentante: data.CodigoPaisRepresentante,
            CodigoPaisResidencia: data.CodigoPaisResidencia,
            CodigoProvincia: data.CodigoProvincia,
            CodigoVia: data.Via ? data.Via.Codigo : "",
            ViaDescripcion: data.Via ? data.Via.Descripcion : "",
            NombreVia: data.NombreVia,
            CodigoNumero: data.NumberType ? data.NumberType.Codigo : "",
            NumeroDescripcion: data.NumberType ? data.NumberType.Descripcion : "",
            TextoNumero: data.TextoNumero,
            CodigoInterior: data.Inside ? data.Inside.Codigo : "",
            InteriorDescripcion: data.Inside ? data.Inside.Descripcion : "",
            TextoInterior: data.TextoInterior,
            CodigoZona: data.Zone ? data.Zone.Codigo : "",
            ZonaDescripcion: data.Zone ? data.Zone.Descripcion : "",
            TextoZona: data.TextoZona,
            Direccion: data.Direccion,
            NombreDepartamento: data.NombreDepartamento,
            NombreDistrito: data.NombreDistrito,
            NombreProvincia: data.NombreProvincia,
            Referencia: data.Referencia
          }
        };
        if(data.day && data.month && data.year){
          contratante.FechaNacimiento = data.day.Descripcion + "/" + data.month.Descripcion + "/" + data.year.Descripcion;
        }

        return contratante;
      }

      $scope.getDataContratante = function(data) {
        if(data.isClear) {
          $scope.formData.mMapfreDolares = 0;
          $scope.formData.dataContractor2.SaldoMapfreDolar = 0;
          $scope.formData.montoMDolar = 0;
          $scope.formData.mOpcionMapfreDolares = 'No';
        }

        if(data.SaldoMapfreDolar){
          $scope.formData.dataContractor2.SaldoMapfreDolar = data.SaldoMapfreDolar;
          $scope.formData.montoMDolar = $scope.formData.dataContractor2.SaldoMapfreDolar;
        }

        if(data.TipoDocumento && data.CodigoDocumento){
          $scope.esCliente = true;
          $scope.formData.McaAsegNuevo = 'N';
        }
        else{
          $scope.esCliente = false;
          $scope.formData.McaAsegNuevo = 'S';
        }

        if(data.noData && data.documentType === $scope.formData.quote.Contratante.TipoDocumento && data.documentNumber === $scope.formData.quote.Contratante.CodigoDocumento){
          $scope.formData.isPersonData = true;
          $scope.formData.personData = {
            TipoDocumento: data.documentType,
            CodigoDocumento: data.documentNumber,
            Nombre: $scope.formData.quote.Contratante.Nombre,
            ApellidoPaterno: $scope.formData.quote.Contratante.ApellidoPaterno,
            ApellidoMaterno: $scope.formData.quote.Contratante.ApellidoMaterno
          }
        }
      }

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

      $scope.nextStep = function(){
        $scope.$broadcast('submitForm', true);
        $scope.setMapfreDolares();
        $scope.validationForm();

        if($scope.formData.validatedPaso1 && !($scope.formData.mMapfreDolares < 0 ||
          ($scope.formData.mMapfreDolares > $scope.formData.dataContractor.saldoMapfreDolares) ||
          ($scope.formData.mMapfreDolares > $scope.formData.dataContractor2.SaldoMapfreDolar)
          )){
          $state.go('.',{
            step: 2
          });
        }
      };

      $scope.validationForm = function(){
        if (!$scope.contractorValid){
            $scope.formData.validatedPaso1 =  false;
        }else{
            $scope.formData.validatedPaso1 =  true;
        }
      }

      $scope.setMapfreDolares = function(){
        if($scope.formData.mMapfreDolares==0){
          $scope.formData.MCAMapfreDolar = 'N';
        }else
          if($scope.formData.mMapfreDolares > 0 &&
            ($scope.formData.mMapfreDolares <= $scope.formData.dataContractor.saldoMapfreDolares) ||
            ($scope.formData.mMapfreDolares <= $scope.formData.dataContractor2.SaldoMapfreDolar)){
            $scope.formData.mOpcionMapfreDolares = 'Si';
            $scope.formData.MCAMapfreDolar = 'S';
          }else{
            $scope.formData.MCAMapfreDolar = 'N';
          }
      }

      $scope.clearMapfreDolares = function(){
        $scope.formData.mOpcionMapfreDolares = 'No';
        $scope.formData.mMapfreDolares = 0;
        $scope.formData.MCAMapfreDolar = 'N';
      }

    }]);
});
