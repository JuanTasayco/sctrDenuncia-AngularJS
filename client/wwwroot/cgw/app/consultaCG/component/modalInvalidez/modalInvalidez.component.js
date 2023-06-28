define(['angular', '/cgw/app/factory/cgwFactory.js'], function(ng) {
  
  ModalInvalidezController.$inject = ['$scope', 'cgwFactory', 'mModalAlert', 'mainServices', 'accessSupplier'];

  function ModalInvalidezController($scope, cgwFactory, mModalAlert, mainServices, accessSupplier) {
    var vm = this;

    var profile = accessSupplier.profile();

    (
      function onLoad() {
        vm.data = {};
        vm.files = [];
      }
    )();

    $scope.$watch('$ctrl.data.file', function() {
      if (vm.data.file !== undefined)
        vm.addDocument();
    });

    vm.addDocument = function() {
      var accept = ".jpg, .jpeg, .png, .pdf, .doc, .docx, .msg"
      var aAccept = accept.split(",");

      if (!vm.data.file || vm.data.file.length == 0){
        mModalAlert.showError("Adjute un documento.",  "Invalidez");
        return;
      }

      if (vm.data.file[0].size >= 25000000){
        mModalAlert.showError("El archivo seleccionado supera el tamaño de 25 megas, selecione uno de menos tamaño", "Invalidez");
        return;
      }

      if (!_.find(aAccept, function(x){ return vm.data.file[0].name.toLowerCase().indexOf(x.trim().toLowerCase()) != -1; })){
        mModalAlert.showError("Seleccione un archivo con las siguientes extensiones permitidas: " + accept, "Invalidez");
        return;
      }

      if(vm.files.length == 5){
        mModalAlert.showError("Ha alcanzado el máximo de archivos que puede adjuntar", "Invalidez");
        return;
      }

      var encoded = "";

      mainServices.fnFileSerializeToBase64(vm.data.file[0]).then(function (data) {
        encoded = data.toString().replace(/^data:(.*,)?/, '');
        if ((encoded.length % 4) > 0) {
          encoded += '='.repeat(4 - (encoded.length % 4));
        }

        var paramsFile = { nombreDocumento: vm.data.file[0].name, documento: encoded, tipoDocumento: vm.data.file[0].type };
        vm.files.push(paramsFile);
        delete vm.data.file;
      },
      function(error) {
        console.log('Hubo problema al subir el archivo');
      });
    }

    vm.deleteDocument = function (index) {
      vm.files.splice(index, 1);
    }

    vm.sendEmail = function() {
      if(!vm.data.mDestino || !vm.data.mAsunto) {
        mModalAlert.showError("Ingrese los datos obligatorios", "Invalidez");
        return;
      }

      if(vm.files.length == 0) {
        mModalAlert.showError("Debe adjuntar al menos un documento", "Invalidez");
        return;
      }

      var params = {
        Body: vm.data.mComentario ? vm.data.mComentario.toUpperCase() : 'SOLICITUD DE INVALIDEZ',
        IsBodyHtml: true,
        Subject: vm.data.mAsunto.toUpperCase(),
        cAttachments: [],
        cBcc: null,
        cCc: profile.userEmail,
        cFrom: "UnidadCartasGarantia@mapfre.com.pe",
        cTo: vm.data.mDestino
      };

      angular.forEach(vm.files, function(value) {
        var fileData = {
          FileBase64: value.documento,
          Name: value.nombreDocumento,
          MimeType: value.tipoDocumento
        }

        params.cAttachments.push(fileData);
      });

      cgwFactory.SendInvalidezMail(params, vm.carta.Year, vm.carta.Number, vm.carta.Version, true).then(function(response) {
        if (response.Codigo == 1) {
          mModalAlert.showSuccess("El correo fue enviado de manera exitosa", "Invalidez").then(function (response) {
            vm.confirm();
          });
        } else {
          mModalAlert.showError("Hubo un error al enviar el correo", "Invalidez");
        }
      });
    };

  }
  
  return ng.module('appCgw')
    .controller('ModalInvalidezController', ModalInvalidezController)
    .component('mfpModalInvalidez', {
      templateUrl: '/cgw/app/consultaCG/component/modalInvalidez/modalInvalidez.html',
      controller: 'ModalInvalidezController',
      bindings: {
        carta: '=?',
        close: '&?',
        confirm: '&?'
      }
    })
    .directive('preventDefault', function() {
      return function(scope, element, attrs) {
        angular.element(element).bind('click', function(event) {
          event.preventDefault();
          event.stopPropagation();
        });
      }
    });
});
  