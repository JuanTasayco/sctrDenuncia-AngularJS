'use strict';

define([
  'angular', 'constants', 'nsctr_constants',
  'nsctrFactoryJs', 'nsctrServiceJs', 'nsctrRolesJs'
], function(angular, constants, nsctr_constants){

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('nsctrProofsSearcherController',
    ['$rootScope', '$scope', '$state', 'mainServices', 'nsctrFactory', 'nsctrService', 'nsctrRoles',
    '$filter', '$timeout', '$stateParams', 'gaService',
    function($rootScope, $scope, $state, mainServices, nsctrFactory, nsctrService, nsctrRoles,
    $filter, $timeout, $stateParams, gaService){
      /*########################
      # _self
      ########################*/
      var _self = this;
      /*########################
      # _loadList
      ########################*/
      function _loadList(){
        if (_self.tabClient){
          _self.data.clientDocumentTypeData = _self.data.clientDocumentTypeData || nsctrFactory.common.proxyLookup.ServicesListDocumentType(_self.CONSTANTS_NSCTR.client.code, _self.MODULE.code, false);
        }
        _self.data.insuredDocumentTypeData = _self.data.insuredDocumentTypeData || nsctrFactory.common.proxyLookup.ServicesListDocumentType(_self.CONSTANTS_NSCTR.insured.code, _self.MODULE.code, false);
      }
      /*########################
      # $onInit
      ########################*/
      _self.$onInit = function(){

        _self.data = _self.data || {};
        _self.activeTab = _self.activeTab || 0;
        _self.tabClient = _self.tabClient || false;
        
        _self.CONSTANTS_NSCTR = _self.CONSTANTS_NSCTR || nsctr_constants;
        _self.MODULE = $state.current.module;
        _self.STATE_PARAMS = new nsctrFactory.object.oStateParams();
        _self.USER = new nsctrFactory.object.oUser();

        _loadList();
        var vFechaInicio = mainServices.date.fnSubtract(new Date(), 7, 'D');
        _self.data.mFechaInicioVigenciaST = new nsctrFactory.object.oDatePicker(vFechaInicio);
        _self.data.mFechaFinVigenciaST = new nsctrFactory.object.oDatePicker(new Date());
        _self.data.mNroDocumentoTT = new nsctrFactory.object.oDocumentNumber();
        _self.data.mNroDocumentoCT = new nsctrFactory.object.oDocumentNumber();

        _self.fnFilterDate = $filter('date');
        var name = (window.location.hash.split("/")[3] == "searchProofs") ? "CONSULTA_CONSTANCIAS" : "PROCESOS_CONSTANCIAS";
        var segurity = nsctrFactory.validation._filterData(JSON.parse(localStorage.getItem("nsctrSubMenu"+_self.MODULE.appCode)), name, "nombreCabecera");
          _self.seguritySearch = nsctrFactory.validation._filterData(segurity.items, "BUSCAR", "nombreCorto");
      };
      /*########################
      # fnChangeCalendar
      ########################*/
      _self.fnChangeCalendar = function(){
        _self.data.mFechaFinVigenciaST.setMinDate(_self.data.mFechaInicioVigenciaST.model);
        if (_self.data.mFechaInicioVigenciaST.model > _self.data.mFechaFinVigenciaST.model){
          _self.data.mFechaFinVigenciaST.setModel(_self.data.mFechaInicioVigenciaST.model);
        }
      };
      /*########################
      # tabProofs.fnChangeDocumentType
      ########################*/
      _self.fnChangeDocumentType = function(documentType){
        var vDocumentType = (documentType)
                              ? documentType.typeId
                              : null,
            vDocumentNumber;
        switch (_self.activeTab){
          case 3:
            vDocumentNumber = _self.data.mNroDocumentoTT;
            break;
          case 0:
            vDocumentNumber = _self.data.mNroDocumentoCT;
            break;
        }
        vDocumentNumber.setFieldsToValidate(vDocumentType);
      };
      /*########################
      # fnSearchProofs
      ########################*/
      function _validateSearchProofs(){
        switch (_self.activeTab){
          case 0:
            _self.data.frmFourthTab.markAsPristine();
            return _self.data.frmFourthTab.$valid;
            break;
          case 1:
            _self.data.frmFirstTab.markAsPristine();
            return _self.data.frmFirstTab.$valid;
            break;
          case 2:
            _self.data.frmSecondTab.markAsPristine();
            return _self.data.frmSecondTab.$valid;
            break;
          case 3:
            _self.data.frmThirdTab.markAsPristine();
            return _self.data.frmThirdTab.$valid;
            break;
        }
      }
      function _paramSearchProofs(){
        var data = {
          NSCTRSystemType       : _self.MODULE.code,
          constancyNumber       : '',
          codAseg               : '',
          documentType          : '',
          documentNumber        :'',
          fullName              : '',
          policyNumber          : '',
          receiptNumber         : '',
          startValidity         : '',
          endValidity           : '',
          clientDocumentType:   (_self.tabClient)
                                  ? ''
                                  : _self.STATE_PARAMS['client'].documentType,
          clientDocumentNumber: (_self.tabClient)
                                  ? ''
                                  : _self.STATE_PARAMS['client'].documentNumber,
          clientName            : '',
          rolCode               : _self.USER.role,
          rowByPage             : '10',
          orderBy               : ''
        };

        switch (_self.activeTab){
          case 0:
            data.clientDocumentType   = (_self.data.mTipoDocCT && _self.data.mTipoDocCT.typeId !== null)
                                            ? _self.data.mTipoDocCT.typeId
                                            : '';
            data.clientDocumentNumber = _self.data.mNroDocumentoCT.model || '';
            data.clientName           = _self.data.mRazonSocialCT || '';
            break;
          case 1:
            data.policyNumber         = _self.data.mNroPolizaPT || '';
            data.receiptNumber        = _self.data.mNroReciboPT || '0';
            break;
          case 2:
            data.constancyNumber      = _self.data.mNroConstanciaST || '';
            data.startValidity        = (_self.data.mFechaInicioVigenciaST.model)
                                          ? _self.fnFilterDate(_self.data.mFechaInicioVigenciaST.model, constants.formats.dateFormat)
                                          : '';
            data.endValidity          = (_self.data.mFechaFinVigenciaST.model)
                                          ? _self.fnFilterDate(_self.data.mFechaFinVigenciaST.model, constants.formats.dateFormat)
                                          : '';
            break;
          case 3:
            data.documentType         = (_self.data.mTipoDocTT && _self.data.mTipoDocTT.typeId !== null)
                                          ? _self.data.mTipoDocTT.typeId
                                          : '';
            data.documentNumber       = _self.data.mNroDocumentoTT.model || '';
            data.fullName             = _self.data.mNomApeAseguradoTT || '';
            break;
        };
        return data;
      }
      function _searchProofs(isPagination){
        var vParams = _paramSearchProofs();
        $rootScope.$broadcast('fnSearchProofs_searchedProofs', vParams, isPagination);
      }
      //search/pagination
      var fnSearchProofs_proofsSearcher = $rootScope.$on('fnSearchProofs_proofsSearcher', function(event, isPagination){
        _searchProofs(isPagination);
      });
      //btn
      _self.fnSearchProofs = function(){
        if (_validateSearchProofs()){
          _searchProofs(false);
        }

        var textToAnalytics = nsctrService.fnSearchUrlforGoogleAnalytics();

        var appCode = window.localStorage['appOrigin'] ? window.localStorage['appOrigin'] : 'OIM'
        gaService.add({ gaCategory: appCode + ' - NSCTR', gaAction: textToAnalytics + "Botón Buscar", gaLabel: 'Botón: Buscar', gaValue: 'Periodo Regular' });
      };
      // /*########################
      // # fnChangePageSearchProofs
      // ########################*/
      // var fnChangePageSearchProofs = $rootScope.$on('fnChangePageSearchProofs', function(event){
      //   _searchProofs(true);
      // });
      /*########################
      # fnClearSearchProofs
      ########################*/
      function _clearProofsSearcher(){
        switch (_self.activeTab){
          case 0:
            _self.data.mTipoDocCT = {
              typeId: null
            };
            _self.data.mNroDocumentoCT.setModel('');
            _self.data.mNroDocumentoCT.setFieldsToValidate(null);
            _self.data.mRazonSocialCT = '';
            break;
          case 1:
            _self.data.mNroPolizaPT = '';
            _self.data.mNroReciboPT = '';
            break;
          case 2:
            _self.data.mNroConstanciaST = '';
            _self.data.mFechaInicioVigenciaST.setModel(null);
            _self.data.mFechaInicioVigenciaST.setMinDate(null);
            _self.data.mFechaFinVigenciaST.setModel(null);
            _self.data.mFechaFinVigenciaST.setMinDate(null);
            break;
          case 3:
            _self.data.mTipoDocTT = {
              typeId: null
            };
            _self.data.mNroDocumentoTT.setModel('');
            _self.data.mNroDocumentoTT.setFieldsToValidate(null);
            _self.data.mNomApeAseguradoTT = '';
            break;
          default:
            _self.data.mNroPolizaPT = '';
            _self.data.mNroReciboPT = '';
            _self.data.mNroConstanciaST = '';
            // _self.data.mFechaInicioVigenciaST.setModel(null);
            // _self.data.mFechaInicioVigenciaST.setMinDate(null);
            // _self.data.mFechaFinVigenciaST.setModel(null);
            // _self.data.mFechaFinVigenciaST.setMinDate(null);
            _self.data.mTipoDocTT = {
              typeId: null
            };
            _self.data.mNroDocumentoTT.setModel('');
            _self.data.mNroDocumentoTT.setFieldsToValidate(null);
            _self.data.mNomApeAseguradoTT = '';
            _self.data.mTipoDocCT = {
              typeId: null
            };
            _self.data.mNroDocumentoCT.setModel('');
            _self.data.mNroDocumentoCT.setFieldsToValidate(null);
            _self.data.mRazonSocialCT = '';
        }
      }
      _self.fnClearSearchProofs = function(){
        _clearProofsSearcher();
        $rootScope.$broadcast('fnClearSearchedProofs_searchedProofs');
      }
      /*#######################
      # DESTROY_EVENTS
      #######################*/
      $scope.$on('$destroy', function(){
        fnSearchProofs_proofsSearcher();
        // fnChangePageSearchProofs();
      });


  }]).component('nsctrProofsSearcher',{
    templateUrl: '/nsctr/app/common/components/proofsSearcher/proofsSearcher.component.html',
    controller: 'nsctrProofsSearcherController',
    bindings: {
      mainData: '=?',
      data: '=?',
      activeTab: '=?',
      tabClient: '=?'
    }
  });
});