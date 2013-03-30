chatApp.controller('ChatController',
	function ChatController($scope, $location, $routeParams, ChatService) {

		// Authenticated?
		if (!ChatService.isAuthenticated())
			$location.path("/login");

		$scope.users = [];
		$scope.chats = {};

		$scope.connect = function() {
			$scope.refreshUsers();
		};

		$scope.refreshUsers = function() {
			ChatService
				.getUsers()
				.success(function(users) {
					// Filter authenticated user
					$scope.users =
						_.filter(users, function(user) {
							// Not me
							return user.name !== ChatService.user.name;
						});
				})
				.error(function(err) {
					console.log(err);
				});
		};

		$scope.refreshMessages = function(chat) {
			ChatService
				.getMessages(chat.user.name)
				.success(function(messages) {
					chat.messages =
						_.filter(messages, function(message) {
							// Messages sent by me, or chat.user
							return message.sender === ChatService.user.name || message.sender === chat.user.name;
						});
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

		$scope.sendMessage = function(chat, text) {
			ChatService
				.sendMessage(chat.user, text)
				.success(function() {
					$scope.refreshMessages(chat);
				});
		};

		$scope.logout = function() {
			ChatService.logout();
			$location.path("/login");
		};

		$scope.connect();
    }
);