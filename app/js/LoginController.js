chatApp.controller('LoginController',
	function LoginController($scope, $location, $routeParams, ChatService) {

		$scope.serviceUrl = 'http://localhost:8080/';
		$scope.services = [
				'http://luminisjschallenge.herokuapp.com/',
				'http://planetmarrs.xs4all.nl:8787/server/',
				'http://luminisjschallenge-server.azurewebsites.net/',
				'http://localhost:8080/'
			];

		$scope.username = ''; // TODO: retrieve from local storage?

		$scope.selectService = function (service) {
			$scope.serviceUrl = service;
		};

		$scope.login = function (username) {
			ChatService.rootUrl = $scope.serviceUrl;

			ChatService
				.login(username || $scope.username)
				.then(
					// success
					function () {
						$location.path("/");
					},
					// error
					function (err) {
						$scope.error = err;
					});
		};

		//$scope.login('Tim');
	}
);