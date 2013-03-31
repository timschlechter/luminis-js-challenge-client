chatApp.controller('ChatController', ['$scope',	'$location', 'ChatService', 'ChatObserver',
	function ($scope, $location, ChatService, ChatObserver) {

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
					messages : [],
					addMessage : function(message) {
						var lastMessage = _.last(chat.messages);

						// First message or newest message
						if (!lastMessage || lastMessage.id < message.id) {
							chat.messages.push(message);
							return;
						}

						for (var i = chat.messages.length - 1; i >= 0; i--) {
							var currentMessage = chat.messages[i];

							// Allready got the message
							if (currentMessage.id === message.id)
								return;

							if (currentMessage < message.id) {
								chat.message.splice(i, 0, message);
								return;
							}
						}
					}
				};

				// Subscribe to messageReceived observer
				ChatObserver.messageReceived.subscribe(chat, chat.user.name, ChatService.user.name, chat.addMessage);
				ChatObserver.messageReceived.subscribe(chat, ChatService.user.name, chat.user.name, chat.addMessage);

				$scope.chats.push(chat);
			}

			$scope.selectedChat = chat;
		};

		$scope.closeChat = function(chat) {
			$scope.chats = _.without($scope.chats, chat);

			// Unsubscribe from messageReceived observer
			ChatObserver.messageReceived.unsubscribe(chat, chat.user.name, ChatService.user.name);
			ChatObserver.messageReceived.unsubscribe(chat, ChatService.user.name, chat.user.name);

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

			ChatService.sendMessage(chat.user, text);
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