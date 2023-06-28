define(["angular", "/grqc/app/factory/grqcFactory.js"], function (ng) {

  grqcBandejaGestionController.$inject = ["$scope", "$rootScope", "grqcFactory", "$q", "$state",
    "mModalAlert", "mModalConfirm", "oimClaims", "$http", '$filter', 'mpSpin'];

  function grqcBandejaGestionController($scope, $rootScope, grqcFactory, $q, $state,
    mModalAlert, mModalConfirm, oimClaims, $http, $filter, mpSpin) {
    //$scope.API_POLIZAS = 'http://10.160.120.216/oim_polizas/';
    $scope.API_POLIZAS = constants.system.api.endpoints.policy;
    console.log('API_POLIZAS');
    console.log($scope.API_POLIZAS);

    // LISTADO
    $scope.LS_ESTADOS = [];
    $scope.LS_SITUACIONES = [];
    $scope.FILTROS = {};
    $scope.SOLICITUD = {};
    $scope.VISTA = '';

    $scope.REQUERIMIENTOS = [];
    $scope.REQUERIMIENTOS_PAGINA = [];
    $scope.PAGINADO_NU_PAGI = 1;
    $scope.PAGINADO_CA_PAGI = 10;

    // REGISTRO
    $scope.REQ = {};
    $scope.REQ_TIPO = '';
    $scope.LS_REQ_EMPRESAS = [];
    $scope.LS_REQ_SECTORES = [];
    $scope.LS_REQ_MOTIVOS = [];
    $scope.LS_REQ_SUBMOTIVOS = [];
    $scope.ARCHIVO = null;

    $scope.FN_PAGINA = function(){
      console.log('CAMBIO DE PÁGINA');
      $scope.REQUERIMIENTOS_PAGINA = $scope.REQUERIMIENTOS.slice(
        ($scope.PAGINADO_NU_PAGI - 1) * $scope.PAGINADO_CA_PAGI,
        $scope.PAGINADO_NU_PAGI * $scope.PAGINADO_CA_PAGI
      );
    }

    $scope.FN_FILTRAR = function(){
      $scope.SOLICITUD.cod_usua = $scope.FILTROS.cod_usua; //fijo
      $scope.SOLICITUD.cod_aprob = $scope.FILTROS.cod_aprob; //fijo

      if($scope.FILTROS.id_req == '' || $scope.FILTROS.id_req == null){
        $scope.SOLICITUD.id_req = 0;
      }
      else{
        $scope.SOLICITUD.id_req = parseInt($scope.FILTROS.id_req);
      }

      if($scope.FILTROS.num_poliza == '' || $scope.FILTROS.num_poliza == null){
        $scope.SOLICITUD.num_poliza = '-';
      }
      else{
        $scope.SOLICITUD.num_poliza = $scope.FILTROS.num_poliza;
      }
      
      $scope.SOLICITUD.tipo_flujo = $scope.FILTROS.tipo_flujo;
      $scope.SOLICITUD.estado = $scope.FILTROS.estado; //fijo
      $scope.SOLICITUD.fec_ini = $scope.FILTROS.fec_ini;
      $scope.SOLICITUD.fec_fin = $scope.FILTROS.fec_fin; 
      $scope.SOLICITUD.situacion = $scope.FILTROS.situacion;
      $scope.FN_BUSCAR();
    }

    $scope.FN_BUSCAR = function(){
      mpSpin.start();
      $http.post(        
        $scope.API_POLIZAS + 'api/cobranza/decesos/requerimientos/ejecutivoCobranza/0', 
        {
          "cod_usua": "G",
          "cod_aprob": "-",
          "id_req": $scope.SOLICITUD.id_req,
          "num_poliza": $scope.SOLICITUD.num_poliza,
          "tipo_flujo": $scope.SOLICITUD.tipo_flujo,
          "estado": $scope.SOLICITUD.estado,
          "fec_ini": $scope.SOLICITUD.fec_ini,
          "fec_fin": $scope.SOLICITUD.fec_fin
        }).then(function (response) {
          mpSpin.end();
          console.log('response LISTAR');
          console.log(response);

          $scope.REQUERIMIENTOS = response.data.Data.resultado.requerimientos || [];

          /*VALIDACION INICIO*/
          /*if($scope.REQUERIMIENTOS.length > 0){
            var esValido = true;
            for (var i = 0; i < $scope.REQUERIMIENTOS.length; i++) {
              if($scope.REQUERIMIENTOS[i].cod_aprob != '-' && $scope.REQUERIMIENTOS[i].cod_aprob != $scope.USUARIO){
                esValido = false;  
                break;       
              }
            }
            if(!esValido){
              $scope.REQUERIMIENTOS = [];
              mModalAlert.showError('Ocurrió un problema de Validación de Usuario', 'Error');  
              return false;            
            }           
          }*/
          /*VALIDACION FIN*/

          if($scope.SOLICITUD.situacion != '-'){
            $scope.REQUERIMIENTOS = $filter('filter')($scope.REQUERIMIENTOS, function (fila) {
              return (
                ( $scope.SOLICITUD.situacion == 'S' && (fila.estado == 'ATE' || fila.estado == 'REC' || fila.estado == 'NVA') ) ||
                ( $scope.SOLICITUD.situacion == 'N' && !(fila.estado == 'ATE' || fila.estado == 'REC' || fila.estado == 'NVA') )
              );
            });
          }
          $scope.PAGINADO_NU_PAGI = 1;
          $scope.FN_PAGINA();
        })['catch'](function (e) {
          mpSpin.end();
          mModalAlert.showError('Ocurrió un problema', 'Error');
        });
    }

    $scope.FN_GRABAR = function(estado_requerimiento){
      console.log('REQ');
      console.log($scope.REQ);

      /*VALIDACIÓN*/ 
      if($scope.REQ.sustento_comentario == null || $scope.REQ.sustento_comentario == undefined){        
        $scope.REQ.sustento_comentario = '';
      }           

      /*CONFIRMACIÓN*/
      mModalConfirm.confirmInfo('¿Estás seguro(a) que desea registrar la atención?','EVENTO','').then(function(result) {
        console.log('result');
        console.log(result);
        if (result) {
          var fd = new FormData();
          /*REQUEST*/
          var request = {
            estado: estado_requerimiento,
            cod_usua: $scope.USUARIO.toUpperCase(),
            sustento_archivo: '-',
            sustento_comentario: $scope.REQ.sustento_comentario.toUpperCase()
          }
          fd.append("request", JSON.stringify(request));
           /*ARCHIVO*/
          if($scope.ARCHIVO != null){
            console.log('Se adjunta archivo');
            fd.append("adjunto", $scope.ARCHIVO);
          } 
          
          /*GRABAR*/
          mpSpin.start();
          $http.post(        
            $scope.API_POLIZAS + 'api/cobranza/requerimiento/' + $scope.REQ.id_req + '/evento', 
            fd,
            {
              transformRequest: [],
              headers: { 'Content-Type': undefined }
            }
          ).then(function (response) {
            mpSpin.end();
            console.log('response GRABAR');
            console.log(response);  
            var data = response.data.Data || {};
            if(data.cod == '200'){
              mModalAlert.showSuccess('Registro Correcto', 'Registro').then(function(result) {
                $scope.FN_VISTA_LISTAR(true);
              })['catch'](function (e) {
                $scope.FN_VISTA_LISTAR(true);
              });              
            }else{
              mModalAlert.showError('No se pudo registrar la atención', 'Error');
            }      
          })['catch'](function (e) {
            mpSpin.end();
            mModalAlert.showError('Ocurrió un problema', 'Error');
          });    
        }
      });      


    }

    $scope.fileSelected = function (element) {
      var myFileSelected = element.files[0];
      $scope.ARCHIVO = myFileSelected;
    };

    $scope.FN_VISTA_ATENDER = function(REQUERIMIENTO){
      $scope.VISTA = 'EVENTO';
      $scope.REQ_TIPO = REQUERIMIENTO.tipo_flujo;
      $scope.REQ = {
        num_poliza: REQUERIMIENTO.num_poliza,
        cod_cia: REQUERIMIENTO.cod_cia,
        cod_sector: REQUERIMIENTO.cod_sector,
        id_motivo: REQUERIMIENTO.id_motivo,
        id_submotivo: REQUERIMIENTO.cod_supervisor || 0,
        tiene_submotivos: false,
        nom_placa: REQUERIMIENTO.nom_gestor,
        fec_opcional_ini: REQUERIMIENTO.fec_efec_poliza,
        fec_opcional_fin: REQUERIMIENTO.fec_vcto_poliza,          
        info_adicional: REQUERIMIENTO.info_adicional,     
        poliza: {
          validacion: false,
          num_spto: null,
          cod_ramo: null,
          cod_agt: null,
          nom_agt: null,
          nom_tercero: null,
          fec_efec_poliza: null,
          fec_vcto_poliza: null,
          estado_poliza: null
        },
        estado: REQUERIMIENTO.estado,
        id_req: REQUERIMIENTO.id_req,
        eventos: [],
        emitir: true,
        dias_permitidos: -1,
        dias_transcurridos: 0,
        requiere_placa: false,
        requiere_fechas: false          
      };

      // TIEMPOS
      if($scope.REQ_TIPO == 'REQ OBSERVACION'){
        if(REQUERIMIENTO.estado == 'REG'){        
          $scope.REQ.dias_permitidos = $scope.REQ_OBSE_CONFIG.ca_dias_supcob_aten || -1;
        } else if(REQUERIMIENTO.estado == 'APR'){
          $scope.REQ.dias_permitidos = $scope.REQ_OBSE_CONFIG.ca_dias_supcom_aten || -1;
        } else if(REQUERIMIENTO.estado == 'REV'){
          $scope.REQ.dias_permitidos = $scope.REQ_OBSE_CONFIG.ca_dias_supcob_aten || -1;
        }
      } else if($scope.REQ_TIPO == 'REQ GESTION'){
        if(REQUERIMIENTO.estado == 'REG'){        
          $scope.REQ.dias_permitidos = $scope.REQ_GEST_CONFIG.ca_dias_supcob_aten || -1;
        } else if(REQUERIMIENTO.estado == 'DER'){
          $scope.REQ.dias_permitidos = $scope.REQ_GEST_CONFIG.ca_dias_asiste_aten || -1;
        } else if(REQUERIMIENTO.estado == 'REV'){
          $scope.REQ.dias_permitidos = $scope.REQ_GEST_CONFIG.ca_dias_supcob_aten || -1;
        }
      } else if($scope.REQ_TIPO == 'REQ AUTOSERVICIO'){
        if(REQUERIMIENTO.estado == 'REG'){        
          $scope.REQ.dias_permitidos = $scope.REQ_AUTO_CONFIG.ca_dias_supcob_aten || -1;
        } else if(REQUERIMIENTO.estado == 'DER'){
          $scope.REQ.dias_permitidos = $scope.REQ_AUTO_CONFIG.ca_dias_asiste_aten || -1;
        } else if(REQUERIMIENTO.estado == 'REV'){
          $scope.REQ.dias_permitidos = $scope.REQ_AUTO_CONFIG.ca_dias_supcob_aten || -1;
        }
      }
      console.log('$scope.REQ.dias_permitidos');
      console.log($scope.REQ.dias_permitidos);

      var fecha_evento = '';
      // EVENTO INICIAL  
      var fec_emision = REQUERIMIENTO.fec_emision.split('|') || [];
      $scope.REQ.eventos.push({ 
        "estado": 'REG',
        "fec_evento": REQUERIMIENTO.fec_emision_spto,
        "sustento_comentario": REQUERIMIENTO.info_adicional,
        "nom_documento": fec_emision[0] || '',
        "id_documento": fec_emision[1] || '',
        "cod_usua": REQUERIMIENTO.cod_usua
      });  
      fecha_evento = REQUERIMIENTO.fec_emision_spto;

      // EVENTOS 
      console.log('REQUERIMIENTO.eventos');
      console.log(REQUERIMIENTO.eventos);
      var eventos = REQUERIMIENTO.eventos || '';
      eventos = eventos.trim();

      if(eventos != ''){
        eventos = eventos.split(';');
        for (var i = 0; i < eventos.length; i++) {
          var evento = eventos[i] || '';
          evento = evento.trim();
          evento = evento.split(',');
          $scope.REQ.eventos.push({ 
            "estado": evento[2] || '',
            "fec_evento": evento[3] || '',
            "sustento_comentario": evento[5] || '',
            "nom_documento": evento[7] || '',
            "id_documento": evento[6] || '',
            "cod_usua": evento[8] || ''
          });  
          fecha_evento = evento[3] || '';
        }
      }

      // REQUIERE PLACA / FECHAS
      if($scope.REQ_TIPO == 'REQ AUTOSERVICIO'){  
        if($scope.REQ.id_submotivo == 0){
          $scope.REQ.tiene_submotivos = false;
        }else{
          $scope.REQ.tiene_submotivos = true;
        }

        if($scope.REQ.id_motivo == 71211){
          $scope.REQ.requiere_placa = true;
        }
        else{
          $scope.REQ.requiere_placa = false;
        }
        if($scope.REQ.id_motivo == 71214 || $scope.REQ.id_motivo == 71215){
          $scope.REQ.requiere_fechas = true;
        }
        else{
          $scope.REQ.requiere_fechas = false;
        }
      }         

      // FECHA EVENTO
      fecha_evento = fecha_evento.substring(0,10) || '';
      var fecha_parts = fecha_evento.split('/');
      if(fecha_parts.length == 3){
        fecha_evento = new Date(fecha_parts[2], fecha_parts[1] - 1, fecha_parts[0]); 
      }
      console.log('fecha_evento');
      console.log(fecha_evento);

      console.log('$scope.REQ.eventos');
      console.log($scope.REQ.eventos);

      //FECHAS VALIDACION
      $scope.REQ.emitir = true;
      $scope.REQ.dias_transcurridos = 0;
            
      console.log(getBusinessDateCount(fecha_evento, $scope.FECHA));
      var diffDays = (getBusinessDateCount(fecha_evento, $scope.FECHA) -1);
      console.log('diffDays');
      console.log(diffDays);
            
      $scope.REQ.dias_transcurridos = diffDays;
      if( ($scope.REQ.dias_permitidos != -1) && (diffDays > $scope.REQ.dias_permitidos) ){
        $scope.REQ.emitir = false;        
      }     

      if($scope.REQ_TIPO == 'REQ OBSERVACION' || $scope.REQ_TIPO == 'REQ GESTION'){
        console.log('Obteniendo Póliza...');
        console.log($scope.REQ.num_poliza); 
        $scope.REQ.poliza.validacion = true;
        mpSpin.start();
        $http.get($scope.API_POLIZAS + '/api/cobranza/deceso/' + $scope.REQ.num_poliza + '/ejecutivoCobranza/0', { params: {} })
        .then(function (response) {
          mpSpin.end();
          console.log('response VALIDAR');
          console.log(response);
          var polizas = response.data.Data.datos.polizas || [];
          
          if(polizas){
            if(polizas.length > 0){
              $scope.REQ.poliza.num_spto = polizas[0].num_spto || 0;
              $scope.REQ.poliza.cod_ramo = polizas[0].cod_ramo;
              $scope.REQ.poliza.cod_agt = polizas[0].cod_agt;
              $scope.REQ.poliza.nom_agt = polizas[0].fec_efec_spto;
              $scope.REQ.poliza.nom_tercero = polizas[0].nom_tercero; 
              $scope.REQ.poliza.fec_efec_poliza = polizas[0].fec_efec_poliza; 
              $scope.REQ.poliza.fec_vcto_poliza = polizas[0].fec_vcto_poliza; 
              $scope.REQ.poliza.estado_poliza = polizas[0].fec_vcto_spto;                        
              $scope.REQ.poliza.mca_provisional = polizas[0].fec_validez; 

              $scope.REQ.poliza.fec_actu = polizas[0].fec_actu;  
              $scope.REQ.poliza.tip_gestor = polizas[0].tip_gestor;  
              $scope.REQ.poliza.cod_gestor = polizas[0].cod_gestor;  
              $scope.REQ.poliza.nom_gestor = polizas[0].nom_gestor;  
              $scope.REQ.poliza.cod_supervisor = polizas[0].cod_supervisor;  
              $scope.REQ.poliza.nom_supervisor = polizas[0].nom_supervisor; 
  
              //$scope.REQ.cod_cia = polizas[0].cod_cia;
              //$scope.REQ.cod_sector = polizas[0].cod_sector; 

              //mModalAlert.showSuccess('Póliza Encontrada', 'Validación');
            }else{
              mModalAlert.showWarning('Datos de Póliza No Encontrada', 'Consulta');
            }
          }else{
            mModalAlert.showError('No se pudo obtener datos de Póliza', 'Consulta');
          }      
        })['catch'](function (e) {
          mpSpin.end();
          mModalAlert.showError('Ocurrió un problema al obtener datos de Póliza', 'Error');
        }); 
      }

      $scope.ARCHIVO = null;    
      var fileElement = document.querySelector('#fileFrmAdjunto');
      angular.element(fileElement).val(null);

      // BOTONES
      if($scope.REQ_TIPO == 'REQ OBSERVACION' && $scope.REQ.estado == 'REG'){
        $scope.mostrar_aprobado = true;
      }
      if($scope.REQ_TIPO == 'REQ OBSERVACION' && $scope.REQ.estado == 'REG'){
        $scope.mostrar_rechazado = true;       
      }
      if(
          ($scope.REQ_TIPO == 'REQ GESTION' || $scope.REQ_TIPO == 'REQ AUTOSERVICIO') && $scope.REQ.estado == 'REG'
        ){
          $scope.mostrar_derivado = true;
      }
      if(
        ( ($scope.REQ_TIPO == 'REQ OBSERVACION') && $scope.REQ.estado == 'APR' ) ||
        ( ($scope.REQ_TIPO == 'REQ GESTION' || $scope.REQ_TIPO == 'REQ AUTOSERVICIO') && $scope.REQ.estado == 'DER' ) 
      ){
        $scope.mostrar_revisado = true;
      }
      if(
        ( ($scope.REQ_TIPO == 'REQ OBSERVACION') && $scope.REQ.estado == 'REV' ) ||
        ( ($scope.REQ_TIPO == 'REQ GESTION' || $scope.REQ_TIPO == 'REQ AUTOSERVICIO') && ($scope.REQ.estado == 'REG' || $scope.REQ.estado == 'REV') ) 
      ){
        $scope.mostrar_atendido = true;
        $scope.mostrar_nosubsanado = true;
      }      
    }

    $scope.FN_VISTA_DETALLE = function(REQUERIMIENTO){
      $scope.VISTA = 'DETALLE';
      $scope.REQ_TIPO = REQUERIMIENTO.tipo_flujo;
      $scope.REQ = {
        num_poliza: REQUERIMIENTO.num_poliza,
        cod_cia: REQUERIMIENTO.cod_cia,
        cod_sector: REQUERIMIENTO.cod_sector,
        id_motivo: REQUERIMIENTO.id_motivo,
        id_submotivo: REQUERIMIENTO.cod_supervisor || 0,
        tiene_submotivos: false,
        nom_placa: REQUERIMIENTO.nom_gestor,
        fec_opcional_ini: REQUERIMIENTO.fec_efec_poliza,
        fec_opcional_fin: REQUERIMIENTO.fec_vcto_poliza,     
        info_adicional: REQUERIMIENTO.info_adicional,     
        poliza: {
          validacion: false,
          num_spto: null,
          cod_ramo: null,
          cod_agt: null,
          nom_agt: null,
          nom_tercero: null,
          fec_efec_poliza: null,
          fec_vcto_poliza: null,
          estado_poliza: null,

          fec_actu: null,  
          tip_gestor: null, 
          cod_gestor: null,  
          nom_gestor: null,  
          cod_supervisor: null,  
          nom_supervisor: null 
        },
        estado: REQUERIMIENTO.estado,
        id_req: REQUERIMIENTO.id_req,
        eventos: [],
        requiere_placa: false,
        requiere_fechas: false  
      };

      // EVENTO INICIAL  
      var fec_emision = REQUERIMIENTO.fec_emision.split('|') || [];
      $scope.REQ.eventos.push({ 
        "estado": 'REG',
        "fec_evento": REQUERIMIENTO.fec_emision_spto,
        "sustento_comentario": REQUERIMIENTO.info_adicional,
        "nom_documento": fec_emision[0] || '',
        "id_documento": fec_emision[1] || '',
        "cod_usua": REQUERIMIENTO.cod_usua
      });  

      // EVENTOS 
      console.log('REQUERIMIENTO.eventos');
      console.log(REQUERIMIENTO.eventos);
      var eventos = REQUERIMIENTO.eventos || '';
      eventos = eventos.trim();

      if(eventos != ''){
        eventos = eventos.split(';');
        for (var i = 0; i < eventos.length; i++) {
          var evento = eventos[i] || '';
          evento = evento.trim();
          evento = evento.split(',');
          $scope.REQ.eventos.push({ 
            "estado": evento[2] || '',
            "fec_evento": evento[3] || '',
            "sustento_comentario": evento[5] || '',
            "nom_documento": evento[7] || '',
            "id_documento": evento[6] || '',
            "cod_usua": evento[8] || ''
          });  
        }
      }
      
      console.log('$scope.REQ.eventos');
      console.log($scope.REQ.eventos);

      // REQUIERE PLACA / FECHAS
      if($scope.REQ_TIPO == 'REQ AUTOSERVICIO'){  
        if($scope.REQ.id_submotivo == 0){
          $scope.REQ.tiene_submotivos = false;
        }else{
          $scope.REQ.tiene_submotivos = true;
        }

        if($scope.REQ.id_motivo == 71211){
          $scope.REQ.requiere_placa = true;
        }
        else{
          $scope.REQ.requiere_placa = false;
        }
        if($scope.REQ.id_motivo == 71214 || $scope.REQ.id_motivo == 71215){
          $scope.REQ.requiere_fechas = true;
        }
        else{
          $scope.REQ.requiere_fechas = false;
        }
      }      

      if($scope.REQ_TIPO == 'REQ OBSERVACION' || $scope.REQ_TIPO == 'REQ GESTION'){
        console.log('Obteniendo Póliza...');
        console.log($scope.REQ.num_poliza); 
        $scope.REQ.poliza.validacion = true;
        mpSpin.start();
        $http.get($scope.API_POLIZAS + '/api/cobranza/deceso/' + $scope.REQ.num_poliza + '/ejecutivoCobranza/0', { params: {} })
        .then(function (response) {
          mpSpin.end();
          console.log('response VALIDAR');
          console.log(response);
          var polizas = response.data.Data.datos.polizas || [];
          
          if(polizas){
            if(polizas.length > 0){
              $scope.REQ.poliza.num_spto = polizas[0].num_spto || 0;
              $scope.REQ.poliza.cod_ramo = polizas[0].cod_ramo;
              $scope.REQ.poliza.cod_agt = polizas[0].cod_agt;
              $scope.REQ.poliza.nom_agt = polizas[0].fec_efec_spto;
              $scope.REQ.poliza.nom_tercero = polizas[0].nom_tercero; 
              $scope.REQ.poliza.fec_efec_poliza = polizas[0].fec_efec_poliza; 
              $scope.REQ.poliza.fec_vcto_poliza = polizas[0].fec_vcto_poliza; 
              $scope.REQ.poliza.estado_poliza = polizas[0].fec_vcto_spto;                        
              $scope.REQ.poliza.mca_provisional = polizas[0].fec_validez; 

              $scope.REQ.poliza.fec_actu = polizas[0].fec_actu;  
              $scope.REQ.poliza.tip_gestor = polizas[0].tip_gestor;  
              $scope.REQ.poliza.cod_gestor = polizas[0].cod_gestor;  
              $scope.REQ.poliza.nom_gestor = polizas[0].nom_gestor;  
              $scope.REQ.poliza.cod_supervisor = polizas[0].cod_supervisor;  
              $scope.REQ.poliza.nom_supervisor = polizas[0].nom_supervisor; 
  
              //$scope.REQ.cod_cia = polizas[0].cod_cia;
              //$scope.REQ.cod_sector = polizas[0].cod_sector; 

              //mModalAlert.showSuccess('Póliza Encontrada', 'Validación');
            }else{
              mModalAlert.showWarning('Datos de Póliza No Encontrada', 'Consulta');
            }
          }else{
            mModalAlert.showError('No se pudo obtener datos de Póliza', 'Consulta');
          }      
        })['catch'](function (e) {
          mpSpin.end();
          mModalAlert.showError('Ocurrió un problema al obtener datos de Póliza', 'Error');
        }); 


      } 
    }

    function b64toBlob(b64Data, contentType, sliceSize) {
      contentType = contentType || '';
      sliceSize = sliceSize || 512;

      var byteCharacters = atob(b64Data);
      var byteArrays = [];

      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          var slice = byteCharacters.slice(offset, offset + sliceSize);

          var byteNumbers = new Array(slice.length);
          for (var i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
          }

          var byteArray = new Uint8Array(byteNumbers);

          byteArrays.push(byteArray);
      }

      var blob = new Blob(byteArrays, { type: contentType });
      return blob;
    }

    function getBusinessDateCount(startDate, endDate) {
      var elapsed, daysBeforeFirstSunday, daysAfterLastSunday;
      var ifThen = function (a, b, c) {
          return a == b ? c : a;
      };
   
      elapsed = endDate - startDate;
      elapsed /= 86400000;
   
      daysBeforeFirstSunday = (7 - startDate.getDay()) % 7;
      daysAfterLastSunday = endDate.getDay();
   
      elapsed -= (daysBeforeFirstSunday + daysAfterLastSunday);
      elapsed = (elapsed / 7) * 5;
      elapsed += ifThen(daysBeforeFirstSunday - 1, -1, 0) + ifThen(daysAfterLastSunday, 6, 5);
   
      return Math.ceil(elapsed);
      //return parseInt(elapsed);

      /* 2015-04-29 til 2015-04-29 will return 1
      if you want it to return 0 instead 1:
      change Math.ceil() to parseInt() in last line */
  }

  $scope.FN_ADJUNTO_ABRIR = function(nom_documento, id_documento){
    if(id_documento == null || id_documento == '' || id_documento == '-'){
      return false;
    }

    console.log('id_documento');
    console.log(id_documento);
    var FILE_TYPE = $scope.MimeType2.lookup(nom_documento.toLowerCase());
    console.log('FILE_TYPE');
    console.log(FILE_TYPE);

    mpSpin.start();
    $http.get($scope.API_POLIZAS + '/api/cobranza/requerimiento/0/documento/' + id_documento, { params: {} })
    .then(function (response) {
      mpSpin.end();
      var Data = response.data.Data || {};
      console.log('data abrir archivo - msj');
      console.log(Data.msj);

      var FILE_BYTE = null;
      if(Data != null){
        FILE_BYTE = Data.archivo || null;
      }
       
      var blob = b64toBlob(FILE_BYTE, FILE_TYPE);
      var blobUrl = URL.createObjectURL(blob);

      var downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.setAttribute('download', nom_documento);
      document.body.appendChild(downloadLink);
      downloadLink.click();

      //window.open(blobUrl);  
    })['catch'](function (e) {
      mpSpin.end();
      mModalAlert.showError('Ocurrió un problema obteniendo archivo', 'Error');
    });       
  }

    $scope.FN_VISTA_LISTAR = function(buscar){
      $scope.VISTA = 'LISTAR';

      $scope.mostrar_aprobado = false;
      $scope.mostrar_rechazado = false;
      $scope.mostrar_derivado = false;
      $scope.mostrar_revisado = false;
      $scope.mostrar_atendido = false;
      $scope.mostrar_nosubsanado = false;

      if(buscar){
        $scope.FN_BUSCAR();
      }
    }

    $scope.FN_LISTAS = function(){
      $scope.LS_TIPOS = [
        { "VALOR": '-', "TEXTO": "-- TODOS --" },
        { "VALOR": 'REQ OBSERVACION', "TEXTO": "REQ OBSERVACION" },
        { "VALOR": 'REQ GESTION', "TEXTO": "REQ GESTION" },
        { "VALOR": 'REQ AUTOSERVICIO', "TEXTO": "REQ AUTOSERVICIO" }       
      ];
      
      $scope.LS_ESTADOS = [
        { "VALOR": 'REG', "TEXTO": "REGISTRADO" },
        //{ "VALOR": 'APR', "TEXTO": "APROBADO" },
        { "VALOR": 'APR', "TEXTO": "APROBADO SUP. COBR." },
        { "VALOR": 'REC', "TEXTO": "RECHAZADO" },
        { "VALOR": 'DER', "TEXTO": "DERIVADO" },
        //{ "VALOR": 'REV', "TEXTO": "REVISADO" },
        { "VALOR": 'REV', "TEXTO": "APROBADO " },  
        { "VALOR": 'ATE', "TEXTO": "ATENDIDO" },
        { "VALOR": 'NVA', "TEXTO": "NO SUBSANADO" }
      ];

      $scope.LS_SITUACIONES = [
        { "VALOR": '-', "TEXTO": "-- TODOS --" },
        { "VALOR": 'N', "TEXTO": "PENDIENTE" },
        { "VALOR": 'S', "TEXTO": "TERMINADO" }
      ];

      $scope.LS_REQ_EMPRESAS = [
        { "VALOR": 1, "TEXTO": "1 - MAPFRE PERU CIA SEG Y REAS." },
        { "VALOR": 2, "TEXTO": "2 - MAPFRE PERU VIDA CIA DE SEGURO" },
        { "VALOR": 3, "TEXTO": "3 - MAPFRE PERU - EPS" }
      ];

      $scope.LS_REQ_ESTADOS_POLIZA = [
        { "VALOR": 'C', "TEXTO": "CADUCA" },
        { "VALOR": 'A', "TEXTO": "ANULADA" },
        { "VALOR": 'E', "TEXTO": "EXPIRADA" },
        { "VALOR": 'V', "TEXTO": "VIGENTE" }
      ];      

      mpSpin.start();
      $http.get($scope.API_POLIZAS + '/api/cobranza/deceso/requerimientos/parametros', { params: {} })
      .then(function (response) {
        mpSpin.end();
        console.log('data');
        console.log(data);
        var parametros = response.data.Data.parametros || {};

        var sectores = parametros.sectores || [];
        var motivos = parametros.motivos || [];
        var submotivos = parametros.submotivos || [];

        for (var i = 0; i < sectores.length; i++) {
          $scope.LS_REQ_SECTORES.push({ 
            "COD_CIA": sectores[i].cod_cia,
            "VALOR": sectores[i].cod_sector, "TEXTO": sectores[i].cod_sector + " - " + sectores[i].nom_sector });
        }   
        
        var reqExisteObserva = false;
        var reqExisteGestion = false;
        var reqExisteAutoser = false;
        for (var j = 0; j < motivos.length; j++) {
          $scope.LS_REQ_MOTIVOS.push({
            "FLUJO": motivos[j].flujo,
            "VALOR": motivos[j].id_motivo, "TEXTO": motivos[j].nom_motivo });

            if(!reqExisteObserva){
              if(motivos[j].flujo == 'REQ OBSERVACION'){
                console.log('motivos[j] OBSE');
                console.log(motivos[j]);                  
              //$scope.REQ_OBSE_CONFIG.ca_dias_ejecut_emis = motivos[j].ca_dias_ejecut_emis || -1;
              $scope.REQ_OBSE_CONFIG.ca_dias_supcob_aten = motivos[j].ca_dias_supcob_aten || -1;
              $scope.REQ_OBSE_CONFIG.ca_dias_supcom_aten = motivos[j].ca_dias_supcom_aten || -1;
              //$scope.REQ_OBSE_CONFIG.ca_dias_asiste_aten = motivos[j].ca_dias_asiste_aten || -1;
              reqExisteObserva = true;
              }
            }
            if(!reqExisteGestion){
              if(motivos[j].flujo == 'REQ GESTION'){
                console.log('motivos[j] GEST');
                console.log(motivos[j]);              
                //$scope.REQ_GEST_CONFIG.ca_dias_ejecut_emis = motivos[j].ca_dias_ejecut_emis || -1;
                $scope.REQ_GEST_CONFIG.ca_dias_supcob_aten = motivos[j].ca_dias_supcob_aten || -1;
                //$scope.REQ_GEST_CONFIG.ca_dias_supcom_aten = motivos[j].ca_dias_supcom_aten || -1;
                $scope.REQ_GEST_CONFIG.ca_dias_asiste_aten = motivos[j].ca_dias_asiste_aten || -1;
                reqExisteGestion = true;
              }              
            }
            if(!reqExisteAutoser){
              if(motivos[j].flujo == 'REQ AUTOSERVICIO'){
                console.log('motivos[j] AUTO');
                console.log(motivos[j]);              
                //$scope.REQ_AUTO_CONFIG.ca_dias_ejecut_emis = motivos[j].ca_dias_ejecut_emis || -1;
                $scope.REQ_AUTO_CONFIG.ca_dias_supcob_aten = motivos[j].ca_dias_supcob_aten || -1;
                //$scope.REQ_AUTO_CONFIG.ca_dias_supcom_aten = motivos[j].ca_dias_supcom_aten || -1;
                $scope.REQ_AUTO_CONFIG.ca_dias_asiste_aten = motivos[j].ca_dias_asiste_aten || -1;
                reqExisteAutoser = true;
              }               
            }
        }     
        console.log('$scope.REQ_OBSE_CONFIG');
        console.log($scope.REQ_OBSE_CONFIG);  
        console.log('$scope.REQ_GEST_CONFIG');
        console.log($scope.REQ_GEST_CONFIG);
        console.log('$scope.REQ_AUTO_CONFIG');
        console.log($scope.REQ_AUTO_CONFIG);    
        
        for (var k = 0; k < submotivos.length; k++) {
          $scope.LS_REQ_SUBMOTIVOS.push({ 
            "ID_MOTIVO": submotivos[k].id_motivo,
            "VALOR": submotivos[k].id_submotivo, "TEXTO": submotivos[k].nom_submotivo });
        }            
      })['catch'](function (e) {
        mpSpin.end();
        mModalAlert.showError('Ocurrió un problema obteniendo parámetros', 'Error');
      });      
    }

    $scope.FN_INICIO = function () {
      //console.log('oimClaims.rolesCode');
      //console.log(oimClaims.rolesCode);
      //data.profile.rolesCode []
      //[i].nombreAplicacion == 'GRQC'
      //codigoRol = 'SUBCOM' nombreRol = 'SUPERVISOR COMERCIAL'

      $scope.USUARIO = oimClaims.loginUserName.toUpperCase();
      $scope.FECHA = new Date();
      $scope.FECHA = new Date($scope.FECHA.getFullYear(), $scope.FECHA.getMonth(), $scope.FECHA.getDate());
      var anio_actual = $scope.FECHA.getFullYear();
      console.log('$scope.FECHA');
      console.log($scope.FECHA);

      $scope.FILTROS = {
        "cod_usua": "-",
        "cod_aprob": $scope.USUARIO,
        "id_req": "",
        "num_poliza": "",
        "tipo_flujo": "-",
        "estado": "-",
        "fec_ini": "01/01/" + anio_actual,
        "fec_fin": "01/01/" + (anio_actual + 1),
        "situacion": '-'
      };

      $scope.REQ_OBSE_CONFIG = {
        "ca_dias_ejecut_emis": -1,
        "ca_dias_supcob_aten": -1,
        "ca_dias_supcom_aten": -1,
        "ca_dias_asiste_aten": -1
      };
      $scope.REQ_GEST_CONFIG = {
        "ca_dias_ejecut_emis": -1,
        "ca_dias_supcob_aten": -1,
        "ca_dias_supcom_aten": -1,
        "ca_dias_asiste_aten": -1
      };
      $scope.REQ_AUTO_CONFIG = {
        "ca_dias_ejecut_emis": -1,
        "ca_dias_supcob_aten": -1,
        "ca_dias_supcom_aten": -1,
        "ca_dias_asiste_aten": -1
      };

      $scope.FN_LISTAS();
      $scope.FN_VISTA_LISTAR(false);
  }  

    $scope.MimeType2 = {
      charset: 'UTF-8',
      catalog: {},
      lookup: function (fname, include_charset, default_mime_type) {
        var ext, charset = this.charset;
  
        if (include_charset === undefined) {
          include_charset = false;
        }
  
        if (typeof include_charset === "string") {
          charset = include_charset;
          include_charset = true;
        }
  
        /*if (path.extname !== undefined) {
          ext = path.extname(fname).toLowerCase();
        } else*/ if (fname.lastIndexOf('.') > 0) {
          ext = fname.substr(fname.lastIndexOf('.')).toLowerCase();
        } else {
          ext = fname;
        }
  
        // Handle the special cases where their is no extension
        // e..g README, manifest, LICENSE, TODO
        if (ext === "") {
          ext = fname;
        }
  
        if (this.catalog[ext] !== undefined) {
          if (include_charset === true &&
                          this.catalog[ext].indexOf('text/') === 0 &&
                          this.catalog[ext].indexOf('charset') < 0) {
            return this.catalog[ext] + '; charset=' + charset;
          } else {
            return this.catalog[ext];
          }
        } else if (default_mime_type !== undefined) {
          if (include_charset === true &&
                          default_mime_type.indexOf('text/') === 0) {
            return default_mime_type + '; charset=' + charset;
          }
          return default_mime_type;
        }
        return false;
      },
      set: function (exts, mime_type_string) {
        var result = true, self = this;
              //console.log("DEBUG exts.indexOf(',')", typeof exts.indexOf(','), exts.indexOf(','));
        if (exts.indexOf(',') > -1) {
          exts.split(',').forEach(function (ext) {
            ext = ext.trim();
            self.catalog[ext] = mime_type_string;
            if (self.catalog[ext] !== mime_type_string) {
              result = false;
            }
          });
        } else {
          self.catalog[exts] = mime_type_string;
        }
        return result;
      },
      del: function (ext) {
        delete this.catalog[ext];
        return (this.catalog[ext] === undefined);
      },
      forEach: function (callback) {
        var self = this, ext;
        // Mongo 2.2. Shell doesn't support Object.keys()
        for (ext in self.catalog) {
          if (self.catalog.hasOwnProperty(ext)) {
            callback(ext, self.catalog[ext]);
          }
        }
        return self.catalog;
      }
    };
  
    // From Apache project's mime type list.
    $scope.MimeType2.set(".ez", "application/andrew-inset");
    $scope.MimeType2.set(".aw", "application/applixware");
    $scope.MimeType2.set(".atom", "application/atom+xml");
    $scope.MimeType2.set(".atomcat", "application/atomcat+xml");
    $scope.MimeType2.set(".atomsvc", "application/atomsvc+xml");
    $scope.MimeType2.set(".ccxml", "application/ccxml+xml");
    $scope.MimeType2.set(".cu", "application/cu-seeme");
    $scope.MimeType2.set(".davmount", "application/davmount+xml");
    $scope.MimeType2.set(".ecma", "application/ecmascript");
    $scope.MimeType2.set(".emma", "application/emma+xml");
    $scope.MimeType2.set(".epub", "application/epub+zip");
    $scope.MimeType2.set(".pfr", "application/font-tdpfr");
    $scope.MimeType2.set(".stk", "application/hyperstudio");
    $scope.MimeType2.set(".jar", "application/java-archive");
    $scope.MimeType2.set(".ser", "application/java-serialized-object");
    $scope.MimeType2.set(".class", "application/java-vm");
    $scope.MimeType2.set(".js", "application/javascript");
    $scope.MimeType2.set(".json", "application/json");
    $scope.MimeType2.set(".lostxml", "application/lost+xml");
    $scope.MimeType2.set(".hqx", "application/mac-binhex40");
    $scope.MimeType2.set(".cpt", "application/mac-compactpro");
    $scope.MimeType2.set(".mrc", "application/marc");
    $scope.MimeType2.set(".ma,.nb,.mb", "application/mathematica");
    $scope.MimeType2.set(".mathml", "application/mathml+xml");
    $scope.MimeType2.set(".mbox", "application/mbox");
    $scope.MimeType2.set(".mscml", "application/mediaservercontrol+xml");
    $scope.MimeType2.set(".mp4s", "application/mp4");
    $scope.MimeType2.set(".doc,.dot", "application/msword");
    $scope.MimeType2.set(".mxf", "application/mxf");
    $scope.MimeType2.set(".oda", "application/oda");
    $scope.MimeType2.set(".opf", "application/oebps-package+xml");
    $scope.MimeType2.set(".ogx", "application/ogg");
    $scope.MimeType2.set(".onetoc,.onetoc2,.onetmp,.onepkg", "application/onenote");
    $scope.MimeType2.set(".xer", "application/patch-ops-error+xml");
    $scope.MimeType2.set(".pdf", "application/pdf");
    $scope.MimeType2.set(".pgp", "application/pgp-encrypted");
    $scope.MimeType2.set(".asc,.sig", "application/pgp-signature");
    $scope.MimeType2.set(".prf", "application/pics-rules");
    $scope.MimeType2.set(".p10", "application/pkcs10");
    $scope.MimeType2.set(".p7m,.p7c", "application/pkcs7-mime");
    $scope.MimeType2.set(".p7s", "application/pkcs7-signature");
    $scope.MimeType2.set(".cer", "application/pkix-cert");
    $scope.MimeType2.set(".crl", "application/pkix-crl");
    $scope.MimeType2.set(".pkipath", "application/pkix-pkipath");
    $scope.MimeType2.set(".pki", "application/pkixcmp");
    $scope.MimeType2.set(".pls", "application/pls+xml");
    $scope.MimeType2.set(".ai,.eps,.ps", "application/postscript");
    $scope.MimeType2.set(".cww", "application/prs.cww");
    $scope.MimeType2.set(".rdf", "application/rdf+xml");
    $scope.MimeType2.set(".rif", "application/reginfo+xml");
    $scope.MimeType2.set(".rnc", "application/relax-ng-compact-syntax");
    $scope.MimeType2.set(".rl", "application/resource-lists+xml");
    $scope.MimeType2.set(".rld", "application/resource-lists-diff+xml");
    $scope.MimeType2.set(".rs", "application/rls-services+xml");
    $scope.MimeType2.set(".rsd", "application/rsd+xml");
    $scope.MimeType2.set(".rss", "application/rss+xml");
    $scope.MimeType2.set(".rtf", "application/rtf");
    $scope.MimeType2.set(".sbml", "application/sbml+xml");
    $scope.MimeType2.set(".scq", "application/scvp-cv-request");
    $scope.MimeType2.set(".scs", "application/scvp-cv-response");
    $scope.MimeType2.set(".spq", "application/scvp-vp-request");
    $scope.MimeType2.set(".spp", "application/scvp-vp-response");
    $scope.MimeType2.set(".sdp", "application/sdp");
    $scope.MimeType2.set(".setpay", "application/set-payment-initiation");
    $scope.MimeType2.set(".setreg", "application/set-registration-initiation");
    $scope.MimeType2.set(".shf", "application/shf+xml");
    $scope.MimeType2.set(".smi,.smil", "application/smil+xml");
    $scope.MimeType2.set(".rq", "application/sparql-query");
    $scope.MimeType2.set(".srx", "application/sparql-results+xml");
    $scope.MimeType2.set(".gram", "application/srgs");
    $scope.MimeType2.set(".grxml", "application/srgs+xml");
    $scope.MimeType2.set(".ssml", "application/ssml+xml");
    $scope.MimeType2.set(".plb", "application/vnd.3gpp.pic-bw-large");
    $scope.MimeType2.set(".psb", "application/vnd.3gpp.pic-bw-small");
    $scope.MimeType2.set(".pvb", "application/vnd.3gpp.pic-bw-var");
    $scope.MimeType2.set(".tcap", "application/vnd.3gpp2.tcap");
    $scope.MimeType2.set(".pwn", "application/vnd.3m.post-it-notes");
    $scope.MimeType2.set(".aso", "application/vnd.accpac.simply.aso");
    $scope.MimeType2.set(".imp", "application/vnd.accpac.simply.imp");
    $scope.MimeType2.set(".acu", "application/vnd.acucobol");
    $scope.MimeType2.set(".atc,.acutc", "application/vnd.acucorp");
    $scope.MimeType2.set(".air", "application/vnd.adobe.air-application-installer-package+zip");
    $scope.MimeType2.set(".xdp", "application/vnd.adobe.xdp+xml");
    $scope.MimeType2.set(".xfdf", "application/vnd.adobe.xfdf");
    $scope.MimeType2.set(".azf", "application/vnd.airzip.filesecure.azf");
    $scope.MimeType2.set(".azs", "application/vnd.airzip.filesecure.azs");
    $scope.MimeType2.set(".azw", "application/vnd.amazon.ebook");
    $scope.MimeType2.set(".acc", "application/vnd.americandynamics.acc");
    $scope.MimeType2.set(".ami", "application/vnd.amiga.ami");
    $scope.MimeType2.set(".apk", "application/vnd.android.package-archive");
    $scope.MimeType2.set(".cii", "application/vnd.anser-web-certificate-issue-initiation");
    $scope.MimeType2.set(".fti", "application/vnd.anser-web-funds-transfer-initiation");
    $scope.MimeType2.set(".atx", "application/vnd.antix.game-component");
    $scope.MimeType2.set(".mpkg", "application/vnd.apple.installer+xml");
    $scope.MimeType2.set(".swi", "application/vnd.arastra.swi");
    $scope.MimeType2.set(".aep", "application/vnd.audiograph");
    $scope.MimeType2.set(".mpm", "application/vnd.blueice.multipass");
    $scope.MimeType2.set(".bmi", "application/vnd.bmi");
    $scope.MimeType2.set(".rep", "application/vnd.businessobjects");
    $scope.MimeType2.set(".cdxml", "application/vnd.chemdraw+xml");
    $scope.MimeType2.set(".mmd", "application/vnd.chipnuts.karaoke-mmd");
    $scope.MimeType2.set(".cdy", "application/vnd.cinderella");
    $scope.MimeType2.set(".cla", "application/vnd.claymore");
    $scope.MimeType2.set(".c4g,.c4d,.c4f,.c4p,.c4u", "application/vnd.clonk.c4group");
    $scope.MimeType2.set(".csp", "application/vnd.commonspace");
    $scope.MimeType2.set(".cdbcmsg", "application/vnd.contact.cmsg");
    $scope.MimeType2.set(".cmc", "application/vnd.cosmocaller");
    $scope.MimeType2.set(".clkx", "application/vnd.crick.clicker");
    $scope.MimeType2.set(".clkk", "application/vnd.crick.clicker.keyboard");
    $scope.MimeType2.set(".clkp", "application/vnd.crick.clicker.palette");
    $scope.MimeType2.set(".clkt", "application/vnd.crick.clicker.template");
    $scope.MimeType2.set(".clkw", "application/vnd.crick.clicker.wordbank");
    $scope.MimeType2.set(".wbs", "application/vnd.criticaltools.wbs+xml");
    $scope.MimeType2.set(".pml", "application/vnd.ctc-posml");
    $scope.MimeType2.set(".ppd", "application/vnd.cups-ppd");
    $scope.MimeType2.set(".car", "application/vnd.curl.car");
    $scope.MimeType2.set(".pcurl", "application/vnd.curl.pcurl");
    $scope.MimeType2.set(".rdz", "application/vnd.data-vision.rdz");
    $scope.MimeType2.set(".fe_launch", "application/vnd.denovo.fcselayout-link");
    $scope.MimeType2.set(".dna", "application/vnd.dna");
    $scope.MimeType2.set(".mlp", "application/vnd.dolby.mlp");
    $scope.MimeType2.set(".dpg", "application/vnd.dpgraph");
    $scope.MimeType2.set(".dfac", "application/vnd.dreamfactory");
    $scope.MimeType2.set(".geo", "application/vnd.dynageo");
    $scope.MimeType2.set(".mag", "application/vnd.ecowin.chart");
    $scope.MimeType2.set(".nml", "application/vnd.enliven");
    $scope.MimeType2.set(".esf", "application/vnd.epson.esf");
    $scope.MimeType2.set(".msf", "application/vnd.epson.msf");
    $scope.MimeType2.set(".qam", "application/vnd.epson.quickanime");
    $scope.MimeType2.set(".slt", "application/vnd.epson.salt");
    $scope.MimeType2.set(".ssf", "application/vnd.epson.ssf");
    $scope.MimeType2.set(".es3,.et3", "application/vnd.eszigno3+xml");
    $scope.MimeType2.set(".ez2", "application/vnd.ezpix-album");
    $scope.MimeType2.set(".ez3", "application/vnd.ezpix-package");
    $scope.MimeType2.set(".fdf", "application/vnd.fdf");
    $scope.MimeType2.set(".mseed", "application/vnd.fdsn.mseed");
    $scope.MimeType2.set(".seed,.dataless", "application/vnd.fdsn.seed");
    $scope.MimeType2.set(".gph", "application/vnd.flographit");
    $scope.MimeType2.set(".ftc", "application/vnd.fluxtime.clip");
    $scope.MimeType2.set(".fm,.frame,.maker,.book", "application/vnd.framemaker");
    $scope.MimeType2.set(".fnc", "application/vnd.frogans.fnc");
    $scope.MimeType2.set(".ltf", "application/vnd.frogans.ltf");
    $scope.MimeType2.set(".fsc", "application/vnd.fsc.weblaunch");
    $scope.MimeType2.set(".oas", "application/vnd.fujitsu.oasys");
    $scope.MimeType2.set(".oa2", "application/vnd.fujitsu.oasys2");
    $scope.MimeType2.set(".oa3", "application/vnd.fujitsu.oasys3");
    $scope.MimeType2.set(".fg5", "application/vnd.fujitsu.oasysgp");
    $scope.MimeType2.set(".bh2", "application/vnd.fujitsu.oasysprs");
    $scope.MimeType2.set(".ddd", "application/vnd.fujixerox.ddd");
    $scope.MimeType2.set(".xdw", "application/vnd.fujixerox.docuworks");
    $scope.MimeType2.set(".xbd", "application/vnd.fujixerox.docuworks.binder");
    $scope.MimeType2.set(".fzs", "application/vnd.fuzzysheet");
    $scope.MimeType2.set(".txd", "application/vnd.genomatix.tuxedo");
    $scope.MimeType2.set(".ggb", "application/vnd.geogebra.file");
    $scope.MimeType2.set(".ggt", "application/vnd.geogebra.tool");
    $scope.MimeType2.set(".gex,.gre", "application/vnd.geometry-explorer");
    $scope.MimeType2.set(".gmx", "application/vnd.gmx");
    $scope.MimeType2.set(".kml", "application/vnd.google-earth.kml+xml");
    $scope.MimeType2.set(".kmz", "application/vnd.google-earth.kmz");
    $scope.MimeType2.set(".gqf,.gqs", "application/vnd.grafeq");
    $scope.MimeType2.set(".gac", "application/vnd.groove-account");
    $scope.MimeType2.set(".ghf", "application/vnd.groove-help");
    $scope.MimeType2.set(".gim", "application/vnd.groove-identity-message");
    $scope.MimeType2.set(".grv", "application/vnd.groove-injector");
    $scope.MimeType2.set(".gtm", "application/vnd.groove-tool-message");
    $scope.MimeType2.set(".tpl", "application/vnd.groove-tool-template");
    $scope.MimeType2.set(".vcg", "application/vnd.groove-vcard");
    $scope.MimeType2.set(".zmm", "application/vnd.handheld-entertainment+xml");
    $scope.MimeType2.set(".hbci", "application/vnd.hbci");
    $scope.MimeType2.set(".les", "application/vnd.hhe.lesson-player");
    $scope.MimeType2.set(".hpgl", "application/vnd.hp-hpgl");
    $scope.MimeType2.set(".hpid", "application/vnd.hp-hpid");
    $scope.MimeType2.set(".hps", "application/vnd.hp-hps");
    $scope.MimeType2.set(".jlt", "application/vnd.hp-jlyt");
    $scope.MimeType2.set(".pcl", "application/vnd.hp-pcl");
    $scope.MimeType2.set(".pclxl", "application/vnd.hp-pclxl");
    $scope.MimeType2.set(".sfd-hdstx", "application/vnd.hydrostatix.sof-data");
    $scope.MimeType2.set(".x3d", "application/vnd.hzn-3d-crossword");
    $scope.MimeType2.set(".mpy", "application/vnd.ibm.minipay");
    $scope.MimeType2.set(".afp,.listafp,.list3820", "application/vnd.ibm.modcap");
    $scope.MimeType2.set(".irm", "application/vnd.ibm.rights-management");
    $scope.MimeType2.set(".sc", "application/vnd.ibm.secure-container");
    $scope.MimeType2.set(".icc,.icm", "application/vnd.iccprofile");
    $scope.MimeType2.set(".igl", "application/vnd.igloader");
    $scope.MimeType2.set(".ivp", "application/vnd.immervision-ivp");
    $scope.MimeType2.set(".ivu", "application/vnd.immervision-ivu");
    $scope.MimeType2.set(".xpw,.xpx", "application/vnd.intercon.formnet");
    $scope.MimeType2.set(".qbo", "application/vnd.intu.qbo");
    $scope.MimeType2.set(".qfx", "application/vnd.intu.qfx");
    $scope.MimeType2.set(".rcprofile", "application/vnd.ipunplugged.rcprofile");
    $scope.MimeType2.set(".irp", "application/vnd.irepository.package+xml");
    $scope.MimeType2.set(".xpr", "application/vnd.is-xpr");
    $scope.MimeType2.set(".jam", "application/vnd.jam");
    $scope.MimeType2.set(".rms", "application/vnd.jcp.javame.midlet-rms");
    $scope.MimeType2.set(".jisp", "application/vnd.jisp");
    $scope.MimeType2.set(".joda", "application/vnd.joost.joda-archive");
    $scope.MimeType2.set(".ktz,.ktr", "application/vnd.kahootz");
    $scope.MimeType2.set(".karbon", "application/vnd.kde.karbon");
    $scope.MimeType2.set(".chrt", "application/vnd.kde.kchart");
    $scope.MimeType2.set(".kfo", "application/vnd.kde.kformula");
    $scope.MimeType2.set(".flw", "application/vnd.kde.kivio");
    $scope.MimeType2.set(".kon", "application/vnd.kde.kontour");
    $scope.MimeType2.set(".kpr,.kpt", "application/vnd.kde.kpresenter");
    $scope.MimeType2.set(".ksp", "application/vnd.kde.kspread");
    $scope.MimeType2.set(".kwd,.kwt", "application/vnd.kde.kword");
    $scope.MimeType2.set(".htke", "application/vnd.kenameaapp");
    $scope.MimeType2.set(".kia", "application/vnd.kidspiration");
    $scope.MimeType2.set(".kne,.knp", "application/vnd.kinar");
    $scope.MimeType2.set(".skp,.skd,.skt,.skm", "application/vnd.koan");
    $scope.MimeType2.set(".sse", "application/vnd.kodak-descriptor");
    $scope.MimeType2.set(".lbd", "application/vnd.llamagraphics.life-balance.desktop");
    $scope.MimeType2.set(".lbe", "application/vnd.llamagraphics.life-balance.exchange+xml");
    $scope.MimeType2.set(".123", "application/vnd.lotus-1-2-3");
    $scope.MimeType2.set(".apr", "application/vnd.lotus-approach");
    $scope.MimeType2.set(".pre", "application/vnd.lotus-freelance");
    $scope.MimeType2.set(".nsf", "application/vnd.lotus-notes");
    $scope.MimeType2.set(".org", "application/vnd.lotus-organizer");
    $scope.MimeType2.set(".scm", "application/vnd.lotus-screencam");
    $scope.MimeType2.set(".lwp", "application/vnd.lotus-wordpro");
    $scope.MimeType2.set(".portpkg", "application/vnd.macports.portpkg");
    $scope.MimeType2.set(".mcd", "application/vnd.mcd");
    $scope.MimeType2.set(".mc1", "application/vnd.medcalcdata");
    $scope.MimeType2.set(".cdkey", "application/vnd.mediastation.cdkey");
    $scope.MimeType2.set(".mwf", "application/vnd.mfer");
    $scope.MimeType2.set(".mfm", "application/vnd.mfmp");
    $scope.MimeType2.set(".flo", "application/vnd.micrografx.flo");
    $scope.MimeType2.set(".igx", "application/vnd.micrografx.igx");
    $scope.MimeType2.set(".mif", "application/vnd.mif");
    $scope.MimeType2.set(".daf", "application/vnd.mobius.daf");
    $scope.MimeType2.set(".dis", "application/vnd.mobius.dis");
    $scope.MimeType2.set(".mbk", "application/vnd.mobius.mbk");
    $scope.MimeType2.set(".mqy", "application/vnd.mobius.mqy");
    $scope.MimeType2.set(".msl", "application/vnd.mobius.msl");
    $scope.MimeType2.set(".plc", "application/vnd.mobius.plc");
    $scope.MimeType2.set(".txf", "application/vnd.mobius.txf");
    $scope.MimeType2.set(".mpn", "application/vnd.mophun.application");
    $scope.MimeType2.set(".mpc", "application/vnd.mophun.certificate");
    $scope.MimeType2.set(".xul", "application/vnd.mozilla.xul+xml");
    $scope.MimeType2.set(".cil", "application/vnd.ms-artgalry");
    $scope.MimeType2.set(".cab", "application/vnd.ms-cab-compressed");
    $scope.MimeType2.set(".xls,.xlm,.xla,.xlc,.xlt,.xlw", "application/vnd.ms-excel");
    $scope.MimeType2.set(".xlam", "application/vnd.ms-excel.addin.macroenabled.12");
    $scope.MimeType2.set(".xlsb", "application/vnd.ms-excel.sheet.binary.macroenabled.12");
    $scope.MimeType2.set(".xlsm", "application/vnd.ms-excel.sheet.macroenabled.12");
    $scope.MimeType2.set(".xltm", "application/vnd.ms-excel.template.macroenabled.12");
    $scope.MimeType2.set(".eot", "application/vnd.ms-fontobject");
    $scope.MimeType2.set(".chm", "application/vnd.ms-htmlhelp");
    $scope.MimeType2.set(".ims", "application/vnd.ms-ims");
    $scope.MimeType2.set(".lrm", "application/vnd.ms-lrm");
    $scope.MimeType2.set(".cat", "application/vnd.ms-pki.seccat");
    $scope.MimeType2.set(".stl", "application/vnd.ms-pki.stl");
    $scope.MimeType2.set(".ppt,.pps,.pot", "application/vnd.ms-powerpoint");
    $scope.MimeType2.set(".ppam", "application/vnd.ms-powerpoint.addin.macroenabled.12");
    $scope.MimeType2.set(".pptm", "application/vnd.ms-powerpoint.presentation.macroenabled.12");
    $scope.MimeType2.set(".sldm", "application/vnd.ms-powerpoint.slide.macroenabled.12");
    $scope.MimeType2.set(".ppsm", "application/vnd.ms-powerpoint.slideshow.macroenabled.12");
    $scope.MimeType2.set(".potm", "application/vnd.ms-powerpoint.template.macroenabled.12");
    $scope.MimeType2.set(".mpp,.mpt", "application/vnd.ms-project");
    $scope.MimeType2.set(".docm", "application/vnd.ms-word.document.macroenabled.12");
    $scope.MimeType2.set(".dotm", "application/vnd.ms-word.template.macroenabled.12");
    $scope.MimeType2.set(".wps,.wks,.wcm,.wdb", "application/vnd.ms-works");
    $scope.MimeType2.set(".wpl", "application/vnd.ms-wpl");
    $scope.MimeType2.set(".xps", "application/vnd.ms-xpsdocument");
    $scope.MimeType2.set(".mseq", "application/vnd.mseq");
    $scope.MimeType2.set(".mus", "application/vnd.musician");
    $scope.MimeType2.set(".msty", "application/vnd.muvee.style");
    $scope.MimeType2.set(".nlu", "application/vnd.neurolanguage.nlu");
    $scope.MimeType2.set(".nnd", "application/vnd.noblenet-directory");
    $scope.MimeType2.set(".nns", "application/vnd.noblenet-sealer");
    $scope.MimeType2.set(".nnw", "application/vnd.noblenet-web");
    $scope.MimeType2.set(".ngdat", "application/vnd.nokia.n-gage.data");
    $scope.MimeType2.set(".n-gage", "application/vnd.nokia.n-gage.symbian.install");
    $scope.MimeType2.set(".rpst", "application/vnd.nokia.radio-preset");
    $scope.MimeType2.set(".rpss", "application/vnd.nokia.radio-presets");
    $scope.MimeType2.set(".edm", "application/vnd.novadigm.edm");
    $scope.MimeType2.set(".edx", "application/vnd.novadigm.edx");
    $scope.MimeType2.set(".ext", "application/vnd.novadigm.ext");
    $scope.MimeType2.set(".odc", "application/vnd.oasis.opendocument.chart");
    $scope.MimeType2.set(".otc", "application/vnd.oasis.opendocument.chart-template");
    $scope.MimeType2.set(".odb", "application/vnd.oasis.opendocument.database");
    $scope.MimeType2.set(".odf", "application/vnd.oasis.opendocument.formula");
    $scope.MimeType2.set(".odft", "application/vnd.oasis.opendocument.formula-template");
    $scope.MimeType2.set(".odg", "application/vnd.oasis.opendocument.graphics");
    $scope.MimeType2.set(".otg", "application/vnd.oasis.opendocument.graphics-template");
    $scope.MimeType2.set(".odi", "application/vnd.oasis.opendocument.image");
    $scope.MimeType2.set(".oti", "application/vnd.oasis.opendocument.image-template");
    $scope.MimeType2.set(".odp", "application/vnd.oasis.opendocument.presentation");
    $scope.MimeType2.set(".ods", "application/vnd.oasis.opendocument.spreadsheet");
    $scope.MimeType2.set(".ots", "application/vnd.oasis.opendocument.spreadsheet-template");
    $scope.MimeType2.set(".odt", "application/vnd.oasis.opendocument.text");
    $scope.MimeType2.set(".otm", "application/vnd.oasis.opendocument.text-master");
    $scope.MimeType2.set(".ott", "application/vnd.oasis.opendocument.text-template");
    $scope.MimeType2.set(".oth", "application/vnd.oasis.opendocument.text-web");
    $scope.MimeType2.set(".xo", "application/vnd.olpc-sugar");
    $scope.MimeType2.set(".dd2", "application/vnd.oma.dd2+xml");
    $scope.MimeType2.set(".oxt", "application/vnd.openofficeorg.extension");
    $scope.MimeType2.set(".pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
    $scope.MimeType2.set(".sldx", "application/vnd.openxmlformats-officedocument.presentationml.slide");
    $scope.MimeType2.set(".ppsx", "application/vnd.openxmlformats-officedocument.presentationml.slideshow");
    $scope.MimeType2.set(".potx", "application/vnd.openxmlformats-officedocument.presentationml.template");
    $scope.MimeType2.set(".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    $scope.MimeType2.set(".xltx", "application/vnd.openxmlformats-officedocument.spreadsheetml.template");
    $scope.MimeType2.set(".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    $scope.MimeType2.set(".dotx", "application/vnd.openxmlformats-officedocument.wordprocessingml.template");
    $scope.MimeType2.set(".dp", "application/vnd.osgi.dp");
    $scope.MimeType2.set(".pdb,.pqa,.oprc", "application/vnd.palm");
    $scope.MimeType2.set(".str", "application/vnd.pg.format");
    $scope.MimeType2.set(".ei6", "application/vnd.pg.osasli");
    $scope.MimeType2.set(".efif", "application/vnd.picsel");
    $scope.MimeType2.set(".plf", "application/vnd.pocketlearn");
    $scope.MimeType2.set(".pbd", "application/vnd.powerbuilder6");
    $scope.MimeType2.set(".box", "application/vnd.previewsystems.box");
    $scope.MimeType2.set(".mgz", "application/vnd.proteus.magazine");
    $scope.MimeType2.set(".qps", "application/vnd.publishare-delta-tree");
    $scope.MimeType2.set(".ptid", "application/vnd.pvi.ptid1");
    $scope.MimeType2.set(".qxd,.qxt,.qwd,.qwt,.qxl,.qxb", "application/vnd.quark.quarkxpress");
    $scope.MimeType2.set(".mxl", "application/vnd.recordare.musicxml");
    $scope.MimeType2.set(".musicxml", "application/vnd.recordare.musicxml+xml");
    $scope.MimeType2.set(".cod", "application/vnd.rim.cod");
    $scope.MimeType2.set(".rm", "application/vnd.rn-realmedia");
    $scope.MimeType2.set(".link66", "application/vnd.route66.link66+xml");
    $scope.MimeType2.set(".see", "application/vnd.seemail");
    $scope.MimeType2.set(".sema", "application/vnd.sema");
    $scope.MimeType2.set(".semd", "application/vnd.semd");
    $scope.MimeType2.set(".semf", "application/vnd.semf");
    $scope.MimeType2.set(".ifm", "application/vnd.shana.informed.formdata");
    $scope.MimeType2.set(".itp", "application/vnd.shana.informed.formtemplate");
    $scope.MimeType2.set(".iif", "application/vnd.shana.informed.interchange");
    $scope.MimeType2.set(".ipk", "application/vnd.shana.informed.package");
    $scope.MimeType2.set(".twd,.twds", "application/vnd.simtech-mindmapper");
    $scope.MimeType2.set(".mmf", "application/vnd.smaf");
    $scope.MimeType2.set(".teacher", "application/vnd.smart.teacher");
    $scope.MimeType2.set(".sdkm,.sdkd", "application/vnd.solent.sdkm+xml");
    $scope.MimeType2.set(".dxp", "application/vnd.spotfire.dxp");
    $scope.MimeType2.set(".sfs", "application/vnd.spotfire.sfs");
    $scope.MimeType2.set(".sdc", "application/vnd.stardivision.calc");
    $scope.MimeType2.set(".sda", "application/vnd.stardivision.draw");
    $scope.MimeType2.set(".sdd", "application/vnd.stardivision.impress");
    $scope.MimeType2.set(".smf", "application/vnd.stardivision.math");
    $scope.MimeType2.set(".sdw", "application/vnd.stardivision.writer");
    $scope.MimeType2.set(".vor", "application/vnd.stardivision.writer");
    $scope.MimeType2.set(".sgl", "application/vnd.stardivision.writer-global");
    $scope.MimeType2.set(".sxc", "application/vnd.sun.xml.calc");
    $scope.MimeType2.set(".stc", "application/vnd.sun.xml.calc.template");
    $scope.MimeType2.set(".sxd", "application/vnd.sun.xml.draw");
    $scope.MimeType2.set(".std", "application/vnd.sun.xml.draw.template");
    $scope.MimeType2.set(".sxi", "application/vnd.sun.xml.impress");
    $scope.MimeType2.set(".sti", "application/vnd.sun.xml.impress.template");
    $scope.MimeType2.set(".sxm", "application/vnd.sun.xml.math");
    $scope.MimeType2.set(".sxw", "application/vnd.sun.xml.writer");
    $scope.MimeType2.set(".sxg", "application/vnd.sun.xml.writer.global");
    $scope.MimeType2.set(".stw", "application/vnd.sun.xml.writer.template");
    $scope.MimeType2.set(".sus,.susp", "application/vnd.sus-calendar");
    $scope.MimeType2.set(".svd", "application/vnd.svd");
    $scope.MimeType2.set(".sis,.sisx", "application/vnd.symbian.install");
    $scope.MimeType2.set(".xsm", "application/vnd.syncml+xml");
    $scope.MimeType2.set(".bdm", "application/vnd.syncml.dm+wbxml");
    $scope.MimeType2.set(".xdm", "application/vnd.syncml.dm+xml");
    $scope.MimeType2.set(".tao", "application/vnd.tao.intent-module-archive");
    $scope.MimeType2.set(".tmo", "application/vnd.tmobile-livetv");
    $scope.MimeType2.set(".tpt", "application/vnd.trid.tpt");
    $scope.MimeType2.set(".mxs", "application/vnd.triscape.mxs");
    $scope.MimeType2.set(".tra", "application/vnd.trueapp");
    $scope.MimeType2.set(".ufd,.ufdl", "application/vnd.ufdl");
    $scope.MimeType2.set(".utz", "application/vnd.uiq.theme");
    $scope.MimeType2.set(".umj", "application/vnd.umajin");
    $scope.MimeType2.set(".unityweb", "application/vnd.unity");
    $scope.MimeType2.set(".uoml", "application/vnd.uoml+xml");
    $scope.MimeType2.set(".vcx", "application/vnd.vcx");
    $scope.MimeType2.set(".vsd,.vst,.vss,.vsw", "application/vnd.visio");
    $scope.MimeType2.set(".vis", "application/vnd.visionary");
    $scope.MimeType2.set(".vsf", "application/vnd.vsf");
    $scope.MimeType2.set(".wbxml", "application/vnd.wap.wbxml");
    $scope.MimeType2.set(".wmlc", "application/vnd.wap.wmlc");
    $scope.MimeType2.set(".wmlsc", "application/vnd.wap.wmlscriptc");
    $scope.MimeType2.set(".wtb", "application/vnd.webturbo");
    $scope.MimeType2.set(".wpd", "application/vnd.wordperfect");
    $scope.MimeType2.set(".wqd", "application/vnd.wqd");
    $scope.MimeType2.set(".stf", "application/vnd.wt.stf");
    $scope.MimeType2.set(".xar", "application/vnd.xara");
    $scope.MimeType2.set(".xfdl", "application/vnd.xfdl");
    $scope.MimeType2.set(".hvd", "application/vnd.yamaha.hv-dic");
    $scope.MimeType2.set(".hvs", "application/vnd.yamaha.hv-script");
    $scope.MimeType2.set(".hvp", "application/vnd.yamaha.hv-voice");
    $scope.MimeType2.set(".osf", "application/vnd.yamaha.openscoreformat");
    $scope.MimeType2.set(".osfpvg", "application/vnd.yamaha.openscoreformat.osfpvg+xml");
    $scope.MimeType2.set(".saf", "application/vnd.yamaha.smaf-audio");
    $scope.MimeType2.set(".spf", "application/vnd.yamaha.smaf-phrase");
    $scope.MimeType2.set(".cmp", "application/vnd.yellowriver-custom-menu");
    $scope.MimeType2.set(".zir,.zirz", "application/vnd.zul");
    $scope.MimeType2.set(".zaz", "application/vnd.zzazz.deck+xml");
    $scope.MimeType2.set(".vxml", "application/voicexml+xml");
    $scope.MimeType2.set(".hlp", "application/winhlp");
    $scope.MimeType2.set(".wsdl", "application/wsdl+xml");
    $scope.MimeType2.set(".wspolicy", "application/wspolicy+xml");
    $scope.MimeType2.set(".abw", "application/x-abiword");
    $scope.MimeType2.set(".ace", "application/x-ace-compressed");
    $scope.MimeType2.set(".aab,.x32,.u32,.vox", "application/x-authorware-bin");
    $scope.MimeType2.set(".aam", "application/x-authorware-map");
    $scope.MimeType2.set(".aas", "application/x-authorware-seg");
    $scope.MimeType2.set(".bcpio", "application/x-bcpio");
    $scope.MimeType2.set(".torrent", "application/x-bittorrent");
    $scope.MimeType2.set(".bz", "application/x-bzip");
    $scope.MimeType2.set(".bz2,.boz", "application/x-bzip2");
    $scope.MimeType2.set(".vcd", "application/x-cdlink");
    $scope.MimeType2.set(".chat", "application/x-chat");
    $scope.MimeType2.set(".pgn", "application/x-chess-pgn");
    $scope.MimeType2.set(".cpio", "application/x-cpio");
    $scope.MimeType2.set(".csh", "application/x-csh");
    $scope.MimeType2.set(".deb,.udeb", "application/x-debian-package");
    $scope.MimeType2.set(".dir,.dcr,.dxr,.cst,.cct,.cxt,.w3d,.fgd,.swa", "application/x-director");
    $scope.MimeType2.set(".wad", "application/x-doom");
    $scope.MimeType2.set(".ncx", "application/x-dtbncx+xml");
    $scope.MimeType2.set(".dtb", "application/x-dtbook+xml");
    $scope.MimeType2.set(".res", "application/x-dtbresource+xml");
    $scope.MimeType2.set(".dvi", "application/x-dvi");
    $scope.MimeType2.set(".bdf", "application/x-font-bdf");
    $scope.MimeType2.set(".gsf", "application/x-font-ghostscript");
    $scope.MimeType2.set(".psf", "application/x-font-linux-psf");
    $scope.MimeType2.set(".otf", "application/x-font-otf");
    $scope.MimeType2.set(".pcf", "application/x-font-pcf");
    $scope.MimeType2.set(".snf", "application/x-font-snf");
    $scope.MimeType2.set(".ttf,.ttc", "application/x-font-ttf");
    $scope.MimeType2.set(".woff", "application/font-woff");
    $scope.MimeType2.set(".pfa,.pfb,.pfm,.afm", "application/x-font-type1");
    $scope.MimeType2.set(".spl", "application/x-futuresplash");
    $scope.MimeType2.set(".gnumeric", "application/x-gnumeric");
    $scope.MimeType2.set(".gtar", "application/x-gtar");
    $scope.MimeType2.set(".hdf", "application/x-hdf");
    $scope.MimeType2.set(".jnlp", "application/x-java-jnlp-file");
    $scope.MimeType2.set(".latex", "application/x-latex");
    $scope.MimeType2.set(".prc,.mobi", "application/x-mobipocket-ebook");
    $scope.MimeType2.set(".application", "application/x-ms-application");
    $scope.MimeType2.set(".wmd", "application/x-ms-wmd");
    $scope.MimeType2.set(".wmz", "application/x-ms-wmz");
    $scope.MimeType2.set(".xbap", "application/x-ms-xbap");
    $scope.MimeType2.set(".mdb", "application/x-msaccess");
    $scope.MimeType2.set(".obd", "application/x-msbinder");
    $scope.MimeType2.set(".crd", "application/x-mscardfile");
    $scope.MimeType2.set(".clp", "application/x-msclip");
    $scope.MimeType2.set(".exe,.dll,.com,.bat,.msi", "application/x-msdownload");
    $scope.MimeType2.set(".mvb,.m13,.m14", "application/x-msmediaview");
    $scope.MimeType2.set(".wmf", "application/x-msmetafile");
    $scope.MimeType2.set(".mny", "application/x-msmoney");
    $scope.MimeType2.set(".pub", "application/x-mspublisher");
    $scope.MimeType2.set(".scd", "application/x-msschedule");
    $scope.MimeType2.set(".trm", "application/x-msterminal");
    $scope.MimeType2.set(".wri", "application/x-mswrite");
    $scope.MimeType2.set(".nc,.cdf", "application/x-netcdf");
    $scope.MimeType2.set(".p12,.pfx", "application/x-pkcs12");
    $scope.MimeType2.set(".p7b,.spc", "application/x-pkcs7-certificates");
    $scope.MimeType2.set(".p7r", "application/x-pkcs7-certreqresp");
    $scope.MimeType2.set(".rar", "application/x-rar-compressed");
    $scope.MimeType2.set(".sh", "application/x-sh");
    $scope.MimeType2.set(".shar", "application/x-shar");
    $scope.MimeType2.set(".swf", "application/x-shockwave-flash");
    $scope.MimeType2.set(".xap", "application/x-silverlight-app");
    $scope.MimeType2.set(".sit", "application/x-stuffit");
    $scope.MimeType2.set(".sitx", "application/x-stuffitx");
    $scope.MimeType2.set(".sv4cpio", "application/x-sv4cpio");
    $scope.MimeType2.set(".sv4crc", "application/x-sv4crc");
    $scope.MimeType2.set(".tar", "application/x-tar");
    $scope.MimeType2.set(".tcl", "application/x-tcl");
    $scope.MimeType2.set(".tex", "application/x-tex");
    $scope.MimeType2.set(".tfm", "application/x-tex-tfm");
    $scope.MimeType2.set(".texinfo,.texi", "application/x-texinfo");
    $scope.MimeType2.set(".ustar", "application/x-ustar");
    $scope.MimeType2.set(".src", "application/x-wais-source");
    $scope.MimeType2.set(".der,.crt", "application/x-x509-ca-cert");
    $scope.MimeType2.set(".fig", "application/x-xfig");
    $scope.MimeType2.set(".xpi", "application/x-xpinstall");
    $scope.MimeType2.set(".xenc", "application/xenc+xml");
    $scope.MimeType2.set(".xhtml,.xht", "application/xhtml+xml");
    $scope.MimeType2.set(".xml,.xsl", "application/xml");
    $scope.MimeType2.set(".dtd", "application/xml-dtd");
    $scope.MimeType2.set(".xop", "application/xop+xml");
    $scope.MimeType2.set(".xslt", "application/xslt+xml");
    $scope.MimeType2.set(".xspf", "application/xspf+xml");
    $scope.MimeType2.set(".mxml,.xhvml,.xvml,.xvm", "application/xv+xml");
    $scope.MimeType2.set(".zip", "application/zip");
    $scope.MimeType2.set(".adp", "audio/adpcm");
    $scope.MimeType2.set(".au,.snd", "audio/basic");
    $scope.MimeType2.set(".mid,.midi,.kar,.rmi", "audio/midi");
    $scope.MimeType2.set(".mp4a", "audio/mp4");
    $scope.MimeType2.set(".m4a,.m4p", "audio/mp4a-latm");
    $scope.MimeType2.set(".mpga,.mp2,.mp2a,.mp3,.m2a,.m3a", "audio/mpeg");
    $scope.MimeType2.set(".oga,.ogg,.spx", "audio/ogg");
    $scope.MimeType2.set(".eol", "audio/vnd.digital-winds");
    $scope.MimeType2.set(".dts", "audio/vnd.dts");
    $scope.MimeType2.set(".dtshd", "audio/vnd.dts.hd");
    $scope.MimeType2.set(".lvp", "audio/vnd.lucent.voice");
    $scope.MimeType2.set(".pya", "audio/vnd.ms-playready.media.pya");
    $scope.MimeType2.set(".ecelp4800", "audio/vnd.nuera.ecelp4800");
    $scope.MimeType2.set(".ecelp7470", "audio/vnd.nuera.ecelp7470");
    $scope.MimeType2.set(".ecelp9600", "audio/vnd.nuera.ecelp9600");
    $scope.MimeType2.set(".aac", "audio/x-aac");
    $scope.MimeType2.set(".aif,.aiff,.aifc", "audio/x-aiff");
    $scope.MimeType2.set(".m3u", "audio/x-mpegurl");
    $scope.MimeType2.set(".wax", "audio/x-ms-wax");
    $scope.MimeType2.set(".wma", "audio/x-ms-wma");
    $scope.MimeType2.set(".ram,.ra", "audio/x-pn-realaudio");
    $scope.MimeType2.set(".rmp", "audio/x-pn-realaudio-plugin");
    $scope.MimeType2.set(".wav", "audio/x-wav");
    $scope.MimeType2.set(".cdx", "chemical/x-cdx");
    $scope.MimeType2.set(".cif", "chemical/x-cif");
    $scope.MimeType2.set(".cmdf", "chemical/x-cmdf");
    $scope.MimeType2.set(".cml", "chemical/x-cml");
    $scope.MimeType2.set(".csml", "chemical/x-csml");
    $scope.MimeType2.set(".xyz", "chemical/x-xyz");
    $scope.MimeType2.set(".bmp", "image/bmp");
    $scope.MimeType2.set(".cgm", "image/cgm");
    $scope.MimeType2.set(".g3", "image/g3fax");
    $scope.MimeType2.set(".gif", "image/gif");
    $scope.MimeType2.set(".ief", "image/ief");
    $scope.MimeType2.set(".jp2", "image/jp2");
    $scope.MimeType2.set(".jpeg,.jpg,.jpe", "image/jpeg");
    $scope.MimeType2.set(".pict,.pic,.pct", "image/pict");
    $scope.MimeType2.set(".png", "image/png");
    $scope.MimeType2.set(".btif", "image/prs.btif");
    $scope.MimeType2.set(".svg,.svgz", "image/svg+xml");
    $scope.MimeType2.set(".tiff,.tif", "image/tiff");
    $scope.MimeType2.set(".psd", "image/vnd.adobe.photoshop");
    $scope.MimeType2.set(".djvu,.djv", "image/vnd.djvu");
    $scope.MimeType2.set(".dwg", "image/vnd.dwg");
    $scope.MimeType2.set(".dxf", "image/vnd.dxf");
    $scope.MimeType2.set(".fbs", "image/vnd.fastbidsheet");
    $scope.MimeType2.set(".fpx", "image/vnd.fpx");
    $scope.MimeType2.set(".fst", "image/vnd.fst");
    $scope.MimeType2.set(".mmr", "image/vnd.fujixerox.edmics-mmr");
    $scope.MimeType2.set(".rlc", "image/vnd.fujixerox.edmics-rlc");
    $scope.MimeType2.set(".mdi", "image/vnd.ms-modi");
    $scope.MimeType2.set(".npx", "image/vnd.net-fpx");
    $scope.MimeType2.set(".wbmp", "image/vnd.wap.wbmp");
    $scope.MimeType2.set(".xif", "image/vnd.xiff");
    $scope.MimeType2.set(".ras", "image/x-cmu-raster");
    $scope.MimeType2.set(".cmx", "image/x-cmx");
    $scope.MimeType2.set(".fh,.fhc,.fh4,.fh5,.fh7", "image/x-freehand");
    $scope.MimeType2.set(".ico", "image/x-icon");
    $scope.MimeType2.set(".pntg,.pnt,.mac", "image/x-macpaint");
    $scope.MimeType2.set(".pcx", "image/x-pcx");
    //$scope.MimeType2.set(".pic,.pct", "image/x-pict");
    $scope.MimeType2.set(".pnm", "image/x-portable-anymap");
    $scope.MimeType2.set(".pbm", "image/x-portable-bitmap");
    $scope.MimeType2.set(".pgm", "image/x-portable-graymap");
    $scope.MimeType2.set(".ppm", "image/x-portable-pixmap");
    $scope.MimeType2.set(".qtif,.qti", "image/x-quicktime");
    $scope.MimeType2.set(".rgb", "image/x-rgb");
    $scope.MimeType2.set(".xbm", "image/x-xbitmap");
    $scope.MimeType2.set(".xpm", "image/x-xpixmap");
    $scope.MimeType2.set(".xwd", "image/x-xwindowdump");
    $scope.MimeType2.set(".eml,.mime", "message/rfc822");
    $scope.MimeType2.set(".igs,.iges", "model/iges");
    $scope.MimeType2.set(".msh,.mesh,.silo", "model/mesh");
    $scope.MimeType2.set(".dwf", "model/vnd.dwf");
    $scope.MimeType2.set(".gdl", "model/vnd.gdl");
    $scope.MimeType2.set(".gtw", "model/vnd.gtw");
    $scope.MimeType2.set(".mts", "model/vnd.mts");
    $scope.MimeType2.set(".vtu", "model/vnd.vtu");
    $scope.MimeType2.set(".wrl,.vrml", "model/vrml");
    $scope.MimeType2.set(".ics,.ifb", "text/calendar");
    $scope.MimeType2.set(".css", "text/css");
    $scope.MimeType2.set(".csv", "text/csv");
    $scope.MimeType2.set(".html,.htm", "text/html");
    $scope.MimeType2.set(".txt,.text,.conf,.def,.list,.log,.in", "text/plain");
    $scope.MimeType2.set(".dsc", "text/prs.lines.tag");
    $scope.MimeType2.set(".rtx", "text/richtext");
    $scope.MimeType2.set(".sgml,.sgm", "text/sgml");
    $scope.MimeType2.set(".tsv", "text/tab-separated-values");
    $scope.MimeType2.set(".t,.tr,.roff,.man,.me,.ms", "text/troff");
    $scope.MimeType2.set(".uri,.uris,.urls", "text/uri-list");
    $scope.MimeType2.set(".curl", "text/vnd.curl");
    $scope.MimeType2.set(".dcurl", "text/vnd.curl.dcurl");
    $scope.MimeType2.set(".scurl", "text/vnd.curl.scurl");
    $scope.MimeType2.set(".mcurl", "text/vnd.curl.mcurl");
    $scope.MimeType2.set(".fly", "text/vnd.fly");
    $scope.MimeType2.set(".flx", "text/vnd.fmi.flexstor");
    $scope.MimeType2.set(".gv", "text/vnd.graphviz");
    $scope.MimeType2.set(".3dml", "text/vnd.in3d.3dml");
    $scope.MimeType2.set(".spot", "text/vnd.in3d.spot");
    $scope.MimeType2.set(".jad", "text/vnd.sun.j2me.app-descriptor");
    $scope.MimeType2.set(".wml", "text/vnd.wap.wml");
    $scope.MimeType2.set(".wmls", "text/vnd.wap.wmlscript");
    $scope.MimeType2.set(".s,.asm", "text/x-asm");
    $scope.MimeType2.set(".c,.cc,.cxx,.cpp,.h,.hh,.dic", "text/x-c");
    $scope.MimeType2.set(".f,.for,.f77,.f90", "text/x-fortran");
    $scope.MimeType2.set(".p,.pas", "text/x-pascal");
    $scope.MimeType2.set(".java", "text/x-java-source");
    $scope.MimeType2.set(".etx", "text/x-setext");
    $scope.MimeType2.set(".uu", "text/x-uuencode");
    $scope.MimeType2.set(".vcs", "text/x-vcalendar");
    $scope.MimeType2.set(".vcf", "text/x-vcard");
    $scope.MimeType2.set(".3gp", "video/3gpp");
    $scope.MimeType2.set(".3g2", "video/3gpp2");
    $scope.MimeType2.set(".h261", "video/h261");
    $scope.MimeType2.set(".h263", "video/h263");
    $scope.MimeType2.set(".h264", "video/h264");
    $scope.MimeType2.set(".jpgv", "video/jpeg");
    $scope.MimeType2.set(".jpm,.jpgm", "video/jpm");
    $scope.MimeType2.set(".mj2,.mjp2", "video/mj2");
    $scope.MimeType2.set(".mp4,.mp4v,.mpg4,.m4v", "video/mp4");
    $scope.MimeType2.set(".mkv,.mk3d,.mka,.mks", "video/x-matroska");
    $scope.MimeType2.set(".webm", "video/webm");
    $scope.MimeType2.set(".mpeg,.mpg,.mpe,.m1v,.m2v", "video/mpeg");
    $scope.MimeType2.set(".ogv", "video/ogg");
    $scope.MimeType2.set(".qt,.mov", "video/quicktime");
    $scope.MimeType2.set(".fvt", "video/vnd.fvt");
    $scope.MimeType2.set(".mxu,.m4u", "video/vnd.mpegurl");
    $scope.MimeType2.set(".pyv", "video/vnd.ms-playready.media.pyv");
    $scope.MimeType2.set(".viv", "video/vnd.vivo");
    $scope.MimeType2.set(".dv,.dif", "video/x-dv");
    $scope.MimeType2.set(".f4v", "video/x-f4v");
    $scope.MimeType2.set(".fli", "video/x-fli");
    $scope.MimeType2.set(".flv", "video/x-flv");
    //$scope.MimeType2.set(".m4v", "video/x-m4v");
    $scope.MimeType2.set(".asf,.asx", "video/x-ms-asf");
    $scope.MimeType2.set(".wm", "video/x-ms-wm");
    $scope.MimeType2.set(".wmv", "video/x-ms-wmv");
    $scope.MimeType2.set(".wmx", "video/x-ms-wmx");
    $scope.MimeType2.set(".wvx", "video/x-ms-wvx");
    $scope.MimeType2.set(".avi", "video/x-msvideo");
    $scope.MimeType2.set(".movie", "video/x-sgi-movie");
    $scope.MimeType2.set(".ice", "x-conference/x-cooltalk");
    $scope.MimeType2.set(".indd", "application/x-indesign");
    $scope.MimeType2.set(".dat", "application/octet-stream");
    $scope.MimeType2.set(".msg", "application/vnd.ms-outlook");
     
      // Compressed files
      // Based on notes at http://en.wikipedia.org/wiki/List_of_archive_formats
      $scope.MimeType2.set(".gz", "application/x-gzip");
      $scope.MimeType2.set(".tgz", "application/x-tar");
      $scope.MimeType2.set(".tar", "application/x-tar");
  
    // Not really sure about these...
    $scope.MimeType2.set(".epub", "application/epub+zip");
    $scope.MimeType2.set(".mobi", "application/x-mobipocket-ebook");
  
    // Here's some common special cases without filename extensions
    $scope.MimeType2.set("README,LICENSE,COPYING,TODO,ABOUT,AUTHORS,CONTRIBUTORS",
      "text/plain");
    $scope.MimeType2.set("manifest,.manifest,.mf,.appcache", "text/cache-manifest");

    $scope.FN_INICIO();
  }

  return ng.module("appGrqc")
    .controller("GrqcBandejaGestionController",grqcBandejaGestionController)
    ;
});
