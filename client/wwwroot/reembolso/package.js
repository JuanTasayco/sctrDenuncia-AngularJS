'use strict';

define([], function() {
  return {
    lib: {
      reembolso_routes: {
        name: 'reembolso_routes',
        path: '/reembolso/app/app.routes'
      },
      appReembolso: {
        name: 'appReembolso',
        path: '/reembolso/app/app'
      },
      proxyReembolso: {
        name: 'proxyReembolso',
        path: '/reembolso/app/proxy/serviceReembolso'
      },
      proxyReembolso2: {
        name: 'proxyReembolso2',
        path: '/reembolso/app/proxy/serviceReembolso2'
      },
      proxyCgw: {
        name: 'proxyCgw',
        path: '/cgw/app/proxy/serviceCgw'
      },
      redux: {
        name: 'redux',
        path: '/scripts/b_components/redux/index'
      },
      ngRedux: {
        name: 'ngRedux',
        path: '/scripts/b_components/ng-redux/dist/ng-redux.min'
      },
      logger: {
        name: 'logger',
        path: '/reembolso/app/shared/logger/redux-logger'
      },
      polyfillLogger: {
        name: 'polyfillLogger',
        path: '/reembolso/app/shared/logger/polyfill'
      },
      ConstantState: {
        name: 'ConstantState',
        path: '/reembolso/app/state/constantState'
      },
      RootReducer: {
        name: 'RootReducer',
        path: '/reembolso/app/state/reducers/index'
      },
      ReembolsoReducer: {
        name: 'ReembolsoReducer',
        path: '/reembolso/app/state/reducers/reembolso.reducer'
      },
      ReembolsoActions: {
        name: 'ReembolsoActions',
        path: '/reembolso/app/state/actions/reembolso.actions'
      },
      // Factory
      reFactory: {
        name: 'reFactory',
        path: '/reembolso/app/factory/reFactory'
      },
      reFactoryMedicalAssistance: {
        name: 'reFactoryMedicalAssistance',
        path: '/reembolso/app/factory/reFactoryMedicalAssistance'
      },
      reFactoryPersonalAccidents: {
        name: 'reFactoryPersonalAccidents',
        path: '/reembolso/app/factory/reFactoryPersonalAccidents'
      },
      reFactoryReassignExecutive: {
        name: 'reFactoryReassignExecutive',
        path: '/reembolso/app/factory/reFactoryReassignExecutive'
      },
      reFactoryMaintenance: {
        name: 'reFactoryMaintenance',
        path: '/reembolso/app/factory/reFactoryMaintenance'
      },
      // Services
      reServices: {
        name: 'reServices',
        path: '/reembolso/app/services/reServices'
      },
      reConstants: {
        name: 'reConstants',
        path: '/reembolso/app/factory/reConstants'
      },
      // Directives
      reFileOnChange: {
        name: 'reFileOnChange',
        path: '/reembolso/app/directives/fileOnChange/fileOnChange.directive'
      },
      'checklist-model': {
        name: 'checklist-model',
        path: '/scripts/b_components/checklist-model/checklist-model'
      },
      // Controllers
      homePageController: {
        name: 'homePageController',
        path: '/reembolso/app/components/home/home.controller'
      },
      solicitudPageController: {
        name: 'solicitudPageController',
        path: '/reembolso/app/components/solicitud/solicitud.page.controller'
      },
      reStepsController: {
        name: 'reStepsController',
        path: '/reembolso/app/components/solicitud/steps/steps.controller'
      },
      consultarPageController: {
        name: 'consultarPageController',
        path: '/reembolso/app/components/consultar/consultar.page.controller'
      },
      asignarBrokerPageController: {
        name: 'asignarBrokerPageController',
        path: '/reembolso/app/components/broker/asignarBroker.page.controller'
      },
      reasignarEjecutivoPageController: {
        name: 'reasignarEjecutivoPageController',
        path: '/reembolso/app/components/ejecutivo/reasignarEjecutivo.page.controller'
      },
      maintenancePageController: {
        name: 'maintenancePageController',
        path: '/reembolso/app/components/maintenance/maintenance.page.controller'
      },
      // Components
      reInitSolicitud: {
        name: 'reInitSolicitud',
        path: '/reembolso/app/components/solicitud/init/init.component'
      },
      reStepOneComponent: {
        name: 'reStepOneComponent',
        path: '/reembolso/app/components/solicitud/steps/stepOne/stepOne.component'
      },
      reStepTwoComponent: {
        name: 'reStepTwoComponent',
        path: '/reembolso/app/components/solicitud/steps/stepTwo/stepTwo.component'
      },
      reStepThreeComponent: {
        name: 'reStepThreeComponent',
        path: '/reembolso/app/components/solicitud/steps/stepThree/stepThree.component'
      },
      SuccessComponent: {
        name: 'successComponent',
        path: '/reembolso/app/components/solicitud/success/success.component'
      },
      reInitConsultar: {
        name: 'reInitConsultar',
        path: '/reembolso/app/components/consultar/init/init.component'
      },
      reModalAffiliate: {
        name: 'reModalAffiliate',
        path: '/reembolso/app/components/solicitud/shared/modal-affiliate/modal-affiliate.component'
      },
      reModalCreateAfiliate: {
        name: 'reModalCreateAfiliate',
        path: '/reembolso/app/components/solicitud/shared/modal-create-afiliate/modal-create-afiliate.component'
      },
      reProcedimientosModal: {
        name: 'reProcedimientosModal',
        path: '/reembolso/app/common/modals/modal-procedimientos/modal-procedimientos.component'
      },
      reProcedimientosImporteModal: {
        name: 'reProcedimientosImporteModal',
        path: '/reembolso/app/common/modals/modal-procedimientos-importe/modal-procedimientos-importe.component'
      },
      reCreateCompanyModal: {
        name: 'reCreateCompanyModal',
        path: '/reembolso/app/common/modals/modal-create-company/modal-create-company.component'
      },
      reModalAmountProvider: {
        name: 'reModalAmountProvider',
        path: '/reembolso/app/common/modals/modal-amount-provider/modal-amount-provider.component'
      },
      reModalAssignBroker: {
        name: 'reModalAssignBroker',
        path: '/reembolso/app/common/modals/modal-assign-broker/modal-assign-broker.component'
      },
      reReassignModal: {
        name: 'reReassignModal',
        path: '/reembolso/app/common/modals/reassign/reassign.component'
      },
      reRequestDataSummary: {
        name: 'reRequestDataSummary',
        path: '/reembolso/app/common/request-data-summary/request-data-summary.component'
      },
      mpfTimepicker: {
        name: 'mpfTimepicker',
        path: '/scripts/mpf-main-controls/components/mpf-timepicker/mpf-timepicker.component'
      },
      reInitDetailReembolso: {
        name: 'reInitDetailReembolso',
        path: '/reembolso/app/components/consultar/details/details.component'
      },
      reInitAsignarBroker: {
        name: 'reInitAsignarBroker',
        path: '/reembolso/app/components/broker/init/init.component'
      },
      reInitReasignarEjecutivo: {
        name: 'reInitReasignarEjecutivo',
        path: '/reembolso/app/components/ejecutivo/init/init.component'
      },
      reHome: {
        name: 'reHome',
        path: '/reembolso/app/components/home/home.controller'
      },
      reInitMaintenance: {
        name: 'reInitMaintenance',
        path: '/reembolso/app/components/maintenance/init/init.component'
      },
      reGridMaintenance: {
        name: 'reGridMaintenance',
        path: '/reembolso/app/components/maintenance/init/grid/grid.component'
      },
      reCoverageGrid: {
        name: 'reCoverageGrid',
        path: '/reembolso/app/components/solicitud/steps/coverages/coverage-grid/coverage-grid.component'
      },
      reGrid: {
        name: 'reGrid',
        path: '/reembolso/app/common/grid/grid.component'
      },
      reTemporaryDisabilityGrid: {
        name: 'reTemporaryDisabilityGrid',
        path:
          '/reembolso/app/components/solicitud/steps/coverages/coverage-grid/incapacidad-temporal-grid/incapacidad-temporal-grid.component'
      },
      rePermanentDisabilityGrid: {
        name: 'rePermanentDisabilityGrid',
        path:
          '/reembolso/app/components/solicitud/steps/coverages/coverage-grid/invalidez-permanente-grid/invalidez-permanente-grid.component'
      },
      reAccidentalDeathGrid: {
        name: 'reAccidentalDeathGrid',
        path:
          '/reembolso/app/components/solicitud/steps/coverages/coverage-grid/muerte-accidental-grid/muerte-accidental-grid.component'
      },
      reGastosSepelioGrid: {
        name: 'reGastosSepelioGrid',
        path:
          '/reembolso/app/components/solicitud/steps/coverages/coverage-grid/gastos-sepelio-grid/gastos-sepelio-grid.component'
      },
      reGastosCuracionGrid: {
        name: 'reGastosCuracionGrid',
        path:
          '/reembolso/app/components/solicitud/steps/coverages/coverage-grid/gastos-curacion-grid/gastos-curacion-grid.component'
      },
      reCoveragesModal: {
        name: 'reCoveragesModal',
        path: '/reembolso/app/components/solicitud/steps/coverages/coverages-modal/coverages-modal.component'
      },
      reCoveragesModalForm: {
        name: 'reCoveragesModalForm',
        path: '/reembolso/app/components/solicitud/steps/coverages/coverages-modal-form/coverages-modal-form.component'
      },
      reTemporaryDisabilityModal: {
        name: 'reTemporaryDisabilityModal',
        path:
          '/reembolso/app/components/solicitud/steps/coverages/coverages-modal-form/incapacidad-temporal-modal/incapacidad-temporal-modal.component'
      },
      rePermanentDisabilityModal: {
        name: 'rePermanentDisabilityModal',
        path:
          '/reembolso/app/components/solicitud/steps/coverages/coverages-modal-form/invalidez-permanente-modal/invalidez-permanente-modal.component'
      },
      reAccidentalDeathModal: {
        name: 'reAccidentalDeathModal',
        path:
          '/reembolso/app/components/solicitud/steps/coverages/coverages-modal-form/muerte-accidental-modal/muerte-accidental-modal.component'
      },
      reGastosSepelioModal: {
        name: 'reGastosSepelioModal',
        path:
          '/reembolso/app/components/solicitud/steps/coverages/coverages-modal-form/gastos-sepelio-modal/gastos-sepelio-modal.component'
      },
      reGastosCuracionModal: {
        name: 'reGastosCuracionModal',
        path:
          '/reembolso/app/components/solicitud/steps/coverages/coverages-modal-form/gastos-curacion-modal/gastos-curacion-modal.component'
      },
      reAttachmentsAlert: {
        name: 'reAttachmentsAlert',
        path: '/reembolso/app/components/solicitud/steps/attachments/attachments-alert/attachments-alert.component'
      },
      reAttachmentsFile: {
        name: 'reAttachmentsFile',
        path: '/reembolso/app/components/solicitud/steps/attachments/attachments-file/attachments-file.component'
      },
      reAttachmentsProcedimientos: {
        name: 'reAttachmentsProcedimientos',
        path:
          '/reembolso/app/components/solicitud/steps/attachments/attachments-procedimientos/attachments-procedimientos.component'
      },
      reMedicalAssistance: {
        name: 'reMedicalAssistance',
        path: '/reembolso/app/components/solicitud/steps/stepOne/medicalAssistance/medicalAssistance.component'
      },
      rePersonalAccidents: {
        name: 'rePersonalAccidents',
        path: '/reembolso/app/components/solicitud/steps/stepOne/personalAccidents/personalAccidents.component'
      },
      reSoat: {
        name: 'reSoat',
        path: '/reembolso/app/components/solicitud/steps/stepOne/soat/soat.component'
      },
      reEpsOne: {
        name: 'reEpsOne',
        path: '/reembolso/app/components/solicitud/steps/stepOne/eps/epsOne.component'
      },
      reSoatTwo: {
        name: 'reSoatTwo',
        path: '/reembolso/app/components/solicitud/steps/stepTwo/soat/soatTwo.component'
      },
      reSoatThree: {
        name: 'reSoatThree',
        path: '/reembolso/app/components/solicitud/steps/stepThree/soat/soatThree.component'
      },
      reTemplateStepThree: {
        name: 'reTemplateStepThree',
        path: '/reembolso/app/components/solicitud/steps/stepThree/template/template.component'
      },
      reTemplateStepTwo: {
        name: 'reTemplateStepTwo',
        path: '/reembolso/app/components/solicitud/steps/stepTwo/template/template.component'
      },
      moment: {
        name: 'moment',
        path: '/scripts/b_components/moment/min/moment.min'
      }
    },
    shim: {
      appReembolso: {
        deps: [
          'angular_ui_route',
          'uIBootstrap',
          'oim_ocLazyLoad',
          'oim_layout',
          'lodash',
          'proxyLogin',
          'oim_security',
          'proxyReembolso',
          'proxyReembolso2',
          'proxyCgw',
          'reFactory',
          'reConstants',
          'ngRedux',
          'reServices',
          'polyfillLogger'
        ]
      },
      reFactory: {
        deps: [
          'reFactoryMedicalAssistance',
          'reFactoryPersonalAccidents',
          'reFactoryReassignExecutive',
          'reFactoryMaintenance'
        ]
      },
      ngRedux: {
        deps: ['angular']
      },
      reCoverageGrid: {
        deps: [
          'reTemporaryDisabilityGrid',
          'rePermanentDisabilityGrid',
          'reAccidentalDeathGrid',
          'reGastosSepelioGrid',
          'reGastosCuracionGrid'
        ]
      },
      reCoveragesModalForm: {
        deps: [
          'reTemporaryDisabilityModal',
          'rePermanentDisabilityModal',
          'reAccidentalDeathModal',
          'reGastosSepelioModal',
          'reGastosCuracionModal'
        ]
      },
      reStepOneComponent: {
        deps: ['reMedicalAssistance', 'reSoat', 'reEpsOne', 'rePersonalAccidents']
      },
      reStepTwoComponent: {
        deps: ['reTemplateStepTwo', 'reSoatTwo']
      },
      reStepThreeComponent: {
        deps: ['reTemplateStepThree', 'reSoatThree']
      },
      reStepsController: {
        deps: [
          'mpfTimepicker',
          'reStepOneComponent',
          'reStepTwoComponent',
          'reStepThreeComponent',
          'reModalAffiliate',
          'reModalCreateAfiliate',
          'reProcedimientosModal',
          'reProcedimientosImporteModal',
          'reCreateCompanyModal',
          'reModalAmountProvider',
          'reCoverageGrid',
          'reCoveragesModal',
          'reCoveragesModalForm',
          'reAttachmentsAlert',
          'reAttachmentsFile',
          'reAttachmentsProcedimientos',
          'reFileOnChange',
          'reGrid'
        ]
      },
      moment: {
        exports: 'moment'
      },
      asignarBrokerPageController: {
        deps: ['reModalAssignBroker']
      },
      consultarPageController: {
        deps: ['reAttachmentsFile', 'reFileOnChange', 'reRequestDataSummary', 'reAttachmentsProcedimientos']
      },
      reasignarEjecutivoPageController: {
        deps: ['reReassignModal', 'reGrid']
      },
      maintenancePageController: {
        deps: ['reReassignModal', 'reGridMaintenance']
      }
    },
    packages: {}
  };
});
