(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'mpfPersonConstants', 'helper',
  '/scripts/mpf-main-controls/components/contractorData/component/contractorData.js',
  '/scripts/mpf-main-controls/components/contractorAddress/component/contractorAddress.js',
  '/scripts/mpf-main-controls/components/contractorVehicleDetails/component/contractorVehicleDetails.js',
  'mpfPersonComponent'],
  function(angular, constants, personConstants){
    angular.module("appAutos").controller('usedCarEmitS3',
      ['$scope', '$state', 'mModalAlert', '$timeout', 'mainServices', 'mpfPersonFactory', 'proxyGeneral',
      function($scope, $state, mModalAlert, $timeout, mainServices, mpfPersonFactory, proxyGeneral){

      (function onLoad(){
        $scope.mainStep = $scope.mainStep || {};
        $scope.firstStep = $scope.firstStep || {};
        $scope.secondStep = $scope.secondStep || {};
        $scope.thirdStep = $scope.thirdStep || {};
        $scope.fourthStep = $scope.fourthStep || {};
        $scope.fiveStep = $scope.fiveStep || {};
        $scope.summaryStep = $scope.summaryStep || {};
        $scope.companyCode = constants.module.polizas.autos.companyCode;
        $scope.appCode = personConstants.aplications.AUTOS;
        $scope.formCodeCN = personConstants.forms.EMI_AU_US_CN;
        $scope.formCodeAS = personConstants.forms.EMI_AU_US_ASE;
        $scope.formCodeAccionista = personConstants.forms.EMI_ACCIONISTA;
        $scope.hiddenFields = $scope.secondStep.isEmblem ? [] : [personConstants.fields.CIVIL_STATUS];
       
        $scope.daySource = mpfPersonFactory.getDays();
        $scope.monthSource = mpfPersonFactory.getMonths();
        $scope.yearSource = mpfPersonFactory.getYears();
        $scope.thirdStep.accionistas = $scope.thirdStep.accionistas || [];
        if (angular.isUndefined($scope.thirdStep.isRucContratante)) $scope.thirdStep.isRucContratante = false;
		    $scope.accionistaValid = false;
        getTransmissionTypeList();

        if(angular.isUndefined($scope.thirdStep.correspondenciaFlag))
            $scope.thirdStep.correspondenciaFlag = true;
        if(angular.isUndefined($scope.thirdStep.aseguradoFlag))
            $scope.thirdStep.aseguradoFlag = true;
      if (angular.isUndefined($scope.thirdStep.accionistasSocios))
            $scope.thirdStep.accionistasSocios = false;
        if(!angular.isUndefined($scope.thirdStep.dataContractor)){
          setRucPersonData()
        }

        if(angular.isUndefined($scope.thirdStep.dataContractor)){
          loadFirstStep();
          if (!$scope.accionistaValid){
             var typeDoc=$scope.thirdStep.dataContractor.mTipoDocumento.Codigo;
             var NumDoc=$scope.thirdStep.dataContractor.personData.NumeroDocumento;
             var NumDocAbreviado=NumDoc.substr(-20,2);
               if (typeDoc=="RUC" && NumDocAbreviado=="20"){
                  console.log(NumDoc.substr(-20,2));
                  $scope.thirdStep.isRucContratante=true;
                  getAccionistasSociosAsociado(typeDoc,NumDoc);
               }else{
                 $scope.thirdStep.isRucContratante=false;
        }
          }
        }
        if(angular.isUndefined($scope.thirdStep.accionistas)){
          $scope.thirdStep.accionistas=[];
        }

        $scope.contractorValid = {};
        $scope.addressValid = {};
        if(!$scope.secondStep.nextStep){
          $state.go('.',{
            step: 1
          });
        }

        $scope.$on('personForm', function(event, data) {
					if (data.contractor) {
            $scope.validContractor = data.valid;
            $scope.thirdStep.dataContractor.personData = data.contractor;
            $scope.thirdStep.dataContractor.showNaturalRucPerson = !data.legalPerson;
            setFormData('dataContractor','dataContractorAddress', data.contractor);
          }
          if (data.insured) {
            $scope.validInsured = data.valid;
            $scope.thirdStep.dataContractor2 = data.insured;
            $scope.thirdStep.dataContractor2.TipoDocumento = data.insured.documentType.Codigo;
            $scope.thirdStep.dataContractor2.NumeroDocumento = data.insured.documentNumber;
            $scope.thirdStep.dataContractor2.showNaturalRucPerson = !data.legalPerson;
            setFormData('dataContractor2','dataContractorAddress2', data.insured);
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
        console.log("SOCIO DATA" , $scope.thirdStep.accionistas);
				});
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
        return (r != null) ? parseInt(r) : r;
      }
    function setSocioData(data, socioPosition) {
      $scope.thirdStep.accionistas[socioPosition].documentType = data.documentType;
      $scope.thirdStep.accionistas[socioPosition].documentNumber = data.documentNumber;
      $scope.thirdStep.accionistas[socioPosition].Relacion = data.Relacion;
      $scope.thirdStep.accionistas[socioPosition].Nombre = data.Nombre;
      $scope.thirdStep.accionistas[socioPosition].RazonSocial = data.Nombre;
      $scope.thirdStep.accionistas[socioPosition].ApellidoPaterno = data.ApellidoPaterno;
      $scope.thirdStep.accionistas[socioPosition].ApellidoMaterno = data.ApellidoMaterno;
      $scope.thirdStep.accionistas[socioPosition].PorParticipacion = data.PorParticipacion;//BUILDSOFT
    }

      function getDateString(day, month, year){
        if (day && month && year){
          var dia = day.toString(), mes = month.toString(), anio = year.toString();
          if (dia.length == 1){
            dia = "0" + dia;
          }
          if (mes.length == 1){
            mes = "0" + mes;
          }
          return dia + "/" + mes + "/" + anio;
        }
      }
    $scope.addAccionista = function() {
      agregarAccionista();
    };
    $scope.$watch("thirdStep.accionistasSocios",function(newValue, oldValue){
      console.log("whatch",newValue,oldValue);
      if(newValue===oldValue){
        return;
      }
      if(!newValue){
        $scope.thirdStep.accionistas=[];
      }
      else{
        if($scope.thirdStep.accionistas.length==0){
          agregarAccionista();
        }
      }
    });
    $scope.removeAccionista = function(index) {
      $scope.thirdStep.accionistas.splice(index,1);
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
      $scope.thirdStep.accionistas.push(accionista);
    }

    function getAccionistasSociosAsociado(typeDoc,NumDoc){
      $scope.thirdStep.accionistas = [];
      mpfPersonFactory.getAccionista(typeDoc,NumDoc)
        .then(function(response){
          console.log("response acionista ",response);
        angular.forEach(response.Data, function(value){
          if (response.Data != [] || response.Data != null){
          $scope.thirdStep.accionistasSocios = true;
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
          $scope.thirdStep.accionistas.push(accionista);
          }else{
          $scope.thirdStep.accionistasSocios = false;
          }
        });
        })
        .catch(function (err) {
        console.error(err);
        $scope.thirdStep.accionistasSocios = false;
        })
      }
    

      function setRucPersonData(){
        $scope.thirdStep.dataContractor.mRazonSocial = $scope.firstStep.dataContractor.Nombre;
        $scope.thirdStep.dataContractor.mActividadEconomica = $scope.thirdStep.dataContractor.mActividadEconomica || $scope.firstStep.dataContractor.ActividadEconomica || '';
      }

      function disableNextStep(){
        $scope.$parent.fourthStep = {};
        $scope.thirdStep.nextStep = false;
      }

      function changeData(){
        var vContractorData = _.isEqual($scope.thirdStep.dataContractor, $scope.thirdStep.dataContractorClone);
        var vContractorAddress = _.isEqual($scope.thirdStep.dataContractorAddress, $scope.thirdStep.dataContractorAddressClone);
        return !vContractorData || !vContractorAddress;
      }

      function loadFirstStep(){
        if ($scope.firstStep.dataContractor && $scope.firstStep.dataContractor.Nombre){
          $scope.thirdStep.dataContractor = {};
          $scope.thirdStep.dataContractor.mTipoDocumento = {
            Codigo: ($scope.firstStep.dataInspection.Tipo_doc == '') ? null : $scope.firstStep.dataInspection.Tipo_doc
          };
          $scope.thirdStep.dataContractor.mNumeroDocumento = $scope.firstStep.dataInspection.Nro_doc;

          var vShowNaturalRucPerson = mainServices.fnShowNaturalRucPerson($scope.thirdStep.dataContractor.mTipoDocumento.Codigo, $scope.thirdStep.dataContractor.mNumeroDocumento);

          if (vShowNaturalRucPerson) {
            $scope.thirdStep.dataContractor.mNomContratante     = $scope.firstStep.dataContractor.Nombre;
            $scope.thirdStep.dataContractor.mApePatContratante  = $scope.firstStep.dataContractor.ApellidoPaterno;
            $scope.thirdStep.dataContractor.mApeMatContratante  = $scope.firstStep.dataContractor.ApellidoMaterno;
            $scope.thirdStep.dataContractor.mDay                = {id : getBirthDate($scope.firstStep.dataContractor.FechaNacimiento, 'd')};
            $scope.thirdStep.dataContractor.mMonth              = {id : getBirthDate($scope.firstStep.dataContractor.FechaNacimiento, 'm')};
            $scope.thirdStep.dataContractor.mYear               = {id : getBirthDate($scope.firstStep.dataContractor.FechaNacimiento, 'y')};
            $scope.thirdStep.dataContractor.mSexo               = $scope.firstStep.dataContractor.Sexo == 1 ? 'H' : 'M';
            if(typeof $scope.firstStep.dataContractor.Profesion != 'undefined')
              $scope.thirdStep.dataContractor.mProfesion          = {Codigo: ($scope.firstStep.dataContractor.Profesion.Codigo == '') ? null : $scope.firstStep.dataContractor.Profesion.Codigo};
            else
              $scope.thirdStep.dataContractor.mProfesion = {
                Codigo : ''
              }
          }else{
            // legalEntity
            setRucPersonData();
          }

          $scope.thirdStep.dataContractor.mTelefonoFijo         = $scope.firstStep.dataContractor.Telefono;
          $scope.thirdStep.dataContractor.mTelefonoCelular      = $scope.firstStep.dataContractor.Telefono2;
          $scope.thirdStep.dataContractor.mCorreoElectronico    = $scope.firstStep.dataContractor.CorreoElectronico;
          $scope.thirdStep.dataContractor.saldoMapfreDolares = $scope.firstStep.dataContractor.SaldoMapfreDolar;
          $scope.thirdStep.dataContractor.mEstadoCivil = $scope.firstStep.dataContractor.EstadoCivil || $scope.firstStep.dataContractor.civilState;
          $scope.thirdStep.dataContractorClone = helper.clone($scope.thirdStep.dataContractor, true);
        }

        if ($scope.firstStep.dataContractor && $scope.firstStep.dataContractor.Ubigeo){
          if (typeof $scope.thirdStep.dataContractorAddress == 'undefined'){
            $scope.thirdStep.dataContractorAddress = {
              mTipoVia: {
                Codigo:         ($scope.firstStep.dataContractor.Ubigeo.CodigoVia == '') ? null : $scope.firstStep.dataContractor.Ubigeo.CodigoVia
              },
              mNombreVia:       $scope.firstStep.dataContractor.Ubigeo.Direccion,
              mTipoNumero: {
                Codigo:         ($scope.firstStep.dataContractor.Ubigeo.CodigoNumero == '') ? null : $scope.firstStep.dataContractor.Ubigeo.CodigoNumero
              },
              mNumeroDireccion: $scope.firstStep.dataContractor.Ubigeo.TextoNumero,
              mTipoInterior: {
                Codigo:         ($scope.firstStep.dataContractor.Ubigeo.CodigoInterior == '') ? null : $scope.firstStep.dataContractor.Ubigeo.CodigoInterior
              },
              mNumeroInterior:  $scope.firstStep.dataContractor.Ubigeo.TextoInterior,
              mTipoZona: {
                Codigo:         ($scope.firstStep.dataContractor.Ubigeo.CodigoZona == '') ? null : $scope.firstStep.dataContractor.Ubigeo.CodigoZona
              },
              mNombreZona:      $scope.firstStep.dataContractor.Ubigeo.TextoZona,
              mDirReferencias:  $scope.firstStep.dataContractor.Ubigeo.Referencia
            };
            $scope.thirdStep.dataContractorAddressClone = helper.clone($scope.thirdStep.dataContractorAddress, true);

            $scope.thirdStep.blockDepartament = true;
            $scope.thirdStep.blockProvincia = true;
            var isload = false;
              $scope.$watch('setterUbigeo', function() {
                if ($scope.setterUbigeo && !isload) {
                    $scope.setterUbigeo($scope.firstStep.dataContractor.Ubigeo.CodigoDepartamento, $scope.firstStep.dataContractor.Ubigeo.CodigoProvincia, $scope.firstStep.dataContractor.Ubigeo.CodigoDistrito);
                    isload = true;
                }
              });
          }
        }
        if ($scope.firstStep.dataContractor){
          setPersonData();
        }
      }

      function setPersonData(){
        $scope.thirdStep.dataContractor.personData = {};
        $scope.thirdStep.dataContractor.personData.TipoDocumento = $scope.thirdStep.dataContractor.mTipoDocumento;
        $scope.thirdStep.dataContractor.personData.NumeroDocumento = $scope.thirdStep.dataContractor.mNumeroDocumento;
        if (mainServices.fnShowNaturalRucPerson($scope.thirdStep.dataContractor.mTipoDocumento.Codigo, $scope.thirdStep.dataContractor.mNumeroDocumento)){
          $scope.thirdStep.dataContractor.personData.Nombre = $scope.thirdStep.dataContractor.mNomContratante;
          $scope.thirdStep.dataContractor.personData.ApellidoPaterno = $scope.thirdStep.dataContractor.mApePatContratante;
          $scope.thirdStep.dataContractor.personData.ApellidoMaterno = $scope.thirdStep.dataContractor.mApeMatContratante;
          $scope.thirdStep.dataContractor.personData.FechaNacimiento = getDateString($scope.thirdStep.dataContractor.mDay.id, $scope.thirdStep.dataContractor.mMonth.id, $scope.thirdStep.dataContractor.mYear.id);
          $scope.thirdStep.dataContractor.personData.Sexo = $scope.thirdStep.dataContractor.mSexo == "H" ? "1" : "0";
          $scope.thirdStep.dataContractor.personData.Profesion = $scope.thirdStep.dataContractor.mProfesion;
        }
        else {
          $scope.thirdStep.dataContractor.personData.Nombre = $scope.thirdStep.dataContractor.mRazonSocial;
          $scope.thirdStep.dataContractor.personData.ActividadEconomica = $scope.thirdStep.dataContractor.mActividadEconomica;
        }
        $scope.thirdStep.dataContractor.personData.Telefono = $scope.thirdStep.dataContractor.mTelefonoFijo;
        $scope.thirdStep.dataContractor.personData.Telefono2 = $scope.thirdStep.dataContractor.mTelefonoCelular;
        $scope.thirdStep.dataContractor.personData.CorreoElectronico = $scope.thirdStep.dataContractor.mCorreoElectronico;
        $scope.thirdStep.dataContractor.personData.civilState = $scope.thirdStep.dataContractor.mEstadoCivil;
        $scope.thirdStep.dataContractor.personData.saldoMapfreDolares = $scope.thirdStep.dataContractor.saldoMapfreDolares;
        $scope.thirdStep.dataContractor.personData.Ubigeo = {};
        $scope.thirdStep.dataContractor.personData.Ubigeo.CodigoDepartamento = $scope.firstStep.dataContractor.Ubigeo.CodigoDepartamento;
        $scope.thirdStep.dataContractor.personData.Ubigeo.CodigoProvincia = $scope.firstStep.dataContractor.Ubigeo.CodigoProvincia;
        $scope.thirdStep.dataContractor.personData.Ubigeo.CodigoDistrito = $scope.firstStep.dataContractor.Ubigeo.CodigoDistrito;
        $scope.thirdStep.dataContractor.personData.Ubigeo.CodigoVia = $scope.thirdStep.dataContractorAddress.mTipoVia.Codigo;
        $scope.thirdStep.dataContractor.personData.Ubigeo.NombreVia = $scope.thirdStep.dataContractorAddress.mNombreVia;
        $scope.thirdStep.dataContractor.personData.Ubigeo.CodigoNumero = $scope.thirdStep.dataContractorAddress.mTipoNumero.Codigo;
        $scope.thirdStep.dataContractor.personData.Ubigeo.TextoNumero = $scope.thirdStep.dataContractorAddress.mNumeroDireccion;
        $scope.thirdStep.dataContractor.personData.Ubigeo.CodigoInterior = $scope.thirdStep.dataContractorAddress.mTipoInterior.Codigo;
        $scope.thirdStep.dataContractor.personData.Ubigeo.TextoInterior = $scope.thirdStep.dataContractorAddress.mNumeroInterior;
        $scope.thirdStep.dataContractor.personData.Ubigeo.CodigoZona = $scope.thirdStep.dataContractorAddress.mTipoZona.Codigo;
        $scope.thirdStep.dataContractor.personData.Ubigeo.TextoZona = $scope.thirdStep.dataContractorAddress.mNombreZona;
        $scope.thirdStep.dataContractor.personData.Ubigeo.Referencia = $scope.thirdStep.dataContractorAddress.mDirReferencias;
      }

      $scope.cleanContract = function(){
        $scope.thirdStep.blockDepartament = false;
        $scope.thirdStep.blockProvincia = false;
        $scope.thirdStep.dataContractorAddress.mTipoVia = {Codigo: null}
        $scope.thirdStep.dataContractorAddress.mNombreVia = "";
        $scope.thirdStep.dataContractorAddress.mTipoNumero =  {Codigo: null};
        $scope.thirdStep.dataContractorAddress.mNumeroDireccion = "";
        $scope.thirdStep.dataContractorAddress.mTipoInterior = {Codigo: null};
        $scope.thirdStep.dataContractorAddress.mNumeroInterior = "";
        $scope.thirdStep.dataContractorAddress.mTipoZona = {Codigo: null}
        $scope.thirdStep.dataContractorAddress.mNombreZona = "";
        $scope.thirdStep.dataContractorAddress.mDirReferencias = "";
        $scope.cleanUbigeo();
      }

      $scope.cleanContract2 = function(){
        $scope.thirdStep.blockDepartament2 = false;
        $scope.thirdStep.blockProvincia2 = false;
        $scope.thirdStep.dataContractorAddress2.mTipoVia = {Codigo: null}
        $scope.thirdStep.dataContractorAddress2.mNombreVia = "";
        $scope.thirdStep.dataContractorAddress2.mTipoNumero =  {Codigo: null};
        $scope.thirdStep.dataContractorAddress2.mNumeroDireccion = "";
        $scope.thirdStep.dataContractorAddress2.mTipoInterior = {Codigo: null};
        $scope.thirdStep.dataContractorAddress2.mNumeroInterior = "";
        $scope.thirdStep.dataContractorAddress2.mTipoZona = {Codigo: null}
        $scope.thirdStep.dataContractorAddress2.mNombreZona = "";
        $scope.thirdStep.dataContractorAddress2.mDirReferencias = "";
        $scope.cleanUbigeo2();
      }

      $scope.notifyContract = function(value){
        disableNextStep();

        var data = $scope.thirdStep
        if (value) {
          data.blockDepartament = true;
          data.blockProvincia = true;

          $scope.firstStep.dataContractor = value;

          value = value.Ubigeo;

          $scope.setterUbigeo(value.CodigoDepartamento, value.CodigoProvincia, value.CodigoDistrito);
          data.dataContractorAddress.mTipoInterior = {
            Codigo: (value.CodigoInterior == '') ? null : value.CodigoInterior
          }
          data.dataContractorAddress.mTipoNumero =  {
            Codigo: (value.CodigoNumero == '') ? null : value.CodigoNumero
          };
          data.dataContractorAddress.mTipoVia = {
            Codigo: (value.CodigoVia == '') ? null : value.CodigoVia
          };
          data.dataContractorAddress.mTipoZona = {
            Codigo: (value.CodigoZona == '') ? null : value.CodigoZona
          };
          data.dataContractorAddress.mDirReferencias = value.Referencia;
          data.dataContractorAddress.mNumeroInterior = value.TextoInterior;
          data.dataContractorAddress.mNumeroDireccion = value.TextoNumero;
          data.dataContractorAddress.mNombreZona = value.TextoZona;
          data.dataContractorAddress.mNombreVia = value.Direccion;
        }else{
          $scope.cleanContract();
        }
      }

      $scope.notifyContract2 = function(value){
        disableNextStep();

        var data = $scope.thirdStep
        if (value) {
          data.blockDepartament2 = true;
          data.blockProvincia2 = true;

          $scope.firstStep.dataContractor2 = value;

          value = value.Ubigeo;

          $scope.setterUbigeo2(value.CodigoDepartamento, value.CodigoProvincia, value.CodigoDistrito);
          data.dataContractorAddress2.mTipoInterior = {
            Codigo: (value.CodigoInterior == '') ? null : value.CodigoInterior
          }
          data.dataContractorAddress2.mTipoNumero =  {
            Codigo: (value.CodigoNumero == '') ? null : value.CodigoNumero
          };
          data.dataContractorAddress2.mTipoVia = {
            Codigo: (value.CodigoVia == '') ? null : value.CodigoVia
          };
          data.dataContractorAddress2.mTipoZona = {
            Codigo: (value.CodigoZona == '') ? null : value.CodigoZona
          };
          data.dataContractorAddress2.mDirReferencias = value.Referencia;
          data.dataContractorAddress2.mNumeroInterior = value.TextoInterior;
          data.dataContractorAddress2.mNumeroDireccion = value.TextoNumero;
          data.dataContractorAddress2.mNombreZona = value.TextoZona;
          data.dataContractorAddress2.mNombreVia = value.Direccion;
        }else{
          $scope.cleanContract2();
        }
      }

      $scope.$on('changingStep', function(ib,e){
        if (typeof $scope.thirdStep.nextStep == 'undefined') $scope.thirdStep.nextStep = false;
        if (e.step < 3) {
          e.cancel = false;
        } else if (e.step > 3 && $scope.thirdStep.nextStep) {
          if (!$scope.addressValid.func() | !$scope.contractorValid.func() | !$scope.vehicleDetailsValid.func()) {
            e.cancel = true;
            disableNextStep();
          } else if (changeData()){
            e.cancel = true;
            disableNextStep();
          }else{
            e.cancel = false;
          }
        } else {
          e.cancel = true;
          disableNextStep();
        }
      });

      $scope.$on('nextStepFromBlackList', function(event, data) {
        goNextStep();
      });

      function setFormData(name, address, data) {
        $scope.thirdStep[name].mNomContratante = data.Nombre;
        $scope.thirdStep[name].mRazonSocial = data.Nombre;
        $scope.thirdStep[name].mApePatContratante = data.ApellidoPaterno;
        $scope.thirdStep[name].mApeMatContratante = data.ApellidoMaterno;
        $scope.thirdStep[name].saldoMapfreDolares = data.SaldoMapfreDolar;

        $scope.thirdStep[name].mTipoDocumento = data.documentType;
        $scope.thirdStep[name].mNumeroDocumento = data.documentNumber;
        $scope.thirdStep[name].mTelefonoFijo = data.Telefono;
        $scope.thirdStep[name].mTelefonoCelular = data.Telefono2;
        $scope.thirdStep[name].mCorreoElectronico = data.CorreoElectronico;
        $scope.thirdStep[name].mProfesion = data.Profesion;
        $scope.thirdStep[name].mActividadEconomica = data.ActividadEconomica;
        $scope.thirdStep[name].mEstadoCivil = data.civilState;

        $scope.thirdStep[address] = {
          ubigeoData: {}
        }

        $scope.thirdStep[address].mTipoNumero = data.NumberType;
        $scope.thirdStep[address].mNumeroDireccion = data.TextoNumero;
        $scope.thirdStep[address].mTipoInterior = data.Inside;
        $scope.thirdStep[address].mNumeroInterior = data.TextoInterior;
        $scope.thirdStep[address].mTipoZona = data.Zone;
        $scope.thirdStep[address].mNombreZona = data.TextoZona;
        $scope.thirdStep[address].mDirReferencias = data.Referencia;
        $scope.thirdStep[address].mTipoVia = data.Via;
        $scope.thirdStep[address].mNombreVia = data.NombreVia;

        if (!(data.documentType.Codigo === 'RUC' && mainServices.fnStartsWith(data.documentNumber, '20'))) {
          
          $scope.thirdStep[name].mDay = {
            Codigo: data.day.Codigo,
            description: data.day.Descripcion
          };
          $scope.thirdStep[name].mMonth = {
            Codigo: data.month.Codigo,
            description: data.month.Descripcion
          };
          $scope.thirdStep[name].mYear = {
            Codigo: data.year.Codigo,
            description: data.year.Descripcion
          };
          
        }
          $scope.thirdStep[address].ubigeoData.mDepartamento = data.Department;
          $scope.thirdStep[address].ubigeoData.mProvincia = data.Province;
          $scope.thirdStep[address].ubigeoData.mDistrito = data.District;
      }

      var n1 = 1;
      $scope.documentsChange = function(data) {
        if (data.documentType && data.documentType.Codigo && data.documentNumber) {
          getUserScore({
            applicationCode: $scope.appCode,
            tipoDocumento: data.documentType.Codigo,
            codigoDocumento: data.documentNumber,
            codigoCompania: $scope.companyCode
          });
        }
        if(data.hasOwnProperty('documentNumber')){
          if(data.documentNumber != undefined){
            if(n1==1){
              typeDoc=data.documentType.Codigo;
              NumDoc=data.documentNumber;
              var NumDocAbreviado=NumDoc.substr(-20,2);
              if (typeDoc=="RUC" && NumDocAbreviado=="20"){                
                $scope.thirdStep.isRucContratante=true;
                if($scope.thirdStep.accionistas){
                  if($scope.thirdStep.accionistas == [] || $scope.thirdStep.accionistas.length == 0 ){
                    getAccionistasSociosAsociado(typeDoc,NumDoc);
      }
                  n1=n1+1;
                }                
              }else{
                $scope.thirdStep.isRucContratante=false;
              }

            }
          }
        }
        if(data.isClear) {
          n1=1;
          $scope.thirdStep.accionistasSocios = false;
          $scope.thirdStep.accionistas=[];
          $scope.thirdStep.isRucContratante=false;
          }
      }

      function getUserScore(params) {
        mpfPersonFactory.getEquifaxData(params)
          .then(function(response){
            $scope.thirdStep.dataContractor.scoreMorosidad = response.Data.ScoreMorosidad || 'Sin Score';
          })
          .catch(function (err) {
            console.error(err);
          })
      };

      function getTransmissionTypeList(){
        proxyGeneral.GetListTipoTransmision($scope.companyCode, false)
          .then(function(response){
            $scope.transmissionTypeList = response.Data
          })
          .catch(function (err) {
            console.error(err);
          })
      };

      $scope.nextStep = function(){
				$scope.$broadcast('submitForm', true);
        $scope.frmProductData.markAsPristine();

        disableNextStep();

        goNextStep();
      };

      function goNextStep() {
        if (
          $scope.validContractor && (!$scope.thirdStep.aseguradoFlag ? $scope.validInsured : true) &&
          $scope.vehicleDetailsValid.func() && $scope.frmProductData.$valid
        ) {
          var paramsFinancing = {
            value1: $scope.secondStep.mProducto.TipoProducto,
            value2: '0'
          };

          var paramsDiscountCommission = {
            CodigoCia: constants.module.polizas.autos.companyCode,
            CodigoAgente: $scope.mainStep.claims.codigoAgente,
            CodigosProductos: [$scope.secondStep.mProducto.CodigoProducto],
            Vehiculo : {
              CodigoUso: $scope.secondStep.mTipoUso.Codigo,
              CodigoTipoVehiculo: $scope.firstStep.dataInspection.Veh_tipo,
			  CodigoMarca: $scope.firstStep.dataInspection.Veh_marca,//buildsoft
              CodigoModelo: $scope.firstStep.dataInspection.Veh_modelo,//buildsoft
              CodigoTipo: $scope.firstStep.dataInspection.Veh_tipo,//buildsoft
              AnioFabricacion: $scope.firstStep.dataInspection.Veh_ano
            },
            CodigoMoneda: constants.module.polizas.autos.codeCurrency
          };

          var paramsGps = {
            codMarca: $scope.firstStep.dataInspection.Veh_marca,
            CodModelo: $scope.firstStep.dataInspection.Veh_modelo,
            codSubModelo: $scope.firstStep.dataInspection.Veh_sub_modelo,
            anioFabricacion: $scope.firstStep.dataInspection.Veh_ano
          };


          // $scope.thirdStep.dataContractorClone = helper.clone($scope.thirdStep.dataContractor, true);
          // $scope.thirdStep.dataContractorAddressClone = helper.clone($scope.thirdStep.dataContractorAddress, true);

          $scope.thirdStep.dataContractorClone = helper.clone($scope.thirdStep.dataContractor, false);

          $scope.thirdStep.nextStep = true;

          $state.go('.',{
            step: 4,
            paramsFinancing: paramsFinancing,
            paramsDiscountCommission: paramsDiscountCommission,
            paramsGps: paramsGps
          });
        }
      };

    }]);
});
