chatApp.controller('ChatController',
    function ChatController($scope, $routeParams, ChatService) {

		$scope.users = [];
		$scope.messages = [];

		refreshUsers = function() {
			ChatService
				.getUsers()
				.success(function(users) {
					$scope.users = users;
				});
		};

		refreshUsers();
    }
);