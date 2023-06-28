'use strict';

define([
  'angular',
  'constants',
  'constantsFola',
  'mpfPersonConstants',
  'pdfLib',
  '/scripts/plugins/pdf/jspdf.js',
  'xlsx',
  'mpfPersonComponent'


], function (
  angular,
  constants,
  constantsFola,
  personConstants,
  PDFLib,
  jsPDF,
  XLSX
  ) {
  angular
    .module(constants.module.polizas.fola.moduleName)
    .controller('resumenFolaEmisionController', ResumenFolaEmisionController);

  ResumenFolaEmisionController.$inject = [
    '$scope',
    '$state',
    '$stateParams',
    'folaService',
    'mpSpin',
    'FileSaver',
    'mModalAlert',
    'mainServices',
    '$timeout'
    ];
  function ResumenFolaEmisionController(
    $scope,
    $state,
    $stateParams,
    folaService,
    mpSpin,
    FileSaver,
    mModalAlert,
    mainServices,
    $timeout
  ) {
    var vm = this;
    // Propiedades
    vm.cotizacion = {};
    vm.currency = constantsFola.SIMBOLO_MONEDA;
    vm.primaTotal = 0;
    vm.fileUpload = null;
    vm.dataInsured = [];
    vm.totalInsured = 0;
    vm.appCode = personConstants.aplications.FOLA;
    vm.formCode = personConstants.forms.EMI_FOL_CN;
    vm.contratante = {TipoDocumento:{}};
    vm.contratanteValid = false;
    vm.fileUploadIsOk = false;
    vm.nameFileUpload = '';
    vm.formData = '';
    vm.condicionadoGeneral = constants.module.polizas.fola.tipoCondicionado.General;
    vm.condicionadoParticular = constants.module.polizas.fola.tipoCondicionado.Particular;
    vm.cotizar = $stateParams.cotizar;
    vm.cuota = {};
    vm.condicionados=[];

    // Funciones:
    vm.getPlantillaAsegurados = GetPlantillaAsegurados;
    vm.selectFile = SelectFile;
    vm.getDataContratante = GetDataContratante;
    vm.emitirPoliza = EmitirPoliza;
    vm.cleanFileUpload = CleanFileUpload;
    vm.changeCotizar = ChangeCotizar;
    vm.irACotizar = IrACotizar;
    vm.descargarCotizacion = DescargarCotizacion;

    (function load_ResumenFolaEmisionController() {
      _getCotizacion($state.params.documentoId);
      _getCondicionados();
      $scope.$on('personForm', function(event, data) {
        if(data.nContratante){
          vm.contratanteValid = data.valid;
          setFormData(data.nContratante);
        }
      });
    })();
    function setFormData(data){
      vm.formData = data;
    }
    function GetPdfCondicionados(){
      var pdfs = [];
      vm.condicionados.map(function (cond) {
        if(vm.cotizacion.riesgos.some(function (r) {return r.idPlan == cond.idPlan} ) && cond.documentoBase64){
          var buffer = base64ToArrayBuffer(cond.documentoBase64);
          pdfs.push(buffer);
        }
      })
      var condGeneral = vm.condicionados.find(function (cond) { return cond.tipoCondicionado == constants.module.polizas.fola.tipoCondicionado.General});
      if(condGeneral && condGeneral.documentoBase64){
        var bufferGeneral = base64ToArrayBuffer(condGeneral.documentoBase64);
        pdfs.push(bufferGeneral);
      }
      return pdfs;
    }
    function imgToBase64(url, callback){
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
          var reader = new FileReader();
          reader.onloadend = function() {
              callback(reader.result);
          }
          reader.readAsDataURL(xhr.response);
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    }
    function getPdfCotizacion(base64Img){
      
      var doc = new jsPDF('p', 'pt', 'a4');
      var height = 0;
      var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
      doc.setFontSize(9);
      doc.setFontStyle('normal');
      height = height + 40;
      doc.text('N° de Cotización: '+ vm.cotizacion.numeroDocumento,40,height);
      height = height + 15;
      doc.text('Fecha de Cotización: '+ vm.cotizacion.fechaRegistro,40,height);
      if(base64Img){
        doc.addImage(base64Img,'JPEG',410,40,140,20)
      }
      height = height + 45;
      doc.setFontSize(12);
      doc.setFontStyle('bold');
      doc.text('SEGURO DE FORMACIÓN LABORAL',pageWidth/2,height, 'center');

      height = height + 40;
      doc.setFontSize(10);
      doc.setFontStyle('bold');
      doc.text('CONTRATANTE:',40,height);
      doc.setFontStyle('normal');
      doc.text(vm.cotizacion.contratante.nombre,140,height);

      height = height + 20;
      doc.setFontStyle('bold');
      doc.text('AGENTE:',40,height);
      doc.setFontStyle('normal');
      doc.text(vm.cotizacion.agente,140,height);

      height = height + 20;
      doc.setFontStyle('bold');
      doc.text('VIGENCIA:',40,height);
      doc.setFontStyle('normal');
      doc.text(vm.cotizacion.fechaInicio + ' - '+vm.cotizacion.fechaFin,140,height);

      height = height + 20;
      doc.setFontStyle('bold');
      doc.text('ASEGURADOS:',40,height);

      height = height + 30;
      var widthRiesgo = pageWidth/7;
      vm.cotizacion.riesgos.map(function(item){
        doc.setFontStyle('normal');
        doc.text('Grupo '+item.grupo,40,height);
        height = height + 25;
        doc.text('ACTIVIDAD',widthRiesgo,height,'center');
        doc.text('SUBVENCIÓN',widthRiesgo*2,height,'center');
        doc.text('N° AFILIADOS',widthRiesgo*3,height,'center');
        doc.text('PLAN',widthRiesgo*4,height,'center');
        doc.text('PRIMA TOTAL',widthRiesgo*5,height-5,'center');
        doc.text('POR AFILIADO',widthRiesgo*5,height+5,'center');
        doc.text('PRIMA TOTAL',widthRiesgo*6,height-5,'center');
        doc.text('POR GRUPO',widthRiesgo*6,height+5,'center');
        height = height + 20;
        doc.text(item.ocupacion,widthRiesgo,height,'center');
        doc.text(vm.currency+' '+item.subvencion,widthRiesgo*2,height,'center');
        doc.text(item.numeroAsegurados.toString(),widthRiesgo*3,height,'center');
        doc.text(item.nombrePlan,widthRiesgo*4,height,'center');
        doc.text(vm.currency+' '+item.primaIndividual,widthRiesgo*5,height,'center');
        doc.text(vm.currency+' '+item.primaGrupal,widthRiesgo*6,height,'center');
        height = height + 30;
      });
      doc.setFontStyle('bold');
      doc.text('PRIMA COMERCIAL + IGV:',40,height);
      doc.text(vm.currency+' '+vm.primaTotal,widthRiesgo*6+40,height,'right');
      height = height + 30;
      doc.text('FINANCIAMIENTO:',40,height);
      height = height + 20;
      doc.setFontStyle('normal');
      doc.text('Forma de pago:',40,height);
      doc.text(vm.cotizacion.nombreFraccionamiento,140,height);
      doc.text('N° cuotas:',240,height);
      doc.text(vm.cuota.cantidad.toString(),320,height);
      doc.text('Importe de cuota:',400,height);
      doc.text(vm.currency+' '+vm.cuota.importe,widthRiesgo*6+40,height,'right');
      height = height + 30;
      doc.setFontSize(9);
      doc.text('* Aplica TCEA de XX%',40,height);
      height = height + 15;
      
      doc.text('**La presente cotización tiene una validez de 15 dias',40,height);
      return doc;
    }

    function DescargarCotizacion() {
      mpSpin.start();
      var base64Img; 
      imgToBase64(constants.system.api.urlBase+'images/logo-mapfre-peru.jpg', function(base64){
        base64Img = base64;
        var pdfBuffers = GetPdfCondicionados();
        var pdf = getPdfCotizacion(base64Img);
        var blobCot = pdf.output('arraybuffer');

        if(pdfBuffers.length>0){
          pdfBuffers.unshift(blobCot);
        }else{
          pdfBuffers.push(blobCot);
        }

        createPDF(pdfBuffers);
        // createPDF(pdfBuffers, vm.cotizacion.numeroDocumento);
        // mpSpin.end();
      });
    }

    function createPDF(pdfBuffers){
      PDFLib.PDFDocument.create().then(function(mergedPdf){
        for(var i=0; i<pdfBuffers.length; i++){
          PDFLib.PDFDocument.load(pdfBuffers[i],{ignoreEncryption:true}).then(function(pdf){
            mergedPdf.copyPages(pdf, pdf.getPageIndices()).then(function(copiedPages){
              copiedPages.forEach(function(page) {
                mergedPdf.addPage(page);
              });
            });
          });
        }
        $timeout(function(){
          mergedPdf.save().then(function(buf){
            var blobNew = new Blob([buf],{type: 'application/pdf'})
            FileSaver.saveAs(blobNew, 'doc_'+vm.cotizacion.numeroDocumento+'.pdf');
            mpSpin.end();
          });
        }, 1500)
      });
    }

    function base64ToArrayBuffer(data) {
      var bString = window.atob(data);
      var bLength = bString.length;
      var bytes = new Uint8Array(bLength);
      for (var i = 0; i < bLength; i++) {
          var ascii = bString.charCodeAt(i);
          bytes[i] = ascii;
      }
      return bytes.buffer;
    };

    function ChangeCotizar() {
      vm.cotizar = false;
    }
    function IrACotizar() {
      $state.go(constantsFola.ROUTES.COTIZACION);
    }
    function EmitirPoliza() {
      $scope.$broadcast('submitForm', true);
      if(vm.contratanteValid){
        _saveEmision();
      }
    }

    function GetDataContratante(data) {
      if (data.isClear) {
        vm.contratante.TipoDocumento.Codigo = vm.cotizacion.contratante.tipoDocumento;
        // vm.contratante.CodigoDocumento = vm.cotizacion.contratante.numeroDocumento;
        vm.contratante.NumeroDocumento = vm.cotizacion.contratante.numeroDocumento;
        vm.contratante.Nombre = vm.cotizacion.contratante.nombre;
      }
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
          FileSaver.saveAs(blob, arrayNameFile[0] +'_'+ vm.cotizacion.numeroDocumento + '.xlsx');
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
        vm.fileUpload = file;
        _readFile(file);
      }
    }

    function CleanFileUpload() {
      vm.cotizacion = {};
      vm.currency = constantsFola.SIMBOLO_MONEDA;
      vm.primaTotal = 0;
      vm.fileUpload = null;
      vm.dataInsured = [];
      vm.totalInsured = 0;
      vm.appCode = personConstants.aplications.FOLA;
      vm.formCode = personConstants.forms.EMI_FOL_CN;
      vm.contratante = {TipoDocumento:{}};
      vm.contratanteValid = false;
      vm.fileUploadIsOk = false;
      vm.nameFileUpload = '';
      vm.formData = '';
      _getCotizacion($state.params.documentoId);
    }

    // funciones privadas
    function _getCotizacion(documentId) {
      mpSpin.start();
      folaService.getDocumentFola(documentId).then(
        function (response) {
          vm.cotizacion = response.data;
          vm.contratante.TipoDocumento.Codigo = vm.cotizacion.contratante.tipoDocumento;
          vm.contratante.NumeroDocumento = vm.cotizacion.contratante.numeroDocumento;
          vm.contratante.Nombre = vm.cotizacion.contratante.nombre;
          vm.contratante.ignoreEquifax = false;
          response.data.riesgos.forEach( function(prima) {
            vm.primaTotal = vm.primaTotal + prima.primaGrupal;
          });
          vm.primaTotal = parseFloat(vm.primaTotal).toFixed(2);
          response.data.riesgos.forEach(function(data) {
            vm.totalInsured = vm.totalInsured + data.numeroAsegurados;
          });
          calcularCuotas();
          mpSpin.end();
        },
        function (error) {
          console.log('error', error);
          mpSpin.end();
        }
      );
    }
    function _getCondicionados(){
      folaService.getCondicionados(vm.condicionadoGeneral + "," + vm.condicionadoParticular)
      .then(
        function(response){
          vm.condicionados = response.data;
        }
      ).catch(function (error){
        console.log('Error en getCondicionados: ' + error);
      })
    }
    function calcularCuotas() {
      var months = mainServices.date.fnDiff(vm.cotizacion.fechaInicio, mainServices.date.fnAdd(vm.cotizacion.fechaFin,1,'D'), 'M');
      switch (vm.cotizacion.codigoFraccionamiento) {
        case 10012:
          vm.cuota.cantidad = months / 1;
          vm.cuota.importe = parseFloat(vm.primaTotal / vm.cuota.cantidad).toFixed(2);
          break;
        case 20002:
          vm.cuota.cantidad = months / 6;
          vm.cuota.importe = parseFloat(vm.primaTotal / vm.cuota.cantidad).toFixed(2);
          break;
        case 40004:
          vm.cuota.cantidad = months / 3;
          vm.cuota.importe = parseFloat(vm.primaTotal / vm.cuota.cantidad).toFixed(2);
          break;
        default:
          vm.cuota.cantidad = 1;
          vm.cuota.importe = parseFloat(vm.primaTotal / vm.cuota.cantidad).toFixed(2);
          break;
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
          vm.nameFileUpload = selectedFile.name;
          //For Browsers other than IE.
          if (reader.readAsBinaryString) {
            reader.onload = function (e) {
              vm.dataInsured = _processExcel(e.target.result);
              _processDataInsured(vm.dataInsured);
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
              vm.dataInsured = _processExcel(data);
              _processDataInsured(vm.dataInsured);
              mpSpin.end();
            };
            reader.readAsArrayBuffer(selectedFile);
          }
        } else {
          mpSpin.end();
          vm.fileUpload = null;
          vm.nameFileUpload = '';
          var fileUploadHtml = document.getElementById('file-upload');
          fileUploadHtml.value = null;
          mModalAlert.showWarning('El navegador no es compatible con esta función.', 'ALERTA', null, 3000);
        }
      } else {
        mpSpin.end();
        vm.fileUpload = null;
        vm.nameFileUpload = '';
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
      var excelRows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], {raw:false,dateNF:'dd-mm-yyyy'});
      return excelRows;
    }

    function _processDataInsured(data) {
      if (data) {
        var errorFile = false;
        // Validar cantidad de asegurados
        if (data.length !== vm.totalInsured) {
          // console.log('vm.cotizacion 1', vm.cotizacion);
          errorFile = true;
          vm.fileUpload = null;
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
            !insured.FECHA_NACIMIENTO ||
            !insured.TELEFONO ||
            !insured.CORREO ||
            !insured.PESO ||
            !insured.TALLA
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
              vm.fileUpload = null;
              vm.nameFileUpload = '';
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

            if (insured.FECHA_NACIMIENTO) {
              // Validar fecha
              var errorFecha = _validarFhNacimiento(insured.FECHA_NACIMIENTO);
              if (errorFecha) {
                errorFile = true;
                errors.push('Asegurado ' + i + ', fecha de nacimiento invalida.');
              }

              // Validar edad 
              var errorEdad = _calcularEdad(insured.FECHA_NACIMIENTO);
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
            var errorPeso = _validarPeso(insured.PESO);
            if (errorPeso) {
              errorFile = true;
              errors.push('Asegurado ' + i + ', peso invalido.');
            }

            // Validar talla
            var errorPeso = _validarTalla(insured.TALLA);
            if (errorPeso) {
              errorFile = true;
              errors.push('Asegurado ' + i + ', talla invalida.');
            }
          }
        });

        if (errorFile) {
          var mensaje = '';
          vm.fileUpload = null;
          vm.nameFileUpload = '';
          var fileUploadHtml = document.getElementById('file-upload');
          fileUploadHtml.value = null;
          mensaje = errors[0];
          vm.fileUploadIsOk = false;
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
          // vm.fileUploadIsOk = true;
          // document.getElementById('resumenEmisionFola').click();
        }
      }
    }

    function _requestRiesgos(data) {
      vm.cotizacion.riesgos.forEach(function(riesgo) {
        var asegurados = data
          .filter(function(asegurado) {
            if (parseInt(asegurado.GRUPO) === riesgo.grupo) {
              return asegurado;
            }
          })
          .map(function(asegurado) {  
            if (asegurado.FECHA_NACIMIENTO.includes('/')) {
              var arrayFecha = asegurado.FECHA_NACIMIENTO.split('/');
            }
      
            if (asegurado.FECHA_NACIMIENTO.includes('-')) {
              var arrayFecha = asegurado.FECHA_NACIMIENTO.split('-');
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
              talla: asegurado.TALLA,
              peso: asegurado.PESO,
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
      vm.cotizacion.riesgos.map(function(riesgo) {
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
      if (i !== vm.totalInsured) {
        errorFile = true;
        vm.fileUpload = null;
        vm.nameFileUpload = '';
        var fileUploadHtml = document.getElementById('file-upload');
        fileUploadHtml.value = null;
        vm.fileUploadIsOk = false;
        _limpiarAsegurados();
        mModalAlert.showWarning('Faltan registros de asegurados.', 'NO SE GENERÓ LA CARGA DEL ARCHIVO', null, 3000);
        return;
      }

      if (errorFile) {
        var mensaje = '';
        vm.fileUpload = null;
        vm.nameFileUpload = '';
        var fileUploadHtml = document.getElementById('file-upload');
        fileUploadHtml.value = null;
        mensaje = errors[0];
        vm.fileUploadIsOk = false;
        if (errors.length > 1) {
          var mensaje = mensaje + '\n' + errors[1];
        }
        if (errors.length > 2) {
          mensaje = mensaje + '\nY mas errores';
        }
        mModalAlert.showWarning(mensaje, 'NO SE GENERÓ LA CARGA DEL ARCHIVO', null, 6000);
        return;
      } else {
        vm.fileUploadIsOk = true;
        document.getElementById('resumenEmisionFola').click();
      }  
    }

    function _requestContratante() {
      vm.cotizacion.contratante.correoElectronico = vm.formData.CorreoElectronico || '';
      vm.cotizacion.contratante.telefono = vm.formData.Telefono || '';
      vm.cotizacion.contratante.celular = vm.formData.Telefono2 || '';
      vm.cotizacion.contratante.tipoActividadEconomica = vm.formData.ActividadEconomica.Codigo || '';
      vm.cotizacion.contratante.nombreActividadEconomica = vm.formData.ActividadEconomica.Descripcion || '';
      vm.cotizacion.contratante.contacto = {
        nombre: vm.formData.Representante || '',
        codigoTipoCargo: vm.formData.RepresentanteCargo.Codigo || '',
        nombreTipoCargo: vm.formData.RepresentanteCargo.Descripcion || '',
      };
      vm.cotizacion.contratante.direccion = {
        codigoDepartamento: vm.formData.Department.Codigo || '',
        nombreDepartamento: vm.formData.Department.Descripcion || '',
        codigoProvincia: vm.formData.Province.Codigo || '',
        nombreProvincia: vm.formData.Province.Descripcion || '',
        codigoDistrito: vm.formData.District.Codigo || '',
        nombreDistrito: vm.formData.District.Descripcion || '',
        tipoVia: vm.formData.Via.Codigo || '',
        nombreVia: vm.formData.NombreVia || '',
        numero: vm.formData.NumberType.Codigo || '',
        enumeracion: vm.formData.TextoNumero || '',
        tipoInterior: vm.formData.Inside.Codigo || '',
        numeroInterior: vm.formData.TextoInterior || '',
        tipoZona: vm.formData.Zone.Codigo || '',
        nombreZona: vm.formData.TextoZona || '',
        referencia: vm.formData.Referencia || ''
      };
    }
    function _validRequestObligatorioEmision() {
      var valid = true;
      if (
        !vm.cotizacion.contratante.correoElectronico ||
        !vm.cotizacion.contratante.telefono ||
        !vm.cotizacion.contratante.celular ||
        !vm.cotizacion.contratante.tipoActividadEconomica ||
        !vm.cotizacion.contratante.contacto.nombre ||
        !vm.cotizacion.contratante.contacto.codigoTipoCargo ||
        !vm.cotizacion.contratante.contacto.nombreTipoCargo ||
        !vm.cotizacion.contratante.direccion.codigoDepartamento ||
        !vm.cotizacion.contratante.direccion.nombreDepartamento ||
        !vm.cotizacion.contratante.direccion.codigoProvincia ||
        !vm.cotizacion.contratante.direccion.nombreProvincia ||
        !vm.cotizacion.contratante.direccion.codigoDistrito ||
        !vm.cotizacion.contratante.direccion.nombreDistrito ||
        !vm.cotizacion.contratante.direccion.tipoVia ||
        !vm.cotizacion.contratante.direccion.nombreVia ||
        !vm.cotizacion.contratante.direccion.numero ||
        !vm.cotizacion.contratante.direccion.enumeracion
      ) {
        valid = false;
      }
      return valid;
    }
    function _validRequestOpcionalEmision() {
      var valid = true;
      if (
        (vm.cotizacion.contratante.direccion.tipoInterior && !vm.cotizacion.contratante.direccion.numeroInterior) ||
        (!vm.cotizacion.contratante.direccion.tipoInterior && vm.cotizacion.contratante.direccion.numeroInterior)
      ) {
        valid = false;
      }
      if (
        (vm.cotizacion.contratante.direccion.tipoZona && !vm.cotizacion.contratante.direccion.nombreZona) ||
        (!vm.cotizacion.contratante.direccion.tipoZona && vm.cotizacion.contratante.direccion.nombreZona)
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
      folaService.saveEmision(vm.cotizacion).then(
        function (response) {
          _uploadFile(vm.fileUpload);
          mModalAlert.showSuccess('Información guardada correctamente.', 'MENSAJE', null, 3000);
          _uploadFile(vm.fileUpload);
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
        return true;
      }

      if (fecha.includes('-')) {
        var arrayFecha = fecha.split('-');
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
      var arrayFecha = fecha.split('-');
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
      vm.cotizacion.riesgos.forEach(function() {
        vm.cotizacion.riesgos[i].asegurados = [];
        i++;
      });
    }

  }
});