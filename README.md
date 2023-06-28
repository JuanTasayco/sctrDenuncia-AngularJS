![OIM][logo]

### Confluence
[https://mxperu.atlassian.net/wiki/spaces/OIM][confluence]
### Wireframes
[https://mxperu.atlassian.net/wiki/spaces/OIM][wf]
### UI
[https://mxperu.atlassian.net/wiki/spaces/OIM][ui]

### Guia de contribución
[README.CONTRIBUTION.MD][contribution]

# Pre-requisitos
1.- Tener instalado (**En el siguiente orden**):

- [Ruby][rubyInstall]

- [SASS][sassInstall]

- [Node][nodeInstall]

- [Bower][bowerInstall]

- **[Configurar proxy; si lo hubiera (ir a la sección de abajo)](#configurar-proxy)**. Luego, instalar los siguientes paquetes

- **OJO:** Si estás con proxy: Así se instalaría SASS
```sh
gem install -p http://<USER>:<CLAVE>.@wcgproxy.mapfreperu.com:8080 sass
```

```sh
npm i -g bower grunt grunt-cli
```

2.- Modificar el archivo `host` de tu sistema operativo
```sh
127.0.0.1          dev.oim.mapfre.com.pe
#192.168.1.11      api.oim.com
10.160.120.214     api.oim.com
10.160.120.152     spe001001-128.mapfreperu.com
```

# Instalación

## 1.- Clonar repo
Desde `GIT BASH`, ya que desde otras consolas da conflictos

### **Sin proxy**
### a.- Clonar recursivamente y entrar a la carpeta
```sh
git clone --recursive -j6 https://myUser@bitbucket.org/mxperu/oim_common_fe.git oim
cd oim
```
> Usar `-j6` si se cuenta con una versión de Git actualizada; sino, retirar ese parámetro

### **Con Proxy**
### a.- Clonar y entrar a la carpeta
```sh
git clone https://myUser@bitbucket.org/mxperu/oim_common_fe.git oim
cd oim
```

### b.- Modificar el archivo `.gitmodules` para cambiar las rutas a `HTTPS`.

Setear tu `username` en todos los submodulos que encuentres. **Sería algo así**:
```sh
[submodule "client/wwwroot/cgw"]
  url = https://myUser@bitbucket.org/mxperu/cgw.git
[submodule "client/wwwroot/nsctr"]
  url = https://myUser@bitbucket.org/mxperu/mapfre_nsctr.git
[submodule "client/wwwroot/polizas"]
  url = https://myUser@bitbucket.org/mxperu/polizas.git
[submodule "client/wwwroot/referencia"]
  url = https://myUser@bitbucket.org/mxperu/mapfre_referencia.git
[submodule "client/wwwroot/webproc"]
  url = https://myUser@bitbucket.org/mxperu/mapfre_webproc.git
```
### c.- Inicializar los submódulos
```ssh
git submodule update --init
```
### d.- Descartar cambio realizado en `.gitmodules` (ya que es un archivo trackeado, y no debería tener seteado nuestro usuario).
```sh
git checkout .gitmodules
```

## 2.- Entrar a `/client` y cambiar a la rama `develop`
```sh
cd client && git checkout develop
```

## 3.- Instalar las dependencias
```sh
npm run i
```
> Este comando solo está en la rama develop. Sino; correr por separado lo siguiente:
```sh
npm i
bower install
```

## 4.- Entrar en c/módulo y cambiar a la rama en la que se vaya a trabajar
```sh
cd wwwroot/<myModule> && git checkout <myBranch>
```

## 5.- Volver a `/client` y levantar el proy
```sh
cd ../.. && npm run all
```
> Este comando solo está en la rama develop. Sino; correr por separado las siguientes tareas:
```sh
grunt sass
grunt reBuildProxy
grunt serve:dev
```

## Configurar proxy
**De ser necesario**

Configurar userMapfre y password

NVM
```sh
nvm proxy http://userMapfre:password@wcgproxy.mapfreperu.com:8080
```

Command prompt
```sh
set http_proxy=http://userMapfre:password@wcgproxy.mapfreperu.com:8080
```

NPM
```sh
npm config set proxy http://userMapfre:password@wcgproxy.mapfreperu.com:8080
npm config set https-proxy http://userMapfre:password@wcgproxy.mapfreperu.com:8080
```

Bower; en el archivo `.bowerrc`
```json
{
  "directory": "mi-ruta",
  "proxy": "http://userMapfre:password@wcgproxy.mapfreperu.com:8080",
  "https-proxy": "http://userMapfre:password@wcgproxy.mapfreperu.com:8080"
}
```

Navegador

Agregar a la configuración del proxy del navegador las rutas:

```sh
;dev.oim.mapfre.com.pe;api.oim.com
```
## Trabajando en Mapfre

Setear proxy

```sh
export http_proxy=http://userMapfre:password@wcgproxy.mapfreperu.com:8080
git config --global http.proxy http://userMapfre:password@wcgproxy.mapfreperu.com:8080
```

## Trabajando en Mx/Home
```sh
git config --global --unset http.proxy
```

[logo]: https://oim.mapfre.com.pe/images/login-logo2.png
[confluence]: <https://mxperu.atlassian.net/wiki/pages/viewpage.action?pageId=24636487>
[wf]: <http://vgaa01.axshare.com>
[ui]: <https://drive.google.com/drive/folders/0B7UYsQTYmfGdV09KZzFzeS1UNDQ>
[uicgw]: <https://drive.google.com/drive/folders/0B4zRKnCtOT9XaHRRV19zNGxRQm8>
[doc-funcionalidad]: <https://docs.google.com/spreadsheets/d/1-gVCU85Aq37eACAglz32iMHC9l97qiWS9o_b3cYclNM/edit>
[doc-pantallas]: <https://docs.google.com/a/multiplica.net/spreadsheets/d/1ZtuigZdOHt4vbcOR8x95gAWG3kUzOX9C6u7rLXRBBCI/edit?usp=sharing>
[rubyInstall]: <https://www.ruby-lang.org/es/documentation/installation/>
[sassInstall]: <http://sass-lang.com/install>
[nodeInstall]: <https://github.com/creationix/nvm#installation>
[bowerInstall]: <https://bower.io/>
[contribution]: <README.CONTRIBUTION.md>