(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'reportFilter', ['angular', 'system'],
    function(angular, system) {
      angular.module('medicalCenter.app')
      .controller('reportFilterController', ['proxyLookup','mModalAlert' ,function(proxyLookup, mModalAlert){
        var vm = this;
        vm.$onInit = onInit;
        function onInit() {
          vm.changedSede = changedSede;
          vm.changedFinancial = changedFinancial;
          vm.cleanFrm = cleanFrm; 
          vm.search = search;
          vm.frm = vm.frm || {};
          vm.frm.specialties = [];
          vm.frm.contractCategories = [];
          vm.frm.contracts = [];
          vm.frm.fromDate = new Date();
          vm.frm.toDate = new Date();
          vm.dateFormat = 'dd/MM/yyyy';
          loadLookups();
          vm.specialtySettings= {
            displayProp:"descripcion",
            smartButtonMaxItems:1,
            enableSearch: true,
            smartButtonTextConverter: function(itemText, originalItem) {
              return vm.frm.specialties.length == vm.dataSpecialties.length ? "TODOS": "ALGUNOS";
          }
          };
          vm.contractCategorySettings= {
            displayProp:"descripcion",
            smartButtonMaxItems:1,
            enableSearch: true,
            smartButtonTextConverter: function(itemText, originalItem) {
              return vm.frm.contractCategories.length == vm.dataContractCategories.length ? "TODOS": "ALGUNOS";
            }
          };
          vm.contractSettings= {
            displayProp:"descripcion",
            smartButtonMaxItems:1,
            enableSearch: true,
            smartButtonTextConverter: function(itemText, originalItem) {
              return vm.frm.contracts.length == vm.dataContracts.length ? "TODOS": "ALGUNOS";
            }
          };
          if(vm.reportSettings.filterOptions.onlyMonths){
            vm.frm.periodType = { codigo: "M" };
          }
          if(vm.reportSettings.filterOptions.defaultContract){
            vm.frm.contractNumber = { codigo: "0" };
          }
        }
        function loadLookups(){
          proxyLookup
          .GetLookups(true)
          .then(function(response){
            vm.dataSedes = response.sedes;
            vm.dataPeriodTypes = response.periodTypes;
            vm.dataDetailTypes = response.detailTypes;
            vm.dataFinancials = response.financials;
            vm.dataContractCategories = response.contractCategories;
            vm.dataContracts = [];
            if(vm.reportSettings.filterOptions.contractCategoryMultiple && 
              vm.reportSettings.filterOptions.selectAllCategories){
              for(var i = 0; i < vm.dataContractCategories.length; i++){
                var category = vm.dataContractCategories[i];
                vm.frm.contractCategories.push(category);
              }
            }
          });
          if (vm.reportSettings.filterOptions.movementType)
            proxyLookup.GetMovements(vm.reportSettings.defaultFilter.movementType).then(function(response){
              vm.dataMovementType = response.data || response;
          })
        }
        function cleanFrm(){
          vm.frm.fromDate = new Date();
          vm.frm.toDate = new Date();
          vm.frm.sede = {codigo:null};
          vm.frm.periodType = {codigo:null}
          vm.frm.detailType= {codigo:null} 
          vm.frm.financial = {codigo:null}
          vm.frm.movement = {codigo:null}
          vm.frm.storage = {codigo:null}
          vm.frm.specialties = []
          vm.frm.contractCategories = []
          vm.dataStorage = []
          vm.dataSpecialties = []
          vm.dataContracts = []

          if(vm.reportSettings.filterOptions.contractCategoryMultiple && 
            vm.reportSettings.filterOptions.selectAllCategories){
            for(var i = 0; i < vm.dataContractCategories.length; i++){
              var category = vm.dataContractCategories[i];
              vm.frm.contractCategories.push(category);
            }
          }

          if(vm.reportSettings.filterOptions.onlyMonths){
            vm.frm.periodType = { codigo: "M" };
          }
          
          delete vm.frm.specialty
          delete vm.frm.contract
          vm.onClean();
        }
        function search(){

          if (!vm.frm.sede || !vm.frm.sede.codigo){
            mModalAlert.showError("Seleccione una sede", "Sede");
            return;
          }
          if (vm.reportSettings.filterOptions.specialtyMultiple && (!vm.frm.specialties || vm.frm.specialties.length==0)){
              mModalAlert.showError("Seleccione alguna especialidad", "Especialidad");
              return;
          }
          if (vm.reportSettings.filterOptions.contractCategoryMultiple && (!vm.frm.contractCategories || vm.frm.contractCategories.length==0)){
            mModalAlert.showError("Seleccione alguna categoría", "Agrupación estadística");
            return;
          }
          if (vm.reportSettings.filterOptions.typePeriod){
            if (!vm.frm.periodType || !vm.frm.periodType.codigo){
              mModalAlert.showError("Seleccione un tipo de periodo", "Tipo de periodo");
              return;
            } 
          }
          if ((!vm.frm.fromDate || !vm.frm.toDate)){
            mModalAlert.showError("Ingrese un rango de fecha valida", "Rango de fechas");
            return;
          }
          else if(vm.frm.toDate.getTime()<vm.frm.fromDate.getTime()){
            mModalAlert.showError("El rango de fechas es invalidad, la fecha 'desde' debe ser menor que la fecha 'hasta'", "Rango de fechas");
            return;
          }else{
              if (vm.reportSettings.customValidation && vm.reportSettings.customValidation.rangeDate && !vm.reportSettings.customValidation.rangeDate.func(vm.frm, mModalAlert.showError))
                return;
          }
          
          if (vm.reportSettings.filterOptions.providers){
            if (vm.frm.providers){
              var items = (vm.frm.providers + '').split(',')
              for (var index = 0; index < items.length; index++) {
                var element = items[index];
                var value = parseInt(element.replace(/^\s+|\s+$/g, ''))
                  if(!angular.isNumber(value) || isNaN(value)){
                    mModalAlert.showError("Los valores de proveedores debe ser de tipo numérico y separados por comas ','", "Proveedores");
                    return;
                }
              }
            }
          }
          
          
          var data = angular.extend(vm.frm, vm.reportSettings.defaultFilter || {}) ;
          vm.onSearch({$event: data})
          
        }
        function changedSede(sede){
          if (sede.codigo){
            if (vm.reportSettings.filterOptions.specialty){
              proxyLookup.GetEspecialty(sede.codigo, true)
                     .then(function(response){
                      vm.dataSpecialties = response.data || response;
                vm.frm.specialties=[];
                if(vm.reportSettings.filterOptions.specialtyMultiple && 
                  vm.reportSettings.filterOptions.selectAllSpecialities){
                  for(var i = 0; i < vm.dataSpecialties.length; i++){
                    var specialty = vm.dataSpecialties[i];
                    vm.frm.specialties.push(specialty);
                  }
                }
                     });
            }
              
            if (vm.reportSettings.filterOptions.storage)
                proxyLookup.GetStores(sede.codigo).then(function(response){
                  vm.dataStorage = response.data || response;
                })
                

            }else{
              vm.dataSpecialties = [];
              vm.dataMovementType =  [];
              vm.dataStorage =  [];
              vm.frm.specialties=[];
            }
            
          }
        
        function changedFinancial(financial){
          if (vm.reportSettings.filterOptions.contract){
            if (financial.codigo){
              proxyLookup.GetEndContract(financial.codigo, true)
              .then(function(response){
                vm.dataContracts = response.data || response;
                vm.frm.contracts = [];
                if(vm.reportSettings.filterOptions.contractMultiple && 
                  vm.reportSettings.filterOptions.selectAllContracts){
                  for(var i = 0; i < vm.dataContracts.length; i++){
                    var contract = vm.dataContracts[i];
                    vm.frm.contracts.push(contract);
                  }
                }
              });
            }
            else{
              vm.dataContracts = [];
              vm.frm.contracts = [];
            }
            
          }
          
        }
      }])
      .component('reportFilter', {
        templateUrl: system.pathAppBase('/dashboard/common/components/filterPanel.html'),
        controller: 'reportFilterController',
        bindings: {
          onSearch:'&?',
          onClean:'&?',
          reportSettings:"=?"
        }
      });
    });