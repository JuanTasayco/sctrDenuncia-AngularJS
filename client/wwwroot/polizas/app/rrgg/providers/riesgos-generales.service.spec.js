'use strict';

define([
  'angular',
  'angularMocks',
  'proxyPoliza'
], function (
  angular,
  angularMocks
) {
  describe('Unit Tests for General Risks', function () {
    beforeEach(module('oim.proxyService.poliza'));

    var proxyCotizacionRg;
    beforeEach(inject(function (_proxyCotizacionRg_) {
      proxyCotizacionRg = _proxyCotizacionRg_;
    }));
    describe('proxyCotizacionRg', function () {
      var response = 'response';
      beforeEach(function () {
        spyOn(proxyCotizacionRg, 'ResumenResponsabilidadCivil').and.callFake(function () {
          return response;
        });
      });
      it('should exist', function () {
        expect(proxyCotizacionRg).toBeDefined();
      });

      it('should existe ResumenResponsabilidadCivil() function', function () {
        expect(proxyCotizacionRg.ResumenResponsabilidadCivil).toBeDefined();
      });

    });
  });
});
