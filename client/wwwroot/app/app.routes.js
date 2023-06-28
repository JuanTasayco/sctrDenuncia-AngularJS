(function(deps,factory)
{
    define(deps, factory);
})([],function(){
    var data = [
        {
            name: "home",
            code: "",
            url: "/",
            views : {
                top: {
                    templateUrl: '/app/index/controller/template/top.html',
                    controller: 'topController'
                },
                header: {
                    templateUrl: '/app/index/controller/template/header.html',
                    controller: 'headerController'
                },
                left_bar: {
                    templateUrl: '/app/index/controller/template/left_bar.html',
                    controller: 'leftBarController'
                },
                body_middel: {
                    templateUrl: '/app/index/controller/template/body_middel.html',
                    controller: 'bodyMiddelController'
                },
                body_left: {
                    templateUrl: '/app/index/controller/template/body_left.html',
                    controller: 'bodyLeftController'
                },
                right_bar: {
                    templateUrl: '/app/index/controller/template/right_bar.html',
                    controller: 'rightBarController'
                },
                footer: {
                    templateUrl: '/app/index/controller/template/footer.html',
                    controller: 'footerController'
                },
                bottom:{
                    templateUrl: '/app/index/controller/template/bottom.html',
                    controller: 'bottomController'
                }
            },
           resolve: {
                authorizedResource : ['accessSupplier', function(accessSupplier){
                    return accessSupplier.getAllObject();
                }],
              intranetPermissions: ['oimIntranet', function(oimIntranet){
								return oimIntranet.permissions();
							}]
            },
            resolver: [
                {
                    name: "top",
                    moduleName: 'appHome',
                    files:['topController']
                },
                {
                    name: "header",
                    moduleName: 'appHome',
                    files:['headerController']
                },
                {
                    name: "left_bar",
                    moduleName: 'appHome',
                    files:['leftBarController']
                },
                {
                    name: "body_middel",
                    moduleName: 'appHome',
                    files:['bodyMiddelController']
                },
                {
                    name: "body_left",
                    moduleName: 'appHome',
                    files:['bodyLeftController']
                },
                {
                    name: "right_bar",
                    moduleName: 'appHome',
                    files:['rightBarController']
                },
                {
                    name: "footer",
                    moduleName: 'appHome',
                    files:['footerController']
                },
                {
                    name: "bottom",
                    moduleName: 'appHome',
                    files:['bottomController']
                }
            ]

        }
    ]
    return data;
});