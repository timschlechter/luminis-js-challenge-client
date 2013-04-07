chatApp.factory('Chat', ['MessageObserver',
	function (MessageObserver) {

		function Chat (sender, recipient) {
			this.sender = sender;
			this.recipient = recipient;
			this.messages = [];
			this.lastMessageReceived = null;
			this.listening = false;
		}

		Chat.prototype.constructor = Chat;

		Chat.prototype.recieveMessage = function(message) {

			console.log('Chat[' + this.recipient.name + '] recieves message from ' + message.sender + ': ' + message.content);

			var lastMessage = _.last(this.messages);

			// First message or newest message
			if (this.messages.length === 0 || lastMessage.id < message.id) {
				this.messages.push(message);
			} else {
				// Ensure messages are sorted chronological
				for (var i = 0; i < this.messages.length; i++) {
					var currentMessage = this.messages[i];

					// Allready got the message
					if (currentMessage.id === message.id)
						return;

					if (message.id < currentMessage.id) {
						// Add message before currentMessage
						this.messages.splice(i, 0, message);
						return;
					}
				}
			}
		};

		Chat.prototype.startListening = function() {
			if (this.listening)
				return;

			MessageObserver.subscribe(this, this.recipient.name, this.sender.name, this.recieveMessage);
			MessageObserver.subscribe(this, this.sender.name, this.recipient.name, this.recieveMessage);
		};

		Chat.prototype.stopListening = function() {
			if (!this.listening)
				return;

			MessageObserver.unsubscribe(this, this.recipient.name, $scope.currentUser.name);
			MessageObserver.unsubscribe(this, $scope.currentUser.name, this.recipient.name);
		};

		return Chat;
	}
]);