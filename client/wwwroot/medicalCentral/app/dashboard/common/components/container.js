(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'mcReportContainer', ['angular','lodash', 'system'],
    function(angular, _, system) {
      angular.module('medicalCenter.app')
      .controller('mcReportContainerController', ['$injector', function($injector){
        var vm = this;
        vm.$onInit = onInit;
        vm.handlerSearch = handlerSearch;
        vm.handlerClean = handlerClean;
        
        vm.descargarReporte = descargarReporte;
        vm.rederedImage = rederedImage;
        vm.images = []
        function onInit() {
           
        }
        function handlerClean(){
          
           vm.dataPanel = undefined;
           vm.currentFilter = null;
        }
        function rederedImage($event){
          
          vm.images.push($event.imagecontent);
        }
        function descargarReporte() {
          var dataReportView = $injector.get('dataReportView' + (vm.reportSettings.resolverDataType || ''))
          dataReportView.download(vm)
          /*var requestFormat  = 'yyyy-MM-dd';
          var fDate = $filter('date');
          var data = vm.currentFilter; 
          var code = undefined;
          if (angular.isArray(vm.reportSettings.code)){
            code = getCode(vm.currentFilter, vm.reportSettings.code)
          }else code = vm.reportSettings.code;

          var url = helper.formatNamed('api/panel/$download/{codeReport}?sede={sede}&typePeriod={typePeriod}&specialty={specialty}&toDate={toDate}&fromDate={fromDate}&detailType={detailType}&codeFinancial={codeFinancial}&contractNumber={contractNumber}&providers={providers}',
          { 'codeReport':code,
            'sede':data.sede.codigo || '0',
            'typePeriod':data.periodType ? (data.periodType.codigo || ''):'',
            'specialty':data.specialty ? (data.specialty.codigo || '99999'): '99999',
            'toDate':fDate(data.toDate, requestFormat),
            'fromDate':fDate(data.fromDate, requestFormat),
            'detailType':data.detailType ? data.detailType.codigo || '':'',
            'codeFinancial':data.financial ? data.financial.codigo || '99':'99',
            'contractNumber':data.contractNumber ? data.contractNumber.codigo || '99999':'99999',
            'providers':data.providers ? data.providers || '':''   });
          window.open(oimProxyMedicalCenter.endpoint + url, "_blank");*/
        }

        function handlerSearch($event){
          var dataReportView = $injector.get('dataReportView' + (vm.reportSettings.resolverDataType || ''))
          dataReportView.search(vm, $event)
          /*var code = undefined;
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
          });*/
        }
        /*
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
        */
      }])
      .component('mcReportContainer', {
        templateUrl: system.pathAppBase('/dashboard/common/components/container.html'),
        controller: 'mcReportContainerController',
        bindings: {
          reportSettings : "="
        }
      });
    });