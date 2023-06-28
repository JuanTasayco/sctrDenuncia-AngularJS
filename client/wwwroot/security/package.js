(function(factory)
{
  define(factory);
})(function()
{
  return  {
    lib: {
      "security_routes": {
         name: 'security_routes',
         path : '/security/app/app.routes'
      },
      'appSecurity':{
         name: 'appSecurity',
         path : '/security/app/app'
      },
      'uiTree': {
          name: 'uiTree',
          path: '/security/components/angular-ui-tree/dist/angular-ui-tree.min'
      },
       //components
       'menuSecurity' : {
         name: 'menuSecurity',
         path : '/security/app/common/menu/menu'
       },
       'nEmpresa' : {
        name: 'nEmpresa',
        path : '/security/app/common/nombre_empresa/nEmpresa'
      },
      'asigRol' : {
        name: 'asigRol',
        path : '/security/app/secciones/common/asigRol'
      },
      'asigAcceso' : {
        name: 'asigAcceso',
        path : '/security/app/secciones/common/asigAcceso'
      },
      'datosPersonales' : {
        name: 'datosPersonales',
        path : '/security/app/secciones/common/datosPersonales'
      },
      'homeController' : {
         name: 'homeController',
         path : '/security/app/home/controller/home'
      },
      'dashboardController' : {
       name: 'dashboardController',
       path : '/security/app/dashboard/controller/dashboard'
      },
      'configuracionesController' : {
        name: 'configuracionesController',
        path : '/security/app/configuraciones/controller/configuraciones'
      },
      'usuariosController' : {
       name: 'usuariosController',
       path : '/security/app/secciones/usuarios/controller/usuarios'
      },
      'crearUsuarioCliEmpController' : {
       name: 'crearUsuarioCliEmpController',
       path : '/security/app/secciones/crearUsuarioCliEmp/controller/crearUsuarioCliEmp'
      },
      'crearUsuarioCliEmp01Controller' : {
       name: 'crearUsuarioCliEmp01Controller',
       path : '/security/app/secciones/crearUsuarioCliEmp/controller/crearUsuarioCliEmp-p1'
      },
      'crearUsuarioCliEmp02Controller' : {
        name: 'crearUsuarioCliEmp02Controller',
        path : '/security/app/secciones/crearUsuarioCliEmp/controller/crearUsuarioCliEmp-p2'
      },
      'crearUsuarioCliEmp03Controller' : {
        name: 'crearUsuarioCliEmp03Controller',
        path : '/security/app/secciones/crearUsuarioCliEmp/controller/crearUsuarioCliEmp-p3'
      },
      'crearUsuarioCliEmpExitoController' : {
        name: 'crearUsuarioCliEmpExitoController',
        path : '/security/app/secciones/crearUsuarioCliEmp/controller/crearUsuarioCliEmpExito'
      },
      'crearUsuarioEjecMapfreController' : {
        name: 'crearUsuarioEjecMapfreController',
        path : '/security/app/secciones/crearUsuarioEjecMapfre/controller/crearUsuarioEjecMapfre'
      },
      'crearUsuarioEjecMapfrePaso1Controller' : {
        name: 'crearUsuarioEjecMapfrePaso1Controller',
        path : '/security/app/secciones/crearUsuarioEjecMapfre/controller/crearUsuarioEjecMapfre-paso1'
       },
       'crearUsuarioEjecMapfrePaso2Controller' : {
         name: 'crearUsuarioEjecMapfrePaso2Controller',
         path : '/security/app/secciones/crearUsuarioEjecMapfre/controller/crearUsuarioEjecMapfre-paso2'
       },
       'crearUsuarioEjecMapfrePaso3Controller' : {
         name: 'crearUsuarioEjecMapfrePaso3Controller',
         path : '/security/app/secciones/crearUsuarioEjecMapfre/controller/crearUsuarioEjecMapfre-paso3'
       },
      'crearUsuarioEjecMapfreExitoController' : {
        name: 'crearUsuarioEjecMapfreExitoController',
        path : '/security/app/secciones/crearUsuarioEjecMapfre/controller/crearUsuarioEjecMapfreExito'
      },
      'crearUsuarioProveedorController' : {
        name: 'crearUsuarioProveedorController',
        path : '/security/app/secciones/crearUsuarioProveedor/controller/crearUsuarioProveedor'
      },
      'crearUsuarioProveedor01Controller' : {
        name: 'crearUsuarioProveedor01Controller',
        path : '/security/app/secciones/crearUsuarioProveedor/controller/crearUsuarioProveedor-p1'
      },
      'crearUsuarioProveedor02Controller' : {
        name: 'crearUsuarioProveedor02Controller',
        path : '/security/app/secciones/crearUsuarioProveedor/controller/crearUsuarioProveedor-p2'
      },
      'crearUsuarioProveedor03Controller' : {
        name: 'crearUsuarioProveedor03Controller',
        path : '/security/app/secciones/crearUsuarioProveedor/controller/crearUsuarioProveedor-p3'
      },
      'crearUsuarioProveedorExitoController' : {
        name: 'crearUsuarioProveedorExitoController',
        path : '/security/app/secciones/crearUsuarioProveedor/controller/crearUsuarioProveedorExito'
      },
      'crearUsuarioCorredorController' : {
        name: 'crearUsuarioCorredorController',
        path : '/security/app/secciones/crearUsuarioCorredor/controller/crearUsuarioCorredor'
      },
      'crearUsuarioCorredor01Controller' : {
        name: 'crearUsuarioCorredor01Controller',
        path : '/security/app/secciones/crearUsuarioCorredor/controller/crearUsuarioCorredor-p1'
      },
      'crearUsuarioCorredor02Controller' : {
        name: 'crearUsuarioCorredor02Controller',
        path : '/security/app/secciones/crearUsuarioCorredor/controller/crearUsuarioCorredor-p2'
      },
      'crearUsuarioCorredor03Controller' : {
        name: 'crearUsuarioCorredor03Controller',
        path : '/security/app/secciones/crearUsuarioCorredor/controller/crearUsuarioCorredor-p3'
      },
      'crearUsuarioCorredorExitoController' : {
        name: 'crearUsuarioCorredorExitoController',
        path : '/security/app/secciones/crearUsuarioCorredor/controller/crearUsuarioCorredorExito'
      },
      'crearUsuarioAdminExtController' : {
        name: 'crearUsuarioAdminExtController',
        path : '/security/app/secciones/crearUsuarioAdminExt/controller/crearUsuarioAdminExt'
      },
      'crearUsuarioAdminExt01Controller' : {
        name: 'crearUsuarioAdminExt01Controller',
        path : '/security/app/secciones/crearUsuarioAdminExt/controller/crearUsuarioAdminExt-p1'
      },
      'crearUsuarioAdminExt02Controller' : {
        name: 'crearUsuarioAdminExt02Controller',
        path : '/security/app/secciones/crearUsuarioAdminExt/controller/crearUsuarioAdminExt-p2'
      },
      'crearUsuarioAdminExtExitoController' : {
        name: 'crearUsuarioAdminExtExitoController',
        path : '/security/app/secciones/crearUsuarioAdminExt/controller/crearUsuarioAdminExtExito'
      },
      'detalleCliEmpController' : {
        name: 'detalleCliEmpController',
        path : '/security/app/secciones/detalleCliEmp/controller/detalleCliEmp'
      },
      'detalleEjecMapfreController' : {
        name: 'detalleEjecMapfreController',
        path : '/security/app/secciones/detalleEjecMapfre/controller/detalleEjecMapfre'
      },
      'detalleProveedorController' : {
        name: 'detalleProveedorController',
        path : '/security/app/secciones/detalleProveedor/controller/detalleProveedor'
      },
      'detalleCorredorController' : {
        name: 'detalleCorredorController',
        path : '/security/app/secciones/detalleCorredor/controller/detalleCorredor'
      },
      'detalleUsuarioController' : {
        name: 'detalleUsuarioController',
        path : '/security/app/secciones/detalleUsuario/controller/detalleUsuario'
      },
      'creacionMasivaController' : {
        name: 'creacionMasivaController',
        path : '/security/app/masivas/controller/creacionMasiva'
      },
      'deshabilitacionMasivaController' : {
        name: 'deshabilitacionMasivaController',
        path : '/security/app/masivas/controller/deshabilitacionMasiva'
      },
      'modificacionMasivaController' : {
        name: 'modificacionMasivaController',
        path : '/security/app/masivas/controller/modificacionMasiva'
      },
      'clonacionController' : {
        name: 'clonacionController',
        path : '/security/app/masivas/controller/clonacion'
      },
      'habilitarController' : {
        name: 'habilitarController',
        path : '/security/app/masivas/controller/habilitar'
      },
      'rolesController' : {
        name: 'rolesController',
        path : '/security/app/roles/bandeja/controller/roles'
      },
      'detalleRolController' : {
        name: 'detalleRolController',
        path : '/security/app/roles/detalle/controller/detalleRol'
      },
      'crearRolController' : {
        name: 'crearRolController',
        path : '/security/app/roles/creacion/controller/crearRol'
      },
      'crearRol01Controller' : {
        name: 'crearRol01Controller',
        path : '/security/app/roles/creacion/controller/crearRol-p1'
      },
      'crearRol02Controller' : {
        name: 'crearRol02Controller',
        path : '/security/app/roles/creacion/controller/crearRol-p2'
      },
      'aplicacionesController' : {
        name: 'aplicacionesController',
        path : '/security/app/aplicaciones/bandeja/controller/aplicaciones'
      },
      'crearAplicacionesController' : {
        name: 'crearAplicacionesController',
        path : '/security/app/aplicaciones/creacion/controller/crearAplicaciones'
      },
      'crearAplicaciones01Controller' : {
        name: 'crearAplicaciones01Controller',
        path : '/security/app/aplicaciones/creacion/controller/crearAplicaciones-p1'
      },
      'crearAplicaciones02Controller' : {
        name: 'crearAplicaciones02Controller',
        path : '/security/app/aplicaciones/creacion/controller/crearAplicaciones-p2'
      },
      'detalleAplicacionesController' : {
        name: 'detalleAplicacionesController',
        path : '/security/app/aplicaciones/detalle/controller/detalleAplicaciones'
      },
      //servicios
      'seguridadFactory': {
        name: 'seguridadFactory',
        path: '/security/app/factory/seguridadFactory'
      },
      //proxy
      'proxySeguridad': {
        name: 'proxySeguridad',
        path: '/security/app/proxy/serviceSeguridad'
      },
	    'messagesSeguridad': {
        name: 'messagesSeguridad',
        path : '/security/app/common/config/messages'
      },
      helperFactory: {
        name: 'helperFactory',
        path: '/security/app/factory/helper.factory'
      }
    },
    shim: {
      'uiTree':{ 
        deps:[
          'angular'
        ] 
      },
      'appSecurity': { 
        deps: [
        'angular_ui_route'
        , 'uIBootstrap'
        , 'oim_ocLazyLoad'
        , 'oim_layout'
        , 'lodash'
        , 'proxyLogin'
        , 'proxySeguridad'
        , 'oim_security'
        , 'wrap_gaia'
        ] 
      }
    },
    packages :{
    }
  }

});
