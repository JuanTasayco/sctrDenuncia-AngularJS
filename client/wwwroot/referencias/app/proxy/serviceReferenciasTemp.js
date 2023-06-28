(function ($root, deps, action) {
    define(deps, action)
})(this, ['angular'], function (angular) {
    var module = angular.module("oim.proxyService.referencias", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxyRefs', {
        endpoint: 'http://localhost:60913/',
        controllerRefsFiltro: {
            actions: {

                'methodRefsNueva': {
                    name: 'RefsNueva',
                    path: 'WCF_OIM-REF.svc/api/referencia/nueva'
                },
                'methodRefsDepartamento': {
                    name: 'RefsDepartamento',
                    path: 'WCF_OIM-REF.svc/api/filtro'
                },
                'methodRefsDocumento': {
                    name: 'RefsDocumento',
                    path: '/WCF_OIM-REF.svc/api/asegurado/buscar'
                },
                'methodRefsListProveedor': {
                    name: 'RefsListProveedor',
                    path: 'WCF_OIM-REF.svc/api/proveedor/buscar'
                },
                'methodRefsSearchProve': {
                    name: 'RefsSearchProv',
                    path: 'WCF_OIM-REF.svc/api/proveedor/filtro'
                },
                'methodRefsListReferences': {
                    name: 'RefsListReferences',
                    path: 'WCF_OIM-REF.svc/api/referencia/listar'
                },
                'methodRefsDetalle': {
                    name: 'methodRefsDetalle',
                    path: 'WCF_OIM-REF.svc/api/referencia/detalle'
                },
                'methodRefsRevisar': {
                    name: 'methodRefsRevisar',
                    path: '/WCF_OIM-REF.svc/api/referencia/revisar'
                },
            }
        }
    })

    //filtros

    module.factory("proxyRefs", ['oimProxyRefs', 'httpData', function (oimProxyRefs, httpData) {
        return {


            'RefsDepartamento': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/filtro',
                    params, undefined, showSpin)
            },
            'RefsProvincia': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/filtro',
                    params, undefined, showSpin)
            },
            'RefsTipo': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/filtro',
                    params, undefined, showSpin)
            },
            'RefsParentesco': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/filtro',
                    params, undefined, showSpin)
            },
            'Refsusuario': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/filtro',
                    params, undefined, showSpin)
            },
            'RefsProducto': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/filtro',
                    params, undefined, showSpin)
            },
            'RefsCondicion': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/filtro',
                    params, undefined, showSpin)
            },
            'RefsDiagnostico': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/filtro',
                    params, undefined, showSpin)
            },
            'RefsInstitucion': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/filtro',
                    params, undefined, showSpin)
            },
            'RefsProveedor': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/filtro',
                    params, undefined, showSpin)
            },
            'RefsConvenio': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/filtro',
                    params, undefined, showSpin)
            },
            'RefsEntidad': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/filtro',
                    params, undefined, showSpin)
            },
            'RefsBuscador': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/asegurado/buscar',
                    params, undefined, showSpin)
            },
            'RefsCentroOrg': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/filtro',
                    params, undefined, showSpin)
            },
            'RefsServicios': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/filtro',
                    params, undefined, showSpin)
            },
            'RefsImagenologia': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/filtro',
                    params, undefined, showSpin)
            },
            'RefsEmergencias': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/filtro',
                    params, undefined, showSpin)
            },
            'RefsEspecialidades': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/filtro',
                    params, undefined, showSpin)
            },
            'RefsListProveedor': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/proveedor/buscar',
                    params, undefined, showSpin)
            },
            'RefsTraslado': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/filtro',
                    params, undefined, showSpin)
            },
            'RefsTTraslado': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/filtro',
                    params, undefined, showSpin)
            },
            'RefsSearchProve': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/proveedor/filtro',
                    params, undefined, showSpin)
            },
            'RefsCategoria': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/filtro',
                    params, undefined, showSpin)
            },
            'RefsNueva': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/referencia/nueva',
                    params, undefined, showSpin)
            },
            'RefsListReferences': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/referencia/listar',
                    params, undefined, showSpin)
            },
            'RefsProveedorTraslado': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/filtro',
                    params, undefined, showSpin)
            },
            'RefsDetalle': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/referencia/detalle',
                    params, undefined, showSpin)
            },
            'RefsEditarPaso2': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/referencia/editar/paso2',
                    params, undefined, showSpin)
            },
            'RefsEditarPaso3': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + 'WCF_OIM-REF.svc/api/referencia/editar/paso3',
                    params, undefined, showSpin)
            },
            'RefsRevisar': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + '/WCF_OIM-REF.svc/api/referencia/revisar',
                    params, undefined, showSpin)
            },
            'RefsProveDetail': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + '/WCF_OIM-REF.svc/api/proveedor/detalle',
                    params, undefined, showSpin)
            },
            'RefsMedico': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + '/WCF_OIM-REF.svc/api/filtro/medico',
                    params, undefined, showSpin)
            },
            'RefsMotivoNoRegistro': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + '/WCF_OIM-REF.svc/api/filtro',
                    params, undefined, showSpin)
            },
            'RefsMotivoAnulacion': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + '/WCF_OIM-REF.svc/api/filtro',
                    params, undefined, showSpin)
            },
            'RefsAnulacion': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + '/WCF_OIM-REF.svc/api/referencia/anular',
                    params, undefined, showSpin)
            },
            'RefsDwlPDF': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + '/WCF_OIM-REF.svc/api/referencia/detallePDF',
                    params, undefined, showSpin)
            },
            'RefsDwlExcl': function (params, showSpin) {
                return httpData['post'](oimProxyRefs.endpoint + '/WCF_OIM-REF.svc/api/referencia/listarExcel',
                    params, undefined, showSpin)
            }

        };
    }]);
});