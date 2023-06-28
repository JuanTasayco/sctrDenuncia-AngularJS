(function ($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "referenciasRoutes", [],
  function () {
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
          authorizedResource: ['accessSupplier', function (accessSupplier) {
            return accessSupplier.getAllObject();
          }]
        },
        resolver: [{
          name: "layout",
          moduleName: "oim.layout",
          files: ['topController',
            'headerController',
            'leftBarController',
            'bodyMiddelController',
            'bodyLeftController',
            'rightBarController',
            'footerController',
            'bottomController'
          ],
        }]
      },
      {
        name: 'home',
        appCode: '',
        description: '',
        url: '/',
        parent: 'root',
        views: {
          content: {
            controller: 'HomeController',
            templateUrl: '/referencias/app/home/home.html'
          }
        },
        resolver: [
          {
            name: 'home',
            moduleName: 'referencias.app',
            files: [
              'HomeController',
              'formFilters'
            ]
          }
        ]
      },
      {
        name: 'refsCrear',
        appCode: '',
        description: 'Crear Referencia',
        url: '/crearReferencia',
        parent: 'root',
        views: {
          content: {
            controller: 'RefsCrearController',
            templateUrl: '/referencias/app/refsCrear/refsCrear.html'
          }
        },
        resolver: [
          {
            name: 'refsCrear',
            moduleName: 'referencias.app',
            files: [
              'RefsCrearController',
              'progressStepOne',
              'progressStepTwo',
              'progressStepThree',
              'progressStepFour',
              'modalRequerimientos',
              'mapaMapfre',
              'modalGrabarRefs',
              'modalDetallep',
              'modalDetalled'
            ]
          }
        ]
      },
      {
        name: 'resumen',
        appCode: '',
        description: 'Resumen Referencia',
        url: '/resumenReferencia/:idReferencia',
        params: {
          idReferencia: null,
          isEdit: false,
          DescargaPdf: false
        },
        parent: 'root',
        views: {
          content: {
            controller: 'ResumenController',
            templateUrl: '/referencias/app/resumen/resumen.html'
          }
        },
        resolver: [
          {
            name: 'resumen',
            moduleName: 'referencias.app',
            files: [
              'ResumenController',
              'modalRevisar',
              'modalAnular',
              'modalDpdf'
            ]
          }
        ]
      },
      {
        name: 'editar-refs',
        appCode: '',
        description: 'Editar Referencia',
        url: '/editarReferencia/:idReferencia',
        params: {
          idReferencia: null,
          isEdit: false,
        },
        parent: 'root',
        views: {
          content: {
            controller: 'EditarRefsController',
            templateUrl: '/referencias/app/editar-refs/editar-refs.html'
          }
        },
        resolver: [
          {
            name: 'editar-refs',
            moduleName: 'referencias.app',
            files: [
              'EditarRefsController',
              'progressStepOne',
              'progressStepTwo',
              'progressStepThree',
              'progressStepFour',
              'modalRequerimientos',
              'mapaMapfre',
              'modalGrabarRefs',
              'modalDetallep',
              'modalDetalled'

            ]
          }
        ]
      },
      {
        name: 'accessdenied',
        code: '',
        url: '/accessdenied',
        parent: 'root',
        views: {
          content: {
            controller: [function() {}],
            templateUrl: '/referencias/app/components/access-denied/access-denied.html'
          }
        }
      },


    ]
    return data;
  });
