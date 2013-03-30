chatApp.controller('LoginController',
	function LoginController($scope, $location, $routeParams, ChatService) {
		$scope.username = ''; // TODO: retrieve from local storage?
		$scope.serviceUrl = 'http://luminisjschallenge-server.azurewebsites.net/';

		$scope.login = function() {
			ChatService.rootUrl = $scope.serviceUrl;

			ChatService
				.login($scope.username)
				.then(
					// success
					function() {
						$location.path("/");
					},
					// error
					function(err) {
						$scope.error = err;
					});
		};
	}
);