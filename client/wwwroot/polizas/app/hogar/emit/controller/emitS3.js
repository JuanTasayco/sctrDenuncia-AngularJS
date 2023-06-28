(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
  '/polizas/app/hogar/proxy/hogarFactory.js',
  '/polizas/app/autos/autosEmitirUsado/component/groupPolize/groupPolize.js',
  'polizasFactory'],
  function(angular, constants, helper){

    var appAutos = angular.module('appAutos');

    appAutos.controller('hogarEmitS3Controller',
      ['$scope', '$state', 'hogarFactory', 'homeFinancing', 'homeTypes', 'homeMaterials', 'homeEndorsee', 'mModalAlert', 'polizasFactory', 'oimAbstractFactory',
      function($scope, $state, hogarFactory, homeFinancing, homeTypes, homeMaterials, homeEndorsee, mModalAlert, polizasFactory, oimAbstractFactory){

        (function onLoad(){
          $scope.mainStep = $scope.mainStep || {};
          $scope.firstStep = $scope.firstStep || {};
          $scope.secondStep = $scope.secondStep || {};
          $scope.thirdStep = $scope.thirdStep || {};

          $scope.constants = $scope.constants || {};
          $scope.filters = $scope.filters || {};
          $scope.functions = $scope.functions || {};

          if (homeFinancing) $scope.thirdStep.financingData = homeFinancing;
          if (homeTypes) $scope.thirdStep.typeData = homeTypes;
          if (homeMaterials) $scope.thirdStep.materialData = homeMaterials;
          if (homeEndorsee) $scope.thirdStep.endorseeData = homeEndorsee;

        })();

        function buildEmission(){
          var data = {
            TipoEmision         : constants.module.polizas.hogar.emissionType, //"5", //FIJO
            MCAInspeccionPrevia : 'N', //FIJO
            CodigoCompania      : constants.module.polizas.hogar.codeCompany, //"1",
            CodigoTipoEntidad   : constants.module.polizas.hogar.codeEntityType, //'1', //FIJO
            MCALima             : '',
            MCAEndosatario      : ($scope.thirdStep.mEndosatario.Codigo == null) ? 'N' : 'S', //'N', //RADIO: Hay Endosatario
            Inspeccion : {
              CodigoCategoria : '0' //FIJO
            },
            Inspector : {
              CodigoDocumento : '' //FIJO
            },
            Poliza : {
              InicioVigencia        : $scope.filters.filterDate($scope.firstStep.mInicioVigencia, $scope.constants.formatDate), //"18/08/2016",
              FinVigencia           : $scope.filters.filterDate($scope.firstStep.mFinVigencia, $scope.constants.formatDate), //"18/08/2017",
              CodigoFinanciamiento  : $scope.thirdStep.mTipoFinanciamiento.Codigo //"10001" //POR MODIFICAR EL SERVCIO DE FINANCIMIENTO, PARA QUE DEVUELVE EL CODIGO
            },
            Endosatario : {
              CodigoEndosatario : ($scope.thirdStep.mEndosatario.Codigo == null) ? '' : $scope.thirdStep.mEndosatario.Codigo, //'', //COMBO: Endosatario (ddlEndosatario.SelectedValue)
              TipoDocumento     : ($scope.thirdStep.mEndosatario.Codigo == null) ? '' : $scope.thirdStep.mEndosatario.TipoDocumento, //"",
              CodigoDocumento   : ($scope.thirdStep.mEndosatario.Codigo == null) ? '' : $scope.thirdStep.mEndosatario.Codigo, //"",
              SumaEndosatario   : ($scope.thirdStep.mEndosatario.Codigo == null) ? '0' : $scope.mainStep.quotationData.Endosatario.SumaEndosatario, //"0"
            },
            Hogar : {
              CodigoModalidad             : $scope.mainStep.quotationData.Hogar.CodigoModalidad, //'1', //OBTENER SERVICIO
              NombreModalidad             : $scope.mainStep.quotationData.Hogar.NombreModalidad, //'MAPFRE HOGAR HIPOTECARIO', //OBTENER SERVICIO
              CodigoTipoInmueble          : $scope.thirdStep.mTipo.Codigo, //"C",
              NombreTipoInmueble          : $scope.thirdStep.mTipo.Descripcion, //"CASA",
              DireccionInmueble           : $scope.thirdStep.mDireccion, //"DIRECCION PRINCIPAL",
              NumeroPisosPredio           : $scope.thirdStep.mPisos, //"1",
              NumeroSotanosPredio         : $scope.thirdStep.mSotano, //"0",
              CodigoMaterialConstruccion  : $scope.thirdStep.mMaterial.Codigo, //"1",
              NombreMaterialConstruccion  : $scope.thirdStep.mMaterial.Descripcion, //"CONCRETO ARMADO",
              PolizaGrupo                 : (typeof $scope.firstStep.groupPolizeData == 'undefined') ? '' : $scope.firstStep.groupPolizeData.groupPolize, //'', //Codigo de poliza grupo
              ProductoHogar : {
                CodigoProducto : $scope.mainStep.quotationData.CodigoProducto //'36' //OBTENER SERVICIO
              }
            },
            Asegurado : {
              TipoDocumento   : $scope.secondStep.contractorData.mTipoDocumento.Codigo, //"DNI",
              CodigoDocumento : $scope.secondStep.contractorData.mNumeroDocumento, //"12345678",
              Nombre          : ($scope.secondStep.contractorData.mTipoDocumento.Codigo == constants.documentTypes.ruc.Codigo) ? $scope.secondStep.contractorData.mRazonSocial : $scope.secondStep.contractorData.mNomContratante, //"MATIAS",
              ApellidoPaterno : ($scope.secondStep.contractorData.mTipoDocumento.Codigo == constants.documentTypes.ruc.Codigo) ? '' : $scope.secondStep.contractorData.mApePatContratante,
              ApellidoMaterno : ($scope.secondStep.contractorData.mTipoDocumento.Codigo == constants.documentTypes.ruc.Codigo) ? '' : $scope.secondStep.contractorData.mApeMatContratante,
              FechaNacimiento : ($scope.secondStep.contractorData.mTipoDocumento.Codigo == constants.documentTypes.ruc.Codigo) ? '' : $scope.secondStep.contractorData.mDay.description + '/' + $scope.secondStep.contractorData.mMonth.description + '/' + $scope.secondStep.contractorData.mYear.description, //"02/06/1990",
              Sexo            : ($scope.secondStep.contractorData.mTipoDocumento.Codigo == constants.documentTypes.ruc.Codigo) ? '' : $scope.secondStep.contractorData.mSexo, //"H",
              Profesion : {
                Codigo : ($scope.secondStep.contractorData.mTipoDocumento.Codigo == constants.documentTypes.ruc.Codigo) ? '' : $scope.secondStep.contractorData.mProfesion.Codigo //"99"
              },
              ActividadEconomica : {
                Codigo : ($scope.secondStep.contractorData.mTipoDocumento.Codigo == constants.documentTypes.ruc.Codigo) ? $scope.secondStep.contractorData.mActividadEconomica.Codigo : '' //""
              }
            },
            Documento : {
              CodigoSistema: oimAbstractFactory.getOrigin(),
              NumeroAnterior    : $scope.mainStep.quotationData.NumeroDocumento, //"183050", //NumCotizacion
              NumeroTicket      : '',
              CodigoEstado      : $scope.mainStep.quotationData.CodigoEstado, //'1', //OBTENER SERVICIO
              CodigoUsuario     : $scope.mainStep.claims.codigoUsuario, //"DBISBAL", //CONFIRMADO USUARIO QUE SE LOGEA
              CodigoUsuarioRED  : constants.module.polizas.hogar.networkUser, //"Usuario",
              EstadoEmision     : '',
              RutaDocumento     : '',
              NombreDocumento   : '',
              FlagDocumento     : '',
              CodigoProceso     : '2', //FIJO
              CodigoProducto    : $scope.mainStep.quotationData.CodigoProducto, //'36', //OBTENER SERVICIO
              NumeroPlaca       : '',
              McaAsegNuevo      : 'N', //POR CONFIRMAR //DATOS DEL CONTRATANTE SI SE MODIFICA EL TIPO DE DOCUMENTO O SU NUMERO, EL VALOR CAMBIA A 'S' SI NO 'N'
              CodigoAgente      : '0', //FIJO
              MarcaAsistencia   : '',
              Ubigeo : {
                CodigoDepartamento  : '',
                CodigoProvincia     : '',
                CodigoDistrito      : ''
              }
            },
            Contratante : {
              Telefono                  : $scope.secondStep.contractorData.mTelefonoFijo, //"5222945",
              TipoDocumento             : $scope.secondStep.contractorData.mTipoDocumento.Codigo, //"DNI",
              CodigoDocumento           : $scope.secondStep.contractorData.mNumeroDocumento, //"12345678",
              Nombre                    : ($scope.secondStep.contractorData.mTipoDocumento.Codigo == constants.documentTypes.ruc.Codigo) ? $scope.secondStep.contractorData.mRazonSocial : $scope.secondStep.contractorData.mNomContratante, //"MATIAS",
              ApellidoPaterno           : ($scope.secondStep.contractorData.mTipoDocumento.Codigo == constants.documentTypes.ruc.Codigo) ? '' : $scope.secondStep.contractorData.mApePatContratante, //"AÑAÑOS",
              ApellidoMaterno           : ($scope.secondStep.contractorData.mTipoDocumento.Codigo == constants.documentTypes.ruc.Codigo) ? '' : $scope.secondStep.contractorData.mApeMatContratante, //"NUÑEZ",
              FechaNacimiento           : ($scope.secondStep.contractorData.mTipoDocumento.Codigo == constants.documentTypes.ruc.Codigo) ? '' : $scope.secondStep.contractorData.mDay.description + '/' + $scope.secondStep.contractorData.mMonth.description + '/' + $scope.secondStep.contractorData.mYear.description, //"02/06/1990",
              Sexo                      : ($scope.secondStep.contractorData.mTipoDocumento.Codigo == constants.documentTypes.ruc.Codigo) ? '' : $scope.secondStep.contractorData.mSexo, //"H",
              CorreoElectronico         : $scope.secondStep.contractorData.mCorreoElectronico, //"HONY.ALVAAARADO@GMAIL.COM",
              Telefono2                 : $scope.secondStep.contractorData.mTelefonoCelular, //"958533734",
              MCAMapfreDolar            : $scope.mainStep.quotationData.Contratante.MCAMapfreDolar, //"N",
              ImporteAplicarMapfreDolar : $scope.mainStep.quotationData.Agente.ImporteAplicarMapfreDolar, //'0',
              ImporteMapfreDolar        : $scope.mainStep.quotationData.Contratante.ImporteMapfreDolar, //'15.71',
              ActividadEconomica : {
                Codigo : ($scope.secondStep.contractorData.mTipoDocumento.Codigo == constants.documentTypes.ruc.Codigo) ? $scope.secondStep.contractorData.mActividadEconomica.Codigo : '' //""
              },
              Ubigeo : {
                CodigoDepartamento  : $scope.secondStep.contractorAddressData.ubigeoData.mDepartamento.Codigo, //"15",
                CodigoProvincia     : $scope.secondStep.contractorAddressData.ubigeoData.mProvincia.Codigo, //"128",
                CodigoDistrito      : $scope.secondStep.contractorAddressData.ubigeoData.mDistrito.Codigo, //"30",
                CodigoVia           : $scope.secondStep.contractorAddressData.mTipoVia.Codigo, //"1",
                Direccion           : $scope.secondStep.contractorAddressData.mNombreVia, //'LA PAZ', //DIRECCION ES VIA
                CodigoNumero        : $scope.secondStep.contractorAddressData.mTipoNumero.Codigo, //"1",
                TextoNumero         : $scope.secondStep.contractorAddressData.mNumeroDireccion, //"845",
                CodigoInterior      : $scope.secondStep.contractorAddressData.mTipoInterior.Codigo, //"1",
                TextoInterior       : $scope.secondStep.contractorAddressData.mNumeroInterior, //"05",
                CodigoZona          : $scope.secondStep.contractorAddressData.mTipoZona.Codigo, //"1",
                TextoZona           : $scope.secondStep.contractorAddressData.mTipoZona.mNombreZona, //"DSFGS",
                Referencia          : $scope.secondStep.contractorAddressData.mDirReferencias, //""
              },
              Profesion : {
                Codigo  : ($scope.secondStep.contractorData.mTipoDocumento.Codigo == constants.documentTypes.ruc.Codigo) ? '' : $scope.secondStep.contractorData.mProfesion.Codigo //"99"
              }
            }
          }
          return data;
        }

        /*#########################
        # ValidationForm
        #########################*/
        $scope.validationForm = function(){
          $scope.frmThirdStep.markAsPristine();
          return $scope.frmThirdStep.$valid;
        };

        /*#########################
        # saveEmission
        #########################*/
        $scope.saveEmission = function(){
          if ($scope.validationForm()){
            var paramsEmission = buildEmission();
            paramsEmission = polizasFactory.setReferidoNumber(paramsEmission);
            hogarFactory.saveEmission(paramsEmission, true).then(function(response){
              if (response.OperationCode == constants.operationCode.success){
                var vEmissionNumber = response.Data.NumeroDocumento;
                $state.go('hogarEmitted', {
                  emissionNumber: vEmissionNumber
                });
              }else{
                mModalAlert.showError(response.Message, 'Error');
              }
            }, function(error){
            }, function(defaultError){
            });
          }
        };

    }]);

  });
