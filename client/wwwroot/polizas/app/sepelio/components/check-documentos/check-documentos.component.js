define([
    'angular', 'constants', 'constantsSepelios', 'cpsformEmision'
  ], function (ng, constants, constantsSepelios, cpsformEmision) {
    checkDocumentosController.$inject = ['$scope','mModalAlert', 'campoSantoFactory', 'campoSantoService', 'mainServices'];
    function checkDocumentosController($scope,mModalAlert, campoSantoFactory, campoSantoService, mainServices) {
      var vm = this;
  
      vm.isReadOnly = !campoSantoFactory.isPreemitidoEditable();
      vm.leeDocuments = LeeDocuments
      vm.filterDocumentos = filterDocumentos
      vm.deleteDocument = DeleteDocument
      vm.modelo = {
        filtro:''
      }
      
      vm.$onInit = function () {
        _listRepositorioDocumentos();
      };
      function _listRepositorioDocumentos() {
        campoSantoService.getCotizacion(campoSantoFactory.getidCotizacion())
          .then(function (response) {
            vm.detalleCotizacion = response.Data;
            getDocumentos();
        });
      }

      function getDocumentos() {
        campoSantoService.getDocumentos(vm.detalleCotizacion.idRamo, vm.detalleCotizacion.idTipoProducto, vm.detalleCotizacion.idCotizacion).then(function (response) {
          vm.listRepositorio = response.Data;
          vm.listRepositorioFilter = response.Data;
        });
      }
      
      function filterDocumentos () {
        vm.listRepositorioFilter = [];
        for (var index = 0; index < vm.listRepositorio.length; index++) {
          var element = vm.listRepositorio[index];
          if (element.NombreDocumento.toUpperCase().indexOf(vm.modelo.filtro.toUpperCase()) !== -1) { 
            vm.listRepositorioFilter.push(element);
          }
        }
      }
      
      $scope.cargarDocumento = function (item, inputFile) {

          console.log(item, inputFile)
        var nombreArchivo = ""
        var adjunto = ""
          
        nombreArchivo = inputFile.files[0].name;
        adjunto = inputFile.files[0];
        convertBlobToBase64(adjunto, function (base64File) {
            var altaDocumentalModel = {
              idCotizacion: vm.detalleCotizacion.idCotizacion,
              idTipoDocumento: item.IdTipoDocumento,
              idGD: item.IdGD,
              idRamo: vm.detalleCotizacion.idRamo,
              idTipoContrato: vm.detalleCotizacion.idTipoProducto,
              idDocumentoGD: null,
              idCotizacionDocumento: 0,
              nombreArchivo: nombreArchivo,
              titulo: nombreArchivo,
            tipo: nombreArchivo.split('.').pop(),
            adjunto: base64File
            }

            campoSantoService.uploadDocuments(altaDocumentalModel).then(function (response) {
              if (response.OperationCode === 200) {
                refreshFilter(response);
            }else{
              mModalAlert.showWarning(response.Data.Message || response.Data, "");
              item.file=null;
              }
            })
          
        });
      }

      function DeleteDocument (item) {
        campoSantoService.deleteDocument(item.IdCotizacionDocumento, vm.detalleCotizacion.idRamo, vm.detalleCotizacion.idCotizacion, vm.detalleCotizacion.idTipoProducto).then(function (response) {
          if (response.OperationCode === 200) {
            refreshFilter(response);
          }
        })
      }

      function refreshFilter(response){
        vm.listRepositorio = response.Data;
        vm.listRepositorioFilter = response.Data;
        filterDocumentos();
      }

      function convertBlobToBase64 (file, callBack)  {
        var reader = new FileReader();
        reader.onloadend = function () {
          console.log(reader.result);
          var base64String = reader.result
            .replace("data:", "")
            .replace(/^.+,/, "");
          callBack(base64String);
        };
        reader.readAsDataURL(file);
      }

      function LeeDocuments (item) {
        campoSantoService.leeDocuments(item.IdDocumentoGD).then(function (response) {
          mainServices.fnDownloadFileBase64(response.Data, item.Tipo, item.Titulo, false);
        })
      }


    } // end controller
    return ng.module('appSepelio')
      .controller('checkDocumentosController', checkDocumentosController)
      .component('cpsCheckDocumentos', {
        templateUrl: '/polizas/app/sepelio/components/check-documentos/check-documentos.component.html',
        controller: 'checkDocumentosController',
        bindings: {
          cotizacion: '=',
          form: '=?form',
        }
      })
  });
  