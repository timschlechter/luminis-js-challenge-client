var chatApp = angular.module('chatApp', ['ngResource']);

chatApp.chatServiceUrl = 'http://luminisjschallenge.herokuapp.com/';

// Routes
chatApp.config(function($routeProvider) {

  $routeProvider.
      when('/', {
        controller: 'ChatController',
        templateUrl: 'views/Chat.html'
      });
});

// Workaround to allow Cross Domain Request
chatApp.config(['$httpProvider', function($httpProvider) {
	delete $httpProvider.defaults.headers.common["X-Requested-With"];
}]);