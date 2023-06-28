'use strict';

define(['ConstantState'], function (TASK_ACTIONS) {
  var actions = {
    reduxUpdateCompany: reduxUpdateCompany,
    reduxUpdateProduct: reduxUpdateProduct,
    reduxUpdateStepOne: reduxUpdateStepOne,
    reduxCoverageCompensationAdd: reduxCoverageCompensationAdd,
    reduxCoverageCompensationDelete: reduxCoverageCompensationDelete,
    reduxCoverageCompensationEdit: reduxCoverageCompensationEdit,
    reduxAdditionalDataUpdate: reduxAdditionalDataUpdate,
    reduxAdditionalDataAdd: reduxAdditionalDataAdd,
    reduxUpdateCoverage: reduxUpdateCoverage,
    reduxUpdateAfiliate: reduxUpdateAfiliate,
    reduxUpdateSolicitudData: reduxUpdateSolicitudData,
    reduxUpdateExtraBeneficiaryData: reduxUpdateExtraBeneficiaryData,
    reduxUpdateDocumentLiquidation: reduxUpdateDocumentLiquidation,
    reduxAddDocumentLiquidation: reduxAddDocumentLiquidation,
    reduxAddComprobante: reduxAddComprobante,
    reduxEditComprobante: reduxEditComprobante,
    reduxCleanState: reduxCleanState,
    // Consult
    reduxConsultAddSolicitud: reduxConsultAddSolicitud
  };

  function reduxUpdateCompany(company) {
    return {
      type: TASK_ACTIONS.SOLICITUD.COMPANY_UPDATE,
      payload: company
    };
  }

  function reduxUpdateProduct(product) {
    return {
      type: TASK_ACTIONS.SOLICITUD.PRODUCT_UPDATE,
      payload: product
    };
  }

  function reduxAdditionalDataUpdate(additionalData) {
    return {
      type: TASK_ACTIONS.SOLICITUD.ADDITIONAL_DATA.UPDATE,
      payload: {
        additionalData: additionalData
      }
    }
  }

  function reduxAdditionalDataAdd(additionalData) {
    return {
      type: TASK_ACTIONS.SOLICITUD.ADDITIONAL_DATA.ADD,
      payload: additionalData
    }
  }

  function reduxCoverageCompensationAdd(coverageCompensation) {
    return {
      type: TASK_ACTIONS.SOLICITUD.COVERAGE_COMPENSATIONS.ADD,
      payload: coverageCompensation
    }
  }

  function reduxCoverageCompensationDelete(index) {
    return {
      type: TASK_ACTIONS.SOLICITUD.COVERAGE_COMPENSATIONS.DELETE,
      payload: {
        index: index
      }
    }
  }

  function reduxCoverageCompensationEdit(coverageCompensation) {
    return {
      type: TASK_ACTIONS.SOLICITUD.COVERAGE_COMPENSATIONS.EDIT,
      payload: coverageCompensation
    }
  }

  function reduxUpdateCoverage(coverage) {
    return {
      type: TASK_ACTIONS.SOLICITUD.COVERAGE_UPDATE,
      payload: {
        coverage: coverage
      }
    }
  }

  function reduxUpdateAfiliate(afiliate) {
    return {
      type: TASK_ACTIONS.SOLICITUD.AFILIATE_UPDATE,
      payload: {
        afiliate: afiliate
      }
    }
  }

  function reduxUpdateSolicitudData(solicitudData) {
    return {
      type: TASK_ACTIONS.SOLICITUD.SOLICITUD_DATA_UPDATE,
      payload: {
        solicitudData: solicitudData
      }
    }
  }

  function reduxUpdateStepOne(frmStepOne) {
    return {
      type: TASK_ACTIONS.SOLICITUD.STEP_ONE_UPDATE,
      payload: frmStepOne
    };
  }

  function reduxUpdateExtraBeneficiaryData(beneficiaryData) {
    return {
      type: TASK_ACTIONS.SOLICITUD.EXTRA_BENEFICIARY_DATA,
      payload: {
        extraBeneficiaryData: beneficiaryData
      }
    }
  }

  function reduxUpdateDocumentLiquidation(documentLiquidation) {
    return {
      type: TASK_ACTIONS.SOLICITUD.DOCUMENT_LIQUIDATION_DATA.UPDATE,
      payload: {
        documentLiquidation: documentLiquidation
      }
    }
  }

  function reduxAddDocumentLiquidation(documentLiquidation) {
    return {
      type: TASK_ACTIONS.SOLICITUD.DOCUMENT_LIQUIDATION_DATA.ADD,
      payload: documentLiquidation
    }
  }

  function reduxAddComprobante(comprobanteData) {
    return {
      type: TASK_ACTIONS.SOLICITUD.COMPROBANTES_LIST.ADD,
      payload: comprobanteData
    }
  }

  function reduxEditComprobante(comprobanteData) {
    return {
      type: TASK_ACTIONS.SOLICITUD.COMPROBANTES_LIST.EDIT,
      payload: comprobanteData
    }
  }

  function reduxCleanState() {
    return {
      type: TASK_ACTIONS.SOLICITUD.CLEAN_STATE
    }
  }

  // consult

  function reduxConsultAddSolicitud(data) {
    return {
      type: TASK_ACTIONS.CONSULT.SOLICITUD.ADD,
      payload: data
    }
  }

  return actions;
});
