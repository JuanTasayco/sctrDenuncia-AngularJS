define(['constants'], function (constants) {
  var data = [
    {
      name: 'root',
      abstract: true,
      views: {
        'top@root': {
          templateUrl: '/app/index/controller/template/top.html',
          controller: 'topController'
        },
        'header@root': {
          templateUrl: '/app/index/controller/template/header.html',
          controller: 'headerController'
        },
        'left_bar@root': {
          templateUrl: '/app/index/controller/template/left_bar.html',
          controller: 'leftBarController'
        },

        'body_left@root': {
          templateUrl: '/app/index/controller/template/body_left.html',
          controller: 'bodyLeftController'
        },
        'right_bar@root': {
          templateUrl: '/app/index/controller/template/right_bar.html',
          controller: 'rightBarController'
        },
        'footer@root': {
          templateUrl: '/app/index/controller/template/footer.html',
          controller: 'footerController'
        },
        'bottom@root': {
          templateUrl: '/app/index/controller/template/bottom.html',
          controller: 'bottomController'
        }
      },
      resolve: {
        authorizedResource : ['accessSupplier', function(accessSupplier){

            return accessSupplier.getAllObject();
        }]
      },
      resolver: [
        {
          name: "layout",
          // moduleName: "oim.layout",
          moduleName: "appSecurity",
          files: ['topController',
            'headerController',
            'leftBarController',
            'bodyMiddelController',
            'bodyLeftController',
            'rightBarController',
            'footerController',
            'bottomController',
            'menuSecurity',
            'nEmpresa',
            'datosPersonales',
            'asigRol',
            'asigAcceso'
          ],
        },
      ]
    },
    {
      name: 'home',
      // code: '',
      appCode: '',
      description: '',
      url: '/',
      parent: 'root',
      views: {
        content: {
          controller: 'homeController',
          templateUrl: '/security/app/dashboard/controller/dashboard.html'
        }
      },
      resolver:
        [{
          name: 'home',
          moduleName: 'appSecurity',
          files: [
            'homeController'
          ]
        }]
    },
    {
      name: 'dashboard',
      activeMenu: 'dashboard',
      // code: '',
      appCode: '',
      description: 'General',
      url: '/dashboard',
      parent: 'root',
      views: {
        content: {
          controller: 'dashboardController',
          templateUrl: '/security/app/dashboard/controller/dashboard.html'
        }
      },
      resolver:
        [{
          name: 'dashboard',
          moduleName: 'appSecurity',
          files: [
            'dashboardController'
          ]
        }]
    },
    {
      name: 'configuraciones',
      activeMenu: 'configuraciones',
      // code: '',
      appCode: '',
      description: 'Configuraciones',
      url: '/configuraciones',
      parent: 'root',
      views: {
        content: {
          controller: 'configuracionesController',
          templateUrl: '/security/app/configuraciones/controller/configuraciones.html'
        }
      },
      resolver:
        [{
          name: 'configuraciones',
          moduleName: 'appSecurity',
          files: [
            'configuracionesController'
          ]
        }]
    },
    {
      name: 'usuarios',
      activeMenu: 'usuarios',
      // code: '',
      appCode: '',
      description: 'Usuarios',
      url: '/secciones/usuarios',
      parent: 'root',
      views: {
        content: {
          controller: 'usuariosController',
          templateUrl: '/security/app/secciones/usuarios/controller/usuarios.html'
        }
      },
      resolver:
        [{
          name: 'usuarios',
          moduleName: 'appSecurity',
          files: [
            'usuariosController'
          ]
        }]
    },
    {
      name: 'crearUsuarioCliEmp',
      activeMenu: 'usuarios',
      appCode: '',
      params: {
        step: null
      },
      description: '',
      breads: ['home'],
      urls: [{
        url: '/secciones/crearUsuarioCliEmp',
        abstract: true,
        parent: 'root',
        thenRoutes: ['/secciones/crearUsuarioCliEmp/1'],
        views: {
          content: {
            controller: 'crearUsuarioCliEmpController',
            templateUrl: '/security/app/secciones/crearUsuarioCliEmp/controller/crearUsuarioCliEmp.html',
          }
        },
        // resolve: {
        //   claims: ['loaderSOATController', 'soatEmit', function(loaderSOATController, soatEmit) {
        //     return loaderSOATController.getClaims();
        //   }]
        // }
      },
      {
        name: "crearUsuarioCliEmp.steps",
        activeMenu: 'usuarios',
        appCode: '',
        url: '/:step',
        //params: {},
        templateUrl: function ($stateParam) {

          var c = [
            undefined,
            '/security/app/secciones/crearUsuarioCliEmp/controller/crearUsuarioCliEmp-p1.html',
            '/security/app/secciones/crearUsuarioCliEmp/controller/crearUsuarioCliEmp-p2.html',
            '/security/app/secciones/crearUsuarioCliEmp/controller/crearUsuarioCliEmp-p3.html'
          ]
          return c[$stateParam.step];
        },
        resolve: {

        },
        controllerProvider: function($stateParams) {

          var c = [
            undefined,
            'crearUsuarioCliEmp01Controller',
            'crearUsuarioCliEmp02Controller',
            'crearUsuarioCliEmp03Controller'
          ]
          return c[$stateParams.step];
        }
      }],

      resolver: [{
        name: 'crearUsuarioCliEmp',
        moduleName: 'appSecurity',
        files: [
          'crearUsuarioCliEmp01Controller',
          'crearUsuarioCliEmp02Controller',
          'crearUsuarioCliEmp03Controller',
          'crearUsuarioCliEmpController'
        ]
      }]

    },
    {
      name: 'crearUsuarioCliEmpExito',
      // code: '',
      appCode: '',
      description: '',
      url: '/secciones/crearUsuarioCliEmpExito',
      parent: 'root',
      views: {
        content: {
          controller: 'crearUsuarioCliEmpExitoController',
          templateUrl: '/security/app/secciones/crearUsuarioCliEmp/controller/crearUsuarioCliEmpExito.html'
        }
      },
      resolver:
        [{
          name: 'crearUsuarioCliEmpExito',
          moduleName: 'appSecurity',
          files: [
            'crearUsuarioCliEmpExitoController'
          ]
        }]
    },
    {
      name: 'crearUsuarioEjecMapfre',
      activeMenu: 'usuarios',
      appCode: '',
      params: {
        step: null
      },
      description: '',
      breads: ['home'],
      urls: [{
        url: '/secciones/crearUsuarioEjecMapfre',
        abstract: true,
        parent: 'root',
        thenRoutes: ['/secciones/crearUsuarioEjecMapfre/1'],
        views: {
          content: {
            controller: 'crearUsuarioEjecMapfreController',
            templateUrl: '/security/app/secciones/crearUsuarioEjecMapfre/controller/crearUsuarioEjecMapfre.html',
          }
        },
        // resolve: {
        //   claims: ['loaderSOATController', 'soatEmit', function(loaderSOATController, soatEmit) {
        //     return loaderSOATController.getClaims();
        //   }]
        // }
      },
      {
        name: "crearUsuarioEjecMapfre.steps",
        activeMenu: 'usuarios',
        appCode: '',
        url: '/:step',
        //params: {},
        templateUrl: function($stateParam) {

          var c = [
            undefined,
            '/security/app/secciones/crearUsuarioEjecMapfre/controller/crearUsuarioEjecMapfre-paso1.html',
            '/security/app/secciones/crearUsuarioEjecMapfre/controller/crearUsuarioEjecMapfre-paso2.html',
            '/security/app/secciones/crearUsuarioEjecMapfre/controller/crearUsuarioEjecMapfre-paso3.html'
          ]
          return c[$stateParam.step];
        },
        resolve: {

        },
        controllerProvider: function($stateParams) {

          var c = [
            undefined,
            'crearUsuarioEjecMapfrePaso1Controller',
            'crearUsuarioEjecMapfrePaso2Controller',
            'crearUsuarioEjecMapfrePaso3Controller'
          ]
          return c[$stateParams.step];
        }
      }],

      resolver: [{
        name: 'crearUsuarioEjecMapfre',
        moduleName: 'appSecurity',
        files: [
          'crearUsuarioEjecMapfrePaso1Controller',
          'crearUsuarioEjecMapfrePaso2Controller',
          'crearUsuarioEjecMapfrePaso3Controller',
          'crearUsuarioEjecMapfreController'
        ]
      }]
    },
    {
      name: 'crearUsuarioEjecMapfreExito',
      // code: '',
      appCode: '',
      description: '',
      url: '/secciones/crearUsuarioEjecMapfreExito/:id',
      parent: 'root',
      views: {
        content: {
          controller: 'crearUsuarioEjecMapfreExitoController',
          templateUrl: '/security/app/secciones/crearUsuarioEjecMapfre/controller/crearUsuarioEjecMapfreExito.html'
        }
      },
      resolver:
        [{
          name: 'crearUsuarioEjecMapfreExito',
          moduleName: 'appSecurity',
          files: [
            'crearUsuarioEjecMapfreExitoController'
          ]
        }]
    },
    {
      name: 'crearUsuarioProveedor',
      activeMenu: 'usuarios',
      appCode: '',
      params: {
        step: null
      },
      description: '',
      breads: ['home'],
      urls: [
        {
          url: '/secciones/crearUsuarioProveedor',
          abstract: true,
          parent: 'root',
          thenRoutes: ['/secciones/crearUsuarioProveedor/1'],
          views: {
            content: {
              controller: 'crearUsuarioProveedorController',
              templateUrl: '/security/app/secciones/crearUsuarioProveedor/controller/crearUsuarioProveedor.html',
            }
          },
          // resolve: {
          //   claims: ['loaderSOATController', 'soatEmit', function(loaderSOATController, soatEmit) {
          //     return loaderSOATController.getClaims();
          //   }]
          // }
        },
        {
          name: "crearUsuarioProveedor.steps",
          activeMenu: 'usuarios',
          appCode: '',
          url: '/:step',
          // params: {
          //   id: null
          // },
          templateUrl: function ($stateParam) {

            var c = [
              undefined,
              '/security/app/secciones/crearUsuarioProveedor/controller/crearUsuarioProveedor-p1.html',
              '/security/app/secciones/crearUsuarioProveedor/controller/crearUsuarioProveedor-p2.html',
              '/security/app/secciones/crearUsuarioProveedor/controller/crearUsuarioProveedor-p3.html'
            ]
            return c[$stateParam.step];
          },
          resolve: {

          },
          controllerProvider: function($stateParams) {

            var c = [
              undefined,
              'crearUsuarioProveedor01Controller',
              'crearUsuarioProveedor02Controller',
              'crearUsuarioProveedor03Controller'
            ]
            return c[$stateParams.step];
          }
        }
      ],

      resolver: [{
        name: 'crearUsuarioProveedor',
        moduleName: 'appSecurity',
        files: [
          'crearUsuarioProveedor01Controller',
          'crearUsuarioProveedor02Controller',
          'crearUsuarioProveedor03Controller',
          'crearUsuarioProveedorController'
        ]
      }]

    },
    {
      name: 'crearUsuarioProveedorExito',
      // code: '',
      appCode: '',
      description: '',
      url: '/secciones/crearUsuarioProveedorExito',
      parent: 'root',
      views: {
        content: {
          controller: 'crearUsuarioProveedorExitoController',
          templateUrl: '/security/app/secciones/crearUsuarioProveedor/controller/crearUsuarioProveedorExito.html'
        }
      },
      resolver:
        [{
          name: 'crearUsuarioProveedorExito',
          moduleName: 'appSecurity',
          files: [
            'crearUsuarioProveedorExitoController'
          ]
        }]
    },
    {
      name: 'crearUsuarioCorredor',
      activeMenu: 'usuarios',
      appCode: '',
      params: {
        step: null
      },
      description: '',
      breads: ['home'],
      urls: [{
        url: '/secciones/crearUsuarioCorredor',
        abstract: true,
        parent: 'root',
        thenRoutes: ['/secciones/crearUsuarioCorredor/1'],
        views: {
          content: {
            controller: 'crearUsuarioCorredorController',
            templateUrl: '/security/app/secciones/crearUsuarioCorredor/controller/crearUsuarioCorredor.html',
          }
        },
        // resolve: {
        //   claims: ['loaderSOATController', 'soatEmit', function(loaderSOATController, soatEmit) {
        //     return loaderSOATController.getClaims();
        //   }]
        // }
      },
        {
          name: "crearUsuarioCorredor.steps",
          activeMenu: 'usuarios',
          appCode: '',
          url: '/:step',
          // params: {
          //   id: null
          // },
          templateUrl: function($stateParam) {

            var c = [
              undefined,
              '/security/app/secciones/crearUsuarioCorredor/controller/crearUsuarioCorredor-p1.html',
              '/security/app/secciones/crearUsuarioCorredor/controller/crearUsuarioCorredor-p2.html',
              '/security/app/secciones/crearUsuarioCorredor/controller/crearUsuarioCorredor-p3.html'
            ]
            return c[$stateParam.step];
          },
          resolve: {

          },
          controllerProvider: function($stateParams) {

            var c = [
              undefined,
              'crearUsuarioCorredor01Controller',
              'crearUsuarioCorredor02Controller',
              'crearUsuarioCorredor03Controller'
            ]
            return c[$stateParams.step];
          }
        }],

      resolver: [{
        name: 'crearUsuarioCorredor',
        moduleName: 'appSecurity',
        files: [
          'crearUsuarioCorredor01Controller',
          'crearUsuarioCorredor02Controller',
          'crearUsuarioCorredor03Controller',
          'crearUsuarioCorredorController'
        ]
      }]

    },
    {
      name: 'crearUsuarioCorredorExito',
      // code: '',
      appCode: '',
      description: '',
      url: '/secciones/crearUsuarioCorredorExito',
      parent: 'root',
      views: {
        content: {
          controller: 'crearUsuarioCorredorExitoController',
          templateUrl: '/security/app/secciones/crearUsuarioCorredor/controller/crearUsuarioCorredorExito.html'
        }
      },
      resolver:
        [{
          name: 'crearUsuarioCorredorExito',
          moduleName: 'appSecurity',
          files: [
            'crearUsuarioCorredorExitoController'
          ]
        }]
    },
    {
      name: 'crearUsuarioAdminExt',
      appCode: '',
      params: {
        step: null
      },
      description: '',
      breads: ['home'],
      urls: [{
        url: '/secciones/crearUsuarioAdminExt',
        abstract: true,
        parent: 'root',
        thenRoutes: ['/secciones/crearUsuarioAdminExt/1'],
        views: {
          content: {
            controller: 'crearUsuarioAdminExtController',
            templateUrl: '/security/app/secciones/crearUsuarioAdminExt/controller/crearUsuarioAdminExt.html',
          }
        },
        // resolve: {
        //   claims: ['loaderSOATController', 'soatEmit', function(loaderSOATController, soatEmit) {
        //     return loaderSOATController.getClaims();
        //   }]
        // }
      },
        {
          name: "crearUsuarioAdminExt.steps",
          appCode: '',
          url: '/:step',
          // params: {},
          templateUrl: function($stateParam) {

            var c = [
              undefined,
              '/security/app/secciones/crearUsuarioAdminExt/controller/crearUsuarioAdminExt-p1.html',
              '/security/app/secciones/crearUsuarioAdminExt/controller/crearUsuarioAdminExt-p2.html'
            ]
            return c[$stateParam.step];
          },
          resolve: {

          },
          controllerProvider: function($stateParams) {

            var c = [
              undefined,
              'crearUsuarioAdminExt01Controller',
              'crearUsuarioAdminExt02Controller'
            ]
            return c[$stateParams.step];
          }
        }],

      resolver: [{
        name: 'crearUsuarioAdminExt',
        moduleName: 'appSecurity',
        files: [
          'crearUsuarioAdminExt01Controller',
          'crearUsuarioAdminExt02Controller',
          'crearUsuarioAdminExtController'
        ]
      }]

    },
    {
      name: 'crearUsuarioAdminExtExito',
      // code: '',
      appCode: '',
      description: '',
      url: '/secciones/crearUsuarioAdminExtExito',
      parent: 'root',
      views: {
        content: {
          controller: 'crearUsuarioAdminExtExitoController',
          templateUrl: '/security/app/secciones/crearUsuarioAdminExt/controller/crearUsuarioAdminExtExito.html'
        }
      },
      resolver:
        [{
          name: 'crearUsuarioAdminExtExito',
          moduleName: 'appSecurity',
          files: [
            'crearUsuarioAdminExtExitoController'
          ]
        }]
    },
    {
      name: 'detalleCliEmp',
      activeMenu: 'usuarios',
      // code: '',
      appCode: '',
      description: '',
      url: '/secciones/detalleCliEmp/:id',
      parent: 'root',
      views: {
        content: {
          controller: 'detalleCliEmpController',
          templateUrl: '/security/app/secciones/detalleCliEmp/controller/detalleCliEmp.html'
        }
      },
      resolver:
        [{
          name: 'detalleCliEmp',
          moduleName: 'appSecurity',
          files: [
            'detalleCliEmpController'
          ]
        }]
    },
    {
      name: 'detalleEjecMapfre',
      activeMenu: 'usuarios',
      // code: '',
      appCode: '',
      description: '',
      url: '/secciones/detalleEjecMapfre/:id',
      parent: 'root',
      views: {
        content: {
          controller: 'detalleEjecMapfreController',
          templateUrl: '/security/app/secciones/detalleEjecMapfre/controller/detalleEjecMapfre.html'
        }
      },
      resolver:
        [{
          name: 'detalleEjecMapfre',
          moduleName: 'appSecurity',
          files: [
            'detalleEjecMapfreController'
          ]
        }]
    },
    {
      name: 'detalleProveedor',
      activeMenu: 'usuarios',
      // code: '',
      appCode: '',
      description: 'Usuarios',
      url: '/secciones/detalleProveedor/:id',
      parent: 'root',
      views: {
        content: {
          controller: 'detalleProveedorController',
          templateUrl: '/security/app/secciones/detalleProveedor/controller/detalleProveedor.html'
        }
      },
      resolver:
        [{
          name: 'detalleProveedor',
          moduleName: 'appSecurity',
          files: [
            'detalleProveedorController'
          ]
        }]
    },
    {
      name: 'detalleCorredor',
      activeMenu: 'usuarios',
      // code: '',
      appCode: '',
      description: '',
      url: '/secciones/detalleCorredor/:id',
      parent: 'root',
      views: {
        content: {
          controller: 'detalleCorredorController',
          templateUrl: '/security/app/secciones/detalleCorredor/controller/detalleCorredor.html'
        }
      },
      resolver:
        [{
          name: 'detalleCorredor',
          moduleName: 'appSecurity',
          files: [
            'detalleCorredorController'
          ]
        }]
    },
    {
      name: 'detalleUsuario',
      activeMenu: 'usuarios',
      // code: '',
      appCode: '',
      description: '',
      url: '/secciones/detalleUsuario/:id',
      parent: 'root',
      views: {
        content: {
          controller: 'detalleUsuarioController',
          templateUrl: '/security/app/secciones/detalleUsuario/controller/detalleUsuario.html'
        }
      },
      resolver:
        [{
          name: 'detalleUsuario',
          moduleName: 'appSecurity',
          files: [
            'detalleUsuarioController'
          ]
        }]
    },
    {
      name: 'creacionMasiva',
      activeMenu: 'usuarios',
      // code: '',
      appCode: '',
      description: '',
      url: '/creacionMasiva',
      parent: 'root',
      views: {
        content: {
          controller: 'creacionMasivaController',
          templateUrl: '/security/app/masivas/controller/creacionMasiva.html'
        }
      },
      resolver:
        [{
          name: 'creacionMasiva',
          moduleName: 'appSecurity',
          files: [
            'creacionMasivaController'
          ]
        }]
    },
    {
      name: 'deshabilitacionMasiva',
      activeMenu: 'usuarios',
      // code: '',
      appCode: '',
      description: '',
      url: '/deshabilitacionMasiva',
      parent: 'root',
      views: {
        content: {
          controller: 'deshabilitacionMasivaController',
          templateUrl: '/security/app/masivas/controller/deshabilitacionMasiva.html'
        }
      },
      resolver:
        [{
          name: 'deshabilitacionMasiva',
          moduleName: 'appSecurity',
          files: [
            'deshabilitacionMasivaController'
          ]
        }]
    },
    {
      name: 'modificacionMasiva',
      activeMenu: 'usuarios',
      // code: '',
      appCode: '',
      description: '',
      url: '/modificacionMasiva',
      parent: 'root',
      views: {
        content: {
          controller: 'modificacionMasivaController',
          templateUrl: '/security/app/masivas/controller/modificacionMasiva.html'
        }
      },
      resolver:
        [{
          name: 'modificacionMasiva',
          moduleName: 'appSecurity',
          files: [
            'modificacionMasivaController'
          ]
        }]
    },
    {
      name: 'clonacion',
      activeMenu: 'usuarios',
      appCode: '',
      description: '',
      url: '/clonacion',
      parent: 'root',
      views: {
        content: {
          controller: 'clonacionController',
          templateUrl: '/security/app/masivas/controller/clonacion.html'
        }
      },
      resolver:
        [{
          name: 'clonacion',
          moduleName: 'appSecurity',
          files: [
            'clonacionController'
          ]
        }]
    },
    {
      name: 'habilitacion',
      activeMenu: 'usuarios',
      appCode: '',
      description: '',
      url: '/habilitacion',
      parent: 'root',
      views: {
        content: {
          controller: 'habilitarController',
          templateUrl: '/security/app/masivas/controller/habilitar.html'
        }
      },
      resolver:
        [{
          name: 'habilitacion',
          moduleName: 'appSecurity',
          files: [
            'habilitarController'
          ]
        }]
    },
    {
      name: 'roles',
      activeMenu: 'roles',
      // code: '',
      appCode: '',
      description: 'Roles',
      url: '/roles',
      parent: 'root',
      views: {
        content: {
          controller: 'rolesController',
          templateUrl: '/security/app/roles/bandeja/controller/roles.html'
        }
      },
      resolver:
        [{
          name: 'roles',
          moduleName: 'appSecurity',
          files: [
            'rolesController'
          ]
        }]
    },
    {
      name: 'detalleRol',
      activeMenu: 'roles',
      // code: '',
      appCode: '',
      description: '',
      url: '/detalleRol/:id',
      parent: 'root',
      views: {
        content: {
          controller: 'detalleRolController',
          templateUrl: '/security/app/roles/detalle/controller/detalleRol.html'
        }
      },
      resolver:
        [{
          name: 'detalleRol',
          moduleName: 'appSecurity',
          files: [
            'detalleRolController'
          ]
        }]
    },
    {
      name: 'crearRol',
      activeMenu: 'roles',
      appCode: '',
      params: {
        step: null
      },
      description: 'Roles',
      urls: [
        {
          url: '/crearRol',
          abstract: true,
          parent: 'root',
          thenRoutes: ['/crearRol/1'],
          views: {
            content: {
              controller: 'crearRolController',
              templateUrl: '/security/app/roles/creacion/controller/crearRol.html',
            }
          }
        },
        {
          name: "crearRol.steps",
          activeMenu: 'roles',
          appCode: '',
          params: {
            numRol: null
          },
          url: '/:step',
          // params: {},
          templateUrl: function($stateParam) {

            var c = [
              undefined,
              '/security/app/roles/creacion/controller/crearRol-p1.html',
              '/security/app/roles/creacion/controller/crearRol-p2.html'
            ]
            return c[$stateParam.step];
          },
          resolve: {

          },
          controllerProvider: function($stateParams) {

            var c = [
              undefined,
              'crearRol01Controller',
              'crearRol02Controller'
            ]
            return c[$stateParams.step];
          }
        }
      ],

      resolver: [{
        name: 'crearRol',
        moduleName: 'appSecurity',
        files: [
          'crearRol01Controller',
          'crearRol02Controller',
          'crearRolController'
        ]
      }]

    },
    {
      name: 'aplicaciones',      
      activeMenu: 'aplicaciones',
      // code: '',
      appCode: '',
      description: 'Aplicaciones',
      url: '/aplicaciones',
      parent: 'root',
      views: {
        content: {
          controller: 'aplicacionesController',
          templateUrl: '/security/app/aplicaciones/bandeja/controller/aplicaciones.html'
        }
      },
      resolver:
        [{
          name: 'aplicaciones',
          moduleName: 'appSecurity',
          files: [
            'aplicacionesController'
          ]
        }]
    },
    {
      name: 'crearAplicaciones',
      activeMenu: 'aplicaciones',
      appCode: '',
      params: {
        step: null
      },
      description: 'Aplicaciones',
      breads: ['home'],
      urls: [
        {
          url: '/crearAplicaciones',
          abstract: true,
          parent: 'root',
          thenRoutes: ['/crearAplicaciones/1'],
          views: {
            content: {
              controller: 'crearAplicacionesController',
              templateUrl: '/security/app/aplicaciones/creacion/controller/crearAplicaciones.html',
            }
          },
          // resolve: {
          //   claims: ['loaderSOATController', 'soatEmit', function(loaderSOATController, soatEmit) {
          //     return loaderSOATController.getClaims();
          //   }]
          // }
        },
        {
          name: "crearAplicaciones.steps",
          activeMenu: 'aplicaciones',
          appCode: '',
          url: '/:step',
          params: {
            numAplicacion: null
          },
          templateUrl: function($stateParam) {

            var c = [
              undefined,
              '/security/app/aplicaciones/creacion/controller/crearAplicaciones-p1.html',
              '/security/app/aplicaciones/creacion/controller/crearAplicaciones-p2.html'
            ]
            return c[$stateParam.step];
          },
          resolve: {

          },
          controllerProvider: function($stateParams) {

            var c = [
              undefined,
              'crearAplicaciones01Controller',
              'crearAplicaciones02Controller'
            ]
            return c[$stateParams.step];
          }
        }
      ],

      resolver: [{
        name: 'crearAplicaciones',
        moduleName: 'appSecurity',
        files: [
          'crearAplicaciones01Controller',
          'crearAplicaciones02Controller',
          'crearAplicacionesController'
        ]
      }]
    },
    {
      name: 'detalleAplicaciones',
      activeMenu: 'aplicaciones',
      // code: '',
      appCode: '',
      description: '',
      url: '/detalleAplicaciones/:id',
      parent: 'root',
      views: {
        content: {
          controller: 'detalleAplicacionesController',
          templateUrl: '/security/app/aplicaciones/detalle/controller/detalleAplicaciones.html'
        }
      },
      resolver:
        [{
          name: 'detalleAplicaciones',
          moduleName: 'appSecurity',
          files: [
            'detalleAplicacionesController'
          ]
        }]
    },
  ]

  return data;
});
