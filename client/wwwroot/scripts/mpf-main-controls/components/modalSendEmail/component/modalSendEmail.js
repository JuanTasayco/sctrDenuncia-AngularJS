'use strict';

define([
    'angular', 'constants',
    '/scripts/mpf-main-controls/components/modalSendEmail/service/modalSendEmailFactory.js'
], function(angular, constants) {

angular.module('mapfre.controls')
    .controller('ctrlModalSendEmail',
      ['$scope', '$window', '$state', 'modalSendEmailFactory', 'mpSpin', '$timeout', 'oimPrincipal',
      function($scope, $window, $state, modalSendEmailFactory, mpSpin, $timeout, oimPrincipal) {
        var _self = this;

        _self.mAsunto = (_self.data && _self.data.asunto) || '';
        _self.mPara = '';
        _self.mComentario = '';
        _self.message = false;
        _self.showMessageError = false;
        _self.disabledAsunto = !!(_self.data && _self.data.disabledAsunto);

        //Funcion para busca el objeto
        _self.modalSendEmail = _.find(constants.modalSendEmail, function(item) {
            if ((typeof _self.action.action == 'undefined')) {
                return item.action == _self.action;
            } else {
                return item.action == _self.action.action;
            }
        });

        _self.sendEmail = function() {
            $scope.frmSendMail.markAsPristine();
            if ($scope.validationForm()) {

                var vdataSendEmail = {};

                if(oimPrincipal.get_role().toUpperCase() == "AGTDIG"){
                    vdataSendEmail = {
                        reporteParamSoat: _self.data,
                        emisor:  "",
                        nombreEmisor: "",
                        asunto: _self.mAsunto,
                        receptor: _self.mPara,
                        mensaje: _self.mComentario
                    };
                } else {
                    vdataSendEmail = _self.data;
                    vdataSendEmail.asunto = _self.mAsunto;
                    vdataSendEmail.receptor = _self.mPara;
                    vdataSendEmail.MailTo = _self.mPara;
                    vdataSendEmail.mensaje = _self.mComentario;
                };

                send(vdataSendEmail);
            }
        }

        $scope.validationForm = function() {
            return $scope.frmSendMail.$valid && !$scope.frmSendMail.$pristine;
        };

        function send(vdataSendEmail) {
            if(vdataSendEmail.emisionVidaLey){
                vdataSendEmail.asunto = _self.mAsunto;
                vdataSendEmail.receptor = _self.mPara;
                vdataSendEmail.correos = _self.mPara;
                vdataSendEmail.comentario = _self.mComentario;
                vdataSendEmail.documentos = _getDocumentos();
            }
          _self.showMessageError = false;
            mpSpin.start();
                modalSendEmailFactory.sendEmail(_self.action, vdataSendEmail).then(function(response) {
                    var rp = response.data || response;
                    if ((rp.OperationCode || rp.code) == constants.operationCode.success) {
                        _self.message = true;
                        _self.messageService = 'En unos momentos el documento será enviado a ' + _self.mPara;
                    } else if ((rp.OperationCode || rp.code) == 900) {
                        _self.messageError = rp.Message || rp.message;
                        _self.messageService = _self.messageError;
                        _self.showMessageError = true;
                    }else {
                        _self.messageError = rp.Message;
                    }
                    mpSpin.end();
                }, function(error) {
                  mpSpin.end();
                  // console.log('error');
                });
        }

        $scope.documentoChanged = function($event, index) {
            _self.data.archivos[index].checked = $event.checked;
        }
        
        $scope.deleteFile = function(item, indexItem, indexFile){
            _self.data.archivos.splice(indexFile, 1);
            if (!_self.data.archivos.length) {
                var vFileList = _self.data.archivos;
                vFileList.splice(indexItem, 1);
            }
        }

        function _getDocumentos(){
            var documentosSeleccionados = [];
            angular.forEach(_self.data.archivos, function (document) {
               if (document.checked) {
                documentosSeleccionados.push(document.name);
               }
            });
            return documentosSeleccionados;
        }

    }]).component('mpfModalSendEmail', {
        templateUrl: '/scripts/mpf-main-controls/components/modalSendEmail/component/modalSendEmail.html',
        controller: 'ctrlModalSendEmail',
        bindings: {
            action: '=',
            data: '=',
            close: '&'
        }
    })


});
