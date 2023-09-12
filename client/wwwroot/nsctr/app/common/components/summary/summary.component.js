'use strict';

define([
  'angular', 'constants', 'nsctr_constants',
  'nsctrFactoryJs', 'nsctrServiceJs', 'nsctrRolesJs',
  'nsctrModalSendEmailFilesJs',
  'nsctrRiskPremiumTableJs'
], function(angular, constants, nsctr_constants){

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('nsctrSummaryController',
    ['$scope', 'mainServices', 'nsctrFactory', 'nsctrService', '$state', '$uibModal', 'gaService','$attrs','$stateParams',
    function($scope, mainServices, nsctrFactory, nsctrService, $state, $uibModal, gaService,$attrs,$stateParams){
      /*########################
      # _self
      ########################*/
      var _self = this;
      /*#########################
      # _getConstancySummary
      #########################*/
      function _getConstancySummary(idProof, userRole, module){
        nsctrFactory.common.proxyDeclarationSummary.GetConstancySummary(idProof, userRole, module, true).then(function(response){
          if (response.operationCode == constants.operationCode.success) {
            _self.data.summary = response.data.reduce(function(previous, current, index) {
              if (!index) {
                previous = current;
                previous.titleClientType = mainServices.fnShowNaturalRucPerson(previous.clientDocumentType, previous.clientDocumentNumber)
                                            ? 'Nombre:'
                                            : 'Razón Social:';
              } else {
                previous.listFiles = previous.listFiles.concat(current.listFiles);
              }
              return previous;
            }, {});
          }
        });
      }
      /*########################
      # $onInit
      ########################*/
      _self.$onInit = function(){
        var textToAnalytics = nsctrService.fnSearchUrlforGoogleAnalytics();
        setTimeout(function () {
          var appCode = window.localStorage['appOrigin'] ? window.localStorage['appOrigin'] : 'OIM'
          gaService.add({ gaCategory: appCode + ' - NSCTR', gaAction: textToAnalytics + '- Vista Reporte de Constancia ', gaLabel: 'Botón: Listar Reporte' });
        }, 100);
        _self.data = _self.data || {};
        console.log($stateParams);
        if($attrs.movementType == nsctr_constants.movementType.declaration.code) {
          _self.title = "Declaración"
        }
        if($attrs.movementType == nsctr_constants.movementType.exclusion.code) {
          _self.title = "Exclusión"
        }

        _self.MODULE = $state.current.module;
        _self.IS_MODULE = nsctrService.fnIsModule(_self.MODULE);

        _self.STATE_PARAMS = new nsctrFactory.object.oStateParams();
        _self.USER = new nsctrFactory.object.oUser();

        _self.CURRENCY_TYPE = constants.currencyType;

        _getConstancySummary(_self.STATE_PARAMS.idProof, _self.USER.role, _self.MODULE.code);
      };
      /*########################
      # fnGoClient
      ########################*/
      _self.fnGoClient = function(){
        var vState = _self.MODULE.prefixState + 'Client';
        $state.go(vState, {
          client: _self.STATE_PARAMS.client
        });
      }

      _self.fnInTechnicalControl = function(number) {
        return number === '-1';
      };
      
      _self.fnDownloadReceipt = function (receiptNumber , typeReceipt) {
        nsctrFactory.common.proxyPolicy.ServicesDownloadReceipt(typeReceipt, receiptNumber, true).then(function (response) {
          mainServices.fnDownloadFileBase64(response.data, "pdf", 'Recibo_' + receiptNumber, false);
        });
      }

      _self.fnInTechnicalControlSegurity = function(item) {
        console.log(localStorage.getItem('typeName'));
        var segurity = nsctrFactory.validation._filterData(JSON.parse(localStorage.getItem("nsctrSubMenu"+_self.MODULE.appCode)), localStorage.getItem('typeName'), "nombreCabecera");

        if((item.type == "P" || item.type == "S") && item.isEnabled == "S") return nsctrFactory.validation._filterData(segurity.items, "DESCARGAR_RECIBO", "nombreCorto");
        if((item.type == "P" || item.type == "S") && (item.isEnabled == "N" || item.isEnabled == null)) return nsctrFactory.validation._filterData(segurity.items, "DESCARGAR_RECIBO_ANULADO", "nombreCorto");
        if(item.type == "C" && item.isEnabled == "S") return nsctrFactory.validation._filterData(segurity.items, "DESCARGAR_CONSTANCIA", "nombreCorto");
        if(item.type == "C" && (item.isEnabled == "N" || item.isEnabled == null)) return nsctrFactory.validation._filterData(segurity.items, "DESCARGAR_CONSTANCIA_ANULADA", "nombreCorto");
       
        if(item.type == "CER") return nsctrFactory.validation._filterData(segurity.items, "DESCARGAR_CERTIFICADO", "nombreCorto");
        if(item.type == "CRT") return nsctrFactory.validation._filterData(segurity.items, "DESCARGAR_CARTA", "nombreCorto");
        if(item.type == "CRG") return nsctrFactory.validation._filterData(segurity.items, "DESCARGAR_CARGO", "nombreCorto");
        
      };

      /*########################
      # fnSendEmail
      ########################*/
      function _paramsSendEmail(){
        var vParams = {
          clientName  : _self.data.summary.clientName || '',
          fileList    : [
            {
              proofNumber : _self.data.summary.constancyNumber,
              fileList    : _self.data.summary.listFiles
            }
          ]
        };
        return vParams;
      }

      _self.fnShowSendEmail = function(){
        _self.modalSendEmailFiles = {
          mainData: {
            paramsSendEmail: _paramsSendEmail(),
            constancyNumber : _self.STATE_PARAMS.idProof
          },
          data:{}
        };
        var vOptModal = nsctrService.fnDefaultModalOptions($scope,{
                          template: '<nsctr-modal-send-email-files main-data="$ctrl.modalSendEmailFiles.mainData" data="$ctrl.modalSendEmailFiles.data" constancy"$ctrl.STATE_PARAMS.idProof"></nsctr-modal-send-email-files>'
                        });
        vOptModal.controller = ['$scope', '$uibModalInstance', '$uibModal',
          function($scope, $uibModalInstance, $uibModal){
            /*########################
            # fnCloseModal_modalSendEmailFiles
            ########################*/
            $scope.$on('fnCloseModal_modalSendEmailFiles', function(event, actionButton){
              if (actionButton == constants.actionButton.cancel) {
                $uibModalInstance.dismiss('cancel');
              } else {
                $uibModalInstance.close(actionButton);
              }
            });
        }];

        $uibModal.open(vOptModal);
      }
      _self.fnDescargarConstancia = function(){
        nsctrFactory.common.proxyConstancy.ServicesDownloadConstancy(_self.STATE_PARAMS.idProof,true).then(function (response) {
          mainServices.fnDownloadFileBase64(response.data, "pdf",'Contancia_' + _self.STATE_PARAMS.idProof, false);
        })
      }

  }]).component('nsctrSummary',{
    templateUrl: function($state, $element, $attrs) {
      var vTemplate = ($attrs.movementType == nsctr_constants.movementType.declaration.code || $attrs.movementType == nsctr_constants.movementType.exclusion.code)
                  ? 'declaration'
                  : 'inclusion';
      return '/nsctr/app/common/components/summary/' + vTemplate + '.component.html';
    },
    controller: 'nsctrSummaryController',
    bindings: {
      movementType: '='
    }
  });
});