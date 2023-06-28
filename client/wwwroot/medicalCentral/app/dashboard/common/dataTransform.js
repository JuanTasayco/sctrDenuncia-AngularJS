(function($root, name, deps, action) {
  $root.define(name, deps, action);
  })(window, 'dataTransform', ['angular','lodash', 'helper'],
    function(angular, _, helper) {
      angular
      .module('medicalCenter.app.common',[])
      .factory("dataTransform", [function(){
        function getLastColumn(data, includeAllProp)
        {

            var acum =[]
            var details = _.filter(data, function(x){ return x.itemType == 'C' });
            if (includeAllProp && details && details.length>0){
                return details[0].properties.length - 1;
            }
            for (var index = 0; index < details.length; index++) {
                var element = details[index];
                 var prop = _.findLast(element.properties, function(e,i){ return e.value !== '' && 
                                                                     e.value !== null && 
                                                                     e.value !== undefined });
                prop ? acum.push(element.properties.indexOf(prop)):undefined;
            }
            
            return acum.length>0?_.max(acum):-1;
            
        }
        function columnsEmptyProperties(data, lastIndex){
            for (var index = 0; index < data.length; index++) {
                var item = data[index];
                item.properties = _.filter(item.properties, function(x,i){ return i<=lastIndex });
            }
            return data;
        }
        function getDataChart(data){
            var dataChart = [];
            var header = _.filter(data, function(x){ return x.itemType === 'C' })[0];
            
            data = _.filter(data, function(x){ return x.itemType === 'D' || x.itemType == 'S'});
            for (var index = 0; index < data.length; index++) {
                var element = data[index];
                var val = _.extend({}, element);        
                
                for (var index2 = 0; index2 < val.properties.length; index2++) {
                    var clone = _.extend({}, val);
                    var item = val.properties[index2];
                    clone['key'] = header.properties[index2].value;
                    clone['value'] = item.value;
                    delete clone.properties;
                    dataChart.push(clone);
                }
            }
            return dataChart;
        }
        function getDataMatrix(data){
            
            return _.filter(data, function(x){ return x.itemType !== 'C' });
        }
        function getHeaderMatrix(data){
            return _.filter(data, function(x){ return x.itemType === 'C' });
        }

        function propareDate(data, includeAllProp){
           var lastIndex = getLastColumn(data, includeAllProp);
           
           data = columnsEmptyProperties(data, lastIndex)
           return {
               matrix: {
                   header: getHeaderMatrix(data),
                   data: getDataMatrix(data)
               },
               chart:{
                   dataChart: getDataChart(data)
               }
           } 
        }
        return propareDate;
        }])
      .factory('dataProviderReport', ['$q', 'dataTransform', '$filter','proxyPanel', function($q, dataTransform, $filter, proxyPanel){
        var requestFormat  = 'yyyy-MM-dd';
        var fDate = $filter('date');
        function searchWeb(codeReport, $event){
            var defer = $q.defer();
            var data =  $event;
            
            proxyPanel.GetReportWeb(codeReport,
                data.sede ? data.sede.codigo || '':'',
                data.storage ? data.storage.codigo || '':'',
                fDate(data.toDate, requestFormat),
                fDate(data.fromDate, requestFormat),
                data.movementType,
                data.movement ? data.movement.codigo || '':'',
                true
                )
                .then(function(response){
                  
                    var  data = response.data || response;
                    defer.resolve(dataTransform(data, true));
                    
                  }, function(response){
                      defer.reject(response);
                  });
            return defer.promise;
        }
        function search(codeReport, $event){
            var data =  $event;
            
            var defer = $q.defer();
            if (data){
                var speci, categor,contrato;
                if (angular.isArray(data.specialties) && data.specialties.length>0){
                    var v=[]
                    for (var index = 0; index < data.specialties.length; index++) {
                        var element = data.specialties[index];
                        v.push(element.codigo)               
                    }
                    speci = v.join(",");
                }else {
                    speci = data.specialty ? (data.specialty.codigo || '99999'): '99999';
                }
                if (angular.isArray(data.contractCategories) && data.contractCategories.length>0){
                    var v=[]
                    for (var index = 0; index < data.contractCategories.length; index++) {
                        var element = data.contractCategories[index];
                        v.push(element.codigo)               
                    }
                    categor = v.join(",");
                }else {
                    categor = data.contractCategory ? data.contractCategory.codigo : '';
                }
                if (angular.isArray(data.contracts) && data.contracts.length>0){
                    var v=[]
                    for (var index = 0; index < data.contracts.length; index++) {
                        var element = data.contracts[index];
                        v.push(element.codigo)               
                    }
                    contrato = v.join(",");
                } else {
                    contrato = data.contracts ? (data.contracts.codigo || '99999') : '99999';
                }
                    
              proxyPanel
                .GetReport(codeReport,  data.sede ? data.sede.codigo || '':'', 
                                             data.periodType ? (data.periodType.codigo || ''):'',
                                             speci,
                                             fDate(data.toDate, requestFormat),
                                             fDate(data.fromDate, requestFormat),
                                             data.detailType ? data.detailType.codigo || '':'',
                                             data.financial ? data.financial.codigo || '99':'99',
                                             contrato,
                                             data.providers ? data.providers || '':'', 
                                             categor,
                                             true)
                .then(function(response){
                  
                  var  data = response.data || response;
                  defer.resolve(dataTransform(data));
                  
                }, function(response){
                    defer.reject(response);
                });
            }
            else{
                defer.reject({});
            }
            return defer.promise;
          }
          return {search:search, searchWeb:searchWeb};
        }])
      .constant("medicalCenterReport", {
        medicalConsultationsBySpecialty: {
            code: 'CONXESP',
            title:'CONSULTAS MEDICAS POR ESPECIALIDAD Y EVOLUCIÓN DE ATENCIONES',
            filterOptions: {
                typePeriod: true,
                specialty: true,
                specialtyMultiple:true
            },
            customValidation:{
                rangeDate:{
                    func: function(frm, fnMsg){
                        var timeDiff = Math.abs(frm.toDate.getTime() - frm.fromDate.getTime());
                        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
                        var pt = frm.periodType.codigo;
                        if (pt == 'D' && diffDays>31){
                            fnMsg("Debe seleccionar un rango no mayor a 31 dias", "Rango de fechas")
                            return false;
                        }
                        if (pt == 'M'){
                            var months;
                            months = (frm.toDate.getFullYear() - frm.fromDate.getFullYear()) * 12;
                            months -= frm.fromDate.getMonth() + 1;
                            months += frm.toDate.getMonth();
                            if (months>12){
                                fnMsg("Debe seleccionar un rango no mayor a 12 meses", "Rango de fechas")
                                return false;    
                            }
                        }
                        if (pt == 'A' && frm.toDate.getYear() - frm.fromDate.getYear() > 3){
                            fnMsg("Debe seleccionar un rango no mayor a 3 años", "Rango de fechas")
                            return false;
                        }
                        return true;
                    }
                }
            },
            container:{
                url:'/medicalCentral/app/dashboard/consultationsBySpecialty/body.html'
            }
        },
        ocupabilityBySpecialty : {
            code: ['OCUXESP', 'OCUXMED'],
            title:'OCUPABILIDAD POR ESPECIALIDAD',
            filterOptions: {
                specialty: true,
                specialtyMultiple:true,
                detailType: true
            },
            container:{
                url:'/medicalCentral/app/dashboard/ocupabilityBySpecialty/body.html'
            }
        },
        structureBillingByPortfolio : {
            title:'ESTRUCTURA DE LA FACTURACIÓN POR CARTERA',
            code: 'FACXCAR',
            filterOptions: {
                specialty: true,
                financial : true
            },
            container:{
                url:'/medicalCentral/app/dashboard/structureBillingByPortfolio/body.html'
            }
        },
        structureBillingByConcept : {
            code: 'FACXCCB',
            title:'ESTRUCTURA DE LA FACTURACIÓN POR CONCEPTO',
            filterOptions: {
                specialty: true,
                financial : true
            },
            container:{
                url:'/medicalCentral/app/dashboard/structureBillingByConcept/body.html'
            }
        },
        demandStructure : {
            code: 'DEMANDA',
            title:'ESTRUCTURA DE DEMANDA',
            filterOptions: {
                specialty : true,
                specialtyMultiple:true,
                contractCategory: true,
                contractCategoryMultiple:true,
                selectAllCategories: true,
                selectAllSpecialities: true
            },
            container:{
                url:'/medicalCentral/app/dashboard/demandStructure/body.html'
            }
        },
        portfolioRaising : {
            code:'CAPCART',
            title:'CAPTACIÓN DE CARTERA',
            filterOptions: {
                specialty : true,
                specialtyMultiple:true,
                contractCategory: true,
                contractCategoryMultiple:true,
                selectAllCategories: true,
                selectAllSpecialities: true
            },
            container:{
                url:'/medicalCentral/app/dashboard/portfolioRaising/body.html'
            }
        },
        monthlyPurchases:{
            code:'COMXMES',
            resolverDataType:"Web",
            title:'COMPRAS MENSUALES',
            defaultFilter: {
                movementType: 'I'
            },
            filterOptions:{
                storage: true,
                movementType: true
            },
            container:{
                url:'/medicalCentral/app/dashboard/monthlyPurchases/body.html'
            }
        },
        salesByCustomer:{
            code:'VENXCLI',
            resolverDataType:"Web",
            title:'VENTAS POR CLIENTE',
            defaultFilter: {
                movementType: 'S'
            },
            filterOptions:{
                storage: true,
                movementType: true
            },
            container:{
                url:'/medicalCentral/app/dashboard/salesByCustomer/body.html'
            }
        },
        salesToMapfreSeat:{
            code:'VENXMAP',
            resolverDataType:"Web",
            title:'VENTAS A MAPFRE POR SEDES',
            defaultFilter: {
                movementType: 'S'
            },
            filterOptions:{
                storage: true,
                movementType: true
            },
            container:{
                url:'/medicalCentral/app/dashboard/salesToMapfreSeat/body.html'
            }
        },
        portfolioGrowth : {
            code: 'CRECART',
            title:'CRECIMIENTO POR CARTERA',
            filterOptions: {
                onlyMonths: true,
                specialty : true,
                specialtyMultiple:true,
                financial : true,
                contract : true,
                contractMultiple: true,
                selectAllSpecialities: true
            },
            customValidation:{
                rangeDate:{
                    func: function(frm, fnMsg){
                        var timeDiff = Math.abs(frm.toDate.getTime() - frm.fromDate.getTime());
                        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
                        var pt = frm.periodType.codigo;
                        if (pt == 'D' && diffDays>31){
                            fnMsg("Debe seleccionar un rango no mayor a 31 dias", "Rango de fechas")
                            return false;
                        }
                        if (pt == 'M'){
                            var months;
                            months = (frm.toDate.getFullYear() - frm.fromDate.getFullYear()) * 12;
                            months -= frm.fromDate.getMonth() + 1;
                            months += frm.toDate.getMonth();
                            if (months>12){
                                fnMsg("Debe seleccionar un rango no mayor a 12 meses", "Rango de fechas")
                                return false;    
                            }
                        }
                        if (pt == 'A' && frm.toDate.getYear() - frm.fromDate.getYear() > 3){
                            fnMsg("Debe seleccionar un rango no mayor a 3 años", "Rango de fechas")
                            return false;
                        }
                        return true;
                    }
                }
            },
            container:{
                url:'/medicalCentral/app/dashboard/portfolioGrowth/body.html'
            }
        },
        specialityGrowth : {
            code: 'CRESPEC',
            title:'CRECIMIENTO POR ESPECIALIDAD',
            filterOptions: {
                onlyMonths: true,
                specialty : true,
                specialtyMultiple:true, 
                financial : true,
                contract : true,
                contractMultiple: true,
                selectAllSpecialities: true
            },
            customValidation:{
                rangeDate:{
                    func: function(frm, fnMsg){
                        var timeDiff = Math.abs(frm.toDate.getTime() - frm.fromDate.getTime());
                        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
                        var pt = frm.periodType.codigo;
                        if (pt == 'D' && diffDays>31){
                            fnMsg("Debe seleccionar un rango no mayor a 31 dias", "Rango de fechas")
                            return false;
                        }
                        if (pt == 'M'){
                            var months;
                            months = (frm.toDate.getFullYear() - frm.fromDate.getFullYear()) * 12;
                            months -= frm.fromDate.getMonth() + 1;
                            months += frm.toDate.getMonth();
                            if (months>12){
                                fnMsg("Debe seleccionar un rango no mayor a 12 meses", "Rango de fechas")
                                return false;    
                            }
                        }
                        if (pt == 'A' && frm.toDate.getYear() - frm.fromDate.getYear() > 3){
                            fnMsg("Debe seleccionar un rango no mayor a 3 años", "Rango de fechas")
                            return false;
                        }
                        return true;
                    }
                }
            },
            container:{
                url:'/medicalCentral/app/dashboard/specialityGrowth/body.html'
            }
        }
        })
      .factory('dataReportView', ['$injector','mModalAlert','dataProviderReport','$filter', '$state', 'oimProxyMedicalCenter',function($injector,mModalAlert, dataProviderReport, $filter, $state, oimProxyMedicalCenter){
        
        function getConverter (){
            try {
              return $injector.get($state.current.name + 'IConverterData');
            } catch (error) {
             
            }
          }
          function dataAdapter(filter, data){
            var converterData = getConverter();
            if (converterData)
              return converterData.dataAdapter(filter, data)
            return data;
          }
          function getCode (filter, codes){
            if (codes.length<=1)
              throw "add more than two report codes to infer"
              
              var converterData = getConverter();
              if (!converterData)
                throw "inject a factory "+   $state.current.name + 'IConverterData';
              
              return  converterData.inferCode(filter, codes);
          }
        
        function search(vm, $event)
        {
            var code = undefined;
          if (angular.isArray(vm.reportSettings.code)){
            code = getCode($event, vm.reportSettings.code)
          }else code = vm.reportSettings.code;
          dataProviderReport
          .search(code, $event)
          .then(function success(request) {
            vm.currentFilter = angular.extend({}, $event);
            
            vm.dataPanel = dataAdapter($event, request);
          }, function(){
            mModalAlert.showError("Ha ocurrido un error al momento de consultar los datos", "Consulta de datos");
          });
        }
        function download(vm){
            var requestFormat  = 'yyyy-MM-dd';
            var fDate = $filter('date');
            var data = vm.currentFilter; 
            var code = undefined;
            if (angular.isArray(vm.reportSettings.code)){
              code = getCode(vm.currentFilter, vm.reportSettings.code)
            }else code = vm.reportSettings.code;

            var speci, categor, contrato;
            if (angular.isArray(data.specialties) && data.specialties.length>0){
                var v=[]
                for (var index = 0; index < data.specialties.length; index++) {
                    var element = data.specialties[index];
                    v.push(element.codigo)               
                }
                speci = v.join(",");
            } else {
                speci = data.specialty ? (data.specialty.codigo || '99999'): '99999';
            }
            if (angular.isArray(data.contractCategories) && data.contractCategories.length>0){
                var v=[]
                for (var index = 0; index < data.contractCategories.length; index++) {
                    var element = data.contractCategories[index];
                    v.push(element.codigo)               
                }
                categor = v.join(",");
            } else {
                categor = data.contractCategory ? data.contractCategory.codigo : '';
            }
            if (angular.isArray(data.contracts) && data.contracts.length>0){
                var v=[]
                for (var index = 0; index < data.contracts.length; index++) {
                    var element = data.contracts[index];
                    v.push(element.codigo)               
                }
                contrato = v.join(",");
            } else {
                contrato = data.contracts ? (data.contracts.codigo || '99999') : '99999';
            }
  
            var url = helper.formatNamed('api/panel/$download/{codeReport}?sede={sede}&typePeriod={typePeriod}&specialty={specialty}&toDate={toDate}&fromDate={fromDate}&detailType={detailType}&codeFinancial={codeFinancial}&contractNumber={contractNumber}&providers={providers}&contractCategory={contractCategory}',
            { 'codeReport':code,
              'sede':data.sede.codigo || '0',
              'typePeriod':data.periodType ? (data.periodType.codigo || ''):'',
              'specialty': speci,
              'toDate':fDate(data.toDate, requestFormat),
              'fromDate':fDate(data.fromDate, requestFormat),
              'detailType':data.detailType ? data.detailType.codigo || '':'',
              'codeFinancial':data.financial ? data.financial.codigo || '99':'99',
              'contractNumber':contrato,
              'providers':data.providers ? data.providers || '':'',
              'contractCategory': categor
            });
            window.open(oimProxyMedicalCenter.endpoint + url, "_blank");
         }
        return {
            search:search,
            download:download
        }
      }])
      .factory('dataReportViewWeb', ['mModalAlert','dataProviderReport', '$filter','oimProxyMedicalCenter',function(mModalAlert,dataProviderReport, $filter,oimProxyMedicalCenter){
        function search(vm, $event){ 
            dataProviderReport
            .searchWeb(vm.reportSettings.code, $event)
            .then(function(response){
                vm.currentFilter = angular.extend({}, $event);
                vm.dataPanel =response||response.data;
            }, function(){
                mModalAlert.showError("Ha ocurrido un error al momento de consultar los datos", "Consulta de datos");
              });
        }
        function download(vm)
        {
            var data = vm.currentFilter;
            var requestFormat  = 'yyyy-MM-dd';
            var fDate = $filter('date');
            
            var f = {
                sede : data.sede ? data.sede.codigo || '':'',
                storage: data.storage ? data.storage.codigo || '':'',
                toDate: fDate(data.toDate, requestFormat),
                fromDate: fDate(data.fromDate, requestFormat),
                movementType: data.movementType,
                movement: data.movement ? data.movement.codigo || '':'',
                images: vm.images
            }
            
            $("<form>")
            .prop("method", "POST")
            .prop("target", "_blank")
            .prop("action",oimProxyMedicalCenter.endpoint+"api/panel/$downloadweb/"+ vm.reportSettings.code)
            .hide()
            .append($("<input type='hidden' name='json'>").val(JSON.stringify(f)))
            .appendTo('body')
            .submit()
            ;
            
        }
        return {
            search:search,
            download:download
        } 
      }]);  
  });
      
    