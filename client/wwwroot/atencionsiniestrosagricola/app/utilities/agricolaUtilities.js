define(['angular', 'constants'],
    function (ng, constants) {
        var appAgricola = ng.module('atencionsiniestrosagricola.app');

        appAgricola.factory('agricolaUtilities', ['$q', '$location',
            function ($q,$location) {
                function formatearFecha(fecha) {
                    if (fecha instanceof Date) {
                        var today = fecha;
                        var dd = today.getDate();
                        var mm = today.getMonth() + 1;

                        if (dd === 32) {
                            dd = 1;
                            mm = today.getMonth() + 2;
                        }

                        if (dd < 10) {
                            dd = '0' + dd
                        }
                        if (mm < 10) {
                            mm = '0' + mm
                        }

                        var yyyy = today.getFullYear();
                        return dd + '/' + mm + '/' + yyyy;
                    }
                }

                function toDate(dateStr) {
                    var fecha = dateStr.substr(0, 10);
                    fecha = fecha.split("/");
                    return new Date(fecha[2], fecha[1] - 1, fecha[0]);
                }

                function orderCodeMaestro(a, b) {
                    if (a.codigo > b.codigo) {
                        return 1;
                    }
                    if (a.codigo < b.codigo) {
                        return -1;
                    }
                    return 0;
                }

                function getBase64(file, onLoadCallback) {
                    return new Promise(function (resolve, reject) {
                        var reader = new FileReader();
                        reader.onload = function () { resolve(reader.result); };
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });
                }
                function search(nameKey, myArray){
                    for (var i=0; i < myArray.length; i++) {
                        if (myArray[i].name === nameKey) {
                            return myArray[i];
                        }
                    }
                }
                function formatDateLocale(stringDate){
                    var dateParts = stringDate.split("/");
                    return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 
                }
                function getRuta(ruta) {
                    var port = "";
                    if ($location.port() != "") {
                        port = ':' + $location.port() + '/';
                    } else {
                        port = '/';
                    }
                    switch(ruta){
                        case "PLANTILLA":
                    return $location.protocol() + '://' + $location.host() + port + 'atencionsiniestrosagricola/resources/files/';
                        case "DETALLE CAMPAÑA":
                        return $location.protocol() + '://' + $location.host() + port + 'atencionsiniestrosagricola/#/campanias/detalle/';
                    }
                }
                function randomId() {
                    var result = '';
                    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    var charactersLength = characters.length;
                    for (var i = 0; i < 12; i++) {
                        result += characters.charAt(Math.floor(Math.random() * charactersLength));
                    }
                    return result;
                }
                function getMostCommon(valordef, array) {                    
                    var newArr = array.slice().sort(), most = [undefined, 0], counter = 0;

                    newArr.reduce(function (old, chr) {
                        old == chr ? ++counter > most[1] && (most = [chr, counter]) : (counter = 1)
                        return chr
                    });

                    return (most[0] == undefined ? valordef : most[0]);
                }

                function getPartText(stringvalue, character, direction) {
                    //direction: 0 before, 1 after
                    return stringvalue.split(character)[direction];
                }

                return {
                    formatearFecha: formatearFecha,
                    toDate: toDate,
                    orderCodeMaestro: orderCodeMaestro,
                    getBase64: getBase64,
                    getMostCommon: getMostCommon,
                    getRuta: getRuta,
                    search:search,
                    formatDateLocale:formatDateLocale,
                    getPartText: getPartText,
                    randomId:randomId
                }

            }]);
    });