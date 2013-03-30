var chatApp =
	angular.module('chatApp', [
		'filters'
	]);

// Routes
chatApp.config(
	function($routeProvider) {
		$routeProvider.
			when('/', {
				controller: 'ChatController',
				templateUrl: 'views/Chat.html'
			}).
			when('/login', {
				controller: 'LoginController',
				templateUrl: 'views/Login.html'
			})
			.otherwise({redirectTo: '/'});
	}
);

// Workaround to allow Cross Domain Request from localhost
chatApp.config(['$httpProvider', function($httpProvider) {
	delete $httpProvider.defaults.headers.common["X-Requested-With"];
}]);