chatApp.controller('ChatController', ['$scope',	'$location', 'Chat', 'ChatService', 'MessageObserver', 'WolframAlpha',
	/**
	 * @class ChatController
	 * @param {$scope}			$scope
	 * @param {$location}		$location
	 * @param {ChatService}		ChatService
	 * @param {MessageObserver}	MessageObserver
	 * @param {WolframAlpha}	WolframAlpha
	 */
	function ChatController($scope, $location, Chat, ChatService, MessageObserver, WolframAlpha) {

		// Authenticated?
		if (!ChatService.authenticatedUser)
			return $location.path("/login");

		$scope.currentUser = ChatService.authenticatedUser;
		$scope.users = [];
		$scope.chats = [];
		$scope.selectedChat = null;
		$scope.selectedUser = null;
		$scope.allNewMessages = null;

		$scope.wolframAlphaStarted = false;

		/**
		 * @method selectUser
		 * @param  {[type]} user
		 * @return {[type]}
		 */
		$scope.selectUser = function (user) {
			$scope.selectedUser = user;
			$scope.selectedChat = $scope.openChat($scope.currentUser, user);
		};

		$scope.$watch('users', function() {
			var allNewMessages = [];

			_.each($scope.users, function(user) {
				if (_.isArray(user.newMessages))
					allNewMessages = allNewMessages.concat(user.newMessages);
			});

			$scope.allNewMessages = allNewMessages.length > 0 ? allNewMessages : null;
		}, true);

		$scope.openChat = function (sender, recipient) {

			if (!sender || !recipient)
				return null;

			var chat = $scope.findChat(sender, recipient);

			// Create a new chat if it doesn't exist
			if (!chat) {
				chat = new Chat(sender, recipient);

				chat.startListening();

				$scope.chats.push(chat);
			}

			// Reset user's new messsages list
			chat.recipient.newMessages = null;

			$scope.selectedChat = chat;

			return chat;
		};

		$scope.closeChat = function (chat) {
			$scope.chats = _.without($scope.chats, chat);

			chat.stopListening();

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

			$scope.text = '';
		};

		$scope.toggleMute = function (user) {
			var chat = $scope.findChat($scope.currentUser, user);

			if (user.muted) {
				chat.startListening();
			} else {
				chat.stopListening();
			}

			user.muted = !user.muted;
		};

		$scope.findUser = function (name) {
			var user = _.find($scope.users, function (user) { return user.name === name; });

			// HACK: add user if it is not known
			if (!user) {
				user = { name : name };
				addUser(user);
			}

			return user;
		};

		$scope.findChat = function (sender, recipient) {
			return _.find($scope.chats, function (chat) { return chat.sender === sender && chat.recipient === recipient; });
		};

		$scope.logout = function () {
			destroy();

			$location.path("/login");
		};

		function addUser(user) {
			user.isCurrentUser = $scope.currentUser.name === user.name;
			$scope.users.push(user);
		}

		function recieveMessage(message) {

			console.log('New message recieved from ' + message.sender);

			var sender = $scope.findUser(message.sender),
				selectedUser = $scope.selectedUser;

			// Muted
			if (sender.muted) {
				console.log('Message ignored, because ' +  message.sender + ' is muted');
				return;
			}

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
					MessageObserver.subscribe(this, undefined, $scope.currentUser.name, recieveMessage);
				});

			MessageObserver.start();
		}

		function destroy() {

			MessageObserver.stop();

			WolframAlpha.stop();

			// Close all chats
			_.each($scope.chats, function (chat) { $scope.closeChat(chat); });

			// Unsubscribe
			MessageObserver.unsubscribe(this, undefined, $scope.currentUser.name);

			ChatService.logout();
		}

		init();
    }
]);