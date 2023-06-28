(function ($root
  , deps
  , action
  , lodash) {
  define(deps
    , action
    , _)
})(this, ['angular'
, 'seguridadFactory']
, function (ng
, seguridadFactory) {

    var appSecurity = ng.module('appSecurity');

    appSecurity.controller('datosPersonalesController',
      ['$scope'
        , 'seguridadFactory'
        , function($scope
        , seguridadFactory) {

          var vm = this;
          
          vm.$onInit = function () {

            vm.data = vm.data || {}

            //tipo doc
            var pms = seguridadFactory.getDocumentTypes();
            pms.then(function (response) {
              vm.tipoDocData = _.filter(response.data, function (item) {
                return item.codigo == 6
                  || item.codigo == 4
                  || item.codigo == 2
                  || item.codigo == 6
                  || item.codigo == 7
                  || item.codigo == 1
              })
            });
          }; //end init
          vm.fnChangeTipoDoc = _fnChangeTipoDoc;
          vm.fnInferData = _fnInferData;
          vm.isRuc = _isRuc;

          function _fnChangeTipoDoc() {
            vm.data.mNumDoc = '';
          }

          function _isRuc() {
            var vNatural = true;
            var num = vm.data.mNumDoc;
            if(!ng.isUndefined(vm.data.mTipoDoc)){
              if (vm.data.mTipoDoc.codigo != null && num) {
                var pos = num.indexOf("10");
                vNatural = true;
              }  
            }else vNatural = false;            
            return !vNatural;
          }

          function _fnInferData() {
            var docValue = vm.data.mNumDoc;
            var docType = (vm.data.mTipoDoc.selectedEmpty) ? '' : vm.data.mTipoDoc.codigo;
            vm.data.onlyNumber = true;
            switch (parseInt(docType)) {
              default:
              case 1: //DNI
                vm.data.docNumMaxLength = 8
                break;
              case 2: //RUC
                vm.data.docNumMaxLength = 11
                vm.isRuc();
                if (!ng.isUndefined(docValue)) {
                  var pos = docValue.indexOf("20");
                  if (pos != -1) vm.showNaturalRucPerson = true;
                  else vm.showNaturalRucPerson = false;
                }
                break;
              case 4: //PEX
                vm.data.onlyNumber = false;
                vm.data.docNumMinLength = 9
                vm.data.docNumMaxLength = 12
                break;
              case 7: //CIP
                vm.data.docNumMaxLength = 15
                break;
              case 6: //CEX
                vm.data.docNumMinLength = 9
                vm.data.docNumMaxLength = 12
                break;
           }
          }

        }])
      .component('datosPersonales', {
        templateUrl: '/security/app/secciones/common/datosPersonales.html',
        controller: 'datosPersonalesController',
        controllerAs: '$ctrl',
        bindings: {
          data: '='
        }
      })
  });
