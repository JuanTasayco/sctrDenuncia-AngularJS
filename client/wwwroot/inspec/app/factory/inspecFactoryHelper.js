define(['angular', 'lodash', 'moment'], function(ng, _, moment) {
  var currentUser, currentMenu, currentPermisess;
  var menuInspecciones = [
    {
      label: 'Solicitudes',
      objMXKey: 'SOLICITUDES|REGINS',
      state: 'solicitudes',
      isSubMenu: false,
      actived: false,
      show: true
    },
    {label: 'Cotizaciones', objMXKey: 'REGSOL|REGINS', state: 'cotizaciones', isSubMenu: false, actived: false},
    {label: 'Programaciones', objMXKey: 'PROGRAMACION', state: 'programaciones', isSubMenu: false, actived: false},
    {label: 'Agenda', objMXKey: 'AGENDA', state: 'agenda', isSubMenu: false, actived: false},
    {
      label: 'Administración',
      objMXKey: 'ADMINISTRACION',
      state: 'administracion',
      isSubMenu: true,
      actived: false,
      menu: [
        {label: 'Automas', objMXKey: 'AUTOMAS', state: 'administracionAutomas', actived: false},
        {label: 'Proveedores', objMXKey: 'PROVEEDORES', state: 'administracionProveedores', actived: false},
        {
          label: 'Reglas de asignación',
          objMXKey: 'REGLAS ASIGNACION|REGLAS DE ASIGNACION',
          state: 'administracionReglasAsignacion',
          actived: false
        },
        {
          label: 'Coordinadores',
          objMXKey: 'COORDINADOR|COORDINADORES',
          state: 'administracionCoordinador',
          actived: false
        },
        {label: 'Inspectores', objMXKey: 'INSPECTOR|INSPECTORES', state: 'administracionInspectores', actived: false},
        {label: 'Parámetros', objMXKey: 'PARAMETROS', state: 'administracionParametro', actived: false}
        , {
          label: 'Pérdidas y Robos Totales'
          , objMXKey: 'PÉRDIDAS TOTALES'
          , state: 'administracionPerdidasRobosTotales'
          , actived: false}
        , {
          label: 'Exclusiones de Autoinspección'
          , objMXKey: 'EXCLUSIONES DE AUTOINSPECCIÓN'
          , state: 'administracionExclusiones'
          , actived: false
        }
      ]
    },
    {
      label: 'Reportes',
      objMXKey: 'REPORTES',
      state: 'reportes',
      isSubMenu: true,
      actived: false,
      menu: [
        {
          label: 'Gestión de inspecciones',
          objMXKey: 'GESTION DE INSPECCIONES|GESTION INSPECCIONES',
          state: 'reportesGestionInspecciones',
          actived: false
        },
        {
          label: 'Gestión de tiempos',
          objMXKey: 'GESTION DE TIEMPOS|GESTION TIEMPOS',
          state: 'reportesGestionTiempos',
          actived: false
        },
        {
          label: 'Gestión por departamentos',
          objMXKey: 'GESTION POR DEPARTAMENTOS|GESTION X DPTOS',
          state: 'reportesGestionDepartamento',
          actived: false
        },
        {label: 'Detalle vehículos', objMXKey: 'DETALLE VEHICULOS', state: 'reportesDetalleVehiculo', actived: false},
        {label: 'Seguimiento', objMXKey: 'SEGUIMIENTO', state: 'reportesSeguimiento', actived: false},
        {label: 'Reporte de alertas', objMXKey: 'REPORTE DE ALERTAS', state: 'reportesDetalleAlerta', actived: false}
      ]
    }
  ];

  var inspecFactoryHelper = {
    getCurrentUser: getCurrentUser,
    setAccessData: setAccessData,
    getCurrentMenu: getCurrentMenu,
    canDo: canDo,
    setInspectContractor: setInspectContractor
    // proccessMenu: proccessMenu
  };

  return inspecFactoryHelper;

  function setAccessData(objAccess) {
    currentUser = ng.extend({}, objAccess.profile, {
      loginUserName: objAccess.profile.loginUserName.toUpperCase(),
      canDo: canDo
    });
    currentPermisess = _getPermittedObjects(objAccess.accessSubMenu);
    currentMenu = _proccessMenu();
  }

  function getCurrentUser() {
    return currentUser;
  }

  function getCurrentMenu() {
    return currentMenu;
  }

  function canDo(obj) {
    var objs = obj.split('|');
    return _.some(currentPermisess, function(permise) {
      return _.include(objs, permise);
    });
  }

  function _getPermittedObjects(rawMenu) {
    var permittedObjects = [];
    var notViews = ['INSPECCIONES', 'ACCIONES'];
    _.forEach(rawMenu, function(item) {
      if (!_.include(notViews, item.nombreCabecera)) {
        permittedObjects.push(item.nombreCabecera);
      }
      _.forEach(item.items, function(subItem) {
        permittedObjects.push(subItem.nombreCorto);
      });
    });
    return permittedObjects;
  }

  function _proccessMenu() {
    var proccessedMenu = [];
    _.forEach(menuInspecciones, function(parentMenu) {
      if (parentMenu.hasOwnProperty('objMXKey')) {
        parentMenu.show = canDo(parentMenu.objMXKey);
      }
      if (parentMenu.hasOwnProperty('menu')) {
        parentMenu.menu.forEach(function(childMenu) {
          if (childMenu.hasOwnProperty('objMXKey')) {
            childMenu.show = canDo(childMenu.objMXKey);
          }
        });
      }
      proccessedMenu.push(parentMenu);
    });
    return proccessedMenu;
  }

  function setInspectContractor(data) {
    var contractorData = {};
    contractorData.searchedPerson = false;
    contractorData.mNroDocumento = data.documentNumber;
    contractorData.mTipoDocumento = { Codigo: data.documentType.Codigo};
    contractorData.mContactName = data.contactName;
    contractorData.mRazonSocial = data.Nombre;
    contractorData.mActividadEconomica = {
      Codigo: data.ActividadEconomica ? data.ActividadEconomica.Codigo : null
    };
    contractorData.mNomContratante = data.Nombre;
    contractorData.mApePatContratante = data.ApellidoPaterno;
    contractorData.mApeMatContratante = data.ApellidoMaterno;
    contractorData.mSexo = data.Sexo === '1' ?  'H' : 'M';
    contractorData.mEstadoCivil = {
      CodigoEstadoCivil: data.civilState ? data.civilState.Codigo : null,
      NombreEstadoCivil: data.civilState ? data.civilState.Descripcion : ''
    };
    contractorData.mProfesion = {
      Codigo: data.Profesion ? data.Profesion.Codigo : null,
      Descripcion: data.Profesion ? data.Profesion.Descripcion : ''
    };
    contractorData.mNacionalidad = {
      Codigo: data.nationality ? data.nationality.Codigo : null,
      Descripcion: data.nationality ? data.nationality.Descripcion : ''
    };
    contractorData.mTelfPersonal = data.Telefono;
    contractorData.mCelular = data.Telefono2;
    contractorData.mTelfOficina = data.TelefonoOficina;
    contractorData.mEmailPersonal = data.CorreoElectronico || data.emailPersonal;
    contractorData.mEmailOficina = data.CorreoElectronicoOffice;
    contractorData.saldoMapfreDolares = isNaN(parseFloat(data.SaldoMapfreDolar)) ? 0 : parseFloat(data.SaldoMapfreDolar);
    contractorData.mFechaNacimiento = data.FechaNacimiento ? moment(data.FechaNacimiento, 'D/MM/YYYY h:mm:ss A').toDate() : null;
    contractorData.mDepartamento = {
      Codigo: data.Department ? data.Department.Codigo : null,
      Descripcion: data.Department ? data.Department.Descripcion : null,
    };
    contractorData.mProvincia = {
      Codigo: data.Province ? data.Province.Codigo : null,
      Descripcion: data.Province ? data.Province.Descripcion : null,
    };
    contractorData.mDistrito = {
      Codigo: data.District ? data.District.Codigo : null,
      Descripcion: data.District ? data.District.Descripcion : null,
    };
    contractorData.mSelectVia = {
      Codigo: data.Via ? data.Via.Codigo : null
    };
    contractorData.mSelectNumero = {
      Codigo: data.NumberType ? data.NumberType.Codigo : null
    };
    contractorData.mSelectInterior = {
      Codigo: data.Inside && +data.Inside.Codigo > 0 ? data.Inside.Codigo : null
    };
    contractorData.mSelectZona = {
      Codigo: data.Zone && data.Zone.Codigo > 0 ? data.Zone.Codigo : null
    };
    contractorData.mVia = data.NombreVia;
    contractorData.mNumero = data.TextoNumero;
    contractorData.mInterior = data.TextoInterior;
    contractorData.mZona = data.TextoZona;
    contractorData.mReferencias = data.Referencia;

    return contractorData;
  }
});
