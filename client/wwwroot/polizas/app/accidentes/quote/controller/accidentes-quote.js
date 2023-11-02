define([
  'angular', 'constants', 'mpfPersonConstants',
  '/polizas/app/accidentes/quote/service/accidentesFactory.js',
  '/scripts/mpf-main-controls/components/modalConfirmation/component/modalConfirmation.js',
  'mpfPersonComponent'
], function(angular, constants, personConstants){

  var appAccidentes = angular.module('appAccidentes');

  appAccidentes.controller('accidentesQuoteController', ['$scope', 'oimPrincipal', 'accidentesFactory', '$rootScope', '$stateParams', '$timeout', 'mModalAlert', '$state', '$window', 'mpSpin', '$uibModal', 'claims', 'mainServices','proxyGeneral','proxyReferido',
  function($scope, oimPrincipal, accidentesFactory, $rootScope, $stateParams, $timeout, mModalAlert, $state, $window, mpSpin, $uibModal, claims, mainServices, proxyGeneral,proxyReferido){
      var num = 0;
      (function onLoad(){
        $scope.formData = $rootScope.formData || {};
        $scope.formData.PrimaNetaIndividual = 0 ;
        $scope.formData.PrimaNeta = 0 ;
        $scope.formData.PrimaTotal = 0 ;
        $scope.formData.NumeroDocumento = 0;

        $scope.enableBlockFileds = true;
        $scope.noRiesgos = true;
        $scope.disableSgt = false;

        if (claims){
          $scope.formData.claims = {
            codigoUsuario:  claims[2].value.toUpperCase(),
            rolUsuario:     claims[12].value,
            nombreAgente:   claims[6].value.toUpperCase(),
            codigoAgente:   claims[7].value
          }
          $scope.userRoot = oimPrincipal.validateAgent('evoSubMenuEMISA','ACCIDENTES');
         /*  if ((oimPrincipal.isAdmin()) && $scope.formData.claims.nombreAgente != ''){
            $scope.userRoot = true;
          } */

          $scope.mAgente = {
            codigoAgente: $scope.formData.claims.codigoAgente,
            codigoNombre: $scope.formData.claims.codigoAgente + "-" + $scope.formData.claims.nombreAgente,
            importeAplicarMapfreDolar:0,
            mcamapfreDolar:"",
            codigoEstadoCivil:0,
            codigoUsuario: $scope.formData.claims.codigoUsuario,
            rolUsuario: $scope.formData.claims.rolUsuario
          };
        }

        $scope.companyCode = constants.module.polizas.accidentes.companyCode;
        $scope.appCode = personConstants.aplications.ACCIDENTES;
        $scope.formCode = personConstants.forms.COT_ACC_CN;

        $scope.$on('personForm', function(event, data) {
          if(data.legalPerson){
            $scope.formData.showNaturalRucPerson = false;
          }
          else{
            $scope.formData.showNaturalRucPerson = true;
          }
          setContratante(data.datosContratante);
        });

        $window.setTimeout(function(){
          getGestor();
          getEncuesta();
          loadTipoExpo();
          loadTipoDoc();
          loadClausulas();
          loadCoberturas();
          //loadCurrency();
          loadFranquicia();
          $scope.$apply();
        })

        $scope.formData.numReferido = JSON.parse(window.localStorage.getItem('profile')).numeroReferido;

        if($scope.userRoot){
          _validateReferredNumber();
        }

      })();

      var listenDocType = $scope.$watch('formData.mTipoDoc', function(nv, ov){
        if(nv === ov){
          return;
        }else{
          var numDocValidations = {};
          var tipo = (angular.isUndefined($scope.formData.mTipoDoc)) ? 0 : $scope.formData.mTipoDoc.Codigo
          mainServices.documentNumber.fnFieldsValidated(numDocValidations, tipo, 1);
          $scope.docNumMaxLength = numDocValidations.DOCUMENT_NUMBER_MAX_LENGTH;
          $scope.docNumMinLength = numDocValidations.DOCUMENT_NUMBER_MIN_LENGTH;
          $scope.typeNumeroDoc = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE;
          $scope.typeNumeroDocDisabled = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE_DISABLED;
        }
      });
      $scope.$on('$destroy', function(){
        listenDocType();
      });

      $scope.cleanContract = function(){
        $scope.formData.mNroDoc = '';
        $scope.formData.mNomContratante = '';
        $scope.formData.mApePatContratante = '';
        $scope.formData.mApeMatContratante = '';
        if($scope.esEmpresa){
          $scope.formData.mRazSocContratante = '';
        }
        $scope.showClean = false;
      }

      $scope.saveAgent = function(agent){
        $scope.formData.claims.codigoAgente = agent.codigoAgente;
        $scope.mAgente.codigoUsuario = $scope.formData.claims.codigoUsuario;
        _validateReferredNumber();
      }

      function _validateReferredNumber() {
        if($scope.formData.numReferido){
        proxyReferido.ValidateReferredNumber($scope.formData.numReferido,"ambos", $scope.mAgente.codigoAgente,$scope.userRoot, true)              
        .then(function(response){
            if (response.data == "F1" || response.data == "F2"){
              mModalAlert.showWarning(response.mensaje, '')
              window.location.href = "/polizas/#"
            }
            else if(response.data == "F3" ){
              mModalAlert.showWarning(response.mensaje, '')
              $scope.disableSgt = true;
              $scope.formData.msjReferidoValidate = response.mensaje;
            }
            else{
              $scope.disableSgt = false;
              $scope.formData.msjReferidoValidate = null;
            }
          });
      }
    }

      $scope.gLblTitle = 'Cotización póliza accidentes';

      $scope.error1 = '* Este campo es obligatorio'

      $scope.gLblActividad = {
        label:'Actividad',
        subLabel: 'Busque o seleccione una actividad',
        required: true
      };

      $scope.lblErrorCoti = {
        numeroAseg: 'Fuera de rango'//'Valor fuera del rango permitido (1-10089)'
      }

      $scope.gLblIniVig = {
        label: 'Fecha de inicio de vigencia',
        required: true
      };

      $scope.gLblFinVig = {
        label:'Fecha de término de vigencia',
        required: true
      };

      $scope.gLblNroAseg = {
        label:'Número de asegurados',
        required: true
      };

      $scope.gLblExposicion = {
        label:'Exposición al riesgo',
        required: true
      };

      $scope.gLblMoneda = {
        label:'Moneda',
        required: true
      };

      $scope.gLblTipoDoc = {
        label:'Tipo de documento',
        required: true
      };

      $scope.gLblNroDoc = {
        label:'Número de documento',
        required: true
      };

      $scope.gLblNomContratante = {
        label:'Nombre',
        required: true
      };

      $scope.gLblApePatContratante = {
        label:'Apellido paterno',
        required: true
      };

      $scope.gLblApeMatContratante = {
        label:'Apellido materno',
        required: true
      };

      $scope.gLblRazSocContratante = {
        label:'Razón social',
        required: true
      };

      $scope.$watch('formData', function(nv)
      {
        $rootScope.formData =  nv;
      })

      var _self = this;

      function getGestor(){
        if((typeof $scope.mAgente != 'undefined')){

          var params = {
            codCia: constants.module.polizas.accidentes.companyCode,
            codAgente: $scope.mAgente.codigoAgente
          };

          accidentesFactory.getGestor(params, false).then(function(response){
            if(response.OperationCode == constants.operationCode.success){
              $scope.formData.CodigoGestor = response.Data.codigoGestor;
              $scope.formData.CodigoOficina = response.Data.codigoOficina;
            }else if (response.Message.length > 0){

            }
          }, function(error){
            console.log('Error en getGestor: ' + error);
          });
        }
      }

      function getEncuesta(){
        var codCia = constants.module.polizas.accidentes.companyCode;
        var codeRamo = constants.module.polizas.accidentes.codeRamo;

        proxyGeneral.GetEncuesta(codCia, codeRamo, false).then(function(response) {
          if(response.OperationCode == constants.operationCode.success){
            if (Object.keys(response.Data.Pregunta).length > 0){
              $scope.encuesta = response.Data;
            }else{
              $scope.encuesta = {};
              $scope.encuesta.mostrar = 0;
            }
          }
        }, function(error){
          console.log('Error en getGestor: ' + error);
        })
      }

      /*########################
      # Actividad
      ########################*/
      var seed = undefined;
      $scope.loading = false;

      $scope.searchActividad = function(wilcar){
        if (wilcar && wilcar.length>=3){
          if (seed) {
            $timeout.cancel(seed);
            $scope.wActividades = [];
            $scope.loading = false;
          }
          seed =  $timeout(function(){
            $scope.loading = true;

            accidentesFactory.getActividades(wilcar, false).then(function(response){
              if(response.OperationCode == constants.operationCode.success){
                $scope.wActividades = helper.clone(response.Data, true);
                $scope.loading = false;
              }else if (response.Message.length > 0){
                $scope.loading = false;
              }
            }, function(error){
              console.log('Error en getActividades: ' + error);
            });

          }, 200)
        }
        else if (seed) {
          $timeout.cancel(seed);
          $scope.wActividades = [];
          $scope.loading = false;
        }
        else{
          $scope.wActividades = [];
          $scope.loading = false;
        }
      };

      /*########################
      # Asegurados
      ########################*/
      $scope.maxAseg = 10090;

      /*########################
      # Exposicion
      ########################*/
      function loadTipoExpo(){
        var params = {
          CodigoExposicion: 0
        };

        accidentesFactory.getTipoExpo(params, false).then(function(response){
          if (response.OperationCode == constants.operationCode.success){
            $scope.exposicion = response.Data;
          }
        });
      }
      /*########################
      # Moneda
      ########################*/
      $scope.monedas = [{"Codigo":2,"Descripcion":"Dólares"}, {"Codigo":1,"Descripcion":"Soles"}];

      function loadCurrency(){
        accidentesFactory.getCurrencyTypes(false).then(function(response){
          if (response.OperationCode == constants.operationCode.success){
            $scope.monedas = response.Data;
          }
        });
      }

      /*########################
      # Vigencia
      ########################*/

      $scope.format = 'dd/MM/yyyy';
      $scope.altInputFormats = ['M!/d!/yyyy'];

      $scope.popup1 = {
          opened: false
      };
      $scope.popup2 = {
          opened: false
      };

      $scope.open1 = function() {
          $scope.popup1.opened = true;
      };

      $scope.open2 = function() {
          $scope.popup2.opened = true;
      };

      $scope.formData.mConsultaDesde = new Date();

      var hasta = new Date();
      hasta.setFullYear(hasta.getFullYear() + 1);
      $scope.formData.mConsultaHasta = hasta;

      $scope.dateOptions = {
        initDate: new Date(),
        maxDate: accidentesFactory.agregarMes(new Date(), 4)
        //minDate: new Date()
      };

      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
     // console.log(tomorrow);

      $scope.dateOptions2 = {
        minDate: tomorrow,
        maxDate: $scope.formData.mConsultaHasta

      };

      $scope.$watch('formData.mConsultaDesde', function(nv)
      {
        $scope.dateOptions2.initDate = $scope.formData.mConsultaDesde;
        $scope.dateOptions2.minDate = $scope.formData.mConsultaDesde;
        console.log($scope.formData.mConsultaDesde);
      });

      $scope.updateFechaDesde = function(val){
        if(typeof $scope.formData.mConsultaDesde != 'undefined'){
          $scope.formData.mConsultaHasta = angular.copy(val);
          $scope.formData.mConsultaHasta.setFullYear($scope.formData.mConsultaHasta.getFullYear() + 1);
          $scope.dateOptions2.maxDate = $scope.formData.mConsultaHasta;
          $scope.dateOptions2.minDate = tomorrow;
        }
      }

       $scope.$watch('formData.mConsultaHasta', function(nv)
      {
        if (typeof $scope.formData.mConsultaHasta != 'undefined'){
          $scope.formData.mDiasVigencia = calculateDate($scope.formData.mConsultaDesde, $scope.formData.mConsultaHasta);
        }
      });

      function calculateDate(date1, date2){
        diffc = date1.getTime() - $scope.formData.mConsultaHasta.getTime();
        days = Math.round(Math.abs(diffc/(1000*60*60*24)));
        return days;
      }

      /*########################
      # Tipo Doc
      ########################*/
      $scope.docEmpresa = 'RUC';
      function loadTipoDoc(){
        accidentesFactory.getDocumentTypes().then(function(response){
          $scope.tipoDocumento = response.Data
        });
      }
      function setContratante(data){
        if(typeof data.Sexo == 'undefined') {data.Sexo = '';}

          $scope.formData.mTipoDoc = data.documentType;
          $scope.formData.mNroDoc = data.documentNumber;
          $scope.formData.mNomContratante = data.Nombre;
          $scope.formData.mRazSocContratante = data.Nombre;
          $scope.formData.mApePatContratante = data.ApellidoPaterno;
          $scope.formData.mApeMatContratante = data.ApellidoMaterno;
          $scope.formData.FechaNacimiento = data.FechaNacimiento;
          $scope.formData.Sexo = data.Sexo;
          $scope.formData.ImporteMapfreDolar =  parseFloat(data.SaldoMapfreDolar).toFixed(2);
          $scope.formData.CodigoDepartamento = data.CodigoDepartamento;
          $scope.formData.CodigoProvincia = data.CodigoProvincia;
          $scope.formData.CodigoDistrito = data.CodigoDistrito;
      }
      $scope.clean = function(){
                setContratante({Ubigeo:{}});
                $scope.showClean = false;
                $scope.formData.mTipoDoc = { Codigo : null}
                $scope.formData.mNroDoc = "";
      }
      $scope.getContratante = function(){
        if ((typeof $scope.formData.mTipoDoc.Codigo != 'undefined')|| (typeof $scope.formData.mNroDoc != 'undefined')){
          $scope.formData.showNaturalRucPerson = mainServices.fnShowNaturalRucPerson($scope.formData.mTipoDoc.Codigo, $scope.formData.mNroDoc);
          if(!$scope.formData.showNaturalRucPerson)
            $scope.esEmpresa = true;
          }else{
            $scope.esEmpresa = false;
          var paramsContractor = {
            codeEnterprise: constants.module.polizas.accidentes.companyCode,
            documentType: $scope.formData.mTipoDoc.Codigo,
            documentNumber: $scope.formData.mNroDoc
          }
          setContratante({Ubigeo:{}});
          accidentesFactory.getDatosContratante(paramsContractor, true).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              $scope.showClean = true;
              setContratante(response.Data)
            }
          });
        }
      }

      /*########################
      # Riesgos
      ########################*/
      $scope.riesgos = [];
      $scope.clausulas = [{"Codigo":2,"Descripcion":"NO","selected":false, "valor": "N"},{"Codigo":1,"Descripcion":"SI","selected":true, "valor": "S"}];

      function loadClausulas(){
        var params = {
          CodigoClausula: 0
        };

        accidentesFactory.getClausulas(params, false).then(function(response){
          if (response.OperationCode == constants.operationCode.success){
            $scope.listClausulas = response.Data;
          }
        });
      }

      function loadFranquicia(){
        accidentesFactory.getFranquicia(constants.module.polizas.accidentes.codFranquicia, false).then(function(response){
          if (response.OperationCode == constants.operationCode.success){
            $scope.franquicias = response.Data;
          }
        });
      }

      function loadCoberturas(){
        var params = {
          CodigoCobertura: 0
        };

        accidentesFactory.getCoberturas(params, false).then(function(response){
          if (response.OperationCode == constants.operationCode.success){
            $scope.coberturas = response.Data;
          }
        });
      }

      function getListaAsignacion(){
        var listaAsign = [];
        for(var i=0; i<$scope.coberturas.length; i++){


           if($scope.coberturas[i].CodigoCobertura==1){
            var asign = {
               // Cobertura:{
                CoberturaSumaAsegurada: $scope.formData.mCoberturaMuerte,
                CodigoCobertura: $scope.coberturas[i].CodigoCobertura,
                NombreCobertura: $scope.coberturas[i].NombreCobertura
              //}
            }
            listaAsign.push(asign);
          }else{
            if(i<4){

              if(typeof $scope.formData.mCobertura[i+1] == 'undefined'){
                $scope.formData.mCobertura[i+1] = 0;
              }

              var asign = {
               // Cobertura:{
                CoberturaSumaAsegurada: $scope.formData.mCobertura[i+1],//['cob_' + $scope.coberturas[i].CodigoCobertura],
                CodigoCobertura: $scope.coberturas[i].CodigoCobertura,
                NombreCobertura: $scope.coberturas[i].NombreCobertura
              //}
              }
              listaAsign.push(asign);
            }else{

              if(typeof $scope.formData.mCobertura[i] == 'undefined'){
                $scope.formData.mCobertura[i] = 0;
              }

              var asign = {
                //Cobertura:{
                  CoberturaSumaAsegurada: $scope.formData.mCobertura[i],//['cob_' + $scope.coberturas[i].CodigoCobertura],
                  CodigoCobertura: $scope.coberturas[i].CodigoCobertura,
                  NombreCobertura: $scope.coberturas[i].NombreCobertura
                //}
              }
              listaAsign.push(asign);
            }
          }
        }

        return listaAsign;
      }


      function getListaClausula(){
        var listaClau = [];

        for(var i=0; i<$scope.listClausulas.length; i++){
          var asign = {
            FlgSeleccionado:$scope.formData.mClasula['clau' + $scope.listClausulas[i].CodigoClausula].selected,
            CodigoClausura: $scope.listClausulas[i].CodigoClausula,
            NombreClausura: $scope.listClausulas[i].NombreClausula,
            ValorTasa: $scope.listClausulas[i].ValorClusula,
            FlgCodigoInt: 0//$scope.listClausulas[i].ValorClusula
          };
          listaClau.push(asign);
        }

        return listaClau;
      }

      function validarMontoCoberturas (){

        $scope.frmAccidente.markAsPristine();
        var montosVacio = false;

        if($scope.formData.mCoberturaMuerte > 0 && $scope.formData.mNumeroAseg >0){
          montosVacio = true;
        }else{
          montosVacio = false;
        }
        return montosVacio;
      }

      $scope.addRiesgo = function(){
        if($scope.mAgente.codigoAgente != '0'){
          if(validarMontoCoberturas()){
            $scope.validarReglasNegocio();
            $scope.validationForm();

            num++;

            if($scope.riesgoValidated && $scope.formData.validatedPaso1 && (typeof $scope.mAgente != 'undefined') ){

             // getRiesgos();

             var paramsRiesgo =
              {
                NumeroDocumento: $scope.formData.NumeroDocumento,
                CodigoExposicion: $scope.formData.mExposicion.CodigoExposicion,
                NumeroAsegurados: $scope.formData.mNumeroAseg,
                InicioVigencia: accidentesFactory.formatearFecha($scope.formData.mConsultaDesde),//'01/01/2017',
                FinVigencia: accidentesFactory.formatearFecha($scope.formData.mConsultaHasta),
                NumeroDiasVigencia: $scope.formData.mDiasVigencia,
                CodigoInterior: 1,//FIJO
                TipoMoneda: $scope.formData.mMoneda.Codigo,
                MensajeCumulo: '',
                PorcentajeAjusteRiesgo: 0, //fijo
                UsuarioRegistro: oimPrincipal.getUsername(), //$scope.mAgente.codigoUsuario, // USUARIO
                CodigoFranquicia: $scope.formData.mCobertura[6].Codigo,
                PrimaNetaIndividual: 0,
                PrimaNeta: 0,
                PrimaTotal: 0,
                CodigoRol : $scope.formData.claims.rolUsuario,//$scope.mAgente.rolUsuario,
                Ocupacion: {
                  Codigo: $scope.formData.Actividad.codigo,
                  CodigoGrupo: $scope.formData.Actividad.codigoGrupo
                },
                Contratante: {
                  TipoDocumento: $scope.formData.mTipoDoc.Codigo,
                  CodigoDocumento: $scope.formData.mNroDoc,
                  Nombre: ($scope.formData.mTipoDoc.Codigo == constants.documentTypes.ruc.Codigo) ? $scope.formData.mRazSocContratante : $scope.formData.mNomContratante, //$scope.formData.mNomContratante,
                  ApellidoPaterno: (typeof $scope.formData.mApePatContratante == 'undefined') ? '': $scope.formData.mApePatContratante,
                  ApellidoMaterno: (typeof $scope.formData.mApeMatContratante == 'undefined') ? '': $scope.formData.mApeMatContratante,
                  FechaNacimiento: $scope.formData.FechaNacimiento,
                  ImporteAplicarMapfreDolar: 0, //fijo
                  Sexo: $scope.formData.Sexo,
                },
                Agente: {
                  CodigoGestor: 0, //fijo
                  CodigoAgente: $scope.mAgente.codigoAgente
                },
                ListaAsignacion: getListaAsignacion(),
                ListaClausura: getListaClausula()
              };

              accidentesFactory.cotizarRiesgo(paramsRiesgo, true).then(function(response){
                if (response.OperationCode == constants.operationCode.success){
                //  console.log(response.Data);
                  $scope.formData.NumeroDocumento = response.Data;

                  accidentesFactory.ListarRiesgoAccidente($scope.formData.NumeroDocumento, true).then(function(response){
                    if (response.OperationCode == constants.operationCode.success){
                      $scope.riesgosListados = response.Data;
                      $scope.riesgos = [];
                      if(typeof $scope.riesgosListados != 'undefined'){
                        $scope.formData.PrimaNetaIndividual = 0;
                        $scope.formData.PrimaNeta = 0;
                        $scope.formData.PrimaTotal = 0;

                        for(var i=0; i<$scope.riesgosListados.length; i++){
                          var newRiesgo = {
                            nroRiesgo: i+1,
                            actividad: $scope.riesgosListados[i].NombreOcupacion,
                            numeroAseg: $scope.riesgosListados[i].NumeroAsegurados,
                            primaNetaAseg: $scope.riesgosListados[i].PrimaNetaIndividual,
                            primaNetaTotal: $scope.riesgosListados[i].PrimaNeta,
                            primaTotal: $scope.riesgosListados[i].PrimaTotal,
                            mostrarRiesgo: true
                          };

                          $scope.formData.PrimaNetaIndividual += newRiesgo.primaNetaAseg;
                          $scope.formData.PrimaNeta += newRiesgo.primaNetaTotal;
                          $scope.formData.PrimaTotal += newRiesgo.primaTotal;
                          $scope.riesgos.push(newRiesgo);
                        }
                      }

                    }else{
                      mModalAlert.showWarning(response.Message, "¡Verifique los montos ingresados!");
                      $scope.riesgoValidated = false;
                    }
                  });
                }else{
                  mModalAlert.showWarning(response.Message, "¡Verifique los montos ingresados!");
                  $scope.riesgoValidated = false;
                }
              });
            }

          }
          $timeout($scope.noRiesgos = false, 500);
        }else{
          mModalAlert.showError("No tiene un agente seleccionado", "Error");
        }
      }

      $scope.deleteRiesgo = function(index, NumeroRiesgo){
        if(typeof $scope.formData.NumeroDocumento != 'undefined'){
          var paramsRiesgoDel = {
            NumeroSecuencia : $scope.formData.NumeroDocumento,
            // NumeroRiesgo : index,
            NumeroRiesgo : NumeroRiesgo,
            Usuario : $scope.mAgente.codigoUsuario
          };

          accidentesFactory.deleteRiesgoCotizacion(paramsRiesgoDel, true).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              $scope.riesgos.splice(index, 1);
              // console.log('eliminado');
              updateRiesgos();
            }
          });
        }
      }

      function updateRiesgos(){
        $scope.formData.PrimaNetaIndividual = 0;
        $scope.formData.PrimaNeta = 0;
        $scope.formData.PrimaTotal = 0;

        for(var i=0; i<$scope.riesgos.length; i++){
          // if($scope.riesgos[i].mostrarRiesgo){
            $scope.formData.PrimaNetaIndividual += $scope.riesgos[i].primaNetaAseg;
            $scope.formData.PrimaNeta += $scope.riesgos[i].primaNetaTotal;
            $scope.formData.PrimaTotal += $scope.riesgos[i].primaTotal;
          // }
        }
      }

      function funDocNumMaxLength(documentType){
          //MaxLength documentType
          switch(documentType) {
            case constants.documentTypes.dni.Codigo:
              $scope.docNumMaxLength = 8;
              break;
            case constants.documentTypes.ruc.Codigo:
              $scope.docNumMaxLength = 11;
              break;
            default:
              $scope.docNumMaxLength = 13;
          }
      }

      $scope.showNaturalPerson = function(item){
        funDocNumMaxLength(item.Codigo);
      }

      /*########################
      # Validaciones
      ########################*/
      $scope.validarReglasNegocio = function(){

        if($scope.formData.mCobertura.cob_2 > (2*$scope.formData.mCobertura.cob_1)){
            mModalAlert.showWarning("La cobertura de Invalidez Permanente no puede superar el doble de la cobertura de Muerte Accidental", "¡Verifique los montos ingresados!");
            $scope.riesgoValidated = false;
        }else{$scope.riesgoValidated = true;}

        // if($scope.formData.mCobertura.cob_1 > 250000){
        //     mModalAlert.showWarning("La suma asegurada máxima es 250,000.00 dólares o su equivalente en soles para la cobertura de Muerte Accidental", "¡Verifique los montos ingresados!");
        //   $scope.riesgoValidated = false;
        // }else{$scope.riesgoValidated = true;}

        // if($scope.formData.mCobertura.cob_3 > 30){
        //     mModalAlert.showWarning("La suma asegurada máxima es 30.00 dólares o su equivalente en soles para la cobertura de Incapacidad Temporal (Diaria)", "¡Verifique los montos ingresados!");
        //   $scope.riesgoValidated = false;
        // }else{$scope.riesgoValidated = true;}

        if($scope.formData.mCobertura.cob_4 > (0.3*$scope.formData.mCobertura.cob_1)){
            mModalAlert.showWarning("La suma asegurada de la cobertura de Gastos de Curación sólo puede ser como máximo el 30% de Muerte Accidental", "¡Verifique los montos ingresados!");
          $scope.riesgoValidated = false;
        }else{$scope.riesgoValidated = true;}
      }

      $scope.validationForm = function(){
        $scope.$broadcast('submitForm', true);
        $scope.frmAccidente.markAsPristine();

        validarDatosContratante();

        //validar datos de la póliza
        if(typeof $scope.formData.Actividad == 'undefined' || typeof $scope.formData.Actividad.codigo == 'undefined' ||
           typeof $scope.formData.mNumeroAseg == 'undefined'  ||
           typeof $scope.formData.mExposicion == 'undefined' || typeof $scope.formData.mExposicion.CodigoExposicion == 'undefined' ||
           typeof $scope.formData.mMoneda == 'undefined' || typeof $scope.formData.mMoneda.Codigo == 'undefined' ||
           typeof $scope.formData.mDiasVigencia == 'undefined' || ($scope.formData.mNumeroAseg > $scope.maxAseg) ||
           ($scope.formData.mNumeroAseg==0)

       //    ||  $scope.datosContratanteValidated == false
        ){
          $scope.formData.validatedPaso1 =  false;
         // mModalAlert.showWarning("Para continuar debe completar los campos identificados con (*)", "¡Complete los campos obligatorios!");
        }else{
          $scope.formData.validatedPaso1 =  true;
        }
      }

      function validarDatosContratante(){
        $scope.nombre = '';
        $scope.apellido = '';
        $scope.datosContratanteValidated = true;

        if($scope.formData.mTipoDoc.Codigo==$scope.docEmpresa){
          if(!$scope.formData.showNaturalRucPerson){
            if ((typeof $scope.formData.mRazSocContratante == 'undefined')){
              $scope.datosContratanteValidated = false;
            }
          }else{
            if ((typeof $scope.formData.mNomContratante == 'undefined')){
              $scope.datosContratanteValidated = false;
            }
          }
        }else{
          if ((typeof $scope.formData.mNomContratante == 'undefined') ||
            (typeof $scope.formData.mApePatContratante == 'undefined') ||
            (typeof $scope.formData.mApeMatContratante == 'undefined')){

            $scope.datosContratanteValidated = false;
          }
        }

        if ((typeof $scope.formData.mApePatContratante != 'undefined') &&
          (typeof $scope.formData.mNomContratante != 'undefined')){
          $scope.nombre = $scope.formData.mNomContratante.toUpperCase();
          $scope.apellido = $scope.formData.mApePatContratante.toUpperCase();
        }

        if (typeof $scope.formData.mRazSocContratante != 'undefined'){
          $scope.nombre = $scope.formData.mRazSocContratante.toUpperCase();
        }
      }

      /*#########################
      # ModalConfirmation
      #########################*/
      $scope.showModalConfirmation = function(){
        $scope.$broadcast('submitForm', true);
        $scope.frmAccidente.markAsPristine();
        //guardarPaso3();
        $scope.validationForm();

        for(var i=0; i<$scope.riesgos.length; i++){
          if($scope.riesgos[i].mostrarRiesgo){
            $scope.conRiesgos = true;
          }
        }

        if($scope.formData.validatedPaso1 && $scope.datosContratanteValidated &&
          $scope.riesgos.length > 0 && $scope.conRiesgos &&
           (typeof $scope.riesgos != 'undefined')){

          $scope.dataConfirmation = {
            save:false
          };
          var vModalConfirmation = $uibModal.open({
            backdrop: true, // background de fondo
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            // size: 'lg',
            template : '<mpf-modal-confirmation data="dataConfirmation" close="close()"></mpf-modal-confirmation>',
            controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
              //CloseModal
              $scope.close = function () {
                $uibModalInstance.close();
              };
            }]
          });
          vModalConfirmation.result.then(function(){
            $scope.$watch('dataConfirmation', function(value){
              if (value.save) {
                $scope.guardarCotizacion();
              }
            });
            //Action after CloseButton Modal
            //console.log('closeButton');
          },function(){
            //Action after CancelButton Modal
           // console.log("CancelButton");
          });
       }
      }

      $scope.guardarCotizacion = function(){
        if($scope.mAgente.codigoAgente != '0'){
          var paramsCotizacion = {
            CodigoCompania: constants.module.polizas.accidentes.companyCode,
            CodigoTipoEntidad: 1,
            CodigoCorredor: $scope.mAgente.codigoAgente,
            NumeroSequence: $scope.formData.NumeroDocumento,
            Documento:{
                CodigoEstado:1,
                CodigoUsuario: oimPrincipal.getUsername().toUpperCase(), //$scope.mAgente.codigoUsuario,
                FechaRegistro: accidentesFactory.formatearFecha(new Date()),
                IpDocumento:'::1',
                CodigoUsuarioRED: 'Usuario', //$scope.mAgente.codigoUsuario,
                RutaDocumento: '',
                FlagDocumento: 'S',
                NombreDocumento: '',
                CodigoProceso: 1,
                CodigoProducto: constants.module.polizas.accidentes.codProducto,
                CodigoMoneda: $scope.formData.mMoneda.Codigo,
                MontoPrima: $scope.formData.PrimaTotal,
                NumeroDocumento: 0,
                Ubigeo:{
                    CodigoDepartamento: '',//$scope.formData.CodigoDepartamento,
                    CodigoProvincia: '',//$scope.formData.CodigoProvincia,
                    CodigoDistrito: '',//$scope.formData.CodigoDistrito
                }
            },
            Contratante:{
                FechaNacimiento: $scope.formData.FechaNacimiento,
                ImporteMapfreDolar: 0

            },
            Poliza:{
                InicioVigencia: accidentesFactory.formatearFecha($scope.formData.mConsultaDesde),
                FinVigencia: accidentesFactory.formatearFecha($scope.formData.mConsultaHasta)
            }
          };

          accidentesFactory.guardarCotizacion(paramsCotizacion, true).then(function(response){
              if (response.OperationCode == constants.operationCode.success){
                $scope.cotizado = response.Data;
                var NumeroDocumento = $scope.cotizado.Documento.NumeroDocumento;

                $scope.formData = {};

                // GUARDAR ENCUESTA
                if($scope.encuesta.mostrar == 1){
                  $scope.encuesta.numOperacion = NumeroDocumento;
                  $state.go('getAccidente', {quotation:NumeroDocumento, encuesta: $scope.encuesta}, {reload: true, inherit: false});
                }else{
                  $state.go('getAccidente', {quotation:NumeroDocumento}, {reload: true, inherit: false});
                }        
              }
            });
        }else{
          mModalAlert.showError("No tiene un agente seleccionado", "Error");
        }
      }

    }]).factory('loaderAccidentesQuoteController', ['accidentesFactory', '$q', 'mpSpin', function(accidentesFactory, $q, mpSpin){
      var claims;
      //Claims
      function getClaims(){
       var deferred = $q.defer();
        accidentesFactory.getClaims().then(function(response){
          claims = response;
          deferred.resolve(claims);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      return {
        getClaims: function(){
          if(claims) return $q.resolve(claims);
          return getClaims();
        }
      }

    }])

  });
