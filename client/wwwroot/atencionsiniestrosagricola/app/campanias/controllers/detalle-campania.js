
define([
    'angular', 'constants', '/atencionsiniestrosagricola/app/utilities/agricolaUtilities.js'
], function (ng, constants) {
    DetalleCampaniaController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'proxyCampania', 'mpSpin', 'mModalAlert','$uibModal','$route','agricolaUtilities'];
    function DetalleCampaniaController($rootScope, $scope, $state, $stateParams, proxyCampania, mpSpin, mModalAlert,$uibModal,$route,agricolaUtilities) {
        var vm = this;
        //Usuario
        usuarioSistema = "";
        $scope.masters = {};

        //Codigo de campaña
        codigoCampania = 0;

        //Opcion de listado por defecto
        $scope.mListado = 1;

        vm.$onInit = function () {
            if ($rootScope.mTabCampania) {
                delete $rootScope.mTabCampania;
                window.location.reload();
            }
                cargarCampania($stateParams.id);         
        }
        function cargarCampania(codCampania) {
            proxyCampania.GetCampania(codCampania).then(function (response) {
                if (response.operationCode === 200) {
                    $scope.objCampaniaDatosGenerales = response.data[0];
                    var menuElements = response.data[0].menuCampanias;
        

                    $scope.menuConsulta = menuElements;
                    codigoCampania = $stateParams.id;
                    
                    usuarioSistema = vm.$resolve.oimClaims.loginUserName;
                    $scope.masters.usuarioSistema = usuarioSistema;
                    $scope.masters.codigoCampania = codigoCampania;
                    $scope.masters.estadoRegistro = $scope.objCampaniaDatosGenerales.estadoRegistro;
                    
                    $rootScope.mTabCampania = $scope.mListado; 
                } else {
                    mModalAlert.showWarning("Error al cargar la campaña", "");
                }

            });
        }

        $scope.refMenuActive = function (codMenu) {
         
            ng.forEach($scope.menuConsulta, function (value, refMenu) {
                if ($scope.menuConsulta[refMenu].codigoMenu === codMenu) {
                    $scope.menuConsulta[refMenu].elementoActivo = true;
                    $scope.mListado = $scope.menuConsulta[refMenu].codigoMenu;
                    //Manejos de tabs
                    $rootScope.mTabCampania = $scope.mListado;
                }
                else {
                    $scope.menuConsulta[refMenu].elementoActivo = false;
                }
            });
        }

        
        $scope.activarCampania = function () {
            var codigo = {
                "Codigo": $stateParams.id,
                "usuarioModificacion" : usuarioSistema
            };
            $uibModal.open({
                backdrop: 'static',
                backdropClick: true,
                dialogFade: false,
                keyboard: false,
                scope: $scope,
                template: '<mfp-modal-question data="data"></mfp-modal-question>',
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    $scope.closeModal = function () {
                        $uibModalInstance.close();
                    };
                    $scope.activarCampania = function () {
                        $uibModalInstance.close();
            mpSpin.start('Cargando, por favor espere...');
            proxyCampania.EditCampania($stateParams.id,codigo).then(function (response) {
                if (response.operationCode === 200) {
                                var mensajes = response.data.descripcion.split("|");
                                var fullMensaje ="";
                                if(mensajes.includes("401")){
                                    fullMensaje="La campaña " + "no tiene el mínimo de Usuarios Asignados necesarios";  
                                }
                                if(mensajes.includes("402")){
                                    fullMensaje= '\t' +"La campaña " + "no tiene el mínimo de Cultivos necesarios"; 
                                }
                                if(mensajes.includes("403")){
                                    fullMensaje='\t'+fullMensaje + "La campaña " + "no tiene el mínimo de Sectores Estadísticos necesarios"; 
                                }
                                if(mensajes.includes("404")){
                                    fullMensaje='\t' +"La campaña " + "no tiene el mínimo de Relación de Sectores Cultivos necesarios";  
                                }
                                if(response.data.codigo!=0){
                                    mModalAlert.showWarning(fullMensaje, "");
                                }  
                                if(response.data.codigo==0){
                                    mModalAlert.showSuccess("Campaña Activada", "").then(function(){
                    $state.reload();
                                    });
                                }                                
                                mpSpin.end();
                } else {
                    mModalAlert.showWarning("Error al activar la campaña", "");
                }
            });

                    },
                        $scope.data = {
                            title: '¿Está seguro de activar la campaña?',
                            subtitle: '',
                            //buttonConfirm: 'Sí',
                            //buttonNoConfirm: 'No'
                            btns: [
                                {
                                    lbl: 'No',
                                    accion: $scope.closeModal,
                                    clases: 'g-btn-transparent'
                                },
                                {
                                    lbl: 'Sí',
                                    accion: $scope.activarCampania,
                                    clases: 'g-btn-verde'
                                }
                            ]
                        };
                }]
            });

        }
        $scope.clonarCampania = function () {
            var codigo = {
                "Codigo": $stateParams.id,
                "Accion" : "clonar"
            };
       

            $uibModal.open({
                backdrop: 'static',
                backdropClick: true,
                dialogFade: false,
                keyboard: false,
                scope: $scope,
                template: '<mfp-modal-question data="data"></mfp-modal-question>',
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    $scope.closeModal = function () {
                        $uibModalInstance.close();
                    };
                    $scope.clonarCampania = function () {
            mpSpin.start('Cargando, por favor espere...');
                        $uibModalInstance.close();
            proxyCampania.InsertCampania(codigo).then(function (response) {
                if (response.operationCode === 200) {
                    $state.go('campanias', null, { reload: true, inherit: false });   
                    mModalAlert.showSuccess("Campaña Clonada", "");
                                mpSpin.end();
                } else {
                    mModalAlert.showWarning("Error al clonar la campaña", "");
                }
            });

                    },
                        $scope.data = {
                            title: '¿Está seguro de clonar la campaña?',
                            subtitle: '',
                            //buttonConfirm: 'Sí',
                            //buttonNoConfirm: 'No'
                            btns: [
                                {
                                    lbl: 'No',
                                    accion: $scope.closeModal,
                                    clases: 'g-btn-transparent'
                                },
                                {
                                    lbl: 'Sí',
                                    accion: $scope.clonarCampania,
                                    clases: 'g-btn-verde'
                                }
                            ]
                        };
                }]
            });

        }
    }
    return ng.module('atencionsiniestrosagricola.app')
        .controller('DetalleCampaniaController', DetalleCampaniaController)
        .directive('preventDefault', function () {
            return function (scope, element, attrs) {
                ng.element(element).bind('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
            }
        });
});

