'use strict';

define(['angular', 'coreConstants', 'generalConstants'], function(ng, coreConstants, generalConstants) {
  BannerRecordsComponent.$inject = ['BannerRecordsFactory', '$stateParams'];
  function BannerRecordsComponent(BannerRecordsFactory, $stateParams) {
    var vm = this;
    vm.$onInit = onInit;
    vm.changeSort = changeSort;
    vm.paginate = paginate;
    vm.filterByItemsPerPage = filterByItemsPerPage;
    vm.validateString = validateString;
    vm.clearSearch = clearSearch;
    vm.codeApp = $stateParams.codeApp;

    function onInit() {
      _initValues();
      _getList();
    }

    function validateString() {
      if (vm.searchModel.trim().length === 0 || vm.searchModel.trim().length >= 3) {
        vm.currentPage = 1;
        _getList();
      }
    }

    function clearSearch() {
      vm.searchModel = '';
      vm.currentPage = 1;
      _getList();
    }

    function changeSort() {
      vm.currentPage = 1;
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

    function _getList() {
      var queryReq = {
        busqueda: vm.searchModel.trim(),
        pagina: vm.currentPage,
        registros: vm.itemsPerPage,
        orden: vm.sort.Code
      };
      BannerRecordsFactory.GetListadoBanners(queryReq, true).then(function(res) {
        vm.list = res.listaResultados;
        vm.total = res.totalRegistros;
        vm.carouselLabel = vm.total === 1 ? 'Banner' : 'Banners';
      });
    }

    function _initValues() {
      vm.searchModel = '';
      vm.sortSource = [
        {Code: 2, Description: generalConstants.sortBy.latest},
        {Code: 1, Description: generalConstants.sortBy.name}
      ];
      vm.sort = {Code: 2};
      vm.currentPage = 1;
      vm.itemsPerPage = 10;
      vm.itemsPerPageList = [10, 25, 50];
    }
  } // end controller

  return ng.module(coreConstants.ngMainModule).controller('BannerRecordsComponent', BannerRecordsComponent);
});
