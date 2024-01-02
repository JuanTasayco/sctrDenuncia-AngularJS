(function ($root, deps, action) {
  define(deps, action)
})(this, ['angular'
  , 'constants'
  , 'helper'],
  function (ng
    , constants
    , helper) {

    var appSecurity = ng.module('appSecurity');

    appSecurity.controller('crearUsuarioCorredor02Controller',
      ['$scope'
        , '$state'
        , '$q'
        , '$timeout'
        , 'seguridadFactory'
        , 'mModalAlert'
        , function ($scope
          , $state
          , $q
          , $timeout
          , seguridadFactory
          , mModalAlert) {

          function bindLookups() {
            //cargos
            var pms2 = seguridadFactory.getCharges();
            pms2.then(function (response) {
              $scope.cargoData = response.data || response.Data;
              $scope.cargoData = $scope.removeduplicate($scope.cargoData, 'codigo');
            });

            //productores
            var pms3 = seguridadFactory.getAgentsBroker($scope.createS1.mRucEmpresa);
            pms3.then(function (response) {
              $scope.productorData = [];
              var data = response.data || response.Data;
              for(var i = 0; i < data.length; i++){
                $scope.productorData.push({id: data[i].codigo, idName: data[i].codigoDescripcion});
              }
            });

            // var pms3 = seguridadFactory.getProducers();
            // pms3.then(function (response) {
            //   debugger;
            //   $scope.productorData = response.data || response.Data;
            // });

            //tipo doc
            var pms4 = seguridadFactory.getDocumentTypes();
            pms4.then(function (response) {
              $scope.tipoDocData = response.data || response.Data;
              $scope.tipoDocData = _.filter($scope.tipoDocData, function (item) {
                return item.codigo == 6
                  || item.codigo == 4
                  || item.codigo == 2
                  || item.codigo == 6
                  || item.codigo == 7
                  || item.codigo == 1
              })
            });
          }

          (function onLoad() {

            if (!$scope.create.validStep1)
              $state.go('crearUsuarioCorredor.steps', { step: 1 });

            bindLookups();

            //Default data

            $scope.createS2.corredor.mCargo = {"codigo":3,"descripcion":"EMPLEADO"};

            $scope.disabledCargo = false;

            $scope.login = seguridadFactory.getVarLS("profile");

            $scope.create = $scope.create || {};
            $scope.createS1 = $scope.createS1 || {};
            $scope.createS2 = $scope.createS2 || {};

            $scope.createS2.corredor = $scope.createS2.corredor || {};
            $scope.createS2.corredor.datosPersonales = $scope.createS2.corredor.datosPersonales || {};

            $scope.createS2.isEdit = $scope.createS2.isEdit || false;
            $scope.createS2.corredor.datosPersonales.isEdit = $scope.createS2.isEdit;

            $scope.getListSede = getListSede;
            $scope.toggleInput = function(){
              $scope.showInput = !$scope.showInput
              if(!$scope.showInput){
                $scope.getListSede($scope.createS2.corredor.sede)
                .then(function(sedes){
                  if(sedes.length > 0){
                    $scope.createS2.corredor.sede = _.find(sedes, function(sede){ return sede.descripcion == $scope.createS2.corredor.sede})
                  }
                })
              }
              else{
                $scope.createS2.corredor.sede = _.isObject($scope.createS2.corredor.sede) ? $scope.createS2.corredor.sede.descripcion : $scope.createS2.corredor.sede
              }
            };
            if(!ng.isUndefined($scope.createS2.corredor.sede)){
              $scope.getListSede($scope.createS2.corredor.sede)
                .then(function(sedes){
                  if(sedes.length === 0){
                    $scope.showInput = true;
                  }
                  else{
                    $scope.showInput = false;
                    $scope.createS2.corredor.sede = _.find(sedes, function(sede){ return sede.codigo == $scope.createS2.corredor.sede})
                  }
                })
            }
          })();

          function isValid() {
            $scope.frmCreateUser.markAsPristine();
            $scope.frmCreateUser.frmDatosPersonales.markAsPristine();
            return $scope.frmCreateUser.$valid;
          }
          function getListSede(str) {
            var defer = $q.defer();
            if (str && str.length >= 2) {
              var txt = str.toUpperCase();
              
              var pms = seguridadFactory.autocompleteOffice(txt)
              pms.then(function (response) {
                var data = response.data || response.Data;
                if (data.length > 0) $scope.noResultOffice = false;
                else $scope.noResultOffice = true;
                defer.resolve(data);
              });
            }
            return defer.promise;
          }

          $scope.isRuc = isRuc;
          function isRuc() {
            var vNatural = true;
            var tipoDoc = $scope.createS2.corredor.datosPersonales.mTipoDoc;
            var num = $scope.createS2.corredor.datosPersonales.mNumDoc;
            if (tipoDoc.codigo && num) {
              var pos = num.indexOf("10");
              vNatural = true;
            }
            // vNatural = mainServices.fnShowNaturalRucPerson(tipoDoc.codigo, num);
            return !vNatural;
          }

          $scope.fnChangeTipoDoc = _fnChangeTipoDoc;
          function _fnChangeTipoDoc() {
            $scope.createS2.corredor.datosPersonales.mNumDoc = '';
          }
          $scope.removeduplicate = function(array, property) {
            let uniqueObject = {};
            let newArrayWithoutDuplicates = [];

            for (let row of array) {
              let obj = row;
              let value = obj[property];

              if (!uniqueObject[value]) {
                uniqueObject[value] = true;
                newArrayWithoutDuplicates.push(obj);
              }
            }

            return newArrayWithoutDuplicates;
          }
          $scope.fnInferData = _fnInferData;
          function _fnInferData() {
            var docValue = $scope.createS2.corredor.datosPersonales.mNumDoc;
            var docType = $scope.createS2.corredor.datosPersonales.mTipoDoc.codigo;

            switch (parseInt(docType)) {
              default:
              case 1: //DNI
                $scope.createS2.corredor.docNumMaxLength = 8
                $scope.createS2.corredor.onlyNumber = true;
                break;
              case 2: //RUC
                $scope.createS2.corredor.docNumMaxLength = 11
                $scope.createS2.corredor.onlyNumber = true;
                $scope.isRuc();
                if (!ng.isUndefined(docValue)) {
                  var pos = docValue.indexOf("20");
                  if (pos != -1) $scope.showNaturalRucPerson = true;
                  else $scope.showNaturalRucPerson = false;
                }
                break;
              case 4: //PEX
                $scope.createS2.corredor.docNumMaxLength = 12
                $scope.createS2.corredor.onlyNumber = false;
                break;
              case 7: //CIP
                $scope.createS2.corredor.docNumMaxLength = 20
                $scope.createS2.corredor.onlyNumber = true;
                break;
              case 6: //CEX
                $scope.createS2.corredor.docNumMaxLength = 9
                $scope.createS2.corredor.onlyNumber = true;
                break;
            }
          }

          $scope.createS2.fnNextStep = _fnNextStep;
          function _fnNextStep(isNextStep, e) {
            if(isNextStep){
            if (isValid()){
              var isCreate = true;
              if (!$scope.create.validStep2) {
                isCreate = true;                
                var params = {
                  tipDocumentoDescripcion: $scope.createS2.corredor.datosPersonales.mTipoDoc.descripcion
                  , cargoDescripcion: $scope.createS2.corredor.mCargo.descripcion
                  , numProductor: (ng.isUndefined($scope.createS2.corredor.mProductor)) ? 0 : $scope.createS2.corredor.mProductor.id
                  , ruc: (ng.isUndefined($scope.createS1.mRucEmpresa)) ? "" : $scope.createS1.mRucEmpresa
                  , numTipUsuario: $scope.createS2.corredor.mTipoUsuario
                  , numTipDocumento: (ng.isUndefined($scope.createS2.corredor.datosPersonales.mTipoDoc)) ? 0 : $scope.createS2.corredor.datosPersonales.mTipoDoc.codigo
                  , documento: (ng.isUndefined($scope.createS2.corredor.datosPersonales.mNumDoc)) ? "" : $scope.createS2.corredor.datosPersonales.mNumDoc
                  , nombres: (ng.isUndefined($scope.createS2.corredor.datosPersonales.mNombres)) ? "" : $scope.createS2.corredor.datosPersonales.mNombres
                  , apellidoPaterno: (ng.isUndefined($scope.createS2.corredor.datosPersonales.mApellidoPaterno)) ? "" : $scope.createS2.corredor.datosPersonales.mApellidoPaterno
                  , apellidoMaterno: (ng.isUndefined($scope.createS2.corredor.datosPersonales.mApellidoMaterno)) ? "" : $scope.createS2.corredor.datosPersonales.mApellidoMaterno
                  , numCargo: (ng.isUndefined($scope.createS2.corredor.mCargo)) ? 0 : $scope.createS2.corredor.mCargo.codigo
                  , telefono: (ng.isUndefined($scope.createS2.corredor.datosPersonales.mTelefono)) ? "" : $scope.createS2.corredor.datosPersonales.mTelefono
                  , celular: (ng.isUndefined($scope.createS2.corredor.mCelular)) ? "" : $scope.createS2.corredor.mCelular
                  , correo: (ng.isUndefined($scope.createS2.corredor.datosPersonales.mEmail)) ? "" : $scope.createS2.corredor.datosPersonales.mEmail
                  , codUser: $scope.login.username
                  , sede : ng.isUndefined($scope.createS2.corredor.sede) 
                    ? '' 
                    : $scope.createS2.corredor.sede.codigo 
                    ? $scope.createS2.corredor.sede.codigo 
                    : $scope.createS2.corredor.sede
                }
                var pms = seguridadFactory.insertUserBroker(params);
              } else { //actualiza datos usuario
                var isCreate = false;
                var params = {
                  numUser: $scope.createS3.user.numUsuario
                  , names: $scope.createS2.corredor.datosPersonales.mNombres
                  , firstLastName: $scope.createS2.corredor.datosPersonales.mApellidoPaterno
                  , secondLastName: $scope.createS2.corredor.datosPersonales.mApellidoMaterno
                  , numCharge: $scope.createS2.corredor.mCargo.codigo
                  , phoneNumber: $scope.createS2.corredor.datosPersonales.mTelefono
                  , cellPhoneNumber: $scope.createS2.corredor.mCelular
                  , email: $scope.createS2.corredor.datosPersonales.mEmail
                  , codeAgent: ($scope.createS2.corredor.mProductor.id == null) ? 0 : $scope.createS2.corredor.mProductor.id
                  , codeStatus: 1
                  , typeUser: $scope.createS2.corredor.mTipoUsuario
                  , codeUser: $scope.login.username
                  , numTipDocumento: $scope.createS2.corredor.datosPersonales.mTipoDoc.codigo
                  , documento: $scope.createS2.corredor.datosPersonales.mNumDoc
                }
                var pms = seguridadFactory.updateUserBrokerCreate(params);
              }
              pms.then(function (response) {
                if (response.operationCode == 200) {
                  var data = response.data || response.Data;
                  if(ng.isObject(data)){
                    $scope.viewSuccess = true;
                    if (!$scope.create.validStep2) {
                      $scope.createS3.user = data;
                      $scope.create.validStep2 = true;
                    }
                    $scope.create.numUsuario = $scope.createS3.user.numUsuario;                    
                  }
                  $scope.createS3.isCreate = isCreate;
                  var pms1 = seguridadFactory.getDismaViewDetails($scope.create.numUsuario);
                  pms1.then(function (res) {
                    if (res.operationCode == 200) {
                      $scope.createS3.user.details = res.data || res.Data;
                      $state.go('crearUsuarioCorredor.steps', { step: 3 })
                    } else mModalAlert.showWarning(res.message, '');
                  })
                } else mModalAlert.showWarning(response.message, '');
              });
            } else {
              e.cancel = true;
              mModalAlert.showWarning('Por favor corregir los errores antes de continuar', '');
            }
          }else $state.go('crearUsuarioCorredor.steps', { step: e.step })
          }

          //valida formulario desde click en paso 2 (circulo superior)
          $scope.$on("changingStep", function (event, e) {
            if(e.step > 2) $scope.createS2.fnNextStep(true, e);
            else $scope.createS2.fnNextStep(false, e);
          });

        }])
  });
