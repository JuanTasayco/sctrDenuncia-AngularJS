(function ($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "sctrDenunciaRoutes", [], function () {
  var data = [
    {
      name: "root",
      abstract: true,
      views: {
        "top@root": {
          templateUrl: "/app/index/controller/template/top.html",
          controller: "topController",
        },
        "header@root": {
          templateUrl: "/app/index/controller/template/header.html",
          controller: "headerController",
        },
        "left_bar@root": {
          templateUrl: "/app/index/controller/template/left_bar.html",
          controller: "leftBarController",
        },

        "body_left@root": {
          templateUrl: "/app/index/controller/template/body_left.html",
          controller: "bodyLeftController",
        },
        "right_bar@root": {
          templateUrl: "/app/index/controller/template/right_bar.html",
          controller: "rightBarController",
        },
        "footer@root": {
          templateUrl: "/app/index/controller/template/footer.html",
          controller: "footerController",
        },
        "bottom@root": {
          templateUrl: "/app/index/controller/template/bottom.html",
          controller: "bottomController",
        },
      },
      resolve: {
        authorizedResource: [
          "accessSupplier",
          function (accessSupplier) {
            return accessSupplier.getAllObject();
          },
        ],
      },
      resolver: [
        {
          name: "layout",
          moduleName: "oim.layout",
          files: [
            "topController",
            "headerController",
            "leftBarController",
            "bodyMiddelController",
            "bodyLeftController",
            "rightBarController",
            "footerController",
            "bottomController",
          ],
        },
      ],
    },
    {
      name: "accessdenied",
      code: "",
      description: "Acceso denegado",
      url: "/accessdenied",
      parent: "root",
      views: {
        content: {
          controller: [function () {}],
          templateUrl: "/app/handlerErr/template/access-denied.html",
        },
      },
    },
    {
      name: "siteds",
      description: "SCTR Siteds",
      title: "SCTR Siteds",
      appCode: "SINIESTROS SCTR",
      urls: [
        {
          name: "siteds",
          appCode: "SINIESTROS SCTR",
          description: "Buscar",
          url: "/",
          abstract: true,
          parent: "root",
          views: {
            content: {
              controller: "complaintIndexController",
              templateUrl: "/sctrDenuncia/app/complaint/index.html",
            },
          },
          resolve: {
            protect: [function () {}],
          },
          resolver: [
            {
              name: "searchC",
              moduleName: "sctrDenuncia.app",
              files: ["complaintIndexController"],
            },
          ],
        },
        {
          name: "siteds.search",
          appCode: "SINIESTROS SCTR",
          url: "siteds/:periodo/:nrodenuncia/:codasegurado",
          template: "<coverages-search></coverages-search>",
          resolve: {
            complaintItem2: [
              "sitedsDeps",
              "$stateParams",
              "complaintItemService",
              function (requestItem, $stateParams, complaintItemService) {
                return complaintItemService.resolveItem(
                  $stateParams.nrodenuncia,
                  $stateParams.periodo,
                  $stateParams.codasegurado
                );
              },
            ],
          },
          resolver: [
            {
              name: "sitedsDeps",
              moduleName: "sctrDenuncia.app",
              files: [
                "coveragesSearchFilterComponent",
                "coveragesSearchResultComponent",
                "coveragesSearchComponent",
                "complaintEditorContainerComponent"
              ],
            },
          ],
        },
      ],
    },
    {
      name: "search",
      appCode: "SINIESTROS SCTR",
      description: "SCTR Denuncias",
      title: "SCTR Denuncias",
      urls: [
        {
          name: "complaint",
          description: "Buscar",
          url: "/",
          abstract: true,
          parent: "root",
          views: {
            content: {
              controller: "complaintIndexController",
              templateUrl: "/sctrDenuncia/app/complaint/index.html",
            },
          },
          resolve: {
            protect: [function () {}],
          },
          resolver: [
            {
              name: "searchC",
              moduleName: "sctrDenuncia.app",
              files: ["complaintIndexController"],
            },
          ],
        },
        {
          name: "complaint.home",
          appCode: "SINIESTROS SCTR",
          description: "Home",
          url: "",
          template: "<complaint-home-container></complaint-home-container>",
          resolver: [
            {
              name: "homeComplaint",
              moduleName: "sctrDenuncia.app",
              files: [
                "complaintHomeContainerComponent"
              ],
            },
          ],
        },
        {
          name: "complaint.search",
          appCode: "SINIESTROS SCTR",
          description: "Buscar denuncia",
          url: "search",
          template: "<complaint-search-container></complaint-search-container>",
          resolver: [
            {
              name: "searchComplaints",
              moduleName: "sctrDenuncia.app",
              files: [
                "complaintSearchContainerComponent",
                "complaintSearchResultComponent",
                "complaintSearchFilterComponent",
              ],
            },
          ],
        },
        {
          name: "complaint.search.params",
          appCode: "SINIESTROS SCTR",
          description: "Buscar Denuncia",
          url: "search/:type/:documentNumber",
          template: "<complaint-search-container></complaint-search-container>",
          resolver: [
            {
              name: "searchComplaints",
              moduleName: "sctrDenuncia.app",
              files: [
                "complaintSearchContainerComponent",
                "complaintSearchResultComponent",
                "complaintSearchFilterComponent",
              ],
            },
          ],
        },
        {
          name: "complaint.new",
          description: "Nueva Denuncia",
          appCode: "SINIESTROS SCTR",
          url: "complaintnew",
          template: "<complaint-new-container></complaint-new-container>",
          resolver: [
            {
              name: "newComplaints",
              moduleName: "sctrDenuncia.app",
              files: [
                "complaintNewComponent",
                "complaintNewContainerComponent",
                "modalnuevoafiliado",
                "modaldenuncias",
              ],
            },
          ],
        },
        {
          name: "complaint.item",
          appCode: "SINIESTROS SCTR",
          description: "Denuncia",
          url: "complaint/:periodo/:nrodenuncia/:codasegurado",
          template: "<complaint-editor-container></complaint-editor-container>",
          resolve: {
            complaintItem: [
              "requestItem",
              "$stateParams",
              "complaintItemService",
              function (requestItem, $stateParams, complaintItemService) {
                return complaintItemService.resolveItem(
                  $stateParams.nrodenuncia,
                  $stateParams.periodo,
                  $stateParams.codasegurado
                );
              },
            ],
          },
          resolver: [
            {
              name: "requestItem",
              moduleName: "sctrDenuncia.app",
              files: [
                "complaintEditorDetailComponent",
                "complaintHistoryComponent",
                "complaintEditorManagementComponent",
                "complaintEditorContainerComponent",
                "modalsearchpolicy"
              ],
            },
          ],
        },
        {
          name: "complaint.disabilitySearch",
          appCode: "SINIESTROS SCTR",
          description: "Consultar Solicitud de Invalidez",
          url: "disabilitySearch",
          template: "<complaint-disability-search-container></complaint-disability-search-container>",
          resolver: [
            {
              name: "searchDisabilityComplaints",
              moduleName: "sctrDenuncia.app",
              files: [
                "complaintDisabilitySearchContainerComponent",
                "complaintDisabilitySearchResultComponent",
                "complaintDisabilitySearchFilterComponent"
              ],
            },
          ],
        },
        {
          name: "complaint.disabilityNew",
          description: "Nueva Solicitud",
          appCode: "SINIESTROS SCTR",
          url: "disabilityNew",
          template: "<complaint-disability-new-container></complaint-disability-new-container>",
          resolver: [
            {
              name: "newComplaints",
              moduleName: "sctrDenuncia.app",
              files: [
                "complaintDisabilityNewComponent",
                "complaintDisabilityNewContainerComponent"
              ],
            },
          ],
        },
        {
          name: "complaint.disabilityItem",
          appCode: "SINIESTROS SCTR",
          description: "Detalle de Solicitud",
          url: "disabilityDetail/:nrosolicitud",
          template: "<complaint-disability-editor-container></complaint-disability-editor-container>",
          resolve: {
            complaintItem: [
              "requestDisabilityItem",
              "$stateParams",
              "complaintDisabilityItemService",
              function (requestDisabilityItem, $stateParams, complaintDisabilityItemService) {
                return complaintDisabilityItemService.resolveItem(
                  $stateParams.nrosolicitud
                );
              },
            ],
          },
          resolver: [
            {
              name: "requestDisabilityItem",
              moduleName: "sctrDenuncia.app",
              files: [
                "complaintDisabilityEditorDetailComponent",
                "complaintDisabilityHistoryComponent",
                "complaintDisabilityEditorMedicalAppointmentComponent",
                "complaintDisabilityEditorMedicalAuditComponent",
                "complaintDisabilityEditorContainerComponent"
              ],
            },
          ],
        },
      ],
    },
  ];
  return data;
});