'use strict';

define([
	'angular', 'constants', 'nsctr_constants', 'lodash',
	'nsctrFactoryJs'
], function(angular, constants, nsctr_constants, _){

	var appNsctr = angular.module('appNsctr');

	appNsctr.controller('nsctrModalSendEmailFilesController',
		['$scope', '$window', '$state', 'nsctrFactory', 'mModalAlert',
		function($scope, $window, $state, nsctrFactory, mModalAlert){
			/*########################
      # _self
      ########################*/
			var _self = this;
      /*########################
      # $onInit
      ########################*/
      _self.$onInit = function(){

      	_self.mainData = _self.mainData || {};
				_self.data = _self.data || {};

				_self.data.paramsSendEmail = angular.copy(_self.mainData.paramsSendEmail);

      };
      /*#########################
	    # fnCloseModal
	    #########################*/
			_self.fnCloseModal = function(actionButton){
        if (!actionButton) actionButton = constants.actionButton.cancel;
        $scope.$emit('fnCloseModal_modalSendEmailFiles', actionButton);
      };
			/*#########################
			# deleteFile
			#########################*/
			_self.fnDeleteFile = function(item, indexItem, indexFile){
				item.fileList.splice(indexFile, 1);
				if (!item.fileList.length) {
					var vFileList = _self.data.paramsSendEmail.fileList;
					vFileList.splice(indexItem, 1);
				}
			}
			/*#########################
			# sendEmailFiles
			#########################*/
			function _validateForm(){
				$scope.frmSendEmailFiles.markAsPristine();
				return $scope.frmSendEmailFiles.$valid;
			}
			function _paramSendEmailFiles(){
				function _getFileDocument(){
					var vFileDocument = [];
					angular.forEach(_self.data.paramsSendEmail.fileList, function(elem, key){
						if(elem && elem.fileList[key] && elem.fileList[key].contancyNumber){
							elem.fileList[key].contancyNumber = _self.mainData.constancyNumber;
						}

						angular.forEach(elem.fileList, function(elemFile, keyFile){
							if(elemFile.description == 'Poliza'){
								elemFile.ciaId = _self.data.paramsSendEmail.listPolicy[0].ciaId;
								elemFile.sptoNumber = _self.data.paramsSendEmail.listPolicy[0].sptoNumber;
								elemFile.aplicationNumber = _self.data.paramsSendEmail.listPolicy[0].applicationNumber;
								elemFile.sptoApliNumber = _self.data.paramsSendEmail.listPolicy[0].sptoApliNumber;
							}
						});

						vFileDocument = vFileDocument.concat(elem.fileList);
					});
					return vFileDocument;
				}
				var vParams = [
					{
						email 				: _self.data.mPara,
						subject 			: _self.data.mAsunto,
						bodyMessage 	: _self.data.mComentario || '',
						clientName 		: _self.data.paramsSendEmail.clientName || '',
						fileDocument 	: _getFileDocument(),
						contancyNumber : _self.mainData.constancyNumber,
						codigoAgente : _self.data.paramsSendEmail.codAgt,
					}
				];
				return vParams;
			}
			_self.fnSendEmailFiles = function(){
				if (_validateForm()){
					var vMessage = 'El email ha sido enviado ' + '<b>' + _self.data.mPara + '</b>',
							vParams = _paramSendEmailFiles();
					nsctrFactory.common.proxyConstancy.ServicesSendMailReceiptConstancies(vParams, true).then(function(response){
						if (response.operationCode == constants.operationCode.success){
							_self.fnCloseModal(constants.actionButton.acept);
							mModalAlert.showSuccess(vMessage, '', null, 2000);
						}else{
							mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
						}
					}, function(error){
						mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
					});
				}
			}

	}]).component('nsctrModalSendEmailFiles',{
		templateUrl: '/nsctr/app/common/components/modalSendEmailFiles/modalSendEmailFiles.component.html',
		controller: 'nsctrModalSendEmailFilesController',
		bindings: {
			mainData: '=?',
			data: '=?'
		}
	})


});
