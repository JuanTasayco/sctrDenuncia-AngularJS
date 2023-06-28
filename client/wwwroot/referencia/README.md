[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Sistema de Referencia y Contrareferencia

https://projects.invisionapp.com/share/S292Y8CET#/screens/199552493


# Contributing

Read this [document](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines) document before starting to contribute to this project


# Starting Up the Application

This process works with Node v5.12.0. Node version greater than this could work, but this process has been tested only with v5.12.0

## Execute the next steps to start the app

Before to install the app install the next global packagge



```
#!javascript

npm i -g  bower gulp-cli grunt-cli nodemon sails



## getting oim_common_fe if branch referencia exists
git clone -b referencia https://myuser@bitbucket.org/mxperu/oim_common_fe.git
cd oim_common_fe

## adding the submodule - you should fork this repo in order to clone this repo

 this command was executed when this module was created.
 // git submodule add https://myuser@bitbucket.org/myuser/referencia.git client/wwwroot/referencia
 // git submodule add git@bitbucket.org:mxperu/referencia.git client/wwwroot/referencia 

## getting the existent submodule
git submodule update --init client/wwwroot/referencia/
cd client/wwwroot/referencia/
git reset --hard origin/master
git remote rename origin upstream

# here use your user instead of myuser, but first, you should fork the from 
# https://bitbucket.org/mxperu/referencia


git remote add origin https://myuser@bitbucket.org/manuelloayza/referencia.git
git checkout -b clientes upstream/clientes

bower cache clean
cd ../..     # you will be in the client folder
yarn    # you could use also --->  npm install or npm i


## here bower because of the new angular 1.6.0, you migth select angular 1.5.X and of the prompt asks you, type 1! or 1

bower install   
grunt sass
grunt serve --dev=local

# moving to referencia folder
cd wwwroot/referencia/
yarn   # npm i or npm install
bower cache clean
bower install

# getting mock server 
cd referenciaAPI
yarn # npm i or npm install
cd ..

#starting the app
npm start   // or npm run start

or 

npm run startw  // if you are on windows systems


## It will start an HTTP server and the sails server, and open a browser with the following URL:

http://localhost:8080/referencia/#/

```

## Starting the server without ghost mode and with compression


```
#!javascript

npm run serve
```



## Building the for Production

```
#!javascript

npm run dist

```

## Building the for QA

```
#!javascript

npm run 215

npm run 216

```


## Troubleshooting:

 - GIT ERROR: The remote end hung up unexpectedly
  

```
#!javascript

    git config --global http.postBuffer 157286400
 
```

  
 - Get this repo as submodule of oim_common_fe repo

 - Only if you enable HTTPS connection in Sails, install the SSL certificate for it by opening this URL with your browser and install the associated certificate to this site
  
   https://localhost:12000/
   
 - Install globally (with npm i -g): bower, grunt-cli, gulp-cli, sails, nodemon, concurrently.

  
```
#!javascript

 npm i -g bower gulp-cli grunt-cli nodemon concurrently sails 
```


 - Optional: Install Yarn if you want to use it.

  https://yarnpkg.com/en/docs/install
  
  * For MAC: Execute the next commands in the console
  
  

```
#!javascript

  brew update
  brew install yarn

```

### Updating Thrid party Libraries

If you are updating the project run:

```
#!javascript

	npm i
	bower update    #  (do it for oim_common_fe/client and oim_common_fe/client/wwwroot/referencia folders)
```

## Bumping at new version

After merging the feature branch into master we have to bump the version of master(patch, minor, or major)


```
#!javascript

	npm run patch      # minor and mayor also are available
	git push upstream master
	git push upstream --tags

```

Next, update the file app.tpl to have the same version in the package.json (replace X.Y.Z with the current version)
```
#!javascript

      var appMainState = {
        name: 'referencia',
        abstract: true,
        url: '/referencia',
        data: {
          version: 'X.Y.Z'
        },
```

Finally, create a commit with this message and push it

```
#!javascript

git commit -m "chore(version): bumping to version X.Y.Z"
git push upstream master

```


## Creating a Branch to Merge the Feature Branch into the Master branch

```
#!javascript

git fetch upstream
git checkout -b FtNameToMaster featureBranch
git rebase -i upstream/master   
    # here select pick for all the commits, except for the 1st one. Or you
    # can choose other options:
    # Commands:
    #  p, pick = use commit
    #  r, reword = use commit, but edit the commit message
    #  e, edit = use commit, but stop for amending
    #  s, squash = use commit, but meld into previous commit
    #  f, fixup = like "squash", but discard this commit's log message
    #  x, exec = run command (the rest of the line) using shell

git commit --amend        #only if you'd like to update the commit message
git push origin FtNameToMaster

```

Next, you have to create the PR to merge this new branch in the Master branch.
