module.exports = function buildProxy(grunt) {

    function buildFileProxy(mustacheConfig, cmdExec, setting) {
        var descriptorsService = getDescriptor(setting.descriptorPath);

        var mtRender = grunt.config(mustacheConfig);

        for (var item in mtRender.files)
            mtRender.files[item].data.controllers = descriptorsService

        grunt.config(mustacheConfig, mtRender);

        grunt.task.run([cmdExec]);
    }

    function getDescriptor(path) {
        var descriptorsService = grunt.file.readJSON(path);

        for (var index in descriptorsService) {
            var item = descriptorsService[index];
            item.comma = index != descriptorsService.length - 1

            for (var actIndex in item.actions) {
                var action = item.actions[actIndex];
                action.comma = actIndex != item.actions.length - 1;
                action.wasParameter = action.parameters.length > 0
                action.queryParameters = [];
                action.bodyParameters = [];

                for (var paramIndex in action.parameters) {
                    var param = action.parameters[paramIndex]
                    param.comma = paramIndex != action.parameters.length - 1;
                    param.isOptional = param.defaultValue !== undefined;
                    if (param.isQueryParam) action.queryParameters.push(param);
                    else action.bodyParameters.push(param);
                }
                action.wasQueryParameter = action.queryParameters.length > 0
                action.wasBodyParameters = action.bodyParameters.length > 0
                if (action.wasQueryParameter) action.queryParameters[action.queryParameters.length - 1]._comma = true;
                if (action.wasBodyParameters) action.bodyParameters[action.bodyParameters.length - 1]._comma = true;

            }
        }
        return descriptorsService;
    }

    var configurations = {
        mustache_render: {
            proxyLogin: {
                files: [{
                    template: 'proxy/templates/comunication.mustache',
                    dest: 'wwwroot/app/proxy/serviceLogin.js', // 'proxy/bin/serviceLogin.js' ,
                    data: {
                        moduleName: 'oim.proxyService.Login',
                        endpointName: 'security',
                        constantsName: 'oimProxyLogin'
                    }
                }]
            },
            proxyPoliza: {
                files: [{
                    template: 'proxy/templates/comunication.mustache',
                    dest: 'wwwroot/polizas/app/proxy/servicePoliza.js', //'proxy/bin/servicePoliza.js' ,
                    data: {
                        moduleName: 'oim.proxyService.poliza',
                        endpointName: 'policy',
                        constantsName: 'oimProxyPoliza'
                    }
                }]
            },
            proxyRenovacion: {
                files: [{
                    template: 'proxy/templates/comunication.mustache',
                    dest: 'wwwroot/renovacion/app/proxy/renovacionService.js', //'proxy/bin/serviceRenovacion.js' ,
                    data: {
                        moduleName: 'oim.proxyService.renovacion',
                        endpointName: 'renovacion',
                        constantsName: 'oimProxyRenovacion'
                    }
                }]
            },
            proxyNsctr: {
                files: [{
                    template: 'proxy/templates/comunication.mustache',
                    dest: 'wwwroot/nsctr/app/proxy/serviceNsctr.js', //'proxy/bin/serviceNsctr.js' ,
                    data: {
                        moduleName: 'oim.proxyService.nsctr',
                        endpointName: 'nsctr',
                        constantsName: 'oimProxyNsctr'
                    }
                }]
            },
            proxyCgw: {
                files: [{
                    template: 'proxy/templates/comunication.mustache',
                    dest: 'wwwroot/cgw/app/proxy/serviceCgw.js',
                    data: {
                        moduleName: 'oim.proxyService.cgw',
                        endpointName: 'cgw',
                        constantsName: 'oimProxyCgw'
                    }
                }]
            },
            proxyGrqc: {
                files: [{
                    template: 'proxy/templates/comunication.mustache',
                    dest: 'wwwroot/grqc/app/proxy/serviceGrqc.js',
                    data: {
                        moduleName: 'oim.proxyService.grqc',
                        endpointName: 'grqc',
                        constantsName: 'oimProxyGrqc'
                    }
                }]
            },			
            proxyGcw: {
                files: [{
                    template: 'proxy/templates/comunication.mustache',
                    dest: 'wwwroot/gcw/app/proxy/serviceGcw.js',
                    data: {
                        moduleName: 'oim.proxyService.gcw',
                        endpointName: 'gcw',
                        constantsName: 'oimProxyGcw'
                    }
                }]
            },
            proxyInspec: {
                files: [{
                    template: 'proxy/templates/comunication.mustache',
                    dest: 'wwwroot/cgw/app/proxy/serviceInspec.js',
                    data: {
                        moduleName: 'oim.proxyService.inspec',
                        endpointName: 'inspec',
                        constantsName: 'oimProxyInspec'
                    }
                }]
            },
            proxyEnel: {
                files: [{
                    template: 'proxy/templates/comunication.mustache',
                    dest: 'wwwroot/enel/app/proxy/serviceEnel.js',
                    data: {
                        moduleName: 'oim.proxyService.enel',
                        endpointName: 'enel',
                        constantsName: 'oimProxyEnel'
                    }
                }]
            },
            proxyActter: {
                files: [{
                    template: 'proxy/templates/comunication.mustache',
                    dest: 'wwwroot/actter/app/proxy/serviceActter.js',
                    data: {
                        moduleName: 'oim.proxyService.actter',
                        endpointName: 'actter',
                        constantsName: 'oimProxyActter'
                    }
                }]
            },
        },
    }

    grunt.registerTask('generateProxyEnel', 'Generation of proxies for enel', function(target) {
        buildFileProxy('mustache_render.proxyEnel', 'mustache_render:proxyEnel', proxyGenerator.enel)
    });
    grunt.registerTask('generateProxyCgw', 'Generation of proxies for cgw', function(target) {
        buildFileProxy('mustache_render.proxyCgw', 'mustache_render:proxyCgw', proxyGenerator.cgw)
    });
    grunt.registerTask('generateProxyGrqc', 'Generation of proxies for grqc', function(target) {
        buildFileProxy('mustache_render.proxyGrqc', 'mustache_render:proxyGrqc', proxyGenerator.grqc)
    });	
    grunt.registerTask('generateProxyGcw', 'Generation of proxies for gcw', function(target) {
        buildFileProxy('mustache_render.proxyGcw', 'mustache_render:proxyGcw', proxyGenerator.gcw)
    });
    grunt.registerTask('generateProxyNsctr', 'Generation of proxies for nsctr', function(target) {
        buildFileProxy('mustache_render.proxyNsctr', 'mustache_render:proxyNsctr', proxyGenerator.nsctr)
    });
    grunt.registerTask('generateProxyPoliza', 'Generation of proxies for polizas', function(target) {
        buildFileProxy('mustache_render.proxyPoliza', 'mustache_render:proxyPoliza', proxyGenerator.poliza)
    });
    grunt.registerTask('generateProxyRenovacion', 'Generation of proxies for renovacion', function(target) {
        buildFileProxy('mustache_render.proxyRenovacion', 'mustache_render:proxyRenovacion', proxyGenerator.renovacion)
    });
    grunt.registerTask('generateProxyLogin', 'Generation of proxies for Login', function(target) {
        buildFileProxy('mustache_render.proxyLogin', 'mustache_render:proxyLogin', proxyGenerator.login)
    });

    grunt.registerTask('generateProxyWebProc', 'Generation of proxies for Web Procurador', function(target) {
        buildFileProxy('mustache_render.proxyWebProc', 'mustache_render:proxyWebProc', proxyGenerator.login)
    });
    grunt.registerTask('generateProxyActter', 'Generation of proxies for cgw', function(target) {
        buildFileProxy('mustache_render.proxyActter', 'mustache_render:proxyActter', proxyGenerator.cgw)
    });

    grunt.registerTask('reBuildRenovacion', 'Download descriptor and generate proxies for renovacion', function() { grunt.task.run(['http:renovacionDescriptor', 'generateProxyRenovacion']); })

    grunt.registerTask('reBuildProxyEnel', 'Download descriptor and generate proxies for enel', function() { grunt.task.run(['http:enelDescriptor', 'generateProxyEnel']); })

    grunt.registerTask('reBuildProxyCgw', 'Download descriptor and generate proxies for cgw', function() { grunt.task.run(['http:cgwDescriptor', 'generateProxyCgw']); })

    grunt.registerTask('reBuildProxyGrqc', 'Download descriptor and generate proxies for grqc', function() { grunt.task.run(['http:grqcDescriptor', 'generateProxyGrqc']); })
	
    grunt.registerTask('reBuildProxyNsctr', 'Download descriptor and generate proxies for nsctr', function() { grunt.task.run(['http:nsctrDescriptor', 'generateProxyNsctr']); })

    grunt.registerTask('reBuildProxyGcw', 'Download descriptor and generate proxies for gcw', function() { grunt.task.run(['http:gcwDescriptor', 'generateProxyGcw']); })

    grunt.registerTask('reBuildProxyPoliza', 'Download descriptor and generate proxies for polizas', function() { grunt.task.run(['http:polizaDescriptor', 'generateProxyPoliza']); })

    grunt.registerTask('reBuildProxyActter', 'Download descriptor and generate proxies for cgw', function() { grunt.task.run(['http:cgwDescriptor', 'generateProxyActter']); })
    
    grunt.registerTask('reBuildProxyLogin', 'Download descriptor and generate proxies for login', function() { grunt.task.run(['http:loginDescriptor', 'generateProxyLogin']); })

}
