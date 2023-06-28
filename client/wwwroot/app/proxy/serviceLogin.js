/* eslint-disable */
(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants'], function(angular, constants){
    var module = angular.module("oim.proxyService.Login", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxyLogin', {
        endpoint: constants.system.api.endpoints['security'],
        controllerUsuario: {
            actions : {
                'methodSendEmailRecoverPassword':{
                    name:  'SendEmailRecoverPassword',
                    path: 'api/seguridad/acceso/SendEmailRecoverPassword?userName={userName}'
                },
                'methodSendEmailRecoverPasswordWithApplication':{
                    name:  'SendEmailRecoverPasswordWithApplication',
                    path: 'api/seguridad/acceso/SendEmailRecoverPassword'
                },
                'methodChangePassword':{
                    name:  'ChangePassword',
                    path: 'api/seguridad/acceso/ChangePassword'
                },
                'methodGetNombresUser':{
                    name:  'GetNombresUser',
                    path: 'api/seguridad/GetNombresUser'
                },
                'methodIsRegularExpression':{
                    name:  'IsRegularExpression',
                    path: 'api/seguridad/acceso/IsRegularExpression'
                },
                'methodRegistrarNuevoUsuario':{
                    name:  'RegistrarNuevoUsuario',
                    path: 'api/seguridad/acceso/registrarnuevo'
                },
                'methodReenviarCorreo':{
                    name:  'ReenviarCorreo',
                    path: 'api/seguridad/acceso/enviamail'
                },
                'methodEsTokenValido':{
                    name:  'EsTokenValido',
                    path: 'api/seguridad/acceso/EsTokenValido'
                },
                'methodTokenEstaActivoTest':{
                    name:  'TokenEstaActivoTest',
                    path: 'api/seguridad/acceso/TokenIsActiveTest'
                },
                'methodTokenEstaActivo':{
                    name:  'TokenEstaActivo',
                    path: 'api/seguridad/acceso/TokenIsActive'
                },
                'methodCerrarSession':{
                    name:  'CerrarSession',
                    path: 'api/seguridad/acceso/logout'
                },
                'methodChangePasswordPersonClientUser':{
                    name:  'ChangePasswordPersonClientUser',
                    path: 'api/seguridad/ChangePasswordPersonClientUser'
                },
                'methodInsertPersonClientUser':{
                    name:  'InsertPersonClientUser',
                    path: 'api/seguridad/InsertPersonClientUser'
                },
                'methodInsertPersonClientUserAuto':{
                    name:  'InsertPersonClientUserAuto',
                    path: 'api/seguridad/InsertPersonClientUserAuto'
                },
                'methodInsertPersonClientUserCronicos':{
                    name:  'InsertPersonClientUserCronicos',
                    path: 'api/seguridad/InsertPersonClientUserCronicos'
                },
                'methodChangePasswordWithOldPassword':{
                    name:  'ChangePasswordWithOldPassword',
                    path: 'api/seguridad/ChangePasswordWithOldPassword?code={code}'
                },
                'methodTestMail':{
                    name:  'TestMail',
                    path: 'api/seguridad/test/mail'
                },
                'methodGetInfoUser':{
                    name:  'GetInfoUser',
                    path: 'api/seguridad/info'
                },
                'methodGenerateVerifyCode':{
                    name:  'GenerateVerifyCode',
                    path: 'api/seguridad/VerifyCode'
                },
                'methodValidateVerifyCode':{
                    name:  'ValidateVerifyCode',
                    path: 'api/seguridad/VerifyCode/{verifyCode}'
                },
                'methodChangeVerifyCode':{
                    name:  'ChangeVerifyCode',
                    path: 'api/seguridad/VerifyCode/{verifyCode}'
                },
                'methodCreatePassword':{
                    name:  'CreatePassword',
                    path: 'api/seguridad/Usuario/Password'
                },
                'methodChangeProviderPassword':{
                    name:  'ChangeProviderPassword',
                    path: 'api/seguridad/Usuario/Password'
                },
                'methodchooseUserBrand':{
                    name:  'chooseUserBrand',
                    path: 'api/Usuario?Brand={Brand}&DocumentNumber={DocumentNumber}'
                },
            }
        },
        controllerAudience: {
            actions : {
                'methodPost':{
                    name:  'Post',
                    path: 'api/audience'
                },
            }
        },
        controllerLogin: {
            actions : {
                'methodLogin':{
                    name:  'Login',
                    path: 'api/guest/access'
                },
                'methodGuestAccess':{
                    name:  'GuestAccess',
                    path: 'api/guest/join'
                },
                'methodGenerateTokenExternal':{
                    name:  'GenerateTokenExternal',
                    path: 'api/guest/GenerateToken'
                },
            }
        },
        controllerLoginRsa: {
            actions : {
                'methodLogin':{
                    name:  'Login',
                    path: 'api/login/rsa?grouptypeid={grouptypeid}'
                },
                'methodDecrypt':{
                    name:  'Decrypt',
                    path: 'api/LoginRsa?stringDecrpyt={stringDecrpyt}'
                },
            }
        },
        controllerLoginBasic: {
            actions : {
                'methodLogin':{
                    name:  'Login',
                    path: 'api/login/basic'
                },
            }
        },
        controllerStartupUser: {
            actions : {
                'methodAddUserMarch':{
                    name:  'AddUserMarch',
                    path: 'api/startupuser/add/{userCode}'
                },
                'methodAddManyUserMarch':{
                    name:  'AddManyUserMarch',
                    path: 'api/startupuser/addmany'
                },
                'methodUpdateUserMarch':{
                    name:  'UpdateUserMarch',
                    path: 'api/startupuser/update/{userCode}/{newUserCode}'
                },
                'methodDeleteUserMarch':{
                    name:  'DeleteUserMarch',
                    path: 'api/startupuser/delete/{userCode}'
                },
                'methodDeleteAllUserMarch':{
                    name:  'DeleteAllUserMarch',
                    path: 'api/startupuser/clean'
                },
                'methodGetUserMarch':{
                    name:  'GetUserMarch',
                    path: 'api/startupuser/get/{userCode}'
                },
                'methodGetAllUserMarch':{
                    name:  'GetAllUserMarch',
                    path: 'api/startupuser/all'
                },
            }
        },
        controllerValidate: {
            actions : {
                'methodValidateProfileMAPFRE':{
                    name:  'ValidateProfileMAPFRE',
                    path: 'api/Validate/ProfileMAPFRE/UserName/{UserName}/GroupType/{GroupType}/Application/{ApplicationCode}/ProfileCode/{ProfileCode}'
                },
                'methodValidateProfilesWithoutGroupType':{
                    name:  'ValidateProfilesWithoutGroupType',
                    path: 'api/Validate/ProfileWithoutGroupType/UserName/{UserName}/Application/{ApplicationCode}/ProfileCode/{ProfileCode}'
                },
                'methodValidAplByUserName':{
                    name:  'ValidAplByUserName',
                    path: 'api/Validate/ValidAplByUserName/UserName/{userName}/GroupType/{numGroupType}/Application/{aplicationCode}'
                },
                'methodValidStateAplication':{
                    name:  'ValidStateAplication',
                    path: 'api/Validate/ValidAplicationState/Application/{aplicationCode}'
                },
                'methodValidExistAccessAplication':{
                    name:  'ValidExistAccessAplication',
                    path: 'api/Validate/ValidApplicationRol/UserName/{userName}/Application/{aplicationCode}'
                },
            }
        },
        controllerPerson: {
            actions : {
                'methodGetUsersByPersonId':{
                    name:  'GetUsersByPersonId',
                    path: 'api/person/GetUsers?system={system}'
                },
                'methodValidateCollaborator':{
                    name:  'ValidateCollaborator',
                    path: 'api/person/intranet/permision'
                },
                'methodGetUsersByPersonParam':{
                    name:  'GetUsersByPersonParam',
                    path: 'api/person/GetUsers/{numpersona}'
                },
                'methodGetIp':{
                    name:  'GetIp',
                    path: 'api/Person'
                },
            }
        },
        controllerToken: {
            actions : {
                'methodExpireTime':{
                    name:  'ExpireTime',
                    path: 'api/token/expire-time/{format}'
                },
                'methodIsValid':{
                    name:  'IsValid',
                    path: 'api/token/IsValid'
                },
                'methodIsValidResolver':{
                    name:  'IsValidResolver',
                    path: 'api/token/IsValidResolver'
                },
            }
        },
        controllerMfa: {
            actions : {
                'methodApplicacionSearchModalities':{
                    name:  'ApplicacionSearchModalities',
                    path: 'api/mfa/authenticators/application/{applicationCode}/searchModalities'
                },
                'methodFunctionalitySearchModalities':{
                    name:  'FunctionalitySearchModalities',
                    path: 'api/mfa/authenticators/functionality/{functionalityCode}/searchModalities'
                },
                'methodConfirmationMessage':{
                    name:  'ConfirmationMessage',
                    path: 'api/mfa/authenticators/confirmationMessage'
                },
                'methodCreateMessage':{
                    name:  'CreateMessage',
                    path: 'api/mfa/authenticators/request'
                },
                'methodValidateMessage':{
                    name:  'ValidateMessage',
                    path: 'api/mfa/authenticators/request/validate'
                },
                'methodGetParameters':{
                    name:  'GetParameters',
                    path: 'api/mfa/authenticators/parameters?p={p}'
                },
                'methodInformationTemporaryPending':{
                    name:  'InformationTemporaryPending',
                    path: 'api/mfa/authenticators/informationTemporary/pending'
                },
                'methodIsUserExcluded':{
                    name:  'IsUserExcluded',
                    path: 'api/mfa/authenticators/userExcluded'
                },
            }
        },
        controllerCapcha: {
            actions : {
                'methodValidateCaptcha':{
                    name:  'ValidateCaptcha',
                    path: 'api/captcha/validate'
                },
            }
        },
        controllerMenu: {
            actions : {
                'methodGetMoreAplication':{
                    name:  'GetMoreAplication',
                    path: 'api/home/aplicaciones'
                },
                'methodGetMenu':{
                    name:  'GetMenu',
                    path: 'api/home/menu'
                },
                'methodGetSubMenu':{
                    name:  'GetSubMenu',
                    path: 'api/home/submenu/{aplicacion}'
                },
                'methodGetApplicationsClientCompany':{
                    name:  'GetApplicationsClientCompany',
                    path: 'api/home/applications/clientCompany/{systemId}'
                },
            }
        },
        controllerLoginCommon: {
            actions : {
                'methodGetListUserTypes':{
                    name:  'GetListUserTypes',
                    path: 'api/general/tipousuario'
                },
                'methodGetInfoCliente':{
                    name:  'GetInfoCliente',
                    path: 'api/general/buscarcliente/{tipoDoc}/{numeroDoc}'
                },
                'methodSendMailClient':{
                    name:  'SendMailClient',
                    path: 'api/general/client/enviarMail'
                },
            }
        },
        controllerRedirect: {
            actions : {
                'methodGenerateTokenDummy':{
                    name:  'GenerateTokenDummy',
                    path: 'api/redirect/token/generate'
                },
                'methodTransformTokenDummy':{
                    name:  'TransformTokenDummy',
                    path: 'api/redirect/token/transform'
                },
                'methodLogOut':{
                    name:  'LogOut',
                    path: 'api/redirect/logout'
                },
            }
        },
        controllerClaims: {
            actions : {
                'methodGetClaims':{
                    name:  'GetClaims',
                    path: 'api/claims/values'
                },
                'methodGetClaimsDictionary':{
                    name:  'GetClaimsDictionary',
                    path: 'api/claims/list'
                },
                'methodGetRolesByUser':{
                    name:  'GetRolesByUser',
                    path: 'api/claims/rolesPorUsuario'
                },
                'methodGetRolesByUserAndApplication':{
                    name:  'GetRolesByUserAndApplication',
                    path: 'api/claims/obtenerTicket/{aplicacion}'
                },
                'methodGetUserTicket':{
                    name:  'GetUserTicket',
                    path: 'api/claims/ticket/{aplicacion}'
                },
                'methodGetUserAdminTicket':{
                    name:  'GetUserAdminTicket',
                    path: 'api/claims/ticket/adm'
                },
                'methodGetUserEmpTicket':{
                    name:  'GetUserEmpTicket',
                    path: 'api/claims/ticket/business/{aplicacion}'
                },
                'methodGetUserRole':{
                    name:  'GetUserRole',
                    path: 'api/claims/role'
                },
                'methodGetUserAdmin':{
                    name:  'GetUserAdmin',
                    path: 'api/claims/user/adm'
                },
                'methodGenerateNewToken':{
                    name:  'GenerateNewToken',
                    path: 'api/claims/GenerateClaimsByGroupType'
                },
                'methodGenerateTokenMapfre':{
                    name:  'GenerateTokenMapfre',
                    path: 'api/claims/GenerateTokenMapfre'
                },
            }
        },
        controllerEncrypt: {
            actions : {
                'methodEncryptText':{
                    name:  'EncryptText',
                    path: 'api/encrypt/EncryptText/{Text}'
                },
                'methodDecrypt':{
                    name:  'Decrypt',
                    path: 'api/encrypt/decrypt'
                },
            }
        }
    })



     module.factory("proxyUsuario", ['oimProxyLogin', 'httpData', function(oimProxyLogin, httpData){
        return {
                'SendEmailRecoverPassword' : function(userName, showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + helper.formatNamed('api/seguridad/acceso/SendEmailRecoverPassword?userName={userName}',
                                                    { 'userName':  { value: userName, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'SendEmailRecoverPasswordWithApplication' : function(model, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/seguridad/acceso/SendEmailRecoverPassword',
                                         model, undefined, showSpin)
                },
                'ChangePassword' : function(model, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/seguridad/acceso/ChangePassword',
                                         model, undefined, showSpin)
                },
                'GetNombresUser' : function(model, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/seguridad/GetNombresUser',
                                         model, undefined, showSpin)
                },
                'IsRegularExpression' : function(model, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/seguridad/acceso/IsRegularExpression',
                                         model, undefined, showSpin)
                },
                'RegistrarNuevoUsuario' : function(usuario, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/seguridad/acceso/registrarnuevo',
                                         usuario, undefined, showSpin)
                },
                'ReenviarCorreo' : function(usuario, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/seguridad/acceso/enviamail',
                                         usuario, undefined, showSpin)
                },
                'EsTokenValido' : function( showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + 'api/seguridad/acceso/EsTokenValido',
                                         undefined, undefined, showSpin)
                },
                'TokenEstaActivoTest' : function(model, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/seguridad/acceso/TokenIsActiveTest',
                                         model, undefined, showSpin)
                },
                'TokenEstaActivo' : function(model, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/seguridad/acceso/TokenIsActive',
                                         model, undefined, showSpin)
                },
                'CerrarSession' : function( showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/seguridad/acceso/logout',
                                         undefined, undefined, showSpin)
                },
                'ChangePasswordPersonClientUser' : function(model, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/seguridad/ChangePasswordPersonClientUser',
                                         model, undefined, showSpin)
                },
                'InsertPersonClientUser' : function(model, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/seguridad/InsertPersonClientUser',
                                         model, undefined, showSpin)
                },
                'InsertPersonClientUserAuto' : function(model, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/seguridad/InsertPersonClientUserAuto',
                                         model, undefined, showSpin)
                },
                'InsertPersonClientUserCronicos' : function(model, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/seguridad/InsertPersonClientUserCronicos',
                                         model, undefined, showSpin)
                },
                'ChangePasswordWithOldPassword' : function(code, model, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + helper.formatNamed('api/seguridad/ChangePasswordWithOldPassword?code={code}',
                                                    { 'code':  { value: code, defaultValue:'' }  }),
                                         model, undefined, showSpin)
                },
                'TestMail' : function( showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + 'api/seguridad/test/mail',
                                         undefined, undefined, showSpin)
                },
                'GetInfoUser' : function( showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + 'api/seguridad/info',
                                         undefined, undefined, showSpin)
                },
                'GenerateVerifyCode' : function(model, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/seguridad/VerifyCode',
                                         model, undefined, showSpin)
                },
                'ValidateVerifyCode' : function(verifyCode, showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + helper.formatNamed('api/seguridad/VerifyCode/{verifyCode}',
                                                    { 'verifyCode':  { value: verifyCode, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ChangeVerifyCode' : function(verifyCode, model, showSpin){
                    return httpData['put'](oimProxyLogin.endpoint + helper.formatNamed('api/seguridad/VerifyCode/{verifyCode}',
                                                    { 'verifyCode':  { value: verifyCode, defaultValue:'' }  }),
                                         model, undefined, showSpin)
                },
                'CreatePassword' : function(model, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/seguridad/Usuario/Password',
                                         model, undefined, showSpin)
                },
                'ChangeProviderPassword' : function(model, showSpin){
                    return httpData['put'](oimProxyLogin.endpoint + 'api/seguridad/Usuario/Password',
                                         model, undefined, showSpin)
                },
                'chooseUserBrand' : function(Brand, DocumentNumber, DocumentType, isTron, company, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + helper.formatNamed('api/Usuario?Brand={Brand}&DocumentNumber={DocumentNumber}',
                                                    { 'Brand':  { value: Brand, defaultValue:'' } ,'DocumentNumber':  { value: DocumentNumber, defaultValue:'' }  }),
                                         DocumentType,isTron,company, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyAudience", ['oimProxyLogin', 'httpData', function(oimProxyLogin, httpData){
        return {
                'Post' : function(audienceModel, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/audience',
                                         audienceModel, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyLogin", ['oimProxyLogin', 'httpData', function(oimProxyLogin, httpData){
        return {
                'Login' : function(bAuth, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/guest/access',
                                         bAuth, undefined, showSpin)
                },
                'GuestAccess' : function( showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/guest/join',
                                         undefined, undefined, showSpin)
                },
                'GenerateTokenExternal' : function(configuration, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/guest/GenerateToken',
                                         configuration, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyLoginRsa", ['oimProxyLogin', 'httpData', function(oimProxyLogin, httpData){
        return {
                'Login' : function(model, grouptypeid, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + helper.formatNamed('api/login/rsa?grouptypeid={grouptypeid}',
                                                    { 'grouptypeid':  { value: grouptypeid, defaultValue:'' }  }),
                                         model, undefined, showSpin)
                },
                'Decrypt' : function(stringDecrpyt, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + helper.formatNamed('api/LoginRsa?stringDecrpyt={stringDecrpyt}',
                                                    { 'stringDecrpyt':  { value: stringDecrpyt, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyLoginBasic", ['oimProxyLogin', 'httpData', function(oimProxyLogin, httpData){
        return {
                'Login' : function( showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/login/basic',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyStartupUser", ['oimProxyLogin', 'httpData', function(oimProxyLogin, httpData){
        return {
                'AddUserMarch' : function(userCode, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + helper.formatNamed('api/startupuser/add/{userCode}',
                                                    { 'userCode':  { value: userCode, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'AddManyUserMarch' : function(usersCode, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/startupuser/addmany',
                                         usersCode, undefined, showSpin)
                },
                'UpdateUserMarch' : function(userCode, newUserCode, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + helper.formatNamed('api/startupuser/update/{userCode}/{newUserCode}',
                                                    { 'userCode':  { value: userCode, defaultValue:'' } ,'newUserCode':  { value: newUserCode, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'DeleteUserMarch' : function(userCode, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + helper.formatNamed('api/startupuser/delete/{userCode}',
                                                    { 'userCode':  { value: userCode, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'DeleteAllUserMarch' : function( showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/startupuser/clean',
                                         undefined, undefined, showSpin)
                },
                'GetUserMarch' : function(userCode, showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + helper.formatNamed('api/startupuser/get/{userCode}',
                                                    { 'userCode':  { value: userCode, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetAllUserMarch' : function( showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + 'api/startupuser/all',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyValidate", ['oimProxyLogin', 'httpData', function(oimProxyLogin, httpData){
        return {
                'ValidateProfileMAPFRE' : function(UserName, GroupType, ApplicationCode, ProfileCode, showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + helper.formatNamed('api/Validate/ProfileMAPFRE/UserName/{UserName}/GroupType/{GroupType}/Application/{ApplicationCode}/ProfileCode/{ProfileCode}',
                                                    { 'UserName':  { value: UserName, defaultValue:'' } ,'GroupType':  { value: GroupType, defaultValue:'' } ,'ApplicationCode':  { value: ApplicationCode, defaultValue:'' } ,'ProfileCode':  { value: ProfileCode, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ValidateProfilesWithoutGroupType' : function(UserName, ApplicationCode, ProfileCode, showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + helper.formatNamed('api/Validate/ProfileWithoutGroupType/UserName/{UserName}/Application/{ApplicationCode}/ProfileCode/{ProfileCode}',
                                                    { 'UserName':  { value: UserName, defaultValue:'' } ,'ApplicationCode':  { value: ApplicationCode, defaultValue:'' } ,'ProfileCode':  { value: ProfileCode, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ValidAplByUserName' : function(userName, numGroupType, aplicationCode, showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + helper.formatNamed('api/Validate/ValidAplByUserName/UserName/{userName}/GroupType/{numGroupType}/Application/{aplicationCode}',
                                                    { 'userName':  { value: userName, defaultValue:'' } ,'numGroupType':  { value: numGroupType, defaultValue:'' } ,'aplicationCode':  { value: aplicationCode, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ValidStateAplication' : function(aplicationCode, showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + helper.formatNamed('api/Validate/ValidAplicationState/Application/{aplicationCode}',
                                                    { 'aplicationCode':  { value: aplicationCode, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ValidExistAccessAplication' : function(userName, aplicationCode, showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + helper.formatNamed('api/Validate/ValidApplicationRol/UserName/{userName}/Application/{aplicationCode}',
                                                    { 'userName':  { value: userName, defaultValue:'' } ,'aplicationCode':  { value: aplicationCode, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPerson", ['oimProxyLogin', 'httpData', function(oimProxyLogin, httpData){
        return {
                'GetUsersByPersonId' : function(system, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + helper.formatNamed('api/person/GetUsers?system={system}',
                                                    { 'system':  { value: system, defaultValue:'OIM' }  }),
                                         undefined, undefined, showSpin)
                },
                'ValidateCollaborator' : function(request, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/person/intranet/permision',
                                         request, undefined, showSpin)
                },
                'GetUsersByPersonParam' : function(numpersona, showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + helper.formatNamed('api/person/GetUsers/{numpersona}',
                                                    { 'numpersona':  { value: numpersona, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetIp' : function( showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + 'api/Person',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyToken", ['oimProxyLogin', 'httpData', function(oimProxyLogin, httpData){
        return {
                'ExpireTime' : function(format, showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + helper.formatNamed('api/token/expire-time/{format}',
                                                    { 'format':  { value: format, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'IsValid' : function( showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + 'api/token/IsValid',
                                         undefined, undefined, showSpin)
                },
                'IsValidResolver' : function( showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + 'api/token/IsValidResolver',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyMfa", ['oimProxyLogin', 'httpData', function(oimProxyLogin, httpData){
        return {
                'ApplicacionSearchModalities' : function(applicationCode, applicationSeachModelRequest, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + helper.formatNamed('api/mfa/authenticators/application/{applicationCode}/searchModalities',
                                                    { 'applicationCode':  { value: applicationCode, defaultValue:'' }  }),
                                         applicationSeachModelRequest, undefined, showSpin)
                },
                'FunctionalitySearchModalities' : function(functionalityCode, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + helper.formatNamed('api/mfa/authenticators/functionality/{functionalityCode}/searchModalities',
                                                    { 'functionalityCode':  { value: functionalityCode, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ConfirmationMessage' : function(confirmationMessageModelRequest, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/mfa/authenticators/confirmationMessage',
                                         confirmationMessageModelRequest, undefined, showSpin)
                },
                'CreateMessage' : function(requestCreateMessageModelRequest, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/mfa/authenticators/request',
                                         requestCreateMessageModelRequest, undefined, showSpin)
                },
                'ValidateMessage' : function(validateMessageModelRequest, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/mfa/authenticators/request/validate',
                                         validateMessageModelRequest, undefined, showSpin)
                },
                'GetParameters' : function(p, showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + helper.formatNamed('api/mfa/authenticators/parameters?p={p}',
                                                    { 'p':  { value: p, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'InformationTemporaryPending' : function( showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + 'api/mfa/authenticators/informationTemporary/pending',
                                         undefined, undefined, showSpin)
                },
                'IsUserExcluded' : function( showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + 'api/mfa/authenticators/userExcluded',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCapcha", ['oimProxyLogin', 'httpData', function(oimProxyLogin, httpData){
        return {
                'ValidateCaptcha' : function( showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/captcha/validate',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyMenu", ['oimProxyLogin', 'httpData', function(oimProxyLogin, httpData){
        return {
                'GetMoreAplication' : function( showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + 'api/home/aplicaciones',
                                         undefined, undefined, showSpin)
                },
                'GetMenu' : function( showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + 'api/home/menu',
                                         undefined, undefined, showSpin)
                },
                'GetSubMenu' : function(aplicacion, showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + helper.formatNamed('api/home/submenu/{aplicacion}',
                                                    { 'aplicacion':  { value: aplicacion, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetApplicationsClientCompany' : function(systemId, showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + helper.formatNamed('api/home/applications/clientCompany/{systemId}',
                                                    { 'systemId':  { value: systemId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyLoginCommon", ['oimProxyLogin', 'httpData', function(oimProxyLogin, httpData){
        return {
                'GetListUserTypes' : function( showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + 'api/general/tipousuario',
                                         undefined, undefined, showSpin)
                },
                'GetInfoCliente' : function(tipoDoc, numeroDoc, showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + helper.formatNamed('api/general/buscarcliente/{tipoDoc}/{numeroDoc}',
                                                    { 'tipoDoc':  { value: tipoDoc, defaultValue:'' } ,'numeroDoc':  { value: numeroDoc, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'SendMailClient' : function(model, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/general/client/enviarMail',
                                         model, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyRedirect", ['oimProxyLogin', 'httpData', function(oimProxyLogin, httpData){
        return {
                'GenerateTokenDummy' : function(request, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/redirect/token/generate',
                                         request, undefined, showSpin)
                },
                'TransformTokenDummy' : function(request, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/redirect/token/transform',
                                         request, undefined, showSpin)
                },
                'LogOut' : function( showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/redirect/logout',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyClaims", ['oimProxyLogin', 'httpData', function(oimProxyLogin, httpData){
        return {
                'GetClaims' : function( showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/claims/values',
                                         undefined, undefined, showSpin)
                },
                'GetClaimsDictionary' : function( showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/claims/list',
                                         undefined, undefined, showSpin)
                },
                'GetRolesByUser' : function( showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + 'api/claims/rolesPorUsuario',
                                         undefined, undefined, showSpin)
                },
                'GetRolesByUserAndApplication' : function(aplicacion, showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + helper.formatNamed('api/claims/obtenerTicket/{aplicacion}',
                                                    { 'aplicacion':  { value: aplicacion, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetUserTicket' : function(aplicacion, showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + helper.formatNamed('api/claims/ticket/{aplicacion}',
                                                    { 'aplicacion':  { value: aplicacion, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetUserAdminTicket' : function(ticketRq, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/claims/ticket/adm',
                                         ticketRq, undefined, showSpin)
                },
                'GetUserEmpTicket' : function(aplicacion, showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + helper.formatNamed('api/claims/ticket/business/{aplicacion}',
                                                    { 'aplicacion':  { value: aplicacion, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetUserRole' : function(ticketRq, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/claims/role',
                                         ticketRq, undefined, showSpin)
                },
                'GetUserAdmin' : function(ticketRq, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/claims/user/adm',
                                         ticketRq, undefined, showSpin)
                },
                'GenerateNewToken' : function(model, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/claims/GenerateClaimsByGroupType',
                                         model, undefined, showSpin)
                },
                'GenerateTokenMapfre' : function( showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/claims/GenerateTokenMapfre',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyEncrypt", ['oimProxyLogin', 'httpData', function(oimProxyLogin, httpData){
        return {
                'EncryptText' : function(Text, showSpin){
                    return httpData['get'](oimProxyLogin.endpoint + helper.formatNamed('api/encrypt/EncryptText/{Text}',
                                                    { 'Text':  { value: Text, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Decrypt' : function(dto, showSpin){
                    return httpData['post'](oimProxyLogin.endpoint + 'api/encrypt/decrypt',
                                         dto, undefined, showSpin)
                }
        };
     }]);
});
