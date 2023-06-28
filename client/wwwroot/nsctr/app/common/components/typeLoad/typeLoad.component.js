'use strict';

define([
	'angular', 'constants', 'nsctr_constants',
  'nsctrFactoryJs', 'nsctrServiceJs'
], function(angular, constants, nsctr_constants){

	var appNsctr = angular.module('appNsctr');

	appNsctr.controller('nsctrTypeLoadController',
		['$scope', '$window', '$state', 'mainServices', 'nsctrFactory', 'nsctrService',
    'mModalAlert', 'mModalConfirm', '$timeout',
		function($scope, $window, $state, mainServices, nsctrFactory, nsctrService,
      mModalAlert, mModalConfirm, $timeout){
      /*########################
      # _self
      ########################*/
			var _self = this;
      /*########################
      # _loadList
      ########################*/
      function _loadList(){
        _self.replacePayroll.documentTypeData = _self.replacePayroll.documentTypeData || nsctrFactory.common.proxyLookup.ServicesListDocumentType(nsctr_constants.insured.code, _self.MODULE.code, true);
          var PolicyNumber =  _self.data.itemsApplication  ?  _self.data.itemsApplication[0].applicationPolicyNumber : ''
          nsctrFactory.common.proxyGenerateDeclarationPre.GetRiskTypeList(PolicyNumber).then(function (response) {
            _self.replacePayroll.typeRiego = response
          });
      }
      /*########################
      # $onInit
      ########################*/
			(function onLoad(){

        _self.data = _self.data || {};

        _self.replacePayroll = _self.data.replacePayroll || {};
        _self.data.replacePayroll = _self.replacePayroll; //asigno el component a data

        _self.MODULE = $state.current.module;

        _self.replacePayroll.TYPE_LOAD = _self.replacePayroll.TYPE_LOAD || nsctr_constants.typeLoad;
        _self.replacePayroll.ADD_ROWS = _self.replacePayroll.ADD_ROWS || 'AR';
        _self.replacePayroll.MAX_NUM_WORKERS = _self.replacePayroll.MAX_NUM_WORKERS ||10;
        _self.replacePayroll.ADULT = _self.replacePayroll.ADULT || mainServices.date.fnSubtract(new Date(), 18, 'Y');

        _self.replacePayroll.tabPayroll = _self.replacePayroll.tabPayroll || _self.replacePayroll.TYPE_LOAD.massive.code; // 1 o M => massive // 2 o I => individual
        _self.replacePayroll.selectMassiveLoad = (typeof _self.replacePayroll.selectMassiveLoad == 'undefined')
                                                    ? true
                                                    : _self.replacePayroll.selectMassiveLoad;
        _self.replacePayroll.errorAttachFile = _self.replacePayroll.errorAttachFile || false;


        _loadList();

			})();
      /*########################
      # fnDownloadTemplateInsured
      ########################*/
      _self.replacePayroll.fnDownloadTemplateInsured = function(){
        nsctrFactory.common.proxyLookupFiles.CSServicesTemplateExcel(_self.MODULE);
      }
      /*######################
      # clickTabPayroll
      ######################*/
      function _validateRisks(newTab){
        return _self.data.fnValidateRisks(newTab);
      }
      _self.replacePayroll.fnClickTabPayroll = function(newTab){
        if (_self.replacePayroll.tabPayroll !== newTab){
          _self.replacePayroll.selectMassiveLoad = true;
          _self.replacePayroll.errorAttachFile = false;
          _self.replacePayroll.itemWorkers = [];

          if (_self.replacePayroll.TYPE_LOAD.individual.code == newTab){
            if (_self.withNumberWorkers){
              var vValidateRisks = _validateRisks(newTab);
              //aca declaramos que muestre un item por defecto
              vValidateRisks.numberWorkers = 1
              if(vValidateRisks.validate){
                _createPayRoll(_self.withNumberWorkers, vValidateRisks.numberWorkers);
              }else{
                  newTab = _self.replacePayroll.TYPE_LOAD.massive.code;
                }
              }else{
                $scope.fnAddRow();
              }
          }

          _self.replacePayroll.tabPayroll = newTab;
        }
      };
      function _createPayRoll(withNumberWorkers, numberWorkers){
        var vItemWorkers = _self.replacePayroll.itemWorkers;
        if (withNumberWorkers){
          if (vItemWorkers.length > 0){
              var vIni = vItemWorkers.length;
              for (var i = vIni; i < vIni + 1; i++) {
                _addRow(i);
              }
          }else{
            for (var i = 0; i < numberWorkers; i++) {
              _addRow(i);
            }
          }
        }
      }

      $scope.fnActiveTabPayroll = function(tabNumber){
        return _self.replacePayroll.tabPayroll === tabNumber;
      };
      /*######################
      # IndividualLoad
      ######################*/
      $scope.fnDeleteItemWorker = function(index){
        mModalConfirm.confirmInfo('¿Esta seguro que desea eliminar el registro?','ELIMINAR', 'ELIMINAR').then(function(response){
          if (response) {
            $timeout(function(){
              _self.replacePayroll.itemWorkers.splice(index, 1);
              if (_self.replacePayroll.itemWorkers.length == 0) _self.replacePayroll.tabPayroll = _self.replacePayroll.TYPE_LOAD.massive.code;
            }, 0);
          }
        });
      }
      $scope.fnChangeDocumentType = function(item){
        var vDocumentType = (item.mTipoDocumento)
                              ? item.mTipoDocumento.typeId
                              : null;
         item.mNroDocumento.setFieldsToValidate(vDocumentType);
      }
      /*######################
      # MassiveLoad
      ######################*/
      $scope.fnValidateRisks = function(){
        if (_self.withNumberWorkers){
          var vValidateRisks = _validateRisks(_self.replacePayroll.tabPayroll);
          if(!vValidateRisks.validate){
            if (event) {
              event.preventDefault();
              event.stopPropagation();
            }
          }
        }
      }
      $scope.fnChangeLoadFile = function(event){
        $timeout(function(){
          var vFile = _self.replacePayroll.fmImportarPlanilla || {};
          _self.replacePayroll.nameMassiveLoad = vFile[0].name;
          _self.replacePayroll.selectMassiveLoad = false;
        }, 0);
      }
      /*######################
      # fnValidate
      ######################*/
      function _validateMassiveLoad(){
        var vValidate = _self.replacePayroll.selectMassiveLoad;
        _self.replacePayroll.errorAttachFile = vValidate;
        return !vValidate;
      }
      function _validateIndividualLoad(){
        $scope.frmTypeLoad.markAsPristine();
        return $scope.frmTypeLoad.$valid;
      }
      _self.replacePayroll.fnValidate = function(option){
        var vValidate = (_self.replacePayroll.TYPE_LOAD.massive.code == option)
                          ? _validateMassiveLoad()
                          : _validateIndividualLoad();
        return vValidate;
      }

      function _addRow(index){
        _self.replacePayroll.itemWorkers[index] = {};
        var vWorker = _self.replacePayroll.itemWorkers[index],
            vBirthDate = {
              options: {
                initDate: _self.replacePayroll.ADULT,
                maxDate: _self.replacePayroll.ADULT
              },
              validate: {
                maxDate:_self.replacePayroll.ADULT
              }
            };
        vWorker.mFechaNacimiento = new nsctrFactory.object.oDatePicker(null, vBirthDate.options, vBirthDate.validate);
        vWorker.mNroDocumento = new nsctrFactory.object.oDocumentNumber();
      }

      $scope.fnAddRow = function(){
        if (_self.withNumberWorkers){
          var vValidateRisks = _validateRisks(_self.replacePayroll.ADD_ROWS);
          if(vValidateRisks.validate){
            _createPayRoll(_self.withNumberWorkers, vValidateRisks.numberWorkers);
          }
        }else{
          var vItemWorkers = _self.replacePayroll.itemWorkers || [];
          if (vItemWorkers.length < _self.replacePayroll.MAX_NUM_WORKERS){
            _addRow(vItemWorkers.length);
          }
        }
      }


	}]).component('nsctrTypeLoad',{
    templateUrl: function($state, $element, $attrs) {
      var vCurrentModule = $state.current.module;
      return '/nsctr/app/common/components/typeLoad/' + vCurrentModule.prefixState + '.component.html';
    },
		controller: 'nsctrTypeLoadController',
		bindings: {
			data: '=',
      withNumberWorkers: '=?'
		}
	}).directive('customOnClick', function() {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var fnOnClick = scope.$eval(attrs.customOnClick);
        element.bind('click', fnOnClick);
      }
    };
  })




});
