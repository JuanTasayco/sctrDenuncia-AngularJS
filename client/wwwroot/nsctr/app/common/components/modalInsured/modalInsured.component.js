'use strict';

define([
  'angular', 'constants', 'nsctr_constants',
  'nsctrFactoryJs', 'nsctrServiceJs'
], function(angular, constants, nsctr_constants){

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('nsctrModalInsuredController',
    ['$scope', '$window', '$state', '$stateParams', 'mainServices', 'nsctrFactory', 'nsctrService',
    'oimPrincipal', 'mModalAlert',
    function($scope, $window, $state, $stateParams, mainServices, nsctrFactory, nsctrService,
    oimPrincipal, mModalAlert){
    /*########################
    # _self
    ########################*/
    var _self = this;
    /*########################
    # _clearVigencias
    ########################*/
    function _clearVigencias(){
      _self.data.mVigenciaInicioFin = {id: null};
      _self.data.vigenciaStartEndData = [];
    }
    /*########################
    # _clearMainSelect
    ########################*/
    function _clearMainSelect(){
      _self.data.mPolizaPensionSalud = {idDescription: null};
      _clearVigencias();
    }
    /*########################
    # _isInvoicedInsured
    ########################*/
    function _isInvoicedInsured(isInvoiced){
      return (nsctr_constants.state.invoiced.code == isInvoiced);
    }
    /*########################
    # _stateInsured
    ########################*/
    function _stateInsured(state){
      var vState = {
        up:   _self.STATE.up.description == state,
        down: _self.STATE.down.description == state,
      };
      return vState;
    }
    /*########################
    # _setInsured
    ########################*/
    function _setInsured(data){
      if (data){
        _self.SHOW_BUTTON_STATE = true;
        _self.data.mTipoDoc = {
          typeId : data.documentType
        };
        _self.IS_INVOICED_INSURED = _isInvoicedInsured(data.invoiced);
        _self.dataInsuredOld = angular.copy(data);
      }else{
        data = {};
        _self.SHOW_BUTTON_STATE = false;
        _self.dataInsuredOld = null;
        _self.data.mTipoDoc = undefined; //De esta manera se evita el errorMessage(seleccione un tipo de documento) cuando se obtiene el asegurado y luego se limpia al volver a cargar el popup
      }
      _self.data.mNroDocumento.setModel(data.documentNumber || '');
      var vDocumentType = (_self.data.mTipoDoc)
                            ? _self.data.mTipoDoc.typeId
                            : null;
      _self.data.mNroDocumento.setFieldsToValidate(vDocumentType);

      _self.data.mSueldo = data.salary || '';
      _self.data.mApePaterno = data.lastName || data.fathersSurname || '';
      _self.data.mApeMaterno = data.lastMotherName || data.mothersSurname || '';
      _self.data.mNombre = data.name || '';
      _self.data.mNombreCompleto = data.fullName || '';
      _self.data.mOpcionEstado = data.state || '';
      _self.STATE_INSURED = _stateInsured(_self.data.mOpcionEstado);

      var vBirthDate = data.birthDate || data.birthday || '';
      _self.data.mFechaNacimiento.setModel(vBirthDate);
      _self.data.mOcupacion = data.occupation || '';
    }
    /*########################
    # $onInit
    ########################*/
    _self.$onInit = function(){

      _self.MODULE = $state.current.module;
      var segurity = nsctrFactory.validation._filterData(JSON.parse(localStorage.getItem("nsctrSubMenu"+_self.MODULE.appCode)), "PROCESOS_PLANILLA", "nombreCabecera");
      _self.segurityActTrabajador = window.location.hash.split("/")[3] != 'searchInsured' ? nsctrFactory.validation._filterData(segurity.items, "ACTUALIZAR_DAT_TRABAJADOR", "nombreCorto") : true;
      _self.constants = _self.constants || {};
      _self.mainData = _self.mainData || {};
      _self.data = _self.data || {};

      _self.MODULE = $state.current.module;
      _self.IS_MODULE = nsctrService.fnIsModule(_self.MODULE);
      _self.STATE_PARAMS = new nsctrFactory.object.oStateParams();
      _self.USER = new nsctrFactory.object.oUser();

      _self.STATE = nsctr_constants.state;

      _self.data.mNroDocumento = new nsctrFactory.object.oDocumentNumber(1);
      var vAdult = mainServices.date.fnSubtract(new Date(), 18, 'Y');
      _self.data.mFechaNacimiento = new nsctrFactory.object.oDatePicker(null, {initDate: vAdult, maxDate: vAdult}, {maxDate:vAdult});

      _clearMainSelect();
      _self.data.documentTypeData = _self.data.documentTypeData || nsctrFactory.common.proxyLookup.ServicesListDocumentType(nsctr_constants.insured.code, _self.MODULE.code, true);
      _setInsured();

      if (_self.showSelects){
        _getPolicies();
      }else{
        _setInsured(_self.mainData.insured);
      }

      if(_self.STATE_INSURED.up){
        _self.segurityDarBaja = window.location.hash.split("/")[3] != 'searchInsured' ? nsctrFactory.validation._filterData(segurity.items, "BAJA_TRABAJADOR", "nombreCorto") : true;
      } else {
        _self.segurityDarBaja = window.location.hash.split("/")[3] != 'searchInsured' ? nsctrFactory.validation._filterData(segurity.items, "HABILITAR_TRABAJADOR", "nombreCorto") : true;
      }
      _self.segurityActualizar = window.location.hash.split("/")[3] != 'searchInsured' ? nsctrFactory.validation._filterData(segurity.items, "ACTUALIZAR_TRABAJADOR", "nombreCorto") : true;
    };
    /*#########################
    # _actionButton
    #########################*/
    function _actionButton(action){
      // actions:
      // 0 = cancel
      // 1 = updateInsured
      // 2 = up
      // 3 = down
      $scope.$emit('fnActionButton_modalInsured', action);
    }
    /*#########################
    # fnCancelModal
    #########################*/
    _self.fnCancelModal = function(){
      _actionButton(0);
    };
    /*#########################
    # _getPolicies
    #########################*/
    function _paramsMainSelect(policy){
      var vInsured = _self.mainData.insured,
          vParams = {
            NSCTRSystemType:  _self.MODULE.code,
            documentType:     vInsured.documentType || '',
            documentNumber:   vInsured.documentNumber || '',
            showSpin:         true
          };
      if (policy){
        vParams.policyNumber = policy.idDescription;
      }else{
        vParams.constancyNumber = '0';
      }
      return vParams;
    }
    function _getPolicies(){
      var vParams = _paramsMainSelect();
      _self.data.pensionHealthPolicyData = nsctrFactory.common.proxyLookup.ServicesPoliciesByInsured(vParams.NSCTRSystemType, vParams.constancyNumber, vParams.documentType, vParams.documentNumber, vParams.showSpin);
    }
    /*#########################
    # getVigencias
    #########################*/
    _self.fnGetVigencias = function(policy){
      _clearVigencias();
      if (policy){
        var vParams = _paramsMainSelect(policy);
        _self.data.vigenciaStartEndData = nsctrFactory.common.proxyLookup.ServicesValiditiesByPolicy(vParams.NSCTRSystemType, vParams.policyNumber, vParams.documentType, vParams.documentNumber, vParams.showSpin);
      }
    };
    /*#########################
    # getInsured
    #########################*/
    function _getApplicationsSelected(showSelects) {
      var vApplications = { pension: {}, health: {}, vigencia: {} };

      if (showSelects) {
        vApplications = [
          _self.data.mPolizaPensionSalud.idDescription.split('-'),
          _self.data.mVigenciaInicioFin.description.split(' ')
        ].reduce(function(previous, current, index) {
          if (index > 0) {
            previous.vigencia.policyDateStart = current[1].trim();
            previous.vigencia.policyDateEnd = current[3].trim();
          } else {
            previous.pension.policyNumber = current[0].trim();
            previous.health.policyNumber = current[1].trim();
          }

          return previous;
        }, vApplications);

      } else {
        vApplications = _self.STATE_PARAMS['selectedApplications'].reduce(function(previous, current) {
            var vKeyApplication = (current.applicationType == nsctr_constants.pension.code)
                                    ? 'pension'
                                    : 'health';
            previous[vKeyApplication] = current;

            return previous;
          }, vApplications);
      }

      return vApplications;
    }

    function _paramsGetInsured(){
      var vApplicationsSelected = _getApplicationsSelected(_self.showSelects),
          vInsured = _self.mainData.insured,
          vParams = {
            NSCTRSystemType:      _self.MODULE.code,
            pensionPolicyNumber : vApplicationsSelected['pension'].policyNumber,
            healthPolicyNumber :  vApplicationsSelected['health'].policyNumber,
            dateStartValidity :   vApplicationsSelected['vigencia'].policyDateStart,
            dateEndValidity :     vApplicationsSelected['vigencia'].policyDateEnd,
            documentType :        vInsured.documentType,
            documentNumber :      vInsured.documentNumber
          };
      return vParams;
    }
    _self.fnGetInsured = function(){
      _setInsured();
      if (_self.data.mVigenciaInicioFin){
        var vParams = _paramsGetInsured();
        nsctrFactory.common.proxyInsured.ServicesInsuredByPolicyAndValidity(vParams, true).then(function(response){
          if (response.operationCode == constants.operationCode.success){
            var vData = response.data || response.Data;
            if (vData){
              _setInsured(vData);
            }
          }
        }, function(error){
          // console.log('error');
        });
      }
    };
    /*########################
    # funDocNumMaxLength
    ########################*/
    _self.fnChangeDocumentType = function(documentType){
      var vDocumentType = (documentType)
                            ? documentType.typeId
                            : null;
      _self.data.mNroDocumento.setFieldsToValidate(vDocumentType);
    }
    /*#########################
    # fnActionbutton
    #########################*/
    function _validateForm(){
      $scope.frmInsured.markAsPristine();
      return $scope.frmInsured.$valid;
    }
    function _paramActionInsured(action){
      var vApplicationsSelected = _getApplicationsSelected(_self.showSelects),
          vInsured = _self.mainData.insured,
          vParams = {
            NSCTRSystemType:                          _self.MODULE.code,
            newDocumentNumber:                        _self.data.mNroDocumento.model,
            newDocumentType:                          _self.data.mTipoDoc.typeId,
            documentNumber:                           _self.dataInsuredOld.documentNumber,
            documentType:                             _self.dataInsuredOld.documentType,
            salary:                                   _self.data.mSueldo || '0',
            healthSalary:                             _self.data.nSueldoSalud || '0',
            lastName:                                 _self.data.mApePaterno || '',
            lastMotherName:                           _self.data.mApeMaterno || '',
            name:                                     _self.data.mNombre || '',
            fullName:                                 _self.data.mNombreCompleto || '',
            birthDate:                                _self.data.mFechaNacimiento.model || '',
            occupation:                               _self.data.mOcupacion || '',
            application:                              _self.data.mVigenciaInicioFin.id || '',
            user:                                     _self.USER.name,
            clientDocument:                           _self.dataInsuredOld.clientDocumentNumber || _self.STATE_PARAMS['client'].documentNumber, //_self.data.clientDocumentNumber,
            flgAction:                                action,
            ShowSystemPoliciesExpirationDropdowns:    _self.showSelects,
            Invoiced:                                 vInsured.invoiced || _self.dataInsuredOld.invoiced, //_getDataInsured().invoiced => se envia el parametro desde la planilla(constancias) | _self.dataInsuredOld.invoiced => se obtiene en el fnGetInsured //'S'
            RoleCode:                                 _self.USER.role,
            pensionApplicationPolicyNumber:           vApplicationsSelected['pension'].policyNumber || '0',
            pensionApplicationStartDate:              vApplicationsSelected['vigencia'].policyDateStart || vApplicationsSelected['pension'].policyDateStart,
            pensionApplicationEndDate:                vApplicationsSelected['vigencia'].policyDateEnd || vApplicationsSelected['pension'].policyDateEnd,
            PensionApplicationPolicyCiaCode:          vApplicationsSelected['pension'].ciaId || '',
            PensionApplicationPolicySptoNumber:       vApplicationsSelected['pension'].sptoNumber || '',
            PensionApplicationPolicyAplicationNumber: vApplicationsSelected['pension'].aplicationNumber || '',
            healthApplicationPolicyNumber:            vApplicationsSelected['health'].policyNumber || '0',
            healthApplicationStartDate:               vApplicationsSelected['vigencia'].policyDateStart || vApplicationsSelected['health'].policyDateStart,
            healthApplicationEndDate:                 vApplicationsSelected['vigencia'].policyDateEnd || vApplicationsSelected['health'].policyDateEnd,
            HealthApplicationPolicyCiaCode:           vApplicationsSelected['health'].ciaId || '',
            HealthApplicationPolicySptoNumber:        vApplicationsSelected['health'].sptoNumber || '',
            HealthApplicationPolicyAplicationNumber:  vApplicationsSelected['health'].aplicationNumber || '',
            PensionDeclarationType:                   vApplicationsSelected['pension'].declarationType || '',
            HealthDeclarationType:                    vApplicationsSelected['health'].declarationType || '',
            State:                                    _self.STATE_INSURED.up ? 'A' : 'B'
          };
      return vParams;
    }
    //NINGUN CAMPO ES REQUERIDO
    $scope.fnActionButton = function(action){
      if (_validateForm()){
        var vParams = _paramActionInsured(action);
        var vMessage = [null, 'Se actualizaron los datos del asegurado', 'Se dio de baja al asegurado', 'Se dio de alta al asegurado'];
        nsctrFactory.common.proxyInsured.ServicesInsuredUpdate(vParams, true).then(function(response){
          if (response.operationCode == constants.operationCode.success){
            mModalAlert.showSuccess(vMessage[action], '').then(function(alert){
              _actionButton(action);
            });
          }else{
            mModalAlert.showError(response.message, 'Error');
          }
        }, function(error){
          mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
        });
      }
    }

  }]).component('nsctrModalInsured',{
    templateUrl: '/nsctr/app/common/components/modalInsured/modalInsured.component.html',
    controller: 'nsctrModalInsuredController',
    bindings: {
      showSelects:  '=?',
      constants:    '=?',
      mainData:     '=?',
      data:         '=?'
    }
  });

});
