(function(factory)
{
    define(factory);
})(function()
{
    return  {
             lib: {
                  "pericial_routes": {
                     name: 'pericial_routes',
                     path : '/pericial/app/app.routes'
                  },
                  'appPericial':{
                     name: 'appPericial',
                     path : '/pericial/app/app'
                  },
                   //components
                   'menuPericial' : {
                     name: 'menuPericial',
                     path : '/pericial/app/common/menu/menu.component'
                   },
                   'cabeceraServicios' : {
                     name: 'cabeceraServicios',
                     path : '/pericial/app/servicios/common/cabeceraServicios/cabeceraServicios'
                   },
                   'comentario' : {
                     name: 'comentario',
                     path : '/pericial/app/servicios/common/comentario/comentario'
                   },
                    'DashboardController' : {
                       name: 'DashboardController',
                       path : '/pericial/app/dashboard/controller/dashboard'
                    },
                   'DashboardSupervisorController' : {
                     name: 'DashboardSupervisorController',
                     path : '/pericial/app/dashboard/controller/dashboardSupervisor'
                   },
                   'BandejaServiciosController' : {
                     name: 'BandejaServiciosController',
                     path : '/pericial/app/bandejaServicios/controller/bandejaServicios'
                   },
                   'NuevoRegistroController' : {
                     name: 'NuevoRegistroController',
                     path : '/pericial/app/nuevoRegistro/controller/nuevoRegistro'
                   },
                   'ReportesController' : {
                     name: 'ReportesController',
                     path : '/pericial/app/reportes/controller/reportes'
                   },
                   'ServicioIngresadoController' : {
                     name: 'ServicioIngresadoController',
                     path : '/pericial/app/servicios/ingresado/controller/ingresado'
                   },
                   'ServicioIngresadoPTController' : {
                     name: 'ServicioIngresadoPTController',
                     path : '/pericial/app/servicios/ingresadoPT/controller/ingresadoPT'
                   },
                   'ServicioPresupuestadoController' : {
                     name: 'ServicioPresupuestadoController',
                     path : '/pericial/app/servicios/presupuestado/controller/presupuestado'
                   },
                   'ServicioPresupuestadoAmpController' : {
                     name: 'ServicioPresupuestadoAmpController',
                     path : '/pericial/app/servicios/presupuestadoAmp/controller/presupuestadoAmp'
                   },
                   'ServicioPeritadoController' : {
                     name: 'ServicioPeritadoController',
                     path : '/pericial/app/servicios/peritado/controller/peritado'
                   },
                   'ServicioEnReparacionController' : {
                     name: 'ServicioEnReparacionController',
                     path : '/pericial/app/servicios/enReparacion/controller/enReparacion'
                   },
                   'ServicioPorEntregarController' : {
                     name: 'ServicioPorEntregarController',
                     path : '/pericial/app/servicios/porEntregar/controller/porEntregar'
                   },
                   'ServicioPorEntregarPRController' : {
                     name: 'ServicioPorEntregarPRController',
                     path : '/pericial/app/servicios/porEntregarPR/controller/porEntregarPR'
                   },
                   'proxyGPer': {
                     name: 'proxyGPer',
                     path: '/pericial/app/proxy/serviceGPer'
                   },
                   'pericialFactory': {
                     name: 'pericialFactory',
                     path: '/pericial/app/common/pericialFactory'
                   },
                   'ServicioPresupuestadoVirtController' : {
                     name: 'ServicioPresupuestadoVirtController',
                     path : '/pericial/app/servicios/presupuestadoVirt/controller/presupuestadoVirt'
                   },
                   'ServicioPresupuestadoAsignController' : {
                     name: 'ServicioPresupuestadoAsignController',
                     path : '/pericial/app/servicios/presupuestadoAsign/controller/presupuestadoAsign'
                   },
                   'ServicioPresupuestadoZoneController' : {
                     name: 'ServicioPresupuestadoZoneController',
                     path : '/pericial/app/servicios/presupuestadoZone/controller/presupuestadoZone'
                   },
                   'ServicioPeritajeParController' : {
                     name: 'ServicioPeritajeParController',
                     path : '/pericial/app/servicios/peritajePar/controller/peritajePar'
                   },
                   'ServicioSupervisorPTController' : {
                     name: 'ServicioSupervisorPTController',
                     path : '/pericial/app/servicios/supervisorPT/controller/supervisorPT'
                   },
                   'constantsPericial': {
                     name: "constantsPericial",
                     path: "/pericial/app/constantsPericial"
                   },
                   'chart': {
                     name: "chart",
                     path: "/scripts/b_components/chart.js/dist/Chart.bundle"
                   },
                   'mocksPericial': {
                     name: "mocksPericial",
                     path: "/pericial/app/common/mocksPericial"
                   },
                   'gPerDirective': {
                     name: "gPerDirective",
                     path: '/pericial/app/common/gper-directives'
                   },
                   'proxyAutomovil': {
                     name: 'proxyAutomovil',
                     path: '../../polizas/app/proxy/servicePoliza'
                   },
                   'proxySiniestro': {
                      name: 'proxySiniestro',
                        path: '../../webproc/app/proxy/serviceWebproc'
                    },
                   'localStorageService': {
                     name: 'localStorageService',
                     path: '/scripts/b_components/angular-local-storage/dist/angular-local-storage.min'
                   }
            },
            shim: {
                // 'appPericial': { deps: ['angular_ui_route', 'uIBootstrap', 'oim_ocLazyLoad', 'oim_layout', 'lodash', 'proxyLogin', 'oim_security', 'wrap_gaia', 'chart', 'proxyGPer'] },
             'appPericial': { deps: ['angular_ui_route', 'uIBootstrap', 'oim_ocLazyLoad', 'oim_layout', 'lodash', 'proxyLogin', 'proxyAutomovil', 'oim_security', 'wrap_gaia', 'proxyGPer', 'proxySiniestro'] },
              'localStorageService': {deps: ['angular']},
              chart: {exports: 'chart'},
            //  chartjs: { deps: ['angular', 'chart'] },
              gPerDirective: { deps: ['angular'] }
            },
            packages :{

            }
    }

});
