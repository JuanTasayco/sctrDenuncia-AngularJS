define([
	'angular',
	'constants',
	'lodash',
], function (
	ng,
	constants,
	_) {

		var appSecurity = ng.module('appSecurity');

		appSecurity.factory('seguridadFactory', [
			'$http'
			, '$q'
			, '$window'
			, 'httpData'
			, 'mpSpin'
			, 'proxyDashboardDisma'
			, 'proxyDashboardAdministrador'
			, 'proxyGeneral'
			, 'proxyRol'
			, 'proxyUsuarioAdministrador'
			, 'proxyUsuarioDisma'
			, 'proxyConfiguracion'
			, 'proxyAplicacion'
			, 'proxyCargaMasiva'
			, 'mModalAlert'
			, 'oimProxySeguridad'
			, function (
				$http
				, $q
				, $window
				, httpData
				, mpSpin
				, proxyDashboardDisma
				, proxyDashboardAdministrador
				, proxyGeneral
				, proxyRol
				, proxyUsuarioAdministrador
				, proxyUsuarioDisma
				, proxyConfiguracion
				, proxyAplicacion
				, proxyCargaMasiva
				, mModalAlert
				, oimProxySeguridad
			) {

				// var base = constants.system.api.endpoints.policy;
				var base = constants.system.api.endpoints.seguridad;

				/*--------------------------------------
				Local Storage
				----------------------------------------*/
				var addVarLS = function (key, newObj) {
					var mydata = newObj;
					if (!_.isEmpty(mydata))
						$window.localStorage.setItem(key, JSON.stringify(mydata));
					else
						$window.localStorage.setItem(key, "");
				};

				var getVarLS = function (key) {
					var mydata = $window.localStorage.getItem(key);
					if (!_.isEmpty(mydata)) {
						mydata = JSON.parse(mydata);
					}
					return mydata || [];
				};

				var getStaticVarLS = function (key) {
					var mydata = $window.localStorage.getItem(key);
					return mydata;
				};

				var removeVarLS = function (key) {
					$window.localStorage.removeItem(key);
				};

				/*--------------------------------------
				Fechas
				----------------------------------------*/
				function daysDiff(date1, date2) {

					var MIL_SEC_DAY = 1000 * 60 * 60 * 24;

					var utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
					var utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

					return Math.floor((utc2 - utc1) / MIL_SEC_DAY);
				}

				/*--------------------------------------
				Generales
				----------------------------------------*/
				function getGroupTypes() {
					return proxyGeneral.GetGroupTypes();
				}

				function getUserTypes() {
					return proxyGeneral.GetUserTypes();
				}

				function getStatusTypes() {
					return proxyGeneral.GetStatusTypes();
        }

        function getSystemList() {
          return proxyGeneral.GetSystemDomain();
        }

				function getDashboardActions() {
					return proxyGeneral.GetDashboardActions();
				}

				function getSortingTypes() {
					return proxyGeneral.GetSortingTypes();
				}

				function getSortingTypesUser() {
					return proxyGeneral.GetSortingTypesUser();
				}

				function getUserStatusTypes() {
					return proxyGeneral.GetUserStatusTypes();
				}

				function getDocumentTypes() {
					return proxyGeneral.GetDocumentTypes();
				}

				function getCharges() {
					return proxyGeneral.GetCharges();
				}

				function autocompleteProducer(txt) {
					return proxyUsuarioDisma.GetAgents(txt, false);
				}

				function getProducers() {
					return proxyGeneral.GetProducers();
				}

				function getUserStatus() {
					return proxyGeneral.GetStatusTypes();
				}

				function sendEmailUser(numUser, email, person) {
					return proxyUsuarioDisma.SendEmailUser(numUser, email, person, true);
				}

				/*--------------------------------------
				Dashboard Disma
				----------------------------------------*/
				function getDismaSearchParams() {
					return proxyDashboardDisma.GetSearchParameters();
				}

				function getListDashboardDisma(params) {
					return proxyDashboardDisma.GetPagination(
						params.UserStatus
						, params.SearchParameter
						, params.StartDate
						, params.EndDate
						, params.SearchValue
						, params.UserType
						, params.PageNum
						, params.PageSize
						, params.SortingType
						, true);
				}

				function getLink(id) {
					return proxyDashboardDisma.GetLink(id);
				}

				function postDismaResendLink(params) {
					var UserNumber = params.UserNumber;
					var TokenStatusCode = params.TokenStatusCode;
					var Person = params.Person;
					var Email = params.Email;
					return proxyDashboardDisma.PostResendLink(UserNumber, TokenStatusCode, Person, Email, true);
				}

				function postExpireLink(num) {
					return proxyDashboardDisma.PostExpireLink(num, true);
				}

				function getTotals(params) {
					const opcMenu = localStorage.getItem('currentBreadcrumb');
					return httpData.get(
							oimProxySeguridad.endpoint + helper.formatNamed('api/DashboardDisma/GetTotals?SearchParameter={SearchParameter}&StartDate={StartDate}&EndDate={EndDate}&SearchValue={SearchValue}&UserType={UserType}&COD_OBJETO=.&OPC_MENU='+ opcMenu,
							{ 
								'SearchParameter':  { value: params.SearchParameter, defaultValue:'0' } ,
								'StartDate':  { value: params.StartDate, defaultValue:'' } ,
								'EndDate':  { value: params.EndDate, defaultValue:'' } ,
								'SearchValue':  { value: params.SearchValue, defaultValue:'' } ,
								'UserType':  { value: params.UserType, defaultValue:'0' }  }),
			 				undefined, 
							 undefined, 
							 true);
				}


				/*--------------------------------------
				Dashboard Admin Externo
				----------------------------------------*/

				function getTotalsAdminExt(params) {
					return proxyDashboardAdministrador.GetTotals(
						params.CompanyNumber
						, params.SearchParameter
						, params.StartDate
						, params.EndDate
						, params.SearchValue
						, true);
				}

				function getExtSearchParameters() {
					return proxyDashboardAdministrador.GetSearchParameters();
				}

				function getListDashboardAdministrador(params) {
					return proxyDashboardAdministrador.GetPagination(
						params.CompanyNumber
						, params.UserStatus
						, params.SearchParameter
						, params.StartDate
						, params.EndDate
						, params.SearchValue
						, params.PageNum
						, params.PageSize
						, params.SortingType
						, true);
				}

				function getExtLink(id) {
					return proxyDashboardAdministrador.GetLink(id);
				}

				function postExtResendLink() {
					return proxyDashboardAdministrador.PostResendLink();
				}

				function patchExtCancelLink() {
					return proxyDashboardAdministrador.PatchCancelLink();
				}

				/*--------------------------------------
				Usuario Admin
				----------------------------------------*/
				function getAdminUserList(params) {
					return proxyUsuarioAdministrador.GetPagination(params, true);
				}

				function disableAdminUserAll(params){
					return proxyUsuarioAdministrador.DisableUserAll(params, true);
				}

				/*--------------------------------------
				Usuario Disma
				----------------------------------------*/
				function getDismaCompanies(txt) {
					return proxyUsuarioDisma.GetCompanies(txt, false);
				}

				function getDismaUserTypes() {
					return proxyUsuarioDisma.GetUserTypes();
				}

				function getDismaUserStates() {
					return proxyUsuarioDisma.GetUserStates();
				}

				function getDismaUserList(params) {
					const opcMenu = localStorage.getItem('currentBreadcrumb');
					return httpData.post(
						oimProxySeguridad.endpoint + 'api/UsuarioDisma/GetPagination?COD_OBJETO=.&OPC_MENU='+ opcMenu,
                        params, 
						undefined, 
						true)
				}

				function getDismaSupplierDetail(ruc) {
					return proxyUsuarioDisma.GetSupplierDetail(ruc);
				}

				function getDismaBusinessCustomer() {
					return proxyUsuarioDisma.GetBusinessCustomer();
				}

				function getDismaBusinessCustomerDetail(ruc) {
					return proxyUsuarioDisma.GetBusinessCustomerDetail(ruc);
				}

				function getDismaBrokerDetail(ruc) {
					return proxyUsuarioDisma.GetBrokerDetail(ruc);
				}

				function postDismaBroker() {
					return proxyUsuarioDisma.PostBroker();
				}

				function postDismaSupplier() {
					return proxyUsuarioDisma.PostSupplier();
				}

				function postDismaBusinessCustomer() {
					return proxyUsuarioDisma.PostBusinessCustomer()
				}

				function putDismaBroker() {
					return proxyUsuarioDisma.PutBroker();
				}

				function putDismaSupplier() {
					return proxyUsuarioDisma.PutSupplier();
				}

				function putDismaBusinessCustomer() {
					return proxyUsuarioDisma.PutBusinessCustomer();
				}

				function postDismaClonarAccesos() {
					return proxyUsuarioDisma.PostClonarAccesos();
				}

				function postDismaDeshabilitacion() {
					return proxyUsuarioDisma.PostDisableUsers();
				}

				function autocompleteOffice(txt) {
					return proxyUsuarioDisma.GetOffices(txt);
				}

				function autocompleteRole(type, txt) {
					return proxyUsuarioDisma.GetRoles(type, txt, false);
				}

				function autocompleteApps(txt) {
					return proxyUsuarioDisma.GetApplications(txt);
				}

				function autocompleteProfile(txt) {
					return proxyUsuarioDisma.GetProfiles(txt);
				}

				function autocompleteCollectors(txt) {
					return proxyUsuarioDisma.GetCollectors(txt);
				}

				function getDismaViewDetails(id) {
					return proxyUsuarioDisma.GetDetail(id, true);
				}

				function getRoleAdm(id) {
					return proxyUsuarioDisma.GetRoleAdm(id, true);
				}

				function getAccessByUserAdmin(id) {
					return proxyUsuarioDisma.GetAccessByUserAdministrator(id, false);
				}

				function getAccessByUserRegular(id) {
					return proxyUsuarioDisma.GetAccessByUserRegular(id, false);
				}

				function insertRoleToUser(params) {
					return proxyUsuarioDisma.InsertRoleToUser(params, true);
				}

				function deleteAccess(params) {
					return proxyUsuarioDisma.DeleteAccess(params, true);
				}

				function deleteAccessRegular(params) {
					return proxyUsuarioDisma.DeleteAccessRegular(params, true);
				}

				function updateAccessStatusProfile(params) {
					return proxyUsuarioDisma.UpdateAccessStatus(params, true);
				}

				function updateAccessStatusProfilePrincipal(params) {
					return proxyUsuarioDisma.UpdateAccessStatusPrincipal(params, true);
				}

				function deleteRoleFromUser(params) {
					return proxyUsuarioDisma.DeleteRoleFromUser(params, true);
				}

				function validateCloneList(str){
					return proxyUsuarioDisma.ValidUsersToClone(str, true);
				}

				function getUsersCloneList(params) {
					return proxyUsuarioDisma.GetUsersCloneList(
						params.numCompany
						, params.numTypeGroup
						, params.numTypeUser
						, params.userListText
						, params.search
						, false);
				}

				function getUsersCloneAll(params) {
					return proxyUsuarioDisma.GetUsersCloneAll(
						params.user
						, params.numCompany
						, params.listUserTypesText
						, params.listStatesText
						, params.codeOffice
						, params.numRole
						, params.numApplication
						, params.numProfile
						, params.numTypeGroup
						, params.numTypeUser
						, params.search
						, false);
				}

				function getAccessUserClone(num){
					return proxyUsuarioDisma.GetAccessUserClone(num, true);
				}

				function cloneList(request){
					return proxyUsuarioDisma.CloneList(request, true);
				}

				function disableUserList(params) {
					return proxyUsuarioDisma.DisableUserList(params, true);
				}

				function disableUserAll(params) {
					return proxyUsuarioDisma.DisableUserAll(params, true);
				}

				function enableUserList(params) {
					return proxyUsuarioDisma.EnableUserList(params, true);
				}

				function enableUserAll(params) {
					return proxyUsuarioDisma.EnableUserAll(params, true);
				}

				function getAgentsBroker(ruc) {
					return proxyUsuarioDisma.GetAgentsBroker(ruc, true);
				}

				/*--------------------------------------
				CRUD Usuario Ejecutivo Mapfre
				----------------------------------------*/
				function getUserMapfreByCode(num) {
					return proxyUsuarioDisma.GetUserMapfreEVerifyIsValidByCode(num, true)
				}

				function insertUserMapfre(params) {
					return proxyUsuarioDisma.InsertUserMapfreE(params, true);
				}

				function updateMapfre(params) {
					const opcMenu = localStorage.getItem('currentBreadcrumb');
					return httpData.post(
						oimProxySeguridad.endpoint + 'api/UsuarioDisma/UpdateMapfre?COD_OBJETO=.&OPC_MENU='+ opcMenu,
                        params, 
						undefined, 
						true)
				}

				function sendEmailUserEjecutivoMapfre(email, person) {
					return proxyUsuarioDisma.SendEmailUserEjecutivoMapfre(email, person, true);
				}

				/*--------------------------------------
				FUNCIONES GENERALES
				----------------------------------------*/
				function getUserByRuc(ruc, groupType) {
					return proxyUsuarioDisma.GetUserCompanyClientVerifyIsValidByRuc(ruc, groupType, true);
				}

				function getProfilesByUserByApplication(numUser, numApplication, search, showSpin) {
					return proxyUsuarioDisma.GetProfilesByUserByApplication(numUser, numApplication, search, showSpin);
				}

				function getProfilesByUserByApplicationRegular(numUser, numApplication, search, showSpin) {
					return proxyUsuarioDisma.GetProfilesByUserByApplicationRegular(numUser, numApplication, search, showSpin);
				}

				function insertAccessPrincipal(params) {
					return proxyUsuarioDisma.InsertAccessPrincipal(params, true);
				}

				function insertAccessAssociated(params) {
					return proxyUsuarioDisma.InsertAccessAssociated(params, true);
				}

				function insertAccessRegular(params) {
					return proxyUsuarioDisma.InsertAccessRegular(params, true);
				}

				function updateAccessPrincipal(params) {
					return proxyUsuarioDisma.UpdateAccessPrincipal(params, true);
				}

				function updateAccessAssociated(params) {
					return proxyUsuarioDisma.UpdateAccessAssociated(params, true);
				}

				function updateAccessRegular(params) {
					return proxyUsuarioDisma.UpdateAccessRegular(params, true);
				}

				function isCopyAccess(numUser) {
					return proxyUsuarioDisma.IsCopyAccess(numUser, true);
				}

				function copyAccessToRegular(params) {
					return proxyUsuarioDisma.CopyAccessToRegular(params, true);
				}

				/*--------------------------------------
				CRUD Usuario Cliente Empresa
				----------------------------------------*/

				function insertUserCompanyClient(params) {
					return proxyUsuarioDisma.InsertUserCompanyClient(params, true);
				}

				function updateUserCompanyCreate(params) {
					return proxyUsuarioDisma.UpdateUserCompanyCreate(params, true);
				}

				function updateUserCompany(params) {
					return proxyUsuarioDisma.UpdateUserCompany(params, true);
				}

				/*--------------------------------------
				CRUD Usuario Proveedor
				----------------------------------------*/
				function insertUserProvider(params) {
					const opcMenu = localStorage.getItem('currentBreadcrumb');
					return httpData.post(
						oimProxySeguridad.endpoint + 'api/UsuarioDisma/InsertUserProvider?COD_OBJETO=.&OPC_MENU='+ opcMenu,
                        params, 
						undefined, 
						true)
				}

				function updateUserProvider(params) {
					const opcMenu = localStorage.getItem('currentBreadcrumb');
					return httpData.post(
						oimProxySeguridad.endpoint + 'api/UsuarioDisma/UpdateUserProvider?COD_OBJETO=.&OPC_MENU='+ opcMenu,
                        params, 
						undefined, 
						true)
				}

				function updateUserProviderCreate(params) {
					return proxyUsuarioDisma.UpdateUserProviderCreate(params, true);
				}

				/*--------------------------------------
				CRUD Usuario Corredor
				----------------------------------------*/
				function insertUserBroker(params) {
					const opcMenu = localStorage.getItem('currentBreadcrumb');
					return httpData.post(
						oimProxySeguridad.endpoint + 'api/UsuarioDisma/InsertUserBroker?COD_OBJETO=.&OPC_MENU='+ opcMenu,
                        params, 
						undefined, 
						true)
				}

				function updateUserBroker(params) {
					const opcMenu = localStorage.getItem('currentBreadcrumb');
					return httpData.post(
						oimProxySeguridad.endpoint + 'api/UsuarioDisma/UpdateBroker?COD_OBJETO=.&OPC_MENU='+ opcMenu,
                        params, 
						undefined, 
						true)
				}

				function updateUserBrokerCreate(params) {
					return proxyUsuarioDisma.UpdateBrokerCreate(params, true);
				}

				/*--------------------------------------
				CRUD Usuario Admin Ext
				----------------------------------------*/
				function insertUserExternal(params){
					return proxyUsuarioDisma.InsertExternalUserClient(params, true);
				}

				/*--------------------------------------
				Cargas Masivas
				----------------------------------------*/
				function creacionMasivaUsuario(file, type){
					const opcMenu = localStorage.getItem('currentBreadcrumb');
					switch(type){
						case 1: //'EJECUTIVO_MAPFRE':
							var url = 'api/CargaMasiva/CreacionMasivaEjecutivoMapfre'+'?COD_OBJETO=.&OPC_MENU='+opcMenu;
						break;
						case 2: //'CLIENTE_EMPRESA':
							var url = 'api/CargaMasiva/CreacionMasivaClienteEmpresa'+'?COD_OBJETO=.&OPC_MENU='+opcMenu;
						break;
						case 3: //'CORREDOR':
							var url = 'api/CargaMasiva/CreacionMasivaBroker'+'?COD_OBJETO=.&OPC_MENU='+opcMenu;
						break;
						case 4: //'PROVEEDOR':
							var url = 'api/CargaMasiva/CreacionMasivaProveedor'+'?COD_OBJETO=.&OPC_MENU='+opcMenu;
						break;
					}

					var formData = new FormData();
					formData.append('FileCargaMasiva', file);

					var deferred = $q.defer();
					$http.post(constants.system.api.endpoints['seguridad'] + url, formData, {
						transformRequest: angular.identity,
						headers: {'Content-Type': undefined },
						uploadEventHandlers: {
							progress: function(e) {
								mpSpin.start();
							}
						}
					})
					.success(function(data){
						mpSpin.end();
						deferred.resolve(data);
					})
					.error(function(data){
						mpSpin.end();
						deferred.reject(data);
					})
					mpSpin.end();
					return deferred.promise;
				}

				function descargarErrores(listaErrores, type, showSpin){
					var url = 'api/CargaMasiva/DescargarErrores';
					var params = {listaErrores: listaErrores, tipoArchivo: type};
					var deferred = $q.defer();
					$http.post(constants.system.api.endpoints['seguridad'] + url, params, {responseType: 'arraybuffer'})
					.success(function(data, status, headers){
						var type= headers('Content-Type');
						var disposition = headers('Content-Disposition');
						var defaultFileName = 'Errores.xlsx';
						if(disposition){
							var match = disposition.match(/.*fileName=\"?([^;\"]+)\"?.*/);
							if(match && match[1]) defaultFileName = match[1];
						}
						defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
						var blob = new Blob([data], { type: type });
						$window.saveAs(blob, defaultFileName);
						deferred.resolve(defaultFileName);
					})
					.error(function(data, status){
						deferred.reject();
					});
					return deferred.promise;
				}

				function procesarUsuariosEjecutivoMapfre(usuariosEjecutivoMapfre, showSpin){
					return proxyCargaMasiva.ProcesarUsuariosEjecutivoMapfre(usuariosEjecutivoMapfre, showSpin);
				}

				function procesarUsuariosClienteEmpresa(usuariosClienteEmpresa, showSpin){
					return proxyCargaMasiva.ProcesarUsuariosClienteEmpresa(usuariosClienteEmpresa, showSpin);
				}

				function procesarUsuariosBroker(usuariosBroker, showSpin){
					return proxyCargaMasiva.ProcesarUsuariosBroker(usuariosBroker, showSpin);
				}

				function procesarUsuariosProveedor(usuariosProveedor, showSpin){
					return proxyCargaMasiva.ProcesarUsuariosProveedor(usuariosProveedor, showSpin);
				}

				function deshabilitacionMasivaUsuario(file){
					const opcMenu = localStorage.getItem('currentBreadcrumb');
					var url = 'api/CargaMasiva/DeshabilitacionUsuarios?COD_OBJETO=.&OPC_MENU='+ opcMenu;
					var formData = new FormData();
					formData.append('FileCargaMasiva', file);

					var deferred = $q.defer();
					$http.post(constants.system.api.endpoints['seguridad'] + url, formData, {
						transformRequest: angular.identity,
						headers: {'Content-Type': undefined },
						uploadEventHandlers: {
							progress: function(e) {
								mpSpin.start();
							}
						}
					})
					.success(function(data){
						mpSpin.end();
						deferred.resolve(data);
					})
					.error(function(data){
						mpSpin.end();
						deferred.reject(data);
					})
					mpSpin.end();
					return deferred.promise;
				}

				function procesarDeshabilitacionUsuarios(listUsers, showSpin){
					return proxyCargaMasiva.ProcesarDeshabilitacionUsuario(listUsers, showSpin);
				}

				function modificacionMasivaUsuarios(file, type){
					const opcMenu = localStorage.getItem('currentBreadcrumb');
					switch(type){
						case 1: //REGULAR
							var url = 'api/CargaMasiva/ModificacionUsuariosRegular?COD_OBJETO=.&OPC_MENU='+ opcMenu;
							break;
						case 2: //ADMINISTRADOR
							var url = 'api/CargaMasiva/ModificacionUsuariosAdmin?COD_OBJETO=.&OPC_MENU='+ opcMenu;
							break;
					}

					var formData = new FormData();
					formData.append('FileCargaMasiva', file);

					var deferred = $q.defer();
					$http.post(constants.system.api.endpoints['seguridad'] + url, formData, {
						transformRequest: angular.identity,
						headers: {'Content-Type': undefined },
						uploadEventHandlers: {
							progress: function(e) {
								mpSpin.start();
							}
						}
					})
					.success(function(data){
						mpSpin.end();
						deferred.resolve(data);
					})
					.error(function(data){
						mpSpin.end();
						deferred.reject(data);
					})
					mpSpin.end();
					return deferred.promise;
				}

				function procesarModificacionUsuarios(listUsers, showSpin){
					return proxyCargaMasiva.ProcesarModificacionUsuario(listUsers, showSpin);
				}
				
				function clonacionMasivaUsuario(file, type){
					var url = 'api/CargaMasiva/ClonacionMasivaEjecutivoMapfre';
							
					var formData = new FormData();
					formData.append('FileCargaMasiva', file);

					var deferred = $q.defer();
					$http.post(constants.system.api.endpoints['seguridad'] + url, formData, {
						transformRequest: angular.identity,
						headers: {'Content-Type': undefined },
						uploadEventHandlers: {
							progress: function(e) {
								mpSpin.start();
							}
						}
					})
					.success(function(data){
						mpSpin.end();
						deferred.resolve(data);
					})
					.error(function(data){
						mpSpin.end();
						deferred.reject(data);
					})
					mpSpin.end();
					return deferred.promise;
				}
				
				function procesarClonacionUsuariosEjecutivoMapfre(usuariosEjecutivoMapfre, showSpin){
					return proxyCargaMasiva.ProcesarClonacionUsuariosEjecutivoMapfre(usuariosEjecutivoMapfre, showSpin);
				}
				
				
				function habilitacionUsuarios(file){
					var url = 'api/CargaMasiva/HabilitacionUsuarios';
							
					var formData = new FormData();
					formData.append('FileCargaMasiva', file);

					var deferred = $q.defer();
					$http.post(constants.system.api.endpoints['seguridad'] + url, formData, {
						transformRequest: angular.identity,
						headers: {'Content-Type': undefined },
						uploadEventHandlers: {
							progress: function(e) {
								mpSpin.start();
							}
						}
					})
					.success(function(data){
						mpSpin.end();
						deferred.resolve(data);
					})
					.error(function(data){
						mpSpin.end();
						deferred.reject(data);
					})
					mpSpin.end();
					return deferred.promise;
				}
				
				function procesarHabilitarUsuariosEjecutivoMapfre(usuariosEjecutivoMapfre, showSpin){
					return proxyCargaMasiva.ProcesarHabilitacionUsuario(usuariosEjecutivoMapfre, showSpin);
				}

				/*--------------------------------------
				Roles
				----------------------------------------*/
				function getRolApplication(request, showSpin) {
					const opcMenu = localStorage.getItem('currentBreadcrumb');
					return httpData.post(
						oimProxySeguridad.endpoint + 'api/Rol/GetPagination?COD_OBJETO=.&OPC_MENU='+ opcMenu,
                        request, 
						undefined, 
						showSpin)
				}

				function postUpdateStatusRole(request, showSpin) {
					return proxyRol.UpdateStatus(request, showSpin);
				}

				function getRolDetail(roleNumber, showSpin) {
					return proxyRol.GetDetail(roleNumber, showSpin);
				}

				function getGroupTypesRole() {
					return proxyRol.GetGroupTypes();
				}

				function postUpdateRole(request, showSpin) {
					return proxyRol.Update(request, showSpin);
				}

				function getApplicationByRole(roleNumber, showSpin) {
					return proxyRol.ApplicationGetAll(roleNumber, showSpin);
				}

				function autocompleteProfilesByApp(appId, txt, showSpin) {
					return proxyRol.GetProfilesByApplication(appId, txt, showSpin);
				}

				function postInsertApplicationRole(request, showSpin) {
					const opcMenu = localStorage.getItem('currentBreadcrumb');
					return httpData.post(
						oimProxySeguridad.endpoint + 'api/Rol/ApplicationInsert?COD_OBJETO=.&OPC_MENU='+ opcMenu,
						request, 
						undefined, 
						showSpin)
				}

				function postUpdateApplicationStatusRole(request, showSpin) {
					return proxyRol.ApplicationUpdateStatus(request, showSpin);
				}

				function postUpdateProfileStatusRole(request, showSpin) {
					return proxyRol.ApplicationProfileUpdateStatus(request, showSpin);
				}

				function postInsertProfileRole(request, showSpin) {
					const opcMenu = localStorage.getItem('currentBreadcrumb');
					return httpData.post(
						oimProxySeguridad.endpoint + 'api/Rol/ApplicationProfileInsert?COD_OBJETO=.&OPC_MENU='+ opcMenu,
                        request, 
						undefined, 
						showSpin)
				}

				function postDeleteProfileRole(request, showSpin) {
					return proxyRol.ApplicationProfileDelete(request, showSpin);
				}

				function postDeleteApplicationRole(request, showSpin) {
					return proxyRol.ApplicationDelete(request, showSpin);
				}

				function getSubRolesByRole(roleNumber, showSpin) {
					return proxyRol.RoleGetAll(roleNumber, showSpin);
				}

				function postInsertSubRole(request, showSpin) {
					return proxyRol.RoleInsert(request, showSpin);
				}

				function postUpdateStatusSubRole(request, showSpin) {
					return proxyRol.RoleUpdateStatus(request, showSpin);
				}

				function postDeleteSubRole(request, showSpin) {
					return proxyRol.RoleDelete(request, showSpin);
				}

				function postCreateRole(request, showSpin) {
					const opcMenu = localStorage.getItem('currentBreadcrumb');
					return httpData.post(
						oimProxySeguridad.endpoint + 'api/Rol/Insert?COD_OBJETO=.&OPC_MENU='+ opcMenu,
                        request, 
						undefined, 
						showSpin)
				}

				function postApplicationGetDetail(numRole, numApplication, showSpin) {
					return proxyRol.ApplicationGetDetail(numRole, numApplication, showSpin);
				}

				function postUpdateCreate(request, showSpin) {
					return proxyRol.UpdateCreate(request, showSpin);
				}

				function autocompleteRoles(numTypeGroup, search, showSpin){
					return proxyRol.GetRoles(numTypeGroup, search, showSpin);
				}
				/*--------------------------------------
				Aplicacion
				----------------------------------------*/
				function getApplicationPaginate(params) {
					const opcMenu = localStorage.getItem('currentBreadcrumb');
					return httpData.get(
						oimProxySeguridad.endpoint + helper.formatNamed('api/Aplicacion/GetPagination?SearchValue={SearchValue}&PageNum={PageNum}&PageSize={PageSize}&SortingType={SortingType}&COD_OBJETO=.&OPC_MENU='+ opcMenu,
						{ 
							'SearchValue':  { value: params.SearchValue, defaultValue:'' } ,
							'PageNum':  { value: params.PageNum, defaultValue:'1' } ,
							'PageSize':  { value: params.PageSize, defaultValue:'10' } ,
							'SortingType':  { value: params.SortingType, defaultValue:'0' }
						}),
						undefined, 
						undefined, 
						params.ShowSpin);
				}

				function postUpdateStatusAplication(request, showSpin) {
					return proxyAplicacion.UpdateStatus(request, showSpin);
				}

				function postCreateApplication(request, showSpin) {
					const opcMenu = localStorage.getItem('currentBreadcrumb');
					return httpData.post(
						oimProxySeguridad.endpoint + 'api/Aplicacion/Insert?COD_OBJETO=.&OPC_MENU='+ opcMenu,
                        request, 
						undefined, 
						showSpin);
				}

				function getApplicationDetail(numApplication, showSpin) {
					return proxyAplicacion.GetDetail(numApplication, showSpin);
				}

				function getObjectByApplication(applicationNumber, showSpin) {
					return proxyAplicacion.ObjectGetAll(applicationNumber, showSpin)
				}

				function postObjectInsertApplication(request, showSpin) {
					const opcMenu = localStorage.getItem('currentBreadcrumb');
					return httpData.post(
						oimProxySeguridad.endpoint + 'api/Aplicacion/ObjectInsert?COD_OBJETO=.&OPC_MENU='+ opcMenu,
                        request, 
						undefined, 
						showSpin);
				}

				function postUpdateStatusMenu(request, showSpin) {
					return proxyAplicacion.ObjectUpdateStatus(request, showSpin);
				}

				function postMenuUpdatePosition(request, showSpin) {
					const opcMenu = localStorage.getItem('currentBreadcrumb');
					return httpData.post(
						oimProxySeguridad.endpoint + 'api/Aplicacion/ObjectUpdatePosition?COD_OBJETO=.&OPC_MENU='+ opcMenu,
                        request, 
						undefined, 
						showSpin)
				}

				function postObjectUpdateApplication(request, showSpin) {
					return proxyAplicacion.ObjectUpdate(request, showSpin);
				}

				function getProfilesByApplication(params, showSpin) {
					const opcMenu = localStorage.getItem('currentBreadcrumb');
					return httpData.get(
						oimProxySeguridad.endpoint + helper.formatNamed('api/Aplicacion/ProfileGetAll/{ApplicationNumber}?SearchValue={SearchValue}&PageNum={PageNum}&PageSize={PageSize}&SortingType={SortingType}&COD_OBJETO=.&OPC_MENU='+ opcMenu,
                        { 
							'ApplicationNumber':  { value: params.applicationNumber, defaultValue:'' },
							'SearchValue':  { value: params.searchValue, defaultValue:'' } ,
							'PageNum':  { value: params.pageNum, defaultValue:'1' } ,
							'PageSize':  { value: params.pageSize, defaultValue:'10' } ,
							'SortingType':  { value: params.sortingType, defaultValue:'0' }  
						}),
                        undefined, 
						undefined, 
						showSpin);
				}

				function postProfileUpdateStatus(request, showSpin) {
					return proxyAplicacion.ProfileUpdateStatus(request, showSpin);
				}

				function postDeleteProfileByApplication(request, showSpin) {
					return;
				}

				function postInsertProfileApplication(request, showSpin) {
					const opcMenu = localStorage.getItem('currentBreadcrumb');
					return httpData.post(
						oimProxySeguridad.endpoint + 'api/Aplicacion/ProfileInsert?COD_OBJETO=.&OPC_MENU='+ opcMenu,
                        request, 
						undefined, 
						showSpin)
				}

				function getProfilesChildrenByApplication(applicationNumber, showSpin) {
					const opcMenu = localStorage.getItem('currentBreadcrumb');
					return httpData.get(
						oimProxySeguridad.endpoint + helper.formatNamed('api/Aplicacion/ProfileGetAll/{ApplicationNumber}?SearchValue={SearchValue}&PageNum={PageNum}&PageSize={PageSize}&SortingType={SortingType}&COD_OBJETO=.&OPC_MENU='+ opcMenu,
                        { 
							'ApplicationNumber':  { value: applicationNumber, defaultValue:'' } ,
							'SearchValue':  { value: '', defaultValue:'' } ,
							'PageNum':  { value: '1', defaultValue:'1' } ,
							'PageSize':  { value: '10', defaultValue:'10' } ,
							'SortingType':  { value: '0', defaultValue:'0' }  
						}),
                        undefined, 
						undefined, 
						showSpin)
				}

				function postUpdateApplication(request, showSpin) {
					const opcMenu = localStorage.getItem('currentBreadcrumb');
					return httpData.post(
						oimProxySeguridad.endpoint + 'api/Aplicacion/Update?COD_OBJETO=.&OPC_MENU='+ opcMenu,
                        request, 
						undefined, 
						showSpin)
				}

				function getObjectGetDetailApplication(ApplicationNumber, ObjectNumber, showSpin) {
					return proxyAplicacion.ObjectGetDetail(ApplicationNumber, ObjectNumber, showSpin);
				}

				function postProfileDeleteApplication(ProfileNumber, ApplicationNumber, showSpin) {
					return proxyAplicacion.ProfileDelete(ProfileNumber, ApplicationNumber, showSpin);
				}

				function getProfileGetChildren(ApplicationNumber, ProfileNumber, showSpin) {
					return proxyAplicacion.ProfileGetChildren(ApplicationNumber, ProfileNumber, showSpin);
				}

				function getProfileDetailApplication(ApplicationNumber, ProfileNumber, showSpin) {
					return proxyAplicacion.ProfileGetDetail(ApplicationNumber, ProfileNumber, showSpin);
				}

				function getObjectChildrenApplication(ApplicationNumber, ProfileNumber, showSpin) {
					return proxyAplicacion.ObjectGetChildren(ApplicationNumber, ProfileNumber, showSpin);
				}
				function postUpdateProfileApplication(request, showSpin) {
					return proxyAplicacion.ProfileUpdate(request, showSpin);
				}

				function autocompleteObjects(NumAplicacion, Search, showSpin){
					return proxyAplicacion.GetObjectsByApplication(NumAplicacion, Search, showSpin);
				}
				
				function exportExcel(urlDownload) {
					var token = getStaticVarLS('jwtMapfreToken_jwtMapfreToken');
					var deferred = $q.defer();
					mpSpin.start();
					$http({
							method: "GET",
							url: urlDownload,
							headers: { 
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization': 'Bearer '+token
							},
							responseType: 'arraybuffer'
					})
					.then(function(data){
							if(data.status == 200){
							var defaultFileName = 'Export.xlsx';
							var vtype=  data.headers(["content-type"]);
							var file = new Blob([data.data], {type: vtype});
							mpSpin.end();
							$window.saveAs(file, defaultFileName);
							deferred.resolve(defaultFileName);
							}else{
							mpSpin.end();
							mModalAlert.showError("Ha ocurrido un error al generar el Excel", "");
							}
					}, function(response){
							mpSpin.end();
							mModalAlert.showError("Ha ocurrido un error al generar el Excel", "");
					})
				}

				/*--------------------------------------
				Configuration
				----------------------------------------*/
				function updateConfig(params){
					return proxyConfiguracion.Update(params, true);
				}

				function getDetailsConfig(){
					return proxyConfiguracion.GetDetail(true);
				}
				
				function userTypeChange(params) {
					return proxyUsuarioDisma.UserTypeChange(params, true);
				}
				function onlyView(){
					const opcMenu = localStorage.getItem('currentSeguridadObj').split('|');
					const seguridadApps = getVarLS('evoSubMenuSEGURIDAD')[0];
					if(opcMenu && seguridadApps.nombreCabecera === opcMenu[0].toUpperCase()){
						if(seguridadApps.items && seguridadApps.items.length > 0){
							return _.find(seguridadApps.items,
								function(item){
								  return item.nombreCorto ===  opcMenu[1].toUpperCase();
								});
						}else{
							return { soloLectura: true }
						}
						
					}else{
						return { soloLectura: true }
					}
					
				}

				return {
					//local storage
					addVarLS: addVarLS,
					getVarLS: getVarLS,
					getStaticVarLS: getStaticVarLS,
					removeVarLS: removeVarLS,

					//fechas
					daysDiff: daysDiff,

					//General
					getGroupTypes: getGroupTypes,
					getUserTypes: getUserTypes,
					getDashboardActions: getDashboardActions,
					getSortingTypes: getSortingTypes,
					getSortingTypesUser: getSortingTypesUser,
					getUserStatusTypes: getUserStatusTypes,
          getStatusTypes: getStatusTypes,
          getSystemList: getSystemList,
					getDocumentTypes: getDocumentTypes,
					getCharges: getCharges,
					autocompleteProducer: autocompleteProducer,
					getProducers: getProducers,
					getUserStatus: getUserStatus,
					sendEmailUser: sendEmailUser,

					//Dashboard Disma
					getDismaSearchParams: getDismaSearchParams,
					getListDashboardDisma: getListDashboardDisma,
					getLink: getLink,
					//postResendLink: postResendLink,
					postDismaResendLink: postDismaResendLink,
					postExpireLink: postExpireLink,
					getTotals: getTotals,

					//Dashboard Admin Externo
					getExtSearchParameters: getExtSearchParameters,
					getListDashboardAdministrador: getListDashboardAdministrador,
					getExtLink: getExtLink,
					postExtResendLink: postExtResendLink,
					patchExtCancelLink: patchExtCancelLink,

					//Usuario Admin
					getTotalsAdminExt: getTotalsAdminExt,
					getDismaCompanies: getDismaCompanies,
					getAdminUserList: getAdminUserList,
					disableAdminUserAll: disableAdminUserAll,

					//Usuario Disma
					getDismaUserTypes: getDismaUserTypes,
					getDismaUserStates: getDismaUserStates,
					getDismaUserList: getDismaUserList,
					getDismaSupplierDetail: getDismaSupplierDetail,
					getDismaBusinessCustomer: getDismaBusinessCustomer,
					getDismaBusinessCustomerDetail: getDismaBusinessCustomerDetail,
					getDismaBrokerDetail: getDismaBrokerDetail,
					postDismaBroker: postDismaBroker,
					postDismaSupplier: postDismaSupplier,
					postDismaBusinessCustomer: postDismaBusinessCustomer,
					putDismaBroker: putDismaBroker,
					putDismaSupplier: putDismaSupplier,
					putDismaBusinessCustomer: putDismaBusinessCustomer,
					postDismaClonarAccesos: postDismaClonarAccesos,
					postDismaDeshabilitacion: postDismaDeshabilitacion,
					postDismaResendLink: postDismaResendLink,
					autocompleteOffice: autocompleteOffice,
					autocompleteRole: autocompleteRole,
					autocompleteApps: autocompleteApps,
					autocompleteProfile: autocompleteProfile,
					autocompleteCollectors: autocompleteCollectors,
					getDismaViewDetails: getDismaViewDetails,
					getRoleAdm: getRoleAdm,
					getAccessByUserAdmin: getAccessByUserAdmin,
					getAccessByUserRegular: getAccessByUserRegular,
					insertRoleToUser: insertRoleToUser,
					deleteAccess: deleteAccess,
					deleteAccessRegular: deleteAccessRegular,
					updateAccessStatusProfile: updateAccessStatusProfile,
					updateAccessStatusProfilePrincipal: updateAccessStatusProfilePrincipal,
					deleteRoleFromUser: deleteRoleFromUser,
					validateCloneList: validateCloneList,
					getUsersCloneList: getUsersCloneList,
					cloneList: cloneList,
					getUsersCloneAll: getUsersCloneAll,
					getAccessUserClone: getAccessUserClone,
					disableUserList: disableUserList,
					disableUserAll: disableUserAll,
					enableUserList: enableUserList,
					enableUserAll: enableUserAll,
					getAgentsBroker: getAgentsBroker,

					//CRUD Usuario Ejecutivo Mapfre
					getUserMapfreByCode: getUserMapfreByCode,
					insertUserMapfre: insertUserMapfre,
					updateMapfre: updateMapfre,
					sendEmailUserEjecutivoMapfre: sendEmailUserEjecutivoMapfre,

					//FUNCIONES GENERALES
					getUserByRuc: getUserByRuc,
					getProfilesByUserByApplication: getProfilesByUserByApplication,
					getProfilesByUserByApplicationRegular: getProfilesByUserByApplicationRegular,
					insertAccessPrincipal: insertAccessPrincipal,
					insertAccessAssociated: insertAccessAssociated,
					insertAccessRegular: insertAccessRegular,
					updateAccessPrincipal: updateAccessPrincipal,
					updateAccessAssociated: updateAccessAssociated,
					updateAccessRegular: updateAccessRegular,
					isCopyAccess: isCopyAccess,
					copyAccessToRegular: copyAccessToRegular,

					//CRUD Usuario Proveedor
					insertUserProvider: insertUserProvider,
					updateUserProvider: updateUserProvider,
					updateUserProviderCreate: updateUserProviderCreate,

					//CRUD Usuario Corredor
					insertUserBroker: insertUserBroker,
					updateUserBroker: updateUserBroker,
					updateUserBrokerCreate: updateUserBrokerCreate,

					//CRUD Usuario Cliente empresa
					insertUserCompanyClient: insertUserCompanyClient,
					updateUserCompanyCreate: updateUserCompanyCreate,
					updateUserCompany: updateUserCompany,

					//CRUD Usuario Admin Externo
					insertUserExternal: insertUserExternal,

					//Cargas Masivas
					creacionMasivaUsuario: creacionMasivaUsuario,
					descargarErrores: descargarErrores,
					procesarUsuariosEjecutivoMapfre: procesarUsuariosEjecutivoMapfre,
					procesarUsuariosClienteEmpresa: procesarUsuariosClienteEmpresa,
					procesarUsuariosBroker: procesarUsuariosBroker,
					procesarUsuariosProveedor: procesarUsuariosProveedor,
					deshabilitacionMasivaUsuario: deshabilitacionMasivaUsuario,
					procesarDeshabilitacionUsuarios: procesarDeshabilitacionUsuarios,
					modificacionMasivaUsuarios: modificacionMasivaUsuarios,
					procesarModificacionUsuarios: procesarModificacionUsuarios,
					clonacionMasivaUsuario: clonacionMasivaUsuario,
					procesarClonacionUsuariosEjecutivoMapfre: procesarClonacionUsuariosEjecutivoMapfre,
					habilitacionUsuarios: habilitacionUsuarios,
					procesarHabilitarUsuariosEjecutivoMapfre: procesarHabilitarUsuariosEjecutivoMapfre,

					//Roles
					getRolApplication: getRolApplication,
					postUpdateStatusRole: postUpdateStatusRole,
					getRolDetail: getRolDetail,
					getGroupTypesRole: getGroupTypesRole,
					postUpdateRole: postUpdateRole,
					getApplicationByRole: getApplicationByRole,
					autocompleteProfilesByApp: autocompleteProfilesByApp,
					postInsertApplicationRole: postInsertApplicationRole,
					postUpdateApplicationStatusRole: postUpdateApplicationStatusRole,
					postUpdateProfileStatusRole: postUpdateProfileStatusRole,
					postInsertProfileRole: postInsertProfileRole,
					postDeleteProfileRole: postDeleteProfileRole,
					postDeleteApplicationRole: postDeleteApplicationRole,
					getSubRolesByRole: getSubRolesByRole,
					postInsertSubRole: postInsertSubRole,
					postUpdateStatusSubRole: postUpdateStatusSubRole,
					postDeleteSubRole: postDeleteSubRole,
					postCreateRole: postCreateRole,
					postApplicationGetDetail: postApplicationGetDetail,
					postUpdateCreate: postUpdateCreate,
					autocompleteRoles: autocompleteRoles,

					//Aplicacion
					getApplicationPaginate: getApplicationPaginate,
					postUpdateStatusAplication: postUpdateStatusAplication,
					postCreateApplication: postCreateApplication,
					getApplicationDetail: getApplicationDetail,
					getObjectByApplication: getObjectByApplication,
					postObjectInsertApplication: postObjectInsertApplication,
					postUpdateStatusMenu: postUpdateStatusMenu,
					postMenuUpdatePosition: postMenuUpdatePosition,
					postObjectUpdateApplication: postObjectUpdateApplication,
					getProfilesByApplication: getProfilesByApplication,
					postProfileUpdateStatus: postProfileUpdateStatus,
					postDeleteProfileByApplication: postDeleteProfileByApplication,
					postInsertProfileApplication: postInsertProfileApplication,
					getProfilesChildrenByApplication: getProfilesChildrenByApplication,
					postUpdateApplication: postUpdateApplication,
					getObjectGetDetailApplication: getObjectGetDetailApplication,
					postProfileDeleteApplication: postProfileDeleteApplication,
					getProfileGetChildren: getProfileGetChildren,
					getProfileDetailApplication: getProfileDetailApplication,
					getObjectChildrenApplication: getObjectChildrenApplication,
					postUpdateProfileApplication: postUpdateProfileApplication,
					autocompleteObjects: autocompleteObjects,
					exportExcel: exportExcel,

					//Configuration
					updateConfig: updateConfig,
					getDetailsConfig: getDetailsConfig,
					
					userTypeChange: userTypeChange,
					onlyView: onlyView
				};

			}]);

	});
