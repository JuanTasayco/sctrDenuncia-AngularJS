'use strict';

define(['angular', 'constants', 'constantsPericial', 'helper', 'pericialFactory'], function(
  angular,
  constants, constantsPericial) {

  NuevoRegistroController.$inject = [
    '$scope', '$window', '$state', '$stateParams', '$timeout', 'mainServices', '$uibModal', 'mModalAlert', 'mModalConfirm', 'pericialFactory', 'proxyAutomovil'
  ];

  function NuevoRegistroController(
    $scope, $window, $state, $stateParams, $timeout, mainServices, $uibModal, mModalAlert, mModalConfirm, pericialFactory, proxyAutomovil
  ) {
      var vm = this;

      vm.$onInit = function() {
        vm.mTipoRegistro = parseInt($stateParams.idTipoRegistro);
        vm.dataUser = JSON.parse(localStorage.getItem('evoProfile'));

        pericialFactory.general.GetListParameterDetail().then(function(response) {
          if (response.operationCode === constants.operationCode.success) {
            vm.vehiculoData = response.data;
          }
        })
          .catch(function(err){
            mModalAlert.showError(err.data.message, 'Error');
          });

        pericialFactory.general.getTipoVehiculo().then(function(response) {
          if (response.OperationCode === constants.operationCode.success) {
            vm.tipoVehiculo = response.Data;
          }
        }).catch(function(err){
          mModalAlert.showError(err.data.message, 'Error');
        });

        vm.status = {
          isopen: false
        };
      };

      function searchMarcaModelo(wilcar) {
      if (wilcar && wilcar.length>=3) {
          //cargamos las marcas y modelos
          var paramMarcaModelo = {
            CodigoTipo: (vm.vehicleData.mTipoVehiculo.CodigoTipo) ? vm.vehicleData.mTipoVehiculo.CodigoTipo : 1,
            Texto : wilcar.toUpperCase()
          };
          return proxyAutomovil.GetListMarcaModelo(paramMarcaModelo);
        }
      }

      function backToHome() {
        pericialFactory.general.stateGo('dashboard');
      }

      function selectedItem(item) {
        vm.vehiculo = item;
        vm.textItem = item.sinisterNumber + '-' + item.causeOfDamage + '-' + item.fileType + '-' + item.fileNumber;

        vm.mPlaca = (item.plateNumber) ? item.plateNumber.trim() : undefined;
        vm.vehicleData.mMotor = (item.engineNumber) ? item.engineNumber.trim() : undefined;
        vm.vehicleData.mSerie = (item.serialNumber) ? item.serialNumber.trim() : undefined;
        vm.vehicleData.idBrand = item.idBrand;
        vm.vehicleData.idModel = item.idModel;

        if (item.yearVehicle) {
          vm.vehiculoAnhoData = [{Codigo: item.yearVehicle, Descripcion: item.yearVehicle}];
          vm.vehicleData.mVehiculoAnho = {Codigo: item.yearVehicle, Descripcion: item.yearVehicle};
        }
        vm.vehicleData.mTipoVehiculo = {
          CodigoTipo: item.idTypeVehicle,
          NombreTipo: item.typeVehicle
        };
        vm.vehicleData.tipoExpediente = item.fileType;
        vm.vehicleData.sinisterNumber = item.sinisterNumber;
        vm.vehicleData.fileType = item.fileType;

        vm.mNroExpediente = item.fileNumber;
        vm.mNroSiniestro = item.sinisterNumber;

        if(item.brand && item.model) {
          vm.vehicleData.mMarcaModelo = item.brand + ' ' + item.model;
          vm.vehicleData.mMarcaModelo = {
            marcaModelo : item.brand + ' ' + item.model,
            codigoMarca : item.idBrand,
            nombreMarca : item.brand,
            codigoModelo : item.idModel,
            nombreModelo : item.model
          };
          vm.getFunctionsModeloMarca();
        }
      }

      function cleanRegistro() {
      vm.arraySiniester = [];
      vm.isData = false;
      vm.mNroExpediente = '';
      vm.mNroSiniestro = '';
      vm.vehicleData.mMarcaModelo = {};
    }

      function buscarVehiculo() {
        $scope.frmTypeVehicle.markAsPristine();
        if ($scope.frmTypeVehicle.$valid) {
          if (vm.mCaso && vm.mPlaca) {
            vm.paramsURL = '?numberCase=' + vm.mCaso + '&' + '?plateNumber=' + vm.mPlaca;
          } else {
            vm.paramsURL = (vm.mCaso) ? '?numberCase=' + vm.mCaso : (vm.mPlaca) ? '?plateNumber=' + vm.mPlaca : '';
          }

          pericialFactory.general.getData('api/sinister/search/', vm.mVehiculo.idParameterDetail + '/' + vm.paramsURL).then(function(response) {
            if (response.operationCode === 200) {
              vm.showOptions = true;
              vm.vehicleData = {};
              vm.dataSiniester = response.data;
              if(response.data.length>0) {
                vm.arraySiniester = response.data;
                vm.isData = true;
                if (vm.arraySiniester.length === 1) {
                  selectedItem(vm.arraySiniester[0]);
                }
              } else {
                cleanRegistro();
              }
            }
          })
            .catch(function(err){
              cleanRegistro();
              mModalAlert.showError(err.data.message, 'Error');
            });
        }
      }

      function nuevoRegistro() {
        $scope.frmTypeVehicle.markAsPristine();
        $scope.frmNewRegistro.markAsPristine();

        if ($scope.frmTypeVehicle.$valid && $scope.frmNewRegistro.$valid && (vm.mCaso || vm.mPlaca)){
          vm.paramsRegister = {
              sinisterNumber: (vm.vehicleData.sinisterNumber) ? vm.vehicleData.sinisterNumber : '',
              idSinister: 0,
              idSinisterDetail: (vm.mNroSiniestro) ? vm.mNroSiniestro : '',
              caseNumber: (vm.mCaso) ? vm.mCaso.toUpperCase() : '',
              plateNumber: (vm.mPlaca) ? vm.mPlaca.toUpperCase() : '',
              engineNumber: vm.vehicleData.mMotor.toUpperCase(),
              serialNumber: vm.vehicleData.mSerie.toUpperCase(),
              IdTypeInsured: vm.mVehiculo.idParameterDetail,
              IdTypeVehicle: vm.vehicleData.mTipoVehiculo.CodigoTipo,
              idBrand: vm.vehicleData.mMarcaModelo.codigoMarca,
              idModel: vm.vehicleData.mMarcaModelo.codigoModelo,
              yearVehicle: vm.vehicleData.mVehiculoAnho.Codigo,
              mileage: vm.vehicleData.mKilomActual,
              idRegisterType: vm.mTipoRegistro,
              clientName: vm.mNombre.toUpperCase(),
              clientLastname: vm.mApellidoPaterno.toUpperCase() + ' ' + vm.mApellidoMaterno.toUpperCase(),
              clientPhone: vm.mTelefono,
              clientEmail: (vm.mEmail) ? vm.mEmail.toUpperCase() : '',
              flagAgreeableClient: "",
              flagRegularizeSpare: "",
              descriptionDamage: (vm.mDescDanho) ? vm.mDescDanho.toUpperCase() : '',
              commentary: (vm.mComentario) ? vm.mComentario.toUpperCase() : '',
              idWorkshop: 2,
              idWorkshopContact: 0,
              fileType: (vm.vehicleData.fileType) ? vm.vehicleData.fileType : '',
              fileNumber: (vm.mNroExpediente) ? vm.mNroExpediente : 0,
              policyNumber: (vm.vehiculo && vm.vehiculo.policyNumber) ? vm.vehiculo.policyNumber : 0,
              inspectionNumber: (vm.vehiculo && vm.vehiculo.inspectionNumber) ? vm.vehiculo.inspectionNumber : 0,
              Notification:  {        
                "ruc": !vm.dataUser ? '' : (vm.dataUser.documentType === 'RUC' ? vm.dataUser.documentNumber : ''),
                "servicio": 'Taller',        
                "tipologia": !vm.vehiculo ? '' : (vm.vehiculo.fileType + ' - ' + vm.vehiculo.causeOfDamage),        
                "numero_servicio": !vm.vehiculo ? '' : (!vm.vehiculo.sinisterNumber ? '' : vm.vehiculo.sinisterNumber),        
                "dni": !vm.dataUser ? '' : (vm.dataUser.documentType === 'DNI' ? vm.dataUser.documentNumber : ''),
                "ordenServicio": ''
              }
            };

          mModalConfirm.confirmInfo("¿Está seguro que desea registrar el siguiente vehículo?", "NUEVO REGISTRO", "Registrar").
          then(function(r) {
            if (r){
              pericialFactory.siniester.Resource_Sinister_Add(vm.paramsRegister).then(function(response) {
                if (response.operationCode === 200) {
                  var extraMsg = !response.message ? '' : '<br> <b>' + response.message + '</b>'
                  mModalAlert.showSuccess("Vehículo registrado exitosamente. " + extraMsg, "Registrar").then(function(response) {
                    if (response) {
                      backToHome();
                    }
                  }).catch(function(err){
                    });
                }
              })
              .catch(function(err){
                mModalAlert.showError(err.data.message, 'Error');
              });
            } else {
              return;
            }
          })
          .catch(function(err){
          });

        } else if(!vm.mCaso || !vm.mPlaca){
          mModalAlert.showError("Ingrese caso y/o placa", 'Error');
        }
      }

      function getFunctionsModeloMarca() {
        if(vm.vehicleData.mMarcaModelo && vm.vehicleData.mMarcaModelo.codigoMarca && vm.vehicleData.mTipoVehiculo.CodigoTipo) {

          pericialFactory.general.GetListSubModelo(vm.vehicleData.mTipoVehiculo.CodigoTipo, vm.vehicleData.mMarcaModelo.codigoMarca, vm.vehicleData.mMarcaModelo.codigoModelo).then(function (response) {
            if (response.OperationCode === constants.operationCode.success) {
              if (response.Data) {
                vm.submodelos = response.Data;
                if (vm.submodelos.length === 0) {
                  mModalAlert.showError("El vehículo configurado no esta configurado correctamente", 'Error');
                } else {
                  vm.mSubModelo = vm.submodelos[0];
                  pericialFactory.general.GetListAnoFabricacion(vm.vehicleData.mMarcaModelo.codigoMarca, vm.vehicleData.mMarcaModelo.codigoModelo, vm.mSubModelo.Codigo).then(function (response) {
                    if (response.OperationCode === constants.operationCode.success) {
                      vm.vehiculoAnhoData = response.Data;
                    }
                  }).catch(function (err) {
                    mModalAlert.showError(err.data.message, 'Error');
                  });
                }
              }
            }
          }).catch(function (err) {
            mModalAlert.showError(err.data.message, 'Error');
          });
        }
      }

      //methods
      vm.searchMarcaModelo = searchMarcaModelo;
      vm.backToHome = backToHome;
      vm.selectedItem = selectedItem;
      vm.buscarVehiculo = buscarVehiculo;
      vm.nuevoRegistro = nuevoRegistro;
      vm.getFunctionsModeloMarca = getFunctionsModeloMarca;
    } // end

  return angular.module('appPericial')
    .controller('NuevoRegistroController', NuevoRegistroController)
});
