(function ($root, name, deps, action) {
    $root.define(name, deps, action)
})(window, 'tabRelSectorCultivoCampania', ['angular', 'mfpModalQuestion', '/atencionsiniestrosagricola/app/utilities/agricolaUtilities.js'], function (angular) {
    angular.module('atencionsiniestrosagricola.app').
        controller('tabRelSectorCultivoCampaniaController', ['$rootScope', '$scope', '$http', '$uibModal', 'mpSpin', 'mModalAlert', 'proxyCampania', 'agricolaUtilities', 'oimProxyAtencionsiniestrosagricola','$timeout',
            function ($rootScope, $scope, $http, $uibModal, mpSpin, mModalAlert, proxyCampania, agricolaUtilities, oimURL,$timeout) {
                var vm = this;
                //Usuario
                usuarioSistema = "";
                var mCultivoSector = [];

                //Tipo excel
                tipoExcel = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

                //Codigo de campaña
                codigoCampania = 0;

                //Paginación y búsqueda
                $scope.maxSize = 10;
                $scope.sizePerPage = 10;
                $scope.currentPage = 1;
                $scope.totalRecords = 0;
                $scope.changePage = setPagingData;


                //Sectores estadisticos
                var listaBusquedaCultivoSector = []; //Lista de búsqueda
                var listaCultivoSector = []; //Lista que alimenta al listado en la vista
                var listaGeneralCultivoSector = []; //Lista que almacena todos los registros

                //Nombre de archivo
                var nombrePlantilla = "Plantilla_Sector_Relacion.xlsx";
                var mBlobLog = [];

                vm.$onInit = function () {
                    $scope.Plantilla_RelSector = agricolaUtilities.getRuta("PLANTILLA").concat(nombrePlantilla);
                    $scope.mListaRelEstad = true;
                    usuarioSistema = vm.masters.usuarioSistema;
                    codigoCampania = vm.masters.codigoCampania;
                }

                $scope.mBotonValidar = true;
                //Manejo de cargas por tab
                $rootScope.$watch('mTabCampania', function () {
                    cargarTabSectorEst();
                }, true);

                function cargarTabSectorEst() {
                    var tabActivo = $rootScope.mTabCampania;
                    if (tabActivo == 4) {
                        $scope.estadoRegistro = vm.masters.estadoRegistro;
                        cargarCultivoSector();
                }
                }

                function cargarCultivoSector() {
                    mpSpin.start('Cargando, por favor espere...');
                    proxyCampania.GetCultivoSector(codigoCampania).then(function (response) {
                        if (response.operationCode === 200) {
                            listaCultivoSector = response.data;
                            $scope.listaCultivoSector = listaCultivoSector;

                            $scope.totalRecords = $scope.listaCultivoSector.length;
                            $scope.currentPage = 1;
                            setPagingData($scope.currentPage);
                            listaGeneralCultivoSector = listaCultivoSector;
                            mpSpin.end();
                        } else {
                            mModalAlert.showWarning("Error al cargar los usuarios", "");
                }
                    });
                }

                $scope.$watch('fileRelSector', function (nv) {
                    var nvf = null;
                    if (!(typeof nv === 'undefined')) {
                        nvf = nv[0];
                        if (!(typeof nvf === 'undefined')) {
                            $scope.filesAI1 = [];
                            var validTypeFormat = validFormatFile(nvf.type, 'fileRelSector');
                            if (validTypeFormat === false) {
                                mModalAlert.showWarning('El archivo [' + nvf.name + '] , no tiene el formato correcto, formatos admitidos: xls, xlsx', '');
                                return void 0;
                            }
                            $scope.filesAI1.push(nvf);
                            var reader = new FileReader();
                            reader.readAsDataURL(nvf);
                            $scope.mNombreArchivo = nvf.name;

                            agricolaUtilities.getBase64($scope.fileRelSector[0]).then(function (result) {
                                Object.assign($scope.filesAI1[0], { base64: result.split('base64,')[1], docfileType: "SECTORES ESTADISTICOS" });
                                validarSectorEstadistico(codigoCampania);
                                if ($scope.filesAI1[0].base64 === undefined) {
                                    mModalAlert.showWarning("No se puede cargar archivos vacíos en " + $scope.filesAI1[0].docfileType + ", ingrese un archivo correcto.", "");
                                    $scope.frmFormRelSect.$invalid = true;
                                    return void 0;
                                }
                            });
                        }
                    }
                });
                function validarSectorEstadistico(codigoCampania) {
                    mpSpin.start('Cargando, por favor espere...');
                    var param = {
                        "tipoArchivo": $scope.filesAI1[0].docfileType,
                        "nomArchivo": $scope.filesAI1[0].name,
                        "ArchivoBase64": $scope.filesAI1[0].base64,
                        "CodLog": agricolaUtilities.randomId(),
                        "usuarioRegistro": usuarioSistema,
                        "accion" : "VALIDAR"
                    }
                    var url = oimURL.endpoint + 'api/campanias/' + codigoCampania + '/cultivoSectoresEstadisticos';
                    $http.post(
                        url,
                        param,
                        { responseType: "arraybuffer" })
                        .success(
                            function (data, status, headers) {
                                var type = headers('Content-Type');
                                var blob = new Blob([data], { type: type });
                                switch (status) {
                                    case 204:
                                        $scope.frmFormRelSect.$invalid = true;
                                        mModalAlert.showWarning("No se puede cargar un archivo sin registros", "");
                                        break;
                                    case 202:
                                        $scope.mMensajeLog="No se encontraron observaciones en el archivo, por favor validar.";
                                        $scope.mShowLog = true;
                                        mBlobLog = blob;
                                        mCultivoSector = param;
                                        break;
                                }
                                mpSpin.end();
                            }, function (data, status) {
                                mpSpin.end();
                            })
                        .error(function (data, status, headers) {
                            $scope.mMensajeLog="Se encontraron observaciones en el archivo, por favor validar.";
                            var type = headers('Content-Type');
                            var blob = new Blob([data], { type: type });
                            $scope.frmFormRelSect.$invalid = true;
                            if (status == 409) {
                                mpSpin.end();
                                $scope.mShowLog = true;
                                mBlobLog = blob;
                            } else if (status == 415) {
                                mpSpin.end();
                                mModalAlert.showWarning("El excel adjuntado no cumple con el formato", "");
                            } else {
                                mpSpin.end();
                                mModalAlert.showWarning("Ocurrió un error al validar el archivo, inténtelo nuevamente", "");
                            }
                        });
                }
                function descargarArchivo(file) {
                    var blob = new Blob([file], { type: "application/vnd.ms-excel" });
    
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = $scope.mNombreArchivo;
                    link.click();

                }
                
                function initialImportar() {
                    $scope.fileRelSector = undefined;
                    $scope.frmFormRelSect.$invalid = true;
                    document.querySelector("input[type='file']").value = null;

                    $scope.labelImportSector = "";
                    $scope.mBotonLog = false;
                    $scope.mBotonImport = false;
                    $scope.mBotonValidar = true;
                    $scope.mShowLog = false;
                }
                $scope.descargarFile = function () {
                    descargarArchivo($scope.filesAI1[0]);
                }
                $scope.descargarLog = function () {
                    descargarArchivo(mBlobLog);
                }
                $scope.cancelarCarga = function () {
                    mCultivoSector = [];
                    initialImportar();
                }
                $scope.importarCultivoSector = function () {
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
                            $scope.importCultivoSector = function () {
                                $uibModalInstance.close();                                
                                mpSpin.start('Cargando, por favor espere...');
                                    $timeout(function() {
                                        mCultivoSector.Accion = "IMPORTAR";
                                        proxyCampania.ProcesarCultivoSector(codigoCampania,mCultivoSector).then(function (response) {
                                            if (response.operationCode === 200) {
                                                mpSpin.end();
                                                mModalAlert.showSuccess("", "¡Se importó la Relación Sector estadístico!").then(function (response) {
                                                    $scope.mostrarListado();
                                                });
        
                                            }
                                        });
                         }, 1000);
                      
                            },
                                $scope.data = {
                                    title: '¿Está seguro de importar el sector a la campaña ' + codigoCampania + '?',
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
                                            accion: $scope.importCultivoSector,
                                            clases: 'g-btn-verde'
                                        }
                                    ]
                                };
                        }]
                    });


                }
                $scope.mostrarImportar = function () {
                    $scope.mImportarRelSector = true;
                    $scope.mListaRelEstad = false;
                }

                $scope.mostrarListado = function () {
                    $scope.mImportarRelSector = false;
                    $scope.mListaRelEstad = true;
                    initialImportar();
                    cargarCultivoSector();
                }
                $scope.clicFileImport = function () {
                   document.querySelector("input.clsRelSector").value = null; 
                }
                $scope.searchResults = function () {
                    listaBusquedaSectorEstad = [];
                    var valBuscar = $scope.mNombreCultivoSector;
                    if (typeof valBuscar !== "undefined" && valBuscar != "") {
                        listaGeneralCultivoSector.forEach(function (value, key) {
                            var nomb = value.sectorEstad.toUpperCase();
                            var nombCultivo = value.nombreCultivo.toUpperCase();
                            var busq = valBuscar.toUpperCase();
    
                            if (nomb.includes(busq) || nombCultivo.includes(busq)) {
                                listaBusquedaSectorEstad.push(value);
                            }
                        });
                        listaCultivoSector = listaBusquedaSectorEstad;
                        $scope.listaCultivoSector = listaBusquedaCultivoSector;
                        setPagingData(1);
                        $scope.totalRecords = $scope.listaCultivoSector.length;
                    }
                }

                $scope.limpiarBuscador = function () {
                    listaBusquedaSectorEstad.pop();
                    listaCultivoSector.pop();
                    listaCultivoSector = listaGeneralCultivoSector;
                    $scope.listaCultivoSector = listaCultivoSector;
                    $scope.mNombreCultivoSector = "";
                    $scope.currentPage = 1;
                    setPagingData(1);
                    $scope.totalRecords = listaGeneralCultivoSector.length;
                }
                function validFormatFile(valueType, typeDoc) {
                    if (typeDoc === 'fileRelSector') {
                        if (valueType === tipoExcel
                            || valueType === 'xlsx') {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
                function setPagingData(page) {
                    var pagedData = listaCultivoSector.slice(
                        (page - 1) * $scope.sizePerPage,
                        page * $scope.sizePerPage
                    );
                    $scope.listaCultivoSector = pagedData;
                }


            }]).
        component('tabRelSectorCultivoCampania', {
            templateUrl: '/atencionsiniestrosagricola/app/campanias/components/tab/tab-relsectorcultivo-campania.html',
            controller: 'tabRelSectorCultivoCampaniaController',
            bindings: {
                masters: '=?',
                reloadMasters: '&?'
            }
        })
});