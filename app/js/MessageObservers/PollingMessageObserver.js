chatApp.factory('PollingMessageObserver', ['ChatService',
	function PollingMessageObserver (ChatService) {

		var started = false;

		var observer = {
				subscriptions : [],

				start : function () {
					started = true; observe();
				},

				stop : function () {
					started = false;
				},

				subscribe : function (subscriber, sender, recipient, callback) {
					var subscription = createSubscription(subscriber, sender, recipient, callback);
					this.subscriptions.push(subscription);

					// Force once for current subscription
					observe(subscription, true);

					return subscription;
				},

				unsubscribe : function (subscriber, sender, recipient) {
					var subscription = createSubscription(subscriber, sender, recipient);
					this.subscriptions =
						_.reject(this.subscriptions, function (other) {
							return  subscription.subscriber === other.subscriber &&
									subscription.sender === other.sender &&
									subscription.recipient === other.recipient;
						});
				}
			};

		function createSubscription(subscriber, sender, recipient, callback) {
			return {
				subscriber : subscriber,
				sender : sender,
				recipient : recipient,
				callback : callback,
				observed : []
			};
		}

		function observe(subscription, observeOnce) {
			var subscriptions = subscription ? [subscription] : observer.subscriptions,
				recipients = _.pluck(subscriptions, 'recipient');

			// iterate over each unique recipient to minimize server calls
			_.each(_.uniq(recipients), function (recipient) {
				// Retrieve all messages sent to recipient
				ChatService.getMessages(recipient)
					.success(function (messages) {
						// Filter all subscriptions matching current recipient
						var matchingSubscriptions = _.filter(subscriptions, function (subscription) { return subscription.recipient === recipient; });

						_.each(matchingSubscriptions, function (subscription) {
							_.each(messages, function (message) {

								// No callback on messages allready observed
								if (_.contains(subscription.observed, message.id)) {
									return;
								}

								// Callback only on messages sent by sender
								if (!subscription.sender || message.sender === subscription.sender) {
									subscription.observed.push(message.id);
									subscription.callback(message);
								}
							});
						});
					});
			});

			if (!observeOnce && started)
				setTimeout(observe, 5000);
		}

		return observer;
	}
]);