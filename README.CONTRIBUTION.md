![OIM][logo]
# Flujo de trabajo OIM

## Git flow

Vamos a basarnos en **git flow** para manejar el repo.

Básicamente existirán **2 ramas** principales (**permanentes**):

- **Master**: 🏅

Código de producción. No se pueden hacer commits directamente.

Solo mediante Pull Request (PR) y con 1 aprobación.

- **Develop**: ⚙

Código de desarrollo. Se pueden subir commits directamente si son cambios puntuales (pequeños).

De lo contrario, se va a tener que crear una rama a partir de develop, con el prefijo `feature/`, ej: `feature/RegistroUser`; para luego ser integrada mediante (**PR o merge directo**) en `develop` y después se pasa a eliminar esa rama `feature/RegistroUser`.


### Para issues salidos de producción: 🐞
Se trabajará en una nueva rama que nace de master con el prefijo `hotfix/`, ej: `hotfix/issue1545`.

Luego de terminar, se integrarán esos cambios en `Master` y `Develop`.

Y finalmente borrarás tu rama `hotfix/issue1545`.


### Futuros releases (pases a producción) 🎉
Se creará la rama con el prefijo `release/`, ej: `release/v.0.1` que nacerá de develop.

Ahí se aceptarán commits del tipo **fix**, **docs** y **tareas relacionadas**.

Una vez esté listo para producción, se manda el PR a `master`, para luego ser mergeado y tageado.

Y cuando el PR es aceptado, se integrará a `develop` y se procede a eliminar esa rama `release/v.0.1`.


### Links para más info (Darle una mirada) 👀
- [https://www.atlassian.com/git/tutorials/comparing-workflows#gitflow-workflow][gfAtla]
- [https://www.git-tower.com/learn/git/ebook/en/desktop-gui/advanced-topics/git-flow][gfTower]


## Directrices para commits
Estamos adoptando esta práctica de: [Angular Git Commit Guidelines][ngCommit]

Nos permitirá tener mensajes **más legibles y fáciles de trakear**. También podremos generar un change log.

### Formato de mensajes de commit

Cada mensaje consiste de un **header**, **body** y **footer**.

El **header** tiene un formato especial que incluye *el tipo, seguido de un ámbito y luego un asunto*:

- **tipo**: Que tipo de cambio contiene este commit
- **ambito**: Ámbito dentro de la aplicación donde se realiza el cambio
- **asunto**: Una descripción corta de los cambios realizados en este commit
- **cuerpo** (opcional): Una descripción más detallada de los cambios

```sh
<tipo>(<ambito>): <asunto>
<Línea en blanco>
<cuerpo>
```

Ejemplos:
```sh
feat(detalleAsistencia): implementacion de redux para los estados
```
```sh
fix(ISSUE1545): validacion de campos en keyup en login
```
```sh
revert(detalleAsistencia): rollback del commit 5487sad
```

```sh
refactor(pencil): use graphite instead of lead

Closes #640.

Graphite is a much more available resource than lead, so we use it to lower the price.
```

> Cualquier línea del mensaje de commit no debe tener más de 100 carateres.

###Tipo:
Se recomienda usar uno de estos tipos. Solo los de tipo **feat** y **fix** aparecerán en la lista de cambios(changelog).

- **feat**: Una nueva característica
- **fix**: Una corrección de error
- **docs**: Cambios en la documentación o en los comentarios(notar que el tipo es en plural 'docs')
- **style**: Cambios que no afectan el significado del código (espacios en blanco, formateo, faltó un punto y coma, etc)
- **refactor**: Un cambio en el código que no corrige un error, ni agrega una característica
- **test**: Agregando pruebas que falten(porque agregar nuevos test son considerados feat)
- **perf**: Cambio de código que mejora el rendimiento
- **revert**: rollback del commit 5487sad
- **chore**: Cambios en el proceso de construcción(compilación) o herramientas auxiliares y/o bibliotecas como generadores de documentación

###Ámbito

Se refiere al **ámbito dentro de la aplicación**.

Exactamente donde se realiza el cambio. Por ejemplo *suscriptor, registro, login, etc...*

###Asunto

El asunto contiene la descripción corta del cambio:

Se recomienda usar palabras en **tiempo presente**: "*cambio*" no "*cambiado*"

No Capitalizar la primera letra, **usar solo minúsculas**

**No usar punto(.) al final**

## Uso de hooks con npm

Con este hook, validaremos cada commit que hagamos

1.- Instalar
```sh
npm i
```
2.- Probar si verificar los formatos de los msg del commit

3.- Si deja pasar los commits sin respetar la regla:

3.1.- Modificar el archivo .git del submódulo actual.

  Reemplazar esto:

  ```sh
  gitdir: /home/kevinmx/proyectos/oim/.git/modules/client/wwwroot/MI-MODULO
  ```

  Por:

  ```sh
  gitdir: ../../../.git/modules/client/wwwroot/MI-MODULO
  ```


###Helpers

Utilitario para consola [cz-cli][cz]


### Links para más info (Darle una mirada) 👀
- [Angular contribución][ngCommit]

![Git Flow][gf]

[logo]: https://oim.mapfre.com.pe/images/login-logo2.png
[gf]: git-flow.png "Git Flow"
[gfAtla]: <https://www.atlassian.com/git/tutorials/comparing-workflows#gitflow-workflow>
[gfTower]: <https://www.git-tower.com/learn/git/ebook/en/desktop-gui/advanced-topics/git-flow>
[ngCommit]: <https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines>
[cz]: <https://github.com/commitizen/cz-cli>