# Seating App - Capstone 2018

## Live View
http://ec2-34-229-41-198.compute-1.amazonaws.com
>Last Updated: September 1, 2018

## Frameworks
- Angular v6.1.5

Documentation: https://angular.io/guide/architecture <br />

Angular "Cheat Sheet": https://angular.io/guide/cheatsheet <br />

- Boostrap v4.1.3 CDN

Documentation: https://getbootstrap.com/docs/4.1/getting-started/introduction/

## Running App Locally
<h4>Prerequisites:</h4>

- Make sure to have NPM installed. <br />

>If not, the link is: https://www.npmjs.com/get-npm .<br />

- Must have Git installed. <br />

>GitHub Desktop application works great for fetching and pushing to and from origin.  Keeps your local repository updated. <br />

<h4>If this is your first time:</h4>

1. Run `npm install -g @angular/cli` to install Angular CLI globally on your machine. <br />

2. Download source from GitHub. <br />

- Navigate to the folder where you want to clone the repo. <br />
- Run `git clone https://github.com/SCCapstone/Seating-App.git` to clone our repo. <br />

3. Run `npm install` to install local dependecies defined in the package-lock.json file. <br />

>This creates your `node_modules/` directory.  If dependencies are added, group mates should be informed to update their local repositories. <br />

<h4>Otherwise:</h4>

1. Navigate to your local source folder in the command prompt. <br />

2. Use `git fetch` or the GitHub Desktop application to make sure your repo matches our GitHub. <br />

3. Type in the command `ng serve -o` and this will open a local webpage with our app. <br />

>The app will automatically reload if you change source files (Once file is saved). <br />

>To Exit the process, press `Ctrl + C` then type Y and Enter on Windows CMD (`Ctrl + C` will work with most other CMD's). <br />

4.  Once your done editing your files, and checks are made, commit and push to GitHub. <br />

## File Structure

Before `npm install` is ran, this will be what your source looks like.

```
/Seating-App
  /e2e
  /src
```

After `npm install` is ran, our dependencies will be installed into a folder called `node_modules/` and should look like...

```
/Seating-App
  /e2e
  /node_modules
  /src
```

<h3>/e2e</h3>

Used by Angular for core struture.

<h3>/node_modules</h3>

Contains all core files / components / frameworks we are currently using to produce this web app.  This contains folders like Angulars core and MySQL core, along with a bunch of utilities.  This folder should not be changed unless new dependencies are added.  If new dependencies are added, all group mates should be notified to update.

<h3>/src</h3>

Most important folder because it contains our app.

```
/src
  /app
    /login                  (Login Component folder)
    /example*               (Example component folder)
    app-routing.module.ts   (Routing component)
    app.component.html      (Main App html)
    app.component.scss      (Main App scss)
    app.component.spec.ts
    app.component.ts
    app.module.ts
  /assets
  /enviroments
  index.html
  styles.scss
  ...
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
