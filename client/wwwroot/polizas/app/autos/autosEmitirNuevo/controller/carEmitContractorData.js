(function($root, deps, action){
    define(deps, action)
})(this, [
  'angular',
  'lodash',
  'helper',
  'constants',
  'mpfPersonConstants',
  '/scripts/mpf-main-controls/components/contractorVehicleDetails/component/contractorVehicleDetails.js',
  'mpfPersonComponent'
  ], function(angular, _, helper, constants, personConstants){
    angular.module('appAutos').controller('carEmitContractorData', [
      '$scope',
      '$state',
      'proxyGeneral',
      'mpfPersonFactory',
      function($scope, $state, proxyGeneral, mpfPersonFactory) {
        (function onLoad() {
          function allowLoadStep() {
            if (!$scope.formData.step1$Valid) {
              $state.go('newEmit.steps', { step: 1 });
            }
          }

          allowLoadStep();
          evalAgentViewDcto();

          function evalAgentViewDcto(){
            var params = {CodigoAgente: $scope.formData.selectedAgent.codigoAgente}
            proxyGeneral.EsDescuentoIntegralidadParaAgentes(params, false)
            .then(function(response){
              $scope.formData.viewDcto = response.Data
            });
          }

          $scope.quotation = $scope.quotation || {};
          $scope.hiddenFields = $scope.quotation.vehiculo.tipoTransmision && $scope.quotation.vehiculo.tipoTransmision.codigo
            ? []
            : [personConstants.fields.CIVIL_STATUS];
          $scope.formData.DctoIntegralidad = $scope.quotation.marcaPorDctoIntegralidad === 'S' ? true : false;
          $scope.formData.PorDctoIntgPlaza = $scope.quotation.porDctoIntgPlaza;

          $scope.formData = $scope.formData || {};

          if (angular.isUndefined($scope.formData.aseguradoFlag)) $scope.formData.aseguradoFlag = true;

          $scope.contractorValid = false;

          if(angular.isUndefined($scope.formData.accionistas)){
          $scope.formData.accionistas=[];
          }

          if (angular.isUndefined($scope.formData.isRucContratante)) $scope.formData.isRucContratante = false;

          $scope.addressValid = {};

          $scope.vehicleDetailsValid = {};

          $scope.formData.emitedContractor = $scope.formData.emitedContractor || false

          $scope.formData.contractor = $scope.formData.contractor || {};

          if($scope.formData.contractor && !$scope.formData.emitedContractor){
            loadPersonData();
            var typeDoc=$scope.formData.contractor.TipoDocumento.Codigo;
            var NumDoc=$scope.formData.contractor.NumeroDocumento;
            var NumDocAbreviado=NumDoc.substr(-20,2);
            if (typeDoc=="RUC" && NumDocAbreviado=="20"){
              console.log(NumDoc.substr(-20,2));
              $scope.formData.isRucContratante=true;
              getAccionistasSociosAsociado(typeDoc,NumDoc);
            }else{
              $scope.formData.isRucContratante=false;
            }
          
          }

          $scope.formData.contractor2 = $scope.formData.contractor2 || {};

          $scope.formData.accionistas = $scope.formData.accionistas || [];

          $scope.formData.vehicleDetailsContractor = $scope.formData.vehicleDetailsContractor || {};

          $scope.formData.addressContractor = $scope.formData.addressContractor || {};

          $scope.formData.addressContractor2 = $scope.formData.addressContractor2 || {};

          $scope.formData.contractor.mTipoDocumento = { Codigo: $state.params.tipo };

          $scope.formData.contractor.mNumeroDocumento = $state.params.numero;

          $scope.companyCode = constants.module.polizas.autos.companyCode;

          $scope.appCode = personConstants.aplications.AUTOS;

          $scope.proceso = 'EMISI&Oacute;N';

          $scope.formCodeCN = personConstants.forms.EMI_AU_NV_CN;

          $scope.formCodeAccionista = personConstants.forms.EMI_ACCIONISTA;

          $scope.formCodeAS = personConstants.forms.EMI_AU_NV_ASE;
          $scope.daySource = mpfPersonFactory.getDays();
          $scope.monthSource = mpfPersonFactory.getMonths();
          $scope.yearSource = mpfPersonFactory.getYears();
          $scope.formData.scoreMorosidad = $scope.quotation.vehiculo.scoreMorosidad;
          var expeditionDate = $scope.quotation.contratante.fechaExpedicion.split("/");
          $scope.formData.expirationDay = { Codigo: parseInt(expeditionDate[0]) }
          $scope.formData.expirationMonth = { Codigo: parseInt(expeditionDate[1]) }
          $scope.formData.expirationYear = { Codigo: parseInt(expeditionDate[2]) }
          $scope.formData.userQuotation = {
            TipoDocumento: { Codigo: $scope.quotation.contratante.TipoDocumento.Codigo },
            NumeroDocumento: $scope.quotation.contratante.NumeroDocumento,
            CodigoEstadoCivil: $scope.quotation.contratante.estadoCivil.codigo
          }

          $scope.$on('personForm', function(event, data) {

            if (data.contractor) {
              $scope.contractorValid = data.valid;
              $scope.formData.contractor = data.contractor;
              $scope.formData.contractor.legalPerson = !data.legalPerson;
              setFormData('contractor','addressContractor', data.contractor, data.legalPerson);
            }
            if (data.asegurado) {
              $scope.contractor2Valid = data.valid;
              $scope.formData.contractor2 = data.asegurado;
              setFormData('contractor2','addressContractor2', data.asegurado, data.legalPerson);
            }

            var socioPosition;
            _.forEach(_.keys(data), function(key) {
              socioPosition = key.split('-').length > 0 ? key.split('-')[1] : null;
            })

          if (socioPosition) {
            var socioData = data['socio-' + socioPosition];
            $scope.accionistaValid = data.valid;
            setSocioData(socioData, socioPosition);
            console.log('SOCIOS ACCIONISTAS: ',$scope.formData.accionistas);
          }

          });

          $scope.$on('nextStepFromBlackList', function(event, data) {
            if (data && $scope.vehicleDetailsValid.func() && $scope.contractorValid && (!$scope.formData.aseguradoFlag ? $scope.contractor2Valid : true)) {
              $scope.formData.step2$Valid = true;
              $scope.formData.emitedContractor = true;
              $state.go('.',{
                step: 3
              });
            }
          });

        })();

        $scope.format = constants.formats.dateFormat;

        var n1 = 1;
        $scope.documentsChange = function(data) {
          if (angular.isDefined(data.documentType)) {
            $scope.formData.documentType = data.documentType.Codigo
          }
          if (angular.isDefined(data.documentNumber)) {
            $scope.formData.documentNumber = data.documentNumber
          }
          if (data.noData) {
            $scope.formData.emitedContractor = true;
          }

        if(data.hasOwnProperty('documentNumber')){
          if(data.documentNumber != undefined){
            if(n1==1){
              typeDoc=data.documentType.Codigo;
              NumDoc=data.documentNumber;
              var NumDocAbreviado=NumDoc.substr(-20,2);
              if (typeDoc=="RUC" && NumDocAbreviado=="20"){
                console.log(NumDoc.substr(-20,2));
                $scope.formData.isRucContratante=true;
                if($scope.formData.accionistas){ //buildsoft
                  if($scope.formData.accionistas == [] || $scope.formData.accionistas.length == 0 ){
                    getAccionistasSociosAsociado(typeDoc,NumDoc);
                  }
                  n1=n1+1;
                }  
              }else{
                $scope.formData.isRucContratante=false;
              }
              
            }
          }
        }
        if(data.isClear) {
          n1=1;
          $scope.formData.accionistasSocios = false;
          $scope.formData.accionistas=[];
          $scope.formData.isRucContratante=false;
          }
        }
      function setSocioData(data, socioPosition) {
        $scope.formData.accionistas[socioPosition].documentType = data.documentType;
        $scope.formData.accionistas[socioPosition].documentNumber = data.documentNumber;
        $scope.formData.accionistas[socioPosition].Relacion = data.Relacion;
        $scope.formData.accionistas[socioPosition].Nombre = data.Nombre;
        $scope.formData.accionistas[socioPosition].RazonSocial = data.Nombre;
        $scope.formData.accionistas[socioPosition].ApellidoPaterno = data.ApellidoPaterno;
        $scope.formData.accionistas[socioPosition].ApellidoMaterno = data.ApellidoMaterno;
        $scope.formData.accionistas[socioPosition].PorParticipacion = data.PorParticipacion;//BUILDSOFT
      }

        $scope.obtenerDctontegralidad = function() {
          if ($scope.formData.DctoIntegralidad) {
            proxyGeneral
              .ObtenerDescuentoIntegralidad(
                constants.module.polizas.autos.companyCode,
                $scope.formData.selectedAgent.codigoAgente,
                constants.module.polizas.autos.codeRamo,
                $scope.formData.documentType,
                $scope.formData.documentNumber
              )
              .then(function(response) {
                if (response.OperationCode == constants.operationCode.success) {
                  $scope.formData.PorDctoIntgPlaza = response.Data;
                }
              })
              .catch(function(error) {
                console.log('Error en obtenerDctontegralidad: ' + error);
              });
          }
        };
      $scope.addAccionista = function() {
        agregarAccionista();
      };
      $scope.$watch("formData.accionistasSocios",function(newValue, oldValue){
        if(newValue===oldValue){
          return;
        }
        if(!newValue){
          $scope.formData.accionistas=[];
        }
        else{
          if($scope.formData.accionistas.length==0){
            agregarAccionista();
          }
        }
      });
      $scope.removeAccionista = function(index) {
        $scope.formData.accionistas.splice(index,1);
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
        $scope.formData.accionistas.push(accionista);
      };

      function getAccionistasSociosAsociado(typeDoc,NumDoc){
        $scope.formData.accionistas = [];
        mpfPersonFactory.getAccionista(typeDoc,NumDoc)
          .then(function(response){
            console.log("asociado",response);
          angular.forEach(response.Data, function(value){
            if (response.Data != [] || response.Data != null){
            $scope.formData.accionistasSocios = true;
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
            $scope.formData.accionistas.push(accionista);
            }else{
            $scope.formData.accionistasSocios = false;
            }
          });
          })
          .catch(function (err) {
          console.error(err);
          $scope.formData.accionistasSocios = false;
          })
        }

        function setFormData(name, address, data, isCompany) {
          $scope.formData[name].mTipoDocumento = data.documentType;
          $scope.formData[name].mNumeroDocumento = data.documentNumber;
          $scope.formData[name].mActividadEconomica = data.ActividadEconomica;
          $scope.formData[name].mProfesion = {
            Codigo: null
          };
          $scope.formData[name].mDay = {
            id: null
          };
          $scope.formData[name].mMonth = {
            id: null
          };
          $scope.formData[name].mYear = {
            id: null
          };
          if(isCompany){
            $scope.formData[name].mRazonSocial = data.Nombre;
          }
          else{
            $scope.formData[name].mNomContratante = data.Nombre;
            $scope.formData[name].mApePatContratante = data.ApellidoPaterno;
            $scope.formData[name].mApeMatContratante = data.ApellidoMaterno;

            $scope.formData[name].mDay = {
              Codigo: data.day.Codigo,
              id: data.day.Descripcion
            };
            $scope.formData[name].mMonth = {
              Codigo: data.month.Codigo,
              id: data.month.Descripcion
            };
            $scope.formData[name].mYear = {
              Codigo: data.year.Codigo,
              id: data.year.Descripcion
            };
            $scope.formData[name].mSexo = data.Sexo == '1' ? 'H' : 'M';
            $scope.formData[name].mProfesion = data.Profesion;
          }

          $scope.formData[name].mTelefonoFijo = data.Telefono;
          $scope.formData[name].mTelefonoCelular = data.Telefono2;
          $scope.formData[name].mCorreoElectronico = data.CorreoElectronico;

          $scope.formData[name].Ubigeo = {
            CodigoDepartamento: data.Department.Codigo,
            CodigoDistrito: data.District.Codigo,
            CodigoProvincia: data.Province.Codigo,
            CodigoVia: (data.Via && data.Via.Codigo) ? data.Via.Codigo : "",
            ViaDescripcion: (data.Via && data.Via.Codigo) ? data.Via.Descripcion : "",
            NombreVia: data.NombreVia,
            CodigoNumero: (data.NumberType && data.NumberType.Codigo) ? data.NumberType.Codigo : "",
            NumeroDescripcion: (data.NumberType && data.NumberType.Codigo) ? data.NumberType.Descripcion : "",
            TextoNumero: data.TextoNumero,
            CodigoInterior: (data.Inside && data.Inside.Codigo) ? data.Inside.Codigo : "",
            InteriorDescripcion: (data.Inside && data.Inside.Codigo) ? data.Inside.Descripcion : "",
            TextoInterior: data.TextoInterior,
            CodigoZona: (data.Zone && data.Zone.Codigo) ? data.Zone.Codigo : "",
            ZonaDescripcion: (data.Zone && data.Zone.Codigo) ? data.Zone.Descripcion : "",
            TextoZona: data.TextoZona,
            Direccion: data.Direccion,
            NombreDepartamento: data.Department.Descripcion,
            NombreDistrito: data.District.Descripcion,
            NombreProvincia: data.Province.Descripcion,
            Referencia: data.Referencia
          };

          $scope.formData[address] = {
            ubigeoData: {}
          }

          $scope.formData[address].mTipoNumero = data.NumberType;
          $scope.formData[address].mNumeroDireccion = data.TextoNumero;
          $scope.formData[address].mTipoInterior = data.Inside;
          $scope.formData[address].mNumeroInterior = data.TextoInterior;
          $scope.formData[address].mTipoZona = data.Zone;
          $scope.formData[address].mNombreZona = data.TextoZona;
          $scope.formData[address].mDirReferencias = data.Referencia;
          $scope.formData[address].mTipoVia = data.Via;
          $scope.formData[address].mNombreVia = data.NombreVia;

          $scope.formData[address].ubigeoData.mDepartamento = data.Department;
          $scope.formData[address].ubigeoData.mProvincia = data.Province;
          $scope.formData[address].ubigeoData.mDistrito = data.District;

        }

        function loadPersonData(){
          var data = $scope.formData.contractor;

          $scope.formData.contractor.TipoDocumento = { Codigo: data.tipoDocumento },
          $scope.formData.contractor.NumeroDocumento = data.codigoDocumento,
          $scope.formData.contractor.ActividadEconomica = data.actividadEconomica;
          $scope.formData.contractor.ApellidoPaterno = data.apellidoPaterno;
          $scope.formData.contractor.ApellidoMaterno = data.apellidoMaterno;
          $scope.formData.contractor.Nombre = data.nombre;
          $scope.formData.contractor.FechaNacimiento = data.fechaNacimiento;
          $scope.formData.contractor.CorreoElectronico = data.correoElectronico;
          $scope.formData.contractor.Telefono = data.telefono;
          $scope.formData.contractor.Telefono2 = data.telefono2;
          $scope.formData.contractor.Sexo = data.sexo;
          $scope.formData.contractor.Score = data.score;
        }

      function validarAccionista(){
        if(!$scope.formData.accionistasSocios){
          return $scope.accionistaValid=true;
        }else{
          angular.forEach($scope.formData.accionistas, function(value){
            if (value.documentType!=null && value.documentNumber!=null && value.Relacion!=null){
              $scope.accionistaValid=true;
            }else{
              $scope.accionistaValid=false;
            }
          });
        }
      }

        $scope.nextStep = function() {
          $scope.$broadcast('submitForm', true);
          if ($scope.vehicleDetailsValid.func() & $scope.contractorValid && ($scope.formData.accionistasSocios ? $scope.accionistaValid : true)  && (!$scope.formData.aseguradoFlag ? $scope.contractor2Valid : true ) ) {
            $scope.formData.step2$Valid = true;
            $scope.formData.emitedContractor = true;
            validarAccionista();
            if($scope.accionistaValid){
            $state.go('.',{
                step: 3
            });
          }

        }
        }
      }
    ]);
});
