![MxPaginador][logopaginador]
## MxPaginador

Recibe la data del request, y maneja la lógica para encargarse de revisar desde donde poblar el array de la grilla de resultados según el nro de tanda.

1.-  Agregamos el módulo de `oim.commons` a nuestra aplicación en `myModule/app/app.js`
```js
define(['...dependencias...'], function() {
  /* ... Metodos Config y Run ... */
  return ng
    .module('appWp', [
      '..modulos..',
      'oim.commons'
    ])
    .config(configFn)
    .run(runFn);
});
```
2.- Inyectamos `MxPaginador` en el controller a usar e inicializamos el paginador.
```js
BandejaController.$inject = ['MxPaginador'];
function BandejaController(MxPaginador) {
  var vm = this;
  var page;
  vm.$onInit = onInit;

  function onInit() {
    // items a mostrar por pagina. Por defecto es 10
    // este campo lo utilizaremos también como input del uib-pagination
    vm.itemsXPagina = 4;
    page = new MxPaginador();
    page.setNroItemsPorPagina(vm.itemsXPagina);
  }
}
```
3.- En el response de la consulta que queremos paginar seteamos el **array de la tanda** (`lstAsistenciasPorTanda`) y la **cantidad total de items de la consulta** (`vm.totalAsistencias`).

Luego, llamamos a `.getItemsDePagina()` para obtener los items de la 1era página.

OJO: **vm.totalAsistencias** es el TOTAL de toda la consulta
```js
function getAsistencias(query) {
  wpFactory.assistance
    .Search(query, true)
    .then(function gaRPrFn(resp) {
      var lstAsistenciasPorTanda = resp.data || [];
      vm.totalAsistencias = resp.paginatorInfo.countRecord;
      page
        .setNroTotalRegistros(vm.totalAsistencias)
        .setDataActual(lstAsistenciasPorTanda)
        .setConfiguracionTanda();

      // internamente devuelve los items de la 1era pagina
      vm.lstAsistencias = page.getItemsDePagina();
    })
    .catch(function gaEPrFn(err) {
      vm.totalAsistencias = 0;
      vm.lstAsistencias = [];
      $log.error(err);
    });
}
```
4.- En el callback de (`uib-pagination`) cuando hay un **cambio de página**.

Invocamos a nuestra `instancia`, para que **evalue** si la página a cargar **corresponde a la tanda actual**, o si es que tiene que **realizar una consulta por la siguiente tanda**.
```html
<ul
  class="g-pagination"
  data-boundary-link-numbers="true"
  data-items-per-page="$ctrl.itemsXPage"
  data-ng-change="$ctrl.setPage($ctrl.currentPage)"
  data-ng-if="$ctrl.totalItems"
  data-ng-model="$ctrl.currentPage"
  data-total-items="$ctrl.totalItems"
  data-uib-pagination
>
</ul>
```
```js
function setPage(idx) {
  page
    .setNroPaginaAMostrar(idx)
    .thenLoadFrom(function tlfFN(nroTanda) {
      params.CurrentPage = nroTanda;
      getAsistencias(params);
    }, function tlfCFN() {
      // internamente calcula y retorna los items de la pagina solicitada
      vm.lstAsistencias = page.getItemsDePagina();
    });
}
```
El método `thenLoadFrom()` recibe 2 callbacks:

**Syntax**
```js
page.thenLoadFrom(onCargarOtraTanda, onDesdeMismaTanda);

// o

page.thenLoadFrom(function(nroTanda) {
  // onCargarOtraTanda
}, function() {
  // onDesdeMismaTanda
});
```
**Parámetros**

`onCargarOtraTanda`

Función llamada si la página a cargar pertenece a otra tanda.
Esta función tiene como **argumento el nro de tanda a cargar**.

`onDesdeMismaTanda`

Función llamada si la página a cargar pertenece a la misma tanda.

5.- En la función de una nueva búsqueda, **seteamos a 1** la página actual (`vm.currentPage`) y el nro de tanda (`.setCurrentTanda(vm.currentPage)`)
```js
function search() {
  vm.currentPage = 1;
  page.setCurrentTanda(vm.currentPage);
  params = {
    // ...params...
    CurrentPage: vm.currentPage,
  };
  getAsistencias(params);
}
```
6.- Enjoy it 🎉

## Plus

Reemplaza los elementos usados en una consulta (msg de no hay datos y el paginador) con este componente

1.- Requerir como dependencia `mxPaginador` en `myModule/app/app.js`
```js
define(['...dependencias...', 'mxPaginador'], function() {
  /* ... Metodos Config y Run ... */
  return ng
    .module('appWp', [
      '..modulos..'
    ])
    .config(configFn)
    .run(runFn);
});
```

2.- **Reemplaza** los siguientes elementos por el comp. `mx-paginador`.

Los campos que necesita son los ya definidos anteriormente.

Solo hay un cambio que hacer en el **paso 4**

```js
// ahora recibimos un event como paramatro
function setPage(event) {
  page
    // mx-paginador nos devuelve la pagina a cargar en la propiedad pageToLoad
    .setNroPaginaAMostrar(event.pageToLoad)
    // ... cod explicado en el paso 4 ...
}
```

reemplazamos lo siguiente:
```html
<div class="clearfix" ng-if="vm.totalItems == 0">
  <div class="col-md-12 text-center g-box-noresult">
    <div class="row">
      <div class="col-md-12 g-box-noresult-ico">
        <span class="ico-mapfre_119_wrong ico-wrong"></span>
      </div> <div class="col-md-12 g-box-noresult-text">
        No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente
      </div>
    </div>
  </div>
</div>

<div class="row" ng-if="vm.totalPages > 1">
  <div class="col-md-12">
    <ul uib-pagination class="g-pagination" ng-model="mPagination" max-size="10" total-items="vm.totalItems" ng-change="vm.setPage(mPagination)" boundary-link-numbers="true"></ul>
  </div>
</div>
```
por:
```html
<mx-paginador
  data-datos="vm.anuladas"
  data-items-x-page="vm.itemsXPagina"
  data-msg-vacio="vm.msgVacio"
  data-on-paginar="vm.setPage($event)"
  data-pagina-actual="vm.currentPage"
  data-total-items="vm.totalItems"
>
</mx-paginador>
```
| Bindings | Descripción |
| ------ | ------ |
| datos | array de la tanda actual |
| items-x-page | cantidad de items por pagina |
| msg-vacio | msg que aparece cuando no hay data |
| on-paginar | callback ejecutado cuando se realiza un cambio de pagina |
| pagina-actual | es el ng-model del uib-pagination. por acá seteamos a 1 cuando se hace una nueva búsqueda |
| total-items | cantidad TOTAL de la consulta (no confundir con la cantidad de la tanda) |

## Se ha implementado en:
- [WebProc: Bandeja][wp]
- [GCW: Polizas][gcw]

Join us 😀

[logopaginador]: mxpaginador.png "MxPaginador"
[wp]: https://bitbucket.org/mxperu/webproc/src/da7855ccfad5bdc575e045dd30254fd544fb8496/app/components/bandeja/?at=develop
[gcw]: https://bitbucket.org/mxperu/gcw/src/5ce1f4c47300c83842f60556ab109c9498fa82d7/app/components/cobranzas/anuladas/?at=develop