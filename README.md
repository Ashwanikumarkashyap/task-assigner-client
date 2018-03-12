# Gharwale (Progressive Web Application)

A simple task assigner for the members of the family, "Because every household has it's GharkeKaam".

## Features

* A user can edit/delete/assign a task to a specific person or collectively to a group of people.
* User can register themselves with a username, password and a secret (GharkaSecret) known to the admin of the household.
* Assigned task can be marked as done/not done only by the assigner or the assignees of the task.
* Assigned taks are categorised under three sections: 
    * All tasks
        * Finished
        * Unfinished
    * Assigned to me
        * Finished
        * Unfinished
    * Assigned by me
        * Finished
        * Unfinished
* Assigned task includes:
    * Required
        * Title (unique)
    * Optional
        * Description (default: blank)
        * Priority (default: 3)
        * Assinged to (defalut: none)
    * Default and ca'nt be changed
        * Author (default: assigner)
        * created at (default: create date)
        * updated at (default: last updated date)
* Notification count of the freshly assigned tasks to a specific user as well to the whole family is shown whenever the user logs in.

## How to configure

* Setup the host server from 'https://github.com/Ashwanikumarkashyap/gharwale-server'.
* Change the base url in 'src/app/shared/baseurl.ts' with the server's base URL.
* run command `npm install` from the terminal in the root directory of the project (make sure node is already installed on the machine).
* Run `ng serve --open`.

## Framework and plugins
* Angular -v 5.2.0, AngularCli -v 1.6.5, flex-layout -v 2.0.0-beta.12, Angular Material Design -v 2.0.0-beta.12

## PWA plugin

* Node module SWPrechacheWebpackplugin is used in order to serve the application as PWA.
* For further details visit `https://houssein.me/progressive-angular-applications`.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).