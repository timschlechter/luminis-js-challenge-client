chatApp.controller('UserListController',
    function UserListController($scope, $routeParams, ChatService) {

		$scope.users = [];

		refreshUsers = function() {
			ChatService
				.getUsers()
				.success(function(users) {
					$scope.users = users;
				});
		};

		 $scope.openChat = function(user) {
			console.log(user);
		};

		refreshUsers();
    }
);