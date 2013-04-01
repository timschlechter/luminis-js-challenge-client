var chatApp =
	angular.module('chatApp', [
		'filters'
	]);

// Routes
chatApp.config(
	function ($routeProvider) {
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
chatApp.config(['$httpProvider', function ($httpProvider) {
	delete $httpProvider.defaults.headers.common["X-Requested-With"];
}]);

// Add a filter for truncating text
angular.module('filters', []).
    filter('truncate', function () {
        return function (text, length) {
            if (!text)
                return;

            if (isNaN(length))
                length = 10;

            var end = "...";

            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length-end.length) + end;
            }
        };
});