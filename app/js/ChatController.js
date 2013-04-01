chatApp.controller('ChatController', ['$scope',	'$location', 'ChatService', 'MessagesObserver', 'WolframAlpha',
	/**
	 * @class ChatController
	 * @param {$scope} $scope
	 * @param {$location} $location
	 * @param {ChatService} ChatService
	 * @param {MessagesObserver} MessagesObserver
	 * @param {WolframAlpha} WolframAlpha
	 */
	function ChatController($scope, $location, ChatService, MessagesObserver, WolframAlpha) {

		// Authenticated?
		if (!ChatService.authenticatedUser)
			return $location.path("/login");

		$scope.currentUser = ChatService.authenticatedUser;
		$scope.users = [];
		$scope.chats = [];
		$scope.selectedChat = null;
		$scope.selectedUser = null;

		/**
		 * @method selectUser
		 * @param  {[type]} user
		 * @return {[type]}
		 */
		$scope.selectUser = function (user) {
			$scope.selectedUser = user;
			$scope.selectedChat = $scope.openChat($scope.currentUser, user);
		};

		$scope.openChat = function (sender, recipient) {

			if (!sender || !recipient || recipient.muted)
				return null;

			var chat = $scope.findChat(sender, recipient);

			// Create a new chat if it doesn't exist
			if (!chat) {
				chat = {
					sender : sender,
					recipient : recipient,
					messages : [],
					lastMessageReceived : null,
					recieveMessage : function (message) {
						console.log('Chat recieves message: ' + message.id);

						var lastMessage = _.last(chat.messages);

						// First message or newest message
						if (chat.messages.length === 0 || lastMessage.id < message.id) {
							chat.messages.push(message);
							return;
						}

						// Ensure messages are sorted chronological
						for (var i = 0; i < chat.messages.length; i++) {
							var currentMessage = chat.messages[i];

							// Allready got the message
							if (currentMessage.id === message.id)
								return;

							if (message.id < currentMessage.id) {
								// Add message before currentMessage
								chat.messages.splice(i, 0, message);
								return;
							}
						}
					}
				};

				// Subscribe to messages observer
				MessagesObserver.subscribe(chat, chat.recipient.name, chat.sender.name, chat.recieveMessage);
				MessagesObserver.subscribe(chat, chat.sender.name, chat.recipient.name, chat.recieveMessage);

				$scope.chats.push(chat);
			}

			// Reset user's new messsages list
			chat.recipient.newMessages = null;

			$scope.selectedChat = chat;

			return chat;
		};

		$scope.closeChat = function (chat) {
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

		$scope.sendMessage = function (chat, text) {
			if (!chat)
				return;

			ChatService.sendMessage(chat.sender.name, chat.recipient.name, text);
		};

		$scope.toggleMute = function (user) {
			var chat = $scope.findChat($scope.currentUser, user);

			user.muted = !user.muted;

			// if user gets muted, close its chat
			if (user.muted && chat) {
				$scope.closeChat(chat);
			}
		};

		$scope.findUser = function (name) {
			return _.find($scope.users, function (user) { return user.name === name; });
		};

		$scope.findChat = function (sender, recipient) {
			return _.find($scope.chats, function (chat) { return chat.sender === sender && chat.recipient === recipient; });
		};

		$scope.logout = function () {

			destroy();

			$location.path("/login");
		};

		function addUser(user) {
			$scope.users.push(user);
		}

		function recieveMessage(message) {
			var sender = $scope.findUser(message.sender),
				selectedUser = $scope.selectedUser;

			// If message is new, add it to the user's newMessages
			if (!sender.lastMessageReceived || sender.lastMessageReceived.id < message.id) {

				// Only update newMessages when sender is not selectedUser
				if (!selectedUser || sender.name !== selectedUser.name) {

					if (!sender.newMessages)
						sender.newMessages = [];

					sender.newMessages.push(message);
				}

				// Update 
				sender.lastMessageReceived = message;
			}
		}

		function init() {

			WolframAlpha.start();

			ChatService.getUsers()
				.success(function (users) {
					_.each(users, addUser);

					// Subscribe to messages observer
					MessagesObserver.subscribe(this, undefined, $scope.currentUser.name, recieveMessage);
				});
		}

		function destroy() {

			WolframAlpha.stop();

			// Close all chats
			_.each($scope.chats, function (chat) { $scope.closeChat(chat); });

			// Unsubscribe
			MessagesObserver.unsubscribe(this, undefined, $scope.currentUser.name);

			ChatService.logout();
		}

		init();
    }
]);