define([
    'angular', 'constants',  'mfpModalQuestion','/atencionsiniestrosagricola/app/utilities/agricolaUtilities.js'
], function (ng, constants) {
    AdjuntarPadronController.$inject = ['$scope', '$filter', '$rootScope', '$state', '$stateParams', '$http', '$window', '$q', 'oimClaims', 'agricolaUtilities',  'proxyAviso', 'proxyCampania', 'proxyLookup', 'oimProxyAtencionsiniestrosagricola', 'authorizedResource', 'mpSpin', 'mModalAlert', '$location','$uibModal','$timeout', 'oimClaims'];
    function AdjuntarPadronController($scope, $filter, $rootScope, $state, $stateParams, $http, $q, $window, oimClaims, agricolaUtilities, proxyAviso, proxyCampania, proxyLookup, oimURL, authorizedResource, mpSpin, mModalAlert, $location,$uibModal,$timeout,oimClaims) {
        var vm = this;
        var mBlobLog = [];
        var mPadron = [];
        var nombrePlantilla = "Plantilla_Carga_Beneficiarios.xlsx";
        //Tipo excel
        tipoExcel = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        vm.$onInit = function () {
            $scope.Plantilla_Padron = getRutaPlantilla();

            $scope.item = angular.fromJson($stateParams.aviso);
            $scope.mShowLog = false;
        }

        function validFormatFile(valueType, typeDoc) {
            if (typeDoc === 'filePadron') {
                if (valueType === tipoExcel
                    || valueType === 'xlsx') {
                    return true;
                } else {
                    return false;
                }
            }
        }
        $scope.$watch('filePadron', function (nv) {
            var nvf = null;
            if (!(typeof nv === 'undefined')) {
                nvf = nv[0];
                if (!(typeof nvf === 'undefined')) {
                    mpSpin.start('Validando archivo, por favor espere...');
                    $scope.filesAI1 = [];
                    var validTypeFormat = validFormatFile(nvf.type, 'filePadron');
                    if (validTypeFormat === false) {
                        mpSpin.end();                        
                        $scope.cancelarCarga();                       
                        mModalAlert.showWarning('El archivo [' + nvf.name + '] , no tiene el formato correcto, formatos admitidos: xls, xlsx', '');

                        return void 0;
                    }
                    $scope.filesAI1.push(nvf);
                    var reader = new FileReader();
                    reader.readAsDataURL(nvf);

                    $scope.mNombreArchivo = nvf.name;
                    agricolaUtilities.getBase64($scope.filePadron[0]).then(function (result) {
                        Object.assign($scope.filesAI1[0], { base64: result.split('base64,')[1], docfileType: "PADRON" });

                        validarArchivo($scope.filesAI1[0].base64);
                        if ($scope.filesAI1[0].base64 === undefined) {
                            mModalAlert.showWarning("No se puede cargar archivos vacíos en " + $scope.filesAI1[0].docfileType + ", ingrese un archivo correcto.", "");
                            $scope.filePadron.$invalid = true;
                            return void 0;
                        }
                    });
                    mpSpin.end();
                }
            }
        });
        function validarArchivo(file) {
            var param = {
                "CodCampania": $scope.item.codCampania,
                "CodAviso": $scope.item.codAviso,
                "ArchivoBase64": file,
                "CodLog": agricolaUtilities.randomId(),
                "UsuarioRegistro" : oimClaims.loginUserName,
                "Accion" : "VALIDAR"
            }
            mpSpin.start('Cargando, por favor espere...');
            var url = oimURL.endpoint + 'api/campanias/' + $scope.item.codCampania + '/beneficiarios';
            $http.post(
                url,
                param,
                { responseType: "arraybuffer" })
                .success(
                    function (data, status, headers) {
                        var type = headers('Content-Type');
                        var blob = new Blob([data], { type: type });
                        switch(status){
                            case 204: 
                            $scope.frmAdjuntarPadron.$invalid = true;
                            mModalAlert.showWarning("No se puede cargar un archivo sin registros", "");
                            break;
                            case 202:
                                $scope.mShowLog = true;
                                mBlobLog = blob;
                                mPadron = param;
                            break;
                            case 200: 
                            mPadron = param;                         
                            break;
                        }
                        mpSpin.end();
                    }, function (data, status) {
                        mpSpin.end();
                    })
                .error(function (data, status, headers) {
                    var type = headers('Content-Type');
                    var blob = new Blob([data], { type: type });
                    $scope.frmAdjuntarPadron.$invalid = true;                  
                    if(status == 409){
                        mpSpin.end();
                        $scope.mShowLog = true;
                        mBlobLog = blob;
                    }else if(status == 415){
                        mpSpin.end();
                        mModalAlert.showWarning("El excel adjuntado no cumple con el formato", "");
                    }else{
                        mpSpin.end();
                        mModalAlert.showWarning("Ocurrió un error al validar el archivo, inténtelo nuevamente", "");
                    }
                });
        }

   

        function getRutaPlantilla() {            
            return agricolaUtilities.getRuta("PLANTILLA").concat(nombrePlantilla);
        }

        function descargarArchivo(file) {
            var blob = new Blob([file], { type: "application/vnd.ms-excel" });

            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = $scope.mNombreArchivo;
            link.click();

        }
        $scope.descargarLog = function () {
            descargarArchivo(mBlobLog);
        }
        $scope.descargarFile = function () {
            descargarArchivo($scope.filesAI1[0]);
        }
        $scope.cargarBandejaReportes = function () {
            $state.go('bandejaReportes', null, { reload: true, inherit: false });
        }
        $scope.cancelarCarga = function () {
            mPadron = [];
            $state.go($state.current, {}, { reload: true });
        }
        $scope.adjuntarPadron = function () {            
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
                    $scope.adjuntaPadron = function () {
                        mpSpin.start('Cargando, por favor espere...');
                        $timeout(function() {
                            mPadron.Accion = "IMPORTAR";
                            proxyCampania.ValidarPadron($scope.item.codCampania,mPadron).then(function (response) {
                                if (response.operationCode === 200) {
                                    mModalAlert.showSuccess("Se adjuntó el padrón con éxito", "");
                                    mpSpin.end();
                                    $state.go('bandejaReportes', null, { reload: true, inherit: false });                       
                                } else {
                                    mModalAlert.showError("Ocurrió un error al cargar la información", "Error").then(function (response) {
                                        mpSpin.end();
                                    });                              
                                }
                            });
                         }, 1000);
                      

                    },
                        $scope.data = {
                            title: '¿Está seguro de adjuntar el padrón?',
                            subtitle: '',
                            btns: [
                                {
                                    lbl: 'No',
                                    accion: $scope.closeModal,
                                    clases: 'g-btn-transparent'
                                },
                                {
                                    lbl: 'Sí',
                                    accion: $scope.adjuntaPadron,
                                    clases: 'g-btn-verde'
                                }
                            ]
                        };
                }]
            });       
        }

    }
    return ng.module('atencionsiniestrosagricola.app')
        .controller('AdjuntarPadronController', AdjuntarPadronController)
        .directive('preventDefault', function () {
            return function (scope, element, attrs) {
                ng.element(element).bind('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
            }
        });
});