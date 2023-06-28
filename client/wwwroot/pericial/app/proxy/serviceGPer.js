/* eslint-disable */
(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants'], function(angular, constants){
    var module = angular.module("oim.proxyService.gper", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxyGPer', {
        endpoint: constants.system.api.endpoints['gper'],
        controllerBudget: {
            actions : {
                'methodResource_Budget_Type_List':{
                    name:  'Resource_Budget_Type_List',
                    path: 'api/budget/type'
                },
                'methodResource_Proficient_Type_List':{
                    name:  'Resource_Proficient_Type_List',
                    path: 'api/budget/typeproficient'
                },
                'methodResource_Budget_Get':{
                    name:  'Resource_Budget_Get',
                    path: 'api/budget/{idSinisterDetail}/{type}/{typeFile}'
                },
            }
        },
        controllerSecurity: {
            actions : {
                'methodResource_Security_GetTicketUser':{
                    name:  'Resource_Security_GetTicketUser',
                    path: 'api/security/ticket'
                },
                'methodResource_Security_GetRole':{
                    name:  'Resource_Security_GetRole',
                    path: 'api/security/role'
                },
                'methodResource_Security_GetProficient':{
                    name:  'Resource_Security_GetProficient',
                    path: 'api/security/proficient'
                },
                'methodResource_Security_GetWorkshop':{
                    name:  'Resource_Security_GetWorkshop',
                    path: 'api/security/workshop'
                },
            }
        },
        controllerSinister: {
            actions : {
                'methodResource_State_Get_List':{
                    name:  'Resource_State_Get_List',
                    path: 'api/sinister/states'
                },
                'methodResource_State_Executive_Get_List':{
                    name:  'Resource_State_Executive_Get_List',
                    path: 'api/sinister/states/executive'
                },
                'methodResource_Sinister_Get':{
                    name:  'Resource_Sinister_Get',
                    path: 'api/sinister/{idSinisterDetail}'
                },
                'methodResource_Workorder_Get_List':{
                    name:  'Resource_Workorder_Get_List',
                    path: 'api/sinister/workdorder/{sinisterNumber}/{recordNumber}/{idWorkshop}'
                },
                'methodResource_Sinister_Search':{
                    name:  'Resource_Sinister_Search',
                    path: 'api/sinister/search/{idTypeInsured}/{numberCase}/{plateNumber}'
                },
                'methodResource_Sinister_Get_List':{
                    name:  'Resource_Sinister_Get_List',
                    path: 'api/sinister/list'
                },
                'methodResource_Sinister_Extension_Get_List':{
                    name:  'Resource_Sinister_Extension_Get_List',
                    path: 'api/sinister/extension/{idSinister}'
                },
                'methodResource_Sinister_Add':{
                    name:  'Resource_Sinister_Add',
                    path: 'api/sinister/add'
                },
                'methodResource_Sinister_Upd':{
                    name:  'Resource_Sinister_Upd',
                    path: 'api/sinister/update'
                },
                'methodResource_Sinister_Workshop_SaveBudget':{
                    name:  'Resource_Sinister_Workshop_SaveBudget',
                    path: 'api/sinister/workshop/budget'
                },
                'methodResource_Sinister_Workshop_SaveTotalLoss':{
                    name:  'Resource_Sinister_Workshop_SaveTotalLoss',
                    path: 'api/sinister/workshop/total/loss'
                },
                'methodResource_Sinister_Workshop_SolveObservation':{
                    name:  'Resource_Sinister_Workshop_SolveObservation',
                    path: 'api/sinister/workshop/solve/observation'
                },
                'methodResource_Sinister_Proficient_Assign':{
                    name:  'Resource_Sinister_Proficient_Assign',
                    path: 'api/sinister/proficient/assign'
                },
                'methodResource_Sinister_Proficient_Reassign':{
                    name:  'Resource_Sinister_Proficient_Reassign',
                    path: 'api/sinister/proficient/reassign'
                },
                'methodResource_Sinister_Proficient_Cancel':{
                    name:  'Resource_Sinister_Proficient_Cancel',
                    path: 'api/sinister/proficient/cancel'
                },
                'methodResource_Sinister_Proficient_RequestInformation':{
                    name:  'Resource_Sinister_Proficient_RequestInformation',
                    path: 'api/sinister/proficient/request/information'
                },
                'methodResource_Sinister_Proficient_RequestConfirm':{
                    name:  'Resource_Sinister_Proficient_RequestConfirm',
                    path: 'api/sinister/proficient/request/confirm'
                },
                'methodResource_Sinister_Proficient_Save_Finish':{
                    name:  'Resource_Sinister_Proficient_Save_Finish',
                    path: 'api/sinister/proficient/finish'
                },
                'methodResource_Sinister_Proficient_Save_TotalLoss':{
                    name:  'Resource_Sinister_Proficient_Save_TotalLoss',
                    path: 'api/sinister/proficient/total/loss'
                },
                'methodResource_Sinister_Supervisor_ValidateTotalLoss':{
                    name:  'Resource_Sinister_Supervisor_ValidateTotalLoss',
                    path: 'api/sinister/supervisor/total/loss/validate'
                },
                'methodResource_Sinister_Workshop_Save_InRepair':{
                    name:  'Resource_Sinister_Workshop_Save_InRepair',
                    path: 'api/sinister/workshop/repair'
                },
                'methodResource_Sinister_Workshop_SaveReadyForDelivery':{
                    name:  'Resource_Sinister_Workshop_SaveReadyForDelivery',
                    path: 'api/sinister/workshop/ready/for/delivery'
                },
                'methodResource_Sinister_Workshop_SaveDeliveredUpdate':{
                    name:  'Resource_Sinister_Workshop_SaveDeliveredUpdate',
                    path: 'api/sinister/workshop/delivered/update'
                },
                'methodResource_Sinister_Workshop_SaveDelivered':{
                    name:  'Resource_Sinister_Workshop_SaveDelivered',
                    path: 'api/sinister/workshop/delivered'
                },
                'methodResource_Sinister_Workshop_SaveDeliveredRegularizeSpare':{
                    name:  'Resource_Sinister_Workshop_SaveDeliveredRegularizeSpare',
                    path: 'api/sinister/workshop/delivered/regularize/spare'
                },
                'methodResource_Sinister_Workshop_GenerateExtension':{
                    name:  'Resource_Sinister_Workshop_GenerateExtension',
                    path: 'api/sinister/workshop/generate/extension'
                },
                'methodResource_Sinister_Client_Confirm_Pay_Franchise':{
                    name:  'Resource_Sinister_Client_Confirm_Pay_Franchise',
                    path: 'api/sinister/proficient/client/confirm?sd={sd}&st={st}&em={em}&ns={ns}'
                },
                'methodResource_Sinister_Save_Tracker':{
                    name:  'Resource_Sinister_Save_Tracker',
                    path: 'api/sinister/saveEventTracker'
                },
            }
        },
        controllerParameter: {
            actions : {
                'methodResource_Parameter_Detail_Unsured_List':{
                    name:  'Resource_Parameter_Detail_Unsured_List',
                    path: 'api/parameter/insured'
                },
                'methodResource_Parameter_Detail_Information_Request_List':{
                    name:  'Resource_Parameter_Detail_Information_Request_List',
                    path: 'api/parameter/information/request'
                },
                'methodResource_Parameter_Detail_Register_Type_List':{
                    name:  'Resource_Parameter_Detail_Register_Type_List',
                    path: 'api/parameter/register/type'
                },
                'methodResource_Parameter_Detail_Order_By_List':{
                    name:  'Resource_Parameter_Detail_Order_By_List',
                    path: 'api/parameter/orderby'
                },
            }
        },
        controllerReport: {
            actions : {
                'methodResource_Download_Sinister_Report':{
                    name:  'Resource_Download_Sinister_Report',
                    path: 'api/report/download/sinister'
                },
            }
        },
        controllerAttachFile: {
            actions : {
                'methodResource_AttachFile_Add_WorkshopPhoto':{
                    name:  'Resource_AttachFile_Add_WorkshopPhoto',
                    path: 'api/attachfile/workshop/photo'
                },
                'methodResource_AttachFile_Add_WorkshopBudget':{
                    name:  'Resource_AttachFile_Add_WorkshopBudget',
                    path: 'api/attachfile/workshop/budget'
                },
                'methodResource_AttachFile_Add_WorkshopLetterTotalLoss':{
                    name:  'Resource_AttachFile_Add_WorkshopLetterTotalLoss',
                    path: 'api/attachfile/workshop/total/loss/letter/declaration'
                },
                'methodResource_AttachFile_Add_WorkshopVehiculeOutside':{
                    name:  'Resource_AttachFile_Add_WorkshopVehiculeOutside',
                    path: 'api/attachfile/workshop/total/loss/vehicle/outside'
                },
                'methodResource_AttachFile_Add_WorkshopVehiculeAccesory':{
                    name:  'Resource_AttachFile_Add_WorkshopVehiculeAccesory',
                    path: 'api/attachfile/workshop/total/loss/vehicle/accessory'
                },
                'methodResource_AttachFile_Add_WorkshopVehiculeAditional':{
                    name:  'Resource_AttachFile_Add_WorkshopVehiculeAditional',
                    path: 'api/attachfile/workshop/total/loss/vehicle/aditional'
                },
                'methodResource_AttachFile_Add_ProficientPhoto':{
                    name:  'Resource_AttachFile_Add_ProficientPhoto',
                    path: 'api/attachfile/proficient/photo'
                },
                'methodResource_AttachFile_Add_ProficientBudgetAdjust':{
                    name:  'Resource_AttachFile_Add_ProficientBudgetAdjust',
                    path: 'api/attachfile/proficient/budget/adjust'
                },
                'methodResource_AttachFile_Add_WorkshopLetterLossDeclaration':{
                    name:  'Resource_AttachFile_Add_WorkshopLetterLossDeclaration',
                    path: 'api/attachfile/proficient/total/loss/inventory'
                },
                'methodResource_AttachFile_Add_WorkshopLetterConformity':{
                    name:  'Resource_AttachFile_Add_WorkshopLetterConformity',
                    path: 'api/attachfile/workshop/letter/conformity'
                },
                'methodResource_AttachFile_Add_WorkshopLetterRejection':{
                    name:  'Resource_AttachFile_Add_WorkshopLetterRejection',
                    path: 'api/attachfile/workshop/letter/rejection'
                },
                'methodResource_Image_Get':{
                    name:  'Resource_Image_Get',
                    path: 'api/attachfile/image/{idAttachFile}/{idPhototype}'
                },
                'methodResource_File_Get':{
                    name:  'Resource_File_Get',
                    path: 'api/attachfile/file/{idAttachFile}'
                },
                'methodResource_AttachFile_Get_List':{
                    name:  'Resource_AttachFile_Get_List',
                    path: 'api/attachfile/{idSinisterDetail}/{fileType}'
                },
                'methodResource_Image_Delete':{
                    name:  'Resource_Image_Delete',
                    path: 'api/attachfile/delete/{idAttachFile}/{idSinisterDetail}'
                },
            }
        },
        controllerMovement: {
            actions : {
                'methodResource_Commentary_List':{
                    name:  'Resource_Commentary_List',
                    path: 'api/movement/commentary/{idSinister}'
                },
                'methodResource_Movement_Add':{
                    name:  'Resource_Movement_Add',
                    path: 'api/movement/add/commentary'
                },
            }
        },
        controllerTron: {
            actions : {
                'methodResource_Tron_Proficien_List':{
                    name:  'Resource_Tron_Proficien_List',
                    path: 'api/tron/proficient'
                },
                'methodResource_Tron_Workshop_List':{
                    name:  'Resource_Tron_Workshop_List',
                    path: 'api/tron/workshop'
                },
            }
        },
        controllerLetter: {
            actions : {
                'methodResource_Compliance_Letter':{
                    name:  'Resource_Compliance_Letter',
                    path: 'api/letter/download/compliance/{idSinisterDetail}/{fileType}'
                },
                'methodResource_Withdrawal_Letter':{
                    name:  'Resource_Withdrawal_Letter',
                    path: 'api/letter/download/withdrawal/{idSinisterDetail}/{fileType}'
                },
                'methodResource_PendingItem_Letter':{
                    name:  'Resource_PendingItem_Letter',
                    path: 'api/letter/download/Pendingitem/{idSinisterDetail}/{fileType}'
                },
                'methodResource_Guarantee_Letter':{
                    name:  'Resource_Guarantee_Letter',
                    path: 'api/letter/download/guarantee/{idSinisterDetail}/{fileType}'
                },
                'methodResource_Vehicle_Inventory_Total_Loss':{
                    name:  'Resource_Vehicle_Inventory_Total_Loss',
                    path: 'api/letter/download/vehicle_inventory/{idSinisterDetail}/{fileType}'
                },
                'methodResource_Truck_Inventory_Total_Loss':{
                    name:  'Resource_Truck_Inventory_Total_Loss',
                    path: 'api/letter/download/truck_inventory/{idSinisterDetail}/{fileType}'
                },
            }
        },
        controllerDamage: {
            actions : {
                'methodResource_Damage_List':{
                    name:  'Resource_Damage_List',
                    path: 'api/damage/list'
                },
            }
        },
        controllerDashboard: {
            actions : {
                'methodResource_Dashboard_WorkshopIndicator':{
                    name:  'Resource_Dashboard_WorkshopIndicator',
                    path: 'api/dashboard/workshop/indicator'
                },
                'methodResource_Dashboard_ProficientIndicator':{
                    name:  'Resource_Dashboard_ProficientIndicator',
                    path: 'api/dashboard/proficient/indicator'
                },
                'methodResource_Dashboard_Supervisor':{
                    name:  'Resource_Dashboard_Supervisor',
                    path: 'api/dashboard/supervisor'
                },
                'methodResource_Dashboard_Proficient':{
                    name:  'Resource_Dashboard_Proficient',
                    path: 'api/dashboard/proficient'
                },
                'methodResource_Dashboard_Workshop':{
                    name:  'Resource_Dashboard_Workshop',
                    path: 'api/dashboard/workshop'
                },
            }
        }
    })



     module.factory("proxyBudget", ['oimProxyGPer', 'httpData', function(oimProxyGPer, httpData){
        return {
                'Resource_Budget_Type_List' : function( showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + 'api/budget/type',
                                         undefined, undefined, showSpin)
                },
                'Resource_Proficient_Type_List' : function( showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + 'api/budget/typeproficient',
                                         undefined, undefined, showSpin)
                },
                'Resource_Budget_Get' : function(idSinisterDetail, type, typeFile, showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + helper.formatNamed('api/budget/{idSinisterDetail}/{type}/{typeFile}',
                                                    { 'idSinisterDetail':  { value: idSinisterDetail, defaultValue:'' } ,'type':  { value: type, defaultValue:'' } ,'typeFile':  { value: typeFile, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySecurity", ['oimProxyGPer', 'httpData', function(oimProxyGPer, httpData){
        return {
                'Resource_Security_GetTicketUser' : function( showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/security/ticket',
                                         undefined, undefined, showSpin)
                },
                'Resource_Security_GetRole' : function( showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/security/role',
                                         undefined, undefined, showSpin)
                },
                'Resource_Security_GetProficient' : function( showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + 'api/security/proficient',
                                         undefined, undefined, showSpin)
                },
                'Resource_Security_GetWorkshop' : function( showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + 'api/security/workshop',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySinister", ['oimProxyGPer', 'httpData', function(oimProxyGPer, httpData){
        return {
                'Resource_State_Get_List' : function( showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + 'api/sinister/states',
                                         undefined, undefined, showSpin)
                },
                'Resource_State_Executive_Get_List' : function( showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + 'api/sinister/states/executive',
                                         undefined, undefined, showSpin)
                },
                'Resource_Sinister_Get' : function(idSinisterDetail, showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + helper.formatNamed('api/sinister/{idSinisterDetail}',
                                                    { 'idSinisterDetail':  { value: idSinisterDetail, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Workorder_Get_List' : function(sinisterNumber, recordNumber, idWorkshop, showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + helper.formatNamed('api/sinister/workdorder/{sinisterNumber}/{recordNumber}/{idWorkshop}',
                                                    { 'sinisterNumber':  { value: sinisterNumber, defaultValue:'' } ,'recordNumber':  { value: recordNumber, defaultValue:'' } ,'idWorkshop':  { value: idWorkshop, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Sinister_Search' : function(idTypeInsured, numberCase, plateNumber, showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + helper.formatNamed('api/sinister/search/{idTypeInsured}/{numberCase}/{plateNumber}',
                                                    { 'idTypeInsured':  { value: idTypeInsured, defaultValue:'' } ,'numberCase':  { value: numberCase, defaultValue:'' } ,'plateNumber':  { value: plateNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Sinister_Get_List' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/sinister/list',
                                         request, undefined, showSpin)
                },
                'Resource_Sinister_Extension_Get_List' : function(idSinister, showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + helper.formatNamed('api/sinister/extension/{idSinister}',
                                                    { 'idSinister':  { value: idSinister, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Sinister_Add' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/sinister/add',
                                         request, undefined, showSpin)
                },
                'Resource_Sinister_Upd' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/sinister/update',
                                         request, undefined, showSpin)
                },
                'Resource_Sinister_Workshop_SaveBudget' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/sinister/workshop/budget',
                                         request, undefined, showSpin)
                },
                'Resource_Sinister_Workshop_SaveTotalLoss' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/sinister/workshop/total/loss',
                                         request, undefined, showSpin)
                },
                'Resource_Sinister_Workshop_SolveObservation' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/sinister/workshop/solve/observation',
                                         request, undefined, showSpin)
                },
                'Resource_Sinister_Proficient_Assign' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/sinister/proficient/assign',
                                         request, undefined, showSpin)
                },
                'Resource_Sinister_Proficient_Reassign' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/sinister/proficient/reassign',
                                         request, undefined, showSpin)
                },
                'Resource_Sinister_Proficient_Cancel' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/sinister/proficient/cancel',
                                         request, undefined, showSpin)
                },
                'Resource_Sinister_Proficient_RequestInformation' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/sinister/proficient/request/information',
                                         request, undefined, showSpin)
                },
                'Resource_Sinister_Proficient_RequestConfirm' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/sinister/proficient/request/confirm',
                                         request, undefined, showSpin)
                },
                'Resource_Sinister_Proficient_Save_Finish' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/sinister/proficient/finish',
                                         request, undefined, showSpin)
                },
                'Resource_Sinister_Proficient_Save_TotalLoss' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/sinister/proficient/total/loss',
                                         request, undefined, showSpin)
                },
                'Resource_Sinister_Supervisor_ValidateTotalLoss' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/sinister/supervisor/total/loss/validate',
                                         request, undefined, showSpin)
                },
                'Resource_Sinister_Workshop_Save_InRepair' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/sinister/workshop/repair',
                                         request, undefined, showSpin)
                },
                'Resource_Sinister_Workshop_SaveReadyForDelivery' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/sinister/workshop/ready/for/delivery',
                                         request, undefined, showSpin)
                },
                'Resource_Sinister_Workshop_SaveDeliveredUpdate' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/sinister/workshop/delivered/update',
                                         request, undefined, showSpin)
                },
                'Resource_Sinister_Workshop_SaveDelivered' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/sinister/workshop/delivered',
                                         request, undefined, showSpin)
                },
                'Resource_Sinister_Workshop_SaveDeliveredRegularizeSpare' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/sinister/workshop/delivered/regularize/spare',
                                         request, undefined, showSpin)
                },
                'Resource_Sinister_Workshop_GenerateExtension' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/sinister/workshop/generate/extension',
                                         request, undefined, showSpin)
                },
                'Resource_Sinister_Client_Confirm_Pay_Franchise' : function(sd, st, em, ns, showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + helper.formatNamed('api/sinister/proficient/client/confirm?sd={sd}&st={st}&em={em}&ns={ns}',
                                                    { 'sd':  { value: sd, defaultValue:'' } ,'st':  { value: st, defaultValue:'' } ,'em':  { value: em, defaultValue:'' } ,'ns':  { value: ns, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Sinister_Save_Tracker' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/sinister/saveEventTracker',
                                         request, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyParameter", ['oimProxyGPer', 'httpData', function(oimProxyGPer, httpData){
        return {
                'Resource_Parameter_Detail_Unsured_List' : function( showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + 'api/parameter/insured',
                                         undefined, undefined, showSpin)
                },
                'Resource_Parameter_Detail_Information_Request_List' : function( showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + 'api/parameter/information/request',
                                         undefined, undefined, showSpin)
                },
                'Resource_Parameter_Detail_Register_Type_List' : function( showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + 'api/parameter/register/type',
                                         undefined, undefined, showSpin)
                },
                'Resource_Parameter_Detail_Order_By_List' : function( showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + 'api/parameter/orderby',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyReport", ['oimProxyGPer', 'httpData', function(oimProxyGPer, httpData){
        return {
                'Resource_Download_Sinister_Report' : function( showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/report/download/sinister',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyAttachFile", ['oimProxyGPer', 'httpData', function(oimProxyGPer, httpData){
        return {
                'Resource_AttachFile_Add_WorkshopPhoto' : function( showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/attachfile/workshop/photo',
                                         undefined, undefined, showSpin)
                },
                'Resource_AttachFile_Add_WorkshopBudget' : function( showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/attachfile/workshop/budget',
                                         undefined, undefined, showSpin)
                },
                'Resource_AttachFile_Add_WorkshopLetterTotalLoss' : function( showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/attachfile/workshop/total/loss/letter/declaration',
                                         undefined, undefined, showSpin)
                },
                'Resource_AttachFile_Add_WorkshopVehiculeOutside' : function( showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/attachfile/workshop/total/loss/vehicle/outside',
                                         undefined, undefined, showSpin)
                },
                'Resource_AttachFile_Add_WorkshopVehiculeAccesory' : function( showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/attachfile/workshop/total/loss/vehicle/accessory',
                                         undefined, undefined, showSpin)
                },
                'Resource_AttachFile_Add_WorkshopVehiculeAditional' : function( showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/attachfile/workshop/total/loss/vehicle/aditional',
                                         undefined, undefined, showSpin)
                },
                'Resource_AttachFile_Add_ProficientPhoto' : function( showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/attachfile/proficient/photo',
                                         undefined, undefined, showSpin)
                },
                'Resource_AttachFile_Add_ProficientBudgetAdjust' : function( showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/attachfile/proficient/budget/adjust',
                                         undefined, undefined, showSpin)
                },
                'Resource_AttachFile_Add_WorkshopLetterLossDeclaration' : function( showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/attachfile/proficient/total/loss/inventory',
                                         undefined, undefined, showSpin)
                },
                'Resource_AttachFile_Add_WorkshopLetterConformity' : function( showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/attachfile/workshop/letter/conformity',
                                         undefined, undefined, showSpin)
                },
                'Resource_AttachFile_Add_WorkshopLetterRejection' : function( showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/attachfile/workshop/letter/rejection',
                                         undefined, undefined, showSpin)
                },
                'Resource_Image_Get' : function(idAttachFile, idPhototype, showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + helper.formatNamed('api/attachfile/image/{idAttachFile}/{idPhototype}',
                                                    { 'idAttachFile':  { value: idAttachFile, defaultValue:'' } ,'idPhototype':  { value: idPhototype, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_File_Get' : function(idAttachFile, showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + helper.formatNamed('api/attachfile/file/{idAttachFile}',
                                                    { 'idAttachFile':  { value: idAttachFile, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_AttachFile_Get_List' : function(idSinisterDetail, fileType, showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + helper.formatNamed('api/attachfile/{idSinisterDetail}/{fileType}',
                                                    { 'idSinisterDetail':  { value: idSinisterDetail, defaultValue:'' } ,'fileType':  { value: fileType, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Image_Delete' : function(idAttachFile, idSinisterDetail, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + helper.formatNamed('api/attachfile/delete/{idAttachFile}/{idSinisterDetail}',
                                                    { 'idAttachFile':  { value: idAttachFile, defaultValue:'' } ,'idSinisterDetail':  { value: idSinisterDetail, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyMovement", ['oimProxyGPer', 'httpData', function(oimProxyGPer, httpData){
        return {
                'Resource_Commentary_List' : function(idSinister, showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + helper.formatNamed('api/movement/commentary/{idSinister}',
                                                    { 'idSinister':  { value: idSinister, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Movement_Add' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/movement/add/commentary',
                                         request, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyTron", ['oimProxyGPer', 'httpData', function(oimProxyGPer, httpData){
        return {
                'Resource_Tron_Proficien_List' : function( showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + 'api/tron/proficient',
                                         undefined, undefined, showSpin)
                },
                'Resource_Tron_Workshop_List' : function(tronThirdRq, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/tron/workshop',
                                         tronThirdRq, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyLetter", ['oimProxyGPer', 'httpData', function(oimProxyGPer, httpData){
        return {
                'Resource_Compliance_Letter' : function(idSinisterDetail, fileType, showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + helper.formatNamed('api/letter/download/compliance/{idSinisterDetail}/{fileType}',
                                                    { 'idSinisterDetail':  { value: idSinisterDetail, defaultValue:'' } ,'fileType':  { value: fileType, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Withdrawal_Letter' : function(idSinisterDetail, fileType, showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + helper.formatNamed('api/letter/download/withdrawal/{idSinisterDetail}/{fileType}',
                                                    { 'idSinisterDetail':  { value: idSinisterDetail, defaultValue:'' } ,'fileType':  { value: fileType, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_PendingItem_Letter' : function(idSinisterDetail, fileType, showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + helper.formatNamed('api/letter/download/Pendingitem/{idSinisterDetail}/{fileType}',
                                                    { 'idSinisterDetail':  { value: idSinisterDetail, defaultValue:'' } ,'fileType':  { value: fileType, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Guarantee_Letter' : function(idSinisterDetail, fileType, showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + helper.formatNamed('api/letter/download/guarantee/{idSinisterDetail}/{fileType}',
                                                    { 'idSinisterDetail':  { value: idSinisterDetail, defaultValue:'' } ,'fileType':  { value: fileType, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Vehicle_Inventory_Total_Loss' : function(idSinisterDetail, fileType, showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + helper.formatNamed('api/letter/download/vehicle_inventory/{idSinisterDetail}/{fileType}',
                                                    { 'idSinisterDetail':  { value: idSinisterDetail, defaultValue:'' } ,'fileType':  { value: fileType, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Truck_Inventory_Total_Loss' : function(idSinisterDetail, fileType, showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + helper.formatNamed('api/letter/download/truck_inventory/{idSinisterDetail}/{fileType}',
                                                    { 'idSinisterDetail':  { value: idSinisterDetail, defaultValue:'' } ,'fileType':  { value: fileType, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyDamage", ['oimProxyGPer', 'httpData', function(oimProxyGPer, httpData){
        return {
                'Resource_Damage_List' : function( showSpin){
                    return httpData['get'](oimProxyGPer.endpoint + 'api/damage/list',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyDashboard", ['oimProxyGPer', 'httpData', function(oimProxyGPer, httpData){
        return {
                'Resource_Dashboard_WorkshopIndicator' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/dashboard/workshop/indicator',
                                         request, undefined, showSpin)
                },
                'Resource_Dashboard_ProficientIndicator' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/dashboard/proficient/indicator',
                                         request, undefined, showSpin)
                },
                'Resource_Dashboard_Supervisor' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/dashboard/supervisor',
                                         request, undefined, showSpin)
                },
                'Resource_Dashboard_Proficient' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/dashboard/proficient',
                                         request, undefined, showSpin)
                },
                'Resource_Dashboard_Workshop' : function(request, showSpin){
                    return httpData['post'](oimProxyGPer.endpoint + 'api/dashboard/workshop',
                                         request, undefined, showSpin)
                }
        };
     }]);
});
