(function($root, deps, action){
		define(deps, action)
})(this, [
'angular',
'constants',
'helper',
'mpfPersonConstants',
'mpfPersonComponent',
'/polizas/app/empresa/factory/empresasFactory.js'
],  function(angular, constants, helper, personConstants){

    var appAutos =  angular.module("appAutos");
    appAutos.controller("polizaDataController", [
    '$scope',
    'lookupCompanyData',
    'empresasFactory',
    'mModalAlert' ,
    'proxyContratante',
    'mainServices',
    function(
      $scope,
      lookupCompanyData,
      empresasFactory,
      mModalAlert,
      proxyContratante,
      mainServices
    ){(function onLoad(){

        bindLookups();
        eventHandlers();

        $scope.data = $scope.data || {};

        $scope.data.mOpcionMapfreDolares = $scope.data.mOpcionMapfreDolares || 'No';

        $scope.data.codeGroup = $scope.data.codeGroup || -2;
        $scope.data.groupPolicy = $scope.data.groupPolicy ||  '';
        $scope.data.mCodPolizaGrupo = (angular.isUndefined($scope.data.groupPolicy) || $scope.data.groupPolicy != '') ? $scope.data.mCodPolizaGrupo : '';
        $scope.data.mGiroNegocio = $scope.data.mGiroNegocio || {};
        $scope.data.mTipoDocumento = $scope.data.mTipoDocumento || {};

        $scope.companyCode = constants.module.polizas.empresas.companyCode;
        $scope.appCode = personConstants.aplications.EMPRESA;
        $scope.formCodeCN = personConstants.forms.COT_EMP_CN;

        //Contratante
        if(isRuc())
          $scope.data.mNombre = $scope.data.mNombre || "";
        else{
          $scope.data.mNombre = $scope.data.mNombre || "";
          $scope.data.mApellidoPaterno = $scope.data.mApellidoPaterno || "";
          $scope.data.mApellidoMaterno = $scope.data.mApellidoMaterno || "";
        }

        $scope.data.docNumMaxLength = mainServices.fnDocNumMaxLength(null);
        $scope.showNaturalRucPerson = true;

        $scope.data.mMoneda = {
          codigo: ($scope.data.isValidStep2) ? $scope.data.mMoneda.codigo : null,
          descripcion: ($scope.data.isValidStep2) ? $scope.data.mMoneda.descripcion : "--Seleccione--"
        };

        $scope.tiposDocumento = lookupCompanyData.tiposDocumento;
        $scope.isRuc = isRuc;
        $scope.contratanteLoadedData = {};

        function isRuc(){
          var vNatural = true;
          if ($scope.data.mTipoDocumento && $scope.data.mNumeroDocumento)
            vNatural = mainServices.fnShowNaturalRucPerson($scope.data.mTipoDocumento.codigo, $scope.data.mNumeroDocumento);
          return !vNatural;
        }

        function setContratante(value){
          $scope.data.mTipoDocumento = value.documentType
          ? {
              codigo: value.documentType.Codigo,
              descripcion: value.documentType.Descripcion
            }
          : $scope.data.mTipoDocumento;
          $scope.data.mNumeroDocumento = value.documentNumber;
          $scope.data.mNombre = value.Nombre;
          $scope.data.mApellidoPaterno = value.ApellidoPaterno;
          $scope.data.mApellidoMaterno = value.ApellidoMaterno;
          $scope.data.mRazonSocial = value.Nombre;
          $scope.data.saldoMapfreDolares = isNaN(parseFloat(value.SaldoMapfreDolar))? 0 : parseFloat(value.SaldoMapfreDolar) ;
          $scope.data.mAplicarMD = false;
        }

        $scope.clean = function(){
          setContratante({});
          $scope.showClean = false;
          $scope.contratanteLoaded = false;
          $scope.contratanteLoadedData = {};
          $scope.data.mTipoDocumento = { codigo : null}
          $scope.data.mNumeroDocumento = "";
        };

        $scope.inferData = function(){
         var documentValue = $scope.data.mNumeroDocumento;
         var documentType = $scope.data.mTipoDocumento && $scope.data.mTipoDocumento.codigo? $scope.data.mTipoDocumento.codigo:  null;
         mainServices.documentNumber.fnFieldsValidated($scope.data, documentType, 1);

         if (documentValue && documentType){
           setContratante({});

           $scope.isRuc();
           $scope.showNaturalRucPerson = mainServices.fnShowNaturalRucPerson(documentType, documentValue);

           proxyContratante.GetContratanteByNroDocumento(1, documentType, documentValue, "Buscando un contratante...").then(function(response){
               $scope.showClean = true;
               setContratante(response.Data);
               if (response.Data) {
                 $scope.contratanteLoaded = true;
                 $scope.contratanteLoadedData = response.Data;
               }
           });
         }
       };

       $scope.getMD = function(){
         var data = $scope.data;
         return isNaN(data.mAplicadosMDolares) ? data.saldoMapfreDolares : (data.saldoMapfreDolares - data.mAplicadosMDolares)
       };

       $scope.data.personData = {};
       if ($scope.data.mTipoDocumento && $scope.data.mNumeroDocumento){
         loadPersonData();
       }

       $scope.data.mAplicadosMDolares = 0;

      $scope.$on('personForm', function(event, data) {
        if (data.contratante) {
          $scope.contractorValid = data.valid;
          $scope.data.contratante = data.contratante;
          $scope.data.contratante.TipoDocumento = data.contratante.documentType.Codigo;
          $scope.data.contratante.NumeroDocumento = data.contratante.documentNumber;
          setContratante(data.contratante);
        }
      });

      })() //end onLoad

      function loadPersonData() {
        $scope.data.personData = {
          TipoDocumento: { Codigo: $scope.data.mTipoDocumento.codigo },
          NumeroDocumento: $scope.data.mNumeroDocumento,
          Nombre: $scope.data.mNombre,
          ApellidoMaterno: $scope.data.mApellidoPaterno,
          ApellidoPaterno: $scope.data.mApellidoMaterno
        };
      }

      $scope.$watch('data.mSelecProd', function(){
        if($scope.data.mSelecProd){
          if($scope.data.mSelecProd.CodigoRamo == 273){
            $scope.data.mMoneda = {
              codigo: "1",
              descripcion: "NUEVOS SOLES"
            }
          }
        }

      });

    $scope._resetRisks = _resetRisks;

    function _resetRisks(){
      if($scope.data.secondStepExec){
        var risks = $scope.data.risks;
        for(var i = 0; i < risks.length; i++){

          risks[i].mEdificacion = "";
          risks[i].mFijas = "";
          risks[i].mContenido = "";
          risks[i].mMaquinaria = "";
          risks[i].mMovilidad =  "";
          risks[i].mExistencias = "";
          risks[i].mEstables = "";
          risks[i].c01 = {
            title: "CONVENIO I - INCENDIO, LÍNEAS ALIADAS Y LUCRO CESANTE",
            MCAContratado: "N",
            mContenido: 0,
            mEdificacion: 0,
            mEstables: 0,
            mExistencias: 0,
           // mFijas: 0,
            mMaquinaria: 0,
            mMovilidad: 0,
            mTerremoto: 'N',
            mTerrorismo: 'N',
            total: 0
          };

          risks[i].mValorInstFijaTwo = "";
          risks[i].mValorMaqEquipTwo = "";
          risks[i].mValorMob = "";
          risks[i].mValorExisTwo = "";
          risks[i].mValorCajChica = "";
          risks[i].mValorCajFuert = "";
          risks[i].mValorTransBancos = "";
          risks[i].mValorTotaPoderCobra = "";
          risks[i].mValorTotalCobra = "";
          risks[i].c02 = {
            title: "CONVENIO II - ROBO Y/O ASALTA",
            MCAContratado: "N",
            total: 0,
            contenido: {
              mExistencias: 0,
              mFijas: 0,
              mMaquinaria: 0,
              mMobiliario: 0,
              mMovilidad: 0,
              total: 0
            },
            declarado: {
              mChica: 0,
              mCobradores: 0,
              mFuerte: 0,
              mPoder: 0,
              mTransito: 0,
              total: 0
            }
          };

          risks[i].mValorSumAsegResp = "";
          risks[i].c03 = {
            title: "CONVENIO III - RESPONSABILIDAD CIVIL",
            MCAContratado: "N",
            mCivil: 0
          };

          risks[i].mValorSumAsegRot = "";
          risks[i].c04 = {
            title: "CONVENIO IV - ROTURA DE MÁQUINA",
            MCAContratado: "N",
            mRotura: 0
          };

          risks[i].mValorLimUnic = "";
          risks[i].mValorAsegEquipMov = "";
          risks[i].c05 = {
            title: "CONVENIO V - EQUIPO ELECTRÓNICO",
            MCAContratado: "N",
            mLimite: 0,
            mMovil: 0
          };

          risks[i].mValorTotAseg = "";
          risks[i].mValorSumAsegAcc = "";
          risks[i].c06 = {
            title: "CONVENIO VI - ACCIDENTES PERSONALES",
            MCAContratado: "N",
            mAsegurados: 0,
            total: 0
          };

          risks[i].mValorNroEmple = "";
          risks[i].mValorSumAseg = "";
          risks[i].c07 = {
            title: "CONVENIO VII - DESHONESTIDAD DE EMPLEADOS",
            MCAContratado: "N",
            mEmpleados: 0,
            total: 0
          };

          risks[i].mValorSumAsegTrec = "";
          risks[i].c08 = {
            title: "CONVENIO VIII - TREC - TODO RIESGO EQUIPO CONTRATISTA",
            MCAContratado: "N",
            mTrec: 0
          };

          risks[i].mValorSumAsegCar = "";
          risks[i].c09 = {
            title: "CONVENIO IX - CAR - TODO RIESGO DE CONTRATISTA",
            MCAContratado: "N",
            mCar: 0
          };

          risks[i].mValorSumAsegEar = "";
          risks[i].c10 = {
            title: "CONVENIO X - EAR - TODO RIESGO DE MONTAJE",
            MCAContratado: "N",
            mEar: 0
          };

          risks[i].sumTotalConvenios = 0;

        }
      }
    }

    function bindLookups(){
      $scope.monedaData =  lookupCompanyData.tiposMoneda;
      $scope.tipoEmpresaData =  empresasFactory.getCompaniesList(1);
      $scope.tipoProductoData = empresasFactory.getProductsList(1);
    }

    function eventHandlers(){
      $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        var isNextTo = (toParams.step == 2 || toParams.step == 3);
        if (isNextTo &&  $scope.nextStep())
          event.preventDefault();
      });

      $scope.$on('changingStep', function(p, e){
        var isNextTo = (e.step == 2 || e.step == 3);
        e.cancel = isNextTo && $scope.nextStep();
      });
    }

    $scope.getBusinessTurnList = function(){
      var company = $scope.data.mTipoEmpresa;

      if (company.strCodigo != null){
        empresasFactory.getBusinessTurnList(company.strCodigo).then(
          function lst(response){
            $scope.data.giroNegocioData = response.Data;
          },
          function(error){
            $scope.data.giroNegocioData = {};
        });
      }
    }

    //valida si es riesgoso segun giro de negocio
    $scope.validateIsRisky = function(){
        var giro = {};
        giro = $scope.data.mGiroNegocio;
        switch(giro.strCodigo){
          case "0010":
          case "0030":
          case "0072":
          case "0097":
          case "0104":
          case "0005":
          case "0017":
          case "0021":
          case "0031":
          case "0035":
          case "0038":
          case "0040":
          case "0068":
          case "0075":
          case "0080":
          case "0082":
          case "0096":
          case "0111":
          case "0113":
          case "0121":
          case "0122":
          case "0130":
          case "0132":
          case "0133":
          case "0137":
          case "0146":
          case "0043":
          case "0048":
          case "0089":
          case "0001":
          case "0034":
          case "0050":
          case "0055":
          case "0070":
          case "0088":
          case "0094":
          case "0117":
          case "0134":
          case "0135":
          case "0023":
          case "0019":
          case "0027":
          case "0032":
          case "0033":
          case "0044":
          case "0045":
          case "0047":
          case "0054":
          case "0073":
          case "0083":
          case "0089":
          case "0139":
            $scope.data.riesgo = true;
          break;
          default:
            $scope.data.riesgo = false;
          }
    }

    $scope.tipoGiroNegocioChange = function(){
      $scope.data.esRiesgoso = $scope.data.mGiroNegocio && _.find(lookupCompanyData.giroAltoRiesgo, function(a){ return a.codigo == $scope.data.mGiroNegocio.Codigo });
    }

    $scope.getMapfreDolar = function(data) {
      if(!angular.isUndefined(data.SaldoMapfreDolar)){
        $scope.data.saldoMapfreDolares = data.SaldoMapfreDolar;
      }
    }

    function isValid(){
			$scope.$broadcast('submitForm', true);
      $scope.frmFirstStep.markAsPristine();
      return $scope.frmFirstStep.$valid &&
      $scope.contractorValid &&
      $scope.data.agent !== undefined &&
      $scope.data.agent !== null &&
      $scope.data.agent.codigoAgente != '0';
      //guarda en temporal datos de poliza
    }

    $scope.nextStep = function(){
      var v = isValid();
      if (!v){
        if ($scope.data.agent.codigoAgente != '0'){
          mModalAlert.showWarning('Por favor verifique los datos ingresados (*)', 'Datos Erróneos');
        }else{
          mModalAlert.showError("No tiene un agente seleccionado", "Error");
        }
      }else if($scope.data.mCodPolizaGrupo != '' && (angular.isUndefined($scope.data.groupPolicy) || $scope.data.groupPolicy == '')){
        $scope.data.mCodPolizaGrupo = '';
      }
      $scope.data.isValidStep1 = v;
      return !v;
    }

    $scope.clearMapfreDolares = function(){
      $scope.data.mOpcionMapfreDolares = 'No';
      $scope.data.mAplicadosMDolares = '';
    }

    $scope.searchGroupPolicy = function(){
      if(angular.isUndefined($scope.data.mCodPolizaGrupo) || $scope.data.mCodPolizaGrupo == "")
        $scope.data.codeGroup = 0;
      else{
        empresasFactory.getGroupPolicy($scope.data.mCodPolizaGrupo).then(function(response){
          if(response.Data.length > 0){
            $scope.data.codeGroup = 1;
            $scope.data.groupPolicy = response.Data[0].Nombre;
          }else{
            $scope.data.codeGroup = -1;
            $scope.data.mCodPolizaGrupo = "";
          }

        });
      }
    }

    $scope.cleanGroup = function(){
      $scope.data.codeGroup = -2;
      $scope.data.mCodPolizaGrupo = "";
      $scope.data.groupPolicy = "";
    }

    }]);
});
