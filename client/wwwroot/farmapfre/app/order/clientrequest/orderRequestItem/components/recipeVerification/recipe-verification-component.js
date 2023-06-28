(function($root, name, deps, action){
    define(name, deps, action)
})(window, "recipeVerificationComponent", ['angular', 'cropper'], function(ng, cropper){
    ng.module('farmapfre.app').
    controller('recipeVerificationComponentController',
      ['$scope', '$q', '$http', '$filter', 'proxyOrder', 'proxyMedicine', 'proxyBODispatch', 'mModalAlert', '$uibModal', function($scope, $q, $http, $filter, proxyOrder, proxyMedicine, proxyBODispatch, mModalAlert, $uibModal){
        var vm = this;
        vm.itsCancel = $scope.$parent.$ctrl.dataItem.itsCancel;
        vm.externalProviders = vm.providers;        
        vm.active = 0;
        $scope.$parent.$parent.$ctrl.buttonUp = false;

        vm.initialImg = 0;
        vm.fullscreen = false;
        vm.cropperNow = null;

        // updateDetailTeCuidamos = function(force) {
        //     if((vm.origin === 2 || vm.origin === 3) && (vm.firstload || force === 'S')) {
        //         angular.forEach(vm.medicaments, function(medi, key) {
        //             changeExternalProviders(medi);
        //             vm.valStock(key);
        //             vm.updateStock(medi);
        //         });
        //     }
        // }

        vm.fullsc = function() {
            if(vm.fullscreen){
                vm.fullscreen = false
                $scope.$parent.$parent.$ctrl.buttonUp = false
            }else{
               vm.fullscreen = true
                $scope.$parent.$parent.$ctrl.buttonUp = true
            }

            var image = getImage(vm.initialImg,vm.cropperNow);
            vm.cropperNow = getImageCropper(image);
        }
  
        var myPromise = new Promise(
          function (resolve, reject) {
            for (var j = 0; j < vm.images.length; j++) {
              if(!vm.images[j].data) {
                return;
              }

              if(!vm.images[j].data.includes('blob:')) {
                vm.decodedFrame = atob(vm.images[j].data)
                var raw = vm.decodedFrame
                var HEX = '';
                for ( i = 0; i < raw.length; i++ ) {
                  var _hex = raw.charCodeAt(i).toString(16)
                  HEX += (_hex.length==2?_hex:'0'+_hex);
                }
                ////
                var base = HEX.toUpperCase();
                var data = base
                var bytes = new Uint8Array(data.length / 2);
                for (var i = 0; i < data.length; i += 2) {
                  bytes[i / 2] = parseInt(data.substring(i, i + 2), 16);
                }
                var blob = new Blob([bytes], {type: 'image/jpeg'});
                var imagese = new Image();
                imagese.src = URL.createObjectURL(blob);
                vm.images[j].data = imagese.src;
              }
            }

            //return vm.images;
            resolve(vm.images);
          });

        myPromise.then();

        function getImage(num,cropperNow) {
           var image = document.getElementById('image');

            if(cropperNow){
                cropperNow.destroy();
            }

            image.setAttribute("src", vm.images[num] && vm.images[num].data ? vm.images[num].data : '#')

            return image;
        }

        function getImageCropper(image) {

            vm.cropperNow = new cropper(image, {
                viewMode: 3,
                dragMode: 'move',
                ready: function(e){
                    var cropper = this.cropper;
                    cropper.clear();
                }
            });

            return vm.cropperNow;
        }

        var image = getImage(vm.initialImg,vm.cropperNow);
        vm.cropperNow = getImageCropper(image);

        /*FUNCIONALIDAD DE BOTONES*/
        vm.rotateImageL = function() {
            vm.cropperNow.rotate(-90);
        }

        vm.rotateImageR = function() {
            vm.cropperNow.rotate(90);
        }

        vm.scaleImageX = function() {
            var imgdata = vm.cropperNow.getData();
            if(imgdata.scaleX == -1){
                vm.cropperNow.scaleX(1);
            }else{
                vm.cropperNow.scaleX(-1);
            }
        }

        vm.scaleImageY = function() {
            var imgdata = vm.cropperNow.getData();
            if(imgdata.scaleY == -1){
                vm.cropperNow.scaleY(1);
            }else{
                vm.cropperNow.scaleY(-1);
            }
        }

        //Download image native method
        vm.downloadImage = function() {
          var a = $("<a>")
            .attr("href", vm.cropperNow.url)
            .attr("download", "image.jpg")
            .appendTo("body");
          a[0].click();
          a.remove();
        }

        vm.zoomP = function() {
            vm.cropperNow.zoom(0.1);
        }

        vm.zoomM = function() {
            vm.cropperNow.zoom(-0.1);
        }

        vm.zoomR = function() {
            vm.cropperNow.zoomTo(0);
        }

        vm.prevImg = function() {
          if(vm.initialImg > 0){
              vm.initialImg--;
          }

          var image = getImage(vm.initialImg,vm.cropperNow);
          vm.cropperNow = getImageCropper(image);
        }

        vm.nextImg = function() {
            if(vm.initialImg < vm.images.length-1){
                vm.initialImg++;
            }

            var image = getImage(vm.initialImg,vm.cropperNow);
            vm.cropperNow = getImageCropper(image);
        }

        vm.changeImg = function(img) {
            vm.initialImg = img;
            var image = getImage(vm.initialImg,vm.cropperNow);
            vm.cropperNow = getImageCropper(image);
        }

        /*================================================================================*/

        // vm.searchMedicines = function(name, index) {
        //     return getSearchMedicines(vm.bodispatch.id, name);
        // }

        // var respView;
        // function getSearchMedicines(boDispatchId, name) {
        //     var deferred = $q.defer();
        //     proxyMedicine.SearchMedicine(boDispatchId,name).then(function(res) {
        //         respView = res;
        //         angular.forEach(respView, function(val, key) {
        //             if(vm.itscollect) {
        //                 val.itscollect = vm.itscollect;
        //                 val.stock = val.priceSales = 0;
        //             }
        //         });
        //         deferred.resolve(respView);
        //     }, function(e){
        //         deferred.reject(e)
        //     });
        //     return deferred.promise;
        // }

        // addWatchMedicaments = function() {
        //     angular.forEach(vm.medicaments, function(val, key) {
        //         $scope.$watch("$ctrl.medicaments[" + key + "].medicine.id", function(n, o) {
        //             if (n && o && n != o) {
        //                 vm.medicaments[key].quantityRequired = undefined;
        //                 vm.medicaments[key].copago = undefined;
        //             }
        //         });
        //     });
        // }

        // vm.removeItem = function(value) {
        //     vm.medicaments.splice(vm.medicaments.indexOf(value), 1);
        // };

        // vm.changeBoDispatch = function(boDispatchSelected, index) {
        //     if(vm.origin === 1 || vm.origin === 3) {
        //         if(vm.medicaments[0].medicine) {
        //             vm.medicaments = [];
        //             vm.addItem();
        //         }
        //     }
        //     else {
        //         proxyOrder.GetOrderDetailsTeCuidamos(vm.orderid, vm.bodispatch.id, true).then(function(res) {
        //             vm.medicaments = res;
        //             updateDetailTeCuidamos('S');
        //         });;
        //     }
        // };

        // vm.valStock = function(index) {
        //     if(!vm.itscollect) {
        //         if (vm.medicaments[index].medicine.stock != 0 && vm.medicaments[index].medicine.stock < vm.medicaments[index].quantityRequired) {
        //             vm.medicaments[index].quantityRequired = '';
        //         }
        //     }
        // };

        vm.calcCopago = function(m) {
            var quantityRequired = m.quantityRequired ? m.quantityRequired : 0;
            var priceSales = m.medicine.priceSales ? m.medicine.priceSales : 0;
            var porcCopago = vm.attention.porcCopago ? vm.attention.porcCopago : 0;
            m.copago = ((quantityRequired * priceSales) * ((100 - porcCopago) / 100)).toFixed(2);
        };

        // vm.updateStock = function(m) {
        //     if(!vm.itscollect) {
        //         if(m.quantityRequired && m.medicine.stock > 0)
        //             m.medicine.currentStock =  m.medicine.stock - m.quantityRequired;
        //         else
        //             m.medicine.currentStock =  m.medicine.stock;
        //     }
        // }

        vm.calcTotal = function() {
            var copagoTotal = 0;
            angular.forEach(vm.medicaments, function(value, key) {
                if(value.copago) {
                    copagoTotal = copagoTotal + parseFloat(value.copago);
                }
            });
            vm.copagoTotal = copagoTotal;
            return vm.copagoTotal;
        };

        vm.addItem = function() {
            var objEP = null;

            if(!vm.itscollect) {
              objEP = { "id": 1 };
              vm.medicaments.push({ "externalProvider": objEP, "externalProviders": JSON.parse(JSON.stringify(vm.externalProviders)) });
            }
            else {
                vm.medicaments.push({ "externalProvider": objEP });
            }
        }

        if(vm.medicaments === null || vm.medicaments.length === 0) {
            vm.addItem();
        };

        // vm.changeMedicine = function(medi) {
        //     medi.quantityRequired = undefined;
        //     medi.copago = undefined;
        //     changeExternalProviders(medi);
        // }

        // function changeExternalProviders(medi) {
        //     if(!vm.itscollect) {
        //         if (medi.medicine.stock && medi.medicine.stock != undefined && medi.medicine.stock != null) {
        //             medi.externalProviders = JSON.parse(JSON.stringify(vm.providers));
        //             medi.externalProvider.id = 1;
        //         } else {
        //             medi.externalProviders = JSON.parse(JSON.stringify(vm.providers.filter(function(x, y) { return x.id != 1; })));
        //             medi.externalProvider = null;
        //         }
        //     } else {
        //         medi.externalProvider = null;
        //     }
        // }

        // updateDetailTeCuidamos();
    }]).
    component("recipeVerification", {
        templateUrl: "/farmapfre/app/order/clientrequest/orderRequestItem/components/recipeVerification/recipe-verification-component.html",
        controller: "recipeVerificationComponentController",
        bindings: {
            orderid:"=?",
            images:"=?",
            medicaments:"=?",
            providers:"=?",
            attention:"=?",
            itssaveddet:"=?",
            bodispatchs:"=?",
            bodispatch:"=?",
            itscollect:"=?",
			origin:"=?",
            move:"=?",
            firstload:"=?",
            readonly:"=?",
        }
    })
});