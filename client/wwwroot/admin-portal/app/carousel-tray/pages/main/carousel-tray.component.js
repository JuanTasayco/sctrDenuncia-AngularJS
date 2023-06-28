'use strict';

define(['angular', 'coreConstants'], function(ng, coreConstants) {
  CarouselTrayComponent.$inject = ['CarouselTrayFactory', 'products', '$stateParams'];
  function CarouselTrayComponent(CarouselTrayFactory, products, $stateParams) {
    var vm = this;
    vm.$onInit = onInit;
    vm.paginate = paginate;
    vm.filterByItemsPerPage = filterByItemsPerPage;
    vm.onTab = onTab;
    vm.codeApp = $stateParams.codeApp;
    vm.isMydream = $stateParams.codeApp === coreConstants.codigoAppMydream;

    function onInit() {
      _initValues();
      _getGeneralParameters();
      _getList();
    }

    function paginate(e) {
      vm.currentPage = e.pageToLoad;
      _getList();
    }

    function filterByItemsPerPage(iPerPage) {
      vm.itemsPerPage = iPerPage;
      vm.currentPage = 1;
      _getList();
    }

    function onTab(e) {
      vm.idProducto = e.code;
      vm.currentProduct = e.lbl.toLowerCase();
      vm.currentPage = 1;
      _getList();
    }

    // private

    function _getGeneralParameters() {
      CarouselTrayFactory.GetParametrosGenerales(false).then(function(res) {
        localStorage.setItem('general_parameters', res);
      });
    }

    function _getList() {
      var queryReq = {
        idProducto: vm.idProducto,
        pagina: vm.currentPage,
        registros: vm.itemsPerPage
      };
      CarouselTrayFactory.GetListadoCarrusel(queryReq, true).then(function(res) {
        vm.list = res.listaResultados;
        vm.total = res.totalRegistros;
        vm.carouselLabel = vm.total === 1 ? 'Carrusel' : 'Carruseles';
      });
    }

    function _initValues() {
      vm.currentPage = 1;
      vm.itemsPerPage = 10;
      vm.itemsPerPageList = [10, 25, 50];
      vm.tabs = products;
      vm.currentProduct = 'Todos';
    }
  } // end controller

  return ng.module(coreConstants.ngMainModule).controller('CarouselTrayComponent', CarouselTrayComponent);
});
