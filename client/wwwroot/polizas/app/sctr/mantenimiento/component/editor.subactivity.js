(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, 'sctrMngEditorSubActivity', ['angular', 'system'],
  function(angular, system) {

    angular.module('appAutos')
      .controller('sctrMngEditorSubActivityController', ['proxySctr', function(proxySctr) {
        var vm = this;
        vm.close = close;


        vm.saveSubActivity = function(){
          
          if (!vm.subActivity.IdSubactividad){
            proxySctr.CreateSubactividad(vm.subActivity, true). then(function(){
              vm.onClose({$event: {success:true}} );
            });
          }
          else{
            
            proxySctr.UpdateSubactividad(vm.subActivity, true). then(function(){
              vm.onClose({$event: {success:true}});    
            });
          }
          
        }
        vm.close =  close;
        function close(){
          vm.onClose({});
        }
      }])
      .component('sctrMngEditorSubActivity', {
        templateUrl: '/polizas/app/sctr/mantenimiento/component/editor.subactivity.html',
        controller: 'sctrMngEditorSubActivityController',
        bindings: {
          onClose :"&?",
          subActivity:"=?"
        }
      })
  });