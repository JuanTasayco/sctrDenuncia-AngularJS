﻿(function($root, deps, action) {
  define(deps, action);
})(this, [
'angular',
'helper',
'system',
'/polizas/app/empresa/factory/empresasFactory.js'
], function(
  angular,
  helper,
  system
  ) {
  var appAutos = angular.module('appAutos');

  appAutos.controller('riskItemController', [
    '$scope',
    'conventionsCompany',
    '$rootScope',
    '$timeout',
    '$element',
    '$attrs',
    'rickItemChanger',
    '$filter',
    'empresasFactory',
    'mModalAlert',
    function(
      $scope,
      conventionsCompany,
      $rootScope,
      $timeout,
      $element,
      $attrs,
      rickItemChanger,
      $filter,
      empresasFactory,
      mModalAlert){

      var $ctrl = this;

      function _initMonitoringAlarm(){
        var vData = $scope.data,
            vProduc = $ctrl.product,
            vMonitoringAlarm = vProduc.AlarmaMonitoreo;

        if (!vData.previousProduct || vProduc.CodigoProducto !== vData.previousProduct.CodigoProducto){

          vData.previousProduct = angular.copy(vProduc);

          vData.mServAlarmMonit = {
            value: vMonitoringAlarm.McaAlarmaMonitoreo,
            disabled: (vMonitoringAlarm.ActivoAlarmaMonitoreo == 'N') ? true : false
          };
          vData.mMarcaKitSmart = {
            value: vMonitoringAlarm.McaKitSmart,
            disabled: (vMonitoringAlarm.ActivoKitSmart == 'N') ? true : false
          };
          vData.mMarcaVideo = {
            value: vMonitoringAlarm.McaVideoWeb,
            disabled: (vMonitoringAlarm.ActivoVideoWeb == 'N') ? true : false
          };
          vData.mLlavero = {
            value: vMonitoringAlarm.McaLlaveroMedico,
            disabled: (vMonitoringAlarm.ActivoLlaveroMedico == 'N') ? true : false
          };
          if (vData.mMarcaTipoCom){
            vData.mMarcaTipoCom.Codigo = null
          }else{
            vData.mMarcaTipoCom = {Codigo: null};
          }
          vData.marcaTipoComData = empresasFactory.proxyGeneral.GetListTipoComunicacion(vProduc.CodigoCia, vProduc.CodigoRamo, true);
        }

      }

      (function onLoad(){
        $scope.errorConvenio1 = $rootScope.errorConvenio1;
        $scope.data = $ctrl.data || {};

        $scope.data.mTipoLocal = $ctrl.data.local || {};
        $scope.data.mCategoriaLocal = $ctrl.data.categoria || {};
        $scope.data.ubigeo = $ctrl.data.ubigeo || {};

        $scope.data.local = $ctrl.data.local || {};
        $scope.data.categoria = $ctrl.data.categoria || {};
        $scope.giro = $ctrl.giro;

        $scope.data.mTerremoto = $scope.data.mTerremoto || "N";
        $scope.data.mTerrorismo = $scope.data.mTerrorismo || "N";

        function _initConvenios(){
          $scope.data.c01 = $scope.data.c01 || {
            title: ($ctrl.product.CodigoProducto && ($ctrl.product.CodigoProducto == 129 || $ctrl.product.CodigoProducto == 130)) ? "CONVENIO I - INCENDIO Y LÍNEAS ALIADAS" : "CONVENIO I - INCENDIO, LÍNEAS ALIADAS Y LUCRO CESANTE",
            mEdificacion: 0,
            mFijas: 0,
            mContenido: 0,
            mMaquinaria: 0,
            mMovilidad: 0,
            mExistencias: 0,
            mEstables: 0,
            total: 0,
            mTerremoto: 'N',
            mTerrorismo: 'N',
            MCAContratado: ($ctrl.product.CodigoProducto == 129 || $ctrl.product.CodigoProducto == 130) ? "S" : "N"
          };

          $scope.data.c02 = $scope.data.c02 || {
            title: "CONVENIO II - ROBO Y/O ASALTA",
            contenido: {
              mFijas: 0,
              mMaquinaria: 0,
              mMobiliario: 0,
              mExistencias: 0,
              total: 0
            },
            declarado: {
              mChica: 0,
              mFuerte: 0,
              mTransito: 0,
              mCobradores: 0,
              mPoder: 0,
              total: 0
            },
            total: 0,
            MCAContratado: ($ctrl.product.CodigoProducto == 129 || $ctrl.product.CodigoProducto == 130) ? "S" : "N"
          };

          $scope.data.c03 = $scope.data.c03 || {
            title: ($ctrl.product.CodigoProducto == 130) ? "CONVENIO III - LUCRO CESANTE" : "CONVENIO III - RESPONSABILIDAD CIVIL",
            mCivil: 0,
            MCAContratado: ($ctrl.product.CodigoProducto == 130) ? "S" : "N"
          };

          $scope.data.c04 = $scope.data.c04 || {
            title: ($ctrl.product.CodigoProducto == 130) ? "CONVENIO IV - ACCIDENTES PERSONALES" : "CONVENIO IV - ROTURA DE MÁQUINA",
            mRotura : 0,
            MCAContratado: ($ctrl.product.CodigoProducto == 130) ? "S" : "N"
          };

          $scope.data.c05 = $scope.data.c05 || {
            title: "CONVENIO V - EQUIPO ELECTRÓNICO",
            mLimite: 0,
            mMovil: 0,
            MCAContratado: "N"
          };

          $scope.data.c06 = $scope.data.c06 || {
            title: "CONVENIO VI - ACCIDENTES PERSONALES",
            mAsegurados: 0,
            total: 0,
            MCAContratado: "N"
          };

          $scope.data.c07 = $scope.data.c07 || {
            title: "CONVENIO VII - DESHONESTIDAD DE EMPLEADOS",
            mEmpleados: 0,
            total: 0,
            MCAContratado: "N"
          };

          $scope.data.c08 = $scope.data.c08 || {
            title: "CONVENIO VIII - TREC - TODO RIESGO EQUIPO CONTRATISTA",
            mTrec: 0,
            MCAContratado: "N"
          };

          $scope.data.c09 = $scope.data.c09 || {
            title: "CONVENIO IX - CAR - TODO RIESGO DE CONTRATISTA",
            mCar: 0,
            MCAContratado: "N"
          };

          $scope.data.c10 = $scope.data.c10 || {
            title: "CONVENIO X - EAR - TODO RIESGO DE MONTAJE",
            mEar: 0,
            MCAContratado: "N"
          };
        }
        $scope.msgIncendio = false;
        $scope.msgRobo = false;

        switch($ctrl.giro){
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
            $scope.msgIncendio = true;
            $scope.msgRobo = false;
          break;
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
            $scope.msgIncendio = false;
            $scope.msgRobo = true;
          break;
          default:
            $scope.msgIncendio = false;
            $scope.msgRobo = false;
        }

        switch($ctrl.currency){
          case "1": //soles
            $scope.params = {
              currencyText: "S/",
              maxAmount: 2800000,
              maxDeclared: 52000,
              maxAmountC02: 1300000,
              maxAmountC02Fija: 65000,
              maxAmountC03: 780000,
              maxAmountC04: 780000,
              maxAmountC05: 780000,
              maxAmountC06: 78000,
              maxMovil: 5200,
              maxMovilRiesgo: 5200,
              maxAmountC07: 520000,
              maxAmountC08: 520000,
              maxAmountC09: 520000,
              maxAmountC10: 520000,
              maxAmountText: "2,800,000",
              maxDeclaredText: "52,000",
              maxAmountC02Text: "1,300,000",
              maxAmountC02FijaText: "65,000",
              maxAmountC03Text: "780,000",
              maxAmountC04Text: "780,000",
              maxAmountC05Text: "780,000",
              maxAmountC06Text: "78,000",
              maxMovilText: "5,200",
              maxMovilRiesgoText: "5,200",
              maxAmountC07Text: "520,000",
              maxAmountC08Text: "520,000",
              maxAmountC09Text: "520,000",
              maxAmountC10text: "520,000"
            }
          break;
          case "2": //dolares
            $scope.params = {
              currencyText: "$",
              maxAmount: 1000000,
              maxDeclared: 20000,
              maxAmountC02: 500000,
              maxAmountC02Fija: 25000,
              maxAmountC03: 300000,
              maxAmountC04: 300000,
              maxAmountC05: 300000,
              maxAmountC06: 30000,
              maxMovil: 2000,
              maxMovilRiesgo: 2000,
              maxAmountC07: 200000,
              maxAmountC08: 200000,
              maxAmountC09: 200000,
              maxAmountC10: 200000,
              maxAmountText: "1,000,000",
              maxDeclaredtext: "20,000",
              maxAmountC02Text: "500,000",
              maxAmountC02FijaText: "25,000",
              maxAmountC03Text: "300,000",
              maxAmountC04Text: "300,000",
              maxAmountC05Text: "300,000",
              maxAmountC06Text: "30,000",
              maxMovilText: "2,000",
              maxMovilRiesgoText: "2,000",
              maxAmountC07Text: "200,000",
              maxAmountC08Text: "200,000",
              maxAmountC09Text: "200,000",
              maxAmountC10Text: "200,000"
            }
          break;
        }

        $scope.departamentosData = empresasFactory.getDepartamentos();
        $scope.tipoLocalData = empresasFactory.getLocalType(1); //Tipo Local
        $scope.catConstruccionData = empresasFactory.getCategoryConstruction(1); //Categoria construccion
        $scope.alarmasData = empresasFactory.getAlarmType();

        if($ctrl.isValidStep1){
          _initConvenios();
          _initMonitoringAlarm();
        }

      })();

      //ubigeo
      $ctrl.data.ubigeo = {};
      $scope.$watch('data.mDepartamento', function(){
        if(!angular.isUndefined($scope.data.mDepartamento) && $scope.data.mDepartamento.Codigo != null){
          empresasFactory.getProvincias($scope.data.mDepartamento.Codigo).then(
            function(response){
              $ctrl.data.ubigeo.departamento = $scope.data.mDepartamento;
              $scope.provinciasData = response.Data;
            });
        }
      });

      $scope.$watch('data.mProvincia', function(){
        if(!angular.isUndefined($scope.data.mProvincia) && $scope.data.mProvincia.Codigo != null){
          empresasFactory.getDistritos($scope.data.mProvincia.Codigo).then(
            function(response){
              $ctrl.data.ubigeo.provincia = $scope.data.mProvincia;
              $scope.distritosData = response.Data;
            });
        }
      });

      $scope.$watch('data.mDistrito', function(){
        if(!angular.isUndefined($scope.data.mDistrito) && $scope.data.mDistrito.Codigo != null)
          $ctrl.data.ubigeo.distrito = $scope.data.mDistrito
        else
          $ctrl.data.ubigeo.distrito = {};
      });

      function evaluaSumaTotalConvenios(){
        var value1 = ($scope.data.mEdificacion == "" || angular.isUndefined($scope.data.mEdificacion)) ? 0 : parseFloat($scope.data.mEdificacion);
        var value4 = ($scope.data.mMaquinaria == "" || angular.isUndefined($scope.data.mMaquinaria)) ? 0 : parseFloat($scope.data.mMaquinaria);
        var value5 = ($scope.data.mMovilidad == "" || angular.isUndefined($scope.data.mMovilidad)) ? 0 : parseFloat($scope.data.mMovilidad);
        var value6 = ($scope.data.mExistencias == "" || angular.isUndefined($scope.data.mExistencias)) ? 0 : parseFloat($scope.data.mExistencias);
        var value7 = ($scope.data.mEstables == "" || angular.isUndefined($scope.data.mEstables)) ? 0 : parseFloat($scope.data.mEstables);
        var value16 = ($scope.data.mValorSumAsegResp == "" || angular.isUndefined($scope.data.mValorSumAsegResp)) ? 0 : parseFloat($scope.data.mValorSumAsegResp);

        var total = value1 + value4 + value5 + value6 + value7 + value16

        $scope.data.sumTotalConvenios = total;
        return (total <= $scope.params.maxAmount);
      }

      $scope.conventionErrors = {
        c01: [],
        c02: [],
        c03: [],
        c04: [],
        c05: [],
        c06: [],
        c07: [],
        c08: [],
        c09: [],
        c10: []
      };

      // convenio 1

      function evaluaConvenio1(){
        return ($scope.data.mEdificacion > 0 ||
           $scope.data.mMaquinaria > 0 ||
           $scope.data.mMovilidad > 0 ||
           $scope.data.mExistencias > 0 ||
           $scope.data.mEstables > 0);
      }

      function addError(convention, error) {
        if(!convention || !error || typeof $scope.conventionErrors[convention] === 'undefined') {
          return false;
        }
        if (!~$scope.conventionErrors[convention].indexOf(error)) {
          $scope.conventionErrors[convention].push(error);
        }
      }

      function removeError(convention, error) {
        if(!convention || !error || typeof $scope.conventionErrors[convention] === 'undefined') {
          return false;
        }
        var errorIdx = $scope.conventionErrors[convention].indexOf(error);
        if(~errorIdx) {
          $scope.conventionErrors[convention].splice(errorIdx, 1);
        }
      }

      if($ctrl.isValidStep1){
        var listenTerremoto = $scope.$watch('data.mTerremoto', function(){
          $scope.data.c01.mTerremoto = $scope.data.mTerremoto
        });

        $scope.data.mTerrorismo = 'S';
        $scope.data.c01.mTerrorismo = 'S';

        var listenEdificacion = $scope.$watch('data.mEdificacion', function() {
          if ($scope.data.mEdificacion == 0 || angular.isUndefined($scope.data.mEdificacion)){
            $scope.data.mEdificacion = '';
            $scope.data.c01.mEdificacion = 0;
            $scope.errorMax = false;
            removeError('c01', 'errorMax');
          }else{
            if(parseFloat($scope.data.mEdificacion) > $scope.params.maxAmount){
              $scope.errorMax = true;
              $scope.errorEdificacion = false;
              addError('c01', 'errorMax');
              removeError('c01', 'errorEdificacion');
            }else{
              $scope.errorEdificacion = false;
              $scope.errorMax = false;
              removeError('c01', 'errorMax');
              removeError('c01', 'errorEdificacion');
            }
            if($scope.data.mValorInstFijaTwo) {
              if($scope.data.mValorInstFijaTwo <= parseFloat($scope.data.mEdificacion) * 0.2){
                $scope.errorFijaEdificacion = false; removeError('c02', 'errorFijaEdificacion');
              } else {
                $scope.errorFijaEdificacion = true; addError('c02', 'errorFijaEdificacion');
              }
            }

          }
          $scope.sumTotalc01('mEdificacion');
        });

        var listenFijas = $scope.$watch('data.mFijas', function() {
          if ($scope.data.mFijas == 0 || angular.isUndefined($scope.data.mFijas)){
            $scope.data.mFijas = '';
          }
          $scope.sumTotalc01('mFijas');
        });

        var listenContenido = $scope.$watch('data.mContenido', function() {
          if ($scope.data.mContenido == 0 || angular.isUndefined($scope.data.mContenido)){
            $scope.data.mContenido = '';
          }else{
            if(evaluaSumaTotalConvenios()){
              $scope.data.c01.mContenido = parseFloat($scope.data.mContenido);
              if(!evaluaSumaTotalContenidoC2()){
                $scope.errorContenidoFija = false;
                $scope.errorContenidoMaq = false;
                $scope.errorContenidoMob = false;
                $scope.errorContenidoEx = false;
                removeError('c02', 'errorContenidoFija');
                removeError('c02', 'errorContenidoMaq');
                removeError('c02', 'errorContenidoMob');
                removeError('c02', 'errorContenidoEx');
              }
            }else{
              $scope.data.c01.mContenido = 0;
              mModalAlert.showWarning("La suma total de convenios supera el máximo permitido "+$scope.params.currencyText +" "+ $scope.params.maxAmountText, "");
            }
          }
          $scope.sumTotalc01('mContenido');
        });

        function evalMaquinaria(val1, val2, txtError, txtConvenio){
          if(val1){
            if(val2){
              if(val1 >= val2){
                removeError(txtConvenio, txtError);
                return false;
              }else{
                addError(txtConvenio, txtError);
                return true;
              }
            }else{
              removeError(txtConvenio, txtError);
              return false;
            }
          }else{
            if(val2){
              addError(txtConvenio, txtError);
              return true;
            }else{
              removeError(txtConvenio, txtError);
              return false;
            }
          }
        }

        var listenMaquinaria = $scope.$watch('data.mMaquinaria', function() {
          var val1 = $scope.data.mMaquinaria;
          var val2 = $scope.data.mValorMaqEquipTwo;
          var val4 = $scope.data.mValorSumAsegRot;
          var val5 = $scope.data.mValorLimUnic;

          //convenio 2
          $scope.errorContenidoMaq = evalMaquinaria(val1, val2, 'errorContenidoMaq', 'c02');
          $scope.data.c02.error = $scope.errorContenidoMaq;
          $scope.data.c02.contenido.mMaquinaria = $scope.data.c02.error ? 0 : parseFloat(val2);

          //convenio 4
          $scope.errorConvenio1Maq = evalMaquinaria(val1, val4, 'errorConvenio1Maq', 'c04');
          $scope.data.c04.error = $scope.errorConvenio1Maq;
          $scope.data.c04.mRotura = $scope.data.c04.error ? 0 : parseFloat(val4);

          //convenio 5
          $scope.errorMaxLimite = evalMaquinaria(val1, val5, 'errorMaxLimite', 'c05');
          $scope.data.c05.error = $scope.errorMaxLimite;
          $scope.data.c05.mLimite = $scope.data.c05.error ? 0 : parseFloat(val5);

          $scope.sumTotalc01('mMaquinaria');
          $scope.sumaTotalContenidoC1();
        });

        var listenMovilidad = $scope.$watch('data.mMovilidad', function() {
          if ($scope.data.mMovilidad == 0 || angular.isUndefined($scope.data.mMovilidad)){
            $scope.data.mMovilidad = '';
            if($scope.data.mValorMob){
              $scope.errorContenidoMob = true;
              addError('c02', 'errorContenidoMob');
            }else{
              $scope.errorContenidoMob = false;
              removeError('c02', 'errorContenidoMob');
            }
          }else{
            if($scope.data.mValorMob && $scope.data.mMovilidad >= $scope.data.mValorMob){
              $scope.errorContenidoMob = false;
              removeError('c02', 'errorContenidoMob');
            }else{
              if($scope.data.mMovilidad < $scope.data.mValorMob){
                $scope.errorContenidoMob = true;
                addError('c02', 'errorContenidoMob');
              }else{
                $scope.data.c01.mMovilidad = parseFloat($scope.data.mMovilidad);
                if(!evaluaSumaTotalContenidoC2()){
                  $scope.errorContenidoFija = false;
                  $scope.errorContenidoMaq = false;
                  $scope.errorContenidoMob = false;
                  $scope.errorContenidoEx = false;
                  removeError('c02', 'errorContenidoFija');
                  removeError('c02', 'errorContenidoMaq');
                  removeError('c02', 'errorContenidoMob');
                  removeError('c02', 'errorContenidoEx');
                }
              }
            }
          }
          $scope.sumTotalc01('mMovilidad');
          $scope.sumaTotalContenidoC1();
        });

        var listenExistencias = $scope.$watch('data.mExistencias', function() {
          if ($scope.data.mExistencias == 0 || angular.isUndefined($scope.data.mExistencias)){
            $scope.data.mExistencias = '';
            if($scope.data.mValorExisTwo){
              $scope.errorContenidoEx = true;
              addError('c02', 'errorContenidoEx');
            }else{
              $scope.errorContenidoEx = false;
              removeError('c02', 'errorContenidoEx');
            }
          }else{
            if($scope.data.mValorExisTwo && $scope.data.mExistencias >= $scope.data.mValorExisTwo){
              $scope.errorContenidoEx = false;
              removeError('c02', 'errorContenidoEx');
            }else{
              if($scope.data.mExistencias < $scope.data.mValorExisTwo){
                $scope.errorContenidoEx = true;
                addError('c02', 'errorContenidoEx');
              }else{
                $scope.data.c01.mExistencias = parseFloat($scope.data.mExistencias);
                if(!evaluaSumaTotalContenidoC2()){
                  $scope.errorContenidoFija = false;
                  $scope.errorContenidoMaq = false;
                  $scope.errorContenidoMob = false;
                  $scope.errorContenidoEx = false;
                  removeError('c02', 'errorContenidoFija');
                  removeError('c02', 'errorContenidoMaq');
                  removeError('c02', 'errorContenidoMob');
                  removeError('c02', 'errorContenidoEx');
                }
              }
            }
          }
          $scope.sumTotalc01('mExistencias');
          $scope.sumaTotalContenidoC1();
        });

        var listenEstables = $scope.$watch('data.mEstables', function() {
          if ($scope.data.mEstables == 0 || angular.isUndefined($scope.data.mEstables)){
            $scope.data.mEstables = '';
          }else{
              $scope.data.c01.mEstables = parseFloat($scope.data.mEstables);
              if(!evaluaSumaTotalContenidoC2()){
                $scope.errorContenidoFija = false;
                $scope.errorContenidoMaq = false;
                $scope.errorContenidoMob = false;
                $scope.errorContenidoEx = false;
                removeError('c02', 'errorContenidoFija');
                removeError('c02', 'errorContenidoMaq');
                removeError('c02', 'errorContenidoMob');
                removeError('c02', 'errorContenidoEx');
              }
          }
          $scope.sumTotalc01('mEstables');
        });
      }
      $scope.$on('$destroy', function $destroy(){
        listenTerremoto();
        listenEdificacion();
        listenFijas();
        listenContenido();
        listenMaquinaria();
        listenMovilidad();
        listenExistencias();
        listenEstables();
      });

      $scope.sumTotalc01 = function(input) {

        ($scope.data.mEdificacion == "" || angular.isUndefined($scope.data.mEdificacion))
        ? $scope.data.c01.mEdificacion = 0
        : $scope.data.c01.mEdificacion = parseFloat($scope.data.mEdificacion);

        ($scope.data.mMaquinaria == "" || angular.isUndefined($scope.data.mMaquinaria))
        ? $scope.data.c01.mMaquinaria = 0
        : $scope.data.c01.mMaquinaria = parseFloat($scope.data.mMaquinaria);

        ($scope.data.mMovilidad == "" || angular.isUndefined($scope.data.mMovilidad))
        ? $scope.data.c01.mMovilidad = 0
        : $scope.data.c01.mMovilidad = parseFloat($scope.data.mMovilidad);

        ($scope.data.mExistencias == "" || angular.isUndefined($scope.data.mExistencias))
        ? $scope.data.c01.mExistencias = 0
        : $scope.data.c01.mExistencias = parseFloat($scope.data.mExistencias);

        ($scope.data.mEstables == "" || angular.isUndefined($scope.data.mEstables))
        ? $scope.data.c01.mEstables = 0
        : $scope.data.c01.mEstables = parseFloat($scope.data.mEstables);

        var total =
        $scope.data.c01.mEdificacion +
        $scope.data.c01.mMaquinaria +
        $scope.data.c01.mMovilidad +
        $scope.data.c01.mExistencias +
        $scope.data.c01.mEstables;

        if($ctrl.product.CodigoProducto == 57){
          var val3 = $scope.data.mValorSumAsegResp;
          var max3 = $scope.params.maxAmountC03;
          if(total == 0){
            $scope.data.c01[input] = 0;
            $scope.data[input] = "";
            $scope.data.c01.MCAContratado = "N";
            $scope.data.c01.total = 0;
            $scope.errorMaxConvention01 = false;
            removeError('c03', 'errorMaxConvention01');
            $scope.data.c03.error = false;
            if(val3){
              $scope.errorMaxConvention01 = true;
              addError('c03', 'errorMaxConvention01');
              $scope.data.c03.error = true;
              if(val3 > max3){
                $scope.errorMaxAmountC03 = false;
                removeError('c03', 'errorMaxAmountC03');
              }
            }
          }else{
            $scope.data.c01.total = total;
            if(evaluaSumaTotalConvenios()){
            if(total <= $scope.params.maxAmount){
              if(val3){
                if(val3 <= total){
                  if(val3 <= max3){
                    $scope.errorMaxAmountC03 = false;
                    removeError('c03', 'errorMaxAmountC03');
                    $scope.errorMaxConvention01 = false;
                    removeError('c03', 'errorMaxConvention01');
                    $scope.data.c03.error = false;
                    $scope.data.c03.mCivil = parseFloat(val3);
                  }else{
                    $scope.errorMaxAmountC03 = true;
                    addError('c03', 'errorMaxAmountC03');
                    $scope.errorMaxConvention01 = false;
                    removeError('c03', 'errorMaxConvention01');
                    $scope.data.c03.error = true;
                  }
                }else{
                  $scope.errorMaxAmountC03 = false;
                  removeError('c03', 'errorMaxAmountC03');
                  $scope.errorMaxConvention01 = true;
                  addError('c03', 'errorMaxConvention01');
                  $scope.data.c03.error = true;
                }
              }
              $scope.data.c01.MCAContratado = "S";
              showErrorVB();
              showErrorMax();
              showErrorEmpty();
            }else{
              mModalAlert.showWarning("La suma total excede el máximo valor permitido para el Convenio I: "+$scope.params.currencyText+" "+$scope.params.maxAmountText, "");
              $scope.data.c01[input] = 0;
              $scope.data[input] = 0;
              $scope.data.c01.MCAContratado = "N";
              $scope.errorVBTrec = false;
              $scope.errorVBCar = false;
              $scope.errorVBEar = false;
            }
            }else{
              $scope.data.c01.total = 0;
              $scope.data[input] = 0;
              $scope.data.c01[input] = 0;
              $scope.data.c01.MCAContratado = "N";
              mModalAlert.showWarning("La suma total de convenios supera el máximo permitido "+$scope.params.currencyText +" "+ $scope.params.maxAmountText, "");
            }
          }
        }else{
          $scope.data.c01.MCAContratado = "S";
        }

      }

      function showErrorVB(){
        $scope.errorVBSumAseg = ($scope.data.c01.total && ($scope.data.c01.total < $scope.params.maxAmountC07) && ($scope.data.mValorSumAseg < $scope.data.c01.total)) ? true : false;

        $scope.errorVBTrec = ($scope.data.c01.total && ($scope.data.c01.total < $scope.params.maxAmountC08) && ($scope.data.mValorSumAsegTrec < $scope.data.c01.total)) ? true : false;

        $scope.errorVBCar = ($scope.data.c01.total && ($scope.data.c01.total < $scope.params.maxAmountC09) && ($scope.data.mValorSumAsegCar < $scope.data.c01.total)) ? true : false;

        $scope.errorVBEar = ($scope.data.c01.total && ($scope.data.c01.total < $scope.params.maxAmountC10) && ($scope.data.mValorSumAsegEar < $scope.data.c01.total)) ? true : false;
      }

      function showErrorEmpty(){
        $scope.errorSumaAseg7 = $scope.data.c01.total && ($scope.data.c07.mEmpleados != 0) && ($scope.data.c07.total == 0)
        $scope.data.c07.error = $scope.errorSumaAseg7;
        if($scope.data.c07.error) addError('c07', 'errorSumaAseg7');
        else removeError('c07', 'errorSumaAseg7');
      }

      function showErrorMax(){
        $scope.errorMaxAmountC07 = ($scope.data.c01.total && ($scope.data.c01.total < $scope.params.maxAmountC07) &&
          ($scope.data.c07.total > $scope.data.c01.total)) ? true : false;
        $scope.data.c07.error = $scope.errorMaxAmountC07;
        if($scope.data.c07.error) addError('c07', 'errorMaxAmountC07');
        else removeError('c07', 'errorMaxAmountC07');

        $scope.errorMaxAmountC08 = ($scope.data.c01.total && ($scope.data.c01.total < $scope.params.maxAmountC08) && ($scope.data.mValorSumAsegTrec > $scope.data.c01.total)) ? true : false;
        $scope.data.c08.error = $scope.errorMaxAmountC08;
        if($scope.data.c08.error) addError('c08', 'errorMaxAmountC08');
        else removeError('c08', 'errorMaxAmountC08');

        $scope.errorMaxAmountC09 = ($scope.data.c01.total && ($scope.data.c01.total < $scope.params.maxAmountC09) && ($scope.data.mValorSumAsegCar > $scope.data.c01.total)) ? true : false;
        $scope.data.c09.error = $scope.errorMaxAmountC09;
        if($scope.data.c09.error) addError('c09', 'errorMaxAmountC09');
        else removeError('c09', 'errorMaxAmountC09');

        $scope.errorMaxAmountC10 = ($scope.data.c01.total && ($scope.data.c01.total < $scope.params.maxAmountC10) && ($scope.data.mValorSumAsegEar > $scope.data.c01.total)) ? true : false;
        $scope.data.c10.error = $scope.errorMaxAmountC10;
        if($scope.data.c10.error) addError('c10', 'errorMaxAmountC10');
        else removeError('c10', 'errorMaxAmountC10');
      }

      //convenio 2 - contenido
      $scope.sumaTotalContenidoC1 = function() {
        ($scope.data.mMaquinaria == "")
        ? $scope.data.c01.mMaquinaria = 0
        : $scope.data.c01.mMaquinaria = parseFloat($scope.data.mMaquinaria);

        ($scope.data.mMovilidad == "")
        ? $scope.data.c01.mMovilidad = 0
        : $scope.data.c01.mMovilidad = parseFloat($scope.data.mMovilidad);

        ($scope.data.mExistencias == "")
        ? $scope.data.c01.mExistencias = 0
        : $scope.data.c01.mExistencias = parseFloat($scope.data.mExistencias);

        var total = 0;

        total =
        $scope.data.c01.mMaquinaria +
        $scope.data.c01.mMovilidad +
        $scope.data.c01.mExistencias;
        $scope.data.c01.totalContenido = total;

        return total;
      }

      // CONVENTION TWO

      //valida si suma total de contenido de convenio 2
      //es mayor q suma de convenio 1 (cotenido, maquinaria y equipo, mobiliario, existencias)
      function validaContenidoTotal(val){
        var val1 = !$scope.data.mContenido || $scope.data.mContenido == "" ? 0 : parseFloat($scope.data.mContenido)
        var val2 = !$scope.data.mMaquinaria || $scope.data.mMaquinaria == "" ? 0 : parseFloat($scope.data.mMaquinaria)
        var val3 = !$scope.data.mMovilidad || $scope.data.mMovilidad == "" ? 0 : parseFloat($scope.data.mMovilidad)
        var val4 = !$scope.data.mExistencias || $scope.data.mExistencias == "" ? 0 : parseFloat($scope.data.mExistencias)
        $scope.totalContenidoc01 = val1 + val2 + val3 + val4
        return (val <= $scope.totalContenidoc01);
      }

      //suma total de convenio 2
      $scope.sumTotalc02 = function(){

        $scope.data.c02.total = 0;
        $scope.data.c02.total = $scope.data.c02.declarado.total;
        if($scope.data.c02.total > 0){
          $scope.data.c02.MCAContratado = "S";
          if($scope.data.c02.total > $scope.params.maxAmountC02){
            mModalAlert.showWarning("La suma total de este convenio no debe superar los "+$scope.params.currencyText+" "+$scope.params.maxAmountC02Text, "Convenio II");
            return false;
          }
          else return true;
        }else
          $scope.data.c02.MCAContratado = "N";
      }

      //convenio 2 - contenido
      $scope.sumaTotalContenidoC2 = function() {
        $scope.errorVBContenido = false;
        ($scope.data.mValorInstFijaTwo == "")
        ? $scope.data.c02.contenido.mFijas = 0
        : $scope.data.c02.contenido.mFijas = parseFloat($scope.data.mValorInstFijaTwo);

        ($scope.data.mValorMaqEquipTwo == "")
        ? $scope.data.c02.contenido.mMaquinaria = 0
        : $scope.data.c02.contenido.mMaquinaria = parseFloat($scope.data.mValorMaqEquipTwo);

        ($scope.data.mValorMob == "")
        ? $scope.data.c02.contenido.mMobiliario = 0
        : $scope.data.c02.contenido.mMobiliario = parseFloat($scope.data.mValorMob);

        ($scope.data.mValorExisTwo == "")
        ? $scope.data.c02.contenido.mExistencias = 0
        : $scope.data.c02.contenido.mExistencias = parseFloat($scope.data.mValorExisTwo);

        var total = 0;

        total =
        $scope.data.c02.contenido.mFijas +
        $scope.data.c02.contenido.mMaquinaria +
        $scope.data.c02.contenido.mMobiliario +
        $scope.data.c02.contenido.mExistencias;

        if(total == 0){
          $scope.data.c02.contenido.mFijas = 0;
          $scope.data.c02.contenido.mMaquinaria = 0;
          $scope.data.c02.contenido.mMobiliario = 0;
          $scope.data.c02.contenido.mExistencias = 0;
          $scope.data.c02.contenido.total = 0;
        }else{
          $scope.data.c02.contenido.total = total;
        }
        if(validaContenidoTotal(total)){ //l ocompara con contenido de C1
          $scope.sumTotalc02();
        }

        if(total > $scope.params.maxAmountC02 && total != 0) $scope.errorVBContenido = true;
        else $scope.errorVBContenido = false;

        $scope.errorVBContenido = parseFloat($scope.data.c02.declarado.totalDinero) > (parseFloat($scope.data.c02.contenido.total )* 0.10)  ||  $scope.data.c02.contenido.total > $scope.params.maxAmountC02;
      }

      function evaluaSumaTotalContenidoC2(){

        var total1 = 0
        total1 =
        $scope.data.c01.mContenido +
        $scope.data.c01.mMaquinaria +
        $scope.data.c01.mMovilidad +
        $scope.data.c01.mExistencias;

        //sumta total contenido convenio 2
        ($scope.data.mValorInstFijaTwo == "")
        ? $scope.data.c02.contenido.mFijas = 0
        : $scope.data.c02.contenido.mFijas = parseFloat($scope.data.mValorInstFijaTwo);

        ($scope.data.mValorMaqEquipTwo == "")
        ? $scope.data.c02.contenido.mMaquinaria = 0
        : $scope.data.c02.contenido.mMaquinaria = parseFloat($scope.data.mValorMaqEquipTwo);

        ($scope.data.mValorMob == "")
        ? $scope.data.c02.contenido.mMobiliario = 0
        : $scope.data.c02.contenido.mMobiliario = parseFloat($scope.data.mValorMob);

        ($scope.data.mValorExisTwo == "")
        ? $scope.data.c02.contenido.mExistencias = 0
        : $scope.data.c02.contenido.mExistencias = parseFloat($scope.data.mValorExisTwo);

        var total2 = 0;

        total2 =
        $scope.data.c02.contenido.mFijas +
        $scope.data.c02.contenido.mMaquinaria +
        $scope.data.c02.contenido.mMobiliario +
        $scope.data.c02.contenido.mExistencias;

        $scope.data.c02.contenido.total = total2;

        return (total2 <= total1);
      }

      if($ctrl.isValidStep1){
        $scope.$watch('data.mValorInstFijaTwo', function() {
          if($ctrl.product.CodigoProducto != 57) {
            return;
          }
          if ($scope.data.mValorInstFijaTwo == 0 || angular.isUndefined($scope.data.mValorInstFijaTwo)){
            $scope.data.mValorInstFijaTwo = "";
            $scope.errorContenidoFija = false;
            removeError('c02', 'errorContenidoFija');
            $scope.errorFijaEdificacion = false;
            removeError('c02', 'errorFijaEdificacion');
            $scope.data.c02.contenido.mFijas = 0;
          }else{
            if(evaluaConvenio1()){
              $scope.errorSumaMaxConvenio1 = false;
                if($scope.data.mValorInstFijaTwo > $scope.params.maxAmountC02Fija){
                  $scope.errorContenidoFija = true;
                  addError('c02', 'errorContenidoFija');
                  $scope.data.mValorInstFijaTwo = 0;
                  $scope.data.c02.contenido.mFijas = 0;
                  mModalAlert.showWarning("El Valor de Instalaciones Fijas no puede exceder "+$scope.params.currencyText +" "+ $scope.params.maxAmountC02FijaText, "");
                }else{
                  $scope.errorContenidoFija = false;
                  removeError('c02', 'errorContenidoFija');
                  if($scope.data.c02.contenido.total > $scope.params.maxAmountC02){
                    $scope.errorContenidoFija = false;
                    removeError('c02', 'errorContenidoFija');
                    $scope.data.c02.contenido.mFijas = 0;
                    $scope.data.mValorInstFijaTwo = 0;
                    mModalAlert.showWarning("El Valor Total Declarado del Convenio II no puede exceder "+$scope.params.currencyText +" "+ $scope.params.maxAmountC02Text, "");
                  }else{
                    if($scope.data.mValorInstFijaTwo <= ($scope.data.mEdificacion*0.2)){
                      $scope.errorFijaEdificacion = false;
                      removeError('c02', 'errorFijaEdificacion');
                      if(evaluaSumaTotalDeclarado()){
                        $scope.data.c02.contenido.mFijas = parseFloat($scope.data.mValorInstFijaTwo);
                      }else{
                        $scope.data.c02.contenido.mFijas = 0;
                        $scope.data.mValorInstFijaTwo = 0;
                        mModalAlert.showWarning("El Valor Total Declarado Convenio II no puede exceder "+$scope.params.currencyText+" "+$scope.params.maxAmountC02Text, "");
                      }
                    }else{
                      $scope.errorFijaEdificacion = true;
                      addError('c02', 'errorFijaEdificacion');
                    }
                  }
                }
            }else{
              $scope.errorContenidoFija = false;
              removeError('c02', 'errorContenidoFija');
              $scope.data.mValorInstFijaTwo = 0;
              $scope.data.c02.contenido.mFijas = 0;
              mModalAlert.showWarning("Es obligatorio contratar el convenio I para continuar", "");
            }
          }
          $scope.sumaTotalContenidoC2();
          $scope.sumTotalDeclaredc02();
        });

        $scope.$watch('data.mValorMaqEquipTwo', function() {
          if($ctrl.product.CodigoProducto != 57) {
            return;
          }
          if ($scope.data.mValorMaqEquipTwo == 0 || angular.isUndefined($scope.data.mValorMaqEquipTwo)){
            $scope.data.mValorMaqEquipTwo = "";
            $scope.errorContenidoMaq = false;
            removeError('c02', 'errorContenidoMaq');
            $scope.data.c02.contenido.mMaquinaria = 0;
          }else{
            if(evaluaConvenio1()){
                if($scope.data.mValorMaqEquipTwo <= $scope.data.mMaquinaria){
                  $scope.errorContenidoMaq = false;
                  removeError('c02', 'errorContenidoMaq');
                  if(evaluaSumaTotalDeclarado()){
                    $scope.data.c02.contenido.mMaquinaria = parseFloat($scope.data.mValorMaqEquipTwo)
                  }else{
                    $scope.data.mValorMaqEquipTwo = 0;
                    $scope.data.c02.contenido.mMaquinaria = 0;
                    mModalAlert.showWarning("El Valor Total Declarado Convenio II no puede exceder "+$scope.params.currencyText +" "+ $scope.params.maxAmountC02Text, "");
                  }
                }else{
                  $scope.errorContenidoMaq = true;
                  addError('c02', 'errorContenidoMaq');
                  if($scope.data.c02.contenido.total > $scope.params.maxAmountC02){
                    $scope.errorContenidoMaq = false;
                    removeError('c02', 'errorContenidoMaq');
                    $scope.data.c02.contenido.mMaquinaria = 0;
                    $scope.data.mValorMaqEquipTwo = 0;
                    mModalAlert.showWarning("El Valor Total Declarado Convenio II no puede exceder "+$scope.params.currencyText +" "+ $scope.params.maxAmountC02Text, "");
                  }
                }
            }else{
              $scope.errorContenidoMaq = false;
              removeError('c02', 'errorContenidoMaq');
              $scope.data.mValorMaqEquipTwo = 0;
              $scope.data.c02.contenido.mMaquinaria = 0;
              mModalAlert.showWarning("Es obligatorio contratar el convenio I para continuar", "");
            }
          }
          $scope.sumaTotalContenidoC2();
          $scope.sumTotalDeclaredc02();
        });

        $scope.$watch('data.mValorMob' , function() {
          if($ctrl.product.CodigoProducto != 57) {
            return;
          }
          if ($scope.data.mValorMob == 0 || angular.isUndefined($scope.data.mValorMob)){
            $scope.data.mValorMob = "";
            $scope.errorContenidoMob = false;
            removeError('c02', 'errorContenidoMob');
            $scope.data.c02.contenido.mMobiliario = 0;
          }else{
            if(evaluaConvenio1()){
                if($scope.data.mValorMob <= $scope.data.mMovilidad){
                  $scope.errorContenidoMob = false;
                  removeError('c02', 'errorContenidoMob');
                  if(evaluaSumaTotalDeclarado()){
                    $scope.data.c02.contenido.mMobiliario = parseFloat($scope.data.mValorMob)
                  }else{
                    $scope.data.mValorMob = 0;
                    $scope.data.c02.contenido.mMobiliario = 0;
                    mModalAlert.showWarning("El Valor Total Declarado Convenio II no puede exceder "+$scope.params.currencyText +" "+ $scope.params.maxAmountC02Text, "");
                  }
                }else {
                  $scope.errorContenidoMob = true;
                  addError('c02', 'errorContenidoMob');
                  if($scope.data.c02.contenido.total > $scope.params.maxAmountC02){
                    $scope.errorContenidoMob = false;
                    removeError('c02', 'errorContenidoMob');
                    $scope.data.mValorMob = 0;
                    $scope.data.c02.contenido.mMobiliario = 0;
                    mModalAlert.showWarning("La suma total de convenios supera el máximo permitido "+$scope.params.currencyText +" "+ $scope.params.maxAmountText, "");
                  }
                }
            }else{
              $scope.errorContenidoMob = false;
              removeError('c02', 'errorContenidoMob');
              $scope.data.mValorMob = 0;
              $scope.data.c02.contenido.mMobiliario = 0;
              mModalAlert.showWarning("Es obligatorio contratar el convenio I para continuar", "");
            }
          }
          $scope.sumaTotalContenidoC2();
          $scope.sumTotalDeclaredc02();
        });

        $scope.$watch('data.mValorExisTwo', function() {
          if($ctrl.product.CodigoProducto != 57) {
            return;
          }
          if ($scope.data.mValorExisTwo == 0 || angular.isUndefined($scope.data.mValorExisTwo)){
            $scope.data.mValorExisTwo = "";
            $scope.errorContenidoEx = false;
            removeError('c02', 'errorContenidoEx');
            $scope.data.c02.contenido.mExistencias = 0;
          }else{
            if(evaluaConvenio1()){
                if($scope.data.mValorExisTwo <= $scope.data.mExistencias){
                  $scope.errorContenidoEx = false;
                  removeError('c02', 'errorContenidoEx');
                  if(evaluaSumaTotalDeclarado()){
                    $scope.data.c02.contenido.mExistencias = parseFloat($scope.data.mValorExisTwo);
                  }else{
                    $scope.data.mValorExisTwo = 0;
                    $scope.data.c02.contenido.mExistencias = 0;
                    mModalAlert.showWarning("El Valor Total Declarado Convenio II no puede exceder "+$scope.params.currencyText +" "+ $scope.params.maxAmountC02Text, "");
                  }
                }else{
                  $scope.errorContenidoEx = true;
                  addError('c02', 'errorContenidoEx');
                  if($scope.data.c02.contenido.total > $scope.params.maxAmountC02){
                    $scope.errorContenidoEx = false;
                    removeError('c02', 'errorContenidoEx');
                    $scope.data.mValorExisTwo = 0;
                    $scope.data.c02.contenido.mExistencias = 0;
                    mModalAlert.showWarning("La suma total de convenios supera el máximo permitido "+$scope.params.currencyText +" "+ $scope.params.maxAmountText, "");
                  }
                }
            }else{
              $scope.errorContenidoEx = false;
              removeError('c02', 'errorContenidoEx');
              $scope.data.mValorExisTwo = 0;
              $scope.data.c02.contenido.mExistencias = 0;
              mModalAlert.showWarning("Es obligatorio contratar el Convenio I para continuar", "");
            }
          }
          $scope.sumaTotalContenidoC2();
          $scope.sumTotalDeclaredc02();
        });
      }

      //convenio 2 - declarado
      $scope.sumTotalDeclaredc02 = function(input) {

        ($scope.data.mValorCajChica == "")
        ? $scope.data.c02.declarado.mChica = 0
        : $scope.data.c02.declarado.mChica = parseFloat($scope.data.mValorCajChica);

        ($scope.data.mValorCajFuert == "")
        ? $scope.data.c02.declarado.mFuerte = 0
        : $scope.data.c02.declarado.mFuerte = parseFloat($scope.data.mValorCajFuert);

        ($scope.data.mValorTransBancos == "")
        ? $scope.data.c02.declarado.mTransito = 0
        : $scope.data.c02.declarado.mTransito = parseFloat($scope.data.mValorTransBancos);

        ($scope.data.mValorTotaPoderCobra == "")
        ? $scope.data.c02.declarado.mPoder = 0
        : $scope.data.c02.declarado.mPoder = parseFloat($scope.data.mValorTotaPoderCobra);

        var total = 0;
        total =
        $scope.data.c02.contenido.mFijas +
        $scope.data.c02.contenido.mMaquinaria +
        $scope.data.c02.contenido.mMobiliario +
        $scope.data.c02.contenido.mExistencias +
        $scope.data.c02.declarado.mChica + //Límite en Caja Chica
        $scope.data.c02.declarado.mFuerte + //Límite en Caja Fuerte
        $scope.data.c02.declarado.mTransito + //Límite en tránsito a bancos
        $scope.data.c02.declarado.mPoder; //Límite en poder de cobradores

        if(total == 0){
          $scope.data[input] = "";
          $scope.data.c02.contenido.mFijas = 0;
          $scope.data.c02.contenido.mMaquinaria = 0;
          $scope.data.c02.contenido.mMobiliario = 0;
          $scope.data.c02.contenido.mExistencias = 0;
          $scope.data.c02.declarado.mChica = 0;
          $scope.data.c02.declarado.mFuerte = 0;
          $scope.data.c02.declarado.mTransito = 0;
          $scope.data.c02.declarado.mPoder = 0;
          $scope.data.c02.declarado.totalDinero = 0;
          $scope.data.c02.declarado.total = 0;
        }else{
          if(total > $scope.params.maxAmountC02){
            $scope.data.c02.declarado.total = 0;
          }else
            $scope.data.c02.declarado.total = total;
        }
      }

      function evaluaSumaTotalDeclarado(){
        ($scope.data.mValorCajChica == "")
        ? $scope.data.c02.declarado.mChica = 0
        : $scope.data.c02.declarado.mChica = parseFloat($scope.data.mValorCajChica);

        ($scope.data.mValorCajFuert == "")
        ? $scope.data.c02.declarado.mFuerte = 0
        : $scope.data.c02.declarado.mFuerte = parseFloat($scope.data.mValorCajFuert);

        ($scope.data.mValorTransBancos == "")
        ? $scope.data.c02.declarado.mTransito = 0
        : $scope.data.c02.declarado.mTransito = parseFloat($scope.data.mValorTransBancos);

        ($scope.data.mValorTotaPoderCobra == "")
        ? $scope.data.c02.declarado.mPoder = 0
        : $scope.data.c02.declarado.mPoder = parseFloat($scope.data.mValorTotaPoderCobra);

        var total =
          $scope.data.c02.declarado.mChica + //Límite en Caja Chica
          $scope.data.c02.declarado.mFuerte + //Límite en Caja Fuerte
          $scope.data.c02.declarado.mTransito + //Límite en tránsito a bancos
          $scope.data.c02.declarado.mPoder; //Límite en poder de cobradores

        return (total <= $scope.params.maxAmountC02);
      }
      $scope.sumaTotalDineroC2 = function() {
        $scope.alertaVBDinero = false;
        ($scope.data.mValorCajChica == "")
        ? $scope.data.c02.declarado.mChica = 0
        : $scope.data.c02.declarado.mChica = parseFloat($scope.data.mValorCajChica);

        ($scope.data.mValorCajFuert == "")
        ? $scope.data.c02.declarado.mFuerte = 0
        : $scope.data.c02.declarado.mFuerte = parseFloat($scope.data.mValorCajFuert);

        ($scope.data.mValorTransBancos == "")
        ? $scope.data.c02.declarado.mTransito = 0
        : $scope.data.c02.declarado.mTransito = parseFloat($scope.data.mValorTransBancos);

        ($scope.data.mValorTotaPoderCobra == "")
        ? $scope.data.c02.declarado.mPoder = 0
        : $scope.data.c02.declarado.mPoder = parseFloat($scope.data.mValorTotaPoderCobra);

        var total = 0;

        total =
        $scope.data.c02.declarado.mChica +
        $scope.data.c02.declarado.mFuerte +
        $scope.data.c02.declarado.mTransito +
        $scope.data.c02.declarado.mPoder;

        if(total == 0){
          $scope.data.c02.declarado.mChica = 0;
          $scope.data.c02.declarado.mFuerte = 0;
          $scope.data.c02.declarado.mTransito = 0;
          $scope.data.c02.declarado.mPoder = 0;
          $scope.data.c02.declarado.totalDinero = 0;
        }else{
          $scope.data.c02.declarado.totalDinero = total;
        }
        if(validaContenidoTotal(total)){ //l ocompara con contenido de C1
          $scope.sumTotalc02();
        }

        if(total > 0){
          if(total > $scope.params.maxDeclared){
            if(total > parseFloat($scope.data.c02.contenido.total*0.10)){
              $scope.errorVBContenido = true
            }else $scope.errorVBContenido = true
          }else{
            if(total > parseFloat($scope.data.c02.contenido.total*0.10)){
              $scope.errorVBContenido = true
            } else $scope.errorVBContenido = false
          }
        }else $scope.errorVBContenido = false
      }

      if($ctrl.isValidStep1){
        $scope.$watch('data.mValorCajChica', function(){
          if($ctrl.product.CodigoProducto != 57) {
            return;
          }
          if ($scope.data.mValorCajChica == 0 || angular.isUndefined($scope.data.mValorCajChica)){
            $scope.data.mValorCajChica = "";
            $scope.data.c02.declarado.mChica = 0;
          }else{
            if(evaluaConvenio1()){
                if(evaluaSumaTotalDeclarado()){
                    $scope.data.c02.declarado.mChica = parseFloat($scope.data.mValorCajChica);
                }
            }else{
              $scope.data.mValorCajChica = 0;
              $scope.data.c02.declarado.mChica = 0;
              mModalAlert.showWarning("Es obligatorio contratar el Convenio I para continuar", "");
            }
          }
          $scope.sumTotalDeclaredc02('mChica');
          $scope.sumaTotalDineroC2();
        });

        $scope.$watch('data.mValorCajFuert', function(){
          if($ctrl.product.CodigoProducto != 57) {
            return;
          }
          if ($scope.data.mValorCajFuert == 0 || angular.isUndefined($scope.data.mValorCajFuert)){
            $scope.data.mValorCajFuert = "";
            $scope.data.c02.declarado.mFuerte = 0;
          }else{
            if(evaluaConvenio1()){
                if(evaluaSumaTotalDeclarado()){
                  $scope.data.c02.declarado.mFuerte = parseFloat($scope.data.mValorCajFuert);
                }else{
                  $scope.data.mValorCajFuert = 0;
                  $scope.data.c02.declarado.mFuerte = 0;
                  mModalAlert.showWarning("El Valor Total Declarado Convenio II no puede exceder "+$scope.params.currencyText +" "+ $scope.params.maxAmountC02Text, "");
                }
            }else{
              $scope.data.mValorCajFuert = 0;
              $scope.data.c02.declarado.mFuerte = 0;
              mModalAlert.showWarning("Es obligatorio contratar el Convenio I para continuar", "");
            }
          }
          $scope.sumTotalDeclaredc02('mFuerte');
          $scope.sumaTotalDineroC2();
        });

        $scope.$watch('data.mValorTransBancos', function(){
          if($ctrl.product.CodigoProducto != 57) {
            return;
          }
          if($scope.data.mValorTransBancos == 0 || angular.isUndefined($scope.data.mValorTransBancos)){
            $scope.data.mValorTransBancos = "";
            $scope.errorMaxDeclaredTransito = false;
            removeError('c02', 'errorMaxDeclaredTransito');
            $scope.data.c02.declarado.mTransito = 0;
          }else{
            if(evaluaConvenio1()){
                if(evaluaSumaTotalDeclarado()){
                  $scope.data.c02.declarado.mTransito = parseFloat($scope.data.mValorTransBancos)
                }else{
                  $scope.data.mValorTransBancos = 0;
                  $scope.data.c02.declarado.mTransito = 0;
                  mModalAlert.showWarning("El Valor Total Declarado Convenio II no puede exceder "+$scope.params.currencyText +" "+ $scope.params.maxAmountC02Text, "");
                }
            }else{
              $scope.data.mValorTransBancos = 0;
              $scope.data.c02.declarado.mTransito = 0;
              mModalAlert.showWarning("Es obligatorio contratar el Convenio I para continuar", "");
            }
          }
          $scope.sumTotalDeclaredc02('mTransito');
          $scope.sumaTotalDineroC2();
        });

        $scope.$watch('data.mValorTotaPoderCobra', function(){
          if($ctrl.product.CodigoProducto != 57) {
            return;
          }
          if($scope.data.mValorTotaPoderCobra == 0 || angular.isUndefined($scope.data.mValorTotaPoderCobra)){
            $scope.data.mValorTotaPoderCobra = "";
            $scope.errorCobradores = false;
            removeError('c02', 'errorCobradores');
            $scope.data.c02.declarado.mCobradores = 0;
            if($scope.data.mValorTotalCobra){
              $scope.errorValorTotaPoder = true;
              addError('c02', 'errorValorTotaPoder');
              $scope.data.c02.error = true;
            }else{
              $scope.data.c02.declarado.mCobradores = 0;
              $scope.errorValorTotaPoder = false;
              removeError('c02', 'errorValorTotaPoder');
              $scope.data.c02.error = false;

            }
          }else{
            if(evaluaConvenio1()){
                if(evaluaSumaTotalDeclarado()){
                  if($scope.data.mValorTotalCobra){
                    $scope.errorValorTotaPoder = false;
                    removeError('c02', 'errorValorTotaPoder');
                    $scope.data.c02.declarado.mPoder = $scope.data.mValorTotaPoderCobra;
                    $scope.errorCobradores = false;
                    removeError('c02', 'errorCobradores');
                    $scope.data.c02.declarado.mCobradores = parseInt($scope.data.mValorTotalCobra);
                    $scope.data.c02.error = false;
                  }else{
                    $scope.errorCobradores = true;
                    addError('c02', 'errorCobradores');
                    $scope.data.c02.error = true;
                  }
                }else{
                  $scope.data.mValorTotaPoderCobra = 0;
                  $scope.data.c02.declarado.mPoder = 0;
                  mModalAlert.showWarning("El Valor Total Declarado Convenio II no puede exceder "+$scope.params.currencyText +" "+ $scope.params.maxAmountC02Text, "");
                }
            }else{
              $scope.data.mValorTotaPoderCobra = 0;
              $scope.data.c02.declarado.mPoder = 0;
              mModalAlert.showWarning("Es obligatorio contratar el Convenio I para continuar", "");
            }
          }
          $scope.sumTotalDeclaredc02('mPoder');
          $scope.sumaTotalDineroC2();
        });

        var mValorTotalCobraEventInit = false;
        $scope.$watch('data.mValorTotalCobra', function(){
          if(!mValorTotalCobraEventInit) {
            mValorTotalCobraEventInit = true;
            return;
          }
          if($scope.data.mValorTotalCobra == 0 || angular.isUndefined($scope.data.mValorTotalCobra)){
            $scope.data.mValorTotalCobra = "";
            $scope.errorCobradores = false;
            removeError('c02', 'errorCobradores');
            $scope.data.c02.declarado.mCobradores = 0;
            if($scope.data.mValorTotaPoderCobra){
              $scope.errorCobradores = true;
              addError('c02', 'errorCobradores');
              $scope.data.c02.error = true;
            }else{
              $scope.data.c02.declarado.mCobradores = 0;
              $scope.errorCobradores = false;
              removeError('c02', 'errorCobradores');
              $scope.errorValorTotaPoder = false;
              removeError('c02', 'errorValorTotaPoder');
              $scope.data.c02.error = false;
            }
          }else{
            if($scope.data.mValorTotaPoderCobra){
              if(parseFloat($scope.data.mValorTotaPoderCobra) <= $scope.params.maxDeclared){
                $scope.data.c02.declarado.mPoder = $scope.data.mValorTotaPoderCobra;
                $scope.data.c02.declarado.mCobradores = parseInt($scope.data.mValorTotalCobra);
                $scope.errorCobradores = false;
                removeError('c02', 'errorCobradores');
                $scope.errorValorTotaPoder = false;
                removeError('c02', 'errorValorTotaPoder');
                $scope.data.c02.error = false;
              }
            }else{
              $scope.errorValorTotaPoder = true;
              addError('c02', 'errorValorTotaPoder');
              $scope.data.c02.error = true;
              $scope.data.c02.declarado.mCobradores = parseInt($scope.data.mValorTotalCobra);
              $scope.errorCobradores = false;
              removeError('c02', 'errorCobradores');
            }
          }
        });
      }

      //convenio 3

      if($ctrl.isValidStep1){
        $scope.$watch('data.mValorSumAsegResp', function(){
          if($scope.data.mValorSumAsegResp == 0 || angular.isUndefined($scope.data.mValorSumAsegResp)){
            $scope.data.mValorSumAsegResp = "";
            $scope.data.c03.MCAContratado = ($ctrl.product.CodigoProducto === 130) ? "S" : "N";
            $scope.errorMaxAmountC03 = false;
            $scope.data.c03.mCivil = 0;
            removeError('c03', 'errorMaxAmountC03');
            $scope.errorMaxConvention01 = false;
            removeError('c03', 'errorMaxConvention01');
            $scope.data.c03.error = false;
          }else{
            if(evaluaConvenio1()){
              if($scope.data.c01.total < $scope.data.mValorSumAsegResp){
                $scope.errorMaxConvention01 = true;
                addError('c03', 'errorMaxConvention01');
                $scope.data.c03.error = true;
              }else{
                $scope.errorMaxConvention01 = false;
                removeError('c03', 'errorMaxConvention01');
                $scope.data.c03.error = false;
                if(evaluaSumaTotalConvenios()){
                  if(parseFloat($scope.data.mValorSumAsegResp) <= $scope.params.maxAmountC03){
                    $scope.data.c03.mCivil = parseFloat($scope.data.mValorSumAsegResp);
                    $scope.data.c03.MCAContratado = "S";
                    $scope.errorMaxAmountC03 = false;
                    removeError('c03', 'errorMaxAmountC03');
                    $scope.data.c03.error = false;
                  }else{
                    $scope.errorMaxAmountC03 = true;
                    addError('c03', 'errorMaxAmountC03');
                    $scope.data.c03.error = true;
                  }
                }else{
                  $scope.errorMaxAmountC03 = false;
                  removeError('c03', 'errorMaxAmountC03');
                  $scope.data.c03.mCivil = 0;
                  $scope.data.mValorSumAsegResp = 0;
                  mModalAlert.showWarning("La suma total de convenios supera el máximo permitido "+$scope.params.currencyText +" "+ $scope.params.maxAmountText, "");
                }
              }
            }else{
              $scope.data.c03.mCivil = 0;
              $scope.data.mValorSumAsegResp = 0;
              mModalAlert.showWarning("Es obligatorio contratar el Convenio I para continuar", "");
            }
          }
        });
      }

      //convenio 4
      if($ctrl.isValidStep1){
        $scope.$watch('data.mValorSumAsegRot', function(){
        if($scope.data.mValorSumAsegRot == 0 || angular.isUndefined($scope.data.mValorSumAsegRot)){
          $scope.data.c04.mRotura = 0;
          $scope.data.mValorSumAsegRot = "";
          $scope.data.c04.MCAContratado = ($ctrl.product.CodigoProducto === 130) ? "S" : "N";
          $scope.data.c04.error = false;
          $scope.errorMaxAmountC04 = false;
          removeError('c04', 'errorMaxAmountC04');
          $scope.errorConvenio1Maq = false;
          removeError('c04', 'errorConvenio1Maq');
        }else{
          if(evaluaConvenio1()){
            if($scope.data.mMaquinaria > 0){
                if(parseFloat($scope.data.mValorSumAsegRot) > parseFloat($scope.data.mMaquinaria)){
                  $scope.errorConvenio1Maq = true;
                  addError('c04', 'errorConvenio1Maq');
                  $scope.errorMaxAmountC04 = false;
                  removeError('c04', 'errorMaxAmountC04');
                  $scope.data.c04.error = true;
                }else{
                  if(parseFloat($scope.data.mValorSumAsegRot) > $scope.params.maxAmountC04){
                    $scope.errorMaxAmountC04 = true;
                    addError('c04', 'errorMaxAmountC04');
                    $scope.errorConvenio1Maq = false;
                    removeError('c04', 'errorConvenio1Maq');
                    $scope.data.c04.error = true;
                  }else{
                    $scope.errorConvenio1Maq = false;
                    $scope.errorMaxAmountC04 = false;
                    removeError('c04', 'errorConvenio1Maq');
                    removeError('c04', 'errorMaxAmountC04');
                    $scope.data.c04.MCAContratado = "S";
                    $scope.data.c04.error = false;
                    $scope.data.c04.mRotura = parseFloat($scope.data.mValorSumAsegRot);
                  }
                }
            }else{
              $scope.errorConvenio1Maq = true;
              addError('c04', 'errorConvenio1Maq');
              $scope.errorMaxAmountC04 = false;
              removeError('c04', 'errorMaxAmountC04');
            }
          }else{
            $scope.errorConvenio1Maq = false;
            removeError('c04', 'errorConvenio1Maq');
            $scope.errorMaxAmountC04 = false;
            removeError('c04', 'errorMaxAmountC04');
            $scope.data.c04.mRotura = 0;
            $scope.data.mValorSumAsegRot = 0;
            mModalAlert.showWarning("Es obligatorio contratar el Convenio I para continuar", "");
          }
        }
        });
      }

      //convenio 5
      if($ctrl.isValidStep1){
        $scope.$watch('data.mValorLimUnic', function(){
        if($scope.data.mValorLimUnic == 0 || angular.isUndefined($scope.data.mValorLimUnic)){
          $scope.data.c05.mLimite = 0;
          $scope.data.mValorLimUnic = "";
          $scope.errorMaxLimite = false;
          $scope.errorMaxAmountC05 = false;
          $scope.data.c05.MCAContratado = "N";
          $scope.data.c05.error = false;
          removeError('c05', 'errorMaxAmountC05');
          removeError('c05', 'errorMaxLimite');
        }else{
          if(evaluaConvenio1()){
            if($scope.data.mMaquinaria){
                if(parseFloat($scope.data.mValorLimUnic) > parseFloat($scope.data.mMaquinaria)){
                  $scope.errorMaxLimite = true;
                  addError('c05', 'errorMaxLimite');
                  removeError('c05', 'errorMaxAmountC05');
                  $scope.data.c05.error = true;
                }else{
                  if(parseFloat($scope.data.mValorLimUnic) > $scope.params.maxAmountC05){
                    $scope.errorMaxAmountC05 = true;
                    $scope.errorMaxLimite = false;
                    addError('c05', 'errorMaxAmountC05');
                    removeError('c05', 'errorMaxLimite');
                    $scope.data.c05.error = true;
                  }else{
                    $scope.data.c05.mLimite = parseFloat($scope.data.mValorLimUnic);
                    $scope.errorMaxAmountC05 = false;
                    $scope.errorMaxLimite = false;
                    $scope.data.c05.MCAContratado = "S";
                    removeError('c05', 'errorMaxAmountC05');
                    removeError('c05', 'errorMaxLimite');
                    $scope.data.c05.error = false;
                    validateMaxEquipo();
                  }
                }
            }else{
              $scope.errorMaxAmountC05 = false;
              removeError('c05', 'errorMaxAmountC05');

              $scope.errorMaxLimite = true;
              addError('c05', 'errorMaxLimite');
              $scope.data.c05.error = true;
              $scope.data.c05.mLimite= 0;
            }
          }else{
            $scope.errorMaxLimite = false;
            $scope.errorMaxAmountC05 = false;
            $scope.data.c05.mLimite= 0;
            $scope.data.c05.error = false;
            $scope.data.mValorLimUnic = 0;
            $scope.data.c05.total = 0;
            removeError('c05', 'errorMaxAmountC05');
            removeError('c05', 'errorMaxLimite');
            mModalAlert.showWarning("Es obligatorio contratar el Convenio I para continuar", "");
          }
        }
        });

        function validateMaxEquipo() {
          if(parseFloat($scope.data.mValorLimUnic) < parseFloat($scope.data.mValorAsegEquipMov)){
            $scope.errorMovilLimite = true;
            $scope.errorMovil = false;
            removeError('c05', 'errorMovil');
            addError('c05', 'errorMovilLimite');
            $scope.data.c05.error = true;
          }else{
            $scope.errorMovilLimite = false;
            $scope.errorMovil = false;
            removeError('c05', 'errorMovil');
            removeError('c05', 'errorMovilLimite');
            $scope.data.c05.error = false;
          }
        }

        var mValorAsegEquipMovEventInit = false;
        $scope.$watch('data.mValorAsegEquipMov', function(){
          if (!mValorAsegEquipMovEventInit) {
            mValorAsegEquipMovEventInit = true;
            return;
          }
          $scope.errorMovilLimite = false;
          $scope.errorMovil = false;
          removeError('c05', 'errorMovil');
          removeError('c05', 'errorMovilLimite');
          if($scope.data.mValorAsegEquipMov == 0 || angular.isUndefined($scope.data.mValorAsegEquipMov)){
            $scope.data.c05.mMovil = 0;
            $scope.data.mValorAsegEquipMov = "";
            $scope.data.c05.error = false;
          }
          if(evaluaConvenio1()){
            if($scope.data.mValorLimUnic > 0){
              validateMaxEquipo();
                if(parseFloat($scope.data.mValorAsegEquipMov) >=  parseFloat($scope.params.maxMovil)) {
                  $scope.warnMaxMovilRiesgo = true;
                } else {
                  $scope.warnMaxMovilRiesgo = false;
                }
                if(parseFloat($scope.data.mValorAsegEquipMov) >  parseFloat($scope.params.maxMovil)) {//$scope.data.mValorLimUnic){
                  $scope.errorMovilLimite = true;
                  $scope.errorMovil = false;
                  removeError('c05', 'errorMovil');
                  addError('c05', 'errorMovilLimite');
                  $scope.data.c05.mMovil = 0;
                  $scope.data.c05.error = true;
                }else{
                  if(parseFloat($scope.data.mValorAsegEquipMov) >  parseFloat($scope.params.maxMovil)) {//$scope.params.maxMovil){
                    $scope.errorMaxMovil = true;
                    $scope.errorMovil = false;
                    $scope.errorMovilLimite = false;
                    addError('c05', 'errorMaxMovil');
                    removeError('c05', 'errorMovil');
                    removeError('c05', 'errorMovilLimite');
                    $scope.data.c05.mMovil = 0;
                    $scope.data.c05.error = true;
                  }else{
                    $scope.data.c05.mMovil = parseFloat($scope.data.mValorAsegEquipMov);
                    $scope.errorMovil = false;
                    $scope.errorMovilLimite = false;
                    $scope.errorMaxMovil = false;
                    removeError('c05', 'errorMovil');
                    removeError('c05', 'errorMovilLimite');
                    removeError('c05', 'errorMaxMovil');
                    $scope.data.c05.error = false;
                  }
                }
            }else{
              $scope.errorMovil = true;
              addError('c05', 'errorMovil');
              $scope.errorMovilLimite = false;
              removeError('c05', 'errorMovilLimite');
              if($scope.data.mValorAsegEquipMov == 0 || angular.isUndefined($scope.data.mValorAsegEquipMov)){
                $scope.errorMovil = false;
                removeError('c05', 'errorMovil');
              }
              $scope.data.c05.error = true;
            }
          }else{
            $scope.data.c05.mMovil = 0;
            $scope.errorMovil = false;
            $scope.errorMovilLimite = false;
            $scope.data.mValorAsegEquipMov = undefined;
            $scope.data.c05.total = 0;
            removeError('c05', 'errorMovil');
            removeError('c05', 'errorMovilLimite');
            mModalAlert.showWarning("Es obligatorio contratar el Convenio I para continuar", "");
            $scope.data.c05.error = false;
          }
        });
      }

      //convenio 6
      //data.mValorTotAseg
      //data.mValorSumAsegAcc
      if($ctrl.isValidStep1){
        $scope.$watch('data.mValorSumAsegAcc', function(){
          if($scope.data.mValorSumAsegAcc == 0 || angular.isUndefined($scope.data.mValorSumAsegAcc)){
            $scope.data.c06.mAsegurados = 0;
            $scope.data.mValorSumAsegAcc = "";
            $scope.data.c06.total = 0;
            $scope.data.c06.MCAContratado = "N";
            $scope.errorMaxAmountC06 = false;
            $scope.data.c06.error = false;
            removeError('c06', 'errorMaxAmountC06');
            if($scope.data.mValorTotAseg == 0 || angular.isUndefined($scope.data.mValorTotAseg)){
              $scope.errorTotalAseg = false;
              removeError('c06', 'errorTotalAseg');
              $scope.errorSumaAseg = false;
              removeError('c06', 'errorSumaAseg');
            }else{
              $scope.errorSumaAseg = true;
              addError('c06', 'errorSumaAseg');
              $scope.data.c06.error = true;
            }
          }else{
            if(evaluaConvenio1()){
                if(parseFloat($scope.data.mValorSumAsegAcc) > $scope.params.maxAmountC06){
                  $scope.errorMaxAmountC06 = true;
                  addError('c06', 'errorMaxAmountC06');
                  $scope.data.c06.error = true;
                  $scope.data.c06.total = 0;
                  removeError('c06', 'errorSumaAseg');
                  $scope.errorSumaAseg = false;
                }else{
                  $scope.data.c06.total = parseFloat($scope.data.mValorSumAsegAcc);
                  $scope.errorMaxAmountC06 = false;
                  removeError('c06', 'errorMaxAmountC06');
                  $scope.data.c06.MCAContratado = "S";
                  if(!$scope.data.mValorTotAseg){
                    $scope.errorTotalAseg = true;
                    addError('c06', 'errorTotalAseg');
                    $scope.data.c06.error = true;
                  }else{
                    if($scope.data.mValorTotAseg <= 10){
                      $scope.errorMaxAseg = false;
                      removeError('c06', 'errorMaxAseg');
                      $scope.data.c06.error = false;
                    }else{
                      $scope.errorMaxAseg = true;
                      addError('c06', 'errorMaxAseg');
                      $scope.data.c06.error = true;
                    }
                  }
                  $scope.errorSumaAseg = false;
                  removeError('c06', 'errorSumaAseg');
                  $scope.data.c06.error = false;
                }
            }else{
              $scope.data.c06.mAsegurados = 0;
              $scope.data.mValorSumAsegAcc = 0;
              $scope.data.c06.total = 0;
              mModalAlert.showWarning("Es obligatorio contratar el Convenio I para continuar", "");
            }
          }
        });

        var mValorTotAsegEventInit = false;
        $scope.$watch('data.mValorTotAseg', function(){
          if (!mValorTotAsegEventInit) {
            mValorTotAsegEventInit = true;
            return;
          }
          if($scope.data.mValorTotAseg == 0 || angular.isUndefined($scope.data.mValorTotAseg)){
            $scope.data.c06.mAsegurados = 0;
            $scope.data.mValorTotAseg = "";
            $scope.data.c06.error = false;
            if($scope.data.mValorSumAsegAcc == 0 || angular.isUndefined($scope.data.mValorSumAsegAcc)){
              $scope.errorSumaAseg = false;
              removeError('c06', 'errorSumaAseg');
              $scope.errorMaxAseg = false;
              removeError('c06', 'errorMaxAseg');
            }else{
              $scope.errorMaxAseg = false;
              removeError('c06', 'errorMaxAseg');
              $scope.errorTotalAseg = true;
              addError('c06', 'errorTotalAseg');
              $scope.errorSumaAseg = false;
              removeError('c06', 'errorSumaAseg');
              $scope.errorMaxAseg = false;
            }
            $scope.data.c06.mAsegurados =  parseFloat($scope.data.mValorTotAseg);
            $scope.data.c06.error = false;
            removeError('c06', 'errorTotalAseg');
            if($scope.data.mValorTotAseg > 10){
              addError('c06', 'errorMaxAseg');
              $scope.errorMaxAseg = true;
              $scope.data.c06.error = true;
              if($scope.data.mValorSumAsegAcc){
                removeError('c06', 'errorTotalAseg');
                $scope.errorTotalAseg = false;
              }else{
                $scope.errorSumaAseg = true;
                addError('c06', 'errorSumaAseg');
              }
            }else{
              removeError('c06', 'errorMaxAseg');
              $scope.errorMaxAseg = false;
              $scope.data.c06.error = false;
              if($scope.data.mValorSumAsegAcc){
                $scope.errorSumaAseg = false;
                removeError('c06', 'errorSumaAseg');
              }else{
                $scope.errorSumaAseg = true;
                addError('c06', 'errorSumaAseg');
                $scope.data.c06.error = true;
              }
            }
          }
        });
      }

      //convenio 7
      if($ctrl.isValidStep1){
        $scope.errorMaxEmpleados = false;
        $scope.errorVBEmpleados = false;
        $scope.$watch('data.mValorNroEmple', function(){
          if($scope.data.mValorNroEmple == 0 || angular.isUndefined($scope.data.mValorNroEmple)){
            $scope.data.c07.mEmpleados = 0;
            $scope.data.mValorNroEmple = "";
            $scope.errorVBEmpleados = false;
            removeError('c07', 'errorMaxEmpleados');
            if($scope.data.mValorSumAseg){
              removeError('c07', 'errorSumaAseg7');
              $scope.errorSumaAseg7 = false;
              addError('c07', 'errorNroEmp')
              $scope.errorNroEmp = true;
              $scope.data.c07.error = true;
            }else{
              removeError('c07', 'errorSumaAseg7');
              $scope.errorSumaAseg7 = false;
              removeError('c07', 'errorNroEmp');
              $scope.errorNroEmp = false;
              $scope.data.c07.error = false;
            }
          }else{
            $scope.data.c07.mEmpleados = parseInt($scope.data.mValorNroEmple);
            $scope.errorNroEmp = false;
            removeError('c07', 'errorNroEmp');
            $scope.data.c07.error = false;
            if($scope.data.mValorNroEmple <= 0 && !angular.isUndefined($scope.data.mValorNroEmple)){
              addError('c07', 'errorMaxEmpleados');
              $scope.errorMaxEmpleados = true;
              $scope.data.c07.error = true;
            }else{
              $scope.errorVBEmpleados = $scope.data.mValorNroEmple && $scope.data.mValorNroEmple < 10 ? true : false;
              removeError('c07', 'errorMaxEmpleados');
              $scope.errorMaxEmpleados = false;
              $scope.data.c07.error = false;
              if($scope.data.mValorSumAseg == 0 || angular.isUndefined($scope.data.mValorSumAseg)){
                $scope.errorSumaAseg7 = true;
                addError('c07', 'errorSumaAseg7');
                $scope.data.c07.error = true;
              }else{
                $scope.errorSumaAseg7 = false;
                removeError('c07', 'errorSumaAseg7');
                $scope.data.c07.error = false;
              }
            }
          }
        });

        $scope.$watch('data.mValorSumAseg', function(){
          if($scope.data.mValorSumAseg == 0 || angular.isUndefined($scope.data.mValorSumAseg)){
            $scope.data.c07.total = 0;
            $scope.data.mValorSumAseg = "";
            $scope.data.c07.MCAContratado = "N";
            $scope.errorMaxAmountC07 = false;
            removeError('c07', 'errorMaxAmountC07');
            $scope.data.c07.error = false;
            $scope.errorVBEmpleados = $scope.data.mValorNroEmple && $scope.data.mValorNroEmple < 10 ? true : false;
            if($scope.data.mValorNroEmple){
              $scope.errorSumaAseg7 = true;
              addError('c07', 'errorSumaAseg7');
              $scope.errorNroEmp = false;
              removeError('c07', 'errorNroEmp');
              $scope.data.c07.error = true;
            }else{
              $scope.errorNroEmp = false;
              removeError('c07', 'errorNroEmp');
              $scope.errorSumaAseg7 = false;
              removeError('c07', 'errorSumaAseg7');
              $scope.errorMaxAmountC07 = false;
              removeError('c07', 'errorMaxAmountC07');
              $scope.data.c07.error = false;
            }
          }else{
            if(evaluaConvenio1()){
                if($scope.data.c01.total < $scope.params.maxAmountC07){
                  if(parseFloat($scope.data.mValorSumAseg) > $scope.data.c01.total){
                    $scope.errorVBSumAseg = false;
                    $scope.errorMaxAmountC07 = true;
                    addError('c07', 'errorMaxAmountC07');
                    $scope.data.c07.total = 0;
                    $scope.data.c07.error = true;
                  }else{
                    $scope.errorMaxAmountC07 = false;
                    removeError('c07', 'errorMaxAmountC07');
                    $scope.errorSumaAseg7 = false;
                    removeError('c07', 'errorSumaAseg7');
                    $scope.data.c07.total = parseFloat($scope.data.mValorSumAseg);
                    $scope.data.c07.error = false;
                    if($scope.data.mValorNroEmple){
                      $scope.errorNroEmp = false;
                      removeError('c07', 'errorNroEmp');
                      $scope.data.c07.error = false;
                    }else{
                      $scope.errorNroEmp = true;
                      addError('c07', 'errorNroEmp');
                      $scope.data.c07.error = true;
                    }
                  }
                }else{
                  $scope.data.c07.total = parseFloat($scope.data.mValorSumAseg);
                  $scope.errorMaxAmountC07 = false;
                  removeError('c07', 'errorMaxAmountC07');
                  $scope.data.c07.error = false;
                  $scope.data.c07.MCAContratado = "S";
                  if($scope.data.mValorNroEmple == "" || $scope.data.mValorNroEmple == 0){
                    $scope.errorNroEmp = true;
                    addError('c07', 'errorNroEmp');
                    $scope.data.c07.error = true;
                  }else{
                    $scope.errorNroEmp = false;
                    removeError('c07', 'errorNroEmp');
                    $scope.errorSumaAseg7 = false;
                    removeError('c07', 'errorSumaAseg7');
                    $scope.data.c07.error = false;
                  }
                }
            }else{
              $scope.data.c07.mEmpleados = 0;
              $scope.data.c07.total = 0;
              mModalAlert.showWarning("Es obligatorio contratar el Convenio I para continuar", "");
              $scope.data.mValorNroEmple = 0;
              $scope.data.mValorSumAseg = 0;
            }
          }

          if($ctrl.product.CodigoProducto == 57){ //empresas
            if($scope.data.c01.total < $scope.params.maxAmountC07){
              $scope.errorVBSumAseg = $scope.data.mValorSumAseg < $scope.data.c01.total
            }
          }

        });
      }

      //convenio 8
      //data.mValorSumAsegTrec

      if($ctrl.isValidStep1){
        $scope.$watch('data.mValorSumAsegTrec', function(){
        if($scope.data.mValorSumAsegTrec == 0 || angular.isUndefined($scope.data.mValorSumAsegTrec)){
          $scope.data.c08.mTrec = 0;
          $scope.data.mValorSumAsegTrec = "";
          $scope.data.c08.MCAContratado = "N";
          $scope.errorMaxAmountC08 = false;
          removeError('c08', 'errorMaxAmountC08')
        }else{
          if(evaluaConvenio1()){
              if($scope.data.c01.total < $scope.params.maxAmountC08){
                if(parseFloat($scope.data.mValorSumAsegTrec) > $scope.data.c01.total){
                  $scope.errorVBTrec = false;
                  $scope.errorMaxAmountC08 = true;
                  addError('c08', 'errorMaxAmountC08');
                  $scope.data.c08.mTrec = 0;
                  $scope.data.c08.error = true;
                }else{
                  $scope.errorMaxAmountC08 = false;
                  removeError('c08', 'errorMaxAmountC08');
                  $scope.data.c08.mTrec = parseFloat($scope.data.mValorSumAsegTrec);
                  $scope.data.c08.error = false;
                }
              }else{
                $scope.data.c08.mTrec = parseFloat($scope.data.mValorSumAsegTrec);
                $scope.data.c08.MCAContratado = "S";
                $scope.errorMaxAmountC08 = false;
                removeError('c08', 'errorMaxAmountC08');
                $scope.data.c08.error = false;
              }
          }else{
            $scope.data.c08.mTrec = 0;
            $scope.data.mValorSumAsegTrec = 0;
            mModalAlert.showWarning("Es obligatorio contratar el Convenio I para continuar", "");
          }
        }

        if($ctrl.product.CodigoProducto == 57){ //empresas
          $scope.errorMValorSumAsegTrec = false;
          if($scope.data.c01.total < $scope.params.maxAmountC08) {
            $scope.errorVBTrec = $scope.data.mValorSumAsegTrec < $scope.data.c01.total
          }
        }
        });
      }

      //convenio 9
      //data.mValorSumAsegCar
      if($ctrl.isValidStep1){
        $scope.$watch('data.mValorSumAsegCar', function(){
          if($scope.data.mValorSumAsegCar == 0 || angular.isUndefined($scope.data.mValorSumAsegCar)){
            $scope.data.c09.mCar = 0;
            $scope.data.mValorSumAsegCar = "";
            $scope.data.c09.MCAContratado = "N";
            $scope.errorMaxAmountC09 = false;
            removeError('c09', 'errorMaxAmountC09')
            $scope.data.c09.error = false;
          }else{
            if(evaluaConvenio1()){
                if($scope.data.c01.total < $scope.params.maxAmountC09){
                  if(parseFloat($scope.data.mValorSumAsegCar) > $scope.data.c01.total){
                    $scope.errorVBCar = false;
                    $scope.errorMaxAmountC09 = true;
                    addError('c09', 'errorMaxAmountC09');
                    $scope.data.c09.mCar = 0;
                    $scope.data.c09.error = true;
                  }else{
                    $scope.errorMaxAmountC09 = false;
                    removeError('c09', 'errorMaxAmountC09');
                    $scope.data.c09.mCar = parseFloat($scope.data.mValorSumAsegCar);
                    $scope.data.c09.error = false;
                  }
                }else{
                  $scope.data.c09.mCar = parseFloat($scope.data.mValorSumAsegCar);
                  $scope.data.c09.MCAContratado = "S";
                  $scope.errorMaxAmountC09 = false;
                  removeError('c09', 'errorMaxAmountC09');
                  $scope.data.c09.error = false;
                }
            }else{
              $scope.data.c09.mCar = 0;
              $scope.data.mValorSumAsegCar = 0;
              mModalAlert.showWarning("Es obligatorio contratar el Convenio I para continuar", "");
            }
          }

          if($ctrl.product.CodigoProducto == 57){ //empresas
            $scope.errorMValorSumAsegCar = false;
            if($scope.data.c01.total < $scope.params.maxAmountC09) {
              $scope.errorVBCar = $scope.data.mValorSumAsegCar < $scope.data.c01.total
            }
          }
        });
      }
      //convenio 10
      //data.mValorSumAsegCar

      if($ctrl.isValidStep1){
        $scope.$watch('data.mValorSumAsegEar', function(){
          if($scope.data.mValorSumAsegEar == 0 || angular.isUndefined($scope.data.mValorSumAsegEar)){
            $scope.data.c10.mEar = 0;
            $scope.data.mValorSumAsegEar = "";
            $scope.data.c10.MCAContratado = "N";
            $scope.errorMaxAmountC10 = false;
            removeError('c10', 'errorMaxAmountC10')
            $scope.data.c10.error = false;
          }else{
            if(evaluaConvenio1()){
                if($scope.data.c01.total < $scope.params.maxAmountC09){
                  $scope.data.c10.mEar = parseFloat($scope.data.mValorSumAsegEar);
                  $scope.data.c10.MCAContratado = "S";
                  if(parseFloat($scope.data.mValorSumAsegEar) > $scope.data.c01.total){
                    $scope.errorVBCar = false;
                    $scope.errorMaxAmountC10 = true;
                    addError('c10', 'errorMaxAmountC10');
                    $scope.data.c10.mEar = 0;
                    $scope.data.c10.error = true;
                  }else{
                    $scope.errorMaxAmountC10 = false;
                    removeError('c10', 'errorMaxAmountC10');
                    $scope.data.c10.mEar = parseFloat($scope.data.mValorSumAsegEar);
                    $scope.data.c10.error = false;
                  }
                }else{
                  $scope.data.c10.mEar = parseFloat($scope.data.mValorSumAsegEar);
                  $scope.data.c10.MCAContratado = "S";
                  $scope.errorMaxAmountC10 = false;
                  removeError('c10', 'errorMaxAmountC10');
                  $scope.data.c10.error = false;
                }
            }else{
              $scope.data.c10.mEar = 0;
              $scope.data.mValorSumAsegEar = 0;
              mModalAlert.showWarning("Es obligatorio contratar el Convenio I para continuar", "");
            }
          }

          if($ctrl.product.CodigoProducto == 57){ //empresas
            $scope.errorMValorSumAsegEar = false;
            if($scope.data.c01.total < $scope.params.maxAmountC10) {
              $scope.errorVBEar = $scope.data.mValorSumAsegEar < $scope.data.c01.total
            }
          }
        });
      }
      //tipo local y categoria local

      $scope.localRiesgo = function(val){
        if(angular.isUndefined(val)){
          $ctrl.data.local = {};
        }else{
          $ctrl.data.local = val;
        }
      }

      $scope.categoriaRiesgo = function(val){
      if(angular.isUndefined(val))
        $ctrl.data.categoria = {};
      else
        $ctrl.data.categoria = val;
      }

        $scope.status = {
          isCustomHeaderOpen: false,
          isFirstOpen: true,
          isFirstDisabled: false
        };

        var calculations = {

          conventionOne: function(convention) {
            if (convention.withoutCheck || convention.mCheckConvenio) {
              var result = 0;
              var isArray = angular.isArray(convention.propertiesCalc);
              angular.forEach(convention.propertiesCalc, function(prop, index) {
                var field = isArray ? prop : index;
                var value = parseFloat(convention.data[field]);
                if (!isArray && prop.ignore === true) value = 0;
                result += isNaN(value) ? 0 : value;
              });
              convention.data.total = result;
              convention.validators = convention.validators || {};

              convention.validators.maxTotal = true;

              if (angular.isFunction(convention.maxValueTotal) && convention.maxValueTotal())
                convention.validators.maxTotal = convention.data.total <= convention.maxValueTotal();
            }
          }
        };
        //var $ctrl = this;
        var items = [];

        var nFieldName = function() {
          return !$scope.$ctrl.typeMoney || $scope.$ctrl.typeMoney == 1 ? 'codigo' : 'descripcion';
        };
        var fnMax = function(field, limit) {
          var _field = nFieldName();
          return parseFloat(limit[field][0][_field].split(',').join(''));
        };

       function maxByConvenio(current, prop, fieldName, limit, options, msg, index) {
          return function(value) {
            value = value || current.data[fieldName];
            var convention1 = $ctrl.data.conventions[index];
            var result = 0;
            angular.forEach(options, function(f) {
              var v = parseFloat(convention1.data[f]);
              result += isNaN(v) ? 0 : v;
            });
            current.messages = current.messages || {};
            current.messages[fieldName] = null;
            var valorMaxDefault = fnMax(prop, limit);

            if (result <= valorMaxDefault) {
              if (value !== undefined && value > result) {
                current.messages[fieldName] = msg;
              }
              return result;
            }
            return valorMaxDefault;
          };
        }

        var customFunctions = {
          maxByConvenio: maxByConvenio,
          minTrabajadores: function(fieldMin) {
            return function(value) {
              var result = 0;
              var convention = $ctrl.data.conventions[fieldMin.conventionIndex];
              angular.forEach(fieldMin.options, function(f) {
                var v = parseFloat(convention.data[f]);
                result += isNaN(v) ? 0 : v;
              });
              return result ? fieldMin.value : NaN;
            };
          }
        };
        //if (!$ctrl.data.conventions){

        angular.forEach($ctrl.data.conventions || helper.clone(conventionsCompany.convetions), function(item) {
          if ($ctrl.lookups && $ctrl.lookups.limits) {
            var limit = $ctrl.lookups.limits['convention' + item.number];

            if (angular.isString(item.fieldMaxTotal) && limit[item.fieldMaxTotal]) {
              item.maxValueTotal = function() {
                return limit[item.fieldMaxTotal][0][nFieldName()];
              };
            }

            if (item.singelField && limit && angular.isObject(limit)) {
              var fnM = function() {
                return fnMax('maxTotal', limit);
              };

              if (angular.isObject(item.singelField)) {
                fnM = customFunctions[item.singelField.func](
                  item,
                  'maxTotal',
                  'sumAssured',
                  limit,
                  item.singelField.options,
                  item.singelField.message,
                  item.singelField.conventionIndex
                );
              }
              item.range = angular.extend(
                {
                  min: function() {
                    return 1;
                  }
                },
                { max: fnM }
              );
            }
            angular.forEach(item.propertiesCalc, function(prop, index) {
              item.validators = item.validators || {};

              var defaultmax = function() {
                return fnMax(prop.fieldMax, limit);
              };
              var defualtmin = NaN;
              if (angular.isObject(prop)) {
                if (angular.isObject(prop.fieldMax)) {
                  defaultmax = customFunctions[prop.fieldMax.func](
                    item,
                    prop.fieldMax.field,
                    index,
                    limit,
                    prop.fieldMax.options,
                    prop.fieldMax.message,
                    prop.fieldMax.conventionIndex
                  );
                }
                if (prop.fieldMax == null || prop.fieldMax == undefined) defaultmax = NaN;

                if (angular.isNumber(prop.fieldMin)) defualtmin = prop.fieldMin;
                else if (angular.isObject(prop.fieldMin)) {
                  defualtmin = customFunctions[prop.fieldMin.func](prop.fieldMin);
                }

                item.validators[index] = { range: angular.extend({ min: defualtmin }, { max: defaultmax }) };

                if (angular.isObject(prop.warning)) {
                  item.warning = item.warning || {};
                  item.warning[index] = {
                    showWarning: function(value) {
                      item.warning[index].isValid = value > fnMax(prop.warning.fieldMax, limit);
                      return item.warning[index].isValid;
                    }
                  };
                }
              }
            });
          }
          items.push(item);
        });

       $ctrl.data.conventions = $ctrl.data.conventions || items;

        (function() {
          $ctrl.currencyValue = function(value) {
            return $filter('currency')(value, '') + ' ' + $ctrl.getMoneyName();
          };

          $ctrl.disabledAcordion = function(convetion) {
            convention.includeBody === undefined || (!convention.mCheckConvenio && convention.withoutCheck !== true);
          };

          $ctrl.setOpen = function($event, convention) {
            convention.isOpen = convention.mCheckConvenio && convention.includeBody !== undefined;
            $event.stopPropagation();
            $event.stopImmediatePropagation();

            if (system.typesBrowser().Firefox) {
              $event.preventDefault();
              var ckh = $event.currentTarget;
              $timeout(function() {
                ckh.checked = !ckh.checked;
              }, 10);
            }
          };
          $ctrl.isContractFirst = function() {
            var convention = $ctrl.data.conventions[0];
            return convention.data.total !== null && convention.data.total !== undefined && convention.data.total > 0;
          };
          $ctrl.getTotal = function(convention) {
            calculations.conventionOne(convention);
            return convention.data.total;
          };
          $ctrl.checkedEquiMovil = function(convention) {
            convention.data.mCVCoberturaAdicional = '';
          };

          $ctrl.changeContent = function(convention) {
            var f = $ctrl.data.conventions[1].frmBody;
            f.nCIIValorContenido.validationForm();
          };
          $ctrl.changeRoturaMaq = function() {
            var f = $ctrl.data.conventions[3].frmHeader;
            f.nSumAssured.validationForm();
          };
          $ctrl.changeUnicoEE = function() {
            var f = $ctrl.data.conventions[4].frmBody;
            f.nCVLimiteUnico.validationForm();
          };
          $ctrl.changePoderCobradores = function(convention) {
            if (!convention.data.mLimitePoderCobradores) convention.data.mTotalCobradores = '';
            convention.frmBody.nTotalCobradores.validationForm();
          };
          $ctrl.changeLimiteUnico = function(convention) {
            if (!convention.data.mCVLimiteUnico) {
              convention.data.mEquipoMovil = false;
              convention.data.mCVCoberturaAdicional = '';
            }
            var f = $ctrl.data.conventions[4].frmBody;
            f.nCVCoberturaAdicional.validationForm();
          };
          $ctrl.getMoneyName = function() {
            return !$ctrl.typeMoney || $ctrl.typeMoney == 1 ? 'SOLES' : 'DOLARES';
          };
          $ctrl.getMoneySimb = function() {
            return !$ctrl.typeMoney || $ctrl.typeMoney == 1 ? 'S/. ' : '$ ';
          };
          $ctrl.isCheckedMaquinarias = function() {
            var _isChecked = false;
            var _numberConv = [3, 4];
            for (var x = 0; x < _numberConv.length && !_isChecked; x++) {
              if ($ctrl.data.conventions[_numberConv[x]].mCheckConvenio !== undefined)
                _isChecked = $ctrl.data.conventions[_numberConv[x]].mCheckConvenio;
            }
            return _isChecked;
          };
          $ctrl.rangeMaquinaria = {
            min: function() {
              var _isChecked = $ctrl.isCheckedMaquinarias();
              if (_isChecked) return 1;
              return NaN;
            },
            max: NaN
          };
          $ctrl.calculatePrima = function($event, convention) {
            if (convention.mCheckConvenio || convention.withoutCheck)
              rickItemChanger.tryCalculate($attrs, $scope, calcPrima);
          };
          $ctrl.$postLink = function() {
            rickItemChanger.detectedChange($element, $attrs, $scope, 0);
          };

          $ctrl.conveniosList1 = [
            {
              title: 'CONVENIO I - INCENDIO Y LÍNEAS ALIADAS',
              type: [
                {
                  desc: 'Incendio, Daños por Agua, lluvia e inundación, Huelga, Conmoción Civil, Daño Malicioso, Vandalismo y Terrorismo - Solo contenido',
                  cover: 30000
                }
              ]
            },
            { title: 'CONVENIO II - ROBO Y/O ASALTA',
              type: [
                {
                  desc: 'Robo y/o Asalto - Contenido',
                  cover: 10000
                },
                {
                  desc: 'Robo y/o Asalto - Dinero',
                  cover: 2000
                }
              ]
            },
            { title: 'CONVENIO III - LUCRO CESANTE',
              type: [
                {
                  desc: 'Lucro Cesante (Cédula A)',
                  cover: 30000
                }
              ]
            },
            { title: 'CONVENIO IV - ACCIDENTES PERSONALES',
              type: [
                {
                  desc: 'Muerte e Invalidez Permanente',
                  cover: 5000
                },
                {
                  desc: 'Indemnización Hospitalaria',
                  cover: 1000
                }
              ]
            }
          ]
          $ctrl.totalList1 = _totalConvenios($ctrl.conveniosList1);

          $ctrl.conveniosList2 = [
            {
              title: 'CONVENIO I - INCENDIO Y LÍNEAS ALIADAS',
              type: [
                {
                  desc: 'Incendio, Daños por Agua, lluvia e inundación, Huelga, Conmoción Civil, Daño Malicioso, Vandalismo y Terrorismo - Solo contenido',
                  cover: 20000
                }
              ]
            },
            { title: 'CONVENIO II - ROBO Y/O ASALTA',
              type: [
                {
                  desc: 'Robo y/o Asalto - Contenido',
                  cover: 10000
                }
              ]
            }
          ]
          $ctrl.totalList2 = _totalConvenios($ctrl.conveniosList2);

          function _totalConvenios(lista) {
            var total = 0;
            angular.forEach(lista, function (value, key) {
              angular.forEach(value.type, function (value, key) {
                total = total + value.cover;
              })
            })
            return total;
          }

          if($ctrl.isValidStep1){
            switch($ctrl.product.CodigoProducto){
              case 129: //SMART24H
                $scope.preConvenios = $ctrl.conveniosList2;
                $scope.totalPreConvenios = $ctrl.totalList2
              break;
              case 130:
                $scope.preConvenios = $ctrl.conveniosList1;
                $scope.totalPreConvenios = $ctrl.totalList1;
              break;
            }
          }

        })();
    }
    ])
    .component('riskItem', {
      templateUrl: function($element, $attrs) {
        return '/polizas/app/empresa/cotiza/component/riskItem.html';
      },
      controller: 'riskItemController',
      bindings: {
        data: '=',
        lookups: '=?',
        currency: '=?',
        product: '=?',
        giro: '=?',
        isValidStep1: "=?",
        addtionalData: '&'
      }
    })
    .constant('conventionsCompany', {
      convetions: {
        convetion1: {
          number: 1,
          romanNumber: 'I',
          title: 'CONVENIO I - INCENDIO, LÍNEAS ALIADAS Y LUCRO CESANTE',
          description: 'Riesgo sujeto a evaluación de suscripción',
          includeBody: 'fireConvention.html',
          prop: 'incendio',
          includeHeader: {
            templateInput: 'nConventionHeader.html'
          },
          withoutCheck: true,
          propertiesCalc: {
            mCIValorTotalEdif: { mapProperty: 'totalEdificacion' },
            mCIValorInstalFijas: { mapProperty: 'instalacionesFijas' },
            mCIValorContenido: { mapProperty: 'contenido' },
            mCIValorMaquinariaEquipo: { mapProperty: 'maquinariaEquipo' },
            mCImobiliario: { mapProperty: 'mobiliario' },
            mCIexistencias: { mapProperty: 'existencias' },
            mCIValorCesanteEstable: { mapProperty: 'lucroCesante' },
            mTerremoto: { ignore: true, mapProperty: 'mcaContrataTerremoto', typeValue: 'boolean' },
            mTerrorismo: { ignore: true, mapProperty: 'mcaContrataTerrorismo', typeValue: 'boolean' }
          },
          fieldMaxTotal: 'maxTotal'
        },
        convetion2: {
          number: 2,
          romanNumber: 'II',
          title: 'CONVENIO II - ROBO Y/O ASALTO',
          includeBody: 'stoleConvention.html',
          includeHeader: {
            templateInput: 'nConventionHeader.html'
          },
          propertiesCalc: {
            mCIIValorContenido: {
              mapProperty: 'valorContenido',
              fieldMax: {
                field: 'maxContenidoMaq',
                func: 'maxByConvenio',
                conventionIndex: 0,
                options: ['mCIValorContenido', 'mCIValorMaquinariaEquipo', 'mCImobiliario', 'mCIexistencias'],
                message: 'El valor no puede superar al 100% del contenido declarado en Convenio I'
              }
            },
            mLimiteCajaChica: {
              mapProperty: 'limiteCajaChica',
              fieldMax: 'maxCajaChica',
              warning: { fieldMax: 'msgCajaChica' }
            },
            mLimiteCajaFuerte: {
              mapProperty: 'limiteCajaFuerte',
              fieldMax: 'maxCajaFuerte',
              warning: { fieldMax: 'msgCajaFuerte' }
            },
            mLimiteTransitoBancos: {
              mapProperty: 'limiteTransitoBanco',
              fieldMax: 'maxTransitoBancos',
              warning: { fieldMax: 'msgTransitoBancos' }
            },
            mLimitePoderCobradores: {
              mapProperty: 'limitePoderCobradores',
              fieldMax: 'maxPoderCobradores',
              warning: { fieldMax: 'msgPoderCobradores' }
            },
            mTotalCobradores: {
              mapProperty: 'numeroCobradores',
              ignore: true,
              fieldMin: { value: 1, func: 'minTrabajadores', options: ['mLimitePoderCobradores'], conventionIndex: 1 }
            }
          },
          fieldMaxTotal: 'maxTotal'
        },
        convetion3: {
          number: 3,
          romanNumber: 'III',
          title: 'CONVENIO III - RESPONSABILIDAD CIVIL',
          singelField: true,
          mapProperty: 'sumaAseguradaC3'
        },
        convetion4: {
          includeHeader: {
            templateInput: 'simpleHeader4.html'
          },
          number: 4,
          romanNumber: 'IV',
          title: 'CONVENIO IV - ROTURA DE MÁQUINA',
          singelField: {
            func: 'maxByConvenio',
            conventionIndex: 0,
            options: ['mCIValorMaquinariaEquipo'],
            message: 'No puede superar el 100% del valor maquinaria equipo del Convenio I'
          },
          mapProperty: 'sumaAseguradaC4'
        },
        convetion5: {
          number: 5,
          romanNumber: 'V',
          title: 'CONVENIO V - EQUIPO ELECTRÓNICO',
          includeBody: 'equipmentConvention.html',
          includeHeader: {
            templateInput: 'nConventionHeader.html'
          },
          propertiesCalc: {
            mCVLimiteUnico: {
              mapProperty: 'limiteUnico',
              fieldMax: {
                field: 'maxUnicoEE',
                func: 'maxByConvenio',
                conventionIndex: 0,
                options: ['mCIValorMaquinariaEquipo'],
                message: 'No puede superar el 100% del valor maquinaria equipo del Convenio I'
              }
            },
            mCVCoberturaAdicional: {
              mapProperty: 'sumaAseguradaC5',
              fieldMax: {
                field: 'maxCovAdicional',
                func: 'maxByConvenio',
                conventionIndex: 4,
                options: ['mCVLimiteUnico']
              },
              warning: { fieldMax: 'msgCovAdicional' }
            }
          }
        },
        convetion6: {
          number: 6,
          romanNumber: 'VI',
          title: 'CONVENIO VI - ACCIDENTES PERSONALES',
          singelField: true,
          mapProperty: 'sumaAseguradaC6',
          propertiesCalc: {
            totalAseg: { mapProperty: 'numeroAsegurados' }
          },
          includeHeader: {
            templateInput: 'personalAcc.html'
          }
        },
        convetion7: {
          number: 7,
          romanNumber: 'VII',
          title: 'CONVENIO VII - DESHONESTIDAD DE EMPLEADOS',
          singelField: true,
          mapProperty: 'sumaAseguradaC7'
        },
        convetion8: {
          number: 8,
          romanNumber: 'VIII',
          title: 'CONVENIO VIII - TREC - TODO RIESGO EQUIPO CONTRATISTA',
          singelField: true,
          mapProperty: 'sumaAseguradaC8'
        },
        convetion9: {
          number: 9,
          romanNumber: 'IX',
          title: 'CONVENIO IX - CAR - TODO RIESGO DE CONTRATISTA',
          singelField: true,
          mapProperty: 'sumaAseguradaC9'
        },
        convetion10: {
          number: 10,
          romanNumber: 'X',
          title: 'CONVENIO X - EAR - TODO RIESGO DE MONTAJE',
          singelField: true,
          mapProperty: 'sumaAseguradaC10'
        }
      }
    })
    .service('rickItemChanger', function($parse, $timeout, $compile) {
      var $this = this;
      var value;
      this.tryCalculate = function($attrs, $scope, handler) {
        var fn = $parse($attrs.notifySuccess);
        if (!(value && value.success === true)) value = undefined;
        fn($scope.$parent, { $companyData: value });
      };
      this.detectedChange = function($element, $attrs, $scope, handler) {
        angular.getTestability($element).whenStable(function() {
          $timeout(function() {
            $('input[type=text], input[type=checkbox], select', $($element));
            $('input[type=text], input[type=checkbox], select', $($element)).change(function() {
            });
          }, 500);
        });
      };
    })
    .directive('ieRemoveDisabled', function($parse, $timeout) {
      return {
        link: function(scope, element, attrs, ngModelCtrl) {
          var isIE = false || !!document.documentMode;
          var isEdge = !isIE && !!window.StyleMedia;
          if (isIE || isEdge) {
            angular.getTestability(element).whenStable(function() {
              $timeout(function() {
                element.find('a').prop('disabled', false);
              }, 500);
            });
          }
        }
      };
    });
});
