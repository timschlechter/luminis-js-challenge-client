chatApp.controller('ChatController', ['$scope',	'$location', 'ChatService', 'MessagesObserver',
	function ($scope, $location, ChatService, MessagesObserver) {

		// Authenticated?
		if (!ChatService.authenticatedUser)
			return $location.path("/login");

		$scope.currentUser = ChatService.authenticatedUser;
		$scope.users = [];
		$scope.chats = [];
		$scope.selectedChat = null;
		$scope.selectedUser = null;

		$scope.selectUser = function(user) {
			$scope.selectedUser = user;
			$scope.selectedChat = $scope.openChat($scope.currentUser, user);
		};

		$scope.openChat = function(sender, recipient) {

			if (!sender || !recipient || recipient.muted)
				return null;

			var chat = $scope.findChat(sender, recipient);

			// Create a new chat if it doesn't exist
			if (!chat) {
				chat = {
					sender : sender,
					recipient : recipient,
					messages : [],
					addMessage : function(message) {
						var lastMessage = _.last(chat.messages);

						// First message or newest message
						if (!lastMessage || lastMessage.id < message.id) {
							chat.messages.push(message);
							return;
						}

						// Ensure messages are sorted chronological
						for (var i = chat.messages.length - 1; i >= 0; i--) {
							var currentMessage = chat.messages[i];

							// Allready got the message
							if (currentMessage.id === message.id)
								return;

							// Add message before currentMessage
							if (currentMessage.id < message.id) {
								chat.message.splice(i, 0, message);
								return;
							}
						}
					}
				};

				// Subscribe to messages observer
				MessagesObserver.subscribe(chat, chat.recipient.name, chat.sender.name, chat.addMessage);
				MessagesObserver.subscribe(chat, chat.sender.name, chat.recipient.name, chat.addMessage);

				$scope.chats.push(chat);
			}

			$scope.selectedChat = chat;

			return chat;
		};

		$scope.closeChat = function(chat) {
			$scope.chats = _.without($scope.chats, chat);

			// Unsubscribe from messages observer
			MessagesObserver.unsubscribe(chat, chat.recipient.name, $scope.currentUser.name);
			MessagesObserver.unsubscribe(chat, $scope.currentUser.name, chat.recipient.name);

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

			ChatService.sendMessage(chat.recipient, text);
		};

		$scope.toggleMute = function(user) {
			user.muted = !user.muted;

			// if user gets muted, close its chat
			if (user.muted) {
				$scope.closeChat($scope.findChat($scope.currentUser, user));
			}
		};

		$scope.logout = function() {
			ChatService.logout();
			$location.path("/login");
		};

		$scope.findChat = function(sender, recipient) {
			return _.find($scope.chats, function(chat) { return chat.sender === sender && chat.recipient === recipient; });
		};

		function refreshUsers() {
			ChatService.getUsers()
				.success(function(users) {
					$scope.users = _.filter(users, function(user) { return user.name !== $scope.currentUser.name; });
				});
		}

		refreshUsers();
    }
]);