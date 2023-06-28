'use strict';

define([
    'angular',
    'lodash',
    'coreConstants',
    'cemeteryConstants'
], function (ng, _, coreConstants, cemeteryConstants) {

    CemeterySpaceComponent.$inject = ['$state', '$stateParams', '$q', '$window', '$log', 'mModalAlert', 'CemeteryFactory'];

    function CemeterySpaceComponent($state, $stateParams, $q, $window, $log, mModalAlert, CemeteryFactory) {

        //environments
        var vm = this;
        vm.form = {};
        vm.tabs = [{ name: "Infórmacion", active: false, href: "cemeteryInfo" }, { name: "Espacios", active: true, href: "cemeterySpace" }]

        //methods
        vm.$onInit = onInit;
        vm.upateCemeteryAndSpaces = upateCemeteryAndSpaces;
        vm.disableSpace = disableSpace;

        //events
        function onInit() {
            _setScrollTop();
            _initValues();
            _setData();
        }

        //init
        function _initValues() {
            vm.cemeteryId = $stateParams.cemeteryId;
            vm.cemetery = {};
            vm.parameters = [];
            vm.subspaces = [];
            vm.sections = [];
            vm.sepulters = [];
            vm.cremations = [];
        }

        //scroll
        function _setScrollTop() {
            $window.scroll(0, 0);
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
            CemeteryFactory.GetParameters(cemeteryConstants.PARAMETER.SUBDOMAIN.SECTION + ',' + cemeteryConstants.PARAMETER.SUBDOMAIN.SEPULTURE + ',' + cemeteryConstants.PARAMETER.SUBDOMAIN.CREMATION).then(function (res) {
                vm.parameters = _.sortBy(res.data, function (data) { return data.idParametro; });
                defered.resolve();
            }).catch(function (error) {
                defered.reject(error);
                $state.go('errorCemetery', {}, { reload: true, inherit: false });
            });
            return promise;
        }

        function _getSpaces() {
            var defered = $q.defer();
            var promise = defered.promise;
            CemeteryFactory.GetSpaces(vm.cemeteryId).then(function (res) {
                vm.subspaces = res.data;
                defered.resolve();
            }).catch(function (error) {
                defered.reject(error);
                $state.go('errorCemetery', {}, { reload: true, inherit: false });
            });
            return promise;
        }

        function _getCemetery() {
            var defered = $q.defer();
            var promise = defered.promise;
            CemeteryFactory.GetCemetery(vm.cemeteryId).then(function (res) {
                vm.cemetery = res.data;
                defered.resolve();
            }).catch(function (error) {
                defered.reject(error);
                $state.go('errorCemetery', {}, { reload: true, inherit: false });
            });
            return promise;
        }

        function _updateCemetery() {
            var defered = $q.defer();
            var promise = defered.promise;
            var cemetery = _getModifiedCemetery();
            cemetery.rutaImagenCarrusel = "";
            cemetery.rutaImagenBanner = "";
            CemeteryFactory.UpdateCemetery(cemetery).then(function (res) {
                defered.resolve();
            }).catch(function (error) {
                defered.reject(error);
                mModalAlert.showError(error.data.mensaje, 'Error');
            });

            return promise;
        }

        function _saveSpaces() {
            var defered = $q.defer();
            var promise = defered.promise;
            var newSpaces = _getNewSpaces();
            CemeteryFactory.SaveSpaces(vm.cemeteryId, { espacios: newSpaces }).then(function (res) {
                defered.resolve();
            }).catch(function (error) {
                defered.reject(error);
                mModalAlert.showError(error.data.mensaje, 'Error');
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
                defered.reject(error);
                mModalAlert.showError(error.data.mensaje, 'Error');
            });
            return promise;
        }

        function _getListSync() {
            var defered = $q.defer();
            var promise = defered.promise;
            try {
                CemeteryFactory.LoginApiGateway().then(function (res) {
                    _getParameters().then(function (res) {
                        _getSpaces().then(function (res) {
                            _getCemetery().then(function (res) {
                                defered.resolve();
                            });
                        });
                    });
                });
            } catch (e) {
                $log.log('Error', e);
                defered.reject(e);
                $state.go('errorCemetery', {}, { reload: true, inherit: false });
            }
            return promise;
        }

        //validate
        function _validationForm() {
            if (!vm.cemetery.codEspaciosActivos) {
                mModalAlert.showWarning("Ingrese al menos un espacio", 'Advertencia');
                return false;
            }

            return true;
        }

        //set form
        function _setDataForm() {
            var defered = $q.defer();
            var promise = defered.promise;

            vm.sections = _.filter(_.filter(vm.parameters, { subDominio: cemeteryConstants.PARAMETER.SUBDOMAIN.SECTION }), { nombre: cemeteryConstants.PARAMETER.NAME.SPACE });
            vm.sepulters = _.filter(_.filter(vm.parameters, { subDominio: cemeteryConstants.PARAMETER.SUBDOMAIN.SEPULTURE }), { nombre: cemeteryConstants.PARAMETER.NAME.SUBSPACE });
            vm.cremations = _.filter(_.filter(vm.parameters, { subDominio: cemeteryConstants.PARAMETER.SUBDOMAIN.CREMATION }), { nombre: cemeteryConstants.PARAMETER.NAME.SUBSPACE });
            //set spaces
            vm.form.spaces = vm.sections;
            _.forEach(vm.form.spaces, function (space) {
                if (space.valor1 === cemeteryConstants.SPACE.SEPULTURE) {
                    space.subspaces = vm.sepulters;
                }
                if (space.valor1 === cemeteryConstants.SPACE.CREMATION) {
                    space.subspaces = vm.cremations;
                }
            });
            //enable subspace  
            _.forEach(vm.form.spaces, function (space) {
                space.activo = _.contains(vm.cemetery.codEspaciosActivos.split('|'), space.valor4) ? '1' : '0';
                _.forEach(space.subspaces, function (subspace1) {
                    subspace1.idEspacio = 0;
                    subspace1.activo = '0';
                    _.forEach(vm.subspaces, function (subspace2) {
                        if (subspace1.valor4 === subspace2.subtipoEspacio) {
                            subspace1.idEspacio = subspace2.idEspacio;
                            subspace1.activo = subspace2.activo;
                            subspace1.cesion = subspace2.cesion;
                            subspace1.plataformas = subspace2.plataformas;
                        }
                    });
                });
            });

            defered.resolve();
            return promise;
        }

        //method business
        function _getModifiedSpaces() {
            var subspaces = [];
            _.forEach(vm.form.spaces, function (space) {
                _.forEach(space.subspaces, function (subspace) {
                    subspaces.push({
                        idEspacio: subspace.idEspacio,
                        tipoEspacio: subspace.subDominio == cemeteryConstants.PARAMETER.SUBDOMAIN.SEPULTURE ? cemeteryConstants.SPACE.COD_SEPULTURE : cemeteryConstants.SPACE.COD_CREMATION,
                        activo: subspace.activo,
                        cesion: subspace.cesion,
                        descripcionGeneral: subspace.descripcion,
                        plataformas: subspace.plataformas,
                        subtipoEspacio: subspace.valor4
                    })
                });
            });

            var modifiedSpaces = _.filter(subspaces, function (space) {
                if (space.idEspacio > 0) {
                    return space;
                }
            });

            return modifiedSpaces;
        }

        function _getNewSpaces() {
            var subspaces = [];
            _.forEach(vm.form.spaces, function (space) {
                _.forEach(space.subspaces, function (subspace) {
                    subspaces.push({
                        activo: subspace.activo,
                        cesion: "",
                        descripcionGeneral: subspace.descripcion,
                        idEspacio: subspace.idEspacio,
                        plataformas: "",
                        subtipoEspacio: subspace.valor4,
                        tipoEspacio: subspace.subDominio == cemeteryConstants.PARAMETER.SUBDOMAIN.SEPULTURE ? cemeteryConstants.SPACE.COD_SEPULTURE : cemeteryConstants.SPACE.COD_CREMATION
                    })
                });
            });

            var newSpaces = _.filter(subspaces, function (space) {
                if (space.idEspacio == 0 && space.activo == '1') {
                    return space;
                }
            });

            return newSpaces;
        }

        function _getModifiedCemetery() {

            return vm.cemetery;
        }

        function disableSpace() {
            _.forEach(vm.form.spaces, function (space) {
                var subspaces = _.filter(space.subspaces, { activo: '1' });
                if (subspaces.length > 0) {
                    space.activo = '1';
                } else {
                    space.activo = '0';
                }
            });

            var enableSepulture = false;
            var enableCremation = false;

            _.forEach(vm.form.spaces, function (space) {
                var subspaces = _.filter(space.subspaces, { activo: '1' });
                if (space.valor1 == cemeteryConstants.SPACE.SEPULTURE) {
                    if (subspaces.length > 0) {
                        enableSepulture = true;
                    }
                }
                if (space.valor1 == cemeteryConstants.SPACE.CREMATION) {
                    if (subspaces.length > 0) {
                        enableCremation = true;
                    }
                }
            });

            if (enableSepulture && enableCremation) {
                vm.cemetery.codEspaciosActivos = cemeteryConstants.SPACE.COD_SEPULTURE + '|' + cemeteryConstants.SPACE.COD_CREMATION;;
                return;
            }

            if (enableSepulture) {
                vm.cemetery.codEspaciosActivos = cemeteryConstants.SPACE.COD_SEPULTURE;
                return;
            }

            if (enableCremation) {
                vm.cemetery.codEspaciosActivos = cemeteryConstants.SPACE.COD_CREMATION;
                return;
            }

            vm.cemetery.codEspaciosActivos = "";
        }

        function upateCemeteryAndSpaces() {
            if (_validationForm()) {
                CemeteryFactory.LoginApiGateway().then(function (res) {
                    _updateCemetery().then(function (res) {
                        if (_getModifiedSpaces().length > 0 && _getNewSpaces().length > 0) {
                            _updateSpaces().then(function (res) {
                                _saveSpaces().then(function (res) {
                                    _setData();
                                    mModalAlert.showSuccess("", "Cambios realizados");
                                });
                            });
                        } else {
                            if (_getModifiedSpaces().length > 0) {
                                _updateSpaces().then(function (res) {
                                    _setData()
                                    mModalAlert.showSuccess("", "Cambios realizados");
                                });
                            } else {
                                if (_getNewSpaces().length > 0) {
                                    _saveSpaces().then(function (res) {
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

    }

    return ng.module(coreConstants.ngMainModule).controller('CemeterySpaceComponent', CemeterySpaceComponent);
});
