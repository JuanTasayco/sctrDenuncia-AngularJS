(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'helper'],
  function(angular, constants, helper){

    var appNsctr = angular.module('appMaqueta');

    appNsctr.controller('maquetaController',
      ['$scope', '$window', '$state', '$timeout', 'mainServices', '$uibModal', 'mModalAlert', 'mModalConfirm',
        function($scope, $window, $state, $timeout, mainServices, $uibModal, mModalAlert, mModalConfirm){

          (function onLoad(){
            $scope.showRowFixedSection = true;  //sÃ³lo para ocultar el componente

          })();

          $scope.menuInspecciones = [
            {
              label: 'Solicitudes',
              objMXKey: 'SOLICITUDES|REGINS',
              state: 'solicitudes',
              isSubMenu: false,
              actived: false,
              show: true
            },
            {label: 'Cotizaciones', objMXKey: 'REGSOL|REGINS', state: 'cotizaciones', isSubMenu: false, actived: false, show: true},
            {label: 'Programaciones', objMXKey: 'PROGRAMACION', state: 'programaciones', isSubMenu: false, actived: false, show: true},
            {label: 'Agenda', objMXKey: 'AGENDA', state: 'agenda', isSubMenu: false, actived: false, show: true},
            {
              label: 'AdministraciÃ³n',
              objMXKey: 'ADMINISTRACION',
              state: 'administracion',
              isSubMenu: true,
              actived: false,
              show: true,
              menu: [
                {label: 'Automas', objMXKey: 'AUTOMAS', state: 'administracionAutomas', actived: false, show: true},
                {label: 'Proveedores', objMXKey: 'PROVEEDORES', state: 'administracionProveedores', actived: false, show: true},
                {
                  label: 'Reglas de asignaciÃ³n',
                  objMXKey: 'REGLAS ASIGNACION|REGLAS DE ASIGNACION',
                  state: 'administracionReglasAsignacion',
                  actived: false,
                  show: true
                },
                {
                  label: 'Coordinadores',
                  objMXKey: 'COORDINADOR|COORDINADORES',
                  state: 'administracionCoordinador',
                  actived: false,
                  show: true
                },
                {label: 'Inspectores', objMXKey: 'INSPECTOR|INSPECTORES', state: 'administracionInspectores', actived: false, show: true},
                {label: 'ParÃ¡metros', objMXKey: 'PARAMETROS', state: 'administracionParametro', actived: false, show: true}
              ]
            },
            {
              label: 'Reportes',
              objMXKey: 'REPORTES',
              state: 'reportes',
              isSubMenu: true,
              actived: false,
              show: true,
              menu: [
                {
                  label: 'GestiÃ³n de inspecciones',
                  objMXKey: 'GESTION DE INSPECCIONES|GESTION INSPECCIONES',
                  state: 'reportesGestionInspecciones',
                  actived: false,
                  show: true
                },
                {
                  label: 'GestiÃ³n de tiempos',
                  objMXKey: 'GESTION DE TIEMPOS|GESTION TIEMPOS',
                  state: 'reportesGestionTiempos',
                  actived: false,
                  show: true
                },
                {
                  label: 'GestiÃ³n por departamentos',
                  objMXKey: 'GESTION POR DEPARTAMENTOS|GESTION X DPTOS',
                  state: 'reportesGestionDepartamento',
                  actived: false,
                  show: true
                },
                {label: 'Detalle vehÃ­culos', objMXKey: 'DETALLE VEHICULOS', state: 'reportesDetalleVehiculo', actived: false, show: true},
                {label: 'Seguimiento', objMXKey: 'SEGUIMIENTO', state: 'reportesSeguimiento', actived: false, show: true},
                {label: 'Reporte de alertas', objMXKey: 'REPORTE DE ALERTAS', state: 'reportesDetalleAlerta', actived: false, show: true}
              ]
            },
            {label: 'Cotizaciones', objMXKey: 'REGSOL|REGINS', state: 'cotizaciones', isSubMenu: true, actived: false, show: true},
            {label: 'Programaciones', objMXKey: 'PROGRAMACION', state: 'programaciones', isSubMenu: true, actived: false, show: true}
          ];

          if ($scope.menuInspecciones.length < 7) {
            $scope.showMoreFlag = false;
            $scope.limiteMenus = 6;
          } else {
            $scope.showMoreFlag = true;
            $scope.limiteMenus = 5;
          }

          $scope.fnShowModal = function(){
            var vModalProof = $uibModal.open({
              backdrop: true, // background de fondo
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              size: 'md',
              templateUrl : 'tplModal.html',
              // template : '<mpf-modal-send-email action="action" data="emailData" close="close()"></mpf-modal-send-email>',
              controller : ['$scope', '$uibModalInstance', '$uibModal', '$timeout',
                function($scope, $uibModalInstance, $uibModal, $timeout) {
                  /*#########################
                                # closeModal
                                #########################*/
                  $scope.closeModal = function () {
                    // $uibModalInstance.dismiss('cancel');
                    $uibModalInstance.close();
                  };
                }]
            });
            vModalProof.result.then(function(){
              //Action after CloseButton Modal
              // console.log('closeButton');
            },function(){
              //Action after CancelButton Modal
              // console.log("CancelButton");
            });
          }
          $scope.fnShowAlert1 = eventSuccess;
          $scope.fnShowAlert2 = eventError;
          $scope.fnShowAlert3 = eventInfo;
          $scope.fnShowAlert4 = eventWarning;
          $scope.fnShowAlert5 = eventDanger;
          $scope.fnShowAlertConfirm1 = eventConfirmSuccess;
          $scope.fnShowAlertConfirm2 = eventConfirmError;
          $scope.fnShowAlertConfirm3 = eventConfirmInfo;
          $scope.fnShowAlertConfirm4 = eventConfirmWarning;
          $scope.fnShowAlertConfirm5 = eventConfirmDanger;
          $scope.fnShowAlertConfirm6 = eventConfirmQuestion;
          function eventSuccess() {
            var response = true;
            if (response) {
              mModalAlert.showSuccess('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.', 'Success title').then(function() {
                console.log('Ã‰xitoooo...');
              });
            }
          }
          function eventError() {
            var response = false;
            if (!response) {
              mModalAlert.showError('Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium', 'Error title').then(function(response){
                console.log('Fracasooo...');
              });
            }
          }
          function eventInfo(){
            mModalAlert.showInfo('Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.', 'Info title');
          }

          function eventWarning(){
            mModalAlert.showWarning('Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.', 'Info title');
          }

          function eventDanger(){
            mModalAlert.showDanger('Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.', 'Info title');
          }

          function eventConfirmSuccess() {
            var response = true;
            if (response) {
              mModalConfirm.confirmSuccess('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.', 'Success title').then(function() {
                console.log('Ã‰xitoooo...');
              });
            }
          }
          function eventConfirmError() {
            var response = false;
            if (!response) {
              mModalConfirm.confirmError('Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium', 'Error title').then(function(response){
                console.log('Fracasooo...');
              });
            }
          }
          function eventConfirmInfo(){
            mModalConfirm.confirmInfo('Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.', 'Info title');
          }
          function eventConfirmWarning(){
            mModalConfirm.confirmWarning('Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.', 'Info title');
          }
          function eventConfirmDanger(){
            mModalConfirm.confirmDanger('Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.', 'Info title');
          }
          function eventConfirmQuestion(){
            mModalConfirm.confirmQuestion('Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.', 'Info title');
          }
        }])
      .directive('mpfTabsFixed', ['$timeout','$window', function($timeout,$window){
        // Runs during compile
        return {
          restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
          link: function(scope, element, attrs) {
            // console.log('Directiva Tabs Fijos...', element);
            scope.widthWindow = $window.innerWidth; console.log(scope.widthWindow + 'px');
            var rectTimeout = $timeout(function() {
              var rawDom = element.find('ul')[0]; //console.log(rawDom)
              var rect = rawDom.getBoundingClientRect(),
                scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              return {
                top: rect.top + scrollTop,
                left: rect.left + scrollLeft
              }
            }, 100);
            rectTimeout.then(function(positionTabs){
              scope.heightScrollTabs = positionTabs.top - 90;
              angular.element($window).bind('scroll', function() {
                // console.log('Scrolling... ', this.pageYOffset, scope.heightScrollTabs);
                if (this.pageYOffset >= scope.heightScrollTabs) {
                  scope.boolChangeClassTabs = true;
                } else {
                  scope.boolChangeClassTabs = false;
                }
                if (scope.widthWindow >= 1200) {
                  scope.changeTabWidth = true;
                } else {
                  scope.changeTabWidth = false;
                }
                scope.$apply();
              });
            });
          }
        };
      }]);

  });
