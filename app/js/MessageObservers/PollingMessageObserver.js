chatApp.factory('PollingMessageObserver', ['ChatService',
	function (ChatService) {

		function PollingMessageObserver () {
			this.started = false;
			this.subscriptions = [];
		}

		PollingMessageObserver.prototype.constructor = PollingMessageObserver;

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
			var observer = this,
				subscriptions = subscription ? [subscription] : observer.subscriptions,
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

			if (!observeOnce && this.started)
				setTimeout(function() {
					observe.apply(observer);
				}, 5000);
		}

		PollingMessageObserver.prototype.start = function () {
			started = true; observe();
		};

		PollingMessageObserver.prototype.start = function () {
			started = true; observe();
		};

		PollingMessageObserver.prototype.stop = function () {
			started = false;
		};

		PollingMessageObserver.prototype.subscribe = function (subscriber, sender, recipient, callback) {
			var subscription = createSubscription(subscriber, sender, recipient, callback);
			this.subscriptions.push(subscription);

			// Force once for current subscription
			observe.apply(this, subscription, true);

			return subscription;
		};

		PollingMessageObserver.prototype.unsubscribe = function (subscriber, sender, recipient) {
			var subscription = createSubscription(subscriber, sender, recipient);
			this.subscriptions =
				_.reject(this.subscriptions, function (other) {
					return  subscription.subscriber === other.subscriber &&
							subscription.sender === other.sender &&
							subscription.recipient === other.recipient;
				});
		};

		return PollingMessageObserver;
	}
]);