'use strict'

define([
	'angular', 'constants'
], function(angular, constants){

		var appNsctr = angular.module('appNsctr');

		//RolesNsctr
		appNsctr.constant('nsctrRoles', {
			EAC: 'EAC',
			DIRECTOR: 'DIRECTOR',
			GESTOR_CORREDORES: 'GESTOR', //GESTOR DE CORREDORES Es el  GESTOR COMERCIAL, solo vario la descripcion en el email enviado
			ADMINISTRADOR_COMERCIAL: 'ADMCOM', //EAC PERIODO LARGO
			ADMINISTRACION_APLICACION: 'ADMIN',
			CORREDOR_SCTR: 'CORREDOR',
			CLIENTE_SCTR: 'CLIENTE',
			CORREDOR_POLIZA_PERIODO_CORTO: 'BROKER',
			CLIENTE_ESPECIAL: 'CLIESP',
			CLIENTE_EMISOR_VIP_SCTR: 'CLIENTEVIP',
			CORREDOR_ESPECIAL: 'CORREDORESP',
			CLIENTE_EMISOR_SCTR: 'CLIENTE_EMIS',
			CORREDOR_DEUDA: 'CORREDORDEU',
			BROKERMANUAL: 'BROKERMANUAL'
		});

});

