# Seating App - Capstone 2018

## Frameworks
- Angular v6.1.5

Documentation: https://angular.io/guide/architecture <br />
Angular "Cheat Sheet": https://angular.io/guide/cheatsheet

- Boostrap v4.1.3 CDN

Documentation: https://getbootstrap.com/docs/4.1/getting-started/introduction/

## Running App Locally
Prerequisites:
- Make sure to have npm installed.
- Run "npm install -g @angular/cli" without quotations to install Angular CLI globally on your machine.

If this is your first time:
- Download master source folder from GitHub.

Otherwise just pull current `/src` folder from GitHub (unless new dependencies have been added to the source)

1.  Once you have the current copy of the repository, open your command prompt and navigate to the folders location on your desktop.
2.  Type in the command `ng serve -o` and this will open a local webpage with our app. <br />
>The app will automatically reload if you change source files (Once file is saved). <br />
>To Exit the process, press `Ctrl + C` then type Y and Enter on Windows CMD (`Ctrl + C` will work with most other CMD's). <br />
3.  Once your done editing your files, and checks are made, commit and push to GitHub.

## File Structure

```
/Seating-App-master
  /dist
  /e2e
  /node_modules
  /src
```

### /dist

Folder created and populated when the command `ng build` is ran.  This builds the application into a compressed version avaliable to be placed onto a live server.

### /e2e

Used by Angular for core struture.

### /node_modules

Contains all core files / components / frameworks we are currently using to produce this web app.  This contains folders like Angulars core and MySQL core, along with a bunch of utilities.  This folder should not be changed unless new dependencies are added.  If new dependencies are added, all group mates should be notified to update.

### /src

Most important folder because it contains our app. <br />

```
/src
  /app
  /assets
  /enviroments
```

## Creating New Components

** Work in progress ** <br />
Run `ng generate component component-name` to generate a new component. <br />
You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`. <br />

## Building App for Production

** Work in progress ** <br />
Run `ng build` to build the project. <br />
The build artifacts will be stored in the `dist/` directory. <br />
Use the `--prod` flag for a production build. <br />

## Running Unit Tests

** Work in progress ** <br />
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running End-to-End Tests

** Work in progress ** <br />
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).