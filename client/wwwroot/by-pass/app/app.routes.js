define([], function () {
  var data = [
    {
      name: 'byPass',
      code: '',
      url: '/?:token&app&url',
      params: {
        token: null,
        app: null,
        url: null
      },
      controller: 'byPassController',
      templateUrl: '/by-pass/app/by-pass/by-pass.html',
      resolver: [{
        name: 'byPass',
        moduleName: 'appByPass',
        files: [
          'byPassController'
        ],
        resolveTemplate: true
      }]
    }
  ];

  return data;
});
