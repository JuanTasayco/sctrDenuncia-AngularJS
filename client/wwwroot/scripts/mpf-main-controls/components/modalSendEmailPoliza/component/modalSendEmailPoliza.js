'use strict';

define([
    'angular', 'constants',
    '/scripts/mpf-main-controls/components/modalSendEmailPoliza/service/modalSendEmailPolizaFactory.js'
], function (angular, constants) {

    angular.module('mapfre.controls')
        .controller('ctrlModalSendEmailPoliza',
            ['$scope', '$window', '$state', 'modalSendEmailPolizaFactory', 'mpSpin', '$timeout', 'oimPrincipal',
                function ($scope, $window, $state, modalSendEmailPolizaFactory, mpSpin, $timeout, oimPrincipal) {
                    var _self = this;
                    console.log('_self', this);
					_self.mCodigoCia =(_self.data.CodigoCia === undefined) ? 2 : _self.data.CodigoCia ;					                   
                    _self.mPoliza = _self.data.NumeroPoliza;
                    _self.mSuplemento = _self.data.Suplemento;
                    _self.mAplicacion = _self.data.Aplicacion;
                    _self.mSuplementoAplicacion = _self.data.SuplementoAplicacion;
                    _self.mPara = '';

                    _self.message = false;
                    _self.showMessageError = false;
                    _self.disabled = true;
                    _self.readonly = true;

                    //Funcion para busca el objeto
                    _self.modalSendEmail = _.find(constants.modalSendEmail, function (item) {
                        if ((_self.action && _self.action.action && typeof _self.action.action != 'undefined')) {
                            return item.action == _self.action.action;
                        } else {                            
                            return item.action == _self.action;
                        }
                    });

                    _self.sendEmail = function () {
                        $scope.frmSendMail.markAsPristine();
                        if ($scope.validationForm()) {

                            var vdataSendEmail = {};

                            vdataSendEmail.emails  = _self.mPara;
                            vdataSendEmail.policies = [];
                            var policie = {
                                companyId: _self.mCodigoCia,
                                policyNumber: _self.mPoliza, 
                                supplement: _self.mSuplemento, 
                                application:  _self.mAplicacion, 
                                applicationSupplement:  _self.mSuplementoAplicacion, 
                            };
                            console.log('policie2' , policie);
                            vdataSendEmail.policies.push(policie);
                            send(vdataSendEmail); //invocar al servicio
                        }
                    }

                    $scope.validationForm = function () {
                        return $scope.frmSendMail.$valid && !$scope.frmSendMail.$pristine;
                    };

                    function send(vdataSendEmail) {
                        _self.showMessageError = false;
                        mpSpin.start();
                        
                        var appCodeSubMenu = $window.localStorage['appCodeSubMenu'];
                        if (appCodeSubMenu == 'TRANSPORTE'){
                            modalSendEmailPolizaFactory.sendEmailSaveTraza(vdataSendEmail,false).then(function (response) {
                            }, function (error) {
                                console.log('error');
                            });
                        }
                       
                        modalSendEmailPolizaFactory.sendEmail('enviarPoliza', vdataSendEmail).then(function (response) {
                            console.log('response',response);							
							var rp = response.data;							

                            if ((rp.OperationCode || rp.code || rp.operationCode) == constants.operationCode.success) {
								
								console.log('response',rp);
								console.log('response',rp.data[0]);
								var result = rp.data[0];
                                var msg = result.code === 1 ? 'En unos momentos el documento será enviado a ' + _self.mPara : 'No se pudo enviar la póliza al correo '+ _self.mPara + ', por favor comuníquese con el administrador';
                                								
                                _self.message = true;
                                //_self.messageService = 'En unos momentos el documento será enviado a ' + _self.mPara;
								_self.messageService = msg;

                            } else if ((rp.OperationCode || rp.code || rp.operationCode) == 900) {
                                _self.messageError = rp.Message || rp.message;
                                _self.messageService = _self.messageError;
                                _self.showMessageError = true;
                            } else {
                                _self.messageError = rp.Message;
                            }
                            mpSpin.end();
                        }, function (error) {
                            mpSpin.end();
                            console.log('error');
                        });
                    }


                }]).component('mpfModalSendEmailPoliza', {
                    templateUrl: '/scripts/mpf-main-controls/components/modalSendEmailPoliza/component/modalSendEmailPoliza.html',
                    controller: 'ctrlModalSendEmailPoliza',
                    bindings: {
                        action: '=',
                        data: '=',
                        close: '&'
                    }
                })


});
