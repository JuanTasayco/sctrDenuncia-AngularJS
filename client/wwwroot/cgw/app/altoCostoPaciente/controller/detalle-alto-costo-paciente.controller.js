define(['angular', '/cgw/app/factory/cgwFactory.js',
  ], function(ng) {
  
    detalleAltoCostoPacienteController.$inject = ['$scope', 'cgwFactory', '$stateParams', 'mModalAlert'];
  
    function detalleAltoCostoPacienteController($scope, cgwFactory, $stateParams, mModalAlert) {

      (function onLoad() {
        $scope.noResult = true;

        $scope.companyId = $stateParams.cia;

        $scope.paramsSearch = {
          CompanyId: $stateParams.cia,
          AffiliateNumber: $stateParams.afiliado,
          ContractNumber: $stateParams.contrato,
          PlanCode: $stateParams.plan
        }
        
        cgwFactory.detalleAltoCostoPaciente($scope.paramsSearch).then(function (response) {
          if(response.operationCode == 200){
            if (response.data) {
              if (response.data.items.length > 0) {
                $scope.resultados = response.data.items;
                $scope.noResult = false;
              } else {
                $scope.resultados = [];
                $scope.noResult = true;
              }
            }
          } else {
            mModalAlert.showError('Hubo un error en la consulta', 'Error');
          }
        });
      })();

    } //  end controller
  
    return ng.module('appCgw')
      .controller('DetalleAltoCostoPacienteController', detalleAltoCostoPacienteController);
  });
  