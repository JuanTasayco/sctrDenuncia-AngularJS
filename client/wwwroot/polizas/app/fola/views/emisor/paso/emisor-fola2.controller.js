'use strict';
define([
    'angular',
    'constantsFola',
    'constants',
    'mpfPersonConstants',
    'xlsx',
    'folaService',
    'mpfPersonComponent'
  ], function (
      angular,
      constantsFola,
      constants,
      personConstants,
      XLSX) {

    angular
        .module(constants.module.polizas.fola.moduleName)
        .controller('emisorFola2Controller', EmisorFola2Controller);
    
    EmisorFola2Controller.$inject = [
        '$scope',
        '$state',
        'folaService',
        'mpSpin',
        'FileSaver',
        'mModalAlert'
    ];

    function EmisorFola2Controller(
        $scope,
        $state,
        folaService,
        mpSpin,
        FileSaver,
        mModalAlert
    ){
        var vm = this;
        
        $scope.cotizacion = {};
        $scope.currency = constantsFola.SIMBOLO_MONEDA;
        $scope.primaTotal = 0;
        $scope.fileUpload = null;
        $scope.dataInsured = [];
        $scope.totalInsured = 0;
        $scope.appCode = personConstants.aplications.FOLA;
        $scope.formCode = personConstants.forms.EMI_FOL_CN;
        $scope.contratante = {TipoDocumento:{}};
        $scope.contratanteValid = false;
        $scope.fileUploadIsOk = false;
        $scope.nameFileUpload = '';
        $scope.formData = '';

        // funciones
        $scope.getPlantillaAsegurados = GetPlantillaAsegurados;
        $scope.selectFile = SelectFile;
        $scope.getDataContratante = GetDataContratante;
        $scope.emitirPoliza = EmitirPoliza;
        $scope.cleanFileUpload = CleanFileUpload;

        (function load(){
          _getCotizacion($state.params.documentoId);
          $scope.$on('personForm', function(event, data) {
            if(data.nContratante){
              $scope.contratanteValid = data.valid;
              setFormData(data.nContratante);
            }
          });
        })();
        function CleanFileUpload() {
            $scope.cotizacion = {};
            $scope.currency = constantsFola.SIMBOLO_MONEDA;
            $scope.primaTotal = 0;
            $scope.fileUpload = null;
            $scope.dataInsured = [];
            $scope.totalInsured = 0;
            $scope.appCode = personConstants.aplications.FOLA;
            $scope.formCode = personConstants.forms.EMI_FOL_CN;
            $scope.contratante = {TipoDocumento:{}};
            $scope.contratanteValid = false;
            $scope.fileUploadIsOk = false;
            $scope.nameFileUpload = '';
            $scope.formData = '';
            _getCotizacion($state.params.documentoId);
        }
        function setFormData(data){
            $scope.formData = data;
        }

        function EmitirPoliza() {
            $scope.$broadcast('submitForm', true);
            if($scope.contratanteValid){
              _saveEmision();
            }
        }
        function GetDataContratante(data) {
            if (data.isClear) {
              $scope.contratante.TipoDocumento.Codigo = $scope.cotizacion.contratante.tipoDocumento;
              // $scope.contratante.CodigoDocumento = $scope.cotizacion.contratante.numeroDocumento;
              $scope.contratante.NumeroDocumento = $scope.cotizacion.contratante.numeroDocumento;
              $scope.contratante.Nombre = $scope.cotizacion.contratante.nombre;
            }
        }

        function _getCotizacion(documentId) {
            mpSpin.start();
            folaService.getDocumentFola(documentId).then(
              function (response) {
                $scope.cotizacion = response.data;
                $scope.contratante.TipoDocumento.Codigo = $scope.cotizacion.contratante.tipoDocumento;
                $scope.contratante.NumeroDocumento = $scope.cotizacion.contratante.numeroDocumento;
                $scope.contratante.Nombre = $scope.cotizacion.contratante.nombre;
                $scope.contratante.ignoreEquifax = false;
                response.data.riesgos.forEach( function(prima) {
                  $scope.primaTotal = $scope.primaTotal + prima.primaGrupal;
                });
                $scope.primaTotal = parseFloat($scope.primaTotal).toFixed(2);
                response.data.riesgos.forEach(function(data) {
                    $scope.totalInsured = $scope.totalInsured + data.numeroAsegurados;
                });
                mpSpin.end();
              },
              function (error) {
                $state.go('errorInternoFola',{}, { reload: true, inherit: false });
                console.log('error', error);
                mpSpin.end();
              }
            );
        }

        function GetPlantillaAsegurados() {
            mpSpin.start();
            folaService.getTemplateFolaInsured($state.params.documentoId).then(
              function (response) {
                var base64 = response.data.documentoBase64;
                var blob = new Blob(
                  [_base64toBlob(base64, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')],
                  {}
                );
                var arrayNameFile = response.data.nombreDocumento.split('.');
                FileSaver.saveAs(blob, arrayNameFile[0] +'_'+ $scope.cotizacion.numeroDocumento + '.xlsx');
                mpSpin.end();
                mModalAlert.showSuccess('Archivo descargado correctamente..', 'CORRECTO', null, 3000);
              },
              function (error) {
                console.log('error', error);
                mpSpin.end();
                mModalAlert.showWarning('Error, no se pudo descargar el archivo.', 'ALERTA', null, 3000);
              }
            );
        }

        function SelectFile(file) {
            if (file) {
              $scope.fileUpload = file;
              _readFile(file);
            }
        }

        function _base64toBlob(base64Data, contentType) {
            contentType = contentType || '';
            var sliceSize = 1024;
            var byteCharacters = atob(base64Data);
            var bytesLength = byteCharacters.length;
            var slicesCount = Math.ceil(bytesLength / sliceSize);
            var byteArrays = new Array(slicesCount);
            for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
              var begin = sliceIndex * sliceSize;
              var end = Math.min(begin + sliceSize, bytesLength);
              var bytes = new Array(end - begin);
              for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
              }
              byteArrays[sliceIndex] = new Uint8Array(bytes);
            }
            return new Blob(byteArrays, {type: contentType});
        }
        function _uploadFile(file) {
            mpSpin.start();
            var formData = new FormData();
            formData.append('file', file[0]);
            formData.append('numeroDocumento', $state.params.documentoId);
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {          
                if (xhr.status === 200) {
                  console.log('Archivo cargado correctamente.');
                  mpSpin.end();
                } else {
                  console.log('Error al cargar el archivo.');
                  mpSpin.end();
                }
              }
            };
            const url = constants.system.api.endpoints.policy + 'api/fola/documento/plantillaAsegurados';
            const tokenAuth = localStorage.getItem('jwtMapfreToken_jwtMapfreToken');
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', 'Bearer ' + tokenAuth);
            xhr.send(formData);
          }
        function _readFile(file) {
            mpSpin.start();
            const selectedFile = file[0];
            const regex = /^([a-zA-Z0-9\s_\\.\-:()])+(.xls|.xlsx)$/;
            if (regex.test(selectedFile.name.toLowerCase())) {
              if (typeof FileReader != 'undefined') {
                var reader = new FileReader();
                $scope.nameFileUpload = selectedFile.name;
                //For Browsers other than IE.
                if (reader.readAsBinaryString) {
                  reader.onload = function (e) {
                    $scope.dataInsured = _processExcel(e.target.result);
                    _processDataInsured($scope.dataInsured);
                    mpSpin.end();
                  };
                  reader.readAsBinaryString(selectedFile);
                } else {
                  //For IE Browser.
                  reader.onload = function (e) {
                    var data = '';
                    const bytes = new Uint8Array(e.target.result);
                    for (var i = 0; i < bytes.byteLength; i++) {
                      data += String.fromCharCode(bytes[i]);
                    }
                    $scope.dataInsured = _processExcel(data);
                    _processDataInsured($scope.dataInsured);
                    mpSpin.end();
                  };
                  reader.readAsArrayBuffer(selectedFile);
                }
              } else {
                mpSpin.end();
                $scope.fileUpload = null;
                $scope.nameFileUpload = '';
                var fileUploadHtml = document.getElementById('file-upload');
                fileUploadHtml.value = null;
                mModalAlert.showWarning('El navegador no es compatible con esta función.', 'ALERTA', null, 3000);
              }
            } else {
              mpSpin.end();
              $scope.fileUpload = null;
              $scope.nameFileUpload = '';
              var fileUploadHtml = document.getElementById('file-upload');
              fileUploadHtml.value = null;
              mModalAlert.showWarning('Tipo de archivo invalido.', 'ALERTA', null, 3000);
            }
        }

        function _processExcel(data) {
            const workbook = XLSX.read(data, {
              type: 'binary', cellText: false, cellDates: true
            });
            const firstSheet = workbook.SheetNames[0];
            var excelRows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], {raw:false,dateNF:'dd/mm/yyyy'});
            return excelRows;
        }

        function _processDataInsured(data) {
            if (data) {
              var errorFile = false;
              // Validar cantidad de asegurados
              if (data.length !== $scope.totalInsured) {
                // console.log('$scope.cotizacion 1', $scope.cotizacion);
                errorFile = true;
                $scope.fileUpload = null;
                var fileUploadHtml = document.getElementById('file-upload');
                fileUploadHtml.value = null;
                mModalAlert.showWarning('Faltan registros de asegurados.', 'NO SE GENERÓ LA CARGA DEL ARCHIVO', null, 3000);
                return;
              }
              // Validar campos vacios
              var errors = [];
              var nroDocs = [];
              var i = 0;
              data.forEach(function(insured) {
                i++;
                if (
                  !insured.ASEGURADO ||
                  !insured.GRUPO ||
                  !insured['COD_ACTIVIDAD\r\nOCULTO'] ||
                  !insured.ACTIVIDAD ||
                  !insured.PLAN ||
                  !insured.SUBVENCIÓN ||
                  !insured.TIPO_DOCUMENTO ||
                  !insured.NUMERO_DOC ||
                  !insured.NOMBRES ||
                  !insured.APE_PATERNO ||
                  !insured.APE_MATERNO ||
                  !insured['FECHA_NACIMIENTO\r\n(dd/mm/yyyy)'] ||
                  // !insured.FECHA_NACIMIENTO ||
                  !insured.TELEFONO ||
                  !insured.CORREO ||
                  !insured['PESO\r\n(kilogramos)'] ||
                  !insured['TALLA\r\n(centimetros)']
                ) {
                  errorFile = true;
                  errors.push('Asegurado ' + insured.ASEGURADO + ', debe llenar toda la información.'); 
                } else {
      
                  // Validar numero de asegurado
                  if (i != insured.ASEGURADO) {
                    errorFile = true;
                    errors.push('Asegurado ' + i + ', numero de asegurado del archivo no coincide.');
                  }
      
                  // Validar tipo actividad
                  if (!insured['COD_ACTIVIDAD\r\nOCULTO'] || insured['COD_ACTIVIDAD\r\nOCULTO'] == '0') {
                    errorFile = true;
                    errors.push('Asegurado ' + i + ', tipo de actividad invalida.');
                  }
      
                  // Validar SUBVENCION
                  if (insured.SUBVENCIÓN <= 0 || !insured.SUBVENCIÓN) {
                    errorFile = true;
                    errors.push('Asegurado ' + i + ', monto de subvención invalido.');
                  }
      
                  // Validar numero documentos iguales
                  const errorDocIguales = nroDocs.find(function (documento) {documento.tipo_doc === insured.TIPO_DOCUMENTO && documento.nroDoc === insured.NUMERO_DOC} )
                  if (errorDocIguales) {
                    $scope.fileUpload = null;
                    $scope.nameFileUpload = '';
                    var fileUploadHtml = document.getElementById('file-upload');
                    fileUploadHtml.value = null;
                    mModalAlert.showWarning('Existes numero de documentos iguales entre los asegurados.', 'NO SE GENERÓ LA CARGA DEL ARCHIVO', null, 6000);
                    return;
                  }
                  nroDocs.push({
                    tipo_doc: insured.TIPO_DOCUMENTO,
                    nroDoc: insured.NUMERO_DOC
                  });
      
                  // Validar tipo de documento
                  var errorTipoDoc = _validadarTipoDoc(insured.TIPO_DOCUMENTO);
                  if (errorTipoDoc) {
                    errorFile = true;
                    errors.push('Asegurado ' + i + ', tipo de documento inválido.');
                  }
      
                  // Validar numero de documento 
                  var errorNroDoc = _validarNroDoc(insured.NUMERO_DOC);
                  if (errorNroDoc) {
                    errorFile = true;
                    errors.push('Asegurado ' + i + ', numero de documento inválido.');
                  }
      
                  // Validar numero DNI
                  if (insured.TIPO_DOCUMENTO === 'DNI') {
                    var errorNroDni = _validarNroDni(insured.NUMERO_DOC);
                    if (errorNroDni) {
                      errorFile = true;
                      errors.push('Asegurado ' + i + ', numero de DNI inválido.');
                    }
                  }
      
                  if (insured['FECHA_NACIMIENTO\r\n(dd/mm/yyyy)']) {
                    // Validar fecha
                    var errorFecha = _validarFhNacimiento(insured['FECHA_NACIMIENTO\r\n(dd/mm/yyyy)']);
                    if (errorFecha) {
                      errorFile = true;
                      errors.push('Asegurado ' + i + ', fecha de nacimiento invalida.');
                    }
      
                    // Validar edad 
                    var errorEdad = _calcularEdad(insured['FECHA_NACIMIENTO\r\n(dd/mm/yyyy)']);
                    if (errorEdad) {
                      errorFile = true;
                      errors.push('Asegurado ' + i + ', fecha de nacimiento invalida (Edad).');
                    }
                  }
      
                  // Validar correo
                  var errorEmail = _validarCorreo(insured.CORREO);
                  if (errorEmail) {
                    errorFile = true;
                    errors.push('Asegurado ' + i + ', correo electrónico invalido.');
                  }
      
                  // Validar peso
                  var errorPeso = _validarPeso(insured['PESO\r\n(kilogramos)']);
                  if (errorPeso) {
                    errorFile = true;
                    errors.push('Asegurado ' + i + ', peso invalido.');
                  }
      
                  // Validar talla
                  var errorPeso = _validarTalla(insured['TALLA\r\n(centimetros)']);
                  if (errorPeso) {
                    errorFile = true;
                    errors.push('Asegurado ' + i + ', talla invalida.');
                  }
                }
              });
      
              if (errorFile) {
                var mensaje = '';
                $scope.fileUpload = null;
                $scope.nameFileUpload = '';
                var fileUploadHtml = document.getElementById('file-upload');
                fileUploadHtml.value = null;
                mensaje = errors[0];
                $scope.fileUploadIsOk = false;
                if (errors.length > 1) {
                  var mensaje = mensaje + '\n' + errors[1];
                }
                if (errors.length > 2) {
                  mensaje = mensaje + '\nY mas errores';
                }
                mModalAlert.showWarning(mensaje, 'NO SE GENERÓ LA CARGA DEL ARCHIVO', null, 6000);
                return;
              } else {
                _requestRiesgos(data);
                // $scope.fileUploadIsOk = true;
                // document.getElementById('resumenEmisionFola').click();
              }
            }
        }
      
        function _requestRiesgos(data) {
            $scope.cotizacion.riesgos.forEach(function(riesgo) {
              var asegurados = data
                .filter(function(asegurado) {
                  if (parseInt(asegurado.GRUPO) === riesgo.grupo) {
                    return asegurado;
                  }
                })
                .map(function(asegurado) {  
                  if (asegurado['FECHA_NACIMIENTO\r\n(dd/mm/yyyy)'].includes('/')) {
                    var arrayFecha = asegurado['FECHA_NACIMIENTO\r\n(dd/mm/yyyy)'].split('/');
                  }
            
                  if (asegurado['FECHA_NACIMIENTO\r\n(dd/mm/yyyy)'].includes('-')) {
                    var arrayFecha = asegurado['FECHA_NACIMIENTO\r\n(dd/mm/yyyy)'].split('-');
                  }
                  var dia = arrayFecha[0];
                  var mes = arrayFecha[1];
                  var anio = arrayFecha[2];
                  var fhNacimiento = dia + '/' + mes + '/' +  anio;
                  return {
                    tipoDocumento: asegurado.TIPO_DOCUMENTO,
                    numeroDocumento: asegurado.NUMERO_DOC,
                    nombre: asegurado.NOMBRES,
                    apellidoPaterno: asegurado.APE_PATERNO,
                    apellidoMaterno: asegurado.APE_MATERNO,
                    codigoActividad: asegurado['COD_ACTIVIDAD\r\nOCULTO'],
                    nombreActividad: asegurado.ACTIVIDAD,
                    fechaNacimiento: fhNacimiento,
                    telefono: asegurado.TELEFONO,
                    correo: asegurado.CORREO,
                    talla: asegurado['TALLA\r\n(centimetros)'],
                    peso: asegurado['PESO\r\n(kilogramos)'],
                    asegurado: asegurado.ASEGURADO,
                    grupo: asegurado.GRUPO,
                    codActividad: asegurado['COD_ACTIVIDAD\r\nOCULTO'],
                    actividad: asegurado.ACTIVIDAD,
                    plan: asegurado.PLAN,
                    subvencion: asegurado.SUBVENCIÓN
                  };
                });
              riesgo.asegurados = asegurados;
            });
            _validarDatosRiesgos();
          }
      
          function _validarDatosRiesgos() {
            var errorFile = false;
            var errors = [];
            var i = 0;
            $scope.cotizacion.riesgos.map(function(riesgo) {
              riesgo.asegurados.map(function(asegurado) {
                i++;
                // Validar numero de asegurado
                if (asegurado.asegurado != i) {
                  errorFile = true;
                  errors.push('Asegurado ' + i + ', numero de asegurado no coincide.');
                }
      
                // Validar grupo
                if (riesgo.grupo != asegurado.grupo) {
                  errorFile = true;
                  errors.push('Asegurado ' + i + ', numero de grupo invalido.');
                }
      
                // Validar codigo actividad
                if (riesgo.codigoOcupacion != asegurado.codActividad) {
                  errorFile = true;
                  errors.push('Asegurado ' + i + ', codigo de actividad invalido.');
                }
      
                // Validar actividad
                if (riesgo.ocupacion != asegurado.actividad) {
                  errorFile = true;
                  errors.push('Asegurado ' + i + ', actividad invalida.');
                }
      
                // Validar plan
                if (riesgo.nombrePlan != asegurado.plan) {
                  errorFile = true;
                  errors.push('Asegurado ' + i + ', plan invalido.');
                }
      
                // Validar subvencion
                if (riesgo.subvencion != asegurado.subvencion) {
                  errorFile = true;
                  errors.push('Asegurado ' + i + ', monto de subvención invalido.');
                }
              });
            });
      
            // Validar cantidad de asegurados
            if (i !== $scope.totalInsured) {
              errorFile = true;
              $scope.fileUpload = null;
              $scope.nameFileUpload = '';
              var fileUploadHtml = document.getElementById('file-upload');
              fileUploadHtml.value = null;
              $scope.fileUploadIsOk = false;
              _limpiarAsegurados();
              mModalAlert.showWarning('Faltan registros de asegurados.', 'NO SE GENERÓ LA CARGA DEL ARCHIVO', null, 3000);
              return;
            }
      
            if (errorFile) {
              var mensaje = '';
              $scope.fileUpload = null;
              $scope.nameFileUpload = '';
              var fileUploadHtml = document.getElementById('file-upload');
              fileUploadHtml.value = null;
              mensaje = errors[0];
              $scope.fileUploadIsOk = false;
              if (errors.length > 1) {
                var mensaje = mensaje + '\n' + errors[1];
              }
              if (errors.length > 2) {
                mensaje = mensaje + '\nY mas errores';
              }
              mModalAlert.showWarning(mensaje, 'NO SE GENERÓ LA CARGA DEL ARCHIVO', null, 6000);
              return;
            } else {
              $scope.fileUploadIsOk = true;
              document.getElementById('resumenEmisionFola').click();
            }  
          }
      
          function _requestContratante() {
            $scope.cotizacion.contratante.correoElectronico = $scope.formData.CorreoElectronico || '';
            $scope.cotizacion.contratante.telefono = $scope.formData.Telefono || '';
            $scope.cotizacion.contratante.celular = $scope.formData.Telefono2 || '';
            $scope.cotizacion.contratante.tipoActividadEconomica = $scope.formData.ActividadEconomica.Codigo || '';
            $scope.cotizacion.contratante.nombreActividadEconomica = $scope.formData.ActividadEconomica.Descripcion || '';
            $scope.cotizacion.contratante.contacto = {
              nombre: $scope.formData.Representante || '',
              codigoTipoCargo: $scope.formData.RepresentanteCargo.Codigo || '',
              nombreTipoCargo: $scope.formData.RepresentanteCargo.Descripcion || '',
            };
            $scope.cotizacion.contratante.direccion = {
              codigoDepartamento: $scope.formData.Department.Codigo || '',
              nombreDepartamento: $scope.formData.Department.Descripcion || '',
              codigoProvincia: $scope.formData.Province.Codigo || '',
              nombreProvincia: $scope.formData.Province.Descripcion || '',
              codigoDistrito: $scope.formData.District.Codigo || '',
              nombreDistrito: $scope.formData.District.Descripcion || '',
              tipoVia: $scope.formData.Via.Codigo || '',
              nombreVia: $scope.formData.NombreVia || '',
              numero: $scope.formData.NumberType.Codigo || '',
              enumeracion: $scope.formData.TextoNumero || '',
              tipoInterior: $scope.formData.Inside.Codigo || '',
              numeroInterior: $scope.formData.TextoInterior || '',
              tipoZona: $scope.formData.Zone.Codigo || '',
              nombreZona: $scope.formData.TextoZona || '',
              referencia: $scope.formData.Referencia || ''
            };
          }
          function _validRequestObligatorioEmision() {
            var valid = true;
            if (
              !$scope.cotizacion.contratante.correoElectronico ||
              !$scope.cotizacion.contratante.telefono ||
              !$scope.cotizacion.contratante.celular ||
              !$scope.cotizacion.contratante.tipoActividadEconomica ||
              !$scope.cotizacion.contratante.contacto.nombre ||
              !$scope.cotizacion.contratante.contacto.codigoTipoCargo ||
              !$scope.cotizacion.contratante.contacto.nombreTipoCargo ||
              !$scope.cotizacion.contratante.direccion.codigoDepartamento ||
              !$scope.cotizacion.contratante.direccion.nombreDepartamento ||
              !$scope.cotizacion.contratante.direccion.codigoProvincia ||
              !$scope.cotizacion.contratante.direccion.nombreProvincia ||
              !$scope.cotizacion.contratante.direccion.codigoDistrito ||
              !$scope.cotizacion.contratante.direccion.nombreDistrito ||
              !$scope.cotizacion.contratante.direccion.tipoVia ||
              !$scope.cotizacion.contratante.direccion.nombreVia ||
              !$scope.cotizacion.contratante.direccion.numero ||
              !$scope.cotizacion.contratante.direccion.enumeracion
            ) {
              valid = false;
            }
            return valid;
          }
          function _validRequestOpcionalEmision() {
            var valid = true;
            if (
              ($scope.cotizacion.contratante.direccion.tipoInterior && !$scope.cotizacion.contratante.direccion.numeroInterior) ||
              (!$scope.cotizacion.contratante.direccion.tipoInterior && $scope.cotizacion.contratante.direccion.numeroInterior)
            ) {
              valid = false;
            }
            if (
              ($scope.cotizacion.contratante.direccion.tipoZona && !$scope.cotizacion.contratante.direccion.nombreZona) ||
              (!$scope.cotizacion.contratante.direccion.tipoZona && $scope.cotizacion.contratante.direccion.nombreZona)
            ) {
              valid = false;
            }
            return valid;
          }
          function _saveEmision() {
            mpSpin.start();
            _requestContratante();
            const validResquetsObligatorio = _validRequestObligatorioEmision();
            if (!validResquetsObligatorio) {
              mModalAlert.showWarning('Debe llenar los campos obligatorios (*).', 'ALERTA', null, 3000);
              mpSpin.end();
              return;
            }
            const validResquetsOpcional = _validRequestOpcionalEmision();
            if (!validResquetsOpcional) {
              mModalAlert.showWarning('Existen campos vacios.', 'ALERTA', null, 3000);
              mpSpin.end();
              return;
            }
            folaService.saveEmision($scope.cotizacion).then(
              function (response) {
                _uploadFile($scope.fileUpload);
                mModalAlert.showSuccess('Información guardada correctamente.', 'MENSAJE', null, 3000);
                _uploadFile($scope.fileUpload);
                _irResumenEmisionPoliza();
                mpSpin.end();
              },
              function (error) {
                console.log('error', error);
                if (error.data) {
                  if (error.data.errores) {
                    if (error.data.errores.length > 0) {
                      mModalAlert.showWarning(error.data.errores[0], 'ALERTA', null, 3000);
                      mpSpin.end();
                      return;
                    }
                  }
                }
                mModalAlert.showWarning('No se pudo guardar la información.', 'ALERTA', null, 3000);
                mpSpin.end();
              }
            );
        }

        function _irResumenEmisionPoliza() {
            $state.go(
              constantsFola.ROUTES.RESUMEN_BANDEJA_DOCUMENTOS,
              {documentoId: $state.params.documentoId},
              {reload: true, inherit: false}
            );
        }
      
        function _validadarTipoDoc(tipoDoc) {
            const tiposDoc = ['DNI', 'PEX', 'CEX'];
            if (tiposDoc.indexOf(tipoDoc) < 0) {
              return true;
            } else {
              return false;
            }
        }
      
        function _validarNroDoc(nroDoc) {
            if (isNaN(Number(nroDoc))) {
              return true;
            } else {
              return false;
            }
        }
      
        function _validarNroDni(dni) {
            if (dni.length !== 8) {
              return true;
            } else {
              return false;
            }
        }
      
        function _validarFhNacimiento(fecha) {
            if (fecha.includes('/')) {
              var arrayFecha = fecha.split('/');
              // return true;
            }
      
            if (fecha.includes('-')) {
              var arrayFecha = fecha.split('-');
              return true;
            }
            var dia = arrayFecha[0];
            var mes = arrayFecha[1];
            var anio = arrayFecha[2];
            if (dia.length > 2) {
              return true;
            }
            if (mes.length > 2) {
              return true;
            }
            if (dia > 31 ) {
              return true;
            }
            if (mes > 12 ) {
              return true;
            }
            if (isNaN(Date.parse(mes + '/' + dia + '/' + anio))) {
              return true;
            }
            return false;
        }
      
        function _calcularEdad(fecha) {
            var hoy = new Date();
            var arrayFecha = fecha.split('/');
            var fhNacimiento = new Date(arrayFecha[1]+'-'+arrayFecha[0]+'-'+arrayFecha[2]);
            var edad = hoy.getFullYear() - fhNacimiento.getFullYear();
            var m = hoy.getMonth() - fhNacimiento.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < fhNacimiento.getDate())) {
                edad--;
            }
            if (edad < 18 || edad > 34) {
              return true;
            } else {
              return false;
            }
        }
      
        function _validarCorreo(correo) {
            const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            //Se muestra un texto a modo de ejemplo, luego va a ser un icono
            if (emailRegex.test(correo)) {
              return false;
            } else {
              return true;
            }
        }
      
        function _validarPeso(peso) {
            if (isNaN(Number(peso))) {
              return true;
            } 
            if (peso < 30 || peso > 150) {
              return true;
            } 
            return false;
        }
      
        function _validarTalla(talla) {
            if (isNaN(Number(talla))) {
              return true;
            } 
            if (talla < 100 || talla > 200) {
              return true;
            } 
            return false;
          }
      
          function _limpiarAsegurados() {
            var i = 0;
            $scope.cotizacion.riesgos.forEach(function() {
              $scope.cotizacion.riesgos[i].asegurados = [];
              i++;
            });
        }
    }
    
    
});