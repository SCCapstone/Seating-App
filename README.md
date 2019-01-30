# Seating App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.1.

## Local Development Server

Download the source by cloning this master branch.
Run `npm install` to install local and development dependencies.

Because we are running a MEAN stack application with a node and express server, we need to first build the angular application and then run the server using the built code provided by the angular CLI.

Run `ng build`, this will create the angular application within our backend server.

Start the node server with, `npm run start:server` which will serve the angular application after the node server is started.

To access this locally ran application, navigate to `localhost:3000` in your web browser.

## Testing

### Running Unit Tests (Karma & Jasmine via Angular CLI)

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running Behavior Tests (Selenium)



