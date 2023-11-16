'use strict';

define([
  'angular',
  'oim_security',
  'seguroviajeService',
  'seguroviajeFactory',
  '/scripts/mpf-main-controls/components/modalSendEmailPoliza/component/modalSendEmailPoliza.js', //MSAAVEDRA 20210805
  ], function(ng) {

  SeguroviajeEmisionesController.$inject = [
    '$scope',
    '$filter',
    '$window',
    '$q',
    '$http',
    '$timeout',
    'accessSupplier',
    'oimPrincipal',
    'seguroviajeService',
    'seguroviajeFactory',
    'mModalAlert',
    'mpSpin',
    '$uibModal', //MSAAVEDRA 20210813
  ];

  function SeguroviajeEmisionesController(
    $scope
    , $filter
    , $window
    , $q
    , $http
    , $timeout
    , oimClaims
    , oimPrincipal
    , seguroviajeService
    , seguroviajeFactory
    , mModalAlert
    , mpSpin
    , $uibModal) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit(){
      vm.agents = searchAgents;
      vm.managers = searchManagers;
      vm.destinations = seguroviajeFactory.getDestinations()
      vm.tipoDocumentos = seguroviajeFactory.getDocuments()[0].types;
      vm.initFilter = initFilter;
      vm.clean = clean;
      vm.getPDF = getPDF;
      vm.getEmission = getEmission;
      vm.exportEmisions = exportEmisions;
      vm.enviarPolizaMail = enviarPolizaMail; //MSAAVEDRA 20210813
      vm.firstLoad = true;
      vm.emissions = []
      getListStatePolicy()

      initFilter()
    }
    function getListStatePolicy(){
      seguroviajeService.getListStatePolicy(false)
      .then(function(response){
        vm.states = response.data
      })
    }
    function searchAgents(value){
      var params = {
        CodigoNombre: value.toUpperCase(),
        CodigoGestor: 0,
        CodigoOficina: (oimPrincipal.isAdmin()) ? '0' : oimClaims.officeCode,
        McaGestSel: 'S',
        RolUsuario: oimPrincipal.get_role()
      };
      return seguroviajeService.getAgents(params, false);
    }
    function searchManagers(value){
      var params = {
        CodigoNombre: value.toUpperCase(),
        CodigoGestor: 0,
        CodigoOficina: (oimPrincipal.isAdmin()) ? '0' : oimClaims.officeCode,
        McaGestSel: 'S',
        RolUsuario: oimPrincipal.get_role()
      };
      return seguroviajeService.getManagers(params, false)
    }
    function initFilter(){
      vm.filter = seguroviajeFactory.setFilterBody();
      vm.filter.typeSearch = 3;
      getEmissionInitial();
    }
    function clean(){
      initFilter()
      vm.firstLoad = true
      vm.emissions = []
      vm.emissions.data.totalPages = 0
    }
    function getPDF(technicalControl, policyNumber){
      if(technicalControl == 'N'){
        mpSpin.start();
        seguroviajeService.getPDF(policyNumber, true)
        .then(function(response){
          mpSpin.end();
          var fileURL = URL.createObjectURL(response.data);
          window.open(fileURL);
        })
        .catch(function(err){
          mpSpin.end();
          mModalAlert.showError('Se presento un error al descargar el archivo', "¡Error!")
        })
      }
      else{
        mModalAlert.showError('[CONTROL TECNICO 375] : AUTORIZAR SIN DEBITO AUTOMATICO', "¡Error!")
      }
    }
    function getEmission(){
      vm.firstLoad =   false;
      seguroviajeService.getEmissionPage(seguroviajeFactory.setFilterRequest(angular.copy(vm.filter)), true)
      .then(function(response){        
        if(response.operationCode == 200){ 
          vm.emissions = response.data;
        }
      })
    }
    function getEmissionInitial(){
      seguroviajeService.getEmissionPage(seguroviajeFactory.setFilterRequest(angular.copy(vm.filter)), true)
      .then(function(response){
        if(response.operationCode == 200){
          if(response.data.data.length > 0){
            vm.firstLoad =   false; 
          }  
          vm.emissions = response.data;
        }
      })
    }
    function exportEmisions(){
      mpSpin.start();
      seguroviajeService.exportEmission(_.omit(seguroviajeFactory.setFilterRequest(angular.copy(vm.filter)), ['pageSize', 'pageNum']), true)
      .then(function(data) {
        var deferred = $q.defer();
        var defaultFileName = 'EXPORT_MULTIPLICA.xlsx';
        var vtype =  data.headers(["content-type"]);
        var file = new Blob([data.data], {type: vtype});
        mpSpin.end();
        $window.saveAs(file, defaultFileName);
        deferred.resolve(defaultFileName);
      });
    }


        //MSAAVEDRA 20210804
        function enviarPolizaMail(item) {
          console.log('item2', item);
          $scope.emailData = {
            CodigoCia: 2,
            NumeroPoliza: item.policyNumber,
            Aplicacion: 0,
            Suplemento: 0,
            SuplementoAplicacion: 0
          }
    
          //Modal      
          $scope.optionSendEmail = constants.modalSendEmail.envioPoliza;
          var vModalSendEmail = $uibModal.open({
            backdrop: true, // background de fondo
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            // size: 'lg',
            template: '<mpf-modal-send-email-poliza action="optionSendEmail" data="emailData" close="close()"></mpf-modal-send-email-poliza>',
            controller: ['$scope', '$uibModalInstance', '$uibModal', function ($scope, $uibModalInstance, $uibModal) {
              //CloseModal
              $scope.close = function () {
                $uibModalInstance.close();
              };
            }]
          });
    
        }
        //FIN MSAAVEDA

  }

  return ng.module('appSeguroviaje').controller('SeguroviajeEmisionesController', SeguroviajeEmisionesController);
});
