'use strict';

define(['angular', 'lodash'], function (ng, _) {
  ModalMapController.$inject = ['$window'];
  function ModalMapController($window) {
    var vm = this;

    vm.cerrar = cerrar;
    vm.realizarCb = realizarCb;

    vm.$onInit = onInit;

    function onInit() {
      console.log(vm.comisarias)
      console.log($window.google)
      vm._map = new $window.google.maps.Map( document.getElementById('map'), {
        center: { lat: -12.0672585, lng: -77.0337415 },
        fullscreenControl: false,
        mapTypeControl: false,
        mapTypeId: 'roadmap',
        streetViewControl: false,
        zoom: 15
      });

      console.log(vm._map)

      _createMarker();
    }
    // declaracion

    function _createMarker() {
      _.map(vm.comisarias, function mpF(item) {
        var position = new $window.google.maps.LatLng(item.latitud, item.longitud );

        console.log(position)
        const _marker = new $window.google.maps.Marker({
          icon: {
            // scaledSize: new google.maps.Size(25, 25),
            url: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png',
            zIndex: $window.google.maps.Marker.MAX_ZINDEX + 1
          },
          map: vm._map,
          position:  position
        });
    
        console.log("marker",_marker)
        vm._map.setCenter(position );
      })
    }

    function cerrar() {
      vm.close(void 0);
    }

    function realizarCb() {
      vm.close({ status: 'ok' });
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('ModalMapController', ModalMapController)
    .component('wpModalMap', {
      templateUrl: '/webproc/app/components/detalle-asistencia/common/modal-map/modal-map.html',
      controller: 'ModalMapController',
      bindings: {
        close: '&?',
        comisarias: '<?'
      }
    });
});
