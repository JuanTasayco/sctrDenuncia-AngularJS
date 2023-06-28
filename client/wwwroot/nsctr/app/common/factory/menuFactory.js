'use strict'

define([
	'angular', 'constants', 'nsctr_constants'
], function(angular, constants, nsctr_constants){

		var appNsctr = angular.module('appNsctr');
		/*########################
    # factory
    ########################*/
		appNsctr.factory('menuFactory',
			['proxyMenu', 'nsctrAuthorize', '$q',
			function(proxyMenu, nsctrAuthorize, $q){

			function _getCurrentMenu(prefixState){
				var vMenu = [
					{
						headerName: nsctr_constants.securityCode.processes.headerName,
						label: 'Procesos',
						activeMenu: 'processes',
						state: prefixState + 'SearchClient',
						actived: false,
						menu:[]
					},
					{
						headerName: nsctr_constants.securityCode.evaluations.headerName,
						label: 'Evaluaciones',
						activeMenu: 'evaluations',
						state: prefixState + 'Evaluation',
						actived: false,
						menu:[]
					},
					{
						headerName: nsctr_constants.securityCode.queries.headerName,
						label: 'Consultas',
						activeMenu: 'queries',
						state: '',
						actived: false,
						menu:[
							{
								shortName: nsctr_constants.securityCode.insureds.shortName,
								codeObj: nsctr_constants.securityCode.insureds.codeObj.dev.concat(nsctr_constants.securityCode.insureds.codeObj.prod),
								label: 'Asegurados',
								state: prefixState + 'SearchInsured',
								actived: false,
								menu:[]
							},
							{
								shortName: nsctr_constants.securityCode.censusIndividual.shortName,
								codeObj: nsctr_constants.securityCode.censusIndividual.codeObj.dev.concat(nsctr_constants.securityCode.censusIndividual.codeObj.prod),
								label: 'Padron individual',
								state: prefixState + 'QueriesCensusIndividual',
								actived: false,
								menu:[]
							},
							{
								shortName: nsctr_constants.securityCode.censusMassive.shortName,
								codeObj: nsctr_constants.securityCode.censusMassive.codeObj.dev.concat(nsctr_constants.securityCode.censusMassive.codeObj.prod),
								label: 'Padron masivo',
								state: prefixState + 'QueriesCensusMassive',
								actived: false,
								menu:[]
							},
							{
								shortName: nsctr_constants.securityCode.proofs.shortName,
								codeObj: nsctr_constants.securityCode.proofs.codeObj.dev.concat(nsctr_constants.securityCode.proofs.codeObj.prod),
								label: 'Constancias',
								state: prefixState + 'SearchProofs',
								actived: false,
								menu:[]
							}
						]
					},
					{
						headerName: nsctr_constants.securityCode.maintenance.headerName,
						label: 'Mantenimiento',
						activeMenu: 'maintenance',
						state: '',
						actived: false,
						menu:[
							{
								shortName: nsctr_constants.securityCode.medics.shortName,
								codeObj: nsctr_constants.securityCode.medics.codeObj.dev.concat(nsctr_constants.securityCode.medics.codeObj.prod),
								label: 'Médicos',
								state: prefixState + 'MaintenanceMedic',
								actived: false,
								menu:[]
							},
							{
								shortName: nsctr_constants.securityCode.locations.shortName,
								codeObj: nsctr_constants.securityCode.locations.codeObj.dev.concat(nsctr_constants.securityCode.locations.codeObj.prod),
								label: 'Locaciones',
								state: prefixState + 'MaintenanceLocation',
								actived: false,
								menu:[]
							},
							{
								shortName: nsctr_constants.securityCode.asignations.shortName,
								codeObj: nsctr_constants.securityCode.asignations.codeObj.dev.concat(nsctr_constants.securityCode.asignations.codeObj.prod),
								label: 'Asignaciones',
								state: prefixState + 'MaintenanceAssignation',
								actived: false,
								menu:[]
							}
						]
					},
					{
						headerName: nsctr_constants.securityCode.reports.headerName,
						label: 'Reportes',
						activeMenu: 'reports',
						state: prefixState + 'Reports',
						actived: false,
						menu:[]
					},
					{
						headerName: nsctr_constants.securityCode.coverages.headerName,
						label: 'Coberturas',
						activeMenu: 'coverages',
						state: '',
						actived: false,
						menu:[
							{
								shortName: nsctr_constants.securityCode.provisional.shortName,
								codeObj: nsctr_constants.securityCode.provisional.codeObj.dev.concat(nsctr_constants.securityCode.provisional.codeObj.prod),
								label: 'Provisional',
								state: prefixState + 'SearchProvisionalCoverage',
								actived: false,
								menu:[]
							}
						]
					}
				];
				return vMenu;
			}

			function _generateMenu(module, data){
				function _filterMenu(menu, data){
					var vMenu = angular.copy(menu),
							vFilteredMenu = _.filter(vMenu, function(menuValue, menuKey){
								var vItem = _.find(data, function(dataValue, dataKey){
									var vExist = (dataValue.nombreCabecera)
																? dataValue.nombreCabecera === menuValue.headerName
																: menuValue.codeObj.indexOf(dataValue.codigoObj) > -1;
									if (vExist){
										menuValue.menu = (dataValue.items && dataValue.items.length && menuValue.menu.length)
																			? _filterMenu(menuValue.menu, dataValue.items)
																			: [];
									}
								return vExist;
							});
							return !!vItem;
						});
				return vFilteredMenu;
				}
				var vMenu = _getCurrentMenu(module.prefixState);
				return _filterMenu(vMenu, data);
			}

			proxyMenu.CSGetSubMenu = function(appCode, showSpin) {
				var vSubMenu = nsctrAuthorize.getSubMenu(appCode);
				return (vSubMenu)
								? $q.resolve(vSubMenu)
								: proxyMenu.GetSubMenu(appCode, showSpin);
			}
			/*########################
    	# return
    	########################*/
			return{
				proxyMenu 			: proxyMenu,
				getCurrentMenu 	: _getCurrentMenu,
				generateMenu 		: _generateMenu
			};

		}]);

});

