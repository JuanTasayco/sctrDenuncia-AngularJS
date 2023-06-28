define([
    'angular',
    'generalConstants'
  ], function(ng, generalConstants) {
  
    ModalDenunciasController.$inject = ['$scope', '$state', '$stateParams', '$rootScope', '$timeout', 'mModalAlert', 'mModalConfirm', 'cgwFactory'];
  
    function ModalDenunciasController($scope, $state, $stateParams, $rootScope, $timeout, mModalAlert, mModalConfirm, cgwFactory) {
      var vm = this;

      var largomaximo = 50;
      var mainArgs = {};

      $scope.inputModel = 'hover';
      $scope.showBack = false;

      $scope.dynamicPopover = {
        templateUrl: 'denunciaRelatoTooltipPlantilla.html',
      };

      vm.pageChanged = pageChanged;
      vm.truncText = truncText;
      vm.$onInit = onInit;
      vm.redirectToStep1 = redirectToStep1;

      vm.continueVip = continueVip;

      vm.pagination = {
        maxSize: 5,
        sizePerPage: 3,
        currentPage: 1,
        totalRecords: 0
      };

      function onInit() {
        pageChanged();
        validateMsgClientVIP();
        showButtonBack();
      }

      function redirectToStep1() {
        $state.go('.', {step: 1, id: $stateParams.id});
      }

      function pageChanged(currentPage) {
        mainArgs.currentPage = currentPage || vm.pagination.currentPage;
        mainArgs.pageSize = vm.pagination.sizePerPage;
        var lComplaints = searchCompaints(mainArgs);
        if(lComplaints) {
          vm.localComplaints = JSON.parse(JSON.stringify(lComplaints))
        }
      }

      function validateMsgClientVIP() {
        if(vm.data.isClientVIP) {
          vm.msgSectionVIP = "El cliente esta registrado como Cliente VIP, puede continuar con el registro de la carta sin seleccionar una denuncia."
        } else {
          if(!vm.data.newProcess) {
            vm.showSectionVIP = true;
            vm.msgSectionVIP = "A partir de la fecha " + vm.data.stringBrakeDate + " será obligatorio registrar una denuncia antes de solicitar una carta de garantía"
          }
        }
      }

      function showButtonBack() {
        // $scope.showBack = vm.data.complaints.filter(function(o) {
        //   return (o.status.code === generalConstants.complaint.status.approved || o.status.code === generalConstants.complaint.status.inProcess);
        // }).length === 0;
        $scope.showBack = true;
      }

      function searchCompaints(params) {
        var filter = null;
        if(vm.data.complaints) {
          var virtualComplaints = JSON.parse(JSON.stringify(vm.data.complaints));
          vm.pagination.totalRecords = virtualComplaints.length;
          filter = paginate(virtualComplaints, params.pageSize, params.currentPage);
          vm.pagination.pageCont = Math.ceil(vm.pagination.totalRecords/params.pageSize);
          if(filter.length === 1) {
            filter[0].placement = 'left';
          } else {
            angular.forEach(filter, function(item, idx) {
              item.placement = (filter.length >= 3 ? 'auto' : (idx === 0 ? 'left' : 'auto'));
            });
          }
          return filter;
        }
      }

      function paginate(array, pageSize, pageNumber) {
        return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
      }

      function continueVip() {
        $timeout(function(){
           vm.close();
        }, 500);
      }

      $scope.selectComplaint = function(complaint) {
        complaint.benefit = complaint.benefit || {};
        var isHospitable = (complaint.benefit.code == generalConstants.benefits.hospitable.id);
        
        if(isHospitable) {
          evaluateComplaintHospitable(complaint);
        } else {
          evaluateComplaintNotHospitable(complaint);
        }
      }

      function evaluateComplaintHospitable(complaint) {
        switch(complaint.status.code) {
          case generalConstants.complaint.status.approved:
          case generalConstants.complaint.status.inProcess:
          case generalConstants.complaint.status.finalized: {
            showConfirmComplaint(complaint);
          }; break;
          case generalConstants.complaint.status.rejected: {
            showWarningComplaint(complaint, 'rechazada');
          }; break;
        }
      }

      function evaluateComplaintNotHospitable(complaint) {
        switch(complaint.status.code) {
          case generalConstants.complaint.status.approved: {
            showConfirmComplaint(complaint);
          }; break;
          case generalConstants.complaint.status.rejected: {
            showWarningComplaint(complaint, 'rechazada');
          }; break;
          case generalConstants.complaint.status.finalized: {
            showWarningComplaint(complaint, 'finalizado');
          }; break;
        }
      }

      function showConfirmComplaint(complaint) {
        var title = 'Fecha de ocurrencia: ' + cgwFactory.formatearFecha(new Date(complaint.incidenceDate));
        var msg = '¿Estás seguro de continuar con el registro?';

        mModalConfirm.confirmWarning(msg, title, 'Aceptar')
        .then(function (response) {
          vm.complaint = complaint;
    
          $timeout(function(){
            vm.close();
          }, 500);
        }, function (error) { });
      }

      function showWarningComplaint(complaint, statusName) {
        var title = 'No puedes continuar con el registro de la carta de garantía';
        var desc = (statusName === 'rechazada' ? complaint.rejection.description : complaint.finalized.description);
        var msg = 'La denuncia No. ' + complaint.complaintYear + '-' + complaint.complaintNumber + ' se encuentra ' + statusName + ' por ' + desc;

        mModalAlert.showWarning(msg, title);
      }

      function truncText (text) {
        if(text.length > largomaximo) {
          return text.substr(0, largomaximo) + '...';
        } else {
          return text;
        }
      }
    }
  
    return ng.module('appCgw')
      .controller('ModalDenunciasController', ModalDenunciasController)
      .component('mpfModalDenuncias', {
        templateUrl: '/cgw/app/solicitudCG/component/modalDenuncias.html',
        controller: 'ModalDenunciasController',
        bindings: {
          data: '=',
          close: '&',
          complaint: '='
        }
      });
  });
  