import angular from 'angular';
import uiRouter from 'angular-ui-router';

// Import our app config files
// import constants  from './config/app.constants';
// import appConfig  from './config/app.config';
// import appRun     from './config/app.run';

import home from './home/home.component';

// Import our templates file (generated by Gulp)
import './config/app.templates';

// Import our app functionaity

// Create and bootstrap application
const requires = [
    uiRouter,
    'templates',
    home
];

// Mount on window for testing
window.app = angular.module('app', requires);

// angular.module('app').constant('AppConstants', constants);

// angular.module('app').config(appConfig);

// angular.module('app').run(appRun);

// angular.bootstrap(document, ['app'], {
//     strictDi: true
// });