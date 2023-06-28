(function($root, deps, action){
		define(deps, action)
})(this, [
'angular',
'constants',
'helper',
'modalSendEmail',
'/polizas/app/empresa/factory/empresasFactory.js',
'/scripts/mpf-main-controls/components/modalAssessment/component/modalAssessment.js'
],
function(
  angular,
  constants,
  helper){
  var appAutos =  angular.module("appAutos");
    appAutos.controller("resumenCotizaEmpresaController", [
      '$scope',
      '$state',
      '$timeout',
      '$sce',
      '$uibModal',
      'mainServices',
      'empresasFactory',
      '$http',
      'mpSpin',
      '$window',
      '$q',
      'mModalAlert',
      'oimAbstractFactory',
      function(
        $scope,
        $state,
        $timeout,
        $sce,
        $uibModal,
        mainServices,
        empresasFactory,
        $http,
        mpSpin,
        $window,
        $q,
        mModalAlert,
        oimAbstractFactory
        ){

        (function onLoad(){

          $scope.data = $scope.data || {};

          $scope.giros = ["0010", "0030", "0072", "0097", "0104", "0005", "0017", "0021", "0031", "0035", "0038", "0040", "0068", "0075", "0080", "0082", "0096", "0111", "0113", "0121", "0122", "0130", "0132", "0133", "0137", "0146", "0043", "0048", "0089", "0001", "0034", "0050", "0055", "0070", "0088", "0094", "0117", "0134", "0135", "0023", "0019", "0027", "0032", "0033", "0044", "0045", "0047", "0054", "0073", "0083", "0089", "0139"];
          $scope.viewMsgGiro = false;

          if (!$state.params.info) $state.go('companyquot.steps', {step: 1});
          else{
            $scope.request = $state.params.info.request;
            $scope.data = $state.params.info.data;
            $scope.response = $state.params.info.response;
            $scope.numDoc = $scope.response.NumeroDocumento;
            
          }

          $scope.isRuc = isRuc;

          // Firma
          $scope.paramsSignature = {
            tipoFirma: 1,
            tipoPoliza: "EMPRESA",
            numeroRamo: 0,
            numeroCompania: 0,
            numeroModalidad: 0,
            numeroCotizacion: 0,
            numeroPoliza: 0,
            numeroDocumento: $scope.numDoc,
            agrupador: $scope.numDoc,
            firma: ''
          };

          $scope.paramsPdf = {
            url: 'api/empresa/getDocumentoEmpresaPDFV2',
            data: $scope.numDoc
          }

          $scope.isMobile = helper.isMobile();
          $scope.isMyDream = oimAbstractFactory.isMyDream();

          // Al terminar de firmar
          $scope.onSignature = function (data) { }
        })();

      $scope.getDetails = getDetails;
      $scope.getConventions = getConventions;
      $scope.sendEmailResumen = sendEmailResumen;
      $scope.downloadResumen = downloadResumen;
      $scope.emitirPoliza = emitirPoliza;

      function emitirPoliza(val){
        $state.go('empresaEmit.steps', {quoteNumber: val, step: 1});
      }

      $timeout(function(){
        getDetails($scope.numDoc);
      }, 500);

      $timeout(function(){
        if($state.params.info.encuesta){
          $scope.encuesta = $state.params.info.encuesta;
          if($scope.encuesta.mostrar == 1){
            mostrarEncuesta();
          }
        }
      }, 700);

      function mostrarEncuesta(){
        $scope.encuesta.tipo = 'C';
        $scope.dataConfirmation = {
          save:false,
          valor: 0,
          encuesta: $scope.encuesta
        };
        var vModalConfirmation = $uibModal.open({
          backdrop: 'static', // background de fondo
          keyboard: false,
          scope: $scope,
          // size: 'lg',
          template : '<mpf-modal-assessment data="dataConfirmation" close="close()"></mpf-modal-assessment>',
          controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
            //CloseModal
            $scope.close = function () {
              $uibModalInstance.close();
            };
          }]
        });
        vModalConfirmation.result.then(function(){
        },function(){
        });
      }

      function getDetails(num){
        empresasFactory.getResumenCotizacion(num, true).then(
        function(response){
          $scope.data = response.Data;
          $scope.paramsSignature.numeroModalidad = response.Data.Producto.CodigoModalidad || 0;
          $scope.paramsSignature.numeroRamo = response.Data.Producto.CodigoRamo || '';
          $scope.paramsSignature.numeroCompania = response.Data.Producto.CodigoCia || 0;
          $scope.viewMsgGiro = evalMsgGiro($scope.data.GiroNegocio.Codigo);
        },
        function(error){
          mModalAlert("Ocurri� un error al intenar obtener el detalle de la cotizaci�n", "Emisi�n");
        });
      }

      function evalMsgGiro(code){
        return _.contains($scope.giros, code)
      }

      function getConventions(item) {
        return Object.keys(item)
          .reduce(function(convenios, k) {
          if (/^Convenio\d+/.test(k) && item[k].McaContratado === 'S'){
            return convenios.concat([item[k]]);
          }
          return convenios;
          }, []);
      }

        var vNatural = true;
        function isRuc() {
          if ($scope.data.mTipoDocumento && $scope.data.mNumeroDocumento) vNatural = mainServices.fnShowNaturalRucPerson($scope.data.mTipoDocumento.codigo, $scope.data.mNumeroDocumento);
          return !vNatural;
        }

        $scope.getSimbolMoney = function(){
          return !$scope.data.mMoneda || $scope.data.mMoneda.codigo ==1? 'S/.':'$'
        }

        function dataPDF(value) {
          var pdf ={

            CodigoCompania : value.codigoCompania,
            CodigoRamo : value.codigoTipoEntidad,
            CodigoAgente : value.codigoCorredor,
            CodigoGestor : "0",
            TipoDocContratante : value.contratante.tipoDocumento,
            NumDocContratante : value.contratante.codigoDocmento,
            CodigoOficina : "0",
            PolizaGrupo : "",
            CodigoModalidad : 0,
            RiesgoSujetoEvaluacion : value.sujetoEvaluacionTotal,
            TipoEmpresa : value.tipoEmpresa.descripcion,
            GiroNegocio : value.giroNegocio.Descripcion,
            CodigoMoneda : $scope.data.mMoneda.codigo,
            PrimaNeta : value.empresa.primaNeta,
            DerechoEmision : value.empresa.derechoEmision,
            Igv : value.empresa.igv,
            PrimaTotal : value.empresa.primaTotal,
            ImporteAplicarMapfreDolar : value.contratante.ImporteAplicarMapfreDolar ? value.contratante.ImporteAplicarMapfreDolar: 0,


            Contratante : ((value.contratante.nombre || '')+ ' '+(value.contratante.apellidoPaterno || '') +' ' + (value.contratante.apellidoMaterno || '')).toUpperCase(),
            Agente : $scope.data.agent.codigoNombre,
            Riesgos :[]
          }

          for (var x = 0; x < value.empresa.riesgos.length; x++){
            var risk = value.empresa.riesgos[x]
            pdf.Riesgos.push(
            {
              NumeroRiesgo : x+1,
              NombreDepartamento : risk.ubigeo.nombreDepartamento,
              NombreProvincia : risk.ubigeo.nombreProvincia,
              NombreDistrito : risk.ubigeo.nombreDistrito,
              TipoLocal : risk.tipoLocal.descripcion,
              Categoria : risk.categoria.descripcion,
              TotalEdificacion : risk.totalEdificacion,
              InstalacionesFijas : risk.instalacionesFijas,
              Contenido : risk.contenido,
              MaquinariaEquipo : risk.maquinariaEquipo,
              Mobiliario : risk.mobiliario,
              Existencias : risk.existencias,
              LucroCesante : risk.lucroCesante,
              McaContrataTerremoto : risk.mcaContrataTerremoto =="S"?"SI": "NO",
              McaContrataTerrorismo : risk.mcaContrataTerrorismo =="S"?"SI": "NO",
              ValorContenido : risk.valorContenido,
              LimiteCajaChica : risk.limiteCajaChica,
              LimiteCajaFuerte : risk.limiteCajaFuerte,
              LimiteTransitoBanco : risk.limiteTransitoBanco,
              LimitePoderCobradores : risk.limitePoderCobradores,
              NumeroCobradores : risk.numeroCobradores,
              SumaAseguradaC3 : risk.sumaAseguradaC3,
              SumaAseguradaC4 : risk.sumaAseguradaC4,
              LimiteUnico : risk.limiteUnico,
              SumaAseguradaC5 : risk.sumaAseguradaC5,
              SumaAseguradaC6 : risk.sumaAseguradaC6,
              NumeroAsegurados : risk.numeroAsegurados,
              SumaAseguradaC7 : risk.sumaAseguradaC7,
              SumaAseguradaC8 : risk.sumaAseguradaC8,
              SumaAseguradaC9 : risk.sumaAseguradaC9,
              SumaAseguradaC10 : risk.sumaAseguradaC10,
              AlarmaMonitoreo : risk.alarmaMonitoreo.descripcion
            });
          }

          return pdf;
        }

        function downloadPdf (value){
          var pdf = dataPDF(value);
          $scope.pdfURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + "/api/empresa/getDocumentoEmpresaPDFV2");
          $scope.pdfData = angular.toJson(pdf);
          $timeout(function(){
            document.getElementById('frmDownloadPDF').submit();
          })
        }

        $scope._download = function(){
          downloadPdf($scope.request);
        };

        function sendEmailResumen(){
          var val = $scope.numDoc;
          $scope.emailData = {
            reporteParam: {
                CodigoDocumento: val
            }
          };

          $scope.action = 'emitirEmpresa';
            $uibModal.open({
              backdrop: true, // background de fondo
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              // size: 'lg',
              template : '<mpf-modal-send-email action="action" data="emailData" close="close()"></mpf-modal-send-email>',
              controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
                //CloseModal
                $scope.close = function () {
                  $uibModalInstance.close();
                };
              }]
            });
        }

        function downloadResumen(){
          var vFileName = 'OIM_COTIZACION_' + $scope.numDoc + '.pdf';
          empresasFactory.generarPDF($scope.numDoc, vFileName);
        }

      }
    ]);
})
