define([
  'angular',
  'lodash'
  ], function(ng, _) {

    function seguroviajeFactory($filter) {
        var formData = {}
        var bonusBodyCopy = {}
        return {
						//Ordena un array de obj por un valor especifico. Default: asc
            compareValues : function(key, order){
							return function(a, b) {
								if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
									// property doesn't exist on either object
									return 0;
								}

								const varA = (typeof a[key] === 'string') ?
									a[key].toUpperCase() : a[key];
								const varB = (typeof b[key] === 'string') ?
									b[key].toUpperCase() : b[key];

								var comparison = 0;
								if (varA > varB) {
									comparison = 1;
								} else if (varA < varB) {
									comparison = -1;
								}
								return (
									(order == 'desc') ? (comparison * -1) : comparison
								);
							}
            },
            // Retorna un objecto para iniciar un proceso de cotizacion
            setEmptyFormData : function() {
                return formData = [
                    {
                        numViajeros : 1,
                        fechaInicio : '',
                        fechaFin : ''
                    }
                ]
            },
            // Retorna un objeto para iniciar el tercer paso de la cotizacion
            newStepThreeObject: function(numViajeros){
                var newObject = {
                        contratante : {
                            CodigoDocumento : '',
                            Nombre : '',
                            ApellidoPaterno : '',
                            ApellidoMaterno : '',
                            CorreoElectronico : '',
                            Telefono2 : ''
                        },
                        prima : null,
                        descuento : 0
                    };
                    if(numViajeros){
                        newObject.viajeros = this.newViajerosArray(numViajeros)
                    }

                return newObject;
            },
            // Metodo que verifica si hubo un cambio el objecto de calculo de prima durante el proceso de cotizacion
            isEqualBonus : function(copy, object){
                return _.isEqual(this.setBonusBodyRequired(copy), this.setBonusBodyRequired(object))
            },
            // Este metodo busca colocar valores donde exista coincidencia
            setValuesByObject: function(a, b){
                _.map(_.keys(b), function (key) {
                    a[key] = b[key] || '';
                    if(key == 'FechaNacimiento' && a.FechaNacimiento != ''){
                        var splitDate = a.FechaNacimiento.split('/')
                        a.FechaNacimiento = new Date(splitDate[2], splitDate[1] - 1, splitDate[0])
                    }
                });
                return a;
            },
            // Crea un objecto nuevo de viajeros, especificando las propiedades de cada uno
            newViajerosArray :function(numViajeros){
                var newArray = [];
                for (var index = 0; index < numViajeros; index++) {
                    newArray.push(this.newStepThreeObject().contratante)
                }
                return newArray;
            },
            setNewFormData : function(object) {
                formData = object;
            },
            getFormData : function(){
                return formData;
            },
            saveBonusCopy : function(object) {
                bonusBodyCopy = ng.copy(object)
            },
            getBonusCopy : function(){
                return bonusBodyCopy;
            },
            // Metodo para limpiar un objecto segun las propiedades que se le hayan especificado en un arreglo.
            // En caso de tener propiedades limpia el objeto por completo
            cleanObjectByProperties : function(object, properties){
                if(!ng.isUndefined(properties)){
                    var newObject = {};
                    if(properties[0] == 'contratante'){
                        newObject = this.newStepThreeObject().contratante;
                    }
                    else{
                         _.forEach(_.keys(object), function(objectKey){
                            if(!_.contains(properties, objectKey)){
                                newObject[objectKey] = object[objectKey]
                            }
                        })
                    }
                    return newObject;
                }
                else{
                    return {};
                }
            },
            // En este metodo se valida si un objecto tiene el campo 'CodigoDocumento', con valores duplicados
            checkDuplicatedDoc : function(object){
                var newArray = [];
                _.forEach(object, function(a, keyA){
                    _.forEach(object, function(b, keyB){
                        if(a.CodigoDocumento == b.CodigoDocumento && keyA != keyB){
                            newArray.push(keyA)
                        }
                    })
                })
                return _.uniq(newArray);
            },
            // En esta funcion se ajusta el objecto solo tomando en cuanta los datos que son
            // indispensables para hacer un recalculo de prima
            setBonusBodyRequired : function(object){
                _.forEach(object, function(property, key){
                    if(key == 'contratante'){
                        object[key] = {
                            fecNacimiento : object[key].fecNacimiento
                        }
                    }
                    if(key == 'asegurado'){
                        _.forEach(object.asegurado, function(value, index){
                            object.asegurado[index] = {
                                fecNacimiento : value.fecNacimiento
                            }
                        })
                    }
                })
                return object
            },
            // Se crear el request para generar un calculo de prima
            setBonusBody : function(object){
                return {
                    cabecera: {
                        codigoAplicacion: "OIM"
                    },
                    poliza: {
                        fecEfecSpto: $filter('date')(object[0].fechaInicio, 'dd/MM/yyyy'),
                        fecVctoSpto: $filter('date')(object[0].fechaFin, 'dd/MM/yyyy'),
                        pctDctoComercial : object[2].descuento.toString() || 0
                    },
                    producto: {
                        codCia: '2',
                        codRamo: '670',
                        numPolizaGrupo: object[1].poliza.code
                    },
                    riesgoViajes: {
                        destino: object[1].destino.name,
                        motivoViaje: object[1].motivo.name,
                        codigoPlan: object[1].producto.codePlan
                    },
                    contratante:{
                        tipDocum: object[2].contratante.tipoDocumento.codigo,
                        codDocum: object[2].contratante.CodigoDocumento,
                        nombre: object[2].contratante.Nombre,
                        apePaterno: object[2].contratante.ApellidoPaterno,
                        apeMaterno: object[2].contratante.ApellidoMaterno,
                        email: object[2].contratante.CorreoElectronico,
                        tlfMovil: object[2].contratante.Telefono2 == "null" ? "" : object[2].contratante.Telefono2,
                        fecNacimiento: $filter('date')(object[2].contratante.FechaNacimiento, 'dd/MM/yyyy')
                    },
                    asegurado: _.map(object[2].viajeros, function(viajero){
                        if(viajero.CodigoDocumento == ''){
                            return {};
                        }
                        else{
                            return {
                                tipDocum: viajero.tipoDocumento.codigo,
                                codDocum: viajero.CodigoDocumento,
                                nombre: viajero.Nombre,
                                apePaterno: viajero.ApellidoPaterno,
                                apeMaterno: viajero.ApellidoMaterno,
                                email: viajero.CorreoElectronico,
                                tlfMovil: viajero.Telefono2 == null ? "" : viajero.Telefono2,
                                fecNacimiento: $filter('date')(viajero.FechaNacimiento, 'dd/MM/yyyy')
                            }
                        }
                    })
                }
            },
            // Se crea el request para guardar la cotizacion
            setQuotationBody : function(object){
                return {
                    numerocotizacion: object[2].numCotizacion,
                    datosPoliza : {
                        destino : object[1].destino.name,
                        codigoPais : object[1].pais ? object[1].pais.code : null,
                        descripcionPais : object[1].pais ? object[1].pais.name : '',
                        motivoViaje : object[1].motivo.name,
                        fechaSalida : $filter('date')(object[0].fechaInicio, 'dd/MM/yyyy'),
                        fechaLLegada : $filter('date')(object[0].fechaFin, 'dd/MM/yyyy'),
                        codigoGrupoPoliza : object[1].poliza.code,
                        nombreGrupoPoliza : object[1].poliza.name
                    },
                    producto: {
                        codigocia: 1,
                        codigoRamo: 670,
                        codigoProducto: object[1].producto.codeProduct,
                        codigoSubProducto : object[1].producto.codeSubProduct,
                        codigoModalidad: object[1].producto.codeModality,
                        codigoPlan : object[1].producto.codePlan,
                        nombrePlan : object[1].producto.namePlan
                    },
                    contratante: {
                        tipoPersona : object[2].contratante.tipoContratante.id == 0 ? 'S' : 'N',
                        nombre: object[2].contratante.Nombre,
                        apellidoPaterno: object[2].contratante.ApellidoPaterno || '',
                        apellidoMaterno: object[2].contratante.ApellidoMaterno || '',
                        tipoDocumento: {
                            codigo: object[2].contratante.tipoDocumento.codigo,
                            descripcion: object[2].contratante.tipoDocumento.descripcion
                        },
                        numeroDocumento: object[2].contratante.CodigoDocumento,
                        email : object[2].contratante.CorreoElectronico || '',
                        celular : object[2].contratante.Telefono2 || '',
                        fechaNacimiento: $filter('date')(object[2].contratante.FechaNacimiento, 'dd/MM/yyyy')
                    },
                    viajeros : _.map(object[2].viajeros, function(viajero){
                        return {
                            nombre: viajero.Nombre,
                            apellidoPaterno: viajero.ApellidoPaterno,
                            apellidoMaterno: viajero.ApellidoMaterno,
                            tipoDocumento: {
                                codigo: viajero.tipoDocumento.codigo,
                                descripcion: viajero.tipoDocumento.descripcion
                            },
                            numeroDocumento: viajero.CodigoDocumento,
                            email: viajero.CorreoElectronico,
                            celular: viajero.Telefono2,
                            fechaNacimiento: $filter('date')(viajero.FechaNacimiento, 'dd/MM/yyyy')
                        }
                    }),
                    conceptosDesglose: {
                        primaTotal: object[2].prima,
                        descuentoComercial: object[2].descuento.toString()
                    }
                }
            },
            // Se crea el request para guardar una emision
            setEmissionBody : function(object, numDocCot){
                return {
                    numeroDocumentoCotizacion : parseInt(numDocCot),
                    numeroCotizacion: object.quotationNumber,
                    cabecera: {
                        codigoAplicacion: 'OIM'
                    },
                    datosPoliza: {
                        destino: object.policyData.destination,
                        codigoPais: object.policyData.countryCode,
                        descripcionPais: object.policyData.countryDescription =! null ? object.policyData.countryDescription : '',
                        motivoViaje: object.policyData.travelReason,
                        fechaSalida: object.policyData.dateDeparture,
                        fechaLLegada: object.policyData.dateArrival,
                        codigoGrupoPoliza: object.policyData.policyGroupCode,
                        nombreGrupoPoliza: object.policyData.policyGroupName
                    },
                    producto: {
                        codigoCia: 2,
                        codigoRamo: 670,
                        codigoProducto: object.product.productCode,
                        codigoSubProducto : object.product.subProductCode,
                        nombreProducto: object.product.productName,
                        codigoModalidad: object.product.modalityCode,
                        codigoPlan : object.product.planCode,
                        nombrePlan : object.product.planName
                    },
                    contratante: {
                        tipoPersona: object.contractor.personType,
                        nombre: object.contractor.name,
                        apellidoPaterno: object.contractor.personType == 'S' ? object.contractor.firstLastName : '',
                        apellidoMaterno: object.contractor.personType == 'S' ? object.contractor.secondLastName : '' ,
                        tipoDocumento: {
                            codigo: object.contractor.documentType.code,
                            descripcion: object.contractor.documentType.description
                        },
                        numeroDocumento: object.contractor.documentNumber,
                        email: object.contractor.email != null ? object.contractor.email : '',
                        celular: object.contractor.mobile != null ? object.contractor.mobile : '' ,
                        mcaSexo : object.contractor.mcaSexo,
                        fecNacimiento: object.contractor.birthDate,
                        direccion : {
                            codPais : 'PE',
                            codDepartamento : object.contractor.departamento.Codigo.toString(),
                            codProvincia: object.contractor.provincia.Codigo.toString(),
                            codDistrito: object.contractor.distrito.Codigo.toString(),
                            tipDomicilio: object.contractor.via.Codigo != null ? object.contractor.via.Codigo.toString() : '' ,
                            nomDomicilio: object.contractor.nombreVia || '',
                            tipNumero: object.contractor.tipoNumero.Codigo != null ? object.contractor.tipoNumero.Codigo.toString() : '' ,
                            descNumero: object.contractor.enumeracion || '',
                            tipInterior: object.contractor.tipoInterior.Codigo != null ? object.contractor.tipoInterior.Codigo.toString() : '' ,
                            nroInterior: object.contractor.enumeracionInt || '',
                            tipZona: object.contractor.tipoZona.Codigo != null ? object.contractor.tipoZona.Codigo.toString() : '' ,
                            nomZona: object.contractor.nombreZona || '',
                            refDireccion: object.contractor.referencia || ''
                        },
                    },
                    viajeros: _.map(object.travelers, function(viajero){
                        return {
                            tipoPersona : 'S',
                            nombre: viajero.name,
                            apellidoPaterno: viajero.firstLastName,
                            apellidoMaterno: viajero.secondLastName,
                            tipoDocumento: {
                                codigo: viajero.documentType.code,
                                descripcion: viajero.documentType.description
                            },
                            numeroDocumento: viajero.documentNumber,
                            email: viajero.email,
                            celular: viajero.mobile,
                            fechaNacimiento: viajero.birthDate,
                            mcaSexo : viajero.mcaSexo,
                            direccion : {
                                codPais : 'PE',
                                codDepartamento : viajero.departamento.Codigo.toString(),
                                codProvincia: viajero.provincia.Codigo.toString(),
                                codDistrito: viajero.distrito.Codigo.toString(),
                                tipDomicilio: viajero.via.Codigo != null ? object.contractor.via.Codigo.toString() : '' ,
                                nomDomicilio: viajero.nombreVia || '',
                                tipNumero: viajero.tipoNumero.Codigo != null ? object.contractor.tipoNumero.Codigo.toString() : '' ,
                                descNumero: viajero.enumeracion || '',
                                tipInterior: viajero.tipoInterior.Codigo != null ? object.contractor.tipoInterior.Codigo.toString() : '' ,
                                nroInterior: viajero.enumeracionInt || '',
                                tipZona: viajero.tipoZona.Codigo != null ? object.contractor.tipoZona.Codigo.toString() : '' ,
                                nomZona: viajero.nombreZona || '',
                                refDireccion: viajero.referencia || ''
                            },
                        }
                    }),
                    conceptosDesglose: {
                        primaTotal: object.separateConcepts.primaTotal,
                        descuentoComercial: object.separateConcepts.descuentoComercial
                    }
                }
            },
            // Objecto que se usa por defecto para el servicio de paginacion tanto para cotizacion y emision
            setFilterBody : function() {
                return {
                    pageSize : 10,
                    pageNum : 1,
                    startDate : new Date(),
                    endDate : new Date(),
                    contractor : '',
                    documentType : '',
                    documentNumber : ''
                }
            },
            setsortingTypes: function(){
                return [
                    {
                        value : 1,
                        descripcion : 'ASCENDENTE'
                    },
                    {
                        value : 2,
                        descripcion : 'DESCENDENTE'
                    }
                ]
            },
            setFilterRequest : function(object){
                _.forEach(object, function(property, key){
                    if(_.isObject(property)){
                        object[key] = property.codigo || property.value || property.name || ''
                    }
                    if(_.isDate(property)){
                        object[key] = $filter('date')(property, 'dd/MM/yyyy')
                    }
                    if(ng.isUndefined(property) || _.isNull(property)){
                        object[key] = ''
                    }
                    if(ng.isUndefined(object.policyNumber)){
                        object.policyNumber = ''
                    }
                })
                return object;
            },
            getDestinations : function(){
                return [
                    {
                        id : 0,
                        name : 'NACIONAL'
                    },
                    {
                        id : 1,
                        name : 'INTERNACIONAL'
                    },
                ]
            },
            getDocuments: function(){
                return [
                    {
                        id : 0,
                        name : 'PERSONA NATURAL',
                        types : [
                            {
                                id : 3,
                                codigo : 'DNI',
                                description : 'Documento Nacional de Identidad',
                                maxLength : 8
                            },
                            {
                                id : 1,
                                codigo : 'CEX',
                                description : 'Carnet de Extranjería',
                                maxLength : 13
                            },
                            {
                                id : 2,
                                codigo : 'CIP',
                                description : 'Carnet de Identidad Personal',
                                maxLength : 13
                            }
                        ]
                    },
                    {
                        id : 1,
                        name : 'PERSONA JURIDICA',
                        types : [
                            {
                                id : 0,
                                codigo : 'RUC',
                                description : 'Registro Único de Contribuyentes',
                                maxLength : 11
                            }
                        ]
                    }
                ]
            }
        };
    }
    return ng.module('appSeguroviaje')
        .factory('seguroviajeFactory', seguroviajeFactory)
})
