chatApp.controller('LoginController',
	function LoginController($scope, $location, $routeParams, ChatService) {

		$scope.serviceUrl = 'http://luminisjschallenge-server.azurewebsites.net/';
		$scope.services = [
				'http://luminisjschallenge-server.azurewebsites.net/',
				'http://luminisjschallenge.herokuapp.com/',
				'http://planetmarrs.xs4all.nl:8787/server/'
			];

		$scope.username = 'Tim'; // TODO: retrieve from local storage?


		$scope.selectService = function(service) {
			$scope.serviceUrl = service;
		};

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

		$scope.login();
	}
);