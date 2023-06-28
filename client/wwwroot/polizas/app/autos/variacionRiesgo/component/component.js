'use strict';

define([
    'angular', 'constants', '/polizas/app/autos/autosHome/service/autosFactory.js'
], function(angular, constants, factory) {

    var appAutos = angular.module('appAutos')

    appAutos.controller('ctrlFrmRiesgo',
    ['$scope', 'autosFactory', '$q', '$state', 'mapfreAuthetication', '$rootScope', '$stateParams', 'mpSpin', '$timeout',
    'proxyClaims',
    function($scope, autosFactory, $q, $state, mapfreAuthetication, $rootScope, $stateParams, mpSpin, $timeout,
    proxyClaims) {

      var _self = this;

      var fecha = new Date();
      var anioActual = fecha.getFullYear();

      var profile=[];
      $scope.regexYear = '(19|20)\\d{2}';

      $scope.formRiesgo = $rootScope.frm || {};
      if($stateParams.infoRiesgo!=null){
        $scope.formRiesgo = $stateParams.infoRiesgo;

        $scope.mTipoVehiculoUpdate = {
          Codigo: $scope.formRiesgo.Tipo,
          Descripcion: $scope.formRiesgo.NombreTipo
        };

        $scope.formRiesgo.showRango =true;
        if($scope.formRiesgo.mSubModelo!=null){
          if(!$scope.formRiesgo.mSubModelo.selectedEmpty){
            $scope.submodelos = [$scope.formRiesgo.mSubModelo];
          }else{
            //cargamos submodelos
            loadSubModelo(constants.module.polizas.autos.companyCode, $scope.formRiesgo.ModeloMarca.codigoMarca, $scope.formRiesgo.ModeloMarca.codigoModelo);
            buscarRango();
          }
        }else if($scope.formRiesgo.ModeloMarca!=null){
          loadSubModelo(constants.module.polizas.autos.companyCode, $scope.formRiesgo.ModeloMarca.codigoMarca, $scope.formRiesgo.ModeloMarca.codigoModelo);
        }
      }

      $scope.usoRiesgos = $rootScope.frm || {};

      $scope.$watch('formRiesgo', function(nv)
      {
        $rootScope.frm =  nv;
      })

      //cargamos datos del usuario logueado
      proxyClaims.GetClaims()
        .then(function(data){
          if(data==null){}else{
            setTimeout(function(){
              profile = data;
              if (profile.length>0){
                $scope.formRiesgo.codAgente = profile[7].value;//profile.codagent;//'818'; //R: Se obtien cuando inicia sesion
                $scope.formRiesgo.codigoUsuarioRED  = profile[2].value.toUpperCase();//profile.username.toUpperCase();//''Usuario'; //R: Valor fijo, por ahora, es cuando se logea en su red, lo toma del active directory
                $scope.formRiesgo.codigoUsuario = profile[2].value.toUpperCase();//profile.username.toUpperCase();//'DBISBAL'; //R: Usuario logeado
                $scope.formRiesgo.UsuarioNombreCompleto = profile[3].value;
                $scope.formRiesgo.UsuarioCorreoElectronico = profile[10].value;
              }

              /*##############################
              # ProductoxUsuario
              ##############################*/

              var oim186 = {
                CodigoAplicacion : constants.module.polizas.description,
                CodigoUsuario : $scope.formRiesgo.codigoUsuario,
                Filtro : constants.module.polizas.autos.description
              }
              autosFactory.postData('api/producto/usuario', oim186) //cambiado en integracion
                .then(function(data){
                  var results =[];
                  var lengthData = data.length;
                  for (var i = 0; i < lengthData; i++) {
                    results.push({ CodigoProducto: data[i].CodigoProducto,
                    NombreProducto: data[i].NombreProducto,
                    CodigoModalidad: data[i].CodigoModalidad});
                  }

                  $scope.productos = results;
                  }, function(error){
                    console.log('Error ' + error);
                  });

            }, 500);
          }
        }, function(error){
          console.log('Error' + error);
      });

      _self.gLblMarcaModeloCreacion = {
          label: '¿Cuál es la marca de auto que quieres crear?',
          required: true,
          error1: 'Error lorem ipsum error lorem ipsum'
      };
      _self.gLblProductoVariacion = {
          label:'Producto',
          required: true,
          error1: '* Este campo es obligatorio',
          defaultValue: '- Selecciona producto -'
      };
      _self.gLblMarcaModeloVariacion = {
          label: '¿Para qué auto quieres solicitar una variación?',
          required: true,
          error1: 'Error lorem ipsum error lorem ipsum'
      };
      _self.gLblMarca = {
          label: 'Marca',
          required: true,
          error1: 'Error lorem ipsum error lorem ipsum'
      };
      _self.gLblModelo = {
          label: 'Modelo',
          required: true,
          error1: 'Error lorem ipsum error lorem ipsum'
      };
      _self.gLblSubModelo = {
          label:'Submodelo',
          required: true,
          error1: '* Este campo es obligatorio',
          defaultValue: '- submodelo -'
      };
      _self.gLblYearFabric = {
          label:'Año de Fabricación',
          required: true,
          error1: '* Este campo es obligatorio',
          defaultValue: '- SELECCIONE -'
      };
      _self.gLblTipoVehiculo = {
          label:'Tipo de auto',
          required: true,
          error1: '* Este campo es obligatorio',
          defaultValue: '- Seleccione tipo de auto -'
      };
      _self.gLblValorVehiculoVariacion = {
          label: 'Valor sugerido',
          required: true,
          error1: '* No es un valor válido',
      };

      /*##############################
      # array updateRiesgo
      ##############################*/
      var arrayUpdateNewRiesgo = [];

      var paramMarcaModelo = {
        Texto : 'HYUNDAI'
      }
      autosFactory.postData('api/automovil/marcamodelo', paramMarcaModelo)
        .then(function(data){
          $scope.marcasModelos = data;
          _self.marcasModelos = data;
        }, function(error){
          console.log('Error' + error);
      });

      /*##############################
      # Call several functons for Marca
      ##############################*/
      _self.getFunctionsMarca = function(val){
        arrayUpdateNewRiesgo.codMarca = val.codigo;
        arrayUpdateNewRiesgo.NombreMarca = val.descripcion;
      };

      /*##########################################
      # Call several functons for Marca y Modelo
      #############################################*/
      _self.getFunctionsModeloMarca = function(val){
        $scope.formRiesgo.ModeloMarca.codigoMarca = val.codigoMarca;
        $scope.formRiesgo.ModeloMarca.nombreMarca = val.nombreMarca;
        $scope.formRiesgo.ModeloMarca.codigoModelo = val.codigoModelo;
        $scope.formRiesgo.ModeloMarca.nombreModelo = val.nombreModelo;
        loadSubModelo(constants.module.polizas.autos.companyCode, val.codigoMarca, val.codigoModelo);
      };

      if($scope.formRiesgo!=null && $scope.formRiesgo.mMarcaModel!=null){
        if($scope.formRiesgo.ModeloMarca.codigoModelo!=null){
          loadSubModelo(constants.module.polizas.autos.companyCode, $scope.formRiesgo.ModeloMarca.codigoMarca, $scope.formRiesgo.ModeloMarca.codigoModelo);
        }
      }
      /*##############################
      # Call several functons for SubModelo
      ##############################*/
      _self.getFunctionsSubModelo = function(val){
        $scope.formRiesgo.mSubModelo.Codigo = val.Codigo;
        $scope.formRiesgo.mSubModelo.Descripcion = val.Descripcion;
      };

      /*##############################
      # Call several functons for Producto a Cotizar
      ##############################*/
      _self.getFuctionsProducto = function(val){
        arrayUpdateNewRiesgo.CodigoProducto = val.CodigoProducto;
        arrayUpdateNewRiesgo.NombreProducto = val.NombreProducto;
        arrayUpdateNewRiesgo.CodigoFamProducto = val.CodigoFamProducto;
        arrayUpdateNewRiesgo.codModalidad = val.CodigoModalidad;
      };

      /*##############################
      # SubModelo
      ##############################*/
      function loadSubModelo(codCompania, codMarca, codModelo) {
        var vParams = codCompania + '/' + codMarca + '/' + codModelo;
        autosFactory.loadSelect('api/automovil/submodelo', vParams)
          .then(function(data){

            if(data){
              $scope.submodelos = data;
              $scope.sinSubmodelo=false;
              if($scope.submodelos.length==0){
                $scope.sinSubmodelo=true;
              }else{
                $scope.formRiesgo.mSubModelo = $scope.submodelos[0];
              }
            }


          }, function(error){
            console.log('Error ' + error);
        });
      }

      /*##############################
      # ProductoxMarca
      ##############################*/
      autosFactory.loadSelect('api/automovil/marca', '')
        .then(function(data){
          $scope.marcas = data;
          _self.marcas = data;
        }, function(error){
          console.log('Error ' + error);
        });

      /*#########################################
      # Listado de todos los tipos de vehiculos
      ###########################################*/
      autosFactory.loadSelect('api/soat/tipovehiculo', constants.module.polizas.autos.companyCode) //cambiado en integracion
        .then(function(data){
          $scope.tipoVehiculo = data;
        }, function(error){
            console.log('Error ' + error);
        });

        $scope.loadSubModelosVar = function(){
            autosFactory.loadSelect('api/automovil/tipovehiculo/1', '') //cambiado en integracion
          .then(function(data){
            $scope.tipoVehiculoVar = data;
          }, function(error){
              console.log('Error ' + error);
          });
        }

      /*##############################
      # Function: updateRiesgo
      ##############################*/
      _self.updateRiesgo = function(mSubModeloUpdate, mYearFabricUpdate,mTipoVehiculoUpdate,mValorVehiculoUpdate, mProductoUpdate){
        $scope.frmPoliData.markAsPristine();
        if(mSubModeloUpdate == null ||
          mYearFabricUpdate == null ||
          mTipoVehiculoUpdate == null ||
          $scope.formRiesgo.valorVehiculo == null ||
          mProductoUpdate.CodigoProducto == null){}else{

          $scope.formRiesgo.mYearFabric.Codigo = mYearFabricUpdate;
          arrayUpdateNewRiesgo.tipoVehiculo = mTipoVehiculoUpdate.Descripcion;
          arrayUpdateNewRiesgo.valorVehiculo = $scope.formRiesgo.valorVehiculo;
          arrayUpdateNewRiesgo.CodigoTipo = mTipoVehiculoUpdate.Codigo;
          arrayUpdateNewRiesgo.NombreProducto= mProductoUpdate.NombreProducto;
          arrayUpdateNewRiesgo.CodigoSubModelo= mSubModeloUpdate.Codigo;
          arrayUpdateNewRiesgo.NombreSubModelo = mSubModeloUpdate.Descripcion;

          var Data = {
              codDocumento: 0,
              asunto: 'SOLICITUD DE ACTUALIZACION DE MODELO DE VEHICULO',
              listaParam: [//{
                {
                  key: 'Titulo',
                  value: 'Se ha solicitado modificar un registro existente'},
                {
                  key: 'EsNuevo',
                  value:  '0'},
                {
                  key: 'CodigoMarca',
                  value:  $scope.formRiesgo.ModeloMarca.codigoMarca},
                {
                  key: 'NombreMarca',
                  value: $scope.formRiesgo.ModeloMarca.nombreMarca},
                {
                  key: 'CodigoModelo',
                  value:  $scope.formRiesgo.ModeloMarca.codigoModelo},
                {
                  key: 'NombreModelo',
                  value:  $scope.formRiesgo.ModeloMarca.nombreModelo},
                {
                  key: 'CodigoSubModelo',
                  value:  $scope.formRiesgo.mSubModelo.Codigo},
                {
                  key: 'NombreSubModelo',
                  value:  $scope.formRiesgo.mSubModelo.Descripcion},
                {
                  key: 'CodigoTipo',
                  value:  arrayUpdateNewRiesgo.CodigoTipo},
                {
                  key: 'NombreTipoVehiculo',
                  value: arrayUpdateNewRiesgo.tipoVehiculo},
                {
                  key: 'AnioFabricacion',
                  value:  $scope.formRiesgo.mYearFabric.Codigo},
                {
                  key: 'SumaAsegurada',
                  value:  arrayUpdateNewRiesgo.valorVehiculo},
                {
                  key: 'NombreProducto',
                  value:  arrayUpdateNewRiesgo.NombreProducto},
                {
                  key: 'UsuarioNombreCompleto',
                  value:  $scope.formRiesgo.UsuarioNombreCompleto},
                {
                  key: 'UsuarioCorreoElectronico',
                  value:  $scope.formRiesgo.UsuarioCorreoElectronico },
                {
                  key: 'AgenteCodigo',
                  value:  $scope.formRiesgo.codAgente},
                {
                  key: 'AgenteNombre',
                  value:  $scope.formRiesgo.codigoUsuario},
                {
                  key: 'Anio',
                  value:  anioActual}
              ]
          };
          mpSpin.start();
          autosFactory.postData('api/general/mail/actualizarmodelo/sendMail', Data)
          .then(function(data){
            mpSpin.end();
            $state.go('variacionRiesgoOK'); // Redireccionamiento
          }, function(error){
            mpSpin.end();
            console.log('Error' + error);
          });
          }

      };

      /*##############################
      # Function: crearRiesgo
      ##############################*/
      _self.crearRiesgo = function(mModeloNew, mSubModeloNew, mYearFabricNew, mTipoVehiculoNew, mValorVehiculoNew, mProductoNew){// pendiente de validar en integracion
          $scope.frmPoliData.markAsPristine();
          if(typeof arrayUpdateNewRiesgo != 'undefined' && mSubModeloNew &&
            mYearFabricNew && mTipoVehiculoNew && mValorVehiculoNew && mProductoNew){
              arrayUpdateNewRiesgo.CodigoMarca = arrayUpdateNewRiesgo.codMarca;//mAcMarcaNew.codigo;
              arrayUpdateNewRiesgo.NombreMarca = arrayUpdateNewRiesgo.NombreMarca;//mAcMarcaNew.descripcion;
              arrayUpdateNewRiesgo.NombreModelo = mModeloNew;
              arrayUpdateNewRiesgo.NombreSubModelo = mSubModeloNew;
              arrayUpdateNewRiesgo.yearFabric = mYearFabricNew;
              arrayUpdateNewRiesgo.CodigoTipo = mTipoVehiculoNew.Codigo;
              arrayUpdateNewRiesgo.tipoVehiculo = mTipoVehiculoNew.Descripcion;
              arrayUpdateNewRiesgo.valorVehiculo = mValorVehiculoNew;
              arrayUpdateNewRiesgo.NombreProducto= mProductoNew.NombreProducto;

              var Data = {
                codDocumento: 0,
                asunto: 'SOLICITUD DE CREACION DE MODELO DE VEHICULO',
                listaParam: [//{

                  {
                    key: 'Titulo',
                    value: 'Se ha solicitado crear un nuevo registro'
                  },
                  {
                    key: 'EsNuevo',
                    value:  '1'},
                  {
                    key: 'CodigoMarca',
                    value:  arrayUpdateNewRiesgo.CodigoMarca},
                  {
                    key: 'NombreMarca',
                    value: arrayUpdateNewRiesgo.NombreMarca},
                  {
                    key: 'CodigoModelo',
                    value:  'NUEVO'},
                  {
                    key: 'NombreModelo',
                    value:  arrayUpdateNewRiesgo.NombreModelo},
                  {
                    key: 'CodigoSubModelo',
                    value:  'NUEVO'},
                  {
                    key: 'NombreSubModelo',
                    value:  arrayUpdateNewRiesgo.NombreSubModelo},
                  {
                    key: 'CodigoTipo',
                    value:  arrayUpdateNewRiesgo.CodigoTipo},
                  {
                    key: 'NombreTipoVehiculo',
                    value: arrayUpdateNewRiesgo.tipoVehiculo},
                  {
                    key: 'AnioFabricacion',
                    value:  arrayUpdateNewRiesgo.yearFabric},
                  {
                    key: 'SumaAsegurada',
                    value:  arrayUpdateNewRiesgo.valorVehiculo},
                  {
                    key: 'NombreProducto',
                    value:  arrayUpdateNewRiesgo.NombreProducto},
                  {
                    key: 'UsuarioNombreCompleto',
                    value:  $scope.formRiesgo.UsuarioNombreCompleto},
                  {
                    key: 'UsuarioCorreoElectronico',
                    value:  $scope.formRiesgo.UsuarioCorreoElectronico },
                  {
                    key: 'AgenteCodigo',
                    value:  $scope.formRiesgo.codAgente},
                  {
                    key: 'AgenteNombre',
                    value:  $scope.formRiesgo.codigoUsuario},
                  {
                    key: 'Anio',
                    value:  anioActual}

                ]
              };

              mpSpin.start();
              autosFactory.postData('api/general/mail/actualizarmodelo/sendMail', Data)
              .then(function(data){
                mpSpin.end();
                $state.go('creacionRiesgoOK'); // Redireccionamiento
              }, function(error){
                mpSpin.end();
                console.log('Error' + error);
              });
          }
      };

      /*auto complete */
      var seed = undefined;
      $scope.loading = false;

      _self.searchMarcaModelo = function(wilcar){

        if (wilcar && wilcar.length>=3){
          //cargamos las marcas y modelos
          var paramMarcaModelo = {
            Texto : wilcar.toUpperCase()
          }

          return autosFactory.getMarcaModelo(paramMarcaModelo);
        }
      };

      _self.searchMarca = function(wilcar){
        if (wilcar && wilcar.length>=3){
            if (seed) {
                $timeout.cancel(seed);
                $scope.wMarcas = [];
                $scope.loading = false;
            }

            seed =  $timeout(function(){
                $scope.loading = true;
                 autosFactory.getData('api/automovil/marcacompletar?cadena=' + wilcar.toUpperCase(), '')
                  .then(function(data){
                    $scope.wMarcas = helper.clone(data, true);
                    $scope.loading = false;
                  }, function(error){
                    $scope.loading = false;
                    console.log('Error ' + error);
                  });
            }, 200)
        }
        else if (seed) {
            $timeout.cancel(seed);
            $scope.wMarcas = [];
            $scope.loading = false;
        }
        else{
            $scope.wMarcas = [];
            $scope.loading = false;
        }
      };

      _self.regresar = function(){
        $state.go('autosQuote.steps', {step: 1});
      }

       function buscarRango(){

          if(typeof $scope.formRiesgo.mYearFabric != 'undefined' &&
          typeof $scope.formRiesgo.ModeloMarca != 'undefined' ){
            var vParams =  '/' + $scope.formRiesgo.ModeloMarca.codigoMarca + '/' +
                $scope.formRiesgo.ModeloMarca.codigoModelo + '/' +
                $scope.formRiesgo.mSubModelo.Codigo + '/' +
                $scope.formRiesgo.mYearFabric.Codigo;

            autosFactory.getData('api/automovil/valorsugerido/' + constants.module.polizas.autos.companyCode + vParams, '')
             .then(function(response){
                $scope.formRiesgo.valorVehiculo = response.Valor;
                $scope.formRiesgo.valorVehiculoMin = response.Minimo;
                $scope.formRiesgo.valorVehiculoMax = response.Maximo;
                $scope.formRiesgo.showRango = true;
            }, function(error){
              console.log('Error en loadValorSugerido: ' + error);
              $scope.formRiesgo.showRango = false;
            });
          }

      }

      _self.buscarRango = function(){
        buscarRango();
      }

      }])

      .component('varRiesgo',
      {
        templateUrl: '/polizas/app/autos/variacionRiesgo/component/automovil-variacion-riesgo.html',
        controller: 'ctrlFrmRiesgo',
        bindings:
        {
          riesgo: "="
        }
      })

      .component('newRiesgo',
      {
        templateUrl: '/polizas/app/autos/variacionRiesgo/component/automovil-creacion-riesgo.html',
        controller: 'ctrlFrmRiesgo',
        bindings:
        {
          riesgo: "="
        }
      })

});
