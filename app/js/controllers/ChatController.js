chatApp.controller('ChatController',
	function ChatController($scope, $location, $routeParams, ChatService) {

		// Authenticated?
		if (!ChatService.isAuthenticated())
			$location.path("/login");

		$scope.user = null;
		$scope.users = [];
		$scope.chats = {};

		$scope.connect = function() {
			$scope.refreshUsers();
		};

		$scope.refreshUsers = function() {
			ChatService
				.getUsers()
				.success(function(users) {
					$scope.users = users;
				})
				.error(function(err) {
					console.log(err);
				});
		};

		$scope.refreshMessages = function(chat) {
			ChatService
				.getMessages(chat.user.name)
				.success(function(messages) {
					chat.messages = messages;
				});
		};

		$scope.selectUser = function(user) {
			_.each($scope.users, function(user) { user.selected = false; });
			user.selected = true;

			$scope.openChat(user);
		};

		$scope.openChat = function(user) {
			if (!$scope.chats[user.name])
				$scope.chats[user.name] = { user : user };

			var chat = $scope.chats[user.name];

			$scope.refreshMessages(chat);
		};

		$scope.closeChat = function(chat) {
			delete $scope.chats[chat.user.name];
		};

		$scope.connect();
    }
);