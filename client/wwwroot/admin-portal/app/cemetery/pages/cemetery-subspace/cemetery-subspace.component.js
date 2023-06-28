'use strict';

define([
    'angular',
    'lodash',
    'coreConstants',
    'cemeteryConstants',
    'cemeteryUtils'
], function (ng, _, coreConstants, cemeteryConstants, cemeteryUtils) {

    CemeterySubspaceComponent.$inject = ['$state', '$stateParams', '$q', '$window', '$log', 'mModalAlert', 'CemeteryFactory'];

    function CemeterySubspaceComponent($state, $stateParams, $q, $window, $log,  mModalAlert, CemeteryFactory) {

        //environments
        var vm = this;
        vm.form = {};
        vm.subspace = {};
        vm.format = {};
        vm.permanencias = [];
        vm.tipoMedidas = [];

        //methods
        vm.$onInit = onInit;
        vm.updateSpacesAndGallery = updateSpacesAndGallery;
        vm.clearMeasureType = clearMeasureType;
        vm.uploadGallery = uploadGallery;

        //events
        function onInit() {
            _setScrollTop();
            _initValues();
            _setData();
        }

        //init
        function _initValues() {
            vm.cemeteryId = $stateParams.cemeteryId;
            vm.spaceId = $stateParams.spaceId;
            vm.formatCodes = [cemeteryConstants.FORMAT.GALLERY];
            vm.permanencias = cemeteryConstants.PERMANENCES;
            vm.tipoMedidas = cemeteryConstants.PLATAFORM_MEASURE_TYPE;
            vm.section = {};
            vm.sections = [];
            vm.spaces = [];
            vm.parameters = [];
            vm.cremations = [];
            vm.sepulters = [];
            vm.platforms = [];
            vm.capabilities = [];
            vm.levels = [];
            vm.galleries = [];
        }

        //scroll
        function _setScrollTop() {
            $window.scroll(0, 0);
        }

        //upload
        function uploadGallery(event) {
            return CemeteryFactory.UploadImage(event.photoToUpload);
        }

        //set
        function _setData() {
            var defered = $q.defer();
            var promise = defered.promise;
            try {
                _getListSync().then(function (res) {
                    _setDataForm().then(function (res) {
                        defered.resolve();
                    });
                });
            } catch (e) {
                $log.log('Error', e);
                defered.reject(e);
                $state.go('errorCemetery', {}, { reload: true, inherit: false });
            }
            return promise;
        }

        //methods promises
        function _getParameters() {
            var defered = $q.defer();
            var promise = defered.promise;
            CemeteryFactory.GetParameters(
                cemeteryConstants.PARAMETER.SUBDOMAIN.SECTION + ',' +
                cemeteryConstants.PARAMETER.SUBDOMAIN.GENERAL + ',' +
                cemeteryConstants.PARAMETER.SUBDOMAIN.SEPULTURE + ',' +
                cemeteryConstants.PARAMETER.SUBDOMAIN.CREMATION
            ).then(function (res) {
                vm.parameters = _.sortBy(res.data, function (data) { return data.idParametro; });
                defered.resolve();
            }).catch(function (error) {
                defered.reject(error);
                $state.go('errorCemetery', {}, { reload: true, inherit: false });
            });
            return promise;
        }

        function _getGalleries() {
            var defered = $q.defer();
            var promise = defered.promise;
            CemeteryFactory.GetGalleries(vm.spaceId, cemeteryConstants.GALLERY_TYPE.SPACE).then(function (res) {
                vm.galleries = res.data;
                defered.resolve();
            }).catch(function (error) {
                defered.reject(error);
                $state.go('errorCemetery', {}, { reload: true, inherit: false });
            });
            return promise;
        }

        function _updateGallerries() {
            var defered = $q.defer();
            var promise = defered.promise;
            var modifiedGalleries = _getModifiedGalleries();
            CemeteryFactory.UpdateGalleries(vm.spaceId, { imagenes: modifiedGalleries }, cemeteryConstants.GALLERY_TYPE.SPACE).then(function (res) {
                defered.resolve();
            }).catch(function (error) {
                defered.reject(error);
                mModalAlert.showError(error.data.mensaje, 'Error');
            });
            return promise;
        }

        function _saveGallerries() {
            var defered = $q.defer();
            var promise = defered.promise;
            var newGalleries = _getNewGalleries();
            CemeteryFactory.SaveGalleries(vm.spaceId, { imagenes: newGalleries }, cemeteryConstants.GALLERY_TYPE.SPACE).then(function (res) {
                defered.resolve();
            }).catch(function (error) {
                defered.reject(error);
                mModalAlert.showError(error.data.mensaje, 'Error');
            });
            return promise;
        }

        function _getSpaces() {
            var defered = $q.defer();
            var promise = defered.promise;
            CemeteryFactory.GetSpaces(vm.cemeteryId).then(function (res) {
                vm.spaces = res.data;
                defered.resolve();
            }).catch(function (error) {
                defered.reject(error);
                $state.go('errorCemetery', {}, { reload: true, inherit: false })
            });
            return promise;
        }

        function _updateSpaces() {
            var defered = $q.defer();
            var promise = defered.promise;
            var modifiedSpaces = _getModifiedSpaces();
            CemeteryFactory.UpdateSpaces(vm.cemeteryId, { espacios: modifiedSpaces }).then(function (res) {
                defered.resolve();
            }).catch(function (error) {
                mModalAlert.showError(error.data.mensaje, 'Error');
                defered.reject(error);

            });
            return promise;
        }

        function _getListSync() {
            var defered = $q.defer();
            var promise = defered.promise;
            try {
                CemeteryFactory.LoginApiGateway().then(function (res) {
                    _getParameters().then(function (res) {
                        _getGalleries().then(function (res) {
                            _getSpaces().then(function (res) {
                                defered.resolve();
                            });
                        });
                    });
                });
            } catch (e) {
                $log.log('Error', e);
                defered.reject(e);
                $state.go('errorCemetery', {}, { reload: true, inherit: false })
            }
            return promise;
        }

        //set form
        function _setDataForm() {
            var defered = $q.defer();
            var promise = defered.promise;

            vm.sections = _.filter(_.filter(vm.parameters, { subDominio: cemeteryConstants.PARAMETER.SUBDOMAIN.SECTION }), { nombre: cemeteryConstants.PARAMETER.NAME.SPACE });
            vm.subspace = _.find(vm.spaces, function (s) { return s.idEspacio == vm.spaceId });
            vm.section = _.find(vm.sections, { valor4: vm.subspace.tipoEspacio });
            vm.platforms = _.filter(_.filter(vm.parameters, { nombre: cemeteryConstants.PARAMETER.NAME.PLATFORM }), { subDominio: vm.section.valor1 });
            vm.capabilities = _.filter(_.filter(vm.parameters, { nombre: cemeteryConstants.PARAMETER.NAME.CAPACITY }), { subDominio: vm.section.valor1 });
            vm.levels = _.filter(_.filter(vm.parameters, { nombre: cemeteryConstants.PARAMETER.NAME.LEVEL }), { subDominio: vm.section.valor1 });
            vm.sepulters = _.filter(_.filter(vm.parameters, { subDominio: cemeteryConstants.PARAMETER.SUBDOMAIN.SEPULTURE }), { nombre: cemeteryConstants.PARAMETER.NAME.SUBSPACE });
            vm.cremations = _.filter(_.filter(vm.parameters, { subDominio: cemeteryConstants.PARAMETER.SUBDOMAIN.CREMATION }), { nombre: cemeteryConstants.PARAMETER.NAME.SUBSPACE });
            vm.formats = _.filter(vm.parameters, function (parameter) { if (_.contains(vm.formatCodes, parameter.nombre)) return parameter; });
            vm.format.gallery = _.find(vm.formats, { nombre: cemeteryConstants.FORMAT.GALLERY });

            vm.form.galleries = _buildGalleries();

            if (vm.subspace.tipoEspacio == cemeteryConstants.SPACE.COD_CREMATION) {
                var cremation = _.find(vm.cremations, { valor4: vm.subspace.subtipoEspacio })
                vm.subspace.nombreSubEspacio = cremation.valor1;
                vm.subspace.rutaImagen = cremation.valor2;
            } else {
                if (vm.subspace.tipoEspacio == cemeteryConstants.SPACE.COD_SEPULTURE) {
                    var sepulture = _.find(vm.sepulters, { valor4: vm.subspace.subtipoEspacio })
                    vm.subspace.nombreSubEspacio = sepulture.valor1;
                    vm.subspace.rutaImagen = sepulture.valor2;
                }
            }

            vm.form.plataformas = vm.platforms;
            _.forEach(vm.form.plataformas, function (plataforma) {
                plataforma.activo = '0';
                plataforma.tipoMedida = "";
                plataforma.tipoMedidas = angular.copy(vm.tipoMedidas);
                plataforma.capacidades = angular.copy(vm.capabilities);
                plataforma.niveles = angular.copy(vm.levels);
            });
            //match permanencias
            _.forEach(vm.permanencias, function (permanencia) {
                permanencia.activo = _.contains(vm.subspace.cesion.split('|'), permanencia.codigo) ? '1' : '0';
            });
            //match plataformas
            if (vm.subspace.plataformas.length > 0) {
                vm.subspace.plataformas = JSON.parse(vm.subspace.plataformas);
            } else {
                vm.subspace.plataformas = [];
            }

            _.forEach(vm.form.plataformas, function (plataformas1) {
                _.forEach(vm.subspace.plataformas, function (plataformas2) {
                    if (plataformas1.valor4 === plataformas2.codPlataforma) {
                        plataformas1.activo = '1';
                        plataformas1.tipoMedida = plataformas2.tipoMedida;
                        if (plataformas1.tipoMedida === 'CAPACIDAD') {
                            _.forEach(plataformas1.capacidades, function (capacidad1) {
                                _.forEach(plataformas2.medidas.split('|'), function (capacidad2) {
                                    if (capacidad1.valor4 == capacidad2) {
                                        capacidad1.activo = '1'
                                    }
                                });
                            });
                        }
                        if (plataformas1.tipoMedida === 'NIVEL') {
                            _.forEach(plataformas1.niveles, function (capacidad1) {
                                _.forEach(plataformas2.medidas.split('|'), function (capacidad2) {
                                    if (capacidad1.valor4 == capacidad2) {
                                        capacidad1.activo = '1'
                                    }
                                });
                            });
                        }

                    }
                });
            });

            defered.resolve();
            return promise;
        }

        //methods business
        function _buildGalleries() {
            _.forEach(vm.galleries, function (gallery) {
                gallery.srcImg = cemeteryUtils.concatenateWithTime(gallery.rutaImagen);
                gallery.rutaImagen = "";
            });
            var positionsGallery = _.map(vm.galleries, function (item) {
                return item.posicionGaleria;
            })
            var count = vm.galleries.length;
            if (count < cemeteryConstants.MAX_LENGTH_SPACE_GALLERY) {
                for (var index = 1; index <= cemeteryConstants.MAX_LENGTH_SPACE_GALLERY; index++) {
                    if (!_.contains(positionsGallery, 'galeria_' + index)) {
                        vm.galleries.push({ posicionGaleria: 'galeria_' + index, rutaImagen: '', srcImg: '', activo: '0' });
                    }
                }
            }
            return vm.galleries;
        }

        function clearMeasureType(plataforma) {
            _.forEach(plataforma.capacidades, function (capacidad) {
                capacidad.activo = '0'
            });
            _.forEach(plataforma.niveles, function (nivel) {
                nivel.activo = '0'
            });
        }

        function _getModifiedGalleries() {
            var modifiedGalleries = angular.copy(_.filter(vm.form.galleries, function (gallery) {
                if (gallery.activo === '1' && gallery.rutaImagen != '') {
                    return gallery;
                }
            }));

            _.forEach(modifiedGalleries, function (gallery) {
                delete gallery.srcImg;
                delete gallery.valor6;
                delete gallery.idTipoGaleria;
            });

            return modifiedGalleries
        }

        function _getNewGalleries() {
            var newGalleries = angular.copy(_.filter(vm.form.galleries, function (gallery) {
                if (gallery.activo === '0' && gallery.rutaImagen != '') {
                    return gallery;
                }
            }));

            _.forEach(newGalleries, function (gallery) {
                gallery.activo = '1';
            });

            _.forEach(newGalleries, function (gallery) {
                delete gallery.srcImg;
                delete gallery.valor6;
            });

            return newGalleries;
        }

        function _getModifiedSpaces() {
            var spaces = [];
            vm.subspace.cesion = _.map(_.filter(vm.permanencias, { activo: '1' }), function (item) {
                return item.codigo;
            }).join("|");;

            var plataformas = [];
            _.forEach(_.filter(vm.form.plataformas, { activo: '1' }), function (plataforma) {
                var item = {};
                item.codPlataforma = plataforma.valor4;
                item.tipoMedida = plataforma.tipoMedida;
                item.activo = plataforma.activo;
                if (item.tipoMedida == "CAPACIDAD") {
                    var medidas = _.map(_.filter(plataforma.capacidades, { activo: '1' }), function (item) {
                        return item.valor4;
                    }).join("|");
                }
                if (item.tipoMedida == "NIVEL") {
                    var medidas = _.map(_.filter(plataforma.niveles, { activo: '1' }), function (item) {
                        return item.valor4;
                    }).join("|");
                }

                item.medidas = medidas;

                plataformas.push(item);
            });

            if (plataformas.length > 0) {
                vm.subspace.plataformas = JSON.stringify(angular.copy(plataformas));
            } else {
                vm.subspace.plataformas = "";
            }
            spaces.push({
                idEspacio: vm.subspace.idEspacio,
                tipoEspacio: vm.subspace.tipoEspacio,
                activo: vm.subspace.activo,
                cesion: vm.subspace.cesion,
                descripcionGeneral: vm.subspace.descripcionGeneral,
                plataformas: vm.subspace.plataformas,
                subtipoEspacio: vm.subspace.subtipoEspacio
            });

            return spaces;
        }

        function updateSpacesAndGallery() {
            CemeteryFactory.LoginApiGateway().then(function (res) {
                _updateSpaces().then(function (res) {
                    if (_getModifiedGalleries().length > 0 && _getNewGalleries().length > 0) {
                        _updateGallerries().then(function (res) {
                            _saveGallerries().then(function (res) {
                                _setData()
                                mModalAlert.showSuccess("", "Cambios realizados");
                            });
                        });
                    } else {
                        if (_getModifiedGalleries().length > 0) {
                            _updateGallerries().then(function (res) {
                                _setData()
                                mModalAlert.showSuccess("", "Cambios realizados");
                            });
                        } else {
                            if (_getNewGalleries().length > 0) {
                                _saveGallerries().then(function (res) {
                                    _setData()
                                    mModalAlert.showSuccess("", "Cambios realizados");
                                });
                            } else {
                                _setData()
                                mModalAlert.showSuccess("", "Cambios realizados");
                            }
                        }
                    }
                });
            });
        }

    }

    return ng.module(coreConstants.ngMainModule).controller('CemeterySubspaceComponent', CemeterySubspaceComponent);
});
