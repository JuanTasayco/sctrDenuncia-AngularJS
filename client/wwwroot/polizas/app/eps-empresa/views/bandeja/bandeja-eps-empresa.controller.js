define([
    'angular', 'constants'
  ], function (angular, constants) {
    'use strict';
  
    angular
      .module(constants.module.polizas.epsEmpresa.moduleName)
      .controller('bandejaEpsEmpresaController', BandejaEpsEmpresaController);
  
      BandejaEpsEmpresaController.$inject = ['$scope', '$state', 'epsEmpresaFactory', 'epsEmpresaService'];
  
    function BandejaEpsEmpresaController($scope, $state, epsEmpresaFactory, epsEmpresaService) {
      var vm = this;

      //variables
      vm.bandeja = {};
      vm.estadosSolicitud = {};
      vm.listadoSolicitudes = [];
      vm.totalSolicitudes = 0;
      vm.paginaActual = 1;
      vm.showNumberRows = 10;

      // Funciones
      vm.validControlForm = ValidControlForm;
      vm.cambioEstado = CambioEstado;
      vm.limpiarFiltro = LimpiarFiltro;
      vm.setFormatNroSolicitud = SetFormatNroSolicitud;
      vm.getPdfSolicitud = GetPdfSolicitud;
      vm.changePage = ChangePage;

      (function load_BandejaEpsEmpresaController(){
        epsEmpresaService.getListParametros().then(function (response) {
          if(response.rows) {
            epsEmpresaFactory.setParametros(response.rows);
            vm.estadosSolicitud = epsEmpresaFactory.getParametro("ESTADO_COTIZACION");
          }
        }).catch(function() {
          _mostrarErrorInterno();
        });
      })();

      function ValidControlForm(controlName) {
          return $scope.frmBandeja && epsEmpresaFactory.validControlForm($scope.frmBandeja, controlName);
      }

      function CambioEstado(seleccion) {
        if (angular.isUndefined(seleccion)) {
          vm.bandeja.mEstado = void(0);
          vm.bandeja.estado = '';
          return;
        }else{
          vm.bandeja.estado = seleccion.valorNumerico;
        }
      }

      function LimpiarFiltro(){
        vm.bandeja = {};
        vm.bandeja.mEstado = void(0);
        vm.bandeja.estado = '';
      }

      function SetFormatNroSolicitud(idSolicitud){
        var number = ('0000000000' + idSolicitud).toString();
        return number.slice(number.length - 10, number.length)
      }

      function GetPdfSolicitud(idSolicitud){
        epsEmpresaService.getBase64PdfSolicitud(idSolicitud).then(function (response) {
          _downloadBase64File(response.fileBase64, response.nombre);
        }).catch(function() {
          _mostrarErrorInterno();
        });
      }

      function ChangePage(indexPage){
        _clearFiltersSolicitud();
        vm.paginaActual = indexPage;
        data = {
          cantidadPorPagina: 10,
          limite: 0,
          numeroPagina: indexPage
        }

        var url = ''; var objUrl = {};
        for(var attr in vm.bandeja){
          if(attr !== 'mEstado'){
            if(attr === 'fechaDesde' || attr === 'fechaHasta'){
              if(vm.bandeja[attr] !== null)
                url += attr + '=' + vm.bandeja[attr].getFullYear() + '-' + ("0" + (vm.bandeja[attr].getMonth() + 1)).slice(-2) + '-' + ("0" + (vm.bandeja[attr].getDate())).slice(-2) + '&';
                objUrl[attr] = vm.bandeja[attr].getFullYear() + '-' + ("0" + (vm.bandeja[attr].getMonth() + 1)).slice(-2) + '-' + ("0" + (vm.bandeja[attr].getDate())).slice(-2);
            }
            else{
              if(!(attr === 'estado' && vm.bandeja[attr] === '')){
                url += attr + '=' + vm.bandeja[attr].toString().toUpperCase() + '&';
                objUrl[attr] = vm.bandeja[attr].toString().toUpperCase();
              }
            }
          }
        }

        url += 'cantidadPorPagina=' + data.cantidadPorPagina + '&' + 'limite=' + data.limite + '&' + 'numeroPagina=' + data.numeroPagina;
        var ruc = objUrl['ruc'] || "";
        var empresa = objUrl['empresa'] || "";
        var fechaDesde = objUrl['fechaDesde'] || "";
        var fechaHasta = objUrl['fechaHasta'] || "";
        var estado = objUrl['estado'] || "";

        epsEmpresaService.getListSolicitudes(data.numeroPagina, data.cantidadPorPagina, fechaDesde, fechaHasta, ruc, empresa, estado, data.limite).then(function(response){ //url).then(function(response){
          if(response.rows && response.total && response.rows.length > 0 )
          {
            vm.totalSolicitudes = response.total;
            vm.listadoSolicitudes = response.rows;
          }
        }).catch(function() {
          _mostrarErrorInterno();
        });
      }

      function _clearFiltersSolicitud(){
        vm.listadoSolicitudes = [];
        vm.totalSolicitudes = 0;
      }

      function _downloadBase64File(contentBase64, fileName) {
        const linkSource = 'data:application/pdf;base64,'+contentBase64;
        const downloadLink = document.createElement('a');
        document.body.appendChild(downloadLink);
    
        downloadLink.href = linkSource;
        downloadLink.target = '_self';
        downloadLink.download = fileName;
        downloadLink.click(); 
      }

      function _mostrarErrorInterno() {
        return $state.go(constantsEpsEmpresa.ROUTES.ERROR_INTERNO, {}, { reload: true, inherit: false });
      }
    }
});
