var chatApp =
	angular.module('chatApp', []);

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
chatApp.filter('truncate', function () {
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

// Add a filter for formatting dates
chatApp.filter('formatdate', ['dateFilter', function (dateFilter) {
    return function (text, format) {
		return dateFilter(new Date(text), format);
    };
}]);

chatApp.directive('scrollIf', function () {
	return function (scope, element, attributes) {
		setTimeout(function () {
			if (scope.$eval(attributes.scrollIf)) {
				window.scrollTo(0, element[0].offsetTop - 100);
			}
		});
	};
});