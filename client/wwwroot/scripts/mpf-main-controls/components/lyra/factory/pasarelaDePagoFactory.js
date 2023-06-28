define(['angular', 'constants'], function(angular, constants) {
  angular.module('mapfre.controls').factory('pasarelaFactory', [
    '$http',
    '$q',
    function($http, $q) {
      // var vm = this;
      function postData(data) {
        // TODO: temporal hasta tener servicio
        var deferred = $q.defer();
        $http({
          method: 'POST',
          url: constants.system.api.endpoints['paymentgateway'] + 'api/payment/createpayment',
          data: data,
          headers: {
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            Authorization:
              'Basic Nzk1NjgwNDY6dGVzdHB1YmxpY2tleV9mMGpHUzZCbXoxT0RQSlR5ZzdRMjZVRDduUW81Mk1FWXYwZ1Iyak50ZXJ1VlE='
          }
        })
          .success(function(responseLyra) {
            deferred.resolve(responseLyra);
          })
          .catch(function(response) {
            console.log('Error Servicio postData: ' + response.status);
            deferred.reject(response.statusText);
          });
        return deferred.promise;
      }

      return {
        postData: postData
      };
    }
  ]);
});
