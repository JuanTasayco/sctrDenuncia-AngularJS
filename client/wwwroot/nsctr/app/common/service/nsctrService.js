'use strict';

define([
	'angular', 'constants', 'nsctr_constants', 'lodash'
], function(angular, constants, nsctr_constants, _){

		var appNsctr = angular.module('appNsctr');

    appNsctr.service('nsctrService',
      ['$uibModal', '$q', 'mpSpin', '$state', '$stateParams', 'httpData', 'mainServices', 'oimPrincipal',
      function($uibModal, $q, mpSpin, $state, $stateParams, httpData, mainServices,
      oimPrincipal){
      /*########################
      # fnIsManipulable
      ########################*/
      function fnIsManipulable(selectedApplications){
        var vIsManipulable = _.find(selectedApplications, function(value, key){
          return value.state == nsctr_constants.state.manipulable.description.toLowerCase();
        });
        return !!vIsManipulable;
      }
      /*########################
      # fnShowRiskList
      ########################*/
      function fnShowRiskList(spShowRisksList){
        return spShowRisksList == '1';
      }
      /*########################
      # fnIsDeclaration
      ########################*/
      function fnIsDeclaration(currentMovemenentType){
        return currentMovemenentType == nsctr_constants.movementType.declaration.code;
      }
      /*########################
      # fnIsModulo
      ########################*/
      function fnGetClassApplicationState(state){
        var vSTATE = nsctr_constants.state,
            vClass;
        switch(state.toUpperCase()){
          case vSTATE.undeclared.description:
            vClass = 'gBgcRed1';
            break;
          case vSTATE.declared.description:
            vClass = 'gBgcGreen1';
            break;
          case vSTATE.manipulable.description:
            vClass = 'gBgcGreen6';
            break;
          default:
            vClass = 'gBgcBlack1';
        }
        return vClass;
      }
      /*########################
      # fnIsModulo
      ########################*/
      function fnIsModule(module){
        var vNsctr = nsctr_constants,
            vModule = {
              regular:  (module.code == vNsctr.regular.code),
              mining:   (module.code == vNsctr.mining.code),
              lifeLaw:  (module.code == vNsctr.lifeLaw.code)
            };
        return vModule;
      }
      /*########################
      # fnConvertFormData
      ########################*/
      function fnConvertFormData(params){
        var fd = new FormData();
        angular.forEach(params, function(value, key) {
          fd.append(key, (value || ''));
        });
        return fd;
      }
      /*########################
      # fnServiceUploadPromise
      ########################*/
      function fnServiceUploadPromise(url, params, showSpin){
        var vConfig = {
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        };
        var vParams = fnConvertFormData(params);
        return httpData['post'](constants.system.api.endpoints.nsctr + url, vParams, vConfig, showSpin);
      }
      /*########################
      # fnDefaultModalOptions
      ########################*/
      function fnDefaultModalOptions(scope, options, isStatic, isTypeAlert){
        var vDefault = {
              scope: scope,
              backdrop: true, // background de fondo
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              size: 'md'
            };

        if (isStatic) {
          vDefault.backdrop = 'static';
          vDefault.keyboard = false;
        }
        if (isTypeAlert){
          vDefault.openedClass = 'g-animatedSweetAlert';
        }

        var vOptions = (angular.isObject(options))
                        ? _.merge({}, vDefault, options)
                        : vDefault;

        return vOptions;
      }
      /*########################
      # fnValidatePage
      ########################*/
      function fnValidatePage(){
        var vValidate = false,
            vCurrentState = $state.current,
            vModule = fnIsModule(vCurrentState.module);
        switch (vCurrentState.name){
          case vCurrentState.module.prefixState + 'Client':
            vValidate = $stateParams['client'] !== null;
            break;
          case vCurrentState.module.prefixState + 'Declaration.steps':
          case vCurrentState.module.prefixState + 'Inclusion.steps':
            vValidate = (vModule.mining)
                          ? $stateParams['client'] !== null && $stateParams['selectedApplicationsPolicies'] !== null && $stateParams['selectedApplications'] !== null && $stateParams['showRisksList'] !== null
                          : $stateParams['client'] !== null && $stateParams['selectedApplications'] !== null && $stateParams['showRisksList'] !== null;
            break;
          case vCurrentState.module.prefixState + 'Proofs':
            vValidate = (vModule.mining)
                        ? $stateParams['client'] !== null && $stateParams['selectedApplicationsPolicies'] !== null && $stateParams['selectedApplications'] !== null
                        : $stateParams['client'] !== null && $stateParams['selectedApplications'] !== null;
            break;
          case vCurrentState.module.prefixState + 'ReplacePayroll':
            vValidate = (vModule.mining)
                          ? $stateParams['client'] !== null && $stateParams['selectedApplicationsPolicies'] !== null && $stateParams['selectedApplications'] !== null && $stateParams['paramsReplacePayroll'] !== null
                          : $stateParams['client'] !== null && $stateParams['selectedApplications'] !== null && $stateParams['paramsReplacePayroll'] !== null;
            break;
          case vCurrentState.module.prefixState + 'InsuredMovements':
            vValidate = $stateParams['insured'] !== null;
            break;
          //MINING
          case vCurrentState.module.prefixState + 'DetailEvaluation':
            vValidate = $stateParams['evaluation'] !== null;
            break;
        }
        return vValidate;
      }
			/*########################
      # fnHtmlErrorLoadFile
      ########################*/
      function _generateList(errorList){
        var vHtml = '<div class="gnContentAuto-lg">'
        + '<ul class="g-modalErrorList">';
        angular.forEach(errorList, function(value, key) {
          vHtml += '<li>'+ value +'</li>';
        });
        vHtml += '</ul>'
          + '</div>';
        return vHtml;
      }
      function _generateTable(errorList) {
        var vHtml = '<div class="clearfix g-box g-overflow-hidden-xs">'
        + '<ul class="clearfix g-list gBgcGray5 pt-xs-1">'
        +   '<li class="col-sm-2 col-ms-2 col-xs-3 clearfix cnt-item g-text-center-xs">'
        +     '<b>Fila</b>'
        +   '</li>'
        +   '<li class="col-sm-10 col-ms-10 col-xs-9 clearfix cnt-item g-text-left-xs">'
        +     '<b>Error</b>'
        +   '</li>'
        + '</ul>'
        + '<div class="col-md-12 cnt-content g-list gnContentAuto-sm">';
        angular.forEach(errorList, function(value, index, array){
          var vValue = value.split('|'),
              vHtmlHeader = (index === array.length - 1)
                              ? '<div class="clearfix mt-xs-1">'
                              : '<div class="clearfix mt-xs-1 g-border-bottom-xs">';

              vHtml += vHtmlHeader
                +     '<ul class="row">'
                +       '<li class="col-sm-2 col-ms-2 col-xs-3 cnt-item item-dato g-text-uppercase g-text-center-xs">'
                +         vValue[0].trim()
                +       '</li>'
                +       '<li class="col-sm-10 col-ms-10 col-xs-9 cnt-item item-dato g-text-uppercase g-text-left-xs">'
                +         vValue[1].trim()
                +       '</li>'
                +      '</ul>'
                +   '</div>';
        });
        vHtml += '</div>'
            + '</div>';

        return vHtml;
      }
      function fnHtmlErrorLoadFile(errorList) {
        var vSplit = errorList[0].split('|');
        return (vSplit.length > 1)
                ? _generateTable(errorList)
                : _generateList(errorList);
      }
      /*########################
      # fnGenerateErrorTable
      ########################*/
      function fnGenerateHtmlErrorTable(design, description, errorList) {
        var vErrorTable = nsctr_constants.errorTable,
            vDesign = design || vErrorTable.et1,
            vHtml = '';

        function _htmlDescription(description) {
          var vHtml = '<div class="clearfix mb-xs-1">'+ description +'</div>';
          return vHtml;
        }

        function _htmlTableDesign1(errorList){
          var vHtml = '<div class="clearfix g-box g-overflow-hidden-xs">'
          + '<ul class="clearfix g-list gBgcGray5 pt-xs-1">'
          +   '<li class="col-md-12 clearfix cnt-item g-text-left-xs">'
          +     '<b>Descripción</b>'
          +   '</li>'
          + '</ul>'
          + '<div class="col-md-12 cnt-content g-list gnContentAuto-sm">';
          angular.forEach(errorList, function(value, index, array){
            var vHtmlHeader = (index === array.length - 1)
                                ? '<div class="clearfix mt-xs-1">'
                                : '<div class="clearfix mt-xs-1 g-border-bottom-xs">';

                vHtml += vHtmlHeader
                  +     '<ul class="row">'
                  +       '<li class="col-md-12 cnt-item item-dato g-text-uppercase g-text-left-xs">'
                  +         value
                  +       '</li>'
                  +      '</ul>'
                  +   '</div>';
          });
          vHtml += '</div>'
              + '</div>';

          return vHtml;
        }

        function _htmlTableDesign2(errorList) {
          var vHtml = '<div class="clearfix g-box g-overflow-hidden-xs">'
          + '<ul class="clearfix g-list gBgcGray5 pt-xs-1">'
          +   '<li class="col-sm-2 col-ms-2 col-xs-3 clearfix cnt-item g-text-center-xs">'
          +     '<b>Fila</b>'
          +   '</li>'
          +   '<li class="col-sm-10 col-ms-10 col-xs-9 clearfix cnt-item g-text-left-xs">'
          +     '<b>Descripción</b>'
          +   '</li>'
          + '</ul>'
          + '<div class="col-md-12 cnt-content g-list gnContentAuto-sm">';
          angular.forEach(errorList, function(value, index, array){
            var vHtmlHeader = (index === array.length - 1)
                                ? '<div class="clearfix mt-xs-1">'
                                : '<div class="clearfix mt-xs-1 g-border-bottom-xs">';

                vHtml += vHtmlHeader
                  +     '<ul class="row">'
                  +       '<li class="col-sm-2 col-ms-2 col-xs-3 cnt-item item-dato g-text-uppercase g-text-center-xs">'
                  +         value.row
                  +       '</li>'
                  +       '<li class="col-sm-10 col-ms-10 col-xs-9 cnt-item item-dato g-text-uppercase g-text-left-xs">'
                  +         value.errorDescription
                  +       '</li>'
                  +      '</ul>'
                  +   '</div>';
          });
          vHtml += '</div>'
              + '</div>';

          return vHtml;
        }

        if (description) vHtml = _htmlDescription(description);

        switch (vDesign) {
          case vErrorTable.et1:
            vHtml += _htmlTableDesign1(errorList);
            break;
          case vErrorTable.et2:
            vHtml += _htmlTableDesign2(errorList);
            break;
        }

        return vHtml;
      }
      /*########################
      # fnSearchUrlforGoogleAnalytics
      ########################*/
      function fnSearchUrlforGoogleAnalytics() {
        var textToAnalytics;
        var module = $state.current.module;
        const mpfNsctr = 'MPF - NSCTR - '
        if ($state.current.name === module.prefixState + 'SearchClient') {
          textToAnalytics = mpfNsctr + $state.current.description + ' - Procesos';
        } else if ($state.current.name == module.prefixState + 'Client') {
          textToAnalytics = mpfNsctr + $state.current.description + ' - Procesos';
        } else if ($state.current.name == module.prefixState + 'SearchInsured') {
          textToAnalytics = mpfNsctr + $state.current.description + ' - Consultas';
        } else if ($state.current.name == module.prefixState + 'InsuredMovements') {
          textToAnalytics = mpfNsctr + $state.current.description + ' - Consultas - Movimientos del asegurado';
        } else if ($state.current.name == module.prefixState + 'SearchProofs') {
          textToAnalytics = mpfNsctr + $state.current.description + ' - Consultas - Búsqueda de constancias';
        }
        return $state.current.module.appCode + ' ';
      }

      this.fnGenerateHtmlErrorTable = fnGenerateHtmlErrorTable;
      this.fnIsManipulable = fnIsManipulable;
      this.fnIsDeclaration = fnIsDeclaration;
      this.fnShowRiskList = fnShowRiskList;
      this.fnGetClassApplicationState = fnGetClassApplicationState;
      this.fnConvertFormData = fnConvertFormData;
			this.fnHtmlErrorLoadFile = fnHtmlErrorLoadFile;
      this.fnDefaultModalOptions = fnDefaultModalOptions;
      this.fnServiceUploadPromise = fnServiceUploadPromise;
      this.fnIsModule = fnIsModule;
      this.fnValidatePage = fnValidatePage;
      this.fnSearchUrlforGoogleAnalytics = fnSearchUrlforGoogleAnalytics;
		}]);

});

