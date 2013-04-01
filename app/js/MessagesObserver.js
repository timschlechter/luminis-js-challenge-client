chatApp.factory('MessagesObserver', ['ChatService',
	function (ChatService) {

		var observer = {
			subscriptions : [],

			subscribe : function(subscriber, sender, recipient, callback) {
				var subscription = createSubscription(subscriber, sender, recipient, callback);
				this.subscriptions.push(subscription);
			},

			unsubscribe : function(subscriber, sender, recipient) {
				var subscription = createSubscription(subscriber, sender, recipient);
				this.subscriptions =
					_.reject(this.subscriptions, function(other) {
						return subscription.equals(other);
					});
			}
		};

		function createSubscription(subscriber, sender, recipient, callback) {
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

		function observe() {
			var recipients = _.pluck(observer.subscriptions, 'recipient');

			// iterate over each unique recipient to minimize server calls
			_.each(_.uniq(recipients), function(recipient) {
				// Retrieve all messages sent to recipient
				ChatService.getMessages(recipient)
					.success(function(messages) {
						// Filter all subscriptions matching current recipient
						var matchingSubscriptions = _.filter(observer.subscriptions, function (subscription) { return subscription.recipient === recipient; });

						_.each(matchingSubscriptions, function (subscription) {
							_.each(messages, function (message) {
								// Callback only on messages sent by sender
								if (message.sender === subscription.sender)
									subscription.callback(message);
							});
						});
					});
			});

			setTimeout(observe, 2000);
		}

		// Start observing
		observe();

		return observer;
	}
]);