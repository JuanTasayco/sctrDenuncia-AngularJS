(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', '/polizas/app/soat/emit/service/soatFactory.js', '/polizas/app/soat/restriction/service/restrictionService.js'],
  function(angular, constants){
    var appSoat = angular.module('appSoat');

    appSoat.controller('soatRestrictionController', ['$scope', '$state', '$uibModal', 'mModalAlert', 'mModalConfirm', 'soatFactory', 'restrictionService',
      function($scope, $state, $uibModal, mModalAlert, mModalConfirm, soatFactory, restrictionService){
        var vm = this;

        vm.pagination = {
          currentPage: 1,
          maxSize: 10,
          totalItems: 0,
          items: [],
          noSearch: true,
          noResult: false
        };

        vm.parametros = {};
        vm.messages = [];

        vm.buscarRestricciones = BuscarRestricciones;
        vm.limpiarResultados = LimpiarResultados;
        vm.pageChanged = PageChanged;
        vm.nuevaRestriccion = NuevaRestriccion;
        vm.showMessagesModal = ShowMessagesModal;
        vm.accionItem = AccionItem;

        (function onLoad(){
        })();

        function BuscarRestricciones(filtros) {
          vm.limpiarResultados();
          _setRequestBuscarRestricciones(filtros);
          _buscarRestricciones();
        }
    
        function PageChanged(currentPage) {
          vm.parametros.PaginaActual = currentPage;
          _buscarRestricciones();
        }

        function LimpiarResultados() {
          vm.pagination = {
            currentPage: 1,
            maxSize: 10,
            totalItems: 0,
            items: [],
            noSearch: true,
            noResult: false
          };
        }
    
        function _buscarRestricciones() {
          soatFactory.listarRestricciones(vm.parametros, true).then(function (response) {
            if(response.status !== 200) {
              vm.pagination.totalItems = 0;
              vm.pagination.noSearch = true;
              vm.pagination.noResult = false;
              vm.pagination.items = [];

              mModalAlert.showError('Hubo un problema en la búsqueda', 'Restricciones');
              return;
            }

            vm.pagination.totalItems = parseInt(response.data.numberItems);
            vm.pagination.items = response.data.restrictions;
            vm.pagination.noSearch = false;
            vm.pagination.noResult = response.data.numberItems === 0;
          });
        }
    
        function _setRequestBuscarRestricciones(filtros) {
          console.log(filtros);
          vm.parametros = {
            agent: soatFactory.getValueString(filtros, 'agente'),
            user: soatFactory.getValueString(filtros, 'usuario'),
            vehicleType: soatFactory.getValueString(filtros, 'tipoVehiculo'),
            items: vm.pagination.maxSize,
            pages: vm.pagination.currentPage
          };
        }
    
        // Funcion que redirige a formulario de nueva restriccion
        function NuevaRestriccion() {
          $state.go('soatNewRestriccion');
        }

        // Funcion que muestra editor de mensajes
        function ShowMessagesModal() {
          $uibModal.open({
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: 'md',
            templateUrl : '/polizas/app/soat/restriction/popup/controller/popupMensajes.html',
            controller : ['$scope', '$uibModalInstance', 'soatFactory', 'mModalAlert',
              function($scope, $uibModalInstance, soatFactory, mModalAlert) {
                $scope.messages = [];

                $scope.loadMessage = function () {
                  soatFactory.listarMensajes(true).then(function (response) {
                    if(response.status === 200) {
                      $scope.messages = response.data;
                    }
                  });
                }
    
                $scope.closeModal = function () {
                  $uibModalInstance.close();
                };
    
                $scope.guardar = function () {
                  if (!$scope.formMensajes.$valid) {
                    $scope.formMensajes.markAsPristine();
                    mModalAlert.showError('Verifique que los datos estén correctos.', 'Mensajes Restricción Corredor');
                    return;
                  }
    
                  var request = {
                    data: []
                  };

                  $scope.messages.forEach(function(message) {
                    var item = {
                      messageId: message.messageId,
                      messageDescription: message.messageDescription
                    }

                    request.data.push(item);
                  });

                  var currentUser = JSON.parse(localStorage.getItem('profile')).username;

                  soatFactory.editarMensajes(request, currentUser, true).then(function(response) {
                    if(response.status !== 200) {
                      mModalAlert.showError(response.message, 'Mensajes Restricción Corredor');
                      return;
                    }

                    $uibModalInstance.close();
                  });
                };

                $scope.loadMessage();
              }
            ]
          });
        }

        // Funcion de accion para un item del listado
        function AccionItem(event) {
          if(event.evento === 'eliminar'){
            EliminarRestriccion(event.restriccion);
          } 
          
          if(event.evento === 'editar'){
            restrictionService.setRestriction(event.restriccion);
            $state.go('soatEditRestriccion', {restrictionId : event.restriccion.restrictionId});
          }
        }

        // Funcion para mostrar modal de confirmacion al eliminar restriccion
        function EliminarRestriccion(restriction) {
          mModalConfirm.confirmInfo('¿Esta seguro que desea eliminar el registro?','Eliminar', 'Eliminar').then(function(response){
            if (response) {
              var parameter = {
                restrictionId: restriction.restrictionId,
                agentId: restriction.agentId,
                userId: restriction.userId,
                vehicleTypeId: restriction.vehicleTypeId,
                modificationUser: JSON.parse(localStorage.getItem('profile')).username
              };

              soatFactory.eliminarRestriccion(parameter, true).then(function(response) {
                if(response.status !== 200) {
                  mModalAlert.showError(response.message, 'Restricciones');
                }

              vm.limpiarResultados();
              _buscarRestricciones();
              });
            }
          });
        }
    }]);
  }
);
