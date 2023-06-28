'use strict';

define([
    'angular',
    'constantsFola',
    'constants',
    'pdfLib',
    'jsPdf'
    ], function (
      angular,
      constantsFola,
      constants,
      PDFLib,
      jspdf
      ) {
    window.jsPDF = jspdf.default;

    angular
      .module(constants.module.polizas.fola.moduleName)
      .controller('emisorFola1Controller', EmisorFola1Controller);
    EmisorFola1Controller.$inject = [
        '$scope',
        '$state',
        'folaService',
        'mpSpin',
        'FileSaver',
        'mModalAlert',
        'mainServices',
        '$timeout'
    ];

    function EmisorFola1Controller(
        $scope,
        $state,
        folaService,
        mpSpin,
        FileSaver,
        mModalAlert,
        mainServices,
        $timeout
    ){
        var vm = this;
        $scope.cotizacion = {};
        $scope.currency = constantsFola.SIMBOLO_MONEDA;
        $scope.primaTotal = 0;
        $scope.condicionadoGeneral = constants.module.polizas.fola.tipoCondicionado.General;
        $scope.condicionadoParticular = constants.module.polizas.fola.tipoCondicionado.Particular;
        $scope.cuota = {};
        $scope.condicionados=[];
        
        // Funciones
        $scope.irACotizar = IrACotizar;
        $scope.descargarCotizacion = DescargarCotizacion;

        (function load() {
          _getCotizacion($state.params.documentoId);
          _getCondicionados();
        })();

        function IrACotizar() {
            $state.go(constantsFola.ROUTES.COTIZACION);
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
            });
        }

        function GetPdfCondicionados(){
            var pdfs = [];
            $scope.condicionados.map(function (cond) {
              if($scope.cotizacion.riesgos.some(function (r) {return r.idPlan == cond.idPlan} ) && cond.documentoBase64){
                var buffer = base64ToArrayBuffer(cond.documentoBase64);
                pdfs.push(buffer);
              }
            })
            var condGeneral = $scope.condicionados.find(function (cond) { return cond.tipoCondicionado == constants.module.polizas.fola.tipoCondicionado.General});
            if(condGeneral && condGeneral.documentoBase64){
              var bufferGeneral = base64ToArrayBuffer(condGeneral.documentoBase64);
              pdfs.push(bufferGeneral);
            }
            return pdfs;
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
            doc.setFont('helvetica','normal');
            height = height + 40;
            doc.text('N° de Cotización: '+ $scope.cotizacion.numeroDocumento,40,height);
            height = height + 15;
            doc.text('Fecha de Cotización: '+ $scope.cotizacion.fechaRegistro,40,height);
            if(base64Img){
              doc.addImage(base64Img,'JPEG',410,40,140,20)
            }
            height = height + 45;
            doc.setFontSize(12);
            doc.setFont('helvetica','bold');
            doc.text('SEGURO DE FORMACIÓN LABORAL',pageWidth/2,height, 'center');
      
            height = height + 40;
            doc.setFontSize(10);
            doc.setFont('helvetica','bold');
            doc.text('CONTRATANTE:',40,height);
            doc.setFont('helvetica','normal');
            doc.text($scope.cotizacion.contratante.nombre,140,height);
      
            height = height + 20;
            doc.setFont('helvetica','bold');
            doc.text('AGENTE:',40,height);
            doc.setFont('helvetica','normal');
            doc.text($scope.cotizacion.agente,140,height);
      
            height = height + 20;
            doc.setFont('helvetica','bold');
            doc.text('VIGENCIA:',40,height);
            doc.setFont('helvetica','normal');
            doc.text($scope.cotizacion.fechaInicio + ' - '+$scope.cotizacion.fechaFin,140,height);
      
            height = height + 20;
            doc.setFont('helvetica','bold');
            doc.text('ASEGURADOS:',40,height);
      
            height = height + 30;
            var widthRiesgo = pageWidth/7;
            console.log(widthRiesgo);
            $scope.cotizacion.riesgos.map(function(item){
              doc.setFont('helvetica','normal');
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
              var lines =doc.splitTextToSize(item.ocupacion, widthRiesgo);
              var dimensionlines = doc.getTextDimensions(lines);
              doc.text(lines, 40,height,'left');
              height = height - 5 +  (dimensionlines.h/2);
              doc.text($scope.currency+' '+item.subvencion,widthRiesgo*2,height,'center');
              doc.text(item.numeroAsegurados.toString(),widthRiesgo*3,height,'center');
              doc.text(item.nombrePlan,widthRiesgo*4,height,'center');
              doc.text($scope.currency+' '+item.primaIndividual,widthRiesgo*5,height,'center');
              doc.text($scope.currency+' '+item.primaGrupal,widthRiesgo*6,height,'center');
              height = height + 30 + (dimensionlines.h/2);
            });
            doc.setFont('helvetica','bold');
            doc.text('PRIMA COMERCIAL + IGV:',40,height);
            doc.text($scope.currency+' '+$scope.primaTotal,widthRiesgo*6+40,height,'right');
            height = height + 30;
            doc.text('FINANCIAMIENTO:',40,height);
            height = height + 20;
            doc.setFont('helvetica','normal');
            doc.text('Forma de pago:',40,height);
            doc.text($scope.cotizacion.nombreFraccionamiento,140,height);
            doc.text('N° cuotas:',240,height);
            doc.text($scope.cuota.cantidad.toString(),320,height);
            doc.text('Importe de cuota:',400,height);
            doc.text($scope.currency+' '+$scope.cuota.importe,widthRiesgo*6+40,height,'right');
            height = height + 30;
            doc.setFontSize(9);
            if($scope.cotizacion.codigoFraccionamiento == 10012 || $scope.cotizacion.codigoFraccionamiento == 40004){
              doc.text('*Aplica TCEA de 16.56%',40,height);
              height = height + 15;
            }
            doc.text('**La presente cotización tiene una validez de 15 dias',40,height);
            return doc;
        }

        function createPDF(pdfBuffers){
            PDFLib.PDFDocument.create().then(function(mergedPdf){
                for(var i=1; i<pdfBuffers.length; i++){
                  PDFLib.PDFDocument.load(pdfBuffers[i],{ignoreEncryption:true}).then(function(pdf){
                      mergedPdf.copyPages(pdf, pdf.getPageIndices()).then(function(copiedPages){
                        copiedPages.forEach(function(page) {
                            mergedPdf.addPage(page);
                        });
                      });
                  });
                }
                PDFLib.PDFDocument.load(pdfBuffers[0],{ignoreEncryption:true}).then(function(pdf){
                  mergedPdf.copyPages(pdf, pdf.getPageIndices()).then(function(copiedPages){
                    copiedPages.forEach(function(page) {
                        mergedPdf.insertPage(0,page);
                    });
                  });
                });
                $timeout(function(){
                mergedPdf.save().then(function(buf){
                    var blobNew = new Blob([buf],{type: 'application/pdf'})
                    FileSaver.saveAs(blobNew, 'doc_'+$scope.cotizacion.numeroDocumento+'.pdf');
                    mpSpin.end();
                });
                }, 1500)
            });
        }
        

        function _getCotizacion(documentId) {
            mpSpin.start();
            folaService.getDocumentFola(documentId).then(
              function (response) {
                $scope.cotizacion = response.data;
                response.data.riesgos.forEach( function(prima) {
                  $scope.primaTotal = $scope.primaTotal + prima.primaGrupal;
                });
                $scope.primaTotal = parseFloat($scope.primaTotal).toFixed(2);
                response.data.riesgos.forEach(function(data) {
                  $scope.totalInsured = $scope.totalInsured + data.numeroAsegurados;
                });
                calcularCuotas();
                mpSpin.end();
              },
              function (error) {
                $state.go('errorInternoFola',{}, { reload: true, inherit: false });
                mpSpin.end();
              }
            );
        }
        function _getCondicionados(){
            folaService.getCondicionados($scope.condicionadoGeneral + "," + $scope.condicionadoParticular)
            .then(
              function(response){
                $scope.condicionados = response.data;
              }
            ).catch(function (error){
              $state.go('errorInternoFola',{}, { reload: true, inherit: false });
              console.log('Error en getCondicionados: ' + error);
            })
        }
        function calcularCuotas() {
            var months = mainServices.date.fnDiff($scope.cotizacion.fechaInicio, mainServices.date.fnAdd($scope.cotizacion.fechaFin,1,'D'), 'M');
            switch ($scope.cotizacion.codigoFraccionamiento) {
                case 10012:
                $scope.cuota.cantidad = months / 1;
                $scope.cuota.importe = parseFloat($scope.primaTotal / $scope.cuota.cantidad).toFixed(2);
                break;
                case 20002:
                $scope.cuota.cantidad = months / 6;
                $scope.cuota.importe = parseFloat($scope.primaTotal / $scope.cuota.cantidad).toFixed(2);
                break;
                case 40004:
                $scope.cuota.cantidad = months / 3;
                $scope.cuota.importe = parseFloat($scope.primaTotal / $scope.cuota.cantidad).toFixed(2);
                break;
                default:
                $scope.cuota.cantidad = 1;
                $scope.cuota.importe = parseFloat($scope.primaTotal / $scope.cuota.cantidad).toFixed(2);
                break;
            }
        }

        $scope.emitir = function () {
          $state.go('emisionFola.steps', {
            documentoId: $state.params.documentoId,
            step: 2
          },
          {reload: true, inherit: false});
        }
    }
});