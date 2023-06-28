define([
    'angular',
    'jquery',
    'swal'
], function(angular,$, swal) {
    'use strict';

    angular.module('oim.theme.service',[]).
    factory('oimProgress', function()
    {
        return {
            start: function () {
                $.skylo('start');
            },
            set: function (position) {
                $.skylo('set', position);
            },
            end: function () {
                $.skylo('end');
            },
            get: function () {
                return $.skylo('get');
            },
            inch: function (amount) {
                $.skylo('show',function(){
                   $.skylo('inch', amount);
                });
            }
        }
    }).service('mpSpin', [function()
    {
        this.start = function(value)
        {
            $.spin( value || true );
        };

        this.end = function()
        {
            $.spin('false');
        }
    }]).service("mModalAlert", function(){
        function showSimple(tit, msg, type, func, timer, textConfirm, customClass){
            var o = { title: tit,
                   html: msg,
                   type: type,
                   confirmButtonColor: "#749806",
                   confirmButtonText: textConfirm || "OK",
                   reverseButtons: true, //position buttons
                   allowOutsideClick: false,
                   customClass: customClass || ''
                  }

            if (angular.isNumber(timer)) o["timer"] = timer;
            var promise = null
            if (func && angular.isFunction(func))
                promise = swal(o,func);
            else
                promise = swal(o);
            return promise;
        }
        this.showInfo = function(msg, tit, Func, time, textConfirm, customClass){
            return showSimple(tit, msg, 'info', Func, time, textConfirm, customClass);
        };
        this.showSuccess = function(msg, tit, Func, time, textConfirm, customClass){
            return showSimple(tit, msg, 'success', Func, time, textConfirm, customClass);
        };
        this.showWarning = function(msg, tit, Func, time, textConfirm, customClass){
            return showSimple(tit, msg, 'warning', Func, time, textConfirm, customClass);
        };
        this.showDanger = function(msg, tit, Func, time, textConfirm, customClass){
            return showSimple(tit, msg, 'danger', Func, time, textConfirm, customClass);
        };
        this.showError = function(msg, tit, Func, time, textConfirm, customClass){
            return showSimple(tit, msg, 'error', Func, time, textConfirm, customClass);
        };

    }).service('mModalConfirm',function(){
        function showSimple(tit, msg, type, textConfirm, customClass, textCancel){

            var o = { title: tit,
                   // text: msg,
                   html: msg,
                   type: type,
                   confirmButtonColor: "#749806",
                   showCancelButton: true,
                   showCloseButton: true,
                   closeOnConfirm: false,
                   // confirmButtonText: textConfirm.toUpperCase() || 'OK',
                   confirmButtonText: textConfirm || 'OK',
                   // confirmButtonClass: confirmButtonClass || null,
                   cancelButtonText: textCancel || 'CANCELAR',
                   reverseButtons: true, //position buttons
                   allowOutsideClick: false,
                   customClass: customClass || ''
                  }
            var promise = swal(o);

            return promise;
        }
        this.confirmInfo = function(msg, tit, textConfirm, customClass){
            return showSimple(tit, msg, 'info', textConfirm, customClass);
        };
        this.confirmSuccess = function(msg, tit, textConfirm, customClass){
            return showSimple(tit, msg, 'success', textConfirm, customClass);
        };
        this.confirmWarning = function(msg, tit, textConfirm, customClass){
            return showSimple(tit, msg, 'warning', textConfirm, customClass);
        };
        this.confirmDanger = function(msg, tit, textConfirm, customClass){
            return showSimple(tit, msg, 'danger', textConfirm, customClass);
        };
        this.confirmError = function(msg, tit, textConfirm, customClass, textCancel){
            return showSimple(tit, msg, 'error', textConfirm, customClass, textCancel);
        };
        this.confirmQuestion = function(msg, tit, textConfirm, customClass){
            return showSimple(tit, msg, 'question', textConfirm, customClass);
        };
        // this.confirmQuestion = function(msg, tit, textConfirm){
        //     return showSimple(tit, msg, 'question', textConfirm);
        // };
    })
/*
    angular.module('mapfre.caching',[]).config(['$provide', function($provide){
        function cacheFactory ($delegate)
        {
            return function(key){
                var cache = $delegate(key);
                var basePut = cache.put
                cache.prototype.put = function(){
                    basePut.apply(basePut, arguments);
                }
            }
        }
        cacheFactory.$inject = ['$delegate']
        $provide.decorator('$cacheFactory', cacheFactory);
    }])
*/
});
