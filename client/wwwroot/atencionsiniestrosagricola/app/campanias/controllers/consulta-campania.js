define([
    'angular', 'mfpModalQuestion', 'constants', '/atencionsiniestrosagricola/app/utilities/agricolaUtilities.js'
], function (ng, constants) {
    ConsultaCampaniaController.$inject = ['$scope', '$state', 'proxyCampania', 'mpSpin', 'mModalAlert','$uibModal','$window','agricolaUtilities'];
    function ConsultaCampaniaController($scope,  $state,  proxyCampania, mpSpin, mModalAlert,$uibModal,$window,agricolaUtilities ) {
        var vm = this;
        var listaBusqueda = [];
        var listaCampania = [];
        var listaGeneral = [];

        var usuarioSistema = "";
        vm.pagination = {
            maxSize: 10,
            sizePerPage: 10,
            currentPage: 1,
            totalRecords: 0
        }
        vm.$onInit = function () {
            usuarioSistema =  vm.$resolve.oimClaims.loginUserName;
            $scope.resultadoConsulta = [];
            vm.pageChanged = setPagingData;
            loadCampanias();
        }
        function loadCampanias() {
         
            mpSpin.start('Cargando, por favor espere...');
            proxyCampania.GetCampanias().then(function (response) {
                if (response.operationCode === 200) {
                    listaCampania = response.data;
                    $scope.resultadoConsulta = listaCampania;
                    mpSpin.end();
                    vm.pagination.totalRecords = $scope.resultadoConsulta.length;
                     
                    setPagingData(vm.pagination.currentPage);
                    listaGeneral = listaCampania;
                } else {
                    mModalAlert.showWarning("Error al cargar la campaña", "");
                }
              
            });
        }
        function setPagingData(page) {    
            var pagedData = listaCampania.slice(
                (page - 1) * vm.pagination.sizePerPage,
                page * vm.pagination.sizePerPage
            );   
            
            $scope.resultadoConsulta = pagedData;    
                
        }
        
        $scope.searchResults = function () {
            listaBusqueda = [];
            var valBuscar = $scope.mNombreCampania;
            if (typeof valBuscar !== "undefined" && valBuscar != "") {
                ng.forEach(listaGeneral, function (value, key) {
                    if ((value.codigo).includes(valBuscar.toUpperCase()) || (value.descripcion).includes(valBuscar.toUpperCase())) {
                        listaBusqueda.push(value);
                    }
                });
                listaCampania  = listaBusqueda;
               $scope.resultadoConsulta = listaBusqueda;
               vm.pagination.totalRecords = $scope.resultadoConsulta.length;
               setPagingData(1);
            }
        }

        $scope.limpiarBuscador = function () {  
            loadCampanias();     
            $scope.mNombreCampania = "";
        }
        $scope.activarCampania = function(codCampania){
            var campania = {
                "Codigo": codCampania,
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
            mpSpin.start('Cargando, por favor espere...');
                        $uibModalInstance.close();
            proxyCampania.EditCampania(codCampania,campania).then(function (response) {
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

        $scope.detalleCampania = function (item) {
            var itemCampania = angular.toJson(item);
            //$state.go('detalleCampania', { campania: itemCampania, id: item.codigo }, { reload: true, inherit: false });
            $window.location.href = agricolaUtilities.getRuta("DETALLE CAMPAÑA") + item.codigo;
        }
        $scope.editarCampania = function (item) {
            $state.go('formCampania', { campania: item, edit: 1 }, { reload: true, inherit: false });

        }
        $scope.nuevaCampania = function () {
            $state.go('formCampania', null, { reload: true, inherit: false, location: false });
        }
    }
    return ng.module('atencionsiniestrosagricola.app')
        .controller('ConsultaCampaniaController', ConsultaCampaniaController)
        .directive('preventDefault', function () {
            return function (scope, element, attrs) {
                ng.element(element).bind('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
            }
        });
});

