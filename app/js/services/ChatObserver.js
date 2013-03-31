chatApp.factory('ChatObserver', ['ChatService',
	function (ChatService) {

		function messageReceivedSubscription(subscriber, sender, recipient, callback) {
			return {
				subscriber : subscriber,
				sender : sender,
				recipient : recipient,
				callback : callback,
				equals : function(other) {
					return	this.subscriber === other.subscriber &&
							this.sender === other.sender &&
							this.recipient === other.recipient;
				}
			};
		}

		var observer = {

			observe : function() {
				observer.messageReceived.observe();

				setTimeout(observer.observe, 2000);
			},

			messageReceived : {
				subscriptions : [],

				subscribe : function(subscriber, sender, recipient, callback) {
					var subscription = messageReceivedSubscription(subscriber, sender, recipient, callback);
					this.subscriptions.push(subscription);
				},

				unsubscribe : function(subscriber, sender, recipient) {
					var subscription = messageReceivedSubscription(subscriber, sender, recipient);
					this.subscriptions =
						_.reject(this.subscriptions, function(other) {
							return subscription.equals(other);
						});
				},

				observe : function() {
					_.each(this.subscriptions, function(subscription) {
						// Retrieve all messages sent to recipient
						ChatService.getMessages(subscription.recipient)
							.success(function(messages) {
								_.each(messages, function(message) {
									// Callback only on messages sent by sender
									if (message.sender === subscription.sender)
										subscription.callback(message);
								});
							});
					});
				}
			}
		};

		observer.observe();

		return observer;
	}
]);