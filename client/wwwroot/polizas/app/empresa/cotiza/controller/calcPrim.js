(function($root, deps, action) {
  define(deps, action)
})(this, ['angular',
'/polizas/app/empresa/factory/empresasFactory.js'],
function(angular) {
  var appAutos = angular.module("appAutos");
  appAutos.controller("calcPrimController", [
    '$scope',
    'mModalAlert',
    '$state',
    '$anchorScroll',
    'mainServices',
    'empresasFactory',
    'oimAbstractFactory',
    'proxyGeneral',
    function(
      $scope,
      mModalAlert,
      $state,
      $anchorScroll,
      mainServices,
      empresasFactory,
      oimAbstractFactory,
      proxyGeneral
      ) {
      (function onLoad(){

        if ($scope.data.isValidStep1 !== true || $scope.data.isValidStep2 !== true) {
          $state.go("companyquot.steps", { step: 2 })
        }

        $scope.data = $scope.data || {}
        $scope.data.risks = $scope.data.risks || [];

        $scope.req = $scope.data.request;
        $scope.prima = $scope.data.prima;

        $scope.guardarCotizacion = guardarCotizacion;

        getEncuesta();

      })();

        $anchorScroll();
        $scope.isRuc = isRuc;

        $scope.filterConventions = function(item){
          var convenios = [];
          if(item.c01.MCAContratado == "S")
            convenios.push(item.c01);

          if(item.c02.MCAContratado == "S")
            convenios.push(item.c02);

          if(item.c03.MCAContratado == "S")
            convenios.push(item.c03);

          if(item.c04.MCAContratado == "S")
            convenios.push(item.c04);

          if(item.c05.MCAContratado == "S")
            convenios.push(item.c05);

          if(item.c06.MCAContratado == "S")
            convenios.push(item.c06);

          if(item.c07.MCAContratado == "S")
            convenios.push(item.c07);

          if(item.c08.MCAContratado == "S")
            convenios.push(item.c08);

          if(item.c09.MCAContratado == "S")
            convenios.push(item.c09);

          if(item.c10.MCAContratado == "S")
            convenios.push(item.c10);

          return convenios;
        }

        function isRuc() {
          var vNatural = true;
          if ($scope.data.mTipoDocumento && $scope.data.mNumeroDocumento) vNatural = mainServices.fnShowNaturalRucPerson($scope.data.mTipoDocumento.codigo, $scope.data.mNumeroDocumento);
          return !vNatural;
        }

        $scope.getSimbolMoney = function() {
          return !$scope.data.mMoneda || $scope.data.mMoneda.codigo == 1 ? 'S./' : '$'
        }

        function getEncuesta(){
          var codCia = constants.module.polizas.empresas.companyCode;
          var codeRamo = $scope.req.Producto.CodigoRamo;
  
          proxyGeneral.GetEncuesta(codCia, codeRamo, false).then(function(response) {
            if(response.OperationCode == constants.operationCode.success){
              if (Object.keys(response.Data.Pregunta).length > 0){
                $scope.encuesta = response.Data;
                $scope.encuesta.CodigoCompania = codCia;
					      $scope.encuesta.CodigoRamo = codeRamo;
              }else{
                $scope.encuesta = {};
                $scope.encuesta.mostrar = 0;
              }
            }
          }, function(error){
            console.log('Error en getEncuesta: ' + error);
          })
        }

        function guardarCotizacion(){
          var req = $scope.req;
          req.CodigoSistema = oimAbstractFactory.getOrigin();
          req.ConceptosDesglose = $scope.prima;
          empresasFactory.guardarCotizacion(req, true).then(
          function(response){
            if(response.OperationCode == 200){
              mModalAlert.showSuccess("Se ha guardado la cotización satisfactoriamente.", "Cotización").
              then(function() {
                empresasFactory.removeVarSS('data');
                var info = {
                  request: req,
                  response: response.Data,
                  data: $scope.data,
                  encuesta: null
                };
                if($scope.encuesta.mostrar == 1){
                  $scope.encuesta.numOperacion = req.Data.NumeroDocumento;
                  info.encuesta = $scope.encuesta;
                }

                $state.go("companyresumen", {
                  info: info
                });
              })
            }else{
              mModalAlert.showWarning("Ha ocurrido un error al intentar guardar la cotización", "Cotización");
            }
          });
        }
      }
    ]);
});
