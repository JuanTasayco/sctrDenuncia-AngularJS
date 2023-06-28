(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'helper',
  '/restos/app/mainControls/services/ubigeo-service.js',
    '/restos/app/mainControls/services/vehicleLocation-service.js',
    '/restos/app/mainControls/services/parameters-service.js',
    '/restos/app/mainControls/services/vehicleBrand-service.js',
    '/restos/app/newRequest/services/newRequest-service.js'],
  function(angular, constants, helper){

    var appRestos = angular.module('appRestos');

    appRestos.controller('newRequestController', ['$scope', '$window', '$state', '$timeout', '$uibModal', 'mModalAlert',
      'mainServices', 'ubigeoService', 'vehicleLocationService', 'parametersService', 'vehicleBrandService',
      'newRequestService', 'params',
      function($scope, $window, $state, $timeout, $uibModal, mModalAlert,
               mainServices, ubigeoService, vehicleLocationService, parametersService, vehicleBrandService,
               newRequestService, params) {

        $scope.currentStep = $state.params.step;
        var maxStepAllowed = 1;

        if ($scope.currentStep !== 1) {
          $scope.currentStep = 1;
          $state.go('newRequest.step1');
        }

        $scope.request = {};

        $scope.params = params;

        $scope.dateFormat = 'dd/MM/yyyy';
        var today = new Date();
        var maxDate =  new Date(today.getFullYear()-18, today.getMonth(), today.getDate());
        $scope.rFEC_NACIMIENTO_options = {
          datepickerMode: 'year',
          initDate: maxDate,
          maxDate: maxDate
        };

        $scope.params.positions = null;
        $scope.getFreePositions = function(location) {
          $scope.positions = null;
          $scope.request.CPSCN = null;
          vehicleLocationService.getFreePositions(location).then(function(res) {
            $scope.params.positions = res.Resultado;
          });
        };


        // Ubigeo
        $scope.params.provincias_1 = null;
        $scope.params.distritos_1 = null;
        $scope.params.provincias_2 = null;
        $scope.params.distritos_2 = null;

        $scope.getProvincias = function(departamento, step) {
          $scope.params['provincias_' + step] = null;
          $scope.params['distritos_' + step] = null;
          $scope.request['COD_PRVNCIA_' + step] = null;
          $scope.request['COD_DSTRTO_' + step] = null;
          ubigeoService.getProvincias(departamento).then(function(res) {
            $scope.params['provincias_' + step] = res.Data;
          });
        };

        $scope.getDistritos = function(provincia, step) {
          $scope.params['distritos_' + step] = null;
          $scope.request['COD_DSTRTO_' + step] = null;
          ubigeoService.getDistritos(provincia).then(function(res) {
            $scope.params['distritos_' + step] = res.Data;
          });
        };


        // Modelos
        $scope.params.carModels = null;
        $scope.getCarModels = function(brand) {
          $scope.params.carModels = null;
          $scope.params.carSubmodels = null;
          $scope.request.COD_MDLO = null;
          $scope.request.COD_SB_MDLO = null;
          $scope.request.COD_SB_MDLO_des = null;
          $scope.request.TIP_VEH = null;
          // $scope.TIP_VEH_des = null;
          vehicleBrandService.getModels(brand).then(function(res) {
            $scope.params.carModels = res.Data;
          });
        };


        // Submodelos
        /*
        $scope.params.carSubmodels = null;
        $scope.getCarSubmodels = function(brand, model) {
          $scope.params.carSubmodels = null;
          $scope.request.COD_SB_MDLO = null;
          $scope.request.TIP_VEH = null;
          $scope.TIP_VEH_des = null;
          vehicleBrandService.getSubmodels(brand, model).then(function(res) {
            $scope.params.carSubmodels = res.Data;
          });
        };
        */

        // Submodelo
        $scope.request.COD_SB_MDLO = null;
        $scope.COD_SB_MDLO_des = null;
        $scope.getCarSubmodel = function(brand, model, type) {
          $scope.request.COD_SB_MDLO = null;
          $scope.COD_SB_MDLO_des = null;
          if (brand && model && type) {
            vehicleBrandService.getSubmodel(brand, model, type).then(function(res) {
              if (res.COD === 400) {
                $scope.COD_SB_MDLO_des = res.MSJ;
              } else if(res.COD === 200) {
                $scope.request.COD_SB_MDLO = res.Resultado.Codigo;
                $scope.COD_SB_MDLO_des = res.Resultado.Nombre;  
              }
              
            });
          }
        }


        // Tipos de vehículo
        /*
        $scope.request.TIP_VEH = null;
        $scope.TIP_VEH_des = null;
        $scope.getCarTypes = function(brand, model, submodel) {
          $scope.request.TIP_VEH = null;
          $scope.TIP_VEH_des = null;
          vehicleBrandService.getTypes(brand, model, submodel).then(function(res) {
            $scope.request.TIP_VEH = res.Data.CodigoTipo;
            $scope.TIP_VEH_des = res.Data.NombreTipo;
          });
        };
        */


        // Validación tipo documento
        $scope.docPattern = /^.*$/;
        $scope.setDocPattern = function(docType) {
          switch (docType) {
            case 'DNI':
              $scope.docPattern = /^\d{8}$/;
              break;
            case 'CEX':
              $scope.docPattern = /^\d{9}$/;
              break;
            case 'RUC':
              $scope.docPattern = /^\d{11}$/;
              break;
            default:
              $scope.docPattern = /^.*$/;
              break;
          }
        };

        $scope.searchMechanic = function(input) {
          return newRequestService.searchMechanic(input);
        };

        $scope.submit = function() {
          if ($scope.currentStep < 4) {
            $scope.currentStep++;
            nextStep();
          } else {
            $scope.showModalCrearSolicitud();
          }
        };

        $scope.toStep = function(step) {
          if (step > maxStepAllowed) {
            return;
          }
          $scope.currentStep = step;
          nextStep();
        };

        function nextStep() {
          $state.go('newRequest.step' + $scope.currentStep, {notify: false}).then(function(state) {
            if (maxStepAllowed < state.params.step) {
              maxStepAllowed = state.params.step;
            }
          });
        };

        $scope.showModalCrearSolicitud = function(){
          $uibModal.open({
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: 'md',
            templateUrl : 'newRequestConfirmation.html',
            controller : ['$scope', '$uibModalInstance', '$uibModal', '$timeout', '$log',
              function($scope, $uibModalInstance, $uibModal, $timeout, $log) {
                $scope.closeModal = function () {
                  $uibModalInstance.close();
                };
                $scope.crearSolicitud = function(){
                  $scope.closeModal();

                  if ($scope.request.TALLER) {
                    $scope.request.COD_TALLER = $scope.request.TALLER.CODIGO;
                    if ($scope.request.COD_TALLER == 9999) {
                      $scope.request.TALLER = $scope.request.TALLER.NOMBRE_OTRO;
                    } else {
                      $scope.request.TALLER = $scope.request.TALLER.NOMBRE;
                    }
                  }

                  newRequestService.save($scope.request).then(function(res) {
                    $uibModalInstance.close();
                    if(res.COD === 200) {
                      $log.info(res.MSJ);
                      mModalAlert.showSuccess(res.MSJ, '').then(function() {
                        $state.go('details.generalData', {solicitud: res.Resultado});
                      });
                    } else if(res.COD === 400) {
                      $log.info('Ups! Algo fue mal');
                      mModalAlert.showError(res.MSJ, '');
                    }
                  });
                };
              }]
          });
        };

      }]);

    appRestos.factory('newRequestFactory', ['$q', 'parametersService', 'vehicleLocationService', 'ubigeoService',
      'vehicleBrandService',
      function($q, parametersService, vehicleLocationService, ubigeoService,
               vehicleBrandService) {
      var params;

      function getParams() {
        var deferred = $q.defer();

        $q.all([

          vehicleLocationService.getFreeLocations(),
          parametersService.getDamageTypes(),
          parametersService.getOrigins(),
          ubigeoService.getDepartamentos(),
          parametersService.getIdTypes(),
          parametersService.getMaritalStatus(),
          parametersService.getGenders(),
          parametersService.getEngineTypes(),
          vehicleBrandService.getBrands(),
          vehicleBrandService.getTypes(),
          parametersService.getTransmissionTypes(),
          parametersService.getColors(),
          parametersService.getWheelDriveTypes(),
          parametersService.getSteeringWheelTypes(),
          parametersService.getCurrencies()

        ]).then(function(res) {

          params = {
            freeLocations:      res[0].Resultado,
            damageTypes:        res[1].Resultado,
            origins:            res[2].Resultado,
            departamentos:      res[3].Data,
            idTypes:            res[4].Resultado,
            maritalStatus:      res[5].Resultado,
            genders:            res[6].Resultado,
            engineTypes:        res[7].Resultado,
            carBrands:          res[8].Data,
            carTypes:           res[9].Data,
            transmissionTypes:  res[10].Resultado,
            colors:             res[11].Resultado,
            wheelDriveTypes:    res[12].Resultado,
            steeringWheelTypes: res[13].Resultado,
            currencies:         res[14].Resultado
          };

          deferred.resolve(params);

        }, function(err) {
          deferred.reject(err);
        });

        return deferred.promise;
      }

      return {
        getParams: function() {
          if (params) {
            return $q.resolve(params);
          }
          return getParams();
        }
      };
    }]);

  });
