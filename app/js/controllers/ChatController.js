chatApp.controller('ChatController', ['$scope',	'$location', 'ChatService',
	function ($scope, $location, ChatService) {

		// Authenticated?
		if (!ChatService.isAuthenticated())
			$location.path("/login");

		$scope.users = [];
		$scope.chats = [];
		$scope.selectedChat = null;
		$scope.selectedUser = null;

		$scope.selectUser = function(user) {
			$scope.selectedUser = user;

			if (user && !user.muted)
				$scope.openChat(user);

			$scope.selectedChat = $scope.findChat(user);
		};

		$scope.openChat = function(user) {

			var chat = $scope.findChat(user);

			// Create a new chat if it doesn't exist
			if (!chat) {
				chat = {
					user : user,

					// Refreshes the messages in this chat
					refreshMessages : function() {
						chat.messages = [];

						// Retrieve all message sent to chat.user
						ChatService.getMessages(chat.user.name)
							.success(function(messages) {
								// Add messages sent by me
								_.each(messages, function(message) {
									if (message.sender === ChatService.user.name)
										chat.messages.push(message);
								});
							});

						// Retrieve all message sent to me
						ChatService.getMessages(ChatService.user.name)
							.success(function(messages) {
								// Add messages sent by chat.user
								_.each(messages, function(message) {
									if (message.sender === chat.user.name)
										chat.messages.push(message);
								});
							});
					}
				};

				$scope.chats.push(chat);

				// Refresh messages
				chat.refreshMessages();
			}

			$scope.selectedChat = chat;
		};

		$scope.closeChat = function(chat) {
			$scope.chats = _.without($scope.chats, chat);

			if ($scope.selectedChat === chat) {
				// Set selection to first chat's user
				var firstChat = $scope.chats[0],
					user = firstChat ? firstChat.user : null;

				$scope.selectUser(user);
			}
		};

		$scope.sendMessage = function(chat, text) {
			if (!chat)
				return;

			ChatService.sendMessage(chat.user, text)
				.success(function() {
					chat.refreshMessages();
				});
		};

		$scope.toggleMute = function(user) {
			user.muted = !user.muted;

			// if user gets muted, close its chat
			if (user.muted) {
				$scope.closeChat($scope.findChat(user));
			}
		};

		$scope.logout = function() {
			ChatService.logout();
			$location.path("/login");
		};

		$scope.findChat = function(user) {
			return _.find($scope.chats, function(chat) { return chat.user === user; });
		};

		function refreshUsers() {
			ChatService.getUsers()
				.success(function(users) {
					$scope.users = _.filter(users, function(user) { return user.name !== ChatService.user.name; });
				});
		}

		refreshUsers();
    }
]);