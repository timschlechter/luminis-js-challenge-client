var chatApp = angular.module('chatApp', ['ngResource']);

chatApp.chatServiceUrl = 'http://planetmarrs.xs4all.nl:8787/server';

chatApp.config(function($routeProvider) {

  $routeProvider.
      when('/', {
        controller: 'UserListController',
        templateUrl: 'views/userlist.html'
      });
});