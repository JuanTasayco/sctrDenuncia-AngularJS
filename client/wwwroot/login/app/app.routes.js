define([], function() {
    var data = [
      {
        name: 'login',
        code: "",
        urls: [
          {
            name: 'loginByType',
            url: '/recurrent',
            params: {
              type: null,
              data: null
            }
          },
          '/'
        ],
        controller: 'loginController',
        templateUrl: '/login/app/login/controller/mainLogin.html',
        resolver: [
          {
            name: "mainLogin",
            moduleName: "appLogin",
            files: ['/login/app/login/controller/mainLogin.js'],
            resolveTemplate: true
          }
        ]
      },
      {
          name: "authoButtons",
          code: "",
          url: '/userTypes',
          controller: "loginOptionController",
          templateUrl: "/login/app/login/controller/loginOption/loginOption.html",
          resolver: [{
              name: "mainOptions",
              moduleName: "appLogin",
              files: ['/login/app/login/controller/loginOption/loginOption.js'],
              resolveTemplate: true
          }]
      },
      {
          name: 'recoverPassword',
          code: "",
          url: '/recoverPassword',
          controller: 'recoverPasswordController',
          templateUrl: '/login/app/recoverPassword/controller/mainRecoverPassword.html',
          resolver: [{
                  name: "mainRecoverPassword",
                  moduleName: "appLogin",
                  files: ['/login/app/recoverPassword/controller/mainRecoverPassword.js'],
                  resolveTemplate: true
              },
              {
                  name: "mainCaptcha",
                  moduleName: "vcRecaptcha",
                  files: ['/scripts/b_components/angular-recaptcha/release/angular-recaptcha.js'],
                  resolveTemplate: false
              },
              {
                  name: "ErrorHandlerService",
                  moduleName: "appLogin",
                  files: ['/login/app/services/errorHandler.service.js'],
                  resolveTemplate: false
              }

          ]
      },
      {
        name: 'newPassword',
        code: "",
        url: '/newPassword?token',
        params: {
          token: null
        },
        controller: 'newPasswordController',
        templateUrl: '/login/app/newPassword/controller/newPassword.html',
        resolver: [
          {
            name: "mainnewPassword",
            moduleName: "appLogin",
            files: ['/login/app/newPassword/controller/newPassword.js'],
            resolveTemplate: true
          }
        ]
      }
    ];

    return data;
});
