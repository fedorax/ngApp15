import angular from 'angular';

let homeModule = angular.module('home', [])
    .component('home', {
        templateUrl: 'home/home.template.html'
    }).name;

export default homeModule;