/* eslint-disable */
(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants'], function(angular, constants){
    var module = angular.module("oim.proxyService.seguridad", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxySeguridad', {
        endpoint: constants.system.api.endpoints['seguridad'],
        controllerDashboardAdministrador: {
            actions : {
                'methodGetSearchParameters':{
                    name:  'GetSearchParameters',
                    path: 'api/DashboardAdministrador/GetSearchParameters'
                },
                'methodGetPagination':{
                    name:  'GetPagination',
                    path: 'api/DashboardAdministrador/GetPagination?CompanyNumber={CompanyNumber}&UserStatus={UserStatus}&SearchParameter={SearchParameter}&StartDate={StartDate}&EndDate={EndDate}&SearchValue={SearchValue}&PageNum={PageNum}&PageSize={PageSize}&SortingType={SortingType}'
                },
                'methodGetTotals':{
                    name:  'GetTotals',
                    path: 'api/DashboardAdministrador/GetTotals?CompanyNumber={CompanyNumber}&SearchParameter={SearchParameter}&StartDate={StartDate}&EndDate={EndDate}&SearchValue={SearchValue}'
                },
                'methodPostResendLink':{
                    name:  'PostResendLink',
                    path: 'api/DashboardAdministrador/PostResendLink?UserNumber={UserNumber}&TokenStatusCode={TokenStatusCode}&Person={Person}&Email={Email}'
                },
                'methodPostExpireLink':{
                    name:  'PostExpireLink',
                    path: 'api/DashboardAdministrador/PostExpireLink?UserNumber={UserNumber}'
                },
            }
        },
        controllerRol: {
            actions : {
                'methodGetProfilesByApplication':{
                    name:  'GetProfilesByApplication',
                    path: 'api/Rol/Application/{NumApplication}/GetProfiles?Search={Search}'
                },
                'methodGetRoles':{
                    name:  'GetRoles',
                    path: 'api/Rol/GetRoles?numTypeGroup={numTypeGroup}&search={search}'
                },
                'methodGetPaginationCustom':{
                    name:  'GetPaginationCustom',
                    path: 'api/Rol/GetPaginationCustom'
                },
                'methodGetGroupTypes':{
                    name:  'GetGroupTypes',
                    path: 'api/Rol/GetGroupTypes'
                },
                'methodGetPagination':{
                    name:  'GetPagination',
                    path: 'api/Rol/GetPagination'
                },
                'methodExportExcel':{
                    name:  'ExportExcel',
                    path: 'api/Rol/ExportExcel'
                },
                'methodGetDetail':{
                    name:  'GetDetail',
                    path: 'api/Rol/GetDetail/{NumberRol}'
                },
                'methodGetDetailByCode':{
                    name:  'GetDetailByCode',
                    path: 'api/Rol/GetDetailByCode?RoleCode={RoleCode}'
                },
                'methodGetCheckCode':{
                    name:  'GetCheckCode',
                    path: 'api/Rol/GetCheckCode?RoleCode={RoleCode}'
                },
                'methodInsert':{
                    name:  'Insert',
                    path: 'api/Rol/Insert'
                },
                'methodUpdateCreate':{
                    name:  'UpdateCreate',
                    path: 'api/Rol/UpdateCreate'
                },
                'methodUpdate':{
                    name:  'Update',
                    path: 'api/Rol/Update'
                },
                'methodUpdateStatus':{
                    name:  'UpdateStatus',
                    path: 'api/Rol/UpdateStatus'
                },
                'methodApplicationGetDetail':{
                    name:  'ApplicationGetDetail',
                    path: 'api/Rol/ApplicationGetDetail?NumRole={NumRole}&NumApplication={NumApplication}'
                },
                'methodApplicationGetAll':{
                    name:  'ApplicationGetAll',
                    path: 'api/Rol/ApplicationGetAll/{RolNumber}'
                },
                'methodApplicationInsert':{
                    name:  'ApplicationInsert',
                    path: 'api/Rol/ApplicationInsert'
                },
                'methodApplicationProfileInsert':{
                    name:  'ApplicationProfileInsert',
                    path: 'api/Rol/ApplicationProfileInsert'
                },
                'methodApplicationUpdateStatus':{
                    name:  'ApplicationUpdateStatus',
                    path: 'api/Rol/ApplicationUpdateStatus'
                },
                'methodApplicationDelete':{
                    name:  'ApplicationDelete',
                    path: 'api/Rol/ApplicationDelete'
                },
                'methodApplicationProfileUpdateStatus':{
                    name:  'ApplicationProfileUpdateStatus',
                    path: 'api/Rol/ApplicationProfileUpdateStatus'
                },
                'methodApplicationProfileDelete':{
                    name:  'ApplicationProfileDelete',
                    path: 'api/Rol/ApplicationProfileDelete'
                },
                'methodRoleGetAll':{
                    name:  'RoleGetAll',
                    path: 'api/Rol/RoleGetAll/{RolNumber}'
                },
                'methodRoleInsert':{
                    name:  'RoleInsert',
                    path: 'api/Rol/RoleInsert'
                },
                'methodRoleUpdateStatus':{
                    name:  'RoleUpdateStatus',
                    path: 'api/Rol/RoleUpdateStatus'
                },
                'methodRoleDelete':{
                    name:  'RoleDelete',
                    path: 'api/Rol/RoleDelete'
                },
            }
        },
        controllerUsuarioAdministrador: {
            actions : {
                'methodGetPagination':{
                    name:  'GetPagination',
                    path: 'api/UsuarioAdministrador/GetPagination'
                },
                'methodDisableUserAll':{
                    name:  'DisableUserAll',
                    path: 'api/UsuarioAdministrador/DisableUserAll'
                },
            }
        },
        controllerUsuarioDisma: {
            actions : {
                'methodGetCompanies':{
                    name:  'GetCompanies',
                    path: 'api/UsuarioDisma/GetCompanies?search={search}'
                },
                'methodGetUserTypes':{
                    name:  'GetUserTypes',
                    path: 'api/UsuarioDisma/GetUserTypes'
                },
                'methodGetUserStates':{
                    name:  'GetUserStates',
                    path: 'api/UsuarioDisma/GetUserStates'
                },
                'methodGetOffices':{
                    name:  'GetOffices',
                    path: 'api/UsuarioDisma/GetOffices?search={search}'
                },
                'methodGetRoles':{
                    name:  'GetRoles',
                    path: 'api/UsuarioDisma/GetRoles?numTypeGroup={numTypeGroup}&search={search}'
                },
                'methodGetApplications':{
                    name:  'GetApplications',
                    path: 'api/UsuarioDisma/GetApplications?search={search}'
                },
                'methodGetProfiles':{
                    name:  'GetProfiles',
                    path: 'api/UsuarioDisma/GetProfiles?search={search}'
                },
                'methodGetCollectors':{
                    name:  'GetCollectors',
                    path: 'api/UsuarioDisma/GetCollectors?search={search}'
                },
                'methodGetAgents':{
                    name:  'GetAgents',
                    path: 'api/UsuarioDisma/GetAgents?search={search}'
                },
                'methodGetAgentsBroker':{
                    name:  'GetAgentsBroker',
                    path: 'api/UsuarioDisma/GetAgentsBroker?ruc={ruc}'
                },
                'methodGetPagination':{
                    name:  'GetPagination',
                    path: 'api/UsuarioDisma/GetPagination'
                },
                'methodGetDetail':{
                    name:  'GetDetail',
                    path: 'api/UsuarioDisma/GetDetail/{numUser}'
                },
                'methodGetRoleAdm':{
                    name:  'GetRoleAdm',
                    path: 'api/UsuarioDisma/GetRoleAdm/{numUser}'
                },
                'methodIsCopyAccess':{
                    name:  'IsCopyAccess',
                    path: 'api/UsuarioDisma/IsCopyAccess/{numUser}'
                },
                'methodCopyAccessToRegular':{
                    name:  'CopyAccessToRegular',
                    path: 'api/UsuarioDisma/CopyAccessToRegular'
                },
                'methodGetAccessByUserAdministrator':{
                    name:  'GetAccessByUserAdministrator',
                    path: 'api/UsuarioDisma/GetAccessByUserAdministrator/{numUser}'
                },
                'methodGetProfilesByUserByApplication':{
                    name:  'GetProfilesByUserByApplication',
                    path: 'api/UsuarioDisma/GetProfilesByUserByApplication/{numUser}/{numApplication}?search={search}'
                },
                'methodGetProfilesByUserByApplicationRegular':{
                    name:  'GetProfilesByUserByApplicationRegular',
                    path: 'api/UsuarioDisma/GetProfilesByUserByApplicationRegular/{numUser}/{numApplication}?search={search}'
                },
                'methodGetAccessByUserRegular':{
                    name:  'GetAccessByUserRegular',
                    path: 'api/UsuarioDisma/GetAccessByUserRegular/{numUser}'
                },
                'methodUpdateAccessStatus':{
                    name:  'UpdateAccessStatus',
                    path: 'api/UsuarioDisma/UpdateAccessStatus'
                },
                'methodTest':{
                    name:  'Test',
                    path: 'api/UsuarioDisma/test'
                },
                'methodUpdateAccessStatusPrincipal':{
                    name:  'UpdateAccessStatusPrincipal',
                    path: 'api/UsuarioDisma/UpdateAccessStatusPrincipal'
                },
                'methodInsertAccessPrincipal':{
                    name:  'InsertAccessPrincipal',
                    path: 'api/UsuarioDisma/InsertAccessPrincipal'
                },
                'methodInsertAccessAssociated':{
                    name:  'InsertAccessAssociated',
                    path: 'api/UsuarioDisma/InsertAccessAssociated'
                },
                'methodInsertAccessRegular':{
                    name:  'InsertAccessRegular',
                    path: 'api/UsuarioDisma/InsertAccessRegular'
                },
                'methodUpdateAccessPrincipal':{
                    name:  'UpdateAccessPrincipal',
                    path: 'api/UsuarioDisma/UpdateAccessPrincipal'
                },
                'methodUpdateAccessAssociated':{
                    name:  'UpdateAccessAssociated',
                    path: 'api/UsuarioDisma/UpdateAccessAssociated'
                },
                'methodUpdateAccessRegular':{
                    name:  'UpdateAccessRegular',
                    path: 'api/UsuarioDisma/UpdateAccessRegular'
                },
                'methodDeleteAccess':{
                    name:  'DeleteAccess',
                    path: 'api/UsuarioDisma/DeleteAccess'
                },
                'methodDeleteAccessRegular':{
                    name:  'DeleteAccessRegular',
                    path: 'api/UsuarioDisma/DeleteAccessRegular'
                },
                'methodInsertRoleToUser':{
                    name:  'InsertRoleToUser',
                    path: 'api/UsuarioDisma/InsertRoleToUser'
                },
                'methodDeleteRoleFromUser':{
                    name:  'DeleteRoleFromUser',
                    path: 'api/UsuarioDisma/DeleteRoleFromUser'
                },
                'methodUpdateMapfre':{
                    name:  'UpdateMapfre',
                    path: 'api/UsuarioDisma/UpdateMapfre'
                },
                'methodUpdateUserCompany':{
                    name:  'UpdateUserCompany',
                    path: 'api/UsuarioDisma/UpdateUserCompany'
                },
                'methodUpdateUserProvider':{
                    name:  'UpdateUserProvider',
                    path: 'api/UsuarioDisma/UpdateUserProvider'
                },
                'methodUpdateUserCompanyCreate':{
                    name:  'UpdateUserCompanyCreate',
                    path: 'api/UsuarioDisma/UpdateUserCompanyCreate'
                },
                'methodUpdateUserProviderCreate':{
                    name:  'UpdateUserProviderCreate',
                    path: 'api/UsuarioDisma/UpdateUserProviderCreate'
                },
                'methodUpdateBroker':{
                    name:  'UpdateBroker',
                    path: 'api/UsuarioDisma/UpdateBroker'
                },
                'methodUpdateBrokerCreate':{
                    name:  'UpdateBrokerCreate',
                    path: 'api/UsuarioDisma/UpdateBrokerCreate'
                },
                'methodDisableUserList':{
                    name:  'DisableUserList',
                    path: 'api/UsuarioDisma/DisableUserList'
                },
                'methodDisableUserAll':{
                    name:  'DisableUserAll',
                    path: 'api/UsuarioDisma/DisableUserAll'
                },
                'methodEnableUserList':{
                    name:  'EnableUserList',
                    path: 'api/UsuarioDisma/EnableUserList'
                },
                'methodEnableUserAll':{
                    name:  'EnableUserAll',
                    path: 'api/UsuarioDisma/EnableUserAll'
                },
                'methodGetUsersCloneList':{
                    name:  'GetUsersCloneList',
                    path: 'api/UsuarioDisma/GetUsersCloneList/{numCompany}/{numTypeGroup}/{numTypeUser}?userListText={userListText}&search={search}'
                },
                'methodValidUsersToClone':{
                    name:  'ValidUsersToClone',
                    path: 'api/UsuarioDisma/ValidUsersToClone?userListText={userListText}'
                },
                'methodGetUsersCloneAll':{
                    name:  'GetUsersCloneAll',
                    path: 'api/UsuarioDisma/GetUsersCloneAll?user={user}&numCompany={numCompany}&listUserTypesText={listUserTypesText}&listStatesText={listStatesText}&codeOffice={codeOffice}&numRole={numRole}&numApplication={numApplication}&numProfile={numProfile}&numTypeGroup={numTypeGroup}&numTypeUser={numTypeUser}&search={search}'
                },
                'methodGetAccessUserClone':{
                    name:  'GetAccessUserClone',
                    path: 'api/UsuarioDisma/GetAccessUserClone/{numUser}'
                },
                'methodCloneList':{
                    name:  'CloneList',
                    path: 'api/UsuarioDisma/CloneList'
                },
                'methodCloneAll':{
                    name:  'CloneAll',
                    path: 'api/UsuarioDisma/CloneAll'
                },
                'methodExportExcel':{
                    name:  'ExportExcel',
                    path: 'api/UsuarioDisma/ExportExcel?user={user}&numCompany={numCompany}&listUserTypesText={listUserTypesText}&listStatesText={listStatesText}&codeOffice={codeOffice}&numRole={numRole}&numApplication={numApplication}&numProfile={numProfile}&sortingType={sortingType}'
                },
                'methodRegularizeUserAD':{
                    name:  'RegularizeUserAD',
                    path: 'api/UsuarioDisma/RegularizeUserAD'
                },
                'methodUserTypeChange':{
                    name:  'UserTypeChange',
                    path: 'api/UsuarioDisma/UserTypeChange/{numUser}'
                },
                'methodGetUserAD':{
                    name:  'GetUserAD',
                    path: 'api/UsuarioDisma/GetUserAD?username={username}'
                },
                'methodDeleteUserAD':{
                    name:  'DeleteUserAD',
                    path: 'api/UsuarioDisma/DeleteUserAD?username={username}'
                },
                'methodTempDeleteUser':{
                    name:  'TempDeleteUser',
                    path: 'api/UsuarioDisma/TempDeleteUser'
                },
                'methodTempInsertUserAD':{
                    name:  'TempInsertUserAD',
                    path: 'api/UsuarioDisma/TempInsertUserAD'
                },
                'methodSendEmailService':{
                    name:  'SendEmailService',
                    path: 'api/UsuarioDisma/SendEmailService'
                },
                'methodGetUserAccessMongo':{
                    name:  'GetUserAccessMongo',
                    path: 'api/UsuarioDisma/GetUserAccessMongo?numUser={numUser}&type={type}'
                },
                'methodSendEmailUser':{
                    name:  'SendEmailUser',
                    path: 'api/UsuarioDisma/SendEmailUser?numUser={numUser}&email={email}&person={person}'
                },
                'methodSendEmailUserEjecutivoMapfre':{
                    name:  'SendEmailUserEjecutivoMapfre',
                    path: 'api/UsuarioDisma/SendEmailUserEjecutivoMapfre?email={email}&person={person}'
                },
                'methodGetUserCompanyClientVerifyIsValidByRuc':{
                    name:  'GetUserCompanyClientVerifyIsValidByRuc',
                    path: 'api/UsuarioDisma/GetUserCompanyClientVerifyIsValidByRuc?ruc={ruc}&groupType={groupType}'
                },
                'methodGetUserMapfreEVerifyIsValidByCode':{
                    name:  'GetUserMapfreEVerifyIsValidByCode',
                    path: 'api/UsuarioDisma/GetUserMapfreEVerifyIsValidByCode?UserCode={UserCode}'
                },
                'methodInsertUserMapfreE':{
                    name:  'InsertUserMapfreE',
                    path: 'api/UsuarioDisma/InsertUserMapfreE'
                },
                'methodInsertUserCompanyClient':{
                    name:  'InsertUserCompanyClient',
                    path: 'api/UsuarioDisma/InsertUserCompanyClient'
                },
                'methodInsertUserProvider':{
                    name:  'InsertUserProvider',
                    path: 'api/UsuarioDisma/InsertUserProvider'
                },
                'methodInsertUserBroker':{
                    name:  'InsertUserBroker',
                    path: 'api/UsuarioDisma/InsertUserBroker'
                },
                'methodInsertExternalUserClient':{
                    name:  'InsertExternalUserClient',
                    path: 'api/UsuarioDisma/InsertExternalUserClient'
                },
            }
        },
        controllerGeneral: {
            actions : {
                'methodGetUserTypes':{
                    name:  'GetUserTypes',
                    path: 'api/General/GetUserTypes'
                },
                'methodGetGroupTypes':{
                    name:  'GetGroupTypes',
                    path: 'api/General/GetGroupTypes'
                },
                'methodGetDashboardActions':{
                    name:  'GetDashboardActions',
                    path: 'api/General/GetDashboardActions'
                },
                'methodGetSortingTypes':{
                    name:  'GetSortingTypes',
                    path: 'api/General/GetSortingTypes'
                },
                'methodGetSortingTypesUser':{
                    name:  'GetSortingTypesUser',
                    path: 'api/General/GetSortingTypesUser'
                },
                'methodGetUserStatusTypes':{
                    name:  'GetUserStatusTypes',
                    path: 'api/General/GetUserStatusTypes'
                },
                'methodGetStatusTypes':{
                    name:  'GetStatusTypes',
                    path: 'api/General/GetStatusTypes'
                },
                'methodGetDocumentTypes':{
                    name:  'GetDocumentTypes',
                    path: 'api/General/GetDocumentTypes'
                },
                'methodGetCharges':{
                    name:  'GetCharges',
                    path: 'api/General/GetCharges'
                },
                'methodGetProducers':{
                    name:  'GetProducers',
                    path: 'api/General/GetProducers'
                },
                'methodGetSystemDomain':{
                    name:  'GetSystemDomain',
                    path: 'api/General/GetSystem'
                },
                'methodGetFileLog':{
                    name:  'GetFileLog',
                    path: 'api/General/logfile/{startDate}/{lastDate}'
                },
            }
        },
        controllerDashboardDisma: {
            actions : {
                'methodGetSearchParameters':{
                    name:  'GetSearchParameters',
                    path: 'api/DashboardDisma/GetSearchParameters'
                },
                'methodGetPagination':{
                    name:  'GetPagination',
                    path: 'api/DashboardDisma/GetPagination?UserStatus={UserStatus}&SearchParameter={SearchParameter}&StartDate={StartDate}&EndDate={EndDate}&SearchValue={SearchValue}&UserType={UserType}&PageNum={PageNum}&PageSize={PageSize}&SortingType={SortingType}'
                },
                'methodGetTotals':{
                    name:  'GetTotals',
                    path: 'api/DashboardDisma/GetTotals?SearchParameter={SearchParameter}&StartDate={StartDate}&EndDate={EndDate}&SearchValue={SearchValue}&UserType={UserType}'
                },
                'methodPostResendLink':{
                    name:  'PostResendLink',
                    path: 'api/DashboardDisma/PostResendLink?UserNumber={UserNumber}&TokenStatusCode={TokenStatusCode}&Person={Person}&Email={Email}'
                },
                'methodPostExpireLink':{
                    name:  'PostExpireLink',
                    path: 'api/DashboardDisma/PostExpireLink?UserNumber={UserNumber}'
                },
            }
        },
        controllerAplicacion: {
            actions : {
                'methodGetPagination':{
                    name:  'GetPagination',
                    path: 'api/Aplicacion/GetPagination?SearchValue={SearchValue}&PageNum={PageNum}&PageSize={PageSize}&SortingType={SortingType}'
                },
                'methodInsert':{
                    name:  'Insert',
                    path: 'api/Aplicacion/Insert'
                },
                'methodUpdate':{
                    name:  'Update',
                    path: 'api/Aplicacion/Update'
                },
                'methodUpdateStatus':{
                    name:  'UpdateStatus',
                    path: 'api/Aplicacion/UpdateStatus'
                },
                'methodGetDetail':{
                    name:  'GetDetail',
                    path: 'api/Aplicacion/GetDetail/{NumberApplication}'
                },
                'methodObjectInsert':{
                    name:  'ObjectInsert',
                    path: 'api/Aplicacion/ObjectInsert'
                },
                'methodObjectUpdate':{
                    name:  'ObjectUpdate',
                    path: 'api/Aplicacion/ObjectUpdate'
                },
                'methodObjectUpdateStatus':{
                    name:  'ObjectUpdateStatus',
                    path: 'api/Aplicacion/ObjectUpdateStatus'
                },
                'methodObjectUpdatePosition':{
                    name:  'ObjectUpdatePosition',
                    path: 'api/Aplicacion/ObjectUpdatePosition'
                },
                'methodObjectGetDetail':{
                    name:  'ObjectGetDetail',
                    path: 'api/Aplicacion/ObjectGetDetail/{ApplicationNumber}/{ObjectNumber}'
                },
                'methodObjectGetChildren':{
                    name:  'ObjectGetChildren',
                    path: 'api/Aplicacion/ObjectGetChildren/{ApplicationNumber}/{ProfileNumber}'
                },
                'methodObjectGetAll':{
                    name:  'ObjectGetAll',
                    path: 'api/Aplicacion/ObjectGetAll/{ApplicationNumber}'
                },
                'methodGetObjectsByApplication':{
                    name:  'GetObjectsByApplication',
                    path: 'api/Aplicacion/GetObjectsByApplication/{NumAplicacion}?Search={Search}'
                },
                'methodProfileInsert':{
                    name:  'ProfileInsert',
                    path: 'api/Aplicacion/ProfileInsert'
                },
                'methodProfileUpdate':{
                    name:  'ProfileUpdate',
                    path: 'api/Aplicacion/ProfileUpdate'
                },
                'methodProfileDelete':{
                    name:  'ProfileDelete',
                    path: 'api/Aplicacion/ProfileDelete?ProfileNumber={ProfileNumber}&ApplicationNumber={ApplicationNumber}'
                },
                'methodProfileUpdateStatus':{
                    name:  'ProfileUpdateStatus',
                    path: 'api/Aplicacion/ProfileUpdateStatus'
                },
                'methodProfileGetDetail':{
                    name:  'ProfileGetDetail',
                    path: 'api/Aplicacion/ProfileGetDetail/{ApplicationNumber}/{ProfileNumber}'
                },
                'methodProfileGetAll':{
                    name:  'ProfileGetAll',
                    path: 'api/Aplicacion/ProfileGetAll/{ApplicationNumber}?SearchValue={SearchValue}&PageNum={PageNum}&PageSize={PageSize}&SortingType={SortingType}'
                },
                'methodProfileGetChildren':{
                    name:  'ProfileGetChildren',
                    path: 'api/Aplicacion/ProfileGetChildren/{ApplicationNumber}/{ProfileNumber}'
                },
                'methodProfileDetailUpdateStatus':{
                    name:  'ProfileDetailUpdateStatus',
                    path: 'api/Aplicacion/ProfileDetailUpdateStatus'
                },
                'methodProfileObjectGetAll':{
                    name:  'ProfileObjectGetAll',
                    path: 'api/Aplicacion/ProfileObjectGetAll/{ApplicationNumber}/{ProfileNumber}'
                },
                'methodExport':{
                    name:  'Export',
                    path: 'api/Aplicacion/report?applicationCode={applicationCode}&profileCode={profileCode}'
                },
            }
        },
        controllerAudit: {
            actions : {
                'methodCloneListUser':{
                    name:  'CloneListUser',
                    path: 'api/Audit/CloneListUser'
                },
                'methodRollbackCloneListUser':{
                    name:  'RollbackCloneListUser',
                    path: 'api/Audit/RollbackCloneUser'
                },
                'methodDisableUserList':{
                    name:  'DisableUserList',
                    path: 'api/Audit/DisableUserList'
                },
                'methodEnableUserList':{
                    name:  'EnableUserList',
                    path: 'api/Audit/EnableUserList'
                },
                'methodSaveUserAction':{
                    name:  'SaveUserAction',
                    path: 'api/Audit/SaveUserAction'
                },
                'methodSaveRoleAction':{
                    name:  'SaveRoleAction',
                    path: 'api/Audit/SaveRoleAction'
                },
                'methodSaveApplicationAction':{
                    name:  'SaveApplicationAction',
                    path: 'api/Audit/SaveApplicationAction'
                },
                'methodSaveConfigurationAction':{
                    name:  'SaveConfigurationAction',
                    path: 'api/Audit/SaveConfigurationAction'
                },
            }
        },
        controllerEmail: {
            actions : {
                'methodSendEmailUser':{
                    name:  'SendEmailUser',
                    path: 'api/Email/SendEmailUser'
                },
                'methodSaveUserAction':{
                    name:  'SaveUserAction',
                    path: 'api/Email/SaveUserAction'
                },
            }
        },
        controllerConfiguracion: {
            actions : {
                'methodGetDetail':{
                    name:  'GetDetail',
                    path: 'api/Configuracion/GetDetail'
                },
                'methodUpdate':{
                    name:  'Update',
                    path: 'api/Configuracion/Update'
                },
            }
        },
        controllerCargaMasiva: {
            actions : {
                'methodCreacionMasivaClienteEmpresa':{
                    name:  'CreacionMasivaClienteEmpresa',
                    path: 'api/CargaMasiva/CreacionMasivaClienteEmpresa'
                },
                'methodCreacionMasivaEjecutivoMapfre':{
                    name:  'CreacionMasivaEjecutivoMapfre',
                    path: 'api/CargaMasiva/CreacionMasivaEjecutivoMapfre'
                },
                'methodClonacionMasivaEjecutivoMapfre':{
                    name:  'ClonacionMasivaEjecutivoMapfre',
                    path: 'api/CargaMasiva/ClonacionMasivaEjecutivoMapfre'
                },
                'methodRollbackClonacionMasivaEjecutivoMapfre':{
                    name:  'RollbackClonacionMasivaEjecutivoMapfre',
                    path: 'api/CargaMasiva/RollbackClonacionMasivaEjecutivoMapfre'
                },
                'methodCreacionMasivaProveedor':{
                    name:  'CreacionMasivaProveedor',
                    path: 'api/CargaMasiva/CreacionMasivaProveedor'
                },
                'methodCreacionMasivaBroker':{
                    name:  'CreacionMasivaBroker',
                    path: 'api/CargaMasiva/CreacionMasivaBroker'
                },
                'methodDescargarFormato':{
                    name:  'DescargarFormato',
                    path: 'api/CargaMasiva/DescargarFormato?TipoArchivo={TipoArchivo}'
                },
                'methodDescargarErrores':{
                    name:  'DescargarErrores',
                    path: 'api/CargaMasiva/DescargarErrores'
                },
                'methodDeshabilitacionUsuarios':{
                    name:  'DeshabilitacionUsuarios',
                    path: 'api/CargaMasiva/DeshabilitacionUsuarios'
                },
                'methodHabilitacionUsuarios':{
                    name:  'HabilitacionUsuarios',
                    path: 'api/CargaMasiva/HabilitacionUsuarios'
                },
                'methodModificacionUsuariosRegular':{
                    name:  'ModificacionUsuariosRegular',
                    path: 'api/CargaMasiva/ModificacionUsuariosRegular'
                },
                'methodModificacionUsuariosAdmin':{
                    name:  'ModificacionUsuariosAdmin',
                    path: 'api/CargaMasiva/ModificacionUsuariosAdmin'
                },
                'methodProcesarUsuariosClienteEmpresa':{
                    name:  'ProcesarUsuariosClienteEmpresa',
                    path: 'api/CargaMasiva/ProcesarUsuariosClienteEmpresa'
                },
                'methodProcesarUsuariosBroker':{
                    name:  'ProcesarUsuariosBroker',
                    path: 'api/CargaMasiva/ProcesarUsuariosBroker'
                },
                'methodProcesarUsuariosProveedor':{
                    name:  'ProcesarUsuariosProveedor',
                    path: 'api/CargaMasiva/ProcesarUsuariosProveedor'
                },
                'methodProcesarUsuariosEjecutivoMapfre':{
                    name:  'ProcesarUsuariosEjecutivoMapfre',
                    path: 'api/CargaMasiva/ProcesarUsuariosEjecutivoMapfre'
                },
                'methodProcesarClonacionUsuariosEjecutivoMapfre':{
                    name:  'ProcesarClonacionUsuariosEjecutivoMapfre',
                    path: 'api/CargaMasiva/ProcesarClonacionUsuariosEjecutivoMapfre'
                },
                'methodRollbackClonacionUsuariosEjecutivoMapfre':{
                    name:  'RollbackClonacionUsuariosEjecutivoMapfre',
                    path: 'api/CargaMasiva/RollbackClonacionUsuariosEjecutivoMapfre'
                },
                'methodProcesarModificacionUsuario':{
                    name:  'ProcesarModificacionUsuario',
                    path: 'api/CargaMasiva/ProcesarModificacionUsuario'
                },
                'methodProcesarDeshabilitacionUsuario':{
                    name:  'ProcesarDeshabilitacionUsuario',
                    path: 'api/CargaMasiva/ProcesarDeshabilitacionUsuario'
                },
                'methodProcesarHabilitacionUsuario':{
                    name:  'ProcesarHabilitacionUsuario',
                    path: 'api/CargaMasiva/ProcesarHabilitacionUsuario'
                },
            }
        }
    })



     module.factory("proxyDashboardAdministrador", ['oimProxySeguridad', 'httpData', function(oimProxySeguridad, httpData){
        return {
                'GetSearchParameters' : function( showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + 'api/DashboardAdministrador/GetSearchParameters',
                                         undefined, undefined, showSpin)
                },
                'GetPagination' : function(CompanyNumber, UserStatus, SearchParameter, StartDate, EndDate, SearchValue, PageNum, PageSize, SortingType, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/DashboardAdministrador/GetPagination?CompanyNumber={CompanyNumber}&UserStatus={UserStatus}&SearchParameter={SearchParameter}&StartDate={StartDate}&EndDate={EndDate}&SearchValue={SearchValue}&PageNum={PageNum}&PageSize={PageSize}&SortingType={SortingType}',
                                                    { 'CompanyNumber':  { value: CompanyNumber, defaultValue:'0' } ,'UserStatus':  { value: UserStatus, defaultValue:'0' } ,'SearchParameter':  { value: SearchParameter, defaultValue:'0' } ,'StartDate':  { value: StartDate, defaultValue:'' } ,'EndDate':  { value: EndDate, defaultValue:'' } ,'SearchValue':  { value: SearchValue, defaultValue:'' } ,'PageNum':  { value: PageNum, defaultValue:'1' } ,'PageSize':  { value: PageSize, defaultValue:'10' } ,'SortingType':  { value: SortingType, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetTotals' : function(CompanyNumber, SearchParameter, StartDate, EndDate, SearchValue, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/DashboardAdministrador/GetTotals?CompanyNumber={CompanyNumber}&SearchParameter={SearchParameter}&StartDate={StartDate}&EndDate={EndDate}&SearchValue={SearchValue}',
                                                    { 'CompanyNumber':  { value: CompanyNumber, defaultValue:'0' } ,'SearchParameter':  { value: SearchParameter, defaultValue:'0' } ,'StartDate':  { value: StartDate, defaultValue:'' } ,'EndDate':  { value: EndDate, defaultValue:'' } ,'SearchValue':  { value: SearchValue, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'PostResendLink' : function(UserNumber, TokenStatusCode, Person, Email, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + helper.formatNamed('api/DashboardAdministrador/PostResendLink?UserNumber={UserNumber}&TokenStatusCode={TokenStatusCode}&Person={Person}&Email={Email}',
                                                    { 'UserNumber':  { value: UserNumber, defaultValue:'' } ,'TokenStatusCode':  { value: TokenStatusCode, defaultValue:'' } ,'Person':  { value: Person, defaultValue:'' } ,'Email':  { value: Email, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'PostExpireLink' : function(UserNumber, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + helper.formatNamed('api/DashboardAdministrador/PostExpireLink?UserNumber={UserNumber}',
                                                    { 'UserNumber':  { value: UserNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyRol", ['oimProxySeguridad', 'httpData', function(oimProxySeguridad, httpData){
        return {
                'GetProfilesByApplication' : function(NumApplication, Search, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/Rol/Application/{NumApplication}/GetProfiles?Search={Search}',
                                                    { 'NumApplication':  { value: NumApplication, defaultValue:'' } ,'Search':  { value: Search, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetRoles' : function(numTypeGroup, search, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/Rol/GetRoles?numTypeGroup={numTypeGroup}&search={search}',
                                                    { 'numTypeGroup':  { value: numTypeGroup, defaultValue:'' } ,'search':  { value: search, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetPaginationCustom' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Rol/GetPaginationCustom',
                                         request, undefined, showSpin)
                },
                'GetGroupTypes' : function( showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + 'api/Rol/GetGroupTypes',
                                         undefined, undefined, showSpin)
                },
                'GetPagination' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Rol/GetPagination',
                                         request, undefined, showSpin)
                },
                'ExportExcel' : function( showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + 'api/Rol/ExportExcel',
                                         undefined, undefined, showSpin)
                },
                'GetDetail' : function(NumberRol, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/Rol/GetDetail/{NumberRol}',
                                                    { 'NumberRol':  { value: NumberRol, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetDetailByCode' : function(RoleCode, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/Rol/GetDetailByCode?RoleCode={RoleCode}',
                                                    { 'RoleCode':  { value: RoleCode, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetCheckCode' : function(RoleCode, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/Rol/GetCheckCode?RoleCode={RoleCode}',
                                                    { 'RoleCode':  { value: RoleCode, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Insert' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Rol/Insert',
                                         request, undefined, showSpin)
                },
                'UpdateCreate' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Rol/UpdateCreate',
                                         request, undefined, showSpin)
                },
                'Update' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Rol/Update',
                                         request, undefined, showSpin)
                },
                'UpdateStatus' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Rol/UpdateStatus',
                                         request, undefined, showSpin)
                },
                'ApplicationGetDetail' : function(NumRole, NumApplication, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/Rol/ApplicationGetDetail?NumRole={NumRole}&NumApplication={NumApplication}',
                                                    { 'NumRole':  { value: NumRole, defaultValue:'' } ,'NumApplication':  { value: NumApplication, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ApplicationGetAll' : function(RolNumber, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/Rol/ApplicationGetAll/{RolNumber}',
                                                    { 'RolNumber':  { value: RolNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ApplicationInsert' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Rol/ApplicationInsert',
                                         request, undefined, showSpin)
                },
                'ApplicationProfileInsert' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Rol/ApplicationProfileInsert',
                                         request, undefined, showSpin)
                },
                'ApplicationUpdateStatus' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Rol/ApplicationUpdateStatus',
                                         request, undefined, showSpin)
                },
                'ApplicationDelete' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Rol/ApplicationDelete',
                                         request, undefined, showSpin)
                },
                'ApplicationProfileUpdateStatus' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Rol/ApplicationProfileUpdateStatus',
                                         request, undefined, showSpin)
                },
                'ApplicationProfileDelete' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Rol/ApplicationProfileDelete',
                                         request, undefined, showSpin)
                },
                'RoleGetAll' : function(RolNumber, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/Rol/RoleGetAll/{RolNumber}',
                                                    { 'RolNumber':  { value: RolNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'RoleInsert' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Rol/RoleInsert',
                                         request, undefined, showSpin)
                },
                'RoleUpdateStatus' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Rol/RoleUpdateStatus',
                                         request, undefined, showSpin)
                },
                'RoleDelete' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Rol/RoleDelete',
                                         request, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyUsuarioAdministrador", ['oimProxySeguridad', 'httpData', function(oimProxySeguridad, httpData){
        return {
                'GetPagination' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioAdministrador/GetPagination',
                                         request, undefined, showSpin)
                },
                'DisableUserAll' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioAdministrador/DisableUserAll',
                                         request, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyUsuarioDisma", ['oimProxySeguridad', 'httpData', function(oimProxySeguridad, httpData){
        return {
                'GetCompanies' : function(search, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/GetCompanies?search={search}',
                                                    { 'search':  { value: search, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetUserTypes' : function( showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/GetUserTypes',
                                         undefined, undefined, showSpin)
                },
                'GetUserStates' : function( showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/GetUserStates',
                                         undefined, undefined, showSpin)
                },
                'GetOffices' : function(search, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/GetOffices?search={search}',
                                                    { 'search':  { value: search, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetRoles' : function(numTypeGroup, search, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/GetRoles?numTypeGroup={numTypeGroup}&search={search}',
                                                    { 'numTypeGroup':  { value: numTypeGroup, defaultValue:'' } ,'search':  { value: search, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetApplications' : function(search, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/GetApplications?search={search}',
                                                    { 'search':  { value: search, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetProfiles' : function(search, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/GetProfiles?search={search}',
                                                    { 'search':  { value: search, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetCollectors' : function(search, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/GetCollectors?search={search}',
                                                    { 'search':  { value: search, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetAgents' : function(search, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/GetAgents?search={search}',
                                                    { 'search':  { value: search, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetAgentsBroker' : function(ruc, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/GetAgentsBroker?ruc={ruc}',
                                                    { 'ruc':  { value: ruc, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetPagination' : function(model, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/GetPagination',
                                         model, undefined, showSpin)
                },
                'GetDetail' : function(numUser, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/GetDetail/{numUser}',
                                                    { 'numUser':  { value: numUser, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetRoleAdm' : function(numUser, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/GetRoleAdm/{numUser}',
                                                    { 'numUser':  { value: numUser, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'IsCopyAccess' : function(numUser, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/IsCopyAccess/{numUser}',
                                                    { 'numUser':  { value: numUser, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'CopyAccessToRegular' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/CopyAccessToRegular',
                                         request, undefined, showSpin)
                },
                'GetAccessByUserAdministrator' : function(numUser, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/GetAccessByUserAdministrator/{numUser}',
                                                    { 'numUser':  { value: numUser, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetProfilesByUserByApplication' : function(numUser, numApplication, search, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/GetProfilesByUserByApplication/{numUser}/{numApplication}?search={search}',
                                                    { 'numUser':  { value: numUser, defaultValue:'' } ,'numApplication':  { value: numApplication, defaultValue:'' } ,'search':  { value: search, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetProfilesByUserByApplicationRegular' : function(numUser, numApplication, search, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/GetProfilesByUserByApplicationRegular/{numUser}/{numApplication}?search={search}',
                                                    { 'numUser':  { value: numUser, defaultValue:'' } ,'numApplication':  { value: numApplication, defaultValue:'' } ,'search':  { value: search, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetAccessByUserRegular' : function(numUser, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/GetAccessByUserRegular/{numUser}',
                                                    { 'numUser':  { value: numUser, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'UpdateAccessStatus' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/UpdateAccessStatus',
                                         request, undefined, showSpin)
                },
                'Test' : function( showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/test',
                                         undefined, undefined, showSpin)
                },
                'UpdateAccessStatusPrincipal' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/UpdateAccessStatusPrincipal',
                                         request, undefined, showSpin)
                },
                'InsertAccessPrincipal' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/InsertAccessPrincipal',
                                         request, undefined, showSpin)
                },
                'InsertAccessAssociated' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/InsertAccessAssociated',
                                         request, undefined, showSpin)
                },
                'InsertAccessRegular' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/InsertAccessRegular',
                                         request, undefined, showSpin)
                },
                'UpdateAccessPrincipal' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/UpdateAccessPrincipal',
                                         request, undefined, showSpin)
                },
                'UpdateAccessAssociated' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/UpdateAccessAssociated',
                                         request, undefined, showSpin)
                },
                'UpdateAccessRegular' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/UpdateAccessRegular',
                                         request, undefined, showSpin)
                },
                'DeleteAccess' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/DeleteAccess',
                                         request, undefined, showSpin)
                },
                'DeleteAccessRegular' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/DeleteAccessRegular',
                                         request, undefined, showSpin)
                },
                'InsertRoleToUser' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/InsertRoleToUser',
                                         request, undefined, showSpin)
                },
                'DeleteRoleFromUser' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/DeleteRoleFromUser',
                                         request, undefined, showSpin)
                },
                'UpdateMapfre' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/UpdateMapfre',
                                         request, undefined, showSpin)
                },
                'UpdateUserCompany' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/UpdateUserCompany',
                                         request, undefined, showSpin)
                },
                'UpdateUserProvider' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/UpdateUserProvider',
                                         request, undefined, showSpin)
                },
                'UpdateUserCompanyCreate' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/UpdateUserCompanyCreate',
                                         request, undefined, showSpin)
                },
                'UpdateUserProviderCreate' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/UpdateUserProviderCreate',
                                         request, undefined, showSpin)
                },
                'UpdateBroker' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/UpdateBroker',
                                         request, undefined, showSpin)
                },
                'UpdateBrokerCreate' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/UpdateBrokerCreate',
                                         request, undefined, showSpin)
                },
                'DisableUserList' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/DisableUserList',
                                         request, undefined, showSpin)
                },
                'DisableUserAll' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/DisableUserAll',
                                         request, undefined, showSpin)
                },
                'EnableUserList' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/EnableUserList',
                                         request, undefined, showSpin)
                },
                'EnableUserAll' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/EnableUserAll',
                                         request, undefined, showSpin)
                },
                'GetUsersCloneList' : function(numCompany, numTypeGroup, numTypeUser, userListText, search, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/GetUsersCloneList/{numCompany}/{numTypeGroup}/{numTypeUser}?userListText={userListText}&search={search}',
                                                    { 'numCompany':  { value: numCompany, defaultValue:'' } ,'numTypeGroup':  { value: numTypeGroup, defaultValue:'' } ,'numTypeUser':  { value: numTypeUser, defaultValue:'' } ,'userListText':  { value: userListText, defaultValue:'' } ,'search':  { value: search, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ValidUsersToClone' : function(userListText, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/ValidUsersToClone?userListText={userListText}',
                                                    { 'userListText':  { value: userListText, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetUsersCloneAll' : function(user, numCompany, listUserTypesText, listStatesText, codeOffice, numRole, numApplication, numProfile, numTypeGroup, numTypeUser, search, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/GetUsersCloneAll?user={user}&numCompany={numCompany}&listUserTypesText={listUserTypesText}&listStatesText={listStatesText}&codeOffice={codeOffice}&numRole={numRole}&numApplication={numApplication}&numProfile={numProfile}&numTypeGroup={numTypeGroup}&numTypeUser={numTypeUser}&search={search}',
                                                    { 'user':  { value: user, defaultValue:'' } ,'numCompany':  { value: numCompany, defaultValue:'' } ,'listUserTypesText':  { value: listUserTypesText, defaultValue:'' } ,'listStatesText':  { value: listStatesText, defaultValue:'' } ,'codeOffice':  { value: codeOffice, defaultValue:'' } ,'numRole':  { value: numRole, defaultValue:'' } ,'numApplication':  { value: numApplication, defaultValue:'' } ,'numProfile':  { value: numProfile, defaultValue:'' } ,'numTypeGroup':  { value: numTypeGroup, defaultValue:'0' } ,'numTypeUser':  { value: numTypeUser, defaultValue:'0' } ,'search':  { value: search, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetAccessUserClone' : function(numUser, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/GetAccessUserClone/{numUser}',
                                                    { 'numUser':  { value: numUser, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'CloneList' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/CloneList',
                                         request, undefined, showSpin)
                },
                'CloneAll' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/CloneAll',
                                         request, undefined, showSpin)
                },
                'ExportExcel' : function(user, numCompany, listUserTypesText, listStatesText, codeOffice, numRole, numApplication, numProfile, sortingType, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/ExportExcel?user={user}&numCompany={numCompany}&listUserTypesText={listUserTypesText}&listStatesText={listStatesText}&codeOffice={codeOffice}&numRole={numRole}&numApplication={numApplication}&numProfile={numProfile}&sortingType={sortingType}',
                                                    { 'user':  { value: user, defaultValue:'' } ,'numCompany':  { value: numCompany, defaultValue:'' } ,'listUserTypesText':  { value: listUserTypesText, defaultValue:'' } ,'listStatesText':  { value: listStatesText, defaultValue:'' } ,'codeOffice':  { value: codeOffice, defaultValue:'' } ,'numRole':  { value: numRole, defaultValue:'' } ,'numApplication':  { value: numApplication, defaultValue:'' } ,'numProfile':  { value: numProfile, defaultValue:'' } ,'sortingType':  { value: sortingType, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'RegularizeUserAD' : function( showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/RegularizeUserAD',
                                         undefined, undefined, showSpin)
                },
                'UserTypeChange' : function(numUser, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/UserTypeChange/{numUser}',
                                                    { 'numUser':  { value: numUser, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetUserAD' : function(username, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/GetUserAD?username={username}',
                                                    { 'username':  { value: username, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'DeleteUserAD' : function(username, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/DeleteUserAD?username={username}',
                                                    { 'username':  { value: username, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'TempDeleteUser' : function( showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/TempDeleteUser',
                                         undefined, undefined, showSpin)
                },
                'TempInsertUserAD' : function(user, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/TempInsertUserAD',
                                         user, undefined, showSpin)
                },
                'SendEmailService' : function( showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/SendEmailService',
                                         undefined, undefined, showSpin)
                },
                'GetUserAccessMongo' : function(numUser, type, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/GetUserAccessMongo?numUser={numUser}&type={type}',
                                                    { 'numUser':  { value: numUser, defaultValue:'' } ,'type':  { value: type, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'SendEmailUser' : function(numUser, email, person, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/SendEmailUser?numUser={numUser}&email={email}&person={person}',
                                                    { 'numUser':  { value: numUser, defaultValue:'' } ,'email':  { value: email, defaultValue:'' } ,'person':  { value: person, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'SendEmailUserEjecutivoMapfre' : function(email, person, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/SendEmailUserEjecutivoMapfre?email={email}&person={person}',
                                                    { 'email':  { value: email, defaultValue:'' } ,'person':  { value: person, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetUserCompanyClientVerifyIsValidByRuc' : function(ruc, groupType, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/GetUserCompanyClientVerifyIsValidByRuc?ruc={ruc}&groupType={groupType}',
                                                    { 'ruc':  { value: ruc, defaultValue:'' } ,'groupType':  { value: groupType, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetUserMapfreEVerifyIsValidByCode' : function(UserCode, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/UsuarioDisma/GetUserMapfreEVerifyIsValidByCode?UserCode={UserCode}',
                                                    { 'UserCode':  { value: UserCode, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'InsertUserMapfreE' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/InsertUserMapfreE',
                                         request, undefined, showSpin)
                },
                'InsertUserCompanyClient' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/InsertUserCompanyClient',
                                         request, undefined, showSpin)
                },
                'InsertUserProvider' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/InsertUserProvider',
                                         request, undefined, showSpin)
                },
                'InsertUserBroker' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/InsertUserBroker',
                                         request, undefined, showSpin)
                },
                'InsertExternalUserClient' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/UsuarioDisma/InsertExternalUserClient',
                                         request, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyGeneral", ['oimProxySeguridad', 'httpData', function(oimProxySeguridad, httpData){
        return {
                'GetUserTypes' : function( showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + 'api/General/GetUserTypes',
                                         undefined, undefined, showSpin)
                },
                'GetGroupTypes' : function( showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + 'api/General/GetGroupTypes',
                                         undefined, undefined, showSpin)
                },
                'GetDashboardActions' : function( showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + 'api/General/GetDashboardActions',
                                         undefined, undefined, showSpin)
                },
                'GetSortingTypes' : function( showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + 'api/General/GetSortingTypes',
                                         undefined, undefined, showSpin)
                },
                'GetSortingTypesUser' : function( showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + 'api/General/GetSortingTypesUser',
                                         undefined, undefined, showSpin)
                },
                'GetUserStatusTypes' : function( showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + 'api/General/GetUserStatusTypes',
                                         undefined, undefined, showSpin)
                },
                'GetStatusTypes' : function( showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + 'api/General/GetStatusTypes',
                                         undefined, undefined, showSpin)
                },
                'GetDocumentTypes' : function( showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + 'api/General/GetDocumentTypes',
                                         undefined, undefined, showSpin)
                },
                'GetCharges' : function( showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + 'api/General/GetCharges',
                                         undefined, undefined, showSpin)
                },
                'GetProducers' : function( showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + 'api/General/GetProducers',
                                         undefined, undefined, showSpin)
                },
                'GetSystemDomain' : function( showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + 'api/General/GetSystem',
                                         undefined, undefined, showSpin)
                },
                'GetFileLog' : function(startDate, lastDate, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/General/logfile/{startDate}/{lastDate}',
                                                    { 'startDate':  { value: startDate, defaultValue:'' } ,'lastDate':  { value: lastDate, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyDashboardDisma", ['oimProxySeguridad', 'httpData', function(oimProxySeguridad, httpData){
        return {
                'GetSearchParameters' : function( showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + 'api/DashboardDisma/GetSearchParameters',
                                         undefined, undefined, showSpin)
                },
                'GetPagination' : function(UserStatus, SearchParameter, StartDate, EndDate, SearchValue, UserType, PageNum, PageSize, SortingType, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/DashboardDisma/GetPagination?UserStatus={UserStatus}&SearchParameter={SearchParameter}&StartDate={StartDate}&EndDate={EndDate}&SearchValue={SearchValue}&UserType={UserType}&PageNum={PageNum}&PageSize={PageSize}&SortingType={SortingType}',
                                                    { 'UserStatus':  { value: UserStatus, defaultValue:'0' } ,'SearchParameter':  { value: SearchParameter, defaultValue:'0' } ,'StartDate':  { value: StartDate, defaultValue:'' } ,'EndDate':  { value: EndDate, defaultValue:'' } ,'SearchValue':  { value: SearchValue, defaultValue:'' } ,'UserType':  { value: UserType, defaultValue:'0' } ,'PageNum':  { value: PageNum, defaultValue:'1' } ,'PageSize':  { value: PageSize, defaultValue:'10' } ,'SortingType':  { value: SortingType, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetTotals' : function(SearchParameter, StartDate, EndDate, SearchValue, UserType, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/DashboardDisma/GetTotals?SearchParameter={SearchParameter}&StartDate={StartDate}&EndDate={EndDate}&SearchValue={SearchValue}&UserType={UserType}',
                                                    { 'SearchParameter':  { value: SearchParameter, defaultValue:'0' } ,'StartDate':  { value: StartDate, defaultValue:'' } ,'EndDate':  { value: EndDate, defaultValue:'' } ,'SearchValue':  { value: SearchValue, defaultValue:'' } ,'UserType':  { value: UserType, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'PostResendLink' : function(UserNumber, TokenStatusCode, Person, Email, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + helper.formatNamed('api/DashboardDisma/PostResendLink?UserNumber={UserNumber}&TokenStatusCode={TokenStatusCode}&Person={Person}&Email={Email}',
                                                    { 'UserNumber':  { value: UserNumber, defaultValue:'' } ,'TokenStatusCode':  { value: TokenStatusCode, defaultValue:'' } ,'Person':  { value: Person, defaultValue:'' } ,'Email':  { value: Email, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'PostExpireLink' : function(UserNumber, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + helper.formatNamed('api/DashboardDisma/PostExpireLink?UserNumber={UserNumber}',
                                                    { 'UserNumber':  { value: UserNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyAplicacion", ['oimProxySeguridad', 'httpData', function(oimProxySeguridad, httpData){
        return {
                'GetPagination' : function(SearchValue, PageNum, PageSize, SortingType, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/Aplicacion/GetPagination?SearchValue={SearchValue}&PageNum={PageNum}&PageSize={PageSize}&SortingType={SortingType}',
                                                    { 'SearchValue':  { value: SearchValue, defaultValue:'' } ,'PageNum':  { value: PageNum, defaultValue:'1' } ,'PageSize':  { value: PageSize, defaultValue:'10' } ,'SortingType':  { value: SortingType, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'Insert' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Aplicacion/Insert',
                                         request, undefined, showSpin)
                },
                'Update' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Aplicacion/Update',
                                         request, undefined, showSpin)
                },
                'UpdateStatus' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Aplicacion/UpdateStatus',
                                         request, undefined, showSpin)
                },
                'GetDetail' : function(NumberApplication, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/Aplicacion/GetDetail/{NumberApplication}',
                                                    { 'NumberApplication':  { value: NumberApplication, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ObjectInsert' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Aplicacion/ObjectInsert',
                                         request, undefined, showSpin)
                },
                'ObjectUpdate' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Aplicacion/ObjectUpdate',
                                         request, undefined, showSpin)
                },
                'ObjectUpdateStatus' : function(list, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Aplicacion/ObjectUpdateStatus',
                                         list, undefined, showSpin)
                },
                'ObjectUpdatePosition' : function(list, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Aplicacion/ObjectUpdatePosition',
                                         list, undefined, showSpin)
                },
                'ObjectGetDetail' : function(ApplicationNumber, ObjectNumber, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/Aplicacion/ObjectGetDetail/{ApplicationNumber}/{ObjectNumber}',
                                                    { 'ApplicationNumber':  { value: ApplicationNumber, defaultValue:'' } ,'ObjectNumber':  { value: ObjectNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ObjectGetChildren' : function(ApplicationNumber, ProfileNumber, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/Aplicacion/ObjectGetChildren/{ApplicationNumber}/{ProfileNumber}',
                                                    { 'ApplicationNumber':  { value: ApplicationNumber, defaultValue:'' } ,'ProfileNumber':  { value: ProfileNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ObjectGetAll' : function(ApplicationNumber, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/Aplicacion/ObjectGetAll/{ApplicationNumber}',
                                                    { 'ApplicationNumber':  { value: ApplicationNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetObjectsByApplication' : function(NumAplicacion, Search, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/Aplicacion/GetObjectsByApplication/{NumAplicacion}?Search={Search}',
                                                    { 'NumAplicacion':  { value: NumAplicacion, defaultValue:'' } ,'Search':  { value: Search, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ProfileInsert' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Aplicacion/ProfileInsert',
                                         request, undefined, showSpin)
                },
                'ProfileUpdate' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Aplicacion/ProfileUpdate',
                                         request, undefined, showSpin)
                },
                'ProfileDelete' : function(ProfileNumber, ApplicationNumber, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + helper.formatNamed('api/Aplicacion/ProfileDelete?ProfileNumber={ProfileNumber}&ApplicationNumber={ApplicationNumber}',
                                                    { 'ProfileNumber':  { value: ProfileNumber, defaultValue:'' } ,'ApplicationNumber':  { value: ApplicationNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ProfileUpdateStatus' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Aplicacion/ProfileUpdateStatus',
                                         request, undefined, showSpin)
                },
                'ProfileGetDetail' : function(ApplicationNumber, ProfileNumber, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/Aplicacion/ProfileGetDetail/{ApplicationNumber}/{ProfileNumber}',
                                                    { 'ApplicationNumber':  { value: ApplicationNumber, defaultValue:'' } ,'ProfileNumber':  { value: ProfileNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ProfileGetAll' : function(ApplicationNumber, SearchValue, PageNum, PageSize, SortingType, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/Aplicacion/ProfileGetAll/{ApplicationNumber}?SearchValue={SearchValue}&PageNum={PageNum}&PageSize={PageSize}&SortingType={SortingType}',
                                                    { 'ApplicationNumber':  { value: ApplicationNumber, defaultValue:'' } ,'SearchValue':  { value: SearchValue, defaultValue:'' } ,'PageNum':  { value: PageNum, defaultValue:'1' } ,'PageSize':  { value: PageSize, defaultValue:'10' } ,'SortingType':  { value: SortingType, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'ProfileGetChildren' : function(ApplicationNumber, ProfileNumber, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/Aplicacion/ProfileGetChildren/{ApplicationNumber}/{ProfileNumber}',
                                                    { 'ApplicationNumber':  { value: ApplicationNumber, defaultValue:'' } ,'ProfileNumber':  { value: ProfileNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ProfileDetailUpdateStatus' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Aplicacion/ProfileDetailUpdateStatus',
                                         request, undefined, showSpin)
                },
                'ProfileObjectGetAll' : function(ApplicationNumber, ProfileNumber, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/Aplicacion/ProfileObjectGetAll/{ApplicationNumber}/{ProfileNumber}',
                                                    { 'ApplicationNumber':  { value: ApplicationNumber, defaultValue:'' } ,'ProfileNumber':  { value: ProfileNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Export' : function(applicationCode, profileCode, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/Aplicacion/report?applicationCode={applicationCode}&profileCode={profileCode}',
                                                    { 'applicationCode':  { value: applicationCode, defaultValue:'' } ,'profileCode':  { value: profileCode, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyAudit", ['oimProxySeguridad', 'httpData', function(oimProxySeguridad, httpData){
        return {
                'CloneListUser' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Audit/CloneListUser',
                                         request, undefined, showSpin)
                },
                'RollbackCloneListUser' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Audit/RollbackCloneUser',
                                         request, undefined, showSpin)
                },
                'DisableUserList' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Audit/DisableUserList',
                                         request, undefined, showSpin)
                },
                'EnableUserList' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Audit/EnableUserList',
                                         request, undefined, showSpin)
                },
                'SaveUserAction' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Audit/SaveUserAction',
                                         request, undefined, showSpin)
                },
                'SaveRoleAction' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Audit/SaveRoleAction',
                                         request, undefined, showSpin)
                },
                'SaveApplicationAction' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Audit/SaveApplicationAction',
                                         request, undefined, showSpin)
                },
                'SaveConfigurationAction' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Audit/SaveConfigurationAction',
                                         request, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyEmail", ['oimProxySeguridad', 'httpData', function(oimProxySeguridad, httpData){
        return {
                'SendEmailUser' : function(model, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Email/SendEmailUser',
                                         model, undefined, showSpin)
                },
                'SaveUserAction' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Email/SaveUserAction',
                                         request, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyConfiguracion", ['oimProxySeguridad', 'httpData', function(oimProxySeguridad, httpData){
        return {
                'GetDetail' : function( showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + 'api/Configuracion/GetDetail',
                                         undefined, undefined, showSpin)
                },
                'Update' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/Configuracion/Update',
                                         request, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCargaMasiva", ['oimProxySeguridad', 'httpData', function(oimProxySeguridad, httpData){
        return {
                'CreacionMasivaClienteEmpresa' : function( showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/CargaMasiva/CreacionMasivaClienteEmpresa',
                                         undefined, undefined, showSpin)
                },
                'CreacionMasivaEjecutivoMapfre' : function( showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/CargaMasiva/CreacionMasivaEjecutivoMapfre',
                                         undefined, undefined, showSpin)
                },
                'ClonacionMasivaEjecutivoMapfre' : function( showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/CargaMasiva/ClonacionMasivaEjecutivoMapfre',
                                         undefined, undefined, showSpin)
                },
                'RollbackClonacionMasivaEjecutivoMapfre' : function( showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/CargaMasiva/RollbackClonacionMasivaEjecutivoMapfre',
                                         undefined, undefined, showSpin)
                },
                'CreacionMasivaProveedor' : function( showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/CargaMasiva/CreacionMasivaProveedor',
                                         undefined, undefined, showSpin)
                },
                'CreacionMasivaBroker' : function( showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/CargaMasiva/CreacionMasivaBroker',
                                         undefined, undefined, showSpin)
                },
                'DescargarFormato' : function(TipoArchivo, showSpin){
                    return httpData['get'](oimProxySeguridad.endpoint + helper.formatNamed('api/CargaMasiva/DescargarFormato?TipoArchivo={TipoArchivo}',
                                                    { 'TipoArchivo':  { value: TipoArchivo, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'DescargarErrores' : function(request, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/CargaMasiva/DescargarErrores',
                                         request, undefined, showSpin)
                },
                'DeshabilitacionUsuarios' : function( showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/CargaMasiva/DeshabilitacionUsuarios',
                                         undefined, undefined, showSpin)
                },
                'HabilitacionUsuarios' : function( showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/CargaMasiva/HabilitacionUsuarios',
                                         undefined, undefined, showSpin)
                },
                'ModificacionUsuariosRegular' : function( showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/CargaMasiva/ModificacionUsuariosRegular',
                                         undefined, undefined, showSpin)
                },
                'ModificacionUsuariosAdmin' : function( showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/CargaMasiva/ModificacionUsuariosAdmin',
                                         undefined, undefined, showSpin)
                },
                'ProcesarUsuariosClienteEmpresa' : function(Usuarios, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/CargaMasiva/ProcesarUsuariosClienteEmpresa',
                                         Usuarios, undefined, showSpin)
                },
                'ProcesarUsuariosBroker' : function(Usuarios, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/CargaMasiva/ProcesarUsuariosBroker',
                                         Usuarios, undefined, showSpin)
                },
                'ProcesarUsuariosProveedor' : function(Usuarios, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/CargaMasiva/ProcesarUsuariosProveedor',
                                         Usuarios, undefined, showSpin)
                },
                'ProcesarUsuariosEjecutivoMapfre' : function(UsuariosEjecutivoMapfre, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/CargaMasiva/ProcesarUsuariosEjecutivoMapfre',
                                         UsuariosEjecutivoMapfre, undefined, showSpin)
                },
                'ProcesarClonacionUsuariosEjecutivoMapfre' : function(UsuariosEjecutivoMapfre, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/CargaMasiva/ProcesarClonacionUsuariosEjecutivoMapfre',
                                         UsuariosEjecutivoMapfre, undefined, showSpin)
                },
                'RollbackClonacionUsuariosEjecutivoMapfre' : function(UsuariosEjecutivoMapfre, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/CargaMasiva/RollbackClonacionUsuariosEjecutivoMapfre',
                                         UsuariosEjecutivoMapfre, undefined, showSpin)
                },
                'ProcesarModificacionUsuario' : function(Usuarios, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/CargaMasiva/ProcesarModificacionUsuario',
                                         Usuarios, undefined, showSpin)
                },
                'ProcesarDeshabilitacionUsuario' : function(Usuarios, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/CargaMasiva/ProcesarDeshabilitacionUsuario',
                                         Usuarios, undefined, showSpin)
                },
                'ProcesarHabilitacionUsuario' : function(Usuarios, showSpin){
                    return httpData['post'](oimProxySeguridad.endpoint + 'api/CargaMasiva/ProcesarHabilitacionUsuario',
                                         Usuarios, undefined, showSpin)
                }
        };
     }]);
});
